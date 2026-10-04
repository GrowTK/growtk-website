"use client";

import * as React from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import {
  Anchor,
  Ban,
  BookOpen,
  CalendarDays,
  ChevronLeft,
  ChevronRight,
  CircleCheck,
  CircleX,
  Clock,
  CreditCard,
  FileText,
  Hash,
  Mail,
  MailOpen,
  Minus,
  Phone,
  Plus,
  ScanLine,
  Search,
  Sparkles,
  Target,
  Ticket,
  UserCheck,
  Users,
  type LucideIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { yettiDeck, type BookingStatus, type DemoActivity, type DemoBooking } from "@/content/yetti";
import { bookingRef, dayDate, dayOffset, formatDay, formatMinute, formatRange, useStore } from "./store";
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
  PAYMENT_BADGE,
  STATUS_BADGE,
  Sheet,
  SourceBadge,
  formatMoney,
  type TabDef,
} from "./ui";
import type { ScreenId } from "./app-frame";

/* ------------------------------------------------------------------ setup */

const START_HOUR = 7;
const END_HOUR = 20;
const HOUR_H = 56;
const GRID_H = (END_HOUR - START_HOUR) * HOUR_H;
const RULER_W = 56;
/** Share of the total a deposit covers, for the "paid so far" line. */
const DEPOSIT_RATE = 0.2;
const SEED_IDS = new Set(yettiDeck.bookings.map((b) => b.id));
const isFresh = (b: DemoBooking) => !SEED_IDS.has(b.id);

const STATUS_LABEL: Record<BookingStatus, string> = { confirmed: "Confirmed", pending: "Pending", cancelled: "Cancelled" };
const STATUS_ICON: Record<BookingStatus, LucideIcon> = { confirmed: CircleCheck, pending: Clock, cancelled: CircleX };

type Tab = "calendar" | "bookings" | "activities" | "waivers" | "coupons" | "inquiries";
type View = "day" | "week";

type Departure = {
  key: string;
  activity: DemoActivity;
  day: number;
  start: number;
  end: number;
  bookings: DemoBooking[];
  booked: number;
  revenue: number;
  aiNew: boolean;
};

type Preset = { activityId: string; day: number; start: number } | null;

const depKey = (activityId: string, day: number, start: number) => `${activityId}:${day}:${start}`;

function buildDepartures(day: number, activities: DemoActivity[], bookings: DemoBooking[]): Departure[] {
  const out: Departure[] = [];
  for (const a of activities) {
    const starts = new Set(a.startMinutes);
    for (const b of bookings) if (b.activityId === a.id && b.day === day) starts.add(b.startMinute);
    for (const start of starts) {
      const list = bookings.filter((b) => b.activityId === a.id && b.day === day && b.startMinute === start && b.status !== "cancelled");
      const booked = list.reduce((n, b) => n + b.guests, 0);
      out.push({
        key: depKey(a.id, day, start),
        activity: a,
        day,
        start,
        end: start + a.durationMinutes,
        bookings: list,
        booked,
        revenue: booked * a.price,
        aiNew: list.some((b) => b.source === "AI inbox" && isFresh(b)),
      });
    }
  }
  return out.sort((x, y) => x.start - y.start);
}

/** Overlapping departures sit side by side: lanes are packed per overlap cluster. */
function layoutLanes(deps: Departure[]) {
  const sorted = [...deps].sort((a, b) => a.start - b.start || b.end - a.end);
  const out: { dep: Departure; lane: number; lanes: number }[] = [];
  let cluster: { dep: Departure; lane: number }[] = [];
  let laneEnds: number[] = [];
  let clusterEnd = -1;
  const flush = () => {
    const lanes = Math.max(1, laneEnds.length);
    for (const c of cluster) out.push({ ...c, lanes });
    cluster = [];
    laneEnds = [];
    clusterEnd = -1;
  };
  for (const dep of sorted) {
    if (cluster.length && dep.start >= clusterEnd) flush();
    let lane = laneEnds.findIndex((end) => end <= dep.start);
    if (lane === -1) lane = laneEnds.length;
    laneEnds[lane] = dep.end;
    cluster.push({ dep, lane });
    clusterEnd = Math.max(clusterEnd, dep.end);
  }
  flush();
  return out;
}

const longDate = (offset: number) => dayDate(offset).toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric", year: "numeric" });
const shortDate = (offset: number) => dayDate(offset).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
const weekday = (offset: number) => dayDate(offset).toLocaleDateString("en-US", { weekday: "short" });
const hourLabel = (h: number) => `${h % 12 === 0 ? 12 : h % 12} ${h < 12 ? "AM" : "PM"}`;
const weekStart = (offset: number) => offset - dayDate(offset).getDay();

/** Upcoming first (soonest at the top), then past trips, most recent first. */
function sortBookings(list: DemoBooking[]) {
  return [...list].sort((a, b) => {
    const au = a.day >= 0;
    const bu = b.day >= 0;
    if (au !== bu) return au ? -1 : 1;
    const diff = a.day * 1440 + a.startMinute - (b.day * 1440 + b.startMinute);
    return au ? diff : -diff;
  });
}

/* ----------------------------------------------------------------- screen */

export function BookingScreen({ onNavigate }: { onNavigate: (s: ScreenId) => void }) {
  const store = useStore();
  const { activities, bookings, askWalkthrough, toast, activity } = store;
  const reduce = useReducedMotion();

  const [tab, setTab] = React.useState<Tab>("calendar");
  const [view, setView] = React.useState<View>("day");
  const [selectedDay, setSelectedDay] = React.useState(0);
  const [slotKey, setSlotKey] = React.useState<string | null>(null);
  const [detailId, setDetailId] = React.useState<string | null>(null);
  const [dialog, setDialog] = React.useState<{ open: boolean; preset: Preset; n: number }>({ open: false, preset: null, n: 0 });
  const [flashKey, setFlashKey] = React.useState<string | null>(null);
  const [scrollTo, setScrollTo] = React.useState<{ minute: number; n: number } | null>(null);
  const gridRef = React.useRef<HTMLDivElement>(null);

  const live = bookings.filter((b) => b.status !== "cancelled");
  const signed = bookings.filter((b) => b.waiverSigned).length;

  const tabs: TabDef<Tab>[] = [
    { id: "calendar", label: "Calendar", icon: CalendarDays },
    { id: "bookings", label: "Bookings", icon: BookOpen, count: bookings.length },
    { id: "activities", label: "Activities", icon: Target, count: activities.length },
    { id: "waivers", label: "Waivers", icon: FileText },
    { id: "coupons", label: "Coupons", icon: Ticket },
    { id: "inquiries", label: "Inquiries", icon: MailOpen },
  ];
  const unavailable: Record<string, string> = {
    activities: "Managing activities",
    waivers: "Waiver templates",
    coupons: "Coupons and discounts",
    inquiries: "Booking inquiries",
  };

  // Departures for the days in view, live from the store.
  const days = view === "day" ? [selectedDay] : Array.from({ length: 7 }, (_, i) => weekStart(selectedDay) + i);
  const departuresByDay = days.map((d) => buildDepartures(d, activities, bookings));
  const inView = departuresByDay.flat();
  const allSlots = [...departuresByDay.flat()];
  const slot = slotKey ? (allSlots.find((d) => d.key === slotKey) ?? findSlot(slotKey)) : null;

  function findSlot(key: string): Departure | null {
    const [aid, d, s] = key.split(":");
    const day = Number(d);
    return buildDepartures(day, activities, bookings).find((x) => x.activity.id === aid && x.start === Number(s)) ?? null;
  }

  // Scroll the time grid (never the deck) to a departure after it was booked.
  React.useEffect(() => {
    if (!scrollTo || !gridRef.current) return;
    const top = Math.max(0, (scrollTo.minute / 60 - START_HOUR) * HOUR_H - 24);
    gridRef.current.scrollTo({ top, behavior: reduce ? "auto" : "smooth" });
  }, [scrollTo, reduce, view, selectedDay, tab]);

  React.useEffect(() => {
    if (!flashKey) return;
    const t = window.setTimeout(() => setFlashKey(null), 2600);
    return () => window.clearTimeout(t);
  }, [flashKey]);

  const openNew = (preset: Preset = null) => setDialog((d) => ({ open: true, preset, n: d.n + 1 }));

  const onCreated = (b: DemoBooking) => {
    const a = activity(b.activityId);
    const guest = store.contact(b.contactId)?.name ?? "Guest";
    setDialog((d) => ({ ...d, open: false }));
    setSlotKey(null);
    setTab("calendar");
    setSelectedDay(b.day);
    setFlashKey(depKey(b.activityId, b.day, b.startMinute));
    setScrollTo((s) => ({ minute: b.startMinute, n: (s?.n ?? 0) + 1 }));
    toast("Booking created", `${guest}, ${a.short}, ${formatDay(b.day)} at ${formatMinute(b.startMinute)}`);
  };

  const step = (dir: -1 | 1) => setSelectedDay((d) => d + dir * (view === "week" ? 7 : 1));

  return (
    <div className="absolute inset-0">
      <div className="h-full overflow-y-auto">
        <ModuleHeader
          icon={Anchor}
          title="Booking System"
          subtitle="Manage boat tours, bookings, waivers and availability"
          stats={[
            { icon: Target, value: activities.length, label: "Activities", tone: "blue" },
            { icon: BookOpen, value: live.length, label: "Bookings", tone: "green" },
            { icon: FileText, value: signed, label: "Waivers", tone: "amber" },
          ]}
        />
        <ModuleTabs tabs={tabs} active={tab} onChange={(id) => (id === "calendar" || id === "bookings" ? setTab(id) : askWalkthrough(unavailable[id] ?? "This tab"))} />

        <div className="p-4 sm:p-6">
          {tab === "calendar" ? (
            <div className={cn(CARD, "overflow-hidden")}>
              {/* Toolbar */}
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 px-3 py-3 sm:px-5">
                <div className="flex min-w-0 items-center gap-1">
                  <IconButton label={view === "week" ? "Previous week" : "Previous day"} onClick={() => step(-1)}>
                    <ChevronLeft className="size-4" />
                  </IconButton>
                  <h2 className="min-w-0 truncate px-1 text-base font-bold tracking-tight text-slate-900 sm:text-lg">
                    {view === "day" ? longDate(selectedDay) : `${shortDate(days[0]!).replace(/, \d{4}$/, "")} to ${shortDate(days[6]!)}`}
                  </h2>
                  <IconButton label={view === "week" ? "Next week" : "Next day"} onClick={() => step(1)}>
                    <ChevronRight className="size-4" />
                  </IconButton>
                  {selectedDay !== 0 && (
                    <button type="button" onClick={() => setSelectedDay(0)} className={cn("ml-1 cursor-pointer rounded-full px-2.5 py-1 text-xs font-semibold text-primary transition-colors hover:bg-sky-50", FOCUS)}>
                      Today
                    </button>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-0.5 rounded-full bg-slate-100 p-1">
                    {(["day", "week", "month"] as const).map((v) => {
                      const on = v === view;
                      return (
                        <button
                          key={v}
                          type="button"
                          aria-pressed={on}
                          onClick={() => (v === "month" ? askWalkthrough("The month view") : setView(v))}
                          className={cn(
                            "cursor-pointer rounded-full px-3 py-1 text-[13px] font-medium transition-colors",
                            FOCUS,
                            on ? "bg-white text-slate-900 shadow-sm" : "text-slate-500 hover:text-slate-800",
                          )}
                        >
                          {v === "day" ? "Day" : v === "week" ? "Week" : "Month"}
                        </button>
                      );
                    })}
                  </div>
                  <button type="button" onClick={() => openNew({ activityId: activities[0]!.id, day: Math.max(0, selectedDay), start: activities[0]!.startMinutes[0]! })} className={BTN_PRIMARY}>
                    <Plus />
                    <span className="hidden sm:inline">New Booking</span>
                    <span className="sm:hidden">New</span>
                  </button>
                </div>
              </div>

              <div className="lg:grid lg:grid-cols-[232px_minmax(0,1fr)]">
                {/* Left rail */}
                <aside className="hidden border-r border-slate-100 p-4 lg:block">
                  <MiniMonth selectedDay={selectedDay} bookings={live} onPick={(d) => setSelectedDay(d)} />
                  <ViewSummary deps={inView} activities={activities} />
                </aside>

                {/* Grid */}
                <TimeGrid
                  gridRef={gridRef}
                  days={days}
                  week={view === "week"}
                  departuresByDay={departuresByDay}
                  flashKey={flashKey}
                  onOpen={(d) => setSlotKey(d.key)}
                  onPickDay={(d) => {
                    setSelectedDay(d);
                    setView("day");
                  }}
                />
              </div>
            </div>
          ) : (
            <BookingsTable onOpen={setDetailId} onNew={() => openNew(null)} />
          )}
        </div>
      </div>

      {/* Departure drawer */}
      <Sheet
        open={!!slot}
        onClose={() => setSlotKey(null)}
        title={slot?.activity.name ?? ""}
        description={slot ? `${longDate(slot.day)}, ${formatRange(slot.start, slot.activity.durationMinutes)}` : undefined}
        footer={
          slot && (
            <div className="flex flex-col gap-2">
              <button
                type="button"
                disabled={slot.booked >= slot.activity.capacity}
                onClick={() => openNew({ activityId: slot.activity.id, day: slot.day, start: slot.start })}
                className={cn(BTN_PRIMARY, "w-full")}
              >
                <Plus />
                {slot.booked >= slot.activity.capacity ? "This departure is full" : "Add booking to this departure"}
              </button>
              <button type="button" onClick={() => askWalkthrough("Blocking a departure")} className={cn(BTN_OUTLINE, "w-full border-rose-100 bg-rose-50 text-rose-600 hover:bg-rose-100")}>
                <Ban />
                Block this departure
              </button>
            </div>
          )
        }
      >
        {slot && <SlotDetail slot={slot} onOpenBooking={(id) => { setSlotKey(null); setDetailId(id); }} />}
      </Sheet>

      {/* Booking drawer */}
      <BookingDetail bookingId={detailId} onClose={() => setDetailId(null)} onNavigate={onNavigate} />

      <Dialog open={dialog.open} onClose={() => setDialog((d) => ({ ...d, open: false }))} title="New Booking" description="Walk-ins and phone bookings, straight onto the calendar." wide>
        <NewBookingForm key={dialog.n} preset={dialog.preset} onCreated={onCreated} onCancel={() => setDialog((d) => ({ ...d, open: false }))} />
      </Dialog>
    </div>
  );
}

/* ------------------------------------------------------------- small bits */

function IconButton({ label, onClick, children }: { label: string; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      type="button"
      aria-label={label}
      title={label}
      onClick={onClick}
      className={cn("flex size-8 shrink-0 cursor-pointer items-center justify-center rounded-full text-slate-500 transition-colors hover:bg-slate-100 hover:text-slate-900", FOCUS)}
    >
      {children}
    </button>
  );
}

function StatusBadge({ status }: { status: BookingStatus }) {
  const Icon = STATUS_ICON[status];
  return (
    <span className={cn(BADGE, STATUS_BADGE[status], "border", status === "confirmed" ? "border-emerald-200" : status === "pending" ? "border-amber-200" : "border-slate-200")}>
      <Icon aria-hidden className="size-3" />
      {STATUS_LABEL[status]}
    </span>
  );
}

function AiBadge({ fresh }: { fresh: boolean }) {
  return (
    <span className={cn(BADGE, fresh ? "bg-primary text-white" : "bg-primary/10 text-primary")}>
      <Sparkles aria-hidden className="size-3" />
      {fresh ? "Just booked by AI" : "AI booked"}
    </span>
  );
}

/* ---------------------------------------------------------- mini calendar */

function MiniMonth({ selectedDay, bookings, onPick }: { selectedDay: number; bookings: DemoBooking[]; onPick: (offset: number) => void }) {
  const sel = dayDate(selectedDay);
  const [month, setMonth] = React.useState(() => new Date(sel.getFullYear(), sel.getMonth(), 1));
  React.useEffect(() => {
    setMonth(new Date(sel.getFullYear(), sel.getMonth(), 1));
    // eslint-disable-next-line react-hooks/exhaustive-deps -- follow the selected day's month
  }, [selectedDay]);

  const daysWithBookings = new Set(bookings.map((b) => b.day));
  const first = month.getDay();
  const count = new Date(month.getFullYear(), month.getMonth() + 1, 0).getDate();
  const cells: (number | null)[] = [...Array.from({ length: first }, () => null), ...Array.from({ length: count }, (_, i) => i + 1)];
  const shift = (n: number) => setMonth((m) => new Date(m.getFullYear(), m.getMonth() + n, 1));

  return (
    <div>
      <div className="flex items-center justify-between">
        <IconButton label="Previous month" onClick={() => shift(-1)}>
          <ChevronLeft className="size-3.5" />
        </IconButton>
        <p className="text-sm font-bold text-slate-900">{month.toLocaleDateString("en-US", { month: "short", year: "numeric" })}</p>
        <IconButton label="Next month" onClick={() => shift(1)}>
          <ChevronRight className="size-3.5" />
        </IconButton>
      </div>
      <div className="mt-2 grid grid-cols-7 text-center text-[10px] font-semibold text-slate-400">
        {["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"].map((d) => (
          <span key={d} className="py-1">
            {d}
          </span>
        ))}
      </div>
      <div className="grid grid-cols-7 gap-y-0.5 text-center">
        {cells.map((n, i) => {
          if (n === null) return <span key={`e${i}`} />;
          const date = new Date(month.getFullYear(), month.getMonth(), n);
          const off = dayOffset(date);
          const on = off === selectedDay;
          const today = off === 0;
          const dot = daysWithBookings.has(off);
          return (
            <button
              key={n}
              type="button"
              onClick={() => onPick(off)}
              aria-label={date.toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" })}
              aria-pressed={on}
              className={cn(
                "relative mx-auto flex size-8 cursor-pointer flex-col items-center justify-center rounded-full text-[12px] tabular-nums transition-colors",
                FOCUS,
                on ? "bg-primary font-bold text-white" : today ? "font-bold text-primary hover:bg-sky-50" : "text-slate-700 hover:bg-slate-100",
              )}
            >
              {n}
              {dot && <span aria-hidden className={cn("absolute bottom-0.5 size-1 rounded-full", on ? "bg-white" : "bg-sky-400")} />}
            </button>
          );
        })}
      </div>
    </div>
  );
}

function ViewSummary({ deps, activities }: { deps: Departure[]; activities: DemoActivity[] }) {
  const guests = deps.reduce((n, d) => n + d.booked, 0);
  const revenue = deps.reduce((n, d) => n + d.revenue, 0);
  const seats = deps.reduce((n, d) => n + d.activity.capacity, 0);
  return (
    <>
      <div className="mt-5 border-t border-slate-100 pt-4">
        <p className="text-[11px] font-semibold text-slate-400">This view</p>
        <dl className="mt-2 space-y-2 text-[13px]">
          <div className="flex justify-between">
            <dt className="text-slate-500">Departures</dt>
            <dd className="font-bold text-slate-900 tabular-nums">{deps.length}</dd>
          </div>
          <div className="flex justify-between">
            <dt className="text-slate-500">Guests</dt>
            <dd className="font-bold text-slate-900 tabular-nums">
              {guests}
              <span className="font-medium text-slate-400"> / {seats}</span>
            </dd>
          </div>
          <div className="flex justify-between">
            <dt className="text-slate-500">Revenue</dt>
            <dd className="font-bold text-emerald-600 tabular-nums">{formatMoney(revenue)}</dd>
          </div>
        </dl>
      </div>
      <div className="mt-4 border-t border-slate-100 pt-4">
        <p className="text-[11px] font-semibold text-slate-400">Activities</p>
        <ul className="mt-2 space-y-1.5">
          {activities.map((a) => (
            <li key={a.id} className="flex items-center gap-2 text-[12px] text-slate-600">
              <span aria-hidden className="size-2.5 shrink-0 rounded-sm" style={{ background: a.color }} />
              <span className="truncate">{a.short}</span>
            </li>
          ))}
        </ul>
      </div>
    </>
  );
}

/* -------------------------------------------------------------- time grid */

function TimeGrid({
  gridRef,
  days,
  week,
  departuresByDay,
  flashKey,
  onOpen,
  onPickDay,
}: {
  gridRef: React.RefObject<HTMLDivElement | null>;
  days: number[];
  week: boolean;
  departuresByDay: Departure[][];
  flashKey: string | null;
  onOpen: (d: Departure) => void;
  onPickDay: (day: number) => void;
}) {
  const reduce = useReducedMotion();
  // The clock is read after mount so server and browser render the same grid.
  const [now, setNow] = React.useState<number | null>(null);
  React.useEffect(() => {
    const tick = () => {
      const d = new Date();
      setNow(d.getHours() * 60 + d.getMinutes());
    };
    tick();
    const t = window.setInterval(tick, 60_000);
    return () => window.clearInterval(t);
  }, []);

  const hours = Array.from({ length: END_HOUR - START_HOUR + 1 }, (_, i) => START_HOUR + i);
  const cols = { gridTemplateColumns: `${RULER_W}px repeat(${days.length}, minmax(0, 1fr))` };

  return (
    <div ref={gridRef} className="relative h-[62vh] max-h-[680px] min-h-[420px] overflow-auto">
      <div className={cn(week ? "min-w-[760px]" : "min-w-[480px]")}>
        {/* Day headers */}
        <div className="sticky top-0 z-30 grid border-b border-slate-100 bg-white/95 backdrop-blur" style={cols}>
          <div className="sticky left-0 bg-white/95" />
          {days.map((d) => {
            const today = d === 0;
            const label = (
              <>
                <span className={cn("text-[11px] font-semibold", today ? "text-primary" : "text-slate-500")}>{weekday(d)}</span>
                <span
                  className={cn(
                    "mt-1 flex items-center justify-center rounded-full font-bold tabular-nums",
                    week ? "size-8 text-sm" : "size-9 text-base",
                    today ? "bg-primary text-white" : "text-slate-800",
                  )}
                >
                  {dayDate(d).getDate()}
                </span>
              </>
            );
            return week ? (
              <button
                key={d}
                type="button"
                onClick={() => onPickDay(d)}
                aria-label={`Open ${longDate(d)}`}
                className={cn("flex cursor-pointer flex-col items-center border-l border-slate-100 py-2 transition-colors hover:bg-slate-50", FOCUS)}
              >
                {label}
              </button>
            ) : (
              <div key={d} className="flex flex-col items-center py-2.5">
                {label}
              </div>
            );
          })}
        </div>

        {/* Body */}
        <div className="grid" style={{ ...cols, height: GRID_H + 16 }}>
          <div className="sticky left-0 z-20 bg-white">
            {hours.map((h) => (
              <span key={h} className="absolute right-2 text-[10px] font-medium text-slate-400 tabular-nums" style={{ top: (h - START_HOUR) * HOUR_H + 8 - 6 }}>
                {hourLabel(h)}
              </span>
            ))}
          </div>
          {days.map((d, i) => {
            const placed = layoutLanes(departuresByDay[i] ?? []);
            return (
              <div key={d} className={cn("relative", week && "border-l border-slate-100", d === 0 && week && "bg-sky-50/40")} style={{ marginTop: 8 }}>
                {hours.map((h) => (
                  <div key={h} aria-hidden className="absolute inset-x-0 border-t border-slate-100" style={{ top: (h - START_HOUR) * HOUR_H }} />
                ))}
                {hours.slice(0, -1).map((h) => (
                  <div key={`h${h}`} aria-hidden className="absolute inset-x-0 border-t border-dashed border-slate-100/70" style={{ top: (h - START_HOUR) * HOUR_H + HOUR_H / 2 }} />
                ))}
                {placed.map(({ dep, lane, lanes }, k) => (
                  <DepartureBlock
                    key={`${dep.key}`}
                    dep={dep}
                    lane={lane}
                    lanes={lanes}
                    compact={week}
                    flash={flashKey === dep.key}
                    delay={reduce ? 0 : Math.min(k, 8) * 0.05}
                    reduce={!!reduce}
                    onOpen={() => onOpen(dep)}
                  />
                ))}
                {d === 0 && now !== null && now >= START_HOUR * 60 && now <= END_HOUR * 60 && (
                  <div aria-hidden className="pointer-events-none absolute inset-x-0 z-20 flex items-center" style={{ top: (now / 60 - START_HOUR) * HOUR_H }}>
                    <span className="-ml-1 size-2 rounded-full bg-rose-500" />
                    <span className="h-px flex-1 bg-rose-500" />
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function DepartureBlock({
  dep,
  lane,
  lanes,
  compact,
  flash,
  delay,
  reduce,
  onOpen,
}: {
  dep: Departure;
  lane: number;
  lanes: number;
  compact: boolean;
  flash: boolean;
  delay: number;
  reduce: boolean;
  onOpen: () => void;
}) {
  const a = dep.activity;
  const top = (dep.start / 60 - START_HOUR) * HOUR_H;
  const height = Math.max((a.durationMinutes / 60) * HOUR_H, 30);
  const pct = Math.min(100, (dep.booked / a.capacity) * 100);
  const full = dep.booked >= a.capacity;
  const empty = dep.booked === 0;
  const gap = compact ? 2 : 4;
  const style: React.CSSProperties = {
    top,
    height,
    left: `calc(${(lane / lanes) * 100}% + ${gap}px)`,
    width: `calc(${100 / lanes}% - ${gap * 2}px)`,
  };
  const label = `${a.name}, ${formatRange(dep.start, a.durationMinutes)}, ${empty ? "available" : `${dep.booked} of ${a.capacity} seats booked`}`;

  return (
    <motion.button
      type="button"
      onClick={onOpen}
      aria-label={label}
      title={label}
      initial={{ opacity: 0, y: reduce ? 0 : 4 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1], delay }}
      className={cn(
        "absolute z-10 cursor-pointer overflow-hidden rounded-md text-left transition-[filter,box-shadow] hover:brightness-95 hover:shadow-md",
        FOCUS,
        empty && "border border-slate-200 bg-slate-100/90 text-slate-700",
        flash && "z-20 ring-2 ring-primary ring-offset-2",
      )}
      style={empty ? { ...style, boxShadow: `inset 3px 0 0 ${a.color}` } : { ...style, background: `linear-gradient(135deg, ${a.color}f0 0%, ${a.color}cc 100%)`, color: a.ink }}
    >
      <span className={cn("flex h-full flex-col justify-between", compact ? "px-1.5 py-1" : "px-3 py-2")}>
        <span className="min-w-0">
          <span className={cn("flex items-center gap-1 font-bold leading-snug", compact ? "text-[11px]" : "text-sm")}>
            <span className="truncate">{compact ? a.short : a.name}</span>
            {dep.aiNew && <Sparkles aria-hidden className="size-3 shrink-0" />}
          </span>
          {(!compact || height > 70) && (
            <span className={cn("mt-0.5 block truncate font-medium", compact ? "text-[10px]" : "text-[11px]", empty ? "text-slate-500" : "opacity-90")}>
              {compact ? formatMinute(dep.start) : formatRange(dep.start, a.durationMinutes)}
            </span>
          )}
        </span>
        {compact ? (
          <span className={cn("text-[10px] font-semibold tabular-nums", empty ? "text-slate-500" : "opacity-90")}>{empty ? "Open" : `${dep.booked}/${a.capacity}`}</span>
        ) : (
          <span className="block">
            <span className="mb-1 block h-1 overflow-hidden rounded-full" style={{ background: empty ? "#cbd5e1" : `${a.ink}33` }}>
              <span className="block h-full rounded-full transition-[width] duration-300" style={{ width: `${pct}%`, background: empty ? "#64748b" : `${a.ink}b3` }} />
            </span>
            <span className="flex flex-wrap items-center gap-2">
              <span
                className={cn(
                  "inline-flex items-center gap-1 rounded px-1.5 py-0.5 text-[10px] font-bold tabular-nums",
                  empty ? "bg-slate-200 text-slate-600" : full ? "bg-rose-600 text-white" : "",
                )}
                style={!empty && !full ? { background: `${a.ink}22` } : undefined}
              >
                <Users aria-hidden className="size-2.5" />
                {empty ? "Available" : full ? "Full" : `${dep.booked}/${a.capacity}`}
              </span>
              {dep.revenue > 0 && <span className="text-[10px] font-semibold opacity-90">{formatMoney(dep.revenue)}</span>}
              {dep.aiNew && <span className="rounded px-1.5 py-0.5 text-[10px] font-bold" style={{ background: `${a.ink}22` }}>New from AI</span>}
            </span>
          </span>
        )}
      </span>
    </motion.button>
  );
}

/* ------------------------------------------------------------ slot detail */

function SlotDetail({ slot, onOpenBooking }: { slot: Departure; onOpenBooking: (id: string) => void }) {
  const { contact } = useStore();
  const a = slot.activity;
  const pct = Math.min(100, (slot.booked / a.capacity) * 100);
  const stats = [
    { icon: Clock, value: `${Math.floor(a.durationMinutes / 60)}h${a.durationMinutes % 60 ? ` ${a.durationMinutes % 60}m` : ""}`, label: "Duration", tone: "text-slate-900" },
    { icon: Users, value: `${slot.booked}/${a.capacity}`, label: "Guests", tone: "text-slate-900" },
    { icon: CreditCard, value: formatMoney(slot.revenue), label: "Revenue", tone: "text-emerald-600" },
    { icon: BookOpen, value: String(slot.bookings.length), label: "Bookings", tone: "text-slate-900" },
  ];
  return (
    <div>
      <div className="h-1.5 overflow-hidden rounded-full" style={{ background: `${a.color}26` }}>
        <div className="h-full rounded-full transition-[width] duration-300" style={{ width: `${pct}%`, background: a.color }} />
      </div>
      <div className="mt-4 grid grid-cols-4 overflow-hidden rounded-xl border border-slate-200">
        {stats.map((s, i) => (
          <div key={s.label} className={cn("px-1 py-2.5 text-center", i > 0 && "border-l border-slate-200")}>
            <p className={cn("flex items-center justify-center gap-1 text-[13px] font-bold tabular-nums", s.tone)}>
              <s.icon aria-hidden className="size-3.5 opacity-60" />
              {s.value}
            </p>
            <p className="mt-0.5 text-[10px] text-slate-500">{s.label}</p>
          </div>
        ))}
      </div>

      <p className="mt-5 mb-2 text-[11px] font-semibold text-slate-400">
        Guests on this departure: {slot.booked} of {a.capacity}
      </p>
      {slot.bookings.length === 0 ? (
        <div className="rounded-xl border border-dashed border-slate-200 px-4 py-8 text-center">
          <Users aria-hidden className="mx-auto size-8 text-slate-300" />
          <p className="mt-2 text-sm font-semibold text-slate-600">No one booked yet</p>
          <p className="mt-0.5 text-xs text-slate-400">{a.capacity} seats open on this departure.</p>
        </div>
      ) : (
        <ul className="space-y-2">
          {slot.bookings.map((b) => {
            const c = contact(b.contactId);
            const name = c?.name ?? "Guest";
            const fresh = isFresh(b);
            return (
              <li key={b.id}>
                <button
                  type="button"
                  onClick={() => onOpenBooking(b.id)}
                  className={cn(
                    "w-full cursor-pointer rounded-xl border p-3 text-left transition-colors",
                    FOCUS,
                    b.source === "AI inbox" && fresh ? "border-primary/30 bg-sky-50/70 hover:bg-sky-50" : "border-slate-200 bg-slate-50/60 hover:bg-slate-50",
                  )}
                >
                  <span className="flex items-center gap-3">
                    <InitialsTile name={name} />
                    <span className="min-w-0 flex-1">
                      <span className="block truncate text-sm font-semibold text-slate-900">{name}</span>
                      <span className="block truncate font-mono text-[11px] text-slate-400">{bookingRef(b)}</span>
                    </span>
                    <span className="flex shrink-0 items-center gap-1 text-sm font-semibold text-slate-700 tabular-nums">
                      <Users aria-hidden className="size-3.5 text-slate-400" />
                      {b.guests}
                    </span>
                  </span>
                  <span className="mt-2 flex flex-wrap gap-1.5">
                    <span className={cn(BADGE, PAYMENT_BADGE[b.payment].className)}>{PAYMENT_BADGE[b.payment].label}</span>
                    <span className={cn(BADGE, b.waiverSigned ? "bg-emerald-50 text-emerald-700" : "bg-amber-50 text-amber-700")}>{b.waiverSigned ? "Waiver signed" : "Waiver pending"}</span>
                    {b.checkedIn && (
                      <span className={cn(BADGE, "bg-sky-50 text-sky-700")}>
                        <UserCheck aria-hidden className="size-3" />
                        Checked in
                      </span>
                    )}
                    {b.status === "pending" && <span className={cn(BADGE, STATUS_BADGE.pending)}>Pending</span>}
                    {b.source === "AI inbox" ? <AiBadge fresh={fresh} /> : <SourceBadge source={b.source} />}
                  </span>
                </button>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}

/* --------------------------------------------------------- bookings table */

const FILTERS: { id: "all" | BookingStatus; label: string }[] = [
  { id: "all", label: "All" },
  { id: "confirmed", label: "Confirmed" },
  { id: "pending", label: "Pending" },
  { id: "cancelled", label: "Cancelled" },
];

function BookingsTable({ onOpen, onNew }: { onOpen: (id: string) => void; onNew: () => void }) {
  const { bookings, contact, activity } = useStore();
  const [filter, setFilter] = React.useState<"all" | BookingStatus>("all");
  const [query, setQuery] = React.useState("");
  const reduce = useReducedMotion();

  const q = query.trim().toLowerCase();
  const rows = sortBookings(bookings).filter((b) => {
    if (filter !== "all" && b.status !== filter) return false;
    if (!q) return true;
    const c = contact(b.contactId);
    return [bookingRef(b), c?.name ?? "", c?.email ?? "", activity(b.activityId).name].some((s) => s.toLowerCase().includes(q));
  });
  const countOf = (id: "all" | BookingStatus) => (id === "all" ? bookings.length : bookings.filter((b) => b.status === id).length);

  return (
    <div>
      <div className="flex flex-col gap-3 xl:flex-row xl:items-center">
        <label className="relative block flex-1">
          <span className="sr-only">Search bookings</span>
          <Search aria-hidden className="pointer-events-none absolute top-1/2 left-3.5 size-4 -translate-y-1/2 text-slate-400" />
          <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search guest, email, reference, activity" className={cn(INPUT, "h-11 rounded-2xl bg-white pl-10")} />
        </label>
        <div className="flex flex-wrap items-center gap-2">
          {FILTERS.map((f) => {
            const on = f.id === filter;
            return (
              <button
                key={f.id}
                type="button"
                aria-pressed={on}
                onClick={() => setFilter(f.id)}
                className={cn(
                  "flex cursor-pointer items-center gap-1.5 rounded-full border px-3 py-1.5 text-[13px] font-semibold transition-colors",
                  FOCUS,
                  on ? "border-primary bg-primary text-white" : "border-slate-200 bg-white text-slate-600 hover:bg-slate-50",
                )}
              >
                {f.label}
                <span className={cn("text-[11px] tabular-nums", on ? "text-white/80" : "text-slate-400")}>{countOf(f.id)}</span>
              </button>
            );
          })}
          <button type="button" onClick={onNew} className={cn(BTN_PRIMARY, "h-9 px-4")}>
            <Plus />
            New Booking
          </button>
        </div>
      </div>

      {rows.length === 0 ? (
        <div className={cn(CARD, "mt-4 px-6 py-14 text-center")}>
          <Search aria-hidden className="mx-auto size-8 text-slate-300" />
          <p className="mt-2 text-sm font-semibold text-slate-600">No bookings match</p>
          <p className="mt-0.5 text-xs text-slate-400">Try another name, reference or status.</p>
        </div>
      ) : (
        <>
          {/* Desktop table */}
          <div className={cn(CARD, "mt-4 hidden overflow-hidden md:block")}>
            <div className="overflow-x-auto">
              <table className="w-full min-w-[980px] text-left text-sm">
                <thead className="bg-slate-50/80 text-[11px] font-semibold text-slate-500">
                  <tr>
                    <th className="px-4 py-3 font-semibold">Reference</th>
                    <th className="px-4 py-3 font-semibold">Guest</th>
                    <th className="px-4 py-3 font-semibold">Activity</th>
                    <th className="px-4 py-3 font-semibold">Date</th>
                    <th className="px-4 py-3 font-semibold">Guests</th>
                    <th className="px-4 py-3 font-semibold">Amount</th>
                    <th className="px-4 py-3 font-semibold">Status</th>
                    <th className="px-4 py-3 font-semibold">Payment</th>
                    <th className="px-4 py-3 font-semibold">Source</th>
                  </tr>
                </thead>
                <tbody>
                  {rows.map((b, i) => {
                    const c = contact(b.contactId);
                    const a = activity(b.activityId);
                    const total = b.guests * a.price;
                    const fresh = isFresh(b);
                    const ai = b.source === "AI inbox";
                    return (
                      <motion.tr
                        key={b.id}
                        initial={fresh && !reduce ? { opacity: 0, backgroundColor: "rgba(45,102,149,0.16)" } : false}
                        animate={{ opacity: 1, backgroundColor: fresh ? "rgba(45,102,149,0.06)" : ai ? "rgba(45,102,149,0.025)" : "rgba(255,255,255,0)" }}
                        transition={{ duration: 0.4, delay: reduce ? 0 : Math.min(i, 10) * 0.02 }}
                        tabIndex={0}
                        onClick={() => onOpen(b.id)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter" || e.key === " ") {
                            e.preventDefault();
                            onOpen(b.id);
                          }
                        }}
                        className={cn("cursor-pointer border-t border-slate-100 transition-colors hover:!bg-slate-50", FOCUS, b.status === "cancelled" && "opacity-60")}
                      >
                        <td className="px-4 py-3">
                          <p className="font-mono text-[12px] font-bold text-slate-900">{bookingRef(b)}</p>
                          <div className="mt-0.5 flex items-center gap-1.5">
                            <span className="text-[11px] text-slate-400">{shortDate(-b.createdDaysAgo)}</span>
                            {ai && <AiBadge fresh={fresh} />}
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-2.5">
                            <InitialsTile name={c?.name ?? "Guest"} size="sm" />
                            <div className="min-w-0">
                              <p className="max-w-[160px] truncate font-semibold text-slate-900">{c?.name ?? "Guest"}</p>
                              <p className="max-w-[160px] truncate text-[11px] text-slate-400">{c?.email ?? c?.phone ?? "No email"}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <span className="flex max-w-[170px] items-center gap-2 text-slate-700">
                            <span aria-hidden className="size-2 shrink-0 rounded-full" style={{ background: a.color }} />
                            <span className="truncate">{a.name}</span>
                          </span>
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap">
                          <p className="flex items-center gap-1.5 text-slate-800">
                            <CalendarDays aria-hidden className="size-3.5 text-slate-400" />
                            {formatDay(b.day)}
                          </p>
                          <p className="mt-0.5 flex items-center gap-1.5 text-[11px] text-slate-400">
                            <Clock aria-hidden className="size-3" />
                            {formatRange(b.startMinute, a.durationMinutes)}
                          </p>
                        </td>
                        <td className="px-4 py-3">
                          <span className="flex items-center gap-1 text-slate-700 tabular-nums">
                            <Users aria-hidden className="size-3.5 text-slate-400" />
                            {b.guests}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <p className="font-bold text-slate-900 tabular-nums">{formatMoney(total)}</p>
                          {b.payment === "deposit" && <p className="text-[11px] text-slate-400 tabular-nums">{formatMoney(total * DEPOSIT_RATE)} paid</p>}
                        </td>
                        <td className="px-4 py-3">
                          <StatusBadge status={b.status} />
                        </td>
                        <td className="px-4 py-3">
                          <span className={cn(BADGE, PAYMENT_BADGE[b.payment].className)}>{PAYMENT_BADGE[b.payment].label}</span>
                        </td>
                        <td className="px-4 py-3">
                          <SourceBadge source={b.source} />
                        </td>
                      </motion.tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* Phone list */}
          <ul className="mt-4 space-y-2 md:hidden">
            {rows.map((b) => {
              const c = contact(b.contactId);
              const a = activity(b.activityId);
              const fresh = isFresh(b);
              return (
                <li key={b.id}>
                  <button
                    type="button"
                    onClick={() => onOpen(b.id)}
                    className={cn(
                      CARD,
                      "w-full cursor-pointer p-3.5 text-left transition-colors hover:bg-slate-50",
                      FOCUS,
                      fresh && b.source === "AI inbox" && "border-primary/30 bg-sky-50/60",
                      b.status === "cancelled" && "opacity-60",
                    )}
                  >
                    <span className="flex items-center gap-3">
                      <InitialsTile name={c?.name ?? "Guest"} />
                      <span className="min-w-0 flex-1">
                        <span className="block truncate text-sm font-semibold text-slate-900">{c?.name ?? "Guest"}</span>
                        <span className="block truncate font-mono text-[11px] text-slate-400">{bookingRef(b)}</span>
                      </span>
                      <span className="text-sm font-bold text-slate-900 tabular-nums">{formatMoney(b.guests * a.price)}</span>
                    </span>
                    <span className="mt-2.5 flex items-center gap-2 text-[12px] text-slate-600">
                      <span aria-hidden className="size-2 shrink-0 rounded-full" style={{ background: a.color }} />
                      <span className="truncate">
                        {a.short}, {formatDay(b.day)} at {formatMinute(b.startMinute)}, {b.guests} {b.guests === 1 ? "guest" : "guests"}
                      </span>
                    </span>
                    <span className="mt-2 flex flex-wrap gap-1.5">
                      <StatusBadge status={b.status} />
                      <span className={cn(BADGE, PAYMENT_BADGE[b.payment].className)}>{PAYMENT_BADGE[b.payment].label}</span>
                      {b.source === "AI inbox" ? <AiBadge fresh={fresh} /> : <SourceBadge source={b.source} />}
                    </span>
                  </button>
                </li>
              );
            })}
          </ul>
        </>
      )}
    </div>
  );
}

/* --------------------------------------------------------- booking detail */

function BookingDetail({ bookingId, onClose, onNavigate }: { bookingId: string | null; onClose: () => void; onNavigate: (s: ScreenId) => void }) {
  const { bookings, contact, activity, setBookingStatus, toast, askWalkthrough } = useStore();
  const b = bookingId ? bookings.find((x) => x.id === bookingId) : undefined;
  const c = b ? contact(b.contactId) : undefined;
  const a = b ? activity(b.activityId) : undefined;
  const name = c?.name ?? "Guest";

  const setStatus = (status: BookingStatus) => {
    if (!b) return;
    setBookingStatus(b.id, status);
    toast(status === "cancelled" ? "Booking cancelled" : "Booking confirmed", `${bookingRef(b)}, ${name}`);
  };

  const stage = !b ? 0 : b.checkedIn ? 2 : b.status === "confirmed" ? 1 : 0;
  const steps = ["Pending", "Confirmed", "Checked in"];

  return (
    <Sheet
      open={!!b}
      onClose={onClose}
      title={
        b ? (
          <span className="flex items-center gap-3">
            <span className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-sky-50 text-primary">
              <Hash aria-hidden className="size-4" />
            </span>
            <span className="min-w-0">
              <span className="block text-[11px] font-semibold text-slate-400">Booking</span>
              <span className="block truncate font-mono text-[15px]">{bookingRef(b)}</span>
            </span>
          </span>
        ) : (
          ""
        )
      }
      footer={
        b && (
          <div className="flex flex-col gap-2 sm:flex-row">
            {b.status === "pending" && (
              <button type="button" onClick={() => setStatus("confirmed")} className={cn(BTN_PRIMARY, "flex-1")}>
                <CircleCheck />
                Confirm booking
              </button>
            )}
            {b.status === "confirmed" && (
              <button type="button" onClick={() => onNavigate("checkin")} className={cn(BTN_PRIMARY, "flex-1")}>
                <ScanLine />
                {b.checkedIn ? "Open check-in desk" : "Check in at the desk"}
              </button>
            )}
            {b.status === "cancelled" ? (
              <button type="button" onClick={() => setStatus("confirmed")} className={cn(BTN_OUTLINE, "flex-1")}>
                Restore booking
              </button>
            ) : (
              <button type="button" onClick={() => setStatus("cancelled")} className={cn(BTN_OUTLINE, "text-rose-600 hover:bg-rose-50")}>
                <CircleX />
                Cancel
              </button>
            )}
          </div>
        )
      }
    >
      {b && a && (
        <div className="space-y-4">
          {/* Progress */}
          <div className="rounded-2xl bg-slate-50 p-4">
            {b.status === "cancelled" ? (
              <p className="flex items-center gap-2 text-sm font-semibold text-slate-500">
                <CircleX aria-hidden className="size-4" />
                This booking was cancelled. Its seats are back on sale.
              </p>
            ) : (
              <div className="flex items-start">
                {steps.map((s, i) => (
                  <React.Fragment key={s}>
                    <div className="flex w-16 shrink-0 flex-col items-center gap-1.5">
                      <span
                        className={cn(
                          "flex size-8 items-center justify-center rounded-full text-xs font-bold transition-colors duration-300",
                          i < stage ? "bg-primary text-white" : i === stage ? "border-2 border-primary bg-white text-primary" : "bg-slate-200 text-slate-400",
                        )}
                      >
                        {i < stage || (i === stage && i === 2) ? <CircleCheck aria-hidden className="size-4" /> : i + 1}
                      </span>
                      <span className={cn("text-center text-[11px] font-semibold", i <= stage ? "text-slate-800" : "text-slate-400")}>{s}</span>
                    </div>
                    {i < steps.length - 1 && <span aria-hidden className={cn("mt-4 h-0.5 flex-1 rounded-full", i < stage ? "bg-primary/60" : "bg-slate-200")} />}
                  </React.Fragment>
                ))}
              </div>
            )}
            <div className="mt-3 flex flex-wrap gap-1.5 border-t border-slate-200/70 pt-3">
              <span className={cn(BADGE, PAYMENT_BADGE[b.payment].className)}>{PAYMENT_BADGE[b.payment].label}</span>
              <span className={cn(BADGE, b.waiverSigned ? "bg-emerald-50 text-emerald-700" : "bg-amber-50 text-amber-700")}>{b.waiverSigned ? "Waiver signed" : "Waiver pending"}</span>
              {b.source === "AI inbox" ? <AiBadge fresh={isFresh(b)} /> : <SourceBadge source={b.source} />}
            </div>
          </div>

          {/* Guest */}
          <div className="flex items-center gap-3 rounded-2xl border border-slate-200 p-3.5">
            <InitialsTile name={name} size="lg" />
            <div className="min-w-0">
              <p className="truncate font-semibold text-slate-900">{name}</p>
              {c?.email && (
                <p className="flex items-center gap-1.5 truncate text-[12px] text-slate-500">
                  <Mail aria-hidden className="size-3 shrink-0" />
                  {c.email}
                </p>
              )}
              {c?.phone && (
                <p className="flex items-center gap-1.5 truncate text-[12px] text-slate-500">
                  <Phone aria-hidden className="size-3 shrink-0" />
                  {c.phone}
                </p>
              )}
            </div>
          </div>

          {/* Trip */}
          <dl className="divide-y divide-slate-100 rounded-2xl border border-slate-200 text-sm">
            {[
              {
                k: "Activity",
                v: (
                  <span className="flex items-center gap-2">
                    <span aria-hidden className="size-2 rounded-full" style={{ background: a.color }} />
                    {a.name}
                  </span>
                ),
              },
              { k: "Date", v: longDate(b.day) },
              { k: "Time", v: formatRange(b.startMinute, a.durationMinutes) },
              { k: "Guests", v: `${b.guests} ${b.guests === 1 ? "guest" : "guests"} at ${formatMoney(a.price)}` },
              { k: "Total", v: <span className="font-bold text-slate-900">{formatMoney(b.guests * a.price)}</span> },
              { k: "Booked", v: formatDay(-b.createdDaysAgo, { month: "short", day: "numeric", year: "numeric" }) },
            ].map((row) => (
              <div key={row.k} className="flex items-start justify-between gap-4 px-4 py-2.5">
                <dt className="shrink-0 text-slate-500">{row.k}</dt>
                <dd className="text-right font-medium text-slate-800">{row.v}</dd>
              </div>
            ))}
          </dl>

          {/* Communications */}
          <div className="rounded-2xl bg-slate-50 p-3">
            <p className="mb-2 flex items-center gap-1.5 px-1 text-[11px] font-semibold text-slate-500">
              <Mail aria-hidden className="size-3.5" />
              Communications
            </p>
            <div className="space-y-2">
              {["Send booking confirmation email", "Send payment link"].map((label) => (
                <button
                  key={label}
                  type="button"
                  onClick={() => askWalkthrough(label === "Send payment link" ? "Payment links" : "Confirmation emails")}
                  className={cn("flex w-full cursor-pointer items-center gap-2.5 rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-left text-sm font-semibold text-slate-700 transition-colors hover:bg-slate-50", FOCUS)}
                >
                  {label === "Send payment link" ? <CreditCard aria-hidden className="size-4 text-slate-400" /> : <Mail aria-hidden className="size-4 text-slate-400" />}
                  {label}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </Sheet>
  );
}

/* ------------------------------------------------------------ new booking */

function NewBookingForm({ preset, onCreated, onCancel }: { preset: Preset; onCreated: (b: DemoBooking) => void; onCancel: () => void }) {
  const { activities, contacts, activity, seatsTaken, addBooking } = useStore();
  const [activityId, setActivityId] = React.useState(preset?.activityId ?? activities[0]!.id);
  const a = activity(activityId);
  const [day, setDay] = React.useState(Math.max(0, Math.min(13, preset?.day ?? 0)));
  const [start, setStart] = React.useState(preset && a.startMinutes.includes(preset.start) ? preset.start : a.startMinutes[0]!);
  const [guests, setGuests] = React.useState(2);
  const [mode, setMode] = React.useState<"new" | "existing">("new");
  const [contactId, setContactId] = React.useState("");
  const [name, setName] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [source, setSource] = React.useState<"Walk-in" | "Phone">("Walk-in");

  const left = Math.max(0, a.capacity - seatsTaken(activityId, day, start));
  const count = Math.max(1, Math.min(guests, left || 1));
  const guestOk = mode === "existing" ? !!contactId : name.trim().length > 1;
  const valid = left > 0 && guestOk;
  const sortedContacts = [...contacts].sort((x, y) => x.name.localeCompare(y.name));

  const pickActivity = (id: string) => {
    setActivityId(id);
    const next = activity(id);
    if (!next.startMinutes.includes(start)) setStart(next.startMinutes[0]!);
  };

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!valid) return;
    const b = addBooking({
      activityId,
      day,
      startMinute: start,
      guests: count,
      source,
      ...(mode === "existing" ? { contactId } : { guest: { name: name.trim(), email: email.trim() || null, phone: null } }),
    });
    onCreated(b);
  };

  const segment = (on: boolean) =>
    cn("flex-1 cursor-pointer rounded-full px-3 py-1.5 text-[13px] font-semibold transition-colors", FOCUS, on ? "bg-white text-slate-900 shadow-sm" : "text-slate-500 hover:text-slate-800");

  return (
    <form onSubmit={submit} className="space-y-4">
      <Field label="Activity">
        <select value={activityId} onChange={(e) => pickActivity(e.target.value)} className={cn(INPUT, "cursor-pointer")}>
          {activities.map((x) => (
            <option key={x.id} value={x.id}>
              {x.name} ({formatMoney(x.price)} per guest)
            </option>
          ))}
        </select>
      </Field>

      <Field label="Date">
        <select value={day} onChange={(e) => setDay(Number(e.target.value))} className={cn(INPUT, "cursor-pointer")}>
          {Array.from({ length: 14 }, (_, i) => (
            <option key={i} value={i}>
              {i < 2 ? `${formatDay(i)}, ${dayDate(i).toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" })}` : formatDay(i)}
            </option>
          ))}
        </select>
      </Field>

      <div>
        <span className="mb-1.5 block text-xs font-semibold text-slate-500">Departure</span>
        <div className="flex flex-wrap gap-2">
          {a.startMinutes.map((m) => {
            const seats = a.capacity - seatsTaken(activityId, day, m);
            const on = m === start;
            return (
              <button
                key={m}
                type="button"
                aria-pressed={on}
                disabled={seats <= 0}
                onClick={() => setStart(m)}
                className={cn(
                  "flex cursor-pointer flex-col items-start rounded-xl border px-3.5 py-2 text-left transition-colors disabled:cursor-not-allowed disabled:opacity-50",
                  FOCUS,
                  on ? "border-primary bg-sky-50 text-primary" : "border-slate-200 bg-white text-slate-700 hover:bg-slate-50",
                )}
              >
                <span className="text-sm font-bold tabular-nums">{formatMinute(m)}</span>
                <span className={cn("text-[11px]", on ? "text-primary/80" : "text-slate-400")}>{seats <= 0 ? "Full" : `${seats} of ${a.capacity} seats left`}</span>
              </button>
            );
          })}
        </div>
      </div>

      <div className="flex items-end justify-between gap-4">
        <div>
          <span className="mb-1.5 block text-xs font-semibold text-slate-500">Guests</span>
          <div className="flex items-center gap-1 rounded-full border border-slate-200 bg-slate-50 p-1">
            <button
              type="button"
              aria-label="Fewer guests"
              disabled={count <= 1}
              onClick={() => setGuests(count - 1)}
              className={cn("flex size-8 cursor-pointer items-center justify-center rounded-full bg-white text-slate-600 shadow-sm transition-colors hover:text-slate-900 disabled:cursor-not-allowed disabled:opacity-40", FOCUS)}
            >
              <Minus className="size-4" />
            </button>
            <span className="w-8 text-center text-sm font-bold text-slate-900 tabular-nums" aria-live="polite">
              {count}
            </span>
            <button
              type="button"
              aria-label="More guests"
              disabled={count >= left}
              onClick={() => setGuests(count + 1)}
              className={cn("flex size-8 cursor-pointer items-center justify-center rounded-full bg-white text-slate-600 shadow-sm transition-colors hover:text-slate-900 disabled:cursor-not-allowed disabled:opacity-40", FOCUS)}
            >
              <Plus className="size-4" />
            </button>
          </div>
        </div>
        <div className="text-right">
          <p className="text-[11px] font-semibold text-slate-400">Total</p>
          <p className="text-xl font-bold text-slate-900 tabular-nums">{formatMoney(count * a.price)}</p>
        </div>
      </div>

      <div>
        <div className="mb-2 flex items-center justify-between gap-3">
          <span className="text-xs font-semibold text-slate-500">Lead guest</span>
          <div className="flex w-52 gap-0.5 rounded-full bg-slate-100 p-0.5">
            <button type="button" aria-pressed={mode === "new"} onClick={() => setMode("new")} className={segment(mode === "new")}>
              New guest
            </button>
            <button type="button" aria-pressed={mode === "existing"} onClick={() => setMode("existing")} className={segment(mode === "existing")}>
              Existing
            </button>
          </div>
        </div>
        {mode === "new" ? (
          <div className="grid gap-2 sm:grid-cols-2">
            <label className="block">
              <span className="sr-only">Guest name</span>
              <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Full name" className={INPUT} autoComplete="off" />
            </label>
            <label className="block">
              <span className="sr-only">Guest email</span>
              <input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email (optional)" type="email" className={INPUT} autoComplete="off" />
            </label>
          </div>
        ) : (
          <label className="block">
            <span className="sr-only">Pick a guest</span>
            <select value={contactId} onChange={(e) => setContactId(e.target.value)} className={cn(INPUT, "cursor-pointer")}>
              <option value="">Pick a guest from the CRM</option>
              {sortedContacts.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                  {c.email ? ` (${c.email})` : ""}
                </option>
              ))}
            </select>
          </label>
        )}
      </div>

      <div>
        <span className="mb-1.5 block text-xs font-semibold text-slate-500">Booked by</span>
        <div className="flex w-full gap-0.5 rounded-full bg-slate-100 p-0.5 sm:w-64">
          {(["Walk-in", "Phone"] as const).map((s) => (
            <button key={s} type="button" aria-pressed={source === s} onClick={() => setSource(s)} className={segment(source === s)}>
              {s}
            </button>
          ))}
        </div>
      </div>

      <AnimatePresence initial={false}>
        {left <= 0 && (
          <motion.p initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} transition={{ duration: 0.2 }} className="overflow-hidden rounded-xl bg-rose-50 px-3 py-2 text-xs font-semibold text-rose-700">
            This departure is full. Pick another time or day.
          </motion.p>
        )}
      </AnimatePresence>

      <div className="flex gap-2 pt-1">
        <button type="button" onClick={onCancel} className={BTN_OUTLINE}>
          Cancel
        </button>
        <button type="submit" disabled={!valid} className={cn(BTN_PRIMARY, "flex-1")}>
          <CalendarDays />
          Book {count} {count === 1 ? "guest" : "guests"}
        </button>
      </div>
    </form>
  );
}
