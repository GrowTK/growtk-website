"use client";

import * as React from "react";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { Icon } from "@/components/sections/icon";
import type { Img, SectionHeading } from "@/content/types";

export type FeatureCard = {
  image: Img;
  tag: string;
  title: string;
  body: string;
  /** lucide-react icon name shown beside the caption on the image. */
  icon: string;
  caption: [string, string];
};

/**
 * Bespoke: a swipeable filmstrip of journal-style cards, a tag pill and an
 * index chip up top, a headline and body, then a tall image with an icon
 * and a two line caption resting on its own gradient. Best for a small set
 * of capabilities that each want real editorial presence, more than a
 * plain gallery caption, distinct from a stock icon-grid feature list.
 */
export function Feature08({
  heading,
  cards,
  className,
  cardWidthClassName = "w-[82vw] shrink-0 snap-start sm:w-[52vw] lg:w-[calc((100%-2.5rem)/3)]",
  imageAspectClassName = "aspect-[16/9]",
  radiusClassName = "rounded-none",
}: {
  heading?: SectionHeading;
  cards: FeatureCard[];
  className?: string;
  cardWidthClassName?: string;
  imageAspectClassName?: string;
  radiusClassName?: string;
}) {
  const trackRef = React.useRef<HTMLUListElement>(null);

  const scrollBy = React.useCallback((dir: 1 | -1) => {
    const el = trackRef.current;
    if (!el) return;
    el.scrollBy({ left: dir * el.clientWidth * 0.8, behavior: "smooth" });
  }, []);

  const onKeyDown = (e: React.KeyboardEvent<HTMLUListElement>) => {
    if (e.key === "ArrowRight") { e.preventDefault(); scrollBy(1); }
    if (e.key === "ArrowLeft") { e.preventDefault(); scrollBy(-1); }
  };

  if (cards.length === 0) return null;

  return (
    <section className={cn("bg-background py-20", className)}>
      <div className="mx-auto max-w-7xl px-6">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <div className="max-w-xl">
            {heading?.eyebrow ? <p className="eyebrow text-primary">{heading.eyebrow}</p> : null}
            {heading?.title ? (
              <h2 className="mt-3 font-display text-4xl font-bold tracking-tight text-balance text-foreground sm:text-5xl">
                {heading.title}
              </h2>
            ) : null}
            {heading?.body ? (
              <p className="mt-4 text-lg leading-relaxed text-muted-foreground">{heading.body}</p>
            ) : null}
          </div>
          <div className="flex gap-2">
            <button type="button" onClick={() => scrollBy(-1)} aria-label="Scroll to previous cards"
              className="grid size-11 cursor-pointer place-items-center rounded-full border border-border bg-card text-foreground transition duration-200 ease-out hover:-translate-y-0.5 hover:bg-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
              <ArrowLeft aria-hidden className="size-5" />
            </button>
            <button type="button" onClick={() => scrollBy(1)} aria-label="Scroll to next cards"
              className="grid size-11 cursor-pointer place-items-center rounded-full border border-border bg-card text-foreground transition duration-200 ease-out hover:-translate-y-0.5 hover:bg-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
              <ArrowRight aria-hidden className="size-5" />
            </button>
          </div>
        </div>

        <ul
          ref={trackRef}
          tabIndex={0}
          onKeyDown={onKeyDown}
          aria-label="Card filmstrip, use the left and right arrow keys"
          className="mt-10 -mx-6 flex snap-x snap-mandatory items-stretch gap-5 overflow-x-auto scroll-smooth px-6 pb-4 [scrollbar-width:none] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring [&::-webkit-scrollbar]:hidden"
        >
          {cards.map((c) => (
            <li key={c.title} className={cardWidthClassName}>
              <div className={cn("flex h-full flex-col border border-border/50 bg-card p-4", radiusClassName)}>
                <p className="font-display text-xs font-medium tracking-wide text-primary">{c.tag}</p>

                <h3 className="mt-3 font-display text-2xl font-bold tracking-tight text-foreground">{c.title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{c.body}</p>

                <div className={cn("relative mt-6 overflow-hidden rounded-md", imageAspectClassName)}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={c.image.src} alt={c.image.alt} loading="lazy" decoding="async" className="size-full object-cover" />
                  <div aria-hidden className="absolute inset-0 bg-primary/45 backdrop-blur-sm" />
                  <div aria-hidden className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                  <div className="absolute bottom-4 left-4 flex items-center gap-2.5">
                    <Icon name={c.icon} aria-hidden className="size-4 text-white" />
                    <div className="text-sm leading-tight">
                      <p className="font-medium text-white">{c.caption[0]}</p>
                      <p className="text-white/75">{c.caption[1]}</p>
                    </div>
                  </div>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
