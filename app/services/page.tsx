import type { Metadata } from "next";
import { IndustryHero } from "@/components/sections/industries/industry-hero";
import { IndustryCta } from "@/components/sections/industries/industry-cta";
import { IndustryFaq } from "@/components/sections/industries/industry-faq";
import { IndustriesCarousel } from "@/components/sections/industries/industries-carousel";
import { TradeFigure } from "@/components/sections/industries/trade-figure";
import { Wash, washTone } from "@/components/sections/company/wash";
import { IndustryServicesStrip } from "@/components/sections/industries/industry-services-strip";
import { groupTone } from "@/components/sections/services/group-tone";
import { serviceGroups, servicePages } from "@/content/service-pages";
import { ProcessTrack } from "@/components/sections/services/process-track";
import { BreadcrumbJsonLd } from "@/components/seo/breadcrumb-jsonld";
import { services } from "@/content/services";
import { industries } from "@/content/industries";
import { home } from "@/content/home";
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

const tone = washTone("apricot");


export default function ServicesPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />
      <BreadcrumbJsonLd items={[{ name: "Services", path: "/services" }]} />

      <IndustryHero
        heading={services.hero}
        ctas={services.hero.ctas}
        tone={tone}
        backdrop={<Wash name="apricot" />}
        figure={<TradeFigure set="service" name="connect" gradient={{ angle: 0, from: "#ffffff", to: "#ffffff" }} />}
      />

      {serviceGroups.map((g) => (
        <IndustryServicesStrip
          key={g.id}
          tone={groupTone(g.id)}
          heading={{ eyebrow: services.groupsEyebrow, title: g.name, body: g.body }}
          items={servicePages.filter((p) => p.group === g.id).map((p) => ({ icon: p.icon, name: p.name, href: `/services/${p.slug}` }))}
        />
      ))}

      <ProcessTrack heading={services.process.heading} steps={services.process.steps} />

      <IndustriesCarousel
        heading={services.industries.heading}
        items={industries.map((i) => ({ name: i.cardName ?? i.name, teaser: i.teaser, href: i.href }))}
        cta={services.industries.cta}
      />

      <IndustryFaq heading={services.faq.heading} items={services.faq.items} cta={services.faq.cta} tone={washTone("lilac")} helpBackdrop={<Wash name="lilac" />} />

      <IndustryCta heading={services.cta.heading} primary={services.cta.primary} tone={washTone("peach")} backdrop={<Wash name="peach" />} figureLabel={home.hero.figureLabel} />
    </>
  );
}
