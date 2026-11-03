// 项目模式入口：只挂载一个独立项目（projects/YYYY/MM/<ID>/05-制作/remotion/Composition.tsx）。
// 不要直接用：由 `npm run project -- studio|render <ID>` 设置 CV_PROJECT_DIR / CV_PUBLIC_DIR 后启动。
// 旧期仍走 src/index.ts（effects/ 注册表），两者互不影响。
import { registerRoot } from "remotion";
import { ProjectRoot } from "./ProjectRoot";

registerRoot(ProjectRoot);
