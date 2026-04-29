import Image from "next/image";
import { experiences, organizations } from "@/data/portfolio";
import type { Organization } from "@/types";
import { AnimateIn, StaggerIn } from "@/components/ui/animate-in";
import { MarqueeTrack } from "@/components/ui/marquee-track";

export default function Experience() {
  return (
    <section id="experience" className="py-24 px-6 bg-card">
      <div className="max-w-5xl mx-auto">
        <AnimateIn>
          <p className="text-primary font-mono text-sm tracking-widest uppercase">
            Experience
          </p>
        </AnimateIn>

        <AnimateIn delay={0.05}>
          <h2 className="text-3xl sm:text-4xl font-bold text-foreground mt-3 mb-12">
            Where I&apos;ve worked
          </h2>
        </AnimateIn>

        <div className="relative">
          <div className="absolute left-0 top-0 bottom-0 w-px bg-slate-700 ml-[7px] hidden sm:block" />

          <StaggerIn className="space-y-10" stagger={0.15} y={30}>
            {experiences.map((exp, i) => (
              <div key={i} className="sm:pl-10 relative">
                <div className="hidden sm:block absolute left-0 top-1.5 w-3.5 h-3.5 rounded-full bg-blue-500 border-2 border-border ring-2 ring-blue-500/30" />

                <div className="bg-background rounded-xl p-6 border border-border hover:border-slate-600 transition-colors">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1 mb-3">
                    <div>
                      <h3 className="text-foreground font-semibold text-lg">
                        {exp.role}
                      </h3>
                      <p className="text-primary text-sm">{exp.company}</p>
                    </div>
                    <span className="text-muted-foreground text-sm font-mono">
                      {exp.period}
                    </span>
                  </div>
                  <p className="text-muted-foreground text-sm leading-relaxed mb-4">
                    {exp.description}
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {exp.tags.map((tag) => (
                      <span
                        key={tag}
                        className="px-2.5 py-1 bg-blue-500/10 text-primary text-xs rounded-md font-mono border border-blue-500/20"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </StaggerIn>
        </div>
      </div>

      {/* ── Organisation logo marquee ─────────────────── */}
      <AnimateIn delay={0.1}>
        <div className="mt-16 pt-12 border-t border-border/50">
          <p className="text-center text-xs font-mono text-muted-foreground uppercase tracking-widest mb-8">
            Organizations I&apos;ve worked with
          </p>

          <div className="relative overflow-hidden">
            {/* Left fade */}
            <div className="absolute inset-y-0 left-0 w-24 bg-linear-to-r from-slate-800 to-transparent z-10 pointer-events-none" />
            {/* Right fade */}
            <div className="absolute inset-y-0 right-0 w-24 bg-linear-to-l from-slate-800 to-transparent z-10 pointer-events-none" />

            <MarqueeTrack direction="rtl" duration={40}>
              {/* 10 copies to fill any screen width */}
              {Array.from({ length: 10 }, (_, copy) =>
                organizations.map((org) => (
                  <OrgBadge key={`${copy}-${org.name}`} org={org} />
                )),
              )}
            </MarqueeTrack>
          </div>
        </div>
      </AnimateIn>
    </section>
  );
}

function OrgBadge({ org }: { org: Organization }) {
  return (
    <div className="relative flex items-center justify-center px-8 py-5 bg-slate-700/50 border border-slate-600/40 hover:border-accent hover:bg-slate-700/80 transition-all duration-300 shrink-0 select-none group">
      <div className="relative w-24 h-24">
        <Image
          src={org.logo}
          alt={org.name}
          fill
          className="object-contain transition-opacity duration-300 group-hover:opacity-30"
        />
      </div>
      {/* Name label on hover */}
      <span className="absolute inset-0 flex items-center justify-center text-sm font-semibold text-foreground opacity-0 group-hover:opacity-100 transition-opacity duration-300 px-3 text-center leading-snug">
        {org.name}
      </span>
    </div>
  );
}
