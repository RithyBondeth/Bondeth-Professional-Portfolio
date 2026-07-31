"use client";

/**
 * GSAP's Flip plugin, kept out of the shared `gsap.ts` module.
 *
 * Flip is ~25 KB minified and only two components use it — the blog and
 * project explorers, for their filter re-layout. Registering it in `gsap.ts`
 * put it in the chunk every route loads, so the landing page paid for a plugin
 * it never calls. Importing it from here instead keeps it in the chunks for
 * the two routes that do.
 *
 * Import `gsap` itself from "./gsap" as usual; this module only adds Flip.
 */
import { Flip } from "gsap/Flip";
import { gsap } from "./gsap";

gsap.registerPlugin(Flip);

export { Flip };
