import "server-only";

import type { Post } from "@/features/blog/domain/types";
import { getAllPosts } from "@/features/blog/server/get-all-posts";
import { slugifyTag } from "@/features/blog/domain/slugify-tag";
import type { Locale } from "@/shared/i18n";

export interface TagCount {
  /** Display tag as authored in frontmatter, e.g. "Next.js" */
  tag: string;
  /** URL-safe slug, e.g. "next-js" */
  slug: string;
  /** Number of posts carrying this tag */
  count: number;
}

/**
 * Collects every tag used across all posts, de-duplicated by slug, with a count
 * of how many posts use it. Sorted by count (desc) then alphabetically.
 */
export async function getAllTags(lang: Locale): Promise<TagCount[]> {
  const posts = await getAllPosts(lang);
  const map = new Map<string, TagCount>();

  for (const post of posts) {
    for (const tag of post.tags) {
      const slug = slugifyTag(tag);
      const existing = map.get(slug);
      if (existing) existing.count += 1;
      else map.set(slug, { tag, slug, count: 1 });
    }
  }

  return [...map.values()].sort(
    (a, b) => b.count - a.count || a.tag.localeCompare(b.tag),
  );
}

/**
 * Returns the posts carrying the tag whose slug matches `slug`, along with the
 * tag's display form (or null when no post uses it).
 *
 * @param slug - URL-safe tag slug from the route param
 */
export async function getPostsByTag(
  slug: string,
  lang: Locale,
): Promise<{ tag: string | null; posts: Post[] }> {
  const posts = await getAllPosts(lang);
  let tag: string | null = null;

  const matched = posts.filter((post) =>
    post.tags.some((t) => {
      if (slugifyTag(t) === slug) {
        tag = t;
        return true;
      }
      return false;
    }),
  );

  return { tag, posts: matched };
}
