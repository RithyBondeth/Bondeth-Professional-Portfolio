import "server-only";

import fs from "node:fs";
import path from "node:path";
import type { Post } from "@/features/blog/domain/types";
import { BLOG_DIRECTORY, readPost } from "@/features/blog/server/read-post";
import type { Locale } from "@/shared/i18n";

/**
 * Loads a single blog post by its slug and parses its frontmatter.
 *
 * A missing Khmer file falls back to the English one rather than 404ing. The
 * #AIIn60Seconds notes are written Khmer-first and translated after, so the
 * reverse gap is real too — either way, showing the language we have beats
 * showing nothing.
 *
 * @param slug - The MDX file name without the extension
 * @returns The parsed post, or null when no file exists in either language
 */
export async function getPostBySlug(
  slug: string,
  lang: Locale = "en",
): Promise<Post | null> {
  const preferred = path.join(
    BLOG_DIRECTORY,
    lang === "km" ? `${slug}.km.mdx` : `${slug}.mdx`,
  );
  const fallback = path.join(BLOG_DIRECTORY, `${slug}.mdx`);
  const filePath = fs.existsSync(preferred) ? preferred : fallback;

  if (!fs.existsSync(filePath)) {
    return null;
  }

  return readPost(filePath, slug);
}
