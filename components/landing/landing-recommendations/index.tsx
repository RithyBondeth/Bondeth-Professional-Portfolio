import Link from "next/link";
import { SectionBackdrop } from "@/components/utils/animations/section-backdrop";
import { ArrowRight, BadgeCheck, ShieldCheck } from "lucide-react";
import { AnimateIn, StaggerIn } from "@/components/utils/animations/animate-in";
import { ScrambleText } from "@/components/utils/animations/scramble-text";
import { SplitReveal } from "@/components/utils/animations/split-reveal";
import { LinkedInIcon } from "@/components/utils/icons";
import { siteConfig } from "@/utils/constants/portfolio.constant";
import { getDictionary, type TLocale } from "@/utils/i18n";

export default function LandingRecommendations(props: { lang: TLocale }) {
  const { lang } = props;
  const { recommendations } = getDictionary(lang);

  return (
    <section id="recommendations" className="relative isolate overflow-hidden bg-card px-6 py-16 sm:py-20 lg:py-24">
      <SectionBackdrop />

      <div className="mx-auto max-w-6xl">
        <div className="grid gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:items-end">
          <div>
            <AnimateIn from="left" distance={40}>
              <p className="font-mono text-xs uppercase tracking-[0.25em] text-primary">
                <ScrambleText text="// references.md" />
              </p>
            </AnimateIn>
            <SplitReveal
              as="h2"
              type="lines"
              className="mt-3 text-3xl font-bold text-foreground sm:text-4xl lg:text-5xl"
            >
              {recommendations.heading}
            </SplitReveal>
            <AnimateIn from="up" delay={0.1}>
              <p className="mt-5 max-w-xl text-sm leading-7 text-muted-foreground">
                {recommendations.blurb}
              </p>
            </AnimateIn>
          </div>

          <AnimateIn from="right" distance={30} delay={0.1}>
            <aside className="rounded-lg border border-primary/20 bg-primary/5 p-5 sm:p-6">
              <div className="flex gap-4">
                <ShieldCheck
                  aria-hidden
                  className="mt-0.5 size-6 shrink-0 text-primary"
                />
                <div>
                  <h3 className="font-semibold text-foreground">
                    {recommendations.privacyTitle}
                  </h3>
                  <p className="mt-2 text-sm leading-6 text-muted-foreground">
                    {recommendations.privacyBody}
                  </p>
                </div>
              </div>
            </aside>
          </AnimateIn>
        </div>

        <StaggerIn
          className="mt-10 grid gap-4 md:grid-cols-3"
          from="up"
          stagger={0.1}
        >
          {recommendations.items.map((item) => (
            <article
              key={item.title}
              className="card-interactive rounded-lg border border-border/60 bg-background/70 p-5"
            >
              <BadgeCheck aria-hidden className="size-5 text-primary" />
              <h3 className="mt-5 text-base font-semibold text-foreground">
                {item.title}
              </h3>
              <p className="mt-2 text-sm leading-6 text-muted-foreground">
                {item.body}
              </p>
            </article>
          ))}
        </StaggerIn>

        <AnimateIn from="up" delay={0.12}>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              href={`/${lang}/#contact`}
              className="inline-flex min-h-11 items-center gap-2 btn-fx btn-fx-primary rounded bg-primary px-4 font-mono text-xs font-medium text-primary-foreground"
            >
              {recommendations.requestReference}
              <ArrowRight aria-hidden data-btn-arrow className="size-3.5" />
            </Link>
            <a
              href={siteConfig.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex min-h-11 items-center gap-2 rounded border border-border/60 px-4 font-mono text-xs text-muted-foreground transition-colors hover:border-primary/40 hover:text-primary"
            >
              <LinkedInIcon aria-hidden className="size-3.5" />
              {recommendations.viewLinkedIn}
            </a>
          </div>
        </AnimateIn>
      </div>
    </section>
  );
}
