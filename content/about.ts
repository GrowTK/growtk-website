/**
 * About page copy. Growtk is a real, operating service studio, not a
 * pre-launch product. No invented team size, founding year, or fabricated
 * stats (client count, years in business).
 */
import type { PageContent, Cta, Img, SectionHeading, Feature } from "./types";

export const about = {
  meta: {
    title: "About Growtk",
    description:
      "Growtk is a service studio that redesigns websites and builds automation, voice agents and integrations for trade and service businesses. Here is why we started it and how we work.",
    path: "/about",
  },

  hero: {
    eyebrow: "About Growtk",
    title: "We started Growtk because good work shouldn't be this hard to find",
    body: "Small trade and service businesses get stuck picking between an enterprise agency built for a far bigger budget, or a cheap template site with nothing running behind it. We built Growtk to be the option in between: real engineering, sized and priced for the business that actually needs it.",
    ctas: [
      { label: "Talk to us", href: "/contact", variant: "primary" },
      { label: "See our services", href: "/services", variant: "secondary" },
    ] as Cta[],
  },

  story: {
    heading: {
      eyebrow: "Why we started",
      title: "Every option we saw for a small trade business was wrong in a different way",
      body: "One kind of agency is built for enterprise budgets and enterprise timelines. The other hands over a templated site and calls it done. Neither one actually saves the owner any time.",
    } as SectionHeading,
    body: [
      "Roofing crews, fencing contractors, and healthcare front offices are good at their trade, not at chasing down a web developer or wiring together five different tools that don't talk to each other. Most of them are running on a website nobody has touched in years and a phone that rings all day with the same three questions.",
      "We started Growtk to build the way we would want a website and automation partner to build for our own business: fast, plain about scope and timeline, and focused on hours actually saved, not just a homepage that looks nice in a portfolio.",
      "That starts with a real conversation about what is slowing a business down: an outdated site that never turns into a call, leads that go cold because nobody follows up fast enough, or an afternoon eaten by scheduling the same job over and over. Then we build the specific thing that fixes it, whether that is a new site, a workflow automation, a voice agent, or a proper integration between tools already in use.",
      "We would rather build one thing that actually gets used than five things that look good in a proposal.",
    ],
    image: {
      src: "https://images.unsplash.com/photo-1582005450386-52b25f82d9bb?auto=format&fit=crop&w=1200&q=80",
      alt: "Three colleagues sitting around a table with laptops open, working together in a small studio",
    } as Img,
    caption: "Built project by project, with the business that's paying for it in the room.",
  },

  values: {
    heading: {
      eyebrow: "How we work",
      title: "Four things every project gets held to",
    } as SectionHeading,
    lead: "None of this is aspirational. It is the standard every project ships against, not a slogan on a slide.",
    items: [
      {
        icon: "Clock",
        title: "Built to save real hours",
        body: "If a website or automation doesn't save time or win more calls, it doesn't ship. Looking good is a side effect, not the goal.",
      },
      {
        icon: "MessageSquareText",
        title: "Honest about timelines and scope",
        body: "We tell you what's realistic before you sign anything, and we say so plainly if something is going to take longer than planned instead of letting a deadline slip quietly.",
      },
      {
        icon: "Plug",
        title: "Built to fit what you already run",
        body: "We connect to the CRM, scheduling tool, and calendar a business already uses instead of asking anyone to rip out software that works fine and start over.",
      },
      {
        icon: "Wrench",
        title: "Sized for the business paying for it",
        body: "Every project is scoped for a business with a handful of trucks or a couple of front-desk staff, not for a budget line at a franchise headquarters.",
      },
    ] as Feature[],
  },

  cta: {
    heading: {
      eyebrow: "Let's talk",
      title: "Tell us what's slowing your business down",
      body: "A free audit call is the fastest way to find out what's worth fixing first.",
    } as SectionHeading,
    primary: { label: "Talk to us", href: "/contact" } as Cta,
    secondary: { label: "See our services", href: "/services" } as Cta,
  },
} satisfies PageContent & Record<string, unknown>;

export default about;
