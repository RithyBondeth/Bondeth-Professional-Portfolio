import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { test } from "node:test";
import vm from "node:vm";
import ts from "typescript";

const source = readFileSync(
  new URL("../features/labs/domain/structured-output.ts", import.meta.url),
  "utf8",
);
const code = ts.transpileModule(source, {
  compilerOptions: {
    module: ts.ModuleKind.CommonJS,
    target: ts.ScriptTarget.ES2022,
  },
}).outputText;
const api = {};
vm.runInNewContext(code, { exports: api, performance });
const { validateContactJson: validate, extractStructuredContact: extract } =
  api;

// Arrays built inside the vm context are not deep-equal to this realm's, so
// copy the issue codes out as plain strings.
const codes = (raw) =>
  Array.from(validate(raw).issues, (issue) =>
    issue.field ? `${issue.code}:${issue.field}` : issue.code,
  );

test("accepts a complete reply and nulls for unknown values", () => {
  const { data, issues } = validate(
    JSON.stringify({
      name: " Dara ",
      email: "dara.k@example.org",
      service: "AI assistant",
      urgency: null,
    }),
  );
  assert.equal(issues.length, 0);
  assert.equal(data.name, "Dara");
  assert.equal(data.urgency, null);
});

test("rejects text that is not a JSON object", () => {
  assert.deepEqual(codes("Sure! Here is the JSON"), ["parse-failed"]);
  assert.deepEqual(codes("[1, 2]"), ["not-object"]);
});

test("reports every schema issue, not just the first", () => {
  assert.deepEqual(
    codes(
      JSON.stringify({
        name: 42,
        email: "not-an-email",
        service: "chatbot",
        phone: "012 345 678",
      }),
    ),
    [
      "unknown-key:phone",
      "wrong-type:name",
      "invalid-email:email",
      "not-in-enum:service",
      "missing-key:urgency",
    ],
  );
});

test("treats empty strings as wrong type rather than a value", () => {
  assert.deepEqual(
    codes(
      JSON.stringify({ name: "", email: null, service: null, urgency: "low" }),
    ),
    ["wrong-type:name"],
  );
});

test("rules baseline misses phrasing the model prompt is meant to handle", () => {
  const result = extract(
    "hey! Dara here, dara.k@example.org. could a bot answer them? no huge rush",
  );
  assert.equal(result.data.email, "dara.k@example.org");
  assert.equal(result.data.name, null);
  assert.equal(result.data.service, null);
  assert.equal(result.data.urgency, null);
});
