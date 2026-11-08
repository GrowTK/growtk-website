"use client";

import { AnimatePresence, motion } from "motion/react";
import { CheckCircle2, Package, RotateCcw, Search } from "lucide-react";
import { industryVisuals } from "@/content/industry-visuals";
import { cn } from "@/lib/utils";
import { EASE, TINT, VisualWindow, useScene } from "./shared";

const d = industryVisuals.ecommerce;

/** Order board: orders stream in, the order status counter climbs, and a return walks through a policy check to approval. */
export function EcommerceVisual({ className }: { className?: string }) {
  const { ref, step } = useScene(6, 1500);
  const rows = 4;
  const list = Array.from({ length: rows }, (_, i) => {
    const n = d.orders.length;
    const idx = (((step - i) % n) + n) % n;
    return { ...d.orders[idx]!, key: `${idx}-${Math.floor((step - i + n * 4) / n)}` };
  });
  const returnStage = step % 3; // 0 request, 1 rule check, 2 approved

  return (
    <VisualWindow sceneRef={ref} className={className} title={d.title} label={d.label}>
      <div className="flex items-end justify-between gap-3 rounded-xl bg-[#FCFCFA] px-4 py-3 ring-1 ring-black/[0.05]">
        <div className="min-w-0">
          <p className="flex items-center gap-1.5 text-[10.5px] font-semibold text-[#26262a]/55">
            <Search className="size-3.5 shrink-0" />
            <span className="truncate">{d.counterLabel}</span>
          </p>
          <AnimatePresence mode="popLayout" initial={false}>
            <motion.p
              key={step}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.35, ease: EASE }}
              className="mt-1 font-display text-2xl font-bold tabular-nums text-[#26262a]"
            >
              {(d.counterStart + step * 3).toLocaleString("en-US")}
            </motion.p>
          </AnimatePresence>
        </div>
        <div className="flex h-9 items-end gap-1">
          {[40, 65, 50, 80, 60, 95].map((h, i) => (
            <motion.span
              key={i}
              className={cn("w-2 rounded-t-sm", i === step % 6 ? "bg-[#26262a]" : "bg-[#FFDE59]")}
              animate={{ height: `${h}%` }}
              transition={{ duration: 0.4 }}
            />
          ))}
        </div>
      </div>

      <ul className="mt-3 space-y-1.5">
        <AnimatePresence initial={false} mode="popLayout">
          {list.map((o, i) => (
            <motion.li
              key={o.key}
              layout
              initial={{ opacity: 0, x: -14, backgroundColor: "rgba(255,222,89,0.35)" }}
              animate={{ opacity: 1, x: 0, backgroundColor: "rgba(255,255,255,0)" }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.45, ease: EASE }}
              className="flex items-center gap-2.5 rounded-xl border border-black/[0.06] px-3 py-2"
            >
              <span className={cn("grid size-7 shrink-0 place-items-center rounded-lg", i === 0 ? "bg-[#26262a] text-white" : "bg-[#26262a]/[0.06] text-[#26262a]")}>
                <Package className="size-3.5" />
              </span>
              <span className="min-w-0 flex-1">
                <span className="block text-[10.5px] tabular-nums text-[#26262a]/50">{o.id}</span>
                <span className="block truncate text-[12.5px] font-medium text-[#26262a]">{o.item}</span>
              </span>
              <span className={cn("shrink-0 rounded-full px-2.5 py-1 text-[10px] font-semibold text-[#26262a]", TINT[d.statusTone[o.status] ?? "neutral"])}>{o.status}</span>
            </motion.li>
          ))}
        </AnimatePresence>
      </ul>

      <div className="mt-3 rounded-xl border border-dashed border-black/15 p-3">
        <p className="flex items-center gap-2 text-[12px] font-semibold text-[#26262a]">
          <RotateCcw className="size-3.5 shrink-0" />
          <span className="truncate">{d.returnCard.title}</span>
        </p>
        <p className="mt-1 text-[11.5px] text-[#26262a]/60">{d.returnCard.reason}</p>
        <div className="mt-2.5 flex flex-wrap items-center gap-1.5">
          <motion.span
            animate={{ opacity: returnStage >= 1 ? 1 : 0.35 }}
            className="inline-flex items-center gap-1 rounded-full bg-[#A6D2FF]/60 px-2.5 py-1 text-[10px] font-semibold text-[#26262a]"
          >
            {d.returnCard.rule}
          </motion.span>
          <AnimatePresence>
            {returnStage >= 2 ? (
              <motion.span
                key="ok"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3, ease: EASE }}
                className="inline-flex items-center gap-1 rounded-full bg-[#9FE3B4]/80 px-2.5 py-1 text-[10px] font-semibold text-[#26262a]"
              >
                <CheckCircle2 className="size-3" /> {d.returnCard.result}
              </motion.span>
            ) : null}
          </AnimatePresence>
        </div>
      </div>
    </VisualWindow>
  );
}
