import { getPostBySlug, getAllPosts } from "@/utils/functions/blog";
import { notFound } from "next/navigation";
import { MDXRemote } from "next-mdx-remote/rsc";
import Link from "next/link";
import { AnimateIn } from "@/components/utils/animations/animate-in";
import remarkGfm from "remark-gfm";

interface IBlogPostPageProps {
  params: Promise<{ slug: string }>;
}

/* --------------------------------- Metadata --------------------------------- */
export async function generateStaticParams() {
  const posts = await getAllPosts();
  return posts.map((post) => ({
    slug: post.slug,
  }));
}

export async function generateMetadata({ params }: IBlogPostPageProps) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);
  if (!post) return {};

  return {
    title: `${post.title} — Rithy Bondeth`,
    description: post.excerpt,
  };
}

export default async function BlogPostPage({ params }: IBlogPostPageProps) {
  /* ---------------------------------- Utils --------------------------------- */
  const { slug } = await params;
  const post = await getPostBySlug(slug);

  if (!post) {
    notFound();
  }

  /* -------------------------------- Render UI ------------------------------- */
  return (
    <main className="flex-1 pt-32 pb-24 px-6 bg-background">
      <div className="max-w-3xl mx-auto">
        {/* Back Link Section */}
        <AnimateIn>
          <Link
            href="/blog"
            className="text-xs font-mono text-muted-foreground hover:text-primary transition-colors flex items-center gap-2 mb-8 group"
          >
            <span className="group-hover:-translate-x-1 transition-transform">
              ←
            </span>
            back to all posts
          </Link>
        </AnimateIn>

        {/* Post Header Section */}
        <AnimateIn delay={0.05}>
          <time className="text-xs font-mono text-primary/60 mb-2 block">
            {new Date(post.date).toLocaleDateString("en-US", {
              month: "long",
              day: "numeric",
              year: "numeric",
            })}
          </time>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground mb-8 leading-tight">
            {post.title}
          </h1>
        </AnimateIn>

        {/* Post Content Section */}
        <AnimateIn
          delay={0.1}
          className="prose prose-invert prose-slate max-w-none"
        >
          <MDXRemote
            source={post.content}
            options={{
              mdxOptions: {
                remarkPlugins: [remarkGfm],
              },
            }}
          />
        </AnimateIn>

        {/* Post Footer Section */}
        <footer className="mt-16 pt-8 border-t border-border/40">
          <div className="flex flex-wrap gap-2 mb-8">
            {post.tags.map((tag) => (
              <span
                key={tag}
                className="text-[10px] font-mono text-muted-foreground bg-muted/30 px-2 py-1 rounded border border-border/50"
              >
                #{tag}
              </span>
            ))}
          </div>
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 px-6 py-2.5 bg-card border border-border hover:border-primary/40 rounded text-sm font-mono text-muted-foreground hover:text-foreground transition-all"
          >
            ← View more posts
          </Link>
        </footer>
      </div>
    </main>
  );
}
