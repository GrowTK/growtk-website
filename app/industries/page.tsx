import type { Metadata } from "next";
import { PageHero } from "@/components/page-hero";
import { ImageCard } from "@/components/magic/image-card";
import { Reveal, RevealGroup, RevealItem } from "@/components/magic/reveal";
import { Cta12 } from "@/components/sections/cta/cta-12";
import { industries, industriesPage } from "@/content/industries";

export const metadata: Metadata = { title: industriesPage.meta.title, description: industriesPage.meta.description };

export default function IndustriesPage() {
  return (
    <>
      <PageHero
        heading={industriesPage.hero}
        image={{
          src: "https://images.unsplash.com/photo-1621905253185-95614217f357?auto=format&fit=crop&w=1600&q=80",
          alt: "A contractor in a hard hat checking his phone on a job site",
        }}
        ctas={industriesPage.hero.ctas}
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
                <ImageCard
                  href={industry.href}
                  src={industry.image.src}
                  alt={industry.image.alt}
                  eyebrow="Industry"
                  title={industry.name}
                  description={industry.teaser}
                  className="h-full"
                />
              </RevealItem>
            ))}
          </RevealGroup>
        </div>
      </section>

      <Cta12
        heading={{
          eyebrow: "Do not see your trade yet",
          title: "Tell us what you run, we will tell you what we would build",
          body: "New industries get added as we take on new trades. Book a free audit call either way and we will tell you honestly what fits.",
        }}
        primary={{ label: "Talk to us about your business", href: "/contact" }}
        image={{
          src: "https://images.unsplash.com/photo-1553877522-43269d4ea984?auto=format&fit=crop&w=1920&q=80",
          alt: "Two people working at laptops in a modern office, photographed in black and white",
        }}
      />
    </>
  );
}
