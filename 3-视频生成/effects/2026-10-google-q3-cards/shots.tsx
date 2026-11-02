// 每个镜头的内容（标题区 + 内容区 + 右侧栏），照 2-脚本/2026-10-google-q3-cards/script.md 的分镜表。
// 外框（顶栏、字幕、进度条、数字人圆圈）由 Main.tsx 统一套上；时间从镜头起点算（毫秒，useMs）。
// 版式规则：圆圈（左下角）可以叠在实拍照片角上，但不压文字、数字、表格——有圆圈的原文卡 / 图表镜头包 <HostSafe>。
import React from "react";
import {
  BarGrow,
  BrowserCard,
  Canvas,
  CardSplit,
  CashPath,
  CheckSteps,
  CountUp,
  DocZoom,
  DonutFill,
  ExpectVsActual,
  FocusRow,
  FootageCard,
  FootageStat,
  Flywheel,
  HBarCompare,
  Heading,
  LAYOUT,
  LineDraw,
  NoteCard,
  PhotoStack,
  PinLabel,
  ProgressOverflow,
  RulerMarkers,
  SplitMedia,
  Waterfall,
  signed,
} from "../_shared/motion";
import {
  At,
  BigFlow,
  CardTag,
  CheckList,
  CountCard,
  CutCard,
  EndScreen,
  HostSafe,
  IrisCard,
  P,
  RulerSwitch,
  SPLIT_X2,
  SweepText,
  SwitchStat,
  Window,
  PushIn,
  TileRow,
  Fit,
  soon,
  SidePanel,
  FullThumb,
  ChapterPanel,
  ReadoutPair,
  SubscribePanel,
  R_MAIN,
  R_WIDE,
  hostSafe,
} from "./parts";
import { cueMs } from "./timeline";

export type ShotProps = { spanMs: number; voiceMs: number }; // 镜头总长、人声起点（毫秒）

const PEXELS = "Video: Pexels";
const GOOGLE = "Image: Google";
const AI_IMG = "AI-generated illustration";
const money = (v: number) => signed(v, 1, "$", "B");
type PinTone = "amber" | "red" | "teal" | "blue" | "ink";
// 定位点不画指线：标签贴在点旁边
const pin = (
  x: number,
  y: number,
  label: string,
  at: number,
  value?: string,
  tone: PinTone = "amber",
) => ({ x, y, dx: 18, dy: -18, label, value, tone, at });

/** 章节开头：左边实拍卡推入，右栏大号章节号 + 章节名（进度条由 Frame 走） */
const chapterCard = (
  kicker: string,
  title: string,
  src: string,
  caption: string,
  startFrom = 0,
): React.FC<ShotProps> => {
  const [num, ...rest] = kicker.split(" · ");
  const View: React.FC<ShotProps> = ({ spanMs }) => (
    <>
      <Heading kicker={kicker} title={title} />
      <Canvas>
        <FootageCard
          src={P(src)}
          startFrom={startFrom}
          move="in"
          spanMs={spanMs}
          caption={caption}
        />
      </Canvas>
      <ChapterPanel num={num} name={rest.join(" · ")} />
    </>
  );
  return View;
};

/** 结论句镜头：左栏一两行大字扫亮，右栏整栏实拍卡 */
const sweepShot = (
  kicker: string,
  lines: { before?: string; mark?: string; after?: string }[],
  thumb: string,
  thumbCaption?: string,
  size = 64,
): React.FC<ShotProps> => {
  const View: React.FC<ShotProps> = ({ spanMs }) => (
    <>
      <Heading kicker={kicker} title="" />
      <SweepText lines={lines} size={size} top={LAYOUT.contentTop + 170} />
      <FullThumb src={P(thumb)} spanMs={spanMs} caption={thumbCaption} />
    </>
  );
  return View;
};

export const SHOT_VIEWS: Record<string, React.FC<ShotProps>> = {
  // ───────── 第 0 章 · Cold open ─────────
  "0.1": ({ spanMs }) => (
    <>
      <Heading kicker="GOOGL · AFTER HOURS" title="Down more than 10%" />
      <FootageStat
        src={P("video/P03.mp4")}
        move="in"
        spanMs={spanMs}
        caption={PEXELS}
        kicker="GOOGL · AFTER HOURS"
        value="−10%"
        sub="after Q3 earnings"
        tone="red"
      />
    </>
  ),
  "0.2a": ({ spanMs }) => (
    <>
      <Heading kicker="GOOD NEWS #1" title="Cloud revenue doubled" />
      <FootageStat
        src={P("img/G04.jpg")}
        spanMs={spanMs}
        caption={`New Albany, Ohio · ${GOOGLE}`}
        kicker="GOOGLE CLOUD · Q3"
        value="+103%"
        sub="revenue growth, year over year"
        tone="teal"
        extra={[
          { label: "Revenue", value: "$30.7B" },
          { label: "Margin", value: "36.2%" },
        ]}
      />
    </>
  ),
  "0.2b": ({ spanMs }) => (
    <>
      <Heading kicker="GOOD NEWS #2" title="Search queries: 5-year high" />
      <FootageStat
        src={P("video/P05-crop.mp4")}
        startFrom={2}
        move="right"
        spanMs={spanMs}
        caption={PEXELS}
        kicker="SEARCH QUERIES · Q3"
        value="5-yr high"
        sub="fastest growth in five years"
        tone="teal"
      />
    </>
  ),
  "0.2c": () => (
    <>
      <Heading kicker="GOOD NEWS #3" title="Gemini 4 Carbon ranks #1" />
      <Fit src={{ x: 210, y: 120, w: 1500, h: 840 }} dst={hostSafe(R_MAIN)}>
        <BrowserCard
          url="blog.google › Gemini 4 Carbon: our next frontier model"
          src={P("img/R01-carbon-social.png")}
        />
      </Fit>
      <SidePanel
        kicker="INDEPENDENT RANKING"
        items={[
          {
            value: "#1",
            title: "Artificial Analysis",
            sub: "Intelligence Index v5.0 · score 59",
            tone: "teal",
            at: 900,
          },
        ]}
      />
    </>
  ),
  "0.3": ({ spanMs }) => (
    <>
      <Heading kicker="AND THE STOCK?" title="Down more than 10%" />
      <SplitMedia
        src={P("video/P01.mp4")}
        spanMs={spanMs}
        caption={`New York · ${PEXELS}`}
        title="GOOGL after hours"
        rows={[
          { label: "Before", value: "≈ $325" },
          { label: "After hours", value: "< $300", tone: "red" },
          { label: "Market value", value: "≈ −$350B", tone: "red" },
        ]}
      />
    </>
  ),
  "0.4": () => (
    <>
      <Heading
        kicker="THE QUESTION"
        title="Is AI spending really the problem?"
      />
      <HostSafe>
        <PhotoStack
          srcs={[P("img/M01.jpg"), P("img/M02.jpg"), P("img/M03.jpg")]}
          captions={["Servers", "Cooling", "Building 5 · Images: Google"]}
          stepMs={700}
        />
      </HostSafe>
    </>
  ),
  "0.5": ({ spanMs }) => (
    <>
      <Heading
        kicker="ANDY'S MARKET LENS"
        title="Beyond the headlines. Into the numbers."
      />
      <Canvas>
        <FootageCard
          src={P("img/G05.jpg")}
          move="in"
          spanMs={spanMs}
          caption={GOOGLE}
        />
      </Canvas>
      <SidePanel
        kicker="YOUR HOST"
        items={[
          {
            title: "Andy",
            sub: "10+ years investing in U.S. & Hong Kong equities",
            at: 600,
          },
        ]}
      />
    </>
  ),
  "0.6": () => (
    <>
      <Heading kicker="TODAY" title="Three layers" />
      <Fit src={{ x: 112, y: 300, w: 1696, h: 510 }} dst={hostSafe(R_WIDE)}>
        <At ms={soon(cueMs("0.6", "why the stock") - 400)}>
          <CheckSteps
            steps={[
              {
                title: "01 Why it really fell",
                rows: ["Profits", "Cash flow", "Funding"],
              },
              { title: "02 Is AI eating Search?", rows: ["Usage vs. money"] },
              {
                title: "03 What to watch next",
                rows: ["Bull vs. bear", "Three signals"],
              },
            ]}
            stepMs={1700}
          />
        </At>
      </Fit>
    </>
  ),

  // ───────── 第 1 章 · The report card ─────────
  "1.1": () => (
    <>
      <Heading
        kicker="01 · THE REPORT CARD"
        title="Let's start with the scorecard"
      />
      <HostSafe>
        <DocZoom
          src={P("doc/card-release-p1-top.png")}
          focus={{ x: 15, y: 20, w: 661, h: 42 }}
          zoom={1}
          note="Q3 2026"
          noteSub="Results released Oct 28"
          tone="ink"
          source="Alphabet Q3 2026 earnings release · p. 1"
        />
      </HostSafe>
    </>
  ),
  "1.2": () => (
    <>
      <Heading
        kicker="01 · THE REPORT CARD"
        title="Let's start with the scorecard"
        at={-1000}
      />
      <DocZoom
        src={P("doc/card-release-p1-top.png")}
        focus={{ x: 15, y: 20, w: 661, h: 42 }}
        zoom={1.5}
        note="Q3 2026"
        noteSub="Quarter ended Sep 30"
        tone="ink"
        source="Alphabet Q3 2026 earnings release · p. 1"
      />
    </>
  ),
  "1.3a": () => (
    <>
      <Heading kicker="REVENUE" title="A tiny miss" />
      <DocZoom
        src={P("doc/card-release-summary.png")}
        focus={{ x: 15, y: 116, w: 985, h: 29 }}
        zoom={1.05}
        note="$127.6B"
        noteSub="consensus ≈ $128.2B · −0.5%"
        tone="ink"
        source="Alphabet Q3 2026 earnings release · p. 1"
      />
    </>
  ),
  "1.3b": () => (
    <>
      <Heading kicker="EPS" title="A big miss" />
      <DocZoom
        src={P("doc/card-release-summary.png")}
        focus={{ x: 15, y: 402, w: 985, h: 29 }}
        zoom={1.05}
        note="$2.12"
        noteSub="vs ≈ $3.00 · ≈ −30%"
        tone="red"
        source="Alphabet Q3 2026 earnings release · p. 1"
      />
    </>
  ),
  "1.3c": () => (
    <>
      <Heading kicker="THE SCORECARD" title="Two misses, one surprise" />
      <Fit src={{ x: 112, y: 260, w: 1696, h: 570 }} dst={R_WIDE}>
        <FocusRow
          rows={[
            { label: "Revenue", value: "$127.6B", note: "−0.5%", tone: "red" },
            {
              label: "Earnings per share",
              value: "$2.12",
              note: "≈ −30%",
              tone: "red",
            },
            {
              label: "Free cash flow",
              value: "−$9.1B",
              note: "2nd negative qtr",
              tone: "red",
            },
          ]}
          cues={[0, 500, 1000]}
        />
      </Fit>
      <NoteCard
        title="Second negative quarter in a row"
        sub="Street expected a small negative"
        at={cueMs("1.3c", "That's the second")}
      />
    </>
  ),
  "1.4": () => (
    <>
      <Heading kicker="THE MIX" title="What beat, what missed" />
      <Fit src={{ x: 112, y: 220, w: 1696, h: 640 }} dst={R_WIDE}>
        <At ms={soon(cueMs("1.4", "Google Cloud came") - 300)}>
          <HBarCompare
            rows={[
              { label: "Google Cloud vs. est.", value: 1.6, tone: "blue" },
              { label: "Google Services vs. est.", value: -2.1, tone: "red" },
            ]}
            max={2.5}
            ratio=""
          />
        </At>
      </Fit>
      <NoteCard
        title="Selected segments"
        sub="Not a full revenue bridge"
        at={cueMs("1.4", "Net it out")}
      />
    </>
  ),
  "1.5": ({ spanMs }) => (
    <>
      <Heading kicker="THE PROBLEM" title="What beat costs money" />
      <SplitMedia
        src={P("img/M02.jpg")}
        move="right"
        spanMs={spanMs}
        caption={`Cooling pipes · ${GOOGLE}`}
        src2={P("video/M05-aimode-scroll.mp4")}
        caption2="AI Mode · search.google"
      />
      <CardTag
        x={LAYOUT.left + 28}
        tone="blue"
        at={cueMs("1.5", "The segment that beat")}
      >
        Cloud · COSTS MONEY
      </CardTag>
      <CardTag
        x={SPLIT_X2 + 28}
        tone="red"
        at={cueMs("1.5", "The segment that missed")}
      >
        Search · MAKES MONEY
      </CardTag>
    </>
  ),
  "1.6": sweepShot(
    "THE THREAD",
    [
      { before: "What beat ", mark: "costs money." },
      { before: "What missed ", mark: "makes money." },
    ],
    "img/M02.jpg",
    GOOGLE,
    76,
  ),
  "1.7": ({ spanMs }) => (
    <>
      <Heading kicker="SO WHY" title="−0.5% revenue → −10% stock?" />
      <FootageStat
        src={P("video/P01.mp4")}
        startFrom={4}
        move="in"
        spanMs={spanMs}
        caption={`New York · ${PEXELS}`}
        kicker="THE MISMATCH"
        value="−10%"
        sub="stock, after hours"
        tone="red"
        extra={[{ label: "Revenue vs. est.", value: "−0.5%", tone: "ink" }]}
      />
    </>
  ),

  // ───────── 第 2 章 · Layer 1 · Profits ─────────
  "2.1": chapterCard(
    "02 · LAYER 1 · PROFITS",
    "Is the EPS miss just noise?",
    "img/T02.webp",
    `Ironwood superpod · ${GOOGLE}`,
  ),
  "2.2": ({ spanMs }) => (
    <>
      <Heading kicker="LAYER 1 · PROFITS" title="Blame it on SpaceX?" />
      <PushIn at={spanMs - 2000} px={720.4} py={569.3} k={1.99}>
        <HostSafe>
          <DocZoom
            src={P("doc/D01-oie-breakdown-card.png")}
            focus={{ x: 50, y: 283, w: 920, h: 30 }}
            zoom={1.08}
            note="−$8.7B"
            noteSub="Equity investments (incl. SpaceX stake)"
            tone="red"
            source="Alphabet Q3 2026 earnings release · p. 8"
          />
        </HostSafe>
      </PushIn>
      <NoteCard
        title="Mostly unrealized (SpaceX stake)"
        sub="Mark-to-market, not cash out the door"
        at={4200}
      />
    </>
  ),
  "2.3": () => (
    <>
      <Heading kicker="THE MATH" title="Ex-SpaceX, EPS still misses" />
      <Fit src={{ x: 112, y: 200, w: 1696, h: 760 }} dst={R_WIDE}>
        <At ms={soon(cueMs("2.3", "Google says") - 300)}>
          <Waterfall
            steps={[
              { label: "Reported EPS", value: 2.12 },
              { label: "Add back SpaceX hit", value: 0.55, tone: "teal" },
            ]}
            result="Ex-SpaceX EPS"
            zero={640}
            scale={150}
            decimals={2}
            prefix="$"
            target={{
              value: 3.02,
              label: "Consensus $3.02",
              gapText: "Still −12%",
            }}
            stepMs={1300}
          />
        </At>
      </Fit>
      <NoteCard
        title="Illustrative adjustment"
        sub="Not company-reported"
        at={cueMs("2.3", "Even if you blame")}
      />
    </>
  ),
  "2.5": ({ spanMs }) => (
    <>
      <Heading kicker="WHERE'S THE REST?" title="Operating income missed too" />
      <SplitMedia
        src={P("img/ai/A01.png")}
        move="in"
        spanMs={spanMs}
        caption={AI_IMG}
        title="Operating income, Q3"
        rows={[
          { label: "Operating income", value: "$40.6B", tone: "ink" },
          { label: "vs. expectations", value: "≈ −6%", tone: "red" },
          { label: "Margin (Q2 → Q3)", value: "34.0% → 31.8%", tone: "red" },
        ]}
      />
    </>
  ),
  "2.6a": ({ spanMs }) => (
    <>
      <Heading kicker="WHERE THE MONEY WENT" title="AI costs hit the P&L" />
      <PinLabel
        src={P("img/G06.jpg")}
        move="right"
        spanMs={spanMs}
        caption={GOOGLE}
        pins={[
          pin(170, 190, "R&D", cueMs("2.6a", "R&D") - 650, "+36%", "red"),
          pin(
            470,
            330,
            "Depreciation",
            cueMs("2.6a", "Depreciation") - 650,
            "+49%",
            "red",
          ),
          pin(
            700,
            170,
            "Stock comp",
            cueMs("2.6a", "Stock-based") - 650,
            "+35%",
            "red",
          ),
        ]}
      />
    </>
  ),
  "2.6b": ({ spanMs }) => (
    <>
      <Heading
        kicker="WHERE THE MONEY WENT"
        title="AI costs hit the P&L"
        at={-1000}
      />
      <FootageStat
        src={P("img/T01.webp")}
        move="in"
        spanMs={spanMs}
        caption={`Ironwood board · ${GOOGLE}`}
        kicker="ALPHABET-LEVEL COSTS"
        value="+71%"
        sub="to ≈ $7.7B (shared AI research)"
        tone="amber"
      />
    </>
  ),
  "2.7": ({ spanMs }) => (
    <>
      <Heading
        kicker="THE TAKEAWAY"
        title="AI costs reach the income statement"
      />
      <FootageStat
        src={P("img/T01.webp")}
        move="in"
        spanMs={spanMs}
        caption={`Ironwood board · ${GOOGLE}`}
        kicker="NOT JUST CAPEX"
        value="P&L"
        sub="AI costs now flow through"
        tone="amber"
        extra={[
          { label: "Depreciation", value: "✓", tone: "amber" },
          { label: "R&D", value: "✓", tone: "amber" },
          { label: "Talent", value: "✓", tone: "amber" },
        ]}
      />
    </>
  ),
  "2.8": () => (
    <>
      <Heading kicker="STILL…" title="Profit isn't cash" />
      <DocZoom
        src={P("doc/card-release-cashflow.png")}
        focus={{ x: 112, y: 490, w: 792, h: 25 }}
        zoom={1.4}
        note="Layer 2"
        noteSub="→ cash flow"
        tone="blue"
        source="Alphabet Q3 2026 earnings release · cash flow statement"
      />
    </>
  ),

  // ───────── 第 3 章 · Layer 2 · Cash flow ─────────
  "3.1": chapterCard(
    "03 · LAYER 2 · CASH FLOW",
    "The real problem",
    "img/M03.jpg",
    `Building 5 · ${GOOGLE}`,
  ),
  "3.2": ({ spanMs }) => (
    <>
      <Heading kicker="LAYER 2 · CASH FLOW" title="Overspent on capex?" />
      <FootageStat
        src={P("img/M03.jpg")}
        move="in"
        spanMs={spanMs}
        caption={`Building 5 · ${GOOGLE}`}
        kicker="FREE CASH FLOW · Q3"
        value="−$9.1B"
        sub="second negative quarter in a row"
        tone="red"
      />
    </>
  ),
  "3.3": ({ spanMs }) => (
    <>
      <Heading kicker="THE NATURAL ASSUMPTION" title="" />
      <SweepText
        lines={[{ mark: "Wrong." }]}
        size={200}
        top={LAYOUT.contentTop + 120}
      />
      <FullThumb
        src={P("img/ai/A02.png")}
        spanMs={spanMs}
        caption={AI_IMG}
        at={0}
      />
    </>
  ),
  "3.4": () => (
    <>
      <Heading kicker="CAPEX" title="Google actually spent less" />
      <Fit src={{ x: 410, y: 170, w: 1100, h: 780 }} dst={R_MAIN}>
        <At ms={soon(0)}>
          <ExpectVsActual
            title="Capital expenditure, Q3"
            expected={55.8}
            actual={51.4}
            gapLabel="spent less than expected"
            tone="teal"
          />
        </At>
      </Fit>
      <SidePanel
        kicker="CAPEX · Q3"
        items={[
          {
            value: "$51.4B",
            title: "vs. $55.8B expected",
            sub: "Not spending too much",
            tone: "teal",
            at: cueMs("3.4", "Google actually"),
          },
        ]}
      />
    </>
  ),
  "3.5": sweepShot(
    "THE REAL PROBLEM",
    [{ before: "Not spending too much." }, { mark: "Collecting too little." }],
    "img/ai/A03.png",
    AI_IMG,
    76,
  ),
  "3.6": () => (
    <>
      <Heading kicker="THE REAL PROBLEM" title="Collecting too little" />
      <Fit src={{ x: 410, y: 170, w: 1100, h: 780 }} dst={R_MAIN}>
        <At ms={soon(0)}>
          <ExpectVsActual
            title="Operating cash flow, Q3"
            expected={53.9}
            actual={42.3}
            gapLabel="collected less"
            tone="red"
          />
        </At>
      </Fit>
      <SidePanel
        kicker="OPERATING CASH FLOW · Q3"
        items={[
          {
            value: "−$11.6B",
            title: "shortfall",
            sub: "$42.3B vs ≈ $53.9B expected",
            tone: "red",
            at: cueMs("3.6", "That's an"),
          },
        ]}
      />
    </>
  ),
  "3.7": ({ spanMs }) => (
    <>
      <Heading kicker="EVEN STRANGER" title="Profits up, cash down" />
      <SplitMedia
        src={P("img/ai/A04.png")}
        move="in"
        spanMs={spanMs}
        caption={AI_IMG}
        src2={P("img/ai/A05.png")}
        caption2={AI_IMG}
      />
      <CardTag
        x={LAYOUT.left + 28}
        tone="teal"
        at={cueMs("3.7", "operating income grew")}
      >
        Operating income +30%
      </CardTag>
      <CardTag
        x={SPLIT_X2 + 28}
        tone="red"
        at={cueMs("3.7", "while operating cash")}
      >
        Operating cash flow −13%
      </CardTag>
    </>
  ),
  "3.8": () => (
    <>
      <Heading kicker="WHERE THE CASH WENT" title="Two places" />
      <ReadoutPair
        items={[
          {
            kicker: "1 · TPU INVENTORY",
            value: "$13.3B",
            sub: "up from $2.4B at Dec 31, 2025",
            tone: "red",
            at: 0,
          },
          {
            kicker: "2 · EU FINE",
            value: "≈ $5.2B",
            sub: "one-off antitrust fine, paid in Q3",
            tone: "amber",
            at: 500,
          },
        ]}
      />
    </>
  ),
  "3.9": ({ spanMs }) => (
    <>
      <Heading
        kicker="WHERE THE CASH WENT · 1"
        title="TPU systems: build first, get paid later"
      />
      <PinLabel
        src={P("img/T02.webp")}
        move="right"
        spanMs={spanMs}
        caption={`Ironwood superpod · ${GOOGLE}`}
        pins={[
          pin(
            250,
            250,
            "TPU systems",
            cueMs("3.9", "It's now selling") - 650,
            "built first",
            "amber",
          ),
        ]}
      />
      <SidePanel
        kicker="NEW BUSINESS"
        items={[
          {
            title: "Selling complete TPU systems",
            sub: "Not just renting compute in its cloud",
            tone: "amber",
            at: cueMs("3.9", "It's now selling"),
          },
        ]}
      />
    </>
  ),
  "3.10": ({ spanMs }) => {
    const cut = cueMs("3.10", "So inventory jumped") - 300;
    return (
      <>
        <Heading
          kicker="WHERE THE CASH WENT · 1"
          title="TPU systems: build first, get paid later"
          at={-1000}
        />
        <Window to={cut}>
          <BigFlow>
            <CashPath
              stations={["SIGN", "BUILD", "DELIVER", "COLLECT"]}
              dipFrom={1}
              dipTo={3}
              dipLabel="cash tied up in inventory"
            />
          </BigFlow>
        </Window>
        <At ms={cut}>
          <Canvas>
            <FootageCard
              src={P("img/T02.webp")}
              move="in"
              spanMs={spanMs - cut}
              caption={`Ironwood superpod · ${GOOGLE}`}
            />
          </Canvas>
          <CountCard
            kicker="INVENTORY"
            from={2.4}
            to={13.3}
            format={money}
            sub="Dec 31, 2025 → Sep 30, 2026"
            tone="red"
            at={200}
            dur={1600}
          />
        </At>
      </>
    );
  },
  "3.11": ({ spanMs }) => (
    <>
      <Heading
        kicker="THINK OF A RESTAURANT"
        title="Booked solid ≠ cash in hand"
      />
      <CutCard
        spanMs={spanMs}
        caption={PEXELS}
        cuts={[
          { src: P("video/P04.mp4"), startFrom: 0, at: 0, move: "in" },
          { src: P("video/P04.mp4"), startFrom: 3.9, at: 3800, move: "left" },
        ]}
      />
      <SidePanel
        kicker="THE TIMING GAP"
        items={[
          {
            title: "Pay for food first",
            sub: "Cash goes out now",
            tone: "red",
            at: 1800,
          },
          {
            title: "Get paid when diners eat",
            sub: "Cash comes in later",
            tone: "teal",
            at: 3800,
          },
        ]}
      />
    </>
  ),
  "3.12": ({ spanMs }) => (
    <>
      <Heading kicker="WHERE THE CASH WENT · 2" title="A one-off EU fine" />
      <FootageStat
        src={P("img/W01.jpg")}
        move="in"
        spanMs={spanMs}
        caption="Berlaymont, Brussels · CC0 / Wikimedia"
        kicker="ONE-OFF · Q3"
        value="≈ $5.2B"
        sub="EU antitrust fine (2018 case)"
        tone="amber"
      />
    </>
  ),
  "3.13": () => (
    <>
      <Heading kicker="ADD IT BACK" title="Still negative" />
      <Fit src={{ x: 560, y: 260, w: 800, h: 520 }} dst={R_MAIN}>
        <At ms={soon(cueMs("3.13", "quarterly free cash flow") - 400)}>
          <CountUp
            from={-9.1}
            to={-3.9}
            label="Q3 free cash flow, fine added back"
            tone="red"
          />
        </At>
      </Fit>
      <SidePanel
        kicker="ILLUSTRATION"
        items={[
          {
            value: "+$5.2B",
            title: "EU fine added back",
            tone: "amber",
            at: 300,
          },
          {
            title: "Explains part, not all",
            sub: "Other items held constant",
            at: cueMs("3.13", "So the one-time"),
          },
        ]}
      />
    </>
  ),
  "3.14": () => (
    <>
      <Heading kicker="IN FAIRNESS" title="Spent more than it generated" />
      <Fit src={{ x: 260, y: 300, w: 1400, h: 460 }} dst={R_WIDE}>
        <At ms={soon(cueMs("3.14", "Capex was 121%") - 400)}>
          <ProgressOverflow value={121} label="Capex / operating cash flow" />
        </At>
      </Fit>
    </>
  ),
  "3.15": () => (
    <>
      <Heading kicker="A TREND, NOT A BLIP" title="Free cash flow by quarter" />
      <Fit src={{ x: 112, y: 200, w: 1696, h: 720 }} dst={R_WIDE}>
        <At ms={soon(0)}>
          <LineDraw
            points={[
              { label: "Q4'25", value: 24.6 },
              { label: "Q1'26", value: 10.1 },
              { label: "Q2'26", value: -5.9 },
              { label: "Q3'26", value: -9.1 },
            ]}
            min={-15}
            max={30}
            prefix="$"
            suffix="B"
            note="Free cash flow, $B"
          />
        </At>
      </Fit>
      <NoteCard
        title="YTD −$4.8B"
        sub="vs +$48.7B a year ago"
        at={cueMs("3.15", "At this point")}
      />
    </>
  ),
  "3.16": ({ spanMs }) => (
    <>
      <Heading
        kicker="AND IT'S NOT OVER"
        title="Q4 implies even more spending"
      />
      <SplitMedia
        src={P("img/G12.webp")}
        move="in"
        spanMs={spanMs}
        caption={`South Carolina · ${GOOGLE}`}
        title="Capex"
        rows={[
          { label: "2026 full-year guide", value: "$195–205B" },
          { label: "Spent through Q3", value: "≈ $132B" },
          { label: "Q4 implied", value: "$63–73B", tone: "red" },
          { label: "2027", value: "increase significantly", tone: "amber" },
        ]}
      />
    </>
  ),
  "3.17": ({ spanMs }) => (
    <>
      <Heading
        kicker="WHICH RAISES THE QUESTION"
        title="Where does the rest come from?"
      />
      <FootageStat
        src={P("img/G12.webp")}
        move="out"
        spanMs={spanMs}
        caption={`South Carolina · ${GOOGLE}`}
        kicker="UP NEXT"
        value="Layer 3"
        sub="How Google funds the gap"
        tone="blue"
      />
    </>
  ),

  // ───────── 第 4 章 · Layer 3 · Funding ─────────
  "4.1": chapterCard(
    "04 · LAYER 3 · FUNDING",
    "How Google pays for it",
    "video/P02-landscape.mp4",
    PEXELS,
  ),
  "4.2": ({ spanMs }) => (
    <>
      <Heading kicker="LET ME BE CLEAR" title="No liquidity crisis" />
      <SplitMedia
        src={P("video/P01.mp4")}
        startFrom={8}
        spanMs={spanMs}
        caption={`New York · ${PEXELS}`}
        title="Balance sheet, Sep 30"
        rows={[
          {
            label: "Cash & marketable securities",
            value: "≈ $265B",
            tone: "teal",
          },
          { label: "Long-term debt", value: "$125B" },
          { label: "Difference", value: "≈ $140B", tone: "teal" },
        ]}
      />
    </>
  ),
  "4.3a": () => (
    <>
      <Heading kicker="BUT" title="The funding model flipped" />
      <DocZoom
        src={P("doc/card-release-buybacks.png")}
        focus={{ x: 260, y: 491, w: 499, h: 14 }}
        zoom={1.9}
        note="$39.8B → $0"
        noteSub="Buybacks, first nine months"
        tone="red"
        source="Alphabet Q3 2026 earnings release · cash flow statement"
      />
    </>
  ),
  "4.3b": ({ spanMs }) => (
    <>
      <Heading kicker="BUT" title="The funding model flipped" at={-1000} />
      <FootageStat
        src={P("video/P03.mp4")}
        startFrom={3}
        move="in"
        spanMs={spanMs}
        caption={PEXELS}
        kicker="NEW FUNDING · Q3"
        value="$28.7B"
        sub="notes issued"
        tone="amber"
        extra={[{ label: "New shares sold", value: "≈ $12.4B", tone: "amber" }]}
      />
    </>
  ),
  "4.3c": () => (
    <>
      <Heading kicker="BUT" title="The funding model flipped" at={-1000} />
      <Fit src={{ x: 112, y: 220, w: 1696, h: 640 }} dst={R_WIDE}>
        <At ms={soon(0)}>
          <HBarCompare
            rows={[
              { label: "Long-term debt, a year ago", value: 21.6, tone: "ink" },
              { label: "Long-term debt, now", value: 125, tone: "red" },
            ]}
            max={130}
            ratio="≈ 5.8×"
            ratioSub="in one year"
          />
        </At>
      </Fit>
      <NoteCard
        title="Diluted shares +1.35%"
        sub="New stock sold into the market"
        at={cueMs("4.3c", "The diluted")}
      />
    </>
  ),
  "4.4": () => (
    <>
      <Heading kicker="THE OLD FLYWHEEL" title="From buybacks to borrowing" />
      <Fit
        src={{ x: 410, y: 120, w: 1100, h: 860 }}
        dst={{ x: 112, y: 285, w: 1040, h: 630 }}
      >
        <Flywheel
          nodes={[
            "High margins",
            "Free cash flow",
            "Buybacks",
            "Value per share",
          ]}
          reverseAt={cueMs("4.4", "Now it's reversed") - 150}
        />
      </Fit>
      <SidePanel
        kicker="BUYBACKS · FIRST NINE MONTHS"
        items={[
          {
            value: "$39.8B → $0",
            title: "2025 vs 2026",
            tone: "red",
            at: cueMs("4.4", "Now it's reversed"),
          },
        ]}
      />
    </>
  ),
  "4.5": ({ spanMs }) => (
    <>
      <Heading
        kicker="A NEW RULER"
        title="From cash cow to AI infrastructure"
      />
      <RulerSwitch
        left="Cash-cow platform"
        leftSub="High free cash flow · buybacks"
        right="AI infrastructure"
        rightSub="Capital-intensive · lower multiple"
        at={cueMs("4.5", "from a high")}
      />
      <FullThumb src={P("img/ai/A06.png")} spanMs={spanMs} caption={AI_IMG} />
    </>
  ),
  "4.6": () => (
    <>
      <Heading
        kicker="IT DEPENDS ON ONE THING"
        title="Can Search keep printing?"
      />
      <Fit src={{ x: 210, y: 120, w: 1500, h: 840 }} dst={R_MAIN}>
        <BrowserCard
          url="google.com"
          query="can Search keep printing cash?"
          tag="Search"
        />
      </Fit>
      <SidePanel
        kicker="THE CASH MACHINE"
        items={[
          {
            value: "Search",
            title: "Can it keep printing?",
            tone: "blue",
            at: cueMs("4.6", "can the cash machine"),
          },
        ]}
      />
    </>
  ),

  // ───────── 第 5 章 · Is AI eating Search? ─────────
  "5.1": chapterCard(
    "05 · IS AI EATING SEARCH?",
    "Usage vs. money",
    "video/P05-crop.mp4",
    PEXELS,
    20,
  ),
  "5.2": () => (
    <>
      <Heading kicker="SEARCH" title="Growth below the bar" />
      <Fit src={{ x: 112, y: 220, w: 1696, h: 700 }} dst={hostSafe(R_WIDE)}>
        <At ms={soon(0)}>
          <BarGrow
            title="Revenue growth, Q3, year over year"
            bars={[
              { label: "Search", value: 12, ref: 14, tone: "ink" },
              { label: "YouTube ads", value: 9.2, ref: 10, tone: "ink" },
              { label: "Network", value: 1.4, tone: "muted" },
            ]}
            max={16}
            unit="%"
          />
        </At>
      </Fit>
      <NoteCard
        title="Dashed line = buy-side est."
        sub="Search ≈ 14% · YouTube ads 10%"
        at={cueMs("5.2", "The buy side")}
      />
    </>
  ),
  "5.3": ({ spanMs }) => (
    <>
      <Heading
        kicker="THE STRANGE PART"
        title="More searches, slower revenue"
      />
      <SplitMedia
        src={P("video/P05-crop.mp4")}
        startFrom={14}
        move="left"
        spanMs={spanMs}
        caption={PEXELS}
        src2={P("video/M05-answer-crop.mp4")}
        caption2="AI Mode · Google"
      />
      <CardTag x={LAYOUT.left + 28} tone="teal" at={900}>
        Queries · fastest in 5 years ↑
      </CardTag>
      <CardTag x={SPLIT_X2 + 28} tone="red" at={cueMs("5.3", "More usage")}>
        Revenue growth · slowing ↓
      </CardTag>
    </>
  ),
  "5.4": () => (
    <>
      <Heading kicker="TWO EXPLANATIONS" title="Management vs. the bears" />
      <ReadoutPair
        items={[
          {
            kicker: "MANAGEMENT · USERS",
            value: "Not leaving",
            tone: "blue",
            at: 0,
          },
          {
            kicker: "THE BEARS · SEARCH",
            value: "Eroding",
            tone: "red",
            at: 200,
          },
        ]}
      />
    </>
  ),
  "5.5": () => (
    <>
      <Heading kicker="MANAGEMENT'S VIEW" title="Nothing is broken" />
      <CheckList
        title="MANAGEMENT POINTED TO"
        tone="blue"
        items={[
          {
            text: "Foreign exchange",
            at: cueMs("5.5", "foreign exchange") - 300,
          },
          {
            text: "Tough comparison (≈ 3 pts)",
            at: cueMs("5.5", "a tough comparison") - 300,
          },
          {
            text: "APAC e-commerce, post-World Cup",
            at: cueMs("5.5", "some industry") - 300,
          },
          {
            text: "AI Mode monetizes lower",
            at: cueMs("5.5", "They also admitted") - 300,
          },
        ]}
      />
      <SidePanel
        kicker="MANAGEMENT, Q3 CALL"
        items={[
          {
            title: "“Users aren't leaving”",
            tone: "blue",
            at: cueMs("5.5", "users aren't leaving"),
          },
        ]}
      />
    </>
  ),
  "5.6": ({ spanMs }) => (
    <>
      <Heading kicker="THE BEAR CASE" title="Fewer ads per answer" />
      <FootageStat
        src={P("video/P06.mp4")}
        move="in"
        spanMs={spanMs}
        caption={PEXELS}
        kicker="BEARS' POINTS"
        value="AI erodes Search"
        sub="Third-party data: search share slipping"
        tone="red"
        extra={[
          { label: "Gemini", value: "lagged", tone: "red" },
          { label: "Compute", value: "→ cloud", tone: "red" },
          { label: "CPC growth", value: "slowed", tone: "red" },
          { label: "Ad budgets", value: "→ Meta", tone: "red" },
        ]}
      />
    </>
  ),
  "5.7": () => (
    <>
      <Heading kicker="WHY IT MATTERS" title="Scale" />
      <Fit src={{ x: 112, y: 220, w: 1696, h: 640 }} dst={R_WIDE}>
        <At ms={-500}>
          <HBarCompare />
        </At>
      </Fit>
    </>
  ),
  "5.8": () => (
    <>
      <Heading kicker="NOTICE" title="Definitions differ" />
      <PinLabel
        src={P("img/M05-ask-any-way.png")}
        move="none"
        caption="AI Mode · search.google"
        pins={[
          pin(
            745,
            135,
            "AI Mode",
            cueMs("5.8", "includes AI Mode") - 650,
            undefined,
            "blue",
          ),
          pin(
            262,
            376,
            "Image",
            cueMs("5.8", "image and voice") - 650,
            undefined,
            "blue",
          ),
          pin(
            700,
            268,
            "Voice",
            cueMs("5.8", "image and voice") - 200,
            undefined,
            "blue",
          ),
        ]}
      />
      <SidePanel
        kicker="MANAGEMENT'S COUNT INCLUDES"
        items={[
          {
            title: "AI Mode",
            tone: "blue",
            at: cueMs("5.8", "includes AI Mode"),
          },
          {
            title: "Image searches",
            tone: "blue",
            at: cueMs("5.8", "image and voice"),
          },
          {
            title: "Voice searches",
            tone: "blue",
            at: cueMs("5.8", "image and voice") + 400,
          },
        ]}
      />
    </>
  ),
  "5.9": () => (
    <>
      <Heading kicker="BUT BOTH AGREE" title="AI answers earn less, for now" />
      <Fit src={{ x: 210, y: 120, w: 1500, h: 840 }} dst={R_MAIN}>
        <BrowserCard
          url="google.com/search?udm=50"
          src={P("video/M05-blog-ai-mode-animation.mp4")}
          startFrom={7.5}
        />
      </Fit>
      <SidePanel
        kicker="BOTH SIDES AGREE"
        items={[
          {
            title: "AI searches earn less than classic ones",
            sub: "At least for now",
            tone: "red",
            at: cueMs("5.9", "AI searches"),
          },
        ]}
      />
    </>
  ),
  "5.10": () => (
    <>
      <Heading kicker="THE POINT" title="" />
      <SweepText
        lines={[
          { before: "Usage isn't the problem." },
          { mark: "Monetization is." },
        ]}
        size={76}
        top={LAYOUT.contentTop + 170}
      />
      <SidePanel
        kicker="AI MODE QUERIES"
        items={[
          {
            value: "3×",
            title: "longer than traditional searches",
            sub: "but monetize at a lower rate",
            tone: "blue",
            at: cueMs("5.10", "three times"),
          },
        ]}
      />
    </>
  ),
  "5.11": () => (
    <>
      <Heading kicker="MY READ" title="Too early to call" />
      <Fit src={{ x: 210, y: 120, w: 1500, h: 840 }} dst={R_MAIN}>
        <BrowserCard
          url="google.com/search?udm=50"
          src={P("video/M05-blog-ai-mode-animation.mp4")}
          startFrom={19}
        />
      </Fit>
      <SidePanel
        kicker="GOOGLE'S NEXT MOVES"
        items={[
          {
            title: "AI Mode ads → international",
            sub: "Expanding outside the U.S.",
            tone: "blue",
            at: cueMs("5.11", "expanding AI Mode"),
          },
          {
            title: "Multi-turn ads (U.S.)",
            sub: "Conversational ad formats",
            tone: "blue",
            at: cueMs("5.11", "launching multi-turn"),
          },
          {
            title: "Watch: paid clicks · CPC",
            tone: "amber",
            at: cueMs("5.11", "Whether that works"),
          },
        ]}
      />
    </>
  ),
  "5.12": ({ spanMs }) => (
    <>
      <Heading kicker="ONE MORE CAUTION" title="Q4 headwinds" />
      <FootageStat
        src={P("video/P03.mp4")}
        startFrom={8}
        move="in"
        spanMs={spanMs}
        caption={PEXELS}
        kicker="Q4 GUIDANCE"
        value="Headwinds"
        sub="management already flagged"
        tone="red"
        extra={[
          { label: "FX", value: "↓", tone: "red" },
          { label: "Tough comps", value: "↓", tone: "red" },
        ]}
      />
    </>
  ),
  "5.13": ({ spanMs }) => (
    <>
      <Heading kicker="THE OTHER ENGINE" title="Can Cloud take over?" />
      <IrisCard
        src={P("video/M05-aimode-scroll.mp4")}
        startFrom={6}
        next={P("img/ai/A07.png")}
        nextCaption={AI_IMG}
        at={cueMs("5.13", "Cloud")}
        spanMs={spanMs}
        caption={GOOGLE}
      />
      <SidePanel
        kicker="THE OTHER ENGINE"
        items={[
          {
            value: "Cloud",
            title: "$30.7B revenue · +103%",
            tone: "teal",
            at: cueMs("5.13", "Cloud"),
          },
        ]}
      />
    </>
  ),

  // ───────── 第 6 章 · Google Cloud ─────────
  "6.1": chapterCard(
    "06 · GOOGLE CLOUD",
    "The real highlight",
    "img/G04.jpg",
    `New Albany, Ohio · ${GOOGLE}`,
  ),
  "6.2": ({ spanMs }) => (
    <>
      <Heading kicker="THE GOOD NEWS" title="Cloud doubled" />
      <CutCard
        spanMs={spanMs}
        caption="Video: Google"
        cuts={[
          { src: P("video/V01.mp4"), startFrom: 20, at: 0, move: "in" },
          { src: P("video/V01.mp4"), startFrom: 60, at: 4200, move: "left" },
          { src: P("video/V01.mp4"), startFrom: 100, at: 8600, move: "in" },
        ]}
      />
      <SwitchStat
        kicker="GOOGLE CLOUD · Q3"
        steps={[
          {
            at: cueMs("6.2", "Google Cloud revenue") - 300,
            value: "$30.7B",
            sub: "revenue",
            tone: "ink",
          },
          {
            at: cueMs("6.2", "up 103%") - 300,
            value: "+103%",
            sub: "year over year",
            tone: "teal",
          },
          {
            at: cueMs("6.2", "Operating income was") - 300,
            value: "$11.1B",
            sub: "operating income",
            tone: "ink",
          },
          {
            at: cueMs("6.2", "the margin rose") - 300,
            value: "36.2%",
            sub: "margin, up from 23.7%",
            tone: "teal",
          },
        ]}
      />
    </>
  ),
  "6.3": () => (
    <>
      <Heading kicker="IN ONE YEAR" title="From 15% to 24% of revenue" />
      <Fit src={{ x: 300, y: 220, w: 1320, h: 700 }} dst={R_MAIN}>
        <At ms={soon(0)}>
          <DonutFill />
        </At>
      </Fit>
      <SidePanel
        kicker="CLOUD BACKLOG"
        items={[
          {
            value: "$561B",
            title: "≈ 60% of this quarter's revenue growth",
            tone: "teal",
            at: cueMs("6.3", "Backlog"),
          },
        ]}
      />
    </>
  ),
  "6.4": () => (
    <>
      <Heading kicker="BUT" title="Three discounts" />
      <PhotoStack
        srcs={[P("img/G06.jpg"), P("img/ai/A08.png"), P("img/G10.jpg")]}
        captions={["1 Expectations", "2 TPUs", "3 Margins"]}
        stepMs={600}
      />
      <SidePanel
        kicker="BEFORE CLOUD OFFSETS SEARCH"
        items={[
          { title: "1 · Expectations", tone: "amber", at: 300 },
          { title: "2 · TPUs", tone: "amber", at: 900 },
          { title: "3 · Margins", tone: "amber", at: 1500 },
        ]}
      />
    </>
  ),
  "6.5": () => (
    <>
      <Heading
        kicker="DISCOUNT 1 · EXPECTATIONS"
        title="Beat or miss depends on whose number"
      />
      <Fit src={{ x: 112, y: 260, w: 1696, h: 560 }} dst={R_WIDE}>
        <At ms={-500}>
          <RulerMarkers />
        </At>
      </Fit>
      <NoteCard
        title="New bookings ≈ $77.7B"
        sub="Roughly flat vs Q2"
        top={LAYOUT.contentTop + 440}
        right={150}
        at={cueMs("6.5", "New contract")}
      />
    </>
  ),
  "6.6": () => (
    <>
      <Heading kicker="DISCOUNT 2 · TPUs" title="How much is hardware?" />
      <Fit src={{ x: 190, y: 300, w: 1540, h: 460 }} dst={R_WIDE}>
        <At ms={soon(cueMs("6.6", "How much of that") - 300)}>
          <CardSplit />
        </At>
      </Fit>
      <NoteCard
        title="Asked twice. No number."
        sub="Analysts on the Q3 call"
        at={cueMs("6.6", "Analysts asked")}
      />
    </>
  ),
  "6.7": ({ spanMs }) => (
    <>
      <Heading
        kicker="DISCOUNT 3 · MARGINS"
        title="Segment margin ≠ group returns"
      />
      <SplitMedia
        src={P("img/G10.jpg")}
        move="right"
        spanMs={spanMs}
        caption={GOOGLE}
        title="Cloud margin, caveats"
        rows={[
          { label: "Segment margin", value: "36.2%", tone: "teal" },
          {
            label: "Shared AI research (excluded)",
            value: "+71%",
            tone: "red",
          },
          {
            label: "Q4: more 3rd-party compute",
            value: "margin ↓",
            tone: "red",
          },
        ]}
      />
    </>
  ),
  "6.8": () => (
    <>
      <Heading kicker="ONE LONGER-TERM RISK" title="Commitments vs. backlog" />
      <DocZoom
        src={P("doc/card-10q-commitments.png")}
        focus={{ x: 15, y: 192, w: 985, h: 30 }}
        zoom={1.3}
        note="$924B"
        noteSub="future purchase commitments"
        tone="amber"
        source="Alphabet Q3 2026 10-Q · p. 58"
      />
      <NoteCard
        title="Backlog $561B (separate figure)"
        sub="Timing · terms · counterparty risk"
        at={cueMs("6.8", "If AI investment")}
      />
    </>
  ),
  "6.9": ({ spanMs }) => (
    <>
      <Heading
        kicker="SO"
        title="Cloud growth is real. Cash returns aren't, yet."
      />
      <FootageStat
        src={P("img/ai/A13.png")}
        move="in"
        spanMs={spanMs}
        caption={AI_IMG}
        kicker="GOOGLE CLOUD"
        value="Not yet"
        sub="cash for shareholders"
        tone="muted"
        extra={[
          { label: "Growth", value: "✓", tone: "teal" },
          { label: "Cash returns", value: "○", tone: "muted" },
        ]}
      />
    </>
  ),
  "6.10": ({ spanMs }) => (
    <>
      <Heading kicker="THE OBVIOUS QUESTION" title="Same night. Oct 28." />
      <SplitMedia
        src={P("img/G04.jpg")}
        move="in"
        spanMs={spanMs}
        caption={`New Albany · ${GOOGLE}`}
        src2={P("img/X01.jpg")}
        caption2="Fairwater, Atlanta · Image: Microsoft"
      />
      <CardTag x={LAYOUT.left + 28} tone="ink" at={600}>
        GOOGL
      </CardTag>
      <CardTag x={SPLIT_X2 + 28} tone="blue" at={cueMs("6.10", "Microsoft")}>
        MSFT
      </CardTag>
    </>
  ),

  // ───────── 第 7 章 · Control group: Microsoft ─────────
  "7.1a": () => (
    <>
      <Heading kicker="07 · CONTROL GROUP" title="Microsoft, same night" />
      <HostSafe>
        <DocZoom
          src={P("doc/card-msft-cashflow.png")}
          focus={{ x: 210, y: 485, w: 600, h: 22 }}
          zoom={1.6}
          note="+$18.6B"
          noteSub="FCF vs $8.5B est. · Azure +48%"
          tone="teal"
          source="Microsoft FY27 Q1 press release · cash flow statement"
        />
      </HostSafe>
    </>
  ),
  "7.1b": () => (
    <>
      <Heading kicker="THE GAP" title="$27.7 billion" />
      <Fit src={{ x: 112, y: 220, w: 1696, h: 640 }} dst={R_WIDE}>
        <At ms={-500}>
          <HBarCompare
            rows={[
              { label: "Microsoft free cash flow", value: 18.6, tone: "teal" },
              { label: "Alphabet free cash flow", value: -9.1, tone: "red" },
            ]}
            max={20}
            ratio="$27.7B gap"
            ratioSub="same quarter"
          />
        </At>
      </Fit>
      <NoteCard
        title="Quarter ended Sep 30, 2026"
        sub="FCF = operating cash flow − capex"
        at={cueMs("7.1b", "Microsoft rose")}
      />
    </>
  ),
  "7.2": ({ spanMs }) => (
    <>
      <Heading kicker="THE STANDARD CHANGED" title="Can AI pay for itself?" />
      <SplitMedia
        src={P("img/ai/A10.png")}
        move="in"
        spanMs={spanMs}
        caption={AI_IMG}
        src2={P("img/ai/A11.png")}
        caption2={AI_IMG}
      />
      <CardTag
        x={LAYOUT.left + 28}
        tone="muted"
        at={cueMs("7.2", "A year ago")}
      >
        A year ago · Who grows AI fastest?
      </CardTag>
      <CardTag
        x={SPLIT_X2 + 28}
        tone="amber"
        at={cueMs("7.2", "Now the question")}
      >
        Now · Can AI pay for itself?
      </CardTag>
    </>
  ),
  "7.3": sweepShot(
    "THE NEW STANDARD",
    [{ mark: "AI has to pay for itself." }],
    "img/M03.jpg",
    GOOGLE,
    76,
  ),

  // ───────── 第 8 章 · What's next ─────────
  "8.1": chapterCard(
    "08 · WHAT'S NEXT",
    "Both sides",
    "video/P02-landscape.mp4",
    PEXELS,
    4,
  ),
  "8.2": () => (
    <>
      <Heading kicker="THE BULL CASE" title="Five reasons to stay calm" />
      <TileRow
        height={hostSafe(R_WIDE).h}
        items={[
          { label: "CLOUD", value: "2×", tone: "teal", at: 0 },
          { label: "QUERIES", value: "↑", tone: "teal", at: 200 },
          { label: "GEMINI APP", value: "1B", tone: "teal", at: 400 },
          { label: "MODEL", value: "#1", tone: "teal", at: 600 },
          { label: "CASH > DEBT", value: "$140B", tone: "teal", at: 800 },
        ]}
      />
    </>
  ),
  "8.3": () => (
    <>
      <Heading kicker="THE BEAR CASE" title="Five reasons to worry" />
      <TileRow
        items={[
          {
            label: "CORE ADS",
            value: "Miss",
            tone: "red",
            at: 0,
          },
          {
            label: "OP PROFIT",
            value: "Miss",
            tone: "red",
            at: cueMs("8.3", "Operating profit") - 300,
          },
          {
            label: "FCF · 2 QUARTERS",
            value: "Negative",
            tone: "red",
            at: cueMs("8.3", "Two straight") - 300,
          },
          {
            label: "FUNDING",
            value: "Debt",
            tone: "red",
            at: cueMs("8.3", "Debt and new") - 300,
          },
          {
            label: "2027 CAPEX",
            value: "$330B+",
            tone: "red",
            at: cueMs("8.3", "And 2027 capex") - 300,
          },
        ]}
      />
      <NoteCard
        title="2027 capex $330–375B"
        sub="Buy-side estimates"
        at={cueMs("8.3", "with buy-side")}
      />
    </>
  ),
  "8.4": ({ spanMs }) => (
    <>
      <Heading kicker="MY TAKE" title="A bounce ≠ a reversal" />
      <FootageStat
        src={P("video/P06.mp4")}
        spanMs={spanMs}
        caption={PEXELS}
        kicker="NEAR TERM"
        value="Estimates likely cut"
        sub="stock may need time to build a base"
        tone="amber"
        extra={[
          { label: "Watch zone", value: "< ~20× fwd P/E" },
          { label: "Condition", value: "inventory → cash" },
        ]}
      />
    </>
  ),
  "8.5": () => (
    <>
      <Heading
        kicker="THREE THINGS TO TRACK"
        title="What would change my mind"
      />
      <Fit src={{ x: 112, y: 300, w: 1696, h: 440 }} dst={R_WIDE}>
        <At ms={soon(cueMs("8.5", "1. Search") - 400)}>
          <CheckSteps
            steps={[
              {
                title: "1 Paid clicks & CPC",
                rows: ["Can AI search", "make money?"],
              },
              {
                title: "2 Cash flow & inventory",
                rows: ["TPU build", "→ cash"],
              },
              {
                title: "3 2027 capex guide",
                rows: ["Q4 call", "next big test"],
              },
            ]}
            stepMs={
              (cueMs("8.5", "2. Operating") - cueMs("8.5", "1. Search")) * 1.05
            }
          />
        </At>
      </Fit>
    </>
  ),

  // ───────── 第 9 章 · Close ─────────
  "9.1": () => (
    <>
      <Heading
        kicker="ONE SENTENCE"
        title="Growth is real. Cash returns still need proof."
      />
      <HostSafe>
        <PhotoStack
          srcs={[P("img/ai/A15.png"), P("img/ai/A14.png")]}
          captions={["Cloud +103%", "Free cash flow −$9.1B"]}
          stepMs={900}
        />
      </HostSafe>
      <SidePanel
        kicker="THE MARKET IS REPRICING GOOGLE"
        items={[
          { title: "From cash cow", tone: "ink", at: 300 },
          {
            title: "to AI infrastructure company",
            tone: "amber",
            at: cueMs("9.1", "It's repricing"),
          },
        ]}
      />
    </>
  ),
  "9.2": () => (
    <>
      <Heading
        kicker="YOUR CALL"
        title="Investment cycle — or a deeper shift?"
      />
      <ReadoutPair
        rect={hostSafe(R_MAIN)}
        items={[
          {
            kicker: "A · INVESTMENT CYCLE",
            value: "Growing pain",
            tone: "teal",
            at: 0,
          },
          {
            kicker: "B · DEEPER SHIFT",
            value: "Search aging",
            tone: "red",
            at: 200,
          },
        ]}
      />
      <SidePanel
        kicker="YOUR CALL"
        items={[
          {
            value: "A or B?",
            title: "Let me know in the comments",
            tone: "blue",
            at: cueMs("9.2", "Let me know"),
          },
        ]}
      />
    </>
  ),
  "9.3": ({ spanMs }) => (
    <>
      <Heading kicker="ANDY'S MARKET LENS" title="Thanks for watching" />
      <Canvas>
        <FootageCard
          src={P("img/ai/A09.png")}
          move="out"
          spanMs={spanMs}
          caption={AI_IMG}
        />
      </Canvas>
      <SubscribePanel at={300} />
    </>
  ),
  "9.4": () => (
    <>
      <Heading kicker="THANKS FOR WATCHING" title="Up next" />
      <EndScreen />
    </>
  ),
};

/**
 * 右下角频道标（y 798–930）：内容区左卡和右栏都铺满到 y 885，放哪都会压卡片，本期不放。
 */
export const MARK_SHOTS = new Set<string>();
