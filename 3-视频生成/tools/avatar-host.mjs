// 数字人主持人：准备素材 → （Claude 通过 Topview MCP 上传、生成）→ 下载入库。
// 生成这一步走 Topview MCP（OAuth 登录，没有 API Key），不在本脚本里；完整流程见 AGENTS.md「数字人主持人」。
//
// 用法（npm run host -- <命令> ...）：
//   frames <视频> [--out 目录]      从用户视频里每隔一段抽一帧，拼成带时间的预览图，用来挑正脸帧
//   prep <项目> (--image 照片 | --video 视频 [--at 秒])
//               (--audio 音频 | --text "文稿或 .txt" [--voice 冰糖] [--style "语气"] | --audio-from-video)
//                                   生成 public/<项目>/host/face.png 和 voice.mp3，并写 job.json
//   put <本地文件> <上传URL>         把文件 PUT 到 Topview 的临时上传地址（不打印地址）
//   save <项目> (<视频URL> | --file 本地mp4) [--task id] [--mode avatar4] [--credits 1]
//                                   下载生成结果，转成 1920×1080 / 30fps 的 host.mp4，并记入素材库

import { existsSync } from "node:fs";
import { mkdir, readFile, rm, writeFile } from "node:fs/promises";
import { spawnSync } from "node:child_process";
import { tmpdir } from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";

// 跨步骤共用的配音工具和素材库在仓库根目录的 shared/ 下
const SHARED = fileURLToPath(new URL("../../shared/", import.meta.url));

function fail(msg) {
  console.error("✖ " + msg);
  process.exit(1);
}

const today = () => new Date().toISOString().slice(0, 10);

function parseArgs(argv) {
  const opts = {};
  const positional = [];
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (!a.startsWith("--")) positional.push(a);
    else if (i + 1 < argv.length && !argv[i + 1].startsWith("--")) opts[a.slice(2)] = argv[++i];
    else opts[a.slice(2)] = true;
  }
  return { opts, positional };
}

function run(cmd, args) {
  const r = spawnSync(cmd, args, { encoding: "utf8" });
  if (r.status !== 0) fail(`${cmd} 失败：${(r.stderr || r.stdout || "").trim().split("\n").slice(-3).join(" ")}`);
  return r.stdout;
}

const ffmpeg = (args) => run("ffmpeg", ["-v", "error", "-y", ...args]);

function probe(file) {
  const out = run("ffprobe", [
    "-v", "error", "-show_entries", "format=duration:stream=codec_type,width,height",
    "-of", "json", file,
  ]);
  const j = JSON.parse(out);
  const v = j.streams.find((s) => s.codec_type === "video");
  return {
    duration: Number(j.format.duration),
    width: v?.width,
    height: v?.height,
    hasAudio: j.streams.some((s) => s.codec_type === "audio"),
  };
}

function need(file, what) {
  if (!file || file === true) fail(`缺少${what}`);
  if (!existsSync(file)) fail(`找不到${what}：${file}`);
  return file;
}

const hostDir = (project) => path.posix.join("public", project, "host");
const jobPath = (project) => path.posix.join(hostDir(project), "job.json");

async function loadJob(project) {
  return existsSync(jobPath(project)) ? JSON.parse(await readFile(jobPath(project), "utf8")) : { project };
}

async function saveJob(job) {
  await writeFile(jobPath(job.project), JSON.stringify(job, null, 2) + "\n", "utf8");
}

// ---------- frames：挑正脸帧 ----------

async function cmdFrames(positional, opts) {
  const video = need(positional[0], "视频");
  const { duration } = probe(video);
  const n = 12;
  const out = opts.out && opts.out !== true ? opts.out : path.join(tmpdir(), "avatar-host-frames");
  await mkdir(out, { recursive: true });
  const step = duration / n;
  // Windows 上 FFmpeg 没有 fontconfig 配置，drawtext 必须直接指定字体文件
  const font = process.platform === "win32" ? "fontfile='C\\:/Windows/Fonts/arial.ttf':" : "";
  const list = [];
  for (let i = 0; i < n; i++) {
    const t = +(step * (i + 0.5)).toFixed(1);
    const f = path.join(out, `f${String(i).padStart(2, "0")}.jpg`);
    ffmpeg([
      "-ss", String(t), "-i", video, "-frames:v", "1",
      "-vf", `scale=480:-2,drawtext=${font}text='${t}s':x=10:y=10:fontsize=28:fontcolor=white:box=1:boxcolor=black@0.6`,
      f,
    ]);
    list.push(f);
  }
  const sheet = path.join(out, "frames.jpg");
  ffmpeg([...list.flatMap((f) => ["-i", f]), "-filter_complex", `${list.map((_, i) => `[${i}]`).join("")}xstack=inputs=${n}:grid=4x3`, sheet]);
  console.log(`✔ 预览图：${sheet}（视频 ${duration.toFixed(1)} 秒，每格左上角是时间）`);
  console.log("  挑一帧：正脸、眼睛看镜头、嘴巴闭合或微张、脸没有被手或头发挡住，然后 prep --video ... --at <秒>");
}

// ---------- prep：人像 + 配音 ----------

async function cmdPrep(positional, opts) {
  const project = positional[0];
  if (!project) fail("用法：npm run host -- prep <项目> (--image 照片 | --video 视频 [--at 秒]) (--audio 音频 | --text 文稿 | --audio-from-video)");
  const dir = hostDir(project);
  await mkdir(dir, { recursive: true });
  const job = await loadJob(project);
  const face = path.posix.join(dir, "face.png");
  const voice = path.posix.join(dir, "voice.mp3");

  // 人像：照片直接转 png；视频按 --at 抽一帧（默认第 1 秒）
  if (opts.image) {
    const src = need(opts.image, "照片");
    if (path.resolve(src) !== path.resolve(face)) ffmpeg(["-i", src, "-frames:v", "1", face]);
    job.face = { file: face, from: "image", source: src };
  } else if (opts.video) {
    const src = need(opts.video, "视频");
    const at = opts.at && opts.at !== true ? Number(opts.at) : 1;
    ffmpeg(["-ss", String(at), "-i", src, "-frames:v", "1", face]);
    job.face = { file: face, from: "video", source: src, at };
  } else if (!job.face) {
    fail("缺少人像：--image 照片 或 --video 视频");
  }
  const { width, height } = probe(job.face.file);
  job.face.size = `${width}x${height}`;
  if (Math.min(width, height) < 720) console.warn(`⚠ 人像只有 ${width}×${height}，短边低于 720，生成的画面可能发糊`);

  // 配音：给音频就转码；给文稿就用 MiMo 合成；也可以直接用视频原声
  if (opts.audio) {
    const src = need(opts.audio, "音频");
    ffmpeg(["-i", src, "-vn", "-c:a", "libmp3lame", "-b:a", "192k", voice]);
    job.voice = { file: voice, from: "audio", source: src };
  } else if (opts["audio-from-video"]) {
    const src = need(opts.video, "视频（--audio-from-video 需要同时给 --video）");
    if (!probe(src).hasAudio) fail("这个视频没有音轨");
    ffmpeg(["-i", src, "-vn", "-c:a", "libmp3lame", "-b:a", "192k", voice]);
    job.voice = { file: voice, from: "video", source: src };
  } else if (opts.text) {
    const args = [path.join(SHARED, "tools", "tts-mimo.mjs"), opts.text, voice, "--voice", opts.voice && opts.voice !== true ? opts.voice : "冰糖"];
    if (opts.style && opts.style !== true) args.push("--style", opts.style);
    const r = spawnSync(process.execPath, args, { stdio: "inherit" });
    if (r.status !== 0) fail("MiMo 配音失败（Bash 里读不到 MIMO_API_KEY 时见 AGENTS.md）");
    job.voice = { file: voice, from: "tts", voice: args[4], text: opts.text };
  } else if (!job.voice) {
    fail("缺少配音：--audio 音频、--text 文稿 或 --audio-from-video");
  }
  job.voice.duration = +probe(job.voice.file).duration.toFixed(2);
  job.status = "prepared";
  job.updated = today();
  await saveJob(job);

  console.log(`✔ 人像：${job.face.file}（${job.face.size}）`);
  console.log(`✔ 配音：${job.voice.file}（${job.voice.duration} 秒）`);
  console.log(`✔ 任务记录：${jobPath(project)}`);
  console.log("  下一步（Claude 用 Topview MCP）：ta_upload_credential 拿 png、mp3 上传地址 → npm run host -- put 上传 →");
  console.log("  ta_upload_check_file → topview_avatar_video（scriptMode=audio）→ topview_query_task → npm run host -- save");
}

// ---------- put：上传到 Topview ----------

async function cmdPut(positional) {
  const [file, url] = positional;
  need(file, "要上传的文件");
  if (!url || !/^https:\/\//.test(url)) fail("缺少上传地址（ta_upload_credential 返回的 uploadUrl）");
  const res = await fetch(url, { method: "PUT", body: await readFile(file) });
  if (!res.ok) fail(`上传失败：HTTP ${res.status}`);
  console.log(`✔ 已上传：${file}`);
}

// ---------- save：下载结果并入库 ----------

async function cmdSave(positional, opts) {
  const [project, url] = positional;
  if (!project || (!url && !opts.file)) fail("用法：npm run host -- save <项目> <视频URL> | --file 本地mp4");
  const dir = hostDir(project);
  await mkdir(dir, { recursive: true });
  const job = await loadJob(project);

  let raw = opts.file && opts.file !== true ? need(opts.file, "本地视频") : null;
  if (!raw) {
    raw = path.join(tmpdir(), `avatar-host-${Date.now()}.mp4`);
    const res = await fetch(url);
    if (!res.ok) fail(`下载失败：HTTP ${res.status}（链接可能已过期，用 topview_query_task 重新取）`);
    await writeFile(raw, Buffer.from(await res.arrayBuffer()));
  }
  const src = probe(raw);

  // Topview 的结果尺寸不一定规整（例如 1934×1080 / 25fps），统一裁成 1920×1080 / 30fps，保留原声
  const out = path.posix.join(dir, "host.mp4");
  ffmpeg([
    "-i", raw,
    "-vf", "scale=1920:1080:force_original_aspect_ratio=increase,crop=1920:1080,fps=30",
    "-c:v", "libx264", "-crf", "18", "-preset", "medium", "-g", "15", "-pix_fmt", "yuv420p",
    "-c:a", "aac", "-b:a", "192k", out,
  ]);
  if (!opts.file || opts.file === true) await rm(raw, { force: true });
  const dst = probe(out);

  job.result = {
    file: out,
    staticFile: `${project}/host/host.mp4`,
    duration: +dst.duration.toFixed(2),
    frames30: Math.round(dst.duration * 30),
    original: `${src.width}x${src.height}`,
    mode: opts.mode && opts.mode !== true ? opts.mode : "avatar4",
    task: opts.task && opts.task !== true ? opts.task : null,
    credits: opts.credits && opts.credits !== true ? Number(opts.credits) : null,
  };
  job.status = "done";
  job.updated = today();
  await saveJob(job);

  // 素材库：生成内容记 license=generated，记下人像和配音来源，方便以后复用或重做
  const db = path.join(SHARED, "asset-library", "assets.json");
  const assets = JSON.parse(await readFile(db, "utf8"));
  const id = `gen-host-${project}`;
  const record = {
    id,
    type: "video",
    status: "available",
    title: "",
    title_zh: `${project} 数字人主持人口播`,
    url: "",
    platform: "generated",
    owner: `topview ${job.result.mode}`,
    official: false,
    license: "generated",
    published: today(),
    duration: job.result.duration,
    domain: [],
    shot: ["人物采访"],
    tags: ["数字人", "主持人"],
    windows: [],
    used_in: [{ project, file: out, date: today() }],
    notes: [
      `人像来自${job.face?.from === "video" ? `视频 ${job.face.at}s 帧` : "照片"}`,
      `配音来自${{ audio: "用户录音", video: "视频原声", tts: `MiMo ${job.voice?.voice}` }[job.voice?.from] ?? "未知"}`,
      job.result.credits != null ? `消耗 ${job.result.credits} 积分` : null,
      job.result.task ? `Topview 任务 ${job.result.task}` : null,
    ].filter(Boolean).join("；"),
    local_path: out,
    found_for: [project],
    added: today(),
  };
  const i = assets.findIndex((a) => a.id === id);
  if (i >= 0) assets[i] = { ...assets[i], ...record, added: assets[i].added };
  else assets.push(record);
  assets.sort((a, b) => a.id.localeCompare(b.id));
  await writeFile(db, JSON.stringify(assets, null, 2) + "\n", "utf8");

  console.log(`✔ 已保存：${out}（${job.result.duration} 秒，${job.result.frames30} 帧 @30fps，原始 ${job.result.original}）`);
  console.log(`✔ 素材库：${id}`);
  if (job.voice?.duration && Math.abs(job.voice.duration - job.result.duration) > 0.5) {
    console.warn(`⚠ 视频时长和配音（${job.voice.duration} 秒）相差超过 0.5 秒，检查是否被截断`);
  }
}

const [cmd, ...rest] = process.argv.slice(2);
const { opts, positional } = parseArgs(rest);
const commands = { frames: cmdFrames, prep: cmdPrep, put: cmdPut, save: cmdSave };
if (!commands[cmd]) fail("命令：frames / prep / put / save（说明见文件开头）");
await commands[cmd](positional, opts);
