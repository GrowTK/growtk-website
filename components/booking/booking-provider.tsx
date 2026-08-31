"use client";

import * as React from "react";
import type { Activity } from "@/content/types";
import { BookingWidget } from "@/components/booking/booking-widget";

type BookingContextValue = {
  open: (activity?: Activity) => void;
};

const BookingContext = React.createContext<BookingContextValue | null>(null);

/**
 * Mounted once in app/(site)/layout.tsx, same as FaqWidget/WhatsAppWidget.
 * One dialog instance for the whole page rather than one per "Book" button,
 * so `BookTrigger` (used on every tour card) just dispatches into this.
 */
export function BookingProvider({
  activities,
  children,
}: {
  activities: Activity[];
  children: React.ReactNode;
}) {
  const [isOpen, setIsOpen] = React.useState(false);
  const [preselected, setPreselected] = React.useState<Activity | undefined>();

  const open = React.useCallback((activity?: Activity) => {
    setPreselected(activity);
    setIsOpen(true);
  }, []);

  const value = React.useMemo(() => ({ open }), [open]);

  return (
    <BookingContext.Provider value={value}>
      {children}
      <BookingWidget open={isOpen} onOpenChange={setIsOpen} activities={activities} activity={preselected} />
    </BookingContext.Provider>
  );
}

/**
 * Falls back to a no-op outside a BookingProvider rather than throwing: the
 * same section components (tour-01.tsx etc.) also render inside the factory's
 * /sections picker, which previews blocks without mounting the live site
 * chrome. A missing provider there is expected, not a bug.
 */
export function useBooking() {
  const ctx = React.useContext(BookingContext);
  return ctx ?? { open: () => {} };
}
