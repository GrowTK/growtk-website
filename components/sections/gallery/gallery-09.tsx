import { Carousel } from "@/components/magic/carousel";
import { Reveal } from "@/components/magic/reveal";
import type { Img, SectionHeading } from "@/content/types";

/**
 * Bespoke: one tall, heavily rounded card that reads like a book on a table,
 * a single frame you swipe or arrow through rather than a filmstrip of many
 * separate cards. No stock block in this library gives a carousel that much
 * presence as a single object, so this is authored for a page that wants one
 * deliberate, lingered-over image sequence rather than a browsable archive.
 */
export function Gallery09({ heading, images }: { heading?: SectionHeading; images: Img[] }) {
  if (images.length === 0) return null;

  return (
    <section className="bg-background py-20 lg:py-28">
      <div className="mx-auto max-w-4xl px-6">
        {heading ? (
          <Reveal className="text-center">
            {heading.eyebrow ? <p className="eyebrow text-primary">{heading.eyebrow}</p> : null}
            {heading.title ? (
              <h2 className="mt-3 font-display text-4xl font-bold tracking-tight text-balance text-foreground sm:text-5xl">
                {heading.title}
              </h2>
            ) : null}
            {heading.body ? (
              <p className="mx-auto mt-4 max-w-xl text-lg leading-relaxed text-muted-foreground">{heading.body}</p>
            ) : null}
          </Reveal>
        ) : null}

        <Reveal delay={0.1} className="mt-12">
          <Carousel
            slides={images.map((i) => ({ src: i.src, alt: i.alt, caption: i.caption }))}
            aspectClassName="aspect-[4/5] sm:aspect-[16/10]"
            className="rounded-4xl shadow-xl shadow-foreground/10"
          />
        </Reveal>
      </div>
    </section>
  );
}
