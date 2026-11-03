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
| ④ 修改建议 | `1-视频稿/` | Claude 用外部交付 **H01** 生成外审提示词交给用户，用户拿去 Grok / Gemini 问询并把原始回复贴回；不自动调用外部智能体 | `<期名>/02-外部建议.md` |
| ⑤ 视频成稿 | `1-视频稿/` | 处理建议、去 AI 化、用户人工修改并确认；事实和判断强度不能漂移 | `<期名>/03-终稿-en.md`；有中文底稿时同时保留 `03-终稿.md` |
| ⑥ 脚本初稿 | `2-脚本/` | 读懂成稿，初步定风格、分镜、动效和逐镜素材需求；可在仓库对话做，也可用外部交付 **H03** 交给 Codex / GPT 做后贴回 | `<期名>/script-draft.md` |
| ⑦ 素材搜寻 | `2-脚本/` + 素材库 | 查库；库里没有的用外部交付 **H04** 交给 Grok 找源；导入、核实、缩略图，登记素材与缺口 | `<期名>/assets.md` + 素材库记录 |
| ⑧ 素材补全 | `2-脚本/` | 用外部交付 **H05** 给用户补件清单（股价、付费报道截图、录屏等）；登记后再搜剩余缺口，直到无阻塞缺口 | 完整 `assets.md` + `<期名>/材料/` |
| ⑨ 重新规划视频脚本 | `2-脚本/` | 根据真实素材重排画面、片段、动效和声音，交用户确认；准备至少一张风格参考图 | `<期名>/script.md` + `<期名>/refs/` |
| ⑩ 视频生成 | `3-视频生成/`（引擎） | 默认由 Claude 在本工作区直接完成配音、素材下载、动画、配乐音效和渲染；Claude Chat 交接包改为可选 | 新项目 `06-交付/<平台>/video.mp4`；旧期 `out/<期名>.mp4` |

## FAST 模式（上面 10 步是“标准模式”）

FAST 去掉的是审核和反复修改，**不是用户的选择**：标准模式里由用户选的，FAST 一样由用户选（人设、平台、视频风格、音色），只是在开工时一次选完，之后三段一口气做完、中途不停。

**开工时一次问齐**（用 AskUserQuestion，一次最多 4 问）：人设和平台；视频风格（先给 `style.mjs history` 和 `shared/style-library/预览.html`，用过的标出来，用户挑，可以每期换）；音色（先给 `voice.mjs history` 和 `shared/voice-library/试听.html`，用户挑）。Claude 不替用户定，也不默认“沿用上次”；用户明确说“跟上次一样”才沿用。选完用 `style.mjs use` / `voice.mjs use` 登记。

用户交付成稿 → 脚本 → 视频，新建：`node shared/tools/project.mjs new <短名> --persona <人设> --platform <平台> --fast`（project.json 记 `mode: "fast"`）。

| 段 | 做什么 | 不做 |
|---|---|---|
| F① 成稿 | 用户交付成稿，`project final <ID> <文件>` 存为 `03-终稿-en.md`，直接进脚本 | **零审核**：不做外审、事实 / 时效核查、去 AI 化、平台自检，不改一个字；成稿内容由用户负责 |
| F② 脚本 | 成稿直接拆成 `script.md` 分镜表（口播不改），按下面「内容 → 画面」表定每镜画面；素材只来自：动效库按成稿数字画、AI 生图（`npm run image`）、用户随稿附上的文件（放 `03-素材/原始/`）、素材库已有的 | **不做任何网络检索**（不找官方图、实拍、新闻素材）；素材补缺、人工补件（H05）、风格参考图、脚本确认 |
| F③ 视频 | 和标准⑩同一条流水线：逐镜配音 → 时间线 → 动画 → 配乐音效 → 分段渲染 → 字幕 | 数字人 |

**FAST「内容 → 画面」表**（拆分镜时照表选，动效 ID 见动效库 registry）：

| 成稿内容 | 画面 |
|---|---|
| 一个关键数字 | 大数字 `word-slam` / `count-up` / `score-slam` |
| 两个时期 / 两家对比 | 对比卡 `before-after` / `rebound-pair` / `hbar-compare` |
| 趋势、走势 | `line-draw`；拐点 `line-crash`、`axis-rescale` |
| 拆分、构成 | `waterfall` / `donut-fill` / `bar-grow` |
| 预期 vs 实际 | `expect-vs-actual` / `gauge-needle` |
| 公司之间的关系、资金流 | `flyline` / `cash-path` / `flywheel` |
| 时间顺序、事件经过 | `timeline-travel` / `check-steps` |
| 几条要点 | `card-stagger` / `list-brake` / `card-fan` |
| 原话、文件引用 | `callout` / `doc-zoom` / `marker-underline` |
| 章节开场 | 风格的 ChapterBadge + `title-rise`，背景用 AI 生图 |
| 概念、氛围、比喻（没有数字） | AI 生图 + `parallax-pan` / `crash-zoom` |

**AI 生图底线**：只做概念图、氛围图、章节背景、比喻示意；不做真人（含高管）照片、真实产品图、真实公司 logo，不做看起来像真实数据的图表（数据一律用动效库按成稿数字画）。生成的图登记在 `assets.md`，来源写“AI 生成（qwen-image）+ 提示词”。用户附了真实图片的优先用用户的。

FAST 照样要做的（技术和交付底线，不算审核）：素材登记来源（AI 生图写明）、用户附的第三方画面不带水印台标；音效规范（`sfx-rules` 自动拦）、配乐响度；英文字幕 srt；渲染后 ffprobe 查时长分辨率并抽帧看有没有文字重叠出框；发布包装（标题、描述、标签、信源列表、平台规定的免责声明，写在描述里不改口播）；出片后 `voice.mjs` / `style.mjs use … --status 成片` 登记。
`project check` 按 FAST 规则检查：不要求初稿、外审、素材台账、参考图和确认状态。用户中途要求审核或改稿，就转回标准模式（`set <ID> mode=standard` 后按对应步骤补齐）。

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
  voice-library/         全厂商全音色试听（ark / minimax / qwen / mimo，文件名 厂商-名称-性别-语种；总表 音色总表.csv、voices.json）
  handoff/               外部交付提示词模板 H01–H07 + 规则（见下文「外部交付」）
  tools/                 无依赖的 Node 脚本，从哪个文件夹运行都行：
    fetch-tencent-doc.mjs  腾讯文档 → Markdown（含图片）
    tts-mimo.mjs           MiMo 配音
    tts-ark.mjs            火山豆包 2.0 配音（key：ARK_PLAN_API_KEY 或 keys.env 的 VOLC_TTS_ACCESS_TOKEN）
    voice-library-build.mjs  按 voices.json 批量补齐音色试听（四家）
    voice.mjs              选音色：list 筛选 / history 各账号用过的音色 / use 登记本期音色 / page 生成 voice-library/试听.html
    tts-shots.mjs          ⑩逐镜配音（四家通用，音色取 project.json 的 voice），输出 04-音频/voice/shots.json（含实测时长）
    timeline.mjs           ⑩按配音时长排时间轴（章首停顿、配乐分段、音效点）→ 04-音频/timeline.json，画面和混音共用
    mix-audio.mjs          ⑩按 timeline.json 用 ffmpeg 混配音 + 配乐 + 音效（13 分钟片约 15 秒）
    render-chunks.sh       ⑩长片分段渲染：bundle → 反复 next → join（适配单条命令 3 分钟的 Linux 环境）
    gen-image-qwen.mjs     qwen-image 生图
    gen-image-codex.mjs    Codex CLI 生图（ChatGPT 账号，和 qwen 并列）
    assets.mjs             素材库工具（查 / 导入 / 核实 / 缩略图 / 按片段下载 / 回填）
    project.mjs            项目工具：new / list / status / check / set / final / paths / studio / render / lint / handoff
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
  | 外部交付提示词与回复 | —（旧期写在各阶段目录） | `08-外部交付/NN-Hxx-<模板>-<工具>-提示词.md`、`…-回复.md` |
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

## 外部交付（handoff，2026-11-03 起）

凡是交给外部工具（Grok、Gemini、Codex、GPT）或用户本人去做的环节，一律走 `shared/handoff/` 的模板，不在聊天里临时写长提示词。
详细规则和交付点总表见 `shared/handoff/README.md`。要点：

1. `npm run project -- handoff <ID> new <H01…H07> --tool <grok|gemini|codex|user>` 生成 `08-外部交付/` 下的提示词和空回复文件，并登记到 `project.json`。
2. Claude 把提示词里所有 `{{填写:…}}` 换成本期真实内容（外部工具读不到仓库时，正文要自带稿件全文和规则摘录），然后 `handoff <ID> send <编号>`（有遗漏会被拦下）。
3. **在聊天里一次给齐四样**：① 提示词文件路径；② 要附带的文件路径（或“无需附件”）；③ 可直接复制的提示词正文（太长时说明复制哪一段）；
   ④ 回收方式（贴到哪个文件、什么格式、贴完说什么）。缺一样都算没交付。
4. 停下等回收；用户贴回后 `handoff done`，Claude 验收处理完 `handoff close`。外部回复里的事实要核实后才能进稿件或素材台账。
5. `project check` 会拦下残留 `{{填写}}` 的提示词，并提醒尚未验收的交付。

**⑩ 制作流水线（2026-11-03 起）**：`tts-shots.mjs <ID>` 逐镜配音 → `timeline.mjs <ID> --chapters …` 排时间轴 →
Remotion 合成读 `04-音频/timeline.json` → `render-chunks.sh <ID> bundle / next / join` 分段渲染 → `mix-audio.mjs <ID>` 混音并在 join 时合入。
只看效果先出 `05-制作/cache/preview/`，用户说出片再复制到 `06-交付/<平台>/video.mp4`，同时生成 `captions-en.srt`。

**时效复查（H02）**：时效性选题（并购传闻、财报前后、监管事件）在 ⑤确认前、⑨确认前、⑩录音前各做一次“事实与时效核查”。
有新进展就回视频稿阶段改稿并重新确认，不在画面上静默替换。（2026-11-02 一期在⑩才发现交易已公告，⑥–⑨全部作废。）

## 提交规则

- 仓库在 GitHub `1375692655hzh/claude-video`（公开）。**提交代码、工具、规范、模板和公共库**（音色试听、动效、视频风格、BGM、音效、字体都进仓库，别人下载即可用）；
  每期的视频稿、脚本、素材、配音、成片、数字人结果只留在本地（见 `.gitignore`）。密钥永不提交。只在用户要求时提交和推送。
- 密钥放在用户环境变量里；云端（Linux 环境）读本机密钥文件 `.secrets/keys.env`（用户 2026-11-02 决定，已在 .gitignore，永不提交）。
  密钥不写进其他任何文件，也不在聊天里回显；脚本读取时不打印值。

## 环境

- **Claude 的 Linux 环境（Cowork，执行⑩的默认环境）**：Claude 在用户电脑上的隔离 Ubuntu 22.04（2 核、约 4GB 内存、约 10GB 盘），
  仓库挂载在 `$HOME/mnt/claude-video`。Node v22、FFmpeg 4.4、Python 3.10；yt-dlp 用 `pip3 install --user yt-dlp` 装（YouTube 解析加 `--js-runtimes node`）。
  联网走 claude.ai「设置 → 功能 → 网域许可清单」：2026-11-02 起用户改为**允许全部网域**（实测 MiniMax、火山 openspeech、Topview、MiMo、Google 均可达）。
  读不到 Windows 用户环境变量；改读 `.secrets/keys.env`（2026-11-02 定）。
  **数字人由 Codex 负责**（用户 2026-11-02 决定，不用 Claude Code）：Codex 装 Topview 官方插件 `topview-browser@topview`（远程 MCP `https://mcp-browser.topview.ai`，浏览器 OAuth，无 API Key），
  一键配置 `shared/tools/setup-codex-topview.ps1`（PowerShell 运行）。Topview 的 Unlimited 套餐不支持 MCP / 插件自动化调用。
  2026-11-02 已在 Codex 跑通（93 个直接工具）。数字人入口：`topview_avatar_video`（照片数字人说话视频）、`topview_generate_video` 的 `taskType="video_avatar"`；
  参数先用只读的 `topview_get_generation_config` 查，`topview_quote_creation` 报价，`topview_query_task` 查进度；没有独立的 lip_sync 工具。
- Windows 11，Node.js v24.15.0，npm 11.12.1，FFmpeg / FFprobe 8.1.2（winget，系统级）
- 密钥（用户环境变量，用 `setx` 保存）：`TENCENT_DOCS_TOKEN`（腾讯文档）、`MIMO_API_KEY`（配音）、
  `DASHSCOPE_API_KEY`（生图）、`MINIMAX_API_KEY`（MiniMax，音乐 API 无权限）。
- 外部工具：Codex CLI 0.162.1（npm 全局，ChatGPT 账号登录，生图用）、yt-dlp（winget）、Grok CLI（`C:\Users\hzh\.grok\bin\grok.exe`）、agy（Antigravity CLI，`C:\Users\hzh\AppData\Local\agy\bin\agy.exe`）、
  TopviewAI：旧版装在 Claude Code MCP 里（已弃用）；现改由 Codex 的 topview-browser 插件调用。

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
- **选音色流程（⑥定、⑩用）**：
  1. Claude 先跑 `node shared/tools/voice.mjs history --account <人设>`，把这个账号用过的音色和次数告诉用户；
  2. 给用户试听入口：`shared/voice-library/试听.html`（双击用浏览器打开，选账号后用过的排在最前、可按厂商 / 性别 / 语种筛选，点调用 ID 复制），
     或 `音色总表.csv`；用户自己挑，Claude 不替用户定；
  3. 用户选定后 `node shared/tools/voice.mjs use <项目ID> <试听文件名> [--status 选定]`：写入 `project.json` 的 voice 和 `usage.json` 历史，并刷新试听页；出片后再 `--status 成片` 登记一次。
- **选视频风格流程（⑨定、⑩用）**：
  1. Claude 先跑 `node shared/tools/style.mjs history --account <人设>`，告诉用户这个账号用过哪些风格；
  2. 给用户看 `shared/style-library/预览.html`（每套风格展示卡 + 4 张标准样张，用过的排最前）或各风格 `preview.jpg`；用户自己挑，也可以给参考图做新风格（按 `shared/style-library/README.md`「新增一套风格」，展示卡给用户确认后才算可用）；
  3. 选定后 `node shared/tools/style.mjs use <项目ID> <风格ID>`：写入 `project.json` 的 style 和使用历史；⑩用 `getStyle(id)` 取外观组件、`<MotionTheme theme=…>` 给动效配色；出片后 `--status 成片` 再登记。风格只管“长什么样”，动效库管“怎么动”，两者任意搭配。
- **配音选型**：不再默认 MiMo。⑥按 `shared/voice-library/音色总表.csv` 让用户试听选定（2026-11-03 起四家全量：火山 466、MiniMax 303、Qwen 3.0-tts-plus 599、MiMo 9），音色和调用 ID 记进 `00-项目设置.md`。
  ⑩逐镜生成配音（一镜一个文件，时长即镜头时长，不用估算）；火山接口 `openspeech.bytedance.com/api/v3/plan/tts/unidirectional`，`X-Api-Resource-Id: seed-tts-2.0`。
  Qwen TTS 用 `sk-sp-` 套餐 key（keys.env 的 `QWEN_TTS_API_KEY`），只走 `token-plan.cn-beijing.maas.aliyuncs.com/api/v1/services/audio/tts/SpeechSynthesizer`，且只开通了 `qwen-audio-3.0-tts-plus`；3.0-flash / 3.1-plus 需要按量付费的普通 key。MiniMax TTS 有每分钟请求上限，批量时并发 1、间隔约 2.4 秒。
- **配音（小米 MiMo TTS）**：英文视频的音色从 Mia、Chloe、Milo、Dean 里选（英文效果待试听，选定后写在这里）；"冰糖"是中文音色，只用于中文。接口 `https://api.xiaomimimo.com/v1/chat/completions`，模型 `mimo-v2.5-tts`，
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
  分批做。**后台进程会在命令结束时被杀**（2026-11-03 实测 `nohup` 也不行），长片要先 `remotion bundle` 一次，再按帧段分批 `render --frames=a-b --muted`（每段 ≤ 1000 帧、≤ 170 秒），
  最后 ffmpeg `concat` 拼接；音轨不要用 Remotion 渲（也要逐帧走浏览器），按同一时间表用 ffmpeg `adelay + amix` 直接混配音、配乐、音效。2 核虚拟机实测约 7 帧/秒，13 分钟片约 55 分钟。
- **yt-dlp 在 Linux 环境装在 `~/.local/bin`**，调用前 `export PATH=$HOME/.local/bin:$PATH`。Lumentum 官网视频是 Brightcove：页面里找 `players.brightcove.net/<账号>/<播放器>/index.html?videoId=<id>` 交给 yt-dlp；Marvell 视频站是 Vidyard（mp4 要带 `Referer: https://play.vidyard.com/`）。
- **Linux 环境默认不能删文件**（rm 报 Operation not permitted），要删时先向用户申请删除权限，或移到 `_to_delete/`。

## 环境验证记录

- 2026-10-26：Remotion 环境、`fetch-doc` 测试通过。
- 2026-11-02：改为独立项目工作区：`project new / check / render / lint` 实测通过；测试项目 `2026-11-02-linux-test` 在 Linux 环境渲染到
  `06-交付/youtube-long/video.mp4`（项目素材、公共动效库、字体、配乐都正常）；旧期 `2026-10-google-q3-cards` 原入口渲染、
  引擎 `eslint src effects` + `tsc` 均通过。Windows 本机的项目模式（目录联接 junction）尚未实测。
- 2026-10-28：整理为三步 + shared 结构；第 3 步 lint、音效规范测试、渲染正常；第 2 步 `npm run assets -- search` 正常；
  第 1 步 `npm run fetch-doc` 能启动；`consult-agy` 实测可用。
