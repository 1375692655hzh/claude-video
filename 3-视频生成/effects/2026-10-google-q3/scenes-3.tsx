// 第 5 章 capex 与估值（81–106）、收尾（107–114）
import React from "react";
import { Sequence, interpolate, useCurrentFrame } from "remotion";
import {
  Bar,
  BottomShade,
  C,
  Check,
  Count,
  Fade,
  ImageBg,
  NameStrip,
  Panel,
  Source,
  Stage,
  Tag,
  TakeCard,
  Title,
  VideoBg,
  clamp,
  mix,
  useIn,
  useRamp,
} from "./ui";
import type { SceneProps } from "./scene-types";

// ---------- 第 5 章 ----------
const S81: React.FC<SceneProps> = ({ at }) => {
  const H = 6.5;
  const q4 = useIn(at(82) + 50, 16);
  const qs: [string, number, number][] = [
    ["Q1", 35.7, 20],
    ["Q2", 44.9, 35],
    ["Q3", 51.4, 50],
  ];
  return (
    <Stage>
      <Fade start={4}>
        <div style={{ border: `3px solid ${C.muted}`, borderRadius: 14, padding: "12px 34px", fontSize: 44, fontWeight: 800 }}>
          FY2026 capex guidance <span style={{ color: C.orange }}>$195–205B</span> <span style={{ color: C.muted, fontWeight: 600 }}>(unchanged)</span>
        </div>
      </Fade>
      <div style={{ display: "flex", alignItems: "flex-end", gap: 70, height: 560 }}>
        {qs.map(([q, v, s]) => (
          <Bar key={q} value={v} max={1 / H} height={1} width={190} t={q === "Q3" ? "orange" : "gray"} start={s} top={`$${v.toFixed(1)}B`} label={`${q} 2026`} />
        ))}
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 14, opacity: q4 }}>
          <div style={{ fontSize: 44, fontWeight: 800, color: C.orange }}>$63–73B</div>
          <div style={{ position: "relative", width: 190, height: 73 * H * q4 }}>
            <div style={{ position: "absolute", left: 0, right: 0, bottom: 0, height: 63 * H * q4, background: `${C.orange}55`, borderRadius: "10px 10px 0 0" }} />
            <div style={{ position: "absolute", left: 0, right: 0, top: 0, height: 10 * H * q4, background: `repeating-linear-gradient(45deg, ${C.orange}88 0 10px, transparent 10px 20px)`, border: `3px dashed ${C.orange}` }} />
          </div>
          <div style={{ fontSize: 30, color: C.muted }}>Q4 2026 (implied)</div>
        </div>
      </div>
      <Source start={6}>Alphabet 10-Q · Q3 2026 8-K · Earnings call</Source>
    </Stage>
  );
};

const S83: React.FC<SceneProps> = () => (
  <Stage>
    <Fade start={30}>
      <div style={{ fontSize: 130, fontWeight: 800, color: C.orange, textAlign: "center" }}>&ldquo;increase significantly&rdquo;</div>
    </Fade>
    <Fade start={60}>
      <div style={{ fontSize: 44, color: C.muted, fontWeight: 600 }}>2027 capex · Details on the Q4 call</div>
    </Fade>
    <NameStrip name="CFO Anat Ashkenazi" start={30} dur={60} />
  </Stage>
);

const S84: React.FC<SceneProps> = () => (
  <Stage>
    <Title size={52}>Capex estimates</Title>
    <div style={{ display: "flex", alignItems: "flex-end", gap: 100, height: 560 }}>
      <Bar value={200} max={310} height={440} width={220} t="gray" start={4} top="$195–205B" label="2026 guidance" />
      <Bar value={300} max={310} height={440} width={220} t="orange" start={20} top="~$300B" label={<>2027 est.<br />Bank of America</>} />
      <Bar value={250} max={310} height={440} width={220} t="orange" start={150} top="~$250B" label={<>2027 est.<br />Morgan Stanley (July)</>} />
    </div>
    <Source start={4}>Bank of America · Morgan Stanley</Source>
  </Stage>
);

const S85: React.FC<SceneProps> = ({ at }) => {
  const H = 1.5;
  const k1 = useIn(at(85) + 90, 18);
  const k2 = useIn(at(86) + 6, 18);
  const fill = useRamp(at(87) + 20, 40);
  return (
    <Stage>
      <div style={{ display: "flex", alignItems: "flex-end", gap: 140, height: 640 }}>
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 14 }}>
          <div style={{ position: "relative", width: 260, height: 300 * H }}>
            <div style={{ position: "absolute", left: 0, right: 0, bottom: 0, height: 180 * H * k1, background: C.cyan, borderRadius: "0 0 10px 10px" }}>
              <div style={{ position: "absolute", width: "100%", top: "40%", textAlign: "center", fontSize: 48, fontWeight: 800, color: C.bg }}>~$180B</div>
            </div>
            <div style={{ position: "absolute", left: 0, right: 0, bottom: 180 * H, height: 120 * H * fill, border: `4px dashed ${C.red}`, background: `${C.red}33`, borderRadius: "10px 10px 0 0" }} />
            <div style={{ position: "absolute", left: 290, bottom: 220, width: 460, opacity: fill, fontSize: 60, fontWeight: 800, color: C.red }}>+~70% needed</div>
          </div>
          <div style={{ fontSize: 30, color: C.muted, textAlign: "center" }}>Operating cash flow,<br />last 12 months</div>
        </div>
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 14, opacity: k2, marginLeft: 380 }}>
          <div style={{ width: 260, height: 300 * H * k2, background: C.orange, borderRadius: "10px 10px 0 0", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 48, fontWeight: 800, color: C.bg }}>~$300B</div>
          <div style={{ fontSize: 30, color: C.muted, textAlign: "center" }}>Capex 2027<br />(BofA est.)</div>
        </div>
      </div>
      <Source start={6}>Alphabet 8-K / 10-K · Bank of America</Source>
    </Stage>
  );
};

const Lock: React.FC<{ glow?: number }> = ({ glow = 0 }) => (
  <svg width={70} height={84} viewBox="0 0 70 84">
    <path d="M17 38 V24 a18 18 0 0 1 36 0 V38" fill="none" stroke={C.white} strokeWidth={8} />
    <rect x={6} y={36} width={58} height={44} rx={8} fill={C.white} style={{ filter: glow ? `drop-shadow(0 0 ${12 * glow}px ${C.orange})` : undefined }} />
  </svg>
);

const S88: React.FC<SceneProps> = ({ at }) => {
  const frame = useCurrentFrame();
  const lock = useIn(at(89), 14);
  const toScale = interpolate(frame, [at(90) - 10, at(90) + 15], [0, 1], clamp);
  const glow = interpolate(frame, [at(91) + 40, at(91) + 60], [0, 1], clamp);
  const wobble = frame > at(92) + 30 ? Math.sin((frame - at(92)) / 4) * 4 * Math.max(0, 1 - (frame - at(92) - 30) / 60) : 0;
  const tilt = -6 * toScale;
  return (
    <Stage>
      <div style={{ opacity: 1 - toScale, position: "absolute", display: "flex", flexDirection: "column", alignItems: "center", gap: 16 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 30 }}>
          <Count value={924} start={20} len={40} format={(v) => `$${Math.round(v)}B`} style={{ fontSize: 190, fontWeight: 800, color: C.orange }} />
          <div style={{ opacity: lock, transform: `scale(${mix(1.6, 1, lock)})` }}>
            <Lock />
          </div>
        </div>
        <div style={{ fontSize: 46, color: C.muted, fontWeight: 600 }}>future purchase commitments</div>
        <Tag t="white" start={at(89) + 10} size={44}>Fixed</Tag>
      </div>
      <div style={{ opacity: toScale, position: "relative", width: 1500, height: 560 }}>
        <div style={{ position: "absolute", left: 140, right: 140, top: 250, transform: `rotate(${tilt}deg)` }}>
          <div style={{ height: 14, background: C.muted, borderRadius: 7 }} />
          <div style={{ position: "absolute", left: -40, bottom: 14 }}>
            <Panel style={{ borderColor: C.orange, background: `${C.orange}33`, display: "flex", alignItems: "center", gap: 20, boxShadow: glow ? `0 0 ${50 * glow}px ${C.orange}` : undefined }}>
              <Lock glow={glow} />
              <div>
                <div style={{ fontSize: 66, fontWeight: 800, color: C.orange }}>$924B</div>
                <div style={{ fontSize: 30, color: C.white }}>purchase commitments</div>
              </div>
            </Panel>
          </div>
          <div style={{ position: "absolute", right: -40, bottom: 14, transform: `rotate(${wobble}deg)`, transformOrigin: "50% 100%" }}>
            <div style={{ border: `4px dashed ${C.cyan}`, borderRadius: 20, padding: "20px 34px", background: `${C.cyan}14` }}>
              <div style={{ fontSize: 66, fontWeight: 800, color: C.cyan }}>$561B</div>
              <div style={{ fontSize: 30 }}>customer backlog</div>
            </div>
          </div>
        </div>
        <div style={{ position: "absolute", left: 700, top: 264, width: 0, height: 0, borderLeft: "50px solid transparent", borderRight: "50px solid transparent", borderBottom: `110px solid ${C.gray}` }} />
        <div style={{ position: "absolute", right: 60, top: 400 }}>
          <Tag t="cyan" start={at(92) + 30} size={42}>depends on customers</Tag>
        </div>
      </div>
      <Source start={20}>Earnings call</Source>
    </Stage>
  );
};

const S93: React.FC<SceneProps> = () => (
  <Stage>
    <Fade start={4}>
      <div style={{ width: 1000, height: 525, borderRadius: 20, overflow: "hidden", position: "relative", boxShadow: "0 30px 80px rgba(0,0,0,0.5)" }}>
        <ImageBg file="n12-anthropic.jpg" dim={0} push={0.0002} />
      </div>
    </Fade>
    <div style={{ display: "flex", gap: 40 }}>
      <Tag t="cyan" start={60} size={44}>TPU customer</Tag>
      <Tag t="red" start={110} size={44}>Still burning cash</Tag>
    </div>
    <Source start={4}>Earnings call · Anthropic</Source>
  </Stage>
);

const Fork: React.FC<{ at: SceneProps["at"] }> = ({ at }) => {
  const a = useRamp(at(94) + 4, 30);
  const b = useRamp(at(95) + 4, 30);
  return (
    <svg width={1500} height={560} viewBox="0 0 1500 560">
      <line x1={80} y1={280} x2={500} y2={280} stroke={C.muted} strokeWidth={14} strokeLinecap="round" />
      <path d="M500 280 C 650 280, 700 110, 900 110" fill="none" stroke={C.cyan} strokeWidth={14} strokeLinecap="round" strokeDasharray={500} strokeDashoffset={500 * (1 - a)} />
      <path d="M500 280 C 650 280, 700 450, 900 450" fill="none" stroke={C.red} strokeWidth={14} strokeLinecap="round" strokeDasharray={500} strokeDashoffset={500 * (1 - b)} />
      <text x={80} y={240} fill={C.white} fontSize={40} fontWeight={700} fontFamily="Inter">AI customers</text>
      <text x={930} y={100} fill={C.cyan} fontSize={46} fontWeight={800} fontFamily="Inter" opacity={a}>Funding keeps flowing</text>
      <text x={930} y={155} fill={C.white} fontSize={38} fontWeight={600} fontFamily="Inter" opacity={a}>→ Google paid on time</text>
      <text x={930} y={440} fill={C.red} fontSize={46} fontWeight={800} fontFamily="Inter" opacity={b}>Funding dries up</text>
      <text x={930} y={495} fill={C.white} fontSize={38} fontWeight={600} fontFamily="Inter" opacity={b}>→ risk lands on Google</text>
    </svg>
  );
};
const S94: React.FC<SceneProps> = ({ at }) => (
  <Stage>
    <Fork at={at} />
  </Stage>
);

const S96: React.FC<SceneProps> = () => (
  <Stage>
    <Title size={84}>
      How the market values Google <span style={{ color: C.orange }}>is shifting</span>
    </Title>
  </Stage>
);

const S97: React.FC<SceneProps> = ({ at }) => {
  const frame = useCurrentFrame();
  const sw = interpolate(frame, [at(98) - 6, at(98) + 8], [0, 1], clamp);
  return (
    <>
      <div style={{ position: "absolute", inset: 0, opacity: 1 - sw }}>
        <ImageBg file="n9-googleplex.jpg" dim={0.3} />
        <div style={{ position: "absolute", right: 30, bottom: 150, fontSize: 18, color: "rgba(255,255,255,0.6)", fontFamily: "Inter" }}>Photo: Asoundd / Wikimedia Commons, CC BY-SA 4.0</div>
      </div>
      {sw > 0 ? (
        <div style={{ position: "absolute", inset: 0, opacity: sw }}>
          <Sequence from={at(98) - 6}>
            <VideoBg file="dc-google.mp4" from={93} dim={0.3} />
          </Sequence>
        </div>
      ) : null}
      <BottomShade />
      <div style={{ position: "absolute", left: 0, right: 0, top: 130, display: "flex", justifyContent: "center", fontFamily: "Inter" }}>
        {sw < 0.5 ? (
          <Fade start={30}>
            <Panel style={{ fontSize: 56, fontWeight: 800, borderColor: C.cyan }}>High margin · Cash-rich · Buybacks every year</Panel>
          </Fade>
        ) : (
          <Panel style={{ fontSize: 56, fontWeight: 800, borderColor: C.orange, transform: `translateX(${(1 - sw) * 200}px)` }}>Capital-heavy AI infrastructure</Panel>
        )}
      </div>
    </>
  );
};

const S99: React.FC<SceneProps> = () => {
  const m = useRamp(30, 30);
  const col = (label: string, mult: string, h: number, color: string) => (
    <div style={{ display: "flex", alignItems: "flex-end", gap: 30 }}>
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 12 }}>
        <div style={{ width: 150, height: 160, background: C.muted, borderRadius: "10px 10px 0 0" }} />
        <div style={{ fontSize: 28, color: C.muted }}>Same profit</div>
      </div>
      <div style={{ fontSize: 60, fontWeight: 800, color, marginBottom: 60, opacity: m }}>× {mult}</div>
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 12 }}>
        <div style={{ width: 150, height: h * m, background: color, borderRadius: "10px 10px 0 0" }} />
        <div style={{ fontSize: 28, color: C.muted }}>{label}</div>
      </div>
    </div>
  );
  return (
    <Stage>
      <div style={{ display: "flex", gap: 180, alignItems: "flex-end", height: 560 }}>
        {col("Platform value", "high multiple", 480, C.cyan)}
        {col("Infrastructure value", "lower multiple", 280, C.orange)}
      </div>
    </Stage>
  );
};

const S100: React.FC<SceneProps> = () => (
  <Stage>
    <div style={{ display: "flex", alignItems: "center", gap: 40, fontSize: 84, fontWeight: 800 }}>
      <Fade start={4}>
        <span style={{ color: C.cyan }}>$140B net cash</span>
      </Fade>
      <Fade start={40}>
        <span>→ can pay its bills</span>
      </Fade>
      <Check start={70} size={110} />
    </div>
  </Stage>
);

const S101: React.FC<SceneProps> = () => {
  const frame = useCurrentFrame();
  const d = interpolate(frame, [60, 100], [0, 1], clamp);
  return (
    <Stage>
      <div style={{ display: "flex", alignItems: "center", gap: 70 }}>
        <div style={{ fontSize: 120, fontWeight: 800 }}>$1 of profit</div>
        <div style={{ position: "relative", padding: "24px 50px", background: d > 0.5 ? C.red : C.cyan, color: C.bg, borderRadius: "14px 60px 60px 14px", fontSize: 80, fontWeight: 800, transform: `rotate(${mix(-4, 4, d)}deg)` }}>
          price paid {d > 0.5 ? "↓" : "↑"}
        </div>
      </div>
      <Fade start={60}>
        <div style={{ fontSize: 44, color: C.muted, fontWeight: 600 }}>What Wall Street is cutting</div>
      </Fade>
    </Stage>
  );
};

const Light: React.FC<{ on: number; color: string }> = ({ on, color }) => (
  <div style={{ width: 54, height: 54, borderRadius: 27, background: on > 0.5 ? color : C.gray, boxShadow: on > 0.5 ? `0 0 26px ${color}` : "none", flexShrink: 0 }} />
);

const S102: React.FC<SceneProps> = ({ at }) => {
  const up = useRamp(10, 40);
  const l1 = useRamp(at(103) + 20, 10);
  const l2 = useRamp(at(103) + 120, 10);
  const end1 = useIn(at(104), 16);
  const down = useRamp(at(105), 40);
  const e1 = useIn(at(105) + 70, 16);
  const e2 = useIn(at(105) + 170, 16);
  return (
    <Stage>
      <div style={{ position: "relative", width: 1600, height: 640 }}>
        <svg width={1600} height={640} viewBox="0 0 1600 640" style={{ position: "absolute" }}>
          <line x1={40} y1={320} x2={360} y2={320} stroke={C.muted} strokeWidth={16} strokeLinecap="round" />
          <path d="M360 320 C 480 320, 520 120, 700 120 L 1560 120" fill="none" stroke={C.cyan} strokeWidth={16} strokeLinecap="round" strokeDasharray={1400} strokeDashoffset={1400 * (1 - up)} />
          <path d="M360 320 C 480 320, 520 520, 700 520 L 1560 520" fill="none" stroke={C.red} strokeWidth={16} strokeLinecap="round" strokeDasharray={1400} strokeDashoffset={1400 * (1 - down)} />
        </svg>
        <div style={{ position: "absolute", left: 640, top: 150, display: "flex", flexDirection: "column", gap: 14 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 18, opacity: up, fontSize: 36, fontWeight: 700 }}>
            <Light on={l1} color={C.cyan} /> Search AI monetization catches up
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 18, opacity: up, fontSize: 36, fontWeight: 700 }}>
            <Light on={l2} color={C.cyan} /> TPUs ship → inventory → cash
          </div>
        </div>
        <div style={{ position: "absolute", left: 1000, top: 40, opacity: end1, whiteSpace: "nowrap", fontSize: 44, fontWeight: 800, color: C.cyan }}>Market pays for growth again</div>
        <div style={{ position: "absolute", left: 640, top: 545, display: "flex", gap: 30, alignItems: "center" }}>
          <div style={{ opacity: e1, whiteSpace: "nowrap", fontSize: 40, fontWeight: 800, color: C.red }}>Estimates cut</div>
          <div style={{ opacity: e2, whiteSpace: "nowrap", fontSize: 40, fontWeight: 800, color: C.red }}>→ Today&apos;s price may not be the floor</div>
        </div>
      </div>
    </Stage>
  );
};

const S106: React.FC<SceneProps> = () => (
  <TakeCard
    label="MY TAKE"
    line1={<span style={{ color: C.cyan }}>Real value at this price.</span>}
    line2={<span>Waiting for 2 signals first.</span>}
    at2={95}
    icon2={
      <div style={{ display: "flex", gap: 14 }}>
        <Light on={0} color={C.cyan} />
        <Light on={0} color={C.cyan} />
      </div>
    }
  />
);

// ---------- 收尾 ----------
const S107: React.FC<SceneProps> = ({ at }) => {
  const k = useRamp(20, 30);
  return (
    <Stage>
      <div style={{ display: "flex", gap: 160, alignItems: "center" }}>
        <div style={{ fontSize: 90, fontWeight: 800, color: C.red, transform: `translateY(${k * 60}px)` }}>Revenue ↓</div>
        <div style={{ fontSize: 90, fontWeight: 800, color: C.orange, transform: `translateY(${-k * 60}px)` }}>Spending ↑</div>
      </div>
      <div style={{ display: "flex", gap: 30, marginTop: 60 }}>
        <Tag t="red" start={at(108) + 4}>Each search earns less</Tag>
        <Tag t="red" start={at(108) + 50}>Cloud can&apos;t fill the gap</Tag>
        <Tag t="orange" start={at(108) + 95}>Spending speeds up</Tag>
      </div>
    </Stage>
  );
};

const Item: React.FC<{ n: string; children: React.ReactNode; start: number }> = ({ n, children, start }) => (
  <Fade start={start} x={-40} y={0}>
    <div style={{ display: "flex", alignItems: "center", gap: 30 }}>
      <div style={{ width: 84, height: 84, borderRadius: 42, background: C.cyan, color: C.bg, fontSize: 48, fontWeight: 800, display: "flex", alignItems: "center", justifyContent: "center" }}>{n}</div>
      <div style={{ fontSize: 60, fontWeight: 800 }}>{children}</div>
    </div>
  </Fade>
);
const S109: React.FC<SceneProps> = ({ at }) => (
  <>
    <VideoBg file="dc-google.mp4" from={60.5} dim={0.8} blur={3} />
    <Stage style={{ alignItems: "flex-start", paddingLeft: 260 }}>
      <Fade start={60}>
        <div style={{ fontSize: 72, fontWeight: 800, marginBottom: 20 }}>
          <span style={{ color: C.cyan }}>3 things</span> I&apos;m watching
        </div>
      </Fade>
      <Item n="1" start={at(110)}>2027 capex on the Q4 call</Item>
      <Item n="2" start={at(111)}>Search growth as AI Mode adds ads</Item>
      <Item n="3" start={at(112)}>TPU deliveries → inventory ↓</Item>
    </Stage>
  </>
);

const S113: React.FC<SceneProps> = () => (
  <Stage>
    <div style={{ display: "flex", gap: 60 }}>
      <Fade start={4} x={-40} y={0}>
        <div style={{ fontSize: 76, fontWeight: 800, padding: "34px 60px", borderRadius: 24, border: `4px solid ${C.cyan}`, color: C.cyan }}>A · Opportunity</div>
      </Fade>
      <Fade start={30} x={40} y={0}>
        <div style={{ fontSize: 76, fontWeight: 800, padding: "34px 60px", borderRadius: 24, border: `4px solid ${C.red}`, color: C.red }}>B · Trap</div>
      </Fade>
    </div>
    <Fade start={90}>
      <div style={{ fontSize: 50, fontWeight: 700, color: C.muted }}>Tell me in the comments ↓</div>
    </Fade>
  </Stage>
);

const S114: React.FC<SceneProps> = () => (
  <Stage>
    <Fade start={4}>
      <div style={{ fontSize: 96, fontWeight: 800 }}>
        Andy&apos;s <span style={{ color: C.cyan }}>Market Lens</span>
      </div>
    </Fade>
    <Fade start={20}>
      <div style={{ fontSize: 44, fontWeight: 600, color: C.muted, textAlign: "center", maxWidth: 1300 }}>
        This video is for information only and is not investment advice.
      </div>
    </Fade>
  </Stage>
);

export const SCENES_3: { shots: number[]; C: React.FC<SceneProps> }[] = [
  { shots: [81, 82], C: S81 },
  { shots: [83], C: S83 },
  { shots: [84], C: S84 },
  { shots: [85, 86, 87], C: S85 },
  { shots: [88, 89, 90, 91, 92], C: S88 },
  { shots: [93], C: S93 },
  { shots: [94, 95], C: S94 },
  { shots: [96], C: S96 },
  { shots: [97, 98], C: S97 },
  { shots: [99], C: S99 },
  { shots: [100], C: S100 },
  { shots: [101], C: S101 },
  { shots: [102, 103, 104, 105], C: S102 },
  { shots: [106], C: S106 },
  { shots: [107, 108], C: S107 },
  { shots: [109, 110, 111, 112], C: S109 },
  { shots: [113], C: S113 },
  { shots: [114], C: S114 },
];

