// 本期镜头用到的小部件：都套在动效库的界面框架里（坐标是 1920×1080 设计稿），颜色只用主题 tone。
// 用了两期以上的再收进 _shared/motion。
import React from "react";
import { AbsoluteFill, Sequence, staticFile } from "remotion";
import {
  Canvas,
  Chip,
  Card,
  FootageCard,
  LAYOUT,
  LEAD,
  Media,
  Move,
  MotionFit,
  Num,
  Tag,
  Tone,
  camera,
  fitFont,
  clamp,
  ease,
  lerp,
  seg,
  toneColor,
  useMs,
  useTheme,
} from "../_shared/motion";

const FPS = 30;
export const P = (path: string) =>
  staticFile(`2026-10-google-q3-cards/${path}`);
const fr = (ms: number) => Math.round((ms / 1000) * FPS); // 负数 = 提前开始（镜头开头动效已经在走）

/** 从镜头里第 ms 毫秒开始（里面的动效时间也从这里算起） */
export const At: React.FC<{ ms: number; children: React.ReactNode }> = ({
  ms,
  children,
}) => (
  <Sequence from={fr(ms)} layout="none">
    {children}
  </Sequence>
);

/** 只在 [from, to) 毫秒内显示，进出 250ms 淡入淡出 */
export const Window: React.FC<{
  from?: number;
  to?: number;
  children: React.ReactNode;
}> = ({ from = -1000, to = 1e9, children }) => {
  const t = useMs();
  const o = clamp((t - from) / 250) * (1 - clamp((t - to) / 250));
  return <AbsoluteFill style={{ opacity: o }}>{children}</AbsoluteFill>;
};

/**
 * 有数字人圆圈的原文卡 / 图表镜头：内容区以右上角（1152, 300）为原点缩到 0.83，
 * 左边线从 112 让到 290、底边到 785，圆圈（x 40–270、y 814–1044）不压内容。
 */
export const HostSafe: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => (
  <AbsoluteFill
    style={{ transform: "scale(0.83)", transformOrigin: "1152px 300px" }}
  >
    {children}
  </AbsoluteFill>
);

/** 右侧栏小实拍卡（缩略图） */
export const SideThumb: React.FC<{
  src: string;
  startFrom?: number;
  move?: Move;
  spanMs?: number;
  at?: number;
  top?: number;
  caption?: string;
  w?: number;
}> = ({
  src,
  startFrom = 0,
  move = "in",
  spanMs = 6000,
  at = 300,
  top = LAYOUT.contentTop,
  caption,
  w = 500,
}) => (
  <Canvas>
    <FootageCard
      src={src}
      startFrom={startFrom}
      move={move}
      spanMs={spanMs}
      at={at}
      caption={caption}
      rect={{ x: LAYOUT.rightX, y: top, w, h: Math.round((w * 9) / 16) }}
    />
  </Canvas>
);

/** 一张实拍卡里切几刀（卡片只入场一次）：cuts[0] 是开头那段，后面每刀从 at 毫秒起盖上去 */
export const CutCard: React.FC<{
  cuts: { src: string; startFrom?: number; at: number; move?: Move }[];
  spanMs: number;
  caption?: string;
  rect?: { x: number; y: number; w: number; h: number };
}> = ({ cuts, spanMs, caption, rect }) => {
  const [first, ...rest] = cuts;
  const ends = cuts.map((c, i) =>
    i + 1 < cuts.length ? cuts[i + 1].at : spanMs,
  );
  return (
    <Canvas>
      <FootageCard
        src={first.src}
        startFrom={first.startFrom}
        move={first.move ?? "in"}
        spanMs={ends[0]}
        caption={caption}
        rect={rect}
      >
        {rest.map((c, i) => (
          <Sequence key={i} from={fr(c.at)} layout="none">
            <CutLayer
              src={c.src}
              startFrom={c.startFrom ?? 0}
              move={c.move ?? "left"}
              spanMs={ends[i + 1] - c.at}
            />
          </Sequence>
        ))}
      </FootageCard>
    </Canvas>
  );
};
const CutLayer: React.FC<{
  src: string;
  startFrom: number;
  move: Move;
  spanMs: number;
}> = ({ src, startFrom, move, spanMs }) => {
  const t = useMs();
  const th = useTheme();
  return (
    <div
      style={{
        position: "absolute",
        inset: 10,
        borderRadius: th.radius - 8,
        overflow: "hidden",
        background: "#0E1626",
      }}
    >
      <div
        style={{
          position: "absolute",
          inset: 0,
          transform: camera(move, ease.inOutCubic(clamp(t / spanMs)), 0.12),
        }}
      >
        <Media
          src={src}
          startFrom={startFrom}
          grade={false}
          style={{ inset: 0 }}
        />
      </div>
    </div>
  );
};

/** 右侧栏大号读数卡：数字滚动（from → to），可选 sub 和换算函数 */
export const CountCard: React.FC<{
  kicker: string;
  from: number;
  to: number;
  format: (v: number) => string;
  sub?: string;
  tone?: Tone;
  at?: number;
  dur?: number;
  top?: number;
}> = ({
  kicker,
  from,
  to,
  format,
  sub,
  tone = "ink",
  at = 0,
  dur = 1200,
  top = LAYOUT.contentTop,
}) => {
  const t = useMs();
  const th = useTheme();
  const a = seg(t, LEAD + at, 550);
  const q = seg(t, LEAD + at + 300, dur, ease.outQuart);
  const pop = seg(t, LEAD + at + 300 + dur, 300);
  return (
    <Canvas>
      <div
        style={{
          position: "absolute",
          left: LAYOUT.rightX,
          top,
          width: LAYOUT.rightW,
          height: LAYOUT.contentH,
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: "40px 48px",
          background: th.card,
          borderRadius: th.radius,
          boxShadow: th.shadow,
          border: `1px solid ${th.line}`,
          boxSizing: "border-box",
          opacity: a,
          transform: `translateX(${(1 - a) * 40}px)`,
        }}
      >
        <div
          style={{
            fontSize: 24,
            fontWeight: 700,
            letterSpacing: "0.08em",
            color: th.ink3,
          }}
        >
          {kicker}
        </div>
        <Num
          style={{
            fontSize: 120,
            color: toneColor(th, tone),
            marginTop: 8,
            transform: `scale(${1 + 0.05 * Math.sin(pop * Math.PI)})`,
            transformOrigin: "0 50%",
          }}
        >
          {format(lerp(from, to, q))}
        </Num>
        {sub ? (
          <div style={{ fontSize: 28, fontWeight: 600, color: th.ink2 }}>
            {sub}
          </div>
        ) : null}
      </div>
    </Canvas>
  );
};

/** 右侧栏读数卡，数字按口播换几次（每次换的时候轻轻翻一下） */
export const SwitchStat: React.FC<{
  kicker: string;
  steps: { at: number; value: string; sub?: string; tone?: Tone }[];
  top?: number;
}> = ({ kicker, steps, top = LAYOUT.contentTop }) => {
  const t = useMs();
  const th = useTheme();
  const a = seg(t, LEAD + Math.min(300, steps[0].at), 550);
  let i = 0;
  steps.forEach((s, k) => {
    if (t >= LEAD + s.at) i = k;
  });
  const cur = steps[i];
  const flip =
    t < LEAD + steps[0].at ? 0 : seg(t, LEAD + cur.at, 350, ease.outBack);
  return (
    <Canvas>
      <div
        style={{
          position: "absolute",
          left: LAYOUT.rightX,
          top,
          width: LAYOUT.rightW,
          height: LAYOUT.contentH,
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: "40px 48px",
          background: th.card,
          borderRadius: th.radius,
          boxShadow: th.shadow,
          border: `1px solid ${th.line}`,
          boxSizing: "border-box",
          opacity: a,
          transform: `translateX(${(1 - a) * 40}px)`,
        }}
      >
        <div
          style={{
            fontSize: 24,
            fontWeight: 700,
            letterSpacing: "0.08em",
            color: th.ink3,
          }}
        >
          {kicker}
        </div>
        <Num
          style={{
            fontSize: fitFont(cur.value, LAYOUT.rightW - 96, 120),
            whiteSpace: "nowrap",
            color: toneColor(th, cur.tone ?? "ink"),
            marginTop: 8,
            opacity: flip,
            transform: `translateY(${(1 - flip) * 20}px)`,
          }}
        >
          {cur.value}
        </Num>
        {cur.sub ? (
          <div
            style={{
              fontSize: 28,
              fontWeight: 600,
              color: th.ink2,
              opacity: flip,
            }}
          >
            {cur.sub}
          </div>
        ) : null}
      </div>
    </Canvas>
  );
};

/** 内容区里的结论句：逐行升入，琥珀底纹扫过 mark */
export const SweepText: React.FC<{
  lines: { before?: string; mark?: string; after?: string }[];
  top?: number;
  size?: number;
  at?: number;
}> = ({ lines, top = LAYOUT.contentTop + 20, size = 72, at = 0 }) => {
  const t = useMs();
  const th = useTheme();
  return (
    <Canvas>
      {lines.map((l, i) => {
        const a = seg(t, LEAD + at + i * 300, 500, ease.outQuart);
        const q = seg(t, LEAD + at + 700 + i * 450, 500, ease.inOutCubic);
        return (
          <div
            key={i}
            style={{
              position: "absolute",
              left: LAYOUT.left,
              top: top + i * size * 1.35,
              fontSize: size,
              fontWeight: 800,
              letterSpacing: "-0.02em",
              whiteSpace: "nowrap",
              color: th.ink,
              opacity: a,
              transform: `translateY(${(1 - a) * 24}px)`,
            }}
          >
            {l.before}
            {l.mark ? (
              <span style={{ position: "relative", display: "inline-block" }}>
                <span
                  style={{
                    position: "absolute",
                    left: -6,
                    right: -6,
                    bottom: size * 0.06,
                    height: size * 0.42,
                    background: th.amber,
                    opacity: 0.35,
                    borderRadius: 6,
                    transform: `scaleX(${q})`,
                    transformOrigin: "0 50%",
                  }}
                />
                <span style={{ position: "relative" }}>{l.mark}</span>
              </span>
            ) : null}
            {l.after}
          </div>
        );
      })}
    </Canvas>
  );
};

/** 实拍卡左上角的结论标签 */
export const CardTag: React.FC<{
  x: number;
  y?: number;
  tone: Tone;
  at?: number;
  children: React.ReactNode;
}> = ({ x, y = LAYOUT.contentTop + 28, tone, at = 900, children }) => (
  <Canvas>
    <div style={{ position: "absolute", left: x, top: y }}>
      <Tag tone={tone} solid size={28} at={at}>
        {children}
      </Tag>
    </div>
  </Canvas>
);
/** split-media 两张卡时，第二张卡的左边线 */
export const SPLIT_X2 =
  LAYOUT.left + (LAYOUT.contentW + LAYOUT.rightW - 40) / 2 + 40;

/** 圆窗转场：卡片里的画面从圆窗露出下一段画面，0.9 秒内接管整张卡 */
export const IrisCard: React.FC<{
  src: string;
  startFrom?: number;
  next: string;
  at: number;
  spanMs: number;
  caption?: string;
  nextCaption?: string;
}> = ({ src, startFrom = 0, next, at, spanMs, caption, nextCaption }) => (
  <Canvas>
    <FootageCard
      src={src}
      startFrom={startFrom}
      move="in"
      spanMs={spanMs}
      caption={caption}
    >
      <Sequence from={fr(at)} layout="none">
        <IrisLayer next={next} caption={nextCaption} />
      </Sequence>
    </FootageCard>
  </Canvas>
);
const IrisLayer: React.FC<{ next: string; caption?: string }> = ({
  next,
  caption,
}) => {
  const t = useMs();
  const th = useTheme();
  const q = seg(t, 0, 900, ease.inOutCubic);
  return (
    <div
      style={{
        position: "absolute",
        inset: 10,
        borderRadius: th.radius - 8,
        overflow: "hidden",
        clipPath: `circle(${lerp(0, 1200, q)}px at 70% 50%)`,
      }}
    >
      <div
        style={{
          position: "absolute",
          inset: 0,
          transform: camera("in", clamp(t / 4000), 0.08),
        }}
      >
        <Media src={next} grade={false} style={{ inset: 0 }} />
      </div>
      {caption ? (
        <div style={{ position: "absolute", right: 20, bottom: 18 }}>
          <Chip fg={th.ink} bg={th.cardSoft} style={{ fontSize: 20 }}>
            {caption}
          </Chip>
        </div>
      ) : null}
    </div>
  );
};

/** 标尺换刻度：一条标尺两端两种公司，游标从左滑到右（4.5 "the market is switching the ruler"） */
export const RulerSwitch: React.FC<{
  left: string;
  leftSub: string;
  right: string;
  rightSub: string;
  at?: number;
}> = ({ left, leftSub, right, rightSub, at = 0 }) => {
  const t = useMs();
  const th = useTheme();
  const a = seg(t, LEAD, 500);
  const q = seg(t, LEAD + at, 1400, ease.inOutCubic);
  const x0 = 80;
  const x1 = 960;
  const Y = 270;
  const x = lerp(x0, x1, q);
  const ticks = Array.from({ length: 23 }, (_, i) => x0 + (i * (x1 - x0)) / 22);
  return (
    <Canvas>
      <Card
        style={{
          left: LAYOUT.left,
          top: LAYOUT.contentTop,
          width: LAYOUT.contentW,
          height: LAYOUT.contentH,
          opacity: a,
          transform: `translateY(${(1 - a) * 30}px)`,
        }}
      >
        <svg
          width={LAYOUT.contentW}
          height={LAYOUT.contentH}
          style={{ position: "absolute", left: 0, top: 0 }}
        >
          <line
            x1={x0}
            y1={Y}
            x2={x1}
            y2={Y}
            stroke={th.ph}
            strokeWidth={6}
            strokeLinecap="round"
          />
          {ticks.map((tx, i) => (
            <line
              key={i}
              x1={tx}
              y1={i % 11 === 0 ? Y - 32 : Y - 16}
              x2={tx}
              y2={Y + 16}
              stroke={th.ph}
              strokeWidth={3}
            />
          ))}
          <line
            x1={x0}
            y1={Y}
            x2={x}
            y2={Y}
            stroke={toneColor(th, "amber")}
            strokeWidth={6}
            strokeLinecap="round"
          />
          <circle
            cx={x}
            cy={Y}
            r={30}
            fill={th.card}
            stroke={toneColor(th, "amber")}
            strokeWidth={6}
          />
        </svg>
        <div
          style={{
            position: "absolute",
            left: 50,
            top: 350,
            width: 440,
            opacity: 1 - 0.55 * q,
          }}
        >
          <div
            style={{
              fontSize: 46,
              fontWeight: 800,
              color: th.ink,
              lineHeight: 1.1,
            }}
          >
            {left}
          </div>
          <div
            style={{
              fontSize: 28,
              fontWeight: 600,
              color: th.ink3,
              marginTop: 10,
            }}
          >
            {leftSub}
          </div>
        </div>
        <div
          style={{
            position: "absolute",
            right: 50,
            top: 350,
            width: 460,
            textAlign: "right",
            opacity: 0.45 + 0.55 * q,
          }}
        >
          <div
            style={{
              fontSize: 46,
              fontWeight: 800,
              color: toneColor(th, "amber"),
              lineHeight: 1.1,
            }}
          >
            {right}
          </div>
          <div
            style={{
              fontSize: 28,
              fontWeight: 600,
              color: th.ink3,
              marginTop: 10,
            }}
          >
            {rightSub}
          </div>
        </div>
        <div
          style={{
            position: "absolute",
            left: 50,
            top: 70,
            fontSize: 26,
            fontWeight: 700,
            letterSpacing: "0.08em",
            color: th.ink3,
          }}
        >
          HOW THE MARKET VALUES GOOGLE
        </div>
      </Card>
    </Canvas>
  );
};

/** 内容区里的一列勾选条目（逐条打勾） */
export const CheckList: React.FC<{
  title: string;
  items: { text: string; at: number }[];
  tone?: Tone;
  height?: number;
}> = ({ title, items, tone = "blue", height = LAYOUT.contentH }) => {
  const t = useMs();
  const th = useTheme();
  const a = seg(t, LEAD, 500);
  const col = toneColor(th, tone);
  return (
    <Canvas>
      <Card
        style={{
          left: LAYOUT.left,
          top: LAYOUT.contentTop,
          width: LAYOUT.contentW,
          height,
          padding: "40px 48px",
          opacity: a,
          transform: `translateY(${(1 - a) * 30}px)`,
        }}
      >
        <div
          style={{
            fontSize: 24,
            fontWeight: 700,
            letterSpacing: "0.08em",
            color: th.ink3,
          }}
        >
          {title}
        </div>
        {items.map((it, i) => {
          const q = seg(t, LEAD + it.at, 400);
          const c = seg(t, LEAD + it.at + 250, 300, ease.outBack);
          return (
            <div
              key={i}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 24,
                marginTop: i ? 22 : 30,
                opacity: 0.25 + 0.75 * q,
              }}
            >
              <div
                style={{
                  width: 52,
                  height: 52,
                  borderRadius: "50%",
                  border: `4px solid ${c > 0 ? col : th.ph}`,
                  background: c > 0 ? col : "transparent",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flex: "none",
                  transform: `scale(${lerp(0.7, 1, c)})`,
                }}
              >
                {c > 0 ? (
                  <svg
                    width={28}
                    height={28}
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="#fff"
                    strokeWidth={3.4}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path
                      d="M5 12.5l4.5 4.5L19 7.5"
                      strokeDasharray={24}
                      strokeDashoffset={24 * (1 - clamp(c))}
                    />
                  </svg>
                ) : null}
              </div>
              <div
                style={{
                  fontSize: 36,
                  fontWeight: 700,
                  color: th.ink,
                  whiteSpace: "nowrap",
                }}
              >
                {it.text}
              </div>
            </div>
          );
        })}
      </Card>
    </Canvas>
  );
};

/** 片尾：左边两块干净的 16:9 空白区给 YouTube 片尾元素（推荐视频）用，右边订阅卡 + 免责声明 */
export const EndScreen: React.FC = () => {
  const t = useMs();
  const th = useTheme();
  const slots = [LAYOUT.left, LAYOUT.left + 580];
  return (
    <Canvas>
      {slots.map((x, i) => (
        <div
          key={i}
          style={{
            position: "absolute",
            left: x,
            top: LAYOUT.contentTop + 40,
            width: 540,
            height: 304,
            borderRadius: th.radius,
            background: th.ph2,
            opacity: 0.55 * seg(t, LEAD + i * 150, 600),
          }}
        />
      ))}
      <Card
        style={{
          left: LAYOUT.left + 1180,
          top: LAYOUT.contentTop,
          width: 460,
          height: 400,
          padding: "48px 40px",
          opacity: seg(t, LEAD + 300, 600),
        }}
      >
        <div
          style={{
            fontSize: 22,
            fontWeight: 700,
            letterSpacing: "0.08em",
            color: th.ink3,
          }}
        >
          ANDY&apos;S MARKET LENS
        </div>
        <div
          style={{
            fontSize: 46,
            fontWeight: 800,
            color: th.ink,
            marginTop: 14,
            lineHeight: 1.1,
          }}
        >
          Beyond the headlines. Into the numbers.
        </div>
        <div
          style={{
            marginTop: 34,
            display: "inline-block",
            padding: "16px 34px",
            borderRadius: 999,
            background: toneColor(th, "red"),
            color: "#fff",
            fontSize: 30,
            fontWeight: 800,
          }}
        >
          Subscribe
        </div>
      </Card>
      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          top: 790,
          textAlign: "center",
          fontSize: 24,
          fontWeight: 600,
          color: th.ink3,
          opacity: seg(t, LEAD + 600, 600),
        }}
      >
        For educational and informational purposes only. Not financial advice.
      </div>
    </Canvas>
  );
};

/** 3.10 前半段：cash-path 放大到 0.92（最小字 22px），卡片顶到内容区 y 300、底到 944 */
export const BigFlow: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const s = 0.92;
  return (
    <AbsoluteFill
      style={{
        transformOrigin: "0 0",
        transform: `translate(${112 - 112 * s}px, ${300 - 220 * s}px) scale(${s})`,
      }}
    >
      {children}
    </AbsoluteFill>
  );
};

/**
 * 动效库的整屏动作（1696 宽卡片）按卡片实际范围放进内容区：卡片左右对齐 112–1808，顶边 300，高不超过 maxH。
 * MotionFit 会把它缩进左栏 1040 宽，小字不到 22px；用这个时读数卡改放标题行（NoteCard 默认位置）。
 */
export const FitWide: React.FC<{
  top: number;
  height: number;
  maxH?: number;
  children: React.ReactNode;
}> = ({ top, height, maxH = 590, children }) => {
  const s = Math.min(1, maxH / height);
  return (
    <AbsoluteFill
      style={{
        transformOrigin: `960px ${top}px`,
        transform: `translateY(${LAYOUT.contentTop - top}px) scale(${s})`,
      }}
    >
      <MotionFit on={false}>{children}</MotionFit>
    </AbsoluteFill>
  );
};

/** 镜头最后一段推近：把屏幕上 (px, py) 那一行推到 (cx, cy)、放大 k 倍；推近后画面裁在内容区里（不碰标题、圆圈和字幕） */
export const PushIn: React.FC<{
  at: number;
  px: number;
  py: number;
  k: number;
  cx?: number;
  cy?: number;
  clip?: string;
  children: React.ReactNode;
}> = ({
  at,
  px,
  py,
  k,
  cx = 960,
  cy = 550,
  clip = "inset(300px 112px 280px 112px round 28px)",
  children,
}) => {
  const t = useMs();
  const q = seg(t, at, 800, ease.inOutCubic);
  const s = lerp(1, k, q);
  const tx = lerp(px, cx, q) - s * px;
  const ty = lerp(py, cy, q) - s * py;
  return (
    <AbsoluteFill style={{ clipPath: q > 0 ? clip : undefined }}>
      <AbsoluteFill
        style={{
          transformOrigin: "0 0",
          transform: `translate(${tx}px, ${ty}px) scale(${s})`,
        }}
      >
        {children}
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

/** 一排结论小卡（8.3 熊市理由）：占满内容区宽度，数值不折行、按卡宽缩字 */
export const TileRow: React.FC<{
  items: { label: string; value: string; tone?: Tone; at: number }[];
  top?: number;
  height?: number;
}> = ({ items, top = LAYOUT.contentTop, height = LAYOUT.contentH }) => {
  const t = useMs();
  const th = useTheme();
  const n = items.length;
  const gap = 28;
  const w = (1696 - gap * (n - 1)) / n;
  return (
    <Canvas>
      {items.map((it, i) => {
        const a = seg(t, LEAD + it.at, 520, ease.outQuart);
        return (
          <Card
            key={i}
            style={{
              left: LAYOUT.left + i * (w + gap),
              top,
              width: w,
              height,
              padding: "40px 34px",
              display: "flex",
              flexDirection: "column",
              opacity: a,
              transform: `translateY(${(1 - a) * 30}px)`,
            }}
          >
            <div
              style={{
                fontSize: 24,
                fontWeight: 700,
                letterSpacing: "0.08em",
                color: th.ink3,
                whiteSpace: "nowrap",
              }}
            >
              {it.label}
            </div>
            <Num
              style={{
                fontSize: Math.min(96, (w - 68) / (it.value.length * 0.66)),
                color: toneColor(th, it.tone ?? "ink"),
                margin: "auto 0",
                whiteSpace: "nowrap",
              }}
            >
              {it.value}
            </Num>
          </Card>
        );
      })}
    </Canvas>
  );
};

// ───────── 统一版式（2026-10-30 第二轮）：内容区 = 左卡 1040×585 + 右栏 616×585，或通栏 1696×585 ─────────
type Rect = { x: number; y: number; w: number; h: number };
export const R_MAIN: Rect = { x: 112, y: 300, w: 1040, h: 585 };
export const R_SIDE: Rect = { x: 1192, y: 300, w: 616, h: 585 };
export const R_WIDE: Rect = { x: 112, y: 300, w: 1696, h: 585 };
/** 有数字人圆圈（左下角 y ≥ 814）的图表镜头：内容底边收到 800 */
export const hostSafe = (r: Rect): Rect => ({ ...r, h: Math.min(r.h, 500) });

/**
 * 把动效库动作的卡片范围 src（1920 设计稿坐标）等比放进 dst：顶边对齐、水平居中。
 * 动效库原本按整屏 1696 宽设计，MotionFit 会缩进 1040 左栏、字太小；这里按卡片实际范围放大。
 */
export const Fit: React.FC<{
  src: Rect;
  dst?: Rect;
  max?: number;
  children: React.ReactNode;
}> = ({ src, dst = R_MAIN, max = 1.25, children }) => {
  const s = Math.min(max, dst.w / src.w, dst.h / src.h);
  const x = dst.x + (dst.w - src.w * s) / 2;
  return (
    <AbsoluteFill
      style={{
        transformOrigin: "0 0",
        transform: `translate(${x - src.x * s}px, ${dst.y - src.y * s}px) scale(${s})`,
      }}
    >
      <MotionFit on={false}>{children}</MotionFit>
    </AbsoluteFill>
  );
};

/** 主内容预卷 0.4 秒：镜头一开始卡片已经在、内容已开始出现（内容区空白不超过 0.5 秒） */
export const soon = (ms: number) => Math.min(ms, -400);

/**
 * 右栏说明卡（铺满 616×585）：kicker + 几条要点，每条到点亮起（之前淡显）；value 给了就是大号读数。
 * 代替原来浮在右上角的小 NoteCard，右栏下方不再留空。
 */
export const SidePanel: React.FC<{
  kicker?: string;
  items: {
    title: string;
    sub?: string;
    value?: string;
    tone?: Tone;
    at: number;
  }[];
  rect?: Rect;
  at?: number;
}> = ({ kicker, items, rect = R_SIDE, at = 300 }) => {
  const t = useMs();
  const th = useTheme();
  const a = seg(t, LEAD + at, 550);
  const W = rect.w - 96;
  return (
    <Canvas>
      <div
        style={{
          position: "absolute",
          left: rect.x,
          top: rect.y,
          width: rect.w,
          height: rect.h,
          padding: "40px 48px",
          boxSizing: "border-box",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          gap: 34,
          background: th.card,
          borderRadius: th.radius,
          boxShadow: th.shadow,
          border: `1px solid ${th.line}`,
          opacity: a,
          transform: `translateX(${(1 - a) * 40}px)`,
        }}
      >
        {kicker ? (
          <div
            style={{
              fontSize: 24,
              fontWeight: 700,
              letterSpacing: "0.08em",
              color: th.ink3,
            }}
          >
            {kicker}
          </div>
        ) : null}
        {items.map((it, i) => {
          const q = seg(t, LEAD + it.at, 450, ease.outQuart);
          return (
            <div
              key={i}
              style={{
                opacity: 0.22 + 0.78 * q,
                transform: `translateY(${(1 - q) * 10}px)`,
              }}
            >
              {it.value ? (
                <Num
                  style={{
                    fontSize: fitFont(it.value, W, 120),
                    color: toneColor(th, it.tone ?? "ink"),
                    whiteSpace: "nowrap",
                    lineHeight: 1.05,
                  }}
                >
                  {it.value}
                </Num>
              ) : null}
              <div
                style={{
                  fontSize: it.value ? 32 : fitFont(it.title, W * 1.15, 40),
                  fontWeight: 800,
                  color: it.value ? th.ink2 : toneColor(th, it.tone ?? "ink"),
                  lineHeight: 1.2,
                  marginTop: it.value ? 6 : 0,
                }}
              >
                {it.title}
              </div>
              {it.sub ? (
                <div
                  style={{
                    fontSize: 26,
                    fontWeight: 600,
                    color: th.ink3,
                    marginTop: 6,
                    lineHeight: 1.25,
                  }}
                >
                  {it.sub}
                </div>
              ) : null}
            </div>
          );
        })}
      </div>
    </Canvas>
  );
};

/** 右栏整栏实拍卡（616×585），结论句镜头用 */
export const FullThumb: React.FC<{
  src: string;
  startFrom?: number;
  move?: Move;
  spanMs: number;
  caption?: string;
  at?: number;
}> = ({ src, startFrom = 0, move = "in", spanMs, caption, at = 200 }) => (
  <Canvas>
    <FootageCard
      src={src}
      startFrom={startFrom}
      move={move}
      spanMs={spanMs}
      at={at}
      caption={caption}
      rect={R_SIDE}
    />
  </Canvas>
);

/** 章节卡右栏：大号章节号 + 章节名 */
export const ChapterPanel: React.FC<{
  num: string;
  name: string;
  sub?: string;
}> = ({ num, name, sub }) => {
  const t = useMs();
  const th = useTheme();
  const a = seg(t, LEAD + 250, 600, ease.outQuart);
  return (
    <Canvas>
      <div
        style={{
          position: "absolute",
          left: R_SIDE.x,
          top: R_SIDE.y,
          width: R_SIDE.w,
          height: R_SIDE.h,
          padding: "48px 52px",
          boxSizing: "border-box",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          background: th.card,
          borderRadius: th.radius,
          boxShadow: th.shadow,
          border: `1px solid ${th.line}`,
          opacity: a,
          transform: `translateX(${(1 - a) * 40}px)`,
        }}
      >
        <div
          style={{
            fontSize: 24,
            fontWeight: 700,
            letterSpacing: "0.12em",
            color: th.ink3,
          }}
        >
          CHAPTER
        </div>
        <Num style={{ fontSize: 200, color: th.teal, lineHeight: 1 }}>
          {num}
        </Num>
        <div
          style={{
            fontSize: fitFont(name, 560, 52),
            fontWeight: 800,
            color: th.ink,
            lineHeight: 1.1,
            marginTop: 10,
          }}
        >
          {name}
        </div>
        {sub ? (
          <div
            style={{
              fontSize: 28,
              fontWeight: 600,
              color: th.ink3,
              marginTop: 14,
            }}
          >
            {sub}
          </div>
        ) : null}
      </div>
    </Canvas>
  );
};

/** 通栏两张并排读数卡（3.8 "Two places"） */
export const ReadoutPair: React.FC<{
  items: {
    kicker: string;
    value: string;
    sub?: string;
    tone?: Tone;
    at: number;
  }[];
  rect?: Rect;
}> = ({ items, rect = R_WIDE }) => {
  const t = useMs();
  const th = useTheme();
  const w = (rect.w - 40) / 2;
  return (
    <Canvas>
      {items.map((it, i) => {
        const a = seg(t, LEAD + it.at, 600, ease.outQuart);
        return (
          <Card
            key={i}
            style={{
              left: rect.x + i * (w + 40),
              top: rect.y,
              width: w,
              height: rect.h,
              padding: rect.w < 1200 ? "48px 40px" : "56px 64px",
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              opacity: a,
              transform: `translateY(${(1 - a) * 30}px)`,
            }}
          >
            <div
              style={{
                fontSize: 30,
                fontWeight: 800,
                letterSpacing: "0.08em",
                color: th.ink3,
              }}
            >
              {it.kicker}
            </div>
            <Num
              style={{
                fontSize: fitFont(
                  it.value,
                  w - (rect.w < 1200 ? 80 : 128),
                  170,
                ),
                color: toneColor(th, it.tone ?? "ink"),
                whiteSpace: "nowrap",
                marginTop: 12,
              }}
            >
              {it.value}
            </Num>
            <div
              style={{
                fontSize: 34,
                fontWeight: 600,
                color: th.ink2,
                marginTop: 12,
              }}
            >
              {it.sub}
            </div>
          </Card>
        );
      })}
    </Canvas>
  );
};

/** 片尾前一镜右栏：频道名 + 订阅 */
export const SubscribePanel: React.FC<{ at?: number }> = ({ at = 300 }) => {
  const t = useMs();
  const th = useTheme();
  const a = seg(t, LEAD + at, 600, ease.outQuart);
  return (
    <Canvas>
      <Card
        style={{
          left: R_SIDE.x,
          top: R_SIDE.y,
          width: R_SIDE.w,
          height: R_SIDE.h,
          padding: "56px 52px",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          opacity: a,
          transform: `translateX(${(1 - a) * 40}px)`,
        }}
      >
        <div
          style={{
            fontSize: 24,
            fontWeight: 700,
            letterSpacing: "0.08em",
            color: th.ink3,
          }}
        >
          ANDY&apos;S MARKET LENS
        </div>
        <div
          style={{
            fontSize: 58,
            fontWeight: 800,
            color: th.ink,
            marginTop: 18,
            lineHeight: 1.08,
          }}
        >
          Beyond the headlines. Into the numbers.
        </div>
        <div
          style={{
            marginTop: 44,
            alignSelf: "flex-start",
            padding: "18px 40px",
            borderRadius: 999,
            background: toneColor(th, "red"),
            color: "#fff",
            fontSize: 34,
            fontWeight: 800,
          }}
        >
          Like &amp; subscribe
        </div>
      </Card>
    </Canvas>
  );
};
