"use client";

import { useEffect, useRef, useState } from "react";
import { track } from "@vercel/analytics";
import { gsap } from "@/components/utils/animations/gsap";
import { getDictionary, type TLocale } from "@/utils/i18n";

type TFormStatus = "idle" | "loading" | "success" | "error";

/* --------------------------------- Icons ---------------------------------- */
/* The select below runs with `appearance: none`, so this is the ONLY arrow the
   control has — same geometry in Chrome, Safari, Firefox and every mobile
   browser, instead of three different browser-drawn glyphs each parked wherever
   that engine decides. `currentColor` also means it follows the theme for free,
   which a background-image data URI would not. */
function ChevronDownIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      viewBox="0 0 24 24"
      {...props}
    >
      <path d="m6 9 6 6 6-6" />
    </svg>
  );
}

export default function ContactForm(props: { lang: TLocale }) {
  /* ---------------------------------- Props --------------------------------- */
  const { lang } = props;
  const dict = getDictionary(lang);
  const t = dict.contact.form;

  /* -------------------------------- All States ------------------------------- */
  const [status, setStatus] = useState<TFormStatus>("idle");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [message, setMessage] = useState("");
  // Drives the placeholder-vs-value colour of the project-type select: a select
  // showing its "pick one" option should read as muted the way the sibling
  // inputs' placeholders do. Kept in state rather than as a
  // `:has(option[value=""]:checked)` rule so the swap is one code path in every
  // engine, with no dependency on how each one invalidates `:has()`.
  const [projectType, setProjectType] = useState("");

  /* ---------------------------------- Utils --------------------------------- */
  const successCardRef = useRef<HTMLDivElement>(null);
  const loadingDotsRef = useRef<HTMLSpanElement>(null);
  // The localized label already ends in "..." — the animated span owns the
  // dots while loading, so trim them off the static text.
  const sendingLabel = t.sending.replace(/[.…]+$/, "");

  /* --------------------------------- Effects -------------------------------- */
  // Success card entrance: "snap" scale/fade plus a subtle emerald glow pulse.
  useEffect(() => {
    if (status !== "success") return;
    const card = successCardRef.current;
    if (!card) return;

    const mm = gsap.matchMedia();
    mm.add("(prefers-reduced-motion: no-preference)", () => {
      const tl = gsap.timeline();
      tl.fromTo(
        card,
        { opacity: 0, scale: 0.94 },
        { opacity: 1, scale: 1, duration: 0.5, ease: "snap" },
      )
        .fromTo(
          card,
          { boxShadow: "0 0 0 0 rgba(52, 211, 153, 0)" },
          {
            boxShadow: "0 0 32px 0 rgba(52, 211, 153, 0.25)",
            duration: 0.45,
            ease: "snap",
          },
          "-=0.2",
        )
        .to(card, {
          boxShadow: "0 0 0 0 rgba(52, 211, 153, 0)",
          duration: 0.9,
          ease: "power2.out",
          clearProps: "boxShadow",
        });
      return () => tl.kill();
    });

    return () => mm.revert();
  }, [status]);

  // Terminal-style ellipsis while sending: the dots tick ". .. ..." in place.
  useEffect(() => {
    if (status !== "loading") return;
    const dots = loadingDotsRef.current;
    if (!dots) return;

    const mm = gsap.matchMedia();
    mm.add("(prefers-reduced-motion: no-preference)", () => {
      const frames = [".", "..", "..."];
      const tl = gsap.timeline({ repeat: -1, repeatDelay: 0.3 });
      frames.forEach((frame, index) => {
        tl.set(dots, { textContent: frame }, index * 0.3);
      });
      return () => {
        tl.kill();
        // Rest on the full ellipsis, matching the static label.
        dots.textContent = "...";
      };
    });

    return () => mm.revert();
  }, [status]);

  /* --------------------------------- Methods -------------------------------- */
  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("loading");
    setErrorMessage(null);

    const formData = new FormData(e.currentTarget);
    const data = Object.fromEntries(formData.entries());

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        body: JSON.stringify(data),
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (response.ok) {
        track("contact_form_submitted");
        setStatus("success");
        setMessage("");
        setProjectType("");
        (e.target as HTMLFormElement).reset();
      } else {
        const body = await response.json().catch(() => null);
        setErrorMessage(body?.error ?? null);
        setStatus("error");
      }
    } catch {
      setErrorMessage(t.networkError);
      setStatus("error");
    }
  }

  /* -------------------------------- Render UI ------------------------------- */
  if (status === "success") {
    return (
      <div
        ref={successCardRef}
        className="rounded border border-status-success/25 bg-status-success/5 p-8 text-center"
      >
        <h3 className="text-status-success font-bold mb-2">{t.successTitle}</h3>
        <p className="text-muted-foreground text-sm">{t.successBody}</p>
        <button
          type="button"
          onClick={() => setStatus("idle")}
          className="mt-6 min-h-11 px-3 text-xs font-mono text-status-success/80 hover:text-status-success underline underline-offset-4"
        >
          {t.sendAnother}
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4 text-left">
      {/* Honeypot Section (hidden from real users, catches bots) */}
      <input
        type="text"
        name="company"
        tabIndex={-1}
        autoComplete="off"
        aria-hidden="true"
        className="hidden"
      />

      {/* Name + Email Section */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="flex flex-col gap-1.5">
          <label
            htmlFor="name"
            className="text-[10px] font-mono uppercase text-muted-foreground ml-1"
          >
            {t.name}
          </label>
          <input
            required
            id="name"
            name="name"
            type="text"
            maxLength={100}
            autoComplete="name"
            placeholder={t.namePlaceholder}
            className="bg-background border border-border/60 rounded px-4 py-2.5 text-sm focus:outline-hidden focus:border-primary/50 transition-colors"
          />
        </div>
        <div className="flex flex-col gap-1.5">
          <label
            htmlFor="email"
            className="text-[10px] font-mono uppercase text-muted-foreground ml-1"
          >
            {t.email}
          </label>
          <input
            required
            id="email"
            name="email"
            type="email"
            maxLength={254}
            autoComplete="email"
            placeholder={t.emailPlaceholder}
            className="bg-background border border-border/60 rounded px-4 py-2.5 text-sm focus:outline-hidden focus:border-primary/50 transition-colors"
          />
        </div>
      </div>

      <div className="flex flex-col gap-1.5">
        <label
          htmlFor="projectType"
          className="ml-1 font-mono text-[10px] uppercase text-muted-foreground"
        >
          {t.projectType}
        </label>
        {/* The arrow is ours, not the browser's — see ChevronDownIcon above. The
            wrapper exists only to anchor it; the select still owns the box, the
            border and the focus state, so the control stays one hit target. */}
        <div className="relative">
          <select
            id="projectType"
            name="projectType"
            value={projectType}
            onChange={(event) => setProjectType(event.currentTarget.value)}
            className={`peer w-full cursor-pointer appearance-none rounded border border-border/60 bg-background py-2.5 pl-4 pr-11 text-sm transition-colors focus:border-primary/50 focus:outline-hidden ${
              projectType ? "text-foreground" : "text-muted-foreground"
            }`}
          >
            {/* The popped-open list is drawn by the OS, so these colours only
                land where the engine honours them (Chrome/Firefox on Windows
                and Linux). `color-scheme` in globals.css covers the rest. */}
            <option
              value=""
              disabled
              className="bg-background text-muted-foreground"
            >
              {t.projectTypePlaceholder}
            </option>
            {t.projectTypes.map((type) => (
              <option
                key={type}
                value={type}
                className="bg-background text-foreground"
              >
                {type}
              </option>
            ))}
          </select>
          <ChevronDownIcon
            aria-hidden
            className="pointer-events-none absolute right-4 top-1/2 size-4 -translate-y-1/2 text-muted-foreground transition-colors peer-focus:text-primary"
          />
        </div>
      </div>

      {/* Message Section */}
      <div className="flex flex-col gap-1.5">
        <label
          htmlFor="message"
          className="text-[10px] font-mono uppercase text-muted-foreground ml-1"
        >
          {t.message}
        </label>
        <textarea
          required
          id="message"
          name="message"
          rows={5}
          maxLength={5000}
          value={message}
          onChange={(event) => setMessage(event.currentTarget.value)}
          placeholder={t.messagePlaceholder}
          className="bg-background border border-border/60 rounded px-4 py-2.5 text-sm focus:outline-hidden focus:border-primary/50 transition-colors resize-none"
        />
        <p className="text-right font-mono text-[10px] text-muted-foreground">
          {message.length.toLocaleString()}/5,000 {t.characterCount}
        </p>
      </div>

      {/* Error Message Section */}
      {status === "error" && (
        <p
          role="alert"
          aria-live="polite"
          className="text-status-danger text-xs font-mono"
        >
          {errorMessage ?? t.errorFallback}
        </p>
      )}

      {/* Submit Button Section */}
      <button
        disabled={status === "loading"}
        type="submit"
        className="btn-fx btn-fx-primary mt-2 flex items-center justify-center gap-2 w-full px-6 py-3 bg-primary-fill text-primary-foreground rounded font-mono text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <span className="text-primary-foreground/60">▸</span>
        {status === "loading" ? (
          <span>
            {sendingLabel}
            <span
              ref={loadingDotsRef}
              aria-hidden
              className="inline-block w-[3ch] text-left"
            >
              ...
            </span>
          </span>
        ) : (
          t.send
        )}
      </button>
    </form>
  );
}
