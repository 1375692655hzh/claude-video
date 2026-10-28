// 镜头 1–7：开场冲突、大会人物、内容地图、两种观点、自研成本、议价筹码、性价比计算。
import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import type { Shot } from "./timeline";
import {
  Arrow,
  Badge,
  BackdropClip,
  BackdropPhoto,
  C,
  Card,
  Clip,
  Counter,
  FONT,
  Fade,
  Photo,
  Pill,
  SceneHead,
  Text,
  Title,
  clamp,
  useIn,
  useRamp,
} from "./ui";

export type SceneProps = { s: Shot };

/** 第 i 句开始后 frac 比例处的帧 */
export const at = (s: Shot, i: number, frac = 0) => s.lines[i].from + Math.round(s.lines[i].frames * frac);

// ---------- 镜头1 开场冲突 ----------
export const Shot1: React.FC<SceneProps> = ({ s }) => {
  const buy = useRamp(at(s, 0, 0.05), 25);
  const self = useRamp(at(s, 0, 0.45), 25);
  const title = useIn(at(s, 0, 0.62), 12);
  return (
    <AbsoluteFill>
      <BackdropClip src="cw-aisle.mp4" opacity={0.4} />
      {/* 客户节点 */}
      <Fade start={0} style={{ position: "absolute", left: 830, top: 390 }}>
        <Card style={{ width: 260, textAlign: "center", padding: "22px 10px" }} glow={0.4}>
          <Text size={30} color={C.muted}>
            云计算大客户
          </Text>
          <Text size={44} weight={900}>
            谷歌 · 亚马逊
          </Text>
        </Card>
      </Fade>
      {/* 英伟达机柜 */}
      <Fade start={4} x={-40} y={0} style={{ position: "absolute", left: 120, top: 170 }}>
        <Clip src="nv-rack.mp4" w={520} h={600} credit="NVIDIA GB200 NVL72（NVIDIA 官方视频）" />
      </Fade>
      <Arrow x1={820} y1={470} x2={660} y2={470} progress={buy} color={C.cyan} label="采购" />
      {/* 自研芯片 */}
      <Fade start={at(s, 0, 0.42)} x={40} y={0} style={{ position: "absolute", left: 1290, top: 180 }}>
        <Photo src="ironwood-1.png" w={500} h={300} fit="cover" credit="Google TPU（官方图）" />
      </Fade>
      <Fade start={at(s, 0, 0.5)} x={40} y={0} style={{ position: "absolute", left: 1290, top: 510 }}>
        <Clip src="aws-trn3.mp4" w={500} h={230} rate={0.9} credit="AWS Trainium3（AWS 官方视频）" style={{ border: `2px solid ${C.orange}` }} />
      </Fade>
      <Arrow x1={1100} y1={470} x2={1270} y2={470} progress={self} color={C.orange} label="自研" />
      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          top: 790,
          textAlign: "center",
          opacity: title,
          transform: `scale(${1.25 - 0.25 * title})`,
        }}
      >
        <Title size={104}>
          大客户，<span style={{ color: C.orange }}>变对手？</span>
        </Title>
      </div>
    </AbsoluteFill>
  );
};

// ---------- 镜头2 大会与人物 ----------
const Guest: React.FC<{ start: number; initials: string; name: string; role: string; color: string }> = ({
  start,
  initials,
  name,
  role,
  color,
}) => (
  <Fade start={start} x={-30} y={0}>
    <div style={{ display: "flex", alignItems: "center", gap: 26 }}>
      <div
        style={{
          width: 120,
          height: 120,
          borderRadius: 60,
          border: `3px solid ${color}`,
          background: `${color}22`,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontFamily: FONT,
          fontWeight: 900,
          fontSize: 44,
          color,
        }}
      >
        {initials}
      </div>
      <div style={{ borderLeft: `6px solid ${color}`, paddingLeft: 24 }}>
        <Text size={56} weight={900}>
          {name}
        </Text>
        <Text size={32} color={C.muted}>
          {role}
        </Text>
      </div>
    </div>
  </Fade>
);

export const Shot2: React.FC<SceneProps> = ({ s }) => {
  const frame = useCurrentFrame();
  const phase2 = at(s, 1, 0);
  const headOut = interpolate(frame, [phase2 - 10, phase2 + 5], [1, 0], clamp);
  return (
    <AbsoluteFill>
      <BackdropPhoto src="gen-stage.png" opacity={frame < phase2 ? 0.3 : 0.55} label="示意画面" />
      <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", opacity: headOut }}>
        <Fade start={at(s, 0, 0.1)}>
          <Title size={110} style={{ textAlign: "center" }}>
            增长继续，
            <br />
            <span style={{ color: C.orange }}>利润换人？</span>
          </Title>
        </Fade>
      </div>
      {frame >= phase2 - 5 ? (
        <>
          <Fade start={phase2} style={{ position: "absolute", left: 100, top: 170 }}>
            <Pill size={30}>CASPA 年会 · 10月23日 · 美国</Pill>
            <Title size={72} style={{ marginTop: 22 }}>
              两位半导体分析师的对谈
            </Title>
          </Fade>
          <div style={{ position: "absolute", left: 100, top: 470, display: "flex", flexDirection: "column", gap: 60 }}>
            <Guest start={at(s, 1, 0.45)} initials="DP" name="Dylan Patel" role="SemiAnalysis 创始人" color={C.cyan} />
            <Guest start={at(s, 1, 0.75)} initials="SR" name="Stacy Rasgon" role="伯恩斯坦（Bernstein）分析师" color={C.orange} />
          </div>
        </>
      ) : null}
    </AbsoluteFill>
  );
};

// ---------- 镜头3 内容地图 + 频道 ----------
const TOPICS = ["竞争", "配套", "存储", "融资", "利润"];
export const Shot3: React.FC<SceneProps> = ({ s }) => {
  const frame = useCurrentFrame();
  const line = useRamp(at(s, 0, 0.05), Math.round(s.lines[0].frames * 0.8));
  const intro = at(s, 1, 0);
  const shrink = interpolate(frame, [intro - 10, intro + 15], [0, 1], clamp);
  return (
    <AbsoluteFill>
      <BackdropPhoto src="gen-abstract.png" opacity={0.7} />
      <div
        style={{
          position: "absolute",
          left: 260,
          right: 260,
          top: interpolate(shrink, [0, 1], [430, 200]),
          transform: `scale(${interpolate(shrink, [0, 1], [1, 0.72])})`,
        }}
      >
        <div style={{ position: "absolute", top: 58, left: 70, right: 70, height: 4, background: C.gray }} />
        <div style={{ position: "absolute", top: 58, left: 70, width: `${line * 86}%`, height: 4, background: C.cyan, boxShadow: `0 0 16px ${C.cyan}` }} />
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          {TOPICS.map((t, i) => {
            const on = line >= i / 4 - 0.001;
            return (
              <div key={t} style={{ textAlign: "center", width: 140 }}>
                <div
                  style={{
                    width: 120,
                    height: 120,
                    margin: "0 auto",
                    borderRadius: 60,
                    border: `3px solid ${on ? C.cyan : C.gray}`,
                    background: on ? C.cyanSoft : "rgba(10,20,40,0.8)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontFamily: FONT,
                    fontSize: 54,
                    fontWeight: 900,
                    color: on ? C.cyan : C.muted,
                    boxShadow: on ? `0 0 30px ${C.cyan}66` : "none",
                  }}
                >
                  {i + 1}
                </div>
                <Text size={44} weight={800} color={on ? C.white : C.muted} style={{ marginTop: 18 }}>
                  {t}
                </Text>
              </div>
            );
          })}
        </div>
      </div>
      {frame >= intro - 5 ? (
        <Fade start={intro + 5} style={{ position: "absolute", left: 0, right: 0, top: 560, textAlign: "center" }}>
          <Title size={100}>
            Andy<span style={{ color: C.cyan }}>港美观察</span>
          </Title>
          <Text size={38} color={C.muted} style={{ marginTop: 16 }}>
            深耕港美股投资 10 年+
          </Text>
        </Fade>
      ) : null}
    </AbsoluteFill>
  );
};

// ---------- 镜头4 两种观点 ----------
const Scale: React.FC<{ tilt: number }> = ({ tilt }) => (
  <svg width={360} height={240} viewBox="0 0 360 240">
    <polygon points="180,60 160,230 200,230" fill={C.gray} />
    <g transform={`rotate(${tilt} 180 60)`}>
      <line x1={30} y1={60} x2={330} y2={60} stroke={C.white} strokeWidth={6} />
      <line x1={50} y1={60} x2={50} y2={120} stroke={C.muted} strokeWidth={2} />
      <line x1={310} y1={60} x2={310} y2={120} stroke={C.muted} strokeWidth={2} />
      <rect x={0} y={120} width={100} height={46} rx={10} fill={C.cyanSoft} stroke={C.cyan} strokeWidth={3} />
      <text x={50} y={152} textAnchor="middle" fill={C.cyan} fontSize={26} fontWeight={800} fontFamily={FONT}>
        性能
      </text>
      <rect x={260} y={120} width={100} height={46} rx={10} fill={C.orangeSoft} stroke={C.orange} strokeWidth={3} />
      <text x={310} y={152} textAnchor="middle" fill={C.orange} fontSize={26} fontWeight={800} fontFamily={FONT}>
        价格
      </text>
    </g>
  </svg>
);

export const Shot4: React.FC<SceneProps> = ({ s }) => {
  const frame = useCurrentFrame();
  const tilt = Math.sin(frame / 18) * 6;
  const leftOn = at(s, 1, 0.05);
  const rightOn = at(s, 1, 0.55);
  return (
    <AbsoluteFill>
      <Fade start={at(s, 0, 0.05)} style={{ position: "absolute", left: 0, right: 0, top: 130, textAlign: "center" }}>
        <Title size={64}>客户为什么一定要研究替代方案？</Title>
      </Fade>
      <Fade start={leftOn} x={-60} y={0} style={{ position: "absolute", left: 110, top: 280 }}>
        <Card style={{ width: 780, height: 470 }} glow={0.3}>
          <Text size={30} color={C.cyan} weight={700}>
            Dylan Patel · SemiAnalysis
          </Text>
          <Title size={70} style={{ margin: "10px 0 26px" }}>
            自研竞争
          </Title>
          <div style={{ display: "flex", gap: 22 }}>
            <Clip src="goog-racks.mp4" zoom={1.22} w={340} h={220} rate={0.7} credit="Google TPU 集群" />
            <Card accent={C.orange} style={{ width: 320, height: 220, padding: 22, display: "flex", flexDirection: "column", justifyContent: "center" }}>
              <Text size={26} color={C.orange}>
                AWS
              </Text>
              <Text size={50} weight={900}>
                Trainium
              </Text>
            </Card>
          </div>
        </Card>
      </Fade>
      <Fade start={rightOn} x={60} y={0} style={{ position: "absolute", right: 110, top: 280 }}>
        <Card accent={C.orange} style={{ width: 780, height: 470 }} glow={0.3}>
          <Text size={30} color={C.orange} weight={700}>
            Stacy Rasgon · Bernstein
          </Text>
          <Title size={70} style={{ margin: "10px 0 6px" }}>
            性能证明溢价
          </Title>
          <div style={{ display: "flex", justifyContent: "center" }}>
            <Scale tilt={frame > rightOn ? tilt : 0} />
          </div>
        </Card>
      </Fade>
      <Fade start={at(s, 2, 0.1)} style={{ position: "absolute", left: 0, right: 0, top: 790, display: "flex", justifyContent: "center" }}>
        <Pill size={40} color={C.white} style={{ background: "rgba(6,16,31,0.9)", padding: "10px 36px" }}>
          两种判断合起来 = 完整的投资问题
        </Pill>
      </Fade>
      <Text size={22} color={C.muted} style={{ position: "absolute", right: 110, top: 762 }}>
        嘉宾观点概括
      </Text>
    </AbsoluteFill>
  );
};

// ---------- 镜头5 自研也有成本 ----------
const COSTS = ["研发投入", "软件适配", "制造", "部署"];
export const Shot5: React.FC<SceneProps> = ({ s }) => {
  const frame = useCurrentFrame();
  const billStart = at(s, 0, 0.45);
  const tasks = at(s, 2, 0);
  const phaseOut = interpolate(frame, [tasks - 10, tasks + 5], [1, 0], clamp);
  const split = useRamp(at(s, 2, 0.5), 40);
  return (
    <AbsoluteFill>
      <div style={{ opacity: phaseOut }}>
        <Fade start={0} x={-40} y={0} style={{ position: "absolute", left: 100, top: 150 }}>
          <Clip src="goog-ironwood.mp4" zoom={1.22} w={760} h={500} credit="Google Ironwood TPU（Google Cloud 官方视频）" />
        </Fade>
        <Fade start={billStart - 10} x={40} y={0} style={{ position: "absolute", left: 960, top: 150 }}>
          <Card accent={C.orange} style={{ width: 840, padding: "30px 44px" }}>
            <Text size={34} color={C.orange} weight={800} style={{ marginBottom: 10 }}>
              自研账单
            </Text>
            {COSTS.map((c, i) => (
              <Fade key={c} start={billStart + i * 14} x={30} y={0}>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    borderBottom: `1px dashed ${C.line}`,
                    padding: "14px 0",
                  }}
                >
                  <Text size={46} weight={700}>
                    {i > 0 ? "＋ " : "　 "}
                    {c}
                  </Text>
                  <Text size={46} color={C.orange} weight={800}>
                    ¥ ¥ ¥
                  </Text>
                </div>
              </Fade>
            ))}
            <Fade start={billStart + 70}>
              <div style={{ display: "flex", justifyContent: "space-between", paddingTop: 18 }}>
                <Text size={52} weight={900}>
                  ＝ 总成本
                </Text>
                <Text size={40} weight={800} color={C.cyan}>
                  是否更划算？
                </Text>
              </div>
            </Fade>
          </Card>
        </Fade>
        <Fade start={at(s, 1, 0.1)} style={{ position: "absolute", left: 960, top: 790 }}>
          <Text size={40} weight={700}>
            关键不在“能不能设计”，而在<span style={{ color: C.cyan }}>整套方案的账</span>
          </Text>
        </Fade>
      </div>
      {frame >= tasks - 5 ? (
        <>
          <SceneHead start={tasks}>不必在所有任务上打败英伟达</SceneHead>
          <div style={{ position: "absolute", left: 160, top: 330, display: "grid", gridTemplateColumns: "repeat(12, 120px)", gap: 14 }}>
            {Array.from({ length: 36 }).map((_, i) => {
              const special = i % 12 < 4;
              const t = special ? split : 0;
              const appear = interpolate(frame, [tasks + i * 1.2, tasks + i * 1.2 + 10], [0, 1], clamp);
              return (
                <div
                  key={i}
                  style={{
                    height: 90,
                    borderRadius: 12,
                    opacity: appear,
                    border: `2px solid ${t > 0.5 ? C.orange : C.cyan}`,
                    background: t > 0.5 ? C.orangeSoft : C.cyanSoft,
                    transform: `translateX(${special ? -t * 30 : t * 30}px)`,
                  }}
                />
              );
            })}
          </div>
          <Fade start={at(s, 2, 0.55)} style={{ position: "absolute", left: 130, top: 680 }}>
            <Pill color={C.orange} size={34}>
              规模大、需求稳的任务 → 专用芯片
            </Pill>
          </Fade>
          <Fade start={at(s, 2, 0.6)} style={{ position: "absolute", left: 1060, top: 680 }}>
            <Pill color={C.cyan} size={34}>
              其余任务 → 通用 GPU
            </Pill>
          </Fade>
        </>
      ) : null}
    </AbsoluteFill>
  );
};

// ---------- 镜头6 第二选择带来的筹码 ----------
export const Shot6: React.FC<SceneProps> = ({ s }) => {
  const frame = useCurrentFrame();
  const first = useRamp(5, 20);
  const second = useRamp(at(s, 0, 0.35), 25);
  const moat = at(s, 1, 0.2);
  const cards = ["价格", "交付", "迁移成本"];
  return (
    <AbsoluteFill>
      <Badge color={C.cyan}>Andy分析</Badge>
      <SceneHead start={at(s, 0, 0.5)}>
        第二选择，<span style={{ color: C.cyan }}>增加议价能力</span>
      </SceneHead>
      {/* 方案 A */}
      <Fade start={0} style={{ position: "absolute", left: 110, top: 380 }}>
        <Card glow={0.3} style={{ width: 460, height: 300 }}>
          <Text size={30} color={C.cyan}>
            方案 A
          </Text>
          <Title size={60}>英伟达 GPU</Title>
          {frame > moat
            ? ["部署效率", "软件生态", "系统稳定性", "升级能力"].map((m, i) => (
                <Fade key={m} start={moat + i * 10} y={10} style={{ display: "inline-block", marginRight: 10, marginTop: 14 }}>
                  <Pill size={24}>{m}</Pill>
                </Fade>
              ))
            : null}
        </Card>
      </Fade>
      {/* 方案 B */}
      <div style={{ position: "absolute", right: 110, top: 380, opacity: second, transform: `translateX(${(1 - second) * 60}px)` }}>
        <Card accent={C.orange} style={{ width: 460, height: 300 }}>
          <Text size={30} color={C.orange}>
            方案 B
          </Text>
          <Title size={52}>自研 / 替代芯片</Title>
          <Text size={28} color={C.muted} style={{ marginTop: 14 }}>
            分流新增订单
          </Text>
        </Card>
      </div>
      {/* 采购方 */}
      <Fade start={0} style={{ position: "absolute", left: 760, top: 400 }}>
        <div
          style={{
            width: 400,
            height: 260,
            borderRadius: 24,
            background: "linear-gradient(180deg, #13294d, #0c1a33)",
            border: `2px solid ${C.white}55`,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            paddingTop: 26,
          }}
        >
          <Text size={46} weight={900}>
            采购方
          </Text>
          <div style={{ display: "flex", gap: 12, marginTop: 30 }}>
            {cards.map((c, i) => (
              <Fade key={c} start={at(s, 0, 0.55) + i * 8} y={-40}>
                <div
                  style={{
                    padding: "14px 16px",
                    borderRadius: 10,
                    background: C.white,
                    color: C.bg,
                    fontFamily: FONT,
                    fontSize: 28,
                    fontWeight: 800,
                    transform: `rotate(${(i - 1) * 5}deg)`,
                  }}
                >
                  {c}
                </div>
              </Fade>
            ))}
          </div>
        </div>
      </Fade>
      <Arrow x1={750} y1={530} x2={590} y2={530} progress={first} />
      <Arrow x1={1170} y1={530} x2={1330} y2={530} progress={second} color={C.orange} />
      <Fade start={moat + 50} style={{ position: "absolute", left: 0, right: 0, top: 740, textAlign: "center" }}>
        <Text size={40} weight={700}>
          护城河不只在硬件：<span style={{ color: C.cyan }}>系统成本</span>同样决定客户选择
        </Text>
      </Fade>
    </AbsoluteFill>
  );
};

// ---------- 镜头7 性价比计算 ----------
const Bar: React.FC<{ label: string; to: number; start: number; color: string; y: number }> = ({ label, to, start, color, y }) => {
  const t = useRamp(start, 40);
  const v = 100 + (to - 100) * t;
  return (
    <div style={{ position: "absolute", left: 110, top: y, display: "flex", alignItems: "center", gap: 24 }}>
      <Text size={40} weight={700} style={{ width: 120 }}>
        {label}
      </Text>
      <div style={{ width: 900, height: 64, background: "rgba(255,255,255,0.06)", borderRadius: 12, position: "relative" }}>
        <div style={{ position: "absolute", left: 0, top: 0, bottom: 0, width: `${(v / 200) * 100}%`, background: color, borderRadius: 12, boxShadow: `0 0 20px ${color}88` }} />
        <div style={{ position: "absolute", left: "50%", top: -10, bottom: -10, borderLeft: `2px dashed ${C.white}66` }} />
      </div>
      <Text size={52} weight={900} color={color} style={{ width: 160, fontVariantNumeric: "tabular-nums" }}>
        {Math.round(v)}
      </Text>
    </div>
  );
};

export const Shot7: React.FC<SceneProps> = ({ s }) => {
  const frame = useCurrentFrame();
  const formula = at(s, 0, 0.55);
  const warn = at(s, 1, 0);
  const box = useIn(formula + 30, 12);
  return (
    <AbsoluteFill>
      <Badge>假设演示 · 非具体产品实测</Badge>
      <SceneHead start={0}>
        价格 <span style={{ color: C.orange }}>+50%</span>，产出 <span style={{ color: C.cyan }}>×2</span>
      </SceneHead>
      <Bar label="成本" to={150} start={at(s, 0, 0.15)} color={C.orange} y={330} />
      <Bar label="产出" to={200} start={at(s, 0, 0.3)} color={C.cyan} y={450} />
      <Fade start={formula} style={{ position: "absolute", left: 1330, top: 300 }}>
        <Card style={{ width: 500, textAlign: "center", padding: "20px 20px", transform: `scale(${0.9 + 0.1 * box})` }} glow={box}>
          <Text size={34} color={C.muted}>
            单位产出成本
          </Text>
          <Title size={64} style={{ margin: "4px 0" }}>
            150 ÷ 200
          </Title>
          <Title size={96} color={C.cyan}>
            = <Counter from={1} to={0.75} start={formula + 25} decimals={2} />
          </Title>
          <Text size={40} weight={800} color={C.cyan}>
            下降 25%
          </Text>
        </Card>
      </Fade>
      {frame >= warn ? (
        <Fade start={warn} style={{ position: "absolute", left: 110, top: 600, display: "flex", gap: 30 }}>
          <Card accent={C.orange} style={{ width: 1110 }}>
            <Text size={34} color={C.orange} weight={800}>
              真正要警惕的组合
            </Text>
            <Text size={40} weight={700} style={{ marginTop: 6 }}>
              价格涨得快 ＋ 实际性能跟不上 ＋ 竞争方案更成熟
            </Text>
          </Card>
        </Fade>
      ) : null}
      <Fade start={at(s, 2, 0.2)} style={{ position: "absolute", left: 1330, top: 730 }}>
        <div style={{ display: "flex", gap: 20 }}>
          <Card style={{ width: 230, textAlign: "center", padding: 20 }}>
            <Text size={28} color={C.muted}>
              卖得更多
            </Text>
            <Title size={50}>销量</Title>
          </Card>
          <Card accent={C.orange} style={{ width: 230, textAlign: "center", padding: 20 }}>
            <Text size={28} color={C.muted}>
              每单赚多少
            </Text>
            <Title size={50}>利润率</Title>
          </Card>
        </div>
      </Fade>
    </AbsoluteFill>
  );
};
