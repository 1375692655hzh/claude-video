# sticker-pop · 贴纸波普

- 状态：可用
- 样子：白板点阵底、粗墨描边窗口贴纸 + 彩色标题栏 + 硬投影、胶囊标签，热闹的手作拼贴感
- 适合：痛点 → 踩坑 → 方案、工具翻车、轻松向教程
- 慎用：严肃数据结论、高级发布会感
- 字体：Archivo Black + Space Grotesk + Space Mono（SIL OFL，文件在 `3-视频生成/public/library/fonts/`）
- 是否依赖实拍：否：纯图形也成立
- 代表作：—
- 展示卡：`preview.jpg`；标准样张：`samples/01–04.jpg`（章节开场 / 大数字 / 两年对比 / 动效库动作）

## 代码里怎么用

```tsx
import { getStyle, useStyleFonts } from "@shared/styles";
import { MotionTheme, Motion } from "@shared/motion";
const K = getStyle("sticker-pop");          // 外观组件：Backdrop / Panel / Title / BigNumber / Row / Chrome / ChapterBadge / Caption
// 整片最外层 useStyleFonts() 一次；动效库动作包 <MotionTheme theme="sticker-pop"> 自动换成本风格配色
```

色板：底 #FCFEF3、墨 #1C1624、粉 #F58AE8、蓝 #BDEBF5、绿 #A6EB9B、黄 #F2CF63、跌 #E5383B
