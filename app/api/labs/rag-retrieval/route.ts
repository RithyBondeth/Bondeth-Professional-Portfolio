import { NextResponse } from "next/server";
import { retrievePortfolioContext } from "@/utils/functions/labs/rag-retrieval";
import { rateLimit, getClientId } from "@/utils/functions/rate-limit";

const MAX_QUERY_LENGTH = 300;
const RATE_LIMIT = 30;
const RATE_WINDOW_MS = 60_000;

export async function POST(request: Request) {
  const { allowed, retryAfter } = rateLimit(
    `labs-rag:${getClientId(request)}`,
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

  const query =
    typeof payload === "object" &&
    payload !== null &&
    "query" in payload &&
    typeof payload.query === "string"
      ? payload.query.trim()
      : "";

  if (!query) {
    return NextResponse.json({ error: "Query is required." }, { status: 400 });
  }

  if (query.length > MAX_QUERY_LENGTH) {
    return NextResponse.json(
      { error: `Query must be ${MAX_QUERY_LENGTH} characters or fewer.` },
      { status: 400 },
    );
  }

  return NextResponse.json(retrievePortfolioContext(query));
}
