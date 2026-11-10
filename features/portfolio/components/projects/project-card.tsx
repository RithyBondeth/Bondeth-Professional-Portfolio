import Link from "next/link";
import {
  ProjectLogo,
  ProjectMedia,
} from "@/features/portfolio/components/projects/project-media";
import { TiltCard } from "@/shared/components/motion/tilt-card";
import { TechBadges } from "@/features/portfolio/components/projects/tech-badges";
import { ProjectLinkIcon } from "@/features/portfolio/components/projects/project-link-icon";
import {
  getLinkLabel,
  getMediaBadge,
  getPrimaryLink,
} from "@/features/portfolio/domain/project-links";
import type { Project } from "@/features/portfolio/domain";
import type { Dictionary, Locale } from "@/shared/i18n";

export function ProjectCard(props: {
  project: Project;
  dict: Dictionary;
  lang: Locale;
  eagerPreview?: boolean;
}) {
  const { project, dict, lang, eagerPreview } = props;
  const primary = getPrimaryLink(project);
  const badge = project.status
    ? { label: dict.projects.status[project.status], live: false }
    : getMediaBadge(project);

  return (
    /* 3D tilt + glare shell — desktop pointers only, static elsewhere. */
    <TiltCard maxTilt={6} className="relative h-full rounded-lg">
      {/* TiltCard owns the 3D lean, so this card opts out of the shared lift
          (the two transforms would fight) and keeps only the border warm-up,
          glow, and sheen. */}
      <article className="card-interactive group flex h-full flex-col overflow-hidden rounded-lg border border-border/60 bg-card [--card-lift:0px]">
        <div className="relative aspect-video overflow-hidden bg-muted">
          <ProjectMedia
            project={project}
            fallback={dict.projects.previewUnavailable}
            openLabel={dict.projects.openPreview}
            closeLabel={dict.projects.closePreview}
            eager={eagerPreview}
          />

          {badge && (
            <div
              className={`absolute right-3 top-3 flex items-center gap-1 rounded-lg border bg-background/80 px-2 py-1 backdrop-blur-sm ${
                badge.live ? "border-emerald-500/25" : "border-border/60"
              }`}
            >
              {badge.live && (
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
              )}
              <span
                className={`font-mono text-[9px] ${
                  badge.live ? "text-emerald-400" : "text-muted-foreground"
                }`}
              >
                {badge.label}
              </span>
            </div>
          )}
        </div>

        <div className="flex flex-1 flex-col gap-3 p-5">
          <div className="flex items-center gap-3">
            <ProjectLogo project={project} />
            <div className="min-w-0">
              <p className="mb-1 text-[10px] leading-snug text-muted-foreground">
                {dict.projects.groups[project.group]} · {project.category}
              </p>
              <h3 className="text-base font-semibold leading-snug text-foreground">
                {project.visibility === "confidential" ? (
                  project.title
                ) : (
                  <Link
                    href={`/${lang}/projects/${project.slug}`}
                    className="rounded-sm hover:text-primary focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary"
                  >
                    {project.title}
                  </Link>
                )}
              </h3>
            </div>
            {project.visibility !== "public" && (
              <span className="ml-auto shrink-0 max-w-[32%] rounded-lg border border-status-warning/25 bg-status-warning/5 px-1.5 py-0.5 text-left font-mono text-[9px] text-status-warning">
                {project.visibility === "limited"
                  ? dict.projects.limitedProject
                  : dict.projects.confidentialProject}
              </span>
            )}
          </div>

          <p className="flex-1 text-xs leading-relaxed text-muted-foreground">
            {project.visibility === "confidential"
              ? dict.projects.confidentialCard
              : project.description}
          </p>

          <TechBadges tags={project.tags.slice(0, 6)} />

          <div className="flex items-center gap-2 border-t border-border/40 pt-3">
            {project.visibility !== "confidential" && (
              <Link
                href={`/${lang}/projects/${project.slug}${project.caseStudy ? "#project-case-study" : ""}`}
                aria-label={`${
                  project.caseStudy
                    ? dict.projects.caseStudy.read
                    : dict.projects.viewDetails
                }: ${project.title}`}
                className="inline-flex min-h-11 items-center gap-1.5 rounded-lg border border-border/50 bg-muted/40 px-3 font-mono text-xs text-muted-foreground transition-colors hover:border-primary/30 hover:text-primary"
              >
                {project.caseStudy
                  ? dict.projects.caseStudy.read
                  : dict.projects.viewDetails}
                <span aria-hidden>→</span>
              </Link>
            )}

            {primary ? (
              <a
                href={primary.url}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-fx btn-fx-primary ml-auto flex size-11 items-center justify-center rounded-lg bg-primary-fill text-primary-foreground"
                aria-label={`${getLinkLabel(primary.kind, dict)}: ${project.title}`}
              >
                <ProjectLinkIcon kind={primary.kind} className="h-3.5 w-3.5" />
              </a>
            ) : project.visibility === "confidential" ? (
              <span className="ml-auto font-mono text-[10px] text-status-warning">
                {dict.projects.confidentialProject}
              </span>
            ) : (
              <span className="ml-auto font-mono text-[10px] text-muted-foreground">
                {dict.projects.noDemo}
              </span>
            )}
          </div>
        </div>
      </article>
    </TiltCard>
  );
}
