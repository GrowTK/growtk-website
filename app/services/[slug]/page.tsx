import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { IndustryHero } from "@/components/sections/industries/industry-hero";
import { IndustryServices } from "@/components/sections/industries/industry-services";
import { IndustryFaq } from "@/components/sections/industries/industry-faq";
import { IndustryCta } from "@/components/sections/industries/industry-cta";
import { TradeFigure } from "@/components/sections/industries/trade-figure";
import { groupTone } from "@/components/sections/services/group-tone";
import { Feature06 } from "@/components/sections/features/feature-06";
import { Feature04 } from "@/components/sections/features/feature-04";
import { ProcessSteps } from "@/components/sections/services/process-steps";
import { RelatedLinks } from "@/components/sections/services/related-links";
import { ProjectsShowcase } from "@/components/sections/projects/projects-showcase";
import { BreadcrumbJsonLd } from "@/components/seo/breadcrumb-jsonld";
import { servicePages, servicePageBySlug, servicePageLabels } from "@/content/service-pages";
import { projectsShowcase } from "@/content/projects";
import { home } from "@/content/home";


export function generateStaticParams() {
  return servicePages.map((s) => ({ slug: s.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const page = servicePageBySlug((await params).slug);
  return page ? { title: page.meta.title, description: page.meta.description, alternates: { canonical: `/services/${page.slug}` } } : {};
}

export default async function ServicePage({ params }: { params: Promise<{ slug: string }> }) {
  const page = servicePageBySlug((await params).slug);
  if (!page) notFound();
  const tone = groupTone(page.group);
  const cases = page.caseStudies.map((slug) => projectsShowcase.items.find((p) => p.slug === slug)).filter((p) => p !== undefined);
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
          { name: servicePageLabels.breadcrumb, path: "/services" },
          { name: page.name, path: `/services/${page.slug}` },
        ]}
      />
      <IndustryHero
        heading={page.hero}
        ctas={page.hero.ctas}
        tone={tone}
        figure={<TradeFigure set="service" name={page.figure} gradient={{ angle: 0, from: "#ffffff", to: "#ffffff" }} />}
      />
      <IndustryServices heading={page.included.heading} features={page.included.features} tone={tone} ownLinks />
      <Feature06 heading={page.whoFor.heading} features={page.whoFor.items} />
      <Feature04 heading={page.why.heading} features={page.why.items} />
      <ProcessSteps heading={page.process.heading} steps={page.process.steps} />
      <ProjectsShowcase heading={servicePageLabels.caseStudies} items={cases} />
      <IndustryFaq heading={page.faq.heading} items={page.faq.items} cta={servicePageLabels.faqCta} tone={tone} />
      <RelatedLinks
        eyebrow={servicePageLabels.related}
        links={page.related.map((slug) => {
          const r = servicePageBySlug(slug)!;
          return { label: r.name, href: `/services/${r.slug}` };
        })}
      />
      <IndustryCta heading={page.cta.heading} primary={page.cta.primary} tone={tone} figureLabel={home.hero.figureLabel} />
    </>
  );
}
