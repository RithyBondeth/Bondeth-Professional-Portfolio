import Link from "next/link";
import { notFound } from "next/navigation";
import { getAllPosts } from "@/utils/functions/blog";
import { AnimateIn, StaggerIn } from "@/components/utils/animations/animate-in";
import { BlogCover } from "@/components/blog/blog-cover";
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
            className="inline-flex items-center gap-2 text-xs font-mono text-muted-foreground hover:text-primary transition-colors mb-16"
          >
            <span className="text-primary">⚡</span> {dict.blog.subscribeRss}
          </a>
        </AnimateIn>

        {/* Post List Section */}
        <StaggerIn
          className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-12"
          stagger={0.1}
          delay={0.15}
        >
          {posts.map((post) => (
            <article key={post.slug} className="group relative">
              <Link href={`/${lang}/blog/${post.slug}`} className="block">
                <BlogCover
                  post={post}
                  className="aspect-[2/1] mb-4 transition-colors group-hover:border-primary/40"
                />
                <time className="text-xs font-mono text-muted-foreground dark:text-muted-foreground/60 block mb-2">
                  {new Date(post.date).toLocaleDateString(
                    lang === "km" ? "km-KH" : "en-US",
                    {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    },
                  )}
                </time>
                <h2 className="text-xl font-bold text-foreground group-hover:text-primary transition-colors mb-2">
                  {post.title}
                </h2>
                <p className="text-muted-foreground text-sm leading-relaxed mb-4 line-clamp-2">
                  {post.excerpt}
                </p>
                <div className="flex flex-wrap gap-2">
                  {post.tags.map((tag) => (
                    <span
                      key={tag}
                      className="text-[10px] font-mono text-primary dark:text-primary/70 bg-primary/5 px-2 py-0.5 rounded border border-primary/10"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              </Link>
            </article>
          ))}
        </StaggerIn>

        {/* Empty State Section */}
        {posts.length === 0 && (
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
