// 镜头编号 → 场景组件
import React from "react";
import { SceneProps, Shot1, Shot2, Shot3, Shot4, Shot5, Shot6, Shot7 } from "./scenes-a";
import { Shot8, Shot9, Shot10, Shot11, Shot12, Shot13, Shot14, Shot15 } from "./scenes-b";
import { Shot16, Shot17, Shot18, Shot19, Shot20, Shot21, Shot22, Shot23 } from "./scenes-c";

export const SCENES: Record<number, React.FC<SceneProps>> = {
  1: Shot1, 2: Shot2, 3: Shot3, 4: Shot4, 5: Shot5, 6: Shot6, 7: Shot7, 8: Shot8,
  9: Shot9, 10: Shot10, 11: Shot11, 12: Shot12, 13: Shot13, 14: Shot14, 15: Shot15, 16: Shot16,
  17: Shot17, 18: Shot18, 19: Shot19, 20: Shot20, 21: Shot21, 22: Shot22, 23: Shot23,
};
