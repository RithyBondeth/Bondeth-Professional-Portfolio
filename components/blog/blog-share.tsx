"use client";

import { useState } from "react";
import { Link2, Mail, Share2 } from "lucide-react";

interface BlogShareLabels {
  heading: string;
  native: string;
  copy: string;
  copied: string;
  email: string;
}

interface BlogShareProps {
  title: string;
  excerpt: string;
  url: string;
  labels: BlogShareLabels;
}

export function BlogShare({ title, excerpt, url, labels }: BlogShareProps) {
  const [copied, setCopied] = useState(false);

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback for older browsers
      const textarea = document.createElement("textarea");
      textarea.value = url;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand("copy");
      document.body.removeChild(textarea);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({ title, text: excerpt, url });
      } catch {
        // User cancelled or share failed silently
      }
    }
  };

  const emailHref = `mailto:?subject=${encodeURIComponent(title)}&body=${encodeURIComponent(`${excerpt}\n\n${url}`)}`;

  return (
    <div className="mb-10">
      <p className="text-primary font-mono text-xs tracking-[0.25em] uppercase mb-4">
        <span className="text-muted-foreground">{"//"}</span> {labels.heading}
      </p>
      <div className="flex flex-wrap items-center gap-2">
        {typeof navigator !== "undefined" && "share" in navigator && (
          <button
            type="button"
            onClick={handleNativeShare}
            className="inline-flex items-center gap-2 rounded border border-border/50 bg-muted/30 px-3 py-2 font-mono text-[11px] text-muted-foreground transition-colors hover:border-primary/40 hover:text-primary"
          >
            <Share2 className="size-3.5" />
            {labels.native}
          </button>
        )}
        <button
          type="button"
          onClick={handleCopyLink}
          className="inline-flex items-center gap-2 rounded border border-border/50 bg-muted/30 px-3 py-2 font-mono text-[11px] text-muted-foreground transition-colors hover:border-primary/40 hover:text-primary"
        >
          <Link2 className="size-3.5" />
          {copied ? labels.copied : labels.copy}
        </button>
        <a
          href={emailHref}
          className="inline-flex items-center gap-2 rounded border border-border/50 bg-muted/30 px-3 py-2 font-mono text-[11px] text-muted-foreground transition-colors hover:border-primary/40 hover:text-primary"
        >
          <Mail className="size-3.5" />
          {labels.email}
        </a>
      </div>
    </div>
  );
}
