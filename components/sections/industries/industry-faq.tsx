"use client";

import * as React from "react";
import { ArrowRight, Mail, MessageCircleQuestion, Plus } from "lucide-react";
import { cn } from "@/lib/utils";
import { Reveal } from "@/components/magic/reveal";
import { toneGradient, type IndustryTone } from "@/components/sections/industries/industry-tones";
import { industryPageLabels } from "@/content/industries";
import { brand } from "@/brand.config";
import type { Cta, FaqItem, SectionHeading } from "@/content/types";

/**
 * Sticky intro on the left (heading, count, and a "still have a question"
 * card with the call to action), the questions on the right as white cards,
 * one open at a time. Closed answers stay in the HTML (collapsed with a grid
 * row, not unmounted), so search engines and find-in-page still see them.
 */
export function IndustryFaq({ heading, items, cta, tone, helpBackdrop }: {
  heading: SectionHeading;
  items: FaqItem[];
  cta?: Cta;
  tone: IndustryTone;
  /** Replaces the tone gradient behind the "still have a question" card (e.g. a Wash). */
  helpBackdrop?: React.ReactNode;
}) {
  const [open, setOpen] = React.useState(0);
  const baseId = React.useId();
  const labels = industryPageLabels.faq;

  return (
    <section className="bg-background py-16 lg:py-24">
      <div className="mx-auto grid max-w-7xl gap-12 px-6 lg:grid-cols-[minmax(0,26rem)_minmax(0,1fr)] lg:gap-16">
        <div className="lg:sticky lg:top-24 lg:self-start">
          <Reveal>
            {heading.eyebrow && <p className="eyebrow text-primary">{heading.eyebrow}</p>}
            <h2 className="mt-3 font-display text-4xl leading-[1.05] font-bold tracking-tight text-balance text-foreground sm:text-5xl">{heading.title}</h2>
            <p className="mt-5 text-lg leading-relaxed text-muted-foreground">{heading.body ?? labels.body}</p>
            <p className="mt-6 inline-flex items-center gap-2 font-mono text-xs font-medium tracking-wide text-muted-foreground">
              <span aria-hidden className="size-2 rounded-full" style={{ backgroundColor: tone.from }} />
              {labels.count.replace("{n}", String(items.length))}
            </p>
          </Reveal>

          {cta && (
            <Reveal delay={0.08} className="mt-8">
              <div className="relative isolate overflow-hidden rounded-md p-6" style={helpBackdrop ? undefined : { background: toneGradient(tone) }}>
                {helpBackdrop}
                <span className="flex size-10 items-center justify-center rounded-md bg-card text-foreground">
                  <MessageCircleQuestion aria-hidden className="size-5" strokeWidth={1.75} />
                </span>
                <p className="mt-4 font-display text-xl font-bold tracking-tight text-foreground">{labels.help.title}</p>
                <p className="mt-2 text-sm leading-relaxed text-foreground/80">{labels.help.body}</p>
                <a
                  href={cta.href}
                  className="group mt-6 flex w-full cursor-pointer items-center justify-between gap-3 rounded-md bg-foreground py-2 pr-2 pl-5 text-sm font-semibold text-background transition duration-200 ease-out hover:-translate-y-0.5 hover:shadow-[0_10px_28px_rgba(0,0,0,.18)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                >
                  <span className="text-left">{cta.label}</span>
                  <span className="flex size-9 shrink-0 items-center justify-center rounded-md bg-background text-foreground">
                    <ArrowRight aria-hidden className="size-4 transition-transform duration-200 group-hover:translate-x-0.5" />
                  </span>
                </a>
                {brand.contact.email && (
                  <a
                    href={`mailto:${brand.contact.email}`}
                    className="mt-4 inline-flex cursor-pointer items-center gap-2 rounded-sm text-sm font-medium text-foreground underline-offset-4 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  >
                    <Mail aria-hidden className="size-4" strokeWidth={1.75} />
                    {labels.help.email}: {brand.contact.email}
                  </a>
                )}
              </div>
            </Reveal>
          )}
        </div>

        <ol className="flex flex-col gap-3">
          {items.map((item, i) => {
            const on = open === i;
            const qId = `${baseId}-q-${i}`;
            const aId = `${baseId}-a-${i}`;
            return (
              <Reveal key={item.q} as="li" delay={i * 0.06}>
                <div
                  className={cn(
                    "rounded-md border bg-card transition-[border-color,box-shadow] duration-300",
                    on ? "border-foreground/15 shadow-[0_12px_36px_rgba(0,0,0,.08)]" : "border-border shadow-[0_1px_2px_rgba(0,0,0,.04)] hover:border-foreground/20",
                  )}
                >
                  <h3>
                    <button
                      id={qId}
                      type="button"
                      aria-expanded={on}
                      aria-controls={aId}
                      onClick={() => setOpen(on ? -1 : i)}
                      className="flex w-full cursor-pointer items-center gap-4 rounded-md px-5 py-5 text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring sm:px-6"
                    >
                      <span
                        className={cn("flex size-9 shrink-0 items-center justify-center rounded-md text-xs font-semibold tabular-nums transition-colors", on ? "text-foreground" : "bg-muted text-foreground")}
                        style={on ? { backgroundColor: tone.from } : undefined}
                      >
                        {String(i + 1).padStart(2, "0")}
                      </span>
                      <span className="flex-1 font-display text-lg leading-snug font-semibold tracking-tight text-foreground sm:text-xl">{item.q}</span>
                      <span
                        aria-hidden
                        className={cn(
                          "flex size-8 shrink-0 items-center justify-center rounded-md border transition-[transform,background-color,border-color] duration-300",
                          on ? "rotate-45 border-foreground bg-foreground text-background" : "border-border text-foreground",
                        )}
                      >
                        <Plus className="size-4" />
                      </span>
                    </button>
                  </h3>
                  <div
                    id={aId}
                    role="region"
                    aria-labelledby={qId}
                    className={cn("grid transition-[grid-template-rows] duration-300 ease-out", on ? "grid-rows-[1fr]" : "grid-rows-[0fr]")}
                  >
                    <div className="overflow-hidden">
                      <p className="max-w-2xl px-5 pb-6 pl-[4.25rem] text-base leading-relaxed text-muted-foreground sm:px-6 sm:pl-[4.75rem]">{item.a}</p>
                    </div>
                  </div>
                </div>
              </Reveal>
            );
          })}
        </ol>
      </div>
    </section>
  );
}
