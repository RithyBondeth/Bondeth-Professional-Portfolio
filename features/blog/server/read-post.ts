import "server-only";

import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import type { Post } from "@/features/blog/domain/types";
import { getReadingTime } from "@/features/blog/domain/get-reading-time";

export const BLOG_DIRECTORY = path.join(process.cwd(), "content/blog");

/** Maps MDX frontmatter identically for listings and detail pages. */
export function readPost(filePath: string, slug: string): Post {
  const { data, content } = matter(fs.readFileSync(filePath, "utf8"));

  return {
    slug,
    title: data.title,
    date: data.date,
    excerpt: data.excerpt,
    category: data.category ?? "Tech",
    tags: data.tags,
    format: data.format ?? "article",
    series: data.series ?? null,
    source: data.source ?? null,
    relatedPost: data.relatedPost ?? null,
    relatedLab: data.relatedLab ?? null,
    relatedVideo: data.relatedVideo ?? null,
    cover: data.cover ?? null,
    coverAlt: data.coverAlt ?? null,
    readingTime: getReadingTime(content),
    content,
  };
}
