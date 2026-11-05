// 风格库的外观组件接口（StyleKit）。每套风格实现同一组组件，场景代码只写一次，换风格只换 kit。
// 动效（怎么动）在 ../motion；这里只管长什么样。颜色同时登记在 ../motion/theme.ts，动效库的 51 个动作自动跟随。
import React, { useEffect, useState } from "react";
import { AbsoluteFill, continueRender, delayRender, staticFile } from "remotion";
import type { ThemeName } from "../motion/theme";

export type Tone = "up" | "down" | "accent" | "neutral";
export type StyleKit = {
  id: string;
  theme: ThemeName; // 对应动效库主题
  /** 整屏底：纯色 / 纹理 / 虚化实拍（src 为 staticFile 地址） */
  Backdrop: React.FC<{ src?: string }>;
  /** 内容容器（卡片 / 分栏 / 便签……），focus 为重点项 */
  Panel: React.FC<{ w: number; h: number; tone?: Tone; focus?: boolean; children?: React.ReactNode; style?: React.CSSProperties }>;
  /** 画面标题：小标题 + 大标题 */
  Title: React.FC<{ kicker?: string; title: string; align?: "left" | "center"; size?: number }>;
  /** 大数字 + 标签 */
  BigNumber: React.FC<{ value: string; label?: string; tone?: Tone; size?: number }>;
  /** 一行“标签 · 数值”（表格行） */
  Row: React.FC<{ k: string; v: string; tone?: Tone }>;
  /** 固定外框：频道标 + 信源 */
  Chrome: React.FC<{ source?: string }>;
  /** 章节徽章（左下） */
  ChapterBadge: React.FC<{ num: string; title: string }>;
  /** 底部字幕 */
  Caption: React.FC<{ text: string }>;
};

// 公共字体：3-视频生成/public/library/fonts/（均为 SIL OFL，来自 @fontsource），按需加载
const FACES: [string, string, string, string?][] = [
  ["Inter", "inter-var", "100 900"],
  ["Montserrat", "montserrat-latin-600-normal", "600"], ["Montserrat", "montserrat-latin-700-normal", "700"], ["Montserrat", "montserrat-latin-800-normal", "800"], ["Montserrat", "montserrat-latin-900-normal", "900"],
  ["Cinzel", "cinzel-latin-600-normal", "600"], ["Cinzel", "cinzel-latin-700-normal", "700"],
  ["Playfair Display", "playfair-display-latin-700-normal", "700"], ["Playfair Display", "playfair-display-latin-900-normal", "900"],
  ["Lora", "lora-latin-400-normal", "400"], ["Lora", "lora-latin-600-normal", "600"],
  ["JetBrains Mono", "jetbrains-mono-latin-400-normal", "400"], ["JetBrains Mono", "jetbrains-mono-latin-700-normal", "700"],
  ["Space Grotesk", "space-grotesk-latin-500-normal", "500"], ["Space Grotesk", "space-grotesk-latin-700-normal", "700"],
  // 2026-11-05 B-roll 模板风格（broll-kits.tsx）
  ["Geist", "geist-latin-600-normal", "600"], ["Geist", "geist-latin-700-normal", "700"], ["Geist", "geist-latin-900-normal", "900"], ["Geist Mono", "geist-mono-latin-500-normal", "500"],
  ["Inter Tight", "inter-tight-latin-500-normal", "500"], ["Inter Tight", "inter-tight-latin-700-normal", "700"], ["Inter Tight", "inter-tight-latin-800-normal", "800"], ["Inter Tight", "inter-tight-latin-900-normal", "900"],
  ["Archivo Black", "archivo-black-latin-400-normal", "400"], ["Archivo", "archivo-latin-800-normal", "800"],
  ["Space Mono", "space-mono-latin-400-normal", "400"], ["Space Mono", "space-mono-latin-700-normal", "700"], ["DM Mono", "dm-mono-latin-500-normal", "500"],
  ["Rubik", "rubik-latin-500-normal", "500"], ["Rubik", "rubik-latin-800-normal", "800"], ["Rubik", "rubik-latin-900-normal", "900"],
  ["Bricolage Grotesque", "bricolage-grotesque-latin-800-normal", "800"], ["DM Serif Display", "dm-serif-display-latin-400-normal", "400"],
  ["Caveat", "caveat-latin-700-normal", "700"], ["IBM Plex Mono", "ibm-plex-mono-latin-400-normal", "400"], ["IBM Plex Mono", "ibm-plex-mono-latin-600-normal", "600"],
  ["DM Serif Display", "dm-serif-display-latin-400-italic", "400", "italic"], ["Instrument Serif", "instrument-serif-latin-400-italic", "400", "italic"],
];
/** 整片最外层调用一次：加载风格库用到的全部字体（缺文件的跳过） */
export const useStyleFonts = () => {
  const [h] = useState(() => delayRender("style fonts"));
  useEffect(() => {
    Promise.all(FACES.map(([fam, file, w, style = "normal"]) => new FontFace(fam, `url(${staticFile(`library/fonts/${file}.woff2`)})`, { weight: w, style }).load().then((f) => document.fonts.add(f)).catch(() => null))).then(() => continueRender(h));
  }, [h]);
};

export const Abs: React.FC<{ x: number; y: number; children: React.ReactNode; style?: React.CSSProperties }> = ({ x, y, children, style }) => <div style={{ position: "absolute", left: x, top: y, ...style }}>{children}</div>;
export const Full: React.FC<{ children?: React.ReactNode; style?: React.CSSProperties }> = ({ children, style }) => <AbsoluteFill style={{ overflow: "hidden", ...style }}>{children}</AbsoluteFill>;

/** 白字 8 向黑描边字幕（多数深色风格通用） */
export const OutlineCaption: React.FC<{ text: string; font: string; color?: string; size?: number }> = ({ text, font, color = "#fff", size = 44 }) => (
  <div style={{ position: "absolute", left: 0, right: 0, bottom: 48, display: "flex", justifyContent: "center" }}>
    <div style={{ maxWidth: 1500, textAlign: "center", fontFamily: font, fontWeight: 700, fontSize: size, lineHeight: 1.25, color, textShadow: "2px 0 #000,-2px 0 #000,0 2px #000,0 -2px #000,1.5px 1.5px #000,-1.5px -1.5px #000,1.5px -1.5px #000,-1.5px 1.5px #000,0 6px 16px rgba(0,0,0,.85)" }}>{text}</div>
  </div>
);
/** 底色条字幕（浅色风格用：纸面、白底） */
export const BarCaption: React.FC<{ text: string; font: string; color: string; bg: string; size?: number; weight?: number }> = ({ text, font, color, bg, size = 42, weight = 700 }) => (
  <div style={{ position: "absolute", left: 0, right: 0, bottom: 48, display: "flex", justifyContent: "center" }}>
    <div style={{ maxWidth: 1500, textAlign: "center", fontFamily: font, fontWeight: weight, fontSize: size, lineHeight: 1.3, color, background: bg, padding: "8px 24px" }}>{text}</div>
  </div>
);
export const Grain: React.FC<{ op: number; freq?: number; blend?: React.CSSProperties["mixBlendMode"] }> = ({ op, freq = 0.9, blend = "multiply" }) => (
  <svg width={1920} height={1080} style={{ position: "absolute", inset: 0, opacity: op, mixBlendMode: blend, pointerEvents: "none" }}>
    <filter id={`g${freq}`}><feTurbulence type="fractalNoise" baseFrequency={freq} numOctaves={3} stitchTiles="stitch" /><feColorMatrix type="saturate" values="0" /></filter>
    <rect width="100%" height="100%" filter={`url(#g${freq})`} />
  </svg>
);
