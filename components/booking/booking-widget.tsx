"use client";

import * as React from "react";
import { CheckCircle2, ChevronLeft, Clock, Mail, Minus, Plus, User, Users, X } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Activity } from "@/content/types";
import { BookingCalendar } from "@/components/booking/booking-calendar";
import { TIME_SLOTS, useBookingFlow, type BookingStep } from "@/components/booking/use-booking-flow";

const FIELD =
  "mt-1.5 w-full rounded-lg border border-border bg-background px-3.5 py-2.5 text-sm text-foreground transition duration-200 ease-out focus-visible:border-primary focus-visible:ring-2 focus-visible:ring-primary focus-visible:outline-none aria-[invalid=true]:border-destructive aria-[invalid=true]:ring-destructive";
const LABEL = "block text-xs font-semibold tracking-wide text-muted-foreground uppercase";

const DOT_STEPS: BookingStep[] = ["datetime", "plan", "details", "success"];

function fmtDate(iso?: string) {
  if (!iso) return "";
  const [y, m, d] = iso.split("-").map(Number);
  return new Date(y, m - 1, d).toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" });
}

function Dots({ step }: { step: BookingStep }) {
  if (step === "activity") return <div />;
  const idx = DOT_STEPS.indexOf(step);
  return (
    <div className="flex items-center gap-1.5" aria-hidden>
      {DOT_STEPS.map((s, i) => (
        <span
          key={s}
          className={cn(
            "h-1.5 rounded-full transition-all duration-300",
            i === idx ? "w-5 bg-primary" : i < idx ? "w-1.5 bg-primary/40" : "w-1.5 bg-border",
          )}
        />
      ))}
    </div>
  );
}

function ActivitySummary({ activity, date, time }: { activity: Activity; date?: string; time?: string }) {
  return (
    <div className="flex items-center gap-3 rounded-xl border border-border bg-muted/50 p-3">
      {activity.image ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={activity.image.src} alt="" className="size-14 shrink-0 rounded-lg object-cover" />
      ) : (
        <div className="size-14 shrink-0 rounded-lg bg-muted" />
      )}
      <div className="min-w-0">
        <p className="truncate text-sm font-semibold text-foreground">{activity.title}</p>
        {date && time ? (
          <p className="text-xs text-muted-foreground">
            {fmtDate(date)} &middot; {time}
          </p>
        ) : activity.duration ? (
          <p className="text-xs text-muted-foreground">{activity.duration}</p>
        ) : null}
      </div>
      {activity.price ? (
        <span className="ml-auto shrink-0 rounded-full bg-primary/10 px-2.5 py-1 text-xs font-semibold text-primary">
          from {activity.price}
        </span>
      ) : null}
    </div>
  );
}

export function BookingWidget({
  open,
  onOpenChange,
  activities,
  activity: preselected,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  activities: Activity[];
  activity?: Activity;
}) {
  const flow = useBookingFlow(activities, preselected);
  const dialogRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    if (!open) return;
    flow.reset();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  React.useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onOpenChange(false);
    };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open, onOpenChange]);

  if (!open) return null;

  const canGoBack = flow.step === "activity" ? false : !(flow.step === "datetime" && preselected);
  const backLabel = flow.step === "plan" ? "Choose a different time" : flow.step === "details" ? "Back to plan" : "Close";

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Book"
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm"
      onClick={(e) => {
        if (e.target === e.currentTarget) onOpenChange(false);
      }}
    >
      <div
        ref={dialogRef}
        className="flex max-h-[90vh] w-full max-w-4xl flex-col overflow-hidden rounded-3xl border border-border bg-background shadow-2xl"
      >
        <div className="flex shrink-0 items-center justify-between border-b border-border px-5 py-3.5">
          {canGoBack ? (
            <button
              type="button"
              onClick={flow.back}
              className="flex cursor-pointer items-center gap-1 text-sm font-medium text-muted-foreground transition-colors duration-200 ease-out hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
            >
              <ChevronLeft aria-hidden className="size-4" />
              {backLabel}
            </button>
          ) : (
            <span />
          )}
          <Dots step={flow.step} />
          <button
            type="button"
            aria-label="Close"
            onClick={() => onOpenChange(false)}
            className="grid size-8 cursor-pointer place-items-center rounded-full text-muted-foreground transition-colors duration-200 ease-out hover:bg-muted hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
          >
            <X aria-hidden className="size-4" />
          </button>
        </div>

        <div className="overflow-y-auto">
          {flow.step === "activity" ? (
            <div className="grid gap-4 p-6 sm:grid-cols-2">
              {activities.map((a) => (
                <button
                  key={a.id ?? a.title}
                  type="button"
                  onClick={() => flow.pickActivity(a)}
                  className="cursor-pointer overflow-hidden rounded-2xl border border-border bg-card text-left transition-all duration-200 ease-out hover:-translate-y-0.5 hover:shadow-lg focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
                >
                  {a.image ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={a.image.src} alt={a.image.alt} className="aspect-[3/2] w-full object-cover" loading="lazy" decoding="async" />
                  ) : (
                    <div className="aspect-[3/2] w-full bg-muted" />
                  )}
                  <div className="p-4">
                    <p className="font-display text-base font-semibold tracking-tight text-foreground">{a.title}</p>
                    <div className="mt-1.5 flex items-center gap-3 text-xs text-muted-foreground">
                      {a.duration ? (
                        <span className="flex items-center gap-1">
                          <Clock aria-hidden className="size-3.5" /> {a.duration}
                        </span>
                      ) : null}
                      {a.price ? <span className="font-semibold text-foreground">from {a.price}</span> : null}
                    </div>
                  </div>
                </button>
              ))}
            </div>
          ) : null}

          {flow.step === "datetime" && flow.activity ? (
            <div className="grid gap-0 sm:grid-cols-2">
              <div className="border-b border-border p-6 sm:border-b-0 sm:border-r">
                {flow.activity.image ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={flow.activity.image.src}
                    alt={flow.activity.image.alt}
                    className="aspect-[3/2] w-full rounded-2xl object-cover"
                  />
                ) : null}
                <h2 className="mt-5 font-display text-2xl font-bold tracking-tight text-foreground">{flow.activity.title}</h2>
                {flow.activity.duration ? <p className="mt-1 text-sm text-muted-foreground">{flow.activity.duration}</p> : null}
                {flow.activity.price ? (
                  <div className="mt-5 flex items-center justify-between rounded-xl border border-border bg-muted/50 px-4 py-3">
                    <span className="text-sm font-medium text-foreground">Guest</span>
                    <span className="font-display text-lg font-bold text-foreground">{flow.activity.price}</span>
                  </div>
                ) : null}
                <div className="mt-5 grid grid-cols-2 gap-3">
                  {flow.activity.duration ? (
                    <div className="rounded-xl bg-muted/50 p-3">
                      <Clock aria-hidden className="size-4 text-primary" />
                      <p className="mt-2 text-[11px] tracking-wide text-muted-foreground uppercase">Duration</p>
                      <p className="text-sm font-semibold text-foreground">{flow.activity.duration}</p>
                    </div>
                  ) : null}
                  {flow.activity.capacity ? (
                    <div className="rounded-xl bg-muted/50 p-3">
                      <Users aria-hidden className="size-4 text-primary" />
                      <p className="mt-2 text-[11px] tracking-wide text-muted-foreground uppercase">Capacity</p>
                      <p className="text-sm font-semibold text-foreground">{flow.activity.capacity} guests</p>
                    </div>
                  ) : null}
                </div>
              </div>

              <div className="p-6">
                <p className="text-xs font-semibold tracking-wide text-muted-foreground uppercase">Select a date</p>
                <div className="mt-3">
                  <BookingCalendar value={flow.date} onSelect={flow.pickDate} />
                </div>

                {flow.date ? (
                  <div className="mt-5 border-t border-border pt-5">
                    <p className="text-xs font-semibold tracking-wide text-muted-foreground uppercase">Available times</p>
                    <div className="mt-3 grid gap-2">
                      {TIME_SLOTS.map((t) => (
                        <button
                          key={t}
                          type="button"
                          onClick={() => flow.pickTime(t)}
                          className="flex cursor-pointer items-center justify-between rounded-xl border border-border bg-card px-4 py-2.5 text-sm font-medium text-foreground transition-all duration-200 ease-out hover:border-primary hover:text-primary focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
                        >
                          {t}
                        </button>
                      ))}
                    </div>
                  </div>
                ) : (
                  <p className="mt-5 rounded-xl border border-dashed border-border p-4 text-center text-sm text-muted-foreground">
                    Pick a date to see times
                  </p>
                )}
              </div>
            </div>
          ) : null}

          {flow.step === "plan" && flow.activity ? (
            <div className="grid gap-0 sm:grid-cols-2">
              <div className="border-b border-border p-6 sm:border-b-0 sm:border-r">
                <ActivitySummary activity={flow.activity} date={flow.date} time={flow.time} />
                <h3 className="mt-6 font-display text-lg font-bold tracking-tight text-foreground">Plan your experience</h3>
                <div className="mt-5 flex items-center justify-between border-t border-border pt-5">
                  <div>
                    <p className="text-sm font-medium text-foreground">Guests</p>
                    {flow.activity.price ? <p className="text-xs text-muted-foreground">{flow.activity.price} per person</p> : null}
                  </div>
                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      aria-label="Fewer guests"
                      disabled={flow.guests <= 1}
                      onClick={() => flow.setGuests((g) => Math.max(1, g - 1))}
                      className="grid size-8 cursor-pointer place-items-center rounded-full border border-border text-foreground transition-colors duration-200 ease-out hover:bg-muted disabled:cursor-not-allowed disabled:opacity-40 focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
                    >
                      <Minus aria-hidden className="size-3.5" />
                    </button>
                    <span className="w-4 text-center font-display text-base font-bold text-foreground">{flow.guests}</span>
                    <button
                      type="button"
                      aria-label="More guests"
                      disabled={flow.activity.capacity ? flow.guests >= flow.activity.capacity : flow.guests >= 20}
                      onClick={() => flow.setGuests((g) => g + 1)}
                      className="grid size-8 cursor-pointer place-items-center rounded-full bg-primary text-primary-foreground transition-transform duration-200 ease-out hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-40 focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
                    >
                      <Plus aria-hidden className="size-3.5" />
                    </button>
                  </div>
                </div>
              </div>

              <div className="flex flex-col p-6">
                <p className="text-xs font-semibold tracking-wide text-muted-foreground uppercase">Request summary</p>
                <div className="mt-3 space-y-2 border-b border-border pb-4 text-sm">
                  <div className="flex justify-between text-muted-foreground">
                    <span>
                      {flow.guests}&times; Guest{flow.activity.price ? ` (${flow.activity.price} each)` : ""}
                    </span>
                  </div>
                </div>
                <p className="mt-4 text-xs leading-relaxed text-muted-foreground">
                  No payment is taken now. Submit your details and the request goes straight to the team, who will
                  confirm by email.
                </p>
                <button
                  type="button"
                  onClick={flow.toDetails}
                  className="mt-auto inline-flex w-full cursor-pointer items-center justify-center gap-2 rounded-lg bg-primary px-6 py-3.5 text-sm font-semibold text-primary-foreground transition duration-200 ease-out hover:-translate-y-0.5 hover:shadow-lg focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:outline-none"
                >
                  Continue to guest details
                </button>
              </div>
            </div>
          ) : null}

          {flow.step === "details" && flow.activity ? (
            <div className="grid gap-0 sm:grid-cols-2">
              <div className="border-b border-border p-6 sm:border-b-0 sm:border-r">
                <ActivitySummary activity={flow.activity} date={flow.date} time={flow.time} />
                <h3 className="mt-6 font-display text-lg font-bold tracking-tight text-foreground">Your details</h3>
                <p className="mt-1 text-sm text-muted-foreground">We only need one contact to send the confirmation.</p>

                <div className="mt-5 space-y-4">
                  <div>
                    <label htmlFor="bw-name" className={LABEL}>
                      <User aria-hidden className="mr-1 inline size-3.5 align-[-2px]" /> Full name
                    </label>
                    <input
                      id="bw-name"
                      value={flow.name}
                      onChange={(e) => flow.setName(e.target.value)}
                      aria-invalid={flow.errors.name ? true : undefined}
                      className={FIELD}
                      autoComplete="name"
                    />
                  </div>
                  <div>
                    <label htmlFor="bw-email" className={LABEL}>
                      <Mail aria-hidden className="mr-1 inline size-3.5 align-[-2px]" /> Email address
                    </label>
                    <input
                      id="bw-email"
                      type="email"
                      value={flow.email}
                      onChange={(e) => flow.setEmail(e.target.value)}
                      aria-invalid={flow.errors.email ? true : undefined}
                      className={FIELD}
                      autoComplete="email"
                    />
                  </div>
                  <div>
                    <label htmlFor="bw-phone" className={LABEL}>
                      Phone (optional)
                    </label>
                    <input
                      id="bw-phone"
                      type="tel"
                      value={flow.phone}
                      onChange={(e) => flow.setPhone(e.target.value)}
                      className={FIELD}
                      autoComplete="tel"
                    />
                  </div>
                  <div>
                    <label htmlFor="bw-notes" className={LABEL}>
                      Anything we should know (optional)
                    </label>
                    <textarea
                      id="bw-notes"
                      rows={3}
                      value={flow.notes}
                      onChange={(e) => flow.setNotes(e.target.value)}
                      className={cn(FIELD, "resize-y")}
                    />
                  </div>
                </div>
              </div>

              <div className="flex flex-col p-6">
                <p className="text-xs font-semibold tracking-wide text-muted-foreground uppercase">Booking summary</p>
                <dl className="mt-3 space-y-2.5 border-b border-border pb-4 text-sm">
                  {[
                    ["Activity", flow.activity.title],
                    ["Date", fmtDate(flow.date)],
                    ["Time", flow.time],
                    ["Guests", String(flow.guests)],
                  ].map(([k, v]) => (
                    <div key={k} className="flex justify-between">
                      <dt className="text-muted-foreground">{k}</dt>
                      <dd className="font-medium text-foreground">{v}</dd>
                    </div>
                  ))}
                </dl>
                <p className="mt-4 text-xs leading-relaxed text-muted-foreground">
                  No payment is taken. This is a request, not a confirmed booking.
                </p>
                {flow.submitError ? (
                  <p role="alert" className="mt-3 text-xs font-medium text-destructive">
                    {flow.submitError}
                  </p>
                ) : null}
                <button
                  type="button"
                  disabled={flow.submitting}
                  onClick={flow.submit}
                  className="mt-auto inline-flex w-full cursor-pointer items-center justify-center gap-2 rounded-lg bg-primary px-6 py-3.5 text-sm font-semibold text-primary-foreground transition duration-200 ease-out hover:-translate-y-0.5 hover:shadow-lg focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {flow.submitting ? "Sending..." : "Send booking request"}
                </button>
              </div>
            </div>
          ) : null}

          {flow.step === "success" ? (
            <div className="p-10 text-center">
              <CheckCircle2 aria-hidden className="mx-auto size-10 text-primary" />
              <h3 role="status" className="mt-4 font-display text-2xl font-bold tracking-tight text-foreground">
                Request sent
              </h3>
              <p className="mx-auto mt-3 max-w-sm text-sm leading-relaxed text-muted-foreground">
                We have your request for {flow.activity?.title} on {fmtDate(flow.date)} at {flow.time}. A
                confirmation is on its way to your inbox, and the team will follow up to lock it in.
              </p>
              <button
                type="button"
                onClick={() => onOpenChange(false)}
                className="mt-7 cursor-pointer rounded-lg bg-primary px-6 py-2.5 text-sm font-semibold text-primary-foreground transition duration-200 ease-out hover:-translate-y-0.5 hover:shadow-lg focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:outline-none"
              >
                Done
              </button>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}
