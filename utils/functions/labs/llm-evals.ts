export type TEvalSuiteId = "structured-json" | "grounded-answer" | "khmer-support";

export type TEvalTestId =
  | "valid-json"
  | "required-keys"
  | "required-facts"
  | "forbidden-claims"
  | "citation"
  | "khmer-script"
  | "max-length";

interface IEvalRule {
  id: TEvalTestId;
  weight: number;
  values?: string[];
  maxLength?: number;
}

export interface IEvalTestResult {
  id: TEvalTestId;
  passed: boolean;
  weight: number;
  detail: string;
}

export interface ICandidateEvaluation {
  score: number;
  passed: number;
  total: number;
  tests: IEvalTestResult[];
}

export interface IEvalComparison {
  suiteId: TEvalSuiteId;
  candidateA: ICandidateEvaluation;
  candidateB: ICandidateEvaluation;
  winner: "A" | "B" | "tie";
  meta: {
    mode: "deterministic";
    processingMs: number;
  };
}

const SUITES: Record<TEvalSuiteId, IEvalRule[]> = {
  "structured-json": [
    { id: "valid-json", weight: 30 },
    {
      id: "required-keys",
      weight: 35,
      values: ["status", "priority"],
    },
    { id: "forbidden-claims", weight: 15, values: ["maybe", "probably"] },
    { id: "max-length", weight: 20, maxLength: 220 },
  ],
  "grounded-answer": [
    {
      id: "required-facts",
      weight: 35,
      values: ["PostgreSQL", "pgvector"],
    },
    { id: "citation", weight: 25 },
    {
      id: "forbidden-claims",
      weight: 20,
      values: ["guaranteed", "always correct", "zero risk"],
    },
    { id: "max-length", weight: 20, maxLength: 320 },
  ],
  "khmer-support": [
    { id: "khmer-script", weight: 35 },
    {
      id: "required-facts",
      weight: 30,
      values: ["ភ្នំពេញ", "វិស្វករសូហ្វវែរ"],
    },
    {
      id: "forbidden-claims",
      weight: 15,
      values: ["Bangkok", "Singapore"],
    },
    { id: "max-length", weight: 20, maxLength: 260 },
  ],
};

export function isEvalSuiteId(value: string): value is TEvalSuiteId {
  return value in SUITES;
}

function parseJson(value: string): Record<string, unknown> | null {
  try {
    const parsed: unknown = JSON.parse(value);
    return typeof parsed === "object" && parsed !== null && !Array.isArray(parsed)
      ? (parsed as Record<string, unknown>)
      : null;
  } catch {
    return null;
  }
}

function runRule(response: string, rule: IEvalRule): IEvalTestResult {
  const normalized = response.toLowerCase();
  let passed = false;
  let detail = "";

  switch (rule.id) {
    case "valid-json": {
      passed = parseJson(response) !== null;
      detail = passed ? "parse: success" : "parse: failed";
      break;
    }
    case "required-keys": {
      const parsed = parseJson(response);
      const missing = (rule.values ?? []).filter(
        (key) => !parsed || !(key in parsed),
      );
      passed = missing.length === 0;
      detail = passed ? "all keys present" : `missing: ${missing.join(", ")}`;
      break;
    }
    case "required-facts": {
      const missing = (rule.values ?? []).filter(
        (fact) => !normalized.includes(fact.toLowerCase()),
      );
      passed = missing.length === 0;
      detail = passed ? "all facts present" : `missing: ${missing.join(", ")}`;
      break;
    }
    case "forbidden-claims": {
      const found = (rule.values ?? []).filter((claim) =>
        normalized.includes(claim.toLowerCase()),
      );
      passed = found.length === 0;
      detail = passed ? "no forbidden claims" : `found: ${found.join(", ")}`;
      break;
    }
    case "citation": {
      passed = /\[\d+\]/.test(response);
      detail = passed ? "citation found" : "citation missing";
      break;
    }
    case "khmer-script": {
      passed = /[\u1780-\u17ff]/.test(response);
      detail = passed ? "Khmer text found" : "Khmer text missing";
      break;
    }
    case "max-length": {
      const limit = rule.maxLength ?? 0;
      passed = response.length <= limit;
      detail = `${response.length}/${limit} characters`;
      break;
    }
  }

  return { id: rule.id, passed, weight: rule.weight, detail };
}

function evaluateCandidate(
  response: string,
  rules: IEvalRule[],
): ICandidateEvaluation {
  const tests = rules.map((rule) => runRule(response, rule));
  const total = tests.reduce((sum, test) => sum + test.weight, 0);
  const passed = tests
    .filter((test) => test.passed)
    .reduce((sum, test) => sum + test.weight, 0);

  return {
    score: Math.round((passed / total) * 100),
    passed,
    total,
    tests,
  };
}

export function compareEvalCandidates(
  suiteId: TEvalSuiteId,
  candidateA: string,
  candidateB: string,
): IEvalComparison {
  const startedAt = performance.now();
  const rules = SUITES[suiteId];
  const evaluationA = evaluateCandidate(candidateA, rules);
  const evaluationB = evaluateCandidate(candidateB, rules);

  return {
    suiteId,
    candidateA: evaluationA,
    candidateB: evaluationB,
    winner:
      evaluationA.score === evaluationB.score
        ? "tie"
        : evaluationA.score > evaluationB.score
          ? "A"
          : "B",
    meta: {
      mode: "deterministic",
      processingMs: Math.max(1, Math.round(performance.now() - startedAt)),
    },
  };
}
