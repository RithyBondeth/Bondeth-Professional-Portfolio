import { ImageResponse } from "next/og";
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
          background: "#07090e",
          color: "#edf0f8",
          fontFamily: "monospace",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "12px",
            fontSize: 28,
            color: "#34d399",
            marginBottom: 24,
          }}
        >
          <span>&gt;</span>
          <span>{siteConfig.url.replace("https://", "")}</span>
        </div>
        <div style={{ fontSize: 84, fontWeight: 700, lineHeight: 1.1 }}>
          {siteConfig.name}
        </div>
        <div
          style={{
            fontSize: 40,
            color: "#979ba9",
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
            background: "#34d399",
          }}
        />
      </div>
    ),
    { ...size }
  );
}
