import { Plug } from "lucide-react";
import { Reveal, RevealGroup, RevealItem } from "@/components/magic/reveal";
import type { SectionHeading } from "@/content/types";

/**
 * "Works in your stack": a centered heading and the tools as a loose cloud
 * of pill chips, each with a small pastel dot, then a one line note for
 * custom systems. Naming a tool means we build with it, not a partnership.
 */
export function StackChips({ heading, items, note }: { heading: SectionHeading; items: string[]; note: string }) {
  const dots = ["bg-[#FFDE59]", "bg-[#FFBA7B]", "bg-[#F2C4FF]"];
  return (
    <section className="bg-background px-6 py-20 sm:px-10 lg:py-28">
      <div className="mx-auto max-w-4xl text-center">
        <Reveal>
          {heading.eyebrow ? <p className="eyebrow text-primary">{heading.eyebrow}</p> : null}
          <h2 className="mt-4 font-display text-4xl font-bold tracking-tight text-balance text-foreground sm:text-5xl">{heading.title}</h2>
          {heading.body ? <p className="mx-auto mt-5 max-w-2xl text-base leading-relaxed text-muted-foreground sm:text-lg">{heading.body}</p> : null}
        </Reveal>
        <RevealGroup className="mt-12 flex flex-wrap justify-center gap-3" stagger={0.05}>
          {items.map((t, i) => (
            <RevealItem key={t}>
              <span className="inline-flex items-center gap-2.5 rounded-full border border-border bg-card px-5 py-3 text-sm font-semibold text-foreground shadow-[0_8px_24px_-16px_rgb(38_38_42/0.35)] transition-transform duration-200 hover:-translate-y-0.5">
                <span aria-hidden className={`size-2 rounded-full ${dots[i % dots.length]}`} />
                {t}
              </span>
            </RevealItem>
          ))}
        </RevealGroup>
        <p className="mt-10 inline-flex items-center gap-2 text-sm text-muted-foreground">
          <Plug aria-hidden className="size-4" />
          {note}
        </p>
      </div>
    </section>
  );
}
