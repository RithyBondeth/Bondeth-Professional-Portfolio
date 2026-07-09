/* --------------------------------- Method ---------------------------------- */
/**
 * Turns a display tag into a URL-safe slug.
 * "Next.js" -> "next-js", "Open Graph" -> "open-graph", "API Routes" -> "api-routes"
 *
 * Kept free of Node APIs so it can be imported from both server helpers and
 * client components (e.g. to build tag links in the blog search UI).
 */
export function slugifyTag(tag: string): string {
  return tag
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}
