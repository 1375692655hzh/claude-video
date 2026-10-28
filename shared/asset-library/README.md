# 素材库

记录做视频用过、找到过的外部素材：**只存来源链接、可用片段、分类和缩略图，不存原文件**。
越用越多，下次先查库，能复用就不用重新找。

| 文件 | 内容 |
|---|---|
| `assets.json` | 素材记录，一条一个素材 |
| `taxonomy.json` | 固定分类（领域 / 镜头 / 授权）和同义词表 |
| `thumbs/<id>.jpg` | 关键帧缩略图（视频取 4 帧横排，图片缩到 480 宽），每张几十 KB |
| `grok-prompt-template.md` | 让 Grok 找素材的固定提示词 |

工具：`shared/tools/assets.mjs`（命令说明见其顶部注释）；在 `2-脚本/`、`3-视频生成/` 里运行 `npm run assets -- <命令>`。
分工：第 2 步查库、导入、核实、缩略图（第 2–6 条）；第 3 步下载片段、回填（第 7–8 条）。`local_path` 等路径相对 `3-视频生成/`。

## 固定流程

1. **读稿提需求**：读视频稿和脚本，按镜头列出素材需求（内容、时长、是否需要官方画面）。
2. **先查库**：`npm run assets -- search 英伟达 机柜`、`search --domain 半导体 --shot 产品特写`。
   搜索会按同义词展开（"英伟达" 能搜到 NVIDIA），用过的排在前面，默认隐藏不可用的。
3. **缺的交给 Grok**：按 `grok-prompt-template.md` 填需求，调用 Grok CLI（用法见 AGENTS.md）。
4. **导入候选**：`npm run assets -- import grok-out.json --project <项目id>`（按链接去重）。
5. **核实**：`npm run assets -- verify --unverified`，私密 / 下架的自动标记不可用并写明原因。
   人工看过不合适的：`reject <id> --reason "画质差 / 有水印 / 内容不符"`。被排除的保留记录，下次不再重复核实。
6. **缩略图**：`npm run assets -- thumbs --missing`，视频只读取几帧，不下载整片。
7. **只下载要用的片段**：`npm run assets -- fetch <id> --window 205-226 --out public/<项目>/video/x.mp4`。
8. **回填**：做完后 `npm run assets -- use <id> --project <项目> --window 205-226 --desc "画面说明" --file <文件>`。
   实际用过的片段（★）比 Grok 猜的时间段（·）准确得多，是素材库里最有价值的部分。

## 一条记录的主要字段

- `id`：`yt-<视频ID>`、`x-<帖子ID>`、`img-<来源>-<内容>`、`gen-<内容>-<项目>`
- `status`：`available` 可用 / `unavailable` 不可用（看 `status_reason`）/ `unverified` 待核实；`verified` 是最后核实日期
- `url`、`platform`、`owner`、`official`、`license`、`published`（发布日期，用来判断画面是否过时）、`duration`
- `domain`、`shot`：只从 `taxonomy.json` 里选；`tags`：自由标签，写同义词表里的标准名
- `windows`：可用片段，`source` 为 `used`（实际用过）/ `checked`（人工看过）/ `grok`（Grok 推测）
- `used_in`：用在哪些项目、哪个片段、生成了哪个文件
- AI 生成图（`license: generated`）额外记录 `prompt`、`negative_prompt` 和 `local_path`，删了也能用同一提示词重新生成

## 分类怎么加

`domain` / `shot` 有新需要时直接加进 `taxonomy.json`；新公司、新产品的别名加到 `synonyms`。
不要为同一个东西造多个标签，先查同义词表。
