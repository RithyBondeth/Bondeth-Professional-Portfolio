import { AnimateIn, StaggerIn } from "@/components/utils/animations/animate-in";
import { ScrambleText } from "@/components/utils/animations/scramble-text";
import { SplitReveal } from "@/components/utils/animations/split-reveal";
import { StatusChip } from "@/components/utils/status-chip";
import { getDictionary, type TLocale } from "@/utils/i18n";
import { Globe } from "./globe";

export default function LandingCurrentFocus(props: { lang: TLocale }) {
  const { lang } = props;
  const { currentFocus } = getDictionary(lang);

  return (
    <section
      id="current-focus"
      className="relative isolate overflow-hidden px-6 py-14 sm:py-16 lg:py-20"
    >
      <div
        aria-hidden
        data-speed="0.92"
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_80%_20%,color-mix(in_oklab,var(--primary)_10%,transparent),transparent_35%)]"
      />

      <div className="relative mx-auto max-w-6xl">
        <div className="grid gap-10 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
          <div>
            <AnimateIn from="left" distance={40}>
              <p className="mb-1 font-mono text-xs uppercase tracking-[0.25em] text-primary">
                <ScrambleText text="// now.json" />
              </p>
            </AnimateIn>

            <SplitReveal
              as="h2"
              type="lines"
              className="mt-3 text-3xl font-bold text-foreground sm:text-4xl lg:text-5xl"
            >
              {currentFocus.heading}
            </SplitReveal>

            <AnimateIn from="up" delay={0.1}>
              <p className="mt-5 max-w-xl text-sm leading-relaxed text-field-muted-foreground">
                {currentFocus.blurb}
              </p>
            </AnimateIn>

            <AnimateIn from="up" delay={0.15}>
              <div className="mt-7">
                <StatusChip>{currentFocus.status}</StatusChip>
              </div>
            </AnimateIn>
          </div>

          <AnimateIn from="right" delay={0.15} distance={40}>
            <Globe
              label={currentFocus.globe.pinLabel}
              photo={{
                src: "/bondeth-profile.webp",
                caption: currentFocus.globe.photoCaption,
              }}
              className="mx-auto -my-6 max-w-95 lg:my-0 lg:max-w-110"
            />
          </AnimateIn>
        </div>

        <StaggerIn
          className="mt-4 grid grid-cols-2 gap-3 sm:gap-4 lg:mt-10 xl:grid-cols-4"
          from="up"
          stagger={0.1}
          delay={0.1}
        >
          {currentFocus.items.map((item, index) => (
            <article
              key={item.label}
              className="card-interactive group rounded border border-border/60 bg-background/70 p-4 sm:p-5"
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
    </section>
  );
}
