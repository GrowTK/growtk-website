"use client";

import { useRef } from "react";
import Link from "next/link";
import { ArrowRight, ArrowUpRight, ChevronLeft, ChevronRight } from "lucide-react";
import { Reveal } from "@/components/magic/reveal";
import { AutoSlider, type AutoSliderHandle } from "@/components/magic/auto-slider";
import { NoiseTexture } from "@/components/blocks/magicui/noise-texture";
import { TradeFigure } from "@/components/sections/industries/trade-figure";
import { themeFor, toneGlow, toneGradient } from "@/components/sections/industries/industry-tones";
import type { Cta, SectionHeading } from "@/content/types";

type IndustryCard = { name: string; teaser: string; href: string };

/**
 * One industry card: the trade's tone (components/sections/industries/industry-tones.ts),
 * its Hairline figure, then a same-hue glow and grain laid over the figure so
 * they tint plates and card alike. Text and line art stay charcoal on top.
 */
export function IndustryTile({ industry }: { industry: IndustryCard }) {
  const { icon, tone } = themeFor(industry.href);
  return (
    <Link
      href={industry.href}
      style={{ backgroundImage: toneGradient(tone) }}
      className="group relative isolate flex h-full min-h-[34rem] w-full cursor-pointer flex-col overflow-hidden rounded-2xl text-[#26262a] transition duration-300 ease-out hover:-translate-y-1 hover:shadow-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#26262a] focus-visible:ring-offset-2"
    >
      <TradeFigure name={icon} gradient={tone} className="px-2 pt-4" />
      <span aria-hidden className="pointer-events-none absolute inset-0" style={{ backgroundImage: toneGlow(tone) }} />
      <NoiseTexture frequency={0.75} octaves={4} slope={0.12} noiseOpacity={0.5} className="z-10 opacity-25" />
      <div className="relative z-20 mt-auto flex flex-col px-7 pb-8">
        <div className="flex items-center justify-between gap-4">
          <h3 className="truncate font-display text-2xl font-bold tracking-tight sm:text-3xl">{industry.name}</h3>
          <span className="grid size-9 shrink-0 place-items-center rounded-full border border-[#26262a]/25 transition-colors duration-200 group-hover:bg-[#26262a] group-hover:text-white">
            <ArrowUpRight aria-hidden className="size-4" />
          </span>
        </div>
        <p className="mt-3 text-base leading-relaxed text-[#26262a]/80">{industry.teaser}</p>
      </div>
    </Link>
  );
}

/**
 * Bespoke: industry link-cards in a filmstrip, heading left and prev/next
 * above the row on the right, nothing in the catalog does this.
 */
export function IndustriesCarousel({ heading, items, cta }: {
  heading: SectionHeading;
  items: IndustryCard[];
  cta: Cta;
}) {
  const sliderRef = useRef<AutoSliderHandle>(null);

  return (
    <section className="bg-background py-20 lg:py-28">
      <div className="mx-auto max-w-7xl px-6">
        <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
          <Reveal className="max-w-2xl">
            {heading.eyebrow ? <p className="eyebrow text-primary">{heading.eyebrow}</p> : null}
            <h2 className="mt-3 font-display text-4xl font-bold tracking-tight text-balance text-foreground sm:text-5xl">
              {heading.title}
            </h2>
            {heading.body ? (
              <p className="mt-4 text-base leading-relaxed text-muted-foreground">{heading.body}</p>
            ) : null}
          </Reveal>
          <Reveal delay={0.1} className="flex shrink-0 gap-2">
            <button
              type="button"
              aria-label="Previous industry"
              onClick={() => sliderRef.current?.step(-1)}
              className="grid size-11 cursor-pointer place-items-center rounded-full border border-border bg-card text-foreground transition-colors hover:bg-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              <ChevronLeft className="size-5" />
            </button>
            <button
              type="button"
              aria-label="Next industry"
              onClick={() => sliderRef.current?.step(1)}
              className="grid size-11 cursor-pointer place-items-center rounded-full border border-border bg-card text-foreground transition-colors hover:bg-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              <ChevronRight className="size-5" />
            </button>
          </Reveal>
        </div>

        <div className="mt-12">
          <AutoSlider ref={sliderRef} controls={false} itemClassName="w-[85%] sm:w-[47%] lg:w-[31.5%]">
            {items.map((industry) => (
              <IndustryTile key={industry.name} industry={industry} />
            ))}
          </AutoSlider>
        </div>

        <Reveal delay={0.1} className="mt-10">
          <Link
            href={cta.href}
            className="inline-flex cursor-pointer items-center gap-2 text-sm font-semibold text-foreground underline-offset-4 hover:underline"
          >
            {cta.label}
            <ArrowRight aria-hidden className="size-4" />
          </Link>
        </Reveal>
      </div>
    </section>
  );
}
