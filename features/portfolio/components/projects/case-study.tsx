import { ProjectScreenshot } from "@/features/portfolio/components/projects/project-media";
import { ProjectPreviewViewer } from "@/features/portfolio/components/projects/project-preview-viewer";
import type { ProjectCaseStudy } from "@/features/portfolio/domain";
import type { Dictionary, Locale } from "@/shared/i18n";

/** How many numbered sections a case study adds, so the page can continue the count. */
export function countCaseStudySections(caseStudy: ProjectCaseStudy) {
  const hasOutcome = Boolean(caseStudy.outcome || caseStudy.metrics?.length);
  return 2 + (hasOutcome ? 1 : 0) + (caseStudy.gallery?.length ? 1 : 0);
}

function SectionTitle({
  id,
  index,
  label,
}: {
  id: string;
  index: number;
  label: string;
}) {
  return (
    <h3
      id={id}
      tabIndex={-1}
      className="flex scroll-mt-32 items-baseline gap-3 text-xl font-semibold tracking-tight text-foreground"
    >
      <span aria-hidden className="font-mono text-xs text-primary">
        {String(index).padStart(2, "0")}
      </span>
      {label}
    </h3>
  );
}

const PANEL = "min-w-0 rounded-xl border border-border/60 bg-card p-5 sm:p-7";
const SECTION_ID = {
  problem: "project-problem",
  decisions: "project-decisions",
  outcome: "project-outcome",
  gallery: "project-gallery",
} as const;

export function CaseStudy({
  caseStudy,
  dict,
  title,
  lang,
}: {
  caseStudy: ProjectCaseStudy;
  dict: Dictionary;
  title: string;
  lang: Locale;
}) {
  const labels = dict.projects.caseStudy;
  const {
    problem,
    decisions,
    constraints,
    outcome,
    metrics,
    gallery = [],
    language,
  } = caseStudy;
  const hasOutcome = Boolean(outcome || metrics?.length);
  const hasGallery = gallery.length > 0;
  const sections: { id: string; label: string }[] = [
    { id: SECTION_ID.problem, label: labels.problem },
    { id: SECTION_ID.decisions, label: labels.decisions },
  ];
  if (hasOutcome)
    sections.push({ id: SECTION_ID.outcome, label: labels.outcome });
  if (hasGallery)
    sections.push({ id: SECTION_ID.gallery, label: labels.gallery });

  return (
    <section
      className="mt-14 space-y-6 scroll-mt-32"
      aria-labelledby="project-case-study"
    >
      <header className="border-b border-border/60 pb-4">
        <h2
          id="project-case-study"
          className="scroll-mt-32 text-3xl font-semibold tracking-tight text-foreground"
        >
          {labels.badge}
        </h2>
        {language && language !== lang && (
          <p className="mt-2 text-sm text-muted-foreground">
            {labels.englishOriginal}
          </p>
        )}
      </header>

      <nav
        aria-labelledby="case-study-contents"
        className="rounded-xl border border-border/60 bg-card px-4 py-3 sm:px-5"
      >
        <p
          id="case-study-contents"
          className="text-sm font-semibold text-foreground"
        >
          {labels.onThisPage}
        </p>
        <ul className="mt-1 flex flex-wrap gap-x-2 gap-y-1">
          {sections.map(({ id, label }) => (
            <li key={id}>
              <a
                href={`#${id}`}
                className="inline-flex min-h-11 items-center rounded-lg px-2 text-sm font-medium text-field-muted-foreground underline decoration-border underline-offset-4 hover:bg-muted/50 hover:text-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
              >
                {label}
              </a>
            </li>
          ))}
        </ul>
      </nav>

      <div
        className={`grid gap-4 ${constraints?.length ? "lg:grid-cols-[1.25fr_0.75fr]" : ""}`}
      >
        <section className={PANEL}>
          <SectionTitle
            id={SECTION_ID.problem}
            index={1}
            label={labels.problem}
          />
          <p
            lang={language}
            className="mt-4 max-w-prose text-base leading-7 text-foreground sm:text-lg sm:leading-8"
          >
            {problem}
          </p>
        </section>

        {constraints && constraints.length > 0 && (
          <aside className={PANEL}>
            <h3 className="text-base font-semibold text-foreground">
              {labels.constraints}
            </h3>
            <ul
              lang={language}
              className="mt-3 list-disc space-y-2 pl-5 text-sm leading-6 text-muted-foreground marker:text-primary"
            >
              {constraints.map((constraint) => (
                <li key={constraint}>{constraint}</li>
              ))}
            </ul>
          </aside>
        )}
      </div>

      <section className="pt-3">
        <SectionTitle
          id={SECTION_ID.decisions}
          index={2}
          label={labels.decisions}
        />
        <ol
          className={`mt-4 grid gap-4 ${decisions.length > 1 ? "md:grid-cols-2" : ""}`}
        >
          {decisions.map((decision, index) => (
            <li key={decision.title} className={PANEL}>
              <p
                aria-hidden
                className="text-xs font-medium text-muted-foreground"
              >
                {labels.decision} {String(index + 1).padStart(2, "0")}
              </p>
              <h4
                lang={language}
                className="mt-2 text-base font-semibold leading-snug text-foreground"
              >
                {decision.title}
              </h4>
              <p
                lang={language}
                className="mt-2 max-w-prose text-sm leading-7 text-muted-foreground"
              >
                {decision.body}
              </p>
              {decision.tradeoff && (
                <div className="mt-4 border-t border-border/60 pt-3">
                  <p className="text-xs font-semibold text-foreground">
                    {labels.tradeoff}
                  </p>
                  <p
                    lang={language}
                    className="mt-1 max-w-prose text-sm leading-6 text-muted-foreground"
                  >
                    {decision.tradeoff}
                  </p>
                </div>
              )}
            </li>
          ))}
        </ol>
      </section>

      {hasOutcome && (
        <section className={PANEL}>
          <SectionTitle
            id={SECTION_ID.outcome}
            index={3}
            label={labels.outcome}
          />
          {metrics && metrics.length > 0 && (
            <dl
              lang={language}
              className="mt-5 grid grid-cols-[repeat(auto-fit,minmax(min(100%,9rem),1fr))] gap-3"
            >
              {metrics.map(({ label, value }) => (
                <div
                  key={label}
                  className="flex min-w-0 flex-col rounded-lg border border-border/60 bg-muted/30 p-4"
                >
                  <dt className="order-2 mt-1 text-xs leading-snug text-muted-foreground">
                    {label}
                  </dt>
                  <dd className="text-xl font-bold tracking-tight break-words text-foreground sm:text-2xl">
                    {value}
                  </dd>
                </div>
              ))}
            </dl>
          )}
          {outcome && (
            <p
              lang={language}
              className="mt-4 max-w-prose text-sm leading-7 text-muted-foreground"
            >
              {outcome}
            </p>
          )}
        </section>
      )}

      {hasGallery && (
        <section className="pt-3">
          <SectionTitle
            id={SECTION_ID.gallery}
            index={hasOutcome ? 4 : 3}
            label={labels.gallery}
          />
          <div
            className={`mt-4 grid items-start gap-5 ${gallery.length > 1 ? "sm:grid-cols-2" : ""}`}
          >
            {gallery.map((image, index) => (
              <figure key={image.src} className="min-w-0">
                <div className="relative overflow-hidden rounded-xl border border-border/60 bg-card">
                  <ProjectScreenshot
                    src={image.src}
                    alt={image.alt || `${title} — ${index + 1}`}
                    sizes={
                      gallery.length > 1
                        ? "(min-width: 640px) 512px, 90vw"
                        : "(min-width: 1024px) 1024px, 90vw"
                    }
                  />
                  <ProjectPreviewViewer
                    src={image.src}
                    title={
                      image.caption || image.alt || `${title} — ${index + 1}`
                    }
                    openLabel={dict.projects.openPreview}
                    closeLabel={dict.projects.closePreview}
                  />
                </div>
                <figcaption className="mt-2 space-y-1 text-sm leading-6 text-muted-foreground">
                  {image.caption && <p lang={language}>{image.caption}</p>}
                  <p className="text-xs">
                    <a
                      href={image.sourceUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="rounded-sm text-primary underline underline-offset-4 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
                    >
                      {labels.screenshotSource}
                    </a>
                    {" · "}
                    <time dateTime={image.capturedAt}>{image.capturedAt}</time>
                  </p>
                </figcaption>
              </figure>
            ))}
          </div>
        </section>
      )}
    </section>
  );
}
