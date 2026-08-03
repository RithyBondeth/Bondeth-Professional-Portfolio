/**
 * Maps a project's `tags` entry to a drawable icon and its brand colour.
 *
 * Dependency-free for the same reason `skill-icon-id` is: the client-side card
 * and the server-side sprite both read it, and importing the sprite from the
 * card would drag every react-icons component into the browser bundle.
 *
 * Not every tag resolves, and that's deliberate rather than a gap to fill.
 * "Microservices" and "LLM APIs" are architectural choices, not products —
 * there is no logo, and inventing a glyph for them would be less legible than
 * the word. Those fall back to a text chip; see TechBadges.
 */
export const TECH_ICONS: Record<
  string,
  { icon: string; color: string; colorLight?: string }
> = {
  TypeScript: { icon: "SiTypescript", color: "#3178C6" },
  "React.js": { icon: "SiReact", color: "#61DAFB" },
  "Next.js": { icon: "SiNextdotjs", color: "#FFFFFF", colorLight: "#0A0A0A" },
  "Nuxt.js": { icon: "SiNuxt", color: "#4FC08D" },
  "Vue.js": { icon: "SiVuedotjs", color: "#4FC08D" },
  "Tailwind CSS": { icon: "SiTailwindcss", color: "#06B6D4" },
  Python: { icon: "SiPython", color: "#3776AB" },
  "Node.js": { icon: "SiNodedotjs", color: "#339933" },
  NestJS: { icon: "SiNestjs", color: "#E0234E" },
  FastAPI: { icon: "SiFastapi", color: "#009688" },
  GraphQL: { icon: "SiGraphql", color: "#E10098" },
  PostgreSQL: { icon: "SiPostgresql", color: "#4169E1" },
  MongoDB: { icon: "SiMongodb", color: "#47A248" },
  Redis: { icon: "SiRedis", color: "#FF4438" },
  Supabase: { icon: "SiSupabase", color: "#3FCF8E" },
  Firebase: { icon: "SiFirebase", color: "#FFCA28" },
  RabbitMQ: { icon: "SiRabbitmq", color: "#FF6600" },
  Kubernetes: { icon: "SiKubernetes", color: "#326CE5" },
  Docker: { icon: "SiDocker", color: "#2496ED" },
  Nginx: { icon: "SiNginx", color: "#009639" },
  Cloudflare: { icon: "SiCloudflare", color: "#F38020" },
  AWS: { icon: "FaAws", color: "#FF9900" },
  Vercel: { icon: "SiVercel", color: "#FFFFFF", colorLight: "#0A0A0A" },
  Flutter: { icon: "SiFlutter", color: "#54C5F8" },
  Dart: { icon: "SiDart", color: "#0175C2" },
  Swift: { icon: "SiSwift", color: "#F05138" },
  Kotlin: { icon: "SiKotlin", color: "#7F52FF" },
  // Apple ships no separate SwiftUI or Apple Events mark, so all three
  // Apple-platform tags borrow the one logo that is unambiguously theirs.
  SwiftUI: { icon: "SiSwift", color: "#F05138" },
  macOS: { icon: "SiApple", color: "#FFFFFF", colorLight: "#0A0A0A" },
  "Apple Events": { icon: "SiApple", color: "#FFFFFF", colorLight: "#0A0A0A" },
};

/** The icon keys a set of tags needs, for seeding the sprite. */
export function techIconKeys(tags: string[]): string[] {
  return tags.map((tag) => TECH_ICONS[tag]?.icon).filter(Boolean) as string[];
}
