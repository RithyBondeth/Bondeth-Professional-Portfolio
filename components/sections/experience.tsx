"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { experiences, organizations } from "@/data/portfolio";
import type { Organization } from "@/types";
import { AnimateIn, StaggerIn } from "@/components/ui/animate-in";
import { MarqueeTrack } from "@/components/ui/marquee-track";

export default function Experience() {
  const lineRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    const el = lineRef.current;
    if (!el) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        el,
        { scaleY: 0, transformOrigin: "top center" },
        {
          scaleY: 1,
          ease: "none",
          scrollTrigger: {
            trigger: el,
            start: "top 80%",
            end: "bottom 20%",
            scrub: 0.8,
          },
        }
      );
    });

    return () => ctx.revert();
  }, []);

  return (
    <section id="experience" className="py-24 px-6 bg-slate-800">
      <div className="max-w-5xl mx-auto">
        <AnimateIn>
          <p className="text-blue-400 font-mono text-sm tracking-widest uppercase">
            Experience
          </p>
        </AnimateIn>

        <AnimateIn delay={0.05}>
          <h2 className="text-3xl sm:text-4xl font-bold text-white mt-3 mb-12">
            Where I&apos;ve worked
          </h2>
        </AnimateIn>

        <div className="relative">
          <div
            ref={lineRef}
            className="absolute left-0 top-0 bottom-0 w-px bg-slate-700 ml-[7px] hidden sm:block"
          />

          <StaggerIn className="space-y-10" stagger={0.15} y={30}>
            {experiences.map((exp, i) => (
              <div key={i} className="sm:pl-10 relative group/entry">
                <div className="hidden sm:block absolute left-0 top-1.5 w-3.5 h-3.5 rounded-full bg-blue-500 border-2 border-slate-800 ring-2 ring-blue-500/30 group-hover/entry:ring-4 group-hover/entry:ring-blue-500/50 group-hover/entry:bg-blue-400 transition-all duration-300" />

                <div className="bg-slate-900 rounded-xl p-6 border border-slate-700 hover:border-blue-500/30 hover:shadow-[0_8px_32px_rgba(59,130,246,0.1)] transition-all duration-300">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1 mb-3">
                    <div>
                      <h3 className="text-white font-semibold text-lg">
                        {exp.role}
                      </h3>
                      <p className="text-blue-400 text-sm">{exp.company}</p>
                    </div>
                    <span className="text-slate-500 text-sm font-mono">
                      {exp.period}
                    </span>
                  </div>
                  <p className="text-slate-400 text-sm leading-relaxed mb-4">
                    {exp.description}
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {exp.tags.map((tag) => (
                      <span
                        key={tag}
                        className="px-2.5 py-1 bg-blue-500/10 text-blue-400 text-xs rounded-md font-mono border border-blue-500/20 hover:bg-blue-500/20 hover:border-blue-500/40 transition-colors duration-200"
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
        <div className="mt-16 pt-12 border-t border-slate-700/50">
          <p className="text-center text-xs font-mono text-slate-600 uppercase tracking-widest mb-8">
            Organizations I&apos;ve worked with
          </p>

          <div className="relative overflow-hidden">
            <div className="absolute inset-y-0 left-0 w-24 bg-gradient-to-r from-slate-800 to-transparent z-10 pointer-events-none" />
            <div className="absolute inset-y-0 right-0 w-24 bg-gradient-to-l from-slate-800 to-transparent z-10 pointer-events-none" />

            <MarqueeTrack direction="rtl" duration={40}>
              {Array.from({ length: 10 }, (_, copy) =>
                organizations.map((org) => (
                  <OrgBadge key={`${copy}-${org.name}`} org={org} />
                ))
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
    <div className="relative flex items-center justify-center px-8 py-5 bg-slate-700/50 border border-slate-600/40 hover:border-blue-500/40 hover:bg-slate-700/80 hover:shadow-[0_4px_16px_rgba(59,130,246,0.12)] transition-all duration-300 shrink-0 select-none group">
      <div className="relative w-24 h-24">
        <Image
          src={org.logo}
          alt={org.name}
          fill
          className="object-contain transition-opacity duration-300 group-hover:opacity-30"
        />
      </div>
      <span className="absolute inset-0 flex items-center justify-center text-sm font-semibold text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300 px-3 text-center leading-snug">
        {org.name}
      </span>
    </div>
  );
}
