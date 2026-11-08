"use client";

import * as React from "react";
import { motion, useReducedMotion } from "motion/react";
import { cn } from "@/lib/utils";
import type { ResumeDoc } from "@/content/autotalent";

/**
 * Presentational copies of AutoTalent's own UI: zinc neutrals on a #fafaf9
 * page, white rounded-2xl cards, olive #5b6949 buttons (hover #4a573a) and
 * the lime #eef4a6 accent, from the app's dashboard and super-agent panels.
 */

export const OLIVE = "#5b6949";
export const OLIVE_DARK = "#4a573a";
export const LIME = "#eef4a6";

export const FOCUS = "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#5b6949]/45 focus-visible:ring-offset-1";

export const CARD = "rounded-2xl border border-zinc-200 bg-white";

const BUTTON = cn(
  "inline-flex shrink-0 cursor-pointer items-center justify-center gap-2 rounded-xl text-sm font-semibold whitespace-nowrap transition-colors disabled:cursor-not-allowed disabled:opacity-50 [&_svg]:size-4 [&_svg]:shrink-0",
  FOCUS,
);
export const BTN_PRIMARY = cn(BUTTON, "h-10 bg-[#5b6949] px-4 text-white shadow-sm shadow-[#5b6949]/20 hover:bg-[#4a573a]");
export const BTN_OUTLINE = cn(BUTTON, "h-10 border border-zinc-200 bg-white px-4 text-zinc-700 hover:border-[#5b6949]/30 hover:bg-[#5b6949]/5 hover:text-[#5b6949]");
export const BTN_GHOST = cn(BUTTON, "h-8 px-2.5 text-xs font-medium text-zinc-500 hover:bg-zinc-100 hover:text-zinc-900");

export const INPUT = cn(
  "h-10 w-full rounded-xl border border-zinc-200 bg-white px-3 text-sm text-zinc-900 placeholder:text-zinc-400 transition-colors focus:border-[#5b6949]/50",
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#5b6949]/20",
);

/** Renders `[[keyword]]` as a lime highlight, the way the app marks matched keywords. */
export function Marked({ text, plain }: { text: string; plain?: boolean }) {
  const parts = text.split(/(\[\[[^\]]+\]\])/g);
  return (
    <>
      {parts.map((part, i) =>
        part.startsWith("[[") ? (
          plain ? (
            <React.Fragment key={i}>{part.slice(2, -2)}</React.Fragment>
          ) : (
            <mark key={i} className="rounded bg-[#eef4a6] px-0.5 text-zinc-900">
              {part.slice(2, -2)}
            </mark>
          )
        ) : (
          <React.Fragment key={i}>{part}</React.Fragment>
        ),
      )}
    </>
  );
}

/** Strips the keyword markers, for counting streamed characters. */
export const plainText = (text: string) => text.replace(/\[\[|\]\]/g, "");

/**
 * How many characters of a streamed answer are showing. Driven by the time
 * the answer started, so paging away and back never restarts it.
 */
export function useStreamed(length: number, startedAt: number | null, msPerChar = 14) {
  const reduce = useReducedMotion();
  const done = startedAt !== null && (reduce || Date.now() - startedAt >= length * msPerChar);
  const [count, setCount] = React.useState(() => (startedAt === null ? 0 : done ? length : Math.floor((Date.now() - startedAt) / msPerChar)));
  React.useEffect(() => {
    if (startedAt === null) return setCount(0);
    if (done) return setCount(length);
    let raf = 0;
    const tick = () => {
      const n = Math.min(length, Math.floor((Date.now() - startedAt) / msPerChar));
      setCount(n);
      if (n < length) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [startedAt, length, msPerChar, done]);
  return count;
}

/** A circular ATS score, olive on a zinc track, that eases between values. */
export function ScoreRing({ value, size = 120, stroke = 10, label }: { value: number; size?: number; stroke?: number; label?: string }) {
  const reduce = useReducedMotion();
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  const tone = value >= 85 ? "#4d7c0f" : value >= 70 ? OLIVE : "#b45309";
  return (
    <div className="relative shrink-0" style={{ width: size, height: size }} role="img" aria-label={`${label ?? "Score"} ${value} out of 100`}>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="-rotate-90" aria-hidden>
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="#e4e4e7" strokeWidth={stroke} />
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke={tone}
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={c}
          initial={false}
          animate={{ strokeDashoffset: c * (1 - value / 100), stroke: tone }}
          transition={{ duration: reduce ? 0 : 0.7, ease: [0.22, 1, 0.36, 1] }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <AnimatedNumber value={value} className="text-[28px] leading-none font-bold text-zinc-900 tabular-nums" style={{ fontSize: size * 0.27 }} />
        {label && <span className="mt-1 text-[10px] font-medium text-zinc-500">{label}</span>}
      </div>
    </div>
  );
}

/** A number that counts to its new value. */
export function AnimatedNumber({ value, className, style }: { value: number; className?: string; style?: React.CSSProperties }) {
  const reduce = useReducedMotion();
  const [shown, setShown] = React.useState(value);
  const from = React.useRef(value);
  React.useEffect(() => {
    if (reduce) {
      from.current = value;
      return setShown(value);
    }
    const start = performance.now();
    const a = from.current;
    let raf = 0;
    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / 700);
      const eased = 1 - Math.pow(1 - t, 3);
      setShown(Math.round(a + (value - a) * eased));
      if (t < 1) raf = requestAnimationFrame(tick);
      else from.current = value;
    };
    raf = requestAnimationFrame(tick);
    return () => {
      cancelAnimationFrame(raf);
      from.current = value;
    };
  }, [value, reduce]);
  return (
    <span className={className} style={style}>
      {shown}
    </span>
  );
}

/**
 * A CV on paper in one of the seven templates: a header band in the
 * template's accent, section labels with a bar in its secondary color.
 * `reveal` staggers the sections in, for documents the agent just wrote.
 */
export function ResumePaper({
  doc,
  accent,
  secondary,
  dir = "ltr",
  reveal,
  className,
}: {
  doc: ResumeDoc;
  accent: string;
  secondary: string;
  dir?: "ltr" | "rtl";
  reveal?: boolean;
  className?: string;
}) {
  const reduce = useReducedMotion();
  const section = (i: number) =>
    reveal && !reduce
      ? { initial: { opacity: 0, y: 8 }, animate: { opacity: 1, y: 0 }, transition: { delay: 0.15 + i * 0.22, duration: 0.35, ease: [0.22, 1, 0.36, 1] as const } }
      : {};
  // Lines that change after the first paint flash lime, so a rewrite is easy to spot.
  const mounted = React.useRef(false);
  React.useEffect(() => {
    mounted.current = true;
  }, []);
  const flash = mounted.current && !reduce;
  const Label = PaperLabel;
  return (
    <article dir={dir} className={cn("overflow-hidden rounded-lg bg-white text-zinc-700 shadow-[0_1px_2px_rgba(0,0,0,.06),0_12px_32px_rgba(31,37,26,.10)] ring-1 ring-zinc-200", className)}>
      <motion.header {...section(0)} className="px-6 pt-5 pb-4 text-white transition-colors duration-300" style={{ backgroundColor: accent }}>
        <h3 className="text-[19px] leading-tight font-bold">{doc.name}</h3>
        <p className="mt-0.5 text-[12px] font-medium text-white/90">{doc.headline}</p>
        <p className="mt-1 text-[10.5px] text-white/80" dir="ltr">
          {doc.contact}
        </p>
      </motion.header>
      <div className="space-y-4 px-6 py-5 text-[11.5px] leading-relaxed">
        <motion.section {...section(1)}>
          <Label color={secondary}>{doc.summaryLabel}</Label>
          <p>
            <Marked text={doc.summary} />
          </p>
        </motion.section>
        <motion.section {...section(2)}>
          <Label color={secondary}>{doc.experienceLabel}</Label>
          <div className="space-y-2.5">
            {doc.experience.map((r) => (
              <div key={r.role + r.company}>
                <div className="flex flex-wrap items-baseline justify-between gap-x-3">
                  <p className="font-semibold text-zinc-900">
                    {r.role}, <span dir="ltr">{r.company}</span>
                  </p>
                  <p className="text-[10.5px] text-zinc-500">{r.dates}</p>
                </div>
                <ul className="mt-1 space-y-0.5">
                  {r.bullets.map((b) => (
                    <li key={b} className="flex gap-2">
                      <span aria-hidden className="mt-[7px] size-1 shrink-0 rounded-full bg-zinc-400" />
                      <motion.span key={b} initial={flash ? { backgroundColor: "rgba(238,244,166,0.9)" } : false} animate={{ backgroundColor: "rgba(238,244,166,0)" }} transition={{ duration: 1.4 }} className="rounded">
                        <Marked text={b} />
                      </motion.span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </motion.section>
        <motion.section {...section(3)} className="grid gap-4 sm:grid-cols-[1fr_auto]">
          <div>
            <Label color={secondary}>{doc.skillsLabel}</Label>
            <ul className="flex flex-wrap gap-1.5">
              {doc.skills.map((s) => (
                <li key={s} className="rounded-full bg-zinc-100 px-2 py-0.5 text-[10.5px] font-medium text-zinc-700">
                  {s}
                </li>
              ))}
            </ul>
          </div>
          <div>
            <Label color={secondary}>{doc.educationLabel}</Label>
            <p>{doc.education}</p>
          </div>
        </motion.section>
      </div>
    </article>
  );
}

function PaperLabel({ color, children }: { color: string; children: React.ReactNode }) {
  return (
    <h4 className="mb-1.5 flex items-center gap-2 text-[11px] font-bold tracking-wide text-zinc-900">
      <span aria-hidden className="h-3 w-1 rounded-full transition-colors duration-300" style={{ backgroundColor: color }} />
      {children}
    </h4>
  );
}

/** Page header used across the replica: a title with an olive bar, like the Job Hub section heads. */
export function SectionHead({ title, count, children }: { title: string; count?: number; children?: React.ReactNode }) {
  return (
    <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
      <div className="flex items-center gap-3">
        <div aria-hidden className="h-7 w-1 rounded-full bg-[#5b6949]" />
        <h2 className="text-xl font-bold tracking-tight text-zinc-900">{title}</h2>
        {count !== undefined && <span className="rounded-full bg-[#5b6949]/10 px-2 py-0.5 text-[11px] font-bold text-[#5b6949] tabular-nums">{count}</span>}
      </div>
      {children}
    </div>
  );
}

/** Company tile: initials on the company's color. */
export function CompanyTile({ initials, color, size = "md" }: { initials: string; color: string; size?: "sm" | "md" }) {
  return (
    <span
      aria-hidden
      className={cn("flex shrink-0 items-center justify-center rounded-xl font-bold text-white", size === "sm" ? "size-8 text-[11px]" : "size-11 text-sm")}
      style={{ backgroundColor: color }}
    >
      {initials}
    </span>
  );
}
