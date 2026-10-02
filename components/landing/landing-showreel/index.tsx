import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import type { TLocale } from "@/utils/i18n";

export default function LandingShowreel({ lang }: { lang: TLocale }) {
  const khmer = lang === "km";
  const caseStudies = [
    { slug: "apsara-talent", name: "Apsara Talent" },
    { slug: "apsara-assistant", name: "Apsara Assistant" },
    { slug: "apsara-agentic", name: "Apsara Agentic" },
    { slug: "apsara-elearning", name: "Apsara Elearning" },
    { slug: "apsara-wallet", name: "Apsara Wallet" },
    { slug: "bondex-notch", name: "Bondex Notch" },
  ];

  return (
    <section
      id="showreel"
      aria-labelledby="showreel-heading"
      className="relative px-6 py-16 sm:py-20"
    >
      <div className="mx-auto grid max-w-6xl items-center gap-8 lg:grid-cols-[0.7fr_1.3fr] lg:gap-12">
        <div>
          <p className="font-mono text-xs uppercase tracking-[0.2em] text-primary">
            {khmer ? "វីដេអូណែនាំ ៣០ វិនាទី" : "A 30-second introduction"}
          </p>
          <h2
            id="showreel-heading"
            className="mt-3 text-3xl font-semibold tracking-tight text-foreground sm:text-4xl"
          >
            {khmer
              ? "ស្គាល់ខ្ញុំ និងអ្វីដែលខ្ញុំបង្កើត។"
              : "Who I am. What I build."}
          </h2>
          <p className="mt-4 text-sm leading-7 text-field-muted-foreground">
            {khmer
              ? "ស្គាល់ខ្ញុំ ស្វែងយល់អ្វីដែលខ្ញុំធ្វើ បច្ចេកវិទ្យាដែលខ្ញុំប្រើ និងស្នាដៃជាក់ស្ដែងរបស់ខ្ញុំ ក្នុងរយៈពេល ៣០ វិនាទី។"
              : "Meet me, see what I build, explore the technologies I use, and discover the projects that prove it—all in 30 seconds."}
          </p>
          <Link
            href={`/${lang}/#projects`}
            className="mt-5 inline-flex min-h-11 items-center gap-2 text-sm font-semibold text-primary hover:underline"
          >
            {khmer
              ? "ស្វែងយល់ពីករណីសិក្សារបស់ខ្ញុំ"
              : "Explore the case studies"}
            <ArrowUpRight aria-hidden size={16} />
          </Link>
        </div>

        <figure className="min-w-0">
          <video
            controls
            playsInline
            preload="none"
            width={1920}
            height={1080}
            poster="/thumbnails/portfolio-showreel-v6-poster.png"
            aria-label={
              khmer
                ? "វីដេអូណែនាំ Bondeth៖ បទពិសោធន៍ ជំនាញ និងករណីសិក្សាចំនួន ៦"
                : "Meet Bondeth: experience, technologies, and six case studies"
            }
            aria-describedby="showreel-caption"
            className="aspect-video w-full rounded-lg border border-border/60 bg-background shadow-sm"
          >
            <source src="/videos/portfolio-showreel-v6.mp4" type="video/mp4" />
            <track
              kind="subtitles"
              src="/videos/portfolio-showreel-v6.en.vtt"
              srcLang="en"
              label="English"
            />
            <track
              kind="subtitles"
              src="/videos/portfolio-showreel-v6.km.vtt"
              srcLang="km"
              label="ខ្មែរ"
              default={khmer}
            />
            <a href="/videos/portfolio-showreel-v6.mp4">
              {khmer ? "ទាញយកវីដេអូ" : "Download the showreel"}
            </a>
          </video>
          <figcaption
            id="showreel-caption"
            className="mt-3 text-xs leading-5 text-muted-foreground"
          >
            {khmer
              ? "៣០ វិនាទី · 1080p / 120 fps · តន្ត្រីដើម និងចំណងជើងរងជាភាសាខ្មែរ"
              : "30 seconds · 1080p / 120 fps · Original instrumental soundtrack"}
          </figcaption>
          <nav
            aria-label={
              khmer
                ? "ករណីសិក្សាក្នុងវីដេអូ"
                : "Case studies featured in the video"
            }
            className="mt-3 flex flex-wrap gap-x-5 gap-y-1"
          >
            {caseStudies.map(({ slug, name }) => (
              <Link
                key={slug}
                href={`/${lang}/projects/${slug}`}
                className="inline-flex min-h-11 items-center gap-1.5 text-xs font-medium text-foreground hover:text-primary hover:underline"
              >
                {name}
                <ArrowUpRight aria-hidden size={13} />
              </Link>
            ))}
          </nav>
          <details className="mt-2 text-xs leading-6 text-muted-foreground">
            <summary className="w-fit cursor-pointer rounded-sm focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary">
              {khmer ? "អានសេចក្ដីសង្ខេបវីដេអូ" : "Read the video summary"}
            </summary>
            <p className="mt-2">
              {khmer
                ? "វីដេអូមានបួនផ្នែក៖ ស្គាល់ Rithy Bondeth អ្នកអភិវឌ្ឍ Full Stack និងវិស្វករ AI នៅភ្នំពេញដែលមានបទពិសោធន៍ជាង ៣ ឆ្នាំ; អ្វីដែលខ្ញុំធ្វើក្នុងគេហទំព័រ កម្មវិធីទូរស័ព្ទ និងប្រព័ន្ធ AI; បច្ចេកវិទ្យាដែលខ្ញុំប្រើ; និងភស្តុតាងក្នុងគម្រោងចំនួន ៦។ Apsara Talent ប្រើការផ្គូផ្គងតាមអត្ថន័យ និងសេវា backend ចំនួន ៧។ Apsara Assistant គាំទ្រភាសា ៣ របៀបតាម Messenger និង Telegram។ Apsara Agentic មានការធ្វើតេស្តស្វ័យប្រវត្តិ ៤២៤។ Apsara Elearning ជួយសិស្សថ្នាក់ទី ១ ដល់ ១២ និងថ្នាក់សាកលវិទ្យាល័យ។ Apsara Wallet គ្រប់គ្រងប្រាក់រៀល និងដុល្លារក្នុងបញ្ជីតែមួយ។ Bondex Notch បន្ថយការប្រើ CPU ពី ១២–១៤% មក ៣% ក្នុងការវាស់ពេលចាក់តន្ត្រី។ រូបភាពគម្រោងពេញស៊ុម ក្រោយឆាកមានចលនាអក្សរ ASCII ហើយវីដេអូមានតន្ត្រីដើមដោយគ្មានការនិយាយ។"
                : "The video follows four chapters: who I am—Rithy Bondeth, a Full Stack Developer and AI Engineer in Phnom Penh with 3+ years of experience; what I do—build web platforms, mobile apps, and AI systems; technologies I use; and proof in six projects. Apsara Talent uses semantic matching and seven backend services. Apsara Assistant handles three language modes across Messenger and Telegram. Apsara Agentic has 424 automated tests. Apsara Elearning serves Grades 1–12 and university with a lesson-grounded AI tutor. Apsara Wallet keeps riel and dollars in one ledger. Bondex Notch reduced measured CPU use from 12–14% to 3% while music plays. Project screenshots fill their frames, with animated ASCII in the background and an original instrumental score without narration."}
            </p>
          </details>
        </figure>
      </div>
    </section>
  );
}
