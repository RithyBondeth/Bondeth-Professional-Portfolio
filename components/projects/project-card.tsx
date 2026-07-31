import Image from "next/image";
import Link from "next/link";
import type { IProject } from "@/utils/interfaces/portfolio";
import type { TDictionary, TLocale } from "@/utils/i18n";

/**
 * One project in the archive index.
 *
 * Kept as `ProjectCard` because that name is used across the app, but it is a
 * row now, not a card: no tilt shell, no glare sheen, no traffic-light window
 * mock standing in for a missing screenshot. A project without a screenshot
 * simply doesn't print one — an invented browser chrome is a picture of
 * nothing.
 *
 * Confidential projects have no detail route, so the row is inert type rather
 * than a link that goes nowhere. That's also why this can't just be `IndexRow`
 * — a third of these items aren't navigable at all.
 */
export function ProjectCard({
  project,
  dict,
  lang,
}: {
  project: IProject;
  dict: TDictionary;
  lang: TLocale;
}) {
  const isConfidential = project.visibility === "confidential";
  const description = isConfidential
    ? dict.projects.confidentialCard
    : project.description;

  const thumbnail = (
    <div className="relative flex aspect-[4/3] w-24 shrink-0 items-center justify-center overflow-hidden border border-rule bg-secondary sm:w-32">
      {project.image && !isConfidential ? (
        <Image
          src={project.image}
          alt=""
          fill
          sizes="128px"
          className="object-cover transition-transform duration-500 ease-out group-hover:scale-[1.04] motion-reduce:transform-none"
        />
      ) : (
        <span aria-hidden className="display-sm text-muted-foreground">
          {project.title.charAt(0)}
        </span>
      )}
    </div>
  );

  const body = (
    <div className="min-w-0 flex-1">
      <div className="flex flex-wrap items-baseline gap-x-4 gap-y-1">
        <p className="eyebrow">{project.category}</p>
        {project.visibility !== "public" && (
          <p className="eyebrow text-marker">
            {project.visibility === "limited"
              ? dict.projects.limitedProject
              : dict.projects.confidentialProject}
          </p>
        )}
      </div>

      <h3
        className={`mt-2 text-lg leading-snug sm:text-xl ${
          isConfidential
            ? "text-foreground"
            : "text-foreground transition-colors group-hover:text-marker"
        }`}
      >
        {project.title}
      </h3>

      <p className="measure mt-2 text-sm leading-relaxed text-muted-foreground">
        {description}
      </p>

      {project.tags.length > 0 && (
        <p className="eyebrow mt-3">{project.tags.slice(0, 5).join(" · ")}</p>
      )}

      {/* The live link is its own control so it doesn't nest inside the row
          link — one anchor cannot legally contain another. */}
      {project.live && !isConfidential && (
        <a
          href={project.live}
          target="_blank"
          rel="noopener noreferrer"
          className="btn-fx link-wipe relative z-10 mt-4 inline-block text-sm"
          aria-label={`${dict.projects.demo}: ${project.title}`}
        >
          {dict.projects.demo}
          <span aria-hidden className="ml-2">
            ↗
          </span>
        </a>
      )}
    </div>
  );

  const rowClass =
    "group flex items-start gap-5 border-b border-rule py-6 sm:gap-7 sm:py-7";

  if (isConfidential) {
    return (
      <article className={rowClass}>
        {thumbnail}
        {body}
      </article>
    );
  }

  return (
    <article className={`${rowClass} relative`}>
      {thumbnail}
      {body}

      <span
        aria-hidden
        className="hidden shrink-0 self-center text-lg text-muted-foreground transition-transform duration-300 ease-out group-hover:translate-x-1.5 group-hover:text-foreground motion-reduce:transform-none sm:block"
      >
        →
      </span>

      {/* A stretched link: the whole row is the target and there is one tab
          stop, while the "live demo" anchor above still sits on top of it. */}
      <Link
        href={`/${lang}/projects/${project.slug}`}
        aria-label={`${dict.projects.viewDetails}: ${project.title}`}
        className="absolute inset-0 outline-none focus-visible:bg-secondary/60"
      >
        <span className="sr-only">{dict.projects.viewDetails}</span>
      </Link>
    </article>
  );
}
