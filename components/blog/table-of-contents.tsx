"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "@/components/utils/animations/gsap";
import type { ITableOfContentsItem } from "@/utils/functions/blog/get-table-of-contents";

interface ITableOfContentsProps {
  items: ITableOfContentsItem[];
  label: string;
  mobile?: boolean;
}

/**
 * Tracks which heading currently sits in the reading band (upper-middle of
 * the viewport) so the desktop TOC can highlight it.
 */
function useActiveHeading(items: ITableOfContentsItem[], enabled: boolean) {
  const [activeId, setActiveId] = useState("");

  useEffect(() => {
    if (!enabled || items.length === 0) return;

    const visible = new Set<string>();
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) visible.add(entry.target.id);
          else visible.delete(entry.target.id);
        }
        // Highlight the first (topmost) heading inside the band; when none is
        // in the band keep the last known one so the highlight never flickers.
        for (const item of items) {
          if (visible.has(item.id)) {
            setActiveId(item.id);
            return;
          }
        }
      },
      // A band from 20% to 60% down the viewport — where people read.
      { rootMargin: "-20% 0px -60% 0px" },
    );

    for (const item of items) {
      const el = document.getElementById(item.id);
      if (el) observer.observe(el);
    }
    return () => observer.disconnect();
  }, [items, enabled]);

  return activeId;
}

function ContentsLinks(
  props: Pick<ITableOfContentsProps, "items"> & { activeId?: string },
) {
  const { items, activeId } = props;
  return (
    <ol className="mt-4 space-y-1.5">
      {items.map((item) => (
        <li key={item.id}>
          <a
            href={`#${item.id}`}
            data-toc-id={item.id}
            aria-current={activeId === item.id ? "true" : undefined}
            className={`block rounded py-1.5 text-sm leading-snug transition-colors hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/60 ${
              item.level === 3 ? "pl-4" : ""
            } ${
              activeId === item.id
                ? "text-primary"
                : "text-muted-foreground"
            }`}
          >
            {item.title}
          </a>
        </li>
      ))}
    </ol>
  );
}

export function TableOfContents({
  items,
  label,
  mobile = false,
}: ITableOfContentsProps) {
  /* ---------------------------------- Utils --------------------------------- */
  // Scrollspy only drives the desktop rail — the mobile <details> stays plain.
  const activeId = useActiveHeading(items, !mobile);
  const navRef = useRef<HTMLElement>(null);
  const markerRef = useRef<HTMLSpanElement>(null);

  /* --------------------------------- Effects -------------------------------- */
  // A 2px primary bar glides along the left border to the active link.
  useEffect(() => {
    if (mobile) return;
    const nav = navRef.current;
    const marker = markerRef.current;
    if (!nav || !marker) return;

    const active = nav.querySelector<HTMLAnchorElement>(
      `a[data-toc-id="${activeId}"]`,
    );
    if (!active) {
      gsap.to(marker, { opacity: 0, duration: 0.2 });
      return;
    }
    const vars = {
      y: active.offsetTop,
      height: active.offsetHeight,
      opacity: 1,
    };
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      gsap.set(marker, vars);
    } else {
      gsap.to(marker, { ...vars, duration: 0.4, ease: "smooth" });
    }
  }, [activeId, mobile]);

  if (items.length === 0) return null;

  /* -------------------------------- Render UI ------------------------------- */
  if (mobile) {
    return (
      <details className="mb-10 rounded-lg border border-border/60 bg-card/40 px-4 py-3 lg:hidden">
        <summary className="cursor-pointer select-none font-mono text-xs font-medium uppercase tracking-[0.16em] text-foreground">
          {label}
        </summary>
        <nav aria-label={label}>
          <ContentsLinks items={items} />
        </nav>
      </details>
    );
  }

  return (
    <aside className="hidden lg:block">
      <nav
        ref={navRef}
        aria-label={label}
        className="sticky top-28 max-h-[calc(100vh-8rem)] overflow-y-auto border-l border-border/60 pl-5"
      >
        {/* Sliding active-heading marker on the rail */}
        <span
          ref={markerRef}
          aria-hidden
          className="pointer-events-none absolute left-[-1px] top-0 w-0.5 rounded-full bg-primary opacity-0"
        />
        <p className="font-mono text-xs font-medium uppercase tracking-[0.16em] text-foreground">
          {label}
        </p>
        <ContentsLinks items={items} activeId={activeId} />
      </nav>
    </aside>
  );
}
