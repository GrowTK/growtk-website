import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Reveal, RevealGroup, RevealItem } from "@/components/magic/reveal";
import type { Cta, Img, SectionHeading } from "@/content/types";

/**
 * Editorial About hero: an oversized headline left, the story's first line and
 * the buttons right, then a wide photo with its own solid fact strip below it
 * (no text over the image): plain white cells split by hairlines.
 */
export function AboutHero({ heading, ctas = [], image, facts }: {
  heading: SectionHeading;
  ctas?: Cta[];
  image: Img;
  facts: { value: string; label: string }[];
}) {
  return (
    <section data-nav-theme="light" className="bg-background pt-14 lg:pt-20">
      <div className="mx-auto max-w-7xl px-6">
        <div className="grid gap-10 lg:grid-cols-[1.35fr_1fr] lg:items-end lg:gap-16">
          <Reveal>
            {heading.eyebrow ? <p className="eyebrow text-primary">{heading.eyebrow}</p> : null}
            <h1 className="mt-4 font-display text-5xl leading-[0.95] font-bold tracking-tight text-balance text-foreground sm:text-6xl lg:text-7xl">
              {heading.title}
            </h1>
          </Reveal>
          <Reveal delay={0.08}>
            {heading.body ? <p className="text-lg leading-relaxed text-muted-foreground">{heading.body}</p> : null}
            {ctas.length ? (
              <div className="mt-8 flex flex-wrap gap-3">
                {ctas.map((cta, i) => (
                  <Link
                    key={cta.label}
                    href={cta.href}
                    className={
                      i === 0
                        ? "group inline-flex cursor-pointer items-center gap-2 rounded-md bg-[#26262a] px-6 py-3.5 text-sm font-semibold text-white transition duration-200 ease-out hover:-translate-y-0.5 hover:shadow-lg focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:outline-none"
                        : "inline-flex cursor-pointer items-center gap-2 rounded-md border border-border bg-card px-6 py-3.5 text-sm font-semibold text-foreground transition-colors duration-200 hover:bg-muted focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
                    }
                  >
                    {cta.label}
                    {i === 0 ? <ArrowRight aria-hidden className="size-4 transition-transform duration-200 group-hover:translate-x-0.5" /> : null}
                  </Link>
                ))}
              </div>
            ) : null}
          </Reveal>
        </div>

        <Reveal delay={0.12} className="mt-12 lg:mt-16">
          <div className="overflow-hidden rounded-[28px] bg-card shadow-[0_20px_60px_rgba(0,0,0,.08)]">
            <div className="relative aspect-[16/9] sm:aspect-[21/9]">
              <Image src={image.src} alt={image.alt} fill priority quality={75} sizes="(min-width: 1280px) 1232px, 100vw" className="object-cover" />
            </div>
            <RevealGroup stagger={0.07} className="grid divide-y divide-border bg-white sm:grid-cols-3 sm:divide-x sm:divide-y-0">
              {facts.map((f) => (
                <RevealItem key={f.label}>
                  <div className="flex h-full items-center gap-5 p-6 sm:p-8">
                    <span className="font-display text-6xl leading-none font-bold tracking-tight text-foreground tabular-nums">{f.value}</span>
                    <span className="text-sm leading-snug font-medium text-muted-foreground">{f.label}</span>
                  </div>
                </RevealItem>
              ))}
            </RevealGroup>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
