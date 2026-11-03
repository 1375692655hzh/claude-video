// 第 3 章云（38–59）、第 4 章现金流（60–80）
import React from "react";
import { interpolate, useCurrentFrame } from "remotion";
import {
  Bar,
  BottomShade,
  C,
  Count,
  Fade,
  ImageBg,
  MINUS,
  NameStrip,
  Panel,
  Source,
  Stage,
  Stamp,
  Tag,
  TakeCard,
  Title,
  VideoBg,
  clamp,
  money,
  mix,
  useIn,
  useRamp,
} from "./ui";
import { Gauge } from "./scenes-1";
import type { SceneProps } from "./scene-types";

// ---------- 第 3 章 ----------
const S38: React.FC<SceneProps> = ({ at }) => {
  const m = useRamp(at(39) + 60, 40);
  return (
    <Stage>
      <div style={{ display: "flex", alignItems: "center", gap: 120 }}>
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 20 }}>
          <div style={{ fontSize: 44, fontWeight: 700, color: C.muted }}>Google Cloud revenue</div>
          <div style={{ display: "flex", alignItems: "flex-end", gap: 70, height: 560 }}>
            <Bar value={15.2} max={32} height={440} width={190} t="gray" start={4} top="$15.2B" label="Q3 2025" />
            <Bar value={30.7} max={32} height={440} width={190} t="cyan" start={30} top={<Count value={30.7} start={30} format={money()} />} label="Q3 2026" />
          </div>
          <Tag t="cyan" start={70} size={52} solid>
            +103%
          </Tag>
        </div>
        <Fade start={at(39)} x={40} y={0}>
          <Panel style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 10, width: 680 }}>
            <div style={{ fontSize: 36, color: C.muted, fontWeight: 600 }}>Operating income</div>
            <div style={{ fontSize: 96, fontWeight: 800, color: C.cyan }}>$11.1B</div>
            <Gauge value={mix(0.237, 0.362, m)} label={`Margin ${mix(23.7, 36.2, m).toFixed(1)}%`} />
          </Panel>
        </Fade>
      </div>
      <Source start={4}>Alphabet Q3 2026 8-K</Source>
    </Stage>
  );
};

const GrowthDots: React.FC<{ start: number }> = ({ start }) => {
  const k = useIn(start, 18);
  const k2 = useIn(start + 20, 18);
  const W = 1100;
  const x = (v: number) => ((v - 85) / (110 - 85)) * W;
  return (
    <div style={{ position: "relative", width: W, height: 200, opacity: k }}>
      <div style={{ position: "absolute", left: 0, right: 0, top: 100, height: 6, background: C.gray }} />
      <div style={{ position: "absolute", left: x(93) - 20, top: 83, width: 40, height: 40, borderRadius: 20, background: C.gray, border: `4px solid ${C.muted}` }} />
      <div style={{ position: "absolute", left: x(93) - 160, width: 320, top: 20, textAlign: "center", fontSize: 36, fontWeight: 700, color: C.muted }}>BofA +93%</div>
      <div style={{ position: "absolute", left: x(103) - 25, top: 78, width: 50, height: 50, borderRadius: 25, background: C.cyan, transform: `scale(${k2})`, boxShadow: `0 0 24px ${C.cyan}` }} />
      <div style={{ position: "absolute", left: x(103) - 160, width: 320, top: 150, textAlign: "center", fontSize: 42, fontWeight: 800, color: C.cyan, opacity: k2 }}>Actual +103%</div>
    </div>
  );
};

const S40: React.FC<SceneProps> = ({ at }) => (
  <Stage>
    <div style={{ display: "flex", alignItems: "flex-end", gap: 80, height: 470, position: "relative" }}>
      <div style={{ position: "relative" }}>
        <Bar value={30.7} max={32} height={360} width={240} t="cyan" start={-30} top="$30.7B" label="Cloud, actual" />
      </div>
      <Bar value={29.1} max={32} height={360} width={240} t="gray" dashed start={4} top="~$29.1B" label="Consensus (low 90s%)" />
    </div>
    <GrowthDots start={at(41)} />
    <div style={{ position: "absolute", right: 200, top: 200 }}>
      <Stamp t="cyan" start={end41(at)}>
        BEAT
      </Stamp>
    </div>
    <Source start={at(41)}>Bank of America · Consensus est.</Source>
  </Stage>
);
const end41 = (at: SceneProps["at"]) => at(41) + 75;

const S42: React.FC<SceneProps> = () => (
  <Stage>
    <Panel style={{ padding: "50px 80px", display: "flex", alignItems: "center", gap: 40, borderColor: C.cyan }}>
      <div style={{ fontSize: 110, fontWeight: 300, color: C.cyan }}>±</div>
      <div style={{ fontSize: 100, fontWeight: 800 }}>Do the math</div>
    </Panel>
  </Stage>
);

const S43: React.FC<SceneProps> = ({ at }) => {
  const frame = useCurrentFrame();
  const l = useIn(at(43) + 30, 12);
  const r = useIn(at(44) + 35, 12);
  const tilt = interpolate(frame, [at(43) + 30, at(43) + 50], [0, -6], clamp) + interpolate(frame, [at(44) + 35, at(44) + 60], [0, 12], clamp);
  return (
    <Stage>
      <div style={{ position: "relative", width: 1400, height: 520 }}>
        <div style={{ position: "absolute", left: 100, right: 100, top: 300, transform: `rotate(${tilt}deg)`, transformOrigin: "50% 50%" }}>
          <div style={{ height: 14, background: C.muted, borderRadius: 7 }} />
          <div style={{ position: "absolute", left: 0, bottom: 14, opacity: l, transform: `translateY(${(1 - l) * -200}px)` }}>
            <Panel style={{ borderColor: C.cyan, padding: "18px 28px" }}>
              <div style={{ fontSize: 34, color: C.muted, fontWeight: 600 }}>Cloud vs est.</div>
              <div style={{ fontSize: 72, fontWeight: 800, color: C.cyan }}>+$1.6B</div>
            </Panel>
          </div>
          <div style={{ position: "absolute", right: 0, bottom: 14, opacity: r, transform: `translateY(${(1 - r) * -200}px)` }}>
            <Panel style={{ borderColor: C.red, padding: "18px 28px" }}>
              <div style={{ fontSize: 34, color: C.muted, fontWeight: 600 }}>Search + YouTube vs est.</div>
              <div style={{ fontSize: 72, fontWeight: 800, color: C.red }}>{MINUS}$1.8B</div>
            </Panel>
          </div>
        </div>
        <div style={{ position: "absolute", left: 650, top: 314, width: 0, height: 0, borderLeft: "50px solid transparent", borderRight: "50px solid transparent", borderBottom: `110px solid ${C.gray}` }} />
      </div>
      <div style={{ position: "absolute", bottom: 190 }}>
        <Tag t="red" start={at(45) + 20} size={50}>
          Total revenue: slight miss
        </Tag>
      </div>
      <Source start={6}>Alphabet Q3 2026 8-K · Consensus est.</Source>
    </Stage>
  );
};

const S46: React.FC<SceneProps> = () => {
  const a = useIn(60, 18);
  const b = useIn(160, 18);
  const big = 520;
  const small = big * Math.sqrt(30.7 / 74.5);
  return (
    <Stage>
      <Title size={52}>The problem is size</Title>
      <div style={{ display: "flex", alignItems: "flex-end", gap: 90 }}>
        <div style={{ width: big * a, height: big * a, background: `${C.orange}cc`, borderRadius: 12, display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column" }}>
          <div style={{ fontSize: 44, fontWeight: 700, opacity: a }}>Ads</div>
          <div style={{ fontSize: 90, fontWeight: 800, opacity: a }}>$74.5B</div>
        </div>
        <div style={{ width: small * b, height: small * b, background: `${C.cyan}cc`, borderRadius: 12, display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column", color: C.bg }}>
          <div style={{ fontSize: 36, fontWeight: 700, opacity: b }}>Cloud</div>
          <div style={{ fontSize: 66, fontWeight: 800, opacity: b }}>$30.7B</div>
        </div>
      </div>
    </Stage>
  );
};

const S47: React.FC<SceneProps> = () => {
  const frame = useCurrentFrame();
  const n = interpolate(frame, [70, 150], [0, 2.4], clamp);
  const blocks = [1, 1, 0.4];
  return (
    <Stage>
      <div style={{ display: "flex", alignItems: "flex-end", gap: 260 }}>
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 18 }}>
          <Fade start={10}>
            <div style={{ width: 200, height: 110, background: C.red, borderRadius: 10 }} />
          </Fade>
          <div style={{ fontSize: 58, fontWeight: 800, color: C.red }}>{MINUS}1 pt ads</div>
        </div>
        <div style={{ fontSize: 100, color: C.muted, marginBottom: 80 }}>=</div>
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 18 }}>
          <div style={{ display: "flex", flexDirection: "column-reverse", gap: 8 }}>
            {blocks.map((w, i) => {
              const fill = Math.max(0, Math.min(1, n - i));
              return <div key={i} style={{ width: 200 * w, height: 110, background: C.cyan, borderRadius: 10, opacity: fill > 0 ? 1 : 0, transform: `translateY(${(1 - Math.min(1, fill * 3)) * -80}px)` }} />;
            })}
          </div>
          <div style={{ fontSize: 58, fontWeight: 800, color: C.cyan }}>+{n.toFixed(1)} pts cloud</div>
        </div>
      </div>
    </Stage>
  );
};

const Dots: React.FC<{ start: number }> = ({ start }) => {
  const frame = useCurrentFrame();
  const lit = interpolate(frame, [start, start + 60], [0, 300], clamp);
  return (
    <div style={{ display: "grid", gridTemplateColumns: "repeat(25, 22px)", gap: 8 }}>
      {Array.from({ length: 300 }, (_, i) => (
        <div key={i} style={{ width: 22, height: 22, borderRadius: 11, background: i < lit ? C.cyan : C.gray, boxShadow: i < lit ? `0 0 8px ${C.cyan}` : "none" }} />
      ))}
    </div>
  );
};

const S48: React.FC<SceneProps> = ({ at }) => {
  const frame = useCurrentFrame();
  const o = interpolate(frame, [at(49) - 8, at(49) + 4], [0, 1], clamp);
  return (
    <>
      <ImageBg file="n6-kurian.jpg" dim={mix(0.15, 0.82, o)} pos="65% 30%" />
      <BottomShade />
      <NameStrip name="Thomas Kurian" role="CEO, Google Cloud" start={at(48) + 60} dur={110} />
      <Stage style={{ opacity: o }}>
        <div style={{ fontSize: 60, fontWeight: 800 }}>
          <span style={{ color: C.cyan }}>300+</span> customers × <span style={{ color: C.cyan }}>$100M+</span> each
        </div>
        <Dots start={at(49)} />
        <div style={{ fontSize: 30, color: C.muted }}>As of September 2026</div>
      </Stage>
      <Source start={at(49)}>Google Cloud, via Bank of America</Source>
      <div style={{ opacity: 1 - o }}><div style={{ position: "absolute", right: 30, bottom: 150, fontSize: 18, color: "rgba(255,255,255,0.6)", fontFamily: "Inter" }}>Photo: Eric Dietrich / DVIDS</div></div>
    </>
  );
};

const S50: React.FC<SceneProps> = ({ at }) => {
  const w = useRamp(10, 30);
  const half = useRamp(at(51) + 20, 30);
  const W = 1500;
  return (
    <Stage>
      <div style={{ fontSize: 44, color: C.muted, fontWeight: 700 }}>Cloud backlog</div>
      <Count value={561} start={6} len={30} format={(v) => `$${Math.round(v)}B`} style={{ fontSize: 170, fontWeight: 800 }} />
      <div style={{ position: "relative", width: W, height: 90, borderRadius: 12, overflow: "hidden", background: C.gray, transform: `scaleX(${w})`, transformOrigin: "left" }}>
        <div style={{ position: "absolute", left: 0, top: 0, bottom: 0, width: W * 0.55 * half, background: C.cyan, boxShadow: `0 0 30px ${C.cyan}` }} />
      </div>
      <Fade start={at(51) + 40}>
        <div style={{ fontSize: 46, fontWeight: 800, color: C.cyan }}>&gt;50% → revenue within 2 years</div>
      </Fade>
      <NameStrip name="CFO Anat Ashkenazi" start={at(51)} dur={60} />
      <Source start={at(51)}>Earnings call</Source>
    </Stage>
  );
};

const S52: React.FC<SceneProps> = ({ at }) => {
  const frame = useCurrentFrame();
  const shift = interpolate(frame, [at(53) - 6, at(53) + 10], [0, 1], clamp);
  return (
    <Stage>
      <div style={{ transform: `translateY(${-shift * 140}px) scale(${mix(1, 0.7, shift)})`, textAlign: "center" }}>
        <div style={{ fontSize: 200, fontWeight: 800, color: C.cyan }}>
          36.2%<span style={{ color: C.orange }}>*</span>
        </div>
        <Fade start={50}>
          <div style={{ fontSize: 42, color: C.orange, fontWeight: 600 }}>* excludes cost of building AI models</div>
        </Fade>
      </div>
      <div style={{ opacity: shift, display: "flex", flexDirection: "column", alignItems: "center", gap: 20, marginTop: -60 }}>
        <div style={{ fontSize: 36, color: C.muted, fontWeight: 600 }}>AI model costs at the corporate level</div>
        <div style={{ display: "flex", gap: 120, alignItems: "flex-start" }}>
          <Bar value={4.5} max={8} height={230} width={190} t="red" negative start={at(53) + 30} top={`${MINUS}$4.5B`} label="Q3 2025" />
          <Bar value={7.7} max={8} height={230} width={190} t="red" negative start={at(53) + 90} top={`${MINUS}$7.7B`} label="Q3 2026" />
        </div>
      </div>
      <Source start={at(53)}>Alphabet Q3 2026 8-K</Source>
    </Stage>
  );
};

const S54: React.FC<SceneProps> = () => (
  <>
    <VideoBg file="abc-dc.mp4" from={24} scale={1.45} dim={0.25} />
    <BottomShade />
    <div style={{ position: "absolute", left: 100, top: 130, fontFamily: "Inter" }}>
      <Tag t="orange" start={30} size={56} solid>
        Short on compute
      </Tag>
    </div>
  </>
);

const S55: React.FC<SceneProps> = ({ at }) => {
  const d = useRamp(20, 40);
  const g = useRamp(at(56), 30);
  return (
    <Stage>
      <div style={{ position: "relative", width: 1400, height: 200 }}>
        <div style={{ position: "absolute", left: 0, top: 90, height: 8, width: 1400 * d, background: C.muted, borderRadius: 4 }} />
        <div style={{ position: "absolute", left: 200, top: 0, opacity: d }}>
          <Tag t="orange" start={20}>Late Q3: renting 3rd-party compute</Tag>
        </div>
        <div style={{ position: "absolute", left: 980, top: 120 }}>
          <Tag t="orange" start={90} solid>
            Q4: more
          </Tag>
        </div>
      </div>
      <div style={{ opacity: g, display: "flex", alignItems: "center", gap: 40 }}>
        <div style={{ transform: "scale(0.7)" }}>
          <Gauge value={mix(0.62, 0.5, g)} label="Cloud margin" color={C.orange} />
        </div>
        <div style={{ fontSize: 56, fontWeight: 800, color: C.orange }}>Near-term margin pressure</div>
      </div>
      <Source start={6}>Earnings call</Source>
    </Stage>
  );
};

const S57: React.FC<SceneProps> = () => (
  <TakeCard
    label="MY TAKE"
    line1={<span style={{ color: C.cyan }}>Cloud is sprinting.</span>}
    line2={<span>It can&apos;t carry all of Google yet.</span>}
    at2={60}
  />
);

const Engine: React.FC<{ label: string; color: string; power: number; start: number }> = ({ label, color, power, start }) => {
  const frame = useCurrentFrame();
  const k = useIn(start, 18);
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 18, opacity: k }}>
      <div style={{ width: 300, height: 180, borderRadius: 30, border: `5px solid ${color}`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 44, fontWeight: 800, color }}>{label}</div>
      <div style={{ display: "flex", gap: 10 }}>
        {[0, 1, 2, 3, 4].map((i) => (
          <div key={i} style={{ width: 40, height: 16 + i * 10, background: i < power ? color : C.gray, opacity: i < power ? 0.6 + 0.4 * Math.abs(Math.sin(frame / 6 + i)) : 1, borderRadius: 4, alignSelf: "flex-end" }} />
        ))}
      </div>
    </div>
  );
};

const S58: React.FC<SceneProps> = () => (
  <Stage>
    <div style={{ display: "flex", alignItems: "center", gap: 80 }}>
      <Engine label="Search (old)" color={C.red} power={2} start={4} />
      <Fade start={80}>
        <div style={{ width: 260, height: 120, border: `4px dashed ${C.red}`, borderRadius: 14, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 44, fontWeight: 800, color: C.red }}>gap</div>
      </Fade>
      <Engine label="Cloud (new)" color={C.cyan} power={3} start={40} />
    </div>
  </Stage>
);

const S59: React.FC<SceneProps> = () => {
  const hl = useRamp(110, 15);
  const rows: [string, string, boolean][] = [
    ["Operating cash flow", "$42.3B", false],
    ["Capital expenditures", `${MINUS}$51.4B`, false],
    ["Free cash flow", `${MINUS}$9.1B`, true],
  ];
  return (
    <Stage>
      <Fade start={2} y={80}>
        <div style={{ width: 1100, background: "#eef2f8", color: "#122033", borderRadius: 10, padding: "40px 60px", boxShadow: "0 30px 80px rgba(0,0,0,0.5)" }}>
          <div style={{ fontSize: 44, fontWeight: 800, borderBottom: "3px solid #122033", paddingBottom: 14, marginBottom: 14 }}>Statement of Cash Flows</div>
          <div style={{ fontSize: 26, color: "#5a6b80", marginBottom: 20 }}>Alphabet, Q3 2026 (simplified)</div>
          {rows.map(([a, b, hot]) => (
            <div
              key={a}
              style={{
                display: "flex",
                justifyContent: "space-between",
                fontSize: 38,
                padding: "12px 16px",
                fontWeight: hot ? 800 : 500,
                borderTop: hot ? "2px solid #122033" : "1px solid #c8d2df",
                background: hot ? `rgba(255,90,78,${0.85 * hl})` : "transparent",
                color: hot && hl > 0.5 ? "#fff" : "#122033",
                borderRadius: 6,
              }}
            >
              <span>{a}</span>
              <span>{b}</span>
            </div>
          ))}
        </div>
      </Fade>
    </Stage>
  );
};

// ---------- 第 4 章 ----------
const S60: React.FC<SceneProps> = () => (
  <Stage>
    <Title size={52}>Capital expenditures</Title>
    <div style={{ display: "flex", alignItems: "flex-end", gap: 120, height: 560 }}>
      <Bar value={24.0} max={55} height={440} width={220} t="gray" start={4} top="$24.0B" label="Q3 2025" />
      <Bar value={51.4} max={55} height={440} width={220} t="orange" start={20} top={<Count value={51.4} start={20} format={money()} />} label="Q3 2026" />
      <div style={{ display: "flex", flexDirection: "column", gap: 30, marginBottom: 200 }}>
        <Tag t="orange" start={150} size={52} solid>
          2×
        </Tag>
        <Tag t="orange" start={200} size={40}>
          ≈40% of revenue
        </Tag>
      </div>
    </div>
    <Source start={4}>Alphabet 10-Q / Q3 2026 8-K</Source>
  </Stage>
);

const S61: React.FC<SceneProps> = () => (
  <Stage>
    <Title size={52}>Operating cash flow, Q3 2026</Title>
    <div style={{ display: "flex", alignItems: "flex-end", gap: 120, height: 560, position: "relative" }}>
      <Bar value={42.3} max={56} height={440} width={220} t="red" start={6} top={<Count value={42.3} start={6} format={money()} />} label="Actual" />
      <Bar value={53.9} max={56} height={440} width={220} t="gray" dashed start={60} top="~$53.9B" label="Consensus" />
      <div style={{ position: "absolute", right: -300, top: 130 }}>
        <Tag t="red" start={110} size={52}>
          {MINUS}$11B+
        </Tag>
      </div>
    </div>
    <Source start={6}>Alphabet Q3 2026 8-K · Consensus est.</Source>
  </Stage>
);

const S62: React.FC<SceneProps> = () => {
  const H = 6.5; // 每 $1B 的像素
  const zero = 420;
  const k1 = useIn(6, 18);
  const k2 = useIn(55, 18);
  const k3 = useIn(110, 18);
  const col = (left: number, top: number, h: number, color: string, k: number, label: string, val: string, below = false) => (
    <div style={{ position: "absolute", left, top: top, width: 230, height: h * k, background: color, borderRadius: 8, boxShadow: `0 0 24px ${color}55` }}>
      <div style={{ position: "absolute", width: 360, left: -65, textAlign: "center", [below ? "bottom" : "top"]: below ? -70 : -70, fontSize: 48, fontWeight: 800, color, opacity: k }}>{val}</div>
      <div style={{ position: "absolute", width: 360, left: -65, textAlign: "center", top: below ? h * k + 70 : h * k + 10, fontSize: 30, color: C.muted, opacity: k }}>{label}</div>
    </div>
  );
  return (
    <Stage>
      <div style={{ position: "relative", width: 1300, height: 640 }}>
        <div style={{ position: "absolute", left: 0, right: 0, top: zero, height: 6, background: C.white, borderRadius: 3 }} />
        {col(100, zero - 42.3 * H * k1, 42.3 * H * k1, C.cyan, 1, "Operating cash flow", "$42.3B")}
        {col(520, zero - 42.3 * H, 51.4 * H, C.red, k2, "Capex", `${MINUS}$51.4B`)}
        {col(940, zero, 9.1 * H, C.red, k3, "Free cash flow", `${MINUS}$9.1B`, true)}
      </div>
      <Source start={6}>Alphabet Q3 2026 8-K</Source>
    </Stage>
  );
};

const FcfBars: React.FC<{ at: SceneProps["at"]; oneOff?: number }> = ({ at, oneOff = 0 }) => {
  const H = 9;
  const zero = 300;
  const items: [string, number, number][] = [
    ["Q3 2025", 24.5, at(63) + 10],
    ["Q2 2026", -5.9, at(64) + 30],
    ["Q3 2026", -9.1, at(64) + 60],
  ];
  return (
    <div style={{ position: "relative", width: 1200, height: 520 }}>
      <div style={{ position: "absolute", left: 0, right: 0, top: zero, height: 6, background: C.white }} />
      {items.map(([label, v, start], i) => (
        <FcfBar key={label} x={120 + i * 360} v={v} H={H} zero={zero} start={start} label={label} oneOff={i === 2 ? oneOff : 0} />
      ))}
    </div>
  );
};
const FcfBar: React.FC<{ x: number; v: number; H: number; zero: number; start: number; label: string; oneOff: number }> = ({ x, v, H, zero, start, label, oneOff }) => {
  const k = useIn(start, 18);
  const color = v >= 0 ? C.cyan : C.red;
  const h = Math.abs(v) * H * (v < 0 ? 2.2 : 1) * k;
  return (
    <div style={{ position: "absolute", left: x, top: v >= 0 ? zero - h : zero + 6, width: 200, height: h, background: color, borderRadius: 8, opacity: Math.min(1, k * 2) }}>
      {oneOff > 0 ? (
        <div style={{ position: "absolute", left: 0, right: 0, top: 0, height: `${oneOff * 100}%`, background: `repeating-linear-gradient(45deg, ${C.orange}cc 0 12px, transparent 12px 24px)` }} />
      ) : null}
      <div style={{ position: "absolute", width: 300, left: -50, textAlign: "center", [v >= 0 ? "top" : "bottom"]: -66, fontSize: 46, fontWeight: 800, color }}>
        {v >= 0 ? "+" : MINUS}${Math.abs(v).toFixed(1)}B
      </div>
      <div style={{ position: "absolute", width: 300, left: -50, textAlign: "center", [v >= 0 ? "bottom" : "top"]: v >= 0 ? -50 : -50, fontSize: 28, color: C.muted }}>{label}</div>
    </div>
  );
};

const S63: React.FC<SceneProps> = ({ at }) => (
  <Stage>
    <Title size={52}>Free cash flow by quarter</Title>
    <FcfBars at={at} />
    <div style={{ position: "absolute", right: 150, top: 330 }}>
      <Tag t="red" start={at(64) + 110} size={44}>
        2 negative quarters in a row
      </Tag>
    </div>
    <Source start={6}>Alphabet Q3 2026 8-K</Source>
  </Stage>
);

const S65: React.FC<SceneProps> = () => {
  const s = useRamp(70, 30);
  return (
    <Stage>
      <div style={{ fontSize: 40, color: C.muted, fontWeight: 700 }}>Operating cash flow shortfall vs est.</div>
      <div style={{ display: "flex", gap: 30 * s + 6, alignItems: "center" }}>
        <div style={{ width: 560, height: 220, background: `${C.orange}cc`, borderRadius: "14px 0 0 14px", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 44, fontWeight: 800, transform: `translateX(${-s * 30}px)` }}>
          <span style={{ opacity: s }}>One-off</span>
        </div>
        <div style={{ width: 560, height: 220, background: `${C.red}cc`, borderRadius: "0 14px 14px 0", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 44, fontWeight: 800, transform: `translateX(${s * 30}px)` }}>
          <span style={{ opacity: s }}>TPU inventory</span>
        </div>
      </div>
      <div style={{ fontSize: 80, fontWeight: 800, color: C.red }}>{MINUS}$11B+</div>
    </Stage>
  );
};

const S66: React.FC<SceneProps> = () => (
  <>
    <ImageBg file="n14-berlaymont.jpg" dim={0.4} />
    <BottomShade />
    <div style={{ position: "absolute", left: 100, top: 150, fontFamily: "Inter" }}>
      <Fade start={40}>
        <Panel style={{ borderColor: C.orange }}>
          <div style={{ fontSize: 34, color: C.orange, fontWeight: 700 }}>One-off</div>
          <div style={{ fontSize: 64, fontWeight: 800 }}>2018 EU fine</div>
          <div style={{ fontSize: 96, fontWeight: 800, color: C.orange }}>$5.2B</div>
        </Panel>
      </Fade>
    </div>
    <NameStrip name="CFO Anat Ashkenazi" start={40} dur={60} />
    <div style={{ position: "absolute", right: 30, bottom: 150, fontSize: 18, color: "rgba(255,255,255,0.6)", fontFamily: "Inter" }}>Photo: acediscovery / Wikimedia Commons, CC BY 4.0</div>
  </>
);

const S67: React.FC<SceneProps> = () => (
  <>
    <VideoBg file="tpu-rack2.mp4" from={1.6} scale={1.22} originY="35%" dim={0.25} />
    <BottomShade />
    <div style={{ position: "absolute", left: 0, right: 0, top: 130, display: "flex", justifyContent: "center", gap: 20, alignItems: "center", fontFamily: "Inter" }}>
      <Tag t="white" start={70} size={44}>Build</Tag>
      <Fade start={85}><span style={{ fontSize: 50, color: C.muted }}>→</span></Fade>
      <Tag t="white" start={95} size={44}>Deliver</Tag>
      <Fade start={110}><span style={{ fontSize: 50, color: C.muted }}>→</span></Fade>
      <Tag t="cyan" start={120} size={44} solid>Get paid</Tag>
    </div>
  </>
);

const S68: React.FC<SceneProps> = ({ at }) => (
  <Stage>
    <Title size={52}>Inventory</Title>
    <div style={{ display: "flex", alignItems: "flex-end", gap: 140, height: 520 }}>
      <Bar value={2.4} max={14} height={420} width={220} t="gray" start={30} top="$2.4B" label="End of 2025" />
      <Bar value={13.3} max={14} height={420} width={220} t="orange" start={110} top={<Count value={13.3} start={110} format={money()} />} label="Q3 2026" />
    </div>
    <div style={{ position: "absolute", right: 120, top: 200, width: 520 }}>
      <Fade start={at(69)}>
        <Panel style={{ borderColor: C.cyan }}>
          <div style={{ fontSize: 40, fontWeight: 700 }}>
            CFO: all of that inventory is tied to <span style={{ color: C.cyan }}>signed contracts</span>
          </div>
        </Panel>
      </Fade>
    </div>
    <NameStrip name="CFO Anat Ashkenazi" start={at(69)} dur={60} />
    <Source start={30}>Alphabet 10-K / Q3 2026 8-K</Source>
  </Stage>
);

const S70: React.FC<SceneProps> = ({ at }) => {
  const d = useRamp(at(71) + 10, 40);
  return (
    <Stage>
      <div style={{ fontSize: 40, color: C.muted, fontWeight: 700 }}>Free cash flow, Q3 2026</div>
      <div style={{ display: "flex", alignItems: "center", gap: 60 }}>
        <div style={{ position: "relative", width: 240, height: 330, background: C.red, borderRadius: 10 }}>
          <div style={{ position: "absolute", left: 0, right: 0, bottom: 0, height: "55%", background: `repeating-linear-gradient(45deg, ${C.orange}dd 0 14px, transparent 14px 28px)`, opacity: useRamp(10, 20) }} />
          <div style={{ position: "absolute", top: -70, width: "100%", textAlign: "center", fontSize: 48, fontWeight: 800, color: C.red }}>{MINUS}$9.1B</div>
        </div>
        <Fade start={20}>
          <div style={{ fontSize: 44, fontWeight: 700, color: C.orange }}>worse than normal this quarter</div>
        </Fade>
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 20, opacity: d }}>
        <svg width={900} height={80} viewBox="0 0 900 80">
          <line x1={10} y1={40} x2={10 + 840 * d} y2={40} stroke={C.red} strokeWidth={10} strokeLinecap="round" />
          <path d={`M${830 * d + 10} 15 L${860 * d + 20} 40 L${830 * d + 10} 65`} fill="none" stroke={C.red} strokeWidth={10} />
        </svg>
        <div style={{ fontSize: 56, fontWeight: 800, color: C.red }}>Spending &gt; earning</div>
      </div>
    </Stage>
  );
};

const S72: React.FC<SceneProps> = ({ at }) => {
  const H = 9;
  const a = useIn(at(72) + 90, 18);
  const b = useIn(at(73) + 25, 18);
  const c = useRamp(at(74) + 20, 30);
  return (
    <Stage>
      <Title size={52}>How the gap got filled, Q3 2026</Title>
      <div style={{ display: "flex", alignItems: "flex-end", gap: 120 }}>
        <div style={{ display: "flex", flexDirection: "column-reverse", alignItems: "center" }}>
          <div style={{ width: 380, height: 12.4 * H * a * 1.6, background: C.orange, borderRadius: "0 0 10px 10px", display: "flex", alignItems: "center", justifyContent: "center", textAlign: "center", fontSize: 32, fontWeight: 800, color: C.bg }}>
            {a > 0.5 ? "New shares (ATM) $12.4B" : ""}
          </div>
          <div style={{ width: 380, height: 28.7 * H * b * 1.6, background: C.muted, borderRadius: "10px 10px 0 0", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 36, fontWeight: 800, color: C.bg }}>
            {b > 0.5 ? "Debt $28.7B" : ""}
          </div>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 70, alignItems: "flex-start", marginBottom: 40 }}>
          <Stamp t="gray" start={at(73) + 75}>
            Buybacks $0
          </Stamp>
          <div style={{ opacity: c }}>
            <div style={{ fontSize: 32, color: C.muted, fontWeight: 600, marginBottom: 10 }}>ATM capacity left</div>
            <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
              <div style={{ width: 27.6 * 16 * c, height: 60, borderRadius: 10, border: `4px dashed ${C.orange}`, background: `${C.orange}22` }} />
              <div style={{ fontSize: 52, fontWeight: 800, color: C.orange }}>$27.6B</div>
            </div>
          </div>
        </div>
      </div>
      <Source start={6}>Alphabet Q3 2026 8-K</Source>
    </Stage>
  );
};

const S75: React.FC<SceneProps> = ({ at }) => {
  const H = 1.6;
  const k = useIn(at(75) + 70, 18);
  const sub = useRamp(at(76) + 20, 30);
  const net = useIn(at(76) + 60, 16);
  return (
    <Stage>
      <div style={{ display: "flex", alignItems: "flex-end", gap: 100, height: 560 }}>
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 14 }}>
          <div style={{ fontSize: 48, fontWeight: 800, color: C.white, opacity: k }}>$265B</div>
          <div style={{ position: "relative", width: 240, height: 265 * H * k, background: `linear-gradient(180deg, ${C.cyan}88, ${C.cyan}44)`, borderRadius: 10, overflow: "hidden" }}>
            <div style={{ position: "absolute", left: 0, right: 0, top: 0, height: 125.1 * H * sub, background: `repeating-linear-gradient(45deg, ${C.red}cc 0 12px, ${C.red}55 12px 24px)` }} />
          </div>
          <div style={{ fontSize: 30, color: C.muted, textAlign: "center" }}>Cash & marketable securities</div>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 40, marginBottom: 120 }}>
          <div style={{ opacity: sub, fontSize: 46, fontWeight: 800, color: C.red }}>{MINUS} Long-term debt $125.1B</div>
          <div style={{ opacity: net, transform: `scale(${mix(0.7, 1, net)})`, transformOrigin: "left" }}>
            <div style={{ fontSize: 40, fontWeight: 700, color: C.muted }}>Net cash</div>
            <div style={{ fontSize: 130, fontWeight: 800, color: C.cyan }}>~$140B</div>
          </div>
        </div>
      </div>
      <Source start={6}>Alphabet Q3 2026 8-K</Source>
    </Stage>
  );
};

// 期末流通股（十亿股，A+B+C），见 data.md
const SHARES: [string, number][] = [
  ["2019", 13.76],
  ["2020", 13.5],
  ["2021", 13.24],
  ["2022", 12.85],
  ["2023", 12.46],
  ["2024", 12.21],
  ["Sep '25", 12.077],
  ["Dec '25", 12.088],
  ["Mar '26", 12.116],
  ["Jun '26", 12.23],
];
const S77: React.FC<SceneProps> = ({ at }) => {
  const d = useRamp(at(77) + 20, 70);
  const r = useRamp(at(78) + 10, 40);
  const W = 1500;
  const Hh = 440;
  const x = (i: number) => 60 + (i / (SHARES.length - 1)) * (W - 120);
  const y = (v: number) => 40 + ((13.9 - v) / (13.9 - 11.9)) * (Hh - 80);
  const turn = 6;
  const down = SHARES.slice(0, turn + 1).map(([, v], i) => `${i ? "L" : "M"}${x(i)} ${y(v)}`).join(" ");
  const up = SHARES.slice(turn).map(([, v], i) => `${i ? "L" : "M"}${x(i + turn)} ${y(v)}`).join(" ");
  return (
    <Stage>
      <Title size={52}>Alphabet shares outstanding (billions)</Title>
      <svg width={W} height={Hh + 60} viewBox={`0 0 ${W} ${Hh + 60}`}>
        <path d={down} fill="none" stroke={C.cyan} strokeWidth={8} strokeDasharray={3000} strokeDashoffset={3000 * (1 - d)} strokeLinejoin="round" />
        <path d={up} fill="none" stroke={C.red} strokeWidth={10} strokeDasharray={800} strokeDashoffset={800 * (1 - r)} strokeLinejoin="round" />
        {SHARES.map(([l, v], i) => (
          <g key={l} opacity={i <= turn ? Math.min(1, d * (SHARES.length - 1) / Math.max(i, 0.5)) : r}>
            <circle cx={x(i)} cy={y(v)} r={9} fill={i > turn ? C.red : C.cyan} />
            <text x={x(i)} y={Hh + 50} textAnchor="middle" fill={C.muted} fontSize={26} fontFamily="Inter">{l}</text>
            {i === 0 || i === turn || i === SHARES.length - 1 ? (
              <text x={x(i)} y={y(v) - 24} textAnchor="middle" fill={i > turn ? C.red : C.white} fontSize={34} fontWeight={800} fontFamily="Inter">{v.toFixed(2)}</text>
            ) : null}
          </g>
        ))}
      </svg>
      <div style={{ position: "absolute", left: 640, top: 330 }}>
        <Tag t="cyan" start={at(77) + 90}>Buybacks</Tag>
      </div>
      <div style={{ position: "absolute", right: 160, top: 470 }}>
        <Tag t="red" start={at(78) + 40}>Debt + new shares</Tag>
      </div>
      <Source start={6}>Alphabet 10-K / 10-Q</Source>
    </Stage>
  );
};

const S79: React.FC<SceneProps> = () => (
  <TakeCard
    label="MY READ"
    line1={<span style={{ color: C.orange }}>Some of it is one-off.</span>}
    line2={<span style={{ color: C.red }}>Spending &gt; earning will continue.</span>}
    at2={75}
  />
);

const S80: React.FC<SceneProps> = () => (
  <Stage>
    <div style={{ display: "flex", gap: 80, alignItems: "center" }}>
      <Fade start={4} x={-40} y={0}>
        <Panel style={{ borderColor: C.cyan, textAlign: "center", width: 640 }}>
          <div style={{ fontSize: 100, fontWeight: 800, color: C.cyan }}>$140B</div>
          <div style={{ fontSize: 40, fontWeight: 700 }}>net cash</div>
        </Panel>
      </Fade>
      <Fade start={100} x={40} y={0}>
        <Panel style={{ borderColor: C.red, textAlign: "center", width: 640 }}>
          <div style={{ fontSize: 100, fontWeight: 800, color: C.red }}>Valuation ↓</div>
          <div style={{ fontSize: 60, fontWeight: 800 }}>?</div>
        </Panel>
      </Fade>
    </div>
  </Stage>
);

export const SCENES_2: { shots: number[]; C: React.FC<SceneProps> }[] = [
  { shots: [38, 39], C: S38 },
  { shots: [40, 41], C: S40 },
  { shots: [42], C: S42 },
  { shots: [43, 44, 45], C: S43 },
  { shots: [46], C: S46 },
  { shots: [47], C: S47 },
  { shots: [48, 49], C: S48 },
  { shots: [50, 51], C: S50 },
  { shots: [52, 53], C: S52 },
  { shots: [54], C: S54 },
  { shots: [55, 56], C: S55 },
  { shots: [57], C: S57 },
  { shots: [58], C: S58 },
  { shots: [59], C: S59 },
  { shots: [60], C: S60 },
  { shots: [61], C: S61 },
  { shots: [62], C: S62 },
  { shots: [63, 64], C: S63 },
  { shots: [65], C: S65 },
  { shots: [66], C: S66 },
  { shots: [67], C: S67 },
  { shots: [68, 69], C: S68 },
  { shots: [70, 71], C: S70 },
  { shots: [72, 73, 74], C: S72 },
  { shots: [75, 76], C: S75 },
  { shots: [77, 78], C: S77 },
  { shots: [79], C: S79 },
  { shots: [80], C: S80 },
];

