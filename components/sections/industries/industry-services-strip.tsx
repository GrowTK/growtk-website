import Link from "next/link";
import { ArrowUpRight, Globe, Mic, Plug, Puzzle, Search, Workflow, type LucideIcon } from "lucide-react";
import { Reveal, RevealGroup, RevealItem } from "@/components/magic/reveal";
import { toneGradient, type IndustryTone } from "@/components/sections/industries/industry-tones";
import { industryPageLabels } from "@/content/industries";
import { services } from "@/content/services";

const SERVICE_ICON: Record<string, LucideIcon> = {
  "website-redesign": Globe,
  seo: Search,
  widgets: Puzzle,
  automation: Workflow,
  "voice-agents": Mic,
  integrations: Plug,
};

/**
 * "Built from these services": the six services as icon cards in the trade's
 * colour, each linking to its section on /services. Replaces the plain text
 * link row, so the cross-link reads as part of the page, not a footnote.
 */
export function IndustryServicesStrip({ tone }: { tone: IndustryTone }) {
  const copy = industryPageLabels.strip;
  return (
    <section className="bg-background pt-16 lg:pt-20">
      <div className="mx-auto max-w-7xl px-6">
        <div className="grid gap-8 rounded-[32px] bg-muted p-6 sm:p-8 lg:grid-cols-[minmax(0,20rem)_minmax(0,1fr)] lg:gap-12 lg:p-10">
          <Reveal className="self-center">
            <p className="eyebrow text-primary">{copy.eyebrow}</p>
            <h2 className="mt-3 font-display text-3xl leading-[1.08] font-bold tracking-tight text-balance text-foreground">{copy.title}</h2>
            <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{copy.body}</p>
          </Reveal>
          <RevealGroup stagger={0.06} className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
            {services.services.map((s) => {
              const Icon = SERVICE_ICON[s.id] ?? Plug;
              return (
                <RevealItem key={s.id}>
                <Link
                  href={`/services#${s.id}`}
                  className="group flex cursor-pointer items-center gap-3 rounded-2xl bg-card p-3.5 transition duration-200 ease-out hover:-translate-y-0.5 hover:shadow-[0_10px_28px_rgba(0,0,0,.08)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                >
                  <span className="flex size-11 shrink-0 items-center justify-center rounded-xl text-foreground" style={{ background: toneGradient(tone) }}>
                    <Icon aria-hidden className="size-5" strokeWidth={1.75} />
                  </span>
                  <span className="min-w-0 flex-1 text-sm leading-snug font-semibold text-foreground">{s.title}</span>
                  <ArrowUpRight aria-hidden className="size-4 shrink-0 text-muted-foreground transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-foreground" />
                </Link>
                </RevealItem>
              );
            })}
          </RevealGroup>
        </div>
      </div>
    </section>
  );
}
