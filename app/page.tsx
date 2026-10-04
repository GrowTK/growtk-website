import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { brand } from "@/brand.config";
import { StickyNote } from "@/components/sections/about/sticky-note";
import { HeroLeadMachine } from "@/components/sections/hero/hero-lead-machine";
import { IndustriesCarousel } from "@/components/sections/industries/industries-carousel";
import { FeatureVoiceBlob } from "@/components/sections/features/voice-blob";
import { LogoMarqueeBand } from "@/components/sections/logos/logo-marquee-band";
import { Feature05 } from "@/components/sections/features/feature-05";
import { Feature07 } from "@/components/sections/features/feature-07";
import { Quote01 } from "@/components/sections/quote/quote-01";
import { Testimonial09 } from "@/components/sections/testimonials/testimonial-09";
import { ImageStatement } from "@/components/sections/cta/image-statement";
import { ProjectsShowcase } from "@/components/sections/projects/projects-showcase";
import { Faq03 } from "@/components/sections/faq/faq-03";
import { Cta12 } from "@/components/sections/cta/cta-12";
import { home } from "@/content/home";
import { projectsShowcase } from "@/content/projects";

export const metadata: Metadata = { title: home.meta.title, description: home.meta.description };

export default function Home() {
  return (
    <>
      <main data-nav-theme="dark" className="relative isolate flex min-h-[calc(100vh-92px)] flex-col overflow-hidden">
        <video
          autoPlay
          muted
          loop
          playsInline
          poster={home.hero.video.poster}
          className="absolute inset-0 -z-20 size-full object-cover motion-safe:animate-[kenburns_22s_ease-out_infinite_alternate]"
        >
          <source src={home.hero.video.src} type="video/mp4" />
        </video>

        <div className="relative mx-auto flex w-full max-w-7xl flex-1 items-stretch px-6 py-10 sm:px-10">
          <div className="flex w-full flex-col overflow-hidden rounded-md bg-white shadow-2xl lg:flex-row">
            <div className="flex flex-1 flex-col justify-center p-8 sm:p-10 lg:p-14">
              <Image
                src="/brand/grow_with_growtk_black.png"
                alt={brand.name}
                width={640}
                height={250}
                priority
                className="h-auto w-full max-w-md"
              />
              <p className="mt-5 max-w-lg text-base leading-relaxed text-muted-foreground sm:text-lg">{home.hero.body}</p>
              <div className="mt-8 flex flex-wrap items-center gap-4">
                <Link
                  href={home.hero.ctas[0].href}
                  className="group inline-flex cursor-pointer items-center gap-2 rounded-full bg-foreground px-7 py-4 text-sm font-semibold text-white transition duration-200 ease-out hover:-translate-y-0.5 hover:bg-foreground/85 hover:shadow-xl focus-visible:ring-2 focus-visible:ring-foreground focus-visible:ring-offset-2 focus-visible:outline-none"
                >
                  {home.hero.ctas[0].label}
                  <ArrowRight aria-hidden className="size-4 transition-transform duration-200 ease-out group-hover:translate-x-0.5" />
                </Link>
                <Link
                  href={home.hero.ctas[1].href}
                  className="inline-flex cursor-pointer items-center gap-2 rounded-full border border-border px-7 py-4 text-sm font-semibold text-foreground transition-colors duration-200 hover:bg-accent focus-visible:ring-2 focus-visible:ring-foreground focus-visible:outline-none"
                >
                  {home.hero.ctas[1].label}
                </Link>
              </div>
            </div>

            <div className="hidden flex-1 items-center justify-center p-3 lg:flex">
              <div className="h-full w-full">
                <HeroLeadMachine label={home.hero.figureLabel} />
              </div>
            </div>
          </div>
        </div>
      </main>

      <section className="relative overflow-hidden bg-background px-6 py-36 sm:py-44 lg:py-52 my-12">
        {home.about.notes.map((note, i) => (
          <StickyNote
            key={note.doodle}
            color={note.color}
            lines={note.lines}
            doodle={note.doodle}
            speed={note.speed}
            delay={i * 0.18}
            className={`absolute hidden w-48 lg:block xl:w-56 ${note.position} ${note.rotate}`}
          />
        ))}

        <div className="relative mx-auto max-w-xl text-center">
          <p className="eyebrow text-primary">{home.about.eyebrow}</p>
          <h2 className="mt-4 font-display text-4xl font-bold tracking-tight text-balance whitespace-pre-line text-foreground sm:text-5xl">
            {home.about.title}
          </h2>
          <p className="mt-5 text-base leading-relaxed text-muted-foreground">{home.about.body}</p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
            <Link
              href={home.about.ctas[0].href}
              className="group inline-flex cursor-pointer items-center gap-2 rounded-full bg-black px-7 py-3.5 text-sm font-semibold text-white transition duration-200 ease-out hover:-translate-y-0.5 hover:bg-black/85 hover:shadow-lg focus-visible:ring-2 focus-visible:ring-black focus-visible:ring-offset-2 focus-visible:outline-none"
            >
              {home.about.ctas[0].label}
              <ArrowRight aria-hidden className="size-4 transition-transform duration-200 ease-out group-hover:translate-x-0.5" />
            </Link>
            <Link
              href={home.about.ctas[1].href}
              className="inline-flex cursor-pointer items-center gap-2 rounded-full border border-border px-7 py-3.5 text-sm font-semibold text-foreground transition-colors duration-200 hover:bg-accent focus-visible:ring-2 focus-visible:ring-primary focus-visible:outline-none"
            >
              {home.about.ctas[1].label}
            </Link>
          </div>
        </div>
      </section>

      <IndustriesCarousel heading={home.industries.heading} items={home.industries.items} cta={home.industries.cta} />

      <FeatureVoiceBlob
        heading={home.voice.heading}
        videoSrc={home.voice.src}
        poster={home.voice.poster}
        title={home.voice.title}
        subtitle={home.voice.subtitle}
      />

      <LogoMarqueeBand heading={home.integrations.heading} cta={home.integrations.cta} logos={home.integrations.logos} />

      <Feature05 heading={home.capabilities.heading} features={home.capabilities.items} />

      <Quote01 quote={home.quote} />

      <Feature07 heading={home.process.heading} cta={home.process.cta} features={home.process.items} />

      <Testimonial09 heading={home.testimonials.heading} testimonials={home.testimonials.items} />

      <ProjectsShowcase heading={projectsShowcase.heading} items={projectsShowcase.items} />

      <ImageStatement
        eyebrow={home.statement.eyebrow}
        title={home.statement.title}
        body={home.statement.body}
        secondaryBody={home.statement.secondaryBody}
        cta={home.statement.cta}
        image={home.statement.image}
        steps={home.statement.steps}
      />

      <Faq03 heading={home.faq.heading} items={home.faq.items} cta={home.faq.cta} />

      <Cta12
        heading={home.cta.heading}
        primary={home.cta.primary}
        image={home.cta.image}
        footnote={home.cta.footnote}
      />
    </>
  );
}
