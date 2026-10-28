// 由配音时长（voice.json，ffprobe 量出）推算每个镜头、每句话和每条字幕的帧位置。
import voice from "./voice.json";

export const FPS = 30;
const LEAD = 0.5; // 镜头开头留白（秒）
const GAP = 0.38; // 句间停顿
const TAIL = 0.7; // 镜头结尾留白
const EXTRA_GAP: Record<string, number> = {
  // 两句金句之间略停顿（镜头15）
  "s15-2": 0.6,
};

export type Line = { name: string; text: string; from: number; frames: number };
export type Shot = { shot: number; from: number; frames: number; lines: Line[] };
export type Sub = { from: number; to: number; text: string };

const f = (s: number) => Math.round(s * FPS);

/** 字幕切分：按标点断句，过长再按逗号切；英文字母按半个字计权重 */
const splitSubs = (text: string): string[] => {
  const parts = text
    .replace(/([。？！；])/g, "$1|")
    .split("|")
    .map((s) => s.trim())
    .filter(Boolean);
  const out: string[] = [];
  for (const p of parts) {
    if (p.length <= 24) {
      out.push(p);
      continue;
    }
    const pieces = p.replace(/([，：、——])/g, "$1|").split("|").filter(Boolean);
    let cur = "";
    for (const piece of pieces) {
      if ((cur + piece).length > 22 && cur) {
        out.push(cur);
        cur = piece;
      } else cur += piece;
    }
    if (cur) out.push(cur);
  }
  return out.map((s) => s.replace(/[，。；、：]$/, ""));
};

const weight = (s: string) => {
  let w = 0;
  for (const ch of s) w += /[A-Za-z0-9 ]/.test(ch) ? 0.55 : /[，。？！；：、“”—]/.test(ch) ? 0.4 : 1;
  return w;
};

const shots: Shot[] = [];
const subs: Sub[] = [];
let cursor = 0;
const shotIds = [...new Set(voice.map((v) => v.shot))];
for (const id of shotIds) {
  const items = voice.filter((v) => v.shot === id);
  const start = cursor;
  let t = start + f(LEAD);
  const lines: Line[] = [];
  items.forEach((v, i) => {
    if (i > 0) t += f(EXTRA_GAP[v.name] ?? GAP);
    const frames = Math.ceil(v.duration * FPS);
    lines.push({ name: v.name, text: v.text, from: t - start, frames });
    // 字幕
    const chunks = splitSubs(v.text);
    const total = chunks.reduce((a, c) => a + weight(c), 0);
    let acc = 0;
    for (const c of chunks) {
      const a = t + Math.round((acc / total) * frames);
      acc += weight(c);
      const b = t + Math.round((acc / total) * frames);
      subs.push({ from: a, to: b, text: c });
    }
    t += frames;
  });
  t += f(TAIL);
  shots.push({ shot: id, from: start, frames: t - start, lines });
  cursor = t;
}

export const SHOTS = shots;
export const SUBS = subs;
export const TOTAL_FRAMES = cursor + f(1.5);

/** 章节：镜头编号 → 章节序号（0 表示开场，不显示进度条） */
export const CHAPTERS = ["竞争", "配套", "存储", "融资", "利润"];
export const chapterOf = (shot: number) =>
  shot <= 3 ? 0 : shot <= 7 ? 1 : shot <= 10 ? 2 : shot <= 13 ? 3 : shot <= 17 ? 4 : shot <= 20 ? 5 : 0;
