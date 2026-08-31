"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import type { Cta, Img } from "@/content/types";

export type ShowcaseItem = { title: string; meta?: string; price?: string; image: Img; cta?: Cta };

/**
 * Full height, full width showcase that cycles through distinct offerings on
 * a timer: Hero09's two photo overlapping frame idea, blown out to fill the
 * whole section instead of sharing it with a copy column. The current item
 * fills the frame; the next one up sits as the small offset inset photo, so
 * every rotation is already previewing where it is headed. Best for a
 * handful of genuinely different things worth spotlighting in turn (menu
 * items, rooms, trip packages), not a plain photo gallery, which is what
 * Gallery06/07 are for.
 */
export function Gallery08({ items, intervalMs = 4500 }: { items: ShowcaseItem[]; intervalMs?: number }) {
  const [index, setIndex] = React.useState(0);

  React.useEffect(() => {
    if (items.length < 2) return;
    const id = setInterval(() => setIndex((i) => (i + 1) % items.length), intervalMs);
    return () => clearInterval(id);
  }, [items.length, intervalMs]);

  if (items.length === 0) return null;

  const current = items[index];
  const next = items[(index + 1) % items.length];

  return (
    <section className="relative isolate h-screen w-full overflow-hidden bg-foreground">
      {items.map((it, i) => (
        <img
          key={it.title}
          src={it.image.src}
          alt={it.image.alt}
          loading="lazy"
          decoding="async"
          className={cn(
            "absolute inset-0 size-full object-cover transition-opacity duration-1000 ease-out",
            i === index ? "opacity-100" : "opacity-0",
          )}
        />
      ))}

      <div aria-hidden className="absolute inset-x-0 bottom-0 z-10 h-2/3 bg-gradient-to-t from-foreground/85 via-foreground/10 to-transparent" />

      {items.length > 1 ? (
        <img
          key={`inset-${next.title}`}
          src={next.image.src}
          alt=""
          aria-hidden
          className="absolute right-6 bottom-24 z-20 aspect-square w-28 rounded-2xl border-4 border-background object-cover shadow-2xl sm:right-10 sm:bottom-28 sm:w-44"
        />
      ) : null}

      <div className="absolute inset-x-0 top-8 z-20 flex justify-center gap-2">
        {items.map((it, i) => (
          <button
            key={it.title}
            type="button"
            onClick={() => setIndex(i)}
            aria-label={`Show ${it.title}`}
            aria-current={i === index}
            className={cn(
              "h-1 cursor-pointer rounded-full transition-all duration-300",
              i === index ? "w-8 bg-background" : "w-4 bg-background/40 hover:bg-background/70",
            )}
          />
        ))}
      </div>

      <div className="absolute inset-x-0 bottom-8 z-20 px-6 sm:bottom-10 sm:px-10">
        <div className="mx-auto max-w-7xl">
          <h2 className="max-w-xl font-display text-3xl font-bold leading-[1.05] tracking-tight text-balance text-background sm:text-5xl">
            {current.title}
          </h2>
          {current.price || current.meta ? (
            <p className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-background/85">
              {current.price ? <span className="font-semibold text-background">{current.price}</span> : null}
              {current.price && current.meta ? <span aria-hidden>&middot;</span> : null}
              {current.meta ? <span>{current.meta}</span> : null}
            </p>
          ) : null}
          {current.cta ? (
            <a
              href={current.cta.href}
              className="mt-6 inline-flex cursor-pointer items-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground transition-transform duration-200 hover:-translate-y-0.5 focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-foreground focus-visible:outline-none"
            >
              {current.cta.label}
            </a>
          ) : null}
        </div>
      </div>
    </section>
  );
}
