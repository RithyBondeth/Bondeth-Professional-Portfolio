/**
 * Server-only: reads GITHUB_TOKEN. Client components may import the types.
 *
 * Pulls the last WEEKS (about six months) of the contribution calendar plus a per-repository
 * breakdown (commits, pull requests, issues, reviews) from GitHub's GraphQL
 * API. The calendar is the source of truth for each day's total; the breakdown
 * only itemises what it can, and the client shows the gap as "other activity".
 */

/* ---------------------------------- Config ---------------------------------- */
const ENDPOINT = "https://api.github.com/graphql";
const WEEKS = 26;
/**
 * The window is fetched as two aliased halves: each repository's contribution
 * list caps at 100 entries, and a half (≤ 91 days) keeps one-per-day commit
 * entries under that cap.
 */
const HALF_DAYS = Math.ceil((WEEKS * 7) / 2);
const REVALIDATE_SECONDS = 60 * 60;
/**
 * GitHub buckets the calendar by the profile's timezone, not UTC. Commit
 * contributions arrive pre-bucketed, but pull requests, issues and reviews carry
 * real timestamps, so they must be bucketed in the same zone to land on the
 * same day as the calendar does.
 */
const CALENDAR_TIME_ZONE = "Asia/Phnom_Penh";
const DAY_MS = 86_400_000;

/* ---------------------------------- Types ----------------------------------- */
export interface IGithubRepoActivity {
  repo: string;
  url: string;
  commits: number;
  pullRequests: number;
  issues: number;
  reviews: number;
}

export interface IGithubActivityDay {
  /** YYYY-MM-DD in CALENDAR_TIME_ZONE. */
  date: string;
  /** Every contribution GitHub counted that day, private ones included. */
  count: number;
  /** Public repositories only, busiest first. */
  repos: IGithubRepoActivity[];
}

export interface IGithubActivity {
  login: string;
  profileUrl: string;
  /** Last calendar day, i.e. "today" for GitHub. */
  endDate: string;
  days: IGithubActivityDay[];
}

interface IContributionNode {
  occurredAt: string;
  commitCount?: number;
}

interface IRepoContributions {
  repository: { nameWithOwner: string; url: string; isPrivate: boolean };
  contributions: { nodes: IContributionNode[] };
}

interface ICollection {
  contributionCalendar: {
    weeks: { contributionDays: { date: string; contributionCount: number }[] }[];
  };
  commitContributionsByRepository: IRepoContributions[];
  pullRequestContributionsByRepository: IRepoContributions[];
  issueContributionsByRepository: IRepoContributions[];
  pullRequestReviewContributionsByRepository: IRepoContributions[];
}

interface IGraphqlResponse {
  data?: { user: { older: ICollection; recent: ICollection } | null };
  errors?: { message: string }[];
}

/* ---------------------------------- Query ----------------------------------- */
const REPO_FIELDS = "repository { nameWithOwner url isPrivate }";
const QUERY = `
  fragment Activity on ContributionsCollection {
    contributionCalendar { weeks { contributionDays { date contributionCount } } }
    commitContributionsByRepository(maxRepositories: 100) {
      ${REPO_FIELDS} contributions(first: 100) { nodes { occurredAt commitCount } }
    }
    pullRequestContributionsByRepository(maxRepositories: 100) {
      ${REPO_FIELDS} contributions(first: 100) { nodes { occurredAt } }
    }
    issueContributionsByRepository(maxRepositories: 100) {
      ${REPO_FIELDS} contributions(first: 100) { nodes { occurredAt } }
    }
    pullRequestReviewContributionsByRepository(maxRepositories: 100) {
      ${REPO_FIELDS} contributions(first: 100) { nodes { occurredAt } }
    }
  }
  query ($login: String!, $from: DateTime!, $split: DateTime!, $splitEnd: DateTime!, $to: DateTime!) {
    user(login: $login) {
      older: contributionsCollection(from: $from, to: $splitEnd) { ...Activity }
      recent: contributionsCollection(from: $split, to: $to) { ...Activity }
    }
  }
`;

/* --------------------------------- Helpers ---------------------------------- */
const calendarDate = new Intl.DateTimeFormat("en-CA", {
  timeZone: CALENDAR_TIME_ZONE,
  year: "numeric",
  month: "2-digit",
  day: "2-digit",
});

const shiftDate = (date: string, days: number) =>
  new Date(Date.parse(`${date}T00:00:00Z`) + days * DAY_MS).toISOString().slice(0, 10);

type TKind = "commits" | "pullRequests" | "issues" | "reviews";

/* --------------------------------- Fetcher ---------------------------------- */
/**
 * Returns null when GITHUB_TOKEN is missing or GitHub is unreachable, so the
 * section simply doesn't render instead of failing the page.
 */
export async function getGithubActivity(login: string): Promise<IGithubActivity | null> {
  const token = process.env.GITHUB_TOKEN;
  if (!token) {
    if (process.env.NODE_ENV === "development") {
      console.warn("[github] GITHUB_TOKEN is not set; the GitHub activity section is hidden.");
    }
    return null;
  }

  // Whole days in a stable window, so the request body — and so the data
  // cache key — only changes once a day.
  const today = calendarDate.format(new Date());
  const from = shiftDate(today, -WEEKS * 7);
  const split = shiftDate(from, HALF_DAYS);

  try {
    const response = await fetch(ENDPOINT, {
      method: "POST",
      headers: { Authorization: `bearer ${token}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        query: QUERY,
        variables: {
          login,
          from: `${from}T00:00:00Z`,
          splitEnd: `${shiftDate(split, -1)}T23:59:59Z`,
          split: `${split}T00:00:00Z`,
          to: `${today}T23:59:59Z`,
        },
      }),
      next: { revalidate: REVALIDATE_SECONDS, tags: ["github-activity"] },
      signal: AbortSignal.timeout(10_000),
    });
    if (!response.ok) throw new Error(`HTTP ${response.status}`);

    const json = (await response.json()) as IGraphqlResponse;
    const user = json.data?.user;
    if (!user) throw new Error(json.errors?.map((e) => e.message).join("; ") ?? "No user");

    // Each half's calendar is padded out to whole weeks, so a day can appear in
    // both; the half that owns the day (by date) is the one counted.
    const days = new Map<string, IGithubActivityDay>();
    for (const [collection, start, end] of [
      [user.older, from, shiftDate(split, -1)],
      [user.recent, split, today],
    ] as const) {
      for (const week of collection.contributionCalendar.weeks) {
        for (const day of week.contributionDays) {
          if (day.date < start || day.date > end) continue;
          days.set(day.date, { date: day.date, count: day.contributionCount, repos: [] });
        }
      }
    }

    const tally = (groups: IRepoContributions[], kind: TKind) => {
      for (const { repository, contributions } of groups) {
        // Private repository names never reach the public page; their
        // contributions still count towards the day via the calendar.
        if (repository.isPrivate) continue;
        for (const node of contributions.nodes) {
          const date =
            kind === "commits"
              ? node.occurredAt.slice(0, 10)
              : calendarDate.format(new Date(node.occurredAt));
          const day = days.get(date);
          if (!day) continue;
          let entry = day.repos.find((item) => item.repo === repository.nameWithOwner);
          if (!entry) {
            entry = {
              repo: repository.nameWithOwner,
              url: repository.url,
              commits: 0,
              pullRequests: 0,
              issues: 0,
              reviews: 0,
            };
            day.repos.push(entry);
          }
          entry[kind] += node.commitCount ?? 1;
        }
      }
    };
    for (const collection of [user.older, user.recent]) {
      tally(collection.commitContributionsByRepository, "commits");
      tally(collection.pullRequestContributionsByRepository, "pullRequests");
      tally(collection.issueContributionsByRepository, "issues");
      tally(collection.pullRequestReviewContributionsByRepository, "reviews");
    }

    const total = (repo: IGithubRepoActivity) =>
      repo.commits + repo.pullRequests + repo.issues + repo.reviews;
    const ordered = [...days.values()].sort((a, b) => a.date.localeCompare(b.date));
    for (const day of ordered) day.repos.sort((a, b) => total(b) - total(a));

    return {
      login,
      profileUrl: `https://github.com/${login}`,
      endDate: ordered.at(-1)?.date ?? today,
      days: ordered,
    };
  } catch (error) {
    console.error("[github] Failed to load contribution activity:", error);
    return null;
  }
}
