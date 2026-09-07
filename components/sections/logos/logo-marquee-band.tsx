import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Marquee } from "@/components/magic/marquee";
import { Reveal } from "@/components/magic/reveal";
import type { Cta, SectionHeading } from "@/content/types";

export type LogoItem = { name: string; src: string };

/**
 * Compact black band: heading and CTA on the left, a moving strip of real
 * CRM and platform logos on the right (white marks, so they read cleanly on
 * the black background).
 */
export function LogoMarqueeBand({ heading, cta, logos }: { heading: SectionHeading; cta?: Cta; logos: LogoItem[] }) {
  return (
    <section className="bg-black py-24 sm:py-28">
      <div className="mx-auto flex max-w-7xl flex-col gap-8 px-6 sm:px-10 md:flex-row md:items-center md:gap-0">
        <Reveal className="md:w-1/2 md:pr-10 lg:pr-16">
          {heading.eyebrow ? <p className="eyebrow text-white/50">{heading.eyebrow}</p> : null}
          <h2 className="mt-3 font-display text-4xl font-bold tracking-tight text-balance text-white sm:text-5xl">
            {heading.title}
          </h2>
          {heading.body ? (
            <p className="mt-4 max-w-md text-base leading-relaxed text-white/70">{heading.body}</p>
          ) : null}
          {cta ? (
            <Link
              href={cta.href}
              className="group mt-6 inline-flex cursor-pointer items-center gap-2 text-sm font-semibold text-white underline-offset-4 hover:underline"
            >
              {cta.label}
              <ArrowRight aria-hidden className="size-4 transition-transform duration-200 ease-out group-hover:translate-x-0.5" />
            </Link>
          ) : null}
        </Reveal>

        <div className="relative md:w-1/2 md:border-l md:border-white/10 md:pl-10 lg:pl-16">
          <div aria-hidden className="pointer-events-none absolute inset-y-0 left-0 z-10 w-10 bg-gradient-to-r from-black to-transparent sm:w-16" />
          <div aria-hidden className="pointer-events-none absolute inset-y-0 right-0 z-10 w-10 bg-gradient-to-l from-black to-transparent sm:w-16" />
          <Marquee pauseOnHover className="[--marquee-gap:3.5rem] [--marquee-duration:26s]">
            {logos.map((logo) => (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                key={logo.name}
                src={logo.src}
                alt={logo.name}
                loading="lazy"
                decoding="async"
                className="h-8 w-auto shrink-0 opacity-80 grayscale transition-opacity duration-200 hover:opacity-100 sm:h-9"
              />
            ))}
          </Marquee>
        </div>
      </div>
    </section>
  );
}
