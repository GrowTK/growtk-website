"use client";

import { useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { Icon } from "@/components/sections/icon";
import { Reveal, RevealGroup, RevealItem } from "@/components/magic/reveal";
import type { Feature, SectionHeading } from "@/content/types";
import { cn } from "@/lib/utils";

/**
 * Two more shapes for a service's "what's included" list.
 * IncludedTabs: a vertical tab rail on the left, the chosen item large on a
 * pastel panel on the right. IncludedIndex: an editorial numbered index,
 * title left and body right, a hairline between rows and a pastel sweep on
 * hover.
 */

export function IncludedTabs({ heading, features, gradient }: { heading: SectionHeading; features: Feature[]; gradient: string }) {
  const [active, setActive] = useState(0);
  const reduce = useReducedMotion();
  const f = features[active]!;
  return (
    <section className="bg-background px-6 py-20 sm:px-10 lg:py-28">
      <div className="mx-auto max-w-7xl">
        <Reveal className="max-w-3xl">
          {heading.eyebrow ? <p className="eyebrow text-primary">{heading.eyebrow}</p> : null}
          <h2 className="mt-4 font-display text-4xl font-bold leading-[1.04] tracking-tight text-balance text-foreground sm:text-5xl">{heading.title}</h2>
          {heading.body ? <p className="mt-5 text-base leading-relaxed text-muted-foreground sm:text-lg">{heading.body}</p> : null}
        </Reveal>
        <div className="mt-14 grid gap-6 lg:grid-cols-[22rem_1fr]">
          <div role="tablist" aria-label={heading.title} className="flex gap-2 overflow-x-auto pb-1 lg:flex-col lg:overflow-visible">
            {features.map((it, i) => (
              <button
                key={it.title}
                role="tab"
                aria-selected={i === active}
                onClick={() => setActive(i)}
                className={cn(
                  "flex min-w-[15rem] shrink-0 cursor-pointer items-center gap-3 rounded-2xl border px-4 py-3.5 text-left transition-colors duration-200 focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none lg:min-w-0",
                  i === active ? "border-[#26262a] bg-[#26262a] text-white" : "border-border bg-card text-foreground hover:border-foreground/25",
                )}
              >
                <span className={cn("grid size-9 shrink-0 place-items-center rounded-xl", i === active ? "bg-white/10" : "bg-[#26262a]/[0.06]")}>
                  <Icon name={it.icon} className="size-4" />
                </span>
                <span className="text-sm font-semibold leading-snug">{it.title}</span>
              </button>
            ))}
          </div>
          <div className="relative min-h-[22rem] overflow-hidden rounded-[1.75rem] p-8 sm:p-12" style={{ backgroundImage: gradient }}>
            <div aria-hidden className="absolute inset-0 opacity-[0.3] [background-image:radial-gradient(rgb(38_38_42/0.18)_1px,transparent_1px)] [background-size:18px_18px]" />
            <AnimatePresence mode="wait">
              <motion.div
                key={f.title}
                role="tabpanel"
                initial={{ opacity: 0, y: reduce ? 0 : 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: reduce ? 0 : -10 }}
                transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                className="relative flex h-full flex-col"
              >
                <div className="flex items-center justify-between">
                  <span className="grid size-14 place-items-center rounded-2xl bg-white text-[#26262a] shadow-sm">
                    <Icon name={f.icon} className="size-6" />
                  </span>
                  <span className="font-display text-6xl font-bold leading-none tracking-tighter text-transparent [-webkit-text-stroke:1.5px_rgb(38_38_42/0.3)]">
                    {String(active + 1).padStart(2, "0")}
                  </span>
                </div>
                <h3 className="mt-10 max-w-xl font-display text-3xl font-bold leading-[1.05] tracking-tight text-balance text-[#26262a] sm:text-4xl">{f.title}</h3>
                <p className="mt-5 max-w-xl text-base leading-relaxed text-[#26262a]/75 sm:text-lg">{f.body}</p>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  );
}

export function IncludedIndex({ heading, features, gradient }: { heading: SectionHeading; features: Feature[]; gradient: string }) {
  return (
    <section className="bg-background px-6 py-20 sm:px-10 lg:py-28">
      <div className="mx-auto grid max-w-7xl gap-12 lg:grid-cols-[0.8fr_1.2fr]">
        <Reveal className="lg:sticky lg:top-28 lg:self-start">
          {heading.eyebrow ? <p className="eyebrow text-primary">{heading.eyebrow}</p> : null}
          <h2 className="mt-4 font-display text-4xl font-bold leading-[1.04] tracking-tight text-balance text-foreground sm:text-5xl">{heading.title}</h2>
          {heading.body ? <p className="mt-5 text-base leading-relaxed text-muted-foreground sm:text-lg">{heading.body}</p> : null}
        </Reveal>
        <RevealGroup className="divide-y divide-border" stagger={0.06}>
          {features.map((f, i) => (
            <RevealItem key={f.title}>
              <div className="group relative isolate grid gap-3 overflow-hidden rounded-2xl px-4 py-7 sm:grid-cols-[4rem_1fr_1.2fr] sm:gap-6">
                <span aria-hidden className="absolute inset-0 -z-10 origin-left scale-x-0 opacity-60 transition-transform duration-500 ease-out group-hover:scale-x-100" style={{ backgroundImage: gradient }} />
                <span className="font-display text-sm font-bold tabular-nums text-foreground/40">{String(i + 1).padStart(2, "0")}</span>
                <h3 className="flex items-start gap-3 font-display text-xl font-bold tracking-tight text-foreground">
                  <Icon name={f.icon} className="mt-1 size-5 shrink-0" />
                  {f.title}
                </h3>
                <p className="text-sm leading-relaxed text-muted-foreground sm:text-base">{f.body}</p>
              </div>
            </RevealItem>
          ))}
        </RevealGroup>
      </div>
    </section>
  );
}
