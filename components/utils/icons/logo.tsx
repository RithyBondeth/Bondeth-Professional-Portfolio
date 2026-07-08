import { cn } from "@/lib/utils";

/* ---------------------------------- Logo ----------------------------------- */
/* Terminal-prompt "RB" wordmark: a cyan prompt chevron, the RB monogram in the
   foreground colour, and a blinking block cursor that sits on the text
   baseline. Everything is sized in `em`, so the whole mark scales from the
   parent font-size. Reuses the site-wide `blink` keyframe (same one the hero
   typewriter uses). Decorative by default — pair it with an accessible name
   (aria-label / sr-only) at the call site. */
export function Logo({ className }: { className?: string }) {
  return (
    <span
      aria-hidden="true"
      className={cn(
        "inline-block whitespace-nowrap select-none font-code font-bold tracking-tight leading-none",
        className,
      )}
    >
      <span className="text-primary">&gt;</span>
      <span className="ml-[0.32em] text-foreground">RB</span>
      <span className="ml-[0.16em] inline-block h-[0.72em] w-[0.46em] bg-primary align-baseline animate-[blink_1s_step-end_infinite]" />
    </span>
  );
}
