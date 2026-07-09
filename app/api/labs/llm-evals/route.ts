import { NextResponse } from "next/server";
import {
  compareEvalCandidates,
  isEvalSuiteId,
} from "@/utils/functions/labs/llm-evals";

const MAX_RESPONSE_LENGTH = 3000;

export async function POST(request: Request) {
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
