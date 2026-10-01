import { ragExperienceCopy } from "@/components/labs/rag-experience-copy";
import { retrievePortfolioContext } from "@/utils/functions/labs/rag-retrieval";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { AnimateIn } from "@/components/utils/animations/animate-in";
import { RagRetrievalLab } from "@/components/labs/rag-retrieval-lab";
import { TopicCluster } from "@/components/topic-cluster";
import { getDictionary, hasLocale } from "@/utils/i18n";

interface IRagRetrievalPageProps {
  params: Promise<{ lang: string }>;
}

export async function generateMetadata({
  params,
}: IRagRetrievalPageProps): Promise<Metadata> {
  const { lang } = await params;
  if (!hasLocale(lang)) return {};
  const { labs } = getDictionary(lang);

  return {
    title: labs.ragTitle,
    description: labs.ragDescription,
    alternates: {
      canonical: `/${lang}/labs/rag-retrieval`,
      languages: {
        en: "/en/labs/rag-retrieval",
        km: "/km/labs/rag-retrieval",
        "x-default": "/en/labs/rag-retrieval",
      },
    },
  };
}

export default async function RagRetrievalPage({
  params,
}: IRagRetrievalPageProps) {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();
  const { labs } = getDictionary(lang);

  const copy = lang === "km" ? ragExperienceCopy.km : ragExperienceCopy.en;

  return (
    <main
      id="main-content"
      tabIndex={-1}
      className="flex-1 px-6 pb-16 sm:pb-24 pt-32 font-sans"
    >
      <div className="mx-auto max-w-6xl">
        <AnimateIn>
          <Link
            href={`/${lang}/labs`}
            className="inline-flex min-h-10 items-center gap-2 rounded-full border border-border/60 bg-card px-4 text-xs font-medium text-field-muted-foreground transition-colors hover:border-primary/30 hover:text-primary"
          >
            <span aria-hidden>←</span>
            {labs.backToLabs}
          </Link>

          <div className="mt-5 flex flex-wrap items-center gap-2">
            <span className="rounded-full border border-primary/20 bg-primary/5 px-3 py-1 text-xs font-medium text-primary">
              {labs.ragTitle}
            </span>
            <span className="rounded-full border border-status-success/25 bg-status-success/5 px-3 py-1 text-xs font-medium text-status-success">
              {labs.rag.localMode}
            </span>
          </div>

          <h1 className="mt-5 text-4xl font-bold text-foreground sm:text-5xl">
            {copy.heading}
          </h1>
          <p className="mt-4 max-w-3xl text-sm leading-relaxed text-field-muted-foreground">
            {copy.intro}
          </p>
        </AnimateIn>

        <AnimateIn from="up" delay={0.08} className="mt-10">
          <RagRetrievalLab labels={labs.rag} lang={lang} initialResult={retrievePortfolioContext(labs.rag.presets[0].value)} />
        </AnimateIn>

        {/* Supersedes the old single "related reading" link — the cluster
            surfaces the note and video alongside the same blog post. */}
        <TopicCluster lang={lang} current="lab" hubSlug="rag-in-60-seconds" />
      </div>
    </main>
  );
}
