"use client";

import { useState } from "react";
import Image from "next/image";
import { Play } from "lucide-react";
import type { IVideo } from "@/utils/interfaces/portfolio";

/**
 * Click-to-load YouTube embed.
 *
 * The real iframe pulls ~1MB of player JS and a pile of third-party cookies, on
 * the landing page, for a video most visitors won't play. So the card ships a
 * self-hosted poster and only mounts the iframe once someone actually presses
 * play — and then with `autoplay=1`, since the press was the play intent.
 *
 * nocookie.com is the privacy-preserving host: same player, no tracking cookie
 * until playback starts.
 */
export function VideoFacade(props: {
  video: IVideo;
  title: string;
  playLabel: string;
}) {
  /* ---------------------------------- Props --------------------------------- */
  const { video, title, playLabel } = props;

  /* ---------------------------------- State --------------------------------- */
  const [playing, setPlaying] = useState(false);

  /* -------------------------------- Render UI ------------------------------- */
  return (
    <div className="relative aspect-video w-full overflow-hidden rounded-lg border border-border/60 bg-background/70">
      {playing ? (
        <iframe
          src={`https://www.youtube-nocookie.com/embed/${video.id}?autoplay=1&rel=0`}
          title={title}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          className="absolute inset-0 size-full"
        />
      ) : (
        <button
          type="button"
          onClick={() => setPlaying(true)}
          aria-label={`${playLabel}: ${title}`}
          className="group absolute inset-0 size-full cursor-pointer"
        >
          <Image
            src={video.thumbnail}
            alt=""
            fill
            sizes="(min-width: 1024px) 640px, 100vw"
            className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
          />
          <span className="absolute inset-0 bg-gradient-to-t from-background/80 via-background/10 to-transparent" />
          <span className="absolute inset-0 flex items-center justify-center">
            <span className="flex size-16 items-center justify-center rounded-full border border-primary/40 bg-background/80 backdrop-blur-sm transition-colors group-hover:border-primary group-hover:bg-primary-fill">
              <Play
                aria-hidden
                className="ml-0.5 size-6 fill-primary text-primary transition-colors group-hover:fill-primary-foreground group-hover:text-primary-foreground"
              />
            </span>
          </span>
        </button>
      )}
    </div>
  );
}
