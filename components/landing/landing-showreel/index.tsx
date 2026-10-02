"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, Play, X } from "lucide-react";
import { useReducedMotion } from "@/components/utils/animations/use-motion";
import type { TLocale } from "@/utils/i18n";

const caseStudies = [
  { slug: "apsara-talent", name: "Apsara Talent" },
  { slug: "apsara-assistant", name: "Apsara Assistant" },
  { slug: "apsara-agentic", name: "Apsara Agentic" },
  { slug: "apsara-elearning", name: "Apsara Elearning" },
  { slug: "apsara-wallet", name: "Apsara Wallet" },
  { slug: "romlerk", name: "Romlerk" },
  { slug: "bondex-notch", name: "Bondex Notch" },
];

const poster = "/thumbnails/portfolio-showreel-v7-poster.png";

export default function LandingShowreel({ lang }: { lang: TLocale }) {
  const khmer = lang === "km";
  const reducedMotion = useReducedMotion();
  const stageRef = useRef<HTMLDivElement>(null);
  const teaserRef = useRef<HTMLVideoElement>(null);
  const filmRef = useRef<HTMLVideoElement>(null);
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [desktop, setDesktop] = useState(false);
  const [visible, setVisible] = useState(false);
  const [filmOpen, setFilmOpen] = useState(false);

  useEffect(() => {
    const media = window.matchMedia("(min-width: 768px)");
    const update = () => setDesktop(media.matches);
    update();
    media.addEventListener("change", update);
    return () => media.removeEventListener("change", update);
  }, []);

  useEffect(() => {
    const stage = stageRef.current;
    if (!stage) return;
    let frame = 0;
    const update = () => {
      if (frame) return;
      frame = window.requestAnimationFrame(() => {
        frame = 0;
        const { top, bottom, height } = stage.getBoundingClientRect();
        const overlap = Math.min(bottom, window.innerHeight) - Math.max(top, 0);
        setVisible(overlap >= height * 0.25);
      });
    };
    update();
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    return () => {
      window.cancelAnimationFrame(frame);
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, []);

  // The preview is decorative. Never request it on mobile or for visitors who
  // prefer reduced motion, and pause it when the page or film is out of view.
  const previewEnabled = desktop && !reducedMotion && visible;
  useEffect(() => {
    const teaser = teaserRef.current;
    if (!teaser) return;
    const syncPlayback = () => {
      if (document.hidden || filmOpen) {
        teaser.pause();
      } else {
        void teaser.play().catch(() => {
          // A blocked autoplay still leaves the poster and play button usable.
        });
      }
    };
    syncPlayback();
    document.addEventListener("visibilitychange", syncPlayback);
    return () => {
      document.removeEventListener("visibilitychange", syncPlayback);
      teaser.pause();
    };
  }, [previewEnabled, filmOpen]);

  const openFilm = () => {
    const dialog = dialogRef.current;
    if (!dialog || dialog.open) return;
    teaserRef.current?.pause();
    dialog.showModal();
    setFilmOpen(true);
    void filmRef.current?.play().catch(() => {
      // Native video controls remain available if playback needs another tap.
    });
  };

  const closeFilm = () => dialogRef.current?.close();

  return (
    <section
      id="showreel"
      aria-labelledby="showreel-heading"
      className="relative px-4 py-16 sm:px-6 sm:py-20"
    >
      <div className="mx-auto max-w-[90rem]">
        <div className="mb-7 flex flex-col gap-3 md:mb-9 md:flex-row md:items-end md:justify-between md:gap-10">
          <div>
            <p className="font-mono text-xs uppercase tracking-[0.2em] text-primary">
              {khmer ? "វីដេអូណែនាំ ៣០ វិនាទី" : "A 30-second introduction"}
            </p>
            <h2
              id="showreel-heading"
              className="mt-3 text-3xl font-semibold tracking-tight text-foreground sm:text-4xl lg:text-5xl"
            >
              {khmer ? "រឿងរ៉ាវរបស់ខ្ញុំ ក្នុងចលនា។" : "My story, in motion."}
            </h2>
          </div>
          <p className="max-w-md text-sm leading-7 text-field-muted-foreground md:text-right">
            {khmer
              ? "ស្គាល់ខ្ញុំ អ្វីដែលខ្ញុំបង្កើត បច្ចេកវិទ្យាដែលខ្ញុំប្រើ និងគម្រោងដែលបង្ហាញពីស្នាដៃរបស់ខ្ញុំ។"
              : "Who I am, what I build, the technologies I use, and the projects that bring it all together."}
          </p>
        </div>

        <div
          ref={stageRef}
          className="group relative aspect-video overflow-hidden rounded-xl border border-border/70 bg-card shadow-[0_24px_80px_rgb(0_0_0/.13)] sm:rounded-2xl"
        >
          <Image
            src={poster}
            alt=""
            fill
            sizes="(max-width: 1440px) 100vw, 1440px"
            className="object-cover"
          />
          {previewEnabled && (
            <video
              ref={teaserRef}
              muted
              loop
              playsInline
              preload="none"
              poster={poster}
              src="/videos/portfolio-showreel-teaser.mp4?v=1080p"
              aria-hidden="true"
              className="absolute inset-0 size-full object-cover"
            />
          )}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 bg-linear-to-t from-black/45 via-transparent to-black/10"
          />
          <button
            type="button"
            onClick={openFilm}
            aria-label={khmer ? "ចាក់វីដេអូណែនាំ ៣០ វិនាទី" : "Play the 30-second showreel"}
            className="absolute inset-0 flex items-center justify-center focus-visible:outline-4 focus-visible:outline-offset-[-4px] focus-visible:outline-primary"
          >
            <span className="flex items-center gap-3 rounded-full border border-white/45 bg-black/55 py-2.5 pr-5 pl-2.5 text-sm font-semibold text-white shadow-[0_18px_50px_rgb(0_0_0/.3)] backdrop-blur-md transition duration-300 group-hover:scale-105 group-hover:bg-black/70 motion-reduce:transition-none sm:gap-4 sm:py-3 sm:pr-6 sm:pl-3 sm:text-base">
              <span className="flex size-9 items-center justify-center rounded-full bg-primary-fill text-primary-foreground sm:size-11">
                <Play size={18} fill="currentColor" aria-hidden="true" />
              </span>
              {khmer ? "ទស្សនាវីដេអូ" : "Watch the film"}
              <span className="font-mono text-xs font-normal text-white/70">00:30</span>
            </span>
          </button>
          <span className="pointer-events-none absolute bottom-4 left-4 rounded-full border border-white/25 bg-black/45 px-3 py-1.5 font-mono text-[10px] uppercase tracking-[.16em] text-white/90 backdrop-blur-sm sm:bottom-6 sm:left-6">
            {khmer ? "វីដេអូណែនាំ · ២០២៦" : "Showreel · 2026"}
          </span>
        </div>

        <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <p className="text-xs leading-5 text-muted-foreground">
            {khmer
              ? "៣០ វិនាទី · 1080p / 120 fps · តន្ត្រីដើម និងចំណងជើងរងជាភាសាខ្មែរ"
              : "30 seconds · 1080p / 120 fps · Original instrumental soundtrack"}
          </p>
          <Link
            href={`/${lang}/#projects`}
            className="inline-flex min-h-11 items-center gap-2 self-start text-sm font-semibold text-primary hover:underline"
          >
            {khmer ? "ស្វែងយល់ពីគម្រោងរបស់ខ្ញុំ" : "Explore the projects"}
            <ArrowUpRight aria-hidden size={16} />
          </Link>
        </div>
        <nav
          aria-label={khmer ? "គម្រោងក្នុងវីដេអូ" : "Projects featured in the video"}
          className="flex flex-wrap gap-x-5 gap-y-1 border-t border-border/60 pt-3"
        >
          {caseStudies.map(({ slug, name }) => (
            <Link
              key={slug}
              href={`/${lang}/projects/${slug}`}
              className="inline-flex min-h-10 items-center gap-1.5 text-xs font-medium text-foreground hover:text-primary hover:underline"
            >
              {name}
              <ArrowUpRight aria-hidden size={13} />
            </Link>
          ))}
        </nav>
        <details className="mt-2 max-w-4xl text-xs leading-6 text-muted-foreground">
          <summary className="w-fit cursor-pointer rounded-sm focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary">
            {khmer ? "អានសេចក្ដីសង្ខេបវីដេអូ" : "Read the video summary"}
          </summary>
          <p className="mt-2">
            {khmer
              ? "វីដេអូមានបួនផ្នែក៖ ស្គាល់ Rithy Bondeth អ្នកអភិវឌ្ឍ Full Stack និងវិស្វករ AI នៅភ្នំពេញដែលមានបទពិសោធន៍ជាង ៣ ឆ្នាំ; អ្វីដែលខ្ញុំធ្វើលើគេហទំព័រ កម្មវិធីទូរស័ព្ទ និងប្រព័ន្ធ AI; បច្ចេកវិទ្យាដែលខ្ញុំប្រើ; និងស្នាដៃក្នុងគម្រោងចំនួន ៧។ គម្រោងដែលបង្ហាញមាន Apsara Talent, Apsara Assistant, Apsara Agentic, Apsara Elearning, Apsara Wallet, Romlerk និង Bondex Notch។ រូបភាពថ្មីនៃគម្រោងនីមួយៗបំពេញស៊ុម ហើយចលនាបន្ទាត់ និងរាងធរណីមាត្រភ្ជាប់ពីគម្រោងមួយទៅគម្រោងបន្ទាប់។ វីដេអូមានតន្ត្រីដើម ដោយគ្មានការនិយាយ។"
              : "The video follows four chapters: who I am—Rithy Bondeth, a Full Stack Developer and AI Engineer in Phnom Penh with 3+ years of experience; what I do—build web platforms, mobile apps, and AI systems; technologies I use; and proof in seven projects. It features Apsara Talent, Apsara Assistant, Apsara Agentic, Apsara Elearning, Apsara Wallet, Romlerk, and Bondex Notch. New project previews fill their frames, while moving lines and shapes connect each project. The soundtrack is original and instrumental, without narration."}
          </p>
        </details>
      </div>

      <dialog
        ref={dialogRef}
        aria-label={khmer ? "វីដេអូណែនាំរបស់ Bondeth" : "Bondeth's portfolio film"}
        onClick={(event) => {
          if (event.target === event.currentTarget) closeFilm();
        }}
        onClose={() => {
          filmRef.current?.pause();
          if (filmRef.current) filmRef.current.currentTime = 0;
          setFilmOpen(false);
        }}
        className="fixed inset-0 m-auto w-[min(96vw,1200px)] max-w-none overflow-visible rounded-xl border border-white/15 bg-black p-0 text-white shadow-[0_30px_100px_rgb(0_0_0/.5)] backdrop:bg-black/85 sm:rounded-2xl"
      >
        <button
          type="button"
          onClick={closeFilm}
          aria-label={khmer ? "បិទវីដេអូ" : "Close video"}
          className="absolute top-3 right-3 z-10 flex size-10 items-center justify-center rounded-full border border-white/30 bg-black/70 text-white hover:bg-black focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary sm:top-4 sm:right-4"
        >
          <X size={20} aria-hidden="true" />
        </button>
        <video
          ref={filmRef}
          controls
          playsInline
          preload="none"
          width={1920}
          height={1080}
          poster={poster}
          aria-label={
            khmer
              ? "វីដេអូណែនាំ Bondeth៖ បទពិសោធន៍ ជំនាញ និងគម្រោងចំនួន ៧"
              : "Meet Bondeth: experience, technologies, and seven projects"
          }
          aria-describedby="showreel-summary"
          className="aspect-video w-full rounded-xl bg-black sm:rounded-2xl"
        >
          <source src="/videos/portfolio-showreel-v7.mp4" type="video/mp4" />
          <track
            kind="subtitles"
            src="/videos/portfolio-showreel-v7.en.vtt"
            srcLang="en"
            label="English"
          />
          <track
            kind="subtitles"
            src="/videos/portfolio-showreel-v7.km.vtt"
            srcLang="km"
            label="ខ្មែរ"
            default={khmer}
          />
          <a href="/videos/portfolio-showreel-v7.mp4">
            {khmer ? "ទាញយកវីដេអូ" : "Download the showreel"}
          </a>
        </video>
        <span id="showreel-summary" className="sr-only">
          {khmer
            ? "វីដេអូអំពី Bondeth អ្វីដែលគាត់ធ្វើ បច្ចេកវិទ្យាដែលគាត់ប្រើ និងគម្រោងចំនួន ៧។"
            : "A film about Bondeth, what he builds, the technologies he uses, and seven featured projects."}
        </span>
      </dialog>
    </section>
  );
}
