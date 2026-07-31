import Link from "next/link";
import { Section, SectionHeader } from "@/components/ui/section";
import { IndexRow } from "@/components/ui/index-row";
import { getProjects } from "@/utils/i18n/content";
import { getDictionary, type TLocale } from "@/utils/i18n";

/**
 * Selected work.
 *
 * Four featured projects as an index, with a link through to the full archive
 * in the section header. The previous version pinned the page and scrolled the
 * projects sideways — a strong effect, but it hijacked the scrollbar, hid the
 * project titles behind a gesture most readers never make, and meant the only
 * way to see the fourth project was to keep scrolling in place.
 *
 * Confidential projects have no detail route, so they link to the archive
 * instead, where the confidentiality notice is explained.
 */
const FEATURED_SLUGS = [
  "apsara-agentic",
  "apsara-assistant",
  "apsara-elearning",
  "apsara-talent",
];

export default function LandingProjects({ lang }: { lang: TLocale }) {
  const dict = getDictionary(lang);
  const projects = getProjects(lang);

  const featured = FEATURED_SLUGS.map((slug) =>
    projects.find((project) => project.slug === slug),
  ).filter((project) => project !== undefined);

  return (
    <Section id="projects">
      <SectionHeader
        numeral="07"
        label={dict.sections.projects}
        title={dict.projects.heading}
        lead={dict.projects.featuredBlurb}
        action={
          <Link
            href={`/${lang}/projects`}
            className="btn-fx link-wipe text-sm text-muted-foreground hover:text-foreground"
          >
            {dict.projects.viewAllProjects}
            <span aria-hidden className="ml-2">
              →
            </span>
          </Link>
        }
      />

      <div className="mt-16 border-t border-rule">
        {featured.map((project, i) => (
          <IndexRow
            key={project.slug}
            href={
              project.visibility === "confidential"
                ? `/${lang}/projects`
                : `/${lang}/projects/${project.slug}`
            }
            title={project.title}
            description={project.description}
            image={project.image ?? undefined}
            imageAlt={project.title}
            fallbackChar={project.title.charAt(0)}
            kicker={project.category}
            meta={project.tags.slice(0, 4)}
            delay={i * 70}
          />
        ))}
      </div>
    </Section>
  );
}
