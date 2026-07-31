import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { LabPage } from "@/components/labs/lab-page";
import { LlmEvalLab } from "@/components/labs/llm-eval-lab";
import { getDictionary, hasLocale } from "@/utils/i18n";

interface ILlmEvalsPageProps {
  params: Promise<{ lang: string }>;
}

export async function generateMetadata({
  params,
}: ILlmEvalsPageProps): Promise<Metadata> {
  const { lang } = await params;
  if (!hasLocale(lang)) return {};
  const { labs } = getDictionary(lang);

  return {
    title: labs.evalTitle,
    description: labs.evalDescription,
    alternates: {
      canonical: `/${lang}/labs/llm-evals`,
      languages: {
        en: "/en/labs/llm-evals",
        km: "/km/labs/llm-evals",
        "x-default": "/en/labs/llm-evals",
      },
    },
  };
}

export default async function LlmEvalsPage({
  params,
}: ILlmEvalsPageProps) {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();
  const { labs } = getDictionary(lang);

  return (
    <LabPage
      lang={lang}
      backLabel={labs.backToLabs}
      status={[labs.experimental, labs.evals.localMode]}
      title={labs.evalTitle}
      intro={labs.evals.intro}
      steps={labs.evals.steps}
      relatedReadingLabel={labs.evals.relatedReading}
      relatedArticleLabel={labs.evals.relatedArticle}
      relatedHref={`/${lang}/blog/designing-llm-evals-that-catch-regressions`}
    >
      <LlmEvalLab labels={labs.evals} />
    </LabPage>
  );
}
