import { Composition, staticFile } from "remotion";
import { AvatarHostDemo } from "./AvatarHostDemo";

// 时长取自 tools/avatar-host.mjs 写的 job.json（主持人视频多长，动画就多长）
export const AvatarHostDemoComposition: React.FC = () => (
  <Composition
    id="avatar-host-demo"
    component={AvatarHostDemo}
    durationInFrames={300}
    fps={30}
    width={1920}
    height={1080}
    defaultProps={{ src: "avatar-host-demo/host/host.mp4", pipAt: 120 }}
    calculateMetadata={async () => {
      const job = await fetch(staticFile("avatar-host-demo/host/job.json")).then((r) => r.json());
      return { durationInFrames: job.result.frames30 as number };
    }}
  />
);
