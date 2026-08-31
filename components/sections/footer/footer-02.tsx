import { ArrowUpRight } from "lucide-react";
import { Reveal } from "@/components/magic/reveal";
import { SocialIcon } from "@/components/sections/footer/social-icon";
import type { Link } from "@/content/types";

type FooterColumn = { title: string; links: Link[] };

/** Editorial: logo and link columns on top, a small centered wordmark at the close. */
export function Footer02({
  brandName,
  tagline,
  logoSrc,
  columns = [],
  socials = [],
  legal = [],
  copyright,
}: {
  brandName: string;
  tagline?: string;
  /** Real logo mark, shown above the tagline instead of just the name. */
  logoSrc?: string;
  columns?: FooterColumn[];
  socials?: Link[];
  legal?: Link[];
  copyright?: string;
}) {
  return (
    <footer data-nav-theme="dark" className="overflow-hidden bg-foreground">
      <div className="mx-auto max-w-7xl px-6 py-20">
        <Reveal className="grid gap-12 border-b border-background/15 pb-14 lg:grid-cols-[1.1fr_2fr]">
          <div>
            {logoSrc ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={logoSrc} alt={brandName} className="h-7 w-auto brightness-0 invert" />
            ) : null}
            {tagline ? (
              <p className="mt-5 max-w-sm font-display text-2xl leading-snug tracking-tight text-background">{tagline}</p>
            ) : null}
            {socials.length ? (
              <div className="mt-8 flex items-center gap-3">
                {socials.map((s) => (
                  <a
                    key={s.label}
                    href={s.href}
                    aria-label={s.label}
                    className="grid size-10 cursor-pointer place-items-center rounded-full border border-background/20 text-background/70 transition duration-200 ease-out hover:-translate-y-0.5 hover:border-primary hover:text-primary focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
                  >
                    <SocialIcon name={s.icon} label={s.label} className="size-4" />
                  </a>
                ))}
              </div>
            ) : null}
          </div>

          <div className="grid gap-10 sm:grid-cols-3">
            {columns.map((col) => (
              <div key={col.title}>
                <p className="eyebrow text-background/50">{col.title}</p>
                <ul className="mt-5 space-y-3">
                  {col.links.map((l) => (
                    <li key={l.label}>
                      <a
                        href={l.href}
                        className="group inline-flex cursor-pointer items-center gap-1 rounded-sm text-sm text-background transition-colors duration-200 ease-out hover:text-primary focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
                      >
                        {l.label}
                        <ArrowUpRight aria-hidden className="size-3 opacity-0 transition duration-200 ease-out group-hover:translate-x-0.5 group-hover:opacity-100" />
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </Reveal>

        <div className="flex flex-col gap-3 pt-6 text-xs text-background/60 sm:flex-row sm:items-center sm:justify-between">
          <p>{copyright ?? `${new Date().getFullYear()} ${brandName}`}</p>
          <div className="flex flex-wrap gap-x-6 gap-y-2">
            {legal.map((l) => (
              <a
                key={l.label}
                href={l.href}
                className="cursor-pointer rounded-sm transition-colors duration-200 ease-out hover:text-background focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
              >
                {l.label}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
