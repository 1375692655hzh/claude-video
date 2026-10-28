import { AbsoluteFill, OffthreadVideo, interpolate, staticFile, useVideoConfig } from "remotion";

// 数字人主持人画面（tools/avatar-host.mjs save 生成的 public/<项目>/host/host.mp4）。
// pip=0 全屏，pip=1 画中画（竖向小窗，放大到头肩），中间值用于过渡动画：
//   const pip = spring({ frame: frame - 120, fps, config: { damping: 200 } });
//   <AvatarHost src="xxx/host/host.mp4" pip={pip} />
// 声音默认来自主持人视频本身；整片另有旁白时传 muted。
export const AvatarHost: React.FC<{
  src: string;
  pip?: number;
  side?: "left" | "right";
  // 小窗宽度占画面宽度的比例
  pipWidth?: number;
  // 小窗里放大倍数和对焦点（0–1，相对原画面），默认对准画面中间偏上的脸部
  pipZoom?: number;
  focusX?: number;
  focusY?: number;
  margin?: number;
  muted?: boolean;
  volume?: number;
  trimBefore?: number;
}> = ({
  src,
  pip = 0,
  side = "right",
  pipWidth = 0.24,
  pipZoom = 1.5,
  focusX = 0.5,
  focusY = 0.32,
  margin = 48,
  muted = false,
  volume = 1,
  trimBefore,
}) => {
  const { width, height } = useVideoConfig();
  const w = width * pipWidth;
  const h = (w * 4) / 3;
  const pipX = side === "right" ? width - w - margin : margin;
  const pipY = height - h - margin;

  const box = {
    left: interpolate(pip, [0, 1], [0, pipX]),
    top: interpolate(pip, [0, 1], [0, pipY]),
    width: interpolate(pip, [0, 1], [width, w]),
    height: interpolate(pip, [0, 1], [height, h]),
    borderRadius: interpolate(pip, [0, 1], [0, 24]),
  };
  const zoom = interpolate(pip, [0, 1], [1, pipZoom]);

  return (
    <AbsoluteFill style={{ pointerEvents: "none" }}>
      <div
        style={{
          position: "absolute",
          ...box,
          overflow: "hidden",
          boxShadow: pip > 0.01 ? `0 ${20 * pip}px ${60 * pip}px rgba(0,0,0,${0.45 * pip})` : undefined,
          outline: pip > 0.01 ? `${3 * pip}px solid rgba(255,255,255,${0.85 * pip})` : undefined,
        }}
      >
        <OffthreadVideo
          src={staticFile(src)}
          muted={muted}
          volume={volume}
          trimBefore={trimBefore}
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
            objectPosition: `${focusX * 100}% ${focusY * 100}%`,
            transform: `scale(${zoom})`,
            transformOrigin: `${focusX * 100}% ${focusY * 100}%`,
          }}
        />
      </div>
    </AbsoluteFill>
  );
};
