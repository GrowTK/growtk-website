import Link from "next/link";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import { Icon } from "@/components/sections/icon";
import { Reveal, RevealGroup, RevealItem } from "@/components/magic/reveal";
import { Wash } from "@/components/sections/company/wash";
import { ProductMock } from "@/components/sections/solutions/product-mock";
import { MOCK_TONE } from "@/components/sections/solutions/solution-sections";
import type { MockKind } from "@/content/solution-mocks";
import type { Cta, Feature, SectionHeading } from "@/content/types";
import { cn } from "@/lib/utils";

/**
 * The /solutions hub: a centered hero with the four live product windows
 * fanned out beneath it, a row of the channels every system covers, and one
 * block per solution group with large product cards. No image left, image
 * right rows anywhere on the page.
 */

const grad = (k: MockKind) => `linear-gradient(150deg, ${MOCK_TONE[k].from}, ${MOCK_TONE[k].to})`;

export function SolutionsHubHero({ heading, ctas, mocks }: { heading: SectionHeading; ctas: Cta[]; mocks: MockKind[] }) {
  const tilt = ["-rotate-[5deg] translate-y-10", "-rotate-[1.5deg]", "rotate-[1.5deg]", "rotate-[5deg] translate-y-10"];
  return (
    <section data-nav-theme="light" className="relative isolate overflow-hidden">
      <Wash name="lilac" />
      <div className="relative mx-auto max-w-7xl px-6 py-10 sm:px-10">
        <div className="overflow-hidden rounded-2xl bg-white shadow-2xl">
          <div className="mx-auto max-w-4xl px-6 pt-16 text-center sm:pt-20 lg:pt-24">
            <Reveal>
              {heading.eyebrow ? <p className="eyebrow text-[#26262a]/70">{heading.eyebrow}</p> : null}
              <h1 className="mt-5 font-display text-5xl font-bold leading-[0.98] tracking-tight text-balance text-[#26262a] sm:text-6xl lg:text-7xl">{heading.title}</h1>
              {heading.body ? <p className="mx-auto mt-6 max-w-2xl text-base leading-relaxed text-muted-foreground sm:text-lg">{heading.body}</p> : null}
              <div className="mt-9 flex flex-wrap items-center justify-center gap-4">
                {ctas.map((cta, i) => (
                  <Link
                    key={cta.label}
                    href={cta.href}
                    className={
                      i === 0
                        ? "group inline-flex cursor-pointer items-center gap-2 rounded-full bg-[#26262a] px-7 py-4 text-sm font-semibold text-white transition duration-200 ease-out hover:-translate-y-0.5 hover:shadow-xl focus-visible:ring-2 focus-visible:ring-[#26262a] focus-visible:ring-offset-2 focus-visible:outline-none"
                        : "inline-flex cursor-pointer items-center gap-2 rounded-full border border-border px-7 py-4 text-sm font-semibold text-[#26262a] transition-colors duration-200 hover:bg-accent focus-visible:ring-2 focus-visible:ring-[#26262a] focus-visible:outline-none"
                    }
                  >
                    {cta.label}
                    {i === 0 ? <ArrowRight aria-hidden className="size-4 transition-transform duration-200 group-hover:translate-x-0.5" /> : null}
                  </Link>
                ))}
              </div>
            </Reveal>
          </div>
          <div className="relative mt-16 h-[22rem] overflow-hidden sm:h-[26rem]">
            <div aria-hidden className="absolute inset-x-0 bottom-0 h-3/4" style={{ backgroundImage: "linear-gradient(180deg, transparent, #F9E3FF 55%, #F2C4FF)" }} />
            <div className="relative mx-auto grid max-w-6xl grid-cols-2 gap-4 px-6 sm:gap-6 lg:grid-cols-4">
              {mocks.map((m, i) => (
                <Reveal key={m} delay={0.1 + i * 0.08} y={40} className={cn(tilt[i], i > 1 && "hidden lg:block")}>
                  <ProductMock kind={m} compact />
                </Reveal>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export function ChannelRow({ heading, items }: { heading: SectionHeading; items: Feature[] }) {
  return (
    <section className="bg-background px-6 py-20 sm:px-10 lg:py-28">
      <div className="mx-auto max-w-7xl">
        <Reveal className="mx-auto max-w-3xl text-center">
          {heading.eyebrow ? <p className="eyebrow text-primary">{heading.eyebrow}</p> : null}
          <h2 className="mt-4 font-display text-4xl font-bold tracking-tight text-balance text-foreground sm:text-5xl">{heading.title}</h2>
          {heading.body ? <p className="mx-auto mt-5 max-w-2xl text-base leading-relaxed text-muted-foreground sm:text-lg">{heading.body}</p> : null}
        </Reveal>
        <RevealGroup className="relative mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-4" stagger={0.07}>
          <div aria-hidden className="absolute left-[12%] right-[12%] top-[3.25rem] hidden h-px border-t border-dashed border-foreground/20 lg:block" />
          {items.map((c) => (
            <RevealItem key={c.title}>
              <article className="group relative h-full rounded-[1.5rem] border border-border bg-card p-7 text-center transition duration-300 ease-out hover:-translate-y-1 hover:shadow-[0_30px_60px_-40px_rgb(38_38_42/0.45)]">
                <span className="relative mx-auto grid size-14 place-items-center rounded-2xl bg-[#26262a] text-white transition-colors duration-300 group-hover:bg-[#FFDE59] group-hover:text-[#26262a]">
                  <Icon name={c.icon} className="size-6" />
                </span>
                <h3 className="mt-6 font-display text-xl font-bold tracking-tight text-foreground">{c.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{c.body}</p>
              </article>
            </RevealItem>
          ))}
        </RevealGroup>
      </div>
    </section>
  );
}

export type HubCard = { name: string; teaser: string; href: string; mock: MockKind; icon: string; points: string[] };

export function SolutionGroupCards({ heading, items, exploreLabel, index }: { heading: SectionHeading; items: HubCard[]; exploreLabel: string; index: number }) {
  return (
    <section className="bg-background px-6 py-16 sm:px-10 lg:py-24">
      <div className="mx-auto max-w-7xl">
        <Reveal className="grid gap-6 lg:grid-cols-[auto_1fr_1fr] lg:items-end lg:gap-12">
          <span aria-hidden className="font-display text-8xl font-bold leading-none tracking-tighter text-transparent [-webkit-text-stroke:1.5px_rgb(38_38_42/0.18)]">
            {String(index + 1).padStart(2, "0")}
          </span>
          <div>
            {heading.eyebrow ? <p className="eyebrow text-primary">{heading.eyebrow}</p> : null}
            <h2 className="mt-4 font-display text-4xl font-bold tracking-tight text-balance text-foreground sm:text-5xl">{heading.title}</h2>
          </div>
          {heading.body ? <p className="max-w-md text-base leading-relaxed text-muted-foreground">{heading.body}</p> : null}
        </Reveal>
        <div className="mt-12 grid gap-6 lg:grid-cols-2">
          {items.map((s, i) => (
            <Reveal key={s.href} delay={i * 0.08}>
              <Link
                href={s.href}
                className="group block cursor-pointer overflow-hidden rounded-[1.75rem] border border-border bg-card transition duration-300 ease-out hover:-translate-y-1 hover:shadow-[0_40px_80px_-50px_rgb(38_38_42/0.5)] focus-visible:ring-2 focus-visible:ring-[#26262a] focus-visible:ring-offset-2 focus-visible:outline-none"
              >
                <div className="relative flex h-[22rem] items-start justify-center overflow-hidden px-8 pt-10 sm:px-14" style={{ backgroundImage: grad(s.mock) }}>
                  <div aria-hidden className="absolute inset-0 opacity-[0.35] [background-image:radial-gradient(rgb(38_38_42/0.18)_1px,transparent_1px)] [background-size:18px_18px]" />
                  <span className="absolute left-5 top-5 z-10 inline-flex items-center gap-1.5 rounded-full bg-white/90 px-3 py-1.5 text-xs font-semibold text-[#26262a]">
                    <Icon name={s.icon} className="size-3.5" />
                    {heading.title}
                  </span>
                  <ProductMock kind={s.mock} className="relative max-w-md translate-y-6 transition-transform duration-500 ease-out group-hover:translate-y-2" />
                </div>
                <div className="flex items-end justify-between gap-6 p-7 sm:p-8">
                  <div>
                    <h3 className="font-display text-2xl font-bold tracking-tight text-foreground sm:text-3xl">{s.name}</h3>
                    <p className="mt-2 max-w-md text-sm leading-relaxed text-muted-foreground sm:text-base">{s.teaser}</p>
                    <ul className="mt-4 flex flex-wrap gap-2">
                      {s.points.map((p) => (
                        <li key={p} className="rounded-full border border-border px-3 py-1 text-xs font-medium text-foreground/75">
                          {p}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <span className="grid size-12 shrink-0 place-items-center rounded-full bg-[#26262a] text-white transition duration-300 group-hover:rotate-45 group-hover:bg-[#FFDE59] group-hover:text-[#26262a]">
                    <ArrowUpRight aria-hidden className="size-5" />
                    <span className="sr-only">{exploreLabel}</span>
                  </span>
                </div>
              </Link>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
