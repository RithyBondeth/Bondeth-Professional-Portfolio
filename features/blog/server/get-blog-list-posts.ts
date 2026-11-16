import "server-only";

import type { Post } from "@/features/blog/domain/types";
import type { Locale } from "@/shared/i18n";

export type BlogListPost = ReturnType<typeof getBlogListPosts>[number];

export function getBlogListPosts(posts: Post[], lang: Locale) {
  // Send the displayed date with the metadata so browser locale support and
  // time zones cannot change the text during hydration.
  const dateLocale = lang === "km" ? "km-KH" : "en-US";

  return posts.map(
    ({
      slug,
      title,
      date,
      excerpt,
      category,
      tags,
      cover,
      coverAlt,
      readingTime,
      format,
    }) => ({
      slug,
      title,
      date,
      dateLabel: new Date(date).toLocaleDateString(dateLocale, {
        month: "short",
        day: "numeric",
        year: "numeric",
        timeZone: "UTC",
      }),
      excerpt,
      category,
      tags,
      cover,
      coverAlt,
      readingTime,
      format,
    }),
  );
}
