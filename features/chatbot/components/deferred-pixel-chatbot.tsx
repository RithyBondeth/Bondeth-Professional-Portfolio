"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";
import { MascotBuddy } from "@/shared/components/mascot/mascot-buddy";
import type { ChatTour } from "@/features/chatbot/domain/types";
import { OPEN_CHATBOT } from "@/shared/lib/chatbot-events";
import styles from "@/features/chatbot/components/pixel-chatbot.module.css";

const PixelChatbot = dynamic(
  () => import("@/features/chatbot/components/pixel-chatbot"),
  {
    ssr: false,
  },
);

const launcherCopy = {
  en: {
    label: "Chat with Bondeth's pixel assistant",
    bubble: "Ask me",
  },
  km: {
    label: "ជជែកជាមួយជំនួយការ Pixel របស់ ហែម ឫទ្ធីបណ្ឌិត",
    bubble: "សួរខ្ញុំ",
  },
} as const;

/**
 * Keeps the Markdown renderer and chat request code out of the initial bundle.
 * The lightweight launcher remains immediately interactive and loads the full
 * assistant only after a visitor asks to open it. The companion mascot lives
 * here rather than behind that click, so it is alive from the first scroll.
 */
export default function DeferredPixelChatbot({
  lang,
  tours,
}: {
  lang: string;
  tours: ChatTour[];
}) {
  const [isOpen, setIsOpen] = useState<boolean | null>(null);
  const mobileReturnFocus = useRef<HTMLElement | null>(null);
  const text = lang === "km" ? launcherCopy.km : launcherCopy.en;

  useEffect(() => {
    const openFromMenu = (event: Event) => {
      mobileReturnFocus.current = (
        event as CustomEvent<HTMLElement | null>
      ).detail;
      setIsOpen(true);
    };
    window.addEventListener(OPEN_CHATBOT, openFromMenu);
    return () => window.removeEventListener(OPEN_CHATBOT, openFromMenu);
  }, []);

  const handleOpenChange = useCallback(
    (open: boolean, restoreFocus = false) => {
      setIsOpen(open);
      if (!open && restoreFocus) {
        mobileReturnFocus.current?.focus({ preventScroll: true });
      }
    },
    [],
  );

  if (isOpen !== null) {
    return (
      <PixelChatbot
        lang={lang}
        tours={tours}
        isOpen={isOpen}
        onOpenChange={handleOpenChange}
      />
    );
  }

  return (
    <aside className={styles.chatbot} aria-label={text.label}>
      <button
        type="button"
        className={styles.launcher}
        aria-label={text.label}
        aria-expanded="false"
        onClick={() => setIsOpen(true)}
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
