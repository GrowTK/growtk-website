import type { Metadata } from "next";
import { IndustryHero } from "@/components/sections/industries/industry-hero";
import { IndustryCta } from "@/components/sections/industries/industry-cta";
import { IndustryServicesStrip } from "@/components/sections/industries/industry-services-strip";
import { TradeFigure } from "@/components/sections/industries/trade-figure";
import { HUB_TONE } from "@/components/sections/industries/industry-tones";
import { Feature04 } from "@/components/sections/features/feature-04";
import { Feature06 } from "@/components/sections/features/feature-06";
import { LogoMarqueeBand } from "@/components/sections/logos/logo-marquee-band";
import { Wash, washTone } from "@/components/sections/company/wash";
import { BreadcrumbJsonLd } from "@/components/seo/breadcrumb-jsonld";
import { technology as p } from "@/content/company";
import { solutions } from "@/content/solutions";
import { home } from "@/content/home";

export const metadata: Metadata = { title: p.meta.title, description: p.meta.description };

export default function TechnologyPage() {
  return (
    <>
      <BreadcrumbJsonLd items={[{ name: "Technology", path: "/technology" }]} />
      <IndustryHero heading={p.hero} ctas={p.hero.ctas} tone={washTone("apricot")} backdrop={<Wash name="apricot" />} figure={<TradeFigure set="service" name="schedule" gradient={{ angle: 0, from: "#ffffff", to: "#ffffff" }} />} />
      <Feature06 heading={p.stack.heading} features={p.stack.items} />
      <IndustryServicesStrip tone={HUB_TONE} heading={p.suite} items={solutions.map((s) => ({ icon: s.icon, name: s.name, href: `/solutions/${s.slug}` }))} />
      <div className="h-20 lg:h-28" aria-hidden />
      <Feature04 heading={p.build.heading} features={p.build.items} />
      <LogoMarqueeBand heading={home.integrations.heading} logos={home.integrations.logos} />
      <IndustryCta heading={p.cta.heading} primary={p.cta.primary} tone={washTone("peach")} backdrop={<Wash name="peach" />} figureLabel={home.hero.figureLabel} />
    </>
  );
}
