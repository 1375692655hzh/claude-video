# showa-poster · 昭和海报

- 状态：可用
- 样子：黑页 + 红色放射线、衬线巨字 + 红色下划线、倾斜红幅标签、双线直角框和方框判子
- 适合：强观点、重磅事件、翻车 / 颠覆类开场
- 慎用：轻松闲聊、温和教程、多图并列
- 字体：Playfair Display + Archivo（SIL OFL，文件在 `3-视频生成/public/library/fonts/`）
- 是否依赖实拍：否：纯图形也成立
- 代表作：—
- 展示卡：`preview.jpg`；标准样张：`samples/01–04.jpg`（章节开场 / 大数字 / 两年对比 / 动效库动作）

## 代码里怎么用

```tsx
import { getStyle, useStyleFonts } from "@shared/styles";
import { MotionTheme, Motion } from "@shared/motion";
const K = getStyle("showa-poster");          // 外观组件：Backdrop / Panel / Title / BigNumber / Row / Chrome / ChapterBadge / Caption
// 整片最外层 useStyleFonts() 一次；动效库动作包 <MotionTheme theme="showa-poster"> 自动换成本风格配色
```

色板：底 #10110F、奶白 #F3F3E9、朱红 / 跌 #D4002F、涨 #8BC79A、次文字 #8A8880
