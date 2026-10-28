// 动画注册表：每个动画放在 effects/<名称>/ 下，并导出一个 <XxxComposition />。
// 新增动画时：在这里 import，并加到下面的列表里，Studio 左侧就会出现。
import { EnvTestComposition } from "./env-test/Composition";
import { CaspaAiProfitComposition } from "./caspa-ai-profit/Composition";
import { AvatarHostDemoComposition } from "./avatar-host-demo/Composition";
import { BgmPreviewComposition } from "./bgm-preview/Composition";
import { SfxPreviewComposition } from "./sfx-preview/Composition";

export const EffectCompositions: React.FC = () => (
  <>
    <EnvTestComposition />
    <CaspaAiProfitComposition />
    <AvatarHostDemoComposition />
    <BgmPreviewComposition />
    <SfxPreviewComposition />
  </>
);
