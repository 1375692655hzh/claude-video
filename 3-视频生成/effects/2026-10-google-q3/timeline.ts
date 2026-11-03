// 由配音时长（voice.json，ffprobe 实测）推算每个镜头、章节卡、字幕和人声区间的帧位置。
// 纯数据文件（不依赖 remotion），SRT 导出脚本（srt.ts）也从这里取。
import voice from "./voice.json";
import { toSubChunks } from "./subs";

export const FPS = 30;
const LEAD = 0.2; // 镜头开头到人声开始
const TAIL = 0.35; // 人声结束到镜头结束
const JOIN = 0.1; // 同一句话被拆成两镜时，两段之间的停顿
const CARD = 2.5; // 章节卡
const END_HOLD = 1.2; // 最后一句读完后停留

const f = (s: number) => Math.round(s * FPS);

export type Shot = {
  shot: number;
  from: number; // 镜头起点（全片帧）
  frames: number;
  voiceFrom: number; // 人声起点（全片帧）
  voiceFrames: number;
  name: string;
  text: string;
  chapter: number; // 0 = 开头，1–5 = 正文章节，6 = 收尾
};
export type Card = { chapter: number; from: number; frames: number };
export type Sub = { from: number; to: number; text: string };

type V = { name: string; shot: number; text: string; duration: number; chapter?: number; joinNext?: boolean };

const shots: Shot[] = [];
const cards: Card[] = [];
const subs: Sub[] = [];
let cursor = 0;
let chapter = 0;
let prevJoin = false;
for (const v of voice as V[]) {
  if (v.chapter) {
    chapter = v.chapter;
    cards.push({ chapter, from: cursor, frames: f(CARD) });
    cursor += f(CARD);
  }
  const from = cursor;
  const voiceFrom = from + (prevJoin ? 0 : f(LEAD));
  const voiceFrames = Math.ceil(v.duration * FPS);
  const end = voiceFrom + voiceFrames + f(v.joinNext ? JOIN : TAIL);
  shots.push({ shot: v.shot, from, frames: end - from, voiceFrom, voiceFrames, name: v.name, text: v.text, chapter });

  // 字幕：按块的"读音长度"分配这句话的时间
  const chunks = toSubChunks(v.text);
  const total = chunks.reduce((a, c) => a + c.weight, 0);
  let acc = 0;
  for (const c of chunks) {
    const a = voiceFrom + Math.round((acc / total) * voiceFrames);
    acc += c.weight;
    const b = voiceFrom + Math.round((acc / total) * voiceFrames);
    subs.push({ from: a, to: b, text: c.text });
  }
  prevJoin = !!v.joinNext;
  cursor = end;
}

export const SHOTS = shots;
export const CARDS = cards;
export const SUBS = subs;
export const TOTAL_FRAMES = cursor + f(END_HOLD);
export const SPEECH: [number, number][] = shots.map((s) => [s.voiceFrom, s.voiceFrom + s.voiceFrames]);

export const shotOf = (n: number) => {
  const s = shots.find((x) => x.shot === n);
  if (!s) throw new Error(`没有镜头 ${n}`);
  return s;
};
export const cardOf = (chapter: number) => {
  const c = cards.find((x) => x.chapter === chapter);
  if (!c) throw new Error(`没有章节卡 ${chapter}`);
  return c;
};

export const CHAPTER_TITLES: Record<number, { num: string; title: string; sub?: string }> = {
  1: { num: "01", title: "Did SpaceX Cut Google's Earnings by a Third?" },
  2: { num: "02", title: "Is AI Eating Google Search?" },
  3: { num: "03", title: "Google Cloud Doubled. Why Didn't It Save the Stock?" },
  4: { num: "04", title: "Why Did Free Cash Flow Turn Negative $9.1B?" },
  5: { num: "05", title: "How Much More Will Google Spend?", sub: "Why the market is cutting its multiple" },
  6: { num: "", title: "Wrap-up" },
};

const ts = (frame: number) => {
  const s = frame / FPS;
  return `${Math.floor(s / 60)}:${String(Math.floor(s % 60)).padStart(2, "0")}`;
};

/** YouTube 章节时间：开头 0:00，之后每章取章节卡的起点 */
export const youtubeChapters = () => [
  { at: ts(0), title: "Intro" },
  ...cards.map((c) => ({ at: ts(c.from), title: CHAPTER_TITLES[c.chapter].title })),
];
