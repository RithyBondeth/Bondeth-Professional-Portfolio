import { NextResponse } from "next/server";
import { extractStructuredContact } from "@/utils/functions/labs/structured-output";

const MAX_INPUT_LENGTH = 2000;

export async function POST(request: Request) {
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
