import Image from "next/image";
import { AnimateIn } from "@/components/utils/animations/animate-in";
import type { IProjectCaseStudy } from "@/utils/interfaces/portfolio";
import type { TDictionary } from "@/utils/i18n";

/** How many numbered sections a case study adds, so the page can continue the count. */
export function countCaseStudySections(caseStudy: IProjectCaseStudy) {
  const hasOutcome = Boolean(caseStudy.outcome || caseStudy.metrics?.length);
  return 2 + (hasOutcome ? 1 : 0) + (caseStudy.gallery?.length ? 1 : 0);
}

function Eyebrow({ index, label }: { index: number; label: string }) {
  return (
    <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-primary">
      {String(index).padStart(2, "0")} / {label}
    </p>
  );
}

/**
 * The long-form half of a project page: problem, decisions, outcome, gallery.
 * Each block renders only when it has content, so a case study can grow one
 * section at a time without leaving an empty heading on the page.
 */
export function CaseStudy(props: {
  caseStudy: IProjectCaseStudy;
  dict: TDictionary;
  title: string;
}) {
  const { caseStudy, dict, title } = props;
  const labels = dict.projects.caseStudy;
  const hasOutcome = Boolean(caseStudy.outcome || caseStudy.metrics?.length);
  const hasGallery = Boolean(caseStudy.gallery?.length);
  // Problem and decisions are always present; outcome and gallery number
  // themselves only when they render.
  const number = {
    problem: 1,
    decisions: 2,
    outcome: 3,
    gallery: hasOutcome ? 4 : 3,
  };

  return (
    <div className="mt-16 space-y-6">
      {/* Problem + constraints */}
      <div
        className={`grid gap-6 ${caseStudy.constraints?.length ? "lg:grid-cols-[1.25fr_0.75fr]" : ""}`}
      >
        <AnimateIn from="up">
          <section className="h-full rounded-lg border border-border/60 bg-card p-6 sm:p-8">
            <Eyebrow index={number.problem} label={labels.problem} />
            <h2 className="sr-only">{labels.problem}</h2>
            <p className="mt-5 text-lg leading-8 text-foreground sm:text-xl sm:leading-9">
              {caseStudy.problem}
            </p>
          </section>
        </AnimateIn>

        {caseStudy.constraints && caseStudy.constraints.length > 0 && (
          <AnimateIn from="up" delay={0.08}>
            <aside className="h-full rounded-lg border border-border/60 bg-card p-6">
              <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-primary">
                {labels.constraints}
              </p>
              <ul className="mt-5 space-y-3">
                {caseStudy.constraints.map((constraint, position) => (
                  <li
                    key={`${position}-${constraint}`}
                    className="flex gap-3 text-sm leading-6 text-muted-foreground"
                  >
                    <span
                      aria-hidden
                      className="mt-2.5 size-1.5 shrink-0 bg-brand-pixel"
                    />
                    {constraint}
                  </li>
                ))}
              </ul>
            </aside>
          </AnimateIn>
        )}
      </div>

      {/* Decisions */}
      <section className="pt-6">
        <AnimateIn from="up">
          <Eyebrow index={number.decisions} label={labels.decisions} />
          <h2 className="mt-3 text-2xl font-semibold text-foreground">
            {labels.decisions}
          </h2>
        </AnimateIn>
        {/* Three across when the count divides by three, otherwise pairs —
            four decisions read better as 2×2 than as 3 + 1 orphan. */}
        <ol
          className={`mt-6 grid gap-4 ${
            caseStudy.decisions.length % 3 === 0
              ? "lg:grid-cols-3"
              : "md:grid-cols-2"
          }`}
        >
          {caseStudy.decisions.map((decision, position) => (
            <li key={`${position}-${decision.title}`} className="h-full">
              <AnimateIn from="up" delay={position * 0.06} className="h-full">
                <article className="flex h-full flex-col rounded-lg border border-border/60 bg-card p-6">
                  <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
                    {labels.decision} {String(position + 1).padStart(2, "0")}
                  </p>
                  <h3 className="mt-3 text-base font-semibold leading-snug text-foreground">
                    {decision.title}
                  </h3>
                  <p className="mt-3 flex-1 text-sm leading-7 text-muted-foreground">
                    {decision.body}
                  </p>
                  {decision.tradeoff && (
                    <div className="mt-5 border-t border-border/50 pt-4">
                      <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-primary">
                        {labels.tradeoff}
                      </p>
                      <p className="mt-2 text-sm leading-6 text-muted-foreground">
                        {decision.tradeoff}
                      </p>
                    </div>
                  )}
                </article>
              </AnimateIn>
            </li>
          ))}
        </ol>
      </section>

      {/* Outcome */}
      {hasOutcome && (
        <AnimateIn from="up">
          <section className="rounded-lg border border-border/60 bg-card p-6 sm:p-8">
            <Eyebrow index={number.outcome} label={labels.outcome} />
            <h2 className="sr-only">{labels.outcome}</h2>
            {caseStudy.metrics && caseStudy.metrics.length > 0 && (
              <dl className="mt-6 grid grid-cols-2 gap-6 sm:grid-cols-4">
                {caseStudy.metrics.map((metric, position) => (
                  <div
                    key={`${position}-${metric.label}`}
                    className="border-l-2 border-brand-pixel pl-4"
                  >
                    <dt className="sr-only">{metric.label}</dt>
                    <dd className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
                      {metric.value}
                    </dd>
                    <dd className="mt-1 font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
                      {metric.label}
                    </dd>
                  </div>
                ))}
              </dl>
            )}
            {caseStudy.outcome && (
              <p
                className={`text-base leading-8 text-muted-foreground ${
                  caseStudy.metrics?.length ? "mt-8" : "mt-5"
                }`}
              >
                {caseStudy.outcome}
              </p>
            )}
          </section>
        </AnimateIn>
      )}

      {/* Gallery */}
      {hasGallery && caseStudy.gallery && (
        <section className="pt-6">
          <AnimateIn from="up">
            <Eyebrow index={number.gallery} label={labels.gallery} />
            <h2 className="mt-3 text-2xl font-semibold text-foreground">
              {labels.gallery}
            </h2>
          </AnimateIn>
          {/* A lone image takes the full width rather than half a grid. */}
          <div
            className={`mt-6 grid gap-6 ${
              caseStudy.gallery.length > 1 ? "sm:grid-cols-2" : ""
            }`}
          >
            {caseStudy.gallery.map((image, position) => (
              <AnimateIn
                key={image.src}
                from="up"
                delay={(position % 2) * 0.06}
              >
                <figure>
                  <div className="relative aspect-16/10 overflow-hidden rounded-lg border border-border/60 bg-card">
                    <Image
                      src={image.src}
                      alt={image.alt || `${title}: ${image.caption ?? ""}`}
                      fill
                      sizes="(min-width: 640px) 512px, 100vw"
                      className="object-cover object-top"
                    />
                  </div>
                  {image.caption && (
                    <figcaption className="mt-3 font-mono text-xs text-muted-foreground">
                      {image.caption}
                    </figcaption>
                  )}
                </figure>
              </AnimateIn>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
