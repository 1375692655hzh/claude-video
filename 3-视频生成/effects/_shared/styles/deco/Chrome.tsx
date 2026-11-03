// 来自 projects/2026/11/2026-11-02-marvell-lumentum/05-制作/remotion/deco/（Gilded Deco），2026-11-03 收进公共风格库
import React from "react";
import { AbsoluteFill, Img, staticFile } from "remotion";
import { C, F, GEM, SAFE } from "./tokens";
import { Corner, Fan, Rule } from "./Ornaments";
import { enter, seg, useMs } from "./anim";

// 底：虚化实拍 + 暗角。src 为 staticFile 路径（assets/…）
export const Backdrop: React.FC<{ src?: string; spanMs?: number; dim?: number }> = ({ src, spanMs = 6000, dim = 0.38 }) => {
  const t = useMs();
  const z = 1 + 0.06 * Math.min(1, t / spanMs);
  return (
    <AbsoluteFill style={{ background: C.bg, overflow: "hidden" }}>
      {src && <Img src={src.startsWith("/") || src.startsWith("http") ? src : staticFile(src)} style={{ position: "absolute", inset: -40, width: "calc(100% + 80px)", height: "calc(100% + 80px)", objectFit: "cover", filter: `blur(18px) brightness(${dim}) saturate(0.8)`, transform: `scale(${z})` }} />}
      <AbsoluteFill style={{ background: "radial-gradient(75% 70% at 50% 45%, rgba(11,12,17,0) 0%, rgba(11,12,17,.55) 70%, rgba(11,12,17,.92) 100%)" }} />
    </AbsoluteFill>
  );
};

export const ChannelMark: React.FC = () => (
  <div style={{ position: "absolute", left: 56, top: 40, display: "flex", alignItems: "center", gap: 14 }}>
    <div style={{ width: 12, height: 12, transform: "rotate(45deg)", border: `1.5px solid ${C.gold}` }} />
    <div style={{ fontFamily: F.label, fontWeight: 700, fontSize: 24, letterSpacing: "0.2em", color: C.goldHi, opacity: 0.85 }}>ANDY'S MARKET LENS</div>
  </div>
);

export const SourceTag: React.FC<{ children: React.ReactNode; at?: number }> = ({ children, at = 300 }) => {
  const t = useMs();
  return (
    <div style={{ position: "absolute", right: 56, top: 40, fontFamily: F.display, fontWeight: 600, fontSize: 20, color: C.muted, letterSpacing: "0.04em", opacity: seg(t, at, 500) }}>
      <span style={{ fontFamily: F.label, color: C.gold, letterSpacing: "0.18em", marginRight: 10 }}>SOURCE</span>
      {children}
    </div>
  );
};

// 左下章节徽章（参考图左下的 ruby 标签）
export const ChapterBadge: React.FC<{ num: string; title: string; at?: number }> = ({ num, title, at = 0 }) => {
  const t = useMs();
  const p = seg(t, at, 600);
  return (
    <div style={{ position: "absolute", left: 56, bottom: 200, opacity: p, transform: `translateX(${(1 - p) * -30}px)` }}>
      <div style={{ position: "relative", padding: "14px 28px 16px 24px", background: `linear-gradient(135deg, ${GEM.ruby.a}, ${GEM.ruby.b})`, border: `1.5px solid ${C.gold}`, borderRadius: 4, boxShadow: "0 12px 30px rgba(0,0,0,.5)" }}>
        <div style={{ fontFamily: F.label, fontWeight: 700, fontSize: 18, letterSpacing: "0.24em", color: C.gold }}>CHAPTER {num}</div>
        <div style={{ fontFamily: F.display, fontWeight: 800, fontSize: 34, color: C.cream, marginTop: 4 }}>{title}</div>
      </div>
    </div>
  );
};

// 底部字幕（白字黑描边）
export const Caption: React.FC<{ text: string }> = ({ text }) => (
  <div style={{ position: "absolute", left: 0, right: 0, bottom: 48, display: "flex", justifyContent: "center" }}>
    <div style={{ maxWidth: 1500, textAlign: "center", fontFamily: F.display, fontWeight: 700, fontSize: 46, lineHeight: 1.25, color: "#FFFFFF", textShadow: "2px 0 0 #000, -2px 0 0 #000, 0 2px 0 #000, 0 -2px 0 #000, 1.5px 1.5px 0 #000, -1.5px -1.5px 0 #000, 1.5px -1.5px 0 #000, -1.5px 1.5px 0 #000, 0 6px 16px rgba(0,0,0,.85)" }}>{text}</div>
  </div>
);

// 状态胶囊：REPORTED TALKS · NOT SIGNED / ANDY'S ESTIMATE / COMPANY FORECAST
export const Tag: React.FC<{ children: React.ReactNode; tone?: "gold" | "ruby" | "emerald"; at?: number; style?: React.CSSProperties }> = ({ children, tone = "gold", at = 0, style }) => {
  const t = useMs();
  const col = tone === "ruby" ? C.down : tone === "emerald" ? C.up : C.goldHi;
  return (
    <div style={{ display: "inline-flex", alignItems: "center", gap: 10, padding: "8px 18px", border: `1px solid ${col}`, borderRadius: 999, background: "rgba(11,12,17,.7)", fontFamily: F.label, fontWeight: 700, fontSize: 18, letterSpacing: "0.2em", color: col, ...enter(t, at), ...style }}>
      <span style={{ width: 7, height: 7, borderRadius: 7, background: col }} />
      {children}
    </div>
  );
};

// 标题：大字 + 小号大写副标题 + 分隔线
export const Title: React.FC<{ title: string; sub?: string; at?: number; size?: number }> = ({ title, sub, at = 0, size = 64 }) => {
  const t = useMs();
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", ...enter(t, at) }}>
      <div style={{ fontFamily: F.display, fontWeight: 900, fontSize: size, color: C.cream, textShadow: `0 0 24px rgba(233,210,150,.25)`, textAlign: "center" }}>{title}</div>
      {sub && <div style={{ fontFamily: F.label, fontWeight: 600, fontSize: size * 0.3, letterSpacing: "0.3em", color: C.muted, marginTop: 10, textTransform: "uppercase" }}>{sub}</div>}
      <div style={{ marginTop: 18 }}>
        <Rule width={Math.min(900, size * 10)} />
      </div>
    </div>
  );
};

// 玻璃面板（参考图 2）
export const GlassPanel: React.FC<{ w: number; h: number; at?: number; tilt?: number; children: React.ReactNode; style?: React.CSSProperties }> = ({ w, h, at = 0, tilt = 0, children, style }) => {
  const t = useMs();
  return (
    <div style={{ perspective: 1800, ...style }}>
      <div style={{ position: "relative", width: w, height: h, background: C.glass, border: `1px solid rgba(201,169,97,.55)`, borderRadius: 10, boxShadow: "0 40px 90px rgba(0,0,0,.6), inset 0 0 80px rgba(201,169,97,.05)", backdropFilter: "blur(6px)", ...enter(t, at), transform: `rotateY(${tilt}deg) ${enter(t, at).transform}` }}>
        {children}
      </div>
    </div>
  );
};

// 金框媒体卡：清晰实拍 / 官方图只放在这里，带慢推
export const MediaCard: React.FC<{ src: string; w: number; h: number; at?: number; caption?: string; fit?: "cover" | "contain"; bg?: string; spanMs?: number; style?: React.CSSProperties }> = ({ src, w, h, at = 0, caption, fit = "cover", bg = "#0C0D11", spanMs = 5000, style }) => {
  const t = useMs();
  const z = 1.02 + 0.05 * Math.min(1, Math.max(0, t - at) / spanMs);
  return (
    <div style={{ position: "relative", width: w, height: h, ...enter(t, at), ...style }}>
      <div style={{ position: "absolute", inset: 0, borderRadius: 6, overflow: "hidden", background: bg, boxShadow: "0 30px 70px rgba(0,0,0,.6)" }}>
        <Img src={staticFile(src)} style={{ width: "100%", height: "100%", objectFit: fit, transform: `scale(${z})` }} />
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(180deg, rgba(0,0,0,0) 60%, rgba(0,0,0,.55) 100%)" }} />
      </div>
      <div style={{ position: "absolute", inset: 0, border: `2px solid ${C.gold}`, borderRadius: 6 }} />
      <div style={{ position: "absolute", inset: 8, border: `1px solid rgba(201,169,97,.5)`, borderRadius: 3 }} />
      <Corner style={{ position: "absolute", left: 4, top: 4 }} />
      <Corner style={{ position: "absolute", right: 4, top: 4, transform: "scaleX(-1)" }} />
      <Corner style={{ position: "absolute", left: 4, bottom: 4, transform: "scaleY(-1)" }} />
      <Corner style={{ position: "absolute", right: 4, bottom: 4, transform: "scale(-1,-1)" }} />
      {caption && <div style={{ position: "absolute", left: 26, bottom: 22, fontFamily: F.label, fontWeight: 700, fontSize: 18, letterSpacing: "0.2em", color: C.goldHi }}>{caption}</div>}
    </div>
  );
};

export const Safe: React.FC<{ children: React.ReactNode }> = ({ children }) => <AbsoluteFill style={{ padding: `0 ${SAFE}px` }}>{children}</AbsoluteFill>;
export { Fan };
