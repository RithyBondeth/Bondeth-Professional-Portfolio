import { getAllPosts } from "./get-all-posts";
import type { TLocale } from "@/utils/i18n";

export interface ICategoryCount {
  /** Display category as authored in frontmatter, e.g. "Innovation" */
  category: string;
  /** URL/filter-safe slug, e.g. "innovation" */
  slug: string;
  /** Number of posts in this category */
  count: number;
}

/* --------------------------------- Method ---------------------------------- */
/**
 * Collects every broad category used across all posts, de-duplicated by slug,
 * with a count of how many posts use it. Sorted alphabetically for stable UI.
 */
export async function getAllCategories(
  lang: TLocale,
): Promise<ICategoryCount[]> {
  const posts = await getAllPosts(lang);
  const map = new Map<string, ICategoryCount>();

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

  return [...map.values()].sort((a, b) =>
    a.category.localeCompare(b.category),
  );
}
