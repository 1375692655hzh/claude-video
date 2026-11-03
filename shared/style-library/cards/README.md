# cards · 浅色卡片

- 状态：可用
- 样子：浅灰底、白色大圆角卡片、顶栏 + 进度条 + 字幕条框架、实拍装进卡片，干净中性的“报告感”
- 适合：财报逐项拆解、数据密集、需要长时间阅读
- 慎用：情绪很重的大事件（显得平淡）
- 字体：Inter（SIL OFL，文件在 `3-视频生成/public/library/fonts/`）
- 是否依赖实拍：否：纯图形也成立
- 代表作：2026-10-google-q3-cards
- 展示卡：`preview.jpg`；标准样张：`samples/01–04.jpg`（章节开场 / 大数字 / 两年对比 / 动效库动作）

## 代码里怎么用

```tsx
import { getStyle, useStyleFonts } from "@shared/styles";
import { MotionTheme, Motion } from "@shared/motion";
const K = getStyle("cards");          // 外观组件：Backdrop / Panel / Title / BigNumber / Row / Chrome / ChapterBadge / Caption
// 整片最外层 useStyleFonts() 一次；动效库动作包 <MotionTheme theme="cards"> 自动换成本风格配色
```

色板：底 #F3F5F9、卡片 #FFFFFF、文字 #141B2D、强调 #3366E0、涨 / 好 #0F9F78、跌 / 坏 #E0484E、提醒 #F2A516
- 成片截图展示卡：`preview-works.jpg`（代表作真实画面）
