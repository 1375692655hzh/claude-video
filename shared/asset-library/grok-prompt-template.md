# Grok 找素材提示词模板

用法：Claude 读完视频稿和脚本后，按镜头整理出"需求清单"，替换下面 `{{...}}` 部分，
存成 prompt.txt，再按 AGENTS.md 里的 Grok CLI 用法调用。返回的 JSON 用
`npm run assets -- import <返回文件> --project <项目id>` 导入素材库，然后 `verify`、`thumbs`。

调用前先用 `npm run assets -- search <关键词>` 查库，库里已有、可用的需求不要再交给 Grok。

---

I am producing a Chinese finance/tech video: {{一句话描述视频主题、日期、时长、画幅，例如 "a ~10 minute 16:9 1080p video about ... (Oct 2026)"}}.
I need B-roll footage and images for the specific needs listed below. Use web search (and X search) to find
REAL, currently accessible sources. Do NOT invent URLs — only list URLs you actually opened or saw in search results.

Where to look, in order of preference:
1. Official company sources: company YouTube channels, newsroom / press-kit / media-library pages (they often offer
   downloadable B-roll and high-resolution product photos).
2. Reputable media: CNBC, Bloomberg, Reuters, conference organisers' official channels.
3. X (Twitter) posts from the companies, executives or well-known analysts when the need is a quote, chart or
   breaking-news reaction (give the post URL).
4. Free-licence libraries for generic shots (city, office, trading floor, factory, data center, power grid):
   Pexels, Pixabay, Wikimedia Commons, NASA, U.S. government agencies.

Prefer footage published recently (state the publish date) and showing the current product generation.

Needs:
{{按镜头列出需求，每条一行，例如：
1. (shot 5, 6-10 s) NVIDIA GB200 / Vera Rubin rack close-up in a data center.
2. (shot 9, image) Official product photo of Micron HBM4.
3. (shot 12, X post) Jensen Huang or NVIDIA comment on ... }}

For each candidate also classify it using ONLY these values:
- domain (one or more): 金融市场, 宏观经济, 公司财报, 半导体, AI, 云计算, 数据中心, 能源电力, 通信, 网络安全, 消费, 汽车, 医药, 加密货币, 航天
- shot (one or more): 产品特写, 生产制造, 机房内景, 建设施工, 外景航拍, 人物采访, 会议演讲, 图表数据, 动画演示, 抽象背景, 新闻截图, 社交媒体帖子
- type: video, image or post
- license: official-press, youtube-standard, cc, public-domain or unknown

Output ONLY a JSON array, no prose. Aim for 2-3 candidates per need. Item format:
{"need": 1, "type": "video", "title": "...", "title_zh": "中文标题", "url": "https://...", "channel": "...",
 "official": true, "license": "official-press", "published": "2026-10-01",
 "timestamps": "00:10-00:25 rack close-up; 01:02-01:15 assembly line",
 "domain": ["半导体", "数据中心"], "shot": ["产品特写"], "tags": ["NVIDIA", "NVL72"],
 "notes": "why it fits, anything to watch out for (burned-in subtitles, watermark, logo overlay)"}

For timestamps use "unknown" if you cannot tell from chapters, description or transcript.
