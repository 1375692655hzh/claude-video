// 镜头 8–15：配套瓶颈、筛选门、从故事到财报、存储、低PE陷阱、供需赛跑、融资、现金时间差。
import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { SceneProps, at } from "./scenes-a";
import {
  Badge,
  BackdropClip,
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

// ---------- 镜头8 从芯片走向配套 ----------
const NODES = [
  { k: "芯片", hot: false },
  { k: "载板", hot: true },
  { k: "存储", hot: true },
  { k: "光互联", hot: true },
  { k: "供电", hot: false },
];
export const Shot8: React.FC<SceneProps> = ({ s }) => {
  const frame = useCurrentFrame();
  const sys = at(s, 1, 0);
  const chipOut = interpolate(frame, [sys - 12, sys + 4], [1, 0], clamp);
  const hot = at(s, 2, 0.15);
  const power = at(s, 3, 0);
  return (
    <AbsoluteFill>
      <div style={{ opacity: chipOut }}>
        <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", paddingBottom: 120 }}>
          <Clip src="nv-cowos.mp4" w={1100} h={620} credit="Blackwell 晶圆与 CoWoS 封装（NVIDIA 官方视频）" />
        </div>
        <Fade start={at(s, 0, 0.5)} style={{ position: "absolute", left: 0, right: 0, top: 770, textAlign: "center" }}>
          <Title size={84}>
            谁赢，<span style={{ color: C.orange }}>都得造出来</span>
          </Title>
        </Fade>
      </div>
      {frame >= sys - 4 ? (
        <>
          <SceneHead start={sys} kicker="第二条线索">
            设计可以竞争，配套可能一起缺
          </SceneHead>
          <div style={{ position: "absolute", left: 110, right: 110, top: 400, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            {NODES.map((n, i) => {
              const on = interpolate(frame, [sys + 20 + i * 12, sys + 32 + i * 12], [0, 1], clamp);
              const isHot = n.hot && frame >= hot;
              const isPower = n.k === "供电" && frame >= power;
              const color = isHot ? C.orange : C.cyan;
              return (
                <React.Fragment key={n.k}>
                  {i > 0 ? <div style={{ flex: 1, height: 4, background: on > 0.5 ? C.cyan : C.gray, margin: "0 10px", opacity: 0.7 }} /> : null}
                  <div
                    style={{
                      width: 250,
                      height: 170,
                      borderRadius: 22,
                      opacity: 0.25 + 0.75 * on,
                      border: `3px solid ${on > 0.5 ? color : C.gray}`,
                      background: isHot ? C.orangeSoft : C.cyanSoft,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontFamily: FONT,
                      fontSize: 50,
                      fontWeight: 900,
                      color: C.white,
                      boxShadow: isHot ? `0 0 40px ${C.orange}88` : "none",
                      transform: `scale(${isHot ? 1.06 : 1})`,
                      position: "relative",
                    }}
                  >
                    {n.k}
                    {isHot ? (
                      <div style={{ position: "absolute", bottom: -54 }}>
                        <Pill color={C.orange} size={24}>
                          扩产慢
                        </Pill>
                      </div>
                    ) : null}
                    {isPower ? (
                      <div style={{ position: "absolute", bottom: -54 }}>
                        <Pill color={C.muted} size={24}>
                          重要 ≠ 唯一瓶颈
                        </Pill>
                      </div>
                    ) : null}
                  </div>
                </React.Fragment>
              );
            })}
          </div>
          <Fade start={hot + 20} style={{ position: "absolute", left: 110, top: 680, display: "flex", gap: 24 }}>
            <Clip src="nv-cpo.mp4" startAt={hot + 20} rate={0.7} w={420} h={170} credit="NVIDIA 光互联交换机" />
            <Photo src="gen-power.png" w={420} h={170} fit="cover" />
            <div style={{ alignSelf: "center", marginLeft: 20 }}>
              <Text size={38} weight={700}>
                最难绕开的瓶颈，
                <br />
                <span style={{ color: C.orange }}>未必是新闻里最热门的那个</span>
              </Text>
            </div>
          </Fade>
        </>
      ) : null}
    </AbsoluteFill>
  );
};

// ---------- 镜头9 筛选门 ----------
const GATES = [
  { k: "适用", pass: true },
  { k: "认证", pass: true },
  { k: "交付", pass: false },
  { k: "利润", pass: false },
];
export const Shot9: React.FC<SceneProps> = ({ s }) => {
  const frame = useCurrentFrame();
  const gatesStart = at(s, 2, 0);
  const step = s.lines[2].frames / 4;
  const pos = interpolate(frame, [gatesStart, gatesStart + s.lines[2].frames], [0, 4], clamp);
  const gateX = (i: number) => 760 + i * 270;
  return (
    <AbsoluteFill>
      <Fade start={0} x={-40} y={0} style={{ position: "absolute", left: 90, top: 150 }}>
        <Photo src="ibiden.png" w={560} h={315} fit="cover" credit="揖斐电（IBIDEN）封装载板 · 官方图" />
        <Text size={22} color={C.muted} style={{ marginTop: 10 }}>
          产品形态示例，不代表大会推荐标的
        </Text>
      </Fade>
      <Fade start={at(s, 0, 0.3)} style={{ position: "absolute", left: 720, top: 150, width: 1100 }}>
        <Text size={44} weight={800}>
          一种配套服务<span style={{ color: C.cyan }}>多种芯片方案</span>
        </Text>
        <Text size={36} color={C.muted}>
          → 未必需要押中最终赢家
        </Text>
      </Fade>
      <Fade start={at(s, 1, 0.1)} style={{ position: "absolute", left: 720, top: 310 }}>
        <Pill color={C.orange} size={30}>
          但这只是起点：载板 / PCB / 光通信 ≠ 全部受益
        </Pill>
      </Fade>
      {/* 筛选门 */}
      {GATES.map((g, i) => {
        const reached = pos >= i + 0.5;
        const ok = g.pass && reached;
        const failed = !g.pass && reached;
        const color = ok ? C.green : failed ? C.gray : C.cyan;
        return (
          <Fade key={g.k} start={at(s, 1, 0.3) + i * 6} style={{ position: "absolute", left: gateX(i) - 60, top: 470 }}>
            <div style={{ width: 120, height: 260, borderLeft: `6px solid ${color}`, borderRight: `6px solid ${color}`, borderTop: `6px solid ${color}`, borderRadius: "14px 14px 0 0", opacity: failed ? 0.5 : 1 }} />
            <Text size={40} weight={800} color={failed ? C.muted : C.white} style={{ textAlign: "center", marginTop: 10 }}>
              {g.k}
            </Text>
            <Text size={26} color={ok ? C.green : failed ? C.muted : C.muted} style={{ textAlign: "center" }}>
              {ok ? "✓ 通过" : failed ? "待验证" : ""}
            </Text>
          </Fade>
        );
      })}
      {frame >= gatesStart - 20 ? (
        <div
          style={{
            position: "absolute",
            top: 560,
            left: 560 + Math.min(pos, 2.05) * 270 - 110,
            opacity: interpolate(frame, [gatesStart - 20, gatesStart], [0, 1], clamp),
          }}
        >
          <Card accent={pos > 2.5 ? C.gray : C.cyan} dim={pos > 2.5} style={{ padding: "16px 22px", width: 220, textAlign: "center" }}>
            <Text size={30} weight={800}>
              潜在供应商
            </Text>
          </Card>
        </div>
      ) : null}
      <Text size={24} color={C.muted} style={{ position: "absolute", left: 1460, top: 880, opacity: frame > gatesStart + step * 3 ? 1 : 0 }}>
        示意：不是每家公司都能全部通过
      </Text>
    </AbsoluteFill>
  );
};

// ---------- 镜头10 从故事到财报 ----------
export const Shot10: React.FC<SceneProps> = ({ s }) => {
  const frame = useCurrentFrame();
  const hotFade = interpolate(frame, [at(s, 0, 0.5), at(s, 1, 0)], [1, 0.25], clamp);
  const solid = frame >= at(s, 1, 0.75);
  const cash = useRamp(at(s, 2, 0.45), 40);
  return (
    <AbsoluteFill>
      <BackdropClip src="nv-tray.mp4" rate={0.6} opacity={0.3} label="NVIDIA 官方视频：GB200 计算托盘组装" />
      <Fade start={0} style={{ position: "absolute", left: 110, top: 360, opacity: hotFade }}>
        <div
          style={{
            width: 330,
            height: 330,
            borderRadius: 165,
            border: `3px solid ${C.orange}`,
            background: C.orangeSoft,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            boxShadow: `0 0 60px ${C.orange}55`,
          }}
        >
          <Title size={64}>热门赛道</Title>
        </div>
      </Fade>
      <Fade start={at(s, 0, 0.4)} style={{ position: "absolute", left: 110, top: 720 }}>
        <Text size={34} color={C.muted}>
          身处热门 ≠ 能接住最有价值的订单
        </Text>
      </Fade>
      {/* 计划 → 交付 → 回款 */}
      <div style={{ position: "absolute", left: 560, top: 360, display: "flex", alignItems: "center", gap: 30 }}>
        {[
          { k: "产品验证", sub: "技术被看好", start: at(s, 1, 0) },
          { k: solid ? "实际交付" : "交付计划", sub: solid ? "产能能交付" : "客户有计划", start: at(s, 1, 0.4), dash: !solid },
          { k: "毛利 & 回款", sub: "开始兑现", start: at(s, 2, 0.3), cash: true },
        ].map((b, i) => (
          <React.Fragment key={i}>
            {i > 0 ? (
              <Fade start={b.start}>
                <Text size={60} color={C.cyan}>
                  →
                </Text>
              </Fade>
            ) : null}
            <Fade start={b.start}>
              <Card dashed={b.dash} accent={b.cash ? C.cyan : b.dash ? C.muted : C.cyan} glow={b.cash ? cash : 0} style={{ width: 330, height: 330, display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center" }}>
                <Title size={b.cash ? 44 : 52}>{b.k}</Title>
                <Text size={30} color={C.muted} style={{ marginTop: 10 }}>
                  {b.sub}
                </Text>
                {b.cash ? (
                  <div style={{ marginTop: 18, width: 220, height: 24, borderRadius: 12, background: "rgba(255,255,255,0.08)", overflow: "hidden" }}>
                    <div style={{ width: `${cash * 100}%`, height: "100%", background: C.cyan }} />
                  </div>
                ) : null}
              </Card>
            </Fade>
          </React.Fragment>
        ))}
      </div>
      <Fade start={at(s, 2, 0.65)} style={{ position: "absolute", left: 0, right: 0, top: 150, textAlign: "center" }}>
        <Title size={76}>
          缺货只是开头，<span style={{ color: C.cyan }}>兑现才是证据</span>
        </Title>
      </Fade>
    </AbsoluteFill>
  );
};

// ---------- 镜头11 存储引入 ----------
export const Shot11: React.FC<SceneProps> = ({ s }) => {
  const frame = useCurrentFrame();
  const swap = at(s, 1, 0.5);
  const tl = useRamp(at(s, 2, 0.05), 60);
  const q = useIn(at(s, 2, 0.55));
  const years = ["2026", "2027", "2028"];
  return (
    <AbsoluteFill>
      <SceneHead start={0} kicker="第三条线索 · 存储">
        好日子，<span style={{ color: C.cyan }}>能持续多久？</span>
      </SceneHead>
      <Fade start={at(s, 1, 0)} x={-40} y={0} style={{ position: "absolute", left: 110, top: 330, opacity: frame < swap ? 1 : interpolate(frame, [swap, swap + 15], [1, 0], clamp) }}>
        <Photo src="micron-hbm4.jpg" w={760} h={420} fit="cover" credit="图片来源：Micron Technology（美光）· HBM4" />
      </Fade>
      {frame >= swap ? (
        <Fade start={swap} x={-40} y={0} style={{ position: "absolute", left: 110, top: 330 }}>
          <Photo src="skhynix-hbm4.jpg" w={760} h={420} fit="cover" bg="#fff" credit="图片来源：SK hynix（SK海力士）· HBM4" />
        </Fade>
      ) : null}
      {/* 时间线 */}
      <div style={{ position: "absolute", left: 960, top: 520, width: 860 }}>
        <div style={{ position: "absolute", top: 28, left: 0, width: `${tl * 72}%`, height: 6, background: C.cyan, boxShadow: `0 0 16px ${C.cyan}` }} />
        <div style={{ position: "absolute", top: 28, left: "72%", width: `${q * 28}%`, borderTop: `6px dashed ${C.muted}` }} />
        {years.map((y, i) => (
          <div key={y} style={{ position: "absolute", left: `${i * 34}%`, top: 0, textAlign: "center", opacity: tl >= i * 0.48 ? 1 : 0.2 }}>
            <div style={{ width: 60, height: 60, borderRadius: 30, background: i === 2 ? C.orange : C.cyan, margin: "0 auto" }} />
            <Text size={40} weight={800} style={{ marginTop: 10 }}>
              {y}
            </Text>
          </div>
        ))}
        <div style={{ position: "absolute", left: "96%", top: -14, opacity: q, fontFamily: FONT, fontSize: 80, fontWeight: 900, color: C.muted }}>?</div>
        <Fade start={at(s, 2, 0.2)} style={{ position: "absolute", top: -120, left: 0 }}>
          <Pill color={C.orange} size={28}>
            供应紧张可能延续到 2028 年
          </Pill>
        </Fade>
        <Fade start={at(s, 2, 0.6)} style={{ position: "absolute", top: 140, left: 0, width: 860 }}>
          <Text size={30} color={C.muted}>
            Rasgon 的预测，更远取决于需求——不是已确定的行业拐点
          </Text>
        </Fade>
      </div>
    </AbsoluteFill>
  );
};

// ---------- 镜头12 低PE陷阱 ----------
export const Shot12: React.FC<SceneProps> = ({ s }) => {
  const frame = useCurrentFrame();
  const drop = at(s, 1, 0.55);
  const trap = at(s, 2, 0);
  const reverse = at(s, 3, 0);
  const t = useRamp(drop, 40);
  const eps = 20 - 15 * t;
  const pe = 100 / eps;
  return (
    <AbsoluteFill>
      <Badge>假设演示 · 非具体公司数据</Badge>
      <SceneHead start={at(s, 0, 0.1)}>
        最容易误导人的数字：<span style={{ color: C.orange }}>市盈率</span>
      </SceneHead>
      <div style={{ position: "absolute", left: 110, top: 340, display: "flex", gap: 40, alignItems: "center" }}>
        <Fade start={at(s, 1, 0)}>
          <Card style={{ width: 400, height: 300, textAlign: "center", display: "flex", flexDirection: "column", justifyContent: "center" }}>
            <Text size={34} color={C.muted}>
              股价（不变）
            </Text>
            <Title size={110}>100</Title>
          </Card>
        </Fade>
        <Fade start={at(s, 1, 0.15)}>
          <Text size={80} color={C.muted}>
            ÷
          </Text>
        </Fade>
        <Fade start={at(s, 1, 0.15)}>
          <Card accent={t > 0.5 ? C.orange : C.cyan} style={{ width: 400, height: 300, textAlign: "center", display: "flex", flexDirection: "column", justifyContent: "center" }}>
            <Text size={34} color={C.muted}>
              每股盈利 EPS
            </Text>
            <Title size={110} color={t > 0.5 ? C.orange : C.white}>
              {eps.toFixed(0)}
            </Title>
          </Card>
        </Fade>
        <Fade start={at(s, 1, 0.3)}>
          <Text size={80} color={C.muted}>
            =
          </Text>
        </Fade>
        <Fade start={at(s, 1, 0.3)}>
          <Card glow={t} accent={t > 0.5 ? C.orange : C.cyan} style={{ width: 420, height: 300, textAlign: "center", display: "flex", flexDirection: "column", justifyContent: "center" }}>
            <Text size={34} color={C.muted}>
              市盈率 PE
            </Text>
            <Title size={110} color={t > 0.5 ? C.orange : C.cyan}>
              {pe.toFixed(0)}倍
            </Title>
          </Card>
        </Fade>
      </div>
      {frame >= trap ? (
        <Fade start={trap} style={{ position: "absolute", left: 110, top: 700 }}>
          <Card accent={C.orange} style={{ width: 820, padding: "20px 30px" }}>
            <Text size={40} weight={800}>
              低PE，还是<span style={{ color: C.orange }}>高峰利润</span>？
            </Text>
          </Card>
        </Fade>
      ) : null}
      {frame >= reverse ? (
        <Fade start={reverse + 10} style={{ position: "absolute", left: 990, top: 700 }}>
          <Card style={{ width: 820, padding: "20px 30px" }}>
            <Text size={40} weight={800}>
              高盈利持续更久？→ <span style={{ color: C.cyan }}>折价修正</span>
            </Text>
          </Card>
        </Fade>
      ) : null}
    </AbsoluteFill>
  );
};

// ---------- 镜头13 供需赛跑 ----------
const Track: React.FC<{ y: number; label: string; stages: string[]; p: number; color: string }> = ({ y, label, stages, p, color }) => (
  <div style={{ position: "absolute", left: 110, top: y, width: 1700 }}>
    <Text size={40} weight={900} color={color} style={{ position: "absolute", left: 0, top: 14 }}>
      {label}
    </Text>
    <div style={{ position: "absolute", left: 180, top: 40, width: 1440, height: 8, background: "rgba(255,255,255,0.08)", borderRadius: 4 }} />
    <div style={{ position: "absolute", left: 180, top: 40, width: 1440 * p, height: 8, background: color, borderRadius: 4, boxShadow: `0 0 16px ${color}` }} />
    {stages.map((st, i) => {
      const x = 180 + (1440 * (i + 1)) / stages.length - 120;
      const on = p >= (i + 1) / stages.length - 0.02;
      return (
        <div key={st} style={{ position: "absolute", left: x, top: 70, width: 240, textAlign: "center" }}>
          <Text size={32} weight={700} color={on ? C.white : C.muted}>
            {st}
          </Text>
        </div>
      );
    })}
    <div style={{ position: "absolute", left: 180 + 1440 * p - 22, top: 22, width: 44, height: 44, borderRadius: 22, background: color, boxShadow: `0 0 24px ${color}` }} />
  </div>
);

export const Shot13: React.FC<SceneProps> = ({ s }) => {
  const frame = useCurrentFrame();
  const a = at(s, 2, 0);
  const b = at(s, 2, 0.5);
  const clock = at(s, 3, 0);
  // 情景A：供给快、需求慢；情景B：供给慢、需求强
  const intro = interpolate(frame, [at(s, 1, 0), a - 10], [0, 0.6], clamp);
  const sa = interpolate(frame, [a, b - 15], [0, 1], clamp);
  const sb = interpolate(frame, [b, clock - 10], [0, 1], clamp);
  const inB = frame >= b;
  const supply = inB ? 0.25 + 0.3 * sb : frame >= a ? 0.3 + 0.7 * sa : intro;
  const demand = inB ? 0.25 + 0.75 * sb : frame >= a ? 0.3 + 0.2 * sa : intro;
  return (
    <AbsoluteFill>
      <BackdropClip src="micron-fab.mp4" opacity={0.22} label="Micron 官方视频：爱达荷新厂建设" />
      <SceneHead start={0}>
        看<span style={{ color: C.cyan }}>供需增量</span>，不看机械日期
      </SceneHead>
      <Track y={330} label="供给" stages={["宣布建设", "厂房完工", "有效产出"]} p={supply} color={C.orange} />
      <Track y={530} label="需求" stages={["追加采购", "库存", "实际消耗"]} p={demand} color={C.cyan} />
      {frame >= a && frame < b ? (
        <Fade start={a + 20} style={{ position: "absolute", left: 290, top: 720 }}>
          <Pill color={C.orange} size={36}>
            情景①：供给快、需求慢 → 重新检查盈利假设
          </Pill>
        </Fade>
      ) : null}
      {frame >= b && frame < clock ? (
        <Fade start={b + 20} style={{ position: "absolute", left: 290, top: 720 }}>
          <Pill color={C.cyan} size={36}>
            情景②：供给爬坡慢、需求仍强 → 高盈利可能更久
          </Pill>
        </Fade>
      ) : null}
      {frame >= clock ? (
        <Fade start={clock} style={{ position: "absolute", left: 290, top: 700, display: "flex", alignItems: "center", gap: 30 }}>
          <div style={{ fontSize: 90 }}>⏰</div>
          <Text size={46} weight={800}>
            2028 值得关注，但<span style={{ color: C.orange }}>不是自动交易的闹钟</span>
          </Text>
        </Fade>
      ) : null}
    </AbsoluteFill>
  );
};

// ---------- 镜头14 融资转折 ----------
export const Shot14: React.FC<SceneProps> = ({ s }) => {
  const frame = useCurrentFrame();
  const head = at(s, 1, 0);
  const card = at(s, 2, 0.05);
  const qOut = interpolate(frame, [head - 8, head + 4], [1, 0], clamp);
  const zoom = useIn(card, 20);
  return (
    <AbsoluteFill>
      <BackdropClip src="cw-dc.mp4" opacity={frame < card ? 0.55 : 0.22} label="CoreWeave 官方视频" />
      <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", opacity: qOut }}>
        <Fade start={5}>
          <Title size={96} style={{ textAlign: "center" }}>
            缺这么久，
            <br />
            那就<span style={{ color: C.cyan }}>借钱扩产</span>？
          </Title>
        </Fade>
      </div>
      {frame >= head ? (
        <SceneHead start={head} kicker="第四条线索 · 融资">
          有订单，<span style={{ color: C.orange }}>也未必有钱开工</span>
        </SceneHead>
      ) : null}
      {frame >= card - 5 ? (
        <div style={{ position: "absolute", left: 110, right: 110, top: 360, display: "flex", gap: 40, opacity: zoom, transform: `scale(${0.92 + 0.08 * zoom})` }}>
          <Card accent={C.orange} style={{ flex: 1, height: 420, display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center" }}>
            <Text size={34} color={C.muted}>
              CoreWeave 无担保债
            </Text>
            <Title size={180} color={C.orange}>
              ≈<Counter from={0} to={15} start={card + 10} len={30} />%
            </Title>
            <Text size={34} weight={700}>
              市场交易收益率
            </Text>
          </Card>
          <div style={{ alignSelf: "center", fontFamily: FONT, fontSize: 120, fontWeight: 900, color: C.white }}>≠</div>
          <Card style={{ flex: 1, height: 420, display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center" }}>
            <Text size={34} color={C.muted}>
              公司全部存量债务
            </Text>
            <Title size={110} style={{ margin: "30px 0" }}>
              实际借款利率
            </Title>
            <Text size={30} color={C.muted}>
              不能用 15% 直接算整家公司的利息
            </Text>
          </Card>
        </div>
      ) : null}
      {frame >= at(s, 3, 0) ? (
        <Fade start={at(s, 3, 0.1)} style={{ position: "absolute", left: 0, right: 0, top: 810, textAlign: "center" }}>
          <Text size={38} weight={700}>
            它的价值：看<span style={{ color: C.cyan }}>资本市场怎样给风险定价</span>
            <span style={{ color: C.muted, fontSize: 24, marginLeft: 20 }}>（大会讨论口径，非实时报价）</span>
          </Text>
        </Fade>
      ) : null}
    </AbsoluteFill>
  );
};

// ---------- 镜头15 现金时间差 ----------
const STEPS = ["签约", "采购建设", "上线", "收租"];
export const Shot15: React.FC<SceneProps> = ({ s }) => {
  const frame = useCurrentFrame();
  const tl = useRamp(at(s, 0, 0.05), 50);
  const bridge = useRamp(at(s, 1, 0.55), 30);
  const x = (i: number) => 220 + i * 500;
  return (
    <AbsoluteFill>
      <div style={{ position: "absolute", left: 220, top: 470, width: 1500 * tl, height: 6, background: C.white, opacity: 0.6 }} />
      {STEPS.map((st, i) => (
        <Fade key={st} start={at(s, 0, 0.05) + i * 10} style={{ position: "absolute", left: x(i) - 110, top: 420, width: 220, textAlign: "center" }}>
          <div style={{ width: 100, height: 100, borderRadius: 50, margin: "0 auto", background: C.bg2, border: `4px solid ${i < 2 ? C.orange : C.cyan}`, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: FONT, fontSize: 40, fontWeight: 900, color: C.white }}>
            {i + 1}
          </div>
          <Text size={38} weight={800} style={{ marginTop: 10 }}>
            {st}
          </Text>
        </Fade>
      ))}
      {/* 现金流出 / 流入柱 */}
      {[0, 1, 2, 3].map((i) => {
        const out = i < 2;
        const h = (out ? [90, 200, 0, 0] : [0, 0, 80, 170])[i];
        const g = interpolate(frame, [at(s, 0, 0.4) + i * 8, at(s, 0, 0.4) + i * 8 + 25], [0, 1], clamp);
        if (h === 0) return null;
        return (
          <div
            key={i}
            style={{
              position: "absolute",
              left: x(i) - 50,
              width: 100,
              top: out ? 600 : 400 - h * g,
              height: h * g,
              background: out ? C.orange : C.cyan,
              borderRadius: 10,
              opacity: 0.85,
            }}
          />
        );
      })}
      <Fade start={at(s, 0, 0.5)} style={{ position: "absolute", left: 130, top: 830 }}>
        <Text size={30} color={C.orange} weight={700}>
          ▼ 现金流出（先花钱）
        </Text>
      </Fade>
      <Fade start={at(s, 0, 0.6)} style={{ position: "absolute", left: 1450, top: 160 }}>
        <Text size={30} color={C.cyan} weight={700}>
          ▲ 现金流入（后回款）
        </Text>
      </Fade>
      {/* 融资之桥 */}
      <svg style={{ position: "absolute", inset: 0 }} width={1920} height={1080}>
        <path
          d={`M ${x(1)} 380 Q ${(x(1) + x(3)) / 2} 140 ${x(3)} 220`}
          stroke={C.white}
          strokeWidth={8}
          fill="none"
          strokeDasharray={1200}
          strokeDashoffset={1200 * (1 - bridge)}
          style={{ filter: `drop-shadow(0 0 10px ${C.white})` }}
        />
      </svg>
      <Fade start={at(s, 1, 0.75)} style={{ position: "absolute", left: (x(1) + x(3)) / 2 - 80, top: 160 }}>
        <Pill color={C.white} size={40}>
          融资
        </Pill>
      </Fade>
      <Fade start={at(s, 1, 0)} style={{ position: "absolute", left: 110, top: 140 }}>
        <Title size={60}>
          订单是<span style={{ color: C.cyan }}>未来的钱</span>
        </Title>
      </Fade>
      <Fade start={at(s, 1, 0.3)} style={{ position: "absolute", left: 110, top: 220 }}>
        <Title size={60}>
          建设要花<span style={{ color: C.orange }}>今天的钱</span>
        </Title>
      </Fade>
      <Fade start={at(s, 2, 0.2)} style={{ position: "absolute", left: 1160, top: 720 }}>
        <Card style={{ width: 640, padding: "18px 26px" }}>
          <Text size={32} weight={700}>
            同样的大订单：资金成本 × 回款条件
            <br />
            <span style={{ color: C.cyan }}>→ 股东收益可能相差很大</span>
          </Text>
        </Card>
      </Fade>
    </AbsoluteFill>
  );
};

