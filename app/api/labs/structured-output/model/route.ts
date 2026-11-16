import { NextResponse } from "next/server";
import {
  extractWithModel,
  ModelExtractionError,
} from "@/features/labs/server/model-extraction";
import { rateLimit, getClientId } from "@/shared/server/rate-limit";

export const maxDuration = 30;

const MAX_INPUT_LENGTH = 2000;
/** Tighter than the rules endpoint: every call here spends real tokens. */
const RATE_LIMIT = 8;
const RATE_WINDOW_MS = 60_000;

const ERRORS: Record<ModelExtractionError["kind"], [string, number]> = {
  "not-configured": ["The live model is not configured.", 503],
  budget: ["Today's live-model budget is used up. Try again tomorrow.", 503],
  timeout: ["The model took too long to answer.", 504],
  upstream: ["The model could not answer right now.", 502],
};

function noStoreJson(body: unknown, status = 200, headers = {}) {
  return NextResponse.json(body, {
    status,
    headers: { "Cache-Control": "no-store", ...headers },
  });
}

export async function POST(request: Request) {
  const { allowed, retryAfter } = rateLimit(
    `labs-structured-model:${getClientId(request)}`,
    RATE_LIMIT,
    RATE_WINDOW_MS,
  );
  if (!allowed) {
    return noStoreJson(
      { error: "Too many live-model runs. Please wait a moment." },
      429,
      { "Retry-After": String(retryAfter) },
    );
  }

  let payload: unknown;
  try {
    payload = await request.json();
  } catch {
    return noStoreJson({ error: "Invalid request body." }, 400);
  }

  const input =
    typeof payload === "object" &&
    payload !== null &&
    "input" in payload &&
    typeof payload.input === "string"
      ? payload.input.trim()
      : "";

  if (!input) return noStoreJson({ error: "Input is required." }, 400);
  if (input.length > MAX_INPUT_LENGTH) {
    return noStoreJson(
      { error: `Input must be ${MAX_INPUT_LENGTH} characters or fewer.` },
      400,
    );
  }

  try {
    return noStoreJson(await extractWithModel(input));
  } catch (error) {
    const kind =
      error instanceof ModelExtractionError ? error.kind : "upstream";
    if (kind !== "not-configured")
      console.error(`Labs model extraction: ${kind}`);
    const [message, status] = ERRORS[kind];
    return noStoreJson({ error: message, kind }, status);
  }
}
