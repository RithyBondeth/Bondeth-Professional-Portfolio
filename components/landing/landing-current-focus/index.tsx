import { AnimateIn, StaggerIn } from "@/components/utils/animations/animate-in";
import { SectionBackdrop } from "@/components/utils/animations/section-backdrop";
import { ScrambleText } from "@/components/utils/animations/scramble-text";
import { SplitReveal } from "@/components/utils/animations/split-reveal";
import Link from "next/link";
import { getDictionary, type TLocale } from "@/utils/i18n";

export default function LandingCurrentFocus(props: { lang: TLocale }) {
  const { lang } = props;
  const { currentFocus, labs } = getDictionary(lang);

  return (
    <section
      id="current-focus"
      className="relative isolate overflow-hidden bg-card px-6 py-20"
    >
      <SectionBackdrop />

      <div
        aria-hidden
        data-speed="0.92"
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_80%_20%,color-mix(in_oklab,var(--primary)_10%,transparent),transparent_35%)]"
      />

      <div className="relative mx-auto max-w-6xl">
        <div className="grid gap-12 lg:grid-cols-[0.8fr_1.2fr] lg:items-end">
          <div>
            <AnimateIn from="left" distance={40}>
              <p className="mb-1 font-mono text-xs uppercase tracking-[0.25em] text-primary">
                <ScrambleText text="// now.json" />
              </p>
            </AnimateIn>

            <SplitReveal
              as="h2"
              type="lines"
              className="mt-3 text-4xl font-bold text-foreground sm:text-5xl"
            >
              {currentFocus.heading}
            </SplitReveal>

            <AnimateIn from="up" delay={0.1}>
              <p className="mt-5 max-w-xl text-sm leading-relaxed text-muted-foreground">
                {currentFocus.blurb}
              </p>
            </AnimateIn>

            <AnimateIn from="up" delay={0.15}>
              <div className="mt-7 flex flex-wrap items-center gap-3">
                <div className="animated-border inline-flex items-center gap-2 rounded-full px-3 py-1.5 font-mono text-[11px] text-emerald-500">
                  <span className="relative flex h-2 w-2" aria-hidden>
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-50 motion-reduce:animate-none" />
                    <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
                  </span>
                  {currentFocus.status}
                </div>
                <Link
                  href={`/${lang}/labs`}
                  className="inline-flex min-h-11 items-center gap-2 rounded border border-primary/25 px-3 font-mono text-[11px] text-primary transition-colors hover:bg-primary/5"
                >
                  {labs.navLabel}
                  <span aria-hidden>→</span>
                </Link>
              </div>
            </AnimateIn>
          </div>

          <StaggerIn
            className="grid grid-cols-2 gap-3 sm:gap-4"
            from="up"
            stagger={0.1}
            delay={0.1}
          >
            {currentFocus.items.map((item, index) => (
              <article
                key={item.label}
                className="group rounded border border-border/60 bg-background/70 p-4 transition-all duration-300 hover:-translate-y-1 hover:border-primary/30 hover:shadow-[0_12px_40px_rgba(148,162,255,0.07)] motion-reduce:transform-none sm:p-5"
              >
                <div className="mb-4 flex items-center justify-between">
                  <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-primary">
                    0{index + 1}
                  </span>
                  <span
                    aria-hidden
                    className="h-px w-8 bg-border transition-all duration-300 group-hover:w-12 group-hover:bg-primary/50"
                  />
                </div>
                <h3 className="text-sm font-semibold text-foreground">
                  {item.label}
                </h3>
                <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
                  {item.value}
                </p>
              </article>
            ))}
          </StaggerIn>
        </div>
      </div>
    </section>
  );
}
