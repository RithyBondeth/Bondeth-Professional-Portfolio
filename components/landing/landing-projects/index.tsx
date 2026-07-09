import Link from "next/link";
import { AnimateIn, StaggerIn } from "@/components/utils/animations/animate-in";
import { ProjectCard } from "@/components/projects/project-card";
import { getProjects } from "@/utils/i18n/content";
import { getDictionary, type TLocale } from "@/utils/i18n";

const FEATURED_SLUGS = [
  "apsara-agentic",
  "apsara-talent",
  "debc-website",
  "informal-economy",
];

export default function LandingProjects(props: { lang: TLocale }) {
  const { lang } = props;
  const dict = getDictionary(lang);
  const projects = getProjects(lang);
  const featured = FEATURED_SLUGS.map((slug) =>
    projects.find((project) => project.slug === slug),
  ).filter((project) => project !== undefined);

  return (
    <section id="projects" className="overflow-hidden bg-background px-6 py-24">
      <div className="mx-auto max-w-6xl">
        <AnimateIn from="zoom-in">
          <p className="mb-1 font-mono text-xs uppercase tracking-[0.25em] text-primary">
            <span className="text-muted-foreground">&lt;</span>
            Projects
            <span className="text-muted-foreground"> /&gt;</span>
          </p>
        </AnimateIn>

        <div className="mb-12 flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
          <AnimateIn from="left" distance={40} delay={0.05}>
            <div>
              <h2 className="mt-3 text-3xl font-bold text-foreground sm:text-4xl">
                {dict.projects.heading}
              </h2>
              <p className="mt-3 max-w-2xl text-sm leading-relaxed text-muted-foreground">
                {dict.projects.featuredBlurb}
              </p>
            </div>
          </AnimateIn>

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

        <StaggerIn
          className="grid gap-6 sm:grid-cols-2"
          from="up"
          stagger={0.1}
        >
          {featured.map((project, index) => (
            <div
              key={project.slug}
              className={index >= 2 ? "hidden sm:block" : undefined}
            >
              <ProjectCard project={project} dict={dict} lang={lang} />
            </div>
          ))}
        </StaggerIn>
      </div>
    </section>
  );
}
