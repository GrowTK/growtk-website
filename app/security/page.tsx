import type { Metadata } from "next";
import { IndustryHero } from "@/components/sections/industries/industry-hero";
import { IndustryFaq } from "@/components/sections/industries/industry-faq";
import { IndustryCta } from "@/components/sections/industries/industry-cta";
import { TradeFigure } from "@/components/sections/industries/trade-figure";
import { Feature04 } from "@/components/sections/features/feature-04";
import { Feature06 } from "@/components/sections/features/feature-06";
import { Wash, washTone } from "@/components/sections/company/wash";
import { BreadcrumbJsonLd } from "@/components/seo/breadcrumb-jsonld";
import { security as p } from "@/content/company";
import { home } from "@/content/home";

export const metadata: Metadata = { title: p.meta.title, description: p.meta.description };

export default function SecurityPage() {
  return (
    <>
      <BreadcrumbJsonLd items={[{ name: "Security", path: "/security" }]} />
      <IndustryHero heading={p.hero} ctas={p.hero.ctas} tone={washTone("lilac")} backdrop={<Wash name="lilac" />} figure={<TradeFigure set="service" name="connect" gradient={{ angle: 0, from: "#ffffff", to: "#ffffff" }} />} />
      <Feature06 heading={p.controls.heading} features={p.controls.items} />
      <Feature04 heading={p.practice.heading} features={p.practice.items} />
      <IndustryFaq heading={p.faq.heading} items={p.faq.items} cta={p.faq.cta} tone={washTone("peach")} helpBackdrop={<Wash name="peach" />} />
      <IndustryCta heading={p.cta.heading} primary={p.cta.primary} tone={washTone("apricot")} backdrop={<Wash name="apricot" />} figureLabel={home.hero.figureLabel} />
    </>
  );
}
