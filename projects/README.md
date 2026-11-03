# projects/：每期视频一个独立项目

2026-11-02 起的新视频都在这里，一期一个目录，从初稿到成片的全部本期资料都放在里面。
目录内容只留本地，不进 git（只提交本说明）。旧期（`YYYY-MM-短名`）仍在 `1-视频稿/`、`2-脚本/`、`3-视频生成/` 原路径，不迁移。

## 命令（在任一执行文件夹运行 `npm run project -- …`，或 `node shared/tools/project.mjs …`）

| 用途 | 命令 |
|---|---|
| 新建项目 | `new <英文短名> [--persona Andy] [--platform youtube-long] [--date YYYY-MM-DD]` |
| 列出项目（含旧期） | `list` |
| 进度 + 门禁 | `status <ID>` |
| 门禁检查 | `check <ID> [--step N]`（不通过时退出码 1） |
| 改进度 | `set <ID> step=6 next="…" blocker="…" blockers= persona=… platform=… status=done` |
| 用户直接交付成稿 | `final <ID> <文件>`（存为 `01-视频稿/03-终稿-en.md`，跳过④⑤到⑥） |
| 各阶段路径 | `paths <ID>`（新项目和旧期通用） |
| 外部交付提示词 | `handoff <ID> list` / `new <H01…H07> --tool grok` / `send|done|close <编号>`（模板与规则见 `shared/handoff/README.md`） |
| Studio / 渲染 / 检查代码 | `studio <ID>` / `render <ID> [--comp X] [--deliver youtube-shorts-01] [--preview [文件名]] [-- 其他 remotion 参数]` / `lint <ID>` |

`render` 会先自动跑第⑩步门禁，不通过就拒绝写 `06-交付/`；只想看效果（⑨定风格、⑩先出关键段）用 `--preview`，输出到 `05-制作/cache/preview/`。
成稿相关的门禁是硬性的：成稿必须有用户确认记录（`set <ID> finalConfirmed=true`，`final` 命令自动记）；走③④⑤时必须有 `01-初稿.md` 和 `02-外部建议.md`，用户明确决定跳过外审时 `set <ID> adviceSkipped=true`。

项目 ID：`YYYY-MM-DD-小写英文短名`，按年月归档到 `projects/YYYY/MM/<ID>/`；同名不覆盖，建好后不再移动。

## 单项目结构

```
<ID>/
  project.json          进度的唯一记录：persona / platform / deliveredFinal / finalConfirmed / adviceSkipped / step / status / next / blockers
  00-项目设置.md         ①②的决定（人设、平台、语言、画幅、时长、来源模式）；不写进度
  01-视频稿/             01-初稿.md、02-外部建议.md、03-终稿-en.md（成稿）、03-终稿.md（中文底稿，可选）
  02-脚本/               script-draft.md（⑥）、assets.md（⑦⑧）、script.md（⑨）、ClaudeChat生成交接.md（可选）
  03-素材/
    原始/                用户提供的原始文件（⑧），不改不覆盖
    生产/                本期实际用到的图片、视频片段、截图（⑩）  → 代码里 staticFile("assets/…")
    refs/                风格参考图（⑨至少一张）
  04-音频/               voice/、voice.json、host/（数字人）、mix/      → staticFile("audio/…")
  05-制作/
    remotion/            本期动画代码：Composition.tsx 导出 ProjectCompositions；tsconfig.json 由 new 生成
    cache/               临时文件（Windows 下的合成 public 链接也在这里）
  06-交付/<平台>[-NN]/   video.mp4、subtitles.srt、cover.png、发布包装.md
  07-复盘.md             发布后复盘（需要时再建）
  08-外部交付/           交给 Grok / Gemini / Codex / 用户的提示词与原始回复（handoff 命令生成，编号 NN-Hxx-模板-工具）
  derivatives/<平台-NN>/ 由本期长视频拆出的短视频稿件、脚本（需要时再建；成片仍进 06-交付/<平台-NN>/）
```

## 动画代码怎么写

- 公共库：`import { Frame, MotionTheme } from "@shared/motion"`、`import { Bgm } from "@shared/Bgm"`（指向 `3-视频生成/effects/_shared/`）。
- 素材：`staticFile("assets/…")` = `03-素材/生产/…`；`staticFile("audio/…")` = `04-音频/…`；
  `staticFile("library/…")` = `3-视频生成/public/library/…`（公共配乐、音效、字体，动效库自动用）。
- 不引用其他项目或旧期的文件（`check` 会报错）；要复用旧素材就复制到本项目 `03-素材/生产/`。
- 新动效先写在本项目；两期以上复用并验证后再收进 `3-视频生成/effects/_shared/motion/`。
- 不在项目里装依赖；Remotion 引擎和 node_modules 只有 `3-视频生成/` 一份。
