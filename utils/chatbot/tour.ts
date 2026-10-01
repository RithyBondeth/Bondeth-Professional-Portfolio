import { buildChatCatalog, executeChatTool } from "./tools";
import type { IChatTour, IChatTourStep, TChatSection } from "./types";
import type { TLocale } from "@/utils/i18n";

/** Curated tours use the same validated, localized catalog as Byte's tools. */
export async function buildChatTours(lang: TLocale): Promise<IChatTour[]> {
  const catalog = await buildChatCatalog(lang);
  const km = lang === "km";
  const step = (
    section: TChatSection,
    title: string,
    content: string,
    items?: Array<{ type: "project" | "lab"; slug: string }>,
  ): IChatTourStep => {
    const jump = executeChatTool("open_section", JSON.stringify({ section }), catalog, lang).event;
    if (jump?.type !== "section") throw new Error(`Invalid tour section: ${section}`);
    const work = items
      ? executeChatTool("show_work", JSON.stringify({ items }), catalog, lang).event
      : undefined;
    return {
      title,
      content,
      section: { section: jump.section, label: jump.label, href: jump.href },
      ...(work?.type === "cards" ? { cards: work.cards } : {}),
    };
  };

  return [
    {
      id: "hiring",
      label: km ? "ស្វែងរកអ្នកជំនាញ" : "Hiring",
      description: km ? "បទពិសោធន៍ ស្នាដៃ និងរបៀបទាក់ទង។" : "Experience, selected work, and how to connect.",
      steps: [
        step("experience", km ? "ស្គាល់អ្នកអភិវឌ្ឍន៍" : "Meet the engineer",
          km
            ? `ហែម ឫទ្ធីបណ្ឌិត ជាអ្នកអភិវឌ្ឍន៍ Full Stack និងវិស្វករ AI នៅភ្នំពេញ។ មើលបទពិសោធន៍របស់គាត់ក្នុងការបង្កើតកម្មវិធី Web និង Mobile ហើយអាន [ប្រវត្តិរូបសង្ខេប](/${lang}/resume) សម្រាប់ព័ត៌មានបន្ថែម។`
            : `Bondeth is a full stack developer and AI engineer based in Phnom Penh. Start with his experience shipping web and mobile applications, or open his [résumé](/${lang}/resume) for a concise overview.`),
        step("projects", km ? "មើលស្នាដៃ" : "See the work",
          km
            ? "គម្រោងទាំងនេះបង្ហាញពីការបង្កើតប្រព័ន្ធ Web និងផលិតផល AI។ បើកកាតដើម្បីអានអំពីបច្ចេកវិទ្យា និងការសម្រេចចិត្តក្នុងការអភិវឌ្ឍន៍។"
            : "These projects show his work across web platforms and applied AI. Open a card to explore the stack and engineering decisions behind it.",
          [{ type: "project", slug: "apsara-talent" }, { type: "project", slug: "apsara-assistant" }]),
        step("contact", km ? "ចាប់ផ្តើមការសន្ទនា" : "Start a conversation",
          km
            ? "មានតួនាទីការងារដែលសមស្រប? ផ្ញើព័ត៌មានអំពីក្រុម តួនាទី និងអ្វីដែលអ្នកចង់បង្កើតតាមផ្នែកទំនាក់ទំនង។ អ្នកក៏អាចសួរខ្ញុំអំពីជំនាញជាក់លាក់របស់ ហែម ឫទ្ធីបណ្ឌិត បានដែរ។"
            : "Have a role in mind? Use the contact section to share the team, role, and what you want to build. You can also ask me about a specific part of Bondeth’s experience."),
      ],
    },
    {
      id: "product",
      label: km ? "បង្កើតផលិតផល" : "Building a product",
      description: km ? "សេវាកម្ម គម្រោងពាក់ព័ន្ធ និងជំហានបន្ទាប់។" : "Services, relevant projects, and your next step.",
      steps: [
        step("services", km ? "កំណត់អ្វីដែលអ្នកចង់បង្កើត" : "Find your starting point",
          km
            ? "ហែម ឫទ្ធីបណ្ឌិត ធ្វើការលើផលិតផល Web និង Mobile ការបញ្ចូល AI និងប្រព័ន្ធ Backend។ មើលសេវាកម្មដើម្បីរកអ្វីដែលសមនឹងគំនិតរបស់អ្នក។"
            : "Bondeth works on web and mobile products, AI integrations, and backend systems. The services section is a good place to match your idea with the kind of work he does."),
        step("projects", km ? "ស្វែងរកគម្រោងពាក់ព័ន្ធ" : "Explore relevant builds",
          km
            ? "នេះជាឧទាហរណ៍ពីវេទិកា Web និងជំនួយការ AI។ មើលគម្រោងដើម្បីពិចារណាថាតើលំហូរការងារ និងបច្ចេកវិទ្យាណាអាចសមនឹងផលិតផលរបស់អ្នក។"
            : "Here are a web platform and an AI assistant to explore. Their workflows and technology choices can help frame a conversation about your own product.",
          [{ type: "project", slug: "apsara-talent" }, { type: "project", slug: "apsara-assistant" }]),
        step("contact", km ? "ចែករំលែកគំនិតរបស់អ្នក" : "Share your idea",
          km
            ? "ផ្ញើសារអំពីបញ្ហាដែលអ្នកចង់ដោះស្រាយ អ្នកប្រើប្រាស់គោលដៅ និងកាលវិភាគដែលអ្នករំពឹងទុក។ បើអ្នកនៅកំពុងស្វែងយល់ អ្នកអាចសួរខ្ញុំអំពីការជ្រើសរើសបច្ចេកវិទ្យាជាមុនបាន។"
            : "Send a short brief: the problem, intended users, and your preferred timeline. Still shaping the idea? Ask me about technology choices before reaching out."),
      ],
    },
    {
      id: "ai",
      label: km ? "ស្វែងយល់អំពី AI" : "Exploring AI",
      description: km ? "ការងារ AI បច្ចុប្បន្ន និងពិសោធន៍អន្តរកម្ម។" : "Current AI interests and hands-on experiments.",
      steps: [
        step("current-focus", km ? "មើលអ្វីដែលកំពុងសិក្សា" : "See the current focus",
          km
            ? "ហែម ឫទ្ធីបណ្ឌិត ផ្តោតលើប្រព័ន្ធ AI ដែលអាចទុកចិត្តបាន៖ Agentic workflows, RAG និងការវាយតម្លៃ LLM។ ចាប់ផ្តើមពីផ្នែកការងារបច្ចុប្បន្ន ដើម្បីដឹងពីអ្វីដែលគាត់កំពុងស្វែងយល់។"
            : "Bondeth’s current interests include reliable AI systems, agentic workflows, retrieval-augmented generation, and LLM evaluations. Start with the current-focus section for the context."),
        step("writing", km ? "សាកល្បងដោយខ្លួនឯង" : "Try it yourself",
          km
            ? "ពិសោធន៍ទាំងនេះអនុញ្ញាតឱ្យអ្នកសាកល្បងការស្វែងរកទិន្នន័យ ការវាយតម្លៃចម្លើយ និងលទ្ធផលតាមទម្រង់។ បើកមួយ ហើយប្តូរការកំណត់ដើម្បីមើលលទ្ធផល។"
            : "These interactive labs let you explore retrieval, answer evaluation, and structured output. Open one and change the inputs to see what happens.",
          [{ type: "lab", slug: "rag-retrieval" }, { type: "lab", slug: "llm-evals" }, { type: "lab", slug: "structured-output" }]),
        step("contact", km ? "ពិភាក្សាអំពី AI" : "Keep exploring together",
          km
            ? "មានគំនិត AI ឬចង់សហការ? ទាក់ទង ហែម ឫទ្ធីបណ្ឌិត ដោយពិពណ៌នាអំពីគំនិតរបស់អ្នក។ អ្នកក៏អាចសួរខ្ញុំពី RAG, Agents ឬការវាយតម្លៃ LLM ដើម្បីបន្តស្វែងយល់បាន។"
            : "Have an AI use case or a collaboration in mind? Reach out to Bondeth with a short description. Or ask me about RAG, agents, or evaluations to keep exploring here."),
      ],
    },
  ];
}
