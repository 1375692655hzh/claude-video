import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { SFX, Sfx, SfxName } from "../_shared/Sfx";

// 依次试听音效库：每个音效占 GAP 帧，当前播放的一行高亮。
export const GAP = 75;
const NAMES = Object.keys(SFX) as SfxName[];

export const SfxPreview: React.FC = () => {
  const frame = useCurrentFrame();
  const current = Math.floor(frame / GAP);

  return (
    <AbsoluteFill style={{ background: "#0b1324", color: "white", fontFamily: "sans-serif", padding: "80px 140px" }}>
      <div style={{ fontSize: 60, fontWeight: 700, marginBottom: 40 }}>常用音效库</div>
      {NAMES.map((n, i) => {
        const on = i === current;
        const t = on ? (frame - i * GAP) / GAP : 0;
        return (
          <div
            key={n}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 32,
              height: 96,
              padding: "0 28px",
              borderRadius: 14,
              background: on ? "rgba(56,189,248,0.18)" : "transparent",
              opacity: on ? 1 : 0.45,
              fontSize: 34,
            }}
          >
            <div style={{ width: 260, fontWeight: 700 }}>{SFX[n].title}</div>
            <div style={{ width: 240, fontFamily: "monospace", opacity: 0.8, whiteSpace: "nowrap" }}>{n}</div>
            <div style={{ flex: 1, opacity: 0.8 }}>{SFX[n].use}</div>
            <div style={{ width: 160, height: 8, borderRadius: 4, background: "rgba(255,255,255,0.15)" }}>
              <div
                style={{
                  width: `${interpolate(t, [0, 1], [0, 100])}%`,
                  height: "100%",
                  borderRadius: 4,
                  background: "#38bdf8",
                }}
              />
            </div>
          </div>
        );
      })}
      {NAMES.map((n, i) => (
        // 按默认音量的比例放大到能听清，保留各音效之间的相对响度
        <Sfx key={n} name={n} at={i * GAP + 10} volume={SFX[n].volume / 0.3} />
      ))}
    </AbsoluteFill>
  );
};
