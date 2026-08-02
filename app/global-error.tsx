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
 * the same reason the theme bootstrap below is a copy of `ThemeScript`'s
 * payload rather than an import of it; the duplication is the point.
 *
 * `metadata` exports are not supported in a Client Component, so the title is
 * set with React's own <title>.
 */

/* Mirrors FOUC_SCRIPT in components/utils/theme/theme-provider.tsx. Light is
   the site's default, and any failure falls back to it. */
const THEME_BOOTSTRAP = `try{var t=localStorage.getItem('theme');t=t==='light'||t==='dark'?t:'light';document.documentElement.dataset.theme=t;document.documentElement.style.colorScheme=t}catch(e){document.documentElement.dataset.theme='light';document.documentElement.style.colorScheme='light'}`;

/* next/font never runs here, so --font-mono / --font-sans resolve through an
   undefined --font-khmer. Explicit stacks instead of the font utilities. */
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
    console.error("Root layout error", { digest: error.digest, error });
  }, [error]);

  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <title>Something went wrong — Bondeth</title>
        <script dangerouslySetInnerHTML={{ __html: THEME_BOOTSTRAP }} />
      </head>
      <body
        className="bg-background text-foreground antialiased"
        style={{ fontFamily: SANS }}
      >
        <main
          style={{ fontFamily: SANS }}
          className="flex min-h-screen flex-col items-center justify-center px-6 py-24 text-center"
        >
          <p
            style={{ fontFamily: MONO }}
            className="mb-6 text-xs uppercase tracking-[0.25em] text-primary"
          >
            $ ./boot → failed
          </p>

          <h1 className="mb-4 text-2xl font-bold sm:text-3xl">
            Something went wrong
          </h1>
          <p className="mb-3 max-w-sm text-sm leading-relaxed text-muted-foreground sm:text-base">
            The site failed to start up. Reloading usually fixes it.
          </p>
          <p className="mb-10 max-w-sm text-sm leading-relaxed text-muted-foreground sm:text-base">
            គេហទំព័រមិនអាចចាប់ផ្ដើមបានទេ។ ការផ្ទុកឡើងវិញជាធម្មតាដោះស្រាយបាន។
          </p>

          <button
            type="button"
            onClick={() => unstable_retry()}
            style={{ fontFamily: MONO }}
            className="rounded bg-primary-fill px-6 py-3 text-sm tracking-wide text-primary-foreground"
          >
            ↻ Try again · ព្យាយាមម្ដងទៀត
          </button>

          {error.digest ? (
            <p
              style={{ fontFamily: MONO }}
              className="mt-10 text-[10px] uppercase tracking-widest text-muted-foreground/70"
            >
              Error ref · {error.digest}
            </p>
          ) : null}
        </main>
      </body>
    </html>
  );
}
