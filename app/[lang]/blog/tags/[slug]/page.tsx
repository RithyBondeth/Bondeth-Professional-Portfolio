import { notFound } from "next/navigation";
import Link from "next/link";
import { getPostsByTag } from "@/utils/functions/blog/get-tags";
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
    }),
  );

  return (
    <main className="flex-1 pt-32 pb-24 px-6 bg-background font-sans">
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
              />
            </AnimateIn>
          ) : (
            <AnimateIn delay={0.15}>
              <div className="py-20 text-center border border-dashed border-border rounded">
                <p className="text-muted-foreground font-mono text-sm">
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
