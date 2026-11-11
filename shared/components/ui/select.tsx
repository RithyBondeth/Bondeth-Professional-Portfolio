"use client";

import * as SelectPrimitive from "@radix-ui/react-select";
import { Check, ChevronDown, ChevronUp } from "lucide-react";
import { useId } from "react";
import { cn } from "@/shared/lib/utils";

interface SelectOption {
  value: string;
  label: string;
  disabled?: boolean;
}

/** Shared, themed menus with keyboard navigation, typeahead and touch support. */
export function Select({
  id,
  name,
  value,
  onValueChange,
  options,
  placeholder,
  ariaLabel,
  className,
  compact = false,
  disabled = false,
}: {
  id?: string;
  name?: string;
  value: string;
  onValueChange: (value: string) => void;
  options: readonly SelectOption[];
  placeholder?: string;
  ariaLabel?: string;
  className?: string;
  compact?: boolean;
  disabled?: boolean;
}) {
  const generatedId = useId();
  const selected = options.find((option) => option.value === value);
  // Radix reserves an empty value for its placeholder. Encoding every option
  // lets filters offer a selectable "All" whose domain value is still "".
  const encode = (optionValue: string) => `value:${optionValue}`;

  return (
    <>
      {/* Keep form data in domain values rather than the menu's encoded keys. */}
      {name && (
        <input type="hidden" name={name} value={value} disabled={disabled} />
      )}
      <SelectPrimitive.Root
        value={selected ? encode(value) : ""}
        onValueChange={(next) => {
          const option = options.find((item) => encode(item.value) === next);
          if (option) onValueChange(option.value);
        }}
        disabled={disabled}
      >
        <SelectPrimitive.Trigger
          id={id ?? generatedId}
          aria-label={ariaLabel}
          className={cn(
            "group/select flex w-full min-w-0 cursor-pointer items-center justify-between gap-3 rounded-lg border border-border/70 bg-background px-3.5 text-left text-sm text-foreground shadow-sm transition-[border-color,box-shadow,background-color] hover:border-primary/40 hover:bg-card focus-visible:border-primary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary/60 disabled:cursor-not-allowed disabled:opacity-50 data-[placeholder]:text-muted-foreground data-[state=open]:border-primary/60 data-[state=open]:ring-2 data-[state=open]:ring-primary/10",
            compact
              ? "min-h-8 px-2.5 text-xs pointer-coarse:min-h-11"
              : "min-h-12",
            className,
          )}
        >
          <span className="min-w-0 flex-1 truncate">
            <SelectPrimitive.Value placeholder={placeholder}>
              {selected?.label}
            </SelectPrimitive.Value>
          </span>
          <SelectPrimitive.Icon asChild>
            <ChevronDown
              aria-hidden
              className="size-4 shrink-0 text-muted-foreground transition-transform duration-200 group-data-[state=open]/select:rotate-180"
            />
          </SelectPrimitive.Icon>
        </SelectPrimitive.Trigger>
        <SelectPrimitive.Portal>
          <SelectPrimitive.Content
            position="popper"
            sideOffset={8}
            collisionPadding={16}
            className={cn(
              "z-[120] max-h-[min(22rem,var(--radix-select-content-available-height))] w-[var(--radix-select-trigger-width)] max-w-[calc(100vw-2rem)] overflow-hidden rounded-xl border border-border bg-popover text-popover-foreground shadow-[0_12px_36px_-12px_rgb(0_0_0/0.24)] motion-safe:data-[state=open]:animate-in motion-safe:data-[state=open]:fade-in-0 motion-safe:data-[state=open]:slide-in-from-top-1",
              compact ? "min-w-32" : "min-w-64",
            )}
          >
            <SelectPrimitive.ScrollUpButton className="flex h-7 items-center justify-center bg-popover text-muted-foreground">
              <ChevronUp aria-hidden className="size-4" />
            </SelectPrimitive.ScrollUpButton>
            <SelectPrimitive.Viewport className="p-1.5">
              {options.map((option) => (
                <SelectPrimitive.Item
                  key={option.value}
                  value={encode(option.value)}
                  disabled={option.disabled}
                  className="relative flex min-h-11 cursor-pointer select-none items-center rounded-lg py-2.5 pl-3 pr-10 text-sm leading-6 outline-none transition-colors data-[disabled]:pointer-events-none data-[disabled]:opacity-40 data-[highlighted]:bg-primary/10 data-[highlighted]:text-foreground data-[state=checked]:bg-primary/5 data-[state=checked]:font-medium"
                >
                  <SelectPrimitive.ItemText>
                    {option.label}
                  </SelectPrimitive.ItemText>
                  <SelectPrimitive.ItemIndicator className="absolute right-3 inline-flex items-center text-primary">
                    <Check aria-hidden className="size-4" />
                  </SelectPrimitive.ItemIndicator>
                </SelectPrimitive.Item>
              ))}
            </SelectPrimitive.Viewport>
            <SelectPrimitive.ScrollDownButton className="flex h-7 items-center justify-center bg-popover text-muted-foreground">
              <ChevronDown aria-hidden className="size-4" />
            </SelectPrimitive.ScrollDownButton>
          </SelectPrimitive.Content>
        </SelectPrimitive.Portal>
      </SelectPrimitive.Root>
    </>
  );
}
