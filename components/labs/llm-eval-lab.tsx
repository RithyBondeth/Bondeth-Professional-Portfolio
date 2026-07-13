"use client";

import { useState } from "react";
import { track } from "@vercel/analytics";
import type {
  IEvalComparison,
  IEvalTestResult,
  TEvalSuiteId,
} from "@/utils/functions/labs/llm-evals";
import type { TDictionary } from "@/utils/i18n";

type TStatus = "idle" | "loading" | "success" | "error";

export function LlmEvalLab(props: {
  labels: TDictionary["labs"]["evals"];
}) {
  const { labels } = props;
  const [selectedIndex, setSelectedIndex] = useState(0);
  const selected = labels.presets[selectedIndex];
  const [candidateA, setCandidateA] = useState(selected.candidateA);
  const [candidateB, setCandidateB] = useState(selected.candidateB);
  const [status, setStatus] = useState<TStatus>("idle");
  const [result, setResult] = useState<IEvalComparison | null>(null);
  const [error, setError] = useState<string | null>(null);

  function selectSuite(index: number) {
    const preset = labels.presets[index];
    setSelectedIndex(index);
    setCandidateA(preset.candidateA);
    setCandidateB(preset.candidateB);
    setResult(null);
    setStatus("idle");
    setError(null);
  }

  async function runEvaluation() {
    if (!candidateA.trim() || !candidateB.trim() || status === "loading") {
      return;
    }

    setStatus("loading");
    setError(null);

    try {
      const response = await fetch("/api/labs/llm-evals", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          suiteId: selected.suiteId as TEvalSuiteId,
          candidateA,
          candidateB,
        }),
      });
      const body = await response.json();

      if (!response.ok) {
        setError(body?.error ?? labels.error);
        setStatus("error");
        return;
      }

      setResult(body);
      setStatus("success");
      track("lab_run", { lab: "llm-evals", suite: selected.suiteId });
    } catch {
      setError(labels.error);
      setStatus("error");
    }
  }

  return (
    <div>
      <section className="rounded border border-border/60 bg-card p-5 sm:p-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-primary">
              01 / test-suite
            </p>
            <h2 className="mt-2 text-lg font-semibold text-foreground">
              {labels.suiteHeading}
            </h2>
          </div>
          <span className="rounded-full border border-emerald-500/20 bg-emerald-500/5 px-3 py-1 font-mono text-[10px] text-emerald-500">
            {labels.localMode}
          </span>
        </div>

        <div className="mt-5 flex flex-wrap gap-2">
          {labels.presets.map((preset, index) => (
            <button
              key={preset.suiteId}
              type="button"
              aria-pressed={selectedIndex === index}
              onClick={() => selectSuite(index)}
              className={`min-h-11 rounded border px-3 font-mono text-xs transition-colors ${
                selectedIndex === index
                  ? "border-primary bg-primary text-primary-foreground"
                  : "border-border/60 bg-background text-muted-foreground hover:border-primary/30 hover:text-primary"
              }`}
            >
              {preset.label}
            </button>
          ))}
        </div>

        <div className="mt-5 rounded border border-border/50 bg-background p-4">
          <p className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
            {labels.prompt}
          </p>
          <p className="mt-2 text-sm leading-relaxed text-foreground">
            {selected.prompt}
          </p>
        </div>

        <div className="mt-6 grid gap-5 lg:grid-cols-2">
          <CandidateEditor
            id="candidate-a"
            label={`${labels.candidate} A`}
            value={candidateA}
            onChange={setCandidateA}
          />
          <CandidateEditor
            id="candidate-b"
            label={`${labels.candidate} B`}
            value={candidateB}
            onChange={setCandidateB}
          />
        </div>

        <p className="mt-3 text-xs leading-relaxed text-muted-foreground">
          {labels.privacy}
        </p>

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
          disabled={
            !candidateA.trim() || !candidateB.trim() || status === "loading"
          }
          onClick={runEvaluation}
          className="mt-6 flex min-h-12 w-full items-center justify-center gap-2 rounded bg-primary px-5 font-mono text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-50"
        >
          <span aria-hidden>✓</span>
          {status === "loading" ? labels.running : labels.run}
        </button>
      </section>

      <section
        aria-live="polite"
        className="mt-6 rounded border border-border/60 bg-[#050914] p-5 sm:p-6"
      >
        <p className="font-code text-[10px] uppercase tracking-[0.2em] text-primary">
          02 / evaluation-report
        </p>
        <h2 className="mt-2 text-lg font-semibold text-foreground">
          {labels.resultsHeading}
        </h2>

        {!result ? (
          <div className="mt-5 flex min-h-64 items-center justify-center rounded border border-dashed border-border/50 bg-black/30 p-8 text-center">
            <p className="max-w-sm font-mono text-xs leading-relaxed text-muted-foreground">
              {labels.emptyResults}
            </p>
          </div>
        ) : (
          <>
            <div className="mt-5 grid gap-4 sm:grid-cols-2">
              <ScoreCard
                label={`${labels.candidate} A`}
                score={result.candidateA.score}
                winner={result.winner === "A"}
                winnerLabel={labels.winner}
              />
              <ScoreCard
                label={`${labels.candidate} B`}
                score={result.candidateB.score}
                winner={result.winner === "B"}
                winnerLabel={labels.winner}
              />
            </div>

            {result.winner === "tie" && (
              <p className="mt-4 rounded border border-primary/20 bg-primary/5 p-3 text-center font-mono text-xs text-primary">
                {labels.tie}
              </p>
            )}

            <div className="mt-5 overflow-x-auto rounded border border-border/50">
              <table className="w-full min-w-[560px] border-collapse text-left text-xs">
                <thead className="bg-card/70 font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
                  <tr>
                    <th className="px-4 py-3">{labels.test}</th>
                    <th className="px-4 py-3">{labels.candidate} A</th>
                    <th className="px-4 py-3">{labels.candidate} B</th>
                    <th className="px-4 py-3">{labels.weight}</th>
                  </tr>
                </thead>
                <tbody>
                  {result.candidateA.tests.map((testA, index) => {
                    const testB = result.candidateB.tests[index];
                    return (
                      <tr
                        key={testA.id}
                        className="border-t border-border/40 text-muted-foreground"
                      >
                        <td className="px-4 py-3 font-medium text-foreground">
                          {labels.testLabels[testA.id]}
                        </td>
                        <td className="px-4 py-3">
                          <TestStatus
                            passed={testA.passed}
                            detail={formatTestDetail(testA, labels)}
                            labels={labels}
                          />
                        </td>
                        <td className="px-4 py-3">
                          <TestStatus
                            passed={testB.passed}
                            detail={formatTestDetail(testB, labels)}
                            labels={labels}
                          />
                        </td>
                        <td className="px-4 py-3 font-mono">
                          {testA.weight}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            <p className="mt-4 text-right font-mono text-[10px] text-muted-foreground">
              {result.meta.processingMs}ms · deterministic
            </p>
          </>
        )}
      </section>
    </div>
  );
}

function formatTestDetail(
  test: IEvalTestResult,
  labels: TDictionary["labs"]["evals"],
): string {
  const { detail } = test;
  const template = labels.detailLabels[detail.code];

  if (detail.code === "missing" || detail.code === "found") {
    return `${template}: ${detail.values?.join(", ") ?? "—"}`;
  }
  if (detail.code === "character-count") {
    return `${detail.current}/${detail.limit} ${template}`;
  }
  return template;
}

function CandidateEditor(props: {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
}) {
  const { id, label, value, onChange } = props;
  return (
    <div>
      <label
        htmlFor={id}
        className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground"
      >
        {label}
      </label>
      <textarea
        id={id}
        value={value}
        onChange={(event) => onChange(event.currentTarget.value)}
        maxLength={3000}
        rows={8}
        className="mt-2 w-full resize-y rounded border border-border/60 bg-background p-4 font-mono text-xs leading-6 text-foreground focus:border-primary/50 focus:outline-none focus:ring-1 focus:ring-primary/30"
      />
      <p className="mt-1 text-right font-mono text-[10px] text-muted-foreground">
        {value.length}/3,000
      </p>
    </div>
  );
}

function ScoreCard(props: {
  label: string;
  score: number;
  winner: boolean;
  winnerLabel: string;
}) {
  const { label, score, winner, winnerLabel } = props;
  return (
    <div
      className={`rounded border p-5 ${
        winner
          ? "border-emerald-500/30 bg-emerald-500/5"
          : "border-border/50 bg-black/30"
      }`}
    >
      <div className="flex items-center justify-between gap-3">
        <p className="font-mono text-xs text-muted-foreground">{label}</p>
        {winner && (
          <span className="rounded bg-emerald-500/10 px-2 py-1 font-mono text-[10px] text-emerald-400">
            {winnerLabel}
          </span>
        )}
      </div>
      <p className="mt-3 text-4xl font-bold text-foreground">{score}%</p>
      <div className="mt-3 h-2 overflow-hidden rounded-full bg-border">
        <div
          className={`h-full rounded-full ${
            score >= 80
              ? "bg-emerald-400"
              : score >= 50
                ? "bg-amber-400"
                : "bg-red-400"
          }`}
          style={{ width: `${score}%` }}
        />
      </div>
    </div>
  );
}

function TestStatus(props: {
  passed: boolean;
  detail: string;
  labels: TDictionary["labs"]["evals"];
}) {
  const { passed, detail, labels } = props;
  return (
    <div>
      <span
        className={
          passed
            ? "font-mono text-emerald-400"
            : "font-mono text-red-400"
        }
      >
        {passed ? `✓ ${labels.pass}` : `✕ ${labels.fail}`}
      </span>
      <p className="mt-1 text-[10px] text-muted-foreground">{detail}</p>
    </div>
  );
}
