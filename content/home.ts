/**
 * Home page copy. Growtk redesigns websites and builds the automation behind
 * them (widgets, workflow automation, voice agents, integrations) for trade
 * and service businesses: roofing, railing and fencing, healthcare, and more
 * industries over time.
 *
 * Keep every string free of em dashes and en dashes.
 */
import type { PageContent, Cta, Img, SectionHeading, Stat, FaqItem, Testimonial, Feature } from "./types";
import type { TabItem } from "@/components/sections/features/feature-05";

export const home = {
  meta: {
    title: "Growtk: websites, widgets and automation for service businesses",
    description:
      "Growtk redesigns websites and builds custom widgets, workflow automation, voice agents and integrations for roofing, railing and fencing, healthcare and other service businesses.",
    path: "/",
  },

  hero: {
    eyebrow: "Websites, widgets and automation",
    title: "Stop losing jobs to a website that works slower than you do",
    body: "Growtk redesigns your website and builds the automation behind it: quote widgets, booking flows, follow-up sequences and voice agents, so leads stop going cold while you're on a roof, a job site, or with a patient.",
    ctas: [
      { label: "Get a free audit", href: "/contact", variant: "primary" },
      { label: "See what we build", href: "/services", variant: "secondary" },
    ] as Cta[],
    image: {
      src: "https://images.unsplash.com/photo-1621905253185-95614217f357?auto=format&fit=crop&w=1200&q=80",
      alt: "A contractor in a hard hat checking his phone on a job site",
    } as Img,
    stats: [
      { value: "5", label: "services under one roof: web, widgets, automation, voice, integrations" },
      { value: "3", label: "industries with a dedicated playbook: roofing, railing and fencing, healthcare" },
      { value: "1", label: "free audit call to scope exactly what you need" },
      { value: "24/7", label: "a voice agent can pick up the phone even after hours" },
    ] as Stat[],
  },

  /** Bespoke icon-led strip, not a catalog component: three industries plus a link to the hub. */
  industries: {
    heading: {
      eyebrow: "Built for the trades",
      title: "Made for roofing, railing and healthcare businesses, and growing",
      body: "Every build starts with how your industry actually wins and loses jobs, not a generic template with your logo swapped in.",
    } as SectionHeading,
    items: [
      {
        icon: "HardHat",
        name: "Roofing",
        teaser: "Instant quote widgets and storm-lead automation that responds before a competitor does.",
        href: "/industries/roofing",
      },
      {
        icon: "Fence",
        name: "Railing and fencing",
        teaser: "Visual quote requests and automated bid follow-up for custom install work.",
        href: "/industries/railing-fencing",
      },
      {
        icon: "HeartPulse",
        name: "Healthcare",
        teaser: "Booking widgets and reminder automation that keep a front desk off the phone.",
        href: "/industries/healthcare",
      },
    ],
    cta: { label: "See all industries", href: "/industries" } as Cta,
  },

  /** Tabbed capabilities: Feature05. Five services, same order and names as content/services.ts. */
  capabilities: {
    heading: {
      eyebrow: "What we build",
      title: "Five services, wired together, not five separate vendors",
      body: "Start with one and add the rest once you see it working, or bring us in for all five from day one.",
    } as SectionHeading,
    items: [
      {
        icon: "LayoutTemplate",
        tab: "Website redesign",
        title: "A site built to turn visits into calls, not just page views",
        meta: "Launch, from $3,500",
        body: "We replace outdated or DIY sites with a fast, mobile-first site built around the one thing that matters: turning a visitor into a quote request or a booked job.",
        image: {
          src: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=1200&q=80",
          alt: "A laptop on a desk showing code beside a second monitor displaying a website",
        },
        bullets: [
          "Built and launched in weeks, not months",
          "Mobile-first, fast enough to keep a job-site visitor from bouncing",
          "Written and structured to actually rank for your services and area",
        ],
        cta: { label: "See website redesign", href: "/services#website-redesign" },
      },
      {
        icon: "Blocks",
        tab: "Custom widgets",
        title: "Tools built for your business, not a generic plugin",
        meta: "Included in every build",
        body: "Instant quote calculators, booking widgets, live chat and review displays, built for exactly how your business quotes and books work, not squeezed into a generic plugin.",
        image: {
          src: "https://images.unsplash.com/photo-1554672408-730436b60dde?auto=format&fit=crop&w=1200&q=80",
          alt: "A hand holding a phone showing a booking confirmation screen",
        },
        bullets: [
          "Instant quote or estimate calculators",
          "Booking and scheduling widgets",
          "Live chat and review display widgets",
        ],
        cta: { label: "See custom widgets", href: "/services#widgets" },
      },
      {
        icon: "Workflow",
        tab: "Workflow automation",
        title: "The busywork between a lead and a booked job, automated",
        meta: "Automate, from $1,200/mo",
        body: "We build automations, using workflow tooling like n8n, that connect the tools you already run: lead routing, follow-up sequences, scheduling, invoicing and review requests, so nothing falls through the cracks.",
        image: {
          src: "https://images.unsplash.com/photo-1591381287254-b3349c60bf9b?auto=format&fit=crop&w=1200&q=80",
          alt: "A laptop screen showing a node-based workflow automation diagram",
        },
        bullets: [
          "Lead routing and instant follow-up",
          "Scheduling, invoicing and review requests on autopilot",
          "Built to fit the tools you already use, not replace them",
        ],
        cta: { label: "See workflow automation", href: "/services#automation" },
      },
      {
        icon: "Mic",
        tab: "Voice agents",
        title: "A voice on the phone that never misses a call",
        meta: "Automate, from $1,200/mo",
        body: "AI voice agents that answer calls, book jobs, qualify leads and run follow-up calls, so repetitive phone work stops eating a business owner's day, even after hours.",
        image: {
          src: "https://images.unsplash.com/photo-1553775282-20af80779df7?auto=format&fit=crop&w=1200&q=80",
          alt: "A headset with a microphone resting on a desk beside a laptop",
        },
        bullets: [
          "Answers and books jobs after hours and on weekends",
          "Qualifies leads before they reach your team",
          "Runs follow-up calls your team doesn't have time for",
        ],
        cta: { label: "See voice agents", href: "/services#voice-agents" },
      },
      {
        icon: "Plug",
        tab: "Integrations",
        title: "Connected to almost any tool you already run",
        meta: "Included in every build",
        body: "CRMs, payments, scheduling, comms and lead ads, wired together so information moves on its own instead of getting copied between tabs by hand.",
        image: {
          src: "https://images.unsplash.com/photo-1667264501379-c1537934c7ab?auto=format&fit=crop&w=1200&q=80",
          alt: "Four charging cable connectors bundled together against a blue background",
        },
        bullets: [
          "CRMs like Jobber, ServiceTitan and HubSpot",
          "Payments, scheduling and calendar tools",
          "Forms, lead ads and comms platforms",
        ],
        cta: { label: "See integrations", href: "/services#integrations" },
      },
    ] as TabItem[],
  },

  /** How we work, numbered cards: Feature07. */
  process: {
    heading: {
      eyebrow: "How we work",
      title: "From audit call to live automation",
      body: "The same four steps whether it's a website, a voice agent, or all five services together.",
    } as SectionHeading,
    cta: { label: "Book a free audit call", href: "/contact" } as Cta,
    items: [
      {
        title: "Audit",
        body: "A free call to map out where your site and back office are actually costing you jobs and hours.",
      },
      {
        title: "Scope",
        body: "A clear, written plan: what gets built, what it connects to, and what it costs, before anything starts.",
      },
      {
        title: "Build and launch",
        body: "Your site, widgets, automations or voice agent, built and launched in weeks, not months.",
      },
      {
        title: "Optimize",
        body: "We keep tuning what's live: more automation, better conversion, fewer manual steps, as your business grows.",
      },
    ] as Feature[],
  },

  /**
   * Testimonial09. Illustrative copy: no specific company is named or
   * misrepresented as a verified client. Swap for real quotes as they come in.
   */
  testimonials: {
    heading: {
      eyebrow: "What business owners say",
      title: "The kind of thing we hear back after launch",
    } as SectionHeading,
    items: [
      {
        quote: "Our new site paid for itself in the first month just from quote requests that used to go to voicemail.",
        name: "Owner",
        role: "Roofing contractor",
      },
      {
        quote: "The voice agent books more inspections after hours than our front desk ever did during the day.",
        name: "Office manager",
        role: "Railing and fencing company",
      },
      {
        quote: "Patients stopped playing phone tag with us for reminders. The automation just handles it now.",
        name: "Practice manager",
        role: "Healthcare front office",
      },
      {
        quote: "They didn't just build a site, they wired it into everything we already use.",
        name: "Owner",
        role: "Home services business",
      },
    ] as Testimonial[],
  },

  /** FAQ, Faq03 (sticky heading, plain question list). */
  faq: {
    heading: {
      eyebrow: "Before you book",
      title: "What business owners ask us first",
    } as SectionHeading,
    items: [
      {
        q: "How long does a new website take?",
        a: "Most Launch projects go from kickoff to live in three to six weeks depending on scope. You get an exact timeline after the free audit call, not a guess.",
      },
      {
        q: "Do you work with businesses outside roofing, railing and healthcare?",
        a: "Those are the three industries we've built a dedicated playbook for so far, but the same website, widget and automation work applies to most local service businesses. Tell us about yours on the audit call.",
      },
      {
        q: "What tools do you integrate with?",
        a: "Most CRMs, scheduling tools, payment processors and lead ad platforms a service business already runs, including tools like Jobber, ServiceTitan, HubSpot, Stripe and Google Calendar. If you use something specific, ask us directly.",
      },
      {
        q: "Can a voice agent actually book a real job?",
        a: "Yes. It can qualify a caller, check availability against your real calendar, and book the job or hand it off, then a real person picks up from there.",
      },
      {
        q: "Do I have to buy everything at once?",
        a: "No. Most businesses start with Launch or Automate and add the rest once they see it working.",
      },
    ] as FaqItem[],
    cta: { label: "Ask us anything", href: "/contact" } as Cta,
  },

  /** Closing CTA, Cta12 (full bleed photo, dark scrim). */
  cta: {
    heading: {
      eyebrow: "Free audit call",
      title: "See exactly where your site and back office are costing you jobs",
      body: "Thirty minutes. We will show you what we would build first and what it costs, no obligation.",
    } as SectionHeading,
    primary: { label: "Book your free audit call", href: "/contact" } as Cta,
    image: {
      src: "https://images.unsplash.com/photo-1553877522-43269d4ea984?auto=format&fit=crop&w=1920&q=80",
      alt: "Two people working at laptops in a modern office, photographed in black and white",
    } as Img,
    footnote: "We reply to every inquiry within one business day.",
  },
} satisfies PageContent & Record<string, unknown>;

export default home;
