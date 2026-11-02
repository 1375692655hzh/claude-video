// 批量截帧：打包一次，按帧号出多张静帧（自查用）。
// 先 npx remotion bundle --out-dir out/bundle（走 remotion.config.ts 的 Rspack），改了代码要重新打包。
// 用法：node tools/stills.mjs <composition-id> <输出目录> <帧号,帧号,...|@frames.json> [--scale 0.5]
// frames.json 可以是 [{ name, frame }] 或帧号数组；输出 <输出目录>/<name 或帧号>.png
import { renderStill, selectComposition } from "@remotion/renderer";
import fs from "node:fs";
import path from "node:path";

const [id, outDir, list, ...rest] = process.argv.slice(2);
if (!id || !outDir || !list) {
  console.error("用法：node tools/stills.mjs <composition-id> <输出目录> <帧号,...|@frames.json> [--scale 0.5]");
  process.exit(1);
}
const si = rest.indexOf("--scale");
const scale = si >= 0 ? Number(rest[si + 1]) : 0.5;
const items = (list.startsWith("@") ? JSON.parse(fs.readFileSync(list.slice(1), "utf8")) : list.split(",").map(Number)).map((x) =>
  typeof x === "number" ? { name: String(x), frame: x } : x,
);

fs.mkdirSync(outDir, { recursive: true });
const serveUrl = path.resolve("out/bundle");
const composition = await selectComposition({ serveUrl, id });
for (const it of items) {
  await renderStill({ serveUrl, composition, frame: it.frame, output: path.join(outDir, `${it.name}.png`), scale, logLevel: "error" });
  process.stdout.write(".");
}
console.log(`\n${items.length} 张 → ${outDir}`);
