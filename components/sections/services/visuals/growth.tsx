"use client";

import { AnimatePresence, LayoutGroup, motion } from "motion/react";
import { Check, Globe, Megaphone, PhoneCall, Send, ShieldCheck, Sparkles, Timer, UserRound, FileInput } from "lucide-react";
import { serviceVisuals } from "@/content/service-visuals";
import { cn } from "@/lib/utils";
import { EASE, LiveDot, TONE, useLive, useTick, VisualWindow } from "./shared";

/* ------------------------------ Telemarketing ------------------------------- */

const WAVE = [0.4, 0.7, 0.5, 0.9, 0.6, 1, 0.55, 0.8, 0.45, 0.75, 0.5, 0.95, 0.6, 0.7, 0.4, 0.85, 0.5, 0.65, 0.9, 0.45, 0.7, 0.55, 0.8, 0.5];

export function TelemarketingCall({ className }: { className?: string }) {
  const d = serviceVisuals.telemarketing;
  const { ref, live, reduce } = useLive();
  const tick = useTick(live, 1400);
  const n = d.script.length;
  const step = reduce ? n - 1 : tick % (n + 1); // n = wrap up pause
  const ended = step >= n - 1;

  return (
    <VisualWindow
      innerRef={ref}
      title={d.title}
      label={d.label}
      className={className}
      right={
        <span className="inline-flex items-center gap-1.5 rounded-full bg-[#26262a] px-2 py-0.5 text-[10px] font-semibold text-white">
          <LiveDot className="size-1.5" /> {d.live}
        </span>
      }
    >
      <div className="flex h-14 items-center gap-[3px] rounded-xl bg-[#FCFCFA] px-3">
        <PhoneCall className="mr-2 size-4 shrink-0 text-[#26262a]" />
        {WAVE.map((h, i) => (
          <motion.span
            key={i}
            className="min-w-0 flex-1 rounded-full bg-[#26262a]"
            style={{ height: `${h * 70}%` }}
            animate={live ? { scaleY: [1, 0.35 + ((i * 7) % 5) * 0.12, 1] } : { scaleY: 1 }}
            transition={{ duration: 0.7 + (i % 4) * 0.12, repeat: live ? Infinity : 0, ease: "easeInOut" }}
          />
        ))}
      </div>
      <ol className="mt-3 space-y-1.5">
        {d.script.map((s, i) => {
          const done = i < step;
          const active = i === step;
          return (
            <li
              key={s}
              className={cn(
                "flex items-center gap-2.5 rounded-xl px-3 py-2 text-[12px] transition-colors duration-300",
                active ? "bg-[#FFDE59]/40 font-semibold text-[#26262a]" : done ? "text-[#26262a]/70" : "text-[#26262a]/35",
              )}
            >
              <span className={cn("grid size-5 shrink-0 place-items-center rounded-full text-[10px] font-bold tabular-nums", done ? "bg-[#26262a] text-white" : active ? "bg-white text-[#26262a]" : "bg-[#26262a]/[0.06]")}>
                {done ? <Check className="size-3" /> : i + 1}
              </span>
              <span className="min-w-0 truncate">{s}</span>
            </li>
          );
        })}
      </ol>
      <div className="mt-3 flex min-h-[1.75rem] flex-wrap items-center gap-1.5">
        <AnimatePresence>
          {step >= 3 ? (
            <motion.span
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3, ease: EASE }}
              className="inline-flex items-center gap-1 rounded-full bg-[#F2C4FF] px-2.5 py-1 text-[10px] font-semibold text-[#26262a]"
            >
              <ShieldCheck className="size-3" /> {d.objection}
            </motion.span>
          ) : null}
        </AnimatePresence>
        {d.outcomes.map((o, i) => (
          <span
            key={o}
            className={cn(
              "rounded-full border px-2.5 py-1 text-[10px] font-semibold transition-colors duration-300",
              ended && i === 1 ? "border-[#26262a] bg-[#26262a] text-white" : "border-black/10 text-[#26262a]/45",
            )}
          >
            {o}
          </span>
        ))}
      </div>
    </VisualWindow>
  );
}

/* ------------------------------ Sales pipeline ------------------------------ */

export function SalesKanban({ className }: { className?: string }) {
  const d = serviceVisuals["sales-support"];
  const { ref, live, reduce } = useLive();
  const tick = useTick(live, 1600);
  const C = d.columns.length;
  const stage = (i: number) => (reduce ? i % C : (Math.floor(tick / 1) + i * 3) % (C + 1)); // C = closed, off board
  const justBooked = d.deals.findIndex((_, i) => stage(i) === 2);

  return (
    <VisualWindow innerRef={ref} title={d.title} label={d.label} className={className}>
      <LayoutGroup>
        <div className="grid gap-1.5" style={{ gridTemplateColumns: `repeat(${C}, minmax(0, 1fr))` }}>
          {d.columns.map((c, ci) => {
            const count = d.deals.filter((_, i) => stage(i) === ci).length;
            return (
              <div key={c} className="min-w-0">
                <p className="flex items-center justify-between gap-1 px-1 text-[9px] font-semibold text-[#26262a]/60 sm:text-[10px]">
                  <span className="truncate">{c}</span>
                  <span className="tabular-nums">{count}</span>
                </p>
                <div className={cn("mt-1.5 min-h-[11rem] space-y-1.5 rounded-xl p-1", ci === 2 ? "bg-[#FFDE59]/20" : "bg-[#FCFCFA]")}>
                  {d.deals.map((deal, i) =>
                    stage(i) === ci ? (
                      <motion.div
                        key={deal.name}
                        layoutId={`deal-${deal.name}`}
                        transition={{ duration: 0.5, ease: EASE }}
                        className="relative rounded-lg border border-black/[0.06] bg-white p-2 shadow-sm"
                      >
                        <span className="block truncate text-[10px] font-semibold text-[#26262a]">{deal.name}</span>
                        <span className="mt-1 flex items-center justify-between gap-1">
                          <span className="text-[10px] font-bold tabular-nums text-[#26262a]">{deal.value}</span>
                          <span className={cn("size-4 shrink-0 rounded-full", [TONE.yellow, TONE.lilac, TONE.peach, TONE.sky][i % 4])} />
                        </span>
                      </motion.div>
                    ) : null,
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </LayoutGroup>
      <div className="mt-3 flex min-h-[2.25rem] items-center">
        <AnimatePresence mode="wait">
          {justBooked >= 0 ? (
            <motion.p
              key={`${justBooked}-${tick}`}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              transition={{ duration: 0.35, ease: EASE }}
              className="inline-flex items-center gap-1.5 rounded-full bg-[#26262a] px-3 py-1.5 text-[11px] font-semibold text-white"
            >
              <Sparkles className="size-3.5 text-[#FFDE59]" /> {d.note}: {d.deals[justBooked]!.name}
            </motion.p>
          ) : null}
        </AnimatePresence>
      </div>
    </VisualWindow>
  );
}

/* ------------------------------- Lead funnel -------------------------------- */

const SOURCE_ICON = [Globe, Megaphone, PhoneCall, FileInput];
const BAND = ["bg-[#FFDE59]", "bg-[#FFBA7B]", "bg-[#F2C4FF]"];

export function LeadFunnel({ className }: { className?: string }) {
  const d = serviceVisuals["lead-generation"];
  const { ref, live, reduce } = useLive();
  const tick = useTick(live, 800);
  const cycle = 6;
  const phase = reduce ? 4 : tick % cycle; // 0 source, 1 captured, 2 scored, 3 routed, 4..5 hold
  const src = Math.floor(tick / cycle) % d.sources.length;
  const seconds = [0, 1, 3, 4, 4, 4][phase] ?? 4;
  const score = 70 + ((src * 7) % 25);

  return (
    <VisualWindow
      innerRef={ref}
      title={d.title}
      label={d.label}
      className={className}
      right={
        <span className="inline-flex items-center gap-1 rounded-full bg-[#9FE3B4]/50 px-2 py-0.5 text-[10px] font-semibold tabular-nums text-[#26262a]">
          <Timer className="size-3" /> {d.timer} {seconds}
          {d.seconds}
        </span>
      }
    >
      <div className="grid grid-cols-4 gap-1.5">
        {d.sources.map((s, i) => {
          const Icon = SOURCE_ICON[i] ?? Globe;
          const on = i === src && phase === 0;
          return (
            <div
              key={s}
              className={cn(
                "flex min-w-0 flex-col items-center gap-1 rounded-xl border px-1 py-2 transition-colors duration-300",
                on ? "border-[#26262a] bg-[#FFDE59]/30" : i === src ? "border-[#26262a]/30" : "border-black/[0.06]",
              )}
            >
              <Icon className="size-4 text-[#26262a]" />
              <span className="w-full truncate text-center text-[10px] font-semibold text-[#26262a]">{s}</span>
            </div>
          );
        })}
      </div>
      <div className="relative mt-3 space-y-1.5">
        {d.stages.map((st, i) => {
          const reached = phase >= i + 1;
          return (
            <div key={st} className="flex justify-center">
              <div
                className={cn("relative flex h-9 items-center justify-between overflow-hidden rounded-lg px-3 transition-opacity duration-300", reached ? "opacity-100" : "opacity-45")}
                style={{ width: `${100 - i * 16}%` }}
              >
                <span className={cn("absolute inset-0", BAND[i])} />
                <span className="relative text-[11px] font-semibold text-[#26262a]">{st}</span>
                <AnimatePresence>
                  {reached ? (
                    <motion.span
                      key={`${st}-${Math.floor(tick / cycle)}`}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.35, ease: EASE }}
                      className="relative inline-flex items-center gap-1 rounded-full bg-white px-2 py-0.5 text-[10px] font-semibold tabular-nums text-[#26262a]"
                    >
                      {i === 1 ? `${d.score} ${score}` : <Check className="size-3" />}
                    </motion.span>
                  ) : null}
                </AnimatePresence>
              </div>
            </div>
          );
        })}
      </div>
      <div className={cn("mt-3 flex items-center gap-3 rounded-xl border p-2.5 transition-colors duration-300", phase >= 3 ? "border-[#26262a]" : "border-black/[0.06]")}>
        <span className="grid size-9 shrink-0 place-items-center rounded-full bg-[#26262a] text-white">
          <UserRound className="size-4" />
        </span>
        <div className="min-w-0 flex-1">
          <p className="text-[12px] font-semibold text-[#26262a]">{d.rep}</p>
          <p className="truncate text-[10px] text-[#26262a]/55">
            {d.lead}: {d.sources[src]}
          </p>
        </div>
        <AnimatePresence>
          {phase >= 3 ? (
            <motion.span
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3, ease: EASE }}
              className="grid size-7 place-items-center rounded-full bg-[#FFDE59] text-[#26262a]"
            >
              <Send className="size-3.5" />
            </motion.span>
          ) : null}
        </AnimatePresence>
      </div>
    </VisualWindow>
  );
}
