"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import { MascotBuddy } from "@/components/mascot/mascot-buddy";
import type { IChatTour } from "@/utils/chatbot/types";
import styles from "./pixel-chatbot.module.css";

const PixelChatbot = dynamic(() => import("./pixel-chatbot"), {
  ssr: false,
});

const launcherCopy = {
  en: {
    label: "Chat with Bondeth's pixel assistant",
    bubble: "Ask me",
  },
  km: {
    label: "ជជែកជាមួយជំនួយការ Pixel របស់ Bondeth",
    bubble: "សួរខ្ញុំ",
  },
} as const;

/**
 * Keeps the Markdown renderer and chat request code out of the initial bundle.
 * The lightweight launcher remains immediately interactive and loads the full
 * assistant only after a visitor asks to open it. The companion mascot lives
 * here rather than behind that click, so it is alive from the first scroll.
 */
export default function DeferredPixelChatbot({ lang, tours }: { lang: string; tours: IChatTour[] }) {
  const [requested, setRequested] = useState(false);
  const text = lang === "km" ? launcherCopy.km : launcherCopy.en;

  if (requested) return <PixelChatbot lang={lang} tours={tours} initialOpen />;

  return (
    <aside className={styles.chatbot} aria-label={text.label}>
      <button
        type="button"
        className={styles.launcher}
        aria-label={text.label}
        aria-expanded="false"
        onClick={() => setRequested(true)}
      >
        <span className={styles.launcherGlow} />
        <MascotBuddy
          lang={lang}
          bubble={text.bubble}
          bubbleClassName={styles.speechBubble}
          className={styles.buddy}
        />
        <span className={styles.launcherStatus} aria-hidden="true" />
      </button>
    </aside>
  );
}
