import { cn } from "@/lib/utils";
import { Reveal } from "@/components/utils/animations/reveal";

/**
 * The page's structural grid.
 *
 * Every section on the site is the same shape: a full-bleed hairline across
 * the top, then a 12-column measure in which the numeral + label sit in a
 * narrow left margin (like a printed sidenote) and the headline, standfirst
 * and content run in the wide column beside them. Below `md` the two columns
 * stack and the label becomes a running head.
 *
 * Keeping this in one place is what makes the rhythm read as deliberate:
 * the numerals count up, the rules land at the same x, and no section can
 * quietly invent its own padding.
 */

/* --------------------------------- Container -------------------------------- */
export function Container({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("mx-auto w-full max-w-[76rem] px-6 sm:px-8 lg:px-12", className)}>
      {children}
    </div>
  );
}

/* ---------------------------------- Section --------------------------------- */
export function Section({
  id,
  children,
  className,
  /** Drop the top hairline for the first section after the masthead. */
  bare = false,
}: {
  id?: string;
  children: React.ReactNode;
  className?: string;
  bare?: boolean;
}) {
  return (
    <section
      id={id}
      // The masthead is fixed, so anchored jumps need headroom.
      className={cn(
        "scroll-mt-20",
        !bare && "border-t border-rule",
        "py-20 sm:py-24 lg:py-32",
        className,
      )}
    >
      <Container>{children}</Container>
    </section>
  );
}

/* ------------------------------ Section header ------------------------------ */
export function SectionHeader({
  numeral,
  label,
  title,
  lead,
  aside,
  action,
  className,
}: {
  /** Two-digit running number, e.g. "03". */
  numeral?: string;
  /** Short running head, set in caps. */
  label: string;
  title: React.ReactNode;
  /** Optional standfirst paragraph under the headline. */
  lead?: React.ReactNode;
  /** Optional element pinned to the bottom of the label column. */
  aside?: React.ReactNode;
  /**
   * Optional "see everything" link, set on the headline's baseline at the far
   * right of the measure. Sections that are an excerpt of a longer index
   * (work, writing, labs) should always carry one — a truncated list with no
   * way through to the rest is a dead end.
   */
  action?: React.ReactNode;
  className?: string;
}) {
  return (
    <header className={cn("grid gap-x-10 gap-y-6 lg:grid-cols-12", className)}>
      <Reveal className="lg:col-span-3">
        <p className="eyebrow flex items-baseline gap-3">
          {numeral && <span className="numeral">{numeral}</span>}
          <span>{label}</span>
        </p>
        {aside && <div className="mt-6 hidden lg:block">{aside}</div>}
      </Reveal>

      <Reveal delay={80} className="lg:col-span-9">
        <div className="flex flex-wrap items-baseline justify-between gap-x-8 gap-y-3">
          <h2 className="display-md text-balance">{title}</h2>
          {action}
        </div>
        {lead && (
          <div className="measure mt-6 text-[0.9375rem] leading-relaxed text-muted-foreground sm:text-base">
            {lead}
          </div>
        )}
      </Reveal>
    </header>
  );
}

/* -------------------------------- Section body ------------------------------- */
/**
 * Content that lines up with the headline column rather than the full width.
 * Use for prose and narrow lists; grids and index tables usually want the
 * full measure and should be rendered directly inside `Section`.
 */
export function SectionBody({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("grid gap-x-10 lg:grid-cols-12", className)}>
      <div className="lg:col-span-9 lg:col-start-4">{children}</div>
    </div>
  );
}
