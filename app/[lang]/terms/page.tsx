import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { LegalPage } from "@/components/legal/legal-page";
import { hasLocale } from "@/utils/i18n";
import { getLegalDocument } from "@/utils/i18n/legal";

interface ITermsPageProps {
  params: Promise<{ lang: string }>;
}

export async function generateMetadata({ params }: ITermsPageProps): Promise<Metadata> {
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

export default async function TermsPage({ params }: ITermsPageProps) {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();

  return <LegalPage lang={lang} document={getLegalDocument(lang, "terms")} />;
}
