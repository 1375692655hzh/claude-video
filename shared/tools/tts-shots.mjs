// ⑩ 逐镜配音：读项目 02-脚本/script.md 分镜表的口播列，一镜一个文件，并实测时长。
// 音色取 project.json 的 voice（用 voice.mjs use 登记），或 --voice 指定（试听文件名或调用 ID）。四家都支持：ark / minimax / qwen / mimo。
// 用法（仓库根目录，先 set -a; . .secrets/keys.env; set +a）：
//   node shared/tools/tts-shots.mjs <项目ID> [--voice ark-Joanne-女-美式英语] [--only 12,13] [--force] [--conc 6]
// 输出：04-音频/voice/shot-001.mp3 …、04-音频/voice/shots.json（n / ch / text / dur 秒）
// 断点续跑：已有的文件跳过（--force 重做）；失败的镜头最后列出，再跑一次即可补上。
import { hasKey, keyHint } from "./vendor-keys.mjs";
import fs from "node:fs";
import path from "node:path";
import { execFileSync } from "node:child_process";
import { randomUUID } from "node:crypto";
import { fileURLToPath } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../..");
const fail = (m) => { console.error("✗ " + m); process.exit(1); };
const argv = process.argv.slice(2);
const flags = {}; const pos = [];
for (let i = 0; i < argv.length; i++) { if (argv[i].startsWith("--")) { const k = argv[i].slice(2); flags[k] = argv[i + 1] && !argv[i + 1].startsWith("--") ? argv[++i] : true; } else pos.push(argv[i]); }
const id = pos[0] ?? fail("用法：tts-shots.mjs <项目ID> [--voice …]");
const m = /^(\d{4})-(\d{2})-\d{2}-/.exec(id) ?? fail("项目 ID 格式 YYYY-MM-DD-短名");
const dir = path.join(ROOT, "projects", m[1], m[2], id);
const meta = JSON.parse(fs.readFileSync(path.join(dir, "project.json"), "utf8"));
const voices = JSON.parse(fs.readFileSync(path.join(ROOT, "shared", "voice-library", "voices.json"), "utf8"));
const key = typeof flags.voice === "string" ? flags.voice.replace(/\.mp3$/, "") : meta.voice?.file?.replace(/\.mp3$/, "") ?? fail("project.json 没有 voice：先 node shared/tools/voice.mjs use <项目ID> <音色>，或加 --voice");
const v = voices.find((x) => x.file.replace(/\.mp3$/, "") === key || x.id === key) ?? fail(`音色库里没有 ${key}`);

// 分镜：script.md 表格里 “| 编号 | 章节 | 口播 | …” 的行
const script = fs.readFileSync(path.join(dir, "02-脚本", "script.md"), "utf8");
const shots = script.split("\n").filter((l) => /^\|\s*\d+\s*\|/.test(l)).map((l) => { const c = l.trim().replace(/^\||\|$/g, "").split("|").map((x) => x.trim()); return { n: +c[0], ch: c[1], text: c[2] }; });
if (!shots.length) fail("script.md 里没找到分镜表行（| 1 | 章节 | 口播 | …）");
const out = path.join(dir, "04-音频", "voice");
fs.mkdirSync(out, { recursive: true });
const only = typeof flags.only === "string" ? new Set(flags.only.split(",").map(Number)) : null;
const file = (n) => path.join(out, `shot-${String(n).padStart(3, "0")}.mp3`);
const todo = shots.filter((s) => (!only || only.has(s.n)) && (flags.force || !fs.existsSync(file(s.n))));
const E = process.env;
if (!hasKey(v.vendor)) fail(`这个音色还不能生成配音。${keyHint(v.vendor)}`);
const LB = { 中文: "Chinese", 粤语: "Chinese,Yue", 英语: "English", 美式英语: "English", 英式英语: "English", 日语: "Japanese", 韩语: "Korean" };
const dl = async (u) => Buffer.from(await (await fetch(u)).arrayBuffer());
const S = {
  async ark(text) {
    const r = await fetch("https://openspeech.bytedance.com/api/v3/plan/tts/unidirectional", { method: "POST", headers: { "Content-Type": "application/json", "X-Api-Key": E.ARK_PLAN_API_KEY || E.VOLC_TTS_ACCESS_TOKEN, "X-Api-Resource-Id": "seed-tts-2.0", "X-Api-Request-Id": randomUUID() }, body: JSON.stringify({ req_params: { text, speaker: v.id, audio_params: { format: "mp3", sample_rate: 24000, speech_rate: Number(flags.speed ?? 0) } } }) });
    const b = await r.text(); const ch = [];
    for (const l of b.split("\n")) { if (!l.trim()) continue; const j = JSON.parse(l); if (j.code && j.code !== 20000000) throw new Error(l.slice(0, 200)); if (j.data) ch.push(Buffer.from(j.data, "base64")); }
    if (!ch.length) throw new Error("no audio"); return Buffer.concat(ch);
  },
  async minimax(text) {
    const r = await fetch("https://api.minimaxi.com/v1/t2a_v2", { method: "POST", headers: { Authorization: `Bearer ${E.MINIMAX_API_KEY}`, "Content-Type": "application/json" }, body: JSON.stringify({ model: "speech-2.8-hd", text, stream: false, language_boost: LB[v.lang] ?? "auto", voice_setting: { voice_id: v.id }, audio_setting: { format: "mp3", sample_rate: 32000 }, output_format: "url" }) });
    const j = await r.json(); if (!j.data?.audio) throw new Error(JSON.stringify(j.base_resp ?? j).slice(0, 200)); return dl(j.data.audio);
  },
  async qwen(text) {
    const r = await fetch("https://token-plan.cn-beijing.maas.aliyuncs.com/api/v1/services/audio/tts/SpeechSynthesizer", { method: "POST", headers: { Authorization: `Bearer ${E.QWEN_TTS_API_KEY}`, "Content-Type": "application/json" }, body: JSON.stringify({ model: v.model ?? "qwen-audio-3.0-tts-plus", input: { text, voice: v.id, format: "mp3", language_hints: [v.lang === "英语" ? "en" : "zh"] } }) });
    const j = await r.json(); const u = j.output?.audio?.url; if (!u) throw new Error(JSON.stringify(j).slice(0, 200)); return dl(u);
  },
  async mimo(text) {
    const r = await fetch("https://api.xiaomimimo.com/v1/chat/completions", { method: "POST", headers: { "Content-Type": "application/json", Authorization: `Bearer ${E.MIMO_API_KEY}` }, body: JSON.stringify({ model: "mimo-v2.5-tts", messages: [{ role: "assistant", content: text }], audio: { format: "mp3", voice: v.id } }) });
    const j = await r.json(); const d = j.choices?.[0]?.message?.audio?.data; if (!d) throw new Error(JSON.stringify(j).slice(0, 200)); return Buffer.from(d, "base64");
  },
};
const conc = v.vendor === "minimax" ? 1 : Number(flags.conc ?? 6);
const delay = v.vendor === "minimax" ? 2400 : 0;
console.log(`音色 ${v.vendor} · ${v.name}（${v.id}），${todo.length}/${shots.length} 镜待生成，并发 ${conc}`);
let k = 0; const bad = [];
await Promise.all(Array.from({ length: conc }, async () => {
  while (k < todo.length) {
    const s = todo[k++];
    if (delay) await new Promise((r) => setTimeout(r, delay));
    for (let a = 0; a < 3; a++) {
      try { fs.writeFileSync(file(s.n), await S[v.vendor](s.text)); break; }
      catch (e) { if (a === 2) bad.push(`${s.n}：${e.message}`); else await new Promise((r) => setTimeout(r, 2000 * (a + 1))); }
    }
  }
}));
// 时长
let total = 0;
for (const s of shots) {
  if (!fs.existsSync(file(s.n))) continue;
  s.dur = Number(execFileSync("ffprobe", ["-v", "quiet", "-show_entries", "format=duration", "-of", "csv=p=0", file(s.n)]).toString().trim());
  total += s.dur;
}
fs.writeFileSync(path.join(out, "shots.json"), JSON.stringify(shots, null, 1) + "\n");
console.log(`✓ 已写 04-音频/voice/shots.json，口播合计 ${(total / 60).toFixed(1)} 分钟`);
if (bad.length) { console.log(`✗ ${bad.length} 镜失败（再跑一次补上）：\n  ${bad.join("\n  ")}`); process.exit(1); }
