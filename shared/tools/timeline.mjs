// ⑩ 时间轴：按逐镜配音时长排出每镜起点、章首停顿、配乐分段和音效点，写 04-音频/timeline.json。
// Remotion 合成（import timeline.json）和 mix-audio.mjs 共用这一份，画面与声音不会错位。
// 用法：node shared/tools/timeline.mjs <项目ID> --chapters 7,29,52,77,95,113 [--open 2.2] [--gap 0.35] [--lead 0.5] [--tail 2]
//         [--pause 52:0.6,80:0.4] [--music "deep@0,minimal@7,steady@52,deep@77,minimal@113"] [--music-vol 0.085]
//         [--sfx "impact@1+1.6:0.35,impact@41+1.7:0.3"] [--chapter-sfx whoosh-fast:0.3]
// --music：曲名（library/music/bgm-tech-<名>.mp3 或完整 id）@ 从第几镜所在章开始；--sfx：音效@镜号+偏移秒:音量。
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../..");
const fail = (m) => { console.error("✗ " + m); process.exit(1); };
const argv = process.argv.slice(2); const f = {}; const pos = [];
for (let i = 0; i < argv.length; i++) { if (argv[i].startsWith("--")) { const k = argv[i].slice(2); f[k] = argv[i + 1] && !argv[i + 1].startsWith("--") ? argv[++i] : true; } else pos.push(argv[i]); }
const id = pos[0] ?? fail("用法见文件头");
const m = /^(\d{4})-(\d{2})-\d{2}-/.exec(id) ?? fail("项目 ID 格式不对");
const dir = path.join(ROOT, "projects", m[1], m[2], id);
const shots = JSON.parse(fs.readFileSync(path.join(dir, "04-音频", "voice", "shots.json"), "utf8"));
if (shots.some((s) => !(s.dur > 0))) fail("shots.json 有镜头缺时长：先跑 tts-shots.mjs");
const num = (k, d) => (f[k] === undefined ? d : Number(f[k]));
const LEAD = num("lead", 0.5), GAP = num("gap", 0.35), OPEN = num("open", 2.2), TAIL = num("tail", 2);
const chapters = new Set(String(f.chapters ?? "").split(",").filter(Boolean).map(Number));
const pause = Object.fromEntries(String(f.pause ?? "").split(",").filter(Boolean).map((x) => x.split(":").map(Number)));

const voice = []; const openers = []; let t = LEAD;
for (const s of shots) {
  if (chapters.has(s.n)) { openers.push({ n: s.n, t }); t += OPEN; }
  voice.push({ n: s.n, t: +t.toFixed(3), dur: s.dur, file: `voice/shot-${String(s.n).padStart(3, "0")}.mp3` });
  t += s.dur + GAP + (pause[s.n] ?? 0);
}
const end = +(t + TAIL).toFixed(3);
const at = (n) => voice.find((x) => x.n === n)?.t ?? fail(`没有第 ${n} 镜`);
const chapStart = (n) => openers.find((o) => o.n === n)?.t ?? (n === 1 ? 0 : at(n));

const musicSpec = String(f.music ?? "steady@1").split(",").map((x) => x.split("@"));
const music = musicSpec.map(([name, n], i) => {
  const a = Number(n) <= 1 ? 0 : chapStart(Number(n));
  const b = i + 1 < musicSpec.length ? chapStart(Number(musicSpec[i + 1][1])) + 1 : end;
  return { file: `music/${name.startsWith("bgm-") ? name : "bgm-tech-" + name}.mp3`, a: +a.toFixed(3), b: +b.toFixed(3), vol: num("music-vol", 0.085) };
});
const sfx = String(f.sfx ?? "").split(",").filter(Boolean).map((x) => {
  const mm = /^([\w-]+)@(\d+)(?:\+([\d.]+))?(?::([\d.]+))?$/.exec(x) ?? fail(`--sfx 写法：impact@1+1.6:0.35（${x}）`);
  return { file: `sfx/sfx-${mm[1]}.mp3`, t: +(at(+mm[2]) + Number(mm[3] ?? 0)).toFixed(3), vol: Number(mm[4] ?? 0.3) };
});
if (f["chapter-sfx"]) { const [nm, vol] = String(f["chapter-sfx"]).split(":"); for (const o of openers) sfx.push({ file: `sfx/sfx-${nm}.mp3`, t: o.t, vol: Number(vol ?? 0.3) }); }

const tl = { fps: 30, end, frames: Math.ceil(end * 30), lead: LEAD, gap: GAP, open: OPEN, openers, voice, music, sfx };
fs.writeFileSync(path.join(dir, "04-音频", "timeline.json"), JSON.stringify(tl, null, 1) + "\n");
console.log(`✓ 04-音频/timeline.json：${voice.length} 镜，${openers.length} 个章首，全长 ${(end / 60).toFixed(2)} 分钟（${tl.frames} 帧）`);
