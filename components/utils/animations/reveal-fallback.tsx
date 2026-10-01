"use client";

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
 * Scroll reveals for browsers without CSS view timelines (Firefox, older
 * Safari). Where `animation-timeline: view()` is supported this does nothing —
 * the CSS scrubs the motion itself.
 *
 * Otherwise it tags <html> with `reveal-js`, which hides every reveal target in
 * its starting pose, and flips each to `.is-revealed` as it enters the
 * viewport, letting CSS transitions play the same motion once. Targets already
 * on screen are revealed *before* the tag lands, so nothing visible blinks
 * out. A MutationObserver picks up content that streams in or arrives with a
 * client-side navigation.
 */
export function RevealFallback() {
  useEffect(() => {
    if (process.env.NODE_ENV === "development") {
      const timer = window.setTimeout(warnAboutTrappedReveals, 1500);
      return () => window.clearTimeout(timer);
    }
  }, []);

  useEffect(() => {
    if (CSS.supports("animation-timeline: view()")) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

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
  }, []);

  return null;
}
