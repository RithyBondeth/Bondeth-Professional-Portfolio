import { notFound } from "next/navigation";
import Link from "next/link";
import { getAllTags } from "@/utils/functions/blog";
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
    <main
      id="main-content"
      tabIndex={-1}
      className="flex-1 pt-32 pb-16 sm:pb-24 px-6 font-sans"
    >
      <div className="max-w-4xl mx-auto">
        <AnimateIn>
          <Link
            href={`/${lang}/blog`}
            className="mb-1 inline-flex min-h-10 items-center rounded-full border border-border/60 bg-card px-4 text-xs font-medium text-muted-foreground transition-colors hover:border-primary/30 hover:text-primary"
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
          <p className="text-field-muted-foreground text-sm max-w-2xl mb-12 leading-relaxed">
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
                  className="rounded-full border border-primary/15 bg-primary/5 px-4 py-2 text-sm font-medium text-primary transition-colors hover:border-primary/40 hover:bg-primary/10"
                >
                  #{t.tag}
                  <span className="ml-2 text-muted-foreground">{t.count}</span>
                </Link>
              ))}
            </div>
          ) : (
            <div className="py-20 text-center border border-dashed border-border rounded-lg">
              <p className="text-sm text-muted-foreground">{dict.blog.empty}</p>
            </div>
          )}
        </AnimateIn>
      </div>
    </main>
  );
}
