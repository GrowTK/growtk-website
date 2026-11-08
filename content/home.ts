/**
 * Home page copy. Growtk runs customer operations for businesses, AI first:
 * AI agents answer, qualify, resolve and follow up across voice, chat, email
 * and messaging, automation clears the back office, and a person steps in on
 * escalation. Page structure follows the outsourcing site the founder chose
 * as the reference; every line here is Growtk's own and only claims what
 * Growtk builds and runs.
 *
 * Keep every string free of em dashes and en dashes.
 */
import type { PageContent, Cta, Img, SectionHeading, Stat, FaqItem, Testimonial, Feature, StatementStep } from "./types";

type IndustryCard = { icon: string; name: string; teaser: string; href: string };
import { industryPages } from "./industry-pages";
import type { StackItem } from "@/components/sections/solutions/solutions-stack";
import type { Outcome } from "@/components/sections/testimonials/outcome-spotlight";

export const home = {
  meta: {
    title: "Growtk: AI-first contact center, lead generation and back office outsourcing",
    description:
      "Growtk runs your contact center, customer support, lead generation and back office with AI agents and automation, with a person on hand for every escalation. Scale without adding headcount.",
    path: "/",
  },

  hero: {
    eyebrow: "AI-first outsourcing",
    title: "Customer operations that never clock out.",
    body: "Growtk runs your customer operations with AI agents that answer every call, chat and email, qualify every lead and clear the back office, with a person stepping in whenever a human should. Scale support and sales without adding headcount.",
    ctas: [
      { label: "Explore services", href: "/services", variant: "primary" },
      { label: "Talk to us", href: "/contact", variant: "secondary" },
    ] as Cta[],
    /** Accessible name for the animated line figure on the hero's right. */
    figureLabel: "A call rings, an AI agent answers and qualifies it, the request moves through automation, books on the calendar and closes with a receipt",
    video: {
      src: "/brand/blob-animation.mp4",
      poster: "/brand/blob-poster.jpg",
    },
    stats: [
      { value: "24/7", label: "AI agents answer calls, chats and email around the clock" },
      { value: "13", label: "outsourcing services, from inbound support to back office" },
      { value: "4", label: "systems we build in: knowledge base, helpdesk, quality and surveys" },
      { value: "1", label: "free audit to scope what to automate first" },
    ] as Stat[],
  },

  /** Centered about copy with four parallax sticky notes, one per moment a customer reaches you. */
  about: {
    eyebrow: "Who we are",
    title: "Customer operations,\nrun around the clock.",
    body: "We combine AI agents with human judgment to run your contact center, support desk, lead pipeline and back office. Every call, chat and form gets answered, logged in your CRM and followed up, so you grow without hiring a floor of agents.",
    ctas: [
      { label: "Explore services", href: "/services", variant: "primary" },
      { label: "About us", href: "/about", variant: "secondary" },
    ] as Cta[],
    /**
     * Sticky notes around the copy, read clockwise from top left as the moments
     * a customer reaches you. `doodle` picks the ink drawing; `lines` is the handwriting.
     */
    notes: [
      {
        color: "#FFDE59",
        lines: ["Call answered", "on the first ring"],
        doodle: "phone",
        position: "left-[7%] top-[11%]",
        rotate: "-rotate-6",
        speed: 0.7,
      },
      {
        color: "#F2C4FF",
        lines: ["Chat resolved,", "or handed to a person"],
        doodle: "browser",
        position: "right-[7%] top-[12%]",
        rotate: "rotate-5",
        speed: 1.2,
      },
      {
        color: "#FFBA7B",
        lines: ["Lead qualified", "and booked in seconds"],
        doodle: "calendar",
        position: "left-[11%] bottom-[11%]",
        rotate: "rotate-3",
        speed: 1,
      },
      {
        color: "#A8E6B8",
        lines: ["Ticket closed.", "Survey sent for you"],
        doodle: "star",
        position: "right-[9%] bottom-[9%]",
        rotate: "-rotate-4",
        speed: 0.85,
      },
    ] as { color: string; lines: string[]; doodle: "browser" | "phone" | "calendar" | "star"; position: string; rotate: string; speed: number }[],
  },

  /** Heading plus a single centered voice demo blob: where AI agents meet human judgment. */
  voice: {
    heading: {
      eyebrow: "AI plus people",
      title: "Where AI agents meet human judgment",
      body: "AI agents take the volume: answering, qualifying, booking and following up, day and night. People take the moments that need a human, with the whole conversation already in front of them.",
    } as SectionHeading,
    src: "/brand/blob-animation.mp4",
    poster: "/brand/blob-poster.jpg",
    title: "Growtk voice agent",
    subtitle: "Demo recording coming soon",
  },

  /** Compact black band, LogoMarqueeBand: heading left, moving CRM wordmarks right. */
  integrations: {
    heading: {
      eyebrow: "Works with your stack",
      title: "Plugs into the CRM and helpdesk you already run",
      body: "We connect AI agents and automation to the tools your team already uses: CRMs, helpdesks, phone lines and calendars. No rip and replace.",
    } as SectionHeading,
    cta: { label: "See our technology", href: "/technology" } as Cta,
    logos: [
      { name: "GoHighLevel", src: "/brand/logo-ghl.png" },
      { name: "Jobber", src: "/brand/logo-jobber.png" },
      { name: "HubSpot", src: "https://cdn.simpleicons.org/hubspot/ffffff" },
      { name: "Salesforce", src: "/brand/logo-salesforce.png" },
    ],
  },

  /** Full bleed brand-colour band, Quote01: the about statement. */
  quote: {
    text: "We run customer operations the way we build software: every step tracked, every call answered, and every claim something we can show you running.",
    author: "Growtk",
  },

  /** Bespoke icon-led strip, not a catalog component: three industries plus a link to the hub. */
  industries: {
    heading: {
      eyebrow: "Industries we serve",
      title: "Built for how your industry actually works",
      body: "A disputed charge, a late driver, a missing parcel, an outage, a booking, a stuck user: every industry has its own rush hours and hard cases. Every build starts from yours.",
    } as SectionHeading,
    items: industryPages.map((p) => ({ icon: p.icon, name: p.name, teaser: p.teaser, href: `/industries/${p.slug}` })) as IndustryCard[],
    cta: { label: "See all industries", href: "/industries" } as Cta,
  },

  /** Stacking solution cards: SolutionsStack. The four systems Growtk builds, same order and slugs as content/solutions.ts. */
  capabilities: {
    heading: {
      eyebrow: "Our solutions",
      title: "The systems behind every answer",
      body: "Every AI agent and every person on your team is only as good as the system behind them. We build these four around your channels, your CRM and your data, and keep them running if you want us to.",
    } as SectionHeading,
    counterOf: "of",
    items: [
      {
        icon: "BookOpen",
        meta: "Self service",
        name: "Knowledge base system",
        title: "Answers customers find before they ask",
        body: "A searchable help center for customers and one source of truth for your agents, written from your real tickets so the answers match the questions people actually ask.",
        bullets: ["Search that understands typos and plain phrasing", "The same answers power your AI agents", "Every failed search becomes the next article"],
        mock: "kb",
        tone: "yellow",
        cta: { label: "Explore knowledge base", href: "/solutions/knowledge-base-system" },
      },
      {
        icon: "LifeBuoy",
        meta: "Ticketing",
        name: "Helpdesk system",
        title: "One queue for every call, chat and email",
        body: "Every request becomes a ticket, routed by topic and priority, tracked against a response time, and closed without anything slipping through, whether an AI agent or a person picks it up.",
        bullets: ["Calls, chats, email and social in one place", "Routing and response targets you set", "AI drafts the reply, a person approves when it matters"],
        mock: "helpdesk",
        tone: "lilac",
        cta: { label: "Explore helpdesk", href: "/solutions/help-desk-software" },
      },
      {
        icon: "ClipboardCheck",
        meta: "Assurance",
        name: "Quality management system",
        title: "Every conversation scored, not one in fifty",
        body: "Every call and chat is reviewed against your own scorecard, the ones that need a coach are flagged, and trends show by agent, topic and channel, for AI agents and people alike.",
        bullets: ["Scorecards built around your standards", "Scoring on every conversation", "A coaching queue for the ones that need a human eye"],
        mock: "qa",
        tone: "peach",
        cta: { label: "Explore quality management", href: "/solutions/quality-management-system" },
      },
      {
        icon: "MessageSquareHeart",
        meta: "Voice of the customer",
        name: "Survey software",
        title: "Feedback at every touchpoint, turned into action",
        body: "Short surveys by text, email or chat at the right moment, after a call, a delivery or a visit, with low scores sent to a person the same day and results rolled up into decisions.",
        bullets: ["CSAT, NPS and custom surveys", "Sent after calls, chats, deliveries or visits", "Low scores alert a manager right away"],
        mock: "survey",
        tone: "yellow",
        cta: { label: "Explore survey software", href: "/solutions/survey-software" },
      },
    ] as StackItem[],
  },
  process: {
    heading: {
      eyebrow: "What we do",
      title: "Outsourcing that scales with your business",
      body: "From the first customer call to a qualified pipeline, our AI agents and specialists plug into your operation and deliver results without the overhead of building it in house.",
    } as SectionHeading,
    cta: { label: "See all services", href: "/services" } as Cta,
    items: [
      {
        title: "Inbound contact center",
        body: "Every call, chat and email answered fast and resolved right, day or night, with a person on hand for anything an AI should not handle.",
        href: "/services/inbound-contact-center",
        image: {
          src: "/brand/process-audit.webp",
          alt: "Soft yellow to peach gradient wash",
        },
      },
      {
        title: "Technical support",
        body: "Tier 1 troubleshooting from your knowledge base, clean handoffs to your engineers for the rest, and a backlog that stops growing.",
        href: "/services/technical-support",
        image: {
          src: "/brand/industry-5.webp",
          alt: "Soft neutral gradient wash",
        },
      },
      {
        title: "E-commerce customer support",
        body: "Order status, returns and pre-sale questions answered in seconds across chat, email and phone, so shoppers buy and come back.",
        href: "/services/ecommerce-customer-support",
        image: {
          src: "/brand/industry-6.webp",
          alt: "Warm to cool gradient wash",
        },
      },
      {
        title: "Lead generation",
        body: "Every inquiry captured, qualified and routed to the right rep in seconds, with follow-up that keeps going until the lead decides.",
        href: "/services/lead-generation",
        image: {
          src: "/brand/industry-7.webp",
          alt: "Warm sunset gradient wash",
        },
      },
    ] as Feature[],
  },

  /**
   * OutcomeSpotlight: what a real Growtk build does today, one project at a
   * time, attributed to the project, never to a person. Swap in real client
   * quotes as they come in.
   */
  testimonials: {
    heading: {
      eyebrow: "Outcomes",
      title: "What runs today for the businesses we built for",
      body: "No borrowed logos or made up numbers. These are systems we built that are working right now.",
    } as SectionHeading,
    items: [
      {
        name: "Ultra Modern Rails",
        role: "Lead generation and sales support",
        quote: "Every quote request now lands in GoHighLevel as a tracked lead, gets an email and a text within seconds, and goes to the next rep in line.",
        tags: ["GoHighLevel", "Shopify", "Slack", "Lead routing"],
        image: { src: "/ingested/umr/preview.jpg", alt: "The Ultra Modern Rails GoHighLevel pipeline, each stage starting its own workflow" },
        cta: { label: "See the project", href: "/work/umr" },
      },
      {
        name: "Yetti",
        role: "Inbound contact center",
        quote: "Guests ask on WhatsApp, Instagram or email, and the AI front desk checks availability, books the trip and takes the payment.",
        tags: ["AI front desk", "WhatsApp", "Instagram", "Payments"],
        image: { src: "/ingested/yetti/preview.jpg", alt: "The Yetti inbox answering a guest across WhatsApp, Instagram and email" },
        cta: { label: "See the project", href: "/work/yetti" },
      },
      {
        name: "Jerry's",
        role: "Back office automation",
        quote: "Every sale takes its recipe out of stock, and low stock, drawer counts and the day's sales reach the owner on WhatsApp.",
        tags: ["Point of sale", "Stock control", "WhatsApp alerts"],
        image: { src: "/ingested/jerrys/preview.jpg", alt: "The Jerry's POS checkout with the real menu: zinger burger, shawarma, fries and shakes" },
        cta: { label: "See the project", href: "/work/jerrys" },
      },
      {
        name: "Dentavanta",
        role: "Customer experience platform, pre-launch",
        quote: "A request from the clinic website becomes a lead on the board, gets an automated reply and books straight onto the calendar.",
        tags: ["Lead board", "Auto reply", "Online booking"],
        image: { src: "/ingested/dentavanta/preview.jpg", alt: "The Dentavanta leads board, from first inquiry to booked visit" },
        cta: { label: "See the project", href: "/work/dentavanta" },
      },
    ] as Outcome[],
  },
  statement: {
    eyebrow: "Why Growtk",
    title: "Scale without adding headcount",
    body: "With the right mix of AI agents, automation and people, you handle more calls, more leads and more back office work without growing the team at the same rate.",
    secondaryBody: "Every engagement starts with a free audit that answers three questions before anything is scoped or priced.",
    steps: [
      {
        icon: "visit",
        title: "Where your volume comes from",
        body: "We map every channel customers use to reach you, and how many calls, chats, emails and forms each one brings in.",
      },
      {
        icon: "leak",
        title: "Where customers wait or drop off",
        body: "We trace each request to the exact step where it waits too long, gets dropped or needs a person who is not there.",
      },
      {
        icon: "fix",
        title: "What to automate first",
        body: "You leave knowing which single change would free the most hours and save the most revenue, before any price is set.",
      },
    ] as StatementStep[],
    cta: { label: "Why Growtk", href: "/why-growtk" } as Cta,
    image: {
      src: "/brand/8.jpg",
      alt: "Warm abstract gradient of coral, amber and violet light streaks",
    } as Img,
  },

  /** FAQ, Faq03 (sticky heading, plain question list). */
  faq: {
    heading: {
      eyebrow: "Before you book",
      title: "What teams ask us first",
    } as SectionHeading,
    items: [
      {
        q: "Do you use real people, or only AI?",
        a: "Both. AI agents answer, qualify and resolve the routine work around the clock. Anything an AI should not handle goes to a person with the full conversation attached, on the escalation path you choose.",
      },
      {
        q: "Which channels can you cover?",
        a: "Phone, text, live chat, email, WhatsApp and social messages. Most teams start with the channel that carries the most volume and add the rest once it is running.",
      },
      {
        q: "Will it work with our CRM and helpdesk?",
        a: "Yes. We work inside the tools you already run, including GoHighLevel, HubSpot and Salesforce, and connect phone lines, calendars and payments to them. If you use something specific, ask us directly.",
      },
      {
        q: "How fast can we go live?",
        a: "A first channel is usually live in weeks, not months. The exact timeline is set on the free audit call and written into the proposal before any work starts.",
      },
      {
        q: "How do you keep customer data safe?",
        a: "Customer data stays in your own systems wherever possible, access is limited by role, and every automated action is logged. Our security page covers how we build.",
      },
    ] as FaqItem[],
    cta: { label: "Ask us anything", href: "/contact" } as Cta,
  },

  /** Closing CTA, Cta12 (full bleed photo, dark scrim). */
  cta: {
    heading: {
      eyebrow: "Free audit",
      title: "See where your customer operations are losing time and revenue",
      body: "Thirty minutes. We map your channels and volume and show you what we would automate first, no obligation.",
    },
    primary: { label: "Book your free audit", href: "/contact" } as Cta,
    image: {
      src: "https://images.unsplash.com/photo-1553877522-43269d4ea984?auto=format&fit=crop&w=1920&q=80",
      alt: "Two people working at laptops in a modern office, photographed in black and white",
    } as Img,
    footnote: "We reply to every inquiry within one business day.",
  },
} satisfies PageContent & Record<string, unknown>;

export default home;
