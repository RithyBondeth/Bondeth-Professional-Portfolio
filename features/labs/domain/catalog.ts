import type { Dictionary } from "@/shared/i18n";

/** Browser- and framework-independent metadata shared by the UI and chatbot. */
export function getLabDefinitions(labs: Dictionary["labs"]) {
  return {
    "structured-output": {
      path: "/labs/structured-output",
      title: labs.structuredOutputTitle,
      /** Calls a hosted model, so it is not free to run like the others. */
      usesLiveModel: true,
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
