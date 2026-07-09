import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { IPost } from "@/utils/interfaces/blog/blog.interface";
import { getReadingTime } from "./get-reading-time";
import type { TLocale } from "@/utils/i18n";

const BLOG_DIR = path.join(process.cwd(), "content/blog");

/* --------------------------------- Method ---------------------------------- */
/**
 * Reads every MDX file in the blog content directory, parses its
 * frontmatter, and returns the posts sorted by date (newest first).
 *
 * @returns All blog posts, or an empty array when the directory is missing
 */
export async function getAllPosts(lang: TLocale = "en"): Promise<IPost[]> {
  if (!fs.existsSync(BLOG_DIR)) {
    return [];
  }

  const files = fs.readdirSync(BLOG_DIR);

  const posts = files
    .filter((file) =>
      lang === "km"
        ? file.endsWith(".km.mdx")
        : file.endsWith(".mdx") && !file.endsWith(".km.mdx"),
    )
    .map((file) => {
      const filePath = path.join(BLOG_DIR, file);
      const fileContent = fs.readFileSync(filePath, "utf-8");
      const { data, content } = matter(fileContent);

      return {
        slug: file.replace(lang === "km" ? ".km.mdx" : ".mdx", ""),
        title: data.title,
        date: data.date,
        excerpt: data.excerpt,
        category: data.category ?? "Tech",
        tags: data.tags,
        cover: data.cover ?? null,
        coverAlt: data.coverAlt ?? null,
        readingTime: getReadingTime(content),
        content,
      };
    });

  return posts.sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
  );
}
