export const en = {
  nav: {
    about: "About",
    skills: "Skills",
    experience: "Experience",
    education: "Education",
    projects: "Projects",
    contact: "Contact",
    labs: "Labs",
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
    ragTitle: "RAG Retrieval Visualizer",
    ragDescription:
      "Search a bilingual document set and inspect ranked chunks, matched terms, and the context selected for generation.",
    evalTitle: "LLM Evaluation Playground",
    evalDescription:
      "Compare two candidate responses with deterministic tests and reveal quality regressions before deployment.",
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
    rag: {
      intro:
        "Ask a question about the portfolio corpus. The local retrieval endpoint tokenizes the query, scores every chunk, and returns the highest-ranking context with transparent matching evidence.",
      localMode: "Local retrieval mode",
      queryHeading: "Ask the document set",
      queryLabel: "Retrieval query",
      privacy:
        "Uses a fixed public corpus on this site. No embeddings or external AI provider are called.",
      search: "Retrieve context",
      searching: "Retrieving...",
      resultsHeading: "Ranked context chunks",
      emptyResults:
        "Run retrieval to see which document chunks would be passed to an LLM.",
      noMatches:
        "No relevant chunks were found. Try a query about work, AI, technology, education, or location.",
      queryTerms: "Normalized query terms",
      pipeline: "Retrieval pipeline",
      error: "The retrieval could not be completed. Please try again.",
      presets: [
        {
          label: "AI focus",
          value: "What AI engineering topics does Bondeth work on?",
        },
        {
          label: "Education",
          value: "Where did he study and what scholarship did he receive?",
        },
        {
          label: "សំណួរខ្មែរ",
          value: "ការសិក្សា របស់ រិទ្ធី បណ្ឌេត",
        },
      ],
      steps: [
        {
          title: "Tokenize",
          description:
            "Normalize the question into searchable terms and remove common stop words.",
        },
        {
          title: "Score and rank",
          description:
            "Measure term coverage and density across every available chunk.",
        },
        {
          title: "Assemble context",
          description:
            "Select the highest-ranking chunks for a later generation step.",
        },
      ],
      relatedReading: "Related technical article",
      relatedArticle: "RAG on Postgres You Already Have",
    },
    evals: {
      intro:
        "Choose a test suite, edit two candidate responses, and compare them with reproducible graders. Every score comes from visible rules rather than another model's opinion.",
      localMode: "Deterministic eval mode",
      suiteHeading: "Choose an evaluation suite",
      prompt: "Task prompt",
      candidate: "Candidate",
      privacy:
        "Evaluated locally by this site. No response is sent to an external model or stored.",
      run: "Run evaluation",
      running: "Evaluating...",
      resultsHeading: "Regression report",
      emptyResults:
        "Run the suite to compare pass rates, weighted scores, and individual test failures.",
      winner: "Winner",
      tie: "Both candidates received the same weighted score.",
      test: "Test",
      weight: "Weight",
      pass: "Pass",
      fail: "Fail",
      error: "The evaluation could not be completed. Please try again.",
      testLabels: {
        "valid-json": "Valid JSON",
        "required-keys": "Required keys",
        "required-facts": "Required facts",
        "forbidden-claims": "Forbidden claims",
        citation: "Citation present",
        "khmer-script": "Khmer language",
        "max-length": "Length limit",
      },
      detailLabels: {
        "parse-success": "Parse successful",
        "parse-failed": "Parse failed",
        "all-keys-present": "All keys present",
        missing: "Missing",
        "all-facts-present": "All facts present",
        "no-forbidden-claims": "No forbidden claims",
        found: "Found",
        "citation-found": "Citation found",
        "citation-missing": "Citation missing",
        "khmer-found": "Khmer text found",
        "khmer-missing": "Khmer text missing",
        "character-count": "characters",
      },
      presets: [
        {
          suiteId: "structured-json",
          label: "Structured JSON",
          prompt:
            "Return JSON with status and priority. Do not include uncertain language.",
          candidateA: '{"status":"approved","priority":"high"}',
          candidateB:
            "The request is probably approved and maybe has high priority.",
        },
        {
          suiteId: "grounded-answer",
          label: "Grounded RAG",
          prompt:
            "Explain the retrieval stack using only the supplied context and include a citation.",
          candidateA:
            "The system stores embeddings in PostgreSQL with pgvector and retrieves similar chunks before generation [1].",
          candidateB:
            "The system is guaranteed to be always correct and uses a proprietary vector database with zero risk.",
        },
        {
          suiteId: "khmer-support",
          label: "Khmer support",
          prompt:
            "Answer in Khmer: Where is Bondeth based and what is his profession?",
          candidateA:
            "រិទ្ធី បណ្ឌេត មានមូលដ្ឋាននៅរាជធានីភ្នំពេញ និងជាវិស្វករសូហ្វវែរ។",
          candidateB:
            "Bondeth is a product designer based in Bangkok.",
        },
      ],
      steps: [
        {
          title: "Define expectations",
          description:
            "Turn product requirements into explicit pass/fail checks and weights.",
        },
        {
          title: "Compare candidates",
          description:
            "Run the same graders against a baseline and a proposed response.",
        },
        {
          title: "Catch regressions",
          description:
            "Inspect failed checks instead of trusting one aggregate score.",
        },
      ],
      relatedReading: "Related technical article",
      relatedArticle: "Designing LLM Evals That Catch Real Regressions",
    },
  },
  recommendations: {
    heading: "Recommendations & professional references",
    blurb:
      "My work spans product teams, private companies, and public-sector organizations. Verified professional references can be shared when they are relevant to an opportunity.",
    privacyTitle: "Trust without exposing confidential work",
    privacyBody:
      "Some collaborations involve internal or government systems. I protect that confidentiality while providing appropriate references and verifiable context when permitted.",
    items: [
      {
        title: "Reliable delivery",
        body: "References can speak to ownership, practical problem-solving, and delivering production software under real constraints.",
      },
      {
        title: "Cross-functional collaboration",
        body: "Experience working with technical teams, operational stakeholders, and decision-makers across different organizations.",
      },
      {
        title: "Responsible engineering",
        body: "A security-conscious and maintainable approach to web, mobile, data, and AI systems.",
      },
    ],
    requestReference: "Request a reference",
    viewLinkedIn: "View LinkedIn profile",
  },
  services: {
    heading: "Software solutions built for real needs",
    blurb:
      "I design and build reliable software solutions for organizations, teams, and growing products—from the first technical plan to production delivery.",
    items: [
      {
        title: "Web development",
        body: "Responsive websites, business platforms, dashboards, APIs, and full-stack web applications.",
      },
      {
        title: "Mobile app development",
        body: "Cross-platform mobile applications designed for practical workflows and dependable use.",
      },
      {
        title: "AI solutions & integration",
        body: "RAG systems, AI assistants, workflow automation, structured outputs, and evaluation pipelines.",
      },
      {
        title: "Custom software systems",
        body: "Secure internal tools and tailored digital systems for business or public-sector operations.",
      },
    ],
    discussProject: "Discuss your project",
    discussSolution: "Discuss this solution",
  },
  contact: {
    heading: "Tell me about your project",
    blurb:
      "Share the problem you are solving, your current stage, and where you need technical support. I will review the fit and reply with a practical next step.",
    availability: "Available for selected software projects",
    nextHeading: "What happens next",
    nextSteps: [
      "You send a short project brief.",
      "I review the scope and collaboration fit.",
      "You receive a clear next step or a useful referral.",
    ],
    directEmail: "Prefer email?",
    form: {
      projectType: "Project type",
      projectTypePlaceholder: "Select the closest match",
      projectTypes: [
        "Web development",
        "Mobile app development",
        "AI solution or integration",
        "Custom software system",
        "Other",
      ],
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
    writtenBy: "Written by",
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
    onThisPage: "On this page",
    share: {
      heading: "Share this article",
      native: "Share",
      copy: "Copy link",
      copied: "Link copied",
      email: "Email",
    },
    previousPost: "Previous article",
    nextPost: "Next article",
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
