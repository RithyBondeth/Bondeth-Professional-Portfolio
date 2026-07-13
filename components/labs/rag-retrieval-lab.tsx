"use client";

import { useState } from "react";
import { track } from "@vercel/analytics";
import type { IRetrievalResult } from "@/utils/functions/labs/rag-retrieval";
import type { TDictionary } from "@/utils/i18n";

type TStatus = "idle" | "loading" | "success" | "error";

export function RagRetrievalLab(props: {
  labels: TDictionary["labs"]["rag"];
}) {
  const { labels } = props;
  const [query, setQuery] = useState(labels.presets[0].value);
  const [status, setStatus] = useState<TStatus>("idle");
  const [result, setResult] = useState<IRetrievalResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function runRetrieval() {
    if (!query.trim() || status === "loading") return;
    setStatus("loading");
    setError(null);

    try {
      const response = await fetch("/api/labs/rag-retrieval", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query }),
      });
      const body = await response.json();

      if (!response.ok) {
        setError(body?.error ?? labels.error);
        setStatus("error");
        return;
      }

      setResult(body);
      setStatus("success");
      track("lab_run", { lab: "rag-retrieval" });
    } catch {
      setError(labels.error);
      setStatus("error");
    }
  }

  function loadPreset(value: string) {
    setQuery(value);
    setResult(null);
    setStatus("idle");
    setError(null);
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[0.72fr_1.28fr]">
      <section className="rounded border border-border/60 bg-card p-5 sm:p-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-primary">
              01 / query
            </p>
            <h2 className="mt-2 text-lg font-semibold text-foreground">
              {labels.queryHeading}
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
          htmlFor="retrieval-query"
          className="mt-6 block font-mono text-[10px] uppercase tracking-wider text-muted-foreground"
        >
          {labels.queryLabel}
        </label>
        <textarea
          id="retrieval-query"
          value={query}
          onChange={(event) => setQuery(event.currentTarget.value)}
          maxLength={300}
          rows={5}
          className="mt-2 w-full resize-y rounded border border-border/60 bg-background p-4 text-sm leading-relaxed text-foreground focus:border-primary/50 focus:outline-none focus:ring-1 focus:ring-primary/30"
        />
        <div className="mt-2 flex items-center justify-between gap-4">
          <p className="text-xs leading-relaxed text-muted-foreground">
            {labels.privacy}
          </p>
          <span className="shrink-0 font-mono text-[10px] text-muted-foreground">
            {query.length}/300
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
          disabled={!query.trim() || status === "loading"}
          onClick={runRetrieval}
          className="mt-6 flex min-h-12 w-full items-center justify-center gap-2 rounded bg-primary px-5 font-mono text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-50"
        >
          <span aria-hidden>⌕</span>
          {status === "loading" ? labels.searching : labels.search}
        </button>

        {result && (
          <div className="mt-5 border-t border-border/40 pt-5">
            <p className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
              {labels.queryTerms}
            </p>
            <div className="mt-2 flex flex-wrap gap-1.5">
              {result.queryTerms.map((term) => (
                <span
                  key={term}
                  className="rounded border border-primary/15 bg-primary/5 px-2 py-1 font-mono text-[10px] text-primary"
                >
                  {term}
                </span>
              ))}
            </div>
          </div>
        )}
      </section>

      <section
        aria-live="polite"
        className="rounded border border-border/60 bg-[#050914] p-5 sm:p-6"
      >
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <p className="font-code text-[10px] uppercase tracking-[0.2em] text-primary">
              02 / retrieved-context
            </p>
            <h2 className="mt-2 text-lg font-semibold text-foreground">
              {labels.resultsHeading}
            </h2>
          </div>
          {result && (
            <span className="font-mono text-[10px] text-muted-foreground">
              top {result.meta.retrievedCount}/{result.meta.corpusSize} ·{" "}
              {result.meta.processingMs}ms
            </span>
          )}
        </div>

        {!result ? (
          <div className="mt-5 flex min-h-80 items-center justify-center rounded border border-dashed border-border/50 bg-black/30 p-8 text-center">
            <p className="max-w-sm font-mono text-xs leading-relaxed text-muted-foreground">
              {labels.emptyResults}
            </p>
          </div>
        ) : result.chunks.length === 0 ? (
          <div className="mt-5 rounded border border-amber-500/20 bg-amber-500/5 p-6 text-center">
            <p className="text-sm text-amber-400">{labels.noMatches}</p>
          </div>
        ) : (
          <div className="mt-5 space-y-3">
            {result.chunks.map((chunk, index) => (
              <article
                key={chunk.id}
                className="rounded border border-border/50 bg-black/40 p-4"
              >
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="font-mono text-[10px] text-primary">
                      #{index + 1} · {chunk.id}
                    </p>
                    <h3 className="mt-1 text-sm font-semibold text-foreground">
                      {chunk.title}
                    </h3>
                  </div>
                  <div className="shrink-0 text-right">
                    <span className="font-mono text-xs text-emerald-400">
                      {Math.round(chunk.score * 100)}%
                    </span>
                    <div className="mt-1 h-1.5 w-16 overflow-hidden rounded-full bg-border">
                      <div
                        className="h-full rounded-full bg-emerald-400"
                        style={{ width: `${chunk.score * 100}%` }}
                      />
                    </div>
                  </div>
                </div>
                <p className="mt-3 text-xs leading-6 text-muted-foreground">
                  {chunk.content}
                </p>
                <div className="mt-3 flex flex-wrap gap-1.5">
                  {chunk.matchedTerms.map((term) => (
                    <span
                      key={term}
                      className="rounded bg-primary/10 px-2 py-0.5 font-mono text-[10px] text-primary"
                    >
                      {term}
                    </span>
                  ))}
                </div>
              </article>
            ))}
          </div>
        )}

        <div className="mt-5 border-t border-border/40 pt-5">
          <p className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
            {labels.pipeline}
          </p>
          <p className="mt-2 font-mono text-xs leading-6 text-primary/80">
            query → tokenize → score chunks → rank → top context
          </p>
        </div>
      </section>
    </div>
  );
}
