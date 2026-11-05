# bauhaus-grid · 包豪斯几何

- 状态：可用
- 样子：米白纸 + 150px 细网格 + 四角十字 + 底部刻度尺、右侧蓝黄红黑几何格、立体斜体衬线大数（涨用蓝、跌用红）
- 适合：结构和方法、拆模块、列原则、产业链 / 架构
- 慎用：情绪化吐槽、字很多的页
- 字体：DM Serif Display + Archivo Black + IBM Plex Mono（SIL OFL，文件在 `3-视频生成/public/library/fonts/`）
- 是否依赖实拍：否：纯图形也成立
- 代表作：—
- 展示卡：`preview.jpg`；标准样张：`samples/01–04.jpg`（章节开场 / 大数字 / 两年对比 / 动效库动作）

## 代码里怎么用

```tsx
import { getStyle, useStyleFonts } from "@shared/styles";
import { MotionTheme, Motion } from "@shared/motion";
const K = getStyle("bauhaus-grid");          // 外观组件：Backdrop / Panel / Title / BigNumber / Row / Chrome / ChapterBadge / Caption
// 整片最外层 useStyleFonts() 一次；动效库动作包 <MotionTheme theme="bauhaus-grid"> 自动换成本风格配色
```

色板：纸 #F1EDE4、黑 #161414、蓝 / 涨 #2D4BD8、黄 #F4B62C、红 / 跌 #F04A1E、橙红 #FF4F1F
