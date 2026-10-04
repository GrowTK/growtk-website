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
import { roofing } from "@/content/industries/roofing";
import type { FaqItem } from "@/content/types";

const theme = themeFor("roofing");

export const metadata: Metadata = { title: roofing.meta.title, description: roofing.meta.description };

const faqJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: roofing.faq.items.map((item: FaqItem) => ({
    "@type": "Question",
    name: item.q,
    acceptedAnswer: {
      "@type": "Answer",
      text: item.a,
    },
  })),
};

export default function RoofingPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />
      <BreadcrumbJsonLd
        items={[
          { name: "Industries", path: "/industries" },
          { name: "Roofing", path: "/industries/roofing" },
        ]}
      />
      <IndustryHero
        heading={roofing.hero}
        ctas={roofing.hero.ctas}
        tone={theme.tone}
        figure={<TradeFigure name={theme.icon} gradient={{ angle: 0, from: "#ffffff", to: "#ffffff" }} />}
      />
      <IndustryServices heading={roofing.build.heading} features={roofing.build.features} tone={theme.tone} />
      <IndustryServicesStrip tone={theme.tone} />
      <IndustryFaq heading={roofing.faq.heading} items={roofing.faq.items} cta={roofing.faq.cta} tone={theme.tone} />
      <IndustryCta heading={roofing.cta.heading} primary={roofing.cta.primary} tone={theme.tone} figureLabel={home.hero.figureLabel} />
    </>
  );
}
