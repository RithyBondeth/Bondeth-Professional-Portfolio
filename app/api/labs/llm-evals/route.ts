import { NextResponse } from "next/server";
import {
  compareEvalCandidates,
  isEvalSuiteId,
} from "@/utils/functions/labs/llm-evals";
import { rateLimit, getClientId } from "@/utils/functions/rate-limit";

const MAX_RESPONSE_LENGTH = 3000;
const RATE_LIMIT = 30;
const RATE_WINDOW_MS = 60_000;

export async function POST(request: Request) {
  const { allowed, retryAfter } = rateLimit(
    `labs-evals:${getClientId(request)}`,
    RATE_LIMIT,
    RATE_WINDOW_MS,
  );
  if (!allowed) {
    return NextResponse.json(
      { error: "Too many requests. Please slow down." },
      { status: 429, headers: { "Retry-After": String(retryAfter) } },
    );
  }

  let payload: unknown;

  try {
    payload = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  if (typeof payload !== "object" || payload === null) {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  const suiteId =
    "suiteId" in payload && typeof payload.suiteId === "string"
      ? payload.suiteId
      : "";
  const candidateA =
    "candidateA" in payload && typeof payload.candidateA === "string"
      ? payload.candidateA.trim()
      : "";
  const candidateB =
    "candidateB" in payload && typeof payload.candidateB === "string"
      ? payload.candidateB.trim()
      : "";

  if (!isEvalSuiteId(suiteId)) {
    return NextResponse.json({ error: "Unknown evaluation suite." }, { status: 400 });
  }

  if (!candidateA || !candidateB) {
    return NextResponse.json(
      { error: "Both candidate responses are required." },
      { status: 400 },
    );
  }

  if (
    candidateA.length > MAX_RESPONSE_LENGTH ||
    candidateB.length > MAX_RESPONSE_LENGTH
  ) {
    return NextResponse.json(
      { error: `Each response must be ${MAX_RESPONSE_LENGTH} characters or fewer.` },
      { status: 400 },
    );
  }

  return NextResponse.json(
    compareEvalCandidates(suiteId, candidateA, candidateB),
  );
}
