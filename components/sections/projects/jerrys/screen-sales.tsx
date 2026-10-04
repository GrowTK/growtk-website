"use client";

import * as React from "react";
import { motion, useReducedMotion } from "motion/react";
import { BarChart2, Banknote, MessageCircle, Printer, QrCode, Receipt, RotateCcw, ShoppingBag, TrendingUp } from "lucide-react";
import { cn } from "@/lib/utils";
import { jerrysDeck, type DemoOrder } from "@/content/jerrys";
import { clockAt, itemById, lineName, orderNumber, orderTotal, rs, useStore } from "./store";
import type { ScreenId } from "./app-frame";
import { Avatar, BADGE, BTN_DARK, BTN_SOFT, CARD, FOCUS, GRADIENTS, ItemIcon, JERRYS_RED, Modal, ModuleHeader, StatLabel, WalkInMark, pill } from "./ui";

/**
 * Today's sales, after src/app/(pos)/pos/sales/page.tsx and orders/page.tsx:
 * stat tiles, revenue by hour, top sellers and every order with its receipt.
 * Everything is computed from the shared orders, so a sale charged on the
 * checkout slide shows up here straight away.
 */

const HOURS = 12;

function hourLabel(hoursAgo: number) {
  const d = new Date(Date.now() - hoursAgo * 3_600_000);
  return d.toLocaleTimeString("en-US", { hour: "numeric", hour12: true }).replace(" ", "").toLowerCase();
}

export function SalesScreen({ onNavigate }: { onNavigate: (s: ScreenId) => void }) {
  const { orders, askWalkthrough } = useStore();
  const [receipt, setReceipt] = React.useState<DemoOrder | null>(null);

  const revenue = orders.reduce((s, o) => s + orderTotal(o), 0);
  const cash = orders.filter((o) => o.method === "cash").reduce((s, o) => s + orderTotal(o), 0);
  const qr = revenue - cash;
  const avg = orders.length ? revenue / orders.length : 0;
  const recent = [...orders].sort((a, b) => a.minutesAgo - b.minutesAgo || b.seq - a.seq);

  return (
    <div className="absolute inset-0 overflow-y-auto px-4 pb-24 sm:px-6">
      <ModuleHeader
        icon={BarChart2}
        gradient={GRADIENTS.sales}
        title="Sales"
        subtitle={`Today · ${orders.length} orders`}
        action={
          <div className="flex gap-1.5">
            <button type="button" className={pill(true)} aria-pressed="true">
              Today
            </button>
            {["Week", "Month"].map((l) => (
              <button key={l} type="button" onClick={() => askWalkthrough("Sales history by week and month")} className={cn(pill(false), "hidden sm:inline-flex")}>
                {l}
              </button>
            ))}
          </div>
        }
      />

      {/* Stat row: revenue leads, the rest step down. */}
      <div className="mt-3 grid grid-cols-2 gap-2.5 lg:grid-cols-[1.4fr_1fr_1fr_1.3fr]">
        <div className="col-span-2 rounded-2xl bg-zinc-900 p-4 text-white lg:col-span-1">
          <p className="flex items-center gap-1.5 text-[11px] font-semibold text-white/70">
            <TrendingUp aria-hidden size={13} />
            Revenue today
          </p>
          <p className="jerrys-display mt-1 text-3xl font-black tabular-nums sm:text-4xl">{rs(revenue)}</p>
        </div>
        <div className="rounded-2xl bg-zinc-50 p-4">
          <StatLabel icon={ShoppingBag}>Orders</StatLabel>
          <p className="mt-1 text-2xl font-black text-zinc-900 tabular-nums">{orders.length}</p>
        </div>
        <div className="rounded-2xl bg-zinc-50 p-4">
          <StatLabel icon={Receipt}>Average order</StatLabel>
          <p className="mt-1 text-2xl font-black text-zinc-900 tabular-nums">{rs(avg)}</p>
        </div>
        <div className="col-span-2 rounded-2xl bg-zinc-50 p-4 lg:col-span-1">
          <div className="flex justify-between gap-2">
            <StatLabel icon={Banknote}>Cash {rs(cash)}</StatLabel>
            <StatLabel icon={QrCode}>QR {rs(qr)}</StatLabel>
          </div>
          <div className="mt-3 flex h-2.5 overflow-hidden rounded-full bg-violet-500" aria-label={`Cash ${Math.round((cash / (revenue || 1)) * 100)} percent of revenue`} role="img">
            <motion.span className="h-full bg-emerald-500" animate={{ width: `${(cash / (revenue || 1)) * 100}%` }} transition={{ duration: 0.4 }} />
          </div>
          <p className="mt-2 text-[11px] font-semibold text-zinc-500">{Math.round((cash / (revenue || 1)) * 100)}% paid in cash</p>
        </div>
      </div>

      <div className="mt-3 grid gap-3 lg:grid-cols-[1.6fr_1fr]">
        <div className="flex min-w-0 flex-col gap-3">
          <HourlyChart orders={orders} />

          <section className={cn(CARD, "overflow-hidden")} aria-labelledby="jerrys-recent">
            <div className="flex items-center justify-between px-4 pt-4 pb-2">
              <h2 id="jerrys-recent" className="text-sm font-black text-zinc-900">
                Orders
              </h2>
              <button type="button" onClick={() => onNavigate("checkout")} className={cn(BADGE, "cursor-pointer bg-zinc-100 px-2.5 py-1 text-zinc-700 hover:bg-zinc-200", FOCUS)}>
                New sale
              </button>
            </div>
            <ul className="divide-y divide-zinc-100">
              {recent.map((o) => (
                <OrderRow key={o.id} order={o} onOpen={() => setReceipt(o)} />
              ))}
            </ul>
          </section>
        </div>

        <TopSellers orders={orders} />
      </div>

      <ReceiptModal order={receipt} onClose={() => setReceipt(null)} />
    </div>
  );
}

function HourlyChart({ orders }: { orders: DemoOrder[] }) {
  const reduce = useReducedMotion();
  const [hover, setHover] = React.useState<number | null>(null);
  const buckets = Array.from({ length: HOURS }, (_, i) => {
    const hoursAgo = HOURS - 1 - i;
    const inHour = orders.filter((o) => Math.floor(o.minutesAgo / 60) === hoursAgo);
    return { hoursAgo, revenue: inHour.reduce((s, o) => s + orderTotal(o), 0), count: inHour.length };
  });
  const max = Math.max(1, ...buckets.map((b) => b.revenue));
  const summary = buckets.map((b) => `${hourLabel(b.hoursAgo)}: ${rs(b.revenue)}`).join(", ");

  return (
    <section className={cn(CARD, "p-4")} aria-labelledby="jerrys-hourly">
      <div className="flex items-baseline justify-between">
        <h2 id="jerrys-hourly" className="text-sm font-black text-zinc-900">
          Revenue by hour
        </h2>
        <span className="text-[11px] font-semibold text-zinc-500">Last {HOURS} hours</span>
      </div>
      <div role="img" aria-label={`Revenue by hour. ${summary}`} className="mt-4 flex h-40 items-end gap-1.5 sm:gap-2">
        {buckets.map((b, i) => {
          const now = b.hoursAgo === 0;
          return (
            <div
              key={b.hoursAgo}
              className="relative flex h-full flex-1 flex-col justify-end"
              onMouseEnter={() => setHover(i)}
              onMouseLeave={() => setHover(null)}
            >
              {hover === i && (
                <span className="absolute -top-1 left-1/2 z-10 -translate-x-1/2 -translate-y-full rounded-lg bg-zinc-900 px-2 py-1 text-[11px] font-bold whitespace-nowrap text-white">
                  {rs(b.revenue)} · {b.count} orders
                </span>
              )}
              <motion.span
                className={cn("block w-full rounded-t-lg", !now && (b.revenue ? "bg-zinc-800" : "bg-zinc-100"))}
                style={now ? { background: JERRYS_RED } : undefined}
                initial={false}
                animate={{ height: `${Math.max(3, (b.revenue / max) * 100)}%` }}
                transition={{ duration: reduce ? 0 : 0.5, ease: [0.22, 1, 0.36, 1] }}
              />
            </div>
          );
        })}
      </div>
      <div aria-hidden className="mt-2 flex gap-1.5 sm:gap-2">
        {buckets.map((b, i) => (
          <span key={b.hoursAgo} className={cn("flex-1 text-center text-[10px] font-semibold text-zinc-500", i % 2 === 1 && "max-sm:invisible")}>
            {hourLabel(b.hoursAgo)}
          </span>
        ))}
      </div>
    </section>
  );
}

function TopSellers({ orders }: { orders: DemoOrder[] }) {
  const sold = new Map<string, { qty: number; revenue: number }>();
  orders.forEach((o) =>
    o.lines.forEach((l) => {
      const prev = sold.get(l.itemId) ?? { qty: 0, revenue: 0 };
      sold.set(l.itemId, { qty: prev.qty + l.qty, revenue: prev.revenue + itemById(l.itemId).price * l.qty });
    }),
  );
  const rows = [...sold].sort((a, b) => b[1].qty - a[1].qty).slice(0, 8);
  const top = rows[0]?.[1].qty ?? 1;
  return (
    <section className={cn(CARD, "self-start p-4")} aria-labelledby="jerrys-top">
      <h2 id="jerrys-top" className="text-sm font-black text-zinc-900">
        Top sellers
      </h2>
      <ol className="mt-3 flex flex-col gap-3">
        {rows.map(([id, s], i) => {
          const item = itemById(id);
          return (
            <li key={id} className="flex items-center gap-3">
              <span className="w-4 text-xs font-black text-zinc-400 tabular-nums">{i + 1}</span>
              <ItemIcon item={item} className="size-10 rounded-xl" />
              <span className="min-w-0 flex-1">
                <span className="flex items-baseline justify-between gap-2">
                  <span className="truncate text-sm font-bold text-zinc-900">{item.name}</span>
                  <span className="text-sm font-black text-zinc-900 tabular-nums">{s.qty}</span>
                </span>
                <span className="mt-1 flex items-center gap-2">
                  <span className="h-1.5 flex-1 overflow-hidden rounded-full bg-zinc-100">
                    <span className="block h-full rounded-full bg-zinc-800" style={{ width: `${(s.qty / top) * 100}%` }} />
                  </span>
                  <span className="text-[11px] font-semibold text-zinc-500 tabular-nums">{rs(s.revenue)}</span>
                </span>
              </span>
            </li>
          );
        })}
      </ol>
    </section>
  );
}

function OrderRow({ order, onOpen }: { order: DemoOrder; onOpen: () => void }) {
  const { customer } = useStore();
  const who = customer(order.customerId);
  const fresh = order.minutesAgo === 0;
  return (
    <li>
      <button type="button" onClick={onOpen} className={cn("flex w-full cursor-pointer items-center gap-3 px-4 py-3 text-left transition-colors hover:bg-zinc-50", FOCUS, fresh && "bg-emerald-50/60")}>
        {who ? <Avatar name={who.name} /> : <WalkInMark className="size-8" />}
        <span className="min-w-0 flex-1">
          <span className="flex items-center gap-2">
            <span className="text-sm font-bold text-zinc-900 tabular-nums">{orderNumber(order.seq).slice(-3)}</span>
            <span className="truncate text-sm font-semibold text-zinc-700">{who?.name ?? jerrysDeck.copy.walkIn}</span>
            {fresh && <span className={cn(BADGE, "bg-emerald-600 text-white")}>New</span>}
            {order.source === "whatsapp" && (
              <span className={cn(BADGE, "bg-[#dcf8c6] text-emerald-800")}>
                <MessageCircle aria-hidden size={11} />
                WhatsApp
              </span>
            )}
          </span>
          <span className="block truncate text-xs text-zinc-500">{order.lines.map((l) => `${l.qty > 1 ? `${l.qty} × ` : ""}${lineName(l)}`).join(", ")}</span>
        </span>
        <span className="flex shrink-0 flex-col items-end gap-0.5">
          <span className="text-sm font-black text-zinc-900 tabular-nums">{rs(orderTotal(order))}</span>
          <span className="flex items-center gap-1.5">
            <span className={cn(BADGE, order.method === "cash" ? "bg-emerald-50 text-emerald-700" : "bg-violet-50 text-violet-700")}>{order.method === "cash" ? "Cash" : "QR"}</span>
            <span className="text-[11px] font-medium text-zinc-500">{clockAt(order.minutesAgo)}</span>
          </span>
        </span>
      </button>
    </li>
  );
}

/** A thermal slip, like the 80mm receipt the counter prints. */
function ReceiptModal({ order, onClose }: { order: DemoOrder | null; onClose: () => void }) {
  const { customer, askWalkthrough } = useStore();
  const who = customer(order?.customerId);
  return (
    <Modal open={!!order} onClose={onClose} title="Receipt" description={order ? orderNumber(order.seq) : undefined} size="sm">
      {order && (
        <>
          <div className="rounded-xl border border-dashed border-zinc-300 bg-zinc-50 px-4 py-4 font-mono text-[12px] leading-relaxed text-zinc-800">
            <p className="text-center text-sm font-bold">{jerrysDeck.storeName}</p>
            <p className="text-center text-zinc-500">{jerrysDeck.storeCity}</p>
            <p className="mt-2 text-center text-zinc-500">
              {orderNumber(order.seq)} · {clockAt(order.minutesAgo)}
            </p>
            <p className="text-center text-zinc-500">Customer: {who?.name ?? jerrysDeck.copy.walkIn}</p>
            <div className="my-2 border-t border-dashed border-zinc-300" />
            {order.lines.map((l, i) => (
              <div key={i} className="flex justify-between gap-3">
                <span className="min-w-0">
                  {l.qty} x {lineName(l)}
                </span>
                <span className="shrink-0 tabular-nums">{(itemById(l.itemId).price * l.qty).toLocaleString()}</span>
              </div>
            ))}
            <div className="my-2 border-t border-dashed border-zinc-300" />
            <div className="flex justify-between font-bold">
              <span>Total</span>
              <span className="tabular-nums">{rs(orderTotal(order))}</span>
            </div>
            <div className="flex justify-between text-zinc-500">
              <span>Paid by</span>
              <span>{order.method === "cash" ? "Cash" : "QR transfer"}</span>
            </div>
            <p className="mt-3 text-center text-zinc-500">Scan for your receipt online</p>
            <div aria-hidden className="mx-auto mt-2 grid size-16 grid-cols-6 gap-px">
              {Array.from({ length: 36 }, (_, i) => (
                <span key={i} className={(i * 7 + order.seq * 3) % 5 < 2 ? "bg-zinc-900" : "bg-transparent"} />
              ))}
            </div>
            <p className="mt-2 text-center text-zinc-500">Thank you, see you soon</p>
          </div>
          <div className="mt-4 grid grid-cols-2 gap-2">
            <button type="button" onClick={() => askWalkthrough("Refunds and exchanges")} className={BTN_SOFT}>
              <RotateCcw aria-hidden size={15} />
              Refund
            </button>
            <button type="button" onClick={() => askWalkthrough("Receipt printing")} className={BTN_DARK}>
              <Printer aria-hidden size={15} />
              Print
            </button>
          </div>
        </>
      )}
    </Modal>
  );
}
