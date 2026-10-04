"use client";

import * as React from "react";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { Icon } from "@/components/sections/icon";
import { Reveal } from "@/components/magic/reveal";
import { TradeFigure } from "@/components/sections/industries/trade-figure";
import { serviceFigureFor } from "@/components/sections/industries/service-figures";
import { toneGlow, toneGradient, type IndustryTone } from "@/components/sections/industries/industry-tones";
import { industryPageLabels } from "@/content/industries";
import type { Feature, SectionHeading } from "@/content/types";

/** Which /services section each kind of service figure belongs to. */
const SERVICE_ANCHOR: Record<string, string> = {
  site: "website-redesign",
  estimate: "widgets",
  schedule: "automation",
  voice: "voice-agents",
  connect: "integrations",
  rank: "seo",
};

/** The trade-coloured panel with one Hairline figure. Its direct child is the figure, so plates take the panel's gradient. */
export function FigurePanel({ kind, tone, className, children }: { kind: string; tone: IndustryTone; className?: string; children?: React.ReactNode }) {
  return (
    <div className={cn("relative flex flex-col overflow-hidden rounded-[28px]", className)} style={{ background: toneGradient(tone) }}>
      <div aria-hidden className="pointer-events-none absolute inset-0" style={{ background: toneGlow(tone) }} />
      <TradeFigure set="service" name={kind} gradient={tone} className="relative mx-auto my-auto max-w-[480px] px-6 py-6" />
      {children}
    </div>
  );
}

/**
 * An industry's services as alternating rows: copy left and the trade-coloured
 * Hairline figure right, then flipped, so the eye zigzags down the page. Below
 * lg every row stacks figure first, copy second.
 */
export function IndustryServices({ heading, features, tone }: { heading: SectionHeading; features: Feature[]; tone: IndustryTone }) {
  const labels = industryPageLabels.services;

  return (
    <section className="bg-background pt-16 lg:pt-24">
      <div className="mx-auto max-w-7xl px-6">
        <Reveal className="mx-auto max-w-3xl text-center">
          {heading.eyebrow && <p className="eyebrow text-primary">{heading.eyebrow}</p>}
          <h2 className="mt-3 font-display text-4xl leading-[1.05] font-bold tracking-tight text-balance text-foreground sm:text-5xl">{heading.title}</h2>
          {heading.body && <p className="mx-auto mt-5 max-w-2xl text-lg leading-relaxed text-muted-foreground">{heading.body}</p>}
        </Reveal>

        <ol className="mt-12 flex flex-col gap-16 lg:mt-20 lg:gap-28">
          {features.map((f, i) => {
            const kind = serviceFigureFor(f.icon);
            const flip = i % 2 === 1;
            return (
              <li key={f.title} className="grid items-center gap-8 lg:grid-cols-2 lg:gap-16">
                <Reveal y={16} className={cn("order-2", flip ? "lg:order-2" : "lg:order-1")}>
                  <div className="flex items-center gap-3">
                    <span className="flex size-11 items-center justify-center rounded-2xl text-foreground" style={{ background: toneGradient(tone) }}>
                      <Icon name={f.icon} className="size-5" strokeWidth={1.75} />
                    </span>
                    <span className="font-mono text-xs font-medium tracking-wide text-muted-foreground tabular-nums">
                      {labels.counter.replace("{n}", String(i + 1)).replace("{total}", String(features.length))}
                    </span>
                  </div>
                  <h3 className="mt-6 font-display text-3xl leading-[1.08] font-bold tracking-tight text-balance text-foreground sm:text-4xl">{f.title}</h3>
                  <p className="mt-5 max-w-xl text-lg leading-relaxed text-muted-foreground">{f.body}</p>
                  <Link
                    href={`/services#${SERVICE_ANCHOR[kind]}`}
                    className="group/link mt-7 inline-flex cursor-pointer items-center gap-1.5 rounded-full text-sm font-semibold text-foreground underline-offset-4 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  >
                    {labels.link}
                    <ArrowUpRight aria-hidden className="size-4 transition-transform duration-200 group-hover/link:translate-x-0.5 group-hover/link:-translate-y-0.5" />
                  </Link>
                </Reveal>

                <Reveal y={16} delay={0.08} className={cn("order-1", flip ? "lg:order-1" : "lg:order-2")}>
                  <FigurePanel kind={kind} tone={tone} className="aspect-[5/4]">
                    <span className="absolute top-5 left-6 font-display text-5xl font-bold tracking-tight text-foreground/15 tabular-nums" aria-hidden>
                      {String(i + 1).padStart(2, "0")}
                    </span>
                  </FigurePanel>
                </Reveal>
              </li>
            );
          })}
        </ol>
      </div>
    </section>
  );
}
