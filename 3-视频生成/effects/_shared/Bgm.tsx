import { Html5Audio, Sequence, interpolate, staticFile, useVideoConfig } from "remotion";
import { MUSIC } from "./music-library";

type Segment = { from: number; srcStart: number; length: number; fadeIn: boolean; fadeOut: boolean };

// 把曲子铺满整片：先放原曲开头到 loopEnd，再循环 loopStart–loopEnd（交叉淡化），
// 最后一段对齐到片尾，让原曲的自然结尾正好落在最后。片子比曲子短时只放开头一段，片尾淡出。
export function planSegments(
  total: number,
  track: { duration: number; loopStart: number; loopEnd: number },
  xf: number,
): Segment[] {
  const { duration, loopStart, loopEnd } = track;
  if (total <= duration) return [{ from: 0, srcStart: 0, length: total, fadeIn: false, fadeOut: false }];
  const segs: Segment[] = [{ from: 0, srcStart: 0, length: loopEnd, fadeIn: false, fadeOut: true }];
  let t = loopEnd - xf;
  while (total - t > duration - loopStart) {
    segs.push({ from: t, srcStart: loopStart, length: loopEnd - loopStart, fadeIn: true, fadeOut: true });
    t += loopEnd - loopStart - xf;
  }
  const remaining = total - t;
  segs.push({ from: t, srcStart: duration - remaining, length: remaining, fadeIn: true, fadeOut: false });
  return segs;
}

// 背景音乐。track 是 music-library.ts 里的 id。
// duck(frame) 返回 0–1 的倍数，用来在有人声时压低音乐，例如说话时 0.6、停顿时 1。
export const Bgm: React.FC<{
  track: string;
  volume?: number;
  duck?: (frame: number) => number;
  fadeInSec?: number;
  fadeOutSec?: number;
  crossfadeSec?: number;
}> = ({ track, volume = 0.12, duck, fadeInSec = 1.5, fadeOutSec = 2.5, crossfadeSec = 2 }) => {
  const { fps, durationInFrames } = useVideoConfig();
  const t = MUSIC[track];
  if (!t) throw new Error(`配乐库里没有 ${track}`);

  const segs = planSegments(durationInFrames / fps, t, crossfadeSec);
  const xf = crossfadeSec * fps;
  const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;

  return (
    <>
      {segs.map((s, i) => {
        const from = Math.round(s.from * fps);
        const len = Math.min(Math.round(s.length * fps), durationInFrames - from);
        return (
          <Sequence key={i} from={from} durationInFrames={len} layout="none">
            <Html5Audio
              src={staticFile(t.file)}
              trimBefore={Math.round(s.srcStart * fps)}
              volume={(f) => {
                const g = from + f;
                const edge =
                  (s.fadeIn ? interpolate(f, [0, xf], [0, 1], clamp) : 1) *
                  (s.fadeOut ? interpolate(f, [len - xf, len], [1, 0], clamp) : 1);
                const whole =
                  interpolate(g, [0, fadeInSec * fps], [0, 1], clamp) *
                  interpolate(g, [durationInFrames - fadeOutSec * fps, durationInFrames], [1, 0], clamp);
                return volume * edge * whole * (duck ? duck(g) : 1);
              }}
            />
          </Sequence>
        );
      })}
    </>
  );
};
