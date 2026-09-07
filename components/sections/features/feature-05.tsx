"use client";
import { useCallback, useState } from "react";
import { ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";
import { Icon } from "@/components/sections/icon";
import { cn } from "@/lib/utils";
import type { Cta, Feature, SectionHeading } from "@/content/types";

export type TabItem = Feature & {
  /** Short label for the sliver strip; falls back to the title. */
  tab?: string;
  bullets?: string[];
  meta?: string;
  cta?: Cta;
};

/**
 * Filmstrip selector: one card is wide and fully readable, the rest collapse
 * into narrow slivers you can click (or step through with the arrows) to
 * bring into focus. On narrow screens every card is simply an equal-width
 * card in a horizontal scroller, since there is no room for a sliver strip
 * on a phone.
 */
export function Feature05({ heading, features }: {
  heading: SectionHeading;
  features: TabItem[];
}) {
  const [active, setActive] = useState(0);
  const last = features.length - 1;

  const step = useCallback((dir: 1 | -1) => {
    setActive((n) => (n + dir + features.length) % features.length);
  }, [features.length]);

  return (
    <section className="border-b border-border bg-background py-20">
      <div className="mx-auto max-w-7xl px-6">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <div className="max-w-2xl">
            {heading.eyebrow ? <p className="eyebrow text-primary">{heading.eyebrow}</p> : null}
            <h2 className="mt-3 font-display text-4xl font-bold tracking-tight text-balance text-foreground sm:text-5xl">{heading.title}</h2>
            {heading.body ? <p className="mt-4 text-lg leading-relaxed text-muted-foreground">{heading.body}</p> : null}
          </div>
          <div className="flex shrink-0 gap-2">
            <button
              type="button"
              aria-label="Previous service"
              onClick={() => step(-1)}
              className="grid size-11 cursor-pointer place-items-center rounded-full border border-border bg-card text-foreground transition-colors hover:bg-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              <ChevronLeft className="size-5" />
            </button>
            <button
              type="button"
              aria-label="Next service"
              onClick={() => step(1)}
              className="grid size-11 cursor-pointer place-items-center rounded-full border border-border bg-card text-foreground transition-colors hover:bg-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              <ChevronRight className="size-5" />
            </button>
          </div>
        </div>

        <div
          role="tablist"
          aria-label={heading.title}
          className="mt-12 flex gap-3 overflow-x-auto pb-2 [-ms-overflow-style:none] [scrollbar-width:none] lg:overflow-hidden lg:pb-0 [&::-webkit-scrollbar]:hidden"
        >
          {features.map((f, i) => {
            const on = i === active;
            return (
              <button
                key={f.title}
                type="button"
                role="tab"
                aria-selected={on}
                aria-label={f.tab ?? f.title}
                onClick={() => setActive(i)}
                className={cn(
                  "group relative isolate h-112 shrink-0 cursor-pointer overflow-hidden rounded-lg border border-black/6 text-left transition-[flex-grow] duration-500 ease-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring sm:h-136 lg:h-152",
                  "w-[78%] sm:w-[52%]",
                  on ? "lg:w-auto lg:flex-1" : "lg:w-24 lg:shrink-0 lg:flex-none",
                )}
              >
                {f.image ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={f.image.src}
                    alt=""
                    loading={i === 0 ? "eager" : "lazy"}
                    decoding="async"
                    className="absolute inset-0 -z-20 size-full object-cover transition-transform duration-500 ease-out group-hover:scale-105"
                  />
                ) : null}
                <div aria-hidden className="absolute inset-0 -z-10 bg-gradient-to-t from-black/85 via-black/35 to-black/10" />

                {/* Full content: always on mobile/tablet, only the active card on desktop. */}
                <div className={cn("relative flex h-full flex-col justify-end p-6", !on && "lg:hidden")}>
                  <div className="flex items-center gap-3">
                    {f.icon ? (
                      <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-white/15 text-white backdrop-blur-md">
                        <Icon name={f.icon} className="size-5" />
                      </span>
                    ) : null}
                    {f.meta ? <p className="eyebrow text-white/70">{f.meta}</p> : null}
                  </div>
                  <h3 className="mt-4 font-display text-2xl font-bold tracking-tight text-balance text-white">{f.title}</h3>
                  <p className="mt-2 max-w-md text-sm leading-relaxed text-white/80">{f.body}</p>
                  {f.cta ? (
                    <a
                      href={f.cta.href}
                      onClick={(e) => e.stopPropagation()}
                      className="group/cta mt-5 inline-flex w-fit cursor-pointer items-center gap-2 rounded-full bg-white px-5 py-2.5 text-sm font-semibold text-foreground transition duration-200 ease-out hover:-translate-y-0.5 hover:shadow-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
                    >
                      {f.cta.label}
                      <ArrowRight aria-hidden className="size-4 transition-transform group-hover/cta:translate-x-0.5" />
                    </a>
                  ) : null}
                </div>

                {/* Sliver label: desktop only, shown when this card is not the active one. */}
                <div className={cn("relative hidden h-full flex-col items-center justify-between p-4", !on && "lg:flex")}>
                  {f.icon ? (
                    <span className="grid size-9 shrink-0 place-items-center rounded-xl bg-white/15 text-white backdrop-blur-md">
                      <Icon name={f.icon} className="size-4" />
                    </span>
                  ) : <span />}
                  <span className="[writing-mode:vertical-rl] rotate-180 text-sm font-semibold tracking-tight text-white">
                    {f.tab ?? f.title}
                  </span>
                </div>
              </button>
            );
          })}
        </div>

        <p className="mt-4 text-sm text-muted-foreground">
          {String(active + 1).padStart(2, "0")} / {String(last + 1).padStart(2, "0")}
        </p>
      </div>
    </section>
  );
}
