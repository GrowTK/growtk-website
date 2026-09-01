/**
 * Services page copy. Growtk is a service agency, not a SaaS product: it
 * redesigns outdated websites and builds custom software for small and
 * mid-size trade and service businesses. Five services, always in this
 * order, always with these anchor ids so the footer's /services#<id> links
 * actually land on the right section.
 *
 * No em dashes or en dashes. No invented stats or client counts.
 */
import type { PageContent, Cta, Img, SectionHeading, Step, FaqItem } from "./types";

/** One of the five service sections rendered by ServicesList. */
export type ServiceItem = {
  id: "website-redesign" | "widgets" | "automation" | "voice-agents" | "integrations";
  eyebrow: string;
  title: string;
  body: string;
  bullets: string[];
  image: Img;
};

export const services = {
  meta: {
    title: "Services",
    description:
      "Growtk builds website redesigns, custom widgets, workflow automation, voice agents and integrations for trade and service businesses, so more visitors and calls turn into booked jobs.",
    path: "/services",
  },

  hero: {
    eyebrow: "What we build",
    title: "Software that turns visitors and phone calls into booked jobs",
    body: "Growtk designs and builds the website, tools and automation that trade and service businesses run on day to day: a redesigned site, custom widgets, workflow automation, voice agents and integrations, each one built around how your business actually takes and closes work.",
    ctas: [{ label: "Book a free audit call", href: "/contact", variant: "primary" }] as Cta[],
  },

  process: {
    heading: {
      eyebrow: "How we work",
      title: "Four steps, no guesswork",
      body: "Every engagement starts with a free audit call and ends with something live you can point customers to, not a slide deck.",
    } as SectionHeading,
    steps: [
      {
        n: 1,
        title: "Audit",
        body: "We look at your current site, your phone and booking workflow, and the tools you already use, then map out exactly what would move the needle first.",
      },
      {
        n: 2,
        title: "Build",
        body: "We design and build the site, widget, automation or voice agent, working in short rounds so you see real progress every week, not just at the end.",
      },
      {
        n: 3,
        title: "Launch",
        body: "We ship it, connect it to the tools you already run, and make sure it is actually live and taking leads, not sitting in a staging environment.",
      },
      {
        n: 4,
        title: "Optimize",
        body: "We keep tuning it after launch: adjusting automation rules, voice agent scripts and the site itself as we see what is actually working.",
      },
    ] as Step[],
  },

  services: [
    {
      id: "website-redesign",
      eyebrow: "01. Website redesign",
      title: "Website redesign",
      body: "If your site was built years ago, or built by whoever was cheapest, it is probably costing you jobs. We design and build modern, fast, mobile-first websites for trade and service businesses, built to turn visitors into calls and quote requests instead of just sitting there.",
      bullets: [
        "A design built around your services and service area, not a generic template",
        "Fast load times and a mobile-first layout, since most calls start on a phone",
        "Clear calls to action: request a quote, call now, or book a job",
        "Launched in weeks, not months",
      ],
      image: {
        src: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=1200&q=80",
        alt: "A laptop displaying a website mockup on a busy workspace desk",
      },
    },
    {
      id: "widgets",
      eyebrow: "02. Custom widgets",
      title: "Custom widgets",
      body: "Widgets are small, embeddable tools built for exactly what your business does: an instant quote calculator for a roofing job, a booking widget for a fencing consult, live chat that actually answers questions, a review display, or a service-area checker that tells a visitor in one click whether you cover their zip code.",
      bullets: [
        "Instant quote calculators built around your actual pricing",
        "Booking widgets connected to your real calendar",
        "Live chat and review displays that reflect your business, not a generic template",
        "Service-area checkers that stop unqualified leads before they call",
      ],
      image: {
        src: "https://images.unsplash.com/photo-1617106400337-66e7d72a466e?auto=format&fit=crop&w=1200&q=80",
        alt: "A person holding a phone with a booking and scheduling interface open",
      },
    },
    {
      id: "automation",
      eyebrow: "03. Workflow automation",
      title: "Workflow automation",
      body: "We build the automation that connects the tools you already run, using n8n-style workflow tooling, comparable to what Zapier or Make do, but built and maintained by us for your specific business. We build the automation. We are not asking you to become a workflow engineer.",
      bullets: [
        "Lead routing, so a new lead reaches the right person immediately",
        "Follow-up sequences that fire automatically after a quote or a missed call",
        "Scheduling, invoicing and review request automations",
        "CRM syncing so your systems agree with each other",
      ],
      image: {
        src: "https://images.unsplash.com/photo-1542744094-24638eff58bb?auto=format&fit=crop&w=1200&q=80",
        alt: "A person writing out a workflow plan on a whiteboard during a planning session",
      },
    },
    {
      id: "voice-agents",
      eyebrow: "04. Voice agents",
      title: "Voice agents",
      body: "AI voice agents answer calls, book jobs, qualify leads and run follow-up calls, so repetitive phone work stops eating your day. A voice agent picks up when your team can't, asks the right questions, and gets the job on your calendar.",
      bullets: [
        "Answers incoming calls day and night, not just business hours",
        "Books jobs directly onto your calendar",
        "Qualifies leads before a human ever picks up the phone",
        "Runs outbound follow-up calls after a quote goes cold",
      ],
      image: {
        src: "https://images.unsplash.com/photo-1712159018726-4564d92f3ec2?auto=format&fit=crop&w=1200&q=80",
        alt: "A man wearing a headset while working at a computer, handling a call",
      },
    },
    {
      id: "integrations",
      eyebrow: "05. Integrations",
      title: "Integrations",
      body: "We connect with almost any tool your business already uses: CRMs like Jobber, ServiceTitan or HubSpot, payments through Stripe, scheduling through Calendly, communication through Twilio, WhatsApp, email and SMS, forms, Google and Meta lead ads, QuickBooks, and Google Calendar or Workspace. If you already have tools you like, we connect to them rather than asking you to replace them.",
      bullets: [
        "CRM connections: Jobber, ServiceTitan, HubSpot and more",
        "Payments and scheduling: Stripe, Calendly",
        "Communication: Twilio, WhatsApp, email and SMS",
        "Lead capture and accounting: Google and Meta lead ads, QuickBooks",
      ],
      image: {
        src: "https://images.unsplash.com/photo-1667264501379-c1537934c7ab?auto=format&fit=crop&w=1200&q=80",
        alt: "Four charging cable connectors bundled together against a blue background",
      },
    },
  ] as ServiceItem[],

  faq: {
    heading: {
      eyebrow: "Before you book",
      title: "What people ask before they call",
    } as SectionHeading,
    items: [
      {
        q: "Do I need all five services?",
        a: "No. Most clients start with one, usually a website redesign or a voice agent, and add the others once the first one is working. The Grow tier bundles all of them together for businesses that want the full build at once.",
      },
      {
        q: "How long does a project take?",
        a: "A website redesign typically launches in weeks, not months. Automation and voice agent builds vary depending on how many tools and workflows are involved. We will give you a real timeline on the audit call.",
      },
      {
        q: "Will this replace the tools we already use?",
        a: "Usually not. Most of what we build connects to the CRM, calendar and payment tools you already run, rather than asking you to switch to something new.",
      },
      {
        q: "Do you work outside roofing, railing and fencing, and healthcare?",
        a: "Those are the industries we work in most today, and we are adding more over time. If your business is not listed, get in touch and we will tell you honestly whether it is a good fit.",
      },
      {
        q: "What does it cost?",
        a: "It depends on scope. Website redesigns start at a fixed price, and automation or voice agent work is typically ongoing. Book a free audit call and we will give you a real number, not a guess.",
      },
    ] as FaqItem[],
    cta: { label: "Book a free audit call", href: "/contact" } as Cta,
  },

  cta: {
    heading: {
      eyebrow: "Ready to start",
      title: "Tell us what's slowing your business down",
      body: "Book a free audit call and we will tell you exactly which service would move the needle first.",
    } as SectionHeading,
    primary: { label: "Book a free audit call", href: "/contact" } as Cta,
  },
} satisfies PageContent & Record<string, unknown>;

export default services;
