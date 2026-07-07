"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { navLinks, siteConfig } from "@/utils/constants/portfolio.constant";
import { MenuIcon, CloseIcon } from "@/components/utils/icons";

export default function Navbar() {
  /* -------------------------------- All States ------------------------------- */
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("");
  const [progress, setProgress] = useState(0);

  /* --------------------------------- Effects -------------------------------- */
  useEffect(() => {
    const sectionIds = navLinks
      .map(({ href }) => href)
      .filter((href) => href.startsWith("/#"))
      .map((href) => href.replace("/#", ""));

    const onScroll = () => {
      setScrolled(window.scrollY > 20);

      const scrollHeight =
        document.documentElement.scrollHeight - window.innerHeight;
      setProgress(scrollHeight > 0 ? (window.scrollY / scrollHeight) * 100 : 0);

      const threshold = window.innerHeight * 0.35;
      let current = "";

      // Check if we are on the blog page
      if (window.location.pathname.startsWith("/blog")) {
        current = "blog";
      } else {
        for (const id of sectionIds) {
          const el = document.getElementById(id);
          if (!el) continue;
          if (el.getBoundingClientRect().top <= threshold) current = id;
        }
      }
      setActiveSection(current);
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  /* -------------------------------- Render UI ------------------------------- */
  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-[#060d1f]/95 backdrop-blur-md border-b border-border shadow-xl shadow-black/40"
          : "bg-transparent"
      }`}
    >
      {/* Scroll Progress Bar Section */}
      <div
        className="absolute bottom-0 left-0 h-px bg-primary/70 transition-[width] duration-75 ease-out pointer-events-none"
        style={{ width: `${progress}%` }}
      />
      <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
        {/* Brand Section */}
        <a
          href="#"
          className="flex items-center gap-2.5 hover:opacity-80 transition-opacity group"
        >
          <Image
            src="/logo.webp"
            alt={siteConfig.name}
            width={32}
            height={32}
            className="rounded-full ring-1 ring-border group-hover:ring-primary/50 transition-all"
          />
          <span className="text-foreground font-bold text-sm tracking-tight hidden sm:block font-mono">
            {siteConfig.name}
          </span>
        </a>

        {/* Desktop Links Section */}
        <ul className="hidden sm:flex items-center gap-1">
          {navLinks.map(({ href, label }, i) => {
            const id = href.replace("/#", "").replace("/", "");
            const isActive = activeSection === id;
            return (
              <li key={href}>
                <a
                  href={href}
                  className={`relative px-3 py-1.5 text-xs font-mono tracking-wide transition-colors duration-200 rounded ${
                    isActive
                      ? "text-primary"
                      : "text-muted-foreground hover:text-foreground hover:bg-white/3"
                  }`}
                >
                  <span className="text-primary/40 mr-1 text-[10px]">
                    0{i + 1}.
                  </span>
                  {label}
                  {isActive && (
                    <span className="absolute bottom-0 left-3 right-3 h-px bg-primary/60 rounded-full" />
                  )}
                </a>
              </li>
            );
          })}
          <li className="ml-2">
            <a
              href={siteConfig.resume}
              target="_blank"
              rel="noopener noreferrer"
              className="px-3 py-1.5 text-xs font-mono tracking-wide text-primary border border-primary/30 rounded hover:bg-primary/5 transition-all"
            >
              Resume
            </a>
          </li>
        </ul>

        {/* Mobile Hamburger Section */}
        <button
          className="sm:hidden text-muted-foreground hover:text-foreground transition-colors"
          onClick={() => setMenuOpen((o) => !o)}
          aria-label="Toggle menu"
        >
          {menuOpen ? (
            <CloseIcon className="w-5 h-5" />
          ) : (
            <MenuIcon className="w-5 h-5" />
          )}
        </button>
      </div>

      {/* Mobile Menu Section */}
      {menuOpen && (
        <div className="sm:hidden bg-[#060d1f]/98 border-t border-border px-6 py-4">
          <ul className="flex flex-col gap-1">
            {navLinks.map(({ href, label }, i) => {
              const id = href.replace("/#", "").replace("/", "");
              const isActive = activeSection === id;
              return (
                <li key={href}>
                  <a
                    href={href}
                    onClick={() => setMenuOpen(false)}
                    className={`flex items-center gap-2 px-3 py-2 text-xs font-mono rounded transition-all ${
                      isActive
                        ? "text-primary bg-primary/5 border-l border-primary"
                        : "text-muted-foreground border-l border-transparent hover:text-foreground hover:border-border pl-3"
                    }`}
                  >
                    <span className="text-primary/40 text-[10px]">
                      0{i + 1}.
                    </span>
                    {label}
                  </a>
                </li>
              );
            })}
            <li className="mt-2 pt-2 border-t border-border/50">
              <a
                href={siteConfig.resume}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => setMenuOpen(false)}
                className="flex items-center justify-center gap-2 px-3 py-2.5 text-xs font-mono rounded text-primary border border-primary/20 bg-primary/5"
              >
                Resume.pdf
              </a>
            </li>
          </ul>
        </div>
      )}
    </nav>
  );
}
