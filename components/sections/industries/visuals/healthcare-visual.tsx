"use client";

import { AnimatePresence, motion } from "motion/react";
import { BellRing, CalendarCheck, Lock, UserRound } from "lucide-react";
import { industryVisuals } from "@/content/industry-visuals";
import { cn } from "@/lib/utils";
import { Bubble, EASE, VisualWindow, useScene } from "./shared";

const d = industryVisuals.healthcare;
const pop = { initial: { opacity: 0, y: 8 }, animate: { opacity: 1, y: 0 }, exit: { opacity: 0 }, transition: { duration: 0.4, ease: EASE } };

/** Patient booking: a message, a week of slots scanned for openings, one booked, a reminder queued and a clinical question handed to the front desk. */
export function HealthcareVisual({ className }: { className?: string }) {
  const { ref, step } = useScene(5, 1600);
  const isTaken = (day: number, slot: number) => d.taken.some(([a, b]) => a === day && b === slot);
  const isBooked = (day: number, slot: number) => step >= 2 && d.booked[0] === day && d.booked[1] === slot;

  return (
    <VisualWindow
      sceneRef={ref}
      className={className}
      title={d.title}
      label={d.label}
      aside={
        <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-[#26262a]/50">
          <Lock className="size-3" /> {d.privacy}
        </span>
      }
    >
      <div className="flex items-end gap-2">
        <span className="grid size-7 shrink-0 place-items-center rounded-full bg-[#A6D2FF]/60">
          <UserRound className="size-3.5 text-[#26262a]" />
        </span>
        <Bubble className="max-w-[80%]">{d.patient}</Bubble>
      </div>

      <div className="mt-4 rounded-xl border border-black/[0.06] p-3">
        <div className="grid grid-cols-5 gap-1.5">
          {d.days.map((day, di) => (
            <div key={day} className="min-w-0">
              <p className="pb-1.5 text-center text-[10px] font-semibold text-[#26262a]/55">{day}</p>
              <div className="space-y-1.5">
                {d.slots.map((slot, si) => {
                  const taken = isTaken(di, si);
                  const booked = isBooked(di, si);
                  const open = !taken && !booked;
                  return (
                    <motion.div
                      key={slot}
                      animate={{
                        backgroundColor: booked ? "#26262a" : taken ? "rgba(38,38,42,0.05)" : step === 1 ? "rgba(166,210,255,0.55)" : "rgba(166,210,255,0.25)",
                        scale: booked && step === 2 ? [1, 1.08, 1] : 1,
                      }}
                      transition={{ duration: 0.4, delay: step === 1 && open ? (di * 4 + si) * 0.02 : 0 }}
                      className={cn(
                        "truncate rounded-md py-1.5 text-center text-[9.5px] font-semibold tabular-nums",
                        booked ? "text-white" : taken ? "text-[#26262a]/30 line-through" : "text-[#26262a]",
                      )}
                    >
                      {slot}
                    </motion.div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-3 flex min-h-[5.75rem] flex-col gap-1.5">
        <AnimatePresence initial={false}>
          {step >= 2 ? (
            <motion.span key="b" layout {...pop} className="inline-flex w-fit items-center gap-1.5 rounded-full bg-[#26262a] px-3 py-1.5 text-[11px] font-semibold text-white">
              <CalendarCheck className="size-3.5 text-[#9FE3B4]" /> {d.bookedLabel}
            </motion.span>
          ) : null}
          {step >= 3 ? (
            <motion.span key="r" layout {...pop} className="inline-flex w-fit items-center gap-1.5 rounded-full bg-[#FFDE59]/70 px-3 py-1.5 text-[11px] font-semibold text-[#26262a]">
              <BellRing className="size-3.5" /> {d.reminder}
            </motion.span>
          ) : null}
          {step >= 4 ? (
            <motion.span key="h" layout {...pop} className="inline-flex w-fit items-center gap-1.5 rounded-full border border-black/10 bg-white px-3 py-1.5 text-[11px] font-semibold text-[#26262a]">
              <UserRound className="size-3.5" /> {d.handoff}
            </motion.span>
          ) : null}
        </AnimatePresence>
      </div>
    </VisualWindow>
  );
}
