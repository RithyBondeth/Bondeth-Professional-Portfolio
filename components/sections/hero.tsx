"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { siteConfig } from "@/data/portfolio";
import { HeroBackground } from "@/components/ui/hero-background";

const TITLES = [
  "Full Stack Developer",
  "AI Engineer",
  "Mobile App Developer",
];

function useTypewriter(phrases: string[], startDelay = 1200) {
  const [displayed, setDisplayed] = useState("");
  const [phraseIdx, setPhraseIdx] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);
  const [started, setStarted] = useState(false);

  // Honour the start delay so typing begins after the GSAP intro
  useEffect(() => {
    const id = setTimeout(() => setStarted(true), startDelay);
    return () => clearTimeout(id);
  }, [startDelay]);

  useEffect(() => {
    if (!started) return;

    const full = phrases[phraseIdx];

    // Determine next delay
    let wait: number;
    if (isDeleting) {
      wait = 35;                        // fast erase
    } else if (displayed.length === full.length) {
      wait = 2200;                      // pause before erasing
    } else {
      wait = 75;                        // typing speed
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

export default function Hero() {
  const containerRef = useRef<HTMLElement>(null);
  const typed = useTypewriter(TITLES);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ delay: 0.15 });

      tl.fromTo(
        ".hero-label",
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.6, ease: "power3.out" }
      )
        .fromTo(
          ".hero-word",
          { opacity: 0, y: 60 },
          { opacity: 1, y: 0, duration: 0.6, stagger: 0.15, ease: "power3.out" },
          "-=0.3"
        )
        .fromTo(
          ".hero-subtitle",
          { opacity: 0, y: 20 },
          { opacity: 1, y: 0, duration: 0.5, ease: "power3.out" },
          "-=0.2"
        )
        .fromTo(
          ".hero-tagline",
          { opacity: 0, y: 25 },
          { opacity: 1, y: 0, duration: 0.6, ease: "power3.out" },
          "-=0.25"
        )
        .fromTo(
          ".hero-cta-item",
          { opacity: 0, y: 18 },
          { opacity: 1, y: 0, duration: 0.5, stagger: 0.1, ease: "power3.out" },
          "-=0.25"
        )
        .fromTo(
          ".hero-scroll",
          { opacity: 0 },
          { opacity: 1, duration: 0.6, ease: "power2.out" },
          "-=0.1"
        );
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={containerRef}
      className="min-h-screen flex flex-col items-center justify-center bg-slate-900 text-white px-6 relative overflow-hidden"
    >
      {/* Base gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-950 via-slate-900 to-blue-950 pointer-events-none" />

      {/* CSS grid overlay */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: `
            linear-gradient(rgba(96,165,250,0.04) 1px, transparent 1px),
            linear-gradient(90deg, rgba(96,165,250,0.04) 1px, transparent 1px)
          `,
          backgroundSize: "72px 72px",
        }}
      />

      {/* Particle network canvas */}
      <HeroBackground />

      {/* Centre radial glow */}
      <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(ellipse_70%_60%_at_50%_50%,rgba(59,130,246,0.07),transparent)]" />

      {/* Ambient orbs */}
      <div className="absolute top-1/4 left-1/4 w-[28rem] h-[28rem] bg-blue-600/10 rounded-full blur-3xl pointer-events-none animate-pulse" style={{ animationDuration: "6s" }} />
      <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none animate-pulse" style={{ animationDuration: "8s", animationDelay: "2s" }} />

      {/* Scan line */}
      <div
        className="absolute inset-x-0 h-px pointer-events-none"
        style={{
          background: "linear-gradient(90deg, transparent, rgba(96,165,250,0.3), transparent)",
          animation: "scan 8s linear infinite",
          animationDelay: "1s",
        }}
      />

      {/* Vignette */}
      <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(ellipse_100%_100%_at_50%_50%,transparent_50%,rgba(2,6,23,0.6)_100%)]" />

      <div className="relative max-w-3xl text-center">
        <p className="hero-label text-blue-400 font-mono text-sm mb-6 tracking-widest uppercase">
          Hello, I&apos;m
        </p>

        <h1
          className="text-5xl sm:text-7xl font-bold mb-4 overflow-hidden"
          aria-label={siteConfig.name}
        >
          {siteConfig.name.split(" ").map((word, i) => (
            <span key={i} className="inline-block mr-[0.25em] last:mr-0">
              <span className="hero-word inline-block bg-gradient-to-r from-white to-slate-400 bg-clip-text text-transparent">
                {word}
              </span>
            </span>
          ))}
        </h1>

        {/* Typewriter subtitle */}
        <h2 className="hero-subtitle text-xl sm:text-2xl text-slate-300 mb-6 font-light h-8 flex items-center justify-center gap-0.5">
          <span>{typed}</span>
          {/* Blinking cursor */}
          <span className="inline-block w-0.5 h-6 bg-blue-400 ml-0.5 animate-[blink_1s_step-end_infinite]" />
        </h2>

        <p className="hero-tagline text-slate-400 text-lg max-w-xl mx-auto mb-10 leading-relaxed">
          {siteConfig.tagline}
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <a
            href="#projects"
            className="hero-cta-item px-8 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-500 transition-colors"
          >
            View My Work
          </a>
          <a
            href="#contact"
            className="hero-cta-item px-8 py-3 border border-slate-600 text-slate-300 rounded-lg font-medium hover:border-slate-400 hover:text-white transition-colors"
          >
            Get In Touch
          </a>
        </div>

        <div className="hero-scroll absolute bottom-[-120px] left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-slate-600">
          <span className="text-xs font-mono tracking-widest uppercase">
            Scroll
          </span>
          <div className="w-px h-12 bg-gradient-to-b from-slate-600 to-transparent" />
        </div>
      </div>
    </section>
  );
}
