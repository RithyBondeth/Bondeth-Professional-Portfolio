import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { AnimateIn } from "@/shared/components/motion/animate-in";
import { ScrambleText } from "@/shared/components/motion/scramble-text";
import { ProjectExplorer } from "@/features/portfolio/components/projects/project-explorer";
import { SkillIconSprite } from "@/features/portfolio/components/skills/skill-icon-sprite";
import { techIconKeys } from "@/features/portfolio/components/projects/tech-icon-map";
import { getProjects } from "@/features/portfolio/data/localized-content";
import { getDictionary, hasLocale } from "@/shared/i18n";

interface ProjectsPageProps {
  params: Promise<{ lang: string }>;
}

export async function generateMetadata({
  params,
}: ProjectsPageProps): Promise<Metadata> {
  const { lang } = await params;
  if (!hasLocale(lang)) return {};
  const dict = getDictionary(lang);

  return {
    title: dict.projects.allProjectsHeading,
    description: dict.projects.allProjectsBlurb,
    alternates: {
      canonical: `/${lang}/projects`,
      languages: {
        en: "/en/projects",
        km: "/km/projects",
        "x-default": "/en/projects",
      },
    },
  };
}

export default async function ProjectsPage({ params }: ProjectsPageProps) {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();

  const dict = getDictionary(lang);
  const projects = getProjects(lang);

  return (
    <main
      id="main-content"
      tabIndex={-1}
      className="flex-1 px-6 pb-16 sm:pb-24 pt-32 font-sans"
    >
      <div className="mx-auto max-w-6xl">
        <AnimateIn>
          <p className="font-mono text-xs uppercase tracking-[0.25em] text-primary">
            <ScrambleText text="$ ls projects/" />
          </p>
          <h1 className="mt-3 text-4xl font-bold text-foreground sm:text-5xl">
            {dict.projects.allProjectsHeading}
          </h1>
          <p className="mb-10 mt-4 max-w-2xl text-sm leading-relaxed text-field-muted-foreground">
            {dict.projects.allProjectsBlurb}
          </p>
        </AnimateIn>

        <AnimateIn delay={0.08}>
          {/* Icon geometry for every card's tech badges, defined once. */}
          <SkillIconSprite
            icons={projects.flatMap((project) => techIconKeys(project.tags))}
          />
          <ProjectExplorer projects={projects} dict={dict} lang={lang} />
        </AnimateIn>
      </div>
    </main>
  );
}
