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

/** The pre-hydration script in the root layout has already set `data-theme`, so
 *  the DOM is the source of truth; localStorage is only a fallback. */
function read(): Theme {
  if (typeof document === "undefined") return "dark";
  const current = document.documentElement.dataset.theme;
  if (current === "light" || current === "dark") return current;
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

// Seed the store at module-evaluation time — before React's hydration render,
// and long before any effect can run. If this is left to the first getSnapshot
// call, the hydration pass reads the *server* snapshot instead and the store
// latches onto whatever the DOM says at that moment.
if (typeof document !== "undefined") cached = read();

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
  root.dataset.theme = next;
  root.style.colorScheme = next;
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

  // Switching locale navigates /en <-> /km and re-renders <html>, which drops
  // the `data-theme` the pre-hydration script set. Re-assert it on every commit;
  // a layout effect runs before paint, so the correction never flashes.
  //
  // Critically this writes `getSnapshot()` — the store — and NOT `resolvedTheme`.
  // On the hydration commit `resolvedTheme` is still the *server* snapshot
  // ("dark"), so writing it would stomp the correct value the script just set,
  // and the store would then latch onto that wrong value. That was the bug: a
  // stored light theme came back dark, and a stored dark theme flashed light.
  useIsomorphicLayoutEffect(() => {
    const theme = getSnapshot();
    const root = document.documentElement;
    if (root.dataset.theme === theme) return;
    root.dataset.theme = theme;
    root.style.colorScheme = theme;
  });

  return (
    <ThemeContext.Provider value={{ resolvedTheme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}
