"use client";

import * as React from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { CircleAlert, CircleCheck, ClipboardCheck, CreditCard, FileSignature, RotateCcw, ScanLine, Search, Settings2, Smartphone, Users } from "lucide-react";
import { cn } from "@/lib/utils";
import type { DemoBooking } from "@/content/yetti";
import { bookingRef, formatDay, formatRange, useStore } from "./store";
import { BADGE, BTN_DARK, BTN_OUTLINE, BTN_PRIMARY, CARD, Dialog, FOCUS, Field, INPUT, InitialsTile, ModuleHeader, ModuleTabs, PAYMENT_BADGE, type TabDef } from "./ui";
import type { ScreenId } from "./app-frame";

type Tab = "checkin" | "kiosk" | "settings";

const TABS: TabDef<Tab>[] = [
  { id: "checkin", label: "Check-In", icon: ClipboardCheck },
  { id: "kiosk", label: "Kiosk Access", icon: Smartphone },
  { id: "settings", label: "Settings", icon: Settings2 },
];

/** Matches a full BK-YYYYMMDD-XXXX reference or just its last four characters. */
function matches(b: DemoBooking, query: string) {
  const q = query.trim().toUpperCase();
  if (!q) return false;
  return bookingRef(b).toUpperCase() === q || b.code === q || bookingRef(b).toUpperCase().endsWith(q);
}

/* ------------------------------------------------------------- signature */

function SignaturePad({ onChange }: { onChange: (signed: boolean) => void }) {
  const canvas = React.useRef<HTMLCanvasElement>(null);
  const drawing = React.useRef(false);
  const strokes = React.useRef(0);

  const point = (e: React.PointerEvent<HTMLCanvasElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    return { x: ((e.clientX - rect.left) / rect.width) * e.currentTarget.width, y: ((e.clientY - rect.top) / rect.height) * e.currentTarget.height };
  };

  const clear = () => {
    const c = canvas.current;
    c?.getContext("2d")?.clearRect(0, 0, c.width, c.height);
    strokes.current = 0;
    onChange(false);
  };

  return (
    <div>
      <canvas
        ref={canvas}
        width={640}
        height={200}
        aria-label="Signature pad, draw your signature"
        className="h-28 w-full cursor-crosshair touch-none rounded-xl border border-dashed border-slate-300 bg-slate-50"
        onPointerDown={(e) => {
          const ctx = e.currentTarget.getContext("2d");
          if (!ctx) return;
          e.currentTarget.setPointerCapture(e.pointerId);
          drawing.current = true;
          const p = point(e);
          ctx.lineWidth = 4;
          ctx.lineCap = "round";
          ctx.lineJoin = "round";
          ctx.strokeStyle = "#0f172a";
          ctx.beginPath();
          ctx.moveTo(p.x, p.y);
        }}
        onPointerMove={(e) => {
          if (!drawing.current) return;
          const ctx = e.currentTarget.getContext("2d");
          const p = point(e);
          ctx?.lineTo(p.x, p.y);
          ctx?.stroke();
        }}
        onPointerUp={() => {
          if (!drawing.current) return;
          drawing.current = false;
          strokes.current += 1;
          onChange(true);
        }}
      />
      <button type="button" onClick={clear} className={cn("mt-1.5 inline-flex cursor-pointer items-center gap-1 rounded-md px-1 text-xs font-medium text-slate-500 hover:text-slate-800", FOCUS)}>
        <RotateCcw aria-hidden className="size-3" />
        Clear signature
      </button>
    </div>
  );
}

function WaiverDialog({ booking, open, onClose }: { booking: DemoBooking; open: boolean; onClose: () => void }) {
  const { signWaiver, contact, activity, toast } = useStore();
  const guest = contact(booking.contactId);
  const [name, setName] = React.useState(guest?.name ?? "");
  const [drawn, setDrawn] = React.useState(false);
  const [agreed, setAgreed] = React.useState(false);
  const ready = agreed && (drawn || name.trim().length > 2);

  return (
    <Dialog open={open} onClose={onClose} title="Liability waiver" description={`${activity(booking.activityId).name}, ${booking.guests} guests`} wide>
      <div className="max-h-32 overflow-y-auto rounded-xl bg-slate-50 p-3 text-[13px] leading-relaxed text-slate-600">
        I understand that boat tours, snorkeling and water activities carry inherent risks. I confirm that everyone in my group can swim or will wear a life jacket, will follow the crew&apos;s safety briefing, and has disclosed any medical conditions. I release Coral Bay Boat Tours from claims arising from those inherent risks.
      </div>
      <Field label="Full name" className="mt-4">
        <input value={name} onChange={(e) => setName(e.target.value)} className={INPUT} />
      </Field>
      <div className="mt-4">
        <span className="mb-1.5 block text-xs font-semibold text-slate-500">Signature</span>
        <SignaturePad onChange={setDrawn} />
      </div>
      <label className="mt-3 flex cursor-pointer items-start gap-2 text-sm text-slate-700">
        <input type="checkbox" checked={agreed} onChange={(e) => setAgreed(e.target.checked)} className="mt-0.5 size-4 cursor-pointer accent-[#2d6695]" />
        I have read and agree to the waiver on behalf of my group
      </label>
      <div className="mt-5 flex justify-end gap-2">
        <button type="button" onClick={onClose} className={BTN_OUTLINE}>
          Cancel
        </button>
        <button
          type="button"
          disabled={!ready}
          onClick={() => {
            signWaiver(booking.id);
            toast("Waiver signed", name.trim() || guest?.name);
            onClose();
          }}
          className={BTN_PRIMARY}
        >
          <FileSignature aria-hidden />
          Sign waiver
        </button>
      </div>
    </Dialog>
  );
}

/* ----------------------------------------------------------------- result */

function ResultCard({ booking }: { booking: DemoBooking }) {
  const { contact, activity, checkIn, toast, askWalkthrough } = useStore();
  const reduce = useReducedMotion();
  const [waiverOpen, setWaiverOpen] = React.useState(false);
  const guest = contact(booking.contactId);
  const a = activity(booking.activityId);
  const pay = PAYMENT_BADGE[booking.payment];

  return (
    <motion.div initial={{ opacity: 0, y: reduce ? 0 : 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }} className={cn(CARD, "overflow-hidden")}>
      <div className="h-1.5" style={{ backgroundColor: a.color }} />
      <div className="p-5">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div className="flex items-center gap-3">
            <InitialsTile name={guest?.name ?? "Guest"} size="lg" />
            <div>
              <p className="text-lg font-bold text-slate-900">{guest?.name ?? "Guest"}</p>
              <p className="font-mono text-xs text-slate-500">{bookingRef(booking)}</p>
            </div>
          </div>
          <div className="flex gap-1.5">
            <span className={cn(BADGE, pay.className)}>{pay.label}</span>
            <span className={cn(BADGE, booking.waiverSigned ? "bg-emerald-50 text-emerald-700" : "bg-amber-50 text-amber-700")}>{booking.waiverSigned ? "Waiver signed" : "Waiver needed"}</span>
          </div>
        </div>

        <dl className="mt-5 grid grid-cols-2 gap-4 sm:grid-cols-4">
          {[
            ["Activity", a.name],
            ["Date", formatDay(booking.day, { weekday: "short", month: "short", day: "numeric" })],
            ["Time", formatRange(booking.startMinute, a.durationMinutes)],
            ["Guests", `${booking.guests} guests`],
          ].map(([label, value]) => (
            <div key={label}>
              <dt className="text-xs text-slate-500">{label}</dt>
              <dd className="mt-0.5 text-sm font-semibold text-slate-900">{value}</dd>
            </div>
          ))}
        </dl>

        {booking.day !== 0 && !booking.checkedIn && (
          <p className="mt-4 flex items-center gap-2 rounded-xl bg-amber-50 px-3 py-2 text-[13px] text-amber-800">
            <CircleAlert aria-hidden className="size-4 shrink-0" />
            This booking is for {formatDay(booking.day).toLowerCase() === "tomorrow" ? "tomorrow" : formatDay(booking.day)}, not today.
          </p>
        )}
        {booking.payment !== "paid" && !booking.checkedIn && (
          <button
            type="button"
            onClick={() => askWalkthrough("Taking payment at check-in")}
            className={cn("mt-3 flex w-full cursor-pointer items-center gap-2 rounded-xl bg-rose-50 px-3 py-2 text-left text-[13px] text-rose-800 hover:bg-rose-100", FOCUS)}
          >
            <CreditCard aria-hidden className="size-4 shrink-0" />
            {booking.payment === "deposit" ? "Balance due. Collect payment before boarding." : "Unpaid. Collect payment before boarding."}
          </button>
        )}

        <AnimatePresence mode="wait" initial={false}>
          {booking.checkedIn ? (
            <motion.div
              key="done"
              initial={{ opacity: 0, scale: reduce ? 1 : 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
              className="mt-5 flex items-center gap-3 rounded-2xl bg-emerald-50 p-4"
            >
              <CircleCheck aria-hidden className="size-9 text-emerald-600" />
              <div>
                <p className="font-bold text-emerald-800">Checked in</p>
                <p className="text-[13px] text-emerald-700">
                  {booking.guests} guests on the {a.short} manifest
                </p>
              </div>
            </motion.div>
          ) : (
            <motion.div key="actions" className="mt-5 flex flex-wrap gap-2">
              {!booking.waiverSigned && (
                <button type="button" onClick={() => setWaiverOpen(true)} className={BTN_OUTLINE}>
                  <FileSignature aria-hidden />
                  Sign waiver
                </button>
              )}
              <button
                type="button"
                disabled={!booking.waiverSigned || booking.status === "cancelled"}
                onClick={() => {
                  checkIn(booking.id);
                  toast("Guests checked in", `${guest?.name ?? "Guest"}, ${booking.guests} guests`);
                }}
                className={BTN_PRIMARY}
              >
                <Users aria-hidden />
                Check in {booking.guests} guests
              </button>
              {!booking.waiverSigned && <p className="w-full text-xs text-slate-500">The waiver has to be signed before the group can check in.</p>}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      <WaiverDialog key={booking.id} booking={booking} open={waiverOpen} onClose={() => setWaiverOpen(false)} />
    </motion.div>
  );
}

/* ----------------------------------------------------------------- screen */

export function CheckinScreen({ onNavigate }: { onNavigate: (s: ScreenId) => void }) {
  const { bookings, contact, activity, askWalkthrough } = useStore();
  const reduce = useReducedMotion();
  const [query, setQuery] = React.useState("");
  const [foundId, setFoundId] = React.useState<string | null>(null);
  const [missed, setMissed] = React.useState(false);
  const [scanning, setScanning] = React.useState(false);

  const today = bookings.filter((b) => b.day === 0 && b.status !== "cancelled").sort((x, y) => x.startMinute - y.startMinute);
  const done = today.filter((b) => b.checkedIn).length;
  const found = bookings.find((b) => b.id === foundId) ?? null;

  const open = (b: DemoBooking) => {
    setQuery(bookingRef(b));
    setFoundId(b.id);
    setMissed(false);
  };

  const search = () => {
    const hit = bookings.find((b) => matches(b, query));
    setFoundId(hit?.id ?? null);
    setMissed(!hit);
  };

  React.useEffect(() => {
    if (!scanning) return;
    const t = window.setTimeout(() => {
      setScanning(false);
      const next = today.find((b) => !b.checkedIn) ?? today[0];
      if (next) open(next);
    }, 900);
    return () => window.clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps -- runs once per scan
  }, [scanning]);

  return (
    <div className="pb-10">
      <ModuleHeader icon={ClipboardCheck} title="Check-In" subtitle="Manage guest check-in, kiosks, and branding" />
      <ModuleTabs tabs={TABS} active="checkin" onChange={(t) => t !== "checkin" && askWalkthrough(t === "kiosk" ? "Kiosk access" : "Check-in settings")} />

      <div className="mx-auto max-w-5xl px-4 pt-6 sm:px-6">
        <h2 className="text-base font-bold text-slate-900">Guest Check-In</h2>
        <p className="mt-0.5 text-[13px] text-slate-500">Enter a booking reference or scan a QR code to check in guests.</p>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            search();
          }}
          className={cn(CARD, "relative mt-4 overflow-hidden p-5")}
        >
          <label htmlFor="yetti-ref" className="text-xs font-semibold text-slate-500">
            Booking reference
          </label>
          <div className="mt-2 flex flex-col gap-2 sm:flex-row">
            <input
              id="yetti-ref"
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                setMissed(false);
              }}
              placeholder="BK-YYYYMMDD-XXXX"
              className={cn(INPUT, "h-11 flex-1 font-mono tracking-wide")}
            />
            <div className="flex gap-2">
              <button type="submit" className={cn(BTN_PRIMARY, "h-11 flex-1 sm:flex-none")}>
                <Search aria-hidden />
                Search
              </button>
              <button type="button" onClick={() => setScanning(true)} className={cn(BTN_DARK, "h-11 flex-1 sm:flex-none")}>
                <ScanLine aria-hidden />
                Scan
              </button>
            </div>
          </div>
          {missed && <p className="mt-2 text-[13px] text-rose-600">No booking matches that reference. Try one from today&apos;s arrivals below.</p>}

          <AnimatePresence>
            {scanning && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 flex flex-col items-center justify-center gap-2 bg-slate-900/90 text-white"
              >
                <div className="relative size-16 rounded-xl border-2 border-white/70">
                  {!reduce && (
                    <motion.span
                      className="absolute inset-x-1 h-0.5 rounded bg-[#68b4e4]"
                      animate={{ top: ["10%", "90%", "10%"] }}
                      transition={{ duration: 0.9, ease: "easeInOut" }}
                    />
                  )}
                </div>
                <p className="text-sm font-medium">Scanning QR code</p>
              </motion.div>
            )}
          </AnimatePresence>
        </form>

        <div className="mt-5 grid gap-5 lg:grid-cols-[1fr_22rem]">
          <div>
            {found ? (
              <ResultCard key={found.id} booking={found} />
            ) : (
              <div className={cn(CARD, "flex flex-col items-center justify-center gap-2 px-6 py-14 text-center")}>
                <span className="flex size-12 items-center justify-center rounded-2xl bg-sky-50 text-primary">
                  <ScanLine aria-hidden className="size-6" />
                </span>
                <p className="text-sm font-semibold text-slate-800">Look up a booking to start</p>
                <p className="max-w-xs text-[13px] text-slate-500">Guests show the QR code from their confirmation, or read out the reference.</p>
              </div>
            )}
          </div>

          <aside className={cn(CARD, "h-fit p-4")}>
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-slate-900">Today&apos;s arrivals</h3>
              <span className="text-xs text-slate-500 tabular-nums">
                {done} of {today.length} checked in
              </span>
            </div>
            <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-slate-100">
              <div className="h-full rounded-full bg-emerald-500 transition-[width] duration-500" style={{ width: `${today.length ? (done / today.length) * 100 : 0}%` }} />
            </div>
            <ul className="mt-3 flex flex-col gap-1">
              {today.map((b) => {
                const a = activity(b.activityId);
                const g = contact(b.contactId);
                const on = b.id === foundId;
                return (
                  <li key={b.id}>
                    <button
                      type="button"
                      onClick={() => open(b)}
                      className={cn("flex w-full cursor-pointer items-center gap-3 rounded-xl px-2 py-2 text-left transition-colors", FOCUS, on ? "bg-sky-50" : "hover:bg-slate-50")}
                    >
                      <span className="w-14 shrink-0 text-xs font-semibold text-slate-500 tabular-nums">{formatRange(b.startMinute, 0).split(" to ")[0]}</span>
                      <span className="min-w-0 flex-1">
                        <span className="block truncate text-[13px] font-semibold text-slate-900">{g?.name ?? "Guest"}</span>
                        <span className="flex items-center gap-1.5 truncate text-xs text-slate-500">
                          <span aria-hidden className="size-2 shrink-0 rounded-full" style={{ backgroundColor: a.color }} />
                          {a.short}, {b.guests} guests
                        </span>
                      </span>
                      {b.checkedIn ? (
                        <CircleCheck aria-label="Checked in" className="size-4 shrink-0 text-emerald-600" />
                      ) : !b.waiverSigned ? (
                        <span className={cn(BADGE, "bg-amber-50 text-amber-700")}>Waiver</span>
                      ) : (
                        <span className={cn(BADGE, "bg-slate-100 text-slate-600")}>Ready</span>
                      )}
                    </button>
                  </li>
                );
              })}
            </ul>
            <button type="button" onClick={() => onNavigate("booking")} className={cn(BTN_OUTLINE, "mt-3 h-9 w-full text-xs")}>
              Open today&apos;s calendar
            </button>
          </aside>
        </div>
      </div>
    </div>
  );
}
