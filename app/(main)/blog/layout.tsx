import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Blog — Rithy Bondeth",
  description:
    "Technical insights, AI research, and software engineering thoughts by Rithy Bondeth.",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
