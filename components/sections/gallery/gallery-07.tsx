"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import type { Img, SectionHeading } from "@/content/types";

/**
 * Gallery06's split layout, made live: it auto advances on a timer instead
 * of sitting still until someone clicks a thumb, pausing whenever a visitor
 * hovers the frame so it never fights someone actually looking at a photo.
 * The thumbnail rail is real cards (accent bar, shadow, numeral in the
 * display face) rather than a plain hairline divided list, and scrolls
 * internally so a long set never pushes the sticky frame out of view.
 */
export function Gallery07({
  heading,
  images,
  className,
  intervalMs = 3200,
}: {
  heading?: SectionHeading;
  images: Img[];
  className?: string;
  intervalMs?: number;
}) {
  const [active, setActive] = React.useState(0);
  const [paused, setPaused] = React.useState(false);

  React.useEffect(() => {
    if (images.length < 2 || paused) return;
    const id = setInterval(() => setActive((i) => (i + 1) % images.length), intervalMs);
    return () => clearInterval(id);
  }, [images.length, intervalMs, paused]);

  if (images.length === 0) return null;

  return (
    <section className={cn("bg-background py-20", className)}>
      <div className="mx-auto grid max-w-7xl gap-10 px-6 lg:grid-cols-[2fr_1fr]">
        <div className="lg:sticky lg:top-16 lg:self-start">
          <div
            className="relative aspect-3/2 overflow-hidden rounded-2xl border border-border bg-muted"
            onMouseEnter={() => setPaused(true)}
            onMouseLeave={() => setPaused(false)}
          >
            {images.map((image, i) => (
              /* eslint-disable-next-line @next/next/no-img-element */
              <img
                key={image.src + i}
                src={image.src}
                alt={image.alt}
                width={1600}
                height={1067}
                loading="lazy"
                decoding="async"
                aria-hidden={i !== active}
                className={cn(
                  "absolute inset-0 size-full object-cover transition-opacity duration-300 ease-out motion-reduce:transition-none",
                  i === active ? "opacity-100" : "opacity-0",
                )}
              />
            ))}
          </div>
        </div>

        <div>
          {heading?.eyebrow ? <p className="eyebrow text-primary">{heading.eyebrow}</p> : null}
          {heading?.title ? (
            <h2 className="mt-3 font-display text-3xl font-bold tracking-tight text-balance text-foreground sm:text-4xl">
              {heading.title}
            </h2>
          ) : null}
          {heading?.body ? (
            <p className="mt-4 text-base leading-relaxed text-muted-foreground">{heading.body}</p>
          ) : null}

          <ul className="mt-8 max-h-136 space-y-1.5 overflow-y-auto pr-1 lg:max-h-120">
            {images.map((image, i) => (
              <li key={image.src + i}>
                <button
                  type="button"
                  onClick={() => setActive(i)}
                  aria-current={i === active}
                  className={cn(
                    "group relative flex w-full cursor-pointer items-center gap-4 overflow-hidden rounded-xl py-2.5 pl-4 pr-3 text-left transition-all duration-200 ease-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                    i === active ? "bg-accent shadow-sm" : "hover:bg-accent/60",
                  )}
                >
                  <span
                    aria-hidden
                    className={cn(
                      "absolute inset-y-2 left-0 w-1 rounded-full bg-primary transition-opacity duration-200",
                      i === active ? "opacity-100" : "opacity-0",
                    )}
                  />
                  <span
                    className={cn(
                      "w-6 shrink-0 font-display text-lg font-bold tracking-tight transition-colors duration-200",
                      i === active ? "text-primary" : "text-muted-foreground/50 group-hover:text-muted-foreground",
                    )}
                  >
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span className="overflow-hidden rounded-lg border border-border shadow-sm">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={image.src}
                      alt=""
                      aria-hidden
                      width={160}
                      height={120}
                      loading="lazy"
                      decoding="async"
                      className={cn(
                        "size-14 object-cover transition duration-300 ease-out group-hover:scale-105",
                        i === active ? "opacity-100" : "opacity-70",
                      )}
                    />
                  </span>
                  <span
                    className={cn(
                      "min-w-0 flex-1 text-sm leading-snug",
                      i === active ? "font-semibold text-foreground" : "text-muted-foreground",
                    )}
                  >
                    {image.alt}
                  </span>
                </button>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
