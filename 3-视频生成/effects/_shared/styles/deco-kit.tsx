// deco（Gilded Deco）：组件来自 2026-11-02-marvell-lumentum，2026-11-03 收进公共风格库（./deco/）
import React from "react";
import { StyleKit, Tone } from "./kit";
import { C, F, Gem } from "./deco/tokens";
import { GemCard, StatValue } from "./deco/Card";
import { Backdrop, Caption, ChannelMark, ChapterBadge, SourceTag, Title } from "./deco/Chrome";

const gemOf = (tone?: Tone): Gem => (tone === "down" ? "ruby" : tone === "up" ? "emerald" : tone === "accent" ? "sapphire" : "onyx");
const col = (tone?: Tone) => (tone === "up" ? C.up : tone === "down" ? C.down : C.goldHi);
const goldText: React.CSSProperties = { background: `linear-gradient(180deg, ${C.goldHi} 0%, ${C.gold} 120%)`, WebkitBackgroundClip: "text", backgroundClip: "text", color: "transparent" };

export const DECO_KIT: StyleKit = {
  id: "deco", theme: "deco",
  Backdrop: ({ src }) => <Backdrop src={src} />,
  Panel: ({ w, h, tone, focus, children, style }) => <GemCard gem={gemOf(tone)} w={w} h={h} focus={focus} style={style}>{children}</GemCard>,
  Title: ({ kicker, title, size = 64 }) => <Title title={title} sub={kicker} size={size} />,
  BigNumber: ({ value, label, tone, size = 180 }) => (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
      <div style={{ fontFamily: F.display, fontWeight: 900, fontSize: size, lineHeight: 1, ...(tone === "down" ? { color: C.down } : tone === "up" ? { color: C.up } : goldText), filter: "drop-shadow(0 4px 14px rgba(0,0,0,.6))" }}>{value}</div>
      {label && <div style={{ fontFamily: F.label, fontWeight: 700, fontSize: 26, letterSpacing: "0.22em", color: C.muted, marginTop: 12, textTransform: "uppercase" }}>{label}</div>}
    </div>
  ),
  Row: ({ k, v, tone }) => (
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", width: "100%", padding: "12px 6px", borderBottom: "1px solid rgba(201,169,97,.25)" }}>
      <span style={{ fontFamily: F.label, fontWeight: 600, fontSize: 19, letterSpacing: "0.16em", color: C.muted, textTransform: "uppercase" }}>{k}</span>
      <span style={{ fontFamily: F.display, fontWeight: 900, fontSize: 50, color: col(tone), fontVariantNumeric: "tabular-nums" }}>{v}</span>
    </div>
  ),
  Chrome: ({ source }) => <><ChannelMark />{source && <SourceTag at={0}>{source}</SourceTag>}</>,
  ChapterBadge: ({ num, title }) => <ChapterBadge num={num} title={title} at={0} />,
  Caption: ({ text }) => <Caption text={text} />,
};
export { StatValue };
