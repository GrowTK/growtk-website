"use client";

import * as React from "react";
import { BarChart3, Ban, CalendarDays, CalendarRange, CheckCircle2, ChevronLeft, ChevronRight, Clock, LayoutGrid, List, Plus, UserX } from "lucide-react";
import { cn } from "@/lib/utils";
import { dentavantaDeck, type AppointmentType, type ContactRef, type DemoAppointment } from "@/content/dentavanta";
import type { ScreenId } from "./app-frame";
import { dayDate, formatDay, formatMinute, useStore } from "./store";
import { Avatar, BTN_PRIMARY, BookedByBadge, Chip, Drawer, DrawerSection, FOCUS, PageHeader, StatusBadge, TYPE_COLORS, TypeBadge, ViewToggle } from "./ui";

const FIRST_HOUR = 7;
const HOURS = Array.from({ length: 13 }, (_, i) => FIRST_HOUR + i); // 7am to 7pm
const HOUR_HEIGHT = 48;
const TIMES = Array.from({ length: 19 }, (_, i) => 8 * 60 + i * 30); // 8:00 AM to 5:00 PM
const TYPES: AppointmentType[] = ["exam", "cleaning", "procedure", "consultation", "emergency"];
const VIEW_ICONS = [CalendarDays, CalendarRange, Clock, List, LayoutGrid, BarChart3];

type NewForm = { who: ContactRef | null; type: AppointmentType; day: number; startMinute: number; durationMinutes: number; operatory: string };

/** Calendar: a copy of components/calendar/calendar-page.tsx in its Week view, with the booking and appointment drawers. */
export function CalendarScreen({ onNavigate }: { onNavigate: (s: ScreenId) => void }) {
  const { appointments, patient, bookingIntent, setBookingIntent, askWalkthrough } = useStore();
  const copy = dentavantaDeck.calendar;
  const [weekShift, setWeekShift] = React.useState(0);
  const [openAppt, setOpenAppt] = React.useState<string | null>(null);
  const [form, setForm] = React.useState<NewForm | null>(null);

  // A booking asked for on another slide (a lead or patient drawer) opens here, prefilled.
  React.useEffect(() => {
    if (!bookingIntent) return;
    setForm(defaultForm(bookingIntent.who ?? null, bookingIntent.day, bookingIntent.startMinute));
    setBookingIntent(null);
  }, [bookingIntent, setBookingIntent]);

  const startOffset = -dayDate(0).getDay() + weekShift * 7;
  const days = Array.from({ length: 7 }, (_, i) => startOffset + i);
  const visible = appointments.filter((a) => a.status !== "cancelled" && a.day >= startOffset && a.day < startOffset + 7);
  const range = `${dayDate(startOffset).toLocaleDateString("en-US", { month: "short", day: "numeric" })} to ${dayDate(startOffset + 6).toLocaleDateString("en-US", { month: "short", day: "numeric" })}`;
  const label = (a: DemoAppointment) => {
    const p = patient(a.patientId);
    return p ? `${p.firstName} ${p.lastInitial}.` : "Patient";
  };

  return (
    <div className="flex h-full min-h-0 flex-col gap-4">
      <PageHeader icon={CalendarDays} title={copy.title} subtitle={copy.subtitle}>
        <ViewToggle
          options={copy.views.map((v, i) => ({ value: v, label: v, icon: VIEW_ICONS[i] }))}
          value="Week"
          onChange={(v) => v !== "Week" && askWalkthrough(`The ${v.toLowerCase()} view`)}
        />
        <button type="button" onClick={() => setForm(defaultForm(null))} className={BTN_PRIMARY}>
          <Plus aria-hidden className="size-4" /> {copy.book}
        </button>
      </PageHeader>

      <div className="flex min-h-[30rem] flex-1 flex-col rounded-2xl bg-white p-4">
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-base font-semibold">{range}</h2>
          <div className="flex items-center gap-1">
            <button type="button" aria-label="Previous week" onClick={() => setWeekShift((w) => w - 1)} className={cn("flex size-8 cursor-pointer items-center justify-center rounded-lg text-[#6b7280] hover:bg-[#f1f3f8] hover:text-[#0a0a0a]", FOCUS)}>
              <ChevronLeft aria-hidden className="size-4" />
            </button>
            <button type="button" onClick={() => setWeekShift(0)} className={cn("cursor-pointer rounded-lg px-3 py-1.5 text-xs font-semibold hover:bg-[#f1f3f8]", FOCUS)}>
              {copy.today}
            </button>
            <button type="button" aria-label="Next week" onClick={() => setWeekShift((w) => w + 1)} className={cn("flex size-8 cursor-pointer items-center justify-center rounded-lg text-[#6b7280] hover:bg-[#f1f3f8] hover:text-[#0a0a0a]", FOCUS)}>
              <ChevronRight aria-hidden className="size-4" />
            </button>
          </div>
        </div>

        <div className="min-h-0 flex-1 overflow-auto">
          <div className="grid min-w-[640px] grid-cols-[3rem_repeat(7,1fr)]">
            <div />
            {days.map((day) => (
              <div key={day} className="flex flex-col items-center gap-0.5 border-b border-[#e6e8ec] px-1 pb-2 text-center">
                <span className="text-xs font-medium text-[#6b7280]">{dayDate(day).toLocaleDateString("en-US", { weekday: "short" })}</span>
                <span className={cn("flex size-6 items-center justify-center rounded-full text-xs font-semibold", day === 0 ? "bg-[#0636a6] text-white" : "text-[#0a0a0a]")}>{dayDate(day).getDate()}</span>
              </div>
            ))}

            <div className="relative" style={{ height: HOURS.length * HOUR_HEIGHT }}>
              {HOURS.map((h, i) => (
                <div key={h} className="absolute right-1 -translate-y-2 text-right text-[11px] text-[#6b7280]" style={{ top: i * HOUR_HEIGHT }}>
                  {h % 12 === 0 ? 12 : h % 12}
                  {h < 12 ? "am" : "pm"}
                </div>
              ))}
            </div>

            {days.map((day) => (
              <div key={day} className="relative border-l border-[#e6e8ec]" style={{ height: HOURS.length * HOUR_HEIGHT }}>
                {HOURS.map((h, i) => (
                  <button
                    key={h}
                    type="button"
                    aria-label={`Book ${formatDay(day)} at ${formatMinute(h * 60)}`}
                    onClick={() => setForm(defaultForm(null, day, Math.max(8 * 60, Math.min(17 * 60, h * 60))))}
                    className="absolute inset-x-0 cursor-pointer border-t border-[#e6e8ec]/60 transition hover:bg-[#eaeef8]/60 focus-visible:bg-[#eaeef8] focus-visible:outline-none"
                    style={{ top: i * HOUR_HEIGHT, height: HOUR_HEIGHT }}
                  />
                ))}
                {visible
                  .filter((a) => a.day === day)
                  .map((a) => {
                    const past = a.day < 0 && a.status !== "completed";
                    return (
                      <button
                        key={a.id}
                        type="button"
                        onClick={() => setOpenAppt(a.id)}
                        className={cn("absolute inset-x-0.5 z-10 cursor-pointer overflow-hidden rounded-md px-1.5 py-0.5 text-left text-[11px] font-medium text-white transition hover:brightness-95", FOCUS, past && "opacity-50 grayscale")}
                        style={{
                          top: ((a.startMinute - FIRST_HOUR * 60) / 60) * HOUR_HEIGHT,
                          height: (Math.max(20, a.durationMinutes) / 60) * HOUR_HEIGHT,
                          backgroundColor: TYPE_COLORS[a.type],
                        }}
                      >
                        <span className="block truncate">{label(a)}</span>
                        <span className="block truncate opacity-90">{formatMinute(a.startMinute)}</span>
                      </button>
                    );
                  })}
              </div>
            ))}
          </div>
        </div>
      </div>

      <AppointmentDrawer id={openAppt} onClose={() => setOpenAppt(null)} onNavigate={onNavigate} />
      <BookingDrawer form={form} setForm={setForm} />
    </div>
  );
}

function defaultForm(who: ContactRef | null, day = 1, startMinute = 9 * 60): NewForm {
  return { who, type: "cleaning", day: Math.max(0, day), startMinute, durationMinutes: 60, operatory: "Op 1" };
}

function AppointmentDrawer({ id, onClose, onNavigate }: { id: string | null; onClose: () => void; onNavigate: (s: ScreenId) => void }) {
  const { appointments, patient, setAppointmentStatus, setFocusPatient } = useStore();
  const copy = dentavantaDeck.calendar.drawer;
  const a = id ? appointments.find((x) => x.id === id) : undefined;
  const p = a ? patient(a.patientId) : undefined;
  const name = p ? `${p.firstName} ${p.lastInitial}.` : "";
  return (
    <Drawer open={!!a} onClose={onClose} icon={CalendarDays} title={name} subtitle={copy.detailSubtitle}>
      {a && (
        <>
          <div className="flex flex-wrap gap-2">
            <TypeBadge type={a.type} />
            <StatusBadge status={a.status} />
            <BookedByBadge bookedBy={a.bookedBy} />
          </div>
          <DrawerSection title={copy.when}>
            <p className="text-sm">
              {formatDay(a.day, { weekday: "long", month: "long", day: "numeric" })}, {formatMinute(a.startMinute)} to {formatMinute(a.startMinute + a.durationMinutes)}
            </p>
            <p className="text-sm text-[#6b7280]">
              {copy.operatory}: {a.operatory}
            </p>
          </DrawerSection>
          <DrawerSection title={copy.status}>
            <div className="flex flex-wrap gap-1.5">
              <Chip active={a.status === "completed"} onClick={() => setAppointmentStatus(a.id, "completed")}>
                <CheckCircle2 aria-hidden className="size-3.5" /> {copy.markDone}
              </Chip>
              <Chip active={a.status === "no_show"} onClick={() => setAppointmentStatus(a.id, "no_show")}>
                <UserX aria-hidden className="size-3.5" /> {copy.noShow}
              </Chip>
              <Chip
                active={false}
                onClick={() => {
                  setAppointmentStatus(a.id, "cancelled");
                  onClose();
                }}
              >
                <Ban aria-hidden className="size-3.5" /> {copy.cancel}
              </Chip>
            </div>
          </DrawerSection>
          {p && (
            <DrawerSection title={dentavantaDeck.patientsScreen.drawer.subtitle}>
              <button
                type="button"
                onClick={() => {
                  setFocusPatient(p.id);
                  onNavigate("patients");
                }}
                className={cn("flex cursor-pointer items-center gap-3 rounded-lg bg-[#f1f3f8] p-3 text-left transition hover:bg-[#eaeef8]", FOCUS)}
              >
                <Avatar name={name} size="sm" />
                <span className="text-sm font-medium">{name}</span>
                <span className="ml-auto text-xs text-[#6b7280]">{p.phone}</span>
              </button>
            </DrawerSection>
          )}
        </>
      )}
    </Drawer>
  );
}

function BookingDrawer({ form, setForm }: { form: NewForm | null; setForm: React.Dispatch<React.SetStateAction<NewForm | null>> }) {
  const { patients, leads, bookAppointment } = useStore();
  const copy = dentavantaDeck.calendar.drawer;
  const [tab, setTab] = React.useState<"patient" | "lead">("patient");
  React.useEffect(() => {
    if (form?.who) setTab(form.who.kind);
  }, [form?.who]);

  const bookableLeads = leads.filter((l) => !l.convertedPatientId && l.stageId !== "lost");
  const set = (patch: Partial<NewForm>) => setForm((f) => (f ? { ...f, ...patch } : f));
  const people =
    tab === "patient"
      ? patients.filter((p) => p.status !== "dormant" || form?.who?.id === p.id).map((p) => ({ ref: { kind: "patient" as const, id: p.id }, name: `${p.firstName} ${p.lastInitial}.`, sub: p.phone }))
      : bookableLeads.map((l) => ({ ref: { kind: "lead" as const, id: l.id }, name: `${l.firstName} ${l.lastName}`, sub: dentavantaDeck.sourceLabels[l.source] }));

  return (
    <Drawer
      open={!!form}
      onClose={() => setForm(null)}
      icon={Plus}
      title={copy.newTitle}
      subtitle={copy.newSubtitle}
      footer={
        form && (
          <button
            type="button"
            disabled={!form.who}
            onClick={() => {
              if (!form.who) return;
              bookAppointment({ who: form.who, day: form.day, startMinute: form.startMinute, durationMinutes: form.durationMinutes, type: form.type, operatory: form.operatory });
              setForm(null);
            }}
            className={cn(BTN_PRIMARY, "w-full justify-center")}
          >
            {form.who ? `${copy.confirm}: ${formatDay(form.day)}, ${formatMinute(form.startMinute)}` : copy.pick}
          </button>
        )
      }
    >
      {form && (
        <>
          <DrawerSection title={copy.who}>
            <div className="flex gap-1.5">
              <Chip active={tab === "patient"} onClick={() => setTab("patient")}>
                {copy.patients}
              </Chip>
              <Chip active={tab === "lead"} onClick={() => setTab("lead")}>
                {copy.leads} ({bookableLeads.length})
              </Chip>
            </div>
            {tab === "lead" && <p className="text-xs text-[#6b7280]">{copy.leadNote}</p>}
            <div className="flex max-h-48 flex-col gap-1 overflow-y-auto rounded-lg border border-[#e6e8ec] p-1">
              {people.map((person) => {
                const active = form.who?.kind === person.ref.kind && form.who.id === person.ref.id;
                return (
                  <button
                    key={person.ref.id}
                    type="button"
                    onClick={() => set({ who: person.ref })}
                    aria-pressed={active}
                    className={cn("flex cursor-pointer items-center gap-2.5 rounded-md px-2 py-1.5 text-left transition", FOCUS, active ? "bg-[#eaeef8]" : "hover:bg-[#f1f3f8]")}
                  >
                    <Avatar name={person.name} size="sm" />
                    <span className="min-w-0 flex-1 truncate text-sm font-medium">{person.name}</span>
                    <span className="shrink-0 text-xs text-[#6b7280]">{person.sub}</span>
                  </button>
                );
              })}
            </div>
          </DrawerSection>
          <DrawerSection title={copy.type}>
            <div className="flex flex-wrap gap-1.5">
              {TYPES.map((t) => (
                <Chip key={t} active={form.type === t} onClick={() => set({ type: t })} color={TYPE_COLORS[t]}>
                  {dentavantaDeck.typeLabels[t]}
                </Chip>
              ))}
            </div>
          </DrawerSection>
          <DrawerSection title={copy.day}>
            <div className="flex flex-wrap gap-1.5">
              {Array.from({ length: 7 }, (_, i) => i).map((d) => (
                <Chip key={d} active={form.day === d} onClick={() => set({ day: d })}>
                  {formatDay(d)}
                </Chip>
              ))}
            </div>
          </DrawerSection>
          <DrawerSection title={copy.time}>
            <div className="grid grid-cols-4 gap-1.5">
              {TIMES.map((m) => (
                <Chip key={m} active={form.startMinute === m} onClick={() => set({ startMinute: m })}>
                  {formatMinute(m)}
                </Chip>
              ))}
            </div>
          </DrawerSection>
          <DrawerSection title={copy.length}>
            <div className="flex flex-wrap gap-1.5">
              {[30, 60, 90].map((m) => (
                <Chip key={m} active={form.durationMinutes === m} onClick={() => set({ durationMinutes: m })}>
                  {m} {copy.minutes}
                </Chip>
              ))}
              {["Op 1", "Op 2"].map((op) => (
                <Chip key={op} active={form.operatory === op} onClick={() => set({ operatory: op })}>
                  {op}
                </Chip>
              ))}
            </div>
          </DrawerSection>
        </>
      )}
    </Drawer>
  );
}
