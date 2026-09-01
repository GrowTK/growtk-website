/**
 * Roofing industry landing page copy. Pain points are specific to how roofing
 * leads actually get lost: storm-damage calls going cold, a site that does
 * not work from a phone on a job site, and quotes tracked by hand.
 */
import type { PageContent, Cta, Img, SectionHeading, Feature, FaqItem } from "../types";

export const roofing = {
  meta: {
    title: "Roofing company websites and automation",
    description:
      "Growtk builds websites, instant quote widgets, storm-lead automation and voice agents for roofing contractors, so quote requests turn into booked jobs instead of going cold.",
    path: "/industries/roofing",
  },

  hero: {
    eyebrow: "For roofing companies",
    title: "Stop losing storm-damage leads while you are still on the last job",
    body: "A quote request that sits in an inbox until evening is a quote request a competitor already called back. We build roofing sites that work from a phone on a job site, quote calculators that answer the first question before you pick up, and follow-up that goes out automatically the moment a lead comes in.",
    ctas: [{ label: "Talk to us about your roofing company's website", href: "/contact", variant: "primary" }] as Cta[],
  },

  build: {
    heading: {
      eyebrow: "What we build for roofing companies",
      title: "Every service, built around how a roofing lead actually moves",
      body: "The same five things we build for any trade business, worked out specifically for how roofing work gets quoted and booked.",
    } as SectionHeading,
    features: [
      {
        icon: "Smartphone",
        title: "A site built for a phone from a job site",
        body: "Fast, mobile-first pages that turn someone searching after a storm into a call or a quote request, replacing a slow site that was never built for someone standing on a roof.",
      },
      {
        icon: "Calculator",
        title: "An instant roof quote calculator",
        body: "A homeowner enters their address and roof type and gets a real ballpark estimate on the spot, instead of waiting on a callback just to find out whether it is worth calling at all.",
      },
      {
        icon: "CloudLightning",
        title: "Storm-lead follow-up automation",
        body: "Every new lead gets routed to the right person and followed up automatically within minutes, so a quote request from Tuesday's storm does not go cold by Friday.",
      },
      {
        icon: "Mic",
        title: "An after-hours voice agent that books inspections",
        body: "Calls that come in at nine at night or on a Sunday get answered and a free inspection gets booked, so a night off does not mean a lost job.",
      },
      {
        icon: "Plug",
        title: "Connected to the CRM you already quote from",
        body: "Leads, job status and quotes stay in sync with Jobber, ServiceTitan or whatever you already run today, so nothing gets typed in twice.",
      },
    ] as Feature[],
  },

  faq: {
    heading: {
      eyebrow: "Questions roofing owners ask",
      title: "What this actually looks like for a roofing company",
    } as SectionHeading,
    items: [
      {
        q: "We already have a website. Why would we redesign it?",
        a: "If it does not load fast on a phone, or a storm-damage lead has to dig for a way to actually reach you, it is costing you jobs every week it stays up. We rebuild around getting a visitor to call or request a quote, not just look nice.",
      },
      {
        q: "How fast can storm-lead follow-up actually go out?",
        a: "Automation sends the first response within minutes of a form submission or a missed call, day or night, so the lead hears from you long before a competitor does.",
      },
      {
        q: "Does the voice agent replace our office staff?",
        a: "No. It answers the calls that would otherwise go to voicemail, after hours, during a job, or when the phones are already busy, and books what it can straight onto your calendar. Your team still handles anything that needs a real conversation.",
      },
      {
        q: "We already use a CRM for quoting. Does this replace it?",
        a: "No, we build around it. Leads, quotes and job status stay synced with the CRM your team already runs.",
      },
    ] as FaqItem[],
    cta: { label: "Talk to us about your roofing company's website", href: "/contact" } as Cta,
  },

  cta: {
    heading: {
      eyebrow: "Ready when the next storm is",
      title: "Talk to us about your roofing company's website",
      body: "Book a free audit call and we will tell you exactly what a faster site, a quote calculator and storm-lead follow-up would look like for your business.",
    } as SectionHeading,
    primary: { label: "Talk to us about your roofing company's website", href: "/contact" } as Cta,
    image: {
      src: "https://images.unsplash.com/photo-1635424709845-3a85ad5e1f5e?auto=format&fit=crop&w=1600&q=80",
      alt: "Two roofers working together on a residential roof",
    } as Img,
  },
} satisfies PageContent & Record<string, unknown>;

export default roofing;
