import { Reveal } from "@/components/magic/reveal";
import type { Img } from "@/content/types";

/**
 * A colour background with the photo held well inside it, framed by a wide
 * margin rather than bleeding to the edges. The gallery-wall version of a
 * photo break, for a shot that reads better presented than plastered.
 */
export function Spotlight10({ image, caption }: { image: Img; caption?: string }) {
  return (
    <section className="bg-primary py-20 text-primary-foreground lg:py-28">
      <Reveal className="mx-auto max-w-4xl px-6">
        <div className="overflow-hidden rounded-2xl border border-primary-foreground/15 shadow-2xl">
          <img src={image.src} alt={image.alt} loading="lazy" decoding="async" className="aspect-16/10 w-full object-cover" />
        </div>
        {caption ? <p className="mt-5 text-center text-sm text-primary-foreground/75">{caption}</p> : null}
      </Reveal>
    </section>
  );
}
