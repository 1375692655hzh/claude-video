import { Html5Audio, Sequence, staticFile, useVideoConfig } from "remotion";
import { SFX, SfxName } from "./sfx-library";
import { SfxCue, checkSfxCues, cueRange, cueVolume } from "./sfx-rules";

export { SFX } from "./sfx-library";
export type { SfxName } from "./sfx-library";

// 单个音效。只给试听页（sfx-preview）这类场合用；正式视频一律用下面的 SfxTrack，才会经过规范检查。
export const Sfx: React.FC<{ name: SfxName; at?: number; endAt?: number; volume?: number; fps?: number }> = ({
  name,
  at,
  endAt,
  volume,
  fps = 30,
}) => {
  const [from, to] = cueRange({ name, at, endAt }, fps);
  return (
    <Sequence from={Math.max(0, from)} durationInFrames={to - from} layout="none">
      <Html5Audio src={staticFile(SFX[name].file)} volume={volume ?? SFX[name].volume} />
    </Sequence>
  );
};

// 一个视频的全部音效集中登记在这里：先按 sfx-rules.ts 的规范检查，不合规直接报错（Studio 和渲染都会停下并列出问题），
// 合规的按规范播放（和人声重叠的自动减半）。背景音乐配合用 <Bgm duck={sfxDuck(cues, fps)} />。
//   const CUES: SfxCue[] = [{ name: "whoosh-slow", at: 300 }, { name: "riser", endAt: 900 }, { name: "impact", at: 900 }];
//   <SfxTrack cues={CUES} speech={SPEECH} />
export const SfxTrack: React.FC<{ cues: SfxCue[]; speech?: [number, number][] }> = ({ cues, speech = [] }) => {
  const { fps, durationInFrames } = useVideoConfig();
  const problems = checkSfxCues(cues, { fps, durationInFrames, speech });
  if (problems.length > 0) {
    throw new Error(
      `音效不符合使用规范（共 ${problems.length} 处，规则见 effects/_shared/sfx-rules.ts）：\n` +
        problems.map((p) => `- 第 ${p.frame} 帧：${p.message}`).join("\n") +
        `\n确实需要破例的，在该音效上写 allow: "理由"。`,
    );
  }
  return (
    <>
      {cues.map((c, i) => {
        const [from, to] = cueRange(c, fps);
        return (
          <Sequence key={i} from={Math.max(0, from)} durationInFrames={to - from} layout="none">
            <Html5Audio src={staticFile(SFX[c.name].file)} volume={cueVolume(c, fps, speech)} />
          </Sequence>
        );
      })}
    </>
  );
};
