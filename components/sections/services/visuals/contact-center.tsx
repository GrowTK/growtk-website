"use client";

import { AnimatePresence, motion } from "motion/react";
import { Bot, CalendarCheck, Mail, MessageCircle, MessageSquare, MessagesSquare, Phone, PhoneCall, PhoneIncoming, ShieldCheck, Smartphone, UserRound } from "lucide-react";
import { serviceVisuals } from "@/content/service-visuals";
import { cn } from "@/lib/utils";
import { EASE, LiveDot, TONE, useLive, useTick, VisualWindow } from "./shared";

/* ------------------------------ Omnichannel hub ----------------------------- */

const HUB_ICON = { voice: Phone, chat: MessageCircle, email: Mail, whatsapp: MessagesSquare, sms: Smartphone } as const;
const HUB_TONE = [TONE.yellow, TONE.lilac, TONE.peach, TONE.mint, TONE.sky];

export function ContactCenterHub({ className }: { className?: string }) {
  const d = serviceVisuals["contact-center-services"];
  const { ref, live } = useLive();
  const tick = useTick(live, 900);
  const n = d.channels.length;
  const active = tick % n;
  // Node positions on an ellipse, in percent of the stage.
  const pos = d.channels.map((_, i) => {
    const a = -Math.PI / 2 + (i * 2 * Math.PI) / n;
    return { x: 50 + Math.cos(a) * 33, y: 50 + Math.sin(a) * 38 };
  });
  const count = (i: number) => d.channels[i]!.start + Math.floor((tick + (n - i - 1)) / n);
  const total = d.channels.reduce((s, _, i) => s + count(i), 0);

  return (
    <VisualWindow innerRef={ref} title={d.title} label={d.label} className={className} right={<LiveDot />}>
      <div className="relative mx-auto aspect-[5/4] w-full max-w-md">
        <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="absolute inset-0 size-full">
          {pos.map((p, i) => (
            <line
              key={i}
              x1={p.x}
              y1={p.y}
              x2="50"
              y2="50"
              stroke={i === active ? "#26262a" : "rgb(38 38 42 / 0.15)"}
              strokeWidth={i === active ? 0.6 : 0.4}
              strokeDasharray="1.5 1.5"
              vectorEffect="non-scaling-stroke"
              style={{ transition: "stroke 300ms ease-out" }}
            />
          ))}
        </svg>
        {live ? (
          <motion.span
            key={tick}
            className="absolute size-2.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#26262a] shadow-[0_0_0_4px_rgb(255_222_89/0.6)]"
            initial={{ left: `${pos[active]!.x}%`, top: `${pos[active]!.y}%`, opacity: 0 }}
            animate={{ left: "50%", top: "50%", opacity: [0, 1, 1, 0] }}
            transition={{ duration: 0.8, ease: "easeInOut" }}
          />
        ) : null}
        <div className="absolute left-1/2 top-1/2 grid -translate-x-1/2 -translate-y-1/2 place-items-center">
          <motion.span
            className="absolute size-24 rounded-full bg-[#FFDE59]/40"
            animate={live ? { scale: [1, 1.25, 1], opacity: [0.6, 0, 0.6] } : undefined}
            transition={{ duration: 1.8, repeat: Infinity, ease: "easeOut" }}
          />
          <div className="relative grid size-20 place-items-center rounded-full bg-[#26262a] text-white shadow-xl sm:size-24">
            <div className="text-center">
              <Bot className="mx-auto size-6" />
              <p className="mt-1 text-[10px] font-semibold">{d.center}</p>
            </div>
          </div>
        </div>
        {d.channels.map((c, i) => {
          const Icon = HUB_ICON[c.key as keyof typeof HUB_ICON] ?? MessageSquare;
          const on = i === active;
          return (
            <div key={c.key} className="absolute -translate-x-1/2 -translate-y-1/2" style={{ left: `${pos[i]!.x}%`, top: `${pos[i]!.y}%` }}>
              <motion.div
                animate={{ scale: on ? 1.08 : 1 }}
                transition={{ duration: 0.3, ease: EASE }}
                className={cn("flex items-center gap-1.5 rounded-full border bg-white py-1 pl-1 pr-2.5 shadow-sm", on ? "border-[#26262a]" : "border-black/[0.08]")}
              >
                <span className={cn("grid size-6 place-items-center rounded-full text-[#26262a]", HUB_TONE[i])}>
                  <Icon className="size-3.5" />
                </span>
                <span className="text-[11px] font-semibold text-[#26262a]">{c.name}</span>
                <span className="text-[11px] tabular-nums text-[#26262a]/55">{count(i)}</span>
              </motion.div>
            </div>
          );
        })}
      </div>
      <div className="mt-3 flex items-center justify-between rounded-xl bg-[#FCFCFA] px-3.5 py-2.5">
        <span className="text-[11px] font-medium text-[#26262a]/60">{d.footer}</span>
        <span className="text-sm font-bold tabular-nums text-[#26262a]">{total}</span>
      </div>
    </VisualWindow>
  );
}

/* ------------------------------ Inbound console ----------------------------- */

export function InboundConsole({ className }: { className?: string }) {
  const d = serviceVisuals["inbound-contact-center"];
  const { ref, live, reduce } = useLive();
  const tick = useTick(live, 1300);
  const cycle = d.transcript.length + 4;
  const stage = reduce ? cycle - 2 : tick % cycle; // 0 ringing, 1 answered, then lines, then outcome
  const ringing = stage === 0;
  const lines = Math.max(0, Math.min(d.transcript.length, stage - 1));
  const done = stage >= d.transcript.length + 1;

  return (
    <VisualWindow innerRef={ref} title={d.title} label={d.label} className={className}>
      <div className="flex items-center gap-3 rounded-xl border border-black/[0.06] p-3">
        <span className="relative grid size-10 shrink-0 place-items-center rounded-full bg-[#26262a] text-white">
          {ringing && live ? <span className="absolute inset-0 rounded-full bg-[#FFDE59]/70 motion-safe:animate-ping" /> : null}
          <PhoneIncoming className="relative size-4" />
        </span>
        <div className="min-w-0 flex-1">
          <p className="text-[13px] font-semibold text-[#26262a]">{d.caller}</p>
          <p className="truncate text-[11px] tabular-nums text-[#26262a]/55">{d.number}</p>
        </div>
        <span className={cn("shrink-0 rounded-full px-2.5 py-1 text-[10px] font-semibold text-[#26262a] transition-colors duration-300", ringing ? TONE.yellow : TONE.mint)}>
          {ringing ? d.ringing : d.answered}
        </span>
      </div>

      <ul className="mt-3 min-h-[9.5rem] space-y-1.5">
        <AnimatePresence initial={false}>
          {d.transcript.slice(0, lines).map((l, i) => (
            <motion.li
              key={`${i}-${Math.floor(tick / cycle)}`}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.35, ease: EASE }}
              className={cn("flex", l.who === "ai" ? "justify-end" : "justify-start")}
            >
              <span
                className={cn(
                  "max-w-[85%] rounded-2xl px-3 py-1.5 text-[12px] leading-snug",
                  l.who === "ai" ? "rounded-br-sm bg-[#26262a] text-white" : "rounded-bl-sm bg-[#26262a]/[0.06] text-[#26262a]",
                )}
              >
                {l.text}
              </span>
            </motion.li>
          ))}
        </AnimatePresence>
      </ul>

      <div className="mt-3 grid grid-cols-[1fr_auto] items-center gap-3">
        <div className="flex flex-wrap items-center gap-1.5">
          <span className={cn("rounded-full px-2.5 py-1 text-[10px] font-semibold text-[#26262a] transition-opacity duration-300", TONE.lilac, lines >= 1 ? "opacity-100" : "opacity-30")}>
            {d.intentLabel}: {d.intent}
          </span>
          <AnimatePresence>
            {done ? (
              <motion.span
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3, ease: EASE }}
                className="inline-flex items-center gap-1 rounded-full bg-[#26262a] px-2.5 py-1 text-[10px] font-semibold text-white"
              >
                <CalendarCheck className="size-3" /> {d.outcomes[0]}
              </motion.span>
            ) : null}
          </AnimatePresence>
        </div>
        <div className="text-right">
          <p className="text-[9px] font-semibold tracking-wide text-[#26262a]/50">{d.queueLabel}</p>
          <p className="text-lg font-bold leading-none tabular-nums text-[#26262a]">0</p>
        </div>
      </div>
    </VisualWindow>
  );
}

/* ------------------------------ Outbound dialer ----------------------------- */

const FINAL = [1, 2, 1, 3, 1]; // index into statuses for each contact once called
const STATUS_TONE = [TONE.yellow, TONE.mint, TONE.lilac, TONE.soft];

export function OutboundDialer({ className }: { className?: string }) {
  const d = serviceVisuals["outbound-contact-center"];
  const { ref, live, reduce } = useLive();
  const tick = useTick(live, 1500);
  const n = d.contacts.length;
  const step = reduce ? n : tick % (n + 1); // contacts before `step` are done, `step` is calling
  const progress = Math.round((Math.min(step, n) / n) * 100);

  return (
    <VisualWindow
      innerRef={ref}
      title={d.title}
      label={d.label}
      className={className}
      right={
        <span className="inline-flex items-center gap-1 rounded-full bg-[#9FE3B4]/50 px-2 py-0.5 text-[10px] font-semibold text-[#26262a]">
          <ShieldCheck className="size-3" /> {d.consent}
        </span>
      }
    >
      <div className="flex items-center justify-between">
        <p className="text-sm font-semibold text-[#26262a]">{d.campaign}</p>
        <p className="text-[11px] tabular-nums text-[#26262a]/60">
          {Math.min(step, n)}/{n}
        </p>
      </div>
      <div className="mt-2">
        <div className="h-1.5 overflow-hidden rounded-full bg-black/[0.06]">
          <motion.div className="h-full rounded-full bg-[#26262a]" animate={{ width: `${progress}%` }} transition={{ duration: 0.5, ease: EASE }} />
        </div>
        <p className="mt-1 text-[10px] text-[#26262a]/50">{d.progressLabel}</p>
      </div>
      <ul className="mt-3 space-y-1.5">
        {d.contacts.map((c, i) => {
          const calling = i === step;
          const doneRow = i < step;
          const status = calling ? 0 : doneRow ? FINAL[i % FINAL.length]! : -1;
          return (
            <li
              key={c.name}
              className={cn(
                "flex items-center gap-3 rounded-xl border px-3 py-2 transition-colors duration-300",
                calling ? "border-[#26262a] bg-[#FFDE59]/10" : "border-black/[0.06]",
              )}
            >
              <span className={cn("relative grid size-7 shrink-0 place-items-center rounded-full", calling ? "bg-[#26262a] text-white" : "bg-[#26262a]/[0.06] text-[#26262a]")}>
                {calling && live ? <span className="absolute inset-0 rounded-full bg-[#FFDE59]/60 motion-safe:animate-ping" /> : null}
                {calling ? <PhoneCall className="relative size-3.5" /> : <UserRound className="size-3.5" />}
              </span>
              <span className="min-w-0 flex-1">
                <span className="block truncate text-[12px] font-semibold text-[#26262a]">{c.name}</span>
                <span className="block truncate text-[10px] text-[#26262a]/55">{c.detail}</span>
              </span>
              <AnimatePresence mode="wait" initial={false}>
                <motion.span
                  key={status}
                  initial={{ opacity: 0, y: 4 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -4 }}
                  transition={{ duration: 0.25 }}
                  className={cn(
                    "shrink-0 rounded-full px-2 py-0.5 text-[10px] font-semibold text-[#26262a]",
                    status >= 0 ? STATUS_TONE[status] : "text-[#26262a]/35",
                  )}
                >
                  {status >= 0 ? d.statuses[status] : d.queued}
                </motion.span>
              </AnimatePresence>
            </li>
          );
        })}
      </ul>
    </VisualWindow>
  );
}
