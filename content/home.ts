/**
 * Home page copy. Growtk redesigns websites and builds SEO, custom widgets,
 * workflow automation, voice agents and integrations for trade and service
 * businesses: HVAC, plumbing, electrical, roofing, railing and fencing,
 * landscaping, pest control, cleaning and healthcare, with more industries
 * added over time.
 *
 * Keep every string free of em dashes and en dashes.
 */
import type { PageContent, Cta, Img, SectionHeading, Stat, FaqItem, Testimonial, Feature } from "./types";

type IndustryCard = { icon: string; name: string; teaser: string; href: string; image: Img };
import type { TabItem } from "@/components/sections/features/feature-05";

export const home = {
  meta: {
    title: "Growtk: websites, SEO, widgets and automation for service businesses",
    description:
      "Growtk builds websites, SEO, custom widgets, automation and voice agents for HVAC, plumbing, electrical, roofing, fencing, landscaping, pest control, cleaning and healthcare businesses.",
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
    video: {
      src: "/brand/hero.mp4",
      poster: "/brand/hero-poster.jpg",
    },
    stats: [
      { value: "6", label: "services under one roof: web, SEO, widgets, automation, voice, integrations" },
      { value: "9", label: "industries with a dedicated playbook, and growing" },
      { value: "1", label: "free audit call to scope exactly what you need" },
      { value: "24/7", label: "a voice agent can pick up the phone even after hours" },
    ] as Stat[],
  },

  /** Centered about copy with four parallax corner photos. */
  about: {
    eyebrow: "About us",
    title: "Built by people who\nanswer the phone.",
    body: "Growtk is a small team that builds the website and the automation behind it together, so a redesign is never just a new coat of paint on the same slow lead flow. We ship what we would want running our own trade business.",
    ctas: [
      { label: "Get a free audit", href: "/contact", variant: "primary" },
      { label: "About us", href: "/about", variant: "secondary" },
    ] as Cta[],
    photos: [
      {
        src: "https://images.unsplash.com/photo-1621905253185-95614217f357?auto=format&fit=crop&w=500&q=70",
        alt: "A contractor in a hard hat checking his phone on a job site",
        position: "left-[8%] top-[12%] w-44 lg:w-56",
        rotate: "-rotate-6",
        speed: 0.7,
      },
      {
        src: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=500&q=70",
        alt: "A laptop on a desk showing code beside a second monitor displaying a website",
        position: "right-[7%] top-[12%] w-44 lg:w-60",
        rotate: "rotate-6",
        speed: 1.2,
      },
      {
        src: "https://images.unsplash.com/photo-1554672408-730436b60dde?auto=format&fit=crop&w=500&q=70",
        alt: "A hand holding a phone showing a booking confirmation screen",
        position: "left-[12%] bottom-[13%] w-40 lg:w-52",
        rotate: "rotate-3",
        speed: 1,
      },
      {
        src: "https://images.unsplash.com/photo-1591381287254-b3349c60bf9b?auto=format&fit=crop&w=500&q=70",
        alt: "A laptop screen showing a node-based workflow automation diagram",
        position: "right-[9%] bottom-[9%] w-40 lg:w-52",
        rotate: "-rotate-4",
        speed: 0.85,
      },
    ],
  },

  /** Heading plus a single centered voice demo blob. */
  voice: {
    heading: {
      eyebrow: "Day to day",
      title: "Hear a voice agent in action",
      body: "This is the same voice agent service we build into a live phone line: it answers, qualifies and books.",
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
      title: "Plugs into the CRM you already run",
      body: "No rip and replace. We wire the new automation into the tools you already use instead of asking you to switch.",
    } as SectionHeading,
    cta: { label: "See all integrations", href: "/services#integrations" } as Cta,
    logos: [
      { name: "GoHighLevel", src: "/brand/logo-ghl.png" },
      { name: "Jobber", src: "/brand/logo-jobber.png" },
      { name: "HubSpot", src: "https://cdn.simpleicons.org/hubspot/ffffff" },
      { name: "Salesforce", src: "/brand/logo-salesforce.png" },
    ],
  },

  /** Plain icon-list capability grid, Feature06. */
  capabilitiesGrid: {
    heading: {
      eyebrow: "Why it works",
      title: "Everything a slow website is costing you, fixed",
    } as SectionHeading,
    items: [
      { icon: "Zap", title: "Launched in weeks, not months", body: "A scoped build with a real deadline, not an open-ended project that drags on." },
      { icon: "Smartphone", title: "Mobile-first, built to convert", body: "Fast enough to hold a job-site visitor's attention long enough to request a quote." },
      { icon: "Workflow", title: "Automation wired into what you use", body: "Lead routing, follow-up and scheduling connected to your existing CRM and calendar." },
      { icon: "Mic", title: "A voice agent that never misses a call", body: "Answers, qualifies and books jobs after hours, when the phone would otherwise go to voicemail." },
      { icon: "Plug", title: "Connected, not another silo", body: "Built to fit the tools you already run, from Jobber and ServiceTitan to Stripe and Google Calendar." },
      { icon: "Users", title: "Built and supported by the same people", body: "The person who built it is the person who answers when something needs to change." },
    ] as Feature[],
  },

  /** Full bleed brand-colour band, Quote01. */
  quote: {
    text: "Every claim on this site is something we can show you running, not just tell you about.",
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
        teaser: "A no-heat call at midnight in January will not wait for morning. It gets triaged, routed to whoever is on call, and booked before the homeowner tries the next number on Google.",
        href: "/industries/hvac",
        image: {
          src: "https://images.unsplash.com/photo-1700124113583-81aa99ea2aa2?auto=format&fit=crop&w=800&q=75",
          alt: "A modern heat pump and air conditioning unit mounted on the exterior wall of a house",
        },
      },
      {
        icon: "Droplets",
        name: "Plumbing",
        teaser: "A burst pipe does not check the clock before it floods a kitchen. Every emergency call gets triaged and routed to whoever is on call, day or night, instead of ringing out to voicemail.",
        href: "/industries/plumbing",
        image: {
          src: "https://images.unsplash.com/photo-1600566752355-35792bedcfea?auto=format&fit=crop&w=800&q=75",
          alt: "A modern bathroom with a freestanding tub, shower and plumbing fixtures",
        },
      },
      {
        icon: "Zap",
        name: "Electrical",
        teaser: "A flickering panel or a tripped breaker is a safety call, not a maybe-later call. Estimate requests and urgent service calls get triaged and booked before a homeowner calls someone else first.",
        href: "/industries/electrical",
        image: {
          src: "https://images.unsplash.com/photo-1621905251189-08b45d6a269e?auto=format&fit=crop&w=800&q=75",
          alt: "An electrician in a yellow hard hat installing wiring on an exterior panel",
        },
      },
      {
        icon: "HardHat",
        name: "Roofing",
        teaser: "After a storm, the first roofer to call back gets the job, not the one with the nicest site. Every storm-damage lead gets an instant quote and a callback within minutes.",
        href: "/industries/roofing",
        image: {
          src: "https://images.unsplash.com/photo-1632759145351-1d592919f522?auto=format&fit=crop&w=800&q=75",
          alt: "A roofer standing on a residential roof mid job",
        },
      },
      {
        icon: "Fence",
        name: "Railing and fencing",
        teaser: "A fence quote that takes a week to send is a quote that gets three other bids first. Homeowners get a visual estimate on the spot, and every bid gets followed up until it is won or lost.",
        href: "/industries/railing-fencing",
        image: {
          src: "https://images.unsplash.com/photo-1604015641586-6fa03629f976?auto=format&fit=crop&w=800&q=75",
          alt: "A wooden fence running along a property line under a clear sky",
        },
      },
      {
        icon: "Trees",
        name: "Landscaping",
        teaser: "A landscaping business loses money re-selling the same customer every spring. Recurring visits book and rebill themselves, so the calendar stays full without a phone call every season.",
        href: "/industries/landscaping",
        image: {
          src: "https://images.unsplash.com/photo-1558904541-efa843a96f01?auto=format&fit=crop&w=800&q=75",
          alt: "A close-up of a freshly maintained green lawn in front of modern buildings",
        },
      },
      {
        icon: "Bug",
        name: "Pest control",
        teaser: "A new infestation call is won by whoever answers first, and a recurring treatment plan is lost the moment renewal falls through the cracks. Both run on autopilot instead of a sticky note.",
        href: "/industries/pest-control",
        image: {
          src: "https://images.unsplash.com/photo-1598228723793-52759bba239c?auto=format&fit=crop&w=800&q=75",
          alt: "A suburban house exterior with a well-kept lawn and landscaping",
        },
      },
      {
        icon: "SprayCan",
        name: "Cleaning",
        teaser: "A cleaning business runs on repeat visits, not one-off jobs. Recurring bookings renew themselves, and a review request goes out the moment a job is marked done, no front desk required.",
        href: "/industries/cleaning",
        image: {
          src: "https://images.unsplash.com/photo-1580256081112-e49377338b7f?auto=format&fit=crop&w=800&q=75",
          alt: "A cleaning cart with supplies parked in a hotel hallway",
        },
      },
      {
        icon: "HeartPulse",
        name: "Healthcare",
        teaser: "A front desk on the phone all day booking and rescheduling has less time for the patient standing in front of them. Booking, reminders and no-show follow-up run in the background instead.",
        href: "/industries/healthcare",
        image: {
          src: "https://images.unsplash.com/photo-1637711805966-c5181f89ddb6?auto=format&fit=crop&w=800&q=75",
          alt: "A clean, modern reception desk in a healthcare practice lobby",
        },
      },
    ] as IndustryCard[],
    cta: { label: "See all industries", href: "/industries" } as Cta,
  },

  /** Tabbed capabilities: Feature05. Six services, same order and names as content/services.ts. */
  capabilities: {
    heading: {
      eyebrow: "What we build",
      title: "Six services, wired together, not six separate vendors",
      body: "Start with one and add the rest once you see it working, or bring us in for all six from day one.",
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
        icon: "TrendingUp",
        tab: "SEO and content",
        title: "Get found, then convert once you are",
        meta: "Included in every build",
        body: "Technical SEO, local SEO and content written to rank for your services and service area, all connected to a widget or voice agent so the traffic it earns actually turns into a call.",
        image: {
          src: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=1200&q=80",
          alt: "A laptop on a dark desk displaying a traffic and analytics dashboard",
        },
        bullets: [
          "Technical SEO: fast Core Web Vitals, structured data, clean sitemaps",
          "Local SEO: Google Business Profile and service-area pages",
          "Content written to rank, not filler",
        ],
        cta: { label: "See SEO and content", href: "/services#seo" },
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
      body: "The same four steps whether it's a website, a voice agent, or all six services together.",
    } as SectionHeading,
    cta: { label: "Book a free audit call", href: "/contact" } as Cta,
    items: [
      {
        title: "Audit",
        body: "A free call to map out where your site and back office are actually costing you jobs and hours.",
        image: {
          src: "/brand/industry-4.webp",
          alt: "Soft violet gradient wash",
        },
      },
      {
        title: "Scope",
        body: "A clear, written plan: what gets built, what it connects to, and what it costs, before anything starts.",
        image: {
          src: "/brand/industry-5.webp",
          alt: "Soft neutral gradient wash",
        },
      },
      {
        title: "Build and launch",
        body: "Your site, widgets, automations or voice agent, built and launched in weeks, not months.",
        image: {
          src: "/brand/industry-6.webp",
          alt: "Warm to cool gradient wash",
        },
      },
      {
        title: "Optimize",
        body: "We keep tuning what's live: more automation, better conversion, fewer manual steps, as your business grows.",
        image: {
          src: "/brand/industry-7.webp",
          alt: "Warm sunset gradient wash",
        },
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
        name: "Roofing owner",
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
        name: "Business owner",
        role: "Home services business",
      },
    ] as Testimonial[],
  },

  /** Full screen image band between testimonials and the FAQ, ImageStatement. */
  statement: {
    eyebrow: "How we build",
    title: "Every build starts with your business, not our template",
    body: "We map how your leads actually move, by phone, by form, by walk-in, before we touch a single page, so what launches fits the way you already win jobs.",
    secondaryBody: "That mapping happens on the free audit call, before anything is scoped or priced: what a visitor actually does on your current site, where a call or a form goes cold, and which single fix would move the needle first.",
    cta: { label: "See how we work", href: "/services" } as Cta,
    image: {
      src: "/brand/8.jpg",
      alt: "Warm abstract gradient of coral, amber and violet light streaks",
    } as Img,
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
        q: "Do you work with businesses outside these nine industries?",
        a: "Those are the industries we've built a dedicated playbook for so far, but the same website, SEO, widget and automation work applies to most local service businesses. Tell us about yours on the audit call.",
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
