import { NextResponse } from "next/server";
import { extractStructuredContact } from "@/utils/functions/labs/structured-output";
import { rateLimit, getClientId } from "@/utils/functions/rate-limit";

const MAX_INPUT_LENGTH = 2000;
const RATE_LIMIT = 30;
const RATE_WINDOW_MS = 60_000;

export async function POST(request: Request) {
  const { allowed, retryAfter } = rateLimit(
    `labs-structured:${getClientId(request)}`,
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

  const input =
    typeof payload === "object" &&
    payload !== null &&
    "input" in payload &&
    typeof payload.input === "string"
      ? payload.input.trim()
      : "";

  if (!input) {
    return NextResponse.json({ error: "Input is required." }, { status: 400 });
  }

  if (input.length > MAX_INPUT_LENGTH) {
    return NextResponse.json(
      { error: `Input must be ${MAX_INPUT_LENGTH} characters or fewer.` },
      { status: 400 },
    );
  }

  return NextResponse.json(extractStructuredContact(input));
}
