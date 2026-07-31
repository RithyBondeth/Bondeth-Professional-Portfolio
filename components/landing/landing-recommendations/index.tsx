import Link from "next/link";
import { Section, SectionHeader } from "@/components/ui/section";
import { Reveal } from "@/components/utils/animations/reveal";
import { siteConfig } from "@/utils/constants/portfolio.constant";
import { getDictionary, type TLocale } from "@/utils/i18n";

/**
 * References.
 *
 * Three claims a referee can speak to, then the confidentiality note set apart
 * as a pull quote — it is the most important sentence in the section and was
 * previously buried inside a shield-icon card alongside everything else.
 */
export default function LandingRecommendations({ lang }: { lang: TLocale }) {
  const { recommendations, sections } = getDictionary(lang);

  return (
    <Section id="recommendations">
      <SectionHeader
        numeral="08"
        label={sections.references}
        title={recommendations.heading}
        lead={recommendations.blurb}
        action={
          <a
            href={siteConfig.linkedin}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-fx link-wipe text-sm text-muted-foreground hover:text-foreground"
          >
            {recommendations.viewLinkedIn}
            <span aria-hidden className="ml-2">
              ↗
            </span>
          </a>
        }
      />

      <div className="mt-16 border-t border-rule">
        {recommendations.items.map((item, i) => (
          <Reveal key={item.title} delay={i * 70}>
            <div className="grid gap-x-10 gap-y-3 border-b border-rule py-8 lg:grid-cols-12">
              <h3 className="text-lg leading-snug text-foreground lg:col-span-3">
                {item.title}
              </h3>
              <p className="measure leading-relaxed text-muted-foreground lg:col-span-9">
                {item.body}
              </p>
            </div>
          </Reveal>
        ))}
      </div>

      {/* ── Confidentiality ───────────────────────────────────────────────
          Set as a pull quote: display type, indented into the wide column,
          with a marker rule at the left. */}
      <Reveal delay={160}>
        <figure className="mt-16 grid gap-x-10 lg:grid-cols-12">
          <div className="border-l-2 border-marker pl-6 lg:col-span-9 lg:col-start-4">
            <p className="eyebrow">{recommendations.privacyTitle}</p>
            <blockquote className="display-sm mt-4 text-balance">
              {recommendations.privacyBody}
            </blockquote>
            <Link
              href="#contact"
              className="btn-fx link-wipe mt-6 inline-block text-sm"
            >
              {recommendations.requestReference}
              <span aria-hidden className="ml-2">
                →
              </span>
            </Link>
          </div>
        </figure>
      </Reveal>
    </Section>
  );
}
