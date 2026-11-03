import { AbsoluteFill, Composition, Folder } from "remotion";
import { HostCheck } from "./HostCheck";
import { GoogleQ3CardsMain } from "./Main";
import { FPS, TOTAL_FRAMES } from "./timeline";

// 720p 预览：--scale 2/3 不是整数像素会报错，所以把 1920×1080 的正片缩进 1280×720 画布
const Preview720: React.FC = () => (
  <AbsoluteFill>
    <div style={{ width: 1920, height: 1080, transform: "scale(0.6666667)", transformOrigin: "0 0" }}>
      <GoogleQ3CardsMain />
    </div>
  </AbsoluteFill>
);

// 《Google Q3 2026 Earnings》卡片风版（和 2026-10-google-q3 是两条不同的视频）。正片时长由配音决定；另有数字人圆圈试看
export const GoogleQ3CardsComposition: React.FC = () => (
  <Folder name="2026-10-google-q3-cards">
    <Composition id="2026-10-google-q3-cards" component={GoogleQ3CardsMain} durationInFrames={TOTAL_FRAMES} fps={FPS} width={1920} height={1080} />
    <Composition id="2026-10-google-q3-cards-preview720" component={Preview720} durationInFrames={TOTAL_FRAMES} fps={FPS} width={1280} height={720} />
    {["0.2a", "8.4"].map((shot) => (
      <Composition
        key={shot}
        id={`google-q3-cards-host-${shot.replace(".", "-")}`}
        component={HostCheck}
        durationInFrames={150}
        fps={30}
        width={1920}
        height={1080}
        defaultProps={{ shot, size: 230 }}
      />
    ))}
  </Folder>
);
