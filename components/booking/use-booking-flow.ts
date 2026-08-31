"use client";

import * as React from "react";
import type { Activity } from "@/content/types";
import { submitBooking } from "@/lib/booking";

export type BookingStep = "activity" | "datetime" | "plan" | "details" | "success";

export const TIME_SLOTS = ["9:00 am", "11:00 am", "1:00 pm", "3:00 pm"];

/**
 * One flow, one widget. `preselected` is what makes a tour card's own Book
 * button skip straight to date/time, while a generic navbar Book button
 * starts at the activity grid.
 */
export function useBookingFlow(activities: Activity[], preselected?: Activity) {
  const [step, setStep] = React.useState<BookingStep>(preselected ? "datetime" : "activity");
  const [activity, setActivity] = React.useState<Activity | undefined>(preselected);
  const [date, setDate] = React.useState<string | undefined>();
  const [time, setTime] = React.useState<string | undefined>();
  const [guests, setGuests] = React.useState(1);
  const [name, setName] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [phone, setPhone] = React.useState("");
  const [notes, setNotes] = React.useState("");
  const [errors, setErrors] = React.useState<Record<string, boolean>>({});
  const [submitting, setSubmitting] = React.useState(false);
  const [submitError, setSubmitError] = React.useState<string | null>(null);

  const reset = React.useCallback(() => {
    setStep(preselected ? "datetime" : "activity");
    setActivity(preselected);
    setDate(undefined);
    setTime(undefined);
    setGuests(1);
    setName("");
    setEmail("");
    setPhone("");
    setNotes("");
    setErrors({});
    setSubmitError(null);
  }, [preselected]);

  function pickActivity(a: Activity) {
    setActivity(a);
    setStep("datetime");
  }

  function pickDate(d: string) {
    setDate(d);
    setTime(undefined);
  }

  function pickTime(t: string) {
    setTime(t);
    setStep("plan");
  }

  function toDetails() {
    setStep("details");
  }

  function back() {
    if (step === "datetime" && !preselected) setStep("activity");
    else if (step === "plan") setStep("datetime");
    else if (step === "details") setStep("plan");
  }

  async function submit() {
    const next: Record<string, boolean> = {};
    if (!name.trim()) next.name = true;
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email.trim())) next.email = true;
    setErrors(next);
    if (Object.keys(next).length || !activity || !date || !time) return;

    setSubmitting(true);
    setSubmitError(null);
    const result = await submitBooking({
      activity: activity.title,
      activitySlug: activity.id,
      date, time, guests,
      name: name.trim(), email: email.trim(),
      phone: phone.trim() || undefined,
      notes: notes.trim() || undefined,
    });
    setSubmitting(false);
    if (!result.ok) { setSubmitError(result.error); return; }
    setStep("success");
  }

  return {
    step, activity, date, time, guests, name, email, phone, notes, errors, submitting, submitError,
    setGuests, setName, setEmail, setPhone, setNotes,
    pickActivity, pickDate, pickTime, toDetails, back, submit, reset,
  };
}
