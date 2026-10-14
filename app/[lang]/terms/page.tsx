import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { LegalPage } from "@/features/legal/components/legal-page";
import { hasLocale } from "@/shared/i18n";
import { getLegalDocument } from "@/features/legal/data/legal";

interface TermsPageProps {
  params: Promise<{ lang: string }>;
}

export async function generateMetadata({
  params,
}: TermsPageProps): Promise<Metadata> {
  const { lang } = await params;
  if (!hasLocale(lang)) return {};
  const document = getLegalDocument(lang, "terms");

  return {
    title: document.metaTitle,
    description: document.metaDescription,
    alternates: {
      canonical: `/${lang}/terms`,
      languages: { en: "/en/terms", km: "/km/terms", "x-default": "/en/terms" },
    },
  };
}

export default async function TermsPage({ params }: TermsPageProps) {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();

  return <LegalPage lang={lang} document={getLegalDocument(lang, "terms")} />;
}
