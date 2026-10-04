"use client";

import * as React from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { ArrowDown, MessageCircle, RotateCcw, ShoppingCart } from "lucide-react";
import { cn } from "@/lib/utils";
import { jerrysDeck, type DemoLine } from "@/content/jerrys";
import { itemById, lineUsage, qtyLabel } from "./store";
import { JERRYS_RED } from "./ui";

/**
 * Bespoke overview visual: one sale traced from the menu tile to the stock it
 * uses. Pick an item, sell one, and watch the recipe cascade through the deal's
 * components into ingredient counters, the way Jerry's Postgres trigger does
 * it. When an ingredient crosses its alert level, the owner's WhatsApp ping
 * pops. Local state only: the live slides have their own shared store.
 */

const START = Object.fromEntries(jerrysDeck.ingredients.map((i) => [i.id, i.stock]));

/** The line one tap sells: deals take their first option in each slot. */
function lineFor(itemId: string): DemoLine {
  const item = itemById(itemId);
  const picks = item.deal?.slots.flatMap((s) => Array.from({ length: s.quantity }, () => s.options[0]!));
  return { itemId, qty: 1, picks };
}

/** What a menu item "goes into": a deal's components and picks, or the item itself. */
function componentsOf(itemId: string): { id: string; name: string; qty: number }[] {
  const item = itemById(itemId);
  if (!item.deal) return [{ id: item.id, name: item.name, qty: 1 }];
  const line = lineFor(itemId);
  const counts = new Map<string, number>();
  item.deal.fixed.forEach((f) => counts.set(f.itemId, (counts.get(f.itemId) ?? 0) + f.qty));
  (line.picks ?? []).forEach((p) => counts.set(p, (counts.get(p) ?? 0) + 1));
  return [...counts].map(([id, qty]) => ({ id, name: itemById(id).name, qty }));
}

export function RecipeCascade() {
  const copy = jerrysDeck.overview.cascade;
  const reduce = useReducedMotion();
  const [selected, setSelected] = React.useState(copy.items[0]!);
  const [stock, setStock] = React.useState<Record<string, number>>(START);
  const [pulse, setPulse] = React.useState(0);
  const [alert, setAlert] = React.useState<string | null>(null);
  const alertTimer = React.useRef<number | undefined>(undefined);
  React.useEffect(() => () => window.clearTimeout(alertTimer.current), []);

  const usage = lineUsage(lineFor(selected));
  const components = componentsOf(selected);

  const sell = () => {
    // Work out crossings from current state, outside the updater, so React's
    // double-invoked updaters in development can't report one twice.
    const next = { ...stock };
    const crossed: string[] = [];
    usage.forEach(({ ingredientId, qty }) => {
      const ing = jerrysDeck.ingredients.find((i) => i.id === ingredientId)!;
      const before = stock[ingredientId]!;
      next[ingredientId] = before - qty;
      if (before > ing.threshold && before - qty <= ing.threshold) crossed.push(ing.name);
    });
    setStock(next);
    setPulse((p) => p + 1);
    if (!crossed.length) return;
    setAlert(crossed.join(", "));
    window.clearTimeout(alertTimer.current);
    alertTimer.current = window.setTimeout(() => setAlert(null), 3200);
  };

  return (
    <div role="group" aria-label={copy.label} className="relative flex w-full max-w-[460px] flex-col items-stretch gap-1.5">
      {/* 1. Menu item picker. */}
      <div className="rounded-3xl bg-white p-2.5 shadow-[0_18px_40px_rgba(0,0,0,.18)]">
        <p className="px-1 text-[11px] font-semibold text-zinc-500">{copy.itemsLabel}</p>
        <div className="mt-2 grid grid-cols-3 gap-2">
          {copy.items.map((id) => {
            const item = itemById(id);
            const on = id === selected;
            return (
              <button
                key={id}
                type="button"
                onClick={() => setSelected(id)}
                aria-pressed={on}
                className={cn(
                  "group flex cursor-pointer flex-col items-center gap-1 rounded-2xl p-1.5 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-900/40",
                  on ? "bg-zinc-900 text-white" : "bg-zinc-50 text-zinc-800 hover:bg-zinc-100",
                )}
              >
                <span className="relative size-10 overflow-hidden rounded-xl" style={{ background: item.tileBg ?? "#f4f4f5" }}>
                  {item.image ? (
                    // eslint-disable-next-line @next/next/no-img-element -- small menu thumbnails, kept out of next/image's per-page budget
                    <img src={item.image} alt="" className="absolute inset-0 size-full object-cover" />
                  ) : (
                    <span className="absolute inset-0 flex items-center justify-center text-sm font-black" style={{ color: item.labelColor }}>
                      {item.label}
                    </span>
                  )}
                </span>
                <span className="w-full truncate text-center text-[11.5px] leading-tight font-bold">{item.name}</span>
                <span className={cn("text-[11px] font-semibold tabular-nums", on ? "text-white/80" : "text-zinc-500")}>Rs {item.price.toLocaleString()}</span>
              </button>
            );
          })}
        </div>
        <button
          type="button"
          onClick={sell}
          className="mt-2.5 flex h-10 w-full cursor-pointer items-center justify-center gap-2 rounded-xl text-sm font-black text-white transition hover:brightness-110 active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-900/40 focus-visible:ring-offset-2"
          style={{ background: JERRYS_RED }}
        >
          <ShoppingCart aria-hidden className="size-4" />
          {copy.sell}
        </button>
      </div>

      <FlowArrow pulse={pulse} reduce={!!reduce} />

      {/* 2. What it goes into. */}
      <div className="rounded-3xl bg-white p-2.5 shadow-[0_18px_40px_rgba(0,0,0,.18)]">
        <p className="px-1 text-[11px] font-semibold text-zinc-500">{copy.componentsLabel}</p>
        <ul className="mt-2 flex flex-wrap gap-1.5">
          {components.map((c) => (
            <li key={c.id} className="rounded-full bg-zinc-100 px-2.5 py-1 text-[12px] font-bold text-zinc-800">
              {c.qty > 1 ? `${c.qty} × ` : ""}
              {c.name}
            </li>
          ))}
        </ul>
      </div>

      <FlowArrow pulse={pulse} reduce={!!reduce} />

      {/* 3. Ingredient counters. */}
      <div className="rounded-3xl bg-white p-2.5 shadow-[0_18px_40px_rgba(0,0,0,.18)]">
        <div className="flex items-center justify-between px-1">
          <p className="text-[11px] font-semibold text-zinc-500">{copy.stockLabel}</p>
          <button
            type="button"
            onClick={() => {
              setStock(START);
              setAlert(null);
            }}
            className="flex cursor-pointer items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-semibold text-zinc-500 transition-colors hover:bg-zinc-100 hover:text-zinc-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-900/30"
          >
            <RotateCcw aria-hidden className="size-3" />
            {copy.reset}
          </button>
        </div>
        <ul className="mt-1 grid gap-x-4 sm:grid-cols-2">
          {usage.map(({ ingredientId, qty }) => {
            const ing = jerrysDeck.ingredients.find((i) => i.id === ingredientId)!;
            const left = stock[ingredientId]!;
            const low = left <= ing.threshold;
            const pct = Math.max(0, Math.min(1, left / (ing.threshold * 3)));
            return (
              <li key={ingredientId} className="grid grid-cols-[1fr_auto] items-center gap-x-2 gap-y-1 rounded-xl px-1 py-1">
                <span className="truncate text-[12px] font-bold text-zinc-800">{ing.name}</span>
                <span className="relative flex items-center gap-2 text-right">
                  <AnimatePresence>
                    <motion.span
                      key={`${ingredientId}-${pulse}`}
                      initial={{ opacity: pulse ? 1 : 0, y: 0 }}
                      animate={{ opacity: 0, y: reduce ? 0 : -14 }}
                      transition={{ duration: 0.9, ease: "easeOut" }}
                      className="pointer-events-none absolute -top-1 right-0 text-[11px] font-black"
                      style={{ color: JERRYS_RED }}
                      aria-hidden
                    >
                      {pulse ? `-${qty}` : ""}
                    </motion.span>
                  </AnimatePresence>
                  <span className={cn("text-[12px] font-black tabular-nums", low ? "text-red-700" : "text-zinc-900")}>{qtyLabel(left, ing.unit)}</span>
                </span>
                <span className="relative col-span-2 h-1.5 overflow-hidden rounded-full bg-zinc-100">
                  <motion.span
                    className={cn("absolute inset-y-0 left-0 rounded-full", low ? "bg-red-500" : "bg-emerald-500")}
                    animate={{ width: `${pct * 100}%` }}
                    transition={{ duration: reduce ? 0 : 0.4, ease: [0.22, 1, 0.36, 1] }}
                  />
                  {/* Alert level tick. */}
                  <span aria-hidden className="absolute inset-y-0 w-0.5 bg-zinc-400" style={{ left: "33.3%" }} />
                </span>
              </li>
            );
          })}
        </ul>
      </div>

      {/* The owner's ping, when a counter crosses its alert level. */}
      <div aria-live="polite" className="pointer-events-none absolute inset-x-0 -bottom-3 flex translate-y-full justify-center">
        <AnimatePresence>
          {alert && (
            <motion.div
              initial={{ opacity: 0, y: reduce ? 0 : 10, scale: reduce ? 1 : 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: reduce ? 0 : 6 }}
              transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
              className="flex max-w-full items-center gap-2.5 rounded-2xl bg-[#dcf8c6] py-2 pr-4 pl-2.5 text-zinc-900 shadow-[0_12px_30px_rgba(0,0,0,.2)]"
            >
              <span className="flex size-7 shrink-0 items-center justify-center rounded-full bg-[#25d366] text-white">
                <MessageCircle aria-hidden className="size-4" />
              </span>
              <span className="min-w-0">
                <span className="block text-[12.5px] leading-tight font-bold">{copy.alert}</span>
                <span className="block truncate text-[12px] text-zinc-700">{alert}</span>
              </span>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

function FlowArrow({ pulse, reduce }: { pulse: number; reduce: boolean }) {
  return (
    <div aria-hidden className="flex justify-center">
      <motion.span
        key={pulse}
        initial={{ y: pulse && !reduce ? -6 : 0, opacity: pulse ? 0.4 : 1 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.35, ease: "easeOut" }}
        className="flex size-6 items-center justify-center rounded-full bg-white/20 text-white"
      >
        <ArrowDown className="size-4" />
      </motion.span>
    </div>
  );
}
