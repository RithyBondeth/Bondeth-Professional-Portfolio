import Link from "next/link";
import type { Metadata } from "next";
import { ScrambleText } from "@/components/utils/animations/scramble-text";
import { siteConfig } from "@/utils/constants/portfolio.constant";

export const metadata: Metadata = {
  title: "404 — Page Not Found",
  description: "The page you are looking for does not exist.",
};

/**
 * not-found boundaries receive no route params, so this page is bilingual and
 * links back to the locale root (the proxy resolves "/" to the right locale).
 */
export default function NotFound() {
  return (
    <main id="main-content" tabIndex={-1} className="flex-1 bg-background flex flex-col items-center justify-center px-6 py-32 text-center font-sans">
      {/* Terminal prompt line — decrypts in on arrival */}
      <p className="text-primary font-mono text-xs tracking-[0.25em] uppercase mb-6">
        <ScrambleText text="$ cd ~/page → 404" duration={1.2} />
      </p>

      {/* Glowing number — with the hero's RGB-split glitch bursts */}
      <div className="relative select-none mb-8 motion-safe:animate-[glitch_5s_linear_infinite]">
        <span className="text-[8rem] sm:text-[12rem] font-black text-foreground/10 leading-none">
          404
        </span>
        <span className="absolute inset-0 flex items-center justify-center text-[8rem] sm:text-[12rem] font-black leading-none text-primary opacity-20 blur-sm">
          404
        </span>
      </div>

      {/* Message */}
      <h1 className="text-2xl sm:text-3xl font-bold text-foreground mb-4">
        Looks like you&apos;re lost
      </h1>
      <p className="text-muted-foreground text-sm sm:text-base max-w-sm leading-relaxed mb-3">
        The page you&apos;re looking for doesn&apos;t exist or has been moved.
        Let&apos;s get you back on track.
      </p>
      <p className="text-muted-foreground dark:text-muted-foreground/70 text-sm sm:text-base max-w-sm leading-relaxed mb-10">
        ទំព័រដែលអ្នកកំពុងស្វែងរកមិនមានទេ ឬត្រូវបានផ្លាស់ទី។
        តោះនាំអ្នកត្រឡប់ទៅផ្លូវដើមវិញ។
      </p>

      {/* CTA */}
      <Link
        href="/"
        className="group inline-flex items-center gap-2 px-6 py-3 rounded bg-primary text-primary-foreground hover:bg-primary/90 font-mono text-sm tracking-wide transition-colors"
      >
        <span aria-hidden className="transition-transform group-hover:-translate-x-1">
          ←
        </span>
        Back to home · ត្រឡប់ទៅទំព័រដើម
      </Link>

      {/* Signature */}
      <p className="mt-12 text-[10px] font-mono text-muted-foreground/60 tracking-widest uppercase">
        {siteConfig.name}
      </p>
    </main>
  );
}
