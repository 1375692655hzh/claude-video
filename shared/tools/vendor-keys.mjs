// 每家厂商要的 key（用户自行开通配置）
export const VENDOR_KEYS = {
  ark: { keys: ["ARK_PLAN_API_KEY", "VOLC_TTS_ACCESS_TOKEN"], name: "火山引擎 豆包语音" },
  minimax: { keys: ["MINIMAX_API_KEY"], name: "MiniMax 语音" },
  qwen: { keys: ["QWEN_TTS_API_KEY"], name: "阿里云百炼 Qwen TTS" },
  mimo: { keys: ["MIMO_API_KEY"], name: "小米 MiMo TTS" },
};
export const keyHint = (vendor) => { const k = VENDOR_KEYS[vendor]; return k ? `需要 ${k.name} 的 key，请自行配置` : ""; };
export const hasKey = (vendor, env = process.env) => (VENDOR_KEYS[vendor]?.keys ?? []).some((k) => env[k]);
