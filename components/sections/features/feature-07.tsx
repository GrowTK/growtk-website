import { ArrowRight } from "lucide-react";
import { Reveal, RevealGroup, RevealItem } from "@/components/magic/reveal";
import type { Cta, Feature, SectionHeading } from "@/content/types";

/**
 * A split header, title left, supporting copy and a CTA bottom-right, above a
 * plain grid of numbered cards rather than icon-led ones. Best for a short
 * list of concrete offerings or guarantees that should read as a numbered
 * index, not a decorated feature grid.
 */
export function Feature07({ heading, cta, features }: { heading: SectionHeading; cta?: Cta; features: Feature[] }) {
  return (
    <section className="bg-background py-20 lg:py-28">
      <div className="mx-auto max-w-7xl px-6">
        <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
          <Reveal className="max-w-xl">
            {heading.eyebrow ? <p className="eyebrow text-primary">{heading.eyebrow}</p> : null}
            <h2 className="mt-3 font-display text-4xl font-bold tracking-tight text-balance text-foreground sm:text-5xl">
              {heading.title}
            </h2>
          </Reveal>
          <Reveal delay={0.1} className="max-w-sm lg:text-right">
            {heading.body ? <p className="text-base leading-relaxed text-muted-foreground">{heading.body}</p> : null}
            {cta ? (
              <a
                href={cta.href}
                className="group mt-5 inline-flex cursor-pointer items-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground transition duration-200 ease-out hover:-translate-y-0.5 hover:shadow-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                {cta.label}
                <ArrowRight aria-hidden className="size-4 transition-transform duration-200 ease-out group-hover:translate-x-0.5" />
              </a>
            ) : null}
          </Reveal>
        </div>

        <RevealGroup className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((f, i) => (
            <RevealItem key={f.title} className="rounded-2xl border border-border bg-card p-7 transition-shadow duration-300 hover:shadow-md">
              <p className="font-mono text-sm text-primary">{String(i + 1).padStart(2, "0")}/</p>
              <h3 className="mt-4 font-display text-lg font-semibold tracking-tight text-foreground">{f.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{f.body}</p>
            </RevealItem>
          ))}
        </RevealGroup>
      </div>
    </section>
  );
}
