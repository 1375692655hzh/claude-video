// 由配音时长（voice.json，ffprobe 实测）推算每个镜头、字幕和人声区间的帧位置。纯数据文件（不依赖 remotion）。
// 镜头顺序就是 voice.json 的顺序；没有配音的镜头（章节卡、开场 0.1）按 SILENT 给固定时长。
import voice from "./voice.json";
import { toSubChunks } from "./subs";

export const FPS = 30;
const LEAD = 0.2; // 镜头开头到人声开始
const TAIL = 0.35; // 人声结束到镜头结束
const SILENT: Record<string, number> = { "0.1": 3, "1.2": 2, "9.4": 20 }; // 片尾 ≥ 20 秒，留给 YouTube 片尾画面
const SILENT_DEFAULT = 3; // 章节卡

const f = (s: number) => Math.round(s * FPS);

export type Shot = {
  shot: string;
  chapter: number;
  from: number; // 镜头起点（全片帧）
  frames: number;
  voiceFrom: number; // 人声起点（全片帧）；无配音的镜头 = from
  voiceFrames: number; // 0 = 无配音
  text: string;
};
export type Sub = { from: number; to: number; text: string };

type V = { name: string; shot: string; text: string; duration: number };

const shots: Shot[] = [];
const subs: Sub[] = [];
let cursor = 0;
for (const v of voice as V[]) {
  const chapter = Number(v.shot.split(".")[0]);
  const from = cursor;
  if (!v.duration) {
    const frames = f(SILENT[v.shot] ?? SILENT_DEFAULT);
    shots.push({ shot: v.shot, chapter, from, frames, voiceFrom: from, voiceFrames: 0, text: "" });
    cursor += frames;
    continue;
  }
  const voiceFrom = from + f(LEAD);
  const voiceFrames = Math.ceil(v.duration * FPS);
  const end = voiceFrom + voiceFrames + f(TAIL);
  shots.push({ shot: v.shot, chapter, from, frames: end - from, voiceFrom, voiceFrames, text: v.text });

  // 字幕：按块的读音长度分配这句话的时间
  const chunks = toSubChunks(v.text);
  const total = chunks.reduce((a, c) => a + c.weight, 0);
  let acc = 0;
  for (const c of chunks) {
    const a = voiceFrom + Math.round((acc / total) * voiceFrames);
    acc += c.weight;
    const b = voiceFrom + Math.round((acc / total) * voiceFrames);
    subs.push({ from: a, to: b, text: c.text });
  }
  cursor = end;
}

export const SHOTS = shots;
export const SUBS = subs;
export const TOTAL_FRAMES = cursor;
export const SPEECH: [number, number][] = shots.filter((s) => s.voiceFrames).map((s) => [s.voiceFrom, s.voiceFrom + s.voiceFrames]);
export const LEAD_FRAMES = f(LEAD);

export const shotOf = (id: string) => {
  const s = shots.find((x) => x.shot === id);
  if (!s) throw new Error(`没有镜头 ${id}`);
  return s;
};

/** 某句话在镜头里出现的时间（毫秒，相对镜头起点）：按字符位置在这段配音里线性估算 */
export const cueMs = (id: string, phrase: string) => {
  const s = shotOf(id);
  const i = s.text.indexOf(phrase);
  if (i < 0) throw new Error(`镜头 ${id} 里没有 "${phrase}"`);
  return ((s.voiceFrom - s.from + (i / s.text.length) * s.voiceFrames) / FPS) * 1000;
};

/** 章节在全片里的起止帧（进度条用） */
export const chapterSpan = (chapter: number): [number, number] => {
  const list = shots.filter((s) => s.chapter === chapter);
  return [list[0].from, list[list.length - 1].from + list[list.length - 1].frames];
};

export const CHAPTER_NAMES = [
  "Cold open",
  "The report card",
  "Layer 1 · Profits",
  "Layer 2 · Cash flow",
  "Layer 3 · Funding model",
  "Is AI eating Search?",
  "Cloud · three discounts",
  "Control group · Microsoft",
  "What's next",
  "Close",
];
