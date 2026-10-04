import { cn } from "@/lib/utils";
import { Reveal } from "@/components/magic/reveal";
import { IsoGrid } from "@/components/sections/industries/iso-grid";
import { Wash, type WashName } from "@/components/sections/company/wash";
import type { TeamMember } from "@/content/types";

/** Both founders share one portrait wash so the two rows read as a pair. */
const PORTRAIT_WASH: WashName = "peach";

/**
 * Each founder as an alternating row: a tall tone portrait card (no photos
 * yet, so a large monogram on the hairline grid) on one side, the full bio on
 * the other, opening with its first paragraph as a lead. Flips per founder.
 */
export function FounderProfiles({ members, buildsLabel }: { members: TeamMember[]; buildsLabel: string }) {
  return (
    <section className="bg-background pt-24 lg:pt-36">
      <div className="mx-auto flex max-w-7xl flex-col gap-20 px-6 lg:gap-32">
        {members.map((m, i) => {
          const flip = i % 2 === 1;
          const [lead, ...rest] = m.bio.split("\n\n");
          return (
            <article key={m.name} className="grid items-center gap-10 lg:grid-cols-[minmax(0,0.85fr)_minmax(0,1fr)] lg:gap-20">
              <Reveal y={16} className={cn(flip && "lg:order-2")}>
                <div className="relative isolate overflow-hidden rounded-[28px] p-6 sm:p-8">
                  <Wash name={PORTRAIT_WASH} />
                  <div className="relative flex aspect-[4/5] flex-col justify-between overflow-hidden rounded-md bg-white p-6 sm:p-8">
                    <IsoGrid />
                    <span className="relative font-mono text-xs font-medium text-muted-foreground tabular-nums">{String(i + 1).padStart(2, "0")} / {String(members.length).padStart(2, "0")}</span>
                    <span aria-hidden className="relative self-center font-display text-[9rem] leading-none font-bold tracking-tighter text-[#26262a] sm:text-[11rem]">{m.initials}</span>
                    <div className="relative">
                      <p className="font-display text-2xl font-bold tracking-tight text-foreground">{m.name}</p>
                      <p className="mt-1 text-sm text-muted-foreground">{m.role}</p>
                    </div>
                  </div>
                </div>
              </Reveal>

              <Reveal y={16} delay={0.08} className={cn(flip && "lg:order-1")}>
                <p className="eyebrow text-primary">{m.role}</p>
                <h2 className="mt-3 font-display text-4xl leading-[1.05] font-bold tracking-tight text-balance text-foreground sm:text-5xl">{m.name}</h2>
                {lead ? <p className="mt-6 text-xl leading-relaxed text-foreground">{lead}</p> : null}
                {rest.map((p) => (
                  <p key={p.slice(0, 32)} className="mt-5 text-base leading-relaxed text-muted-foreground sm:text-lg">{p}</p>
                ))}
                {m.skills?.length ? (
                  <div className="mt-8">
                    <p className="font-mono text-xs font-medium text-muted-foreground">{buildsLabel}</p>
                    <ul className="mt-3 flex flex-wrap gap-2">
                      {m.skills.map((s) => (
                        <li key={s} className="rounded-md border border-border bg-card px-3 py-1.5 text-sm font-semibold text-foreground">{s}</li>
                      ))}
                    </ul>
                  </div>
                ) : null}
              </Reveal>
            </article>
          );
        })}
      </div>
    </section>
  );
}
