import { Folder } from "remotion";
import { EffectCompositions } from "../effects";

// 所有动画都在 effects/ 中注册，这里只负责挂载。
export const RemotionRoot: React.FC = () => {
  return (
    <Folder name="effects">
      <EffectCompositions />
    </Folder>
  );
};
