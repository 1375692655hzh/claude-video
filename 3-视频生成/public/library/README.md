# 常用素材库（配乐 / 音效）

做一次、各个视频反复用的素材。和 `../shared/asset-library/`（只记外部链接）不同，这里**直接存文件**，
放在 `public/` 下，动画里用 `staticFile("library/...")` 引用。

```
public/library/
  music/   背景音乐（mp3，响度约 -17.5 LUFS，峰值 ≤ -2 dB）
  sfx/     音效（mp3，峰值 -3 dB，首尾静音已裁）
```

## 配乐

元数据在 `effects/_shared/music-library.ts`，组件 `effects/_shared/Bgm.tsx`，试听用 Studio 里的 `bgm-preview`
（右侧改 `track` 和 `seconds`）。

| id | 名称 | 情绪 | 适用 | BPM | 时长 | 循环段 |
|---|---|---|---|---|---|---|
| bgm-tech-steady | 科技稳进 | 自信、向前推进、积极但克制 | 主力背景：讲行业、公司、数据 | 100 | 2:50 | 30–150s |
| bgm-tech-minimal | 极简数据 | 冷静、理性、专注 | 数据和图表多的段落，留白多不抢戏 | 95 | 1:41 | 28–78s |
| bgm-tech-deep | 深沉稳重 | 沉稳、专业、有分量 | 大公司、宏观经济、行业格局 | 90 | 2:12 | 30–125s |
| bgm-tech-bright | 明亮前沿 | 积极、有未来感、有活力但克制 | AI、新技术、增长和机会 | 105 | 2:27 | 20–135s |

四首都是财经科技风格，可以按内容挑，也可以每期轮换，避免每期听起来一样。

用法：

```tsx
<Bgm track="bgm-tech-steady" volume={0.1} duck={(f) => (说话中(f) ? 0.6 : 1)} />
```

- 片子比曲子短：只放开头一段，片尾淡出。
- 片子比曲子长：原曲开头 → 循环段（2 秒交叉淡化）→ 对齐片尾的原曲结尾。
- 有配音时 `volume` 一般 0.08–0.13（上个项目用 0.13，安静镜头 0.07）。

### 新增曲目

1. 生成：MiniMax Audio 网页「音乐创作」（API 账号无音乐权限，见 AGENTS.md），模型 Music-3.0，打开「纯音乐」，
   风格栏填提示词，数量 2，挑一版下载。提示词写法参考 `music-library.ts` 里已有曲目。
2. 响度处理（两遍 loudnorm 到 -16 LUFS，再降 1.5 dB 留峰值余量），放进 `public/library/music/<id>.mp3`。
3. 用 ebur128 看每 5 秒的响度，挑能量平稳的主体段作为 `loopStart` / `loopEnd`，避开前奏、中间的弱段和结尾。
4. 在 `music-library.ts` 加一条（含来源和提示词），更新上表，用 `bgm-preview` 试听接缝。

### 待补

### 提示词经验

- 只做财经科技一种风格（用户决定，暂不按场景区分情绪）。每条都锁定"科技电子乐"，只换乐器和情绪，BPM 控制在 90–105。
- 必须保留："旋律简单不抢戏""全曲能量平稳，没有突然的高潮或停顿""适合垫在人声解说下面""无人声"。
- 2026-10-28 试过"悬疑紧张电影感"和"轻快企业宣传"两种方向，生成结果不符合要求，已放弃。
- 网页一次出 2 首扣 600 积分，偶尔有一首失败。

## 音效

清单和默认音量在 `effects/_shared/Sfx.tsx`，试听用 Studio 里的 `sfx-preview`（8 个依次播放）。

| name | 名称 | 用在哪里 | 时长 |
|---|---|---|---|
| whoosh-fast | 快速转场 嗖 | 镜头切换、画面滑入 | 0.46s |
| whoosh-slow | 慢速转场 呼 | 章节切换 | 2.25s |
| pop | 弹出 啵 | 卡片、标签、图标出现 | 1.32s（主体在前 0.3s，后面是余音） |
| count | 数字滚动 嗒嗒嗒 | 数字从 0 涨到目标值 | 1.08s |
| rise | 上扬音 | 柱状图长高、曲线上升（由 riser 加速升调得到） | 1.09s |
| impact | 强调 咚 | 重点结论、关键数字（冲击点在 0.03s） | 1.84s |
| ding | 确认 叮 | 打勾、要点逐条出现 | 1.06s |
| riser | 铺垫上升 | 揭晓结果前，用 `endAt` 让结尾对准揭晓那一帧 | 2.11s |

用法：一个视频的全部音效集中登记，交给 `SfxTrack` 统一检查和播放（单个的 `<Sfx>` 只给试听页用）：

```tsx
const SPEECH: [number, number][] = [[17, 420], [450, 1119]];   // 人声区间（帧），按配音分段时长算
const CUES: SfxCue[] = [
  { name: "whoosh-slow", at: 430 },                  // 章节切换，放在人声停顿处
  { name: "riser", endAt: 900 },                     // 结尾对准揭晓那一帧
  { name: "impact", at: 900 },
  { name: "ding", at: 1500, allow: "片尾订阅提示" },  // 破例：写清理由，跳过检查
];
<Bgm track="bgm-tech-steady" volume={0.1} duck={sfxDuck(CUES, fps)} />
<SfxTrack cues={CUES} speech={SPEECH} />
```

整套响度已对齐：文件按平均响度对齐，`sfx-library.ts` 里的默认音量（0.23–0.41）再按实测最大瞬时响度微调，
让 8 个听起来一样响，并压在配音下面。`sfx-preview` 按这个比例播放。

### 使用规范（强制，代码检查）

成片里一直有人声和背景音乐，音效多了会吵、会累，所以音效是"偶尔点一下"，大部分画面应该没有音效。
规则在 `effects/_shared/sfx-rules.ts`，`SfxTrack` 每次预览和渲染都会检查，不合规直接报错并列出是第几帧、哪条规则。

| 规则 | 要求 |
|---|---|
| 总量 | 全片平均每分钟最多 4 个（10 分钟约 40 个以内） |
| 密度 | 任意 30 秒内最多 3 个 |
| 间隔 | 任意两个音效起点至少隔 1.5 秒；同一种至少隔 8 秒 |
| 重点音效 | 强调咚、铺垫上升全片各最多 3 次，用多了就不重点了 |
| 避开人声 | 慢速转场、铺垫上升这类长音效不能和人声重叠，只能放在配音停顿处；其他音效和人声重叠时音量自动减半 |
| 背景音乐 | 音效响时背景音乐自动压到 70%（强调咚、铺垫上升压到 50%），前后 0.15 秒过渡 |

什么时候用：

- **该用**：章节切换（慢速转场，每章最多一次）；揭晓关键数字或结论（铺垫上升 → 强调咚，全片 2–3 次）；
  关键数据出现（数字滚动或上扬音，一个场景最多一次）。
- **不该用**：普通文字、字幕、图片的淡入淡出；每个镜头切换（快速转场只给风格明显变化的切换）；
  列表逐条出现时每条都响（只响第一条，或者都不响）。
- **挤在一起时按优先级删低的**：强调咚 > 铺垫上升 > 慢速转场 > 数字滚动 / 上扬音 > 弹出 / 叮 > 快速转场。
  报错信息里会直接建议删哪个。
- **破例**：确实需要时在该音效上写 `allow: "理由"`，跳过它的间隔和人声检查，但仍计入总量。

数字是偏保守的初始值，做完第一期真实视频后按听感再调（改 `SFX_RULES`，然后 `npm run test:sfx` 确认检查逻辑没坏）。

### 统一风格（新增音效必须遵守）

风格定位：高级财经 / 科技品牌的极简数字界面音——柔和、精致、略带空气感、轻合成器质感，不卡通、不可爱、
不是电影预告片、不复古游戏。每条提示词都以这段固定前缀开头，后面只描述这一个音效的动作和时长：

```
Sound design for a premium finance and technology video brand. Clean, modern, minimal digital interface sound:
soft, polished, slightly airy, subtle synthetic tone, warm and precise. Not cartoonish, not cute, not cinematic
trailer, not retro game. Dry and close, no music, no voice, no background noise. The sound: ...
```

后期统一用 `bash tools/sfx-unify.sh <原始.wav> public/library/sfx/sfx-<name>.mp3`：去首尾静音 → 40 Hz 高通、
11 kHz 以上压 3 dB → 同一个很轻的短房间混响 → 按有声部分 RMS 对齐到 -18 dB（峰值封顶 -1 dB）→ 30ms 淡出。
冲击类音效如果开头有一段很轻的前奏，先用 `silenceremove` 以 -30 dB 再裁一次，让冲击点落在 0 秒附近。

### 来源与记录

2026-10-28 用 Topview Canvas「财经视频常用音效」（canvasId `7db7c8080bfd4c5196456b06c72cff55`）里的
Seed Audio 1.0（taskType `audio_design`）生成，每个约 0.02–0.05 积分，一两分钟出结果；输出 24kHz 立体声 wav，
时长常比要求的长。第一版 8 个是各自写的提示词，风格不统一、响度相差 17 dB，已整套替换。
统一版：固定前缀生成 16 个（每个 2 版）+ 失败的 3 个重做 6 个，共约 1 积分。最终：

- whoosh-slow / pop / impact / ding / riser：统一前缀第一轮选出。
- whoosh-fast / count：加了 "loud, clearly audible""about 15 clicks per second" 重做后选出；count 偏亮且是稀疏的点击，
  额外压了高频并轻度压缩，平均响度仍比其他低 3–5 dB（点击类听感本来就偏响，问题不大）。
- rise：Seed Audio 两轮都做不出"短促的上滑音"，改为把 riser 加速 2 倍并升调得到，保证同源同风格。
- Topview 2026-10-28 新增了 Seed Audio 1.5，这套全部用 1.0 生成；以后补音效也先用 1.0，换模型要整套重听。

筛选经验：看波形（`showwavespic`）、峰值和频谱质心（`aspectralstats`）。峰值低于 -30 dB、波形没有明显起伏、
或质心明显偏离其他音效（这套多在 450–2300 Hz）的基本不能用。
