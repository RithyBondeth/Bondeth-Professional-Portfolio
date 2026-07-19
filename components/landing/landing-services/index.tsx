import Link from "next/link";
import { SectionBackdrop } from "@/components/utils/animations/section-backdrop";
import { ArrowRight, Bot, Code2, PanelsTopLeft, Smartphone } from "lucide-react";
import { AnimateIn, StaggerIn } from "@/components/utils/animations/animate-in";
import { ScrambleText } from "@/components/utils/animations/scramble-text";
import { SplitReveal } from "@/components/utils/animations/split-reveal";
import { Magnetic } from "@/components/utils/animations/magnetic";
import { getDictionary, type TLocale } from "@/utils/i18n";

const SERVICE_ICONS = [PanelsTopLeft, Smartphone, Bot, Code2];

export default function LandingServices(props: { lang: TLocale }) {
  const { lang } = props;
  const { services } = getDictionary(lang);

  return (
    <section id="services" className="relative isolate overflow-hidden bg-card px-6 py-24">
      <SectionBackdrop />

      <div className="mx-auto max-w-6xl">
        <AnimateIn from="left">
          <p className="font-mono text-xs uppercase tracking-[0.25em] text-primary">
            <ScrambleText text="// services" />
          </p>
        </AnimateIn>

        <div className="mt-3 flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
          <div>
            <SplitReveal
              as="h2"
              type="lines"
              className="text-4xl font-bold text-foreground sm:text-5xl"
            >
              {services.heading}
            </SplitReveal>
            <AnimateIn from="up" distance={24} delay={0.1}>
              <p className="mt-4 max-w-2xl text-sm leading-7 text-muted-foreground">
                {services.blurb}
              </p>
            </AnimateIn>
          </div>

          <AnimateIn from="right" distance={30} delay={0.08}>
            <Magnetic strength={0.3} className="inline-block">
              <Link
                href={`/${lang}/#contact`}
                className="inline-flex min-h-11 shrink-0 items-center gap-2 rounded bg-primary px-4 font-mono text-xs font-medium text-primary-foreground transition-colors hover:bg-primary/90"
              >
                {services.discussProject}
                <ArrowRight aria-hidden className="size-3.5" />
              </Link>
            </Magnetic>
          </AnimateIn>
        </div>

        <StaggerIn
          className="mt-12 grid gap-4 sm:grid-cols-2"
          from="zoom-in"
          stagger={0.1}
          staggerFrom="center"
        >
          {services.items.map((service, index) => {
            const Icon = SERVICE_ICONS[index] ?? Code2;

            return (
              <article
                key={service.title}
                className="group rounded-lg border border-border/60 bg-background/70 p-5 transition-all duration-300 hover:-translate-y-1 hover:border-primary/35 hover:shadow-[0_12px_40px_rgba(34,211,238,0.06)] motion-reduce:transform-none sm:p-6"
              >
                <div className="flex items-start justify-between gap-4">
                  <span className="flex size-10 items-center justify-center rounded border border-primary/20 bg-primary/5 text-primary transition-all duration-300 group-hover:border-primary/50 group-hover:bg-primary/10 group-hover:shadow-[0_0_14px_rgba(34,211,238,0.25)]">
                    <Icon
                      aria-hidden
                      className="size-5 transition-transform duration-300 motion-safe:group-hover:scale-110 motion-safe:group-hover:-rotate-6"
                    />
                  </span>
                  <span className="font-mono text-[10px] text-muted-foreground transition-colors duration-300 group-hover:text-primary">
                    0{index + 1}
                  </span>
                </div>
                <h3 className="mt-5 text-lg font-semibold text-foreground">
                  {service.title}
                </h3>
                <p className="mt-2 text-sm leading-6 text-muted-foreground">
                  {service.body}
                </p>
                <Link
                  href={`/${lang}/#contact`}
                  className="mt-5 inline-flex min-h-11 items-center gap-2 font-mono text-xs text-primary hover:underline hover:underline-offset-4"
                >
                  {services.discussSolution}
                  <ArrowRight
                    aria-hidden
                    className="size-3.5 transition-transform group-hover:translate-x-1"
                  />
                </Link>
              </article>
            );
          })}
        </StaggerIn>
      </div>
    </section>
  );
}
