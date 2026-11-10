# YouTube 长视频标准：英文版（发布用）

适用：已确认人设的英文 YouTube 长视频，**目标 15–25 分钟（≈ 2250–3750 词）**；中文稿只作可选的内部底稿。
**v4（2026-11-10）起最高优先级是 `youtube-long.md`〇.5「前紧中稳后强」五段结构**；本文第二、三节给出它的英文词数和例句。
人设、频道名、简介和 Handle 从每期 `00-项目设置.md` 指定的人设文件读取；Andy 只是预存人设之一。
**这份文件只写和中文版不同的地方**；没写到的一律按 `youtube-long.md`（〔官方〕M1–M10、章节、双层节拍、数据三要素、复盘方法都通用）。
编号沿用中文版，后缀 `-en` 表示英文版改写过的规则。

> 版本 v2（2026-11-10）：对齐中文版 v4〇.5 核心结构（10 秒 / 30 秒开头、每 3–4 分钟换挡、情绪钩子、数据反转、结尾明确喊订阅）。v1（2026-10-29）改为发布用标准（只发英文）。数字都是起步值，等有后台数据再调。

---

## 〇、英文稿怎么来

- 正常路径的源头是 `01-初稿.md` 和 `02-外部建议.md`；有中文底稿时，英文稿是改写（transcreation），不是逐句翻译：事实、数字、章节顺序、判断强度和中文稿一致，
  句式、例子、过渡按英文观众的习惯重写。中文稿改了，英文稿跟着改，不单独改事实。
- 用户可以直接交付英文成稿，保存为 `<期名>/03-终稿-en.md` 并跳过④⑤；不强制倒补中文稿。审核通过后再按需做 `04-发布包装-youtube-en.md`。
- **信源规则和中文版完全一样**（见 `../AGENTS.md`「信源规则」）：只点名知名投行、知名研究 / 数据机构、金融和企业界名人、公司一手资料。
- 去 AI 味用 `humanizer` skill，再按本文第五节的口播补充自检；最终由用户人工修改并确认。

---

## 一、标题（覆盖中文版 T1、T2、T3、T6、T8、T9）

> **v3（2026-11-10 用户定）：标题没有死规则，以极致流量为目标，标题党可以用**（全大写、SHOCKING、You Won't Believe、emoji 都可以）。
> **首选打法：爆款标题公式 K1–K6**（`Why Is Everyone Buying…?` / `The Real Reason…` / `This Is …'s REAL Moat` / `The Most Undervalued…` / `A vs B: Who REALLY Wins…?` / `This Stock Could Double…`），英文写法见 `templates/标题与开头句式.md` 第〇节；**建议 28–60 字符**（下表 T1-en 的 40–60 / 上限 70 作废）。
> 下表只是〔参考〕打法，不用不需要理由，外审和自检不再按它判不合格。唯一提示（不拦截）：标题说的事视频里要有，见中文版第一节开头。

| # | 要求 |
|---|---|
| T1-en | **40–60 个英文字符，硬上限 70**（R1：30–50 最好，90+ 明显变差；财报题要放公司 + 代码 + 数字，所以放宽到 60） |
| T2-en | **前 40 个字符出现强认知主体 + 冲突或数字**（手机推荐流常截断在这附近）；事件型可用 `Alphabet Q3:` / `Google Earnings:` 开头 |
| T3-en | 弱认知实体为 0：分析师人名、小机构不进标题，用 `Wall Street`、`Bank of America` 这类强认知名字 |
| T6-en | 禁用：SHOCKING、INSANE、You Won't Believe、DESTROYED、Exposed、The Truth About、Nobody Is Talking About；除代码和缩写（AI、TPU、EPS）外不全大写；不用 emoji；不连用 `!!`。允许 `You Think X? …` 反认知句式，但后面必须紧跟具体数字（中文版〇.5 O1） |
| T8-en | 代码写在标题或简介第一行：`Alphabet (GOOGL)`；标题里写 `Google` 还是 `Alphabet` 看搜索习惯，财报题两个都要出现在标题或简介第一行 |
| T9-en | 金额写 `$51.4B` / `$9.1B`（标题、封面）；口播稿里写全 `51.4 billion dollars` 方便配音 |
| 大小写 | 统一 Title Case（`Why Google Fell 10% Despite Cloud Doubling`） |

T4、T5、T7、T10、T11 和评分表照中文版（同样只是参考）；评分表里"前 12 字宽"换成"前 40 字符"，"稍长（> 26 字宽）"换成"> 60 字符"。

**封面**：照 `youtube-long.md` 第一节第 4 条（v6：极致对比 + 情绪张力 + 可读性 + 主体突出，路边小广告）。英文封面大字 **≤ 5 个词**，可以标题党（`$50B GONE`、`IT'S OVER?`、`DON'T BUY THIS`）；提示词用英文模板，给方向不给版式，频道名从本期人设文件读取。

---

## 二、开头（覆盖中文版 H3、H5、H6 和长度）

| # | 要求 |
|---|---|
| 长度 | **≤ 75 个英文词**（约 150 词 / 分钟，约 28 秒）；MiMo 英文音色语速未实测，第一期配音后按实测改 |
| H3-en | 开头 75 词里不说 "Welcome back to the channel"、"I'm …"、"In today's video"；名片条两行：第一行主持人 + 频道，第二行小字写人设中已确认的真实资历。Andy 人设可用 `Andy · Andy's Market Lens` / `10+ years investing in US & HK stocks`。频道名和主持人只靠名片条和 YouTube 界面露出，口播不加自我介绍句 |
| H5-en | 人名第一次出现带身份（`Alphabet's CFO`、`Bank of America analyst Justin Post`）；前 30 秒只用身份，不报全名 |
| H6-en | **一句 ≤ 20 个词**，一句一层意思；数字之间至少隔一个短句，别连报三个金额 |
| H8-en | 禁用填充：Let's dive in、Buckle up、Here's the thing、It's worth noting、Without further ado、In this video we'll、Make sure to watch until the end、game-changer、a whole new level |

H1、H2、H4、H7、H10 照中文版；H9 按中文版〇.5 O4 改为**五要素：钩子、利害、信源、好处、悬念**。

**〇.5 开头的英文写法（O1–O3）**

| # | 要求 | 例（数字为占位，用时以稿件为准） |
|---|---|---|
| O1-en | **前 10 秒 ≤ 25 词**，1–2 句，直接给最震撼的数字或悬念 | `Marvell just lost about 50 billion dollars in two days. Not because of a bad quarter. Revenue grew 37 percent.` / `You think Apple makes its money on iPhones? [X] percent of its gross profit now comes from services.` |
| O2-en | 前 30 秒抛一个具体主悬念，完整答案留到 S4；不写 `stay till the end` | `Stranger still, Nvidia has money in both companies. Why back the buyer and the target?` |
| O3-en | 前 30 秒一句具体好处，最多 3 样；不用 `In this video we'll` | `If you own AI chip stocks, I'll show you what this deal costs Marvell holders.` / `I'll give you the three numbers I'm watching before earnings.` |

---

## 三、正文（覆盖中文版第三节的长度）

- 语速按约 150 词 / 分钟估算：小节拍每 35–45 秒 ≈ **90–110 词**；大钩子每 2–2.5 分钟 ≈ **300–375 词**；10 分钟 ≈ 1500 词。
- **〇.5 五段的英文词数（20 分钟基准，2250–3750 词按占比换算）**：S1 ≤ 75；S2 ≈ 300–375（≤ 3 分钟）；S3 ≈ 1650–1800，分 3–4 个模块、每个 **450–600 词**（R1 每 3–4 分钟换挡）；S4 ≈ 600–750；S5 ≈ 150–300。
- S4 隐藏信息直接说出处：`It's on page 47 of the 10-Q.` / `Buried in the footnotes, …`；不说 `Nobody is talking about this`。
- 中文"我的判断是"统一写成 `My take:` 或 `My read:`，全片换着用，不要每章同一句。
- 中段订阅提醒一句话，不说 "smash that like button"。
- **结尾（C1–C4）**：`My take:` 判断 → 站队式问题（`Would you buy A here, wait for B, or stay out? Tell me in the comments.`）→ **明确喊订阅**（`Want more breakdowns like this? Subscribe.`，可加一句下期理由：`When the terms come out, I'll redo this math.`）→ 免责声明。不用 `That's it for today`。

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

照 `youtube-long.md` 第四节，改动：简介前两行英文（钩子 + 公司和代码，例如 `Alphabet (GOOGL, GOOG)`）、英文章节时间戳、
标签加英文常见搜索词（如 `alphabet earnings`, `googl stock`, `google q3 2026`）、免责声明用上面的英文版。Handle 和频道简介从本期人设文件读取。

---

## 七、英文稿自检（贴在 `03-终稿-en.md` 末尾逐项打勾）

- [ ] 有中文底稿时，事实、数字、章节顺序、判断强度和它一致，单位换算逐个核过；直接英文成稿已完成独立事实核查
- [ ] 点名的信源都在信源规则名单里
- [ ] 〇.5 核心结构：15–25 分钟（2250–3750 词）或用户指定时长；S1–S5 已标出，词数在范围内
- [ ] 前 10 秒 ≤ 25 词，直接给数字或悬念；前 30 秒有具体主悬念（答案在 S4）和一句具体好处
- [ ] S3 每 450–600 词有 `‖切换‖`，相邻模块讲法不同，至少一个对手 / 同行 / 历史对比；每个模块有挂在事实上的情绪钩子
- [ ] S4 有一条有出处的隐藏信息，改写了共识或回答了主悬念
- [ ] 结尾：判断 → 站队式问题 → 明确喊订阅 → 免责；全片订阅提醒共 2 次
- [ ] 开头 ≤ 75 词、每句 ≤ 20 词，五要素齐，首句钩子、末句悬念或追问
- [ ] 口播没有 H3-en、H8-en 的禁用说法（T6-en 只是标题参考，不再检查）
- [ ] 口播里的数字按读法写（没有 `$`、`%`、`B`、`Q3`）
- [ ] 每章有 `My take` 类判断；章末有推翻顺向思维的问题
- [ ] 免责声明是第四节的版本
- [ ] 推荐标题：5–8 个以点击为目标的候选、3 个推荐（无字数和用词限制）
