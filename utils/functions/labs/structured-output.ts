export interface IStructuredContact {
  name: string | null;
  email: string | null;
  service: string | null;
  urgency: "high" | "normal" | "low" | null;
}

export interface IStructuredOutputResult {
  data: IStructuredContact;
  validation: {
    valid: boolean;
    missingFields: Array<keyof IStructuredContact>;
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
    pattern: /\b(mobile app|mobile application|flutter|ios|android)\b|កម្មវិធីទូរស័ព្ទ/i,
  },
  {
    value: "API development",
    pattern: /\b(api|backend|integration)\b|ប្រព័ន្ធ\s*API/i,
  },
  {
    value: "website development",
    pattern: /\b(website|web app|web application|landing page)\b|គេហទំព័រ|កម្មវិធីវែប/i,
  },
] as const;

function extractName(input: string): string | null {
  const english = input.match(
    /\b(?:my name is|i am|i'm)\s+([a-z][a-z'-]*(?:\s+[a-z][a-z'-]*)?)/i,
  );
  if (english?.[1]) return english[1].trim();

  const khmer = input.match(
    /ខ្ញុំឈ្មោះ\s*([^\s,។]+(?:\s+[^\s,។]+)?)/,
  );
  return khmer?.[1]?.trim() ?? null;
}

function extractService(input: string): string | null {
  return (
    SERVICE_PATTERNS.find(({ pattern }) => pattern.test(input))?.value ?? null
  );
}

function extractUrgency(
  input: string,
): IStructuredContact["urgency"] {
  if (/\b(no rush|not urgent|low priority|whenever)\b|មិនបន្ទាន់/i.test(input)) {
    return "low";
  }
  if (/\b(urgent|urgently|asap|immediately|high priority)\b|បន្ទាន់/i.test(input)) {
    return "high";
  }
  if (/\b(normal|standard|this month|next month)\b|ធម្មតា/i.test(input)) {
    return "normal";
  }
  return null;
}

export function extractStructuredContact(
  input: string,
): IStructuredOutputResult {
  const startedAt = performance.now();
  const email = input.match(/[^\s@]+@[^\s@]+\.[^\s@.,។]+/)?.[0] ?? null;

  const data: IStructuredContact = {
    name: extractName(input),
    email,
    service: extractService(input),
    urgency: extractUrgency(input),
  };

  const missingFields = (
    Object.entries(data) as Array<
      [keyof IStructuredContact, IStructuredContact[keyof IStructuredContact]]
    >
  )
    .filter(([, value]) => value === null)
    .map(([key]) => key);

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
