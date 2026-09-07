/**
 * Landscaping and lawn care industry landing page copy. Pain points are
 * specific to how this business actually makes money: recurring maintenance
 * plans that should renew themselves without a phone call every spring, a
 * new estimate request that goes cold before a competitor calls back, and
 * reviews that never get asked for after a completed visit.
 */
import type { PageContent, Cta, Img, SectionHeading, Feature, FaqItem } from "../types";

export const landscaping = {
  meta: {
    title: "Landscaping and lawn care company websites and automation",
    description:
      "Growtk builds websites, instant estimate widgets, recurring-plan booking and review automation for landscaping and lawn care companies, so a season of mowing and maintenance work books itself.",
    path: "/industries/landscaping",
  },

  hero: {
    eyebrow: "For landscaping and lawn care companies",
    title: "Stop re-selling the same customer every spring",
    body: "The real money in landscaping is a customer who books a mowing or maintenance plan every season without you calling to remind them. Growtk builds sites that turn a search for a cleanup or a new lawn into a recurring plan, estimate widgets that answer a one-off job on the spot, and follow-up that goes out automatically so a new estimate request never sits long enough for a competitor to call back first.",
    ctas: [{ label: "Talk to us about your landscaping company's website", href: "/contact", variant: "primary" }] as Cta[],
  },

  build: {
    heading: {
      eyebrow: "What we build for landscaping companies",
      title: "Every service, built around how landscaping work actually gets booked",
      body: "The same five things we build for any trade business, worked out specifically for recurring plans, seasonal cleanups and hardscaping quotes.",
    } as SectionHeading,
    features: [
      {
        icon: "Smartphone",
        title: "A mobile-first site built around recurring plans",
        body: "Fast pages designed to turn a visitor into a season-long mowing or maintenance plan, not just a single job, since recurring revenue is where landscaping companies actually make money.",
      },
      {
        icon: "Calculator",
        title: "An instant estimate widget for one-off jobs",
        body: "A homeowner describes a cleanup, a mulch job or a hardscaping project and gets a real ballpark estimate immediately, instead of waiting on a callback to find out if it is worth their time.",
      },
      {
        icon: "RefreshCw",
        title: "Recurring service booking that renews itself",
        body: "A maintenance plan renews automatically each season without anyone on your team picking up the phone, so a customer from last spring is already booked before the grass starts growing again.",
      },
      {
        icon: "Zap",
        title: "Automated follow-up on new estimate requests",
        body: "Every new estimate request gets a response within minutes, day or night, so it never sits in an inbox long enough for a competitor to call back first.",
      },
      {
        icon: "Star",
        title: "Review-request automation after every visit",
        body: "Once a job is marked complete, a review request goes out on its own, so your reputation builds visit by visit instead of depending on someone remembering to ask.",
      },
    ] as Feature[],
  },

  faq: {
    heading: {
      eyebrow: "Questions landscaping owners ask",
      title: "What this actually looks like for a landscaping company",
    } as SectionHeading,
    items: [
      {
        q: "How do recurring plans actually get billed and renewed?",
        a: "A customer signs up for a season or a standing schedule once, and the plan bills and renews on its own from there, without your office calling to re-book them every spring. You keep full visibility into who is on a plan and when it renews.",
      },
      {
        q: "We already use scheduling or route-planning software. Does this replace it?",
        a: "No, Growtk builds around it. Bookings, routes and job status stay connected to the scheduling or route-planning tool your crews already use, so nothing gets entered twice.",
      },
      {
        q: "How fast can a new estimate request actually get a response?",
        a: "Automation sends the first response within minutes of a form submission or a missed call, so a request for a cleanup or a new install hears back from Growtk long before it goes to a competitor instead.",
      },
      {
        q: "Do review requests go out to every single customer?",
        a: "They go out automatically after a visit is marked complete, so asking for a review stops depending on someone remembering to do it by hand after a busy day.",
      },
    ] as FaqItem[],
    cta: { label: "Talk to us about your landscaping company's website", href: "/contact" } as Cta,
  },

  cta: {
    heading: {
      eyebrow: "Ready for the next season",
      title: "Talk to us about your landscaping company's website",
      body: "Book a free audit call and we will tell you exactly what a faster site, an instant estimate widget and recurring-plan booking would look like for your business.",
    } as SectionHeading,
    primary: { label: "Talk to us about your landscaping company's website", href: "/contact" } as Cta,
    image: {
      src: "https://images.unsplash.com/photo-1592417817098-8fd3d9eb14a5?auto=format&fit=crop&w=1600&q=80",
      alt: "A landscaper trimming hedges in a well maintained garden",
    } as Img,
  },
} satisfies PageContent & Record<string, unknown>;

export default landscaping;
