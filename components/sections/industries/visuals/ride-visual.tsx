"use client";

import { AnimatePresence, motion } from "motion/react";
import { Car, Clock, MapPin, Shield } from "lucide-react";
import { industryVisuals } from "@/content/industry-visuals";
import { cn } from "@/lib/utils";
import { Bubble, EASE, VisualWindow, useScene } from "./shared";

const d = industryVisuals["ride-hailing"];
const pop = { initial: { opacity: 0, y: 10 }, animate: { opacity: 1, y: 0 }, exit: { opacity: 0 }, transition: { duration: 0.4, ease: EASE } };

// Route through the stylized street grid, as points the car visits in order.
const ROUTE: [number, number][] = [
  [30, 170],
  [30, 110],
  [130, 110],
  [130, 50],
  [250, 50],
  [250, 90],
];
const routePath = ROUTE.map(([x, y], i) => `${i ? "L" : "M"}${x} ${y}`).join(" ");

/** Live trip: a car moving along a drawn route, a ticking ETA, a rider chat and the safety button. */
export function RideVisual({ className }: { className?: string }) {
  const { ref, step, live } = useScene(5, 1700);
  const safety = step >= 4;

  return (
    <VisualWindow sceneRef={ref} className={className} title={d.title} label={d.label}>
      <div className="relative h-44 overflow-hidden rounded-xl bg-[#FCFCFA] ring-1 ring-black/[0.05] sm:h-48">
        <svg viewBox="0 0 280 200" preserveAspectRatio="xMidYMid slice" className="absolute inset-0 size-full">
          <rect x="150" y="70" width="80" height="70" rx="10" fill="#9FE3B4" opacity="0.45" />
          <rect x="-10" y="-10" width="110" height="80" rx="14" fill="#A6D2FF" opacity="0.4" />
          <rect x="50" y="130" width="60" height="50" rx="8" fill="#FFDE59" opacity="0.25" />
          <g stroke="#ffffff" strokeWidth="12" strokeLinecap="round" fill="none">
            <path d="M30 0 V200 M130 0 V200 M250 0 V200 M0 50 H280 M0 110 H280 M0 170 H280" />
          </g>
          <g stroke="rgb(38 38 42 / 0.08)" strokeWidth="1" fill="none">
            <path d="M30 0 V200 M130 0 V200 M250 0 V200 M0 50 H280 M0 110 H280 M0 170 H280" />
          </g>
          <path d={routePath} stroke="#26262a" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" fill="none" strokeDasharray="1 7" />
          <circle cx={ROUTE[ROUTE.length - 1]![0]} cy={ROUTE[ROUTE.length - 1]![1]} r="7" fill="#FFBA7B" stroke="#fff" strokeWidth="3" />
          <motion.g
            initial={false}
            animate={
              live
                ? { x: ROUTE.map((p) => p[0]), y: ROUTE.map((p) => p[1]) }
                : { x: ROUTE[2]![0], y: ROUTE[2]![1] }
            }
            transition={live ? { duration: 8, ease: "linear", repeat: Infinity, repeatDelay: 0.6 } : { duration: 0 }}
          >
            <circle r="11" fill="#26262a" opacity="0.12" />
            <circle r="7" fill="#26262a" stroke="#fff" strokeWidth="2.5" />
          </motion.g>
        </svg>
        <div className="absolute left-3 top-3 inline-flex items-center gap-1.5 rounded-full bg-white px-3 py-1.5 text-[11px] font-semibold text-[#26262a] shadow-sm">
          <Clock className="size-3.5" />
          {d.eta}
          <AnimatePresence mode="wait" initial={false}>
            <motion.span key={step} initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -4 }} transition={{ duration: 0.25 }} className="tabular-nums">
              {d.etaValues[Math.min(step, d.etaValues.length - 1)]}
            </motion.span>
          </AnimatePresence>
        </div>
        <span className="absolute right-3 top-3 grid size-8 place-items-center rounded-full bg-white shadow-sm">
          <MapPin className="size-4 text-[#26262a]" />
        </span>
      </div>

      <div className="relative -mt-6 mx-2 rounded-2xl border border-black/[0.06] bg-white p-3.5 shadow-[0_16px_40px_-20px_rgb(38_38_42/0.4)]">
        <div className="flex min-h-[9.5rem] flex-col justify-end gap-2">
          <AnimatePresence initial={false}>
            {step >= 1 ? (
              <motion.div key="r" layout {...pop}>
                <Bubble me>{d.rider}</Bubble>
              </motion.div>
            ) : null}
            {step >= 2 ? (
              <motion.div key="a" layout {...pop}>
                <Bubble>{d.agent}</Bubble>
              </motion.div>
            ) : null}
            {step >= 3 ? (
              <motion.div key="o" layout {...pop} className="flex flex-wrap gap-2">
                {d.options.map((o, i) => (
                  <span key={o} className={cn("rounded-full px-3 py-1.5 text-[11px] font-semibold", i === 0 ? "bg-[#FFDE59]/80 text-[#26262a]" : "border border-black/10 text-[#26262a]")}>
                    {o}
                  </span>
                ))}
              </motion.div>
            ) : null}
          </AnimatePresence>
        </div>
        <div className="mt-3 flex items-center justify-between gap-3 border-t border-black/[0.06] pt-3">
          <span className="inline-flex min-w-0 items-center gap-1.5 text-[11px] font-medium text-[#26262a]/60">
            <Car className="size-3.5 shrink-0" />
            <span className="truncate">{safety ? d.safetyOn : " "}</span>
          </span>
          <motion.span
            animate={{ backgroundColor: safety ? "#26262a" : "rgba(255,179,199,0.55)", color: safety ? "#ffffff" : "#26262a" }}
            transition={{ duration: 0.3 }}
            className="relative inline-flex shrink-0 items-center gap-1.5 rounded-full px-3 py-1.5 text-[11px] font-semibold"
          >
            {safety ? <span className="absolute inset-0 rounded-full ring-2 ring-[#FFB3C7] motion-safe:animate-ping" /> : null}
            <Shield className="size-3.5" />
            {d.safety}
          </motion.span>
        </div>
      </div>
    </VisualWindow>
  );
}
