"use client";

import Link from "next/link";
import { useRef } from "react";
import { motion, useReducedMotion, useScroll, useTransform, type MotionValue } from "motion/react";
import { ArrowRight, Check } from "lucide-react";
import { Icon } from "@/components/sections/icon";
import { Reveal } from "@/components/magic/reveal";
import { ProductMock } from "@/components/sections/solutions/product-mock";
import type { MockKind } from "@/content/solution-mocks";
import type { Cta, SectionHeading } from "@/content/types";
import { cn } from "@/lib/utils";

export type StackItem = {
  icon: string;
  meta: string;
  title: string;
  name: string;
  body: string;
  bullets: string[];
  mock: MockKind;
  tone: "yellow" | "lilac" | "peach";
  cta: Cta;
};

const PANEL = {
  yellow: "from-[#FFDE59] to-[#FFF0AD]",
  lilac: "from-[#F2C4FF] to-[#F9E3FF]",
  peach: "from-[#FFBA7B] to-[#FFDDBC]",
} as const;

/**
 * Stacking solution cards. Each card pins under the navbar and the next one
 * slides over it, while the cards beneath ease back a step, so the four
 * systems read as one deck. Copy sits on a solid white half; the live product
 * mock sits on the solution's pastel. Under reduced motion the cards simply
 * stack without scaling.
 */
export function SolutionsStack({ heading, items, counterOf }: { heading: SectionHeading; items: StackItem[]; counterOf: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end end"] });

  return (
    <section className="relative bg-background px-6 py-24 sm:px-10 lg:py-32">
      <div className="mx-auto max-w-7xl">
        <Reveal className="grid gap-6 lg:grid-cols-[1.1fr_1fr] lg:items-end">
          <div>
            {heading.eyebrow ? <p className="eyebrow text-primary">{heading.eyebrow}</p> : null}
            <h2 className="mt-4 font-display text-4xl font-bold leading-[1.02] tracking-tight text-balance text-foreground sm:text-5xl lg:text-6xl">
              {heading.title}
            </h2>
          </div>
          {heading.body ? <p className="max-w-lg text-base leading-relaxed text-muted-foreground sm:text-lg lg:justify-self-end">{heading.body}</p> : null}
        </Reveal>

        <div ref={ref} className="relative mt-14 lg:mt-20">
          {items.map((item, i) => (
            <StackCard key={item.title} item={item} index={i} total={items.length} progress={scrollYProgress} counterOf={counterOf} />
          ))}
        </div>
      </div>
    </section>
  );
}

function StackCard({ item, index, total, progress, counterOf }: { item: StackItem; index: number; total: number; progress: MotionValue<number>; counterOf: string }) {
  const reduce = useReducedMotion();
  const start = index / total;
  const scale = useTransform(progress, [start, 1], [1, reduce ? 1 : 1 - (total - 1 - index) * 0.035]);
  const pad = (n: number) => String(n).padStart(2, "0");

  return (
    <div className="pb-6 lg:sticky lg:pb-8" style={{ top: `calc(6.5rem + ${index * 1.75}rem)` }}>
      <motion.article
        style={{ scale, transformOrigin: "50% 0%" }}
        className="grid overflow-hidden rounded-[1.75rem] border border-black/[0.06] bg-white shadow-[0_40px_90px_-50px_rgb(38_38_42/0.45)] lg:min-h-[34rem] lg:grid-cols-[1fr_1.05fr]"
      >
        <div className="relative flex flex-col p-8 sm:p-10 lg:p-12">
          <div className="flex items-start justify-between gap-6">
            <span className="font-display text-7xl font-bold leading-none tracking-tighter text-transparent [-webkit-text-stroke:1.5px_rgb(38_38_42/0.22)] sm:text-8xl">
              {pad(index + 1)}
            </span>
            <span className="rounded-full border border-black/10 px-3 py-1.5 text-xs font-semibold tabular-nums text-[#26262a]/70">
              {pad(index + 1)} {counterOf} {pad(total)}
            </span>
          </div>
          <div className="mt-8 flex items-center gap-2.5">
            <span className={cn("grid size-9 place-items-center rounded-xl bg-gradient-to-br", PANEL[item.tone])}>
              <Icon name={item.icon} className="size-4 text-[#26262a]" />
            </span>
            <span className="eyebrow text-[#26262a]/60">{item.meta}</span>
          </div>
          <h3 className="mt-4 font-display text-3xl font-bold leading-[1.05] tracking-tight text-balance text-[#26262a] sm:text-4xl">{item.name}</h3>
          <p className="mt-2 text-lg font-semibold leading-snug text-[#26262a]/80">{item.title}</p>
          <p className="mt-4 max-w-md text-base leading-relaxed text-muted-foreground">{item.body}</p>
          <ul className="mt-6 space-y-2.5">
            {item.bullets.map((b) => (
              <li key={b} className="flex items-start gap-2.5 text-sm text-[#26262a]">
                <Check aria-hidden className="mt-0.5 size-4 shrink-0" />
                {b}
              </li>
            ))}
          </ul>
          <div className="mt-auto pt-8">
            <Link
              href={item.cta.href}
              className="group inline-flex cursor-pointer items-center gap-2 rounded-full bg-[#26262a] px-6 py-3.5 text-sm font-semibold text-white transition duration-200 ease-out hover:-translate-y-0.5 hover:shadow-xl focus-visible:ring-2 focus-visible:ring-[#26262a] focus-visible:ring-offset-2 focus-visible:outline-none"
            >
              {item.cta.label}
              <ArrowRight aria-hidden className="size-4 transition-transform duration-200 group-hover:translate-x-0.5" />
            </Link>
          </div>
        </div>
        <div className={cn("relative flex items-center justify-center bg-gradient-to-br p-6 sm:p-10", PANEL[item.tone])}>
          <div aria-hidden className="absolute inset-0 opacity-[0.35] [background-image:radial-gradient(rgb(38_38_42/0.18)_1px,transparent_1px)] [background-size:18px_18px]" />
          <ProductMock kind={item.mock} className="relative max-w-md" />
        </div>
      </motion.article>
    </div>
  );
}
