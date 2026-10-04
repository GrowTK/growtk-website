import Image from "next/image";
import Link from "next/link";
import { ArrowRight, MousePointerClick, PhoneOff, Target } from "lucide-react";
import { Reveal, RevealGroup, RevealItem } from "@/components/magic/reveal";
import type { Cta as CtaLink, Img, StatementStep } from "@/content/types";

const STEP_ICONS = {
  visit: MousePointerClick,
  leak: PhoneOff,
  fix: Target,
} as const;

/**
 * Image band. The blurred image runs edge to edge behind a max-w-7xl grid:
 * two columns by three rows on desktop. The copy panel spans all three rows
 * of the left column at solid contrast; when `steps` are given, each one
 * fills a row of the right column.
 */
export function ImageStatement({
  eyebrow,
  title,
  body,
  secondaryBody,
  cta,
  image,
  steps,
}: {
  eyebrow?: string;
  title: string;
  body?: string;
  secondaryBody?: string;
  cta?: CtaLink;
  image: Img;
  steps?: StatementStep[];
}) {
  return (
    <section className="relative isolate overflow-hidden bg-background">
      <Image
        src={image.src}
        alt={image.alt}
        fill
        sizes="100vw"
        quality={75}
        className="absolute inset-0 -z-10 scale-110 object-cover blur-md"
      />

      <div className="mx-auto grid max-w-7xl gap-4 px-6 py-16 lg:grid-cols-2 lg:grid-rows-3 lg:gap-5 lg:py-24">
        <div className="flex items-center bg-white px-8 py-12 sm:px-12 lg:row-span-3 lg:px-14">
          <Reveal className="max-w-md">
            {eyebrow ? <p className="eyebrow text-primary">{eyebrow}</p> : null}
            <h2 className="mt-4 font-display text-4xl font-bold tracking-tight text-balance text-foreground sm:text-5xl">
              {title}
            </h2>
            {body ? <p className="mt-5 text-base leading-relaxed text-muted-foreground sm:text-lg">{body}</p> : null}
            {secondaryBody ? (
              <p className="mt-5 text-base leading-relaxed text-muted-foreground sm:text-lg">{secondaryBody}</p>
            ) : null}
            {cta ? (
              <Link
                href={cta.href}
                className="group mt-8 inline-flex cursor-pointer items-center gap-2 rounded-full bg-black px-7 py-3.5 text-sm font-semibold text-white transition duration-200 ease-out hover:-translate-y-0.5 hover:bg-black/85 hover:shadow-lg focus-visible:ring-2 focus-visible:ring-black focus-visible:ring-offset-2 focus-visible:outline-none"
              >
                {cta.label}
                <ArrowRight aria-hidden className="size-4 transition-transform duration-200 ease-out group-hover:translate-x-0.5" />
              </Link>
            ) : null}
          </Reveal>
        </div>

        {steps?.length ? (
          <RevealGroup stagger={0.07} className="grid gap-4 lg:row-span-3 lg:grid-rows-3 lg:gap-5">
            {steps.map((step, i) => {
              const Icon = STEP_ICONS[step.icon];
              return (
                <RevealItem key={step.title} className="h-full">
                  <div className="group relative flex h-full items-start gap-5 bg-white p-6 shadow-[0_24px_60px_-20px_rgb(0_0_0/0.35)] transition duration-300 ease-out hover:-translate-y-1 hover:shadow-[0_32px_70px_-20px_rgb(0_0_0/0.45)] sm:p-7 lg:items-center lg:p-8">
                    <div className="flex size-12 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary transition-colors duration-300 group-hover:bg-primary group-hover:text-primary-foreground">
                      <Icon aria-hidden className="size-5" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="font-mono text-xs tracking-[0.2em] text-primary">0{i + 1}</p>
                      <h3 className="mt-1.5 font-display text-xl font-bold tracking-tight text-balance text-foreground lg:text-2xl">
                        {step.title}
                      </h3>
                      <p className="mt-2 text-sm leading-relaxed text-muted-foreground lg:text-base">{step.body}</p>
                    </div>
                  </div>
                </RevealItem>
              );
            })}
          </RevealGroup>
        ) : null}
      </div>
    </section>
  );
}
