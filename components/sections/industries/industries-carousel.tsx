"use client";

import { useRef } from "react";
import Link from "next/link";
import { ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";
import { Reveal } from "@/components/magic/reveal";
import { AutoSlider, type AutoSliderHandle } from "@/components/magic/auto-slider";
import { Icon } from "@/components/sections/icon";
import type { Cta, Img, SectionHeading } from "@/content/types";

type IndustryCard = { icon: string; name: string; teaser: string; href: string; image: Img };

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
              <Link
                key={industry.name}
                href={industry.href}
                className="group relative isolate flex aspect-square w-full cursor-pointer flex-col justify-end overflow-hidden rounded-lg border border-black/6 transition duration-300 ease-out hover:-translate-y-1 hover:shadow-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-foreground"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={industry.image.src}
                  alt={industry.image.alt}
                  loading="lazy"
                  decoding="async"
                  className="absolute inset-0 -z-20 size-full object-cover transition-transform duration-500 ease-out group-hover:scale-105"
                />
                <div aria-hidden className="absolute inset-0 -z-10 bg-gradient-to-t from-black/85 via-black/30 to-transparent" />
                <span className="absolute top-4 left-4 grid size-10 place-items-center rounded-xl border border-white/30 bg-white/15 text-white backdrop-blur-md">
                  <Icon name={industry.icon} className="size-5" />
                </span>
                <div className="flex flex-col p-6">
                  <h3 className="font-display text-lg font-semibold tracking-tight text-white">{industry.name}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-white/80">{industry.teaser}</p>
                  <span className="mt-5 inline-flex items-center gap-1.5 text-sm font-medium text-white">
                    See the playbook
                    <ArrowRight aria-hidden className="size-4 transition-transform duration-200 ease-out group-hover:translate-x-0.5" />
                  </span>
                </div>
              </Link>
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
