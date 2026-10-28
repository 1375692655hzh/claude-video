import { AbsoluteFill, useCurrentFrame, useVideoConfig } from "remotion";
import { Bgm, planSegments } from "../_shared/Bgm";
import { MUSIC } from "../_shared/music-library";

// 试听配乐库里的曲子：按指定时长铺满，画面显示循环分段和播放位置，用来检查接缝。
export const BgmPreview: React.FC<{ track: string; seconds: number }> = ({ track }) => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();
  const t = MUSIC[track];
  const total = durationInFrames / fps;
  const segs = planSegments(total, t, 2);
  const now = frame / fps;
  const pct = (sec: number) => `${(sec / total) * 100}%`;

  return (
    <AbsoluteFill style={{ background: "#0b1324", color: "white", fontFamily: "sans-serif", padding: 120 }}>
      <div style={{ fontSize: 72, fontWeight: 700 }}>{t.title}</div>
      <div style={{ fontSize: 34, opacity: 0.7, marginTop: 16 }}>
        {t.mood} · {t.bpm} BPM · 原曲 {t.duration}s · 循环段 {t.loopStart}–{t.loopEnd}s
      </div>
      <div style={{ position: "relative", height: 140, marginTop: 120 }}>
        {segs.map((s, i) => (
          <div
            key={i}
            style={{
              position: "absolute",
              left: pct(s.from),
              width: pct(s.length),
              top: (i % 2) * 70,
              height: 60,
              borderRadius: 8,
              background: i % 2 ? "#0ea5e9" : "#38bdf8",
              fontSize: 26,
              padding: "14px 16px",
              boxSizing: "border-box",
              whiteSpace: "nowrap",
              overflow: "hidden",
            }}
          >
            原曲 {s.srcStart.toFixed(0)}–{(s.srcStart + s.length).toFixed(0)}s
          </div>
        ))}
        <div style={{ position: "absolute", left: pct(now), top: -20, bottom: -20, width: 4, background: "#f97316" }} />
      </div>
      <div style={{ fontSize: 40, marginTop: 60 }}>
        {Math.floor(now / 60)}:{String(Math.floor(now % 60)).padStart(2, "0")} / {Math.floor(total / 60)}:
        {String(Math.floor(total % 60)).padStart(2, "0")}
      </div>
      <Bgm track={track} volume={1} />
    </AbsoluteFill>
  );
};
