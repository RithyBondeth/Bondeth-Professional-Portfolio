"use client";

import { useState } from "react";
import Image from "next/image";
import { siteConfig } from "@/utils/constants/portfolio.constant";
import { IProject } from "@/utils/interfaces/portfolio/project.interface";
import { TProjectCategory } from "@/utils/types/portfolio/project-category.type";
import { AnimateIn } from "@/components/utils/animations/animate-in";
import { HorizontalScroll } from "@/components/utils/animations/horizontal-scroll";
import { GitHubIcon, ExternalLinkIcon } from "@/components/utils/icons";
import { getDictionary, type TLocale, type TDictionary } from "@/utils/i18n";
import { getProjects } from "@/utils/i18n/content";

const CATEGORIES = ["All", "Web", "AI", "Mobile"] as const;
type TFilter = "All" | TProjectCategory;

function categoryLabel(cat: TFilter, dict: TDictionary): string {
  return cat === "All" ? dict.projects.filterAll : cat;
}

export default function LandingProjects(props: { lang: TLocale }) {
  /* ---------------------------------- Props --------------------------------- */
  const { lang } = props;
  const dict = getDictionary(lang);
  const projects = getProjects(lang);

  /* -------------------------------- All States ------------------------------- */
  const [filter, setFilter] = useState<TFilter>("All");

  /* ---------------------------------- Utils --------------------------------- */
  const filteredProjects = projects.filter(
    (p) => filter === "All" || p.category === filter,
  );

  /* --------------------------------- Header --------------------------------- */
  const header = (
    <>
      <p className="text-primary font-mono text-xs tracking-[0.25em] uppercase mb-1">
        <span className="text-muted-foreground">&lt;</span>
        Projects
        <span className="text-muted-foreground"> /&gt;</span>
      </p>

      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <h2 className="text-3xl sm:text-4xl font-bold text-foreground mt-3">
          {dict.projects.heading}
        </h2>

        {/* Filter Tabs Section */}
        <div className="flex items-center gap-1 bg-card/50 p-1 rounded border border-border/40 w-fit">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setFilter(cat)}
              className={`px-4 py-1.5 rounded text-xs font-mono transition-all ${
                filter === cat
                  ? "bg-primary text-primary-foreground shadow-lg shadow-primary/20"
                  : "text-muted-foreground hover:text-foreground hover:bg-foreground/5"
              }`}
            >
              {categoryLabel(cat, dict)}
            </button>
          ))}
        </div>
      </div>
    </>
  );

  /* -------------------------------- Render UI ------------------------------- */
  return (
    <section id="projects" className="bg-background overflow-hidden">
      {/* Project Showcase — pins and scrolls sideways as you scroll (all sizes) */}
      <HorizontalScroll
        refreshOn={filter}
        trackClassName="py-2"
        header={header}
      >
        {filteredProjects.length > 0 ? (
          filteredProjects.map((project) => (
            <div
              key={project.title}
              className="w-[80vw] sm:w-[360px] shrink-0 snap-center"
            >
              <ProjectCard project={project} dict={dict} />
            </div>
          ))
        ) : (
          <div className="w-full py-20 text-center">
            <p className="text-muted-foreground font-mono text-sm">
              {dict.projects.empty}
            </p>
          </div>
        )}
      </HorizontalScroll>

      <div className="max-w-6xl mx-auto px-6 pb-24">
        {/* GitHub CTA Section */}
        <AnimateIn from="zoom-in" delay={0.1}>
          <div className="text-center mt-12">
            <a
              href={siteConfig.github}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors font-mono text-sm border border-border hover:border-primary/40 px-5 py-2.5 rounded"
            >
              <span className="text-primary dark:text-primary/60">$</span>
              git clone github.com/bondeth
              <ExternalLinkIcon className="w-3.5 h-3.5 ml-1" />
            </a>
          </div>
        </AnimateIn>
      </div>
    </section>
  );
}

/* --------------------------------- Utilities -------------------------------- */
function ProjectCard(props: { project: IProject; dict: TDictionary }) {
  /* ---------------------------------- Props --------------------------------- */
  const { project, dict } = props;

  /* -------------------------------- Render UI ------------------------------- */
  return (
    <article className="group flex flex-col h-full rounded border border-border/60 bg-card hover:border-primary/30 hover:shadow-[0_0_28px_rgba(34,211,238,0.1)] overflow-hidden transition-all duration-300 hover:-translate-y-1">
      {/* Preview Section */}
      <div className="relative h-40 overflow-hidden">
        {project.image ? (
          <Image
            src={project.image}
            alt={`${project.title} preview`}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div
            className={`absolute inset-0 bg-linear-to-br ${project.gradient}`}
          >
            {/* Mock Browser Bar */}
            <div className="absolute top-0 inset-x-0 h-7 bg-background/70 backdrop-blur-sm flex items-center px-3 gap-1.5">
              <span className="w-2 h-2 rounded-full bg-red-500/70" />
              <span className="w-2 h-2 rounded-full bg-yellow-500/70" />
              <span className="w-2 h-2 rounded-full bg-green-500/70" />
              <div className="ml-2 flex-1 h-3 rounded-sm bg-border/60 max-w-[140px]" />
            </div>
            <div className="absolute inset-0 top-7 p-4 flex flex-col gap-2">
              <div className="h-2.5 rounded bg-foreground/10 w-3/4" />
              <div className="h-2.5 rounded bg-foreground/10 w-1/2" />
              <div className="mt-2 h-14 rounded bg-foreground/5 border border-foreground/10" />
              <div className="flex gap-2 mt-auto">
                <div className="h-6 rounded bg-primary/20 w-16" />
                <div className="h-6 rounded bg-foreground/5 w-14" />
              </div>
            </div>
          </div>
        )}

        {/* File Path Overlay */}
        <div className="absolute top-8 left-0 right-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 px-3">
          <span className="text-[9px] font-mono text-primary dark:text-primary/70 bg-background/80 backdrop-blur-sm px-2 py-0.5 rounded">
            src/projects/{project.title.toLowerCase().replace(/\s+/g, "-")}.ts
          </span>
        </div>

        {/* Live Badge */}
        {project.live && (
          <div className="absolute top-8 right-3 flex items-center gap-1 px-2 py-0.5 rounded bg-emerald-500/15 border border-emerald-500/25 backdrop-blur-sm">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-[9px] text-emerald-400 font-mono">live</span>
          </div>
        )}
      </div>

      {/* Body Section */}
      <div className="flex flex-col flex-1 p-4 gap-3">
        {/* File Name Style Header */}
        <div className="flex items-center gap-2">
          <span className="text-[10px] font-mono text-muted-foreground dark:text-muted-foreground/50">
            ▸
          </span>
          <h3 className="text-foreground font-mono font-semibold text-sm leading-snug">
            {project.title}
          </h3>
        </div>

        <p className="text-muted-foreground text-xs leading-relaxed flex-1">
          {project.description}
        </p>

        {/* Tags */}
        <div className="flex flex-wrap gap-1">
          {project.tags.map((tag) => (
            <span
              key={tag}
              className="text-[10px] font-mono text-muted-foreground dark:text-muted-foreground/70 px-1.5 py-0.5 rounded border border-border/60 bg-muted/40"
            >
              {tag}
            </span>
          ))}
        </div>

        {/* Links */}
        <div className="flex items-center gap-2 pt-2 border-t border-border/40">
          <a
            href={project.github}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded text-xs font-mono text-muted-foreground bg-muted/40 border border-border/50 hover:border-border hover:text-foreground transition-colors"
          >
            <GitHubIcon className="w-3.5 h-3.5" />
            {dict.projects.source}
          </a>

          {project.live ? (
            <a
              href={project.live}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded text-xs font-mono text-primary-foreground bg-primary hover:bg-primary/90 transition-colors ml-auto"
            >
              {dict.projects.demo}
              <ExternalLinkIcon className="w-3 h-3" />
            </a>
          ) : (
            <span className="ml-auto text-[10px] text-muted-foreground dark:text-muted-foreground/50 font-mono">
              {dict.projects.noDemo}
            </span>
          )}
        </div>
      </div>
    </article>
  );
}
