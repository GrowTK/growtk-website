import { Check } from "lucide-react";
import { Reveal } from "@/components/magic/reveal";
import type { ServiceItem } from "@/content/services";

/**
 * The five Growtk services as five real, independently anchored sections
 * (photo one side, copy the other, swapping sides each time), not a tabbed
 * panel. A tabbed component would hide four of the five services behind
 * JavaScript state with no real URL for each one, which breaks the
 * /services#<id> links the footer and other pages point at.
 */
export function ServicesList({ items }: { items: ServiceItem[] }) {
  return (
    <div className="bg-background">
      {items.map((service, i) => (
        <section
          key={service.id}
          id={service.id}
          className="scroll-mt-28 py-12 lg:py-16"
        >
          <div className="mx-auto max-w-7xl px-6">
            <Reveal>
              <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-16">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={service.image.src}
                  alt={service.image.alt}
                  loading="lazy"
                  decoding="async"
                  className={`aspect-4/3 w-full rounded-2xl border border-border object-cover ${i % 2 ? "lg:order-2" : ""}`}
                />
                <div className={i % 2 ? "lg:order-1" : ""}>
                  <p className="eyebrow text-primary">{service.eyebrow}</p>
                  <h2 className="mt-3 font-display text-3xl font-bold tracking-tight text-balance text-foreground sm:text-4xl">
                    {service.title}
                  </h2>
                  <p className="mt-4 text-base leading-relaxed text-muted-foreground">{service.body}</p>
                  <ul className="mt-6 space-y-2.5">
                    {service.bullets.map((b) => (
                      <li key={b} className="flex items-start gap-2.5 text-sm text-foreground">
                        <Check aria-hidden className="mt-0.5 size-4 shrink-0 text-primary" />
                        {b}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </Reveal>
          </div>
        </section>
      ))}
    </div>
  );
}
