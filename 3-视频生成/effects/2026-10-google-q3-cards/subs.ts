// 字幕：终稿里数字已经是画面写法（"$8.7 billion"），只把 billion 缩成 B；
// 再切成每块 ≤ 52 字符的单行字幕（字幕条居中，不碰左下角数字人圆圈）。纯数据函数，timeline.ts 用。

const MAX = 52;

export const toScreenText = (spoken: string): string =>
  spoken
    .replace(/\$(\d+(?:\.\d+)?) billion/g, "$$$1B")
    .replace(/negative \$/g, "−$")
    .replace(/(\d+(?:\.\d+)?) percent/g, "$1%");

// 意群断行：优先在连词 / 介词 / 关系词前断，不让一行以冠词、介词、连词结尾，也不拆开 "$2.4B to $13.3B" 这类数字区间
const BREAK_BEFORE = new Set(["and", "but", "so", "which", "that", "while", "when", "because", "from", "to", "with", "for", "than", "or", "if", "whether", "as", "in", "into", "before", "after", "since", "until"]);
const NO_END = new Set(["a", "an", "the", "of", "to", "in", "on", "at", "for", "with", "and", "but", "or", "from", "by", "is", "was", "its", "their", "our", "your", "this", "that", "more", "less", "about", "roughly", "than"]);
const bare = (w: string) => w.toLowerCase().replace(/[^a-z]/g, "");

/** 按词切成两半：长度接近 + 断在意群边界 */
const halve = (p: string): string[] => {
  const words = p.split(" ");
  let best = 1;
  let bestScore = Infinity;
  for (let i = 1; i < words.length; i++) {
    const a = words.slice(0, i).join(" ").length;
    let score = Math.abs(a - (p.length - a));
    const prev = words[i - 1];
    const next = words[i];
    if (/[,;:]$/.test(prev)) score -= 14;
    if (BREAK_BEFORE.has(bare(next))) score -= 8;
    if (NO_END.has(bare(prev))) score += 20;
    if (/\d/.test(prev) && bare(next) === "to") score += 20; // 数字区间
    if (score < bestScore) {
      bestScore = score;
      best = i;
    }
  }
  return [words.slice(0, best).join(" "), words.slice(best).join(" ")];
};

const splitLong = (p: string): string[] => {
  if (p.length <= MAX) return [p];
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
    return out.flatMap((o) => (o.length <= MAX ? [o] : halve(o).flatMap(splitLong)));
  }
  return halve(p).flatMap(splitLong);
};

/** 一句话的字幕块；weight 按字符数估读音长度，数字和 % 读起来更长 */
export const toSubChunks = (spoken: string): { text: string; weight: number }[] =>
  toScreenText(spoken)
    .split(/(?<=[.?!])\s+/)
    .filter(Boolean)
    .flatMap(splitLong)
    .map((text) => ({ text, weight: text.length + (text.match(/\$[\d.]+B?/g) ?? []).length * 8 + (text.match(/%/g) ?? []).length * 6 }));
