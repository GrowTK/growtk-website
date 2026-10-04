"use client";

import * as React from "react";
import { ArrowDownLeft, ArrowRight, ArrowUpRight, Check, History, Lock, MessageCircle, Minus, Plus, Receipt, Unlock, Wallet } from "lucide-react";
import { cn } from "@/lib/utils";
import { clockAt, orderNumber, orderTotal, rs, useStore } from "./store";
import type { ScreenId } from "./app-frame";
import { BADGE, BTN_DANGER, BTN_DARK, BTN_GO, BTN_SOFT, CARD, FOCUS, Field, GRADIENTS, ICON_BTN, INPUT, Modal, ModuleHeader, NumberPad, pill } from "./ui";

/**
 * The cash drawer session, after src/app/(pos)/app/drawer/page.tsx: what
 * should be in the drawer, cash in and out with a note, and closing with a
 * count. Closing fires the drawer alert (and the end of day add-on, if on).
 */

const DENOMS = [5000, 1000, 500, 100, 50, 20, 10];
const NOTES = ["Change top up", "Supplier paid", "Staff meal", "Gas cylinder"];

export function DrawerScreen({ onNavigate }: { onNavigate: (s: ScreenId) => void }) {
  const { drawer, orders, expectedCash, askWalkthrough } = useStore();
  const [move, setMove] = React.useState<"cash_in" | "cash_out" | null>(null);
  const [closing, setClosing] = React.useState(false);
  const [opening, setOpening] = React.useState(false);

  const session = orders.filter((o) => (o.session ?? 1) === drawer.session);
  const cashSales = session.filter((o) => o.method === "cash").reduce((s, o) => s + orderTotal(o), 0);
  const qrSales = session.filter((o) => o.method === "qr").reduce((s, o) => s + orderTotal(o), 0);
  const cashIn = drawer.events.filter((e) => e.kind === "cash_in").reduce((s, e) => s + e.amount, 0);
  const cashOut = drawer.events.filter((e) => e.kind === "cash_out").reduce((s, e) => s + e.amount, 0);
  const expected = expectedCash();

  // Drawer events and cash sales on one timeline, newest first.
  const timeline = [
    ...drawer.events.map((e) => ({ id: e.id, minutesAgo: e.minutesAgo, kind: e.kind, amount: e.amount, label: e.kind === "open" ? "Drawer opened" : e.kind === "cash_in" ? "Cash in" : "Cash out", note: `${e.note} · ${e.by}` })),
    ...session.filter((o) => o.method === "cash").map((o) => ({ id: o.id, minutesAgo: o.minutesAgo, kind: "sale" as const, amount: orderTotal(o), label: `Sale ${orderNumber(o.seq).slice(-3)}`, note: o.lines.length === 1 ? "1 line" : `${o.lines.length} lines` })),
  ].sort((a, b) => a.minutesAgo - b.minutesAgo);

  return (
    <div className="absolute inset-0 overflow-y-auto px-4 pb-24 sm:px-6">
      <ModuleHeader
        icon={Wallet}
        gradient={GRADIENTS.drawer}
        title="Drawer"
        subtitle={drawer.open ? `Session ${drawer.session} · opened by ${drawer.openedBy} at ${clockAt(drawer.openedMinutesAgo)}` : `Session ${drawer.session} · closed`}
        action={
          <button type="button" onClick={() => askWalkthrough("Drawer session history")} className={cn(BTN_SOFT, "h-10 rounded-full")}>
            <History aria-hidden size={15} />
            History
          </button>
        }
      />

      <div className="mt-3 grid gap-3 lg:grid-cols-[1.5fr_1fr]">
        <div className="flex min-w-0 flex-col gap-3">
          {drawer.open ? (
            <>
              <section className="rounded-3xl bg-zinc-900 p-5 text-white sm:p-6" aria-labelledby="jerrys-expected">
                <p id="jerrys-expected" className="flex items-center gap-1.5 text-xs font-semibold text-white/70">
                  <Unlock aria-hidden size={13} />
                  Expected in the drawer
                </p>
                <p className="jerrys-display mt-1 text-5xl font-black tabular-nums sm:text-6xl">{rs(expected)}</p>
                <dl className="mt-5 grid grid-cols-2 gap-x-6 gap-y-3 text-sm sm:grid-cols-4">
                  <Row label="Opening float" value={rs(drawer.float)} />
                  <Row label="Cash sales" value={`+${rs(cashSales)}`} tone="text-emerald-300" />
                  <Row label="Cash in" value={`+${rs(cashIn)}`} tone="text-emerald-300" />
                  <Row label="Cash out" value={`-${rs(cashOut)}`} tone="text-red-300" />
                </dl>
                <p className="mt-4 border-t border-white/10 pt-3 text-xs text-white/70">
                  QR transfers this session: <span className="font-bold text-white tabular-nums">{rs(qrSales)}</span>, paid to the bank, not in the drawer.
                </p>
              </section>

              <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
                <button type="button" onClick={() => setMove("cash_in")} className={cn(BTN_SOFT, "h-14")}>
                  <ArrowDownLeft aria-hidden size={17} className="text-emerald-600" />
                  Cash in
                </button>
                <button type="button" onClick={() => setMove("cash_out")} className={cn(BTN_SOFT, "h-14")}>
                  <ArrowUpRight aria-hidden size={17} className="text-red-600" />
                  Cash out
                </button>
                <button type="button" onClick={() => setClosing(true)} className={cn(BTN_DARK, "col-span-2 h-14 sm:col-span-1")}>
                  <Lock aria-hidden size={16} />
                  Close drawer
                </button>
              </div>
            </>
          ) : (
            <ClosedSummary onNavigate={onNavigate} onOpen={() => setOpening(true)} />
          )}
        </div>

        <section className={cn(CARD, "self-start p-4")} aria-labelledby="jerrys-timeline">
          <h2 id="jerrys-timeline" className="text-sm font-black text-zinc-900">
            This session
          </h2>
          <ol className="mt-3 flex flex-col">
            {timeline.map((t) => (
              <li key={t.id} className="flex items-center gap-3 border-b border-zinc-100 py-2.5 last:border-b-0">
                <span
                  className={cn(
                    "flex size-8 shrink-0 items-center justify-center rounded-full",
                    t.kind === "cash_out" ? "bg-red-50 text-red-600" : t.kind === "open" ? "bg-zinc-100 text-zinc-700" : "bg-emerald-50 text-emerald-700",
                  )}
                >
                  {t.kind === "sale" ? <Receipt aria-hidden size={14} /> : t.kind === "cash_out" ? <ArrowUpRight aria-hidden size={14} /> : t.kind === "open" ? <Unlock aria-hidden size={14} /> : <ArrowDownLeft aria-hidden size={14} />}
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block text-sm font-bold text-zinc-900">{t.label}</span>
                  <span className="block truncate text-xs text-zinc-500">{t.note}</span>
                </span>
                <span className="flex shrink-0 flex-col items-end">
                  <span className={cn("text-sm font-black tabular-nums", t.kind === "cash_out" ? "text-red-600" : t.kind === "open" ? "text-zinc-900" : "text-emerald-700")}>
                    {t.kind === "cash_out" ? "-" : t.kind === "open" ? "" : "+"}
                    {rs(t.amount)}
                  </span>
                  <span className="text-[11px] text-zinc-500">{clockAt(t.minutesAgo)}</span>
                </span>
              </li>
            ))}
          </ol>
        </section>
      </div>

      <CashMoveModal kind={move} onClose={() => setMove(null)} />
      <CloseModal open={closing} onClose={() => setClosing(false)} expected={expected} />
      <OpenModal open={opening} onClose={() => setOpening(false)} />
    </div>
  );
}

function Row({ label, value, tone }: { label: string; value: string; tone?: string }) {
  return (
    <div>
      <dt className="text-[11px] font-semibold text-white/60">{label}</dt>
      <dd className={cn("mt-0.5 font-black tabular-nums", tone ?? "text-white")}>{value}</dd>
    </div>
  );
}

function ClosedSummary({ onNavigate, onOpen }: { onNavigate: (s: ScreenId) => void; onOpen: () => void }) {
  const { drawer, isOn } = useStore();
  const c = drawer.closed;
  if (!c) return null;
  const tone = c.variance === 0 ? { label: "Balanced", className: "bg-emerald-50 text-emerald-700" } : c.variance > 0 ? { label: "Over", className: "bg-amber-50 text-amber-700" } : { label: "Short", className: "bg-red-50 text-red-700" };
  return (
    <section className="rounded-3xl border border-zinc-100 bg-white p-5 sm:p-6" aria-labelledby="jerrys-closed">
      <div className="flex items-center gap-3">
        <span className="flex size-11 items-center justify-center rounded-2xl bg-zinc-900 text-white">
          <Lock aria-hidden size={18} />
        </span>
        <div>
          <h2 id="jerrys-closed" className="jerrys-display text-xl font-black text-zinc-900">
            Drawer closed
          </h2>
          <p className="text-xs text-zinc-500">Session {drawer.session} is counted and locked.</p>
        </div>
        <span className={cn(BADGE, "ml-auto px-3 py-1 text-xs", tone.className)}>{tone.label}</span>
      </div>
      <dl className="mt-5 grid grid-cols-3 gap-2">
        {[
          ["Expected", rs(c.expected)],
          ["Counted", rs(c.counted)],
          ["Variance", `${c.variance > 0 ? "+" : c.variance < 0 ? "-" : ""}${rs(Math.abs(c.variance))}`],
        ].map(([l, v]) => (
          <div key={l} className="rounded-2xl bg-zinc-50 p-3">
            <dt className="text-[11px] font-semibold text-zinc-500">{l}</dt>
            <dd className="mt-0.5 text-lg font-black text-zinc-900 tabular-nums sm:text-xl">{v}</dd>
          </div>
        ))}
      </dl>
      <ul className="mt-4 flex flex-col gap-1.5 text-sm text-zinc-700">
        {isOn("drawer-alert") && (
          <li className="flex items-center gap-2">
            <MessageCircle aria-hidden size={15} className="text-emerald-600" />
            The owner got the count and variance on WhatsApp.
          </li>
        )}
        {isOn("eod-report") && (
          <li className="flex items-center gap-2">
            <Check aria-hidden size={15} className="text-emerald-600" />
            End of day report sent, with tomorrow&apos;s buying list.
          </li>
        )}
      </ul>
      <div className="mt-5 flex flex-wrap gap-2">
        <button type="button" onClick={() => onNavigate("automations")} className={cn(BTN_SOFT, "rounded-full")}>
          See the owner&apos;s phone
          <ArrowRight aria-hidden size={15} />
        </button>
        <button type="button" onClick={onOpen} className={BTN_GO}>
          <Unlock aria-hidden size={16} />
          Open new session
        </button>
      </div>
    </section>
  );
}

function CashMoveModal({ kind, onClose }: { kind: "cash_in" | "cash_out" | null; onClose: () => void }) {
  const { cashMove } = useStore();
  const [amount, setAmount] = React.useState("");
  const [note, setNote] = React.useState("");
  React.useEffect(() => {
    setAmount("");
    setNote("");
  }, [kind]);
  const value = Number(amount || 0);
  return (
    <Modal open={!!kind} onClose={onClose} title={kind === "cash_in" ? "Cash in" : "Cash out"} description="Every move is logged with a note" size="md">
      <p className="rounded-2xl bg-zinc-50 py-3 text-center text-4xl font-black text-zinc-900 tabular-nums">{rs(value)}</p>
      <NumberPad value={amount} onChange={setAmount} className="mt-3 h-56" />
      <Field label="Note" className="mt-3">
        <input value={note} onChange={(e) => setNote(e.target.value)} placeholder="What was it for" className={INPUT} />
      </Field>
      <div className="mt-2 flex flex-wrap gap-1.5">
        {NOTES.map((n) => (
          <button key={n} type="button" onClick={() => setNote(n)} className={cn(pill(note === n), "h-8 px-3 text-xs")}>
            {n}
          </button>
        ))}
      </div>
      <button
        type="button"
        disabled={value <= 0}
        onClick={() => {
          if (kind) cashMove(kind, value, note.trim());
          onClose();
        }}
        className={cn(kind === "cash_out" ? BTN_DANGER : BTN_GO, "mt-4 h-12 w-full")}
      >
        {kind === "cash_out" ? "Take out" : "Put in"} {rs(value)}
      </button>
    </Modal>
  );
}

function CloseModal({ open, onClose, expected }: { open: boolean; onClose: () => void; expected: number }) {
  const { closeDrawer } = useStore();
  const [counts, setCounts] = React.useState<Record<number, number>>({});
  React.useEffect(() => {
    if (open) setCounts({});
  }, [open]);
  const counted = DENOMS.reduce((s, d) => s + d * (counts[d] ?? 0), 0);
  const variance = counted - expected;
  const tone = variance === 0 ? "text-emerald-700 bg-emerald-50" : variance > 0 ? "text-amber-700 bg-amber-50" : "text-red-700 bg-red-50";

  /** Fill the notes greedily so the count matches what's expected. */
  const matchExpected = () => {
    let left = expected;
    const next: Record<number, number> = {};
    DENOMS.forEach((d) => {
      next[d] = Math.floor(left / d);
      left -= next[d] * d;
    });
    setCounts(next);
  };

  return (
    <Modal open={open} onClose={onClose} title="Close drawer" description="Count the notes, then confirm" size="lg">
      <div className="grid gap-4 sm:grid-cols-[1fr_14rem]">
        <ul className="flex flex-col gap-1.5">
          {DENOMS.map((d) => {
            const n = counts[d] ?? 0;
            return (
              <li key={d} className="flex items-center gap-3 rounded-xl bg-zinc-50 px-3 py-1.5">
                <span className="w-20 text-sm font-black text-zinc-900 tabular-nums">{rs(d)}</span>
                <button type="button" aria-label={`One less Rs ${d} note`} disabled={n === 0} onClick={() => setCounts((c) => ({ ...c, [d]: Math.max(0, n - 1) }))} className={cn(ICON_BTN, "size-8 bg-white")}>
                  <Minus aria-hidden size={14} />
                </button>
                <span className="w-6 text-center text-sm font-black tabular-nums">{n}</span>
                <button type="button" aria-label={`One more Rs ${d} note`} onClick={() => setCounts((c) => ({ ...c, [d]: n + 1 }))} className={cn("flex size-8 cursor-pointer items-center justify-center rounded-full bg-zinc-900 text-white hover:bg-black", FOCUS)}>
                  <Plus aria-hidden size={14} />
                </button>
                <span className="ml-auto text-sm font-semibold text-zinc-600 tabular-nums">{rs(d * n)}</span>
              </li>
            );
          })}
        </ul>
        <div className="flex flex-col gap-2">
          <div className="rounded-2xl bg-zinc-50 p-3">
            <p className="text-[11px] font-semibold text-zinc-500">Expected</p>
            <p className="text-xl font-black text-zinc-900 tabular-nums">{rs(expected)}</p>
          </div>
          <div className="rounded-2xl bg-zinc-50 p-3">
            <p className="text-[11px] font-semibold text-zinc-500">Counted</p>
            <p className="text-xl font-black text-zinc-900 tabular-nums">{rs(counted)}</p>
          </div>
          <div className={cn("rounded-2xl p-3", tone)}>
            <p className="text-[11px] font-semibold">{variance === 0 ? "Balanced" : variance > 0 ? "Over by" : "Short by"}</p>
            <p className="text-xl font-black tabular-nums">{rs(Math.abs(variance))}</p>
          </div>
          <button type="button" onClick={matchExpected} className={cn(pill(false), "h-9 text-xs")}>
            Count matches expected
          </button>
          <button type="button" onClick={() => setCounts((c) => ({ ...c, 100: Math.max(0, (c[100] ?? 0) - 2) }))} className={cn(pill(false), "h-9 text-xs")}>
            Two Rs 100 notes missing
          </button>
          <button
            type="button"
            disabled={counted === 0}
            onClick={() => {
              closeDrawer(counted);
              onClose();
            }}
            className={cn(BTN_DARK, "mt-auto h-12")}
          >
            <Lock aria-hidden size={16} />
            Close and lock
          </button>
        </div>
      </div>
    </Modal>
  );
}

function OpenModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { openDrawer } = useStore();
  const [float, setFloat] = React.useState("10000");
  return (
    <Modal open={open} onClose={onClose} title="Open drawer" description="Count the opening float" size="md">
      <p className="rounded-2xl bg-zinc-50 py-3 text-center text-4xl font-black text-zinc-900 tabular-nums">{rs(Number(float || 0))}</p>
      <NumberPad value={float} onChange={setFloat} className="mt-3 h-56" />
      <button
        type="button"
        disabled={!Number(float)}
        onClick={() => {
          openDrawer(Number(float));
          onClose();
        }}
        className={cn(BTN_GO, "mt-4 h-12 w-full")}
      >
        <Unlock aria-hidden size={16} />
        Start session
      </button>
    </Modal>
  );
}
