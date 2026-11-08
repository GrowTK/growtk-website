"use client";

import { AnimatePresence, LayoutGroup, motion } from "motion/react";
import { ArrowRight, Bot, Check, Clock, FileText, Loader2, UserRound, Wrench, Zap } from "lucide-react";
import { serviceVisuals } from "@/content/service-visuals";
import { cn } from "@/lib/utils";
import { EASE, TONE, useLive, useTick, VisualWindow } from "./shared";

/* ---------------------------- Workforce coverage ---------------------------- */

/** Sample demand 0..1 per day and hour slot: midday and evening peaks, softer weekends. */
function demand(day: number, hour: number) {
  const shape = [0.3, 0.55, 0.95, 0.7, 0.6, 0.9, 0.65, 0.35][hour] ?? 0.4;
  const weekday = day < 5 ? 1 : 0.7;
  const wobble = ((day * 7 + hour * 3) % 5) * 0.03;
  return Math.min(1, shape * weekday + wobble);
}

export function CoverageHeatmap({ className }: { className?: string }) {
  const d = serviceVisuals["workforce-management"];
  const { ref, live, reduce, shown } = useLive();
  const tick = useTick(live, 450);
  const H = d.hours.length;
  const sweep = reduce ? H : tick % (H + 4); // columns of hours covered so far
  const forecast = d.hours.map((_, h) => d.days.reduce((s, _d, day) => s + demand(day, h), 0) / d.days.length);
  const pts = forecast.map((v, h) => `${(h / (H - 1)) * 100},${100 - v * 85}`).join(" ");

  return (
    <VisualWindow innerRef={ref} title={d.title} label={d.label} className={className}>
      <div className="grid grid-cols-[2rem_1fr] gap-2">
        <span className="pt-1 text-[9px] font-semibold text-[#26262a]/50">{d.forecast}</span>
        <div className="relative h-10">
          <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="absolute inset-0 size-full overflow-visible">
            <motion.polyline
              points={pts}
              fill="none"
              stroke="#26262a"
              strokeWidth="2"
              strokeDasharray="4 3"
              vectorEffect="non-scaling-stroke"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: shown ? 1 : 0 }}
              transition={{ duration: 1, ease: EASE }}
            />
          </svg>
        </div>
      </div>
      <div className="mt-2 space-y-1">
        {d.days.map((day, di) => (
          <div key={day} className="grid grid-cols-[2rem_1fr] items-center gap-2">
            <span className="text-[10px] font-semibold text-[#26262a]/60">{day}</span>
            <div className="grid gap-1" style={{ gridTemplateColumns: `repeat(${H}, minmax(0, 1fr))` }}>
              {d.hours.map((_, hi) => {
                const v = demand(di, hi);
                const peak = v > 0.72;
                const covered = peak && hi < sweep;
                return (
                  <span key={hi} className="relative h-4 overflow-hidden rounded-[5px] sm:h-5" style={{ backgroundColor: `rgb(255 186 123 / ${0.15 + v * 0.75})` }}>
                    <motion.span
                      className="absolute inset-0 rounded-[5px] bg-[#FFDE59]"
                      initial={false}
                      animate={{ scaleY: covered ? 1 : 0, opacity: covered ? 1 : 0 }}
                      transition={{ duration: 0.35, ease: EASE }}
                      style={{ originY: 1 }}
                    />
                    {covered ? <Bot className="absolute left-1/2 top-1/2 size-2.5 -translate-x-1/2 -translate-y-1/2 text-[#26262a]" /> : null}
                  </span>
                );
              })}
            </div>
          </div>
        ))}
        <div className="grid grid-cols-[2rem_1fr] gap-2 pt-1">
          <span />
          <div className="grid" style={{ gridTemplateColumns: `repeat(${H}, minmax(0, 1fr))` }}>
            {d.hours.map((h) => (
              <span key={h} className="text-center text-[9px] tabular-nums text-[#26262a]/50">
                {h}
              </span>
            ))}
          </div>
        </div>
      </div>
      <div className="mt-3 flex flex-wrap gap-3 text-[10px] font-medium text-[#26262a]/70">
        <span className="flex items-center gap-1.5">
          <span className="size-2.5 rounded-sm bg-[#FFBA7B]" /> {d.legendDemand}
        </span>
        <span className="flex items-center gap-1.5">
          <span className="size-2.5 rounded-sm bg-[#FFDE59]" /> {d.legendAi}
        </span>
      </div>
    </VisualWindow>
  );
}

/* ------------------------------ Ticket triage ------------------------------- */

const TIER_TONE = [TONE.mint, TONE.lilac, TONE.peach];
const TIER_ICON = [Bot, UserRound, Wrench];

export function TicketTriage({ className }: { className?: string }) {
  const d = serviceVisuals["technical-support"];
  const { ref, live, reduce } = useLive();
  const tick = useTick(live, 1500);
  const idx = Math.floor(tick / 2) % d.tickets.length;
  const routed = reduce || tick % 2 === 1;
  const t = d.tickets[idx]!;
  // Last ticket that landed in each tier, so lanes are never empty.
  const lastIn = (tier: number) => {
    for (let k = 0; k < d.tickets.length; k++) {
      const j = (idx - k + d.tickets.length * 2) % d.tickets.length;
      if (d.tickets[j]!.tier === tier && (k > 0 || routed)) return d.tickets[j]!;
    }
    return null;
  };

  return (
    <VisualWindow innerRef={ref} title={d.title} label={d.label} className={className}>
      <LayoutGroup>
        <div className="relative min-h-[3.25rem]">
          <AnimatePresence mode="popLayout">
            {!routed ? (
              <motion.div
                key={`in-${tick}`}
                layoutId={`ticket-${tick - (tick % 2)}`}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.4, ease: EASE }}
                className="flex items-center gap-2.5 rounded-xl border border-[#26262a] bg-white px-3 py-2.5 shadow-sm"
              >
                <FileText className="size-4 shrink-0 text-[#26262a]" />
                <span className="min-w-0 flex-1 truncate text-[12px] font-semibold text-[#26262a]">{t.subject}</span>
                <span className="inline-flex shrink-0 items-center gap-1 rounded-full bg-[#FFDE59] px-2 py-0.5 text-[10px] font-semibold text-[#26262a]">
                  <Loader2 className="size-3 motion-safe:animate-spin" /> {d.classifying}
                </span>
              </motion.div>
            ) : (
              <motion.p key="wait" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex h-[3.25rem] items-center justify-center rounded-xl border border-dashed border-black/10 text-[11px] text-[#26262a]/45">
                {d.incoming}
              </motion.p>
            )}
          </AnimatePresence>
        </div>
        <div className="my-2 flex justify-center">
          <ArrowRight className="size-4 rotate-90 text-[#26262a]/30" />
        </div>
        <ul className="space-y-2">
          {d.tiers.map((tier, i) => {
            const Icon = TIER_ICON[i] ?? Bot;
            const item = lastIn(tier.n);
            const active = routed && t.tier === tier.n;
            return (
              <li key={tier.n} className={cn("rounded-xl border p-2.5 transition-colors duration-300", active ? "border-[#26262a] bg-[#FCFCFA]" : "border-black/[0.06]")}>
                <div className="flex items-center gap-2.5">
                  <span className={cn("grid size-7 shrink-0 place-items-center rounded-lg text-[#26262a]", TIER_TONE[i])}>
                    <Icon className="size-3.5" />
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="text-[12px] font-semibold text-[#26262a]">{tier.name}</p>
                    <p className="truncate text-[10px] text-[#26262a]/55">{tier.desc}</p>
                  </div>
                </div>
                <AnimatePresence mode="popLayout" initial={false}>
                  {item ? (
                    <motion.div
                      key={item.subject + (active ? tick : "")}
                      layoutId={active ? `ticket-${tick - 1}` : undefined}
                      initial={{ opacity: 0, y: -6 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.45, ease: EASE }}
                      className="mt-2 flex items-center gap-2 rounded-lg bg-white px-2.5 py-1.5 shadow-[0_4px_14px_-8px_rgb(38_38_42/0.4)]"
                    >
                      <span className="min-w-0 flex-1 truncate text-[11px] text-[#26262a]">{item.subject}</span>
                      {active ? (
                        <span className="inline-flex shrink-0 items-center gap-1 text-[10px] font-semibold text-[#26262a]">
                          <Check className="size-3" /> {d.routed}
                        </span>
                      ) : null}
                    </motion.div>
                  ) : null}
                </AnimatePresence>
              </li>
            );
          })}
        </ul>
      </LayoutGroup>
    </VisualWindow>
  );
}

/* --------------------------- Process before / after -------------------------- */

export function ProcessRedesign({ className }: { className?: string }) {
  const d = serviceVisuals["business-process-reengineering"];
  const { ref, live, reduce } = useLive();
  const tick = useTick(live, 3200);
  const after = reduce ? true : tick % 2 === 1;
  const steps = after ? d.after : d.before;

  return (
    <VisualWindow
      innerRef={ref}
      title={d.title}
      label={d.label}
      className={className}
      right={
        <span className="flex rounded-full bg-[#26262a]/[0.06] p-0.5 text-[10px] font-semibold">
          {[d.beforeLabel, d.afterLabel].map((l, i) => (
            <span key={l} className={cn("rounded-full px-2.5 py-0.5 transition-colors duration-300", (i === 1) === after ? "bg-[#26262a] text-white" : "text-[#26262a]/60")}>
              {l}
            </span>
          ))}
        </span>
      }
    >
      <div className="min-h-[15.5rem]">
        <AnimatePresence mode="wait">
          <motion.ol
            key={String(after)}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, scale: 0.97 }}
            transition={{ duration: 0.3 }}
            className={cn("grid gap-2", after ? "grid-cols-1" : "grid-cols-2")}
          >
            {steps.map((s, i) => (
              <motion.li
                key={s.name}
                initial={{ opacity: 0, y: 8, rotate: after ? 0 : i % 2 ? 1.2 : -1.2 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: i * 0.06, ease: EASE }}
                className={cn(
                  "flex items-center gap-2.5 rounded-xl border px-3",
                  after ? "border-[#26262a] bg-gradient-to-r from-[#FFDE59]/35 to-white py-3.5" : "border-dashed border-black/15 py-2",
                  !after && i === steps.length - 1 && steps.length % 2 === 1 && "col-span-2",
                )}
              >
                <span className={cn("grid size-6 shrink-0 place-items-center rounded-full text-[10px] font-bold tabular-nums", after ? "bg-[#26262a] text-white" : "bg-[#26262a]/[0.07] text-[#26262a]")}>
                  {after ? <Zap className="size-3" /> : i + 1}
                </span>
                <span className={cn("min-w-0 flex-1 truncate text-[#26262a]", after ? "text-[13px] font-semibold" : "text-[11px]")}>{s.name}</span>
                <span className={cn("shrink-0 rounded-full px-2 py-0.5 text-[10px] font-semibold tabular-nums text-[#26262a]", after ? TONE.mint : TONE.peach)}>{s.time}</span>
              </motion.li>
            ))}
          </motion.ol>
        </AnimatePresence>
      </div>
      <div className="mt-3 flex items-center justify-between rounded-xl bg-[#FCFCFA] px-3.5 py-2.5">
        <span className="flex items-center gap-1.5 text-[11px] font-medium text-[#26262a]/60">
          <Clock className="size-3.5" /> {after ? d.automated : d.manual}
        </span>
        <span className="text-[12px] font-bold text-[#26262a]">{after ? d.totalAfter : d.totalBefore}</span>
      </div>
    </VisualWindow>
  );
}

/* ----------------------------- Document pipeline ---------------------------- */

export function DocumentPipeline({ className }: { className?: string }) {
  const d = serviceVisuals["back-office-support"];
  const { ref, live, reduce } = useLive();
  const tick = useTick(live, 1400);
  const C = d.columns.length;
  const col = (i: number) => (reduce ? Math.min(i, C - 1) : (tick + i * 2) % (C + 1)); // C means off board
  const reading = d.docs.find((_, i) => col(i) === 0) ?? d.docs[0]!;
  const fieldsShown = reduce ? reading.fields.length : (tick % 2) + 2;

  return (
    <VisualWindow innerRef={ref} title={d.title} label={d.label} className={className}>
      <LayoutGroup>
        <div className="grid gap-1.5" style={{ gridTemplateColumns: `repeat(${C}, minmax(0, 1fr))` }}>
          {d.columns.map((c, ci) => (
            <div key={c} className="min-w-0">
              <p className={cn("truncate rounded-md px-1.5 py-1 text-center text-[9px] font-semibold text-[#26262a] sm:text-[10px]", [TONE.yellow, TONE.lilac, TONE.sky, TONE.mint][ci])}>{c}</p>
              <div className="mt-1.5 min-h-[9rem] space-y-1.5 rounded-lg bg-[#FCFCFA] p-1">
                {d.docs.map((doc, i) =>
                  col(i) === ci ? (
                    <motion.div
                      key={doc.id}
                      layoutId={doc.id}
                      transition={{ duration: 0.5, ease: EASE }}
                      className="rounded-md border border-black/[0.06] bg-white p-1.5 shadow-sm"
                    >
                      <span className="flex items-center gap-1">
                        {ci === C - 1 ? <Check className="size-3 shrink-0 text-[#26262a]" /> : <FileText className="size-3 shrink-0 text-[#26262a]/60" />}
                        <span className="truncate text-[9px] font-semibold text-[#26262a] sm:text-[10px]">{doc.kind}</span>
                      </span>
                      <span className="mt-0.5 block truncate text-[9px] tabular-nums text-[#26262a]/50">{doc.id}</span>
                    </motion.div>
                  ) : null,
                )}
              </div>
            </div>
          ))}
        </div>
      </LayoutGroup>
      <div className="mt-3 rounded-xl border border-black/[0.06] p-3">
        <p className="flex items-center gap-1.5 text-[11px] font-semibold text-[#26262a]">
          <Loader2 className="size-3.5 motion-safe:animate-spin" /> {d.extracting} {reading.kind} {reading.id}
        </p>
        <ul className="mt-2 grid grid-cols-3 gap-1.5">
          {reading.fields.map((f, i) => (
            <li
              key={f}
              className={cn(
                "flex items-center justify-center gap-1 truncate rounded-md px-1.5 py-1 text-[10px] font-medium transition-colors duration-300",
                i < fieldsShown ? "bg-[#26262a] text-white" : "bg-[#26262a]/[0.05] text-[#26262a]/45",
              )}
            >
              {i < fieldsShown ? <Check className="size-2.5 shrink-0" /> : null}
              <span className="truncate">{f}</span>
            </li>
          ))}
        </ul>
      </div>
    </VisualWindow>
  );
}
