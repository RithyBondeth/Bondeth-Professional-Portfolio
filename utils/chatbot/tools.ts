import { getLabCatalog } from "@/components/labs/lab-catalog";
import { getAllPosts } from "@/utils/functions/blog";
import { getDictionary, type TLocale } from "@/utils/i18n";
import { getProjects } from "@/utils/i18n/content";
import {
  CHAT_SECTIONS,
  type IChatCard,
  type TChatCardKind,
  type TChatSection,
  type TChatStreamEvent,
} from "./types";

/**
 * Byte's tools. Both are read-only lookups against content the site already
 * renders: the model only ever names a slug or a section, and this module
 * decides whether it exists and what the card says. A hallucinated slug comes
 * back to the model as "not found" instead of reaching the visitor as a dead
 * link.
 */

const MAX_CARDS = 3;

const SECTION_LABELS: Record<TLocale, Record<TChatSection, string>> = {
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

/* ------------------------------ Definitions -------------------------------- */
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

/* -------------------------------- Catalog ---------------------------------- */
interface ICatalog {
  project: Map<string, IChatCard>;
  post: Map<string, IChatCard>;
  lab: Map<string, IChatCard>;
}

export async function buildChatCatalog(lang: TLocale): Promise<ICatalog> {
  const dict = getDictionary(lang);
  const projects = getProjects(lang)
    // Confidential work has no detail page to link to.
    .filter((project) => project.visibility !== "confidential")
    .map((project): [string, IChatCard] => [
      project.slug,
      {
        kind: "project",
        title: project.title,
        description: project.description,
        href: `/${lang}/projects/${project.slug}`,
        meta: [project.year, project.category].filter(Boolean).join(" · "),
      },
    ]);

  const posts = (await getAllPosts(lang)).map((post): [string, IChatCard] => [
    post.slug,
    {
      kind: "post",
      title: post.title,
      description: post.excerpt ?? "",
      href: `/${lang}/blog/${post.slug}`,
      meta: `${post.readingTime} ${dict.blog.minRead}`,
    },
  ]);

  const labs = getLabCatalog(dict.labs).map((lab): [string, IChatCard] => {
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
  });

  return { project: new Map(projects), post: new Map(posts), lab: new Map(labs) };
}

/** The catalog as the model sees it: slugs and titles, nothing else. */
export function describeCatalogForPrompt(catalog: ICatalog) {
  const list = (kind: TChatCardKind) =>
    [...catalog[kind]].map(([slug, card]) => `- ${slug}: ${card.title}`).join("\n");

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

/* -------------------------------- Execution -------------------------------- */
export interface IToolOutcome {
  /** What the model reads back as the tool result. */
  result: string;
  /** What the visitor sees, if anything. */
  event?: TChatStreamEvent;
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
  catalog: ICatalog,
  lang: TLocale,
): IToolOutcome {
  const args = parseArguments(rawArguments);
  if (!args) return { result: "Invalid arguments. Answer without this tool." };

  if (name === "show_work") {
    const requested = Array.isArray(args.items) ? args.items.slice(0, MAX_CARDS) : [];
    const cards: IChatCard[] = [];
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

    const shown = cards.map((card) => `${card.title} (${card.kind})`).join("; ");
    return {
      result: `Shown to the visitor as cards: ${shown}.${missing.length ? ` Not found: ${missing.join(", ")}.` : ""} Now write a short intro to them.`,
      event: { type: "cards", cards },
    };
  }

  if (name === "open_section") {
    const section = CHAT_SECTIONS.find((value) => value === args.section);
    if (!section) return { result: "Unknown section. Answer without this tool." };

    const label = SECTION_LABELS[lang][section];
    return {
      result: `The visitor was given a link to the "${label}" section of the homepage. Briefly say what they will find there.`,
      event: { type: "section", section, label, href: `/${lang}#${section}` },
    };
  }

  return { result: `Unknown tool "${name}". Answer without tools.` };
}
