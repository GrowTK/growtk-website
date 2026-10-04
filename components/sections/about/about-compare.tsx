import { Check, Minus } from "lucide-react";
import { cn } from "@/lib/utils";
import { Reveal, RevealGroup, RevealItem } from "@/components/magic/reveal";
import type { SectionHeading } from "@/content/types";

type Column = { name: string; featured?: boolean; cells: string[] };

/**
 * Three options side by side, read row by row. The two alternatives are quiet
 * white columns; Growtk's column is set apart
 * on a flat lilac surface. All three share one height.
 * Each cell repeats its row label so the columns still read when stacked on
 * a phone.
 */
export function AboutCompare({ heading, rows, columns }: {
  heading: SectionHeading;
  rows: string[];
  columns: Column[];
}) {
  return (
    <section className="bg-background pt-24 lg:pt-36">
      <div className="mx-auto max-w-7xl px-6">
        <Reveal className="max-w-3xl">
          {heading.eyebrow ? <p className="eyebrow text-primary">{heading.eyebrow}</p> : null}
          <h2 className="mt-3 font-display text-4xl leading-[1.05] font-bold tracking-tight text-balance text-foreground sm:text-5xl">{heading.title}</h2>
          {heading.body ? <p className="mt-5 max-w-2xl text-lg leading-relaxed text-muted-foreground">{heading.body}</p> : null}
        </Reveal>

        <RevealGroup stagger={0.08} className="mt-12 grid items-stretch gap-4 lg:grid-cols-3">
          {columns.map((col) => (
            <RevealItem key={col.name} className="h-full">
              <div
                className={cn(
                  "h-full rounded-md p-6 sm:p-8",
                  col.featured ? "bg-[#F2C4FF] shadow-[0_24px_60px_rgba(0,0,0,.12)]" : "border border-border bg-card",
                )}
              >
                <p className={cn("font-display text-2xl font-bold tracking-tight text-foreground", !col.featured && "text-foreground/70")}>{col.name}</p>
                <dl className="mt-6 grid gap-5">
                  {rows.map((row, r) => (
                    <div key={row} className="flex gap-3">
                      <span
                        aria-hidden
                        className={cn("mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-sm", col.featured ? "bg-[#26262a] text-white" : "bg-muted text-muted-foreground")}
                      >
                        {col.featured ? <Check className="size-3.5" strokeWidth={2.5} /> : <Minus className="size-3.5" strokeWidth={2.5} />}
                      </span>
                      <div>
                        <dt className="font-mono text-xs font-medium text-foreground/60">{row}</dt>
                        <dd className={cn("mt-1 text-base leading-snug", col.featured ? "font-semibold text-foreground" : "text-foreground/80")}>{col.cells[r]}</dd>
                      </div>
                    </div>
                  ))}
                </dl>
              </div>
            </RevealItem>
          ))}
        </RevealGroup>
      </div>
    </section>
  );
}
