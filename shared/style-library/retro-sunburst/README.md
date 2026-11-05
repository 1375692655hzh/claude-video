# retro-sunburst · 复古旭日

- 状态：可用
- 样子：奶油色旭日放射条、橙色厚描边立体大字、金边白卡、锯齿金徽章，居中对称的庆典海报
- 适合：里程碑、破纪录、年度榜单、欢庆向结尾
- 慎用：严肃观点、负面翻车、冷静对比
- 字体：Rubik + DM Mono（SIL OFL，文件在 `3-视频生成/public/library/fonts/`）
- 是否依赖实拍：否：纯图形也成立
- 代表作：—
- 展示卡：`preview.jpg`；标准样张：`samples/01–04.jpg`（章节开场 / 大数字 / 两年对比 / 动效库动作）

## 代码里怎么用

```tsx
import { getStyle, useStyleFonts } from "@shared/styles";
import { MotionTheme, Motion } from "@shared/motion";
const K = getStyle("retro-sunburst");          // 外观组件：Backdrop / Panel / Title / BigNumber / Row / Chrome / ChapterBadge / Caption
// 整片最外层 useStyleFonts() 一次；动效库动作包 <MotionTheme theme="retro-sunburst"> 自动换成本风格配色
```

色板：奶油 #F8E9C8、可可 #4F2E16、橙 #F28C28、金 #F6C453、涨 #5E8C3A、跌 #C4442A
