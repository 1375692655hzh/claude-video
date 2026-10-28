// 素材库工具：只记录素材的来源链接、可用片段和分类，不保存原文件。
// 数据：asset-library/assets.json；分类与同义词：asset-library/taxonomy.json；缩略图：asset-library/thumbs/
//
// 用法（npm run assets -- <命令> ...）：
//   search <关键词...> [--domain 半导体] [--shot 产品特写] [--type video] [--all]
//                                   按关键词 / 分类找素材（关键词走同义词表）；默认不显示不可用的
//   show <id>                       查看一条素材的完整记录
//   import <grok.json> [--project p] 导入 Grok 返回的候选 JSON（按链接去重）
//   verify [id...] [--all|--unverified]
//                                   核实链接是否可用，并补全标题、频道、时长、发布日期
//   thumbs [id...] [--missing]      生成关键帧缩略图（视频只读取几帧，不下载整片）
//   reject <id> --reason "原因"     标记为不可用（保留记录，下次不再重复核实）
//   use <id> --project p --window 205-226 [--desc "说明"] [--file public/...]
//                                   回填实际用过的片段
//   fetch <id> --window 205-226 --out public/<项目>/video/x.mp4 [--keep-audio]
//                                   只下载这一段并转成 Remotion 用的 1080p H.264
//
// YouTube cookies：环境变量 YT_COOKIES，未设置时用"下载"文件夹里最新的 www.youtube.com_cookies*.txt。

import { existsSync, readdirSync, statSync } from "node:fs";
import { mkdir, readFile, rm, writeFile } from "node:fs/promises";
import { spawnSync } from "node:child_process";
import { tmpdir } from "node:os";
import path from "node:path";

const LIB = path.resolve("asset-library");
const DB = path.join(LIB, "assets.json");
const THUMBS = path.join(LIB, "thumbs");
const taxonomy = JSON.parse(await readFile(path.join(LIB, "taxonomy.json"), "utf8"));

function fail(msg) {
  console.error("✖ " + msg);
  process.exit(1);
}

const today = () => new Date().toISOString().slice(0, 10);

// ---------- 数据读写 ----------

async function load() {
  return existsSync(DB) ? JSON.parse(await readFile(DB, "utf8")) : [];
}

async function save(assets) {
  assets.sort((a, b) => a.id.localeCompare(b.id));
  await writeFile(DB, JSON.stringify(assets, null, 2) + "\n", "utf8");
}

function find(assets, id) {
  const a = assets.find((x) => x.id === id);
  if (!a) fail(`找不到素材：${id}`);
  return a;
}

// ---------- 链接与时间 ----------

function youtubeId(url) {
  return (url.match(/(?:v=|youtu\.be\/|shorts\/)([A-Za-z0-9_-]{11})/) || [])[1] || null;
}

function idForUrl(url) {
  const yt = youtubeId(url);
  if (yt) return `yt-${yt}`;
  const x = url.match(/(?:x|twitter)\.com\/[^/]+\/status\/(\d+)/);
  if (x) return `x-${x[1]}`;
  const u = new URL(url);
  const base = path.basename(u.pathname).replace(/\.[a-z0-9]+$/i, "");
  return `web-${u.hostname.replace(/^www\./, "").split(".")[0]}-${base}`
    .toLowerCase()
    .replace(/[^a-z0-9-]+/g, "-")
    .slice(0, 60);
}

function platformOf(url) {
  if (youtubeId(url)) return "youtube";
  if (/(?:x|twitter)\.com\//.test(url)) return "x";
  return "web";
}

// "01:08" / "68" / "1:02:03" → 秒
function toSec(s) {
  return String(s)
    .trim()
    .split(":")
    .reduce((acc, p) => acc * 60 + Number(p), 0);
}

const fmt = (total) => {
  const s = Math.round(total * 10) / 10;
  const sec = s % 60;
  const secStr = sec % 1 ? sec.toFixed(1).padStart(4, "0") : String(sec).padStart(2, "0");
  return `${String(Math.floor(s / 60)).padStart(2, "0")}:${secStr}`;
};

// "00:25-01:08 Ironwood 概览; 01:08-01:44 机柜" → [{start,end,desc}]
function parseWindows(text) {
  if (!text || /unknown/i.test(text)) return [];
  return text
    .split(/[;；]/)
    .map((part) => part.trim().match(/^([\d:.]+)\s*[-–~]\s*([\d:.]+)\s*(.*)$/))
    .filter(Boolean)
    .map(([, a, b, desc]) => ({ start: toSec(a), end: toSec(b), desc: desc.trim() }));
}

// ---------- 外部程序 ----------

function bin(name) {
  const which = spawnSync("where", [name], { encoding: "utf8" });
  if (which.status === 0) return name;
  const winget = path.join(process.env.LOCALAPPDATA || "", "Microsoft", "WinGet", "Links", `${name}.exe`);
  if (existsSync(winget)) return winget;
  fail(`找不到 ${name}，请先安装（见 AGENTS.md）`);
}

function cookies() {
  if (process.env.YT_COOKIES && existsSync(process.env.YT_COOKIES)) return process.env.YT_COOKIES;
  const dir = path.join(process.env.USERPROFILE || "", "Downloads");
  if (!existsSync(dir)) return null;
  const files = readdirSync(dir)
    .filter((f) => /^www\.youtube\.com_cookies.*\.txt$/.test(f))
    .map((f) => path.join(dir, f))
    .sort((a, b) => statSync(b).mtimeMs - statSync(a).mtimeMs);
  return files[0] || null;
}

// YouTube 对短时间内的密集请求很敏感，会要求"验证不是机器人"并连带封掉当前 cookies。
// 所以每次调用之间至少间隔 YT_GAP_MS，yt-dlp 内部请求之间也加停顿；一旦被拦就停止整批任务。
const YT_GAP_MS = 8000;
let lastYt = 0;
const BOT_RE = /not a bot|Sign in to confirm/i;

function sleep(ms) {
  if (ms > 0) Atomics.wait(new Int32Array(new SharedArrayBuffer(4)), 0, 0, ms);
}

function ytdlp(args) {
  sleep(lastYt + YT_GAP_MS - Date.now());
  const c = cookies();
  const r = spawnSync(
    bin("yt-dlp"),
    [...(c ? ["--cookies", c] : []), "--socket-timeout", "20", "--sleep-requests", "1.5", ...args],
    { encoding: "utf8", maxBuffer: 64 * 1024 * 1024 },
  );
  lastYt = Date.now();
  const err = (r.stderr || "").trim();
  return { ok: r.status === 0, out: r.stdout.trim(), err, bot: BOT_RE.test(err) };
}

function stopOnBot() {
  console.log(
    "\n⛔ YouTube 要求验证\"不是机器人\"，已停止本批任务，避免当前 cookies 被进一步标记。\n" +
      "   先等至少 1 小时再试；仍不行就用无痕窗口重新导出 cookies（见 AGENTS.md）。",
  );
}

function ffmpeg(args) {
  const r = spawnSync(bin("ffmpeg"), ["-v", "error", "-y", ...args], { encoding: "utf8" });
  if (r.status !== 0) throw new Error(r.stderr.trim().split("\n").pop());
}

// ---------- 参数 ----------

function parseArgs(argv) {
  const flags = {};
  const pos = [];
  for (let i = 0; i < argv.length; i++) {
    if (argv[i].startsWith("--")) {
      const k = argv[i].slice(2);
      const next = argv[i + 1];
      if (next === undefined || next.startsWith("--")) flags[k] = true;
      else flags[k] = argv[++i];
    } else pos.push(argv[i]);
  }
  return { flags, pos };
}

// "205-226" / "03:25-03:46" → {start,end}
function parseWindowFlag(flag) {
  if (!flag || flag === true) return null;
  const [a, b] = String(flag).split("-");
  return { start: toSec(a), end: toSec(b) };
}

// ---------- 命令 ----------

// 关键词 → 同义词展开
function expand(word) {
  const w = word.toLowerCase();
  const out = new Set([w]);
  for (const [canon, aliases] of Object.entries(taxonomy.synonyms)) {
    const all = [canon, ...aliases].map((s) => s.toLowerCase());
    if (all.some((s) => s === w || s.includes(w) || w.includes(s))) all.forEach((s) => out.add(s));
  }
  return [...out];
}

function haystack(a) {
  return [
    a.title,
    a.title_zh,
    a.owner,
    a.notes,
    ...(a.tags || []),
    ...(a.domain || []),
    ...(a.shot || []),
    ...(a.windows || []).map((w) => w.desc),
  ]
    .filter(Boolean)
    .join(" ")
    .toLowerCase();
}

function printAsset(a) {
  const flag = a.status === "available" ? "✓" : a.status === "unavailable" ? "✗" : "?";
  console.log(`\n${flag} ${a.id}  [${a.type}] ${a.title_zh || a.title || ""}`);
  console.log(`   ${a.url || a.local_path}`);
  const meta = [a.owner, a.official ? "官方" : null, a.license, a.published && `发布 ${a.published}`, a.duration && `${fmt(a.duration)}`]
    .filter(Boolean)
    .join(" · ");
  if (meta) console.log(`   ${meta}`);
  console.log(`   领域：${(a.domain || []).join("、")}  镜头：${(a.shot || []).join("、")}  标签：${(a.tags || []).join("、")}`);
  for (const w of a.windows || []) {
    console.log(`   ${w.source === "used" ? "★已用" : w.source === "checked" ? "◎已看" : "·猜测"} ${fmt(w.start)}-${fmt(w.end)} ${w.desc || ""}`);
  }
  if (a.status === "unavailable") console.log(`   不可用：${a.status_reason || ""}`);
  if (a.thumb) console.log(`   缩略图：asset-library/${a.thumb}`);
}

const commands = {
  async search({ pos, flags }) {
    const assets = await load();
    const groups = pos.map(expand);
    const hits = assets.filter((a) => {
      if (!flags.all && a.status === "unavailable") return false;
      if (flags.domain && !(a.domain || []).includes(flags.domain)) return false;
      if (flags.shot && !(a.shot || []).includes(flags.shot)) return false;
      if (flags.type && a.type !== flags.type) return false;
      const h = haystack(a);
      return groups.every((g) => g.some((w) => h.includes(w)));
    });
    // 实际用过的排前面
    hits.sort((a, b) => (b.used_in?.length || 0) - (a.used_in?.length || 0));
    hits.forEach(printAsset);
    console.log(`\n共 ${hits.length} 条`);
  },

  async show({ pos }) {
    const assets = await load();
    console.log(JSON.stringify(find(assets, pos[0]), null, 2));
  },

  async import({ pos, flags }) {
    const raw = await readFile(pos[0], "utf8");
    const list = JSON.parse(raw.slice(raw.indexOf("["), raw.lastIndexOf("]") + 1));
    const assets = await load();
    let added = 0;
    for (const c of list) {
      if (!c.url) continue;
      const id = idForUrl(c.url);
      let a = assets.find((x) => x.id === id);
      const windows = parseWindows(c.timestamps).map((w) => ({ ...w, source: "grok" }));
      if (a) {
        // 已有记录：只补充新的猜测片段和标签
        for (const w of windows) {
          if (!a.windows.some((x) => x.start === w.start && x.end === w.end)) a.windows.push(w);
        }
        a.tags = [...new Set([...(a.tags || []), ...(c.tags || [])])];
        continue;
      }
      a = {
        id,
        type: c.type || (platformOf(c.url) === "x" ? "post" : /\.(jpe?g|png|webp)(\?|$)/i.test(c.url) ? "image" : "video"),
        status: "unverified",
        title: c.title || "",
        title_zh: c.title_zh || "",
        url: c.url,
        platform: platformOf(c.url),
        owner: c.channel || c.owner || "",
        official: !!c.official,
        license: c.license || (c.official ? "official-press" : "youtube-standard"),
        published: c.published || "",
        duration: null,
        domain: c.domain || [],
        shot: c.shot || [],
        tags: c.tags || [],
        windows,
        used_in: [],
        notes: c.notes || "",
        found_for: flags.project ? [flags.project] : [],
        added: today(),
      };
      assets.push(a);
      added++;
    }
    await save(assets);
    console.log(`✔ 导入 ${list.length} 条候选，新增 ${added} 条（其余已在库中）`);
  },

  async verify({ pos, flags }) {
    const assets = await load();
    const targets = pos.length
      ? pos.map((id) => find(assets, id))
      : assets.filter((a) => (flags.all ? a.url : flags.unverified ? a.status === "unverified" && a.url : false));
    if (!targets.length) fail("请指定 id，或用 --all / --unverified");
    for (const a of targets) {
      if (a.platform === "youtube" || a.platform === "x") {
        const r = ytdlp(["--skip-download", "--no-warnings", "--print", "%(title)s\t%(uploader)s\t%(duration)s\t%(upload_date)s", a.url]);
        if (r.ok) {
          const [title, uploader, dur, date] = r.out.split("\n").pop().split("\t");
          a.title ||= title;
          a.owner ||= uploader;
          a.duration = Number(dur) || a.duration;
          if (date && date !== "NA") a.published = `${date.slice(0, 4)}-${date.slice(4, 6)}-${date.slice(6, 8)}`;
          a.status = "available";
          delete a.status_reason;
        } else {
          if (r.bot) {
            stopOnBot();
            break;
          }
          const reason = (r.err.match(/ERROR: (.*)/) || [, r.err.slice(-200)])[1];
          a.status = "unavailable";
          a.status_reason = reason.replace(/^\[\w+\] [\w-]+: /, "").split(/\. /)[0];
        }
      } else {
        const res = await fetch(a.url, { method: "GET", headers: { "User-Agent": "Mozilla/5.0" } }).catch((e) => ({ ok: false, status: e.message }));
        a.status = res.ok ? "available" : "unavailable";
        if (!res.ok) a.status_reason = `HTTP ${res.status}`;
        else delete a.status_reason;
      }
      a.verified = today();
      console.log(`${a.status === "available" ? "✓" : "✗"} ${a.id}  ${a.title || ""}${a.status_reason ? "  —  " + a.status_reason : ""}`);
    }
    await save(assets);
  },

  async thumbs({ pos, flags }) {
    const assets = await load();
    const targets = pos.length
      ? pos.map((id) => find(assets, id))
      : assets.filter((a) => a.status === "available" && (flags.missing ? !a.thumb : true));
    await mkdir(THUMBS, { recursive: true });
    for (const a of targets) {
      const out = path.join(THUMBS, `${a.id}.jpg`);
      try {
        if (a.type === "video") {
          // 有已用 / 已看片段就取片段中点，否则在全片均匀取 4 帧
          const marks = (a.windows || []).filter((w) => w.source !== "grok").map((w) => (w.start + w.end) / 2);
          const dur = a.duration || 60;
          const pts = (marks.length ? marks : [0.15, 0.38, 0.62, 0.85].map((p) => p * dur)).slice(0, 4);
          const tmp = path.join(tmpdir(), `thumb-${a.id}`);
          await mkdir(tmp, { recursive: true });
          // 一次 yt-dlp 调用下载 4 个 1 秒的低清片段（ffmpeg 直接读 YouTube 视频流常被 403）
          const r = ytdlp([
            "-f",
            "bv*[height<=360][vcodec^=avc1]/bv*[height<=360]/wv*",
            ...pts.flatMap((t) => ["--download-sections", `*${t.toFixed(1)}-${(t + 1).toFixed(1)}`]),
            "--ffmpeg-location",
            bin("ffmpeg"),
            "-o",
            path.join(tmp, "%(section_start)s.%(ext)s"),
            a.url,
          ]);
          if (r.bot) {
            stopOnBot();
            break;
          }
          if (!r.ok) throw new Error(r.err.split("\n").pop());
          const clips = readdirSync(tmp).sort((x, y) => parseFloat(x) - parseFloat(y));
          clips.forEach((f, i) => ffmpeg(["-i", path.join(tmp, f), "-frames:v", "1", "-vf", "scale=320:-2", path.join(tmp, `${i}.jpg`)]));
          const inputs = clips.flatMap((_, i) => ["-i", path.join(tmp, `${i}.jpg`)]);
          if (!clips.length) throw new Error("没有下载到片段");
          const stack = clips.length > 1 ? ["-filter_complex", `${clips.map((_, i) => `[${i}]`).join("")}hstack=inputs=${clips.length}`] : [];
          ffmpeg([...inputs, ...stack, "-q:v", "5", out]);
          await rm(tmp, { recursive: true, force: true });
        } else {
          let src = a.local_path ? path.resolve(a.local_path) : null;
          if (!src) {
            // 先下载到临时文件：有的图片链接里带冒号等字符，ffmpeg 直接读远程会失败
            const res = await fetch(a.url, { headers: { "User-Agent": "Mozilla/5.0" } });
            if (!res.ok) throw new Error(`HTTP ${res.status}`);
            src = path.join(tmpdir(), `thumb-src-${a.id}`);
            await writeFile(src, Buffer.from(await res.arrayBuffer()));
          }
          ffmpeg(["-i", src, "-vf", "scale=480:-2", "-frames:v", "1", "-q:v", "5", out]);
          if (!a.local_path) await rm(src, { force: true });
        }
        a.thumb = `thumbs/${a.id}.jpg`;
        console.log(`✓ ${a.id}`);
      } catch (e) {
        console.log(`✗ ${a.id}：${e.message}`);
      }
    }
    await save(assets);
  },

  async reject({ pos, flags }) {
    const assets = await load();
    const a = find(assets, pos[0]);
    a.status = "unavailable";
    a.status_reason = flags.reason || "人工排除";
    a.verified = today();
    await save(assets);
    console.log(`✔ 已标记不可用：${a.id}`);
  },

  async use({ pos, flags }) {
    const assets = await load();
    const a = find(assets, pos[0]);
    if (!flags.project) fail("请用 --project 指定项目");
    const w = parseWindowFlag(flags.window);
    if (w) {
      const desc = flags.desc || "";
      const exist = a.windows.find((x) => x.start === w.start && x.end === w.end);
      if (exist) Object.assign(exist, { source: "used", desc: desc || exist.desc });
      else a.windows.push({ ...w, desc, source: "used" });
    }
    a.used_in.push({ project: flags.project, ...(w || {}), ...(flags.file ? { file: flags.file } : {}), date: today() });
    await save(assets);
    console.log(`✔ 已记录：${a.id} 用于 ${flags.project}${w ? ` ${fmt(w.start)}-${fmt(w.end)}` : ""}`);
  },

  async fetch({ pos, flags }) {
    const assets = await load();
    const a = find(assets, pos[0]);
    const w = parseWindowFlag(flags.window);
    if (!w || !flags.out) fail("用法：fetch <id> --window 205-226 --out public/<项目>/video/x.mp4");
    const tmp = path.join(tmpdir(), `fetch-${a.id}-${Date.now()}`);
    await mkdir(tmp, { recursive: true });
    const r = ytdlp([
      "-f",
      "bv*[vcodec^=avc1][height<=1080]+ba/bv*[height<=1080]+ba/b",
      "--download-sections",
      `*${w.start}-${w.end}`,
      "--force-keyframes-at-cuts",
      "--merge-output-format",
      "mp4",
      "--ffmpeg-location",
      bin("ffmpeg"),
      "-o",
      path.join(tmp, "src.%(ext)s"),
      a.url,
    ]);
    if (!r.ok) fail(r.err.split("\n").pop());
    const src = path.join(tmp, readdirSync(tmp).find((f) => f.startsWith("src.")));
    const out = path.resolve(flags.out);
    await mkdir(path.dirname(out), { recursive: true });
    ffmpeg([
      "-i",
      src,
      ...(flags["keep-audio"] ? ["-c:a", "aac"] : ["-an"]),
      "-vf",
      "scale=1920:1080:force_original_aspect_ratio=increase,crop=1920:1080,fps=30",
      "-c:v",
      "libx264",
      "-preset",
      "medium",
      "-crf",
      "22",
      "-g",
      "15",
      "-pix_fmt",
      "yuv420p",
      out,
    ]);
    await rm(tmp, { recursive: true, force: true });
    console.log(`✔ 已保存：${path.relative(process.cwd(), out)}（${fmt(w.start)}-${fmt(w.end)}）。用完记得 use 回填。`);
  },
};

const [cmd, ...rest] = process.argv.slice(2);
if (!commands[cmd]) {
  console.log("可用命令：" + Object.keys(commands).join(" / ") + "（详见 tools/assets.mjs 顶部注释）");
  process.exit(cmd ? 1 : 0);
}
await commands[cmd](parseArgs(rest));
