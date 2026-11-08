"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { ArrowUpRight } from "lucide-react";
import { Icon } from "@/components/sections/icon";
import { IndustryVisual } from "@/components/sections/industries/visuals";
import { INDUSTRY_THEME, toneGradient } from "@/components/sections/industries/industry-tones";
import { cn } from "@/lib/utils";

/**
 * The industries hub hero figure: a row of industry chips over one live
 * visual that changes every few seconds. Picking a chip jumps to it and
 * stops the rotation; the open link goes to that industry's page.
 */
export function IndustrySwitcher({ items, exploreLabel }: { items: { slug: string; name: string; icon: string }[]; exploreLabel: string }) {
  const reduce = useReducedMotion();
  const [active, setActive] = useState(0);
  const [auto, setAuto] = useState(true);
  const item = items[active]!;
  const tone = INDUSTRY_THEME[item.slug]?.tone ?? INDUSTRY_THEME.hvac!.tone;

  useEffect(() => {
    if (!auto || reduce) return;
    const t = setTimeout(() => setActive((a) => (a + 1) % items.length), 6000);
    return () => clearTimeout(t);
  }, [active, auto, reduce, items.length]);

  return (
    <div className="w-full">
      <div role="tablist" aria-label={exploreLabel} className="flex flex-wrap gap-1.5">
        {items.map((it, i) => (
          <button
            key={it.slug}
            role="tab"
            aria-selected={i === active}
            onClick={() => {
              setActive(i);
              setAuto(false);
            }}
            className={cn(
              "inline-flex cursor-pointer items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-semibold transition-colors duration-200 focus-visible:ring-2 focus-visible:ring-[#26262a] focus-visible:outline-none",
              i === active ? "border-[#26262a] bg-[#26262a] text-white" : "border-black/10 bg-white text-[#26262a] hover:border-black/25",
            )}
          >
            <Icon name={it.icon} className="size-3.5" />
            {it.name}
          </button>
        ))}
      </div>
      <div className="relative mt-4 overflow-hidden rounded-[1.5rem] p-5 transition-[background-image] duration-500 sm:p-7" style={{ backgroundImage: toneGradient(tone) }}>
        <AnimatePresence mode="wait">
          <motion.div
            key={item.slug}
            initial={{ opacity: 0, y: reduce ? 0 : 14 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: reduce ? 0 : -10 }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
          >
            <IndustryVisual slug={item.slug} />
          </motion.div>
        </AnimatePresence>
        <Link
          href={`/industries/${item.slug}`}
          className="group absolute right-4 bottom-4 inline-flex cursor-pointer items-center gap-1.5 rounded-full bg-[#26262a] px-4 py-2 text-xs font-semibold text-white shadow-lg transition hover:-translate-y-0.5 focus-visible:ring-2 focus-visible:ring-white focus-visible:outline-none"
        >
          {exploreLabel}: {item.name}
          <ArrowUpRight aria-hidden className="size-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
        </Link>
      </div>
    </div>
  );
}
