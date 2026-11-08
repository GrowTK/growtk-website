import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { IndustryHero } from "@/components/sections/industries/industry-hero";
import { IndustryFaq } from "@/components/sections/industries/industry-faq";
import { IndustryCta } from "@/components/sections/industries/industry-cta";
import { INDUSTRY_THEME } from "@/components/sections/industries/industry-tones";
import { ProcessSteps } from "@/components/sections/services/process-steps";
import { RelatedLinks } from "@/components/sections/services/related-links";
import { StatementReveal } from "@/components/sections/services/statement-reveal";
import { StackChips } from "@/components/sections/services/stack-chips";
import { ProductMock } from "@/components/sections/solutions/product-mock";
import {
  AudienceCards,
  CapabilityBento,
  CompareTable,
  GovernancePanel,
  OutcomeSplit,
  SpotlightSplit,
  mockGradient,
} from "@/components/sections/solutions/solution-sections";
import { BreadcrumbJsonLd } from "@/components/seo/breadcrumb-jsonld";
import { solutions, solutionBySlug, solutionsHub } from "@/content/solutions";
import { home } from "@/content/home";

export function generateStaticParams() {
  return solutions.map((s) => ({ slug: s.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const page = solutionBySlug((await params).slug);
  return page ? { title: page.meta.title, description: page.meta.description, alternates: { canonical: `/solutions/${page.slug}` } } : {};
}

export default async function SolutionPage({ params }: { params: Promise<{ slug: string }> }) {
  const page = solutionBySlug((await params).slug);
  if (!page) notFound();
  const tone = INDUSTRY_THEME[page.tone].tone;
  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: page.faq.items.map((item) => ({ "@type": "Question", name: item.q, acceptedAnswer: { "@type": "Answer", text: item.a } })),
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />
      <BreadcrumbJsonLd
        items={[
          { name: solutionsHub.labels.breadcrumb, path: "/solutions" },
          { name: page.name, path: `/solutions/${page.slug}` },
        ]}
      />
      <IndustryHero heading={page.hero} ctas={page.hero.ctas} stats={page.hero.stats} tone={tone} figure={<ProductMock kind={page.mock} />} />
      <StatementReveal eyebrow={page.problem.eyebrow} text={page.problem.text} />
      <CapabilityBento heading={page.capabilities.heading} features={page.capabilities.features} gradient={mockGradient(page.mock)} lead={<ProductMock kind={page.mock} compact />} />
      <SpotlightSplit heading={page.spotlight.heading} points={page.spotlight.points} image={page.spotlight.image} mock={page.mock} />
      <GovernancePanel heading={page.governance.heading} points={page.governance.points} image={page.governance.image} />
      <div id="how-it-works" className="scroll-mt-24">
        <ProcessSteps heading={page.process.heading} steps={page.process.steps} />
      </div>
      <AudienceCards heading={page.audience.heading} items={page.audience.items} gradient={mockGradient(page.mock)} />
      <StackChips heading={page.integrations.heading} items={page.integrations.items} note={page.integrations.note} />
      <CompareTable heading={page.compare.heading} columns={page.compare.columns} rows={page.compare.rows} />
      <OutcomeSplit heading={page.outcome.heading} items={page.outcome.items} image={page.outcome.image} mock={page.mock} />
      <IndustryFaq heading={page.faq.heading} items={page.faq.items} cta={solutionsHub.labels.faqCta} tone={tone} />
      <RelatedLinks eyebrow={solutionsHub.labels.related} links={page.related} />
      <IndustryCta heading={page.cta.heading} primary={page.cta.primary} tone={tone} figureLabel={home.hero.figureLabel} />
    </>
  );
}
