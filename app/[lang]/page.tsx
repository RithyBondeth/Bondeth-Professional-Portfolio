import type { Metadata } from "next";
import { notFound } from "next/navigation";
import LandingHero from "@/features/portfolio/components/hero/hero";
import LandingShowreel from "@/features/portfolio/components/showreel/showreel";
import LandingAbout from "@/features/portfolio/components/about/about";
import LandingCurrentFocus from "@/features/portfolio/components/current-focus/current-focus";
import LandingSkills from "@/features/portfolio/components/skills/skills";
import LandingExperience from "@/features/portfolio/components/experience/experience";
import LandingEducation from "@/features/portfolio/components/education/education";
import LandingServices from "@/features/portfolio/components/services/services";
import LandingProjects from "@/features/portfolio/components/projects/projects";
import LandingGithub from "@/features/portfolio/components/github/github";
import LandingWriting from "@/features/portfolio/components/writing/writing";
import LandingMedia from "@/features/portfolio/components/media/media";
import LandingRecommendations from "@/features/portfolio/components/recommendations/recommendations";
import LandingContact from "@/features/portfolio/components/contact/contact";
import { siteConfig } from "@/features/portfolio/data/portfolio";
import { hasLocale } from "@/shared/i18n";
import { getSiteConfig } from "@/features/portfolio/data/localized-content";

interface HomePageProps {
  params: Promise<{ lang: string }>;
}

export async function generateMetadata({
  params,
}: HomePageProps): Promise<Metadata> {
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

export default async function IndexPage({ params }: HomePageProps) {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();
  const localized = getSiteConfig(lang);

  const personJsonLd = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: localized.name,
    jobTitle: localized.title,
    url: `${siteConfig.url}/${lang}`,
    email: `mailto:${siteConfig.email}`,
    sameAs: [
      siteConfig.github,
      siteConfig.linkedin,
      siteConfig.facebook,
      siteConfig.instagram,
      siteConfig.youtube,
    ],
    address: {
      "@type": "PostalAddress",
      addressLocality: "Phnom Penh",
      addressCountry: "KH",
    },
  };

  return (
    // data-scroll-story: every reveal on this page also animates out as it
    // leaves the viewport (see the scroll-driven reveals in globals.css).
    <main id="main-content" tabIndex={-1} data-scroll-story>
      {/* Structured Data (JSON-LD) */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(personJsonLd).replace(/</g, "\\u003c"),
        }}
      />

      <LandingHero lang={lang} />
      <LandingShowreel lang={lang} />
      <LandingAbout lang={lang} />
      <LandingCurrentFocus lang={lang} />
      <LandingSkills lang={lang} />
      <LandingExperience lang={lang} />
      <LandingEducation lang={lang} />
      <LandingServices lang={lang} />
      <LandingProjects lang={lang} />
      <LandingGithub lang={lang} />
      <LandingWriting lang={lang} />
      <LandingMedia lang={lang} />
      <LandingRecommendations lang={lang} />
      <LandingContact lang={lang} />
    </main>
  );
}
