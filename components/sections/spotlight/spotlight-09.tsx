import { Icon } from "@/components/sections/icon";
import { Reveal } from "@/components/magic/reveal";
import type { Img } from "@/content/types";

/**
 * A straight 50/50 split: a solid colour panel with one short line on one
 * side, a full bleed photo on the other, both sides carrying their own
 * natural contrast. Quieter and more literal than Spotlight04's diagonal
 * version, for when the page wants the break without the extra geometry.
 */
export function Spotlight09({ icon, title, body, image }: { icon?: string; title: string; body?: string; image: Img }) {
  return (
    <section className="bg-background">
      <div className="grid lg:grid-cols-2">
        <Reveal className="flex flex-col justify-center bg-primary px-6 py-16 text-primary-foreground sm:px-10 lg:py-24">
          {icon ? (
            <span className="grid size-12 place-items-center rounded-xl bg-primary-foreground/15">
              <Icon name={icon} className="size-6" />
            </span>
          ) : null}
          <h2 className="mt-5 max-w-sm font-display text-3xl font-bold leading-[1.05] tracking-tight text-balance sm:text-4xl">
            {title}
          </h2>
          {body ? <p className="mt-4 max-w-sm text-base leading-relaxed text-primary-foreground/85">{body}</p> : null}
        </Reveal>
        <div className="min-h-64 lg:min-h-0">
          <img src={image.src} alt={image.alt} loading="lazy" decoding="async" className="size-full object-cover" />
        </div>
      </div>
    </section>
  );
}
