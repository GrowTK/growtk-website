import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Zap } from "lucide-react";
import { brand } from "@/brand.config";
import { ParallaxPhoto } from "@/components/sections/about/parallax-photo";
import { IndustriesCarousel } from "@/components/sections/industries/industries-carousel";
import { FeatureVoiceBlob } from "@/components/sections/features/voice-blob";
import { LogoMarqueeBand } from "@/components/sections/logos/logo-marquee-band";
import { Feature05 } from "@/components/sections/features/feature-05";
import { Feature07 } from "@/components/sections/features/feature-07";
import { Quote01 } from "@/components/sections/quote/quote-01";
import { Testimonial09 } from "@/components/sections/testimonials/testimonial-09";
import { ImageStatement } from "@/components/sections/cta/image-statement";
import { Faq03 } from "@/components/sections/faq/faq-03";
import { Cta12 } from "@/components/sections/cta/cta-12";
import { home } from "@/content/home";

export const metadata: Metadata = { title: home.meta.title, description: home.meta.description };

export default function Home() {
  const heroStat = home.hero.stats[0];

  return (
    <>
      <main data-nav-theme="dark" className="relative isolate flex min-h-[calc(100vh-92px)] flex-col overflow-hidden">
        <video
          autoPlay
          muted
          loop
          playsInline
          poster={home.hero.video.poster}
          className="absolute inset-0 -z-20 size-full object-cover"
        >
          <source src={home.hero.video.src} type="video/mp4" />
        </video>
        <div
          aria-hidden
          className="absolute inset-0 -z-10 bg-gradient-to-t from-black/60 via-black/35 to-black/20 backdrop-blur-md"
        />

        <div className="relative mx-auto flex w-full max-w-7xl flex-1 flex-col justify-end px-6 pt-20 pb-20 sm:px-10 lg:pb-20">
          <div className="max-w-2xl">
            <p className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-1.5 font-mono text-xs tracking-[0.15em] text-white/90 uppercase backdrop-blur-md">
              {home.hero.eyebrow}
            </p>
            <h1 className="mt-5 font-display text-4xl font-bold leading-[0.95] tracking-tight text-balance text-white sm:text-5xl lg:text-6xl">
              {home.hero.title}
            </h1>
            <p className="mt-6 max-w-xl text-base leading-relaxed text-white/80 sm:text-lg">{home.hero.body}</p>
            <div className="mt-9 flex flex-wrap items-center gap-5">
              <Link
                href={home.hero.ctas[0].href}
                className="group inline-flex cursor-pointer items-center gap-2 rounded-full bg-white px-7 py-4 text-sm font-semibold text-foreground transition duration-200 ease-out hover:-translate-y-0.5 hover:shadow-xl focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-transparent focus-visible:outline-none"
              >
                {home.hero.ctas[0].label}
                <ArrowRight aria-hidden className="size-4 transition-transform duration-200 ease-out group-hover:translate-x-0.5" />
              </Link>
              <Link href={home.hero.ctas[1].href} className="text-sm text-white/70 underline-offset-4 hover:underline">
                {home.hero.ctas[1].label}
              </Link>
            </div>
          </div>

          {heroStat ? (
            <div className="mt-14 flex flex-col items-start gap-4 sm:absolute sm:right-10 sm:bottom-16 sm:max-w-xs sm:items-end sm:text-right lg:right-16">
              <div className="flex items-center gap-3 rounded-2xl border border-white/20 bg-white/10 px-5 py-4 backdrop-blur-md">
                <Zap aria-hidden className="size-5 text-white" />
                <p className="font-display text-2xl font-bold tracking-tight text-white">{heroStat.value}</p>
              </div>
              <p className="text-sm leading-relaxed text-white/80">{heroStat.label}</p>
            </div>
          ) : null}
        </div>
      </main>

      <section className="relative overflow-hidden bg-background px-6 py-36 sm:py-44 lg:py-52 my-12">
        {home.about.photos.map((photo) => (
          <ParallaxPhoto
            key={photo.src}
            src={photo.src}
            alt={photo.alt}
            speed={photo.speed}
            className={`pointer-events-none absolute hidden aspect-square overflow-hidden rounded-md lg:block ${photo.position} ${photo.rotate}`}
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

      <ImageStatement
        eyebrow={home.statement.eyebrow}
        title={home.statement.title}
        body={home.statement.body}
        secondaryBody={home.statement.secondaryBody}
        cta={home.statement.cta}
        image={home.statement.image}
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
