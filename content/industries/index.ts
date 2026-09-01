/**
 * The industries hub: a small typed catalog plus the hub page's own copy.
 * Adding a new industry later means adding one entry here, one content file
 * (content/industries/<slug>.ts) and one thin page (app/industries/<slug>/page.tsx)
 * that follows the same pattern as roofing, railing-fencing and healthcare.
 */
import type { PageContent, Cta, Img, SectionHeading } from "../types";

export type IndustryEntry = {
  slug: string;
  name: string;
  href: string;
  teaser: string;
  image: Img;
};

export const industries: IndustryEntry[] = [
  {
    slug: "roofing",
    name: "Roofing",
    href: "/industries/roofing",
    teaser: "Turn storm-damage calls and quote requests into booked jobs before they go cold.",
    image: {
      src: "https://images.unsplash.com/photo-1632759145351-1d592919f522?auto=format&fit=crop&w=1200&q=80",
      alt: "A roofer standing on a residential roof mid job",
    },
  },
  {
    slug: "railing-fencing",
    name: "Railing and fencing",
    href: "/industries/railing-fencing",
    teaser: "Give homeowners a rough estimate on the spot and stop losing bids to slow follow-up.",
    image: {
      src: "https://images.unsplash.com/photo-1604015641586-6fa03629f976?auto=format&fit=crop&w=1200&q=80",
      alt: "A wooden fence running along a property line under a clear sky",
    },
  },
  {
    slug: "healthcare",
    name: "Healthcare",
    href: "/industries/healthcare",
    teaser: "Cut the phone tag over scheduling and no-shows so the front desk is not tied to the phone all day.",
    image: {
      src: "https://images.unsplash.com/photo-1637711805966-c5181f89ddb6?auto=format&fit=crop&w=1200&q=80",
      alt: "A clean, modern reception desk in a healthcare practice lobby",
    },
  },
];

export const industriesPage = {
  meta: {
    title: "Industries",
    description:
      "Growtk builds websites, widgets, automation and voice agents for roofing, railing and fencing, and healthcare front offices, with more trade and service industries added over time.",
    path: "/industries",
  },

  hero: {
    eyebrow: "Industries we build for",
    title: "Software built around how your trade actually runs",
    body: "Every industry below gets its own website, widgets and automations built around how that business actually takes leads and books jobs, not a generic template with the name swapped in.",
    ctas: [{ label: "Talk to us about your industry", href: "/contact", variant: "primary" }] as Cta[],
  },

  intro: {
    eyebrow: "How this works",
    title: "Pick your industry, see what we would build first",
    body: "Three industries live today, and we take on new ones as we go. Every page below starts from the same place: a free audit call before any scope or price gets set.",
  } as SectionHeading,
} satisfies PageContent & Record<string, unknown>;

export default industriesPage;
