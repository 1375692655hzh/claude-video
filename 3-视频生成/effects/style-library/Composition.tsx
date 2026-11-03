// 风格库标准样张：同一组 4 个画面套任一风格（章节开场 / 大数字 / 两年对比 / 动效库动作），每个 3 秒。
// 新风格入库时用它出样张和展示卡：npx remotion still style-sample-<id> --frame=75 / 165 / 255 / 345
import React from "react";
import { AbsoluteFill, Composition, Sequence, staticFile } from "remotion";
import { STYLES, getStyle, useStyleFonts } from "../_shared/styles";
import { Motion, MotionTheme } from "../_shared/motion";

const PHOTO = "library/style-samples/fab.jpg"; // 本地示意图（不进仓库）
const usesPhoto = (id: string) => ["documentary", "deco", "navy"].includes(id);
const top = (id: string) => (id === "newspaper" ? 210 : id === "terminal" ? 140 : id === "swiss" ? 160 : 140);
const ROWS = [
  { k: "Revenue", a: "$308M", b: "$1.01B" },
  { k: "Adj. gross margin", a: "32%", b: "50.4%" },
  { k: "Op. margin", a: "−0.3%", b: "36.6%" },
];
const SRC = "Lumentum Q4 FY24 & Q4 FY26 releases";

const Scene: React.FC<{ id: string; n: number }> = ({ id, n }) => {
  const K = getStyle(id);
  const bg = usesPhoto(id) ? staticFile(PHOTO) : undefined;
  if (n === 0)
    return (
      <AbsoluteFill>
        <K.Backdrop src={bg} />
        <K.Chrome />
        <div style={{ position: "absolute", left: 0, right: 0, top: 380, display: "flex", justifyContent: "center" }}><K.Title kicker="CHAPTER 02" title="Why Lasers?" align="center" size={120} /></div>
        <K.ChapterBadge num="02" title="Why Lasers?" />
      </AbsoluteFill>
    );
  if (n === 1)
    return (
      <AbsoluteFill>
        <K.Backdrop src={bg} />
        <K.Chrome source="Marvell & Lumentum, Nov 2, 2026" />
        <div style={{ position: "absolute", left: 0, right: 0, top: id === "swiss" ? 200 : 300, display: "flex", justifyContent: "center", textAlign: "center" }}><K.BigNumber value="$115B" label="Implied enterprise value" tone="accent" /></div>
        <K.Caption text="Marvell agreed to buy Lumentum in an all-stock deal." />
      </AbsoluteFill>
    );
  if (n === 2)
    return (
      <AbsoluteFill>
        <K.Backdrop src={bg} />
        <K.Chrome source={SRC} />
        <div style={{ position: "absolute", left: 140, top: top(id) }}><K.Title title="From Loss to Chip-Level Margins" size={68} /></div>
        <div style={{ position: "absolute", left: 140, top: top(id) + 170, display: "flex", gap: 50 }}>
          {[0, 1].map((i) => (
            <K.Panel key={i} w={620} h={440} tone={i ? "up" : "down"} focus={i === 1}>
              <div style={{ width: "100%" }}>
                <div style={{ opacity: 0.75, fontSize: 24, letterSpacing: "0.12em", marginBottom: 10 }}>{i ? "JUNE QUARTER 2026" : "JUNE QUARTER 2024"}</div>
                {ROWS.map((r) => <K.Row key={r.k} k={r.k} v={i ? r.b : r.a} tone={i ? "up" : r.a.startsWith("−") ? "down" : "neutral"} />)}
              </div>
            </K.Panel>
          ))}
        </div>
        <K.Caption text="In two years, Lumentum went from losing money to keeping almost 37 cents per dollar." />
      </AbsoluteFill>
    );
  return (
    <AbsoluteFill>
      <MotionTheme theme={K.theme}>
        <Motion id="flyline" />
      </MotionTheme>
      <K.Chrome source="Nvidia press releases, Mar 2026" />
      <K.Caption text="Nvidia has money in the buyer and the target." />
    </AbsoluteFill>
  );
};

export const StyleSample: React.FC<{ id: string }> = ({ id }) => {
  useStyleFonts();
  return (
    <AbsoluteFill style={{ background: "#000" }}>
      {[0, 1, 2, 3].map((n) => (
        <Sequence key={n} from={n * 90} durationInFrames={90} name={`scene ${n + 1}`}>
          <Scene id={id} n={n} />
        </Sequence>
      ))}
    </AbsoluteFill>
  );
};

export const StyleLibraryComposition: React.FC = () => (
  <>
    {Object.keys(STYLES).map((id) => (
      <Composition key={id} id={`style-sample-${id}`} component={StyleSample} durationInFrames={360} fps={30} width={1920} height={1080} defaultProps={{ id }} />
    ))}
  </>
);
