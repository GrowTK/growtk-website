import Link from "next/link";
import { ArrowRight, Check } from "lucide-react";
import { Icon } from "@/components/sections/icon";
import { Reveal } from "@/components/magic/reveal";
import type { Cta, SectionHeading } from "@/content/types";
import { cn } from "@/lib/utils";

export type OperatingModel = { icon: string; name: string; body: string; points: string[]; bestFor: string };

/**
 * How the work splits between AI agents and people. Three models side by
 * side, the middle one featured on charcoal, with one pricing line under them
 * that quotes only the published starting price.
 */
export function OperatingModels({ heading, items, footnote, cta }: { heading: SectionHeading; items: OperatingModel[]; footnote: string; cta: Cta }) {
  return (
    <section className="bg-background px-6 py-20 sm:px-10 lg:py-28">
      <div className="mx-auto max-w-7xl">
        <Reveal className="max-w-3xl">
          {heading.eyebrow ? <p className="eyebrow text-primary">{heading.eyebrow}</p> : null}
          <h2 className="mt-4 font-display text-4xl font-bold tracking-tight text-balance text-foreground sm:text-5xl">{heading.title}</h2>
          {heading.body ? <p className="mt-5 text-base leading-relaxed text-muted-foreground sm:text-lg">{heading.body}</p> : null}
        </Reveal>
        <div className="mt-14 grid gap-5 lg:grid-cols-3 lg:items-stretch">
          {items.map((m, i) => {
            const featured = i === 1;
            return (
              <Reveal key={m.name} delay={i * 0.06} className="h-full">
                <article
                  className={cn(
                    "flex h-full flex-col rounded-[1.5rem] p-8 lg:p-9",
                    featured ? "bg-[#26262a] text-white lg:-my-4 lg:py-13" : "border border-border bg-card text-foreground",
                  )}
                >
                  <span className={cn("grid size-11 place-items-center rounded-xl", featured ? "bg-[#FFDE59] text-[#26262a]" : "bg-gradient-to-br from-[#FFDE59] to-[#FFF0AD] text-[#26262a]")}>
                    <Icon name={m.icon} className="size-5" />
                  </span>
                  <h3 className="mt-6 font-display text-2xl font-bold tracking-tight">{m.name}</h3>
                  <p className={cn("mt-3 text-sm leading-relaxed", featured ? "text-white/70" : "text-muted-foreground")}>{m.body}</p>
                  <ul className="mt-6 space-y-2.5">
                    {m.points.map((p) => (
                      <li key={p} className="flex items-start gap-2.5 text-sm">
                        <Check aria-hidden className={cn("mt-0.5 size-4 shrink-0", featured ? "text-[#FFDE59]" : "text-foreground")} />
                        {p}
                      </li>
                    ))}
                  </ul>
                  <p className={cn("mt-auto pt-8 text-sm font-semibold", featured ? "text-[#FFDE59]" : "text-foreground")}>{m.bestFor}</p>
                </article>
              </Reveal>
            );
          })}
        </div>
        <Reveal className="mt-12 flex flex-col items-start gap-4 sm:flex-row sm:items-center sm:justify-between">
          <p className="max-w-2xl text-sm leading-relaxed text-muted-foreground">{footnote}</p>
          <Link
            href={cta.href}
            className="group inline-flex shrink-0 cursor-pointer items-center gap-2 rounded-full bg-[#26262a] px-6 py-3.5 text-sm font-semibold text-white transition duration-200 hover:-translate-y-0.5 hover:shadow-xl focus-visible:ring-2 focus-visible:ring-[#26262a] focus-visible:ring-offset-2 focus-visible:outline-none"
          >
            {cta.label}
            <ArrowRight aria-hidden className="size-4 transition-transform duration-200 group-hover:translate-x-0.5" />
          </Link>
        </Reveal>
      </div>
    </section>
  );
}
