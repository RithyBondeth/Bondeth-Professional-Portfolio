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

  // Localized pages: one entry per locale, cross-linked with hreflang alternates.
  for (const locale of locales) {
    entries.push({
      url: `${siteConfig.url}/${locale}`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 1,
      alternates: { languages: languageAlternates("") },
    });
  }

  // The blog is English-only, so it appears once under /en with no alternates.
  entries.push(
    {
      url: `${siteConfig.url}/en/blog`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.8,
    },
    ...posts.map((post) => ({
      url: `${siteConfig.url}/en/blog/${post.slug}`,
      lastModified: new Date(post.date),
      changeFrequency: "yearly" as const,
      priority: 0.6,
    }))
  );

  return entries;
}
