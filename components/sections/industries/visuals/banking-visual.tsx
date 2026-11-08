"use client";

import { AnimatePresence, motion } from "motion/react";
import { CreditCard, FileText, Lock, ShieldAlert, ShieldCheck } from "lucide-react";
import { industryVisuals } from "@/content/industry-visuals";
import { Bubble, EASE, Typing, VisualWindow, useScene } from "./shared";

const d = industryVisuals["banking-fintech"];
const pop = { initial: { opacity: 0, y: 10 }, animate: { opacity: 1, y: 0 }, exit: { opacity: 0 }, transition: { duration: 0.4, ease: EASE } };

/** Secure chat: identity check with masked fields, the charge, a dispute ticket and a fraud team escalation. */
export function BankingVisual({ className }: { className?: string }) {
  const { ref, step } = useScene(7, 1500);

  return (
    <VisualWindow
      sceneRef={ref}
      className={className}
      title={d.title}
      label={d.label}
      aside={<Lock className="size-3.5 text-[#26262a]/50" />}
    >
      <div className="flex h-[23rem] flex-col justify-end gap-2.5 overflow-hidden">
        <AnimatePresence initial={false}>
          <motion.div key="c" layout {...pop}>
            <Bubble me>{d.customer}</Bubble>
          </motion.div>
          {step === 1 ? (
            <motion.div key="t" layout {...pop}>
              <Typing />
            </motion.div>
          ) : null}
          {step >= 2 ? (
            <motion.div key="ask" layout {...pop} className="space-y-2">
              <Bubble>{d.verifyAsk}</Bubble>
              <div className="grid max-w-[85%] grid-cols-2 gap-2">
                {d.verifyFields.map((f) => (
                  <div key={f.label} className="rounded-xl border border-black/[0.07] bg-[#FCFCFA] px-3 py-2">
                    <p className="text-[10px] font-semibold text-[#26262a]/50">{f.label}</p>
                    <p className="mt-0.5 text-[12px] font-semibold tabular-nums tracking-wider text-[#26262a]">{f.value}</p>
                  </div>
                ))}
              </div>
            </motion.div>
          ) : null}
          {step >= 3 ? (
            <motion.div key="v" layout {...pop}>
              <span className="inline-flex items-center gap-1.5 rounded-full bg-[#9FE3B4]/70 px-3 py-1 text-[11px] font-semibold text-[#26262a]">
                <ShieldCheck className="size-3.5" /> {d.verified}
              </span>
            </motion.div>
          ) : null}
          {step >= 4 ? (
            <motion.div key="txn" layout {...pop} className="flex max-w-[85%] items-center gap-3 rounded-xl border border-black/[0.07] px-3 py-2.5">
              <span className="grid size-8 shrink-0 place-items-center rounded-lg bg-[#A6D2FF]/60">
                <CreditCard className="size-4 text-[#26262a]" />
              </span>
              <span className="min-w-0 flex-1">
                <span className="block truncate text-[12.5px] font-semibold text-[#26262a]">{d.txn.merchant}</span>
                <span className="block text-[10.5px] text-[#26262a]/55">{d.txn.date}</span>
              </span>
              <span className="text-[13px] font-bold tabular-nums text-[#26262a]">{d.txn.amount}</span>
            </motion.div>
          ) : null}
          {step >= 5 ? (
            <motion.div key="tk" layout {...pop} className="flex max-w-[85%] items-center gap-2 rounded-xl bg-[#FFDE59]/40 px-3 py-2">
              <FileText className="size-4 shrink-0 text-[#26262a]" />
              <span className="text-[12px] font-semibold text-[#26262a]">{d.ticket.label}</span>
              <span className="ml-auto text-[11px] tabular-nums text-[#26262a]/60">{d.ticket.id}</span>
            </motion.div>
          ) : null}
          {step >= 6 ? (
            <motion.div key="fl" layout {...pop} className="flex max-w-[85%] items-center gap-2 rounded-xl bg-[#26262a] px-3 py-2 text-white">
              <ShieldAlert className="size-4 shrink-0 text-[#FFB3C7]" />
              <span className="text-[11.5px] font-semibold">{d.flag}</span>
            </motion.div>
          ) : null}
        </AnimatePresence>
      </div>
    </VisualWindow>
  );
}
