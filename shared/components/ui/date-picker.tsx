"use client";

import * as Popover from "@radix-ui/react-popover";
import { DayPicker } from "@daypicker/react";
import { enUS } from "@daypicker/react/locale/en-US";
import { km } from "@daypicker/react/locale/km";
import { CalendarDays, ChevronLeft, ChevronRight } from "lucide-react";
import { useState } from "react";
import {
  calendarDateFromISO,
  calendarDateToISO,
} from "@/shared/lib/calendar-date";

function CalendarChevron({
  orientation,
}: {
  orientation?: "left" | "right" | "up" | "down";
}) {
  const Icon = orientation === "left" ? ChevronLeft : ChevronRight;
  return <Icon aria-hidden className="size-4" />;
}

const calendarComponents = { Chevron: CalendarChevron };
const navigationButton =
  "grid size-11 shrink-0 place-items-center rounded-lg border border-border/60 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary disabled:pointer-events-none disabled:opacity-30 aria-disabled:opacity-30";

/** A bounded calendar with shared typography, colors and focus behavior. */
export function DatePicker({
  value,
  min,
  max,
  label,
  displayValue = value,
  locale = "en-US",
  onValueChange,
}: {
  value: string;
  min: string;
  max: string;
  label: string;
  displayValue?: string;
  locale?: string;
  onValueChange: (value: string) => void;
}) {
  const [open, setOpen] = useState(false);
  const selected = calendarDateFromISO(value);
  const firstDay = calendarDateFromISO(min);
  const lastDay = calendarDateFromISO(max);

  return (
    <Popover.Root open={open} onOpenChange={setOpen}>
      <Popover.Trigger asChild>
        <button
          type="button"
          aria-label={`${label}: ${displayValue}`}
          className="inline-flex min-h-11 items-center justify-between gap-2.5 rounded-lg border border-border/70 bg-background px-3 text-sm text-foreground shadow-sm transition-[border-color,background-color,box-shadow] hover:border-primary/40 hover:bg-card focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary data-[state=open]:border-primary/60 data-[state=open]:ring-2 data-[state=open]:ring-primary/10"
        >
          <span className="whitespace-nowrap tabular-nums">{displayValue}</span>
          <CalendarDays
            aria-hidden
            className="size-4 shrink-0 text-muted-foreground"
          />
        </button>
      </Popover.Trigger>
      <Popover.Portal>
        <Popover.Content
          aria-label={label}
          align="end"
          sideOffset={8}
          collisionPadding={12}
          className="z-[120] max-h-[var(--radix-popover-content-available-height)] w-[min(22rem,calc(100vw-1.5rem))] overflow-y-auto rounded-xl border border-border bg-popover p-3 font-sans text-popover-foreground shadow-[0_12px_36px_-12px_rgb(0_0_0/0.24)] motion-safe:data-[state=open]:animate-in motion-safe:data-[state=open]:fade-in-0 motion-safe:data-[state=open]:slide-in-from-top-1"
        >
          <DayPicker
            mode="single"
            required
            autoFocus
            selected={selected}
            defaultMonth={selected}
            startMonth={firstDay}
            endMonth={lastDay}
            disabled={[{ before: firstDay }, { after: lastDay }]}
            onSelect={(date) => {
              onValueChange(calendarDateToISO(date));
              setOpen(false);
            }}
            locale={locale.startsWith("km") ? km : enUS}
            weekStartsOn={1}
            navLayout="after"
            showOutsideDays
            fixedWeeks
            components={calendarComponents}
            classNames={{
              root: "w-full",
              months: "relative",
              month: "space-y-2",
              month_caption: "flex min-h-11 items-center pl-1 pr-24",
              caption_label: "text-sm font-semibold text-foreground",
              nav: "absolute right-0 top-0 flex items-center gap-1",
              button_previous: navigationButton,
              button_next: navigationButton,
              month_grid:
                "w-full table-fixed border-separate border-spacing-x-0 border-spacing-y-1",
              weekday:
                "h-9 text-center text-xs font-medium text-muted-foreground",
              day: "p-0 text-center text-sm",
              day_button:
                "mx-auto grid h-11 w-full max-w-11 place-items-center rounded-lg text-sm tabular-nums text-foreground outline-none transition-colors hover:bg-primary/10 focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-primary disabled:cursor-not-allowed",
              selected:
                "[&_button]:bg-primary-fill [&_button]:font-semibold [&_button]:text-primary-foreground",
              today:
                "[&_button]:ring-1 [&_button]:ring-inset [&_button]:ring-primary/50",
              outside: "opacity-40",
              disabled: "pointer-events-none opacity-30",
              hidden: "invisible",
            }}
          />
        </Popover.Content>
      </Popover.Portal>
    </Popover.Root>
  );
}
