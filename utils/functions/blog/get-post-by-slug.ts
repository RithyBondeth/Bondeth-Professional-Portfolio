import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { IPost } from "@/utils/interfaces/blog";
import { getReadingTime } from "./get-reading-time";
import type { TLocale } from "@/utils/i18n";

const BLOG_DIR = path.join(process.cwd(), "content/blog");

/* --------------------------------- Method ---------------------------------- */
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
  lang: TLocale = "en",
): Promise<IPost | null> {
  const preferred = path.join(
    BLOG_DIR,
    lang === "km" ? `${slug}.km.mdx` : `${slug}.mdx`,
  );
  const fallback = path.join(BLOG_DIR, `${slug}.mdx`);
  const filePath = fs.existsSync(preferred) ? preferred : fallback;

  if (!fs.existsSync(filePath)) {
    return null;
  }

  const fileContent = fs.readFileSync(filePath, "utf-8");
  const { data, content } = matter(fileContent);

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
