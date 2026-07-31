"use client";

import { useState } from "react";
import { track } from "@vercel/analytics";
import { getDictionary, type TLocale } from "@/utils/i18n";

/**
 * Contact form.
 *
 * Fields are underlines, not boxes — a rule you write on, which is how a
 * printed reply card works and which keeps the section as flat as every other
 * one. The `.field` class in `globals.css` owns that treatment so the input,
 * select and textarea all sit on the same baseline grid.
 *
 * The old GSAP entrance on the success card (scale snap + emerald glow pulse)
 * and the ticking "Sending..." ellipsis are gone: both were animation for its
 * own sake, and the ellipsis in particular fought with screen readers, which
 * re-announced the label on every tick.
 */

type TFormStatus = "idle" | "loading" | "success" | "error";

export default function ContactForm({ lang }: { lang: TLocale }) {
  const dict = getDictionary(lang);
  const t = dict.contact.form;

  const [status, setStatus] = useState<TFormStatus>("idle");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [message, setMessage] = useState("");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("loading");
    setErrorMessage(null);

    const form = e.currentTarget;
    const data = Object.fromEntries(new FormData(form).entries());

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        body: JSON.stringify(data),
        headers: { "Content-Type": "application/json" },
      });

      if (response.ok) {
        track("contact_form_submitted");
        setStatus("success");
        setMessage("");
        form.reset();
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

  if (status === "success") {
    return (
      <div className="border-t-2 border-marker pt-6">
        <p className="eyebrow">{t.successTitle}</p>
        <p className="display-sm mt-4 text-balance">{t.successBody}</p>
        <button
          type="button"
          onClick={() => setStatus("idle")}
          className="btn-fx link-wipe mt-6 text-sm text-muted-foreground hover:text-foreground"
        >
          {t.sendAnother}
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="text-left">
      {/* Honeypot — hidden from real users, catches bots. */}
      <input
        type="text"
        name="company"
        tabIndex={-1}
        autoComplete="off"
        aria-hidden="true"
        className="hidden"
      />

      <div className="grid gap-x-8 gap-y-7 sm:grid-cols-2">
        <div>
          <label htmlFor="name" className="eyebrow">
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
            className="field"
          />
        </div>

        <div>
          <label htmlFor="email" className="eyebrow">
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
            className="field"
          />
        </div>
      </div>

      <div className="mt-7">
        <label htmlFor="projectType" className="eyebrow">
          {t.projectType}
        </label>
        <select id="projectType" name="projectType" defaultValue="" className="field">
          <option value="" disabled>
            {t.projectTypePlaceholder}
          </option>
          {t.projectTypes.map((type) => (
            <option key={type} value={type}>
              {type}
            </option>
          ))}
        </select>
      </div>

      <div className="mt-7">
        <label htmlFor="message" className="eyebrow">
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
          className="field resize-none"
        />
        <p className="eyebrow mt-2 text-right">
          {message.length.toLocaleString()}/5,000 {t.characterCount}
        </p>
      </div>

      {status === "error" && (
        <p role="alert" aria-live="polite" className="mt-6 text-sm text-destructive">
          {errorMessage ?? t.errorFallback}
        </p>
      )}

      <button
        disabled={status === "loading"}
        type="submit"
        className="btn-fx btn-fx-primary mt-9 w-full bg-primary px-6 py-4 text-sm text-primary-foreground disabled:cursor-not-allowed disabled:opacity-50 sm:w-auto sm:px-12"
      >
        {status === "loading" ? t.sending : t.send}
      </button>
    </form>
  );
}
