/**
 * Pricing page copy. No public pricing exists yet. No invented tiers or
 * dollar amounts. Early access framing only, honest about the timeline.
 */
import type { PageContent, Cta, Img, SectionHeading, Feature, FaqItem } from "./types";

export const pricing = {
  meta: {
    title: "Pricing",
    description:
      "Dentavanta has not set public pricing yet. We are in early access, shaping pricing with founding practices. Book a demo for a real conversation about cost.",
    path: "/pricing",
  },

  hero: {
    eyebrow: "Early access pricing",
    title: "Pricing starts with a conversation, not a price list",
    body: "We have not set public pricing yet. Founding practices are helping us shape it based on what they actually need, not what looks good on a comparison chart.",
    ctas: [
      { label: "Book a demo", href: "/book-demo", variant: "primary" },
      { label: "See what is live today", href: "/security", variant: "secondary" },
    ] as Cta[],
    footnote: "No credit card, no obligation. Just a real conversation about your practice.",
  },

  factors: {
    heading: {
      eyebrow: "What decides your price",
      title: "The things that actually move the number",
      body: "Every practice is different, so we would rather ask than guess.",
    } as SectionHeading,
    items: [
      {
        icon: "Users",
        title: "Practice size",
        body: "How many providers and staff will use the platform day to day.",
      },
      {
        icon: "LayoutGrid",
        title: "Which modules you need",
        body: "Scheduling, records, communication and billing are being built out one at a time. You pay for what your practice actually uses.",
      },
      {
        icon: "Rocket",
        title: "Onboarding needs",
        body: "Migrating existing patient records and training your team takes different amounts of work for different practices.",
      },
    ] as Feature[],
  },

  founding: {
    heading: {
      eyebrow: "Founding practices",
      title: "Early access practices help set the price, not just pay it",
      body: "Join now and you shape what gets built next, with pricing locked in as an early partner rather than set for you after the fact.",
    } as SectionHeading,
    points: [
      "Direct input on which features get built next",
      "Pricing shaped with you, not announced at you",
      "Direct access to the two people building the platform",
    ],
    primary: { label: "Book a demo", href: "/book-demo" } as Cta,
    image: {
      src: "https://images.unsplash.com/photo-1600880292203-757bb62b4baf?auto=format&fit=crop&w=1200&q=80",
      alt: "Two colleagues celebrating together over a laptop in a bright office",
    } as Img,
    footnote: "We reply to every demo request within one business day.",
  },

  faq: {
    heading: {
      eyebrow: "Pricing questions",
      title: "What people ask before they book a demo",
    } as SectionHeading,
    items: [
      {
        q: "Is there a free trial?",
        a: "We have not finalized a trial structure. Book a demo and we will tell you exactly what is available for your practice right now.",
      },
      {
        q: "Will pricing be per provider, per practice, or something else?",
        a: "We have not decided, honestly. That is part of what founding practices are helping us shape.",
      },
      {
        q: "When will public pricing be announced?",
        a: "We do not have a firm date. We are still early access and would rather get the pricing model right with real practices than publish a number before it makes sense.",
      },
      {
        q: "Does the price include the security infrastructure?",
        a: "Yes. Tenant isolation, authentication, encryption and audit logging are not an add on, they are the foundation every plan runs on.",
      },
    ] as FaqItem[],
    cta: { label: "Book a demo", href: "/book-demo" } as Cta,
    ctaTitle: "Still have questions?",
    ctaBody: "Ask us directly. We would rather answer honestly than guess in an FAQ.",
  },
} satisfies PageContent & Record<string, unknown>;

export default pricing;
