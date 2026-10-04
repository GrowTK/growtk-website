"use client";

import * as React from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import {
  Activity,
  ArrowRight,
  Bot,
  CalendarCheck,
  CalendarDays,
  Clock,
  CreditCard,
  Inbox,
  Mail,
  MessageCircle,
  MessagesSquare,
  Plug,
  Plus,
  ScanLine,
  UserCheck,
  Users,
  type LucideIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { yettiDeck, type DemoBooking } from "@/content/yetti";
import { dayDate, formatMinute, minutesAgoLabel, useStore } from "./store";
import { BADGE, BTN_OUTLINE, CARD, FOCUS, PlatformIcon, PLATFORM_LABEL } from "./ui";
import type { ScreenId } from "./app-frame";

/**
 * Yetti's module dashboard (components/dashboard/ModuleDashboardGrid.tsx):
 * gradient stat cards with a dotted texture and a sparkline, the 7 day
 * activity chart, the module activity donut and the integrations card, plus
 * today's departures and the latest inbox threads. Every number reads the
 * shared store, so a trip booked in the inbox moves these live.
 */

/** Modules switched on in the demo workspace (the sidebar's module list). */
const ACTIVE_MODULES = 15;

const ease = [0.22, 1, 0.36, 1] as const;

/* ------------------------------------------------------------------ hooks */

/** Minutes since midnight, set after mount so server and client render the same markup. */
function useNowMinute() {
  const [now, setNow] = React.useState<number | null>(null);
  React.useEffect(() => {
    const read = () => {
      const d = new Date();
      setNow(d.getHours() * 60 + d.getMinutes());
    };
    read();
    const t = window.setInterval(read, 60_000);
    return () => window.clearInterval(t);
  }, []);
  return now;
}

/* ------------------------------------------------------------ stat cards */

type Gradient = "violet" | "purple" | "blue" | "sky";

// Deeper stops than the product's own (violet-500, sky-400) so white text
// keeps 4.5:1 across the whole card.
const GRADIENTS: Record<Gradient, string> = {
  violet: "bg-linear-to-br from-violet-600 to-purple-700 shadow-violet-600/25 hover:shadow-violet-600/40",
  purple: "bg-linear-to-br from-purple-600 to-fuchsia-700 shadow-purple-600/25 hover:shadow-purple-600/40",
  blue: "bg-linear-to-br from-blue-600 to-indigo-700 shadow-blue-600/25 hover:shadow-blue-600/40",
  sky: "bg-linear-to-br from-sky-700 to-cyan-800 shadow-sky-700/25 hover:shadow-sky-700/40",
};

const DOTS: React.CSSProperties = {
  backgroundImage: "radial-gradient(circle, rgba(255,255,255,0.16) 1.5px, transparent 1.5px)",
  backgroundSize: "20px 20px",
};

function Sparkline({ values }: { values: number[] }) {
  const max = Math.max(1, ...values);
  const pts = values.map((v, i) => [(i / Math.max(1, values.length - 1)) * 100, 22 - (v / max) * 18] as const);
  const last = pts[pts.length - 1]!;
  return (
    <svg viewBox="0 0 100 24" preserveAspectRatio="none" aria-hidden className="h-7 w-full overflow-visible">
      <polyline
        points={pts.map(([x, y]) => `${x},${y}`).join(" ")}
        fill="none"
        stroke="rgba(255,255,255,0.75)"
        strokeWidth={1.75}
        strokeLinejoin="round"
        strokeLinecap="round"
        vectorEffect="non-scaling-stroke"
      />
      <circle cx={last[0]} cy={last[1]} r={2.4} fill="#fff" vectorEffect="non-scaling-stroke" />
    </svg>
  );
}

/** A number that lifts in when it changes, so live updates are visible. */
function LiveNumber({ value, className }: { value: number; className?: string }) {
  const reduce = useReducedMotion();
  return (
    <span className={cn("relative inline-flex overflow-hidden", className)}>
      <AnimatePresence mode="popLayout" initial={false}>
        <motion.span
          key={value}
          initial={{ y: reduce ? 0 : "60%", opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: reduce ? 0 : "-60%", opacity: 0 }}
          transition={{ duration: 0.3, ease }}
          className="tabular-nums"
        >
          {value}
        </motion.span>
      </AnimatePresence>
    </span>
  );
}

function StatCard({
  gradient,
  icon: Icon,
  value,
  label,
  sub,
  spark,
  onClick,
  ariaLabel,
}: {
  gradient: Gradient;
  icon: LucideIcon;
  value: number;
  label: string;
  sub: string;
  spark: number[];
  onClick: () => void;
  ariaLabel: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={ariaLabel}
      className={cn(
        "group relative flex h-full min-h-40 w-full cursor-pointer flex-col justify-between overflow-hidden rounded-2xl p-4 text-left text-white shadow-lg transition-[transform,box-shadow] duration-200 hover:-translate-y-0.5",
        FOCUS,
        GRADIENTS[gradient],
      )}
    >
      <span aria-hidden className="absolute inset-0" style={DOTS} />
      <span aria-hidden className="absolute -top-8 -right-8 size-24 rounded-full bg-white/10 transition-transform duration-300 group-hover:scale-110" />
      <span aria-hidden className="absolute -bottom-6 -left-6 size-20 rounded-full bg-white/5" />
      <Icon aria-hidden className="absolute top-3.5 right-3.5 size-4.5 text-white/50" />
      <span className="relative">
        <LiveNumber value={value} className="text-3xl leading-none font-black tracking-tight" />
        <span className="mt-2 block text-xs leading-none font-bold">{label}</span>
        <span className="mt-1 block text-[11px] leading-snug font-semibold text-white/90">{sub}</span>
      </span>
      <span className="relative -mx-1 mt-3 block">
        <Sparkline values={spark} />
      </span>
    </button>
  );
}

/* --------------------------------------------------------- card chrome */

function CardHead({
  icon: Icon,
  tile,
  title,
  subtitle,
  right,
}: {
  icon: LucideIcon;
  tile: string;
  title: string;
  subtitle: string;
  right?: React.ReactNode;
}) {
  return (
    <div className="flex items-center justify-between gap-3 px-4 pt-4 pb-3">
      <div className="flex min-w-0 items-center gap-2.5">
        <span className={cn("flex size-8 shrink-0 items-center justify-center rounded-xl text-white shadow-sm", tile)}>
          <Icon aria-hidden className="size-4" />
        </span>
        <div className="min-w-0">
          <h2 className="truncate text-sm leading-tight font-bold text-slate-800">{title}</h2>
          <p className="truncate text-[11px] text-slate-500">{subtitle}</p>
        </div>
      </div>
      {right}
    </div>
  );
}

const LINK_PILL = cn(
  "inline-flex shrink-0 cursor-pointer items-center gap-1 rounded-full bg-violet-50 px-2.5 py-1 text-[11px] font-bold text-violet-700 transition-colors hover:bg-violet-100",
  FOCUS,
);

/* ------------------------------------------------------ activity chart */

const PLOT_H = 150;

function ActivityChart({ data }: { data: { label: string; count: number; today: boolean }[] }) {
  const reduce = useReducedMotion();
  const [hover, setHover] = React.useState<number | null>(null);
  const max = Math.max(4, ...data.map((d) => d.count));
  const total = data.reduce((s, d) => s + d.count, 0);
  return (
    <div className={cn(CARD, "flex h-full flex-col")}>
      <div className="flex items-start justify-between gap-3 px-4 pt-4">
        <div>
          <h2 className="text-sm font-bold text-slate-800">Activity</h2>
          <p className="text-[11px] text-slate-500">Bookings created, last 7 days</p>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-right">
            <span className="block text-lg leading-none font-black text-slate-900 tabular-nums">{total}</span>
            <span className="text-[10px] text-slate-500">this week</span>
          </span>
          <span className="flex items-center gap-1.5 text-[11px] font-semibold text-slate-600">
            <span aria-hidden className="size-2 rounded-full bg-violet-500" />
            Bookings
          </span>
        </div>
      </div>
      <div className="mt-auto px-4 pt-4 pb-3">
        <div className="relative flex gap-2" role="img" aria-label={`Bookings created per day: ${data.map((d) => `${d.label} ${d.count}`).join(", ")}`}>
          {/* Gridlines. */}
          <div aria-hidden className="pointer-events-none absolute inset-x-0 top-0 flex flex-col justify-between" style={{ height: PLOT_H }}>
            {[0, 1, 2, 3].map((i) => (
              <span key={i} className="block h-px bg-slate-100" />
            ))}
          </div>
          {data.map((d, i) => {
            const h = d.count === 0 ? 3 : Math.max(6, (d.count / max) * PLOT_H);
            return (
              <div key={d.label + i} className="relative flex flex-1 flex-col items-center gap-2" onMouseEnter={() => setHover(i)} onMouseLeave={() => setHover(null)}>
                <div className="relative flex w-full items-end justify-center" style={{ height: PLOT_H }}>
                  <AnimatePresence>
                    {hover === i && (
                      <motion.span
                        initial={{ opacity: 0, y: 4 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.15 }}
                        className="absolute z-10 rounded-lg bg-slate-900 px-2 py-1 text-[11px] font-semibold whitespace-nowrap text-white shadow-lg"
                        style={{ bottom: h + 6 }}
                      >
                        {d.count} {d.count === 1 ? "booking" : "bookings"}
                      </motion.span>
                    )}
                  </AnimatePresence>
                  <motion.span
                    className={cn("block w-full max-w-9 origin-bottom rounded-t-md transition-colors", d.today ? "bg-violet-600" : hover === i ? "bg-violet-500" : "bg-violet-400")}
                    initial={reduce ? false : { scaleY: 0 }}
                    animate={{ scaleY: 1, height: h }}
                    transition={{ duration: 0.4, ease, delay: reduce ? 0 : 0.05 * i }}
                    style={{ opacity: d.count === 0 ? 0.35 : 1 }}
                  />
                </div>
                <span className={cn("text-[11px]", d.today ? "font-bold text-slate-900" : "text-slate-500")}>{d.label}</span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

/* --------------------------------------------------------- module donut */

type ModuleRow = { label: string; value: number; color: string; screen: ScreenId };

function ModuleActivity({ rows, onNavigate }: { rows: ModuleRow[]; onNavigate: (s: ScreenId) => void }) {
  const total = rows.reduce((s, r) => s + r.value, 0);
  const R = 34;
  const C = 2 * Math.PI * R;
  let offset = 0;
  return (
    <div className={cn(CARD, "flex h-full flex-col")}>
      <CardHead
        icon={Activity}
        tile="bg-linear-to-br from-violet-500 to-purple-600"
        title="Module activity"
        subtitle="Today's breakdown"
        right={
          <span className="text-right">
            <span className="text-lg font-black text-slate-900 tabular-nums">{total}</span>
            <span className="ml-1 text-[11px] text-slate-500">total</span>
          </span>
        }
      />
      <div className="flex flex-1 items-center gap-4 border-t border-slate-100 px-4 py-4">
        <div className="relative size-24 shrink-0">
          <svg viewBox="0 0 88 88" className="size-full -rotate-90" aria-hidden>
            <circle cx={44} cy={44} r={R} fill="none" stroke="#f1f5f9" strokeWidth={12} />
            {total > 0 &&
              rows.map((r) => {
                const len = (r.value / total) * C;
                const seg = (
                  <motion.circle
                    key={r.label}
                    cx={44}
                    cy={44}
                    r={R}
                    fill="none"
                    stroke={r.color}
                    strokeWidth={12}
                    initial={false}
                    animate={{ strokeDasharray: `${len} ${C - len}`, strokeDashoffset: -offset }}
                    transition={{ duration: 0.4, ease }}
                  />
                );
                offset += len;
                return seg;
              })}
          </svg>
          <span className="absolute inset-0 flex flex-col items-center justify-center">
            <LiveNumber value={total} className="text-xl leading-none font-black text-slate-900" />
            <span className="text-[10px] text-slate-500">today</span>
          </span>
        </div>
        <ul className="min-w-0 flex-1 space-y-0.5">
          {rows.map((r) => (
            <li key={r.label}>
              <button
                type="button"
                onClick={() => onNavigate(r.screen)}
                className={cn("flex w-full cursor-pointer items-center gap-2.5 rounded-lg px-2 py-1.5 text-left transition-colors hover:bg-slate-50", FOCUS)}
              >
                <span aria-hidden className="h-4 w-1 rounded-full" style={{ background: r.color }} />
                <span className="flex-1 truncate text-[13px] font-medium text-slate-700">{r.label}</span>
                <span className="text-sm font-bold text-slate-900 tabular-nums">{r.value}</span>
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

/* ---------------------------------------------------------- integrations */

const INTEGRATIONS: { name: string; status: string; icon: LucideIcon; tile: string }[] = [
  { name: "Stripe", status: "Payments enabled", icon: CreditCard, tile: "bg-indigo-600" },
  { name: "Resend", status: "Email active", icon: Mail, tile: "bg-slate-900" },
  { name: "WhatsApp Business", status: "Connected", icon: MessageCircle, tile: "bg-emerald-600" },
];

function Integrations({ onOpen }: { onOpen: (name: string) => void }) {
  return (
    <div className={cn(CARD, "flex h-full flex-col")}>
      <CardHead icon={Plug} tile="bg-linear-to-br from-violet-500 to-indigo-600" title="Integrations" subtitle="Connected services" />
      <ul className="flex flex-1 flex-col gap-2 border-t border-slate-100 p-3">
        {INTEGRATIONS.map((it) => (
          <li key={it.name}>
            <button
              type="button"
              onClick={() => onOpen(it.name)}
              className={cn(
                "flex w-full cursor-pointer items-center gap-3 rounded-xl border border-emerald-100 bg-emerald-50/40 p-2.5 text-left transition-colors hover:border-emerald-200 hover:bg-emerald-50",
                FOCUS,
              )}
            >
              <span className={cn("flex size-9 shrink-0 items-center justify-center rounded-lg text-white", it.tile)}>
                <it.icon aria-hidden className="size-4.5" />
              </span>
              <span className="min-w-0 flex-1">
                <span className="block truncate text-[13px] font-bold text-slate-800">{it.name}</span>
                <span className="block truncate text-[11px] font-medium text-emerald-700">{it.status}</span>
              </span>
              <span aria-hidden className="size-2 shrink-0 rounded-full bg-emerald-500 ring-4 ring-emerald-100" />
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

/* ------------------------------------------------------- departures */

type Departure = {
  key: string;
  activityId: string;
  startMinute: number;
  guests: number;
  checkedIn: number;
  bookings: number;
};

function departureState(d: { startMinute: number; duration: number }, now: number | null) {
  if (now === null) return null;
  if (now >= d.startMinute + d.duration) return { label: "Back at the dock", className: "bg-slate-100 text-slate-600" };
  if (now >= d.startMinute) return { label: "On the water", className: "bg-sky-50 text-sky-700" };
  if (d.startMinute - now <= 45) return { label: "Boarding soon", className: "bg-amber-50 text-amber-700" };
  return null;
}

function Departures({ departures, onOpen }: { departures: Departure[]; onOpen: () => void }) {
  const { activity } = useStore();
  const now = useNowMinute();
  const reduce = useReducedMotion();
  const dateLabel = dayDate(0).toLocaleDateString("en-US", { weekday: "long", month: "short", day: "numeric" });
  return (
    <div className={cn(CARD, "flex h-full flex-col")}>
      <CardHead
        icon={Clock}
        tile="bg-linear-to-br from-violet-500 to-purple-600"
        title="Today's departures"
        subtitle={dateLabel}
        right={
          <button type="button" onClick={onOpen} className={LINK_PILL}>
            Calendar <ArrowRight aria-hidden className="size-3" />
          </button>
        }
      />
      <ul className="flex flex-1 flex-col gap-1 border-t border-slate-100 p-2">
        {departures.length === 0 && <li className="px-3 py-8 text-center text-sm text-slate-500">No departures today</li>}
        {departures.map((d, i) => {
          const a = activity(d.activityId);
          const pct = Math.min(100, Math.round((d.guests / a.capacity) * 100));
          const left = Math.max(0, a.capacity - d.guests);
          const state = departureState({ startMinute: d.startMinute, duration: a.durationMinutes }, now);
          return (
            <motion.li
              key={d.key}
              initial={reduce ? false : { opacity: 0, x: -6 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, ease, delay: reduce ? 0 : 0.05 * i }}
            >
              <button
                type="button"
                onClick={onOpen}
                className={cn("grid w-full cursor-pointer grid-cols-[4.25rem_1fr] items-center gap-3 rounded-xl px-2.5 py-2.5 text-left transition-colors hover:bg-slate-50 @xl:grid-cols-[4.25rem_1fr_9rem]", FOCUS)}
              >
                <span className="text-[13px] font-bold text-slate-900 tabular-nums">{formatMinute(d.startMinute)}</span>
                <span className="min-w-0">
                  <span className="flex items-center gap-2">
                    <span aria-hidden className="size-2.5 shrink-0 rounded-full" style={{ background: a.color }} />
                    <span className="truncate text-[13px] font-semibold text-slate-800">{a.name}</span>
                    {state && <span className={cn(BADGE, "hidden @md:inline-flex", state.className)}>{state.label}</span>}
                  </span>
                  <span className="mt-0.5 flex items-center gap-1.5 text-[11px] text-slate-500">
                    <UserCheck aria-hidden className="size-3" />
                    {d.checkedIn} of {d.guests} checked in
                    <span aria-hidden>·</span>
                    {d.bookings} {d.bookings === 1 ? "booking" : "bookings"}
                  </span>
                </span>
                <span className="col-span-2 @xl:col-span-1">
                  <span className="flex items-baseline justify-between text-[11px]">
                    <span className="font-bold text-slate-800 tabular-nums">
                      {d.guests}/{a.capacity}
                    </span>
                    <span className={left === 0 ? "font-semibold text-rose-600" : "text-slate-500"}>{left === 0 ? "Full" : `${left} left`}</span>
                  </span>
                  <span className="mt-1 block h-1.5 overflow-hidden rounded-full bg-slate-100">
                    <motion.span
                      className="block h-full rounded-full"
                      style={{ background: a.color }}
                      initial={false}
                      animate={{ width: `${pct}%` }}
                      transition={{ duration: 0.4, ease }}
                    />
                  </span>
                </span>
              </button>
            </motion.li>
          );
        })}
      </ul>
    </div>
  );
}

/* ------------------------------------------------------------ inbox */

function LatestInbox({ onOpen }: { onOpen: () => void }) {
  const { conversations, typing } = useStore();
  const latest = React.useMemo(
    () =>
      [...conversations]
        .map((c) => ({ c, last: c.messages[c.messages.length - 1] }))
        .sort((x, y) => (x.last?.minutesAgo ?? 1e9) - (y.last?.minutesAgo ?? 1e9))
        .slice(0, 3),
    [conversations],
  );
  return (
    <div className={cn(CARD, "flex h-full flex-col")}>
      <CardHead
        icon={Inbox}
        tile="bg-linear-to-br from-sky-600 to-cyan-700"
        title="Latest from the inbox"
        subtitle="Every channel, one thread list"
        right={
          <button type="button" onClick={onOpen} className={LINK_PILL}>
            Inbox <ArrowRight aria-hidden className="size-3" />
          </button>
        }
      />
      <ul className="flex flex-1 flex-col gap-1 border-t border-slate-100 p-2">
        {latest.map(({ c, last }) => {
          const isTyping = typing.includes(c.id);
          return (
            <li key={c.id}>
              <button
                type="button"
                onClick={onOpen}
                className={cn("flex w-full cursor-pointer items-start gap-3 rounded-xl px-2.5 py-2.5 text-left transition-colors hover:bg-slate-50", FOCUS)}
              >
                <span className="relative mt-0.5 shrink-0">
                  <PlatformIcon platform={c.platform} className="size-8" />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="flex items-center gap-2">
                    <span className="truncate text-[13px] font-bold text-slate-800">{c.guestName}</span>
                    {c.aiEnabled && (
                      <span className={cn(BADGE, "bg-violet-50 px-1.5 text-violet-700")}>
                        <Bot aria-hidden className="size-3" />
                        AI
                      </span>
                    )}
                    <span className="ml-auto shrink-0 text-[11px] text-slate-500 tabular-nums">{last ? minutesAgoLabel(last.minutesAgo) : ""}</span>
                  </span>
                  <span className="mt-0.5 flex items-center gap-2">
                    <span className={cn("line-clamp-1 flex-1 text-xs", c.unread ? "font-semibold text-slate-700" : "text-slate-500")}>
                      {isTyping ? "Yetti is typing..." : last ? `${last.from === "ai" ? "Yetti: " : last.from === "staff" ? "You: " : ""}${last.text}` : ""}
                    </span>
                    {c.unread > 0 && (
                      <span className="flex size-4.5 shrink-0 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-white tabular-nums">{c.unread}</span>
                    )}
                  </span>
                  <span className="sr-only">{PLATFORM_LABEL[c.platform]}</span>
                </span>
              </button>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

/* --------------------------------------------------------------- screen */

/** Values for days -6..0 from a "days ago" accessor. */
function lastSeven<T>(items: T[], daysAgo: (item: T) => number, weight: (item: T) => number = () => 1) {
  const out = [0, 0, 0, 0, 0, 0, 0];
  for (const it of items) {
    const ago = daysAgo(it);
    if (ago >= 0 && ago <= 6) out[6 - ago]! += weight(it);
  }
  return out;
}

function greetingFor(minute: number | null) {
  if (minute === null || minute < 12 * 60) return "Good morning";
  if (minute < 17 * 60) return "Good afternoon";
  return "Good evening";
}

export function DashboardScreen({ onNavigate }: { onNavigate: (s: ScreenId) => void }) {
  const { bookings, contacts, conversations, askWalkthrough } = useStore();
  const reduce = useReducedMotion();
  const now = useNowMinute();

  const live = React.useMemo(() => {
    const active = (b: DemoBooking) => b.status !== "cancelled";
    const today = bookings.filter((b) => b.day === 0 && active(b));
    const createdToday = bookings.filter((b) => b.createdDaysAgo === 0);
    const open = conversations.filter((c) => c.unread > 0 || c.messages[c.messages.length - 1]?.from === "guest");

    const groups = new Map<string, Departure>();
    for (const b of today) {
      const key = `${b.activityId}-${b.startMinute}`;
      const g = groups.get(key) ?? { key, activityId: b.activityId, startMinute: b.startMinute, guests: 0, checkedIn: 0, bookings: 0 };
      g.guests += b.guests;
      g.bookings += 1;
      if (b.checkedIn) g.checkedIn += b.guests;
      groups.set(key, g);
    }

    const aiToday = conversations.reduce((s, c) => s + c.messages.filter((m) => m.from === "ai" && m.minutesAgo < 1440).length, 0);
    const messagesAgo = conversations.flatMap((c) => c.messages);

    return {
      guestsToday: today.reduce((s, b) => s + b.guests, 0),
      todayCount: today.length,
      createdToday: createdToday.length,
      newThisWeek: contacts.filter((c) => c.addedDaysAgo <= 7).length,
      open: open.length,
      openByAI: open.filter((c) => c.aiEnabled).length,
      departures: [...groups.values()].sort((a, b) => a.startMinute - b.startMinute),
      spark: {
        guests: lastSeven(bookings.filter(active), (b) => -b.day, (b) => b.guests),
        bookings: lastSeven(bookings, (b) => b.createdDaysAgo),
        contacts: lastSeven(contacts, (c) => c.addedDaysAgo),
        conversations: lastSeven(messagesAgo, (m) => Math.floor(m.minutesAgo / 1440)),
      },
      chart: lastSeven(bookings, (b) => b.createdDaysAgo).map((count, i) => ({
        count,
        today: i === 6,
        label: i === 6 ? "Today" : dayDate(i - 6).toLocaleDateString("en-US", { weekday: "short" }),
      })),
      modules: [
        { label: "Bookings", value: createdToday.length, color: "#7c3aed", screen: "booking" },
        { label: "Inbox", value: aiToday, color: "#0891b2", screen: "inbox" },
        { label: "CRM", value: contacts.filter((c) => c.addedDaysAgo === 0).length, color: "#2563eb", screen: "crm" },
        { label: "Check-ins", value: today.filter((b) => b.checkedIn).length, color: "#059669", screen: "checkin" },
      ] satisfies ModuleRow[],
    };
  }, [bookings, contacts, conversations]);

  const dateLine = dayDate(0).toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" });
  const firstName = yettiDeck.userName.split(" ")[0];

  const item = (i: number) => ({
    initial: reduce ? false : { opacity: 0, y: 8 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.35, ease, delay: reduce ? 0 : 0.06 * i },
  });

  return (
    <div className="@container px-4 pt-5 pb-8 sm:px-6">
      {/* Header. */}
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div className="min-w-0">
          <p className="text-[13px] font-medium text-slate-500">
            {greetingFor(now)}, {firstName} <span aria-hidden>·</span> {dateLine}
          </p>
          <h1 className="mt-1 text-2xl font-black tracking-tight text-slate-900 @2xl:text-[28px]">{yettiDeck.workspaceName}</h1>
        </div>
        <div className="flex items-center gap-2">
          <span className="inline-flex h-9 items-center gap-2 rounded-full border border-slate-200 bg-white px-3.5 text-xs font-semibold text-slate-600">
            <span aria-hidden className="size-1.5 rounded-full bg-emerald-500" />
            {ACTIVE_MODULES} active
          </span>
          <button type="button" onClick={() => askWalkthrough("Dashboard widgets")} className={cn(BTN_OUTLINE, "h-9 rounded-full px-3.5 text-xs")}>
            <Plus aria-hidden />
            Widgets
          </button>
        </div>
      </div>

      {/* Stat cards. */}
      <div className="mt-5 grid grid-cols-1 gap-3 @sm:grid-cols-2 @4xl:grid-cols-4 @4xl:gap-4">
        {(
          [
            {
              gradient: "violet",
              icon: Users,
              value: live.guestsToday,
              label: "Guests today",
              sub: `${live.todayCount} ${live.todayCount === 1 ? "booking" : "bookings"}`,
              spark: live.spark.guests,
              to: "booking",
            },
            {
              gradient: "purple",
              icon: CalendarDays,
              value: live.createdToday,
              label: "Bookings today",
              sub: "Created today",
              spark: live.spark.bookings,
              to: "booking",
            },
            {
              gradient: "blue",
              icon: UserCheck,
              value: contacts.length,
              label: "CRM contacts",
              sub: `+${live.newThisWeek} this week`,
              spark: live.spark.contacts,
              to: "crm",
            },
            {
              gradient: "sky",
              icon: MessagesSquare,
              value: live.open,
              label: "Open conversations",
              sub: `${live.openByAI} handled by AI`,
              spark: live.spark.conversations,
              to: "inbox",
            },
          ] as const
        ).map((s, i) => (
          <motion.div key={s.label} {...item(i)}>
            <StatCard
              gradient={s.gradient}
              icon={s.icon}
              value={s.value}
              label={s.label}
              sub={s.sub}
              spark={[...s.spark]}
              onClick={() => onNavigate(s.to)}
              ariaLabel={`${s.label}: ${s.value}. ${s.sub}. Open ${s.to === "crm" ? "CRM" : s.to === "inbox" ? "Inbox" : "Booking"}`}
            />
          </motion.div>
        ))}
      </div>

      {/* Charts row. */}
      <div className="mt-3 grid grid-cols-1 gap-3 @2xl:grid-cols-2 @4xl:mt-4 @4xl:gap-4 @5xl:grid-cols-12">
        <motion.div {...item(4)} className="@2xl:col-span-2 @5xl:col-span-6">
          <ActivityChart data={live.chart} />
        </motion.div>
        <motion.div {...item(5)} className="@5xl:col-span-3">
          <ModuleActivity rows={live.modules} onNavigate={onNavigate} />
        </motion.div>
        <motion.div {...item(6)} className="@5xl:col-span-3">
          <Integrations onOpen={(name) => askWalkthrough(`${name} integration settings`)} />
        </motion.div>
      </div>

      {/* Operations row. */}
      <div className="mt-3 grid grid-cols-1 gap-3 @4xl:mt-4 @4xl:gap-4 @5xl:grid-cols-12">
        <motion.div {...item(7)} className="@5xl:col-span-7">
          <Departures departures={live.departures} onOpen={() => onNavigate("booking")} />
        </motion.div>
        <motion.div {...item(8)} className="flex flex-col gap-3 @4xl:gap-4 @5xl:col-span-5">
          <LatestInbox onOpen={() => onNavigate("inbox")} />
          <button
            type="button"
            onClick={() => onNavigate("checkin")}
            className={cn(
              "group flex w-full cursor-pointer items-center gap-3 rounded-2xl border border-dashed border-violet-200 bg-violet-50/50 p-4 text-left transition-colors hover:border-violet-300 hover:bg-violet-50",
              FOCUS,
            )}
          >
            <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-white text-violet-700 shadow-sm">
              <ScanLine aria-hidden className="size-5" />
            </span>
            <span className="min-w-0 flex-1">
              <span className="block text-[13px] font-bold text-slate-800">Open the check-in desk</span>
              <span className="block text-xs text-slate-600">
                {live.departures.reduce((s, d) => s + d.guests - d.checkedIn, 0)} guests still to check in today
              </span>
            </span>
            <CalendarCheck aria-hidden className="size-4 text-violet-600 transition-transform group-hover:translate-x-0.5" />
          </button>
        </motion.div>
      </div>
    </div>
  );
}
