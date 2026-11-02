// 媒体、转场、全局：实拍装进卡片、浏览器卡片、圆窗叠入下一幕、章节进度条
import React from "react";
import { Canvas, Card, Chip, Media, Num, enter } from "./ui";
import { useTheme } from "./theme";
import { LEAD, clamp, ease, lerp, pad2, seg, useMs } from "./time";

export type MediaCardProps = {
  src?: string; // staticFile("<期名>/video/x.mp4") 或图片；不传显示占位插画
  startFrom?: number; // 视频从第几秒开始
  caption?: string;
  sub?: string;
  grade?: boolean;
  zoomMs?: number; // 缓推 100%→108% 用多长时间
};
/** media-card：实拍放进大圆角卡片，卡片上浮落位，画面缓推，信息胶囊随后弹出 */
export const MediaCard: React.FC<MediaCardProps> = ({
  src,
  startFrom = 0,
  caption = "Google Cloud revenue +103%",
  sub = "Footage: Google data center",
  grade = true,
  zoomMs = 3000,
}) => {
  const t = useMs();
  const th = useTheme();
  const q = seg(t, LEAD + 700, 500, ease.outBack);
  return (
    <Canvas content>
      <Card style={{ left: 112, top: 150, width: 1696, height: 780, overflow: "hidden", padding: 0, ...enter(seg(t, LEAD, 600), 60, 0.94) }}>
        <Media src={src} startFrom={startFrom} grade={grade} zoom={lerp(1, 1.08, clamp(t / zoomMs))} style={{ inset: 0, borderRadius: th.radius }} />
        {caption ? (
          <div
            style={{
              position: "absolute",
              left: 60,
              bottom: 60,
              display: "flex",
              alignItems: "center",
              gap: 20,
              padding: "22px 34px",
              borderRadius: 22,
              background: th.cardSoft,
              boxShadow: th.shadow,
              opacity: clamp(q * 2),
              transform: `translateY(${(1 - q) * 30}px) scale(${lerp(0.85, 1, q)})`,
            }}
          >
            <div style={{ width: 56, height: 56, borderRadius: 16, background: th.blueT, display: "flex", alignItems: "center", justifyContent: "center" }}>
              <svg width={30} height={30} viewBox="0 0 24 24" fill="none" stroke={th.blue} strokeWidth={2.2} strokeLinecap="round">
                <path d="M3 17l6-6 4 4 8-8" />
                <path d="M15 7h6v6" />
              </svg>
            </div>
            <div>
              <div style={{ fontSize: 38, fontWeight: 800 }}>{caption}</div>
              {sub ? <div style={{ fontSize: 24, fontWeight: 500, color: th.ink3, marginTop: 4 }}>{sub}</div> : null}
            </div>
          </div>
        ) : null}
      </Card>
    </Canvas>
  );
};

export type BrowserCardProps = { url?: string; query?: string; src?: string; startFrom?: number; tag?: string };
/** browser-card：浏览器窗口升入，地址栏和搜索框打字，回答区骨架条逐行展开；传 src 时窗口里放录屏或截图 */
export const BrowserCard: React.FC<BrowserCardProps> = ({
  url = "google.com/search?udm=50",
  query = "best laptop for video editing under $1,500 with long battery life",
  src,
  startFrom = 0,
  tag = "AI Mode",
}) => {
  const t = useMs();
  const th = useTheme();
  const r = seg(t, LEAD, 700);
  const k = seg(t, LEAD + 600, 1400, ease.linear);
  const widths = [1260, 1180, 1220, 900, 1100, 700];
  return (
    <Canvas content>
      <Card
        style={{
          left: 210,
          top: 120,
          width: 1500,
          height: 840,
          overflow: "hidden",
          padding: 0,
          opacity: r,
          transform: `translateY(${(1 - r) * 80}px) scale(${lerp(0.95, 1, r)})`,
        }}
      >
        <div style={{ height: 64, background: th.name === "cards" ? "#F7F8FB" : th.ph2, borderBottom: `1px solid ${th.line}`, display: "flex", alignItems: "center", gap: 12, padding: "0 26px" }}>
          {["#FF5F57", "#FEBC2E", "#28C840"].map((c) => (
            <i key={c} style={{ width: 16, height: 16, borderRadius: "50%", background: c, display: "inline-block" }} />
          ))}
          <div
            style={{
              marginLeft: 30,
              flex: 1,
              height: 38,
              borderRadius: 12,
              background: th.card,
              border: `1px solid ${th.line}`,
              fontSize: 22,
              fontWeight: 500,
              color: th.ink3,
              display: "flex",
              alignItems: "center",
              padding: "0 18px",
            }}
          >
            {url}
          </div>
        </div>
        <div style={{ position: "absolute", left: 0, right: 0, top: 64, bottom: 0 }}>
          {src ? (
            <Media src={src} startFrom={startFrom} grade={false} style={{ inset: 0 }} />
          ) : (
            <>
              <div
                style={{
                  position: "absolute",
                  left: 120,
                  right: 120,
                  top: 70,
                  height: 96,
                  borderRadius: 48,
                  border: `2px solid ${th.line}`,
                  boxShadow: th.shadow,
                  display: "flex",
                  alignItems: "center",
                  padding: "0 40px",
                  fontSize: 32,
                  fontWeight: 500,
                  background: th.card,
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                }}
              >
                <span>{query.slice(0, Math.round(query.length * k))}</span>
                <span style={{ display: "inline-block", width: 3, height: 40, background: th.blue, marginLeft: 4, opacity: Math.floor(t / 400) % 2 ? 1 : 0.2 }} />
              </div>
              <div style={{ position: "absolute", left: 120, top: 196, opacity: seg(t, LEAD + 2050, 250) }}>
                <Chip fg={th.blue} bg={th.blueT}>
                  {tag}
                </Chip>
              </div>
              {widths.map((w, i) => (
                <div
                  key={i}
                  style={{ position: "absolute", left: 120, top: 262 + i * 70, height: 26, borderRadius: 10, background: i === 0 ? th.blueT : th.ph2, width: w * seg(t, LEAD + 2100 + i * 140, 400) }}
                />
              ))}
            </>
          )}
        </div>
      </Card>
    </Canvas>
  );
};

export type IrisPreentryProps = {
  src?: string; // 当前实拍
  startFrom?: number;
  cx?: number;
  cy?: number;
  next?: React.ReactNode; // 圆窗里露出的下一幕；不传时用示例章节卡
};
/** iris-preentry：当前实拍继续缓推，下一画面从圆窗提前显露，0.9 秒内接管全幅（实拍 → 卡片界面） */
export const IrisPreentry: React.FC<IrisPreentryProps> = ({ src, startFrom = 0, cx = 1460, cy = 540, next }) => {
  const t = useMs();
  const th = useTheme();
  const q = seg(t, LEAD, 900, ease.inOutCubic);
  return (
    <Canvas>
      <Media src={src} startFrom={startFrom} zoom={lerp(1, 1.06, clamp(t / 1500))} style={{ inset: 0 }} />
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: `${th.bgGlow}, ${th.bg}`,
          clipPath: `circle(${lerp(0, 2300, q)}px at ${cx}px ${cy}px)`,
          opacity: t < LEAD ? 0 : 1,
        }}
      >
        {next ?? (
          <>
            <div style={{ position: "absolute", left: 112, top: 150, fontSize: 24, fontWeight: 800, letterSpacing: "0.18em", color: th.blue }}>GOOGLE CLOUD</div>
            <div style={{ position: "absolute", left: 110, top: 188, fontSize: 76, fontWeight: 800, letterSpacing: "-0.02em" }}>Cloud: the real highlight</div>
            <Card style={{ left: 112, top: 340, width: 1696, height: 560, padding: 50 }}>
              <Num style={{ fontSize: 200, color: th.teal, marginTop: 80 }}>+103%</Num>
            </Card>
          </>
        )}
      </div>
    </Canvas>
  );
};

export type ChapterProgressProps = { from?: number; to?: number; labels?: string[]; brand?: string; episode?: string; showBigNumber?: boolean };
/** chapter-progress：底部分段进度条把当前段填满，右上角章节号和章节名同时切换 */
export const ChapterProgress: React.FC<ChapterProgressProps> = ({
  from = 2,
  to = 3,
  labels = ["Cold open", "The report card", "Layer 1 · Profits", "Layer 2 · Cash flow", "Layer 3 · Funding", "Is AI eating Search?", "Google Cloud", "Control group", "What's next"],
  brand = "ANDY'S MARKET LENS",
  episode = "Alphabet Q3 2026",
  showBigNumber = false,
}) => {
  const t = useMs();
  const th = useTheme();
  const q = seg(t, LEAD, 500, ease.inOutCubic);
  const fill = seg(t, LEAD + 200, 900, ease.inOutCubic);
  const row = (i: number, style: React.CSSProperties) => (
    <div style={{ position: "absolute", right: 0, top: 0, whiteSpace: "nowrap", fontSize: 24, fontWeight: 600, color: th.ink2, ...style }}>
      <b style={{ color: th.teal, marginRight: 14 }}>{pad2(i)}</b>
      {labels[i] ?? ""}
    </div>
  );
  return (
    <Canvas>
      <div style={{ position: "absolute", left: 64, top: 82, width: 680, height: 2, background: `linear-gradient(90deg, ${th.brandLine}, rgba(25,166,122,0))` }} />
      <div style={{ position: "absolute", left: 64, right: 64, top: 40, display: "flex", justifyContent: "space-between", fontSize: 24, fontWeight: 800 }}>
        <div>
          {brand}
          <span style={{ color: th.ink3, fontWeight: 500, marginLeft: 12 }}>/ {episode}</span>
        </div>
        <div style={{ position: "relative", height: 30, overflow: "hidden", minWidth: 420 }}>
          {row(from, { transform: `translateY(${-q * 30}px)`, opacity: 1 - q })}
          {row(to, { transform: `translateY(${(1 - q) * 30}px)`, opacity: q })}
        </div>
      </div>
      <div style={{ position: "absolute", left: 0, right: 0, bottom: 0, height: 10, display: "flex", gap: 6 }}>
        {labels.map((_, i) => (
          <i key={i} style={{ flex: 1, background: th.name === "cards" ? "#E1E6EE" : th.ph2, position: "relative", display: "block" }}>
            <i
              style={{
                position: "absolute",
                left: 0,
                top: 0,
                bottom: 0,
                background: th.progress,
                display: "block",
                width: `${i < from ? 100 : i <= to ? (i < to ? 100 : 100 * fill) : 0}%`,
              }}
            />
          </i>
        ))}
      </div>
      {showBigNumber ? (
        <div style={{ position: "absolute", left: 0, right: 0, top: 420, textAlign: "center", fontSize: 120, fontWeight: 800, color: th.ink3, letterSpacing: "-0.03em", opacity: 0.12 + 0.1 * q }}>
          {pad2(to)}
        </div>
      ) : null}
    </Canvas>
  );
};
