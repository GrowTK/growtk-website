import type { Metadata } from "next";
import { PageHero } from "@/components/page-hero";
import { SecurityArchitecture } from "@/components/sections/security/security-architecture";
import { Faq03 } from "@/components/sections/faq/faq-03";
import { Cta12 } from "@/components/sections/cta/cta-12";
import { security } from "@/content/security";

export const metadata: Metadata = { title: security.meta.title, description: security.meta.description };

export default function SecurityPage() {
  return (
    <>
      <PageHero heading={security.hero} image={security.hero.image} />
      <SecurityArchitecture
        heading={security.architecture.heading}
        layers={security.architecture.layers}
        note={security.architecture.note}
        honesty={security.architecture.honesty}
      />
      <Faq03 heading={security.faq.heading} items={security.faq.items} cta={security.faq.cta} />
      <Cta12
        heading={security.cta.heading}
        primary={security.cta.primary}
        image={{ src: "/brand/blue-blur.jpg", alt: "" }}
      />
    </>
  );
}
