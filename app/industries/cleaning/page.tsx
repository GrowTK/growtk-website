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
import { cleaning } from "@/content/industries/cleaning";
import type { FaqItem } from "@/content/types";

const theme = themeFor("cleaning");

export const metadata: Metadata = { title: cleaning.meta.title, description: cleaning.meta.description };

const faqJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: cleaning.faq.items.map((item: FaqItem) => ({
    "@type": "Question",
    name: item.q,
    acceptedAnswer: {
      "@type": "Answer",
      text: item.a,
    },
  })),
};

export default function CleaningPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />
      <BreadcrumbJsonLd
        items={[
          { name: "Industries", path: "/industries" },
          { name: "Cleaning", path: "/industries/cleaning" },
        ]}
      />
      <IndustryHero
        heading={cleaning.hero}
        ctas={cleaning.hero.ctas}
        tone={theme.tone}
        figure={<TradeFigure name={theme.icon} gradient={{ angle: 0, from: "#ffffff", to: "#ffffff" }} />}
      />
      <IndustryServices heading={cleaning.build.heading} features={cleaning.build.features} tone={theme.tone} />
      <IndustryServicesStrip tone={theme.tone} />
      <IndustryFaq heading={cleaning.faq.heading} items={cleaning.faq.items} cta={cleaning.faq.cta} tone={theme.tone} />
      <IndustryCta heading={cleaning.cta.heading} primary={cleaning.cta.primary} tone={theme.tone} figureLabel={home.hero.figureLabel} />
    </>
  );
}
