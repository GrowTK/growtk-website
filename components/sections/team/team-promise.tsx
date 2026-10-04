import { Icon } from "@/components/sections/icon";
import { Reveal, RevealGroup, RevealItem } from "@/components/magic/reveal";
import { washTone, type WashName } from "@/components/sections/company/wash";
import type { Feature, SectionHeading } from "@/content/types";

const ITEM_WASH: WashName[] = ["lilac", "peach", "apricot"];

/**
 * "No middlemen" spelled out: heading on the left, the promises stacked as
 * numbered white rows on the right, each with a tone icon tile.
 */
export function TeamPromise({ heading, items }: { heading: SectionHeading; items: Feature[] }) {
  return (
    <section className="bg-background pt-24 lg:pt-36">
      <div className="mx-auto grid max-w-7xl gap-10 px-6 lg:grid-cols-[minmax(0,24rem)_minmax(0,1fr)] lg:gap-20">
        <Reveal className="lg:sticky lg:top-28 lg:self-start">
          {heading.eyebrow ? <p className="eyebrow text-primary">{heading.eyebrow}</p> : null}
          <h2 className="mt-3 font-display text-4xl leading-[1.05] font-bold tracking-tight text-balance text-foreground sm:text-5xl">{heading.title}</h2>
        </Reveal>
        <RevealGroup stagger={0.07} className="flex flex-col gap-3">
          {items.map((item, i) => (
            <RevealItem key={item.title}>
              <div className="flex gap-5 rounded-md border border-border bg-card p-6 sm:p-7">
                <span className="flex size-12 shrink-0 items-center justify-center rounded-md text-[#26262a]" style={{ backgroundColor: washTone(ITEM_WASH[i % ITEM_WASH.length]!).from }}>
                  <Icon name={item.icon} className="size-6" strokeWidth={1.75} />
                </span>
                <div className="flex-1">
                  <h3 className="font-display text-xl font-bold tracking-tight text-foreground sm:text-2xl">{item.title}</h3>
                  <p className="mt-2 text-base leading-relaxed text-muted-foreground">{item.body}</p>
                </div>
                <span className="hidden font-mono text-xs font-medium text-muted-foreground tabular-nums sm:block">{String(i + 1).padStart(2, "0")}</span>
              </div>
            </RevealItem>
          ))}
        </RevealGroup>
      </div>
    </section>
  );
}
