"use client";

import { useEffect, useRef, useState } from "react";
import { siteConfig } from "@/utils/constants/portfolio.constant";
import { AnimateIn, StaggerIn } from "@/components/utils/animations/animate-in";
import { GitHubIcon, LinkedInIcon } from "@/components/utils/icons";
import { getDictionary, type TLocale } from "@/utils/i18n";
import { getSiteConfig } from "@/utils/i18n/content";

/* ---------------------------------- Hooks ---------------------------------- */
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

/* --------------------------------- Utilities -------------------------------- */
function StatCard(props: {
  label: string;
  value: string;
  varName: string;
  started: boolean;
}) {
  /* ---------------------------------- Props --------------------------------- */
  const { label, value, varName, started } = props;

  /* ---------------------------------- Utils --------------------------------- */
  const numeric = parseInt(value);
  const suffix = value.replace(/\d+/, "");
  const count = useCountUp(numeric, 1400, started);

  /* -------------------------------- Render UI ------------------------------- */
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
  { key: "yearsExp", value: "3+", varName: "yearsExp" },
  { key: "projects", value: "20+", varName: "projects" },
  { key: "techStack", value: "15+", varName: "techStack" },
  { key: "clients", value: "10+", varName: "clients" },
] as const;

export default function LandingAbout(props: { lang: TLocale }) {
  /* ---------------------------------- Props --------------------------------- */
  const { lang } = props;
  const dict = getDictionary(lang);
  const localized = getSiteConfig(lang);

  /* -------------------------------- All States ------------------------------- */
  const [started, setStarted] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);

  /* --------------------------------- Effects -------------------------------- */
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

  /* -------------------------------- Render UI ------------------------------- */
  return (
    <section ref={sectionRef} id="about" className="py-24 px-6 bg-card">
      <div className="max-w-6xl mx-auto">
        <AnimateIn>
          <p className="text-primary font-mono text-xs tracking-[0.25em] uppercase mb-1">
            <span className="text-muted-foreground">{"//"}</span> about.tsx
          </p>
        </AnimateIn>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-16 items-start mt-10">
          {/* Bio Section */}
          <div>
            <AnimateIn delay={0.05}>
              <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-6 leading-snug">
                {dict.about.heading}
              </h2>
            </AnimateIn>

            <StaggerIn className="space-y-4" stagger={0.15} delay={0.1}>
              {localized.bio.map((paragraph, i) => (
                <p
                  key={i}
                  className="text-muted-foreground leading-relaxed text-sm"
                >
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
                  <GitHubIcon className="w-5 h-5" />
                </a>
                <a
                  href={siteConfig.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-muted-foreground hover:text-primary transition-colors"
                  aria-label="LinkedIn"
                >
                  <LinkedInIcon className="w-5 h-5" />
                </a>
              </div>
            </AnimateIn>
          </div>

          {/* Stats Section — count up when the section enters view */}
          <StaggerIn className="grid grid-cols-2 gap-4" stagger={0.1}>
            {stats.map((stat) => (
              <StatCard
                key={stat.key}
                label={dict.about.stats[stat.key]}
                value={stat.value}
                varName={stat.varName}
                started={started}
              />
            ))}
          </StaggerIn>
        </div>
      </div>
    </section>
  );
}
