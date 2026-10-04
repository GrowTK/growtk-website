import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Reveal, RevealGroup, RevealItem } from "@/components/magic/reveal";
import type { Cta, SectionHeading, TeamMember } from "@/content/types";

/**
 * A short "who builds it" band: the two founders as compact ID cards (neutral
 * monogram, name, role, what they build) beside the heading, linking on to
 * the full team page.
 */
export function FoundersTeaser({ heading, members, link }: {
  heading: SectionHeading;
  members: TeamMember[];
  link: Cta;
}) {
  return (
    <section className="bg-background pt-24 lg:pt-36">
      <div className="mx-auto grid max-w-7xl gap-10 px-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.5fr)] lg:items-center lg:gap-16">
        <Reveal>
          {heading.eyebrow ? <p className="eyebrow text-primary">{heading.eyebrow}</p> : null}
          <h2 className="mt-3 font-display text-4xl leading-[1.05] font-bold tracking-tight text-balance text-foreground sm:text-5xl">{heading.title}</h2>
          <Link
            href={link.href}
            className="group mt-8 inline-flex cursor-pointer items-center gap-2 rounded-md bg-[#26262a] px-6 py-3.5 text-sm font-semibold text-white transition duration-200 ease-out hover:-translate-y-0.5 hover:shadow-lg focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:outline-none"
          >
            {link.label}
            <ArrowRight aria-hidden className="size-4 transition-transform duration-200 group-hover:translate-x-0.5" />
          </Link>
        </Reveal>

        <RevealGroup stagger={0.08} className="grid gap-4 sm:grid-cols-2">
          {members.map((m, i) => (
            <RevealItem key={m.name} className={i === 1 ? "sm:mt-12" : undefined}>
              <Link
                href={link.href}
                className="group block cursor-pointer rounded-md border border-border bg-card p-6 transition duration-200 ease-out hover:-translate-y-1 hover:shadow-[0_18px_48px_rgba(0,0,0,.09)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring sm:p-7"
              >
                <div className="flex items-center justify-between">
                  <span className="flex size-16 items-center justify-center rounded-md bg-muted font-display text-2xl font-bold tracking-tight text-foreground">
                    {m.initials}
                  </span>
                  <ArrowRight aria-hidden className="size-5 -rotate-45 text-muted-foreground transition-transform duration-200 group-hover:rotate-0 group-hover:text-foreground" />
                </div>
                <p className="mt-6 font-display text-2xl font-bold tracking-tight text-foreground">{m.name}</p>
                <p className="mt-1 text-sm text-muted-foreground">{m.role}</p>
                {m.skills?.length ? (
                  <ul className="mt-5 flex flex-wrap gap-1.5">
                    {m.skills.map((s) => (
                      <li key={s} className="rounded-sm bg-muted px-2 py-1 text-xs font-medium text-foreground">{s}</li>
                    ))}
                  </ul>
                ) : null}
              </Link>
            </RevealItem>
          ))}
        </RevealGroup>
      </div>
    </section>
  );
}
