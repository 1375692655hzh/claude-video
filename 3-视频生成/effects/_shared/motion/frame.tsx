// 界面框架：照参考图（Remotion 教程那一帧）定的固定版式，每个镜头都套在里面。
//   顶栏：左"品牌 / 本期"+ 一条渐隐细线；右"绿色章节号 + 章节名"
//   标题区：左上蓝色小标题 + 深色粗体大标题
//   内容区：靠左，约占画面 60%（x 112–1152）；右侧留白，只放浮动说明卡
//   底部：深色圆角字幕条（居中）、分段进度条（青蓝）、右下角频道标、左下角圆形数字人（可选，host）
import React from "react";
import { Canvas } from "./ui";
import { AvatarBubble, AvatarBubbleProps } from "../AvatarBubble";
import { useTheme } from "./theme";
import { LEAD, clamp, ease, lerp, pad2, seg, useMs } from "./time";

/** 版式坐标（1920×1080 设计稿） */
export const LAYOUT = {
  left: 112, // 内容左边线
  titleTop: 136, // 小标题位置
  contentTop: 300, // 内容区顶
  contentW: 1040, // 左侧内容区宽（约 60%）
  contentH: 585, // 内容区高（16:9 的实拍卡正好是 1040×585）
  rightX: 1192, // 右侧栏左边线
  rightW: 610,
  noteTop: 136, // 浮动说明卡位置（和标题区同高）
};

export type FrameProps = {
  brand?: string;
  episode?: string;
  chapterNum?: number;
  chapterName?: string;
  chapters?: number; // 进度条段数
  done?: number; // 已经讲完的段数（当前章是 done 这一段）
  chapterProgress?: number; // 当前段已走的比例 0–1
  caption?: string; // 底部字幕；不烧录字幕时不传
  mark?: boolean; // 右下角频道标
  host?: AvatarBubbleProps; // 左下角圆形数字人口播（见 ../AvatarBubble.tsx）
  children?: React.ReactNode;
};

/** 每个镜头的外框：浅灰底 + 顶栏 + 字幕 + 进度条 + 频道标。动效放在 children 里（动效本身是透明底） */
export const Frame: React.FC<FrameProps> = ({
  brand = "ANDY'S MARKET LENS",
  episode = "Alphabet Q3 2026",
  chapterNum = 3,
  chapterName = "Layer 2 · Cash flow",
  chapters = 9,
  done = 3,
  chapterProgress = 0.5,
  caption,
  mark = true,
  host,
  children,
}) => {
  const th = useTheme();
  return (
    <>
      <Canvas bg>
        {/* 顶栏 */}
        <div style={{ position: "absolute", left: 64, top: 40, fontSize: 24, fontWeight: 800, letterSpacing: "0.02em", color: th.ink }}>
          {brand}
          <span style={{ color: th.ink3, fontWeight: 500, marginLeft: 12 }}>/ {episode}</span>
        </div>
        <div style={{ position: "absolute", left: 64, top: 82, width: 680, height: 2, background: `linear-gradient(90deg, ${th.brandLine}, rgba(25,166,122,0))` }} />
        <div style={{ position: "absolute", right: 64, top: 40, fontSize: 24, fontWeight: 600, color: th.ink2, whiteSpace: "nowrap" }}>
          <b style={{ color: th.teal, marginRight: 14 }}>{pad2(chapterNum)}</b>
          {chapterName}
        </div>
        {/* 进度条 */}
        <div style={{ position: "absolute", left: 0, right: 0, bottom: 0, height: 10, display: "flex", gap: 6 }}>
          {Array.from({ length: chapters }, (_, i) => (
            <i key={i} style={{ flex: 1, display: "block", position: "relative", background: th.name === "cards" ? "#E1E6EE" : th.ph2 }}>
              <i style={{ position: "absolute", left: 0, top: 0, bottom: 0, display: "block", background: th.progress, width: `${i < done ? 100 : i === done ? 100 * clamp(chapterProgress) : 0}%` }} />
            </i>
          ))}
        </div>
        {mark ? <ChannelMark /> : null}
      </Canvas>
      {children}
      {caption ? (
        <Canvas>
          <div
            style={{
              position: "absolute",
              left: "50%",
              bottom: 52,
              transform: "translateX(-50%)",
              background: th.sub,
              color: "#fff",
              borderRadius: 12,
              padding: "12px 28px",
              fontSize: 38,
              fontWeight: 600,
              whiteSpace: "nowrap",
            }}
          >
            {caption}
          </div>
        </Canvas>
      ) : null}
      {host ? <AvatarBubble {...host} /> : null}
    </>
  );
};

/** 右下角频道标：白色大圆角方块 + 镜头图标（Market Lens） */
export const ChannelMark: React.FC<{ size?: number }> = ({ size = 132 }) => {
  const th = useTheme();
  return (
    <div
      style={{
        position: "absolute",
        right: 96,
        bottom: 150,
        width: size,
        height: size,
        borderRadius: size * 0.26,
        background: th.card,
        boxShadow: "0 18px 40px rgba(20,27,45,0.12)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <svg width={size * 0.52} height={size * 0.52} viewBox="0 0 48 48" fill="none" stroke={th.ink3} strokeWidth={3.4} strokeLinecap="round">
        <circle cx={21} cy={21} r={13} />
        <path d="M31 31l10 10" />
        <path d="M14 25l5-5 4 4 6-7" stroke={th.progress} />
      </svg>
    </div>
  );
};

export type HeadingProps = { kicker?: string; title?: string; at?: number };
/** 标题区：蓝色小标题先出，大标题上浮。所有框内镜头共用同一个位置 */
export const Heading: React.FC<HeadingProps> = ({ kicker = "WHY", title = "Why did the stock fall 10%?", at = 0 }) => {
  const t = useMs();
  const th = useTheme();
  const a = seg(t, LEAD + at, 300);
  const b = seg(t, LEAD + at + 120, 500, ease.outQuart);
  return (
    <Canvas>
      <div style={{ position: "absolute", left: LAYOUT.left + 2, top: LAYOUT.titleTop, fontSize: 24, fontWeight: 800, letterSpacing: "0.18em", color: th.blue, opacity: a }}>{kicker}</div>
      <div
        style={{
          position: "absolute",
          left: LAYOUT.left,
          top: LAYOUT.titleTop + 34,
          fontSize: 68,
          fontWeight: 800,
          letterSpacing: "-0.02em",
          color: th.ink,
          whiteSpace: "nowrap",
          opacity: b,
          transform: `translateY(${(1 - b) * 24}px)`,
        }}
      >
        {title}
      </div>
    </Canvas>
  );
};

export type NoteCardProps = { title?: string; sub?: string; icon?: React.ReactNode; at?: number; top?: number; right?: number };
/** 浮动说明卡：右上角（靠右对齐，不压标题），图标 + 粗体标题 + 小字说明（参考图里 "Remotion = React 前端项目" 那张）。
 *  标题很长时把 top 设成 LAYOUT.contentTop，放到右侧栏顶部 */
export const NoteCard: React.FC<NoteCardProps> = ({ title = "Free cash flow = OCF − capex", sub = "The number that pays for buybacks", icon, at = 400, top = LAYOUT.noteTop, right = 112 }) => {
  const t = useMs();
  const th = useTheme();
  const q = seg(t, LEAD + at, 500, ease.outBack);
  return (
    <Canvas>
      <div
        style={{
          position: "absolute",
          right,
          top,
          display: "flex",
          alignItems: "center",
          gap: 18,
          padding: "18px 26px",
          background: th.card,
          borderRadius: 20,
          boxShadow: "0 14px 34px rgba(20,27,45,0.10)",
          opacity: clamp(q * 2),
          transform: `translateY(${(1 - q) * 16}px) scale(${lerp(0.9, 1, q)})`,
          transformOrigin: "100% 50%",
        }}
      >
        <div style={{ width: 52, height: 52, borderRadius: 14, background: th.blueT, display: "flex", alignItems: "center", justifyContent: "center", flex: "none" }}>
          {icon ?? (
            <svg width={30} height={30} viewBox="0 0 24 24" fill="none" stroke={th.blue} strokeWidth={2.2} strokeLinecap="round" strokeLinejoin="round">
              <circle cx={12} cy={12} r={9} />
              <path d="M12 8v5M12 16v.5" />
            </svg>
          )}
        </div>
        <div>
          <div style={{ fontSize: 30, fontWeight: 800, color: th.ink, whiteSpace: "nowrap" }}>{title}</div>
          {sub ? <div style={{ fontSize: 22, fontWeight: 500, color: th.ink3, marginTop: 2, whiteSpace: "nowrap" }}>{sub}</div> : null}
        </div>
      </div>
    </Canvas>
  );
};
