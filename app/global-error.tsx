"use client";

import { useEffect } from "react";
import "./globals.css";

/**
 * Last-resort boundary: the only thing that catches a throw from the root
 * layout (`app/[lang]/layout.tsx`) itself. When it renders it REPLACES that
 * layout, so it has to supply its own `<html>`, `<body>` and stylesheet.
 *
 * Deliberately dependency-free apart from the stylesheet. Everything the root
 * layout mounts — the theme provider, the shader background, GSAP, the navbar —
 * is a candidate for having caused the error we are here to report, so pulling
 * any of it back in risks throwing a second time with nowhere left to fall. For
 * Metadata exports are not supported in a Client Component, so the title is
 * set with React's own <title>.
 */

/* next/font never runs here, so use explicit system stacks instead of the font
   utilities that normally resolve through layout-provided variables. */
const SANS = "ui-sans-serif, system-ui, -apple-system, sans-serif";
const MONO = '"JetBrains Mono", ui-monospace, SFMono-Regular, monospace';

export default function GlobalError({
  error,
  unstable_retry,
}: {
  error: Error & { digest?: string };
  // Next 16 supersedes the old `reset` prop with `unstable_retry`.
  unstable_retry: () => void;
}) {
  useEffect(() => {
    // global-error is a Client Component. Rendering a raw <script> here causes
    // React 19 to warn that component scripts are never executed, so restore
    // the saved theme imperatively after mount instead. Next/React already log
    // the original boundary error; duplicating it with console.error would
    // create a second, misleading overlay entry.
    try {
      const stored = localStorage.getItem("theme");
      const theme = stored === "dark" ? "dark" : "light";
      document.documentElement.dataset.theme = theme;
      document.documentElement.style.colorScheme = theme;
    } catch {
      document.documentElement.dataset.theme = "light";
      document.documentElement.style.colorScheme = "light";
    }
  }, []);

  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <title>Something went wrong — Bondeth</title>
      </head>
      <body
        className="bg-background text-foreground antialiased"
        style={{ fontFamily: SANS }}
      >
        <main
          style={{ fontFamily: SANS }}
          className="flex min-h-screen items-center justify-center px-6 py-24"
        >
          <section className="relative w-full max-w-2xl overflow-hidden rounded-3xl border border-border/70 bg-card p-8 text-center shadow-sm sm:p-12">
            <div
              aria-hidden
              className="absolute -right-20 -top-20 size-56 rounded-full bg-primary/10 blur-3xl"
            />
            <div className="relative">
              <span className="mx-auto grid size-14 place-items-center rounded-2xl bg-primary/10 text-2xl text-primary">
                ✦
              </span>
              <p className="mt-6 text-sm font-semibold text-primary">
                A small interruption ·{" "}
                <span lang="km">មានការរអាក់រអួលបន្តិច</span>
              </p>
              <p
                aria-hidden
                className="mt-3 text-6xl font-bold tracking-tight text-foreground/10 sm:text-7xl"
              >
                500
              </p>
              <h1 className="mt-1 text-2xl font-bold sm:text-3xl">
                Something went wrong
              </h1>
              <p className="mx-auto mt-4 max-w-md text-sm leading-relaxed text-muted-foreground sm:text-base">
                The site could not start this time. Trying again usually gets
                everything back in place.
              </p>
              <p
                lang="km"
                className="mx-auto mt-3 max-w-md text-sm leading-relaxed text-muted-foreground sm:text-base"
              >
                គេហទំព័រមិនអាចចាប់ផ្ដើមបានទេ។
                ការព្យាយាមម្ដងទៀតជាធម្មតាអាចដោះស្រាយបាន។
              </p>

              <button
                type="button"
                onClick={() => unstable_retry()}
                className="mt-8 min-h-11 rounded-full bg-primary-fill px-5 text-sm font-semibold text-primary-foreground"
              >
                ↻&nbsp; Try again · <span lang="km">ព្យាយាមម្ដងទៀត</span>
              </button>

              {error.digest ? (
                <p className="mt-8 text-[11px] text-muted-foreground/70">
                  Support reference:{" "}
                  <span style={{ fontFamily: MONO }}>{error.digest}</span>
                </p>
              ) : null}
            </div>
          </section>
        </main>
      </body>
    </html>
  );
}
