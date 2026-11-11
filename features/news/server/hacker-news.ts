import "server-only";

import { unstable_cache } from "next/cache";

export type NewsFeed = "top" | "latest";

const endpoints = { top: "topstories", latest: "newstories" };
const apiUrl = "https://hacker-news.firebaseio.com/v0";
const storyLimit = 12;
const candidateLimit = 18;
const minimumStoriesOnPartialFailure = 8;
const refreshInterval = 15 * 60;
const requestTimeout = 3500;

interface NewsStory {
  id: number;
  title: string;
  publishedAt: string;
  url: string | null;
  source: string;
  commentCount: number;
}

async function getJson(path: string, signal: AbortSignal): Promise<unknown> {
  const response = await fetch(`${apiUrl}/${path}.json`, {
    cache: "no-store",
    signal,
  });
  if (!response.ok) {
    throw new Error(`Hacker News returned HTTP ${response.status}`);
  }
  return response.json();
}

function parseArticleUrl(value: unknown): URL | null {
  if (typeof value !== "string") return null;
  try {
    const url = new URL(value);
    return url.protocol === "https:" || url.protocol === "http:" ? url : null;
  } catch {
    return null;
  }
}

async function getStory(
  id: number,
  signal: AbortSignal,
): Promise<NewsStory | null> {
  const item = await getJson(`item/${id}`, signal);
  if (item === null) return null;
  if (!item || typeof item !== "object" || !("type" in item)) {
    throw new Error("Invalid Hacker News item");
  }
  if (
    item.type !== "story" ||
    ("deleted" in item && item.deleted) ||
    ("dead" in item && item.dead)
  ) {
    return null;
  }
  if (
    !("title" in item) ||
    typeof item.title !== "string" ||
    !item.title.trim() ||
    !("time" in item) ||
    typeof item.time !== "number"
  ) {
    throw new Error("Invalid Hacker News story");
  }

  const url = parseArticleUrl("url" in item ? item.url : null);
  return {
    id,
    title: item.title,
    publishedAt: new Date(item.time * 1000).toISOString(),
    url: url?.href ?? null,
    source: url?.hostname.replace(/^www\./, "") ?? "Hacker News",
    commentCount:
      "descendants" in item && typeof item.descendants === "number"
        ? item.descendants
        : 0,
  };
}

async function fetchFeed(feed: NewsFeed): Promise<NewsStory[]> {
  // Share one deadline across the ID request and all item requests.
  const signal = AbortSignal.timeout(requestTimeout);
  const payload = await getJson(endpoints[feed], signal);
  if (!Array.isArray(payload)) throw new Error("Invalid Hacker News feed");

  const ids = [
    ...new Set(
      payload.filter(
        (id): id is number =>
          typeof id === "number" && Number.isSafeInteger(id) && id > 0,
      ),
    ),
  ].slice(0, candidateLimit);
  const results = await Promise.allSettled(
    ids.map((id) => getStory(id, signal)),
  );
  const stories = results.flatMap((result) =>
    result.status === "fulfilled" && result.value ? [result.value] : [],
  );

  // Throw on widespread failure so revalidation keeps the last good snapshot.
  if (
    stories.length === 0 ||
    (stories.length < minimumStoriesOnPartialFailure &&
      results.some((result) => result.status === "rejected"))
  ) {
    throw new Error("Hacker News returned too few usable stories");
  }

  return stories.slice(0, storyLimit);
}

const pendingFeeds = new Map<NewsFeed, Promise<NewsStory[]>>();

// Both locales share the same cached feed. Coalesce overlapping cache fills
// within a server process so a burst of visits only starts one upstream batch.
export const getNewsStories = unstable_cache(
  (feed: NewsFeed) => {
    const pending = pendingFeeds.get(feed);
    if (pending) return pending;

    const refresh = fetchFeed(feed).finally(() => pendingFeeds.delete(feed));
    pendingFeeds.set(feed, refresh);
    return refresh;
  },
  ["hacker-news-feed-v1"],
  { revalidate: refreshInterval },
);
