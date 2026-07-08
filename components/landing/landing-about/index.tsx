"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { siteConfig } from "@/utils/constants/portfolio.constant";
import { AnimateIn, StaggerIn } from "@/components/utils/animations/animate-in";
import { GitHubIcon, LinkedInIcon } from "@/components/utils/icons";
import { getDictionary, type TLocale } from "@/utils/i18n";
import { getSiteConfig } from "@/utils/i18n/content";

/* --------------------------------- Portrait -------------------------------- */
/**
 * The photo is framed like the Hero's profile.ts editor window so it reads as
 * another panel in the same IDE. The frame colours are intentionally FIXED
 * (not theme tokens) so the photo's dark code-editor backdrop looks like a
 * deliberate embedded editor screenshot in light mode and melts into bg-card
 * in dark mode.
 */
function PortraitPanel(props: { alt: string }) {
  return (
    <figure className="relative w-full max-w-sm mx-auto lg:max-w-none">
      {/* Ambient Glow */}
      <div className="absolute -inset-6 bg-cyan-500/6 rounded-2xl blur-3xl pointer-events-none" />

      {/* Editor Window */}
      <div className="relative rounded-md border border-[#1a2e52] bg-[#0c1428] overflow-hidden shadow-2xl shadow-black/30 dark:shadow-black/60">
        {/* Window Chrome */}
        <div className="flex items-center gap-1.5 px-4 py-3 border-b border-[#1a2e52]/60 bg-black/30">
          <span aria-hidden className="w-3 h-3 rounded-full bg-red-500/80" />
          <span aria-hidden className="w-3 h-3 rounded-full bg-yellow-500/70" />
          <span aria-hidden className="w-3 h-3 rounded-full bg-green-500/70" />
          <span className="ml-3 text-slate-500 text-[11px] font-mono select-none">
            rithybondeth.png
          </span>
        </div>

        {/* Photo */}
        <Image
          src="/rithybondeth-full.webp"
          alt={props.alt}
          width={1000}
          height={1070}
          sizes="(min-width: 1024px) 400px, (min-width: 768px) 45vw, 100vw"
          className="w-full h-auto block select-none"
        />

        {/* Status Bar */}
        <div className="flex items-center justify-between px-4 py-2.5 border-t border-[#1a2e52]/60 bg-black/30 text-[10px] font-mono text-slate-400">
          <span>
            <span className="text-emerald-400">▸</span> whoami
          </span>
          <span>Phnom Penh, KH</span>
        </div>
      </div>

      {/* Caption */}
      <figcaption className="mt-3 text-[11px] font-mono text-muted-foreground text-center lg:text-left">
        {"// full-stack + AI engineer"}
      </figcaption>
    </figure>
  );
}

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
      <p className="text-[10px] font-mono text-muted-foreground mb-3 group-hover:text-primary dark:group-hover:text-primary/60 transition-colors">
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

        {/* Portrait + Bio Row */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-center mt-10">
          {/* Portrait Section — leads on mobile as a human hook */}
          <AnimateIn delay={0.15} className="lg:col-span-5">
            <PortraitPanel alt={dict.about.portraitAlt} />
          </AnimateIn>

          {/* Bio Section */}
          <div className="lg:col-span-7">
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
        </div>

        {/* Stats Section — full-width strip; counts up when the section enters view */}
        <StaggerIn
          className="grid grid-cols-2 lg:grid-cols-4 gap-4 mt-12"
          stagger={0.1}
        >
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
    </section>
  );
}
