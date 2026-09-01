import { ArrowRight, Check } from "lucide-react";
import { RevealGroup, RevealItem } from "@/components/magic/reveal";
import type { PriceTier, SectionHeading } from "@/content/types";

/**
 * Three real pricing cards, not three identical boxes: the featured tier
 * (Automate) sits taller with a solid primary surface and its own eyebrow
 * badge, while Launch and Grow stay on a plain card surface. Bespoke,
 * since nothing in the catalog renders PriceTier[] as cards.
 */
export function PricingCards({ heading, tiers }: { heading?: SectionHeading; tiers: PriceTier[] }) {
  return (
    <section className="bg-background py-20 lg:py-24">
      <div className="mx-auto max-w-7xl px-6">
        {heading ? (
          <div className="mx-auto max-w-2xl text-center">
            {heading.eyebrow ? <p className="eyebrow text-primary">{heading.eyebrow}</p> : null}
            <h2 className="mt-3 font-display text-4xl font-bold tracking-tight text-balance text-foreground sm:text-5xl">
              {heading.title}
            </h2>
            {heading.body ? <p className="mt-4 text-lg leading-relaxed text-muted-foreground">{heading.body}</p> : null}
          </div>
        ) : null}

        <RevealGroup className="mt-16 grid gap-6 lg:grid-cols-3 lg:items-start lg:gap-8">
          {tiers.map((tier) => (
            <RevealItem
              key={tier.name}
              className={
                tier.featured
                  ? "relative flex flex-col rounded-3xl bg-primary p-8 text-white shadow-xl shadow-primary/20 lg:-my-4 lg:p-10"
                  : "flex flex-col rounded-3xl border border-border bg-card p-8 lg:p-10"
              }
            >
              {tier.featured ? (
                <span className="absolute -top-3.5 left-8 rounded-full bg-white px-3.5 py-1 text-xs font-semibold tracking-wide text-primary">
                  Recommended
                </span>
              ) : null}

              <h3
                className={
                  tier.featured
                    ? "font-display text-2xl font-bold tracking-tight text-white"
                    : "font-display text-2xl font-bold tracking-tight text-foreground"
                }
              >
                {tier.name}
              </h3>

              {tier.body ? (
                <p className={tier.featured ? "mt-3 text-sm leading-relaxed text-white/80" : "mt-3 text-sm leading-relaxed text-muted-foreground"}>
                  {tier.body}
                </p>
              ) : null}

              <div className="mt-7 flex items-baseline gap-2">
                <span className={tier.featured ? "font-display text-4xl font-bold tracking-tight text-white" : "font-display text-4xl font-bold tracking-tight text-foreground"}>
                  {tier.price}
                </span>
                {tier.period ? (
                  <span className={tier.featured ? "text-sm text-white/70" : "text-sm text-muted-foreground"}>{tier.period}</span>
                ) : null}
              </div>

              <ul className="mt-8 flex-1 space-y-3">
                {tier.features.map((f) => (
                  <li key={f} className="flex items-start gap-2.5 text-sm">
                    <Check
                      aria-hidden
                      className={tier.featured ? "mt-0.5 size-4 shrink-0 text-white" : "mt-0.5 size-4 shrink-0 text-primary"}
                    />
                    <span className={tier.featured ? "text-white/90" : "text-foreground"}>{f}</span>
                  </li>
                ))}
              </ul>

              {tier.cta ? (
                <a
                  href={tier.cta.href}
                  className={
                    tier.featured
                      ? "group mt-9 inline-flex cursor-pointer items-center justify-center gap-2 rounded-full bg-white px-6 py-3.5 text-sm font-semibold text-primary transition duration-200 ease-out hover:-translate-y-0.5 hover:shadow-lg focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-primary focus-visible:outline-none"
                      : "group mt-9 inline-flex cursor-pointer items-center justify-center gap-2 rounded-full border border-border bg-transparent px-6 py-3.5 text-sm font-semibold text-foreground transition duration-200 ease-out hover:-translate-y-0.5 hover:border-primary hover:text-primary focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:outline-none"
                  }
                >
                  {tier.cta.label}
                  <ArrowRight aria-hidden className="size-4 transition-transform duration-200 ease-out group-hover:translate-x-0.5" />
                </a>
              ) : null}
            </RevealItem>
          ))}
        </RevealGroup>
      </div>
    </section>
  );
}
