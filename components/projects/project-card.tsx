import Image from "next/image";
import Link from "next/link";
import { TiltCard } from "@/components/utils/animations/tilt-card";
import { TechBadges } from "@/components/projects/tech-badges";
import { ProjectLinkIcon } from "@/components/projects/project-link-icon";
import {
  getLinkLabel,
  getMediaBadge,
  getPrimaryLink,
} from "@/utils/functions/project-links";
import type { IProject } from "@/utils/interfaces/portfolio";
import type { TDictionary, TLocale } from "@/utils/i18n";

export function ProjectCard(props: {
  project: IProject;
  dict: TDictionary;
  lang: TLocale;
}) {
  const { project, dict, lang } = props;
  const primary = getPrimaryLink(project);
  const badge = getMediaBadge(project);

  return (
    /* 3D tilt + glare shell — desktop pointers only, static elsewhere. */
    <TiltCard maxTilt={6} className="relative h-full rounded">
      {/* TiltCard owns the 3D lean, so this card opts out of the shared lift
          (the two transforms would fight) and keeps only the border warm-up,
          glow, and sheen. */}
      <article className="card-interactive group flex h-full flex-col overflow-hidden rounded border border-border/60 bg-card [--card-lift:0px]">
        <div className="relative h-44 overflow-hidden">
          {project.image && project.visibility !== "confidential" ? (
            <Image
              src={project.image}
              alt={`${project.title} preview`}
              fill
              // Without this, `fill` means `sizes="100vw"` and the browser
              // picks the widest srcset candidate — a 3840px render of a
              // preview that is never shown above 420px. The card is
              // `min(84vw, 420px)` in the landing strip and a third of a
              // max-w-6xl grid on /projects, so 420 covers the widest case.
              sizes="(min-width: 640px) 420px, 90vw"
              data-card-media
              className="object-cover"
            />
          ) : (
            <div
              className={`absolute inset-0 bg-linear-to-br ${project.gradient}`}
            >
              <ProjectChrome category={project.category} />
            </div>
          )}

          {badge && (
            <div
              className={`absolute right-3 top-3 flex items-center gap-1 rounded border bg-background/80 px-2 py-1 backdrop-blur-sm ${
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
          <div className="flex items-start gap-2">
            <span
              aria-hidden
              className="mt-0.5 font-mono text-[10px] text-muted-foreground"
            >
              ▸
            </span>
            <h3 className="font-mono text-sm font-semibold leading-snug text-foreground">
              {project.title}
            </h3>
            {project.visibility !== "public" && (
              <span className="ml-auto rounded border border-status-warning/25 bg-status-warning/5 px-1.5 py-0.5 text-left font-mono text-[9px] text-status-warning">
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
                href={`/${lang}/projects/${project.slug}`}
                aria-label={`${dict.projects.viewDetails}: ${project.title}`}
                className="inline-flex min-h-11 items-center gap-1.5 rounded border border-border/50 bg-muted/40 px-3 font-mono text-xs text-muted-foreground transition-colors hover:border-primary/30 hover:text-primary"
              >
                {dict.projects.viewDetails}
                <span aria-hidden>→</span>
              </Link>
            )}

            {primary ? (
              <a
                href={primary.url}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-fx btn-fx-primary ml-auto flex size-11 items-center justify-center rounded bg-primary-fill text-primary-foreground"
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

/** Three traffic lights, shared by every window-shaped frame. */
function TrafficLights() {
  return (
    <>
      <span className="h-2 w-2 rounded-full bg-red-500/70" />
      <span className="h-2 w-2 rounded-full bg-yellow-500/70" />
      <span className="h-2 w-2 rounded-full bg-green-500/70" />
    </>
  );
}

/**
 * Stand-in artwork for projects with no screenshot yet. The frame follows the
 * artifact, not the link — a native app drawn inside browser chrome would
 * quietly misrepresent what was built.
 *
 * Mobile still falls through to the browser frame; swap in a phone bezel here
 * once there is a mobile project to put in it.
 */
function ProjectChrome(props: { category: IProject["category"] }) {
  if (props.category === "macOS") {
    return (
      <>
        {/* Window bar: traffic lights, no URL field. */}
        <div className="absolute inset-x-0 top-0 flex h-7 items-center gap-1.5 bg-background/70 px-3 backdrop-blur-sm">
          <TrafficLights />
          <div className="mx-auto h-2 w-16 rounded-sm bg-border/50" />
        </div>
        {/* Sidebar + detail split, the shape most Mac utilities take. */}
        <div className="absolute inset-0 top-7 flex gap-2 p-3">
          <div className="flex w-1/3 flex-col gap-1.5 rounded border border-foreground/10 bg-foreground/5 p-2">
            <div className="h-1.5 w-full rounded bg-foreground/15" />
            <div className="h-1.5 w-4/5 rounded bg-foreground/10" />
            <div className="h-1.5 w-3/5 rounded bg-foreground/10" />
          </div>
          <div className="flex flex-1 flex-col gap-2">
            <div className="h-2.5 w-2/3 rounded bg-foreground/10" />
            <div className="flex-1 rounded border border-foreground/10 bg-foreground/5" />
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <div className="absolute inset-x-0 top-0 flex h-7 items-center gap-1.5 bg-background/70 px-3 backdrop-blur-sm">
        <TrafficLights />
        <div className="ml-2 h-3 max-w-35 flex-1 rounded-sm bg-border/60" />
      </div>
      <div className="absolute inset-0 top-7 flex flex-col gap-2 p-4">
        <div className="h-2.5 w-3/4 rounded bg-foreground/10" />
        <div className="h-2.5 w-1/2 rounded bg-foreground/10" />
        <div className="mt-2 h-14 rounded border border-foreground/10 bg-foreground/5" />
      </div>
    </>
  );
}
