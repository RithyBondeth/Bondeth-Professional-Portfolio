import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { LabPage } from "@/components/labs/lab-page";
import { StructuredOutputLab } from "@/components/labs/structured-output-lab";
import { getDictionary, hasLocale } from "@/utils/i18n";

interface IStructuredOutputPageProps {
  params: Promise<{ lang: string }>;
}

export async function generateMetadata({
  params,
}: IStructuredOutputPageProps): Promise<Metadata> {
  const { lang } = await params;
  if (!hasLocale(lang)) return {};
  const { labs } = getDictionary(lang);

  return {
    title: labs.structuredOutputTitle,
    description: labs.structuredOutputDescription,
    alternates: {
      canonical: `/${lang}/labs/structured-output`,
      languages: {
        en: "/en/labs/structured-output",
        km: "/km/labs/structured-output",
        "x-default": "/en/labs/structured-output",
      },
    },
  };
}

export default async function StructuredOutputPage({
  params,
}: IStructuredOutputPageProps) {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();
  const { labs } = getDictionary(lang);

  return (
    <LabPage
      lang={lang}
      backLabel={labs.backToLabs}
      status={[labs.experimental, labs.playground.localMode]}
      title={labs.structuredOutputTitle}
      intro={labs.playground.intro}
      steps={labs.playground.steps}
      relatedReadingLabel={labs.playground.relatedReading}
      relatedArticleLabel={labs.playground.relatedArticle}
      relatedHref={`/${lang}/blog/structured-outputs-tool-calling-llms`}
    >
      <StructuredOutputLab labels={labs.playground} />
    </LabPage>
  );
}
