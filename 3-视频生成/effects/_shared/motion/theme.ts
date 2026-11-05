// 动效库的两套主题。组件只认这里的颜色名，不写死色值；换主题就换整套画面。
// cards：浅灰底 + 白色圆角卡片（2026-10 起的默认风格）
// navy：深海军蓝 + 青色涨 / 红色跌（caspa-ai-profit、2026-10-google-q3 成片的风格）
import React, { createContext, useContext } from "react";

export type Theme = {
  name: "cards" | "navy" | "deco" | "documentary" | "glass" | "terminal" | "newspaper" | "swiss"
    | "paper-signal" | "sticker-pop" | "mint-switch" | "warm-haze" | "sticky-audit" | "riso-print" | "showa-poster" | "retro-sunburst" | "color-cards" | "bauhaus-grid";
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


// ── 2026-11-05 从 ajiang-video-broll 移植的 10 套（外观组件在 ../styles/broll-kits.tsx）
const T = (o: Partial<Theme> & Pick<Theme, "name">, hot: string): Theme => base({ shadowHot: (a) => `0 0 0 ${3 * a}px ${hot}, 0 18px 40px rgba(0,0,0,${0.18 * a})`, ...o });
export const PAPER_SIGNAL = T({
  name: "paper-signal", bg: "#ECEAE4", bgGlow: "linear-gradient(90deg, rgba(18,17,14,0.07) 1px, rgba(0,0,0,0) 1px) 90px 0 / 145px 100%", card: "#FFFFFF", cardSoft: "rgba(255,255,255,0.96)", line: "rgba(18,17,14,0.12)",
  ink: "#12110E", ink2: "#3A3833", ink3: "#7A766F", ph: "#C9C6BE", ph2: "#DEDBD3", track: "rgba(18,17,14,0.3)", blue: "#F2561E", blueT: "rgba(242,86,30,0.12)", teal: "#1F8A4C", tealT: "rgba(31,138,76,0.12)",
  red: "#C8361B", redT: "rgba(200,54,27,0.12)", amber: "#F2561E", amberT: "rgba(242,86,30,0.12)", onAccent: "#FFFFFF", sub: "#12110E", progress: "#F2561E", brandLine: "#F2561E", shadow: "none", font: "'Inter Tight', Inter, sans-serif", radius: 0,
}, "#F2561E");
export const STICKER_POP = T({
  name: "sticker-pop", bg: "#FCFEF3", bgGlow: "radial-gradient(rgba(28,22,36,0.13) 2px, rgba(0,0,0,0) 2.4px) 0 0 / 28px 28px", card: "#FFFFFB", cardSoft: "rgba(255,255,251,0.97)", line: "#1C1624",
  ink: "#1C1624", ink2: "#4A4452", ink3: "#6E6878", ph: "#BDEBF5", ph2: "#E9F6F9", track: "#1C1624", blue: "#F58AE8", blueT: "rgba(245,138,232,0.25)", teal: "#1E9B4B", tealT: "rgba(166,235,155,0.5)",
  red: "#E5383B", redT: "rgba(229,56,59,0.15)", amber: "#F2CF63", amberT: "rgba(242,207,99,0.35)", onAccent: "#1C1624", sub: "#FFFFFB", progress: "#F58AE8", brandLine: "#1C1624", shadow: "8px 8px 0 #1C1624", font: "'Space Grotesk', sans-serif", radius: 18,
}, "#1C1624");
export const MINT_SWITCH = T({
  name: "mint-switch", bg: "#0B0D0C", bgGlow: "radial-gradient(1100px 700px at 70% 30%, rgba(77,235,159,0.10) 0%, rgba(11,13,12,0) 60%)", card: "#141816", cardSoft: "rgba(20,24,22,0.92)", line: "rgba(245,246,240,0.12)",
  ink: "#F3F5EF", ink2: "#C4C8BF", ink3: "#8A8F86", ph: "#2A302C", ph2: "#1A1F1C", track: "rgba(245,246,240,0.25)", blue: "#4DEB9F", blueT: "rgba(77,235,159,0.14)", teal: "#4DEB9F", tealT: "rgba(77,235,159,0.14)",
  red: "#FF6B5E", redT: "rgba(255,107,94,0.14)", amber: "#DDF2E4", amberT: "rgba(221,242,228,0.12)", onAccent: "#0B1A12", sub: "rgba(11,13,12,0.88)", progress: "#4DEB9F", brandLine: "#4DEB9F", shadow: "0 30px 70px rgba(4,10,7,0.6)", font: "'Inter Tight', Inter, sans-serif", radius: 22,
}, "#4DEB9F");
export const WARM_HAZE = T({
  name: "warm-haze", bg: "#F8F5EE", bgGlow: "radial-gradient(600px 600px at 78% 20%, rgba(228,168,108,0.45) 0%, rgba(228,168,108,0) 70%), radial-gradient(560px 560px at 14% 85%, rgba(78,125,84,0.30) 0%, rgba(78,125,84,0) 70%)", card: "#FFFFFF", cardSoft: "rgba(255,255,255,0.95)", line: "rgba(30,30,28,0.10)",
  ink: "#1E1E1C", ink2: "#4A4844", ink3: "#8A877E", ph: "#E4DED2", ph2: "#EFEBE3", track: "rgba(30,30,28,0.2)", blue: "#4E7D54", blueT: "rgba(78,125,84,0.12)", teal: "#4E7D54", tealT: "rgba(78,125,84,0.12)",
  red: "#C4553A", redT: "rgba(196,85,58,0.12)", amber: "#E4A86C", amberT: "rgba(228,168,108,0.18)", onAccent: "#FFFFFF", sub: "#1E1E1C", progress: "#4E7D54", brandLine: "#E4A86C", shadow: "0 30px 80px rgba(60,40,20,0.18)", font: "Inter, sans-serif", radius: 28,
}, "rgba(78,125,84,0.45)");
export const STICKY_AUDIT = T({
  name: "sticky-audit", bg: "#F4F4EC", bgGlow: "linear-gradient(rgba(21,20,26,0.035) 1px, rgba(0,0,0,0) 1px) 0 0 / 40px 40px, linear-gradient(90deg, rgba(21,20,26,0.035) 1px, rgba(0,0,0,0) 1px) 0 0 / 40px 40px", card: "#FAF9F4", cardSoft: "rgba(250,249,244,0.96)", line: "rgba(21,20,26,0.12)",
  ink: "#15141A", ink2: "#45444C", ink3: "#8E8E86", ph: "#D8D8CE", ph2: "#E8E8DF", track: "rgba(21,20,26,0.25)", blue: "#3461E0", blueT: "rgba(52,97,224,0.12)", teal: "#2FB67C", tealT: "rgba(47,182,124,0.14)",
  red: "#E4572E", redT: "rgba(228,87,46,0.12)", amber: "#7A5AE0", amberT: "rgba(122,90,224,0.12)", onAccent: "#FFFFFF", sub: "#15141A", progress: "#E4572E", brandLine: "#5B4BDB", shadow: "0 14px 30px rgba(21,20,26,0.12)", font: "'Inter Tight', Inter, sans-serif", radius: 6,
}, "#E4572E");
export const RISO_PRINT = T({
  name: "riso-print", bg: "#ECE6D8", bgGlow: "radial-gradient(rgba(32,49,33,0.12) 0.8px, rgba(0,0,0,0) 1.2px) 0 0 / 5px 5px", card: "#EFEADF", cardSoft: "rgba(239,234,223,0.96)", line: "#1B72A8",
  ink: "#1B72A8", ink2: "#1E5A3A", ink3: "#7E8FA6", ph: "#D9CFBC", ph2: "#E5DDCD", track: "#1B72A8", blue: "#F0508C", blueT: "rgba(240,80,140,0.18)", teal: "#1E5A3A", tealT: "rgba(30,90,58,0.14)",
  red: "#EE4B2B", redT: "rgba(238,75,43,0.15)", amber: "#F2D519", amberT: "rgba(242,213,25,0.3)", onAccent: "#EFEADF", sub: "#EFEADF", progress: "#F0508C", brandLine: "#F0508C", shadow: "10px 10px 0 #F2D519", font: "'DM Mono', monospace", radius: 0,
}, "#F0508C");
export const SHOWA_POSTER = T({
  name: "showa-poster", bg: "#10110F", bgGlow: "radial-gradient(70% 70% at 50% 50%, rgba(175,0,36,0.18) 0%, rgba(14,10,8,0) 100%)", card: "#171917", cardSoft: "rgba(23,25,23,0.94)", line: "rgba(243,243,233,0.3)",
  ink: "#F3F3E9", ink2: "#C9C8BE", ink3: "#8A8880", ph: "#2C2D2A", ph2: "#1E1F1C", track: "rgba(243,243,233,0.3)", blue: "#D4002F", blueT: "rgba(212,0,47,0.18)", teal: "#8BC79A", tealT: "rgba(139,199,154,0.14)",
  red: "#D4002F", redT: "rgba(212,0,47,0.18)", amber: "#F3F3E9", amberT: "rgba(243,243,233,0.12)", onAccent: "#F3F3E9", sub: "rgba(16,17,15,0.9)", progress: "#D4002F", brandLine: "#D4002F", shadow: "0 20px 50px rgba(0,0,0,0.6)", font: "Archivo, sans-serif", radius: 0,
}, "#D4002F");
export const RETRO_SUNBURST = T({
  name: "retro-sunburst", bg: "#F8E9C8", bgGlow: "radial-gradient(80% 80% at 50% 50%, rgba(251,239,214,0.6) 0%, rgba(110,60,20,0.15) 100%)", card: "#FEFEFE", cardSoft: "rgba(254,254,254,0.96)", line: "#F6C453",
  ink: "#4F2E16", ink2: "#6E4422", ink3: "#895525", ph: "#F3D6A2", ph2: "#FBEFD6", track: "rgba(79,46,22,0.3)", blue: "#F28C28", blueT: "rgba(242,140,40,0.16)", teal: "#5E8C3A", tealT: "rgba(94,140,58,0.15)",
  red: "#C4442A", redT: "rgba(196,68,42,0.14)", amber: "#F6C453", amberT: "rgba(246,196,83,0.3)", onAccent: "#4F2E16", sub: "#FFF6E3", progress: "#F28C28", brandLine: "#F6C453", shadow: "0 22px 40px rgba(79,46,22,0.28)", font: "Rubik, sans-serif", radius: 26,
}, "#F6C453");
export const COLOR_CARDS = T({
  name: "color-cards", bg: "#16140F", bgGlow: "radial-gradient(90% 90% at 50% 50%, rgba(0,0,0,0) 50%, rgba(12,9,4,0.45) 100%)", card: "#2F4BDB", cardSoft: "rgba(47,75,219,0.94)", line: "rgba(243,239,228,0.22)",
  ink: "#F3EFE4", ink2: "#D6D1C3", ink3: "#A39E8E", ph: "#3A352B", ph2: "#26221A", track: "rgba(243,239,228,0.3)", blue: "#EDD456", blueT: "rgba(237,212,86,0.16)", teal: "#9EF0B8", tealT: "rgba(31,107,74,0.5)",
  red: "#FFB4A0", redT: "rgba(217,96,59,0.35)", amber: "#D9603B", amberT: "rgba(217,96,59,0.2)", onAccent: "#16140F", sub: "#EEEAE2", progress: "#EDD456", brandLine: "#D9603B", shadow: "0 30px 60px rgba(12,9,4,0.5)", font: "Inter, sans-serif", radius: 26,
}, "#EDD456");
export const BAUHAUS_GRID = T({
  name: "bauhaus-grid", bg: "#F1EDE4", bgGlow: "linear-gradient(rgba(22,20,20,0.14) 1px, rgba(0,0,0,0) 1px) 60px 90px / 150px 150px, linear-gradient(90deg, rgba(22,20,20,0.14) 1px, rgba(0,0,0,0) 1px) 60px 90px / 150px 150px", card: "#FFFFFF", cardSoft: "rgba(255,255,255,0.96)", line: "#161414",
  ink: "#161414", ink2: "#3B3734", ink3: "#8A8378", ph: "#D6D0C4", ph2: "#E6E1D6", track: "#161414", blue: "#FF4F1F", blueT: "rgba(255,79,31,0.12)", teal: "#2D4BD8", tealT: "rgba(45,75,216,0.12)",
  red: "#F04A1E", redT: "rgba(240,74,30,0.12)", amber: "#F4B62C", amberT: "rgba(244,182,44,0.2)", onAccent: "#FFFFFF", sub: "#161414", progress: "#F04A1E", brandLine: "#2D4BD8", shadow: "12px 12px 0 #F4B62C", font: "'IBM Plex Mono', monospace", radius: 0,
}, "#F4B62C");

export const THEMES = { cards: CARDS, navy: NAVY, deco: DECO, documentary: DOCUMENTARY, glass: GLASS, terminal: TERMINAL, newspaper: NEWSPAPER, swiss: SWISS,
  "paper-signal": PAPER_SIGNAL, "sticker-pop": STICKER_POP, "mint-switch": MINT_SWITCH, "warm-haze": WARM_HAZE, "sticky-audit": STICKY_AUDIT,
  "riso-print": RISO_PRINT, "showa-poster": SHOWA_POSTER, "retro-sunburst": RETRO_SUNBURST, "color-cards": COLOR_CARDS, "bauhaus-grid": BAUHAUS_GRID };
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
