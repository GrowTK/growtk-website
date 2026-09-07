import type { Metadata } from "next";
import { PageHero } from "@/components/page-hero";
import { Feature01 } from "@/components/sections/features/feature-01";
import { Faq03 } from "@/components/sections/faq/faq-03";
import { RelatedLinks } from "@/components/sections/services/related-links";
import { Cta12 } from "@/components/sections/cta/cta-12";
import { BreadcrumbJsonLd } from "@/components/seo/breadcrumb-jsonld";
import { hvac } from "@/content/industries/hvac";
import { services } from "@/content/services";
import type { FaqItem } from "@/content/types";

export const metadata: Metadata = { title: hvac.meta.title, description: hvac.meta.description };

const faqJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: hvac.faq.items.map((item: FaqItem) => ({
    "@type": "Question",
    name: item.q,
    acceptedAnswer: {
      "@type": "Answer",
      text: item.a,
    },
  })),
};

export default function HvacPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />
      <BreadcrumbJsonLd
        items={[
          { name: "Industries", path: "/industries" },
          { name: "HVAC", path: "/industries/hvac" },
        ]}
      />
      <PageHero
        heading={hvac.hero}
        image={{
          src: "https://images.unsplash.com/photo-1700124113583-81aa99ea2aa2?auto=format&fit=crop&w=1600&q=80",
          alt: "A modern heat pump and air conditioning unit mounted on the exterior wall of a house",
        }}
        ctas={hvac.hero.ctas}
      />
      <Feature01 heading={hvac.build.heading} features={hvac.build.features} />
      <Faq03 heading={hvac.faq.heading} items={hvac.faq.items} cta={hvac.faq.cta} />
      <RelatedLinks
        eyebrow="Built from these services"
        links={services.services.map((s) => ({ label: s.title, href: `/services#${s.id}` }))}
      />
      <Cta12 heading={hvac.cta.heading} primary={hvac.cta.primary} image={hvac.cta.image} />
    </>
  );
}
