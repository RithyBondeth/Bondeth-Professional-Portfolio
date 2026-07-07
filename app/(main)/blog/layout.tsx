import type { Metadata } from "next";
import { siteConfig } from "@/utils/constants/portfolio.constant";

export const metadata: Metadata = {
  // A plain-string title here would wipe the root template for child
  // segments, so blog posts re-declare it to keep the "— Name" suffix.
  title: {
    default: "Blog",
    template: `%s — ${siteConfig.name}`,
  },
  description:
    "Technical insights, AI research, and software engineering thoughts by Rithy Bondeth.",
  alternates: {
    canonical: "/blog",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
