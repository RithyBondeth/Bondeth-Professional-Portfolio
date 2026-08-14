import Link from "next/link";
import type { Metadata } from "next";
import { ArrowLeft, Compass } from "lucide-react";

export const metadata: Metadata = {
  title: "404 — Page Not Found",
  description: "The page you are looking for does not exist.",
};

export default function NotFound() {
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
          <span className="mx-auto grid size-14 place-items-center rounded-2xl bg-primary/10 text-primary">
            <Compass aria-hidden className="size-6" />
          </span>
          <p className="mt-6 text-sm font-semibold text-primary">
            A different path · <span lang="km">ផ្លូវផ្សេង</span>
          </p>
          <p
            aria-hidden
            className="mt-3 text-6xl font-bold tracking-tight text-foreground/10 sm:text-7xl"
          >
            404
          </p>

          <h1 className="mt-1 text-2xl font-bold text-foreground sm:text-3xl">
            This page wandered off
          </h1>
          <p className="mx-auto mt-4 max-w-md text-sm leading-relaxed text-muted-foreground sm:text-base">
            The page may have moved or no longer exists. The portfolio is still
            here, ready for you to explore.
          </p>
          <p
            lang="km"
            className="mx-auto mt-3 max-w-md text-sm leading-relaxed text-muted-foreground sm:text-base"
          >
            ទំព័រនេះប្រហែលជាត្រូវបានផ្លាស់ទី ឬលែងមានទៀត។
            អ្នកអាចត្រឡប់ទៅទំព័រដើមដើម្បីបន្តស្វែងយល់។
          </p>

          <Link
            href="/"
            className="btn-fx btn-fx-primary group mt-8 inline-flex min-h-11 items-center gap-2 rounded-full bg-primary-fill px-5 text-sm font-semibold text-primary-foreground"
          >
            <ArrowLeft
              aria-hidden
              className="size-4 transition-transform group-hover:-translate-x-1"
            />
            Back home · <span lang="km">ទំព័រដើម</span>
          </Link>
        </div>
      </section>
    </main>
  );
}
