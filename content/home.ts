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
import type { TabItem } from "@/components/sections/features/feature-05";

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
      eyebrow: "Built for the trades",
      title: "Built around how each trade actually wins and loses jobs",
      body: "A no-heat call, a storm-damage lead, a fence quote, a recurring clean: every one of them gets lost the same way, too slow to respond. Every build starts from the specific way your industry loses jobs, not a generic template with your logo swapped in.",
    } as SectionHeading,
    items: [
      {
        icon: "Wind",
        name: "HVAC",
        teaser: "A no-heat call at midnight will not wait for morning. It gets triaged, routed to whoever is on call, and booked before the homeowner tries the next number.",
        href: "/industries/hvac",
      },
      {
        icon: "Droplets",
        name: "Plumbing",
        teaser: "A burst pipe does not check the clock before it floods a kitchen. Every emergency call gets triaged and routed to whoever is on call, day or night.",
        href: "/industries/plumbing",
      },
      {
        icon: "Zap",
        name: "Electrical",
        teaser: "A tripped breaker is a safety call, not a maybe-later call. Estimate requests and urgent service calls get triaged and booked before a homeowner calls someone else first.",
        href: "/industries/electrical",
      },
      {
        icon: "HardHat",
        name: "Roofing",
        teaser: "After a storm, the first roofer to call back gets the job, not the nicest website. Every single storm lead gets an instant quote and a fast callback.",
        href: "/industries/roofing",
      },
      {
        icon: "Fence",
        name: "Railing",
        teaser: "A quote that takes a week to send gets three bids first. Homeowners get a visual estimate on the spot, and every bid gets followed up until decided.",
        href: "/industries/railing-fencing",
      },
      {
        icon: "Trees",
        name: "Landscaping",
        teaser: "A landscaping business loses money re-selling the same customer every spring. Recurring visits book and rebill themselves, so the calendar stays full without a phone call each season.",
        href: "/industries/landscaping",
      },
      {
        icon: "Bug",
        name: "Pest control",
        teaser: "A new infestation call goes to whoever answers first, and a treatment plan is lost the moment renewal slips through the cracks. Both now run on autopilot instead.",
        href: "/industries/pest-control",
      },
      {
        icon: "SprayCan",
        name: "Cleaning",
        teaser: "A cleaning business runs on repeat visits, not one-off jobs. Recurring bookings renew themselves automatically, and a review request goes out the moment a job is marked done.",
        href: "/industries/cleaning",
      },
      {
        icon: "HeartPulse",
        name: "Healthcare",
        teaser: "A front desk stuck on the phone booking all day has less time for the patient in front of them. Booking, reminders and no-show follow-up run quietly instead.",
        href: "/industries/healthcare",
      },
    ] as IndustryCard[],
    cta: { label: "See all industries", href: "/industries" } as Cta,
  },

  /** Tabbed solutions: Feature05. The four systems Growtk builds, same order and slugs as content/solutions.ts. */
  capabilities: {
    heading: {
      eyebrow: "Our solutions",
      title: "Four systems we build into your operation",
      body: "Off the shelf tools rarely fit how a team actually works. We build these four around your channels, your CRM and your data, and run them for you if you want us to.",
    } as SectionHeading,
    items: [
      {
        icon: "BookOpen",
        tab: "Knowledge base",
        title: "Answers customers find themselves, and agents find instantly",
        meta: "Self service",
        body: "A searchable help center for your customers and an internal knowledge base for your AI and human agents, written from your real tickets so the answers match the questions people actually ask.",
        image: {
          src: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=1200&q=80",
          alt: "Two people pointing at an article on a laptop screen",
        },
        bullets: [
          "Public help center with search",
          "The same answers power your AI agents",
          "Gaps flagged from questions it could not answer",
        ],
        cta: { label: "See knowledge base system", href: "/solutions/knowledge-base-system" },
      },
      {
        icon: "LifeBuoy",
        tab: "Helpdesk",
        title: "One queue for every call, chat, email and message",
        meta: "Ticketing",
        body: "Every request becomes a ticket, routed by topic and priority, tracked against a response time, and resolved without anything slipping through, whether an AI agent or a person picks it up.",
        image: {
          src: "https://images.unsplash.com/photo-1587560699334-cc4ff634909a?auto=format&fit=crop&w=1200&q=80",
          alt: "A laptop on an office desk next to a desk phone",
        },
        bullets: [
          "Calls, chats, email and social in one queue",
          "Routing and response targets by topic and priority",
          "AI drafts the reply, a person approves when it matters",
        ],
        cta: { label: "See helpdesk system", href: "/solutions/help-desk-software" },
      },
      {
        icon: "ClipboardCheck",
        tab: "Quality management",
        title: "Every conversation scored, not one in fifty",
        meta: "Assurance",
        body: "AI reviews every call and chat against your own scorecard, flags the conversations that need a coach, and shows trends by agent, topic and channel so quality stops being a guess.",
        image: {
          src: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1200&q=80",
          alt: "A laptop showing charts and metrics on an analytics dashboard",
        },
        bullets: [
          "Scorecards built around your standards",
          "AI scoring on every conversation",
          "A coaching queue for the ones that need a human eye",
        ],
        cta: { label: "See quality management system", href: "/solutions/quality-management-system" },
      },
      {
        icon: "MessageSquareHeart",
        tab: "Surveys",
        title: "Feedback at every touchpoint, turned into action",
        meta: "Voice of the customer",
        body: "CSAT, NPS and post-call surveys sent by text, email or chat at the right moment, with low scores routed to a person the same day and results rolled up into decisions.",
        image: {
          src: "https://images.unsplash.com/photo-1563986768609-322da13575f3?auto=format&fit=crop&w=1200&q=80",
          alt: "A person holding a phone with a chat open beside a laptop",
        },
        bullets: [
          "CSAT, NPS and custom surveys",
          "Sent after calls, chats, deliveries or visits",
          "Low scores alert a manager right away",
        ],
        cta: { label: "See survey software", href: "/solutions/survey-software" },
      },
    ] as TabItem[],
  },

  /** What we do, numbered cards: Feature07. Four featured services; all thirteen live on /services. */
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
   * Testimonial09, used for outcomes, not testimonials: each line states what
   * a real Growtk build does today, attributed to the project, not to a person.
   * Swap in real client quotes as they come in.
   */
  testimonials: {
    heading: {
      eyebrow: "Outcomes",
      title: "What runs today for the businesses we built for",
    } as SectionHeading,
    items: [
      {
        quote: "Every quote request now lands in GoHighLevel as a tracked lead, gets an email and a text within seconds, and goes to the next rep in line.",
        name: "Ultra Modern Rails",
        role: "Lead generation and sales support",
      },
      {
        quote: "Guests ask on WhatsApp, Instagram or email, and the AI front desk checks availability, books the trip and takes the payment.",
        name: "Yetti",
        role: "Inbound contact center",
      },
      {
        quote: "Every sale takes its recipe out of stock, and low stock, drawer counts and the day's sales reach the owner on WhatsApp.",
        name: "Jerry's",
        role: "Back office automation",
      },
      {
        quote: "A request from the clinic website becomes a lead on the board, gets an automated reply and books straight onto the calendar.",
        name: "Dentavanta",
        role: "Customer experience platform, pre-launch",
      },
    ] as Testimonial[],
  },

  /** Full screen image band, ImageStatement: why Growtk. */
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
