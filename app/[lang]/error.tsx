"use client";

import Link from "next/link";
import { ArrowLeft, RefreshCw } from "lucide-react";
import { PixelRobot } from "@/components/chatbot/pixel-robot";

export default function SegmentError({
  error,
  unstable_retry,
}: {
  error: Error & { digest?: string };
  unstable_retry: () => void;
}) {
  return (
    <main
      id="main-content"
      tabIndex={-1}
      className="flex flex-1 items-center justify-center px-6 py-32 font-sans"
    >
      <section className="relative w-full max-w-2xl overflow-hidden rounded-3xl border border-border/70 bg-card p-8 text-center shadow-sm sm:p-12">
        <div
          aria-hidden
          className="absolute -right-20 -top-20 size-56 rounded-full bg-primary/10 blur-3xl"
        />
        <div
          aria-hidden
          className="absolute -bottom-24 -left-20 size-56 rounded-full bg-primary/5 blur-3xl"
        />

        <div className="relative">
          <div
            className="mx-auto flex h-20 items-center justify-center"
            aria-hidden
          >
            <PixelRobot className="scale-90" />
          </div>
          <p className="mt-6 text-sm font-semibold text-primary">
            A small interruption · <span lang="km">មានការរអាក់រអួលបន្តិច</span>
          </p>
          <p
            aria-hidden
            className="mt-3 text-6xl font-bold tracking-tight text-foreground/10 sm:text-7xl"
          >
            500
          </p>

          <h1 className="mt-1 text-2xl font-bold text-foreground sm:text-3xl">
            Something went wrong
          </h1>
          <p className="mx-auto mt-4 max-w-md text-sm leading-relaxed text-muted-foreground sm:text-base">
            This one is on me, not on you. Trying again often clears it and the
            rest of the site is still ready to explore.
          </p>
          <p
            lang="km"
            className="mx-auto mt-3 max-w-md text-sm leading-relaxed text-muted-foreground sm:text-base"
          >
            នេះជាបញ្ហារបស់ខ្ញុំ មិនមែនរបស់អ្នកទេ។ សូមសាកល្បងម្ដងទៀត
            ហើយផ្នែកផ្សេងទៀតនៃគេហទំព័រនៅដំណើរការធម្មតា។
          </p>

          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <button
              type="button"
              onClick={() => unstable_retry()}
              className="btn-fx btn-fx-primary group inline-flex min-h-11 items-center gap-2 rounded-full bg-primary-fill px-5 text-sm font-semibold text-primary-foreground"
            >
              <RefreshCw
                aria-hidden
                className="size-4 transition-transform duration-500 group-hover:rotate-180"
              />
              Try again · <span lang="km">ព្យាយាមម្ដងទៀត</span>
            </button>
            <Link
              href="/"
              className="btn-fx group inline-flex min-h-11 items-center gap-2 rounded-full border border-border bg-background/60 px-5 text-sm font-semibold text-foreground"
            >
              <ArrowLeft
                aria-hidden
                className="size-4 transition-transform group-hover:-translate-x-1"
              />
              Back home · <span lang="km">ទំព័រដើម</span>
            </Link>
          </div>

          {error.digest ? (
            <p className="mt-8 text-[11px] text-muted-foreground/70">
              Support reference:{" "}
              <span className="font-code">{error.digest}</span>
            </p>
          ) : null}
        </div>
      </section>
    </main>
  );
}
