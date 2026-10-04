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
import { healthcare } from "@/content/industries/healthcare";
import type { FaqItem } from "@/content/types";

const theme = themeFor("healthcare");

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
      <IndustryHero
        heading={healthcare.hero}
        ctas={healthcare.hero.ctas}
        tone={theme.tone}
        figure={<TradeFigure name={theme.icon} gradient={{ angle: 0, from: "#ffffff", to: "#ffffff" }} />}
      />
      <IndustryServices heading={healthcare.build.heading} features={healthcare.build.features} tone={theme.tone} />
      <IndustryServicesStrip tone={theme.tone} />
      <IndustryFaq heading={healthcare.faq.heading} items={healthcare.faq.items} cta={healthcare.faq.cta} tone={theme.tone} />
      <IndustryCta heading={healthcare.cta.heading} primary={healthcare.cta.primary} tone={theme.tone} figureLabel={home.hero.figureLabel} />
    </>
  );
}
