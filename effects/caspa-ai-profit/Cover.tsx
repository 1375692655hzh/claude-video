// 封面：大字“大客户，变对手？”，辅助文案“AI利润谁拿走”。
import React from "react";
import { AbsoluteFill, Img } from "remotion";
import { useFont } from "./Main";
import { C, FONT, asset } from "./ui";

export const CaspaCover: React.FC = () => {
  useFont();
  return (
    <AbsoluteFill style={{ background: C.bg, fontFamily: FONT }}>
      <Img
        src={asset("img/gen-datacenter.png")}
        style={{
          position: "absolute",
          inset: 0,
          width: "100%",
          height: "100%",
          objectFit: "cover",
          opacity: 0.55,
        }}
      />
      <AbsoluteFill
        style={{
          background:
            "linear-gradient(90deg, rgba(6,16,31,0.95) 0%, rgba(6,16,31,0.6) 55%, rgba(6,16,31,0.2) 100%)",
        }}
      />
      {/* 右侧：英伟达机柜 vs 自研芯片 */}
      <div
        style={{
          position: "absolute",
          right: 90,
          top: 150,
          width: 560,
          height: 780,
          borderRadius: 24,
          overflow: "hidden",
          border: `3px solid ${C.cyan}`,
          boxShadow: `0 0 60px ${C.cyan}66`,
        }}
      >
        <Img
          src={asset("img/nvl72.jpg")}
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
            transform: "scale(1.3)",
          }}
        />
      </div>
      <div
        style={{
          position: "absolute",
          right: 560,
          top: 560,
          width: 440,
          height: 290,
          borderRadius: 20,
          overflow: "hidden",
          border: `3px solid ${C.orange}`,
          boxShadow: `0 0 50px ${C.orange}66`,
        }}
      >
        <Img
          src={asset("img/ironwood-1.png")}
          style={{ width: "100%", height: "100%", objectFit: "cover" }}
        />
      </div>
      <div
        style={{
          position: "absolute",
          left: 90,
          top: 90,
          fontSize: 64,
          fontWeight: 900,
          color: C.white,
        }}
      >
        CASPA大会 <span style={{ color: "#ffd23f" }}>5大财富密码</span>
      </div>
      <div
        style={{
          position: "absolute",
          left: 80,
          top: 250,
          fontSize: 210,
          fontWeight: 900,
          lineHeight: 1.08,
          color: C.white,
          textShadow: "0 10px 40px rgba(0,0,0,0.7)",
        }}
      >
        大客户，
        <br />
        <span style={{ color: C.orange }}>变对手？</span>
      </div>
      <div
        style={{
          position: "absolute",
          left: 90,
          top: 790,
          fontSize: 70,
          fontWeight: 800,
          color: C.bg,
          background: C.cyan,
          padding: "8px 30px",
          borderRadius: 14,
        }}
      >
        AI利润谁拿走
      </div>
      <div
        style={{
          position: "absolute",
          left: 90,
          bottom: 50,
          fontSize: 32,
          fontWeight: 700,
          color: "rgba(244,248,255,0.85)",
          borderLeft: `6px solid ${C.cyan}`,
          paddingLeft: 16,
        }}
      >
        Andy港美观察
      </div>
    </AbsoluteFill>
  );
};
