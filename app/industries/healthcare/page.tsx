import type { Metadata } from "next";
import { PageHero } from "@/components/page-hero";
import { Feature01 } from "@/components/sections/features/feature-01";
import { Faq01 } from "@/components/sections/faq/faq-01";
import { Cta12 } from "@/components/sections/cta/cta-12";
import { healthcare } from "@/content/industries/healthcare";

export const metadata: Metadata = { title: healthcare.meta.title, description: healthcare.meta.description };

export default function HealthcarePage() {
  return (
    <>
      <PageHero
        heading={healthcare.hero}
        image={{
          src: "https://images.unsplash.com/photo-1637711805966-c5181f89ddb6?auto=format&fit=crop&w=1600&q=80",
          alt: "A clean, modern reception desk in a healthcare practice lobby",
        }}
        ctas={healthcare.hero.ctas}
      />
      <Feature01 heading={healthcare.build.heading} features={healthcare.build.features} />
      <Faq01 heading={healthcare.faq.heading} items={healthcare.faq.items} cta={healthcare.faq.cta} />
      <Cta12 heading={healthcare.cta.heading} primary={healthcare.cta.primary} image={healthcare.cta.image} />
    </>
  );
}
