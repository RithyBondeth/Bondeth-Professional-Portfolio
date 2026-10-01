import { BadgeCheck, ListChecks, Search, type LucideIcon } from "lucide-react";
import type { TDictionary } from "@/utils/i18n";

export interface ILabEntry {
  /** Route path below the locale, e.g. "/labs/rag-retrieval". Also the value
   *  a post's `relatedLab` front matter uses to point at this lab. */
  path: string;
  title: string;
  description: string;
  icon: LucideIcon;
  /** Small illustration of what the lab shows, for its card. */
  visual: React.ReactNode;
}

/**
 * Every lab, in display order — the single list behind the /labs index and
 * the homepage's "Labs & writing" section, so the two can never drift.
 */
export function getLabCatalog(labs: TDictionary["labs"]): ILabEntry[] {
  return [
    {
      path: "/labs/structured-output",
      title: labs.structuredOutputTitle,
      description: labs.structuredOutputDescription,
      icon: ListChecks,
      visual: (
        <div className="w-full max-w-64 rounded-2xl border border-border/70 bg-card p-4 shadow-sm">
          {["72%", "88%", "64%"].map((width, index) => (
            <div
              key={width}
              className="flex items-center gap-3 border-b border-border/50 py-2.5 last:border-0"
            >
              <span className="grid size-6 shrink-0 place-items-center rounded-full bg-primary/10 text-primary">
                <BadgeCheck aria-hidden className="size-3.5" />
              </span>
              <span className="h-2 rounded-full bg-foreground/10" style={{ width }} />
              <span className="ml-auto text-xs font-semibold text-primary">
                0{index + 1}
              </span>
            </div>
          ))}
        </div>
      ),
    },
    {
      path: "/labs/rag-retrieval",
      title: labs.ragTitle,
      description: labs.ragDescription,
      icon: Search,
      visual: (
        <div className="relative w-full max-w-64 space-y-2">
          {[92, 76, 48].map((score, index) => (
            <div
              key={score}
              className="rounded-xl border border-border/70 bg-card px-4 py-3 shadow-sm"
              style={{ marginInlineStart: `${index * 12}px` }}
            >
              <div className="flex items-center gap-3">
                <span className="grid size-7 place-items-center rounded-lg bg-primary/10 text-xs font-bold text-primary">
                  {index + 1}
                </span>
                <span className="h-2 flex-1 overflow-hidden rounded-full bg-foreground/10">
                  <span
                    className="block h-full rounded-full bg-primary"
                    style={{ width: `${score}%` }}
                  />
                </span>
                <span className="text-xs font-semibold text-muted-foreground">
                  {score}%
                </span>
              </div>
            </div>
          ))}
        </div>
      ),
    },
    {
      path: "/labs/llm-evals",
      title: labs.evalTitle,
      description: labs.evalDescription,
      icon: BadgeCheck,
      visual: (
        <div className="grid w-full max-w-64 grid-cols-2 gap-3">
          {[
            { score: "100%", tone: "text-primary", fill: "bg-primary/10" },
            { score: "20%", tone: "text-muted-foreground", fill: "bg-card" },
          ].map((item, index) => (
            <div
              key={item.score}
              className={`rounded-2xl border border-border/70 p-4 text-center shadow-sm ${item.fill}`}
            >
              <span className="text-xs font-medium text-muted-foreground">
                0{index + 1}
              </span>
              <p className={`mt-3 text-3xl font-bold ${item.tone}`}>{item.score}</p>
              <div className="mx-auto mt-3 flex w-fit gap-1">
                {[0, 1, 2, 3].map((dot) => (
                  <span
                    key={dot}
                    className={`size-1.5 rounded-full ${dot <= (index === 0 ? 3 : 0) ? "bg-primary" : "bg-foreground/15"}`}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
      ),
    },
  ];
}
