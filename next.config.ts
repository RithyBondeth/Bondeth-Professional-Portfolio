import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Next 16 allows one dev server per build dir. Overriding the dir lets a
  // second `next dev` (e.g. another agent session's preview) run in parallel.
  distDir: process.env.NEXT_DIST_DIR || ".next",
};

export default nextConfig;
