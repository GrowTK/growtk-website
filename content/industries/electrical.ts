/**
 * Electrical industry landing page copy. Pain points are specific to how
 * electrical calls actually split: a routine estimate for a panel upgrade
 * or a remodel, and a genuine safety call that cannot wait, with no way for
 * a homeowner to signal which one they are before someone picks up.
 */
import type { PageContent, Cta, Img, SectionHeading, Feature, FaqItem } from "../types";

export const electrical = {
  meta: {
    title: "Electrical contractor websites and automation",
    description:
      "Growtk builds websites, estimate widgets, safety-call triage and voice agents for electrical contractors, so every call gets sorted correctly and every estimate request gets booked.",
    path: "/industries/electrical",
  },

  hero: {
    eyebrow: "For electrical contractors",
    title: "A tripped breaker and a panel upgrade quote should never wait in the same line",
    body: "A homeowner calling about a burning smell and a homeowner calling for a remodel estimate sound identical until someone actually answers. Growtk builds electrical contractor sites and call systems that tell the two apart immediately, book the routine estimate straight onto your calendar, and put the safety call in front of a person right away, so the one that cannot wait never waits.",
    ctas: [{ label: "Talk to us about your electrical business's website", href: "/contact", variant: "primary" }] as Cta[],
  },

  build: {
    heading: {
      eyebrow: "What we build for electrical contractors",
      title: "Every service, built around how an electrical call actually comes in",
      body: "The same things we build for any trade business, worked out specifically for how electrical work gets triaged, quoted and booked.",
    } as SectionHeading,
    features: [
      {
        icon: "Smartphone",
        title: "A mobile-first site built around instant estimates",
        body: "Fast pages that let someone searching for a panel upgrade or a remodel request an estimate in a few taps, built for a phone screen instead of a desktop monitor nobody uses to search for an electrician.",
      },
      {
        icon: "Calculator",
        title: "An estimate widget for panel upgrades and remodel work",
        body: "A homeowner answers a few questions about their panel size or the scope of the remodel and gets a real ballpark on the spot, instead of waiting on a callback just to find out if it is worth calling at all.",
      },
      {
        icon: "SquareSplitVertical",
        title: "Call triage that separates safety calls from estimate requests",
        body: "Every incoming call gets sorted the moment it comes in: a tripped breaker that keeps tripping or a burning smell gets flagged as urgent, a panel upgrade or remodel question gets routed as a routine estimate.",
      },
      {
        icon: "Siren",
        title: "A voice agent that answers and escalates anything urgent",
        body: "Calls get answered day or night, book the routine estimate directly, and immediately escalate anything that sounds like exposed wiring, a burning smell or a breaker that will not stay reset, so a safety issue never sits in a queue.",
      },
      {
        icon: "Plug",
        title: "Connected to the CRM or scheduling tool you already run",
        body: "Estimates, job status and schedules stay in sync with the CRM or scheduling tool you already use today, so a booked estimate does not have to be typed in twice.",
      },
    ] as Feature[],
  },

  faq: {
    heading: {
      eyebrow: "Questions electrical owners ask",
      title: "What this actually looks like for an electrical contractor",
    } as SectionHeading,
    items: [
      {
        q: "How does an urgent safety call get handled differently from a routine one?",
        a: "The moment a call comes in, it gets sorted. A tripped breaker that keeps tripping, a burning smell or exposed wiring gets flagged as urgent and escalated to a person immediately. A panel upgrade or remodel question gets treated as a routine estimate and booked straight onto your calendar, so nothing that can wait ties up a line that a real emergency needs.",
      },
      {
        q: "Can this connect to the scheduling software we already use?",
        a: "Yes. We build around the CRM or scheduling tool you already run today, whether that is Jobber, ServiceTitan or something else, so estimates and job status stay synced without anyone re-entering the same job twice.",
      },
      {
        q: "Does the voice agent replace our office staff?",
        a: "No. It answers calls that would otherwise go to voicemail, after hours, mid job, or when the phones are already busy, books what it can straight onto your calendar, and escalates anything urgent to a real person. Your team still handles anything that needs a real conversation.",
      },
      {
        q: "We already have a website. Why would we redesign it?",
        a: "If it does not load fast on a phone, or someone searching for a panel upgrade has to dig for a way to request an estimate, it is costing you jobs every week it stays up. We rebuild around getting a visitor to call or request an estimate, not just look nice.",
      },
    ] as FaqItem[],
    cta: { label: "Talk to us about your electrical business's website", href: "/contact" } as Cta,
  },

  cta: {
    heading: {
      eyebrow: "Ready when the call comes in",
      title: "Talk to us about your electrical business's website",
      body: "Book a free audit call and Growtk will tell you exactly what a faster site, an estimate widget and safety-call triage would look like for your business.",
    } as SectionHeading,
    primary: { label: "Talk to us about your electrical business's website", href: "/contact" } as Cta,
    image: {
      src: "https://images.unsplash.com/photo-1621905251189-08b45d6a269e?auto=format&fit=crop&w=1600&q=80",
      alt: "An electrician in a yellow hard hat installing wiring on an exterior panel",
    } as Img,
  },
} satisfies PageContent & Record<string, unknown>;

export default electrical;
