import type { Dictionary } from "@/shared/i18n";

/** Browser- and framework-independent metadata shared by the UI and chatbot. */
export function getLabDefinitions(labs: Dictionary["labs"]) {
  return {
    "structured-output": {
      path: "/labs/structured-output",
      title: labs.structuredOutputTitle,
      description: labs.structuredOutputDescription,
    },
    "rag-retrieval": {
      path: "/labs/rag-retrieval",
      featured: labs.signatureDemo,
      title: labs.ragTitle,
      description: labs.ragDescription,
    },
    "llm-evals": {
      path: "/labs/llm-evals",
      title: labs.evalTitle,
      description: labs.evalDescription,
    },
  };
}
