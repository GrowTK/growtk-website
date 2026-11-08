/**
 * About page copy. Growtk is a real, operating business that runs customer
 * operations AI first. No invented team size, founding year beyond May 2026,
 * or fabricated stats (client count, years in business, headcount).
 */
import type { PageContent, Cta, Img, SectionHeading, Feature } from "./types";

export const about = {
  meta: {
    title: "About Growtk",
    description:
      "Growtk runs customer operations AI first: contact center, support, lead generation and back office, built and run by engineers. Here is why we started it and how we work.",
    path: "/about",
  },

  hero: {
    eyebrow: "About Growtk",
    title: "The engineers behind customer operations that never clock out",
    body: "Most outsourcing scales by adding people to a floor. We started Growtk to scale it with AI agents and automation instead, built by engineers, run inside your own tools, with a person on every escalation.",
    ctas: [
      { label: "Work with us", href: "/contact", variant: "primary" },
      { label: "Meet the leadership", href: "/team", variant: "secondary" },
    ] as Cta[],
  },

  /** Three plain facts under the hero photo. All true today, nothing rounded up. */
  facts: [
    { value: "13", label: "Outsourcing services, delivered AI first" },
    { value: "4", label: "Systems we build: knowledge base, helpdesk, quality and surveys" },
    { value: "24/7", label: "AI agents answering, with a person on escalation" },
  ],

  heroImage: {
    src: "https://images.unsplash.com/photo-1670851050245-d861fd433d06?auto=format&fit=crop&w=1800&q=80",
    alt: "Two colleagues catching up in a bright studio hallway, one holding a laptop",
  } as Img,

  story: {
    heading: {
      eyebrow: "Our story",
      title: "Outsourcing was built for a world without AI agents",
      body: "Traditional outsourcing grows by hiring more people for more seats. That made sense when every call needed a person. It does not anymore.",
    } as SectionHeading,
    body: [
      "Businesses still lose customers to hold queues, unanswered email and leads nobody followed up. The usual fix is more headcount, in house or outsourced, and the cost grows with every new seat.",
      "We are software engineers. We started Growtk in May 2026 to run that same work with AI agents and automation instead: answering every call and chat, qualifying every lead and clearing the back office, inside the tools a business already runs.",
      "People still matter, so every engagement has a person on escalation and every build starts with a free audit and a written scope. We build the agents, the automations and the integrations ourselves, and keep improving them after launch.",
      "We would rather show you a system running than promise you one, which is why every case study on this site is something you can click through.",
    ],
    image: {
      src: "https://images.unsplash.com/photo-1517048676732-d65bc937f952?auto=format&fit=crop&w=1200&q=80",
      alt: "A small team around a wooden table, taking notes together in a working session",
    } as Img,
    caption: "Built engagement by engagement, with the team that runs the operation in the room.",
  },

  /** Where Growtk sits between the two options most teams get offered. */
  compare: {
    heading: {
      eyebrow: "The gap we fill",
      title: "Two options were on the table. Neither one scales well.",
      body: "Most teams we talk to have tried one of these. Here is how we are different, row by row.",
    } as SectionHeading,
    rows: ["How it scales", "Hours covered", "What runs behind it", "Who you talk to"],
    columns: [
      {
        name: "In house team",
        cells: [
          "Hire, train and manage every new person",
          "Business hours, with overtime for peaks",
          "Whatever tools you already bought",
          "Your own managers, stretched thin",
        ],
      },
      {
        name: "Traditional outsourcer",
        cells: [
          "More seats, billed by the hour",
          "Around the clock, at a premium",
          "Their tools, not yours",
          "An account manager",
        ],
      },
      {
        name: "Growtk",
        featured: true,
        cells: [
          "AI agents absorb the volume",
          "Around the clock, by default",
          "Automation built inside your own tools",
          "The engineers who build it",
        ],
      },
    ],
  },

  founders: {
    heading: {
      eyebrow: "Leadership",
      title: "The people on the call are the people writing the code",
    } as SectionHeading,
    link: { label: "Meet the leadership", href: "/team" } as Cta,
  },

  values: {
    heading: {
      eyebrow: "What we believe",
      title: "Four things every engagement gets held to",
    } as SectionHeading,
    lead: "None of this is aspirational. It is the standard every engagement ships against, not a slogan on a slide.",
    items: [
      {
        icon: "Bot",
        title: "AI for the volume, people for the judgment",
        body: "AI agents take the routine work around the clock. Anything that needs a person reaches one, with the whole conversation in front of them.",
      },
      {
        icon: "MessageSquareText",
        title: "Honest about scope and results",
        body: "A written scope before any work, plain answers about what AI can and cannot do yet, and no claims we cannot show you running.",
      },
      {
        icon: "Plug",
        title: "Built into what you already run",
        body: "We connect to your CRM, helpdesk, phone line and calendar instead of asking you to rip out software that works.",
      },
      {
        icon: "ShieldCheck",
        title: "Security by default",
        body: "Your data stays in your systems wherever possible, access is limited by role and every automated action is logged.",
      },
    ] as Feature[],
  },

  cta: {
    heading: {
      eyebrow: "Let's talk",
      title: "Let's write the next chapter of your operation together",
      body: "A free audit is the fastest way to find out what AI agents should take on first.",
    } as SectionHeading,
    primary: { label: "Book a free audit", href: "/contact" } as Cta,
    secondary: { label: "See our services", href: "/services" } as Cta,
  },
} satisfies PageContent & Record<string, unknown>;

export default about;
