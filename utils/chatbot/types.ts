/**
 * The wire format between /api/chat and the Byte chat panel.
 *
 * The route streams newline-delimited JSON: one event per line, so the client
 * can render text as it arrives and drop in cards or a section jump the moment
 * the model calls a tool. Errors raised before the stream opens (rate limit,
 * bad input, upstream refusal) still come back as a plain JSON `{ error }`
 * with a non-2xx status.
 */

export const CHAT_SECTIONS = [
  "about",
  "current-focus",
  "skills",
  "experience",
  "education",
  "services",
  "projects",
  "writing",
  "media",
  "recommendations",
  "contact",
] as const;

export type TChatSection = (typeof CHAT_SECTIONS)[number];

export type TChatCardKind = "project" | "post" | "lab";

export interface IChatCard {
  kind: TChatCardKind;
  title: string;
  description: string;
  /** Locale-prefixed, app-internal path. */
  href: string;
  /** Short mono footnote: year and platform, format and reading time. */
  meta?: string;
}

export interface IChatSectionJump {
  section: TChatSection;
  label: string;
  /** Locale-prefixed homepage anchor, e.g. "/en#projects". */
  href: string;
}

export type TChatTourPath = "hiring" | "product" | "ai";

export interface IChatTourStep {
  title: string;
  content: string;
  cards?: IChatCard[];
  section: IChatSectionJump;
}

export interface IChatTour {
  id: TChatTourPath;
  label: string;
  description: string;
  steps: IChatTourStep[];
}

export type TChatStreamEvent =
  | { type: "text"; delta: string }
  | { type: "cards"; cards: IChatCard[] }
  | ({ type: "section" } & IChatSectionJump)
  | { type: "error"; message: string }
  | { type: "done" };
