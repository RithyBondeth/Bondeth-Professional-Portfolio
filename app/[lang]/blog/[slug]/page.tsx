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
import { TableOfContents } from "@/components/blog/table-of-contents";
import { BlogShare } from "@/components/blog/blog-share";
import { ReadingProgress } from "@/components/blog/reading-progress";
import rehypePrettyCode, {
  type Options as PrettyCodeOptions,
} from "rehype-pretty-code";
import remarkGfm from "remark-gfm";
import { hasLocale, getDictionary, locales } from "@/utils/i18n";
import { getTableOfContents } from "@/utils/functions/blog/get-table-of-contents";
import { slugifyTag } from "@/utils/functions/blog/slugify-tag";
import { ArrowLeft, ArrowRight } from "lucide-react";

interface IBlogPostPageProps {
  params: Promise<{ lang: string; slug: string }>;
}

const prettyCodeOptions: PrettyCodeOptions = {
  theme: "github-dark",
  keepBackground: false,
  defaultLang: {
    block: "plaintext",
    inline: "plaintext",
  },
};

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

  const relatedPosts = await getRelatedPosts(post.slug, post.tags, lang);
  const allPosts = await getAllPosts(lang);
  const currentIndex = allPosts.findIndex((item) => item.slug === post.slug);
  const newerPost = currentIndex > 0 ? allPosts[currentIndex - 1] : null;
  const olderPost =
    currentIndex >= 0 && currentIndex < allPosts.length - 1
      ? allPosts[currentIndex + 1]
      : null;
  const tableOfContents = getTableOfContents(post.content);
  const articleUrl = `${siteConfig.url}/${lang}/blog/${post.slug}`;

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
    <main id="main-content" tabIndex={-1} className="flex-1 pt-32 pb-24 px-6 bg-background font-sans">
      <ReadingProgress backToTopLabel={dict.blog.backToTop} />
      <div className="mx-auto max-w-6xl">
        {/* Structured Data (JSON-LD) */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(blogPostJsonLd).replace(/</g, "\\u003c"),
          }}
        />

        {/* Back Link Section */}
        <AnimateIn className="max-w-3xl">
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

        {/* Post Header Section — editorial order: kicker → title → byline →
            cover. The category leads as a plain uppercase kicker (the pill it
            used to sit in fought the title for weight), the title is the hero,
            and the meta reads as one quiet byline row underneath. */}
        <AnimateIn delay={0.05} className="max-w-3xl">
          <p className="mb-4 font-mono text-xs uppercase tracking-[0.25em] text-primary dark:text-primary/70">
            {post.category}
          </p>
          <h1 className="mb-5 text-3xl font-bold leading-tight text-foreground sm:text-4xl lg:text-5xl">
            {post.title}
          </h1>
          <p className="text-base leading-relaxed text-muted-foreground">
            {post.excerpt}
          </p>

          <div className="mt-6 flex flex-wrap items-center gap-x-3 gap-y-2 border-y border-border/40 py-4 font-mono text-xs text-muted-foreground dark:text-muted-foreground/70">
            <span className="text-foreground">
              {dict.blog.writtenBy}{" "}
              <span className="font-semibold">{siteConfig.name}</span>
            </span>
            <span aria-hidden className="text-muted-foreground/40">
              ·
            </span>
            <time>
              {new Date(post.date).toLocaleDateString(
                lang === "km" ? "km-KH" : "en-US",
                { month: "long", day: "numeric", year: "numeric" },
              )}
            </time>
            <span aria-hidden className="text-muted-foreground/40">
              ·
            </span>
            <span>
              {post.readingTime} {dict.blog.minRead}
            </span>
          </div>
        </AnimateIn>

        {/* Cover Section — sits under the byline, framing the article rather
            than shouting above the title. */}
        <AnimateIn delay={0.1} className="mt-8 mb-10 max-w-3xl">
          <BlogCover post={post} priority className="aspect-2/1" />
        </AnimateIn>

        <TableOfContents
          items={tableOfContents}
          label={dict.blog.onThisPage}
          mobile
        />

        <div className="grid gap-12 lg:grid-cols-[minmax(0,768px)_minmax(0,1fr)]">
          <div className="min-w-0">
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
                    rehypePlugins: [[rehypePrettyCode, prettyCodeOptions]],
                  },
                }}
              />
            </AnimateIn>

            {/* Post Footer Section */}
            <footer className="mt-16 border-t border-border/40 pt-8">
              <div className="mb-10 flex flex-wrap items-center gap-2">
                {post.tags.map((tag) => (
                  <Link
                    key={tag}
                    href={`/${lang}/blog/tags/${slugifyTag(tag)}`}
                    className="inline-flex min-h-9 items-center rounded border border-border/50 bg-muted/30 px-3 py-1 font-mono text-[11px] text-muted-foreground transition-colors hover:border-primary/40 hover:text-primary"
                  >
                    #{tag}
                  </Link>
                ))}
              </div>

              <BlogShare
                title={post.title}
                excerpt={post.excerpt}
                url={articleUrl}
                labels={dict.blog.share}
              />

              {(olderPost || newerPost) && (
                <nav
                  aria-label={`${dict.blog.previousPost} / ${dict.blog.nextPost}`}
                  className="mb-12 grid gap-3 sm:grid-cols-2"
                >
                  {olderPost ? (
                    <Link
                      href={`/${lang}/blog/${olderPost.slug}`}
                      className="group rounded-lg border border-border/60 bg-card/40 p-4 transition-colors hover:border-primary/40"
                    >
                      <span className="mb-2 flex items-center gap-2 font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
                        <ArrowLeft aria-hidden className="size-3.5" />
                        {dict.blog.previousPost}
                      </span>
                      <span className="line-clamp-2 text-sm font-semibold leading-snug text-foreground group-hover:text-primary">
                        {olderPost.title}
                      </span>
                    </Link>
                  ) : (
                    <span />
                  )}
                  {newerPost && (
                    <Link
                      href={`/${lang}/blog/${newerPost.slug}`}
                      className="group rounded-lg border border-border/60 bg-card/40 p-4 text-right transition-colors hover:border-primary/40"
                    >
                      <span className="mb-2 flex items-center justify-end gap-2 font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
                        {dict.blog.nextPost}
                        <ArrowRight aria-hidden className="size-3.5" />
                      </span>
                      <span className="line-clamp-2 text-sm font-semibold leading-snug text-foreground group-hover:text-primary">
                        {newerPost.title}
                      </span>
                    </Link>
                  )}
                </nav>
              )}

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
                            className="aspect-2/1 mb-3 transition-colors group-hover:border-primary/40"
                          />
                          <div className="flex items-center gap-2 text-[10px] font-mono text-muted-foreground dark:text-muted-foreground/60 mb-1.5">
                            <time>
                              {new Date(related.date).toLocaleDateString(
                                lang === "km" ? "km-KH" : "en-US",
                                {
                                  month: "short",
                                  day: "numeric",
                                  year: "numeric",
                                },
                              )}
                            </time>
                            <span
                              aria-hidden
                              className="text-muted-foreground/40"
                            >
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

          <TableOfContents
            items={tableOfContents}
            label={dict.blog.onThisPage}
          />
        </div>
      </div>
    </main>
  );
}
