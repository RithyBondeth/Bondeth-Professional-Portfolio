import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { LegalPage } from "@/features/legal/components/legal-page";
import { hasLocale } from "@/shared/i18n";
import { getLegalDocument } from "@/features/legal/data/legal";

interface PrivacyPageProps {
  params: Promise<{ lang: string }>;
}

export async function generateMetadata({
  params,
}: PrivacyPageProps): Promise<Metadata> {
  const { lang } = await params;
  if (!hasLocale(lang)) return {};
  const document = getLegalDocument(lang, "privacy");

  return {
    title: document.metaTitle,
    description: document.metaDescription,
    alternates: {
      canonical: `/${lang}/privacy`,
      languages: {
        en: "/en/privacy",
        km: "/km/privacy",
        "x-default": "/en/privacy",
      },
    },
  };
}

export default async function PrivacyPage({ params }: PrivacyPageProps) {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();

  return <LegalPage lang={lang} document={getLegalDocument(lang, "privacy")} />;
}
