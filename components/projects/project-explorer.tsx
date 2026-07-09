"use client";

import { useState } from "react";
import { ProjectCard } from "@/components/projects/project-card";
import type { IProject } from "@/utils/interfaces/portfolio/project.interface";
import type { TProjectCategory } from "@/utils/types/portfolio/project-category.type";
import type { TDictionary, TLocale } from "@/utils/i18n";

const CATEGORIES = ["All", "Web", "AI", "Mobile"] as const;
type TFilter = "All" | TProjectCategory;

export function ProjectExplorer(props: {
  projects: IProject[];
  dict: TDictionary;
  lang: TLocale;
}) {
  const { projects, dict, lang } = props;
  const [filter, setFilter] = useState<TFilter>("All");
  const filtered = projects.filter(
    (project) => filter === "All" || project.category === filter,
  );

  return (
    <div>
      <div
        className="mb-10 flex w-fit max-w-full gap-1 overflow-x-auto rounded border border-border/40 bg-card/50 p-1"
        aria-label={dict.projects.filterLabel}
      >
        {CATEGORIES.map((category) => (
          <button
            key={category}
            type="button"
            onClick={() => setFilter(category)}
            aria-pressed={filter === category}
            className={`min-h-11 shrink-0 rounded px-4 font-mono text-xs transition-colors ${
              filter === category
                ? "bg-primary text-primary-foreground"
                : "text-muted-foreground hover:bg-foreground/5 hover:text-foreground"
            }`}
          >
            {category === "All" ? dict.projects.filterAll : category}
          </button>
        ))}
      </div>

      {filtered.length > 0 ? (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((project) => (
            <ProjectCard
              key={project.slug}
              project={project}
              dict={dict}
              lang={lang}
            />
          ))}
        </div>
      ) : (
        <div className="rounded border border-dashed border-border py-20 text-center">
          <p className="font-mono text-sm text-muted-foreground">
            {dict.projects.empty}
          </p>
        </div>
      )}
    </div>
  );
}
