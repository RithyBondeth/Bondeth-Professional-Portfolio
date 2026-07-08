import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { IPost } from "@/utils/interfaces/blog/blog.interface";
import { getReadingTime } from "./get-reading-time";

const BLOG_DIR = path.join(process.cwd(), "content/blog");

/* --------------------------------- Method ---------------------------------- */
/**
 * Loads a single blog post by its slug and parses its frontmatter.
 *
 * @param slug - The MDX file name without the extension
 * @returns The parsed post, or null when no matching file exists
 */
export async function getPostBySlug(slug: string): Promise<IPost | null> {
  const filePath = path.join(BLOG_DIR, `${slug}.mdx`);

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
    tags: data.tags,
    cover: data.cover ?? null,
    coverAlt: data.coverAlt ?? null,
    readingTime: getReadingTime(content),
    content,
  };
}
