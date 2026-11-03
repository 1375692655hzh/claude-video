// 实拍卡类：照片、视频、财报原文都装进框架里的大圆角卡片（左侧内容区，1040×585），
// 数字和标签放在卡片上或右侧栏。画面始终是参考图那套界面，靠真实画面 + 跟口播走的动作去掉"翻幻灯片"感。
// 和 frame.tsx 的 <Frame>、<Heading>、<NoteCard> 搭配使用。
import React, { createContext, useContext } from "react";
import { Canvas, Chip, Media, Num, polyLength, polyPath } from "./ui";
import { LAYOUT } from "./frame";
import { Tone, toneColor, useTheme } from "./theme";
import { LEAD, clamp, ease, lerp, seg, useMs } from "./time";

export type Move = "in" | "out" | "left" | "right" | "up" | "down" | "none";
/** 卡片里的镜头运动：in 推近、out 拉远、left/right/up/down 平移 */
export const camera = (move: Move, p: number, amount = 0.08): string => {
  if (move === "none") return "none";
  const z =
    move === "out"
      ? 1 + amount - amount * p
      : move === "in"
        ? 1 + amount * p
        : 1 + amount;
  const d = amount * 50 * (p - 0.5) * 2;
  const x = move === "left" ? -d : move === "right" ? d : 0;
  const y = move === "up" ? -d : move === "down" ? d : 0;
  return `scale(${z}) translate(${x}%, ${y}%)`;
};

type Rect = { x: number; y: number; w: number; h: number };

/**
 * 右侧数字栏铺满内容区高度（585）、宽度用满右侧栏，数值按栏宽缩字不出框。
 * 默认关（旧期数版式不变）；整片外层包 <PanelFill> 打开。
 */
const PanelCtx = createContext(false);
export const PanelFill: React.FC<{
  on?: boolean;
  children: React.ReactNode;
}> = ({ on = true, children }) => (
  <PanelCtx.Provider value={on}>{children}</PanelCtx.Provider>
);
export const usePanelFill = () => useContext(PanelCtx);
/** 按宽度给数字定字号：粗体数字每字约 0.62 em */
export const fitFont = (text: string, width: number, max: number) =>
  Math.min(max, Math.floor(width / (Math.max(1, text.length) * 0.62)));
const MAIN: Rect = {
  x: LAYOUT.left,
  y: LAYOUT.contentTop,
  w: LAYOUT.contentW,
  h: LAYOUT.contentH,
};

/** 实拍卡：白边圆角卡片，里面的画面带镜头运动；入场时上浮落位 */
export const FootageCard: React.FC<{
  src?: string;
  startFrom?: number;
  move?: Move;
  spanMs?: number;
  rect?: Rect;
  at?: number;
  caption?: string; // 卡片右下角的小标签（地点 / 来源）；左下角留给数字人头像
  children?: React.ReactNode; // 卡片上的叠加物（钉标签等），坐标以卡片左上角为原点
}> = ({
  src,
  startFrom = 0,
  move = "in",
  spanMs = 5000,
  rect = MAIN,
  at = 0,
  caption,
  children,
}) => {
  const t = useMs();
  const th = useTheme();
  const a = seg(t, LEAD + at, 600);
  return (
    <div
      style={{
        position: "absolute",
        left: rect.x,
        top: rect.y,
        width: rect.w,
        height: rect.h,
        borderRadius: th.radius,
        background: th.card,
        padding: 10,
        boxSizing: "border-box",
        boxShadow: "0 18px 44px rgba(20,27,45,0.12)",
        opacity: a,
        transform: `translateY(${(1 - a) * 40}px) scale(${lerp(0.97, 1, a)})`,
      }}
    >
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
            transform: camera(move, ease.inOutCubic(clamp(t / spanMs))),
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
      {caption ? (
        <div
          style={{
            position: "absolute",
            right: 30,
            bottom: 28,
            opacity: seg(t, LEAD + at + 600, 400),
          }}
        >
          <Chip fg={th.ink} bg={th.cardSoft} style={{ fontSize: 20 }}>
            {caption}
          </Chip>
        </div>
      ) : null}
      {children}
    </div>
  );
};

export type StatCardProps = {
  kicker: string;
  value: string;
  sub?: string;
  tone?: Tone;
  extra?: { value: string; label: string; tone?: Tone }[];
};
const StatCard: React.FC<StatCardProps & { at: number; y: number }> = ({
  kicker,
  value,
  sub,
  tone = "ink",
  extra = [],
  at,
  y,
}) => {
  const t = useMs();
  const th = useTheme();
  const fill = usePanelFill();
  const a = seg(t, LEAD + at, 550);
  const W = fill ? LAYOUT.rightW : LAYOUT.rightW - 120;
  return (
    <div
      style={{
        position: "absolute",
        left: LAYOUT.rightX,
        top: y,
        width: W,
        ...(fill
          ? {
              height: LAYOUT.contentH,
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
            }
          : {}),
        padding: fill ? "40px 48px" : "34px 40px",
        background: th.card,
        borderRadius: th.radius,
        boxShadow: th.shadow,
        border: `1px solid ${th.line}`,
        opacity: a,
        transform: `translateX(${(1 - a) * 40}px)`,
        boxSizing: "border-box",
      }}
    >
      <div
        style={{
          fontSize: fill ? 24 : 22,
          fontWeight: 700,
          letterSpacing: "0.08em",
          color: th.ink3,
        }}
      >
        {kicker}
      </div>
      <Num
        style={{
          fontSize: fill
            ? fitFont(value, W - 96, 120)
            : value.length > 8
              ? 76
              : 104,
          color: toneColor(th, tone),
          marginTop: 8,
          whiteSpace: fill ? "nowrap" : undefined,
          opacity: seg(t, LEAD + at + 250, 300),
        }}
      >
        {value}
      </Num>
      {sub ? (
        <div
          style={{
            fontSize: fill ? 28 : 26,
            fontWeight: 600,
            color: th.ink2,
            lineHeight: 1.25,
          }}
        >
          {sub}
        </div>
      ) : null}
      {extra.length ? (
        <div
          style={{
            marginTop: fill ? 34 : 22,
            borderTop: `1px solid ${th.line}`,
            paddingTop: 18,
          }}
        >
          {extra.map((e, i) => {
            const q = seg(t, LEAD + at + 700 + i * 250, 400);
            return (
              <div
                key={i}
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "baseline",
                  padding: "6px 0",
                  opacity: q,
                  transform: `translateY(${(1 - q) * 12}px)`,
                }}
              >
                <div
                  style={{
                    fontSize: fill ? 26 : 24,
                    fontWeight: 600,
                    color: th.ink3,
                    whiteSpace: "nowrap",
                    marginRight: 16,
                  }}
                >
                  {e.label}
                </div>
                <div
                  style={{
                    fontSize: fill
                      ? fitFont(e.value, W - 96 - e.label.length * 15, 44)
                      : 40,
                    fontWeight: 800,
                    color: toneColor(th, e.tone ?? "ink"),
                    whiteSpace: "nowrap",
                  }}
                >
                  {e.value}
                </div>
              </div>
            );
          })}
        </div>
      ) : null}
    </div>
  );
};

export type FootageStatProps = {
  src?: string;
  startFrom?: number;
  move?: Move;
  spanMs?: number;
  caption?: string;
  kicker?: string;
  value?: string;
  sub?: string;
  tone?: Tone;
  extra?: { value: string; label: string; tone?: Tone }[];
};
/** footage-stat：左侧实拍卡 + 右侧数字卡。数字和画面同时在屏上，不再单独切一页数字 */
export const FootageStat: React.FC<FootageStatProps> = ({
  src,
  startFrom = 0,
  move = "in",
  spanMs = 5000,
  caption = "New Albany, Ohio · Image: Google",
  kicker = "GOOGLE CLOUD · Q3",
  value = "+103%",
  sub = "revenue growth, year over year",
  tone = "teal",
  extra = [],
}) => (
  <Canvas>
    <FootageCard
      src={src}
      startFrom={startFrom}
      move={move}
      spanMs={spanMs}
      caption={caption}
    />
    <StatCard
      kicker={kicker}
      value={value}
      sub={sub}
      tone={tone}
      extra={extra}
      at={450}
      y={LAYOUT.contentTop}
    />
  </Canvas>
);

export type PinLabelProps = {
  src?: string;
  startFrom?: number;
  move?: Move;
  spanMs?: number;
  caption?: string;
  pins?: {
    x: number;
    y: number;
    dx?: number;
    dy?: number;
    label: string;
    value?: string;
    tone?: Tone;
    at?: number;
  }[];
};
/** pin-label：在实拍卡里的具体物体上钉标签（坐标以卡片左上角为原点，卡片 1040×585），标签可以伸出卡片到右侧留白处 */
export const PinLabel: React.FC<PinLabelProps> = ({
  src,
  startFrom = 0,
  move = "right",
  spanMs = 5000,
  caption = "Ironwood superpod · Image: Google",
  pins = [
    {
      x: 520,
      y: 300,
      dx: 300,
      dy: -150,
      label: "TPU systems",
      value: "built first",
      tone: "amber",
      at: 0,
    },
    {
      x: 760,
      y: 420,
      dx: 400,
      dy: 60,
      label: "Inventory",
      value: "$2.4B → $13.3B",
      tone: "red",
      at: 700,
    },
  ],
}) => {
  const t = useMs();
  const th = useTheme();
  const ox = LAYOUT.left;
  const oy = LAYOUT.contentTop;
  return (
    <Canvas>
      <FootageCard
        src={src}
        startFrom={startFrom}
        move={move}
        spanMs={spanMs}
        caption={caption}
      />
      <svg
        width={1920}
        height={1080}
        style={{ position: "absolute", left: 0, top: 0 }}
      >
        {pins.map((p, i) => {
          const at = LEAD + 500 + (p.at ?? i * 600);
          const x = ox + p.x;
          const y = oy + p.y;
          const pts: [number, number][] = [
            [x, y],
            [x + (p.dx ?? 200), y + (p.dy ?? -150)],
          ];
          const L = polyLength(pts);
          const d = seg(t, at, 350, ease.outBack);
          const hr = seg(t, at + 100, 700);
          return (
            <g key={i}>
              <circle
                cx={x}
                cy={y}
                r={10 + 34 * hr}
                fill="none"
                stroke="#fff"
                strokeWidth={2.5}
                opacity={1 - hr}
              />
              <path
                d={polyPath(pts)}
                fill="none"
                stroke={th.ink}
                strokeWidth={2.5}
                strokeLinecap="round"
                strokeDasharray={L}
                strokeDashoffset={
                  L * (1 - seg(t, at + 150, 400, ease.inOutCubic))
                }
              />
              <circle
                cx={x}
                cy={y}
                r={Math.max(0, 11 * d)}
                fill="#fff"
                stroke={toneColor(th, p.tone ?? "blue")}
                strokeWidth={5}
              />
            </g>
          );
        })}
      </svg>
      {pins.map((p, i) => {
        const at = LEAD + 500 + (p.at ?? i * 600);
        const ex = ox + p.x + (p.dx ?? 200);
        const ey = oy + p.y + (p.dy ?? -150);
        const q = seg(t, at + 450, 450, ease.outBack);
        return (
          <div
            key={i}
            style={{
              position: "absolute",
              left: ex + 6,
              top: ey - 46,
              padding: "12px 22px",
              background: th.card,
              borderRadius: 16,
              boxShadow: "0 14px 34px rgba(20,27,45,0.16)",
              border: `1px solid ${th.line}`,
              whiteSpace: "nowrap",
              opacity: clamp(q * 2),
              transform: `scale(${lerp(0.8, 1, q)})`,
              transformOrigin: "0 50%",
            }}
          >
            <div
              style={{
                fontSize: 20,
                fontWeight: 700,
                letterSpacing: "0.06em",
                color: th.ink3,
              }}
            >
              {p.label.toUpperCase()}
            </div>
            {p.value ? (
              <div
                style={{
                  fontSize: 40,
                  fontWeight: 800,
                  color: toneColor(th, p.tone ?? "ink"),
                }}
              >
                {p.value}
              </div>
            ) : null}
          </div>
        );
      })}
    </Canvas>
  );
};

export type SplitMediaProps = {
  src?: string;
  startFrom?: number;
  move?: Move;
  spanMs?: number;
  caption?: string;
  title?: string;
  rows?: { label: string; value: string; tone?: Tone }[];
  src2?: string; // 传第二个素材时变成两张并排实拍卡（左右对照）
  caption2?: string;
};
/** split-media：左侧实拍卡 + 右侧数据栏（几行数逐行出现）；传 src2 时变成两张并排的实拍卡做对照 */
export const SplitMedia: React.FC<SplitMediaProps> = ({
  src,
  startFrom = 0,
  move = "in",
  spanMs = 5000,
  caption = "New Albany, Ohio · Image: Google",
  title = "Capex vs. cash generated",
  rows = [
    { label: "Capital expenditure", value: "$51.4B", tone: "red" },
    { label: "Operating cash flow", value: "$42.3B", tone: "ink" },
    { label: "Free cash flow", value: "−$9.1B", tone: "red" },
  ],
  src2,
  caption2,
}) => {
  const t = useMs();
  const th = useTheme();
  const fill = usePanelFill();
  const W = fill ? LAYOUT.rightW : LAYOUT.rightW - 120;
  if (src2 !== undefined || caption2) {
    const w = (LAYOUT.contentW + LAYOUT.rightW - 40) / 2;
    return (
      <Canvas>
        <FootageCard
          src={src}
          startFrom={startFrom}
          move={move}
          spanMs={spanMs}
          caption={caption}
          rect={{ x: LAYOUT.left, y: LAYOUT.contentTop, w, h: LAYOUT.contentH }}
        />
        <FootageCard
          src={src2}
          move="right"
          spanMs={spanMs}
          caption={caption2}
          at={150}
          rect={{
            x: LAYOUT.left + w + 40,
            y: LAYOUT.contentTop,
            w,
            h: LAYOUT.contentH,
          }}
        />
      </Canvas>
    );
  }
  return (
    <Canvas>
      <FootageCard
        src={src}
        startFrom={startFrom}
        move={move}
        spanMs={spanMs}
        caption={caption}
      />
      <div
        style={{
          position: "absolute",
          left: LAYOUT.rightX,
          top: LAYOUT.contentTop,
          width: W,
          ...(fill
            ? {
                height: LAYOUT.contentH,
                display: "flex",
                flexDirection: "column",
              }
            : {}),
          padding: fill ? "38px 48px" : "30px 38px",
          boxSizing: "border-box",
          background: th.card,
          borderRadius: th.radius,
          boxShadow: th.shadow,
          border: `1px solid ${th.line}`,
          opacity: seg(t, LEAD + 450, 500),
        }}
      >
        <div
          style={{
            fontSize: fill ? 32 : 30,
            fontWeight: 800,
            letterSpacing: "-0.01em",
          }}
        >
          {title}
        </div>
        {rows.map((r, i) => {
          const q = seg(t, LEAD + 800 + i * 260, 450);
          return (
            <div
              key={i}
              style={{
                padding: fill && rows.length >= 4 ? "8px 0" : "18px 0",
                ...(fill
                  ? {
                      flex: 1,
                      display: "flex",
                      flexDirection: "column",
                      justifyContent: "center",
                    }
                  : {}),
                borderBottom:
                  i < rows.length - 1 ? `1px solid ${th.line}` : "none",
                opacity: q,
                transform: `translateX(${(1 - q) * 24}px)`,
              }}
            >
              <div
                style={{
                  fontSize: fill ? 24 : 22,
                  fontWeight: 600,
                  color: th.ink3,
                }}
              >
                {r.label}
              </div>
              <Num
                style={{
                  fontSize: fill
                    ? fitFont(r.value, W - 96, rows.length >= 4 ? 48 : 64)
                    : 56,
                  color: toneColor(th, r.tone ?? "ink"),
                  whiteSpace: fill ? "nowrap" : undefined,
                }}
              >
                {r.value}
              </Num>
            </div>
          );
        })}
      </div>
    </Canvas>
  );
};

export type DocZoomProps = {
  src?: string; // 财报截图（PNG，按 1040 宽排版的坐标）
  focus?: { x: number; y: number; w: number; h: number }; // 要推近的那一行（截图坐标，按卡片内 1020×565 算）
  zoom?: number;
  note?: string;
  noteSub?: string;
  tone?: Tone;
  source?: string;
};
/** doc-zoom：财报原文装在一张"文档窗口"卡片里 → 推近到某一行 → 琥珀底纹扫过 → 右侧弹出读数卡 */
export const DocZoom: React.FC<DocZoomProps> = ({
  src,
  focus = { x: 60, y: 300, w: 900, h: 40 },
  zoom = 2.0,
  note = "−$8.7B",
  noteSub = "Equity investments (incl. SpaceX stake)",
  tone = "red",
  source = "Alphabet Q3 2026 earnings release",
}) => {
  const t = useMs();
  const th = useTheme();
  const W = LAYOUT.contentW - 20;
  const H = LAYOUT.contentH - 64;
  const z = seg(t, LEAD + 400, 1100, ease.inOutCubic);
  const s = lerp(1, zoom, z);
  const cx = focus.x + focus.w / 2;
  const cy = focus.y + focus.h / 2;
  const tx = lerp(0, W / 2 - cx * s, z);
  const ty = lerp(0, H / 2 - cy * s, z);
  const sweep = seg(t, LEAD + 1550, 500, ease.inOutCubic);
  const a = seg(t, LEAD, 600);
  return (
    <Canvas>
      <div
        style={{
          position: "absolute",
          left: LAYOUT.left,
          top: LAYOUT.contentTop,
          width: LAYOUT.contentW,
          height: LAYOUT.contentH,
          background: th.card,
          borderRadius: th.radius,
          boxShadow: "0 18px 44px rgba(20,27,45,0.12)",
          overflow: "hidden",
          opacity: a,
          transform: `translateY(${(1 - a) * 40}px)`,
        }}
      >
        <div
          style={{
            height: 54,
            display: "flex",
            alignItems: "center",
            gap: 14,
            padding: "0 24px",
            borderBottom: `1px solid ${th.line}`,
            fontSize: 20,
            fontWeight: 600,
            color: th.ink3,
          }}
        >
          <svg
            width={22}
            height={22}
            viewBox="0 0 24 24"
            fill="none"
            stroke={th.blue}
            strokeWidth={2}
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M14 3H6a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z" />
            <path d="M14 3v6h6" />
          </svg>
          {source}
        </div>
        <div
          style={{
            position: "absolute",
            left: 10,
            top: 64,
            width: W,
            height: H,
            overflow: "hidden",
          }}
        >
          <div
            style={{
              position: "absolute",
              left: 0,
              top: 0,
              width: W,
              height: H,
              transform: `translate(${tx}px, ${ty}px) scale(${s})`,
              transformOrigin: "0 0",
            }}
          >
            {src ? (
              <Media src={src} grade={false} style={{ inset: 0 }} />
            ) : (
              <div
                style={{ position: "absolute", inset: 0, padding: "24px 60px" }}
              >
                {Array.from({ length: 12 }, (_, i) => (
                  <div
                    key={i}
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      height: 40,
                      alignItems: "center",
                      borderBottom: "1px solid #E4E8F0",
                    }}
                  >
                    <div
                      style={{
                        height: 12,
                        width: 280 + ((i * 97) % 260),
                        background: "#D7DDE7",
                        borderRadius: 5,
                      }}
                    />
                    <div
                      style={{
                        height: 12,
                        width: 90,
                        background: "#D7DDE7",
                        borderRadius: 5,
                      }}
                    />
                  </div>
                ))}
              </div>
            )}
            <div
              style={{
                position: "absolute",
                left: focus.x,
                top: focus.y,
                height: focus.h,
                width: focus.w * sweep,
                background: th.amber,
                opacity: 0.3,
                borderRadius: 4,
              }}
            />
          </div>
        </div>
      </div>
      <StatCard
        kicker="FROM THE FILING"
        value={note}
        sub={noteSub}
        tone={tone}
        at={1950}
        y={LAYOUT.contentTop}
      />
    </Canvas>
  );
};

export type PhotoStackProps = {
  srcs?: (string | undefined)[];
  captions?: string[];
  stepMs?: number;
};
/** photo-stack：几张实拍卡依次落到内容区，略微错角叠放——快速交代一个场景 */
export const PhotoStack: React.FC<PhotoStackProps> = ({
  srcs = [undefined, undefined, undefined],
  captions = [
    "Server aisles",
    "Cooling pipes",
    "Building 5, under construction",
  ],
  stepMs = 450,
}) => {
  const t = useMs();
  const th = useTheme();
  const rots = [-4, 3, -2, 4, -3];
  const offs = [0, 170, 340, 85, 255];
  return (
    <Canvas>
      {srcs.map((src, i) => {
        const q = seg(t, LEAD + 200 + i * stepMs, 500, ease.outBack);
        const r = rots[i % rots.length];
        return (
          <div
            key={i}
            style={{
              position: "absolute",
              left: LAYOUT.left + offs[i % offs.length],
              top: LAYOUT.contentTop + (i % 2) * 24,
              width: 820,
              height: 520,
              background: th.card,
              padding: 12,
              boxSizing: "border-box",
              borderRadius: 22,
              boxShadow: "0 24px 56px rgba(20,27,45,0.18)",
              opacity: clamp(q * 3),
              transform: `translateY(${(1 - q) * 100}px) rotate(${lerp(r * 3, r, q)}deg)`,
            }}
          >
            <Media
              src={src}
              grade={false}
              style={{
                left: 12,
                top: 12,
                right: 12,
                bottom: 64,
                borderRadius: 12,
              }}
            />
            <div
              style={{
                position: "absolute",
                left: 22,
                bottom: 18,
                fontSize: 24,
                fontWeight: 700,
                color: th.ink,
              }}
            >
              {captions[i] ?? ""}
            </div>
          </div>
        );
      })}
    </Canvas>
  );
};
