# 第 1 步：视频稿

把用户给的选题或素材，写成一份可以直接口播的视频稿，并在审核通过后做发布包装。
目前只做 **YouTube 长视频**（规范：`platforms/youtube-long.md`）；以后加 Shorts、B 站、Instagram 时在 `platforms/` 新增规范。
整个工作流的分工和交接见上一层 `../AGENTS.md`。

## 目录

```
platforms/youtube-long.md   YouTube 长视频爆款标准（标题、开头、留存、发布包装）——每期都要对照
standards/去AI味.md          去 AI 味的综合清单（humanizer + humanizer-zh + 口播补充）
templates/                   视频稿模板、发布包装模板
consult/                     问 agy 的提问模板
_参考稿/                     用户认可的历史稿件（CASPA 大会稿、一周前瞻），用作文风样本，只学语气和节奏
<期名>/                      每期一个文件夹，期名格式 YYYY-MM-<英文短名>，如 2026-11-ai-profit；第 2、3 步沿用同一个期名
```

## 流程（每个阶段一个文件，逐步推进）

| 阶段 | 产出（`<期名>/` 下） | 做法 | 停下等用户？ |
|---|---|---|---|
| 0 选题与素材 | `00-选题与素材.md` | 记录用户给的选题、链接、录音、要求；腾讯文档用 `npm run fetch-doc -- <链接> <期名>/素材-xx.md` 拉下来 | 选题不清楚时问 |
| 1 初稿 | `01-初稿.md` | 按 `templates/视频稿模板.md`；事实和数据要有出处，不确定的标出来 | 否 |
| 2 爆款优化 | `02-爆款优化.md`、`02b-agy建议.md` | ① Claude 按 `platforms/youtube-long.md` 逐条改，附修改清单和标题评分；② `npm run consult` 让 agy 给第二意见；③ Claude 合成，写明采纳 / 驳回理由 | 否 |
| 3 去 AI 味 | `03-终稿.md` | 用 humanizer-zh skill（英文包装用 humanizer），以 `_参考稿/` 为文风样本，再按 `standards/去AI味.md` 的口播补充清单自检，附命中清单；数字、人名、引用、判断强度不改 | **是：交用户审核** |
| 4 发布包装 | `04-发布包装-youtube.md`、`cover/` | 审核通过后，按 `templates/发布包装模板.md`：标题候选 + 3 个推荐、封面 2–3 版、简介、置顶评论、标签 | 交付后请用户选标题和封面 |

审核通过的 `03-终稿.md` 就是第 2 步的输入；改稿要回到这一步改，不在第 2、3 步里改口播文字。

## 常用命令（在本文件夹运行）

| 用途 | 命令 |
|---|---|
| 拉腾讯文档（正文 + 图片） | `npm run fetch-doc -- <链接> <期名>/素材.md` |
| 问 agy 第二意见 | `npm run consult -- consult/爆款优化-提问.md --file <期名>/02-爆款优化.md --file platforms/youtube-long.md --out <期名>/02b-agy建议.md` |
| 生成封面底图 | `npm run image -- "提示词" <期名>/cover/A-bg.png --size 1280*720` |

agy 默认用 Gemini 4 Argon High（`--model` 可换，`agy models` 查列表），一次 30 秒到几分钟，只读不改文件。
