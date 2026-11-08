"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { ArrowUpRight, Quote } from "lucide-react";
import { Reveal } from "@/components/magic/reveal";
import type { Cta, Img, SectionHeading } from "@/content/types";
import { cn } from "@/lib/utils";

export type Outcome = {
  name: string;
  role: string;
  quote: string;
  tags: string[];
  image: Img;
  cta: Cta;
};

const DURATION = 7000;

/**
 * Outcome spotlight: a charcoal panel where one real build speaks at a time.
 * Project tabs on the left fill a progress line and advance on their own;
 * the right side swaps the outcome statement, its service tags and a screen
 * from the real product. Hover or focus pauses the rotation. Under reduced
 * motion nothing auto advances.
 */
export function OutcomeSpotlight({ heading, items }: { heading: SectionHeading; items: Outcome[] }) {
  const reduce = useReducedMotion();
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);
  const item = items[active]!;

  useEffect(() => {
    if (reduce || paused) return;
    const t = setTimeout(() => setActive((a) => (a + 1) % items.length), DURATION);
    return () => clearTimeout(t);
  }, [active, paused, reduce, items.length]);

  return (
    <section className="bg-background px-4 py-20 sm:px-6 lg:py-28">
      <div
        className="relative mx-auto max-w-7xl overflow-hidden rounded-[2rem] bg-[#1A1A1A] px-6 py-12 text-white sm:px-10 sm:py-16 lg:px-14"
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
        onFocus={() => setPaused(true)}
        onBlur={() => setPaused(false)}
      >
        <div aria-hidden className="pointer-events-none absolute -right-40 -top-40 size-[34rem] rounded-full bg-[#FFDE59]/10 blur-3xl" />
        <div aria-hidden className="pointer-events-none absolute -bottom-48 left-1/3 size-[30rem] rounded-full bg-[#F2C4FF]/10 blur-3xl" />

        <Reveal className="relative flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            {heading.eyebrow ? <p className="eyebrow text-[#FFDE59]">{heading.eyebrow}</p> : null}
            <h2 className="mt-4 max-w-2xl font-display text-4xl font-bold leading-[1.02] tracking-tight text-balance sm:text-5xl">{heading.title}</h2>
          </div>
          {heading.body ? <p className="max-w-sm text-sm leading-relaxed text-white/60">{heading.body}</p> : null}
        </Reveal>

        <div className="relative mt-12 grid gap-10 lg:mt-16 lg:grid-cols-[17rem_1fr] lg:gap-14">
          <div role="tablist" aria-label={heading.title} className="flex gap-2 overflow-x-auto pb-1 lg:flex-col lg:overflow-visible lg:pb-0">
            {items.map((it, i) => {
              const on = i === active;
              return (
                <button
                  key={it.name}
                  role="tab"
                  aria-selected={on}
                  onClick={() => setActive(i)}
                  className={cn(
                    "group relative min-w-[11rem] shrink-0 cursor-pointer overflow-hidden rounded-2xl px-4 py-3.5 text-left transition-colors duration-200 focus-visible:ring-2 focus-visible:ring-[#FFDE59] focus-visible:outline-none lg:min-w-0",
                    on ? "bg-white/[0.09]" : "hover:bg-white/[0.05]",
                  )}
                >
                  <span className={cn("block text-base font-semibold", on ? "text-white" : "text-white/55 group-hover:text-white/80")}>{it.name}</span>
                  <span className="mt-0.5 block text-xs text-white/45">{it.role}</span>
                  <span className="absolute inset-x-4 bottom-0 h-px bg-white/10">
                    {on ? (
                      <motion.span
                        key={`${active}-${paused}`}
                        className="block h-full origin-left bg-[#FFDE59]"
                        initial={{ scaleX: reduce || paused ? 1 : 0 }}
                        animate={{ scaleX: 1 }}
                        transition={{ duration: reduce || paused ? 0 : DURATION / 1000, ease: "linear" }}
                      />
                    ) : null}
                  </span>
                </button>
              );
            })}
          </div>

          <div className="grid gap-8 xl:grid-cols-[1.15fr_1fr] xl:items-center">
            <AnimatePresence mode="wait">
              <motion.div
                key={item.name}
                role="tabpanel"
                initial={{ opacity: 0, y: reduce ? 0 : 14 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: reduce ? 0 : -8 }}
                transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
              >
                <Quote aria-hidden className="size-10 fill-[#FFDE59] text-[#FFDE59]" />
                <blockquote className="mt-5 font-display text-2xl font-medium leading-snug tracking-tight text-balance sm:text-3xl">{item.quote}</blockquote>
                <ul className="mt-7 flex flex-wrap gap-2">
                  {item.tags.map((t) => (
                    <li key={t} className="rounded-full border border-white/15 px-3 py-1 text-xs font-medium text-white/75">
                      {t}
                    </li>
                  ))}
                </ul>
                <Link
                  href={item.cta.href}
                  className="group mt-8 inline-flex cursor-pointer items-center gap-2 rounded-full bg-white px-6 py-3 text-sm font-semibold text-[#1A1A1A] transition duration-200 hover:-translate-y-0.5 hover:bg-[#FFDE59] focus-visible:ring-2 focus-visible:ring-[#FFDE59] focus-visible:ring-offset-2 focus-visible:ring-offset-[#1A1A1A] focus-visible:outline-none"
                >
                  {item.cta.label}
                  <ArrowUpRight aria-hidden className="size-4 transition-transform duration-200 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                </Link>
              </motion.div>
            </AnimatePresence>

            <div className="relative aspect-[12/7] overflow-hidden rounded-2xl bg-white/5 ring-1 ring-white/10">
              <AnimatePresence initial={false}>
                <motion.img
                  key={item.image.src}
                  src={item.image.src}
                  alt={item.image.alt}
                  loading="lazy"
                  decoding="async"
                  initial={{ opacity: 0, scale: reduce ? 1 : 1.04 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                  className="absolute inset-0 size-full object-cover object-top"
                />
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
