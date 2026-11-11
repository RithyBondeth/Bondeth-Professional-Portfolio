import { Suspense } from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowUpRight, Clock3, MessageSquare, TrendingUp } from "lucide-react";
import { NewsStorySkeleton } from "@/features/news/components/news-story-skeleton";
import {
  getNewsStories,
  type NewsFeed,
} from "@/features/news/server/hacker-news";
import {
  formatCount,
  getDictionary,
  hasLocale,
  type Locale,
} from "@/shared/i18n";
import { cn } from "@/shared/lib/utils";

const feeds = ["top", "latest"] as const;
const hackerNews = "https://news.ycombinator.com";

async function StoryList({ feed, lang }: { feed: NewsFeed; lang: Locale }) {
  const { news } = getDictionary(lang);
  const stories = await getNewsStories(feed).catch(() => null);

  if (!stories) {
    return (
      <div className="rounded-xl border border-border bg-card/50 px-5 py-9">
        <p role="status" className="text-sm text-field-muted-foreground">
          {news.unavailable}
        </p>
        <a
          href={feed === "latest" ? `${hackerNews}/newest` : hackerNews}
          className="mt-3 inline-flex min-h-11 items-center gap-1.5 text-sm font-semibold text-primary underline-offset-4 hover:underline"
        >
          {news.browseSource}
          <ArrowUpRight aria-hidden className="size-4" />
        </a>
      </div>
    );
  }

  const date = new Intl.DateTimeFormat(lang, {
    dateStyle: "medium",
    timeZone: "UTC",
  });

  return (
    <ul className="grid grid-cols-1 gap-3 sm:grid-cols-2">
      {stories.map((story) => {
        const discussionUrl = `${hackerNews}/item?id=${story.id}`;
        const comments = `${formatCount(story.commentCount, lang)} ${story.commentCount === 1 ? news.comment : news.comments}`;

        return (
          <li
            key={story.id}
            className="relative isolate flex min-w-0 flex-col rounded-lg border border-border/75 bg-card px-4 pt-3.5 pb-2 transition-colors hover:border-primary/35 focus-within:border-primary/45"
          >
            <p className="flex flex-wrap items-baseline gap-x-2 gap-y-0.5 text-xs text-field-muted-foreground">
              <bdi className="min-w-0 wrap-anywhere font-mono text-primary">
                {story.source}
              </bdi>
              <time className="shrink-0" dateTime={story.publishedAt}>
                {date.format(new Date(story.publishedAt))}
              </time>
            </p>
            <h2 className="mt-1.5 mb-2 text-base leading-snug font-semibold text-foreground">
              <a
                href={story.url ?? discussionUrl}
                className="group flex items-start justify-between gap-3 outline-none transition-colors after:absolute after:inset-0 after:rounded-lg hover:text-primary focus-visible:text-primary focus-visible:after:ring-2 focus-visible:after:ring-primary focus-visible:after:ring-inset"
              >
                <bdi className="min-w-0 wrap-anywhere">{story.title}</bdi>
                <ArrowUpRight
                  aria-hidden
                  className="mt-0.5 size-4 shrink-0 text-field-muted-foreground group-hover:text-primary group-focus-visible:text-primary"
                />
              </a>
            </h2>
            <a
              href={discussionUrl}
              aria-label={`${comments} · ${story.title} · Hacker News`}
              className="relative z-10 mt-auto -ml-1.5 inline-flex min-h-8 w-fit items-center gap-1.5 rounded-md px-1.5 text-xs text-field-muted-foreground transition-colors hover:bg-muted hover:text-primary focus-visible:outline-2 focus-visible:outline-primary"
            >
              <MessageSquare aria-hidden className="size-3.5" />
              {comments}
            </a>
          </li>
        );
      })}
    </ul>
  );
}

export default async function NewsPage({
  params,
  searchParams,
}: {
  params: Promise<{ lang: string }>;
  searchParams: Promise<{ feed?: string | string[] }>;
}) {
  const [{ lang }, { feed: query }] = await Promise.all([params, searchParams]);
  if (!hasLocale(lang)) notFound();
  const { news } = getDictionary(lang);
  const feed: NewsFeed = query === "latest" ? "latest" : "top";

  return (
    <>
      <nav
        aria-label={news.feedLabel}
        className="mb-6 flex w-fit max-w-full flex-wrap gap-1 rounded-xl border border-border bg-card p-1"
      >
        {feeds.map((option) => (
          <Link
            key={option}
            href={`/${lang}/news${option === "latest" ? "?feed=latest" : ""}`}
            aria-current={option === feed ? "page" : undefined}
            scroll={false}
            className={cn(
              "inline-flex min-h-11 items-center justify-center gap-2 rounded-lg px-4 text-sm font-semibold transition-colors",
              option === feed
                ? "bg-primary/10 text-primary"
                : "text-field-muted-foreground hover:bg-muted hover:text-foreground",
            )}
          >
            {option === "top" ? (
              <TrendingUp aria-hidden className="size-4" />
            ) : (
              <Clock3 aria-hidden className="size-4" />
            )}
            {news[option]}
          </Link>
        ))}
      </nav>
      <Suspense
        key={feed}
        fallback={<NewsStorySkeleton label={news.loading} />}
      >
        <StoryList feed={feed} lang={lang} />
      </Suspense>
    </>
  );
}
