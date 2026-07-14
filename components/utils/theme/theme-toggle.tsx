"use client";

import { useSyncExternalStore } from "react";
import { flushSync } from "react-dom";
import { useTheme } from "next-themes";

const subscribe = () => () => {};

/** View Transitions API — not yet in every TS lib. */
type TDocWithViewTransition = Document & {
  startViewTransition?: (cb: () => void) => { ready: Promise<void> };
};

/* --------------------------------- Utilities -------------------------------- */
function SunIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      fill="none"
      stroke="currentColor"
      strokeWidth={1.75}
      viewBox="0 0 24 24"
    >
      <circle cx="12" cy="12" r="4" />
      <path
        strokeLinecap="round"
        d="M12 2v2m0 16v2M4.93 4.93l1.41 1.41m11.32 11.32l1.41 1.41M2 12h2m16 0h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41"
      />
    </svg>
  );
}

function MoonIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      fill="none"
      stroke="currentColor"
      strokeWidth={1.75}
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z"
      />
    </svg>
  );
}

export default function ThemeToggle(props: { label: string }) {
  /* ---------------------------------- Props --------------------------------- */
  const { label } = props;

  /* -------------------------------- All States ------------------------------- */
  const { resolvedTheme, setTheme } = useTheme();
  const mounted = useSyncExternalStore(subscribe, () => true, () => false);

  /* -------------------------------- Render UI ------------------------------- */
  if (!mounted) {
    return (
      <span className="flex size-11 items-center justify-center rounded border border-border/60 lg:size-7">
        <span className="w-3.5 h-3.5" />
      </span>
    );
  }

  const isDark = resolvedTheme === "dark";

  /**
   * Theme switch with a circular View-Transition wipe expanding from the
   * click point. Falls back to the plain instant toggle when the API is
   * missing or the user prefers reduced motion. globals.css disables the
   * default cross-fade so the clip-path reveal is the only animation.
   */
  const toggleTheme = (e: React.MouseEvent<HTMLButtonElement>) => {
    const next = isDark ? "light" : "dark";
    const doc = document as TDocWithViewTransition;
    const reduce = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    if (!doc.startViewTransition || reduce) {
      setTheme(next);
      return;
    }

    // Keyboard "clicks" report (0,0) — expand from the button instead.
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX || rect.left + rect.width / 2;
    const y = e.clientY || rect.top + rect.height / 2;
    const radius = Math.hypot(
      Math.max(x, window.innerWidth - x),
      Math.max(y, window.innerHeight - y),
    );

    const transition = doc.startViewTransition(() => {
      flushSync(() => setTheme(next));
    });
    transition.ready
      .then(() => {
        document.documentElement.animate(
          {
            clipPath: [
              `circle(0px at ${x}px ${y}px)`,
              `circle(${radius}px at ${x}px ${y}px)`,
            ],
          },
          {
            duration: 500,
            easing: "cubic-bezier(0.625, 0.05, 0, 1)",
            pseudoElement: "::view-transition-new(root)",
          },
        );
      })
      .catch(() => {
        /* transition was skipped — theme still switched */
      });
  };

  return (
    <button
      onClick={toggleTheme}
      aria-label={label}
      title={label}
      className="flex size-11 items-center justify-center rounded border border-border/60 text-muted-foreground transition-colors hover:border-primary/40 hover:text-primary lg:size-7"
    >
      {isDark ? (
        <SunIcon className="w-3.5 h-3.5" />
      ) : (
        <MoonIcon className="w-3.5 h-3.5" />
      )}
    </button>
  );
}
