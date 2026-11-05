# color-cards · 彩卡拼贴

- 状态：可用
- 样子：深色桌面上散着倾斜的饱和色卡（蓝 / 黄 / 粉），内容卡按好坏换色，橙色胶囊标签 + 米白主卡托大数
- 适合：“它能做什么”式盘点、案例墙、功能枚举
- 慎用：抽象论证、严肃数据
- 字体：Bricolage Grotesque + Archivo Black + Inter（SIL OFL，文件在 `3-视频生成/public/library/fonts/`）
- 是否依赖实拍：否：纯图形也成立
- 代表作：—
- 展示卡：`preview.jpg`；标准样张：`samples/01–04.jpg`（章节开场 / 大数字 / 两年对比 / 动效库动作）

## 代码里怎么用

```tsx
import { getStyle, useStyleFonts } from "@shared/styles";
import { MotionTheme, Motion } from "@shared/motion";
const K = getStyle("color-cards");          // 外观组件：Backdrop / Panel / Title / BigNumber / Row / Chrome / ChapterBadge / Caption
// 整片最外层 useStyleFonts() 一次；动效库动作包 <MotionTheme theme="color-cards"> 自动换成本风格配色
```

色板：桌面 #16140F、文字 #F3EFE4、蓝 #2F4BDB、黄 #EDD456、绿 #1F6B4A、橙 #D9603B、粉 #F2B6A8
