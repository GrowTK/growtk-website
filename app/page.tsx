import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Reveal, RevealGroup, RevealItem } from "@/components/magic/reveal";
import { Icon } from "@/components/sections/icon";
import { Hero01 } from "@/components/sections/hero/hero-01";
import { Feature05 } from "@/components/sections/features/feature-05";
import { Feature07 } from "@/components/sections/features/feature-07";
import { Testimonial09 } from "@/components/sections/testimonials/testimonial-09";
import { Faq03 } from "@/components/sections/faq/faq-03";
import { Cta12 } from "@/components/sections/cta/cta-12";
import { home } from "@/content/home";

export const metadata: Metadata = { title: home.meta.title, description: home.meta.description };

export default function Home() {
  return (
    <>
      <Hero01
        eyebrow={home.hero.eyebrow}
        title={home.hero.title}
        body={home.hero.body}
        image={home.hero.image}
        ctas={home.hero.ctas}
        stats={home.hero.stats}
      />

      {/* Bespoke: three industry link-cards, nothing in the catalog does this. */}
      <section className="bg-background py-20 lg:py-28">
        <div className="mx-auto max-w-7xl px-6">
          <Reveal className="max-w-2xl">
            {home.industries.heading.eyebrow ? <p className="eyebrow text-primary">{home.industries.heading.eyebrow}</p> : null}
            <h2 className="mt-3 font-display text-4xl font-bold tracking-tight text-balance text-foreground sm:text-5xl">
              {home.industries.heading.title}
            </h2>
            {home.industries.heading.body ? (
              <p className="mt-4 text-base leading-relaxed text-muted-foreground">{home.industries.heading.body}</p>
            ) : null}
          </Reveal>

          <RevealGroup className="mt-12 grid gap-6 sm:grid-cols-3">
            {home.industries.items.map((industry) => (
              <RevealItem key={industry.name}>
                <Link
                  href={industry.href}
                  className="group flex h-full cursor-pointer flex-col rounded-2xl border border-border bg-card p-7 transition duration-300 ease-out hover:-translate-y-1 hover:shadow-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                >
                  <span className="grid size-11 shrink-0 place-items-center rounded-xl bg-primary/10 text-primary">
                    <Icon name={industry.icon} className="size-5" />
                  </span>
                  <h3 className="mt-5 font-display text-lg font-semibold tracking-tight text-foreground">{industry.name}</h3>
                  <p className="mt-2 flex-1 text-sm leading-relaxed text-muted-foreground">{industry.teaser}</p>
                  <span className="mt-5 inline-flex items-center gap-1.5 text-sm font-medium text-primary">
                    See the playbook
                    <ArrowRight aria-hidden className="size-4 transition-transform duration-200 ease-out group-hover:translate-x-0.5" />
                  </span>
                </Link>
              </RevealItem>
            ))}
          </RevealGroup>

          <Reveal delay={0.1} className="mt-10">
            <Link
              href={home.industries.cta.href}
              className="inline-flex cursor-pointer items-center gap-2 text-sm font-semibold text-foreground underline-offset-4 hover:underline"
            >
              {home.industries.cta.label}
              <ArrowRight aria-hidden className="size-4" />
            </Link>
          </Reveal>
        </div>
      </section>

      <Feature05 autoAdvance={8000} heading={home.capabilities.heading} features={home.capabilities.items} />

      <Feature07 heading={home.process.heading} cta={home.process.cta} features={home.process.items} />

      <Testimonial09 heading={home.testimonials.heading} testimonials={home.testimonials.items} />

      <Faq03 heading={home.faq.heading} items={home.faq.items} cta={home.faq.cta} />

      <Cta12
        heading={home.cta.heading}
        primary={home.cta.primary}
        image={home.cta.image}
        footnote={home.cta.footnote}
      />
    </>
  );
}
