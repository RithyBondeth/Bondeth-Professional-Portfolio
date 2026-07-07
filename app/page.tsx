import type { Metadata } from "next";
import LandingHero from "@/components/landing/landing-hero";
import LandingAbout from "@/components/landing/landing-about";
import LandingSkills from "@/components/landing/landing-skills";
import LandingExperience from "@/components/landing/landing-experience";
import LandingEducation from "@/components/landing/landing-education";
import LandingProjects from "@/components/landing/landing-projects";
import LandingContact from "@/components/landing/landing-contact";
import { siteConfig } from "@/utils/constants/portfolio.constant";

/* --------------------------------- Metadata --------------------------------- */
export const metadata: Metadata = {
  // `alternates` replaces the root layout's object wholesale,
  // so the RSS type must be re-declared alongside the canonical.
  alternates: {
    canonical: "/",
    types: {
      "application/rss+xml": "/feed.xml",
    },
  },
};

/* ------------------------------ Structured Data ----------------------------- */
const personJsonLd = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: siteConfig.name,
  jobTitle: siteConfig.title,
  url: siteConfig.url,
  email: `mailto:${siteConfig.email}`,
  sameAs: [siteConfig.github, siteConfig.linkedin],
  address: {
    "@type": "PostalAddress",
    addressLocality: "Phnom Penh",
    addressCountry: "KH",
  },
};

export default function IndexPage() {
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
      <LandingHero />

      {/* Section 2: About */}
      <LandingAbout />

      {/* Section 3: Skills */}
      <LandingSkills />

      {/* Section 4: Experience */}
      <LandingExperience />

      {/* Section 5: Education */}
      <LandingEducation />

      {/* Section 6: Projects */}
      <LandingProjects />

      {/* Section 7: Contact */}
      <LandingContact />
    </main>
  );
}
