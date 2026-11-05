# paper-signal · 纸白信号橙

- 状态：可用
- 样子：瑞士国际主义海报：暖灰纸底 + 12 栏细线网格、四角刻度、巨号几何数字配刻度尺，唯一的信号橙
- 适合：产品发布、功能清单、步骤流程、数据结论、观点总结
- 慎用：情绪化吐槽、需要可爱感的内容
- 字体：Inter Tight + Geist + Geist Mono（SIL OFL，文件在 `3-视频生成/public/library/fonts/`）
- 是否依赖实拍：否：纯图形也成立
- 代表作：—
- 展示卡：`preview.jpg`；标准样张：`samples/01–04.jpg`（章节开场 / 大数字 / 两年对比 / 动效库动作）

## 代码里怎么用

```tsx
import { getStyle, useStyleFonts } from "@shared/styles";
import { MotionTheme, Motion } from "@shared/motion";
const K = getStyle("paper-signal");          // 外观组件：Backdrop / Panel / Title / BigNumber / Row / Chrome / ChapterBadge / Caption
// 整片最外层 useStyleFonts() 一次；动效库动作包 <MotionTheme theme="paper-signal"> 自动换成本风格配色
```

色板：纸 #ECEAE4、墨 #12110E、次文字 #7A766F、信号橙 #F2561E、涨 #1F8A4C、跌 #C8361B
