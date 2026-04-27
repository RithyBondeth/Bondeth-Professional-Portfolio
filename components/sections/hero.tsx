"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { siteConfig } from "@/data/portfolio";

export default function Hero() {
  const containerRef = useRef<HTMLElement>(null);

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
          { opacity: 0, y: 25 },
          { opacity: 1, y: 0, duration: 0.6, ease: "power3.out" },
          "-=0.25"
        )
        .fromTo(
          ".hero-tagline",
          { opacity: 0, y: 25 },
          { opacity: 1, y: 0, duration: 0.6, ease: "power3.out" },
          "-=0.35"
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
      <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-slate-900 to-blue-950 pointer-events-none" />
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-indigo-600/10 rounded-full blur-3xl pointer-events-none" />

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

        <h2 className="hero-subtitle text-xl sm:text-2xl text-slate-400 mb-6 font-light">
          {siteConfig.title}
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
