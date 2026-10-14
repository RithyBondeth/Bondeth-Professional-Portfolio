import "server-only";

import fs from "node:fs";
import path from "node:path";
import type { Post } from "@/features/blog/domain/types";
import { BLOG_DIRECTORY, readPost } from "@/features/blog/server/read-post";
import type { Locale } from "@/shared/i18n";

/**
 * Reads every MDX file in the blog content directory, parses its
 * frontmatter, and returns the posts sorted by date (newest first).
 *
 * @returns All blog posts, or an empty array when the directory is missing
 */
export async function getAllPosts(lang: Locale = "en"): Promise<Post[]> {
  if (!fs.existsSync(BLOG_DIRECTORY)) {
    return [];
  }

  const files = fs.readdirSync(BLOG_DIRECTORY);

  const posts = files
    .filter((file) =>
      lang === "km"
        ? file.endsWith(".km.mdx")
        : file.endsWith(".mdx") && !file.endsWith(".km.mdx"),
    )
    .map((file) =>
      readPost(
        path.join(BLOG_DIRECTORY, file),
        file.replace(lang === "km" ? ".km.mdx" : ".mdx", ""),
      ),
    );

  return posts.sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
  );
}
