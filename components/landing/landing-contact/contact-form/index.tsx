"use client";

import { useState } from "react";
import { track } from "@vercel/analytics";
import { getDictionary, type TLocale } from "@/utils/i18n";

type TFormStatus = "idle" | "loading" | "success" | "error";

export default function ContactForm(props: { lang: TLocale }) {
  /* ---------------------------------- Props --------------------------------- */
  const { lang } = props;
  const dict = getDictionary(lang);
  const t = dict.contact.form;

  /* -------------------------------- All States ------------------------------- */
  const [status, setStatus] = useState<TFormStatus>("idle");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [message, setMessage] = useState("");

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
      <div className="rounded border border-emerald-500/20 bg-emerald-500/5 p-8 text-center">
        <h3 className="text-emerald-400 font-bold mb-2">{t.successTitle}</h3>
        <p className="text-muted-foreground text-sm">{t.successBody}</p>
        <button
          type="button"
          onClick={() => setStatus("idle")}
          className="mt-6 min-h-11 px-3 text-xs font-mono text-emerald-400/80 hover:text-emerald-400 underline underline-offset-4"
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
        <select
          id="projectType"
          name="projectType"
          defaultValue=""
          className="rounded border border-border/60 bg-background px-4 py-2.5 text-sm text-foreground transition-colors focus:border-primary/50 focus:outline-hidden"
        >
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
          className="text-red-400 text-xs font-mono"
        >
          {errorMessage ?? t.errorFallback}
        </p>
      )}

      {/* Submit Button Section */}
      <button
        disabled={status === "loading"}
        type="submit"
        className="mt-2 flex items-center justify-center gap-2 w-full px-6 py-3 bg-primary text-primary-foreground rounded font-mono text-sm font-medium hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <span className="text-primary-foreground/60">▸</span>
        {status === "loading" ? t.sending : t.send}
      </button>
    </form>
  );
}
