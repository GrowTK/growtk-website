/**
 * Solutions: four systems Growtk builds for clients (and can run for them),
 * under /solutions/<slug>, plus the /solutions hub copy. These are builds,
 * not a SaaS product with a login of our own: each one is set up inside the
 * client's tools or built for them, and connected to their AI agents.
 * No user counts, ratings, percent results or certifications. Hero stats are
 * design facts about the system, never outcomes.
 *
 * Keep every string free of em dashes and en dashes.
 */
import type { Cta, Feature, FaqItem, Img, SectionHeading, Stat, Step } from "./types";

export type SolutionGroup = "cx-platforms" | "support-tools";

export type SolutionPoint = { title: string; body: string };

export type SolutionPage = {
  slug: string;
  group: SolutionGroup;
  name: string;
  icon: string;
  teaser: string;
  /** Trade palette key for this solution's colour. */
  tone: "hvac" | "plumbing" | "electrical" | "landscaping" | "cleaning" | "healthcare";
  /** Which coded product mock renders in hero and cards. */
  mock: "kb" | "helpdesk" | "qa" | "survey";
  meta: { title: string; description: string };
  /** Three stats are design facts about the system, never results. */
  hero: SectionHeading & { ctas: Cta[]; stats: [Stat, Stat, Stat] };
  /** Big scroll reveal problem statement, 30 to 45 words. */
  problem: { eyebrow: string; text: string };
  /** Six capability cards. */
  capabilities: { heading: SectionHeading; features: Feature[] };
  /** Deep feature split: heading, three points, one photo. */
  spotlight: { heading: SectionHeading; points: SolutionPoint[]; image: Img };
  /** Second split on how the system stays right: heading, three points, one photo. */
  governance: { heading: SectionHeading; points: SolutionPoint[]; image: Img };
  /** Four steps, rendered with id="how-it-works". */
  process: { heading: SectionHeading; steps: Step[] };
  /** Three "who it's for" cards, each with a short tag. */
  audience: { heading: SectionHeading; items: (Feature & { tag: string })[] };
  /** Tools it connects to. Naming a tool means we build with it, not a partnership. */
  integrations: { heading: SectionHeading; items: string[]; note: string };
  /** Off the shelf or DIY vs built and run by Growtk. */
  compare: { heading: SectionHeading; columns: [string, string]; rows: { label: string; diy: string; growtk: string }[] };
  /** What changes for the team, no numbers. */
  outcome: { heading: SectionHeading; items: SolutionPoint[]; image: Img };
  faq: { heading: SectionHeading; items: FaqItem[] };
  /** Related links: other solutions and the services they power. */
  related: { label: string; href: string }[];
  cta: { heading: SectionHeading; primary: Cta };
};

const u = (id: string) => `https://images.unsplash.com/${id}?auto=format&fit=crop&w=1400&q=80`;
const demo = (label = "Book a demo"): Cta => ({ label, href: "/contact", variant: "primary" });
const howItWorks: Cta = { label: "See how it works", href: "#how-it-works", variant: "secondary" };
const compareColumns: [string, string] = ["Off the shelf or DIY", "Built and run by Growtk"];

const builtItems = (thing: string): Feature[] => [
  { icon: "Ruler", title: "Shaped around how you work", body: `Off the shelf ${thing} tools make your team adapt to them. We build around your channels, your categories and your rules.` },
  { icon: "Plug", title: "Inside the tools you already run", body: "Connected to your CRM, helpdesk, phone line and calendar, so it adds no new tab for your team to babysit." },
  { icon: "Bot", title: "Powering your AI agents too", body: "The same system feeds the AI agents that answer your customers, so they and your people work from one source." },
  { icon: "Wrench", title: "Run for you, if you want", body: "We can keep it tuned and up to date as part of an ongoing engagement, or hand it over with documentation." },
];

export const solutions: SolutionPage[] = [
  {
    slug: "knowledge-base-system",
    group: "support-tools",
    name: "Knowledge base system",
    icon: "BookOpen",
    teaser: "A help center customers actually use, and the single source of answers for your AI and human agents.",
    tone: "electrical",
    mock: "kb",
    meta: {
      title: "Knowledge base system",
      description: "Growtk builds a searchable help center and internal knowledge base from your real tickets, the same source your AI agents answer from, with gaps flagged and articles kept current.",
    },
    hero: {
      eyebrow: "Knowledge base solution",
      title: "Answers people find before they ask",
      body: "A searchable help center for customers and a knowledge base for your team, written from your real tickets. Your AI agents answer from it too, so one update fixes the answer everywhere.",
      ctas: [demo(), howItWorks],
      stats: [
        { value: "24/7", label: "Self service for your customers" },
        { value: "1", label: "Source of answers for people and AI agents" },
        { value: "100%", label: "Of failed searches logged as gaps" },
      ],
    },
    problem: {
      eyebrow: "The problem",
      text: "Your team answers the same handful of questions every single day. Each repeat costs a reply, a wait and a bit of your best people's patience. Put the predictable answers where customers look first, and keep your people for the questions that need them.",
    },
    capabilities: {
      heading: { eyebrow: "Capabilities", title: "One library of answers, used everywhere", body: "Built from the questions your customers really ask, then kept accurate by someone who owns it." },
      features: [
        { icon: "Search", title: "Search that understands the question", body: "Typos, synonyms and plain language questions still land on the right article, ranked by what actually resolves the question." },
        { icon: "PenLine", title: "Articles written from your tickets", body: "We mine past tickets, chats and calls for the real questions, then write answers in your tone with templates and categories." },
        { icon: "Headset", title: "Agent assist built in", body: "The right article surfaces inside the helpdesk while a person is replying, so nobody has to go hunting mid conversation." },
        { icon: "Bot", title: "The source your AI agents read", body: "Your AI agents on chat, phone and messaging answer only from approved articles, and flag anything the library does not cover." },
        { icon: "Globe", title: "Several brands and languages", body: "Separate help centers per brand, product or market, each with its own look, all managed from one place." },
        { icon: "ChartNoAxesColumn", title: "Reporting on what resolves", body: "See which articles end the question, which ones send people to support anyway, and which searches found nothing." },
      ],
    },
    spotlight: {
      heading: { eyebrow: "Findability", title: "Search tuned to how customers talk", body: "A help center only works if the answer shows up on the first search. We tune it for the way your customers phrase things, not the way your team writes." },
      points: [
        { title: "Typo and synonym tolerant", body: "\"Stop my plan\" still finds the cancellation article, spelling mistakes and all." },
        { title: "Ranked by what resolves", body: "Articles that end the question rise to the top. Ones that send people to support sink." },
        { title: "Every empty search becomes a task", body: "Searches with no good answer land on a list, so the next article to write is never a guess." },
      ],
      image: { src: u("photo-1516321318423-f06f85e504b3"), alt: "Two people pointing at an article on a laptop screen" },
    },
    governance: {
      heading: { eyebrow: "Governance", title: "Answers that keep up with your business", body: "A stale article does more harm than no article. Every answer has an owner, a review date and a signal that tells us when it stops working." },
      points: [
        { title: "An owner for every article", body: "No orphan pages. Each article is versioned, owned and scheduled for review." },
        { title: "Updates tied to real changes", body: "A new price, policy or product release triggers the articles it affects." },
        { title: "Run for you, if you want", body: "We can keep the library current as part of an ongoing engagement, or hand it to your team with a playbook." },
      ],
      image: { src: u("photo-1454165804606-c3d57bc86b40"), alt: "Colleagues reviewing notes beside two open laptops" },
    },
    process: {
      heading: { eyebrow: "How it works", title: "From your tickets to a live help center", body: "We start with the questions that cost you the most and keep adding from there." },
      steps: [
        { n: 1, title: "Mine your tickets", body: "We pull the most common questions from your past tickets, chats and calls, and rank them by volume." },
        { n: 2, title: "Write and structure", body: "The top questions get answers, reviewed by your team and organized so search can find them." },
        { n: 3, title: "Launch and connect", body: "The help center goes live on your domain and connects to your website, helpdesk and AI agents." },
        { n: 4, title: "Measure and expand", body: "What resolves and what fails drives a monthly list of articles to write or fix next." },
      ],
    },
    audience: {
      heading: { eyebrow: "Who it's for", title: "Built for teams answering the same questions every day", body: "If one of these sounds like you, a knowledge base pays for itself quickly." },
      items: [
        { icon: "MessagesSquare", tag: "Fewer repeats", title: "Support teams with repeat questions", body: "The same ten questions fill the queue every week, asked a hundred different ways. A good help center answers them first." },
        { icon: "Bot", tag: "Safer AI", title: "Teams rolling out AI agents", body: "AI agents are only as good as what they read. This becomes the approved source they answer from." },
        { icon: "Users", tag: "Faster onboarding", title: "Growing teams hiring new people", body: "New hires find the right answer in seconds instead of asking the person next to them." },
      ],
    },
    integrations: {
      heading: { eyebrow: "Integrations", title: "Answers wherever your customers already are", body: "Built inside the tools you run, or alongside them. No rip and replace." },
      items: ["Zendesk", "Freshdesk", "Intercom", "HubSpot", "GoHighLevel", "Your website and app", "WhatsApp and live chat", "REST API and webhooks"],
      note: "Running something custom? If it has an API, we can connect it.",
    },
    compare: {
      heading: { eyebrow: "Built vs bought", title: "A managed knowledge base vs one you set up and forget", body: "What usually happens six months after launch." },
      columns: compareColumns,
      rows: [
        { label: "First articles", diy: "Written when someone finds the time", growtk: "Top questions mined from your tickets and written before launch" },
        { label: "Staying current", diy: "Drifts out of date within months", growtk: "Owners and review dates on every article" },
        { label: "Search", diy: "Matches keywords, misses real phrasing", growtk: "Typo tolerant and ranked by what resolves" },
        { label: "Knowing what to fix", diy: "Guesswork", growtk: "Failed searches and unhelpful articles reported every month" },
        { label: "AI agents", diy: "Read whatever is lying around", growtk: "Answer only from approved, current articles" },
      ],
    },
    outcome: {
      heading: { eyebrow: "The outcome", title: "Fewer repeat tickets. Faster replies. Customers who help themselves.", body: "Self service is the cheapest channel you will ever run, and the one many customers prefer." },
      items: [
        { title: "Routine questions answered on their own", body: "Customers find the answer at any hour, without waiting in a queue." },
        { title: "Replies without the hunt", body: "Your team and your AI agents pull the same approved answer in seconds." },
        { title: "New hires up to speed sooner", body: "A living library is the best training manual your team will ever have." },
      ],
      image: { src: u("photo-1521737604893-d14cc237f11d"), alt: "A team working together on laptops around a shared table" },
    },
    faq: {
      heading: { eyebrow: "Knowledge base questions", title: "What teams ask before they build one" },
      items: [
        { q: "Can it live on our own domain?", a: "Yes. The help center runs on your domain and in your brand, as part of your existing site or alongside it." },
        { q: "Do you write the articles?", a: "Yes. We draft them from your tickets and documentation, and your team reviews them before they go live." },
        { q: "Can we keep our existing help center tool?", a: "Yes. If you already use a helpdesk with a knowledge base, we build inside it instead of replacing it." },
        { q: "How do the AI agents use it?", a: "They answer only from approved articles and connected systems, and flag any question the knowledge base does not cover yet." },
        { q: "What is a knowledge base system?", a: "Software that stores and organizes answers so people can find them without asking someone: help articles, FAQs, troubleshooting guides and internal procedures in one searchable place." },
        { q: "What is the difference between an internal and an external knowledge base?", a: "An external one is the public help center your customers search. An internal one holds procedures and notes for your team. We usually build one library that serves both, so customers, staff and AI agents see the same answer." },
      ],
    },
    related: [
      { label: "Helpdesk system", href: "/solutions/help-desk-software" },
      { label: "Customer support", href: "/services/customer-support" },
      { label: "Technical support", href: "/services/technical-support" },
    ],
    cta: { heading: { eyebrow: "Book a demo", title: "See your top questions answered on their own", body: "Send us a sample of your tickets and we will show you what the first version of your help center would cover." }, primary: demo() },
  },
  {
    slug: "help-desk-software",
    group: "cx-platforms",
    name: "Helpdesk system",
    icon: "LifeBuoy",
    teaser: "One queue for every call, chat, email and message, routed, tracked and resolved.",
    tone: "plumbing",
    mock: "helpdesk",
    meta: {
      title: "Helpdesk system",
      description: "Growtk builds a helpdesk that puts every call, chat, email and message in one queue, routes tickets by topic and priority, tracks response targets and lets AI draft replies.",
    },
    hero: {
      eyebrow: "Ticketing solution",
      title: "Every request in one queue, nothing slipping through",
      body: "Calls, chats, emails and messages become tickets, routed to the right person or AI agent and tracked against a response target. Customers stay in the loop until it is closed.",
      ctas: [demo(), howItWorks],
      stats: [
        { value: "1", label: "Queue for every channel" },
        { value: "24/7", label: "Intake on calls, chat, email and messages" },
        { value: "100%", label: "Of tickets tracked against a target" },
      ],
    },
    problem: {
      eyebrow: "The problem",
      text: "When requests live in five inboxes, some get answered twice and some never. Customers repeat themselves, nobody knows what is late, and the loudest ticket wins. A helpdesk puts every request in one place with an owner and a clock.",
    },
    capabilities: {
      heading: { eyebrow: "Capabilities", title: "A helpdesk that runs the queue for you", body: "Intake, routing, targets and drafts handled, so your team just resolves." },
      features: [
        { icon: "Inbox", title: "Every channel in one queue", body: "Phone, chat, email, WhatsApp and social messages land as tickets in one place, with the customer's history attached." },
        { icon: "Route", title: "Routing by topic and priority", body: "Tickets are tagged and sent to the right queue, person or AI agent automatically, based on rules you set." },
        { icon: "Timer", title: "Response targets that are tracked", body: "Each ticket carries a response and resolution target, and anything at risk is escalated before it is late." },
        { icon: "Sparkles", title: "AI drafts, people approve", body: "AI drafts a reply from your knowledge base for every ticket, and your team sends, edits or rewrites it." },
        { icon: "Workflow", title: "Macros and workflows", body: "Common replies, refunds and follow-ups run as one click actions or fully automatic workflows." },
        { icon: "ChartNoAxesColumn", title: "Live reporting on the queue", body: "Volume, response times, backlog and satisfaction by channel, team and topic, live and in a weekly summary." },
      ],
    },
    spotlight: {
      heading: { eyebrow: "Intake and routing", title: "The right ticket to the right owner, the first time", body: "Customers should not be passed around. Every request arrives with context and goes straight to whoever can solve it." },
      points: [
        { title: "Every channel, one thread", body: "A customer who calls, then emails, then messages sees one conversation, not three tickets." },
        { title: "Routing by skill and priority", body: "Rules by topic, customer value and channel, load balanced across the team, with AI agents taking the routine ones first." },
        { title: "Context on arrival", body: "Order history, past tickets and account details attached before anyone opens the ticket." },
      ],
      image: { src: u("photo-1587560699334-cc4ff634909a"), alt: "A laptop on an office desk next to a desk phone" },
    },
    governance: {
      heading: { eyebrow: "Escalations", title: "Problems surfaced before they become late", body: "Urgent and at risk tickets raise their hand on their own, with everything a senior person needs to step in fast." },
      points: [
        { title: "Alerts before a target is missed", body: "Timers warn the owner, then the team lead, before a promise is broken." },
        { title: "Escalation paths you define", body: "Who gets what, when, and how: to your team, your on call person or your engineers." },
        { title: "Full history on every handoff", body: "Nobody has to ask the customer to start again." },
      ],
      image: { src: u("photo-1525182008055-f88b95ff7980"), alt: "A support specialist on a phone call at a desk with two monitors" },
    },
    process: {
      heading: { eyebrow: "How it works", title: "From scattered inboxes to a working queue", body: "Live one channel at a time, so nothing breaks on the way." },
      steps: [
        { n: 1, title: "Map your requests", body: "We list your channels, request types and who handles what today." },
        { n: 2, title: "Design and migrate", body: "Queues, routing rules, priorities and targets are agreed with your team, and open tickets move over." },
        { n: 3, title: "Connect and launch", body: "Channels are connected and the queue goes live, one channel at a time, with your team trained on it." },
        { n: 4, title: "Tune every week", body: "We adjust rules, macros and drafts as we see where tickets wait." },
      ],
    },
    audience: {
      heading: { eyebrow: "Who it's for", title: "Built for teams outgrowing a shared inbox", body: "Most helpdesk builds start from one of these." },
      items: [
        { icon: "Mail", tag: "Graduate from inboxes", title: "Teams working from a shared inbox", body: "Emails get answered twice or not at all. Tickets with owners fix both." },
        { icon: "MessagesSquare", tag: "Unify channels", title: "Support across many channels", body: "Phone, chat and social each had their own place. Now they share one queue and one history." },
        { icon: "Wrench", tag: "Route and escalate", title: "Technical and IT helpdesks", body: "Tier 1 fixes stay fast, and complex issues reach the right engineer with the details already written down." },
      ],
    },
    integrations: {
      heading: { eyebrow: "Integrations", title: "Works with the stack you already run", body: "We build inside your current helpdesk when it can do the job, and new only when it cannot." },
      items: ["Zendesk", "Freshdesk", "HubSpot", "Salesforce", "GoHighLevel", "Slack", "Twilio and WhatsApp", "REST API and webhooks"],
      note: "Using a CRM or phone system that is not listed? Ask us how we would connect it.",
    },
    compare: {
      heading: { eyebrow: "Built vs bought", title: "A working operation vs another software login", body: "A license gives you a tool. You still have to make it run." },
      columns: compareColumns,
      rows: [
        { label: "Setup", diy: "Default settings nobody changes", growtk: "Queues, rules and targets designed around your requests" },
        { label: "Routing", diy: "Someone sorts the inbox by hand", growtk: "Automatic by topic, priority and skill" },
        { label: "Late tickets", diy: "Noticed when the customer complains", growtk: "Timers and escalations before the target is missed" },
        { label: "Replies", diy: "Typed from scratch", growtk: "AI drafts from your knowledge base, approved by people" },
        { label: "Improvement", diy: "Whenever someone has a spare afternoon", growtk: "Rules and macros tuned every week" },
      ],
    },
    outcome: {
      heading: { eyebrow: "The outcome", title: "Every request owned, tracked and closed", body: "A queue you can see, instead of an inbox you hope about." },
      items: [
        { title: "No lost requests", body: "Every call, chat and email has a ticket, an owner and a target." },
        { title: "Customers kept in the loop", body: "Status updates go out by email or text without anyone remembering to send them." },
        { title: "Decisions from real data", body: "You know which topics, channels and hours create the most work." },
      ],
      image: { src: u("photo-1600880292203-757bb62b4baf"), alt: "Two colleagues sharing a high five across a desk with a laptop" },
    },
    faq: {
      heading: { eyebrow: "Helpdesk questions", title: "What teams ask before switching" },
      items: [
        { q: "Do we have to leave our current helpdesk?", a: "No. If yours can do the job, we set up routing, targets and AI drafts inside it. We build new only when it cannot." },
        { q: "Can phone calls become tickets?", a: "Yes. Calls are logged with a summary and recording link, and follow-ups are tracked like any other ticket." },
        { q: "How do AI drafts work?", a: "Each ticket gets a suggested reply from your knowledge base. Your team sends it as is, edits it, or writes their own." },
        { q: "Can customers see their ticket status?", a: "Yes. Customers get updates by email or text, and can reply on the same thread." },
        { q: "What is a help desk system?", a: "Software that turns every customer request into a ticket with an owner, a priority and a status, so requests are tracked from first contact to resolution instead of living in personal inboxes." },
        { q: "What is the difference between a help desk and a service desk?", a: "A help desk focuses on solving requests and problems as they come in. A service desk is broader and also manages planned work like access requests and changes. Many businesses need help desk features first, and we build what fits." },
      ],
    },
    related: [
      { label: "Knowledge base system", href: "/solutions/knowledge-base-system" },
      { label: "Customer support", href: "/services/customer-support" },
      { label: "Inbound contact center", href: "/services/inbound-contact-center" },
    ],
    cta: { heading: { eyebrow: "Book a demo", title: "See your channels in one queue", body: "We will map your current requests and show you how the queue would run." }, primary: demo() },
  },
  {
    slug: "quality-management-system",
    group: "support-tools",
    name: "Quality management system",
    icon: "ClipboardCheck",
    teaser: "Every call and chat scored against your standards, with coaching where it counts.",
    tone: "landscaping",
    mock: "qa",
    meta: {
      title: "Quality management system",
      description: "Growtk builds a quality management system that scores every call and chat against your scorecard with AI, flags conversations for coaching and reports trends by agent, topic and channel.",
    },
    hero: {
      eyebrow: "Quality assurance solution",
      title: "Every conversation scored, not one in fifty",
      body: "AI reviews every call and chat, human and AI agent alike, against your own scorecard. The ones that need attention go to a coaching queue, and trends show up before they become complaints.",
      ctas: [demo(), howItWorks],
      stats: [
        { value: "100%", label: "Of conversations scored" },
        { value: "1", label: "Scorecard for people and AI agents" },
        { value: "Instant", label: "Flags on serious mistakes" },
      ],
    },
    problem: {
      eyebrow: "The problem",
      text: "Most teams review a tiny sample of conversations, by hand, weeks after they happened. The mistakes that cost you customers hide in the rest. Score every conversation the same way, and spend coaching time only where it changes something.",
    },
    capabilities: {
      heading: { eyebrow: "Capabilities", title: "Everything a QA team needs in one system", body: "Full coverage, consistent scoring and coaching that follows through." },
      features: [
        { icon: "ScanSearch", title: "AI scoring on every conversation", body: "Calls are transcribed and every call and chat is scored against your scorecard, the same way every time." },
        { icon: "TriangleAlert", title: "Serious mistake detection", body: "Missed disclosures, wrong promises or rude moments are flagged straight away, with the exact quote." },
        { icon: "ListChecks", title: "Scorecards built around your standards", body: "Greeting, accuracy, compliance, empathy and resolution, weighted the way your business needs." },
        { icon: "GraduationCap", title: "Coaching triggered automatically", body: "Low scores open a coaching task with the example attached, and follow-up is tracked." },
        { icon: "History", title: "Overrides and calibration log", body: "Reviewers can correct any AI score, and every change is recorded so scoring stays fair." },
        { icon: "Bot", title: "AI agents held to the same bar", body: "Your AI agents are scored on the same scorecard as your people, so you know they meet your standards." },
      ],
    },
    spotlight: {
      heading: { eyebrow: "Evaluation", title: "Scorecards your team actually trusts", body: "Scores only work if people believe them. We build the scorecard with your team and calibrate the AI against your best reviewers before anyone relies on it." },
      points: [
        { title: "Every channel, one standard", body: "Calls, chats, emails and messages scored on the same criteria." },
        { title: "Weighted to your rubric", body: "What matters most counts most, from compliance wording to tone." },
        { title: "A person can always override", body: "Reviewers adjust any score, and the change and the reason are logged." },
      ],
      image: { src: u("photo-1551288049-bebda4e38f71"), alt: "A laptop showing charts and metrics on an analytics dashboard" },
    },
    governance: {
      heading: { eyebrow: "Coaching", title: "Where a low score becomes a better conversation", body: "A score that changes nothing is just a number. Flagged conversations turn into coaching with real examples, and we check that it worked." },
      points: [
        { title: "Closed coaching loops", body: "Each flag becomes a coaching task with an owner, notes and a follow-up check." },
        { title: "Trends tied to topics", body: "See which topics, channels and shifts slip, so you fix causes, not people." },
        { title: "Calibration sessions", body: "Regular checks between AI scores and your reviewers keep the bar consistent." },
      ],
      image: { src: u("photo-1557804506-669a67965ba0"), alt: "A team meeting around a whiteboard covered in sticky notes" },
    },
    process: {
      heading: { eyebrow: "How it works", title: "From conversation to coaching in four steps", body: "Scoring runs as conversations close, and review happens where it matters." },
      steps: [
        { n: 1, title: "Define the scorecard", body: "We turn your standards into clear, weighted criteria with your team." },
        { n: 2, title: "Connect and score", body: "Calls and chats flow in from your phone system and helpdesk, and AI scores each one." },
        { n: 3, title: "Calibrate and review", body: "AI scores are checked against your reviewers until they agree, then spot checked from there." },
        { n: 4, title: "Coach and improve", body: "Flagged conversations feed coaching tasks, and trends are reviewed every week." },
      ],
    },
    audience: {
      heading: { eyebrow: "Who it's for", title: "Built for teams that live on consistency", body: "If how every conversation goes matters to you, this is for you." },
      items: [
        { icon: "Headset", tag: "Standardize quality", title: "Growing contact centers", body: "Know how every conversation went, not just the few someone had time to review." },
        { icon: "ShieldCheck", tag: "Check compliance", title: "Regulated and compliance heavy work", body: "Required disclosures and wording checked on every call, with exceptions flagged the same day." },
        { icon: "Bot", tag: "Audit AI agents", title: "Teams running AI agents", body: "Check that your AI agents stay accurate, on brand and inside your rules." },
      ],
    },
    integrations: {
      heading: { eyebrow: "Integrations", title: "Plugs into your contact stack", body: "Conversations come in from the tools you already record them in." },
      items: ["Twilio", "Vapi", "Retell", "Zendesk", "Freshdesk", "HubSpot", "Google Sheets", "REST API and webhooks"],
      note: "Recordings somewhere else? If we can export them, we can score them.",
    },
    compare: {
      heading: { eyebrow: "Built vs bought", title: "Scoring every conversation vs occasional spot checks", body: "What a small manual sample misses." },
      columns: compareColumns,
      rows: [
        { label: "Coverage", diy: "A handful of conversations a week", growtk: "Every call and chat" },
        { label: "Consistency", diy: "Depends on who reviews", growtk: "One calibrated scorecard, applied the same way" },
        { label: "Speed", diy: "Mistakes found weeks later", growtk: "Serious mistakes flagged the same day" },
        { label: "Coaching", diy: "Notes in a spreadsheet", growtk: "Coaching tasks with examples and follow-up" },
        { label: "AI agents", diy: "Rarely reviewed at all", growtk: "Scored on the same bar as your people" },
      ],
    },
    outcome: {
      heading: { eyebrow: "The outcome", title: "Consistency your customers can feel", body: "Quality stops being a guess and becomes something you manage." },
      items: [
        { title: "Compliance without the worry", body: "Required wording checked on every call, not hoped for." },
        { title: "Coaching that sticks", body: "Time goes to the conversations and people where it changes the most." },
        { title: "Problems caught early", body: "Slipping topics and scripts show up in the trend before they show up in reviews." },
      ],
      image: { src: u("photo-1556761175-b413da4baf72"), alt: "A team talking together at their desks in a bright open office" },
    },
    faq: {
      heading: { eyebrow: "Quality questions", title: "What managers ask about AI scoring" },
      items: [
        { q: "How accurate is AI scoring?", a: "We calibrate it against your own reviewers before relying on it, and keep checking a sample by hand afterwards." },
        { q: "Can it score phone calls?", a: "Yes. Calls are transcribed and scored like chats, with timestamps so reviewers can jump to the moment that matters." },
        { q: "Will agents see their scores?", a: "If you want them to. Many teams share scores and flagged examples as part of regular coaching." },
        { q: "Where is the data kept?", a: "In your own systems wherever possible, with access limited by role and every review logged." },
        { q: "What is a quality management system in customer service?", a: "A system for checking how conversations are handled against a set standard, scoring them, and turning the results into coaching and process fixes." },
        { q: "What goes on a QA scorecard?", a: "Usually greeting and identification, accuracy of the answer, required disclosures, tone and empathy, and whether the issue was resolved. Each item is weighted by how much it matters to your business." },
      ],
    },
    related: [
      { label: "Survey software", href: "/solutions/survey-software" },
      { label: "Contact center services", href: "/services/contact-center-services" },
      { label: "Customer experience management", href: "/services/customer-experience-management" },
    ],
    cta: { heading: { eyebrow: "Book a demo", title: "See every conversation scored", body: "Send us a few recordings or chats and we will show you what the scorecard finds." }, primary: demo() },
  },
  {
    slug: "survey-software",
    group: "cx-platforms",
    name: "Survey software",
    icon: "MessageSquareHeart",
    teaser: "CSAT, NPS and post-contact surveys at every touchpoint, with low scores routed to a person.",
    tone: "healthcare",
    mock: "survey",
    meta: {
      title: "Survey software",
      description: "Growtk builds survey systems that send CSAT, NPS and post-contact surveys by text, email or chat at the right moment, route low scores to a person and roll results up into decisions.",
    },
    hero: {
      eyebrow: "Voice of the customer solution",
      title: "Hear from customers while it still matters",
      body: "Short surveys sent by text, email or chat right after a call, delivery, visit or purchase. Low scores reach a person the same day, and the patterns turn into fixes.",
      ctas: [demo(), howItWorks],
      stats: [
        { value: "4", label: "Channels: text, email, chat and WhatsApp" },
        { value: "Instant", label: "Alert to a manager on a low score" },
        { value: "1", label: "Place for every score and comment" },
      ],
    },
    problem: {
      eyebrow: "The problem",
      text: "Most feedback is collected too late, sits in a dashboard nobody opens, and never reaches the customer who was unhappy. Ask at the right moment, reach the unhappy ones the same day, and turn what people say into the next fix.",
    },
    capabilities: {
      heading: { eyebrow: "Capabilities", title: "Feedback from every touchpoint, in one place", body: "Asked at the right moment, acted on the same day." },
      features: [
        { icon: "Gauge", title: "CSAT, NPS and effort surveys", body: "Short, branded surveys for the moment you want to measure, from a single question to a short form." },
        { icon: "CalendarClock", title: "Sent after real events", body: "Triggered by a closed ticket, a finished call, a delivery or a visit, on the channel the customer used." },
        { icon: "MonitorSmartphone", title: "On your website and app", body: "Quick in page feedback on key pages and steps, without sending anyone away." },
        { icon: "BellRing", title: "Low scores alert a person", body: "A poor score or angry comment reaches the right manager straight away, so the customer hears back the same day." },
        { icon: "Star", title: "Happy customers asked for a review", body: "Customers who score you highly can be invited to leave a public review while the experience is fresh." },
        { icon: "Sparkles", title: "Themes found by AI", body: "Comments grouped into themes, trended over time and tied to the touchpoints that caused them." },
      ],
    },
    spotlight: {
      heading: { eyebrow: "Capture", title: "The right question at the right moment on the right channel", body: "Response rates depend on timing and ease. Surveys go out right after the moment you care about, take seconds to answer, and never pile up." },
      points: [
        { title: "Every channel covered", body: "Text, email, live chat and WhatsApp, usually the one the customer just used." },
        { title: "Limits on how often people are asked", body: "Customers are surveyed once per interaction and spaced out, so nobody feels pestered." },
        { title: "Your brand, your words", body: "Surveys look and sound like you, not like a third party form." },
      ],
      image: { src: u("photo-1563986768609-322da13575f3"), alt: "A person holding a phone with a chat open beside a laptop" },
    },
    governance: {
      heading: { eyebrow: "Close the loop", title: "From an unhappy customer to a saved relationship", body: "Most surveys end at a dashboard. Ours start a follow-up: every unhappy customer gets a person, and every fix gets tracked." },
      points: [
        { title: "Alerts on low scores", body: "The right manager hears about it within minutes, with the full conversation attached." },
        { title: "Follow-up tasks with owners", body: "Each recovery has an owner and a due date, tracked until it is closed." },
        { title: "Root causes, not just scores", body: "Themes point to the step in the journey that caused the problem, so it gets fixed for everyone." },
      ],
      image: { src: u("photo-1531482615713-2afd69097998"), alt: "Two colleagues at a computer, one on a phone call" },
    },
    process: {
      heading: { eyebrow: "How it works", title: "From first question to closed loop", body: "Start with three touchpoints, then add more once the first ones run clean." },
      steps: [
        { n: 1, title: "Design the program", body: "We choose the touchpoints worth measuring and the questions to ask at each one." },
        { n: 2, title: "Deploy everywhere", body: "Surveys are branded and wired to the events that trigger them, on every channel you use." },
        { n: 3, title: "Close the loop", body: "Low scores start reaching the right people, with follow-up tracked to the end." },
        { n: 4, title: "Report and prioritize", body: "Monthly themes turn into fixes, and we track whether scores move after each one." },
      ],
    },
    audience: {
      heading: { eyebrow: "Who it's for", title: "Built for teams that want feedback to drive action", body: "Feedback is only worth collecting if something happens next." },
      items: [
        { icon: "Headset", tag: "Act on feedback", title: "Support and CX leaders", body: "Satisfaction measured after every conversation, with unhappy customers reached the same day." },
        { icon: "Repeat", tag: "Keep customers", title: "Growth and retention teams", body: "Spot customers at risk early and find out what keeps the happy ones coming back." },
        { icon: "HeartPulse", tag: "Win reviews", title: "Service and appointment businesses", body: "A quick check after every visit, and review requests for the customers who loved it." },
      ],
    },
    integrations: {
      heading: { eyebrow: "Integrations", title: "Feeds the tools you already use", body: "Scores land on the customer record, and alerts land where your team already works." },
      items: ["HubSpot", "Salesforce", "GoHighLevel", "Zendesk", "Twilio and SMS", "WhatsApp", "Slack alerts", "REST API and webhooks"],
      note: "Want results in your own reports? Ask us how we would send them there.",
    },
    compare: {
      heading: { eyebrow: "Built vs bought", title: "A listening program vs an online survey tool", body: "Collecting answers is the easy part." },
      columns: compareColumns,
      rows: [
        { label: "Timing", diy: "A blast once a quarter", growtk: "Sent right after the moment that matters" },
        { label: "Unhappy customers", diy: "Read in a report weeks later", growtk: "A person reaches out the same day" },
        { label: "Comments", diy: "Hundreds of lines nobody reads", growtk: "Grouped into themes and tied to touchpoints" },
        { label: "Where results live", diy: "In a separate tool", growtk: "On the customer record in your CRM or helpdesk" },
        { label: "What happens next", diy: "Often nothing", growtk: "A monthly list of fixes, tracked to see if scores move" },
      ],
    },
    outcome: {
      heading: { eyebrow: "The outcome", title: "Know exactly what to fix next", body: "Feedback that leads to a phone call, a fix and a better score." },
      items: [
        { title: "Unhappy customers heard in time", body: "Problems get a personal response while there is still time to save the relationship." },
        { title: "Priorities backed by evidence", body: "You fix what customers mention most, not what the loudest person in the room thinks." },
        { title: "Honest tracking of progress", body: "Scores by touchpoint over time show whether a fix actually worked." },
      ],
      image: { src: u("photo-1460925895917-afdab827c52f"), alt: "A laptop on a desk showing an analytics dashboard with charts" },
    },
    faq: {
      heading: { eyebrow: "Survey questions", title: "What teams ask about surveys" },
      items: [
        { q: "Which channels can surveys go out on?", a: "Text, email, live chat and WhatsApp, usually the same channel the customer used to reach you." },
        { q: "Will customers find it annoying?", a: "Surveys are short, sent once per interaction and spaced out, so customers are not asked too often." },
        { q: "Can it ask for Google reviews?", a: "Yes. Customers who score you highly can be invited to leave a review on your own Google profile." },
        { q: "Where do results show up?", a: "In a dashboard and a weekly summary, and on the customer record in your CRM or helpdesk." },
        { q: "What is the difference between CSAT and NPS?", a: "CSAT asks how satisfied someone was with a specific interaction. NPS asks how likely they are to recommend you overall. CSAT tells you about moments, NPS about the relationship." },
        { q: "What is closed loop feedback?", a: "It means every piece of feedback leads somewhere: unhappy customers get a personal follow-up, and recurring themes become fixes that are tracked until they are done." },
      ],
    },
    related: [
      { label: "Quality management system", href: "/solutions/quality-management-system" },
      { label: "Customer experience management", href: "/services/customer-experience-management" },
      { label: "Customer support", href: "/services/customer-support" },
    ],
    cta: { heading: { eyebrow: "Book a demo", title: "Start hearing from every customer", body: "We will pick your first three touchpoints with you and show you the surveys and alerts." }, primary: demo() },
  },
];

export const solutionBySlug = (slug: string) => solutions.find((s) => s.slug === slug);

/** The /solutions hub and labels shared by every solution page. */
export const solutionsHub = {
  meta: {
    title: "Solutions",
    description: "Four systems Growtk builds into your customer operations: a knowledge base, a helpdesk, a quality management system and survey software, connected to your tools and your AI agents.",
  },
  hero: {
    eyebrow: "Our solutions",
    title: "Systems that make every answer better",
    body: "A knowledge base, a helpdesk, quality scoring and surveys, built around your channels and your CRM and wired into your AI agents. Use one, or let us build and run all four.",
    ctas: [
      { label: "Book a demo", href: "/contact", variant: "primary" },
      { label: "Technology", href: "/technology", variant: "secondary" },
    ] as Cta[],
  },
  /** Every channel the four systems cover. */
  channels: {
    heading: {
      eyebrow: "Every channel covered",
      title: "One system behind every way customers reach you",
      body: "Whichever door a customer walks through, the same answers, the same queue, the same scorecard and the same follow up sit behind it.",
    } as SectionHeading,
    items: [
      { icon: "Phone", title: "Voice", body: "AI voice agents answer and call out, read from the knowledge base, and log every call as a ticket." },
      { icon: "MessageCircle", title: "SMS and WhatsApp", body: "Updates, reminders, surveys and two way support by text, in the apps customers already use." },
      { icon: "MessagesSquare", title: "Chat and email", body: "Website chat and inbox replies drafted from approved answers, with a person on anything sensitive." },
      { icon: "AtSign", title: "Social messages", body: "Instagram and Facebook messages land in the same queue, with the same targets as every other channel." },
    ] as Feature[],
  },
  /** Chips shown on each hub card, keyed by slug. */
  cardPoints: {
    "knowledge-base-system": ["Self service", "Agent assist", "AI source of truth"],
    "help-desk-software": ["One queue", "Routing", "Response targets"],
    "quality-management-system": ["Scorecards", "Every conversation", "Coaching"],
    "survey-software": ["CSAT and NPS", "Every touchpoint", "Same day alerts"],
  } as Record<string, string[]>,
  groups: [
    { id: "cx-platforms" as SolutionGroup, eyebrow: "Customer experience platforms", title: "Where requests and feedback live", body: "One queue for every call, chat and email, and a short survey at every touchpoint, so nothing slips and every customer is heard." },
    { id: "support-tools" as SolutionGroup, eyebrow: "Intelligent support tools", title: "Tools that keep every answer right", body: "One source of truth your people and AI agents answer from, and quality reviewed on every conversation, not a random handful." },
  ],
  built: { heading: { eyebrow: "Why we build them", title: "Built for you, not bought off the shelf" } as SectionHeading, items: builtItems("software") },
  faq: {
    heading: { eyebrow: "Before you book", title: "What teams ask about our solutions" } as SectionHeading,
    items: [
      { q: "Are these products we subscribe to?", a: "No. They are systems we build for you, inside the tools you already run or as new builds you own. We can also run them for you." },
      { q: "Can we start with one?", a: "Yes. Most teams start with the helpdesk or the knowledge base, since both make every other system better." },
      { q: "Do they work with AI agents?", a: "Yes. They are built to feed your AI agents and to score them, so AI and people work from the same answers and standards." },
      { q: "What does a build cost?", a: "It depends on scope. Book a demo and we will give you a written proposal with a real number." },
    ] as FaqItem[],
    cta: { label: "Book a demo", href: "/contact" } as Cta,
  },
  cta: {
    heading: { eyebrow: "Book a demo", title: "See which system would help most first", body: "Thirty minutes. We look at your channels and tools and show you where to start." } as SectionHeading,
    primary: { label: "Book a demo", href: "/contact" } as Cta,
  },
  labels: { breadcrumb: "Solutions", related: "Related", explore: "Explore solution", faqCta: { label: "Ask us anything", href: "/contact" } as Cta },
};
