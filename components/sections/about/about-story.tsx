import Image from "next/image";
import { Quote } from "lucide-react";
import { Reveal } from "@/components/magic/reveal";
import { Wash } from "@/components/sections/company/wash";
import type { Img, SectionHeading } from "@/content/types";

/**
 * The founding story as a long read: a sticky heading and photo on the left,
 * the paragraphs on the right, with the story's last line pulled out as a
 * quote, on a white card inside the blob animation, so it lands as the point.
 */
export function AboutStory({ heading, body, image, caption }: {
  heading: SectionHeading;
  body: string[];
  image: Img;
  caption?: string;
}) {
  const quote = body[body.length - 1];
  const paragraphs = body.slice(0, -1);

  return (
    <section className="bg-background pt-24 lg:pt-36">
      <div className="mx-auto grid max-w-7xl gap-12 px-6 lg:grid-cols-[minmax(0,26rem)_minmax(0,1fr)] lg:gap-20">
        <div className="lg:sticky lg:top-28 lg:self-start">
          <Reveal>
            {heading.eyebrow ? <p className="eyebrow text-primary">{heading.eyebrow}</p> : null}
            <h2 className="mt-3 font-display text-4xl leading-[1.05] font-bold tracking-tight text-balance text-foreground sm:text-5xl">{heading.title}</h2>
            {heading.body ? <p className="mt-5 text-lg leading-relaxed text-muted-foreground">{heading.body}</p> : null}
          </Reveal>
          <Reveal delay={0.08} className="mt-10">
            <figure>
              <div className="relative aspect-[4/3] overflow-hidden rounded-md">
                <Image src={image.src} alt={image.alt} fill quality={75} sizes="(min-width: 1024px) 416px, 100vw" className="object-cover" />
              </div>
              {caption ? <figcaption className="mt-3 text-sm leading-relaxed text-muted-foreground">{caption}</figcaption> : null}
            </figure>
          </Reveal>
        </div>

        <div>
          {paragraphs.map((p, i) => (
            <Reveal key={p.slice(0, 32)} delay={i * 0.05}>
              <p className={i === 0 ? "font-display text-2xl leading-snug font-semibold tracking-tight text-foreground sm:text-3xl" : "mt-8 text-lg leading-relaxed text-muted-foreground"}>
                {p}
              </p>
            </Reveal>
          ))}
          {quote ? (
            <Reveal delay={0.1} className="mt-12">
              <div className="relative isolate overflow-hidden rounded-[24px] p-4 sm:p-6">
                <Wash name="blob" />
                <blockquote className="rounded-[16px] bg-white/95 p-7 backdrop-blur sm:p-10">
                  <Quote aria-hidden className="size-8 text-foreground/30" strokeWidth={1.5} />
                  <p className="mt-4 font-display text-3xl leading-[1.15] font-bold tracking-tight text-balance text-foreground sm:text-4xl">{quote}</p>
                </blockquote>
              </div>
            </Reveal>
          ) : null}
        </div>
      </div>
    </section>
  );
}
