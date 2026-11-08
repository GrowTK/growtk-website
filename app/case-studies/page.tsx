import type { Metadata } from "next";
import { IndustryHero } from "@/components/sections/industries/industry-hero";
import { IndustryCta } from "@/components/sections/industries/industry-cta";
import { TradeFigure } from "@/components/sections/industries/trade-figure";
import { Feature06 } from "@/components/sections/features/feature-06";
import { ProjectsShowcase } from "@/components/sections/projects/projects-showcase";
import { Wash, washTone } from "@/components/sections/company/wash";
import { BreadcrumbJsonLd } from "@/components/seo/breadcrumb-jsonld";
import { caseStudiesHub as p } from "@/content/company";
import { projectsShowcase } from "@/content/projects";
import { home } from "@/content/home";

export const metadata: Metadata = { title: p.meta.title, description: p.meta.description };

export default function CaseStudiesPage() {
  return (
    <>
      <BreadcrumbJsonLd items={[{ name: "Case studies", path: "/case-studies" }]} />
      <IndustryHero heading={p.hero} ctas={p.hero.ctas} tone={washTone("blob")} backdrop={<Wash name="blob" />} figure={<TradeFigure set="service" name="rank" gradient={{ angle: 0, from: "#ffffff", to: "#ffffff" }} />} />
      <ProjectsShowcase heading={p.grid} items={projectsShowcase.items} />
      <Feature06 heading={p.common.heading} features={p.common.items} />
      <IndustryCta heading={p.cta.heading} primary={p.cta.primary} tone={washTone("apricot")} backdrop={<Wash name="apricot" />} figureLabel={home.hero.figureLabel} />
    </>
  );
}
