# shared/style-library/：视频风格库

一套“视频风格”= 长什么样（配色、字体、卡片和装饰、标题字幕、背景处理、版式规则）。
动效（怎么动）在 `3-视频生成/effects/_shared/motion/`，和风格分开：任何风格都能配全部动效。

## 用户怎么选

- 双击 **`预览.html`**（浏览器打开，不用联网）：每套风格一张展示卡 + 4 张标准样张，点图放大；顶部选账号，用过的标 ★ 排在最前；勾“显示待做风格”能看到还没做的候选。
- 或看各风格文件夹里的 `preview.jpg`。
- 命令：`node shared/tools/style.mjs list`（可用风格）/ `history --account Andy`（账号用过哪些）/ `use <项目ID> <风格ID>`（登记本期风格，写入 project.json 并刷新预览页）。

## 现有风格

| ID | 名称 | 状态 | 适合 |
|---|---|---|---|
| `cards` | 浅色卡片 | 可用 | 财报逐项拆解、数据密集 |
| `navy` | 深海军蓝 | 可用 | 科技公司财报、宏观、大盘 |
| `deco` | 金色装饰艺术（Gilded Deco） | 可用 | 并购、大交易、重大事件 |
| `documentary` | 暖色纪录片 | 可用 | 人物和公司故事、长篇叙事（需要实拍） |
| `glass` | 玻璃拟态 | 可用 | AI、新产品、年轻科技题材 |
| `terminal` | 交易终端 | 可用 | 市场快讯、股价异动、盘前盘后 |
| `newspaper` | 报纸 / 财经杂志 | 可用 | 深度分析、历史复盘 |
| `swiss` | 极简黑白（瑞士风） | 可用 | 观点类、一个数字讲清一件事 |
| `blueprint` | 蓝图 / 工程图 | 待做 | 半导体、产业链、产品拆解 |
| `neon` | 赛博霓虹 | 待做 | 加密货币、游戏（要节制） |
| `journal` | 手账 / 便签 | 待做 | 轻松科普、投资入门 |
| `paper-signal` | 纸白信号橙 | 可用 | 产品发布、功能清单、步骤流程、数据结论 |
| `sticker-pop` | 贴纸波普 | 可用 | 痛点 → 踩坑 → 方案、工具翻车、轻松教程 |
| `mint-switch` | 黑白薄荷 | 可用 | 工作原理、几步走、AI / 自动化讲解 |
| `warm-haze` | 暖雾 | 可用 | 产品演示、温和的上手教程 |
| `sticky-audit` | 便签复盘 | 可用 | 流程拆解、排查复盘、前后对比 |
| `riso-print` | 孔版印刷 | 可用 | 轻松的工具盘点、三五个要点、A 对 B |
| `showa-poster` | 昭和海报 | 可用 | 强观点、重磅事件、翻车开场 |
| `retro-sunburst` | 复古旭日 | 可用 | 里程碑、破纪录、榜单、欢庆结尾 |
| `color-cards` | 彩卡拼贴 | 可用 | 功能枚举、案例墙 |
| `bauhaus-grid` | 包豪斯几何 | 可用 | 结构、拆模块、产业链 / 架构 |

后 10 套（2026-11-05 引入，同日用户确认全部可用）从 `ajiang-video-broll` skill 的 B-roll 模板移植：外观组件在 `3-视频生成/effects/_shared/styles/broll-kits.tsx`，
原模板（含招牌版式、动效编排、拟音配乐）在 `.agents/skills/ajiang-video-broll/assets/themes/<id>/`，怎么用见该目录的 `本项目说明.md`。

**状态**：`ready` 可用 → `review` 待确认（组件和样张已做好、`use` 会拦下，用户看过展示卡后在 `_build/build_library.py` 里改成 `ready` 并重跑）→ `candidate` 待做（只有静态概念图）。

## 一套风格包含什么

```
<id>/
  style.json      名称、状态、样子、适合 / 慎用、字体、色板、是否依赖实拍、代表作、对应代码
  README.md       给人看的说明 + 代码用法
  preview.jpg     展示卡（主画面 + 3 张样张 + 色板 + 字体 + 适用）
  samples/01–04   标准样张：章节开场 / 大数字 / 两年对比 / 动效库动作
```

代码：外观组件在 `3-视频生成/effects/_shared/styles/`（`getStyle(id)` 取 `Backdrop / Panel / Title / BigNumber / Row / Chrome / ChapterBadge / Caption`），
配色同时登记为动效库主题（`3-视频生成/effects/_shared/motion/theme.ts`）。标准样张合成：`3-视频生成/effects/style-library/`（`style-sample-<id>`）。

## 新增一套风格（用户提供参考图，或把“待做”做成“可用”）

1. 参考图放进本期 `03-素材/refs/`，提炼：底、卡片 / 装饰形状、字体、主色和涨跌色、标题与字幕处理、版式；参考图里的具体内容、水印、品牌不照搬。
2. 在 `motion/theme.ts` 加主题（颜色只用语义名），在 `styles/kits.tsx` 写外观组件，在 `styles/index.ts` 登记；字体放 `public/library/fonts/`（只用 OFL 等可商用授权）。
3. 出标准样张：`style-sample-<id>` 的第 75 / 165 / 255 / 345 帧 → `_samples/`；在生成脚本里登记这一套（名称、样子、适合、慎用、字体、色板），重新生成文件夹和展示卡；`node shared/tools/style.mjs page`。
4. 给用户看展示卡确认后，状态改为 `ready`。检查：`tsc`、`eslint`、深浅两类背景上的字幕可读性。

## 使用记录

`usage.json`：按账号记录每期用的风格（选定 / 试做 / 成片）。出片后用 `style.mjs use … --status 成片` 再登记一次。
