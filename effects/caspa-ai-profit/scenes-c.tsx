// 镜头 16–23：合同细节、风险归属、利润传导、成本与价值、增长与预期、结论、订阅、互动结尾。
import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { SceneProps, at } from "./scenes-a";
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

// ---------- 镜头16 合同细节 ----------
const CLAUSES = [
  { k: "价格条款", v: "租金提前锁定 · 成本上涨谁承担？" },
  { k: "取消条件", v: "项目延期 · 客户能否取消？" },
  { k: "付款安排", v: "何时付 · 付多少 · 有无预付？" },
];
export const Shot16: React.FC<SceneProps> = ({ s }) => {
  const frame = useCurrentFrame();
  const t0 = at(s, 0, 0.05);
  const L = s.lines[0].frames;
  const focus = frame < t0 + L * 0.3 ? 0 : frame < t0 + L * 0.55 ? 1 : 2;
  const magY = interpolate(frame, [t0, t0 + L * 0.3, t0 + L * 0.55, t0 + L * 0.8], [330, 330, 470, 610], clamp);
  const cost = useRamp(at(s, 0, 0.12), 30);
  const part2 = at(s, 1, 0);
  return (
    <AbsoluteFill>
      <SceneHead start={0}>
        大合同，<span style={{ color: C.cyan }}>还要看小条款</span>
      </SceneHead>
      {/* 示意合同 */}
      <Fade start={5} style={{ position: "absolute", left: 110, top: 270 }}>
        <div style={{ width: 720, height: 560, background: "#e9eef6", borderRadius: 14, padding: "30px 40px", boxShadow: "0 20px 60px rgba(0,0,0,0.5)", position: "relative" }}>
          <div style={{ fontFamily: FONT, fontSize: 34, fontWeight: 900, color: "#10203a", textAlign: "center" }}>算力租赁长约</div>
          <div style={{ position: "absolute", right: 30, top: 24, fontFamily: FONT, fontSize: 22, fontWeight: 800, color: C.orange, border: `2px solid ${C.orange}`, padding: "2px 10px", borderRadius: 6 }}>示意</div>
          {CLAUSES.map((c, i) => (
            <div key={c.k} style={{ marginTop: 34, padding: "10px 14px", borderRadius: 10, background: i === focus && frame >= t0 ? "rgba(46,230,240,0.25)" : "transparent" }}>
              <div style={{ fontFamily: FONT, fontSize: 30, fontWeight: 800, color: "#10203a" }}>
                第{i + 1}条 {c.k}
              </div>
              <div style={{ height: 10, background: "#b8c4d6", borderRadius: 5, marginTop: 12, width: "92%" }} />
              <div style={{ height: 10, background: "#b8c4d6", borderRadius: 5, marginTop: 10, width: "70%" }} />
            </div>
          ))}
        </div>
      </Fade>
      {/* 放大镜 */}
      {frame >= t0 && frame < part2 ? (
        <div style={{ position: "absolute", left: 640, top: magY, width: 150, height: 150, borderRadius: 75, border: `8px solid ${C.cyan}`, boxShadow: `0 0 30px ${C.cyan}`, background: "rgba(46,230,240,0.08)" }}>
          <div style={{ position: "absolute", right: -60, bottom: -40, width: 80, height: 16, background: C.cyan, transform: "rotate(40deg)", borderRadius: 8 }} />
        </div>
      ) : null}
      {frame < part2 ? (
        <Fade start={t0} style={{ position: "absolute", left: 900, top: 330, width: 900 }}>
          <Card accent={focus === 0 ? C.orange : C.cyan} style={{ minHeight: 160 }}>
            <Text size={34} color={C.muted}>
              {CLAUSES[focus].k}
            </Text>
            <Text size={46} weight={800}>
              {CLAUSES[focus].v}
            </Text>
          </Card>
          {focus === 0 ? (
            <div style={{ position: "relative", height: 200, marginTop: 30 }}>
              <div style={{ position: "absolute", left: 560, top: 0, width: 14, height: 180, background: C.white, borderRadius: 7 }} />
              <Text size={28} color={C.muted} style={{ position: "absolute", left: 590, top: 70 }}>
                租金锁定
              </Text>
              <div style={{ position: "absolute", left: 0, top: 70, width: 540 * cost, height: 12, background: C.orange, borderRadius: 6, boxShadow: `0 0 14px ${C.orange}` }} />
              <Text size={30} color={C.orange} weight={800} style={{ position: "absolute", left: 0, top: 100 }}>
                成本上涨 →
              </Text>
            </div>
          ) : null}
        </Fade>
      ) : (
        <div style={{ position: "absolute", left: 900, top: 320, width: 900 }}>
          <Fade start={part2}>
            <Card>
              <Text size={34} color={C.muted}>
                如果供应商为推动交易承担了
              </Text>
              <Title size={56}>融资支持 / 履约责任</Title>
            </Card>
          </Fade>
          <Fade start={part2 + 30} style={{ display: "flex", gap: 24, marginTop: 30 }}>
            <Card style={{ flex: 1, textAlign: "center" }}>
              <Text size={30} color={C.muted}>
                收入
              </Text>
              <Title size={64} color={C.cyan}>
                ↑
              </Title>
            </Card>
            <Card accent={C.orange} style={{ flex: 1, textAlign: "center" }}>
              <Text size={30} color={C.muted}>
                风险敞口
              </Text>
              <Title size={64} color={C.orange}>
                ？
              </Title>
            </Card>
          </Fade>
        </div>
      )}
    </AbsoluteFill>
  );
};

// ---------- 镜头17 风险落在哪里 ----------
const PARTIES = [
  { k: "供应商", x: 960, y: 330 },
  { k: "算力运营商", x: 520, y: 700 },
  { k: "客户", x: 1400, y: 700 },
];
export const Shot17: React.FC<SceneProps> = ({ s }) => {
  const frame = useCurrentFrame();
  const q1 = at(s, 1, 0.15);
  const q2 = at(s, 1, 0.35);
  const q3 = at(s, 1, 0.55);
  const active = frame >= q3 ? 2 : frame >= q2 ? 1 : frame >= q1 ? 0 : -1;
  const qs = ["谁付钱？", "何时付？", "谁承担风险？"];
  const draw = useRamp(10, 30);
  const arrows = [
    { x1: 1235, y1: 700, x2: 685, y2: 700, label: "付款" },
    { x1: 430, y1: 636, x2: 795, y2: 330, label: "采购付款" },
    { x1: 1000, y1: 396, x2: 690, y2: 690, label: "融资支持" },
  ];
  return (
    <AbsoluteFill>
      <Fade start={at(s, 0, 0.1)} style={{ position: "absolute", left: 90, top: 130, width: 700 }}>
        <Text size={30} color={C.muted}>
          研究方法，不是对某家公司下结论
        </Text>
      </Fade>
      {arrows.map((ar, i) => {
        const hl = active === 0 ? i === 0 : active === 1 ? i < 2 : active === 2 ? i === 2 : false;
        return (
          <Arrow
            key={i}
            x1={ar.x1}
            y1={ar.y1}
            x2={ar.x2}
            y2={ar.y2}
            progress={draw}
            color={hl ? (i === 2 ? C.orange : C.cyan) : C.gray}
            width={hl ? 8 : 4}
            label={ar.label}
            labelColor={hl ? C.white : C.muted}
          />
        );
      })}
      {PARTIES.map((p, i) => (
        <Fade key={p.k} start={i * 6} style={{ position: "absolute", left: p.x - 160, top: p.y - 60 }}>
          <Card style={{ width: 320, textAlign: "center", padding: "26px 10px" }} glow={active === 2 && i === 1 ? 0.8 : 0} accent={active === 2 && i === 1 ? C.orange : C.cyan}>
            <Title size={50}>{p.k}</Title>
          </Card>
        </Fade>
      ))}
      <div style={{ position: "absolute", right: 90, top: 140, display: "flex", flexDirection: "column", gap: 18, alignItems: "flex-end" }}>
        {qs.map((q, i) => (
          <Fade key={q} start={[q1, q2, q3][i]} x={30} y={0}>
            <Pill size={40} color={active === i ? (i === 2 ? C.orange : C.cyan) : C.muted}>
              {q}
            </Pill>
          </Fade>
        ))}
      </div>
      <Fade start={at(s, 1, 0.7)} style={{ position: "absolute", left: 0, right: 0, top: 830, textAlign: "center" }}>
        <Text size={34} weight={700} color={C.orange}>
          最终风险落在谁的资产负债表上？
        </Text>
      </Fade>
    </AbsoluteFill>
  );
};

// ---------- 镜头18/19 产业链 ----------
const CHAIN = ["配套供应商", "算力运营商", "模型服务", "终端客户"];
const chainX = (i: number) => 130 + i * 440;
const ChainCards: React.FC<{ highlight: number[]; lockAt?: number; tags?: (string | null)[]; tagColor?: string }> = ({
  highlight,
  lockAt,
  tags = [],
  tagColor = C.orange,
}) => (
  <>
    {CHAIN.map((c, i) => (
      <div key={c} style={{ position: "absolute", left: chainX(i), top: 430 }}>
        <Card accent={highlight.includes(i) ? C.orange : C.cyan} glow={highlight.includes(i) ? 0.6 : 0} style={{ width: 340, height: 170, display: "flex", alignItems: "center", justifyContent: "center", position: "relative" }}>
          <Title size={48}>{c}</Title>
          {lockAt === i ? (
            <div style={{ position: "absolute", top: -34, right: -20 }}>
              <Pill color={C.white} size={24} style={{ background: "#0b1d38" }}>
                🔒 租金锁定
              </Pill>
            </div>
          ) : null}
        </Card>
        {tags[i] ? (
          <div style={{ marginTop: 22, textAlign: "center" }}>
            <Pill color={tagColor} size={28}>
              {tags[i]}
            </Pill>
          </div>
        ) : null}
      </div>
    ))}
    {[0, 1, 2].map((i) => (
      <div key={i} style={{ position: "absolute", left: chainX(i) + 350, top: 500, fontFamily: FONT, fontSize: 50, color: C.muted }}>
        →
      </div>
    ))}
  </>
);

export const Shot18: React.FC<SceneProps> = ({ s }) => {
  const frame = useCurrentFrame();
  const cross = at(s, 1, 0.3);
  const flowStart = at(s, 2, 0.05);
  const flow = interpolate(frame, [flowStart, flowStart + s.lines[2].frames * 0.85], [0, 3], clamp);
  const stop = Math.floor(flow + 0.0001);
  const tags = CHAIN.map((_, i) => (frame >= flowStart && i <= stop ? (i === 0 ? "涨价＝机会" : "能否转嫁？") : null));
  const pulseX = chainX(0) + 170 + flow * 440;
  const strike = useIn(cross, 14);
  return (
    <AbsoluteFill>
      <SceneHead start={0} kicker="第五条线索 · 利润">
        AI增长，<span style={{ color: C.cyan }}>利润留在哪里？</span>
      </SceneHead>
      <ChainCards highlight={frame >= flowStart ? [Math.min(stop, 3)] : []} tags={tags} />
      {/* “全都受益”的箭头被划掉 */}
      {frame >= at(s, 1, 0) && frame < flowStart ? (
        <Fade start={at(s, 1, 0)} style={{ position: "absolute", left: 130, top: 700, width: 1660 }}>
          <div style={{ position: "relative", height: 90 }}>
            <div style={{ position: "absolute", left: 0, right: 0, top: 30, height: 14, background: C.green, borderRadius: 7 }} />
            <Text size={34} weight={800} color={C.green} style={{ position: "absolute", left: 640, top: -30 }}>
              全产业链同时受益？
            </Text>
            <div style={{ position: "absolute", left: 610, width: 440 * strike, top: -6, height: 8, background: C.orange, transform: "rotate(-4deg)" }} />
          </div>
        </Fade>
      ) : null}
      {frame >= flowStart ? (
        <div style={{ position: "absolute", left: pulseX - 30, top: 395, width: 60, height: 60, borderRadius: 30, background: C.orange, boxShadow: `0 0 40px ${C.orange}`, opacity: 0.9 }} />
      ) : null}
      {frame >= flowStart ? (
        <Fade start={flowStart} style={{ position: "absolute", left: 130, top: 340 }}>
          <Text size={30} color={C.orange} weight={700}>
            成本压力沿链条传递 →
          </Text>
        </Fade>
      ) : null}
    </AbsoluteFill>
  );
};

export const Shot19: React.FC<SceneProps> = ({ s }) => {
  const frame = useCurrentFrame();
  const value = at(s, 1, 0.1);
  const g = useRamp(value, 40);
  const end = at(s, 3, 0);
  return (
    <AbsoluteFill>
      <BackdropClip src="goog-racks.mp4" rate={0.5} opacity={0.18} label="Google Cloud 官方视频" />
      <SceneHead start={0}>
        成本在传导，<span style={{ color: C.cyan }}>价值也能增加</span>
      </SceneHead>
      <ChainCards
        highlight={frame < value ? [1] : []}
        lockAt={1}
        tags={frame < value ? [null, "设备 / 融资成本 ↑", "客户愿意付费？", null] : [null, null, null, null]}
      />
      {frame >= value ? (
        <>
          <svg style={{ position: "absolute", inset: 0 }} width={1920} height={1080}>
            <path d={`M 300 680 C 700 ${880 - 60 * g} 1200 ${880 - 60 * g} 1640 680`} stroke={C.cyan} strokeWidth={10} fill="none" strokeDasharray={1600} strokeDashoffset={1600 * (1 - g)} style={{ filter: `drop-shadow(0 0 12px ${C.cyan})` }} />
          </svg>
          <Fade start={value + 20} style={{ position: "absolute", left: 420, top: 800 }}>
            <Pill size={34}>效率提升 · 降低单位成本</Pill>
          </Fade>
          <Fade start={value + 40} style={{ position: "absolute", left: 1060, top: 800 }}>
            <Pill size={34}>新增应用价值</Pill>
          </Fade>
        </>
      ) : null}
      <Fade start={at(s, 2, 0.1)} style={{ position: "absolute", left: 1220, top: 165 }}>
        <Card accent={C.white} style={{ width: 600, padding: "18px 28px" }}>
          <Text size={32} weight={700}>
            前提：效率与商业价值的提升
            <br />
            <span style={{ color: C.cyan }}>能覆盖新增投入</span>
          </Text>
        </Card>
      </Fade>
      {frame >= end ? (
        <Fade start={end} style={{ position: "absolute", left: 0, right: 0, top: 300, textAlign: "center" }}>
          <Pill size={36} color={C.white} style={{ background: "#0b1d38" }}>
            不只问需要多少算力 → 问算力创造多少<span style={{ color: C.cyan }}>可持续回报</span>
          </Pill>
        </Fade>
      ) : null}
    </AbsoluteFill>
  );
};

// ---------- 镜头20 增长与预期 ----------
export const Shot20: React.FC<SceneProps> = ({ s }) => {
  const L = s.lines[0].frames;
  const t0 = s.lines[0].from;
  const industry = useRamp(t0, Math.round(L * 0.15));
  const cross = useIn(t0 + Math.round(L * 0.18), 12);
  const exp = useRamp(t0 + Math.round(L * 0.3), 30);
  const act = useRamp(t0 + Math.round(L * 0.42), 30);
  const gap = useIn(t0 + Math.round(L * 0.55));
  const H = 380;
  return (
    <AbsoluteFill>
      <Badge>假设演示 · 无对应具体公司</Badge>
      <SceneHead start={0}>
        增长，<span style={{ color: C.orange }}>不等于超预期</span>
      </SceneHead>
      {/* 行业增长 ≠ 每只股票上涨 */}
      <div style={{ position: "absolute", left: 110, top: 320 }}>
        <Card style={{ width: 520, height: 470 }}>
          <Text size={32} color={C.muted}>
            行业增长
          </Text>
          <svg width={450} height={220}>
            <polyline
              points="0,200 90,170 180,150 270,100 360,70 450,20"
              fill="none"
              stroke={C.cyan}
              strokeWidth={8}
              strokeDasharray={600}
              strokeDashoffset={600 * (1 - industry)}
            />
          </svg>
          <div style={{ display: "flex", alignItems: "center", gap: 20, marginTop: 20 }}>
            <Text size={40} weight={800}>
              每只股票都涨？
            </Text>
            <div style={{ fontFamily: FONT, fontSize: 80, fontWeight: 900, color: C.orange, transform: `scale(${cross})` }}>✕</div>
          </div>
        </Card>
      </div>
      {/* 预期 vs 实际 */}
      <div style={{ position: "absolute", left: 760, top: 320, width: 560, height: 470 }}>
        {[
          { k: "市场预期", v: 60, t: exp, c: C.muted },
          { k: "实际利润增长", v: 30, t: act, c: C.cyan },
        ].map((b, i) => (
          <div key={b.k} style={{ position: "absolute", left: 40 + i * 270, bottom: 60, width: 200, textAlign: "center" }}>
            <Title size={60} color={b.c} style={{ marginBottom: 10, opacity: b.t }}>
              <Counter from={0} to={b.v} start={i === 0 ? t0 + Math.round(L * 0.3) : t0 + Math.round(L * 0.42)} suffix="%" />
            </Title>
            <div style={{ height: (H * b.v * b.t) / 60, background: b.c, borderRadius: "12px 12px 0 0", border: i === 0 ? `3px dashed ${C.white}88` : "none", opacity: i === 0 ? 0.5 : 1 }} />
            <Text size={30} weight={700} style={{ marginTop: 10, position: "absolute", bottom: -50, left: 0, right: 0 }}>
              {b.k}
            </Text>
          </div>
        ))}
      </div>
      <div style={{ position: "absolute", left: 1400, top: 400, opacity: gap, transform: `translateX(${(1 - gap) * 40}px)` }}>
        <Card accent={C.orange} glow={gap * 0.6} style={{ width: 460, textAlign: "center", padding: "26px 20px" }}>
          <Text size={32} color={C.muted}>
            预期差
          </Text>
          <Title size={100} color={C.orange}>
            -30pct
          </Title>
          <Text size={28} weight={700}>
            好消息，也可能推不动股价
          </Text>
        </Card>
      </div>
    </AbsoluteFill>
  );
};

// ---------- 镜头21 结论 ----------
const VERDICTS = [
  { k: "英伟达", v: "创新兑现客户价值", c: C.cyan },
  { k: "关键配套", v: "稀缺兑现交付", c: C.orange },
  { k: "算力运营商", v: "合同兑现回报", c: C.white },
];
export const Shot21: React.FC<SceneProps> = ({ s }) => {
  const frame = useCurrentFrame();
  const two = at(s, 0, 0.45);
  const cardsStart = at(s, 1, 0);
  const merge = useRamp(at(s, 2, 0.1), 30);
  return (
    <AbsoluteFill>
      <BackdropPhoto src="gen-abstract.png" opacity={0.5} />
      <Fade start={0} style={{ position: "absolute", left: 0, right: 0, top: 130, textAlign: "center" }}>
        <Text size={34} color={C.muted}>
          Andy 的结论
        </Text>
        <Title size={64}>AI 投资要同时看两件事</Title>
      </Fade>
      <div style={{ position: "absolute", left: 0, right: 0, top: 290, display: "flex", justifyContent: "center", gap: 60 }}>
        {["需求能否延续", "利润分配会不会改变"].map((b, i) => (
          <Fade key={b} start={two + i * 12}>
            <div style={{ border: `3px solid ${i === 0 ? C.cyan : C.orange}`, borderRadius: 20, padding: "14px 40px", background: "rgba(6,16,31,0.7)", boxShadow: merge > 0 ? `0 0 ${30 * merge}px ${i === 0 ? C.cyan : C.orange}` : "none" }}>
              <Title size={48}>{b}</Title>
            </div>
          </Fade>
        ))}
      </div>
      <div style={{ position: "absolute", left: 110, right: 110, top: 470, display: "flex", justifyContent: "space-between" }}>
        {VERDICTS.map((v, i) => (
          <Fade key={v.k} start={cardsStart + Math.round(s.lines[1].frames * i * 0.3)} style={{ transform: `translateY(${-merge * 20}px)` }}>
            <Card accent={v.c} style={{ width: 520, height: 230 }}>
              <Text size={36} color={v.c} weight={800}>
                {v.k}
              </Text>
              <Title size={54} style={{ marginTop: 10 }}>
                {v.v}
              </Title>
            </Card>
          </Fade>
        ))}
      </div>
      {frame >= at(s, 2, 0) ? (
        <Fade start={at(s, 2, 0.1)} style={{ position: "absolute", left: 0, right: 0, top: 760, textAlign: "center" }}>
          <Text size={40} weight={700}>
            优先研究：把竞争优势兑现为<span style={{ color: C.cyan }}>现金回报</span>的企业 → 再看股价要求它做到什么
          </Text>
        </Fade>
      ) : null}
    </AbsoluteFill>
  );
};

// ---------- 镜头22 财报验证 + 订阅 ----------
const CHECKS = ["毛利率守住了吗？", "订单变成回款了吗？", "增长需要追加多少资本？"];
export const Shot22: React.FC<SceneProps> = ({ s }) => {
  const frame = useCurrentFrame();
  const t0 = at(s, 0, 0.2);
  const shrink = useRamp(at(s, 1, 0), 30);
  const sub = useIn(at(s, 1, 0.15));
  return (
    <AbsoluteFill>
      <div
        style={{
          position: "absolute",
          left: interpolate(shrink, [0, 1], [460, 90]),
          top: interpolate(shrink, [0, 1], [180, 150]),
          transform: `scale(${interpolate(shrink, [0, 1], [1, 0.62])})`,
          transformOrigin: "top left",
        }}
      >
        <Text size={36} color={C.cyan} weight={800} style={{ marginBottom: 20 }}>
          用财报验证三件事
        </Text>
        {CHECKS.map((c, i) => {
          const on = frame >= t0 + Math.round(s.lines[0].frames * 0.22 * i);
          return (
            <Fade key={c} start={t0 + Math.round(s.lines[0].frames * 0.22 * i)} y={-30}>
              <Card glow={on ? 0.4 : 0} style={{ width: 1000, marginBottom: 24, display: "flex", alignItems: "center", gap: 30 }}>
                <div style={{ width: 70, height: 70, borderRadius: 35, background: C.cyan, color: C.bg, fontFamily: FONT, fontWeight: 900, fontSize: 40, display: "flex", alignItems: "center", justifyContent: "center" }}>
                  {i + 1}
                </div>
                <Title size={56}>{c}</Title>
              </Card>
            </Fade>
          );
        })}
      </div>
      {frame >= at(s, 1, 0) ? (
        <div style={{ position: "absolute", right: 140, top: 330, opacity: sub, transform: `translateY(${(1 - sub) * 40}px)` }}>
          <Card style={{ width: 760, textAlign: "center", padding: "40px 40px" }} glow={0.3}>
            <Title size={68}>
              Andy<span style={{ color: C.cyan }}>港美观察</span>
            </Title>
            <Text size={32} color={C.muted} style={{ marginTop: 14 }}>
              把大会判断与实际经营结果对照起来
            </Text>
            <div style={{ marginTop: 30, display: "inline-block", background: "#e2363b", color: "#fff", fontFamily: FONT, fontWeight: 800, fontSize: 40, padding: "14px 50px", borderRadius: 999 }}>
              订阅
            </div>
          </Card>
        </div>
      ) : null}
    </AbsoluteFill>
  );
};

// ---------- 镜头23 互动与结束 ----------
export const Shot23: React.FC<SceneProps> = ({ s }) => {
  const frame = useCurrentFrame();
  const end = at(s, 1, 0);
  const outQ = interpolate(frame, [end - 10, end + 5], [1, 0], clamp);
  const q = useIn(at(s, 0, 0.1));
  return (
    <AbsoluteFill>
      <div style={{ opacity: outQ }}>
        <Fade start={0} x={-50} y={0} style={{ position: "absolute", left: 90, top: 170 }}>
          <Clip src="cw-nvl72.mp4" rate={0.7} w={520} h={560} credit="GB200 NVL72（CoreWeave 官方视频）" />
          <div style={{ marginTop: 22, textAlign: "center" }}>
            <Pill size={40}>英伟达 · 系统优势</Pill>
          </div>
        </Fade>
        <Fade start={6} x={50} y={0} style={{ position: "absolute", right: 90, top: 170 }}>
          <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
            <Photo src="micron-hbm4.jpg" w={520} h={270} fit="cover" credit="Micron HBM4" />
            <Photo src="ibiden.png" w={520} h={270} fit="cover" credit="IBIDEN 封装载板" />
          </div>
          <div style={{ marginTop: 22, textAlign: "center" }}>
            <Pill size={40} color={C.orange}>
              存储与配套 · 定价权
            </Pill>
          </div>
        </Fade>
        <div style={{ position: "absolute", left: 660, right: 660, top: 260, textAlign: "center", opacity: q, transform: `scale(${0.8 + 0.2 * q})` }}>
          <div style={{ fontFamily: FONT, fontSize: 260, fontWeight: 900, color: C.white, lineHeight: 1, textShadow: `0 0 60px ${C.cyan}` }}>?</div>
          <Title size={50} style={{ marginTop: 20 }}>
            你更看好哪一边？
          </Title>
          <Text size={32} color={C.muted} style={{ marginTop: 16 }}>
            评论区说说你的理由
          </Text>
        </div>
      </div>
      {frame >= end - 5 ? (
        <Fade start={end} style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", paddingBottom: 120 }}>
          <Title size={120}>
            Andy<span style={{ color: C.cyan }}>港美观察</span>
          </Title>
          <Text size={36} color={C.muted} style={{ marginTop: 26 }}>
            以上为个人研究观点，不构成投资建议
          </Text>
          <Text size={30} color={C.muted} style={{ marginTop: 40, opacity: 0.8 }}>
            图片来源：NVIDIA、Google Cloud、Micron Technology、SK hynix、IBIDEN 官方；部分场景图为 AI 生成示意
          </Text>
        </Fade>
      ) : null}
    </AbsoluteFill>
  );
};
