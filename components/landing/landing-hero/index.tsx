"use client";

import { useReducedMotion } from "@/components/utils/animations/use-motion";
import { useEffect, useState, type CSSProperties } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowDown, ArrowUpRight, FileText, Mail, Play } from "lucide-react";
import { Magnetic } from "@/components/utils/animations/magnetic";
import { scrollToSection } from "@/components/utils/animations/smooth-scroll";
import { TiltCard } from "@/components/utils/animations/tilt-card";
import { getDictionary, type TLocale } from "@/utils/i18n";
import { getSiteConfig } from "@/utils/i18n/content";

function useRoleTypewriter(firstRole: string, secondRole: string) {
  const reducedMotion = useReducedMotion();
  const [text, setText] = useState("");
  const [roleIndex, setRoleIndex] = useState(0);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    if (reducedMotion) return;
    const roles = [firstRole, secondRole];
    const currentRole = roles[roleIndex];
    const delay = reducedMotion
      ? 0
      : deleting
        ? 42
        : text === currentRole
          ? 2400
          : text.length === 0
            ? 480
            : 78;

    const timeout = window.setTimeout(() => {
      if (!deleting && text === currentRole) {
        setDeleting(true);
        return;
      }
      if (deleting && text.length === 0) {
        setDeleting(false);
        setRoleIndex((index) => (index + 1) % roles.length);
        return;
      }
      setText(
        deleting
          ? currentRole.slice(0, Math.max(0, text.length - 1))
          : currentRole.slice(0, text.length + 1),
      );
    }, delay);

    return () => window.clearTimeout(timeout);
  }, [deleting, firstRole, roleIndex, secondRole, text, reducedMotion]);

  return reducedMotion ? firstRole : text;
}

/* ----------------------------- Portrait backdrop ---------------------------- */
/**
 * Kinetic type behind the cutout portrait. Rows drift in alternating
 * directions; the coral row is drawn twice — solid behind the portrait and as
 * an outline in front of it — so the type reads as wrapping around him rather
 * than sitting flat behind a sticker.
 *
 * Both layers render every row so their geometry is identical; the front layer
 * hides all but the coral row. Decorative, English in every locale.
 */
const PORTRAIT_ROWS = [
  { text: "Full Stack", tone: "outline", speed: 46 },
  { text: "Bondeth", tone: "ghost", speed: 54 },
  { text: "AI Engineer", tone: "outline-accent", speed: 40 },
  { text: "Bondeth", tone: "accent", speed: 34 },
  { text: "Web · Mobile · AI", tone: "outline", speed: 50 },
  { text: "Build · Ship", tone: "ghost", speed: 58 },
] as const;

function PortraitType({ layer }: { layer: "back" | "front" }) {
  return (
    <div aria-hidden lang="en" className="portrait-type" data-layer={layer}>
      {PORTRAIT_ROWS.map(({ text, tone, speed }, index) => (
        <div
          key={`${text}-${index}`}
          className="portrait-row"
          data-tone={tone}
          data-dir={index % 2 === 0 ? "left" : "right"}
          style={{ "--speed": `${speed}s`, "--row": index } as CSSProperties}
        >
          <div className="portrait-track">
            {Array.from({ length: 6 }, (_, copy) => (
              <span key={copy} className="portrait-word">
                {text}
              </span>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

export default function LandingHero({ lang }: { lang: TLocale }) {
  const dict = getDictionary(lang);
  const localized = getSiteConfig(lang);
  const typedRole = useRoleTypewriter(dict.hero.titles[0], dict.hero.titles[1]);
  const proofPoints =
    lang === "km"
      ? [
          ["០៦", "តួនាទីការងារ"],
          ["១៦", "គម្រោងដែលបានជ្រើសរើស"],
          ["Web · Mobile · AI", "វិស័យជំនាញ"],
        ]
      : [
          ["06", "roles across teams"],
          ["16", "selected projects"],
          ["Web · Mobile · AI", "product range"],
        ];

  return (
    <section
      className="relative isolate flex min-h-screen items-center overflow-hidden px-6 py-28 text-foreground"
    >
      <div className="relative mx-auto grid w-full max-w-6xl grid-cols-1 items-center gap-12 lg:grid-cols-[1.08fr_.92fr] lg:gap-16">
        <div className="text-center lg:text-left">
          <p className="hero-kicker mb-6 text-xs font-semibold uppercase tracking-[0.2em] text-primary">
            {lang === "km"
              ? "ផលិតផល · បទពិសោធន៍ · បច្ចេកវិទ្យា"
              : "Products · Experiences · Technology"}
          </p>
          {/* The name and rotating roles remain English in both locales. Mark
              that explicitly so Khmer-only heading metrics do not expand this
              Latin display type. */}
          <h1
            lang="en"
            className="mb-7 text-5xl font-semibold leading-[.95] tracking-[-.055em] sm:text-7xl xl:text-8xl"
          >
            <span className="block overflow-hidden pb-[.04em]">
              <span className="hero-title-line block">{localized.name}</span>
            </span>
            <span className="sr-only">
              {dict.hero.titles[0]} · {dict.hero.titles[1]}
            </span>
            <span
              aria-hidden
              className="block min-h-[1.9em] overflow-hidden pb-2"
            >
              <span
                className="hero-title-line block font-semibold not-italic text-primary"
                style={{ "--hero-delay": "120ms" } as CSSProperties}
              >
                {typedRole}
                <span className="ml-[.08em] inline-block h-[.78em] w-[.055em] bg-primary align-baseline motion-safe:animate-[blink_1s_step-end_infinite]" />
              </span>
            </span>
          </h1>
          <p className="hero-copy mx-auto max-w-xl text-base leading-relaxed text-field-muted-foreground lg:mx-0 sm:text-lg">
            {localized.tagline}
          </p>
          <div className="mt-9 flex flex-col justify-center gap-3 sm:flex-row lg:justify-start">
            <Magnetic strength={0.25} className="hero-action">
              <a
                href="#projects"
                onClick={(event) => {
                  event.preventDefault();
                  scrollToSection("projects");
                }}
                className="btn-fx btn-fx-primary flex min-h-12 items-center justify-center gap-2 rounded-full bg-primary-fill px-6 text-sm font-semibold text-primary-foreground"
              >
                {dict.hero.viewWork}
                <ArrowDown size={16} />
              </a>
            </Magnetic>
            <Magnetic strength={0.25} className="hero-action">
              <Link
                href={`/${lang}/resume`}
                className="btn-fx flex min-h-12 items-center justify-center gap-2 rounded-full border border-border/70 px-6 text-sm font-semibold text-foreground hover:border-primary/50 hover:text-primary"
              >
                <FileText size={16} />
                {dict.hero.resume}
              </Link>
            </Magnetic>
            <Magnetic strength={0.25} className="hero-action">
              <a
                href="#contact"
                onClick={(event) => {
                  event.preventDefault();
                  scrollToSection("contact");
                }}
                className="btn-fx flex min-h-12 items-center justify-center gap-2 px-3 text-sm font-semibold text-field-muted-foreground hover:text-primary"
              >
                <Mail size={16} />
                {dict.hero.getInTouch}
                <ArrowUpRight size={14} />
              </a>
            </Magnetic>
          </div>

          <a
            href="#showreel"
            onClick={(event) => {
              event.preventDefault();
              scrollToSection("showreel");
            }}
            className="hero-action mt-5 inline-flex min-h-11 items-center gap-2 text-sm font-semibold text-foreground underline decoration-primary/50 underline-offset-4 hover:text-primary hover:decoration-primary focus-visible:rounded-sm focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary"
          >
            <Play size={14} fill="currentColor" aria-hidden="true" />
            {lang === "km" ? "ទស្សនាវីដេអូ ៣០ វិនាទី" : "Watch the 30-second film"}
            <ArrowUpRight size={14} aria-hidden="true" />
          </a>

          <dl className="mx-auto mt-9 grid max-w-xl grid-cols-3 border-y border-border/55 py-4 text-left lg:mx-0">
            {proofPoints.map(([value, label], index) => (
              <div
                key={label}
                className={`hero-proof min-w-0 px-3 first:pl-0 last:pr-0 sm:px-5 ${
                  index > 0 ? "border-l border-border/55" : ""
                }`}
              >
                <dt className="text-sm font-bold leading-tight text-foreground sm:text-base">
                  {value}
                </dt>
                <dd className="mt-1 text-[10px] leading-snug text-field-muted-foreground sm:text-xs">
                  {label}
                </dd>
              </div>
            ))}
          </dl>
        </div>

        <TiltCard
          maxTilt={4.5}
          hoverScale={1.008}
          className="hero-portrait group relative mx-auto aspect-[.84] w-full max-w-[29rem] rounded-2xl lg:mx-0 lg:ml-auto"
        >
          <div
            aria-hidden
            className="hero-portrait-detail absolute inset-x-[3%] bottom-[1%] top-[5%] translate-x-3 translate-y-3 rounded-2xl bg-primary/7"
          />

          <div className="portrait-frame relative isolate mx-auto h-[94%] w-[88%] overflow-hidden rounded-2xl border border-border/60 bg-card shadow-[0_28px_75px_rgb(0_0_0/.14)]">
            <span aria-hidden className="portrait-stage" />
            <PortraitType layer="back" />
            <Image
              src="/bondeth.webp"
              alt={lang === "km" ? "ហែម ឫទ្ធីបណ្ឌិត" : "Rithy Bondeth"}
              fill
              priority
              sizes="(max-width:1024px) 80vw, 40vw"
              className="z-10 object-cover object-top transition-transform duration-700 ease-out group-hover:scale-[1.025] motion-reduce:transition-none motion-reduce:group-hover:scale-100"
            />
            <PortraitType layer="front" />
            <span aria-hidden className="portrait-scan z-30" />
          </div>

          <div className="hero-portrait-detail absolute bottom-[2%] right-0 rounded-full border border-border/60 bg-background/92 px-4 py-2.5 shadow-[0_12px_30px_rgb(0_0_0/.12)] backdrop-blur-xl sm:px-5">
            <div className="flex items-center gap-2.5">
              <span className="size-2.5 shrink-0 rounded-full bg-emerald-500" />
              <p className="text-xs font-semibold text-foreground sm:text-sm">
                {lang === "km" ? "ភ្នំពេញ · UTC+7" : "Phnom Penh · UTC+7"}
              </p>
            </div>
          </div>
        </TiltCard>
      </div>
      <button
        onClick={() => scrollToSection("showreel")}
        className="hero-scroll absolute bottom-7 left-1/2 flex -translate-x-1/2 flex-col items-center gap-2 text-[10px] font-semibold uppercase tracking-[.2em] text-field-muted-foreground"
        aria-label={dict.hero.scroll}
      >
        {dict.hero.scroll}
        <span className="h-10 w-px bg-linear-to-b from-primary to-transparent" />
      </button>
    </section>
  );
}
