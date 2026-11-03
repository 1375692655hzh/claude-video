// 数据类：数字滚动、柱条、瀑布图、横条对比、折线、预期 vs 实际、股价断崖、环形、刻度尺、进度条溢出、引线标注
import React from "react";
import { Canvas, Card, Chip, Kicker, Label, Num, enter, polyLength, polyPath } from "./ui";
import { Tone, toneColor, useTheme } from "./theme";
import { LEAD, MINUS, clamp, ease, lerp, seg, signed, useMs } from "./time";

export type CountUpProps = {
  from?: number;
  to?: number;
  decimals?: number;
  format?: "money" | "pct" | "plain";
  unit?: string; // money 的单位（B / M / T）
  label?: string;
  tone?: Tone;
};
/** count-up：大数字卡，从起始值滚到目标值，末尾减速，落定时轻微回弹 */
export const CountUp: React.FC<CountUpProps> = ({
  from = 0,
  to = -9.1,
  decimals = 1,
  format = "money",
  unit = "B",
  label = "Free cash flow, Q3 2026",
  tone = "red",
}) => {
  const t = useMs();
  const th = useTheme();
  const q = seg(t, LEAD + 150, 900, ease.outQuart);
  const v = lerp(from, to, q);
  const txt =
    format === "money" ? signed(v, decimals, "$", unit) : format === "pct" ? signed(v, decimals, "", "%", true) : v.toFixed(decimals);
  const b = seg(t, LEAD + 1050, 300);
  return (
    <Canvas content>
      <Card style={{ left: 560, top: 260, width: 800, height: 520, padding: 60, textAlign: "center", ...enter(seg(t, LEAD, 400)) }}>
        <Num style={{ fontSize: 200, color: toneColor(th, tone), marginTop: 60, transform: `scale(${1 + 0.05 * Math.sin(b * Math.PI)})` }}>{txt}</Num>
        <Label style={{ fontSize: 34, marginTop: 20 }}>{label}</Label>
      </Card>
    </Canvas>
  );
};

export type BarGrowProps = { bars?: { label: string; value: number; ref?: number; tone?: Tone }[]; max?: number; unit?: string; title?: string };
/** bar-grow：参考虚线先出现，柱子从底线依次长出，数值随后滚动 */
export const BarGrow: React.FC<BarGrowProps> = ({
  bars = [
    { label: "Search", value: 12, ref: 14 },
    { label: "YouTube ads", value: 9.2, ref: 10 },
    { label: "Network", value: 1.4 },
  ],
  max = 16,
  unit = "%",
  title,
}) => {
  const t = useMs();
  const th = useTheme();
  const W = 1696;
  const H = 700;
  const base = 560;
  const top = 120;
  const sc = (base - top) / max;
  const bw = 220;
  const step = (W - 200) / bars.length;
  return (
    <Canvas content>
      <Card style={{ left: 112, top: 220, width: W, height: H, ...enter(seg(t, LEAD, 400), 30, 0.98) }}>
        {title ? <Kicker style={{ position: "absolute", left: 60, top: 44 }}>{title}</Kicker> : null}
        <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`} style={{ position: "absolute", left: 0, top: 0 }}>
          <line x1={100} y1={base} x2={W - 100} y2={base} stroke={th.track} strokeWidth={2} />
          {bars.map((b, i) => {
            const x = 100 + step * i + (step - bw) / 2;
            const col = toneColor(th, b.tone ?? "red");
            const rp = seg(t, LEAD + 300 + i * 120, 400);
            const g = seg(t, LEAD + 600 + i * 140, 700);
            const hh = Math.max(0, b.value * sc * g);
            return (
              <g key={i}>
                {b.ref != null ? (
                  <g opacity={rp}>
                    <line x1={x - 30} x2={x + bw + 30} y1={base - b.ref * sc} y2={base - b.ref * sc} stroke={th.amber} strokeWidth={4} strokeDasharray="14 10" />
                    <text x={x + bw + 40} y={base - b.ref * sc + 10} fontSize={28} fontWeight={800} fill={th.amber} fontFamily={th.font}>
                      {b.ref + unit}
                    </text>
                  </g>
                ) : null}
                <rect x={x} width={bw} rx={16} y={base - hh} height={hh} fill={col} />
                <text x={x + bw / 2} y={base - hh - 20} textAnchor="middle" fontSize={48} fontWeight={800} fill={col} fontFamily={th.font} opacity={clamp(g * 3)}>
                  {signed(b.value * g, 1, "", unit, true)}
                </text>
                <text x={x + bw / 2} y={base + 60} textAnchor="middle" fontSize={30} fontWeight={600} fill={th.ink2} fontFamily={th.font} opacity={seg(t, LEAD + 400 + i * 120, 300)}>
                  {b.label}
                </text>
              </g>
            );
          })}
        </svg>
      </Card>
    </Canvas>
  );
};

export type WaterfallProps = {
  steps?: { label: string; value: number; tone?: Tone }[];
  result?: string;
  zero?: number; // 零线在卡片里的 y（px）
  scale?: number; // 每单位多少 px
  decimals?: number;
  prefix?: string;
  suffix?: string;
  target?: { value: number; label: string; gapText?: string };
  stepMs?: number;
};
/**
 * waterfall：把一个结果"算出来"。第一段立起，之后每段从上一段顶端加上或扣下，最后结果柱落定；
 * 可加一条预期虚线（如 EPS 共识），结果和预期之间弹出差额括号。
 */
export const Waterfall: React.FC<WaterfallProps> = ({
  steps = [
    { label: "Operating cash flow", value: 42.3, tone: "teal" },
    { label: "Capital expenditure", value: -51.4 },
  ],
  result = "Free cash flow",
  zero = 470,
  scale = 7,
  decimals = 1,
  prefix = "",
  suffix = "",
  target,
  stepMs = 800,
}) => {
  const t = useMs();
  const th = useTheme();
  const W = 1696;
  const H = 760;
  const n = steps.length + 1;
  const bw = Math.min(300, 1300 / n - 80);
  const gapX = (W - 240 - bw) / (n - 1);
  const xs = Array.from({ length: n }, (_, i) => 120 + i * gapX);
  const Y = (v: number) => zero - v * scale;
  const f = (v: number) => prefix + Math.abs(v).toFixed(decimals) + suffix;
  let run = 0;
  const bars = steps.map((s, i) => {
    const y0 = i === 0 ? 0 : run;
    const y1 = i === 0 ? s.value : run + s.value;
    run = y1;
    const col = toneColor(th, s.tone ?? (i === 0 ? "ink" : s.value >= 0 ? "teal" : "red"));
    return { ...s, y0, y1, col, i };
  });
  const total = run;
  const li = n - 1;
  const st2 = LEAD + 300 + steps.length * stepMs;
  const c1 = seg(t, st2 - 200, 200, ease.linear);
  const g = seg(t, st2, 500, ease.outBack);
  const rh = Math.abs(total * scale) * Math.max(0, g);
  const gq = seg(t, st2 + 600, 450, ease.inOutCubic);
  return (
    <Canvas content>
      <Card style={{ left: 112, top: 200, width: W, height: H, ...enter(seg(t, LEAD, 400), 30, 0.98) }}>
        <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`} style={{ position: "absolute", left: 0, top: 0 }}>
          <line x1={80} y1={zero} x2={W - 80} y2={zero} stroke={th.track} strokeWidth={2} />
          {target ? (
            <g opacity={seg(t, LEAD + 300, 400)}>
              <line x1={80} x2={W - 80} y1={Y(target.value)} y2={Y(target.value)} stroke={th.amber} strokeWidth={4} strokeDasharray="14 10" />
              <text x={90} y={Y(target.value) - 16} fontSize={30} fontWeight={800} fill={th.amber} fontFamily={th.font}>
                {target.label}
              </text>
            </g>
          ) : null}
          {bars.map((b) => {
            const s0 = LEAD + 300 + b.i * stepMs;
            const gg = seg(t, s0, 650);
            const cur = lerp(b.y0, b.y1, gg);
            const top = Math.min(Y(b.y0), Y(cur));
            const hh = Math.abs(Y(cur) - Y(b.y0));
            const c0 = seg(t, s0 - 200, 200, ease.linear);
            const sign = b.i === 0 ? (b.value < 0 ? MINUS : "") : b.value >= 0 ? "+" : MINUS;
            return (
              <g key={b.i}>
                {b.i > 0 ? (
                  <line x1={xs[b.i - 1] + bw} x2={lerp(xs[b.i - 1] + bw, xs[b.i], c0)} y1={Y(b.y0)} y2={Y(b.y0)} stroke={th.track} strokeWidth={2} strokeDasharray="6 6" />
                ) : null}
                <rect x={xs[b.i]} width={bw} rx={18} y={top} height={hh} fill={b.col} />
                <text x={xs[b.i] + bw / 2} y={Math.min(Y(b.y0), Y(b.y1)) - 22} textAnchor="middle" fontSize={52} fontWeight={800} fill={b.col} fontFamily={th.font} opacity={clamp(gg * 3)}>
                  {sign + f(b.value * gg)}
                </text>
                <text
                  x={xs[b.i] + bw / 2}
                  y={zero + 50 + (Math.min(b.y0, b.y1) < 0 ? Math.abs(Math.min(b.y0, b.y1)) * scale : 0)}
                  textAnchor="middle"
                  fontSize={30}
                  fontWeight={600}
                  fill={th.ink2}
                  fontFamily={th.font}
                  opacity={seg(t, s0, 300)}
                >
                  {b.label}
                </text>
              </g>
            );
          })}
          <line x1={xs[li - 1] + bw} x2={lerp(xs[li - 1] + bw, xs[li], c1)} y1={Y(total)} y2={Y(total)} stroke={th.track} strokeWidth={2} strokeDasharray="6 6" />
          <rect
            x={xs[li]}
            width={bw}
            rx={14}
            y={total >= 0 ? zero - rh : zero}
            height={rh}
            fill={total >= 0 ? th.card : th.ink}
            stroke={th.ink}
            strokeWidth={total >= 0 ? 4 : 0}
          />
          <text
            x={xs[li] + bw / 2}
            y={total >= 0 ? zero - rh / 2 + 22 : zero + rh + 80}
            textAnchor="middle"
            fontSize={66}
            fontWeight={800}
            fill={total >= 0 ? th.ink : th.red}
            fontFamily={th.font}
            opacity={clamp(g * 3)}
          >
            {(total < 0 ? MINUS : "") + f(total * clamp(g))}
          </text>
          <text x={xs[li] + bw / 2} y={total >= 0 ? zero + 50 : zero - 26} textAnchor="middle" fontSize={30} fontWeight={600} fill={th.ink2} fontFamily={th.font} opacity={seg(t, st2, 300)}>
            {result}
          </text>
          {target ? (
            <g>
              <path
                d={`M${xs[li] + bw + 8} ${Y(target.value)} h22 V${lerp(Y(target.value), Y(total), gq)} h-22`}
                fill="none"
                stroke={th.red}
                strokeWidth={5}
                opacity={clamp(gq * 4)}
              />
              <text
                x={xs[li] + bw / 2}
                y={Math.min(Y(target.value), Y(total)) - 24}
                textAnchor="middle"
                fontSize={40}
                fontWeight={800}
                fill={th.red}
                fontFamily={th.font}
                opacity={seg(t, st2 + 900, 300)}
              >
                {target.gapText ?? ""}
              </text>
            </g>
          ) : null}
        </svg>
      </Card>
    </Canvas>
  );
};

export type HBarCompareProps = {
  rows?: { label: string; value: number; tone?: Tone }[];
  max?: number;
  prefix?: string;
  suffix?: string;
  decimals?: number;
  ratio?: string;
  ratioSub?: string;
};
/** hbar-compare：横条从零线同时按比例长出（有负值时变成左右发散），数值随条滚动，最后弹出倍数胶囊 */
export const HBarCompare: React.FC<HBarCompareProps> = ({
  rows = [
    { label: "Search + YouTube ads", value: 74.6, tone: "ink" },
    { label: "Google Cloud", value: 30.7, tone: "blue" },
  ],
  max = 80,
  prefix = "$",
  suffix = "B",
  decimals = 1,
  ratio = "2.4×",
  ratioSub = "the base Cloud has to offset",
}) => {
  const t = useMs();
  const th = useTheme();
  const neg = rows.some((r) => r.value < 0);
  const mN = Math.max(0, ...rows.map((r) => -r.value));
  const mP = Math.max(0, ...rows.map((r) => r.value));
  const P0 = 680;
  const P = 1568 - 250 - P0;
  const span = neg ? P / ((mN + mP) / max) : 1180;
  const zx = neg ? P0 + (P * mN) / (mN + mP) : 0;
  const pq = seg(t, LEAD + 1400, 500, ease.outBack);
  return (
    <Canvas content>
      <Card style={{ left: 112, top: 220, width: 1696, height: 640, padding: "60px 64px", ...enter(seg(t, LEAD, 400), 30, 0.98) }}>
        {rows.map((r, i) => {
          const col = toneColor(th, r.tone ?? (r.value < 0 ? "red" : "ink"));
          const g = seg(t, LEAD + 350 + i * 120, 900);
          const w = (Math.abs(r.value) / max) * span * g;
          const pos = r.value >= 0;
          return (
            <div key={i} style={{ position: "absolute", left: 64, right: 64, top: 70 + i * (440 / rows.length), height: 160 }}>
              <Label
                style={{
                  position: "absolute",
                  left: 0,
                  top: neg ? 78 : 0,
                  width: neg ? 340 : undefined,
                  fontSize: 32,
                  color: neg ? th.ink : r.tone === "blue" ? th.blue : th.ink,
                  opacity: seg(t, LEAD + 250 + i * 120, 300),
                }}
              >
                {r.label}
              </Label>
              <div style={{ position: "absolute", top: neg ? 62 : 52, height: neg ? 76 : 96, borderRadius: 20, background: col, width: w, left: pos ? zx : zx - w }} />
              <Num
                style={{
                  position: "absolute",
                  top: neg ? 62 : 58,
                  fontSize: neg ? 60 : 72,
                  color: col,
                  opacity: clamp(g * 3),
                  left: pos ? zx + w + 28 : undefined,
                  right: pos ? undefined : 1568 - (zx - w) + 28,
                }}
              >
                {(r.value < 0 ? MINUS : neg ? "+" : "") + prefix + Math.abs(r.value * g).toFixed(decimals) + suffix}
              </Num>
            </div>
          );
        })}
        {neg ? <div style={{ position: "absolute", left: 64 + zx, top: 80, bottom: 60, width: 3, background: th.ink3 }} /> : null}
        {ratio ? (
          <div
            style={{
              position: "absolute",
              right: 64,
              bottom: 56,
              display: "flex",
              alignItems: "center",
              gap: 18,
              padding: "18px 28px",
              borderRadius: 22,
              border: `2px solid ${th.amber}`,
              background: th.card,
              opacity: clamp(pq * 2),
              transform: `scale(${lerp(0.7, 1, pq)})`,
            }}
          >
            <div style={{ fontSize: 56, fontWeight: 800, color: th.amber }}>{ratio}</div>
            <div style={{ fontSize: 26, fontWeight: 500, color: th.ink3 }}>{ratioSub}</div>
          </div>
        ) : null}
      </Card>
    </Canvas>
  );
};

export type LineDrawProps = {
  points?: { label: string; value: number }[];
  min?: number;
  max?: number;
  prefix?: string;
  suffix?: string;
  decimals?: number;
  note?: string;
};
/** line-draw：零线先出现，折线从左往右描出，每个点到达时弹出数值；零线以下的部分变红 */
export const LineDraw: React.FC<LineDrawProps> = ({
  points = [
    { label: "Q3'25", value: 24.5 },
    { label: "Q1'26", value: 10.1 },
    { label: "Q2'26", value: -5.9 },
    { label: "Q3'26", value: -9.1 },
  ],
  min = -15,
  max = 30,
  prefix = "$",
  suffix = "B",
  decimals = 1,
  note = "",
}) => {
  const t = useMs();
  const th = useTheme();
  const W = 1696;
  const H = 720;
  const x0 = 160;
  const x1 = W - 160;
  const y0 = 110;
  const y1 = 600;
  const X = (i: number) => x0 + (i * (x1 - x0)) / (points.length - 1);
  const Y = (v: number) => y0 + ((max - v) / (max - min)) * (y1 - y0);
  const pts = points.map((p, i) => [X(i), Y(p.value)] as [number, number]);
  const L = polyLength(pts);
  const d = polyPath(pts);
  const z = seg(t, LEAD + 200, 400);
  const q = seg(t, LEAD + 500, 1300, ease.inOutCubic);
  const n = points.length;
  return (
    <Canvas content>
      <Card style={{ left: 112, top: 200, width: W, height: H, ...enter(seg(t, LEAD, 400), 30, 0.98) }}>
        <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`} style={{ position: "absolute", left: 0, top: 0 }}>
          <defs>
            <clipPath id="aml-ld-above">
              <rect x={0} y={0} width={W} height={Y(0)} />
            </clipPath>
            <clipPath id="aml-ld-below">
              <rect x={0} y={Y(0)} width={W} height={H} />
            </clipPath>
          </defs>
          <g opacity={z}>
            <line x1={x0 - 60} x2={x1 + 60} y1={Y(0)} y2={Y(0)} stroke={th.track} strokeWidth={3} strokeDasharray="10 8" />
            <text x={x0 - 70} y={Y(0) + 10} textAnchor="end" fontSize={26} fontWeight={700} fill={th.ink3} fontFamily={th.font}>
              0
            </text>
          </g>
          <path d={d} fill="none" stroke={th.ink} strokeWidth={6} strokeLinejoin="round" clipPath="url(#aml-ld-above)" strokeDasharray={L} strokeDashoffset={L * (1 - q)} />
          <path d={d} fill="none" stroke={th.red} strokeWidth={6} strokeLinejoin="round" clipPath="url(#aml-ld-below)" strokeDasharray={L} strokeDashoffset={L * (1 - q)} />
          {points.map((p, i) => {
            const isNeg = p.value < 0;
            const col = isNeg ? th.red : th.ink;
            const k = seg(q, i / (n - 1) - 0.02, 0.12, ease.outBack);
            return (
              <g key={i}>
                <g opacity={clamp(k * 2)} transform={`translate(${X(i)} 0) scale(${lerp(0.5, 1, clamp(k))},1) translate(${-X(i)} 0)`}>
                  <circle cx={X(i)} cy={Y(p.value)} r={14} fill={th.card} stroke={col} strokeWidth={5} />
                  <text x={X(i)} y={Y(p.value) + (isNeg ? 62 : -30)} textAnchor="middle" fontSize={44} fontWeight={800} fill={col} fontFamily={th.font}>
                    {signed(p.value, decimals, prefix, suffix, true)}
                  </text>
                </g>
                <text x={X(i)} y={y1 + 80} textAnchor="middle" fontSize={28} fontWeight={600} fill={th.ink2} fontFamily={th.font} opacity={seg(t, LEAD + 300 + i * 80, 300)}>
                  {p.label}
                </text>
              </g>
            );
          })}
          {note ? (
            <text x={x1 + 60} y={56} textAnchor="end" fontSize={22} fontWeight={500} fill={th.ink3} fontFamily={th.font} opacity={seg(t, LEAD + 1900, 300)}>
              {note}
            </text>
          ) : null}
        </svg>
      </Card>
    </Canvas>
  );
};

export type ExpectVsActualProps = { title?: string; expected?: number; actual?: number; gapLabel?: string; tone?: Tone; unit?: string; scale?: number };
/** expect-vs-actual：虚线预期框先出现，实心实际柱长到自己的高度，差额括号展开并滚动读数 */
export const ExpectVsActual: React.FC<ExpectVsActualProps> = ({
  title = "Operating cash flow",
  expected = 53.9,
  actual = 42.3,
  gapLabel = "collected less",
  tone = "red",
  unit = "B",
  scale = 9,
}) => {
  const t = useMs();
  const th = useTheme();
  const col = toneColor(th, tone);
  const W = 1000;
  const H = 640;
  const base = 600;
  const eh = expected * scale;
  const ah = actual * scale;
  const e = seg(t, LEAD + 250, 400);
  const g = seg(t, LEAD + 650, 800);
  const hh = ah * g;
  const b = seg(t, LEAD + 1450, 450, ease.inOutCubic);
  const yTop = base - eh;
  const yBot = base - ah;
  const gap = (expected - actual) * b;
  return (
    <Canvas content>
      <Card style={{ left: 410, top: 170, width: 1100, height: 780, padding: "44px 50px", ...enter(seg(t, LEAD, 400), 30, 0.98) }}>
        <div style={{ fontSize: 40, fontWeight: 800 }}>{title}</div>
        <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`} style={{ position: "absolute", left: 50, top: 110 }}>
          <line x1={0} y1={base} x2={W} y2={base} stroke={th.track} strokeWidth={2} />
          <g opacity={e}>
            <rect x={80} width={260} rx={18} y={base - eh} height={eh} fill={th.card} stroke={th.ink3} strokeWidth={3} strokeDasharray="12 9" />
            <text x={210} y={base - eh - 22} textAnchor="middle" fontSize={40} fontWeight={700} fill={th.ink3} fontFamily={th.font}>
              {`$${expected}${unit} est.`}
            </text>
          </g>
          <rect x={380} width={260} rx={18} y={base - hh} height={hh} fill={th.ink} />
          <text x={510} y={base - hh - 22} textAnchor="middle" fontSize={52} fontWeight={800} fill={th.ink} fontFamily={th.font} opacity={clamp(g * 3)}>
            {`$${(actual * g).toFixed(1)}${unit}`}
          </text>
          <path d={`M660 ${yTop} h20 V${lerp(yTop, yBot, b)} h-20`} fill="none" stroke={col} strokeWidth={5} strokeLinecap="round" opacity={clamp(b * 4)} />
          <text x={700} y={(yTop + yBot) / 2 + 10} fontSize={54} fontWeight={800} fill={col} fontFamily={th.font} opacity={clamp(b * 2)}>
            {signed(-gap, 1, "$", unit)}
          </text>
          <text x={700} y={(yTop + yBot) / 2 + 52} fontSize={30} fontWeight={600} fill={col} fontFamily={th.font} opacity={seg(t, LEAD + 1800, 300)}>
            {gapLabel}
          </text>
        </svg>
      </Card>
    </Canvas>
  );
};

export type LineCrashProps = { pre?: number[]; post?: number[]; drop?: number; tag?: string };
/** line-crash：股价线平稳描出，到断点处变红断崖下落，终点圆点脉冲，跌幅滚动 */
export const LineCrash: React.FC<LineCrashProps> = ({
  pre = [40, 34, 44, 30, 36, 22, 32, 18, 24],
  post = [104, 118, 110, 124, 116, 122],
  drop = -10,
  tag = "▼ GOOGL · AFTER HOURS",
}) => {
  const t = useMs();
  const th = useTheme();
  const W = 1080;
  const H = 380;
  const sx = 1080 / 15;
  const sy = 2.4;
  const a1 = pre.map((v, i) => [i * sx, v * sy] as [number, number]);
  const bx = a1[a1.length - 1][0];
  const a2: [number, number][] = [[bx, a1[a1.length - 1][1]], ...post.map((v, i) => [bx + (i + 1) * sx * 0.95, v * sy] as [number, number])];
  const L1 = polyLength(a1);
  const L2 = polyLength(a2);
  const a = seg(t, LEAD + 200, 900, ease.inOutCubic);
  const b = seg(t, LEAD + 1100, 450, ease.inCubic);
  const end = a2[a2.length - 1];
  const showDot = b >= 1;
  const r = clamp((((t - LEAD - 1550) % 900) + 900) % 900 / 900);
  const q = seg(t, LEAD + 1100, 700, ease.outQuart);
  return (
    <Canvas content>
      <Card style={{ left: 360, top: 200, width: 1200, height: 700, padding: "50px 56px", ...enter(seg(t, LEAD, 400), 30, 0.98) }}>
        <Chip fg={th.red} bg={th.redT} style={{ fontSize: 26 }}>
          {tag}
        </Chip>
        <Num style={{ fontSize: 170, color: th.red, position: "absolute", right: 60, top: 40 }}>{q > 0 ? MINUS + Math.abs(drop * q).toFixed(0) + "%" : ""}</Num>
        <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`} style={{ position: "absolute", left: 60, top: 280 }}>
          <path d={`${polyPath(a2)} L${end[0]} ${H} L${bx} ${H} Z`} fill={th.red} opacity={0.14 * seg(t, LEAD + 1400, 400)} />
          <path d={polyPath(a1)} fill="none" stroke={th.ink} strokeWidth={6} strokeLinejoin="round" strokeLinecap="round" strokeDasharray={L1} strokeDashoffset={L1 * (1 - a)} />
          <path d={polyPath(a2)} fill="none" stroke={th.red} strokeWidth={6} strokeLinejoin="round" strokeLinecap="round" strokeDasharray={L2} strokeDashoffset={L2 * (1 - b)} />
          <circle cx={end[0]} cy={end[1]} r={11 + 26 * r} fill="none" stroke={th.red} strokeWidth={3} opacity={showDot ? 1 - r : 0} />
          <circle cx={end[0]} cy={end[1]} r={11} fill={th.red} opacity={showDot ? 1 : 0} />
        </svg>
      </Card>
    </Canvas>
  );
};

export type DonutFillProps = { items?: { label: string; value: number; tone?: Tone }[]; caption?: string };
/** donut-fill：两个环形顺时针补到各自比例，中心数字同步滚动 */
export const DonutFill: React.FC<DonutFillProps> = ({
  items = [
    { label: "A year ago", value: 15, tone: "muted" },
    { label: "Q3 2026", value: 24, tone: "blue" },
  ],
  caption = "Google Cloud share of Alphabet revenue",
}) => {
  const t = useMs();
  const th = useTheme();
  const R = 190;
  const C = 2 * Math.PI * R;
  const w = 620;
  const gap = 80;
  const left0 = (1920 - (items.length * w + (items.length - 1) * gap)) / 2;
  return (
    <Canvas content>
      {items.map((it, i) => {
        const g = seg(t, LEAD + 400 + i * 450, 900, ease.inOutCubic);
        const col = it.tone === "muted" || !it.tone ? th.ph : toneColor(th, it.tone);
        const txt = it.tone === "muted" || !it.tone ? th.ink2 : toneColor(th, it.tone);
        return (
          <Card key={i} style={{ left: left0 + i * (w + gap), top: 220, width: w, height: 620, padding: 40, textAlign: "center", ...enter(seg(t, LEAD + i * 120, 450)) }}>
            <svg width={460} height={460} viewBox="0 0 460 460" style={{ display: "block", margin: "20px auto 0" }}>
              <circle cx={230} cy={230} r={R} fill="none" stroke={th.ph2} strokeWidth={44} />
              <circle cx={230} cy={230} r={R} fill="none" stroke={col} strokeWidth={44} strokeLinecap="round" transform="rotate(-90 230 230)" strokeDasharray={C} strokeDashoffset={C * (1 - (it.value / 100) * g)} />
              <text x={230} y={258} textAnchor="middle" fontSize={92} fontWeight={800} fill={txt} fontFamily={th.font}>
                {Math.round(it.value * g) + "%"}
              </text>
            </svg>
            <Label style={{ fontSize: 32, marginTop: 14 }}>{it.label}</Label>
          </Card>
        );
      })}
      <Label style={{ position: "absolute", left: 0, right: 0, top: 880, textAlign: "center", fontSize: 32, opacity: seg(t, LEAD + 600, 400) }}>{caption}</Label>
    </Canvas>
  );
};

export type RulerMarkersProps = {
  min?: number;
  max?: number;
  marks?: { value: number; label: string; tone?: Tone }[];
  actual?: { value: number; label: string };
  unit?: string;
  beat?: string;
  miss?: string;
};
/** ruler-markers：刻度尺展开，几个预期点依次落下，实际值最后砸到位置，两侧显出"超 / 没超" */
export const RulerMarkers: React.FC<RulerMarkersProps> = ({
  min = 85,
  max = 115,
  marks = [
    { value: 91, label: "Bloomberg consensus", tone: "ink" },
    { value: 105, label: "Sell-side", tone: "red" },
    { value: 110, label: "Buy-side", tone: "red" },
  ],
  actual = { value: 103, label: "Actual" },
  unit = "%",
  beat = "BEAT",
  miss = "MISS",
}) => {
  const t = useMs();
  const th = useTheme();
  const W = 1696;
  const y = 290;
  const x0 = 120;
  const x1 = W - 120;
  const X = (v: number) => x0 + ((v - min) / (max - min)) * (x1 - x0);
  const ax = X(actual.value);
  const a = seg(t, LEAD + 1650, 420, ease.outBack);
  const bm = seg(t, LEAD + 2050, 400);
  return (
    <Canvas content>
      <Card style={{ left: 112, top: 260, width: W, height: 560, ...enter(seg(t, LEAD, 400), 30, 0.98) }}>
        <svg width={W} height={560} viewBox={`0 0 ${W} 560`} style={{ position: "absolute", left: 0, top: 0 }}>
          <rect x={x0} y={y - 12} width={ax - x0} height={24} rx={12} fill={th.teal} opacity={0.16 * bm} />
          <rect x={ax} y={y - 12} width={x1 - ax} height={24} rx={12} fill={th.red} opacity={0.16 * bm} />
          <line x1={x0} y1={y} x2={lerp(x0, x1, seg(t, LEAD + 200, 500, ease.inOutCubic))} y2={y} stroke={th.track} strokeWidth={4} strokeLinecap="round" />
          {marks.map((m, i) => {
            const col = toneColor(th, m.tone ?? "ink");
            const q = seg(t, LEAD + 700 + i * 260, 420, ease.outBack);
            return (
              <g key={i} opacity={clamp(q * 2)} transform={`translate(0 ${(1 - q) * -60})`}>
                <circle cx={X(m.value)} cy={y} r={20} fill={th.card} stroke={col} strokeWidth={5} />
                <text x={X(m.value)} y={y - 50} textAnchor="middle" fontSize={46} fontWeight={800} fill={col} fontFamily={th.font}>
                  {m.value + unit}
                </text>
                <text x={X(m.value)} y={y - 108} textAnchor="middle" fontSize={28} fontWeight={600} fill={th.ink2} fontFamily={th.font}>
                  {m.label}
                </text>
              </g>
            );
          })}
          <g opacity={clamp(a * 2)} transform={`translate(${ax} ${y}) scale(${lerp(1.8, 1, a)}) translate(${-ax} ${-y})`}>
            <circle cx={ax} cy={y} r={34} fill={th.amber} />
            <text x={ax} y={y + 110} textAnchor="middle" fontSize={72} fontWeight={800} fill={th.amber} fontFamily={th.font}>
              {actual.value + unit}
            </text>
            <text x={ax} y={y + 156} textAnchor="middle" fontSize={32} fontWeight={800} fill={th.ink} fontFamily={th.font}>
              {actual.label}
            </text>
          </g>
          <text x={(x0 + ax) / 2} y={y + 70} textAnchor="middle" fontSize={30} fontWeight={800} fill={th.teal} fontFamily={th.font} opacity={bm}>
            {beat}
          </text>
          <text x={(ax + x1) / 2} y={y + 70} textAnchor="middle" fontSize={30} fontWeight={800} fill={th.red} fontFamily={th.font} opacity={bm}>
            {miss}
          </text>
        </svg>
      </Card>
    </Canvas>
  );
};

export type ProgressOverflowProps = { value?: number; label?: string };
/** progress-overflow：进度条填到 100% 刻度后继续前进，超出部分变红，百分数同步滚动 */
export const ProgressOverflow: React.FC<ProgressOverflowProps> = ({ value = 121, label = "Capex / operating cash flow" }) => {
  const t = useMs();
  const th = useTheme();
  const full = 1100;
  const trackW = (full * 100) / Math.max(100, value);
  const q = seg(t, LEAD + 300, 1300, ease.inOutCubic) * value;
  const over = q > 100;
  return (
    <Canvas content>
      <Card style={{ left: 260, top: 300, width: 1400, height: 460, padding: "50px 60px", ...enter(seg(t, LEAD, 400)) }}>
        <Kicker>{label.toUpperCase()}</Kicker>
        <Num style={{ fontSize: 150, color: over ? th.red : th.amber }}>{Math.round(q) + "%"}</Num>
        <div
          style={{
            position: "relative",
            height: 26,
            width: full,
            borderRadius: 13,
            background: th.ph2,
            marginTop: 40,
            transform: over && q < value ? `translateX(${Math.sin(t / 30) * 2}px)` : undefined,
          }}
        >
          <div style={{ position: "absolute", left: 0, top: 0, bottom: 0, borderRadius: "13px 0 0 13px", background: th.ink, width: (Math.min(q, 100) / Math.max(100, value)) * full }} />
          <div style={{ position: "absolute", left: trackW, top: 0, bottom: 0, borderRadius: "0 13px 13px 0", background: th.red, width: (Math.max(0, q - 100) / Math.max(100, value)) * full }} />
          {value > 100 ? (
            <>
              <div style={{ position: "absolute", left: trackW - 2, top: -16, bottom: -16, width: 4, background: th.ink, borderRadius: 2 }} />
              <div style={{ position: "absolute", left: trackW - 40, top: 52, fontSize: 24, fontWeight: 700, color: th.ink3 }}>100%</div>
            </>
          ) : null}
        </div>
      </Card>
    </Canvas>
  );
};

export type CalloutProps = { x?: number; y?: number; label?: string; dx?: number; dy?: number; backdrop?: boolean };
/** callout：在照片或图表上点出一个对象，圆点轻弹，折线描出，标签逐字出现。叠在实拍上用时 backdrop=false */
export const Callout: React.FC<CalloutProps> = ({ x = 760, y = 560, label = "TPU racks: inventory until delivered", dx = 180, dy = -160, backdrop = true }) => {
  const t = useMs();
  const th = useTheme();
  const ex = x + dx;
  const ey = y + dy;
  const pts: [number, number][] = [
    [x, y],
    [ex, ey],
    [ex + 260, ey],
  ];
  const L = polyLength(pts);
  const d = seg(t, LEAD, 350, ease.outBack);
  const hr = seg(t, LEAD + 100, 600);
  const k = seg(t, LEAD + 450, 500, ease.linear);
  return (
    <Canvas>
      {backdrop ? (
        <>
          <div style={{ position: "absolute", inset: 0, background: "linear-gradient(160deg,#16223A,#0E1626)" }} />
          <svg width={1920} height={1080} style={{ position: "absolute", left: 0, top: 0 }}>
            {Array.from({ length: 8 }, (_, i) => (
              <rect key={i} x={560 + i * 60} y={380 + i * 10} width={40} height={340 - i * 20} rx={6} fill="#22314F" />
            ))}
          </svg>
        </>
      ) : null}
      <svg width={1920} height={1080} style={{ position: "absolute", left: 0, top: 0 }}>
        <circle cx={x} cy={y} r={9 + 30 * hr} fill="none" stroke="#fff" strokeWidth={2} opacity={1 - hr} />
        <path d={polyPath(pts)} fill="none" stroke="#fff" strokeWidth={3} strokeLinecap="round" strokeDasharray={L} strokeDashoffset={L * (1 - seg(t, LEAD + 200, 500, ease.inOutCubic))} />
        <circle cx={x} cy={y} r={Math.max(0, 9 * d)} fill="#fff" />
      </svg>
      <div
        style={{
          position: "absolute",
          left: ex,
          top: ey - 74,
          padding: "14px 24px",
          background: "rgba(255,255,255,0.96)",
          borderRadius: 18,
          fontSize: 34,
          fontWeight: 800,
          color: "#141B2D",
          whiteSpace: "nowrap",
          fontFamily: th.font,
          opacity: k > 0 ? 1 : 0,
        }}
      >
        {label.slice(0, Math.round(label.length * k))}
      </div>
    </Canvas>
  );
};
