import { notFound } from "next/navigation";
import Link from "next/link";
import { getPostsByTag } from "@/utils/functions/blog";
import { AnimateIn } from "@/components/utils/animations/animate-in";
import { BlogExplorer } from "@/components/blog/blog-explorer";
import { hasLocale, getDictionary } from "@/utils/i18n";

interface ITagPageProps {
  params: Promise<{ lang: string; slug: string }>;
}

export default async function TagPage({ params }: ITagPageProps) {
  const { lang, slug } = await params;
  if (!hasLocale(lang)) notFound();

  const dict = getDictionary(lang);
  const { tag, posts } = await getPostsByTag(slug, lang);

  if (!tag) notFound();

  // Strip MDX content before crossing to the client.
  const listPosts = posts.map(
    ({
      slug,
      title,
      date,
      excerpt,
      category,
      tags,
      cover,
      coverAlt,
      readingTime,
      format,
    }) => ({
      slug,
      title,
      date,
      excerpt,
      category,
      tags,
      cover,
      coverAlt,
      readingTime,
      format,
    }),
  );

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
            {dict.blog.taggedPrefix}{" "}
            <span className="text-primary">#{tag}</span>
          </h1>
        </AnimateIn>

        <div className="mt-12">
          {listPosts.length > 0 ? (
            <AnimateIn delay={0.15}>
              <BlogExplorer
                posts={listPosts}
                categories={[]}
                tags={[]}
                lang={lang}
                labels={dict.blog}
                formatLabels={dict.blogFormats}
              />
            </AnimateIn>
          ) : (
            <AnimateIn delay={0.15}>
              <div className="py-20 text-center border border-dashed border-border rounded-lg">
                <p className="text-sm text-muted-foreground">
                  {dict.blog.empty}
                </p>
              </div>
            </AnimateIn>
          )}
        </div>
      </div>
    </main>
  );
}
