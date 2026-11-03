// 卡片类：错峰弹出、推入转场、逐行聚焦、胶囊卡、逐项打勾、卡片对开、左右回摆
import React from "react";
import { Canvas, Card, Chip, Kicker, Num, enter } from "./ui";
import { Tone, toneColor, toneTint, useTheme } from "./theme";
import { LEAD, clamp, ease, lerp, seg, settle, useMs } from "./time";

export type CardStaggerProps = { items?: { label: string; value: string; tone?: Tone }[]; top?: number; height?: number };
/** card-stagger：多张卡片按阅读顺序依次上浮落位，间隔 0.1 秒 */
export const CardStagger: React.FC<CardStaggerProps> = ({
  items = [
    { label: "GOOGLE CLOUD", value: "+103%", tone: "teal" },
    { label: "SEARCH QUERIES", value: "5-yr high", tone: "ink" },
    { label: "FREE CASH FLOW", value: "−$9.1B", tone: "red" },
  ],
  top = 330,
  height = 420,
}) => {
  const t = useMs();
  const th = useTheme();
  const n = items.length;
  const gap = 36;
  const w = (1696 - gap * (n - 1)) / n;
  return (
    <Canvas content>
      {items.map((it, i) => (
        <Card
          key={i}
          style={{ left: 112 + i * (w + gap), top, width: w, height, padding: "48px 46px", ...enter(seg(t, LEAD + i * 100, 520)) }}
        >
          <Kicker>{it.label}</Kicker>
          <Num style={{ fontSize: Math.min(n > 3 ? 88 : 120, (w - 92) / (it.value.length * 0.6)), color: toneColor(th, it.tone ?? "ink"), marginTop: 60 }}>{it.value}</Num>
          <div style={{ height: 22, width: "70%", borderRadius: 8, background: th.ph2, marginTop: 60 }} />
        </Card>
      ))}
    </Canvas>
  );
};

export type CardPushProps = { fromTitle?: string; toNum?: string; toTitle?: string; toSub?: string };
/** card-push：章节转场，当前画面缩小 4% 淡出，新章节卡从下方推入 */
export const CardPush: React.FC<CardPushProps> = ({
  fromTitle = "From buybacks to borrowing",
  toNum = "05",
  toTitle = "Is AI eating Search?",
  toSub,
}) => {
  const t = useMs();
  const th = useTheme();
  const a = seg(t, LEAD, 420, ease.inOutCubic);
  const b = seg(t, LEAD + 260, 520);
  return (
    <Canvas content>
      <div style={{ position: "absolute", inset: 0, opacity: 1 - a, transform: `scale(${1 - 0.04 * a})` }}>
        <div style={{ position: "absolute", left: 110, top: 170, fontSize: 76, fontWeight: 800, letterSpacing: "-0.02em" }}>{fromTitle}</div>
        <Card style={{ left: 112, top: 300, width: 1696, height: 560 }} />
      </div>
      <div style={{ position: "absolute", inset: 0, opacity: b, transform: `translateY(${(1 - b) * 40}px)` }}>
        <Num style={{ position: "absolute", left: 150, top: 300, fontSize: 240, color: th.teal }}>{toNum}</Num>
        <div style={{ position: "absolute", left: 150, top: 600, fontSize: 110, fontWeight: 800, letterSpacing: "-0.03em" }}>{toTitle}</div>
        {toSub ? <div style={{ position: "absolute", left: 154, top: 760, fontSize: 40, fontWeight: 600, color: th.ink3 }}>{toSub}</div> : null}
      </div>
    </Canvas>
  );
};

export type FocusRowProps = { rows?: { label: string; value: string; note?: string; tone?: Tone }[]; cues?: number[] };
/** focus-row：表格讲到哪行，哪行变浅蓝底并长出左侧蓝条，其余变淡。cues 为每行亮起的毫秒数 */
export const FocusRow: React.FC<FocusRowProps> = ({
  rows = [
    { label: "Revenue", value: "$127.6B", note: "−0.5%", tone: "red" },
    { label: "Earnings per share", value: "$2.12", note: "≈ −30%", tone: "red" },
    { label: "Free cash flow", value: "−$9.1B", note: "far worse", tone: "red" },
  ],
  cues = [0, 900, 1800],
}) => {
  const t = useMs();
  const th = useTheme();
  let idx = -1;
  cues.forEach((c, i) => {
    if (t >= LEAD + c) idx = i;
  });
  return (
    <Canvas content>
      <Card style={{ left: 112, top: 260, width: 1696, height: 120 + rows.length * 150, padding: "40px 44px" }}>
        {rows.map((r, i) => {
          const start = LEAD + (cues[i] ?? 1e9);
          const end = cues[i + 1] !== undefined ? LEAD + cues[i + 1] : 1e9;
          const on = seg(t, start, 260) * (1 - seg(t, end, 260));
          return (
            <div
              key={i}
              style={{
                position: "relative",
                display: "grid",
                gridTemplateColumns: "620px 1fr 1fr",
                alignItems: "center",
                padding: "34px 40px",
                borderRadius: 20,
                marginTop: 16,
                background: th.name === "cards" ? `rgba(234,240,253,${on})` : `rgba(91,155,255,${0.16 * on})`,
                opacity: idx < 0 ? 1 : lerp(0.42, 1, on),
              }}
            >
              <div style={{ position: "absolute", left: 0, top: 0, bottom: 0, width: 6, borderRadius: 6, background: th.blue, transform: `scaleY(${on})` }} />
              <div style={{ fontSize: 40, fontWeight: 700 }}>{r.label}</div>
              <Num style={{ fontSize: 62 }}>{r.value}</Num>
              <div>{r.note ? <Chip fg={toneColor(th, r.tone ?? "red")} bg={toneTint(th, r.tone ?? "red")} style={{ fontSize: 30 }}>{r.note}</Chip> : null}</div>
            </div>
          );
        })}
      </Card>
    </Canvas>
  );
};

export type PillPopProps = { title?: string; sub?: string; tone?: Tone; icon?: "box" | "trend" | "alert" | "check"; top?: number };
const ICONS: Record<string, React.ReactNode> = {
  box: (
    <>
      <path d="M21 8l-9-5-9 5 9 5 9-5z" />
      <path d="M3 8v8l9 5 9-5V8" />
    </>
  ),
  trend: (
    <>
      <path d="M3 17l6-6 4 4 8-8" />
      <path d="M15 7h6v6" />
    </>
  ),
  alert: (
    <>
      <path d="M12 3l10 18H2L12 3z" />
      <path d="M12 10v5M12 18v.5" />
    </>
  ),
  check: <path d="M5 12.5l4.5 4.5L19 7" />,
};
/** pill-pop：补充信息以胶囊卡轻弹出现，图标小幅旋入 */
export const PillPop: React.FC<PillPopProps> = ({
  title = "Inventory $2.4B → $13.3B",
  sub = "End of 2025 → end of Q3 2026",
  tone = "amber",
  icon = "box",
  top = 400,
}) => {
  const t = useMs();
  const th = useTheme();
  const q = seg(t, LEAD, 600, ease.outBack);
  const r = seg(t, LEAD + 120, 500, ease.outBack);
  const col = toneColor(th, tone);
  return (
    <Canvas content>
      <div
        style={{
          position: "absolute",
          left: "50%",
          top,
          display: "flex",
          alignItems: "center",
          gap: 32,
          padding: "40px 56px",
          background: th.card,
          border: `1px solid ${th.line}`,
          borderRadius: 26,
          boxShadow: th.shadow,
          opacity: clamp((t - LEAD) / 150),
          transform: `translateX(-50%) scale(${lerp(0.6, 1, q)})`,
        }}
      >
        <div
          style={{
            width: 110,
            height: 110,
            borderRadius: 26,
            background: toneTint(th, tone),
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            transform: `rotate(${(1 - r) * -40}deg) scale(${lerp(0.4, 1, r)})`,
          }}
        >
          <svg width={60} height={60} viewBox="0 0 24 24" fill="none" stroke={col} strokeWidth={2.2} strokeLinecap="round" strokeLinejoin="round">
            {ICONS[icon]}
          </svg>
        </div>
        <div>
          <div style={{ fontSize: 68, fontWeight: 800, whiteSpace: "nowrap" }}>{title}</div>
          {sub ? <div style={{ fontSize: 36, fontWeight: 500, color: th.ink3, marginTop: 10 }}>{sub}</div> : null}
        </div>
      </div>
    </Canvas>
  );
};

export type CheckStepsProps = { steps?: { title: string; rows: string[] }[]; stepMs?: number };
/** check-steps：步骤卡逐项打勾；当前卡加琥珀描边和光晕。stepMs 为每张卡停留的毫秒数 */
export const CheckSteps: React.FC<CheckStepsProps> = ({
  steps = [
    { title: "01 Contract", rows: ["Customer signs", "Goes into backlog"] },
    { title: "02 Build", rows: ["Buy chips & parts", "Sits in inventory"] },
    { title: "03 Deliver", rows: ["Ship & install", "Invoice"] },
    { title: "04 Collect", rows: ["Customer pays", "Cash comes back"] },
  ],
  stepMs = 760,
}) => {
  const t = useMs();
  const th = useTheme();
  const n = steps.length;
  const gap = 28;
  const w = (1696 - gap * (n - 1)) / n;
  return (
    <Canvas content>
      {steps.map((s, i) => {
        const a = seg(t, LEAD + 500 + i * stepMs, 200) * (1 - seg(t, LEAD + 500 + (i + 1) * stepMs, 200));
        const hot = a > 0.01;
        return (
          <Card
            key={i}
            style={{
              left: 112 + i * (w + gap),
              top: 300,
              width: w,
              height: 300 + s.rows.length * 70,
              padding: "40px 36px",
              border: `${hot ? 2 : 1}px solid ${hot ? th.amber : th.line}`,
              boxShadow: th.shadowHot(a),
              ...enter(seg(t, LEAD + i * 90, 480)),
            }}
          >
            <div style={{ fontSize: 36, fontWeight: 800, color: i === n - 1 ? th.teal : th.ink }}>{s.title}</div>
            {s.rows.map((r, j) => {
              const at = LEAD + 600 + i * stepMs + j * 260;
              const q = seg(t, at, 220);
              const ck = seg(t, at + 120, 220);
              return (
                <div key={j} style={{ display: "flex", alignItems: "center", gap: 16, marginTop: 28, fontSize: 28, fontWeight: 600, color: q > 0.5 ? th.ink : th.ink2 }}>
                  <svg width={32} height={32} viewBox="0 0 32 32">
                    <circle cx={16} cy={16} r={13} fill={q > 0.5 ? th.teal : "none"} stroke={q > 0 ? th.teal : th.ph} strokeWidth={3} />
                    <path d="M9 16.5l5 5 9-10" fill="none" stroke={th.onAccent} strokeWidth={3.4} strokeLinecap="round" strokeLinejoin="round" strokeDasharray={24} strokeDashoffset={24 * (1 - ck)} />
                  </svg>
                  <span>{r}</span>
                </div>
              );
            })}
            <div style={{ height: 22, width: "100%", borderRadius: 8, background: th.ph, marginTop: 60 }} />
          </Card>
        );
      })}
    </Canvas>
  );
};

export type CardSplitProps = { top?: string; value?: string; left?: string; right?: string; mid?: string };
/** card-split：一张卡从中间对开成两张，露出中间的结论胶囊 */
export const CardSplit: React.FC<CardSplitProps> = ({
  top = "GOOGLE CLOUD REVENUE",
  value = "$30.7B",
  left = "CLOUD SERVICES",
  right = "TPU SYSTEM SALES",
  mid = "Revenue mix not disclosed",
}) => {
  const t = useMs();
  const th = useTheme();
  const a = seg(t, LEAD, 400);
  const sp = seg(t, LEAD + 500, 700, ease.inOutCubic);
  const m = seg(t, LEAD + 1000, 450, ease.outBack);
  const box: React.CSSProperties = { top: 300, width: 700, height: 460, padding: 44, left: 610 };
  return (
    <Canvas content>
      <Card style={{ ...box, ...enter(a), opacity: a * (1 - clamp(sp * 3)) }}>
        <Kicker>{top}</Kicker>
        <Num style={{ fontSize: 110, marginTop: 60, color: th.blue }}>{value}</Num>
      </Card>
      {[left, right].map((lab, i) => (
        <Card key={lab} style={{ ...box, opacity: clamp(sp * 3), transform: `translateX(${(i ? 1 : -1) * sp * 420}px)` }}>
          <Kicker>{lab}</Kicker>
          <Num style={{ fontSize: 110, marginTop: 60, color: th.ink3 }}>?</Num>
        </Card>
      ))}
      <div style={{ position: "absolute", left: "50%", top: 800, opacity: clamp(m), transform: `translateX(-50%) scale(${lerp(0.7, 1, m)})` }}>
        <Chip fg={th.amber} bg={th.amberT} style={{ fontSize: 30, padding: "14px 26px", border: `2px solid ${th.amber}` }}>
          {mid}
        </Chip>
      </div>
    </Canvas>
  );
};

type Side = { tag: string; kicker?: string; value: string; tone: Tone };
export type ReboundPairProps = { left?: Side; right?: Side };
/** rebound-pair：两方对照，两张卡从左右滑入，越过落点后回摆停稳 */
export const ReboundPair: React.FC<ReboundPairProps> = ({
  left = { tag: "GOOGL", kicker: "FREE CASH FLOW", value: "−$9.1B", tone: "red" },
  right = { tag: "MSFT", kicker: "FREE CASH FLOW", value: "+$18.6B", tone: "teal" },
}) => {
  const t = useMs();
  const th = useTheme();
  const q = clamp((t - LEAD) / 1200);
  const off = q <= 0 ? 1 : settle(q, 5, 2.6);
  return (
    <Canvas content>
      {[left, right].map((d, i) => (
        <Card
          key={i}
          style={{
            left: i ? 1008 : 112,
            top: 300,
            width: 800,
            height: 480,
            padding: 44,
            opacity: clamp(q * 4),
            transform: `translateX(${(i ? 900 : -900) * off}px)`,
          }}
        >
          <Chip fg={toneColor(th, d.tone)} bg={toneTint(th, d.tone)} style={{ fontSize: 28 }}>
            {d.tag}
          </Chip>
          {d.kicker ? <Kicker style={{ marginTop: 30 }}>{d.kicker}</Kicker> : null}
          <Num style={{ fontSize: 120, color: toneColor(th, d.tone), marginTop: 40 }}>{d.value}</Num>
        </Card>
      ))}
    </Canvas>
  );
};
