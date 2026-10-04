/**
 * HVAC industry landing page copy. Pain points are specific to how HVAC
 * demand actually spikes: the first cold snap or first heat wave of the
 * season flooding the phones with no-heat and no-cool calls that cannot
 * wait for business hours, and maintenance contracts that quietly lapse
 * when nobody follows up to renew them.
 */
import type { PageContent, Cta, Img, SectionHeading, Feature, FaqItem } from "../types";

export const hvac = {
  meta: {
    title: "HVAC company websites and automation",
    description:
      "Growtk builds websites, maintenance-plan signup widgets, emergency call routing and voice agents for HVAC companies, so no-heat and no-cool calls turn into booked jobs instead of going to the next number in the search results.",
    path: "/industries/hvac",
  },

  hero: {
    eyebrow: "For HVAC companies",
    title: "Answer the no-heat call before the next number does",
    body: "A homeowner with no heat at midnight in January is not waiting until morning, and whoever calls back first gets the job. Growtk builds HVAC sites that work from a phone on a job site, maintenance-plan signups that keep contracts from quietly lapsing, and emergency call routing built for the first cold snap or first heat wave of the season, when the phones flood all at once.",
    ctas: [{ label: "Talk to us about your HVAC company's website", href: "/contact", variant: "primary" }] as Cta[],
  },

  build: {
    heading: {
      eyebrow: "What we build for HVAC companies",
      title: "Every service, built around how an HVAC call actually comes in",
      body: "The same five things we build for any trade business, worked out specifically for seasonal demand swings, no-heat and no-cool emergencies, and maintenance contracts that need to renew on their own.",
    } as SectionHeading,
    features: [
      {
        icon: "Smartphone",
        title: "A site built for a phone from a job site",
        body: "Fast, mobile-first pages built around booking, so someone searching for no-heat repair at eleven at night finds a way to reach you in seconds, instead of a slow site that was never built for the first cold snap of the season.",
      },
      {
        icon: "ClipboardCheck",
        title: "An instant estimate and maintenance-plan signup widget",
        body: "A homeowner gets a real ballpark on a new system or signs up for a maintenance plan on the spot, instead of a contract quietly lapsing because nobody called to renew it before the season turned.",
      },
      {
        icon: "PhoneCall",
        title: "No-heat and no-cool emergency call routing and text-back",
        body: "The first cold snap or first heat wave floods your phone with no-heat and no-cool calls at once. Every call gets routed to whoever is on call, and a missed call gets an instant text-back, so a homeowner hears from you before they finish dialing the next number.",
      },
      {
        icon: "Mic",
        title: "A voice agent for after-hours emergency calls",
        body: "Calls that come in at midnight or on a weekend get answered and an emergency visit gets booked straight onto the schedule, so an on-call tech is not the only thing standing between a no-heat call and a lost job.",
      },
      {
        icon: "Plug",
        title: "Connected to the CRM and dispatch tool you already use",
        body: "Leads, dispatch and maintenance schedules stay in sync with ServiceTitan, Housecall Pro or whatever you already run today, so nothing gets typed in twice and nothing falls through between systems.",
      },
    ] as Feature[],
  },

  faq: {
    heading: {
      eyebrow: "Questions HVAC owners ask",
      title: "What this actually looks like for an HVAC company",
    } as SectionHeading,
    items: [
      {
        q: "We already have a website. Why would we redesign it?",
        a: "If it does not load fast on a phone, or a no-heat call has to dig for a way to actually reach you, it is costing you jobs every week it stays up. Growtk rebuilds around getting a visitor to call or book, not just look nice.",
      },
      {
        q: "How fast can a missed no-heat or no-cool call actually get a text back?",
        a: "Within minutes of the missed call, day or night, so the homeowner hears from you long before they try the next name in the search results.",
      },
      {
        q: "Does the voice agent replace our dispatcher?",
        a: "No. The voice agent Growtk builds answers the calls that would otherwise go to voicemail, after hours, during a job, or when the phones are already busy, and books what it can straight onto your calendar. Your dispatcher still handles anything that needs a real conversation.",
      },
      {
        q: "We already use ServiceTitan or Housecall Pro for dispatch. Does this replace it?",
        a: "No, we build around it. Leads, maintenance schedules and job status stay synced with the field service software your team already runs.",
      },
    ] as FaqItem[],
    cta: { label: "Talk to us about your HVAC company's website", href: "/contact" } as Cta,
  },

  cta: {
    heading: {
      eyebrow: "Ready for the next cold snap",
      title: "Talk to us about your HVAC company's website",
      body: "Book a free audit call and we will tell you exactly what a faster site, a maintenance-plan widget and emergency call routing would look like for your business.",
    } as SectionHeading,
    primary: { label: "Talk to us about your HVAC company's website", href: "/contact" } as Cta,
  },
} satisfies PageContent & Record<string, unknown>;

export default hvac;
