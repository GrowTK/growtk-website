"use client";

import type { Activity } from "@/content/types";
import { useBooking } from "@/components/booking/booking-provider";
import { cn } from "@/lib/utils";

/**
 * Drop-in swap for `<a href="#book">`. Same stretched-link trick (an
 * `after:absolute after:inset-0` element makes the whole card clickable)
 * works identically on a <button>, so every existing "Book" CTA in the
 * section library becomes a real trigger with a one-line change: keep the
 * className, swap the element and href for this.
 *
 * `activity` omitted -> opens on the activity-picker step (a generic navbar
 * Book button). `activity` passed -> skips straight to date/time (a tour
 * card's own Book button).
 */
export function BookTrigger({
  activity,
  className,
  children,
}: {
  activity?: Activity;
  className?: string;
  children: React.ReactNode;
}) {
  const { open } = useBooking();
  return (
    <button type="button" onClick={() => open(activity)} className={cn("cursor-pointer", className)}>
      {children}
    </button>
  );
}
