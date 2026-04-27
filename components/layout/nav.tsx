"use client";

import { useState, useEffect } from "react";
import { navLinks, siteConfig } from "@/data/portfolio";

export default function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("");
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    const sectionIds = navLinks.map(({ href }) => href.replace("#", ""));

    // Scroll handler: background + active section detection
    const onScroll = () => {
      setScrolled(window.scrollY > 20);

      const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
      setScrollProgress(maxScroll > 0 ? (window.scrollY / maxScroll) * 100 : 0);

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
          ? "bg-slate-900/95 backdrop-blur-sm border-b border-slate-800 shadow-lg"
          : "bg-transparent"
      }`}
    >
      {/* Scroll progress bar */}
      <div
        className="absolute bottom-0 left-0 h-[2px] bg-gradient-to-r from-blue-500 to-indigo-400 transition-none z-[60] origin-left"
        style={{ width: `${scrollProgress}%` }}
      />
      <div className="max-w-5xl mx-auto px-6 py-4 flex items-center justify-between">
        <a
          href="#"
          className="text-white font-bold text-xl tracking-tight hover:text-blue-400 transition-colors"
        >
          {siteConfig.name
            .split(" ")
            .map((n) => n[0])
            .join("")}
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
                    isActive ? "text-white" : "text-slate-400 hover:text-slate-200"
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
          className="sm:hidden text-slate-400 hover:text-white transition-colors"
          onClick={() => setMenuOpen((o) => !o)}
          aria-label="Toggle menu"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            {menuOpen ? (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            )}
          </svg>
        </button>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="sm:hidden bg-slate-900/98 border-t border-slate-800 px-6 py-4">
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
                        ? "text-white border-blue-400 pl-4"
                        : "text-slate-400 border-transparent hover:text-white hover:border-slate-600"
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
