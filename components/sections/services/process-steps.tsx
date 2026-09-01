import { Reveal, RevealGroup, RevealItem } from "@/components/magic/reveal";
import type { SectionHeading, Step } from "@/content/types";

/**
 * A short "how we work" process strip: numbered steps in a row, connected by
 * a hairline rule. Bespoke, since nothing in the catalog renders the Step
 * type as a plain numbered sequence without an icon grid or a dark panel.
 */
export function ProcessSteps({ heading, steps }: { heading: SectionHeading; steps: Step[] }) {
  return (
    <section className="bg-background py-20 lg:py-24">
      <div className="mx-auto max-w-7xl px-6">
        <Reveal className="mx-auto max-w-2xl text-center">
          {heading.eyebrow ? <p className="eyebrow text-primary">{heading.eyebrow}</p> : null}
          <h2 className="mt-3 font-display text-4xl font-bold tracking-tight text-balance text-foreground sm:text-5xl">
            {heading.title}
          </h2>
          {heading.body ? <p className="mt-4 text-lg leading-relaxed text-muted-foreground">{heading.body}</p> : null}
        </Reveal>

        <RevealGroup className="relative mt-16 grid gap-10 sm:grid-cols-2 lg:grid-cols-4 lg:gap-8">
          <div aria-hidden className="absolute inset-x-0 top-6 hidden border-t border-dashed border-border lg:block" />
          {steps.map((step) => (
            <RevealItem key={step.n} className="relative">
              <span className="relative z-10 grid size-12 place-items-center rounded-full border border-border bg-card font-display text-lg font-bold text-primary">
                {String(step.n).padStart(2, "0")}
              </span>
              <h3 className="mt-5 font-display text-lg font-semibold tracking-tight text-foreground">{step.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{step.body}</p>
            </RevealItem>
          ))}
        </RevealGroup>
      </div>
    </section>
  );
}
