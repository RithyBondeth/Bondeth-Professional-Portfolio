import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ResumeActions } from "@/components/resume/resume-actions";
import { skillGroups } from "@/utils/constants/portfolio.constant";
import { getDictionary, hasLocale } from "@/utils/i18n";
import {
  getEducations,
  getExperiences,
  getSiteConfig,
} from "@/utils/i18n/content";

interface IResumePageProps {
  params: Promise<{ lang: string }>;
}

export async function generateMetadata({
  params,
}: IResumePageProps): Promise<Metadata> {
  const { lang } = await params;
  if (!hasLocale(lang)) return {};
  const dict = getDictionary(lang);
  const site = getSiteConfig(lang);

  return {
    // The root layout's template already appends the site name.
    title: dict.resume.heading,
    description: dict.resume.blurb,
    alternates: {
      canonical: `/${lang}/resume`,
      languages: {
        en: "/en/resume",
        km: "/km/resume",
        "x-default": "/en/resume",
      },
    },
  };
}

/**
 * The résumé as a page rather than only as a file.
 *
 * Everything here is read from the same localized accessors the landing
 * sections use, so this cannot drift from the site — but note it CAN drift
 * from `public/files/bondeth-resume.pdf`, which is authored by hand. The PDF
 * stays the canonical artefact to hand over; this is the version a phone, a
 * search engine and the Khmer locale can actually read.
 *
 * Print layout is handled by the global `@media print` block in globals.css.
 */
export default async function ResumePage({ params }: IResumePageProps) {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();

  const dict = getDictionary(lang);
  const site = getSiteConfig(lang);
  const experiences = getExperiences(lang);
  const educations = getEducations(lang);
  const r = dict.resume;

  return (
    <main
      id="main-content"
      tabIndex={-1}
      className="flex-1 px-6 pb-16 sm:pb-24 pt-32 font-sans print:px-0 print:pb-0 print:pt-0"
    >
      <article className="mx-auto max-w-3xl">
        <p
          data-print-hide
          className="font-mono text-xs uppercase tracking-[0.25em] text-primary"
        >
          {r.eyebrow}
        </p>

        {/* Header — the only block that has to carry identity on paper. */}
        <header data-print-keep className="mt-3">
          <h1 className="text-4xl font-bold text-foreground sm:text-5xl">
            {site.name}
          </h1>
          <p className="mt-2 text-base text-field-muted-foreground">
            {site.title}
          </p>

          <dl className="mt-5 grid gap-x-8 gap-y-2 text-sm sm:grid-cols-2">
            <div className="flex gap-2">
              <dt className="font-mono text-xs uppercase tracking-wider text-muted-foreground">
                {r.email}
              </dt>
              <dd>
                <a
                  href={`mailto:${site.email}`}
                  className="text-foreground underline underline-offset-4"
                >
                  {site.email}
                </a>
              </dd>
            </div>
            <div className="flex gap-2">
              <dt className="font-mono text-xs uppercase tracking-wider text-muted-foreground">
                {r.location}
              </dt>
              <dd className="text-foreground">{r.locationValue}</dd>
            </div>
            <div className="flex gap-2">
              <dt className="font-mono text-xs uppercase tracking-wider text-muted-foreground">
                {r.website}
              </dt>
              <dd className="text-foreground">{site.url}</dd>
            </div>
          </dl>
        </header>

        <p
          data-print-hide
          className="mt-6 max-w-2xl text-sm leading-relaxed text-field-muted-foreground"
        >
          {r.blurb}
        </p>

        <div className="mt-6">
          <ResumeActions downloadLabel={r.downloadPdf} printLabel={r.print} />
        </div>

        {/* Bio doubles as the résumé summary. */}
        <section className="mt-12">
          {site.bio.map((paragraph, i) => (
            <p
              key={i}
              className="mb-3 text-sm leading-relaxed text-field-muted-foreground"
            >
              {paragraph}
            </p>
          ))}
        </section>

        <ResumeSection title={r.experience}>
          {experiences.map((exp) => (
            <div
              key={`${exp.company}-${exp.period}`}
              data-print-keep
              className="border-l border-border pl-5"
            >
              <div className="flex flex-wrap items-baseline justify-between gap-x-4">
                <h3 className="text-base font-semibold text-foreground">
                  {exp.role}
                </h3>
                <span className="font-mono text-xs text-muted-foreground">
                  {exp.period}
                </span>
              </div>
              <p className="mt-0.5 text-sm text-primary">{exp.company}</p>
              <p className="mt-2 text-sm leading-relaxed text-field-muted-foreground">
                {exp.description}
              </p>
              {exp.tags.length ? (
                <p className="mt-2 font-mono text-xs text-muted-foreground">
                  {exp.tags.join(" · ")}
                </p>
              ) : null}
            </div>
          ))}
        </ResumeSection>

        <ResumeSection title={r.education}>
          {educations.map((edu) => (
            <div
              key={`${edu.institution}-${edu.period}`}
              data-print-keep
              className="border-l border-border pl-5"
            >
              <div className="flex flex-wrap items-baseline justify-between gap-x-4">
                <h3 className="text-base font-semibold text-foreground">
                  {edu.degree}
                </h3>
                <span className="font-mono text-xs text-muted-foreground">
                  {edu.period}
                </span>
              </div>
              <p className="mt-0.5 text-sm text-primary">
                {edu.institution} · {edu.location}
              </p>
              <p className="mt-2 text-sm leading-relaxed text-field-muted-foreground">
                {edu.description}
              </p>
              {edu.achievements.length ? (
                <ul className="mt-2 list-disc pl-5 text-sm text-field-muted-foreground">
                  {edu.achievements.map((a) => (
                    <li key={a}>{a}</li>
                  ))}
                </ul>
              ) : null}
            </div>
          ))}
        </ResumeSection>

        {/* Skill names and groupings are proper nouns, so they are not
            localized — only the section heading is. */}
        <ResumeSection title={r.skills}>
          {skillGroups.map((group) => (
            <div key={group.category} data-print-keep>
              <h3 className="font-mono text-xs uppercase tracking-wider text-muted-foreground">
                {group.category}
              </h3>
              <p className="mt-1.5 text-sm text-field-muted-foreground">
                {group.skills.map((s) => s.name).join(" · ")}
              </p>
            </div>
          ))}
        </ResumeSection>

        {/* Print-only: a printout with no URL on it is an orphan. */}
        <p className="mt-16 hidden font-mono text-xs text-muted-foreground print:block">
          {r.printedFrom} {site.url}/{lang}/resume
        </p>
      </article>
    </main>
  );
}

function ResumeSection(props: { title: string; children: React.ReactNode }) {
  const { title, children } = props;
  return (
    <section className="mt-12">
      <h2 className="mb-5 border-b border-border pb-2 font-mono text-sm uppercase tracking-[0.2em] text-foreground">
        {title}
      </h2>
      <div className="space-y-7">{children}</div>
    </section>
  );
}
