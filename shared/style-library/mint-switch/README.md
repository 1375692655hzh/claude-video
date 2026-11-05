# mint-switch · 黑白薄荷

- 状态：可用
- 样子：近黑柔光舞台 + 淡网格、深色卡片、等宽大数字，只有一个薄荷绿；顶部步骤条
- 适合：工作原理、几步走、流程拆解、AI / 自动化讲解
- 慎用：吐槽、情绪段落
- 字体：Inter Tight + JetBrains Mono（SIL OFL，文件在 `3-视频生成/public/library/fonts/`）
- 是否依赖实拍：否：纯图形也成立
- 代表作：—
- 展示卡：`preview.jpg`；标准样张：`samples/01–04.jpg`（章节开场 / 大数字 / 两年对比 / 动效库动作）

## 代码里怎么用

```tsx
import { getStyle, useStyleFonts } from "@shared/styles";
import { MotionTheme, Motion } from "@shared/motion";
const K = getStyle("mint-switch");          // 外观组件：Backdrop / Panel / Title / BigNumber / Row / Chrome / ChapterBadge / Caption
// 整片最外层 useStyleFonts() 一次；动效库动作包 <MotionTheme theme="mint-switch"> 自动换成本风格配色
```

色板：底 #0B0D0C、卡片 #141816、文字 #F3F5EF、薄荷 / 涨 #4DEB9F、跌 #FF6B5E
