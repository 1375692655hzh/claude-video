// 动效库的两套主题。组件只认这里的颜色名，不写死色值；换主题就换整套画面。
// cards：浅灰底 + 白色圆角卡片（2026-10 起的默认风格）
// navy：深海军蓝 + 青色涨 / 红色跌（caspa-ai-profit、2026-10-google-q3 成片的风格）
import React, { createContext, useContext } from "react";

export type Theme = {
  name: "cards" | "navy";
  bg: string; // 画面底色
  bgGlow: string; // 底色上的柔光（叠在 bg 上的渐变）
  card: string; // 卡片 / 胶囊的底
  cardSoft: string; // 浮在实拍上的半透明卡片
  line: string; // 卡片描边
  ink: string; // 主文字
  ink2: string; // 次要文字
  ink3: string; // 说明文字、轴标签
  ph: string; // 占位条（深）
  ph2: string; // 占位条（浅）、空轨道
  track: string; // 坐标轴、连接虚线
  blue: string; // 强调 / 品牌
  blueT: string;
  teal: string; // 好：增长、超预期、打勾
  tealT: string;
  red: string; // 坏：下滑、低于预期、负值
  redT: string;
  amber: string; // 提醒：一次性、口径、预期线
  amberT: string;
  onAccent: string; // 实心色块上的文字和勾
  sub: string; // 字幕条底色
  progress: string; // 底部章节进度条（参考图里偏亮的青蓝）
  brandLine: string; // 顶栏左侧那条渐隐细线
  shadow: string;
  shadowHot: (alpha: number) => string; // 当前项的琥珀光晕
  font: string;
  radius: number;
};

const FONT = "Inter, 'Noto Sans SC', 'Microsoft YaHei', 'Segoe UI', Arial, sans-serif";

export const CARDS: Theme = {
  name: "cards",
  bg: "#F3F5F9",
  bgGlow: "radial-gradient(1200px 700px at 78% 18%, #FFFFFF 0%, rgba(255,255,255,0) 60%)",
  card: "#FFFFFF",
  cardSoft: "rgba(255,255,255,0.96)",
  line: "#E4E8F0",
  ink: "#141B2D",
  ink2: "#4A5468",
  ink3: "#8A93A6",
  ph: "#CDD5E2",
  ph2: "#E3E8F0",
  track: "#C9D1DE",
  blue: "#3366E0",
  blueT: "#EAF0FD",
  teal: "#0F9F78",
  tealT: "#E4F5EF",
  red: "#E0484E",
  redT: "#FCEBEC",
  amber: "#F2A516",
  amberT: "#FEF4E1",
  onAccent: "#FFFFFF",
  sub: "#262B36",
  progress: "#2AA4E0",
  brandLine: "#19A67A",
  shadow: "0 10px 30px rgba(20,27,45,0.07), 0 2px 6px rgba(20,27,45,0.04)",
  shadowHot: (a) => `0 18px 40px rgba(242,165,22,${0.22 * a}), 0 10px 30px rgba(20,27,45,0.07)`,
  font: FONT,
  radius: 28,
};

export const NAVY: Theme = {
  name: "navy",
  bg: "#06101f",
  bgGlow: "radial-gradient(1400px 800px at 75% 15%, rgba(46,120,220,0.18) 0%, rgba(6,16,31,0) 60%)",
  card: "#0e2242",
  cardSoft: "rgba(14,34,66,0.92)",
  line: "rgba(120,170,230,0.22)",
  ink: "#f4f8ff",
  ink2: "#b8c8e0",
  ink3: "#8ea6c8",
  ph: "#2b4366",
  ph2: "#18304f",
  track: "rgba(142,166,200,0.45)",
  blue: "#5b9bff",
  blueT: "rgba(91,155,255,0.16)",
  teal: "#2ee6f0",
  tealT: "rgba(46,230,240,0.16)",
  red: "#ff5a4e",
  redT: "rgba(255,90,78,0.16)",
  amber: "#ff9a3c",
  amberT: "rgba(255,154,60,0.16)",
  onAccent: "#06101f",
  sub: "rgba(6,16,31,0.88)",
  progress: "#2ee6f0",
  brandLine: "#2ee6f0",
  shadow: "0 20px 60px rgba(0,0,0,0.35)",
  shadowHot: (a) => `0 0 40px rgba(255,154,60,${0.35 * a}), 0 20px 60px rgba(0,0,0,0.35)`,
  font: FONT,
  radius: 20,
};

export const THEMES = { cards: CARDS, navy: NAVY };
export type ThemeName = keyof typeof THEMES;

const Ctx = createContext<Theme>(CARDS);

/** 包在动效外层切换主题；不包就是默认的 cards */
export const MotionTheme: React.FC<{ theme: ThemeName | Theme; children: React.ReactNode }> = ({ theme, children }) =>
  React.createElement(Ctx.Provider, { value: typeof theme === "string" ? THEMES[theme] : theme }, children);

export const useTheme = () => useContext(Ctx);

/** 语义色：脚本里写 tone，组件按主题取色 */
export type Tone = "ink" | "blue" | "teal" | "red" | "amber" | "muted";
export const toneColor = (t: Theme, tone: Tone) =>
  tone === "muted" ? t.ink3 : (t[tone] as string);
export const toneTint = (t: Theme, tone: Tone) =>
  tone === "teal" ? t.tealT : tone === "red" ? t.redT : tone === "amber" ? t.amberT : tone === "blue" ? t.blueT : t.ph2;
