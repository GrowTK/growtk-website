import type { Metadata } from "next";
import { PageHero } from "@/components/page-hero";
import { Feature01 } from "@/components/sections/features/feature-01";
import { Faq03 } from "@/components/sections/faq/faq-03";
import { RelatedLinks } from "@/components/sections/services/related-links";
import { Cta12 } from "@/components/sections/cta/cta-12";
import { BreadcrumbJsonLd } from "@/components/seo/breadcrumb-jsonld";
import { cleaning } from "@/content/industries/cleaning";
import { services } from "@/content/services";
import type { FaqItem } from "@/content/types";

export const metadata: Metadata = { title: cleaning.meta.title, description: cleaning.meta.description };

const faqJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: cleaning.faq.items.map((item: FaqItem) => ({
    "@type": "Question",
    name: item.q,
    acceptedAnswer: {
      "@type": "Answer",
      text: item.a,
    },
  })),
};

export default function CleaningPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />
      <BreadcrumbJsonLd
        items={[
          { name: "Industries", path: "/industries" },
          { name: "Cleaning", path: "/industries/cleaning" },
        ]}
      />
      <PageHero
        heading={cleaning.hero}
        image={{
          src: "https://images.unsplash.com/photo-1580256081112-e49377338b7f?auto=format&fit=crop&w=1600&q=80",
          alt: "A cleaning cart with supplies parked in a hotel hallway",
        }}
        ctas={cleaning.hero.ctas}
      />
      <Feature01 heading={cleaning.build.heading} features={cleaning.build.features} />
      <Faq03 heading={cleaning.faq.heading} items={cleaning.faq.items} cta={cleaning.faq.cta} />
      <RelatedLinks
        eyebrow="Built from these services"
        links={services.services.map((s) => ({ label: s.title, href: `/services#${s.id}` }))}
      />
      <Cta12 heading={cleaning.cta.heading} primary={cleaning.cta.primary} image={cleaning.cta.image} />
    </>
  );
}
