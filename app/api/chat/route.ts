import { NextResponse } from "next/server";
import { buildChatbotSystemPrompt } from "@/utils/chatbot/knowledge";
import { getClientId, rateLimit } from "@/utils/functions/rate-limit";

type ChatRole = "assistant" | "user";

type ChatMessage = {
  role: ChatRole;
  content: string;
};

type MistralContentChunk = {
  text?: unknown;
  content?: unknown;
};

type MistralResponse = {
  choices?: Array<{
    message?: {
      content?: unknown;
    };
  }>;
};

const MISTRAL_CHAT_URL = "https://api.mistral.ai/v1/chat/completions";
const DEFAULT_MODEL = "mistral-small-latest";
const MAX_MESSAGES = 12;
const MAX_MESSAGE_LENGTH = 1_000;
const MAX_TOTAL_LENGTH = 6_000;
const RATE_LIMIT = 12;
const RATE_WINDOW_MS = 60_000;
const REQUEST_TIMEOUT_MS = 25_000;

function parseMessages(value: unknown): ChatMessage[] | null {
  if (!Array.isArray(value) || value.length === 0 || value.length > MAX_MESSAGES) {
    return null;
  }

  const messages: ChatMessage[] = [];
  let totalLength = 0;

  for (const valueMessage of value) {
    if (typeof valueMessage !== "object" || valueMessage === null) return null;

    const role = "role" in valueMessage ? valueMessage.role : undefined;
    const rawContent = "content" in valueMessage ? valueMessage.content : undefined;
    if ((role !== "assistant" && role !== "user") || typeof rawContent !== "string") {
      return null;
    }

    const content = rawContent.trim();
    if (!content || content.length > MAX_MESSAGE_LENGTH) return null;

    totalLength += content.length;
    if (totalLength > MAX_TOTAL_LENGTH) return null;
    messages.push({ role, content });
  }

  return messages.at(-1)?.role === "user" ? messages : null;
}

function extractAssistantText(payload: MistralResponse): string | null {
  const content = payload.choices?.[0]?.message?.content;

  if (typeof content === "string") return content.trim() || null;
  if (!Array.isArray(content)) return null;

  const text = content
    .map((chunk) => {
      if (typeof chunk === "string") return chunk;
      if (typeof chunk !== "object" || chunk === null) return "";

      const typedChunk = chunk as MistralContentChunk;
      if (typeof typedChunk.text === "string") return typedChunk.text;
      return typeof typedChunk.content === "string" ? typedChunk.content : "";
    })
    .join("")
    .trim();

  return text || null;
}

function noStoreJson(body: Record<string, unknown>, status = 200) {
  return NextResponse.json(body, {
    status,
    headers: { "Cache-Control": "no-store" },
  });
}

export async function POST(request: Request) {
  const { allowed, retryAfter } = rateLimit(
    `portfolio-chat:${getClientId(request)}`,
    RATE_LIMIT,
    RATE_WINDOW_MS,
  );

  if (!allowed) {
    return NextResponse.json(
      { error: "Too many messages. Please wait a moment and try again." },
      {
        status: 429,
        headers: {
          "Cache-Control": "no-store",
          "Retry-After": String(retryAfter),
        },
      },
    );
  }

  let payload: unknown;
  try {
    payload = await request.json();
  } catch {
    return noStoreJson({ error: "Invalid request body." }, 400);
  }

  if (typeof payload !== "object" || payload === null) {
    return noStoreJson({ error: "Invalid request body." }, 400);
  }

  const messages = parseMessages("messages" in payload ? payload.messages : undefined);
  if (!messages) {
    return noStoreJson(
      { error: "Please send a valid conversation ending with a question." },
      400,
    );
  }

  const lang = "lang" in payload && payload.lang === "km" ? "km" : "en";
  const apiKey = process.env.MISTRAL_API_KEY;

  if (!apiKey) {
    console.error("MISTRAL_API_KEY is not set — portfolio chat cannot answer.");
    return noStoreJson({ error: "The AI assistant is not configured yet." }, 503);
  }

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);

  try {
    const response = await fetch(MISTRAL_CHAT_URL, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: process.env.MISTRAL_CHAT_MODEL ?? DEFAULT_MODEL,
        messages: [
          { role: "system", content: buildChatbotSystemPrompt(lang) },
          ...messages,
        ],
        temperature: 0.25,
        max_tokens: 450,
      }),
      cache: "no-store",
      signal: controller.signal,
    });

    if (!response.ok) {
      console.error(`Mistral chat request failed with status ${response.status}.`);

      if (response.status === 429) {
        return noStoreJson(
          { error: "The AI service is busy right now. Please try again shortly." },
          503,
        );
      }

      return noStoreJson(
        { error: "Byte could not answer right now. Please try again." },
        502,
      );
    }

    const data = (await response.json()) as MistralResponse;
    const message = extractAssistantText(data);

    if (!message) {
      console.error("Mistral chat response did not contain assistant text.");
      return noStoreJson(
        { error: "Byte returned an empty answer. Please try again." },
        502,
      );
    }

    return noStoreJson({ message });
  } catch (error) {
    const timedOut = error instanceof Error && error.name === "AbortError";
    console.error(timedOut ? "Mistral chat request timed out." : "Mistral chat request failed.");
    return noStoreJson(
      {
        error: timedOut
          ? "Byte took too long to answer. Please try again."
          : "Byte could not connect right now. Please try again.",
      },
      502,
    );
  } finally {
    clearTimeout(timeout);
  }
}
