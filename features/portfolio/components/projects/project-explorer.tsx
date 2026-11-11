"use client";

import { useRef, useState } from "react";
import { RotateCcw, Search, X } from "lucide-react";
import { Select } from "@/shared/components/ui/select";
import { ProjectCard } from "@/features/portfolio/components/projects/project-card";
import {
  PROJECT_GROUPS,
  type Project,
  type ProjectCategory,
  type ProjectGroup,
} from "@/features/portfolio/domain";
import { formatCount, type Dictionary, type Locale } from "@/shared/i18n";

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

  const activeFilters = [
    { key: "query", value: query, label: query, clear: () => setQuery("") },
    {
      key: "group",
      value: group,
      label: group ? dict.projects.groups[group] : "",
      clear: () => setGroup(""),
    },
    {
      key: "platform",
      value: platform,
      label: platform,
      clear: () => setPlatform(""),
    },
    { key: "topic", value: topic, label: topic, clear: () => setTopic("") },
  ].filter((filter) => filter.value);

  return (
    <div>
      <div
        role="search"
        aria-label={dict.projects.searchLabel}
        className="mb-10 rounded-2xl border border-border/65 bg-card/85 p-5 shadow-[0_8px_24px_-20px_rgb(0_0_0/0.16)] sm:p-6"
      >
        <div className="space-y-2.5">
          <label
            htmlFor="project-search"
            className="text-sm font-semibold text-foreground"
          >
            {dict.projects.searchLabel}
          </label>
          <div className="group flex min-h-14 items-center gap-3 rounded-xl border border-border/70 bg-background px-4 transition-[border-color,box-shadow] focus-within:border-primary/60 focus-within:ring-2 focus-within:ring-primary/10">
            <Search
              aria-hidden
              className="size-5 shrink-0 text-muted-foreground group-focus-within:text-primary"
            />
            <input
              id="project-search"
              ref={searchRef}
              type="search"
              value={query}
              onChange={(event) => setQuery(event.currentTarget.value)}
              placeholder={dict.projects.searchPlaceholder}
              className="min-h-14 min-w-0 flex-1 bg-transparent text-base text-foreground outline-none placeholder:text-muted-foreground [&::-webkit-search-cancel-button]:appearance-none"
            />
            {query && (
              <button
                type="button"
                aria-label={dict.projects.clearSearch}
                onClick={() => {
                  setQuery("");
                  searchRef.current?.focus();
                }}
                className="-mr-2 grid size-11 shrink-0 place-items-center rounded-lg text-muted-foreground transition-colors hover:bg-muted hover:text-foreground focus-visible:outline-2 focus-visible:outline-primary"
              >
                <X aria-hidden className="size-4" />
              </button>
            )}
          </div>
        </div>
        <div className="mt-5 grid gap-4 sm:grid-cols-3">
          <div className="min-w-0 space-y-2">
            <label
              htmlFor="project-collection"
              className="text-xs font-medium text-field-muted-foreground"
            >
              {dict.projects.collectionLabel}
            </label>
            <Select
              id="project-collection"
              value={group}
              onValueChange={(value) => setGroup(value as ProjectGroup | "")}
              options={[
                { value: "", label: dict.projects.filterAll },
                ...groups.map((item) => ({
                  value: item,
                  label: dict.projects.groups[item],
                })),
              ]}
            />
          </div>
          <div className="min-w-0 space-y-2">
            <label
              htmlFor="project-platform"
              className="text-xs font-medium text-field-muted-foreground"
            >
              {dict.projects.platformLabel}
            </label>
            <Select
              id="project-platform"
              value={platform}
              onValueChange={(value) =>
                setPlatform(value as ProjectCategory | "")
              }
              options={[
                { value: "", label: dict.projects.filterAll },
                ...platforms.map((item) => ({ value: item, label: item })),
              ]}
            />
          </div>
          <div className="min-w-0 space-y-2">
            <label
              htmlFor="project-topic"
              className="text-xs font-medium text-field-muted-foreground"
            >
              {dict.projects.filterDomain}
            </label>
            <Select
              id="project-topic"
              value={topic}
              onValueChange={setTopic}
              options={[
                { value: "", label: dict.projects.filterAll },
                ...topics.map((item) => ({ value: item, label: item })),
              ]}
            />
          </div>
        </div>
        {activeFilters.length > 0 && (
          <div
            role="group"
            aria-label={dict.projects.activeFilters}
            className="mt-4 flex flex-wrap gap-2"
          >
            {activeFilters.map((filter) => (
              <button
                key={filter.key}
                type="button"
                aria-label={`${dict.projects.removeFilter}: ${filter.label}`}
                onClick={() => {
                  filter.clear();
                  searchRef.current?.focus();
                }}
                className="inline-flex min-h-11 max-w-full items-center gap-2 rounded-lg border border-primary/20 bg-primary/5 px-3 text-xs text-foreground transition-colors hover:border-primary/40 hover:bg-primary/10 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
              >
                <span className="truncate">{filter.label}</span>
                <X aria-hidden className="size-3.5 shrink-0 text-primary" />
              </button>
            ))}
          </div>
        )}
        <div className="mt-5 flex min-h-11 flex-wrap items-center justify-between gap-2 border-t border-border/60 pt-3">
          <p
            role="status"
            className="flex items-center gap-2 text-sm text-muted-foreground"
          >
            {dict.projects.resultsLabel}
            <span className="rounded-md bg-muted px-2 py-0.5 font-semibold tabular-nums text-foreground">
              {formatCount(matches.length, lang)}
            </span>
          </p>
          <button
            type="button"
            disabled={activeFilters.length === 0}
            onClick={() => {
              setQuery("");
              setGroup("");
              setPlatform("");
              setTopic("");
              searchRef.current?.focus();
            }}
            className="inline-flex min-h-11 items-center gap-2 rounded-lg px-3 text-xs font-medium text-primary transition-colors hover:bg-primary/5 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary disabled:pointer-events-none disabled:text-muted-foreground disabled:opacity-50"
          >
            <RotateCcw aria-hidden className="size-3.5" />
            {dict.projects.clearFilters}
          </button>
        </div>
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
