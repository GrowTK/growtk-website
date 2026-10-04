import type { Metadata } from "next";
import { IndustryHero } from "@/components/sections/industries/industry-hero";
import { IndustryCta } from "@/components/sections/industries/industry-cta";
import { TradeFigure } from "@/components/sections/industries/trade-figure";
import { themeFor } from "@/components/sections/industries/industry-tones";
import { home } from "@/content/home";
import { IndustryServices } from "@/components/sections/industries/industry-services";
import { IndustryFaq } from "@/components/sections/industries/industry-faq";
import { IndustryServicesStrip } from "@/components/sections/industries/industry-services-strip";
import { BreadcrumbJsonLd } from "@/components/seo/breadcrumb-jsonld";
import { plumbing } from "@/content/industries/plumbing";
import type { FaqItem } from "@/content/types";

const theme = themeFor("plumbing");

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
      <IndustryHero
        heading={plumbing.hero}
        ctas={plumbing.hero.ctas}
        tone={theme.tone}
        figure={<TradeFigure name={theme.icon} gradient={{ angle: 0, from: "#ffffff", to: "#ffffff" }} />}
      />
      <IndustryServices heading={plumbing.build.heading} features={plumbing.build.features} tone={theme.tone} />
      <IndustryServicesStrip tone={theme.tone} />
      <IndustryFaq heading={plumbing.faq.heading} items={plumbing.faq.items} cta={plumbing.faq.cta} tone={theme.tone} />
      <IndustryCta heading={plumbing.cta.heading} primary={plumbing.cta.primary} tone={theme.tone} figureLabel={home.hero.figureLabel} />
    </>
  );
}
