"use client";

import * as React from "react";
import Link from "next/link";
import { ArrowUpRight, Check, Globe, Mic, Plug, Puzzle, Search, Workflow, type LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { Reveal } from "@/components/magic/reveal";
import { TradeFigure } from "@/components/sections/industries/trade-figure";
import { IsoGrid } from "@/components/sections/industries/iso-grid";
import { toneGradient } from "@/components/sections/industries/industry-tones";
import { Wash, washTone, type WashName } from "@/components/sections/company/wash";
import type { ServiceItem } from "@/content/services";
import type { SectionHeading } from "@/content/types";

/** Each service's icon and the Hairline figure (service-figures.ts) that acts it out. */
const SERVICE_ART: Record<ServiceItem["id"], { icon: LucideIcon; figure: string }> = {
  "website-redesign": { icon: Globe, figure: "site" },
  seo: { icon: Search, figure: "rank" },
  widgets: { icon: Puzzle, figure: "estimate" },
  automation: { icon: Workflow, figure: "schedule" },
  "voice-agents": { icon: Mic, figure: "voice" },
  integrations: { icon: Plug, figure: "connect" },
};

/** Each row's colour, in order, so the six services never sit on the same wash twice in a row. */
const ROW_WASH: WashName[] = ["lilac", "apricot", "peach", "sunset", "lilac", "apricot"];

/**
 * The six services as alternating rows (copy left and figure right, then
 * flipped), with a sticky pill bar above them that tracks which service is on
 * screen and jumps to any of them. Each row keeps its /services#<id> anchor,
 * so footer and industry-page links land on it.
 */
export function ServiceRows({ heading, items, labels }: {
  heading: SectionHeading;
  items: ServiceItem[];
  labels: { jump: string; included: string; ask: string };
}) {
  const [active, setActive] = React.useState(items[0]?.id);
  const rows = React.useRef<(HTMLElement | null)[]>([]);

  React.useEffect(() => {
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) if (e.isIntersecting) setActive((e.target as HTMLElement).id as ServiceItem["id"]);
      },
      { rootMargin: "-40% 0px -55% 0px" },
    );
    rows.current.forEach((el) => el && io.observe(el));
    return () => io.disconnect();
  }, [items.length]);

  return (
    <section className="bg-background pt-16 lg:pt-24">
      <div className="mx-auto max-w-7xl px-6">
        <Reveal className="mx-auto max-w-3xl text-center">
          {heading.eyebrow && <p className="eyebrow text-primary">{heading.eyebrow}</p>}
          <h2 className="mt-3 font-display text-4xl leading-[1.05] font-bold tracking-tight text-balance text-foreground sm:text-5xl">{heading.title}</h2>
          {heading.body && <p className="mx-auto mt-5 max-w-2xl text-lg leading-relaxed text-muted-foreground">{heading.body}</p>}
        </Reveal>
      </div>

      {/* Sticky jump bar */}
      <nav aria-label={labels.jump} className="sticky top-24 z-30 mt-10 px-6">
        <div className="mx-auto flex max-w-fit items-center gap-1 overflow-x-auto rounded-md border border-border bg-card/90 p-1.5 shadow-[0_8px_28px_rgba(0,0,0,.07)] backdrop-blur-md [scrollbar-width:none]">
          <span className="hidden shrink-0 px-3 font-mono text-xs font-medium text-muted-foreground sm:inline">{labels.jump}</span>
          {items.map((s, i) => {
            const on = s.id === active;
            const tone = washTone(ROW_WASH[i % ROW_WASH.length]!);
            const { icon: Icon } = SERVICE_ART[s.id];
            return (
              <a
                key={s.id}
                href={`#${s.id}`}
                aria-current={on ? "true" : undefined}
                className={cn(
                  "inline-flex shrink-0 cursor-pointer items-center gap-2 rounded-md px-3 py-2 text-sm font-semibold whitespace-nowrap text-foreground transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                  on ? "" : "hover:bg-muted",
                )}
                style={on ? { background: toneGradient(tone) } : undefined}
              >
                <Icon aria-hidden className="size-4" strokeWidth={1.75} />
                {s.title.split(",")[0]}
              </a>
            );
          })}
        </div>
      </nav>

      <ol className="mx-auto mt-12 flex max-w-7xl flex-col gap-20 px-6 lg:mt-20 lg:gap-32">
        {items.map((s, i) => {
          const flip = i % 2 === 1;
          const { icon: Icon, figure } = SERVICE_ART[s.id];
          const wash = ROW_WASH[i % ROW_WASH.length]!;
          const tone = washTone(wash);
          return (
            <li
              key={s.id}
              id={s.id}
              ref={(el) => {
                rows.current[i] = el;
              }}
              className="grid scroll-mt-44 items-center gap-8 lg:grid-cols-2 lg:gap-16"
            >
              <Reveal y={16} className={cn("order-2", flip ? "lg:order-2" : "lg:order-1")}>
                <div className="flex items-center gap-3">
                  <span className="flex size-11 items-center justify-center rounded-md text-foreground" style={{ background: toneGradient(tone) }}>
                    <Icon aria-hidden className="size-5" strokeWidth={1.75} />
                  </span>
                  <span className="font-mono text-xs font-medium tracking-wide text-muted-foreground">{s.eyebrow}</span>
                </div>
                <h3 className="mt-6 font-display text-3xl leading-[1.08] font-bold tracking-tight text-balance text-foreground sm:text-4xl">{s.title}</h3>
                <p className="mt-5 max-w-xl text-base leading-relaxed text-muted-foreground sm:text-lg">{s.body}</p>

                <div className="mt-8 rounded-md border border-border bg-card p-5">
                  <p className="font-mono text-xs font-medium text-muted-foreground">{labels.included}</p>
                  <ul className="mt-4 grid gap-3">
                    {s.bullets.map((b) => (
                      <li key={b} className="flex gap-3 text-sm leading-relaxed text-foreground">
                        <span className="mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-sm" style={{ backgroundColor: tone.from }}>
                          <Check aria-hidden className="size-3.5" strokeWidth={2.5} />
                        </span>
                        {b}
                      </li>
                    ))}
                  </ul>
                </div>

                <Link
                  href="/contact"
                  className="group/link mt-7 inline-flex cursor-pointer items-center gap-1.5 rounded-md text-sm font-semibold text-foreground underline-offset-4 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                >
                  {labels.ask}
                  <ArrowUpRight aria-hidden className="size-4 transition-transform duration-200 group-hover/link:translate-x-0.5 group-hover/link:-translate-y-0.5" />
                </Link>
              </Reveal>

              <Reveal y={16} delay={0.08} className={cn("order-1", flip ? "lg:order-1" : "lg:order-2")}>
                <div className="relative isolate overflow-hidden rounded-[28px] p-4 sm:p-6">
                  <Wash name={wash} />
                  <div className="relative flex aspect-[5/4] items-center justify-center overflow-hidden rounded-[18px] bg-white shadow-[0_18px_48px_rgba(0,0,0,.10)]">
                    <IsoGrid />
                    <span aria-hidden className="absolute top-5 left-6 font-display text-5xl font-bold tracking-tight text-foreground/10 tabular-nums">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <TradeFigure set="service" name={figure} gradient={{ angle: 0, from: "#ffffff", to: "#ffffff" }} className="relative max-w-[440px] px-6" />
                  </div>
                </div>
              </Reveal>
            </li>
          );
        })}
      </ol>
    </section>
  );
}
