# 视频生成阶段：工作流⑩（Remotion 引擎）

根据第⑨步确认的脚本成稿、完整素材和风格参考图生成视频。**默认由 Claude 在本工作区直接完成**配音、素材下载、动画、配乐音效和渲染
（Claude 的 Linux 环境或用户本机均可，不交给 Claude Code）；Claude Chat 交接包只在用户要求时做。
本文件夹是唯一的 Remotion 引擎：旧期的动画在 `effects/<期名>/`，新项目的动画在 `../projects/…/<ID>/05-制作/remotion/`，见下文「项目模式」。
所有动画共享本文件夹的依赖，**不要**在子文件夹里新建项目或再装一套依赖。整个工作流、密钥和通用排错见上一层 `../AGENTS.md`。

## 输入门禁

新项目先跑 `npm run project -- check <ID> --step 10`，全部 ✓ 才开始；下面列的是旧期路径，新项目对应位置见 `../AGENTS.md`「路径对照」。
必须同时具备：

- `../1-视频稿/<期名>/00-项目设置.md` 和其中指定的人设、平台规范。
- `../1-视频稿/<期名>/03-终稿-en.md`：用户确认的口播原文；有中文 `03-终稿.md` 时供理解内容。
- `../2-脚本/<期名>/script.md`：状态为“已确认（可进⑩）”的脚本成稿，不是 `script-draft.md`。
- `../2-脚本/<期名>/assets.md`：素材齐备已确认，无未批准的“待找 / 未核实 / 待定片段”。
- `../2-脚本/<期名>/refs/`：至少一张用户确认的风格参考图，以及脚本里的继承 / 禁止继承说明。

FAST 模式项目（`mode: fast`）以 `check --step 10` 结果为准：不要求脚本确认状态、`assets.md` 闭环和参考图；其余制作流程和标准完全相同，不另做一套。脚本里写的 AI 生图提示词在这一步统一生成（`npm run image`），和标准模式这一步下载片段同理。

脚本和口播不一致、素材仍有阻塞缺口或参考图未确认时，停下退回对应阶段，不在这一步改口播或静默补设计。
动画文件夹和 `public/` 子目录用同一个期名（`effects/<期名>/`、`public/<期名>/`）。长视频拆多条短视频时按脚本约定加平台和条目后缀，避免覆盖长视频。

## Claude Chat 生成交接（可选，用户要求时才做）

1. 按 `../2-脚本/templates/ClaudeChat生成交接模板.md` 生成 `../2-脚本/<期名>/ClaudeChat生成交接.md`。
2. 在独立 Claude Chat 中**实际附上传**视频成稿、脚本成稿、素材台账、项目设置、人设和风格参考图；只发本地路径，对方读不到。
3. 交接包写清平台、画幅、口播不可改、素材使用方式、参考图继承 / 禁止项，以及本仓库已有的 `cards / navy`、动效库、数字人、配乐音效和目录结构。
4. 先做关键帧或代表性短段给用户确认，再铺全片。新参考图若能映射到现有主题和动效就直接复用；全新布局或动作作为本期组件开发，不声称参考图能自动变成完整主题。
5. Claude Chat 产出的代码和说明回到本仓库，放入本期 `effects/<期名>/`、`public/<期名>/` 等约定位置；不得改动其他历史期。
6. 外部智能体只在用户明确选择后调用；直接生成和外部 Chat 执行相同的输入门禁、样式参考和制作规范。
   新项目的交接包放 `02-脚本/ClaudeChat生成交接.md`，产出代码回到该项目 `05-制作/remotion/`。

## 项目模式（新项目，2026-11-02 起）

新项目不进 `effects/` 注册表，也不在 `public/` 放素材；引擎按项目 ID 临时挂载它：

- 入口 `src/project-entry.ts` → `src/ProjectRoot.tsx` → `@project/Composition`（项目的 `05-制作/remotion/Composition.tsx`，导出 `ProjectCompositions`，
  Composition id 用项目 ID）。旧入口 `src/index.ts` 不变。
- `npm run project -- studio|render <ID>` 设置 `CV_PROJECT_DIR`、`CV_PUBLIC_DIR` 后启动 Remotion；`remotion.config.ts` 只在这两个变量存在时
  改 Rspack 配置（`@project`、`@shared` 别名，模块统一从运行目录的 `node_modules` 解析）和 public 目录。
- 每个项目一个**合成 public 目录**，只有三个链接，不复制文件：`library` → `public/library`，`assets` → 项目 `03-素材/生产`，`audio` → 项目 `04-音频`。
  Windows 下建在项目 `05-制作/cache/public/`（目录联接 junction），Linux 环境下建在 `$HOME/.cv-public/<ID>/`。
- 代码写法：`import { Frame } from "@shared/motion"`、`staticFile("assets/img/x.jpg")`、`staticFile("audio/voice/voice.mp3")`；
  不引用其他项目或旧期 `public/<期名>/`。项目代码的类型检查和 ESLint：`npm run project -- lint <ID>`（`npm run lint` 只管引擎）。
- `render` 先自动跑第⑩步门禁，不通过拒绝渲染；正式输出固定为 `06-交付/<平台>/video.mp4`，拆条用 `--deliver youtube-shorts-01 --comp <另一个 Composition id>`。
  关键帧、代表性短段等给用户看的预览用 `--preview [文件名]`（不过门禁，只写到 `05-制作/cache/preview/`），可配合 `-- --frames=0-299`。
- 下文里写 `public/<期名>/…`、`effects/<期名>/`、`out/<期名>.mp4` 的步骤（素材下载、数字人、配音），新项目换成
  `03-素材/生产/…`、`04-音频/…`、`05-制作/remotion/`、`06-交付/…`；`npm run assets -- fetch … --out` 直接写到项目路径。

## 环境

- Remotion 4.0.538，React 19.2.3，TypeScript 5.9.3，打包器 Rspack（见 `remotion.config.ts`）
- 渲染时 Remotion 使用自带的 FFmpeg（`@remotion/compositor-win32-x64-msvc`）；系统 FFmpeg 用于手动转码和素材处理

## 项目结构

```
effects/                 所有动画
  index.tsx              注册表：每个动画在此 import 并加入列表
  <期名>/                一期一个文件夹（小写+连字符），Composition.tsx 导出 <XxxComposition />，id = 文件夹名
  _shared/               多个动画共用：AvatarHost 数字人、Bgm + music-library.ts、Sfx/SfxTrack + sfx-library.ts + sfx-rules.ts
    motion/              动效库：28 个整屏动作 + 拼版小部件，cards / navy 两套主题（说明见其 README.md）
  motion-gallery/        动效目录：Studio 里 motion-library 文件夹，连播或单独预览每个动作
  caspa-ai-profit/       第一期成片
  avatar-host-demo/      数字人全屏 → 画中画演示（也是 SfxTrack 的用法示例）
  bgm-preview/           试听配乐（Studio 里改 track / seconds，看循环接缝）
  sfx-preview/           依次试听常用音效
src/                     入口（index.ts 不要改；Root.tsx 只挂载 effects 注册表）
public/                  静态素材，staticFile("xxx") 引用；每期的素材放 public/<期名>/
  library/               各期反复用的配乐 music/、音效 sfx/、动效库字体 fonts/inter-var.woff2，说明见其 README.md
out/                     渲染输出（不进 git）
tools/
  avatar-host.mjs        数字人主持人：挑帧 / 准备人像和配音 / 上传 / 下载入库（生成走 Topview MCP）
  music-minimax.mjs      MiniMax 配乐 API（账号无权限，暂不可用）
  sfx-unify.sh           音效统一后期，新增音效必须过一遍
```

共享工具在 `../shared/tools/`，本文件夹的 npm 脚本已指向它们（`tts`、`image`、`assets`、`fetch-doc`、`consult`）。

## 素材下载（⑦⑧已找好，这里只下载最终脚本要用的片段）

按脚本里的库 ID + 片段：`npm run assets -- fetch <id> --window 205-226 --out public/<期名>/video/x.mp4`
（只下这一段并转成 1080p H.264，不要下载完整原片）；做完用 `npm run assets -- use <id> --project <期名> --window a-b` 回填。
人工素材从 `../2-脚本/<期名>/材料/` 复制到 `public/<期名>/` 的对应子目录，保留 `assets.md` 里的来源、授权和原始路径记录；不要重新下载或覆盖用户原文件。
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
   转成 1920×1080 / 30fps 的 `host.mp4`（竖版人像如公共数字人保持 1080×1920，不裁头），写回 `job.json`（含 `frames30`），并在素材库记一条 `gen-host-<期名>`。
5. **用到动画里**（两种版式）：
   - **左下角圆形口播**（2026-10-30 起的默认版式，参考 B 站“小Lin说”）：`effects/_shared/AvatarBubble.tsx`，
     白色描边圆形头像，说话时外圈有一道很淡的青蓝光圈。和动效库框架一起用时直接写 `<Frame host={{ src: "<期名>/host/host.mp4" }}>`；
     `size`（默认直径 230）、`focusX / focusY / zoom` 对准脸，`enterAt / exitAt` 控制出现和收起。实拍卡的地点标签已挪到右下角，给头像让位。
   - **矩形画中画**：`effects/_shared/AvatarHost.tsx`，`pip` 0 = 全屏、1 = 右下角画中画，中间值做过渡（用 `spring`）。
   声音默认取自主持人视频；整片另有旁白时传 `muted`。参考 `effects/avatar-host-demo/`（时长从 `job.json` 读）。
6. **选数字人要用户拍板**：不管是 Topview 公共数字人还是用户照片生成的，先把候选（缩略图 / 试做的几秒口播）给用户看，
   用户选定后才提交整段生成；提交前再确认一次时长和预计积分。整片口播长（10 分钟以上）时，先用 30 秒左右试一段，确认口型和画质再做全片。

2026-10-28 实测（avatar4，1080p，图片 + 38 秒录音）：提交到完成约 19 分钟（接口预估写的是 10559 秒，不准），
扣 1 积分；输出 1934×1080 / 25fps，时长与音频一致。画面稳定、口型变化丰富，张嘴露齿时牙齿偶尔发绿发糊，
全屏特写会看得出来，画中画基本看不出。avatar2 / avatar4Fast 尚未测试。

2026-10-30 实测（avatar4，公共数字人原图 1080×1920 + 27.6 秒豆包 TTS 配音，带 `customMotion`）：约 21 分钟完成，
**扣 2.8 积分**（约 0.1 积分/秒，比 10-28 那次贵，按这个估整片）；输出 1080×1934，口型张合多样，牙齿干净，头部有自然摆动。
左下角圆形头像用 `focusX 0.52 / focusY 0.2 / zoom 1.4`，头顶不切、脸居中。

## 动效库（固定流程）

脚本里的动画设计写的是动效库 ID（如 `waterfall`、`count-up`），这一步照 ID 调用 `effects/_shared/motion/`，不再每期从头写图表动画。
用法、全部 ID 和参数见 `effects/_shared/motion/README.md`；Studio 里 `motion-library` 文件夹可以预览。

- 整片最外层调用一次 `useMotionFont()`，用 `<MotionTheme theme="cards">` 包住（深蓝风格写 `"navy"`）；脚本第一节写了用哪套。
- 每个动作放进 `Sequence`，`from` 对齐配音（`timeline.ts` 的 `at(n)`），`durationInFrames` 用 `motionFrames(id, fps, props)`。
- 颜色只用 `tone`（teal 好 / red 坏 / amber 提醒），不要在场景里写死色值，换主题才不会出错。
- 某个画面库里没有：先在本期文件夹里写，用了两期以上的再收进动效库（登记 `registry.ts`、补 README 表格、两套主题都看一遍）。
- 动效库的改动会影响所有引用它的期数；改已有动作的默认值或版式前，先确认旧期是否还要重新渲染。

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

## 竖屏短视频（YouTube Shorts / Instagram Reels / TikTok）

- 输入是所选平台的视频成稿和第⑨步确认的脚本成稿；直接选题与长视频拆条都执行相同素材和参考图门禁。
- **1080×1920、30fps**。直接选题可用 `effects/<期名>/`、`public/<期名>/`；长视频拆条时一条一个动画，例如 `effects/<期名>-ig-r1/`，素材放 `public/<期名>/ig/`，渲染到 `out/<期名>-ig-r1.mp4`，避免覆盖长视频。
- 全程烧录字幕（`remotion-captions` skill）；第 0–1 秒字卡、字幕与封面安全区按所选平台规范，并在真实 App 预览中核对遮挡。
- 尽量复用长视频图表组件、配乐和已下载片段，但必须按竖屏重排；不带其他平台水印、台标或订阅动画，第三方片段遵守平台规范。
- 长视频拆 Reels 试跑时，配音、渲染用时和花费仍记到 `../1-视频稿/<期名>/ig/工作量记录.md`。

## 依赖管理规范

- 额外依赖（3D、地图、音频等）按需安装到**本文件夹**（`3-视频生成/`）。
- 所有 `remotion` 和 `@remotion/*` 包必须是**相同的精确版本**（不带 `^`/`~`）。添加官方包请用 `npx remotion add <包名>`，它会自动对齐版本。
- 不要随意升级。升级只用 `npx remotion upgrade`，一次性升级全部 Remotion 包。`npx remotion versions` 检查版本是否一致。

## 常用命令（在本文件夹运行）

| 用途 | 命令 |
|---|---|
| 新项目：Studio / 渲染 / 代码检查 | `npm run project -- studio <ID>` / `render <ID>` / `lint <ID>` |
| Claude 的 Linux 环境：准备 / 渲染旧期 | `bash tools/linux-render.sh setup` / `bash tools/linux-render.sh render <期名> out/<期名>.mp4` |
| 启动 Studio | `npm run dev` |
| 预览动效库 | Studio 里 `motion-library` → `motion-gallery` / `motion-gallery-navy` / `motion-<id>` |
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
- **Rspack 下改打包配置要用 `Config.overrideBundlerConfig`**：`overrideWebpackConfig` 会被忽略（启动时有一行提示），别名不生效，
  报 `Can't resolve '@project/Composition'`（2026-11-02）。
- **项目代码的 tsconfig**：`paths` 里 `@types/*` 要排在 `node_modules/*` 前面，否则 `react/jsx-runtime` 解析到 JS 文件、报 TS7016；
  `typeRoots` 要指向引擎的 `node_modules/@types`（DOM 类型来自 `@types/web`）。`project new` 生成的模板已经这样写。
- **Studio 开着时渲染**：报 "window.getStaticCompositions is undefined"，是 3000 端口被 Studio 占了，渲染加 `--port=3123`。
- **Studio 开着时不能移动或删除 node_modules**（文件被占用）；先关 Studio。
- **配乐（MiniMax 音乐 API，`tools/music-minimax.mjs`）**：Key 在用户环境变量 `MINIMAX_API_KEY`。2026-10-28 实测两个域名、
  music-3.0 / 2.6 / 2.5、订阅 Key（`sk-cp-`）和按量 Key（`sk-api-`）都返回 HTTP 410 + `status_code 2153`：官方自 2026-08-20 起
  音乐 API 不再面向新用户。结论：配乐由用户在 MiniMax Audio 网页（音乐创作，Music-3.0，纯音乐）生成，下载后交给 Claude 入库；
  网页一次 2 首扣 600 积分，可能有一首失败。
- **音效（Topview Seed Audio）**：Canvas「财经视频常用音效」里生成，每个约 0.02–0.05 积分；风格前缀、筛选和后期见
  `public/library/README.md`。

## 环境验证记录

- 2026-11-02：Claude 的 Linux 环境：`linux-render.sh setup` 后，旧期 `2026-10-google-q3-cards` 片段渲染、测试项目 `2026-11-02-linux-test`
  项目模式渲染、`eslint src effects` + `tsc` 均通过。Windows 本机的项目模式尚未实测（junction 链接、`npm run project -- studio`）。

- 2026-10-26：`npm run browser:ensure`、`npm run lint` 通过；`npx remotion render env-test` 成功（1280×720，30fps，90 帧）。
- 2026-10-28：搬到 `3-视频生成/` 后，`npm run lint`、`npm run test:sfx` 通过，`avatar-host-demo` 静帧和 `bgm-preview` 音频渲染正常。
