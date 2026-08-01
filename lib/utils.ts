import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * The nav's icon-button shell — ONE definition, shared by the search, resume,
 * language and theme controls.
 *
 * It lives here rather than in the navbar because <ThemeToggle> needs it too,
 * and the navbar already imports <ThemeToggle> — putting it there would be a
 * cycle. Duplicating the string is what let these four drift apart in the first
 * place (a pill, a segmented control and a square, side by side).
 *
 * 44px on touch — the WCAG 2.5.5 target-size floor — collapsing to 28px from
 * `lg`, where the pointer is precise and the bar is dense.
 */
export const NAV_ICON_BUTTON =
  "btn-fx btn-fx-icon flex size-11 items-center justify-center rounded border border-border/60 text-muted-foreground hover:border-primary/40 hover:text-primary lg:size-7";
