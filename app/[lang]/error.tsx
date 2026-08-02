"use client";

import { useEffect } from "react";
import Link from "next/link";
import { ScrambleText } from "@/components/utils/animations/scramble-text";
import { siteConfig } from "@/utils/constants/portfolio.constant";

/**
 * Segment error boundary: catches anything thrown while rendering a page,
 * nested layout, `loading`, or `not-found` under `[lang]`. It does NOT catch
 * errors in `[lang]/layout.tsx` itself — that is `app/global-error.tsx`.
 *
 * Because the layout above still renders, this page keeps the navbar, footer
 * and background, and only replaces the page body — so a failure looks like a
 * bad page rather than a broken site.
 *
 * Error boundaries receive no route params, so like {@link NotFound} this page
 * is bilingual on one screen rather than localized.
 */
export default function SegmentError({
  error,
  unstable_retry,
}: {
  error: Error & { digest?: string };
  // Next 16 supersedes the old `reset` prop with `unstable_retry`, which
  // re-fetches the segment as well as re-rendering it.
  unstable_retry: () => void;
}) {
  useEffect(() => {
    // Server Component errors arrive here already scrubbed — only a generic
    // message and the digest survive, so the digest is the thing worth logging.
    console.error("Route segment error", { digest: error.digest, error });
  }, [error]);

  return (
    <main
      id="main-content"
      tabIndex={-1}
      className="flex-1 flex flex-col items-center justify-center px-6 py-32 text-center font-sans"
    >
      <p className="text-primary font-mono text-xs tracking-[0.25em] uppercase mb-6">
        <ScrambleText text="$ ./render → threw" duration={1.2} />
      </p>

      <div className="relative select-none mb-8 motion-safe:animate-[glitch_5s_linear_infinite]">
        <span className="text-[8rem] sm:text-[12rem] font-black text-foreground/10 leading-none">
          500
        </span>
        <span className="absolute inset-0 flex items-center justify-center text-[8rem] sm:text-[12rem] font-black leading-none text-primary opacity-20 blur-sm">
          500
        </span>
      </div>

      <h1 className="text-2xl sm:text-3xl font-bold text-foreground mb-4">
        Something broke on this page
      </h1>
      <p className="text-muted-foreground text-sm sm:text-base max-w-sm leading-relaxed mb-3">
        This one is on me, not on you. Trying again often clears it — the rest
        of the site is fine.
      </p>
      <p className="text-muted-foreground text-sm sm:text-base max-w-sm leading-relaxed mb-10">
        នេះជាបញ្ហារបស់ខ្ញុំ មិនមែនរបស់អ្នកទេ។ សាកល្បងម្ដងទៀតជាធម្មតាដោះស្រាយបាន
        ហើយផ្នែកផ្សេងទៀតនៃគេហទំព័រនៅដំណើរការធម្មតា។
      </p>

      <div className="flex flex-wrap items-center justify-center gap-3">
        <button
          type="button"
          onClick={() => unstable_retry()}
          className="btn-fx btn-fx-primary group inline-flex items-center gap-2 px-6 py-3 rounded bg-primary-fill text-primary-foreground font-mono text-sm tracking-wide"
        >
          <span
            aria-hidden
            className="transition-transform group-hover:rotate-180"
          >
            ↻
          </span>
          Try again · ព្យាយាមម្ដងទៀត
        </button>
        <Link
          href="/"
          className="btn-fx group inline-flex items-center gap-2 px-6 py-3 rounded border border-border font-mono text-sm tracking-wide text-foreground"
        >
          <span
            aria-hidden
            className="transition-transform group-hover:-translate-x-1"
          >
            ←
          </span>
          Back to home · ត្រឡប់ទៅទំព័រដើម
        </Link>
      </div>

      {/* The one thing worth quoting in a bug report: it matches the server log. */}
      {error.digest ? (
        <p className="mt-10 text-[10px] font-mono text-muted-foreground/70 tracking-widest uppercase">
          Error ref · {error.digest}
        </p>
      ) : null}

      <p className="mt-12 text-[10px] font-mono text-muted-foreground/60 tracking-widest uppercase">
        {siteConfig.name}
      </p>
    </main>
  );
}
