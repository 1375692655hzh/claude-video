// 临时环境测试动画：验证编译、预览、渲染是否正常。验证完成后可整个文件夹删除。
import {
  AbsoluteFill,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";

export type EnvTestProps = {
  readonly label: string;
  readonly color: string;
};

export const EnvTest: React.FC<EnvTestProps> = ({ label, color }) => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();

  const enter = spring({ frame, fps, config: { damping: 12 } });
  const rotate = interpolate(frame, [0, durationInFrames], [0, 360]);
  const fadeOut = interpolate(
    frame,
    [durationInFrames - 15, durationInFrames - 1],
    [1, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
  );

  return (
    <AbsoluteFill
      style={{
        backgroundColor: "#0f172a",
        justifyContent: "center",
        alignItems: "center",
        opacity: fadeOut,
      }}
    >
      <div
        style={{
          width: 160,
          height: 160,
          borderRadius: 32,
          backgroundColor: color,
          transform: `scale(${enter}) rotate(${rotate}deg)`,
        }}
      />
      <div
        style={{
          marginTop: 60,
          color: "white",
          fontSize: 64,
          fontWeight: 700,
          fontFamily: "Arial, sans-serif",
          opacity: enter,
        }}
      >
        {label}
      </div>
      <div
        style={{
          position: "absolute",
          right: 48,
          bottom: 32,
          color: "#94a3b8",
          fontSize: 28,
          fontFamily: "Consolas, monospace",
        }}
      >
        frame {frame}
      </div>
    </AbsoluteFill>
  );
};
