/**
 * Plumbing industry landing page copy. Pain points are specific to how
 * plumbing leads actually get lost: a burst pipe or a dead water heater
 * that cannot wait for business hours, a site that does not make it obvious
 * who to call right now, and a quote that goes quiet after one follow-up.
 */
import type { PageContent, Cta, Img, SectionHeading, Feature, FaqItem } from "../types";

export const plumbing = {
  meta: {
    title: "Plumbing company websites and automation",
    description:
      "Growtk builds websites, instant estimate widgets, emergency-call triage and voice agents for plumbing companies, so a burst pipe at midnight still turns into a booked job.",
    path: "/industries/plumbing",
  },

  hero: {
    eyebrow: "For plumbing companies",
    title: "A burst pipe does not wait for business hours, and neither should your phone",
    body: "A homeowner with water on the floor does not read reviews for thirty minutes, they call whoever actually answers. Growtk builds plumbing sites that make it obvious who to call right now, estimate tools that answer routine jobs on the spot, and follow-up that keeps working on a quote after the first call goes quiet.",
    ctas: [{ label: "Talk to us about your plumbing company's website", href: "/contact", variant: "primary" }] as Cta[],
  },

  build: {
    heading: {
      eyebrow: "What we build for plumbing companies",
      title: "Every service, built around how a plumbing lead actually moves",
      body: "The same five things Growtk builds for any trade business, worked out specifically for how plumbing work gets called in, quoted and booked.",
    } as SectionHeading,
    features: [
      {
        icon: "Smartphone",
        title: "A mobile-first site built around getting the call answered",
        body: "Fast pages built for someone searching from a flooding kitchen on their phone, with the call button and emergency line impossible to miss, replacing a site that buries them below a paragraph about the company.",
      },
      {
        icon: "Calculator",
        title: "An instant estimate widget for routine jobs",
        body: "A homeowner picks their job, a water heater swap, a drain clear, a fixture install, and gets a real ballpark price immediately, instead of waiting on a callback just to find out if it is worth calling at all.",
      },
      {
        icon: "Siren",
        title: "Emergency-call triage and after-hours dispatch routing",
        body: "Every incoming call gets sorted the moment it comes in, a burst pipe or no hot water routes straight to whoever is on call, while routine requests queue for the next business day instead of interrupting anyone.",
      },
      {
        icon: "Mic",
        title: "A voice agent that answers burst-pipe calls at any hour",
        body: "Calls that come in at two in the morning get answered, not sent to a voicemail nobody checks until nine, so a night off does not cost you the emergency job that would have paid for the week.",
      },
      {
        icon: "Repeat",
        title: "Automated follow-up on quotes that went cold",
        body: "A 'let me think about it' caller gets a follow-up on day one, day three and day seven automatically, so a quote does not just die in a drawer because nobody remembered to call back.",
      },
    ] as Feature[],
  },

  faq: {
    heading: {
      eyebrow: "Questions plumbing owners ask",
      title: "What this actually looks like for a plumbing company",
    } as SectionHeading,
    items: [
      {
        q: "We already have a website. Why would we redesign it?",
        a: "If someone with an active leak has to hunt for your phone number, or the site does not load fast on a phone, it is losing you emergency jobs every week it stays up. We rebuild around getting a visitor to call immediately, not just look nice.",
      },
      {
        q: "Does this replace our on-call rotation?",
        a: "No. It answers the calls that would otherwise go to voicemail, sorts emergency from routine, and routes anything urgent straight to whoever is on call. Your team still handles the job itself, this just makes sure the call gets through in the first place.",
      },
      {
        q: "Can this connect to the field service or dispatch software we already use?",
        a: "Yes. We connect to the CRM and dispatch tools you already run, Jobber, ServiceTitan or similar, so leads, job status and quotes stay in sync instead of getting typed in twice.",
      },
      {
        q: "How fast does follow-up actually go out on a quote?",
        a: "The first follow-up goes out automatically within minutes of a quote request, then again on day one, three and seven if it has gone quiet, so a lead that was thinking it over still hears from you before they call someone else.",
      },
    ] as FaqItem[],
    cta: { label: "Talk to us about your plumbing company's website", href: "/contact" } as Cta,
  },

  cta: {
    heading: {
      eyebrow: "Ready for the next emergency call",
      title: "Talk to us about your plumbing company's website",
      body: "Book a free audit call and Growtk will tell you exactly what a faster site, an estimate widget and emergency-call triage would look like for your business.",
    } as SectionHeading,
    primary: { label: "Talk to us about your plumbing company's website", href: "/contact" } as Cta,
  },
} satisfies PageContent & Record<string, unknown>;

export default plumbing;
