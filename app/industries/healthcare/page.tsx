import type { Metadata } from "next";
import { PageHero } from "@/components/page-hero";
import { Feature01 } from "@/components/sections/features/feature-01";
import { Faq03 } from "@/components/sections/faq/faq-03";
import { RelatedLinks } from "@/components/sections/services/related-links";
import { Cta12 } from "@/components/sections/cta/cta-12";
import { BreadcrumbJsonLd } from "@/components/seo/breadcrumb-jsonld";
import { healthcare } from "@/content/industries/healthcare";
import { services } from "@/content/services";
import type { FaqItem } from "@/content/types";

export const metadata: Metadata = { title: healthcare.meta.title, description: healthcare.meta.description };

const faqJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: healthcare.faq.items.map((item: FaqItem) => ({
    "@type": "Question",
    name: item.q,
    acceptedAnswer: {
      "@type": "Answer",
      text: item.a,
    },
  })),
};

export default function HealthcarePage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />
      <BreadcrumbJsonLd
        items={[
          { name: "Industries", path: "/industries" },
          { name: "Healthcare", path: "/industries/healthcare" },
        ]}
      />
      <PageHero
        heading={healthcare.hero}
        image={{
          src: "https://images.unsplash.com/photo-1637711805966-c5181f89ddb6?auto=format&fit=crop&w=1600&q=80",
          alt: "A clean, modern reception desk in a healthcare practice lobby",
        }}
        ctas={healthcare.hero.ctas}
      />
      <Feature01 heading={healthcare.build.heading} features={healthcare.build.features} />
      <Faq03 heading={healthcare.faq.heading} items={healthcare.faq.items} cta={healthcare.faq.cta} />
      <RelatedLinks
        eyebrow="Built from these services"
        links={services.services.map((s) => ({ label: s.title, href: `/services#${s.id}` }))}
      />
      <Cta12 heading={healthcare.cta.heading} primary={healthcare.cta.primary} image={healthcare.cta.image} />
    </>
  );
}
