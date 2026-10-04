import type { Metadata } from "next";
import { IndustryHero } from "@/components/sections/industries/industry-hero";
import { IndustryCta } from "@/components/sections/industries/industry-cta";
import { IndustryMosaic } from "@/components/sections/industries/industry-mosaic";
import { IndustryTile } from "@/components/sections/industries/industries-carousel";
import { HUB_TONE } from "@/components/sections/industries/industry-tones";
import { home } from "@/content/home";
import { Reveal, RevealGroup, RevealItem } from "@/components/magic/reveal";
import { RelatedLinks } from "@/components/sections/services/related-links";
import { BreadcrumbJsonLd } from "@/components/seo/breadcrumb-jsonld";
import { industries, industriesPage } from "@/content/industries";

export const metadata: Metadata = { title: industriesPage.meta.title, description: industriesPage.meta.description };

export default function IndustriesPage() {
  return (
    <>
      <BreadcrumbJsonLd items={[{ name: "Industries", path: "/industries" }]} />
      <IndustryHero
        heading={industriesPage.hero}
        ctas={industriesPage.hero.ctas}
        tone={HUB_TONE}
        figure={<IndustryMosaic items={industries} />}
      />

      <section className="bg-background py-20 lg:py-28">
        <div className="mx-auto max-w-7xl px-6">
          <Reveal className="max-w-2xl">
            {industriesPage.intro.eyebrow ? <p className="eyebrow text-primary">{industriesPage.intro.eyebrow}</p> : null}
            <h2 className="mt-3 font-display text-4xl font-bold tracking-tight text-balance text-foreground sm:text-5xl">
              {industriesPage.intro.title}
            </h2>
            {industriesPage.intro.body ? (
              <p className="mt-4 text-lg leading-relaxed text-muted-foreground">{industriesPage.intro.body}</p>
            ) : null}
          </Reveal>

          <RevealGroup className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {industries.map((industry) => (
              <RevealItem key={industry.slug}>
                <IndustryTile industry={{ ...industry, name: industry.cardName ?? industry.name }} />
              </RevealItem>
            ))}
          </RevealGroup>
        </div>
      </section>

      <RelatedLinks
        eyebrow="See what we build"
        links={[
          { label: "All services", href: "/services" },
          { label: "Website redesign", href: "/services#website-redesign" },
          { label: "Automation", href: "/services#automation" },
          { label: "Voice agents", href: "/services#voice-agents" },
        ]}
      />

      <IndustryCta heading={industriesPage.cta.heading} primary={industriesPage.cta.primary} tone={HUB_TONE} figureLabel={home.hero.figureLabel} />
    </>
  );
}
