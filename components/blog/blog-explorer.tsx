"use client";

import { useLayoutEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { gsap, Flip } from "@/components/utils/animations/gsap";
import { BlogCover } from "@/components/blog/blog-cover";
import type { IPost } from "@/utils/interfaces/blog/blog.interface";
import type { ICategoryCount } from "@/utils/functions/blog/get-categories";
import type { ITagCount } from "@/utils/functions/blog/get-tags";
import type { TDictionary, TLocale } from "@/utils/i18n";

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
  /* -------------------------------- All States ------------------------------- */
  const [query, setQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");

  /* ---------------------------------- Utils --------------------------------- */
  const normalized = query.trim().toLowerCase();

  const gridRef = useRef<HTMLDivElement>(null);
  // Layout snapshot taken just before a filter/search state change; consumed
  // by the layout effect after React re-renders the list.
  const flipState = useRef<ReturnType<typeof Flip.getState> | null>(null);

  const captureFlip = () => {
    if (
      gridRef.current &&
      window.matchMedia("(prefers-reduced-motion: no-preference)").matches
    ) {
      flipState.current = Flip.getState(gridRef.current.children);
    }
  };

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

  /* --------------------------------- Effects -------------------------------- */
  // FLIP the post grid on filter/search changes: surviving cards glide to
  // their new slots, newcomers fade in. Instant swap under reduced motion.
  const visibleKey = filtered.map((post) => post.slug).join("|");
  useLayoutEffect(() => {
    const state = flipState.current;
    flipState.current = null;
    if (!state || !gridRef.current) return;
    Flip.from(state, {
      targets: gridRef.current.children,
      duration: 0.55,
      ease: "smooth",
      stagger: 0.02,
      absolute: true,
      onEnter: (els) =>
        gsap.fromTo(
          els,
          { opacity: 0, y: 16 },
          { opacity: 1, y: 0, duration: 0.4, ease: "smooth" },
        ),
    });
  }, [visibleKey]);

  /* -------------------------------- Render UI ------------------------------- */
  return (
    <div>
      {/* Search Section */}
      <div className="mb-8">
        <div className="relative">
          <span
            aria-hidden
            className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 font-mono text-sm text-muted-foreground"
          >
            /
          </span>
          <input
            type="search"
            value={query}
            onChange={(e) => {
              captureFlip();
              setQuery(e.target.value);
            }}
            placeholder={labels.searchPlaceholder}
            aria-label={labels.searchLabel}
            className="w-full rounded border border-border bg-card/50 py-2.5 pl-8 pr-24 font-mono text-sm text-foreground placeholder:text-muted-foreground/70 focus:border-primary/40 focus:outline-none focus:ring-1 focus:ring-primary/30 transition-colors"
          />
          {query && (
            <button
              type="button"
              onClick={() => {
                captureFlip();
                setQuery("");
              }}
              className="absolute right-3 top-1/2 -translate-y-1/2 font-mono text-xs text-muted-foreground hover:text-primary transition-colors"
            >
              {labels.clearSearch}
            </button>
          )}
        </div>

        {/* Result Count (only while searching) */}
        {normalized && (
          <p className="mt-2 font-mono text-xs text-muted-foreground">
            {countLabel}
          </p>
        )}
      </div>

      {/* Category Filter Section */}
      {categories.length > 0 && (
        <div className="mb-10">
          <p className="mb-3 font-mono text-xs uppercase tracking-[0.25em] text-muted-foreground">
            <span className="text-primary">::</span> {labels.browseCategories}
          </p>
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => {
                captureFlip();
                setSelectedCategory("all");
              }}
              aria-pressed={selectedCategory === "all"}
              aria-label={`${labels.allCategories} (${posts.length})`}
              className="btn-fx btn-fx-chip rounded border border-border bg-card/60 px-3 py-1.5 font-mono text-xs text-muted-foreground hover:text-foreground aria-pressed:border-primary/50 aria-pressed:bg-primary/10 aria-pressed:text-primary"
            >
              {labels.allCategories}
              <span className="ml-1 text-muted-foreground">
                {posts.length}
              </span>
            </button>
            {categories.map((category) => (
              <button
                key={category.slug}
                type="button"
                onClick={() => {
                  captureFlip();
                  setSelectedCategory(category.category);
                }}
                aria-pressed={selectedCategory === category.category}
                aria-label={`${category.category} (${category.count})`}
                className="btn-fx btn-fx-chip rounded border border-border bg-card/60 px-3 py-1.5 font-mono text-xs text-muted-foreground hover:text-foreground aria-pressed:border-primary/50 aria-pressed:bg-primary/10 aria-pressed:text-primary"
              >
                {category.category}
                <span className="ml-1 text-muted-foreground">
                  {category.count}
                </span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Browse-by-tag Section */}
      {tags.length > 0 && (
        <div className="mb-12">
          <div className="mb-3 flex items-center justify-between gap-4">
            <p className="font-mono text-xs uppercase tracking-[0.25em] text-muted-foreground">
              <span className="text-primary">#</span> {labels.browseTags}
            </p>
            <Link
              href={`/${lang}/blog/tags`}
              className="font-mono text-xs text-muted-foreground hover:text-primary transition-colors"
            >
              {labels.viewAllTags} →
            </Link>
          </div>
          <div className="flex flex-wrap gap-2">
            {tags.map((t) => (
              <Link
                key={t.slug}
                href={`/${lang}/blog/tags/${t.slug}`}
                className="rounded border border-primary/10 bg-primary/5 px-2 py-0.5 font-mono text-[10px] text-primary dark:text-primary/70 hover:border-primary/40 hover:bg-primary/10 transition-colors"
              >
                #{t.tag}
                <span className="ml-1 text-muted-foreground dark:text-muted-foreground/60">
                  {t.count}
                </span>
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Post List Section */}
      {filtered.length > 0 ? (
        <div
          ref={gridRef}
          className="grid grid-cols-1 items-stretch gap-5 sm:grid-cols-2 sm:gap-6"
        >
          {filtered.map((post) => (
            <article
              key={post.slug}
              data-flip-id={post.slug}
              className="group relative h-full"
            >
              {/* Hover lift lives on the inner link — the article itself is
                  Flip's target and must not carry CSS transform transitions.

                  The card is now a real surface (border + fill), so it opts
                  back into the shared glow and sheen it used to switch off:
                  those were disabled only because the old bare card would have
                  drawn a floating rectangle around loose text.

                  `h-full` + `flex-col` + `flex-1` on the body make every card
                  in a row end at the same baseline regardless of title length,
                  which the old auto-height cards did not. */}
              <Link
                href={`/${lang}/blog/${post.slug}`}
                className="card-interactive flex h-full flex-col overflow-hidden rounded-lg border border-border/60 bg-card/40"
              >
                <BlogCover
                  post={post}
                  data-card-media
                  className="aspect-2/1 shrink-0 rounded-none border-0 border-b border-border/60"
                />

                <div className="flex flex-1 flex-col p-5">
                  {/* Meta line — date, reading time and category on one row.
                      The category used to be a second stacked pill; folding it
                      in here reclaims a whole line of vertical space. */}
                  <div className="mb-3 flex flex-wrap items-center gap-x-2 gap-y-1 font-mono text-[11px] text-muted-foreground dark:text-muted-foreground/60">
                    <time>
                      {new Date(post.date).toLocaleDateString(
                        lang === "km" ? "km-KH" : "en-US",
                        { month: "short", day: "numeric", year: "numeric" },
                      )}
                    </time>
                    <span aria-hidden className="text-muted-foreground/40">
                      ·
                    </span>
                    <span>
                      {post.readingTime} {labels.minRead}
                    </span>
                    <span className="ml-auto uppercase tracking-[0.16em] text-primary dark:text-primary/70">
                      {post.category}
                    </span>
                  </div>

                  <h2 className="mb-2 text-lg font-bold leading-snug text-foreground transition-colors group-hover:text-primary sm:text-xl">
                    {post.title}
                  </h2>
                  <p className="mb-4 line-clamp-2 text-sm leading-relaxed text-muted-foreground">
                    {post.excerpt}
                  </p>

                  {/* Tags pinned to the bottom of the card body, capped at 3 —
                      posts carry up to five, which wrapped to a second row and
                      left the grid visibly ragged. */}
                  <div className="mt-auto flex flex-wrap items-center gap-1.5 pt-1">
                    {post.tags.slice(0, 3).map((tag) => (
                      <span
                        key={tag}
                        className="rounded border border-border/60 bg-muted/30 px-2 py-0.5 font-mono text-[10px] text-muted-foreground"
                      >
                        #{tag}
                      </span>
                    ))}
                    {post.tags.length > 3 && (
                      <span className="font-mono text-[10px] text-muted-foreground/70">
                        +{post.tags.length - 3}
                      </span>
                    )}
                  </div>
                </div>
              </Link>
            </article>
          ))}
        </div>
      ) : (
        <div className="rounded border border-dashed border-border py-20 text-center">
          <p className="font-mono text-sm text-muted-foreground">
            {labels.noResults}
          </p>
        </div>
      )}
    </div>
  );
}
