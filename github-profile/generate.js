// Generates an animated GitHub profile banner SVG for Rithy Bondeth.
const fs = require("fs");

// Embedded Ubuntu / Ubuntu Mono @font-face rules (base64 woff2, latin subset)
const fontCss = fs.readFileSync(__dirname + "/fonts.css", "utf8");
const SANS = "'Ubuntu',Helvetica,Arial,sans-serif";
const MONO = "'Ubuntu Mono',ui-monospace,monospace";

const W = 900, H = 320;

// ---- Typewriter phrases (Ubuntu Mono advance = 0.5em => 13.5px/char at 27px) ----
const phrases = ["Full Stack Developer", "AI Engineer", "Next.js Craftsman"];
const CH = 13.5;
const X0 = 60;                          // left text origin
const widths = phrases.map((p) => Math.round(p.length * CH));

// caret x + clip width keyTimes across a 12s cycle (3 x 4s slices)
const slice = 1 / 3;
function seg(i) {
  const s = i * slice;
  return {
    typeIn: s + slice * 0.35,
    hold: s + slice * 0.85,
    out: s + slice,
  };
}

// ---- Tech pills (name + brand dot color) ----
const tech = [
  ["TypeScript", "#3178C6"], ["React", "#61DAFB"], ["Next.js", "#FFFFFF"],
  ["Vue.js", "#4FC08D"], ["Python", "#3776AB"], ["NestJS", "#E0234E"],
  ["FastAPI", "#009688"], ["GraphQL", "#E10098"], ["PostgreSQL", "#4169E1"],
  ["Redis", "#FF4438"], ["OpenAI", "#FFFFFF"], ["Anthropic", "#D97757"],
  ["LangChain", "#10B981"], ["Flutter", "#54C5F8"], ["Docker", "#2496ED"],
  ["Kubernetes", "#326CE5"], ["GCP", "#4285F4"], ["Tailwind", "#06B6D4"],
];

const PILL_H = 30, GAP = 14, PAD = 16, DOT = 6, FS = 14;
// approx text width for pill sizing
const tw = (s) => Math.round(s.length * 8.1);
let cursor = 0;
const pills = tech.map(([name, color]) => {
  const w = PAD + DOT + 8 + tw(name) + PAD;
  const p = { name, color, x: cursor, w };
  cursor += w + GAP;
  return p;
});
const TRACK = cursor; // total width of one copy

function pillSVG(p, ty) {
  return `
    <g transform="translate(${p.x.toFixed(1)},${ty})">
      <rect width="${p.w}" height="${PILL_H}" rx="15" fill="#141414" stroke="#262626"/>
      <circle cx="${PAD + DOT / 2}" cy="${PILL_H / 2}" r="${DOT / 2}" fill="${p.color}"/>
      <text x="${PAD + DOT + 8}" y="${PILL_H / 2 + FS * 0.35}" font-family="${MONO}" font-size="${FS}" fill="#c9c9c9">${p.name}</text>
    </g>`;
}

const trackInner = pills.map((p) => pillSVG(p, 0)).join("");

// ---- Typewriter role element ----
const roleY = 182;
const roleFS = 27;
function phraseGroup(i) {
  const p = phrases[i];
  const wpx = widths[i];
  const g = seg(i);
  const kt = `0;${(i * slice).toFixed(3)};${g.typeIn.toFixed(3)};${g.hold.toFixed(3)};${g.out.toFixed(3)};1`;
  const clipVals = `0;0;${wpx};${wpx};0;0`;
  const opVals = `0;0;1;1;0;0`;
  return `
    <clipPath id="rc${i}"><rect id="rcr${i}" x="${X0}" y="${roleY - roleFS}" width="0" height="${roleFS + 10}">
      <animate attributeName="width" values="${clipVals}" keyTimes="${kt}" dur="12s" repeatCount="indefinite"/>
    </rect></clipPath>
    <g clip-path="url(#rc${i})">
      <text x="${X0}" y="${roleY}" font-family="${MONO}" font-size="${roleFS}" font-weight="400" fill="url(#roleGrad)">${p}
        <animate attributeName="opacity" values="${opVals}" keyTimes="${kt}" dur="12s" repeatCount="indefinite"/>
      </text>
    </g>`;
}
const roleGroups = phrases.map((_, i) => phraseGroup(i)).join("");

// caret follows the end of the active phrase
const caretKT = [];
const caretX = [];
for (let i = 0; i < 3; i++) {
  const g = seg(i);
  caretKT.push((i * slice).toFixed(3), g.typeIn.toFixed(3), g.hold.toFixed(3));
  caretX.push(X0, X0 + widths[i], X0 + widths[i]);
}
caretKT.push("1"); caretX.push(X0);
const caretKTs = "0;" + caretKT.join(";");
const caretXs = X0 + ";" + caretX.join(";");

const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}" fill="none" role="img" aria-label="Rithy Bondeth — Full Stack Developer and AI Engineer">
  <defs>
    <style>${fontCss}</style>
    <linearGradient id="nameGrad" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="#ffffff"/>
      <stop offset="1" stop-color="#8a8a8a"/>
    </linearGradient>
    <linearGradient id="roleGrad" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0" stop-color="#e8e8e8"/>
      <stop offset="1" stop-color="#9a9a9a"/>
    </linearGradient>
    <linearGradient id="sheen" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0" stop-color="#ffffff" stop-opacity="0"/>
      <stop offset="0.5" stop-color="#ffffff" stop-opacity="0.9"/>
      <stop offset="1" stop-color="#ffffff" stop-opacity="0"/>
    </linearGradient>
    <radialGradient id="au1" cx="0.5" cy="0.5" r="0.5">
      <stop offset="0" stop-color="#2dd4bf" stop-opacity="0.55"/>
      <stop offset="1" stop-color="#2dd4bf" stop-opacity="0"/>
    </radialGradient>
    <radialGradient id="au2" cx="0.5" cy="0.5" r="0.5">
      <stop offset="0" stop-color="#6366f1" stop-opacity="0.5"/>
      <stop offset="1" stop-color="#6366f1" stop-opacity="0"/>
    </radialGradient>
    <radialGradient id="au3" cx="0.5" cy="0.5" r="0.5">
      <stop offset="0" stop-color="#e879f9" stop-opacity="0.4"/>
      <stop offset="1" stop-color="#e879f9" stop-opacity="0"/>
    </radialGradient>
    <pattern id="dots" width="22" height="22" patternUnits="userSpaceOnUse">
      <circle cx="1" cy="1" r="1" fill="#ffffff" fill-opacity="0.05"/>
    </pattern>
    <clipPath id="card"><rect x="1" y="1" width="${W - 2}" height="${H - 2}" rx="20"/></clipPath>
    <clipPath id="nameClip"><text x="${X0}" y="120" font-family="${SANS}" font-size="52" font-weight="700">Rithy Bondeth</text></clipPath>
    <clipPath id="marqueeClip"><rect x="30" y="248" width="${W - 60}" height="40" rx="8"/></clipPath>
  </defs>

  <!-- card -->
  <rect x="1" y="1" width="${W - 2}" height="${H - 2}" rx="20" fill="#0A0A0A" stroke="#1c1c1c" stroke-width="1.5"/>

  <g clip-path="url(#card)">
    <!-- aurora -->
    <g filter="blur(48px)" opacity="0.9">
      <circle r="150" fill="url(#au1)" cx="180" cy="120">
        <animate attributeName="cx" values="150;340;180;150" dur="16s" repeatCount="indefinite"/>
        <animate attributeName="cy" values="90;180;60;90" dur="16s" repeatCount="indefinite"/>
      </circle>
      <circle r="170" fill="url(#au2)" cx="640" cy="80">
        <animate attributeName="cx" values="700;520;760;700" dur="19s" repeatCount="indefinite"/>
        <animate attributeName="cy" values="60;200;120;60" dur="19s" repeatCount="indefinite"/>
      </circle>
      <circle r="150" fill="url(#au3)" cx="820" cy="260">
        <animate attributeName="cx" values="820;660;860;820" dur="21s" repeatCount="indefinite"/>
        <animate attributeName="cy" values="240;300;220;240" dur="21s" repeatCount="indefinite"/>
      </circle>
    </g>
    <rect x="0" y="0" width="${W}" height="${H}" fill="url(#dots)"/>

    <!-- window chrome -->
    <g transform="translate(28,28)">
      <circle cx="0" cy="0" r="6" fill="#ff5f57"/>
      <circle cx="20" cy="0" r="6" fill="#febc2e"/>
      <circle cx="40" cy="0" r="6" fill="#28c840"/>
      <text x="66" y="4.5" font-family="${MONO}" font-size="12" fill="#5a5a5a">~/rithy-bondeth — zsh</text>
    </g>

    <!-- prompt line -->
    <text x="${X0}" y="72" font-family="${MONO}" font-size="15" fill="#6b6b6b">
      <tspan fill="#2dd4bf">➜</tspan> <tspan fill="#9a9a9a">~</tspan> <tspan fill="#6b6b6b">whoami</tspan>
    </text>

    <!-- name -->
    <text x="${X0}" y="120" font-family="${SANS}" font-size="52" font-weight="700" fill="url(#nameGrad)">Rithy Bondeth</text>
    <g clip-path="url(#nameClip)">
      <rect x="-260" y="70" width="220" height="70" fill="url(#sheen)" transform="skewX(-18)">
        <animate attributeName="x" values="-260;900" dur="4.5s" repeatCount="indefinite"/>
      </rect>
    </g>

    <!-- role typewriter -->
    ${roleGroups}
    <rect id="caret" y="${roleY - roleFS + 4}" width="3" height="${roleFS}" fill="#2dd4bf">
      <animate attributeName="x" values="${caretXs}" keyTimes="${caretKTs}" dur="12s" repeatCount="indefinite"/>
      <animate attributeName="opacity" values="1;1;0;0" keyTimes="0;0.5;0.5;1" dur="1s" repeatCount="indefinite"/>
    </rect>

    <!-- location + tagline -->
    <text x="${X0}" y="222" font-family="${SANS}" font-size="14" fill="#7d7d7d">
      <tspan fill="#e879f9">◈</tspan>  Phnom Penh, Cambodia  <tspan fill="#3a3a3a">•</tspan>  building things that just work, beautifully
    </text>

    <!-- tech marquee -->
    <g clip-path="url(#marqueeClip)">
      <g transform="translate(30,253)">
        <g>
          <animateTransform attributeName="transform" type="translate" from="0,0" to="${-(TRACK + GAP)},0" dur="26s" repeatCount="indefinite"/>
          <g>${trackInner}</g>
          <g transform="translate(${TRACK + GAP},0)">${trackInner}</g>
        </g>
      </g>
      <rect x="30" y="248" width="60" height="40" fill="url(#fadeL)"/>
      <rect x="${W - 90}" y="248" width="60" height="40" fill="url(#fadeR)"/>
    </g>
    <linearGradient id="fadeL" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0" stop-color="#0A0A0A"/><stop offset="1" stop-color="#0A0A0A" stop-opacity="0"/>
    </linearGradient>
    <linearGradient id="fadeR" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0" stop-color="#0A0A0A" stop-opacity="0"/><stop offset="1" stop-color="#0A0A0A"/>
    </linearGradient>
  </g>
</svg>`;

fs.writeFileSync(process.argv[2] || "header.svg", svg);
console.log("wrote", process.argv[2], "TRACK=", TRACK, "widths=", widths);
