# riso-print · 孔版印刷

- 状态：可用
- 样子：米纸 + 网点颗粒、粉色斜纹 / 黄色网点色带、粉蓝正片叠底圆、蓝字带粉色套印错位
- 适合：轻松的工具介绍和盘点、三五个要点、A 对 B
- 慎用：严肃评测、数据密集对比表
- 字体：Archivo Black + DM Mono（SIL OFL，文件在 `3-视频生成/public/library/fonts/`）
- 是否依赖实拍：否：纯图形也成立
- 代表作：—
- 展示卡：`preview.jpg`；标准样张：`samples/01–04.jpg`（章节开场 / 大数字 / 两年对比 / 动效库动作）

## 代码里怎么用

```tsx
import { getStyle, useStyleFonts } from "@shared/styles";
import { MotionTheme, Motion } from "@shared/motion";
const K = getStyle("riso-print");          // 外观组件：Backdrop / Panel / Title / BigNumber / Row / Chrome / ChapterBadge / Caption
// 整片最外层 useStyleFonts() 一次；动效库动作包 <MotionTheme theme="riso-print"> 自动换成本风格配色
```

色板：纸 #ECE6D8、蓝墨 #1B72A8、粉 #F0508C、黄 #F2D519、绿 / 涨 #1E5A3A、跌 #EE4B2B
