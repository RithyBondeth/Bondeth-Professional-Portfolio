"use client";

import { useEffect, useMemo, useState } from "react";
import { Check, Copy, Mail, Share2 } from "lucide-react";
import {
  FaFacebook,
  FaLinkedin,
  FaTelegram,
  FaXTwitter,
} from "react-icons/fa6";

interface IBlogShareLabels {
  heading: string;
  native: string;
  copy: string;
  copied: string;
  email: string;
}

interface IBlogShareProps {
  title: string;
  excerpt: string;
  url: string;
  labels: IBlogShareLabels;
}

export function BlogShare({ title, excerpt, url, labels }: IBlogShareProps) {
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!copied) return;
    const timeout = window.setTimeout(() => setCopied(false), 2000);
    return () => window.clearTimeout(timeout);
  }, [copied]);

  const encoded = useMemo(
    () => ({
      title: encodeURIComponent(title),
      text: encodeURIComponent(excerpt),
      url: encodeURIComponent(url),
    }),
    [excerpt, title, url],
  );

  const shareLinks = [
    {
      label: "LinkedIn",
      href: `https://www.linkedin.com/sharing/share-offsite/?url=${encoded.url}`,
      icon: FaLinkedin,
    },
    {
      label: "Facebook",
      href: `https://www.facebook.com/sharer/sharer.php?u=${encoded.url}`,
      icon: FaFacebook,
    },
    {
      label: "X",
      href: `https://x.com/intent/tweet?url=${encoded.url}&text=${encoded.title}`,
      icon: FaXTwitter,
    },
    {
      label: "Telegram",
      href: `https://t.me/share/url?url=${encoded.url}&text=${encoded.title}`,
      icon: FaTelegram,
    },
    {
      label: labels.email,
      href: `mailto:?subject=${encoded.title}&body=${encoded.text}%0A%0A${encoded.url}`,
      icon: Mail,
    },
  ];

  async function copyLink() {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
    } catch {
      const textArea = document.createElement("textarea");
      textArea.value = url;
      textArea.setAttribute("readonly", "");
      textArea.style.position = "fixed";
      textArea.style.opacity = "0";
      document.body.appendChild(textArea);
      textArea.select();
      const didCopy = document.execCommand("copy");
      textArea.remove();

      if (didCopy) setCopied(true);
    }
  }

  async function shareNative() {
    if (typeof navigator.share !== "function") {
      await copyLink();
      return;
    }

    try {
      await navigator.share({ title, text: excerpt, url });
    } catch {
      // Users can cancel the native share sheet; no UI state change needed.
    }
  }

  return (
    <section
      aria-labelledby="blog-share-heading"
      className="mb-12 rounded-xl border border-border/60 bg-card/45 p-4 sm:p-5"
    >
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <h2
          id="blog-share-heading"
          className="font-mono text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground"
        >
          {labels.heading}
        </h2>
        <button
          type="button"
          onClick={shareNative}
          className="inline-flex min-h-9 items-center gap-2 rounded-md border border-primary/30 bg-primary/10 px-3 py-2 font-mono text-xs text-primary transition-colors hover:border-primary/60 hover:bg-primary/15 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/60"
        >
          <Share2 aria-hidden className="size-3.5" />
          {labels.native}
        </button>
      </div>

      <div className="flex flex-wrap gap-2">
        {shareLinks.map(({ label, href, icon: Icon }) => (
          <a
            key={label}
            href={href}
            target="_blank"
            rel="noreferrer"
            className="inline-flex min-h-10 items-center gap-2 rounded-md border border-border bg-background/70 px-3 py-2 font-mono text-xs text-muted-foreground transition-colors hover:border-primary/40 hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/60"
          >
            <Icon aria-hidden className="size-3.5" />
            {label}
          </a>
        ))}
        <button
          type="button"
          onClick={copyLink}
          className="inline-flex min-h-10 items-center gap-2 rounded-md border border-border bg-background/70 px-3 py-2 font-mono text-xs text-muted-foreground transition-colors hover:border-primary/40 hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/60"
          aria-live="polite"
        >
          {copied ? (
            <Check aria-hidden className="size-3.5 text-primary" />
          ) : (
            <Copy aria-hidden className="size-3.5" />
          )}
          {copied ? labels.copied : labels.copy}
        </button>
      </div>
    </section>
  );
}
