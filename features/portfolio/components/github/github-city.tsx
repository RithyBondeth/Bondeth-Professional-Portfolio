"use client";

import { useMemo, type CSSProperties } from "react";
import {
  FocusCity,
  type FocusDateStyle,
  type FocusDay,
  type FocusSession,
} from "@/shared/components/ui/focus-city";
import { GitHubIcon } from "@/shared/components/icons/icons";
import type { GithubActivityDay } from "@/features/portfolio/server/get-github-activity";
import type { Dictionary, Locale } from "@/shared/i18n";

type Copy = Dictionary["github"]["card"];
type PluralForms = { one: string; other: string };

/**
 * Re-skins FocusCity with the site's tokens instead of its stock greys and
 * greens. Inline custom properties beat the component's own stylesheet, and
 * every token here already flips under [data-theme="dark"].
 */
const SITE_THEME = {
  "--fc-surface": "var(--card)",
  "--fc-ink": "var(--card-foreground)",
  "--fc-muted": "var(--muted-foreground)",
  "--fc-border": "var(--border)",
  "--fc-hover": "var(--muted)",
  "--fc-subtle": "color-mix(in oklab, var(--muted) 45%, var(--card))",
  "--fc-selected": "var(--foreground)",
  "--fc-on-selected": "var(--background)",
  "--fc-ground": "color-mix(in oklab, var(--foreground) 5%, var(--card))",
  "--fc-empty": "color-mix(in oklab, var(--foreground) 10%, var(--card))",
  "--fc-green-1": "color-mix(in oklab, var(--primary-fill) 28%, var(--card))",
  "--fc-green-2": "color-mix(in oklab, var(--primary-fill) 52%, var(--card))",
  "--fc-green-3": "color-mix(in oklab, var(--primary-fill) 76%, var(--card))",
  "--fc-green-4": "var(--primary-fill)",
  fontFamily: "var(--font-ui)",
  borderRadius: "calc(var(--radius) * 1.5)",
  maxWidth: "none",
} as CSSProperties;

const WEEK_OPTIONS = [4, 12, 26] as const;

const fill = (template: string, values: Record<string, string | number>) =>
  template.replace(/\{(\w+)\}/g, (_, key: string) => String(values[key] ?? ""));

export function GithubCity(props: {
  days: GithubActivityDay[];
  endDate: string;
  login: string;
  levels: readonly [number, number, number];
  heightUnit: number;
  copy: Copy;
  lang: Locale;
}) {
  const { days, endDate, login, levels, heightUnit, copy, lang } = props;
  const locale = lang === "km" ? "km-KH" : "en-US";

  const { plural, formatValue, formatDate } = useMemo(() => {
    // Plain en-US digits and table-driven dates: both render identically on
    // the server and in any browser, whatever locale data it ships with.
    const rules = new Intl.PluralRules(locale);
    const number = new Intl.NumberFormat("en-US", { maximumFractionDigits: 1 });
    const { months, weekdays } = copy.dates;
    return {
      plural: (count: number, forms: PluralForms) =>
        rules.select(count) === "one" ? forms.one : forms.other,
      formatValue: (value: number) => number.format(value),
      formatDate: (date: string, style: FocusDateStyle) => {
        const parsed = new Date(`${date}T00:00:00Z`);
        const parts = {
          month: months[parsed.getUTCMonth()],
          day: parsed.getUTCDate(),
          weekday: weekdays[(parsed.getUTCDay() + 6) % 7],
        };
        return style === "weekday"
          ? parts.weekday
          : fill(copy.dates[style], parts);
      },
    };
  }, [locale, copy.dates]);

  const focusDays = useMemo<FocusDay[]>(
    () =>
      days.map((day) => {
        const repos: FocusSession[] = day.repos.map((repo) => {
          const parts = (
            [
              [repo.commits, copy.commit],
              [repo.pullRequests, copy.pullRequest],
              [repo.issues, copy.issue],
              [repo.reviews, copy.review],
            ] as const
          )
            .filter(([count]) => count > 0)
            .map(
              ([count, forms]) =>
                `${formatValue(count)} ${plural(count, forms)}`,
            );
          return {
            id: `${day.date}-${repo.repo}`,
            title: repo.repo.replace(`${login}/`, ""),
            href: repo.url,
            detail: parts.join(" · "),
            minutes:
              repo.commits + repo.pullRequests + repo.issues + repo.reviews,
          };
        });

        // The calendar total is authoritative; FocusCity sums sessions, so the
        // sessions must add up to it exactly.
        const itemised = repos.reduce((sum, repo) => sum + repo.minutes, 0);
        if (itemised > day.count) {
          return {
            date: day.date,
            sessions: [
              { id: `${day.date}-all`, title: login, minutes: day.count },
            ],
          };
        }
        const rest = day.count - itemised;
        const other: FocusSession[] = rest
          ? [
              {
                id: `${day.date}-other`,
                title: copy.otherActivity,
                detail: copy.otherDetail,
                minutes: rest,
              },
            ]
          : [];
        return { date: day.date, sessions: [...repos, ...other] };
      }),
    [days, login, copy, plural, formatValue],
  );

  return (
    <FocusCity
      days={focusDays}
      endDate={endDate}
      title={copy.title}
      description={copy.description}
      icon={<GitHubIcon aria-hidden className="size-4" />}
      levels={levels}
      heightUnit={heightUnit}
      formatValue={formatValue}
      locale={locale}
      weekOptions={WEEK_OPTIONS}
      formatDate={formatDate}
      style={SITE_THEME}
      labels={{
        rangeLabel: copy.rangeLabel,
        weeksOption: (weeks) => fill(copy.weeksOption, { count: weeks }),
        viewLabel: copy.viewLabel,
        cityView: copy.cityView,
        heatmapView: copy.heatmapView,
        totalLabel: copy.totalLabel,
        totalHint: (weeks) => fill(copy.totalHint, { count: weeks }),
        averageLabel: copy.averageLabel,
        averageHint: copy.averageHint,
        streakLabel: copy.streakLabel,
        streakUnit: copy.streakUnit,
        streakHint: copy.streakHint,
        dragHint: copy.dragHint,
        selectHint: copy.selectHint,
        resetCamera: copy.resetCamera,
        cityTitle: copy.cityTitle,
        heatmapTitle: copy.heatmapTitle,
        chartDescription: (summary) => fill(copy.chartDescription, summary),
        cityLegend: copy.cityLegend,
        heatmapLegend: copy.heatmapLegend,
        legendMin: formatValue(0),
        legendMax: `${formatValue(levels[2])}+`,
        valueSuffix: (value) => plural(value, copy.contribution),
        itemCount: (_, day) => {
          const count = day.sessions.filter((session) => session.href).length;
          return `${formatValue(count)} ${plural(count, copy.repository)}`;
        },
        breakdown: copy.breakdown,
        emptyDay: copy.emptyDay,
        selectDay: copy.selectDay,
        previousDay: copy.previousDay,
        nextDay: copy.nextDay,
      }}
    />
  );
}
