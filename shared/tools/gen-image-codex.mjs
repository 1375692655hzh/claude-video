// 用 Codex CLI 内置的生图工具（ChatGPT 账号登录，image_generation 功能）生成图片，和 gen-image-qwen.mjs 并列。
// 用法：npm run image-codex -- <提示词或 .txt 文件> <输出文件.png> [--n 2]
// 例：npm run image-codex -- prompts/A.txt 2026-10-google-q3/cover/A-en-codex.png --n 2
// 原理：在输出目录里起一个 codex exec 会话，只让它调生图工具并把图存成指定文件名；
// 如果它没存成功，就从 ~/.codex/generated_images 里取本次新生成的图。一张约 1–2 分钟，n 张按顺序生成。
// 2026-10-29 实测：输出 1672×941（16:9），英文大字和数字准确。

import { spawnSync } from "node:child_process";
import { copyFile, mkdir, readFile, readdir, stat } from "node:fs/promises";
import { existsSync } from "node:fs";
import os from "node:os";
import path from "node:path";

function fail(msg) {
  console.error("✖ " + msg);
  process.exit(1);
}

const args = process.argv.slice(2);
let n = 1;
const positional = [];
for (let i = 0; i < args.length; i++) {
  if (args[i] === "--n") n = Number(args[++i]);
  else positional.push(args[i]);
}
const [promptArg, out] = positional;
if (!promptArg || !out) fail('用法：npm run image-codex -- <提示词或 .txt 文件> <输出文件.png> [--n 2]');
if (!(n >= 1 && n <= 6)) fail("--n 取 1–6");

const brief = existsSync(promptArg) ? await readFile(promptArg, "utf8") : promptArg;
const outPath = path.resolve(out);
const dir = path.dirname(outPath);
await mkdir(dir, { recursive: true });
const ext = path.extname(outPath) || ".png";
const base = path.basename(outPath, ext);
const genRoot = path.join(os.homedir(), ".codex", "generated_images");

// 找 since 之后 ~/.codex/generated_images 里新出现的图片
async function newestGenerated(since) {
  if (!existsSync(genRoot)) return null;
  let best = null;
  for (const session of await readdir(genRoot)) {
    const sdir = path.join(genRoot, session);
    if (!(await stat(sdir)).isDirectory()) continue;
    for (const f of await readdir(sdir)) {
      const p = path.join(sdir, f);
      const s = await stat(p);
      if (s.mtimeMs >= since && (!best || s.mtimeMs > best.t)) best = { p, t: s.mtimeMs };
    }
  }
  return best?.p ?? null;
}

for (let i = 0; i < n; i++) {
  const name = n === 1 ? `${base}${ext}` : `${base}-${i + 1}${ext}`;
  const target = path.join(dir, name);
  const instruction =
    "Use your built-in image generation tool to create exactly one image from the brief below. " +
    "Do not draw it with code, HTML or any other tool, and do not change any other file. " +
    `Save the generated image in the current directory as ${name}, then reply with only the file name.\n\n--- BRIEF ---\n${brief}`;
  const started = Date.now();
  console.log(`… 生成 ${name}（Codex，约 1–2 分钟）`);
  const r = spawnSync("codex", ["exec", "--skip-git-repo-check", "-s", "workspace-write", "-"], {
    cwd: dir,
    input: instruction,
    encoding: "utf8",
    shell: process.platform === "win32", // codex 在 Windows 上是 .cmd
    timeout: 10 * 60 * 1000,
    maxBuffer: 64 * 1024 * 1024,
  });
  if (r.error) fail(`codex 启动失败：${r.error.message}（先确认 codex login status 已登录）`);
  if (!existsSync(target) || (await stat(target)).mtimeMs < started) {
    const fallback = await newestGenerated(started);
    if (!fallback) fail(`没有拿到图片。codex 输出末尾：\n${(r.stdout + r.stderr).slice(-1500)}`);
    await copyFile(fallback, target);
  }
  console.log(`✔ 已保存：${path.relative(process.cwd(), target)}`);
}
