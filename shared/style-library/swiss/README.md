# swiss · 极简黑白（瑞士风）

- 状态：可用
- 样子：白底、超大粗体数字、严格网格、只用一个红色强调，信息极少
- 适合：观点类、“一个数字讲清一件事”、开场钩子
- 慎用：数据很多的页（留白会被挤掉）
- 字体：Inter（SIL OFL，文件在 `3-视频生成/public/library/fonts/`）
- 是否依赖实拍：否：纯图形也成立
- 代表作：—
- 展示卡：`preview.jpg`；标准样张：`samples/01–04.jpg`（章节开场 / 大数字 / 两年对比 / 动效库动作）

## 代码里怎么用

```tsx
import { getStyle, useStyleFonts } from "@shared/styles";
import { MotionTheme, Motion } from "@shared/motion";
const K = getStyle("swiss");          // 外观组件：Backdrop / Panel / Title / BigNumber / Row / Chrome / ChapterBadge / Caption
// 整片最外层 useStyleFonts() 一次；动效库动作包 <MotionTheme theme="swiss"> 自动换成本风格配色
```

色板：底 #FFFFFF、文字 #000000、次文字 #777777、唯一强调 #E30613
