export interface IRetrievalChunk {
  id: string;
  title: string;
  content: string;
  score: number;
  matchedTerms: string[];
}

export interface IRetrievalResult {
  query: string;
  queryTerms: string[];
  chunks: IRetrievalChunk[];
  meta: {
    mode: "keyword-demo";
    corpusSize: number;
    retrievedCount: number;
    processingMs: number;
  };
}

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
      "រិទ្ធី បណ្ឌេត ជាវិស្វករសូហ្វវែរ និង AI នៅរាជធានីភ្នំពេញ។ គាត់អភិវឌ្ឍកម្មវិធីវែប កម្មវិធីទូរស័ព្ទ និងប្រព័ន្ធ AI។",
  },
  {
    id: "khmer-education",
    title: "ការសិក្សា",
    content:
      "រិទ្ធី បណ្ឌេត បានសិក្សានៅបណ្ឌិត្យសភាបច្ចេកវិទ្យាឌីជីថលកម្ពុជា បញ្ចប់បរិញ្ញាបត្រវិទ្យាសាស្ត្រកុំព្យូទ័រ និងជានិស្សិតអាហារូបករណ៍ Techo Scholar។",
  },
] as const;

const STOP_WORDS = new Set([
  "a",
  "an",
  "and",
  "are",
  "at",
  "does",
  "he",
  "his",
  "how",
  "in",
  "is",
  "of",
  "the",
  "to",
  "what",
  "where",
  "which",
  "who",
]);

function tokenize(value: string): string[] {
  return [
    ...new Set(
      value
        .toLowerCase()
        .replace(/[^\p{L}\p{M}\p{N}.+#]+/gu, " ")
        .split(/\s+/)
        .map((term) => term.trim())
        .filter((term) => term.length > 1 && !STOP_WORDS.has(term)),
    ),
  ];
}

function scoreChunk(
  terms: string[],
  chunk: (typeof CORPUS)[number],
): IRetrievalChunk | null {
  const searchable = `${chunk.title} ${chunk.content}`.toLowerCase();
  const matchedTerms = terms.filter((term) => searchable.includes(term));
  if (matchedTerms.length === 0) return null;

  const coverage = matchedTerms.length / Math.max(terms.length, 1);
  const density = matchedTerms.reduce((total, term) => {
    return total + searchable.split(term).length - 1;
  }, 0);
  const score = Math.min(0.99, coverage * 0.8 + Math.min(density, 4) * 0.05);

  return {
    ...chunk,
    score: Number(score.toFixed(2)),
    matchedTerms,
  };
}

export function retrievePortfolioContext(
  query: string,
  limit = 3,
): IRetrievalResult {
  const startedAt = performance.now();
  const queryTerms = tokenize(query);
  const chunks = CORPUS.map((chunk) => scoreChunk(queryTerms, chunk))
    .filter((chunk): chunk is IRetrievalChunk => chunk !== null)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit);

  return {
    query,
    queryTerms,
    chunks,
    meta: {
      mode: "keyword-demo",
      corpusSize: CORPUS.length,
      retrievedCount: chunks.length,
      processingMs: Math.max(1, Math.round(performance.now() - startedAt)),
    },
  };
}
