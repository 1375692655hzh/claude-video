// 动效库的两套主题。组件只认这里的颜色名，不写死色值；换主题就换整套画面。
// cards：浅灰底 + 白色圆角卡片（2026-10 起的默认风格）
// navy：深海军蓝 + 青色涨 / 红色跌（caspa-ai-profit、2026-10-google-q3 成片的风格）
import React, { createContext, useContext } from "react";

export type Theme = {
  name: "cards" | "navy" | "deco" | "documentary" | "glass" | "terminal" | "newspaper" | "swiss";
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


// deco：Gilded Deco（2026-11-02-marvell-lumentum 确认的风格）——近黑底、宝石深蓝卡片、香槟金线和强调、奶油色文字、Montserrat
export const DECO: Theme = {
  name: "deco",
  bg: "#0B0C11",
  bgGlow: "radial-gradient(1200px 760px at 50% 40%, rgba(201,169,97,0.10) 0%, rgba(11,12,17,0) 65%)",
  card: "#151833",
  cardSoft: "rgba(21,24,51,0.92)",
  line: "rgba(201,169,97,0.55)",
  ink: "#F3EAD0",
  ink2: "#D6CCB0",
  ink3: "#A9A08A",
  ph: "#3A3524",
  ph2: "#1E1C17",
  track: "rgba(201,169,97,0.40)",
  blue: "#C9A961",
  blueT: "rgba(201,169,97,0.16)",
  teal: "#8FD3A8",
  tealT: "rgba(143,211,168,0.16)",
  red: "#F08C7A",
  redT: "rgba(240,140,122,0.16)",
  amber: "#F1E3B6",
  amberT: "rgba(241,227,182,0.16)",
  onAccent: "#0B0C11",
  sub: "rgba(11,12,17,0.88)",
  progress: "#C9A961",
  brandLine: "#C9A961",
  shadow: "0 24px 60px rgba(0,0,0,0.55)",
  shadowHot: (a) => `0 0 ${48 * a}px rgba(233,210,150,${0.45 * a}), 0 24px 60px rgba(0,0,0,0.55)`,
  font: "Montserrat, Inter, 'Noto Sans SC', 'Microsoft YaHei', 'Segoe UI', Arial, sans-serif",
  radius: 6,
};

// ── 2026-11-03 风格库新增 5 套（外观组件在 ../styles/kits.tsx，说明与样张在 shared/style-library/）
const base = (o: Partial<Theme> & Pick<Theme, "name">): Theme => ({ ...CARDS, ...o } as Theme);
export const DOCUMENTARY: Theme = base({
  name: "documentary", bg: "#120D08", bgGlow: "radial-gradient(1200px 800px at 30% 40%, rgba(227,182,107,0.10) 0%, rgba(18,13,8,0) 65%)",
  card: "rgba(20,14,8,0.72)", cardSoft: "rgba(20,14,8,0.82)", line: "rgba(227,182,107,0.35)", ink: "#FFF3DD", ink2: "#D9C4A0", ink3: "#A8916E",
  ph: "#4A3A24", ph2: "#2A2014", track: "rgba(227,182,107,0.35)", blue: "#E3B66B", blueT: "rgba(227,182,107,0.16)", teal: "#A8C98F", tealT: "rgba(168,201,143,0.16)",
  red: "#E07A5F", redT: "rgba(224,122,95,0.16)", amber: "#F2C66D", amberT: "rgba(242,198,109,0.16)", onAccent: "#120D08", sub: "rgba(0,0,0,0.6)", progress: "#E3B66B", brandLine: "#E3B66B",
  shadow: "0 20px 50px rgba(0,0,0,0.5)", shadowHot: (a) => `0 0 ${40 * a}px rgba(242,198,109,${0.35 * a}), 0 20px 50px rgba(0,0,0,0.5)`, font: "Lora, Georgia, serif", radius: 4,
});
export const GLASS: Theme = base({
  name: "glass", bg: "#120C2E", bgGlow: "radial-gradient(900px 900px at 10% 10%, rgba(123,92,255,0.75) 0%, rgba(123,92,255,0) 70%), radial-gradient(800px 800px at 92% 40%, rgba(34,211,238,0.55) 0%, rgba(34,211,238,0) 70%), radial-gradient(900px 900px at 55% 110%, rgba(244,114,182,0.5) 0%, rgba(244,114,182,0) 70%)",
  card: "rgba(255,255,255,0.12)", cardSoft: "rgba(255,255,255,0.18)", line: "rgba(255,255,255,0.35)", ink: "#FFFFFF", ink2: "rgba(255,255,255,0.8)", ink3: "rgba(255,255,255,0.6)",
  ph: "rgba(255,255,255,0.3)", ph2: "rgba(255,255,255,0.12)", track: "rgba(255,255,255,0.3)", blue: "#C4B5FD", blueT: "rgba(196,181,253,0.18)", teal: "#67E8F9", tealT: "rgba(103,232,249,0.18)",
  red: "#FB7185", redT: "rgba(251,113,133,0.18)", amber: "#FCD34D", amberT: "rgba(252,211,77,0.18)", onAccent: "#120C2E", sub: "rgba(18,12,46,0.6)", progress: "#67E8F9", brandLine: "#C4B5FD",
  shadow: "0 30px 80px rgba(20,10,60,0.35), inset 0 1px 0 rgba(255,255,255,0.4)", shadowHot: (a) => `0 0 ${50 * a}px rgba(196,181,253,${0.5 * a}), 0 30px 80px rgba(20,10,60,0.35)`, font: "'Space Grotesk', Inter, sans-serif", radius: 32,
});
export const TERMINAL: Theme = base({
  name: "terminal", bg: "#030605", bgGlow: "repeating-linear-gradient(0deg, rgba(62,107,82,0.22) 0 1px, rgba(0,0,0,0) 1px 48px), repeating-linear-gradient(90deg, rgba(62,107,82,0.22) 0 1px, rgba(0,0,0,0) 1px 48px)",
  card: "#050C08", cardSoft: "rgba(5,12,8,0.92)", line: "#3E6B52", ink: "#E8FFF2", ink2: "#9FD8B8", ink3: "#6E9C82", ph: "#1C3328", ph2: "#0E1A14", track: "#3E6B52",
  blue: "#FFB000", blueT: "rgba(255,176,0,0.15)", teal: "#32F08C", tealT: "rgba(50,240,140,0.14)", red: "#FF4D5E", redT: "rgba(255,77,94,0.14)", amber: "#FFB000", amberT: "rgba(255,176,0,0.15)",
  onAccent: "#030605", sub: "rgba(3,6,5,0.9)", progress: "#32F08C", brandLine: "#32F08C", shadow: "none", shadowHot: (a) => `0 0 ${30 * a}px rgba(50,240,140,${0.35 * a})`, font: "'JetBrains Mono', monospace", radius: 0,
});
export const NEWSPAPER: Theme = base({
  name: "newspaper", bg: "#F1ECE1", bgGlow: "radial-gradient(1400px 900px at 50% 40%, rgba(255,255,255,0.35) 0%, rgba(241,236,225,0) 70%)",
  card: "#F7F3EA", cardSoft: "rgba(247,243,234,0.96)", line: "#1B1A17", ink: "#1B1A17", ink2: "#4A463E", ink3: "#7A7466", ph: "#C9C1B0", ph2: "#E2DBCB", track: "#9C9483",
  blue: "#B3261E", blueT: "rgba(179,38,30,0.10)", teal: "#2F6B3A", tealT: "rgba(47,107,58,0.10)", red: "#B3261E", redT: "rgba(179,38,30,0.10)", amber: "#9A6A12", amberT: "rgba(154,106,18,0.10)",
  onAccent: "#F7F3EA", sub: "rgba(241,236,225,0.94)", progress: "#1B1A17", brandLine: "#1B1A17", shadow: "none", shadowHot: (a) => `0 0 0 ${3 * a}px rgba(179,38,30,0.6)`, font: "Lora, Georgia, serif", radius: 0,
});
export const SWISS: Theme = base({
  name: "swiss", bg: "#FFFFFF", bgGlow: "linear-gradient(#FFFFFF, #FFFFFF)", card: "#FFFFFF", cardSoft: "rgba(255,255,255,0.96)", line: "#000000", ink: "#000000", ink2: "#333333", ink3: "#777777",
  ph: "#BDBDBD", ph2: "#EEEEEE", track: "#000000", blue: "#E30613", blueT: "rgba(227,6,19,0.08)", teal: "#000000", tealT: "#F2F2F2", red: "#E30613", redT: "rgba(227,6,19,0.08)", amber: "#E30613", amberT: "rgba(227,6,19,0.08)",
  onAccent: "#FFFFFF", sub: "#FFFFFF", progress: "#000000", brandLine: "#000000", shadow: "none", shadowHot: (a) => `0 0 0 ${4 * a}px #E30613`, font: "Inter, Helvetica, Arial, sans-serif", radius: 0,
});

export const THEMES = { cards: CARDS, navy: NAVY, deco: DECO, documentary: DOCUMENTARY, glass: GLASS, terminal: TERMINAL, newspaper: NEWSPAPER, swiss: SWISS };
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
