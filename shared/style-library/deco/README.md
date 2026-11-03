# deco · 金色装饰艺术（Gilded Deco）

- 状态：可用
- 样子：近黑底叠虚化实拍、宝石色卡片、香槟金双线框 + 角花 + 扇形纹、金色渐变大数字
- 适合：并购、大交易、高估值公司、重大事件
- 慎用：日常快讯（太隆重）
- 字体：Montserrat + Cinzel（SIL OFL，文件在 `3-视频生成/public/library/fonts/`）
- 是否依赖实拍：是：底层要有实拍或官方照片，没有素材的期不要选
- 代表作：2026-11-02-marvell-lumentum
- 展示卡：`preview.jpg`；标准样张：`samples/01–04.jpg`（章节开场 / 大数字 / 两年对比 / 动效库动作）

## 代码里怎么用

```tsx
import { getStyle, useStyleFonts } from "@shared/styles";
import { MotionTheme, Motion } from "@shared/motion";
const K = getStyle("deco");          // 外观组件：Backdrop / Panel / Title / BigNumber / Row / Chrome / ChapterBadge / Caption
// 整片最外层 useStyleFonts() 一次；动效库动作包 <MotionTheme theme="deco"> 自动换成本风格配色
```

色板：底 #0B0C11、蓝宝石 #262A5E、红宝石 #4A1E27、祖母绿 #1D3D30、金线 #C9A961、文字 #F3EAD0、涨 #8FD3A8、跌 #F08C7A
- 成片截图展示卡：`preview-works.jpg`（代表作真实画面）
