"use client";

import * as React from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { cn } from "@/lib/utils";
import { yettiDeck, type Platform } from "@/content/yetti";
import { PlatformIcon } from "./ui";

type Channel = Exclude<Platform, "sms">;

const CHANNELS: Channel[] = ["whatsapp", "instagram", "messenger", "telegram", "gmail"];

/** Point on the orbit, in % of the square, starting at 12 o'clock. */
function orbitPoint(i: number, radius = 39) {
  const angle = (i / CHANNELS.length) * Math.PI * 2 - Math.PI / 2;
  return { x: 50 + Math.cos(angle) * radius, y: 50 + Math.sin(angle) * radius };
}

/**
 * Bespoke overview visual: every messaging channel Yetti answers, orbiting
 * the assistant. Tapping a channel fires a message down its spoke into the
 * center, and the exchange appears below, the way a guest's DM reaches the
 * inbox. Exists only for this deck; no library block covers it.
 */
export function ChannelOrbit({ className }: { className?: string }) {
  const copy = yettiDeck.overview.orbit;
  const reduce = useReducedMotion();
  const [active, setActive] = React.useState<Channel>("whatsapp");
  // Bumps on every tap so the packet animation replays on the same channel.
  const [shot, setShot] = React.useState(0);
  const [answered, setAnswered] = React.useState(true);

  React.useEffect(() => {
    if (shot === 0) return;
    setAnswered(false);
    const t = window.setTimeout(() => setAnswered(true), reduce ? 0 : 900);
    return () => window.clearTimeout(t);
  }, [shot, reduce]);

  const fire = (channel: Channel) => {
    setActive(channel);
    setShot((n) => n + 1);
  };

  const exchange = copy.channels[active];
  const from = orbitPoint(CHANNELS.indexOf(active));

  return (
    <div className={cn("flex w-full flex-col items-center gap-5", className)}>
      <div role="group" aria-label={copy.label} className="relative aspect-square w-full max-w-[min(100%,440px)]">
        {/* Rings and spokes. */}
        <svg aria-hidden viewBox="0 0 100 100" className="absolute inset-0 size-full overflow-visible">
          <circle cx="50" cy="50" r="39" fill="none" stroke="white" strokeOpacity="0.28" strokeWidth="0.35" strokeDasharray="1.2 1.6" />
          <circle cx="50" cy="50" r="24" fill="none" stroke="white" strokeOpacity="0.14" strokeWidth="0.35" />
          {CHANNELS.map((c, i) => {
            const p = orbitPoint(i);
            const on = c === active;
            return (
              <line
                key={c}
                x1="50"
                y1="50"
                x2={p.x}
                y2={p.y}
                stroke="white"
                strokeOpacity={on ? 0.85 : 0.18}
                strokeWidth={on ? 0.5 : 0.35}
                className="transition-[stroke-opacity] duration-300"
              />
            );
          })}
          {/* The message travelling down the spoke. */}
          {shot > 0 && !reduce && (
            <motion.circle
              key={shot}
              r="1.4"
              fill="white"
              initial={{ cx: from.x, cy: from.y, opacity: 1 }}
              animate={{ cx: 50, cy: 50, opacity: [1, 1, 0] }}
              transition={{ duration: 0.8, ease: [0.4, 0, 0.2, 1] }}
            />
          )}
        </svg>

        {/* Yetti in the middle, with a ripple each time a message lands. */}
        <div className="absolute top-1/2 left-1/2 flex size-[30%] -translate-x-1/2 -translate-y-1/2 items-center justify-center">
          {shot > 0 && !reduce && (
            <motion.span
              key={shot}
              aria-hidden
              className="absolute inset-0 rounded-full border-2 border-white"
              initial={{ scale: 1, opacity: 0 }}
              animate={{ scale: 1.5, opacity: [0, 0.7, 0] }}
              transition={{ duration: 0.7, delay: 0.75, ease: "easeOut" }}
            />
          )}
          <span className="flex size-full items-center justify-center rounded-full bg-white shadow-[0_18px_40px_rgba(8,30,52,.35)]">
            {/* eslint-disable-next-line @next/next/no-img-element -- product mark inside the drawing */}
            <img src={yettiDeck.logo.src} alt={copy.center} className="size-[68%] object-contain" />
          </span>
        </div>

        {/* Channels on the orbit. */}
        {CHANNELS.map((c, i) => {
          const p = orbitPoint(i);
          const on = c === active;
          const name = copy.channels[c].name;
          return (
            <button
              key={c}
              type="button"
              onClick={() => fire(c)}
              aria-pressed={on}
              aria-label={`Send Yetti a ${name} message`}
              style={{ left: `${p.x}%`, top: `${p.y}%` }}
              className={cn(
                "group absolute flex size-[15%] min-h-11 min-w-11 -translate-x-1/2 -translate-y-1/2 cursor-pointer items-center justify-center rounded-full bg-white transition duration-200 ease-out hover:scale-110 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-white/60",
                on ? "scale-110 shadow-[0_0_0_5px_rgba(255,255,255,.35),0_12px_28px_rgba(8,30,52,.35)]" : "shadow-[0_8px_20px_rgba(8,30,52,.25)]",
              )}
            >
              <PlatformIcon platform={c} className="size-[56%]" />
            </button>
          );
        })}
      </div>

      {/* The exchange: guest left, Yetti right, on solid white so it reads. */}
      <div aria-live="polite" className="w-full max-w-sm rounded-3xl bg-white p-4 shadow-[0_18px_40px_rgba(8,30,52,.25)]">
        <div className="flex items-center gap-2 text-xs font-semibold text-slate-500">
          <PlatformIcon platform={active} className="size-4" />
          {exchange.name}
        </div>
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={`${active}-${shot}`}
            initial={{ opacity: 0, y: reduce ? 0 : 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="mt-3 flex flex-col gap-2 text-[13.5px] leading-snug"
          >
            <p className="max-w-[85%] self-start rounded-2xl rounded-bl-md bg-slate-100 px-3 py-2 text-slate-800">{exchange.question}</p>
            {answered ? (
              <motion.p
                initial={{ opacity: 0, y: reduce ? 0 : 4 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.25 }}
                className="max-w-[85%] self-end rounded-2xl rounded-br-md bg-[#2d6695] px-3 py-2 text-white"
              >
                {exchange.answer}
              </motion.p>
            ) : (
              <span aria-label="Yetti is typing" className="flex gap-1 self-end rounded-2xl rounded-br-md bg-[#2d6695] px-3 py-3">
                {[0, 1, 2].map((d) => (
                  <motion.span
                    key={d}
                    className="size-1.5 rounded-full bg-white"
                    animate={{ opacity: [0.35, 1, 0.35] }}
                    transition={{ duration: 0.9, repeat: Infinity, delay: d * 0.15 }}
                  />
                ))}
              </span>
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
