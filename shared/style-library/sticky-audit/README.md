# sticky-audit · 便签复盘

- 状态：可用
- 样子：冷白方格证据墙、带编号标签的纸卡、黄便签手写批注、底部四色阶段轨道，工程复盘感
- 适合：流程拆解、排查复盘、逐项验收、前后对比
- 慎用：需要大图冲击力的开场
- 字体：Inter Tight + IBM Plex Mono + Caveat（SIL OFL，文件在 `3-视频生成/public/library/fonts/`）
- 是否依赖实拍：否：纯图形也成立
- 代表作：—
- 展示卡：`preview.jpg`；标准样张：`samples/01–04.jpg`（章节开场 / 大数字 / 两年对比 / 动效库动作）

## 代码里怎么用

```tsx
import { getStyle, useStyleFonts } from "@shared/styles";
import { MotionTheme, Motion } from "@shared/motion";
const K = getStyle("sticky-audit");          // 外观组件：Backdrop / Panel / Title / BigNumber / Row / Chrome / ChapterBadge / Caption
// 整片最外层 useStyleFonts() 一次；动效库动作包 <MotionTheme theme="sticky-audit"> 自动换成本风格配色
```

色板：底 #F4F4EC、墨 #15141A、橙 / 跌 #E4572E、紫 #7A5AE0、蓝 #3461E0、绿 / 涨 #2FB67C
