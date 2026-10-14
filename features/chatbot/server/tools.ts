import "server-only";

import { getLabDefinitions } from "@/features/labs/domain/catalog";
import { getAllPosts } from "@/features/blog/server";
import { getDictionary, type Locale } from "@/shared/i18n";
import { getProjects } from "@/features/portfolio/data/localized-content";
import {
  CHAT_SECTIONS,
  type ChatCard,
  type ChatCardKind,
  type ChatSection,
  type ChatStreamEvent,
} from "@/features/chatbot/domain/types";

/**
 * Byte's tools. Both are read-only lookups against content the site already
 * renders: the model only ever names a slug or a section, and this module
 * decides whether it exists and what the card says. A hallucinated slug comes
 * back to the model as "not found" instead of reaching the visitor as a dead
 * link.
 */

const MAX_CARDS = 3;

const SECTION_LABELS: Record<Locale, Record<ChatSection, string>> = {
  en: {
    about: "About",
    "current-focus": "Current focus",
    skills: "Skills",
    experience: "Experience",
    education: "Education",
    services: "Services",
    projects: "Projects",
    writing: "Labs & writing",
    media: "Videos",
    recommendations: "Recommendations",
    contact: "Contact",
  },
  km: {
    about: "អំពីខ្ញុំ",
    "current-focus": "អ្វីដែលកំពុងធ្វើ",
    skills: "ជំនាញ",
    experience: "បទពិសោធន៍",
    education: "ការសិក្សា",
    services: "សេវាកម្ម",
    projects: "គម្រោង",
    writing: "ពិសោធន៍ និងអត្ថបទ",
    media: "វីដេអូ",
    recommendations: "អនុសាសន៍",
    contact: "ទំនាក់ទំនង",
  },
};

export const CHAT_TOOLS = [
  {
    type: "function",
    function: {
      name: "show_work",
      description:
        "Show the visitor up to 3 of Bondeth's projects, blog posts, or interactive labs as clickable cards in the chat. Use it whenever an example, a project, an article, or a demo would answer the question better than a description.",
      parameters: {
        type: "object",
        properties: {
          items: {
            type: "array",
            maxItems: MAX_CARDS,
            items: {
              type: "object",
              properties: {
                type: { type: "string", enum: ["project", "post", "lab"] },
                slug: {
                  type: "string",
                  description: "Exact slug from the site catalog.",
                },
              },
              required: ["type", "slug"],
            },
          },
        },
        required: ["items"],
      },
    },
  },
  {
    type: "function",
    function: {
      name: "open_section",
      description:
        "Take the visitor to a section of the portfolio homepage, e.g. contact when they want to reach Bondeth, services when they ask what he offers.",
      parameters: {
        type: "object",
        properties: {
          section: { type: "string", enum: [...CHAT_SECTIONS] },
        },
        required: ["section"],
      },
    },
  },
] as const;

interface Catalog {
  project: Map<string, ChatCard>;
  post: Map<string, ChatCard>;
  lab: Map<string, ChatCard>;
}

export async function buildChatCatalog(lang: Locale): Promise<Catalog> {
  const dict = getDictionary(lang);
  const projects = getProjects(lang)
    // Confidential work has no detail page to link to.
    .filter((project) => project.visibility !== "confidential")
    .map((project): [string, ChatCard] => [
      project.slug,
      {
        kind: "project",
        title: project.title,
        description: project.description,
        href: `/${lang}/projects/${project.slug}`,
        meta: [project.year, project.category].filter(Boolean).join(" · "),
      },
    ]);

  const posts = (await getAllPosts(lang)).map((post): [string, ChatCard] => [
    post.slug,
    {
      kind: "post",
      title: post.title,
      description: post.excerpt ?? "",
      href: `/${lang}/blog/${post.slug}`,
      meta: `${post.readingTime} ${dict.blog.minRead}`,
    },
  ]);

  const labs = Object.values(getLabDefinitions(dict.labs)).map(
    (lab): [string, ChatCard] => {
      const slug = lab.path.replace("/labs/", "");
      return [
        slug,
        {
          kind: "lab",
          title: lab.title,
          description: lab.description,
          href: `/${lang}${lab.path}`,
        },
      ];
    },
  );

  return {
    project: new Map(projects),
    post: new Map(posts),
    lab: new Map(labs),
  };
}

/** The catalog as the model sees it: slugs and titles, nothing else. */
export function describeCatalogForPrompt(catalog: Catalog) {
  const list = (kind: ChatCardKind) =>
    [...catalog[kind]]
      .map(([slug, card]) => `- ${slug}: ${card.title}`)
      .join("\n");

  return `Tools:
- show_work: when the visitor wants to see work, examples, projects, articles, or demos — or when one would clearly answer better than prose — call it with the 1–3 most relevant items, then add 1–3 sentences on why they are relevant. The cards appear above your reply and already carry titles and links, so do not repeat URLs or list the items again.
- open_section: when the visitor wants to go somewhere on this site (contact Bondeth, see his services, skills, experience, videos), call it.
- Only use slugs from the catalog below. If nothing fits, answer without a tool.

Projects:
${list("project")}

Blog posts:
${list("post")}

Labs:
${list("lab")}`;
}

export interface ToolOutcome {
  /** What the model reads back as the tool result. */
  result: string;
  /** What the visitor sees, if anything. */
  event?: ChatStreamEvent;
}

function parseArguments(raw: string): Record<string, unknown> | null {
  try {
    const value: unknown = JSON.parse(raw || "{}");
    return typeof value === "object" && value !== null
      ? (value as Record<string, unknown>)
      : null;
  } catch {
    return null;
  }
}

export function executeChatTool(
  name: string,
  rawArguments: string,
  catalog: Catalog,
  lang: Locale,
): ToolOutcome {
  const args = parseArguments(rawArguments);
  if (!args) return { result: "Invalid arguments. Answer without this tool." };

  if (name === "show_work") {
    const requested = Array.isArray(args.items)
      ? args.items.slice(0, MAX_CARDS)
      : [];
    const cards: ChatCard[] = [];
    const missing: string[] = [];

    for (const item of requested) {
      if (typeof item !== "object" || item === null) continue;
      const { type, slug } = item as { type?: unknown; slug?: unknown };
      if (typeof slug !== "string") continue;

      const card =
        type === "project" || type === "post" || type === "lab"
          ? catalog[type].get(slug)
          : undefined;
      if (card && !cards.includes(card)) cards.push(card);
      else if (!card) missing.push(slug);
    }

    if (cards.length === 0) {
      return {
        result: `Nothing was shown: ${missing.join(", ") || "no items"} not found. Answer in prose and do not mention cards.`,
      };
    }

    const shown = cards
      .map((card) => `${card.title} (${card.kind})`)
      .join("; ");
    return {
      result: `Shown to the visitor as cards: ${shown}.${missing.length ? ` Not found: ${missing.join(", ")}.` : ""} Now write a short intro to them.`,
      event: { type: "cards", cards },
    };
  }

  if (name === "open_section") {
    const section = CHAT_SECTIONS.find((value) => value === args.section);
    if (!section)
      return { result: "Unknown section. Answer without this tool." };

    const label = SECTION_LABELS[lang][section];
    return {
      result: `The visitor was given a link to the "${label}" section of the homepage. Briefly say what they will find there.`,
      event: { type: "section", section, label, href: `/${lang}#${section}` },
    };
  }

  return { result: `Unknown tool "${name}". Answer without tools.` };
}
