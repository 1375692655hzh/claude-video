// 风格库注册表：脚本和项目里写风格 ID，代码按 ID 取外观组件。说明、样张、使用记录在 shared/style-library/。
import { StyleKit } from "./kit";
import { CARDS_KIT, DOCUMENTARY_KIT, GLASS_KIT, NAVY_KIT, NEWSPAPER_KIT, SWISS_KIT, TERMINAL_KIT } from "./kits";
import { DECO_KIT } from "./deco-kit";

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
};
export type StyleId = keyof typeof STYLES;
export const getStyle = (id: string): StyleKit => {
  const s = STYLES[id];
  if (!s) throw new Error(`风格库里没有 ${id}（可用：${Object.keys(STYLES).join(" / ")}）`);
  return s;
};
