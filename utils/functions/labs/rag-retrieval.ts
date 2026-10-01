export interface IRetrievalChunk {
  id: string;
  title: string;
  content: string;
  score: number;
  matchedTerms: string[];
  coverage: number;
  occurrences: number;
}

export interface IRetrievalSettings {
  topK: number;
  minScore: number;
  budget: number;
}

export type TRetrievalDecision = "selected" | "no-match" | "threshold" | "top-k" | "budget";
export interface IContextSelection {
  chunks: IRetrievalChunk[];
  decisions: { chunk: IRetrievalChunk; reason: TRetrievalDecision }[];
  context: string;
  usedCharacters: number;
}

export interface IRetrievalResult {
  query: string;
  queryTerms: string[];
  candidates: IRetrievalChunk[];
  chunks: IRetrievalChunk[];
  meta: {
    mode: "keyword-demo";
    corpusSize: number;
    retrievedCount: number;
    processingMs: number;
  };
}

export const DEFAULT_RETRIEVAL_SETTINGS: IRetrievalSettings = { topK: 3, minScore: 0.25, budget: 700 };
export const BASELINE_RETRIEVAL_SETTINGS: IRetrievalSettings = { topK: 3, minScore: 0, budget: 1200 };

const CORPUS = [
  {
    id: "profile",
    title: "Professional profile",
    content:
      "Rithy Bondeth is a full stack developer and AI engineer based in Phnom Penh, Cambodia. He builds web, mobile, and intelligent software systems.",
  },
  {
    id: "current-work",
    title: "Current work",
    content:
      "He works as a Software Engineer at the Digital Economy and Business Committee, contributing to production web and mobile public services.",
  },
  {
    id: "ai-focus",
    title: "AI engineering focus",
    content:
      "His AI interests include reliable structured outputs, retrieval augmented generation, RAG pipelines, agentic workflows, tool calling, and practical LLM evaluation.",
  },
  {
    id: "technology",
    title: "Technology stack",
    content:
      "His regular technology stack includes Next.js, React, TypeScript, NestJS, FastAPI, Python, PostgreSQL, Redis, Docker, and Flutter.",
  },
  {
    id: "education",
    title: "Education",
    content:
      "He studied Computer Science at the Cambodia Academy of Digital Technology, earned a bachelor degree, and received the merit-based Techo Scholar scholarship.",
  },
  {
    id: "khmer-profile",
    title: "ប្រវត្តិរូបសង្ខេប",
    content:
      "ហែម ឫទ្ធីបណ្ឌិត ជាវិស្វករសូហ្វវែរ និង AI នៅរាជធានីភ្នំពេញ។ គាត់អភិវឌ្ឍកម្មវិធីវែប កម្មវិធីទូរស័ព្ទ និងប្រព័ន្ធ AI។",
  },
  {
    id: "khmer-education",
    title: "ការសិក្សា",
    content:
      "ហែម ឫទ្ធីបណ្ឌិត បានសិក្សានៅបណ្ឌិត្យសភាបច្ចេកវិទ្យាឌីជីថលកម្ពុជា បញ្ចប់បរិញ្ញាបត្រវិទ្យាសាស្ត្រកុំព្យូទ័រ និងជានិស្សិតអាហារូបករណ៍ Techo Scholar។",
  },
] as const;

const STOP_WORDS = new Set([
  "a", "an", "and", "are", "at", "did", "do", "does", "he", "his", "how",
  "in", "is", "of", "on", "the", "to", "what", "where", "which", "who",
]);

/** Preserve technology names; segment Khmer words rather than matching substrings. */
function termsIn(value: string): string[] {
  const normalized = value.normalize("NFC").toLowerCase();
  const parts = normalized.replace(/[^\p{L}\p{M}\p{N}.+#]+/gu, " ").split(/\s+/).filter(Boolean);
  const segmenter = new Intl.Segmenter("km", { granularity: "word" });
  return parts.flatMap((part) => /[\u1780-\u17ff]/u.test(part)
    ? [...segmenter.segment(part)].filter((segment) => segment.isWordLike).map((segment) => segment.segment)
    : [part.replace(/^[.]+|[.]+$/g, "")]);
}

function scoreChunk(terms: string[], chunk: (typeof CORPUS)[number]): IRetrievalChunk {
  const searchable = termsIn(`${chunk.title} ${chunk.content}`);
  const counts = new Map<string, number>();
  for (const term of searchable) counts.set(term, (counts.get(term) ?? 0) + 1);
  const matchedTerms = terms.filter((term) => counts.has(term));
  const coverage = matchedTerms.length / Math.max(terms.length, 1);
  const occurrences = matchedTerms.reduce((total, term) => total + (counts.get(term) ?? 0), 0);
  const score = Math.min(0.99, coverage * 0.8 + Math.min(occurrences, 4) * 0.05);
  return { ...chunk, score, matchedTerms, coverage, occurrences };
}

/** Rank-first packing keeps whole source chunks and counts the citation headers too. */
export function assembleRetrievalContext(candidates: IRetrievalChunk[], settings: IRetrievalSettings): IContextSelection {
  const chunks: IRetrievalChunk[] = [];
  const parts: string[] = [];
  let usedCharacters = 0;
  const decisions = candidates.map((chunk) => {
    const part = `[${chunk.id}] ${chunk.title}\n${chunk.content}`;
    const cost = Array.from(part).length + (parts.length ? 2 : 0);
    let reason: TRetrievalDecision;
    if (chunk.matchedTerms.length === 0) reason = "no-match";
    else if (chunk.score < settings.minScore) reason = "threshold";
    else if (chunks.length >= settings.topK) reason = "top-k";
    else if (usedCharacters + cost > settings.budget) reason = "budget";
    else {
      reason = "selected";
      chunks.push(chunk);
      parts.push(part);
      usedCharacters += cost;
    }
    return { chunk, reason };
  });
  return { chunks, decisions, context: parts.join("\n\n"), usedCharacters };
}

export function retrievePortfolioContext(query: string, limit = 3): IRetrievalResult {
  const startedAt = performance.now();
  const queryTerms = [...new Set(termsIn(query).filter((term) => term.length > 1 && !STOP_WORDS.has(term)))];
  const candidates = CORPUS.map((chunk) => scoreChunk(queryTerms, chunk)).sort((a, b) => b.score - a.score);
  const chunks = candidates.filter((chunk) => chunk.matchedTerms.length > 0).slice(0, Math.max(0, limit));
  return {
    query, queryTerms, candidates, chunks,
    meta: { mode: "keyword-demo", corpusSize: CORPUS.length, retrievedCount: chunks.length,
      processingMs: Math.max(1, Math.round(performance.now() - startedAt)) },
  };
}
