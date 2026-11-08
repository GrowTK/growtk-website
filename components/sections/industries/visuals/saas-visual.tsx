"use client";

import { AnimatePresence, motion } from "motion/react";
import { AlertTriangle, BookOpen, Check, Send, TrendingUp } from "lucide-react";
import { industryVisuals } from "@/content/industry-visuals";
import { cn } from "@/lib/utils";
import { Bubble, EASE, VisualWindow, useScene } from "./shared";

const d = industryVisuals.saas;
const pop = { initial: { opacity: 0, y: 8 }, animate: { opacity: 1, y: 0 }, exit: { opacity: 0 }, transition: { duration: 0.4, ease: EASE } };
const C = 2 * Math.PI * 22;

/** Customer success: onboarding ticks off, a how-to answered from the docs, and a health score that dips, gets flagged and recovers after outreach. */
export function SaasVisual({ className }: { className?: string }) {
  const { ref, step } = useScene(6, 1600);
  const doneCount = [1, 2, 2, 3, 4, 4][step]!;
  const hIndex = Math.min(step, d.healthValues.length - 1);
  const health = d.healthValues[hIndex]!;
  const pts = d.healthValues.map((v, i) => (i <= hIndex ? v : health));
  const W = 120;
  const H = 36;
  const toXY = (v: number, i: number) => `${(i / (d.healthValues.length - 1)) * W},${H - ((v - 30) / 60) * H}`;
  const flag = step === 2 ? "risk" : step === 3 ? "outreach" : step >= 4 ? "recovered" : null;

  return (
    <VisualWindow sceneRef={ref} className={className} title={d.title} label={d.label}>
      <div className="grid gap-3 sm:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)]">
        <div className="rounded-xl border border-black/[0.06] p-3.5">
          <div className="flex items-center gap-3">
            <div className="relative size-14 shrink-0">
              <svg viewBox="0 0 56 56" className="size-full -rotate-90">
                <circle cx="28" cy="28" r="22" fill="none" stroke="rgb(38 38 42 / 0.08)" strokeWidth="6" />
                <motion.circle
                  cx="28"
                  cy="28"
                  r="22"
                  fill="none"
                  stroke="#D6EE72"
                  strokeWidth="6"
                  strokeLinecap="round"
                  strokeDasharray={C}
                  animate={{ strokeDashoffset: C * (1 - doneCount / d.steps.length) }}
                  transition={{ duration: 0.6, ease: EASE }}
                />
              </svg>
              <span className="absolute inset-0 grid place-items-center text-[12px] font-bold tabular-nums text-[#26262a]">
                {doneCount}/{d.steps.length}
              </span>
            </div>
            <p className="text-[12.5px] font-semibold text-[#26262a]">{d.onboarding}</p>
          </div>
          <ul className="mt-3 space-y-1.5">
            {d.steps.map((s, i) => {
              const done = i < doneCount;
              return (
                <li key={s} className="flex items-center gap-2 text-[12px]">
                  <motion.span
                    animate={{ backgroundColor: done ? "#26262a" : "rgba(38,38,42,0.06)" }}
                    transition={{ duration: 0.3 }}
                    className="grid size-4 shrink-0 place-items-center rounded-full"
                  >
                    {done ? <Check className="size-2.5 text-white" /> : null}
                  </motion.span>
                  <span className={cn("truncate", done ? "text-[#26262a]/45 line-through" : "text-[#26262a]")}>{s}</span>
                </li>
              );
            })}
          </ul>
        </div>

        <div className="flex min-h-[10.5rem] flex-col justify-end gap-2 rounded-xl bg-[#FCFCFA] p-3 ring-1 ring-black/[0.05]">
          <AnimatePresence initial={false}>
            {step >= 1 ? (
              <motion.div key="q" layout {...pop}>
                <Bubble me>{d.question}</Bubble>
              </motion.div>
            ) : null}
            {step >= 2 ? (
              <motion.div key="a" layout {...pop} className="space-y-1">
                <Bubble className="bg-white shadow-sm ring-1 ring-black/[0.05]">{d.answer}</Bubble>
                <p className="flex items-center gap-1 pl-1 text-[10px] font-medium text-[#26262a]/55">
                  <BookOpen className="size-3" /> {d.source}
                </p>
              </motion.div>
            ) : null}
          </AnimatePresence>
        </div>
      </div>

      <div className="mt-3 flex items-center gap-3 rounded-xl border border-black/[0.06] px-3.5 py-3">
        <div className="shrink-0">
          <p className="text-[10px] font-semibold text-[#26262a]/55">{d.health}</p>
          <AnimatePresence mode="popLayout" initial={false}>
            <motion.p
              key={health}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.3 }}
              className={cn("font-display text-xl font-bold tabular-nums", health < 55 ? "text-[#c2410c]" : "text-[#26262a]")}
            >
              {health}
            </motion.p>
          </AnimatePresence>
        </div>
        <svg viewBox={`-4 -4 ${W + 8} ${H + 8}`} className="h-10 min-w-0 flex-1" preserveAspectRatio="none">
          <motion.polyline
            fill="none"
            stroke="#26262a"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            vectorEffect="non-scaling-stroke"
            animate={{ points: pts.map(toXY).join(" ") }}
            transition={{ duration: 0.4 }}
          />
        </svg>
        <div className="shrink-0 text-right">
          <AnimatePresence mode="wait" initial={false}>
            {flag ? (
              <motion.span
                key={flag}
                initial={{ opacity: 0, scale: 0.92 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3, ease: EASE }}
                className={cn(
                  "inline-flex items-center gap-1 whitespace-nowrap rounded-full px-2.5 py-1 text-[10px] font-semibold",
                  flag === "risk" ? "bg-[#FFB3C7]/80 text-[#26262a]" : flag === "outreach" ? "bg-[#26262a] text-white" : "bg-[#9FE3B4]/80 text-[#26262a]",
                )}
              >
                {flag === "risk" ? <AlertTriangle className="size-3" /> : flag === "outreach" ? <Send className="size-3" /> : <TrendingUp className="size-3" />}
                {flag === "risk" ? d.risk : flag === "outreach" ? d.outreach : d.recovered}
              </motion.span>
            ) : null}
          </AnimatePresence>
        </div>
      </div>
    </VisualWindow>
  );
}
