/** Five-project, four-chapter portfolio film. Native 1920x1080 / 120fps / 30s. */
const composition = async ({ project, frame, text, rect, media, path }) => {
  const p = await project({
    size: "1920x1080",
    fps: 120,
    background: "#141413",
  });
  const C = {
    ink: "#141413",
    paper: "#faf9f5",
    coral: "#d97757",
    card: "#1f1f1e",
    warm: "#f0eee6",
    border: "#e3dacc",
    darkBorder: "#52514e",
    muted: "#b0aea5",
    darkMuted: "#7a786f",
  };
  const file = (name) => new URL(`assets/${name}`, import.meta.url).pathname;
  const portrait = await p.add(file("portrait.webp"));
  const shots = {};
  for (const name of [
    "talent",
    "assistant",
    "agentic",
    "elearning",
    "wallet",
    "notch",
  ])
    shots[name] = await p.add(file(`${name}.png`));
  const iconNames = [
    "react",
    "nextdotjs",
    "typescript",
    "nestjs",
    "postgresql",
    "python",
    "fastapi",
    "flutter",
    "swift",
    "docker",
  ];
  const icons = {};
  for (const slug of iconNames) icons[slug] = await p.add(file(`${slug}.png`));
  const soundtrack = await p.add(
    new URL("soundtrack-v6.wav", import.meta.url).pathname,
  );
  p.cut(soundtrack, { at: 0, dur: 30 });

  const k = (at, value, easing = "house") => ({ at, value, easing });
  const a = (property, keyframes) => ({ property, keyframes });
  const t = (property, from, to, at, duration, easing = "house") => ({
    property,
    from,
    to,
    at,
    duration,
    easing,
  });
  const merge = (extra) => {
    if (!extra.animate) return extra;
    const map = new Map();
    for (const item of extra.animate) {
      const keys = item.keyframes ?? [
        k(item.at ?? 0, item.from, item.easing),
        k((item.at ?? 0) + (item.duration ?? 0.6), item.to),
      ];
      const previous = map.get(item.property) ?? [];
      previous.push(
        ...keys.filter((key) => previous.length === 0 || key.at !== 0),
      );
      map.set(item.property, previous);
    }
    return {
      ...extra,
      animate: [...map].map(([property, keys]) =>
        a(
          property,
          [...new Map(keys.map((key) => [key.at, key])).values()].sort(
            (x, y) => x.at - y.at,
          ),
        ),
      ),
    };
  };
  const R = (x, y, width, height, fill, extra = {}) =>
    rect({ x, y, width, height, fill, ...merge(extra) });
  const F = (name, x, y, width, height, children, extra = {}) =>
    frame(
      {
        name,
        x,
        y,
        width,
        height,
        layout: "none",
        ...merge(extra),
      },
      children,
    );
  const T = (copy, x, y, size, width = 1700, color = C.paper, extra = {}) =>
    text(copy, {
      x,
      y,
      width,
      height: size * 2.5,
      fontFamily: "Ubuntu",
      fontSize: size,
      fontWeight: 700,
      lineHeight: 1.06,
      color,
      ...merge(extra),
    });
  const M = (copy, x, y, width = 1700, color = C.muted, extra = {}) =>
    T(copy, x, y, 20, width, color, {
      fontFamily: "JetBrains Mono",
      fontWeight: 400,
      lineHeight: 1.1,
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
      ...merge(extra),
    });
  const L = (x1, y1, x2, y2, color, width = 2, extra = {}) =>
    path({
      d: `M ${x1} ${y1} L ${x2} ${y2}`,
      width: 1920,
      height: 1080,
      stroke: { color, width },
      ...extra,
    });
  const show = (nodes, at, dur, name) => p.compose(nodes, { at, dur, name });
  const rise = (at = 0, y = 75) => [
    t("opacity", 0, 1, at, 0.38),
    t("offsetY", y, 0, at, 0.72),
  ];
  const trail = (x, y, scale = 1) => [
    R(x, y, 112 * scale, 8 * scale, C.coral),
    R(x + 125 * scale, y, 58 * scale, 8 * scale, C.darkMuted),
    R(x + 196 * scale, y, 29 * scale, 8 * scale, C.border),
    R(x + 238 * scale, y, 10 * scale, 8 * scale, C.coral),
  ];
  // A low-contrast moving terminal texture; every glyph remains editable type.
  const glyphs = [
    "010  <>  //  {}  +++  ....  #  ==  >>  ::  [ ]  01  /_\\  ",
    "{ build }  ///  [ ship ]  1010  .:.  < >  ::  +  / /  0x ",
    "//  001101  +--+  < code />  = =  ***  {}  ////  [ ]  ",
  ];
  const asciiField = (color, dur, opacity = 0.13) =>
    Array.from({ length: 9 }, (_, i) =>
      M(glyphs[i % glyphs.length].repeat(4), -170, 142 + i * 105, 2240, color, {
        fontSize: 17,
        opacity: opacity * (i % 3 === 0 ? 1 : 0.7),
        animate: [
          t("offsetX", i % 2 ? -95 : 65, i % 2 ? 55 : -85, 0, dur, "linear"),
        ],
      }),
    );
  const asciiSweep = (at, light = false) => {
    const bands = Array.from({ length: 12 }, (_, i) =>
      R(
        -1950,
        i * 90,
        1950,
        91,
        i % 4 === 0 ? C.coral : light ? C.paper : C.ink,
        {
          animate: [
            a("offsetX", [
              k(0, 0, "linear"),
              k(0.11 + i * 0.011, 0, "linear"),
              k(0.31 + i * 0.011, 1950, "linear"),
              k(0.6 + i * 0.011, 3900, "linear"),
            ]),
          ],
        },
      ),
    );
    show(
      [
        ...bands,
        M(
          "< / >  010101  { }  BUILD  + + +  //  SHIP  [ ]  101010",
          -1750,
          497,
          2400,
          C.coral,
          { fontSize: 48, animate: [t("offsetX", 0, 3650, 0, 0.77, "linear")] },
        ),
      ],
      at,
      0.78,
      "ASCII signal-shutter transition",
    );
  };

  // Site tokens and pixel trail persist below the four chapters.
  show(
    [
      R(0, 0, 1920, 1080, C.ink),
      M("BONDETH  /  01—04", 102, 1016, 750, C.muted, { fontSize: 16 }),
      R(1450, 1027, 370, 3, C.darkBorder),
      R(1450, 1027, 370, 3, C.coral, {
        animate: [t("scaleX", 0, 1, 0, 30, "linear")],
      }),
    ],
    0,
    30,
    "Brand stage and progress",
  );

  // 01 / WHO I AM: the real homepage image, name, roles, and location.
  show(
    [
      R(0, 0, 1920, 1080, C.paper),
      ...asciiField(C.coral, 4.31, 0.1),
      R(1068, 84, 784, 930, C.warm, {
        radius: 28,
        animate: [t("offsetX", 340, 0, 0.05, 0.82)],
      }),
      F(
        "Hero portrait frame",
        1120,
        110,
        680,
        838,
        [
          R(0, 0, 680, 838, C.ink, { radius: 24 }),
          T("BONDETH", 20, 68, 105, 645, "#48413c", {
            opacity: 0.55,
            animate: [t("offsetX", 80, -60, 0, 4.25, "linear")],
          }),
          T("FULL STACK", 20, 290, 77, 645, C.darkBorder, {
            animate: [t("offsetX", -40, 40, 0, 4.25, "linear")],
          }),
          media({
            file: portrait,
            x: 0,
            y: 10,
            width: 680,
            height: 824,
            fit: "contain",
            animate: [
              t("offsetY", 170, 0, 0.1, 0.91),
              t("scale", 0.95, 1.04, 0.1, 4.2),
            ],
          }),
          R(32, 758, 616, 58, C.coral, { radius: 12 }),
          M("PHNOM PENH  ·  CAMBODIA", 54, 776, 560, C.ink, { fontSize: 21 }),
        ],
        { clip: true },
      ),
      M("01  /  WHO I AM", 106, 101, 820, C.coral, { animate: rise(0.08, 32) }),
      F(
        "Name reveal",
        96,
        244,
        1000,
        300,
        [
          T("RITHY", 0, 0, 167, 980, C.ink, {
            motion: {
              by: "character",
              from: { y: 150, opacity: 0 },
              at: 0.1,
              duration: 0.52,
              overlap: 0.84,
              easing: "house",
            },
          }),
          T("BONDETH", 0, 154, 163, 980, C.coral, {
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
      T("Full Stack Developer", 108, 666, 48, 900, C.ink, {
        animate: rise(0.64, 62),
      }),
      T("& AI Engineer", 108, 734, 48, 900, C.ink, { animate: rise(0.77, 62) }),
      R(108, 841, 524, 3, C.coral, {
        animate: [t("scaleX", 0, 1, 0.78, 0.93)],
      }),
      M("3+ YEARS BUILDING ACROSS THE STACK", 109, 875, 900, C.darkMuted, {
        fontSize: 18,
        animate: rise(0.96, 34),
      }),
      ...trail(105, 978, 0.72),
    ],
    0,
    4.32,
    "01 / Who I am",
  );

  // 02 / WHAT I DO: capability, separated from logos and case studies.
  show(
    [
      R(0, 0, 1920, 1080, C.ink),
      ...asciiField(C.coral, 4.6, 0.1),
      ...Array.from({ length: 6 }, (_, i) =>
        L(0, 180 + i * 160, 1920, 180 + i * 160, "#282725", 1),
      ),
      T("I build useful", 98, 226, 140, 1080, C.paper, {
        animate: rise(0.24, 125),
      }),
      T("software.", 98, 380, 164, 1110, C.coral, { animate: rise(0.4, 135) }),
      T("From idea to a working product.", 105, 663, 40, 1040, C.paper, {
        fontWeight: 400,
        animate: rise(0.76, 70),
      }),
      M("DESIGN  /  BUILD  /  SHIP", 105, 749, 920, C.muted, {
        fontSize: 20,
        animate: rise(0.86, 50),
      }),
      ...["WEB PLATFORMS", "MOBILE APPS", "AI SYSTEMS"].map((label, i) =>
        F(
          `Capability ${label}`,
          1140,
          262 + i * 205,
          665,
          155,
          [
            R(0, 0, 665, 155, C.card, { radius: 14 }),
            R(0, 0, 9, 155, C.coral),
            M(`0${i + 1}`, 34, 27, 100, C.coral, { fontSize: 25 }),
            T(label, 118, 43, 47, 525, C.paper),
            R(123, 121, 440, 2, C.darkBorder),
          ],
          {
            animate: [
              t("offsetX", 900, 0, 0.42 + i * 0.22, 0.76),
              t("opacity", 0, 1, 0.42 + i * 0.22, 0.44),
            ],
          },
        ),
      ),
      ...trail(104, 976, 0.72),
    ],
    4.28,
    4.64,
    "02 / What I do",
  );
  asciiSweep(4.08);
  asciiSweep(8.57, true);

  // 03 / TECHNOLOGIES: original-color marks, grouped like the site's badges.
  const tech = [
    ["react", "React", 152, 375],
    ["nextdotjs", "Next.js", 490, 375],
    ["typescript", "TypeScript", 828, 375],
    ["nestjs", "NestJS", 1166, 375],
    ["postgresql", "PostgreSQL", 1504, 375],
    ["python", "Python", 152, 660],
    ["fastapi", "FastAPI", 490, 660],
    ["flutter", "Flutter", 828, 660],
    ["swift", "Swift", 1166, 660],
    ["docker", "Docker", 1504, 660],
  ];
  show(
    [
      R(0, 0, 1920, 1080, C.paper),
      ...asciiField(C.ink, 4.87, 0.075),
      T("A focused toolkit.", 96, 127, 119, 1690, C.ink, {
        animate: rise(0.16, 100),
      }),
      M(
        "FRONTEND  ·  BACKEND  ·  AI  ·  MOBILE  ·  DEPLOYMENT",
        105,
        278,
        1670,
        C.darkMuted,
        { fontSize: 21, animate: rise(0.34, 45) },
      ),
      R(105, 944, 1710, 2, C.border),
      ...trail(105, 980, 0.72),
    ],
    8.78,
    4.87,
    "03 / Technologies I use",
  );
  for (let i = 0; i < tech.length; i++) {
    const [slug, label, x, y] = tech[i];
    show(
      F(
        `Technology ${label}`,
        x,
        y,
        270,
        220,
        [
          R(0, 0, 270, 220, "#f6f6f4", { radius: 16 }),
          R(0, 0, 270, 220, C.border, { radius: 16, opacity: 0.13 }),
          R(4, 4, 262, 212, "#f6f6f4", { radius: 13 }),
          I(slug, 84, 30, 102),
          T(label, 16, 151, 28, 238, C.ink, { align: "center" }),
        ],
        {
          animate: [
            a("opacity", [
              k(0, 0),
              k(0.12 + i * 0.06, 0),
              k(0.45 + i * 0.06, 1),
              k(4.54, 1),
              k(4.82, 0),
            ]),
            a("scale", [
              k(0, 0.48),
              k(0.55 + i * 0.06, 1),
              k(4.54, 1),
              k(4.82, 0.74),
            ]),
            a("offsetY", [
              k(0, 200 + i * 17),
              k(0.55 + i * 0.06, 0),
              k(4.54, 0),
              k(4.82, i < 5 ? 205 : -205),
            ]),
            a("rotation", [
              k(0, i % 2 ? 11 : -11),
              k(0.55 + i * 0.06, 0),
              k(4.54, 0),
              k(4.82, i % 2 ? -10 : 10),
            ]),
          ],
        },
      ),
      8.78,
      4.87,
      "Technology badge arrives and gathers",
    );
  }

  // 04 / PROOF: six real projects; screenshot viewport crops to fill edge to edge.
  const caseStudy = ({
    name,
    at,
    dur,
    origin,
    slug,
    surface,
    foreground,
    accent,
    index,
    title,
    line,
    metric,
    note,
    image,
    next,
  }) =>
    show(
      F(
        name,
        origin[0],
        origin[1],
        270,
        220,
        [
          R(0, 0, 1920, 1080, surface),
          ...asciiField(accent, dur, foreground === C.ink ? 0.05 : 0.07),
          R(0, 0, 1920, 10, accent),
          F(
            `${name} originating technology`,
            0,
            0,
            270,
            220,
            [R(0, 0, 270, 220, C.warm, { radius: 16 }), I(slug, 84, 48, 102)],
            {
              animate: [
                a("opacity", [k(0, 1), k(0.35, 1), k(0.64, 0)]),
                a("scale", [k(0, 1), k(0.62, 1.52)]),
              ],
            },
          ),
          F(
            `${name} case study`,
            0,
            0,
            1920,
            1080,
            [
              R(75, 188, 560, 414, surface, { opacity: 0.94 }),
              R(94, 165, 86, 8, accent),
              T(title.split(" ")[0], 91, 213, 86, 590, foreground),
              T(
                title.split(" ").slice(1).join(" "),
                91,
                318,
                title.endsWith("ASSISTANT") || title.endsWith("ELEARNING")
                  ? 68
                  : 90,
                590,
                accent,
              ),
              T(line, 98, 456, 31, 550, foreground, {
                fontWeight: 400,
                lineHeight: 1.17,
              }),
              R(96, 617, 535, 201, foreground === C.ink ? C.warm : C.card, {
                radius: 14,
              }),
              T(metric, 120, 648, metric.length > 13 ? 42 : 65, 490, accent),
              M(
                note,
                120,
                746,
                475,
                foreground === C.ink ? C.darkMuted : C.muted,
                { fontSize: 17 },
              ),
              F(
                `${name} browser image`,
                675,
                164,
                1155,
                704,
                [
                  R(0, 0, 1155, 704, C.warm, { radius: 17 }),
                  R(0, 0, 1155, 54, C.border, { radius: 17 }),
                  ...[C.coral, "#c9b48f", "#a6a398"].map((fill, i) =>
                    R(22 + i * 29, 18, 13, 13, fill, { radius: 7 }),
                  ),
                  M(
                    "bondeth.dev  /  selected work",
                    160,
                    15,
                    700,
                    C.darkMuted,
                    { fontSize: 16 },
                  ),
                  media({
                    file: image,
                    x: 0,
                    y: 54,
                    width: 1155,
                    height: 650,
                    fit: "cover",
                    animate: [t("scale", 1.04, 1, 0, dur, "linear")],
                  }),
                ],
                {
                  clip: true,
                  animate: [
                    t("offsetX", 320, 0, 0.08, 0.57),
                    t("scale", 0.83, 1, 0.08, 0.6),
                    t("rotation", 5, 0, 0.08, 0.6),
                  ],
                },
              ),
              M(
                `${index} / 06    ·    CASE STUDY`,
                99,
                954,
                1130,
                foreground === C.ink ? C.darkMuted : C.muted,
                { fontSize: 17 },
              ),
              ...(next
                ? [
                    F(
                      `${name} next technology`,
                      1706,
                      90,
                      170,
                      170,
                      [
                        R(0, 0, 170, 170, C.warm, { radius: 14 }),
                        I(next, 39, 38, 92),
                      ],
                      {
                        animate: [
                          a("opacity", [k(0, 0), k(1.73, 0), k(2.1, 1)]),
                        ],
                      },
                    ),
                  ]
                : []),
            ],
            { animate: [a("opacity", [k(0, 0), k(0.39, 0), k(0.68, 1)])] },
          ),
        ],
        {
          clip: true,
          animate: [
            a("width", [k(0, 270), k(0.11, 270), k(0.82, 1920)]),
            a("height", [k(0, 220), k(0.11, 220), k(0.82, 1080)]),
            a("offsetX", [k(0, 0), k(0.11, 0), k(0.82, -origin[0])]),
            a("offsetY", [k(0, 0), k(0.11, 0), k(0.82, -origin[1])]),
          ],
        },
      ),
      at,
      dur,
      name,
    );
  const caseSignal = (at) =>
    show(
      [
        ...[0, 1, 2, 3].map((_, i) =>
          R(
            -780 - i * 310,
            -170,
            290,
            1420,
            i === 1 ? C.coral : i === 3 ? C.paper : C.ink,
            {
              rotation: 18,
              animate: [t("offsetX", 0, 3450, 0, 0.48, "linear")],
            },
          ),
        ),
        M(
          "/ / /  010101  < >  +++  [ ]  //  { }  110010",
          -1200,
          510,
          2400,
          C.coral,
          { fontSize: 36, animate: [t("offsetX", 0, 3550, 0, 0.5, "linear")] },
        ),
      ],
      at,
      0.52,
      "Project signal slash transition",
    );
  caseStudy({
    name: "Apsara Talent proof",
    at: 12.82,
    dur: 3.2,
    origin: [490, 375],
    slug: "nextdotjs",
    surface: C.paper,
    foreground: C.ink,
    accent: C.coral,
    index: "01",
    title: "APSARA TALENT",
    line: "Recruitment matched by meaning.",
    metric: "7 SERVICES",
    note: "Semantic search + hiring pipeline",
    image: shots.talent,
    next: "python",
  });
  caseStudy({
    name: "Apsara Assistant proof",
    at: 15.22,
    dur: 3.2,
    origin: [1706, 90],
    slug: "python",
    surface: C.ink,
    foreground: C.paper,
    accent: C.coral,
    index: "02",
    title: "APSARA ASSISTANT",
    line: "AI sales replies in customers' language.",
    metric: "3 LANGUAGES",
    note: "Messenger + Telegram",
    image: shots.assistant,
    next: "nextdotjs",
  });
  caseStudy({
    name: "Apsara Agentic proof",
    at: 17.62,
    dur: 3.2,
    origin: [1706, 90],
    slug: "nextdotjs",
    surface: C.paper,
    foreground: C.ink,
    accent: C.coral,
    index: "03",
    title: "APSARA AGENTIC",
    line: "A coding agent with human review.",
    metric: "424 TESTS",
    note: "Local workspace · private alpha",
    image: shots.agentic,
    next: "nestjs",
  });
  caseStudy({
    name: "Apsara Elearning proof",
    at: 20.02,
    dur: 3.2,
    origin: [1706, 90],
    slug: "nestjs",
    surface: C.ink,
    foreground: C.paper,
    accent: C.coral,
    index: "04",
    title: "APSARA ELEARNING",
    line: "A Khmer-first tutor tied to each lesson.",
    metric: "GRADES 1–12",
    note: "Plus university · AI mentor",
    image: shots.elearning,
    next: "flutter",
  });
  caseStudy({
    name: "Apsara Wallet proof",
    at: 22.42,
    dur: 3.2,
    origin: [1706, 90],
    slug: "flutter",
    surface: C.paper,
    foreground: C.ink,
    accent: C.coral,
    index: "05",
    title: "APSARA WALLET",
    line: "One ledger for riel and dollars.",
    metric: "KHR + USD",
    note: "On-device receipt scanning",
    image: shots.wallet,
    next: "swift",
  });
  caseStudy({
    name: "Bondex Notch proof",
    at: 24.82,
    dur: 2.58,
    origin: [1706, 90],
    slug: "swift",
    surface: C.paper,
    foreground: C.ink,
    accent: C.coral,
    index: "06",
    title: "BONDEX NOTCH",
    line: "A lighter always-on Mac utility.",
    metric: "12–14% → 3%",
    note: "Measured CPU while music plays",
    image: shots.notch,
  });
  for (const at of [15.2, 17.6, 20.0, 22.4, 24.8]) caseSignal(at);

  // A restrained final card repeats the site's pixel trail and invitation.
  show(
    [
      R(0, 0, 1920, 1080, C.ink, { animate: [t("opacity", 0, 1, 0, 0.34)] }),
      ...asciiField(C.coral, 2.69, 0.12),
      ...trail(105, 150, 1.3),
      M(
        "RITHY BONDETH  /  FULL STACK DEVELOPER & AI ENGINEER",
        106,
        248,
        1590,
        C.muted,
        { fontSize: 20, animate: rise(0.17, 40) },
      ),
      T("Explore the work.", 93, 379, 143, 1710, C.paper, {
        animate: rise(0.24, 120),
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
      M("WHO I AM  →  WHAT I DO  →  TOOLS  →  PROOF", 108, 910, 1680, C.muted, {
        fontSize: 21,
        animate: rise(0.76, 35),
      }),
    ],
    27.31,
    2.69,
    "05 / Invitation",
  );

  await p.frame(2.2, "renders/portfolio-showreel-v6-poster.png");
};

export default composition;
