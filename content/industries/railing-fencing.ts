/**
 * Railing and fencing industry landing page copy. Pain points are specific to
 * custom-job quoting: slow manual estimates, no rough number for a homeowner
 * to see before calling, and bids that go quiet after they are sent.
 */
import type { PageContent, Cta, Img, SectionHeading, Feature, FaqItem } from "../types";

export const railingFencing = {
  meta: {
    title: "Railing and fencing company websites and automation",
    description:
      "Growtk builds websites, visual quote-request widgets, bid follow-up automation and voice agents for railing and fencing contractors, so custom quotes turn into booked jobs.",
    path: "/industries/railing-fencing",
  },

  hero: {
    eyebrow: "For railing and fencing contractors",
    title: "Quote faster, follow up automatically, stop losing bids to silence",
    body: "Custom railing and fencing jobs take real time to price out by hand, and a homeowner comparing three contractors usually books the one who answers first. If your site cannot give a rough number and your follow-up depends on someone remembering to send it, bids go cold before they are won.",
    ctas: [{ label: "Talk to us about your fencing or railing company's website", href: "/contact", variant: "primary" }] as Cta[],
  },

  build: {
    heading: {
      eyebrow: "What we build for railing and fencing companies",
      title: "Every service, built around how a custom bid actually moves",
      body: "The same five things we build for any trade business, worked out specifically for how railing and fencing work gets priced and won.",
    } as SectionHeading,
    features: [
      {
        icon: "Ruler",
        title: "A site built to win the first call",
        body: "Fast, mobile-first pages with real project photos, built to turn someone comparing three contractors into a call or a form submission with you instead of the next name on their list.",
      },
      {
        icon: "Calculator",
        title: "A visual quote-request form",
        body: "A homeowner picks material, length and style and gets a rough estimate range on the spot, so they book a real measurement instead of shopping around blind for a number.",
      },
      {
        icon: "Repeat",
        title: "Automated follow-up on every open bid",
        body: "A quote that goes unanswered for a few days gets a scheduled follow-up automatically, so a bid never just goes quiet waiting on someone to remember it.",
      },
      {
        icon: "Headset",
        title: "A voice agent for routine scheduling calls",
        body: "Handles calls asking for a rough price range or booking a measurement visit, so your crew is not stopping mid-install to answer the phone.",
      },
      {
        icon: "Plug",
        title: "Connected to the CRM you already quote from",
        body: "Estimates and job status stay synced with the CRM your office already uses to send quotes, so nothing has to be re-entered by hand.",
      },
    ] as Feature[],
  },

  faq: {
    heading: {
      eyebrow: "Questions contractors ask",
      title: "What this actually looks like for a railing or fencing company",
    } as SectionHeading,
    items: [
      {
        q: "Our quotes take real judgment. Can a widget actually estimate that?",
        a: "It gives a rough range based on material, length and style, enough for a homeowner to decide it is worth calling, not a final number. Your team still does the real measurement and the real quote.",
      },
      {
        q: "What happens to a bid nobody follows up on?",
        a: "Automation sends a scheduled follow-up on the timeline you set, so an unanswered quote gets a nudge instead of quietly expiring.",
      },
      {
        q: "Do you build the widget to match how we already price jobs?",
        a: "Yes. It is built around your material list, service area and how you actually price a job, not a generic calculator dropped onto your site.",
      },
      {
        q: "We already use a CRM for quoting. Does this replace it?",
        a: "No, we connect to it. Leads and job status sync with the CRM your office already runs.",
      },
    ] as FaqItem[],
    cta: { label: "Talk to us about your fencing or railing company's website", href: "/contact" } as Cta,
  },

  cta: {
    heading: {
      eyebrow: "Ready to stop losing bids to silence",
      title: "Talk to us about your fencing or railing company's website",
      body: "Book a free audit call and we will tell you exactly what a faster site, a quote form and bid follow-up would look like for your business.",
    } as SectionHeading,
    primary: { label: "Talk to us about your fencing or railing company's website", href: "/contact" } as Cta,
    image: {
      src: "https://images.unsplash.com/photo-1679797870465-b4eda40ead96?auto=format&fit=crop&w=1600&q=80",
      alt: "A contractor using a power drill to install a wooden fence",
    } as Img,
  },
} satisfies PageContent & Record<string, unknown>;

export default railingFencing;
