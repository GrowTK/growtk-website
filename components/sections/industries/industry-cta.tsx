import type { ReactNode } from "react";
import { ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { Reveal } from "@/components/magic/reveal";
import { HeroLeadMachine } from "@/components/sections/hero/hero-lead-machine";
import { IsoGrid } from "@/components/sections/industries/iso-grid";
import { ToneBackdrop } from "@/components/sections/industries/tone-backdrop";
import { toneGradient, type IndustryTone } from "@/components/sections/industries/industry-tones";
import type { Cta, SectionHeading } from "@/content/types";

/**
 * Bespoke closing CTA for industry pages, no photo: a tone panel with grain,
 * the ask on the left, and on the right the live lead machine (a call rings,
 * the lead is coloured by automation, books a day, prints a receipt) on a
 * white plate over a hairline grid. It shows what the button buys.
 */
export function IndustryCta({ heading, primary, tone, figureLabel, backdrop, light = false }: {
  heading: SectionHeading;
  primary?: Cta;
  tone: IndustryTone;
  figureLabel: string;
  /** Replaces the tone gradient behind the panel (e.g. a light Wash; the copy sits on it directly). */
  backdrop?: ReactNode;
  /** White copy and a white button, for a darker backdrop. */
  light?: boolean;
}) {
  return (
    <section className="bg-background px-6 py-20 lg:py-28">
      <div
        className="relative isolate mx-auto grid max-w-7xl items-center gap-10 overflow-hidden rounded-3xl p-8 sm:p-12 lg:grid-cols-[1.1fr_1fr] lg:p-16"
        style={backdrop ? undefined : { backgroundImage: toneGradient(tone) }}
      >
        {backdrop ?? <ToneBackdrop tone={tone} />}
        <Reveal className={light ? "text-white" : "text-[#26262a]"}>
          {heading.eyebrow ? <p className={cn("eyebrow", light ? "text-white/80" : "text-[#26262a]/70")}>{heading.eyebrow}</p> : null}
          <h2 className="mt-4 font-display text-4xl font-bold leading-[0.98] tracking-tight text-balance sm:text-5xl lg:text-6xl">{heading.title}</h2>
          {heading.body ? <p className={cn("mt-6 max-w-lg text-lg leading-relaxed", light ? "text-white/90" : "text-[#26262a]/80")}>{heading.body}</p> : null}
          {primary ? (
            <a
              href={primary.href}
              className={cn(
                "group mt-10 inline-flex cursor-pointer items-center gap-3 rounded-full px-8 py-4 font-display text-base font-bold tracking-tight transition duration-200 ease-out hover:-translate-y-1 hover:shadow-2xl focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none",
                light ? "bg-white text-[#26262a] focus-visible:ring-white" : "bg-[#26262a] text-white focus-visible:ring-[#26262a]",
              )}
            >
              {primary.label}
              <ArrowRight aria-hidden className="size-5 transition-transform duration-200 ease-out group-hover:translate-x-1" />
            </a>
          ) : null}
        </Reveal>
        <div className="relative h-[26rem] overflow-hidden rounded-2xl bg-white shadow-xl sm:h-[30rem]">
          <IsoGrid />
          <HeroLeadMachine label={figureLabel} className="relative p-4" />
        </div>
      </div>
    </section>
  );
}
