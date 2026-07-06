"use client";

import { useState } from "react";

export default function ContactForm() {
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("loading");

    const formData = new FormData(e.currentTarget);
    const data = Object.fromEntries(formData.entries());

    try {
      // Replace 'YOUR_FORMSPREE_ID' with your actual Formspree ID
      const response = await fetch("https://formspree.io/f/YOUR_FORMSPREE_ID", {
        method: "POST",
        body: JSON.stringify(data),
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
      });

      if (response.ok) {
        setStatus("success");
        (e.target as HTMLFormElement).reset();
      } else {
        setStatus("error");
      }
    } catch {
      setStatus("error");
    }
  }

  if (status === "success") {
    return (
      <div className="rounded border border-emerald-500/20 bg-emerald-500/5 p-8 text-center">
        <h3 className="text-emerald-400 font-bold mb-2">Message Sent!</h3>
        <p className="text-muted-foreground text-sm">
          Thanks for reaching out. I&apos;ll get back to you as soon as possible.
        </p>
        <button
          onClick={() => setStatus("idle")}
          className="mt-6 text-xs font-mono text-emerald-400/80 hover:text-emerald-400 underline underline-offset-4"
        >
          Send another message
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4 text-left">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="flex flex-col gap-1.5">
          <label htmlFor="name" className="text-[10px] font-mono uppercase text-muted-foreground ml-1">
            Name
          </label>
          <input
            required
            id="name"
            name="name"
            type="text"
            placeholder="Your Name"
            className="bg-background border border-border/60 rounded px-4 py-2.5 text-sm focus:outline-hidden focus:border-primary/50 transition-colors"
          />
        </div>
        <div className="flex flex-col gap-1.5">
          <label htmlFor="email" className="text-[10px] font-mono uppercase text-muted-foreground ml-1">
            Email
          </label>
          <input
            required
            id="email"
            name="email"
            type="email"
            placeholder="your@email.com"
            className="bg-background border border-border/60 rounded px-4 py-2.5 text-sm focus:outline-hidden focus:border-primary/50 transition-colors"
          />
        </div>
      </div>
      <div className="flex flex-col gap-1.5">
        <label htmlFor="message" className="text-[10px] font-mono uppercase text-muted-foreground ml-1">
          Message
        </label>
        <textarea
          required
          id="message"
          name="message"
          rows={5}
          placeholder="How can I help you?"
          className="bg-background border border-border/60 rounded px-4 py-2.5 text-sm focus:outline-hidden focus:border-primary/50 transition-colors resize-none"
        />
      </div>

      {status === "error" && (
        <p className="text-red-400 text-xs font-mono">
          Oops! Something went wrong. Please try again or email me directly.
        </p>
      )}

      <button
        disabled={status === "loading"}
        type="submit"
        className="mt-2 flex items-center justify-center gap-2 w-full px-6 py-3 bg-primary text-primary-foreground rounded font-mono text-sm font-medium hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <span className="text-primary-foreground/60">▸</span>
        {status === "loading" ? "Sending..." : "Send Message"}
      </button>
    </form>
  );
}
