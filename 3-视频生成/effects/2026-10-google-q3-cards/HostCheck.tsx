// 数字人圆圈试看：单个镜头套本期界面框架（cards 主题），左下角放 host.mp4 里对应那一段（静音，声音只用 voice/ 的配音），
// 用来检查圆圈位置、大小、和底部字幕条的距离、脸是否对准圆心。正式时间轴做好后由 Main.tsx 取代。
import React from "react";
import { AbsoluteFill, staticFile } from "remotion";
import { Frame, FootageStat, Heading, MotionTheme, useMotionFont } from "../_shared/motion";
import { HOST_FOCUS, HOST_SRC, hostStart } from "./host";

type Shot = {
  chapterNum: number;
  chapterName: string;
  caption: string;
  kicker: string;
  title: string;
  src: string;
  imgCaption: string;
  statKicker: string;
  value: string;
  sub: string;
  tone: "teal" | "red" | "amber" | "blue" | "ink" | "muted";
  extra: { label: string; value: string }[];
};

const SHOTS: Record<string, Shot> = {
  "0.2a": {
    chapterNum: 0,
    chapterName: "Cold open",
    caption: "Google just handed investors three pieces of good news.",
    kicker: "GOOD NEWS #1",
    title: "Cloud revenue doubled",
    src: "2026-10-google-q3-cards/img/G04.jpg",
    imgCaption: "New Albany, Ohio · Image: Google",
    statKicker: "GOOGLE CLOUD · Q3",
    value: "+103%",
    sub: "revenue growth, year over year",
    tone: "teal",
    extra: [
      { label: "Revenue", value: "$30.7B" },
      { label: "Margin", value: "36.2%" },
    ],
  },
  "8.4": {
    chapterNum: 8,
    chapterName: "What's next",
    caption: "My take: in the near term, expect analysts to cut earnings estimates,",
    kicker: "MY TAKE",
    title: "A bounce ≠ a reversal",
    src: "2026-10-google-q3-cards/video/P06.mp4",
    imgCaption: "Video: Pexels",
    statKicker: "NEAR TERM",
    value: "Estimates likely cut",
    sub: "stock may need time to build a base",
    tone: "amber",
    extra: [
      { label: "Watch zone", value: "< ~20× fwd P/E" },
      { label: "Condition", value: "inventory → cash" },
    ],
  },
};

export const HostCheck: React.FC<{ shot: string; size?: number }> = ({ shot, size = 230 }) => {
  useMotionFont();
  const s = SHOTS[shot];
  const start = hostStart(shot);
  return (
    <MotionTheme theme="cards">
      <AbsoluteFill>
        <Frame
          chapterNum={s.chapterNum}
          chapterName={s.chapterName}
          chapters={10}
          done={s.chapterNum}
          chapterProgress={0.3}
          caption={s.caption}
          host={start === null ? undefined : { src: HOST_SRC, ...HOST_FOCUS, size, muted: true, trimBefore: start }}
        >
          <Heading kicker={s.kicker} title={s.title} />
          <FootageStat
            src={staticFile(s.src)}
            caption={s.imgCaption}
            kicker={s.statKicker}
            value={s.value}
            sub={s.sub}
            tone={s.tone}
            extra={s.extra}
          />
        </Frame>
      </AbsoluteFill>
    </MotionTheme>
  );
};
