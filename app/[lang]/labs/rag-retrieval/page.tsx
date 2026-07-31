import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { LabPage } from "@/components/labs/lab-page";
import { RagRetrievalLab } from "@/components/labs/rag-retrieval-lab";
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

  return (
    <LabPage
      lang={lang}
      backLabel={labs.backToLabs}
      status={[labs.experimental, labs.rag.localMode]}
      title={labs.ragTitle}
      intro={labs.rag.intro}
      steps={labs.rag.steps}
      relatedReadingLabel={labs.rag.relatedReading}
      relatedArticleLabel={labs.rag.relatedArticle}
      relatedHref={`/${lang}/blog/rag-pgvector-postgres`}
    >
      <RagRetrievalLab labels={labs.rag} />
    </LabPage>
  );
}
