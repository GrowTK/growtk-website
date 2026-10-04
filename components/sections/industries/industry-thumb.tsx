"use client";

import { cn } from "@/lib/utils";
import { TradeFigure } from "@/components/sections/industries/trade-figure";
import { themeFor, toneGlow, toneGradient } from "@/components/sections/industries/industry-tones";

/**
 * A small version of the industry card: the trade's tone with its Hairline
 * figure. The figure only mounts while `live` (the dropdown is open), so nine
 * figures are not running behind a closed menu on every page.
 */
export function IndustryThumb({ href, live, className }: { href: string; live: boolean; className?: string }) {
  const { icon, tone } = themeFor(href);
  return (
    <span
      aria-hidden
      className={cn("relative isolate block aspect-[5/4] w-full overflow-hidden rounded-lg", className)}
      style={{ backgroundImage: toneGradient(tone) }}
    >
      {live ? <TradeFigure name={icon} gradient={tone} className="absolute inset-0 p-1" /> : null}
      <span className="pointer-events-none absolute inset-0" style={{ backgroundImage: toneGlow(tone) }} />
    </span>
  );
}
