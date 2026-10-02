/** Seven-project, four-chapter portfolio film. Native 1920×1080 / 120 fps / 30 s. */
const composition = async ({ project, frame, text, rect, media }) => {
  const p = await project({
    size: "1920x1080",
    fps: 120,
    background: "#141413",
  });
  const C = {
    ink: "#141413",
    paper: "#faf9f5",
    coral: "#d97757",
    warm: "#f0eee6",
    border: "#e3dacc",
    muted: "#a6a398",
    darkMuted: "#66635d",
  };
  const asset = (name) => new URL("assets/" + name, import.meta.url).pathname;
  const portrait = await p.add(asset("portrait-v7.png"));
  const shotNames = [
    "talent",
    "assistant",
    "agentic",
    "elearning",
    "wallet",
    "romlerk",
    "notch",
  ];
  const shots = {};
  for (const name of shotNames) shots[name] = await p.add(asset(name + ".png"));

  const technologies = [
    ["react", "React"],
    ["nextdotjs", "Next.js"],
    ["typescript", "TypeScript"],
    ["vuedotjs", "Vue.js"],
    ["nuxt", "Nuxt"],
    ["tailwindcss", "Tailwind"],
    ["nodedotjs", "Node.js"],
    ["nestjs", "NestJS"],
    ["postgresql", "PostgreSQL"],
    ["python", "Python"],
    ["fastapi", "FastAPI"],
    ["huggingface", "Hugging Face"],
    ["flutter", "Flutter"],
    ["dart", "Dart"],
    ["swift", "Swift"],
    ["docker", "Docker"],
    ["redis", "Redis"],
    ["cloudflare", "Cloudflare"],
  ];
  const icons = {};
  for (const [slug] of technologies)
    icons[slug] = await p.add(asset(slug + ".png"));
  const soundtrack = await p.add(
    new URL("soundtrack-v7.wav", import.meta.url).pathname,
  );
  p.cut(soundtrack, { at: 0, dur: 30 });

  const key = (at, value, easing = "house") => ({ at, value, easing });
  const track = (property, keyframes) => ({ property, keyframes });
  const tween = (property, from, to, at, duration, easing = "house") => ({
    property,
    from,
    to,
    at,
    duration,
    easing,
  });
  const R = (x, y, width, height, fill, extra = {}) =>
    rect({ x, y, width, height, fill, ...extra });
  const F = (name, x, y, width, height, children, extra = {}) =>
    frame({ name, x, y, width, height, layout: "none", ...extra }, children);
  const T = (copy, x, y, size, width, color, extra = {}) =>
    text(copy, {
      x,
      y,
      width,
      height: size * 2.3,
      fontFamily: "Ubuntu",
      fontWeight: 700,
      fontSize: size,
      lineHeight: 1.06,
      color,
      ...extra,
    });
  const M = (copy, x, y, width, color, extra = {}) =>
    T(copy, x, y, extra.fontSize || 20, width, color, {
      fontFamily: "JetBrains Mono",
      fontWeight: 400,
      ...extra,
    });
  const I = (slug, x, y, size, extra = {}) =>
    media({
      file: icons[slug],
      x,
      y,
      width: size,
      height: size,
      fit: "contain",
      ...extra,
    });
  const show = (nodes, at, dur, name) => p.compose(nodes, { at, dur, name });
  const rise = (at = 0, amount = 65) => [
    tween("opacity", 0, 1, at, 0.4),
    tween("offsetY", amount, 0, at, 0.65),
  ];
  const trail = (x, y) => [
    R(x, y, 112, 8, C.coral),
    R(x + 128, y, 58, 8, C.muted),
    R(x + 203, y, 24, 8, C.border),
  ];

  // Quiet moving geometry replaces the old wall of terminal glyphs.
  const field = (dark, dur) => {
    const line = dark ? "#373633" : "#e4dfd5";
    return [
      ...Array.from({ length: 8 }, (_, i) =>
        R(137 + i * 255, 0, 2, 1080, line, { opacity: 0.37 }),
      ),
      ...Array.from({ length: 5 }, (_, i) =>
        R(0, 188 + i * 198, 1920, 2, line, { opacity: 0.32 }),
      ),
      R(-260, 188, 205, 5, C.coral, {
        opacity: 0.85,
        animate: [tween("offsetX", 0, 2230, 0, dur, "linear")],
      }),
      R(1681, -90, 9, 90, C.coral, {
        opacity: 0.65,
        animate: [tween("offsetY", 0, 1250, 0, dur, "linear")],
      }),
    ];
  };
  const chapterWipe = (at, fill) =>
    show(
      [
        ...Array.from({ length: 6 }, (_, i) =>
          R(-1940, i * 180, 1940, 183, i === 2 ? C.coral : fill, {
            animate: [
              track("offsetX", [
                key(0, 0),
                key(0.1 + i * 0.035, 0),
                key(0.42 + i * 0.035, 1940),
                key(0.7 + i * 0.035, 3900),
              ]),
            ],
          }),
        ),
      ],
      at,
      0.9,
      "Chapter color wipe",
    );

  show(
    [
      R(0, 0, 1920, 1080, C.ink),
      R(1450, 1028, 369, 3, "#46433d"),
      R(1450, 1028, 369, 3, C.coral, {
        animate: [tween("scaleX", 0, 1, 0, 30, "linear")],
      }),
    ],
    0,
    30,
    "Brand stage and progress",
  );

  show(
    [
      R(0, 0, 1920, 1080, C.paper),
      ...field(false, 4.3),
      R(1085, 92, 752, 876, C.warm, { radius: 26 }),
      F(
        "New portrait",
        1120,
        100,
        680,
        850,
        [
          R(0, 0, 680, 850, "#eae5dc", { radius: 22 }),
          media({
            file: portrait,
            x: 37,
            y: 0,
            width: 606,
            height: 840,
            fit: "contain",
            animate: [
              tween("offsetY", 180, 0, 0.08, 0.85),
              tween("scale", 0.96, 1.045, 0.08, 4.2),
            ],
          }),
          R(26, 755, 628, 68, C.coral, { radius: 12 }),
          M("PHNOM PENH  ·  CAMBODIA", 46, 777, 580, C.ink, {
            fontSize: 21,
          }),
        ],
        {
          clip: true,
          animate: [tween("offsetX", 280, 0, 0, 0.8)],
        },
      ),
      M("WHO I AM", 106, 108, 750, C.coral, { animate: rise(0.1, 32) }),
      F(
        "Name reveal",
        96,
        230,
        1000,
        320,
        [
          T("RITHY", 0, 0, 166, 980, C.ink, {
            motion: {
              by: "character",
              from: { y: 150, opacity: 0 },
              at: 0.1,
              duration: 0.52,
              overlap: 0.84,
              easing: "house",
            },
          }),
          T("BONDETH", 0, 156, 162, 980, C.coral, {
            motion: {
              by: "character",
              from: { y: 160, opacity: 0 },
              at: 0.28,
              duration: 0.55,
              overlap: 0.86,
              easing: "house",
            },
          }),
        ],
        { clip: true },
      ),
      T("Full Stack Developer", 107, 660, 47, 900, C.ink, {
        animate: rise(0.64),
      }),
      T("& AI Engineer", 107, 727, 47, 900, C.ink, {
        animate: rise(0.78),
      }),
      R(108, 838, 526, 3, C.coral, {
        animate: [tween("scaleX", 0, 1, 0.79, 0.9)],
      }),
      M("3+ YEARS BUILDING ACROSS THE STACK", 109, 874, 900, C.darkMuted, {
        fontSize: 18,
        animate: rise(0.96, 34),
      }),
      ...trail(105, 978),
    ],
    0,
    4.34,
    "Who I am",
  );

  show(
    [
      R(0, 0, 1920, 1080, C.ink),
      ...field(true, 4.7),
      T("I build useful", 98, 225, 138, 1040, C.paper, {
        animate: rise(0.22, 115),
      }),
      T("software.", 98, 382, 166, 1040, C.coral, {
        animate: rise(0.38, 115),
      }),
      T("From idea to a working product.", 105, 660, 40, 990, C.paper, {
        fontWeight: 400,
        animate: rise(0.7),
      }),
      M("DESIGN  /  BUILD  /  SHIP", 105, 748, 920, C.muted, {
        animate: rise(0.85, 45),
      }),
      ...["WEB PLATFORMS", "MOBILE APPS", "AI SYSTEMS"].map((label, i) =>
        F(
          "Capability " + label,
          1130,
          258 + i * 205,
          675,
          156,
          [
            R(0, 0, 675, 156, "#23221f", { radius: 14 }),
            R(0, 0, 9, 156, C.coral),
            M("0" + (i + 1), 31, 29, 100, C.coral, {
              fontSize: 24,
            }),
            T(label, 117, 43, 47, 535, C.paper),
          ],
          {
            animate: [
              tween("offsetX", 780, 0, 0.42 + i * 0.21, 0.72),
              tween("opacity", 0, 1, 0.42 + i * 0.21, 0.42),
            ],
          },
        ),
      ),
      ...trail(105, 977),
    ],
    4.2,
    4.72,
    "What I do",
  );
  chapterWipe(3.98, C.ink);
  chapterWipe(8.53, C.paper);

  show(
    [
      R(0, 0, 1920, 1080, C.paper),
      ...field(false, 4.58),
      T("The tools behind the work.", 96, 108, 109, 1700, C.ink, {
        animate: rise(0.14, 90),
      }),
      M(
        "FRONTEND  ·  BACKEND  ·  AI  ·  MOBILE  ·  DEPLOYMENT",
        105,
        254,
        1700,
        C.darkMuted,
        { fontSize: 21, animate: rise(0.29, 40) },
      ),
      ...trail(105, 979),
    ],
    8.76,
    4.58,
    "Technologies I use",
  );
  technologies.forEach(([slug, label], i) => {
    const x = 101 + (i % 6) * 286;
    const y = 344 + Math.floor(i / 6) * 194;
    show(
      F(
        "Technology " + label,
        x,
        y,
        260,
        170,
        [
          R(0, 0, 260, 170, "#f4f1eb", { radius: 16 }),
          R(0, 0, 260, 3, C.border),
          I(slug, 94, 18, 72),
          T(label, 12, 110, label.length > 10 ? 21 : 25, 236, C.ink, {
            align: "center",
          }),
        ],
        {
          animate: [
            track("opacity", [
              key(0, 0),
              key(0.15 + i * 0.04, 0),
              key(0.43 + i * 0.04, 1),
              key(4.1, 1),
              key(4.55, 0),
            ]),
            track("offsetY", [
              key(0, 90),
              key(0.52 + i * 0.04, 0),
              key(4.1, 0),
              key(4.55, -90),
            ]),
            track("scale", [
              key(0, 0.76),
              key(0.52 + i * 0.04, 1),
              key(4.1, 1),
              key(4.55, 0.84),
            ]),
          ],
        },
      ),
      8.76,
      4.58,
      "Technology badge",
    );
  });

  const projects = [
    {
      name: "Apsara Talent",
      line: "Hiring built around a better match.",
      shot: "talent",
      icon: "nextdotjs",
    },
    {
      name: "Apsara Assistant",
      line: "AI replies where customers already are.",
      shot: "assistant",
      icon: "python",
    },
    {
      name: "Apsara Agentic",
      line: "A coding agent guided by human review.",
      shot: "agentic",
      icon: "nestjs",
    },
    {
      name: "Apsara Elearning",
      line: "Learning in Khmer, grounded in each lesson.",
      shot: "elearning",
      icon: "react",
    },
    {
      name: "Apsara Wallet",
      line: "Everyday money, in one clear view.",
      shot: "wallet",
      icon: "flutter",
    },
    {
      name: "Romlerk",
      line: "An AI assistant for thoughts, tasks and notes.",
      shot: "romlerk",
      icon: "dart",
    },
    {
      name: "Bondex Notch",
      line: "Your Mac's notch, finally useful.",
      shot: "notch",
      icon: "swift",
    },
  ];
  projects.forEach((item, i) => {
    const at = 12.82 + i * 2.08;
    const words = item.name.toUpperCase().split(" ");
    const headline =
      words.length === 1
        ? words[0]
        : words[0] + "\n" + words.slice(1).join(" ");
    const first = i === 0;
    show(
      F(
        item.name + " preview scene",
        first ? 387 : 0,
        first ? 344 : 0,
        first ? 260 : 1920,
        first ? 170 : 1080,
        [
          R(0, 0, 1920, 1080, C.paper),
          ...field(false, 2.48),
          R(0, 0, 1920, 9, C.coral),
          ...(first
            ? [
                F(
                  "Next.js becomes project",
                  0,
                  0,
                  260,
                  170,
                  [
                    R(0, 0, 260, 170, C.warm, { radius: 16 }),
                    I(item.icon, 94, 28, 72),
                  ],
                  {
                    animate: [
                      track("opacity", [key(0, 1), key(0.32, 1), key(0.58, 0)]),
                    ],
                  },
                ),
              ]
            : []),
          F(
            item.name + " content",
            0,
            0,
            1920,
            1080,
            [
              R(96, 182, 82, 8, C.coral),
              M("SELECTED WORK", 96, 205, 540, C.darkMuted, {
                fontSize: 18,
              }),
              T(
                headline,
                92,
                292,
                item.name === "Apsara Assistant" ||
                  item.name === "Apsara Elearning"
                  ? 72
                  : item.name === "Romlerk"
                    ? 102
                    : 91,
                585,
                C.ink,
              ),
              T(item.line, 98, 570, 31, 520, C.darkMuted, {
                fontWeight: 400,
                lineHeight: 1.2,
              }),
              M(
                String(i + 1).padStart(2, "0") + " / 07",
                98,
                930,
                450,
                C.coral,
                { fontSize: 19 },
              ),
              F(
                item.name + " full-bleed preview",
                675,
                163,
                1150,
                715,
                [
                  R(0, 0, 1150, 715, C.warm, { radius: 17 }),
                  R(0, 0, 1150, 53, C.border, { radius: 17 }),
                  ...[C.coral, "#c9b48f", "#a6a398"].map((fill, dot) =>
                    R(23 + dot * 29, 18, 13, 13, fill, { radius: 7 }),
                  ),
                  M(
                    "bondeth.dev  /  selected work",
                    160,
                    15,
                    760,
                    C.darkMuted,
                    {
                      fontSize: 16,
                    },
                  ),
                  media({
                    file: shots[item.shot],
                    x: 0,
                    y: 53,
                    width: 1150,
                    height: 662,
                    fit: "cover",
                    animate: [tween("scale", 1.025, 1, 0, 2.47, "linear")],
                  }),
                ],
                {
                  clip: true,
                  animate: [
                    tween("offsetX", 210, 0, 0.05, 0.62),
                    tween("scale", 0.94, 1, 0.05, 0.75),
                  ],
                },
              ),
            ],
            {
              animate: [
                track("opacity", [
                  key(0, 0),
                  key(first ? 0.39 : 0.08, 0),
                  key(first ? 0.65 : 0.46, 1),
                ]),
              ],
            },
          ),
          R(-110, 0, 10, 1080, C.coral, {
            opacity: 0.8,
            animate: [
              tween("offsetX", 0, 2030, 0, 0.62, "ease-out"),
              tween("opacity", 1, 0, 0.35, 0.27),
            ],
          }),
        ],
        first
          ? {
              clip: true,
              animate: [
                track("width", [key(0, 260), key(0.08, 260), key(0.76, 1920)]),
                track("height", [key(0, 170), key(0.08, 170), key(0.76, 1080)]),
                track("offsetX", [key(0, 0), key(0.08, 0), key(0.76, -387)]),
                track("offsetY", [key(0, 0), key(0.08, 0), key(0.76, -344)]),
              ],
            }
          : {
              clip: true,
              animate: [
                tween("opacity", 0, 1, 0, 0.46),
                tween("offsetX", 82, 0, 0, 0.56),
              ],
            },
      ),
      at,
      2.48,
      item.name + " project transition",
    );
  });

  show(
    [
      R(0, 0, 1920, 1080, C.ink, {
        animate: [tween("opacity", 0, 1, 0, 0.36)],
      }),
      ...field(true, 2.6),
      ...trail(105, 153),
      M(
        "RITHY BONDETH  /  FULL STACK DEVELOPER & AI ENGINEER",
        106,
        250,
        1590,
        C.muted,
        { fontSize: 20, animate: rise(0.16, 40) },
      ),
      T("Explore the work.", 93, 379, 143, 1710, C.paper, {
        animate: rise(0.23, 115),
      }),
      F(
        "Website invitation",
        103,
        652,
        680,
        132,
        [
          R(0, 0, 680, 132, C.coral, { radius: 66 }),
          T("bondeth.dev", 48, 30, 66, 560, C.ink),
        ],
        { animate: rise(0.55, 80) },
      ),
      M("WHO I AM  →  WHAT I DO  →  TOOLS  →  PROOF", 108, 913, 1680, C.muted, {
        fontSize: 21,
        animate: rise(0.74, 35),
      }),
    ],
    27.4,
    2.6,
    "Invitation",
  );

  await p.frame(2.2, "renders/portfolio-showreel-v7-poster.png");
};

export default composition;
