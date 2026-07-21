import Link from "next/link";
import { SectionBackdrop } from "@/components/utils/animations/section-backdrop";
import { AnimateIn } from "@/components/utils/animations/animate-in";
import { ScrambleText } from "@/components/utils/animations/scramble-text";
import { SplitReveal } from "@/components/utils/animations/split-reveal";
import { HorizontalScroll } from "@/components/utils/animations/horizontal-scroll";
import { ProjectCard } from "@/components/projects/project-card";
import { getProjects } from "@/utils/i18n/content";
import { getDictionary, type TLocale } from "@/utils/i18n";

const FEATURED_SLUGS = [
  "apsara-agentic",
  "apsara-assistant",
  "apsara-elearning",
  "apsara-talent",
];

export default function LandingProjects(props: { lang: TLocale }) {
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
          <ScrambleText text="<Projects />" />
        </p>
      </AnimateIn>

      <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
        <div>
          <SplitReveal
            as="h2"
            type="lines"
            className="mt-3 text-3xl font-bold text-foreground sm:text-4xl lg:text-5xl"
          >
            {dict.projects.heading}
          </SplitReveal>
          <AnimateIn from="up" distance={24} delay={0.1}>
            <p className="mt-3 max-w-2xl text-sm leading-relaxed text-muted-foreground">
              {dict.projects.featuredBlurb}
            </p>
          </AnimateIn>
        </div>

        <AnimateIn from="right" distance={30} delay={0.08}>
          <Link
            href={`/${lang}/projects`}
            className="inline-flex min-h-11 shrink-0 items-center gap-2 rounded border border-primary/30 px-4 font-mono text-xs text-primary transition-colors hover:bg-primary/5"
          >
            {dict.projects.viewAllProjects}
            <span aria-hidden>→</span>
          </Link>
        </AnimateIn>
      </div>
    </div>
  );

  return (
    /* The pinned panel owns the vertical rhythm — the sideways journey through
       the featured work IS the section. Reduced motion / no-JS falls back to a
       native swipe strip via HorizontalScroll itself. */
    <section id="projects" className="relative isolate bg-background">
      <SectionBackdrop />

      <HorizontalScroll header={header} trackClassName="items-stretch py-2">
        {featured.map((project) => (
          <div
            key={project.slug}
            className="w-[min(84vw,420px)] shrink-0 snap-start"
          >
            <ProjectCard project={project} dict={dict} lang={lang} />
          </div>
        ))}

        {/* The strip ends with a destination, not a dead stop. */}
        <div
          key="view-all"
          className="flex w-[min(70vw,340px)] shrink-0 snap-start"
        >
          <Link
            href={`/${lang}/projects`}
            className="group flex h-full w-full flex-col items-center justify-center gap-4 rounded border border-dashed border-border/70 bg-card/40 p-8 text-center transition-colors hover:border-primary/40 hover:bg-primary/5"
          >
            <span className="font-mono text-4xl text-primary transition-transform duration-300 group-hover:translate-x-2 motion-reduce:transform-none">
              →
            </span>
            <span className="font-mono text-sm text-foreground">
              {dict.projects.viewAllProjects}
            </span>
            <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
              /{lang}/projects
            </span>
          </Link>
        </div>
      </HorizontalScroll>
    </section>
  );
}
