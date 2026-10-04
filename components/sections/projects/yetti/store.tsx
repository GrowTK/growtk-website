"use client";

import * as React from "react";
import {
  yettiDeck,
  type BookingSource,
  type DemoActivity,
  type DemoBooking,
  type DemoContact,
  type DemoConversation,
  type DemoMessage,
} from "@/content/yetti";

/**
 * One shared demo database for every Yetti product slide. In the real app
 * the Inbox, Booking System, Check-In and CRM all read the same Supabase
 * tables, so a trip the AI books in a WhatsApp chat is on the calendar, the
 * check-in desk and the guest's CRM file at once. This store keeps that true
 * for the demo. It lives for as long as the deck is open.
 */

export type Toast = { id: number; title: string; description?: string };

export type NewBooking = {
  activityId: string;
  day: number;
  startMinute: number;
  guests: number;
  source: BookingSource;
  /** An existing contact, or the details to create one. */
  contactId?: string;
  guest?: { name: string; email: string | null; phone: string | null };
};

type Store = {
  activities: DemoActivity[];
  contacts: DemoContact[];
  bookings: DemoBooking[];
  conversations: DemoConversation[];
  /** Conversation ids Yetti is currently typing a reply in. */
  typing: string[];
  toasts: Toast[];
  activity: (id: string) => DemoActivity;
  contact: (id: string) => DemoContact | undefined;
  /** Seats already taken on one departure (cancelled bookings excluded). */
  seatsTaken: (activityId: string, day: number, startMinute: number) => number;
  addBooking: (input: NewBooking) => DemoBooking;
  setBookingStatus: (bookingId: string, status: DemoBooking["status"]) => void;
  signWaiver: (bookingId: string) => void;
  checkIn: (bookingId: string) => void;
  addContact: (input: { name: string; email: string | null; phone: string | null; source: BookingSource }) => DemoContact;
  /** The guest's next scripted message in a conversation, or null when the script is done. */
  nextGuestLine: (conversationId: string) => string | null;
  sendGuestLine: (conversationId: string) => void;
  sendStaffMessage: (conversationId: string, text: string) => void;
  setAI: (conversationId: string, on: boolean) => void;
  markRead: (conversationId: string) => void;
  toast: (title: string, description?: string) => void;
  /** What the viewer clicked that isn't in the demo, or null when the walkthrough modal is closed. */
  walkthrough: string | null;
  askWalkthrough: (feature: string) => void;
  closeWalkthrough: () => void;
};

const StoreContext = React.createContext<Store | null>(null);

export function useStore(): Store {
  const store = React.useContext(StoreContext);
  if (!store) throw new Error("useStore must be used inside YettiStoreProvider");
  return store;
}

let nextId = 100;
const newId = (prefix: string) => `${prefix}${nextId++}`;

const CODE_CHARS = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
function newCode() {
  let code = "";
  for (let i = 0; i < 4; i++) code += CODE_CHARS[Math.floor(Math.random() * CODE_CHARS.length)];
  return code;
}

const TYPING_MS = 1400;

export function YettiStoreProvider({ children }: { children: React.ReactNode }) {
  const [contacts, setContacts] = React.useState(yettiDeck.contacts);
  const [bookings, setBookings] = React.useState(yettiDeck.bookings);
  const [conversations, setConversations] = React.useState(yettiDeck.conversations);
  /** How many scripted steps Yetti has answered, per conversation. */
  const [answered, setAnswered] = React.useState<Record<string, number>>({});
  const [typing, setTyping] = React.useState<string[]>([]);
  const [toasts, setToasts] = React.useState<Toast[]>([]);
  const [walkthrough, setWalkthrough] = React.useState<string | null>(null);

  // Timers outlive slide changes on purpose: Yetti finishes its reply even if
  // the viewer pages to the calendar to watch the booking land.
  const timers = React.useRef<number[]>([]);
  const pending = React.useRef(new Set<string>());
  React.useEffect(() => () => timers.current.forEach((t) => window.clearTimeout(t)), []);

  // Refs so the delayed AI reply reads current state, not the closure's.
  const stateRef = React.useRef({ contacts, bookings, conversations, answered });
  stateRef.current = { contacts, bookings, conversations, answered };

  const toast = React.useCallback((title: string, description?: string) => {
    const id = nextId++;
    setToasts((t) => [...t.slice(-2), { id, title, description }]);
    window.setTimeout(() => setToasts((t) => t.filter((x) => x.id !== id)), 3800);
  }, []);

  const activity = React.useCallback((id: string) => yettiDeck.activities.find((a) => a.id === id) ?? yettiDeck.activities[0]!, []);

  const addContact = React.useCallback<Store["addContact"]>((input) => {
    const created: DemoContact = { id: newId("c"), addedDaysAgo: 0, waiver: false, tags: [], ...input };
    setContacts((prev) => [created, ...prev]);
    return created;
  }, []);

  const addBooking = React.useCallback<Store["addBooking"]>(
    (input) => {
      let contactId = input.contactId;
      if (!contactId && input.guest) {
        const match = stateRef.current.contacts.find((c) => c.name.toLowerCase() === input.guest!.name.toLowerCase());
        contactId = match?.id ?? addContact({ ...input.guest, source: input.source }).id;
      }
      const booking: DemoBooking = {
        id: newId("b"),
        code: newCode(),
        contactId: contactId ?? "",
        activityId: input.activityId,
        day: input.day,
        startMinute: input.startMinute,
        guests: input.guests,
        status: "confirmed",
        payment: input.source === "AI inbox" ? "paid" : "unpaid",
        waiverSigned: false,
        checkedIn: false,
        source: input.source,
        createdDaysAgo: 0,
      };
      setBookings((prev) => [booking, ...prev]);
      // A guest with an earlier booking becomes a repeat guest, like the CRM's own badge.
      setContacts((prev) =>
        prev.map((c) =>
          c.id === booking.contactId && !c.tags.includes("Repeat") && stateRef.current.bookings.some((b) => b.contactId === c.id)
            ? { ...c, tags: ["Repeat", ...c.tags] }
            : c,
        ),
      );
      return booking;
    },
    [addContact],
  );

  const appendMessage = React.useCallback((conversationId: string, message: Omit<DemoMessage, "id" | "minutesAgo">, patch?: Partial<DemoConversation>) => {
    setConversations((prev) =>
      prev.map((c) => (c.id === conversationId ? { ...c, ...patch, messages: [...c.messages, { id: newId("m"), minutesAgo: 0, ...message }] } : c)),
    );
  }, []);

  /** Yetti answers the current scripted step, booking the trip when the step says so. */
  const reply = React.useCallback(
    (conversationId: string) => {
      const { conversations: convs, answered: done } = stateRef.current;
      const conv = convs.find((c) => c.id === conversationId);
      const step = conv?.script?.[done[conversationId] ?? 0];
      if (!conv || !step || !conv.aiEnabled || pending.current.has(conversationId)) return;
      pending.current.add(conversationId);
      setTyping((t) => (t.includes(conversationId) ? t : [...t, conversationId]));
      const timer = window.setTimeout(() => {
        pending.current.delete(conversationId);
        setTyping((t) => t.filter((id) => id !== conversationId));
        const live = stateRef.current.conversations.find((c) => c.id === conversationId);
        if (!live?.aiEnabled) return;
        let bookingId: string | undefined;
        let contactId = live.contactId;
        if (step.book) {
          const booking = addBooking({
            ...step.book,
            source: "AI inbox",
            contactId: contactId ?? undefined,
            guest: contactId ? undefined : { name: live.guestName, email: null, phone: live.platform === "whatsapp" || live.platform === "sms" ? live.handle : null },
          });
          bookingId = booking.id;
          contactId = booking.contactId;
          const a = yettiDeck.activities.find((x) => x.id === step.book!.activityId);
          toast("New booking from the AI inbox", `${live.guestName}, ${a?.short ?? "trip"}, ${step.book.guests} guests`);
        }
        appendMessage(conversationId, { from: "ai", text: step.ai, bookingId }, { contactId });
        setAnswered((prev) => ({ ...prev, [conversationId]: (prev[conversationId] ?? 0) + 1 }));
      }, TYPING_MS);
      timers.current.push(timer);
    },
    [addBooking, appendMessage, toast],
  );

  const store = React.useMemo<Store>(
    () => ({
      activities: yettiDeck.activities,
      contacts,
      bookings,
      conversations,
      typing,
      toasts,
      toast,
      walkthrough,
      askWalkthrough: (feature) => setWalkthrough(feature),
      closeWalkthrough: () => setWalkthrough(null),
      activity,
      contact: (id) => contacts.find((c) => c.id === id),
      seatsTaken: (activityId, day, startMinute) =>
        bookings
          .filter((b) => b.activityId === activityId && b.day === day && b.startMinute === startMinute && b.status !== "cancelled")
          .reduce((sum, b) => sum + b.guests, 0),
      addBooking,
      addContact,
      setBookingStatus: (id, status) => setBookings((prev) => prev.map((b) => (b.id === id ? { ...b, status } : b))),
      signWaiver: (id) => {
        setBookings((prev) => prev.map((b) => (b.id === id ? { ...b, waiverSigned: true } : b)));
        const booking = bookings.find((b) => b.id === id);
        if (booking) setContacts((prev) => prev.map((c) => (c.id === booking.contactId ? { ...c, waiver: true } : c)));
      },
      checkIn: (id) => setBookings((prev) => prev.map((b) => (b.id === id ? { ...b, checkedIn: true } : b))),
      nextGuestLine: (conversationId) => {
        const conv = conversations.find((c) => c.id === conversationId);
        const step = conv?.script?.[answered[conversationId] ?? 0];
        if (!conv || !step) return null;
        // The guest's line for this step is already on screen and waiting for Yetti.
        const last = conv.messages[conv.messages.length - 1];
        return last?.from === "guest" && last.text === step.guest ? null : step.guest;
      },
      sendGuestLine: (conversationId) => {
        const conv = conversations.find((c) => c.id === conversationId);
        const step = conv?.script?.[answered[conversationId] ?? 0];
        if (!conv || !step) return;
        appendMessage(conversationId, { from: "guest", text: step.guest });
        if (conv.aiEnabled) reply(conversationId);
      },
      sendStaffMessage: (conversationId, text) => appendMessage(conversationId, { from: "staff", text }),
      setAI: (conversationId, on) => {
        setConversations((prev) => prev.map((c) => (c.id === conversationId ? { ...c, aiEnabled: on } : c)));
        if (!on) return;
        // Switching Yetti back on answers a guest who is still waiting.
        const conv = conversations.find((c) => c.id === conversationId);
        const step = conv?.script?.[answered[conversationId] ?? 0];
        const last = conv?.messages[conv.messages.length - 1];
        if (step && last?.from === "guest" && last.text === step.guest) {
          stateRef.current.conversations = stateRef.current.conversations.map((c) => (c.id === conversationId ? { ...c, aiEnabled: true } : c));
          reply(conversationId);
        }
      },
      markRead: (conversationId) => {
        const conv = conversations.find((c) => c.id === conversationId);
        if (!conv) return;
        if (conv.unread) setConversations((prev) => prev.map((c) => (c.id === conversationId ? { ...c, unread: 0 } : c)));
        // Opening a chat where the guest is waiting lets Yetti answer live.
        const step = conv.script?.[answered[conversationId] ?? 0];
        const last = conv.messages[conv.messages.length - 1];
        if (conv.aiEnabled && step && last?.from === "guest" && last.text === step.guest) reply(conversationId);
      },
    }),
    [contacts, bookings, conversations, typing, toasts, toast, walkthrough, activity, addBooking, addContact, answered, appendMessage, reply],
  );

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

/** Whole days from today to `date` (both at midnight). */
export function dayOffset(date: Date): number {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  return Math.round((d.getTime() - dayDate(0).getTime()) / 86_400_000);
}

export function formatMinute(minute: number): string {
  const h = Math.floor(minute / 60) % 24;
  const m = minute % 60;
  return `${h % 12 === 0 ? 12 : h % 12}:${String(m).padStart(2, "0")} ${h < 12 ? "AM" : "PM"}`;
}

export function formatRange(start: number, duration: number) {
  return `${formatMinute(start)} to ${formatMinute(start + duration)}`;
}

export function formatDay(offset: number, opts: Intl.DateTimeFormatOptions = { weekday: "short", month: "short", day: "numeric" }) {
  if (offset === 0) return "Today";
  if (offset === 1) return "Tomorrow";
  if (offset === -1) return "Yesterday";
  return dayDate(offset).toLocaleDateString("en-US", opts);
}

/** BK-YYYYMMDD-XXXX, dated on the day the booking was made, like the real references. */
export function bookingRef(b: Pick<DemoBooking, "code" | "createdDaysAgo">) {
  const d = dayDate(-b.createdDaysAgo);
  const ymd = `${d.getFullYear()}${String(d.getMonth() + 1).padStart(2, "0")}${String(d.getDate()).padStart(2, "0")}`;
  return `BK-${ymd}-${b.code}`;
}

export function minutesAgoLabel(minutes: number) {
  if (minutes < 1) return "now";
  if (minutes < 60) return `${minutes}m`;
  if (minutes < 1440) return `${Math.floor(minutes / 60)}h`;
  return `${Math.floor(minutes / 1440)}d`;
}
