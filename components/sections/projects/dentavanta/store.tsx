"use client";

import * as React from "react";
import {
  dentavantaDeck,
  type AppointmentStatus,
  type AppointmentType,
  type Channel,
  type ContactRef,
  type DemoAppointment,
  type DemoLead,
  type DemoMessage,
  type DemoPatient,
  type LeadStageId,
  type PatientStatus,
} from "@/content/dentavanta";

/**
 * One shared demo database for every Dentavanta slide, the clinic website
 * included. In the real product the Leads board, Calendar, Conversations and
 * Patients all read the same Aurora tables, so a form sent from a practice's
 * website is a lead at once, and booking that lead converts them into a
 * patient with a visit on the calendar. This store keeps that true for the
 * demo. It lives for as long as the deck is open.
 */

export type Toast = { id: number; title: string; description?: string };

export type NewWebLead = { firstName: string; lastName: string; phone: string; email: string; interest: string; message: string };

export type NewAppointment = {
  who: ContactRef;
  day: number;
  startMinute: number;
  durationMinutes: number;
  type: AppointmentType;
  operatory: string;
};

/** A booking the viewer asked for on another slide, picked up by the Calendar when it opens. */
export type BookingIntent = { who?: ContactRef; day?: number; startMinute?: number } | null;

type Store = {
  leads: DemoLead[];
  patients: DemoPatient[];
  appointments: DemoAppointment[];
  messages: DemoMessage[];
  toasts: Toast[];
  lead: (id: string) => DemoLead | undefined;
  patient: (id: string) => DemoPatient | undefined;
  contactName: (ref: ContactRef) => string;
  /** Every message for a contact, following a converted lead into its patient record. */
  thread: (ref: ContactRef) => DemoMessage[];
  addWebLead: (input: NewWebLead) => DemoLead;
  moveLead: (id: string, stageId: LeadStageId) => void;
  bookAppointment: (input: NewAppointment) => DemoAppointment;
  setAppointmentStatus: (id: string, status: AppointmentStatus) => void;
  setPatientStatus: (id: string, status: PatientStatus) => void;
  sendMessage: (ref: ContactRef, channel: Channel, body: string) => void;
  bookingIntent: BookingIntent;
  setBookingIntent: (intent: BookingIntent) => void;
  /** The patient the Patients slide should open, when another slide sent the viewer there. */
  focusPatient: string | null;
  setFocusPatient: (id: string | null) => void;
  toast: (title: string, description?: string) => void;
  walkthrough: string | null;
  askWalkthrough: (feature: string) => void;
  closeWalkthrough: () => void;
};

const StoreContext = React.createContext<Store | null>(null);

export function useStore(): Store {
  const store = React.useContext(StoreContext);
  if (!store) throw new Error("useStore must be used inside DentavantaStoreProvider");
  return store;
}

let nextId = 100;
const newId = (prefix: string) => `${prefix}${nextId++}`;

const AUTO_REPLY_MS = 1600;

export function DentavantaStoreProvider({ children }: { children: React.ReactNode }) {
  const [leads, setLeads] = React.useState(dentavantaDeck.leads);
  const [patients, setPatients] = React.useState(dentavantaDeck.patients);
  const [appointments, setAppointments] = React.useState(dentavantaDeck.appointments);
  const [messages, setMessages] = React.useState(dentavantaDeck.messages);
  const [toasts, setToasts] = React.useState<Toast[]>([]);
  const [walkthrough, setWalkthrough] = React.useState<string | null>(null);
  const [bookingIntent, setBookingIntent] = React.useState<BookingIntent>(null);
  const [focusPatient, setFocusPatient] = React.useState<string | null>(null);

  const timers = React.useRef<number[]>([]);
  React.useEffect(() => () => timers.current.forEach((t) => window.clearTimeout(t)), []);

  const stateRef = React.useRef({ leads, patients });
  stateRef.current = { leads, patients };

  const toast = React.useCallback((title: string, description?: string) => {
    const id = nextId++;
    setToasts((t) => [...t.slice(-2), { id, title, description }]);
    window.setTimeout(() => setToasts((t) => t.filter((x) => x.id !== id)), 3800);
  }, []);

  const addMessage = React.useCallback((m: Omit<DemoMessage, "id" | "minutesAgo">) => {
    setMessages((prev) => [...prev, { ...m, id: newId("m"), minutesAgo: 0 }]);
  }, []);

  const store = React.useMemo<Store>(() => {
    const lead = (id: string) => leads.find((l) => l.id === id);
    const patient = (id: string) => patients.find((p) => p.id === id);
    return {
      leads,
      patients,
      appointments,
      messages,
      toasts,
      toast,
      lead,
      patient,
      contactName: (ref) => {
        if (ref.kind === "lead") {
          const l = lead(ref.id);
          return l ? `${l.firstName} ${l.lastName}` : "Lead";
        }
        const p = patient(ref.id);
        return p ? `${p.firstName} ${p.lastInitial}.` : "Patient";
      },
      thread: (ref) => {
        const p = ref.kind === "patient" ? patient(ref.id) : undefined;
        return messages.filter(
          (m) => (m.contact.kind === ref.kind && m.contact.id === ref.id) || (p?.fromLeadId && m.contact.kind === "lead" && m.contact.id === p.fromLeadId),
        );
      },
      addWebLead: (input) => {
        const created: DemoLead = {
          id: newId("l"),
          firstName: input.firstName.trim() || "New",
          lastName: input.lastName.trim(),
          phone: input.phone.trim() || "(555) 000-0000",
          email: input.email.trim() || null,
          source: "web_form",
          stageId: "new",
          createdDaysAgo: 0,
          convertedPatientId: null,
        };
        setLeads((prev) => [created, ...prev]);
        const ref: ContactRef = { kind: "lead", id: created.id };
        const details = [input.interest && `Interested in: ${input.interest}.`, input.message.trim()].filter(Boolean).join(" ");
        addMessage({ contact: ref, channel: "form", from: "contact", body: details || "Appointment request from the website." });
        toast(dentavantaDeck.toasts.newLead, `${created.firstName} ${created.lastName}`.trim());
        // The practice's new lead workflow texts back a moment later.
        const timer = window.setTimeout(() => {
          addMessage({ contact: ref, channel: "sms", from: "automation", body: dentavantaDeck.toasts.autoReply.replace("{name}", created.firstName) });
        }, AUTO_REPLY_MS);
        timers.current.push(timer);
        return created;
      },
      moveLead: (id, stageId) => {
        setLeads((prev) => prev.map((l) => (l.id === id ? { ...l, stageId } : l)));
        const l = lead(id);
        const stage = dentavantaDeck.stages.find((s) => s.id === stageId);
        if (l && stage && l.stageId !== stageId) toast(dentavantaDeck.toasts.moved, `${l.firstName} ${l.lastName} to ${stage.name}`);
      },
      bookAppointment: (input) => {
        let patientId = input.who.id;
        let convertedName: string | null = null;
        if (input.who.kind === "lead") {
          const l = stateRef.current.leads.find((x) => x.id === input.who.id);
          if (l?.convertedPatientId) {
            patientId = l.convertedPatientId;
          } else if (l) {
            // Booking a lead converts them into a patient, like the real appointment drawer.
            const created: DemoPatient = {
              id: newId("p"),
              firstName: l.firstName,
              lastInitial: l.lastName.charAt(0).toUpperCase() || "N",
              phone: l.phone,
              status: "active",
              temperature: "warm",
              lastVisitDaysAgo: null,
              fromLeadId: l.id,
            };
            patientId = created.id;
            convertedName = `${l.firstName} ${l.lastName}`.trim();
            setPatients((prev) => [created, ...prev]);
            setLeads((prev) => prev.map((x) => (x.id === l.id ? { ...x, stageId: "booked", convertedPatientId: created.id } : x)));
          }
        }
        const appt: DemoAppointment = {
          id: newId("a"),
          patientId,
          day: input.day,
          startMinute: input.startMinute,
          durationMinutes: input.durationMinutes,
          type: input.type,
          status: "booked",
          bookedBy: "staff",
          operatory: input.operatory,
        };
        setAppointments((prev) => [...prev, appt]);
        toast(
          dentavantaDeck.toasts.booked,
          convertedName
            ? `${convertedName} ${dentavantaDeck.toasts.converted}`
            : `${dentavantaDeck.typeLabels[input.type]}, ${formatDay(input.day)} at ${formatMinute(input.startMinute)}`,
        );
        return appt;
      },
      setAppointmentStatus: (id, status) => {
        setAppointments((prev) => prev.map((a) => (a.id === id ? { ...a, status } : a)));
        toast(dentavantaDeck.toasts.apptStatus, dentavantaDeck.statusLabels[status]);
      },
      setPatientStatus: (id, status) => {
        setPatients((prev) => prev.map((p) => (p.id === id ? { ...p, status } : p)));
        const p = patient(id);
        if (p && p.status !== status) toast(dentavantaDeck.toasts.status, `${p.firstName} ${p.lastInitial}. is now ${dentavantaDeck.patientsScreen.columns[status]}`);
      },
      sendMessage: (ref, channel, body) => {
        addMessage({ contact: ref, channel, from: "staff", body });
        toast(dentavantaDeck.toasts.sent);
      },
      bookingIntent,
      setBookingIntent,
      focusPatient,
      setFocusPatient,
      walkthrough,
      askWalkthrough: (feature) => setWalkthrough(feature),
      closeWalkthrough: () => setWalkthrough(null),
    };
  }, [leads, patients, appointments, messages, toasts, toast, addMessage, bookingIntent, focusPatient, walkthrough]);

  return <StoreContext.Provider value={store}>{children}</StoreContext.Provider>;
}

/* ---------------------------------------------------------------------------
 * Dates. Day offsets are relative to today: 0 is today.
 * ------------------------------------------------------------------------- */

export function dayDate(offset: number): Date {
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  d.setDate(d.getDate() + offset);
  return d;
}

export function formatMinute(minute: number): string {
  const h = Math.floor(minute / 60) % 24;
  const m = minute % 60;
  return `${h % 12 === 0 ? 12 : h % 12}:${String(m).padStart(2, "0")} ${h < 12 ? "AM" : "PM"}`;
}

export function formatDay(offset: number, opts: Intl.DateTimeFormatOptions = { weekday: "short", month: "short", day: "numeric" }) {
  if (offset === 0) return "Today";
  if (offset === 1) return "Tomorrow";
  if (offset === -1) return "Yesterday";
  return dayDate(offset).toLocaleDateString("en-US", opts);
}

/** The real app's formatCardDate: long form, "June 6, 2026". */
export function formatCardDate(offset: number) {
  return dayDate(offset).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" });
}

export function relativeTime(minutesAgo: number) {
  if (minutesAgo < 1) return "now";
  if (minutesAgo < 60) return `${minutesAgo}m`;
  if (minutesAgo < 1440) return `${Math.floor(minutesAgo / 60)}h`;
  return `${Math.floor(minutesAgo / 1440)}d`;
}
