/**
 * Services hub copy (/services). Thirteen services in four groups, each with
 * its own page under /services/<slug> (content/service-pages.ts). Growtk
 * delivers them AI first: AI agents and automation do the work around the
 * clock, and a person steps in on escalation.
 *
 * No em dashes or en dashes. No invented stats or client counts.
 */
import type { PageContent, Cta, Img, SectionHeading, Step, FaqItem } from "./types";

/** Row shape for the ServiceRows / ServicesList components (kept for the section library; the hub no longer uses them). */
export type ServiceItem = {
  id: string;
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
      "Thirteen AI-first outsourcing services from Growtk: contact center, inbound and outbound, customer and technical support, e-commerce support, lead generation, telemarketing, sales support, back office, CX, workforce management and process reengineering.",
    path: "/services",
  },

  hero: {
    eyebrow: "Services",
    title: "Outsourcing that scales with your business",
    body: "From the first customer call to a qualified pipeline and a cleared back office, our AI agents plug into your operation and do the work around the clock, with a person stepping in whenever a human should. Pick one service or run them together.",
    ctas: [{ label: "Book a free audit", href: "/contact", variant: "primary" }] as Cta[],
  },

  /** One strip per group on the hub; the group copy itself lives in content/service-pages.ts. */
  groupsEyebrow: "Service group",

  process: {
    heading: {
      eyebrow: "How we work",
      title: "Four steps, no guesswork",
      body: "Every engagement starts with a free audit and ends with something live, answering real customers, not a slide deck.",
    } as SectionHeading,
    steps: [
      {
        n: 1,
        title: "Audit",
        body: "We map your channels, your volume and the tools you already run, and find where requests wait, get dropped or need a person who is not there.",
      },
      {
        n: 2,
        title: "Design",
        body: "A written plan: what the AI agents handle, what goes to a person and how, which systems they connect to, and what it costs.",
      },
      {
        n: 3,
        title: "Launch",
        body: "We build inside your own tools, test on real conversations and go live one channel at a time, so nothing breaks on day one.",
      },
      {
        n: 4,
        title: "Improve",
        body: "We review conversations every week, tune scripts and rules, and add channels and services once the first one runs clean.",
      },
    ] as Step[],
  },

  industries: {
    heading: {
      eyebrow: "Built for your industry",
      title: "Set up for the business you actually run",
      body: "The same services, worked out for how each industry takes calls, quotes and bookings.",
    } as SectionHeading,
    cta: { label: "See all industries", href: "/industries" } as Cta,
  },

  faq: {
    heading: {
      eyebrow: "Before you book",
      title: "What teams ask before they outsource",
      body: "Scope, timing, people and data, answered plainly. Anything else, ask us on the audit call.",
    } as SectionHeading,
    items: [
      {
        q: "Do I need more than one service?",
        a: "No. Most teams start with the service that carries the most volume, usually inbound support or lead response, and add the next once the first is running clean.",
      },
      {
        q: "Who handles what the AI cannot?",
        a: "A person, on the escalation path you choose: your own team, a specific role, or an on-call rota. Every handoff arrives with a summary and the full conversation.",
      },
      {
        q: "Will this replace the tools we already use?",
        a: "Usually not. We build inside the CRM, helpdesk, phone line and calendar you already run, and only build new systems where you do not have one.",
      },
      {
        q: "How long until we are live?",
        a: "A first channel is usually live in weeks, not months. The timeline is set on the free audit call and written into the proposal before work starts.",
      },
      {
        q: "What does it cost?",
        a: "It depends on the services, channels and volume. Book a free audit and we will give you a real number in a written proposal, not a guess.",
      },
    ] as FaqItem[],
    cta: { label: "Book a free audit", href: "/contact" } as Cta,
  },

  cta: {
    heading: {
      eyebrow: "Not sure which service fits?",
      title: "Tell us where your team is stretched",
      body: "Book a free audit and we will tell you which service would take the most work off your plate first.",
    } as SectionHeading,
    primary: { label: "Book a free audit", href: "/contact" } as Cta,
  },
} satisfies PageContent & Record<string, unknown>;

export default services;
