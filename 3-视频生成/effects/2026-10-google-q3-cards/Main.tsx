// 正片：按 timeline.ts 逐镜排。每个镜头套 cards 主题的界面框架（顶栏、字幕、进度条），
// 内容来自 shots.tsx；左下角数字人圆圈按 segments.json 切回（静音，声音只用 voice/）。
// 还没做的镜头显示占位卡（镜头号 + 口播），方便整片预览节奏。
import React from "react";
import {
  AbsoluteFill,
  Html5Audio,
  Sequence,
  staticFile,
  useCurrentFrame,
} from "remotion";
import { AvatarBubble } from "../_shared/AvatarBubble";
import {
  Frame,
  Heading,
  MotionTheme,
  NoteCard,
  PanelFill,
  useMotionFont,
} from "../_shared/motion";
import { hostFor } from "./host";
import { MARK_SHOTS, SHOT_VIEWS } from "./shots";
import {
  CHAPTER_NAMES,
  FPS,
  LEAD_FRAMES,
  SHOTS,
  SUBS,
  Shot,
  chapterSpan,
} from "./timeline";

const ms = (frames: number) => (frames / FPS) * 1000;

const ShotScene: React.FC<{ s: Shot }> = ({ s }) => {
  const local = useCurrentFrame();
  const abs = s.from + local;
  const [c0, c1] = chapterSpan(s.chapter);
  const sub = SUBS.find((x) => abs >= x.from && abs < x.to);
  const View = SHOT_VIEWS[s.shot];
  return (
    <Frame
      chapterNum={s.chapter}
      chapterName={CHAPTER_NAMES[s.chapter]}
      chapters={10}
      done={s.chapter}
      chapterProgress={(abs - c0) / (c1 - c0)}
      caption={sub?.text}
      mark={MARK_SHOTS.has(s.shot)}
    >
      {View ? (
        <View spanMs={ms(s.frames)} voiceMs={ms(s.voiceFrom - s.from)} />
      ) : (
        <>
          <Heading kicker={`SHOT ${s.shot}`} title="(not built yet)" />
          <NoteCard
            title={`Shot ${s.shot}`}
            sub={s.text ? `${s.text.slice(0, 48)}…` : "silent"}
            at={0}
          />
        </>
      )}
    </Frame>
  );
};

export const GoogleQ3CardsMain: React.FC = () => {
  useMotionFont();
  return (
    <MotionTheme theme="cards">
      <PanelFill>
        <AbsoluteFill>
          {SHOTS.map((s, i) => {
            const prevHasHost =
              i > 0 && hostFor(SHOTS[i - 1].shot, 0, false) !== null;
            const host = hostFor(s.shot, LEAD_FRAMES, !prevHasHost);
            return (
              <Sequence
                key={s.shot}
                from={s.from}
                durationInFrames={s.frames}
                name={`shot ${s.shot}`}
              >
                <ShotScene s={s} />
                {host ? (
                  <Sequence from={host.offset} layout="none">
                    <AvatarBubble {...host.props} />
                  </Sequence>
                ) : null}
                {s.voiceFrames ? (
                  <Sequence from={s.voiceFrom - s.from} layout="none">
                    <Html5Audio
                      src={staticFile(
                        `2026-10-google-q3-cards/voice/${s.shot}.mp3`,
                      )}
                    />
                  </Sequence>
                ) : null}
              </Sequence>
            );
          })}
        </AbsoluteFill>
      </PanelFill>
    </MotionTheme>
  );
};
