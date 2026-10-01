"use client";

import { useReducedMotion } from "@/components/utils/animations/use-motion";

import { useEffect } from "react";

const TARGETS = ".reveal-on-view, .reveal-heading, .stagger-on-view > *";

/**
 * Development guard: a reveal inside an `overflow: hidden|auto|scroll`
 * ancestor binds its view() timeline to that box instead of the page, so it
 * never animates — with no error anywhere. Name the offenders loudly.
 */
function warnAboutTrappedReveals() {
  const offenders = new Map<Element, number>();
  document.querySelectorAll(TARGETS).forEach((el) => {
    for (let node = el.parentElement; node && node !== document.body; node = node.parentElement) {
      const { overflowX, overflowY } = getComputedStyle(node);
      if (/hidden|auto|scroll/.test(overflowX + overflowY)) {
        offenders.set(node, (offenders.get(node) ?? 0) + 1);
        break;
      }
    }
  });
  offenders.forEach((count, node) => {
    console.warn(
      `[reveal] ${count} scroll reveal(s) will never animate: this ancestor is a scroll container (overflow hidden/auto/scroll). Use overflow-clip instead.`,
      node,
    );
  });
}

/**
 * Time-based entrances share one rhythm across browsers. Observe each reveal
 * once, show above-the-fold content immediately, and discover streamed content.
 * Reduced motion removes the hiding class and disconnects both observers.
 */
export function RevealFallback() {
  const reduceMotion = useReducedMotion();
  useEffect(() => {
    if (process.env.NODE_ENV === "development") {
      const timer = window.setTimeout(warnAboutTrappedReveals, 1500);
      return () => window.clearTimeout(timer);
    }
  }, []);

  useEffect(() => {
    if (reduceMotion) return;

    const root = document.documentElement;
    const tracked = new WeakSet<Element>();

    const intersection = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          entry.target.classList.add("is-revealed");
          intersection.unobserve(entry.target);
        }
      },
      { rootMargin: "0px 0px -10% 0px" },
    );

    const scan = () => {
      const viewportBottom = window.innerHeight;
      document.querySelectorAll(TARGETS).forEach((el) => {
        if (tracked.has(el)) return;
        tracked.add(el);
        if (!root.classList.contains("reveal-js")) {
          const { top } = el.getBoundingClientRect();
          if (top < viewportBottom) {
            el.classList.add("is-revealed");
            return;
          }
        }
        intersection.observe(el);
      });
    };

    scan();
    root.classList.add("reveal-js");

    let frame = 0;
    const mutations = new MutationObserver(() => {
      if (!frame) {
        frame = requestAnimationFrame(() => {
          frame = 0;
          scan();
        });
      }
    });
    mutations.observe(document.body, { childList: true, subtree: true });

    return () => {
      intersection.disconnect();
      mutations.disconnect();
      if (frame) cancelAnimationFrame(frame);
      root.classList.remove("reveal-js");
    };
  }, [reduceMotion]);

  return null;
}
