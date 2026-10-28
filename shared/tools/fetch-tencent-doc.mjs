// 从腾讯文档拉取内容（正文 + 图片），保存为 Markdown；图片下载到同名文件夹并插回原位。
// 用法：node shared/tools/fetch-tencent-doc.mjs <文档链接> [输出路径.md]（相对当前目录，默认用文档标题存在当前目录）
// 各步骤的 npm 脚本：fetch-doc（如 2-脚本 拉视频稿 / 素材文档，1-视频稿 拉选题素材）
// Token 从环境变量 TENCENT_DOCS_TOKEN 读取（在 https://docs.qq.com/scenario/open-claw.html 获取）。
// 调用的是腾讯文档官方 MCP 服务：https://docs.qq.com/openapi/mcp

import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";

const ENDPOINT = "https://docs.qq.com/openapi/mcp";
const token = process.env.TENCENT_DOCS_TOKEN;
const [link, outName] = process.argv.slice(2);

if (!token) {
  fail(
    "没有找到环境变量 TENCENT_DOCS_TOKEN。\n" +
      '请在 PowerShell 运行：setx TENCENT_DOCS_TOKEN "你的token"，然后关闭并重新打开 PowerShell。',
  );
}
if (!link) fail("请提供文档链接，例如：node shared/tools/fetch-tencent-doc.mjs https://docs.qq.com/doc/XXXX 2-脚本/<期名>/材料.md");

const urlId = (link.match(/docs\.qq\.com\/[a-z]+\/([A-Za-z0-9_-]+)/) || [])[1] || link.trim();

let sessionId = null;
let rpcId = 0;

function fail(msg) {
  console.error("✖ " + msg);
  process.exit(1);
}

async function rpc(method, params, isNotification = false) {
  const body = { jsonrpc: "2.0", method, params };
  if (!isNotification) body.id = ++rpcId;
  const headers = {
    "Content-Type": "application/json",
    Accept: "application/json, text/event-stream",
    Authorization: token,
  };
  if (sessionId) headers["Mcp-Session-Id"] = sessionId;

  const res = await fetch(ENDPOINT, { method: "POST", headers, body: JSON.stringify(body) });
  sessionId = res.headers.get("mcp-session-id") || sessionId;
  if (isNotification) return null;

  const text = await res.text();
  if (!res.ok) fail(`接口返回 HTTP ${res.status}：${text.slice(0, 300)}`);

  // 响应可能是普通 JSON，也可能是 SSE（data: {...}）
  let msg = null;
  if ((res.headers.get("content-type") || "").includes("text/event-stream")) {
    for (const line of text.split(/\r?\n/)) {
      if (!line.startsWith("data:")) continue;
      const m = JSON.parse(line.slice(5).trim());
      if (m.id === body.id) msg = m;
    }
  } else {
    msg = JSON.parse(text);
  }
  if (!msg) fail("无法解析接口返回：" + text.slice(0, 300));
  if (msg.error) fail(`接口错误 ${msg.error.code}：${msg.error.message}`);
  return msg.result;
}

// 把 tools/call 的结果解析成对象
function parseToolResult(result) {
  if (result?.structuredContent) return result.structuredContent;
  const t = result?.content?.find((c) => c.type === "text")?.text ?? "";
  try {
    return JSON.parse(t);
  } catch {
    return { content: t, error: result?.isError ? t : "" };
  }
}

async function callTool(name, args) {
  return parseToolResult(await rpc("tools/call", { name, arguments: args }));
}

async function findFileIdByUrl() {
  for (let page = 1; page <= 5; page++) {
    const r = await callTool("manage.recent_online_file", { num: page, count: 100, order_by: 0 });
    const files = r.files || r.file || [];
    const hit = files.find((f) => (f.file_url || "").includes(urlId));
    if (hit) return { fileId: hit.file_id, title: hit.file_name };
    if (files.length < 100) break;
  }
  return null;
}

await rpc("initialize", {
  protocolVersion: "2025-03-26",
  capabilities: {},
  clientInfo: { name: "claude-video-fetch-doc", version: "1.0.0" },
});
await rpc("notifications/initialized", {}, true);

// 先直接用链接里的 ID 试；不行再从“最近浏览”列表里按链接匹配真实 file_id
let title = null;
let doc = await callTool("get_content", { file_id: urlId });
if (!doc.content) {
  const found = await findFileIdByUrl();
  if (!found) {
    fail(
      "没能定位到这篇文档。请先在浏览器里打开一次该文档（让它出现在“最近浏览”中），再重试。\n" +
        "接口返回：" + JSON.stringify(doc).slice(0, 300),
    );
  }
  title = found.title;
  doc = await callTool("get_content", { file_id: found.fileId });
}
if (!doc.content) fail("读取内容失败：" + JSON.stringify(doc).slice(0, 300));

const safe = (s) => s.replace(/[\\/:*?"<>|\s]+/g, "_").slice(0, 60);
const fileName = outName || `${safe(title || urlId)}.md`;
const outPath = path.resolve(fileName);
await mkdir(path.dirname(outPath), { recursive: true });

// 图片：get_images 给出每张图的 URL 和字符位置 pos；
// resolve_document_structure 给出每段的起始位置，用来把图片放回对应的段落。
// get_content 的每一行对应一个段落（图片段落是空行），行数一致时就把图片插回原位。
let content = doc.content;
let imageNote = "";
const imgRes = await callTool("doc.get_images", { file_url: link });
const images = imgRes?.data?.images || [];
if (images.length) {
  const imgDirName = path.basename(fileName, ".md");
  const imgDir = path.join(path.dirname(outPath), imgDirName);
  await mkdir(imgDir, { recursive: true });

  const struct = await callTool("doc.resolve_document_structure", {
    file_url: link,
    mode: 0,
    limit: 0,
    text_preview_length: 0,
    has_text_preview_length: true,
  });
  const nodes = struct?.data?.nodes || [];
  const lines = content.split("\n");
  // 正文末尾通常多一个换行，split 后会多出一个空串
  const lineCount = lines.at(-1) === "" ? lines.length - 1 : lines.length;
  const aligned = nodes.length > 0 && lineCount === nodes.length;
  const appended = [];

  for (const [i, img] of images.entries()) {
    const url = img.image_url;
    const ext = new URL(url).pathname.match(/\.(png|jpe?g|gif|webp|bmp)$/i)?.[1] ?? "png";
    const name = `${String(i + 1).padStart(2, "0")}.${ext}`;
    // 图片服务器需要 docs.qq.com 的 Referer，否则 403
    const res = await fetch(url, { headers: { Referer: "https://docs.qq.com/" } });
    if (!res.ok) {
      console.warn(`⚠ 图片 ${i + 1} 下载失败（HTTP ${res.status}）：${url}`);
      continue;
    }
    await writeFile(path.join(imgDir, name), Buffer.from(await res.arrayBuffer()));
    const md = `![图${i + 1}](${imgDirName}/${name})`;

    const nodeIdx = nodes.findIndex((n) => (n.start_index ?? 0) === Number(img.pos));
    if (aligned && nodeIdx >= 0 && lines[nodeIdx].trim() === "") {
      lines[nodeIdx] = md;
    } else {
      appended.push(md);
    }
  }
  content = lines.join("\n");
  if (appended.length) {
    content += `\n\n## 未能定位的图片\n\n${appended.join("\n\n")}\n`;
  }
  imageNote = `，图片 ${images.length} 张 → ${path.relative(process.cwd(), imgDir)}`;
}

await writeFile(outPath, `<!-- 来源：${link} -->\n\n${content}`, "utf8");
console.log(`✔ 已保存：${path.relative(process.cwd(), outPath)}（${doc.content.length} 字${imageNote}）`);
