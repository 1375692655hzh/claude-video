import { Folder } from "remotion";
// "@project" 在项目模式下由 remotion.config.ts 映射到当前项目的 05-制作/remotion/；
// 类型检查时映射到 src/project-stub/（见 tsconfig.json 的 paths）。
import { ProjectCompositions } from "@project/Composition";

export const ProjectRoot: React.FC = () => (
  <Folder name="project">
    <ProjectCompositions />
  </Folder>
);
