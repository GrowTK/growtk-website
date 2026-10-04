import { Icon } from "@/components/sections/icon";
import { Reveal, RevealGroup, RevealItem } from "@/components/magic/reveal";
import { Wash, type WashName } from "@/components/sections/company/wash";
import type { Feature, SectionHeading } from "@/content/types";

const STEP_WASH: WashName[] = ["lilac", "peach", "sunset"];

/**
 * "What happens next" as a timeline: three numbered stops on one dashed line,
 * each on its own wash, so sending the form reads as
 * step one of three rather than a message into the void.
 */
export function ContactSteps({ heading, items }: { heading: SectionHeading; items: Feature[] }) {
  return (
    <section className="bg-background pt-20 lg:pt-28">
      <div className="mx-auto max-w-7xl px-6">
        <Reveal className="mx-auto max-w-2xl text-center">
          {heading.eyebrow ? <p className="eyebrow text-primary">{heading.eyebrow}</p> : null}
          <h2 className="mt-3 font-display text-4xl leading-[1.05] font-bold tracking-tight text-balance text-foreground sm:text-5xl">{heading.title}</h2>
          {heading.body ? <p className="mt-5 text-lg leading-relaxed text-muted-foreground">{heading.body}</p> : null}
        </Reveal>

        <RevealGroup stagger={0.08} className="relative mt-14 grid gap-10 md:grid-cols-3 md:gap-6">
          <span aria-hidden className="absolute top-8 right-[16%] left-[16%] hidden border-t-2 border-dashed border-border md:block" />
          {items.map((item, i) => (
            <RevealItem key={item.title} className="relative flex flex-col items-center text-center">
              <span className="relative flex size-16 items-center justify-center rounded-md text-[#26262a] shadow-[0_10px_30px_rgba(0,0,0,.08)]">
                <span aria-hidden className="absolute inset-0 isolate overflow-hidden rounded-md">
                  <Wash name={STEP_WASH[i % STEP_WASH.length]!} />
                </span>
                <Icon name={item.icon} className="relative size-7" strokeWidth={1.75} />
                <span className="absolute -top-2 -right-2 flex size-6 items-center justify-center rounded-sm bg-[#26262a] font-mono text-[11px] font-semibold text-white tabular-nums">
                  {i + 1}
                </span>
              </span>
              <h3 className="mt-6 font-display text-2xl font-bold tracking-tight text-foreground">{item.title}</h3>
              <p className="mt-2 max-w-xs text-base leading-relaxed text-muted-foreground">{item.body}</p>
            </RevealItem>
          ))}
        </RevealGroup>
      </div>
    </section>
  );
}
