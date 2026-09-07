import type { Metadata } from "next";
import { PageHero } from "@/components/page-hero";
import { Feature01 } from "@/components/sections/features/feature-01";
import { Faq03 } from "@/components/sections/faq/faq-03";
import { Cta12 } from "@/components/sections/cta/cta-12";
import { BreadcrumbJsonLd } from "@/components/seo/breadcrumb-jsonld";
import { codeCleanup } from "@/content/code-cleanup";
import type { FaqItem } from "@/content/types";

export const metadata: Metadata = { title: codeCleanup.meta.title, description: codeCleanup.meta.description };

const faqJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: codeCleanup.faq.items.map((item: FaqItem) => ({
    "@type": "Question",
    name: item.q,
    acceptedAnswer: {
      "@type": "Answer",
      text: item.a,
    },
  })),
};

export default function CodeCleanupPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />
      <BreadcrumbJsonLd items={[{ name: "Code cleanup", path: "/code-cleanup" }]} />
      <PageHero
        heading={codeCleanup.hero}
        image={{
          src: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=1600&q=80",
          alt: "A close-up of a laptop screen showing lines of colorful code in a dark-themed editor",
        }}
        ctas={codeCleanup.hero.ctas}
      />
      <Feature01 heading={codeCleanup.build.heading} features={codeCleanup.build.features} />
      <Faq03 heading={codeCleanup.faq.heading} items={codeCleanup.faq.items} cta={codeCleanup.faq.cta} />
      <Cta12 heading={codeCleanup.cta.heading} primary={codeCleanup.cta.primary} image={codeCleanup.cta.image} />
    </>
  );
}
