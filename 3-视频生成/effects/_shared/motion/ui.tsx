// 动效的积木：1920×1080 画布、卡片、标签、大数字、胶囊、入场样式、字体加载、实拍画面。
import React, { createContext, useContext, useEffect, useState } from "react";
import { AbsoluteFill, Img, OffthreadVideo, continueRender, delayRender, staticFile, useVideoConfig } from "remotion";
import { useTheme } from "./theme";
import { lerp } from "./time";

/** 共享字体：public/library/fonts/inter-var.woff2。在合成的最外层调用一次 */
export const useMotionFont = () => {
  const [handle] = useState(() => delayRender("load Inter (motion library)"));
  useEffect(() => {
    const faces = [
      new FontFace("Inter", `url(${staticFile("library/fonts/inter-var.woff2")})`, { weight: "100 900" }),
      ...[600, 700, 800, 900].map((w) => new FontFace("Montserrat", `url(${staticFile(`library/fonts/montserrat-latin-${w}-normal.woff2`)})`, { weight: String(w) })),
      ...([["Lora", "lora", [400, 600]], ["Space Grotesk", "space-grotesk", [500, 700]], ["JetBrains Mono", "jetbrains-mono", [400, 700]], ["Playfair Display", "playfair-display", [700, 900]]] as [string, string, number[]][]).flatMap(([fam, file, ws]) => ws.map((w) => new FontFace(fam, `url(${staticFile(`library/fonts/${file}-latin-${w}-normal.woff2`)})`, { weight: String(w) }))),
    ];
    Promise.all(faces.map((f) => f.load().then((x) => document.fonts.add(x)).catch(() => null))).then(() => continueRender(handle));
  }, [handle]);
};

/**
 * 所有动效都按 1920×1080 设计坐标排版。合成不是 1920×1080 时（如 1280×720 预览）整体等比缩放居中。
 * bg=true 时铺主题底色；叠在实拍或别的画面上时用 bg=false（透明）。
 */
// 框内模式：数据 / 卡片类动作原本按整屏（x 112–1808、y 120–980）排版；包在 <MotionFit> 里时，
// 这块区域整体等比缩进框架的左侧内容区（x 112、y 300、宽 1040），和参考图一样靠左、右侧留白。
const FitCtx = createContext(false);
export const MotionFit: React.FC<{ on?: boolean; children: React.ReactNode }> = ({ on = true, children }) => (
  <FitCtx.Provider value={on}>{children}</FitCtx.Provider>
);
const FIT_FROM = { x: 112, y: 120, w: 1696, h: 860 };
const FIT_TO = { x: 112, y: 300, w: 1040 };

export const Canvas: React.FC<{ bg?: boolean; children: React.ReactNode; style?: React.CSSProperties; content?: boolean }> = ({
  bg = false,
  children,
  style,
  content = false,
}) => {
  const t = useTheme();
  const fit = useContext(FitCtx) && content;
  const { width, height } = useVideoConfig();
  const k = Math.min(width / 1920, height / 1080);
  if (fit) {
    const s = FIT_TO.w / FIT_FROM.w;
    const inner = (
      <div style={{ position: "absolute", left: 0, top: 0, width: 1920, height: 1080, transformOrigin: "0 0", transform: `translate(${FIT_TO.x - FIT_FROM.x * s}px, ${FIT_TO.y - FIT_FROM.y * s}px) scale(${s})` }}>
        {children}
      </div>
    );
    return (
      <AbsoluteFill style={{ overflow: "hidden" }}>
        <div style={{ position: "absolute", left: (width - 1920 * k) / 2, top: (height - 1080 * k) / 2, width: 1920, height: 1080, transform: `scale(${k})`, transformOrigin: "0 0", fontFamily: t.font, color: t.ink, fontVariantNumeric: "tabular-nums", overflow: "hidden", ...style }}>
          {inner}
        </div>
      </AbsoluteFill>
    );
  }
  return (
    <AbsoluteFill style={{ overflow: "hidden" }}>
      <div
        style={{
          position: "absolute",
          left: (width - 1920 * k) / 2,
          top: (height - 1080 * k) / 2,
          width: 1920,
          height: 1080,
          transform: `scale(${k})`,
          transformOrigin: "0 0",
          fontFamily: t.font,
          color: t.ink,
          fontVariantNumeric: "tabular-nums",
          background: bg ? `${t.bgGlow}, ${t.bg}` : undefined,
          overflow: "hidden",
          ...style,
        }}
      >
        {children}
      </div>
    </AbsoluteFill>
  );
};

/** 主题底色（单独一层，放在多个动效下面） */
export const Backdrop: React.FC = () => {
  const t = useTheme();
  return <AbsoluteFill style={{ background: `${t.bgGlow}, ${t.bg}` }} />;
};

export const Card: React.FC<{ style?: React.CSSProperties; children?: React.ReactNode }> = ({ style, children }) => {
  const t = useTheme();
  return (
    <div
      style={{
        position: "absolute",
        background: t.card,
        border: `1px solid ${t.line}`,
        borderRadius: t.radius,
        boxShadow: t.shadow,
        boxSizing: "border-box",
        ...style,
      }}
    >
      {children}
    </div>
  );
};

/** 卡片里的小标题（全大写、字距放宽） */
export const Kicker: React.FC<{ children: React.ReactNode; style?: React.CSSProperties; color?: string }> = ({
  children,
  style,
  color,
}) => {
  const t = useTheme();
  return (
    <div style={{ fontSize: 24, fontWeight: 700, letterSpacing: "0.08em", color: color ?? t.ink3, ...style }}>{children}</div>
  );
};

export const Label: React.FC<{ children: React.ReactNode; style?: React.CSSProperties }> = ({ children, style }) => {
  const t = useTheme();
  return <div style={{ fontSize: 26, fontWeight: 600, color: t.ink2, ...style }}>{children}</div>;
};

export const Num: React.FC<{ children: React.ReactNode; style?: React.CSSProperties }> = ({ children, style }) => {
  const t = useTheme();
  return (
    <div
      style={{
        fontSize: 96,
        fontWeight: 800,
        letterSpacing: "-0.03em",
        fontVariantNumeric: "tabular-nums",
        color: t.ink,
        whiteSpace: "nowrap",
        ...style,
      }}
    >
      {children}
    </div>
  );
};

export const Chip: React.FC<{ children: React.ReactNode; fg: string; bg: string; style?: React.CSSProperties }> = ({
  children,
  fg,
  bg,
  style,
}) => (
  <span
    style={{
      display: "inline-flex",
      alignItems: "center",
      padding: "8px 18px",
      borderRadius: 999,
      fontSize: 22,
      fontWeight: 700,
      color: fg,
      background: bg,
      whiteSpace: "nowrap",
      ...style,
    }}
  >
    {children}
  </span>
);

/** 入场：上浮 + 轻微放大 + 淡入。p 为 0→1 进度 */
export const enter = (p: number, dy = 40, s0 = 0.96): React.CSSProperties => ({
  opacity: p,
  transform: `translateY(${(1 - p) * dy}px) scale(${lerp(s0, 1, p)})`,
});

const isVideo = (src: string) => /\.(mp4|webm|mov|m4v)$/i.test(src);

/**
 * 实拍画面：图片用 Img，视频用 OffthreadVideo（静音，跟随时间轴）。
 * src 传 staticFile("<期名>/video/x.mp4") 这样的完整地址；不传时显示占位插画（机房走廊）。
 * grade=true 时统一压暗、降饱和，让实拍和卡片界面放在一起不跳。
 */
export const Media: React.FC<{
  src?: string;
  zoom?: number;
  grade?: boolean;
  startFrom?: number; // 视频从第几秒开始
  style?: React.CSSProperties;
}> = ({ src, zoom = 1, grade = true, startFrom = 0, style }) => {
  const { fps } = useVideoConfig();
  const filter = grade ? "saturate(0.7) brightness(0.62) hue-rotate(-8deg)" : undefined;
  const fill: React.CSSProperties = { width: "100%", height: "100%", objectFit: "cover", filter };
  return (
    <div style={{ position: "absolute", overflow: "hidden", ...style }}>
      <div style={{ position: "absolute", inset: 0, transform: `scale(${zoom})`, transformOrigin: "50% 50%" }}>
        {!src ? (
          <PlaceholderAisle />
        ) : isVideo(src) ? (
          <OffthreadVideo src={src} muted trimBefore={Math.round(startFrom * fps)} style={fill} />
        ) : (
          <Img src={src} style={fill} />
        )}
      </div>
    </div>
  );
};

/** 没有素材时的占位插画：深色机房走廊 */
export const PlaceholderAisle: React.FC = () => {
  const lines = [120, 260, 400, 540, 680, 820];
  return (
    <svg width="100%" height="100%" viewBox="0 0 1920 1080" preserveAspectRatio="xMidYMid slice">
      <defs>
        <linearGradient id="aml-aisle" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#0E1626" />
          <stop offset="1" stopColor="#1B2840" />
        </linearGradient>
      </defs>
      <rect width="1920" height="1080" fill="url(#aml-aisle)" />
      <polygon points="0,0 820,400 820,560 0,1080" fill="#16223A" />
      <polygon points="1920,0 1100,400 1100,560 1920,1080" fill="#16223A" />
      <polygon points="820,400 1100,400 1100,560 820,560" fill="#9DB8FF" opacity={0.35} />
      <g stroke="#7FA2FF" strokeOpacity={0.5} strokeWidth={3}>
        {lines.map((y, i) => (
          <React.Fragment key={y}>
            <line x1={0} y1={y} x2={820} y2={420 + i * 25} />
            <line x1={1920} y1={y} x2={1100} y2={420 + i * 25} />
          </React.Fragment>
        ))}
      </g>
      <polygon points="820,560 1100,560 1920,1080 0,1080" fill="#0B1220" />
    </svg>
  );
};

/** 折线总长（用于描线动画，代替浏览器的 getTotalLength） */
export const polyLength = (pts: [number, number][]) => {
  let L = 0;
  for (let i = 1; i < pts.length; i++) L += Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1]);
  return L;
};
export const polyPath = (pts: [number, number][]) => "M" + pts.map((p) => `${p[0]} ${p[1]}`).join(" L");
