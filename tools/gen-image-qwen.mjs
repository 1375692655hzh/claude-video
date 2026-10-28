// 用阿里百炼 qwen-image-3.0-pro 生成图片（Token Plan）。
// 用法：npm run image -- "<提示词>" <输出文件.png> [--size 1920*1080] [--n 1] [--negative "不要的元素"]
//                       [--image 参考图.png ...（最多 3 张，传了就是改图）] [--no-rewrite]
// 例：npm run image -- "深蓝科技感背景，青色光线" public/intro/bg.png --size 1920*1080
// Key 从环境变量 DASHSCOPE_API_KEY 读取（setx DASHSCOPE_API_KEY "sk-sp-..."）。
// Token Plan 走百炼原生接口；compatible-mode/v1/images/generations 不可用（返回 url error）。

import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";

const ENDPOINT =
  "https://token-plan.cn-beijing.maas.aliyuncs.com/api/v1/services/aigc/multimodal-generation/generation";
const MODEL = "qwen-image-3.0-pro";

function fail(msg) {
  console.error("✖ " + msg);
  process.exit(1);
}

const args = process.argv.slice(2);
const opts = { size: "1024*1024", n: 1, negative: "", images: [], rewrite: true };
const positional = [];
for (let i = 0; i < args.length; i++) {
  const a = args[i];
  if (a === "--size") opts.size = args[++i].replace(/x/i, "*");
  else if (a === "--n") opts.n = Number(args[++i]);
  else if (a === "--negative") opts.negative = args[++i];
  else if (a === "--image") opts.images.push(args[++i]);
  else if (a === "--no-rewrite") opts.rewrite = false;
  else positional.push(a);
}
const [prompt, out] = positional;

const key = process.env.DASHSCOPE_API_KEY;
if (!key) {
  fail(
    "没有找到环境变量 DASHSCOPE_API_KEY。\n" +
      '请在 PowerShell 运行：setx DASHSCOPE_API_KEY "你的key"，然后关闭并重新打开终端。',
  );
}
if (!prompt || !out) fail('用法：npm run image -- "提示词" public/<动画名>/xxx.png [--size 1920*1080]');
if (opts.images.length > 3) fail("参考图最多 3 张");

const mime = { ".png": "image/png", ".jpg": "image/jpeg", ".jpeg": "image/jpeg", ".webp": "image/webp" };
const content = [];
for (const p of opts.images) {
  const type = mime[path.extname(p).toLowerCase()] || "image/png";
  content.push({ image: `data:${type};base64,${(await readFile(p)).toString("base64")}` });
}
content.push({ text: prompt });

const parameters = { size: opts.size, n: opts.n, prompt_extend: opts.rewrite };
if (opts.negative) parameters.negative_prompt = opts.negative;

const res = await fetch(ENDPOINT, {
  method: "POST",
  headers: { "Content-Type": "application/json", Authorization: `Bearer ${key}` },
  body: JSON.stringify({ model: MODEL, input: { messages: [{ role: "user", content }] }, parameters }),
});
const body = await res.text();
if (!res.ok) fail(`接口返回 HTTP ${res.status}：${body.slice(0, 400)}`);

const urls = (JSON.parse(body).output?.choices || [])
  .flatMap((c) => c.message?.content || [])
  .map((c) => c.image)
  .filter(Boolean);
if (!urls.length) fail("没有拿到图片：" + body.slice(0, 400));

// 返回的是带时效的 OSS 链接，立即下载到本地
const outPath = path.resolve(out);
await mkdir(path.dirname(outPath), { recursive: true });
const ext = path.extname(outPath);
const base = outPath.slice(0, -ext.length);
for (const [i, url] of urls.entries()) {
  const file = urls.length === 1 ? outPath : `${base}-${i + 1}${ext}`;
  const img = await fetch(url);
  if (!img.ok) fail(`图片下载失败（HTTP ${img.status}）`);
  await writeFile(file, Buffer.from(await img.arrayBuffer()));
  console.log(`✔ 已保存：${path.relative(process.cwd(), file)}（${opts.size}）`);
}
