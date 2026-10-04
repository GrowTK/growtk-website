/**
 * Code cleanup and audit service page. A distinct offer from Growtk's trade
 * business services: aimed at software founders and small teams who built a
 * first version with an AI tool (v0, Lovable, Cursor, Bolt, Replit, or plain
 * ChatGPT prompting) and hit a wall the AI tool cannot get them past. New
 * offering, no client history to reference yet.
 */
import type { PageContent, Cta, Img, SectionHeading, Feature, FaqItem } from "./types";

export const codeCleanup = {
  meta: {
    title: "Code cleanup, audit and rebuild for AI-built apps",
    description:
      "Growtk audits and stabilizes codebases that were vibe coded with AI tools like v0, Lovable, Cursor, Bolt or ChatGPT: security, accessibility, data handling, performance and code quality, then hands over something a real engineer can maintain.",
    path: "/code-cleanup",
  },

  hero: {
    eyebrow: "For software founders and small teams",
    title: "Your app got you this far. Now it needs an engineer, not another prompt",
    body: "A lot of first versions get vibe coded into existence fast, and then stall: a feature that half works, a security hole nobody noticed, no tests, and a codebase nobody on the team can confidently explain anymore. Growtk is a team of software engineers who read the code, tell you exactly what shape it is in, and either stabilize what is there or rebuild the parts that need it, properly this time.",
    ctas: [{ label: "Get a code audit", href: "/contact", variant: "primary" }] as Cta[],
  },

  build: {
    heading: {
      eyebrow: "What Growtk actually checks",
      title: "One audit, five things that quietly break AI-built apps",
      body: "Before any code changes, we read all of it. The audit covers the same ground a senior engineer would cover on day one of a new job, applied to the app you already shipped.",
    } as SectionHeading,
    features: [
      {
        icon: "SearchCode",
        title: "A full read-through, not a linter run",
        body: "Our engineers go through the actual codebase end to end: what it does, how the pieces fit together, and where the logic quietly does not match what the product is supposed to do.",
      },
      {
        icon: "ShieldAlert",
        title: "Security holes AI tools do not warn you about",
        body: "Exposed API keys, missing auth checks on routes that assume nobody would ever try them, unvalidated input, secrets committed to the repository. Common in apps assembled quickly, rare in an app a client can safely ship.",
      },
      {
        icon: "Accessibility",
        title: "Accessibility and data handling",
        body: "Forms and flows checked against real accessibility basics, plus how user data actually moves and gets stored, the kind of gap that fails a compliance or security review even when the app looks finished.",
      },
      {
        icon: "Gauge",
        title: "Performance and code quality",
        body: "Slow queries, bloated bundles, duplicated logic scattered across files, and the general debt that makes every new feature take longer than the last one to ship safely.",
      },
      {
        icon: "Wrench",
        title: "Stabilize what works, rebuild what does not",
        body: "We fix and harden the parts of the app that are fundamentally sound, and rebuild the parts that are not, so you are not paying to patch something that was never going to hold up.",
      },
    ] as Feature[],
  },

  faq: {
    heading: {
      eyebrow: "Questions founders ask",
      title: "What the code audit actually involves",
    } as SectionHeading,
    items: [
      {
        q: "We built this with v0 or Lovable or Cursor. Is that the problem?",
        a: "Not by itself. Those tools are genuinely good at getting a first version out fast. The problem shows up later: nobody on the team fully understands what was generated, and there was no engineer checking security, data handling or edge cases along the way. A proper audit closes that gap, not the tool you used to get here.",
      },
      {
        q: "What does the audit actually produce?",
        a: "A plain-language report of what we found, organized by security, accessibility, data handling, performance and code quality, with each issue marked by how serious it is and what it would take to fix. You get that report before any rebuild work starts, so you decide what happens next.",
      },
      {
        q: "Do you rebuild the whole app or just fix what is broken?",
        a: "Whatever the audit actually shows. Some codebases need a handful of targeted fixes and better tests. Others have a core piece that was never built correctly and is cheaper to rebuild than to keep patching. We tell you which one you are dealing with instead of defaulting to a full rewrite.",
      },
      {
        q: "We failed a security or compliance review. Can Growtk fix that specifically?",
        a: "Yes, that is one of the most common reasons a founder calls us. We work from the reviewer's findings, fix the underlying issues rather than just the symptoms flagged, and leave you with a codebase that can pass the next review too.",
      },
      {
        q: "What do we actually get at the end of this?",
        a: "A codebase with the dangerous parts fixed, real tests where there were none, and documentation an engineer joining the project can actually read. You get it back in a state your own team, or your next hire, can keep building on without guessing.",
      },
    ] as FaqItem[],
    cta: { label: "Get a code audit", href: "/contact" } as Cta,
  },

  cta: {
    heading: {
      eyebrow: "Built by engineers, not another AI tool",
      title: "Find out what is actually in your codebase",
      body: "Book a call and Growtk will walk through what a full audit would cover for your app, and what stabilizing or rebuilding it would realistically take.",
    } as SectionHeading,
    primary: { label: "Get a code audit", href: "/contact" } as Cta,
    image: {
      src: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=1920&q=80",
      alt: "A close-up of a laptop screen showing lines of colorful code in a dark-themed editor",
    } as Img,
  },
} satisfies PageContent & Record<string, unknown>;

export default codeCleanup;
