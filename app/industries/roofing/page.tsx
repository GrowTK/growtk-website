import type { Metadata } from "next";
import { PageHero } from "@/components/page-hero";
import { Feature01 } from "@/components/sections/features/feature-01";
import { Faq03 } from "@/components/sections/faq/faq-03";
import { RelatedLinks } from "@/components/sections/services/related-links";
import { Cta12 } from "@/components/sections/cta/cta-12";
import { BreadcrumbJsonLd } from "@/components/seo/breadcrumb-jsonld";
import { roofing } from "@/content/industries/roofing";
import { services } from "@/content/services";
import type { FaqItem } from "@/content/types";

export const metadata: Metadata = { title: roofing.meta.title, description: roofing.meta.description };

const faqJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: roofing.faq.items.map((item: FaqItem) => ({
    "@type": "Question",
    name: item.q,
    acceptedAnswer: {
      "@type": "Answer",
      text: item.a,
    },
  })),
};

export default function RoofingPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />
      <BreadcrumbJsonLd
        items={[
          { name: "Industries", path: "/industries" },
          { name: "Roofing", path: "/industries/roofing" },
        ]}
      />
      <PageHero
        heading={roofing.hero}
        image={{
          src: "https://images.unsplash.com/photo-1632759145351-1d592919f522?auto=format&fit=crop&w=1600&q=80",
          alt: "A roofer standing on a residential roof mid job",
        }}
        ctas={roofing.hero.ctas}
      />
      <Feature01 heading={roofing.build.heading} features={roofing.build.features} />
      <Faq03 heading={roofing.faq.heading} items={roofing.faq.items} cta={roofing.faq.cta} />
      <RelatedLinks
        eyebrow="Built from these services"
        links={services.services.map((s) => ({ label: s.title, href: `/services#${s.id}` }))}
      />
      <Cta12 heading={roofing.cta.heading} primary={roofing.cta.primary} image={roofing.cta.image} />
    </>
  );
}
