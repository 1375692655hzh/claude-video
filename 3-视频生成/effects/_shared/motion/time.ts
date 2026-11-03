// 节奏规则和时间工具。所有动效都只依赖"本段开始后的毫秒数"，同一帧永远画出同一个画面。
// 时间分级参考 wise-motion（Apache-2.0，github.com/wisewong6/wise-motion）：
//   起步留白 150ms → 主动作 600 / 1200 / 1800 / 2400ms 四档 → 结束定格 450ms 再切。
import { useCurrentFrame, useVideoConfig } from "remotion";

export const LEAD = 150; // 每个动作开始前的留白
export const HOLD = 450; // 动作结束后的定格

export const clamp = (v: number, a = 0, b = 1) => Math.min(b, Math.max(a, v));
export const lerp = (a: number, b: number, p: number) => a + (b - a) * p;

export type EaseFn = (p: number) => number;
export const ease = {
  linear: ((p) => p) as EaseFn,
  outCubic: ((p) => 1 - Math.pow(1 - p, 3)) as EaseFn,
  inOutCubic: ((p) => (p < 0.5 ? 4 * p * p * p : 1 - Math.pow(-2 * p + 2, 3) / 2)) as EaseFn,
  outQuart: ((p) => 1 - Math.pow(1 - p, 4)) as EaseFn,
  outBack: ((p) => {
    const c1 = 1.70158;
    const c3 = c1 + 1;
    return 1 + c3 * Math.pow(p - 1, 3) + c1 * Math.pow(p - 1, 2);
  }) as EaseFn,
  inCubic: ((p) => p * p * p) as EaseFn,
};

/** t 在 [start, start+dur] 里的进度（0→1，已缓动） */
export const seg = (t: number, start: number, dur: number, e: EaseFn = ease.outCubic) => e(clamp((t - start) / dur));

/** 阻尼回摆：p=0 时为 1，越过 0 后回摆停稳 */
export const settle = (p: number, k = 6, w = 3) => Math.exp(-k * p) * Math.cos(w * Math.PI * p);

/** 当前 Sequence 内的毫秒数 */
export const useMs = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  return (frame / fps) * 1000;
};

export const msToFrames = (ms: number, fps: number) => Math.ceil((ms / 1000) * fps);

export const MINUS = "−";
export const pad2 = (n: number) => (n < 10 ? `0${n}` : `${n}`);
export const signed = (v: number, d = 1, prefix = "", suffix = "", plus = false) =>
  `${v < 0 ? MINUS : plus ? "+" : ""}${prefix}${Math.abs(v).toFixed(d)}${suffix}`;
