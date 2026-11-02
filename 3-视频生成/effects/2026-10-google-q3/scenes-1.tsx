// 开头（1–6）、第 1 章 SpaceX（7–18）、第 2 章搜索（19–37）
import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import {
  Bar,
  BottomShade,
  C,
  Check,
  Count,
  Cross,
  Fade,
  HBar,
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
  pct,
  useIn,
  useRamp,
} from "./ui";
import type { SceneProps } from "./scene-types";

// ---------- 开头 ----------
const S01: React.FC<SceneProps> = () => {
  const draw = useRamp(20, 60);
  const pts = [0, 8, 5, 12, 10, 16, 14, 60, 72, 66, 80];
  const path = pts.map((y, i) => `${i === 0 ? "M" : "L"}${i * 50} ${40 + y * 2.6}`).join(" ");
  return (
    <Stage>
      <div style={{ display: "flex", gap: 60, alignItems: "stretch" }}>
        <Panel style={{ width: 780, textAlign: "center", borderColor: C.cyan }}>
          <div style={{ fontSize: 40, fontWeight: 700, color: C.muted, letterSpacing: 2 }}>GOOGLE CLOUD</div>
          <Count value={103} len={40} format={pct(0, true)} style={{ fontSize: 170, fontWeight: 800, color: C.cyan }} />
          <div style={{ fontSize: 30, color: C.muted }}>revenue, year over year</div>
        </Panel>
        <Panel style={{ width: 780, textAlign: "center", borderColor: C.red }}>
          <div style={{ fontSize: 40, fontWeight: 700, color: C.muted, letterSpacing: 2 }}>GOOGL AFTER HOURS</div>
          <div style={{ fontSize: 170, fontWeight: 800, color: C.red }}>{MINUS}10%+</div>
          <svg width={520} height={260} viewBox="0 0 520 260" style={{ marginTop: -10 }}>
            <path d={path} fill="none" stroke={C.red} strokeWidth={8} strokeLinecap="round" strokeDasharray={1200} strokeDashoffset={1200 * (1 - draw)} />
          </svg>
        </Panel>
      </div>
    </Stage>
  );
};

const S02: React.FC<SceneProps> = () => {
  const k = useRamp(6, 30);
  return (
    <>
      <ImageBg file="n2-ai-overviews.jpg" dim={0.9} blur={6} />
      <Stage>
        <div style={{ display: "flex", flexDirection: "column", gap: 70, width: 1400 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 30, transform: `translateY(${-k * 30}px) rotate(${-k * 3}deg)` }}>
            <div style={{ fontSize: 90, color: C.cyan }}>↑</div>
            <div style={{ fontSize: 64, fontWeight: 800 }}>
              Search query growth: <span style={{ color: C.cyan }}>5-year high</span>
            </div>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 30, transform: `translateY(${k * 30}px) rotate(${k * 3}deg)`, opacity: k }}>
            <div style={{ fontSize: 90, color: C.red }}>↓</div>
            <div style={{ fontSize: 64, fontWeight: 800 }}>
              Search revenue: <span style={{ color: C.red }}>below estimates</span>
            </div>
          </div>
        </div>
      </Stage>
      <Source>Alphabet Q3 2026 8-K · Consensus est.</Source>
    </>
  );
};

const S03: React.FC<SceneProps> = ({ at }) => {
  const frame = useCurrentFrame();
  const land = at(3) + 75; // −$9.1B 落地（impact 音效同一帧）
  const shake = frame >= land && frame < land + 8 ? Math.sin(frame * 3) * (8 - (frame - land)) : 0;
  return (
    <Stage style={{ transform: `translate(${shake}px, ${shake * 0.6}px)` }}>
      <div style={{ display: "flex", alignItems: "flex-end", gap: 160, height: 640 }}>
        <Bar value={51.4} max={55} height={480} width={240} t="orange" start={4} top={<Count value={51.4} len={36} start={4} format={money()} />} label="Capex, Q3 2026" />
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 20, alignSelf: "center" }}>
          <Fade start={land - 6} y={-60}>
            <div style={{ fontSize: 40, fontWeight: 700, color: C.muted, textAlign: "center" }}>Free cash flow</div>
            <div style={{ fontSize: 160, fontWeight: 800, color: C.red, textShadow: `0 0 40px ${C.red}66` }}>{MINUS}$9.1B</div>
          </Fade>
        </div>
      </div>
    </Stage>
  );
};

const S04: React.FC<SceneProps> = () => (
  <Stage>
    <div style={{ display: "flex", gap: 120, alignItems: "center" }}>
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 20 }}>
        <Fade start={2}>
          <div style={{ fontSize: 120, color: C.muted, position: "relative" }}>
            ⟲
            <div style={{ position: "absolute", left: -10, right: -10, top: "52%", height: 8, background: C.red, transform: "rotate(-20deg)" }} />
          </div>
        </Fade>
        <Stamp t="gray" start={4}>
          Buybacks $0
        </Stamp>
      </div>
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 20 }}>
        <Fade start={40}>
          <div style={{ fontSize: 120, color: C.orange }}>＋</div>
        </Fade>
        <Stamp t="orange" start={40} rotate={5}>
          New shares +$12.4B
        </Stamp>
      </div>
    </div>
  </Stage>
);

const Tri: React.FC<{ file: string; tag: string; start: number; from?: number; hi?: boolean }> = ({ file, tag, start, from = 0, hi }) => {
  const k = useIn(start, 18);
  return (
    <div style={{ position: "relative", width: 540, height: 600, borderRadius: 18, overflow: "hidden", opacity: mix(0.15, 1, k), border: `3px solid ${hi ? C.cyan : C.line}` }}>
      {/\.(jpg|png)$/.test(file) ? <ImageBg file={file} dim={0.15} /> : <VideoBg file={file} from={from} dim={0.15} />}
      <div style={{ position: "absolute", left: 20, top: 20 }}>
        <Tag t={hi ? "cyan" : "white"} solid={hi} start={start}>
          {tag}
        </Tag>
      </div>
    </div>
  );
};
const S05: React.FC<SceneProps> = () => (
  <Stage>
    <div style={{ display: "flex", gap: 40 }}>
      <Tri file="n10-msft-fairwater.mp4" from={6} tag="MSFT" start={0} />
      <Tri file="n11-amzn-rainier.jpg" tag="AMZN" start={50} />
      <Tri file="dc-google.mp4" from={60.5} tag="GOOGL" start={100} hi />
    </div>
    <Fade start={30}>
      <div style={{ fontSize: 48, fontWeight: 800, letterSpacing: 6, color: C.orange }}>AI CAPEX</div>
    </Fade>
  </Stage>
);

const S06: React.FC<SceneProps> = () => {
  const frame = useCurrentFrame();
  const q = interpolate(frame, [30, 38, 46], [0, 1, 0.55], clamp);
  return (
    <Stage>
      <div style={{ display: "flex", gap: 60, alignItems: "center" }}>
        <Fade start={2} x={-60} y={0}>
          <Panel style={{ fontSize: 64, fontWeight: 800, padding: "50px 60px", borderColor: C.orange, color: C.orange }}>One-time hit?</Panel>
        </Fade>
        <div style={{ fontSize: 160, fontWeight: 900, color: C.white, opacity: q }}>?</div>
        <Fade start={20} x={60} y={0}>
          <Panel style={{ fontSize: 64, fontWeight: 800, padding: "50px 60px", borderColor: C.red, color: C.red }}>Core business in trouble?</Panel>
        </Fade>
      </div>
    </Stage>
  );
};

// ---------- 第 1 章 ----------
const S07: React.FC<SceneProps> = ({ at }) => {
  const b = useRamp(at(8) + 50, 20);
  return (
    <Stage>
      <Title size={56}>Earnings per share, Q3 2026</Title>
      <div style={{ display: "flex", alignItems: "flex-end", gap: 160, height: 600, position: "relative" }}>
        <Bar value={2.12} max={3.2} height={480} width={220} t="red" start={at(7) + 60} top={<Count value={2.12} start={at(7) + 60} len={30} format={(v) => `$${v.toFixed(2)}`} />} label="Actual" />
        <Bar value={3.0} max={3.2} height={480} width={220} t="gray" dashed start={at(8)} top="~$3.00" label="Consensus" />
        <div style={{ position: "absolute", right: -230, top: 60, opacity: b, fontSize: 80, fontWeight: 800, color: C.red }}>{MINUS}30%</div>
      </div>
      <Source start={at(8)}>Alphabet Q3 2026 8-K · Consensus est.</Source>
    </Stage>
  );
};

const S09: React.FC<SceneProps> = ({ at }) => (
  <>
    <VideoBg file="rocket.mp4" from={7} dim={0.45} />
    <BottomShade />
    <Stage>
      <Fade start={4} end={at(10) - 6}>
        <div style={{ fontSize: 84, fontWeight: 800, textAlign: "center", textShadow: "0 4px 20px rgba(0,0,0,0.8)" }}>
          Biggest drag <span style={{ color: C.orange }}>≠</span> core business
        </div>
      </Fade>
    </Stage>
    <div style={{ position: "absolute", right: 100, top: 160 }}>
      <Fade start={at(10) + 30}>
        <Panel style={{ fontSize: 44, fontWeight: 700, borderColor: C.orange, maxWidth: 760 }}>
          SpaceX stake fell in value <span style={{ color: C.orange }}>→ paper loss</span>
        </Panel>
      </Fade>
    </div>
    <NameStrip name="Anat Ashkenazi" role="CFO, Alphabet" start={at(10)} dur={120} />
    <Source start={at(10)}>Earnings call</Source>
  </>
);

const S11: React.FC<SceneProps> = () => {
  const stick = useIn(15, 12);
  return (
    <Stage>
      <div style={{ display: "flex", alignItems: "center", gap: 100 }}>
        <div style={{ position: "relative", width: 420, height: 400, borderRadius: 30, background: "#13294a", border: `6px solid ${C.muted}` }}>
          <div style={{ position: "absolute", left: 150, top: 140, width: 120, height: 120, borderRadius: 60, border: `10px solid ${C.muted}` }} />
          <div style={{ position: "absolute", left: 40, bottom: 30, right: 40, height: 40, borderRadius: 8, background: `${C.cyan}44`, border: `2px solid ${C.cyan}` }} />
          <div
            style={{
              position: "absolute",
              left: 60,
              top: 30,
              padding: "10px 24px",
              background: "#fff6d6",
              color: "#5a4300",
              fontSize: 40,
              fontWeight: 800,
              transform: `rotate(-8deg) translateY(${(1 - stick) * -200}px)`,
              opacity: stick,
              boxShadow: "0 6px 16px rgba(0,0,0,0.4)",
            }}
          >
            paper loss
          </div>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 24 }}>
          <Check start={45} size={110} />
          <Fade start={45}>
            <div style={{ fontSize: 80, fontWeight: 800, color: C.cyan }}>No cash out</div>
          </Fade>
        </div>
      </div>
    </Stage>
  );
};

const S12: React.FC<SceneProps> = () => (
  <Stage>
    <Fade start={2}>
      <div style={{ fontSize: 44, fontWeight: 700, color: C.muted, textAlign: "center" }}>Operating income, Q3 2026</div>
    </Fade>
    <Count value={40.6} start={60} len={36} format={money()} style={{ fontSize: 190, fontWeight: 800 }} />
    <Tag t="red" start={110} size={48}>
      {MINUS}6% vs consensus
    </Tag>
    <Source start={60}>Alphabet Q3 2026 8-K · Consensus est.</Source>
  </Stage>
);

const S13: React.FC<SceneProps> = () => {
  const d = useRamp(10, 30);
  const x1 = 200;
  const x2 = 1000;
  const y = (v: number) => 380 - (v - 30) * 70;
  return (
    <Stage>
      <Title size={56}>Operating margin</Title>
      <svg width={1200} height={480} viewBox="0 0 1200 480">
        <line x1={x1} y1={y(34)} x2={mix(x1, x2, d)} y2={mix(y(34), y(31.8), d)} stroke={C.red} strokeWidth={10} strokeLinecap="round" />
        <circle cx={x1} cy={y(34)} r={18} fill={C.white} />
        <circle cx={x2} cy={y(31.8)} r={18} fill={C.red} opacity={d} />
        <text x={x1} y={y(34) - 50} fill={C.white} fontSize={56} fontWeight={800} textAnchor="middle" fontFamily="Inter">Q2 34.0%</text>
        <text x={x2} y={y(31.8) + 90} fill={C.red} fontSize={56} fontWeight={800} textAnchor="middle" fontFamily="Inter" opacity={d}>Q3 31.8%</text>
      </svg>
      <Tag t="red" start={50} size={48}>
        {MINUS}2 pts
      </Tag>
    </Stage>
  );
};

const S14: React.FC<SceneProps> = () => (
  <AbsoluteFill>
    <div style={{ position: "absolute", right: 0, top: 0, bottom: 0, width: 900, overflow: "hidden" }}>
      <VideoBg file="tpu-rack.mp4" from={13.2} rate={0.45} scale={1.22} originY="35%" dim={0.15} />
      <AbsoluteFill style={{ background: `linear-gradient(90deg, ${C.bg} 0%, transparent 30%)` }} />
    </div>
    <Stage style={{ alignItems: "flex-start", paddingLeft: 140 }}>
      <div style={{ display: "flex", alignItems: "flex-end", gap: 60 }}>
        <Bar value={36} max={40} height={420} width={200} t="orange" start={50} top={<Count value={36} start={50} format={pct(0, true)} />} label="R&D spending" />
        <div style={{ display: "flex", flexDirection: "column", gap: 24, marginBottom: 60 }}>
          <Tag t="white" start={90}>AI talent</Tag>
          <Tag t="white" start={110}>Depreciation</Tag>
        </div>
      </div>
    </Stage>
  </AbsoluteFill>
);

const S15: React.FC<SceneProps> = () => (
  <>
    <VideoBg file="ironwood.mp4" from={35.8} dim={0.2} />
    <BottomShade />
    <div style={{ position: "absolute", left: 0, right: 0, bottom: 190, display: "flex", justifyContent: "center", fontFamily: "Inter" }}>
      <Fade start={20}>
        <Panel style={{ fontSize: 46, fontWeight: 700 }}>
          TPU hardware sold to customers → <span style={{ color: C.red }}>cost of revenue ↑</span>
        </Panel>
      </Fade>
    </div>
  </>
);

const S16: React.FC<SceneProps> = ({ at }) => (
  <TakeCard
    label="MY TAKE"
    line1={<span>EPS drop → <span style={{ color: C.cyan }}>forgivable</span></span>}
    icon1={<Check start={50} size={90} />}
    line2={<span>Core profit miss → <span style={{ color: C.red }}>not so easy</span></span>}
    at2={at(17)}
    icon2={<Cross start={at(17) + 30} size={90} />}
  />
);

const S18: React.FC<SceneProps> = () => <ImageBg file="G1-2.png" dim={0.1} push={0.0008} />;

// ---------- 第 2 章 ----------
const GrowthScale: React.FC<{ lo: number; hi: number; est: { v: number; label: string }; act: { v: number; label: string; t: "red" | "cyan" }; start: number }> = ({
  lo,
  hi,
  est,
  act,
  start,
}) => {
  const k = useIn(start, 18);
  const k2 = useIn(start + 25, 18);
  const W = 1300;
  const x = (v: number) => ((v - lo) / (hi - lo)) * W;
  const actCol = act.t === "red" ? C.red : C.cyan;
  return (
    <div style={{ position: "relative", width: W, height: 220, opacity: k }}>
      <div style={{ position: "absolute", left: 0, right: 0, top: 110, height: 6, background: C.gray, borderRadius: 3 }} />
      {[lo, (lo + hi) / 2, hi].map((v) => (
        <div key={v} style={{ position: "absolute", left: x(v) - 40, width: 80, top: 135, textAlign: "center", fontSize: 26, color: C.muted }}>
          {v}%
        </div>
      ))}
      <div style={{ position: "absolute", left: x(est.v) - 22, top: 91, width: 44, height: 44, borderRadius: 22, background: C.gray, border: `4px solid ${C.muted}` }} />
      <div style={{ position: "absolute", left: x(est.v) - 200, width: 400, top: 20, textAlign: "center", fontSize: 38, fontWeight: 700, color: C.muted }}>{est.label}</div>
      <div style={{ position: "absolute", left: x(act.v) - 26, top: 87, width: 52, height: 52, borderRadius: 26, background: actCol, opacity: k2, transform: `scale(${k2})`, boxShadow: `0 0 24px ${actCol}` }} />
      <div style={{ position: "absolute", left: x(act.v) - 200, width: 400, top: 175, textAlign: "center", fontSize: 44, fontWeight: 800, color: actCol, opacity: k2 }}>{act.label}</div>
    </div>
  );
};

const S19: React.FC<SceneProps> = ({ at }) => {
  const shrink = useRamp(at(20) - 10, 20);
  return (
    <Stage>
      <div style={{ transform: `scale(${mix(1, 0.72, shrink)}) translateY(${mix(0, -120, shrink)}px)`, display: "flex", flexDirection: "column", alignItems: "center", gap: 20 }}>
        <Title size={52}>Search revenue, Q3 2026</Title>
        <div style={{ display: "flex", alignItems: "flex-end", gap: 120, height: 520 }}>
          <Bar value={63.4} max={66} height={420} width={220} t="red" start={6} top={<Count value={63.4} start={6} format={money()} />} label="Actual (+12%)" />
          <Bar value={65} max={66} height={420} width={220} t="gray" dashed start={at(19) + 110} top="~$65B" label="Consensus" />
        </div>
      </div>
      <div style={{ position: "absolute", bottom: 180, opacity: shrink }}>
        <GrowthScale lo={10} hi={16} est={{ v: 14, label: "BofA forecast +14%" }} act={{ v: 12, label: "Actual +12%", t: "red" }} start={at(20)} />
      </div>
      <Source start={at(20)}>Bank of America · Consensus est.</Source>
    </Stage>
  );
};

const S21: React.FC<SceneProps> = () => (
  <>
    <VideoBg file="youtube-ads.mp4" from={22.5} dim={0.85} blur={4} />
    <Stage>
      <div style={{ fontSize: 48, fontWeight: 700, color: C.muted }}>YouTube ads, Q3 2026</div>
      <div style={{ display: "flex", alignItems: "baseline", gap: 40 }}>
        <Count value={11.2} start={6} format={money()} style={{ fontSize: 170, fontWeight: 800 }} />
        <span style={{ fontSize: 70, fontWeight: 800, color: C.muted }}>+9.2%</span>
      </div>
      <Stamp start={95}>MISSED</Stamp>
    </Stage>
  </>
);

const S22: React.FC<SceneProps> = () => {
  const k = useRamp(8, 40);
  const share = 0.58 * k;
  const r = 200;
  const circ = 2 * Math.PI * r;
  return (
    <Stage>
      <div style={{ display: "flex", alignItems: "center", gap: 100 }}>
        <svg width={520} height={520} viewBox="0 0 520 520">
          <circle cx={260} cy={260} r={r} fill="none" stroke={C.gray} strokeWidth={70} />
          <circle cx={260} cy={260} r={r} fill="none" stroke={C.cyan} strokeWidth={70} strokeDasharray={`${circ * share} ${circ}`} transform="rotate(-90 260 260)" />
          <text x={260} y={290} textAnchor="middle" fill={C.white} fontSize={110} fontWeight={800} fontFamily="Inter">{Math.round(share * 100)}%</text>
        </svg>
        <div style={{ display: "flex", flexDirection: "column", gap: 30 }}>
          <Fade start={10}>
            <div style={{ fontSize: 40, color: C.muted, fontWeight: 600 }}>Search + YouTube ads</div>
            <div style={{ fontSize: 110, fontWeight: 800, color: C.cyan }}>$74.5B</div>
          </Fade>
          <Fade start={40}>
            <div style={{ fontSize: 40, color: C.muted, fontWeight: 600 }}>of Alphabet revenue</div>
            <div style={{ fontSize: 80, fontWeight: 800 }}>$127.6B</div>
          </Fade>
        </div>
      </div>
      <Source start={10}>Alphabet Q3 2026 8-K</Source>
    </Stage>
  );
};

const S23: React.FC<SceneProps> = () => (
  <>
    <div style={{ position: "absolute", left: 0, top: 0, width: 1060, height: 1080 }}>
      <ImageBg file="n5-pichai.jpg" dim={0.1} pos="50% 20%" />
      <AbsoluteFill style={{ background: "linear-gradient(90deg, transparent 60%, #06101f 100%)" }} />
    </div>
    <BottomShade />
    <div style={{ position: "absolute", right: 90, top: 150 }}>
      <Fade start={60}>
        <Panel style={{ maxWidth: 700, borderColor: C.cyan }}>
          <div style={{ fontSize: 30, color: C.muted, fontWeight: 600, fontFamily: "Inter" }}>Search query growth</div>
          <div style={{ fontSize: 60, color: C.cyan, fontWeight: 800, fontFamily: "Inter" }}>Highest in 5 years</div>
        </Panel>
      </Fade>
    </div>
    <NameStrip name="Sundar Pichai" role="CEO, Alphabet" start={40} dur={120} />
    <Source start={40}>Earnings call</Source>
    <div style={{ position: "absolute", right: 30, bottom: 150, fontSize: 18, color: "rgba(255,255,255,0.6)", fontFamily: "Inter" }}>Photo: Lukasz Kobus / European Commission, CC BY 4.0</div>
  </>
);

const S24: React.FC<SceneProps> = () => (
  <>
    <VideoBg file="gemini-app.mp4" from={3.2} dim={0.3} />
    <div style={{ position: "absolute", right: 120, top: 0, bottom: 0, display: "flex", alignItems: "center", fontFamily: "Inter" }}>
      <Fade start={15} x={40} y={0}>
        <Panel style={{ textAlign: "center", borderColor: C.cyan }}>
          <div style={{ fontSize: 34, color: C.muted, fontWeight: 600 }}>Gemini app</div>
          <div style={{ fontSize: 150, color: C.cyan, fontWeight: 800, lineHeight: 1 }}>1B</div>
          <div style={{ fontSize: 40, fontWeight: 700 }}>users</div>
        </Panel>
      </Fade>
    </div>
  </>
);

const S25: React.FC<SceneProps> = ({ at }) => (
  <Stage>
    <Fade start={2}>
      <div style={{ fontSize: 96, fontWeight: 800 }}>
        Queries <span style={{ color: C.cyan }}>↑</span>
        <span style={{ display: "inline-block", width: 90 }} />
        Revenue <span style={{ color: C.red }}>↓</span>
      </div>
    </Fade>
    <Tag t="white" start={at(25) + 55} size={48}>
      3 reasons from the call
    </Tag>
  </Stage>
);

const Reason: React.FC<{ n: string; children: React.ReactNode; color: string; start: number; sub?: React.ReactNode }> = ({ n, children, color, start, sub }) => (
  <Fade start={start} x={-40} y={0}>
    <div style={{ display: "flex", alignItems: "center", gap: 30 }}>
      <div style={{ width: 90, height: 90, borderRadius: 45, border: `4px solid ${color}`, color, fontSize: 52, fontWeight: 800, display: "flex", alignItems: "center", justifyContent: "center" }}>{n}</div>
      <div>
        <div style={{ fontSize: 64, fontWeight: 800, color }}>{children}</div>
        {sub ? <div style={{ fontSize: 34, color: C.muted, fontWeight: 600 }}>{sub}</div> : null}
      </div>
    </div>
  </Fade>
);

const S26: React.FC<SceneProps> = () => (
  <Stage style={{ alignItems: "flex-start", paddingLeft: 320 }}>
    <Reason n="1" color={C.muted} start={2}>
      Currency
    </Reason>
    <Reason n="2" color={C.muted} start={40} sub="~3 pts of drag">
      Tough comparison
    </Reason>
  </Stage>
);

const S27: React.FC<SceneProps> = () => (
  <>
    <VideoBg file="ai-mode.mp4" from={1.5} rate={0.8} dim={0.78} blur={3} />
    <Stage>
      <Reason n="3" color={C.orange} start={2} sub="the chat-style AI inside search">
        AI Mode
      </Reason>
      <div style={{ display: "flex", gap: 40 }}>
        <Tag t="cyan" start={80}>Usage ↑ fast</Tag>
        <Tag t="red" start={115}>Earns less per search</Tag>
      </div>
    </Stage>
  </>
);

const S28: React.FC<SceneProps> = () => {
  const k = useIn(4, 14);
  return (
    <Stage>
      <div style={{ transform: `scale(${mix(0.8, 1.25, k)})` }}>
        <Reason n="3" color={C.orange} start={0}>
          AI Mode
        </Reason>
      </div>
      <Source start={40}>Pew Research Center, July 2025</Source>
    </Stage>
  );
};

const S29: React.FC<SceneProps> = ({ at }) => (
  <>
    <ImageBg file="n2-ai-overviews.jpg" dim={0.92} blur={4} />
    <Stage>
      <Title size={52}>Visits where users clicked a regular search result</Title>
      <div style={{ display: "flex", flexDirection: "column", gap: 50, width: 1400 }}>
        <HBar value={8} max={16} width={1100} t="red" start={at(29) + 70} label="With an AI summary" right="8%" />
        <HBar value={15} max={16} width={1100} t="gray" start={at(30) + 10} label="Without" right="15%" />
      </div>
    </Stage>
    <Source start={6}>Pew Research Center, July 2025</Source>
  </>
);

const S31: React.FC<SceneProps> = () => {
  const d = useRamp(30, 25);
  return (
    <Stage>
      <div style={{ display: "flex", alignItems: "center", gap: 40 }}>
        <Tag t="red" start={4} size={56}>Fewer clicks</Tag>
        <svg width={300} height={60} viewBox="0 0 300 60">
          <line x1={10} y1={30} x2={10 + 260 * d} y2={30} stroke={C.muted} strokeWidth={6} strokeDasharray="16 12" />
          <path d="M270 12 L292 30 L270 48" fill="none" stroke={C.muted} strokeWidth={6} opacity={d} />
        </svg>
        <Tag t="red" start={55} size={56}>Fewer ad chances</Tag>
      </div>
    </Stage>
  );
};

const S32: React.FC<SceneProps> = () => {
  const strike = useRamp(70, 14);
  return (
    <TakeCard
      label="MY READ"
      line1={
        <span>
          AI isn&apos;t making people{" "}
          <span style={{ position: "relative", color: C.muted }}>
            use Google less
            <span style={{ position: "absolute", left: 0, top: "52%", height: 8, width: `${strike * 100}%`, background: C.red }} />
          </span>
        </span>
      }
      line2={
        <span>
          It&apos;s making <span style={{ color: C.red }}>each search earn less</span>
        </span>
      }
      at2={95}
    />
  );
};

const S33: React.FC<SceneProps> = () => (
  <Stage>
    <div style={{ display: "flex", gap: 60 }}>
      <Fade start={2} x={-40} y={0}>
        <Panel style={{ width: 760, minHeight: 300, borderColor: C.gray }}>
          <div style={{ fontSize: 40, color: C.muted, fontWeight: 700 }}>Will pass</div>
          <div style={{ fontSize: 60, fontWeight: 800, color: C.muted, marginTop: 20 }}>Currency, tough comps</div>
        </Panel>
      </Fade>
      <Fade start={80} x={40} y={0}>
        <Panel style={{ width: 760, minHeight: 300, borderColor: C.orange }}>
          <div style={{ fontSize: 40, color: C.orange, fontWeight: 700 }}>Won&apos;t fix itself</div>
          <div style={{ fontSize: 60, fontWeight: 800, color: C.orange, marginTop: 20 }}>AI Mode monetization</div>
        </Panel>
      </Fade>
    </div>
  </Stage>
);

const S34: React.FC<SceneProps> = ({ at }) => {
  const frame = useCurrentFrame();
  const press = interpolate(frame, [70, 78], [0, 1], clamp);
  const t2 = at(35);
  const boxes = [0, 1, 2, 3, 4, 5];
  return (
    <Stage>
      <div style={{ display: "flex", alignItems: "center", gap: 50, opacity: interpolate(frame, [t2 - 10, t2], [1, 0.25], clamp) }}>
        <div style={{ fontSize: 72, fontWeight: 800 }}>
          Andy&apos;s <span style={{ color: C.cyan }}>Market Lens</span>
        </div>
        <div
          style={{
            fontSize: 44,
            fontWeight: 800,
            padding: "20px 44px",
            borderRadius: 999,
            background: press > 0.5 ? C.gray : C.red,
            color: C.white,
            transform: `scale(${1 - Math.sin(press * Math.PI) * 0.1})`,
          }}
        >
          {press > 0.5 ? "Subscribed ✓" : "Subscribe"}
        </div>
      </div>
      <Fade start={t2}>
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 24 }}>
          <div style={{ fontSize: 48, fontWeight: 800 }}>Earnings season tracker</div>
          <div style={{ display: "flex", gap: 20 }}>
            {boxes.map((i) => (
              <div key={i} style={{ width: 130, height: 110, borderRadius: 14, border: `2px solid ${C.line}`, background: C.panel, display: "flex", alignItems: "center", justifyContent: "center" }}>
                <Check start={t2 + 10 + i * 8} size={60} />
              </div>
            ))}
          </div>
        </div>
      </Fade>
    </Stage>
  );
};

const Gauge: React.FC<{ value: number; label: string; color?: string }> = ({ value, label, color = C.cyan }) => {
  // 表盘：圆心 (320, 270)，半径 210，从 −120° 到 +120°（0° 朝上）
  const R = 210;
  const pt = (deg: number, r = R) => [320 + Math.sin((deg * Math.PI) / 180) * r, 270 - Math.cos((deg * Math.PI) / 180) * r];
  const [x0, y0] = pt(-120);
  const [x1, y1] = pt(120);
  const arc = `M${x0} ${y0} A${R} ${R} 0 1 1 ${x1} ${y1}`;
  const len = (240 / 360) * 2 * Math.PI * R;
  const a = mix(-120, 120, value);
  const [nx, ny] = pt(a, 180);
  return (
    <svg width={640} height={420} viewBox="0 0 640 420">
      <path d={arc} fill="none" stroke={C.gray} strokeWidth={30} strokeLinecap="round" />
      <path d={arc} fill="none" stroke={color} strokeWidth={30} strokeLinecap="round" strokeDasharray={`${value * len} ${len * 2}`} />
      <line x1={320} y1={270} x2={nx} y2={ny} stroke={C.white} strokeWidth={12} strokeLinecap="round" />
      <circle cx={320} cy={270} r={22} fill={C.white} />
      <text x={320} y={405} textAnchor="middle" fill={C.white} fontSize={44} fontWeight={800} fontFamily="Inter">{label}</text>
    </svg>
  );
};
export { Gauge };

const S36: React.FC<SceneProps> = () => {
  const d = useRamp(8, 40);
  const v = mix(0.85, 0.4, d);
  return (
    <Stage>
      <Gauge value={v} label="Search & ads" color={d > 0.5 ? C.red : C.cyan} />
    </Stage>
  );
};

const S37: React.FC<SceneProps> = () => (
  <>
    <ImageBg file="n13-cloud-next.jpg" dim={0.4} />
    <BottomShade />
    <div style={{ position: "absolute", left: 0, right: 0, top: 120, display: "flex", justifyContent: "center", fontFamily: "Inter" }}>
      <Fade start={50}>
        <Panel style={{ fontSize: 60, fontWeight: 800 }}>
          Can <span style={{ color: C.cyan }}>Cloud</span> hold the stock up?
        </Panel>
      </Fade>
    </div>
    <div style={{ position: "absolute", right: 30, bottom: 150, fontSize: 18, color: "rgba(255,255,255,0.6)", fontFamily: "Inter" }}>Photo: Google Cloud Next &apos;26</div>
  </>
);

export const SCENES_1: { shots: number[]; C: React.FC<SceneProps> }[] = [
  { shots: [1], C: S01 },
  { shots: [2], C: S02 },
  { shots: [3], C: S03 },
  { shots: [4], C: S04 },
  { shots: [5], C: S05 },
  { shots: [6], C: S06 },
  { shots: [7, 8], C: S07 },
  { shots: [9, 10], C: S09 },
  { shots: [11], C: S11 },
  { shots: [12], C: S12 },
  { shots: [13], C: S13 },
  { shots: [14], C: S14 },
  { shots: [15], C: S15 },
  { shots: [16, 17], C: S16 },
  { shots: [18], C: S18 },
  { shots: [19, 20], C: S19 },
  { shots: [21], C: S21 },
  { shots: [22], C: S22 },
  { shots: [23], C: S23 },
  { shots: [24], C: S24 },
  { shots: [25], C: S25 },
  { shots: [26], C: S26 },
  { shots: [27], C: S27 },
  { shots: [28], C: S28 },
  { shots: [29, 30], C: S29 },
  { shots: [31], C: S31 },
  { shots: [32], C: S32 },
  { shots: [33], C: S33 },
  { shots: [34, 35], C: S34 },
  { shots: [36], C: S36 },
  { shots: [37], C: S37 },
];
