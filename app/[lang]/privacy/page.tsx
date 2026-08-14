import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { LegalPage } from "@/components/legal/legal-page";
import { hasLocale } from "@/utils/i18n";
import { getLegalDocument } from "@/utils/i18n/legal";

interface IPrivacyPageProps {
  params: Promise<{ lang: string }>;
}

export async function generateMetadata({ params }: IPrivacyPageProps): Promise<Metadata> {
  const { lang } = await params;
  if (!hasLocale(lang)) return {};
  const document = getLegalDocument(lang, "privacy");

  return {
    title: document.metaTitle,
    description: document.metaDescription,
    alternates: {
      canonical: `/${lang}/privacy`,
      languages: { en: "/en/privacy", km: "/km/privacy", "x-default": "/en/privacy" },
    },
  };
}

export default async function PrivacyPage({ params }: IPrivacyPageProps) {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();

  return <LegalPage lang={lang} document={getLegalDocument(lang, "privacy")} />;
}
