import Link from "next/link";
import { SkillIconSprite } from "@/features/portfolio/components/skills/skill-icon-sprite";
import { techIconKeys } from "@/features/portfolio/components/projects/tech-icon-map";
import { AnimateIn } from "@/shared/components/motion/animate-in";
import { SectionHeading } from "@/features/portfolio/components/section-heading";
import { ProjectCard } from "@/features/portfolio/components/projects/project-card";
import { getProjects } from "@/features/portfolio/data/localized-content";
import { getDictionary, type Locale } from "@/shared/i18n";

/** Featured hiring platform, native macOS utility, and creator toolkit. */
const FEATURED_SLUGS = ["apsara-talent", "bondex-notch", "bondeth-studio"];

export default function LandingProjects(props: { lang: Locale }) {
  const { lang } = props;
  const dict = getDictionary(lang);
  const projects = getProjects(lang);
  const featured = FEATURED_SLUGS.map((slug) =>
    projects.find((project) => project.slug === slug),
  ).filter((project) => project !== undefined);

  const header = (
    <div>
      <AnimateIn from="zoom-in">
        <p className="mb-1 font-mono text-xs uppercase tracking-[0.25em] text-primary">
          {lang === "km" ? "ស្នាដៃដែលបានជ្រើសរើស" : "Selected work"}
        </p>
      </AnimateIn>

      <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
        <div>
          <SectionHeading
            section="projects"
            className="mt-3 text-3xl font-bold text-foreground sm:text-4xl lg:text-5xl"
          >
            {dict.projects.heading}
          </SectionHeading>
          <AnimateIn from="up" distance={24} delay={0.1}>
            <p className="mt-3 max-w-2xl text-sm leading-relaxed text-field-muted-foreground">
              {dict.projects.featuredBlurb}
            </p>
          </AnimateIn>
        </div>

        <AnimateIn from="right" distance={30} delay={0.08}>
          <Link
            href={`/${lang}/projects`}
            className="inline-flex min-h-11 shrink-0 items-center gap-2 rounded-lg border border-primary/30 px-4 font-mono text-xs text-primary transition-colors hover:bg-primary/5"
          >
            {dict.projects.viewAllProjects}
            <span aria-hidden>→</span>
          </Link>
        </AnimateIn>
      </div>
    </div>
  );

  return (
    <section
      id="projects"
      className="relative isolate px-6 py-16 sm:py-20 lg:py-24"
    >
      {/* Icon geometry for the featured cards' tech badges. */}
      <SkillIconSprite
        icons={featured.flatMap((project) => techIconKeys(project.tags))}
      />
      <div className="mx-auto max-w-6xl">
        {header}
        <div className="mt-10 grid gap-6 lg:grid-cols-3">
          {featured.map((project, index) => (
            <AnimateIn
              key={project.slug}
              from="up"
              delay={index * 0.08}
              className="min-w-0"
            >
              <ProjectCard project={project} dict={dict} lang={lang} />
            </AnimateIn>
          ))}
        </div>
      </div>
    </section>
  );
}
