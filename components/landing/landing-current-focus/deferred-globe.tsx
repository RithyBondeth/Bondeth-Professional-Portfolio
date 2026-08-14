"use client";

import { useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";

const WireframeDottedGlobe = dynamic(
  () =>
    import("@/components/ui/wireframe-dotted-globe").then(
      (module) => module.WireframeDottedGlobe,
    ),
  { ssr: false },
);

export function DeferredGlobe(props: {
  label: string;
  description: string;
  className?: string;
}) {
  const rootRef = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        setVisible(true);
        observer.disconnect();
      },
      { rootMargin: "320px" },
    );
    observer.observe(root);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={rootRef} className={props.className}>
      {visible ? (
        <WireframeDottedGlobe
          label={props.label}
          description={props.description}
          className="mx-auto"
        />
      ) : (
        <div
          aria-hidden="true"
          className="mx-auto aspect-square w-full max-w-115 rounded-full border border-border/35 bg-primary/3"
        />
      )}
    </div>
  );
}
