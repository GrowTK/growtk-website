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
import { railingFencing } from "@/content/industries/railing-fencing";
import type { FaqItem } from "@/content/types";

const theme = themeFor("railing-fencing");

export const metadata: Metadata = { title: railingFencing.meta.title, description: railingFencing.meta.description };

const faqJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: railingFencing.faq.items.map((item: FaqItem) => ({
    "@type": "Question",
    name: item.q,
    acceptedAnswer: {
      "@type": "Answer",
      text: item.a,
    },
  })),
};

export default function RailingFencingPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />
      <BreadcrumbJsonLd
        items={[
          { name: "Industries", path: "/industries" },
          { name: "Railing and fencing", path: "/industries/railing-fencing" },
        ]}
      />
      <IndustryHero
        heading={railingFencing.hero}
        ctas={railingFencing.hero.ctas}
        tone={theme.tone}
        figure={<TradeFigure name={theme.icon} gradient={{ angle: 0, from: "#ffffff", to: "#ffffff" }} />}
      />
      <IndustryServices heading={railingFencing.build.heading} features={railingFencing.build.features} tone={theme.tone} />
      <IndustryServicesStrip tone={theme.tone} />
      <IndustryFaq heading={railingFencing.faq.heading} items={railingFencing.faq.items} cta={railingFencing.faq.cta} tone={theme.tone} />
      <IndustryCta heading={railingFencing.cta.heading} primary={railingFencing.cta.primary} tone={theme.tone} figureLabel={home.hero.figureLabel} />
    </>
  );
}
