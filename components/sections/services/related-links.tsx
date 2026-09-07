import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { Reveal } from "@/components/magic/reveal";
import type { Link as LinkType } from "@/content/types";

/**
 * A compact cross-link row: "see the other side" of the site (a service page
 * linking to the industries it fits, an industry page linking to the exact
 * services it's built from). Plain text links, not cards, so it never
 * competes visually with the section above it.
 */
export function RelatedLinks({ eyebrow, links }: { eyebrow: string; links: LinkType[] }) {
  return (
    <section className="bg-background py-14 lg:py-16">
      <div className="mx-auto max-w-7xl px-6">
        <Reveal className="flex flex-wrap items-center gap-x-8 gap-y-4">
          <p className="eyebrow shrink-0 text-primary">{eyebrow}</p>
          <div className="flex flex-wrap gap-x-7 gap-y-3">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="group inline-flex cursor-pointer items-center gap-1.5 text-sm font-semibold text-foreground underline-offset-4 hover:underline"
              >
                {link.label}
                <ArrowUpRight aria-hidden className="size-3.5 transition-transform duration-200 ease-out group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </Link>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  );
}
