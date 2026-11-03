// 来自 projects/2026/11/2026-11-02-marvell-lumentum/05-制作/remotion/deco/（Gilded Deco），2026-11-03 收进公共风格库
import React from "react";
import { Easing } from "remotion";
import { C, F, GEM, Gem } from "./tokens";
import { Corner, Fan } from "./Ornaments";
import { enter, seg, useMs } from "./anim";

type CardProps = {
  gem?: Gem;
  w: number;
  h: number;
  at?: number; // 入场毫秒
  focus?: boolean; // 金色光晕
  fan?: boolean;
  kicker?: string;
  style?: React.CSSProperties;
  children?: React.ReactNode;
};

// 宝石色金框卡：渐变底 + 双线金框（SVG 描线）+ 四角角花 + 顶部扇形纹 + 一次流光
export const GemCard: React.FC<CardProps> = ({ gem = "sapphire", w, h, at = 0, focus, fan = true, kicker, style, children }) => {
  const t = useMs();
  const g = GEM[gem];
  const draw = seg(t, at + 150, 900, Easing.inOut(Easing.cubic));
  const sheen = seg(t, at + 900, 1100, Easing.inOut(Easing.quad));
  const glow = focus ? seg(t, at + 700, 800) : 0;
  const per1 = 2 * (w + h);
  const per2 = 2 * (w - 14 + h - 14);
  return (
    <div style={{ position: "relative", width: w, height: h, ...enter(t, at), ...style }}>
      <div
        style={{
          position: "absolute",
          inset: 0,
          borderRadius: 6,
          background: `radial-gradient(120% 90% at 50% 0%, ${g.a} 0%, ${g.b} 78%)`,
          boxShadow: `0 24px 60px rgba(0,0,0,.55), inset 0 0 60px ${g.edge}${glow ? `, 0 0 ${48 * glow}px ${C.glow}` : ""}`,
          overflow: "hidden",
        }}
      >
        {/* 流光 */}
        <div
          style={{
            position: "absolute",
            top: 0,
            bottom: 0,
            width: w * 0.35,
            left: -w * 0.4 + sheen * w * 1.5,
            background: "linear-gradient(100deg, transparent, rgba(241,227,182,.10), transparent)",
            opacity: sheen > 0 && sheen < 1 ? 1 : 0,
          }}
        />
      </div>
      <svg width={w} height={h} style={{ position: "absolute", inset: 0, overflow: "visible" }}>
        <rect x={1} y={1} width={w - 2} height={h - 2} rx={5} fill="none" stroke={C.gold} strokeWidth={2} strokeDasharray={per1} strokeDashoffset={per1 * (1 - draw)} opacity={focus ? 1 : 0.85} />
        <rect x={8} y={8} width={w - 16} height={h - 16} rx={3} fill="none" stroke={C.gold} strokeWidth={1} strokeDasharray={per2} strokeDashoffset={per2 * (1 - draw)} opacity={0.55} />
      </svg>
      <div style={{ position: "absolute", inset: 0, opacity: draw }}>
        <Corner style={{ position: "absolute", left: 4, top: 4 }} />
        <Corner style={{ position: "absolute", right: 4, top: 4, transform: "scaleX(-1)" }} />
        <Corner style={{ position: "absolute", left: 4, bottom: 4, transform: "scaleY(-1)" }} />
        <Corner style={{ position: "absolute", right: 4, bottom: 4, transform: "scale(-1,-1)" }} />
        {fan && (
          <div style={{ position: "absolute", top: 14, left: "50%", transform: "translateX(-50%)" }}>
            <Fan width={Math.min(70, w * 0.16)} />
          </div>
        )}
      </div>
      <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", textAlign: "center", padding: `${fan ? 64 : 30}px 28px 28px` }}>
        {kicker && <Kicker>{kicker}</Kicker>}
        {children}
      </div>
    </div>
  );
};

export const Kicker: React.FC<{ children: React.ReactNode; size?: number; color?: string }> = ({ children, size = 20, color = C.muted }) => (
  <div style={{ fontFamily: F.label, fontWeight: 600, fontSize: size, letterSpacing: "0.22em", color, textTransform: "uppercase", marginBottom: 10 }}>{children}</div>
);

export const Label: React.FC<{ children: React.ReactNode; size?: number; sub?: string }> = ({ children, size = 40, sub }) => (
  <div style={{ marginTop: 10 }}>
    <div style={{ fontFamily: F.display, fontWeight: 800, fontSize: size, color: C.cream, lineHeight: 1.1 }}>{children}</div>
    {sub && <div style={{ fontFamily: F.label, fontWeight: 600, fontSize: size * 0.42, letterSpacing: "0.18em", color: C.muted, marginTop: 8, textTransform: "uppercase" }}>{sub}</div>}
  </div>
);

// 大数字：符号 + 整数（大）+ 小数（缩小）+ 单位，可滚动
export const StatValue: React.FC<{
  value: number;
  decimals?: number;
  prefix?: string; // "+" "−" "$" ">$"
  unit?: string; // "%" "B" "M"
  size?: number;
  at?: number;
  count?: boolean;
  color?: string;
}> = ({ value, decimals = 1, prefix = "", unit = "", size = 150, at = 0, count = true, color = C.goldHi }) => {
  const t = useMs();
  const p = count ? seg(t, at + 450, 1200, Easing.out(Easing.cubic)) : 1;
  const v = Math.abs(value) * p;
  const [i, d] = v.toFixed(decimals).split(".");
  const grad = { background: `linear-gradient(180deg, ${color} 0%, ${C.gold} 115%)`, WebkitBackgroundClip: "text", backgroundClip: "text", color: "transparent" } as React.CSSProperties;
  return (
    <div style={{ fontFamily: F.display, fontWeight: 900, lineHeight: 0.95, fontVariantNumeric: "tabular-nums", display: "flex", alignItems: "baseline", filter: "drop-shadow(0 4px 14px rgba(0,0,0,.6))" }}>
      {prefix && <span style={{ ...grad, fontSize: size * 0.6, marginRight: size * 0.04 }}>{prefix}</span>}
      <span style={{ ...grad, fontSize: size }}>{Number(i).toLocaleString("en-US")}</span>
      {decimals > 0 && <span style={{ ...grad, fontSize: size * 0.55 }}>.{d}</span>}
      {unit && <span style={{ ...grad, fontSize: size * 0.5, marginLeft: size * 0.04 }}>{unit}</span>}
    </div>
  );
};
