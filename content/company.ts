/**
 * Company pages that follow the reference outsourcing site's Company menu:
 * Why Growtk, Security, Technology, Careers, and the Case studies hub.
 * Only claims Growtk can stand behind: no certifications, headcount, client
 * counts, years in business or satisfaction stats.
 *
 * Keep every string free of em dashes and en dashes.
 */
import type { Cta, Feature, FaqItem, SectionHeading, Step } from "./types";

const audit: Cta = { label: "Book a free audit", href: "/contact", variant: "primary" };

export const whyGrowtk = {
  meta: {
    title: "Why Growtk",
    description: "Why teams choose Growtk to run their customer operations: AI agents that work around the clock, engineers who build inside your tools, a written scope before any work, and a person on every escalation.",
  },
  hero: {
    eyebrow: "Why Growtk",
    title: "Outsourcing that answers to results, not seats",
    body: "Traditional outsourcing sells you seats and hours. We run your customer operations with AI agents and automation built by engineers, inside your own tools, with a person on every escalation and a written scope before anything starts.",
    ctas: [audit, { label: "See the proof", href: "/case-studies", variant: "secondary" }] as Cta[],
  },
  reasons: {
    heading: { eyebrow: "The difference", title: "Six reasons teams work with us", body: "What you get that a seat-based outsourcer cannot give you." } as SectionHeading,
    items: [
      { icon: "Clock", title: "Coverage around the clock", body: "AI agents answer at three in the morning the same way they answer at noon, on every channel you choose." },
      { icon: "Code2", title: "Engineers, not resellers", body: "We build the agents, automations and integrations ourselves, so nothing is a black box we cannot change." },
      { icon: "Plug", title: "Inside the tools you already run", body: "Your CRM, helpdesk, phone line and calendar stay yours. We connect to them instead of asking you to switch." },
      { icon: "Headset", title: "A person on every escalation", body: "Anything an AI should not handle goes to a person on the path you choose, with the whole conversation attached." },
      { icon: "FileCheck", title: "Scope in writing first", body: "A free audit, then a written proposal with scope, timeline and price, before any work starts." },
      { icon: "Eye", title: "Proof you can click through", body: "Every case study on this site is a working system you can open and use, not a slide." },
    ] as Feature[],
  },
  compare: {
    heading: { eyebrow: "In house, outsourced or AI first", title: "What changes when the work runs on AI agents" } as SectionHeading,
    items: [
      { icon: "Users", title: "Scale without hiring", body: "In house and seat-based teams grow by hiring. AI agents absorb more volume without a new recruit." },
      { icon: "Zap", title: "Speed to answer", body: "No hold queue: every contact is picked up in seconds, even during a spike." },
      { icon: "ClipboardCheck", title: "Quality on every conversation", body: "Every call and chat can be reviewed against your scorecard, not one in fifty." },
      { icon: "Workflow", title: "Process improvement built in", body: "We redesign the process as we automate it, so the work gets lighter over time." },
    ] as Feature[],
  },
  steps: {
    heading: { eyebrow: "Getting started", title: "From first call to live in four steps" } as SectionHeading,
    items: [
      { n: 1, title: "Free audit", body: "Thirty minutes to map your channels, volume and tools." },
      { n: 2, title: "Written proposal", body: "Scope, timeline and price, agreed before any work begins." },
      { n: 3, title: "First channel live", body: "We launch one channel, test it on real conversations and tune it." },
      { n: 4, title: "Scale with confidence", body: "Add channels and services once the first one runs clean." },
    ] as Step[],
  },
  faq: {
    heading: { eyebrow: "Questions", title: "What teams ask before they switch", body: "Plain answers about cost, quality and getting out if it does not work." } as SectionHeading,
    items: [
      { q: "How are you different from a cheaper offshore call center?", a: "We do not sell seats. AI agents do the routine work around the clock, people handle escalations, and engineers keep improving the system. You pay for outcomes and scope, not headcount." },
      { q: "Will quality drop after launch?", a: "We review conversations every week, score them against your standards and tune the agents. Quality is tracked, not assumed." },
      { q: "Can we start small?", a: "Yes. Most teams start with one channel or one service, and add more once it is working." },
      { q: "What if it does not work out?", a: "Everything is built inside your own tools and accounts, so you keep what we build and can walk away with it." },
    ] as FaqItem[],
    cta: { label: "Ask us anything", href: "/contact" } as Cta,
  },
  cta: { heading: { eyebrow: "Free audit", title: "See what AI-first operations would look like for you", body: "We map your channels and volume and show you what we would take on first." } as SectionHeading, primary: { label: "Book your free audit", href: "/contact" } as Cta },
};

export const security = {
  meta: {
    title: "Security",
    description: "How Growtk handles your data when it runs your customer operations: your data in your systems, least privilege access, logged automation, secrets kept out of code, and human review on sensitive actions.",
  },
  hero: {
    eyebrow: "Security",
    title: "Your customers' data, handled like our own reputation",
    body: "When AI agents talk to your customers and touch your systems, security is part of the build, not a page of badges. Here is how we work, in plain terms.",
    ctas: [{ label: "Ask about security", href: "/contact", variant: "primary" }] as Cta[],
  },
  controls: {
    heading: { eyebrow: "How we build", title: "Controls in every engagement", body: "The same practices on every build, whatever the size." } as SectionHeading,
    items: [
      { icon: "Database", title: "Your data stays in your systems", body: "Wherever possible, customer data lives in your own CRM, helpdesk and accounts, not copied into ours." },
      { icon: "KeyRound", title: "Least privilege access", body: "AI agents and automations get only the permissions they need, and nothing more. Access is reviewed as the work changes." },
      { icon: "ScrollText", title: "Every automated action logged", body: "What an agent or automation did, when, and why is recorded, so any action can be traced." },
      { icon: "Lock", title: "Secrets kept out of code", body: "Keys and tokens live in secure environment settings, never in code, and every commit is scanned for leaked secrets." },
      { icon: "UserCheck", title: "People approve sensitive actions", body: "Refunds, account changes and anything you mark sensitive can require a person to approve before it happens." },
      { icon: "ShieldAlert", title: "Supply chain checks", body: "Dependencies are scanned for malware, suspicious install scripts and risky code before anything ships." },
    ] as Feature[],
  },
  practice: {
    heading: { eyebrow: "Security as a practice", title: "Built to be checked, not just trusted" } as SectionHeading,
    items: [
      { icon: "FileSearch", title: "Open to your review", body: "We walk your team through how each build handles data, and share the details your security review needs." },
      { icon: "Scale", title: "Rules for regulated work", body: "For healthcare and other regulated businesses, we design around your obligations and your existing vendors. We do not claim certifications we do not hold." },
      { icon: "History", title: "Changes you can follow", body: "Every change to an agent, automation or integration is versioned, so you can see what changed and when." },
    ] as Feature[],
  },
  faq: {
    heading: { eyebrow: "Security questions", title: "What security teams ask us", body: "Straight answers for the people who review vendors. Ask us anything else directly." } as SectionHeading,
    items: [
      { q: "Where is our customer data stored?", a: "In your own systems wherever possible. Where a build needs its own storage, we tell you where it is and who can access it before it goes live." },
      { q: "Do you hold security certifications?", a: "Not at this stage, and we will not claim any we do not hold. We are happy to answer your security questionnaire and walk your team through every control." },
      { q: "How do you handle an incident?", a: "We contain it, tell you straight away with what we know, fix the cause and share a written summary of what happened and what changed." },
      { q: "Can AI agents see payment details?", a: "We design flows so agents never handle full card details. Payments go through your payment provider's secure pages." },
      { q: "Who can access our accounts?", a: "Only the people working on your build, with the minimum access needed, removed when the work ends." },
    ] as FaqItem[],
    cta: { label: "Ask about security", href: "/contact" } as Cta,
  },
  cta: { heading: { eyebrow: "Security review", title: "Bring us your security questions", body: "We will walk your team through how your build would handle data, before anything is signed." } as SectionHeading, primary: { label: "Talk to us", href: "/contact" } as Cta },
};

export const technology = {
  meta: {
    title: "Technology",
    description: "The technology behind Growtk's AI-first customer operations: voice and chat agents, workflow automation, CRM and helpdesk integrations, custom software and reporting, built by engineers rather than resold.",
  },
  hero: {
    eyebrow: "Technology",
    title: "Technology we build, not resell",
    body: "Every agent, automation and integration we run is built by our own engineers, on infrastructure we know end to end, so it can be shaped around your operation and changed when you need it to.",
    ctas: [
      { label: "Discuss your stack", href: "/contact", variant: "primary" },
      { label: "Explore our solutions", href: "/solutions", variant: "secondary" },
    ] as Cta[],
  },
  stack: {
    heading: { eyebrow: "The stack", title: "Capabilities behind every engagement", body: "The building blocks we combine for each client." } as SectionHeading,
    items: [
      { icon: "Mic", title: "Voice agents", body: "Inbound and outbound AI voice agents on real phone lines, with call transfer, recording and human escalation." },
      { icon: "MessageSquare", title: "Chat and messaging agents", body: "Website chat, WhatsApp, text and social messaging agents that answer, act and hand over." },
      { icon: "Workflow", title: "Workflow automation", body: "Automations that move data and trigger the next step across your tools, built with tools like n8n and custom code." },
      { icon: "Plug", title: "CRM and helpdesk integrations", body: "Connections to GoHighLevel, HubSpot, Salesforce and the other systems your team already runs." },
      { icon: "Code2", title: "Custom software", body: "When nothing off the shelf fits, we build it: CRMs, booking systems, point of sale and dashboards." },
      { icon: "BarChart3", title: "Reporting and analytics", body: "Volume, resolution, quality and revenue reported from your own data, every week." },
    ] as Feature[],
  },
  suite: { eyebrow: "Our solutions", title: "Four systems, one operation", body: "The systems we build into your operation, each connected to your AI agents." },
  build: {
    heading: { eyebrow: "Build versus buy", title: "When off the shelf falls short, we build" } as SectionHeading,
    items: [
      { icon: "BadgeCheck", title: "Proven in production", body: "The same engineering runs our own products and the client systems in our case studies." },
      { icon: "Wrench", title: "Owned by the people who run it", body: "The engineers who build your system are the ones who support it, so changes do not wait on a vendor." },
      { icon: "KeyRound", title: "Yours to keep", body: "Builds live in your accounts and tools, so you own what we make for you." },
    ] as Feature[],
  },
  cta: { heading: { eyebrow: "Talk to an engineer", title: "Bring us your stack questions", body: "Tell us what you run today and we will show you how the agents and automations would connect." } as SectionHeading, primary: { label: "Talk to an engineer", href: "/contact" } as Cta },
};

export const careers = {
  meta: {
    title: "Careers",
    description: "Work at Growtk: a small engineering team building AI agents, automation and custom software that run real businesses' customer operations.",
  },
  hero: {
    eyebrow: "Careers",
    title: "Build the systems businesses run on",
    body: "We are a small team of engineers building AI agents, automation and custom software that run real customer operations. If that sounds like your kind of work, we would like to hear from you.",
    ctas: [
      { label: "Get in touch", href: "/contact", variant: "primary" },
      { label: "About Growtk", href: "/about", variant: "secondary" },
    ] as Cta[],
  },
  life: {
    heading: { eyebrow: "Working at Growtk", title: "What the work is like" } as SectionHeading,
    items: [
      { icon: "Rocket", title: "Real products, in production", body: "What you build answers real customers and runs real businesses, not demos." },
      { icon: "Code2", title: "Engineers who ship end to end", body: "From database to voice agent to dashboard, you see your work through." },
      { icon: "Bot", title: "Hands on with AI", body: "Daily work with voice, chat and agentic AI, applied to problems that matter to a business." },
      { icon: "Users", title: "A small team, close to the founders", body: "Short feedback loops and direct access to the people making decisions." },
    ] as Feature[],
  },
  openings: {
    heading: { eyebrow: "Open roles", title: "No open roles right now", body: "We hire when the work calls for it. If you build with AI, automation or full stack web, send us a short note and a link to something you have made, and we will keep you in mind." } as SectionHeading,
    cta: { label: "Send us a note", href: "/contact" } as Cta,
  },
  steps: {
    heading: { eyebrow: "How hiring works", title: "Four steps, no surprises" } as SectionHeading,
    items: [
      { n: 1, title: "Introduce yourself", body: "A short note and a link to work you are proud of." },
      { n: 2, title: "A conversation", body: "A call about what you have built and what you want to build next." },
      { n: 3, title: "A practical task", body: "A small task close to the real work, agreed with you up front." },
      { n: 4, title: "Offer and onboarding", body: "A clear offer, then a first week working on a live project." },
    ] as Step[],
  },
  faq: {
    heading: { eyebrow: "Candidate questions", title: "What candidates ask us", body: "Straight answers for anyone thinking about working with us." } as SectionHeading,
    items: [
      { q: "Where is the team based?", a: "Growtk is based in Lahore, Pakistan, and works with clients remotely." },
      { q: "Do you hire remotely?", a: "It depends on the role. Tell us where you are when you get in touch." },
      { q: "What experience do you look for?", a: "Work you have shipped matters more than years on a CV. Show us something you built." },
      { q: "Do you take interns?", a: "Occasionally, when we have a project with room to mentor. Send a note and we will tell you honestly." },
    ] as FaqItem[],
  },
  cta: { heading: { eyebrow: "Say hello", title: "Show us something you built", body: "A short note and a link is all it takes to start a conversation." } as SectionHeading, primary: { label: "Get in touch", href: "/contact" } as Cta },
};

export const caseStudiesHub = {
  meta: {
    title: "Case studies",
    description: "Growtk case studies you can click through: AI front desks, CRM and lead automation, point of sale and back office automation, AI products and practice platforms, all real systems running today.",
  },
  hero: {
    eyebrow: "Case studies",
    title: "Outcomes you can click through",
    body: "Every case study here is a working system, not a slide deck. Open one and use it: the screens are working copies of the real product, running on demo data.",
    ctas: [{ label: "Get results like these", href: "/contact", variant: "primary" }] as Cta[],
  },
  grid: { eyebrow: "All case studies", title: "Built and running", body: "Client builds and our own products, each with the services behind it." } as SectionHeading,
  common: {
    heading: { eyebrow: "What they share", title: "The same approach behind every build" } as SectionHeading,
    items: [
      { icon: "Search", title: "Audit before anything is built", body: "Each one started by mapping how requests and work actually moved through the business." },
      { icon: "Plug", title: "Built into the tools already there", body: "Shopify, GoHighLevel, Slack, WhatsApp and more, connected rather than replaced." },
      { icon: "Bot", title: "AI and automation doing the routine work", body: "Leads answered, stock updated, bookings made and alerts sent without anyone copying data." },
      { icon: "Headset", title: "People where they count", body: "Reps, owners and staff step in for the decisions, with the context already in front of them." },
    ] as Feature[],
  },
  cta: { heading: { eyebrow: "Your turn", title: "Your operation could be the next case study", body: "Book a free audit and we will show you what we would build first." } as SectionHeading, primary: { label: "Book your free audit", href: "/contact" } as Cta },
};
