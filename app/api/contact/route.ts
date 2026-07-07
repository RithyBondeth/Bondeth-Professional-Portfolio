import { NextResponse } from "next/server";
import { Resend } from "resend";
import { siteConfig } from "@/utils/constants/portfolio.constant";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(request: Request) {
  /* ------------------------------ Parse Payload ------------------------------ */
  let payload: Record<string, unknown>;
  try {
    payload = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  const name = typeof payload.name === "string" ? payload.name.trim() : "";
  const email = typeof payload.email === "string" ? payload.email.trim() : "";
  const message = typeof payload.message === "string" ? payload.message.trim() : "";
  const honeypot = typeof payload.company === "string" ? payload.company.trim() : "";

  /* ------------------------------ Spam Honeypot ------------------------------ */
  // Bots fill every field; real users never see this one. Pretend it worked.
  if (honeypot) {
    return NextResponse.json({ ok: true });
  }

  /* -------------------------------- Validation ------------------------------- */
  if (!name || name.length > 100) {
    return NextResponse.json({ error: "Please provide your name." }, { status: 400 });
  }
  if (!EMAIL_REGEX.test(email) || email.length > 254) {
    return NextResponse.json({ error: "Please provide a valid email address." }, { status: 400 });
  }
  if (!message || message.length > 5000) {
    return NextResponse.json(
      { error: "Please provide a message (max 5000 characters)." },
      { status: 400 }
    );
  }

  /* -------------------------------- Send Email ------------------------------- */
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    console.error("RESEND_API_KEY is not set — contact form cannot send email.");
    return NextResponse.json(
      { error: "The contact form is not configured yet." },
      { status: 500 }
    );
  }

  const resend = new Resend(apiKey);
  const { error } = await resend.emails.send({
    // Resend's shared sender works without domain verification;
    // set CONTACT_FROM_EMAIL once a custom domain is verified.
    from: process.env.CONTACT_FROM_EMAIL ?? "Portfolio Contact <onboarding@resend.dev>",
    to: siteConfig.email,
    replyTo: email,
    subject: `Portfolio contact from ${name}`,
    text: `Name: ${name}\nEmail: ${email}\n\n${message}`,
  });

  if (error) {
    console.error("Resend error:", error);
    return NextResponse.json(
      { error: "Failed to send message. Please try again later." },
      { status: 502 }
    );
  }

  return NextResponse.json({ ok: true });
}
