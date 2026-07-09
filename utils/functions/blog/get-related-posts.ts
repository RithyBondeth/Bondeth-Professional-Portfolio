import type { IPost } from "@/utils/interfaces/blog/blog.interface";
import { getAllPosts } from "./get-all-posts";
import type { TLocale } from "@/utils/i18n";

/* --------------------------------- Method ---------------------------------- */
/**
 * Finds posts related to the given one, ranked by number of shared tags and
 * then recency. Posts with no shared tags still fill the remaining slots so a
 * post always has suggestions to show.
 *
 * @param slug - The current post's slug (excluded from the results)
 * @param tags - The current post's tags, used to score relatedness
 * @param limit - Maximum number of posts to return (defaults to 3)
 */
export async function getRelatedPosts(
  slug: string,
  tags: string[],
  lang: TLocale,
  limit = 3,
): Promise<IPost[]> {
  const posts = await getAllPosts(lang);

  return posts
    .filter((post) => post.slug !== slug)
    .map((post) => ({
      post,
      score: post.tags.filter((tag) => tags.includes(tag)).length,
    }))
    .sort(
      (a, b) =>
        b.score - a.score ||
        new Date(b.post.date).getTime() - new Date(a.post.date).getTime(),
    )
    .slice(0, limit)
    .map(({ post }) => post);
}
