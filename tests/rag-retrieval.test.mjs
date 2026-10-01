import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { test } from "node:test";
import vm from "node:vm";
import ts from "typescript";

const source = readFileSync(new URL("../utils/functions/labs/rag-retrieval.ts", import.meta.url), "utf8");
const code = ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 } }).outputText;
const api = {};
vm.runInNewContext(code, { exports: api, performance });
const { retrievePortfolioContext: retrieve, assembleRetrievalContext: assemble, DEFAULT_RETRIEVAL_SETTINGS: defaults } = api;

test("whole-word scoring avoids substring matches and preserves technology names", () => {
  const result = retrieve("AI calling Next.js");
  const focus = result.candidates.find((chunk) => chunk.id === "ai-focus");
  assert.equal(focus.occurrences, 3); // AI in title + body, and calling in body.
  const technology = result.candidates.find((chunk) => chunk.id === "technology");
  assert.ok(technology.matchedTerms.includes("next.js"));
  assert.equal(retrieve("AI").candidates.find((chunk) => chunk.id === "ai-focus").occurrences, 2);
});

test("Khmer queries without spaces are segmented into searchable words", () => {
  const result = retrieve("ការសិក្សា");
  assert.ok(result.chunks.some((chunk) => chunk.id === "khmer-education"));
  assert.ok(result.queryTerms.length > 0);
});

test("context decisions explain threshold, top-k and budget exclusions", () => {
  const candidates = retrieve("AI").candidates;
  const limited = assemble(candidates, { ...defaults, topK: 1, minScore: 0, budget: 1200 });
  assert.equal(limited.chunks.length, 1);
  assert.ok(limited.decisions.some((decision) => decision.reason === "top-k"));
  const strict = assemble(candidates, { ...defaults, minScore: 0.99 });
  assert.equal(strict.chunks.length, 0);
  assert.ok(strict.decisions.some((decision) => decision.reason === "threshold"));
  const tiny = assemble(candidates, { ...defaults, budget: 1 });
  assert.equal(tiny.chunks.length, 0);
  assert.ok(tiny.decisions.some((decision) => decision.reason === "budget"));
});

test("budget includes citation headers and separators; complete sources stay intact", () => {
  const candidates = retrieve("AI").candidates;
  const result = assemble(candidates, { ...defaults, minScore: 0, budget: 1200 });
  assert.equal(result.usedCharacters, Array.from(result.context).length);
  assert.ok(result.usedCharacters <= 1200);
  for (const chunk of result.chunks) {
    assert.ok(result.context.includes(`[${chunk.id}] ${chunk.title}\n${chunk.content}`));
  }
  const exactCost = Array.from(`[${candidates[0].id}] ${candidates[0].title}\n${candidates[0].content}`).length;
  assert.equal(assemble(candidates, { ...defaults, budget: exactCost }).chunks[0].id, candidates[0].id);
  assert.ok(!assemble(candidates, { ...defaults, budget: exactCost - 1 }).chunks.some((chunk) => chunk.id === candidates[0].id));
});

test("missing information and stop-word queries produce no fabricated context", () => {
  for (const query of ["What are the hourly consulting rates?", "what is the", "", "🪐"]) {
    const result = retrieve(query);
    assert.equal(result.candidates.length, 7);
    assert.equal(assemble(result.candidates, { ...defaults, minScore: 0 }).context, "");
  }
});

test("ranking and decisions are deterministic apart from measured timing", () => {
  const first = retrieve("AI AI engineering");
  const second = retrieve("AI engineering");
  assert.equal(JSON.stringify(first.candidates), JSON.stringify(second.candidates));
  assert.equal(JSON.stringify(assemble(first.candidates, defaults)), JSON.stringify(assemble(second.candidates, defaults)));
});
