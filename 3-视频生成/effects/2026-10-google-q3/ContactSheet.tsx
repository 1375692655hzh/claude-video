// 关键帧预览：一张 1920×1080 里放 3×3 个定格画面（渲染前给用户看、自己查版式用）。
// npx remotion still 2026-10-google-q3-sheet out/sheet.png --props='{"frames":[60,476,...]}'
import React from "react";
import { AbsoluteFill, Freeze } from "remotion";
import { GoogleQ3Main } from "./Main";
import { FPS } from "./timeline";

export const ContactSheet: React.FC<{ frames: number[] }> = ({ frames }) => (
  <AbsoluteFill style={{ background: "#000", display: "flex", flexWrap: "wrap" }}>
    {frames.slice(0, 9).map((f) => (
      <div key={f} style={{ width: 640, height: 360, position: "relative", overflow: "hidden" }}>
        <div style={{ width: 1920, height: 1080, transform: "scale(0.3333)", transformOrigin: "0 0", position: "absolute" }}>
          <Freeze frame={f}>
            <GoogleQ3Main />
          </Freeze>
        </div>
        <div style={{ position: "absolute", left: 6, top: 4, color: "#ff0", fontSize: 16, fontFamily: "monospace", textShadow: "0 0 3px #000" }}>
          {Math.floor(f / FPS / 60)}:{String(Math.floor((f / FPS) % 60)).padStart(2, "0")} · {f}
        </div>
      </div>
    ))}
  </AbsoluteFill>
);
