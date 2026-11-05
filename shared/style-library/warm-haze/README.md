# warm-haze · 暖雾

- 状态：可用
- 样子：米白底上漂着桃色 / 绿色雾团、大圆角白色产品面板、深色药丸字幕，柔和有景深
- 适合：产品演示、功能讲解、温和的上手教程
- 慎用：快节奏盘点、强对比、坏消息
- 字体：Inter Tight + Inter（SIL OFL，文件在 `3-视频生成/public/library/fonts/`）
- 是否依赖实拍：否：纯图形也成立
- 代表作：—
- 展示卡：`preview.jpg`；标准样张：`samples/01–04.jpg`（章节开场 / 大数字 / 两年对比 / 动效库动作）

## 代码里怎么用

```tsx
import { getStyle, useStyleFonts } from "@shared/styles";
import { MotionTheme, Motion } from "@shared/motion";
const K = getStyle("warm-haze");          // 外观组件：Backdrop / Panel / Title / BigNumber / Row / Chrome / ChapterBadge / Caption
// 整片最外层 useStyleFonts() 一次；动效库动作包 <MotionTheme theme="warm-haze"> 自动换成本风格配色
```

色板：底 #F8F5EE、文字 #1E1E1C、绿 / 涨 #4E7D54、桃 #E4A86C、跌 #C4553A
