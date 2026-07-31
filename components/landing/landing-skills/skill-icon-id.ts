/**
 * The `<use href>` a skill badge points at for a given `skill.icon` key.
 *
 * Kept in its own dependency-free module because both sides need it: the
 * server-only sprite that defines the `<symbol>`s, and the client badge that
 * references them. Importing it from the sprite instead would drag
 * `react-dom/server` and all 37 icon components into the client bundle.
 */
export function skillIconId(icon: string) {
  return `skill-icon-${icon}`;
}
