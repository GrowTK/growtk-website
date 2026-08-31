"use client";

import * as React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

const WEEKDAYS = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];

const toKey = (d: Date) =>
  `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;

/**
 * Hand-rolled month grid, no date library. There's no real inventory system
 * behind this (it's an inquiry widget, not a live booking engine), so every
 * date from today forward is offered; only past dates are disabled. The
 * "Available/Unavailable" legend stays for visual clarity even though nothing
 * is ever actually marked unavailable.
 */
export function BookingCalendar({
  value,
  onSelect,
}: {
  value?: string;
  onSelect: (dateKey: string) => void;
}) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const [cursor, setCursor] = React.useState(() => new Date(today.getFullYear(), today.getMonth(), 1));

  const year = cursor.getFullYear();
  const month = cursor.getMonth();
  const firstWeekday = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const monthLabel = cursor.toLocaleDateString("en-US", { month: "long", year: "numeric" });

  const cells: (Date | null)[] = [
    ...Array.from({ length: firstWeekday }, () => null),
    ...Array.from({ length: daysInMonth }, (_, i) => new Date(year, month, i + 1)),
  ];

  return (
    <div>
      <div className="flex items-center justify-between">
        <button
          type="button"
          aria-label="Previous month"
          onClick={() => setCursor(new Date(year, month - 1, 1))}
          className="grid size-8 cursor-pointer place-items-center rounded-full text-muted-foreground transition-colors duration-200 ease-out hover:bg-muted hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
        >
          <ChevronLeft aria-hidden className="size-4" />
        </button>
        <p className="font-display text-sm font-semibold tracking-tight text-foreground">{monthLabel}</p>
        <button
          type="button"
          aria-label="Next month"
          onClick={() => setCursor(new Date(year, month + 1, 1))}
          className="grid size-8 cursor-pointer place-items-center rounded-full text-muted-foreground transition-colors duration-200 ease-out hover:bg-muted hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
        >
          <ChevronRight aria-hidden className="size-4" />
        </button>
      </div>

      <div className="mt-4 grid grid-cols-7 gap-1 text-center">
        {WEEKDAYS.map((w) => (
          <div key={w} className="font-mono text-[10px] uppercase tracking-[0.1em] text-muted-foreground">
            {w}
          </div>
        ))}
        {cells.map((d, i) => {
          if (!d) return <div key={`empty-${i}`} />;
          const key = toKey(d);
          const past = d < today;
          const selected = value === key;
          return (
            <button
              key={key}
              type="button"
              disabled={past}
              onClick={() => onSelect(key)}
              aria-pressed={selected}
              className={cn(
                "relative grid aspect-square cursor-pointer place-items-center rounded-full text-sm transition-colors duration-200 ease-out focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none",
                past && "cursor-not-allowed text-muted-foreground/40",
                !past && !selected && "text-foreground hover:bg-muted",
                selected && "bg-primary font-semibold text-primary-foreground",
              )}
            >
              {d.getDate()}
              {!past ? (
                <span
                  aria-hidden
                  className={cn(
                    "absolute bottom-1 size-1 rounded-full",
                    selected ? "bg-primary-foreground" : "bg-primary",
                  )}
                />
              ) : null}
            </button>
          );
        })}
      </div>

      <div className="mt-4 flex items-center gap-4 text-xs text-muted-foreground">
        <span className="flex items-center gap-1.5">
          <span aria-hidden className="size-1.5 rounded-full bg-primary" /> Available
        </span>
        <span className="flex items-center gap-1.5">
          <span aria-hidden className="size-1.5 rounded-full bg-muted-foreground/40" /> Unavailable
        </span>
      </div>
    </div>
  );
}
