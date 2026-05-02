"use client";

import { useEffect, useRef, useState } from "react";
import { siteConfig } from "@/data/portfolio";
import { AnimateIn, StaggerIn } from "@/components/ui/animate-in";

function useCountUp(target: number, duration: number, started: boolean) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    if (!started) return;
    const startTime = performance.now();
    const tick = (now: number) => {
      const p = Math.min((now - startTime) / duration, 1);
      setCount(Math.round((1 - Math.pow(1 - p, 3)) * target));
      if (p < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }, [target, duration, started]);
  return count;
}

function StatCard({
  label,
  value,
  varName,
  started,
}: {
  label: string;
  value: string;
  varName: string;
  started: boolean;
}) {
  const numeric = parseInt(value);
  const suffix = value.replace(/\d+/, "");
  const count = useCountUp(numeric, 1400, started);

  return (
    <div className="rounded border border-border/60 bg-background p-5 hover:border-primary/30 hover:shadow-[0_0_24px_rgba(34,211,238,0.09)] transition-all duration-300 group">
      <p className="text-[10px] font-mono text-muted-foreground mb-3 group-hover:text-primary/60 transition-colors">
        <span className="text-violet-400">const</span>{" "}
        <span className="text-sky-300">{varName}</span>
      </p>
      <div className="text-3xl font-bold text-primary mb-1 font-mono tabular-nums">
        {count}
        {suffix}
      </div>
      <div className="text-xs text-muted-foreground">{label}</div>
    </div>
  );
}

const stats = [
  { label: "Years Experience", value: "3+", varName: "yearsExp" },
  { label: "Projects Completed", value: "20+", varName: "projects" },
  { label: "Technologies", value: "15+", varName: "techStack" },
  { label: "Happy Clients", value: "10+", varName: "clients" },
];

export default function About() {
  const [started, setStarted] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const obs = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setStarted(true);
          obs.disconnect();
        }
      },
      { threshold: 0.2 },
    );
    if (sectionRef.current) obs.observe(sectionRef.current);
    return () => obs.disconnect();
  }, []);

  return (
    <section ref={sectionRef} id="about" className="py-24 px-6 bg-card">
      <div className="max-w-6xl mx-auto">
        <AnimateIn>
          <p className="text-primary font-mono text-xs tracking-[0.25em] uppercase mb-1">
            <span className="text-muted-foreground">//</span> about.tsx
          </p>
        </AnimateIn>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-16 items-start mt-10">
          {/* Bio */}
          <div>
            <AnimateIn delay={0.05}>
              <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-6 leading-snug">
                Passionate about building things that matter.
              </h2>
            </AnimateIn>

            <StaggerIn className="space-y-4" stagger={0.15} delay={0.1}>
              {siteConfig.bio.map((paragraph, i) => (
                <p key={i} className="text-muted-foreground leading-relaxed text-sm">
                  {paragraph}
                </p>
              ))}
            </StaggerIn>

            <AnimateIn delay={0.3}>
              <div className="mt-8 flex gap-4">
                <a
                  href={siteConfig.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-muted-foreground hover:text-primary transition-colors"
                  aria-label="GitHub"
                >
                  <GitHubIcon />
                </a>
                <a
                  href={siteConfig.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-muted-foreground hover:text-primary transition-colors"
                  aria-label="LinkedIn"
                >
                  <LinkedInIcon />
                </a>
              </div>
            </AnimateIn>
          </div>

          {/* Stats — count up when the section enters view */}
          <StaggerIn className="grid grid-cols-2 gap-4" stagger={0.1}>
            {stats.map((stat) => (
              <StatCard key={stat.label} {...stat} started={started} />
            ))}
          </StaggerIn>
        </div>
      </div>
    </section>
  );
}

function GitHubIcon() {
  return (
    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
      <path
        fillRule="evenodd"
        d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
        clipRule="evenodd"
      />
    </svg>
  );
}

function LinkedInIcon() {
  return (
    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
    </svg>
  );
}
