import { Check } from "lucide-react";
import { Reveal } from "@/components/magic/reveal";
import { washTone, type WashName } from "@/components/sections/company/wash";
import type { SectionHeading, TeamMember } from "@/content/types";

/**
 * "How we split the work" as a diagram: each founder's half on either side,
 * what they share in a charcoal block in the middle, joined by hairline
 * connectors. Stacks top to bottom on smaller screens.
 */
export function WorkSplit({ heading, members, shared }: {
  heading: SectionHeading;
  members: TeamMember[];
  shared: { label: string; title: string; items: string[] };
}) {
  const [left, right] = members;

  const accent = washTone("blob");
  const side = (m: TeamMember | undefined, wash: WashName, delay: number) =>
    m ? (
      <Reveal delay={delay} className="h-full">
        <div className="h-full rounded-md border border-border bg-card p-6 sm:p-8">
          <div className="flex items-center gap-4">
            <span className="flex size-14 shrink-0 items-center justify-center rounded-md bg-muted font-display text-xl font-bold tracking-tight text-foreground">
              {m.initials}
            </span>
            <div>
              <p className="font-display text-xl font-bold tracking-tight text-foreground">{m.name}</p>
              <p className="text-sm text-muted-foreground">{m.role}</p>
            </div>
          </div>
          <ul className="mt-6 grid gap-3">
            {m.skills?.map((s) => (
              <li key={s} className="flex items-center gap-3 rounded-md bg-muted px-4 py-3 text-sm font-semibold text-foreground">
                <span className="size-2 shrink-0 rounded-full" style={{ backgroundColor: washTone(wash).from }} />
                {s}
              </li>
            ))}
          </ul>
        </div>
      </Reveal>
    ) : null;

  return (
    <section className="bg-background pt-24 lg:pt-36">
      <div className="mx-auto max-w-7xl px-6">
        <Reveal className="mx-auto max-w-3xl text-center">
          {heading.eyebrow ? <p className="eyebrow text-primary">{heading.eyebrow}</p> : null}
          <h2 className="mt-3 font-display text-4xl leading-[1.05] font-bold tracking-tight text-balance text-foreground sm:text-5xl">{heading.title}</h2>
          {heading.body ? <p className="mx-auto mt-5 max-w-2xl text-lg leading-relaxed text-muted-foreground">{heading.body}</p> : null}
        </Reveal>

        <div className="mt-14 grid items-center gap-4 lg:grid-cols-[1fr_auto_minmax(0,20rem)_auto_1fr] lg:gap-0">
          {side(left, "peach", 0)}
          <span aria-hidden className="mx-auto h-8 w-px bg-border lg:h-px lg:w-10" />
          <Reveal delay={0.08}>
            <div className="relative overflow-hidden rounded-md bg-[#26262a] p-6 text-white sm:p-8">
              <div aria-hidden className="pointer-events-none absolute -top-16 -right-16 size-40 rounded-full opacity-40 blur-2xl" style={{ backgroundColor: accent.from }} />
              <p className="relative font-mono text-xs font-medium" style={{ color: accent.from }}>{shared.label}</p>
              <p className="relative mt-2 font-display text-2xl font-bold tracking-tight">{shared.title}</p>
              <ul className="relative mt-5 grid gap-3">
                {shared.items.map((s) => (
                  <li key={s} className="flex gap-3 text-sm leading-snug text-white/85">
                    <Check aria-hidden className="mt-0.5 size-4 shrink-0" style={{ color: accent.from }} strokeWidth={2.5} />
                    {s}
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>
          <span aria-hidden className="mx-auto h-8 w-px bg-border lg:h-px lg:w-10" />
          {side(right, "lilac", 0.16)}
        </div>
      </div>
    </section>
  );
}
