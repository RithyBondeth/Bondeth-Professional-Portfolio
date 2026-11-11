"use client";

import { useState } from "react";
import Link from "next/link";
import { track } from "@vercel/analytics";
import { getDictionary, type Locale } from "@/shared/i18n";
import { Select } from "@/shared/components/ui/select";

type FormStatus = "idle" | "loading" | "success" | "error";

export default function ContactForm(props: { lang: Locale }) {
  const { lang } = props;
  const dict = getDictionary(lang);
  const t = dict.contact.form;

  const [status, setStatus] = useState<FormStatus>("idle");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [message, setMessage] = useState("");
  const [projectType, setProjectType] = useState("");

  // The localized label already ends in "..." — the animated span owns the
  // dots while loading, so trim them off the static text.
  const sendingLabel = t.sending.replace(/[.…]+$/, "");

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

  if (status === "success") {
    return (
      <div className="contact-success-pop rounded-lg border border-status-success/25 bg-status-success/5 p-8 text-center">
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
            className="rounded-lg border border-border/60 bg-background px-4 py-2.5 text-sm transition-colors focus:border-primary/50 focus:outline-hidden"
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
            className="rounded-lg border border-border/60 bg-background px-4 py-2.5 text-sm transition-colors focus:border-primary/50 focus:outline-hidden"
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
        <Select
          id="projectType"
          name="projectType"
          value={projectType}
          onValueChange={setProjectType}
          placeholder={t.projectTypePlaceholder}
          options={t.projectTypes.map((type) => ({ value: type, label: type }))}
        />
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
          className="resize-none rounded-lg border border-border/60 bg-background px-4 py-2.5 text-sm transition-colors focus:border-primary/50 focus:outline-hidden"
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

      <p className="text-center text-[10px] leading-5 text-muted-foreground">
        {t.privacyNotice}{" "}
        <Link
          href={`/${lang}/privacy`}
          className="underline decoration-border underline-offset-4 transition-colors hover:text-primary"
        >
          {t.privacyLink}
        </Link>
      </p>

      {/* Submit Button Section */}
      <button
        disabled={status === "loading"}
        type="submit"
        className="btn-fx btn-fx-primary mt-2 flex w-full items-center justify-center gap-2 rounded-lg bg-primary-fill px-6 py-3 font-mono text-sm font-medium text-primary-foreground disabled:cursor-not-allowed disabled:opacity-50"
      >
        <span className="text-primary-foreground/60">▸</span>
        {status === "loading" ? (
          <span>
            {sendingLabel}
            <span
              aria-hidden
              className="inline-block w-[3ch] animate-pulse text-left motion-reduce:animate-none"
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
