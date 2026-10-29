# 第 3 步：视频生成（Remotion）

照着第 2 步确认过的脚本把视频做出来：配音、下载素材片段、生图、数字人、配乐音效、Remotion 动画、渲染。
这是一个长期使用的 Remotion 项目，所有动画共享本文件夹的依赖，**不要**在子文件夹里新建项目或再装一套依赖。
整个工作流的分工、交接、密钥和通用排错见上一层 `../AGENTS.md`。

## 输入

- `../2-脚本/<期名>/script.md`（状态为"已确认"）：风格、分镜、素材库 ID + 片段、动画设计、音效。
- 口播原文以 `../1-视频稿/<期名>/03-终稿-en.md`（英文，频道只发英文视频）为准；脚本和终稿不一致时停下问用户，不在这一步改口播文字。
- 动画文件夹和 `public/` 子目录用同一个期名（`effects/<期名>/`、`public/<期名>/`）。

## 环境

- Remotion 4.0.538，React 19.2.3，TypeScript 5.9.3，打包器 Rspack（见 `remotion.config.ts`）
- 渲染时 Remotion 使用自带的 FFmpeg（`@remotion/compositor-win32-x64-msvc`）；系统 FFmpeg 用于手动转码和素材处理

## 项目结构

```
effects/                 所有动画
  index.tsx              注册表：每个动画在此 import 并加入列表
  <期名>/                一期一个文件夹（小写+连字符），Composition.tsx 导出 <XxxComposition />，id = 文件夹名
  _shared/               多个动画共用：AvatarHost 数字人、Bgm + music-library.ts、Sfx/SfxTrack + sfx-library.ts + sfx-rules.ts
  caspa-ai-profit/       第一期成片
  avatar-host-demo/      数字人全屏 → 画中画演示（也是 SfxTrack 的用法示例）
  bgm-preview/           试听配乐（Studio 里改 track / seconds，看循环接缝）
  sfx-preview/           依次试听常用音效
src/                     入口（index.ts 不要改；Root.tsx 只挂载 effects 注册表）
public/                  静态素材，staticFile("xxx") 引用；每期的素材放 public/<期名>/
  library/               各期反复用的配乐 music/ 和音效 sfx/，说明见其 README.md
out/                     渲染输出（不进 git）
tools/
  avatar-host.mjs        数字人主持人：挑帧 / 准备人像和配音 / 上传 / 下载入库（生成走 Topview MCP）
  music-minimax.mjs      MiniMax 配乐 API（账号无权限，暂不可用）
  sfx-unify.sh           音效统一后期，新增音效必须过一遍
```

共享工具在 `../shared/tools/`，本文件夹的 npm 脚本已指向它们（`tts`、`image`、`assets`、`fetch-doc`、`consult`）。

## 素材下载（第 2 步已找好，这里只下载要用的片段）

按脚本里的库 ID + 片段：`npm run assets -- fetch <id> --window 205-226 --out public/<期名>/video/x.mp4`
（只下这一段并转成 1080p H.264，不要下载完整原片）；做完用 `npm run assets -- use <id> --project <期名> --window a-b` 回填。
视频片段进 Remotion 用 `OffthreadVideo`（`muted`，`trimBefore` / `playbackRate`）；原片自带英文字幕的可以放大把字幕裁到画外。

## 数字人主持人（固定流程）

脚本里需要主持人出镜时用。生成走 TopviewAI 插件的 MCP（`topview_avatar_video`，已 OAuth 登录，没有 API Key），
本地准备和收尾用 `npm run host`。产物都在 `public/<期名>/host/`：`face.png`、`voice.mp3`、`host.mp4`、`job.json`。

1. **人像**（二选一）
   - 用户给照片：`--image 照片`。要求正脸、眼睛看镜头、嘴巴闭合或微张、脸不被手或头发挡住、光线均匀，短边 ≥ 720。
     没有照片时用 qwen-image 生成（提示词写明"正面面对镜头、双眼直视镜头、嘴巴自然闭合、半身、面部光线均匀"，
     负面词加"侧脸、低头、遮挡面部、张大嘴、多人、文字"），先给用户看图再继续。
   - 用户给视频：先 `npm run host -- frames 视频` 出 12 格带时间的预览图，挑一帧正脸，再 `--video 视频 --at 秒`。
     Topview 没有"保留原视频动作只改口型"的接口，所以视频只用来取一帧做照片数字人（动作由模型重新生成）。
2. **配音**（三选一）：用户给录音 `--audio 文件`；用户视频里的原声 `--audio-from-video`；
   否则按文稿用 MiMo 生成 `--text "文稿或 .txt" [--voice 冰糖] [--style "语气"]`。
   `npm run host -- prep <期名> ...` 一次完成人像和配音，写 `job.json`。
3. **生成**（Claude 通过 MCP 操作，提交前跟用户确认模式和积分）：
   `ta_upload_credential`（format=png、mp3 各一次）→ `npm run host -- put <文件> <uploadUrl>` →
   `ta_upload_check_file` → `topview_avatar_video`：`mode: "avatar4"`、`scriptMode: "audio"`、`templateImageFileId`、
   `audioFileId`，可选 `customMotion`（英文动作描述）。不传 `captionId`，字幕在 Remotion 里做；不传 `boardId` 即存到 My First Board。
   之后隔几分钟用 `topview_query_task`（taskType=avatar_video）查，成功后从 `topview_list_credit_logs` 看实际扣分。
4. **收尾**：`npm run host -- save <期名> <finishedVideoUrl> --task <taskId> --mode avatar4 --credits <分>`，
   转成 1920×1080 / 30fps 的 `host.mp4`，写回 `job.json`（含 `frames30`），并在素材库记一条 `gen-host-<期名>`。
5. **用到动画里**：`effects/_shared/AvatarHost.tsx`，`pip` 0 = 全屏、1 = 右下角画中画，中间值做过渡（用 `spring`）。
   声音默认取自主持人视频；整片另有旁白时传 `muted`。参考 `effects/avatar-host-demo/`（时长从 `job.json` 读）。

2026-10-28 实测（avatar4，1080p，图片 + 38 秒录音）：提交到完成约 19 分钟（接口预估写的是 10559 秒，不准），
扣 1 积分；输出 1934×1080 / 25fps，时长与音频一致。画面稳定、口型变化丰富，张嘴露齿时牙齿偶尔发绿发糊，
全屏特写会看得出来，画中画基本看不出。avatar2 / avatar4Fast 尚未测试。

## 背景音乐和音效

- 背景音乐：先用 `public/library/music/` 的 4 首财经科技配乐（`<Bgm track="bgm-tech-steady" />`，自动循环到片长）；
  新曲目在 MiniMax Audio 网页生成，流程见 `public/library/README.md`。
- **音效使用规范（强制）**：成片一直有人声和背景音乐，音效只能偶尔用在关键位置。
  - 全片音效集中写成一个 `SfxCue[]` 列表，交给 `effects/_shared/Sfx.tsx` 的 `SfxTrack`，同时传入人声区间 `speech`；
    背景音乐用 `<Bgm duck={sfxDuck(cues, fps)} />` 让位。不要在场景里零散地放 `<Sfx>`（那个只给试听页用）。
  - `SfxTrack` 按 `effects/_shared/sfx-rules.ts` 检查，不合规会报错停下：每分钟最多 4 个、30 秒内最多 3 个、
    间隔 ≥ 1.5 秒、同类间隔 ≥ 8 秒、强调咚和铺垫上升全片各 ≤ 3 次、长音效不能压在人声上。
  - 该用 / 不该用 / 优先级 / 破例写法见 `public/library/README.md`「使用规范」。遇到报错，先按优先级删音效，
    不要随手加 `allow`；确需破例时写清理由。

## 新增一期动画

1. 新建 `effects/<期名>/`，写动画组件和 `Composition.tsx`（照 `avatar-host-demo` 的样子）。
2. 在 `effects/index.tsx` 中 import 并加入列表。
3. `npm run dev` 预览；`npx remotion render <期名> out/<期名>.mp4` 渲染。
4. 提交前运行 `npm run lint`（ESLint + tsc）。

## 依赖管理规范

- 额外依赖（3D、地图、音频等）按需安装到**本文件夹**（`3-视频生成/`）。
- 所有 `remotion` 和 `@remotion/*` 包必须是**相同的精确版本**（不带 `^`/`~`）。添加官方包请用 `npx remotion add <包名>`，它会自动对齐版本。
- 不要随意升级。升级只用 `npx remotion upgrade`，一次性升级全部 Remotion 包。`npx remotion versions` 检查版本是否一致。

## 常用命令（在本文件夹运行）

| 用途 | 命令 |
|---|---|
| 启动 Studio | `npm run dev` |
| 渲染 | `npx remotion render <id> out/<id>.mp4`（Studio 开着时加 `--port=3123`，否则端口冲突） |
| 类型检查 + Lint | `npm run lint` |
| 安装 / 检查 Chrome Headless Shell | `npm run browser:ensure` |
| 检查 Remotion 版本一致性 | `npm run versions` |
| 配音（MiMo，默认冰糖） | `npm run tts -- "文字或 .txt" public/<期名>/voice.mp3 [--voice 冰糖] [--style "语气"]` |
| 生图（qwen-image-3.0-pro） | `npm run image -- "提示词" public/<期名>/xxx.png [--size 1920*1080] [--negative "..."] [--image 参考图]` |
| 下载素材片段 / 回填 | `npm run assets -- fetch <id> --window a-b --out public/<期名>/video/x.mp4` / `use <id> --project <期名> --window a-b` |
| 数字人主持人 | `npm run host -- frames` / `prep` / `put` / `save`（见上文） |
| 音效规范检查逻辑 | `npm run test:sfx`（改了 `effects/_shared/sfx-rules.ts` 后跑） |
| 检查渲染结果 | `ffprobe -v error -show_entries format=duration:stream=codec_name,width,height out/<id>.mp4` |

## 排查原则

先看报错、定位原因，再修复。**不要**盲目删除 `node_modules`、重装依赖或修改项目代码。

## 已验证的问题（本步骤专有；通用的见 ../AGENTS.md）

- **Chrome Headless Shell**：`npm run browser:ensure` 安装，当前 157.0.8080.0（与 Remotion 4.0.538 配套），位于
  `node_modules/.remotion/chrome-headless-shell/`。删除或重装 `node_modules` 后需要重新运行。下载地址是 storage.googleapis.com，
  失败先查网络或代理，不要改项目代码。
- **Studio 开着时渲染**：报 "window.getStaticCompositions is undefined"，是 3000 端口被 Studio 占了，渲染加 `--port=3123`。
- **Studio 开着时不能移动或删除 node_modules**（文件被占用）；先关 Studio。
- **配乐（MiniMax 音乐 API，`tools/music-minimax.mjs`）**：Key 在用户环境变量 `MINIMAX_API_KEY`。2026-10-28 实测两个域名、
  music-3.0 / 2.6 / 2.5、订阅 Key（`sk-cp-`）和按量 Key（`sk-api-`）都返回 HTTP 410 + `status_code 2153`：官方自 2026-08-20 起
  音乐 API 不再面向新用户。结论：配乐由用户在 MiniMax Audio 网页（音乐创作，Music-3.0，纯音乐）生成，下载后交给 Claude 入库；
  网页一次 2 首扣 600 积分，可能有一首失败。
- **音效（Topview Seed Audio）**：Canvas「财经视频常用音效」里生成，每个约 0.02–0.05 积分；风格前缀、筛选和后期见
  `public/library/README.md`。

## 环境验证记录

- 2026-10-26：`npm run browser:ensure`、`npm run lint` 通过；`npx remotion render env-test` 成功（1280×720，30fps，90 帧）。
- 2026-10-28：搬到 `3-视频生成/` 后，`npm run lint`、`npm run test:sfx` 通过，`avatar-host-demo` 静帧和 `bgm-preview` 音频渲染正常。
