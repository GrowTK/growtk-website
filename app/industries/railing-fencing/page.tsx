import type { Metadata } from "next";
import { PageHero } from "@/components/page-hero";
import { Feature01 } from "@/components/sections/features/feature-01";
import { Faq03 } from "@/components/sections/faq/faq-03";
import { RelatedLinks } from "@/components/sections/services/related-links";
import { Cta12 } from "@/components/sections/cta/cta-12";
import { BreadcrumbJsonLd } from "@/components/seo/breadcrumb-jsonld";
import { railingFencing } from "@/content/industries/railing-fencing";
import { services } from "@/content/services";
import type { FaqItem } from "@/content/types";

export const metadata: Metadata = { title: railingFencing.meta.title, description: railingFencing.meta.description };

const faqJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: railingFencing.faq.items.map((item: FaqItem) => ({
    "@type": "Question",
    name: item.q,
    acceptedAnswer: {
      "@type": "Answer",
      text: item.a,
    },
  })),
};

export default function RailingFencingPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />
      <BreadcrumbJsonLd
        items={[
          { name: "Industries", path: "/industries" },
          { name: "Railing and fencing", path: "/industries/railing-fencing" },
        ]}
      />
      <PageHero
        heading={railingFencing.hero}
        image={{
          src: "https://images.unsplash.com/photo-1604015641586-6fa03629f976?auto=format&fit=crop&w=1600&q=80",
          alt: "A wooden fence running along a property line under a clear sky",
        }}
        ctas={railingFencing.hero.ctas}
      />
      <Feature01 heading={railingFencing.build.heading} features={railingFencing.build.features} />
      <Faq03 heading={railingFencing.faq.heading} items={railingFencing.faq.items} cta={railingFencing.faq.cta} />
      <RelatedLinks
        eyebrow="Built from these services"
        links={services.services.map((s) => ({ label: s.title, href: `/services#${s.id}` }))}
      />
      <Cta12 heading={railingFencing.cta.heading} primary={railingFencing.cta.primary} image={railingFencing.cta.image} />
    </>
  );
}
