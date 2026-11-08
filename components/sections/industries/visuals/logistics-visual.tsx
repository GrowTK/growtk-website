"use client";

import { AnimatePresence, motion } from "motion/react";
import { Camera, Check, MessageSquareText, Truck, X } from "lucide-react";
import { industryVisuals } from "@/content/industry-visuals";
import { cn } from "@/lib/utils";
import { EASE, VisualWindow, useScene } from "./shared";

const d = industryVisuals.logistics;
const pop = { initial: { opacity: 0, y: 8 }, animate: { opacity: 1, y: 0 }, exit: { opacity: 0 }, transition: { duration: 0.4, ease: EASE } };

/**
 * A driver's route: stops tick off down a timeline, one fails, and a reschedule
 * text goes out and gets answered on its own before the last stop lands.
 */
export function LogisticsVisual({ className }: { className?: string }) {
  const { ref, step } = useScene(7, 1500);
  // Which stop each step has reached, and its state.
  const reached = step <= 2 ? step : step < 6 ? 2 : 3;
  const state = (i: number) => (i > reached ? "todo" : i === d.failedIndex ? "failed" : "done");
  const progress = (reached / (d.stops.length - 1)) * 100;

  return (
    <VisualWindow sceneRef={ref} className={className} title={d.title} label={d.label} aside={<Truck className="size-3.5 text-[#26262a]/50" />}>
      <div className="grid gap-4 sm:grid-cols-[1fr_1fr]">
        <ol className="relative pl-1">
          <span className="absolute left-[15px] top-3 bottom-3 w-0.5 rounded-full bg-black/[0.07]" />
          <motion.span
            className="absolute left-[15px] top-3 w-0.5 rounded-full bg-[#26262a]"
            animate={{ height: `calc((100% - 1.5rem) * ${progress / 100})` }}
            transition={{ duration: 0.6, ease: EASE }}
          />
          {d.stops.map((s, i) => {
            const st = state(i);
            return (
              <li key={s.name} className="relative flex gap-3 pb-4 last:pb-0">
                <motion.span
                  animate={{
                    backgroundColor: st === "done" ? "#26262a" : st === "failed" ? "#FFB3C7" : "#ffffff",
                    scale: i === reached ? [1, 1.15, 1] : 1,
                  }}
                  transition={{ duration: 0.4 }}
                  className="relative z-10 grid size-[30px] shrink-0 place-items-center rounded-full border-2 border-white shadow-[0_0_0_1px_rgb(38_38_42/0.12)]"
                >
                  {st === "done" ? <Check className="size-3.5 text-white" /> : st === "failed" ? <X className="size-3.5 text-[#26262a]" /> : <span className="size-1.5 rounded-full bg-[#26262a]/30" />}
                </motion.span>
                <div className="min-w-0 pt-1">
                  <p className={cn("truncate text-[12.5px] font-semibold", st === "todo" ? "text-[#26262a]/45" : "text-[#26262a]")}>{s.name}</p>
                  <p className="text-[10.5px] tabular-nums text-[#26262a]/50">{s.time}</p>
                  <AnimatePresence initial={false}>
                    {st === "done" ? (
                      <motion.span key="pod" {...pop} className="mt-1 inline-flex items-center gap-1 rounded-full bg-[#9FE3B4]/70 px-2 py-0.5 text-[9.5px] font-semibold text-[#26262a]">
                        <Camera className="size-3" /> {d.pod}
                      </motion.span>
                    ) : st === "failed" ? (
                      <motion.span key="fail" {...pop} className="mt-1 inline-flex items-center gap-1 rounded-full bg-[#FFB3C7]/70 px-2 py-0.5 text-[9.5px] font-semibold text-[#26262a]">
                        {d.failed}
                      </motion.span>
                    ) : null}
                  </AnimatePresence>
                </div>
              </li>
            );
          })}
        </ol>

        <div className="flex min-h-[13rem] flex-col justify-end gap-2 rounded-xl bg-[#FCFCFA] p-3 ring-1 ring-black/[0.05]">
          <AnimatePresence initial={false}>
            {step >= 3 ? (
              <motion.div key="sms" layout {...pop}>
                <p className="mb-1.5 flex items-center gap-1.5 text-[10px] font-semibold text-[#26262a]/55">
                  <MessageSquareText className="size-3.5" /> {d.sms.from}
                </p>
                <div className="rounded-2xl rounded-bl-md bg-white px-3 py-2.5 text-[12px] leading-snug text-[#26262a] shadow-sm ring-1 ring-black/[0.05]">{d.sms.body}</div>
              </motion.div>
            ) : null}
            {step >= 4 ? (
              <motion.div key="reply" layout {...pop} className="ml-auto w-fit rounded-2xl rounded-br-md bg-[#26262a] px-3.5 py-2 text-[12px] font-semibold text-white">
                {d.sms.reply}
              </motion.div>
            ) : null}
            {step >= 5 ? (
              <motion.div key="ok" layout {...pop} className="inline-flex w-fit items-center gap-1.5 rounded-full bg-[#FFDE59]/80 px-3 py-1.5 text-[10.5px] font-semibold text-[#26262a]">
                <Check className="size-3.5" /> {d.sms.confirmed}
              </motion.div>
            ) : null}
          </AnimatePresence>
        </div>
      </div>
    </VisualWindow>
  );
}
