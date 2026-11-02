// 字幕：口播按读法写数字（"51.4 billion dollars"），字幕照画面写法（"$51.4B"）；
// 再切成每块 ≤ 42 字符的单行字幕。纯数据函数，timeline.ts 和 srt.ts 共用。

const MAX = 42;
const MINUS = "−";

/** 读法 → 画面写法 */
export const toScreenText = (spoken: string): string => {
  let s = spoken;
  s = s.replace(/2 dollars and 12 cents/g, "$2.12");
  s = s.replace(/about 3 dollars/g, "about $3");
  s = s.replace(/(\d+)-billion-dollar/g, "$$$1B");
  s = s.replace(/(\d+(?:\.\d+)?) billion dollar backlog/g, "$$$1B backlog");
  s = s.replace(/(\d+) to (\d+) billion( dollars)?/g, "$$$1–$2B");
  s = s.replace(/(\d+(?:\.\d+)?) billion( dollars)?/g, "$$$1B");
  s = s.replace(/(\d+) million dollars/g, "$$$1M");
  s = s.replace(/from (\d+(?:\.\d+)?) to (\d+(?:\.\d+)?) percent/g, "from $1% to $2%");
  s = s.replace(/(\d+(?:\.\d+)?) percent/g, "$1%");
  s = s.replace(/negative \$/g, `${MINUS}$`);
  s = s.replace(/positive \$/g, "+$");
  s = s.replace(/R&D/g, "R&D");
  return s;
};

/** 读音长度：数字写法比读法短很多，按读法估计时长权重 */
const spokenWeight = (screen: string) =>
  screen.length + (screen.match(/\$[\d.–]+[BM]?/g) ?? []).length * 10 + (screen.match(/%/g) ?? []).length * 6;

const splitLong = (p: string): string[] => {
  if (p.length <= MAX) return [p];
  // 先按逗号、冒号切
  const parts = p.split(/(?<=[,:;])\s+/);
  if (parts.length > 1) {
    const out: string[] = [];
    let cur = "";
    for (const part of parts) {
      if (cur && (cur + " " + part).length > MAX) {
        out.push(cur);
        cur = part;
      } else cur = cur ? cur + " " + part : part;
    }
    if (cur) out.push(cur);
    // 太短的块（如 "$5.2B."）并回前一块，再按词对半切
    for (let i = out.length - 1; i > 0; i--) {
      if (out[i].length < 14 || (i === 1 && out[0].length < 14)) {
        const merged = out[i - 1] + " " + out[i];
        out.splice(i - 1, 2, ...(merged.length <= MAX ? [merged] : halve(merged)));
      }
    }
    if (out.every((o) => o.length <= MAX)) return out;
    return out.flatMap(splitLong);
  }
  return halve(p).flatMap(splitLong);
};

/** 按词切成长度接近的两半（不在 "$51.4B" 这类数字里断） */
const halve = (p: string): string[] => {
  const words = p.split(" ");
  let best = 1;
  let bestDiff = Infinity;
  for (let i = 1; i < words.length; i++) {
    const a = words.slice(0, i).join(" ").length;
    const diff = Math.abs(a - (p.length - a));
    if (diff < bestDiff) {
      bestDiff = diff;
      best = i;
    }
  }
  return [words.slice(0, best).join(" "), words.slice(best).join(" ")];
};

export const toSubChunks = (spoken: string): { text: string; weight: number }[] => {
  const screen = toScreenText(spoken);
  const sentences = screen.split(/(?<=[.?!])\s+/).filter(Boolean);
  return sentences.flatMap(splitLong).map((text) => ({ text, weight: spokenWeight(text) }));
};
