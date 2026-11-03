# newspaper · 报纸 / 财经杂志

- 状态：可用
- 样子：米白纸纹底、报头 + 双线、衬线大标题、分栏细线、红黑双色、网点印刷感配图
- 适合：深度分析、历史复盘、长文解读
- 慎用：节奏很快的短视频
- 字体：Playfair Display + Lora（SIL OFL，文件在 `3-视频生成/public/library/fonts/`）
- 是否依赖实拍：否：纯图形也成立
- 代表作：—
- 展示卡：`preview.jpg`；标准样张：`samples/01–04.jpg`（章节开场 / 大数字 / 两年对比 / 动效库动作）

## 代码里怎么用

```tsx
import { getStyle, useStyleFonts } from "@shared/styles";
import { MotionTheme, Motion } from "@shared/motion";
const K = getStyle("newspaper");          // 外观组件：Backdrop / Panel / Title / BigNumber / Row / Chrome / ChapterBadge / Caption
// 整片最外层 useStyleFonts() 一次；动效库动作包 <MotionTheme theme="newspaper"> 自动换成本风格配色
```

色板：纸 #F1ECE1、墨 #1B1A17、次文字 #4A463E、红 #B3261E、绿 #2F6B3A
