// 《美国CASPA大会5大财富密码》主时间线：背景 / 镜头 / 章节进度条 / 字幕 / 配音 / BGM。
import React, { useEffect, useState } from "react";
import {
  AbsoluteFill,
  Html5Audio,
  Sequence,
  continueRender,
  delayRender,
  interpolate,
  useCurrentFrame,
} from "remotion";
import { C, FONT, asset, clamp } from "./ui";
import { CHAPTERS, SHOTS, SUBS, Shot, chapterOf } from "./timeline";
import { SCENES } from "./scenes";

export const useFont = () => {
  const [handle] = useState(() => delayRender("load font"));
  useEffect(() => {
    const face = new FontFace("CaspaSans", `url(${asset("fonts/NotoSansSC-VF.ttf")})`, { weight: "100 900" });
    face
      .load()
      .then((f) => {
        document.fonts.add(f);
        continueRender(handle);
      })
      .catch((err) => {
        console.error(err);
        continueRender(handle);
      });
  }, [handle]);
};

const Background: React.FC = () => {
  const frame = useCurrentFrame();
  const drift = (frame * 0.4) % 80;
  return (
    <AbsoluteFill style={{ background: `radial-gradient(ellipse at 30% 20%, ${C.bg2} 0%, ${C.bg} 70%)` }}>
      <AbsoluteFill
        style={{
          backgroundImage: `linear-gradient(${C.line} 1px, transparent 1px), linear-gradient(90deg, ${C.line} 1px, transparent 1px)`,
          backgroundSize: "80px 80px",
          backgroundPosition: `${drift}px ${drift}px`,
          opacity: 0.18,
          maskImage: "radial-gradient(ellipse at center, black 30%, transparent 80%)",
        }}
      />
    </AbsoluteFill>
  );
};

/** 每个镜头淡入淡出 */
const ShotFrame: React.FC<{ s: Shot; children: React.ReactNode }> = ({ s, children }) => {
  const frame = useCurrentFrame();
  const o = Math.min(interpolate(frame, [0, 12], [0, 1], clamp), interpolate(frame, [s.frames - 10, s.frames], [1, 0], clamp));
  return <AbsoluteFill style={{ opacity: o }}>{children}</AbsoluteFill>;
};

const ChapterBar: React.FC = () => {
  const frame = useCurrentFrame();
  const shot = SHOTS.find((s) => frame >= s.from && frame < s.from + s.frames) ?? SHOTS[SHOTS.length - 1];
  const ch = chapterOf(shot.shot);
  const firstFrame = SHOTS[3].from;
  const lastFrame = SHOTS[19].from + SHOTS[19].frames;
  const o = Math.min(
    interpolate(frame, [firstFrame, firstFrame + 20], [0, 1], clamp),
    interpolate(frame, [lastFrame - 10, lastFrame + 10], [1, 0], clamp),
  );
  if (o <= 0) return null;
  return (
    <div
      style={{
        position: "absolute",
        top: 34,
        left: 0,
        right: 0,
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        gap: 18,
        opacity: o,
        fontFamily: FONT,
      }}
    >
      {CHAPTERS.map((name, i) => {
        const active = i + 1 === ch;
        const done = i + 1 < ch;
        return (
          <React.Fragment key={name}>
            {i > 0 ? <div style={{ width: 60, height: 2, background: done || active ? C.cyan : C.gray }} /> : null}
            <div
              style={{
                fontSize: 26,
                fontWeight: active ? 800 : 500,
                color: active ? C.bg : done ? C.cyan : C.muted,
                background: active ? C.cyan : "transparent",
                border: `2px solid ${active || done ? C.cyan : C.gray}`,
                borderRadius: 999,
                padding: "4px 20px",
                boxShadow: active ? `0 0 24px ${C.cyan}88` : "none",
              }}
            >
              {i + 1} {name}
            </div>
          </React.Fragment>
        );
      })}
    </div>
  );
};

const Subtitles: React.FC = () => {
  const frame = useCurrentFrame();
  const sub = SUBS.find((s) => frame >= s.from && frame < s.to);
  if (!sub) return null;
  return (
    <div style={{ position: "absolute", left: 0, right: 0, bottom: 64, display: "flex", justifyContent: "center" }}>
      <div
        style={{
          fontFamily: FONT,
          fontSize: 46,
          fontWeight: 700,
          color: C.white,
          padding: "10px 30px",
          borderRadius: 12,
          background: "rgba(3, 9, 20, 0.62)",
          textShadow: "0 2px 6px rgba(0,0,0,0.8)",
          letterSpacing: 1,
        }}
      >
        {sub.text}
      </div>
    </div>
  );
};

const Brand: React.FC = () => (
  <div
    style={{
      position: "absolute",
      left: 48,
      top: 40,
      display: "flex",
      alignItems: "center",
      gap: 12,
      fontFamily: FONT,
      fontSize: 24,
      fontWeight: 700,
      color: "rgba(244,248,255,0.75)",
    }}
  >
    <div style={{ width: 5, height: 26, background: C.cyan, borderRadius: 3 }} />
    Andy港美观察
  </div>
);

// 计算与关键判断处压低音乐
const QUIET_SHOTS = new Set([7, 12, 15, 20]);

export const CaspaMain: React.FC = () => {
  useFont();
  return (
    <AbsoluteFill style={{ backgroundColor: C.bg }}>
      <Background />
      {SHOTS.map((s) => {
        const Scene = SCENES[s.shot];
        return (
          <Sequence key={s.shot} from={s.from} durationInFrames={s.frames} name={`镜头${s.shot}`}>
            <ShotFrame s={s}>
              <Scene s={s} />
            </ShotFrame>
            {s.lines.map((l) => (
              <Sequence key={l.name} from={l.from} durationInFrames={l.frames + 5} name={l.name} layout="none">
                <Html5Audio src={asset(`voice/${l.name}.mp3`)} />
              </Sequence>
            ))}
          </Sequence>
        );
      })}
      <ChapterBar />
      <Brand />
      <Subtitles />
      <Html5Audio
        src={asset("bgm.mp3")}
        volume={(f) => {
          const s = SHOTS.find((x) => f >= x.from && f < x.from + x.frames);
          const base = s && QUIET_SHOTS.has(s.shot) ? 0.07 : 0.13;
          return base * interpolate(f, [0, 45], [0, 1], clamp);
        }}
      />
    </AbsoluteFill>
  );
};
