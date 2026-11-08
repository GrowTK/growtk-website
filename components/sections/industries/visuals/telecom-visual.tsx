"use client";

import { AnimatePresence, motion } from "motion/react";
import { ArrowRight, Check, Loader2, Radio, Wifi } from "lucide-react";
import { industryVisuals } from "@/content/industry-visuals";
import { cn } from "@/lib/utils";
import { Bubble, EASE, VisualWindow, useScene } from "./shared";

const d = industryVisuals.telecom;
const pop = { initial: { opacity: 0, y: 8 }, animate: { opacity: 1, y: 0 }, exit: { opacity: 0 }, transition: { duration: 0.4, ease: EASE } };

/** Subscriber view: an area outage banner, a plan upgrade, and an AI agent running line checks for "my internet is down". */
export function TelecomVisual({ className }: { className?: string }) {
  const { ref, step } = useScene(7, 1500);
  const planStage = Math.min(step, 2); // 0 current, 1 moving, 2 changed

  return (
    <VisualWindow sceneRef={ref} className={className} title={d.title} label={d.label}>
      <div className="flex items-center gap-3 rounded-xl bg-[#FFB3C7]/35 px-3.5 py-2.5">
        <span className="relative grid size-8 shrink-0 place-items-center rounded-full bg-white">
          <Radio className="size-4 text-[#26262a]" />
          <span className="absolute inset-0 rounded-full ring-2 ring-[#FFB3C7] motion-safe:animate-ping [animation-duration:2.4s]" />
        </span>
        <span className="min-w-0">
          <span className="block truncate text-[12.5px] font-semibold text-[#26262a]">{d.outage.title}</span>
          <span className="block text-[10.5px] text-[#26262a]/60">{d.outage.body}</span>
        </span>
      </div>

      <div className="mt-3 rounded-xl border border-black/[0.06] p-3.5">
        <div className="flex items-center justify-between gap-3">
          <span className="min-w-0">
            <span className="block truncate text-[12.5px] font-semibold text-[#26262a]">{d.account.name}</span>
            <span className="block text-[10.5px] text-[#26262a]/55">{d.account.line}</span>
          </span>
          <Wifi className="size-4 shrink-0 text-[#26262a]/50" />
        </div>
        <div className="mt-3 grid grid-cols-[1fr_auto_1fr] items-center gap-2">
          <Plan name={d.planFrom.name} price={d.planFrom.price} per={d.perMonth} active={planStage === 0} />
          <motion.span animate={{ x: planStage === 1 ? [0, 4, 0] : 0, opacity: planStage >= 1 ? 1 : 0.3 }} transition={{ duration: 0.6 }}>
            <ArrowRight className="size-4 text-[#26262a]" />
          </motion.span>
          <Plan name={d.planTo.name} price={d.planTo.price} per={d.perMonth} active={planStage >= 1} highlight />
        </div>
        <div className="mt-2.5 h-6">
          <AnimatePresence>
            {planStage === 2 ? (
              <motion.span key="done" {...pop} className="inline-flex items-center gap-1.5 rounded-full bg-[#9FE3B4]/70 px-2.5 py-1 text-[10.5px] font-semibold text-[#26262a]">
                <Check className="size-3.5" /> {d.planDone}
              </motion.span>
            ) : null}
          </AnimatePresence>
        </div>
      </div>

      <div className="mt-3 flex min-h-[11.5rem] flex-col justify-end gap-2">
        <AnimatePresence initial={false}>
          {step >= 3 ? (
            <motion.div key="c" layout {...pop}>
              <Bubble me>{d.customer}</Bubble>
            </motion.div>
          ) : null}
          {step >= 4 ? (
            <motion.ul key="checks" layout {...pop} className="max-w-[85%] space-y-1 rounded-2xl rounded-bl-md bg-[#26262a]/[0.05] px-3.5 py-2.5">
              {d.checks.map((c, i) => {
                const done = step >= 5 || (step === 4 && i === 0);
                const found = d.checkResults[i] === "Found";
                return (
                  <li key={c} className="flex items-center justify-between gap-3 text-[11.5px] text-[#26262a]">
                    <span>{c}</span>
                    {done ? (
                      <span className={cn("rounded-full px-2 py-0.5 text-[9.5px] font-semibold", found ? "bg-[#FFB3C7]/80" : "bg-[#9FE3B4]/80")}>{d.checkResults[i]}</span>
                    ) : (
                      <Loader2 className="size-3.5 text-[#26262a]/50 motion-safe:animate-spin" />
                    )}
                  </li>
                );
              })}
            </motion.ul>
          ) : null}
          {step >= 6 ? (
            <motion.div key="a" layout {...pop}>
              <Bubble>{d.answer}</Bubble>
            </motion.div>
          ) : null}
        </AnimatePresence>
      </div>
    </VisualWindow>
  );
}

function Plan({ name, price, per, active, highlight = false }: { name: string; price: string; per: string; active: boolean; highlight?: boolean }) {
  return (
    <motion.div
      animate={{
        backgroundColor: active ? (highlight ? "rgba(166,210,255,0.6)" : "rgba(38,38,42,0.06)") : "rgba(255,255,255,1)",
        opacity: active ? 1 : 0.55,
      }}
      transition={{ duration: 0.4 }}
      className="min-w-0 rounded-xl border border-black/[0.06] px-3 py-2"
    >
      <p className="truncate text-[11.5px] font-semibold text-[#26262a]">{name}</p>
      <p className="text-[13px] font-bold tabular-nums text-[#26262a]">
        {price}
        <span className="text-[10px] font-medium text-[#26262a]/50">{per}</span>
      </p>
    </motion.div>
  );
}
