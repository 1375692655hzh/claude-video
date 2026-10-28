// 常用音效库：文件在 public/library/sfx/，说明见 public/library/README.md。
// 整套统一风格（同一段风格提示词生成）、统一后期（tools/sfx-unify.sh：同一 EQ 和轻混响，平均响度对齐 -18～-23 dB），
// volume 按实测最大瞬时响度再微调到同一听感（约 -13.5 LUFS × 0.3），并压在人声下面；duration 为秒。
// 纯数据文件（不依赖 remotion），规则检查和测试都从这里取。
export const SFX = {
  "whoosh-fast": { file: "library/sfx/sfx-whoosh-fast.mp3", title: "快速转场 嗖", use: "镜头切换、画面滑入", duration: 0.46, volume: 0.38 },
  "whoosh-slow": { file: "library/sfx/sfx-whoosh-slow.mp3", title: "慢速转场 呼", use: "章节切换", duration: 2.25, volume: 0.25 },
  pop: { file: "library/sfx/sfx-pop.mp3", title: "弹出 啵", use: "卡片、标签、图标出现", duration: 1.32, volume: 0.23 },
  count: { file: "library/sfx/sfx-count.mp3", title: "数字滚动 嗒嗒嗒", use: "数字从 0 涨到目标值", duration: 1.08, volume: 0.41 },
  rise: { file: "library/sfx/sfx-rise.mp3", title: "上扬音", use: "柱状图长高、曲线上升", duration: 1.09, volume: 0.25 },
  impact: { file: "library/sfx/sfx-impact.mp3", title: "强调 咚", use: "重点结论、关键数字", duration: 1.84, volume: 0.32 },
  ding: { file: "library/sfx/sfx-ding.mp3", title: "确认 叮", use: "打勾、要点逐条出现", duration: 1.06, volume: 0.31 },
  riser: { file: "library/sfx/sfx-riser.mp3", title: "铺垫上升", use: "揭晓结果前，结尾对准揭晓那一帧", duration: 2.11, volume: 0.23 },
} as const;

export type SfxName = keyof typeof SFX;
