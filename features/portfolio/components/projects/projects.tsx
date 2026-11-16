import Link from "next/link";
import { ArrowUpRight, Box } from "lucide-react";
import { SkillIconSprite } from "@/features/portfolio/components/skills/skill-icon-sprite";
import { techIconKeys } from "@/features/portfolio/components/projects/tech-icon-map";
import { AnimateIn } from "@/shared/components/motion/animate-in";
import { SectionHeading } from "@/features/portfolio/components/section-heading";
import { ProjectCard } from "@/features/portfolio/components/projects/project-card";
import { getProjects } from "@/features/portfolio/data/localized-content";
import { siteConfig } from "@/features/portfolio/data/portfolio";
import { formatCount, getDictionary, type Locale } from "@/shared/i18n";

/** Featured hiring platform, native macOS utility, and creator toolkit. */
const FEATURED_SLUGS = ["apsara-talent", "bondex-notch", "bondeth-studio"];

export default function LandingProjects(props: { lang: Locale }) {
  const { lang } = props;
  const dict = getDictionary(lang);
  const projects = getProjects(lang);
  const featured = FEATURED_SLUGS.map((slug) =>
    projects.find((project) => project.slug === slug),
  ).filter((project) => project !== undefined);

  const profileCount = projects.filter(
    (project) => project.visibility !== "confidential",
  ).length;

  return (
    <section
      id="projects"
      className="relative isolate px-6 py-10 sm:py-16 lg:py-24"
    >
      {/* Icon geometry for the featured cards' tech badges. */}
      <SkillIconSprite
        icons={featured.flatMap((project) => techIconKeys(project.tags))}
      />
      <div className="mx-auto max-w-6xl">
        <SectionHeading
          section="projects"
          className="text-3xl font-bold text-foreground sm:text-4xl lg:text-5xl"
        >
          {dict.projects.heading}
        </SectionHeading>
        <AnimateIn from="up" distance={24} delay={0.1}>
          <p className="mt-3 max-w-2xl text-sm leading-relaxed text-field-muted-foreground">
            {dict.projects.featuredBlurb}
          </p>
        </AnimateIn>
        <div className="mt-6 grid gap-6 lg:mt-10 lg:grid-cols-3">
          {featured.map((project, index) => (
            <AnimateIn
              key={project.slug}
              from="up"
              delay={index * 0.08}
              className="min-w-0"
            >
              <ProjectCard project={project} dict={dict} lang={lang} featured />
            </AnimateIn>
          ))}
        </div>
        <div className="mt-8 flex flex-wrap items-center justify-between gap-x-6 border-t border-border/60 pt-3">
          <div className="flex flex-wrap items-center gap-x-3">
            <Link
              href={`/${lang}/projects`}
              className="inline-flex min-h-11 items-center gap-2 rounded-sm text-sm font-semibold text-primary hover:underline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary"
            >
              {dict.projects.viewAllProjects}
              <span aria-hidden>→</span>
            </Link>
            <span className="text-xs text-field-muted-foreground">
              {formatCount(profileCount, lang)} {dict.projects.projectProfiles}
            </span>
          </div>
          <a
            href={siteConfig.world3d}
            target="_blank"
            rel="noopener"
            className="inline-flex min-h-11 items-center gap-2 rounded-sm text-sm font-semibold text-field-muted-foreground underline decoration-primary/50 underline-offset-4 hover:text-primary focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary"
          >
            <Box size={14} aria-hidden="true" />
            {dict.hero.world3d}
            <ArrowUpRight size={14} aria-hidden="true" />
          </a>
        </div>
      </div>
    </section>
  );
}
