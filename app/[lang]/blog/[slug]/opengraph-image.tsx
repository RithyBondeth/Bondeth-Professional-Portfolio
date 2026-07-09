import { ImageResponse } from "next/og";
import { getPostBySlug } from "@/utils/functions/blog";
import { siteConfig } from "@/utils/constants/portfolio.constant";
import { hasLocale } from "@/utils/i18n";

export const alt = "Blog post";
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = "image/png";

export default async function Image({
  params,
}: {
  params: Promise<{ lang: string; slug: string }>;
}) {
  const { lang, slug } = await params;
  const post = await getPostBySlug(slug, hasLocale(lang) ? lang : "en");

  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        padding: "80px",
        background: "#09090b",
        color: "#fafafa",
        fontFamily: "monospace",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "12px",
          fontSize: 26,
          color: "#34d399",
          marginBottom: 32,
        }}
      >
        <span>&gt;</span>
        <span>{siteConfig.name} — Blog</span>
      </div>
      <div style={{ fontSize: 64, fontWeight: 700, lineHeight: 1.15 }}>
        {post?.title ?? "Blog"}
      </div>
      {post?.excerpt && (
        <div
          style={{
            fontSize: 30,
            color: "#a1a1aa",
            marginTop: 28,
            lineHeight: 1.4,
          }}
        >
          {post.excerpt}
        </div>
      )}
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
    </div>,
    { ...size },
  );
}
