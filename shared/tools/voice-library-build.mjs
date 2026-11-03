// 音色库批量试听生成：读取 shared/voice-library/voices.json，缺哪个补哪个。
// 用法（仓库根目录，先 set -a; . .secrets/keys.env; set +a）：node shared/tools/voice-library-build.mjs shared/voice-library/voices.json shared/voice-library [并发] [时限秒] [ark|minimax|qwen|mimo]
// MiniMax 有 RPM 限制：DELAY=2400 并发 1；Qwen 并发 ≤5。
// 用法：node gen.mjs <manifest.json> <输出根目录> [并发=8] [时限秒=160] [vendor过滤]
import { readFileSync, existsSync, mkdirSync, writeFileSync, appendFileSync } from "node:fs";
import { randomUUID } from "node:crypto";
import path from "node:path";
const [mf, root, conc = "8", limit = "160", only] = process.argv.slice(2);
const items = JSON.parse(readFileSync(mf, "utf8")).filter((i) => !only || i.vendor === only);
const E = process.env, t0 = Date.now();
const LB = { zh: "Chinese", yue: "Chinese,Yue", en: "English", ja: "Japanese", ko: "Korean", es: "Spanish", pt: "Portuguese", fr: "French", de: "German", it: "Italian", id: "Indonesian", ru: "Russian", ar: "Arabic", tr: "Turkish", uk: "Ukrainian", nl: "Dutch", vi: "Vietnamese", th: "Thai", hi: "Hindi", pl: "Polish" };
async function dl(u) { const r = await fetch(u); if (!r.ok) throw new Error("dl " + r.status); return Buffer.from(await r.arrayBuffer()); }
const S = {
  async ark(it) {
    const r = await fetch("https://openspeech.bytedance.com/api/v3/plan/tts/unidirectional", { method: "POST", headers: { "Content-Type": "application/json", "X-Api-Key": E.VOLC_TTS_ACCESS_TOKEN, "X-Api-Resource-Id": "seed-tts-2.0", "X-Api-Request-Id": randomUUID() }, body: JSON.stringify({ req_params: { text: it.text, speaker: it.id, audio_params: { format: "mp3", sample_rate: 24000 } } }) });
    const b = await r.text(); const ch = [];
    for (const l of b.split("\n")) { if (!l.trim()) continue; const m = JSON.parse(l); if (m.code && m.code !== 20000000) throw new Error(l.slice(0, 200)); if (m.data) ch.push(Buffer.from(m.data, "base64")); }
    if (!ch.length) throw new Error("no audio " + b.slice(0, 200)); return Buffer.concat(ch);
  },
  async minimax(it) {
    const r = await fetch("https://api.minimaxi.com/v1/t2a_v2", { method: "POST", headers: { Authorization: `Bearer ${E.MINIMAX_API_KEY}`, "Content-Type": "application/json" }, body: JSON.stringify({ model: "speech-2.8-hd", text: it.text, stream: false, language_boost: LB[it.code] || "auto", voice_setting: { voice_id: it.id }, audio_setting: { format: "mp3", sample_rate: 32000 }, output_format: "url" }) });
    const j = await r.json(); if (!j.data?.audio) throw new Error(JSON.stringify(j.base_resp || j).slice(0, 200)); return dl(j.data.audio);
  },
  async qwen(it) {
    const r = await fetch("https://token-plan.cn-beijing.maas.aliyuncs.com/api/v1/services/audio/tts/SpeechSynthesizer", { method: "POST", headers: { Authorization: `Bearer ${E.QWEN_TTS_API_KEY}`, "Content-Type": "application/json" }, body: JSON.stringify({ model: it.model || "qwen-audio-3.0-tts-plus", input: { text: it.text, voice: it.id, format: "mp3", language_hints: [it.code] } }) });
    const j = await r.json(); const u = j.output?.audio?.url; if (!u) throw new Error(JSON.stringify(j).slice(0, 200)); return dl(u);
  },
  async mimo(it) {
    const r = await fetch("https://api.xiaomimimo.com/v1/chat/completions", { method: "POST", headers: { "Content-Type": "application/json", Authorization: `Bearer ${E.MIMO_API_KEY}` }, body: JSON.stringify({ model: "mimo-v2.5-tts", messages: [{ role: "assistant", content: it.text }], audio: { format: "mp3", voice: it.id } }) });
    const j = await r.json(); const d = j.choices?.[0]?.message?.audio?.data; if (!d) throw new Error(JSON.stringify(j).slice(0, 200)); return Buffer.from(d, "base64");
  },
};
const todo = items.filter((i) => !existsSync(path.join(root, i.vendor, i.file)));
let ok = 0, bad = 0, k = 0;
const errLog = path.join(root, "_errors.log");
async function worker() {
  while (k < todo.length && Date.now() - t0 < +limit * 1000) {
    const it = todo[k++]; if (E.DELAY) await new Promise((r) => setTimeout(r, +E.DELAY));
    for (let a = 0; a < 3; a++) {
      try { const buf = await S[it.vendor](it); mkdirSync(path.join(root, it.vendor), { recursive: true }); writeFileSync(path.join(root, it.vendor, it.file), buf); ok++; break; }
      catch (e) { if (a === 2) { bad++; appendFileSync(errLog, `${it.vendor}\t${it.id}\t${e.message}\n`); } else await new Promise((r) => setTimeout(r, 1500 * (a + 1))); }
    }
  }
}
await Promise.all(Array.from({ length: +conc }, worker));
console.log(`todo ${todo.length} ok ${ok} bad ${bad} remaining ${todo.length - ok - bad}`);
