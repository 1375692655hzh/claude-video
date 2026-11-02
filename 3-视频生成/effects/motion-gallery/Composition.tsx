import { Composition, Folder } from "remotion";
import { MOTIONS, motionFrames } from "../_shared/motion";
import { MotionGallery, MotionPreview, galleryFrames } from "./Gallery";

const FPS = 30;

// 动效库目录：motion-gallery 连播全部动作；motion-<id> 单独预览，右侧 Props 面板可改 theme 和内容
export const MotionGalleryComposition: React.FC = () => (
  <Folder name="motion-library">
    <Composition id="motion-gallery" component={MotionGallery} durationInFrames={galleryFrames(FPS)} fps={FPS} width={1920} height={1080} defaultProps={{ theme: "cards" as const }} />
    <Composition id="motion-gallery-navy" component={MotionGallery} durationInFrames={galleryFrames(FPS)} fps={FPS} width={1920} height={1080} defaultProps={{ theme: "navy" as const }} />
    {MOTIONS.map((e) => (
      <Composition
        key={e.id}
        id={`motion-${e.id}`}
        component={MotionPreview}
        durationInFrames={motionFrames(e.id, FPS)}
        fps={FPS}
        width={1920}
        height={1080}
        defaultProps={{ id: e.id, theme: "cards" as const, framed: true, props: {} as Record<string, unknown> }}
      />
    ))}
  </Folder>
);
