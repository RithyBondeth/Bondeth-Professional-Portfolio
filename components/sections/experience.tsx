import Image from "next/image";
import { experiences, organizations } from "@/data/portfolio";
import type { Organization } from "@/types";
import { AnimateIn, StaggerIn } from "@/components/ui/animate-in";
import { MarqueeTrack } from "@/components/ui/marquee-track";

export default function Experience() {
  return (
    <section id="experience" className="py-24 px-6 bg-card">
      <div className="max-w-6xl mx-auto">
        <AnimateIn>
          <p className="text-primary font-mono text-xs tracking-[0.25em] uppercase mb-1">
            <span className="text-muted-foreground">//</span> experience.json
          </p>
        </AnimateIn>

        <AnimateIn delay={0.05}>
          <h2 className="text-3xl sm:text-4xl font-bold text-foreground mt-3 mb-12">
            Where I&apos;ve worked
          </h2>
        </AnimateIn>

        <div className="relative">
          {/* Vertical timeline line */}
          <div className="absolute left-0 top-0 bottom-0 w-px bg-border ml-[7px] hidden sm:block" />

          <StaggerIn className="space-y-8" stagger={0.12} y={30}>
            {experiences.map((exp, i) => (
              <div key={i} className="sm:pl-10 relative">
                {/* Timeline dot */}
                <div className="hidden sm:flex absolute left-0 top-2 w-3.5 h-3.5 rounded-full bg-primary/20 border border-primary/60 items-center justify-center">
                  <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                </div>

                <div className="bg-background rounded border border-border/60 p-5 hover:border-primary/25 hover:shadow-[0_0_20px_rgba(34,211,238,0.08)] transition-all duration-300">
                  <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-1 mb-3">
                    <div>
                      <h3 className="text-foreground font-semibold text-base">
                        {exp.role}
                      </h3>
                      <p className="text-primary text-xs font-mono mt-0.5">{exp.company}</p>
                    </div>
                    <span className="text-muted-foreground text-xs font-mono shrink-0 mt-0.5">
                      {exp.period}
                    </span>
                  </div>
                  <p className="text-muted-foreground text-xs leading-relaxed mb-4">
                    {exp.description}
                  </p>
                  <div className="flex flex-wrap gap-1.5">
                    {exp.tags.map((tag) => (
                      <span
                        key={tag}
                        className="px-2 py-0.5 bg-primary/8 text-primary text-[10px] rounded border border-primary/15 font-mono"
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

      {/* Organisation logo marquee */}
      <AnimateIn delay={0.1}>
        <div className="mt-16 pt-12 border-t border-border/40">
          <p className="text-center text-[10px] font-mono text-muted-foreground/60 uppercase tracking-[0.2em] mb-8">
            Organizations I&apos;ve worked with
          </p>

          <div className="relative overflow-hidden">
            <div className="absolute inset-y-0 left-0 w-24 bg-linear-to-r from-[#0c1428] to-transparent z-10 pointer-events-none" />
            <div className="absolute inset-y-0 right-0 w-24 bg-linear-to-l from-[#0c1428] to-transparent z-10 pointer-events-none" />

            <MarqueeTrack direction="rtl" duration={40}>
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
    <div className="relative flex items-center justify-center px-8 py-5 bg-background/60 border border-border/40 hover:border-primary/20 hover:bg-background/80 transition-all duration-300 shrink-0 select-none group">
      <div className="relative w-20 h-20">
        <Image
          src={org.logo}
          alt={org.name}
          fill
          className="object-contain transition-opacity duration-300 group-hover:opacity-20"
        />
      </div>
      <span className="absolute inset-0 flex items-center justify-center text-xs font-mono font-medium text-foreground opacity-0 group-hover:opacity-100 transition-opacity duration-300 px-3 text-center leading-snug">
        {org.name}
      </span>
    </div>
  );
}
