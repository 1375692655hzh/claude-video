import { Composition } from "remotion";
import { SFX } from "../_shared/Sfx";
import { GAP, SfxPreview } from "./SfxPreview";

// 在 Studio 里逐个试听常用音效
export const SfxPreviewComposition: React.FC = () => (
  <Composition
    id="sfx-preview"
    component={SfxPreview}
    durationInFrames={Object.keys(SFX).length * GAP}
    fps={30}
    width={1920}
    height={1080}
  />
);
