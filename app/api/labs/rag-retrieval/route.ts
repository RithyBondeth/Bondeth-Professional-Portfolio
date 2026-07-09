import { NextResponse } from "next/server";
import { retrievePortfolioContext } from "@/utils/functions/labs/rag-retrieval";

const MAX_QUERY_LENGTH = 300;

export async function POST(request: Request) {
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
