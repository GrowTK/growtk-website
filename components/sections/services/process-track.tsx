import { Reveal, RevealGroup, RevealItem } from "@/components/magic/reveal";
import { Wash, washTone, type WashName } from "@/components/sections/company/wash";
import type { SectionHeading, Step } from "@/content/types";

/** One accent per step, so the track reads as four stops, not one colour. */
const STEP_WASH: WashName[] = ["lilac", "peach", "apricot", "sunset"];

/**
 * "How we work" on the blob animation: the heading on one white card, then
 * the steps as a row of white cards joined by a track, each stop with its own
 * accent. All copy sits on white, never on the moving video.
 */
export function ProcessTrack({ heading, steps }: { heading: SectionHeading; steps: Step[] }) {
  return (
    <section className="bg-background px-6 pt-20 lg:pt-32">
      <div className="relative isolate mx-auto max-w-7xl overflow-hidden rounded-[28px] p-4 sm:p-6 lg:p-8">
        <Wash name="blob" />
        <Reveal className="rounded-[18px] bg-white/95 p-6 backdrop-blur sm:p-10">
          <div className="grid gap-6 lg:grid-cols-2 lg:items-end">
            <div>
              {heading.eyebrow ? <p className="eyebrow text-primary">{heading.eyebrow}</p> : null}
              <h2 className="mt-3 font-display text-4xl leading-[1.05] font-bold tracking-tight text-balance text-foreground sm:text-5xl">{heading.title}</h2>
            </div>
            {heading.body ? <p className="max-w-lg text-lg leading-relaxed text-muted-foreground lg:justify-self-end">{heading.body}</p> : null}
          </div>
        </Reveal>

        <RevealGroup stagger={0.07} className="mt-4 grid gap-4 sm:grid-cols-2 sm:mt-6 lg:grid-cols-4">
          {steps.map((step, i) => {
            const tone = washTone(STEP_WASH[i % STEP_WASH.length]!);
            return (
              <RevealItem key={step.n} className="h-full">
                <div className="flex h-full flex-col rounded-[18px] bg-white p-6 sm:p-7">
                  <div className="flex items-center gap-3">
                    <span className="flex size-10 items-center justify-center rounded-md font-mono text-sm font-semibold text-[#26262a] tabular-nums" style={{ backgroundColor: tone.from }}>
                      {String(step.n).padStart(2, "0")}
                    </span>
                    <span aria-hidden className="h-px flex-1 bg-border" />
                  </div>
                  <h3 className="mt-6 font-display text-2xl font-bold tracking-tight text-foreground">{step.title}</h3>
                  <p className="mt-3 text-base leading-relaxed text-muted-foreground">{step.body}</p>
                </div>
              </RevealItem>
            );
          })}
        </RevealGroup>
      </div>
    </section>
  );
}
