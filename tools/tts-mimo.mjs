// 用小米 MiMo TTS 生成配音，默认音色"冰糖"。
// 用法：npm run tts -- <文本 或 .txt 文件> <输出文件.mp3|.wav> [--voice 冰糖] [--style "语气说明"]
// 例：npm run tts -- "欢迎来到科技小站" public/intro/voice-01.mp3
// Key 从环境变量 MIMO_API_KEY 读取（setx MIMO_API_KEY "sk-..."）。
// 接口文档：https://mimo.mi.com/docs/zh-CN/api/audio/tts

import { mkdir, readFile, writeFile } from "node:fs/promises";
import { existsSync } from "node:fs";
import path from "node:path";

const ENDPOINT = "https://api.xiaomimimo.com/v1/chat/completions";
const MODEL = "mimo-v2.5-tts";

function fail(msg) {
  console.error("✖ " + msg);
  process.exit(1);
}

const args = process.argv.slice(2);
const opts = { voice: "冰糖", style: "" };
const positional = [];
for (let i = 0; i < args.length; i++) {
  if (args[i] === "--voice") opts.voice = args[++i];
  else if (args[i] === "--style") opts.style = args[++i];
  else positional.push(args[i]);
}
const [input, out] = positional;

const key = process.env.MIMO_API_KEY;
if (!key) {
  fail(
    "没有找到环境变量 MIMO_API_KEY。\n" +
      '请在 PowerShell 运行：setx MIMO_API_KEY "你的key"，然后关闭并重新打开终端。',
  );
}
if (!input || !out) fail('用法：npm run tts -- "要读的文字" public/<动画名>/voice.mp3');

const text = input.endsWith(".txt") && existsSync(input) ? (await readFile(input, "utf8")).trim() : input;
const format = path.extname(out).slice(1).toLowerCase() || "mp3";
if (!["mp3", "wav"].includes(format)) fail("输出文件扩展名只支持 .mp3 或 .wav");

// 合成的文字放在 assistant 消息里；user 消息可选，用来描述语气风格
const messages = [];
if (opts.style) messages.push({ role: "user", content: opts.style });
messages.push({ role: "assistant", content: text });

const res = await fetch(ENDPOINT, {
  method: "POST",
  headers: { "Content-Type": "application/json", Authorization: `Bearer ${key}` },
  body: JSON.stringify({ model: MODEL, messages, audio: { format, voice: opts.voice } }),
});
const body = await res.text();
if (!res.ok) fail(`接口返回 HTTP ${res.status}：${body.slice(0, 300)}`);

const choice = JSON.parse(body).choices?.[0];
const data = choice?.message?.audio?.data;
if (!data) fail(`没有拿到音频（finish_reason=${choice?.finish_reason}）：${body.slice(0, 300)}`);

const outPath = path.resolve(out);
await mkdir(path.dirname(outPath), { recursive: true });
await writeFile(outPath, Buffer.from(data, "base64"));
console.log(`✔ 已保存：${path.relative(process.cwd(), outPath)}（音色 ${opts.voice}，${text.length} 字）`);
