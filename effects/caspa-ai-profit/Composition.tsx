import { Composition, Still } from "remotion";
import { CaspaCover } from "./Cover";
import { CaspaMain } from "./Main";
import { FPS, TOTAL_FRAMES } from "./timeline";

// 《美国CASPA大会5大财富密码！英伟达的对手，竟是最大客户？》时长由配音决定
export const CaspaAiProfitComposition: React.FC = () => (
  <>
    <Composition
      id="caspa-ai-profit"
      component={CaspaMain}
      durationInFrames={TOTAL_FRAMES}
      fps={FPS}
      width={1920}
      height={1080}
    />
    <Still id="caspa-ai-profit-cover" component={CaspaCover} width={1920} height={1080} />
  </>
);
