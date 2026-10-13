import { ArrowUpRight } from "lucide-react";
import { AnimateIn } from "@/components/utils/animations/animate-in";
import { SectionHeading } from "@/components/landing/section-heading";
import { GitHubIcon } from "@/components/utils/icons";
import { siteConfig } from "@/utils/constants/portfolio.constant";
import { getGithubActivity } from "@/utils/functions/github/get-github-activity";
import { getDictionary, type TLocale } from "@/utils/i18n";
import { GithubCity } from "./github-city";

const GITHUB_LOGIN = new URL(siteConfig.github).pathname.split("/")[1];
const TOP_REPOS = 3;

/**
 * Twelve weeks of GitHub contributions as an isometric city. Renders nothing
 * when GITHUB_TOKEN is missing or GitHub is down — it is supporting evidence,
 * never worth a broken section.
 */
export default async function LandingGithub(props: { lang: TLocale }) {
  const { lang } = props;
  const activity = await getGithubActivity(GITHUB_LOGIN);
  if (!activity) return null;

  const { github } = getDictionary(lang);
  const number = new Intl.NumberFormat("en-US");
  const contributionWord = (count: number) =>
    count === 1 ? github.card.contribution.one : github.card.contribution.other;

  /* ------------------------------ Scale the city ----------------------------- */
  // Colour levels split the active days into quartiles, so a heavy month and a
  // quiet one both use the whole ramp. Heights follow the 90th percentile, so a
  // single huge day caps out instead of flattening every other building.
  const counts = activity.days
    .map((day) => day.count)
    .filter(Boolean)
    .sort((a, b) => a - b);
  const quantile = (q: number) =>
    counts.length ? counts[Math.min(counts.length - 1, Math.floor(q * counts.length))] : 1;
  const first = Math.max(2, quantile(0.25));
  const second = Math.max(first + 1, quantile(0.5));
  const levels = [first, second, Math.max(second + 1, quantile(0.75))] as const;
  const heightUnit = Math.max(1, quantile(0.9) / 3.5);

  /* -------------------------------- Top repos -------------------------------- */
  const repoTotals = new Map<string, { repo: string; url: string; count: number }>();
  for (const day of activity.days) {
    for (const repo of day.repos) {
      const entry = repoTotals.get(repo.repo) ?? { repo: repo.repo, url: repo.url, count: 0 };
      entry.count += repo.commits + repo.pullRequests + repo.issues + repo.reviews;
      repoTotals.set(repo.repo, entry);
    }
  }
  const topRepos = [...repoTotals.values()]
    .sort((a, b) => b.count - a.count)
    .slice(0, TOP_REPOS);

  return (
    <section
      id="github"
      className="relative isolate overflow-clip px-6 py-16 sm:py-20 lg:py-24"
    >
      <div className="mx-auto grid max-w-6xl gap-10 lg:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)] lg:items-center lg:gap-14">
        <div className="min-w-0">
          <AnimateIn from="left">
            <p className="font-mono text-xs uppercase tracking-[0.25em] text-primary">
              {github.eyebrow}
            </p>
          </AnimateIn>
          <SectionHeading
            section="github"
            className="mt-3 text-3xl font-bold text-foreground sm:text-4xl lg:text-5xl"
          >
            {github.heading}
          </SectionHeading>
          <AnimateIn from="up" distance={24} delay={0.1}>
            <p className="mt-4 max-w-xl text-sm leading-7 text-field-muted-foreground">
              {github.blurb}
            </p>
          </AnimateIn>

          {topRepos.length > 0 && (
            <AnimateIn from="up" distance={24} delay={0.15}>
              <h3 className="mt-8 font-mono text-xs uppercase tracking-[0.22em] text-field-muted-foreground">
                {github.topReposLabel}
              </h3>
              <ol className="mt-3 divide-y divide-border/60 border-y border-border/60">
                {topRepos.map((repo, index) => (
                  <li key={repo.repo}>
                    <a
                      href={repo.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group flex min-h-11 items-center justify-between gap-4 py-2.5 text-sm"
                    >
                      <span className="flex min-w-0 items-center gap-3">
                        <span className="font-mono text-[10px] tracking-[0.2em] text-primary">
                          0{index + 1}
                        </span>
                        <span className="truncate font-medium text-foreground transition-colors group-hover:text-primary">
                          {repo.repo.replace(`${GITHUB_LOGIN}/`, "")}
                        </span>
                      </span>
                      <span className="shrink-0 font-mono text-xs tabular-nums text-field-muted-foreground">
                        {number.format(repo.count)} {contributionWord(repo.count)}
                      </span>
                    </a>
                  </li>
                ))}
              </ol>
            </AnimateIn>
          )}

          <AnimateIn from="up" distance={24} delay={0.2}>
            <a
              href={activity.profileUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-fx btn-fx-outline mt-7 inline-flex min-h-10 items-center gap-2 rounded-full border border-border/70 bg-background/55 px-4 text-xs font-semibold text-foreground backdrop-blur-sm hover:border-primary/50 hover:text-primary"
            >
              <GitHubIcon aria-hidden className="size-3.5" />
              {github.profileCta}
              <ArrowUpRight aria-hidden data-btn-arrow className="size-3.5" />
            </a>
          </AnimateIn>
        </div>

        <AnimateIn from="up" distance={32} delay={0.1} className="min-w-0">
          <GithubCity
            days={activity.days}
            endDate={activity.endDate}
            login={GITHUB_LOGIN}
            levels={levels}
            heightUnit={heightUnit}
            copy={github.card}
            lang={lang}
          />
        </AnimateIn>
      </div>
    </section>
  );
}
