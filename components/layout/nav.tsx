"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { navLinks, siteConfig } from "@/data/portfolio";
import { MenuIcon, CloseIcon } from "@/components/ui/icons";

export default function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("");

  useEffect(() => {
    const sectionIds = navLinks.map(({ href }) => href.replace("#", ""));

    // Scroll handler: background + active section detection
    const onScroll = () => {
      setScrolled(window.scrollY > 20);

      // Active = the last section whose top is above 35% of viewport height
      const threshold = window.innerHeight * 0.35;
      let current = "";
      for (const id of sectionIds) {
        const el = document.getElementById(id);
        if (!el) continue;
        if (el.getBoundingClientRect().top <= threshold) {
          current = id;
        }
      }
      setActiveSection(current);
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll(); // run once on mount
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-background/95 backdrop-blur-sm border-b border-border shadow-lg"
          : "bg-transparent"
      }`}
    >
      <div className="max-w-5xl mx-auto px-6 py-4 flex items-center justify-between">
        <a href="#" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
          <Image
            src="/logo.webp"
            alt={siteConfig.name}
            width={36}
            height={36}
            className="rounded-full"
          />
          <span className="text-foreground font-bold text-base tracking-tight hidden sm:block">
            {siteConfig.name}
          </span>
        </a>

        {/* Desktop links */}
        <ul className="hidden sm:flex items-center gap-6">
          {navLinks.map(({ href, label }) => {
            const id = href.replace("#", "");
            const isActive = activeSection === id;
            return (
              <li key={href}>
                <a
                  href={href}
                  className={`relative py-1 text-sm font-medium transition-colors duration-200 ${
                    isActive
                      ? "text-foreground"
                      : "text-muted-foreground hover:text-primary-foreground"
                  }`}
                >
                  {label}
                  {/* Sliding underline */}
                  <span
                    className={`absolute -bottom-0.5 left-0 h-px bg-blue-400 transition-all duration-300 ${
                      isActive ? "w-full opacity-100" : "w-0 opacity-0"
                    }`}
                  />
                </a>
              </li>
            );
          })}
        </ul>

        {/* Mobile hamburger */}
        <button
          className="sm:hidden text-muted-foreground hover:text-foreground transition-colors"
          onClick={() => setMenuOpen((o) => !o)}
          aria-label="Toggle menu"
        >
          {menuOpen ? (
            <CloseIcon className="w-6 h-6" />
          ) : (
            <MenuIcon className="w-6 h-6" />
          )}
        </button>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="sm:hidden bg-background/98 border-t border-border px-6 py-4">
          <ul className="flex flex-col">
            {navLinks.map(({ href, label }) => {
              const id = href.replace("#", "");
              const isActive = activeSection === id;
              return (
                <li key={href}>
                  <a
                    href={href}
                    onClick={() => setMenuOpen(false)}
                    className={`block px-3 py-2.5 text-sm font-medium border-l-2 transition-all ${
                      isActive
                        ? "text-foreground border-blue-400 pl-4"
                        : "text-muted-foreground border-transparent hover:text-foreground hover:border-slate-600"
                    }`}
                  >
                    {label}
                  </a>
                </li>
              );
            })}
          </ul>
        </div>
      )}
    </nav>
  );
}
