"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { ArrowRight, Check, Copy, FileText, Search, SlidersHorizontal } from "lucide-react";
import { track } from "@vercel/analytics";
import {
  assembleRetrievalContext,
  BASELINE_RETRIEVAL_SETTINGS,
  DEFAULT_RETRIEVAL_SETTINGS,
  type IRetrievalResult,
  type IRetrievalSettings,
  type TRetrievalDecision,
} from "@/utils/functions/labs/rag-retrieval";
import type { TDictionary } from "@/utils/i18n";
import { scrollToSection } from "@/components/utils/animations/smooth-scroll";
import { ragExperienceCopy } from "./rag-experience-copy";

type TStatus = "idle" | "loading" | "error";
const controlClass = "w-full accent-primary cursor-pointer disabled:cursor-wait";

function PolicyControl({ id, label, value, min, max, step, display, onChange }: {
  id: string; label: string; value: number; min: number; max: number; step: number;
  display: string; onChange: (value: number) => void;
}) {
  return (
    <div>
      <label htmlFor={id} className="flex items-center justify-between gap-4 text-xs font-medium text-foreground">
        <span>{label}</span><output htmlFor={id} className="shrink-0 font-mono text-primary">{display}</output>
      </label>
      <input id={id} type="range" min={min} max={max} step={step} value={value}
        aria-valuetext={display} onChange={(event) => onChange(Number(event.currentTarget.value))}
        className={`mt-4 min-h-6 ${controlClass}`} />
    </div>
  );
}

export function RagRetrievalLab({ labels, lang, initialResult }: {
  labels: TDictionary["labs"]["rag"]; lang: string; initialResult: IRetrievalResult;
}) {
  const copy = lang === "km" ? ragExperienceCopy.km : ragExperienceCopy.en;
  const [query, setQuery] = useState(initialResult.query);
  const [status, setStatus] = useState<TStatus>("idle");
  const [result, setResult] = useState(initialResult);
  const [settings, setSettings] = useState<IRetrievalSettings>(DEFAULT_RETRIEVAL_SETTINGS);
  const [selectedId, setSelectedId] = useState(initialResult.candidates[0]?.id);
  const [error, setError] = useState<string | null>(null);
  const [copiedContext, setCopiedContext] = useState<string | null>(null);
  const [copyError, setCopyError] = useState(false);
  const request = useRef<AbortController | null>(null);
  const requestId = useRef(0);
  const scrollFrame = useRef(0);
  useEffect(() => () => { request.current?.abort(); cancelAnimationFrame(scrollFrame.current); }, []);

  const selection = useMemo(() => assembleRetrievalContext(result.candidates, settings), [result, settings]);
  const baseline = useMemo(() => assembleRetrievalContext(result.candidates, BASELINE_RETRIEVAL_SETTINGS), [result]);
  const inspected = selection.decisions.find(({ chunk }) => chunk.id === selectedId) ?? selection.decisions[0];
  const matches = result.candidates.filter((chunk) => chunk.matchedTerms.length > 0).length;
  const removed = baseline.chunks.filter((chunk) => !selection.chunks.some((source) => source.id === chunk.id)).length;
  const added = selection.chunks.filter((chunk) => !baseline.chunks.some((source) => source.id === chunk.id)).length;
  const dirty = query.trim() !== result.query;
  const reasonLabels: Record<TRetrievalDecision, string> = {
    selected: copy.selected, "no-match": copy.noMatch, threshold: copy.below, "top-k": copy.limit, budget: copy.overBudget,
  };
  const setPolicy = (key: keyof IRetrievalSettings, value: number) => setSettings((current) => ({ ...current, [key]: value }));

  async function runRetrieval(value = query) {
    const nextQuery = value.trim();
    if (!nextQuery) return;
    request.current?.abort();
    const controller = new AbortController();
    request.current = controller;
    const id = ++requestId.current;
    setQuery(value);
    setStatus("loading");
    setError(null);
    try {
      const response = await fetch("/api/labs/rag-retrieval", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query: nextQuery }), signal: controller.signal,
      });
      if (!response.ok) throw new Error(labels.error);
      const body: IRetrievalResult = await response.json();
      if (id !== requestId.current || controller.signal.aborted) return;
      setResult(body);
      setSelectedId(body.candidates[0]?.id);
      setStatus("idle");
      track("lab_run", { lab: "rag-retrieval" });
    } catch {
      if (controller.signal.aborted || id !== requestId.current) return;
      setError(labels.error);
      setStatus("error");
    }
  }

  function inspectCitation(id: string) {
    setSelectedId(id);
    cancelAnimationFrame(scrollFrame.current);
    scrollFrame.current = requestAnimationFrame(() => {
      const sourceId = `retrieval-source-${id}`;
      document.getElementById(sourceId)?.querySelector("button")?.focus({ preventScroll: true });
      scrollToSection(sourceId);
    });
  }

  async function copyContext() {
    try {
      await navigator.clipboard.writeText(selection.context);
      setCopiedContext(selection.context);
      setCopyError(false);
    } catch { setCopyError(true); }
  }

  return (
    <div lang={lang} className="rag-lab space-y-6">
      <div className="grid gap-6 lg:grid-cols-[1fr_1fr]">
        <form onSubmit={(event) => { event.preventDefault(); void runRetrieval(); }} className="rounded-2xl border border-border/60 bg-card p-5 sm:p-6">
          <div className="flex items-center justify-between gap-4">
            <h2 className="font-mono text-xs text-primary">{copy.question}</h2>
            <span className="text-[10px] text-muted-foreground">{labels.localMode}</span>
          </div>
          <div className="mt-4 flex flex-wrap gap-2">
            {[...labels.presets, { label: copy.missing, value: copy.missingQuery }].map((preset) => (
              <button key={preset.label} type="button" aria-pressed={query === preset.value}
                onClick={() => void runRetrieval(preset.value)}
                className="min-h-11 rounded-lg border border-border/60 px-3 text-xs text-muted-foreground transition-colors hover:border-primary/50 hover:text-primary aria-pressed:border-primary/40 aria-pressed:bg-primary/5 aria-pressed:text-primary">
                {preset.label}
              </button>
            ))}
          </div>
          <label htmlFor="retrieval-query" className="mt-5 block text-xs font-medium text-foreground">{labels.queryLabel}</label>
          <textarea id="retrieval-query" value={query} maxLength={300} rows={3}
            onChange={(event) => setQuery(event.currentTarget.value)}
            className="mt-2 w-full resize-y rounded-xl border border-border/60 bg-background p-3 text-sm leading-6 text-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary" />
          <div className="mt-3 flex items-center justify-between gap-3">
            <span className="font-mono text-[10px] text-muted-foreground">{query.length}/300</span>
            <button type="submit" disabled={!query.trim() || status === "loading"}
              className="btn-fx btn-fx-primary inline-flex min-h-11 items-center gap-2 rounded-full bg-primary-fill px-5 text-xs font-semibold text-primary-foreground disabled:cursor-not-allowed disabled:opacity-50">
              <Search size={14} aria-hidden />{status === "loading" ? labels.searching : labels.search}
            </button>
          </div>
          {dirty && status !== "loading" && <p className="mt-3 text-xs text-status-warning">{copy.pending}</p>}
          {error && <p role="alert" className="mt-3 text-xs text-status-danger">{error}</p>}
        </form>

        <section className="rounded-2xl border border-border/60 bg-card p-5 sm:p-6" aria-labelledby="retrieval-policy">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <h2 id="retrieval-policy" className="flex items-center gap-2 text-sm font-semibold text-foreground"><SlidersHorizontal size={16} aria-hidden />{copy.controls}</h2>
            <button type="button" onClick={() => setSettings(DEFAULT_RETRIEVAL_SETTINGS)} className="min-h-11 text-xs text-primary underline-offset-4 hover:underline">{copy.reset}</button>
          </div>
          <p className="mt-1 text-xs leading-5 text-muted-foreground">{copy.live}</p>
          <div className="mt-6 space-y-5">
            <PolicyControl id="retrieval-top-k" label={copy.topK} min={1} max={5} step={1} value={settings.topK} display={String(settings.topK)} onChange={(value) => setPolicy("topK", value)} />
            <PolicyControl id="retrieval-threshold" label={copy.threshold} min={0} max={0.9} step={0.05} value={settings.minScore} display={`${Math.round(settings.minScore * 100)}%`} onChange={(value) => setPolicy("minScore", value)} />
            <PolicyControl id="retrieval-budget" label={copy.budget} min={200} max={1200} step={50} value={settings.budget} display={`${settings.budget} ${copy.chars}`} onChange={(value) => setPolicy("budget", value)} />
          </div>
        </section>
      </div>

      <p className="text-xs leading-6 text-muted-foreground">{labels.privacy}</p>
      <div className="rounded-2xl border border-border/60 bg-card px-5 py-4 sm:px-6">
        <p className="text-xs leading-6 text-muted-foreground">{copy.lastQuery} <span className="text-foreground">“{result.query}”</span></p>
        <ol aria-label={labels.pipeline} className="mt-4 grid gap-4 sm:grid-cols-3">
          {[
            { title: copy.queryStep, value: String(result.queryTerms.length), detail: labels.queryTerms },
            { title: copy.rankStep, value: `${matches}/${result.meta.corpusSize}`, detail: copy.matched },
            { title: copy.contextStep, value: String(selection.chunks.length), detail: copy.kept },
          ].map((stage, index) => (
            <li key={stage.title} className="flex items-center gap-3 sm:border-r sm:border-border/50 sm:last:border-0">
              <span className="font-mono text-[10px] text-primary">0{index + 1}</span>
              <div><p className="text-xs text-muted-foreground">{stage.title}</p><p className="mt-1 text-sm font-medium text-foreground">{stage.value} <span className="text-xs font-normal text-muted-foreground">{stage.detail}</span></p></div>
            </li>
          ))}
        </ol>
      </div>
      <p className="sr-only" role="status">{status === "loading" ? copy.searchStatus : `${copy.ready}: ${selection.chunks.length} ${copy.kept}, ${selection.usedCharacters} ${copy.chars}.`}</p>

      <div className="grid items-start gap-6 lg:grid-cols-[1.15fr_0.85fr]" aria-busy={status === "loading"}>
        <section className="order-2 min-w-0 rounded-2xl border border-border/60 bg-card p-5 sm:p-6 lg:order-1" aria-labelledby="retrieval-rank">
          <div className="flex items-center justify-between gap-4"><h2 id="retrieval-rank" className="font-mono text-xs text-primary">{copy.rank}</h2><span className="font-mono text-[10px] text-muted-foreground">{result.meta.processingMs}ms</span></div>
          <p className="mt-3 text-xs leading-6 text-muted-foreground">{copy.corpus}</p>
          <div className="mt-4 flex flex-wrap gap-1.5">
            {result.queryTerms.length ? result.queryTerms.map((term) => <span key={term} className="rounded-md bg-primary/10 px-2 py-1 font-mono text-[10px] text-primary">{term}</span>) : <p className="text-xs text-muted-foreground">{copy.emptyTerms}</p>}
          </div>
          <ol className="mt-5 space-y-2">
            {selection.decisions.map(({ chunk, reason }, index) => (
              <li key={chunk.id} id={`retrieval-source-${chunk.id}`} className="scroll-mt-28">
                <button type="button" aria-pressed={inspected?.chunk.id === chunk.id} onClick={() => setSelectedId(chunk.id)}
                  className="w-full rounded-xl border border-border/50 bg-background/40 p-3 text-left transition-colors hover:border-primary/40 aria-pressed:border-primary/60 aria-pressed:bg-primary/5 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary">
                  <div className="flex items-start gap-3">
                    <span className="pt-0.5 font-mono text-[10px] text-muted-foreground">{String(index + 1).padStart(2, "0")}</span>
                    <div className="min-w-0 flex-1"><p className="text-xs font-medium leading-5 text-foreground">{chunk.title}</p><p className={`mt-1 text-[10px] ${reason === "selected" ? "text-primary" : "text-muted-foreground"}`}>{reason === "selected" && <Check size={10} aria-hidden className="mr-1 inline" />}{reasonLabels[reason]}</p></div>
                    <span className="font-mono text-xs text-foreground">{Math.round(chunk.score * 100)}%</span>
                  </div>
                  <div aria-hidden className="mt-3 h-1 overflow-hidden rounded-full bg-border/70"><div className="h-full rounded-full bg-primary transition-[width] duration-[var(--motion-feedback)]" style={{ width: `${chunk.score * 100}%` }} /></div>
                </button>
                {inspected?.chunk.id === chunk.id && (
                  <div className="rounded-b-xl border border-t-0 border-primary/25 bg-primary/[0.025] p-4">
                    <h3 className="flex items-center gap-2 text-sm font-semibold text-foreground"><FileText size={15} aria-hidden />{copy.inspect}</h3>
                    <p className="mt-2 font-mono text-[10px] text-primary">[{inspected.chunk.id}] · {reasonLabels[inspected.reason]}</p>
                    <blockquote className="mt-4 text-sm leading-7 text-foreground">{inspected.chunk.content}</blockquote>
                    <div className="mt-3 flex flex-wrap gap-1.5">{inspected.chunk.matchedTerms.map((term) => <span key={term} className="rounded-md bg-primary/10 px-2 py-1 font-mono text-[10px] text-primary">{term}</span>)}</div>
                    <dl className="mt-4 grid gap-4 rounded-xl bg-secondary/50 p-4 sm:grid-cols-3">
                      <div><dt className="text-[10px] text-muted-foreground">{copy.coverage}</dt><dd className="mt-1 font-mono text-sm text-foreground">{inspected.chunk.matchedTerms.length}/{result.queryTerms.length}</dd></div>
                      <div><dt className="text-[10px] text-muted-foreground">{copy.occurrences}</dt><dd className="mt-1 font-mono text-sm text-foreground">{inspected.chunk.occurrences}</dd></div>
                      <div><dt className="text-[10px] text-muted-foreground">{copy.sourceSize}</dt><dd className="mt-1 font-mono text-sm text-foreground">{Array.from(`[${inspected.chunk.id}] ${inspected.chunk.title}\n${inspected.chunk.content}`).length}</dd></div>
                    </dl>
                    <p className="mt-3 text-[11px] leading-6 text-muted-foreground">{copy.formula}</p>
                  </div>
                )}
              </li>
            ))}
          </ol>
          <p className="mt-4 text-[11px] leading-5 text-muted-foreground">{copy.scoreNote}</p>
        </section>

        <section className="order-1 min-w-0 rounded-2xl border border-primary/25 bg-card p-5 sm:p-6 lg:order-2" aria-labelledby="retrieval-context">
          <h2 id="retrieval-context" className="font-mono text-xs text-primary">{copy.assemble}</h2>
          <div className="mt-4 flex items-center justify-between gap-4"><p className="text-xs text-muted-foreground">{copy.budget}</p><p className="font-mono text-xs text-foreground">{selection.usedCharacters}/{settings.budget}</p></div>
          <div aria-hidden className="mt-2 h-1.5 overflow-hidden rounded-full bg-border/70"><div className="h-full rounded-full bg-primary transition-[width] duration-[var(--motion-feedback)]" style={{ width: `${selection.usedCharacters / settings.budget * 100}%` }} /></div>
          <div className="mt-6 border-y border-border/60 py-4">
            <h3 className="text-xs font-medium text-foreground">{copy.comparison}</h3>
            <p className="mt-2 flex items-center gap-3 font-mono text-sm text-primary"><span>{baseline.chunks.length}</span><ArrowRight size={15} aria-hidden /><span>{selection.chunks.length} {copy.kept}</span></p>
            <p className="mt-2 text-[11px] leading-6 text-muted-foreground">{removed === 0 && added === 0 ? copy.unchanged : `${removed} ${copy.difference} · ${added} ${copy.newSources}`}</p>
            <p className="mt-2 text-[11px] leading-6 text-muted-foreground">{copy.baseline}</p>
          </div>
          <h3 className="mt-6 text-base font-semibold text-foreground">{copy.preview}</h3>
          <p className="mt-2 text-[11px] leading-6 text-muted-foreground">{copy.excerpt}</p>
          {selection.chunks.length === 0 ? (
            <div className="mt-4 rounded-xl border border-status-warning/25 bg-status-warning/5 p-4">
              <p className="text-sm font-medium leading-6 text-foreground">{copy.abstain}</p><p className="mt-2 text-xs leading-6 text-muted-foreground">{matches ? copy.filteredHint : copy.noMatchHint}</p>
            </div>
          ) : (
            <ol className="mt-5 space-y-5">
              {selection.chunks.map((chunk) => (
                <li key={chunk.id} className="border-b border-border/50 pb-5 last:border-0 last:pb-0">
                  <p className="text-sm leading-7 text-foreground">{chunk.content}</p>
                  <button type="button" onClick={() => inspectCitation(chunk.id)} className="mt-2 min-h-11 text-left font-mono text-[10px] text-primary underline decoration-primary/30 underline-offset-4 hover:decoration-primary">[{chunk.id}] · {copy.inspect}</button>
                </li>
              ))}
            </ol>
          )}
          <details className="mt-6 rounded-xl border border-border/60 bg-background/50 p-4">
            <summary className="cursor-pointer text-xs font-medium text-foreground">{copy.prompt}</summary>
            <p className="mt-4 text-[10px] font-medium text-primary">{copy.contract}</p><p className="mt-2 text-xs leading-6 text-muted-foreground">{copy.contractText}</p>
            {selection.context && <><pre tabIndex={0} className="mt-4 max-h-72 overflow-auto whitespace-pre-wrap break-words rounded-lg border border-border/50 bg-secondary/50 p-3 font-mono text-[11px] leading-6 text-foreground">{selection.context}</pre><button type="button" onClick={() => void copyContext()} className="mt-3 inline-flex min-h-11 items-center gap-2 text-xs text-primary"><Copy size={13} aria-hidden />{copiedContext === selection.context ? copy.copied : copy.copy}</button></>}
            {copyError && <p role="status" className="mt-2 text-xs text-muted-foreground">{copy.copyFailed}</p>}
          </details>
        </section>
      </div>

      <section className="border-t border-border/60 pt-8" aria-labelledby="retrieval-decisions">
        <h2 id="retrieval-decisions" className="text-xl font-semibold text-foreground">{copy.tradeoffs}</h2>
        <div className="mt-5 grid gap-6 md:grid-cols-3">
          {[{ title: copy.topic, text: copy.topicText }, { title: copy.lexical, text: copy.lexicalText }, { title: copy.budgetTitle, text: copy.budgetText }].map((decision, index) => <article key={decision.title}><p className="font-mono text-[10px] text-primary">0{index + 1}</p><h3 className="mt-3 text-sm font-semibold text-foreground">{decision.title}</h3><p className="mt-2 text-xs leading-6 text-muted-foreground">{decision.text}</p></article>)}
        </div>
        <p className="mt-6 max-w-3xl text-[11px] leading-6 text-muted-foreground">{copy.note}</p>
      </section>
    </div>
  );
}
