# AGENTS.md

长期使用的 Remotion 动效项目。所有动画共享根目录的依赖，**不要**在子文件夹里新建项目或再装一套依赖。

## 环境

- Windows，Node.js v24.15.0，npm 11.12.1，FFmpeg / FFprobe 8.1.2（winget 安装，系统级）
- Remotion 4.0.538，React 19.2.3，TypeScript 5.9.3，打包器 Rspack（见 `remotion.config.ts`）
- 渲染时 Remotion 使用自带的 FFmpeg（`@remotion/compositor-win32-x64-msvc`）；系统 FFmpeg 用于手动转码和素材处理

## 项目结构

```
effects/                 所有动画
  index.tsx              注册表：每个动画在此 import 并加入列表
  <effect-name>/         一个动画一个文件夹（小写+连字符）
    Composition.tsx      导出 <XxxComposition />，id = 文件夹名
    <Main>.tsx           动画组件，以及该动画专用的子组件、工具函数
  _shared/               多个动画共用的组件（AvatarHost 数字人主持人、Bgm 背景音乐 + music-library.ts 等）
  avatar-host-demo/      数字人主持人全屏 → 画中画演示
  bgm-preview/           试听配乐库曲目（Studio 里改 track / seconds，看循环接缝）
src/
  index.ts               入口，registerRoot（不要改）
  Root.tsx               只挂载 effects 注册表
public/                  静态素材，用 staticFile("xxx") 引用；单个动画的素材放 public/<effect-name>/
  library/               各视频反复用的常用素材（music/ 配乐、sfx/ 音效），说明见其 README.md
out/                     渲染输出（已在 .gitignore 中）
scripts/                 视频脚本（Markdown），由 fetch-doc 从腾讯文档拉取
tools/
  fetch-tencent-doc.mjs  腾讯文档 → Markdown 拉取脚本
  tts-mimo.mjs           小米 MiMo TTS 配音脚本
  gen-image-qwen.mjs     阿里百炼 qwen-image 生图脚本
  assets.mjs             素材库工具（查库 / 导入 Grok 候选 / 核实 / 缩略图 / 按片段下载 / 回填）
  avatar-host.mjs        数字人主持人：挑帧 / 准备人像和配音 / 上传 / 下载入库（生成走 Topview MCP）
asset-library/           素材库：只记来源链接、可用片段、分类和缩略图，不存原文件；流程见其 README.md
voice-library/           音色试听库：<来源>/<音色ID>.mp3（mimo/ 等），说明见其 README.md
```

## 素材获取（固定流程）

读完视频稿和脚本后，按镜头列出素材需求 → **先查素材库**（`npm run assets -- search`）→ 库里没有的用
`asset-library/grok-prompt-template.md` 交给 Grok 找 → `import` 导入 → `verify` 核实 → `thumbs` 生成缩略图 →
`fetch` 只下载要用的片段到 `public/<id>/` → 做完用 `use` 回填实际用过的片段。不要下载完整原片。
详见 `asset-library/README.md`。

## 数字人主持人（固定流程）

脚本里需要主持人出镜时用。生成走 TopviewAI 插件的 MCP（`topview_avatar_video`，已 OAuth 登录，没有 API Key），
本地准备和收尾用 `npm run host`。产物都在 `public/<项目>/host/`：`face.png`、`voice.mp3`、`host.mp4`、`job.json`。

1. **人像**（二选一）
   - 用户给照片：`--image 照片`。要求正脸、眼睛看镜头、嘴巴闭合或微张、脸不被手或头发挡住、光线均匀，短边 ≥ 720。
     没有照片时用 qwen-image 生成（提示词写明"正面面对镜头、双眼直视镜头、嘴巴自然闭合、半身、面部光线均匀"，
     负面词加"侧脸、低头、遮挡面部、张大嘴、多人、文字"），先给用户看图再继续。
   - 用户给视频：先 `npm run host -- frames 视频` 出 12 格带时间的预览图，挑一帧正脸，再 `--video 视频 --at 秒`。
     Topview 没有"保留原视频动作只改口型"的接口，所以视频只用来取一帧做照片数字人（动作由模型重新生成）。
2. **配音**（三选一）：用户给录音 `--audio 文件`；用户视频里的原声 `--audio-from-video`；
   否则按文稿用 MiMo 生成 `--text "文稿或 .txt" [--voice 冰糖] [--style "语气"]`。
   `npm run host -- prep <项目> ...` 一次完成人像和配音，写 `job.json`。
3. **生成**（Claude 通过 MCP 操作，提交前跟用户确认模式和积分）：
   `ta_upload_credential`（format=png、mp3 各一次）→ `npm run host -- put <文件> <uploadUrl>` →
   `ta_upload_check_file` → `topview_avatar_video`：`mode: "avatar4"`、`scriptMode: "audio"`、`templateImageFileId`、
   `audioFileId`，可选 `customMotion`（英文动作描述）。不传 `captionId`，字幕在 Remotion 里做；不传 `boardId` 即存到 My First Board。
   之后隔几分钟用 `topview_query_task`（taskType=avatar_video）查，成功后从 `topview_list_credit_logs` 看实际扣分。
4. **收尾**：`npm run host -- save <项目> <finishedVideoUrl> --task <taskId> --mode avatar4 --credits <分>`，
   转成 1920×1080 / 30fps 的 `host.mp4`，写回 `job.json`（含 `frames30`），并在素材库记一条 `gen-host-<项目>`。
5. **用到动画里**：`effects/_shared/AvatarHost.tsx`，`pip` 0 = 全屏、1 = 右下角画中画，中间值做过渡（用 `spring`）。
   声音默认取自主持人视频；整片另有旁白时传 `muted`。参考 `effects/avatar-host-demo/`（时长从 `job.json` 读）。

2026-10-28 实测（avatar4，1080p，图片 + 38 秒录音）：提交到完成约 19 分钟（接口预估写的是 10559 秒，不准），
扣 1 积分；输出 1934×1080 / 25fps，时长与音频一致。画面稳定、口型变化丰富，张嘴露齿时牙齿偶尔发绿发糊，
全屏特写会看得出来，画中画基本看不出。avatar2 / avatar4Fast 尚未测试。

## 新增动画

1. 新建 `effects/<effect-name>/`，写动画组件和 `Composition.tsx`（照 `env-test` 的样子）。
2. 在 `effects/index.tsx` 中 import 并加入列表。
3. `npm run dev` 预览；`npx remotion render <effect-name> out/<effect-name>.mp4` 渲染。
4. 提交前运行 `npm run lint`（ESLint + tsc）。

`env-test` 是环境验证用的临时动画，可以随时删除（同时从 `effects/index.tsx` 中移除）。

## 依赖管理规范

- 额外依赖（3D、地图、音频等）按需安装到**项目根目录**。
- 所有 `remotion` 和 `@remotion/*` 包必须是**相同的精确版本**（不带 `^`/`~`）。添加官方包请用 `npx remotion add <包名>`（如 `npx remotion add @remotion/three`），它会自动对齐版本。
- 不要随意升级。升级只用 `npx remotion upgrade`，一次性升级全部 Remotion 包。
- 运行 `npx remotion versions` 可以检查版本是否一致。

## 常用命令

| 用途 | 命令 |
|---|---|
| 启动 Studio | `npm run dev` |
| 渲染 | `npx remotion render <id> out/<id>.mp4` |
| 类型检查 + Lint | `npm run lint` |
| 安装 / 检查 Chrome Headless Shell | `npm run browser:ensure` |
| 检查 Remotion 版本一致性 | `npm run versions` |
| 拉取腾讯文档脚本 | `npm run fetch-doc -- <文档链接> [文件名.md]`（存到 `scripts/`） |
| 生成配音（MiMo TTS，默认冰糖） | `npm run tts -- "文字或 .txt 文件" public/<id>/voice.mp3 [--voice 冰糖] [--style "语气"]` |
| 生成图片（qwen-image-3.0-pro） | `npm run image -- "提示词" public/<id>/xxx.png [--size 1920*1080] [--negative "..."] [--image 参考图]` |
| 素材库 | `npm run assets -- search <关键词>` / `import` / `verify` / `thumbs` / `fetch` / `use`（见 asset-library/README.md） |
| 数字人主持人 | `npm run host -- frames` / `prep` / `put` / `save`（见上文「数字人主持人」） |
| 背景音乐 | 先用 `public/library/music/` 里的现成曲目（`<Bgm track="bgm-tech-steady" />`）；新曲目在 MiniMax Audio 网页生成，流程见 `public/library/README.md` |
| 生成配乐（MiniMax API，账号无音乐权限，暂不可用） | `npm run music -- "风格描述" public/library/music/xxx.mp3 [--lyrics 歌词] [--model music-3.0]` |
| 检查渲染结果 | `ffprobe -v error -show_entries format=duration:stream=codec_name,width,height out/<id>.mp4` |

## 排查原则

先看报错、定位原因，再修复。**不要**盲目删除 `node_modules`、重装依赖或修改项目代码。

## 已验证的问题与解决方法

- **PowerShell 运行 npm/npx 报"禁止运行脚本"**：执行策略限制。运行 `Set-ExecutionPolicy -Scope CurrentUser -ExecutionPolicy RemoteSigned` 解决（只影响当前用户）。
- **PowerShell 里 `cd E:\...` 能切换盘符，但 cmd 里必须写 `cd /d E:\claude-video`。**
- **Chrome Headless Shell**：运行 `npm run browser:ensure` 安装，当前为 157.0.8080.0（与 Remotion 4.0.538 配套），位于 `node_modules/.remotion/chrome-headless-shell/`。删除或重装 `node_modules` 后需要重新运行。下载地址是 storage.googleapis.com，如果下载失败，先检查网络或代理，不要改项目代码。
- **腾讯文档拉取（fetch-doc）**：调用官方 MCP 服务 `https://docs.qq.com/openapi/mcp`，token 从用户环境变量 `TENCENT_DOCS_TOKEN` 读取（在 https://docs.qq.com/scenario/open-claw.html 获取，用 `setx` 保存）。`setx` 之后要重开终端或重启 Claude 桌面 App 才能读到。token 不要写进项目文件，也不要发在聊天里。正文用 `get_content`；图片用 `doc.get_images` 取 URL 和位置，再用 `doc.resolve_document_structure` 对回段落，下载到 `scripts/<文件名>/01.png…` 并以 `![图N](...)` 插回原位（无法对齐时放到文末"未能定位的图片"）。图片服务器 docimg*.docs.qq.com 必须带 `Referer: https://docs.qq.com/`，否则 403。图片定位只支持 Word 类文档（doc）。做动画时把用到的图复制到 `public/<effect-name>/`。
- **yt-dlp（下载在线视频素材）**：`winget install yt-dlp.yt-dlp` 安装（2026.10.21），会顺带装 `yt-dlp.FFmpeg`；PATH 中 WinGet\Links 排在前面，`ffmpeg` 仍指向 Gyan 8.1.2。新开的终端才能直接用 `yt-dlp`。2026-10-27 测试：能连上 YouTube，但被要求"Sign in to confirm you're not a bot"，需要 `--cookies-from-browser` 或 `--cookies` 才能下载。`--cookies-from-browser chrome` 在 Chrome 开着时报 "Could not copy Chrome cookie database"（数据库被锁，见 yt-dlp issue #7271），完全退出 Chrome 后又报 "Failed to decrypt with DPAPI"（新版 Chrome 的应用绑定加密，见 issue #10927）。结论：本机 `--cookies-from-browser chrome` 不可用，改为导出 cookies.txt 后用 `--cookies <文件>`（文件放项目外，不要提交）。当前 cookies 文件：`C:\Users\hzh\Downloads\www.youtube.com_cookies.txt`（Chrome 扩展 Get cookies.txt LOCALLY 导出，过期后重新导出）。2026-10-27 用它下载测试视频成功，但几小时后再用又报 "not a bot"：文件里的到期时间都还在 2027 年，实际是浏览器继续使用这个登录会话时 YouTube 轮换了 cookies，导出的副本失效。按 yt-dlp wiki 的做法，在 Chrome **无痕窗口**里登录 YouTube，只打开 `https://www.youtube.com/robots.txt` 这一个页面，导出 cookies 后立刻关掉无痕窗口（2026-10-27 实测：新导出的 cookies 核实 27 条视频都通过，但紧接着连续生成缩略图、短时间内请求过密，约 10 条后又被要求验证，这份 cookies 随即不能用。`tools/assets.mjs` 已改为每次 yt-dlp 调用间隔 8 秒、`--sleep-requests 1.5`、缩略图改为一次调用下载 4 个 1 秒低清片段，遇到验证立即停止整批。被拦后至少等 1 小时再试，不要连续重试），这样导出的 cookies 不会再被浏览器轮换（无痕窗口里要先在扩展设置中允许"在无痕模式下启用"）。
  推荐命令（优先 H.264+AAC，Remotion 兼容性最好；默认会下到 AV1+Opus）：
  `yt-dlp --cookies <cookies.txt> -f "bv*[vcodec^=avc1]+ba[acodec^=mp4a]/b[ext=mp4]/bv*+ba" --merge-output-format mp4 -o "public/<effect-name>/%(id)s.%(ext)s" <链接>`
  只截一段加 `--download-sections "*00:10-00:25"`；只要音频用 `-x --audio-format mp3`。
- **配音（小米 MiMo TTS）**：视频配音统一用 MiMo，音色"冰糖"。接口 `https://api.xiaomimimo.com/v1/chat/completions`（OpenAI 兼容），模型 `mimo-v2.5-tts`，要读的文字放在 `assistant` 消息里，`audio: { format: "mp3"|"wav", voice: "冰糖" }`，返回 `choices[0].message.audio.data`（base64）。Key 存在用户环境变量 `MIMO_API_KEY`，不要写进项目文件。输出为 24kHz 单声道。2026-10-27 测试：37 字合成 7.7 秒 mp3 成功。动画时长按 `ffprobe` 量出的配音时长来定。可选音色：mimo_default、冰糖、茉莉、苏打、白桦、Mia、Chloe、Milo、Dean。
- **图片生成（阿里百炼 Token Plan，qwen-image-3.0-pro）**：视频用图统一用它。Key 存在用户环境变量 `DASHSCOPE_API_KEY`，不要写进项目文件。`compatible-mode/v1/images/generations` 不可用（400 url error），必须走原生接口 `https://token-plan.cn-beijing.maas.aliyuncs.com/api/v1/services/aigc/multimodal-generation/generation`，body 为 `{ model, input: { messages: [{ role: "user", content: [{ text }] }] }, parameters: { size: "1920*1080", n } }`，返回 `output.choices[].message.content[].image`（带时效的 OSS 链接，脚本会立即下载）。总像素在 512×512 到 2048×2048 之间，n 为 1–6，传 1–3 张参考图即为改图。2026-10-27 测试：1920×1080 生成成功（约 1 分钟内）。参考图改图和 `--no-rewrite`（prompt_extend）尚未实测。只下载自己的、CC 授权或已获授权的素材。

- **配乐（MiniMax 音乐，`tools/music-minimax.mjs`）**：Key 存在用户环境变量 `MINIMAX_API_KEY`（`sk-cp-` 开头），
  基础地址默认 `https://api.minimax.cn/v1`，可用 `MINIMAX_BASE_URL` 改成 `https://api.minimaxi.com/v1`。接口 `POST /music_generation`，
  body `{ model: "music-3.0", prompt, is_instrumental: true | lyrics, audio_setting, output_format: "hex" }`，音频在 `data.audio`，
  时长 `extra_info.music_duration`（毫秒）。2026-10-28 实测：两个域名、music-3.0 / 2.6 / 2.5 都返回 HTTP 410 + `status_code 2153`
  "This Music API is no longer available to new users"；同一个 key 调 TTS（`/t2a_v2`）正常，错误 key 返回 1004，
  所以不是网络或 key 填错，而是这个账号没有音乐接口权限。官方文档写明：自 2026-08-20 起音乐生成 API 不再面向新用户，
  免费版（music-3.0-free 等）已停止服务。M Plan 订阅 Key（`sk-cp-`）的额度只有 general / video，没有音乐；
  按量付费 Key（`sk-api-`）同样返回 2153。结论：配乐改由用户在 MiniMax Audio 网页（音乐创作，Music-3.0，纯音乐）手动生成，
  下载后交给 Claude 入库（`public/library/README.md`）。网页生成一次 2 首扣 600 积分，可能有一首失败。
- **Bash 工具里读不到 `MIMO_API_KEY` / `DASHSCOPE_API_KEY`**：Claude 会话启动早于 `setx` 时，进程环境里没有这两个变量。在 PowerShell 里先 `$env:MIMO_API_KEY = [Environment]::GetEnvironmentVariable('MIMO_API_KEY','User')`（DASHSCOPE 同理）再运行脚本。
- **curl 下载 gstatic 等图片报 `CRYPT_E_REVOCATION_OFFLINE`**：Windows schannel 证书吊销检查失败，加 `--ssl-no-revoke`。
- **2026-10-27**：旧 cookies 文件失效后，用户重新导出为 `C:\Users\hzh\Downloads\www.youtube.com_cookies (1).txt`，可正常下载。CASPA 大会视频 YE6IVKcpb9c 用新 cookies 仍报 "This video is private"，确实无法下载（搜索结果里可能仍显示为公开）。
- **Grok CLI（找素材来源）**：`C:\Users\hzh\.grok\bin\grok.exe`。非交互用法要从 Bash 调用（PowerShell 5.1 会把带引号的长提示词拆坏）：`grok --cwd <空目录> --max-turns 60 --permission-mode plan --prompt-file prompt.txt`。plan 模式只读，能联网搜索；不加 `--max-turns` 时常只回一句开场白就结束，可用 `-c -p "输出最终 JSON"` 接着要结果。`--always-approve` 会被 Claude Code 的权限检查拦下，不要用。Grok 给的链接要用 `yt-dlp --simulate` 核实。
- **视频素材进 Remotion**：先用 ffmpeg 裁成需要的片段并转码（`-an -vf scale=1920:1080,fps=30 -c:v libx264 -crf 22 -g 15`），放在 `public/<id>/video/`，再用 `OffthreadVideo`（`muted`，`trimBefore` / `playbackRate`）引用。原片自带英文字幕的（如 Google 的视频）可以放大画面，把字幕裁到画外。

## 环境验证记录

2026-10-26：`npm run browser:ensure`、`npm run lint` 通过；`npx remotion render env-test out/env-test.mp4` 成功（1280×720，30fps，90 帧，H.264，约 1.4 秒渲染完成）。
2026-10-26：`npm run fetch-doc` 拉取腾讯文档测试通过（Claude Code 会话直接运行，5512 字，存为 scripts/DQUJBUGxoc1VpU3F3.md）。
