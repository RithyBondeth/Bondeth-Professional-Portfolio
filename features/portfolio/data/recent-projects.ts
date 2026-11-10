import type { Project } from "@/features/portfolio/domain";

export const recentProjects: Project[] = [
  {
    slug: "askdb",
    group: "ai-data",
    title: "AskDB",
    description:
      "An AI agent that answers plain-language questions about your data with validated, read-only SQL, tables, and charts.",
    overview:
      "AskDB checks generated queries with SQLGlot and runs them in a read-only database session. Validation and execution errors can trigger a repair, with each attempt visible to the user. An execution-accuracy evaluation harness checks whether the queries return the expected results.",
    tags: ["Python", "FastAPI", "Next.js", "TypeScript", "SQLGlot"],
    category: "Web",
    domains: ["AI", "Developer Tools"],
    visibility: "public",
    links: [
      { kind: "site", url: "https://askdb.bondeth.site" },
      { kind: "repo", url: "https://github.com/RithyBondeth/AskDB" },
    ],
    previewType: "landing",
    image: "/previews/askdb-landing-0a1aad5c66b0.webp",
    logo: "/project-logos/askdb.webp",
  },
  {
    slug: "cambodia-3d-map",
    group: "games-3d",
    title: "Cambodia 3D Map",
    description:
      "An interactive 3D map of Cambodia with real terrain, hand-modeled Khmer landmarks, and turn-by-turn navigation.",
    overview:
      "MapLibre renders terrain and OpenStreetMap building footprints, with custom 3D models for Angkor Wat and Independence Monument. Navigation follows the phone’s GPS and switches to a chase camera with route arrows and voice guidance.",
    tags: [
      "MapLibre GL JS",
      "Three.js",
      "Next.js",
      "TypeScript",
      "OpenStreetMap",
    ],
    category: "Web",
    domains: ["3D", "Maps"],
    visibility: "public",
    links: [
      { kind: "repo", url: "https://github.com/RithyBondeth/Cambodia-3D-Map" },
    ],
    previewType: "landing",
    image: "/previews/cambodia-3d-map-landing-991f08f83023.webp",
    logo: "/project-logos/cambodia-3d-map.webp",
  },
  {
    slug: "bondeth-studio",
    group: "developer-tools",
    title: "Bondeth Studio",
    description:
      "A video production toolkit that turns an idea into scripts, narration, and captioned explainer videos.",
    overview:
      "Claude plans and scripts the series, ElevenLabs returns narration with word timings, and Remotion renders vertical or landscape MP4s. Each stage writes editable JSON so a creator can review and revise the plan or scenes before rendering.",
    tags: ["Remotion", "React", "TypeScript", "Claude", "ElevenLabs"],
    category: "Web",
    domains: ["AI", "Developer Tools"],
    visibility: "public",
    links: [
      {
        kind: "repo",
        url: "https://github.com/RithyBondeth/Bondeth-Content-Studio",
      },
    ],
    previewType: "landing",
    image: "/previews/bondeth-studio-landing-085380f500fe.webp",
    logo: "/project-logos/bondeth-studio.webp",
  },
  {
    slug: "the-unbroken-debt",
    group: "games-3d",
    title: "Boon Sop: The Unbroken Debt",
    description:
      "An episodic first-person survival horror game for the browser, set in rural Cambodia in 1932.",
    overview:
      "The Babylon.js game uses WebGPU and scales resolution when a frame runs over budget. The satchel and sketchbook serve as in-world interfaces for inventory, maps, and notes, while stealth and resource decisions shape how the player moves through the episode.",
    tags: ["Babylon.js", "WebGPU", "TypeScript", "Vite"],
    category: "Web",
    domains: ["Games", "3D"],
    visibility: "public",
    links: [
      { kind: "app", url: "https://the-unbroken-debt.vercel.app" },
      {
        kind: "repo",
        url: "https://github.com/RithyBondeth/The-Unbroken-Debt",
      },
    ],
    previewType: "landing",
    image: "/previews/the-unbroken-debt-landing-e81fc7565182.webp",
    logo: "/project-logos/the-unbroken-debt.webp",
  },
  {
    slug: "angkor-architect",
    group: "games-3d",
    title: "Angkor Architect",
    description:
      "A playable isometric city-builder prototype inspired by the canals and reservoirs of the medieval Khmer Empire.",
    overview:
      "PixiJS draws the isometric city while a cellular simulation models water flow across elevations. Workers and barges use A* pathfinding, and local saves can be exported as JSON.",
    tags: ["PixiJS", "WebGL", "TypeScript", "Vite", "IndexedDB"],
    category: "Web",
    domains: ["Games", "Simulation"],
    status: "prototype",
    visibility: "public",
    links: [
      { kind: "app", url: "https://angkor-architecture.vercel.app" },
      {
        kind: "repo",
        url: "https://github.com/RithyBondeth/Angkor-Architecture",
      },
    ],
    previewType: "landing",
    image: "/previews/angkor-architect-landing-301421d5962d.webp",
    logo: "/project-logos/angkor-architect.webp",
  },
  {
    slug: "bondeth-ai",
    group: "ai-data",
    title: "Bondeth AI",
    description:
      "A self-hosted voice platform for Khmer and English transcription, speech synthesis, and zero-shot voice cloning.",
    overview:
      "A Next.js workspace sits in front of a Python and FastAPI backend that connects to open-source speech engines. The project focuses on workflows for Khmer speakers and conversations that switch between Khmer and English.",
    tags: ["Python", "FastAPI", "PyTorch", "Next.js", "PostgreSQL", "Redis"],
    category: "Web",
    domains: ["AI"],
    status: "in-development",
    visibility: "public",
    links: [
      { kind: "repo", url: "https://github.com/RithyBondeth/Bondeth-AI" },
    ],
    previewType: "landing",
    image: "/previews/bondeth-ai-landing-4e0d38e45698.webp",
    logo: "/project-logos/bondeth-ai.webp",
  },
  {
    slug: "nexus-pc",
    group: "games-3d",
    title: "Nexus-PC",
    description:
      "An Android game library and experimental runner for DRM-free Windows games, built with Flutter and a native runtime bridge.",
    overview:
      "The Android app validates folder and ZIP imports and tracks them in a local library. An opt-in build uses Wine and Box64 to launch supported Windows executables. The runtime is experimental and does not establish general game compatibility.",
    tags: ["Flutter", "Kotlin", "C++", "Android", "Wine", "Box64"],
    category: "Mobile",
    domains: ["Games", "Developer Tools"],
    status: "in-development",
    visibility: "public",
    links: [{ kind: "repo", url: "https://github.com/RithyBondeth/Nexus-PC" }],
    previewType: "landing",
    image: "/previews/nexus-pc-landing-d5241e38d5e7.webp",
    logo: "/project-logos/nexus-pc.webp",
  },
  {
    slug: "visioncare-ai",
    group: "academic",
    title: "VisionCare AI",
    description:
      "A computer vision capstone that explores classifying eye images with convolutional neural networks.",
    overview:
      "The academic prototype first checks whether an upload shows an eye, then classifies it using a model trained on four categories. The repository includes VGG16 and ResNet18 experiments, a Flask model API, and a React frontend backed by Laravel.",
    tags: ["Python", "PyTorch", "Flask", "Laravel", "React", "Jupyter"],
    category: "Web",
    domains: ["AI", "Computer Vision"],
    tier: "practice",
    status: "academic",
    visibility: "public",
    links: [
      { kind: "repo", url: "https://github.com/RithyBondeth/Visioncare-AI" },
    ],
    previewType: "landing",
    image: "/previews/visioncare-ai-landing-c89ee2be7a67.webp",
    logo: "/project-logos/visioncare-ai.webp",
  },
];
