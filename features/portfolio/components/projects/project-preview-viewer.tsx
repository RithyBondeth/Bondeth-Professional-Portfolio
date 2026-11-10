"use client";

import Image from "next/image";
import { Maximize2, X } from "lucide-react";
import { useRef, useState } from "react";

export function ProjectPreviewViewer({
  src,
  title,
  openLabel,
  closeLabel,
}: {
  src: string;
  title: string;
  openLabel: string;
  closeLabel: string;
}) {
  const dialog = useRef<HTMLDialogElement>(null);
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button
        type="button"
        aria-haspopup="dialog"
        aria-label={`${openLabel}: ${title}`}
        title={openLabel}
        onClick={() => {
          dialog.current?.showModal();
          setIsOpen(true);
        }}
        className="group/expand absolute inset-0 z-10 cursor-zoom-in focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-primary"
      >
        <span className="absolute bottom-3 right-3 grid size-11 place-items-center rounded-lg border border-white/25 bg-black/75 text-white group-hover/expand:bg-black">
          <Maximize2 aria-hidden size={18} />
        </span>
      </button>
      <dialog
        ref={dialog}
        aria-label={`${openLabel}: ${title}`}
        onClose={() => setIsOpen(false)}
        className="fixed inset-0 m-0 h-dvh max-h-none w-full max-w-none overscroll-contain overflow-hidden bg-neutral-950 text-white backdrop:bg-neutral-950"
      >
        <div className="grid h-full grid-rows-[auto_minmax(0,1fr)]">
          <div className="flex items-center justify-between gap-4 px-4 py-2 sm:px-6">
            <h2 className="text-sm font-semibold sm:text-base">{title}</h2>
            <button
              type="button"
              aria-label={closeLabel}
              title={closeLabel}
              onClick={() => dialog.current?.close()}
              className="grid size-11 shrink-0 place-items-center rounded-lg border border-white/25 hover:bg-white/10 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
            >
              <X aria-hidden size={20} />
            </button>
          </div>
          {isOpen && (
            <div className="relative mx-2 mb-2 sm:mx-5 sm:mb-5">
              <Image
                src={src}
                alt={title}
                fill
                unoptimized
                loading="eager"
                className="object-contain"
              />
            </div>
          )}
        </div>
      </dialog>
    </>
  );
}
