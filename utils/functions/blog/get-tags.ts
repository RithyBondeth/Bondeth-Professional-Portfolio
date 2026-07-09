import type { IPost } from "@/utils/interfaces/blog/blog.interface";
import { getAllPosts } from "./get-all-posts";
import { slugifyTag } from "./slugify-tag";
import type { TLocale } from "@/utils/i18n";

export interface ITagCount {
  /** Display tag as authored in frontmatter, e.g. "Next.js" */
  tag: string;
  /** URL-safe slug, e.g. "next-js" */
  slug: string;
  /** Number of posts carrying this tag */
  count: number;
}

/* --------------------------------- Method ---------------------------------- */
/**
 * Collects every tag used across all posts, de-duplicated by slug, with a count
 * of how many posts use it. Sorted by count (desc) then alphabetically.
 */
export async function getAllTags(lang: TLocale): Promise<ITagCount[]> {
  const posts = await getAllPosts(lang);
  const map = new Map<string, ITagCount>();

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

/* --------------------------------- Method ---------------------------------- */
/**
 * Returns the posts carrying the tag whose slug matches `slug`, along with the
 * tag's display form (or null when no post uses it).
 *
 * @param slug - URL-safe tag slug from the route param
 */
export async function getPostsByTag(
  slug: string,
  lang: TLocale,
): Promise<{ tag: string | null; posts: IPost[] }> {
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
