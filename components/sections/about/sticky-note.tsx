"use client";

import * as React from "react";
import { motion, useInView, useReducedMotion, useScroll, useTransform } from "motion/react";
import { cn } from "@/lib/utils";
import { handFont } from "@/lib/hand-font";
import { NoiseTexture } from "@/components/blocks/magicui/noise-texture";

type Doodle = "browser" | "phone" | "calendar" | "star";

const INK = "#2a2a2e";

/** Ink line drawings, hand-wobbled, in a 120 × 70 box. Each entry is drawn in order. */
const DOODLES: Record<Doodle, { paths: string[]; dots?: [number, number][] }> = {
  browser: {
    paths: [
      "M19 13.5 q0.4 -4 4.5 -3.8 h74 q4.2 0.3 4 4.6 l0.4 39.5 q-0.2 4.2 -4.6 4.1 h-73.6 q-4.3 -0.1 -4.4 -4.3 z",
      "M19.5 22.5 q40 -1.2 82.5 0.4",
      "M28 32 q18 -1.4 39 0.3",
      "M28 40 q12 -0.8 26 0.4",
      "M70.5 37.5 h20.5 q3.2 0.2 3 3.4 v3.6 q-0.2 3.1 -3.3 3 h-20 q-3 -0.1 -3 -3.2 v-3.8 q0.1 -3 2.8 -3 z",
      "M88 46 l7.5 14.5 l2 -6.3 l6.4 -1.6 z",
    ],
    dots: [[25, 16.5], [30.5, 16.4], [36, 16.6]],
  },
  phone: {
    paths: [
      "M38.5 9.5 q-4.6 0.2 -4.4 4.6 l0.3 42 q0.1 4.2 4.4 4.3 h19.6 q4.5 -0.1 4.3 -4.5 l-0.2 -41.8 q-0.1 -4.4 -4.4 -4.6 z",
      "M44 15.3 q4 -0.6 8.4 0.1",
      "M46 54.5 q2.5 -0.4 4.8 0.1",
      "M69 24 q6.4 8 0.2 16.5",
      "M76.5 18.5 q10.5 13.5 0.3 27",
      "M84 13 q14.5 19 0.6 37.5",
    ],
  },
  calendar: {
    paths: [
      "M24.5 14 h71 q4.4 0.2 4.3 4.5 l-0.3 37.8 q-0.2 4.2 -4.4 4.1 h-71.2 q-4.4 -0.2 -4.3 -4.6 l0.4 -37.5 q0.2 -4.2 4.5 -4.3 z",
      "M20.5 24.5 q40 -1.5 79.5 0.3",
      "M38 7.5 q0.3 5.5 0 11",
      "M82 7.5 q-0.3 5.5 0.2 11",
      "M30.5 37 c0.5 -7 15 -7 14.5 0.5 c-0.5 6.5 -15 6 -14 -0.8 l2.5 -2.4",
      "M53 37.5 c0.4 -7 15 -6.8 14.4 0.4 c-0.6 6.4 -14.8 6.1 -14 -0.6 l2.4 -2.3",
      "M75.5 49 c0.4 -7 15.2 -6.8 14.6 0.4 c-0.6 6.5 -15 6.1 -14.2 -0.6 l2.5 -2.3",
    ],
  },
  star: {
    paths: [
      "M40 15.5 l5.3 11.6 l12.4 1.2 l-9.4 8.4 l2.8 12.4 l-11 -6.5 l-10.9 6.6 l2.6 -12.5 l-9.5 -8.2 l12.5 -1.4 z",
      "M68 39 q3.5 3.2 8.2 9.5 q7.8 -14.5 20 -24",
      "M102 12 q0.2 4.2 0 8.5",
      "M97.8 16.2 q4.2 -0.3 8.4 0",
      "M24 60 q36 -4.5 74 -1",
    ],
  },
};

/** The calendar's circled dates, written in the same hand as the note. */
const CAL_DATES: [string, number, number][] = [["1", 37.7, 40.6], ["3", 60.2, 41], ["7", 82.8, 52.5]];

/**
 * One sticky note: coloured paper with grain, tape across the top, a corner
 * that curls up off the page (its own shadow underneath), an ink doodle that
 * draws itself in when the note scrolls into view, and handwriting written
 * out line by line. Drifts with the scroll at its own `speed`, like the
 * photos it replaces. Decorative: the same message is in the section copy.
 */
export function StickyNote({
  color,
  lines,
  doodle,
  speed = 1,
  delay = 0,
  className,
}: {
  color: string;
  lines: string[];
  doodle: Doodle;
  speed?: number;
  delay?: number;
  className?: string;
}) {
  const ref = React.useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const inView = useInView(ref, { once: true, margin: "-15% 0px" });
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], reduce ? [0, 0] : [-24 * speed, 24 * speed]);
  const drawn = reduce || inView;
  const art = DOODLES[doodle];
  const ease = [0.32, 0.72, 0, 1] as const;

  return (
    <motion.div ref={ref} style={{ y }} aria-hidden className={cn("group", handFont.variable, className)}>
      <div className="relative aspect-square w-full transition-transform duration-300 ease-out group-hover:-translate-y-1 group-hover:rotate-1">
        {/* Shadow under the curled corner: it lifts off the page, so its shadow sits lower and softer. */}
        <span className="absolute right-1 bottom-0 h-1/3 w-2/3 origin-bottom-right rotate-[4deg] rounded-full bg-black/25 blur-[10px] transition-all duration-300 group-hover:bottom-[-4px] group-hover:bg-black/30" />
        <span className="absolute inset-x-2 bottom-1 h-6 rounded-full bg-black/10 blur-md" />

        {/* The paper */}
        <div
          className="relative size-full overflow-hidden shadow-[0_1px_2px_rgba(0,0,0,.08),0_6px_14px_rgba(0,0,0,.06)]"
          style={{
            // Flat top, curling bottom right corner.
            borderRadius: "3px 3px 34px 3px / 3px 3px 14px 3px",
            background: `linear-gradient(172deg, color-mix(in srgb, ${color} 80%, white) 0%, ${color} 42%, color-mix(in srgb, ${color} 95%, #000) 100%)`,
          }}
        >
          {/* Paper grain over the gradient (magicui NoiseTexture), multiplied so the colour stays true. */}
          <NoiseTexture frequency={0.85} octaves={4} slope={0.7} noiseOpacity={0.55} className="opacity-35 mix-blend-multiply" />
          {/* The curl: a light catching the lifted corner. */}
          <span
            className="absolute right-0 bottom-0 size-1/2"
            style={{ background: "radial-gradient(120% 120% at 100% 100%, rgba(255,255,255,.55) 0%, rgba(255,255,255,0) 38%), linear-gradient(315deg, rgba(0,0,0,.10) 0%, rgba(0,0,0,0) 30%)" }}
          />
          {/* Adhesive strip: a faint band along the top edge. */}
          <span className="absolute inset-x-0 top-0 h-[14%] bg-gradient-to-b from-black/[.06] to-transparent" />

          <div className="relative flex size-full flex-col px-[9%] pt-[16%] pb-[10%]">
            <svg viewBox="0 0 120 70" fill="none" stroke={INK} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="w-full">
              {art.paths.map((d, i) => (
                <motion.path
                  key={i}
                  d={d}
                  initial={{ pathLength: reduce ? 1 : 0, opacity: reduce ? 1 : 0 }}
                  animate={drawn ? { pathLength: 1, opacity: 1 } : undefined}
                  transition={{ pathLength: { duration: 0.6, delay: delay + i * 0.14, ease }, opacity: { duration: 0.05, delay: delay + i * 0.14 } }}
                />
              ))}
              {art.dots?.map(([cx, cy], i) => (
                <motion.circle
                  key={i}
                  cx={cx}
                  cy={cy}
                  r={1.4}
                  fill={INK}
                  stroke="none"
                  initial={{ opacity: reduce ? 1 : 0 }}
                  animate={drawn ? { opacity: 1 } : undefined}
                  transition={{ duration: 0.2, delay: delay + 0.3 + i * 0.08 }}
                />
              ))}
              {doodle === "calendar" &&
                CAL_DATES.map(([t, x, yy], i) => (
                  <motion.text
                    key={t}
                    x={x}
                    y={yy}
                    textAnchor="middle"
                    fill={INK}
                    stroke="none"
                    fontSize={9}
                    fontWeight={700}
                    style={{ fontFamily: "var(--font-hand), cursive" }}
                    initial={{ opacity: reduce ? 1 : 0 }}
                    animate={drawn ? { opacity: 1 } : undefined}
                    transition={{ duration: 0.25, delay: delay + 0.5 + i * 0.12 }}
                  >
                    {t}
                  </motion.text>
                ))}
            </svg>

            <div className="mt-auto" style={{ fontFamily: "var(--font-hand), cursive", color: INK }}>
              {lines.map((line, i) => (
                <motion.p
                  key={line}
                  className={cn("leading-[1.05]", i === 0 ? "text-[26px] font-bold lg:text-[30px]" : "text-[19px] font-medium lg:text-[22px]")}
                  initial={{ clipPath: reduce ? "inset(0 0 0 0)" : "inset(0 100% 0 0)" }}
                  animate={drawn ? { clipPath: "inset(0 0% 0 0)" } : undefined}
                  transition={{ duration: 0.7, delay: delay + 0.6 + i * 0.35, ease: "easeOut" }}
                >
                  {line}
                </motion.p>
              ))}
            </div>
          </div>
        </div>

        {/* Tape */}
        <span
          className="absolute -top-3 left-1/2 h-7 w-[42%] -translate-x-1/2 -rotate-3 rounded-[2px] border border-white/50 bg-white/45 shadow-[0_1px_2px_rgba(0,0,0,.06)] backdrop-blur-[1px]"
          style={{ maskImage: "linear-gradient(90deg, transparent 0, #000 6%, #000 94%, transparent 100%)" }}
        />
      </div>
    </motion.div>
  );
}
