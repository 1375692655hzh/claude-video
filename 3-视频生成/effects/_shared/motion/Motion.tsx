// 按 ID 调用动效：<Motion id="waterfall" props={{ ... }} />，ID 和脚本里写的一致。
// 想要类型提示时直接用组件（<Waterfall ... />），两种写法画面一样。
import React from "react";
import { getMotion } from "./registry";

export const Motion: React.FC<{ id: string; props?: Record<string, unknown> }> = ({ id, props = {} }) => {
  const { Component } = getMotion(id);
  return <Component {...props} />;
};
