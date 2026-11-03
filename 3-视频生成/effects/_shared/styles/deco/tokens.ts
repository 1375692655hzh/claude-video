// 来自 projects/2026/11/2026-11-02-marvell-lumentum/05-制作/remotion/deco/（Gilded Deco），2026-11-03 收进公共风格库
// Gilded Deco 视觉规范（见 02-脚本/风格规范.md）。颜色只从这里取。
export const C = {
  bg: "#0B0C11",
  cream: "#F3EAD0",
  muted: "#A9A08A",
  gold: "#C9A961",
  goldHi: "#F1E3B6",
  goldDeep: "#7D6234",
  glow: "rgba(233,210,150,0.45)",
  glass: "rgba(10,14,22,0.72)",
  up: "#8FD3A8",
  down: "#F08C7A",
};

export type Gem = "ruby" | "sapphire" | "emerald" | "onyx";
export const GEM: Record<Gem, { a: string; b: string; edge: string }> = {
  ruby: { a: "#4A1E27", b: "#2A1016", edge: "rgba(240,140,122,0.18)" },
  sapphire: { a: "#262A5E", b: "#141738", edge: "rgba(150,160,255,0.16)" },
  emerald: { a: "#1D3D30", b: "#0E231B", edge: "rgba(143,211,168,0.16)" },
  onyx: { a: "#17181D", b: "#0C0D11", edge: "rgba(233,210,150,0.10)" },
};

export const F = {
  display: "DecoDisplay, Montserrat, sans-serif",
  label: "DecoLabel, Cinzel, serif",
};

export const SAFE = 96;
