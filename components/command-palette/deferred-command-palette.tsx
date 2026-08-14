"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import type { TLocale } from "@/utils/i18n";
import type { ICommandPalettePost } from "./index";
import { OPEN_COMMAND_PALETTE } from "./events";

const CommandPalette = dynamic(() => import("./index"), { ssr: false });

/** Loads the command palette only when the visitor opens it. */
export default function DeferredCommandPalette(props: {
  lang: TLocale;
  posts: ICommandPalettePost[];
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
