import type { Metadata } from "next";
import { PageHero } from "@/components/page-hero";
import { ProcessSteps } from "@/components/sections/services/process-steps";
import { ServicesList } from "@/components/sections/services/services-list";
import { Faq07 } from "@/components/sections/faq/faq-07";
import { Cta12 } from "@/components/sections/cta/cta-12";
import { services } from "@/content/services";

export const metadata: Metadata = { title: services.meta.title, description: services.meta.description };

export default function ServicesPage() {
  return (
    <>
      <PageHero
        heading={services.hero}
        image={{
          src: "https://images.unsplash.com/photo-1559523182-a284c3fb7cff?auto=format&fit=crop&w=1600&q=80",
          alt: "Three people working together on laptops at a shared table",
        }}
        ctas={services.hero.ctas}
      />

      <ProcessSteps heading={services.process.heading} steps={services.process.steps} />

      <ServicesList items={services.services} />

      <Faq07 heading={services.faq.heading} items={services.faq.items} cta={services.faq.cta} />

      <Cta12
        heading={services.cta.heading}
        primary={services.cta.primary}
        image={{
          src: "https://images.unsplash.com/photo-1541746972996-4e0b0f43e02a?auto=format&fit=crop&w=1920&q=80",
          alt: "A small group of people talking together in a bright, modern office",
        }}
      />
    </>
  );
}
