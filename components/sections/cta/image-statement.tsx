import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Reveal } from "@/components/magic/reveal";
import type { Cta as CtaLink, Img } from "@/content/types";

/**
 * Full screen image band. The image runs edge to edge; a square-cornered
 * white panel sits at half the section's width, inset by an equal margin
 * from the left, top and bottom edges (flush against the image on its
 * right edge), and holds the copy at solid contrast.
 */
export function ImageStatement({
  eyebrow,
  title,
  body,
  secondaryBody,
  cta,
  image,
}: {
  eyebrow?: string;
  title: string;
  body?: string;
  secondaryBody?: string;
  cta?: CtaLink;
  image: Img;
}) {
  return (
    <section className="relative isolate flex min-h-[100svh] overflow-hidden bg-background">
      <Image
        src={image.src}
        alt={image.alt}
        fill
        sizes="100vw"
        quality={75}
        className="absolute inset-0 -z-10 scale-110 object-cover blur-md"
      />

      <div className="relative ml-4 mt-4 mb-4 flex w-[calc(100%-2rem)] items-center bg-white px-8 py-16 sm:ml-8 sm:mt-8 sm:mb-8 sm:w-1/2 sm:px-14 lg:ml-12 lg:mt-12 lg:mb-12 lg:px-20">
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
    </section>
  );
}
