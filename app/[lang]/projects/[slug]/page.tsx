import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { AnimateIn } from "@/components/utils/animations/animate-in";
import { ProjectLinkIcon } from "@/components/projects/project-link-icon";
import { TopicCluster } from "@/components/topic-cluster";
import { TechBadges } from "@/components/projects/tech-badges";
import { ProjectCard } from "@/components/projects/project-card";
import { SkillIconSprite } from "@/components/landing/landing-skills/skill-icon-sprite";
import { techIconKeys } from "@/components/projects/tech-icon-map";
import { getLinkLabel } from "@/utils/functions/project-links";
import { projects, siteConfig } from "@/utils/constants/portfolio.constant";
import { getProjects } from "@/utils/i18n/content";
import { getDictionary, hasLocale, locales, type TLocale } from "@/utils/i18n";

interface IProjectPageProps {
  params: Promise<{ lang: string; slug: string }>;
}

function getProject(slug: string, lang: TLocale) {
  return getProjects(lang).find(
    (project) => project.slug === slug && project.visibility !== "confidential",
  );
}

export function generateStaticParams() {
  return locales.flatMap((lang) =>
    projects
      .filter((project) => project.visibility !== "confidential")
      .map((project) => ({ lang, slug: project.slug })),
  );
}

export async function generateMetadata({
  params,
}: IProjectPageProps): Promise<Metadata> {
  const { lang, slug } = await params;
  if (!hasLocale(lang)) return {};

  const project = getProject(slug, lang);
  if (!project) return {};

  return {
    title: project.title,
    description: project.description,
    alternates: {
      canonical: `/${lang}/projects/${slug}`,
      languages: {
        en: `/en/projects/${slug}`,
        km: `/km/projects/${slug}`,
        "x-default": `/en/projects/${slug}`,
      },
    },
    openGraph: {
      type: "website",
      url: `/${lang}/projects/${slug}`,
      title: project.title,
      description: project.description,
      ...(project.image ? { images: [{ url: project.image }] } : {}),
    },
  };
}

export default async function ProjectPage({ params }: IProjectPageProps) {
  const { lang, slug } = await params;
  if (!hasLocale(lang)) notFound();

  const project = getProject(slug, lang);
  if (!project) notFound();

  const dict = getDictionary(lang);

  // Everything a visitor could actually navigate to, in the curated order the
  // constants file declares. Confidential projects have no detail route, so
  // they must not appear as a prev/next destination either.
  const siblings = getProjects(lang).filter(
    (item) => item.visibility !== "confidential",
  );
  const index = siblings.findIndex((item) => item.slug === project.slug);
  const previousProject = index > 0 ? siblings[index - 1] : null;
  const nextProject =
    index >= 0 && index < siblings.length - 1 ? siblings[index + 1] : null;

  // Related by shared domain, falling back to platform when a project carries
  // no domains. Practice work is excluded unless you're already looking at it,
  // so a government platform never recommends a Tesla clone.
  const domains = new Set(project.domains ?? []);
  const related = siblings
    .filter((item) => item.slug !== project.slug)
    .filter((item) =>
      project.tier === "practice" ? true : item.tier !== "practice",
    )
    .filter((item) =>
      domains.size > 0
        ? (item.domains ?? []).some((d) => domains.has(d))
        : item.category === project.category,
    )
    .slice(0, 3);

  const visibilityLabel =
    project.visibility === "limited"
      ? dict.projects.limitedProject
      : dict.projects.publicProject;

  const projectJsonLd = {
    "@context": "https://schema.org",
    "@type": "CreativeWork",
    name: project.title,
    description: project.description,
    url: `${siteConfig.url}/${lang}/projects/${project.slug}`,
  };

  return (
    <main
      id="main-content"
      tabIndex={-1}
      className="flex-1 bg-background px-6 pb-16 sm:pb-24 pt-32 font-sans"
    >
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(projectJsonLd).replace(/</g, "\\u003c"),
        }}
      />

      {/* Icon geometry for the tech badges below, defined once. */}
      <SkillIconSprite
        icons={[project, ...related].flatMap((item) => techIconKeys(item.tags))}
      />

      <div className="mx-auto max-w-5xl">
        <AnimateIn>
          <Link
            href={`/${lang}/projects`}
            className="mb-8 inline-flex items-center gap-2 font-mono text-xs text-muted-foreground transition-colors hover:text-primary"
          >
            <span aria-hidden>←</span>
            {dict.projects.backToProjects}
          </Link>
        </AnimateIn>

        <div className="grid gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:items-end">
          <div>
            <AnimateIn from="left" distance={40}>
              <div className="mb-5 flex flex-wrap items-center gap-3">
                <span className="rounded border border-primary/20 bg-primary/5 px-2.5 py-1 font-mono text-[10px] uppercase tracking-wider text-primary">
                  {visibilityLabel}
                </span>
                <span className="font-mono text-xs text-muted-foreground">
                  {project.category}
                </span>
                {project.domains?.map((domain) => (
                  <span
                    key={domain}
                    className="font-mono text-xs text-muted-foreground"
                  >
                    · {domain}
                  </span>
                ))}
                {project.year && (
                  <span className="font-mono text-xs text-muted-foreground">
                    · {project.year}
                  </span>
                )}
              </div>
              <h1 className="text-4xl font-bold leading-tight text-foreground sm:text-5xl lg:text-6xl">
                {project.title}
              </h1>
              <p className="mt-6 max-w-2xl text-sm leading-7 text-muted-foreground sm:text-base">
                {project.description}
              </p>
            </AnimateIn>
          </div>

          <AnimateIn from="right" distance={40} delay={0.08}>
            <ProjectPreview title={project.title} image={project.image} />
          </AnimateIn>
        </div>

        {project.visibility === "limited" && (
          <AnimateIn from="up" delay={0.1}>
            <aside className="mt-12 rounded border border-status-warning/25 bg-status-warning/5 p-5">
              <p className="font-mono text-xs font-semibold uppercase tracking-wider text-status-warning">
                {dict.projects.limitedNoticeTitle}
              </p>
              <p className="mt-3 text-xs leading-relaxed text-muted-foreground sm:text-sm">
                {dict.projects.limitedNotice}
              </p>
            </aside>
          </AnimateIn>
        )}

        <div className="mt-16 grid gap-6 md:grid-cols-2">
          <AnimateIn from="up">
            <section className="h-full rounded border border-border/60 bg-card p-6">
              <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-primary">
                01 / {dict.projects.overview}
              </p>
              <h2 className="mt-4 text-xl font-semibold text-foreground">
                {dict.projects.overview}
              </h2>
              {/* `overview`, not `description` — the hero above already shows
                  the description, and this card used to repeat it verbatim. */}
              <p className="mt-4 text-sm leading-7 text-muted-foreground">
                {project.overview ?? project.description}
              </p>
            </section>
          </AnimateIn>

          <AnimateIn from="up" delay={0.08}>
            <section className="h-full rounded border border-border/60 bg-card p-6">
              <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-primary">
                02 / {dict.projects.technologies}
              </p>
              <h2 className="mt-4 text-xl font-semibold text-foreground">
                {dict.projects.technologies}
              </h2>
              <TechBadges tags={project.tags} size="md" className="mt-5" />

              {project.role && (
                <div className="mt-6 border-t border-border/50 pt-5">
                  <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-primary">
                    {dict.projects.myRole}
                  </p>
                  <p className="mt-2 text-sm leading-7 text-muted-foreground">
                    {project.role}
                  </p>
                </div>
              )}
            </section>
          </AnimateIn>
        </div>

        {/* Renders only when there's something real to report — an empty
            "Outcome" heading is worse than no heading at all. */}
        {project.outcomes && project.outcomes.length > 0 && (
          <AnimateIn from="up" delay={0.1}>
            <section className="mt-6 rounded border border-border/60 bg-card p-6">
              <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-primary">
                03 / {dict.projects.outcome}
              </p>
              <h2 className="mt-4 text-xl font-semibold text-foreground">
                {dict.projects.outcome}
              </h2>
              <ul className="mt-5 flex flex-col gap-3">
                {project.outcomes.map((item) => (
                  <li
                    key={item}
                    className="flex gap-3 text-sm leading-7 text-muted-foreground"
                  >
                    <span aria-hidden className="mt-2.5 size-1.5 shrink-0 rounded-full bg-primary" />
                    {item}
                  </li>
                ))}
              </ul>
            </section>
          </AnimateIn>
        )}

        {project.links.length > 0 && (
          <AnimateIn from="up" delay={0.12}>
            <section className="mt-6 rounded border border-border/60 bg-card p-6">
              <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-primary">
                {project.outcomes?.length ? "04" : "03"} / {dict.projects.publicResources}
              </p>
              <h2 className="mt-4 text-xl font-semibold text-foreground">
                {dict.projects.publicResources}
              </h2>
              <div className="mt-5 flex flex-wrap gap-3">
                {project.links.map((link, index) => (
                  <a
                    key={link.url}
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    // The head of the list is the project's main entry point,
                    // so it gets the filled treatment and the rest sit beside it.
                    className={
                      index === 0
                        ? "btn-fx btn-fx-primary inline-flex items-center gap-2 rounded bg-primary-fill px-4 py-2.5 font-mono text-xs text-primary-foreground"
                        : "btn-fx inline-flex items-center gap-2 rounded border border-border/60 bg-muted/40 px-4 py-2.5 font-mono text-xs text-muted-foreground hover:border-primary/30 hover:text-primary"
                    }
                  >
                    {getLinkLabel(link.kind, dict)}
                    <ProjectLinkIcon kind={link.kind} className="h-3.5 w-3.5" />
                  </a>
                ))}
              </div>
            </section>
          </AnimateIn>
        )}

        {/* Writing and labs covering the same ground, when this project has any. */}
        <TopicCluster
          lang={lang}
          current="project"
          relatedPostSlug={project.relatedPost}
          relatedLabPath={project.relatedLab}
        />

        {/* The page used to end here, with `back` as the only way out. */}
        {related.length > 0 && (
          <AnimateIn from="up" className="mt-16">
            <h2 className="font-mono text-xs uppercase tracking-[0.25em] text-muted-foreground">
              {dict.projects.relatedProjects}
            </h2>
            <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {related.map((item) => (
                <ProjectCard
                  key={item.slug}
                  project={item}
                  dict={dict}
                  lang={lang}
                />
              ))}
            </div>
          </AnimateIn>
        )}

        {(previousProject || nextProject) && (
          <AnimateIn from="up" className="mt-12">
            <nav
              aria-label={`${dict.projects.previousProject} / ${dict.projects.nextProject}`}
              className="grid gap-3 border-t border-border/40 pt-8 sm:grid-cols-2"
            >
              {previousProject ? (
                <Link
                  href={`/${lang}/projects/${previousProject.slug}`}
                  className="group rounded-lg border border-border/60 bg-card/40 p-4 transition-colors hover:border-primary/40"
                >
                  <span className="mb-2 flex items-center gap-2 font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
                    <span aria-hidden>←</span>
                    {dict.projects.previousProject}
                  </span>
                  <span className="line-clamp-2 text-sm font-semibold leading-snug text-foreground group-hover:text-primary">
                    {previousProject.title}
                  </span>
                </Link>
              ) : (
                <span />
              )}
              {nextProject && (
                <Link
                  href={`/${lang}/projects/${nextProject.slug}`}
                  className="group rounded-lg border border-border/60 bg-card/40 p-4 text-right transition-colors hover:border-primary/40"
                >
                  <span className="mb-2 flex items-center justify-end gap-2 font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
                    {dict.projects.nextProject}
                    <span aria-hidden>→</span>
                  </span>
                  <span className="line-clamp-2 text-sm font-semibold leading-snug text-foreground group-hover:text-primary">
                    {nextProject.title}
                  </span>
                </Link>
              )}
            </nav>
          </AnimateIn>
        )}
      </div>
    </main>
  );
}

function ProjectPreview(props: { title: string; image: string }) {
  const { title, image } = props;

  return (
    <div className="relative aspect-16/10 overflow-hidden rounded border border-border/60 bg-card shadow-2xl shadow-black/10">
      <Image
        src={image}
        alt={`${title} preview`}
        fill
        priority
        // Without this, `fill` implies sizes="100vw" and the browser fetches a
        // viewport-wide source for a panel never wider than ~460px.
        sizes="(min-width: 1024px) 460px, 90vw"
        className="object-cover"
      />
    </div>
  );
}
