import type { Metadata } from "next";
import { PageHero } from "@/components/page-hero";
import { Feature01 } from "@/components/sections/features/feature-01";
import { Faq03 } from "@/components/sections/faq/faq-03";
import { RelatedLinks } from "@/components/sections/services/related-links";
import { Cta12 } from "@/components/sections/cta/cta-12";
import { BreadcrumbJsonLd } from "@/components/seo/breadcrumb-jsonld";
import { pestControl } from "@/content/industries/pest-control";
import { services } from "@/content/services";
import type { FaqItem } from "@/content/types";

export const metadata: Metadata = { title: pestControl.meta.title, description: pestControl.meta.description };

const faqJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: pestControl.faq.items.map((item: FaqItem) => ({
    "@type": "Question",
    name: item.q,
    acceptedAnswer: {
      "@type": "Answer",
      text: item.a,
    },
  })),
};

export default function PestControlPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />
      <BreadcrumbJsonLd
        items={[
          { name: "Industries", path: "/industries" },
          { name: "Pest control", path: "/industries/pest-control" },
        ]}
      />
      <PageHero
        heading={pestControl.hero}
        image={{
          src: "https://images.unsplash.com/photo-1598228723793-52759bba239c?auto=format&fit=crop&w=1600&q=80",
          alt: "A suburban house exterior with a well-kept lawn and landscaping",
        }}
        ctas={pestControl.hero.ctas}
      />
      <Feature01 heading={pestControl.build.heading} features={pestControl.build.features} />
      <Faq03 heading={pestControl.faq.heading} items={pestControl.faq.items} cta={pestControl.faq.cta} />
      <RelatedLinks
        eyebrow="Built from these services"
        links={services.services.map((s) => ({ label: s.title, href: `/services#${s.id}` }))}
      />
      <Cta12 heading={pestControl.cta.heading} primary={pestControl.cta.primary} image={pestControl.cta.image} />
    </>
  );
}
