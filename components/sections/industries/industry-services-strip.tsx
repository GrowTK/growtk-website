import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { Reveal, RevealGroup, RevealItem } from "@/components/magic/reveal";
import { Icon } from "@/components/sections/icon";
import { toneGradient, type IndustryTone } from "@/components/sections/industries/industry-tones";
import { industryPageLabels } from "@/content/industries";
import { servicePages } from "@/content/service-pages";

type StripItem = { icon: string; name: string; href: string };

/**
 * Service link cards in a trade colour on a muted panel. Industry pages use
 * the defaults ("Built from these services", all thirteen services); the
 * services hub passes its own heading and one group's services per strip.
 */
export function IndustryServicesStrip({ tone, heading, items }: { tone: IndustryTone; heading?: { eyebrow?: string; title: string; body?: string }; items?: StripItem[] }) {
  const copy = heading ?? industryPageLabels.strip;
  const list = items ?? servicePages.map((s) => ({ icon: s.icon, name: s.name, href: `/services/${s.slug}` }));
  return (
    <section className="bg-background pt-16 lg:pt-20">
      <div className="mx-auto max-w-7xl px-6">
        <div className="grid gap-8 rounded-[32px] bg-muted p-6 sm:p-8 lg:grid-cols-[minmax(0,20rem)_minmax(0,1fr)] lg:gap-12 lg:p-10">
          <Reveal className="self-center">
            {copy.eyebrow ? <p className="eyebrow text-primary">{copy.eyebrow}</p> : null}
            <h2 className="mt-3 font-display text-3xl leading-[1.08] font-bold tracking-tight text-balance text-foreground">{copy.title}</h2>
            {copy.body ? <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{copy.body}</p> : null}
          </Reveal>
          <RevealGroup stagger={0.06} className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
            {list.map((s) => {
              return (
                <RevealItem key={s.href}>
                <Link
                  href={s.href}
                  className="group flex cursor-pointer items-center gap-3 rounded-2xl bg-card p-3.5 transition duration-200 ease-out hover:-translate-y-0.5 hover:shadow-[0_10px_28px_rgba(0,0,0,.08)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                >
                  <span className="flex size-11 shrink-0 items-center justify-center rounded-xl text-foreground" style={{ background: toneGradient(tone) }}>
                    <Icon name={s.icon} className="size-5" strokeWidth={1.75} />
                  </span>
                  <span className="min-w-0 flex-1 text-sm leading-snug font-semibold text-foreground">{s.name}</span>
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
