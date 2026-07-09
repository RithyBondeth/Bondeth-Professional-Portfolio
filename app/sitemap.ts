import type { MetadataRoute } from "next";
import { getAllPosts } from "@/utils/functions/blog";
import { projects, siteConfig } from "@/utils/constants/portfolio.constant";
import { locales } from "@/utils/i18n";

/* ---------------------------------- Utils ---------------------------------- */
function languageAlternates(path: string): Record<string, string> {
  return Object.fromEntries(
    locales.map((locale) => [locale, `${siteConfig.url}/${locale}${path}`]),
  );
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const postsByLocale = await Promise.all(
    locales.map(async (locale) => ({
      locale,
      posts: await getAllPosts(locale),
    })),
  );

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

    entries.push({
      url: `${siteConfig.url}/${locale}/projects`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.8,
      alternates: { languages: languageAlternates("/projects") },
    });

    entries.push(
      {
        url: `${siteConfig.url}/${locale}/labs`,
        lastModified: new Date(),
        changeFrequency: "monthly",
        priority: 0.7,
        alternates: { languages: languageAlternates("/labs") },
      },
      {
        url: `${siteConfig.url}/${locale}/labs/structured-output`,
        lastModified: new Date(),
        changeFrequency: "monthly",
        priority: 0.7,
        alternates: {
          languages: languageAlternates("/labs/structured-output"),
        },
      },
      {
        url: `${siteConfig.url}/${locale}/labs/rag-retrieval`,
        lastModified: new Date(),
        changeFrequency: "monthly",
        priority: 0.7,
        alternates: {
          languages: languageAlternates("/labs/rag-retrieval"),
        },
      },
      {
        url: `${siteConfig.url}/${locale}/labs/llm-evals`,
        lastModified: new Date(),
        changeFrequency: "monthly",
        priority: 0.7,
        alternates: {
          languages: languageAlternates("/labs/llm-evals"),
        },
      },
    );

    entries.push(
      ...projects
        .filter((project) => project.visibility !== "confidential")
        .map((project) => ({
          url: `${siteConfig.url}/${locale}/projects/${project.slug}`,
          lastModified: new Date(),
          changeFrequency: "monthly" as const,
          priority: project.visibility === "public" ? 0.7 : 0.5,
          alternates: {
            languages: languageAlternates(`/projects/${project.slug}`),
          },
        })),
    );
  }

  for (const { locale, posts } of postsByLocale) {
    entries.push({
      url: `${siteConfig.url}/${locale}/blog`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.8,
      alternates: { languages: languageAlternates("/blog") },
    });

    entries.push(
      ...posts.map((post) => ({
        url: `${siteConfig.url}/${locale}/blog/${post.slug}`,
        lastModified: new Date(post.date),
        changeFrequency: "yearly" as const,
        priority: 0.6,
        alternates: { languages: languageAlternates(`/blog/${post.slug}`) },
      })),
    );
  }

  return entries;
}
