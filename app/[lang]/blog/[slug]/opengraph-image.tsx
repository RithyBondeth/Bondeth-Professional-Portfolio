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

// Satori (next/og) ships only a Latin font, so Khmer text renders as tofu.
// Fetch a subsetted Kantumruy Pro from Google Fonts for posts that need it.
const KHMER_REGEX = /[ក-៿]/;

async function loadKhmerFont(text: string): Promise<ArrayBuffer | null> {
  try {
    const css = await fetch(
      `https://fonts.googleapis.com/css2?family=Kantumruy+Pro&text=${encodeURIComponent(text)}`,
      { headers: { "User-Agent": "Mozilla/5.0" } },
    ).then((response) => response.text());

    const fontUrl = css.match(/src:\s*url\((.+?)\)/)?.[1];
    if (!fontUrl) return null;

    return await fetch(fontUrl).then((response) => response.arrayBuffer());
  } catch {
    // Never fail image generation over a font fetch — fall back to Latin.
    return null;
  }
}

export default async function Image({
  params,
}: {
  params: Promise<{ lang: string; slug: string }>;
}) {
  const { lang, slug } = await params;
  const post = await getPostBySlug(slug, hasLocale(lang) ? lang : "en");

  const heading = post?.title ?? "Blog";
  const excerpt = post?.excerpt ?? "";
  const label = `${siteConfig.name} — Blog`;

  const khmerFont = KHMER_REGEX.test(heading + excerpt)
    ? await loadKhmerFont(`${label} ${heading} ${excerpt}`)
    : null;
  const fontFamily = khmerFont ? "'Kantumruy Pro', monospace" : "monospace";

  return new ImageResponse(
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
        fontFamily,
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
        <span>{label}</span>
      </div>
      <div style={{ fontSize: 64, fontWeight: 700, lineHeight: 1.15 }}>
        {heading}
      </div>
      {excerpt && (
        <div
          style={{
            fontSize: 30,
            color: "#979ba9",
            marginTop: 28,
            lineHeight: 1.4,
          }}
        >
          {excerpt}
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
    {
      ...size,
      ...(khmerFont
        ? {
            fonts: [
              {
                name: "Kantumruy Pro",
                data: khmerFont,
                style: "normal" as const,
                weight: 400 as const,
              },
            ],
          }
        : {}),
    },
  );
}
