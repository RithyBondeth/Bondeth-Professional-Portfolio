import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { AnimateIn } from "@/components/utils/animations/animate-in";
import { StructuredOutputLab } from "@/components/labs/structured-output-lab";
import { getDictionary, hasLocale } from "@/utils/i18n";

interface IStructuredOutputPageProps {
  params: Promise<{ lang: string }>;
}

export async function generateMetadata({
  params,
}: IStructuredOutputPageProps): Promise<Metadata> {
  const { lang } = await params;
  if (!hasLocale(lang)) return {};
  const { labs } = getDictionary(lang);

  return {
    title: labs.structuredOutputTitle,
    description: labs.structuredOutputDescription,
    alternates: {
      canonical: `/${lang}/labs/structured-output`,
      languages: {
        en: "/en/labs/structured-output",
        km: "/km/labs/structured-output",
        "x-default": "/en/labs/structured-output",
      },
    },
  };
}

export default async function StructuredOutputPage({
  params,
}: IStructuredOutputPageProps) {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();
  const { labs } = getDictionary(lang);

  return (
    <main id="main-content" tabIndex={-1} className="flex-1 bg-background px-6 pb-24 pt-32 font-sans">
      <div className="mx-auto max-w-6xl">
        <AnimateIn>
          <Link
            href={`/${lang}/labs`}
            className="inline-flex min-h-11 items-center gap-2 font-mono text-xs text-muted-foreground transition-colors hover:text-primary"
          >
            <span aria-hidden>←</span>
            {labs.backToLabs}
          </Link>

          <div className="mt-5 flex flex-wrap items-center gap-2">
            <span className="rounded border border-primary/20 bg-primary/5 px-2 py-1 font-mono text-[10px] uppercase tracking-wider text-primary">
              {labs.experimental}
            </span>
            <span className="rounded border border-emerald-500/20 bg-emerald-500/5 px-2 py-1 font-mono text-[10px] text-emerald-500">
              {labs.playground.localMode}
            </span>
          </div>

          <h1 className="mt-5 text-4xl font-bold text-foreground sm:text-5xl">
            {labs.structuredOutputTitle}
          </h1>
          <p className="mt-4 max-w-3xl text-sm leading-relaxed text-muted-foreground">
            {labs.playground.intro}
          </p>
        </AnimateIn>

        <AnimateIn from="up" delay={0.08} className="mt-10">
          <StructuredOutputLab labels={labs.playground} />
        </AnimateIn>

        <AnimateIn from="up" delay={0.12}>
          <section className="mt-10 grid gap-5 sm:grid-cols-3">
            {labs.playground.steps.map((step, index) => (
              <article
                key={step.title}
                className="rounded border border-border/60 bg-card p-5"
              >
                <span className="font-mono text-[10px] text-primary">
                  0{index + 1}
                </span>
                <h2 className="mt-3 text-sm font-semibold text-foreground">
                  {step.title}
                </h2>
                <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
                  {step.description}
                </p>
              </article>
            ))}
          </section>
        </AnimateIn>

        <AnimateIn from="up" delay={0.15}>
          <div className="mt-8 rounded border border-border/60 bg-card p-6">
            <p className="font-mono text-[10px] uppercase tracking-wider text-primary">
              {labs.playground.relatedReading}
            </p>
            <Link
              href={`/${lang}/blog/structured-outputs-tool-calling-llms`}
              className="mt-3 inline-flex min-h-11 items-center text-sm font-semibold text-foreground transition-colors hover:text-primary"
            >
              {labs.playground.relatedArticle} →
            </Link>
          </div>
        </AnimateIn>
      </div>
    </main>
  );
}
