import "server-only";

import { getAllPosts } from "@/features/blog/server/get-all-posts";
import type { Locale } from "@/shared/i18n";

export interface CategoryCount {
  /** Display category as authored in frontmatter, e.g. "Innovation" */
  category: string;
  /** URL/filter-safe slug, e.g. "innovation" */
  slug: string;
  /** Number of posts in this category */
  count: number;
}

/**
 * Collects every broad category used across all posts, de-duplicated by slug,
 * with a count of how many posts use it. Sorted alphabetically for stable UI.
 */
export async function getAllCategories(lang: Locale): Promise<CategoryCount[]> {
  const posts = await getAllPosts(lang);
  const map = new Map<string, CategoryCount>();

  for (const post of posts) {
    const key = post.category.trim().toLocaleLowerCase();
    const existing = map.get(key);
    if (existing) existing.count += 1;
    else {
      map.set(key, {
        category: post.category,
        slug: encodeURIComponent(key),
        count: 1,
      });
    }
  }

  return [...map.values()].sort((a, b) => a.category.localeCompare(b.category));
}
