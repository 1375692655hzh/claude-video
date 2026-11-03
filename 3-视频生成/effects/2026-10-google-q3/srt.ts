// 导出 SRT 字幕和 YouTube 章节时间（和画面里的烧录字幕同一份数据）。
// 运行：npx esbuild effects/2026-10-google-q3/srt.ts --bundle --platform=node --format=cjs --outfile=out/google-q3-srt.cjs && node out/google-q3-srt.cjs
import { writeFileSync } from "node:fs";
import { FPS, SHOTS, SUBS, TOTAL_FRAMES, youtubeChapters } from "./timeline";

const stamp = (frame: number) => {
  const ms = Math.round((frame / FPS) * 1000);
  const p = (n: number, w = 2) => String(n).padStart(w, "0");
  return `${p(Math.floor(ms / 3600000))}:${p(Math.floor(ms / 60000) % 60)}:${p(Math.floor(ms / 1000) % 60)},${p(ms % 1000, 3)}`;
};

const srt = SUBS.map((s, i) => `${i + 1}\n${stamp(s.from)} --> ${stamp(s.to)}\n${s.text}\n`).join("\n");
writeFileSync("out/2026-10-google-q3.srt", srt, "utf8");

const voiced = SHOTS.reduce((a, s) => a + s.voiceFrames, 0) / FPS;
const words = SHOTS.reduce((a, s) => a + s.text.split(/\s+/).length, 0);
console.log(`字幕 ${SUBS.length} 条 → out/2026-10-google-q3.srt`);
console.log(`片长 ${(TOTAL_FRAMES / FPS).toFixed(1)} 秒；配音 ${voiced.toFixed(1)} 秒，${words} 词，${((words / voiced) * 60).toFixed(1)} 词/分钟`);
console.log("YouTube chapters:");
for (const c of youtubeChapters()) console.log(`${c.at} ${c.title}`);
console.log("镜头起点（帧）:", SHOTS.map((s) => `${s.shot}:${s.from}`).join(" "));
