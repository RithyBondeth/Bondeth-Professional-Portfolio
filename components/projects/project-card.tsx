import Image from "next/image";
import Link from "next/link";
import { ExternalLinkIcon } from "@/components/utils/icons";
import { TiltCard } from "@/components/utils/animations/tilt-card";
import type { IProject } from "@/utils/interfaces/portfolio/project.interface";
import type { TDictionary, TLocale } from "@/utils/i18n";

export function ProjectCard(props: {
  project: IProject;
  dict: TDictionary;
  lang: TLocale;
}) {
  const { project, dict, lang } = props;

  return (
    /* 3D tilt + glare shell — desktop pointers only, static elsewhere. */
    <TiltCard maxTilt={6} className="relative h-full rounded">
      <article className="group flex h-full flex-col overflow-hidden rounded border border-border/60 bg-card transition-all duration-300 hover:border-primary/30 hover:shadow-[0_0_28px_rgba(148,162,255,0.1)]">
        <div className="relative h-44 overflow-hidden">
          {project.image && project.visibility !== "confidential" ? (
            <Image
              src={project.image}
              alt={`${project.title} preview`}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-105 motion-reduce:transform-none"
            />
          ) : (
            <div
              className={`absolute inset-0 bg-linear-to-br ${project.gradient}`}
            >
              <div className="absolute inset-x-0 top-0 flex h-7 items-center gap-1.5 bg-background/70 px-3 backdrop-blur-sm">
                <span className="h-2 w-2 rounded-full bg-red-500/70" />
                <span className="h-2 w-2 rounded-full bg-yellow-500/70" />
                <span className="h-2 w-2 rounded-full bg-green-500/70" />
                <div className="ml-2 h-3 max-w-[140px] flex-1 rounded-sm bg-border/60" />
              </div>
              <div className="absolute inset-0 top-7 flex flex-col gap-2 p-4">
                <div className="h-2.5 w-3/4 rounded bg-foreground/10" />
                <div className="h-2.5 w-1/2 rounded bg-foreground/10" />
                <div className="mt-2 h-14 rounded border border-foreground/10 bg-foreground/5" />
              </div>
            </div>
          )}

          {project.live && project.visibility !== "confidential" && (
            <div className="absolute right-3 top-3 flex items-center gap-1 rounded border border-emerald-500/25 bg-background/80 px-2 py-1 backdrop-blur-sm">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
              <span className="font-mono text-[9px] text-emerald-400">
                live
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
              <span className="ml-auto rounded border border-amber-500/20 bg-amber-500/5 px-1.5 py-0.5 text-right font-mono text-[9px] text-amber-500">
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

          <div className="flex flex-wrap gap-1">
            {project.tags.slice(0, 5).map((tag) => (
              <span
                key={tag}
                className="rounded border border-border/60 bg-muted/40 px-1.5 py-0.5 font-mono text-[10px] text-muted-foreground"
              >
                {tag}
              </span>
            ))}
          </div>

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

            {project.live && project.visibility !== "confidential" ? (
              <a
                href={project.live}
                target="_blank"
                rel="noopener noreferrer"
                className="ml-auto flex size-11 items-center justify-center rounded bg-primary text-primary-foreground transition-colors hover:bg-primary/90"
                aria-label={`${dict.projects.demo}: ${project.title}`}
              >
                <ExternalLinkIcon className="h-3.5 w-3.5" />
              </a>
            ) : project.visibility === "confidential" ? (
              <span className="ml-auto font-mono text-[10px] text-amber-500">
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
