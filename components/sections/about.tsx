"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { siteConfig } from "@/data/portfolio";
import { AnimateIn, StaggerIn } from "@/components/ui/animate-in";

function CountUp({ num, suffix }: { num: number; suffix: string }) {
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    const el = ref.current;
    if (!el) return;

    const proxy = { val: 0 };
    const ctx = gsap.context(() => {
      gsap.to(proxy, {
        val: num,
        duration: 2,
        ease: "power2.out",
        scrollTrigger: { trigger: el, start: "top 90%", once: true },
        onUpdate() {
          if (el) el.textContent = `${Math.round(proxy.val)}${suffix}`;
        },
      });
    });

    return () => ctx.revert();
  }, [num, suffix]);

  return <span ref={ref}>0{suffix}</span>;
}

function StatCard({ label, value }: { label: string; value: string }) {
  const match = value.match(/^(\d+)(.*)$/);
  const num = match ? parseInt(match[1]) : 0;
  const suffix = match ? match[2] : value;

  return (
    <div className="bg-slate-900 rounded-xl p-6 border border-slate-700 hover:border-blue-500/40 hover:shadow-[0_4px_24px_rgba(59,130,246,0.1)] transition-all duration-300 group">
      <div className="text-3xl font-bold text-blue-400 mb-1 group-hover:text-blue-300 transition-colors duration-300">
        <CountUp num={num} suffix={suffix} />
      </div>
      <div className="text-sm text-slate-400">{label}</div>
    </div>
  );
}

export default function About() {
  return (
    <section id="about" className="py-24 px-6 bg-slate-800">
      <div className="max-w-5xl mx-auto">
        <AnimateIn>
          <p className="text-blue-400 font-mono text-sm tracking-widest uppercase">
            About
          </p>
        </AnimateIn>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center mt-10">
          <div>
            <AnimateIn delay={0.05}>
              <h2 className="text-3xl sm:text-4xl font-bold text-white mb-6">
                Passionate about building things that matter.
              </h2>
            </AnimateIn>

            <StaggerIn className="space-y-4" stagger={0.15} delay={0.1}>
              {siteConfig.bio.map((paragraph, i) => (
                <p key={i} className="text-slate-400 leading-relaxed">
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
                  className="text-slate-400 hover:text-white hover:scale-110 transition-all duration-200"
                  aria-label="GitHub"
                >
                  <GitHubIcon />
                </a>
                <a
                  href={siteConfig.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-slate-400 hover:text-white hover:scale-110 transition-all duration-200"
                  aria-label="LinkedIn"
                >
                  <LinkedInIcon />
                </a>
              </div>
            </AnimateIn>
          </div>

          <StaggerIn className="grid grid-cols-2 gap-6" stagger={0.1}>
            {stats.map(({ label, value }) => (
              <StatCard key={label} label={label} value={value} />
            ))}
          </StaggerIn>
        </div>
      </div>
    </section>
  );
}

const stats = [
  { label: "Years Experience", value: "3+" },
  { label: "Projects Completed", value: "20+" },
  { label: "Technologies", value: "15+" },
  { label: "Happy Clients", value: "10+" },
];

function GitHubIcon() {
  return (
    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
      <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
    </svg>
  );
}

function LinkedInIcon() {
  return (
    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
    </svg>
  );
}
