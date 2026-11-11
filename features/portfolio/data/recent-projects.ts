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
    // Evidence and source revisions are recorded in docs/project-catalog.md.
    caseStudy: {
      problem:
        "Asking a database a plain-language question is only useful if the generated SQL can be inspected and run within clear limits. A plausible query can still change data, fail on a join, or return the wrong answer. AskDB makes those boundaries and failures visible instead of presenting model output as a finished result.",
      constraints: [
        "Generated and manually edited SQL must pass the same read-only checks",
        "Queries need execution timeouts and a cap on returned rows",
        "Hosted and local models must use the same validation and execution pipeline",
      ],
      decisions: [
        {
          title: "Enforce read-only access at two layers",
          body: "SQLGlot parses each response and rejects multiple statements, writes, and schema changes. SQLite connections open in read-only mode; PostgreSQL sessions set read-only transactions. SQL edited in the interface goes through the same checks.",
          tradeoff:
            "Read-only access prevents writes, but does not decide which data a user should see. PostgreSQL still needs a dedicated role with appropriately limited read permissions.",
        },
        {
          title: "Make failed attempts inspectable",
          body: "Validation and database errors go back to the model with the failed SQL, with two repairs allowed by default. Streamed events expose progress and attempts, so a user can see how an answer was reached or why it failed. Blocked statements are never executed.",
        },
        {
          title: "Evaluate returned data, not SQL wording",
          body: "The evaluation harness compares the rows returned by generated SQL with those returned by reference queries. It exercises the same pipeline as the API and command line, so different query formulations can be accepted when they produce equivalent results.",
          tradeoff:
            "The bundled evaluation covers 35 Chinook questions. It provides a repeatable check on that dataset, not evidence of accuracy across arbitrary business databases.",
        },
      ],
      outcome:
        "The implemented workflow takes a question through schema selection, SQL generation, validation, execution, and table or chart presentation. Users can inspect attempts, edit and rerun SQL, ask follow-up questions, and upload SQLite or CSV data. The repository includes an evaluation harness; comparative model accuracy has not yet been published.",
    },
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
    caseStudy: {
      problem:
        "A useful 3D map of Cambodia needs to help people recognize places and follow a route on a phone. Detailed landmarks alone are not enough: the experience also has to work with incomplete building data, mobile rendering limits, and the location capabilities a browser actually provides.",
      constraints: [
        "Keep the 3D experience practical for mid-range Android phones",
        "Work with OpenStreetMap coverage and estimated building heights",
        "Browser GPS requires HTTPS and an open, visible tab",
      ],
      decisions: [
        {
          title: "Combine broad coverage with specific landmarks",
          body: "MapLibre renders terrain and extruded OpenStreetMap buildings, while custom Three.js models add Angkor Wat and Independence Monument. This gives the map a countrywide base without hand-modeling every building.",
          tradeoff:
            "Missing building heights use estimates. The result is a stylized map, and prominent towers still need height verification.",
        },
        {
          title: "Share one navigation engine with the route preview",
          body: "Live navigation uses GPS for route snapping, rerouting, voice prompts, and a following 3D camera. The desktop preview feeds simulated GPS into the same engine, making the navigation behavior explorable without taking a phone onto the road.",
        },
        {
          title: "Use open services and state their limits",
          body: "Place search uses Photon and routing uses the OSRM public demo server. This keeps development independent of paid map keys while supporting route planning and turn-by-turn guidance.",
          tradeoff:
            "The demo routing service needs replacing before a production launch. Live traffic and background navigation are outside the current implementation.",
        },
      ],
      outcome:
        "The project implements a browser map with terrain, recognizable Cambodian landmarks, place search, route previews, and foreground GPS navigation. The next production steps are replacing the demo routing service, verifying building heights, and testing on mid-range Android devices.",
    },
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
    caseStudy: {
      problem:
        "Making an explainer video means coordinating a content plan, a script, narration, captions, and a render. If those stages form one opaque generation step, correcting a scene means losing control over the rest. Bondeth Studio gives creators an editable path from an idea to a finished video.",
      constraints: [
        "Plans and scenes must remain editable between generation stages",
        "Caption timing must follow the recorded narration",
        "The same video specification must support vertical and landscape exports",
      ],
      decisions: [
        {
          title: "Save editable artifacts between stages",
          body: "Plans and video specifications are stored as structured JSON. The editor updates those files, and generated replies are checked against the expected schema. Creators can revise a script or scene before recording narration or rendering, with manual alternatives to AI writing.",
        },
        {
          title: "Reuse narration that has not changed",
          body: "Audio filenames include a hash of the narration, voice, voice settings, and model. The pipeline reuses existing files for unchanged scenes and records the scenes that need new audio. Word timings returned with narration drive the captions.",
          tradeoff:
            "Creators who record their own voice keep control of those files: the pipeline does not automatically replace a personal recording when its script changes.",
        },
        {
          title: "Render both formats from the same specification",
          body: "React scene components and Remotion turn the edited specification into captioned MP4s in 9:16 and 16:9. Visual snapshot checks cover scene layouts and transitions in both formats, alongside a short test render in CI.",
          tradeoff:
            "Rendering uses the creator’s computer or server, so export capacity depends on the machine running the studio.",
        },
      ],
      outcome:
        "The implemented studio supports planning, scene editing with a live preview, narration, captioned exports, and downloadable publishing bundles. Its browser editor and command-line pipeline use the same project files, letting creators review and revise the work at each stage.",
    },
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
