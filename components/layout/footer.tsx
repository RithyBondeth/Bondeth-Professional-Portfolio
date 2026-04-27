import { siteConfig } from "@/data/portfolio";

export default function Footer() {
  return (
    <footer className="bg-slate-900 border-t border-slate-800 py-8 px-6">
      <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
        <p className="text-slate-500 text-sm">
          Designed &amp; built by{" "}
          <span className="text-slate-400">{siteConfig.name}</span>
        </p>
        <p className="text-slate-600 text-xs font-mono">
          {new Date().getFullYear()}
        </p>
      </div>
    </footer>
  );
}
