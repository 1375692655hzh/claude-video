# YouTube 长视频标准：英文版（发布用）

适用：频道「Andy's Market Lens」的英文视频（2026-10-29 起频道只发英文视频；中文稿只作内部底稿）。
账号英文基础信息（频道名、Handle、频道简介）见 `../_人设/Andy人设.md`；那份文档其余内容（开场结尾话术、Slogan 用法、视觉方向、内容定位等）是 chatbot 的模拟方案，不采用。
**这份文件只写和中文版不同的地方**；没写到的一律按 `youtube-long.md`（〔官方〕M1–M10、章节、双层节拍、数据三要素、复盘方法都通用）。
编号沿用中文版，后缀 `-en` 表示英文版改写过的规则。

> 版本 v1（2026-10-29）：v0 在第一期英文稿（2026-10-google-q3）时建立；v1 改为发布用标准（只发英文）。数字都是起步值，等有后台数据再调。

---

## 〇、英文稿怎么来

- **源头是审核通过的中文 `03-终稿.md`**。英文稿是改写（transcreation），不是逐句翻译：事实、数字、章节顺序、判断强度和中文稿一致；
  句式、例子、过渡按英文观众的习惯重写。中文稿改了，英文稿跟着改，不单独改事实。
- 文件：`<期名>/03-终稿-en.md`（审核通过后做发布包装 `04-发布包装-youtube-en.md`）。
- **信源规则和中文版完全一样**（见 `../AGENTS.md`「信源规则」）：只点名知名投行、知名研究 / 数据机构、金融和企业界名人、公司一手资料。
- 去 AI 味用 `humanizer` skill，再按本文第五节的口播补充自检。

---

## 一、标题（覆盖中文版 T1、T2、T3、T6、T8、T9）

| # | 要求 |
|---|---|
| T1-en | **40–60 个英文字符，硬上限 70**（R1：30–50 最好，90+ 明显变差；财报题要放公司 + 代码 + 数字，所以放宽到 60） |
| T2-en | **前 40 个字符出现强认知主体 + 冲突或数字**（手机推荐流常截断在这附近）；事件型可用 `Alphabet Q3:` / `Google Earnings:` 开头 |
| T3-en | 弱认知实体为 0：分析师人名、小机构不进标题，用 `Wall Street`、`Bank of America` 这类强认知名字 |
| T6-en | 禁用：SHOCKING、INSANE、You Won't Believe、DESTROYED、Exposed、The Truth About、Nobody Is Talking About；除代码和缩写（AI、TPU、EPS）外不全大写；不用 emoji；不连用 `!!` |
| T8-en | 代码写在标题或简介第一行：`Alphabet (GOOGL)`；标题里写 `Google` 还是 `Alphabet` 看搜索习惯，财报题两个都要出现在标题或简介第一行 |
| T9-en | 金额写 `$51.4B` / `$9.1B`（标题、封面）；口播稿里写全 `51.4 billion dollars` 方便配音 |
| 大小写 | 统一 Title Case（`Why Google Fell 10% Despite Cloud Doubling`） |

T4、T5、T7、T10、T11 和评分表照中文版；评分表里"前 12 字宽"换成"前 40 字符"，"稍长（> 26 字宽）"换成"> 60 字符"。

**封面**：照 `youtube-long.md` 的封面规则（生图模型整张生成，提示词只给频道、标题、事件、核心信息和硬性限制）；提示词用英文，频道写 `Andy's Market Lens`。

---

## 二、开头（覆盖中文版 H3、H5、H6 和长度）

| # | 要求 |
|---|---|
| 长度 | **≤ 75 个英文词**（约 150 词 / 分钟，约 28 秒）；MiMo 英文音色语速未实测，第一期配音后按实测改 |
| H3-en | 开头 75 词里不说 "Welcome back to the channel"、"I'm Andy"、"In today's video"；名片条：`Andy | 10+ years investing in US & HK stocks`（措辞待用户定）。频道名和主持人只靠名片条和 YouTube 界面露出，口播不加自我介绍句（2026-10-29 定：新频道没有品牌认知，这句话不提供信息，还占开头节奏） |
| H5-en | 人名第一次出现带身份（`Alphabet's CFO`、`Bank of America analyst Justin Post`）；前 30 秒只用身份，不报全名 |
| H6-en | **一句 ≤ 20 个词**，一句一层意思；数字之间至少隔一个短句，别连报三个金额 |
| H8-en | 禁用填充：Let's dive in、Buckle up、Here's the thing、It's worth noting、Without further ado、In this video we'll、Make sure to watch until the end、game-changer、a whole new level |

H1、H2、H4、H7、H9、H10 照中文版（四要素：钩子、利害、信源、追问）。

---

## 三、正文（覆盖中文版第三节的长度）

- 语速按约 150 词 / 分钟估算：小节拍每 35–45 秒 ≈ **90–110 词**；大钩子每 2–2.5 分钟 ≈ **300–375 词**；10 分钟 ≈ 1500 词。
- 中文"我的判断是"统一写成 `My take:` 或 `My read:`，全片换着用，不要每章同一句。
- 中段订阅提醒一句话，不说 "smash that like button"。

---

## 四、数字、术语、写法

- **单位换算**：中文"亿" ÷ 10 = billion（514 亿 = 51.4 billion；5610 亿 = 561 billion；9240 亿 = 924 billion）。换算后逐个对照中文稿核一遍。
- **口播稿里的数字按读法写**：`51.4 billion dollars`、`103 percent`、`negative 9.1 billion dollars`；季度写 `the third quarter`；
  不写 `$`、`%`、`Q3`、`B`，避免配音读错（画面字卡再用 `$51.4B`、`+103%`）。
- **常用对照**：资本开支 capex（口播说 capital spending 也行）；自由现金流 free cash flow；经营现金流 operating cash flow；
  积压订单 cloud backlog；按市价增发 at-the-market share sales；回购 buybacks；一致预期 Wall Street estimates / consensus；
  印钞机 cash machine；浮亏 paper loss / unrealized loss；营业利润率 operating margin。
- 公司名：财报和代码用 Alphabet，产品和业务用 Google；人名用英文原名（Sundar Pichai、Anat Ashkenazi、Thomas Kurian、Philipp Schindler）。
- 免责声明：`This video is for information only and is not investment advice.`

---

## 五、去 AI 味口播补充（配合 `humanizer` skill）

- 删：not X but Y 的假对比、单句戏剧收尾（"And that changes everything."）、三连排比凑数、破折号连用、"delve / landscape / pivotal / underscore / testament"。
- 一句话读出来要能一口气说完；从句不超过一层。
- 保留栏目语气：直接、算账、给判断；不加中文稿没有的经历、数据和比喻。

---

## 六、发布包装（英文）

照 `youtube-long.md` 第四节，改动：简介前两行英文（钩子 + `Alphabet (GOOGL, GOOG)`）、英文章节时间戳、
标签加英文常见搜索词（`alphabet earnings`, `googl stock`, `google q3 2026`）、免责声明用上面的英文版。频道 Handle（`@AndysMarketLens`，待确认可注册）和频道简介见 `../_人设/Andy人设.md`。

---

## 七、英文稿自检（贴在 `03-终稿-en.md` 末尾逐项打勾）

- [ ] 事实、数字、章节顺序、判断强度和中文终稿一致；单位换算逐个核过
- [ ] 点名的信源都在信源规则名单里
- [ ] 开头 ≤ 75 词、每句 ≤ 20 词，四要素齐，首句钩子、末句追问
- [ ] 没有 H3-en、H8-en、T6-en 的禁用说法
- [ ] 口播里的数字按读法写（没有 `$`、`%`、`B`、`Q3`）
- [ ] 每章有 `My take` 类判断；章末有推翻顺向思维的问题
- [ ] 免责声明是第四节的版本
- [ ] 推荐标题 40–60 字符，前 40 字符有主体 + 冲突，3 个钩子类型不同
