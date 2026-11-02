// 数字人圆圈：host.mp4 是把 segments.json 里那些镜头的配音拼成一条（间隔 gap 秒）生成的，
// 每个镜头按自己的起点切回去（trimBefore）；不在 segments.json 里的镜头不显示圆圈。
// 声音一律来自 voice/，圆圈永远 muted。
import segments from "../../public/2026-10-google-q3-cards/host/segments.json";

/** host.mp4 存好之前是 false：圆圈显示占位剪影，位置和时长照常 */
export const HOST_READY = true;
export const HOST_SRC = "2026-10-google-q3-cards/host/host.mp4";
export const HOST_FOCUS = { focusX: 0.52, focusY: 0.2, zoom: 1.4 };
const FPS = 30;

/** host.mp4 里某个镜头的起点（帧）；不在 segments.json 里的镜头返回 null（不显示圆圈） */
export const hostStart = (shot: string): number | null => {
  const s = segments.segments.find((x) => x.shot === shot);
  return s ? Math.round(s.start * FPS) : null;
};

/**
 * 某个镜头的圆圈：lead 是镜头开头到人声起点的帧数。圆圈从镜头开头就在（host.mp4 往前多取 lead 帧，
 * 口型和配音对齐）；host.mp4 开头那段前面没有画面，就从人声起点再出现。
 * 返回 offset（相对镜头起点的帧）和 AvatarBubble 的 props；不出镜返回 null。
 */
export const hostFor = (shot: string, lead: number, popIn: boolean, size = 230) => {
  const start = hostStart(shot);
  if (start === null) return null;
  const back = Math.min(lead, start);
  const video = HOST_READY ? { src: HOST_SRC, ...HOST_FOCUS, muted: true, trimBefore: start - back } : {};
  return { offset: lead - back, props: { ...video, size, enterAt: popIn ? 0 : -1000 } };
};
