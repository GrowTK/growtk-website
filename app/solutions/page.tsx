import type { Metadata } from "next";
import { IndustryHero } from "@/components/sections/industries/industry-hero";
import { IndustryServicesStrip } from "@/components/sections/industries/industry-services-strip";
import { IndustryFaq } from "@/components/sections/industries/industry-faq";
import { IndustryCta } from "@/components/sections/industries/industry-cta";
import { TradeFigure } from "@/components/sections/industries/trade-figure";
import { INDUSTRY_THEME } from "@/components/sections/industries/industry-tones";
import { Feature04 } from "@/components/sections/features/feature-04";
import { Wash, washTone } from "@/components/sections/company/wash";
import { BreadcrumbJsonLd } from "@/components/seo/breadcrumb-jsonld";
import { solutions, solutionsHub } from "@/content/solutions";
import { home } from "@/content/home";

export const metadata: Metadata = { title: solutionsHub.meta.title, description: solutionsHub.meta.description };

const tone = washTone("lilac");

export default function SolutionsPage() {
  return (
    <>
      <BreadcrumbJsonLd items={[{ name: solutionsHub.labels.breadcrumb, path: "/solutions" }]} />
      <IndustryHero
        heading={solutionsHub.hero}
        ctas={solutionsHub.hero.ctas}
        tone={tone}
        backdrop={<Wash name="lilac" />}
        figure={<TradeFigure set="service" name="site" gradient={{ angle: 0, from: "#ffffff", to: "#ffffff" }} />}
      />
      {solutionsHub.groups.map((g) => {
        const items = solutions.filter((s) => s.group === g.id);
        return (
          <IndustryServicesStrip
            key={g.id}
            tone={INDUSTRY_THEME[items[0]!.tone].tone}
            heading={{ eyebrow: g.eyebrow, title: g.title, body: g.body }}
            items={items.map((s) => ({ icon: s.icon, name: s.name, href: `/solutions/${s.slug}` }))}
          />
        );
      })}
      <div className="h-20 lg:h-28" aria-hidden />
      <Feature04 heading={solutionsHub.built.heading} features={solutionsHub.built.items} />
      <IndustryFaq heading={solutionsHub.faq.heading} items={solutionsHub.faq.items} cta={solutionsHub.faq.cta} tone={washTone("peach")} helpBackdrop={<Wash name="peach" />} />
      <IndustryCta heading={solutionsHub.cta.heading} primary={solutionsHub.cta.primary} tone={washTone("apricot")} backdrop={<Wash name="apricot" />} figureLabel={home.hero.figureLabel} />
    </>
  );
}
