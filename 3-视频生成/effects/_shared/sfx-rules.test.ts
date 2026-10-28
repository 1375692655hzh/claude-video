// 音效规范检查的正反例测试：npm run test:sfx（改了 sfx-rules.ts 的规则后跑一遍）
import { checkSfxCues, cueVolume, sfxDuck, SfxCue } from "./sfx-rules";

const fps = 30;
const min = (m: number) => Math.round(m * 60 * fps);
const s = (x: number) => Math.round(x * fps);
let fail = 0;
function expect(name: string, cues: SfxCue[], dur: number, want: number, speech: [number, number][] = []) {
  const v = checkSfxCues(cues, { fps, durationInFrames: dur, speech });
  const ok = v.length === want;
  if (!ok) fail++;
  console.log(`${ok ? "✔" : "✖"} ${name}：${v.length} 处${want ? `（期望 ${want}）` : ""}`);
  v.forEach((p) => console.log(`    第 ${p.frame} 帧：${p.message}`));
}

// 合规：2 分钟 6 个，间隔充足，riser 结尾接 impact
expect(
  "合规的一组",
  [
    { name: "whoosh-slow", at: s(2) },
    { name: "count", at: s(15) },
    { name: "pop", at: s(40) },
    { name: "riser", endAt: s(70) },
    { name: "impact", at: s(70) },
    { name: "whoosh-slow", at: s(100) },
  ],
  min(2),
  0,
  [[s(5), s(60)], [s(75), s(95)]],
);
expect("总量超标（1 分钟 5 个）", [0, 12, 24, 36, 48].map((t, i) => ({ name: (["pop", "ding", "rise", "count", "whoosh-fast"] as const)[i], at: s(t) })), min(1), 1); // 只超总量（间隔 12 秒，任何 30 秒窗口都不超过 3 个）
expect("30 秒内 4 个", [0, 8, 16, 24].map((t, i) => ({ name: (["pop", "ding", "rise", "count"] as const)[i], at: s(t) })), min(2), 1);
expect("间隔太近（0.5 秒）", [{ name: "pop", at: s(10) }, { name: "ding", at: s(10.5) }], min(2), 1);
expect("同类太近（5 秒）", [{ name: "pop", at: s(10) }, { name: "pop", at: s(15) }], min(2), 1);
expect("impact 全片 4 次", [10, 40, 70, 100].map((t) => ({ name: "impact" as const, at: s(t) })), min(3), 1);
expect("长音效压在人声上", [{ name: "whoosh-slow", at: s(10) }], min(1), 1, [[s(9), s(20)]]);
expect("破例 allow 跳过检查", [{ name: "whoosh-slow", at: s(10), allow: "开场标题，人声刚好起" }], min(1), 0, [[s(9), s(20)]]);

// 音量：和人声重叠减半
const v1 = cueVolume({ name: "pop", at: s(10) }, fps, [[s(9), s(12)]]);
const v2 = cueVolume({ name: "pop", at: s(10) }, fps, []);
console.log(`${v1 === v2 / 2 ? "✔" : "✖"} 人声重叠音量减半：${v2} → ${v1}`);
if (v1 !== v2 / 2) fail++;

// 背景音乐压低：impact 期间 0.5，前后过渡，远处 1
const duck = sfxDuck([{ name: "impact", at: s(10) }], fps);
const pts = [s(5), s(10) - 2, s(10), s(11), s(20)].map((f) => duck(f).toFixed(2));
console.log(`背景音乐倍数（5s, 冲击前2帧, 冲击, +1s, 20s）：${pts.join(" ")}`);
if (pts[0] !== "1.00" || pts[2] !== "0.50" || pts[4] !== "1.00") fail++;

console.log(fail ? `\n✖ ${fail} 项不符合预期` : "\n✔ 全部符合预期");
process.exit(fail ? 1 : 0);
