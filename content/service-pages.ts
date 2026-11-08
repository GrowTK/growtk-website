/**
 * The thirteen service pages under /services/<slug>, plus the card copy the
 * services hub, the nav and the footer use. Growtk delivers every service AI
 * first: AI agents and automation do the work around the clock, and a person
 * steps in on escalation, on the path the client chooses. Never claim a
 * staffed call floor, seat counts, client counts or stats here.
 *
 * Feature icons double as the figure picker on each "What's included" row
 * (see serviceFigureFor in components/sections/industries/service-figures.ts).
 *
 * Keep every string free of em dashes and en dashes.
 */
import type { Cta, Feature, FaqItem, SectionHeading, Step } from "./types";

export type ServiceGroup = "customer-support" | "operations" | "growth";

export type ServicePage = {
  slug: string;
  group: ServiceGroup;
  /** Short name for the nav, footer and cards. */
  name: string;
  /** lucide-react icon name for cards and the strip. */
  icon: string;
  /** One line for hub cards and the nav. */
  teaser: string;
  /** Hairline figure in the hero: site, estimate, schedule, voice, connect or rank. */
  figure: "site" | "estimate" | "schedule" | "voice" | "connect" | "rank";
  meta: { title: string; description: string };
  hero: SectionHeading & { ctas: Cta[] };
  included: { heading: SectionHeading; features: Feature[] };
  /** Three situations the service is built for. */
  whoFor: { heading: SectionHeading; items: Feature[] };
  /** Three reasons it matters, shown as a dark numbered panel. */
  why: { heading: SectionHeading; items: Feature[] };
  /** Slugs from content/projects.ts shown as case studies, two per page. */
  caseStudies: [string, string];
  process: { heading: SectionHeading; steps: Step[] };
  faq: { heading: SectionHeading; items: FaqItem[] };
  /** Slugs of three related services. */
  related: string[];
  cta: { heading: SectionHeading; primary: Cta };
};

export const serviceGroups: { id: ServiceGroup; name: string; body: string }[] = [
  { id: "customer-support", name: "Customer support", body: "Every call, chat, email and message answered, every outbound campaign run, and the whole customer journey looked after, by AI agents with a person on escalation." },
  { id: "operations", name: "Operations", body: "Staffing, technical support, the back office and the process itself, automated and redesigned so the work gets lighter as you grow." },
  { id: "growth", name: "Growth", body: "A pipeline that fills itself: every lead captured, qualified, called, followed up and handed to sales ready to close." },
]

const contact = (label = "Book a free audit"): Cta => ({ label, href: "/contact", variant: "primary" });

const sharedProcess = (what: string): { heading: SectionHeading; steps: Step[] } => ({
  heading: {
    eyebrow: "How it works",
    title: "From first call to running on its own",
    body: `The same four steps for every engagement, set up around ${what}.`,
  },
  steps: [
    { n: 1, title: "Audit", body: "A free call to map your channels, your volume and the tools you already use, and find where requests wait or get dropped." },
    { n: 2, title: "Design", body: "A written plan: what the AI agents handle, what goes to a person and how, what it connects to, and what it costs." },
    { n: 3, title: "Launch", body: "We build it inside your own tools, test it on real conversations, and go live one channel at a time." },
    { n: 4, title: "Improve", body: "We review conversations every week, tune scripts and rules, and add channels once the first one runs clean." },
  ],
});

export const servicePages: ServicePage[] = [
  {
    slug: "contact-center-services",
    group: "customer-support",
    name: "Contact center services",
    icon: "Headset",
    teaser: "A full contact center run by AI agents, answering and calling out across every channel, with a person on escalation.",
    figure: "voice",
    meta: {
      title: "AI contact center services",
      description: "Growtk runs your contact center AI first: inbound and outbound calls, chat, email and messaging handled by AI agents around the clock, with human escalation built in.",
    },
    hero: {
      eyebrow: "Contact center services",
      title: "A contact center that answers every time",
      body: "Calls, chats, emails and messages, inbound and outbound, handled by AI agents that know your business, your policies and your customers. Anything a person should handle reaches one, with the whole conversation already in front of them.",
      ctas: [contact()],
    },
    included: {
      heading: { eyebrow: "What's included", title: "Everything a contact center does, without the floor", body: "Pick the channels and the hours. The AI agents work all of them, all the time." },
      features: [
        { icon: "PhoneCall", title: "Inbound calls, chats and email", body: "Every inbound request answered in seconds, resolved from your knowledge base and logged in your CRM, at two in the afternoon or two in the morning." },
        { icon: "CalendarCheck", title: "Outbound campaigns and follow-ups", body: "Reminders, renewals, win-backs and callbacks placed on schedule, with consent checked first and every outcome written back to the record.", href: "/services/outbound-contact-center" },
        { icon: "Plug", title: "One record across every channel", body: "A customer who calls, then texts, then emails is one conversation, not three tickets, so nobody has to explain themselves twice." },
        { icon: "Headset", title: "Human escalation that keeps context", body: "Angry, complex or high value conversations go to the right person by your rules, with a summary and the full transcript attached." },
        { icon: "Search", title: "Reporting you can act on", body: "Volume, resolution and wait times by channel and topic, plus the questions your knowledge base could not answer yet." },
        { icon: "Moon", title: "Overflow and after-hours cover", body: "Keep your in-house team and let the AI agents take the spikes, nights and weekends. Customers never notice the switch." },
      ],
    },
    whoFor: {
      heading: { eyebrow: "Who it's for", title: "Built for teams in these situations" },
      items: [
        { icon: "Building", title: "Growing faster than you can hire", body: "Volume is rising and every new agent takes weeks to recruit and train. AI agents scale with the volume on day one." },
        { icon: "Clock", title: "Customers in every time zone", body: "Requests arrive around the clock. AI agents answer at three in the morning the same way they answer at noon." },
        { icon: "TrendingDown", title: "A queue that costs you customers", body: "Long holds and unanswered email send customers to competitors. Every contact gets picked up in seconds instead." },
      ],
    },
    why: {
      heading: { eyebrow: "Why it matters", title: "What changes when it runs" },
      items: [
        { icon: "Target", title: "Customers stay when they are answered", body: "A fast, correct answer is the cheapest way to keep a customer you already paid to win." },
        { icon: "Gauge", title: "Cost follows volume, not headcount", body: "You pay for the work handled, not for seats sitting idle between peaks." },
        { icon: "TrendingUp", title: "Every conversation becomes data", body: "Topics, outcomes and gaps are logged, so you see exactly why customers get in touch." },
      ],
    },
    caseStudies: ["yetti", "umr"],
    process: sharedProcess("your contact center"),
    faq: {
      heading: { eyebrow: "Contact center questions", title: "What teams ask before handing over the phones" },
      items: [
        { q: "Do callers know they are talking to AI?", a: "Yes. The agent introduces itself as an assistant for your business, and a caller can ask for a person at any time." },
        { q: "Which channels can it cover?", a: "Phone, text, live chat, email, WhatsApp and social messages. Most teams start with the busiest channel and add the rest once it runs clean." },
        { q: "What happens outside business hours?", a: "The AI agents keep answering. Urgent requests follow your after-hours escalation rules, and everything else is resolved or queued for the morning." },
        { q: "Can we keep our existing phone number?", a: "Yes. We forward or port your existing numbers, so customers keep calling the number they already know." },
      ],
    },
    related: ["inbound-contact-center", "outbound-contact-center", "customer-support"],
    cta: { heading: { eyebrow: "Free audit", title: "Find out how much of your contact center can run itself", body: "We map your channels and volume and show you what the AI agents would take first." }, primary: contact("Book your free audit") },
  },
  {
    slug: "inbound-contact-center",
    group: "customer-support",
    name: "Inbound contact center",
    icon: "PhoneIncoming",
    teaser: "Every inbound call, chat and email answered in seconds and resolved right, day or night.",
    figure: "voice",
    meta: {
      title: "AI inbound contact center",
      description: "AI agents answer your inbound calls, chats and email in seconds, resolve them from your knowledge base and hand anything complex to a person, around the clock.",
    },
    hero: {
      eyebrow: "Inbound contact center",
      title: "No queue, no voicemail, no lost customer",
      body: "High volume or a sudden spike, every inbound call, chat and email is picked up in seconds by an AI agent that resolves it from your policies and your systems. The rest goes to the right person with everything they need to finish it.",
      ctas: [contact()],
    },
    included: {
      heading: { eyebrow: "What's included", title: "Built for the volume you actually get", body: "Peaks, holidays and two in the morning all get the same answer time." },
      features: [
        { icon: "PhoneCall", title: "Calls answered on the first ring", body: "A natural voice agent answers, understands the reason for the call and resolves it, or books, routes or escalates it, without a hold queue." },
        { icon: "MessageSquare", title: "Chat, text and email on the same rules", body: "The same answers and the same policies on every channel, so a customer gets one story whether they call, chat or write." },
        { icon: "ClipboardCheck", title: "Resolution from your own knowledge", body: "Order lookups, account changes, bookings and policy questions answered from your systems and knowledge base, not guessed." },
        { icon: "Headset", title: "Warm handoffs to your team", body: "When a person is needed, the call or chat transfers with a summary, so your team starts at the answer, not at hello." },
        { icon: "Star", title: "Every contact logged and followed up", body: "Each conversation lands in your CRM or helpdesk with its outcome, and anything promised gets a follow-up on its own." },
        { icon: "ShoppingCart", title: "Sales moments on inbound calls", body: "Buying questions get answered and quotes or orders started in the same conversation, helpfully and without a hard sell." },
      ],
    },
    whoFor: {
      heading: { eyebrow: "Who it's for", title: "Built for teams in these situations" },
      items: [
        { icon: "Zap", title: "Seasonal and campaign spikes", body: "A launch, a storm or a sale floods the lines. Parallel AI agents absorb the spike without a queue." },
        { icon: "Moon", title: "After-hours demand", body: "Calls after closing used to go to voicemail. Now they get answered, resolved or booked." },
        { icon: "Users", title: "A small team covering every channel", body: "Phones, chat and email no longer compete for the same two people." },
      ],
    },
    why: {
      heading: { eyebrow: "Why it matters", title: "What changes when it runs" },
      items: [
        { icon: "Target", title: "The first answer decides the customer", body: "Customers judge you by how fast and how well the first contact goes." },
        { icon: "Gauge", title: "Routine work stops reaching people", body: "Your team spends its time on the conversations that need judgment, not on order lookups." },
        { icon: "TrendingUp", title: "Nothing is lost between channels", body: "Every contact is logged with its outcome, so a promised callback actually happens." },
      ],
    },
    caseStudies: ["yetti", "dentavanta"],
    process: sharedProcess("your inbound channels"),
    faq: {
      heading: { eyebrow: "Inbound questions", title: "What teams ask about inbound" },
      items: [
        { q: "How does it handle a sudden spike in calls?", a: "AI agents answer calls in parallel, so a spike does not create a queue. Your escalation rules decide what reaches a person and in what order." },
        { q: "Can it look up orders or accounts?", a: "Yes, when we connect it to the system that holds them. It reads what it needs to answer and only changes what you allow it to change." },
        { q: "What if it does not know the answer?", a: "It says so, takes the details and hands the request to a person, and the missing answer is flagged so it can be added to the knowledge base." },
        { q: "Which languages can it handle?", a: "English by default, with other languages set up per engagement. We test each language on real conversations before it goes live." },
      ],
    },
    related: ["contact-center-services", "customer-support", "technical-support"],
    cta: { heading: { eyebrow: "Free audit", title: "See where your inbound requests wait today", body: "We trace your calls, chats and email to the step where customers give up." }, primary: contact("Book your free audit") },
  },
  {
    slug: "outbound-contact-center",
    group: "customer-support",
    name: "Outbound contact center",
    icon: "PhoneOutgoing",
    teaser: "Reminders, renewals, callbacks and win-backs placed on schedule, with consent checked first.",
    figure: "schedule",
    meta: {
      title: "AI outbound contact center",
      description: "AI agents place your reminder, renewal, callback and win-back calls and texts on schedule, check consent first and write every outcome back to your CRM.",
    },
    hero: {
      eyebrow: "Outbound contact center",
      title: "The calls your team never gets to, made on time",
      body: "Appointment reminders, renewals, overdue follow-ups and win-back campaigns run on their own schedule. AI agents place the calls and texts, hold a real conversation, and hand the warm ones to a person, all within the consent rules that apply to you.",
      ctas: [contact()],
    },
    included: {
      heading: { eyebrow: "What's included", title: "Outbound that runs on its own schedule", body: "You choose the lists and the rules. The agents make the calls." },
      features: [
        { icon: "CalendarCheck", title: "Reminders and confirmations", body: "Appointment, delivery and payment reminders by call or text, with reschedules booked in the same conversation." },
        { icon: "Repeat", title: "Renewals and win-backs", body: "Customers coming up for renewal or gone quiet get a timely, personal call instead of a reminder nobody sends." },
        { icon: "PhoneCall", title: "Callbacks and missed-call follow-up", body: "Every missed call and callback request gets returned fast, before the customer tries someone else." },
        { icon: "ClipboardCheck", title: "Consent and quiet hours built in", body: "Calls and texts go only to contacts with the right consent, inside allowed hours, with opt-outs honored straight away." },
        { icon: "Star", title: "Outcomes written back", body: "Every answer, no answer, booking and opt-out is recorded on the contact, so the next step is always clear." },
        { icon: "BarChart3", title: "Surveys and market research", body: "Short post-service and research calls that ask your questions naturally and roll every answer into one report." },
      ],
    },
    whoFor: {
      heading: { eyebrow: "Who it's for", title: "Built for teams in these situations" },
      items: [
        { icon: "CalendarX", title: "No-shows and missed appointments", body: "Reminders and easy rescheduling cut the empty slots that cost you a full day's margin." },
        { icon: "RotateCcw", title: "Renewals that quietly lapse", body: "Plans and contracts get a timely call before they expire, not a reminder nobody sends." },
        { icon: "PhoneMissed", title: "Callbacks that never happen", body: "Every missed call and callback request gets returned while the customer still cares." },
      ],
    },
    why: {
      heading: { eyebrow: "Why it matters", title: "What changes when it runs" },
      items: [
        { icon: "Target", title: "Revenue you already earned", body: "Renewals, reminders and win-backs recover money from customers you already have." },
        { icon: "Gauge", title: "Consent is not optional", body: "Calls and texts run inside the rules that apply to you, with every opt-out honored." },
        { icon: "TrendingUp", title: "Your team calls only the warm ones", body: "Interested contacts reach a person; everyone else gets a logged outcome." },
      ],
    },
    caseStudies: ["umr", "corvinn"],
    process: sharedProcess("your outbound campaigns"),
    faq: {
      heading: { eyebrow: "Outbound questions", title: "What teams ask about outbound" },
      items: [
        { q: "How do you handle calling and texting rules?", a: "Consent, quiet hours and opt-outs are part of the setup, not an afterthought. We configure them for where your customers are, and you approve the rules before anything is sent." },
        { q: "Can it book or reschedule during the call?", a: "Yes. It checks live availability in your calendar or scheduling tool and books, moves or cancels in the same conversation." },
        { q: "Does it leave voicemails?", a: "If you want it to. Many teams prefer a short voicemail plus a text, so the customer can reply when it suits them." },
        { q: "Who does a hot lead go to?", a: "The rep or team your rules choose, with a summary of the call, straight away by call transfer or by an instant alert." },
      ],
    },
    related: ["telemarketing", "lead-generation", "contact-center-services"],
    cta: { heading: { eyebrow: "Free audit", title: "Find the calls that are not getting made", body: "We look at your lists, your follow-ups and your no-shows, and show you what outbound would recover." }, primary: contact("Book your free audit") },
  },
  {
    slug: "customer-support",
    group: "customer-support",
    name: "Customer support",
    icon: "LifeBuoy",
    teaser: "Support that resolves instead of deflects, across every channel your customers use.",
    figure: "connect",
    meta: {
      title: "AI customer support services",
      description: "Growtk runs your customer support AI first: questions resolved from your knowledge base across every channel, tickets routed and tracked, and people on hand for what needs a human.",
    },
    hero: {
      eyebrow: "Customer support",
      title: "Support that resolves, not just responds",
      body: "Most support tools are built to deflect. Ours are built to finish the job: AI agents resolve the routine questions completely, open and route a ticket for everything else, and keep the customer updated until it is closed.",
      ctas: [contact()],
    },
    included: {
      heading: { eyebrow: "What's included", title: "Support across every channel, measured by resolution", body: "Not by how fast a bot replied." },
      features: [
        { icon: "MessageSquare", title: "Every channel, one standard", body: "Chat, email, phone, WhatsApp and social messages answered with the same knowledge and the same tone of voice." },
        { icon: "ClipboardCheck", title: "Tickets that route themselves", body: "Requests are tagged, prioritized and sent to the right queue or person, with a response target on each one." },
        { icon: "Search", title: "A knowledge base that keeps up", body: "Answers come from a knowledge base built from your real tickets, and gaps are flagged the moment a question goes unanswered.", href: "/solutions/knowledge-base-system" },
        { icon: "Headset", title: "People where they count", body: "Refunds, complaints and anything sensitive reach a person by your rules, with a drafted reply ready to approve." },
        { icon: "Star", title: "Satisfaction measured after every contact", body: "A short survey follows each resolved conversation, and low scores reach a manager the same day.", href: "/solutions/survey-software" },
        { icon: "BarChart3", title: "Weekly insights and reporting", body: "Contact reasons, resolution and satisfaction by channel every week, plus the questions that still need a better answer." },
      ],
    },
    whoFor: {
      heading: { eyebrow: "Who it's for", title: "Built for teams in these situations" },
      items: [
        { icon: "Inbox", title: "A backlog that keeps growing", body: "Tickets pile up faster than the team can close them. Routine ones now close themselves." },
        { icon: "MessagesSquare", title: "Customers on too many channels", body: "Chat, email, phone and social each had their own queue. Now they share one standard." },
        { icon: "UserMinus", title: "Support that depends on one person", body: "When the one person who knows everything is away, answers come from the knowledge base instead." },
      ],
    },
    why: {
      heading: { eyebrow: "Why it matters", title: "What changes when it runs" },
      items: [
        { icon: "Target", title: "Resolution is what customers remember", body: "A complete answer beats a fast reply that sends them back to the queue." },
        { icon: "Gauge", title: "Your best answers, used every time", body: "Every agent, human or AI, answers from the same up to date knowledge." },
        { icon: "TrendingUp", title: "Problems surface early", body: "Recurring issues show up in the weekly report before they become a trend." },
      ],
    },
    caseStudies: ["yetti", "dentavanta"],
    process: sharedProcess("your support desk"),
    faq: {
      heading: { eyebrow: "Support questions", title: "What teams ask about support" },
      items: [
        { q: "Will it work inside our helpdesk?", a: "Yes. We work inside the helpdesk or CRM you already use, or build one for you if you do not have one yet." },
        { q: "How do you stop it from making things up?", a: "Answers come only from your knowledge base and connected systems. When it is not sure, it says so and hands over, and we review conversations every week." },
        { q: "Can it process refunds or changes?", a: "It can do whatever you allow in the connected system, and nothing more. Many teams let it handle small changes and route refunds to a person." },
        { q: "How do we see how it is doing?", a: "A weekly report covers volume, resolution, satisfaction and the questions it could not answer, plus a review of any escalations." },
      ],
    },
    related: ["technical-support", "ecommerce-customer-support", "customer-experience-management"],
    cta: { heading: { eyebrow: "Free audit", title: "See how much of your support queue can close itself", body: "We review a sample of your tickets and show you which ones AI agents would resolve." }, primary: contact("Book your free audit") },
  },
  {
    slug: "technical-support",
    group: "operations",
    name: "Technical support",
    icon: "Wrench",
    teaser: "Tier 1 troubleshooting resolved from your docs, clean handoffs to engineers for the rest.",
    figure: "site",
    meta: {
      title: "AI technical and backend support",
      description: "AI agents handle tier 1 troubleshooting from your documentation, collect diagnostics, escalate clean tickets to your engineers and keep users updated, for SaaS and tech products.",
    },
    hero: {
      eyebrow: "Technical support",
      title: "Tier 1 handled, tier 2 handed over clean",
      body: "Password resets, setup questions and known issues get solved from your docs in minutes. Real bugs reach your engineers as tidy tickets with steps, logs and context attached, instead of a vague complaint and three rounds of back and forth.",
      ctas: [contact()],
    },
    included: {
      heading: { eyebrow: "What's included", title: "Support built for technical products", body: "So your engineers spend their time on engineering." },
      features: [
        { icon: "Smartphone", title: "Guided troubleshooting", body: "Step by step help from your documentation, adjusted to the user's plan, device and setup, with screenshots or links where they help." },
        { icon: "ClipboardCheck", title: "Diagnostics collected up front", body: "Account details, versions, error messages and steps to reproduce gathered before a ticket is opened, so nobody has to ask twice." },
        { icon: "Plug", title: "Clean escalation to engineering", body: "Confirmed issues land in your issue tracker or helpdesk with priority, impact and everything an engineer needs." },
        { icon: "BellRing", title: "Incident and status updates", body: "When something is down, affected users hear about it and hear again when it is fixed, without your team writing every message." },
        { icon: "Search", title: "Backend and account operations", body: "Routine account changes, data fixes and provisioning steps handled by automation with an audit trail, not by hand." },
        { icon: "BookOpen", title: "Documentation that keeps up", body: "Every resolved issue that had no article becomes one, so the next user finds the fix without opening a ticket.", href: "/solutions/knowledge-base-system" },
      ],
    },
    whoFor: {
      heading: { eyebrow: "Who it's for", title: "Built for teams in these situations" },
      items: [
        { icon: "Code", title: "SaaS and software products", body: "Setup questions and known issues eat your engineers' week. Tier 1 now resolves from your docs." },
        { icon: "Cpu", title: "Hardware and connected devices", body: "Guided troubleshooting walks users through the steps before anything ships back." },
        { icon: "Server", title: "Platforms with backend operations", body: "Routine account and data tasks run as logged automations instead of manual work." },
      ],
    },
    why: {
      heading: { eyebrow: "Why it matters", title: "What changes when it runs" },
      items: [
        { icon: "Target", title: "Engineers build, not answer", body: "Every hour not spent on tier 1 goes back into the product." },
        { icon: "Gauge", title: "Tickets arrive complete", body: "Steps, versions and logs collected up front mean fewer rounds of back and forth." },
        { icon: "TrendingUp", title: "Users stay informed", body: "Incident and status updates go out on their own, so trust survives an outage." },
      ],
    },
    caseStudies: ["autotalent", "corvinn"],
    process: sharedProcess("your product and your engineering team"),
    faq: {
      heading: { eyebrow: "Technical support questions", title: "What product teams ask us" },
      items: [
        { q: "Can it read our documentation and changelog?", a: "Yes. We connect your docs, help center and release notes, and keep them in sync so answers change when the product does." },
        { q: "Which tools does it escalate into?", a: "Your existing helpdesk or issue tracker. We set up the fields, priorities and routing your engineers already use." },
        { q: "Can it take actions in our product?", a: "Only through the APIs and permissions you approve, with every action logged. Many teams start read only and widen access over time." },
        { q: "What about tier 2 and 3?", a: "Those stay with your engineers. Our job is to make sure what reaches them is real, complete and prioritized." },
      ],
    },
    related: ["customer-support", "back-office-support", "inbound-contact-center"],
    cta: { heading: { eyebrow: "Free audit", title: "Shrink your support backlog", body: "We review your recent tickets and show you how many tier 1 issues would never reach an engineer." }, primary: contact("Book your free audit") },
  },
  {
    slug: "ecommerce-customer-support",
    group: "customer-support",
    name: "E-commerce customer support",
    icon: "ShoppingBag",
    teaser: "Order status, returns and pre-sale questions answered in seconds, so shoppers buy and come back.",
    figure: "estimate",
    meta: {
      title: "AI e-commerce customer support",
      description: "AI agents answer order status, returns, exchanges and pre-sale questions for online stores in seconds, across chat, email and phone, connected to your store and shipping tools.",
    },
    hero: {
      eyebrow: "E-commerce customer support",
      title: "Every shopper answered before they leave the tab",
      body: "Where is my order, can I return this, will it fit, do you ship to me. AI agents connected to your store and shipping tools answer in seconds, handle returns and exchanges by your policy, and help undecided shoppers check out.",
      ctas: [contact()],
    },
    included: {
      heading: { eyebrow: "What's included", title: "Support that sells as well as serves", body: "Connected to your store, your carriers and your policies." },
      features: [
        { icon: "ClipboardCheck", title: "Order status in seconds", body: "Live order and tracking lookups from your store and carriers, so the most common question never needs a person." },
        { icon: "Repeat", title: "Returns and exchanges by your rules", body: "Eligibility checked, labels and instructions sent, and exchanges set up according to your policy, with exceptions routed to your team." },
        { icon: "Calculator", title: "Pre-sale help that converts", body: "Sizing, compatibility, stock and shipping questions answered on the product page, while the shopper is still deciding." },
        { icon: "Star", title: "Quote and custom order requests", body: "Custom and bulk requests captured with every detail and sent to the right person as a ready to work lead." },
        { icon: "BellRing", title: "Proactive delivery updates", body: "Delays and exceptions trigger a message before the customer has to ask, which keeps tickets and chargebacks down." },
        { icon: "MessageSquareHeart", title: "Reviews requested after delivery", body: "Happy customers get a review request once the order arrives, and unhappy ones reach your team before they post." },
      ],
    },
    whoFor: {
      heading: { eyebrow: "Who it's for", title: "Built for teams in these situations" },
      items: [
        { icon: "Package", title: "Stores drowning in where is my order", body: "Order and tracking questions answer themselves from your store and carriers." },
        { icon: "Ruler", title: "Products that need a quote", body: "Custom and made to measure requests arrive with every detail as ready to work leads." },
        { icon: "Sparkles", title: "Peak seasons and launches", body: "Holiday and launch spikes get the same answer time as a quiet Tuesday." },
      ],
    },
    why: {
      heading: { eyebrow: "Why it matters", title: "What changes when it runs" },
      items: [
        { icon: "Target", title: "Answers on the product page sell", body: "A sizing or shipping answer at the right moment turns a browser into a buyer." },
        { icon: "Gauge", title: "Returns by your rules, not by hand", body: "Policy is applied the same way every time, with exceptions routed to your team." },
        { icon: "TrendingUp", title: "Proactive beats reactive", body: "A delay message before the customer asks prevents the ticket and the chargeback." },
      ],
    },
    caseStudies: ["umr", "jerrys"],
    process: sharedProcess("your store"),
    faq: {
      heading: { eyebrow: "E-commerce questions", title: "What store owners ask us" },
      items: [
        { q: "Which store platforms do you work with?", a: "Shopify most often, and other platforms through their APIs. We connect your store, your carriers and your helpdesk." },
        { q: "Can it issue refunds?", a: "It can follow your refund policy inside the store if you allow it. Many stores let it approve small, clear cases and route the rest to a person." },
        { q: "Will it work on our product pages?", a: "Yes. A chat on the product and checkout pages answers pre-sale questions and can link straight to the right product or size." },
        { q: "How do custom quote requests work?", a: "The agent collects measurements, options and photos, then creates a lead in your CRM and alerts the right person. We built exactly this for a railing manufacturer on Shopify." },
      ],
    },
    related: ["customer-support", "customer-experience-management", "lead-generation"],
    cta: { heading: { eyebrow: "Free audit", title: "See which of your tickets are really where-is-my-order", body: "We review your inbox and show you how much a connected agent would answer on its own." }, primary: contact("Book your free audit") },
  },
  {
    slug: "lead-generation",
    group: "growth",
    name: "Lead generation",
    icon: "Target",
    teaser: "Every inquiry captured, qualified and routed to the right rep in seconds, then followed up until it decides.",
    figure: "rank",
    meta: {
      title: "AI lead generation and qualification",
      description: "Growtk captures every inquiry from forms, calls, chats and ads, qualifies it with AI, routes it to the right rep in seconds and follows up until the lead decides.",
    },
    hero: {
      eyebrow: "Lead generation",
      title: "A pipeline that fills itself, and follows up",
      body: "Leads go cold in minutes. Every form, call, chat and ad response is captured, qualified against your criteria, enriched with the details your team needs and routed to the right rep while the lead is still interested, with follow-up that keeps going on its own.",
      ctas: [contact()],
    },
    included: {
      heading: { eyebrow: "What's included", title: "From first click to booked meeting", body: "Every step between interest and a conversation, automated." },
      features: [
        { icon: "Search", title: "Capture from every source", body: "Website forms, quote tools, calls, chats, and Google and Meta lead ads all land in one place with their source attached." },
        { icon: "ClipboardCheck", title: "Qualification that asks the right questions", body: "An AI agent asks your qualifying questions by chat, text or call and scores the lead before a rep spends a minute on it." },
        { icon: "Zap", title: "Response in seconds", body: "Every new lead gets an email and a text straight away, and hot leads get a call, before they reach the next company on their list." },
        { icon: "Plug", title: "Routing and round robin", body: "Leads go to the right rep by territory, product or turn, with the full context, in the CRM you already use." },
        { icon: "Repeat", title: "Follow-up until it decides", body: "Day 1, 3 and 7 follow-ups and longer nurture sequences run by themselves and stop the moment the lead replies." },
        { icon: "CalendarCheck", title: "Meetings booked on the spot", body: "Qualified leads pick a time on the right rep's live calendar in the same conversation, with reminders sent before the call." },
      ],
    },
    whoFor: {
      heading: { eyebrow: "Who it's for", title: "Built for teams in these situations" },
      items: [
        { icon: "Timer", title: "Leads that wait hours for a reply", body: "Every new lead gets a reply in seconds, before they move on to the next company." },
        { icon: "Filter", title: "Reps chasing unqualified leads", body: "An AI agent asks your qualifying questions first, so reps only talk to real prospects." },
        { icon: "Layers", title: "Leads scattered across tools", body: "Forms, calls, chats and ads land in one CRM with their source attached." },
      ],
    },
    why: {
      heading: { eyebrow: "Why it matters", title: "What changes when it runs" },
      items: [
        { icon: "Target", title: "Speed wins the lead", body: "The first business to respond usually gets the conversation." },
        { icon: "Gauge", title: "Every lead gets followed up", body: "Sequences run until the lead replies or decides, so nothing goes cold by accident." },
        { icon: "TrendingUp", title: "You see what each source is worth", body: "Every lead keeps its source, so you know which channels actually bring revenue." },
      ],
    },
    caseStudies: ["umr", "dentavanta"],
    process: sharedProcess("your pipeline"),
    faq: {
      heading: { eyebrow: "Lead generation questions", title: "What sales teams ask us" },
      items: [
        { q: "Do you buy or sell lead lists?", a: "No. We capture, qualify and convert the demand you already generate, and run outreach only to contacts you are allowed to reach." },
        { q: "Which CRMs do you work with?", a: "GoHighLevel, HubSpot, Salesforce and most CRMs with an API. Leads, notes and stages stay in your system." },
        { q: "Can it book meetings straight onto calendars?", a: "Yes. Qualified leads can pick a time on the right rep's live calendar, inside the same chat, text or call." },
        { q: "Have you built this before?", a: "Yes. For a railing manufacturer we connected a Shopify quote form to GoHighLevel so every request becomes a tracked lead with an instant email and text and a rep picked by round robin." },
      ],
    },
    related: ["sales-support", "telemarketing", "outbound-contact-center"],
    cta: { heading: { eyebrow: "Free audit", title: "Find the leads that are going cold today", body: "We trace your lead sources to the minute they get a reply, and show you what is slipping." }, primary: contact("Book your free audit") },
  },
  {
    slug: "telemarketing",
    group: "growth",
    name: "Telemarketing",
    icon: "Megaphone",
    teaser: "Outbound call and text campaigns that sound human, respect the rules and hand warm prospects to sales.",
    figure: "voice",
    meta: {
      title: "AI telemarketing campaigns",
      description: "AI voice and text campaigns for offers, launches, renewals and event invites, run only to consented contacts, with warm prospects handed to your sales team.",
    },
    hero: {
      eyebrow: "Telemarketing",
      title: "Campaigns that reach people, not voicemail",
      body: "Launches, offers, renewals and event invites delivered by AI voice agents and text, at the right time, to the contacts you are allowed to reach. Interested prospects are handed to your team in the moment, and everyone else gets a polite, logged outcome.",
      ctas: [contact()],
    },
    included: {
      heading: { eyebrow: "What's included", title: "Campaigns you can run every week, not once a quarter", body: "Scripted, tested and measured." },
      features: [
        { icon: "PhoneCall", title: "AI voice campaigns", body: "Natural, scripted conversations that adapt to questions and objections, and transfer to a person when a prospect is ready." },
        { icon: "MessageSquare", title: "Text and email in the same campaign", body: "Calls, texts and emails coordinated so a prospect hears from you on the channel they actually answer." },
        { icon: "ClipboardCheck", title: "Consent first, every time", body: "Only contacts with the right consent, within allowed hours, with opt-outs honored straight away and recorded." },
        { icon: "TrendingUp", title: "Scripts tested and improved", body: "We test openings and offers, keep what converts and rewrite what does not, with results by script and segment." },
        { icon: "Star", title: "Every outcome on the record", body: "Interested, not now, call back later or opt out: every result written to the contact in your CRM." },
        { icon: "ListChecks", title: "Lists cleaned before every campaign", body: "Duplicates, bad numbers and opted-out contacts removed first, and every campaign updates the list for the next one." },
      ],
    },
    whoFor: {
      heading: { eyebrow: "Who it's for", title: "Built for teams in these situations" },
      items: [
        { icon: "Rocket", title: "Launches and promotions", body: "Tell your existing customers about a new offer with a campaign that runs in days, not weeks." },
        { icon: "RefreshCw", title: "Renewals and upgrades", body: "Customers coming up for renewal hear from you with a reason to stay and upgrade." },
        { icon: "Ticket", title: "Events and invitations", body: "Invites, reminders and RSVPs handled by voice and text, with attendance tracked." },
      ],
    },
    why: {
      heading: { eyebrow: "Why it matters", title: "What changes when it runs" },
      items: [
        { icon: "Target", title: "Reach beats reach-out", body: "Coordinated calls, texts and emails find people on the channel they actually answer." },
        { icon: "Gauge", title: "Compliance protects the brand", body: "Consent first, quiet hours and instant opt-outs keep campaigns on the right side of the rules." },
        { icon: "TrendingUp", title: "What works gets more", body: "Scripts and offers are tested weekly, so the next campaign starts from the winner." },
      ],
    },
    caseStudies: ["umr", "autotalent"],
    process: sharedProcess("your campaigns"),
    faq: {
      heading: { eyebrow: "Telemarketing questions", title: "What marketing teams ask us" },
      items: [
        { q: "Is AI calling allowed?", a: "Rules differ by country and state and by the kind of call. We only run campaigns to contacts with the consent those rules require, and we set this up with you before launch." },
        { q: "Can prospects talk to a person?", a: "Yes, at any time. Interested prospects can be transferred live or booked for a call with your team." },
        { q: "Do you provide the contact list?", a: "No. Campaigns run on your own customers and opted-in contacts." },
        { q: "How do we judge a campaign?", a: "Conversations, interested prospects, meetings booked and opt-outs, by script and segment, every week." },
      ],
    },
    related: ["outbound-contact-center", "lead-generation", "sales-support"],
    cta: { heading: { eyebrow: "Free audit", title: "Plan your next campaign with us", body: "Bring a list and an offer. We will show you how the campaign would run and what it would cost." }, primary: contact("Book your free audit") },
  },
  {
    slug: "sales-support",
    group: "growth",
    name: "Sales support",
    icon: "Handshake",
    teaser: "Quotes, follow-ups, CRM updates and scheduling handled, so reps spend their day selling.",
    figure: "schedule",
    meta: {
      title: "AI sales support services",
      description: "Growtk automates the work around selling: quote follow-ups, CRM updates, meeting scheduling, pipeline stages and rep handoffs, so your sales team spends its time with customers.",
    },
    hero: {
      eyebrow: "Sales support",
      title: "Give your reps their day back",
      body: "Reps lose hours to data entry, chasing quotes and booking meetings. We automate the work around the sale: every quote followed up, every call logged, every stage change starting the right next step, and every handoff arriving with context.",
      ctas: [contact()],
    },
    included: {
      heading: { eyebrow: "What's included", title: "Everything around the sale, handled", body: "So the pipeline moves even when the team is busy." },
      features: [
        { icon: "Repeat", title: "Quote follow-up that never forgets", body: "Every sent quote gets a follow-up sequence by email, text or call that stops the moment the customer replies or signs." },
        { icon: "CalendarCheck", title: "Meetings booked for reps", body: "Prospects pick a time on the right rep's live calendar, with reminders sent so fewer meetings are missed." },
        { icon: "Plug", title: "A CRM that updates itself", body: "Calls, emails and chats logged, notes summarized and fields filled in, so the pipeline reflects what actually happened." },
        { icon: "ClipboardCheck", title: "Pipeline stages that do the work", body: "Moving a deal to a new stage starts that stage's workflow: messages, tasks and alerts, without anyone remembering to send them." },
        { icon: "BellRing", title: "Team alerts where reps already are", body: "New leads, hot replies and won deals posted to the right Slack channel or phone with the rep tagged." },
        { icon: "RefreshCw", title: "Renewals started on time", body: "Contracts coming up for renewal start their outreach weeks ahead, and the account owner sees every reply." },
      ],
    },
    whoFor: {
      heading: { eyebrow: "Who it's for", title: "Built for teams in these situations" },
      items: [
        { icon: "FileText", title: "Teams that send a lot of quotes", body: "Every quote gets followed up on its own until it is signed or declined." },
        { icon: "Database", title: "CRMs nobody updates", body: "Calls, emails and notes log themselves, so the pipeline reflects reality." },
        { icon: "Hash", title: "Reps working from chat and phone", body: "Alerts reach reps where they already are, with the right person tagged." },
      ],
    },
    why: {
      heading: { eyebrow: "Why it matters", title: "What changes when it runs" },
      items: [
        { icon: "Target", title: "More selling hours", body: "Admin taken off reps' plates turns into time spent with customers." },
        { icon: "Gauge", title: "No deal falls through a crack", body: "Stage workflows make sure every customer gets the right next step." },
        { icon: "TrendingUp", title: "Forecasts you can trust", body: "A CRM that updates itself gives you a pipeline worth forecasting from." },
      ],
    },
    caseStudies: ["umr", "corvinn"],
    process: sharedProcess("your sales team"),
    faq: {
      heading: { eyebrow: "Sales support questions", title: "What sales leaders ask us" },
      items: [
        { q: "Does this replace our reps?", a: "No. It takes the admin off their plate so they spend more of the day in conversations that close." },
        { q: "Will it work with our CRM?", a: "Yes. GoHighLevel, HubSpot, Salesforce and most CRMs with an API. We build inside your system, not next to it." },
        { q: "Can deal stages trigger workflows?", a: "Yes. We built this for a railing manufacturer in GoHighLevel: each pipeline stage starts its own workflow, so every customer gets the right message at the right point." },
        { q: "Can alerts go to Slack?", a: "Yes. New requests, support cases and won deals can each post to their own channel with the right rep tagged." },
      ],
    },
    related: ["lead-generation", "telemarketing", "back-office-support"],
    cta: { heading: { eyebrow: "Free audit", title: "See how many rep hours go to admin", body: "We map your pipeline and show you which steps can run by themselves." }, primary: contact("Book your free audit") },
  },
  {
    slug: "back-office-support",
    group: "operations",
    name: "Back office support",
    icon: "FileStack",
    teaser: "Data entry, documents, invoices, reconciliations and reports processed automatically, with a person checking exceptions.",
    figure: "connect",
    meta: {
      title: "Back office support and automation",
      description: "Growtk automates back office work: data entry, document processing, invoicing, reconciliation, spreadsheets and reporting, with exceptions routed to a person for review.",
    },
    hero: {
      eyebrow: "Back office support",
      title: "The back office, cleared every day",
      body: "Data entry, documents, invoices, reconciliations, spreadsheets and reports. Automation does the repetitive work as it arrives, AI reads and sorts what used to need a person, and anything unusual is flagged for review instead of slipping through.",
      ctas: [contact()],
    },
    included: {
      heading: { eyebrow: "What's included", title: "Repetitive work, gone", body: "Without asking your team to change the tools they use." },
      features: [
        { icon: "ClipboardCheck", title: "Data entry and document processing", body: "Forms, emails, PDFs and receipts read, checked and entered into the right system, with low confidence items flagged for a person." },
        { icon: "Calculator", title: "Invoicing and reconciliation", body: "Invoices generated, sent and chased, and payments matched to them, with differences surfaced for review." },
        { icon: "Repeat", title: "Spreadsheets and documents that update themselves", body: "Google Sheets, Docs and reports filled from your systems on a schedule, so nobody copies numbers between tabs." },
        { icon: "BellRing", title: "Alerts for what needs attention", body: "Low stock, overdue payments, failed syncs and unusual numbers sent to the right person by WhatsApp, text, email or Slack." },
        { icon: "Plug", title: "Systems that talk to each other", body: "CRM, accounting, inventory and payments connected, so a change in one updates the rest." },
        { icon: "ShieldCheck", title: "Checks and verification steps", body: "Documents and details checked against your rules before a record moves forward, with anything unclear sent to a person to decide." },
      ],
    },
    whoFor: {
      heading: { eyebrow: "Who it's for", title: "Built for teams in these situations" },
      items: [
        { icon: "Receipt", title: "Finance and admin teams", body: "Invoices, payments and reconciliations run themselves, with exceptions flagged." },
        { icon: "Store", title: "Restaurants and retail", body: "Sales, stock and cash drawers tracked automatically, with alerts to the owner's phone." },
        { icon: "Sheet", title: "Teams living in spreadsheets", body: "Sheets and reports fill themselves from your systems on a schedule." },
      ],
    },
    why: {
      heading: { eyebrow: "Why it matters", title: "What changes when it runs" },
      items: [
        { icon: "Target", title: "Hours back every week", body: "Repetitive tasks that ate whole afternoons happen in the background." },
        { icon: "Gauge", title: "Fewer costly errors", body: "Checked, logged automation beats copying numbers between tabs by hand." },
        { icon: "TrendingUp", title: "Problems reach you first", body: "Alerts for low stock, overdue payments and odd numbers arrive before they cost money." },
      ],
    },
    caseStudies: ["jerrys", "dentavanta"],
    process: sharedProcess("your back office"),
    faq: {
      heading: { eyebrow: "Back office questions", title: "What operations teams ask us" },
      items: [
        { q: "What kind of documents can it read?", a: "Forms, emails, PDFs, invoices and receipts. Anything it is not sure about goes to a person instead of being entered wrong." },
        { q: "Which tools do you connect?", a: "Google Workspace, QuickBooks, Stripe, CRMs, inventory and point of sale systems, and most tools with an API." },
        { q: "Is there a real example?", a: "Yes. For a fast food kitchen we built a POS where every sale takes its recipe out of stock, and low stock, drawer counts and the day's sales reach the owner on WhatsApp." },
        { q: "How is accuracy checked?", a: "Every automated step is logged, low confidence items are reviewed by a person, and we spot check results with you every week at the start." },
      ],
    },
    related: ["business-process-reengineering", "workforce-management", "sales-support"],
    cta: { heading: { eyebrow: "Free audit", title: "List your most repetitive tasks", body: "We will show you which ones automation can take over first and how many hours that frees." }, primary: contact("Book your free audit") },
  },
  {
    slug: "customer-experience-management",
    group: "customer-support",
    name: "Customer experience management",
    icon: "HeartHandshake",
    teaser: "Journeys mapped, feedback collected at every touchpoint and reviews managed, so customers stay.",
    figure: "rank",
    meta: {
      title: "Customer experience management",
      description: "Growtk maps your customer journey, collects feedback after every touchpoint, manages review requests and replies, and turns what customers say into fixes.",
    },
    hero: {
      eyebrow: "Customer experience management",
      title: "Know how customers feel, and act on it",
      body: "Every touchpoint is a chance to keep or lose a customer. We map the journey, ask for feedback at the moments that matter, route unhappy customers to a person the same day, ask happy ones for a review, and turn the patterns into changes.",
      ctas: [contact()],
    },
    included: {
      heading: { eyebrow: "What's included", title: "The whole experience, measured and improved", body: "Not one survey a year." },
      features: [
        { icon: "Search", title: "Journey mapping", body: "Every step from first contact to repeat purchase mapped across channels, with the points where customers wait or drop off marked." },
        { icon: "ClipboardCheck", title: "Feedback at every touchpoint", body: "CSAT, NPS and short post-contact surveys sent by text, email or chat right after the moment they ask about.", href: "/solutions/survey-software" },
        { icon: "Star", title: "Reviews requested and answered", body: "Happy customers get a review request at the right time, and every review gets a reply drafted for you." },
        { icon: "BellRing", title: "Recovery for unhappy customers", body: "A low score or bad review alerts the right person straight away, so a problem gets fixed before the customer leaves." },
        { icon: "TrendingUp", title: "Insights turned into fixes", body: "Themes across surveys, tickets and reviews rolled up monthly, with the changes most likely to move satisfaction." },
        { icon: "Gauge", title: "Quality reviewed on every conversation", body: "Calls and chats, from AI agents and people, scored against your own standard, so coaching starts from real examples.", href: "/solutions/quality-management-system" },
      ],
    },
    whoFor: {
      heading: { eyebrow: "Who it's for", title: "Built for teams in these situations" },
      items: [
        { icon: "Star", title: "Businesses that live on reviews", body: "Happy customers get asked for a review at the right moment, and every review gets a reply." },
        { icon: "MapPin", title: "Multi-step journeys", body: "Bookings, deliveries and visits each get feedback right after they happen." },
        { icon: "UserX", title: "Churn you cannot explain", body: "Themes across surveys, tickets and reviews show why customers leave." },
      ],
    },
    why: {
      heading: { eyebrow: "Why it matters", title: "What changes when it runs" },
      items: [
        { icon: "Target", title: "Unhappy customers get saved", body: "A same-day response to a low score turns many detractors around." },
        { icon: "Gauge", title: "Reviews compound", body: "A steady flow of fresh reviews keeps bringing in new customers." },
        { icon: "TrendingUp", title: "Decisions come from data", body: "Monthly themes point to the fixes that move satisfaction most." },
      ],
    },
    caseStudies: ["dentavanta", "jerrys"],
    process: sharedProcess("your customer journey"),
    faq: {
      heading: { eyebrow: "Customer experience questions", title: "What teams ask about CX" },
      items: [
        { q: "Which surveys do you run?", a: "CSAT, NPS, customer effort and short custom surveys, sent after calls, chats, deliveries, visits or purchases." },
        { q: "Can you manage Google reviews?", a: "We can request reviews after a positive experience and draft replies to new ones. Posting and responding happens on accounts you own." },
        { q: "How fast do unhappy customers get a response?", a: "The alert goes out the moment the score comes in. You decide who receives it and how fast they should act." },
        { q: "Do we need new software?", a: "Not necessarily. We work with the tools you have, or build a survey and feedback system for you." },
      ],
    },
    related: ["customer-support", "ecommerce-customer-support", "business-process-reengineering"],
    cta: { heading: { eyebrow: "Free audit", title: "Find where your customers drop off", body: "We map your journey and show you the three moments worth fixing first." }, primary: contact("Book your free audit") },
  },
  {
    slug: "workforce-management",
    group: "operations",
    name: "Workforce management",
    icon: "CalendarRange",
    teaser: "Volume forecast, schedules and dispatch planned around demand, with AI agents absorbing the peaks.",
    figure: "schedule",
    meta: {
      title: "Workforce management and scheduling",
      description: "Growtk forecasts your contact volume, plans schedules and dispatch around it, tracks time and coverage, and uses AI agents to absorb peaks so your team covers what matters.",
    },
    hero: {
      eyebrow: "Workforce management",
      title: "The right people on the right work, at the right time",
      body: "Overstaffed mornings, understaffed evenings and a scramble every time volume spikes. We forecast demand from your history, plan schedules and dispatch around it, and let AI agents absorb the peaks, so your people cover the work that needs them.",
      ctas: [contact()],
    },
    included: {
      heading: { eyebrow: "What's included", title: "Planning that follows demand", body: "For contact teams and field teams alike." },
      features: [
        { icon: "TrendingUp", title: "Demand forecasting", body: "Call, chat and job volume forecast by hour and day from your own history, seasonality and campaigns." },
        { icon: "CalendarCheck", title: "Scheduling and shift planning", body: "Shifts planned against the forecast, with swaps, time off and coverage gaps handled without a spreadsheet." },
        { icon: "Repeat", title: "Dispatch and job assignment", body: "Field jobs assigned by skill, location and availability, with the day rebuilt automatically when something changes." },
        { icon: "Headset", title: "AI agents on the peaks", body: "When volume beats the forecast, AI agents pick up the overflow so wait times stay flat and nobody is pulled off their real work." },
        { icon: "ClipboardCheck", title: "Time, attendance and coverage reports", body: "Hours, overtime and coverage against demand reported weekly, ready for payroll." },
        { icon: "Activity", title: "A live view of the day", body: "Volume, wait times and who is on shift in one live view, so a manager sees a gap while there is still time to fix it." },
      ],
    },
    whoFor: {
      heading: { eyebrow: "Who it's for", title: "Built for teams in these situations" },
      items: [
        { icon: "Headset", title: "Contact teams with uneven volume", body: "Shifts follow the forecast, and AI agents absorb the peaks." },
        { icon: "Truck", title: "Field service teams", body: "Jobs assigned by skill and location, with the day rebuilt when plans change." },
        { icon: "CalendarClock", title: "Shift based businesses", body: "Swaps, time off and coverage handled without a spreadsheet." },
      ],
    },
    why: {
      heading: { eyebrow: "Why it matters", title: "What changes when it runs" },
      items: [
        { icon: "Target", title: "Coverage where demand is", body: "People are scheduled for the hours that need them, not by habit." },
        { icon: "Gauge", title: "Peaks without panic", body: "Overflow goes to AI agents instead of pulling people off their real work." },
        { icon: "TrendingUp", title: "Payroll without the chase", body: "Approved hours and overtime flow straight to payroll." },
      ],
    },
    caseStudies: ["corvinn", "yetti"],
    process: sharedProcess("your team's schedule"),
    faq: {
      heading: { eyebrow: "Workforce questions", title: "What managers ask us" },
      items: [
        { q: "Does this work for field teams too?", a: "Yes. The same forecasting and scheduling applies to technicians and crews, with dispatch by skill and location. It is the same thinking behind Corvinn, our field service platform." },
        { q: "Can it plug into our payroll?", a: "Approved hours, overtime and pay rates can be exported or synced to most payroll tools." },
        { q: "How accurate is the forecast?", a: "It is built from your own history and gets better each week as real volume comes in. We review it with you at the start." },
        { q: "Do our people need new apps?", a: "Only if it helps. We prefer to work inside the scheduling and dispatch tools your team already uses." },
      ],
    },
    related: ["back-office-support", "contact-center-services", "business-process-reengineering"],
    cta: { heading: { eyebrow: "Free audit", title: "See your demand against your schedule", body: "We chart your volume against your coverage and show you where the gaps are." }, primary: contact("Book your free audit") },
  },
  {
    slug: "business-process-reengineering",
    group: "operations",
    name: "Business process reengineering",
    icon: "Workflow",
    teaser: "Your processes audited, redesigned around AI and automation, and rebuilt, so the work gets lighter as you grow.",
    figure: "connect",
    meta: {
      title: "Business process reengineering with AI",
      description: "Growtk audits how work actually moves through your business, redesigns the process around AI and automation, and builds it, measuring hours and errors before and after.",
    },
    hero: {
      eyebrow: "Business process reengineering",
      title: "Fix the process, not just the symptom",
      body: "Adding software to a broken process makes it break faster. We map how work really moves through your business, find the steps that exist only because systems do not talk, redesign the process around AI and automation, then build it and measure the difference.",
      ctas: [contact()],
    },
    included: {
      heading: { eyebrow: "What's included", title: "Diagnosis first, build second", body: "Every recommendation tied to hours, errors or revenue." },
      features: [
        { icon: "Search", title: "Process discovery", body: "Interviews, shadowing and system data to map how each process really runs today, including the workarounds." },
        { icon: "ClipboardCheck", title: "Bottleneck and waste analysis", body: "Every handoff, wait and manual copy step measured, so the biggest costs are obvious and agreed." },
        { icon: "Workflow", title: "Redesign around AI and automation", body: "A future process where AI agents and automation take the repetitive steps and people keep the judgment calls." },
        { icon: "Plug", title: "Build and connect", body: "We build the new workflow inside your tools, connect the systems and retire the workarounds." },
        { icon: "TrendingUp", title: "Before and after measurement", body: "Hours, errors and turnaround measured before and after launch, so you see what changed, not what was promised." },
        { icon: "FileText", title: "Written procedures and KPIs", body: "The new process documented step by step, with an owner for each step and the few numbers that show whether it works." },
      ],
    },
    whoFor: {
      heading: { eyebrow: "Who it's for", title: "Built for teams in these situations" },
      items: [
        { icon: "Shuffle", title: "Processes held together by workarounds", body: "Steps that exist only because systems do not talk get removed." },
        { icon: "TrendingUp", title: "Businesses outgrowing their setup", body: "Processes that worked at ten customers get rebuilt for a thousand." },
        { icon: "Bot", title: "Teams ready for AI but unsure where", body: "We find the steps where AI and automation pay off first." },
      ],
    },
    why: {
      heading: { eyebrow: "Why it matters", title: "What changes when it runs" },
      items: [
        { icon: "Target", title: "Fixing the process multiplies everything after it", body: "Automation on top of a clean process saves far more than automation on a broken one." },
        { icon: "Gauge", title: "Engineers who build what they recommend", body: "The redesign comes with a working build, not a slide deck." },
        { icon: "TrendingUp", title: "Results you can measure", body: "Hours, errors and turnaround are measured before and after." },
      ],
    },
    caseStudies: ["jerrys", "umr"],
    process: sharedProcess("your processes"),
    faq: {
      heading: { eyebrow: "Process questions", title: "What leaders ask before a redesign" },
      items: [
        { q: "Do you only advise, or also build?", a: "Both. We are engineers, so the redesign comes with the build: workflows, integrations and AI agents, inside your own tools." },
        { q: "Where do you usually start?", a: "With the process that costs the most hours or loses the most revenue. One working win builds the case for the next." },
        { q: "How long does discovery take?", a: "It depends on the process. The scope and timeline are set on the free audit call and written into the proposal." },
        { q: "What do we get at the end?", a: "A running process, documentation for your team, and a before and after report on hours, errors and turnaround." },
      ],
    },
    related: ["back-office-support", "workforce-management", "customer-experience-management"],
    cta: { heading: { eyebrow: "Free audit", title: "Pick one process to fix first", body: "We will map it with you and show you what a redesign would save." }, primary: contact("Book your free audit") },
  },
];

export const servicePageBySlug = (slug: string) => servicePages.find((s) => s.slug === slug);

/** Labels shared by every service page. */
export const servicePageLabels = {
  breadcrumb: "Services",
  related: "Related services",
  caseStudies: { eyebrow: "Case studies", title: "Built and running", body: "Real systems behind this service. Open one to click through it." } as SectionHeading,
  faqCta: { label: "Ask us anything", href: "/contact" } as Cta,
  /** How the work splits between AI agents and people. Shared by every service page. */
  models: {
    heading: {
      eyebrow: "How engagements work",
      title: "Pick how much the AI handles on its own",
      body: "Every engagement uses one of three models. Which one fits depends on how routine your requests are and how much your team wants to stay in the loop. You can move between them as trust builds.",
    } as SectionHeading,
    items: [
      {
        icon: "Bot",
        name: "AI handles it end to end",
        body: "AI agents answer, resolve and log routine requests on their own, around the clock. Anything outside the rules goes to your team with the full history attached.",
        points: ["Answers, bookings and updates done for you", "Your team sees only the escalations", "Every conversation logged to your CRM"],
        bestFor: "Best for: high volume, routine requests",
      },
      {
        icon: "Users",
        name: "AI plus your team",
        body: "AI agents take the routine work and the first reply on everything else. Your people own the complex cases, with drafts, context and next steps already prepared.",
        points: ["AI drafts, a person approves when it matters", "Clear escalation rules you set", "Weekly review of what went to a person and why"],
        bestFor: "Best for: most growing teams",
      },
      {
        icon: "UserCheck",
        name: "AI behind your people",
        body: "Your team stays on the front line. AI sits inside their tools, suggesting answers, filling in records and following up, so each person handles more without rushing.",
        points: ["Suggested answers in the conversation", "Notes and records filled in for them", "Follow ups sent without anyone remembering"],
        bestFor: "Best for: regulated or high touch work",
      },
    ],
    footnote: "Ongoing automation and AI agent engagements start at $1,200 per month, and full retainers are quoted to scope. You get a final, written quote after the free audit call.",
    cta: { label: "Book a free audit", href: "/contact" } as Cta,
  },
};
