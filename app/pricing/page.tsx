import type { Metadata } from "next";
import { PageHero } from "@/components/page-hero";
import { Feature01 } from "@/components/sections/features/feature-01";
import { PricingCards } from "@/components/sections/pricing/pricing-cards";
import { Faq07 } from "@/components/sections/faq/faq-07";
import { Cta12 } from "@/components/sections/cta/cta-12";
import { pricing } from "@/content/pricing";

export const metadata: Metadata = { title: pricing.meta.title, description: pricing.meta.description };

export default function PricingPage() {
  return (
    <>
      <PageHero
        heading={pricing.hero}
        image={{ src: "https://images.unsplash.com/photo-1672380135241-c024f7fbfa13?auto=format&fit=crop&w=1600&q=80", alt: "Two people shaking hands over a laptop after agreeing on a project" }}
        ctas={pricing.hero.ctas}
        footnote={pricing.hero.footnote}
      />

      <Feature01 heading={pricing.factors.heading} features={pricing.factors.items} />

      <PricingCards heading={pricing.pricingHeading} tiers={pricing.tiers} />

      <Faq07 heading={pricing.faq.heading} items={pricing.faq.items} cta={pricing.faq.cta} />

      <Cta12
        heading={{ eyebrow: "Ready when you are", title: "Talk pricing on a free audit call", body: pricing.faq.ctaBody }}
        primary={pricing.faq.cta}
        image={{ src: "https://images.unsplash.com/photo-1757405909200-5f19f1f39eae?auto=format&fit=crop&w=1920&q=80", alt: "Three people in a meeting room looking together at a presentation" }}
      />
    </>
  );
}
