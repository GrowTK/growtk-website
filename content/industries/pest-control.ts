/**
 * Pest control industry landing page copy. Pest control runs on two clocks:
 * a brand new infestation call that gets won by whoever answers and books
 * first, and a recurring quarterly or seasonal treatment plan that quietly
 * lapses the moment a renewal reminder gets missed. Growtk builds for both.
 */
import type { PageContent, Cta, Img, SectionHeading, Feature, FaqItem } from "../types";

export const pestControl = {
  meta: {
    title: "Pest control company websites and automation",
    description:
      "Growtk builds websites, instant quote widgets, renewal automation and voice agents for pest control companies, so new infestation calls get booked fast and recurring treatment plans never quietly lapse.",
    path: "/industries/pest-control",
  },

  hero: {
    eyebrow: "For pest control companies",
    title: "Win the new infestation call, keep the recurring contract",
    body: "A homeowner with ants, rodents or a wasp nest calls whoever answers first, and a quarterly treatment plan renews itself only if someone remembers to send the reminder. Growtk builds pest control sites that book a new job fast from a phone, quote widgets that answer before you pick up, and renewal automation that rebooks recurring customers without anyone chasing it by hand.",
    ctas: [{ label: "Talk to us about your pest control company's website", href: "/contact", variant: "primary" }] as Cta[],
  },

  build: {
    heading: {
      eyebrow: "What we build for pest control companies",
      title: "Built for two different clocks: the new call and the recurring plan",
      body: "The same five things Growtk builds for any trade business, worked out specifically for how pest control gets booked once and rebooked every season.",
    } as SectionHeading,
    features: [
      {
        icon: "Smartphone",
        title: "A mobile-first site built around booking fast",
        body: "Fast, mobile-first pages that turn someone searching for help with ants, rodents or termites into a booked treatment in a couple of taps, instead of a site that makes them dig for a phone number.",
      },
      {
        icon: "Bug",
        title: "An instant quote and inspection-request widget",
        body: "A homeowner describes the pest and their property and gets a real ballpark price or an inspection booked on the spot, so a new infestation lead does not wait on a callback to find out if it is worth calling at all.",
      },
      {
        icon: "RefreshCw",
        title: "Automated renewal reminders and rebooking",
        body: "Every recurring treatment plan gets a renewal reminder and a rebooking link sent out automatically before the due date, so a quarterly contract never quietly lapses because nobody remembered to follow up.",
      },
      {
        icon: "Mic",
        title: "A voice agent that answers new infestation calls any hour",
        body: "Calls that come in at nine at night or on a weekend get answered and a treatment gets booked, so a wasp nest reported after hours does not turn into a job for whichever competitor picks up instead.",
      },
      {
        icon: "Plug",
        title: "Connected to the CRM or route-scheduling tool you already use",
        body: "Leads, jobs and recurring schedules stay in sync with the CRM or route-scheduling tool your technicians already run today, so nothing gets typed in twice.",
      },
    ] as Feature[],
  },

  faq: {
    heading: {
      eyebrow: "Questions pest control owners ask",
      title: "What this actually looks like for a pest control company",
    } as SectionHeading,
    items: [
      {
        q: "We already have a website. Why would we redesign it?",
        a: "If it does not load fast on a phone, or a new infestation lead has to hunt for a way to actually book, it is costing you jobs every week it stays up. We rebuild around getting a visitor to call or request an inspection, not just look nice.",
      },
      {
        q: "How do you handle recurring contract renewals?",
        a: "Every recurring treatment plan gets an automated reminder and a rebooking link sent out ahead of its due date, so renewing does not depend on someone on your team remembering to follow up by hand.",
      },
      {
        q: "Does the voice agent replace our office staff?",
        a: "No. It answers the calls that would otherwise go to voicemail, after hours, mid-route, or when the phones are already busy, and books what it can straight onto your schedule. Your team still handles anything that needs a real conversation.",
      },
      {
        q: "We already use scheduling software to route our technicians. Does this replace it?",
        a: "No, we connect to it. Leads, jobs and recurring visit schedules stay synced with the CRM or route-scheduling tool your technicians already run.",
      },
    ] as FaqItem[],
    cta: { label: "Talk to us about your pest control company's website", href: "/contact" } as Cta,
  },

  cta: {
    heading: {
      eyebrow: "Ready for the next call",
      title: "Talk to us about your pest control company's website",
      body: "Book a free audit call and we will tell you exactly what a faster site, an instant quote widget and renewal automation would look like for your business.",
    } as SectionHeading,
    primary: { label: "Talk to us about your pest control company's website", href: "/contact" } as Cta,
    image: {
      src: "https://images.unsplash.com/photo-1494526585095-c41746248156?auto=format&fit=crop&w=1600&q=80",
      alt: "A modern suburban house exterior with landscaping lit at dusk",
    } as Img,
  },
} satisfies PageContent & Record<string, unknown>;

export default pestControl;
