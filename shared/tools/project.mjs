#!/usr/bin/env node
// 项目工具：每期视频一个独立项目目录 projects/YYYY/MM/<项目ID>/（无第三方依赖）。
//
//   project new <英文短名> [--date YYYY-MM-DD] [--persona Andy] [--platform youtube-long] [--fast]
//     --fast：FAST 模式（用户交付成稿 → 脚本 → 视频，零审核、不停顿，见 AGENTS.md「FAST 模式」）
//   project list                      新项目 + 旧期（旧期只读、标 legacy）
//   project status <ID>               进度、下一步、阻塞、各阶段文件
//   project check <ID> [--step N]     按当前步骤（或指定步骤）检查门禁，不通过时退出码 1
//   project set <ID> key=value ...    改 project.json：step / next / status / persona / platform / blocker=… / blockers=
//                                     finalConfirmed=true（用户确认成稿）/ adviceSkipped=true（用户决定跳过④）/ deliveredFinal
//   project final <ID> <成稿文件>      用户直接交付成稿：存为 01-视频稿/03-终稿-en.md，跳过④⑤到⑥
//   project paths <ID>                打印各阶段路径（新项目和旧期通用，供其他工具和 Claude 使用）
//   project studio <ID>               以本项目启动 Remotion Studio
//   project handoff <ID> list | new <H01…> --tool grok | send|done|close <编号>   外部交付提示词（模板在 shared/handoff/）
//   project render <ID> [--comp X] [--deliver youtube-long] [--preview [文件名]] [-- 其他 remotion 参数]
//                                     先自动跑第⑩步门禁，不通过拒绝渲染；--preview 不过门禁，只写到 05-制作/cache/preview/
//   project lint <ID>                 类型检查 + ESLint 本项目的 05-制作/remotion
//
// 进度只记在 project.json（唯一状态源）；00-项目设置.md 只写人设、平台等决定，不写进度。
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../..");
const PROJECTS = path.join(ROOT, "projects");
const ENGINE = path.join(ROOT, "3-视频生成");
const rel = (p) => path.relative(ROOT, p).split(path.sep).join("/");

const PLATFORMS = {
  "youtube-long": { label: "YouTube 长视频", spec: "youtube-long-en.md", w: 1920, h: 1080 },
  "youtube-shorts": { label: "YouTube Shorts", spec: "youtube-shorts-en.md", w: 1080, h: 1920 },
  "instagram-reels": { label: "Instagram Reels", spec: "instagram-reels-en.md", w: 1080, h: 1920 },
  tiktok: { label: "TikTok", spec: "tiktok-en.md", w: 1080, h: 1920 },
};
const STEPS = ["", "①选择人设", "②选择平台和视频方式", "③视频初稿", "④修改建议", "⑤视频成稿",
  "⑥脚本初稿", "⑦素材搜寻", "⑧素材补全", "⑨重新规划视频脚本", "⑩视频生成"];
const DIRS = ["01-视频稿", "02-脚本", "03-素材/原始", "03-素材/生产", "03-素材/refs", "04-音频/voice",
  "04-音频/host", "04-音频/mix", "05-制作/remotion", "05-制作/cache", "06-交付"];
const HANDOFF_DIR = "08-外部交付";
const HANDOFF_LIB = path.join(ROOT, "shared", "handoff");
const ID_RE = /^(\d{4})-(\d{2})-(\d{2})-([a-z0-9]+(?:-[a-z0-9]+)*)$/;
const LEGACY_RE = /^\d{4}-\d{2}-[a-z0-9]+(?:-[a-z0-9]+)*$/;
const PENDING_RE = /待找|候选未核实|未核实|待定片段/;
const IMG_RE = /\.(png|jpe?g|webp|gif)$/i;

const fail = (m) => { console.error(`✗ ${m}`); process.exit(1); };
const read = (f) => (fs.existsSync(f) ? fs.readFileSync(f, "utf8") : null);
const today = () => new Intl.DateTimeFormat("en-CA", { timeZone: "Asia/Shanghai" }).format(new Date());

function parseArgs(argv) {
  const pos = []; const flags = {}; let rest = [];
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (a === "--") { rest = argv.slice(i + 1); break; }
    if (a.startsWith("--")) {
      const k = a.slice(2);
      if (argv[i + 1] !== undefined && !argv[i + 1].startsWith("--")) flags[k] = argv[++i]; else flags[k] = true;
    } else pos.push(a);
  }
  return { pos, flags, rest };
}

// ---------- 路径解析：新项目和旧期统一 ----------
function resolve(id) {
  if (!id) fail("缺少项目 ID");
  const m = ID_RE.exec(id);
  if (m) {
    const dir = path.join(PROJECTS, m[1], m[2], id);
    if (!fs.existsSync(path.join(dir, "project.json"))) fail(`找不到项目 ${id}（应在 ${rel(dir)}/）`);
    const meta = JSON.parse(fs.readFileSync(path.join(dir, "project.json"), "utf8"));
    const j = (...p) => path.join(dir, ...p);
    return {
      id, kind: "project", dir, meta,
      settings: j("00-项目设置.md"), draft: j("01-视频稿", "01-初稿.md"), advice: j("01-视频稿", "02-外部建议.md"),
      finalEn: j("01-视频稿", "03-终稿-en.md"), finalZh: j("01-视频稿", "03-终稿.md"),
      scriptDraft: j("02-脚本", "script-draft.md"), assets: j("02-脚本", "assets.md"), script: j("02-脚本", "script.md"),
      handoff: j("02-脚本", "ClaudeChat生成交接.md"), raw: j("03-素材", "原始"), prod: j("03-素材", "生产"),
      refs: j("03-素材", "refs"), audio: j("04-音频"), remotion: j("05-制作", "remotion"), cache: j("05-制作", "cache"),
      deliver: j("06-交付"), review: j("07-复盘.md"),
    };
  }
  if (LEGACY_RE.test(id)) {
    const v = path.join(ROOT, "1-视频稿", id); const s = path.join(ROOT, "2-脚本", id);
    if (![v, s, path.join(ENGINE, "effects", id)].some((p) => fs.existsSync(p))) fail(`找不到旧期 ${id}`);
    return {
      id, kind: "legacy", dir: v, meta: null,
      settings: path.join(v, "00-项目设置.md"), draft: path.join(v, "01-初稿.md"), advice: path.join(v, "02-外部建议.md"),
      finalEn: path.join(v, "03-终稿-en.md"), finalZh: path.join(v, "03-终稿.md"),
      scriptDraft: path.join(s, "script-draft.md"), assets: path.join(s, "assets.md"), script: path.join(s, "script.md"),
      handoff: path.join(s, "ClaudeChat生成交接.md"), raw: path.join(s, "材料"), prod: path.join(ENGINE, "public", id),
      refs: path.join(s, "refs"), audio: path.join(ENGINE, "public", id), remotion: path.join(ENGINE, "effects", id),
      cache: null, deliver: path.join(ENGINE, "out"), review: path.join(v, "05-复盘.md"),
    };
  }
  fail(`项目 ID 格式不对：${id}（新项目 YYYY-MM-DD-短名；旧期 YYYY-MM-短名）`);
}

const saveMeta = (p) => fs.writeFileSync(path.join(p.dir, "project.json"), JSON.stringify(p.meta, null, 2) + "\n");

// ---------- new ----------
function cmdNew({ pos, flags }) {
  const short = pos[0];
  if (!short || !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(short)) fail("英文短名只能用小写字母、数字和连字符，例如 google-q3");
  const date = flags.date ?? today();
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) fail("--date 格式 YYYY-MM-DD");
  const platform = flags.platform ?? null;
  if (platform && !PLATFORMS[platform]) fail(`平台只能是 ${Object.keys(PLATFORMS).join(" / ")}`);
  const id = `${date}-${short}`;
  const [y, m] = date.split("-");
  const dir = path.join(PROJECTS, y, m, id);
  if (fs.existsSync(dir)) fail(`项目已存在，不覆盖：${rel(dir)}`);

  for (const d of DIRS) fs.mkdirSync(path.join(dir, d), { recursive: true });
  fs.mkdirSync(path.join(dir, HANDOFF_DIR), { recursive: true });
  const meta = {
    id, createdAt: date, persona: flags.persona ?? null, platform, deliveredFinal: false, finalConfirmed: false, adviceSkipped: false,
    step: 1, status: "active", next: "①选择人设：列出 1-视频稿/_人设/ 的预存人设，或整理新人设，等用户确认", blockers: [],
  };
  if (flags.fast) {
    Object.assign(meta, { mode: "fast", step: meta.persona && platform ? 3 : 1,
      next: meta.persona && platform ? `FAST：开工时一次让用户选风格和音色（style/voice.mjs use），收用户成稿 → project final ${id} <成稿文件>` : "FAST：补 --persona 和 --platform（set），再收用户成稿" });
  }
  fs.writeFileSync(path.join(dir, "project.json"), JSON.stringify(meta, null, 2) + "\n");

  // 项目设置：从模板生成，路径改成项目所在层级
  const up = "../../../../";
  let s = read(path.join(ROOT, "1-视频稿", "templates", "项目设置模板.md")) ?? "# <期名>｜项目设置\n";
  s = s.replaceAll("<期名>", id).replaceAll("../_人设/", `${up}1-视频稿/_人设/`).replaceAll("../platforms/", `${up}1-视频稿/platforms/`)
    .replace(/^- 状态：.*$/m, "- 状态：人设待确认 / 平台待确认 / 已确认（可进③）（只写设置是否确认；进度看 project.json / `npm run project -- status`）")
    .replace("<YYYY-MM-DD>", date);
  if (flags.persona) s = s.replace(/^- 人设名称：.*$/m, `- 人设名称：${flags.persona}`);
  if (platform) s = s.replace(/^- 平台：.*$/m, `- 平台：${PLATFORMS[platform].label}`)
    .replace(/^- 平台规范：.*$/m, `- 平台规范：\`${up}1-视频稿/platforms/${PLATFORMS[platform].spec}\``)
    .replace(/^- 画幅：.*$/m, `- 画幅：${PLATFORMS[platform].w > PLATFORMS[platform].h ? "16:9" : "9:16"}`);
  fs.writeFileSync(path.join(dir, "00-项目设置.md"), s);

  writeRemotionStub(dir, id, platform);
  console.log(`✓ 已创建 ${rel(dir)}/`);
  console.log(`  下一步：${meta.next}`);
}

function writeRemotionStub(dir, id, platform) {
  const pf = PLATFORMS[platform ?? "youtube-long"];
  const E = "../../../../../../3-视频生成";
  const tsconfig = {
    extends: `${E}/tsconfig.json`,
    compilerOptions: {
      typeRoots: [`${E}/node_modules/@types`],
      paths: { "@shared/*": [`${E}/effects/_shared/*`], "*": [`${E}/node_modules/@types/*`, `${E}/node_modules/*`] },
    },
    include: ["./**/*.ts", "./**/*.tsx"],
  };
  fs.writeFileSync(path.join(dir, "05-制作", "remotion", "tsconfig.json"), JSON.stringify(tsconfig, null, 2) + "\n");
  const comp = `// 本项目的 Remotion 入口：导出 ProjectCompositions，Composition id 用项目 ID。
// 引用方式（由 3-视频生成/remotion.config.ts 在项目模式下映射）：
//   公共库  import { Frame, MotionTheme } from "@shared/motion";  import { Bgm } from "@shared/Bgm";
//   素材    staticFile("assets/…")  → 03-素材/生产/…
//   音频    staticFile("audio/…")   → 04-音频/…
//   公共库文件 staticFile("library/…") → 3-视频生成/public/library/…（配乐、音效、字体）
import { AbsoluteFill, Composition } from "remotion";

const Placeholder: React.FC = () => (
  <AbsoluteFill style={{ background: "#0f172a", color: "white", justifyContent: "center", alignItems: "center", fontSize: 64 }}>
    ${id}
  </AbsoluteFill>
);

export const ProjectCompositions: React.FC = () => (
  <Composition id="${id}" component={Placeholder} durationInFrames={90} fps={30} width={${pf.w}} height={${pf.h}} />
);
`;
  fs.writeFileSync(path.join(dir, "05-制作", "remotion", "Composition.tsx"), comp);
}

// ---------- list ----------
function cmdList() {
  const rows = [];
  if (fs.existsSync(PROJECTS)) for (const y of fs.readdirSync(PROJECTS).filter((x) => /^\d{4}$/.test(x)).sort())
    for (const m of fs.readdirSync(path.join(PROJECTS, y)).sort())
      for (const id of fs.readdirSync(path.join(PROJECTS, y, m)).sort()) {
        const f = path.join(PROJECTS, y, m, id, "project.json");
        if (!fs.existsSync(f)) continue;
        const meta = JSON.parse(fs.readFileSync(f, "utf8"));
        rows.push(`${id.padEnd(36)} ${(STEPS[meta.step] ?? "?").padEnd(12)} ${meta.status.padEnd(8)} ${meta.platform ?? "平台未定"}`);
      }
  console.log(rows.length ? rows.join("\n") : "（还没有新项目）");
  const legacy = new Set();
  for (const d of [path.join(ROOT, "1-视频稿"), path.join(ROOT, "2-脚本")])
    if (fs.existsSync(d)) for (const n of fs.readdirSync(d)) if (LEGACY_RE.test(n)) legacy.add(n);
  if (legacy.size) console.log(`\n旧期（legacy，走原三目录路径）：\n${[...legacy].sort().map((x) => "  " + x).join("\n")}`);
}

// ---------- check ----------
function statusLine(text) { return /^- 状态[:：]\s*(.+)$/m.exec(text ?? "")?.[1]?.trim() ?? ""; }
// 模板的状态行列出全部选项（用 " / " 分隔），只有删到剩一个选项才算选定
const confirmed = (st, re) => !st.includes(" / ") && re.test(st);
function field(text, name) { return new RegExp(`^- ${name}[:：]\\s*(.+)$`, "m").exec(text ?? "")?.[1]?.trim() ?? ""; }

function openAssetRows(text) {
  const sec = /## 素材总表([\s\S]*?)(\n## |$)/.exec(text ?? "")?.[1] ?? "";
  return sec.split("\n").filter((l) => l.trim().startsWith("|")).slice(2)
    .map((l) => l.split("|").map((c) => c.trim()).filter((_, i, a) => i > 0 && i < a.length - 1))
    .filter((cells) => cells.length && PENDING_RE.test(cells[cells.length - 1]) && !/关闭|已排除/.test(cells[cells.length - 1]))
    .map((cells) => `${cells[0] || "?"}（${cells[cells.length - 1]}）`);
}

function walk(dir, out = []) {
  if (!fs.existsSync(dir)) return out;
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const f = path.join(dir, e.name);
    if (e.isDirectory()) { if (!["cache", "node_modules"].includes(e.name)) walk(f, out); }
    else if (/\.(md|ts|tsx|json|txt)$/.test(e.name)) out.push(f);
  }
  return out;
}

function check(p, stepOverride) {
  const res = []; const ok = (m) => res.push(["ok", m]); const warn = (m) => res.push(["warn", m]); const err = (m) => res.push(["err", m]);
  if (p.kind === "legacy") {
    for (const [k, f] of [["成稿", p.finalEn], ["脚本成稿", p.script], ["动画", p.remotion]]) (fs.existsSync(f) ? ok : warn)(`旧期${k}：${rel(f)}`);
    return res;
  }
  const step = Number(stepOverride ?? p.meta.step);
  for (const d of DIRS) if (!fs.existsSync(path.join(p.dir, d))) err(`缺目录 ${d}`);
  if (!res.some((r) => r[0] === "err")) ok("标准目录齐全");

  // ①②
  const settings = read(p.settings);
  if (!settings) err("缺 00-项目设置.md");
  if (step >= 3) {
    if (!p.meta.persona) err("project.json 未写 persona（①未完成）"); else ok(`人设：${p.meta.persona}`);
    if (!p.meta.platform || !PLATFORMS[p.meta.platform]) err("project.json 未写有效 platform（②未完成）"); else ok(`平台：${p.meta.platform}`);
    const st = statusLine(settings);
    if (p.meta.mode === "fast") ok("FAST 模式：设置无需逐项确认");
    else if (!confirmed(st, /^已确认/)) err(`00-项目设置.md 状态不是“已确认”：${st || "空"}`);
    const name = field(settings, "人设名称");
    if (p.meta.persona && name && !name.includes(p.meta.persona)) err(`人设不一致：project.json=${p.meta.persona}，00-项目设置.md=${name}`);
    const pl = field(settings, "平台");
    if (p.meta.platform && pl && !pl.includes(PLATFORMS[p.meta.platform].label)) err(`平台不一致：project.json=${p.meta.platform}，00-项目设置.md=${pl}`);
  }
  // ③–⑤
  if (step >= 6) {
    if (!fs.existsSync(p.finalEn)) err("缺 01-视频稿/03-终稿-en.md（⑤成稿）"); else ok("成稿 03-终稿-en.md 存在");
    if (!p.meta.finalConfirmed) err("成稿未经用户确认（用户确认后 set <ID> finalConfirmed=true；final 命令会自动记录）");
    if (p.meta.deliveredFinal) ok("用户直接交付成稿：跳过④⑤");
    else {
      if (!fs.existsSync(p.draft)) err("缺 01-视频稿/01-初稿.md（③）");
      if (p.meta.adviceSkipped) warn("用户决定本期跳过④外部建议（adviceSkipped=true）");
      else if (!fs.existsSync(p.advice)) err("缺 01-视频稿/02-外部建议.md（④）；用户明确决定不做外审时 set <ID> adviceSkipped=true");
    }
  }
  // ⑥–⑧
  const fast = p.meta.mode === "fast";
  if (fast) ok("FAST 模式：成稿由用户交付，零审核；跳过⑥–⑧和参考图");
  if (!fast && step >= 7 && !fs.existsSync(p.scriptDraft)) err("缺 02-脚本/script-draft.md（⑥）");
  if (!fast && step >= 7 && !fs.existsSync(p.assets)) err("缺 02-脚本/assets.md（⑥⑦）");
  if (fast && step >= 9) {
    if (!p.meta.style) err("FAST 也要用户选风格：给 style.mjs history + 预览.html，用户选定后 style.mjs use 登记"); else ok(`风格：${p.meta.style}`);
    if (!p.meta.voice) err("FAST 也要用户选音色：给 voice.mjs history + 试听.html，用户选定后 voice.mjs use 登记"); else ok("音色已登记");
  }
  if (!fast && step >= 9) {
    const a = read(p.assets);
    const open = openAssetRows(a);
    if (open.length) err(`素材缺口未关闭，不能进⑨：${open.join("、")}`); else if (a) ok("素材总表没有未关闭缺口");
    if (a && !confirmed(statusLine(a), /已确认（可进⑨）/)) err(`assets.md 状态不是“已确认（可进⑨）”：${statusLine(a) || "空"}`);
    if (p.meta && !p.meta.style) warn("project.json 没有 style：⑨用 node shared/tools/style.mjs use <项目ID> <风格ID> 登记本期风格"); else if (p.meta) ok(`风格：${p.meta.style}`);
  }
  // ⑨→⑩
  if (step >= 10) {
    const sc = read(p.script);
    if (!sc) err("缺 02-脚本/script.md（⑨脚本成稿）");
    else if (fast) ok("FAST：脚本无需确认");
    else if (!confirmed(statusLine(sc), /已确认（可进⑩）/)) err(`script.md 状态不是“已确认（可进⑩）”：${statusLine(sc) || "空"}`);
    else ok("脚本成稿已确认");
    const refs = fs.existsSync(p.refs) ? fs.readdirSync(p.refs).filter((f) => IMG_RE.test(f)) : [];
    if (fast) { /* FAST 不要求参考图 */ }
    else if (!refs.length) err("03-素材/refs/ 没有风格参考图（⑨必须至少一张）");
    else {
      ok(`风格参考图 ${refs.length} 张`);
      if (sc && !refs.some((f) => sc.includes(f))) warn("script.md 没有写到任何一张参考图的文件名");
    }
    if (!fs.existsSync(path.join(p.remotion, "Composition.tsx"))) err("缺 05-制作/remotion/Composition.tsx");
  }
  // 外部交付
  const hd = path.join(p.dir, HANDOFF_DIR);
  if (fs.existsSync(hd)) {
    for (const f of fs.readdirSync(hd).filter((x) => x.endsWith("-提示词.md"))) {
      const t = fs.readFileSync(path.join(hd, f), "utf8");
      const left = t.match(/\{\{填写[^}]*\}\}/g);
      if (left) err(`${HANDOFF_DIR}/${f} 还有 ${left.length} 处 {{填写}} 没换成本期内容`);
    }
  }
  for (const h of p.meta.handoffs ?? []) if (h.status !== "已验收") warn(`外部交付 ${h.no}（${h.template} · ${h.tool}）${h.status}：${h.prompt}`);
  // 引用边界
  // 代码里引用其他项目 / 旧期素材 / 绝对路径是错误（渲染会串期）；文档里提到只是提醒
  let n = 0;
  for (const f of walk(p.dir)) {
    const t = fs.readFileSync(f, "utf8"); const report = /\.(ts|tsx)$/.test(f) ? err : warn;
    const hit = (m) => { n++; report(`${rel(f)} ${m}`); };
    for (const mm of t.matchAll(/projects\/\d{4}\/\d{2}\/(\d{4}-\d{2}-\d{2}-[a-z0-9-]+)/g)) if (mm[1] !== p.id) hit(`引用其他项目 ${mm[1]}`);
    for (const mm of t.matchAll(/staticFile\(\s*["'`](\d{4}-\d{2}-[a-z0-9-]+)\//g)) hit(`用了旧期素材 ${mm[1]}/（请复制到本项目 03-素材/生产/）`);
    if (/\b[A-Z]:\\[^\s`"']+/.test(t)) hit("写了 Windows 绝对路径");
  }
  if (!n) ok("没有引用其他项目或写死绝对路径");
  return res;
}

function printCheck(res) {
  const icon = { ok: "✓", warn: "!", err: "✗" };
  for (const [k, m] of res) console.log(`  ${icon[k]} ${m}`);
  const e = res.filter((r) => r[0] === "err").length; const w = res.filter((r) => r[0] === "warn").length;
  console.log(e ? `\n✗ ${e} 项不通过，${w} 项提醒` : `\n✓ 通过（${w} 项提醒）`);
  return e;
}

// ---------- status / set / final / paths ----------
function cmdStatus(p) {
  if (p.kind === "legacy") { console.log(`${p.id}（旧期，走原三目录路径）`); printCheck(check(p)); return; }
  const m = p.meta;
  console.log(`${m.id}  ${rel(p.dir)}/`);
  console.log(`  人设：${m.persona ?? "未定"}    平台：${m.platform ?? "未定"}    状态：${m.status}${m.mode === "fast" ? "    【FAST】" : ""}${m.deliveredFinal ? "    （用户直接交付成稿）" : ""}`);
  console.log(`  当前：${STEPS[m.step] ?? m.step}`);
  console.log(`  下一步：${m.next || "—"}`);
  if (m.blockers?.length) console.log(`  阻塞：\n${m.blockers.map((b) => "    - " + b).join("\n")}`);
  const files = [["初稿", p.draft], ["外部建议", p.advice], ["成稿", p.finalEn], ["脚本初稿", p.scriptDraft], ["素材台账", p.assets], ["脚本成稿", p.script]];
  console.log(`  文件：${files.map(([n, f]) => `${fs.existsSync(f) ? "✓" : "·"}${n}`).join("  ")}`);
  const deliv = fs.existsSync(p.deliver) ? fs.readdirSync(p.deliver) : [];
  console.log(`  交付：${deliv.length ? deliv.join("、") : "—"}`);
  const hs = m.handoffs ?? [];
  if (hs.length) console.log(`  外部交付：\n${hs.map((h) => `    ${h.no} ${h.template} · ${h.tool} · ${h.status}${h.note ? " · " + h.note : ""}`).join("\n")}`);
  console.log("\n门禁检查：");
  printCheck(check(p));
}

function cmdSet(p, kvs) {
  if (p.kind !== "project") fail("旧期没有 project.json");
  if (!kvs.length) fail("用法：set <ID> step=6 next=\"…\" blocker=\"…\" blockers= persona=Andy platform=youtube-long status=done");
  for (const kv of kvs) {
    const i = kv.indexOf("="); if (i < 0) fail(`参数要写成 key=value：${kv}`);
    const k = kv.slice(0, i); const v = kv.slice(i + 1);
    if (k === "step") { const n = Number(v); if (!(n >= 1 && n <= 10)) fail("step 是 1–10"); p.meta.step = n; }
    else if (k === "platform") { if (!PLATFORMS[v]) fail(`平台只能是 ${Object.keys(PLATFORMS).join(" / ")}`); p.meta.platform = v; }
    else if (k === "blocker") p.meta.blockers.push(v);
    else if (k === "blockers") p.meta.blockers = v ? v.split(";").map((x) => x.trim()).filter(Boolean) : [];
    else if (["deliveredFinal", "finalConfirmed", "adviceSkipped"].includes(k)) p.meta[k] = v === "true";
    else if (k === "mode") { if (!["fast", "standard"].includes(v)) fail("mode 只能是 fast / standard"); if (v === "fast") p.meta.mode = "fast"; else delete p.meta.mode; }
    else if (["next", "status", "persona"].includes(k)) p.meta[k] = v;
    else fail(`不认识的字段 ${k}`);
  }
  saveMeta(p); console.log(`✓ 已更新 ${rel(path.join(p.dir, "project.json"))}`);
}

function cmdFinal(p, file) {
  if (p.kind !== "project") fail("旧期请按原路径保存");
  if (!file || !fs.existsSync(file)) fail("用法：final <ID> <用户交付的成稿文件>");
  if (fs.existsSync(p.finalEn)) fail(`已有 ${rel(p.finalEn)}，不覆盖`);
  const fast = p.meta.mode === "fast";
  if (fast && (!p.meta.persona || !p.meta.platform)) fail("FAST 也要先有 persona 和 platform：set <ID> persona=… platform=…");
  if (!fast && p.meta.step < 3) fail("先完成①②（人设、平台确认后 step 至少为 3）");
  fs.copyFileSync(file, p.finalEn);
  if (fast) Object.assign(p.meta, { deliveredFinal: true, finalConfirmed: true, step: 9, next: "FAST②脚本：成稿直接拆成 script.md（不改口播，按「内容→画面」表），不做网络检索，素材＝动效＋AI 生图＋用户附件；风格和音色用开工时用户选的，然后直接进⑩出片" });
  else Object.assign(p.meta, { deliveredFinal: true, finalConfirmed: true, step: 6, next: "⑥脚本初稿：读成稿，定风格、分镜、动效和逐镜素材需求" });
  saveMeta(p);
  console.log(fast ? `✓ 成稿已存为 ${rel(p.finalEn)}（FAST：零审核），进入脚本` : `✓ 成稿已存为 ${rel(p.finalEn)}，跳过④⑤，进入⑥`);
}

function cmdPaths(p) {
  const out = {};
  for (const [k, v] of Object.entries(p)) if (typeof v === "string" && k !== "id" && k !== "kind") out[k] = rel(v);
  console.log(JSON.stringify({ id: p.id, kind: p.kind, ...out }, null, 2));
}

// ---------- Remotion：studio / render / lint ----------
function runtime() {
  if (process.env.CV_RUNTIME_DIR) return { dir: process.env.CV_RUNTIME_DIR, linux: process.platform === "linux" };
  const rl = path.join(os.homedir(), "rl"); // Claude 的 Linux 环境（3-视频生成/tools/linux-render.sh setup 建的）
  if (process.platform === "linux" && fs.existsSync(path.join(rl, "node_modules", "@remotion", "cli"))) return { dir: rl, linux: true };
  if (process.platform === "linux" && !fs.existsSync(path.join(ENGINE, "node_modules", "@remotion", "compositor-linux-x64-gnu")))
    fail("Linux 下先运行 bash 3-视频生成/tools/linux-render.sh setup（不要在 Windows 的 node_modules 里装 Linux 依赖）");
  return { dir: ENGINE, linux: false };
}

function link(target, at) {
  try {
    const st = fs.lstatSync(at);
    if (!st.isSymbolicLink()) fail(`${at} 已存在且不是链接，不动它`);
    if (path.resolve(path.dirname(at), fs.readlinkSync(at)) === path.resolve(target)) return;
    fs.unlinkSync(at);
  } catch (e) { if (e.code !== "ENOENT") throw e; }
  fs.symlinkSync(target, at, process.platform === "win32" ? "junction" : "dir");
}

// 每个项目一个合成的 public 目录（只有链接，不复制文件）：library / assets / audio
function ensurePublic(p, rt) {
  const pub = rt.linux ? path.join(os.homedir(), ".cv-public", p.id) : path.join(p.cache, "public");
  fs.mkdirSync(pub, { recursive: true });
  link(path.join(ENGINE, "public", "library"), path.join(pub, "library"));
  link(p.prod, path.join(pub, "assets"));
  link(p.audio, path.join(pub, "audio"));
  return pub;
}

function remotion(p, args) {
  const rt = runtime(); const pub = ensurePublic(p, rt);
  const env = { ...process.env, CV_PROJECT_DIR: p.dir, CV_PUBLIC_DIR: pub };
  const extra = [];
  if (rt.linux) {
    const chr = path.join(os.homedir(), "chr", "bin");
    env.LD_LIBRARY_PATH = chr + (env.LD_LIBRARY_PATH ? ":" + env.LD_LIBRARY_PATH : "");
    extra.push(`--browser-executable=${path.join(chr, "chromium")}`, "--chrome-mode=headless-shell");
  }
  const cli = path.join(rt.dir, "node_modules", "@remotion", "cli", "remotion-cli.js");
  const r = spawnSync(process.execPath, [cli, ...args, ...extra], { cwd: rt.dir, env, stdio: "inherit" });
  process.exit(r.status ?? 1);
}

function cmdRender(p, flags, rest) {
  if (p.kind !== "project") fail("旧期在 3-视频生成/ 里按原命令渲染：npx remotion render <期名> out/<期名>.mp4");
  const deliver = flags.deliver ?? p.meta.platform ?? "youtube-long";
  let out;
  if (flags.preview) {
    // 预览（⑨确认风格、⑩先给关键段）：不过门禁，但只能写到 05-制作/cache/，不进 06-交付
    out = path.join(p.cache, "preview", typeof flags.preview === "string" ? flags.preview : `${flags.comp ?? p.id}.mp4`);
    console.log(`预览渲染（未过⑩门禁，不进 06-交付）：${rel(out)}`);
  } else {
    const res = check(p, 10);
    if (res.some((r) => r[0] === "err")) {
      console.log(`${p.id} 第⑩步门禁不通过，拒绝渲染到 06-交付（只看效果用 --preview）：`);
      printCheck(res); process.exit(1);
    }
    if (flags.out) fail("正式渲染固定写到 06-交付/<平台>/video.mp4；其他位置用 --preview <文件名>");
    out = path.join(p.deliver, deliver, "video.mp4");
  }
  fs.mkdirSync(path.dirname(out), { recursive: true });
  remotion(p, ["render", "src/project-entry.ts", flags.comp ?? p.id, out, ...rest]);
}

function cmdStudio(p, rest) {
  if (p.kind !== "project") fail("旧期在 3-视频生成/ 里 npm run dev");
  remotion(p, ["studio", "src/project-entry.ts", ...rest]);
}

function cmdLint(p) {
  if (p.kind !== "project") fail("旧期在 3-视频生成/ 里 npm run lint");
  const rt = runtime(); const nm = path.join(rt.dir, "node_modules");
  const tsc = spawnSync(process.execPath, [path.join(nm, "typescript", "bin", "tsc"), "-p", path.join(p.remotion, "tsconfig.json")], { stdio: "inherit" });
  const es = spawnSync(process.execPath, [path.join(nm, "eslint", "bin", "eslint.js"), "-c", path.join(ENGINE, "eslint.config.mjs"), rel(p.remotion)], { cwd: ROOT, stdio: "inherit" });
  const bad = (tsc.status ?? 1) || (es.status ?? 1);
  console.log(bad ? "✗ lint 不通过" : "✓ tsc + eslint 通过");
  process.exit(bad ? 1 : 0);
}

// ---------- main ----------
// ---------- handoff：外部交付提示词 ----------
function handoffTemplates() {
  if (!fs.existsSync(HANDOFF_LIB)) fail("缺 shared/handoff/ 模板库");
  return fs.readdirSync(HANDOFF_LIB).filter((f) => /^H\d{2}-.+\.md$/.test(f)).sort();
}
function cmdHandoff(p, pos, flags) {
  if (p.kind !== "project") fail("外部交付只用于新项目");
  const sub = pos[0] ?? "list";
  p.meta.handoffs ??= [];
  const dir = path.join(p.dir, HANDOFF_DIR);
  if (sub === "list") {
    console.log("模板（shared/handoff/）：");
    for (const f of handoffTemplates()) console.log(`  ${f.replace(/\.md$/, "")}`);
    console.log(`\n${p.id} 已交付：`);
    if (!p.meta.handoffs.length) console.log("  —");
    for (const h of p.meta.handoffs) console.log(`  ${h.no}  ${h.template} · ${h.tool} · ${h.status} · ${h.created}${h.note ? " · " + h.note : ""}\n      提示词 ${h.prompt}\n      回复   ${h.reply}`);
    return;
  }
  if (sub === "new") {
    const key = (pos[1] ?? "").toUpperCase();
    const tpl = handoffTemplates().find((f) => f.startsWith(key + "-") || f.replace(/\.md$/, "") === pos[1]);
    if (!tpl) fail(`用法：handoff <ID> new <H01…> --tool grok [--note "…"]；可用模板：${handoffTemplates().map((f) => f.slice(0, 3)).join(" ")}`);
    const tool = typeof flags.tool === "string" ? flags.tool.toLowerCase() : "external";
    fs.mkdirSync(dir, { recursive: true });
    const no = String(p.meta.handoffs.length + 1).padStart(2, "0");
    const base = `${no}-${tpl.replace(/\.md$/, "")}-${tool}`;
    const prompt = path.join(dir, `${base}-提示词.md`), reply = path.join(dir, `${base}-回复.md`);
    const rp = (f) => path.relative(p.dir, f).split(path.sep).join("/");
    const persona = p.meta.persona ?? "（未定）";
    const platform = p.meta.platform ? `${PLATFORMS[p.meta.platform].label}（${PLATFORMS[p.meta.platform].w}×${PLATFORMS[p.meta.platform].h}）` : "（未定）";
    let t = fs.readFileSync(path.join(HANDOFF_LIB, tpl), "utf8")
      .replaceAll("{{自动:项目ID}}", p.id).replaceAll("{{自动:项目目录}}", rel(p.dir)).replaceAll("{{自动:今天}}", today())
      .replaceAll("{{自动:人设}}", persona).replaceAll("{{自动:平台}}", platform).replaceAll("{{自动:编号}}", no)
      .replaceAll("{{自动:回复文件}}", `${rel(p.dir)}/${rp(reply)}`);
    fs.writeFileSync(prompt, t);
    fs.writeFileSync(reply, `# ${no}｜${tpl.replace(/\.md$/, "")} · ${tool} · 原始回复\n\n> 把外部工具的回复**逐字**贴在下面，不删改。贴完告诉 Claude，或运行 \`npm run project -- handoff ${p.id} done ${no}\`。\n\n`);
    const left = (t.match(/\{\{填写[^}]*\}\}/g) ?? []).length;
    p.meta.handoffs.push({ no, template: tpl.replace(/\.md$/, ""), tool, prompt: rp(prompt), reply: rp(reply), status: "待填写", created: today(), note: typeof flags.note === "string" ? flags.note : "" });
    saveMeta(p);
    console.log(`✓ 已生成外部交付 ${no}`);
    console.log(`  提示词：${rel(prompt)}`);
    console.log(`  回复：  ${rel(reply)}`);
    console.log(left ? `  还有 ${left} 处 {{填写:…}} 要换成本期内容；填完运行 handoff ${p.id} send ${no}` : `  没有待填项；确认后运行 handoff ${p.id} send ${no}`);
    return;
  }
  const no = String(pos[1] ?? "").padStart(2, "0");
  const h = p.meta.handoffs.find((x) => x.no === no);
  if (!h) fail(`没有外部交付 ${no}；先看 handoff ${p.id} list`);
  const note = typeof flags.note === "string" ? flags.note : null;
  if (sub === "send") {
    const t = read(path.join(p.dir, h.prompt)) ?? "";
    const left = t.match(/\{\{填写[^}]*\}\}/g);
    if (left) fail(`${h.prompt} 还有 ${left.length} 处没填：${left.slice(0, 3).join("、")}…`);
    const m = /===== 复制开始 =====\n([\s\S]*?)\n===== 复制结束 =====/.exec(t);
    h.status = "已发出待回收"; if (note) h.note = note;
    p.meta.next = `等待外部交付 ${no}（${h.template} · ${h.tool}）回收：回复贴到 ${h.reply}`;
    saveMeta(p);
    console.log(`✓ ${no} 标记为已发出。给用户：\n  1) 提示词文件：${rel(p.dir)}/${h.prompt}\n  2) 复制块：${m ? `${m[1].length} 字（两条分隔线之间）` : "未找到分隔线"}\n  3) 回收位置：${rel(p.dir)}/${h.reply}`);
    return;
  }
  if (sub === "done") { h.status = "已回收待验收"; if (note) h.note = note; saveMeta(p); console.log(`✓ ${no} 已回收，等 Claude 验收`); return; }
  if (sub === "close") { h.status = "已验收"; if (note) h.note = note; saveMeta(p); console.log(`✓ ${no} 已验收`); return; }
  fail("handoff 子命令：list / new / send / done / close");
}

const [cmd, ...argv] = process.argv.slice(2);
const a = parseArgs(argv);
switch (cmd) {
  case "new": cmdNew(a); break;
  case "list": cmdList(); break;
  case "status": cmdStatus(resolve(a.pos[0])); break;
  case "check": { const p = resolve(a.pos[0]); console.log(`${p.id} 门禁检查${a.flags.step ? `（按第 ${a.flags.step} 步）` : ""}：`); process.exit(printCheck(check(p, a.flags.step)) ? 1 : 0); break; }
  case "set": cmdSet(resolve(a.pos[0]), a.pos.slice(1)); break;
  case "final": cmdFinal(resolve(a.pos[0]), a.pos[1]); break;
  case "paths": cmdPaths(resolve(a.pos[0])); break;
  case "studio": cmdStudio(resolve(a.pos[0]), a.rest); break;
  case "render": cmdRender(resolve(a.pos[0]), a.flags, a.rest); break;
  case "lint": cmdLint(resolve(a.pos[0])); break;
  case "handoff": cmdHandoff(resolve(a.pos[0]), a.pos.slice(1), a.flags); break;
  default:
    console.log(fs.readFileSync(fileURLToPath(import.meta.url), "utf8").split("\n").slice(1, 15).map((l) => l.replace(/^\/\/ ?/, "")).join("\n"));
}
