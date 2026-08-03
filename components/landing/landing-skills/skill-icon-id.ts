/**
 * The skill-icon vocabulary, and the `<use href>` a badge points at for a
 * given `skill.icon` key.
 *
 * Kept in its own dependency-free module because both sides need it: the
 * server-only sprite that defines the `<symbol>`s, and the client badge that
 * references them. Importing either from the other would drag all 37 icon
 * components into the client bundle — which is the whole thing the sprite
 * exists to avoid.
 *
 * This list is the source of truth for which keys are drawable. The sprite
 * maps each one to its react-icons component and will fail its own lookup
 * loudly if the two ever drift apart.
 */
export const SKILL_ICON_KEYS = [
  "SiTypescript",
  "SiReact",
  "SiNextdotjs",
  "SiVuedotjs",
  "SiNuxt",
  "SiTailwindcss",
  "SiPython",
  "SiNodedotjs",
  "SiNestjs",
  "SiPostgresql",
  "SiMongodb",
  "SiRedis",
  "SiGraphql",
  "SiFastapi",
  "SiRabbitmq",
  "SiOpenai",
  "SiAnthropic",
  "SiGooglegemini",
  "SiLangchain",
  "SiLanggraph",
  "SiOllama",
  "SiHuggingface",
  "SiFlutter",
  "SiSwift",
  "SiKotlin",
  "SiGit",
  "SiDocker",
  "SiGithub",
  "SiVercel",
  "SiNetlify",
  "SiDigitalocean",
  "SiGooglecloud",
  "SiCloudflare",
  "SiNginx",
  "SiGithubactions",
  "SiLinux",
  "FaAws",
  // Used by project tech badges rather than the skills marquee.
  "SiKubernetes",
  "SiSupabase",
  "SiFirebase",
  "SiDart",
  "SiApple",
] as const;

export type TSkillIconKey = (typeof SKILL_ICON_KEYS)[number];

const KNOWN = new Set<string>(SKILL_ICON_KEYS);

/** Whether `icon` names an icon the sprite can draw. */
export function hasSkillIcon(icon: string): icon is TSkillIconKey {
  return KNOWN.has(icon);
}

/** The `<symbol>` id — and so the `<use href>` — for a given icon key. */
export function skillIconId(icon: string) {
  return `skill-icon-${icon}`;
}
