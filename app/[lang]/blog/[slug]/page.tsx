import type { Metadata } from "next";
import {
  getPostBySlug,
  getAllPosts,
  getRelatedPosts,
  getTableOfContents,
  slugifyTag,
} from "@/utils/functions/blog";
import { siteConfig } from "@/utils/constants/portfolio.constant";
import { notFound } from "next/navigation";
import { MDXRemote } from "next-mdx-remote/rsc";
import Link from "next/link";
import { Container } from "@/components/ui/section";
import { PageMain } from "@/components/ui/page-header";
import { Reveal, RevealRule } from "@/components/utils/animations/reveal";
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
    <PageMain lang={lang}>
      <ReadingProgress backToTopLabel={dict.blog.backToTop} />

      <Container>
        {/* Structured Data (JSON-LD) */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(blogPostJsonLd).replace(/</g, "\\u003c"),
          }}
        />

        {/* ── Article head ──────────────────────────────────────────────
            Kicker, then the title as the page's one display element, then
            the byline as a single quiet line between two rules. The measure
            is deliberately narrower than the page: this is running text, and
            it should never be wider than it is comfortable to read. */}
        <header className="measure-wide pt-32 pb-10 sm:pt-40">
          <Reveal>
            <Link
              href={`/${lang}/blog`}
              className="btn-fx link-wipe mb-10 inline-block text-sm text-muted-foreground hover:text-foreground"
            >
              <span aria-hidden className="mr-2">
                ←
              </span>
              {dict.blog.backToAll}
            </Link>
          </Reveal>

          <Reveal delay={40}>
            <p className="eyebrow">{post.category}</p>
          </Reveal>

          <Reveal delay={80}>
            <h1 className="display-lg mt-4 text-balance">{post.title}</h1>
          </Reveal>

          <Reveal delay={140}>
            <p className="mt-6 text-lg leading-relaxed text-muted-foreground">
              {post.excerpt}
            </p>
          </Reveal>

          <Reveal delay={200}>
            <p className="eyebrow mt-8 border-y border-rule py-4">
              {dict.blog.writtenBy} {siteConfig.fullName}
              {" · "}
              <time dateTime={post.date}>
                {new Date(post.date).toLocaleDateString(
                  lang === "km" ? "km-KH" : "en-US",
                  { month: "long", day: "numeric", year: "numeric" },
                )}
              </time>
              {" · "}
              {post.readingTime} {dict.blog.minRead}
            </p>
          </Reveal>

          <Reveal delay={240}>
            <BlogCover post={post} priority className="mt-10 aspect-2/1 rounded-none border border-rule" />
          </Reveal>
        </header>

        <TableOfContents
          items={tableOfContents}
          label={dict.blog.onThisPage}
          mobile
        />

        <div className="grid gap-12 lg:grid-cols-[minmax(0,44rem)_minmax(0,1fr)]">
          <div className="min-w-0">
            <article className="prose max-w-none">
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
            </article>

            {/* ── Article foot ────────────────────────────────────────── */}
            <footer className="mt-20">
              <RevealRule strong />

              <div className="mt-8 flex flex-wrap items-center gap-x-5 gap-y-2">
                {post.tags.map((tag) => (
                  <Link
                    key={tag}
                    href={`/${lang}/blog/tags/${slugifyTag(tag)}`}
                    className="btn-fx link-wipe text-sm text-muted-foreground hover:text-foreground"
                  >
                    {tag}
                  </Link>
                ))}
              </div>

              <div className="mt-10">
                <BlogShare
                  title={post.title}
                  excerpt={post.excerpt}
                  url={articleUrl}
                  labels={dict.blog.share}
                />
              </div>

              {/* Previous / next, set as a running foot rather than two cards. */}
              {(olderPost || newerPost) && (
                <nav
                  aria-label={`${dict.blog.previousPost} / ${dict.blog.nextPost}`}
                  className="mt-14 grid gap-8 border-t border-rule pt-8 sm:grid-cols-2"
                >
                  {olderPost ? (
                    <Link href={`/${lang}/blog/${olderPost.slug}`} className="group">
                      <span className="eyebrow flex items-center gap-2">
                        <ArrowLeft aria-hidden className="size-3" />
                        {dict.blog.previousPost}
                      </span>
                      <span className="mt-2 block text-base leading-snug text-foreground transition-colors group-hover:text-marker">
                        {olderPost.title}
                      </span>
                    </Link>
                  ) : (
                    <span />
                  )}

                  {newerPost && (
                    <Link
                      href={`/${lang}/blog/${newerPost.slug}`}
                      className="group sm:text-right"
                    >
                      <span className="eyebrow flex items-center gap-2 sm:justify-end">
                        {dict.blog.nextPost}
                        <ArrowRight aria-hidden className="size-3" />
                      </span>
                      <span className="mt-2 block text-base leading-snug text-foreground transition-colors group-hover:text-marker">
                        {newerPost.title}
                      </span>
                    </Link>
                  )}
                </nav>
              )}

              {relatedPosts.length > 0 && (
                <section className="mt-16 border-t border-rule pt-8">
                  <p className="eyebrow">{dict.blog.relatedPosts}</p>
                  <ul className="mt-4">
                    {relatedPosts.map((related, i) => (
                      <li key={related.slug}>
                        <Reveal delay={i * 60}>
                          <Link
                            href={`/${lang}/blog/${related.slug}`}
                            className="group flex items-start gap-5 border-b border-rule py-5"
                          >
                            <BlogCover
                              post={related}
                              className="aspect-[4/3] w-20 shrink-0 rounded-none border border-rule"
                            />
                            <div className="min-w-0">
                              <p className="eyebrow">
                                <time dateTime={related.date}>
                                  {new Date(related.date).toLocaleDateString(
                                    lang === "km" ? "km-KH" : "en-US",
                                    {
                                      month: "short",
                                      day: "numeric",
                                      year: "numeric",
                                    },
                                  )}
                                </time>
                                {" · "}
                                {related.readingTime} {dict.blog.minRead}
                              </p>
                              <h3 className="mt-1.5 text-base leading-snug text-foreground transition-colors group-hover:text-marker">
                                {related.title}
                              </h3>
                            </div>
                          </Link>
                        </Reveal>
                      </li>
                    ))}
                  </ul>
                </section>
              )}

              <Link
                href={`/${lang}/blog`}
                className="btn-fx link-wipe mt-12 inline-block"
              >
                <span aria-hidden className="mr-2">
                  ←
                </span>
                {dict.blog.viewMore}
              </Link>
            </footer>
          </div>

          <TableOfContents items={tableOfContents} label={dict.blog.onThisPage} />
        </div>
      </Container>
    </PageMain>
  );
}
