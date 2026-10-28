// 共享的视觉语言：配色、字体、卡片、标题、角标、动画工具函数。
import React from "react";
import {
  Easing,
  Img,
  OffthreadVideo,
  Sequence,
  interpolate,
  spring,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";

export const C = {
  bg: "#06101f",
  bg2: "#0b1d38",
  panel: "rgba(14, 34, 66, 0.78)",
  line: "rgba(120, 170, 230, 0.22)",
  white: "#f4f8ff",
  muted: "#8ea6c8",
  cyan: "#2ee6f0",
  cyanSoft: "rgba(46, 230, 240, 0.16)",
  orange: "#ff9a3c",
  orangeSoft: "rgba(255, 154, 60, 0.16)",
  gray: "#4b5d78",
  green: "#76d672",
};

export const FONT = "CaspaSans, 'Noto Sans SC', 'Microsoft YaHei', sans-serif";

export const asset = (p: string) => staticFile(`caspa-ai-profit/${p}`);

// ---------- 动画工具 ----------
export const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;

/** 从 start 帧开始的弹性入场 0→1 */
export const useIn = (start: number, damping = 16, durationInFrames?: number) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  return spring({ frame: frame - start, fps, config: { damping, mass: 0.7 }, durationInFrames });
};

/** 线性/缓动 0→1 */
export const useRamp = (start: number, len: number, ease = Easing.out(Easing.cubic)) => {
  const frame = useCurrentFrame();
  return interpolate(frame, [start, start + len], [0, 1], { ...clamp, easing: ease });
};

export const mix = (a: number, b: number, t: number) => a + (b - a) * t;

// ---------- 基础组件 ----------
export const Fade: React.FC<{
  start: number;
  end?: number;
  y?: number;
  x?: number;
  style?: React.CSSProperties;
  children: React.ReactNode;
}> = ({ start, end, y = 30, x = 0, style, children }) => {
  const frame = useCurrentFrame();
  const t = useIn(start);
  const out = end === undefined ? 1 : interpolate(frame, [end, end + 12], [1, 0], clamp);
  return (
    <div
      style={{
        opacity: Math.min(t, out),
        transform: `translate(${(1 - t) * x}px, ${(1 - t) * y}px)`,
        ...style,
      }}
    >
      {children}
    </div>
  );
};

export const Title: React.FC<{
  children: React.ReactNode;
  size?: number;
  color?: string;
  style?: React.CSSProperties;
}> = ({ children, size = 84, color = C.white, style }) => (
  <div
    style={{
      fontFamily: FONT,
      fontWeight: 900,
      fontSize: size,
      color,
      letterSpacing: 2,
      lineHeight: 1.15,
      textShadow: "0 6px 30px rgba(0,0,0,0.55)",
      ...style,
    }}
  >
    {children}
  </div>
);

export const Text: React.FC<{
  children: React.ReactNode;
  size?: number;
  color?: string;
  weight?: number;
  style?: React.CSSProperties;
}> = ({ children, size = 40, color = C.white, weight = 500, style }) => (
  <div style={{ fontFamily: FONT, fontSize: size, color, fontWeight: weight, lineHeight: 1.35, ...style }}>
    {children}
  </div>
);

export const Card: React.FC<{
  children: React.ReactNode;
  accent?: string;
  glow?: number;
  dim?: boolean;
  dashed?: boolean;
  style?: React.CSSProperties;
}> = ({ children, accent = C.cyan, glow = 0, dim = false, dashed = false, style }) => (
  <div
    style={{
      background: dim ? "rgba(30, 42, 60, 0.6)" : C.panel,
      border: `2px ${dashed ? "dashed" : "solid"} ${dim ? C.gray : accent}`,
      borderRadius: 22,
      padding: "26px 34px",
      boxShadow: `0 0 ${40 * glow}px ${accent}${glow > 0 ? "88" : "00"}, 0 18px 50px rgba(0,0,0,0.45)`,
      backdropFilter: "blur(8px)",
      fontFamily: FONT,
      color: dim ? C.muted : C.white,
      ...style,
    }}
  >
    {children}
  </div>
);

export const Pill: React.FC<{ children: React.ReactNode; color?: string; size?: number; style?: React.CSSProperties }> = ({
  children,
  color = C.cyan,
  size = 26,
  style,
}) => (
  <div
    style={{
      display: "inline-block",
      fontFamily: FONT,
      fontSize: size,
      fontWeight: 700,
      color,
      border: `2px solid ${color}`,
      background: `${color}1f`,
      borderRadius: 999,
      padding: "6px 20px",
      ...style,
    }}
  >
    {children}
  </div>
);

/** 右上角说明角标，如“假设演示”“Andy分析” */
export const Badge: React.FC<{ children: React.ReactNode; color?: string }> = ({ children, color = C.orange }) => (
  <div style={{ position: "absolute", top: 120, right: 70 }}>
    <Pill color={color} size={24}>
      {children}
    </Pill>
  </div>
);

/** 图片完整置入深色底，带来源说明；不强行拉伸 */
export const Photo: React.FC<{
  src: string;
  credit?: string;
  w: number;
  h: number;
  fit?: "contain" | "cover";
  zoom?: [number, number];
  bg?: string;
  style?: React.CSSProperties;
}> = ({ src, credit, w, h, fit = "contain", zoom = [1, 1.06], bg = "#000", style }) => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();
  const s = interpolate(frame, [0, durationInFrames], zoom, clamp);
  return (
    <div
      style={{
        position: "relative",
        width: w,
        height: h,
        borderRadius: 20,
        overflow: "hidden",
        background: bg,
        border: `1px solid ${C.line}`,
        boxShadow: "0 24px 70px rgba(0,0,0,0.55)",
        ...style,
      }}
    >
      <Img
        src={asset(`img/${src}`)}
        style={{ width: "100%", height: "100%", objectFit: fit, transform: `scale(${s})` }}
      />
      {credit ? (
        <div
          style={{
            position: "absolute",
            left: 0,
            right: 0,
            bottom: 0,
            padding: "8px 16px",
            fontFamily: FONT,
            fontSize: 20,
            color: "#cfe0f7",
            background: "linear-gradient(transparent, rgba(0,0,0,0.75))",
            textAlign: "right",
          }}
        >
          {credit}
        </div>
      ) : null}
    </div>
  );
};

/** 视频片段（静音），镜头内第 startAt 帧开始、从素材第 from 秒播放，带来源角标 */
export const Clip: React.FC<{
  src: string;
  from?: number;
  startAt?: number;
  credit?: string;
  w: number;
  h: number;
  rate?: number;
  /** 放大裁掉素材底部（如原片自带字幕） */
  zoom?: number;
  style?: React.CSSProperties;
}> = ({ src, from = 0, startAt = 0, credit, w, h, rate = 1, zoom = 1, style }) => (
  <div
    style={{
      position: "relative",
      width: w,
      height: h,
      borderRadius: 20,
      overflow: "hidden",
      background: "#000",
      border: `1px solid ${C.line}`,
      boxShadow: "0 24px 70px rgba(0,0,0,0.55)",
      ...style,
    }}
  >
    <Sequence from={startAt} layout="none">
      <OffthreadVideo
        src={asset(`video/${src}`)}
        trimBefore={Math.round(from * 30)}
        playbackRate={rate}
        muted
        style={{ width: "100%", height: "100%", objectFit: "cover", transform: `scale(${zoom})`, transformOrigin: "50% 15%" }}
      />
    </Sequence>
    {credit ? (
      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          bottom: 0,
          padding: "8px 16px",
          fontFamily: FONT,
          fontSize: 20,
          color: "#cfe0f7",
          background: "linear-gradient(transparent, rgba(0,0,0,0.75))",
          textAlign: "right",
        }}
      >
        {credit}
      </div>
    ) : null}
  </div>
);

/** 全屏背景视频，压暗后作为氛围 */
export const BackdropClip: React.FC<{ src: string; from?: number; rate?: number; opacity?: number; label?: string }> = ({
  src,
  from = 0,
  rate = 1,
  opacity = 0.45,
  label,
}) => (
  <>
    <OffthreadVideo
      src={asset(`video/${src}`)}
      trimBefore={Math.round(from * 30)}
      playbackRate={rate}
      muted
      style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", opacity }}
    />
    <div
      style={{
        position: "absolute",
        inset: 0,
        background: "radial-gradient(ellipse at center, rgba(6,16,31,0.2) 0%, rgba(6,16,31,0.88) 85%)",
      }}
    />
    {label ? (
      <div style={{ position: "absolute", right: 70, top: 124, fontFamily: FONT, fontSize: 20, color: C.muted }}>
        {label}
      </div>
    ) : null}
  </>
);

/** 全屏背景照片（慢推），压暗后作为氛围 */
export const BackdropPhoto: React.FC<{ src: string; opacity?: number; label?: string }> = ({
  src,
  opacity = 0.45,
  label,
}) => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();
  const s = interpolate(frame, [0, durationInFrames], [1.04, 1.14], clamp);
  return (
    <>
      <Img
        src={asset(`img/${src}`)}
        style={{
          position: "absolute",
          inset: 0,
          width: "100%",
          height: "100%",
          objectFit: "cover",
          opacity,
          transform: `scale(${s})`,
        }}
      />
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: "radial-gradient(ellipse at center, rgba(6,16,31,0.15) 0%, rgba(6,16,31,0.85) 85%)",
        }}
      />
      {label ? (
        <div style={{ position: "absolute", right: 70, top: 124, fontFamily: FONT, fontSize: 20, color: C.muted }}>
          {label}
        </div>
      ) : null}
    </>
  );
};

/** 带箭头的连线，progress 控制绘制进度 */
export const Arrow: React.FC<{
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  progress: number;
  color?: string;
  width?: number;
  dashed?: boolean;
  label?: string;
  labelColor?: string;
}> = ({ x1, y1, x2, y2, progress, color = C.cyan, width = 5, dashed, label, labelColor }) => {
  const ang = Math.atan2(y2 - y1, x2 - x1);
  const ex = x1 + (x2 - x1) * progress;
  const ey = y1 + (y2 - y1) * progress;
  const head = 20;
  return (
    <svg style={{ position: "absolute", inset: 0, overflow: "visible", pointerEvents: "none" }} width={1920} height={1080}>
      <line
        x1={x1}
        y1={y1}
        x2={ex}
        y2={ey}
        stroke={color}
        strokeWidth={width}
        strokeLinecap="round"
        strokeDasharray={dashed ? "14 12" : undefined}
        style={{ filter: `drop-shadow(0 0 8px ${color})` }}
      />
      {progress > 0.05 ? (
        <polygon
          points={`${ex},${ey} ${ex - head * Math.cos(ang - 0.45)},${ey - head * Math.sin(ang - 0.45)} ${
            ex - head * Math.cos(ang + 0.45)
          },${ey - head * Math.sin(ang + 0.45)}`}
          fill={color}
        />
      ) : null}
      {label && progress > 0.5 ? (
        <text
          x={(x1 + x2) / 2 - Math.sin(ang) * 30}
          y={(y1 + y2) / 2 + Math.cos(ang) * -30 + 10}
          fill={labelColor ?? color}
          fontSize={34}
          fontWeight={800}
          fontFamily={FONT}
          textAnchor="middle"
          opacity={interpolate(progress, [0.5, 0.9], [0, 1], clamp)}
        >
          {label}
        </text>
      ) : null}
    </svg>
  );
};

/** 数字滚动 */
export const Counter: React.FC<{
  from: number;
  to: number;
  start: number;
  len?: number;
  decimals?: number;
  prefix?: string;
  suffix?: string;
  style?: React.CSSProperties;
}> = ({ from, to, start, len = 30, decimals = 0, prefix = "", suffix = "", style }) => {
  const t = useRamp(start, len, Easing.inOut(Easing.cubic));
  return (
    <span style={{ fontVariantNumeric: "tabular-nums", ...style }}>
      {prefix}
      {mix(from, to, t).toFixed(decimals)}
      {suffix}
    </span>
  );
};

/** 场景大标题区（左上），统一位置 */
export const SceneHead: React.FC<{ start?: number; kicker?: string; children: React.ReactNode; color?: string }> = ({
  start = 0,
  kicker,
  children,
  color,
}) => (
  <Fade start={start} style={{ position: "absolute", left: 90, top: 128 }}>
    {kicker ? (
      <Text size={28} color={C.cyan} weight={700} style={{ letterSpacing: 6, marginBottom: 8 }}>
        {kicker}
      </Text>
    ) : null}
    <Title size={72} color={color}>
      {children}
    </Title>
  </Fade>
);
