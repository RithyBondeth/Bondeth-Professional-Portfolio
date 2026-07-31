"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { BlogCover } from "@/components/blog/blog-cover";
import { Reveal } from "@/components/utils/animations/reveal";
import type { IPost } from "@/utils/interfaces/blog";
import type { ICategoryCount, ITagCount } from "@/utils/functions/blog";
import type { TDictionary, TLocale } from "@/utils/i18n";

/**
 * The writing index.
 *
 * Posts are rows: cover thumbnail, date and reading time, title, standfirst.
 * The two-up card grid forced every excerpt to two clamped lines and every
 * cover to the same 2:1 crop, and still left the last row ragged. A list
 * gives each post the full measure and lines the titles up on one edge.
 *
 * Search and the category filter are plain controls now — a rule you type on
 * and a row of words. Filtering doesn't FLIP the layout: in a single column
 * there is no spatial journey for a row to take, so the animation communicated
 * nothing while adding a GSAP dependency to the page.
 */

type TListPost = Omit<IPost, "content">;

interface IBlogExplorerProps {
  posts: TListPost[];
  categories: ICategoryCount[];
  tags: ITagCount[];
  lang: TLocale;
  labels: TDictionary["blog"];
}

export function BlogExplorer({
  posts,
  categories,
  tags,
  lang,
  labels,
}: IBlogExplorerProps) {
  const [query, setQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");

  const normalized = query.trim().toLowerCase();

  const filtered = useMemo(() => {
    const byCategory =
      selectedCategory === "all"
        ? posts
        : posts.filter((post) => post.category === selectedCategory);

    if (!normalized) return byCategory;
    return byCategory.filter((post) => {
      const haystack = [post.title, post.excerpt, post.category, ...post.tags]
        .join(" ")
        .toLowerCase();
      return haystack.includes(normalized);
    });
  }, [posts, normalized, selectedCategory]);

  const countLabel = `${filtered.length} ${
    filtered.length === 1 ? labels.postSingular : labels.postPlural
  }`;

  const dateFormat = new Intl.DateTimeFormat(lang === "km" ? "km-KH" : "en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

  return (
    <div>
      {/* ── Search ──────────────────────────────────────────────────────── */}
      <div className="relative">
        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={labels.searchPlaceholder}
          aria-label={labels.searchLabel}
          className="field pr-20"
        />
        {query && (
          <button
            type="button"
            onClick={() => setQuery("")}
            className="btn-fx eyebrow absolute right-0 top-1/2 -translate-y-1/2 text-muted-foreground transition-colors hover:text-foreground"
          >
            {labels.clearSearch}
          </button>
        )}
      </div>

      {/* ── Categories ──────────────────────────────────────────────────── */}
      {categories.length > 0 && (
        <div className="mt-8 flex flex-wrap items-center gap-x-5 gap-y-2">
          <button
            type="button"
            onClick={() => setSelectedCategory("all")}
            aria-pressed={selectedCategory === "all"}
            className={`btn-fx eyebrow py-1 transition-colors ${
              selectedCategory === "all"
                ? "text-foreground"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            {labels.allCategories}
            <span className="ml-1.5 opacity-60">{posts.length}</span>
          </button>

          {categories.map((category) => (
            <span key={category.slug} className="flex items-center gap-5">
              <span aria-hidden className="h-3 w-px bg-rule" />
              <button
                type="button"
                onClick={() => setSelectedCategory(category.category)}
                aria-pressed={selectedCategory === category.category}
                className={`btn-fx eyebrow py-1 transition-colors ${
                  selectedCategory === category.category
                    ? "text-foreground"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {category.category}
                <span className="ml-1.5 opacity-60">{category.count}</span>
              </button>
            </span>
          ))}

          {normalized && <span className="eyebrow ml-auto">{countLabel}</span>}
        </div>
      )}

      {/* ── Posts ───────────────────────────────────────────────────────── */}
      {filtered.length > 0 ? (
        <div className="mt-10 border-t border-rule">
          {filtered.map((post, i) => (
            <Reveal
              key={`${selectedCategory}-${normalized}-${post.slug}`}
              delay={Math.min(i, 6) * 50}
            >
              <article className="group">
                <Link
                  href={`/${lang}/blog/${post.slug}`}
                  className="flex items-start gap-5 border-b border-rule py-6 outline-none focus-visible:bg-secondary sm:gap-7 sm:py-7"
                >
                  <BlogCover
                    post={post}
                    className="aspect-[4/3] w-24 shrink-0 rounded-none border border-rule sm:w-32"
                  />

                  <div className="min-w-0 flex-1">
                    <p className="eyebrow">
                      <time dateTime={post.date}>
                        {dateFormat.format(new Date(post.date))}
                      </time>
                      {" · "}
                      {post.readingTime} {labels.minRead}
                      {" · "}
                      {post.category}
                    </p>

                    <h2 className="mt-2 text-lg leading-snug text-foreground transition-colors group-hover:text-marker sm:text-xl">
                      {post.title}
                    </h2>

                    <p className="measure mt-2 line-clamp-2 text-sm leading-relaxed text-muted-foreground">
                      {post.excerpt}
                    </p>

                    {post.tags.length > 0 && (
                      <p className="eyebrow mt-3">
                        {post.tags.slice(0, 4).join(" · ")}
                      </p>
                    )}
                  </div>

                  <span
                    aria-hidden
                    className="hidden shrink-0 self-center text-lg text-muted-foreground transition-transform duration-300 ease-out group-hover:translate-x-1.5 group-hover:text-foreground motion-reduce:transform-none sm:block"
                  >
                    →
                  </span>
                </Link>
              </article>
            </Reveal>
          ))}
        </div>
      ) : (
        <p className="mt-10 border-t border-rule py-20 text-center text-muted-foreground">
          {labels.noResults}
        </p>
      )}

      {/* ── Tags ────────────────────────────────────────────────────────—
          Moved below the posts. Browsing by tag is a secondary path, and three
          stacked filter controls above the content pushed the first post most
          of a screen down. */}
      {tags.length > 0 && (
        <Reveal delay={120}>
          <div className="mt-16 border-t border-rule pt-8">
            <div className="flex flex-wrap items-baseline justify-between gap-4">
              <p className="eyebrow">{labels.browseTags}</p>
              <Link
                href={`/${lang}/blog/tags`}
                className="btn-fx link-wipe text-sm text-muted-foreground hover:text-foreground"
              >
                {labels.viewAllTags}
                <span aria-hidden className="ml-2">
                  →
                </span>
              </Link>
            </div>

            <ul className="mt-5 flex flex-wrap gap-x-5 gap-y-2">
              {tags.map((t) => (
                <li key={t.slug}>
                  <Link
                    href={`/${lang}/blog/tags/${t.slug}`}
                    className="btn-fx link-wipe text-sm text-muted-foreground hover:text-foreground"
                  >
                    {t.tag}
                    <span className="ml-1.5 opacity-60">{t.count}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </Reveal>
      )}
    </div>
  );
}
