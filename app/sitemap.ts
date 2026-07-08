import type { MetadataRoute } from "next";
import { getAllPosts } from "@/utils/functions/blog";
import { siteConfig } from "@/utils/constants/portfolio.constant";
import { locales } from "@/utils/i18n";

/* ---------------------------------- Utils ---------------------------------- */
function languageAlternates(path: string): Record<string, string> {
  return Object.fromEntries(
    locales.map((locale) => [locale, `${siteConfig.url}/${locale}${path}`])
  );
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const posts = await getAllPosts();

  const entries: MetadataRoute.Sitemap = [];

  for (const locale of locales) {
    entries.push(
      {
        url: `${siteConfig.url}/${locale}`,
        lastModified: new Date(),
        changeFrequency: "monthly",
        priority: 1,
        alternates: { languages: languageAlternates("") },
      },
      {
        url: `${siteConfig.url}/${locale}/blog`,
        lastModified: new Date(),
        changeFrequency: "weekly",
        priority: 0.8,
        alternates: { languages: languageAlternates("/blog") },
      },
      ...posts.map((post) => ({
        url: `${siteConfig.url}/${locale}/blog/${post.slug}`,
        lastModified: new Date(post.date),
        changeFrequency: "yearly" as const,
        priority: 0.6,
        alternates: { languages: languageAlternates(`/blog/${post.slug}`) },
      }))
    );
  }

  return entries;
}
