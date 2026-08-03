import {
  skillIconId,
  hasSkillIcon,
} from "@/components/landing/landing-skills/skill-icon-id";
import { TECH_ICONS } from "./tech-icon-map";
import { cn } from "@/lib/utils";

/**
 * A project's stack, drawn as a brand-tinted logo beside its name.
 *
 * The logo carries recognition — a reader scanning six cards spots "Postgres"
 * from its shape before they've read a word — and the label carries the
 * meaning, which is what keeps the row legible to a screen reader, to anyone
 * who doesn't know the mark, and to the recruiter doing a 20-second first pass.
 *
 * Tags with no logo (architectural choices like "Microservices" or "LLM APIs")
 * render as label-only chips in the same shape, so the row still reads as one
 * set rather than two competing treatments.
 */
export function TechBadges(props: {
  tags: string[];
  className?: string;
  /** `sm` for cards, `md` for the detail page. */
  size?: "sm" | "md";
}) {
  const { tags, className, size = "sm" } = props;

  const chip =
    size === "sm"
      ? "gap-1.5 px-2 py-1 text-[10px]"
      : "gap-2 px-2.5 py-1.5 text-xs";
  const glyph = size === "sm" ? "size-3" : "size-3.5";

  return (
    <ul className={cn("flex flex-wrap items-center gap-2", className)}>
      {tags.map((tag) => {
        const entry = TECH_ICONS[tag];
        const drawable = entry && hasSkillIcon(entry.icon);

        return (
          <li key={tag}>
            <span
              style={
                drawable
                  ? ({
                      "--brand-light": entry.colorLight ?? entry.color,
                      "--brand-dark": entry.color,
                    } as React.CSSProperties)
                  : undefined
              }
              className={cn(
                "tech-badge inline-flex items-center rounded border border-border/60 bg-background font-mono text-muted-foreground",
                chip,
              )}
            >
              {drawable && (
                <svg
                  className={cn(glyph, "tech-badge-icon shrink-0")}
                  aria-hidden
                  focusable="false"
                >
                  <use href={`#${skillIconId(entry.icon)}`} />
                </svg>
              )}
              {tag}
            </span>
          </li>
        );
      })}
    </ul>
  );
}
