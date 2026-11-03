import { OffthreadVideo, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { useTheme } from "./motion/theme";
import { clamp, ease, lerp, seg } from "./motion/time";

// 圆形数字人口播（左下角）：照参考图——白色描边的圆形头像，叠在画面角落，主持人一直在说话。
// 视频来自 tools/avatar-host.mjs save 生成的 public/<期名>/host/host.mp4（Topview 数字人 + 整片配音）。
//   <Frame host={{ src: "2026-10-google-q3/host/host.mp4" }}> … </Frame>
// 或单独用：<AvatarBubble src="…/host.mp4" />
// 声音默认来自主持人视频；整片另有旁白音轨时传 muted，只用画面。
export type AvatarBubbleProps = {
  src?: string; // public/ 下的路径；不传时显示占位剪影（排版用）
  size?: number; // 圆的直径（1920×1080 设计稿像素）
  left?: number;
  bottom?: number;
  focusX?: number; // 脸在原视频里的位置（0–1），用来对准圆心
  focusY?: number;
  zoom?: number; // 头肩放大倍数
  muted?: boolean;
  volume?: number;
  trimBefore?: number; // 帧
  enterAt?: number; // 弹出时间（毫秒，相对所在 Sequence）
  exitAt?: number; // 收起时间（毫秒）；不传就一直在
  speaking?: boolean; // 说话时外圈一道很淡的青蓝光圈
};

export const AvatarBubble: React.FC<AvatarBubbleProps> = ({
  src,
  size = 230,
  left = 40,
  bottom = 36,
  focusX = 0.5,
  focusY = 0.3,
  zoom = 1.6,
  muted = false,
  volume = 1,
  trimBefore,
  enterAt = 0,
  exitAt,
  speaking = true,
}) => {
  const th = useTheme();
  const frame = useCurrentFrame();
  const { fps, width, height } = useVideoConfig();
  const t = (frame / fps) * 1000;
  const inP = seg(t, enterAt, 500, ease.outBack);
  const outP = exitAt === undefined ? 0 : seg(t, exitAt, 300, ease.inCubic);
  const vis = clamp(inP) * (1 - outP);
  const k = Math.min(width / 1920, height / 1080); // 按画面尺寸缩放
  const d = size * k;
  const ring = speaking ? 0.35 + 0.15 * Math.sin(t / 260) : 0;
  return (
    <div
      style={{
        position: "absolute",
        left: left * k,
        bottom: bottom * k,
        width: d,
        height: d,
        borderRadius: "50%",
        background: th.card,
        padding: 6 * k,
        boxSizing: "border-box",
        boxShadow: `0 ${16 * k}px ${40 * k}px rgba(20,27,45,0.22), 0 0 0 ${3 * k}px rgba(42,164,224,${ring * vis})`,
        opacity: clamp(vis * 1.5),
        transform: `scale(${lerp(0.6, 1, vis)})`,
        transformOrigin: "30% 70%",
        pointerEvents: "none",
      }}
    >
      <div style={{ width: "100%", height: "100%", borderRadius: "50%", overflow: "hidden", background: "#DCE3EC", position: "relative" }}>
        {src ? (
          <OffthreadVideo
            src={staticFile(src)}
            muted={muted}
            volume={volume}
            trimBefore={trimBefore}
            style={{
              position: "absolute",
              inset: 0,
              width: "100%",
              height: "100%",
              objectFit: "cover",
              objectPosition: `${focusX * 100}% ${focusY * 100}%`,
              transform: `scale(${zoom})`,
              transformOrigin: `${focusX * 100}% ${focusY * 100}%`,
            }}
          />
        ) : (
          // 占位剪影：选定数字人之前用来排版
          <svg width="100%" height="100%" viewBox="0 0 100 100">
            <rect width={100} height={100} fill="#DCE3EC" />
            <circle cx={50} cy={40} r={17} fill="#B7C2D2" />
            <path d="M14 100c2-22 17-34 36-34s34 12 36 34z" fill="#B7C2D2" />
          </svg>
        )}
      </div>
    </div>
  );
};
