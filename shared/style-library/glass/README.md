# glass · 玻璃拟态

- 状态：可用
- 样子：紫青粉渐变光斑底、半透明磨砂玻璃卡片、白色细描边、渐变色大数字
- 适合：AI、新产品、偏年轻的科技题材
- 慎用：严肃的财务风险、坏消息
- 字体：Space Grotesk（SIL OFL，文件在 `3-视频生成/public/library/fonts/`）
- 是否依赖实拍：否：纯图形也成立
- 代表作：—
- 展示卡：`preview.jpg`；标准样张：`samples/01–04.jpg`（章节开场 / 大数字 / 两年对比 / 动效库动作）

## 代码里怎么用

```tsx
import { getStyle, useStyleFonts } from "@shared/styles";
import { MotionTheme, Motion } from "@shared/motion";
const K = getStyle("glass");          // 外观组件：Backdrop / Panel / Title / BigNumber / Row / Chrome / ChapterBadge / Caption
// 整片最外层 useStyleFonts() 一次；动效库动作包 <MotionTheme theme="glass"> 自动换成本风格配色
```

色板：底 #120C2E、紫光 #7B5CFF、青光 #22D3EE、粉光 #F472B6、文字 #FFFFFF、涨 #67E8F9、跌 #FB7185
