"use client";

import { Download, Printer } from "lucide-react";
import { siteConfig } from "@/utils/constants/portfolio.constant";
import { trackCvDownload } from "@/utils/functions/track-cv-download";

/**
 * The two things a résumé page owes a visitor: the file, and a clean print.
 *
 * Client-only because both need handlers — one to record the download, one to
 * call `window.print()`. Marked `data-print-hide`, since a toolbar that says
 * "Print" is the least useful thing that could appear on the printout.
 */
export function ResumeActions(props: { downloadLabel: string; printLabel: string }) {
  const { downloadLabel, printLabel } = props;

  return (
    <div data-print-hide className="flex flex-wrap gap-3">
      <a
        href={siteConfig.resume}
        target="_blank"
        rel="noopener noreferrer"
        onClick={() => trackCvDownload("resume-page")}
        className="btn-fx btn-fx-primary inline-flex items-center gap-2 rounded bg-primary-fill px-5 py-2.5 font-mono text-sm text-primary-foreground"
      >
        <Download aria-hidden className="size-4" />
        {downloadLabel}
      </a>
      <button
        type="button"
        onClick={() => window.print()}
        className="btn-fx inline-flex items-center gap-2 rounded border border-border px-5 py-2.5 font-mono text-sm text-foreground"
      >
        <Printer aria-hidden className="size-4" />
        {printLabel}
      </button>
    </div>
  );
}
