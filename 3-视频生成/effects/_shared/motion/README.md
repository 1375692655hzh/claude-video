# 动效库（effects/_shared/motion）

各期共用的 Remotion 动效：51 个动作（33 个基础动作，其中 5 个实拍卡；2026-11-03 新增 18 个镜头配方）+ 界面框架（Frame / Heading / NoteCard / ChannelMark）+ 6 个拼版小部件，三套主题（`cards` 浅灰白卡片，默认；`navy` 深海军蓝，即 caspa-ai-profit / 2026-10-google-q3 的风格；`deco` Gilded Deco 近黑底 + 香槟金，即 2026-11-02-marvell-lumentum 的风格）。

**动效和风格分开**：动作只管怎么动（路径、节奏、缓动、触发时机），颜色、字体、圆角、阴影全部从主题读。同一个动作换主题就换整套画面，新增风格只要在 `theme.ts` 加一套主题，现有动作全部可用。
第 2 步脚本里按**动效 ID** 写动画设计，第 3 步照 ID 调用，不再每期从头写图表动画。

- 看全部动作：`npm run dev` → Studio 左侧 `motion-library` 文件夹。`motion-gallery`（卡片风）、`motion-gallery-navy`（深蓝）、`motion-gallery-deco`（Gilded Deco）连播全部动作，左上角写 ID；`motion-<id>` 单独预览，右侧 Props 面板可以改 `theme` 和 `props` 试内容。
- 渲染一个动作给别人看：`npx remotion render motion-waterfall out/motion-waterfall.mp4`（Studio 开着时加 `--port=3123`）。

## 在一期动画里用

```tsx
import { Sequence, useVideoConfig } from "remotion";
import { Motion, MotionTheme, Waterfall, motionFrames, useMotionFont, Backdrop } from "../_shared/motion";

export const Main: React.FC = () => {
  useMotionFont(); // 加载 public/library/fonts/inter-var.woff2，整片调用一次
  const { fps } = useVideoConfig();
  return (
    <MotionTheme theme="cards">            {/* 不包就是 cards；深蓝写 "navy" */}
      <Backdrop />                           {/* 主题底色；叠在实拍上时不要放 */}
      <Sequence from={0} durationInFrames={motionFrames("waterfall", fps)}>
        <Waterfall
          steps={[{ label: "Reported EPS", value: 2.12 }, { label: "Add back SpaceX mark-down", value: 0.55 }]}
          result="Ex-SpaceX EPS" zero={640} scale={150} decimals={2} prefix="$"
          target={{ value: 3.02, label: "Consensus $3.02", gapText: "Still −12%" }}
        />
      </Sequence>
      <Sequence from={150} durationInFrames={motionFrames("count-up", fps)}>
        <Motion id="count-up" props={{ to: -9.1, label: "Free cash flow, Q3 2026" }} />
      </Sequence>
    </MotionTheme>
  );
};
```

- 两种写法画面一样：`<Waterfall .../>` 有类型提示；`<Motion id="waterfall" props={{...}} />` 和脚本里的 ID 一一对应，适合照脚本批量排。
- 时间从所在 `Sequence` 的起点算。入点对齐配音：用各期 `timeline.ts` 的 `at(n)`（镜头 n 的人声起点）当 `from`。
- `motionFrames(id, fps, props)` 给出这个动作完整播完并定格 450ms 需要的帧数；waterfall、check-steps、focus-row 的时长随内容变，要把 props 一起传进去。
- 动作都按 1920×1080 设计；合成尺寸不同（比如 1280×720 预览）会等比缩放。竖屏 Reels 暂不适配，需要另排版。
- 颜色不要写死：用 `tone`（`ink / blue / teal / red / amber / muted`），主题决定实际颜色。teal = 好（增长、超预期），red = 坏，amber = 提醒（一次性、口径、预期线）。

## 界面框架和去 PPT 感

版式照参考图（Remotion 教程那一帧）定死，每个镜头都套在 `<Frame>` 里：浅灰底、顶栏（品牌 / 本期 + 渐隐细线，右边绿色章节号）、底部字幕条、青蓝分段进度条、右下角频道标。

```tsx
<Frame chapterNum={3} chapterName="Layer 2 · Cash flow" done={3} chapterProgress={0.5} caption="Free cash flow was negative $9.1 billion.">
  <Heading kicker="LAYER 2 · CASH FLOW" title="Overspent on capex?" />   {/* 左上标题区 */}
  <NoteCard title="Not spending too much" sub="Collecting too little" /> {/* 右上浮动说明卡 */}
  <FootageStat src={staticFile("2026-10-google-q3/img/m03.jpg")} value="−$9.1B" tone="red" />
  {/* 数据 / 卡片类动作包一层 MotionFit，整体缩进左侧内容区，右侧留白 */}
  <MotionFit><Waterfall /></MotionFit>
</Frame>
```

- 内容靠左，占画面约 60%（`LAYOUT`：x 112、y 300、宽 1040），右侧只放数字卡或说明卡。
- 实拍不铺满全屏，装进实拍卡（`footage-stat`、`pin-label`、`split-media`、`doc-zoom`、`photo-stack`、`media-card`、`browser-card`），和其他卡片同一套圆角和阴影。
- 静态图在卡片里一直有镜头运动（`move`: in / out / left / right / up / down，`spanMs` 设成镜头时长）。
- 纯图表只留给要"算账"的镜头，而且前后都接实拍卡。

## 节奏规则（时间分级参考 wise-motion）

- 每个动作先留白 150ms 再动（`LEAD`），主动作用 600 / 1200 / 1800 / 2400ms 四档，结束后定格 450ms（`HOLD`）再切。
- 一个画面同时只让一件事在动：卡片先落位，数字再滚，最后才弹结论胶囊。错峰间隔 0.1–0.12 秒。
- 入场用 outCubic，弹性落位用 outBack，移动和描线用 inOutCubic；只有打字和进度条用匀速。
- 所有动作只依赖时间（不用 `Math.random`、不用 CSS transition），同一帧永远同一画面，Studio 预览和渲染一致。

## 动作一览

| 分类 | ID | 名称 | 时长 | 什么时候用 | 主要 props |
|---|---|---|---|---|---|
| 文字 | `title-rise` | 标题逐词升入 | 1.8s | 新画面主标题 | `kicker` `title` `top` |
| 文字 | `word-slam` | 单词重击 | 1.2s | 一锤定音的词，配合音乐静音点 | `word` `color` |
| 文字 | `highlight-sweep` | 荧光底纹扫过 | 1.2s | 主题句关键短语 | `before` `mark` `after` `size` |
| 文字 | `caption-bar` | 字幕条逐词显现 | 2.4s | 单句强调（整片字幕仍用各期 subs） | `text` `spanMs` |
| 卡片 | `card-stagger` | 卡片错峰弹出 | 1.8s | 2–4 个指标卡 | `items[{label,value,tone}]` |
| 卡片 | `card-push` | 卡片推入转场 | 1.2s | 章节卡、段落转场 | `fromTitle` `toNum` `toTitle` `toSub` |
| 卡片 | `focus-row` | 逐行聚焦 | 随 cues | 成绩单、表格逐行讲 | `rows[{label,value,note,tone}]` `cues`（每行亮起的毫秒） |
| 卡片 | `pill-pop` | 胶囊卡弹出 | 1.2s | 补充信息、问句 | `title` `sub` `tone` `icon`（box/trend/alert/check） |
| 卡片 | `check-steps` | 步骤卡逐项打勾 | 随步数 | 流程、论点、观察指标 | `steps[{title,rows}]` `stepMs` |
| 卡片 | `card-split` | 卡片对开 | 1.8s | 一个数拆两块但没披露 | `top` `value` `left` `right` `mid` |
| 卡片 | `rebound-pair` | 左右对向滑入回摆 | 1.8s | 两方对照 | `left/right{tag,kicker,value,tone}` |
| 数据 | `count-up` | 数字滚动落定 | 1.5s | 单个大数字 | `from` `to` `decimals` `format`（money/pct/plain） `unit` `label` `tone` |
| 数据 | `bar-grow` | 柱条依次长高 | 2.4s | 增速对比，可带预期虚线 | `bars[{label,value,ref,tone}]` `max` `unit` |
| 数据 | `waterfall` | 瀑布图分段算账 | 随步数 | EPS 加回、现金流算账 | `steps[{label,value,tone}]` `result` `zero` `scale` `target{value,label,gapText}` |
| 数据 | `hbar-compare` | 横条同比例对比 | 2.4s | 体量对比；有负值自动左右发散 | `rows[{label,value,tone}]` `max` `ratio` `ratioSub` |
| 数据 | `line-draw` | 折线逐点描出 | 2.4s | 季度走势，零线下变红 | `points[{label,value}]` `min` `max` `note` |
| 数据 | `expect-vs-actual` | 预期框 vs 实际柱 | 2.4s | 实际 vs 预期 | `title` `expected` `actual` `gapLabel` `tone` `scale` |
| 数据 | `line-crash` | 股价线断崖 | 2.4s | 开场 / 结尾的大跌 | `pre` `post` `drop` `tag` |
| 数据 | `donut-fill` | 环形占比补满 | 2.4s | 占比变化 | `items[{label,value,tone}]` `caption` |
| 数据 | `ruler-markers` | 刻度尺落点 | 3.0s | 超没超预期取决于口径 | `min` `max` `marks[{value,label,tone}]` `actual` |
| 数据 | `progress-overflow` | 进度条溢出 | 2.4s | 花掉的超过赚到的 | `value` `label` |
| 数据 | `callout` | 引线标注 | 1.5s | 在照片上点出对象（叠实拍时 `backdrop={false}`） | `x` `y` `dx` `dy` `label` |
| 流程 | `cash-path` | 现金光点走流程 | 4.2s | 先投入后回款 | `stations` `dipFrom` `dipTo` `dipLabel` |
| 流程 | `flywheel` | 飞轮反转 | 3.6s | 商业循环被反过来 | `nodes` `reverseAt` `center` `centerAfter` |
| 媒体 | `media-card` | 实拍装进卡片 | 3.0s | B-roll、官方照片 | `src` `startFrom` `caption` `sub` `grade` |
| 媒体 | `browser-card` | 浏览器卡片 | 3.6s | 网页、AI 搜索；可放录屏 | `url` `query` `src` `tag` |
| 实拍卡 | `footage-stat` | 实拍卡 + 数字卡 | 2.4s | 左侧实拍卡、右侧数字卡（代替单独的数字页） | `src` `move` `spanMs` `caption` `kicker` `value` `sub` `tone` `extra` |
| 实拍卡 | `pin-label` | 实拍物体钉标签 | 2.4s | 在实拍卡里的物体上钉 1–3 个读数（坐标以卡片左上角为原点） | `src` `move` `caption` `pins[{x,y,dx,dy,label,value,tone,at}]` |
| 实拍卡 | `split-media` | 实拍卡 + 数据栏 | 2.4s | 左侧实拍卡、右侧几行数；传 `src2` 变成两张实拍卡对照 | `src` `caption` `title` `rows` `src2` `caption2` |
| 实拍卡 | `doc-zoom` | 财报原文推近高亮 | 2.7s | 文档窗口卡里推近某行 → 底纹扫过 → 右侧读数卡 | `src` `focus{x,y,w,h}` `zoom` `note` `noteSub` `tone` `source` |
| 实拍卡 | `photo-stack` | 实拍卡依次落下 | 随张数 | 几张实拍快速交代一个场景 | `srcs` `captions` `stepMs` |
| 转场 | `iris-preentry` | 圆窗叠入下一幕 | 1.5s | 实拍 → 卡片界面 | `src` `cx` `cy` `next`（下一幕的节点） |
| 全局 | `chapter-progress` | 章节进度条推进 | 1.5s | 每章开头 | `from` `to` `labels` `brand` `episode` |

### 镜头配方（2026-11-03 新增，参考 video-shotcraft 配方卡）

| 分类 | ID | 名称 | 时长 | 适合的财经画面 | 主要 props |
|---|---|---|---|---|---|
| 镜头 | `crash-zoom` | 急推点名 | 2.2s | 财报截图 / K 线 / 产品图里点名一块：先四角标锁定，再急推 | `src` `target{x,y,w,h}` `zoom` `mode`（slam / bounce） `label` `tone` |
| 镜头 | `parallax-pan` | 分层视差横移 | 4.2s | 产业链一排公司、几条业务线横向巡览，停稳时主角卡浮起 | `items[{kicker,value,tone}]` `backdropText` `hero` |
| 数据 | `gauge-needle` | 仪表扫针读数 | 2.4s | 需求满足率、产能利用率、估值分位、情绪指数 | `value` `min` `max` `unit` `label` `zones[{to,tone,label}]` |
| 数据 | `axis-rescale` | 冲破图框重标轴 | 3.3s | 营收 / 利润突然跳升，“旧坐标装不下” | `points[{label,value}]` `burst{label,value}` `unit` `title` |
| 数据 | `timeline-travel` | 时间轴横移 | 3.8s | 事件时间线（投资、财报、传闻、公告），末站急停 | `events[{date,title,sub,tone}]` |
| 数据 | `before-after` | 前后对比拉杆 | 2.6s | 两年对比、改前改后、预期 vs 实际 | `before{kicker,value,sub}` `after{…}` `srcBefore` `srcAfter` |
| 数据 | `list-brake` | 长列表急刹 | 2.9s | 排行榜、历史大交易表：滚动后停在本期主角那行 | `rows[{rank,label,value}]` `target` `title` |
| 强调 | `spotlight-sweep` | 暗场聚光扫过 | 3.3s | 逐个介绍 2–4 个产品 / 业务，最后全场点亮 | `panels[{kicker,value,tone}]` |
| 强调 | `scan-bracket` | 文档扫描核实 | 3.5s | 财报 / 公告 / 8-K 原文“读过、核实过”，比 `doc-zoom` 更有仪式感 | `src` `label` `passes` `tone` |
| 强调 | `score-slam` | 数字重拳砸入 | 1.2s | 全片最重的一两个数字（交易额、两日跌幅） | `value` `decimals` `prefix` `unit` `label` `tone` `plus` |
| 流程 | `flyline` | 弧线飞线流动 | 2.4s | 投资关系、资金流、供货关系，光点持续流动 | `nodes[{id,x,y,label,tone}]` `links[{from,to,label,tone}]` |
| 转场 | `blinds-wipe` | 百叶窗翻页 | 1.7s | 章节之间的通用几何转场 | `from` `to` `slats` |
| 转场 | `whip-pan` | 甩镜转场 | 1.1s | 能量高的衔接（结论 → 下一章） | `from` `to` |
| 文字 | `marker-underline` | 马克笔下划线 | 1.8s | 标题里强调一个词（rivals / dilution） | `kicker` `before` `mark` `after` `tone` |
| 文字 | `outline-fill` | 空心字点亮 | 2.1s | 一个词的重锤一拍，两侧放前后读数 | `word` `leftLabel` `rightLabel` `tone` |
| 文字 | `title-demote` | 标题降为小标签 | 2.8s | 章节开场：大标题让位给内容卡 | `num` `title` `items[{kicker,value,tone}]` |
| 入场 | `card-fan` | 卡片叠落展扇 | 3.4s | “接下来看这几件事”：展开后抽出要讲的一张 | `cards[{kicker,title,tone}]` `pick` |
| 入场 | `trace-circle` | 描边画出卡片 | 2.8s | 单个重点数字卡被点名入场，数字下补一笔 | `kicker` `value` `sub` `tone` |

用法和基础动作一样：`<Motion id="crash-zoom" props={{ src: staticFile("assets/docs/A09.png"), target: {...} }} />`。
`blinds-wipe` / `whip-pan` 独立预览时自带前后两幕；正片里做两段画面之间的转场时，把前后两段的标题传进来，或参照写法用两段真实画面替换 `Scene`。
选用提示：`score-slam`、`outline-fill`、`whip-pan` 能量高，一支片各用 1–2 次；`scan-bracket`、`spotlight-sweep` 适合暗色主题（`navy` / `deco`），在 `cards` 上效果偏弱。

素材：`src` 传 `staticFile("<期名>/video/x.mp4")` 或图片地址。视频用 `OffthreadVideo`（静音，跟时间轴走），`startFrom` 是片段内的起始秒数。不传 `src` 显示占位插画，可以先排版后补素材。

## 拼版小部件（blocks.tsx）

不占整屏，放在自己写的场景里：`Count`（行内数字滚动）、`Tag`（标签胶囊）、`Stamp`（印章）、`Mark`（打勾 / 打叉）、`Source`（右上信源条）、`NameStrip`（左下名字条）。
都跟主题走，`at` 是本段开始后的毫秒数。另有积木 `Canvas`、`Card`、`Kicker`、`Label`、`Num`、`Chip`、`Media`、`enter()`（ui.tsx）。

## 新增一个动作

1. 在对应分类的 `motions-*.tsx` 里写组件：只用 `useMs()` 取时间，用 `seg(t, start, dur, ease)` 算进度，颜色从 `useTheme()` 取，外层包 `<Canvas>`。
2. 在 `registry.ts` 的 `MOTIONS` 里登记 ID、中文名、分类、用途、时长；时长随内容变的写 `durationFor`。
3. 在本文件的表里加一行；`npm run dev` 看 `motion-gallery` 和 `motion-gallery-navy` 两套主题都正常；`npm run lint`。
4. 第 2 步脚本模板里的动效清单指向本文件，不用另改。

## 来源和授权

- 镜头配方类 18 个动作参考 [video-shotcraft](https://github.com/Vincentwei1021/video-shotcraft)（Apache-2.0，commit 1266a3e）的配方卡，代码为本项目按本库规范重写（`motions-shot.tsx`），不含原项目素材；`registry.ts` 的 `ref` 写 `shotcraft:<分类>/<卡名>`。配方卡原文和参考实现留在 `.agents/skills/video-shotcraft/`。
- 节奏分级和部分动作关系参考 [wise-motion](https://github.com/wisewong6/wise-motion)（Apache-2.0）。本目录的代码为本项目重新编写，不含 wise-motion 的源码或素材；`registry.ts` 的 `ref` 字段记着每个动作借鉴的条目名。
- 字体 Inter、Montserrat（均 SIL OFL 1.1）。字体文件放在 `public/library/fonts/`，按 `.gitignore` 不进仓库；新电脑上从 Google Fonts 下载 Inter 可变字体存成 `inter-var.woff2`，Montserrat 600–900 存成 `montserrat-latin-<字重>-normal.woff2`（`deco` 主题用；缺文件时自动退回 Inter）。
- 其他开源动效库的授权和适用场景见同目录 `OPEN-SOURCE.md`。
