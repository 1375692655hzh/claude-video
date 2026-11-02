import { Composition } from "remotion";
import { ContactSheet } from "./ContactSheet";
import { GoogleQ3Main } from "./Main";
import { FPS, TOTAL_FRAMES } from "./timeline";

// 《Alphabet Q3: Cloud Doubled, Yet Free Cash Flow Went Negative》时长由配音决定
export const GoogleQ3Composition: React.FC = () => (
  <>
    <Composition id="2026-10-google-q3" component={GoogleQ3Main} durationInFrames={TOTAL_FRAMES} fps={FPS} width={1920} height={1080} />
    {/* 关键帧预览（只渲染静帧）；时长和正片一样，音效规范检查才不会误报 */}
    <Composition
      id="2026-10-google-q3-sheet"
      component={ContactSheet}
      durationInFrames={TOTAL_FRAMES}
      fps={FPS}
      width={1920}
      height={1080}
      defaultProps={{ frames: [60, 476, 1290] }}
    />
  </>
);
