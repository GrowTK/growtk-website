import type { Metadata } from "next";
import type { ReactNode } from "react";
import { notFound } from "next/navigation";
import { IndustryHero } from "@/components/sections/industries/industry-hero";
import { IndustryServices } from "@/components/sections/industries/industry-services";
import { IndustryFaq } from "@/components/sections/industries/industry-faq";
import { IndustryCta } from "@/components/sections/industries/industry-cta";
import { toneGradient } from "@/components/sections/industries/industry-tones";
import { groupTone } from "@/components/sections/services/group-tone";
import { Feature06 } from "@/components/sections/features/feature-06";
import { Feature04 } from "@/components/sections/features/feature-04";
import { ProcessSteps } from "@/components/sections/services/process-steps";
import { RelatedLinks } from "@/components/sections/services/related-links";
import { StatementReveal } from "@/components/sections/services/statement-reveal";
import { StackChips } from "@/components/sections/services/stack-chips";
import { OperatingModels } from "@/components/sections/services/operating-models";
import { ServiceHeroCenter, ServiceHeroDark } from "@/components/sections/services/service-heroes";
import { IncludedIndex, IncludedTabs } from "@/components/sections/services/included-variants";
import { ServiceVisual } from "@/components/sections/services/visuals";
import { AudienceCards, CapabilityBento, GovernancePanel } from "@/components/sections/solutions/solution-sections";
import { ProjectsShowcase } from "@/components/sections/projects/projects-showcase";
import { BreadcrumbJsonLd } from "@/components/seo/breadcrumb-jsonld";
import { servicePages, servicePageBySlug, servicePageLabels } from "@/content/service-pages";
import { serviceExtras } from "@/content/service-extras";
import { projectsShowcase } from "@/content/projects";
import { home } from "@/content/home";

/**
 * Every service page is built from the same content shape, but each one has
 * its own recipe: a hero shape, a layout for what's included, a layout for
 * who it's for and why it matters, and an order. Together with the service's
 * own live visual, no two pages read alike.
 */
type Recipe = {
  hero: "split" | "center" | "dark";
  included: "rows" | "bento" | "tabs" | "index";
  who: "cards" | "columns";
  why: "list" | "panel";
  /** Show the tools and engagement models before the process instead of after. */
  stackFirst?: boolean;
};

const RECIPES: Record<string, Recipe> = {
  "contact-center-services": { hero: "center", included: "bento", who: "cards", why: "panel" },
  "inbound-contact-center": { hero: "split", included: "tabs", who: "columns", why: "list", stackFirst: true },
  "outbound-contact-center": { hero: "dark", included: "index", who: "cards", why: "list" },
  "ecommerce-customer-support": { hero: "center", included: "tabs", who: "cards", why: "panel", stackFirst: true },
  "customer-support": { hero: "split", included: "bento", who: "columns", why: "panel" },
  "customer-experience-management": { hero: "dark", included: "rows", who: "cards", why: "panel", stackFirst: true },
  "workforce-management": { hero: "center", included: "index", who: "columns", why: "list" },
  "technical-support": { hero: "dark", included: "tabs", who: "cards", why: "panel" },
  "business-process-reengineering": { hero: "split", included: "index", who: "cards", why: "list", stackFirst: true },
  "back-office-support": { hero: "center", included: "rows", who: "columns", why: "panel" },
  telemarketing: { hero: "dark", included: "bento", who: "columns", why: "list", stackFirst: true },
  "sales-support": { hero: "split", included: "tabs", who: "cards", why: "list" },
  "lead-generation": { hero: "center", included: "index", who: "cards", why: "panel", stackFirst: true },
};

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
  const recipe = RECIPES[page.slug] ?? RECIPES["customer-support"]!;
  const tone = groupTone(page.group);
  const gradient = toneGradient(tone);
  const extra = serviceExtras[page.slug];
  const faqs = [...page.faq.items, ...(extra?.moreFaq ?? [])];
  const cases = page.caseStudies.map((slug) => projectsShowcase.items.find((p) => p.slug === slug)).filter((p) => p !== undefined);
  const visual = <ServiceVisual slug={page.slug} />;
  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((item) => ({ "@type": "Question", name: item.q, acceptedAnswer: { "@type": "Answer", text: item.a } })),
  };

  const heroProps = { heading: page.hero, ctas: page.hero.ctas, stats: extra?.stats, tone };
  const hero =
    recipe.hero === "center" ? (
      <ServiceHeroCenter {...heroProps} visual={visual} />
    ) : recipe.hero === "dark" ? (
      <ServiceHeroDark {...heroProps} visual={visual} />
    ) : (
      <IndustryHero {...heroProps} figure={visual} />
    );

  const inc = page.included;
  const included: Record<Recipe["included"], ReactNode> = {
    rows: <IndustryServices heading={inc.heading} features={inc.features} tone={tone} ownLinks />,
    bento: <CapabilityBento heading={inc.heading} features={inc.features} gradient={gradient} lead={<ServiceVisual slug={page.slug} />} />,
    tabs: <IncludedTabs heading={inc.heading} features={inc.features} gradient={gradient} />,
    index: <IncludedIndex heading={inc.heading} features={inc.features} gradient={gradient} />,
  };

  const who =
    recipe.who === "cards" ? (
      <AudienceCards heading={page.whoFor.heading} items={page.whoFor.items} gradient={gradient} />
    ) : (
      <Feature06 heading={page.whoFor.heading} features={page.whoFor.items} />
    );
  const why =
    recipe.why === "panel" ? (
      <GovernancePanel heading={page.why.heading} points={page.why.items} />
    ) : (
      <Feature04 heading={page.why.heading} features={page.why.items} />
    );

  const stack = extra ? <StackChips heading={extra.stack.heading} items={extra.stack.items} note={extra.stack.note} /> : null;
  const models = (
    <OperatingModels heading={servicePageLabels.models.heading} items={servicePageLabels.models.items} footnote={servicePageLabels.models.footnote} cta={servicePageLabels.models.cta} />
  );
  const process = (
    <div id="how-it-works" className="scroll-mt-24">
      <ProcessSteps heading={page.process.heading} steps={page.process.steps} />
    </div>
  );

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />
      <BreadcrumbJsonLd
        items={[
          { name: servicePageLabels.breadcrumb, path: "/services" },
          { name: page.name, path: `/services/${page.slug}` },
        ]}
      />
      {hero}
      {extra ? <StatementReveal eyebrow={extra.problem.eyebrow} text={extra.problem.text} /> : null}
      {included[recipe.included]}
      {recipe.stackFirst ? (
        <>
          {why}
          {stack}
          {who}
          {process}
        </>
      ) : (
        <>
          {who}
          {why}
          {process}
          {stack}
        </>
      )}
      <ProjectsShowcase heading={servicePageLabels.caseStudies} items={cases} />
      {models}
      <IndustryFaq heading={page.faq.heading} items={faqs} cta={servicePageLabels.faqCta} tone={tone} />
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
