import type {
  ContactField,
  SchemaIssue,
  StructuredContact,
} from "@/features/labs/domain/structured-output";

/** One call to the model and what the validator made of its reply. */
export interface ModelAttempt {
  attempt: number;
  /** The model's reply, verbatim (trimmed for display). */
  raw: string;
  issues: SchemaIssue[];
  latencyMs: number;
  tokens: number;
}

export interface ModelExtractionResult {
  data: StructuredContact | null;
  /** valid on the first call, valid after the repair call, or still invalid. */
  outcome: "valid" | "repaired" | "failed";
  missingFields: ContactField[];
  attempts: ModelAttempt[];
  meta: {
    mode: "live-model";
    model: string;
    totalMs: number;
    totalTokens: number;
    /** Served from this instance's cache of recent identical inputs. */
    cached: boolean;
  };
}
