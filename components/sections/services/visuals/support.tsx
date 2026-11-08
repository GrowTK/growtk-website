"use client";

import { AnimatePresence, motion } from "motion/react";
import { AlertTriangle, Bot, Check, Mail, MessageCircle, MessageSquare, Package, Phone, RotateCcw, Sparkles, Star, Truck } from "lucide-react";
import { serviceVisuals } from "@/content/service-visuals";
import { cn } from "@/lib/utils";
import { EASE, LiveDot, TONE, useLive, useTick, VisualWindow } from "./shared";

/* ------------------------------ E-commerce chat ----------------------------- */

export function EcommerceChat({ className }: { className?: string }) {
  const d = serviceVisuals["ecommerce-customer-support"];
  const { ref, live, reduce } = useLive();
  const tick = useTick(live, 1100);
  const cycle = 10;
  const stage = reduce ? 8 : tick % cycle; // 0 question, 1 typing, 2 reply, 3..6 steps, 7..9 hold
  const stepsDone = Math.max(0, Math.min(d.steps.length, stage - 2));

  return (
    <div ref={ref} className={cn("relative w-full", className)}>
      <span className="sr-only">{d.label}</span>
      <div aria-hidden className="mx-auto w-full max-w-[19rem] rounded-[2.4rem] bg-[#26262a] p-2.5 shadow-[0_30px_80px_-30px_rgb(38_38_42/0.5)]">
        <div className="overflow-hidden rounded-[1.9rem] bg-[#FCFCFA]">
          <div className="relative flex items-center gap-2.5 bg-white px-4 pb-3 pt-6">
            <span className="absolute left-1/2 top-2 h-1.5 w-14 -translate-x-1/2 rounded-full bg-[#26262a]/15" />
            <span className="grid size-8 place-items-center rounded-full bg-[#FFDE59] text-[#26262a]">
              <Bot className="size-4" />
            </span>
            <div>
              <p className="text-[12px] font-semibold text-[#26262a]">{d.store}</p>
              <p className="flex items-center gap-1.5 text-[10px] text-[#26262a]/55">
                <LiveDot className="size-1.5" /> {d.online}
              </p>
            </div>
          </div>
          <div className="flex min-h-[21rem] flex-col gap-2 px-3 py-3">
            <motion.div
              key={`q-${Math.floor(tick / cycle)}`}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35, ease: EASE }}
              className="ml-auto max-w-[80%] rounded-2xl rounded-br-sm bg-[#26262a] px-3 py-2 text-[12px] text-white"
            >
              {d.question}
            </motion.div>
            {stage === 1 ? (
              <div className="flex w-14 items-center justify-center gap-1 rounded-2xl rounded-bl-sm bg-white px-3 py-2.5 shadow-sm">
                {[0, 1, 2].map((i) => (
                  <motion.span
                    key={i}
                    className="size-1.5 rounded-full bg-[#26262a]/40"
                    animate={{ y: [0, -3, 0] }}
                    transition={{ duration: 0.6, repeat: Infinity, delay: i * 0.12 }}
                  />
                ))}
              </div>
            ) : null}
            <AnimatePresence>
              {stage >= 2 ? (
                <motion.div
                  key={`r-${Math.floor(tick / cycle)}`}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.35, ease: EASE }}
                  className="max-w-[92%] space-y-2"
                >
                  <p className="w-fit rounded-2xl rounded-bl-sm bg-white px-3 py-2 text-[12px] text-[#26262a] shadow-sm">{d.reply}</p>
                  <div className="rounded-2xl bg-white p-3 shadow-sm">
                    <div className="flex items-center justify-between">
                      <span className="flex items-center gap-1.5 text-[11px] font-semibold text-[#26262a]">
                        <Package className="size-3.5" /> {d.order}
                      </span>
                      <Truck className="size-3.5 text-[#26262a]/50" />
                    </div>
                    <ol className="mt-3 space-y-2">
                      {d.steps.map((s, i) => {
                        const on = i < stepsDone;
                        const current = i === stepsDone - 1;
                        return (
                          <li key={s} className="flex items-center gap-2.5">
                            <span
                              className={cn(
                                "grid size-4 shrink-0 place-items-center rounded-full transition-colors duration-300",
                                on ? "bg-[#26262a] text-white" : "bg-[#26262a]/[0.08]",
                                current && "ring-4 ring-[#FFDE59]/60",
                              )}
                            >
                              {on ? <Check className="size-2.5" /> : null}
                            </span>
                            <span className={cn("text-[11px] transition-colors duration-300", on ? "font-semibold text-[#26262a]" : "text-[#26262a]/45")}>{s}</span>
                          </li>
                        );
                      })}
                    </ol>
                    <p className="mt-3 rounded-lg bg-[#9FE3B4]/35 px-2.5 py-1.5 text-[10px] font-semibold text-[#26262a]">{d.eta}</p>
                    <div className="mt-2 grid grid-cols-2 gap-1.5">
                      <span className="rounded-lg bg-[#26262a] py-1.5 text-center text-[10px] font-semibold text-white">{d.trackLabel}</span>
                      <span
                        className={cn(
                          "flex items-center justify-center gap-1 rounded-lg border py-1.5 text-[10px] font-semibold text-[#26262a] transition-colors duration-300",
                          stage >= 7 ? "border-[#26262a] bg-[#FFDE59]/40" : "border-black/10",
                        )}
                      >
                        <RotateCcw className="size-3" /> {d.returnLabel}
                      </span>
                    </div>
                  </div>
                </motion.div>
              ) : null}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ------------------------------- Unified inbox ------------------------------ */

const INBOX_ICON = { chat: MessageCircle, email: Mail, phone: Phone, social: MessageSquare } as const;

export function UnifiedInbox({ className }: { className?: string }) {
  const d = serviceVisuals["customer-support"];
  const { ref, live, reduce } = useLive();
  const tick = useTick(live, 1400);
  const cycle = 6;
  const stage = reduce ? 4 : tick % cycle; // 0 msg, 1 suggest, 2 sent, 3..5 rating
  const stars = stage >= 3 ? 5 : 0;

  return (
    <VisualWindow innerRef={ref} title={d.title} label={d.label} className={className} bodyClassName="p-0 sm:p-0">
      <div className="grid grid-cols-[4.25rem_1fr] sm:grid-cols-[6.5rem_1fr]">
        <ul className="space-y-1 border-r border-black/[0.06] bg-[#FCFCFA] p-2">
          {d.channels.map((c, i) => {
            const Icon = INBOX_ICON[c.key as keyof typeof INBOX_ICON] ?? MessageCircle;
            const on = i === 0;
            return (
              <li key={c.key} className={cn("flex items-center gap-1.5 rounded-lg px-2 py-2", on ? "bg-white shadow-sm" : "")}>
                <Icon className="size-3.5 shrink-0 text-[#26262a]" />
                <span className="hidden truncate text-[11px] font-medium text-[#26262a] sm:block">{c.name}</span>
                <span className={cn("ml-auto rounded-full px-1.5 text-[9px] font-bold tabular-nums text-[#26262a]", on ? TONE.yellow : TONE.soft)}>{c.count}</span>
              </li>
            );
          })}
        </ul>
        <div className="flex min-h-[18rem] flex-col p-3 sm:p-4">
          <div className="flex items-center gap-2">
            <span className="grid size-7 place-items-center rounded-full bg-[#F2C4FF] text-[10px] font-bold text-[#26262a]">SW</span>
            <span className="text-[12px] font-semibold text-[#26262a]">{d.customer}</span>
          </div>
          <p className="mt-3 w-fit max-w-[90%] rounded-2xl rounded-bl-sm bg-[#26262a]/[0.06] px-3 py-2 text-[12px] text-[#26262a]">{d.message}</p>
          <AnimatePresence mode="wait">
            {stage === 1 ? (
              <motion.div
                key="suggest"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6, scale: 0.98 }}
                transition={{ duration: 0.35, ease: EASE }}
                className="mt-auto rounded-xl border border-dashed border-[#26262a]/30 bg-[#FFDE59]/15 p-3"
              >
                <p className="flex items-center gap-1 text-[10px] font-semibold text-[#26262a]/70">
                  <Sparkles className="size-3" /> {d.suggestLabel}
                </p>
                <p className="mt-1 text-[12px] leading-snug text-[#26262a]">{d.suggestion}</p>
              </motion.div>
            ) : null}
            {stage >= 2 ? (
              <motion.div
                key="sent"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.35, ease: EASE }}
                className="ml-auto mt-2 max-w-[90%]"
              >
                <p className="rounded-2xl rounded-br-sm bg-[#26262a] px-3 py-2 text-[12px] leading-snug text-white">{d.suggestion}</p>
                <p className="mt-1 text-right text-[10px] text-[#26262a]/50">{d.sent}</p>
              </motion.div>
            ) : null}
          </AnimatePresence>
          <div className={cn("mt-auto flex items-center gap-2 pt-3 transition-opacity duration-300", stage >= 3 ? "opacity-100" : "opacity-0")}>
            <span className="text-[10px] font-semibold text-[#26262a]/60">{d.ratingLabel}</span>
            <span className="flex gap-0.5">
              {Array.from({ length: 5 }, (_, i) => (
                <motion.span key={i} animate={{ scale: i < stars ? [0.6, 1.15, 1] : 1 }} transition={{ duration: 0.35, delay: i * 0.07 }}>
                  <Star className={cn("size-3.5", i < stars ? "fill-[#FFDE59] text-[#E8C53A]" : "text-[#26262a]/20")} />
                </motion.span>
              ))}
            </span>
          </div>
        </div>
      </div>
    </VisualWindow>
  );
}

/* ------------------------------ Journey map --------------------------------- */

export function JourneyMap({ className }: { className?: string }) {
  const d = serviceVisuals["customer-experience-management"];
  const { ref, live, reduce, shown } = useLive();
  const tick = useTick(live, 3000);
  const fixed = reduce ? true : tick % 2 === 1;
  const values = fixed ? d.after : d.before;
  const n = d.stages.length;
  const x = (i: number) => 8 + (i * 84) / (n - 1);
  const y = (v: number) => 92 - v * 0.8;
  const path = values.map((v, i) => `${i === 0 ? "M" : "L"}${x(i)} ${y(v)}`).join(" ");
  const fi = 2;

  return (
    <VisualWindow innerRef={ref} title={d.title} label={d.label} className={className}>
      <div className="flex items-center justify-between">
        <p className="text-[11px] font-semibold text-[#26262a]/60">{d.sentimentLabel}</p>
        <AnimatePresence mode="wait">
          <motion.span
            key={String(fixed)}
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.3 }}
            className={cn("inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[10px] font-semibold text-[#26262a]", fixed ? TONE.mint : TONE.peach)}
          >
            {fixed ? <Check className="size-3" /> : <AlertTriangle className="size-3" />}
            {fixed ? d.fixed : d.friction}
          </motion.span>
        </AnimatePresence>
      </div>
      <div className="relative mt-3 h-44">
        <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="absolute inset-0 size-full overflow-visible">
          {[20, 45, 70].map((g) => (
            <line key={g} x1="0" x2="100" y1={g} y2={g} stroke="rgb(38 38 42 / 0.07)" vectorEffect="non-scaling-stroke" />
          ))}
          <motion.path
            d={path}
            fill="none"
            stroke="#26262a"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            vectorEffect="non-scaling-stroke"
            initial={{ pathLength: 0 }}
            animate={{ d: path, pathLength: shown ? 1 : 0 }}
            transition={{ duration: 0.7, ease: EASE }}
          />
        </svg>
        {values.map((v, i) => (
          <motion.span
            key={i}
            className={cn(
              "absolute size-3 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-white shadow",
              i === fi ? (fixed ? "bg-[#5CC985]" : "bg-[#FFBA7B]") : "bg-[#26262a]",
            )}
            animate={{ left: `${x(i)}%`, top: `${y(v)}%`, scale: i === fi && !fixed ? [1, 1.3, 1] : 1 }}
            transition={{ duration: 0.7, ease: EASE, scale: { duration: 1, repeat: !fixed && live ? Infinity : 0 } }}
          />
        ))}
      </div>
      <div className="mt-2 grid" style={{ gridTemplateColumns: `repeat(${n}, minmax(0, 1fr))` }}>
        {d.stages.map((s, i) => (
          <div key={s} className="text-center">
            <span className={cn("mx-auto block h-1 w-[85%] rounded-full", ["bg-[#FFDE59]", "bg-[#FFBA7B]", "bg-[#F2C4FF]", "bg-[#A6D2FF]", "bg-[#9FE3B4]"][i % 5])} />
            <span className="mt-1.5 block truncate text-[10px] font-semibold text-[#26262a]">{s}</span>
          </div>
        ))}
      </div>
    </VisualWindow>
  );
}
