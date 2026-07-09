"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { BlogCover } from "@/components/blog/blog-cover";
import type { IPost } from "@/utils/interfaces/blog/blog.interface";
import type { ITagCount } from "@/utils/functions/blog/get-tags";
import type { TDictionary, TLocale } from "@/utils/i18n";

type TListPost = Omit<IPost, "content">;

interface IBlogExplorerProps {
  posts: TListPost[];
  tags: ITagCount[];
  lang: TLocale;
  labels: TDictionary["blog"];
}

export function BlogExplorer({ posts, tags, lang, labels }: IBlogExplorerProps) {
  /* -------------------------------- All States ------------------------------- */
  const [query, setQuery] = useState("");

  /* ---------------------------------- Utils --------------------------------- */
  const normalized = query.trim().toLowerCase();

  const filtered = useMemo(() => {
    if (!normalized) return posts;
    return posts.filter((post) => {
      const haystack = [post.title, post.excerpt, ...post.tags]
        .join(" ")
        .toLowerCase();
      return haystack.includes(normalized);
    });
  }, [posts, normalized]);

  const countLabel = `${filtered.length} ${
    filtered.length === 1 ? labels.postSingular : labels.postPlural
  }`;

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
            onChange={(e) => setQuery(e.target.value)}
            placeholder={labels.searchPlaceholder}
            aria-label={labels.searchLabel}
            className="w-full rounded border border-border bg-card/50 py-2.5 pl-8 pr-24 font-mono text-sm text-foreground placeholder:text-muted-foreground/70 focus:border-primary/40 focus:outline-none focus:ring-1 focus:ring-primary/30 transition-colors"
          />
          {query && (
            <button
              type="button"
              onClick={() => setQuery("")}
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
        <div className="grid grid-cols-1 gap-x-8 gap-y-12 sm:grid-cols-2">
          {filtered.map((post) => (
            <article key={post.slug} className="group relative">
              <Link href={`/${lang}/blog/${post.slug}`} className="block">
                <BlogCover
                  post={post}
                  className="aspect-[2/1] mb-4 transition-colors group-hover:border-primary/40"
                />
                <time className="mb-2 block font-mono text-xs text-muted-foreground dark:text-muted-foreground/60">
                  {new Date(post.date).toLocaleDateString(
                    lang === "km" ? "km-KH" : "en-US",
                    { month: "short", day: "numeric", year: "numeric" },
                  )}
                </time>
                <h2 className="mb-2 text-xl font-bold text-foreground transition-colors group-hover:text-primary">
                  {post.title}
                </h2>
                <p className="mb-4 line-clamp-2 text-sm leading-relaxed text-muted-foreground">
                  {post.excerpt}
                </p>
                <div className="flex flex-wrap gap-2">
                  {post.tags.map((tag) => (
                    <span
                      key={tag}
                      className="rounded border border-primary/10 bg-primary/5 px-2 py-0.5 font-mono text-[10px] text-primary dark:text-primary/70"
                    >
                      #{tag}
                    </span>
                  ))}
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
