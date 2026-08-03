import {
  INavLink,
  ISkillGroup,
  IExperience,
  IProject,
  ISiteConfig,
  IEducation,
  IOrganization,
  IVideo,
} from "@/utils/interfaces/portfolio";

/* -------------------------------- Site Config ------------------------------- */
export const siteConfig: ISiteConfig = {
  name: "Bondeth",
  // Canonical origin for metadata, OG images, sitemap and RSS. The env var lets
  // preview deployments describe themselves accurately.
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://bondeth.dev",
  title: "Full Stack Developer & AI Engineer",
  tagline:
    "I build elegant web applications and intelligent AI systems — from pixel-perfect UIs to production-ready ML pipelines.",
  bio: [
    "I'm Rithy Bondeth, a full stack developer and AI engineer based in Phnom Penh, Cambodia. I'm passionate about building high-quality digital experiences across web and mobile platforms.",
    "I specialize in modern JavaScript ecosystems (React, Next.js, Vue, NestJS) and Python-based AI/ML workflows, with experience shipping products from internship to freelance to full-time at Digital Economy Business Committee under Ministry of Economy and Finance of Cambodia.",
    "I believe the best technology is invisible — it just works, and works beautifully.",
  ],
  email: "rithybondeth999@gmail.com",
  github: "https://github.com/RithyBondeth",
  linkedin: "https://linkedin.com/in/hem-rithybondeth",
  facebook: "https://www.facebook.com/profile.php?id=100094498908703",
  instagram: "https://www.instagram.com/r.bondeth/",
  youtube: "https://www.youtube.com/@rithybondeth6588",
  resume: "/files/bondeth-resume.pdf",
};

/* ---------------------------------- Videos ---------------------------------- */
/**
 * Curated YouTube uploads, newest first. See IVideo for why this is a hand-kept
 * list rather than a Data API call.
 */
export const videos: IVideo[] = [
  {
    id: "LMBePWuJJJA",
    title: "How Does AI Actually Work? — Explained Simply",
    titleKm: "តើ AI ដំណើរការយ៉ាងដូចម្តេច? — ពន្យល់ដោយសាមញ្ញ",
    description:
      "A plain-language walkthrough of what actually happens inside a modern AI model — no maths background needed. Subtitled in Khmer.",
    descriptionKm:
      "ការពន្យល់ជាភាសាសាមញ្ញអំពីអ្វីដែលកើតឡើងនៅខាងក្នុងម៉ូដែល AI សម័យទំនើប ដោយមិនត្រូវការចំណេះដឹងគណិតវិទ្យា។ មានអក្សររត់ជាភាសាខ្មែរ។",
    thumbnail: "/videos/how-ai-works.webp",
    languages: ["en", "km"],
    topics: ["AI", "Fundamentals", "Explainer"],
    relatedPost: "can-ai-replace-humans",
  },
];

/* --------------------------------- Nav Links -------------------------------- */
export const navLinks: INavLink[] = [
  { href: "/#about", label: "About" },
  { href: "/#skills", label: "Skills" },
  { href: "/#experience", label: "Experience" },
  { href: "/#education", label: "Education" },
  { href: "/#services", label: "Services" },
  { href: "/#projects", label: "Projects" },
  { href: "/labs", label: "Labs" },
  { href: "/blog", label: "Blog" },
  { href: "/#contact", label: "Contact" },
];

export const primaryNavLinks = navLinks.filter(
  ({ href }) => href !== "/#education",
);

/**
 * Desktop navbar only: the homepage's own scroll-sections (About through
 * Services) collapse into a single "Explore" dropdown so the bar isn't a
 * wall of 8 text links — real destinations (Projects, Labs, Blog, Contact)
 * stay directly clickable. The mobile menu and footer still use the full
 * `navLinks` / `primaryNavLinks` lists since a vertical list has no clutter
 * problem.
 */
const EXPLORE_HREFS = [
  "/#about",
  "/#skills",
  "/#experience",
  "/#education",
  "/#services",
];
export const exploreNavLinks = navLinks.filter(({ href }) =>
  EXPLORE_HREFS.includes(href),
);
export const topNavLinks = navLinks.filter(
  ({ href }) => !EXPLORE_HREFS.includes(href),
);

/* -------------------------------- Skill Groups ------------------------------ */
export const skillGroups: ISkillGroup[] = [
  {
    category: "Frontend",
    skills: [
      { name: "TypeScript", icon: "SiTypescript", color: "#3178C6", level: 3 },
      { name: "React.js", icon: "SiReact", color: "#61DAFB", level: 3 },
      {
        name: "Next.js",
        icon: "SiNextdotjs",
        color: "#FFFFFF",
        colorLight: "#0A0A0A",
        level: 3,
      },
      { name: "Vue.js", icon: "SiVuedotjs", color: "#4FC08D", level: 3 },
      { name: "Nuxt.js", icon: "SiNuxt", color: "#4FC08D", level: 3 },
      {
        name: "Tailwind CSS",
        icon: "SiTailwindcss",
        color: "#06B6D4",
        level: 3,
      },
    ],
  },
  {
    category: "Backend",
    skills: [
      { name: "Python", icon: "SiPython", color: "#3776AB", level: 3 },
      { name: "Node.js", icon: "SiNodedotjs", color: "#339933", level: 3 },
      { name: "NestJS", icon: "SiNestjs", color: "#E0234E", level: 3 },
      { name: "FastAPI", icon: "SiFastapi", color: "#009688", level: 2 },
      { name: "GraphQL", icon: "SiGraphql", color: "#E10098", level: 2 },
    ],
  },
  {
    category: "Databases",
    skills: [
      { name: "PostgreSQL", icon: "SiPostgresql", color: "#4169E1", level: 3 },
      { name: "MongoDB", icon: "SiMongodb", color: "#47A248", level: 2 },
      { name: "Redis", icon: "SiRedis", color: "#FF4438", level: 2 },
    ],
  },
  {
    category: "AI & ML",
    skills: [
      {
        name: "OpenAI",
        icon: "SiOpenai",
        color: "#FFFFFF",
        colorLight: "#0A0A0A",
        level: 3,
      },
      { name: "Anthropic", icon: "SiAnthropic", color: "#D97757", level: 2 },
      { name: "Gemini", icon: "SiGooglegemini", color: "#8E75B2", level: 2 },
      { name: "LangChain", icon: "SiLangchain", color: "#10B981", level: 2 },
      { name: "LangGraph", icon: "SiLanggraph", color: "#26A69A", level: 2 },
      {
        name: "Ollama",
        icon: "SiOllama",
        color: "#FFFFFF",
        colorLight: "#0A0A0A",
        level: 2,
      },
      {
        name: "Hugging Face",
        icon: "SiHuggingface",
        color: "#FFD21E",
        level: 2,
      },
    ],
  },
  {
    category: "Mobile",
    skills: [
      { name: "Flutter", icon: "SiFlutter", color: "#54C5F8", level: 3 },
      { name: "Swift", icon: "SiSwift", color: "#F05138", level: 1 },
      { name: "Kotlin", icon: "SiKotlin", color: "#7F52FF", level: 1 },
    ],
  },
  {
    category: "Cloud",
    skills: [
      {
        name: "Vercel",
        icon: "SiVercel",
        color: "#FFFFFF",
        colorLight: "#0A0A0A",
        level: 3,
      },
      { name: "Netlify", icon: "SiNetlify", color: "#00C7B7", level: 2 },
      {
        name: "DigitalOcean",
        icon: "SiDigitalocean",
        color: "#0080FF",
        level: 2,
      },
      { name: "AWS", icon: "FaAws", color: "#FF9900", level: 2 },
      { name: "GCP", icon: "SiGooglecloud", color: "#4285F4", level: 2 },
      { name: "Cloudflare", icon: "SiCloudflare", color: "#F38020", level: 2 },
    ],
  },
  {
    category: "DevOps & Tools",
    skills: [
      { name: "Docker", icon: "SiDocker", color: "#2496ED", level: 2 },
      { name: "Nginx", icon: "SiNginx", color: "#009639", level: 2 },
      {
        name: "GitHub Actions",
        icon: "SiGithubactions",
        color: "#2088FF",
        level: 2,
      },
      { name: "Git", icon: "SiGit", color: "#F05032", level: 3 },
      {
        name: "GitHub",
        icon: "SiGithub",
        color: "#FFFFFF",
        colorLight: "#181717",
        level: 3,
      },
      { name: "Linux", icon: "SiLinux", color: "#FCC624", level: 2 },
    ],
  },
];

/* -------------------------------- Experiences ------------------------------- */
export const experiences: IExperience[] = [
  {
    role: "Software Engineer",
    company: "Digital Economy and Business Committee",
    period: "2025 – Present",
    description:
      "Working as a Software Engineer, specializing in web and mobile app development. Building and maintaining production applications.",
    tags: ["Next.js", "NestJS", "PostgreSQL", "Flutter", "FastAPI", "Docker"],
  },
  {
    role: "Full Stack Developer",
    company: "Mango-Byte",
    period: "2024 – 2025",
    description:
      "Working as a junior Full Stack Developer, specializing in web and mobile app development. Building and maintaining production applications across the full stack.",
    tags: ["React", "Next.js", "NestJS", "PostgreSQL", "Flutter"],
  },
  {
    role: "Developer (Freelance Team Collaboration)",
    company: "Freelance",
    period: "2023 – 2024",
    description:
      "Collaborated with a freelancing team on web and mobile app development projects. Delivered multiple client projects including e-commerce and service platforms.",
    tags: ["Vue.js", "NestJS", "PostgreSQL", "Flutter"],
  },
  {
    role: "Web Developer Internship",
    company: "ALLWEB IT Company Co., Ltd.",
    period: "Jun 2022 – Sep 2022",
    description:
      "Built an attendance management system and contributed to both frontend and backend development. Gained hands-on experience with enterprise web frameworks.",
    tags: ["Angular", "Symfony", "PHP", "MySQL"],
  },
  {
    role: "IT Supporter",
    company: "Pailin Province Hall",
    period: "2020 – 2021",
    description:
      "Provided IT support including hardware/software troubleshooting and system installation and configuration for government offices.",
    tags: ["Hardware", "Networking", "Windows"],
  },
  {
    role: "IDT Coding Instructor",
    company: "Cambodia Academy of Digital Technology",
    period: "Feb 2020 – May 2020",
    description:
      "Volunteered in the IDT Encoding Program, teaching high school students how to code using C/C++ fundamentals.",
    tags: ["C", "C++", "Teaching"],
  },
];

/* -------------------------------- Educations -------------------------------- */
export const educations: IEducation[] = [
  {
    degree: "Bachelor of Computer Science",
    institution: "Cambodia Academy of Digital Technology (CADT)",
    period: "2020 – 2024",
    location: "Phnom Penh, Cambodia",
    description:
      "Pursued a bachelor's degree in Computer Science with a focus on software engineering, web development, and mobile app development. Graduated as a Techo Scholar.",
    achievements: [
      "Techo Scholar — merit-based scholarship for outstanding students",
    ],
  },
];

/* ------------------------------- Organizations ------------------------------ */
export const organizations: IOrganization[] = [
  { name: "Mango-Byte Co., Ltd", logo: "/organizations/mango-byte-logo.png" },
  {
    name: "Cambodia Academy of Digital Technology",
    logo: "/organizations/cadt-logo.png",
  },
  { name: "Allweb Company Co., Ltd", logo: "/organizations/allweb-logo.png" },
  {
    name: "Pailin Province Hall",
    logo: "/organizations/pailin-province-hall-logo.png",
  },
  { name: "Apsara Talent", logo: "/organizations/apsara-logo.svg" },
  {
    name: "Digital Economy and Business Committee",
    logo: "/organizations/debc-logo.png",
  },
  {
    name: "Ministry of Economy and Finance",
    logo: "/organizations/mef-logo.png",
  },
];

/* --------------------------------- Projects --------------------------------- */
export const projects: IProject[] = [
  {
    slug: "bondex-notch",
    title: "Bondex Notch",
    description:
      "A native macOS utility that turns the notch into a live view of your music, coding agents, running tasks, downloads, and system status.",
    overview:
      "Built in Swift and SwiftUI rather than Electron or an embedded web view, so it ships as one native binary instead of a bundled browser. Each widget owns its own polling lifecycle, which is what lets a widget you switch off stop sampling entirely rather than merely hide — the distinction that matters on a surface the machine keeps on screen all day.",
    tags: [
      "Swift",
      "SwiftUI",
      "macOS",
      "Apple Events",
    ],
    category: "macOS",
    domains: ["Developer Tools"],
    tier: "production",
    year: "2026",
    role: "Sole developer",
    // TODO(bondeth): one line each — users reached, volume handled, a
    // number that moved. Renders as its own section once non-empty.
    outcomes: [],
    visibility: "public",
    links: [{ kind: "site", url: "https://bondex-notch.bondeth.site" }],
    image: "/previews/bondex-notch.webp",
    gradient: "from-indigo-600/20 via-indigo-500/10 to-slate-800",
  },
  {
    slug: "apsara-talent",
    title: "Apsara Talent",
    description:
      "A recruitment platform matching Cambodian freelancers with employers, built as a set of NestJS microservices behind a Next.js front end.",
    overview:
      "Job matching is read-heavy with bursty writes around posting and application deadlines, so the backend is split into NestJS services communicating over RabbitMQ rather than shipped as one deployable. PostgreSQL holds the relational records, MongoDB the document-shaped listings, and Redis carries caching and session state. It runs on Kubernetes behind Nginx and Cloudflare, instrumented with Sentry for errors and Prometheus and Grafana for metrics.",
    tags: [
      "TypeScript",
      "Next.js",
      "NestJS",
      "Microservices",
      "PostgreSQL",
      "Kubernetes",
    ],
    category: "Web",
    domains: ["Recruitment"],
    tier: "production",
    year: "2025 – present",
    role: "Sole developer",
    // TODO(bondeth): one line each — users reached, volume handled, a
    // number that moved. Renders as its own section once non-empty.
    outcomes: [],
    visibility: "public",
    links: [{ kind: "app", url: "https://talent.apsara.social" }],
    image: "/previews/apsara-talent.webp",
    gradient: "from-blue-600/20 via-cyan-500/10 to-slate-800",
  },
  {
    slug: "apsara-assistant",
    title: "Apsara Assistant",
    description:
      "An AI sales assistant for Cambodian online sellers — it answers customer messages, manages conversations, and works in Khmer and English.",
    overview:
      "Cambodian sellers work bilingually: Khmer and English arrive in the same inbox and often inside a single thread, so detection and generation both have to hold across the switch rather than assume one language per conversation. A Python FastAPI service owns the model calls and conversation state, with a Next.js front end for the seller's inbox. PostgreSQL and MongoDB store message history, Redis handles queuing and rate limits, and the stack runs in Docker behind Cloudflare with Sentry, Prometheus, and Grafana.",
    tags: [
      "TypeScript",
      "Next.js",
      "Python",
      "FastAPI",
      "LLM APIs",
      "PostgreSQL",
    ],
    category: "Web",
    domains: ["AI"],
    tier: "production",
    year: "2026",
    role: "Sole developer",
    // TODO(bondeth): one line each — users reached, volume handled, a
    // number that moved. Renders as its own section once non-empty.
    outcomes: [],
    visibility: "public",
    links: [{ kind: "app", url: "https://assistant.apsara.social" }],
    image: "/previews/apsara-assistant.webp",
    gradient: "from-violet-600/20 via-purple-500/10 to-slate-800",
  },
  {
    slug: "apsara-agentic",
    title: "Apsara Agentic",
    description:
      "A production backend for an agentic coding platform — the layer that lets a model read a task, work through it, and produce code.",
    overview:
      "The hard part of an agentic system isn't the model call, it's everything around it: task state, tool execution, and the loop that decides when the agent is actually finished. A FastAPI service holds that orchestration, with a Next.js client on top, PostgreSQL and MongoDB for run history and task state, and Redis for the work queue. Deployed in Docker behind Cloudflare with Sentry, Prometheus, and Grafana.",
    tags: [
      "TypeScript",
      "Next.js",
      "Python",
      "FastAPI",
      "LLM APIs",
      "PostgreSQL",
    ],
    category: "Web",
    domains: ["AI"],
    tier: "production",
    year: "2026",
    role: "Sole developer",
    // TODO(bondeth): one line each — users reached, volume handled, a
    // number that moved. Renders as its own section once non-empty.
    outcomes: [],
    visibility: "public",
    links: [{ kind: "app", url: "https://agentic.apsara.social" }],
    image: "/previews/apsara-agentic.webp",
    gradient: "from-emerald-600/20 via-teal-500/10 to-slate-800",
  },
  {
    slug: "apsara-elearning",
    title: "Apsara Elearning",
    description:
      "An AI-tutored learning platform for Cambodian students, from kindergarten to university, with a mentor that explains in Khmer.",
    overview:
      "The gap here is language, not content: most good material for Math, Physics, and Chemistry exists in English, which puts it furthest from the students who need it most. The AI mentor explains and answers in Khmer. Built as a Next.js front end over NestJS microservices communicating on RabbitMQ, with PostgreSQL, MongoDB, and Redis behind them, running in Docker behind Cloudflare with Sentry, Prometheus, and Grafana.",
    tags: [
      "TypeScript",
      "Next.js",
      "NestJS",
      "Microservices",
      "LLM APIs",
      "RabbitMQ",
    ],
    category: "Web",
    domains: ["AI", "Education"],
    tier: "production",
    year: "2026",
    role: "Sole developer",
    // TODO(bondeth): one line each — users reached, volume handled, a
    // number that moved. Renders as its own section once non-empty.
    outcomes: [],
    visibility: "public",
    links: [{ kind: "app", url: "https://elearning.apsara.social" }],
    image: "/previews/apsara-elearning.webp",
    gradient: "from-slate-600/20 via-gray-500/10 to-slate-800",
  },
  {
    slug: "apsara-wallet",
    title: "Apsara Wallet",
    description:
      "A personal finance app for Cambodia — multi-wallet tracking in riel and dollars, on-device receipt scanning, and budgets that hold.",
    overview:
      "Cambodia runs on two currencies at once, so a wallet that treats one as primary is wrong from the first screen; balances, budgets, and totals all carry riel and dollars side by side rather than converting one into the other. Receipt scanning happens on the device. Flutter and Dart on the client against a FastAPI backend, with PostgreSQL, MongoDB, and Redis behind it.",
    tags: [
      "Flutter",
      "Dart",
      "FastAPI",
      "PostgreSQL",
      "LLM APIs",
    ],
    category: "Mobile",
    domains: ["Fintech", "AI"],
    tier: "production",
    year: "2026",
    role: "Sole developer",
    // TODO(bondeth): one line each — users reached, volume handled, a
    // number that moved. Renders as its own section once non-empty.
    outcomes: [],
    visibility: "public",
    links: [{ kind: "app", url: "https://wallet.apsara.social" }],
    image: "/previews/apsara-wallet.webp",
    gradient: "from-green-600/20 via-green-500/10 to-slate-800",
  },
  {
    slug: "pdfflow",
    title: "PDFlow",
    description:
      "A PDF creation and editing tool built for Cambodian users, with a deliberately small surface: create, edit, done.",
    overview:
      "PDF editing is something people reach for once a month and abandon if it takes more than a few clicks, so the feature list is kept short on purpose rather than grown to match desktop editors. A Nuxt and Tailwind front end sits over a FastAPI backend, with Redis holding job state for the operations slow enough to need it. Deployed in Docker behind Nginx and Cloudflare with Sentry for error tracking.",
    tags: [
      "TypeScript",
      "Nuxt.js",
      "Tailwind CSS",
      "FastAPI",
      "Redis",
    ],
    category: "Web",
    domains: ["Productivity"],
    tier: "production",
    year: "2026",
    role: "Sole developer",
    // TODO(bondeth): one line each — users reached, volume handled, a
    // number that moved. Renders as its own section once non-empty.
    outcomes: [],
    visibility: "public",
    links: [{ kind: "app", url: "https://pdfflow.bondeth.site" }],
    image: "/previews/pdfflow.webp",
    gradient: "from-blue-600/20 via-blue-500/10 to-slate-800",
  },
  {
    slug: "reahu-generator",
    title: "Reahu Generator",
    description:
      "A GitHub profile README generator — pick a layout, fill in the fields, and copy working markdown out the other end.",
    overview:
      "A good profile README is memorable, but writing one means copying snippets, fixing broken badge links, and pushing repeatedly just to see how it renders. Reahu does the assembly and shows the result before it reaches GitHub. A Next.js and Tailwind app with no backend of its own, deployed in Docker behind Nginx and Cloudflare.",
    tags: [
      "TypeScript",
      "Next.js",
      "Tailwind CSS",
    ],
    category: "Web",
    domains: ["Developer Tools"],
    tier: "production",
    year: "2026",
    role: "Sole developer",
    // TODO(bondeth): one line each — users reached, volume handled, a
    // number that moved. Renders as its own section once non-empty.
    outcomes: [],
    visibility: "public",
    links: [{ kind: "app", url: "https://reahu.bondeth.site" }],
    image: "/previews/reahu-generator.webp",
    gradient: "from-red-600/20 via-red-500/10 to-slate-800",
  },
  {
    slug: "debc-website",
    title: "DEBC Website",
    description:
      "The official website of Cambodia's Digital Economy and Business Committee, publishing policy, news, and government services.",
    overview:
      "A government site's binding requirement isn't its feature list, it's staying up and staying readable on whatever device and connection the public actually has. Next.js over a NestJS API with Supabase and PostgreSQL behind it, deployed on AWS in Docker behind Nginx, monitored with Sentry, Prometheus, and Grafana.",
    tags: [
      "TypeScript",
      "Next.js",
      "NestJS",
      "Supabase",
      "PostgreSQL",
      "AWS",
    ],
    category: "Web",
    domains: ["GovTech"],
    tier: "production",
    year: "2025 – present",
    role: "Software Engineer, Digital Economy and Business Committee",
    // TODO(bondeth): one line each — users reached, volume handled, a
    // number that moved. Renders as its own section once non-empty.
    outcomes: [],
    visibility: "limited",
    links: [{ kind: "app", url: "https://digitaleconomy.gov.kh/?lang=kh" }],
    image: "/previews/debc-website.webp",
    gradient: "from-blue-700/20 via-indigo-500/10 to-slate-800",
  },
  {
    slug: "informal-economy",
    title: "Informal Economy",
    description:
      "A national registration platform for Cambodia's informal economy workers, built with the Ministry of Economy and Finance.",
    overview:
      "Registering informal workers at national scale means designing for someone filling in a form once, on a phone, possibly with help — so the failure modes that matter are dropped submissions and ambiguous state, not throughput. Next.js and NestJS microservices communicate over RabbitMQ, with PostgreSQL and Supabase for storage, running on Kubernetes and AWS behind Nginx and monitored with Sentry, Prometheus, and Grafana.",
    tags: [
      "TypeScript",
      "Next.js",
      "NestJS",
      "Microservices",
      "Kubernetes",
      "AWS",
    ],
    category: "Web",
    domains: ["GovTech"],
    tier: "production",
    year: "2025 – present",
    role: "Software Engineer, Digital Economy and Business Committee",
    // TODO(bondeth): one line each — users reached, volume handled, a
    // number that moved. Renders as its own section once non-empty.
    outcomes: [],
    visibility: "limited",
    links: [{ kind: "app", url: "https://informal.digitaleconomy.gov.kh/km" }],
    image: "/previews/informal-economy.webp",
    gradient: "from-amber-600/20 via-orange-500/10 to-slate-800",
  },
  {
    slug: "cambodia-investment-platform",
    title: "Cambodia Investment Platform",
    description:
      "The landing site for Cambodia Investment Platform, connecting startups, MSMEs, investors, and the public to digital financing.",
    overview:
      "A landing page for a financing mechanism has one job and it's an editorial one: explain a complicated instrument to four audiences — founders, small businesses, investors, and the public — without losing any of them or writing four different pages. Next.js and Tailwind, deployed on Vercel.",
    tags: [
      "TypeScript",
      "Next.js",
      "Tailwind CSS",
      "Vercel",
    ],
    category: "Web",
    domains: ["GovTech", "Fintech"],
    tier: "production",
    year: null,
    role: null,
    // TODO(bondeth): one line each — users reached, volume handled, a
    // number that moved. Renders as its own section once non-empty.
    outcomes: [],
    visibility: "limited",
    links: [
      { kind: "app", url: "https://edf-cip-website-dev.intechdevkh.com/en" },
    ],
    image: "/previews/cambodia-investment-platform.webp",
    gradient: "from-emerald-700/20 via-green-500/10 to-slate-800",
  },
  {
    slug: "code-hub",
    title: "Code Hub",
    description:
      "A developer community platform from my freelance years, with Google, Facebook, and GitHub SSO for discovering and sharing projects.",
    overview:
      "Three SSO providers was the actual build: each returns a different shape of profile, and reconciling them into one account without duplicating a user who signs in a second way through a different provider is most of the work in a social login flow. React on the front, NestJS API, PostgreSQL for accounts and projects, Firebase alongside for auth plumbing, containerised with Docker.",
    tags: [
      "TypeScript",
      "React.js",
      "NestJS",
      "PostgreSQL",
      "Firebase",
    ],
    category: "Web",
    domains: ["Community"],
    tier: "production",
    year: "2023 – 2024",
    role: "Developer, freelance team",
    // TODO(bondeth): one line each — users reached, volume handled, a
    // number that moved. Renders as its own section once non-empty.
    outcomes: [],
    visibility: "public",
    links: [
      { kind: "app", url: "https://codehub-bondeth.netlify.app/signin" },
    ],
    image: "/previews/codehub.webp",
    gradient: "from-rose-600/20 via-pink-500/10 to-slate-800",
  },
  {
    slug: "apple-clone",
    title: "Apple Clone",
    description:
      "A front-end rebuild of Apple's product pages — full-screen model showcases, scroll-driven sections, and navigation.",
    overview:
      "Practice work. The interesting constraint in Apple's layouts is that scroll position drives the content rather than merely moving past it, which is a different implementation problem from a static page and the reason this was worth rebuilding. React, TypeScript, and Tailwind on Vercel.",
    tags: [
      "TypeScript",
      "React.js",
      "Tailwind CSS",
      "Vercel",
    ],
    category: "Web",
    domains: [],
    tier: "practice",
    year: "2026",
    role: "Sole developer",
    // TODO(bondeth): one line each — users reached, volume handled, a
    // number that moved. Renders as its own section once non-empty.
    outcomes: [],
    visibility: "public",
    links: [
      { kind: "app", url: "https://apple-bondeth.vercel.app" },
      { kind: "repo", url: "https://github.com/RithyBondeth/Next-Apple-Clone" },
    ],
    image: "/previews/apple-clone.webp",
    gradient: "from-zinc-600/20 via-slate-500/10 to-slate-800",
  },
  {
    slug: "tesla-clone",
    title: "Tesla Clone",
    description:
      "A front-end rebuild of Tesla's site — full-screen model showcases, smooth scroll sections, and navigation.",
    overview:
      "Practice work, built alongside the Apple rebuild to compare how two companies solve the same full-bleed product page differently. React, TypeScript, and Tailwind on Vercel.",
    tags: [
      "TypeScript",
      "React.js",
      "Tailwind CSS",
      "Vercel",
    ],
    category: "Web",
    domains: [],
    tier: "practice",
    year: null,
    role: null,
    // TODO(bondeth): one line each — users reached, volume handled, a
    // number that moved. Renders as its own section once non-empty.
    outcomes: [],
    visibility: "public",
    links: [
      { kind: "app", url: "https://tesla-bondeth.vercel.app" },
    ],
    image: "/previews/tesla-clone.webp",
    gradient: "from-zinc-600/20 via-slate-500/10 to-slate-800",
  },
  {
    slug: "sabynews-clone",
    title: "Sabynews Clone",
    description:
      "A pixel-faithful rebuild of the Sabay News portal — dense Khmer-language grids and category navigation.",
    overview:
      "Practice work, and a harder layout problem than it looks: Khmer sets at a different line height to Latin, so a news grid tuned on English copy breaks the moment real headlines go into it. React, TypeScript, and Tailwind on Vercel.",
    tags: [
      "TypeScript",
      "React.js",
      "Tailwind CSS",
      "Vercel",
    ],
    category: "Web",
    domains: [],
    tier: "practice",
    year: null,
    role: null,
    // TODO(bondeth): one line each — users reached, volume handled, a
    // number that moved. Renders as its own section once non-empty.
    outcomes: [],
    visibility: "public",
    links: [
      { kind: "app", url: "https://sabynews-clone-bondeth.netlify.app" },
    ],
    image: "/previews/sabynews-clone.webp",
    gradient: "from-red-600/20 via-rose-500/10 to-slate-800",
  },
  {
    slug: "bondeth-vlog",
    title: "Bondeth Vlog",
    description:
      "My first personal site — blog posts, projects, and skills behind an animated 3D logo.",
    overview:
      "Early work, kept here as a marker of where the current site started. React, TypeScript, and Tailwind on Vercel.",
    tags: [
      "TypeScript",
      "React.js",
      "Tailwind CSS",
      "Vercel",
    ],
    category: "Web",
    domains: [],
    tier: "practice",
    year: null,
    role: null,
    // TODO(bondeth): one line each — users reached, volume handled, a
    // number that moved. Renders as its own section once non-empty.
    outcomes: [],
    visibility: "public",
    links: [
      { kind: "app", url: "https://bondeth-blog.vercel.app" },
    ],
    image: "/previews/bondeth-vlog.webp",
    gradient: "from-slate-600/20 via-gray-500/10 to-slate-800",
  },
];
