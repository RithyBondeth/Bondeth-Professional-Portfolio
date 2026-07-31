"use client";

import { useState } from "react";
import { ProjectCard } from "@/components/projects/project-card";
import { Reveal } from "@/components/utils/animations/reveal";
import type { IProject } from "@/utils/interfaces/portfolio";
import type { TProjectCategory } from "@/utils/types/portfolio";
import type { TDictionary, TLocale } from "@/utils/i18n";

/**
 * The project archive with its category filter.
 *
 * The filter is a row of words divided by hairlines — a printed index's
 * "sections" line — with the active one in full ink. It replaces the pill bar
 * with a GSAP thumb sliding under it.
 *
 * Filtering no longer FLIPs the layout either. In a list, a filter changes the
 * *contents* of one column; there is no meaningful spatial journey for a row
 * to take from its old slot to its new one, so the FLIP was 60 lines of
 * animation to communicate nothing. The list simply becomes the new list.
 */

const CATEGORIES = ["All", "Web", "AI", "Mobile"] as const;
type TFilter = "All" | TProjectCategory;

export function ProjectExplorer({
  projects,
  dict,
  lang,
}: {
  projects: IProject[];
  dict: TDictionary;
  lang: TLocale;
}) {
  const [filter, setFilter] = useState<TFilter>("All");
  const filtered = projects.filter(
    (project) => filter === "All" || project.category === filter,
  );

  return (
    <div>
      <div
        className="flex flex-wrap items-center gap-x-5 gap-y-2"
        aria-label={dict.projects.filterLabel}
      >
        {CATEGORIES.map((category, i) => (
          <span key={category} className="flex items-center gap-5">
            {i > 0 && <span aria-hidden className="h-3 w-px bg-rule" />}
            <button
              type="button"
              onClick={() => setFilter(category)}
              aria-pressed={filter === category}
              className={`btn-fx eyebrow py-1 transition-colors ${
                filter === category
                  ? "text-foreground"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {category === "All" ? dict.projects.filterAll : category}
            </button>
          </span>
        ))}

        <span className="eyebrow ml-auto">
          {filtered.length}/{projects.length}
        </span>
      </div>

      {filtered.length > 0 ? (
        <div className="mt-8 border-t border-rule">
          {filtered.map((project, i) => (
            // Keyed by filter so a changed list re-runs its entrance rather
            // than inheriting the previous list's already-revealed state.
            <Reveal key={`${filter}-${project.slug}`} delay={Math.min(i, 6) * 50}>
              <ProjectCard project={project} dict={dict} lang={lang} />
            </Reveal>
          ))}
        </div>
      ) : (
        <p className="mt-8 border-t border-rule py-20 text-center text-muted-foreground">
          {dict.projects.empty}
        </p>
      )}
    </div>
  );
}
