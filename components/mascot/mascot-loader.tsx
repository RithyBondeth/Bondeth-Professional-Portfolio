import type { CSSProperties } from "react";
import { RobotArt } from "./robot-art";
import styles from "./mascot.module.css";

const VERBS = {
  en: ["Booting up", "Fetching bytes", "Compiling pixels", "Polishing the UI", "Almost there"],
  km: ["កំពុងចាប់ផ្តើម", "កំពុងទាញទិន្នន័យ", "កំពុងរៀបចំភីកសែល", "កំពុងតុបតែង", "ជិតរួចហើយ"],
} as const;

/**
 * Byte at work, for route loading states: a small floating pill with the
 * mascot scanning and a rotating status line.
 *
 * Pure CSS on purpose — loading UI is streamed before the page hydrates, so
 * anything that needed JavaScript to move would sit frozen exactly when it is
 * on screen. Both languages are rendered and the inactive one is hidden from
 * `html[lang]`, because loading.tsx does not receive route params. It fades in
 * after a short delay so fast navigations never flash it.
 */
export function MascotLoader({ label = "Loading" }: { label?: string }) {
  return (
    <div className={styles.loader} role="status">
      <RobotArt variant="head" mood="load" className={styles.loaderRobot} />
      <span className={styles.loaderVerbs} aria-hidden="true">
        {(Object.keys(VERBS) as Array<keyof typeof VERBS>).map((lang) => (
          <span key={lang} lang={lang} className={styles.loaderSet}>
            {VERBS[lang].map((verb, index) => (
              <span
                key={verb}
                className={styles.loaderVerb}
                style={{ "--i": index } as CSSProperties}
              >
                {verb}…
              </span>
            ))}
          </span>
        ))}
      </span>
      <span className="sr-only">{label}</span>
    </div>
  );
}
