// 场景里常用的小部件（从 caspa-ai-profit / 2026-10-google-q3 的 ui.tsx 收进来，改成跟主题走）。
// 和 28 个动效不同，这些不占整个画面，放在自己写的场景里拼版用。at 都是本段开始后的毫秒数。
import React from "react";
import { Tone, toneColor, toneTint, useTheme } from "./theme";
import { clamp, ease, lerp, seg, signed, useMs } from "./time";

/** 数字滚动（行内）。format 决定写法，如 v => signed(v, 1, "$", "B") */
export const Count: React.FC<{ value: number; from?: number; at?: number; dur?: number; format?: (v: number) => string; style?: React.CSSProperties }> = ({
  value,
  from = 0,
  at = 0,
  dur = 1000,
  format = (v) => signed(v, 1),
  style,
}) => {
  const t = useMs();
  return <span style={{ fontVariantNumeric: "tabular-nums", ...style }}>{format(lerp(from, value, seg(t, at, dur, ease.outQuart)))}</span>;
};

/** 标签胶囊（弹出）。solid=true 为实心 */
export const Tag: React.FC<{ children: React.ReactNode; tone?: Tone; size?: number; at?: number; solid?: boolean }> = ({
  children,
  tone = "blue",
  size = 34,
  at = 0,
  solid = false,
}) => {
  const t = useMs();
  const th = useTheme();
  const k = seg(t, at, 450, ease.outBack);
  const col = toneColor(th, tone);
  return (
    <div
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 12,
        fontSize: size,
        fontWeight: 700,
        fontFamily: th.font,
        color: solid ? th.onAccent : col,
        background: solid ? col : toneTint(th, tone),
        border: `2px solid ${col}`,
        borderRadius: 14,
        padding: `${size * 0.25}px ${size * 0.6}px`,
        opacity: clamp(k * 2),
        transform: `scale(${lerp(0.7, 1, k)})`,
        whiteSpace: "nowrap",
      }}
    >
      {children}
    </div>
  );
};

/** 印章：从 2.2 倍盖下来 */
export const Stamp: React.FC<{ children: React.ReactNode; tone?: Tone; at?: number; size?: number; rotate?: number }> = ({
  children,
  tone = "red",
  at = 0,
  size = 72,
  rotate = -6,
}) => {
  const t = useMs();
  const th = useTheme();
  const k = seg(t, at, 380, ease.outBack);
  const col = toneColor(th, tone);
  return (
    <div
      style={{
        display: "inline-block",
        fontSize: size,
        fontWeight: 900,
        fontFamily: th.font,
        color: col,
        border: `6px solid ${col}`,
        borderRadius: 18,
        padding: `${size * 0.15}px ${size * 0.45}px`,
        opacity: clamp(k * 1.5),
        transform: `rotate(${rotate}deg) scale(${lerp(2.2, 1, k)})`,
        letterSpacing: 2,
        whiteSpace: "nowrap",
        background: toneTint(th, tone),
      }}
    >
      {children}
    </div>
  );
};

/** 打勾 / 打叉（圆圈先出，笔画再描） */
export const Mark: React.FC<{ kind?: "check" | "cross"; at?: number; size?: number; tone?: Tone }> = ({ kind = "check", at = 0, size = 80, tone }) => {
  const t = useMs();
  const th = useTheme();
  const k = seg(t, at, 460);
  const col = toneColor(th, tone ?? (kind === "check" ? "teal" : "red"));
  return (
    <svg width={size} height={size} viewBox="0 0 100 100">
      <circle cx={50} cy={50} r={44} fill="none" stroke={col} strokeWidth={7} opacity={k} />
      {kind === "check" ? (
        <path d="M28 52 L44 67 L73 36" fill="none" stroke={col} strokeWidth={9} strokeLinecap="round" strokeDasharray={80} strokeDashoffset={80 * (1 - k)} />
      ) : (
        <path d="M33 33 L67 67 M67 33 L33 67" fill="none" stroke={col} strokeWidth={9} strokeLinecap="round" strokeDasharray={100} strokeDashoffset={100 * (1 - k)} />
      )}
    </svg>
  );
};

/** 右上角信源条（按 AGENTS.md 信源规则只写一手资料或知名机构） */
export const Source: React.FC<{ children: React.ReactNode; at?: number }> = ({ children, at = 200 }) => {
  const t = useMs();
  const th = useTheme();
  return (
    <div
      style={{
        position: "absolute",
        right: 80,
        top: 52,
        fontFamily: th.font,
        fontSize: 24,
        fontWeight: 500,
        color: th.ink3,
        opacity: seg(t, at, 400),
        background: th.cardSoft,
        border: `1px solid ${th.line}`,
        padding: "6px 16px",
        borderRadius: 8,
      }}
    >
      Source: {children}
    </div>
  );
};

/** 左下名字条：滑入，停 dur 毫秒后淡出 */
export const NameStrip: React.FC<{ name: string; role?: string; at?: number; dur?: number }> = ({ name, role, at = 0, dur = 4000 }) => {
  const t = useMs();
  const th = useTheme();
  const k = seg(t, at, 500);
  const out = 1 - seg(t, at + dur, 400);
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
        fontFamily: th.font,
      }}
    >
      <div style={{ width: 8, background: th.blue, borderRadius: 4 }} />
      <div style={{ background: th.cardSoft, padding: "12px 26px", borderRadius: "0 12px 12px 0", boxShadow: th.shadow }}>
        <div style={{ fontSize: 38, fontWeight: 700, color: th.ink }}>{name}</div>
        {role ? <div style={{ fontSize: 28, fontWeight: 500, color: th.ink3 }}>{role}</div> : null}
      </div>
    </div>
  );
};
