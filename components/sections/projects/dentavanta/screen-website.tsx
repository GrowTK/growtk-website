"use client";

import * as React from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { ArrowRight, CheckCircle2, Lock, Phone, RotateCw, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";
import { yettiGeist as geist } from "@/lib/project-fonts";
import { dentavantaDeck } from "@/content/dentavanta";
import { useStore, type NewWebLead } from "./store";

/**
 * The clinic website template (dentavanta-dental-clinic-website): its navbar,
 * hero and the appointment request form, in the template's own teal and
 * warm paper tokens. In the real template the form posts to Dentavanta's
 * public forms API and becomes a lead; here it writes to the demo store.
 */
const CLINIC_FOCUS = "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0f6e63]";
const FIELD = cn("w-full rounded-md border border-[#e4e1d8] bg-white px-3.5 py-2.5 text-sm text-[#1c2521] outline-none transition placeholder:text-[#6b746f] focus:border-[#0f6e63]", CLINIC_FOCUS);

const EMPTY: NewWebLead = { firstName: "", lastName: "", phone: "", email: "", interest: "", message: "" };

export function WebsiteScreen({ onSeeLead }: { onSeeLead: () => void }) {
  const { addWebLead } = useStore();
  const reduce = useReducedMotion();
  const w = dentavantaDeck.website;
  const [form, setForm] = React.useState<NewWebLead>(EMPTY);
  const [state, setState] = React.useState<"idle" | "sending" | "sent">("idle");
  const firstRef = React.useRef<HTMLInputElement>(null);
  const set = (k: keyof NewWebLead) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => setForm((f) => ({ ...f, [k]: e.target.value }));

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.firstName.trim() || !form.phone.trim()) return;
    setState("sending");
    window.setTimeout(() => {
      addWebLead(form);
      setState("sent");
    }, 700);
  };

  return (
    <div className={cn(geist.variable, "absolute inset-0 overflow-hidden p-0 pt-16 sm:p-6 lg:p-8")} style={{ fontFamily: "var(--font-yetti), Arial, Helvetica, sans-serif" }}>
      <div className="flex h-full flex-col overflow-hidden bg-[#fbfaf7] text-[#1c2521] sm:rounded-2xl">
        {/* Browser chrome */}
        <div className="flex shrink-0 items-center gap-3 border-b border-[#e4e1d8] bg-white px-4 py-2.5">
          <span aria-hidden className="hidden gap-1.5 sm:flex">
            <span className="size-2.5 rounded-full bg-[#e4e1d8]" />
            <span className="size-2.5 rounded-full bg-[#e4e1d8]" />
            <span className="size-2.5 rounded-full bg-[#e4e1d8]" />
          </span>
          <span className="mx-auto flex min-w-0 items-center gap-1.5 rounded-full bg-[#f3f1ec] px-4 py-1 text-xs text-[#6b746f]">
            <Lock aria-hidden className="size-3" />
            <span className="truncate">{w.url}</span>
          </span>
          <RotateCw aria-hidden className="hidden size-3.5 text-[#6b746f] sm:block" />
        </div>

        <div className="min-h-0 flex-1 overflow-y-auto">
          {/* Navbar */}
          <header className="border-b border-[#e4e1d8] bg-[#fbfaf7]">
            <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
              <span className="flex items-center gap-2">
                <span className="flex size-9 items-center justify-center rounded-md bg-[#0f6e63] text-sm font-bold text-white">{dentavantaDeck.practiceInitials}</span>
                <span className="text-lg font-extrabold tracking-tight">{dentavantaDeck.practiceName}</span>
              </span>
              <nav aria-label="Clinic site" className="hidden items-center gap-6 xl:flex">
                {w.nav.map((n) => (
                  <span key={n} className="text-sm font-medium text-[#1c2521]/80">
                    {n}
                  </span>
                ))}
              </nav>
              <button type="button" onClick={() => firstRef.current?.focus()} className={cn("hidden cursor-pointer rounded-md bg-[#0f6e63] px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[#0b5048] sm:block", CLINIC_FOCUS)}>
                {w.navCta}
              </button>
            </div>
          </header>

          {/* Hero with the appointment form */}
          <section className="bg-[#e4f1ee]/60">
            <div className="mx-auto grid max-w-6xl items-center gap-10 px-6 py-10 lg:grid-cols-[1.05fr_1fr] lg:py-14">
              <div>
                <p className="text-sm font-semibold text-[#0f6e63]">{w.eyebrow}</p>
                <h2 className="mt-4 text-4xl leading-[1.05] font-extrabold tracking-tight text-balance lg:text-5xl">{w.title}</h2>
                <p className="mt-5 max-w-xl text-base leading-relaxed text-[#6b746f] lg:text-lg">{w.body}</p>
                <div className="mt-7 flex flex-wrap gap-3">
                  <button type="button" onClick={() => firstRef.current?.focus()} className={cn("cursor-pointer rounded-md bg-[#0f6e63] px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-[#0b5048]", CLINIC_FOCUS)}>
                    {w.primary}
                  </button>
                  <span className="inline-flex items-center gap-2 rounded-md border border-[#e4e1d8] bg-white px-6 py-3 text-sm font-semibold">
                    <Phone aria-hidden className="size-4 text-[#0f6e63]" /> {w.call}
                  </span>
                </div>
                <p className="mt-8 inline-flex items-center gap-2 rounded-full bg-white px-3 py-1.5 text-xs font-medium text-[#1c2521]">
                  {/* eslint-disable-next-line @next/next/no-img-element -- product mark */}
                  <img src={dentavantaDeck.logo.markBlue} alt="" className="h-3.5 w-auto" />
                  {w.poweredBy}
                </p>
              </div>

              <div className="relative rounded-md border border-[#e4e1d8] bg-white p-6 sm:p-7">
                <AnimatePresence mode="wait" initial={false}>
                  {state === "sent" ? (
                    <motion.div key="sent" initial={{ opacity: 0, y: reduce ? 0 : 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.3 }} className="flex flex-col items-start py-6">
                      <span className="flex size-12 items-center justify-center rounded-full bg-[#e4f1ee] text-[#0f6e63]">
                        <CheckCircle2 aria-hidden className="size-6" />
                      </span>
                      <h3 className="mt-4 text-2xl font-extrabold tracking-tight">{w.sent.title}</h3>
                      <p className="mt-2 text-sm leading-relaxed text-[#6b746f]">{w.sent.body}</p>
                      <div className="mt-6 flex flex-wrap gap-2">
                        <button
                          type="button"
                          data-deck-nav
                          onClick={onSeeLead}
                          className="inline-flex cursor-pointer items-center gap-2 rounded-md bg-[#0636a6] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#052e8d] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0636a6]"
                        >
                          {w.sent.cta} <ArrowRight aria-hidden className="size-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setForm(EMPTY);
                            setState("idle");
                          }}
                          className={cn("cursor-pointer rounded-md border border-[#e4e1d8] px-5 py-3 text-sm font-semibold transition hover:border-[#0f6e63] hover:text-[#0f6e63]", CLINIC_FOCUS)}
                        >
                          {w.sent.again}
                        </button>
                      </div>
                    </motion.div>
                  ) : (
                    <motion.form key="form" onSubmit={submit} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }} className="flex flex-col gap-4">
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <h3 className="text-xl font-extrabold tracking-tight">{w.form.title}</h3>
                          <p className="mt-1 text-sm text-[#6b746f]">{w.form.body}</p>
                        </div>
                        <button
                          type="button"
                          onClick={() => setForm(w.form.prefill)}
                          className={cn("inline-flex shrink-0 cursor-pointer items-center gap-1.5 rounded-md bg-[#faedd9] px-3 py-2 text-xs font-semibold text-[#7a4a1d] transition hover:bg-[#f5dfbd]", CLINIC_FOCUS)}
                        >
                          <Sparkles aria-hidden className="size-3.5" /> <span className="hidden sm:inline">{w.form.prefillLabel}</span>
                        </button>
                      </div>
                      <div className="grid gap-3 sm:grid-cols-2">
                        <Field label={w.form.firstName} required>
                          <input ref={firstRef} value={form.firstName} onChange={set("firstName")} required autoComplete="off" className={FIELD} />
                        </Field>
                        <Field label={w.form.lastName}>
                          <input value={form.lastName} onChange={set("lastName")} autoComplete="off" className={FIELD} />
                        </Field>
                        <Field label={w.form.phone} required>
                          <input value={form.phone} onChange={set("phone")} required type="tel" placeholder={w.form.phonePlaceholder} autoComplete="off" className={FIELD} />
                        </Field>
                        <Field label={w.form.email}>
                          <input value={form.email} onChange={set("email")} type="email" autoComplete="off" className={FIELD} />
                        </Field>
                      </div>
                      <Field label={w.form.interest}>
                        <select value={form.interest} onChange={set("interest")} className={cn(FIELD, "cursor-pointer")}>
                          <option value="" disabled>
                            {w.form.interest}
                          </option>
                          {w.form.interests.map((o) => (
                            <option key={o} value={o}>
                              {o}
                            </option>
                          ))}
                        </select>
                      </Field>
                      <Field label={w.form.message}>
                        <textarea value={form.message} onChange={set("message")} rows={2} className={cn(FIELD, "resize-none")} />
                      </Field>
                      <p className="text-xs text-[#6b746f]">{w.form.privacy}</p>
                      <button
                        type="submit"
                        disabled={state === "sending"}
                        className={cn("cursor-pointer rounded-md bg-[#0f6e63] px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-[#0b5048] disabled:cursor-not-allowed disabled:opacity-60", CLINIC_FOCUS)}
                      >
                        {state === "sending" ? w.form.sending : w.form.submit}
                      </button>
                    </motion.form>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}

function Field({ label, required, children }: { label: string; required?: boolean; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-sm font-medium">
        {label}
        {required && <span className="text-[#d98e4a]"> *</span>}
      </span>
      {children}
    </label>
  );
}
