import type { Metadata } from "next";
import { notFound } from "next/navigation";
import LandingHero from "@/components/landing/landing-hero";
import LandingAbout from "@/components/landing/landing-about";
import LandingCurrentFocus from "@/components/landing/landing-current-focus";
import LandingSkills from "@/components/landing/landing-skills";
import LandingExperience from "@/components/landing/landing-experience";
import LandingEducation from "@/components/landing/landing-education";
import LandingServices from "@/components/landing/landing-services";
import LandingProjects from "@/components/landing/landing-projects";
import LandingRecommendations from "@/components/landing/landing-recommendations";
import LandingContact from "@/components/landing/landing-contact";
import { siteConfig } from "@/utils/constants/portfolio.constant";
import { hasLocale } from "@/utils/i18n";
import { getSiteConfig } from "@/utils/i18n/content";

interface IHomePageProps {
  params: Promise<{ lang: string }>;
}

/* --------------------------------- Metadata --------------------------------- */
export async function generateMetadata({
  params,
}: IHomePageProps): Promise<Metadata> {
  const { lang } = await params;

  return {
    // `alternates` replaces the layout's object wholesale,
    // so the RSS type must be re-declared alongside the canonical.
    alternates: {
      canonical: `/${lang}`,
      languages: {
        en: "/en",
        km: "/km",
        "x-default": "/en",
      },
      types: {
        "application/rss+xml": "/feed.xml",
      },
    },
  };
}

export default async function IndexPage({ params }: IHomePageProps) {
  /* ---------------------------------- Utils --------------------------------- */
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();
  const localized = getSiteConfig(lang);

  /* ------------------------------ Structured Data ----------------------------- */
  const personJsonLd = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: localized.name,
    jobTitle: localized.title,
    url: `${siteConfig.url}/${lang}`,
    email: `mailto:${siteConfig.email}`,
    sameAs: [siteConfig.github, siteConfig.linkedin],
    address: {
      "@type": "PostalAddress",
      addressLocality: "Phnom Penh",
      addressCountry: "KH",
    },
  };

  /* -------------------------------- Render UI ------------------------------- */
  return (
    <main>
      {/* Structured Data (JSON-LD) */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(personJsonLd).replace(/</g, "\\u003c"),
        }}
      />

      {/* Section 1: Hero */}
      <LandingHero lang={lang} />

      {/* Section 2: About */}
      <LandingAbout lang={lang} />

      {/* Section 3: Current Focus */}
      <LandingCurrentFocus lang={lang} />

      {/* Section 4: Skills */}
      <LandingSkills lang={lang} />

      {/* Section 5: Experience */}
      <LandingExperience lang={lang} />

      {/* Section 6: Education */}
      <LandingEducation lang={lang} />

      {/* Section 7: Services */}
      <LandingServices lang={lang} />

      {/* Section 8: Projects */}
      <LandingProjects lang={lang} />

      {/* Section 9: Recommendations */}
      <LandingRecommendations lang={lang} />

      {/* Section 10: Contact */}
      <LandingContact lang={lang} />
    </main>
  );
}
