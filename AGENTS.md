# AGENTS.md（工作流总说明）

英文财经视频生产工作流。默认发布、配音和画面使用英文；中文稿只作内部底稿（用户用中文审逻辑和事实）。
「Andy's Market Lens」是预存人设之一，不是唯一人设：可以选用 `1-视频稿/_人设/` 里的预存人设，也可以输入并确认新人设。
Andy 的已确认账号信息见 `1-视频稿/_人设/Andy人设.md`（Handle 仍是 `@Andy_gmgx`；原名「Andy港美观察」，旧稿和 caspa-ai-profit 成片里的旧名不改）。

用户工作流分**十步**，规范、模板和工具按阶段放在**三个执行文件夹**里。用户会单独打开某个文件夹做该阶段的任务；打开子文件夹时，这份总说明和该文件夹的 AGENTS.md 都生效。

**每期内容放哪（2026-11-02 起）**：新视频一律建独立项目 `projects/YYYY/MM/<项目ID>/`（`npm run project -- new <英文短名>`），
从初稿到成片的全部本期资料都在这一个目录里，进度记在它的 `project.json`。三个执行文件夹只放规范、模板、工具和 Remotion 引擎。
旧期（`2026-10-google-q3` 这类 `YYYY-MM-短名`）继续走原三目录路径，不迁移、不改写。项目结构和命令见 `projects/README.md`。

**执行方**：整个十步由 Claude（Cowork / 仓库对话）或用户指定的其他 AI 完成，**不交给 Claude Code**。

| 工作流 | 执行目录 | 负责 | 交付 |
|---|---|---|---|
| ① 选择人设 | `1-视频稿/` | 选择预存人设，或输入、整理并确认新人设 | 人设文件路径 |
| ② 选择平台和视频方式 | `1-视频稿/` | YouTube 长视频 / YouTube Shorts / Instagram Reels / TikTok；确定语言、画幅、目标时长和来源模式 | `<期名>/00-项目设置.md` |
| ③ 视频初稿 | `1-视频稿/` | 在仓库对话中按人设、平台和素材生成初稿；**用户直接交付成稿时跳过④⑤，直接进⑥** | `<期名>/01-初稿.md`，或用户交付的成稿 |
| ④ 修改建议 | `1-视频稿/` | 用户自行拿初稿去 Grok / Gemini 问询，把原始回复贴回本项目；不自动调用外部智能体 | `<期名>/02-外部建议.md` |
| ⑤ 视频成稿 | `1-视频稿/` | 处理建议、去 AI 化、用户人工修改并确认；事实和判断强度不能漂移 | `<期名>/03-终稿-en.md`；有中文底稿时同时保留 `03-终稿.md` |
| ⑥ 脚本初稿 | `2-脚本/` | 读懂成稿，初步定风格、分镜、动效和逐镜素材需求；可在仓库对话做，也可由用户去 GPT / Claude 做后贴回 | `<期名>/script-draft.md` |
| ⑦ 素材搜寻 | `2-脚本/` + 素材库 | 查库、搜索、导入、核实、缩略图，登记素材与缺口 | `<期名>/assets.md` + 素材库记录 |
| ⑧ 素材补全 | `2-脚本/` | 用户补股价、财报截图、录屏等方便人工取得的材料；登记后再搜剩余缺口，直到无阻塞缺口 | 完整 `assets.md` + `<期名>/材料/` |
| ⑨ 重新规划视频脚本 | `2-脚本/` | 根据真实素材重排画面、片段、动效和声音，交用户确认；准备至少一张风格参考图 | `<期名>/script.md` + `<期名>/refs/` |
| ⑩ 视频生成 | `3-视频生成/`（引擎） | 默认由 Claude 在本工作区直接完成配音、素材下载、动画、配乐音效和渲染；Claude Chat 交接包改为可选 | 新项目 `06-交付/<平台>/video.mp4`；旧期 `out/<期名>.mp4` |

平台规范都在 `1-视频稿/platforms/`：`youtube-long-en.md`（长视频发布规则，通用机制见 `youtube-long.md`）、
`youtube-shorts-en.md`、`instagram-reels-en.md`、`tiktok-en.md`。Reels / Shorts / TikTok 可直接选题，也可从审核通过的长视频稿改编；
由长视频拆多条时沿用各平台规范里的子目录约定。

表中“交付”列是阶段产物的名字；新项目里它们的实际位置见下面「交接约定」的路径对照表。

## 目录

```
AGENTS.md / CLAUDE.md    本文件（总说明）
projects/                新项目：projects/YYYY/MM/<项目ID>/，一期一个目录（内容不进 git，见 projects/README.md）
1-视频稿/                工作流①–⑤：人设、平台、初稿、外部建议、成稿（见其 AGENTS.md）
2-脚本/                  工作流⑥–⑨：脚本初稿、素材闭环、脚本成稿（见其 AGENTS.md）
3-视频生成/              工作流⑩：Claude Chat 交接 + Remotion 项目（node_modules 在这里）
shared/                  两步以上共用
  asset-library/         素材库：只记来源链接、可用片段、分类、缩略图，不存原文件（⑦⑧搜索登记，⑩下载回填）
  voice-library/         音色试听（⑥选音色，⑩配音）
  tools/                 无依赖的 Node 脚本，从哪个文件夹运行都行：
    fetch-tencent-doc.mjs  腾讯文档 → Markdown（含图片）
    tts-mimo.mjs           MiMo 配音
    gen-image-qwen.mjs     qwen-image 生图
    gen-image-codex.mjs    Codex CLI 生图（ChatGPT 账号，和 qwen 并列）
    assets.mjs             素材库工具（查 / 导入 / 核实 / 缩略图 / 按片段下载 / 回填）
    project.mjs            项目工具：new / list / status / check / set / final / paths / studio / render / lint
    consult-agy.mjs        请 agy（Gemini 等）给第二意见，只读
.agents/skills           项目级 skill（.claude/skills 指向它）：Remotion 系列、humanizer、humanizer-zh；清单在 skills-lock.json
```

每个执行文件夹都有 `package.json`，把共享工具映射成 `npm run fetch-doc / image / image-codex / assets / tts / consult / project`；
`1-视频稿/` 和 `2-脚本/` 的 `package.json` 没有依赖，不需要 `npm install`。

## 交接约定

- **项目 ID**：新项目 `YYYY-MM-DD-<英文短名>`（如 `2026-11-02-google-q3`），目录 `projects/YYYY/MM/<项目ID>/`，同名不覆盖、建好不再移动。
  进度只记在 `project.json`（`npm run project -- set` 修改，`status` 查看），`00-项目设置.md` 只写①②的决定。
  每个阶段完成、到闸门停下或遇到阻塞时，都更新 `project.json` 的 `step / next / blockers`。
- **路径对照**（各层 AGENTS.md 和模板里写的是旧期路径，新项目一律按右列；`npm run project -- paths <ID>` 可打印）：

  | 产物 | 旧期路径 | 新项目路径（相对项目目录） |
  |---|---|---|
  | 项目设置 | `1-视频稿/<期名>/00-项目设置.md` | `00-项目设置.md` + `project.json` |
  | 初稿 / 外部建议 / 成稿 | `1-视频稿/<期名>/01-初稿.md` 等 | `01-视频稿/01-初稿.md`、`02-外部建议.md`、`03-终稿-en.md`、`03-终稿.md` |
  | 发布包装 / 复盘 | `1-视频稿/<期名>/04-发布包装-*.md`、`05-复盘.md` | `06-交付/<平台>/发布包装.md`、`07-复盘.md` |
  | 脚本初稿 / 素材台账 / 脚本成稿 / 交接包 | `2-脚本/<期名>/…` | `02-脚本/script-draft.md`、`assets.md`、`script.md`、`ClaudeChat生成交接.md` |
  | 人工材料 | `2-脚本/<期名>/材料/` | `03-素材/原始/` |
  | 风格参考图 | `2-脚本/<期名>/refs/` | `03-素材/refs/` |
  | 本期素材（下载片段、生成图、截图） | `3-视频生成/public/<期名>/` | `03-素材/生产/`（代码里 `staticFile("assets/…")`） |
  | 配音、数字人、混音 | `3-视频生成/public/<期名>/voice…`、`host/` | `04-音频/voice/`、`host/`、`mix/`（`staticFile("audio/…")`） |
  | 动画代码 | `3-视频生成/effects/<期名>/` + 注册表 | `05-制作/remotion/Composition.tsx`（不进注册表） |
  | 成片 / 字幕 / 封面 | `3-视频生成/out/<期名>.mp4` | `06-交付/<平台>[-NN]/video.mp4`、`subtitles.srt`、`cover.png` |

  素材库（`shared/asset-library/`）、人设、平台规范、模板、音色库、动效库、公共配乐音效字体仍然全局共享。
  素材库 `--project` 参数写项目 ID。
- **⑤ → ⑥**：用户确认的 `1-视频稿/<期名>/03-终稿-en.md` 是口播原文；有中文 `03-终稿.md` 时一起交，供理解内容。
  用户直接交付成稿时也保存到相同标准路径，不强制补中文底稿。口播只在视频稿阶段（①–⑤）修改；后面发现要改稿，回该阶段改并重新确认。
- **⑥ → ⑦ → ⑧ → ⑨**：`script-draft.md` 允许有待找素材；`assets.md` 持续记录素材、缺口和补缺轮次。
  只有真实素材齐备、缺口关闭后，才能重排并确认最终 `script.md`。
- **门禁检查**：新项目每过一个闸门前跑 `npm run project -- check <ID> --step <下一步>`；有 ✗ 不进下一步。
  它检查：设置已确认且人设 / 平台与 `project.json` 一致、成稿存在（直接交付成稿时允许跳过④⑤）、
  素材总表没有“待找 / 候选未核实 / 待定片段”、脚本成稿已确认、`03-素材/refs/` 有参考图、代码没有引用其他项目或旧期素材。
- **⑨ → ⑩**：交接用户确认的 `script.md`、完整 `assets.md`、`refs/` 风格参考图和视频成稿。
  脚本成稿写明风格、分镜、素材库 ID + 片段或人工文件路径、动画设计（动效库 ID，见 `3-视频生成/effects/_shared/motion/README.md`）和音效。
  脚本阶段（⑥–⑨）只找素材、登记人工文件，不下载正式片段；视频生成阶段（⑩）按片段下载并回填。
- **四个人工闸门**：人设与平台设置确认 → 视频成稿确认 → 素材补齐确认 → 脚本成稿与风格参考图确认。
  到闸门必须停下等用户，不要一口气跑到底；外部修改建议不等于用户已经采纳。
- **信源**：口播和画面里只点名知名投行、知名研究机构、金融和企业界名人，或公司一手资料（财报、电话会）；海豚研究、长桥、华尔街见闻等不点名。细则见 `1-视频稿/AGENTS.md`「信源规则」。

## 提交规则

- 仓库在 GitHub `1375692655hzh/claude-video`（公开）。**只提交代码、工具、规范和模板**；每期的视频稿、脚本、素材、
  配音、配乐、音效、数字人结果都只留在本地（见 `.gitignore`）。只在用户要求时提交和推送。
- 密钥只放在用户环境变量里，不写进任何文件，也不在聊天里回显。

## 环境

- **Claude 的 Linux 环境（Cowork，执行⑩的默认环境）**：Claude 在用户电脑上的隔离 Ubuntu 22.04（2 核、约 4GB 内存、约 10GB 盘），
  仓库挂载在 `$HOME/mnt/claude-video`。Node v22、FFmpeg 4.4、Python 3.10；yt-dlp 用 `pip3 install --user yt-dlp` 装（YouTube 解析加 `--js-runtimes node`）。
  联网走 claude.ai「设置 → 功能 → 网域许可清单」：除套件管理工具外已加 `api.xiaomimimo.com`、`*.aliyuncs.com`、`docs.qq.com`、`*.docs.qq.com`、
  `*.youtube.com`、`*.googlevideo.com`、`*.ytimg.com`（2026-11-02）。新服务要先加域名。
  读不到 Windows 用户环境变量；**密钥文件方案待用户确定**，确定前需要密钥的命令（配音、生图、腾讯文档）由用户在 PowerShell 运行。
  TopviewAI 数字人只装在 Claude Code 的 MCP 里，这里暂时没有。
- Windows 11，Node.js v24.15.0，npm 11.12.1，FFmpeg / FFprobe 8.1.2（winget，系统级）
- 密钥（用户环境变量，用 `setx` 保存）：`TENCENT_DOCS_TOKEN`（腾讯文档）、`MIMO_API_KEY`（配音）、
  `DASHSCOPE_API_KEY`（生图）、`MINIMAX_API_KEY`（MiniMax，音乐 API 无权限）。
- 外部工具：Codex CLI 0.162.1（npm 全局，ChatGPT 账号登录，生图用）、yt-dlp（winget）、Grok CLI（`C:\Users\hzh\.grok\bin\grok.exe`）、agy（Antigravity CLI，`C:\Users\hzh\AppData\Local\agy\bin\agy.exe`）、
  TopviewAI 插件（Claude Code MCP，OAuth 已登录：数字人、音效、视频生成）。

## 通用的已验证问题与解决方法

- **PowerShell 运行 npm/npx 报"禁止运行脚本"**：`Set-ExecutionPolicy -Scope CurrentUser -ExecutionPolicy RemoteSigned`。
- **cmd 里换盘要写 `cd /d E:\claude-video`**（PowerShell 直接 `cd E:\...` 即可）。
- **Bash 工具里读不到密钥环境变量**：Claude 会话启动早于 `setx` 时进程里没有。在 PowerShell 里先
  `$env:MIMO_API_KEY = [Environment]::GetEnvironmentVariable('MIMO_API_KEY','User')`（其他同理）再运行。
- **curl 报 `CRYPT_E_REVOCATION_OFFLINE`**：Windows schannel 吊销检查失败，加 `--ssl-no-revoke`。
- **腾讯文档（fetch-doc）**：官方 MCP `https://docs.qq.com/openapi/mcp`，token 在 https://docs.qq.com/scenario/open-claw.html 获取。
  正文用 `get_content`；图片用 `doc.get_images` 取 URL 和位置，再用 `doc.resolve_document_structure` 对回段落，下载到
  `<输出名>/01.png…` 并以 `![图N](...)` 插回原位（对不上的放文末）。图片服务器 docimg*.docs.qq.com 必须带
  `Referer: https://docs.qq.com/`，否则 403。图片定位只支持 Word 类文档。拉不到时先在浏览器打开一次该文档（进"最近浏览"）。
- **配音（小米 MiMo TTS）**：统一用 MiMo。英文视频的音色从 Mia、Chloe、Milo、Dean 里选（英文效果待试听，选定后写在这里）；"冰糖"是中文音色，只用于中文。接口 `https://api.xiaomimimo.com/v1/chat/completions`，模型 `mimo-v2.5-tts`，
  要读的文字放在 `assistant` 消息里，`audio: { format, voice }`，返回 `choices[0].message.audio.data`（base64），24kHz 单声道。
  中文语速约 290 字/分钟（37 字 7.7 秒），英文按约 150 词/分钟估算（未实测），动画时长以 `ffprobe` 实测为准。音色：mimo_default、冰糖、茉莉、苏打、白桦、Mia、Chloe、Milo、Dean。
- **生图（阿里百炼 Token Plan，qwen-image-3.0-pro）**：必须走原生接口
  `https://token-plan.cn-beijing.maas.aliyuncs.com/api/v1/services/aigc/multimodal-generation/generation`（compatible-mode 返回 400），
  body `{ model, input: { messages: [{ role: "user", content: [{ text }] }] }, parameters: { size: "1920*1080", n } }`；
  总像素 512×512–2048×2048，n 为 1–6，传 1–3 张参考图即为改图（参考图改图尚未实测）。
  **从 Bash 调用，提示词放文件里用 `"$(cat 文件)"` 传**：PowerShell 5.1 把中文引号 “ ” 当字符串定界符，提示词被拆开、输出文件名变成 `-1`（2026-10-29 实测）。
  Bash 里取 Key：`export DASHSCOPE_API_KEY=$(powershell -NoProfile -Command "[Environment]::GetEnvironmentVariable('DASHSCOPE_API_KEY','User')" | tr -d '\r')`。
  能直接画出中英文大字（YouTube 封面就这样整张生成）；英文偶有拼错或重复词，文字逐行写死、标拼写、加 `--no-rewrite` 后 3 张全对。
- **生图（Codex CLI，`npm run image-codex -- <提示词或 .txt> <输出.png> [--n 2]`）**：`shared/tools/gen-image-codex.mjs` 在输出目录里起
  `codex exec --skip-git-repo-check -s workspace-write -` 会话，让它用内置生图工具把图存成指定文件名；没存成就从 `~/.codex/generated_images/` 取本次新图。
  一张约 1–2 分钟，输出 1672×941（16:9）。2026-10-29 实测：同样的"只给内容"封面提示词，Codex 6 张数字和英文全对、没有编造内容；
  qwen 6 张里有 4 张自己加了提示词没有的说法和数字（"BURN RATE"、AI 90% 饼图、"SEARCH 5-YEAR HIGH"）。**英文封面优先用 Codex**，qwen 作补充。
  启动时 Codex 报一堆 `rmcp ... HTTP 403`（插件 MCP 被 Cloudflare 拦）和 `config.toml` 未知字段警告，不影响生图。
- **yt-dlp 和 YouTube cookies**：本机 `--cookies-from-browser chrome` 不可用（Chrome 开着时数据库被锁；关掉后报 DPAPI 解密失败）。
  改用导出的 cookies.txt（`--cookies <文件>`，文件放项目外不提交）：在 Chrome **无痕窗口**登录 YouTube，只打开
  `https://www.youtube.com/robots.txt`，用扩展 Get cookies.txt LOCALLY 导出后立刻关掉无痕窗口（扩展要允许无痕模式）。
  `assets.mjs` 默认读"下载"文件夹里最新的 `www.youtube.com_cookies*.txt`。请求过密会被要求"not a bot"并烧掉 cookies：
  工具已限速（调用间隔 8 秒、`--sleep-requests 1.5`，遇到验证立即停止整批），被拦后至少等 1 小时，不要连续重试。
  推荐格式 `-f "bv*[vcodec^=avc1]+ba[acodec^=mp4a]/b[ext=mp4]/bv*+ba"`（H.264+AAC），截一段用 `--download-sections "*00:10-00:25"`。
  只下载自己的、CC 授权或已获授权的素材；私有视频（如 CASPA 大会 YE6IVKcpb9c）无法下载。
- **Grok CLI（找素材来源）**：从 Bash 调用（PowerShell 5.1 会拆坏长提示词）：
  `grok --cwd <空目录> --max-turns 60 --permission-mode plan --prompt-file prompt.txt`；不加 `--max-turns` 常只回开场白，
  可 `-c -p "输出最终 JSON"` 接着要；`--always-approve` 会被拦，不要用。Grok 给的链接要用 `yt-dlp --simulate` 核实。
- **agy（第二意见）**：`shared/tools/consult-agy.mjs` 封装了 `agy -p <问题> --mode plan --model <模型> --add-dir <附件目录>`，
  只读；附件不塞命令行（Windows 有长度上限），让 agy 自己读。默认 `gemini-4-argon-high`，`agy models` 查可用模型
  （还有 Gemini 3.8 Flash、Claude Opus/Sonnet 5.5、GPT-OSS 120B）。2026-10-28 实测一次简单问答 31 秒。
- **Claude 的记忆按打开的文件夹分开存**：单独打开子文件夹时，之前在根目录积累的记忆不会带过去；重要约定都写进各层 AGENTS.md。

- **Linux 环境里渲染 Remotion**（2026-11-02 实测）：Windows 的 `node_modules` 不能用也不要动；每个新会话先跑
  `bash 3-视频生成/tools/linux-render.sh setup`（约 30 秒），在 `$HOME/rl` 装 Linux 版依赖、用 npm 上的 `@sparticuz/chromium` 当浏览器
  （remotion.media / storage.googleapis.com 被挡）。之后 `npm run project -- render <ID>` 自动用它；旧期用 `bash tools/linux-render.sh render <期名> out/<期名>.mp4`。
  速度约 24 帧/秒（1080p），16 分钟长片约 20 分钟。
- **Linux 环境的单条命令最长 3 分钟，后台进程在命令结束后没有网络**：需要联网的步骤（npm 安装、配音、下载）必须在一条命令内跑完，
  分批做；渲染不需要网络，长片用 `nohup … &` 后台跑，再轮询日志。
- **Linux 环境默认不能删文件**（rm 报 Operation not permitted），要删时先向用户申请删除权限，或移到 `_to_delete/`。

## 环境验证记录

- 2026-10-26：Remotion 环境、`fetch-doc` 测试通过。
- 2026-11-02：改为独立项目工作区：`project new / check / render / lint` 实测通过；测试项目 `2026-11-02-linux-test` 在 Linux 环境渲染到
  `06-交付/youtube-long/video.mp4`（项目素材、公共动效库、字体、配乐都正常）；旧期 `2026-10-google-q3-cards` 原入口渲染、
  引擎 `eslint src effects` + `tsc` 均通过。Windows 本机的项目模式（目录联接 junction）尚未实测。
- 2026-10-28：整理为三步 + shared 结构；第 3 步 lint、音效规范测试、渲染正常；第 2 步 `npm run assets -- search` 正常；
  第 1 步 `npm run fetch-doc` 能启动；`consult-agy` 实测可用。
