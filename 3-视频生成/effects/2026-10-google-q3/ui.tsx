// 本期的视觉语言：配色（颜色只表达好坏）、Inter 字体、面板、柱子、标签、名字条、信源条、视频 / 图片底。
// 版式沿用 caspa-ai-profit（深海军蓝、细网格、spring 入场），频道名一律 Andy's Market Lens。
import React, { useEffect, useState } from "react";
import {
  AbsoluteFill,
  Easing,
  Img,
  OffthreadVideo,
  continueRender,
  delayRender,
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
  cyan: "#2ee6f0", // 增长 / 超预期
  red: "#ff5a4e", // 下滑 / 低于预期 / 负值
  orange: "#ff9a3c", // 一次性 / 提醒
  gray: "#4b5d78", // 预期值 / 对比基准
  cyanSoft: "rgba(46, 230, 240, 0.16)",
  redSoft: "rgba(255, 90, 78, 0.16)",
  orangeSoft: "rgba(255, 154, 60, 0.16)",
};
export type Tone = "cyan" | "red" | "orange" | "gray" | "white";
export const tone = (t: Tone) => (t === "gray" ? C.muted : C[t]);

export const FONT = "Inter, 'Segoe UI', Arial, sans-serif";
export const MINUS = "−";
export const asset = (p: string) => staticFile(`2026-10-google-q3/${p}`);
export const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;

export const useFont = () => {
  const [handle] = useState(() => delayRender("load Inter"));
  useEffect(() => {
    const face = new FontFace("Inter", `url(${asset("fonts/inter-var.woff2")})`, { weight: "100 900" });
    face
      .load()
      .then((f) => {
        document.fonts.add(f);
        continueRender(handle);
      })
      .catch((err) => {
        console.error(err);
        continueRender(handle);
      });
  }, [handle]);
};

// ---------- 动画工具 ----------
export const useIn = (start: number, damping = 16) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  return spring({ frame: frame - start, fps, config: { damping, mass: 0.7 } });
};
export const useRamp = (start: number, len: number, ease = Easing.out(Easing.cubic)) => {
  const frame = useCurrentFrame();
  return interpolate(frame, [start, start + len], [0, 1], { ...clamp, easing: ease });
};
export const mix = (a: number, b: number, t: number) => a + (b - a) * t;

// ---------- 基础组件 ----------
export const Fade: React.FC<{
  start?: number;
  end?: number;
  y?: number;
  x?: number;
  style?: React.CSSProperties;
  children: React.ReactNode;
}> = ({ start = 0, end, y = 30, x = 0, style, children }) => {
  const frame = useCurrentFrame();
  const t = useIn(start);
  const out = end === undefined ? 1 : interpolate(frame, [end, end + 10], [1, 0], clamp);
  return (
    <div style={{ opacity: Math.min(t, out), transform: `translate(${(1 - t) * x}px, ${(1 - t) * y}px)`, ...style }}>
      {children}
    </div>
  );
};

/** 内容区：四边 80px 安全区，底部留 150px 给字幕 */
export const Stage: React.FC<{ children: React.ReactNode; style?: React.CSSProperties; center?: boolean }> = ({
  children,
  style,
  center = true,
}) => (
  <AbsoluteFill
    style={{
      padding: "110px 100px 170px",
      fontFamily: FONT,
      color: C.white,
      display: "flex",
      flexDirection: "column",
      justifyContent: center ? "center" : "flex-start",
      alignItems: "center",
      gap: 36,
      fontVariantNumeric: "tabular-nums",
      ...style,
    }}
  >
    {children}
  </AbsoluteFill>
);

export const Title: React.FC<{ children: React.ReactNode; size?: number; color?: string; start?: number }> = ({
  children,
  size = 64,
  color = C.white,
  start = 0,
}) => (
  <Fade start={start} y={20}>
    <div style={{ fontSize: size, fontWeight: 800, color, textAlign: "center", lineHeight: 1.15, letterSpacing: -0.5 }}>
      {children}
    </div>
  </Fade>
);

export const Panel: React.FC<{ children: React.ReactNode; style?: React.CSSProperties; border?: string }> = ({
  children,
  style,
  border = C.line,
}) => (
  <div
    style={{
      background: C.panel,
      color: C.white,
      fontFamily: FONT,
      border: `1px solid ${border}`,
      borderRadius: 20,
      padding: "28px 40px",
      boxShadow: "0 20px 60px rgba(0,0,0,0.35)",
      ...style,
    }}
  >
    {children}
  </div>
);

/** 数字滚动。value 目标值；format 决定写法 */
export const Count: React.FC<{
  value: number;
  start?: number;
  len?: number;
  from?: number;
  format: (v: number) => string;
  style?: React.CSSProperties;
}> = ({ value, start = 0, len = 30, from = 0, format, style }) => {
  const t = useRamp(start, len);
  return <span style={{ fontVariantNumeric: "tabular-nums", ...style }}>{format(mix(from, value, t))}</span>;
};
export const money = (d = 1) => (v: number) => `${v < 0 ? MINUS : ""}$${Math.abs(v).toFixed(d)}B`;
export const pct = (d = 0, sign = false) => (v: number) => `${sign && v > 0 ? "+" : v < 0 ? MINUS : ""}${Math.abs(v).toFixed(d)}%`;

export const Tag: React.FC<{ children: React.ReactNode; t?: Tone; size?: number; start?: number; solid?: boolean }> = ({
  children,
  t = "cyan",
  size = 34,
  start = 0,
  solid = false,
}) => {
  const k = useIn(start, 13);
  const col = tone(t);
  return (
    <div
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 12,
        fontSize: size,
        fontWeight: 700,
        color: solid ? C.bg : col,
        background: solid ? col : `${col}22`,
        border: `2px solid ${col}`,
        borderRadius: 14,
        padding: `${size * 0.25}px ${size * 0.6}px`,
        opacity: k,
        transform: `scale(${mix(0.7, 1, k)})`,
        whiteSpace: "nowrap",
      }}
    >
      {children}
    </div>
  );
};

/** 印章：盖下来的动画 */
export const Stamp: React.FC<{ children: React.ReactNode; t?: Tone; start?: number; size?: number; rotate?: number }> = ({
  children,
  t = "red",
  start = 0,
  size = 72,
  rotate = -6,
}) => {
  const k = useIn(start, 11);
  const col = tone(t);
  return (
    <div
      style={{
        fontSize: size,
        fontWeight: 900,
        color: col,
        border: `6px solid ${col}`,
        borderRadius: 18,
        padding: `${size * 0.15}px ${size * 0.45}px`,
        opacity: Math.min(1, k * 1.5),
        transform: `rotate(${rotate}deg) scale(${mix(2.2, 1, k)})`,
        letterSpacing: 2,
        whiteSpace: "nowrap",
        background: `${col}14`,
      }}
    >
      {children}
    </div>
  );
};

/** 竖柱：value/max 决定高度；dashed = 预期值的灰虚线框 */
export const Bar: React.FC<{
  value: number;
  max: number;
  height?: number;
  width?: number;
  t?: Tone;
  start?: number;
  dashed?: boolean;
  label?: React.ReactNode;
  top?: React.ReactNode;
  negative?: boolean;
}> = ({ value, max, height = 520, width = 170, t = "cyan", start = 0, dashed = false, label, top, negative = false }) => {
  const k = useIn(start, 18);
  const h = (Math.abs(value) / max) * height * k;
  const col = tone(t);
  const bar = (
    <div
      style={{
        width,
        height: h,
        borderRadius: negative ? "0 0 10px 10px" : "10px 10px 0 0",
        background: dashed ? "transparent" : `linear-gradient(${negative ? 0 : 180}deg, ${col}, ${col}99)`,
        border: dashed ? `4px dashed ${C.gray}` : "none",
        boxShadow: dashed ? "none" : `0 0 30px ${col}44`,
        opacity: Math.min(1, k * 4),
      }}
    />
  );
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 14 }}>
      {!negative ? <div style={{ fontSize: 44, fontWeight: 800, color: dashed ? C.muted : col, opacity: k }}>{top}</div> : null}
      {bar}
      {negative ? <div style={{ fontSize: 44, fontWeight: 800, color: col, opacity: k }}>{top}</div> : null}
      {label ? <div style={{ fontSize: 30, fontWeight: 600, color: C.muted, textAlign: "center" }}>{label}</div> : null}
    </div>
  );
};

/** 横条 */
export const HBar: React.FC<{
  value: number;
  max: number;
  width?: number;
  t?: Tone;
  start?: number;
  label: React.ReactNode;
  right?: React.ReactNode;
  dashed?: boolean;
  thick?: number;
}> = ({ value, max, width = 1200, t = "cyan", start = 0, label, right, dashed = false, thick = 70 }) => {
  const k = useIn(start, 18);
  const col = tone(t);
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
      <div style={{ fontSize: 32, fontWeight: 600, color: C.muted, opacity: Math.min(1, k * 2) }}>{label}</div>
      <div style={{ display: "flex", alignItems: "center", gap: 24 }}>
        <div
          style={{
            width: (value / max) * width * k,
            height: thick,
            borderRadius: 10,
            background: dashed ? "transparent" : `linear-gradient(90deg, ${col}aa, ${col})`,
            border: dashed ? `4px dashed ${C.gray}` : "none",
            boxShadow: dashed ? "none" : `0 0 24px ${col}44`,
          }}
        />
        <div style={{ fontSize: 52, fontWeight: 800, color: dashed ? C.muted : col, opacity: k }}>{right}</div>
      </div>
    </div>
  );
};

export const Check: React.FC<{ start?: number; size?: number; color?: string }> = ({ start = 0, size = 80, color = C.cyan }) => {
  const k = useRamp(start, 14);
  return (
    <svg width={size} height={size} viewBox="0 0 100 100">
      <circle cx="50" cy="50" r="44" fill="none" stroke={color} strokeWidth="7" opacity={k} />
      <path d="M28 52 L44 67 L73 36" fill="none" stroke={color} strokeWidth="9" strokeLinecap="round" strokeDasharray="80" strokeDashoffset={80 * (1 - k)} />
    </svg>
  );
};
export const Cross: React.FC<{ start?: number; size?: number; color?: string }> = ({ start = 0, size = 80, color = C.red }) => {
  const k = useRamp(start, 14);
  return (
    <svg width={size} height={size} viewBox="0 0 100 100">
      <circle cx="50" cy="50" r="44" fill="none" stroke={color} strokeWidth="7" opacity={k} />
      <path d="M33 33 L67 67 M67 33 L33 67" fill="none" stroke={color} strokeWidth="9" strokeLinecap="round" strokeDasharray="100" strokeDashoffset={100 * (1 - k)} />
    </svg>
  );
};

/** 左上角 MY TAKE / MY READ 标签 + 两行大字 */
export const TakeCard: React.FC<{
  label: "MY TAKE" | "MY READ";
  line1: React.ReactNode;
  line2?: React.ReactNode;
  at2?: number;
  icon1?: React.ReactNode;
  icon2?: React.ReactNode;
}> = ({ label, line1, line2, at2 = 0, icon1, icon2 }) => (
  <Stage>
    <div style={{ position: "absolute", left: 100, top: 110 }}>
      <Tag t="orange" solid size={30}>
        {label}
      </Tag>
    </div>
    <Fade start={4}>
      <div style={{ display: "flex", alignItems: "center", gap: 30, fontSize: 76, fontWeight: 800, textAlign: "center", lineHeight: 1.15 }}>
        {line1}
        {icon1}
      </div>
    </Fade>
    {line2 ? (
      <Fade start={at2}>
        <div style={{ display: "flex", alignItems: "center", gap: 30, fontSize: 76, fontWeight: 800, textAlign: "center", lineHeight: 1.15 }}>
          {line2}
          {icon2}
        </div>
      </Fade>
    ) : null}
  </Stage>
);

/** 左下名字条 */
export const NameStrip: React.FC<{ name: string; role?: string; start?: number; dur?: number }> = ({
  name,
  role,
  start = 0,
  dur = 120,
}) => {
  const frame = useCurrentFrame();
  const k = useIn(start, 18);
  const out = interpolate(frame, [start + dur, start + dur + 12], [1, 0], clamp);
  return (
    <div
      style={{
        position: "absolute",
        left: 80,
        bottom: 180,
        display: "flex",
        alignItems: "stretch",
        opacity: Math.min(k, out),
        transform: `translateX(${(1 - k) * -60}px)`,
        fontFamily: FONT,
      }}
    >
      <div style={{ width: 8, background: C.cyan, borderRadius: 4 }} />
      <div style={{ background: "rgba(6,16,31,0.85)", padding: "12px 26px", borderRadius: "0 12px 12px 0" }}>
        <div style={{ fontSize: 38, fontWeight: 700, color: C.white }}>{name}</div>
        {role ? <div style={{ fontSize: 28, fontWeight: 500, color: C.muted }}>{role}</div> : null}
      </div>
    </div>
  );
};

/** 右上信源条 */
export const Source: React.FC<{ children: React.ReactNode; start?: number }> = ({ children, start = 6 }) => {
  const k = useIn(start, 20);
  return (
    <div
      style={{
        position: "absolute",
        right: 80,
        top: 52,
        fontFamily: FONT,
        fontSize: 24,
        fontWeight: 500,
        color: C.muted,
        opacity: k,
        background: "rgba(6,16,31,0.6)",
        padding: "6px 16px",
        borderRadius: 8,
      }}
    >
      Source: {children}
    </div>
  );
};

/** 视频底：压暗、可放大裁掉原片字幕；file 为 public/2026-10-google-q3/video/ 下的文件 */
export const VideoBg: React.FC<{
  file: string;
  from?: number; // 从片段第几秒开始
  scale?: number;
  dim?: number; // 0–1，压暗程度
  blur?: number;
  rate?: number;
  originY?: string;
}> = ({ file, from = 0, scale = 1.05, dim = 0.35, blur = 0, rate = 1, originY = "50%" }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const zoom = scale + frame * 0.0003;
  return (
    <AbsoluteFill style={{ overflow: "hidden" }}>
      <OffthreadVideo
        src={asset(`video/${file}`)}
        muted
        trimBefore={Math.round(from * fps)}
        playbackRate={rate}
        style={{
          width: "100%",
          height: "100%",
          objectFit: "cover",
          transform: `scale(${zoom})`,
          transformOrigin: `50% ${originY}`,
          filter: blur ? `blur(${blur}px)` : undefined,
        }}
      />
      <AbsoluteFill style={{ background: `rgba(6,16,31,${dim})` }} />
    </AbsoluteFill>
  );
};

/** 图片底：慢推 */
export const ImageBg: React.FC<{ file: string; dim?: number; blur?: number; fit?: "cover" | "contain"; push?: number; pos?: string }> = ({
  file,
  dim = 0.35,
  blur = 0,
  fit = "cover",
  push = 0.0004,
  pos = "50% 50%",
}) => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill style={{ overflow: "hidden", background: C.bg }}>
      <Img
        src={asset(`img/${file}`)}
        style={{
          width: "100%",
          height: "100%",
          objectFit: fit,
          objectPosition: pos,
          transform: `scale(${1.04 + frame * push})`,
          filter: blur ? `blur(${blur}px)` : undefined,
        }}
      />
      <AbsoluteFill style={{ background: `rgba(6,16,31,${dim})` }} />
    </AbsoluteFill>
  );
};

/** 底部渐暗，让字幕和标签在素材画面上看得清 */
export const BottomShade: React.FC = () => (
  <AbsoluteFill style={{ background: "linear-gradient(180deg, transparent 55%, rgba(6,16,31,0.85) 100%)" }} />
);
