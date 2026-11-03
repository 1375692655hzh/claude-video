// 每家厂商要的 key（用户自己去厂商开通，填进 .secrets/keys.env；模板见 shared/keys.env.example）
export const VENDOR_KEYS = {
  ark: { keys: ["ARK_PLAN_API_KEY", "VOLC_TTS_ACCESS_TOKEN"], name: "火山引擎 豆包语音（seed-tts-2.0）", where: "https://console.volcengine.com/speech" },
  minimax: { keys: ["MINIMAX_API_KEY"], name: "MiniMax 语音（speech-2.8-hd）", where: "https://platform.minimaxi.com" },
  qwen: { keys: ["QWEN_TTS_API_KEY"], name: "阿里云百炼 Qwen TTS（qwen-audio-3.0-tts-plus）", where: "https://bailian.console.aliyun.com" },
  mimo: { keys: ["MIMO_API_KEY"], name: "小米 MiMo TTS（mimo-v2.5-tts）", where: "https://platform.xiaomimimo.com" },
};
export const keyHint = (vendor) => { const k = VENDOR_KEYS[vendor]; return k ? `需要 ${k.name} 的 key：在 .secrets/keys.env 填 ${k.keys.join(" 或 ")}（开通：${k.where}；模板 shared/keys.env.example）` : ""; };
export const hasKey = (vendor, env = process.env) => (VENDOR_KEYS[vendor]?.keys ?? []).some((k) => env[k]);
