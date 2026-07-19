import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { AnimateIn } from "@/components/utils/animations/animate-in";
import { ScrambleText } from "@/components/utils/animations/scramble-text";
import { LabVignetteFx } from "@/components/labs/lab-vignette-fx";
import { getDictionary, hasLocale } from "@/utils/i18n";

interface ILabsPageProps {
  params: Promise<{ lang: string }>;
}

export async function generateMetadata({
  params,
}: ILabsPageProps): Promise<Metadata> {
  const { lang } = await params;
  if (!hasLocale(lang)) return {};
  const { labs } = getDictionary(lang);

  return {
    title: labs.heading,
    description: labs.blurb,
    alternates: {
      canonical: `/${lang}/labs`,
      languages: {
        en: "/en/labs",
        km: "/km/labs",
        "x-default": "/en/labs",
      },
    },
  };
}

export default async function LabsPage({ params }: ILabsPageProps) {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();
  const { labs } = getDictionary(lang);

  return (
    <main id="main-content" tabIndex={-1} className="flex-1 bg-background px-6 pb-24 pt-32 font-sans">
      <div className="mx-auto max-w-5xl">
        <AnimateIn>
          <p className="font-mono text-xs uppercase tracking-[0.25em] text-primary">
            <ScrambleText text="$ ls labs/" />
          </p>
          <h1 className="mt-3 text-4xl font-bold text-foreground sm:text-5xl">
            {labs.heading}
          </h1>
          <p className="mt-4 max-w-2xl text-sm leading-relaxed text-muted-foreground">
            {labs.blurb}
          </p>
        </AnimateIn>

        <AnimateIn from="up" delay={0.08}>
          <article className="group mt-12 overflow-hidden rounded border border-border/60 bg-card transition-all hover:border-primary/30">
            <div className="grid md:grid-cols-[0.8fr_1.2fr]">
              <div className="relative min-h-56 overflow-hidden bg-[radial-gradient(circle_at_30%_30%,rgba(148,162,255,0.18),transparent_45%),radial-gradient(circle_at_70%_70%,rgba(178,149,255,0.16),transparent_45%),#05060a] p-6">
                <div className="absolute inset-x-6 top-6 rounded border border-border/40 bg-black/50 p-4 font-code text-[11px] leading-6">
                  <p className="text-muted-foreground">{"{"}</p>
                  <p className="pl-4 text-emerald-300">
                    &quot;name&quot;: &quot;Sokha&quot;,
                  </p>
                  <p className="pl-4 text-emerald-300">
                    &quot;service&quot;: &quot;AI assistant&quot;,
                  </p>
                  <p className="pl-4 text-emerald-300">
                    &quot;urgency&quot;: &quot;high&quot;
                  </p>
                  <p className="text-muted-foreground">
                    {"}"}
                    <span className="type-caret ml-1 inline-block h-[1.05em] w-[0.5em] translate-y-[0.15em] bg-emerald-300/80" />
                  </p>
                </div>
              </div>

              <div className="flex flex-col p-6 sm:p-8">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="rounded border border-primary/20 bg-primary/5 px-2 py-1 font-mono text-[10px] uppercase tracking-wider text-primary">
                    {labs.experimental}
                  </span>
                  <span className="rounded border border-emerald-500/20 bg-emerald-500/5 px-2 py-1 font-mono text-[10px] text-emerald-500">
                    {labs.costFree}
                  </span>
                </div>
                <h2 className="mt-5 text-2xl font-bold text-foreground">
                  {labs.structuredOutputTitle}
                </h2>
                <p className="mt-3 flex-1 text-sm leading-relaxed text-muted-foreground">
                  {labs.structuredOutputDescription}
                </p>
                <Link
                  href={`/${lang}/labs/structured-output`}
                  className="mt-7 inline-flex min-h-11 w-fit items-center gap-2 rounded bg-primary px-4 font-mono text-xs font-medium text-primary-foreground transition-colors hover:bg-primary/90"
                >
                  {labs.openLab}
                  <span aria-hidden>→</span>
                </Link>
              </div>
            </div>
          </article>
        </AnimateIn>

        <AnimateIn from="up" delay={0.12}>
          <article className="group mt-6 overflow-hidden rounded border border-border/60 bg-card transition-all hover:border-primary/30">
            <div className="grid md:grid-cols-[0.8fr_1.2fr]">
              <div className="relative min-h-56 overflow-hidden bg-[radial-gradient(circle_at_70%_25%,rgba(178,149,255,0.2),transparent_40%),radial-gradient(circle_at_25%_75%,rgba(148,162,255,0.16),transparent_42%),#05060a] p-6">
                <LabVignetteFx className="absolute inset-x-6 top-6 space-y-2 font-code text-[10px]">
                  {[92, 76, 48].map((score, index) => (
                    <div
                      key={score}
                      className="rounded border border-border/40 bg-black/50 p-3"
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-muted-foreground">
                          chunk_0{index + 1}
                        </span>
                        <span className="text-emerald-400">{score}%</span>
                      </div>
                      <div className="mt-2 h-1 overflow-hidden rounded bg-border">
                        <div
                          data-lab-bar
                          className="h-full rounded bg-emerald-400"
                          style={{ width: `${score}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </LabVignetteFx>
              </div>

              <div className="flex flex-col p-6 sm:p-8">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="rounded border border-primary/20 bg-primary/5 px-2 py-1 font-mono text-[10px] uppercase tracking-wider text-primary">
                    {labs.experimental}
                  </span>
                  <span className="rounded border border-emerald-500/20 bg-emerald-500/5 px-2 py-1 font-mono text-[10px] text-emerald-500">
                    {labs.costFree}
                  </span>
                </div>
                <h2 className="mt-5 text-2xl font-bold text-foreground">
                  {labs.ragTitle}
                </h2>
                <p className="mt-3 flex-1 text-sm leading-relaxed text-muted-foreground">
                  {labs.ragDescription}
                </p>
                <Link
                  href={`/${lang}/labs/rag-retrieval`}
                  className="mt-7 inline-flex min-h-11 w-fit items-center gap-2 rounded bg-primary px-4 font-mono text-xs font-medium text-primary-foreground transition-colors hover:bg-primary/90"
                >
                  {labs.openLab}
                  <span aria-hidden>→</span>
                </Link>
              </div>
            </div>
          </article>
        </AnimateIn>

        <AnimateIn from="up" delay={0.16}>
          <article className="group mt-6 overflow-hidden rounded border border-border/60 bg-card transition-all hover:border-primary/30">
            <div className="grid md:grid-cols-[0.8fr_1.2fr]">
              <div className="relative min-h-56 overflow-hidden bg-[radial-gradient(circle_at_30%_20%,rgba(148,162,255,0.16),transparent_40%),radial-gradient(circle_at_75%_75%,rgba(178,149,255,0.22),transparent_45%),#05060a] p-6">
                <LabVignetteFx className="absolute inset-x-6 top-8 grid grid-cols-2 gap-3 font-code">
                  <div
                    data-lab-tile
                    className="rounded border border-emerald-500/30 bg-emerald-500/5 p-4 text-center"
                  >
                    <p className="text-[10px] text-muted-foreground">
                      candidate_A
                    </p>
                    <p className="mt-3 text-3xl font-bold text-emerald-400">
                      100%
                    </p>
                    <p className="mt-2 text-[10px] text-emerald-400">
                      4/4 passed
                    </p>
                  </div>
                  <div
                    data-lab-tile
                    className="rounded border border-red-500/25 bg-red-500/5 p-4 text-center"
                  >
                    <p className="text-[10px] text-muted-foreground">
                      candidate_B
                    </p>
                    <p className="mt-3 text-3xl font-bold text-red-400">20%</p>
                    <p className="mt-2 text-[10px] text-red-400">1/4 passed</p>
                  </div>
                </LabVignetteFx>
              </div>

              <div className="flex flex-col p-6 sm:p-8">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="rounded border border-primary/20 bg-primary/5 px-2 py-1 font-mono text-[10px] uppercase tracking-wider text-primary">
                    {labs.experimental}
                  </span>
                  <span className="rounded border border-emerald-500/20 bg-emerald-500/5 px-2 py-1 font-mono text-[10px] text-emerald-500">
                    {labs.costFree}
                  </span>
                </div>
                <h2 className="mt-5 text-2xl font-bold text-foreground">
                  {labs.evalTitle}
                </h2>
                <p className="mt-3 flex-1 text-sm leading-relaxed text-muted-foreground">
                  {labs.evalDescription}
                </p>
                <Link
                  href={`/${lang}/labs/llm-evals`}
                  className="mt-7 inline-flex min-h-11 w-fit items-center gap-2 rounded bg-primary px-4 font-mono text-xs font-medium text-primary-foreground transition-colors hover:bg-primary/90"
                >
                  {labs.openLab}
                  <span aria-hidden>→</span>
                </Link>
              </div>
            </div>
          </article>
        </AnimateIn>
      </div>
    </main>
  );
}
