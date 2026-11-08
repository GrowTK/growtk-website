/**
 * Project showcase: the grid on the homepage plus each /work/[slug] detail
 * page. One entry per project. Copy lives here, never in the components.
 */
import type { Project, SectionHeading, Cta } from "./types";

export const projectsShowcase = {
  heading: {
    eyebrow: "Outcomes",
    title: "Results we can show you running",
    body: "Not mockups. Real systems we built and run, each one a working case study you can click through.",
  } as SectionHeading,
  items: [
    {
      slug: "corvinn",
      name: "Corvinn",
      tagline: "An AI-native CRM and voice agent platform for field service businesses",
      description:
        "Corvinn is our own in-house build: one system that routes leads, answers the phone with a voice agent, schedules the job and keeps the whole crew on one calendar. It is the same playbook we build into every client site, proven on our own stack first.",
      logo: { src: "/ingested/corvinn/logo-white-full.png", alt: "Corvinn logo" },
      thumbnailClassName: "bg-[#FA5F68]",
      accentHex: "#FA5F68",
      kind: "Field service SaaS",
      tags: ["Dispatch", "Offline mobile app", "Payments", "Campaigns"],
      preview: { src: "/ingested/corvinn/preview.jpg", alt: "The Corvinn dashboard: active jobs, emergencies, today's schedule and revenue", width: 1200, height: 700 },
    },
    {
      slug: "yetti",
      name: "Yetti",
      tagline: "An AI front desk and booking system for tour, charter and rental operators",
      description:
        "Yetti answers guests on WhatsApp, Instagram, Messenger, Telegram and email, checks live availability, books the trip and takes payment. The same workspace runs the booking calendar, waivers, guest check-in and the CRM, so a booking made in a chat is on the dock sheet a second later.",
      logo: { src: "/ingested/yetti/face.png", alt: "Yetti logo, a smiling yeti face" },
      logoShape: "square",
      thumbnailClassName: "bg-[#2d6695]",
      accentHex: "#2d6695",
      kind: "Booking platform",
      tags: ["AI inbox", "Bookings", "Check-in", "CRM"],
      preview: { src: "/ingested/yetti/preview.jpg", alt: "The Yetti inbox answering a guest across WhatsApp, Instagram and email", width: 1200, height: 700 },
    },
    {
      slug: "jerrys",
      name: "Jerry's",
      tagline: "Point of sale, website and self-posting brand for a fast food kitchen in Kharian",
      description:
        "Jerry's is a fast food kitchen at Mall of Kharian. Its POS takes every recipe out of stock as it sells, counts the cash drawer and messages the owner on WhatsApp. The website reads its prices off the till, and the Instagram posts render themselves from the menu.",
      logo: { src: "/ingested/jerrys/mark-white.png", alt: "Jerry's logo, a hand drawn J's" },
      thumbnailClassName: "bg-[#d92025]",
      accentHex: "#d92025",
      kind: "Restaurant system",
      tags: ["POS", "Website", "Instagram posts"],
      preview: { src: "/ingested/jerrys/preview.jpg", alt: "The Jerry's POS checkout with the real menu: zinger burger, shawarma, fries and shakes", width: 1200, height: 700 },
    },
    {
      slug: "autotalent",
      name: "AutoTalent",
      tagline: "An AI job search assistant that writes every application from your real experience",
      description:
        "AutoTalent turns one profile into a tailored resume, cover letter, follow-up email and interview prep for each job. A career agent that remembers the user writes and scores the documents, job search feeds the kits, and the whole app works in English, Swedish and Arabic.",
      logo: { src: "/ingested/autotalent/logo-white.png", alt: "AutoTalent logo, a circuit brain mark" },
      logoShape: "square",
      thumbnailClassName: "bg-[#2f3826]",
      accentHex: "#5b6949",
      kind: "AI product",
      tags: ["AI agent", "Resume builder", "Job search", "3 languages"],
      preview: { src: "/ingested/autotalent/preview.jpg", alt: "The AutoTalent agent writing a tailored resume in the chat while the document fills in beside it", width: 1200, height: 700 },
    },
    {
      slug: "umr",
      name: "Ultra Modern Rails",
      tagline: "A Shopify quote form wired into GoHighLevel, Slack and a website chat for a railing manufacturer",
      description:
        "Ultra Modern Rails sells custom cable and glass railing systems. We connected their Shopify quote form to GoHighLevel, so every request becomes a tracked lead with an instant email and text, a rep picked by round robin and a post in Slack. Then we added a website chat that sends quotes, order questions and support cases to the people who handle them.",
      logo: { src: "/ingested/umr/logo-white.png", alt: "Ultra Modern Rails logo" },
      thumbnailClassName: "bg-[#C55B3E]",
      accentHex: "#C55B3E",
      kind: "Client build",
      tags: ["Shopify", "GoHighLevel", "Slack", "AI chat widget"],
      preview: { src: "/ingested/umr/preview.jpg", alt: "The Ultra Modern Rails GoHighLevel pipeline, each stage starting its own workflow", width: 1200, height: 700 },
    },
    {
      slug: "dentavanta",
      name: "Dentavanta",
      tagline: "A growth platform for dental practices: leads, AI phone agents and automations on a security first AWS backend",
      description:
        "Dentavanta brings a dental practice's leads, patients, calendar, calls, texts and emails into one workspace, with AI phone agents and automations doing the follow up. We engineer it end to end for its founder: the AWS infrastructure, the API, the practice app, and a clinic website whose appointment form drops straight onto the Leads board. It is pre-launch and preparing a founding practice pilot.",
      logo: { src: "/ingested/dentavanta/logo-white.png", alt: "Dentavanta logo" },
      thumbnailClassName: "bg-[#0636a6]",
      accentHex: "#0636a6",
      kind: "Client build",
      tags: ["Pre-launch", "AWS", "Practice app", "AI phone agents"],
      preview: { src: "/ingested/dentavanta/preview.jpg", alt: "The Dentavanta leads board, from first inquiry to booked visit", width: 1200, height: 700 },
    },
  ] as Project[],
};

export const projectDetailCta = {
  heading: { title: "Want something like this running for your business" } as SectionHeading,
  primary: { label: "Start a project", href: "/contact", variant: "primary" } as Cta,
};
