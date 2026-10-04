"use client";

import * as React from "react";
import { motion, useReducedMotion } from "motion/react";
import { ArrowRight, Check, ChefHat, ClipboardList, Leaf, PackageCheck, Printer, Search, Send, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";
import { agoLabel, linesUsage, poNumber, qtyLabel, rs, stockLevel, useStore } from "./store";
import type { ScreenId } from "./app-frame";
import { BADGE, BTN_DARK, BTN_GO, BTN_SOFT, CARD, FOCUS, GRADIENTS, LEVEL_BADGE, ModuleHeader, pill } from "./ui";

/**
 * Ingredients and purchasing, after src/app/(pos)/app/ingredients,
 * stock-report and purchase-orders: live stock per ingredient against its
 * alert level, what today's orders used, and purchase orders from draft to
 * received. Stock here is the same stock the checkout's recipe trigger moves.
 */

type Filter = "all" | "low" | "out";

const PO_STATUS = {
  draft: { label: "Draft", className: "bg-amber-50 text-amber-700" },
  sent: { label: "Sent", className: "bg-sky-50 text-sky-700" },
  received: { label: "Received", className: "bg-emerald-50 text-emerald-700" },
} as const;

export function StockScreen({ onNavigate }: { onNavigate: (s: ScreenId) => void }) {
  const { ingredients, orders, vendor, createPurchaseOrder, askWalkthrough } = useStore();
  const reduce = useReducedMotion();
  const [filter, setFilter] = React.useState<Filter>("all");
  const [q, setQ] = React.useState("");
  const [selected, setSelected] = React.useState<string[]>([]);

  const used = React.useMemo(() => Object.fromEntries(linesUsage(orders.flatMap((o) => o.lines)).map((u) => [u.ingredientId, u.qty])), [orders]);

  // Flash a row when its stock moved since the last render (a sale on another slide).
  const prev = React.useRef<Record<string, number>>({});
  const [flash, setFlash] = React.useState<string[]>([]);
  React.useEffect(() => {
    const moved = ingredients.filter((i) => prev.current[i.id] !== undefined && prev.current[i.id] !== i.stock).map((i) => i.id);
    prev.current = Object.fromEntries(ingredients.map((i) => [i.id, i.stock]));
    if (!moved.length) return;
    setFlash(moved);
    const t = window.setTimeout(() => setFlash([]), 1400);
    return () => window.clearTimeout(t);
  }, [ingredients]);

  const lowIds = ingredients.filter((i) => stockLevel(i) !== "ok").map((i) => i.id);
  const rows = ingredients.filter((i) => (filter === "all" ? true : stockLevel(i) === filter || (filter === "low" && stockLevel(i) === "out")) && i.name.toLowerCase().includes(q.toLowerCase()));
  const toggle = (id: string) => setSelected((s) => (s.includes(id) ? s.filter((x) => x !== id) : [...s, id]));

  return (
    <div className="absolute inset-0 overflow-y-auto px-4 pb-24 sm:px-6">
      <ModuleHeader
        icon={Leaf}
        gradient={GRADIENTS.ingredients}
        title="Ingredients"
        subtitle={`${ingredients.length} ingredients · ${lowIds.length} at or below alert level`}
        action={
          <>
            <button type="button" onClick={() => askWalkthrough("Recipes")} className={cn(BTN_SOFT, "h-10 rounded-full")}>
              <ChefHat aria-hidden size={15} />
              Recipes
            </button>
            <button type="button" onClick={() => askWalkthrough("Stock snapshots")} className={cn(BTN_SOFT, "hidden h-10 rounded-full sm:inline-flex")}>
              Snapshots
            </button>
          </>
        }
      />

      <div className="mt-2 flex flex-wrap items-center gap-2">
        {(["all", "low", "out"] as Filter[]).map((f) => (
          <button key={f} type="button" onClick={() => setFilter(f)} aria-pressed={filter === f} className={pill(filter === f)}>
            {f === "all" ? "All" : f === "low" ? `Low (${lowIds.length})` : "Out"}
          </button>
        ))}
        <label className="relative ml-auto w-full sm:w-56">
          <Search aria-hidden size={15} className="absolute top-1/2 left-3 -translate-y-1/2 text-zinc-400" />
          <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search" aria-label="Search ingredients" className="h-10 w-full rounded-full border border-zinc-200 bg-zinc-50 pr-3 pl-9 text-sm font-medium focus:border-zinc-400 focus:bg-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-900/10" />
        </label>
      </div>

      <div className="mt-3 grid gap-3 xl:grid-cols-[1fr_22rem]">
        <section className={cn(CARD, "min-w-0 overflow-hidden")} aria-label="Ingredient stock">
          {/* Selection bar. */}
          <div className="flex flex-wrap items-center gap-2 border-b border-zinc-100 px-4 py-2.5">
            <span className="text-xs font-semibold text-zinc-500">{selected.length ? `${selected.length} selected` : "Select ingredients to reorder"}</span>
            <button type="button" disabled={!lowIds.length} onClick={() => setSelected(lowIds)} className={cn(pill(false), "h-8 px-3 text-xs")}>
              Select all low
            </button>
            <button
              type="button"
              disabled={!selected.length}
              onClick={() => {
                createPurchaseOrder(selected);
                setSelected([]);
              }}
              className={cn(BTN_DARK, "ml-auto h-9 rounded-full text-xs")}
            >
              <ClipboardList aria-hidden size={14} />
              Draft purchase order{selected.length ? ` (${selected.length})` : ""}
            </button>
          </div>

          <div className="hidden grid-cols-[1.75rem_1.4fr_1.6fr_6rem_6rem_5rem] gap-3 border-b border-zinc-100 px-4 py-2 text-[11px] font-semibold text-zinc-500 lg:grid">
            <span />
            <span>Ingredient</span>
            <span>Stock against alert level</span>
            <span className="text-right">In stock</span>
            <span className="text-right">Used today</span>
            <span className="text-right">Status</span>
          </div>
          <ul className="divide-y divide-zinc-100">
            {rows.map((ing) => {
              const level = stockLevel(ing);
              const pct = Math.max(0, Math.min(1, ing.stock / (ing.threshold * 3)));
              const on = selected.includes(ing.id);
              return (
                <li key={ing.id} className={cn("relative grid grid-cols-[1.75rem_1fr_auto] items-center gap-x-3 gap-y-1.5 px-4 py-3 transition-colors lg:grid-cols-[1.75rem_1.4fr_1.6fr_6rem_6rem_5rem]", on && "bg-zinc-50")}>
                  {flash.includes(ing.id) && (
                    <motion.span aria-hidden initial={{ opacity: reduce ? 0 : 0.7 }} animate={{ opacity: 0 }} transition={{ duration: 1.3 }} className="pointer-events-none absolute inset-0 bg-amber-100" />
                  )}
                  <button
                    type="button"
                    role="checkbox"
                    aria-checked={on}
                    aria-label={`Select ${ing.name}`}
                    onClick={() => toggle(ing.id)}
                    className={cn("relative flex size-5 cursor-pointer items-center justify-center rounded-md border-2 transition-colors", FOCUS, on ? "border-zinc-900 bg-zinc-900 text-white" : "border-zinc-300 bg-white hover:border-zinc-500")}
                  >
                    {on && <Check aria-hidden size={12} strokeWidth={3} />}
                  </button>
                  <span className="relative min-w-0">
                    <span className="block truncate text-sm font-bold text-zinc-900">{ing.name}</span>
                    <span className="block truncate text-[11px] text-zinc-500">
                      {vendor(ing.vendorId).name} · Rs {ing.cost}/{ing.unit === "slice" ? "slice" : ing.unit}
                    </span>
                  </span>
                  <span className="relative text-right lg:hidden">
                    <span className={cn("block text-sm font-black tabular-nums", level === "ok" ? "text-zinc-900" : level === "low" ? "text-amber-700" : "text-red-700")}>{qtyLabel(ing.stock, ing.unit)}</span>
                    <span className={cn(BADGE, LEVEL_BADGE[level].className)}>{LEVEL_BADGE[level].label}</span>
                  </span>
                  <span className="relative col-span-3 col-start-2 lg:col-span-1 lg:col-start-auto">
                    <span className="relative block h-2 overflow-hidden rounded-full bg-zinc-100">
                      <motion.span
                        className={cn("absolute inset-y-0 left-0 rounded-full", level === "ok" ? "bg-emerald-500" : level === "low" ? "bg-amber-500" : "bg-red-500")}
                        initial={false}
                        animate={{ width: `${pct * 100}%` }}
                        transition={{ duration: reduce ? 0 : 0.5, ease: [0.22, 1, 0.36, 1] }}
                      />
                      <span aria-hidden className="absolute inset-y-0 w-0.5 bg-zinc-500" style={{ left: "33.3%" }} />
                    </span>
                    <span className="mt-1 block text-[10px] font-medium text-zinc-500">Alert at {qtyLabel(ing.threshold, ing.unit)}</span>
                  </span>
                  <span className={cn("relative hidden text-right text-sm font-black tabular-nums lg:block", level === "ok" ? "text-zinc-900" : level === "low" ? "text-amber-700" : "text-red-700")}>{qtyLabel(ing.stock, ing.unit)}</span>
                  <span className="relative hidden text-right text-sm font-semibold text-zinc-600 tabular-nums lg:block">{used[ing.id] ? qtyLabel(used[ing.id]!, ing.unit) : "None"}</span>
                  <span className="relative hidden text-right lg:block">
                    <span className={cn(BADGE, LEVEL_BADGE[level].className)}>{LEVEL_BADGE[level].label}</span>
                  </span>
                </li>
              );
            })}
          </ul>
          {lowIds.length === 0 && (
            <div className="flex flex-wrap items-center gap-2 border-t border-zinc-100 px-4 py-3 text-sm text-zinc-600">
              Everything is above its alert level. Sell a few burgers on the checkout to pull stock down.
              <button type="button" onClick={() => onNavigate("checkout")} className={cn(BADGE, "cursor-pointer bg-zinc-900 px-2.5 py-1 text-white hover:bg-black", FOCUS)}>
                Go to checkout
                <ArrowRight aria-hidden size={11} />
              </button>
            </div>
          )}
        </section>

        <PurchaseOrders />
      </div>
    </div>
  );
}

function PurchaseOrders() {
  const { purchaseOrders, vendor, ingredient, sendPurchaseOrder, receivePurchaseOrder, askWalkthrough } = useStore();
  return (
    <section className="flex flex-col gap-2 self-start" aria-labelledby="jerrys-pos-heading">
      <div className="flex items-center justify-between px-1">
        <h2 id="jerrys-pos-heading" className="text-sm font-black text-zinc-900">
          Purchase orders
        </h2>
        <button type="button" aria-label="Print grocery list" onClick={() => askWalkthrough("Printing grocery lists")} className={cn("flex size-8 cursor-pointer items-center justify-center rounded-full text-zinc-500 hover:bg-zinc-100 hover:text-zinc-900", FOCUS)}>
          <Printer aria-hidden size={15} />
        </button>
      </div>
      {purchaseOrders.length === 0 && <p className="rounded-2xl bg-zinc-50 p-4 text-sm text-zinc-500">No purchase orders yet.</p>}
      {purchaseOrders.map((po) => {
        const v = vendor(po.vendorId);
        const cost = po.lines.reduce((s, l) => s + l.qty * ingredient(l.ingredientId).cost, 0);
        const status = PO_STATUS[po.status];
        return (
          <motion.article key={po.id} layout initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} className={cn(CARD, "p-4", po.status === "draft" && "border-amber-200")}>
            <div className="flex items-start gap-2">
              <div className="min-w-0 flex-1">
                <p className="flex items-center gap-2 text-sm font-black text-zinc-900">
                  {poNumber(po.seq)}
                  <span className={cn(BADGE, status.className)}>{status.label}</span>
                  {po.auto && (
                    <span className={cn(BADGE, "bg-red-50 text-red-700")}>
                      <Sparkles aria-hidden size={11} />
                      Auto
                    </span>
                  )}
                </p>
                <p className="mt-0.5 truncate text-xs text-zinc-500">
                  {v.name} · {v.phone}
                </p>
              </div>
              <span className="text-[11px] font-medium text-zinc-500">{agoLabel(po.minutesAgo)}</span>
            </div>
            <ul className="mt-3 flex flex-col gap-1 rounded-xl bg-zinc-50 px-3 py-2">
              {po.lines.map((l) => {
                const ing = ingredient(l.ingredientId);
                return (
                  <li key={l.ingredientId} className="flex justify-between gap-2 text-xs">
                    <span className="truncate font-semibold text-zinc-700">{ing.name}</span>
                    <span className="shrink-0 text-zinc-600 tabular-nums">
                      {qtyLabel(l.qty, ing.unit)} · {rs(l.qty * ing.cost)}
                    </span>
                  </li>
                );
              })}
            </ul>
            <div className="mt-3 flex items-center justify-between gap-2">
              <span className="text-sm font-black text-zinc-900 tabular-nums">{rs(cost)}</span>
              {po.status === "draft" && (
                <button type="button" onClick={() => sendPurchaseOrder(po.id)} className={cn(BTN_DARK, "h-9 rounded-full text-xs")}>
                  <Send aria-hidden size={13} />
                  Send to vendor
                </button>
              )}
              {po.status === "sent" && (
                <button type="button" onClick={() => receivePurchaseOrder(po.id)} className={cn(BTN_GO, "h-9 rounded-full text-xs")}>
                  <PackageCheck aria-hidden size={14} />
                  Mark received
                </button>
              )}
              {po.status === "received" && <span className="text-xs font-semibold text-emerald-700">In stock, logged as an expense</span>}
            </div>
          </motion.article>
        );
      })}
      <p className="px-1 text-[11px] leading-relaxed text-zinc-500">Quantities default to three times the alert level. Received orders add to stock and land in Expenses.</p>
    </section>
  );
}

