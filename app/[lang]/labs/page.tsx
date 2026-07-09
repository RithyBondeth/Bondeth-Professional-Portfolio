import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { AnimateIn } from "@/components/utils/animations/animate-in";
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
    <main className="flex-1 bg-background px-6 pb-24 pt-32 font-sans">
      <div className="mx-auto max-w-5xl">
        <AnimateIn>
          <p className="font-mono text-xs uppercase tracking-[0.25em] text-primary">
            <span className="text-muted-foreground">$</span> ls labs/
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
              <div className="relative min-h-56 overflow-hidden bg-[radial-gradient(circle_at_30%_30%,rgba(34,211,238,0.18),transparent_45%),radial-gradient(circle_at_70%_70%,rgba(139,92,246,0.16),transparent_45%),#050914] p-6">
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
                  <p className="text-muted-foreground">{"}"}</p>
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
      </div>
    </main>
  );
}
