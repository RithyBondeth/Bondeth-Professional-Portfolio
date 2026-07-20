"use client";

import {
  createContext,
  useContext,
  useEffect,
  useLayoutEffect,
  useSyncExternalStore,
  type ReactNode,
} from "react";

type Theme = "light" | "dark";

interface ThemeContextValue {
  resolvedTheme: Theme;
  setTheme: (theme: Theme) => void;
}

/* ------------------------------- Theme store ------------------------------- */
/**
 * The theme lives in a module-level store rather than component state.
 *
 * Switching language navigates between `/en` and `/km`, which remounts the
 * `[lang]` layout and every provider inside it. Component state would reset to
 * the default on each switch and flash the wrong theme for a frame; a store
 * outside React survives the remount.
 */
const listeners = new Set<() => void>();
let cached: Theme | null = null;

/** The pre-hydration script in the root layout has already set the class, so
 *  the DOM is the source of truth; localStorage is only a fallback. */
function read(): Theme {
  if (typeof document === "undefined") return "dark";
  const root = document.documentElement;
  if (root.classList.contains("light")) return "light";
  if (root.classList.contains("dark")) return "dark";
  try {
    const stored = localStorage.getItem("theme");
    if (stored === "light" || stored === "dark") return stored;
  } catch {
    /* localStorage unavailable (private mode, blocked cookies) */
  }
  return "dark";
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

function getSnapshot(): Theme {
  cached ??= read();
  return cached;
}

/** The server always renders the dark-first default, so hydration matches. */
function getServerSnapshot(): Theme {
  return "dark";
}

function setTheme(next: Theme) {
  cached = next;
  try {
    localStorage.setItem("theme", next);
  } catch {
    /* persistence is best-effort */
  }
  const root = document.documentElement;
  root.classList.remove("light", "dark");
  root.classList.add(next);
  listeners.forEach((listener) => listener());
}

/** `useLayoutEffect` warns when it runs during SSR; the theme only matters in
 *  the browser, so fall back to `useEffect` on the server. */
const useIsomorphicLayoutEffect =
  typeof window !== "undefined" ? useLayoutEffect : useEffect;

/* --------------------------------- Context --------------------------------- */
const ThemeContext = createContext<ThemeContextValue>({
  resolvedTheme: "dark",
  setTheme: () => {},
});

/**
 * Drop-in replacement for next-themes' `useTheme`.
 * Returns the same `resolvedTheme` and `setTheme` the toggle / palette expect.
 */
export function useTheme() {
  return useContext(ThemeContext);
}

/**
 * Class-based theme switching (toggles `dark` on <html>), persisted in
 * localStorage. The site is dark-first, so dark is the default theme.
 *
 * Unlike next-themes, this provider does NOT inject an inline `<script>` tag
 * into the component tree (React 19 / Next.js 16 forbids scripts inside
 * components). The FOUC-prevention script lives in the root layout.
 */
export function ThemeProvider({ children }: { children: ReactNode }) {
  // useSyncExternalStore renders the server snapshot during hydration and the
  // real one immediately afterwards, so there is no hydration mismatch.
  const resolvedTheme = useSyncExternalStore(
    subscribe,
    getSnapshot,
    getServerSnapshot,
  );

  // Navigating between locales re-renders <html> with the className from the
  // layout, which wipes the light/dark class the pre-hydration script added at
  // runtime — leaving the site in light mode. Re-assert it on every commit.
  // A layout effect runs before the browser paints, so nothing flashes.
  useIsomorphicLayoutEffect(() => {
    const root = document.documentElement;
    if (root.classList.contains(resolvedTheme)) return;
    root.classList.remove("light", "dark");
    root.classList.add(resolvedTheme);
  });

  return (
    <ThemeContext.Provider value={{ resolvedTheme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}
