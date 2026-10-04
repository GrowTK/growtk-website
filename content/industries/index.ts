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
  /** A shorter name for one-line card titles, when `name` is long. */
  cardName?: string;
};

export const industries: IndustryEntry[] = [
  {
    slug: "hvac",
    name: "HVAC",
    href: "/industries/hvac",
    teaser: "Answer the no-heat, no-cool call at 2am and get it on the schedule before the homeowner tries the next number.",
    image: {
      src: "https://images.unsplash.com/photo-1700124113583-81aa99ea2aa2?auto=format&fit=crop&w=1200&q=80",
      alt: "A modern heat pump and air conditioning unit mounted on the exterior wall of a house",
    },
  },
  {
    slug: "plumbing",
    name: "Plumbing",
    href: "/industries/plumbing",
    teaser: "Route burst-pipe and water-heater emergencies to whoever is on call, day or night, before they go to voicemail.",
    image: {
      src: "https://images.unsplash.com/photo-1600566752355-35792bedcfea?auto=format&fit=crop&w=1200&q=80",
      alt: "A modern bathroom with a freestanding tub, shower and plumbing fixtures",
    },
  },
  {
    slug: "electrical",
    name: "Electrical",
    href: "/industries/electrical",
    teaser: "Instant estimate requests and safety-call triage that gets a licensed electrician on the right job first.",
    image: {
      src: "https://images.unsplash.com/photo-1621905251189-08b45d6a269e?auto=format&fit=crop&w=1200&q=80",
      alt: "An electrician in a yellow hard hat installing wiring on an exterior panel",
    },
  },
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
    cardName: "Railing",
    href: "/industries/railing-fencing",
    teaser: "Give homeowners a rough estimate on the spot and stop losing bids to slow follow-up.",
    image: {
      src: "https://images.unsplash.com/photo-1604015641586-6fa03629f976?auto=format&fit=crop&w=1200&q=80",
      alt: "A wooden fence running along a property line under a clear sky",
    },
  },
  {
    slug: "landscaping",
    name: "Landscaping",
    href: "/industries/landscaping",
    teaser: "Book recurring lawn and property maintenance automatically instead of re-selling the same customer every spring.",
    image: {
      src: "https://images.unsplash.com/photo-1558904541-efa843a96f01?auto=format&fit=crop&w=1200&q=80",
      alt: "A close-up of a freshly maintained green lawn in front of modern buildings",
    },
  },
  {
    slug: "pest-control",
    name: "Pest control",
    href: "/industries/pest-control",
    teaser: "Keep recurring treatment plans on autopilot and jump on a new infestation call before a competitor does.",
    image: {
      src: "https://images.unsplash.com/photo-1598228723793-52759bba239c?auto=format&fit=crop&w=1200&q=80",
      alt: "A suburban house exterior with a well-kept lawn and landscaping",
    },
  },
  {
    slug: "cleaning",
    name: "Cleaning",
    href: "/industries/cleaning",
    teaser: "Recurring-job booking and review-request automation that keeps your calendar full without a front desk.",
    image: {
      src: "https://images.unsplash.com/photo-1580256081112-e49377338b7f?auto=format&fit=crop&w=1200&q=80",
      alt: "A cleaning cart with supplies parked in a hotel hallway",
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
      "Growtk builds websites, widgets, automation and voice agents for HVAC, plumbing, electrical, roofing, railing and fencing, landscaping, pest control, cleaning and healthcare front offices, with more added over time.",
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
    body: "Nine industries live today, and we take on new ones as we go. Every page below starts from the same place: a free audit call before any scope or price gets set.",
  } as SectionHeading,

  cta: {
    heading: {
      eyebrow: "Do not see your trade yet",
      title: "Tell us what you run, we will tell you what we would build",
      body: "New industries get added as we take on new trades. Book a free audit call either way and we will tell you honestly what fits.",
    } as SectionHeading,
    primary: { label: "Talk to us about your business", href: "/contact" } as Cta,
  },
} satisfies PageContent & Record<string, unknown>;

export default industriesPage;

/**
 * Labels shared by every industry page's middle sections (the service
 * explorer, the FAQ and the services strip). Each industry's own copy lives
 * in its content file; these are the words around it.
 */
export const industryPageLabels = {
  services: {
    /** "Service 2 of 5" above the open service. */
    counter: "Service {n} of {total}",
    link: "How we build this",
  },
  strip: {
    eyebrow: "Built from these services",
    title: "The same six building blocks, set up for your trade",
    body: "Everything on this page is assembled from them. Open any one for the detail.",
  },
  faq: {
    /** Shown under the FAQ title when an industry's heading has no body of its own. */
    body: "Straight answers to what owners ask us before a first call. Open any question for the full answer.",
    /** "4 questions answered" above the list. */
    count: "{n} questions answered",
    help: {
      title: "Still have a question?",
      body: "Book a free audit call and ask us anything about your setup. No pitch deck, just answers.",
      email: "Or email us",
    },
  },
};
