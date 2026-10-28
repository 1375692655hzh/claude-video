// 请电脑上的 agy（Antigravity CLI，可选 Gemini 等模型）给第二意见，只读，不改任何文件。
// 用法：node shared/tools/consult-agy.mjs <问题 或 问题.md> --out 回答.md [--file 文件 ...] [--model gemini-4-argon-high] [--timeout 600]
// 例（第 1 步爆款优化）：
//   npm run consult -- ../1-视频稿/platforms/consult/爆款优化-提问.md --file <期名>/02-爆款优化.md
//     --file platforms/youtube-long.md --out <期名>/02b-agy建议.md
// 附带的文件不塞进命令行（Windows 命令行有长度上限），而是把所在目录加进 agy 的工作区，让它自己读。

import { existsSync } from "node:fs";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import { spawnSync } from "node:child_process";
import os from "node:os";
import path from "node:path";

const AGY = process.env.AGY_BIN || path.join(os.homedir(), "AppData", "Local", "agy", "bin", "agy.exe");

function fail(msg) {
  console.error("✖ " + msg);
  process.exit(1);
}

const args = process.argv.slice(2);
const opts = { files: [], model: "gemini-4-argon-high", timeout: "600", out: "" };
const positional = [];
for (let i = 0; i < args.length; i++) {
  if (args[i] === "--file") opts.files.push(args[++i]);
  else if (args[i] === "--model") opts.model = args[++i];
  else if (args[i] === "--timeout") opts.timeout = args[++i];
  else if (args[i] === "--out") opts.out = args[++i];
  else positional.push(args[i]);
}
const [question] = positional;
if (!question || !opts.out) fail("用法：consult-agy.mjs <问题 或 问题.md> --out 回答.md [--file 文件 ...] [--model ...]");
if (!existsSync(AGY)) fail(`找不到 agy：${AGY}（可用环境变量 AGY_BIN 指定）`);

const ask = question.endsWith(".md") && existsSync(question) ? await readFile(question, "utf8") : question;
const files = opts.files.map((f) => {
  if (!existsSync(f)) fail(`找不到附带文件：${f}`);
  return path.resolve(f);
});
const dirs = [...new Set(files.map((f) => path.dirname(f)))];

const prompt = [
  "你是被请来给第二意见的顾问。只读：不要修改、创建或删除任何文件，不要运行会改动环境的命令。",
  files.length ? `先完整读完这些文件：\n${files.map((f) => `- ${f}`).join("\n")}` : "",
  "然后回答下面的问题。用中文，直接给具体、可执行的建议；指出原文问题时引用原句；不要客套和总结性空话。",
  "",
  ask,
].join("\n");

const cliArgs = ["-p", prompt, "--mode", "plan", "--model", opts.model, "--print-timeout", `${opts.timeout}s`];
for (const d of dirs) cliArgs.push("--add-dir", d);

console.log(`… 正在询问 agy（${opts.model}），通常 1–5 分钟`);
const started = Date.now();
const r = spawnSync(AGY, cliArgs, { encoding: "utf8", maxBuffer: 32 * 1024 * 1024 });
if (r.error) fail(`调用 agy 失败：${r.error.message}`);
const answer = (r.stdout || "").trim();
if (r.status !== 0 || !answer) fail(`agy 没有给出回答（退出码 ${r.status}）：${(r.stderr || "").trim().slice(0, 300)}`);

const header = `<!-- agy ${opts.model} · ${new Date().toISOString().slice(0, 16).replace("T", " ")} · 用时 ${Math.round((Date.now() - started) / 1000)} 秒 -->\n\n`;
await mkdir(path.dirname(path.resolve(opts.out)), { recursive: true });
await writeFile(opts.out, header + answer + "\n", "utf8");
console.log(`✔ 已保存：${opts.out}（${answer.length} 字）`);
