import type { IExperience } from "@/utils/interfaces/portfolio";
import { Reveal } from "@/components/utils/animations/reveal";

/**
 * One entry in the experience index.
 *
 * The period sits in the left margin as a dated sidenote, the role and
 * employer run as the entry itself, and the stack is printed underneath in
 * small caps — no tag pills, no timeline rail, no connecting dots. It is the
 * same twelve-column label/value row used by the colophon and current-focus
 * list, which is what makes three very different kinds of content feel like
 * one document.
 */
export function ExperienceRow({
  role,
  index,
  delay = 0,
}: {
  role: IExperience;
  index: number;
  delay?: number;
}) {
  return (
    <Reveal delay={delay}>
      <article className="grid gap-x-10 gap-y-3 border-b border-rule py-8 lg:grid-cols-12">
        <div className="lg:col-span-3">
          <p className="eyebrow">{role.period}</p>
        </div>

        <div className="lg:col-span-9">
          <div className="flex items-baseline gap-4">
            <span className="eyebrow numeral shrink-0 pt-1">
              {String(index + 1).padStart(2, "0")}
            </span>
            <div>
              <h3 className="display-sm">{role.role}</h3>
              <p className="mt-1 text-base text-muted-foreground">
                {role.company}
              </p>
            </div>
          </div>

          <p className="measure mt-4 leading-relaxed text-muted-foreground lg:ml-[calc(2ch+1rem)]">
            {role.description}
          </p>

          {role.tags.length > 0 && (
            <p className="eyebrow mt-4 lg:ml-[calc(2ch+1rem)]">
              {role.tags.join(" · ")}
            </p>
          )}
        </div>
      </article>
    </Reveal>
  );
}
