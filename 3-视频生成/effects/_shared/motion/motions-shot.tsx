// 镜头配方类动效（2026-11-03 纳入）：镜头运动、数据、强调、转场、文字、入场。
// 运动配方参考 video-shotcraft（Apache-2.0，github.com/Vincentwei1021/video-shotcraft，commit 1266a3e）的镜头配方卡，
// 本文件代码为本项目按动效库规范重新编写：只依赖时间、颜色全部取主题 tone、不含原项目素材。registry.ts 的 ref 记着对应配方卡。
import React from "react";
import { Img } from "remotion";
import { Canvas, Card, Kicker, Label, Media, enter } from "./ui";
import { Tone, toneColor, toneTint, useTheme } from "./theme";
import { LEAD, clamp, ease, lerp, seg, settle, signed, useMs } from "./time";

const W = 1920;
const H = 1080;
const inOutSine = (p: number) => -(Math.cos(Math.PI * p) - 1) / 2;

// L 形取景角标（四角收拢）
const Brackets: React.FC<{ x: number; y: number; w: number; h: number; p: number; color: string; size?: number; spread?: number }> = ({ x, y, w, h, p, color, size = 34, spread = 120 }) => {
  const o = (1 - p) * spread;
  const c = [
    [x - o, y - o, 1, 1],
    [x + w + o, y - o, -1, 1],
    [x - o, y + h + o, 1, -1],
    [x + w + o, y + h + o, -1, -1],
  ];
  return (
    <svg width={W} height={H} style={{ position: "absolute", inset: 0, opacity: clamp(p * 3) }}>
      {c.map(([cx, cy, sx, sy], i) => (
        <path key={i} d={`M${cx} ${cy + sy * size} L${cx} ${cy} L${cx + sx * size} ${cy}`} stroke={color} strokeWidth={4} fill="none" strokeLinecap="round" />
      ))}
    </svg>
  );
};

// ───────────── 镜头 ─────────────
export type CrashZoomProps = { src?: string; target?: { x: number; y: number; w: number; h: number }; zoom?: number; mode?: "bounce" | "slam"; label?: string; tone?: Tone };
/** crash-zoom：全景先用四角标点名目标，再 0.2 秒急推到特写；bounce 过冲回弹，slam 撞停震屏 */
export const CrashZoom: React.FC<CrashZoomProps> = ({ src, target = { x: 1080, y: 520, w: 420, h: 220 }, zoom = 2.4, mode = "slam", label = "Non-GAAP gross margin 50.4%", tone = "amber" }) => {
  const t = useMs();
  const th = useTheme();
  const box = { x: 160, y: 120, w: 1600, h: 840 };
  const lock = seg(t, LEAD + 500, 400, ease.outBack);
  const pre = seg(t, LEAD + 1000, 200, ease.outCubic); // 先退
  const push = seg(t, LEAD + 1200, 200, ease.inCubic); // 再冲
  const settleT = Math.max(0, t - LEAD - 1400);
  let z = lerp(1, 0.97, pre) * lerp(1, zoom, push);
  if (mode === "bounce" && push >= 1) z = zoom * (1 + 0.05 * settle(clamp(settleT / 260), 5, 1.5));
  const shake = mode === "slam" && push >= 1 ? 14 * Math.exp(-settleT / 60) * Math.sin(settleT / 11) : 0;
  const cx = target.x + target.w / 2, cy = target.y + target.h / 2;
  const tx = (W / 2 - cx) * push, ty = (H / 2 - cy) * push;
  const blur = push > 0 && push < 1 ? 6 : 0;
  return (
    <Canvas bg>
      <div style={{ position: "absolute", inset: 0, transform: `translate(${tx + shake}px, ${ty + shake * 0.4}px) scale(${z})`, transformOrigin: `${cx}px ${cy}px`, filter: blur ? `blur(${blur}px)` : undefined }}>
        <Card style={{ left: box.x, top: box.y, width: box.w, height: box.h, overflow: "hidden" }}>
          <Media src={src} grade={false} style={{ inset: 0 }} />
        </Card>
        <Brackets x={target.x} y={target.y} w={target.w} h={target.h} p={lock} color={toneColor(th, tone)} />
      </div>
      <div style={{ position: "absolute", left: 0, right: 0, bottom: 150, display: "flex", justifyContent: "center", ...enter(seg(t, LEAD + 1600, 400)) }}>
        <div style={{ padding: "14px 30px", borderRadius: 999, background: th.cardSoft, border: `2px solid ${toneColor(th, tone)}`, fontSize: 38, fontWeight: 800, color: th.ink }}>{label}</div>
      </div>
    </Canvas>
  );
};

export type ParallaxPanProps = { items?: { kicker: string; value: string; tone?: Tone }[]; backdropText?: string; hero?: number };
/** parallax-pan：三层速度梯度横移出纵深（背景大字慢、卡片中速、胶囊快），停稳时主角卡浮起 */
export const ParallaxPan: React.FC<ParallaxPanProps> = ({ items = [{ kicker: "LASERS", value: "Lumentum" }, { kicker: "DSP", value: "Marvell" }, { kicker: "MODULES", value: "Coherent" }, { kicker: "SWITCHES", value: "Broadcom" }, { kicker: "GPUs", value: "Nvidia", tone: "teal" }], backdropText = "AI OPTICS SUPPLY CHAIN", hero = 4 }) => {
  const t = useMs();
  const th = useTheme();
  const p = seg(t, LEAD, 3600, ease.inOutCubic);
  const lift = seg(t, LEAD + 3400, 600, ease.outBack);
  const span = 2600;
  return (
    <Canvas bg>
      <div style={{ position: "absolute", top: 120, left: 200 - p * span * 0.25, fontSize: 260, fontWeight: 900, color: th.ink, opacity: 0.06, whiteSpace: "nowrap", letterSpacing: "-0.02em" }}>{backdropText}</div>
      {items.map((it, i) => {
        const x = 260 + i * 620 - p * span * 0.75;
        const isHero = i === hero;
        return (
          <Card key={i} style={{ left: x, top: 380 - (isHero ? 40 * lift : 0), width: 520, height: 300, padding: 40, boxShadow: isHero ? th.shadowHot(lift) : th.shadow, transform: `scale(${isHero ? 1 + 0.06 * lift : 1})` }}>
            <Kicker color={toneColor(th, it.tone ?? "blue")}>{it.kicker}</Kicker>
            <div style={{ fontSize: 74, fontWeight: 800, marginTop: 30 }}>{it.value}</div>
          </Card>
        );
      })}
      {items.map((it, i) => (
        <div key={`c${i}`} style={{ position: "absolute", top: 760, left: 380 + i * 700 - p * span * 1.25, padding: "10px 24px", borderRadius: 999, background: toneTint(th, it.tone ?? "blue"), color: toneColor(th, it.tone ?? "blue"), fontSize: 26, fontWeight: 700 }}>{`0${i + 1} · ${it.kicker}`}</div>
      ))}
    </Canvas>
  );
};

// ───────────── 数据 ─────────────
export type GaugeNeedleProps = { value?: number; min?: number; max?: number; label?: string; unit?: string; decimals?: number; zones?: { to: number; tone: Tone; label: string }[] };
/** gauge-needle：仪表先满弧扫针自检，再回落到真值（估值分位、情绪指数、产能利用率） */
export const GaugeNeedle: React.FC<GaugeNeedleProps> = ({ value = 30, min = 0, max = 100, label = "Some products · 2027 demand filled", unit = "%", decimals = 0, zones = [{ to: 40, tone: "red", label: "SHORT" }, { to: 80, tone: "amber", label: "TIGHT" }, { to: 100, tone: "teal", label: "OK" }] }) => {
  const t = useMs();
  const th = useTheme();
  const cx = 960, cy = 700, r = 380;
  const a0 = Math.PI, a1 = 2 * Math.PI;
  const ang = (v: number) => a0 + ((v - min) / (max - min)) * (a1 - a0);
  const sweep = seg(t, LEAD + 300, 700, ease.inOutCubic);
  const back = seg(t, LEAD + 1000, 900, ease.outBack);
  const v = sweep < 1 ? lerp(min, max, sweep) : lerp(max, value, back);
  const arc = (from: number, to: number) => {
    const p0 = [cx + r * Math.cos(ang(from)), cy + r * Math.sin(ang(from))], p1 = [cx + r * Math.cos(ang(to)), cy + r * Math.sin(ang(to))];
    return `M${p0[0]} ${p0[1]} A${r} ${r} 0 0 1 ${p1[0]} ${p1[1]}`;
  };
  let prev = min;
  const na = ang(v);
  return (
    <Canvas bg>
      <svg width={W} height={H} style={{ position: "absolute", inset: 0, opacity: seg(t, LEAD, 300) }}>
        {zones.map((z, i) => { const d = arc(prev, z.to); const lp = (prev + z.to) / 2; prev = z.to; return (
          <g key={i}>
            <path d={d} stroke={toneColor(th, z.tone)} strokeWidth={46} fill="none" opacity={0.85} />
            <text x={cx + (r + 70) * Math.cos(ang(lp))} y={cy + (r + 70) * Math.sin(ang(lp))} fill={toneColor(th, z.tone)} fontSize={26} fontWeight={800} textAnchor="middle" letterSpacing="3">{z.label}</text>
          </g>); })}
        {[...Array(11)].map((_, i) => { const a = ang(min + ((max - min) * i) / 10); return <line key={i} x1={cx + (r - 40) * Math.cos(a)} y1={cy + (r - 40) * Math.sin(a)} x2={cx + (r - 70) * Math.cos(a)} y2={cy + (r - 70) * Math.sin(a)} stroke={th.ink3} strokeWidth={3} />; })}
        <line x1={cx} y1={cy} x2={cx + (r - 30) * Math.cos(na)} y2={cy + (r - 30) * Math.sin(na)} stroke={th.ink} strokeWidth={10} strokeLinecap="round" />
        <circle cx={cx} cy={cy} r={26} fill={th.ink} />
      </svg>
      <div style={{ position: "absolute", left: 0, right: 0, top: 740, textAlign: "center" }}>
        <div style={{ fontSize: 120, fontWeight: 800 }}>{v.toFixed(decimals)}{unit}</div>
        <Label style={{ marginTop: 6 }}>{label}</Label>
      </div>
    </Canvas>
  );
};

export type AxisRescaleProps = { points?: { label: string; value: number }[]; burst?: { label: string; value: number }; unit?: string; title?: string };
/** axis-rescale：走势平稳画到最后，新值冲出图框，y 轴被迫重标、旧曲线压扁——“增长装不下” */
export const AxisRescale: React.FC<AxisRescaleProps> = ({ points = [{ label: "FY22", value: 1.7 }, { label: "FY23", value: 1.8 }, { label: "FY24", value: 1.4 }, { label: "FY25", value: 1.6 }], burst = { label: "FY26", value: 3.0 }, unit = "B", title = "Lumentum revenue ($)" }) => {
  const t = useMs();
  const th = useTheme();
  const x0 = 300, x1 = 1620, y0 = 820, y1 = 260;
  const all = [...points, burst];
  const oldMax = Math.max(...points.map((p) => p.value)) * 1.25;
  const newMax = burst.value * 1.15;
  const draw = seg(t, LEAD + 200, 1400, ease.inOutCubic);
  const shoot = seg(t, LEAD + 1700, 350, ease.inCubic);
  const resc = seg(t, LEAD + 2100, 800, ease.outBack);
  const max = lerp(oldMax, newMax, resc);
  const X = (i: number) => x0 + ((x1 - x0) * i) / (all.length - 1);
  const Y = (v: number) => y0 - ((y0 - y1) * v) / max;
  const n = points.length;
  const shown = draw * (n - 1);
  const pts: [number, number][] = [];
  for (let i = 0; i < n; i++) if (i <= shown + 1e-6) pts.push([X(i), Y(points[i].value)]);
  if (shown % 1 > 0 && Math.floor(shown) + 1 < n) { const i = Math.floor(shown), f = shown - i; pts.push([lerp(X(i), X(i + 1), f), lerp(Y(points[i].value), Y(points[i + 1].value), f)]); }
  const by = shoot > 0 ? lerp(Y(points[n - 1].value), resc > 0 ? Y(burst.value) : y1 - 260, shoot) : null;
  const ticks = [0, 0.25, 0.5, 0.75, 1].map((k) => k * max);
  const hit = resc > 0 && resc < 1 ? Math.sin(resc * Math.PI) * 8 : 0;
  return (
    <Canvas bg>
      <div style={{ position: "absolute", left: x0, top: 150, fontSize: 44, fontWeight: 800 }}>{title}</div>
      <svg width={W} height={H} style={{ position: "absolute", inset: 0, transform: `translateY(${hit}px)` }}>
        <rect x={x0} y={y1} width={x1 - x0} height={y0 - y1} fill="none" stroke={th.line} strokeWidth={2} />
        {ticks.map((v, i) => (
          <g key={i}><line x1={x0} x2={x1} y1={Y(v)} y2={Y(v)} stroke={th.track} strokeDasharray="4 8" /><text x={x0 - 20} y={Y(v) + 8} fill={th.ink3} fontSize={24} textAnchor="end">{v.toFixed(1)}{unit}</text></g>
        ))}
        {pts.length > 1 && <path d={"M" + pts.map((p) => p.join(" ")).join(" L")} stroke={toneColor(th, "blue")} strokeWidth={6} fill="none" />}
        {pts.map((p, i) => <circle key={i} cx={p[0]} cy={p[1]} r={8} fill={toneColor(th, "blue")} />)}
        {by !== null && <><line x1={X(n - 1)} y1={Y(points[n - 1].value)} x2={X(n)} y2={by} stroke={toneColor(th, "teal")} strokeWidth={8} /><circle cx={X(n)} cy={by} r={14} fill={toneColor(th, "teal")} /></>}
        {all.map((p, i) => <text key={i} x={X(i)} y={y0 + 44} fill={th.ink3} fontSize={24} textAnchor="middle" opacity={i < n ? 1 : shoot}>{p.label}</text>)}
      </svg>
      {resc > 0.3 && <div style={{ position: "absolute", left: X(n) - 250, top: Y(burst.value) - 110, width: 220, textAlign: "right", fontSize: 64, fontWeight: 800, color: toneColor(th, "teal"), ...enter(seg(t, LEAD + 2500, 400)) }}>{burst.value.toFixed(2)}{unit}</div>}
    </Canvas>
  );
};

export type TimelineTravelProps = { events?: { date: string; title: string; sub?: string; tone?: Tone }[] };
/** timeline-travel：镜头沿横向时间轴加速掠过，每过一个刻度卡片弹立，末刻度急停推近 */
export const TimelineTravel: React.FC<TimelineTravelProps> = ({ events = [{ date: "MAR 2", title: "Nvidia $2B → Lumentum", sub: "and $2B → Coherent" }, { date: "MAR 31", title: "Nvidia $2B → Marvell", sub: "NVLink Fusion" }, { date: "AUG 11", title: "Lumentum Q4 FY26", sub: "Revenue $1.01B" }, { date: "OCT 28", title: "Talks reported", sub: "Bloomberg", tone: "amber" }, { date: "NOV 2", title: "Deal announced", sub: "4.5 MRVL per LITE", tone: "teal" }] }) => {
  const t = useMs();
  const th = useTheme();
  const gap = 520, n = events.length;
  const travel = seg(t, LEAD, 3000, (p) => (p < 0.7 ? ease.inCubic(p / 0.7) * 0.82 : 0.82 + 0.18 * ease.outQuart((p - 0.7) / 0.3)));
  const pos = travel * (n - 1) * gap;
  const push = seg(t, LEAD + 3000, 600, ease.outCubic);
  const axisY = 640;
  return (
    <Canvas bg>
      <div style={{ position: "absolute", inset: 0, transform: `scale(${1 + 0.08 * push})`, transformOrigin: "960px 540px" }}>
        <div style={{ position: "absolute", left: 0, top: axisY, width: W, height: 4, background: th.track }} />
        {events.map((e, i) => {
          const x = 960 + i * gap - pos;
          const passed = clamp((pos - (i * gap - 260)) / 200);
          const pop = ease.outBack(passed);
          const c = toneColor(th, e.tone ?? "blue");
          return (
            <React.Fragment key={i}>
              <div style={{ position: "absolute", left: x - 12, top: axisY - 10, width: 24, height: 24, borderRadius: 12, background: passed > 0 ? c : th.track }} />
              <div style={{ position: "absolute", left: x - 100, top: axisY + 40, width: 200, textAlign: "center", fontSize: 28, fontWeight: 800, color: th.ink3, letterSpacing: "0.08em" }}>{e.date}</div>
              <Card style={{ left: x - 210, top: axisY - 320, width: 420, height: 250, padding: 32, transformOrigin: "50% 100%", transform: `scaleY(${pop}) translateY(${(1 - pop) * 40}px)`, opacity: clamp(passed * 2) }}>
                <Kicker color={c}>{e.date}</Kicker>
                <div style={{ fontSize: 40, fontWeight: 800, marginTop: 16, lineHeight: 1.15 }}>{e.title}</div>
                {e.sub && <Label style={{ marginTop: 12 }}>{e.sub}</Label>}
              </Card>
            </React.Fragment>
          );
        })}
      </div>
    </Canvas>
  );
};

export type BeforeAfterProps = { before?: { kicker: string; value: string; sub?: string }; after?: { kicker: string; value: string; sub?: string }; srcBefore?: string; srcAfter?: string };
/** before-after：两版叠放，分割杆先猛甩再慢扫，杆过处“之后”显影（2024 vs 2026、改前 vs 改后） */
export const BeforeAfter: React.FC<BeforeAfterProps> = ({ before = { kicker: "JUNE 2024", value: "−0.3%", sub: "Operating margin" }, after = { kicker: "JUNE 2026", value: "36.6%", sub: "Operating margin" }, srcBefore, srcAfter }) => {
  const t = useMs();
  const th = useTheme();
  const box = { x: 260, y: 200, w: 1400, h: 660 };
  const fling = seg(t, LEAD + 300, 350, ease.outCubic);
  const scan = seg(t, LEAD + 900, 1500, ease.inOutCubic);
  const xr = t < LEAD + 900 ? lerp(0.05, 0.35, fling) - 0.3 * seg(t, LEAD + 650, 250) : lerp(0.05, 1, scan);
  const panel = (side: "b" | "a") => {
    const d = side === "b" ? before : after;
    const src = side === "b" ? srcBefore : srcAfter;
    const tone: Tone = side === "b" ? "red" : "teal";
    return (
      <div style={{ position: "absolute", inset: 0, background: th.card }}>
        {side === "a" && <div style={{ position: "absolute", inset: 0, background: toneTint(th, "teal") }} />}
        {src && <Media src={src} grade style={{ inset: 0, opacity: 0.4 }} />}
        <div style={{ position: "absolute", left: 120, top: 180 }}>
          <Kicker color={toneColor(th, tone)}>{d.kicker}</Kicker>
          <div style={{ fontSize: 200, fontWeight: 800, color: toneColor(th, tone), letterSpacing: "-0.03em" }}>{d.value}</div>
          {d.sub && <Label>{d.sub}</Label>}
        </div>
      </div>
    );
  };
  return (
    <Canvas bg>
      <Card style={{ left: box.x, top: box.y, width: box.w, height: box.h, overflow: "hidden", ...enter(seg(t, LEAD, 300)) }}>
        {panel("b")}
        <div style={{ position: "absolute", inset: 0, clipPath: `inset(0 ${100 - xr * 100}% 0 0)` }}>{panel("a")}</div>
        <div style={{ position: "absolute", top: 0, bottom: 0, left: `${xr * 100}%`, width: 6, marginLeft: -3, background: th.ink, boxShadow: `0 0 24px ${th.ink3}` }}>
          <div style={{ position: "absolute", top: "50%", left: -26, width: 58, height: 58, marginTop: -29, borderRadius: 29, background: th.ink, color: th.card, fontSize: 30, display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 800 }}>⇆</div>
        </div>
      </Card>
    </Canvas>
  );
};

export type ListBrakeProps = { rows?: { rank: string; label: string; value: string }[]; target?: number; title?: string };
/** list-brake：长列表高速上滚、指数刹车精准停在目标行，目标行抬起并亮起 */
export const ListBrake: React.FC<ListBrakeProps> = ({ rows, target = 11, title = "Largest tech deals by equity value" }) => {
  const t = useMs();
  const th = useTheme();
  const list = rows ?? [...Array(14)].map((_, i) => ({ rank: `#${14 - i}`, label: i === 11 ? "Marvell → Lumentum (2026)" : `Deal ${14 - i}`, value: i === 11 ? "$115B" : `$${(40 + i * 6).toFixed(0)}B` }));
  const rowH = 110, viewTop = 260;
  const p = seg(t, LEAD, 2400, (q) => 1 - Math.pow(1 - q, 5));
  const offset = lerp(-rowH * 2, target * rowH - rowH * 2, p);
  const lift = seg(t, LEAD + 2300, 500, ease.outBack);
  const blur = (1 - p) * 6;
  return (
    <Canvas bg>
      <div style={{ position: "absolute", left: 300, top: 140, fontSize: 44, fontWeight: 800 }}>{title}</div>
      <div style={{ position: "absolute", left: 300, top: viewTop, width: 1320, height: rowH * 5, overflow: "hidden" }}>
        {list.map((r, i) => {
          const y = i * rowH - offset;
          const hit = i === target;
          return (
            <div key={i} style={{ position: "absolute", left: 0, right: 0, top: y, height: rowH - 14, display: "flex", alignItems: "center", gap: 40, padding: "0 40px", borderRadius: th.radius, background: hit ? toneTint(th, "amber") : th.card, border: `1px solid ${hit ? toneColor(th, "amber") : th.line}`, boxShadow: hit ? th.shadowHot(lift) : undefined, transform: hit ? `scale(${1 + 0.04 * lift})` : undefined, filter: hit ? undefined : `blur(${blur}px)`, opacity: hit ? 1 : lerp(1, 0.5, lift) }}>
              <div style={{ width: 90, fontSize: 34, fontWeight: 800, color: th.ink3 }}>{r.rank}</div>
              <div style={{ flex: 1, fontSize: 38, fontWeight: 700 }}>{r.label}</div>
              <div style={{ fontSize: 44, fontWeight: 800, color: hit ? toneColor(th, "amber") : th.ink }}>{r.value}</div>
            </div>
          );
        })}
      </div>
    </Canvas>
  );
};

// ───────────── 强调 ─────────────
export type SpotlightSweepProps = { panels?: { kicker: string; value: string; tone?: Tone }[] };
/** spotlight-sweep：暗场里一束聚光从左到右扫过，光到哪张卡哪张亮，光走后回暗，最后全场点亮 */
export const SpotlightSweep: React.FC<SpotlightSweepProps> = ({ panels = [{ kicker: "200G EML", value: "Lasers" }, { kicker: "R300", value: "Optical switch" }, { kicker: "ELSFP", value: "CPO lasers", tone: "teal" }] }) => {
  const t = useMs();
  const th = useTheme();
  const sx = lerp(-200, 2120, seg(t, LEAD, 2600, ease.inOutCubic));
  const all = seg(t, LEAD + 2700, 600);
  const xs = panels.map((_, i) => 260 + i * (1400 / panels.length) + 1400 / panels.length / 2);
  return (
    <Canvas bg>
      {panels.map((p, i) => {
        const lit = Math.max(all, clamp(1 - Math.abs(sx - xs[i]) / 380));
        return (
          <Card key={i} style={{ left: xs[i] - 210, top: 330, width: 420, height: 420, padding: 40, opacity: lerp(0.25, 1, lit), transform: `translateY(${(1 - lit) * 12}px)`, boxShadow: lit > 0.6 ? th.shadowHot(lit) : th.shadow }}>
            <Kicker color={toneColor(th, p.tone ?? "blue")}>{p.kicker}</Kicker>
            <div style={{ fontSize: 60, fontWeight: 800, marginTop: 30, lineHeight: 1.1 }}>{p.value}</div>
          </Card>
        );
      })}
      <div style={{ position: "absolute", inset: 0, background: `radial-gradient(520px 620px at ${sx}px 540px, rgba(0,0,0,0) 0%, rgba(0,0,0,${0.55 * (1 - all)}) 70%)`, pointerEvents: "none" }} />
    </Canvas>
  );
};

export type ScanBracketProps = { src?: string; label?: string; passes?: number; tone?: Tone };
/** scan-bracket：文档弹到中央，四角落下取景括号，扫描光带往复扫几趟（“正在读这份财报”），最后落一枚核实胶囊 */
export const ScanBracket: React.FC<ScanBracketProps> = ({ src, label = "VERIFIED · PRIMARY SOURCE", passes = 3, tone = "teal" }) => {
  const t = useMs();
  const th = useTheme();
  const doc = { x: 460, y: 140, w: 1000, h: 760 };
  const dp = seg(t, LEAD, 400, ease.outBack);
  const br = seg(t, LEAD + 350, 400, ease.outBack);
  const span = 2400;
  const raw = clamp((t - LEAD - 700) / span);
  const k = Math.min(passes - 1, Math.floor(raw * passes));
  const local = inOutSine(clamp(raw * passes - k));
  const y = k % 2 === 0 ? local : 1 - local;
  const on = raw > 0 && raw < 1 ? 1 : 0;
  const c = toneColor(th, "blue");
  return (
    <Canvas bg>
      <div style={{ position: "absolute", left: doc.x, top: doc.y, width: doc.w, height: doc.h, borderRadius: 12, overflow: "hidden", background: "#fff", boxShadow: th.shadow, opacity: clamp(dp * 3), transform: `scale(${lerp(0.86, 1, dp)})` }}>
        {src ? <Img src={src} style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "top" }} /> : [...Array(16)].map((_, i) => <div key={i} style={{ margin: "34px 60px 0", height: 14, width: `${60 + ((i * 37) % 35)}%`, background: "#E3E8F0", borderRadius: 7 }} />)}
        <div style={{ position: "absolute", left: 0, right: 0, top: `${y * 100}%`, height: 2, background: c, boxShadow: `0 0 18px ${c}`, opacity: on }} />
        <div style={{ position: "absolute", left: 0, right: 0, top: `calc(${y * 100}% ${k % 2 === 0 ? "- 90px" : "+ 2px"})`, height: 90, background: `linear-gradient(${k % 2 === 0 ? "to bottom" : "to top"}, rgba(0,0,0,0), ${c}22)`, opacity: on }} />
      </div>
      <Brackets x={doc.x - 24} y={doc.y - 24} w={doc.w + 48} h={doc.h + 48} p={br} color={th.ink} spread={60} />
      <div style={{ position: "absolute", left: 0, right: 0, top: doc.y + doc.h + 30, display: "flex", justifyContent: "center", ...enter(seg(t, LEAD + 700 + span, 400, ease.outBack)) }}>
        <div style={{ padding: "12px 30px", borderRadius: 999, background: toneTint(th, tone), color: toneColor(th, tone), fontSize: 30, fontWeight: 800, letterSpacing: "0.08em" }}>✓ {label}</div>
      </div>
    </Canvas>
  );
};

export type ScoreSlamProps = { value?: number; decimals?: number; prefix?: string; unit?: string; label?: string; tone?: Tone; plus?: boolean };
/** score-slam：关键数字透视急停砸进画面，冲击环扩散、画面震一下（重拳 KPI） */
export const ScoreSlam: React.FC<ScoreSlamProps> = ({ value = 115, decimals = 0, prefix = "$", unit = "B", label = "Implied enterprise value", tone = "teal", plus = false }) => {
  const t = useMs();
  const th = useTheme();
  const q = seg(t, LEAD, 220, ease.inCubic);
  const d = t - LEAD - 220;
  const shake = d > 0 ? Math.sin(d / 16) * 16 * Math.exp(-d / 110) : 0;
  const ring = clamp(d / 600);
  const c = toneColor(th, tone);
  return (
    <Canvas bg>
      <div style={{ position: "absolute", inset: 0, transform: `translate(${shake}px, ${shake * 0.5}px)` }}>
        {d > 0 && <div style={{ position: "absolute", left: 960 - 200 - ring * 500, top: 480 - 200 - ring * 500, width: 400 + ring * 1000, height: 400 + ring * 1000, borderRadius: "50%", border: `${6 * (1 - ring)}px solid ${c}`, opacity: 1 - ring }} />}
        <div style={{ position: "absolute", left: 0, right: 0, top: 320, textAlign: "center", fontSize: 260, fontWeight: 900, letterSpacing: "-0.04em", color: c, transform: `perspective(1200px) translateZ(${(1 - q) * 900}px) rotateX(${(1 - q) * 18}deg)`, opacity: clamp(q * 4) }}>
          {signed(value, decimals, prefix, unit, plus)}
        </div>
        <div style={{ position: "absolute", left: 0, right: 0, top: 640, textAlign: "center", ...enter(seg(t, LEAD + 450, 400)) }}><Label style={{ fontSize: 40 }}>{label}</Label></div>
      </div>
    </Canvas>
  );
};

export type FlylineProps = { nodes?: { id: string; x: number; y: number; label: string; tone?: Tone }[]; links?: { from: string; to: string; label?: string; tone?: Tone }[] };
/** flyline：节点之间画出弧形飞线，光点沿线流动（资金流、供货关系、投资关系） */
export const Flyline: React.FC<FlylineProps> = ({ nodes = [{ id: "n", x: 960, y: 240, label: "Nvidia", tone: "teal" }, { id: "l", x: 420, y: 720, label: "Lumentum" }, { id: "c", x: 960, y: 780, label: "Coherent" }, { id: "m", x: 1500, y: 720, label: "Marvell" }], links = [{ from: "n", to: "l", label: "$2B" }, { from: "n", to: "c", label: "$2B" }, { from: "n", to: "m", label: "$2B" }, { from: "m", to: "l", label: "deal", tone: "amber" }] }) => {
  const t = useMs();
  const th = useTheme();
  const N = Object.fromEntries(nodes.map((n) => [n.id, n]));
  return (
    <Canvas bg>
      <svg width={W} height={H} style={{ position: "absolute", inset: 0 }}>
        {links.map((l, i) => {
          const a = N[l.from], b = N[l.to];
          const mx = (a.x + b.x) / 2, my = Math.min(a.y, b.y) - 160 - (l.from === "m" ? -260 : 0);
          const d = `M${a.x} ${a.y} Q${mx} ${my} ${b.x} ${b.y}`;
          const p = seg(t, LEAD + 400 + i * 300, 700, ease.inOutCubic);
          const c = toneColor(th, l.tone ?? "blue");
          const u = ((t - LEAD) / 1400 + i * 0.27) % 1;
          const pt = (s: number) => [(1 - s) * (1 - s) * a.x + 2 * (1 - s) * s * mx + s * s * b.x, (1 - s) * (1 - s) * a.y + 2 * (1 - s) * s * my + s * s * b.y];
          const [px, py] = pt(u);
          const [lx, ly] = pt(0.5);
          return (
            <g key={i}>
              <path d={d} stroke={c} strokeWidth={4} fill="none" pathLength={1} strokeDasharray={1} strokeDashoffset={1 - p} opacity={0.8} />
              {p >= 1 && <circle cx={px} cy={py} r={9} fill={c} style={{ filter: `drop-shadow(0 0 10px ${c})` }} />}
              {l.label && <text x={lx} y={ly - 14} fill={c} fontSize={30} fontWeight={800} textAnchor="middle" opacity={p}>{l.label}</text>}
            </g>
          );
        })}
      </svg>
      {nodes.map((n, i) => (
        <div key={n.id} style={{ position: "absolute", left: n.x - 160, top: n.y - 50, width: 320, height: 100, borderRadius: 999, background: th.card, border: `2px solid ${toneColor(th, n.tone ?? "blue")}`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 38, fontWeight: 800, boxShadow: th.shadow, ...enter(seg(t, LEAD + i * 120, 400, ease.outBack)) }}>{n.label}</div>
      ))}
    </Canvas>
  );
};

// ───────────── 转场（独立预览时自带前后两幕；正片里把 from / to 换成两段画面的标题即可） ─────────────
const Scene: React.FC<{ title: string; kicker: string; tone: Tone }> = ({ title, kicker, tone }) => {
  const th = useTheme();
  return (
    <div style={{ position: "absolute", inset: 0, background: `${th.bgGlow}, ${th.bg}` }}>
      <div style={{ position: "absolute", left: 160, top: 400 }}>
        <Kicker color={toneColor(th, tone)}>{kicker}</Kicker>
        <div style={{ fontSize: 120, fontWeight: 800, marginTop: 10 }}>{title}</div>
      </div>
    </div>
  );
};
export type BlindsWipeProps = { from?: string; to?: string; slats?: number };
/** blinds-wipe：竖向百叶窗叶片错峰 3D 翻面成波，波扫过后 A 页换成 B 页 */
export const BlindsWipe: React.FC<BlindsWipeProps> = ({ from = "Why Lasers?", to = "The Scarcest Part", slats = 12 }) => {
  const t = useMs();
  const w = W / slats;
  return (
    <Canvas>
      {[...Array(slats)].map((_, i) => {
        const p = seg(t, LEAD + 300 + i * 70, 500, ease.inOutCubic);
        const rot = p * 180;
        const showB = rot > 90;
        return (
          <div key={i} style={{ position: "absolute", left: i * w, top: 0, width: w + 1, height: H, overflow: "hidden", perspective: 1600 }}>
            <div style={{ position: "absolute", inset: 0, transform: `rotateY(${showB ? rot - 180 : rot}deg)` }}>
              <div style={{ position: "absolute", left: -i * w, top: 0, width: W, height: H }}>{showB ? <Scene title={to} kicker="CHAPTER 03" tone="teal" /> : <Scene title={from} kicker="CHAPTER 02" tone="blue" />}</div>
            </div>
          </div>
        );
      })}
    </Canvas>
  );
};
export type WhipPanProps = { from?: string; to?: string };
/** whip-pan：A 画面急甩出画、拖出横向速度线，B 画面从另一侧甩入后急刹 */
export const WhipPan: React.FC<WhipPanProps> = ({ from = "The Dilution Math", to = "Why Lasers?" }) => {
  const t = useMs();
  const th = useTheme();
  const out = seg(t, LEAD + 400, 220, ease.inCubic);
  const inn = seg(t, LEAD + 620, 380, (p) => 1 - Math.pow(1 - p, 4));
  const blurA = out * 40, blurB = (1 - inn) * 40;
  const streak = Math.max(out, 1 - inn) * (t > LEAD + 400 ? 1 : 0) * (inn < 1 ? 1 : 0);
  return (
    <Canvas>
      {inn <= 0 && <div style={{ position: "absolute", inset: 0, transform: `translateX(${-out * W * 0.8}px)`, filter: `blur(${blurA}px)` }}><Scene title={from} kicker="CHAPTER 01" tone="blue" /></div>}
      {inn > 0 && <div style={{ position: "absolute", inset: 0, transform: `translateX(${(1 - inn) * W * 0.8}px)`, filter: `blur(${blurB}px)` }}><Scene title={to} kicker="CHAPTER 02" tone="teal" /></div>}
      {streak > 0 && [...Array(14)].map((_, i) => <div key={i} style={{ position: "absolute", left: 0, right: 0, top: 60 + i * 72, height: 3 + (i % 3) * 2, background: th.ink3, opacity: streak * 0.35 }} />)}
    </Canvas>
  );
};

// ───────────── 文字 ─────────────
export type MarkerUnderlineProps = { kicker?: string; before?: string; mark?: string; after?: string; tone?: Tone };
/** marker-underline：标题落定后，关键词下方一笔马克笔下划线从左到右快速画出（手写感强调） */
export const MarkerUnderline: React.FC<MarkerUnderlineProps> = ({ kicker = "THE REAL RISK", before = "Customers may become", mark = "rivals", after = "", tone = "amber" }) => {
  const t = useMs();
  const th = useTheme();
  const words = `${before} ${mark} ${after}`.trim().split(" ");
  const markIdx = before.split(" ").filter(Boolean).length;
  const draw = seg(t, LEAD + 120 + words.length * 70 + 600, 350, ease.outCubic);
  return (
    <Canvas bg>
      <div style={{ position: "absolute", left: 160, top: 360, fontSize: 30, fontWeight: 800, letterSpacing: "0.18em", color: th.blue, opacity: seg(t, LEAD, 300) }}>{kicker}</div>
      <div style={{ position: "absolute", left: 156, top: 430, fontSize: 100, fontWeight: 800, letterSpacing: "-0.02em", whiteSpace: "nowrap" }}>
        {words.map((w, i) => {
          const q = seg(t, LEAD + 120 + i * 70, 520, ease.outQuart);
          return (
            <span key={i} style={{ position: "relative", display: "inline-block", marginRight: "0.26em" }}>
              <span style={{ display: "inline-block", overflow: "hidden", verticalAlign: "top", paddingBottom: 14 }}><span style={{ display: "inline-block", transform: `translateY(${(1 - q) * 110}%)` }}>{w}</span></span>
              {i === markIdx && (
                <svg viewBox="0 0 100 20" preserveAspectRatio="none" style={{ position: "absolute", left: "-3%", bottom: -6, width: "106%", height: 34, overflow: "visible" }}>
                  <path d="M2 14 C 30 9, 60 8, 98 6" stroke={toneColor(th, tone)} strokeWidth={9} strokeLinecap="round" fill="none" pathLength={1} strokeDasharray={1} strokeDashoffset={1 - draw} opacity={0.85} />
                </svg>
              )}
            </span>
          );
        })}
      </div>
    </Canvas>
  );
};

export type OutlineFillProps = { word?: string; leftLabel?: string; rightLabel?: string; tone?: Tone };
/** outline-fill：空心大字从 3 倍急缩落位，虚线大圆收拢并慢转，两侧读数线内伸，描边预热后一帧硬切成实心 */
export const OutlineFill: React.FC<OutlineFillProps> = ({ word = "SCARCITY", leftLabel = "DEMAND FILLED · ~30%", rightLabel = "NEW CAPACITY · ~3 YRS", tone = "amber" }) => {
  const t = useMs();
  const th = useTheme();
  const c = toneColor(th, tone);
  const s = lerp(3.2, 1, seg(t, LEAD, 370, ease.outQuart));
  const ring = seg(t, LEAD + 260, 1450, ease.outCubic);
  const lines = seg(t, LEAD + 900, 600, ease.outCubic);
  const warm = seg(t, LEAD + 1450, 300);
  const fill = t > LEAD + 1770 ? 1 : 0;
  const spin = (t - LEAD) * 0.012 * (fill ? 0.2 : 1);
  return (
    <Canvas bg>
      <svg width={W} height={H} style={{ position: "absolute", inset: 0 }}>
        <g transform={`translate(960 520) rotate(${spin}) scale(${lerp(2.8, 1, ring)})`} opacity={clamp(ring * 3)}>
          <circle r={410} fill="none" stroke={th.ink3} strokeWidth={2} strokeDasharray="22 18" />
          {[...Array(72)].map((_, i) => { const a = (i / 72) * Math.PI * 2, l = i % 6 === 0 ? 22 : 10; return <line key={i} x1={Math.cos(a) * 372} y1={Math.sin(a) * 372} x2={Math.cos(a) * (372 - l)} y2={Math.sin(a) * (372 - l)} stroke={th.ink3} strokeWidth={2} />; })}
        </g>
        <line x1={0} x2={530 * lines} y1={340} y2={340} stroke={th.ink3} strokeWidth={2} strokeDasharray="14 12" />
        <line x1={W} x2={W - 530 * lines} y1={340} y2={340} stroke={th.ink3} strokeWidth={2} strokeDasharray="14 12" />
      </svg>
      <div style={{ position: "absolute", left: 60, top: 300, fontSize: 24, fontWeight: 800, letterSpacing: "0.12em", color: th.ink3, opacity: lines }}>{leftLabel}</div>
      <div style={{ position: "absolute", right: 60, top: 300, fontSize: 24, fontWeight: 800, letterSpacing: "0.12em", color: th.ink3, opacity: lines, textAlign: "right" }}>{rightLabel}</div>
      <div style={{ position: "absolute", left: 0, right: 0, top: 400, textAlign: "center", fontSize: 220, fontWeight: 500, letterSpacing: "0.02em", transform: `scale(${s})`, opacity: seg(t, LEAD, 200), color: fill ? c : "transparent", WebkitTextStroke: fill ? undefined : `2px ${warm > 0 ? c : th.ink3}`, textShadow: fill ? `0 0 40px ${c}66` : warm > 0 ? `0 0 ${20 * warm}px ${c}` : undefined, filter: s > 1.05 ? `blur(${(s - 1) * 3}px)` : undefined }}>
        {word}
      </div>
    </Canvas>
  );
};

export type TitleDemoteProps = { num?: string; title?: string; items?: { kicker: string; value: string; tone?: Tone }[] };
/** title-demote：章节大标题居中站稳一拍，再一条曲线缩成左上角小标签，内容卡在下面错峰长出 */
export const TitleDemote: React.FC<TitleDemoteProps> = ({ num = "03", title = "The Scarcest Part", items = [{ kicker: "200G EML", value: "Lasers" }, { kicker: "R300", value: "Optical switch" }, { kicker: "ELSFP", value: "CPO lasers", tone: "teal" }] }) => {
  const t = useMs();
  const th = useTheme();
  const rise = seg(t, LEAD, 600, ease.outQuart);
  const dem = seg(t, LEAD + 1300, 870, (p) => (p < 0.5 ? 4 * p * p * p : 1 - Math.pow(-2 * p + 2, 3) / 2));
  const x = lerp(960, 160, dem), y = lerp(500, 150, dem), sc = lerp(1, 0.3, dem);
  return (
    <Canvas bg>
      <div style={{ position: "absolute", left: x, top: y, transform: `translate(${-(1 - dem) * 50}%, -50%) scale(${sc})`, transformOrigin: "0 50%", whiteSpace: "nowrap" }}>
        <div style={{ fontSize: 34, fontWeight: 800, letterSpacing: "0.3em", color: th.blue, opacity: 1 - dem, textAlign: "center" }}>CHAPTER {num}</div>
        <div style={{ overflow: "hidden" }}><div style={{ fontSize: 170, fontWeight: 800, letterSpacing: "-0.02em", transform: `translateY(${(1 - rise) * 100}%)` }}>{dem > 0.6 ? `${num} / ${title}` : title}</div></div>
      </div>
      {items.map((it, i) => {
        const p = seg(t, LEAD + 1700 + i * 140, 600, ease.outCubic);
        return (
          <Card key={i} style={{ left: 160 + i * 560, top: 300, width: 500, height: 520, padding: 44, clipPath: `inset(0 ${(1 - lerp(0.3, 1, p)) * 100}% 0 0)`, opacity: p, transform: `translateY(${(1 - p) * 30}px)` }}>
            <Kicker color={toneColor(th, it.tone ?? "blue")}>{it.kicker}</Kicker>
            <div style={{ fontSize: 64, fontWeight: 800, marginTop: 30, lineHeight: 1.1 }}>{it.value}</div>
          </Card>
        );
      })}
    </Canvas>
  );
};

// ───────────── 入场 ─────────────
export type CardFanProps = { cards?: { kicker: string; title: string; tone?: Tone }[]; pick?: number };
/** card-fan：一组卡片从下方逐张弹入叠成一摞（越来越快），整摞展成扇面，最后抽出一张 */
export const CardFan: React.FC<CardFanProps> = ({ cards = [{ kicker: "01", title: "Terms" }, { kicker: "02", title: "Earnings" }, { kicker: "03", title: "Approvals", tone: "amber" }, { kicker: "04", title: "Customers" }, { kicker: "05", title: "Nvidia" }], pick = 2 }) => {
  const t = useMs();
  const th = useTheme();
  const n = cards.length;
  const fan = seg(t, LEAD + 300 + n * 180 + 300, 700, ease.outBack);
  const pull = seg(t, LEAD + 300 + n * 180 + 1200, 600, ease.outBack);
  return (
    <Canvas bg>
      {cards.map((c, i) => {
        const st = LEAD + 300 * Math.sqrt(i / n) * n * 0.6;
        const p = seg(t, st, 500, ease.outBack);
        const k = i - (n - 1) / 2;
        const isPick = i === pick;
        const rot = k * 7 * fan * (isPick ? 1 - pull : 1) + (1 - p) * (i % 2 ? 9 : -9);
        const tx = k * 190 * fan * (isPick ? 1 - pull : 1);
        const ty = (1 - p) * 820 - (isPick ? 200 * pull : 0);
        return (
          <Card key={i} style={{ left: 960 - 180 + tx, top: 300 + ty, width: 360, height: 480, padding: 36, transformOrigin: "50% 130%", transform: `rotate(${rot}deg) scale(${isPick ? 1 + 0.12 * pull : 1})`, zIndex: isPick && pull > 0 ? 99 : i, boxShadow: isPick && pull > 0 ? th.shadowHot(pull) : th.shadow }}>
            <Kicker color={toneColor(th, c.tone ?? "blue")}>{c.kicker}</Kicker>
            <div style={{ fontSize: 56, fontWeight: 800, marginTop: 24 }}>{c.title}</div>
          </Card>
        );
      })}
    </Canvas>
  );
};

export type TraceCircleProps = { kicker?: string; value?: string; sub?: string; tone?: Tone };
/** trace-circle：一支带笔头的墨线沿卡片轮廓跑一圈把它画出来，闭合一闪，内容上色淡入，重点数字下补一笔 */
export const TraceCircle: React.FC<TraceCircleProps> = ({ kicker = "MARVELL · LATEST QUARTER", value = "58.9%", sub = "Adjusted gross margin", tone = "teal" }) => {
  const t = useMs();
  const th = useTheme();
  const box = { x: 560, y: 260, w: 800, h: 480 };
  const draw = seg(t, LEAD + 300, 1300, ease.inOutCubic);
  const flash = seg(t, LEAD + 1600, 200) * (1 - seg(t, LEAD + 1800, 300));
  const content = seg(t, LEAD + 1800, 500);
  const under = seg(t, LEAD + 2300, 500, ease.outCubic);
  const c = toneColor(th, tone);
  return (
    <Canvas bg>
      <Card style={{ left: box.x, top: box.y, width: box.w, height: box.h, padding: 60, opacity: content, boxShadow: content > 0 ? th.shadow : "none" }}>
        <Kicker>{kicker}</Kicker>
        <div style={{ position: "relative", display: "inline-block", fontSize: 180, fontWeight: 800, color: c, marginTop: 20, letterSpacing: "-0.03em" }}>
          {value}
          <svg viewBox="0 0 100 20" preserveAspectRatio="none" style={{ position: "absolute", left: 0, bottom: -10, width: "100%", height: 30 }}>
            <path d="M2 12 Q 50 4 98 10" stroke={c} strokeWidth={8} fill="none" strokeLinecap="round" pathLength={1} strokeDasharray={1} strokeDashoffset={1 - under} />
          </svg>
        </div>
        <Label style={{ marginTop: 20 }}>{sub}</Label>
      </Card>
      <svg width={W} height={H} style={{ position: "absolute", inset: 0, opacity: 1 - seg(t, LEAD + 1900, 300) }}>
        <rect x={box.x} y={box.y} width={box.w} height={box.h} rx={th.radius} fill="none" stroke={th.ink} strokeWidth={4 + flash * 6} pathLength={1} strokeDasharray={1} strokeDashoffset={1 - draw} />
        <rect x={box.x} y={box.y} width={box.w} height={box.h} rx={th.radius} fill="none" stroke={th.ink} strokeWidth={9} pathLength={1} strokeDasharray="0.02 0.98" strokeDashoffset={0.02 - draw} opacity={draw < 1 ? 1 : 0} />
      </svg>
    </Canvas>
  );
};
