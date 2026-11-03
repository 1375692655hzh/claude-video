// ⑩ 混音：按 04-音频/timeline.json 用 ffmpeg 把逐镜配音、配乐（循环 + 淡入淡出）、音效混成一条音轨。
// 不走 Remotion（Remotion 出音轨也要逐帧开浏览器，13 分钟片要几十分钟）；这里约 1 分钟。
// 用法：node shared/tools/mix-audio.mjs <项目ID> [--out 04-音频/mix/mix.m4a]
// 配乐、音效从 3-视频生成/public/library/ 取；配音从 04-音频/ 取。
import fs from "node:fs";
import path from "node:path";
import { execFileSync } from "node:child_process";
import { fileURLToPath } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../..");
const LIB = path.join(ROOT, "3-视频生成", "public", "library");
const fail = (m) => { console.error("✗ " + m); process.exit(1); };
const argv = process.argv.slice(2); const id = argv[0] ?? fail("用法：mix-audio.mjs <项目ID>");
const oi = argv.indexOf("--out");
const m = /^(\d{4})-(\d{2})-\d{2}-/.exec(id) ?? fail("项目 ID 格式不对");
const dir = path.join(ROOT, "projects", m[1], m[2], id);
const tl = JSON.parse(fs.readFileSync(path.join(dir, "04-音频", "timeline.json"), "utf8"));
const out = path.join(dir, oi > 0 ? argv[oi + 1] : "04-音频/mix/mix.m4a");
fs.mkdirSync(path.dirname(out), { recursive: true });
const tmp = fs.mkdtempSync(path.join(fs.realpathSync(process.env.TMPDIR ?? "/tmp"), "mix-"));
const ms = (s) => Math.round(s * 1000);

// 1) 配音
let inp = [], flt = [];
tl.voice.forEach((v, i) => { inp.push("-i", path.join(dir, "04-音频", v.file)); flt.push(`[${i}:a]aresample=48000,adelay=${ms(v.t)}|${ms(v.t)}[a${i}]`); });
flt.push(`${tl.voice.map((_, i) => `[a${i}]`).join("")}amix=inputs=${tl.voice.length}:normalize=0,apad=whole_dur=${tl.end}[vo]`);
fs.writeFileSync(path.join(tmp, "f1.txt"), flt.join(";"));
execFileSync("ffmpeg", ["-v", "error", "-y", ...inp, "-filter_complex_script", path.join(tmp, "f1.txt"), "-map", "[vo]", "-ac", "2", "-t", String(tl.end), path.join(tmp, "vo.wav")], { stdio: "inherit" });

// 2) 配乐 + 音效
inp = ["-i", path.join(tmp, "vo.wav")]; flt = []; const lab = ["[0:a]"]; let k = 1;
for (const [i, mu] of tl.music.entries()) {
  const d = mu.b - mu.a;
  inp.push("-stream_loop", "-1", "-i", path.join(LIB, mu.file));
  flt.push(`[${k++}:a]aresample=48000,atrim=0:${d.toFixed(3)},afade=t=in:d=1,afade=t=out:st=${(d - 1).toFixed(3)}:d=1,volume=${mu.vol},adelay=${ms(mu.a)}|${ms(mu.a)}[m${i}]`); lab.push(`[m${i}]`);
}
for (const [j, s] of tl.sfx.entries()) {
  inp.push("-i", path.join(LIB, s.file));
  flt.push(`[${k++}:a]aresample=48000,volume=${s.vol},adelay=${ms(s.t)}|${ms(s.t)}[s${j}]`); lab.push(`[s${j}]`);
}
flt.push(`${lab.join("")}amix=inputs=${lab.length}:normalize=0,alimiter=limit=0.95[out]`);
fs.writeFileSync(path.join(tmp, "f2.txt"), flt.join(";"));
execFileSync("ffmpeg", ["-v", "error", "-y", ...inp, "-filter_complex_script", path.join(tmp, "f2.txt"), "-map", "[out]", "-t", String(tl.end), "-c:a", "aac", "-b:a", "192k", out], { stdio: "inherit" });
console.log(`✓ 混音完成：${path.relative(ROOT, out)}（${(tl.end / 60).toFixed(2)} 分钟，配音 ${tl.voice.length} 段、配乐 ${tl.music.length} 段、音效 ${tl.sfx.length} 个）`);
