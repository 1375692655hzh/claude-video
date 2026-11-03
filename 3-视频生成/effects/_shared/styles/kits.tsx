// 7 套风格的外观组件（deco 在 ./deco-kit.tsx）。每套都实现 StyleKit 的同一组组件。
import React from "react";
import { Img } from "remotion";
import { Abs, BarCaption, Full, Grain, OutlineCaption, StyleKit, Tone } from "./kit";

const pick = (tone: Tone | undefined, c: { up: string; down: string; accent: string; neutral: string }) => c[tone ?? "neutral"];
const Photo: React.FC<{ src: string; filter?: string; scale?: number }> = ({ src, filter, scale = 1.06 }) => (
  <Img src={src} style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", filter, transform: `scale(${scale})` }} />
);

// ───────── cards：浅灰底 + 白色大圆角卡片（2026-10-google-q3-cards）
const CA = { bg: "#F3F5F9", card: "#FFFFFF", line: "#E4E8F0", ink: "#141B2D", ink2: "#4A5468", ink3: "#8A93A6", up: "#0F9F78", down: "#E0484E", accent: "#3366E0", amber: "#F2A516", font: "Inter" };
export const CARDS_KIT: StyleKit = {
  id: "cards", theme: "cards",
  Backdrop: () => <Full style={{ background: `radial-gradient(1200px 700px at 78% 18%, #FFFFFF 0%, rgba(255,255,255,0) 60%), ${CA.bg}` }} />,
  Panel: ({ w, h, focus, children, style }) => <div style={{ position: "relative", width: w, height: h, background: CA.card, border: `1px solid ${CA.line}`, borderRadius: 28, boxShadow: focus ? "0 18px 40px rgba(242,165,22,.22), 0 10px 30px rgba(20,27,45,.07)" : "0 10px 30px rgba(20,27,45,.07), 0 2px 6px rgba(20,27,45,.04)", padding: 40, boxSizing: "border-box", fontFamily: CA.font, color: CA.ink, ...style }}>{children}</div>,
  Title: ({ kicker, title, align = "left", size = 72 }) => <div style={{ textAlign: align, fontFamily: CA.font }}>{kicker && <div style={{ fontSize: 26, fontWeight: 800, letterSpacing: "0.18em", color: CA.accent }}>{kicker}</div>}<div style={{ fontSize: size, fontWeight: 800, color: CA.ink, letterSpacing: "-0.02em", marginTop: 8 }}>{title}</div></div>,
  BigNumber: ({ value, label, tone, size = 180 }) => <div style={{ fontFamily: CA.font }}><div style={{ fontSize: size, fontWeight: 800, letterSpacing: "-0.04em", color: pick(tone, { ...CA, neutral: CA.ink }) }}>{value}</div>{label && <div style={{ fontSize: 30, fontWeight: 600, color: CA.ink2 }}>{label}</div>}</div>,
  Row: ({ k, v, tone }) => <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", padding: "14px 0", borderBottom: `1px solid ${CA.line}`, fontFamily: CA.font }}><span style={{ fontSize: 26, fontWeight: 600, color: CA.ink3 }}>{k}</span><span style={{ fontSize: 50, fontWeight: 800, color: pick(tone, { ...CA, neutral: CA.ink }) }}>{v}</span></div>,
  Chrome: ({ source }) => (
    <>
      <Abs x={56} y={34}><div style={{ fontFamily: CA.font, fontSize: 22, fontWeight: 800, color: CA.ink }}>ANDY&apos;S MARKET LENS <span style={{ color: CA.ink3, fontWeight: 600 }}>/ Episode</span></div></Abs>
      <div style={{ position: "absolute", left: 56, right: 56, top: 70, height: 2, background: `linear-gradient(90deg, #19A67A, rgba(25,166,122,0))` }} />
      {source && <div style={{ position: "absolute", right: 56, top: 34, fontFamily: CA.font, fontSize: 20, color: CA.ink3 }}>Source: {source}</div>}
      <div style={{ position: "absolute", left: 0, right: 0, bottom: 0, height: 8, background: `linear-gradient(90deg, #2AA4E0 45%, ${CA.line} 45%)` }} />
    </>
  ),
  ChapterBadge: ({ num, title }) => <div style={{ position: "absolute", right: 56, top: 90, fontFamily: CA.font, fontSize: 22, fontWeight: 800, color: "#19A67A" }}>{num} · {title}</div>,
  Caption: ({ text }) => <BarCaption text={text} font={CA.font} color="#fff" bg="#262B36" size={40} />,
};

// ───────── navy：深海军蓝 + 青色涨 / 红色跌（2026-10-google-q3）
const NV = { bg: "#06101f", card: "#0e2242", line: "rgba(120,170,230,0.22)", ink: "#f4f8ff", ink2: "#b8c8e0", ink3: "#8ea6c8", up: "#2ee6f0", down: "#ff5a4e", accent: "#5b9bff", font: "Inter" };
export const NAVY_KIT: StyleKit = {
  id: "navy", theme: "navy",
  Backdrop: ({ src }) => <Full style={{ background: NV.bg }}>{src && <Photo src={src} filter="blur(16px) brightness(.35) saturate(.7) hue-rotate(-10deg)" />}<Full style={{ background: "radial-gradient(1400px 800px at 75% 15%, rgba(46,120,220,0.18) 0%, rgba(6,16,31,0) 60%)" }} /></Full>,
  Panel: ({ w, h, focus, children, style }) => <div style={{ position: "relative", width: w, height: h, background: NV.card, border: `1px solid ${focus ? NV.up : NV.line}`, borderRadius: 20, boxShadow: focus ? `0 0 40px rgba(46,230,240,.25), 0 20px 60px rgba(0,0,0,.35)` : "0 20px 60px rgba(0,0,0,.35)", padding: 40, boxSizing: "border-box", fontFamily: NV.font, color: NV.ink, ...style }}>{children}</div>,
  Title: ({ kicker, title, align = "left", size = 72 }) => <div style={{ textAlign: align, fontFamily: NV.font }}>{kicker && <div style={{ fontSize: 26, fontWeight: 700, color: NV.ink3 }}>{kicker}</div>}<div style={{ fontSize: size, fontWeight: 800, color: NV.ink, marginTop: 8 }}>{title}</div></div>,
  BigNumber: ({ value, label, tone, size = 180 }) => <div style={{ fontFamily: NV.font }}><div style={{ fontSize: size, fontWeight: 900, letterSpacing: "-0.03em", color: pick(tone, { ...NV, neutral: NV.ink }) }}>{value}</div>{label && <div style={{ fontSize: 30, color: NV.ink2 }}>{label}</div>}</div>,
  Row: ({ k, v, tone }) => <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", padding: "14px 0", borderBottom: `1px solid ${NV.line}`, fontFamily: NV.font }}><span style={{ fontSize: 26, color: NV.ink3 }}>{k}</span><span style={{ fontSize: 50, fontWeight: 800, color: pick(tone, { ...NV, neutral: NV.ink }) }}>{v}</span></div>,
  Chrome: ({ source }) => <>{source && <div style={{ position: "absolute", right: 56, top: 36, fontFamily: NV.font, fontSize: 20, color: NV.ink3, background: "rgba(6,16,31,.6)", padding: "4px 10px" }}>Source: {source}</div>}<Abs x={1700} y={1000}><div style={{ fontFamily: NV.font, fontSize: 18, fontWeight: 800, color: NV.ink3, letterSpacing: "0.1em" }}>ANDY&apos;S MARKET LENS</div></Abs></>,
  ChapterBadge: ({ num, title }) => <Abs x={56} y={36}><div style={{ fontFamily: NV.font, fontSize: 22, fontWeight: 800, color: NV.up }}>{num} <span style={{ color: NV.ink2 }}>{title}</span></div></Abs>,
  Caption: ({ text }) => <BarCaption text={text} font={NV.font} color="#fff" bg="rgba(6,16,31,0.88)" size={40} weight={600} />,
};

// ───────── documentary：暖调实拍为主 + 胶片颗粒 + 上下黑边 + 衬线字
const DO = { ink: "#FFF3DD", ink2: "#D9C4A0", ink3: "#BFA680", gold: "#E3B66B", up: "#A8C98F", down: "#E07A5F", font: "Lora" };
export const DOCUMENTARY_KIT: StyleKit = {
  id: "documentary", theme: "documentary",
  Backdrop: ({ src }) => (
    <Full style={{ background: "#120D08" }}>
      {src && <Photo src={src} filter="sepia(.45) saturate(.9) contrast(1.05) brightness(.72)" scale={1.08} />}
      <Full style={{ background: "linear-gradient(90deg, rgba(20,12,4,.78) 0%, rgba(20,12,4,.2) 55%, rgba(20,12,4,0) 100%)" }} />
      <Full style={{ background: "radial-gradient(80% 80% at 50% 50%, rgba(0,0,0,0) 55%, rgba(0,0,0,.7) 100%)" }} />
      <Grain op={0.18} freq={1.6} />
      <div style={{ position: "absolute", left: 0, right: 0, top: 0, height: 90, background: "#000" }} />
      <div style={{ position: "absolute", left: 0, right: 0, bottom: 0, height: 90, background: "#000" }} />
    </Full>
  ),
  Panel: ({ w, h, children, style }) => <div style={{ position: "relative", width: w, height: h, background: "rgba(20,14,8,.55)", borderLeft: `2px solid ${DO.gold}`, padding: "30px 36px", boxSizing: "border-box", fontFamily: DO.font, color: DO.ink, ...style }}>{children}</div>,
  Title: ({ kicker, title, align = "left", size = 76 }) => <div style={{ textAlign: align, fontFamily: DO.font, color: DO.ink }}>{kicker && <div style={{ fontSize: 26, letterSpacing: "0.3em", color: DO.gold }}>{kicker}</div>}<div style={{ fontSize: size, fontWeight: 600, marginTop: 14, lineHeight: 1.1 }}>{title}</div><div style={{ width: 120, height: 2, background: DO.gold, marginTop: 26, marginLeft: align === "center" ? "auto" : 0, marginRight: align === "center" ? "auto" : 0 }} /></div>,
  BigNumber: ({ value, label, tone, size = 160 }) => <div style={{ fontFamily: DO.font }}><div style={{ fontSize: size, fontWeight: 600, color: pick(tone, { up: DO.up, down: DO.down, accent: DO.gold, neutral: DO.ink }), textShadow: "0 4px 20px rgba(0,0,0,.6)" }}>{value}</div>{label && <div style={{ fontSize: 30, fontStyle: "italic", color: DO.ink2 }}>{label}</div>}</div>,
  Row: ({ k, v, tone }) => <div style={{ display: "flex", gap: 30, alignItems: "baseline", padding: "12px 0", fontFamily: DO.font }}><span style={{ width: 320, fontSize: 26, color: DO.ink2 }}>{k}</span><span style={{ fontSize: 50, fontWeight: 600, color: pick(tone, { up: DO.up, down: DO.down, accent: DO.gold, neutral: DO.ink }) }}>{v}</span></div>,
  Chrome: ({ source }) => <>{source && <div style={{ position: "absolute", right: 140, top: 110, fontFamily: DO.font, fontStyle: "italic", fontSize: 20, color: DO.ink2 }}>{source}</div>}<Abs x={140} y={110}><div style={{ fontFamily: DO.font, fontSize: 18, letterSpacing: "0.3em", color: DO.ink3 }}>ANDY&apos;S MARKET LENS</div></Abs></>,
  ChapterBadge: ({ num, title }) => <Abs x={140} y={880}><div style={{ fontFamily: DO.font, fontSize: 22, letterSpacing: "0.3em", color: DO.gold }}>CHAPTER {num} · <span style={{ color: DO.ink }}>{title.toUpperCase()}</span></div></Abs>,
  Caption: ({ text }) => <div style={{ position: "absolute", left: 0, right: 0, bottom: 110, textAlign: "center", fontFamily: DO.font, fontSize: 38, color: DO.ink, textShadow: "0 2px 10px rgba(0,0,0,.9)" }}>{text}</div>,
};

// ───────── glass：渐变光斑底 + 半透明磨砂玻璃卡片
const GL = { ink: "#fff", ink2: "rgba(255,255,255,.78)", ink3: "rgba(255,255,255,.6)", up: "#67E8F9", down: "#FB7185", accent: "#C4B5FD", font: "Space Grotesk" };
const glassBox: React.CSSProperties = { background: "rgba(255,255,255,0.12)", border: "1px solid rgba(255,255,255,0.35)", borderRadius: 32, boxShadow: "0 30px 80px rgba(20,10,60,.35), inset 0 1px 0 rgba(255,255,255,.4)", backdropFilter: "blur(30px)" };
export const GLASS_KIT: StyleKit = {
  id: "glass", theme: "glass",
  Backdrop: () => (
    <Full style={{ background: "#120C2E" }}>
      <div style={{ position: "absolute", left: -200, top: -200, width: 900, height: 900, borderRadius: "50%", background: "radial-gradient(circle, #7B5CFF 0%, rgba(123,92,255,0) 70%)" }} />
      <div style={{ position: "absolute", right: -150, top: 120, width: 800, height: 800, borderRadius: "50%", background: "radial-gradient(circle, #22D3EE 0%, rgba(34,211,238,0) 70%)", opacity: 0.8 }} />
      <div style={{ position: "absolute", left: 600, bottom: -350, width: 900, height: 900, borderRadius: "50%", background: "radial-gradient(circle, #F472B6 0%, rgba(244,114,182,0) 70%)", opacity: 0.7 }} />
    </Full>
  ),
  Panel: ({ w, h, focus, children, style }) => <div style={{ position: "relative", width: w, height: h, padding: 44, boxSizing: "border-box", fontFamily: GL.font, color: GL.ink, ...glassBox, background: focus ? "rgba(255,255,255,0.2)" : glassBox.background, ...style }}>{children}</div>,
  Title: ({ kicker, title, align = "left", size = 80 }) => <div style={{ textAlign: align, fontFamily: GL.font }}>{kicker && <div style={{ fontSize: 26, fontWeight: 500, color: GL.ink2, letterSpacing: "0.08em" }}>{kicker}</div>}<div style={{ fontSize: size, fontWeight: 700, color: GL.ink, marginTop: 8 }}>{title}</div></div>,
  BigNumber: ({ value, label, tone, size = 170 }) => <div style={{ fontFamily: GL.font }}><div style={{ fontSize: size, fontWeight: 700, ...(tone === "down" ? { color: GL.down } : { background: "linear-gradient(90deg,#A5F3FC,#F0ABFC)", WebkitBackgroundClip: "text", color: "transparent" }) }}>{value}</div>{label && <div style={{ fontSize: 30, color: GL.ink2 }}>{label}</div>}</div>,
  Row: ({ k, v, tone }) => <div style={{ marginTop: 20, fontFamily: GL.font }}><div style={{ fontSize: 22, color: GL.ink3 }}>{k}</div><div style={{ fontSize: 58, fontWeight: 700, color: pick(tone, { ...GL, neutral: GL.ink }) }}>{v}</div></div>,
  Chrome: ({ source }) => <><Abs x={100} y={60}><div style={{ fontFamily: GL.font, fontWeight: 700, fontSize: 24, color: GL.ink2, letterSpacing: "0.1em" }}>◎ ANDY&apos;S MARKET LENS</div></Abs>{source && <div style={{ position: "absolute", right: 100, top: 64, fontFamily: GL.font, fontSize: 20, color: GL.ink3 }}>{source}</div>}</>,
  ChapterBadge: ({ num, title }) => <Abs x={100} y={900}><div style={{ ...glassBox, borderRadius: 999, padding: "12px 28px", fontFamily: GL.font, fontSize: 24, fontWeight: 700, color: GL.ink }}>{num} · {title}</div></Abs>,
  Caption: ({ text }) => <OutlineCaption text={text} font={GL.font} />,
};

// ───────── terminal：黑底绿网格 + 等宽字 + 行情条
const TE = { ink: "#E8FFF2", ink2: "#9FD8B8", ink3: "#6E9C82", line: "#3E6B52", up: "#32F08C", down: "#FF4D5E", accent: "#FFB000", font: "JetBrains Mono" };
export const TERMINAL_KIT: StyleKit = {
  id: "terminal", theme: "terminal",
  Backdrop: () => (
    <Full style={{ background: "#030605" }}>
      <Full style={{ background: `repeating-linear-gradient(0deg, rgba(62,107,82,.22) 0 1px, rgba(0,0,0,0) 1px 48px), repeating-linear-gradient(90deg, rgba(62,107,82,.22) 0 1px, rgba(0,0,0,0) 1px 48px)` }} />
    </Full>
  ),
  Panel: ({ w, h, children, style }) => <div style={{ position: "relative", width: w, height: h, border: `1px solid ${TE.line}`, background: "#050C08", padding: "22px 26px", boxSizing: "border-box", fontFamily: TE.font, color: TE.ink, ...style }}>{children}</div>,
  Title: ({ kicker, title, align = "left", size = 64 }) => <div style={{ textAlign: align, fontFamily: TE.font }}>{kicker && <div style={{ fontSize: 26, color: TE.accent }}>{kicker}</div>}<div style={{ fontSize: size, fontWeight: 700, color: TE.ink, marginTop: 8 }}>{title.toUpperCase()}<span style={{ display: "inline-block", width: size * 0.5, height: size * 0.9, background: TE.up, marginLeft: 12, verticalAlign: "-0.12em" }} /></div></div>,
  BigNumber: ({ value, label, tone, size = 170 }) => <div style={{ fontFamily: TE.font }}><div style={{ fontSize: size, fontWeight: 700, color: pick(tone, { ...TE, neutral: TE.ink }), textShadow: `0 0 24px ${pick(tone, { ...TE, neutral: TE.ink })}55` }}>{value}</div>{label && <div style={{ fontSize: 28, color: TE.ink2 }}>{label.toUpperCase()}</div>}</div>,
  Row: ({ k, v, tone }) => <div style={{ display: "flex", justifyContent: "space-between", padding: "16px 0", borderTop: `1px solid ${TE.line}`, fontFamily: TE.font }}><span style={{ fontSize: 26, color: TE.ink2 }}>{k.toUpperCase()}</span><span style={{ fontSize: 44, fontWeight: 700, color: pick(tone, { ...TE, neutral: TE.ink }) }}>{v}</span></div>,
  Chrome: ({ source }) => (
    <>
      <div style={{ position: "absolute", left: 0, right: 0, top: 0, height: 52, background: "#0B1410", borderBottom: `1px solid ${TE.line}`, fontFamily: TE.font, fontSize: 24, whiteSpace: "nowrap", padding: "12px 24px", overflow: "hidden" }}>
        {["MRVL 196.40 ▼10.05%", "LITE 840.70 ▼8.57%", "COHR 213.68 ▲2.10%", "NVDA 188.12 ▲0.84%", "AVGO 362.40 ▲1.12%", "SOX 6,412 ▼0.62%"].map((s, i) => <span key={i} style={{ marginRight: 48, color: s.includes("▼") ? TE.down : TE.up }}>{s}</span>)}
      </div>
      <Abs x={80} y={76}><div style={{ fontFamily: TE.font, fontSize: 22, color: TE.accent }}>ANDY&apos;S MARKET LENS &gt;</div></Abs>
      {source && <div style={{ position: "absolute", left: 80, bottom: 150, fontFamily: TE.font, fontSize: 20, color: TE.ink3 }}>SRC: {source.toUpperCase()}</div>}
    </>
  ),
  ChapterBadge: ({ num, title }) => <div style={{ position: "absolute", right: 80, top: 76, fontFamily: TE.font, fontSize: 22, color: TE.ink2 }}>[{num}] {title.toUpperCase()}</div>,
  Caption: ({ text }) => <OutlineCaption text={text} font={TE.font} size={40} />,
};

// ───────── newspaper：米白纸纹 + 报头 + 衬线大标题 + 红黑双色
const NE = { paper: "#F1ECE1", ink: "#1B1A17", ink2: "#4A463E", ink3: "#7A7466", red: "#B3261E", green: "#2F6B3A", serif: "Playfair Display", body: "Lora" };
export const NEWSPAPER_KIT: StyleKit = {
  id: "newspaper", theme: "newspaper",
  Backdrop: () => <Full style={{ background: NE.paper }}><Grain op={0.35} /></Full>,
  Panel: ({ w, h, focus, children, style }) => <div style={{ position: "relative", width: w, height: h, borderTop: `3px solid ${NE.ink}`, borderBottom: `1px solid ${NE.ink}`, padding: "20px 0", boxSizing: "border-box", fontFamily: NE.body, color: focus ? NE.red : NE.ink, ...style }}>{children}</div>,
  Title: ({ kicker, title, align = "left", size = 92 }) => <div style={{ textAlign: align, color: NE.ink }}>{kicker && <div style={{ fontFamily: NE.body, fontWeight: 600, fontSize: 24, letterSpacing: "0.2em", color: NE.red }}>{kicker}</div>}<div style={{ fontFamily: NE.serif, fontWeight: 900, fontSize: size, lineHeight: 1.02, marginTop: 6 }}>{title}</div></div>,
  BigNumber: ({ value, label, tone, size = 200 }) => <div><div style={{ fontFamily: NE.serif, fontWeight: 900, fontSize: size, color: tone === "down" || tone === "accent" ? NE.red : NE.ink, fontVariantNumeric: "oldstyle-nums" }}>{value}</div>{label && <div style={{ fontFamily: NE.body, fontStyle: "italic", fontSize: 30, color: NE.ink2 }}>{label}</div>}</div>,
  Row: ({ k, v, tone }) => <div style={{ marginTop: 14, borderBottom: `1px dotted ${NE.ink}`, paddingBottom: 8 }}><div style={{ fontFamily: NE.body, fontSize: 22, color: NE.ink2 }}>{k}</div><div style={{ fontFamily: NE.serif, fontWeight: 900, fontSize: 64, color: tone === "up" || tone === "accent" ? NE.red : NE.ink }}>{v}</div></div>,
  Chrome: ({ source }) => (
    <>
      <div style={{ position: "absolute", left: 120, right: 120, top: 34, textAlign: "center", color: NE.ink }}>
        <div style={{ fontFamily: NE.serif, fontWeight: 900, fontSize: 52 }}>Andy&apos;s Market Lens</div>
        <div style={{ borderTop: `3px solid ${NE.ink}`, borderBottom: `1px solid ${NE.ink}`, marginTop: 6, padding: "5px 0", fontFamily: NE.body, fontSize: 18, letterSpacing: "0.2em", display: "flex", justifyContent: "space-between" }}><span>TUESDAY, NOVEMBER 3, 2026</span><span>MARKETS</span><span>ANDY&apos;S MARKET LENS</span></div>
      </div>
      {source && <div style={{ position: "absolute", left: 120, bottom: 140, fontFamily: NE.body, fontSize: 18, color: NE.ink3 }}>Source: {source}</div>}
    </>
  ),
  ChapterBadge: ({ num, title }) => <div style={{ position: "absolute", right: 120, top: 140, fontFamily: NE.body, fontWeight: 600, fontSize: 20, letterSpacing: "0.2em", color: NE.red }}>SECTION {num} · {title.toUpperCase()}</div>,
  Caption: ({ text }) => <BarCaption text={text} font={NE.body} color={NE.ink} bg="rgba(241,236,225,.94)" size={40} weight={400} />,
};

// ───────── swiss：白底 + 超大粗体 + 严格网格 + 唯一红色
const SW = { ink: "#000", ink2: "#333", ink3: "#777", red: "#E30613", font: "Inter" };
export const SWISS_KIT: StyleKit = {
  id: "swiss", theme: "swiss",
  Backdrop: () => <Full style={{ background: "#fff" }}><svg width={1920} height={1080} style={{ position: "absolute", inset: 0 }}>{[...Array(13)].map((_, i) => <line key={i} x1={120 + i * 140} y1={0} x2={120 + i * 140} y2={1080} stroke="#000" strokeOpacity={0.05} />)}</svg></Full>,
  Panel: ({ w, h, children, style }) => <div style={{ position: "relative", width: w, height: h, borderTop: `6px solid ${SW.ink}`, paddingTop: 24, boxSizing: "border-box", fontFamily: SW.font, color: SW.ink, ...style }}>{children}</div>,
  Title: ({ kicker, title, align = "left", size = 96 }) => <div style={{ textAlign: align, fontFamily: SW.font }}>{kicker && <div style={{ fontSize: 28, fontWeight: 400 }}>{kicker}</div>}<div style={{ fontSize: size, fontWeight: 900, letterSpacing: "-0.04em", lineHeight: 1, marginTop: 10 }}>{title}</div></div>,
  BigNumber: ({ value, label, tone, size = 420 }) => {
    const m = /^(.*?)([%×BMK$]*)$/.exec(value) ?? ["", value, ""];
    return <div style={{ fontFamily: SW.font }}><div style={{ fontSize: size, fontWeight: 900, letterSpacing: "-0.06em", lineHeight: 1, color: SW.ink }}>{m[1]}<span style={{ color: tone === "neutral" ? SW.ink : SW.red }}>{m[2]}</span></div>{label && <div style={{ fontSize: 30, marginTop: 10 }}>{label}</div>}</div>;
  },
  Row: ({ k, v, tone }) => <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", padding: "12px 0", borderBottom: "2px solid #000", fontFamily: SW.font }}><span style={{ fontSize: 26 }}>{k}</span><span style={{ fontSize: 56, fontWeight: 900, color: tone === "down" || tone === "accent" ? SW.red : SW.ink }}>{v}</span></div>,
  Chrome: ({ source }) => <><Abs x={120} y={60}><div style={{ fontFamily: SW.font, fontWeight: 900, fontSize: 22 }}>ANDY&apos;S MARKET LENS</div></Abs><div style={{ position: "absolute", left: 120, right: 120, top: 92, height: 6, background: "#000" }} />{source && <div style={{ position: "absolute", right: 120, top: 112, fontFamily: SW.font, fontSize: 20, color: SW.ink3 }}>{source}</div>}</>,
  ChapterBadge: ({ num, title }) => <Abs x={120} y={112}><div style={{ fontFamily: SW.font, fontSize: 22, fontWeight: 900 }}><span style={{ color: SW.red }}>{num}</span> {title}</div></Abs>,
  Caption: ({ text }) => <BarCaption text={text} font={SW.font} color="#000" bg="#fff" size={40} />,
};
