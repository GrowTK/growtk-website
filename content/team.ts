/**
 * Team page copy. Growtk is a team of software engineers led by its two
 * co-founders, who are engineers themselves and build the work in house, not
 * an agency reselling no-code tools. The page features the founders; never
 * describe the whole company as two people, and never state a headcount.
 * No invented client counts, years in business, employers, degrees,
 * or certifications. The in-house CRM is a long-term roadmap item, never a
 * current offering.
 */
import type { PageContent, Cta, Feature, SectionHeading, TeamMember } from "./types";

export const team = {
  meta: {
    title: "Team",
    description:
      "Meet the engineers behind Growtk, led by co-founders Muhammad Anique on automation and CRM integrations and Asad Ali on AI agents and voice systems.",
    path: "/team",
  },

  hero: {
    eyebrow: "The people behind Growtk",
    title: "Engineers who build it, no middlemen",
    body: "Growtk is a team of software engineers led by two co-founders who still write code every day. Every workflow, agent and integration is built in house, so the people on your call are the people who build it, with no account manager or outsourced handoff in between.",
    ctas: [
      { label: "Talk to us", href: "/contact", variant: "primary" },
      { label: "See our services", href: "/services", variant: "secondary" },
    ] as Cta[],
  },

  intro: {
    eyebrow: "How we split the work",
    title: "One builds the plumbing, the other builds the brain",
    body: "Every project needs both halves: the systems that move a lead from one tool to the next, and the agents that talk to your customers. Each co-founder leads one half, and the team builds across both."
  } as SectionHeading,

  /** The middle of the split diagram: what both founders share. */
  shared: {
    label: "Across the team",
    title: "Full-stack engineers first",
    items: ["Build and deploy on AWS", "Write every line in house", "Slowly building Growtk's own CRM"],
  },

  /** Labels on each founder's profile row. */
  profile: {
    builds: "What he builds",
  },

  promise: {
    heading: {
      eyebrow: "No middlemen",
      title: "What that actually means for you",
    } as SectionHeading,
    items: [
      {
        icon: "MessagesSquare",
        title: "You talk to the person writing the code",
        body: "No account manager translating your request into a ticket. The engineer on the call is the one who builds it.",
      },
      {
        icon: "CalendarCheck",
        title: "Timelines from the people who have to meet them",
        body: "Scope and dates come from the engineers doing the work, so they are based on the actual build, not a sales target.",
      },
      {
        icon: "Wrench",
        title: "Fixes go straight to whoever built it",
        body: "When something needs changing after launch, it goes to the engineer who already knows how it works.",
      },
    ] as Feature[],
  },

  team: [
    {
      name: "Muhammad Anique",
      role: "Founder, Automation Engineer",
      initials: "MA",
      bio: "Muhammad Anique is the founder of Growtk and builds the automation behind every client's business: workflows, CRM integrations and backend systems. He works directly on top of the CRMs clients already use, GoHighLevel, Jobber, ServiceTitan, HubSpot and Salesforce among them.\n\nA full-stack engineer, he also runs Growtk's AWS infrastructure, including the missed-call follow-up that catches a lead the moment a call goes unanswered.",
      skills: ["Workflow automation", "CRM integrations", "Backend systems", "AWS infrastructure"],
    },
    {
      name: "Asad Ali",
      role: "Co-founder, AI Specialist",
      initials: "AA",
      bio: "Asad Ali is a co-founder of Growtk and its AI specialist. He builds Power Agent, Growtk's chat widget, which holds a conversation, routes visitors to the right page or booking flow and sends inquiries on their behalf.\n\nHe also builds Growtk's voice agents: inbound and outbound calls wired into real-time booking, with human escalation for anything the agent should not handle alone.",
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
