"use client";

import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import { gsap, SplitText } from "@/components/utils/animations/gsap";
import { Magnetic } from "@/components/utils/animations/magnetic";
import { TiltCard } from "@/components/utils/animations/tilt-card";
import { scrollToSection } from "@/components/utils/animations/smooth-scroll";
import { siteConfig } from "@/utils/constants/portfolio.constant";
import { SectionBackdrop } from "@/components/utils/animations/section-backdrop";
import { getDictionary, type TLocale } from "@/utils/i18n";
import { getSiteConfig } from "@/utils/i18n/content";

/* ---------------------------------- Hooks ---------------------------------- */
/** Live subscription to the user's reduced-motion preference (false on SSR). */
function useReducedMotion() {
  return useSyncExternalStore(
    (onChange) => {
      const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
      mq.addEventListener("change", onChange);
      return () => mq.removeEventListener("change", onChange);
    },
    () => window.matchMedia("(prefers-reduced-motion: reduce)").matches,
    () => false,
  );
}

function useTypewriter(phrases: string[], startDelay = 1200) {
  const [displayed, setDisplayed] = useState("");
  const [phraseIdx, setPhraseIdx] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);
  const [started, setStarted] = useState(false);
  // Reduced motion: show the first title in full, never cycle.
  const reduced = useReducedMotion();

  useEffect(() => {
    if (reduced) return;
    const id = setTimeout(() => setStarted(true), startDelay);
    return () => clearTimeout(id);
  }, [startDelay, reduced]);

  useEffect(() => {
    if (!started || reduced) return;
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
  }, [displayed, isDeleting, phraseIdx, phrases, started, reduced]);

  return reduced ? phrases[0] : displayed;
}

/* --------------------------------- Utilities -------------------------------- */
function CodeBlock() {
  return (
    <div className="group relative w-full max-w-sm xl:max-w-md">
      {/* Ambient Glow Section — swells and brightens while hovered, so the
          window feels lit from behind rather than just tilting.
          The tint comes from opacity, NOT a bg-primary/6 → /12 swap, and the
          transition is scoped to opacity+scale: `transition-all` would also
          animate background-color, which is derived from --primary and flips
          on a theme switch — leaving this glow fading for 500ms after the
          rest of the page had already snapped through the view transition. */}
      <div className="absolute -inset-6 bg-primary rounded-2xl blur-3xl pointer-events-none opacity-[0.06] transition-[opacity,scale] duration-500 group-hover:opacity-[0.12] motion-safe:group-hover:scale-105" />

      {/* 3D tilt shell — the same pointer-tracking lean + specular glare the
          About panel's editor uses, so both windows react identically.
          Desktop pointers only, disabled under reduced motion. */}
      <TiltCard maxTilt={6} hoverScale={1.015} className="relative rounded-md">
        {/* Editor Window Section — stays dark in both themes, like a real editor */}
        <div className="relative rounded-md border border-[#34322e] bg-black overflow-hidden shadow-2xl shadow-black/30 dark:shadow-black/60 transition-colors duration-500 group-hover:border-[#4a4740]">
          {/* Window Chrome Section — the traffic lights pick up a soft bloom on
              hover, the one place colour is allowed in this monochrome theme. */}
          <div className="flex items-center gap-1.5 px-4 py-3 border-b border-[#34322e]/60 bg-black/30">
            <span className="w-3 h-3 rounded-full bg-red-500/80 transition-shadow duration-300 group-hover:shadow-[0_0_8px_rgb(239_68_68/0.7)]" />
            <span className="w-3 h-3 rounded-full bg-yellow-500/70 transition-shadow duration-300 group-hover:shadow-[0_0_8px_rgb(234_179_8/0.7)]" />
            <span className="w-3 h-3 rounded-full bg-green-500/70 transition-shadow duration-300 group-hover:shadow-[0_0_8px_rgb(34_197_94/0.7)]" />
            <span className="ml-3 text-slate-500 text-[11px] font-code select-none transition-colors duration-300 group-hover:text-slate-300">
              profile.ts
            </span>
          </div>

          {/* Line Numbers + Code Section — the type steps down a notch on
              phones so the widest line (`location`) clears 375px without
              needing a horizontal scroll, and the tighter leading keeps the
              whole window from dominating the stacked mobile hero. */}
          <div className="flex text-[10px] min-[360px]:text-[11px] sm:text-xs font-code leading-[1.75] sm:leading-6 overflow-x-auto">
            {/* Line Numbers — brighten slightly so the gutter reads on hover */}
            <div className="select-none text-right pr-3 pl-3 sm:pr-4 sm:pl-4 py-4 sm:py-5 text-[#34322e] border-r border-[#34322e]/40 shrink-0 transition-colors duration-500 group-hover:text-[#4a4740]">
              {Array.from({ length: 18 }, (_, i) => (
                <div key={i}>{i + 1}</div>
              ))}
            </div>

            {/* Code Content — syntax colors match the site's canonical code
                palette (see landing-about's tokenizer): violet-400 keywords,
                sky-300 identifiers, emerald-400 strings, slate-500 comments. */}
            <pre className="py-4 sm:py-5 pl-3 sm:pl-4 pr-2 min-[360px]:pr-4 sm:pr-6 text-slate-400">
              <span className="text-slate-500">{"// Developer profile"}</span>
              {"\n"}
              <span className="text-violet-400">{"const"}</span>{" "}
              <span className="text-sky-300">{"developer"}</span>
              {" = {\n"}
              {"  "}
              <span className="text-sky-300">{"name"}</span>
              {": "}
              <span className="text-emerald-400">{'"Hem RithyBondeth"'}</span>
              {",\n"}
              {"  "}
              <span className="text-sky-300">{"role"}</span>
              {": [\n"}
              {"    "}
              <span className="text-emerald-400">{'"Full Stack Dev"'}</span>
              {",\n"}
              {"    "}
              <span className="text-emerald-400">{'"AI Engineer"'}</span>
              {",\n"}
              {"  ],\n"}
              {"  "}
              <span className="text-sky-300">{"location"}</span>
              {": "}
              <span className="text-emerald-400">
                {'"Phnom Penh, Cambodia"'}
              </span>
              {",\n"}
              {"  "}
              <span className="text-sky-300">{"stack"}</span>
              {": [\n"}
              {"    "}
              <span className="text-emerald-400">{'"Next.js"'}</span>
              {", "}
              <span className="text-emerald-400">{'"Nuxt.js"'}</span>
              {",\n"}
              {"    "}
              <span className="text-emerald-400">{'"FastAPI"'}</span>
              {", "}
              <span className="text-emerald-400">{'"Nest.js"'}</span>
              {",\n"}
              {"    "}
              <span className="text-emerald-400">{'"MongoDB"'}</span>
              {", "}
              <span className="text-emerald-400">{'"Flutter"'}</span>
              {",\n"}
              {"  ],\n"}
              {"  "}
              <span className="text-sky-300">{"available"}</span>
              {": "}
              <span className="text-violet-400">{"true"}</span>
              {",\n"}
              {"} "}
              <span className="text-violet-400">{"satisfies"}</span>{" "}
              <span className="text-sky-300">{"Developer"}</span>
              {";\n\n"}
              <span className="text-emerald-400 animate-[blink_1s_step-end_infinite]">
                {"▊"}
              </span>
            </pre>
          </div>
        </div>
      </TiltCard>
    </div>
  );
}

/* --------------------------------- Boot intro ------------------------------- */
const BOOT_KEY = "rb-boot-done";
// Decorative terminal output — intentionally Latin, like every shell label on
// the site.
const BOOT_LINES = [
  "init portfolio --profile=bondeth",
  "load modules [gsap, next, tailwind]",
  "render ui --theme=dark",
  "ready ✓",
];

type TBootPhase = "deciding" | "playing" | "done";

export default function LandingHero(props: { lang: TLocale }) {
  /* ---------------------------------- Props --------------------------------- */
  const { lang } = props;
  const dict = getDictionary(lang);
  const localized = getSiteConfig(lang);

  /* ---------------------------------- Utils --------------------------------- */
  const containerRef = useRef<HTMLElement>(null);
  const bootRef = useRef<HTMLDivElement>(null);
  const nameRef = useRef<HTMLHeadingElement>(null);
  const typed = useTypewriter(dict.hero.titles);

  /* -------------------------------- All States ------------------------------- */
  const [boot, setBoot] = useState<TBootPhase>("deciding");

  /* --------------------------------- Effects -------------------------------- */
  // Decide once per mount whether the boot sequence runs: first visit of the
  // session only, never under reduced motion, never blocking repeat visits.
  // Deferred a tick so the decision isn't a synchronous setState in the
  // effect body (react-hooks/set-state-in-effect).
  //
  // Hidden tabs defer the decision entirely: browsers suspend rAF while a tab
  // is backgrounded, so GSAP timelines started there stall mid-flight and get
  // force-completed by the safety nets — the user returns to a static hero
  // with no intro at all. Waiting for visibility means the boot + entrance
  // play in full the moment the tab is actually seen.
  useEffect(() => {
    const decide = () => {
      const reduce = window.matchMedia(
        "(prefers-reduced-motion: reduce)",
      ).matches;
      const seen = window.sessionStorage.getItem(BOOT_KEY) === "1";
      setBoot(reduce || seen ? "done" : "playing");
    };

    const onVisible = () => {
      if (document.visibilityState !== "visible") return;
      document.removeEventListener("visibilitychange", onVisible);
      decide();
    };

    const id = window.setTimeout(() => {
      if (document.visibilityState === "hidden") {
        document.addEventListener("visibilitychange", onVisible);
        return;
      }
      decide();
    }, 0);

    return () => {
      window.clearTimeout(id);
      document.removeEventListener("visibilitychange", onVisible);
    };
  }, []);

  // Boot sequence: type the lines, fill the bar, wipe the overlay up.
  // Click / keypress skips; a hard timeout guarantees it can never hang.
  useEffect(() => {
    if (boot !== "playing") return;
    const overlay = bootRef.current;
    if (!overlay) {
      setBoot("done");
      return;
    }

    let finished = false;
    const finish = () => {
      if (finished) return;
      finished = true;
      try {
        window.sessionStorage.setItem(BOOT_KEY, "1");
      } catch {
        /* storage may be unavailable — the intro just replays next time */
      }
      setBoot("done");
    };

    const q = gsap.utils.selector(overlay);
    const tl = gsap.timeline({ onComplete: finish });
    tl.to(q(".boot-line"), {
      opacity: 1,
      duration: 0.16,
      stagger: 0.15,
      ease: "none",
    })
      .to(
        q(".boot-bar-fill"),
        { scaleX: 1, duration: 0.4, ease: "power2.inOut" },
        "-=0.1",
      )
      .to(overlay, { yPercent: -100, duration: 0.5, ease: "smooth" }, "+=0.08");

    const skip = () => tl.progress(1);
    window.addEventListener("pointerdown", skip);
    window.addEventListener("keydown", skip);
    // Never block the page for more than ~1.8s, no matter what.
    const safety = window.setTimeout(() => {
      tl.kill();
      finish();
    }, 1800);

    return () => {
      window.removeEventListener("pointerdown", skip);
      window.removeEventListener("keydown", skip);
      window.clearTimeout(safety);
      tl.kill();
    };
  }, [boot]);

  // Entrance choreography + scroll exit — runs once the boot intro is done.
  useEffect(() => {
    if (boot !== "done") return;

    const revealSelectors = [
      ".hero-label",
      ".hero-char",
      ".hero-name",
      ".hero-subtitle",
      ".hero-tagline",
      ".hero-cta-item",
      ".hero-code",
      ".hero-scroll",
    ];

    // Exposed to the safety net below — must outlive the matchMedia closure.
    let entranceTl: gsap.core.Timeline | null = null;

    const mm = gsap.matchMedia(containerRef);
    mm.add("(prefers-reduced-motion: no-preference)", () => {
      // Split the name into chars — Latin text, safe to split. Each char gets
      // the .hero-char gradient (globals.css) and its own overflow mask.
      // Split words AND chars: char masks nest inside word wrappers, so the
      // name still wraps at word boundaries, never mid-word.
      const split = nameRef.current
        ? SplitText.create(nameRef.current, {
            type: "words,chars",
            mask: "chars",
            charsClass: "hero-char",
            aria: "auto",
          })
        : null;

      const tl = gsap.timeline({ delay: 0.1 });
      entranceTl = tl;
      tl.fromTo(
        ".hero-label",
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.6, ease: "smooth" },
      );
      if (split) {
        tl.from(
          split.chars,
          {
            yPercent: 120,
            rotate: 8,
            duration: 0.9,
            stagger: 0.035,
            ease: "smooth",
          },
          "-=0.35",
        );
      }
      tl.fromTo(
        ".hero-subtitle",
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.5, ease: "smooth" },
        "-=0.45",
      )
        .fromTo(
          ".hero-tagline",
          { opacity: 0, y: 25 },
          { opacity: 1, y: 0, duration: 0.6, ease: "smooth" },
          "-=0.3",
        )
        .fromTo(
          ".hero-cta-item",
          { opacity: 0, y: 18 },
          { opacity: 1, y: 0, duration: 0.5, stagger: 0.1, ease: "smooth" },
          "-=0.3",
        )
        .fromTo(
          ".hero-code",
          { opacity: 0, x: 30 },
          { opacity: 1, x: 0, duration: 0.8, ease: "smooth" },
          "-=0.45",
        )
        .fromTo(
          ".hero-scroll",
          { opacity: 0 },
          { opacity: 1, duration: 0.6, ease: "power2.out" },
          "-=0.1",
        );

      // Scroll exit: the two columns drift up and dim at different rates as
      // the hero scrolls away, so the page feels layered from the first wheel
      // tick. The scroll hint fades out immediately.
      // These MUST be fromTo with explicit start values + immediateRender:
      // false — a plain .to() scrub captures its start from the element's
      // CURRENT opacity on every ScrollTrigger refresh, and a refresh landing
      // mid-entrance (font/image load) would lock in the faded state and strand
      // the element invisible at scroll-top forever.
      const exits = [
        gsap.fromTo(
          ".hero-exit-text",
          { yPercent: 0, opacity: 1 },
          {
            yPercent: -14,
            opacity: 0.25,
            ease: "none",
            immediateRender: false,
            scrollTrigger: {
              trigger: containerRef.current,
              start: "top top",
              end: "bottom 35%",
              scrub: true,
            },
          },
        ),
        gsap.fromTo(
          ".hero-exit-code",
          { yPercent: 0, opacity: 1 },
          {
            yPercent: -7,
            opacity: 0.35,
            ease: "none",
            immediateRender: false,
            scrollTrigger: {
              trigger: containerRef.current,
              start: "top top",
              end: "bottom 35%",
              scrub: true,
            },
          },
        ),
        gsap.fromTo(
          ".hero-scroll",
          { opacity: 1 },
          {
            opacity: 0,
            ease: "none",
            immediateRender: false,
            scrollTrigger: {
              trigger: containerRef.current,
              start: "top top",
              end: "8% top",
              scrub: true,
            },
          },
        ),
      ];

      return () => {
        exits.forEach((t) => {
          t.scrollTrigger?.kill();
          t.kill();
        });
        tl.kill();
        split?.revert();
      };
    });
    mm.add("(prefers-reduced-motion: reduce)", () => {
      gsap.set(revealSelectors.join(","), { opacity: 1, y: 0, x: 0 });
    });

    // Safety net: above-the-fold content must never be stranded invisible
    // (e.g. a tab backgrounded mid-load pauses GSAP's rAF ticker indefinitely).
    // The stalled timeline is KILLED first — a merely-paused one would re-hide
    // everything on the next ticker tick, overriding the set below.
    const safety = window.setTimeout(() => {
      const root = containerRef.current;
      if (!root) return;
      if (entranceTl && entranceTl.progress() >= 1) return; // finished normally
      entranceTl?.kill();
      gsap.set(root.querySelectorAll(revealSelectors.join(",")), {
        opacity: 1,
        y: 0,
        x: 0,
        yPercent: 0,
        rotate: 0,
      });
    }, 6000);

    return () => {
      mm.revert();
      window.clearTimeout(safety);
    };
  }, [boot]);

  /* -------------------------------- Render UI ------------------------------- */
  return (
    <section
      ref={containerRef}
      className="min-h-screen flex flex-col items-center justify-center bg-background text-foreground relative isolate overflow-hidden"
    >
      {/* Section Backdrop — the same dot-matrix bloom every other section uses,
          so the hero shares one consistent background treatment. */}
      <SectionBackdrop />

      {/* Centre Radial Glow Section */}
      {/* Spaces inside a Tailwind arbitrary value break the class name, so the
          colour uses the space-free `rgb(255_255_255/0.05)` form. */}
      <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(ellipse_70%_60%_at_50%_50%,rgb(255_255_255/0.05),transparent)]" />

      {/* Ambient Orbs Section — parallax depth via ScrollSmoother data-speed,
          slow aurora drift on top of the pulse. */}
      <div
        data-speed="0.85"
        className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/6 rounded-full blur-3xl pointer-events-none motion-safe:animate-[aurora_16s_ease-in-out_infinite]"
      />
      <div
        data-speed="1.15"
        className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-violet-500/6 rounded-full blur-3xl pointer-events-none motion-safe:animate-[aurora_20s_ease-in-out_infinite]"
        style={{ animationDelay: "3s" }}
      />

      {/* Film grain — gives the flat navy a physical texture */}
      <div className="absolute inset-0 pointer-events-none bg-noise opacity-[0.03] dark:opacity-[0.05]" />

      {/* Scan Line Section — the sweep is a named class, not an inline
          `animation`, so the touch-device freeze in globals.css can switch it
          off without having to out-specify an inline style. */}
      <div
        className="hero-scanline absolute inset-x-0 h-px pointer-events-none"
        style={{
          background:
            "linear-gradient(90deg, transparent, rgba(255, 255, 255,0.25), transparent)",
        }}
      />

      {/* Vignette Section (dark mode only) */}
      <div className="absolute inset-0 pointer-events-none hidden dark:block bg-[radial-gradient(ellipse_100%_100%_at_50%_50%,transparent_50%,rgba(7,9,14,0.7)_100%)]" />

      {/* Main Content Section */}
      {/* `min-h-screen` is the floor, not the ceiling: once the code window
          stacks under the text on phones the hero is allowed to grow past one
          viewport rather than cramming both rows into it. */}
      <div className="relative w-full max-w-6xl mx-auto px-6 py-20 sm:py-24 flex items-center min-h-screen">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 sm:gap-12 lg:gap-16 w-full items-center">
          {/* Left: Text */}
          <div className="hero-exit-text text-center lg:text-left">
            <p className="hero-label text-primary font-mono text-xs mb-5 tracking-[0.25em] uppercase">
              <span className="text-emerald-400">▸</span> whoami
            </p>

            {/* Name — split into masked chars at runtime; the gradient lives on
                .hero-name (whole-text fallback) AND .hero-char (per-char) so it
                renders in every mode, including reduced motion and no-JS. */}
            <h1
              ref={nameRef}
              className="hero-name text-5xl sm:text-7xl xl:text-8xl font-bold tracking-tight leading-[0.95] mb-4 sm:mb-5 motion-safe:animate-[glitch_7s_linear_infinite]"
            >
              {siteConfig.name}
            </h1>

            {/* Typewriter Subtitle */}
            <h2 className="hero-subtitle text-lg sm:text-xl text-muted-foreground mb-6 font-mono h-7 flex items-center lg:justify-start justify-center gap-0.5">
              <span className="text-primary dark:text-primary/60 mr-1">$</span>
              <span className="text-slate-600 dark:text-slate-300">
                {typed}
              </span>
              <span className="inline-block w-0.5 h-5 bg-primary ml-0.5 animate-[blink_1s_step-end_infinite]" />
            </h2>

            <p className="hero-tagline text-muted-foreground text-base max-w-lg mx-auto lg:mx-0 mb-7 sm:mb-10 leading-relaxed">
              {localized.tagline}
            </p>

            <div className="flex flex-col sm:flex-row gap-3 justify-center lg:justify-start">
              <Magnetic strength={0.3} className="hero-cta-item">
                <a
                  href="#projects"
                  onClick={(e) => {
                    e.preventDefault();
                    scrollToSection("projects");
                  }}
                  className="btn-fx btn-fx-primary block px-6 py-2.5 bg-primary text-primary-foreground rounded font-mono text-sm font-medium text-center"
                >
                  {dict.hero.viewWork}
                </a>
              </Magnetic>
              <Magnetic strength={0.3} className="hero-cta-item">
                <a
                  href={siteConfig.resume}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-fx btn-fx-outline block px-6 py-2.5 border border-primary/20 text-primary rounded font-mono text-sm font-medium text-center"
                >
                  {dict.hero.downloadCv}
                </a>
              </Magnetic>
              <Magnetic strength={0.3} className="hero-cta-item">
                <a
                  href="#contact"
                  onClick={(e) => {
                    e.preventDefault();
                    scrollToSection("contact");
                  }}
                  className="btn-fx btn-fx-outline block px-6 py-2.5 border border-border text-muted-foreground rounded font-mono text-sm font-medium hover:text-foreground text-center"
                >
                  {dict.hero.getInTouch}
                </a>
              </Magnetic>
            </div>
          </div>

          {/* Right: Code Block — shown at every width. Below `lg` it stacks
              under the text as the second grid row; the TiltCard inside is
              already inert on coarse pointers, so it costs nothing on touch. */}
          <div className="hero-code hero-exit-code flex items-center justify-center">
            <CodeBlock />
          </div>
        </div>
      </div>

      {/* Scroll Indicator Section */}
      <div className="hero-scroll absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-muted-foreground">
        <span className="text-[10px] font-mono tracking-[0.2em] uppercase text-muted-foreground dark:text-muted-foreground/60">
          {dict.hero.scroll}
        </span>
        <div className="w-px h-10 bg-linear-to-b from-border to-transparent" />
      </div>

      {/* Boot intro overlay — first session visit only, skippable, wiped away
          by its own timeline. Sits above hero content but below the fixed nav. */}
      {boot === "playing" && (
        <div
          ref={bootRef}
          role="presentation"
          className="absolute inset-0 z-40 bg-background flex items-center justify-center px-6"
        >
          <div className="w-full max-w-md font-code text-xs sm:text-sm text-muted-foreground space-y-2">
            {BOOT_LINES.map((line, i) => (
              <div key={i} className="boot-line flex gap-2 opacity-0">
                <span className="text-primary">$</span>
                <span
                  className={
                    i === BOOT_LINES.length - 1 ? "text-emerald-400" : undefined
                  }
                >
                  {line}
                </span>
              </div>
            ))}
            <div className="mt-5 h-px w-full bg-border overflow-hidden">
              <div className="boot-bar-fill h-full w-full bg-primary origin-left scale-x-0" />
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
