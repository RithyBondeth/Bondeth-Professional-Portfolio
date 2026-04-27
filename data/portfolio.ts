import type {
  NavLink,
  SkillGroup,
  Experience,
  Project,
  SiteConfig,
  Education,
  TrainingCourse,
  Organization,
} from "@/types";

export const siteConfig: SiteConfig = {
  name: "Rithy Bondeth",
  title: "Full Stack Developer & AI Engineer",
  tagline:
    "I build elegant web applications and intelligent AI systems — from pixel-perfect UIs to production-ready ML pipelines.",
  bio: [
    "I'm Rithy Bondeth, a full stack developer and AI engineer based in Phnom Penh, Cambodia. I'm passionate about building high-quality digital experiences across web and mobile platforms.",
    "I specialize in modern JavaScript ecosystems (React, Next.js, Vue, NestJS) and Python-based AI/ML workflows, with experience shipping products from internship to freelance to full-time at Mango-Byte.",
    "I believe the best technology is invisible — it just works, and works beautifully.",
  ],
  email: "rithybondeth999@gmail.com",
  github: "https://github.com/bondeth",
  linkedin: "https://linkedin.com/in/rithybondeth",
};

export const navLinks: NavLink[] = [
  { href: "#about", label: "About" },
  { href: "#skills", label: "Skills" },
  { href: "#experience", label: "Experience" },
  { href: "#education", label: "Education" },
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
    role: "Full Stack Developer",
    company: "Mango-Byte",
    period: "2024 – Present",
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

export const educations: Education[] = [
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

export const trainingCourses: TrainingCourse[] = [
  { title: "Frontend Web Development", institution: "Instinct Institute" },
  { title: "Backend Web Development", institution: "Instinct Institute" },
  { title: "Mobile App Development", institution: "Instinct Institute" },
  { title: "Web Development with Next.js", institution: "Sabai Code" },
  { title: "Python for Data Science", institution: "Sabai Code" },
];

export const organizations: Organization[] = [
  { name: "Mango-Byte",               logo: "/organizations/mango-byte-logo.png" },
  { name: "CADT",                     logo: "/organizations/cadt-logo.png" },
  { name: "ALLWEB IT",                logo: "/organizations/allweb-logo.png" },
  { name: "Pailin Province Hall",     logo: "/organizations/pailin-province-hall-logo.jpg" },
  { name: "Apsara",                   logo: "/organizations/apsara-logo.svg" },
  { name: "DEBC",                     logo: "/organizations/debc-logo.png" },
  { name: "MEF",                      logo: "/organizations/mef-logo.png" },
];

export const projects: Project[] = [
  {
    title: "Project Alpha",
    description:
      "A full-stack web application that helps teams collaborate more effectively. Features real-time updates, role-based access control, and an intuitive dashboard.",
    tags: ["Next.js", "TypeScript", "PostgreSQL", "Tailwind CSS"],
    github: "https://github.com",
    live: "https://example.com",
    image: null,
    gradient: "from-blue-600/20 via-cyan-500/10 to-slate-800",
  },
  {
    title: "Project Beta",
    description:
      "An open-source developer tool that automates repetitive tasks in CI/CD pipelines. Used by 500+ developers on GitHub.",
    tags: ["Node.js", "Docker", "GitHub Actions"],
    github: "https://github.com",
    live: null,
    image: null,
    gradient: "from-violet-600/20 via-purple-500/10 to-slate-800",
  },
  {
    title: "Project Gamma",
    description:
      "A mobile-first e-commerce experience with seamless checkout flow, inventory management, and analytics dashboard.",
    tags: ["React", "Python", "AWS", "Stripe"],
    github: "https://github.com",
    live: "https://example.com",
    image: null,
    gradient: "from-emerald-600/20 via-teal-500/10 to-slate-800",
  },
];
