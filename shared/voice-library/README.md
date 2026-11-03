# 音色库

各家 TTS 的**全部系统音色**试听，每个音色一句 10 字以内的问候，用该音色自己的语种念。

文件名规则：`厂商-名称-性别-语种.mp3`（例 `ark-Tim-男-美式英语.mp3`）。调用时用的 ID 查 `音色总表.csv`（Excel 可直接打开）或 `voices.json`。

| 厂商 | 模型 | 总数 | 女 | 男 | 语种分布 |
|---|---|---|---|---|---|
| ark | 豆包语音合成 2.0（seed-tts-2.0） | 466 | 195 | 271 | 中文 276、美式英语 78、印尼语 16、巴西葡萄牙语 14、泰语 11、墨西哥西语 11、日语 9、越南语 8、西班牙语 8、英式英语 5、俄语 5、马来语 4、菲律宾语 4、法语 4、韩语 4、意大利语 3、阿拉伯语 2、德语 2、澳洲英语 1、阿拉伯语（埃及口音） 1 |
| minimax | MiniMax speech-2.8-hd | 303 | 147 | 156 | 葡萄牙语 73、中文 56、韩语 49、西班牙语 47、英语 18、日语 15、印尼语 9、俄语 8、粤语 6、法语 6、意大利语 4、德语 3、荷兰语 2、阿拉伯语 2、土耳其语 2、乌克兰语 2、越南语 1 |
| qwen | qwen-audio-3.0-tts-plus | 599 | 420 | 179 | 中文 591、英语 8 |
| mimo | 小米 mimo-v2.5-tts | 9 | 5 | 4 | 中文 5、英语 4 |

生成日期：2026-11-02。重新生成/补缺：`node shared/tools/voice-library-build.mjs shared/voice-library/voices.json shared/voice-library`（说明见脚本头）。

## 怎么选（给用户）

- **网页试听**：双击 `试听.html`（浏览器打开即可，不用联网）。顶部选账号，这个账号用过的音色会标 ★ 并排在最前；可按厂商、性别、语种筛选，搜索名称或特质，点调用 ID 复制。
- **看历史**：`node shared/tools/voice.mjs history --account Andy`（数据在 `usage.json`，按账号记录每期用了哪个音色、试做还是成片）。
- **登记选择**：`node shared/tools/voice.mjs use <项目ID> <试听文件名>`；试听页会同步刷新。
- 新增账号：在 `usage.json` 的 `accounts` 里加一行“账号名: 频道名 · @handle”。

## 说明

- **ark**（火山/豆包 2.0）：音色表来自火山官方文档 tone-list-3，`*_uranus_*` 与 `ICL_uranus_*` 全收；部分中文音色支持多语种/方言，试听统一念中文。
- **minimax**：`get_voice` 接口返回的全部 303 个系统音色。性别按官方描述判定，描述缺失的按名称和音高判定；`Russian_HandsomeChildhoodFriend` 官方描述写"少女"但实际是男声，按男声标注。
- **qwen**：`qwen-audio-3.0-tts-plus` 的 2 个系统音色 + 官方 Excel 列出的 597 个基础音色（ID 前缀 `qwen-audio-3.0-tts-plus-`）。走百炼 Token Plan 北京区：`token-plan.cn-beijing.maas.aliyuncs.com`，key 存 `QWEN_TTS_API_KEY`。
- **mimo**：官方只有 9 个音色，全收。旧试听移到 `mimo/_old/`。
- Key 全部在 `.secrets/keys.env`，不进仓库。

## 用哪家音色就配哪家的 key

试听不需要 key。选定音色后 `voice.mjs use` 会提示这家要什么 key；没配 key 时 `tts-shots.mjs` 会停下来说明去哪开通、填哪个变量。模板：`shared/keys.env.example` → 复制成 `.secrets/keys.env` 填写。
