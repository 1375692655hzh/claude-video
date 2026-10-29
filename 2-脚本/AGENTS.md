# 第 2 步：视频脚本

根据审核通过的视频稿和其他材料（参考视频、录音、文档），理解内容，做出一份**第 3 步可以直接照着做**的视频脚本：
定风格、切分镜、找素材、设计每一页的画面和动画。交付 Markdown（`<期名>/script.md`），需要时同步一份腾讯文档。
整个工作流的分工和交接见上一层 `../AGENTS.md`。

## 输入与输出

- 输入：`../1-视频稿/<期名>/03-终稿-en.md`（英文口播原文，频道只发英文视频；**这一步不改口播文字**，要改回第 1 步）和中文底稿 `03-终稿.md`（供理解内容）；其他材料放 `<期名>/材料/`。
- 输出：`<期名>/script.md`（按 `templates/脚本模板.md`）+ 参考图 / 草图放 `<期名>/`；用户确认后交第 3 步。

## 流程

1. **读懂内容**：通读终稿和材料，列出每章的核心论点、关键数据、需要"看见"的东西（产品、工厂、人物、图表）。
2. **定风格**（写进脚本第一节，先给用户看）：
   - 配音：MiMo 英文音色（Mia / Chloe / Milo / Dean，待试听选定；冰糖是中文音色）；其他音色试听 `../shared/voice-library/`。
   - 主持人：是否用数字人出镜、怎么出镜（全屏开场 / 画中画）。
   - 背景音乐：从 4 首现成财经科技配乐里选（`../3-视频生成/public/library/README.md`），可按章节换。
   - 视觉：配色、字体、图表风格、转场；默认延续上一期 `caspa-ai-profit` 的风格。
3. **切分镜**：按口播原文切镜头，每镜 3–8 秒；每个镜头定画面类型（素材视频 / 素材图片 / 生成图 / 图表动画 / 文字卡片 / 数字人）。
4. **找素材**（固定流程，库是共享的 `../shared/asset-library/`）：
   按镜头列素材需求 → **先查库** `npm run assets -- search <关键词>` → 库里没有的用
   `../shared/asset-library/grok-prompt-template.md` 交给 Grok 找 → `npm run assets -- import` 导入 → `verify` 核实 → `thumbs` 缩略图。
   脚本里写**库 ID + 秒数片段**（如 `yt-YsiccpVKUIs 205-226`）；**这一步不下载片段**，下载在第 3 步（`assets fetch`）。
   找不到的写"待找"或改用生成图（写出提示词）。
5. **页面与动画设计**：关键页面写清版式、图表的数据和单位、动画节奏（什么时候出现、怎么强调）；需要时用
   `npm run image` 出草图或参考图。
6. **音效**：只在章节切换、揭晓关键结论、关键数据出现时标注，遵守音效使用规范（每分钟 ≤ 4 个等，见 `../3-视频生成/public/library/README.md`）。
7. **交用户确认**，确认后状态改为"已确认（交第 3 步）"。

## 常用命令（在本文件夹运行）

| 用途 | 命令 |
|---|---|
| 查素材库 | `npm run assets -- search <关键词> [--domain 半导体] [--shot 产品特写]` |
| 导入 / 核实 / 缩略图 | `npm run assets -- import <grok.json> --project <期名>` / `verify --unverified` / `thumbs --missing` |
| 拉腾讯文档材料 | `npm run fetch-doc -- <链接> <期名>/材料/xx.md` |
| 出草图 / 参考图 | `npm run image -- "提示词" <期名>/ref-01.png` |
| 问 agy 意见（可选） | `npm run consult -- "问题" --file <期名>/script.md --out <期名>/agy建议.md` |

素材库的字段、分类、Grok 用法见 `../shared/asset-library/README.md`；YouTube cookies 和限速注意事项见 `../AGENTS.md`。
