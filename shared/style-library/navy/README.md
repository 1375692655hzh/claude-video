# navy · 深海军蓝

- 状态：可用
- 样子：深蓝底加柔光、深蓝卡片、白色大数字、青色涨 / 红色跌，彭博终端式的专业感
- 适合：科技公司财报、宏观、市场大盘
- 慎用：轻松科普
- 字体：Inter（SIL OFL，文件在 `3-视频生成/public/library/fonts/`）
- 是否依赖实拍：是：底层要有实拍或官方照片，没有素材的期不要选
- 代表作：2026-10-google-q3、caspa-ai-profit
- 展示卡：`preview.jpg`；标准样张：`samples/01–04.jpg`（章节开场 / 大数字 / 两年对比 / 动效库动作）

## 代码里怎么用

```tsx
import { getStyle, useStyleFonts } from "@shared/styles";
import { MotionTheme, Motion } from "@shared/motion";
const K = getStyle("navy");          // 外观组件：Backdrop / Panel / Title / BigNumber / Row / Chrome / ChapterBadge / Caption
// 整片最外层 useStyleFonts() 一次；动效库动作包 <MotionTheme theme="navy"> 自动换成本风格配色
```

色板：底 #06101F、卡片 #0E2242、文字 #F4F8FF、强调 #5B9BFF、涨 / 好 #2EE6F0、跌 / 坏 #FF5A4E、提醒 #FF9A3C
- 成片截图展示卡：`preview-works.jpg`（代表作真实画面）
