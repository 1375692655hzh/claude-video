# 开源动效库清单（和本项目怎么配合）

整理于 2026-10-30。授权是逐个浅克隆仓库、看根目录 LICENSE 确认的；没有 LICENSE 的仓库写"未找到"，默认保留所有权利，只能参考思路，不能直接拷代码或素材进视频。
本项目第 3 步是 Remotion，所以下面按"能不能放进 Remotion 时间轴、按帧驱动"来排适配度。动效库自己的动作见同目录 README.md。

## 〇、Remotion 官方扩展包（优先考虑）

装法统一用 `npx remotion add <包名>`（自动对齐 4.0.538 版本，见 3-视频生成/AGENTS.md 依赖管理规范）。授权跟 Remotion 本体一样。

| 包 | 做什么 | 用在哪 |
|---|---|---|
| `@remotion/transitions` | `TransitionSeries` + fade / slide / wipe / flip / clockWipe 等转场 | 镜头之间的标准转场，和动效库的 `card-push`、`iris-preentry` 互补 |
| `@remotion/lottie` | 按帧播放 Lottie（After Effects 导出的 JSON） | 设计师做的图标、片头字标（分镜里 0.5 频道片头） |
| `@remotion/paths` | SVG 路径长度、取点、描线（`evolvePath`） | 比动效库里的 `polyLength` 更通用，画复杂曲线时用 |
| `@remotion/shapes` | 圆、星形、饼图扇形等 SVG 形状 | 仪表盘、扇形占比（分镜 5.3 仪表盘指针） |
| `@remotion/layout-utils` | `fitText` 等按宽度算字号 | 标题长度不定时自动缩字 |
| `@remotion/noise` | 确定性噪声 | 背景粒子、轻微抖动，不破坏逐帧一致 |

## 〇·五、已纳入的镜头配方库

| 库 | 授权 | 怎么用 |
|---|---|---|
| [video-shotcraft](https://github.com/Vincentwei1021/video-shotcraft) | Apache-2.0（音频逐个授权，未纳入） | 2026-11-03 纳入：124 张镜头配方卡 + Remotion 参考实现，留在 `.agents/skills/video-shotcraft/`；挑了 18 个适合财经解说的配方重写进本库（`motions-shot.tsx`）。它的产品宣传片出片流程、工作台、剪映导出、社媒发布不接入 |

## 一、直接出视频的框架（代码 → MP4）

| 库 | 授权 | 适合做什么 | 对本频道的适配 |
|---|---|---|---|
| [Remotion](https://github.com/remotion-dev/remotion) | 个人、3 人以内团队、非营利免费；更大的公司要买 Company License | 用 React 写视频，生态最大，模板最多 | 本项目正在用。个人和 3 人以内团队免费 |
| [HyperFrames](https://github.com/heygen-com/hyperframes)（HeyGen） | Apache-2.0 | HTML → MP4 的确定性渲染，自带给 AI 代理用的技能说明 | ★★★ 另一套管线；想纯 HTML 出片时再考虑 |
| [Motion Canvas](https://github.com/motion-canvas/motion-canvas) | MIT | 用 TypeScript 写动画，带时间轴编辑器，适合讲解型动画 | ★★ 另一套管线；单独渲染后当视频片段放进 Remotion |
| [Revideo](https://github.com/redotvideo/revideo) | MIT | Motion Canvas 的分支，偏程序化批量出片、可服务器渲染 | ★★ 同上 |
| [Manim Community](https://github.com/ManimCommunity/manim) | MIT | Python 数学动画（3Blue1Brown 风格） | ★★ 公式、坐标动画很强；单独渲染后当片段用 |
| [Theatre.js](https://github.com/theatre-js/theatre) | 根目录 Apache-2.0（编辑器 studio 包另有条款，用前再核对） | 给网页动画加可视化关键帧编辑器 | ★ 偏网页交互，视频里用处不大 |

## 二、网页动画引擎（在 Remotion 里用要改成按帧驱动）

| 库 | 授权 | 适合做什么 | 对本频道的适配 |
|---|---|---|---|
| [GSAP](https://github.com/greensock/GSAP) | GSAP 标准“免费”许可，被 Webflow 收购后全部插件免费，可商用；不是 OSI 开源协议 | 时间轴、文字拆分（SplitText）、路径动画（MorphSVG / DrawSVG） | ★★★ 时间轴暂停后每帧 `seek(frame / fps)`；SplitText、DrawSVG 可补文字拆分和路径动画 |
| [Anime.js](https://github.com/juliangarnier/anime) | MIT | 轻量动画引擎，时间轴和 SVG 描线 | ★★★ 同样每帧 `seek()` |
| [Motion](https://github.com/motiondivision/motion)（原 Framer Motion） | MIT | React / JS 动画，弹簧物理 | ★ 依赖实时时钟，渲染会抖，不建议 |
| [React Spring](https://github.com/pmndrs/react-spring) | MIT | 弹簧物理动画 | ★ 同上，不建议；弹簧用 Remotion 自带的 `spring()` |
| [mo.js](https://github.com/mojs/mojs) | MIT | 爆裂、波纹这类装饰性动效 | ★ 实时驱动，不建议 |
| [Lottie-web](https://github.com/airbnb/lottie-web) | MIT | 播放 After Effects 导出的 JSON 动画 | 用 `@remotion/lottie`，不要直接装 lottie-web |

## 三、现成组件和模板

| 库 | 授权 | 内容 | 说明 |
|---|---|---|---|
| [Magic UI](https://github.com/magicuidesign/magicui) | MIT | 数字滚动、跑马灯、光效边框等 React 组件 | 看效果借思路；照搬要把 CSS 动画改成按帧计算 |
| [React Bits](https://github.com/DavidHDev/react-bits) | MIT + Commons Clause | 文字动效、背景动效组件 | Commons Clause 禁止把组件本身拿去卖；用在自己的视频里一般没问题，但不能二次打包出售 |
| [Animate.css](https://github.com/animate-css/animate.css) | Hippocratic License | 经典 CSS 入场动画 | 不是标准开源协议，附带伦理条款；只适合参考 |
| [AleBrito124356/remotion-video-templates](https://github.com/AleBrito124356/remotion-video-templates) | MIT | 6 个 Remotion 模板（图表、字幕等） | 授权干净，可以直接拿来改成本项目的组件 |
| [locomotion-pro/locomotion](https://github.com/locomotion-pro/locomotion) | 未找到 LICENSE | 67 个 Remotion 模板 | 只参考，不拷代码 |
| [ali-abassi/remotion-templates](https://github.com/ali-abassi/remotion-templates) | 未找到 LICENSE | 约 1,000 个 Remotion 模板 | 只参考，不拷代码 |

## 四、索引和参考

| 库 | 授权 | 内容 |
|---|---|---|
| [wise-motion](https://github.com/wisewong6/wise-motion) | Apache-2.0 | 462 个动效条目的中文规格说明；动效库的节奏规则来自这里，新动作先在这里找参考 |
| [zhuyansen/awesome-claude-video-skills](https://github.com/zhuyansen/awesome-claude-video-skills) | CC0 | 约 180 个“AI 代理做视频”相关仓库的清单，找新工具时先翻这里 |
| [GitHub topic: remotion](https://github.com/topics/remotion) | — | Remotion 相关项目合集 |
| [createmotion.io/resources](https://createmotion.io/resources) | — | 动效资源导航 |

## 建议的组合

1. **默认**：动效库（effects/_shared/motion）+ Remotion 官方扩展包，全部在一个项目里，按帧驱动，零额外授权风险。
2. **缺的画面**（片头字标、复杂图标动画）：设计师在 After Effects 做，导出 Lottie，用 `@remotion/lottie` 放进时间轴。
3. **公式、数学动画**：Manim 单独渲染成透明或纯色底的视频，再用 `OffthreadVideo` 放进来。

## 授权提醒

- MIT / Apache-2.0：可商用、可修改，保留原版权声明即可。
- Remotion（本项目在用）：个人或 3 人以内团队免费；公司超过这个规模，每位开发者约 $25/月，自动化渲染另按次计费（最低 $100/月）。团队变大时重新核对。
- GSAP：免费可商用，但它是 GreenSock 自己的标准许可，不是 OSI 开源协议，里面有少量使用限制；做视频一般不受影响，用前读一遍 gsap.com 上的 Standard License。
- 没有 LICENSE 文件的仓库：法律上默认保留所有权利，不要直接复制。
- 本清单不是法律意见，商用前以各仓库最新的 LICENSE 为准。

## 来源

- [Remotion License FAQ](https://www.remotion.dev/docs/license/faq)
- [Motion Canvas](https://motioncanvas.io)
- [Revideo 文档](https://docs.re.video)
- [GitHub topic: remotion](https://github.com/topics/remotion)
- [createmotion.io resources](https://createmotion.io/resources)
- 各仓库根目录 LICENSE 文件（链接见上表）
