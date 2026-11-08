import type { ReactNode } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Reveal } from "@/components/magic/reveal";
import { ToneBackdrop } from "@/components/sections/industries/tone-backdrop";
import { toneGradient, type IndustryTone } from "@/components/sections/industries/industry-tones";
import type { Cta, SectionHeading, Stat } from "@/content/types";
import { cn } from "@/lib/utils";

/**
 * Two more hero shapes for service and industry pages, so pages that share
 * a template still open differently. "Center": headline centered on a white
 * panel with the live visual large beneath it, stats either side. "Dark": a
 * charcoal panel, copy left in white, the visual right on the page's pastel.
 */

function Buttons({ ctas, dark = false, center = false }: { ctas: Cta[]; dark?: boolean; center?: boolean }) {
  return (
    <div className={cn("mt-9 flex flex-wrap items-center gap-4", center && "justify-center")}>
      {ctas.map((cta, i) => (
        <Link
          key={cta.label}
          href={cta.href}
          className={cn(
            "group inline-flex cursor-pointer items-center gap-2 rounded-full px-7 py-4 text-sm font-semibold transition duration-200 ease-out focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none",
            i === 0
              ? dark
                ? "bg-[#FFDE59] text-[#26262a] hover:-translate-y-0.5 hover:shadow-xl focus-visible:ring-[#FFDE59] focus-visible:ring-offset-[#1A1A1A]"
                : "bg-[#26262a] text-white hover:-translate-y-0.5 hover:shadow-xl focus-visible:ring-[#26262a]"
              : dark
                ? "border border-white/20 text-white hover:bg-white/10 focus-visible:ring-white focus-visible:ring-offset-[#1A1A1A]"
                : "border border-border text-[#26262a] hover:bg-accent focus-visible:ring-[#26262a]",
          )}
        >
          {cta.label}
          {i === 0 ? <ArrowRight aria-hidden className="size-4 transition-transform duration-200 group-hover:translate-x-0.5" /> : null}
        </Link>
      ))}
    </div>
  );
}

export function ServiceHeroCenter({ heading, ctas, stats = [], tone, visual }: { heading: SectionHeading; ctas: Cta[]; stats?: Stat[]; tone: IndustryTone; visual: ReactNode }) {
  return (
    <section data-nav-theme="light" className="relative isolate overflow-hidden" style={{ backgroundImage: toneGradient(tone) }}>
      <ToneBackdrop tone={tone} />
      <div className="relative mx-auto max-w-7xl px-6 py-10 sm:px-10">
        <div className="overflow-hidden rounded-2xl bg-white shadow-2xl">
          <Reveal className="mx-auto max-w-4xl px-6 pt-14 text-center sm:pt-20">
            {heading.eyebrow ? <p className="eyebrow text-[#26262a]/70">{heading.eyebrow}</p> : null}
            <h1 className="mt-5 font-display text-5xl font-bold leading-[0.98] tracking-tight text-balance text-[#26262a] sm:text-6xl lg:text-7xl">{heading.title}</h1>
            {heading.body ? <p className="mx-auto mt-6 max-w-2xl text-base leading-relaxed text-muted-foreground sm:text-lg">{heading.body}</p> : null}
            <Buttons ctas={ctas} center />
          </Reveal>
          <div className="relative mt-14 grid items-end gap-6 px-6 pb-0 sm:px-10 lg:grid-cols-[1fr_minmax(0,34rem)_1fr]">
            <div aria-hidden className="absolute inset-x-0 bottom-0 h-2/3" style={{ backgroundImage: `linear-gradient(180deg, transparent, ${tone.to} 60%, ${tone.from})` }} />
            <StatColumn stats={stats.slice(0, Math.ceil(stats.length / 2))} align="right" />
            <Reveal delay={0.15} y={40} className="relative translate-y-6">
              {visual}
            </Reveal>
            <StatColumn stats={stats.slice(Math.ceil(stats.length / 2))} align="left" />
          </div>
        </div>
      </div>
    </section>
  );
}

function StatColumn({ stats, align }: { stats: Stat[]; align: "left" | "right" }) {
  if (!stats.length) return <div className="hidden lg:block" />;
  return (
    <dl className={cn("relative hidden gap-6 pb-16 lg:grid", align === "right" ? "text-right" : "text-left")}>
      {stats.map((s) => (
        <div key={s.label}>
          <dt className="sr-only">{s.label}</dt>
          <dd className="font-display text-4xl font-bold tracking-tight text-[#26262a]">{s.value}</dd>
          <dd className="mt-1 text-sm text-[#26262a]/70">{s.label}</dd>
        </div>
      ))}
    </dl>
  );
}

export function ServiceHeroDark({ heading, ctas, stats = [], tone, visual }: { heading: SectionHeading; ctas: Cta[]; stats?: Stat[]; tone: IndustryTone; visual: ReactNode }) {
  return (
    <section data-nav-theme="light" className="relative isolate bg-background px-4 py-6 sm:px-6">
      <div className="relative mx-auto grid max-w-7xl overflow-hidden rounded-[2rem] bg-[#1A1A1A] lg:min-h-[calc(100vh-140px)] lg:grid-cols-[1.05fr_1fr]">
        <div aria-hidden className="pointer-events-none absolute -left-40 -top-40 size-[34rem] rounded-full blur-3xl" style={{ backgroundColor: `${tone.from}22` }} />
        <Reveal className="relative flex min-w-0 flex-col justify-center px-6 py-14 sm:px-12 lg:py-20 lg:pl-16">
          {heading.eyebrow ? <p className="eyebrow" style={{ color: tone.from }}>{heading.eyebrow}</p> : null}
          <h1 className="mt-5 font-display text-5xl font-bold leading-[0.98] tracking-tight text-balance text-white sm:text-6xl">{heading.title}</h1>
          {heading.body ? <p className="mt-6 max-w-xl text-base leading-relaxed text-white/65 sm:text-lg">{heading.body}</p> : null}
          <Buttons ctas={ctas} dark />
          {stats.length ? (
            <dl className="mt-12 grid max-w-xl grid-cols-3 gap-2 sm:gap-4">
              {stats.map((s) => (
                <div key={s.label} className="min-w-0 rounded-2xl bg-white/[0.06] p-3 sm:p-4">
                  <dt className="sr-only">{s.label}</dt>
                  <dd className="font-display text-xl font-bold tracking-tight text-white sm:text-3xl">{s.value}</dd>
                  <dd className="mt-1 text-[11px] leading-snug break-words text-white/55 sm:text-xs">{s.label}</dd>
                </div>
              ))}
            </dl>
          ) : null}
        </Reveal>
        <div className="relative flex items-center justify-center p-6 sm:p-10" style={{ backgroundImage: toneGradient(tone) }}>
          <div aria-hidden className="absolute inset-0 opacity-[0.35] [background-image:radial-gradient(rgb(38_38_42/0.18)_1px,transparent_1px)] [background-size:18px_18px]" />
          <Reveal delay={0.15} y={30} className="relative w-full max-w-lg">
            {visual}
          </Reveal>
        </div>
      </div>
    </section>
  );
}
