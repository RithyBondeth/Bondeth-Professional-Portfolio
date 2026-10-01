"use client";

import { useRef, useState } from "react";
import { cn } from "@/lib/utils";
import { RobotArt } from "@/components/mascot/robot-art";
import { useMascotGaze } from "@/components/mascot/use-mascot-gaze";

/* ---------------------------------- Logo ----------------------------------- */
function PixelTrail() {
  return (
    <span aria-hidden="true" className="mt-0.5 flex h-1 items-center gap-1">
      <span className="h-1 w-4 bg-brand-pixel" />
      <span className="h-1 w-2.5 bg-muted-foreground/70" />
      <span className="h-1 w-1.5 bg-muted-foreground/45" />
      <span className="size-1 bg-muted-foreground/25" />
    </span>
  );
}

/**
 * The brand mark is Byte's head. It watches the cursor and winks when you
 * point at it — small enough to stay a logo, alive enough to introduce the
 * mascot before the visitor ever opens the chat.
 */
export function Logo({ className }: { className?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const [hovered, setHovered] = useState(false);
  useMascotGaze(ref, { range: 1.2 });

  return (
    <span
      aria-hidden="true"
      onPointerEnter={() => setHovered(true)}
      onPointerLeave={() => setHovered(false)}
      className={cn(
        "inline-flex items-center gap-2 whitespace-nowrap select-none",
        className,
      )}
    >
      <span ref={ref} className="inline-flex h-7 shrink-0">
        <RobotArt
          variant="head"
          mood={hovered ? "wink" : "idle"}
          className="h-full w-auto"
        />
      </span>
      <span className="flex flex-col leading-none">
        <span className="font-sans text-base font-bold tracking-[-0.045em] text-foreground">
          Bondeth
        </span>
        <PixelTrail />
      </span>
    </span>
  );
}
