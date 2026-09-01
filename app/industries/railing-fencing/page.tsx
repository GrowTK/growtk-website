import type { Metadata } from "next";
import { PageHero } from "@/components/page-hero";
import { Feature01 } from "@/components/sections/features/feature-01";
import { Faq01 } from "@/components/sections/faq/faq-01";
import { Cta12 } from "@/components/sections/cta/cta-12";
import { railingFencing } from "@/content/industries/railing-fencing";

export const metadata: Metadata = { title: railingFencing.meta.title, description: railingFencing.meta.description };

export default function RailingFencingPage() {
  return (
    <>
      <PageHero
        heading={railingFencing.hero}
        image={{
          src: "https://images.unsplash.com/photo-1604015641586-6fa03629f976?auto=format&fit=crop&w=1600&q=80",
          alt: "A wooden fence running along a property line under a clear sky",
        }}
        ctas={railingFencing.hero.ctas}
      />
      <Feature01 heading={railingFencing.build.heading} features={railingFencing.build.features} />
      <Faq01 heading={railingFencing.faq.heading} items={railingFencing.faq.items} cta={railingFencing.faq.cta} />
      <Cta12 heading={railingFencing.cta.heading} primary={railingFencing.cta.primary} image={railingFencing.cta.image} />
    </>
  );
}
