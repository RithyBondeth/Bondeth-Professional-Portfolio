export const SERVICE_VALUES = [
  "AI assistant",
  "mobile application",
  "API development",
  "website development",
] as const;
export const URGENCY_VALUES = ["high", "normal", "low"] as const;
export const CONTACT_FIELDS = ["name", "email", "service", "urgency"] as const;

export interface StructuredContact {
  name: string | null;
  email: string | null;
  service: (typeof SERVICE_VALUES)[number] | null;
  urgency: (typeof URGENCY_VALUES)[number] | null;
}

export type ContactField = (typeof CONTACT_FIELDS)[number];

export type SchemaIssueCode =
  | "parse-failed"
  | "not-object"
  | "missing-key"
  | "unknown-key"
  | "wrong-type"
  | "invalid-email"
  | "not-in-enum";

export interface SchemaIssue {
  code: SchemaIssueCode;
  /** The offending key; absent for whole-document issues. */
  field?: string;
}

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/**
 * Strict check of a model's raw text against the contact schema. Reports every
 * issue rather than the first, because the list is what the repair prompt
 * sends back to the model.
 */
export function validateContactJson(raw: string): {
  data: StructuredContact | null;
  issues: SchemaIssue[];
} {
  let parsed: unknown;
  try {
    parsed = JSON.parse(raw);
  } catch {
    return { data: null, issues: [{ code: "parse-failed" }] };
  }
  if (typeof parsed !== "object" || parsed === null || Array.isArray(parsed)) {
    return { data: null, issues: [{ code: "not-object" }] };
  }

  const record = parsed as Record<string, unknown>;
  const issues: SchemaIssue[] = [];
  for (const key of Object.keys(record)) {
    if (!(CONTACT_FIELDS as readonly string[]).includes(key)) {
      issues.push({ code: "unknown-key", field: key });
    }
  }
  for (const field of CONTACT_FIELDS) {
    if (!(field in record)) {
      issues.push({ code: "missing-key", field });
      continue;
    }
    const value = record[field];
    if (value === null) continue;
    if (typeof value !== "string" || !value.trim()) {
      issues.push({ code: "wrong-type", field });
    } else if (field === "email" && !EMAIL_PATTERN.test(value)) {
      issues.push({ code: "invalid-email", field });
    } else if (
      (field === "service" &&
        !(SERVICE_VALUES as readonly string[]).includes(value)) ||
      (field === "urgency" &&
        !(URGENCY_VALUES as readonly string[]).includes(value))
    ) {
      issues.push({ code: "not-in-enum", field });
    }
  }

  if (issues.length) return { data: null, issues };
  return {
    data: {
      name: (record.name as string | null)?.trim() ?? null,
      email: (record.email as string | null)?.trim() ?? null,
      service: record.service as StructuredContact["service"],
      urgency: record.urgency as StructuredContact["urgency"],
    },
    issues: [],
  };
}

/** Fields the schema allows as null but a usable inquiry still needs. */
export function missingContactFields(data: StructuredContact): ContactField[] {
  return CONTACT_FIELDS.filter((field) => data[field] === null);
}

export interface StructuredOutputResult {
  data: StructuredContact;
  validation: {
    valid: boolean;
    missingFields: Array<keyof StructuredContact>;
  };
  meta: {
    mode: "local-demo";
    detectedLanguage: "en" | "km";
    processingMs: number;
  };
}

const SERVICE_PATTERNS = [
  {
    value: "AI assistant",
    pattern: /\b(ai assistant|chatbot|llm|rag)\b|ជំនួយការ\s*AI/i,
  },
  {
    value: "mobile application",
    pattern:
      /\b(mobile app|mobile application|flutter|ios|android)\b|កម្មវិធីទូរស័ព្ទ/i,
  },
  {
    value: "API development",
    pattern: /\b(api|backend|integration)\b|ប្រព័ន្ធ\s*API/i,
  },
  {
    value: "website development",
    pattern:
      /\b(website|web app|web application|landing page)\b|គេហទំព័រ|កម្មវិធីវែប/i,
  },
] as const;

function extractName(input: string): string | null {
  const english = input.match(
    /\b(?:my name is|i am|i'm)\s+([a-z][a-z'-]*(?:\s+[a-z][a-z'-]*)?)/i,
  );
  if (english?.[1]) return english[1].trim();

  const khmer = input.match(/ខ្ញុំឈ្មោះ\s*([^\s,។]+(?:\s+[^\s,។]+)?)/);
  return khmer?.[1]?.trim() ?? null;
}

function extractService(input: string): StructuredContact["service"] {
  return (
    SERVICE_PATTERNS.find(({ pattern }) => pattern.test(input))?.value ?? null
  );
}

function extractUrgency(input: string): StructuredContact["urgency"] {
  if (
    /\b(no rush|not urgent|low priority|whenever)\b|មិនបន្ទាន់/i.test(input)
  ) {
    return "low";
  }
  if (
    /\b(urgent|urgently|asap|immediately|high priority)\b|បន្ទាន់/i.test(input)
  ) {
    return "high";
  }
  if (/\b(normal|standard|this month|next month)\b|ធម្មតា/i.test(input)) {
    return "normal";
  }
  return null;
}

export function extractStructuredContact(
  input: string,
): StructuredOutputResult {
  const startedAt = performance.now();
  const email = input.match(/[^\s@]+@[^\s@]+\.[^\s@.,។]+/)?.[0] ?? null;

  const data: StructuredContact = {
    name: extractName(input),
    email,
    service: extractService(input),
    urgency: extractUrgency(input),
  };

  const missingFields = missingContactFields(data);

  return {
    data,
    validation: {
      valid: missingFields.length === 0,
      missingFields,
    },
    meta: {
      mode: "local-demo",
      detectedLanguage: /[\u1780-\u17ff]/.test(input) ? "km" : "en",
      processingMs: Math.max(1, Math.round(performance.now() - startedAt)),
    },
  };
}
