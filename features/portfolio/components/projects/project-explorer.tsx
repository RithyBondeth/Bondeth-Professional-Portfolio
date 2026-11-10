"use client";

import { useRef, useState } from "react";
import { ProjectCard } from "@/features/portfolio/components/projects/project-card";
import {
  PROJECT_GROUPS,
  type Project,
  type ProjectCategory,
  type ProjectGroup,
} from "@/features/portfolio/domain";
import { formatCount, type Dictionary, type Locale } from "@/shared/i18n";

const FILTER_CLASS =
  "min-h-11 w-full rounded-lg border border-border bg-card px-3 text-base text-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary";

export function ProjectExplorer({
  projects,
  dict,
  lang,
}: {
  projects: Project[];
  dict: Dictionary;
  lang: Locale;
}) {
  const [query, setQuery] = useState("");
  const [platform, setPlatform] = useState<ProjectCategory | "">("");
  const [group, setGroup] = useState<ProjectGroup | "">("");
  const [topic, setTopic] = useState("");
  const searchRef = useRef<HTMLInputElement>(null);
  const terms = query
    .toLocaleLowerCase(lang)
    .trim()
    .split(/\s+/u)
    .filter(Boolean);
  const platforms = [...new Set(projects.map((project) => project.category))];
  const topics = [
    ...new Set(projects.flatMap((project) => project.domains ?? [])),
  ].sort();
  const groups = PROJECT_GROUPS.filter((item) =>
    projects.some((project) => project.group === item),
  );

  const matches = projects.filter((project) => {
    if (platform && project.category !== platform) return false;
    if (group && project.group !== group) return false;
    if (topic && !project.domains?.includes(topic)) return false;

    const haystack = [
      project.title,
      project.visibility === "confidential" ? "" : project.description,
      project.category,
      dict.projects.groups[project.group],
      ...(project.domains ?? []),
      ...project.tags,
    ]
      .join(" ")
      .toLocaleLowerCase(lang);
    return terms.every((term) => haystack.includes(term));
  });

  return (
    <div>
      <div className="mb-5 grid gap-3 rounded-xl border border-border bg-card/50 p-4 sm:grid-cols-2 lg:grid-cols-[2fr_1fr_1fr_1fr]">
        <div className="flex min-w-0 flex-col gap-2 text-sm font-medium">
          <label htmlFor="project-search">{dict.projects.searchLabel}</label>
          <input
            id="project-search"
            ref={searchRef}
            type="search"
            value={query}
            onChange={(event) => setQuery(event.currentTarget.value)}
            placeholder={dict.projects.searchPlaceholder}
            className={FILTER_CLASS}
          />
        </div>
        <div className="flex min-w-0 flex-col gap-2 text-sm font-medium">
          <label htmlFor="project-collection">
            {dict.projects.collectionLabel}
          </label>
          <select
            id="project-collection"
            value={group}
            onChange={(event) =>
              setGroup(event.currentTarget.value as ProjectGroup | "")
            }
            className={FILTER_CLASS}
          >
            <option value="">{dict.projects.filterAll}</option>
            {groups.map((item) => (
              <option key={item} value={item}>
                {dict.projects.groups[item]}
              </option>
            ))}
          </select>
        </div>
        <div className="flex min-w-0 flex-col gap-2 text-sm font-medium">
          <label htmlFor="project-platform">
            {dict.projects.platformLabel}
          </label>
          <select
            id="project-platform"
            value={platform}
            onChange={(event) =>
              setPlatform(event.currentTarget.value as ProjectCategory | "")
            }
            className={FILTER_CLASS}
          >
            <option value="">{dict.projects.filterAll}</option>
            {platforms.map((item) => (
              <option key={item}>{item}</option>
            ))}
          </select>
        </div>
        <div className="flex min-w-0 flex-col gap-2 text-sm font-medium">
          <label htmlFor="project-topic">{dict.projects.filterDomain}</label>
          <select
            id="project-topic"
            value={topic}
            onChange={(event) => setTopic(event.currentTarget.value)}
            className={FILTER_CLASS}
          >
            <option value="">{dict.projects.filterAll}</option>
            {topics.map((item) => (
              <option key={item}>{item}</option>
            ))}
          </select>
        </div>
      </div>
      <div className="mb-8 flex min-h-11 flex-wrap items-center justify-between gap-2">
        <p role="status" className="text-sm text-muted-foreground">
          {dict.projects.resultsLabel}: {formatCount(matches.length, lang)}
        </p>
        {(query || group || platform || topic) && (
          <button
            type="button"
            onClick={() => {
              setQuery("");
              setGroup("");
              setPlatform("");
              setTopic("");
              searchRef.current?.focus();
            }}
            className="min-h-11 rounded-lg px-3 text-sm text-primary underline underline-offset-4 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
          >
            {dict.projects.clearFilters}
          </button>
        )}
      </div>
      {matches.length ? (
        <div className="space-y-14">
          {groups.map((item) => {
            const entries = matches.filter((project) => project.group === item);
            if (!entries.length) return null;
            return (
              <section key={item} aria-labelledby={`collection-${item}`}>
                <div className="mb-5 border-b border-border/60 pb-3">
                  <h2
                    id={`collection-${item}`}
                    className="text-xl font-semibold tracking-tight"
                  >
                    {dict.projects.groups[item]}
                  </h2>
                  {item === "public-sector" && (
                    <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
                      {dict.projects.governmentBlurb}
                    </p>
                  )}
                </div>
                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                  {entries.map((project) => (
                    <ProjectCard
                      key={project.slug}
                      project={project}
                      dict={dict}
                      lang={lang}
                      eagerPreview
                    />
                  ))}
                </div>
              </section>
            );
          })}
        </div>
      ) : (
        <p className="rounded-lg border border-dashed border-border py-20 text-center text-sm text-muted-foreground">
          {dict.projects.empty}
        </p>
      )}
    </div>
  );
}
