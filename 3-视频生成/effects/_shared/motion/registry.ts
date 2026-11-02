// 动效目录：脚本（第 2 步）里写的动效 ID 都在这里查得到。
// durationMs 是主动作时长；放进时间轴时用 motionFrames(id, fps, props) 取帧数（已含 450ms 定格）。
import React from "react";
import { HOLD, msToFrames } from "./time";
import { CaptionBar, HighlightSweep, TitleRise, WordSlam } from "./motions-text";
import { CardPush, CardSplit, CardStagger, CheckSteps, FocusRow, PillPop, ReboundPair } from "./motions-cards";
import {
  BarGrow,
  Callout,
  CountUp,
  DonutFill,
  ExpectVsActual,
  HBarCompare,
  LineCrash,
  LineDraw,
  ProgressOverflow,
  RulerMarkers,
  Waterfall,
} from "./motions-data";
import { CashPath, Flywheel } from "./motions-flow";
import { BrowserCard, ChapterProgress, IrisPreentry, MediaCard } from "./motions-media";
import { DocZoom, FootageStat, PhotoStack, PinLabel, SplitMedia } from "./motions-overlay";

export type MotionCategory = "文字" | "卡片" | "数据" | "流程" | "媒体" | "转场" | "全局" | "实拍卡";
type AnyProps = Record<string, unknown>;

export type MotionEntry = {
  id: string;
  name: string;
  category: MotionCategory;
  use: string; // 什么时候用
  ref: string; // 借鉴的 wise-motion 条目
  durationMs: number;
  durationFor?: (p: AnyProps) => number; // 时长随内容变化的动效
  Component: React.FC<AnyProps>;
};

const m = <P,>(e: Omit<MotionEntry, "Component" | "durationFor"> & { Component: React.FC<P>; durationFor?: (p: P) => number }): MotionEntry =>
  e as unknown as MotionEntry;

export const MOTIONS: MotionEntry[] = [
  // 文字
  m({ id: "title-rise", name: "标题逐词升入", category: "文字", ref: "mask-stagger-text", durationMs: 1800, Component: TitleRise, use: "每个新画面的主标题：蓝色小标题先出，大标题逐词升入" }),
  m({ id: "word-slam", name: "单词重击", category: "文字", ref: "word-slam", durationMs: 1200, Component: WordSlam, use: "一锤定音的词（如 “Wrong.”），配合音乐静音点" }),
  m({ id: "highlight-sweep", name: "荧光底纹扫过", category: "文字", ref: "local-scan", durationMs: 1200, Component: HighlightSweep, use: "主题句落定后，琥珀底纹扫过关键短语" }),
  m({ id: "caption-bar", name: "字幕条逐词显现", category: "文字", ref: "subtitle-focus", durationMs: 2400, Component: CaptionBar, use: "单句强调字幕；整片字幕仍用各期的 subs 方案" }),
  // 卡片
  m({ id: "card-stagger", name: "卡片错峰弹出", category: "卡片", ref: "material-card-stagger", durationMs: 1800, Component: CardStagger, use: "2–4 个指标卡，念一个弹一张" }),
  m({ id: "card-push", name: "卡片推入转场", category: "卡片", ref: "wipe / prompt-ui-push", durationMs: 1200, Component: CardPush, use: "章节卡；数据画面切到下一段" }),
  m({
    id: "focus-row",
    name: "逐行聚焦",
    category: "卡片",
    ref: "dim-focus",
    durationMs: 3000,
    durationFor: (p) => ((p.cues ?? [0, 900, 1800]) as number[]).slice(-1)[0] + 1200,
    Component: FocusRow,
    use: "成绩单、表格：讲到哪行亮哪行（cues 填每行亮起的毫秒数）",
  }),
  m({ id: "pill-pop", name: "胶囊卡弹出", category: "卡片", ref: "pop-pulse-ring", durationMs: 1200, Component: PillPop, use: "补充信息：库存、口径、问句" }),
  m({
    id: "check-steps",
    name: "步骤卡逐项打勾",
    category: "卡片",
    ref: "experience-progress",
    durationMs: 3600,
    durationFor: (p) => 900 + ((p.steps as unknown[] | undefined)?.length ?? 4) * ((p.stepMs as number | undefined) ?? 760),
    Component: CheckSteps,
    use: "流程、论点清单、观察指标：讲完一条打一个勾",
  }),
  m({ id: "card-split", name: "卡片对开", category: "卡片", ref: "card-flip", durationMs: 1800, Component: CardSplit, use: "一个数拆成两部分但没披露（露出结论胶囊）" }),
  m({ id: "rebound-pair", name: "左右对向滑入回摆", category: "卡片", ref: "rigid-rebound", durationMs: 1800, Component: ReboundPair, use: "两方对照：公司 vs 公司、管理层 vs 空头" }),
  // 数据
  m({ id: "count-up", name: "数字滚动落定", category: "数据", ref: "narrated-count", durationMs: 1500, Component: CountUp, use: "单个大数字" }),
  m({ id: "bar-grow", name: "柱条依次长高", category: "数据", ref: "bar-growth", durationMs: 2400, Component: BarGrow, use: "增速对比，可带预期虚线" }),
  m({
    id: "waterfall",
    name: "瀑布图分段算账",
    category: "数据",
    ref: "sequential-spec",
    durationMs: 3000,
    durationFor: (p) => 300 + ((p.steps as unknown[] | undefined)?.length ?? 2) * ((p.stepMs as number | undefined) ?? 800) + (p.target ? 1300 : 600),
    Component: Waterfall,
    use: "把结果算出来：EPS 加回、现金流 = 收 − 支；可加共识虚线",
  }),
  m({ id: "hbar-compare", name: "横条同比例对比", category: "数据", ref: "benchmark-columns", durationMs: 2400, Component: HBarCompare, use: "体量对比、正负对比，可带倍数胶囊" }),
  m({ id: "line-draw", name: "折线逐点描出", category: "数据", ref: "tilt-drop-settle", durationMs: 2400, Component: LineDraw, use: "季度走势，跌破零线变红" }),
  m({ id: "expect-vs-actual", name: "预期框 vs 实际柱", category: "数据", ref: "reduction-dimension", durationMs: 2400, Component: ExpectVsActual, use: "实际 vs 预期，差额括号" }),
  m({ id: "line-crash", name: "股价线描出后断崖", category: "数据", ref: "tilt-drop-settle", durationMs: 2400, Component: LineCrash, use: "开场、结尾的盘后大跌" }),
  m({ id: "donut-fill", name: "环形占比补满", category: "数据", ref: "sector-appear", durationMs: 2400, Component: DonutFill, use: "占比变化（去年 vs 今年）" }),
  m({ id: "ruler-markers", name: "刻度尺落点", category: "数据", ref: "slider-response", durationMs: 3000, Component: RulerMarkers, use: "超没超预期取决于口径（多个预期值 + 实际值）" }),
  m({ id: "progress-overflow", name: "进度条溢出", category: "数据", ref: "progress-readout", durationMs: 2400, Component: ProgressOverflow, use: "花掉的超过赚到的（> 100%）" }),
  m({ id: "callout", name: "引线标注", category: "数据", ref: "leader-callout", durationMs: 1500, Component: Callout, use: "在照片或图表上点出一个对象" }),
  // 流程
  m({ id: "cash-path", name: "现金光点走流程", category: "流程", ref: "mindmap-follow", durationMs: 4200, Component: CashPath, use: "先投入、后回款的流程（TPU 先建后收）" }),
  m({ id: "flywheel", name: "飞轮反转", category: "流程", ref: "multi-orbit-drift", durationMs: 3600, Component: Flywheel, use: "商业模式的循环被反过来了" }),
  // 媒体 / 转场 / 全局
  m({ id: "media-card", name: "实拍装进卡片", category: "媒体", ref: "scene-window-media", durationMs: 3000, Component: MediaCard, use: "B-roll、官方照片放进圆角卡片，带信息胶囊" }),
  m({ id: "browser-card", name: "浏览器卡片", category: "媒体", ref: "prompt-ui-push", durationMs: 3600, Component: BrowserCard, use: "网页、AI 搜索、财报页；可放录屏或截图" }),
  // 实拍卡：照片 / 视频 / 财报原文装进框架里的大圆角卡片，数字放卡片上或右侧栏（去 PPT 感的主力）
  m({ id: "footage-stat", name: "实拍上的数字卡", category: "实拍卡", ref: "scene-window-media", durationMs: 2400, Component: FootageStat, use: "左侧实拍卡 + 右侧数字卡；代替单独的数字页" }),
  m({ id: "pin-label", name: "实拍物体钉标签", category: "实拍卡", ref: "leader-callout", durationMs: 2400, Component: PinLabel, use: "在实拍卡里的机柜、芯片、楼上钉 1–3 个标签和读数" }),
  m({ id: "split-media", name: "实拍卡 + 数据栏", category: "实拍卡", ref: "scene-window-media", durationMs: 2400, Component: SplitMedia, use: "左侧实拍卡、右侧几行数；传 src2 变成两张实拍卡对照" }),
  m({ id: "doc-zoom", name: "财报原文推近高亮", category: "实拍卡", ref: "local-scan", durationMs: 2700, Component: DocZoom, use: "文档窗口卡里的财报原文 → 推近某一行 → 底纹扫过 → 右侧读数卡" }),
  m({
    id: "photo-stack",
    name: "实拍卡依次落下",
    category: "实拍卡",
    ref: "material-card-stagger",
    durationMs: 2000,
    durationFor: (p) => 900 + ((p.srcs as unknown[] | undefined)?.length ?? 3) * ((p.stepMs as number | undefined) ?? 450),
    Component: PhotoStack,
    use: "几张实拍快速交代一个场景（capex 买的是什么）",
  }),
  m({ id: "iris-preentry", name: "圆窗叠入下一幕", category: "转场", ref: "next-shot-preentry", durationMs: 1500, Component: IrisPreentry, use: "实拍切到卡片界面" }),
  m({ id: "chapter-progress", name: "章节进度条推进", category: "全局", ref: "timeline-progress", durationMs: 1500, Component: ChapterProgress, use: "每章开头：底部分段进度条、右上章节名" }),
];

export const getMotion = (id: string) => {
  const e = MOTIONS.find((x) => x.id === id);
  if (!e) throw new Error(`动效库里没有 ${id}`);
  return e;
};

/** 放进时间轴需要的帧数（主动作 + 起步留白 + 450ms 定格） */
export const motionFrames = (id: string, fps: number, props: AnyProps = {}) => {
  const e = getMotion(id);
  const ms = e.durationFor ? e.durationFor(props) : e.durationMs;
  return msToFrames(ms + HOLD, fps);
};
