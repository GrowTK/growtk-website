import type { Metadata } from "next";
import { IndustryHero } from "@/components/sections/industries/industry-hero";
import { IndustryCta } from "@/components/sections/industries/industry-cta";
import { IndustryFaq } from "@/components/sections/industries/industry-faq";
import { IndustryTile } from "@/components/sections/industries/industries-carousel";
import { IndustrySwitcher } from "@/components/sections/industries/industry-switcher";
import { IndustryServicesStrip } from "@/components/sections/industries/industry-services-strip";
import { HUB_TONE } from "@/components/sections/industries/industry-tones";
import { Reveal, RevealGroup, RevealItem } from "@/components/magic/reveal";
import { Wash, washTone } from "@/components/sections/company/wash";
import { BreadcrumbJsonLd } from "@/components/seo/breadcrumb-jsonld";
import { industriesHub, industryPages } from "@/content/industry-pages";
import { home } from "@/content/home";
import { cn } from "@/lib/utils";

export const metadata: Metadata = { title: industriesHub.meta.title, description: industriesHub.meta.description };

export default function IndustriesPage() {
  const g = industriesHub.gridHeading;
  return (
    <>
      <BreadcrumbJsonLd items={[{ name: industriesHub.labels.breadcrumb, path: "/industries" }]} />
      <IndustryHero
        heading={industriesHub.hero}
        ctas={industriesHub.hero.ctas}
        tone={HUB_TONE}
        figure={<IndustrySwitcher items={industryPages.map((p) => ({ slug: p.slug, name: p.name, icon: p.icon }))} exploreLabel={industriesHub.labels.explore} />}
      />

      <section className="bg-background py-20 lg:py-28">
        <div className="mx-auto max-w-7xl px-6">
          <Reveal className="max-w-2xl">
            {g.eyebrow ? <p className="eyebrow text-primary">{g.eyebrow}</p> : null}
            <h2 className="mt-3 font-display text-4xl font-bold tracking-tight text-balance text-foreground sm:text-5xl">{g.title}</h2>
            {g.body ? <p className="mt-4 text-lg leading-relaxed text-muted-foreground">{g.body}</p> : null}
          </Reveal>
          <RevealGroup className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {industryPages.map((p, i) => (
              <RevealItem key={p.slug} className={cn(i === 0 && "lg:col-span-2")}>
                <IndustryTile industry={{ name: p.name, teaser: p.teaser, href: `/industries/${p.slug}` }} />
              </RevealItem>
            ))}
          </RevealGroup>
        </div>
      </section>

      <IndustryServicesStrip tone={HUB_TONE} />
      <div className="h-20 lg:h-28" aria-hidden />
      <IndustryFaq heading={industriesHub.faq.heading} items={industriesHub.faq.items} cta={industriesHub.labels.faqCta} tone={washTone("peach")} helpBackdrop={<Wash name="peach" />} />
      <IndustryCta heading={industriesHub.cta.heading} primary={industriesHub.cta.primary} tone={HUB_TONE} figureLabel={home.hero.figureLabel} />
    </>
  );
}
