// 10 套 B-roll 模板风格（2026-11-05 从 ajiang-video-broll skill 移植，原模板见 .agents/skills/ajiang-video-broll/assets/themes/<id>/）。
// 移植的是外观（配色、字体、底纹 / 页眉、卡片、标题和大数字处理）；招牌动效由动效库负责。每套都实现 StyleKit 的同一组组件。
import React from "react";
import { Img } from "remotion";
import { Abs, BarCaption, Full, Grain, StyleKit, Tone } from "./kit";

type Pal = { up: string; down: string; accent: string; neutral: string };
const pick = (tone: Tone | undefined, c: Pal) => c[tone ?? "neutral"];
const Photo: React.FC<{ src: string; filter?: string; opacity?: number }> = ({ src, filter, opacity = 1 }) => (
  <Img src={src} style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", filter, opacity, transform: "scale(1.06)" }} />
);
const BRAND = "ANDY'S MARKET LENS";
const center = (align: "left" | "center") => (align === "center" ? { marginLeft: "auto", marginRight: "auto" } : {});

// ───────── paper-signal 纸白信号橙：瑞士国际主义海报，12 栏细线网格，唯一的信号橙
const PS = { bg: "#ECEAE4", fg: "#12110E", muted: "#7A766F", accent: "#F2561E", card: "#FFFFFF", line: "rgba(18,17,14,.12)", grid: "rgba(18,17,14,.07)", up: "#1F8A4C", down: "#C8361B", title: "'Inter Tight', Inter, sans-serif", num: "Geist, Inter, sans-serif", mono: "'Geist Mono', 'JetBrains Mono', monospace" };
const psPal: Pal = { up: PS.up, down: PS.down, accent: PS.accent, neutral: PS.fg };
const Sq: React.FC<{ c?: string }> = ({ c = PS.accent }) => <span style={{ display: "inline-block", width: 14, height: 14, background: c, marginRight: 14, verticalAlign: 1 }} />;
const Tick: React.FC<{ s: React.CSSProperties }> = ({ s }) => <i style={{ position: "absolute", width: 20, height: 20, borderColor: PS.fg, borderStyle: "solid", opacity: 0.55, ...s }} />;
export const PAPER_SIGNAL_KIT: StyleKit = {
  id: "paper-signal", theme: "paper-signal",
  Backdrop: ({ src }) => (
    <Full style={{ background: PS.bg }}>
      {src && <Photo src={src} filter="grayscale(1) contrast(1.1)" opacity={0.18} />}
      <Full style={{ backgroundImage: `linear-gradient(90deg, ${PS.grid} 1px, transparent 1px)`, backgroundSize: "145px 100%", backgroundPosition: "90px 0" }} />
    </Full>
  ),
  Panel: ({ w, h, focus, children, style }) => (
    <div style={{ position: "relative", width: w, height: h, background: PS.card, border: `1px solid ${PS.line}`, boxShadow: focus ? "0 18px 40px rgba(18,17,14,.18)" : "none", padding: 40, boxSizing: "border-box", fontFamily: PS.title, color: PS.fg, ...style }}>
      <div style={{ position: "absolute", left: 0, top: 0, height: 6, width: focus ? "100%" : 90, background: focus ? PS.accent : PS.fg }} />
      {children}
    </div>
  ),
  Title: ({ kicker, title, align = "left", size = 76 }) => (
    <div style={{ textAlign: align }}>
      {kicker && <div style={{ fontFamily: PS.mono, fontWeight: 500, fontSize: 24, letterSpacing: "0.18em", color: PS.fg }}><Sq />{kicker}</div>}
      <div style={{ fontFamily: PS.title, fontWeight: 900, fontSize: size, letterSpacing: "-0.045em", lineHeight: 1.04, color: PS.fg, marginTop: 14 }}>{title}</div>
    </div>
  ),
  BigNumber: ({ value, label, tone, size = 200 }) => (
    <div style={{ display: "inline-block", textAlign: "left" }}>
      <div style={{ fontFamily: PS.num, fontWeight: 700, fontSize: size, letterSpacing: "-0.05em", lineHeight: 1, color: pick(tone, psPal) }}>{value}</div>
      <div style={{ display: "flex", gap: 6, marginTop: 18 }}>{Array.from({ length: 24 }, (_, i) => <i key={i} style={{ width: 22, height: i % 4 === 0 ? 22 : 12, background: i < 17 ? PS.accent : PS.line }} />)}</div>
      {label && <div style={{ fontFamily: PS.mono, fontSize: 26, letterSpacing: "0.12em", textTransform: "uppercase", color: PS.muted, marginTop: 16 }}>{label}</div>}
    </div>
  ),
  Row: ({ k, v, tone }) => <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", padding: "14px 0", borderBottom: `1px solid ${PS.line}` }}><span style={{ fontFamily: PS.mono, fontSize: 22, letterSpacing: "0.1em", textTransform: "uppercase", color: PS.muted }}>{k}</span><span style={{ fontFamily: PS.num, fontSize: 52, fontWeight: 700, letterSpacing: "-0.03em", color: pick(tone, psPal) }}>{v}</span></div>,
  Chrome: ({ source }) => (
    <>
      <Tick s={{ left: 40, top: 36, borderWidth: "2px 0 0 2px" }} /><Tick s={{ left: 40, bottom: 36, borderWidth: "0 0 2px 2px" }} /><Tick s={{ right: 40, bottom: 36, borderWidth: "0 2px 2px 0" }} />
      <Abs x={90} y={44}><div style={{ fontFamily: PS.mono, fontWeight: 500, fontSize: 18, letterSpacing: "0.16em", color: PS.fg }}><Sq />{BRAND}</div></Abs>
      {source && <div style={{ position: "absolute", right: 90, top: 44, fontFamily: PS.mono, fontSize: 17, letterSpacing: "0.08em", color: PS.muted }}>SOURCE / {source}</div>}
    </>
  ),
  ChapterBadge: ({ num, title }) => <div style={{ position: "absolute", right: 90, top: 80, fontFamily: PS.mono, fontSize: 18, letterSpacing: "0.16em", color: PS.fg, textTransform: "uppercase" }}>SIGNAL / <b style={{ color: PS.accent, fontWeight: 500 }}>{num}</b> · {title}</div>,
  Caption: ({ text }) => <BarCaption text={text} font={PS.title} color={PS.bg} bg={PS.fg} size={40} weight={600} />,
};

// ───────── sticker-pop 贴纸波普：白板系统图，粗墨描边 + 彩色标题栏 + 硬投影
const SP = { bg: "#FCFEF3", ink: "#1C1624", muted: "#4A4452", c1: "#F58AE8", c2: "#BDEBF5", c3: "#A6EB9B", c4: "#F2CF63", ok: "#1E9B4B", red: "#E5383B", paper: "#FFFFFB", title: "'Archivo Black', sans-serif", sans: "'Space Grotesk', sans-serif", mono: "'Space Mono', monospace" };
const spPal: Pal = { up: SP.ok, down: SP.red, accent: SP.ink, neutral: SP.ink };
const spBar: Pal = { up: SP.c3, down: SP.c1, accent: SP.c4, neutral: SP.c2 };
export const STICKER_POP_KIT: StyleKit = {
  id: "sticker-pop", theme: "sticker-pop",
  Backdrop: () => <Full style={{ background: SP.bg, backgroundImage: "radial-gradient(rgba(28,22,36,.13) 2px, transparent 2.4px)", backgroundSize: "28px 28px" }} />,
  Panel: ({ w, h, tone, focus, children, style }) => (
    <div style={{ position: "relative", width: w, height: h, background: SP.paper, border: `4px solid ${SP.ink}`, borderRadius: 18, boxShadow: `${focus ? 12 : 8}px ${focus ? 12 : 8}px 0 ${SP.ink}`, padding: "84px 36px 30px", boxSizing: "border-box", fontFamily: SP.sans, color: SP.ink, transform: focus ? "rotate(-1deg)" : undefined, ...style }}>
      <div style={{ position: "absolute", left: 0, right: 0, top: 0, height: 50, background: pick(tone, spBar), borderBottom: `4px solid ${SP.ink}`, borderRadius: "13px 13px 0 0", display: "flex", gap: 10, alignItems: "center", paddingLeft: 18 }}>{[0, 1, 2].map((i) => <i key={i} style={{ width: 16, height: 16, borderRadius: "50%", border: `3px solid ${SP.ink}`, background: SP.paper }} />)}</div>
      {children}
    </div>
  ),
  Title: ({ kicker, title, align = "left", size = 74 }) => (
    <div style={{ textAlign: align }}>
      {kicker && <div style={{ display: "inline-block", fontFamily: SP.mono, fontWeight: 700, fontSize: 22, letterSpacing: "0.12em", background: SP.c1, color: SP.ink, border: `3px solid ${SP.ink}`, borderRadius: 999, padding: "4px 16px", boxShadow: `3px 3px 0 ${SP.ink}` }}>{kicker}</div>}
      <div style={{ fontFamily: SP.title, fontSize: size, lineHeight: 1.06, color: SP.ink, marginTop: 18 }}>{title}</div>
    </div>
  ),
  BigNumber: ({ value, label, tone, size = 190 }) => (
    <div style={{ display: "inline-block" }}>
      <div style={{ display: "inline-block", fontFamily: SP.title, fontSize: size, lineHeight: 1.05, color: pick(tone, spPal), background: tone === "accent" ? SP.c4 : SP.paper, border: `5px solid ${SP.ink}`, borderRadius: 24, padding: "4px 36px 12px", boxShadow: `10px 10px 0 ${SP.ink}`, transform: "rotate(-2deg)" }}>{value}</div>
      {label && <div style={{ fontFamily: SP.sans, fontWeight: 700, fontSize: 32, color: SP.ink, marginTop: 30 }}>{label}</div>}
    </div>
  ),
  Row: ({ k, v, tone }) => <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", padding: "12px 0", borderBottom: `3px dashed rgba(28,22,36,.3)` }}><span style={{ fontFamily: SP.sans, fontWeight: 700, fontSize: 26, color: SP.muted }}>{k}</span><span style={{ fontFamily: SP.title, fontSize: 48, color: pick(tone, spPal) }}>{v}</span></div>,
  Chrome: ({ source }) => (
    <>
      <div style={{ position: "absolute", right: 90, bottom: 34, fontFamily: SP.mono, fontWeight: 700, fontSize: 17, letterSpacing: "0.12em", background: SP.paper, color: SP.ink, border: `3px solid ${SP.ink}`, borderRadius: 999, padding: "5px 16px", boxShadow: `3px 3px 0 ${SP.ink}` }}>{BRAND}</div>
      {source && <div style={{ position: "absolute", right: 90, top: 40, fontFamily: SP.sans, fontWeight: 700, fontSize: 19, color: SP.ink, background: SP.c2, border: `3px solid ${SP.ink}`, borderRadius: 10, padding: "4px 12px" }}>Source: {source}</div>}
    </>
  ),
  ChapterBadge: ({ num, title }) => <Abs x={90} y={40}><div style={{ fontFamily: SP.title, fontSize: 24, color: SP.ink, background: SP.c4, border: `3px solid ${SP.ink}`, borderRadius: 12, padding: "6px 16px", boxShadow: `4px 4px 0 ${SP.ink}`, transform: "rotate(-2deg)" }}>{num} · {title}</div></Abs>,
  Caption: ({ text }) => (
    <div style={{ position: "absolute", left: 0, right: 0, bottom: 48, display: "flex", justifyContent: "center" }}>
      <div style={{ maxWidth: 1500, textAlign: "center", fontFamily: SP.sans, fontWeight: 700, fontSize: 40, lineHeight: 1.3, color: SP.ink, background: SP.paper, border: `4px solid ${SP.ink}`, borderRadius: 16, boxShadow: `6px 6px 0 ${SP.ink}`, padding: "8px 26px" }}>{text}</div>
    </div>
  ),
};

// ───────── mint-switch 黑白薄荷：近黑柔光舞台 + 一个薄荷绿，协议讲解式
const MT = { bg: "#0B0D0C", fg: "#F3F5EF", muted: "#8A8F86", accent: "#4DEB9F", card: "#141816", line: "rgba(245,246,240,.12)", down: "#FF6B5E", title: "'Inter Tight', Inter, sans-serif", mono: "'JetBrains Mono', monospace" };
const mtPal: Pal = { up: MT.accent, down: MT.down, accent: MT.accent, neutral: MT.fg };
export const MINT_SWITCH_KIT: StyleKit = {
  id: "mint-switch", theme: "mint-switch",
  Backdrop: ({ src }) => (
    <Full style={{ background: MT.bg }}>
      {src && <Photo src={src} filter="grayscale(.6) brightness(.32)" />}
      <Full style={{ backgroundImage: "linear-gradient(rgba(77,235,159,.05) 1px, transparent 1px), linear-gradient(90deg, rgba(77,235,159,.05) 1px, transparent 1px)", backgroundSize: "120px 120px" }} />
      <Full style={{ background: "radial-gradient(1100px 700px at 70% 30%, rgba(77,235,159,.10) 0%, rgba(11,13,12,0) 60%), radial-gradient(90% 90% at 50% 50%, rgba(0,0,0,0) 60%, rgba(4,10,7,.55) 100%)" }} />
    </Full>
  ),
  Panel: ({ w, h, focus, children, style }) => (
    <div style={{ position: "relative", width: w, height: h, background: MT.card, border: `1px solid ${focus ? MT.accent : MT.line}`, borderRadius: 22, boxShadow: focus ? "0 0 0 6px rgba(77,235,159,.12), 0 30px 70px rgba(4,10,7,.6)" : "0 30px 70px rgba(4,10,7,.6)", padding: 40, boxSizing: "border-box", fontFamily: MT.title, color: MT.fg, ...style }}>{children}</div>
  ),
  Title: ({ kicker, title, align = "left", size = 76 }) => (
    <div style={{ textAlign: align }}>
      {kicker && <div style={{ fontFamily: MT.mono, fontWeight: 700, fontSize: 24, letterSpacing: "0.16em", color: MT.accent }}>{kicker}</div>}
      <div style={{ fontFamily: MT.title, fontWeight: 800, fontSize: size, letterSpacing: "-0.03em", lineHeight: 1.1, color: MT.fg, marginTop: 12 }}>{title}</div>
    </div>
  ),
  BigNumber: ({ value, label, tone, size = 190 }) => (
    <div style={{ display: "inline-block" }}>
      <div style={{ fontFamily: MT.mono, fontWeight: 700, fontSize: size, letterSpacing: "-0.04em", lineHeight: 1, color: pick(tone, mtPal) }}>{value}</div>
      {label && <div style={{ display: "inline-block", marginTop: 26, fontFamily: MT.title, fontWeight: 700, fontSize: 30, color: "#0B1A12", background: "#DDF2E4", padding: "6px 18px", borderRadius: 8 }}>{label}</div>}
    </div>
  ),
  Row: ({ k, v, tone }) => <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", padding: "14px 0", borderBottom: `1px solid ${MT.line}` }}><span style={{ fontFamily: MT.mono, fontSize: 22, letterSpacing: "0.06em", color: MT.muted }}>{k}</span><span style={{ fontFamily: MT.mono, fontSize: 48, fontWeight: 700, color: pick(tone, mtPal) }}>{v}</span></div>,
  Chrome: ({ source }) => (
    <>
      <div style={{ position: "absolute", left: 90, bottom: 36, fontFamily: MT.mono, fontWeight: 700, fontSize: 17, letterSpacing: "0.16em", color: MT.muted, display: "flex", gap: 14, alignItems: "center" }}><i style={{ width: 10, height: 10, borderRadius: "50%", background: MT.accent }} />{BRAND}</div>
      <div style={{ position: "absolute", left: 90, right: 90, top: 30, display: "flex", gap: 8 }}>{[0, 1, 2, 3].map((i) => <i key={i} style={{ flex: 1, height: 4, borderRadius: 2, background: i < 2 ? MT.accent : MT.line }} />)}</div>
      {source && <div style={{ position: "absolute", right: 90, top: 52, fontFamily: MT.mono, fontSize: 17, color: MT.muted }}>SRC · {source}</div>}
    </>
  ),
  ChapterBadge: ({ num, title }) => <Abs x={90} y={52}><div style={{ fontFamily: MT.mono, fontWeight: 700, fontSize: 22, letterSpacing: "0.12em", color: MT.accent }}>STEP {num} <span style={{ color: MT.fg }}>/ {title.toUpperCase()}</span></div></Abs>,
  Caption: ({ text }) => <BarCaption text={text} font={MT.title} color={MT.fg} bg="rgba(11,13,12,.88)" size={40} weight={600} />,
};

// ───────── warm-haze 暖雾：暖色雾团 + 白色产品面板，慢而柔
const WH = { bg: "#F8F5EE", fg: "#1E1E1C", muted: "#8A877E", accent: "#4E7D54", accent2: "#E4A86C", down: "#C4553A", card: "#FFFFFF", line: "rgba(30,30,28,.10)", title: "'Inter Tight', Inter, sans-serif", sans: "Inter, sans-serif" };
const whPal: Pal = { up: WH.accent, down: WH.down, accent: WH.accent, neutral: WH.fg };
const Blob: React.FC<{ x: number; y: number; r: number; c: string }> = ({ x, y, r, c }) => <i style={{ position: "absolute", left: x - r, top: y - r, width: r * 2, height: r * 2, borderRadius: "50%", background: c, filter: "blur(110px)" }} />;
export const WARM_HAZE_KIT: StyleKit = {
  id: "warm-haze", theme: "warm-haze",
  Backdrop: ({ src }) => (
    <Full style={{ background: WH.bg }}>
      <Blob x={1500} y={220} r={420} c="rgba(228,168,108,.55)" /><Blob x={260} y={900} r={380} c="rgba(78,125,84,.40)" /><Blob x={1000} y={1000} r={300} c="rgba(228,168,108,.35)" />
      {src && <Photo src={src} filter="blur(18px) saturate(.8)" opacity={0.22} />}
    </Full>
  ),
  Panel: ({ w, h, focus, children, style }) => <div style={{ position: "relative", width: w, height: h, background: WH.card, border: `1px solid ${WH.line}`, borderRadius: 28, boxShadow: focus ? "0 40px 90px rgba(60,40,20,.26), 0 0 0 3px rgba(78,125,84,.35)" : "0 30px 80px rgba(60,40,20,.18)", padding: 40, boxSizing: "border-box", fontFamily: WH.sans, color: WH.fg, ...style }}>{children}</div>,
  Title: ({ kicker, title, align = "left", size = 76 }) => (
    <div style={{ textAlign: align }}>
      {kicker && <div style={{ fontFamily: WH.sans, fontWeight: 600, fontSize: 24, letterSpacing: "0.08em", color: WH.muted }}>{kicker}</div>}
      <div style={{ fontFamily: WH.title, fontWeight: 900, fontSize: size, letterSpacing: "-0.02em", lineHeight: 1.08, color: WH.fg, marginTop: 10 }}>{title}</div>
    </div>
  ),
  BigNumber: ({ value, label, tone, size = 190 }) => (
    <div style={{ display: "inline-block" }}>
      <div style={{ fontFamily: WH.title, fontWeight: 700, fontSize: size, letterSpacing: "-0.05em", lineHeight: 1, color: pick(tone, whPal) }}>{value}</div>
      {label && <div style={{ fontFamily: WH.sans, fontSize: 30, color: WH.muted, marginTop: 18 }}>{label}</div>}
    </div>
  ),
  Row: ({ k, v, tone }) => <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", padding: "14px 0", borderBottom: `1px solid ${WH.line}` }}><span style={{ fontFamily: WH.sans, fontSize: 26, color: WH.muted }}>{k}</span><span style={{ fontFamily: WH.title, fontSize: 50, fontWeight: 700, letterSpacing: "-0.03em", color: pick(tone, whPal) }}>{v}</span></div>,
  Chrome: ({ source }) => (
    <>
      <Abs x={90} y={44}><div style={{ fontFamily: WH.sans, fontWeight: 700, fontSize: 19, letterSpacing: "0.12em", color: WH.fg, display: "flex", gap: 12, alignItems: "center" }}><i style={{ width: 12, height: 12, borderRadius: "50%", background: WH.accent }} />{BRAND}</div></Abs>
      {source && <div style={{ position: "absolute", right: 90, top: 44, fontFamily: WH.sans, fontSize: 19, color: WH.muted }}>Source: {source}</div>}
    </>
  ),
  ChapterBadge: ({ num, title }) => <div style={{ position: "absolute", right: 90, top: 80, fontFamily: WH.sans, fontWeight: 700, fontSize: 20, color: WH.accent, background: "rgba(255,255,255,.7)", borderRadius: 999, padding: "6px 16px" }}>{num} · {title}</div>,
  Caption: ({ text }) => <div style={{ position: "absolute", left: 0, right: 0, bottom: 48, display: "flex", justifyContent: "center" }}><div style={{ maxWidth: 1500, textAlign: "center", fontFamily: WH.sans, fontWeight: 600, fontSize: 38, lineHeight: 1.3, color: "#F8F5EE", background: "#1E1E1C", borderRadius: 999, padding: "10px 34px" }}>{text}</div></div>,
};

// ───────── sticky-audit 便签复盘：冷白方格证据墙 + 四色阶段轨道
const SA = { bg: "#F4F4EC", fg: "#15141A", muted: "#8E8E86", p1: "#E4572E", p2: "#7A5AE0", p3: "#3461E0", p4: "#2FB67C", card: "#FAF9F4", line: "rgba(21,20,26,.12)", title: "'Inter Tight', Inter, sans-serif", mono: "'IBM Plex Mono', monospace", hand: "Caveat, cursive" };
const saPal: Pal = { up: SA.p4, down: SA.p1, accent: SA.p3, neutral: SA.fg };
export const STICKY_AUDIT_KIT: StyleKit = {
  id: "sticky-audit", theme: "sticky-audit",
  Backdrop: ({ src }) => (
    <Full style={{ background: SA.bg, backgroundImage: "linear-gradient(rgba(21,20,26,.06) 1px, transparent 1px), linear-gradient(90deg, rgba(21,20,26,.06) 1px, transparent 1px), linear-gradient(rgba(21,20,26,.035) 1px, transparent 1px), linear-gradient(90deg, rgba(21,20,26,.035) 1px, transparent 1px)", backgroundSize: "200px 200px, 200px 200px, 40px 40px, 40px 40px" }}>
      {src && <Photo src={src} filter="blur(10px) grayscale(.5)" opacity={0.2} />}
    </Full>
  ),
  Panel: ({ w, h, tone, focus, children, style }) => (
    <div style={{ position: "relative", width: w, height: h, background: SA.card, border: `1px solid ${SA.line}`, borderRadius: 6, boxShadow: "0 14px 30px rgba(21,20,26,.12)", outline: focus ? `3px dashed ${SA.p1}` : undefined, outlineOffset: 10, padding: "48px 38px 34px", boxSizing: "border-box", fontFamily: SA.title, color: SA.fg, ...style }}>
      <div style={{ position: "absolute", left: 24, top: -18, fontFamily: SA.mono, fontWeight: 600, fontSize: 18, color: "#fff", background: pick(tone, { ...saPal, neutral: SA.p2 }), padding: "4px 12px", borderRadius: 4 }}>{focus ? "#02 ✓" : "#01"}</div>
      {children}
    </div>
  ),
  Title: ({ kicker, title, align = "left", size = 74 }) => (
    <div style={{ textAlign: align }}>
      {kicker && <div style={{ fontFamily: SA.mono, fontWeight: 600, fontSize: 22, letterSpacing: "0.12em", color: SA.p1 }}>{"// "}{kicker}</div>}
      <div style={{ fontFamily: SA.title, fontWeight: 900, fontSize: size, letterSpacing: "-0.02em", lineHeight: 1.08, color: SA.fg, marginTop: 10 }}>{title}</div>
    </div>
  ),
  BigNumber: ({ value, label, tone, size = 180 }) => (
    <div style={{ display: "inline-block" }}>
      <div style={{ fontFamily: SA.mono, fontWeight: 600, fontSize: size, letterSpacing: "-0.04em", lineHeight: 1, color: pick(tone, saPal) }}>{value}</div>
      {label && <div style={{ display: "inline-block", marginTop: 22, fontFamily: SA.hand, fontWeight: 700, fontSize: 40, color: SA.fg, background: "#FFE27A", padding: "4px 20px", transform: "rotate(-1.5deg)", boxShadow: "0 8px 16px rgba(21,20,26,.15)" }}>{label}</div>}
    </div>
  ),
  Row: ({ k, v, tone }) => <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", padding: "13px 0", borderBottom: `1px solid ${SA.line}` }}><span style={{ fontFamily: SA.mono, fontSize: 22, color: SA.muted }}>{k}</span><span style={{ fontFamily: SA.mono, fontSize: 46, fontWeight: 600, color: pick(tone, saPal) }}>{v}</span></div>,
  Chrome: ({ source }) => (
    <>
      <Abs x={90} y={42}><div style={{ fontFamily: SA.mono, fontWeight: 600, fontSize: 18, letterSpacing: "0.12em", color: SA.fg }}>{BRAND} <span style={{ color: SA.muted }}>/ AUDIT LOG</span></div></Abs>
      <div style={{ position: "absolute", left: 90, right: 90, bottom: 28, display: "flex", gap: 10 }}>{[SA.p1, SA.p2, SA.p3, SA.p4].map((c, i) => <i key={c} style={{ flex: 1, height: 6, borderRadius: 3, background: c, opacity: i < 3 ? 1 : 0.25 }} />)}</div>
      {source && <div style={{ position: "absolute", right: 90, top: 42, fontFamily: SA.mono, fontSize: 17, color: SA.muted }}>src: {source}</div>}
    </>
  ),
  ChapterBadge: ({ num, title }) => <div style={{ position: "absolute", right: 90, top: 76, fontFamily: SA.mono, fontWeight: 600, fontSize: 19, color: "#fff", background: SA.fg, padding: "5px 12px", borderRadius: 4 }}>PHASE {num} · {title}</div>,
  Caption: ({ text }) => <BarCaption text={text} font={SA.title} color="#F4F4F8" bg="#15141A" size={40} weight={600} />,
};

// ───────── riso-print 孔版印刷：米纸 + 粉黄色带 + 粉蓝套印错位
const RP = { bg: "#ECE6D8", fg: "#1B72A8", pink: "#F0508C", yellow: "#F2D519", red: "#EE4B2B", ink: "#1E5A3A", card: "#EFEADF", muted: "#7E8FA6", title: "'Archivo Black', sans-serif", mono: "'DM Mono', monospace" };
const rpPal: Pal = { up: RP.ink, down: RP.red, accent: RP.pink, neutral: RP.fg };
const misreg = (c: string) => `5px 4px 0 ${c}`;
export const RISO_PRINT_KIT: StyleKit = {
  id: "riso-print", theme: "riso-print",
  Backdrop: ({ src }) => (
    <Full style={{ background: RP.bg }}>
      {src && <Photo src={src} filter="grayscale(1) contrast(1.3)" opacity={0.14} />}
      <div style={{ position: "absolute", right: -120, top: -60, width: 760, height: 220, transform: "rotate(-8deg)", background: `repeating-linear-gradient(45deg, ${RP.pink} 0 14px, transparent 14px 28px)`, opacity: 0.85, mixBlendMode: "multiply" }} />
      <div style={{ position: "absolute", left: -80, bottom: 60, width: 640, height: 120, transform: "rotate(4deg)", backgroundImage: `radial-gradient(${RP.yellow} 5px, transparent 5.5px)`, backgroundSize: "16px 16px", mixBlendMode: "multiply" }} />
      <i style={{ position: "absolute", right: 120, bottom: -160, width: 420, height: 420, borderRadius: "50%", background: RP.pink, opacity: 0.35, mixBlendMode: "multiply" }} />
      <i style={{ position: "absolute", right: -40, bottom: -60, width: 420, height: 420, borderRadius: "50%", background: RP.fg, opacity: 0.25, mixBlendMode: "multiply" }} />
      <Full style={{ backgroundImage: "radial-gradient(rgba(32,49,33,.18) .8px, transparent 1.2px)", backgroundSize: "5px 5px", opacity: 0.5 }} />
    </Full>
  ),
  Panel: ({ w, h, focus, children, style }) => <div style={{ position: "relative", width: w, height: h, background: RP.card, border: `3px solid ${RP.fg}`, boxShadow: `${focus ? 14 : 10}px ${focus ? 14 : 10}px 0 ${focus ? RP.pink : RP.yellow}`, padding: 38, boxSizing: "border-box", fontFamily: RP.mono, color: RP.fg, ...style }}>{children}</div>,
  Title: ({ kicker, title, align = "left", size = 76 }) => (
    <div style={{ textAlign: align }}>
      {kicker && <div style={{ display: "inline-block", fontFamily: RP.mono, fontWeight: 500, fontSize: 22, letterSpacing: "0.16em", color: RP.card, background: RP.pink, padding: "4px 14px" }}>{kicker}</div>}
      <div style={{ fontFamily: RP.title, fontSize: size, lineHeight: 1.1, color: RP.fg, textShadow: misreg("rgba(240,80,140,.7)"), marginTop: 16 }}>{title}</div>
    </div>
  ),
  BigNumber: ({ value, label, tone, size = 200 }) => (
    <div style={{ display: "inline-block" }}>
      <div style={{ fontFamily: RP.title, fontSize: size, lineHeight: 1, color: pick(tone, rpPal), textShadow: `8px 6px 0 rgba(27,114,168,.55)` }}>{value}</div>
      {label && <div style={{ display: "inline-block", marginTop: 22, fontFamily: RP.mono, fontWeight: 500, fontSize: 28, color: RP.fg, background: RP.card, border: `3px solid ${RP.fg}`, padding: "6px 18px" }}>{label}</div>}
    </div>
  ),
  Row: ({ k, v, tone }) => <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", padding: "12px 0", borderBottom: `2px dotted ${RP.fg}` }}><span style={{ fontFamily: RP.mono, fontSize: 24, color: RP.fg }}>{k}</span><span style={{ fontFamily: RP.title, fontSize: 46, color: pick(tone, rpPal) }}>{v}</span></div>,
  Chrome: ({ source }) => (
    <>
      <div style={{ position: "absolute", left: 40, bottom: 30, fontFamily: RP.mono, fontWeight: 500, fontSize: 17, letterSpacing: "0.16em", color: RP.fg, opacity: 0.8 }}>{BRAND}</div>
      {source && <div style={{ position: "absolute", right: 90, top: 44, fontFamily: RP.mono, fontWeight: 500, fontSize: 18, color: RP.fg, background: RP.card, padding: "2px 10px" }}>Source: {source}</div>}
    </>
  ),
  ChapterBadge: ({ num, title }) => <Abs x={90} y={44}><div style={{ fontFamily: RP.title, fontSize: 26, color: RP.card, background: RP.fg, padding: "6px 16px", boxShadow: `5px 5px 0 ${RP.pink}` }}>{num} / {title}</div></Abs>,
  Caption: ({ text }) => <BarCaption text={text} font={RP.mono} color={RP.fg} bg={RP.card} size={38} weight={500} />,
};

// ───────── showa-poster 昭和海报：黑页 + 慢转红色放射线 + 衬线巨字 + 倾斜红幅 + 方框判子
const SH = { bg: "#10110F", fg: "#F3F3E9", muted: "#8A8880", red: "#D4002F", up: "#8BC79A", card: "#171917", line: "rgba(243,243,233,.3)", title: "'Playfair Display', serif", mono: "Archivo, sans-serif" };
const shPal: Pal = { up: SH.up, down: SH.red, accent: SH.red, neutral: SH.fg };
export const SHOWA_POSTER_KIT: StyleKit = {
  id: "showa-poster", theme: "showa-poster",
  Backdrop: ({ src }) => (
    <Full style={{ background: SH.bg }}>
      {src && <Photo src={src} filter="grayscale(1) contrast(1.2) brightness(.35)" />}
      <div style={{ position: "absolute", left: 960 - 1700, top: 540 - 1700, width: 3400, height: 3400, background: "repeating-conic-gradient(from 0deg, rgba(175,0,36,.42) 0deg 5deg, transparent 5deg 15deg)", opacity: 0.55 }} />
      <Full style={{ background: "radial-gradient(70% 70% at 50% 50%, rgba(16,17,15,.2) 0%, rgba(14,10,8,.85) 100%)" }} />
      <Grain op={0.12} freq={1.4} blend="screen" />
    </Full>
  ),
  Panel: ({ w, h, focus, children, style }) => (
    <div style={{ position: "relative", width: w, height: h, background: SH.card, border: `2px solid ${focus ? SH.red : SH.line}`, padding: 40, boxSizing: "border-box", fontFamily: SH.mono, color: SH.fg, ...style }}>
      <i style={{ position: "absolute", left: 10, top: 10, right: 10, bottom: 10, border: `1px solid ${SH.line}`, pointerEvents: "none" }} />
      {focus && <div style={{ position: "absolute", right: -22, top: -22, width: 84, height: 84, border: `4px solid ${SH.red}`, color: SH.red, fontFamily: SH.title, fontVariantNumeric: "lining-nums", fontWeight: 900, fontSize: 26, display: "flex", alignItems: "center", justifyContent: "center", transform: "rotate(-8deg)", background: SH.bg }}>KEY</div>}
      {children}
    </div>
  ),
  Title: ({ kicker, title, align = "left", size = 84 }) => (
    <div style={{ textAlign: align }}>
      {kicker && <div style={{ fontFamily: SH.mono, fontWeight: 800, fontSize: 22, letterSpacing: "0.24em", color: SH.red }}>{kicker}</div>}
      <div style={{ fontFamily: SH.title, fontVariantNumeric: "lining-nums", fontWeight: 900, fontSize: size, letterSpacing: "0.01em", lineHeight: 1.05, color: SH.fg, marginTop: 12 }}>{title}</div>
      <div style={{ width: 220, height: 4, background: SH.red, marginTop: 22, ...center(align) }} />
    </div>
  ),
  BigNumber: ({ value, label, tone, size = 210 }) => (
    <div style={{ display: "inline-block" }}>
      <div style={{ fontFamily: SH.title, fontVariantNumeric: "lining-nums", fontWeight: 900, fontSize: size, lineHeight: 1, color: tone === "accent" ? SH.fg : pick(tone, shPal), textShadow: tone === "accent" ? `6px 6px 0 ${SH.red}` : undefined }}>{value}</div>
      {label && <div style={{ display: "inline-block", marginTop: 26, fontFamily: SH.mono, fontWeight: 800, fontSize: 28, letterSpacing: "0.18em", textTransform: "uppercase", color: SH.fg, background: SH.red, padding: "8px 28px", transform: "rotate(-3deg)" }}>{label}</div>}
    </div>
  ),
  Row: ({ k, v, tone }) => <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", padding: "13px 0", borderBottom: `1px solid ${SH.line}` }}><span style={{ fontFamily: SH.mono, fontWeight: 700, fontSize: 22, letterSpacing: "0.12em", textTransform: "uppercase", color: SH.muted }}>{k}</span><span style={{ fontFamily: SH.title, fontVariantNumeric: "lining-nums", fontWeight: 900, fontSize: 52, color: pick(tone, shPal) }}>{v}</span></div>,
  Chrome: ({ source }) => (
    <>
      <Abs x={90} y={44}><div style={{ fontFamily: SH.mono, fontWeight: 800, fontSize: 17, letterSpacing: "0.24em", color: SH.fg }}>{BRAND}<i style={{ display: "block", width: 200, height: 2, background: SH.red, marginTop: 8 }} /></div></Abs>
      {source && <div style={{ position: "absolute", right: 90, top: 44, fontFamily: SH.mono, fontWeight: 800, fontSize: 16, letterSpacing: "0.2em", textTransform: "uppercase", color: SH.muted }}>{source}</div>}
    </>
  ),
  ChapterBadge: ({ num, title }) => <div style={{ position: "absolute", right: 90, top: 84, display: "flex", alignItems: "center", gap: 14 }}><div style={{ fontFamily: SH.title, fontVariantNumeric: "lining-nums", fontWeight: 900, fontSize: 40, color: SH.bg, background: SH.fg, padding: "0 12px" }}>{num}</div><div style={{ fontFamily: SH.mono, fontWeight: 800, fontSize: 18, letterSpacing: "0.2em", textTransform: "uppercase", color: SH.fg }}>{title}</div></div>,
  Caption: ({ text }) => <BarCaption text={text} font={SH.mono} color={SH.fg} bg="rgba(16,17,15,.9)" size={38} weight={700} />,
};

// ───────── retro-sunburst 复古旭日：奶油放射条 + 橙色厚描边大字 + 金边白卡 + 锯齿金徽章
const RS = { bg: "#F8E9C8", fg: "#4F2E16", muted: "#895525", accent: "#F28C28", gold: "#F6C453", ok: "#5E8C3A", down: "#C4442A", card: "#FEFEFE", line: "rgba(79,46,22,.18)", title: "Rubik, sans-serif", mono: "'DM Mono', monospace" };
const rsPal: Pal = { up: RS.ok, down: RS.down, accent: RS.accent, neutral: RS.fg };
const Burst: React.FC<{ size: number; text: string }> = ({ size, text }) => {
  const pts = Array.from({ length: 32 }, (_, i) => { const r = i % 2 ? size * 0.42 : size * 0.5; const a = (i / 32) * Math.PI * 2; return `${size / 2 + r * Math.cos(a)},${size / 2 + r * Math.sin(a)}`; }).join(" ");
  return <svg width={size} height={size} style={{ display: "block" }}><polygon points={pts} fill={RS.gold} stroke={RS.fg} strokeWidth={3} /><text x="50%" y="54%" textAnchor="middle" dominantBaseline="middle" fontFamily="Rubik" fontWeight={900} fontSize={size * 0.24} fill={RS.fg}>{text}</text></svg>;
};
const stroke = (w: number): React.CSSProperties => ({ WebkitTextStroke: `${w}px ${RS.fg}`, paintOrder: "stroke fill", textShadow: `0 ${w * 0.9}px 0 ${RS.fg}` });
export const RETRO_SUNBURST_KIT: StyleKit = {
  id: "retro-sunburst", theme: "retro-sunburst",
  Backdrop: () => (
    <Full style={{ background: RS.bg }}>
      <div style={{ position: "absolute", left: -640, top: -1060, width: 3200, height: 3200, background: "repeating-conic-gradient(from 0deg, #FBEFD6 0deg 6deg, #F3D6A2 6deg 12deg)" }} />
      <Full style={{ background: "radial-gradient(80% 80% at 50% 50%, rgba(0,0,0,0) 55%, rgba(110,60,20,.22) 100%)" }} />
    </Full>
  ),
  Panel: ({ w, h, focus, children, style }) => (
    <div style={{ position: "relative", width: w, height: h, background: RS.card, border: `6px solid ${RS.gold}`, borderRadius: 26, boxShadow: `0 0 0 3px ${RS.fg}, 0 22px 40px rgba(79,46,22,.28)`, padding: 40, boxSizing: "border-box", fontFamily: RS.title, color: RS.fg, ...style }}>
      {focus && <div style={{ position: "absolute", right: -40, top: -46, transform: "rotate(12deg)" }}><Burst size={120} text="NEW" /></div>}
      {children}
    </div>
  ),
  Title: ({ kicker, title, align = "left", size = 84 }) => (
    <div style={{ textAlign: align }}>
      {kicker && <div style={{ display: "inline-block", fontFamily: RS.mono, fontWeight: 500, fontSize: 22, letterSpacing: "0.18em", color: RS.card, background: RS.fg, borderRadius: 999, padding: "5px 18px" }}>{kicker}</div>}
      <div style={{ fontFamily: RS.title, fontWeight: 900, fontSize: size, lineHeight: 1.08, color: RS.accent, marginTop: 18, ...stroke(Math.max(6, size / 12)) }}>{title}</div>
    </div>
  ),
  BigNumber: ({ value, label, tone, size = 210 }) => (
    <div style={{ display: "inline-block" }}>
      <div style={{ fontFamily: RS.title, fontWeight: 900, fontSize: size, lineHeight: 1.05, color: tone === "down" ? RS.down : tone === "up" ? "#8DBF5E" : RS.accent, ...stroke(size / 11) }}>{value}</div>
      {label && <div style={{ display: "inline-block", marginTop: 30, fontFamily: RS.title, fontWeight: 800, fontSize: 30, color: RS.fg, background: RS.gold, border: `3px solid ${RS.fg}`, borderRadius: 12, padding: "6px 22px" }}>{label}</div>}
    </div>
  ),
  Row: ({ k, v, tone }) => <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", padding: "13px 0", borderBottom: `2px dashed ${RS.line}` }}><span style={{ fontFamily: RS.title, fontWeight: 500, fontSize: 26, color: RS.muted }}>{k}</span><span style={{ fontFamily: RS.title, fontWeight: 900, fontSize: 50, color: pick(tone, rsPal) }}>{v}</span></div>,
  Chrome: ({ source }) => (
    <>
      <div style={{ position: "absolute", left: 0, right: 0, top: 40, textAlign: "center", fontFamily: RS.mono, fontWeight: 500, fontSize: 18, letterSpacing: "0.24em", color: RS.fg }}>★ {BRAND} ★</div>
      {source && <div style={{ position: "absolute", left: 0, right: 0, top: 72, textAlign: "center", fontFamily: RS.mono, fontSize: 17, color: RS.muted }}>Source: {source}</div>}
    </>
  ),
  ChapterBadge: ({ num }) => <Abs x={70} y={40}><div style={{ transform: "rotate(-10deg)" }}><Burst size={110} text={num} /></div></Abs>,
  Caption: ({ text }) => <div style={{ position: "absolute", left: 0, right: 0, bottom: 48, display: "flex", justifyContent: "center" }}><div style={{ maxWidth: 1500, textAlign: "center", fontFamily: RS.title, fontWeight: 700, fontSize: 38, lineHeight: 1.3, color: RS.fg, background: "#FFF6E3", border: `3px solid ${RS.fg}`, borderRadius: 999, padding: "8px 32px" }}>{text}</div></div>,
};

// ───────── color-cards 彩卡拼贴：深色桌面 + 饱和色卡（蓝 / 黄 / 绿 / 橙 / 粉）+ 橙色胶囊高亮
const CC = { table: "#16140F", fg: "#F3EFE4", muted: "#A39E8E", blue: "#2F4BDB", yellow: "#EDD456", green: "#1F6B4A", orange: "#D9603B", pink: "#F2B6A8", cream: "#EEEAE2", up: "#9EF0B8", down: "#FFB4A0", disp: "'Bricolage Grotesque', sans-serif", num: "'Archivo Black', sans-serif", sans: "Inter, sans-serif" };
const ccPal: Pal = { up: CC.up, down: CC.down, accent: CC.yellow, neutral: CC.fg };
const ccCard: Pal = { up: CC.green, down: CC.orange, accent: CC.blue, neutral: CC.blue };
const Tilt: React.FC<{ x: number; y: number; w: number; h: number; r: number; c: string }> = ({ x, y, w, h, r, c }) => <i style={{ position: "absolute", left: x, top: y, width: w, height: h, background: c, borderRadius: 26, transform: `rotate(${r}deg)`, boxShadow: "0 30px 60px rgba(12,9,4,.5)" }} />;
export const COLOR_CARDS_KIT: StyleKit = {
  id: "color-cards", theme: "color-cards",
  Backdrop: ({ src }) => (
    <Full style={{ background: CC.table }}>
      {src && <Photo src={src} filter="brightness(.3) saturate(.6)" />}
      <Tilt x={-140} y={760} w={520} h={380} r={-12} c={CC.blue} /><Tilt x={1740} y={360} w={420} h={300} r={10} c={CC.yellow} /><Tilt x={1660} y={820} w={420} h={320} r={-6} c={CC.pink} />
      <Full style={{ background: "radial-gradient(90% 90% at 50% 50%, rgba(0,0,0,0) 50%, rgba(12,9,4,.45) 100%)" }} />
    </Full>
  ),
  Panel: ({ w, h, tone, focus, children, style }) => <div style={{ position: "relative", width: w, height: h, background: pick(tone, ccCard), borderRadius: 26, boxShadow: focus ? `0 0 0 5px ${CC.yellow}, 0 30px 60px rgba(12,9,4,.55)` : "0 30px 60px rgba(12,9,4,.5)", transform: focus ? "rotate(-1.2deg)" : undefined, padding: 40, boxSizing: "border-box", fontFamily: CC.sans, color: CC.fg, ...style }}>{children}</div>,
  Title: ({ kicker, title, align = "left", size = 80 }) => (
    <div style={{ textAlign: align }}>
      {kicker && <div style={{ display: "inline-block", fontFamily: CC.sans, fontWeight: 800, fontSize: 22, letterSpacing: "0.12em", color: CC.table, background: CC.orange, borderRadius: 999, padding: "6px 18px" }}>{kicker}</div>}
      <div style={{ fontFamily: CC.disp, fontWeight: 800, fontSize: size, letterSpacing: "-0.03em", lineHeight: 1.04, color: CC.fg, marginTop: 16 }}>{title}</div>
    </div>
  ),
  BigNumber: ({ value, label, tone, size = 190 }) => (
    <div style={{ display: "inline-block", background: CC.cream, borderRadius: 30, padding: "30px 60px 34px", boxShadow: "0 40px 80px rgba(12,9,4,.55)" }}>
      <div style={{ fontFamily: CC.num, fontSize: size, lineHeight: 1, letterSpacing: "-0.02em", color: tone === "down" ? CC.orange : tone === "up" ? CC.green : CC.blue }}>{value}</div>
      {label && <div style={{ display: "inline-block", marginTop: 18, fontFamily: CC.sans, fontWeight: 800, fontSize: 28, color: CC.cream, background: CC.table, borderRadius: 999, padding: "6px 22px" }}>{label}</div>}
    </div>
  ),
  Row: ({ k, v, tone }) => <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", padding: "13px 0", borderBottom: "1px solid rgba(243,239,228,.22)" }}><span style={{ fontFamily: CC.sans, fontWeight: 600, fontSize: 26, color: "rgba(243,239,228,.75)" }}>{k}</span><span style={{ fontFamily: CC.num, fontSize: 46, color: pick(tone, ccPal) }}>{v}</span></div>,
  Chrome: ({ source }) => (
    <>
      <Abs x={90} y={44}><div style={{ fontFamily: CC.disp, fontWeight: 800, fontSize: 22, color: CC.fg }}>{BRAND}</div></Abs>
      {source && <div style={{ position: "absolute", right: 90, top: 48, fontFamily: CC.sans, fontSize: 18, color: CC.muted }}>Source: {source}</div>}
    </>
  ),
  ChapterBadge: ({ num, title }) => <div style={{ position: "absolute", right: 90, top: 84, fontFamily: CC.sans, fontWeight: 800, fontSize: 20, color: CC.table, background: CC.yellow, borderRadius: 999, padding: "6px 18px" }}>{num} · {title}</div>,
  Caption: ({ text }) => <BarCaption text={text} font={CC.sans} color={CC.table} bg={CC.cream} size={40} weight={700} />,
};

// ───────── bauhaus-grid 包豪斯几何：米白纸 + 150px 细网格 + 四角十字 + 蓝黄红黑几何格 + 底部刻度尺
const BH = { bg: "#F1EDE4", fg: "#161414", muted: "#8A8378", blue: "#2D4BD8", yellow: "#F4B62C", red: "#F04A1E", orange: "#FF4F1F", deep: "#2A0E05", line: "rgba(22,20,20,.14)", title: "'DM Serif Display', serif", num: "'Archivo Black', sans-serif", mono: "'IBM Plex Mono', monospace" };
const bhPal: Pal = { up: BH.blue, down: BH.red, accent: BH.orange, neutral: BH.fg };
const Cross: React.FC<{ x: number; y: number }> = ({ x, y }) => <><i style={{ position: "absolute", left: x - 14, top: y, width: 28, height: 2, background: BH.fg }} /><i style={{ position: "absolute", left: x, top: y - 14, width: 2, height: 28, background: BH.fg }} /></>;
const Shape: React.FC<{ x: number; y: number; k: number }> = ({ x, y, k }) => {
  const s: React.CSSProperties = { position: "absolute", left: x, top: y, width: 150, height: 150 };
  if (k === 0) return <i style={{ ...s, borderRadius: "50%", background: BH.blue }} />;
  if (k === 1) return <i style={{ ...s, borderRadius: "150px 0 0 0", background: BH.yellow }} />;
  if (k === 2) return <i style={{ ...s, borderRadius: "75px 75px 0 0", background: BH.red }} />;
  return <i style={{ ...s, background: BH.fg }} />;
};
export const BAUHAUS_GRID_KIT: StyleKit = {
  id: "bauhaus-grid", theme: "bauhaus-grid",
  Backdrop: ({ src }) => (
    <Full style={{ background: BH.bg, backgroundImage: `linear-gradient(${BH.line} 1px, transparent 1px), linear-gradient(90deg, ${BH.line} 1px, transparent 1px)`, backgroundSize: "150px 150px", backgroundPosition: "60px 90px" }}>
      {src && <Photo src={src} filter="grayscale(1) contrast(1.1)" opacity={0.12} />}
      <Shape x={1710} y={90} k={0} /><Shape x={1710} y={240} k={1} /><Shape x={1560} y={90} k={3} /><Shape x={1710} y={390} k={2} />
      <Cross x={60} y={90} /><Cross x={1860} y={90} /><Cross x={60} y={990} /><Cross x={1860} y={990} />
    </Full>
  ),
  Panel: ({ w, h, focus, children, style }) => <div style={{ position: "relative", width: w, height: h, background: "#FFFFFF", border: `2px solid ${BH.fg}`, boxShadow: focus ? `12px 12px 0 ${BH.yellow}` : "none", padding: 40, boxSizing: "border-box", fontFamily: BH.mono, color: BH.fg, ...style }}>{children}</div>,
  Title: ({ kicker, title, align = "left", size = 84 }) => (
    <div style={{ textAlign: align }}>
      {kicker && <div style={{ fontFamily: BH.mono, fontWeight: 600, fontSize: 22, letterSpacing: "0.2em", color: BH.red }}>{kicker}</div>}
      <div style={{ fontFamily: BH.title, fontSize: size, lineHeight: 1.04, letterSpacing: "-0.01em", color: BH.fg, marginTop: 10 }}>{title}</div>
    </div>
  ),
  BigNumber: ({ value, label, tone, size = 220 }) => (
    <div style={{ display: "inline-block" }}>
      <div style={{ fontFamily: BH.title, fontStyle: "italic", fontSize: size, lineHeight: 1, color: pick(tone, bhPal), textShadow: Array.from({ length: 10 }, (_, i) => `${i + 1}px ${i + 1}px 0 ${BH.deep}`).join(",") }}>{value}</div>
      {label && <div style={{ fontFamily: BH.mono, fontWeight: 600, fontSize: 26, letterSpacing: "0.14em", textTransform: "uppercase", color: BH.fg, marginTop: 24 }}>{label}</div>}
    </div>
  ),
  Row: ({ k, v, tone }) => <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", padding: "13px 0", borderBottom: `2px solid ${BH.fg}` }}><span style={{ fontFamily: BH.mono, fontSize: 22, letterSpacing: "0.06em", color: BH.muted }}>{k}</span><span style={{ fontFamily: BH.num, fontSize: 46, color: pick(tone, bhPal) }}>{v}</span></div>,
  Chrome: ({ source }) => (
    <>
      <Abs x={90} y={40}><div style={{ fontFamily: BH.mono, fontWeight: 600, fontSize: 17, letterSpacing: "0.2em", color: BH.fg }}>{BRAND} — PORTFOLIO</div></Abs>
      <div style={{ position: "absolute", left: 90, right: 90, bottom: 26, height: 22, borderTop: `2px solid ${BH.fg}`, backgroundImage: `linear-gradient(90deg, ${BH.fg} 2px, transparent 2px)`, backgroundSize: "30px 10px", backgroundRepeat: "repeat-x" }} />
      {source && <div style={{ position: "absolute", right: 90, top: 42, fontFamily: BH.mono, fontSize: 16, color: BH.muted }}>SOURCE — {source}</div>}
    </>
  ),
  ChapterBadge: ({ num, title }) => <div style={{ position: "absolute", left: 90, top: 70, fontFamily: BH.mono, fontWeight: 600, fontSize: 20, letterSpacing: "0.14em", color: BH.fg }}><span style={{ background: BH.red, color: "#fff", padding: "2px 10px", marginRight: 10 }}>{num}</span>{title.toUpperCase()}</div>,
  Caption: ({ text }) => <BarCaption text={text} font={BH.mono} color={BH.bg} bg={BH.fg} size={36} weight={600} />,
};
