// 2026-10-google-q3 主时间线：背景 / 场景 / 章节卡 / 名片条 / 免责声明 / 字幕 / 配音 / 配乐 / 音效。
import React from "react";
import { AbsoluteFill, Html5Audio, Sequence, interpolate, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { planSegments } from "../_shared/Bgm";
import { MUSIC } from "../_shared/music-library";
import { SfxTrack } from "../_shared/Sfx";
import { SfxCue, sfxDuck } from "../_shared/sfx-rules";
import { C, FONT, asset, clamp, useFont, useIn } from "./ui";
import { CARDS, CHAPTER_TITLES, Card, SHOTS, SPEECH, SUBS, TOTAL_FRAMES, cardOf, shotOf } from "./timeline";
import type { SceneProps } from "./scene-types";
import { SCENES_1 } from "./scenes-1";
import { SCENES_2 } from "./scenes-2";
import { SCENES_3 } from "./scenes-3";

const GROUPS = [...SCENES_1, ...SCENES_2, ...SCENES_3];
{
  // 每个镜头只能出现在一个场景里，且场景内镜头连续
  const all = GROUPS.flatMap((g) => g.shots);
  const missing = SHOTS.filter((s) => !all.includes(s.shot)).map((s) => s.shot);
  if (missing.length || all.length !== SHOTS.length) throw new Error(`场景表和镜头对不上：缺 ${missing.join(",")}`);
}

const Background: React.FC = () => {
  const frame = useCurrentFrame();
  const drift = (frame * 0.4) % 60;
  return (
    <AbsoluteFill style={{ background: `radial-gradient(ellipse at 30% 20%, ${C.bg2} 0%, ${C.bg} 70%)` }}>
      <AbsoluteFill
        style={{
          backgroundImage: `linear-gradient(${C.line} 1px, transparent 1px), linear-gradient(90deg, ${C.line} 1px, transparent 1px)`,
          backgroundSize: "60px 60px",
          backgroundPosition: `${drift}px ${drift}px`,
          opacity: 0.16,
          maskImage: "radial-gradient(ellipse at center, black 30%, transparent 80%)",
        }}
      />
    </AbsoluteFill>
  );
};

const GroupFrame: React.FC<{ frames: number; children: React.ReactNode }> = ({ frames, children }) => {
  const frame = useCurrentFrame();
  const o = Math.min(interpolate(frame, [0, 10], [0, 1], clamp), interpolate(frame, [frames - 8, frames], [1, 0], clamp));
  const push = interpolate(frame, [0, 14], [1.025, 1], clamp);
  return <AbsoluteFill style={{ opacity: o, transform: `scale(${push})` }}>{children}</AbsoluteFill>;
};

// 第 4 章卡：riser 铺垫，标题在 REVEAL 帧砸下（impact 同一帧）
const C4_REVEAL = 64;

const ChapterCard: React.FC<{ card: Card }> = ({ card }) => {
  const frame = useCurrentFrame();
  const t = CHAPTER_TITLES[card.chapter];
  const reveal = card.chapter === 4 ? C4_REVEAL : 8;
  const k = useIn(reveal, card.chapter === 4 ? 10 : 16);
  const n = useIn(2, 16);
  const o = interpolate(frame, [card.frames - 8, card.frames], [1, 0], clamp);
  return (
    <AbsoluteFill style={{ fontFamily: FONT, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 20, opacity: o }}>
      {t.num ? <div style={{ fontSize: 150, fontWeight: 800, color: C.cyan, opacity: n, letterSpacing: 4 }}>{t.num}</div> : null}
      <div style={{ width: 120 * n, height: 6, background: C.cyan, borderRadius: 3 }} />
      <div
        style={{
          fontSize: 76,
          fontWeight: 800,
          color: C.white,
          textAlign: "center",
          maxWidth: 1500,
          lineHeight: 1.12,
          opacity: k,
          transform: card.chapter === 4 ? `scale(${1.4 - 0.4 * k})` : `translateY(${(1 - k) * 60}px)`,
        }}
      >
        {t.title}
      </div>
      {t.sub ? <div style={{ fontSize: 40, fontWeight: 600, color: C.muted, opacity: k }}>{t.sub}</div> : null}
    </AbsoluteFill>
  );
};

/** 名片条 0:08–0:15 */
const LowerThird: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const a = 8 * fps;
  const b = 15 * fps;
  const k = interpolate(frame, [a, a + 12], [0, 1], { ...clamp });
  const out = interpolate(frame, [b - 12, b], [1, 0], clamp);
  const o = Math.min(k, out);
  if (o <= 0) return null;
  return (
    <div style={{ position: "absolute", left: 80, bottom: 170, fontFamily: FONT, opacity: o, transform: `translateX(${(1 - k) * -80}px)`, display: "flex" }}>
      <div style={{ width: 8, background: C.cyan, borderRadius: 4 }} />
      <div style={{ background: "rgba(6,16,31,0.88)", padding: "14px 28px", borderRadius: "0 12px 12px 0" }}>
        <div style={{ fontSize: 40, fontWeight: 700, color: C.white }}>
          Andy · <span style={{ color: C.cyan }}>Andy&apos;s Market Lens</span>
        </div>
        <div style={{ fontSize: 28, fontWeight: 500, color: C.muted }}>10+ years investing in US &amp; HK stocks</div>
      </div>
    </div>
  );
};

const Disclaimer: React.FC = () => {
  const frame = useCurrentFrame();
  const o = interpolate(frame, [0, 10, 140, 150], [0, 1, 1, 0], clamp);
  if (o <= 0) return null;
  return (
    <div style={{ position: "absolute", left: 0, right: 0, bottom: 18, textAlign: "center", fontFamily: FONT, fontSize: 22, color: C.muted, opacity: o }}>
      This video is for information only and is not investment advice.
    </div>
  );
};

const Subtitles: React.FC = () => {
  const frame = useCurrentFrame();
  const sub = SUBS.find((s) => frame >= s.from && frame < s.to);
  if (!sub) return null;
  return (
    <div style={{ position: "absolute", left: 0, right: 0, bottom: 62, display: "flex", justifyContent: "center" }}>
      <div
        style={{
          fontFamily: FONT,
          fontSize: 40,
          fontWeight: 600,
          color: C.white,
          padding: "8px 26px",
          borderRadius: 10,
          background: "rgba(0,0,0,0.6)",
          fontVariantNumeric: "tabular-nums",
        }}
      >
        {sub.text}
      </div>
    </div>
  );
};

// ---------- 音效（全片集中登记，规则见 _shared/sfx-rules.ts） ----------
const v = (n: number) => shotOf(n).voiceFrom;
const s = (n: number) => shotOf(n).from;
const vEnd = (n: number) => shotOf(n).voiceFrom + shotOf(n).voiceFrames;
const CUES: SfxCue[] = [
  { name: "impact", at: v(3) + 75 }, // 开头 −$9.1B 落地，重点 1/3
  { name: "whoosh-slow", at: cardOf(1).from },
  { name: "count", at: v(7) + 60 },
  { name: "whoosh-slow", at: cardOf(2).from },
  { name: "count", at: s(19) + 6 },
  { name: "ding", at: s(26) + 2 },
  { name: "rise", at: v(30) + 10 },
  { name: "pop", at: s(32) + 95 },
  { name: "pop", at: s(34) + 70, allow: "订阅提示，按钮按下" },
  { name: "whoosh-slow", at: cardOf(3).from },
  { name: "count", at: v(39) + 60 },
  { name: "pop", at: v(41) + 75 },
  { name: "count", at: s(50) + 6 },
  { name: "riser", endAt: cardOf(4).from + C4_REVEAL },
  { name: "impact", at: cardOf(4).from + C4_REVEAL }, // 第 4 章卡，重点 2/3
  { name: "count", at: s(62) + 110 },
  { name: "rise", at: s(68) + 110 },
  { name: "pop", at: v(73) + 75 },
  { name: "count", at: v(76) + 60 },
  { name: "whoosh-slow", at: cardOf(5).from },
  { name: "rise", at: v(82) + 50 },
  { name: "impact", at: vEnd(87) - 35 }, // "70 percent"，重点 3/3
  { name: "count", at: s(88) + 20 },
  { name: "whoosh-fast", at: v(98) - 6 },
  { name: "whoosh-slow", at: cardOf(6).from },
  { name: "ding", at: v(110) },
];

// ---------- 配乐：deep（开头–第 3 章）→ minimal（第 4–5 章）→ deep 结尾段（收尾） ----------
type BgmSection = { track: string; from: number; to: number; alignEnd?: boolean };
const XF = 60; // 交叉淡化 2 秒
const SECTIONS: BgmSection[] = [
  { track: "bgm-tech-deep", from: 0, to: cardOf(4).from + XF / 2 },
  { track: "bgm-tech-minimal", from: cardOf(4).from - XF / 2, to: cardOf(6).from + XF / 2 },
  { track: "bgm-tech-deep", from: cardOf(6).from - XF / 2, to: TOTAL_FRAMES, alignEnd: true },
];
const inCard = (f: number) => CARDS.some((c) => f >= c.from && f < c.from + c.frames);

const SectionBgm: React.FC<{ sec: BgmSection; duck: (f: number) => number }> = ({ sec, duck }) => {
  const { fps } = useVideoConfig();
  const t = MUSIC[sec.track];
  const len = (sec.to - sec.from) / fps;
  const segs =
    sec.alignEnd && len <= t.duration
      ? [{ from: 0, srcStart: t.duration - len, length: len, fadeIn: false, fadeOut: false }]
      : planSegments(len, t, 2);
  return (
    <>
      {segs.map((g, i) => {
        const from = sec.from + Math.round(g.from * fps);
        const n = Math.min(Math.round(g.length * fps), sec.to - from);
        return (
          <Sequence key={i} from={from} durationInFrames={n} layout="none">
            <Html5Audio
              src={staticFile(t.file)}
              trimBefore={Math.round(g.srcStart * fps)}
              volume={(f) => {
                const abs = from + f;
                const edge = (g.fadeIn ? interpolate(f, [0, XF], [0, 1], clamp) : 1) * (g.fadeOut ? interpolate(f, [n - XF, n], [1, 0], clamp) : 1);
                const secEdge =
                  (sec.from > 0 ? interpolate(abs, [sec.from, sec.from + XF], [0, 1], clamp) : interpolate(abs, [0, 45], [0, 1], clamp)) *
                  interpolate(abs, [sec.to - XF, sec.to], [1, 0], clamp);
                const base = inCard(abs) ? 0.14 : 0.095;
                return base * edge * secEdge * duck(abs);
              }}
            />
          </Sequence>
        );
      })}
    </>
  );
};

export const GoogleQ3Main: React.FC = () => {
  useFont();
  const { fps } = useVideoConfig();
  const duck = sfxDuck(CUES, fps);
  return (
    <AbsoluteFill style={{ backgroundColor: C.bg }}>
      <Background />
      {GROUPS.map((g) => {
        const first = shotOf(g.shots[0]);
        const last = shotOf(g.shots[g.shots.length - 1]);
        const from = first.from;
        const frames = last.from + last.frames - from;
        const props: SceneProps = {
          at: (n) => shotOf(n).voiceFrom - from,
          end: (n) => shotOf(n).voiceFrom + shotOf(n).voiceFrames - from,
          frames,
        };
        return (
          <Sequence key={g.shots[0]} from={from} durationInFrames={frames} name={`镜头 ${g.shots.join(",")}`}>
            <GroupFrame frames={frames}>
              <g.C {...props} />
            </GroupFrame>
          </Sequence>
        );
      })}
      {CARDS.map((c) => (
        <Sequence key={c.chapter} from={c.from} durationInFrames={c.frames} name={`章节卡 ${c.chapter}`}>
          <ChapterCard card={c} />
        </Sequence>
      ))}
      {SHOTS.map((x) => (
        <Sequence key={x.name} from={x.voiceFrom} durationInFrames={x.voiceFrames + 3} name={x.name} layout="none">
          <Html5Audio src={asset(`voice/${x.name}.mp3`)} />
        </Sequence>
      ))}
      <LowerThird />
      <Disclaimer />
      <Subtitles />
      {SECTIONS.map((sec, i) => (
        <SectionBgm key={i} sec={sec} duck={duck} />
      ))}
      <SfxTrack cues={CUES} speech={SPEECH} />
    </AbsoluteFill>
  );
};
