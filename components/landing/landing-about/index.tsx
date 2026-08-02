"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import { siteConfig } from "@/utils/constants/portfolio.constant";
import { AnimateIn, StaggerIn } from "@/components/utils/animations/animate-in";
import { Parallax } from "@/components/utils/animations/parallax";
import { SplitReveal } from "@/components/utils/animations/split-reveal";
import { ScrambleText } from "@/components/utils/animations/scramble-text";
import { TiltCard } from "@/components/utils/animations/tilt-card";
import { Magnetic } from "@/components/utils/animations/magnetic";
import {
  useAnimationFrameValue,
  useCountUp,
  useReducedMotion,
} from "@/components/utils/animations/use-motion";
import {
  GitHubIcon,
  LinkedInIcon,
  FacebookIcon,
  InstagramIcon,
} from "@/components/utils/icons";
import { getDictionary, type TLocale } from "@/utils/i18n";
import { getSiteConfig } from "@/utils/i18n/content";

/* --------------------------------- Portrait -------------------------------- */
/**
 * The two halves of ONE source file, running down either side of the portrait.
 *
 * They used to be three unrelated snippets — a `fs.readFileSync` config loader,
 * a generic `UserService`, and a raw `<!DOCTYPE html>` document — sharing a
 * panel labelled `bondeth.png`. Three languages, none of them his, none of them
 * related to each other.
 *
 * This is retrieval code: embed a query, score every chunk by cosine
 * similarity, keep the best few. It is the same thing the RAG lab on this site
 * does, so the backdrop is now his actual domain rather than tutorial
 * boilerplate. Lines stay under ~38 characters because the columns are ~47% of
 * a narrow panel and anything longer is clipped mid-word.
 */
const LEFT_CODE = `import { embed } from "@/lib/ai";
import { db } from "@/lib/db";

type Chunk = {
  id: string;
  text: string;
  vector: number[];
};

export async function search(
  q: string,
) {
  const query = await embed(q);
  const all = await db.chunk.all();

  return all
    .map(withScore(query))
    .sort(byScore)
    .slice(0, 5);
}`;

const RIGHT_CODE = `function cosine(
  a: number[],
  b: number[],
) {
  let dot = 0;
  let na = 0;
  let nb = 0;

  for (let i = 0; i < a.length; i++) {
    dot += a[i] * b[i];
    na += a[i] * a[i];
    nb += b[i] * b[i];
  }

  return dot / Math.sqrt(na * nb);
}

// Weak matches never reach the
// model's context window.
const MIN_SCORE = 0.72;`;

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
  // The backdrop is TypeScript now, so its type-level keywords count too.
  "type",
  "interface",
]);

interface IToken {
  text: string;
  cls: string;
}

// Lightweight tokeniser — good enough for a decorative code backdrop.
function tokenize(line: string): IToken[] {
  const re =
    /(\/\/.*$)|('[^']*'|"[^"]*"|`[^`]*`)|\b(\d+)\b|([A-Za-z_$][\w$]*)|(\s+)|([^\s\w])/g;
  const out: IToken[] = [];
  let m: RegExpExecArray | null;
  while ((m = re.exec(line))) {
    // `.tok-*` are the shared, theme-aware syntax classes from globals.css —
    // the literal Tailwind shades these used to emit were tuned for near-black
    // and sat at 2–3:1 once the window turned into a light surface.
    if (m[1])
      out.push({ text: m[1], cls: "tok-comment" });
    else if (m[2])
      out.push({ text: m[2], cls: "tok-string" });
    else if (m[3])
      out.push({ text: m[3], cls: "tok-number" });
    else if (m[4])
      out.push({
        text: m[4],
        cls: KEYWORDS.has(m[4]) ? "tok-keyword" : "tok-ident",
      });
    else out.push({ text: m[0], cls: "tok-punct" }); // whitespace / punctuation
  }
  return out;
}

// Reveal `total` characters over time, as if the code is being typed. Honors
// prefers-reduced-motion (shows everything at once) and resets when inactive so
// the animation replays each time the panel re-enters view.
function useTypewriter(total: number, cps: number, active: boolean, delay = 0) {
  const frame = useCallback(
    (elapsedMs: number) => {
      const elapsed = elapsedMs / 1000 - delay;
      const value = elapsed <= 0 ? 0 : Math.min(Math.floor(elapsed * cps), total);
      return { value, done: value >= total };
    },
    [total, cps, delay],
  );

  const reduce = useReducedMotion();
  const typed = useAnimationFrameValue(active && !reduce, frame);

  // Reduced motion: no typing pass, the code is simply there.
  if (reduce) return active ? total : 0;
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
    const out: { tokens: IToken[]; len: number; offset: number }[] = [];
    let offset = 0;
    for (const raw of code.split("\n")) {
      out.push({ tokens: tokenize(raw), len: raw.length, offset });
      offset += raw.length + 1; // + newline
    }
    return out;
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
          // No line-number gutter: this is one file split across two columns,
          // so a gutter per column put two "line 1"s side by side. Without them
          // the code reads as what it is here — texture behind a portrait,
          // not a file anyone is meant to follow.
          <div key={i}>
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
                <span className="type-caret ml-px inline-block h-[1.05em] w-[0.5em] translate-y-[0.15em] bg-primary/80" />
              )}
            </code>
          </div>
        );
      })}
    </pre>
  );
}

/**
 * The portrait is a transparent PNG (background already cut out), so a code
 * editor renders BEHIND it — one file split into two columns down either side.
 * The person sits in front, occluding the code directly behind him while the
 * rest stays visible around his silhouette. Editor colours come from the shared
 * `.editor-*` / `.tok-*` tokens in globals.css and follow the theme; they used
 * to be fixed dark literals, which left a black rectangle sitting on a light
 * page once the gradient-wave background landed.
 */
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
      {/* Ambient Glow — sky blue rather than --primary, which is near-black in
          light mode and put a grey smudge behind a white panel on a blue page. */}
      <div className="absolute -inset-6 bg-primary/15 dark:bg-primary/10 rounded-2xl blur-3xl pointer-events-none" />

      {/* 3D tilt shell — relative + matching rounding so the glare sheen clips
          to the editor window's corners. Desktop-only, reduced-motion safe. */}
      <TiltCard maxTilt={5} hoverScale={1.01} className="relative rounded-md">
        {/* Editor Window — shared `.editor-*` chrome (globals.css), the same
            surface the hero's profile.ts block uses, so the two windows stay in
            step and both follow the theme instead of staying black in it. */}
        <div className="editor-window relative rounded-md overflow-hidden">
          {/* Tab strip — matches the hero's panel. The metadata is the
              portrait's real intrinsic size, so the chrome describes the asset
              it is actually framing. */}
          <div className="editor-tabs text-[11px] font-code select-none">
            <span className="editor-tab">
              bondeth.png
              <span className="editor-chip">PNG</span>
            </span>
            <span className="editor-meta text-[10px]">819 × 1157</span>
          </div>

          {/* Code editor behind + person in front. The person is a transparent
              cut-out, so the code shows around him and is hidden behind him. */}
          <div className="relative">
            {/* The backdrop is masked away from where he stands. Before this the
                code ran straight into his face and shoulders, which read as a
                collision rather than a composition; fading it out around the
                silhouette turns the same two layers into depth. */}
            <div className="portrait-code-veil absolute inset-0">
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
            </div>

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
          <div className="editor-chrome tok-punct flex items-center justify-between px-4 py-2.5 border-t text-[10px] font-code">
            <span>
              <span className="tok-string">▸</span> whoami
            </span>
            <span>Phnom Penh, KH</span>
          </div>
        </div>
      </TiltCard>

      {/* Caption */}
      <figcaption className="mt-3 text-[11px] font-mono text-field-muted-foreground text-center lg:text-left">
        {"// full-stack + AI engineer"}
      </figcaption>
    </figure>
  );
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
    <div className="card-interactive group rounded border border-border/60 bg-background p-5">
      <p className="text-[10px] font-mono text-field-muted-foreground mb-3 group-hover:text-primary dark:group-hover:text-primary/60 transition-colors">
        <span className="tok-keyword">const</span>{" "}
        <span className="tok-ident">{varName}</span>
      </p>
      <div className="text-3xl font-bold text-primary mb-1 font-mono tabular-nums">
        {count}
        {suffix}
      </div>
      <div className="text-xs text-field-muted-foreground">{label}</div>
    </div>
  );
}

const stats = [
  { key: "yearsExp", value: "3+", varName: "yearsExp" },
  { key: "projects", value: "20+", varName: "projects" },
  { key: "techStack", value: "20+", varName: "techStack" },
  { key: "clients", value: "15+", varName: "clients" },
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
    <section id="about" className="relative isolate py-16 sm:py-20 lg:py-24 px-6">
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
              className="text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground mb-6 leading-snug"
            >
              {dict.about.heading}
            </SplitReveal>

            <StaggerIn
              from="right"
              distance={40}
              stagger={0.18}
              blur={4}
              delay={0.1}
            >
              {localized.bio.map((paragraph, i) => (
                <p
                  key={i}
                  className="text-field-muted-foreground leading-relaxed text-sm"
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
                    className="inline-block p-1 text-field-muted-foreground hover:text-primary transition-colors"
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
                    className="inline-block p-1 text-field-muted-foreground hover:text-primary transition-colors"
                    aria-label="LinkedIn"
                  >
                    <LinkedInIcon className="w-5 h-5" />
                  </a>
                </Magnetic>
                <Magnetic strength={0.4} className="inline-block">
                  <a
                    href={siteConfig.facebook}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-block p-1 text-field-muted-foreground hover:text-primary transition-colors"
                    aria-label="Facebook"
                  >
                    <FacebookIcon className="w-5 h-5" />
                  </a>
                </Magnetic>
                <Magnetic strength={0.4} className="inline-block">
                  <a
                    href={siteConfig.instagram}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-block p-1 text-field-muted-foreground hover:text-primary transition-colors"
                    aria-label="Instagram"
                  >
                    <InstagramIcon className="w-5 h-5" />
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
