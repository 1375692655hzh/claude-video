// 文字类：标题逐词升入、单词重击、荧光底纹扫过、字幕条逐词显现
import React from "react";
import { Canvas } from "./ui";
import { useTheme } from "./theme";
import { LEAD, clamp, ease, lerp, seg, useMs } from "./time";

export type TitleRiseProps = { kicker?: string; title?: string; top?: number };
/** title-rise：蓝色小标题先淡入，大标题逐词从裁剪边界升入 */
export const TitleRise: React.FC<TitleRiseProps> = ({ kicker = "THE MATH", title = "How Alphabet got to −$9.1 billion", top = 420 }) => {
  const t = useMs();
  const th = useTheme();
  const pk = seg(t, LEAD, 300);
  return (
    <Canvas>
      <div
        style={{
          position: "absolute",
          left: 112,
          top,
          fontSize: 30,
          fontWeight: 800,
          letterSpacing: "0.18em",
          color: th.blue,
          opacity: pk,
          transform: `translateX(${(1 - pk) * -20}px)`,
        }}
      >
        {kicker}
      </div>
      <div style={{ position: "absolute", left: 108, top: top + 50, fontSize: 96, fontWeight: 800, lineHeight: 1.12, letterSpacing: "-0.02em", whiteSpace: "nowrap" }}>
        {title.split(" ").map((w, i) => {
          const q = seg(t, LEAD + 120 + i * 70, 520, ease.outQuart);
          return (
            <span key={i} style={{ display: "inline-block", overflow: "hidden", verticalAlign: "top", paddingBottom: 10, marginRight: "0.26em" }}>
              <span style={{ display: "inline-block", transform: `translateY(${(1 - q) * 110}%)` }}>{w}</span>
            </span>
          );
        })}
      </div>
    </Canvas>
  );
};

export type WordSlamProps = { word?: string; color?: string };
/** word-slam：一锤定音的词放大砸入、轻震屏（配合音乐静音点） */
export const WordSlam: React.FC<WordSlamProps> = ({ word = "Wrong.", color }) => {
  const t = useMs();
  const q = seg(t, LEAD, 260, ease.outCubic);
  const d = t - LEAD - 260;
  const shake = d > 0 ? Math.sin(d / 18) * 10 * Math.exp(-d / 120) : 0;
  return (
    <Canvas>
      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          top: 380,
          textAlign: "center",
          fontSize: 220,
          fontWeight: 800,
          letterSpacing: "-0.04em",
          color,
          opacity: clamp((t - LEAD) / 90),
          transform: `translateX(${shake}px) scale(${lerp(1.7, 1, q)})`,
          filter: `blur(${(1 - q) * 6}px)`,
        }}
      >
        {word}
      </div>
    </Canvas>
  );
};

export type HighlightSweepProps = { before?: string; mark?: string; after?: string; size?: number; top?: number };
/** highlight-sweep：句子落定后，琥珀底纹从左往右扫过关键短语 */
export const HighlightSweep: React.FC<HighlightSweepProps> = ({
  before = "Not spending too much. ",
  mark = "Collecting too little.",
  after = "",
  size = 88,
  top = 470,
}) => {
  const t = useMs();
  const th = useTheme();
  const a = seg(t, LEAD, 300);
  const q = seg(t, LEAD + 300, 450, ease.inOutCubic);
  return (
    <Canvas>
      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          top,
          textAlign: "center",
          fontSize: size,
          fontWeight: 800,
          letterSpacing: "-0.02em",
          opacity: a,
          transform: `translateY(${(1 - a) * 20}px)`,
        }}
      >
        {before}
        <span
          style={{
            backgroundImage: `linear-gradient(${th.amberT}, ${th.amberT})`,
            backgroundRepeat: "no-repeat",
            backgroundPosition: "0 85%",
            backgroundSize: `${q * 100}% 70%`,
            padding: "0 8px",
            borderRadius: 10,
          }}
        >
          {mark}
        </span>
        {after}
      </div>
    </Canvas>
  );
};

export type CaptionBarProps = { text?: string; spanMs?: number };
/** caption-bar：底部深色字幕条，文字随口播逐词点亮 */
export const CaptionBar: React.FC<CaptionBarProps> = ({ text = "Free cash flow = operating cash flow − capex", spanMs = 1500 }) => {
  const t = useMs();
  const th = useTheme();
  const a = seg(t, LEAD, 250);
  const words = text.split(" ");
  const step = spanMs / words.length;
  return (
    <Canvas>
      <div
        style={{
          position: "absolute",
          left: "50%",
          bottom: 80,
          transform: `translateX(-50%) translateY(${(1 - a) * 16}px)`,
          opacity: a,
          background: th.sub,
          border: `1px solid ${th.line}`,
          borderRadius: 14,
          padding: "16px 30px",
          fontSize: 40,
          fontWeight: 600,
          whiteSpace: "nowrap",
        }}
      >
        {words.map((w, i) => (
          <span key={i} style={{ color: "#fff", opacity: lerp(0.25, 1, seg(t, LEAD + 250 + i * step, 160, ease.linear)) }}>
            {(i ? " " : "") + w}
          </span>
        ))}
      </div>
    </Canvas>
  );
};
