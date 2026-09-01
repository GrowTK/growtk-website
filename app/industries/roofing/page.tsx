import type { Metadata } from "next";
import { PageHero } from "@/components/page-hero";
import { Feature01 } from "@/components/sections/features/feature-01";
import { Faq01 } from "@/components/sections/faq/faq-01";
import { Cta12 } from "@/components/sections/cta/cta-12";
import { roofing } from "@/content/industries/roofing";

export const metadata: Metadata = { title: roofing.meta.title, description: roofing.meta.description };

export default function RoofingPage() {
  return (
    <>
      <PageHero
        heading={roofing.hero}
        image={{
          src: "https://images.unsplash.com/photo-1632759145351-1d592919f522?auto=format&fit=crop&w=1600&q=80",
          alt: "A roofer standing on a residential roof mid job",
        }}
        ctas={roofing.hero.ctas}
      />
      <Feature01 heading={roofing.build.heading} features={roofing.build.features} />
      <Faq01 heading={roofing.faq.heading} items={roofing.faq.items} cta={roofing.faq.cta} />
      <Cta12 heading={roofing.cta.heading} primary={roofing.cta.primary} image={roofing.cta.image} />
    </>
  );
}
