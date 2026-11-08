import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { IndustryHero } from "@/components/sections/industries/industry-hero";
import { IndustryFaq } from "@/components/sections/industries/industry-faq";
import { IndustryCta } from "@/components/sections/industries/industry-cta";
import { TradeFigure } from "@/components/sections/industries/trade-figure";
import { Feature06 } from "@/components/sections/features/feature-06";
import { ProcessSteps } from "@/components/sections/services/process-steps";
import { Reveal } from "@/components/magic/reveal";
import { Wash, washTone } from "@/components/sections/company/wash";
import { BreadcrumbJsonLd } from "@/components/seo/breadcrumb-jsonld";
import { careers as p } from "@/content/company";
import { home } from "@/content/home";

export const metadata: Metadata = { title: p.meta.title, description: p.meta.description };

export default function CareersPage() {
  return (
    <>
      <BreadcrumbJsonLd items={[{ name: "Careers", path: "/careers" }]} />
      <IndustryHero heading={p.hero} ctas={p.hero.ctas} tone={washTone("peach")} backdrop={<Wash name="peach" />} figure={<TradeFigure set="service" name="site" gradient={{ angle: 0, from: "#ffffff", to: "#ffffff" }} />} />
      <Feature06 heading={p.life.heading} features={p.life.items} />
      <section id="roles" className="bg-background px-6 pb-4">
        <Reveal className="mx-auto max-w-3xl rounded-[28px] bg-muted px-8 py-12 text-center sm:px-14">
          <p className="eyebrow text-primary">{p.openings.heading.eyebrow}</p>
          <h2 className="mt-3 font-display text-3xl font-bold tracking-tight text-balance text-foreground sm:text-4xl">{p.openings.heading.title}</h2>
          <p className="mx-auto mt-4 max-w-xl text-base leading-relaxed text-muted-foreground">{p.openings.heading.body}</p>
          <Link
            href={p.openings.cta.href}
            className="group mt-8 inline-flex cursor-pointer items-center gap-2 rounded-full bg-foreground px-7 py-3.5 text-sm font-semibold text-background transition duration-200 ease-out hover:-translate-y-0.5 hover:bg-foreground/85 focus-visible:ring-2 focus-visible:ring-foreground focus-visible:ring-offset-2 focus-visible:outline-none"
          >
            {p.openings.cta.label}
            <ArrowRight aria-hidden className="size-4 transition-transform duration-200 group-hover:translate-x-0.5" />
          </Link>
        </Reveal>
      </section>
      <ProcessSteps heading={p.steps.heading} steps={p.steps.items} />
      <IndustryFaq heading={p.faq.heading} items={p.faq.items} tone={washTone("lilac")} helpBackdrop={<Wash name="lilac" />} />
      <IndustryCta heading={p.cta.heading} primary={p.cta.primary} tone={washTone("apricot")} backdrop={<Wash name="apricot" />} figureLabel={home.hero.figureLabel} />
    </>
  );
}
