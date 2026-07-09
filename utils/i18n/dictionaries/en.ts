export const en = {
  nav: {
    about: "About",
    skills: "Skills",
    experience: "Experience",
    education: "Education",
    projects: "Projects",
    contact: "Contact",
    blog: "Blog",
    resume: "Resume",
    resumeMobile: "Resume.pdf",
    toggleMenu: "Toggle menu",
    toggleTheme: "Switch theme",
  },
  hero: {
    titles: ["Full Stack Developer", "AI Engineer", "Mobile App Developer"],
    viewWork: "./view-work",
    downloadCv: "./download-cv",
    getInTouch: "./get-in-touch",
    scroll: "scroll",
  },
  about: {
    heading: "Passionate about building things that matter.",
    portraitAlt:
      "Rithy Bondeth, full-stack and AI engineer, resting his chin on his hand in thought, seated in front of code-editor screens.",
    stats: {
      yearsExp: "Years Experience",
      projects: "Projects Completed",
      techStack: "Technologies",
      clients: "Happy Clients",
    },
  },
  currentFocus: {
    heading: "What I'm focused on now",
    blurb:
      "A snapshot of the work, technologies, and opportunities receiving my attention right now.",
    status: "Open to meaningful collaborations",
    items: [
      {
        label: "Building",
        value:
          "Production web and mobile services at the Digital Economy and Business Committee.",
      },
      {
        label: "Exploring",
        value:
          "Reliable AI systems, agentic workflows, RAG, and practical LLM evaluation.",
      },
      {
        label: "Collaborating",
        value:
          "Open to selected software, AI, and product collaborations where I can create measurable value.",
      },
      {
        label: "Based in",
        value:
          "Phnom Penh, Cambodia — working in the UTC+7 time zone with local and remote teams.",
      },
    ],
  },
  skills: {
    heading: "Technologies I work with",
    levels: {
      expert: "Expert",
      proficient: "Proficient",
      familiar: "Familiar",
    },
  },
  experience: {
    heading: "Where I've worked",
    organizations: "Organizations I've worked with",
    earlierRoles: "View earlier experience",
  },
  education: {
    heading: "Academic background",
    trainingCourses: "Training Courses",
  },
  projects: {
    heading: "Things I've built",
    featuredBlurb:
      "Selected public work and limited profiles that show the products and systems I've contributed to.",
    viewAllProjects: "View all projects",
    allProjectsHeading: "All projects",
    allProjectsBlurb:
      "Browse my public projects and approved public-sector profiles. Sensitive implementation details remain private.",
    filterLabel: "Filter projects by category",
    filterAll: "All",
    viewDetails: "view details",
    publicProject: "Public project",
    limitedProject: "Limited public profile",
    confidentialProject: "Confidential project",
    confidentialCard:
      "Details are intentionally withheld to respect project confidentiality.",
    backToProjects: "back to projects",
    overview: "Overview",
    technologies: "Technologies",
    publicResources: "Public resources",
    liveProduct: "Live product",
    limitedNoticeTitle: "Public information only",
    limitedNotice:
      "This profile intentionally includes only publicly available information. Internal architecture, workflows, metrics, security details, and project materials are omitted to respect confidentiality and public-sector security requirements.",
    demo: "demo",
    noDemo: "no demo",
    empty: "No projects found in this category.",
  },
  labs: {
    navLabel: "AI Labs",
    heading: "Interactive AI Labs",
    blurb:
      "Small, transparent experiments that explain practical AI engineering patterns without hiding limitations or sending your data to external services.",
    experimental: "Experiment",
    costFree: "No API cost",
    structuredOutputTitle: "Structured Output Playground",
    structuredOutputDescription:
      "Turn an unstructured project inquiry into predictable JSON, then inspect schema validation and missing fields.",
    openLab: "Open playground",
    backToLabs: "back to all labs",
    playground: {
      intro:
        "Enter a project inquiry in English or Khmer. The local demo endpoint extracts contact details, service intent, and urgency, then validates the result against a fixed schema.",
      localMode: "Local demo mode",
      inputLabel: "Input",
      inputHeading: "Describe a project inquiry",
      privacy: "Processed locally by this site. No external AI provider is called.",
      run: "Extract structured data",
      running: "Extracting...",
      outputHeading: "Validated result",
      emptyOutput:
        "Run the extraction to see structured JSON and validation details.",
      valid: "Schema valid",
      incomplete: "Incomplete output",
      missingFields: "Missing required fields",
      schema: "Expected schema",
      error: "The extraction could not be completed. Please try again.",
      presets: [
        {
          label: "English example",
          value:
            "My name is Sokha Lim. Email me at sokha@example.com. I need an AI assistant for my online shop and the request is urgent.",
        },
        {
          label: "Khmer example",
          value:
            "ខ្ញុំឈ្មោះ សុខា លីម។ អ៊ីមែល sokha@example.com។ ខ្ញុំត្រូវការកម្មវិធីទូរស័ព្ទ ហើយគម្រោងនេះបន្ទាន់។",
        },
        {
          label: "Incomplete example",
          value:
            "We are considering a website for our organization sometime next month.",
        },
      ],
      steps: [
        {
          title: "Extract",
          description:
            "Identify candidate values from natural-language input.",
        },
        {
          title: "Normalize",
          description:
            "Map varied wording into stable service and urgency values.",
        },
        {
          title: "Validate",
          description:
            "Check required fields before another system consumes the result.",
        },
      ],
      relatedReading: "Related technical article",
      relatedArticle: "Getting Reliable JSON Out of an LLM",
    },
  },
  contact: {
    heading: "Let's work together",
    blurb:
      "I'm currently open to new opportunities. Whether you have a project in mind, a question, or just want to say hi — my inbox is always open.",
    form: {
      name: "Name",
      namePlaceholder: "Your Name",
      email: "Email",
      emailPlaceholder: "your@email.com",
      message: "Message",
      messagePlaceholder: "How can I help you?",
      characterCount: "characters",
      send: "Send Message",
      sending: "Sending...",
      successTitle: "Message Sent!",
      successBody:
        "Thanks for reaching out. I'll get back to you as soon as possible.",
      sendAnother: "Send another message",
      errorFallback:
        "Oops! Something went wrong. Please try again or email me directly.",
    },
  },
  footer: {
    navigation: "Navigation",
    contact: "Contact",
    basedIn: "based in Phnom Penh, Cambodia.",
    rights: "All rights reserved.",
  },
  blog: {
    heading: "Technical Insights",
    blurb:
      "Sharing my journey through software engineering, AI research, and building digital products. Expect deep dives, tutorials, and occasional rants about clean code.",
    subscribeRss: "Subscribe via RSS",
    backToAll: "back to all posts",
    viewMore: "View more posts",
    minRead: "min read",
    relatedPosts: "Related posts",
    empty: "No posts found. Check back soon!",
    searchPlaceholder: "Search posts by title, tag, or keyword…",
    searchLabel: "Search posts",
    clearSearch: "Clear search",
    noResults: "No posts match your search.",
    browseTags: "Browse by tag",
    viewAllTags: "View all tags",
    allTagsHeading: "All tags",
    allTagsBlurb: "Browse every topic covered on the blog.",
    taggedPrefix: "Posts tagged",
    postSingular: "post",
    postPlural: "posts",
  },
  commandPalette: {
    open: "Search",
    placeholder: "Type a command or search…",
    empty: "No results found.",
    groupNav: "Navigation",
    groupGeneral: "General",
    groupConnect: "Connect",
    toggleTheme: "Toggle theme",
    copyEmail: "Copy email address",
    emailCopied: "Email copied to clipboard",
    openResume: "Open résumé",
    viewGithub: "View GitHub profile",
    viewLinkedin: "View LinkedIn profile",
    hintNavigate: "navigate",
    hintSelect: "select",
    hintClose: "close",
  },
  notFound: {
    label: "Page not found",
    title: "Looks like you're lost",
    body: "The page you're looking for doesn't exist or has been moved. Let's get you back on track.",
    backHome: "Back to home",
  },
  meta: {
    blogTitle: "Blog",
    blogDescription:
      "Technical insights, AI research, and software engineering thoughts by Rithy Bondeth.",
  },
};
