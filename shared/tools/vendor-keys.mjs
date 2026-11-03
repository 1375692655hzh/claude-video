import fs from "node:fs";
import path from "node:path";
// 每家厂商要的 key（用户自行开通配置）
export const VENDOR_KEYS = {
  ark: { keys: ["ARK_PLAN_API_KEY", "VOLC_TTS_ACCESS_TOKEN"], name: "火山引擎 豆包语音" },
  minimax: { keys: ["MINIMAX_API_KEY"], name: "MiniMax 语音" },
  qwen: { keys: ["QWEN_TTS_API_KEY"], name: "阿里云百炼 Qwen TTS" },
  mimo: { keys: ["MIMO_API_KEY"], name: "小米 MiMo TTS" },
  image: { keys: ["DASHSCOPE_API_KEY"], name: "AI 生图（阿里百炼 qwen-image）" },
};
export const keyHint = (vendor) => { const k = VENDOR_KEYS[vendor]; return k ? `需要 ${k.name} 的 key，请自行配置` : ""; };
export const hasKey = (vendor, env = process.env) => (VENDOR_KEYS[vendor]?.keys ?? []).some((k) => env[k]);
// 环境变量或 .secrets/keys.env 里有没有（只看有无，不读出值）
export const keyConfigured = (vendor, root) => {
  if (hasKey(vendor)) return true;
  const f = path.join(root, ".secrets", "keys.env");
  if (!fs.existsSync(f)) return false;
  const t = fs.readFileSync(f, "utf8");
  return (VENDOR_KEYS[vendor]?.keys ?? []).some((k) => new RegExp(`^[ \\t]*(export[ \\t]+)?${k}[ \\t]*=[ \\t]*[^\\s#]`, "m").test(t));
};
