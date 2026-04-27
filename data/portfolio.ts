import type {
  NavLink,
  SkillGroup,
  Experience,
  Project,
  SiteConfig,
} from "@/types";

export const siteConfig: SiteConfig = {
  name: "Rithy Bondeth",
  title: "Software Engineer & AI Engineer",
  tagline:
    "I build elegant web applications and intelligent AI systems — from pixel-perfect UIs to production-ready ML pipelines.",
  bio: [
    "I'm Rithy Bondeth, a software and AI engineer passionate about building high-quality digital experiences. I work across the full stack and bring machine learning models from research to production.",
    "I specialize in modern JavaScript ecosystems for the web and Python-based AI/ML workflows, with a focus on LLMs, retrieval-augmented generation, and agentic systems.",
    "I believe the best technology is invisible — it just works, and works beautifully.",
  ],
  email: "rithy@example.com",
  github: "https://github.com",
  linkedin: "https://linkedin.com",
};

export const navLinks: NavLink[] = [
  { href: "#about", label: "About" },
  { href: "#skills", label: "Skills" },
  { href: "#experience", label: "Experience" },
  { href: "#projects", label: "Projects" },
  { href: "#contact", label: "Contact" },
];

export const skillGroups: SkillGroup[] = [
  {
    category: "Frontend",
    skills: [
      { name: "React", icon: "SiReact", color: "#61DAFB" },
      { name: "Next.js", icon: "SiNextdotjs", color: "#FFFFFF" },
      { name: "TypeScript", icon: "SiTypescript", color: "#3178C6" },
      { name: "Tailwind CSS", icon: "SiTailwindcss", color: "#06B6D4" },
      { name: "HTML5", icon: "SiHtml5", color: "#E34F26" },
    ],
  },
  {
    category: "Backend",
    skills: [
      { name: "Python", icon: "SiPython", color: "#3776AB" },
      { name: "Node.js", icon: "SiNodedotjs", color: "#339933" },
      { name: "PostgreSQL", icon: "SiPostgresql", color: "#4169E1" },
      { name: "GraphQL", icon: "SiGraphql", color: "#E10098" },
      { name: "FastAPI", icon: "SiFastapi", color: "#009688" },
    ],
  },
  {
    category: "AI & ML",
    skills: [
      { name: "PyTorch", icon: "SiPytorch", color: "#EE4C2C" },
      { name: "TensorFlow", icon: "SiTensorflow", color: "#FF6F00" },
      { name: "OpenAI", icon: "SiOpenai", color: "#FFFFFF" },
      { name: "LangChain", icon: "SiLangchain", color: "#10B981" },
      { name: "Hugging Face", icon: "SiHuggingface", color: "#FFD21E" },
    ],
  },
  {
    category: "Tools & DevOps",
    skills: [
      { name: "Git", icon: "SiGit", color: "#F05032" },
      { name: "Docker", icon: "SiDocker", color: "#2496ED" },
      { name: "GitHub", icon: "SiGithub", color: "#FFFFFF" },
      { name: "Vercel", icon: "SiVercel", color: "#FFFFFF" },
      { name: "Linux", icon: "SiLinux", color: "#FCC624" },
    ],
  },
];

export const experiences: Experience[] = [
  {
    role: "Software Engineer",
    company: "Company Name",
    period: "2023 – Present",
    description:
      "Led development of key product features, collaborated with cross-functional teams, and improved system performance by 40% through architecture refactoring.",
    tags: ["React", "Node.js", "PostgreSQL"],
  },
  {
    role: "Frontend Developer",
    company: "Previous Company",
    period: "2022 – 2023",
    description:
      "Built responsive user interfaces for a SaaS platform, implemented design system components, and shipped features that increased user engagement.",
    tags: ["TypeScript", "Next.js", "Tailwind CSS"],
  },
  {
    role: "Junior Developer",
    company: "Startup",
    period: "2021 – 2022",
    description:
      "Developed and maintained full-stack web applications, wrote automated tests, and contributed to improving development workflows.",
    tags: ["React", "Python", "REST APIs"],
  },
];

export const projects: Project[] = [
  {
    title: "Project Alpha",
    description:
      "A full-stack web application that helps teams collaborate more effectively. Features real-time updates, role-based access control, and an intuitive dashboard.",
    tags: ["Next.js", "TypeScript", "PostgreSQL", "Tailwind CSS"],
    github: "https://github.com",
    live: "https://example.com",
  },
  {
    title: "Project Beta",
    description:
      "An open-source developer tool that automates repetitive tasks in CI/CD pipelines. Used by 500+ developers on GitHub.",
    tags: ["Node.js", "Docker", "GitHub Actions"],
    github: "https://github.com",
    live: null,
  },
  {
    title: "Project Gamma",
    description:
      "A mobile-first e-commerce experience with seamless checkout flow, inventory management, and analytics dashboard.",
    tags: ["React", "Python", "AWS", "Stripe"],
    github: "https://github.com",
    live: "https://example.com",
  },
];
