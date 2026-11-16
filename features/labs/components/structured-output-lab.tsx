"use client";

import { useState } from "react";
import { track } from "@vercel/analytics";
import { Check, CircleAlert, CircleCheck, Copy, Wrench } from "lucide-react";
import { Skeleton } from "@/shared/components/ui/skeleton";
import { holdForSkeleton } from "@/features/labs/lib/hold-for-skeleton";
import type { ModelExtractionResult } from "@/features/labs/domain/model-extraction";
import {
  CONTACT_FIELDS,
  type StructuredContact,
  type StructuredOutputResult,
} from "@/features/labs/domain/structured-output";
import type { Dictionary } from "@/shared/i18n";

type Labels = Dictionary["labs"]["playground"];
type Status = "idle" | "loading" | "success" | "error";
type Mode = "rules" | "model";

interface ModelRun {
  result: ModelExtractionResult | null;
  error: string | null;
}

async function postJson<T>(url: string, input: string) {
  const response = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ input }),
  });
  const body = await response.json().catch(() => null);
  if (!response.ok) {
    throw new Error(
      body && typeof body.error === "string" ? body.error : "Request failed.",
    );
  }
  return body as T;
}

function sameValue(a: string | null, b: string | null) {
  return (a ?? "").trim().toLowerCase() === (b ?? "").trim().toLowerCase();
}

export function StructuredOutputLab(props: {
  labels: Labels;
  /** Whether the server has a model key; without one only rules mode shows. */
  liveAvailable: boolean;
}) {
  const { labels, liveAvailable } = props;
  const [mode, setMode] = useState<Mode>(liveAvailable ? "model" : "rules");
  const [input, setInput] = useState(labels.presets[0].value);
  const [status, setStatus] = useState<Status>("idle");
  const [rules, setRules] = useState<StructuredOutputResult | null>(null);
  const [modelRun, setModelRun] = useState<ModelRun | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const modelResult = modelRun?.result ?? null;
  const shownData: StructuredContact | null =
    modelResult?.data ?? rules?.data ?? null;

  function copyJson() {
    if (!shownData) return;
    navigator.clipboard?.writeText(JSON.stringify(shownData, null, 2));
    setCopied(true);
    window.setTimeout(() => setCopied(false), 2000);
  }

  function reset() {
    setRules(null);
    setModelRun(null);
    setStatus("idle");
    setError(null);
  }

  async function runExtraction() {
    if (!input.trim() || status === "loading") return;

    setStatus("loading");
    setError(null);
    const startedAt = performance.now();
    const runModel = mode === "model";

    const [rulesOutcome, modelOutcome] = await Promise.allSettled([
      postJson<StructuredOutputResult>("/api/labs/structured-output", input),
      runModel
        ? postJson<ModelExtractionResult>(
            "/api/labs/structured-output/model",
            input,
          )
        : Promise.resolve(null),
    ]);
    await holdForSkeleton(startedAt);

    if (rulesOutcome.status === "rejected") {
      setError(rulesOutcome.reason?.message ?? labels.error);
      setStatus("error");
      return;
    }

    setRules(rulesOutcome.value);
    setModelRun(
      runModel
        ? modelOutcome.status === "fulfilled"
          ? { result: modelOutcome.value, error: null }
          : { result: null, error: labels.modelError }
        : null,
    );
    setStatus("success");
    track("lab_run", { lab: "structured-output", mode });
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_0.9fr]">
      <section className="rounded-lg border border-border/60 bg-card p-5 sm:p-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-primary">
              01 / {labels.inputLabel}
            </p>
            <h2 className="mt-2 text-lg font-semibold text-foreground">
              {labels.inputHeading}
            </h2>
          </div>
          <span
            className={`rounded-full border px-3 py-1 font-mono text-[10px] ${
              mode === "model"
                ? "border-primary/25 bg-primary/5 text-primary"
                : "border-status-success/25 bg-status-success/5 text-status-success"
            }`}
          >
            {mode === "model" ? labels.hybridMode : labels.localMode}
          </span>
        </div>

        {liveAvailable && (
          <fieldset className="mt-5">
            <legend className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
              {labels.modeLabel}
            </legend>
            <div className="mt-2 grid gap-2 sm:grid-cols-2">
              {(
                [
                  ["model", labels.modeModel, labels.modeModelHint],
                  ["rules", labels.modeRules, labels.modeRulesHint],
                ] as const
              ).map(([value, title, hint]) => (
                <button
                  key={value}
                  type="button"
                  aria-pressed={mode === value}
                  onClick={() => {
                    if (mode === value) return;
                    setMode(value);
                    reset();
                  }}
                  className={`min-h-11 rounded-lg border px-3 py-2.5 text-left transition-colors ${
                    mode === value
                      ? "border-primary/50 bg-primary/5"
                      : "border-border/60 bg-background hover:border-primary/30"
                  }`}
                >
                  <span
                    className={`block text-sm font-semibold ${mode === value ? "text-primary" : "text-foreground"}`}
                  >
                    {title}
                  </span>
                  <span className="mt-0.5 block text-xs text-muted-foreground">
                    {hint}
                  </span>
                </button>
              ))}
            </div>
          </fieldset>
        )}

        <div className="mt-5 flex flex-wrap gap-2">
          {labels.presets.map((preset) => (
            <button
              key={preset.label}
              type="button"
              onClick={() => {
                setInput(preset.value);
                reset();
              }}
              className="min-h-11 rounded-lg border border-border/60 bg-background px-3 font-mono text-xs text-muted-foreground transition-colors hover:border-primary/30 hover:text-primary"
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
          className="mt-2 w-full resize-y rounded-lg border border-border/60 bg-background p-4 text-sm leading-relaxed text-foreground focus:border-primary/50 focus:outline-none focus:ring-1 focus:ring-primary/30"
        />
        <div className="mt-2 flex items-center justify-between gap-4">
          <p className="text-xs leading-relaxed text-muted-foreground">
            {mode === "model" ? labels.privacyModel : labels.privacy}
          </p>
          <span className="shrink-0 font-mono text-[10px] text-muted-foreground">
            {input.length}/2,000
          </span>
        </div>

        {status === "error" && (
          <p
            role="alert"
            aria-live="polite"
            className="mt-4 font-mono text-xs text-status-danger"
          >
            {error}
          </p>
        )}

        <button
          type="button"
          disabled={!input.trim() || status === "loading"}
          onClick={runExtraction}
          className="mt-6 flex min-h-12 w-full items-center justify-center gap-2 btn-fx btn-fx-primary rounded-lg bg-primary-fill px-5 font-mono text-sm font-medium text-primary-foreground disabled:cursor-not-allowed disabled:opacity-50"
        >
          <span aria-hidden>▸</span>
          {status === "loading" ? labels.running : labels.run}
        </button>
      </section>

      <section
        aria-live="polite"
        className="technical-palette min-w-0 rounded-lg border border-border/60 bg-technical-surface p-5 sm:p-6"
      >
        <p className="font-code text-[10px] uppercase tracking-[0.2em] text-primary">
          02 / output.json
        </p>
        <h2 className="mt-2 text-lg font-semibold text-foreground">
          {labels.outputHeading}
        </h2>

        {status === "loading" ? (
          <OutputSkeleton />
        ) : status === "success" && rules ? (
          <>
            {modelRun?.error && (
              <p className="mt-5 flex items-start gap-2 rounded-lg border border-status-warning/20 bg-status-warning/5 p-3 text-xs text-status-warning">
                <CircleAlert aria-hidden className="mt-px size-3.5 shrink-0" />
                {modelRun.error}
              </p>
            )}

            <div className="mt-5 flex flex-wrap items-center gap-2">
              <OutcomeBadge labels={labels} rules={rules} model={modelResult} />
              <span className="font-mono text-[10px] text-muted-foreground">
                {modelResult
                  ? `${modelResult.meta.model} · ${modelResult.meta.totalMs}ms · ${modelResult.meta.totalTokens} ${labels.tokens}${modelResult.meta.cached ? ` · ${labels.cached}` : ""}`
                  : `${rules.meta.processingMs}ms · ${rules.meta.detectedLanguage.toUpperCase()}`}
              </span>
              {shownData && (
                <button
                  type="button"
                  onClick={copyJson}
                  className="ml-auto inline-flex items-center gap-1.5 rounded-lg border border-border/60 bg-background px-2.5 py-1 font-mono text-[10px] text-muted-foreground transition-colors hover:border-primary/40 hover:text-primary"
                >
                  {copied ? (
                    <Check className="size-3 text-status-success" aria-hidden />
                  ) : (
                    <Copy className="size-3" aria-hidden />
                  )}
                  {copied ? labels.copied : labels.copyJson}
                </button>
              )}
            </div>

            <pre className="mt-4 overflow-x-auto rounded-lg border border-border/50 bg-black p-4 text-xs leading-6 text-emerald-300">
              <code>
                {shownData
                  ? JSON.stringify(shownData, null, 2)
                  : (modelResult?.attempts.at(-1)?.raw ?? "")}
              </code>
            </pre>

            {(() => {
              const missing = modelResult
                ? modelResult.missingFields
                : rules.validation.missingFields;
              return shownData && missing.length > 0 ? (
                <div className="mt-4 rounded-lg border border-status-warning/20 bg-status-warning/5 p-4">
                  <p className="font-mono text-[10px] uppercase tracking-wider text-status-warning">
                    {labels.missingFields}
                  </p>
                  <p className="mt-2 text-xs text-muted-foreground">
                    {missing.join(", ")}
                  </p>
                </div>
              ) : null;
            })()}

            {modelResult && (
              <>
                <ValidationTrace labels={labels} result={modelResult} />
                <Comparison
                  labels={labels}
                  rules={rules.data}
                  model={modelResult.data}
                />
              </>
            )}
          </>
        ) : (
          <div className="mt-5 flex min-h-64 items-center justify-center rounded-lg border border-dashed border-border/50 bg-black/30 p-8 text-center">
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
            name: string | null · email: email | null · service: enum | null ·
            urgency: high | normal | low | null
          </code>
        </div>
      </section>
    </div>
  );
}

function OutputSkeleton() {
  return (
    <div className="mt-5" aria-hidden>
      <div className="flex flex-wrap items-center gap-2">
        <Skeleton className="h-6 w-24 rounded-lg" />
        <Skeleton className="h-4 w-28" />
      </div>
      <div className="mt-4 space-y-2 rounded-lg border border-border/50 bg-black p-4">
        {Array.from({ length: 6 }).map((_, i) => (
          <Skeleton
            key={i}
            className="h-3"
            style={{ width: `${80 - (i % 3) * 18}%` }}
          />
        ))}
      </div>
    </div>
  );
}

function OutcomeBadge(props: {
  labels: Labels;
  rules: StructuredOutputResult;
  model: ModelExtractionResult | null;
}) {
  const { labels, rules, model } = props;
  const [tone, text] = model
    ? model.outcome === "failed"
      ? ["danger", labels.failedValidation]
      : model.outcome === "repaired"
        ? ["warning", labels.repaired]
        : model.missingFields.length
          ? ["warning", labels.incomplete]
          : ["success", labels.valid]
    : rules.validation.valid
      ? ["success", labels.valid]
      : ["warning", labels.incomplete];

  const toneClass = {
    success: "border-status-success/25 bg-status-success/5 text-status-success",
    warning: "border-status-warning/25 bg-status-warning/5 text-status-warning",
    danger: "border-status-danger/25 bg-status-danger/5 text-status-danger",
  }[tone];

  return (
    <span
      className={`rounded-lg border px-2.5 py-1 font-mono text-[10px] ${toneClass}`}
    >
      {text}
    </span>
  );
}

function ValidationTrace(props: {
  labels: Labels;
  result: ModelExtractionResult;
}) {
  const { labels, result } = props;
  return (
    <div className="mt-5">
      <p className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
        {labels.trace}
      </p>
      <ol className="mt-2 space-y-2">
        {result.attempts.map((attempt) => {
          const passed = attempt.issues.length === 0;
          const Icon = passed
            ? CircleCheck
            : attempt.attempt > 1
              ? Wrench
              : CircleAlert;
          return (
            <li
              key={attempt.attempt}
              className="rounded-lg border border-border/50 bg-black/30 p-3"
            >
              <div className="flex flex-wrap items-center gap-2 text-xs">
                <Icon
                  aria-hidden
                  className={`size-3.5 ${passed ? "text-status-success" : "text-status-warning"}`}
                />
                <span className="font-semibold text-foreground">
                  {labels.attempt} {attempt.attempt}
                </span>
                <span className="text-muted-foreground">
                  {passed ? labels.attemptValid : labels.failedValidation}
                </span>
                <span className="ml-auto font-mono text-[10px] text-muted-foreground">
                  {attempt.latencyMs}ms · {attempt.tokens} {labels.tokens}
                </span>
              </div>
              {!passed && (
                <>
                  <ul className="mt-2 space-y-1 pl-5 text-xs text-status-warning">
                    {attempt.issues.map((issue, index) => (
                      <li key={index} className="list-disc">
                        {labels.issues[issue.code]}
                        {issue.field && (
                          <code className="ml-1.5 text-muted-foreground">
                            {issue.field}
                          </code>
                        )}
                      </li>
                    ))}
                  </ul>
                  <pre className="mt-2 max-h-32 overflow-auto rounded border border-border/40 bg-black p-2 text-[11px] leading-5 text-muted-foreground">
                    <code>{attempt.raw || "(empty)"}</code>
                  </pre>
                </>
              )}
            </li>
          );
        })}
      </ol>
    </div>
  );
}

function Comparison(props: {
  labels: Labels;
  rules: StructuredContact;
  model: StructuredContact | null;
}) {
  const { labels, rules, model } = props;
  if (!model) return null;
  const differing = CONTACT_FIELDS.filter(
    (field) => !sameValue(rules[field], model[field]),
  ).length;

  return (
    <div className="mt-5">
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <p className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
          {labels.comparison}
        </p>
        <p className="font-mono text-[10px] text-muted-foreground">
          {labels.comparisonSummary.replace("{count}", String(differing))}
        </p>
      </div>
      <div className="mt-2 overflow-x-auto rounded-lg border border-border/50">
        <table className="w-full min-w-[22rem] text-left text-xs">
          <thead className="bg-black/40 font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
            <tr>
              <th scope="col" className="px-3 py-2 font-medium">
                {labels.field}
              </th>
              <th scope="col" className="px-3 py-2 font-medium">
                {labels.rules}
              </th>
              <th scope="col" className="px-3 py-2 font-medium">
                {labels.model}
              </th>
              <th scope="col" className="sr-only">
                {labels.agree}
              </th>
            </tr>
          </thead>
          <tbody>
            {CONTACT_FIELDS.map((field) => {
              const agree = sameValue(rules[field], model[field]);
              return (
                <tr key={field} className="border-t border-border/40 align-top">
                  <th
                    scope="row"
                    className="px-3 py-2 font-mono font-medium text-primary/80"
                  >
                    {field}
                  </th>
                  <td className="break-all px-3 py-2 text-muted-foreground">
                    {rules[field] ?? <span className="opacity-50">null</span>}
                  </td>
                  <td
                    className={`break-all px-3 py-2 ${agree ? "text-muted-foreground" : "font-medium text-foreground"}`}
                  >
                    {model[field] ?? <span className="opacity-50">null</span>}
                  </td>
                  <td className="px-3 py-2 text-right">
                    <span
                      className={`font-mono text-[10px] ${agree ? "text-status-success" : "text-status-warning"}`}
                    >
                      {agree ? labels.agree : labels.differ}
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
