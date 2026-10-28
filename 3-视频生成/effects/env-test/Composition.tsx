import { Composition } from "remotion";
import { EnvTest } from "./EnvTest";

// Composition id 与文件夹名保持一致（只能用字母、数字、连字符）
export const EnvTestComposition: React.FC = () => (
  <Composition
    id="env-test"
    component={EnvTest}
    durationInFrames={90}
    fps={30}
    width={1280}
    height={720}
    defaultProps={{
      label: "Remotion OK",
      color: "#38bdf8",
    }}
  />
);
