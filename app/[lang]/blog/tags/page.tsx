import { notFound } from "next/navigation";
import Link from "next/link";
import { getAllTags } from "@/utils/functions/blog/get-tags";
import { AnimateIn } from "@/components/utils/animations/animate-in";
import { hasLocale, getDictionary } from "@/utils/i18n";

interface ITagsPageProps {
  params: Promise<{ lang: string }>;
}

export default async function TagsPage({ params }: ITagsPageProps) {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();

  const dict = getDictionary(lang);
  const tags = await getAllTags(lang);

  return (
    <main id="main-content" tabIndex={-1} className="flex-1 pt-32 pb-24 px-6 bg-background font-sans">
      <div className="max-w-4xl mx-auto">
        <AnimateIn>
          <Link
            href={`/${lang}/blog`}
            className="text-primary font-mono text-xs hover:underline mb-1 inline-block uppercase tracking-[0.25em]"
          >
            ← {dict.blog.backToAll}
          </Link>
        </AnimateIn>

        <AnimateIn delay={0.05}>
          <h1 className="text-4xl sm:text-5xl font-bold text-foreground mt-3 mb-4">
            {dict.blog.allTagsHeading}
          </h1>
        </AnimateIn>

        <AnimateIn delay={0.1}>
          <p className="text-muted-foreground text-sm max-w-2xl mb-12 leading-relaxed">
            {dict.blog.allTagsBlurb}
          </p>
        </AnimateIn>

        <AnimateIn delay={0.15}>
          {tags.length > 0 ? (
            <div className="flex flex-wrap gap-3">
              {tags.map((t) => (
                <Link
                  key={t.slug}
                  href={`/${lang}/blog/tags/${t.slug}`}
                  className="rounded border border-primary/10 bg-primary/5 px-4 py-2 font-mono text-sm text-primary dark:text-primary/70 hover:border-primary/40 hover:bg-primary/10 transition-colors"
                >
                  #{t.tag}
                  <span className="ml-2 text-muted-foreground dark:text-muted-foreground/60">
                    {t.count}
                  </span>
                </Link>
              ))}
            </div>
          ) : (
            <div className="py-20 text-center border border-dashed border-border rounded">
              <p className="text-muted-foreground font-mono text-sm">
                {dict.blog.empty}
              </p>
            </div>
          )}
        </AnimateIn>
      </div>
    </main>
  );
}
