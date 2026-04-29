import Image from "next/image";
import { projects, siteConfig } from "@/data/portfolio";
import type { Project } from "@/types";
import { AnimateIn, StaggerIn } from "@/components/ui/animate-in";

export default function Projects() {
  return (
    <section id="projects" className="py-24 px-6 bg-slate-900">
      <div className="max-w-5xl mx-auto">
        <AnimateIn>
          <p className="text-blue-400 font-mono text-sm tracking-widest uppercase">
            Projects
          </p>
        </AnimateIn>

        <AnimateIn delay={0.05}>
          <h2 className="text-3xl sm:text-4xl font-bold text-white mt-3 mb-12">
            Things I&apos;ve built
          </h2>
        </AnimateIn>

        <StaggerIn
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          stagger={0.12}
          y={30}
        >
          {projects.map((project) => (
            <ProjectCard key={project.title} project={project} />
          ))}
        </StaggerIn>

        <AnimateIn delay={0.1}>
          <div className="text-center mt-12">
            <a
              href={siteConfig.github}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-slate-400 hover:text-white transition-colors font-medium border border-slate-700 hover:border-slate-500 px-6 py-3 rounded-lg"
            >
              View more on GitHub
              <ExternalLinkIcon className="w-4 h-4" />
            </a>
          </div>
        </AnimateIn>
      </div>
    </section>
  );
}

function ProjectCard({ project }: { project: Project }) {
  return (
    <article className="group flex flex-col rounded-2xl bg-slate-800 border border-slate-700/60 hover:border-slate-500 overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-black/30">
      {/* ── Preview ──────────────────────────────────── */}
      <div className="relative h-44 overflow-hidden">
        {project.image ? (
          <Image
            src={project.image}
            alt={`${project.title} preview`}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          /* Gradient placeholder with mock browser chrome */
          <div
            className={`absolute inset-0 bg-gradient-to-br ${project.gradient}`}
          >
            {/* Mock browser bar */}
            <div className="absolute top-0 inset-x-0 h-7 bg-slate-900/60 backdrop-blur-sm flex items-center px-3 gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-red-500/70" />
              <span className="w-2.5 h-2.5 rounded-full bg-yellow-500/70" />
              <span className="w-2.5 h-2.5 rounded-full bg-green-500/70" />
              <div className="ml-2 flex-1 h-3.5 rounded-sm bg-slate-700/60 max-w-[140px]" />
            </div>
            {/* Mock content skeleton */}
            <div className="absolute inset-0 top-7 p-4 flex flex-col gap-2">
              <div className="h-3 rounded bg-white/10 w-3/4" />
              <div className="h-3 rounded bg-white/10 w-1/2" />
              <div className="mt-2 h-16 rounded-lg bg-white/5 border border-white/10" />
              <div className="flex gap-2 mt-auto">
                <div className="h-7 rounded-md bg-blue-500/30 w-20" />
                <div className="h-7 rounded-md bg-white/5 w-16" />
              </div>
            </div>
          </div>
        )}

        {/* Live badge */}
        {project.live && (
          <div className="absolute top-9 right-3 flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-500/20 border border-emerald-500/30 backdrop-blur-sm">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-[10px] text-emerald-400 font-mono font-medium">
              Live
            </span>
          </div>
        )}
      </div>

      {/* ── Body ─────────────────────────────────────── */}
      <div className="flex flex-col flex-1 p-5 gap-3">
        <h3 className="text-white font-semibold text-base leading-snug">
          {project.title}
        </h3>

        <p className="text-slate-400 text-sm leading-relaxed flex-1">
          {project.description}
        </p>

        {/* Tags */}
        <div className="flex flex-wrap gap-1.5">
          {project.tags.map((tag) => (
            <span
              key={tag}
              className="text-[11px] font-mono text-slate-500 px-2 py-0.5 rounded bg-slate-700/50"
            >
              {tag}
            </span>
          ))}
        </div>

        {/* ── Links ──────────────────────────────────── */}
        <div className="flex items-center gap-2 pt-1 border-t border-slate-700/50">
          <a
            href={project.github}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-slate-300 bg-slate-700/50 hover:bg-slate-600/60 hover:text-white transition-colors"
          >
            <GitHubIcon className="w-3.5 h-3.5" />
            Source
          </a>

          {project.live ? (
            <a
              href={project.live}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-white bg-blue-600 hover:bg-blue-500 transition-colors ml-auto"
            >
              Live Preview
              <ExternalLinkIcon className="w-3.5 h-3.5" />
            </a>
          ) : (
            <span className="ml-auto text-[11px] text-slate-600 font-mono">
              no demo
            </span>
          )}
        </div>
      </div>
    </article>
  );
}

function GitHubIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="currentColor" viewBox="0 0 24 24">
      <path
        fillRule="evenodd"
        d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
        clipRule="evenodd"
      />
    </svg>
  );
}

function ExternalLinkIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
      />
    </svg>
  );
}
