import type { Metadata } from "next";
import { ArrowRight, Check } from "lucide-react";
import { PageHero } from "@/components/page-hero";
import { Feature01 } from "@/components/sections/features/feature-01";
import { Faq07 } from "@/components/sections/faq/faq-07";
import { Cta12 } from "@/components/sections/cta/cta-12";
import { pricing } from "@/content/pricing";

export const metadata: Metadata = { title: pricing.meta.title, description: pricing.meta.description };

export default function PricingPage() {
  return (
    <>
      <PageHero
        heading={pricing.hero}
        image={{ src: "https://images.unsplash.com/photo-1606811841689-23dfddce3e95?auto=format&fit=crop&w=1600&q=80", alt: "Dentist and patient reviewing a scan together" }}
        ctas={pricing.hero.ctas}
        footnote={pricing.hero.footnote}
      />

      <Feature01 heading={pricing.factors.heading} features={pricing.factors.items} />

      <section className="bg-muted/40 py-20">
        <div className="mx-auto grid max-w-7xl gap-12 px-6 lg:grid-cols-2 lg:items-center">
          <div>
            {pricing.founding.heading.eyebrow ? <p className="eyebrow text-primary">{pricing.founding.heading.eyebrow}</p> : null}
            <h2 className="mt-3 font-display text-4xl font-bold tracking-tight text-balance text-foreground sm:text-5xl">
              {pricing.founding.heading.title}
            </h2>
            {pricing.founding.heading.body ? (
              <p className="mt-4 text-lg leading-relaxed text-muted-foreground">{pricing.founding.heading.body}</p>
            ) : null}
            <ul className="mt-8 space-y-3">
              {pricing.founding.points.map((p) => (
                <li key={p} className="flex items-start gap-2.5 text-sm text-foreground">
                  <Check aria-hidden className="mt-0.5 size-4 shrink-0 text-primary" /> {p}
                </li>
              ))}
            </ul>
            <a
              href={pricing.founding.primary.href}
              className="group mt-9 inline-flex cursor-pointer items-center gap-2 rounded-full bg-primary px-7 py-3.5 text-sm font-semibold text-primary-foreground transition duration-200 ease-out hover:-translate-y-0.5 hover:shadow-lg focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:outline-none"
            >
              {pricing.founding.primary.label}
              <ArrowRight aria-hidden className="size-4 transition-transform duration-200 ease-out group-hover:translate-x-0.5" />
            </a>
            {pricing.founding.footnote ? <p className="mt-4 text-xs text-muted-foreground">{pricing.founding.footnote}</p> : null}
          </div>
          <div className="overflow-hidden rounded-2xl border border-border">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={pricing.founding.image.src} alt={pricing.founding.image.alt} loading="lazy" decoding="async" className="aspect-4/3 w-full object-cover" />
          </div>
        </div>
      </section>

      <Faq07 heading={pricing.faq.heading} items={pricing.faq.items} cta={pricing.faq.cta} />

      <Cta12
        heading={{ eyebrow: "Ready when you are", title: "Talk pricing with a real person", body: pricing.faq.ctaBody }}
        primary={pricing.faq.cta}
        image={{ src: "/brand/blue-blur.jpg", alt: "" }}
      />
    </>
  );
}
