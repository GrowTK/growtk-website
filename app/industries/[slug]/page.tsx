import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { IndustryHero } from "@/components/sections/industries/industry-hero";
import { IndustryFaq } from "@/components/sections/industries/industry-faq";
import { IndustryCta } from "@/components/sections/industries/industry-cta";
import { INDUSTRY_THEME, toneGradient } from "@/components/sections/industries/industry-tones";
import { IndustryVisual } from "@/components/sections/industries/visuals";
import { ChallengeGrid, InsideSplit, ServiceLinkGrid, UseCaseFeed } from "@/components/sections/industries/industry-sections";
import { ProcessSteps } from "@/components/sections/services/process-steps";
import { StatementReveal } from "@/components/sections/services/statement-reveal";
import { StackChips } from "@/components/sections/services/stack-chips";
import { ServiceHeroCenter, ServiceHeroDark } from "@/components/sections/services/service-heroes";
import { AudienceCards, GovernancePanel } from "@/components/sections/solutions/solution-sections";
import { BreadcrumbJsonLd } from "@/components/seo/breadcrumb-jsonld";
import { industriesHub, industryPageBySlug, industryPages } from "@/content/industry-pages";
import { servicePageBySlug } from "@/content/service-pages";
import { home } from "@/content/home";

/** Hero shape per industry, so the seven pages open differently. */
const HERO: Record<string, "split" | "center" | "dark"> = {
  "banking-fintech": "dark",
  "ride-hailing": "center",
  ecommerce: "split",
  logistics: "center",
  telecom: "dark",
  healthcare: "split",
  saas: "center",
};

export function generateStaticParams() {
  return industryPages.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const page = industryPageBySlug((await params).slug);
  return page ? { title: page.meta.title, description: page.meta.description, alternates: { canonical: `/industries/${page.slug}` } } : {};
}

export default async function IndustryPage({ params }: { params: Promise<{ slug: string }> }) {
  const page = industryPageBySlug((await params).slug);
  if (!page) notFound();
  const tone = INDUSTRY_THEME[page.slug]?.tone ?? INDUSTRY_THEME.hvac!.tone;
  const gradient = toneGradient(tone);
  const L = industriesHub.labels;
  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: page.faq.items.map((item) => ({ "@type": "Question", name: item.q, acceptedAnswer: { "@type": "Answer", text: item.a } })),
  };
  const heroProps = { heading: page.hero, ctas: page.hero.ctas, stats: page.hero.stats, tone };
  const shape = HERO[page.slug] ?? "split";
  const services = page.services.items
    .map((s) => {
      const svc = servicePageBySlug(s.slug);
      return svc ? { name: svc.name, icon: svc.icon, href: `/services/${svc.slug}`, body: s.body } : null;
    })
    .filter((s) => s !== null);

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />
      <BreadcrumbJsonLd
        items={[
          { name: L.breadcrumb, path: "/industries" },
          { name: page.name, path: `/industries/${page.slug}` },
        ]}
      />
      {shape === "center" ? (
        <ServiceHeroCenter {...heroProps} visual={<IndustryVisual slug={page.slug} />} />
      ) : shape === "dark" ? (
        <ServiceHeroDark {...heroProps} visual={<IndustryVisual slug={page.slug} />} />
      ) : (
        <IndustryHero {...heroProps} figure={<IndustryVisual slug={page.slug} />} />
      )}
      <StatementReveal eyebrow={page.problem.eyebrow} text={page.problem.text} />
      <ChallengeGrid heading={page.challenges.heading} items={page.challenges.items} gradient={gradient} />
      <InsideSplit heading={page.inside.heading} points={page.inside.points} gradient={gradient} visual={<IndustryVisual slug={page.slug} />} />
      <ServiceLinkGrid heading={page.services.heading} items={services} learnMore={L.learnMore} gradient={gradient} />
      <UseCaseFeed heading={page.useCases.heading} items={page.useCases.items} doneLabel={L.doneLabel} />
      <AudienceCards heading={page.segments.heading} items={page.segments.items} gradient={gradient} />
      <div id="how-it-works" className="scroll-mt-24">
        <ProcessSteps heading={page.journey.heading} steps={page.journey.steps} />
      </div>
      <GovernancePanel heading={page.trust.heading} points={page.trust.points} />
      <StackChips heading={page.integrations.heading} items={page.integrations.items} note={page.integrations.note} />
      <IndustryFaq heading={page.faq.heading} items={page.faq.items} cta={L.faqCta} tone={tone} />
      <IndustryCta heading={page.cta.heading} primary={page.cta.primary} tone={tone} figureLabel={home.hero.figureLabel} />
    </>
  );
}
