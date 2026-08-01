import type { ReactNode } from "react";

/**
 * The availability status chip — ONE definition, shared by the Current Focus
 * and Contact sections.
 *
 * They were two hand-rolled pills that had drifted apart: a spinning conic
 * border on one and an emerald hairline on the other, `--card` fill vs an
 * `emerald-500/5` wash, `px-4 min-h-9` vs `px-3 py-1.5`, and a dot that pulsed
 * in one and sat still in the other. Same statement, two designs.
 *
 * Contrast: the old `text-emerald-500` scored ~2.5:1 on a near-white pill,
 * badly under AA. The semantic success pair now holds at least 5:1 in both
 * themes. The dot uses the same accessible foreground token so the only
 * element carrying the colour also clears the 3:1 required of meaningful
 * graphics.
 *
 * The fill is opaque on purpose. A translucent wash lets the ribbon field show
 * through, and the chip's contrast would then change as a band drifted under
 * it.
 */
export function StatusChip(props: { children: ReactNode; className?: string }) {
  const { children, className } = props;

  return (
    <span
      className={`inline-flex min-h-9 items-center gap-2 rounded-full border border-status-success/25 bg-status-success-surface px-4 font-mono text-[11px] text-status-success ${className ?? ""}`}
    >
      <span className="relative flex size-2" aria-hidden>
        <span className="absolute inline-flex size-full animate-ping rounded-full bg-status-success opacity-50 motion-reduce:animate-none" />
        <span className="relative inline-flex size-2 rounded-full bg-status-success" />
      </span>
      {children}
    </span>
  );
}
