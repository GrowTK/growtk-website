/**
 * Process page copy. This is the detailed, seven-step expansion of the same
 * four-step process (Audit, Build, Launch, Optimize) already reused across
 * content/about.ts and content/services.ts. It is not a different process,
 * just the real sequence written out in full for a visitor who wants to know
 * exactly how an engagement runs before booking a call.
 *
 * No em dashes or en dashes. No invented stats or client counts.
 */
import type { PageContent, Cta, Img, SectionHeading, Step, FaqItem } from "./types";

export const process = {
  meta: {
    title: "How We Work",
    description:
      "The real, step by step way a Growtk engagement runs: a free discovery call, an honest automation readiness assessment, a written scope you sign off on, a weekly build, launch, and ongoing support after that.",
    path: "/process",
  },

  hero: {
    eyebrow: "How we work",
    title: "Exactly how this engagement runs, start to finish",
    body: "No slide decks and no vague promises. This is the real sequence Growtk follows on every project, from the first phone call to the tuning that happens after a site or automation is already live.",
    ctas: [
      { label: "Book a free discovery call", href: "/contact", variant: "primary" },
      { label: "See what we build", href: "/services", variant: "secondary" },
    ] as Cta[],
  },

  steps: {
    heading: {
      eyebrow: "The seven steps",
      title: "Seven steps, in order, every time",
      body: "Some projects move through all seven in a few weeks, others take longer because there is more to connect. Either way, this is the order, and nothing gets built before the step before it is done.",
    } as SectionHeading,
    items: [
      {
        n: 1,
        title: "Discovery call",
        body: "A free, no obligation conversation about the business: the current site, how phone calls and bookings actually get handled today, and the tools already running behind the scenes. No pitch, just questions.",
      },
      {
        n: 2,
        title: "AI and automation readiness assessment",
        body: "Growtk actually looks at where manual, repetitive work is piling up: missed calls, slow follow-up, tools that do not talk to each other. That gets sorted into what is realistically worth automating first, and what is not worth touching yet.",
      },
      {
        n: 3,
        title: "Requirement gathering and scoping",
        body: "The assessment turns into a concrete, written scope: what actually gets built, what it connects to, and what it costs. This gets agreed before a single line of code gets written, not discovered halfway through.",
      },
      {
        n: 4,
        title: "Proposal and sign-off",
        body: "A clear, final proposal the client actually reads and signs. Once it is signed, there is no ambiguity left about deliverables or price, and no surprise invoice waiting at the end.",
      },
      {
        n: 5,
        title: "Build and integrate",
        body: "The actual build happens in short rounds, so there is something real to look at every week, not just at the end. It gets connected to the CRM, calendar and tools the business already runs, not a separate system to manage on top.",
      },
      {
        n: 6,
        title: "Launch",
        body: "Shipped and actually live: taking real calls, booking real jobs, not sitting in a staging environment waiting for a better time.",
      },
      {
        n: 7,
        title: "Optimize and support",
        body: "The work does not stop at launch. Automation rules, voice agent scripts and the site itself keep getting adjusted after launch, based on what is actually happening, not a guess made before it went live.",
      },
    ] as Step[],
  },

  faq: {
    heading: {
      eyebrow: "Before you book",
      title: "Questions people ask about the process",
    } as SectionHeading,
    items: [
      {
        q: "Do we have to go through every step?",
        a: "Yes, in some form, but not always at full length. A small automation fix might move from discovery to a signed proposal in a single conversation. A full website and automation build gets a proper written scope, since more is riding on it.",
      },
      {
        q: "How long does scoping take?",
        a: "Usually a few days after the discovery call and assessment. We would rather take an extra day to get the scope right than start building against a guess and have to redo it.",
      },
      {
        q: "What happens if something changes after we sign off?",
        a: "It gets discussed and, if it changes the cost or the timeline, put in writing before any extra work starts. Nothing gets added to the bill quietly.",
      },
      {
        q: "Does support end after launch?",
        a: "No. Optimize and support is the seventh step, not an afterthought. Growtk stays involved after launch to tune automation, voice agent scripts and the site itself as real usage shows what is working.",
      },
    ] as FaqItem[],
    cta: { label: "See what we build", href: "/services" } as Cta,
  },

  cta: {
    heading: {
      eyebrow: "Ready to start",
      title: "Book the discovery call and see where you land in this process",
      body: "There is no cost and no obligation to the first conversation. Growtk will tell you honestly which step you are actually starting from.",
    } as SectionHeading,
    primary: { label: "Book a free discovery call", href: "/contact" } as Cta,
  },
} satisfies PageContent & Record<string, unknown>;

export default process;
