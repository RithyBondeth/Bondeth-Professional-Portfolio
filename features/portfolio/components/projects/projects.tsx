import Link from "next/link";
import { SkillIconSprite } from "@/features/portfolio/components/skills/skill-icon-sprite";
import { techIconKeys } from "@/features/portfolio/components/projects/tech-icon-map";
import { AnimateIn } from "@/shared/components/motion/animate-in";
import { SectionHeading } from "@/features/portfolio/components/section-heading";
import { HorizontalScroll } from "@/shared/components/motion/horizontal-scroll";
import { ProjectCard } from "@/features/portfolio/components/projects/project-card";
import { getProjects } from "@/features/portfolio/data/localized-content";
import { getDictionary, type Locale } from "@/shared/i18n";

/**
 * The homepage strip — Bondeth's own selection: the native macOS app first,
 * then the Apsara product line.
 *
 * Public-sector work is deliberately not here. It gets its own labelled section
 * on /projects instead, so the homepage reads as product work and the
 * government platforms are found as a distinct credential rather than mixed in.
 *
 * Kept explicit rather than derived: "which five best represent me" is an
 * editorial judgement, and no sort over the data can make it.
 */
const FEATURED_SLUGS = [
  "bondex-notch",
  "apsara-agentic",
  "apsara-assistant",
  "apsara-elearning",
  "apsara-talent",
  "romlerk",
];

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
    /* Scrolling down pins this section and carries the featured work
       sideways; when the row runs out, the page scrolls on. Without scroll
       timelines, or under reduced motion, HorizontalScroll falls back to a
       native swipe strip. The cards deal in from the right as it arrives,
       on a short span: their entrance is tied to their vertical position,
       which freezes once the stage pins, so it must finish before then. */
    <section id="projects" className="relative isolate">
      {/* Icon geometry for the featured cards' tech badges. */}
      <SkillIconSprite
        icons={featured.flatMap((project) => techIconKeys(project.tags))}
      />
      <HorizontalScroll header={header} trackClassName="items-stretch py-2">
        {featured.map((project, index) => (
          <AnimateIn
            key={project.slug}
            from="right"
            delay={index * 0.04}
            span={28}
            className="w-[min(84vw,420px)] shrink-0 snap-start"
          >
            <ProjectCard project={project} dict={dict} lang={lang} />
          </AnimateIn>
        ))}

        {/* The strip ends with a destination, not a dead stop. */}
        <AnimateIn
          key="view-all"
          from="right"
          delay={featured.length * 0.04}
          span={28}
          className="flex w-[min(70vw,340px)] shrink-0 snap-start"
        >
          <Link
            href={`/${lang}/projects`}
            className="group flex h-full w-full flex-col items-center justify-center gap-4 rounded-lg border border-dashed border-border/70 bg-card/40 p-8 text-center transition-colors hover:border-primary/40 hover:bg-primary/5"
          >
            <span className="font-mono text-4xl text-primary transition-transform duration-300 group-hover:translate-x-2 motion-reduce:transform-none">
              →
            </span>
            <span className="font-mono text-sm text-foreground">
              {dict.projects.viewAllProjects}
            </span>
            <span className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
              {lang === "km"
                ? "រុករកស្នាដៃទាំងអស់"
                : "Explore the full collection"}
            </span>
          </Link>
        </AnimateIn>
      </HorizontalScroll>
    </section>
  );
}
