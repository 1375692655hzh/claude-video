// 风格库注册表：脚本和项目里写风格 ID，代码按 ID 取外观组件。说明、样张、使用记录在 shared/style-library/。
import { StyleKit } from "./kit";
import { CARDS_KIT, DOCUMENTARY_KIT, GLASS_KIT, NAVY_KIT, NEWSPAPER_KIT, SWISS_KIT, TERMINAL_KIT } from "./kits";
import { DECO_KIT } from "./deco-kit";
import { BAUHAUS_GRID_KIT, COLOR_CARDS_KIT, MINT_SWITCH_KIT, PAPER_SIGNAL_KIT, RETRO_SUNBURST_KIT, RISO_PRINT_KIT, SHOWA_POSTER_KIT, STICKER_POP_KIT, STICKY_AUDIT_KIT, WARM_HAZE_KIT } from "./broll-kits";

export * from "./kit";
export const STYLES: Record<string, StyleKit> = {
  cards: CARDS_KIT,
  navy: NAVY_KIT,
  deco: DECO_KIT,
  documentary: DOCUMENTARY_KIT,
  glass: GLASS_KIT,
  terminal: TERMINAL_KIT,
  newspaper: NEWSPAPER_KIT,
  swiss: SWISS_KIT,
  // 2026-11-05 从 ajiang-video-broll 移植（./broll-kits.tsx）
  "paper-signal": PAPER_SIGNAL_KIT,
  "sticker-pop": STICKER_POP_KIT,
  "mint-switch": MINT_SWITCH_KIT,
  "warm-haze": WARM_HAZE_KIT,
  "sticky-audit": STICKY_AUDIT_KIT,
  "riso-print": RISO_PRINT_KIT,
  "showa-poster": SHOWA_POSTER_KIT,
  "retro-sunburst": RETRO_SUNBURST_KIT,
  "color-cards": COLOR_CARDS_KIT,
  "bauhaus-grid": BAUHAUS_GRID_KIT,
};
export type StyleId = keyof typeof STYLES;
export const getStyle = (id: string): StyleKit => {
  const s = STYLES[id];
  if (!s) throw new Error(`风格库里没有 ${id}（可用：${Object.keys(STYLES).join(" / ")}）`);
  return s;
};
