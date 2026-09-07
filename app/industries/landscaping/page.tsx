import type { Metadata } from "next";
import { PageHero } from "@/components/page-hero";
import { Feature01 } from "@/components/sections/features/feature-01";
import { Faq03 } from "@/components/sections/faq/faq-03";
import { RelatedLinks } from "@/components/sections/services/related-links";
import { Cta12 } from "@/components/sections/cta/cta-12";
import { BreadcrumbJsonLd } from "@/components/seo/breadcrumb-jsonld";
import { landscaping } from "@/content/industries/landscaping";
import { services } from "@/content/services";
import type { FaqItem } from "@/content/types";

export const metadata: Metadata = { title: landscaping.meta.title, description: landscaping.meta.description };

const faqJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: landscaping.faq.items.map((item: FaqItem) => ({
    "@type": "Question",
    name: item.q,
    acceptedAnswer: {
      "@type": "Answer",
      text: item.a,
    },
  })),
};

export default function LandscapingPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />
      <BreadcrumbJsonLd
        items={[
          { name: "Industries", path: "/industries" },
          { name: "Landscaping", path: "/industries/landscaping" },
        ]}
      />
      <PageHero
        heading={landscaping.hero}
        image={{
          src: "https://images.unsplash.com/photo-1558904541-efa843a96f01?auto=format&fit=crop&w=1600&q=80",
          alt: "A close-up of a freshly maintained green lawn in front of modern buildings",
        }}
        ctas={landscaping.hero.ctas}
      />
      <Feature01 heading={landscaping.build.heading} features={landscaping.build.features} />
      <Faq03 heading={landscaping.faq.heading} items={landscaping.faq.items} cta={landscaping.faq.cta} />
      <RelatedLinks
        eyebrow="Built from these services"
        links={services.services.map((s) => ({ label: s.title, href: `/services#${s.id}` }))}
      />
      <Cta12 heading={landscaping.cta.heading} primary={landscaping.cta.primary} image={landscaping.cta.image} />
    </>
  );
}
