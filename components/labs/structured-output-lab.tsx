"use client";

import { useState } from "react";
import { track } from "@vercel/analytics";
import { Check, Copy } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { holdForSkeleton } from "@/utils/functions/labs/hold-for-skeleton";
import type { IStructuredOutputResult } from "@/utils/functions/labs/structured-output";
import type { TDictionary } from "@/utils/i18n";

type TStatus = "idle" | "loading" | "success" | "error";

export function StructuredOutputLab(props: {
  labels: TDictionary["labs"]["playground"];
}) {
  const { labels } = props;
  const [input, setInput] = useState(labels.presets[0].value);
  const [status, setStatus] = useState<TStatus>("idle");
  const [result, setResult] = useState<IStructuredOutputResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  function copyJson() {
    if (!result) return;
    navigator.clipboard?.writeText(JSON.stringify(result.data, null, 2));
    setCopied(true);
    window.setTimeout(() => setCopied(false), 2000);
  }

  async function runExtraction() {
    if (!input.trim() || status === "loading") return;

    setStatus("loading");
    setError(null);
    const startedAt = performance.now();

    try {
      const response = await fetch("/api/labs/structured-output", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ input }),
      });
      const body = await response.json();
      await holdForSkeleton(startedAt);

      if (!response.ok) {
        setError(body?.error ?? labels.error);
        setStatus("error");
        return;
      }

      setResult(body);
      setStatus("success");
      track("lab_run", { lab: "structured-output" });
    } catch {
      await holdForSkeleton(startedAt);
      setError(labels.error);
      setStatus("error");
    }
  }

  function loadPreset(value: string) {
    setInput(value);
    setResult(null);
    setStatus("idle");
    setError(null);
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_0.9fr]">
      <section className="rounded border border-border/60 bg-card p-5 sm:p-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-primary">
              01 / {labels.inputLabel}
            </p>
            <h2 className="mt-2 text-lg font-semibold text-foreground">
              {labels.inputHeading}
            </h2>
          </div>
          <span className="rounded-full border border-emerald-500/20 bg-emerald-500/5 px-3 py-1 font-mono text-[10px] text-emerald-500">
            {labels.localMode}
          </span>
        </div>

        <div className="mt-5 flex flex-wrap gap-2">
          {labels.presets.map((preset) => (
            <button
              key={preset.label}
              type="button"
              onClick={() => loadPreset(preset.value)}
              className="min-h-11 rounded border border-border/60 bg-background px-3 font-mono text-xs text-muted-foreground transition-colors hover:border-primary/30 hover:text-primary"
            >
              {preset.label}
            </button>
          ))}
        </div>

        <label
          htmlFor="lab-input"
          className="mt-6 block font-mono text-[10px] uppercase tracking-wider text-muted-foreground"
        >
          {labels.inputLabel}
        </label>
        <textarea
          id="lab-input"
          value={input}
          onChange={(event) => setInput(event.currentTarget.value)}
          maxLength={2000}
          rows={9}
          className="mt-2 w-full resize-y rounded border border-border/60 bg-background p-4 text-sm leading-relaxed text-foreground focus:border-primary/50 focus:outline-none focus:ring-1 focus:ring-primary/30"
        />
        <div className="mt-2 flex items-center justify-between gap-4">
          <p className="text-xs leading-relaxed text-muted-foreground">
            {labels.privacy}
          </p>
          <span className="shrink-0 font-mono text-[10px] text-muted-foreground">
            {input.length}/2,000
          </span>
        </div>

        {status === "error" && (
          <p
            role="alert"
            aria-live="polite"
            className="mt-4 font-mono text-xs text-red-400"
          >
            {error}
          </p>
        )}

        <button
          type="button"
          disabled={!input.trim() || status === "loading"}
          onClick={runExtraction}
          className="mt-6 flex min-h-12 w-full items-center justify-center gap-2 rounded bg-primary px-5 font-mono text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-50"
        >
          <span aria-hidden>▸</span>
          {status === "loading" ? labels.running : labels.run}
        </button>
      </section>

      <section
        aria-live="polite"
        className="rounded border border-border/60 bg-[#05060a] p-5 sm:p-6"
      >
        <p className="font-code text-[10px] uppercase tracking-[0.2em] text-primary">
          02 / output.json
        </p>
        <h2 className="mt-2 text-lg font-semibold text-foreground">
          {labels.outputHeading}
        </h2>

        {status === "loading" ? (
          <div className="mt-5" aria-hidden>
            <div className="flex flex-wrap items-center gap-2">
              <Skeleton className="h-6 w-24 rounded" />
              <Skeleton className="h-4 w-28" />
            </div>
            <div className="mt-4 space-y-2 rounded border border-border/50 bg-black p-4">
              {Array.from({ length: 6 }).map((_, i) => (
                <Skeleton
                  key={i}
                  className="h-3"
                  style={{ width: `${80 - (i % 3) * 18}%` }}
                />
              ))}
            </div>
          </div>
        ) : result ? (
          <>
            <div className="mt-5 flex flex-wrap items-center gap-2">
              <span
                className={`rounded border px-2.5 py-1 font-mono text-[10px] ${
                  result.validation.valid
                    ? "border-emerald-500/25 bg-emerald-500/5 text-emerald-400"
                    : "border-amber-500/25 bg-amber-500/5 text-amber-400"
                }`}
              >
                {result.validation.valid
                  ? labels.valid
                  : labels.incomplete}
              </span>
              <span className="font-mono text-[10px] text-muted-foreground">
                {result.meta.processingMs}ms ·{" "}
                {result.meta.detectedLanguage.toUpperCase()}
              </span>
              <button
                type="button"
                onClick={copyJson}
                className="ml-auto inline-flex items-center gap-1.5 rounded border border-border/60 bg-background px-2.5 py-1 font-mono text-[10px] text-muted-foreground transition-colors hover:border-primary/40 hover:text-primary"
              >
                {copied ? (
                  <Check className="size-3 text-emerald-400" aria-hidden />
                ) : (
                  <Copy className="size-3" aria-hidden />
                )}
                {copied ? labels.copied : labels.copyJson}
              </button>
            </div>

            <pre className="mt-4 overflow-x-auto rounded border border-border/50 bg-black p-4 text-xs leading-6 text-emerald-300">
              <code>{JSON.stringify(result.data, null, 2)}</code>
            </pre>

            {!result.validation.valid && (
              <div className="mt-4 rounded border border-amber-500/20 bg-amber-500/5 p-4">
                <p className="font-mono text-[10px] uppercase tracking-wider text-amber-400">
                  {labels.missingFields}
                </p>
                <p className="mt-2 text-xs text-muted-foreground">
                  {result.validation.missingFields.join(", ")}
                </p>
              </div>
            )}
          </>
        ) : (
          <div className="mt-5 flex min-h-64 items-center justify-center rounded border border-dashed border-border/50 bg-black/30 p-8 text-center">
            <p className="max-w-xs font-mono text-xs leading-relaxed text-muted-foreground">
              {labels.emptyOutput}
            </p>
          </div>
        )}

        <div className="mt-5 border-t border-border/40 pt-5">
          <p className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
            {labels.schema}
          </p>
          <code className="mt-2 block text-xs leading-6 text-primary/80">
            name: string · email: email · service: string · urgency: enum
          </code>
        </div>
      </section>
    </div>
  );
}
