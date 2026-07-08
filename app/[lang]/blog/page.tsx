import Link from "next/link";
import { getAllPosts } from "@/utils/functions/blog";
import { AnimateIn, StaggerIn } from "@/components/utils/animations/animate-in";

export default async function BlogPage() {
  /* ---------------------------------- Utils --------------------------------- */
  const posts = await getAllPosts();

  /* -------------------------------- Render UI ------------------------------- */
  return (
    <main className="flex-1 pt-32 pb-24 px-6 bg-background">
      <div className="max-w-4xl mx-auto">
        {/* Heading Section */}
        <AnimateIn>
          <p className="text-primary font-mono text-xs tracking-[0.25em] uppercase mb-1">
            <span className="text-muted-foreground">$</span> ls content/blog
          </p>
        </AnimateIn>

        <AnimateIn delay={0.05}>
          <h1 className="text-4xl sm:text-5xl font-bold text-foreground mt-3 mb-4">
            Technical Insights
          </h1>
        </AnimateIn>

        <AnimateIn delay={0.1}>
          <p className="text-muted-foreground text-sm max-w-2xl mb-4 leading-relaxed">
            Sharing my journey through software engineering, AI research, and
            building digital products. Expect deep dives, tutorials, and
            occasional rants about clean code.
          </p>
        </AnimateIn>

        {/* RSS Link Section */}
        <AnimateIn delay={0.12}>
          <a
            href="/feed.xml"
            className="inline-flex items-center gap-2 text-xs font-mono text-muted-foreground hover:text-primary transition-colors mb-16"
          >
            <span className="text-primary">⚡</span> Subscribe via RSS
          </a>
        </AnimateIn>

        {/* Post List Section */}
        <StaggerIn className="flex flex-col gap-10" stagger={0.1} delay={0.15}>
          {posts.map((post) => (
            <article key={post.slug} className="group relative">
              <div className="flex flex-col sm:flex-row sm:items-baseline gap-2 sm:gap-6">
                <time className="text-xs font-mono text-muted-foreground/60 sm:w-24 shrink-0">
                  {new Date(post.date).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                  })}
                </time>
                <div className="flex-1">
                  <Link
                    href={`/blog/${post.slug}`}
                    className="block group-hover:translate-x-1 transition-transform"
                  >
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
                          className="text-[10px] font-mono text-primary/70 bg-primary/5 px-2 py-0.5 rounded border border-primary/10"
                        >
                          #{tag}
                        </span>
                      ))}
                    </div>
                  </Link>
                </div>
              </div>
            </article>
          ))}
        </StaggerIn>

        {/* Empty State Section */}
        {posts.length === 0 && (
          <div className="py-20 text-center border border-dashed border-border rounded">
            <p className="text-muted-foreground font-mono text-sm">
              No posts found. Check back soon!
            </p>
          </div>
        )}
      </div>
    </main>
  );
}
