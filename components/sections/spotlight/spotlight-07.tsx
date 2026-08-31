import { Reveal, RevealGroup, RevealItem } from "@/components/magic/reveal";
import type { Stat } from "@/content/types";

/**
 * A colour band holding a row of stats, nothing else: the multi number
 * sibling to Spotlight01's single big figure. Best when there are three or
 * four real numbers worth a beat of their own between content sections,
 * rather than folded into a hero or feature grid.
 */
export function Spotlight07({ stats }: { stats: Stat[] }) {
  return (
    <section className="relative isolate overflow-hidden bg-brand-gradient py-20 text-primary-foreground">
      {/* Soft ambient depth, not a pattern: a single blurred highlight, static, low opacity. */}
      <div aria-hidden className="pointer-events-none absolute -top-24 -right-24 size-96 rounded-full bg-white/10 blur-3xl" />
      <div aria-hidden className="pointer-events-none absolute -bottom-32 -left-16 size-80 rounded-full bg-black/10 blur-3xl" />
      <Reveal className="relative mx-auto max-w-6xl px-6">
        <RevealGroup className="grid grid-cols-2 gap-8 sm:grid-cols-4 sm:divide-x sm:divide-white/15">
          {stats.map((s) => (
            <RevealItem key={s.label} className="text-center sm:px-4">
              <p className="font-display text-4xl font-bold tracking-tight sm:text-5xl">
                {s.value}
                {s.suffix ?? ""}
              </p>
              <p className="mt-2 text-sm text-primary-foreground/80">{s.label}</p>
            </RevealItem>
          ))}
        </RevealGroup>
      </Reveal>
    </section>
  );
}
