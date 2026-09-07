/**
 * Cleaning industry landing page copy. Pain points are specific to how a
 * cleaning business actually loses money: a recurring visit that needs a
 * manual re-confirm every week, a one-off quote request that sits unanswered
 * while the owner is out on a job, and reviews that never get asked for
 * because there is no front desk to ask.
 */
import type { PageContent, Cta, Img, SectionHeading, Feature, FaqItem } from "../types";

export const cleaning = {
  meta: {
    title: "Cleaning company websites and booking automation",
    description:
      "Growtk builds websites, instant quote widgets and recurring-visit booking automation for residential and commercial cleaning companies, so a calendar stays full without a phone call every week.",
    path: "/industries/cleaning",
  },

  hero: {
    eyebrow: "For cleaning companies",
    title: "Stop re-confirming the same recurring visit every single week",
    body: "A cleaning business runs on repeat visits, not one-off jobs, and every week you spend calling to reconfirm a recurring booking is a week you are not out quoting new work. Growtk builds cleaning company sites that work from a phone between jobs, instant quote widgets for one-off and move-out cleans, and recurring-visit booking that keeps showing up on the calendar on its own.",
    ctas: [{ label: "Talk to us about your cleaning company's website", href: "/contact", variant: "primary" }] as Cta[],
  },

  build: {
    heading: {
      eyebrow: "What we build for cleaning companies",
      title: "Every service, built around how a cleaning business actually gets booked",
      body: "The same five things we build for any service business, worked out specifically for how cleaning work gets quoted, scheduled and repeated.",
    } as SectionHeading,
    features: [
      {
        icon: "Smartphone",
        title: "A mobile-first site built around booking a recurring visit",
        body: "Fast pages that lead straight to setting up a weekly or biweekly clean, built for someone scrolling on a phone between jobs, not a brochure site that buries the booking link.",
      },
      {
        icon: "Calculator",
        title: "An instant quote widget for one-off and move-out cleans",
        body: "A visitor enters square footage and a few details and gets a real price on the spot, so a one-off or move-out request does not sit unanswered while you are out cleaning a job.",
      },
      {
        icon: "CalendarClock",
        title: "Recurring-visit booking that runs itself",
        body: "A weekly or biweekly client stays on the calendar automatically, with reminders and confirmations that go out on their own, so nothing depends on a manual re-confirm call every week.",
      },
      {
        icon: "Star",
        title: "Automatic review requests the moment a job is marked done",
        body: "The instant a visit is checked off as complete, a review request goes out on its own, instead of reviews depending on a front desk that a small cleaning crew does not have.",
      },
      {
        icon: "Plug",
        title: "Connected to the scheduling or CRM tool you already use",
        body: "Bookings, job status and client details stay in sync with the scheduling or CRM tool your team already runs, so nothing gets entered twice.",
      },
    ] as Feature[],
  },

  faq: {
    heading: {
      eyebrow: "Questions cleaning owners ask",
      title: "What this actually looks like for a cleaning company",
    } as SectionHeading,
    items: [
      {
        q: "How do recurring bookings actually get confirmed and rescheduled?",
        a: "Once a client is set up on a weekly or biweekly schedule, confirmations and reminders go out automatically before each visit, and a client can reschedule or skip a week without anyone on your team making a phone call. You only step in when something actually needs a real conversation.",
      },
      {
        q: "We already use a scheduling tool. Does this replace it?",
        a: "No, Growtk builds around it. Whatever scheduling or CRM tool you already run today keeps handling your calendar, and we connect the booking widget and automation to it so job status and client details stay synced in both places.",
      },
      {
        q: "What about one-off jobs like a move-out clean?",
        a: "The instant quote widget handles those separately from recurring bookings. A visitor gets a real price on the spot for a one-off or move-out clean, instead of waiting on a callback just to find out what it would cost.",
      },
      {
        q: "Do you help with getting more reviews?",
        a: "Yes. A review request goes out automatically the moment a visit is marked done, while the job is still fresh in the client's mind, instead of depending on someone remembering to ask.",
      },
    ] as FaqItem[],
    cta: { label: "Talk to us about your cleaning company's website", href: "/contact" } as Cta,
  },

  cta: {
    heading: {
      eyebrow: "Ready to fill the calendar",
      title: "Talk to us about your cleaning company's website",
      body: "Book a free audit call and Growtk will tell you exactly what a faster site, an instant quote widget and recurring-visit booking would look like for your business.",
    } as SectionHeading,
    primary: { label: "Talk to us about your cleaning company's website", href: "/contact" } as Cta,
    image: {
      src: "https://images.unsplash.com/photo-1581578731548-c64695cc6952?auto=format&fit=crop&w=1600&q=80",
      alt: "A cleaner wiping down a countertop in a bright kitchen",
    } as Img,
  },
} satisfies PageContent & Record<string, unknown>;

export default cleaning;
