import { NextResponse } from "next/server";
import { buildChatbotSystemPrompt } from "@/utils/chatbot/knowledge";
import {
  buildChatCatalog,
  CHAT_TOOLS,
  describeCatalogForPrompt,
  executeChatTool,
} from "@/utils/chatbot/tools";
import type { TChatStreamEvent } from "@/utils/chatbot/types";
import { getClientId, rateLimit } from "@/utils/functions/rate-limit";

type ChatRole = "assistant" | "user";

type ChatMessage = {
  role: ChatRole;
  content: string;
};

type GroqContentChunk = {
  text?: unknown;
  content?: unknown;
};

type GroqToolCallDelta = {
  id?: unknown;
  index?: unknown;
  function?: { name?: unknown; arguments?: unknown };
};

type GroqStreamChunk = {
  choices?: Array<{
    delta?: {
      content?: unknown;
      tool_calls?: GroqToolCallDelta[];
    };
  }>;
};

type ToolCall = { id: string; name: string; arguments: string };

type UpstreamMessage =
  | { role: "system" | "user"; content: string }
  | {
      role: "assistant";
      content: string;
      tool_calls?: Array<{
        id: string;
        type: "function";
        function: { name: string; arguments: string };
      }>;
    }
  | { role: "tool"; tool_call_id: string; name: string; content: string };

const GROQ_CHAT_URL = "https://api.groq.com/openai/v1/chat/completions";
const DEFAULT_MODEL = "qwen/qwen3.8-27b";
const MAX_MESSAGES = 12;
const MAX_MESSAGE_LENGTH = 1_000;
const MAX_TOTAL_LENGTH = 6_000;
const RATE_LIMIT = 12;
const RATE_WINDOW_MS = 60_000;
const REQUEST_TIMEOUT_MS = 25_000;
/** Round one may call tools; round two must answer in prose. */
const MAX_ROUNDS = 2;
const UPSTREAM_ATTEMPTS = 2;
const RETRY_DELAY_MS = 450;
const RETRYABLE_UPSTREAM_STATUSES = new Set([429, 500, 502, 503, 504]);

export const maxDuration = 30;

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

function contentToText(content: unknown): string {
  if (typeof content === "string") return content;
  if (!Array.isArray(content)) return "";

  return content
    .map((chunk) => {
      if (typeof chunk === "string") return chunk;
      if (typeof chunk !== "object" || chunk === null) return "";

      const typedChunk = chunk as GroqContentChunk;
      if (typeof typedChunk.text === "string") return typedChunk.text;
      return typeof typedChunk.content === "string" ? typedChunk.content : "";
    })
    .join("");
}

/** Yields each `data:` payload of a server-sent-event body as parsed JSON. */
async function* readServerSentEvents(body: ReadableStream<Uint8Array>) {
  const reader = body.getReader();
  const decoder = new TextDecoder();
  let buffer = "";

  try {
    for (;;) {
      const { value, done } = await reader.read();
      if (done) return;
      buffer += decoder.decode(value, { stream: true });

      let newline = buffer.indexOf("\n");
      while (newline !== -1) {
        const line = buffer.slice(0, newline).trim();
        buffer = buffer.slice(newline + 1);
        newline = buffer.indexOf("\n");

        if (!line.startsWith("data:")) continue;
        const data = line.slice(5).trim();
        if (data === "[DONE]") return;

        try {
          yield JSON.parse(data) as GroqStreamChunk;
        } catch {
          // A malformed keep-alive or partial frame; the next one carries on.
        }
      }
    }
  } finally {
    reader.releaseLock();
  }
}

/**
 * Relays one streamed completion: text deltas go straight to the visitor,
 * tool-call fragments are stitched back together by index for the caller.
 */
async function relayCompletion(
  response: Response,
  send: (event: TChatStreamEvent) => void,
) {
  let text = "";
  const calls = new Map<number, ToolCall>();

  if (!response.body) return { text, toolCalls: [] };

  for await (const chunk of readServerSentEvents(response.body)) {
    const delta = chunk.choices?.[0]?.delta;
    if (!delta) continue;

    const piece = contentToText(delta.content);
    if (piece) {
      text += piece;
      send({ type: "text", delta: piece });
    }

    delta.tool_calls?.forEach((fragment, position) => {
      const index = typeof fragment.index === "number" ? fragment.index : position;
      const call = calls.get(index) ?? { id: "", name: "", arguments: "" };
      if (typeof fragment.id === "string" && fragment.id) call.id = fragment.id;
      if (typeof fragment.function?.name === "string" && fragment.function.name) {
        call.name = fragment.function.name;
      }
      const args = fragment.function?.arguments;
      if (typeof args === "string") call.arguments += args;
      else if (args && typeof args === "object") call.arguments = JSON.stringify(args);
      calls.set(index, call);
    });
  }

  return { text, toolCalls: [...calls.values()].filter((call) => call.id && call.name) };
}

function noStoreJson(body: Record<string, unknown>, status = 200) {
  return NextResponse.json(body, {
    status,
    headers: { "Cache-Control": "no-store" },
  });
}

async function requestGroq(
  apiKey: string,
  body: string,
  signal: AbortSignal,
) {
  let response: Response | null = null;

  for (let attempt = 1; attempt <= UPSTREAM_ATTEMPTS; attempt += 1) {
    response = await fetch(GROQ_CHAT_URL, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body,
      cache: "no-store",
      signal,
    });

    const shouldRetry =
      attempt < UPSTREAM_ATTEMPTS &&
      RETRYABLE_UPSTREAM_STATUSES.has(response.status);
    if (!shouldRetry) return response;

    await response.body?.cancel();
    await wait(RETRY_DELAY_MS);
  }

  return response;
}

function wait(delay: number) {
  return new Promise<void>((resolve) => setTimeout(resolve, delay));
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
  const apiKey = process.env.GROQ_API_KEY;

  if (!apiKey) {
    console.error("GROQ_API_KEY is not set — portfolio chat cannot answer.");
    return noStoreJson({ error: "The AI assistant is not configured yet." }, 503);
  }

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);
  const catalog = await buildChatCatalog(lang);
  const conversation: UpstreamMessage[] = [
    {
      role: "system",
      content: `${buildChatbotSystemPrompt(lang)}\n\n${describeCatalogForPrompt(catalog)}`,
    },
    ...messages,
  ];
  const requestBody = (round: number) =>
    JSON.stringify({
      model: process.env.GROQ_CHAT_MODEL ?? DEFAULT_MODEL,
      messages: conversation,
      tools: CHAT_TOOLS,
      tool_choice: round < MAX_ROUNDS ? "auto" : "none",
      temperature: 0.25,
      max_completion_tokens: 450,
      stream: true,
    });

  // The first upstream call happens before the stream opens, so a refusal or
  // an outage still reaches the client as a status code it can explain.
  let firstResponse: Response | null;
  try {
    firstResponse = await requestGroq(apiKey, requestBody(1), controller.signal);
    if (!firstResponse) throw new Error("Groq did not return a response.");
  } catch (error) {
    clearTimeout(timeout);
    const timedOut = error instanceof Error && error.name === "AbortError";
    console.error(timedOut ? "Groq chat request timed out." : "Groq chat request failed.");
    return noStoreJson(
      {
        error: timedOut
          ? "Byte took too long to answer. Please try again."
          : "Byte could not connect right now. Please try again.",
      },
      502,
    );
  }

  if (!firstResponse.ok) {
    clearTimeout(timeout);
    console.error(`Groq chat request failed with status ${firstResponse.status}.`);
    await firstResponse.body?.cancel();

    return noStoreJson(
      {
        error:
          firstResponse.status === 429
            ? "The AI service is busy right now. Please try again shortly."
            : "Byte could not answer right now. Please try again.",
      },
      firstResponse.status === 429 ? 503 : 502,
    );
  }

  const encoder = new TextEncoder();
  const stream = new ReadableStream<Uint8Array>({
    async start(stream) {
      let closed = false;
      const send = (event: TChatStreamEvent) => {
        if (!closed) stream.enqueue(encoder.encode(`${JSON.stringify(event)}\n`));
      };
      let shownSomething = false;

      try {
        let response: Response = firstResponse;

        for (let round = 1; round <= MAX_ROUNDS; round += 1) {
          const { text, toolCalls } = await relayCompletion(response, send);
          if (text.trim()) shownSomething = true;
          if (toolCalls.length === 0 || round === MAX_ROUNDS) break;

          conversation.push({
            role: "assistant",
            content: text,
            tool_calls: toolCalls.map((call) => ({
              id: call.id,
              type: "function",
              function: { name: call.name, arguments: call.arguments },
            })),
          });

          for (const call of toolCalls) {
            const outcome = executeChatTool(call.name, call.arguments, catalog, lang);
            if (outcome.event) {
              send(outcome.event);
              shownSomething = true;
            }
            conversation.push({
              role: "tool",
              tool_call_id: call.id,
              name: call.name,
              content: outcome.result,
            });
          }

          const next = await requestGroq(apiKey, requestBody(round + 1), controller.signal);
          if (!next?.ok) {
            console.error(`Groq follow-up request failed with status ${next?.status}.`);
            await next?.body?.cancel();
            // Cards may already be on screen; only complain if they are not.
            if (!shownSomething) {
              send({ type: "error", message: "Byte could not answer right now. Please try again." });
            }
            return;
          }
          response = next;
        }

        if (!shownSomething) {
          console.error("Groq chat stream did not contain an answer.");
          send({ type: "error", message: "Byte returned an empty answer. Please try again." });
        }
      } catch (error) {
        const timedOut = error instanceof Error && error.name === "AbortError";
        console.error(timedOut ? "Groq chat stream timed out." : "Groq chat stream failed.");
        send({
          type: "error",
          message: timedOut
            ? "Byte took too long to answer. Please try again."
            : "Byte lost the connection. Please try again.",
        });
      } finally {
        clearTimeout(timeout);
        send({ type: "done" });
        closed = true;
        stream.close();
      }
    },
    cancel() {
      // The visitor closed the tab or sent nothing more: stop paying for tokens.
      controller.abort();
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "application/x-ndjson; charset=utf-8",
      "Cache-Control": "no-store, no-transform",
      "X-Accel-Buffering": "no",
    },
  });
}
