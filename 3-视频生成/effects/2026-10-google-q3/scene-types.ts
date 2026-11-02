// 一个场景可以跨好几个镜头（同一张图表随口播逐步展开）。
// at(n)：镜头 n 的人声在本场景里的起始帧；end(n)：镜头 n 的人声结束帧；frames：场景总帧数。
export type SceneProps = { at: (shot: number) => number; end: (shot: number) => number; frames: number };
