import type * as React from "react";
import Image from "next/image";
import { Check, Minus, Sparkles } from "lucide-react";
import { Icon } from "@/components/sections/icon";
import { Reveal, RevealGroup, RevealItem } from "@/components/magic/reveal";
import { ProductMock } from "@/components/sections/solutions/product-mock";
import type { MockKind } from "@/content/solution-mocks";
import type { Feature, Img, SectionHeading } from "@/content/types";
import { cn } from "@/lib/utils";

/**
 * The bespoke sections of a solution page. All sit on the page background,
 * each with its own shape, so the page never settles into image left, image
 * right rows: a bento of capabilities, a photo with a live mock pinned to it,
 * a charcoal governance panel, tagged audience cards, a built vs bought
 * table and an outcome split.
 */

export type Point = { title: string; body: string };

/** Pastel per solution, matched to the home stack. */
export const MOCK_TONE: Record<MockKind, { from: string; to: string }> = {
  kb: { from: "#FFDE59", to: "#FFF0AD" },
  helpdesk: { from: "#F2C4FF", to: "#F9E3FF" },
  qa: { from: "#FFBA7B", to: "#FFDDBC" },
  survey: { from: "#FFDE59", to: "#FFF0AD" },
};
const grad = (k: MockKind) => `linear-gradient(150deg, ${MOCK_TONE[k].from}, ${MOCK_TONE[k].to})`;
export const mockGradient = grad;
export const pastel = (from: string, to: string) => `linear-gradient(150deg, ${from}, ${to})`;

function Head({ heading, center = false, dark = false }: { heading: SectionHeading; center?: boolean; dark?: boolean }) {
  return (
    <Reveal className={cn("max-w-3xl", center && "mx-auto text-center")}>
      {heading.eyebrow ? <p className={cn("eyebrow", dark ? "text-[#FFDE59]" : "text-primary")}>{heading.eyebrow}</p> : null}
      <h2 className={cn("mt-4 font-display text-4xl font-bold leading-[1.04] tracking-tight text-balance sm:text-5xl", dark ? "text-white" : "text-foreground")}>{heading.title}</h2>
      {heading.body ? <p className={cn("mt-5 text-base leading-relaxed sm:text-lg", dark ? "text-white/65" : "text-muted-foreground", center && "mx-auto max-w-2xl")}>{heading.body}</p> : null}
    </Reveal>
  );
}

/* --------------------------- Capabilities bento ---------------------------- */

export function CapabilityBento({ heading, features, gradient, lead: leadVisual }: { heading: SectionHeading; features: Feature[]; gradient: string; lead?: React.ReactNode }) {
  return (
    <section className="bg-background px-6 py-20 sm:px-10 lg:py-28">
      <div className="mx-auto max-w-7xl">
        <Head heading={heading} />
        <RevealGroup className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-3" stagger={0.06}>
          {features.map((f, i) => {
            const lead = i === 0;
            return (
              <RevealItem key={f.title} className={cn(lead && "sm:col-span-2 lg:row-span-2")}>
                <article
                  className={cn(
                    "group relative flex h-full flex-col overflow-hidden rounded-[1.5rem] p-7 transition duration-300 ease-out hover:-translate-y-1 lg:p-8",
                    lead ? "text-[#26262a]" : "border border-border bg-card hover:shadow-[0_30px_60px_-40px_rgb(38_38_42/0.45)]",
                  )}
                  style={lead ? { backgroundImage: gradient } : undefined}
                >
                  <div className="flex items-center justify-between">
                    <span className={cn("grid size-11 place-items-center rounded-xl", lead ? "bg-white text-[#26262a]" : "bg-[#26262a] text-white")}>
                      <Icon name={f.icon} className="size-5" />
                    </span>
                    <span className="font-display text-sm font-bold tabular-nums text-foreground/30">{String(i + 1).padStart(2, "0")}</span>
                  </div>
                  <h3 className={cn("mt-6 font-display font-bold tracking-tight text-balance", lead ? "max-w-md text-2xl lg:text-4xl" : "text-xl lg:text-2xl")}>{f.title}</h3>
                  <p className={cn("mt-3 leading-relaxed", lead ? "max-w-md text-base text-[#26262a]/75" : "text-sm text-muted-foreground")}>{f.body}</p>
                  {lead && leadVisual ? (
                    <div className="mt-8 hidden flex-1 items-end justify-end lg:flex">
                      <div className="w-full max-w-md translate-y-12 rotate-[-2deg] transition-transform duration-500 group-hover:rotate-0">{leadVisual}</div>
                    </div>
                  ) : null}
                </article>
              </RevealItem>
            );
          })}
        </RevealGroup>
      </div>
    </section>
  );
}

/* ----------------------------- Spotlight split ----------------------------- */

export function SpotlightSplit({ heading, points, image, mock }: { heading: SectionHeading; points: Point[]; image: Img; mock: MockKind }) {
  return (
    <section className="bg-background px-6 py-20 sm:px-10 lg:py-28">
      <div className="mx-auto grid max-w-7xl items-center gap-14 lg:grid-cols-2 lg:gap-20">
        <Reveal className="relative pb-16 lg:pb-0">
          <div className="absolute -inset-4 -z-10 rounded-[2.25rem] opacity-70" style={{ backgroundImage: grad(mock) }} aria-hidden />
          <div className="relative aspect-[4/5] overflow-hidden rounded-[1.75rem] sm:aspect-[5/4] lg:aspect-[4/5]">
            <Image src={image.src} alt={image.alt} fill sizes="(min-width: 1024px) 40vw, 100vw" quality={75} className="object-cover" />
          </div>
          <div className="absolute -bottom-2 right-4 w-[min(22rem,85%)] sm:right-8 lg:-right-10 lg:bottom-10">
            <ProductMock kind={mock} compact />
          </div>
        </Reveal>
        <div>
          <Head heading={heading} />
          <RevealGroup className="mt-10 space-y-3" stagger={0.08}>
            {points.map((p) => (
              <RevealItem key={p.title}>
                <div className="flex gap-4 rounded-2xl border border-border bg-card p-5 transition-colors duration-200 hover:border-foreground/20">
                  <span className="grid size-8 shrink-0 place-items-center rounded-full bg-[#26262a] text-white">
                    <Check aria-hidden className="size-4" />
                  </span>
                  <div>
                    <h3 className="font-semibold text-foreground">{p.title}</h3>
                    <p className="mt-1 text-sm leading-relaxed text-muted-foreground">{p.body}</p>
                  </div>
                </div>
              </RevealItem>
            ))}
          </RevealGroup>
        </div>
      </div>
    </section>
  );
}

/* ---------------------------- Governance panel ----------------------------- */

export function GovernancePanel({ heading, points, image }: { heading: SectionHeading; points: Point[]; image?: Img }) {
  return (
    <section className="bg-background px-4 py-12 sm:px-6 lg:py-16">
      <div className="relative mx-auto max-w-7xl overflow-hidden rounded-[2rem] bg-[#1A1A1A] px-6 py-14 sm:px-10 lg:px-14 lg:py-20">
        <div aria-hidden className="pointer-events-none absolute -left-32 -top-32 size-[28rem] rounded-full bg-[#FFBA7B]/10 blur-3xl" />
        <div className="relative grid gap-12 lg:grid-cols-[1fr_1.1fr] lg:gap-16">
          <div>
            <Head heading={heading} dark />
            {image ? (
              <Reveal delay={0.1} className="relative mt-10 aspect-[16/10] overflow-hidden rounded-2xl ring-1 ring-white/10">
                <Image src={image.src} alt={image.alt} fill sizes="(min-width: 1024px) 40vw, 100vw" quality={75} className="object-cover" />
              </Reveal>
            ) : null}
          </div>
          <ol className="flex flex-col justify-center">
            {points.map((p, i) => (
              <Reveal as="li" key={p.title} delay={0.08 * i} className="group flex gap-6 py-7 first:pt-0 last:pb-0 [&:not(:last-child)]:border-b [&:not(:last-child)]:border-white/10">
                <span className="font-display text-5xl font-bold leading-none tracking-tighter text-transparent [-webkit-text-stroke:1.5px_rgb(255_222_89/0.7)]">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <div>
                  <h3 className="font-display text-xl font-bold tracking-tight text-white sm:text-2xl">{p.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-white/65 sm:text-base">{p.body}</p>
                </div>
              </Reveal>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}

/* ------------------------------ Audience cards ----------------------------- */

export function AudienceCards({ heading, items, gradient }: { heading: SectionHeading; items: (Feature & { tag?: string })[]; gradient: string }) {
  return (
    <section className="bg-background px-6 py-20 sm:px-10 lg:py-28">
      <div className="mx-auto max-w-7xl">
        <Head heading={heading} center />
        <RevealGroup className={cn("mt-14 grid gap-5", items.length === 4 ? "md:grid-cols-2 lg:grid-cols-4" : "md:grid-cols-3")} stagger={0.08}>
          {items.map((a, i) => (
            <RevealItem key={a.title} className={cn(i % 2 === 1 && "md:translate-y-8")}>
              <article className="group flex h-full flex-col rounded-[1.5rem] border border-border bg-card p-8 transition duration-300 ease-out hover:-translate-y-1 hover:shadow-[0_30px_60px_-40px_rgb(38_38_42/0.45)]">
                <span className="grid size-12 place-items-center rounded-2xl text-[#26262a]" style={{ backgroundImage: gradient }}>
                  <Icon name={a.icon} className="size-5" />
                </span>
                <h3 className="mt-6 font-display text-xl font-bold tracking-tight text-balance text-foreground">{a.title}</h3>
                <p className="mt-3 flex-1 text-sm leading-relaxed text-muted-foreground">{a.body}</p>
                {a.tag ? (
                  <span className="mt-7 inline-flex w-fit items-center gap-1.5 rounded-full bg-[#26262a] px-3.5 py-1.5 text-xs font-semibold text-white">
                    <Sparkles aria-hidden className="size-3.5 text-[#FFDE59]" />
                    {a.tag}
                  </span>
                ) : null}
              </article>
            </RevealItem>
          ))}
        </RevealGroup>
      </div>
    </section>
  );
}

/* ------------------------------ Compare table ------------------------------ */

export function CompareTable({ heading, columns, rows }: { heading: SectionHeading; columns: [string, string]; rows: { label: string; diy: string; growtk: string }[] }) {
  return (
    <section className="bg-background px-6 py-20 sm:px-10 lg:py-28">
      <div className="mx-auto max-w-6xl">
        <Head heading={heading} center />
        <Reveal className="mt-14 overflow-hidden rounded-[1.75rem] border border-border bg-card">
          <div className="hidden grid-cols-[1fr_1.2fr_1.2fr] text-sm font-semibold md:grid">
            <div className="p-6" />
            <div className="p-6 text-muted-foreground">{columns[0]}</div>
            <div className="bg-[#26262a] p-6 text-white">{columns[1]}</div>
          </div>
          {rows.map((r) => (
            <div key={r.label} className="grid border-t border-border md:grid-cols-[1fr_1.2fr_1.2fr] md:first-of-type:border-t-0">
              <div className="px-6 pt-6 font-semibold text-foreground md:py-6">{r.label}</div>
              <div className="flex items-start gap-3 px-6 py-3 text-sm text-muted-foreground md:py-6">
                <Minus aria-hidden className="mt-0.5 size-4 shrink-0" />
                <span>
                  <span className="sr-only">{columns[0]}: </span>
                  {r.diy}
                </span>
              </div>
              <div className="flex items-start gap-3 bg-[#26262a] px-6 py-4 text-sm text-white md:py-6">
                <Check aria-hidden className="mt-0.5 size-4 shrink-0 text-[#FFDE59]" />
                <span>
                  <span className="sr-only">{columns[1]}: </span>
                  {r.growtk}
                </span>
              </div>
            </div>
          ))}
        </Reveal>
      </div>
    </section>
  );
}

/* ------------------------------ Outcome split ------------------------------ */

export function OutcomeSplit({ heading, items, image, mock }: { heading: SectionHeading; items: Point[]; image: Img; mock: MockKind }) {
  return (
    <section className="bg-background px-6 py-20 sm:px-10 lg:py-28">
      <div className="mx-auto max-w-7xl">
        <div className="grid gap-12 lg:grid-cols-[1.1fr_1fr] lg:items-end">
          <Head heading={heading} />
          <Reveal delay={0.1} className="relative aspect-[16/10] overflow-hidden rounded-[1.75rem]">
            <Image src={image.src} alt={image.alt} fill sizes="(min-width: 1024px) 45vw, 100vw" quality={75} className="object-cover" />
          </Reveal>
        </div>
        <RevealGroup className="mt-12 grid gap-4 md:grid-cols-3" stagger={0.08}>
          {items.map((o, i) => (
            <RevealItem key={o.title}>
              <div className={cn("h-full rounded-[1.5rem] p-7", i !== 0 && "border border-border bg-card")} style={i === 0 ? { backgroundImage: grad(mock) } : undefined}>
                <div>
                  <span className={cn("grid size-9 place-items-center rounded-full", i === 0 ? "bg-white text-[#26262a]" : "bg-[#26262a] text-white")}>
                    <Check aria-hidden className="size-4" />
                  </span>
                  <h3 className="mt-5 font-display text-xl font-bold tracking-tight text-balance text-foreground">{o.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{o.body}</p>
                </div>
              </div>
            </RevealItem>
          ))}
        </RevealGroup>
      </div>
    </section>
  );
}
