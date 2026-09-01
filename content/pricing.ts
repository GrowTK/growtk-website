/**
 * Pricing page copy. Growtk is a real, operating service agency with three
 * real tiers. Every price is a starting price: the final scope and number
 * are set on a free audit call, never presented as fixed here.
 *
 * No em dashes or en dashes.
 */
import type { PageContent, Cta, SectionHeading, Feature, FaqItem, PriceTier } from "./types";

export const pricing = {
  meta: {
    title: "Pricing",
    description:
      "Growtk pricing starts at $3,500 for a website redesign and $1,200 a month for ongoing automation and voice agents. Every project starts with a free audit call to scope the final price.",
    path: "/pricing",
  },

  hero: {
    eyebrow: "Pricing",
    title: "Real starting prices, a final number after a free call",
    body: "Every business is different, so what is below are starting prices, not the final quote. Book a free audit call and we will scope the work and give you a real number before anything is signed.",
    ctas: [{ label: "Book a free audit call", href: "/contact", variant: "primary" }] as Cta[],
    footnote: "No obligation. Just a real conversation about your business.",
  },

  factors: {
    heading: {
      eyebrow: "What decides your price",
      title: "The things that actually move the number",
      body: "Every business is different, so the final quote depends on a handful of concrete factors, not a flat rate.",
    } as SectionHeading,
    items: [
      {
        icon: "LayoutGrid",
        title: "Scope",
        body: "A single website redesign is priced differently than a full retainer covering the site, widgets, automation and voice agents together.",
      },
      {
        icon: "Plug",
        title: "Number of integrations",
        body: "Connecting to one CRM is a different job than syncing five tools across payments, scheduling and communication.",
      },
      {
        icon: "Clock",
        title: "Timeline",
        body: "A standard build timeline costs less than a rushed one. We will tell you honestly if a deadline changes the price.",
      },
      {
        icon: "Repeat",
        title: "One-time or ongoing",
        body: "A website redesign is typically a one-time project. Automation and voice agents are ongoing work, tuned and maintained month to month.",
      },
    ] as Feature[],
  },

  tiers: [
    {
      name: "Launch",
      price: "$3,500",
      period: "starting price, one-time",
      body: "A website redesign project: a fast, modern, conversion-focused site built and launched in weeks, not months.",
      features: [
        "A mobile-first design built around your services and service area",
        "Copy and structure aimed at calls and quote requests",
        "Launched in weeks, not months",
        "One round of revisions included",
      ],
      cta: { label: "Book a free audit call", href: "/contact" },
    },
    {
      name: "Automate",
      price: "$1,200",
      period: "starting price, per month",
      body: "Ongoing workflow automation and voice agent build-out: custom automations, CRM and tool integrations, and one or more voice agent flows, continuously tuned.",
      features: [
        "Custom automations for lead routing, follow-up and scheduling",
        "CRM and tool integrations built around what you already run",
        "One or more voice agent flows answering and booking calls",
        "Ongoing tuning as we see what is actually working",
      ],
      cta: { label: "Book a free audit call", href: "/contact" },
      featured: true,
    },
    {
      name: "Grow",
      price: "Custom quote",
      period: "after a free audit call",
      body: "The full-service retainer: website, widgets, automation and voice agents together, continuously improved as your business grows.",
      features: [
        "Everything in Launch and Automate, built together",
        "Custom widgets: quote calculators, booking tools, live chat, review displays",
        "One team accountable for the whole system, not separate vendors",
        "Ongoing improvements as your business and volume grow",
      ],
      cta: { label: "Book a free audit call", href: "/contact" },
    },
  ] as PriceTier[],

  pricingHeading: {
    eyebrow: "Choose a starting point",
    title: "Three tiers, one team behind all of them",
    body: "Start with a single project or the full retainer. Either way, the number below is where a conversation starts, not where it ends.",
  } as SectionHeading,

  faq: {
    heading: {
      eyebrow: "Pricing questions",
      title: "What people ask before they book a call",
    } as SectionHeading,
    items: [
      {
        q: "Does the free audit call cost anything?",
        a: "No. It is a free, no-obligation call where we look at your current site, phone workflow and tools, and tell you honestly what would help and roughly what it would cost.",
      },
      {
        q: "What happens after the call?",
        a: "We send a written scope and a final price based on what we discussed. There is no pressure to sign anything on the call itself.",
      },
      {
        q: "Is there a contract?",
        a: "Launch is a one-time build with no ongoing contract. Automate and Grow are month to month, not locked into a long-term term, so you can adjust or stop as your needs change.",
      },
      {
        q: "Can I combine tiers, or start with just one service?",
        a: "Yes. Most clients start with Launch or Automate and add the other once the first one is working. Grow simply bundles everything together from the start for businesses that want the full build at once.",
      },
      {
        q: "Why is Grow a custom quote instead of a fixed price?",
        a: "Because it depends on how many tools you use, how many automations and voice agent flows you need, and how big your site should be. We would rather give you a real number after understanding your business than a flat price that does not fit it.",
      },
    ] as FaqItem[],
    cta: { label: "Book a free audit call", href: "/contact" } as Cta,
    ctaBody: "Ask us directly. We would rather answer honestly than guess in an FAQ.",
  },
} satisfies PageContent & Record<string, unknown>;

export default pricing;
