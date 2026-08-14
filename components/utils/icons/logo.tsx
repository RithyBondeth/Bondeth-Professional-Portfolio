import { cn } from "@/lib/utils";

/* ---------------------------------- Logo ----------------------------------- */
const PIXEL_B_PATH =
  "M0 0H144V18H176V44H200V108H176V134H144V144H176V166H200V230H176V256H144V274H0V0ZM44 42V108H132V92H156V58H132V42H44ZM44 166V232H132V216H156V182H132V166H44ZM176 24H200V44H176V24Z";

export function LogoMark({ className }: { className?: string }) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 200 274"
      className={cn("h-8 w-auto shrink-0", className)}
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d={PIXEL_B_PATH}
        fill="currentColor"
        fillRule="evenodd"
        className="text-foreground"
      />
      <rect x="176" width="24" height="24" className="fill-brand-pixel" />
    </svg>
  );
}

function PixelTrail() {
  return (
    <span aria-hidden="true" className="mt-0.5 flex h-1 items-center gap-1">
      <span className="h-1 w-4 bg-brand-pixel" />
      <span className="h-1 w-2.5 bg-muted-foreground/70" />
      <span className="h-1 w-1.5 bg-muted-foreground/45" />
      <span className="size-1 bg-muted-foreground/25" />
    </span>
  );
}

export function Logo({ className }: { className?: string }) {
  return (
    <span
      aria-hidden="true"
      className={cn(
        "inline-flex items-center gap-1.5 whitespace-nowrap select-none",
        className,
      )}
    >
      <LogoMark />
      <span className="flex flex-col leading-none">
        <span className="font-sans text-base font-bold tracking-[-0.045em] text-foreground">
          Bondeth
        </span>
        <PixelTrail />
      </span>
    </span>
  );
}
