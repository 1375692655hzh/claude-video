// 动效目录：在 Studio 里逐个看动效库的全部动作（左上角写 ID 和中文名，脚本里按 ID 引用）。
import React from "react";
import { AbsoluteFill, Series, useVideoConfig } from "remotion";
import { Backdrop, Frame, MOTIONS, MotionEntry, MotionFit, MotionTheme, ThemeName, getMotion, motionFrames, useMotionFont, useTheme } from "../_shared/motion";

const Label: React.FC<{ e: MotionEntry; i: number }> = ({ e, i }) => {
  const th = useTheme();
  return (
    <div
      style={{
        position: "absolute",
        left: 40,
        top: 30,
        fontFamily: th.font,
        fontSize: 26,
        fontWeight: 700,
        color: th.ink3,
        display: "flex",
        gap: 16,
        alignItems: "baseline",
      }}
    >
      <span style={{ color: th.blue }}>{String(i + 1)}</span>
      <span style={{ color: th.ink }}>{e.id}</span>
      <span>{e.name} · {e.category}</span>
    </div>
  );
};

/** 单个动效（一个 Composition 一个）。framed=true 时套上参考图那套界面框架，数据类动作缩进左侧内容区 */
export const MotionPreview: React.FC<{ id: string; theme: ThemeName; framed?: boolean; props?: Record<string, unknown> }> = ({ id, theme, framed = true, props = {} }) => {
  useMotionFont();
  const e = getMotion(id);
  return (
    <MotionTheme theme={theme}>
      <AbsoluteFill>
        {framed ? (
          <Frame>
            <MotionFit>
              <e.Component {...props} />
            </MotionFit>
          </Frame>
        ) : (
          <>
            <Backdrop />
            <e.Component {...props} />
          </>
        )}
      </AbsoluteFill>
    </MotionTheme>
  );
};

/** 全部动效连播 */
export const MotionGallery: React.FC<{ theme: ThemeName; framed?: boolean }> = ({ theme, framed = true }) => {
  useMotionFont();
  const { fps } = useVideoConfig();
  return (
    <MotionTheme theme={theme}>
      <AbsoluteFill>
        <Backdrop />
        <Series>
          {MOTIONS.map((e, i) => (
            <Series.Sequence key={e.id} durationInFrames={motionFrames(e.id, fps) + 15}>
              {framed ? (
                <Frame chapterNum={i + 1} chapterName={`${e.id} · ${e.name}`} chapters={MOTIONS.length} done={i} chapterProgress={1}>
                  <MotionFit>
                    <e.Component />
                  </MotionFit>
                </Frame>
              ) : (
                <e.Component />
              )}
              {framed ? null : <Label e={e} i={i} />}
            </Series.Sequence>
          ))}
        </Series>
      </AbsoluteFill>
    </MotionTheme>
  );
};

export const galleryFrames = (fps: number) => MOTIONS.reduce((a, e) => a + motionFrames(e.id, fps) + 15, 0);
