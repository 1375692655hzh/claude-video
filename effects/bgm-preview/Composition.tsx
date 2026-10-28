import { Composition } from "remotion";
import { BgmPreview } from "./BgmPreview";

// 在 Studio 右侧改 track（配乐库 id）和 seconds（片长）试听
export const BgmPreviewComposition: React.FC = () => (
  <Composition
    id="bgm-preview"
    component={BgmPreview}
    durationInFrames={300 * 30}
    fps={30}
    width={1920}
    height={1080}
    defaultProps={{ track: "bgm-tech-steady", seconds: 300 }}
    calculateMetadata={({ props }) => ({ durationInFrames: Math.round(props.seconds * 30) })}
  />
);
