"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import type { Locale } from "@/shared/i18n";
import type { CommandPalettePost } from "@/features/navigation/components/command-palette/command-palette";
import { OPEN_COMMAND_PALETTE } from "@/shared/lib/command-palette-events";

const CommandPalette = dynamic(
  () =>
    import("@/features/navigation/components/command-palette/command-palette"),
  { ssr: false },
);

/** Loads the command palette only when the visitor opens it. */
export default function DeferredCommandPalette(props: {
  lang: Locale;
  posts: CommandPalettePost[];
}) {
  const [requested, setRequested] = useState(false);

  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        setRequested(true);
      }
    }
    function onOpen() {
      setRequested(true);
    }

    window.addEventListener("keydown", onKeyDown);
    window.addEventListener(OPEN_COMMAND_PALETTE, onOpen);
    return () => {
      window.removeEventListener("keydown", onKeyDown);
      window.removeEventListener(OPEN_COMMAND_PALETTE, onOpen);
    };
  }, []);

  return requested ? <CommandPalette {...props} initialOpen /> : null;
}
