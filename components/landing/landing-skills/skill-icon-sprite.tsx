import {
  SiReact,
  SiNextdotjs,
  SiVuedotjs,
  SiNuxt,
  SiTypescript,
  SiTailwindcss,
  SiPython,
  SiNodedotjs,
  SiNestjs,
  SiPostgresql,
  SiMongodb,
  SiRedis,
  SiGraphql,
  SiFastapi,
  SiRabbitmq,
  SiAnthropic,
  SiGooglegemini,
  SiLangchain,
  SiLanggraph,
  SiOllama,
  SiHuggingface,
  SiFlutter,
  SiSwift,
  SiKotlin,
  SiGit,
  SiDocker,
  SiGithub,
  SiVercel,
  SiNetlify,
  SiDigitalocean,
  SiGooglecloud,
  SiCloudflare,
  SiNginx,
  SiGithubactions,
  SiLinux,
} from "react-icons/si";
import { FaAws } from "react-icons/fa";
import type { IconType } from "react-icons";
import { skillIconId } from "./skill-icon-id";
import { SiOpenai } from "./skill-icon-openai";

/**
 * The icon components stay on the server. A marquee row repeats each badge
 * seven or eight times over, so inlining these produced hundreds of copies of
 * the same path data in the prerendered HTML — and shipped all 37 icon
 * components to the browser besides. The sprite below emits each icon's
 * geometry exactly once and badges point at it with `<use>`.
 */
const ICON_MAP: Record<string, IconType> = {
  SiTypescript,
  SiReact,
  SiNextdotjs,
  SiVuedotjs,
  SiNuxt,
  SiTailwindcss,
  SiPython,
  SiNodedotjs,
  SiNestjs,
  SiPostgresql,
  SiMongodb,
  SiRedis,
  SiGraphql,
  SiFastapi,
  SiRabbitmq,
  SiOpenai,
  SiAnthropic,
  SiGooglegemini,
  SiLangchain,
  SiLanggraph,
  SiOllama,
  SiHuggingface,
  SiFlutter,
  SiSwift,
  SiKotlin,
  SiGit,
  SiDocker,
  SiGithub,
  SiVercel,
  SiNetlify,
  SiDigitalocean,
  SiGooglecloud,
  SiCloudflare,
  SiNginx,
  SiGithubactions,
  SiLinux,
  FaAws,
};

export function hasSkillIcon(icon: string) {
  return icon in ICON_MAP;
}

/**
 * Pulls the drawable innards and the viewBox out of a react-icons component.
 *
 * react-icons builds every icon with `GenIcon`, which returns a component that
 * renders `<IconBase attr={...}>{paths}</IconBase>` — so calling it yields an
 * element already carrying the viewBox in `attr` and the `<path>` elements as
 * children. Reading those off the element avoids rendering the icon to a
 * string, which is what `react-dom/server` would be for and which Next
 * (rightly) refuses to allow in a Server Component.
 */
function extractIcon(Icon: IconType) {
  const el = Icon({}) as React.ReactElement<{
    attr?: { viewBox?: string };
    children?: React.ReactNode;
  }>;
  return {
    viewBox: el.props.attr?.viewBox ?? "0 0 24 24",
    children: el.props.children,
  };
}

/**
 * A hidden `<symbol>` per skill icon, rendered once per page. Must be present
 * in the document for the badges' `<use href="#skill-icon-…">` to resolve, so
 * it lives at the top of the skills section.
 *
 * `fill="currentColor"` sits on the symbol rather than the referencing `<svg>`
 * because a `<use>` shadow tree inherits from the symbol it instantiates —
 * that is what lets each badge tint its icon with `--brand` via `color`.
 */
export function SkillIconSprite(props: { icons: string[] }) {
  const unique = [...new Set(props.icons)].filter(hasSkillIcon);

  return (
    <svg
      aria-hidden
      focusable="false"
      style={{ display: "none" }}
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        {unique.map((key) => {
          const { viewBox, children } = extractIcon(ICON_MAP[key]);
          return (
            <symbol
              key={key}
              id={skillIconId(key)}
              viewBox={viewBox}
              fill="currentColor"
              stroke="currentColor"
              strokeWidth={0}
            >
              {children}
            </symbol>
          );
        })}
      </defs>
    </svg>
  );
}
