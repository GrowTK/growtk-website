import type { Metadata } from "next";
import { PageHero } from "@/components/page-hero";
import { ProcessSteps } from "@/components/sections/services/process-steps";
import { Faq03 } from "@/components/sections/faq/faq-03";
import { Cta12 } from "@/components/sections/cta/cta-12";
import { BreadcrumbJsonLd } from "@/components/seo/breadcrumb-jsonld";
import { process } from "@/content/process";
import type { FaqItem } from "@/content/types";

export const metadata: Metadata = { title: process.meta.title, description: process.meta.description };

const faqJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: process.faq.items.map((item: FaqItem) => ({
    "@type": "Question",
    name: item.q,
    acceptedAnswer: {
      "@type": "Answer",
      text: item.a,
    },
  })),
};

export default function ProcessPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />
      <BreadcrumbJsonLd items={[{ name: "How we work", path: "/process" }]} />
      <PageHero
        heading={process.hero}
        image={{
          src: "https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&w=1600&q=80",
          alt: "A small team gathered around a table during a planning session, one person adding sticky notes to a wall",
        }}
        ctas={process.hero.ctas}
      />

      <ProcessSteps heading={process.steps.heading} steps={process.steps.items} />

      <Faq03 heading={process.faq.heading} items={process.faq.items} cta={process.faq.cta} />

      <Cta12
        heading={process.cta.heading}
        primary={process.cta.primary}
        image={{
          src: "https://images.unsplash.com/photo-1521737604893-d14cc237f11d?auto=format&fit=crop&w=1920&q=80",
          alt: "Two people shaking hands across a table after agreeing on a plan",
        }}
      />
    </>
  );
}
