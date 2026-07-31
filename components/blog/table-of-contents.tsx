"use client";

import { useEffect, useState } from "react";
import type { ITableOfContentsItem } from "@/utils/functions/blog";

interface ITableOfContentsProps {
  items: ITableOfContentsItem[];
  label: string;
  mobile?: boolean;
}

/**
 * The article's contents rail.
 *
 * The active heading used to be marked by a 2px bar that GSAP glided down the
 * rail. It is now the active link's own left border going to the marker
 * colour — same information, no animation library, and correct on first paint
 * rather than after a measure pass.
 */

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
            className={`-ml-5 block border-l py-1.5 pl-5 text-sm leading-snug transition-colors hover:text-foreground focus-visible:outline-none ${
              item.level === 3 ? "pl-9" : ""
            } ${
              activeId === item.id
                ? "border-marker text-foreground"
                : "border-transparent text-muted-foreground"
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
  // Scrollspy only drives the desktop rail — the mobile <details> stays plain.
  const activeId = useActiveHeading(items, !mobile);

  if (items.length === 0) return null;

  /* -------------------------------- Render UI ------------------------------- */
  if (mobile) {
    return (
      <details className="mb-12 border-y border-rule py-4 lg:hidden">
        <summary className="eyebrow cursor-pointer select-none">
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
        aria-label={label}
        className="sticky top-28 max-h-[calc(100vh-8rem)] overflow-y-auto border-l border-rule pl-5"
      >
        <p className="eyebrow">{label}</p>
        <ContentsLinks items={items} activeId={activeId} />
      </nav>
    </aside>
  );
}
