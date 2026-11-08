import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { IndustryHero } from "@/components/sections/industries/industry-hero";
import { IndustryServices } from "@/components/sections/industries/industry-services";
import { IndustryFaq } from "@/components/sections/industries/industry-faq";
import { IndustryCta } from "@/components/sections/industries/industry-cta";
import { TradeFigure } from "@/components/sections/industries/trade-figure";
import { INDUSTRY_THEME } from "@/components/sections/industries/industry-tones";
import { Feature03 } from "@/components/sections/features/feature-03";
import { Feature04 } from "@/components/sections/features/feature-04";
import { Feature06 } from "@/components/sections/features/feature-06";
import { ProcessSteps } from "@/components/sections/services/process-steps";
import { RelatedLinks } from "@/components/sections/services/related-links";
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
      <IndustryHero
        heading={page.hero}
        ctas={page.hero.ctas}
        tone={tone}
        figure={<TradeFigure set="service" name={page.figure} gradient={{ angle: 0, from: "#ffffff", to: "#ffffff" }} />}
      />
      <IndustryServices heading={page.capabilities.heading} features={page.capabilities.features} tone={tone} ownLinks />
      <Feature03 heading={page.deepDives.heading} rows={page.deepDives.rows} />
      <Feature06 heading={page.audience.heading} features={page.audience.items} />
      <Feature04 heading={page.built.heading} features={page.built.items} />
      <ProcessSteps heading={page.process.heading} steps={page.process.steps} />
      <IndustryFaq heading={page.faq.heading} items={page.faq.items} cta={solutionsHub.labels.faqCta} tone={tone} />
      <RelatedLinks eyebrow={solutionsHub.labels.related} links={page.related} />
      <IndustryCta heading={page.cta.heading} primary={page.cta.primary} tone={tone} figureLabel={home.hero.figureLabel} />
    </>
  );
}
