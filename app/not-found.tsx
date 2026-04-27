import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "404 — Page Not Found | Rithy Bondeth",
  description: "The page you are looking for does not exist.",
};

export default function NotFound() {
  return (
    <div className="min-h-screen bg-slate-900 flex flex-col items-center justify-center px-6 text-center">
      {/* Glowing number */}
      <div className="relative select-none mb-6">
        <span className="text-[10rem] sm:text-[14rem] font-black text-slate-800 leading-none">
          404
        </span>
        <span className="absolute inset-0 flex items-center justify-center text-[10rem] sm:text-[14rem] font-black leading-none text-transparent bg-clip-text bg-gradient-to-b from-blue-400 to-blue-600 opacity-20 blur-sm">
          404
        </span>
      </div>

      {/* Message */}
      <p className="text-blue-400 font-mono text-sm tracking-widest uppercase mb-3">
        Page not found
      </p>
      <h1 className="text-2xl sm:text-3xl font-bold text-white mb-4">
        Looks like you&apos;re lost
      </h1>
      <p className="text-slate-400 text-sm sm:text-base max-w-sm leading-relaxed mb-10">
        The page you&apos;re looking for doesn&apos;t exist or has been moved.
        Let&apos;s get you back on track.
      </p>

      {/* CTA */}
      <Link
        href="/"
        className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-sm transition-colors"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
        </svg>
        Back to home
      </Link>
    </div>
  );
}
