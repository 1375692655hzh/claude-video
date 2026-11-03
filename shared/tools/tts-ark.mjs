// 用火山方舟 Agent Plan 的豆包语音合成 2.0（doubao-seed-tts-2.0）生成配音，默认音色 Tim（美式英语男声）。
// 用法：npm run tts-ark -- <文本 或 .txt 文件> <输出文件.mp3|.wav> [--voice en_male_tim_uranus_bigtts] [--speed 0] [--style "语气说明"]
// 例：npm run tts-ark -- "Welcome back to the channel." public/intro/voice-01.mp3 --voice en_male_marcus_uranus_bigtts
// Key 从环境变量 ARK_PLAN_API_KEY 读取（Agent Plan 专属 API Key，setx ARK_PLAN_API_KEY "ark-..."）。
// 接口文档：https://ark.volcengine.com/region:cn-beijing/docs/agent-plan-personal-voice-model.md
// 音色列表：https://docs.volcengine.com/docs/doubao-voice/tone-list-3 （要用 *_uranus_* 的 2.0 音色）

import { mkdir, readFile, writeFile } from "node:fs/promises";
import { existsSync } from "node:fs";
import { randomUUID } from "node:crypto";
import path from "node:path";

const ENDPOINT = "https://openspeech.bytedance.com/api/v3/plan/tts/unidirectional";
const RESOURCE_ID = "seed-tts-2.0";

function fail(msg) {
  console.error("✖ " + msg);
  process.exit(1);
}

const args = process.argv.slice(2);
const opts = { voice: "en_male_tim_uranus_bigtts", speed: 0, style: "" };
const positional = [];
for (let i = 0; i < args.length; i++) {
  if (args[i] === "--voice") opts.voice = args[++i];
  else if (args[i] === "--speed") opts.speed = Number(args[++i]);
  else if (args[i] === "--style") opts.style = args[++i];
  else positional.push(args[i]);
}
const [input, out] = positional;

const key = process.env.ARK_PLAN_API_KEY || process.env.VOLC_TTS_ACCESS_TOKEN;
if (!key) {
  fail(
    "没有找到环境变量 ARK_PLAN_API_KEY。\n" +
      '请在 PowerShell 运行：setx ARK_PLAN_API_KEY "你的key"，然后关闭并重新打开终端。',
  );
}
if (!input || !out) fail('用法：npm run tts-ark -- "要读的文字" public/<动画名>/voice.mp3');

const text = input.endsWith(".txt") && existsSync(input) ? (await readFile(input, "utf8")).trim() : input;
const format = path.extname(out).slice(1).toLowerCase() || "mp3";
if (!["mp3", "wav"].includes(format)) fail("输出文件扩展名只支持 .mp3 或 .wav");

// speech_rate：-50（0.5 倍速）到 100（2 倍速），0 为正常
const reqParams = {
  text,
  speaker: opts.voice,
  audio_params: { format, sample_rate: 24000, speech_rate: opts.speed },
};
// 语气说明只对标"指令遵循"的音色有效，写进 additions.context_texts
if (opts.style) reqParams.additions = JSON.stringify({ context_texts: [opts.style] });

const res = await fetch(ENDPOINT, {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
    "X-Api-Key": key,
    "X-Api-Resource-Id": RESOURCE_ID,
    "X-Api-Request-Id": randomUUID(),
  },
  body: JSON.stringify({ req_params: reqParams }),
});
const logid = res.headers.get("x-tt-logid") ?? "";
const body = await res.text();
if (!res.ok) fail(`接口返回 HTTP ${res.status}（logid ${logid}）：${body.slice(0, 300)}`);

// 返回的是逐行 JSON：每行 data 是一段 base64 音频，code 20000000 表示结束
const chunks = [];
let usage;
for (const line of body.split("\n")) {
  if (!line.trim()) continue;
  const msg = JSON.parse(line);
  if (msg.code && msg.code !== 20000000) fail(`合成失败（logid ${logid}）：${line.slice(0, 300)}`);
  if (msg.data) chunks.push(Buffer.from(msg.data, "base64"));
  if (msg.usage) usage = msg.usage;
}
if (!chunks.length) fail(`没有拿到音频（logid ${logid}）：${body.slice(0, 300)}`);

const outPath = path.resolve(out);
await mkdir(path.dirname(outPath), { recursive: true });
await writeFile(outPath, Buffer.concat(chunks));
console.log(
  `✔ 已保存：${path.relative(process.cwd(), outPath)}（音色 ${opts.voice}，${text.length} 字符` +
    (usage ? `，用量 ${JSON.stringify(usage)}` : "") +
    "）",
);
