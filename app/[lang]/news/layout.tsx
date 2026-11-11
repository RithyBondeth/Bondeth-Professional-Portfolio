import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getDictionary, hasLocale } from "@/shared/i18n";

type NewsParams = { params: Promise<{ lang: string }> };

export async function generateMetadata({
  params,
}: NewsParams): Promise<Metadata> {
  const { lang } = await params;
  if (!hasLocale(lang)) return {};
  const { news } = getDictionary(lang);

  return {
    title: news.heading,
    description: news.description,
    alternates: {
      canonical: `/${lang}/news`,
      languages: {
        en: "/en/news",
        km: "/km/news",
        "x-default": "/en/news",
      },
    },
  };
}

export default async function NewsLayout({
  children,
  params,
}: NewsParams & { children: React.ReactNode }) {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();
  const { news } = getDictionary(lang);

  return (
    <main
      id="main-content"
      tabIndex={-1}
      className="flex-1 px-6 pt-32 pb-16 font-sans sm:pb-24"
    >
      <div className="mx-auto max-w-5xl">
        <header className="mb-6">
          <h1
            id="news-heading"
            className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl"
          >
            {news.heading}
          </h1>
          <p className="mt-3 max-w-xl text-sm leading-relaxed text-field-muted-foreground">
            {news.description}
          </p>
        </header>
        {children}
      </div>
    </main>
  );
}
