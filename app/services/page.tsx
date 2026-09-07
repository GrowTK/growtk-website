import type { Metadata } from "next";
import { PageHero } from "@/components/page-hero";
import { ProcessSteps } from "@/components/sections/services/process-steps";
import { ServicesList } from "@/components/sections/services/services-list";
import { RelatedLinks } from "@/components/sections/services/related-links";
import { Faq07 } from "@/components/sections/faq/faq-07";
import { Cta12 } from "@/components/sections/cta/cta-12";
import { BreadcrumbJsonLd } from "@/components/seo/breadcrumb-jsonld";
import { services } from "@/content/services";
import type { FaqItem } from "@/content/types";

export const metadata: Metadata = { title: services.meta.title, description: services.meta.description };

const faqJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: services.faq.items.map((item: FaqItem) => ({
    "@type": "Question",
    name: item.q,
    acceptedAnswer: {
      "@type": "Answer",
      text: item.a,
    },
  })),
};

export default function ServicesPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />
      <BreadcrumbJsonLd items={[{ name: "Services", path: "/services" }]} />
      <PageHero
        heading={services.hero}
        image={{
          src: "https://images.unsplash.com/photo-1559523182-a284c3fb7cff?auto=format&fit=crop&w=1600&q=80",
          alt: "Three people working together on laptops at a shared table",
        }}
        ctas={services.hero.ctas}
      />

      <ProcessSteps heading={services.process.heading} steps={services.process.steps} />

      <ServicesList items={services.services} />

      <RelatedLinks
        eyebrow="Built for your industry"
        links={[
          { label: "Roofing", href: "/industries/roofing" },
          { label: "Railing and fencing", href: "/industries/railing-fencing" },
          { label: "Healthcare", href: "/industries/healthcare" },
          { label: "All industries", href: "/industries" },
          { label: "Stuck with a vibe-coded app", href: "/code-cleanup" },
        ]}
      />

      <Faq07 heading={services.faq.heading} items={services.faq.items} cta={services.faq.cta} />

      <Cta12
        heading={services.cta.heading}
        primary={services.cta.primary}
        image={{
          src: "https://images.unsplash.com/photo-1541746972996-4e0b0f43e02a?auto=format&fit=crop&w=1920&q=80",
          alt: "A small group of people talking together in a bright, modern office",
        }}
      />
    </>
  );
}
