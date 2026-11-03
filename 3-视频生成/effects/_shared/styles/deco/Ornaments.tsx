// 来自 projects/2026/11/2026-11-02-marvell-lumentum/05-制作/remotion/deco/（Gilded Deco），2026-11-03 收进公共风格库
import React from "react";
import { C } from "./tokens";

// 装饰艺术角花（左上方向，其他角用 rotate/scale 镜像）
export const Corner: React.FC<{ size?: number; style?: React.CSSProperties }> = ({ size = 46, style }) => (
  <svg width={size} height={size} viewBox="0 0 46 46" style={style} fill="none">
    <path d="M2 30 V8 Q2 2 8 2 H30" stroke={C.gold} strokeWidth={1.6} />
    <path d="M8 22 V12 Q8 8 12 8 H22" stroke={C.gold} strokeWidth={1} opacity={0.8} />
    <path d="M14 14 L20 14 L14 20 Z" fill={C.gold} opacity={0.9} />
    <circle cx={30} cy={2} r={1.8} fill={C.goldHi} />
    <circle cx={2} cy={30} r={1.8} fill={C.goldHi} />
  </svg>
);

// 顶部中间扇形 / 皇冠纹
export const Fan: React.FC<{ width?: number }> = ({ width = 64 }) => (
  <svg width={width} height={width * 0.42} viewBox="0 0 64 27" fill="none">
    <path d="M4 25 H60" stroke={C.gold} strokeWidth={1.2} />
    {[...Array(7)].map((_, i) => {
      const a = Math.PI * (0.15 + (i * 0.7) / 6);
      return <path key={i} d={`M32 25 L${32 - Math.cos(a) * 20} ${25 - Math.sin(a) * 20}`} stroke={C.gold} strokeWidth={1} opacity={0.85} />;
    })}
    <path d="M12 25 A20 20 0 0 1 52 25" stroke={C.gold} strokeWidth={1.2} />
    <path d="M29 5 L32 1 L35 5 L32 9 Z" fill={C.goldHi} />
    <circle cx={4} cy={25} r={1.6} fill={C.goldHi} />
    <circle cx={60} cy={25} r={1.6} fill={C.goldHi} />
  </svg>
);

// 细分隔线（两端菱形）
export const Rule: React.FC<{ width: number }> = ({ width }) => (
  <svg width={width} height={10} viewBox={`0 0 ${width} 10`} fill="none">
    <path d={`M8 5 H${width - 8}`} stroke={C.gold} strokeWidth={1} opacity={0.7} />
    <path d="M0 5 L4 1 L8 5 L4 9 Z" fill={C.gold} />
    <path d={`M${width - 8} 5 L${width - 4} 1 L${width} 5 L${width - 4} 9 Z`} fill={C.gold} />
  </svg>
);
