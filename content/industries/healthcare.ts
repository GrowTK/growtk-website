/**
 * Healthcare industry landing page copy. Front office focus only: scheduling,
 * reminders and routine call handling, never a clinical or treatment claim.
 * No HIPAA certification claim anywhere, no compliance guarantee. Growtk is
 * not a covered entity or a compliance vendor, see the FAQ item that answers
 * this directly instead of dodging it.
 */
import type { PageContent, Cta, Img, SectionHeading, Feature, FaqItem } from "../types";

export const healthcare = {
  meta: {
    title: "Healthcare front office websites and scheduling automation",
    description:
      "Growtk builds booking widgets, appointment reminder automation and voice agents for healthcare front offices, so staff spend less time on phone tag and no-shows.",
    path: "/industries/healthcare",
  },

  hero: {
    eyebrow: "For healthcare front offices",
    title: "Stop losing the day to phone tag over scheduling",
    body: "A front desk that is on the phone booking, rescheduling and chasing no-shows all day has less time for the patient standing in front of them. We build the booking widget, reminders and call handling that take the repetitive scheduling work off your staff, without touching anything clinical.",
    ctas: [{ label: "Talk to us about your practice's website", href: "/contact", variant: "primary" }] as Cta[],
  },

  build: {
    heading: {
      eyebrow: "What we build for healthcare front offices",
      title: "Every service, built around how a practice actually schedules",
      body: "The same five things we build for any trade or service business, worked out specifically for front-office scheduling and patient communication.",
    } as SectionHeading,
    features: [
      {
        icon: "Globe",
        title: "A site built around booking, not just information",
        body: "Fast, mobile-first pages that make it obvious how to book, with a booking widget on the page itself instead of a phone number as the only option.",
      },
      {
        icon: "CalendarCheck",
        title: "A booking widget synced to your real calendar",
        body: "Patients see actual open slots and book directly, instead of calling and waiting for someone at the front desk to check the schedule.",
      },
      {
        icon: "BellRing",
        title: "Automated reminders and no-show follow-up",
        body: "Appointment reminders go out automatically, and a missed appointment triggers a follow-up to get it rebooked, instead of relying on staff to remember.",
      },
      {
        icon: "Headset",
        title: "A voice agent for routine scheduling calls",
        body: "Handles booking, rescheduling and simple questions over the phone, so your front desk is not tied to the phone for every routine call.",
      },
      {
        icon: "Plug",
        title: "Connected to the calendar and tools you already use",
        body: "Syncs with the scheduling system and calendar your practice already runs, so appointments stay in one place instead of two.",
      },
    ] as Feature[],
  },

  faq: {
    heading: {
      eyebrow: "Questions practices ask",
      title: "What this actually looks like for a healthcare front office",
    } as SectionHeading,
    items: [
      {
        q: "Is this HIPAA compliant?",
        a: "We are not a compliance vendor and do not claim any HIPAA certification, no vendor legitimately can. What we build, booking widgets, reminders and call handling, is designed around how a front office actually needs to handle scheduling and patient communication, and we talk through what that means for your practice on the audit call before anything is built.",
      },
      {
        q: "Does the voice agent handle clinical questions?",
        a: "No. It is built for routine, non-clinical scheduling calls: booking, rescheduling and simple questions your front desk answers today. Anything clinical goes to your staff.",
      },
      {
        q: "Will this replace our front desk staff?",
        a: "No, it takes the repetitive scheduling calls and reminders off their plate so they have more time for the patients actually in front of them.",
      },
      {
        q: "Can it connect to the scheduling system we already use?",
        a: "Yes, we build around the calendar and tools your practice already runs rather than asking you to switch systems.",
      },
    ] as FaqItem[],
    cta: { label: "Talk to us about your practice's website", href: "/contact" } as Cta,
  },

  cta: {
    heading: {
      eyebrow: "Ready to get scheduling off the phone",
      title: "Talk to us about your practice's website",
      body: "Book a free audit call and we will tell you exactly what a booking widget, reminder automation and call handling would look like for your front office.",
    } as SectionHeading,
    primary: { label: "Talk to us about your practice's website", href: "/contact" } as Cta,
    image: {
      src: "https://images.unsplash.com/photo-1689848693914-7ba25d9f3334?auto=format&fit=crop&w=1600&q=80",
      alt: "A front desk staff member scheduling a call at her desk",
    } as Img,
  },
} satisfies PageContent & Record<string, unknown>;

export default healthcare;
