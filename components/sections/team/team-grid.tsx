import { Reveal, RevealGroup, RevealItem } from "@/components/magic/reveal";
import { cn } from "@/lib/utils";
import type { SectionHeading, TeamMember } from "@/content/types";

/** Two founder cards, side by side on desktop, identical size and treatment. Initials avatar, no stock photo. */
export function TeamGrid({ heading, team = [] }: {
  heading?: SectionHeading;
  team?: TeamMember[];
}) {
  return (
    <section className="bg-background py-24 lg:py-32">
      <div className="mx-auto max-w-6xl px-6">
        {heading ? (
          <Reveal className="mx-auto max-w-2xl text-center">
            {heading.eyebrow ? <p className="eyebrow text-primary">{heading.eyebrow}</p> : null}
            <h2 className="mt-4 font-display text-4xl font-bold leading-[1.05] tracking-tight text-balance text-foreground sm:text-5xl">
              {heading.title}
            </h2>
            {heading.body ? (
              <p className="mt-6 text-lg leading-relaxed text-muted-foreground">{heading.body}</p>
            ) : null}
          </Reveal>
        ) : null}

        <RevealGroup className={cn("grid items-stretch gap-8 md:grid-cols-2", heading && "mt-16")}>
          {team.map((member) => (
            <RevealItem
              key={member.name}
              className="flex h-full flex-col rounded-3xl border border-border bg-card p-8 sm:p-10"
            >
              <div className="flex items-center gap-5">
                <span
                  aria-hidden
                  className="grid size-16 shrink-0 place-items-center rounded-2xl bg-foreground font-display text-xl font-bold text-background"
                >
                  {member.initials}
                </span>
                <div>
                  <h3 className="font-display text-xl font-semibold tracking-tight text-foreground">
                    {member.name}
                  </h3>
                  <p className="mt-1 text-sm font-medium text-muted-foreground">{member.role}</p>
                </div>
              </div>

              <div className="mt-7 space-y-4">
                {member.bio.split("\n\n").map((paragraph) => (
                  <p key={paragraph.slice(0, 24)} className="leading-relaxed text-muted-foreground">
                    {paragraph}
                  </p>
                ))}
              </div>

              {member.skills?.length ? (
                <ul className="mt-7 flex flex-wrap gap-2">
                  {member.skills.map((skill) => (
                    <li
                      key={skill}
                      className="rounded-full border border-border bg-background px-3.5 py-1.5 text-xs font-medium text-foreground"
                    >
                      {skill}
                    </li>
                  ))}
                </ul>
              ) : null}
            </RevealItem>
          ))}
        </RevealGroup>
      </div>
    </section>
  );
}
