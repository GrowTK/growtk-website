import { Reveal, RevealGroup, RevealItem } from "@/components/magic/reveal";
import { Icon } from "@/components/sections/icon";
import type { Feature, SectionHeading } from "@/content/types";

/** Heading beside a plain two column icon list. No cards, no dividers, no numbers. */
export function Feature06({ heading, features }: { heading: SectionHeading; features: Feature[] }) {
  return (
    <section className="bg-background py-20 lg:py-28">
      <div className="mx-auto grid max-w-7xl gap-12 px-6 lg:grid-cols-[0.75fr_1.25fr] lg:gap-16">
        <Reveal className="lg:pt-1">
          {heading.eyebrow ? <p className="eyebrow text-primary">{heading.eyebrow}</p> : null}
          <h2 className="mt-3 font-display text-4xl font-bold tracking-tight text-balance text-foreground sm:text-5xl">
            {heading.title}
          </h2>
          {heading.body ? <p className="mt-4 max-w-sm text-base leading-relaxed text-muted-foreground">{heading.body}</p> : null}
        </Reveal>

        <RevealGroup className="grid gap-x-10 gap-y-10 sm:grid-cols-2">
          {features.map((f) => (
            <RevealItem key={f.title} className="flex gap-4">
              <Icon name={f.icon} className="mt-0.5 size-5 shrink-0 text-foreground" />
              <div>
                <h3 className="font-display text-base font-semibold tracking-tight text-foreground">{f.title}</h3>
                <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">{f.body}</p>
              </div>
            </RevealItem>
          ))}
        </RevealGroup>
      </div>
    </section>
  );
}
