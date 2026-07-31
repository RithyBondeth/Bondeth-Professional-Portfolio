import Link from "next/link";
import type { Metadata } from "next";
import { Container } from "@/components/ui/section";
import { siteConfig } from "@/utils/constants/portfolio.constant";

export const metadata: Metadata = {
  title: "404 — Page Not Found",
  description: "The page you are looking for does not exist.",
};

/**
 * not-found boundaries receive no route params, so this page is bilingual and
 * links back to the locale root (the proxy resolves "/" to the right locale).
 *
 * The glitching, glowing, RGB-split "404" is gone — an error page is the one
 * place a reader is already unsettled, and animating the number at them is
 * decoration where they wanted an exit. The number is now just set large, in
 * the display face, like a chapter that isn't there.
 */
export default function NotFound() {
  return (
    <main id="main-content" tabIndex={-1} className="flex flex-1 items-center">
      <Container>
        <div className="grid gap-x-10 gap-y-8 py-32 lg:grid-cols-12">
          <p className="display-xl leading-none text-muted-foreground lg:col-span-4">
            404
          </p>

          <div className="lg:col-span-7 lg:col-start-6">
            <h1 className="display-md text-balance">
              Looks like you&apos;re lost
            </h1>

            <p className="measure mt-6 leading-relaxed text-muted-foreground">
              The page you&apos;re looking for doesn&apos;t exist or has been
              moved.
            </p>
            <p className="measure mt-3 leading-relaxed text-muted-foreground">
              ទំព័រដែលអ្នកកំពុងស្វែងរកមិនមានទេ ឬត្រូវបានផ្លាស់ទី។
            </p>

            <Link href="/" className="btn-fx link-wipe mt-10 inline-block">
              <span aria-hidden className="mr-2">
                ←
              </span>
              Back to home · ត្រឡប់ទៅទំព័រដើម
            </Link>

            <p className="eyebrow mt-16">{siteConfig.fullName}</p>
          </div>
        </div>
      </Container>
    </main>
  );
}
