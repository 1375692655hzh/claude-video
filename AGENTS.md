# AGENTS.md（工作流总说明）

英文财经 YouTube 频道「Andy's Market Lens」（英文频道；主持人 Andy，港美股投资 10 年以上）的视频生产工作流。
**2026-10-29 起只发英文视频**：中文稿只作内部底稿（用户用中文审逻辑和事实），发布、配音、画面一律用英文稿。账号英文基础信息（频道名、Handle、频道简介）见 `1-视频稿/_人设/Andy人设.md`；那份文档其余内容是用户随手问 chatbot 得到的模拟方案，**不采用**。视频怎么写以 `1-视频稿/platforms/youtube-long-en.md` 为准。
（原名「Andy港美观察」，中文频道；旧稿和 caspa-ai-profit 成片里的旧名不改。）工作流分三步，
**每一步是一个独立文件夹**，用户会单独打开某个文件夹做那一步的任务。打开子文件夹时，这份总说明和该文件夹的 AGENTS.md 都会生效。

| 步骤 | 文件夹 | 负责 | 交付 |
|---|---|---|---|
| 1 视频稿 | `1-视频稿/` | 选题/素材 → 初稿 → 爆款优化（Claude + agy）→ 去 AI 味 → **用户审核** → 发布包装（标题、封面、简介、置顶评论） | `<期名>/03-终稿-en.md`（发布用；中文 `03-终稿.md` 是底稿）、`<期名>/04-发布包装-youtube-en.md` |
| 2 脚本 | `2-脚本/` | 读懂视频稿和材料 → 定风格 → 分镜 → 找素材（素材库 + Grok）→ 页面与动画设计 | `<期名>/script.md`（或腾讯文档） |
| 3 视频生成 | `3-视频生成/` | Remotion 项目：配音、下载素材片段、生图、数字人、配乐音效、动画、渲染 | `out/<期名>.mp4` |

目前只做 **YouTube 长视频**；以后加 Shorts、B 站、Instagram 时，在 `1-视频稿/platforms/` 加平台规范。

## 目录

```
AGENTS.md / CLAUDE.md    本文件（总说明）
1-视频稿/                第 1 步（见其 AGENTS.md）
2-脚本/                  第 2 步（见其 AGENTS.md）
3-视频生成/              第 3 步，Remotion 项目（node_modules 在这里）
shared/                  两步以上共用
  asset-library/         素材库：只记来源链接、可用片段、分类、缩略图，不存原文件（第 2 步搜索登记，第 3 步下载回填）
  voice-library/         音色试听（第 2 步选音色，第 3 步配音）
  tools/                 无依赖的 Node 脚本，从哪个文件夹运行都行：
    fetch-tencent-doc.mjs  腾讯文档 → Markdown（含图片）
    tts-mimo.mjs           MiMo 配音
    gen-image-qwen.mjs     qwen-image 生图
    gen-image-codex.mjs    Codex CLI 生图（ChatGPT 账号，和 qwen 并列）
    assets.mjs             素材库工具（查 / 导入 / 核实 / 缩略图 / 按片段下载 / 回填）
    consult-agy.mjs        请 agy（Gemini 等）给第二意见，只读
.agents/skills           项目级 skill（.claude/skills 指向它）：Remotion 系列、humanizer、humanizer-zh；清单在 skills-lock.json
```

每个步骤文件夹都有 `package.json`，把共享工具映射成 `npm run fetch-doc / image / image-codex / assets / tts / consult`；
第 1、2 步的 `package.json` 没有依赖，不需要 `npm install`。

## 交接约定

- **期名**：同一期视频在三个文件夹里用同一个名字，格式 `YYYY-MM-<英文短名>`（如 `2026-11-ai-profit`）。
  第 1 步 `1-视频稿/<期名>/`，第 2 步 `2-脚本/<期名>/`，第 3 步 `3-视频生成/effects/<期名>/` 和 `public/<期名>/`。
- **1 → 2**：用户审核通过的 `1-视频稿/<期名>/03-终稿-en.md`（口播原文）；中文 `03-终稿.md` 供理解内容。口播文字只在第 1 步改（先改中文底稿，再同步英文稿）；后面发现要改稿，回第 1 步改。
- **2 → 3**：用户确认过的 `2-脚本/<期名>/script.md`，写明风格、分镜、素材库 ID + 片段、动画设计、音效。
  第 2 步只找素材、不下载；第 3 步按片段下载。
- 每一步做完、需要用户确认的地方要停下来等，不要一口气跑到底。
- **信源**：口播和画面里只点名知名投行、知名研究机构、金融和企业界名人，或公司一手资料（财报、电话会）；海豚研究、长桥、华尔街见闻等不点名。细则见 `1-视频稿/AGENTS.md`「信源规则」。

## 提交规则

- 仓库在 GitHub `1375692655hzh/claude-video`（公开）。**只提交代码、工具、规范和模板**；每期的视频稿、脚本、素材、
  配音、配乐、音效、数字人结果都只留在本地（见 `.gitignore`）。只在用户要求时提交和推送。
- 密钥只放在用户环境变量里，不写进任何文件，也不在聊天里回显。

## 环境

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

## 环境验证记录

- 2026-10-26：Remotion 环境、`fetch-doc` 测试通过。
- 2026-10-28：整理为三步 + shared 结构；第 3 步 lint、音效规范测试、渲染正常；第 2 步 `npm run assets -- search` 正常；
  第 1 步 `npm run fetch-doc` 能启动；`consult-agy` 实测可用。
