import type { Metadata } from "next";
import { IndustryFaq } from "@/components/sections/industries/industry-faq";
import { IndustryCta } from "@/components/sections/industries/industry-cta";
import { Feature04 } from "@/components/sections/features/feature-04";
import { Wash, washTone } from "@/components/sections/company/wash";
import { ChannelRow, SolutionGroupCards, SolutionsHubHero } from "@/components/sections/solutions/solutions-hub";
import { OutcomeSpotlight } from "@/components/sections/testimonials/outcome-spotlight";
import { BreadcrumbJsonLd } from "@/components/seo/breadcrumb-jsonld";
import { solutions, solutionsHub } from "@/content/solutions";
import { home } from "@/content/home";

export const metadata: Metadata = { title: solutionsHub.meta.title, description: solutionsHub.meta.description };

export default function SolutionsPage() {
  return (
    <>
      <BreadcrumbJsonLd items={[{ name: solutionsHub.labels.breadcrumb, path: "/solutions" }]} />
      <SolutionsHubHero heading={solutionsHub.hero} ctas={solutionsHub.hero.ctas} mocks={solutions.map((s) => s.mock)} />
      <ChannelRow heading={solutionsHub.channels.heading} items={solutionsHub.channels.items} />
      {solutionsHub.groups.map((g, i) => (
        <SolutionGroupCards
          key={g.id}
          index={i}
          exploreLabel={solutionsHub.labels.explore}
          heading={{ eyebrow: g.eyebrow, title: g.title, body: g.body }}
          items={solutions
            .filter((s) => s.group === g.id)
            .map((s) => ({ name: s.name, teaser: s.teaser, href: `/solutions/${s.slug}`, mock: s.mock, icon: s.icon, points: solutionsHub.cardPoints[s.slug] ?? [] }))}
        />
      ))}
      <OutcomeSpotlight heading={home.testimonials.heading} items={home.testimonials.items} />
      <Feature04 heading={solutionsHub.built.heading} features={solutionsHub.built.items} />
      <IndustryFaq heading={solutionsHub.faq.heading} items={solutionsHub.faq.items} cta={solutionsHub.faq.cta} tone={washTone("peach")} helpBackdrop={<Wash name="peach" />} />
      <IndustryCta heading={solutionsHub.cta.heading} primary={solutionsHub.cta.primary} tone={washTone("apricot")} backdrop={<Wash name="apricot" />} figureLabel={home.hero.figureLabel} />
    </>
  );
}
