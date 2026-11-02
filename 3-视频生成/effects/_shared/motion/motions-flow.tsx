// 流程类：现金光点走流程、飞轮反转
import React from "react";
import { Canvas, Card, enter, polyLength, polyPath } from "./ui";
import { useTheme } from "./theme";
import { LEAD, clamp, ease, lerp, pad2, seg, useMs } from "./time";

// 三次贝塞尔采样成折线，便于按长度取点（不依赖浏览器 getPointAtLength）
const cubic = (p0: number[], p1: number[], p2: number[], p3: number[], n = 24): [number, number][] =>
  Array.from({ length: n }, (_, i) => {
    const s = (i + 1) / n;
    const u = 1 - s;
    return [
      u * u * u * p0[0] + 3 * u * u * s * p1[0] + 3 * u * s * s * p2[0] + s * s * s * p3[0],
      u * u * u * p0[1] + 3 * u * u * s * p1[1] + 3 * u * s * s * p2[1] + s * s * s * p3[1],
    ] as [number, number];
  });
const pointAt = (pts: [number, number][], len: number): [number, number] => {
  let acc = 0;
  for (let i = 1; i < pts.length; i++) {
    const d = Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1]);
    if (acc + d >= len) {
      const k = d ? (len - acc) / d : 0;
      return [lerp(pts[i - 1][0], pts[i][0], k), lerp(pts[i - 1][1], pts[i][1], k)];
    }
    acc += d;
  }
  return pts[pts.length - 1];
};

export type CashPathProps = { stations?: string[]; cashLabel?: string; dipLabel?: string; dipFrom?: number; dipTo?: number };
/**
 * cash-path：光点沿各站前进，下方现金线在 dipFrom 站掉进低谷，到 dipTo 站才回升（如 TPU 先建后收）。
 * 站数 2–6 个；dipFrom / dipTo 是站的序号（从 0 起）。
 */
export const CashPath: React.FC<CashPathProps> = ({
  stations = ["CONTRACT", "BUILD", "DELIVER", "COLLECT"],
  cashLabel = "ALPHABET CASH",
  dipLabel = "cash tied up in inventory",
  dipFrom = 1,
  dipTo,
}) => {
  const t = useMs();
  const th = useTheme();
  const n = stations.length;
  const last = n - 1;
  const to = dipTo ?? last;
  const xs = stations.map((_, i) => 200 + (i * 1200) / last);
  const y = 200;
  const cy0 = 470;
  const cy1 = 580;
  const A = xs[dipFrom];
  const B = xs[to];
  const cashPts: [number, number][] = [
    [xs[0], cy0],
    [A - 60, cy0],
    ...cubic([A - 60, cy0], [A - 20, cy0], [A - 20, cy1], [A + 30, cy1]),
    [B - 90, cy1],
    ...cubic([B - 90, cy1], [B - 40, cy1], [B - 40, cy0], [B, cy0]),
    ...(B < xs[last] ? ([[xs[last], cy0]] as [number, number][]) : []),
  ];
  const L = polyLength(cashPts);
  const run = seg(t, LEAD + 500, 3000, ease.inOutCubic);
  const [px, py] = pointAt(cashPts, L * run);
  const z = seg(t, LEAD + 1500, 500) * (1 - seg(t, LEAD + 3300, 400));
  return (
    <Canvas content>
      <Card style={{ left: 112, top: 220, width: 1696, height: 700, ...enter(seg(t, LEAD, 400), 30, 0.98) }}>
        <svg width={1696} height={700} viewBox="0 0 1696 700" style={{ position: "absolute", left: 0, top: 0 }}>
          <line x1={xs[0]} y1={y} x2={xs[last]} y2={y} stroke={th.ph2} strokeWidth={6} strokeLinecap="round" />
          <line x1={xs[0]} y1={y} x2={lerp(xs[0], xs[last], run)} y2={y} stroke={th.ink} strokeWidth={6} strokeLinecap="round" />
          {stations.map((name, i) => {
            const reached = run >= i / last - 1e-6;
            const col = i === last ? th.teal : i === dipFrom ? th.amber : th.ink;
            const fill = reached && i === last ? th.tealT : reached && i === dipFrom ? th.amberT : th.card;
            return (
              <g key={i}>
                <circle cx={xs[i]} cy={y} r={60} fill={th.card} />
                <circle cx={xs[i]} cy={y} r={60} fill={fill} stroke={reached ? col : th.ph} strokeWidth={4} />
                <text x={xs[i]} y={y + 14} textAnchor="middle" fontSize={40} fontWeight={800} fill={reached ? col : th.ink3} fontFamily={th.font}>
                  {pad2(i + 1)}
                </text>
                <text x={xs[i]} y={y + 112} textAnchor="middle" fontSize={30} fontWeight={800} letterSpacing={3} fill={reached ? col : th.ink3} fontFamily={th.font}>
                  {name}
                </text>
              </g>
            );
          })}
          <text x={120} y={cy0 - 40} fontSize={24} fontWeight={700} letterSpacing={3} fill={th.ink3} fontFamily={th.font}>
            {cashLabel}
          </text>
          <rect x={A + 30} y={cy0 + 10} width={B - 120 - A} height={cy1 - cy0 - 10} rx={10} fill={th.red} opacity={0.1 * z} />
          <text x={(A + B) / 2} y={cy0 + 70} textAnchor="middle" fontSize={30} fontWeight={700} fill={th.red} fontFamily={th.font} opacity={z}>
            {dipLabel}
          </text>
          <path d={polyPath(cashPts)} fill="none" stroke={th.ink} strokeWidth={5} strokeDasharray={L} strokeDashoffset={L * (1 - run)} />
          <circle cx={px} cy={py} r={34} fill={th.amber} opacity={run > 0 ? 0.25 : 0} />
          <circle cx={px} cy={py} r={18} fill={th.amber} opacity={run > 0 ? 1 : 0} />
        </svg>
      </Card>
    </Canvas>
  );
};

export type FlywheelProps = { nodes?: string[]; reverseAt?: number; center?: string; centerAfter?: string };
/** flywheel：四个节点沿环形顺时针运转，到 reverseAt（毫秒）变红并反向——"过去的模式反过来了" */
export const Flywheel: React.FC<FlywheelProps> = ({
  nodes = ["Margins", "Free cash flow", "Buybacks", "Value per share"],
  reverseAt = 1800,
  center = "OLD GOOGLE",
  centerAfter = "NEW GOOGLE",
}) => {
  const t = useMs();
  const th = useTheme();
  const cx = 550;
  const cy = 430;
  const R = 310;
  const n = nodes.length;
  const pt = (a: number) => [cx + Math.cos(a) * R, cy + Math.sin(a) * R];
  const rev = t > LEAD + reverseAt;
  const col = rev ? th.red : th.teal;
  const tt = (t - LEAD - 600) / 1000;
  const rot = rev ? ((reverseAt - 600) / 1000) * 1.2 - ((t - LEAD - reverseAt) / 1000) * 1.6 : Math.max(0, tt) * 1.2;
  const show = seg(t, LEAD + 600, 300);
  const span = (2 * Math.PI) / n;
  return (
    <Canvas content>
      <Card style={{ left: 410, top: 120, width: 1100, height: 860, ...enter(seg(t, LEAD, 400), 30, 0.98) }}>
        <svg width={1100} height={860} viewBox="0 0 1100 860" style={{ position: "absolute", left: 0, top: 0 }}>
          <circle cx={cx} cy={cy} r={R} fill="none" stroke={th.ph2} strokeWidth={4} />
          {nodes.map((_, i) => {
            const a0 = -Math.PI / 2 + i * span + 0.32 + rot;
            const a1 = a0 + span - 0.64;
            const [x0, y0] = pt(a0);
            const [x1, y1] = pt(a1);
            const tip = rev ? a0 : a1;
            const dir = rev ? -1 : 1;
            const [hx, hy] = pt(tip);
            const tx = -Math.sin(tip) * dir;
            const ty = Math.cos(tip) * dir;
            const nx = Math.cos(tip);
            const ny = Math.sin(tip);
            return (
              <g key={i} opacity={show}>
                <path d={`M${x0} ${y0} A${R} ${R} 0 0 1 ${x1} ${y1}`} fill="none" stroke={col} strokeWidth={8} strokeLinecap="round" />
                <path d={`M${hx + tx * 22} ${hy + ty * 22} L${hx + nx * 16} ${hy + ny * 16} L${hx - nx * 16} ${hy - ny * 16} Z`} fill={col} strokeLinejoin="round" />
              </g>
            );
          })}
          <text x={cx} y={cy + 12} textAnchor="middle" fontSize={34} fontWeight={800} letterSpacing={3} fill={rev ? th.red : th.ink} fontFamily={th.font}>
            {rev ? centerAfter : center}
          </text>
        </svg>
        {nodes.map((name, i) => {
          const a = -Math.PI / 2 + i * span;
          const q = seg(t, LEAD + 200 + i * 100, 400, ease.outBack);
          return (
            <div
              key={name}
              style={{
                position: "absolute",
                left: cx + Math.cos(a) * R,
                top: cy + Math.sin(a) * R,
                transform: `translate(-50%,-50%) scale(${lerp(0.6, 1, q)})`,
                opacity: clamp(q * 2),
                padding: "14px 26px",
                borderRadius: 999,
                background: th.card,
                border: `2px solid ${th.line}`,
                boxShadow: th.shadow,
                fontSize: 30,
                fontWeight: 800,
                whiteSpace: "nowrap",
              }}
            >
              {name}
            </div>
          );
        })}
      </Card>
    </Canvas>
  );
};
