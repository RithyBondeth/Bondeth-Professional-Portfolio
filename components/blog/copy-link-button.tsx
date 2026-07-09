"use client";

import { Check, Copy } from "lucide-react";
import { useEffect, useState } from "react";

interface ICopyLinkButtonProps {
  copyLabel: string;
  copiedLabel: string;
}

export function CopyLinkButton({
  copyLabel,
  copiedLabel,
}: ICopyLinkButtonProps) {
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!copied) return;
    const timeout = window.setTimeout(() => setCopied(false), 2000);
    return () => window.clearTimeout(timeout);
  }, [copied]);

  async function copyLink() {
    const url = window.location.href;

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

  return (
    <button
      type="button"
      onClick={copyLink}
      className="inline-flex min-h-11 items-center gap-2 rounded-md border border-border bg-card px-4 py-2 font-mono text-xs text-muted-foreground transition-colors hover:border-primary/40 hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/60"
      aria-live="polite"
    >
      {copied ? (
        <Check aria-hidden className="size-3.5 text-primary" />
      ) : (
        <Copy aria-hidden className="size-3.5" />
      )}
      {copied ? copiedLabel : copyLabel}
    </button>
  );
}
