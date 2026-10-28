// 常用配乐库：文件在 public/library/music/，说明见 public/library/README.md。
// 新增曲目：响度处理后放进 public/library/music/，再在这里加一条（loopStart/loopEnd 按能量曲线挑主体段）。

export type MusicTrack = {
  id: string;
  file: string; // staticFile 路径
  title: string;
  mood: string;
  use: string;
  bpm: number;
  duration: number; // 秒
  loopStart: number; // 片子比曲子长时，在 loopStart–loopEnd 之间循环，保留原曲开头和结尾
  loopEnd: number;
  source: string;
  prompt: string;
};

export const MUSIC: Record<string, MusicTrack> = {
  "bgm-tech-steady": {
    id: "bgm-tech-steady",
    file: "library/music/bgm-tech-steady.mp3",
    title: "科技稳进",
    mood: "自信、向前推进、积极但克制",
    use: "主力背景：讲行业、公司、数据",
    bpm: 100,
    duration: 169.9,
    loopStart: 30,
    loopEnd: 150,
    source: "MiniMax Audio 网页 music-3.0（纯音乐），2026-10-28",
    prompt:
      "纯音乐，现代科技感电子乐，适合财经科技解说视频的背景音乐。干净的合成器铺底，轻柔的琶音律动，稳定的轻鼓点，节奏约 100 BPM。情绪自信、向前推进、积极但克制。旋律简单不抢戏，全曲能量平稳，没有突然的高潮或停顿，适合垫在人声解说下面。无人声。",
  },
  "bgm-tech-minimal": {
    id: "bgm-tech-minimal",
    file: "library/music/bgm-tech-minimal.mp3",
    title: "极简数据",
    mood: "冷静、理性、专注",
    use: "数据和图表多的段落，留白多不抢戏",
    bpm: 95,
    duration: 100.7,
    loopStart: 28,
    loopEnd: 78,
    source: "MiniMax Audio 网页 music-3.0（纯音乐），2026-10-28",
    prompt:
      "纯音乐，极简风格的科技电子乐，适合财经数据解说视频的背景音乐。清脆的电子脉冲音和轻柔的合成器铺底，简洁的电子鼓点，低音线条稳定，节奏约 95 BPM。情绪冷静、理性、专注，有数据和精确感。乐器层次少，留白多，旋律不明显，全曲能量平稳，没有高潮和停顿，适合垫在人声解说下面。无人声。",
  },
  "bgm-tech-deep": {
    id: "bgm-tech-deep",
    file: "library/music/bgm-tech-deep.mp3",
    title: "深沉稳重",
    mood: "沉稳、专业、有分量",
    use: "大公司、宏观经济、行业格局",
    bpm: 90,
    duration: 132.1,
    loopStart: 30,
    loopEnd: 125,
    source: "MiniMax Audio 网页 music-3.0（纯音乐），2026-10-28",
    prompt:
      "纯音乐，深沉稳重的科技感电子乐，适合财经商业解说视频的背景音乐。温暖厚实的低音合成器，缓慢展开的氛围铺底，克制的电子鼓点，偶尔有轻微的钢琴点缀，节奏约 90 BPM。情绪沉稳、专业、有分量感，像高端财经节目的配乐。旋律简单，全曲能量平稳，没有突然的高潮或停顿，适合垫在人声解说下面。无人声。",
  },
  "bgm-tech-bright": {
    id: "bgm-tech-bright",
    file: "library/music/bgm-tech-bright.mp3",
    title: "明亮前沿",
    mood: "积极、有未来感、有活力但克制",
    use: "AI、新技术、增长和机会",
    bpm: 105,
    duration: 147.0,
    loopStart: 20,
    loopEnd: 135,
    source: "MiniMax Audio 网页 music-3.0（纯音乐），2026-10-28",
    prompt:
      "纯音乐，明亮现代的科技电子乐，适合 AI 和前沿科技主题的财经解说视频背景音乐。清亮的合成器琶音，轻快但不急促的电子节拍，带一点空间感的铺底音色，节奏约 105 BPM。情绪积极、有未来感、充满活力但克制。旋律简洁不抢戏，全曲能量平稳，没有突然的高潮或停顿，适合垫在人声解说下面。无人声。",
  },
};
