// See all configuration options: https://remotion.dev/docs/config
// Each option also is available as a CLI flag: https://remotion.dev/docs/cli

// Note: When using the Node.JS APIs, the config file doesn't apply. Instead, pass options directly to the APIs

import path from "node:path";
import { Config } from "@remotion/cli/config";

Config.setRspack(true);
Config.setVideoImageFormat("jpeg");
Config.setOverwriteOutput(true);

// ---- 项目模式（projects/YYYY/MM/<ID>/）：由 shared/tools/project.mjs 设置环境变量后启用；旧期不受影响 ----
// CV_PROJECT_DIR：项目根目录；CV_PUBLIC_DIR：该项目合成的 public 目录（library / assets / audio 三个链接）。
// 模块统一从当前运行目录的 node_modules 解析，避免项目代码和公共库各拿到一份 react / remotion。
const projectDir = process.env.CV_PROJECT_DIR;
if (projectDir) {
  if (process.env.CV_PUBLIC_DIR) Config.setPublicDir(process.env.CV_PUBLIC_DIR);
  const nm = path.resolve("node_modules");
  Config.overrideBundlerConfig((c) => ({
    ...c,
    resolve: {
      ...c.resolve,
      alias: {
        ...(c.resolve?.alias as Record<string, string> | undefined),
        "@project": path.join(projectDir, "05-制作", "remotion"),
        "@shared": path.resolve("effects", "_shared"),
      },
      modules: [nm, "node_modules"],
    },
  }));
}
