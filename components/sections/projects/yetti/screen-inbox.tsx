"use client";

import * as React from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import {
  ArrowLeft,
  Bot,
  BotOff,
  CalendarCheck,
  CalendarDays,
  CirclePause,
  Contact,
  FileText,
  Inbox,
  Info,
  Paperclip,
  Play,
  Search,
  Send,
  Settings2,
  Smile,
  UserPlus,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { yettiDeck, type DemoBooking, type DemoConversation, type DemoMessage, type Platform } from "@/content/yetti";
import type { ScreenId } from "./app-frame";
import { bookingRef, formatDay, formatMinute, minutesAgoLabel, useStore } from "./store";
import {
  BADGE,
  BTN_OUTLINE,
  BTN_PRIMARY,
  FOCUS,
  InitialsTile,
  PAYMENT_BADGE,
  PLATFORM_LABEL,
  PlatformIcon,
  STATUS_BADGE,
  Sheet,
  formatMoney,
} from "./ui";

/**
 * The Yetti inbox, copied from app/dashboard/inbox: conversation list with
 * platform filters and search, the chat thread with the per-chat AI toggle
 * and composer, plus a guest panel tying the chat to the CRM and calendar.
 * Every chat reads the shared store, so a trip Yetti books here lands on the
 * booking calendar, check-in desk and CRM slides too.
 */

type Filter = "all" | Platform;

const FILTERS: Filter[] = ["all", "whatsapp", "instagram", "messenger", "telegram", "gmail", "sms"];

/** Per-channel accents, literal class strings like the product's PLATFORM_CONFIG. */
const TONE: Record<Platform, { pill: string; rail: string; unread: string; bubble: string; name: string }> = {
  whatsapp: { pill: "border-green-200 bg-green-50 text-green-700", rail: "border-green-500", unread: "bg-green-500", bubble: "border-green-200", name: "text-green-700" },
  instagram: { pill: "border-pink-200 bg-pink-50 text-pink-700", rail: "border-pink-500", unread: "bg-pink-500", bubble: "border-pink-200", name: "text-pink-700" },
  messenger: { pill: "border-blue-200 bg-blue-50 text-blue-700", rail: "border-blue-500", unread: "bg-blue-500", bubble: "border-blue-200", name: "text-blue-700" },
  telegram: { pill: "border-sky-200 bg-sky-50 text-sky-700", rail: "border-sky-500", unread: "bg-sky-500", bubble: "border-sky-200", name: "text-sky-700" },
  gmail: { pill: "border-red-200 bg-red-50 text-red-700", rail: "border-red-500", unread: "bg-red-500", bubble: "border-red-200", name: "text-red-700" },
  sms: { pill: "border-emerald-200 bg-emerald-50 text-emerald-700", rail: "border-emerald-500", unread: "bg-emerald-500", bubble: "border-emerald-200", name: "text-emerald-700" },
};

const YETTI_FACE = yettiDeck.logo.src;

const lastOf = (c: DemoConversation): DemoMessage | undefined => c.messages[c.messages.length - 1];

function timeAgo(minutes: number) {
  const label = minutesAgoLabel(minutes);
  return label === "now" ? "Just now" : `${label} ago`;
}

/** Yetti's face in a rounded tile, the agent avatar on AI messages. */
function YettiFace({ className }: { className?: string }) {
  return (
    <span className={cn("flex shrink-0 items-center justify-center overflow-hidden rounded-lg bg-sky-50 ring-1 ring-sky-100", className)}>
      {/* eslint-disable-next-line @next/next/no-img-element -- tiny avatar, kept out of next/image's per-page budget */}
      <img src={YETTI_FACE} alt="" aria-hidden className="size-full object-cover" />
    </span>
  );
}

/** Guest initials with the channel logo in the corner, like PlatformIconOverlay. */
function GuestAvatar({ conversation, size = "md" }: { conversation: DemoConversation; size?: "sm" | "md" | "lg" }) {
  return (
    <span className="relative shrink-0">
      <InitialsTile
        name={conversation.guestName}
        className={size === "lg" ? "size-14 rounded-2xl text-base" : size === "sm" ? "size-8 text-[10px]" : "size-11 rounded-xl text-xs"}
      />
      <span className="absolute -right-1 -bottom-1 flex size-[18px] items-center justify-center rounded-full bg-white p-0.5 shadow-sm ring-1 ring-white">
        <PlatformIcon platform={conversation.platform} className="size-full" />
      </span>
    </span>
  );
}

/* ------------------------------------------------------------------ list */

function ConversationRow({
  conversation,
  selected,
  typing,
  onSelect,
}: {
  conversation: DemoConversation;
  selected: boolean;
  typing: boolean;
  onSelect: () => void;
}) {
  const last = lastOf(conversation);
  const tone = TONE[conversation.platform];
  const unread = conversation.unread > 0;
  const prefix = last?.from === "ai" ? "Yetti: " : last?.from === "staff" ? "You: " : "";
  return (
    <button
      type="button"
      onClick={onSelect}
      aria-current={selected ? "true" : undefined}
      className={cn(
        "group flex w-full cursor-pointer items-start gap-3 border-l-4 p-3 text-left transition-colors sm:p-4",
        FOCUS,
        "focus-visible:ring-inset focus-visible:ring-offset-0",
        selected ? cn("bg-white shadow-sm", tone.rail) : "border-transparent hover:bg-white/80",
      )}
    >
      <GuestAvatar conversation={conversation} />
      <span className="min-w-0 flex-1">
        <span className="mb-0.5 flex items-center justify-between gap-2">
          <span className={cn("truncate text-sm font-semibold", selected ? tone.name : "text-slate-900")}>{conversation.guestName}</span>
          <span className="shrink-0 text-[11px] text-slate-400 tabular-nums">{last ? minutesAgoLabel(last.minutesAgo) : ""}</span>
        </span>
        <span className="flex items-center gap-2">
          {typing ? (
            <span className="flex-1 truncate text-xs font-medium text-primary sm:text-sm">Yetti is typing...</span>
          ) : (
            <span className={cn("flex-1 truncate text-xs sm:text-sm", unread ? "font-medium text-slate-900" : "text-slate-500")}>
              {prefix}
              {last?.text ?? "No messages yet"}
            </span>
          )}
          {unread && (
            <span className={cn("flex h-5 min-w-5 shrink-0 items-center justify-center rounded-full px-1.5 text-[10px] font-bold text-white", tone.unread)}>
              {conversation.unread}
            </span>
          )}
        </span>
        <span className="mt-1.5 flex items-center gap-1.5">
          {conversation.aiEnabled ? (
            <span className={cn(BADGE, "bg-emerald-50 px-1.5 text-[10px] text-emerald-700")}>
              <Bot aria-hidden className="size-3" />
              AI
            </span>
          ) : (
            <span className={cn(BADGE, "bg-slate-100 px-1.5 text-[10px] text-slate-500")}>
              <BotOff aria-hidden className="size-3" />
              Team
            </span>
          )}
          <span className="truncate text-[11px] text-slate-400">{PLATFORM_LABEL[conversation.platform]}</span>
        </span>
      </span>
    </button>
  );
}

/* ---------------------------------------------------------------- thread */

function AIToggle({ enabled, onChange }: { enabled: boolean; onChange: (on: boolean) => void }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={enabled}
      aria-label={enabled ? "Yetti AI is on for this chat. Turn it off" : "Yetti AI is off for this chat. Turn it on"}
      onClick={() => onChange(!enabled)}
      className={cn(
        "relative flex cursor-pointer items-center gap-1.5 rounded-lg border px-2.5 py-1.5 text-xs font-semibold transition-colors",
        FOCUS,
        enabled ? "border-emerald-200 bg-emerald-50 text-emerald-700 hover:bg-emerald-100" : "border-slate-200 bg-slate-100 text-slate-500 hover:bg-slate-200",
      )}
    >
      {enabled ? <Bot aria-hidden className="size-3.5" /> : <BotOff aria-hidden className="size-3.5" />}
      <span className="hidden sm:inline">{enabled ? "Yetti AI on" : "Yetti AI off"}</span>
      <span aria-hidden className={cn("absolute -top-0.5 -right-0.5 size-2 rounded-full", enabled ? "bg-emerald-500" : "bg-slate-400")} />
    </button>
  );
}

function BookingCard({ booking, onNavigate }: { booking: DemoBooking; onNavigate: (s: ScreenId) => void }) {
  const { activity } = useStore();
  const a = activity(booking.activityId);
  const pay = PAYMENT_BADGE[booking.payment];
  return (
    <div className="mt-2 w-72 max-w-full overflow-hidden rounded-2xl border border-slate-200 bg-white text-left shadow-sm">
      <div className="flex items-center justify-between gap-2 border-b border-slate-100 px-4 py-3">
        <span className="flex items-center gap-2">
          <span className="flex size-7 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600">
            <CalendarCheck aria-hidden className="size-4" />
          </span>
          <span className="text-sm font-bold text-slate-900">Booking confirmed</span>
        </span>
        <span className={cn(BADGE, pay.className)}>{pay.label}</span>
      </div>
      <div className="space-y-2 px-4 py-3 text-[13px]">
        <p className="flex items-center gap-2 font-semibold text-slate-900">
          <span aria-hidden className="size-2 shrink-0 rounded-full" style={{ backgroundColor: a.color }} />
          {a.name}
        </p>
        <dl className="grid grid-cols-2 gap-x-3 gap-y-1.5">
          <div>
            <dt className="text-[11px] text-slate-400">Date</dt>
            <dd className="font-medium text-slate-700">{formatDay(booking.day)}</dd>
          </div>
          <div>
            <dt className="text-[11px] text-slate-400">Time</dt>
            <dd className="font-medium text-slate-700">{formatMinute(booking.startMinute)}</dd>
          </div>
          <div>
            <dt className="text-[11px] text-slate-400">Guests</dt>
            <dd className="font-medium text-slate-700">{booking.guests}</dd>
          </div>
          <div>
            <dt className="text-[11px] text-slate-400">Total</dt>
            <dd className="font-semibold text-slate-900 tabular-nums">{formatMoney(booking.guests * a.price)}</dd>
          </div>
        </dl>
        <p className="rounded-lg bg-slate-50 px-2.5 py-1.5 font-mono text-[11px] text-slate-600">{bookingRef(booking)}</p>
      </div>
      <div className="px-4 pb-4">
        <button type="button" onClick={() => onNavigate("booking")} className={cn(BTN_OUTLINE, "h-9 w-full text-xs")}>
          <CalendarDays aria-hidden />
          View in calendar
        </button>
      </div>
    </div>
  );
}

function MessageBubble({
  message,
  conversation,
  onNavigate,
}: {
  message: DemoMessage;
  conversation: DemoConversation;
  onNavigate: (s: ScreenId) => void;
}) {
  const { bookings } = useStore();
  const booking = message.bookingId ? bookings.find((b) => b.id === message.bookingId) : undefined;
  const tone = TONE[conversation.platform];

  if (message.from === "guest") {
    return (
      <div className="flex justify-start gap-2.5 sm:gap-3">
        <InitialsTile name={conversation.guestName} size="sm" className="mt-0.5" />
        <div className="flex max-w-[85%] flex-col items-start sm:max-w-[70%]">
          <div className={cn("rounded-2xl rounded-tl-sm border bg-white px-3.5 py-2.5 text-slate-800 shadow-sm sm:px-4", tone.bubble)}>
            <p className="text-[13px] leading-relaxed break-words whitespace-pre-wrap sm:text-sm">{message.text}</p>
          </div>
          <span className="mt-1 px-1 text-[10px] text-slate-400">{timeAgo(message.minutesAgo)}</span>
        </div>
      </div>
    );
  }

  const ai = message.from === "ai";
  return (
    <div className="flex justify-end gap-2.5 sm:gap-3">
      <div className="flex max-w-[85%] flex-col items-end sm:max-w-[70%]">
        <div
          className={cn(
            "rounded-2xl rounded-tr-sm px-3.5 py-2.5 text-white shadow-sm sm:px-4",
            ai ? "bg-gradient-to-br from-primary to-[#25577f]" : "bg-slate-800",
          )}
        >
          <p className="text-[13px] leading-relaxed break-words whitespace-pre-wrap sm:text-sm">{message.text}</p>
        </div>
        {booking && <BookingCard booking={booking} onNavigate={onNavigate} />}
        <span className="mt-1 flex items-center gap-1.5 px-1 text-[10px] text-slate-400">
          {ai ? (
            <span className={cn(BADGE, "bg-primary/10 px-1.5 py-0 text-[10px] text-primary")}>
              <Bot aria-hidden className="size-3" />
              AI
            </span>
          ) : (
            <span className="font-medium text-slate-500">{yettiDeck.userName}</span>
          )}
          {timeAgo(message.minutesAgo)}
        </span>
      </div>
      {ai ? <YettiFace className="mt-0.5 size-8" /> : <InitialsTile name={yettiDeck.userName} size="sm" className="mt-0.5 bg-slate-800 text-white" />}
    </div>
  );
}

function TypingIndicator() {
  const reduce = useReducedMotion();
  return (
    <div className="flex justify-end gap-2.5 sm:gap-3" role="status" aria-label="Yetti is typing">
      <div className="flex items-center gap-1 rounded-2xl rounded-tr-sm bg-primary/10 px-4 py-3">
        {[0, 1, 2].map((i) => (
          <motion.span
            key={i}
            aria-hidden
            className="size-1.5 rounded-full bg-primary"
            animate={reduce ? undefined : { opacity: [0.3, 1, 0.3], y: [0, -2, 0] }}
            transition={reduce ? undefined : { duration: 0.9, repeat: Infinity, delay: i * 0.15, ease: "easeInOut" }}
          />
        ))}
      </div>
      <YettiFace className="size-8" />
    </div>
  );
}

/* ----------------------------------------------------------- guest panel */

function GuestDetails({ conversation, onNavigate }: { conversation: DemoConversation; onNavigate: (s: ScreenId) => void }) {
  const store = useStore();
  const contact = conversation.contactId ? store.contact(conversation.contactId) : undefined;
  const bookings = contact ? store.bookings.filter((b) => b.contactId === contact.id).sort((a, b) => b.day - a.day || a.startMinute - b.startMinute) : [];

  return (
    <div className="space-y-5">
      <div className="flex flex-col items-center text-center">
        <GuestAvatar conversation={conversation} size="lg" />
        <p className="mt-3 text-base font-bold text-slate-900">{conversation.guestName}</p>
        <p className="mt-0.5 max-w-full text-xs break-all text-slate-500">{conversation.handle}</p>
        <span className={cn(BADGE, "mt-2 border", TONE[conversation.platform].pill)}>
          <PlatformIcon platform={conversation.platform} className="size-3" />
          {PLATFORM_LABEL[conversation.platform]}
        </span>
      </div>

      <section className="rounded-2xl border border-slate-200 bg-white p-4">
        <h3 className="text-xs font-semibold text-slate-500">CRM</h3>
        {contact ? (
          <div className="mt-2 space-y-2 text-[13px]">
            <span className={cn(BADGE, "bg-emerald-50 text-emerald-700")}>
              <Contact aria-hidden className="size-3" />
              In your CRM
            </span>
            {contact.email && <p className="truncate text-slate-700">{contact.email}</p>}
            {contact.phone && <p className="text-slate-700 tabular-nums">{contact.phone}</p>}
            <p className="text-slate-500">Source: {contact.source}</p>
            {contact.tags.length > 0 && (
              <div className="flex flex-wrap gap-1">
                {contact.tags.map((t) => (
                  <span key={t} className={cn(BADGE, "bg-slate-100 text-slate-600")}>
                    {t}
                  </span>
                ))}
              </div>
            )}
          </div>
        ) : (
          <div className="mt-2 space-y-1.5 text-[13px]">
            <span className={cn(BADGE, "bg-amber-50 text-amber-700")}>
              <UserPlus aria-hidden className="size-3" />
              New guest
            </span>
            <p className="leading-relaxed text-slate-500">Added to the CRM automatically on their first booking.</p>
          </div>
        )}
      </section>

      <section className="rounded-2xl border border-slate-200 bg-white p-4">
        <h3 className="text-xs font-semibold text-slate-500">Bookings</h3>
        {bookings.length === 0 ? (
          <p className="mt-2 text-[13px] text-slate-400">No bookings yet</p>
        ) : (
          <ul className="mt-2 space-y-2">
            {bookings.map((b) => {
              const a = store.activity(b.activityId);
              return (
                <li key={b.id} className="flex items-start justify-between gap-2 rounded-xl bg-slate-50 px-3 py-2">
                  <span className="min-w-0">
                    <span className="flex items-center gap-1.5 text-[13px] font-semibold text-slate-800">
                      <span aria-hidden className="size-2 shrink-0 rounded-full" style={{ backgroundColor: a.color }} />
                      <span className="truncate">{a.short}</span>
                    </span>
                    <span className="mt-0.5 block text-[11px] text-slate-500">
                      {formatDay(b.day)}, {formatMinute(b.startMinute)}, {b.guests} guests
                    </span>
                  </span>
                  <span className={cn(BADGE, "capitalize", STATUS_BADGE[b.status])}>{b.status}</span>
                </li>
              );
            })}
          </ul>
        )}
      </section>

      <div className="space-y-2">
        <button type="button" onClick={() => onNavigate("crm")} className={cn(BTN_OUTLINE, "w-full")}>
          <Contact aria-hidden />
          Open in CRM
        </button>
        <button type="button" onClick={() => store.askWalkthrough("Assistant settings")} className={cn(BTN_OUTLINE, "w-full text-slate-600")}>
          <Settings2 aria-hidden />
          Assistant settings
        </button>
      </div>
    </div>
  );
}

/* ---------------------------------------------------------------- screen */

export function InboxScreen({ onNavigate }: { onNavigate: (s: ScreenId) => void }) {
  const store = useStore();
  const reduce = useReducedMotion();
  const [filter, setFilter] = React.useState<Filter>("all");
  const [query, setQuery] = React.useState("");
  const [selectedId, setSelectedId] = React.useState("v1");
  const [showChat, setShowChat] = React.useState(false);
  const [detailsOpen, setDetailsOpen] = React.useState(false);
  const [draft, setDraft] = React.useState("");
  const threadRef = React.useRef<HTMLDivElement>(null);

  // Opening a chat marks it read, which lets Yetti answer a waiting guest live.
  const markRead = React.useEffectEvent((id: string) => store.markRead(id));
  React.useEffect(() => {
    markRead(selectedId);
  }, [selectedId]);

  const conversations = React.useMemo(() => {
    const q = query.trim().toLowerCase();
    return store.conversations
      .filter((c) => filter === "all" || c.platform === filter)
      .filter(
        (c) =>
          !q ||
          c.guestName.toLowerCase().includes(q) ||
          c.handle.toLowerCase().includes(q) ||
          c.messages.some((m) => m.text.toLowerCase().includes(q)),
      )
      .sort((a, b) => (lastOf(a)?.minutesAgo ?? Infinity) - (lastOf(b)?.minutesAgo ?? Infinity));
  }, [store.conversations, filter, query]);

  const counts = React.useMemo(() => {
    const out: Partial<Record<Filter, number>> = { all: store.conversations.length };
    for (const c of store.conversations) out[c.platform] = (out[c.platform] ?? 0) + 1;
    return out;
  }, [store.conversations]);

  const selected = store.conversations.find((c) => c.id === selectedId);
  const isTyping = selected ? store.typing.includes(selected.id) : false;
  const nextLine = selected ? store.nextGuestLine(selected.id) : null;
  const guestWaiting = selected ? lastOf(selected)?.from === "guest" : false;
  const messageCount = selected?.messages.length ?? 0;

  // Keep the newest message in view. Scrolls the thread only, never the deck.
  const lastScrolled = React.useRef<string | null>(null);
  React.useEffect(() => {
    const el = threadRef.current;
    if (!el) return;
    const jump = lastScrolled.current !== selectedId || reduce;
    lastScrolled.current = selectedId;
    el.scrollTo({ top: el.scrollHeight, behavior: jump ? "auto" : "smooth" });
  }, [selectedId, messageCount, isTyping, reduce]);

  const open = (id: string) => {
    setSelectedId(id);
    setShowChat(true);
    setDraft("");
  };

  const send = (e?: React.FormEvent) => {
    e?.preventDefault();
    const text = draft.trim();
    if (!text || !selected) return;
    store.sendStaffMessage(selected.id, text);
    setDraft("");
  };

  return (
    <div className="absolute inset-0 flex overflow-hidden bg-white">
      {/* Conversation list. */}
      <div className={cn("w-full shrink-0 flex-col overflow-hidden border-r border-slate-200 bg-slate-50/50 md:flex md:w-80 lg:w-[22rem]", showChat ? "hidden" : "flex")}>
        <div className="shrink-0 border-b border-slate-200 bg-white p-3">
          <div className="relative">
            <Search aria-hidden className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-slate-400" />
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search conversations"
              aria-label="Search conversations"
              className="h-10 w-full rounded-xl border border-slate-200 bg-white pr-9 pl-9 text-sm text-slate-900 transition-colors placeholder:text-slate-400 focus:border-primary focus-visible:ring-2 focus-visible:ring-primary/20 focus-visible:outline-none [&::-webkit-search-cancel-button]:hidden"
            />
            {query && (
              <button
                type="button"
                onClick={() => setQuery("")}
                aria-label="Clear search"
                className={cn("absolute top-1/2 right-2 flex size-6 -translate-y-1/2 cursor-pointer items-center justify-center rounded-md text-slate-400 hover:bg-slate-100 hover:text-slate-700", FOCUS)}
              >
                <X className="size-3.5" />
              </button>
            )}
          </div>

          <div role="group" aria-label="Filter by channel" className="mt-3 flex flex-wrap gap-1.5">
            {FILTERS.map((f) => {
              const on = filter === f;
              const label = f === "all" ? "All" : PLATFORM_LABEL[f];
              return (
                <button
                  key={f}
                  type="button"
                  aria-pressed={on}
                  onClick={() => setFilter(f)}
                  className={cn(
                    "flex cursor-pointer items-center gap-1.5 rounded-xl border px-2.5 py-1 text-xs font-semibold whitespace-nowrap transition-colors",
                    FOCUS,
                    on
                      ? f === "all"
                        ? "border-primary bg-primary text-white"
                        : TONE[f].pill
                      : "border-slate-200 bg-white text-slate-500 hover:border-slate-300 hover:text-slate-800",
                  )}
                >
                  {f === "all" ? <Inbox aria-hidden className="size-3.5" /> : <PlatformIcon platform={f} className="size-3.5" />}
                  {label}
                  {(counts[f] ?? 0) > 0 && <span className={cn("tabular-nums", on ? "opacity-80" : "text-slate-400")}>{counts[f]}</span>}
                </button>
              );
            })}
          </div>
          <p className="mt-2 text-xs text-slate-400">{conversations.length} conversations</p>
        </div>

        <div className="min-h-0 flex-1 overflow-y-auto">
          {conversations.length === 0 ? (
            <div className="flex flex-col items-center px-6 py-12 text-center">
              <span className="flex size-12 items-center justify-center rounded-full bg-slate-100">
                <Search aria-hidden className="size-5 text-slate-400" />
              </span>
              <p className="mt-3 text-sm font-medium text-slate-900">No conversations match</p>
              <button
                type="button"
                onClick={() => {
                  setQuery("");
                  setFilter("all");
                }}
                className={cn("mt-2 cursor-pointer rounded-md text-sm font-semibold text-primary hover:underline", FOCUS)}
              >
                Clear filters
              </button>
            </div>
          ) : (
            <div className="divide-y divide-slate-100">
              {conversations.map((c) => (
                <ConversationRow key={c.id} conversation={c} selected={c.id === selectedId} typing={store.typing.includes(c.id)} onSelect={() => open(c.id)} />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Chat thread. */}
      <div className={cn("relative min-w-0 flex-1 flex-col bg-white md:flex", showChat ? "flex" : "hidden")}>
        {selected ? (
          <>
            <div className="flex min-h-16 shrink-0 items-center justify-between gap-3 border-b border-slate-100 bg-white px-4 py-2 sm:min-h-20 sm:px-6">
              <div className="flex min-w-0 flex-1 items-center gap-2 sm:gap-4">
                <button
                  type="button"
                  onClick={() => setShowChat(false)}
                  aria-label="Back to conversations"
                  className={cn("-ml-2 flex size-9 shrink-0 cursor-pointer items-center justify-center rounded-xl text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-700 md:hidden", FOCUS)}
                >
                  <ArrowLeft className="size-5" />
                </button>
                <GuestAvatar conversation={selected} />
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <h2 className="truncate text-sm font-bold text-slate-900 sm:text-base">{selected.guestName}</h2>
                    <span className={cn(BADGE, "hidden border sm:inline-flex", TONE[selected.platform].pill)}>{PLATFORM_LABEL[selected.platform]}</span>
                  </div>
                  <p className="truncate text-xs text-slate-500">{selected.handle}</p>
                </div>
              </div>
              <div className="flex shrink-0 items-center gap-1.5">
                <AIToggle enabled={selected.aiEnabled} onChange={(on) => store.setAI(selected.id, on)} />
                <button
                  type="button"
                  onClick={() => setDetailsOpen(true)}
                  aria-label="Guest details"
                  className={cn("flex size-9 cursor-pointer items-center justify-center rounded-xl text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-700 xl:hidden", FOCUS)}
                >
                  <Info className="size-4" />
                </button>
              </div>
            </div>

            <div ref={threadRef} className="min-h-0 flex-1 space-y-4 overflow-y-auto bg-slate-50/40 p-4 sm:space-y-5 sm:p-6" aria-live="polite">
              <AnimatePresence key={selected.id} initial={false}>
                {selected.messages.map((m) => (
                  <motion.div
                    key={m.id}
                    initial={{ opacity: 0, y: reduce ? 0 : 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.25, ease: "easeOut" }}
                  >
                    <MessageBubble message={m} conversation={selected} onNavigate={onNavigate} />
                  </motion.div>
                ))}
                {isTyping && (
                  <motion.div
                    key="typing"
                    initial={{ opacity: 0, y: reduce ? 0 : 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.2, ease: "easeOut" }}
                  >
                    <TypingIndicator />
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <div className="shrink-0 border-t border-slate-200 bg-white p-3 sm:p-4">
              {nextLine && (
                <button
                  type="button"
                  onClick={() => store.sendGuestLine(selected.id)}
                  className={cn(
                    "mb-3 flex w-full cursor-pointer items-center gap-3 rounded-2xl border border-dashed border-primary/40 bg-sky-50/70 px-3 py-2.5 text-left transition-colors hover:border-primary hover:bg-sky-50",
                    FOCUS,
                  )}
                >
                  <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-primary text-white">
                    <Play aria-hidden className="size-3.5 translate-x-px" />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block text-[11px] font-semibold text-primary">Demo: play the guest&apos;s next message</span>
                    <span className="block truncate text-[13px] text-slate-700">&ldquo;{nextLine}&rdquo;</span>
                  </span>
                </button>
              )}
              {!selected.aiEnabled && guestWaiting && (
                <div className="mb-3 flex items-center gap-2.5 rounded-xl bg-amber-50 px-3 py-2 text-[13px] text-amber-800">
                  <CirclePause aria-hidden className="size-4 shrink-0" />
                  <span className="min-w-0 flex-1">Yetti is paused in this chat, so your team replies.</span>
                  <button
                    type="button"
                    onClick={() => store.setAI(selected.id, true)}
                    className={cn("shrink-0 cursor-pointer rounded-md font-semibold text-amber-900 underline-offset-2 hover:underline", FOCUS)}
                  >
                    Turn Yetti on
                  </button>
                </div>
              )}
              <form onSubmit={send} className="flex items-end gap-2 sm:gap-3">
                <button
                  type="button"
                  onClick={() => store.askWalkthrough("Attachments")}
                  aria-label="Attach a file"
                  className={cn("flex size-10 shrink-0 cursor-pointer items-center justify-center rounded-xl text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-700", FOCUS)}
                >
                  <Paperclip className="size-5" />
                </button>
                <button
                  type="button"
                  onClick={() => store.askWalkthrough("Reply templates")}
                  aria-label="Insert a reply template"
                  className={cn("hidden size-10 shrink-0 cursor-pointer items-center justify-center rounded-xl text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-700 sm:flex", FOCUS)}
                >
                  <FileText className="size-5" />
                </button>
                <input
                  value={draft}
                  onChange={(e) => setDraft(e.target.value)}
                  placeholder="Type a message"
                  aria-label="Message"
                  className="h-10 min-w-0 flex-1 rounded-xl border border-slate-200 bg-slate-50 px-4 text-sm text-slate-900 transition-colors placeholder:text-slate-400 focus:border-primary focus:bg-white focus-visible:ring-2 focus-visible:ring-primary/20 focus-visible:outline-none"
                />
                <button
                  type="button"
                  onClick={() => store.askWalkthrough("Emoji picker")}
                  aria-label="Add emoji"
                  className={cn("hidden size-10 shrink-0 cursor-pointer items-center justify-center rounded-xl text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-700 sm:flex", FOCUS)}
                >
                  <Smile className="size-5" />
                </button>
                <button type="submit" disabled={!draft.trim()} aria-label="Send message" className={cn(BTN_PRIMARY, "size-10 rounded-xl px-0")}>
                  <Send />
                </button>
              </form>
            </div>
          </>
        ) : (
          <div className="flex flex-1 flex-col items-center justify-center p-6 text-center">
            <YettiFace className="size-14 rounded-2xl" />
            <p className="mt-3 text-sm font-medium text-slate-900">Pick a conversation</p>
          </div>
        )}
      </div>

      {/* Guest panel. */}
      {selected && (
        <aside aria-label="Guest details" className="hidden w-72 shrink-0 overflow-y-auto border-l border-slate-200 bg-slate-50/60 p-5 xl:block">
          <GuestDetails conversation={selected} onNavigate={onNavigate} />
        </aside>
      )}

      {selected && (
        <Sheet open={detailsOpen} onClose={() => setDetailsOpen(false)} title={selected.guestName} description={PLATFORM_LABEL[selected.platform]}>
          <GuestDetails
            conversation={selected}
            onNavigate={(s) => {
              setDetailsOpen(false);
              onNavigate(s);
            }}
          />
        </Sheet>
      )}
    </div>
  );
}
