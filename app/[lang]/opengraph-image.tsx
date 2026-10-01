import { ImageResponse } from "next/og";
import { RobotOg } from "@/components/brand/robot-og";
import { siteConfig } from "@/utils/constants/portfolio.constant";

export const alt = `${siteConfig.name} — ${siteConfig.title}`;
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = "image/png";

export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: "80px",
          background: "#141413",
          color: "#faf9f5",
          fontFamily: "sans-serif",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "18px",
            fontSize: 28,
            color: "#d97757",
            marginBottom: 24,
          }}
        >
          <RobotOg size={58} inverse />
          <span>{siteConfig.url.replace("https://", "")}</span>
        </div>
        <div style={{ fontSize: 84, fontWeight: 700, lineHeight: 1.1 }}>
          {siteConfig.name}
        </div>
        <div
          style={{
            fontSize: 40,
            color: "#b8b2a9",
            marginTop: 24,
          }}
        >
          {siteConfig.title}
        </div>
        <div
          style={{
            position: "absolute",
            bottom: 0,
            left: 0,
            width: "100%",
            height: "8px",
            background: "#d97757",
          }}
        />
      </div>
    ),
    { ...size }
  );
}
