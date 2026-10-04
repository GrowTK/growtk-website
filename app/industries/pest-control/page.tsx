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
import { pestControl } from "@/content/industries/pest-control";
import type { FaqItem } from "@/content/types";

const theme = themeFor("pest-control");

export const metadata: Metadata = { title: pestControl.meta.title, description: pestControl.meta.description };

const faqJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: pestControl.faq.items.map((item: FaqItem) => ({
    "@type": "Question",
    name: item.q,
    acceptedAnswer: {
      "@type": "Answer",
      text: item.a,
    },
  })),
};

export default function PestControlPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />
      <BreadcrumbJsonLd
        items={[
          { name: "Industries", path: "/industries" },
          { name: "Pest control", path: "/industries/pest-control" },
        ]}
      />
      <IndustryHero
        heading={pestControl.hero}
        ctas={pestControl.hero.ctas}
        tone={theme.tone}
        figure={<TradeFigure name={theme.icon} gradient={{ angle: 0, from: "#ffffff", to: "#ffffff" }} />}
      />
      <IndustryServices heading={pestControl.build.heading} features={pestControl.build.features} tone={theme.tone} />
      <IndustryServicesStrip tone={theme.tone} />
      <IndustryFaq heading={pestControl.faq.heading} items={pestControl.faq.items} cta={pestControl.faq.cta} tone={theme.tone} />
      <IndustryCta heading={pestControl.cta.heading} primary={pestControl.cta.primary} tone={theme.tone} figureLabel={home.hero.figureLabel} />
    </>
  );
}
