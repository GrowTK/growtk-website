"use client";

import * as React from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { CalendarClock, Headset, LayoutDashboard, MessageSquarePlus, PhoneMissed, Plug, Star, UserRoundCheck, type LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { dentavantaDeck } from "@/content/dentavanta";

const ICONS: Record<string, LucideIcon> = { PhoneMissed, MessageSquarePlus, Headset, UserRoundCheck, CalendarClock, Star, LayoutDashboard, Plug };

/** Upper arch, viewer's left to right: tooth 1 (third molar) to tooth 16, Universal numbering. */
type Kind = "molar" | "premolar" | "canine" | "lateral" | "central";
const KINDS: Kind[] = ["molar", "molar", "molar", "premolar", "premolar", "canine", "lateral", "central", "central", "lateral", "canine", "premolar", "premolar", "molar", "molar", "molar"];
const SIZE: Record<Kind, { w: number; h: number; r: number }> = {
  molar: { w: 30, h: 30, r: 10 },
  premolar: { w: 23, h: 27, r: 10 },
  canine: { w: 21, h: 28, r: 10 },
  lateral: { w: 18, h: 24, r: 8 },
  central: { w: 23, h: 26, r: 8 },
};

const CX = 200;
const CY = 282;
const RX = 152;
const RY = 214;

function at(theta: number, grow = 0) {
  const t = (theta * Math.PI) / 180;
  return { x: CX + (RX + grow) * Math.cos(t), y: CY - (RY + grow) * Math.sin(t) };
}

function arcPath(grow: number, from = 176, to = 4) {
  const steps = 48;
  let d = "";
  for (let i = 0; i <= steps; i++) {
    const { x, y } = at(from + ((to - from) * i) / steps, grow);
    d += `${i === 0 ? "M" : "L"}${x.toFixed(1)},${y.toFixed(1)} `;
  }
  return d;
}

const TEETH = KINDS.map((kind, i) => {
  const theta = 170 - (i * 160) / 15;
  const t = (theta * Math.PI) / 180;
  const { x, y } = at(theta);
  const rot = (Math.atan2(-RY * Math.cos(t), -RX * Math.sin(t)) * 180) / Math.PI;
  const label = at(theta, 30);
  return { n: i + 1, kind, x, y, rot, label, module: Math.floor(i / 2) };
});

/**
 * The overview slide's bespoke visual: a hairline tooth chart of the upper
 * arch. Every pair of teeth stands for one of Dentavanta's growth modules.
 * Hover, focus or tap a tooth to read it. It cycles on its own until touched.
 */
export function ToothArch() {
  const copy = dentavantaDeck.overview.arch;
  const reduce = useReducedMotion();
  const [active, setActive] = React.useState(0);
  const [hover, setHover] = React.useState<number | null>(null);
  const [focused, setFocused] = React.useState<number | null>(null);
  const [touched, setTouched] = React.useState(false);

  React.useEffect(() => {
    if (touched || reduce) return;
    const id = window.setInterval(() => setActive((a) => (a + 1) % copy.modules.length), 2800);
    return () => window.clearInterval(id);
  }, [touched, reduce, copy.modules.length]);

  const pick = (module: number) => {
    setTouched(true);
    setActive(module);
  };

  const m = copy.modules[active]!;
  const Icon = ICONS[m.icon] ?? Star;
  const pair = TEETH.filter((t) => t.module === active).map((t) => t.n);

  return (
    <div className="relative w-full max-w-[540px]">
      <svg viewBox="0 0 400 300" className="block w-full" role="group" aria-label={copy.label}>
        {/* Gum line and palate, hairline. */}
        <path d={arcPath(26)} fill="none" stroke="rgba(255,255,255,.35)" strokeWidth={1} />
        <path d={arcPath(-24)} fill="none" stroke="rgba(255,255,255,.25)" strokeWidth={1} strokeDasharray="2 5" />
        <path d={arcPath(-70, 160, 20)} fill="none" stroke="rgba(255,255,255,.12)" strokeWidth={1} />

        {TEETH.map((t) => {
          const s = SIZE[t.kind];
          const isActive = t.module === active;
          const isHover = hover === t.n;
          return (
            <g
              key={t.n}
              role="button"
              tabIndex={0}
              aria-label={`Tooth ${t.n}: ${copy.modules[t.module]!.name}`}
              aria-pressed={isActive}
              onMouseEnter={() => {
                setHover(t.n);
                pick(t.module);
              }}
              onMouseLeave={() => setHover(null)}
              onClick={() => pick(t.module)}
              onFocus={() => {
                setFocused(t.n);
                pick(t.module);
              }}
              onBlur={() => setFocused(null)}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  pick(t.module);
                }
              }}
              className="cursor-pointer outline-none"
            >
              <g transform={`translate(${t.x.toFixed(1)} ${t.y.toFixed(1)}) rotate(${t.rot.toFixed(1)})`}>
                {(isActive || focused === t.n) && (
                  <rect
                    x={-s.w / 2 - 5}
                    y={-s.h / 2 - 5}
                    width={s.w + 10}
                    height={s.h + 10}
                    rx={s.r + 4}
                    fill={isActive ? "rgba(255,255,255,.16)" : "none"}
                    stroke={focused === t.n ? "#ffffff" : "none"}
                    strokeWidth={1.5}
                  />
                )}
                <rect
                  x={-s.w / 2}
                  y={-s.h / 2}
                  width={s.w}
                  height={s.h}
                  rx={s.r}
                  fill={isActive ? "#ffffff" : isHover ? "rgba(255,255,255,.3)" : "rgba(255,255,255,.07)"}
                  stroke="#ffffff"
                  strokeOpacity={isActive ? 1 : 0.75}
                  strokeWidth={1.2}
                  style={{ transition: reduce ? undefined : "fill 250ms ease-out" }}
                />
                {/* Occlusal detail: a cross fissure on molars, a groove on premolars, an edge line on the front teeth. */}
                {t.kind === "molar" && (
                  <path d="M-8,-1 Q0,4 8,-1 M0,-9 L0,9" fill="none" stroke={isActive ? "#0636a6" : "rgba(255,255,255,.55)"} strokeWidth={1} strokeLinecap="round" />
                )}
                {t.kind === "premolar" && <path d="M-6,0 Q0,3 6,0" fill="none" stroke={isActive ? "#0636a6" : "rgba(255,255,255,.55)"} strokeWidth={1} strokeLinecap="round" />}
                {(t.kind === "central" || t.kind === "lateral" || t.kind === "canine") && (
                  <path d={`M${-s.w / 2 + 4},${s.h / 2 - 6} L${s.w / 2 - 4},${s.h / 2 - 6}`} fill="none" stroke={isActive ? "#0636a6" : "rgba(255,255,255,.45)"} strokeWidth={1} strokeLinecap="round" />
                )}
              </g>
              <text
                x={t.label.x}
                y={t.label.y + 3}
                textAnchor="middle"
                fontSize="9"
                fontFamily="ui-monospace, SFMono-Regular, Menlo, monospace"
                fill={isActive ? "#ffffff" : "rgba(255,255,255,.55)"}
                fontWeight={isActive ? 700 : 400}
              >
                {t.n}
              </text>
            </g>
          );
        })}
      </svg>

      {/* Module card: inside the arch from sm up, under it on phones. */}
      <div className="mx-auto mt-4 w-full max-w-sm sm:absolute sm:top-[38%] sm:left-1/2 sm:mt-0 sm:w-[54%] sm:-translate-x-1/2">
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={active}
            initial={{ opacity: 0, y: reduce ? 0 : 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: reduce ? 0 : -4 }}
            transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
            className="rounded-2xl bg-white p-4 text-[#0a0a0a]"
            aria-live="polite"
          >
            <div className="flex items-center gap-2.5">
              <span className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-[#0636a6] text-white">
                <Icon aria-hidden className="size-4" />
              </span>
              <span className="min-w-0">
                <span className="block text-[11px] font-medium text-[#6b7280]">
                  {copy.eyebrow} {String(active + 1).padStart(2, "0")} / {String(copy.modules.length).padStart(2, "0")} · {copy.toothLabel} {pair.join(", ")}
                </span>
                <span className="block truncate text-sm font-semibold">{m.name}</span>
              </span>
            </div>
            <p className="mt-2 text-[13px] leading-snug text-[#4b5563]">{m.body}</p>
          </motion.div>
        </AnimatePresence>
        <div className="mt-2 flex justify-center gap-1" aria-hidden>
          {copy.modules.map((_, i) => (
            <span key={i} className={cn("h-1 rounded-full transition-all duration-300", i === active ? "w-5 bg-white" : "w-1.5 bg-white/40")} />
          ))}
        </div>
      </div>
    </div>
  );
}
