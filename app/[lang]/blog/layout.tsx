import type { Metadata } from "next";
import { siteConfig } from "@/utils/constants/portfolio.constant";
import { hasLocale, getDictionary } from "@/utils/i18n";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>;
}): Promise<Metadata> {
  const { lang } = await params;
  if (!hasLocale(lang)) return {};
  const dict = getDictionary(lang);

  return {
    // A plain-string title here would wipe the root template for child
    // segments, so blog posts re-declare it to keep the "— Name" suffix.
    title: {
      default: dict.meta.blogTitle,
      template: `%s — ${siteConfig.name}`,
    },
    description: dict.meta.blogDescription,
    alternates: {
      canonical: `/${lang}/blog`,
      languages: {
        en: "/en/blog",
        km: "/km/blog",
        "x-default": "/en/blog",
      },
      types: {
        "application/rss+xml": "/feed.xml",
      },
    },
  };
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
