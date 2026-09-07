import type { Metadata } from "next";
import { PageHero } from "@/components/page-hero";
import { Feature01 } from "@/components/sections/features/feature-01";
import { Faq03 } from "@/components/sections/faq/faq-03";
import { RelatedLinks } from "@/components/sections/services/related-links";
import { Cta12 } from "@/components/sections/cta/cta-12";
import { BreadcrumbJsonLd } from "@/components/seo/breadcrumb-jsonld";
import { plumbing } from "@/content/industries/plumbing";
import { services } from "@/content/services";
import type { FaqItem } from "@/content/types";

export const metadata: Metadata = { title: plumbing.meta.title, description: plumbing.meta.description };

const faqJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: plumbing.faq.items.map((item: FaqItem) => ({
    "@type": "Question",
    name: item.q,
    acceptedAnswer: {
      "@type": "Answer",
      text: item.a,
    },
  })),
};

export default function PlumbingPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />
      <BreadcrumbJsonLd
        items={[
          { name: "Industries", path: "/industries" },
          { name: "Plumbing", path: "/industries/plumbing" },
        ]}
      />
      <PageHero
        heading={plumbing.hero}
        image={{
          src: "https://images.unsplash.com/photo-1600566752355-35792bedcfea?auto=format&fit=crop&w=1600&q=80",
          alt: "A modern bathroom with a freestanding tub, shower and plumbing fixtures",
        }}
        ctas={plumbing.hero.ctas}
      />
      <Feature01 heading={plumbing.build.heading} features={plumbing.build.features} />
      <Faq03 heading={plumbing.faq.heading} items={plumbing.faq.items} cta={plumbing.faq.cta} />
      <RelatedLinks
        eyebrow="Built from these services"
        links={services.services.map((s) => ({ label: s.title, href: `/services#${s.id}` }))}
      />
      <Cta12 heading={plumbing.cta.heading} primary={plumbing.cta.primary} image={plumbing.cta.image} />
    </>
  );
}
