import type { Metadata } from "next";
import {
  getPostBySlug,
  getAllPosts,
  getRelatedPosts,
} from "@/utils/functions/blog";
import { siteConfig } from "@/utils/constants/portfolio.constant";
import { notFound } from "next/navigation";
import { MDXRemote } from "next-mdx-remote/rsc";
import Link from "next/link";
import { AnimateIn } from "@/components/utils/animations/animate-in";
import { BlogCover } from "@/components/blog/blog-cover";
import { mdxComponents } from "@/components/blog/mdx-components";
import remarkGfm from "remark-gfm";
import { hasLocale, getDictionary, locales } from "@/utils/i18n";

interface IBlogPostPageProps {
  params: Promise<{ lang: string; slug: string }>;
}

/* --------------------------------- Metadata --------------------------------- */
export async function generateStaticParams() {
  const postsByLocale = await Promise.all(
    locales.map(async (lang) => {
      const posts = await getAllPosts(lang);
      return posts.map((post) => ({
        lang,
        slug: post.slug,
      }));
    }),
  );

  return postsByLocale.flat();
}

export async function generateMetadata({
  params,
}: IBlogPostPageProps): Promise<Metadata> {
  const { slug, lang } = await params;
  if (!hasLocale(lang)) return {};

  const post = await getPostBySlug(slug, lang);
  if (!post) return {};

  return {
    title: post.title,
    description: post.excerpt,
    alternates: {
      canonical: `/${lang}/blog/${slug}`,
      languages: {
        en: `/en/blog/${slug}`,
        km: `/km/blog/${slug}`,
        "x-default": `/en/blog/${slug}`,
      },
      types: {
        "application/rss+xml": "/feed.xml",
      },
    },
    openGraph: {
      type: "article",
      url: `/${lang}/blog/${slug}`,
      title: post.title,
      description: post.excerpt,
      publishedTime: post.date,
      authors: [siteConfig.name],
      tags: post.tags,
      ...(post.cover ? { images: [{ url: post.cover }] } : {}),
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description: post.excerpt,
      ...(post.cover ? { images: [post.cover] } : {}),
    },
  };
}

export default async function BlogPostPage({ params }: IBlogPostPageProps) {
  /* ---------------------------------- Utils --------------------------------- */
  const { lang, slug } = await params;
  if (!hasLocale(lang)) notFound();
  const dict = getDictionary(lang);
  const post = await getPostBySlug(slug, lang);

  if (!post) {
    notFound();
  }

  const relatedPosts = await getRelatedPosts(
    post.slug,
    post.tags,
    lang,
  );

  /* ------------------------------ Structured Data ----------------------------- */
  const blogPostJsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.excerpt,
    datePublished: post.date,
    keywords: post.tags.join(", "),
    url: `${siteConfig.url}/${lang}/blog/${slug}`,
    author: {
      "@type": "Person",
      name: siteConfig.name,
      url: siteConfig.url,
    },
  };

  /* -------------------------------- Render UI ------------------------------- */
  return (
    <main className="flex-1 pt-32 pb-24 px-6 bg-background font-sans">
      <div className="max-w-3xl mx-auto">
        {/* Structured Data (JSON-LD) */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(blogPostJsonLd).replace(/</g, "\\u003c"),
          }}
        />

        {/* Back Link Section */}
        <AnimateIn>
          <Link
            href={`/${lang}/blog`}
            className="text-xs font-mono text-muted-foreground hover:text-primary transition-colors flex items-center gap-2 mb-8 group"
          >
            <span className="group-hover:-translate-x-1 transition-transform">
              ←
            </span>
            {dict.blog.backToAll}
          </Link>
        </AnimateIn>

        {/* Cover Section */}
        <AnimateIn delay={0.05}>
          <BlogCover
            post={post}
            priority
            className="aspect-[2/1] sm:aspect-[5/2] mb-8"
          />
        </AnimateIn>

        {/* Post Header Section */}
        <AnimateIn delay={0.1}>
          <div className="flex items-center gap-3 text-xs font-mono text-primary dark:text-primary/60 mb-2">
            <time>
              {new Date(post.date).toLocaleDateString(
                lang === "km" ? "km-KH" : "en-US",
                {
                  month: "long",
                  day: "numeric",
                  year: "numeric",
                },
              )}
            </time>
            <span aria-hidden className="text-muted-foreground/40">
              ·
            </span>
            <span className="text-muted-foreground dark:text-muted-foreground/60">
              {post.readingTime} {dict.blog.minRead}
            </span>
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground mb-8 leading-tight">
            {post.title}
          </h1>
        </AnimateIn>

        {/* Post Content Section */}
        <AnimateIn
          delay={0.1}
          className="prose prose-slate dark:prose-invert max-w-none prose-pre:font-code prose-code:font-code"
        >
          <MDXRemote
            source={post.content}
            components={mdxComponents}
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

          {/* Related Posts Section */}
          {relatedPosts.length > 0 && (
            <AnimateIn className="mb-10">
              <p className="text-primary font-mono text-xs tracking-[0.25em] uppercase mb-6">
                <span className="text-muted-foreground">{"//"}</span>{" "}
                {dict.blog.relatedPosts}
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                {relatedPosts.map((related) => (
                  <article key={related.slug} className="group">
                    <Link
                      href={`/${lang}/blog/${related.slug}`}
                      className="block"
                    >
                      <BlogCover
                        post={related}
                        className="aspect-[2/1] mb-3 transition-colors group-hover:border-primary/40"
                      />
                      <div className="flex items-center gap-2 text-[10px] font-mono text-muted-foreground dark:text-muted-foreground/60 mb-1.5">
                        <time>
                          {new Date(related.date).toLocaleDateString(
                            lang === "km" ? "km-KH" : "en-US",
                            { month: "short", day: "numeric", year: "numeric" },
                          )}
                        </time>
                        <span aria-hidden className="text-muted-foreground/40">
                          ·
                        </span>
                        <span>
                          {related.readingTime} {dict.blog.minRead}
                        </span>
                      </div>
                      <h3 className="text-sm font-bold text-foreground group-hover:text-primary transition-colors leading-snug line-clamp-2">
                        {related.title}
                      </h3>
                    </Link>
                  </article>
                ))}
              </div>
            </AnimateIn>
          )}

          <Link
            href={`/${lang}/blog`}
            className="inline-flex items-center gap-2 px-6 py-2.5 bg-card border border-border hover:border-primary/40 rounded text-sm font-mono text-muted-foreground hover:text-foreground transition-all"
          >
            ← {dict.blog.viewMore}
          </Link>
        </footer>
      </div>
    </main>
  );
}
