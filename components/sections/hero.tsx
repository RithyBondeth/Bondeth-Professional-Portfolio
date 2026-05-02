"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { siteConfig } from "@/data/portfolio";
import { HeroBackground } from "@/components/ui/hero-background";

const TITLES = ["Full Stack Developer", "AI Engineer", "Mobile App Developer"];

function useTypewriter(phrases: string[], startDelay = 1200) {
  const [displayed, setDisplayed] = useState("");
  const [phraseIdx, setPhraseIdx] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);
  const [started, setStarted] = useState(false);

  useEffect(() => {
    const id = setTimeout(() => setStarted(true), startDelay);
    return () => clearTimeout(id);
  }, [startDelay]);

  useEffect(() => {
    if (!started) return;
    const full = phrases[phraseIdx];
    let wait: number;
    if (isDeleting) {
      wait = 35;
    } else if (displayed.length === full.length) {
      wait = 2200;
    } else {
      wait = 75;
    }
    const id = setTimeout(() => {
      if (!isDeleting && displayed.length === full.length) {
        setIsDeleting(true);
      } else if (isDeleting && displayed.length === 0) {
        setIsDeleting(false);
        setPhraseIdx((i) => (i + 1) % phrases.length);
      } else {
        const next = isDeleting
          ? full.slice(0, displayed.length - 1)
          : full.slice(0, displayed.length + 1);
        setDisplayed(next);
      }
    }, wait);
    return () => clearTimeout(id);
  }, [displayed, isDeleting, phraseIdx, phrases, started]);

  return displayed;
}

function CodeBlock() {
  return (
    <div className="relative w-full max-w-sm xl:max-w-md">
      {/* Ambient glow */}
      <div className="absolute -inset-6 bg-cyan-500/6 rounded-2xl blur-3xl pointer-events-none" />

      {/* Editor window */}
      <div className="relative rounded-md border border-border bg-card overflow-hidden shadow-2xl shadow-black/60">
        {/* Window chrome */}
        <div className="flex items-center gap-1.5 px-4 py-3 border-b border-border/60 bg-black/30">
          <span className="w-3 h-3 rounded-full bg-red-500/80" />
          <span className="w-3 h-3 rounded-full bg-yellow-500/70" />
          <span className="w-3 h-3 rounded-full bg-green-500/70" />
          <span className="ml-3 text-muted-foreground text-[11px] font-mono select-none">
            profile.ts
          </span>
        </div>

        {/* Line numbers + code */}
        <div className="flex text-xs font-mono leading-6 overflow-x-auto">
          {/* Line numbers */}
          <div className="select-none text-right pr-4 pl-4 py-5 text-[#1a2e52] border-r border-border/30 shrink-0">
            {Array.from({ length: 18 }, (_, i) => (
              <div key={i}>{i + 1}</div>
            ))}
          </div>

          {/* Code content */}
          <pre className="py-5 pl-4 pr-6 text-slate-300">
            <span className="text-slate-500">{"// Developer profile"}</span>
            {"\n"}
            <span className="text-violet-400">{"const"}</span>
            {" "}
            <span className="text-sky-300">{"developer"}</span>
            {" = {\n"}
            {"  "}
            <span className="text-blue-300">{"name"}</span>
            {": "}
            <span className="text-cyan-300">{"\"Rithy Bondeth\""}</span>
            {",\n"}
            {"  "}
            <span className="text-blue-300">{"role"}</span>
            {": [\n"}
            {"    "}
            <span className="text-cyan-300">{"\"Full Stack Dev\""}</span>
            {",\n"}
            {"    "}
            <span className="text-cyan-300">{"\"AI Engineer\""}</span>
            {",\n"}
            {"  ],\n"}
            {"  "}
            <span className="text-blue-300">{"location"}</span>
            {": "}
            <span className="text-cyan-300">{"\"Phnom Penh, KH\""}</span>
            {",\n"}
            {"  "}
            <span className="text-blue-300">{"stack"}</span>
            {": [\n"}
            {"    "}
            <span className="text-cyan-300">{"\"Next.js\""}</span>
            {", "}
            <span className="text-cyan-300">{"\"FastAPI\""}</span>
            {",\n"}
            {"    "}
            <span className="text-cyan-300">{"\"PyTorch\""}</span>
            {", "}
            <span className="text-cyan-300">{"\"Flutter\""}</span>
            {",\n"}
            {"  ],\n"}
            {"  "}
            <span className="text-blue-300">{"available"}</span>
            {": "}
            <span className="text-orange-300">{"true"}</span>
            {",\n"}
            {"} "}
            <span className="text-violet-400">{"satisfies"}</span>
            {" "}
            <span className="text-yellow-300">{"Developer"}</span>
            {";\n\n"}
            <span className="text-emerald-400 animate-[blink_1s_step-end_infinite]">{"▊"}</span>
          </pre>
        </div>
      </div>
    </div>
  );
}

export default function Hero() {
  const containerRef = useRef<HTMLElement>(null);
  const typed = useTypewriter(TITLES);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ delay: 0.15 });
      tl.fromTo(
        ".hero-label",
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.6, ease: "power3.out" },
      )
        .fromTo(
          ".hero-word",
          { opacity: 0, y: 60 },
          { opacity: 1, y: 0, duration: 0.6, stagger: 0.15, ease: "power3.out" },
          "-=0.3",
        )
        .fromTo(
          ".hero-subtitle",
          { opacity: 0, y: 20 },
          { opacity: 1, y: 0, duration: 0.5, ease: "power3.out" },
          "-=0.2",
        )
        .fromTo(
          ".hero-tagline",
          { opacity: 0, y: 25 },
          { opacity: 1, y: 0, duration: 0.6, ease: "power3.out" },
          "-=0.25",
        )
        .fromTo(
          ".hero-cta-item",
          { opacity: 0, y: 18 },
          { opacity: 1, y: 0, duration: 0.5, stagger: 0.1, ease: "power3.out" },
          "-=0.25",
        )
        .fromTo(
          ".hero-code",
          { opacity: 0, x: 30 },
          { opacity: 1, x: 0, duration: 0.8, ease: "power3.out" },
          "-=0.4",
        )
        .fromTo(
          ".hero-scroll",
          { opacity: 0 },
          { opacity: 1, duration: 0.6, ease: "power2.out" },
          "-=0.1",
        );
    }, containerRef);
    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={containerRef}
      className="min-h-screen flex flex-col items-center justify-center bg-background text-foreground relative overflow-hidden"
    >
      {/* Base gradient */}
      <div className="absolute inset-0 bg-linear-to-br from-[#030812] via-[#060d1f] to-[#070d22] pointer-events-none" />

      {/* CSS grid overlay */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: `
            linear-gradient(rgba(34,211,238,0.03) 1px, transparent 1px),
            linear-gradient(90deg, rgba(34,211,238,0.03) 1px, transparent 1px)
          `,
          backgroundSize: "72px 72px",
        }}
      />

      {/* Particle network canvas */}
      <HeroBackground />

      {/* Centre radial glow */}
      <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(ellipse_70%_60%_at_50%_50%,rgba(34,211,238,0.05),transparent)]" />

      {/* Ambient orbs */}
      <div
        className="absolute top-1/4 left-1/4 w-96 h-96 bg-cyan-500/6 rounded-full blur-3xl pointer-events-none animate-pulse"
        style={{ animationDuration: "6s" }}
      />
      <div
        className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-violet-500/6 rounded-full blur-3xl pointer-events-none animate-pulse"
        style={{ animationDuration: "8s", animationDelay: "2s" }}
      />

      {/* Scan line */}
      <div
        className="absolute inset-x-0 h-px pointer-events-none"
        style={{
          background:
            "linear-gradient(90deg, transparent, rgba(34,211,238,0.25), transparent)",
          animation: "scan 8s linear infinite",
          animationDelay: "1s",
        }}
      />

      {/* Vignette */}
      <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(ellipse_100%_100%_at_50%_50%,transparent_50%,rgba(3,8,18,0.7)_100%)]" />

      {/* ── Main content ── */}
      <div className="relative w-full max-w-6xl mx-auto px-6 py-24 flex items-center min-h-screen">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 w-full items-center">

          {/* Left: Text */}
          <div className="text-center lg:text-left">
            <p className="hero-label text-primary font-mono text-xs mb-5 tracking-[0.25em] uppercase">
              <span className="text-emerald-400">▸</span> whoami
            </p>

            <h1
              className="text-5xl sm:text-6xl xl:text-7xl font-bold mb-4 overflow-hidden animate-[glitch_7s_linear_infinite]"
              aria-label={siteConfig.name}
            >
              {siteConfig.name.split(" ").map((word, i) => (
                <span key={i} className="inline-block mr-[0.25em] last:mr-0">
                  <span className="hero-word inline-block bg-linear-to-r from-white via-slate-200 to-cyan-200 bg-clip-text text-transparent">
                    {word}
                  </span>
                </span>
              ))}
            </h1>

            {/* Typewriter subtitle */}
            <h2 className="hero-subtitle text-lg sm:text-xl text-muted-foreground mb-6 font-mono h-7 flex items-center lg:justify-start justify-center gap-0.5">
              <span className="text-primary/60 mr-1">$</span>
              <span className="text-slate-300">{typed}</span>
              <span className="inline-block w-0.5 h-5 bg-primary ml-0.5 animate-[blink_1s_step-end_infinite]" />
            </h2>

            <p className="hero-tagline text-muted-foreground text-base max-w-lg mx-auto lg:mx-0 mb-10 leading-relaxed">
              {siteConfig.tagline}
            </p>

            <div className="flex flex-col sm:flex-row gap-3 justify-center lg:justify-start">
              <a
                href="#projects"
                className="hero-cta-item px-6 py-2.5 bg-primary text-primary-foreground rounded font-mono text-sm font-medium hover:bg-primary/90 transition-colors"
              >
                ./view-work
              </a>
              <a
                href="#contact"
                className="hero-cta-item px-6 py-2.5 border border-border text-muted-foreground rounded font-mono text-sm font-medium hover:border-primary/50 hover:text-foreground transition-colors"
              >
                ./get-in-touch
              </a>
            </div>
          </div>

          {/* Right: Code block */}
          <div className="hero-code hidden lg:flex items-center justify-center">
            <CodeBlock />
          </div>

        </div>
      </div>

      {/* Scroll indicator */}
      <div className="hero-scroll absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-muted-foreground">
        <span className="text-[10px] font-mono tracking-[0.2em] uppercase text-muted-foreground/60">
          scroll
        </span>
        <div className="w-px h-10 bg-linear-to-b from-border to-transparent" />
      </div>
    </section>
  );
}
