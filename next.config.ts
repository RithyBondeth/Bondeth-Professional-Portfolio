import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Next 16 allows one dev server per build dir. Overriding the dir lets a
  // second `next dev` (e.g. another agent session's preview) run in parallel.
  distDir: process.env.NEXT_DIST_DIR || ".next",

  images: {
    // Default is ['image/webp'] alone. AVIF lands 20-30% under WebP at the
    // same quality, which is worth having when the project previews are
    // multi-megabyte screenshots. Order matters: the first format the
    // browser's Accept header matches wins, so AVIF leads and WebP catches
    // everything that can't take it.
    formats: ["image/avif", "image/webp"],
  },

  // /notes was briefly its own section before the short-form pieces moved into
  // the blog as `format: "note"`. Permanent, since the URLs were published.
  async redirects() {
    return [
      { source: "/:lang(en|km)/notes", destination: "/:lang/blog", permanent: true },
      {
        source: "/:lang(en|km)/notes/:slug",
        destination: "/:lang/blog/:slug",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
