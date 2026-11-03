// 来自 projects/2026/11/2026-11-02-marvell-lumentum/05-制作/remotion/deco/（Gilded Deco），2026-11-03 收进公共风格库
import { Easing, interpolate, useCurrentFrame, useVideoConfig } from "remotion";

// 时间一律用毫秒写，换算成帧。所有动画只依赖时间。
export const useMs = () => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  return (f / fps) * 1000;
};

export const seg = (t: number, start: number, dur: number, ease: (n: number) => number = Easing.out(Easing.cubic)) =>
  interpolate(t, [start, start + dur], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: ease });

export const enter = (t: number, at: number) => {
  const p = seg(t, at, 600);
  return { opacity: p, transform: `translateY(${(1 - p) * 24}px) scale(${0.96 + 0.04 * p})` };
};
