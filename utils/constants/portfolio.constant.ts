import {
  INavLink,
  ISkillGroup,
  IExperience,
  IProject,
  ISiteConfig,
  IEducation,
  ITrainingCourse,
  IOrganization,
} from "@/utils/interfaces/portfolio";

/* -------------------------------- Site Config ------------------------------- */
export const siteConfig: ISiteConfig = {
  name: "Rithy Bondeth",
  url:
    process.env.NEXT_PUBLIC_SITE_URL ??
    "https://bondeth-professional-portfolio.vercel.app",
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
  resume: "/files/bondeth-resume.pdf",
};

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
      { name: "Next.js", icon: "SiNextdotjs", color: "#FFFFFF", level: 3 },
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
    category: "APIs & Messaging",
    skills: [
      { name: "REST", icon: "", color: "#22C55E", level: 3 },
      { name: "WebSocket", icon: "", color: "#38BDF8", level: 2 },
      { name: "gRPC", icon: "", color: "#7C4DFF", level: 2 },
      { name: "RabbitMQ", icon: "SiRabbitmq", color: "#FF6600", level: 2 },
    ],
  },
  {
    category: "AI & ML",
    skills: [
      { name: "OpenAI", icon: "SiOpenai", color: "#FFFFFF", level: 3 },
      { name: "Anthropic", icon: "SiAnthropic", color: "#D97757", level: 2 },
      { name: "Gemini", icon: "SiGooglegemini", color: "#8E75B2", level: 2 },
      { name: "LangChain", icon: "SiLangchain", color: "#10B981", level: 2 },
      { name: "LangGraph", icon: "SiLanggraph", color: "#26A69A", level: 2 },
      { name: "Ollama", icon: "SiOllama", color: "#FFFFFF", level: 2 },
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
      { name: "Vercel", icon: "SiVercel", color: "#FFFFFF", level: 3 },
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
      { name: "GitHub", icon: "SiGithub", color: "#FFFFFF", level: 3 },
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

/* ----------------------------- Training Courses ----------------------------- */
export const trainingCourses: ITrainingCourse[] = [
  { title: "Frontend Web Development", institution: "Instinct Institute" },
  { title: "Backend Web Development", institution: "Instinct Institute" },
  { title: "Mobile App Development", institution: "Instinct Institute" },
  { title: "Web Development with Next.js", institution: "Sabai Code" },
  { title: "Python for Data Science", institution: "Sabai Code" },
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
    slug: "apsara-talent",
    title: "Apsara Talent",
    description:
      "The Apsara Talent platform is designed to address the challenges of the recruitment process by simplifying and improving job matching for freelancers and employers.",
    tags: [
      "Typescript",
      "Next.js",
      "Nest.js",
      "Microservices",
      "Firebase",
      "PostgreSQL",
      "MongoDB",
      "Redis",
      "RabbitMQ",
      "Docker",
      "Kubernetes",
      "Cloudflare",
      "Sentry",
      "Grafana",
      "Prometheus",
      "Nginx",
    ],
    category: "Web",
    visibility: "public",
    github: "https://github.com/apsara-talent/apsara-talent",
    live: "https://apsaratalent.vercel.app",
    image: "/previews/apsara-talent.png",
    gradient: "from-blue-600/20 via-cyan-500/10 to-slate-800",
  },
  {
    slug: "apsara-assistant",
    title: "Apsara Assistant",
    description:
      "Apsara Assistant is an AI-powered sales assistant designed for Cambodian online sellers. It helps businesses automatically reply to customer messages, manage conversations, and increase sales — all in Khmer and English.",
    tags: [
      "Typescript",
      "Next.js",
      "Python",
      "FastAPI",
      "PostgreSQL",
      "Redis",
      "MongoDB",
      "LLM APIs",
      "Docker",
      "Cloudflare",
      "Sentry",
      "Grafana",
      "Prometheus",
      "Nginx",
    ],
    category: "AI",
    visibility: "public",
    github: "https://github.com/apsara-assistant/apsara-assistant",
    live: "https://apsara-assistant.vercel.app/",
    image: "/previews/apsara-assistant.png",
    gradient: "from-violet-600/20 via-purple-500/10 to-slate-800",
  },
  {
    slug: "apsara-agentic",
    title: "Apsara Agentic",
    description:
      "Apsara Agentic is a production-ready backend system for building an AI-powered agentic coding platform. It explores how modern AI agents can understand tasks, reason through problems, and generate code using large language models.",
    tags: [
      "Typescript",
      "Next.js",
      "Python",
      "FastAPI",
      "PostgreSQL",
      "MongoDB",
      "Redis",
      "LLM APIs",
      "Docker",
      "Cloudflare",
      "Sentry",
      "Grafana",
      "Prometheus",
      "Nginx",
    ],
    category: "AI",
    visibility: "public",
    github: "https://github.com/apsara-agentic/apsara-agentic",
    live: "https://apsara-agentic.vercel.app",
    image: "/previews/apsara-agentic.png",
    gradient: "from-emerald-600/20 via-teal-500/10 to-slate-800",
  },
  {
    slug: "apsara-elearning",
    title: "Apsara Elearning",
    description:
      "Apsara Elearning is a first AI-powered elearning platform built for Cambodian students. Learn Math, Physics, Chemistry, and more with Apsara Elearning — your personal AI mentor that speaks Khmer.",
    tags: [
      "Typescript",
      "Next.js",
      "Nest.js",
      "Microservices",
      "RabbitMQ",
      "PostgreSQL",
      "Redis",
      "MongoDB",
      "LLM APIs",
      "Docker",
      "Cloudflare",
      "Sentry",
      "Grafana",
      "Prometheus",
      "Nginx",
    ],
    category: "AI",
    visibility: "public",
    github: "https://github.com/apsara-elearning/apsara-elearning-web",
    live: "https://apsara-elearning.vercel.app",
    image: "/previews/apsara-elearning.png",
    gradient: "from-slate-600/20 via-gray-500/10 to-slate-800",
  },
  {
    slug: "debc-website",
    title: "DEBC Website",
    description:
      "Official website for the Digital Economy and Business Committee of Cambodia. Built to inform the public on digital economy policies, news, and government services.",
    tags: [
      "Typescript",
      "Next.js",
      "Nest.js",
      "Supabase",
      "PostgreSQL",
      "Docker",
      "AWS",
      "Sentry",
      "Grafana",
      "Prometheus",
      "Nginx",
    ],
    category: "Web",
    visibility: "limited",
    github: null,
    live: "https://digitaleconomy.gov.kh/?lang=kh",
    image: "/previews/debc-website.png",
    gradient: "from-blue-700/20 via-indigo-500/10 to-slate-800",
  },
  {
    slug: "informal-economy",
    title: "Informal Economy",
    description:
      "A platform developed in collaboration with the Ministry of Economy and Finance (MEF) to register and support informal economy workers across Cambodia.",
    tags: [
      "Typescript",
      "Next.js",
      "Nest.js",
      "Microservices",
      "PostgreSQL",
      "Supabase",
      "RabbitMQ",
      "Docker",
      "Kubernetes",
      "AWS",
      "Sentry",
      "Grafana",
      "Prometheus",
      "Nginx",
    ],
    category: "Web",
    visibility: "limited",
    github: null,
    live: "https://informal.digitaleconomy.gov.kh/km",
    image: "/previews/informal-economy.png",
    gradient: "from-amber-600/20 via-orange-500/10 to-slate-800",
  },
  {
    slug: "cambodia-investment-platform",
    title: "Cambodia Investment Platform",
    description:
      "Landing page for Cambodia Investment Platform — a platform that connects startups, MSMEs, investors, and the public through trusted digital financing mechanisms to support entrepreneurship, innovation, business growth, and economic development.",
    tags: ["Typescript", "Next.js", "Tailwind CSS", "Vercel"],
    category: "Web",
    visibility: "limited",
    github: null,
    live: "https://edf-cip-website-dev.intechdevkh.com/en",
    image: "/previews/cambodia-investment-platform.png",
    gradient: "from-emerald-700/20 via-green-500/10 to-slate-800",
  },
  {
    slug: "code-hub",
    title: "Code Hub",
    description:
      "A developer community platform built during my freelance career. Features authentication with Google, Facebook, and GitHub SSO, enabling developers to discover and share projects.",
    tags: [
      "Typescript",
      "React.js",
      "Nest.js",
      "PostgreSQL",
      "Firebase",
      "Docker",
    ],
    category: "Web",
    visibility: "public",
    github: "https://github.com/bondeth/codehub",
    live: "https://codehub-bondeth.netlify.app/signin",
    image: "/previews/codehub.png",
    gradient: "from-rose-600/20 via-pink-500/10 to-slate-800",
  },
  {
    slug: "apple-clone",
    title: "Apple Clone",
    description:
      "A front-end clone of the Apple website featuring the iconic full-screen model showcases, smooth scroll sections, and navigation — built to sharpen UI implementation skills.",
    tags: ["Typescript", "React.js", "Tailwind CSS", "Vercel"],
    category: "Web",
    visibility: "public",
    github: "https://github.com/bondeth/apple-clone",
    live: "https://apple-bondeth.vercel.app",
    image: "/previews/apple-clone.png",
    gradient: "from-zinc-600/20 via-slate-500/10 to-slate-800",
  },
  {
    slug: "tesla-clone",
    title: "Tesla Clone",
    description:
      "A front-end clone of the Tesla website featuring the iconic full-screen model showcases, smooth scroll sections, and navigation — built to sharpen UI implementation skills.",
    tags: ["Typescript", "React.js", "Tailwind CSS", "Vercel"],
    category: "Web",
    visibility: "public",
    github: "https://github.com/bondeth/tesla-clone",
    live: "https://tesla-bondeth.vercel.app",
    image: "/previews/tesla-clone.png",
    gradient: "from-zinc-600/20 via-slate-500/10 to-slate-800",
  },
  {
    slug: "sabynews-clone",
    title: "Sabynews Clone",
    description:
      "A pixel-faithful clone of the Sabay News website, built to practice replicating real-world Khmer news portal layouts with complex grids and category navigation.",
    tags: ["Typescript", "React.js", "Tailwind CSS", "Vercel"],
    category: "Web",
    visibility: "public",
    github: "https://github.com/bondeth/sabynews-clone",
    live: "https://sabynews-clone-bondeth.netlify.app",
    image: "/previews/sabynews-clone.png",
    gradient: "from-red-600/20 via-rose-500/10 to-slate-800",
  },
  {
    slug: "bondeth-vlog",
    title: "Bondeth Vlog",
    description:
      "My oldschool personal vlog and portfolio site — an early project showcasing blog posts, projects, and skills with a distinctive animated 3D logo.",
    tags: ["Typescript", "React.js", "Tailwind CSS", "Vercel"],
    category: "Web",
    visibility: "public",
    github: "https://github.com/bondeth/bondeth-blog",
    live: "https://bondeth-blog.vercel.app",
    image: "/previews/bondeth-vlog.png",
    gradient: "from-slate-600/20 via-gray-500/10 to-slate-800",
  },
];
