# terminal · 交易终端

- 状态：可用
- 样子：黑底绿网格、顶部滚动行情条、等宽字体数据表、琥珀色提示、闪烁光标
- 适合：市场快讯、股价异动、盘前盘后、技术面
- 慎用：人物故事（太冷）
- 字体：JetBrains Mono（SIL OFL，文件在 `3-视频生成/public/library/fonts/`）
- 是否依赖实拍：否：纯图形也成立
- 代表作：—
- 展示卡：`preview.jpg`；标准样张：`samples/01–04.jpg`（章节开场 / 大数字 / 两年对比 / 动效库动作）

## 代码里怎么用

```tsx
import { getStyle, useStyleFonts } from "@shared/styles";
import { MotionTheme, Motion } from "@shared/motion";
const K = getStyle("terminal");          // 外观组件：Backdrop / Panel / Title / BigNumber / Row / Chrome / ChapterBadge / Caption
// 整片最外层 useStyleFonts() 一次；动效库动作包 <MotionTheme theme="terminal"> 自动换成本风格配色
```

色板：底 #030605、网格线 #3E6B52、文字 #E8FFF2、琥珀强调 #FFB000、涨 #32F08C、跌 #FF4D5E
