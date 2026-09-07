"use client";

import { useRef } from "react";
import { ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";
import { Reveal } from "@/components/magic/reveal";
import { AutoSlider, type AutoSliderHandle } from "@/components/magic/auto-slider";
import type { Cta, Feature, SectionHeading } from "@/content/types";

/**
 * A split header, title left, supporting copy, prev/next and a CTA on the
 * right, above a row of tall, lightly rounded, image-backed cards (photo,
 * dark scrim, numbered title and body in white), one step per card, sized so
 * all of them fill the row edge to edge on a wide screen instead of leaving a
 * sliver of the next one peeking. Best for a short, ordered process that
 * should read as a filmstrip you step through, not a static grid.
 */
export function Feature07({ heading, cta, features }: { heading: SectionHeading; cta?: Cta; features: Feature[] }) {
  const sliderRef = useRef<AutoSliderHandle>(null);

  return (
    <section className="bg-background py-20 lg:py-28">
      <div className="mx-auto max-w-7xl px-6">
        <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
          <Reveal className="max-w-xl">
            {heading.eyebrow ? <p className="eyebrow text-primary">{heading.eyebrow}</p> : null}
            <h2 className="mt-3 font-display text-4xl font-bold tracking-tight text-balance text-foreground sm:text-5xl">
              {heading.title}
            </h2>
          </Reveal>
          <Reveal delay={0.1} className="flex flex-col items-start gap-5 lg:items-end lg:text-right">
            {heading.body ? <p className="max-w-sm text-base leading-relaxed text-muted-foreground">{heading.body}</p> : null}
            <div className="flex items-center gap-3">
              <div className="flex gap-2">
                <button
                  type="button"
                  aria-label="Previous step"
                  onClick={() => sliderRef.current?.step(-1)}
                  className="grid size-11 cursor-pointer place-items-center rounded-full border border-border bg-card text-foreground transition-colors hover:bg-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                >
                  <ChevronLeft className="size-5" />
                </button>
                <button
                  type="button"
                  aria-label="Next step"
                  onClick={() => sliderRef.current?.step(1)}
                  className="grid size-11 cursor-pointer place-items-center rounded-full border border-border bg-card text-foreground transition-colors hover:bg-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                >
                  <ChevronRight className="size-5" />
                </button>
              </div>
              {cta ? (
                <a
                  href={cta.href}
                  className="group inline-flex cursor-pointer items-center gap-2 rounded-full bg-foreground px-6 py-3 text-sm font-semibold text-background transition duration-200 ease-out hover:-translate-y-0.5 hover:shadow-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                >
                  {cta.label}
                  <ArrowRight aria-hidden className="size-4 transition-transform duration-200 ease-out group-hover:translate-x-0.5" />
                </a>
              ) : null}
            </div>
          </Reveal>
        </div>

        <div className="mt-14">
          <AutoSlider ref={sliderRef} controls={false} itemClassName="w-[70%] sm:w-[38%] lg:w-[calc((100%-3rem)/4)]">
            {features.map((f, i) => (
              <div
                key={f.title}
                className="group relative isolate aspect-[3/4] w-full overflow-hidden rounded-lg border border-black/6"
              >
                {f.image ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={f.image.src}
                    alt={f.image.alt}
                    loading="lazy"
                    decoding="async"
                    className="absolute inset-0 -z-10 size-full object-cover transition-transform duration-500 ease-out group-hover:scale-105"
                  />
                ) : null}
                <div aria-hidden className="absolute inset-0 -z-10 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                <p aria-hidden className="absolute top-4 right-5 font-display text-6xl font-bold text-white/40">
                  {i + 1}
                </p>
                <div className="flex h-full flex-col justify-end p-6">
                  <h3 className="font-display text-xl font-semibold tracking-tight text-white">{f.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-white/80">{f.body}</p>
                </div>
              </div>
            ))}
          </AutoSlider>
        </div>
      </div>
    </section>
  );
}
