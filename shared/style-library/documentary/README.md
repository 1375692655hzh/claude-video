# documentary · 暖色纪录片

- 状态：可用
- 样子：满屏暖调实拍、上下黑边、胶片颗粒、暗角，衬线字直接压在画面上，克制的小卡片
- 适合：人物和公司故事、长篇叙事、行业史
- 慎用：没有实拍素材的期（会空）
- 字体：Lora（SIL OFL，文件在 `3-视频生成/public/library/fonts/`）
- 是否依赖实拍：是：底层要有实拍或官方照片，没有素材的期不要选
- 代表作：—
- 展示卡：`preview.jpg`；标准样张：`samples/01–04.jpg`（章节开场 / 大数字 / 两年对比 / 动效库动作）

## 代码里怎么用

```tsx
import { getStyle, useStyleFonts } from "@shared/styles";
import { MotionTheme, Motion } from "@shared/motion";
const K = getStyle("documentary");          // 外观组件：Backdrop / Panel / Title / BigNumber / Row / Chrome / ChapterBadge / Caption
// 整片最外层 useStyleFonts() 一次；动效库动作包 <MotionTheme theme="documentary"> 自动换成本风格配色
```

色板：底 #120D08、金棕强调 #E3B66B、文字 #FFF3DD、次文字 #D9C4A0、涨 #A8C98F、跌 #E07A5F
