/**
 * Team page copy. Growtk is a two-person studio: both founders are software
 * engineers who build the work themselves, not an agency reselling no-code
 * tools. No invented client counts, years in business, employers, degrees,
 * or certifications. The in-house CRM is a long-term roadmap item, never a
 * current offering.
 */
import type { PageContent, Cta, SectionHeading, TeamMember } from "./types";

export const team = {
  meta: {
    title: "Team",
    description:
      "Meet the two software engineers behind Growtk: Muhammad Anique on automation and CRM integrations, Affan Zahir on AI agents and voice systems.",
    path: "/team",
  },

  hero: {
    eyebrow: "The people behind Growtk",
    title: "Two engineers, no middlemen",
    body: "Growtk is run by two software engineers who build every workflow, agent and integration themselves. When a client hires Growtk, these are the two people who actually write the code.",
    ctas: [
      { label: "Talk to us", href: "/contact", variant: "primary" },
      { label: "See our services", href: "/services", variant: "secondary" },
    ] as Cta[],
  },

  intro: {
    eyebrow: "How we split the work",
    title: "One builds the plumbing, the other builds the brain",
  } as SectionHeading,

  team: [
    {
      name: "Muhammad Anique",
      role: "Co-founder, Automation Engineer",
      initials: "MA",
      bio: "Muhammad Anique is a co-founder of Growtk and its automation engineer: the workflows, CRM integrations and backend systems that keep a client's business running behind the site. He builds directly on top of the CRMs clients already use, GoHighLevel, Jobber, ServiceTitan, HubSpot and Salesforce among them, wiring sheets, docs, alerts and SMS follow-up into one pipeline instead of leaving an owner to stitch tools together by hand.\n\nAs a full-stack software engineer, he also builds and deploys Growtk's cloud infrastructure on AWS, the same backbone that runs the automation he ships for clients. That includes the missed-call and follow-up systems that catch a lead the moment a call goes unanswered.\n\nHe is also one of the two engineers slowly building Growtk's own CRM product, a long-term project still in progress and not something Growtk sells today.",
      skills: ["Workflow automation", "CRM integrations", "Backend systems", "AWS infrastructure"],
    },
    {
      name: "Affan Zahir",
      role: "Co-founder, AI Specialist",
      initials: "AZ",
      bio: "Affan Zahir is a co-founder of Growtk and its AI specialist: the agents, voice systems and chat widgets that let a client's site handle a conversation on its own. He builds Power Agent, Growtk's chat widget, which can hold a conversation with images and video, redirect a visitor to the right page or booking flow, send an email inquiry on the visitor's behalf, report live job status and generate a QR code for a quote or a warranty.\n\nHe also builds Growtk's voice agents: inbound and outbound calls wired into a real-time booking workflow, with human escalation and call forwarding built in for anything the agent should not handle alone.\n\nLike Anique, he is a full-stack software engineer first, comfortable building and deploying on AWS, and one of the two engineers working, slowly and separately from client work, toward Growtk's own CRM product.",
      skills: ["AI agents", "Voice agents", "Chat widgets", "AWS infrastructure"],
    },
  ] as TeamMember[],

  cta: {
    heading: {
      eyebrow: "Let's talk",
      title: "Talk to the engineers who'll actually build it",
      body: "No account manager standing between you and the people writing the code. Book a free audit call with Growtk and start there.",
    } as SectionHeading,
    primary: { label: "Talk to us", href: "/contact" } as Cta,
    secondary: { label: "See our services", href: "/services" } as Cta,
  },
} satisfies PageContent & Record<string, unknown>;

export default team;
