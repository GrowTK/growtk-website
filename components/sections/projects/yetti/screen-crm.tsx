"use client";

import * as React from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import {
  ArrowDown,
  ArrowUp,
  CalendarCheck,
  CalendarPlus,
  Check,
  Download,
  GitMerge,
  Layers,
  Mail,
  MessageSquare,
  Phone,
  RefreshCw,
  Search,
  SlidersHorizontal,
  Sparkles,
  TrendingUp,
  UserPlus,
  Users,
  X,
  type LucideIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { yettiDeck, type BookingSource, type DemoBooking, type DemoContact } from "@/content/yetti";
import { bookingRef, dayDate, formatDay, formatMinute, minutesAgoLabel, useStore } from "./store";
import {
  BADGE,
  BTN_OUTLINE,
  BTN_PRIMARY,
  CARD,
  Dialog,
  FOCUS,
  Field,
  INPUT,
  InitialsTile,
  ModuleHeader,
  ModuleTabs,
  PlatformIcon,
  PLATFORM_LABEL,
  STATUS_BADGE,
  Sheet,
  SourceBadge,
  formatMoney,
  type TabDef,
} from "./ui";
import type { ScreenId } from "./app-frame";

/**
 * Yetti's CRM contacts tab (app/dashboard/crm): stat row, search and source
 * filter, the guest table, and the guest file drawer. Rows are built from the
 * shared store, so the guest the AI just booked in the inbox shows up here
 * with a "New" chip and their booking already attached.
 */

const ease = [0.22, 1, 0.36, 1] as const;

const SOURCES: BookingSource[] = ["Booking widget", "AI inbox", "GetYourGuide", "Viator", "Walk-in", "Phone"];

/** Contacts in the seed data; anything else was created while the deck was open. */
const SEED_IDS = new Set(yettiDeck.contacts.map((c) => c.id));

type Tab = "contacts" | "groups" | "consolidation" | "sync";
const TABS: TabDef<Tab>[] = [
  { id: "contacts", label: "Contacts", icon: Users },
  { id: "groups", label: "Groups", icon: Layers },
  { id: "consolidation", label: "Consolidation", icon: GitMerge },
  { id: "sync", label: "Sync", icon: RefreshCw },
];

const TAG_CHIP: Record<string, string> = {
  Repeat: "bg-sky-50 text-sky-700",
  VIP: "bg-amber-50 text-amber-700",
  Partner: "bg-violet-50 text-violet-700",
};

type Row = {
  contact: DemoContact;
  bookings: DemoBooking[];
  active: DemoBooking[];
  latest: DemoBooking | undefined;
  repeat: boolean;
  fresh: boolean;
  /** Created while the deck was open, pinned to the top. */
  session: boolean;
};

const shortDate = (offset: number) => dayDate(offset).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });

/* ---------------------------------------------------------------- stats */

const STAT_TONES = {
  slate: { tile: "bg-slate-100 text-slate-600", value: "text-slate-900" },
  blue: { tile: "bg-sky-50 text-primary", value: "text-primary" },
  green: { tile: "bg-emerald-50 text-emerald-600", value: "text-emerald-700" },
} as const;

function Stat({ icon: Icon, value, label, tone }: { icon: LucideIcon; value: number; label: string; tone: keyof typeof STAT_TONES }) {
  const reduce = useReducedMotion();
  const t = STAT_TONES[tone];
  return (
    <div className={cn(CARD, "flex items-center gap-3 px-4 py-3")}>
      <span className={cn("flex size-10 shrink-0 items-center justify-center rounded-xl", t.tile)}>
        <Icon aria-hidden className="size-4.5" />
      </span>
      <span className="min-w-0">
        <span className="relative block h-6 overflow-hidden">
          <AnimatePresence mode="popLayout" initial={false}>
            <motion.span
              key={value}
              initial={{ y: reduce ? 0 : "60%", opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: reduce ? 0 : "-60%", opacity: 0 }}
              transition={{ duration: 0.3, ease }}
              className={cn("block text-xl leading-6 font-bold tabular-nums", t.value)}
            >
              {value}
            </motion.span>
          </AnimatePresence>
        </span>
        <span className="block truncate text-xs text-slate-500">{label}</span>
      </span>
    </div>
  );
}

/* --------------------------------------------------------------- filter */

function SourceFilter({ value, onChange, counts }: { value: BookingSource | "all"; onChange: (v: BookingSource | "all") => void; counts: Record<string, number> }) {
  const [open, setOpen] = React.useState(false);
  const ref = React.useRef<HTMLDivElement>(null);
  React.useEffect(() => {
    if (!open) return;
    const onDown = (e: MouseEvent) => ref.current && !ref.current.contains(e.target as Node) && setOpen(false);
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    document.addEventListener("mousedown", onDown);
    window.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDown);
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);
  const options: (BookingSource | "all")[] = ["all", ...SOURCES];
  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        aria-expanded={open}
        aria-haspopup="menu"
        onClick={() => setOpen((o) => !o)}
        className={cn(BTN_OUTLINE, "h-11 rounded-xl", value !== "all" && "border-primary/40 bg-sky-50 text-primary hover:bg-sky-50")}
      >
        <SlidersHorizontal aria-hidden />
        <span className="hidden @md:inline">Filters</span>
        {value !== "all" && <span className="rounded-full bg-primary px-1.5 text-[10px] font-bold text-white">1</span>}
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            role="menu"
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.18, ease }}
            className="absolute top-full right-0 z-30 mt-2 w-60 rounded-2xl border border-slate-200 bg-white p-2 shadow-xl"
          >
            <p className="px-2 pt-1 pb-2 text-xs font-semibold text-slate-500">Source</p>
            {options.map((o) => {
              const on = o === value;
              return (
                <button
                  key={o}
                  type="button"
                  role="menuitemradio"
                  aria-checked={on}
                  onClick={() => {
                    onChange(o);
                    setOpen(false);
                  }}
                  className={cn(
                    "flex w-full cursor-pointer items-center gap-2 rounded-lg px-2 py-2 text-left text-sm transition-colors",
                    FOCUS,
                    on ? "bg-sky-50 font-semibold text-primary" : "text-slate-700 hover:bg-slate-50",
                  )}
                >
                  <span className="flex size-4 items-center justify-center">{on && <Check aria-hidden className="size-4" />}</span>
                  <span className="flex-1">{o === "all" ? "All sources" : o}</span>
                  <span className="text-xs text-slate-500 tabular-nums">{o === "all" ? counts.all : (counts[o] ?? 0)}</span>
                </button>
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/* --------------------------------------------------------------- cells */

function Waiver({ signed }: { signed: boolean }) {
  return signed ? (
    <span className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-700">
      <span className="flex size-4 items-center justify-center rounded-full bg-emerald-100">
        <Check aria-hidden className="size-3" />
      </span>
      Signed
    </span>
  ) : (
    <span className="text-xs text-slate-500">Not signed</span>
  );
}

function NewChip() {
  return (
    <span className={cn(BADGE, "bg-primary px-1.5 py-px text-[10px] text-white")}>
      <Sparkles aria-hidden className="size-2.5" />
      New
    </span>
  );
}

function RepeatChip() {
  return <span className={cn(BADGE, "bg-sky-50 px-1.5 py-px text-[10px] text-sky-700")}>Repeat</span>;
}

/* --------------------------------------------------------- guest file */

function GuestFile({ row, onClose, onNavigate }: { row: Row | null; onClose: () => void; onNavigate: (s: ScreenId) => void }) {
  const { activity, conversations, askWalkthrough } = useStore();
  const reduce = useReducedMotion();
  const c = row?.contact;
  const chats = c ? conversations.filter((v) => v.contactId === c.id) : [];
  const sorted = row ? [...row.bookings].sort((a, b) => b.day - a.day || b.startMinute - a.startMinute) : [];
  const guestsTotal = row ? row.active.reduce((s, b) => s + b.guests, 0) : 0;
  const spend = row ? row.active.reduce((s, b) => s + b.guests * activity(b.activityId).price, 0) : 0;

  return (
    <Sheet
      open={!!row}
      onClose={onClose}
      title="Guest file"
      description={c ? `Added ${formatDay(-c.addedDaysAgo).toLowerCase() === "today" ? "today" : formatDay(-c.addedDaysAgo)}` : undefined}
      footer={
        <div className="flex gap-2">
          <button type="button" onClick={() => askWalkthrough("Editing guest details")} className={cn(BTN_OUTLINE, "flex-1")}>
            Edit guest
          </button>
          <button type="button" onClick={() => onNavigate("booking")} className={cn(BTN_PRIMARY, "flex-1")}>
            <CalendarPlus aria-hidden />
            New booking
          </button>
        </div>
      }
    >
      {row && c && (
        <motion.div
          initial={reduce ? false : { opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, ease, delay: 0.08 }}
          className="space-y-6"
        >
          {/* Identity. */}
          <div className="flex items-start gap-3">
            <InitialsTile name={c.name} size="lg" />
            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-2">
                <h4 className="truncate text-lg font-bold text-slate-900">{c.name}</h4>
                {row.fresh && <NewChip />}
              </div>
              <div className="mt-1.5 flex flex-wrap gap-1.5">
                <SourceBadge source={c.source} />
                {c.tags.map((t) => (
                  <span key={t} className={cn(BADGE, TAG_CHIP[t] ?? "bg-slate-100 text-slate-600")}>
                    {t}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Contact. */}
          <dl className="divide-y divide-slate-100 rounded-xl border border-slate-200">
            {(
              [
                { icon: Mail, label: "Email", value: c.email },
                { icon: Phone, label: "Phone", value: c.phone },
              ] as const
            ).map((f) => (
              <div key={f.label} className="flex items-center gap-3 px-3 py-2.5">
                <f.icon aria-hidden className="size-4 shrink-0 text-slate-400" />
                <dt className="w-14 shrink-0 text-xs text-slate-500">{f.label}</dt>
                <dd className={cn("min-w-0 truncate text-sm", f.value ? "font-medium text-slate-800" : "text-slate-500")}>{f.value ?? "None"}</dd>
              </div>
            ))}
            <div className="flex items-center gap-3 px-3 py-2.5">
              <Check aria-hidden className="size-4 shrink-0 text-slate-400" />
              <dt className="w-14 shrink-0 text-xs text-slate-500">Waiver</dt>
              <dd>
                <Waiver signed={c.waiver} />
              </dd>
            </div>
          </dl>

          {/* Stats. */}
          <div className="grid grid-cols-3 gap-2">
            {[
              { label: "Bookings", value: String(row.active.length) },
              { label: "Guests total", value: String(guestsTotal) },
              { label: "Lifetime spend", value: formatMoney(spend) },
            ].map((s) => (
              <div key={s.label} className="rounded-xl bg-slate-50 px-3 py-2.5">
                <div className="text-base font-bold text-slate-900 tabular-nums">{s.value}</div>
                <div className="text-[11px] text-slate-500">{s.label}</div>
              </div>
            ))}
          </div>

          {/* Bookings. */}
          <section>
            <h5 className="mb-2 text-xs font-semibold text-slate-500">Bookings</h5>
            {sorted.length === 0 ? (
              <p className="rounded-xl border border-dashed border-slate-200 px-3 py-4 text-center text-sm text-slate-500">No bookings yet</p>
            ) : (
              <ul className="space-y-2">
                {sorted.map((b) => {
                  const a = activity(b.activityId);
                  return (
                    <li key={b.id} className="rounded-xl border border-slate-200 p-3">
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex min-w-0 items-center gap-2">
                          <span aria-hidden className="size-2.5 shrink-0 rounded-full" style={{ background: a.color }} />
                          <span className="truncate text-sm font-semibold text-slate-800">{a.name}</span>
                        </div>
                        <span className={cn(BADGE, "capitalize", STATUS_BADGE[b.status])}>{b.status}</span>
                      </div>
                      <div className="mt-1.5 flex flex-wrap items-center gap-x-2 gap-y-1 pl-4.5 text-xs text-slate-500">
                        <span>
                          {formatDay(b.day)}, {formatMinute(b.startMinute)}
                        </span>
                        <span aria-hidden>·</span>
                        <span>
                          {b.guests} {b.guests === 1 ? "guest" : "guests"}
                        </span>
                        <span aria-hidden>·</span>
                        <span className="font-mono text-[11px] text-slate-600">{bookingRef(b)}</span>
                      </div>
                    </li>
                  );
                })}
              </ul>
            )}
          </section>

          {/* Conversations. */}
          <section>
            <h5 className="mb-2 text-xs font-semibold text-slate-500">Conversations</h5>
            {chats.length === 0 ? (
              <p className="rounded-xl border border-dashed border-slate-200 px-3 py-4 text-center text-sm text-slate-500">No conversations with this guest</p>
            ) : (
              <ul className="space-y-2">
                {chats.map((v) => {
                  const last = v.messages[v.messages.length - 1];
                  return (
                    <li key={v.id} className="flex items-start gap-3 rounded-xl border border-slate-200 p-3">
                      <PlatformIcon platform={v.platform} className="mt-0.5 size-7 shrink-0" />
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2 text-xs">
                          <span className="font-semibold text-slate-800">{PLATFORM_LABEL[v.platform]}</span>
                          {last && <span className="text-slate-500">{minutesAgoLabel(last.minutesAgo)}</span>}
                        </div>
                        <p className="mt-0.5 line-clamp-2 text-xs text-slate-600">
                          {last ? `${last.from === "ai" ? "Yetti: " : last.from === "staff" ? "You: " : ""}${last.text}` : ""}
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={() => onNavigate("inbox")}
                        className={cn(
                          "inline-flex shrink-0 cursor-pointer items-center gap-1 rounded-full bg-sky-50 px-2.5 py-1 text-[11px] font-bold text-primary transition-colors hover:bg-sky-100",
                          FOCUS,
                        )}
                      >
                        <MessageSquare aria-hidden className="size-3" />
                        Open chat
                      </button>
                    </li>
                  );
                })}
              </ul>
            )}
          </section>
        </motion.div>
      )}
    </Sheet>
  );
}

/* ----------------------------------------------------------- add guest */

function AddGuestDialog({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { addContact, toast } = useStore();
  const [name, setName] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [phone, setPhone] = React.useState("");
  const close = React.useCallback(() => {
    setName("");
    setEmail("");
    setPhone("");
    onClose();
  }, [onClose]);
  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    addContact({ name: name.trim(), email: email.trim() || null, phone: phone.trim() || null, source: "Walk-in" });
    toast("Guest added", `${name.trim()} is now in your CRM`);
    close();
  };
  return (
    <Dialog open={open} onClose={close} title="Add guest" description="Create a guest record. Bookings and chats attach to it automatically.">
      <form onSubmit={submit} className="space-y-4">
        <Field label="Full name">
          <input autoFocus required value={name} onChange={(e) => setName(e.target.value)} placeholder="Alex Rivera" className={INPUT} />
        </Field>
        <Field label="Email">
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="alex@example.com" className={INPUT} />
        </Field>
        <Field label="Phone">
          <input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="+1 305 555 0100" className={INPUT} />
        </Field>
        <div className="flex justify-end gap-2 pt-1">
          <button type="button" onClick={close} className={BTN_OUTLINE}>
            Cancel
          </button>
          <button type="submit" disabled={!name.trim()} className={BTN_PRIMARY}>
            <UserPlus aria-hidden />
            Add guest
          </button>
        </div>
      </form>
    </Dialog>
  );
}

/* --------------------------------------------------------------- screen */

export function CrmScreen({ onNavigate }: { onNavigate: (s: ScreenId) => void }) {
  const { contacts, bookings, activity, askWalkthrough } = useStore();
  const reduce = useReducedMotion();
  const [query, setQuery] = React.useState("");
  const [source, setSource] = React.useState<BookingSource | "all">("all");
  const [desc, setDesc] = React.useState(true);
  const [openId, setOpenId] = React.useState<string | null>(null);
  const [adding, setAdding] = React.useState(false);

  const rows = React.useMemo<Row[]>(
    () =>
      contacts.map((contact) => {
        const own = bookings.filter((b) => b.contactId === contact.id);
        const active = own.filter((b) => b.status !== "cancelled");
        const pool = active.length ? active : own;
        const latest = pool.reduce<DemoBooking | undefined>((best, b) => (!best || b.day > best.day || (b.day === best.day && b.startMinute > best.startMinute) ? b : best), undefined);
        return {
          contact,
          bookings: own,
          active,
          latest,
          repeat: active.length >= 2,
          fresh: contact.addedDaysAgo === 0 && contact.source === "AI inbox",
          session: !SEED_IDS.has(contact.id),
        };
      }),
    [contacts, bookings],
  );

  const stats = React.useMemo(
    () => ({
      total: rows.length,
      repeat: rows.filter((r) => r.repeat || r.contact.tags.includes("Repeat")).length,
      booked30: rows.filter((r) => r.active.some((b) => b.createdDaysAgo <= 30)).length,
    }),
    [rows],
  );

  const counts = React.useMemo(() => {
    const out: Record<string, number> = { all: contacts.length };
    for (const c of contacts) out[c.source] = (out[c.source] ?? 0) + 1;
    return out;
  }, [contacts]);

  const visible = React.useMemo(() => {
    const q = query.trim().toLowerCase();
    const qDigits = q.replace(/\D/g, "");
    return rows
      .filter((r) => source === "all" || r.contact.source === source)
      .filter((r) => {
        if (!q) return true;
        const c = r.contact;
        return (
          c.name.toLowerCase().includes(q) ||
          (c.email ?? "").toLowerCase().includes(q) ||
          (qDigits.length > 2 && (c.phone ?? "").replace(/\D/g, "").includes(qDigits))
        );
      })
      .sort((a, b) => {
        if (a.session !== b.session) return a.session ? -1 : 1;
        // Guests without a booking sit at the bottom either way.
        if (!a.latest || !b.latest) return a.latest ? -1 : b.latest ? 1 : 0;
        const diff = a.latest.day - b.latest.day || a.latest.startMinute - b.latest.startMinute;
        return desc ? -diff : diff;
      });
  }, [rows, query, source, desc]);

  const openRow = openId ? (rows.find((r) => r.contact.id === openId) ?? null) : null;
  const closeFile = React.useCallback(() => setOpenId(null), []);
  const closeAdd = React.useCallback(() => setAdding(false), []);
  const go = (s: ScreenId) => {
    setOpenId(null);
    onNavigate(s);
  };

  const rowMotion = (i: number) => ({
    initial: reduce ? false : { opacity: 0, y: 4 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.25, ease, delay: reduce ? 0 : Math.min(i, 10) * 0.03 },
  });

  const SortIcon = desc ? ArrowDown : ArrowUp;

  return (
    <div className="@container min-h-full">
      <div className="bg-white">
        <ModuleHeader icon={Users} title="CRM" subtitle="Manage contacts, groups, campaigns and sync" />
        <ModuleTabs
          tabs={TABS}
          active="contacts"
          onChange={(id) => {
            if (id !== "contacts") askWalkthrough(`CRM ${TABS.find((t) => t.id === id)!.label.toLowerCase()}`);
          }}
        />
      </div>

      <div className="space-y-4 px-4 pt-5 pb-8 sm:px-6">
        {/* Stats. */}
        <div className="grid grid-cols-1 gap-3 @lg:grid-cols-3">
          <Stat icon={Users} value={stats.total} label="Total guests" tone="slate" />
          <Stat icon={TrendingUp} value={stats.repeat} label="Repeat guests" tone="blue" />
          <Stat icon={CalendarCheck} value={stats.booked30} label="Booked last 30d" tone="green" />
        </div>

        {/* Toolbar. */}
        <div className="flex flex-wrap items-center gap-2">
          <label className="relative min-w-0 flex-1 basis-56">
            <span className="sr-only">Search guests</span>
            <Search aria-hidden className="pointer-events-none absolute top-1/2 left-3.5 size-4 -translate-y-1/2 text-slate-400" />
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search by name, email or phone..."
              className={cn(INPUT, "h-11 bg-white pr-9 pl-10")}
            />
            {query && (
              <button
                type="button"
                aria-label="Clear search"
                onClick={() => setQuery("")}
                className={cn("absolute top-1/2 right-2 flex size-7 -translate-y-1/2 cursor-pointer items-center justify-center rounded-lg text-slate-400 hover:bg-slate-100 hover:text-slate-700", FOCUS)}
              >
                <X className="size-3.5" />
              </button>
            )}
          </label>
          <div className="flex items-center gap-2">
            <SourceFilter value={source} onChange={setSource} counts={counts} />
            <button type="button" aria-label="Export contacts as CSV" onClick={() => askWalkthrough("CSV export")} className={cn(BTN_OUTLINE, "size-11 rounded-xl px-0")}>
              <Download aria-hidden />
            </button>
            <button type="button" onClick={() => setAdding(true)} className={cn(BTN_PRIMARY, "h-11")}>
              <UserPlus aria-hidden />
              Add Guest
            </button>
          </div>
        </div>

        {source !== "all" && (
          <div className="flex items-center gap-2 text-xs text-slate-600">
            Showing guests from
            <button
              type="button"
              onClick={() => setSource("all")}
              className={cn(BADGE, "cursor-pointer bg-sky-50 py-1 text-primary transition-colors hover:bg-sky-100", FOCUS)}
              aria-label={`Remove source filter ${source}`}
            >
              {source}
              <X aria-hidden className="size-3" />
            </button>
          </div>
        )}

        {/* Table, from @3xl up. */}
        <div className={cn(CARD, "hidden overflow-hidden @3xl:block")}>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[860px] text-left text-sm">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50/60 text-xs font-semibold text-slate-500">
                  <th scope="col" className="px-4 py-3 font-semibold">Guest</th>
                  <th scope="col" className="px-4 py-3 font-semibold">Contact</th>
                  <th scope="col" className="px-4 py-3 font-semibold">Last activity</th>
                  <th scope="col" className="px-4 py-3 font-semibold">Source</th>
                  <th scope="col" className="px-4 py-3 font-semibold">Waiver</th>
                  <th scope="col" className="px-4 py-3 font-semibold">Bookings</th>
                  <th scope="col" className="px-4 py-3 font-semibold" aria-sort={desc ? "descending" : "ascending"}>
                    <button
                      type="button"
                      onClick={() => setDesc((d) => !d)}
                      className={cn("-mx-1.5 inline-flex cursor-pointer items-center gap-1 rounded-md px-1.5 py-0.5 text-slate-600 transition-colors hover:bg-slate-100 hover:text-slate-900", FOCUS)}
                    >
                      Last booking
                      <SortIcon aria-hidden className="size-3.5" />
                      <span className="sr-only">{desc ? "sorted newest first, click for oldest first" : "sorted oldest first, click for newest first"}</span>
                    </button>
                  </th>
                </tr>
              </thead>
              <tbody>
                {visible.map((r, i) => {
                  const c = r.contact;
                  return (
                    <motion.tr
                      key={c.id}
                      layout={reduce ? false : "position"}
                      {...rowMotion(i)}
                      tabIndex={0}
                      onClick={() => setOpenId(c.id)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" || e.key === " ") {
                          e.preventDefault();
                          setOpenId(c.id);
                        }
                      }}
                      aria-label={`Open guest file for ${c.name}`}
                      className={cn(
                        "cursor-pointer border-b border-slate-100 transition-colors last:border-0 focus-visible:bg-sky-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 focus-visible:ring-inset",
                        r.fresh || r.session ? "bg-sky-50/70 hover:bg-sky-50" : "hover:bg-slate-50",
                      )}
                    >
                      <td className="px-4 py-3.5">
                        <div className="flex items-center gap-3">
                          <InitialsTile name={c.name} />
                          <span className="font-semibold text-slate-900">{c.name}</span>
                          {(r.fresh || r.session) && <NewChip />}
                        </div>
                      </td>
                      <td className="px-4 py-3.5">
                        <div className="max-w-56 truncate text-slate-700">{c.email ?? "None"}</div>
                        {c.phone && <div className="text-xs text-slate-500">{c.phone}</div>}
                      </td>
                      <td className="px-4 py-3.5">
                        {r.latest ? (
                          <span className="flex max-w-48 items-start gap-2 text-slate-700">
                            <span aria-hidden className="mt-1.5 size-2 shrink-0 rounded-full" style={{ background: activity(r.latest.activityId).color }} />
                            {activity(r.latest.activityId).name}
                          </span>
                        ) : (
                          <span className="text-slate-500">None</span>
                        )}
                      </td>
                      <td className="px-4 py-3.5">
                        <SourceBadge source={c.source} />
                      </td>
                      <td className="px-4 py-3.5">
                        <Waiver signed={c.waiver} />
                      </td>
                      <td className="px-4 py-3.5">
                        <span className="flex items-center gap-2">
                          <span className="font-bold text-slate-900 tabular-nums">{r.active.length}</span>
                          {r.repeat && <RepeatChip />}
                        </span>
                      </td>
                      <td className="px-4 py-3.5 whitespace-nowrap text-slate-600">{r.latest ? shortDate(r.latest.day) : "None"}</td>
                    </motion.tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          {visible.length === 0 && <Empty onClear={() => (setQuery(""), setSource("all"))} />}
        </div>

        {/* Cards, below @3xl. */}
        <div className="space-y-2 @3xl:hidden">
          <div className="flex items-center justify-between px-1 text-xs text-slate-500">
            <span>
              {visible.length} {visible.length === 1 ? "guest" : "guests"}
            </span>
            <button
              type="button"
              onClick={() => setDesc((d) => !d)}
              className={cn("inline-flex cursor-pointer items-center gap-1 rounded-md px-1.5 py-1 font-semibold text-slate-600 hover:bg-slate-100", FOCUS)}
            >
              Last booking
              <SortIcon aria-hidden className="size-3.5" />
            </button>
          </div>
          {visible.map((r, i) => {
            const c = r.contact;
            return (
              <motion.button
                key={c.id}
                type="button"
                layout={reduce ? false : "position"}
                {...rowMotion(i)}
                onClick={() => setOpenId(c.id)}
                className={cn(
                  CARD,
                  "flex w-full cursor-pointer flex-col gap-2.5 p-3.5 text-left transition-colors",
                  FOCUS,
                  r.fresh || r.session ? "border-sky-200 bg-sky-50/70 hover:bg-sky-50" : "hover:bg-slate-50",
                )}
              >
                <span className="flex items-center gap-3">
                  <InitialsTile name={c.name} />
                  <span className="min-w-0 flex-1">
                    <span className="flex items-center gap-2">
                      <span className="truncate font-semibold text-slate-900">{c.name}</span>
                      {(r.fresh || r.session) && <NewChip />}
                    </span>
                    <span className="block truncate text-xs text-slate-500">{c.email ?? c.phone ?? "No contact details"}</span>
                  </span>
                  <span className="text-right">
                    <span className="block text-sm font-bold text-slate-900 tabular-nums">{r.active.length}</span>
                    <span className="block text-[10px] text-slate-500">bookings</span>
                  </span>
                </span>
                <span className="flex flex-wrap items-center gap-1.5">
                  <SourceBadge source={c.source} />
                  {r.repeat && <RepeatChip />}
                  <span className="ml-auto">
                    <Waiver signed={c.waiver} />
                  </span>
                </span>
                {r.latest && (
                  <span className="flex items-center gap-2 border-t border-slate-100 pt-2.5 text-xs text-slate-600">
                    <span aria-hidden className="size-2 shrink-0 rounded-full" style={{ background: activity(r.latest.activityId).color }} />
                    <span className="min-w-0 flex-1 truncate">{activity(r.latest.activityId).name}</span>
                    <span className="shrink-0 text-slate-500">{shortDate(r.latest.day)}</span>
                  </span>
                )}
              </motion.button>
            );
          })}
          {visible.length === 0 && (
            <div className={CARD}>
              <Empty onClear={() => (setQuery(""), setSource("all"))} />
            </div>
          )}
        </div>
      </div>

      <GuestFile row={openRow} onClose={closeFile} onNavigate={go} />
      <AddGuestDialog open={adding} onClose={closeAdd} />
    </div>
  );
}

function Empty({ onClear }: { onClear: () => void }) {
  return (
    <div className="flex flex-col items-center gap-2 px-4 py-10 text-center">
      <span className="flex size-10 items-center justify-center rounded-xl bg-slate-100 text-slate-400">
        <Search aria-hidden className="size-5" />
      </span>
      <p className="text-sm font-semibold text-slate-700">No guests match</p>
      <button type="button" onClick={onClear} className={cn(BTN_OUTLINE, "h-8 text-xs")}>
        Clear search and filters
      </button>
    </div>
  );
}
