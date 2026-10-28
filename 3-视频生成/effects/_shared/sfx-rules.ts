import { SFX, SfxName } from "./sfx-library";

// 音效使用规范（为什么这么严：成片里一直有人声和背景音乐，音效多了会很吵、很累）。
// 规则写在这里，SfxTrack 每次预览 / 渲染都会检查，不合规直接报错并指出是哪一帧。说明见 public/library/README.md。
export const SFX_RULES = {
  perMinute: 4, // 全片平均每分钟最多几个
  perWindow: { seconds: 30, max: 3 }, // 任意 30 秒内最多几个
  minGap: 1.5, // 任意两个音效的起点至少隔几秒
  sameGap: 8, // 同一种音效的起点至少隔几秒
  maxPerVideo: { impact: 3, riser: 3 } as Partial<Record<SfxName, number>>, // 重点音效全片上限，用多了就不"重点"了
  noSpeech: ["whoosh-slow", "riser"] as SfxName[], // 长音效不能和人声重叠，只能放在停顿处
  speechVolume: 0.5, // 其他音效和人声重叠时，音量再乘这个
  // 优先级（数字越大越重要）：挤在一起时，按这个删低的
  priority: { impact: 6, riser: 5, "whoosh-slow": 4, count: 3, rise: 3, pop: 2, ding: 2, "whoosh-fast": 1 } as Record<SfxName, number>,
  // 背景音乐在音效响时压低到多少（重点音效压得更多），前后各留一点过渡
  bgmDuck: { normal: 0.7, strong: 0.5, strongNames: ["impact", "riser"] as SfxName[], rampSec: 0.15 },
};

export type SfxCue = {
  name: SfxName;
  at?: number; // 起始帧
  endAt?: number; // 结束帧（riser 用：结尾对准揭晓那一帧）
  volume?: number; // 不填用库里的默认值
  allow?: string; // 破例的理由；填了就跳过该音效的检查（仍会计入总数）
};

export type SfxViolation = { frame: number; message: string };

// 音效实际占用的帧区间 [start, end)
export function cueRange(cue: SfxCue, fps: number): [number, number] {
  const len = Math.ceil(SFX[cue.name].duration * fps);
  const start = cue.endAt !== undefined ? cue.endAt - len : (cue.at ?? 0);
  return [start, start + len];
}

const overlaps = (a: [number, number], b: [number, number]) => a[0] < b[1] && b[0] < a[1];
const time = (frame: number, fps: number) => {
  const s = frame / fps;
  return `${Math.floor(s / 60)}:${(s % 60).toFixed(1).padStart(4, "0")}`;
};

// 检查一组音效是否合规。speech 是人声的帧区间列表。
export function checkSfxCues(
  cues: SfxCue[],
  opts: { fps: number; durationInFrames: number; speech?: [number, number][] },
): SfxViolation[] {
  const { fps, durationInFrames, speech = [] } = opts;
  const R = SFX_RULES;
  const out: SfxViolation[] = [];
  const items = cues
    .map((c) => ({ c, r: cueRange(c, fps) }))
    .sort((a, b) => a.r[0] - b.r[0]);
  const label = (i: (typeof items)[number]) => `${SFX[i.c.name].title}（${i.c.name}，${time(i.r[0], fps)}，第 ${i.r[0]} 帧）`;
  const lower = (a: (typeof items)[number], b: (typeof items)[number]) =>
    R.priority[a.c.name] < R.priority[b.c.name] ? a : b;

  // 1. 全片总量
  const minutes = durationInFrames / fps / 60;
  const maxTotal = Math.max(1, Math.floor(minutes * R.perMinute));
  if (items.length > maxTotal) {
    out.push({ frame: 0, message: `全片 ${items.length} 个音效，超过上限 ${maxTotal} 个（每分钟 ${R.perMinute} 个）` });
  }

  // 2. 重点音效全片上限
  for (const [name, max] of Object.entries(R.maxPerVideo)) {
    const n = items.filter((i) => i.c.name === name).length;
    if (max !== undefined && n > max) {
      out.push({ frame: 0, message: `${SFX[name as SfxName].title} 全片用了 ${n} 次，上限 ${max} 次` });
    }
  }

  const checked = items.filter((i) => !i.c.allow);
  for (let k = 0; k < checked.length; k++) {
    const cur = checked[k];
    if (cur.r[0] < 0 || cur.r[0] >= durationInFrames) {
      out.push({ frame: cur.r[0], message: `${label(cur)} 不在视频范围内` });
    }

    // 3. 任意窗口内的数量（以每个音效为窗口起点）
    const win = R.perWindow.seconds * fps;
    const inWin = items.filter((i) => i.r[0] >= cur.r[0] && i.r[0] < cur.r[0] + win);
    if (inWin.length > R.perWindow.max) {
      out.push({
        frame: cur.r[0],
        message: `从 ${time(cur.r[0], fps)} 起 ${R.perWindow.seconds} 秒内有 ${inWin.length} 个音效，上限 ${R.perWindow.max} 个`,
      });
    }

    // 4. 与前一个的间隔、与前一个同类的间隔
    const prev = items.slice(0, items.indexOf(cur));
    const last = prev[prev.length - 1];
    if (last && cur.r[0] - last.r[0] < R.minGap * fps) {
      out.push({
        frame: cur.r[0],
        message: `${label(cur)} 和前一个 ${label(last)} 只隔 ${((cur.r[0] - last.r[0]) / fps).toFixed(2)} 秒，至少 ${R.minGap} 秒；建议删掉优先级低的 ${SFX[lower(cur, last).c.name].title}`,
      });
    }
    const same = prev.filter((i) => i.c.name === cur.c.name);
    const lastSame = same[same.length - 1];
    if (lastSame && cur.r[0] - lastSame.r[0] < R.sameGap * fps) {
      out.push({
        frame: cur.r[0],
        message: `${label(cur)} 距上一次同类只隔 ${((cur.r[0] - lastSame.r[0]) / fps).toFixed(1)} 秒，同类至少 ${R.sameGap} 秒`,
      });
    }

    // 5. 长音效不能压在人声上
    if (R.noSpeech.includes(cur.c.name) && speech.some((s) => overlaps(cur.r, s))) {
      out.push({ frame: cur.r[0], message: `${label(cur)} 和人声重叠；这类长音效只能放在配音停顿处` });
    }
  }
  return out.sort((a, b) => a.frame - b.frame);
}

// 和人声重叠的音效，音量再降
export function cueVolume(cue: SfxCue, fps: number, speech: [number, number][] = []): number {
  const base = cue.volume ?? SFX[cue.name].volume;
  const r = cueRange(cue, fps);
  return speech.some((s) => overlaps(r, s)) ? base * SFX_RULES.speechVolume : base;
}

// 给 <Bgm duck={...}>：音效响的时候把背景音乐压低，重点音效压得更多
export function sfxDuck(cues: SfxCue[], fps: number): (frame: number) => number {
  const D = SFX_RULES.bgmDuck;
  const ramp = D.rampSec * fps;
  const ranges = cues.map((c) => ({ r: cueRange(c, fps), depth: D.strongNames.includes(c.name) ? D.strong : D.normal }));
  return (frame) => {
    let m = 1;
    for (const { r, depth } of ranges) {
      if (frame < r[0] - ramp || frame > r[1] + ramp) continue;
      const k =
        frame < r[0] ? (r[0] - frame) / ramp : frame > r[1] ? (frame - r[1]) / ramp : 0; // 0 = 完全压低，1 = 不压
      m = Math.min(m, depth + (1 - depth) * k);
    }
    return m;
  };
}
