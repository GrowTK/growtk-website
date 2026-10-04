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
import { landscaping } from "@/content/industries/landscaping";
import type { FaqItem } from "@/content/types";

const theme = themeFor("landscaping");

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
      <IndustryHero
        heading={landscaping.hero}
        ctas={landscaping.hero.ctas}
        tone={theme.tone}
        figure={<TradeFigure name={theme.icon} gradient={{ angle: 0, from: "#ffffff", to: "#ffffff" }} />}
      />
      <IndustryServices heading={landscaping.build.heading} features={landscaping.build.features} tone={theme.tone} />
      <IndustryServicesStrip tone={theme.tone} />
      <IndustryFaq heading={landscaping.faq.heading} items={landscaping.faq.items} cta={landscaping.faq.cta} tone={theme.tone} />
      <IndustryCta heading={landscaping.cta.heading} primary={landscaping.cta.primary} tone={theme.tone} figureLabel={home.hero.figureLabel} />
    </>
  );
}
