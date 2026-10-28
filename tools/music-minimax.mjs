// 用 MiniMax 音乐模型生成配乐（默认纯音乐、music-3.0）。
// 用法：npm run music -- "风格描述" <输出.mp3> [--lyrics "歌词或 .txt"] [--model music-3.0]
// 例：npm run music -- "科技感电子乐，稳定推进，适合财经解说背景，无人声" public/library/music/tech.mp3
// Key 从环境变量 MINIMAX_API_KEY 读取（setx MINIMAX_API_KEY "sk-..."）。
// 接口文档：https://platform.minimax.cn/docs/api-reference/music-generation

import { mkdir, readFile, writeFile } from "node:fs/promises";
import { existsSync } from "node:fs";
import path from "node:path";

// 可用环境变量 MINIMAX_BASE_URL 覆盖（例如 https://api.minimaxi.com/v1）
const ENDPOINT = `${process.env.MINIMAX_BASE_URL ?? "https://api.minimax.cn/v1"}/music_generation`;

function fail(msg) {
  console.error("✖ " + msg);
  process.exit(1);
}

const args = process.argv.slice(2);
const opts = { model: "music-3.0", lyrics: "" };
const positional = [];
for (let i = 0; i < args.length; i++) {
  if (args[i] === "--model") opts.model = args[++i];
  else if (args[i] === "--lyrics") opts.lyrics = args[++i];
  else positional.push(args[i]);
}
const [prompt, out] = positional;

const key = process.env.MINIMAX_API_KEY;
if (!key) {
  fail(
    "没有找到环境变量 MINIMAX_API_KEY。\n" +
      '请在 PowerShell 运行：setx MINIMAX_API_KEY "你的key"，然后关闭并重新打开终端。',
  );
}
if (!prompt || !out) fail('用法：npm run music -- "风格描述" public/library/music/xxx.mp3 [--lyrics "歌词"]');

const lyrics =
  opts.lyrics.endsWith(".txt") && existsSync(opts.lyrics) ? (await readFile(opts.lyrics, "utf8")).trim() : opts.lyrics;

// 不给歌词就生成纯音乐
const body = {
  model: opts.model,
  prompt,
  ...(lyrics ? { lyrics } : { is_instrumental: true }),
  audio_setting: { sample_rate: 44100, bitrate: 256000, format: "mp3" },
  output_format: "hex",
};

const started = Date.now();
const res = await fetch(ENDPOINT, {
  method: "POST",
  headers: { "Content-Type": "application/json", Authorization: `Bearer ${key}` },
  body: JSON.stringify(body),
});
const text = await res.text();
if (!res.ok) fail(`接口返回 HTTP ${res.status}：${text.slice(0, 300)}`);

const json = JSON.parse(text);
if (json.base_resp?.status_code) fail(`生成失败（${json.base_resp.status_code}）：${json.base_resp.status_msg}`);
const hex = json.data?.audio;
if (!hex) fail(`没有拿到音频：${text.slice(0, 300)}`);

const outPath = path.resolve(out);
await mkdir(path.dirname(outPath), { recursive: true });
await writeFile(outPath, Buffer.from(hex, "hex"));
const sec = json.extra_info?.music_duration ? (json.extra_info.music_duration / 1000).toFixed(1) : "?";
console.log(
  `✔ 已保存：${path.relative(process.cwd(), outPath)}（${opts.model}，${sec} 秒，用时 ${Math.round((Date.now() - started) / 1000)} 秒）`,
);
