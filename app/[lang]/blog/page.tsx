import { notFound } from "next/navigation";
import { getAllPosts } from "@/utils/functions/blog";
import { getAllTags } from "@/utils/functions/blog/get-tags";
import { AnimateIn } from "@/components/utils/animations/animate-in";
import { BlogExplorer } from "@/components/blog/blog-explorer";
import { hasLocale, getDictionary } from "@/utils/i18n";

interface IBlogPageProps {
  params: Promise<{ lang: string }>;
}

export default async function BlogPage({ params }: IBlogPageProps) {
  /* ---------------------------------- Utils --------------------------------- */
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();
  const dict = getDictionary(lang);
  const posts = await getAllPosts();
  const tags = await getAllTags();

  // Strip MDX content before crossing to the client — the list only needs metadata.
  const listPosts = posts.map(({ content: _content, ...rest }) => rest);

  /* -------------------------------- Render UI ------------------------------- */
  return (
    <main className="flex-1 pt-32 pb-24 px-6 bg-background font-sans">
      <div className="max-w-4xl mx-auto">
        {/* Heading Section */}
        <AnimateIn>
          <p className="text-primary font-mono text-xs tracking-[0.25em] uppercase mb-1">
            <span className="text-muted-foreground">$</span> ls content/blog
          </p>
        </AnimateIn>

        <AnimateIn delay={0.05}>
          <h1 className="text-4xl sm:text-5xl font-bold text-foreground mt-3 mb-4">
            {dict.blog.heading}
          </h1>
        </AnimateIn>

        <AnimateIn delay={0.1}>
          <p className="text-muted-foreground text-sm max-w-2xl mb-4 leading-relaxed">
            {dict.blog.blurb}
          </p>
        </AnimateIn>

        {/* RSS Link Section */}
        <AnimateIn delay={0.12}>
          <a
            href="/feed.xml"
            className="inline-flex items-center gap-2 text-xs font-mono text-muted-foreground hover:text-primary transition-colors mb-12"
          >
            <span className="text-primary">⚡</span> {dict.blog.subscribeRss}
          </a>
        </AnimateIn>

        {/* Search + Tags + Post List Section */}
        {listPosts.length > 0 ? (
          <AnimateIn delay={0.15}>
            <BlogExplorer
              posts={listPosts}
              tags={tags}
              lang={lang}
              labels={dict.blog}
            />
          </AnimateIn>
        ) : (
          <div className="py-20 text-center border border-dashed border-border rounded">
            <p className="text-muted-foreground font-mono text-sm">
              {dict.blog.empty}
            </p>
          </div>
        )}
      </div>
    </main>
  );
}
