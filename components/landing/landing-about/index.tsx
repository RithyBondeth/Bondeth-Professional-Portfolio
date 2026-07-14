"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import { siteConfig } from "@/utils/constants/portfolio.constant";
import { AnimateIn, StaggerIn } from "@/components/utils/animations/animate-in";
import { Parallax } from "@/components/utils/animations/parallax";
import { SplitReveal } from "@/components/utils/animations/split-reveal";
import { ScrambleText } from "@/components/utils/animations/scramble-text";
import { TiltCard } from "@/components/utils/animations/tilt-card";
import { Magnetic } from "@/components/utils/animations/magnetic";
import { GitHubIcon, LinkedInIcon } from "@/components/utils/icons";
import { getDictionary, type TLocale } from "@/utils/i18n";
import { getSiteConfig } from "@/utils/i18n/content";

/* --------------------------------- Portrait -------------------------------- */
/**
 * The portrait is a transparent PNG (background already cut out), so we render a
 * full code editor BEHIND it — two "files" filling the panel left and right. The
 * person sits in front, hiding the code directly behind him while the snippets
 * stay visible around his silhouette. Editor colours are intentionally FIXED
 * (not theme tokens) so it reads as a deliberate dark-editor screenshot.
 */
const LEFT_CODE = `const fs = require('fs');
const path = require('path');
const readline = require('readline');

function log(msg) {
  const time = new Date().toISOString();
  console.log(\`[\${time}] \${msg}\`);
}

function loadConfig(filePath) {
  try {
    const data = fs.readFileSync(filePath, 'utf8');
    return JSON.parse(data);
  } catch (err) {
    log('Failed to load config: ' + err.message);
    return {};
  }
}

function start() {
  log('Application started');
  const config = loadConfig(path.join(__dirname));
  log('Config loaded: ' + JSON.stringify(config));
}

start();

// Watch for changes
fs.watch('.', (eventType, filename) => {
  if (filename) {
    log(\`File changed: \${filename}\`);
  }
});`;

const RIGHT_CODE = `class UserService {
  constructor(db) {
    this.db = db;
  }

  async getUser(id) {
    const res = await this.db.query(
      'SELECT * FROM users WHERE id = $1',
      [id]
    );
    return res.rows[0];
  }
}

module.exports = UserService;

app.get('/api/user/:id', async (req, res) => {
  try {
    const user = await userService.getUser(req.params.id);
    if (!user) return res.status(404).json({ error: 'Not found' });
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <title>Developer Dashboard</title>
  </head>
  <body>
    <div class="container">
      <h1>Welcome, Developer</h1>
    </div>
  </body>
</html>`;

const KEYWORDS = new Set([
  "import",
  "from",
  "export",
  "default",
  "const",
  "let",
  "var",
  "function",
  "return",
  "async",
  "await",
  "if",
  "else",
  "for",
  "while",
  "break",
  "new",
  "class",
  "constructor",
  "throw",
  "true",
  "false",
  "null",
  "this",
  "require",
  "try",
  "catch",
]);

// Lightweight tokeniser — good enough for a decorative code backdrop.
function tokenize(line: string) {
  const re =
    /(\/\/.*$)|('[^']*'|"[^"]*"|`[^`]*`)|\b(\d+)\b|([A-Za-z_$][\w$]*)|(\s+)|([^\s\w])/g;
  const out: { text: string; cls: string }[] = [];
  let m: RegExpExecArray | null;
  while ((m = re.exec(line))) {
    if (m[1])
      out.push({ text: m[1], cls: "text-slate-500" }); // comment
    else if (m[2])
      out.push({ text: m[2], cls: "text-emerald-400" }); // string
    else if (m[3])
      out.push({ text: m[3], cls: "text-amber-300" }); // number
    else if (m[4])
      out.push({
        text: m[4],
        cls: KEYWORDS.has(m[4]) ? "text-violet-400" : "text-sky-300",
      });
    else out.push({ text: m[0], cls: "text-slate-400" }); // whitespace / punctuation
  }
  return out;
}

// Reveal `total` characters over time, as if the code is being typed. Honors
// prefers-reduced-motion (shows everything at once) and resets when inactive so
// the animation replays each time the panel re-enters view.
function useTypewriter(total: number, cps: number, active: boolean, delay = 0) {
  const [typed, setTyped] = useState(0);
  useEffect(() => {
    if (!active) {
      setTyped(0);
      return;
    }
    const reduce =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) {
      setTyped(total);
      return;
    }
    let raf = 0;
    let startTime = 0;
    const tick = (now: number) => {
      if (!startTime) startTime = now;
      const elapsed = (now - startTime) / 1000 - delay;
      const c = elapsed <= 0 ? 0 : Math.min(Math.floor(elapsed * cps), total);
      setTyped(c);
      if (c < total) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [total, cps, active, delay]);
  return typed;
}

function CodeColumn(props: {
  code: string;
  className: string;
  active: boolean;
  cps?: number;
  delay?: number;
}) {
  const { code, className, active, cps = 55, delay = 0 } = props;

  // Pre-tokenise each line and record its character offset in the full source
  // so we can map the running "typed" count onto a prefix of the code.
  const lines = useMemo(() => {
    let acc = 0;
    return code.split("\n").map((raw) => {
      const offset = acc;
      acc += raw.length + 1; // + newline
      return { tokens: tokenize(raw), len: raw.length, offset };
    });
  }, [code]);

  const total = code.length;
  const typed = useTypewriter(total, cps, active, delay);
  const done = typed >= total;

  return (
    <pre
      aria-hidden
      className={`absolute overflow-hidden font-code text-[10px] sm:text-[11px] leading-[1.55] select-none pointer-events-none ${className}`}
    >
      {lines.map((line, i) => {
        const avail = typed - line.offset;
        // Line not reached yet — skip so the block grows as it types.
        if (!done && avail <= 0) return null;

        const vis = done ? line.len : Math.min(avail, line.len);
        const caretHere = done
          ? i === lines.length - 1
          : avail > 0 && avail <= line.len;

        let budget = vis;
        return (
          <div key={i} className="flex gap-3">
            <span className="w-4 shrink-0 text-right text-slate-600 tabular-nums">
              {i + 1}
            </span>
            <code className="whitespace-pre">
              {line.tokens.map((tok, j) => {
                if (budget <= 0) return null;
                const text = tok.text.slice(0, budget);
                budget -= text.length;
                return (
                  <span key={j} className={tok.cls}>
                    {text}
                  </span>
                );
              })}
              {caretHere && (
                <span className="type-caret ml-px inline-block h-[1.05em] w-[0.5em] translate-y-[0.15em] bg-cyan-300/80" />
              )}
            </code>
          </div>
        );
      })}
    </pre>
  );
}

function PortraitPanel(props: { alt: string }) {
  // Kick off (and replay) the typing animation whenever the panel is on screen.
  const ref = useRef<HTMLElement>(null);
  const [active, setActive] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(([e]) => setActive(e.isIntersecting), {
      threshold: 0.2,
    });
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  return (
    <figure
      ref={ref}
      className="relative w-full max-w-sm mx-auto lg:max-w-none"
    >
      {/* Ambient Glow */}
      <div className="absolute -inset-6 bg-cyan-500/6 rounded-2xl blur-3xl pointer-events-none" />

      {/* 3D tilt shell — relative + matching rounding so the glare sheen clips
          to the editor window's corners. Desktop-only, reduced-motion safe. */}
      <TiltCard maxTilt={5} hoverScale={1.01} className="relative rounded-md">
        {/* Editor Window */}
        <div className="relative rounded-md border border-[#1a2e52] bg-[#0c1428] overflow-hidden shadow-2xl shadow-black/30 dark:shadow-black/60">
          {/* Window Chrome */}
          <div className="flex items-center gap-1.5 px-4 py-3 border-b border-[#1a2e52]/60 bg-black/30">
            <span aria-hidden className="w-3 h-3 rounded-full bg-red-500/80" />
            <span aria-hidden className="w-3 h-3 rounded-full bg-yellow-500/70" />
            <span aria-hidden className="w-3 h-3 rounded-full bg-green-500/70" />
            <span className="ml-3 text-slate-500 text-[11px] font-code select-none">
              bondeth.png
            </span>
          </div>

          {/* Code editor behind + person in front. The person is a transparent
              cut-out, so the code shows around him and is hidden behind him. */}
          <div className="relative">
            <CodeColumn
              code={LEFT_CODE}
              className="top-4 bottom-4 left-4 w-[47%]"
              active={active}
              cps={58}
            />
            <CodeColumn
              code={RIGHT_CODE}
              className="top-4 bottom-4 right-4 w-[47%]"
              active={active}
              cps={52}
              delay={0.4}
            />

            {/* Person — a little padding so he doesn't touch the edges */}
            <div className="relative mx-auto w-[86%] pt-6">
              <Image
                src="/bondeth.webp"
                alt={props.alt}
                width={819}
                height={1157}
                sizes="(min-width: 1024px) 340px, (min-width: 768px) 40vw, 86vw"
                className="w-full h-auto block select-none"
              />
            </div>
          </div>

          {/* Status Bar */}
          <div className="flex items-center justify-between px-4 py-2.5 border-t border-[#1a2e52]/60 bg-black/30 text-[10px] font-code text-slate-400">
            <span>
              <span className="text-emerald-400">▸</span> whoami
            </span>
            <span>Phnom Penh, KH</span>
          </div>
        </div>
      </TiltCard>

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
    // Reset to zero whenever the stats leave view so the count replays from
    // scratch the next time they scroll back in.
    if (!started) {
      setCount(0);
      return;
    }
    let raf = 0;
    const startTime = performance.now();
    const tick = (now: number) => {
      const p = Math.min((now - startTime) / duration, 1);
      setCount(Math.round((1 - Math.pow(1 - p, 3)) * target));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
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
  const statsRef = useRef<HTMLDivElement>(null);

  /* --------------------------------- Effects -------------------------------- */
  useEffect(() => {
    // Watch the stats strip itself (not the whole section) so the numbers only
    // start counting once they're actually on screen — otherwise they'd finish
    // while still far below the fold. Toggling `started` replays the count each
    // time the strip re-enters view.
    const obs = new IntersectionObserver(
      ([e]) => setStarted(e.isIntersecting),
      { threshold: 0.35 },
    );
    if (statsRef.current) obs.observe(statsRef.current);
    return () => obs.disconnect();
  }, []);

  /* -------------------------------- Render UI ------------------------------- */
  return (
    <section id="about" className="py-24 px-6 bg-card">
      <div className="max-w-6xl mx-auto">
        <AnimateIn from="zoom-in">
          <p className="text-primary font-mono text-xs tracking-[0.25em] uppercase mb-1">
            <ScrambleText text="// about.tsx" />
          </p>
        </AnimateIn>

        {/* Portrait + Bio Row */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-center mt-10">
          {/* Portrait Section — leads on mobile as a human hook */}
          <AnimateIn
            from="left"
            distance={70}
            blur={6}
            delay={0.15}
            className="lg:col-span-5"
          >
            <Parallax speed={60}>
              <PortraitPanel alt={dict.about.portraitAlt} />
            </Parallax>
          </AnimateIn>

          {/* Bio Section */}
          <div className="lg:col-span-7">
            {/* Masked line-by-line reveal — lines only: heading copy is
                localized and Khmer must never be split mid-cluster. */}
            <SplitReveal
              as="h2"
              type="lines"
              className="text-4xl sm:text-5xl font-bold text-foreground mb-6 leading-snug"
            >
              {dict.about.heading}
            </SplitReveal>

            <StaggerIn from="right" distance={40} stagger={0.18} blur={4} delay={0.1}>
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
                <Magnetic strength={0.4} className="inline-block">
                  <a
                    href={siteConfig.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-block p-1 text-muted-foreground hover:text-primary transition-colors"
                    aria-label="GitHub"
                  >
                    <GitHubIcon className="w-5 h-5" />
                  </a>
                </Magnetic>
                <Magnetic strength={0.4} className="inline-block">
                  <a
                    href={siteConfig.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-block p-1 text-muted-foreground hover:text-primary transition-colors"
                    aria-label="LinkedIn"
                  >
                    <LinkedInIcon className="w-5 h-5" />
                  </a>
                </Magnetic>
              </div>
            </AnimateIn>
          </div>
        </div>

        {/* Stats Section — full-width strip; counts up when the strip enters view */}
        <div ref={statsRef}>
          <StaggerIn
            from="zoom-in"
            className="grid grid-cols-2 lg:grid-cols-4 gap-4 mt-12"
            stagger={0.1}
            staggerFrom="center"
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
      </div>
    </section>
  );
}
