import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { AvatarHost } from "../_shared/AvatarHost";
import { Bgm } from "../_shared/Bgm";

// 演示：开场主持人全屏，4 秒后缩到右下角，让出画面给图表。
export const AvatarHostDemo: React.FC<{ src: string; pipAt: number }> = ({ src, pipAt }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const pip = spring({ frame: frame - pipAt, fps, config: { damping: 200 }, durationInFrames: 30 });
  const bars = [42, 58, 51, 73, 88, 96];

  return (
    <AbsoluteFill style={{ background: "linear-gradient(135deg, #0b1324 0%, #13233f 100%)", fontFamily: "sans-serif" }}>
      <AbsoluteFill style={{ padding: "90px 120px", opacity: pip, color: "white" }}>
        <div style={{ fontSize: 64, fontWeight: 700 }}>数字人主持人 · 画中画演示</div>
        <div style={{ fontSize: 32, opacity: 0.7, marginTop: 16 }}>主持人缩到角落，主画面留给图表和素材</div>
        <div style={{ display: "flex", alignItems: "flex-end", gap: 36, height: 520, marginTop: 80, width: 1100 }}>
          {bars.map((v, i) => {
            const grow = spring({ frame: frame - pipAt - 10 - i * 4, fps, config: { damping: 200 } });
            return (
              <div key={i} style={{ flex: 1, height: `${v * grow}%`, borderRadius: 12, background: "#38bdf8" }}>
                <div style={{ textAlign: "center", fontSize: 28, marginTop: -44, opacity: grow }}>
                  {Math.round(interpolate(grow, [0, 1], [0, v]))}
                </div>
              </div>
            );
          })}
        </div>
      </AbsoluteFill>
      <AvatarHost src={src} pip={pip} />
      <Bgm track="bgm-tech-steady" volume={0.08} />
    </AbsoluteFill>
  );
};
