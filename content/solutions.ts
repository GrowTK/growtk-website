/**
 * Solutions: four systems Growtk builds for clients (and can run for them),
 * under /solutions/<slug>, plus the /solutions hub copy. These are builds,
 * not a SaaS product with a login of our own: each one is set up inside the
 * client's tools or built for them. No user counts, ratings or stats.
 *
 * Keep every string free of em dashes and en dashes.
 */
import type { Cta, Feature, FaqItem, Img, SectionHeading, Step } from "./types";

export type SolutionGroup = "cx-platforms" | "support-tools";

export type SolutionPage = {
  slug: string;
  group: SolutionGroup;
  name: string;
  icon: string;
  teaser: string;
  /** Hairline figure in the hero: site, estimate, schedule, voice, connect or rank. */
  figure: "site" | "estimate" | "schedule" | "voice" | "connect" | "rank";
  /** Trade palette key for this solution's colour. */
  tone: "hvac" | "plumbing" | "electrical" | "landscaping" | "cleaning" | "healthcare";
  meta: { title: string; description: string };
  hero: SectionHeading & { ctas: Cta[] };
  capabilities: { heading: SectionHeading; features: Feature[] };
  deepDives: { heading: SectionHeading; rows: { title: string; body: string; image: Img; bullets: string[] }[] };
  audience: { heading: SectionHeading; items: Feature[] };
  built: { heading: SectionHeading; items: Feature[] };
  process: { heading: SectionHeading; steps: Step[] };
  faq: { heading: SectionHeading; items: FaqItem[] };
  /** Related links: other solutions and the services they power. */
  related: { label: string; href: string }[];
  cta: { heading: SectionHeading; primary: Cta };
};

const u = (id: string) => `https://images.unsplash.com/${id}?auto=format&fit=crop&w=1400&q=80`;
const demo = (label = "Book a demo"): Cta => ({ label, href: "/contact", variant: "primary" });

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
    figure: "site",
    tone: "electrical",
    meta: {
      title: "Knowledge base system",
      description: "Growtk builds a searchable help center and internal knowledge base from your real tickets, the same source your AI agents answer from, with gaps flagged as they appear.",
    },
    hero: {
      eyebrow: "Knowledge base solution",
      title: "Answers people find before they ask",
      body: "A searchable help center for customers and a knowledge base for your team, written from your real tickets. Your AI agents answer from it too, so one update fixes the answer everywhere.",
      ctas: [demo()],
    },
    capabilities: {
      heading: { eyebrow: "Capabilities", title: "Everything a knowledge base should do", body: "Built from your own questions, not a blank template." },
      features: [
        { icon: "Search", title: "Search that understands the question", body: "Typos, synonyms and plain language questions still find the right article, and searches with no result are logged so the gap gets filled." },
        { icon: "ClipboardCheck", title: "Articles written from your tickets", body: "We mine your past tickets and chats for the questions people really ask, then write and structure the answers to match." },
        { icon: "Headset", title: "Agent assist built in", body: "The same answers surface inside the helpdesk while a person is replying, and power what your AI agents say on every channel." },
        { icon: "Globe", title: "Multiple brands and languages", body: "One system can serve several brands, products or languages, each with its own look and its own set of articles." },
        { icon: "TrendingUp", title: "Reporting on what deflects", body: "See which articles resolve questions, which ones send people to support anyway, and what to write next." },
      ],
    },
    deepDives: {
      heading: { eyebrow: "Under the hood", title: "Findable answers that stay current" },
      rows: [
        {
          title: "Findability",
          body: "A knowledge base only helps if people find the answer in one search. We tune search for how your customers phrase things, not how your team writes.",
          image: { src: u("photo-1516321318423-f06f85e504b3"), alt: "Two people pointing at an article on a laptop screen" },
          bullets: ["Typo and synonym tolerant search", "Results ranked by what resolves questions", "A report of every search that found nothing"],
        },
        {
          title: "Governance",
          body: "Answers go stale when nobody owns them. Every article has an owner and a review date, and product changes trigger the updates they affect.",
          image: { src: u("photo-1454165804606-c3d57bc86b40"), alt: "Colleagues reviewing notes beside two open laptops" },
          bullets: ["An owner and review cycle per article", "Updates linked to product and policy changes", "Change history on every article"],
        },
      ],
    },
    audience: {
      heading: { eyebrow: "Who it's for", title: "Built for teams answering the same questions every day" },
      items: [
        { icon: "MessagesSquare", title: "Support teams with repeat questions", body: "The same ten questions fill the queue every week. A good help center answers them first." },
        { icon: "Bot", title: "Teams rolling out AI agents", body: "AI agents are only as good as what they read. This becomes the source they answer from." },
        { icon: "Users", title: "Growing teams onboarding new people", body: "New hires find the right answer in seconds instead of asking the person next to them." },
      ],
    },
    built: { heading: { eyebrow: "Why we build it", title: "Built for you, not bought off the shelf" }, items: builtItems("knowledge base") },
    process: {
      heading: { eyebrow: "How it works", title: "From your tickets to a live help center" },
      steps: [
        { n: 1, title: "Mine your tickets", body: "We pull the most common questions from your past tickets, chats and calls." },
        { n: 2, title: "Write and structure", body: "Articles are written, organized and reviewed with your team." },
        { n: 3, title: "Launch and connect", body: "The help center goes live and connects to your helpdesk and AI agents." },
        { n: 4, title: "Measure and expand", body: "We track what resolves and what does not, and keep adding answers." },
      ],
    },
    faq: {
      heading: { eyebrow: "Knowledge base questions", title: "What teams ask before they build one" },
      items: [
        { q: "Can it live on our own domain?", a: "Yes. The help center runs on your domain and in your brand, as part of your existing site or alongside it." },
        { q: "Do you write the articles?", a: "Yes. We draft them from your tickets and documentation, and your team reviews them before they go live." },
        { q: "Can we use our existing help center tool?", a: "Yes. If you already use a helpdesk with a knowledge base, we can build inside it instead of replacing it." },
        { q: "How do the AI agents use it?", a: "They answer only from approved articles and connected systems, and flag any question the knowledge base does not cover yet." },
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
    figure: "connect",
    tone: "plumbing",
    meta: {
      title: "Helpdesk system",
      description: "Growtk builds a helpdesk that puts every call, chat, email and message in one queue, routes tickets by topic and priority, tracks response targets and lets AI draft replies.",
    },
    hero: {
      eyebrow: "Ticketing solution",
      title: "Every request in one queue, nothing slipping through",
      body: "Calls, chats, emails and messages become tickets, routed to the right person or AI agent, tracked against a response target and closed with the customer kept in the loop.",
      ctas: [demo()],
    },
    capabilities: {
      heading: { eyebrow: "Capabilities", title: "A helpdesk that runs the queue for you", body: "Routing, targets and drafts handled, so your team just resolves." },
      features: [
        { icon: "Plug", title: "Every channel in one queue", body: "Phone, chat, email, WhatsApp and social messages land as tickets in one place, with the customer's history attached." },
        { icon: "ClipboardCheck", title: "Routing by topic and priority", body: "Tickets are tagged and sent to the right queue, person or AI agent automatically, based on rules you set." },
        { icon: "CalendarClock", title: "Response targets that are tracked", body: "Each ticket carries a response and resolution target, and anything at risk is escalated before it is late." },
        { icon: "Headset", title: "AI drafts, people approve", body: "AI drafts a reply from your knowledge base for every ticket, and your team approves or edits the ones that matter." },
        { icon: "Search", title: "Reporting on the whole queue", body: "Volume, response times, backlog and satisfaction by channel, team and topic, every week." },
      ],
    },
    deepDives: {
      heading: { eyebrow: "Under the hood", title: "Routing and escalation that keep promises" },
      rows: [
        {
          title: "Smart routing",
          body: "The right ticket reaches the right person the first time, so customers are not passed around and nothing sits unassigned.",
          image: { src: u("photo-1587560699334-cc4ff634909a"), alt: "A laptop on an office desk next to a desk phone" },
          bullets: ["Rules by topic, customer and channel", "Load balanced across the team", "AI agents take the routine ones first"],
        },
        {
          title: "Escalations",
          body: "Urgent and at risk tickets surface on their own, with the context a senior person needs to step in fast.",
          image: { src: u("photo-1531482615713-2afd69097998"), alt: "Two colleagues at a computer, one on a phone call" },
          bullets: ["Alerts before a target is missed", "Escalation paths you define", "Full history attached to every handoff"],
        },
      ],
    },
    audience: {
      heading: { eyebrow: "Who it's for", title: "Built for teams outgrowing a shared inbox" },
      items: [
        { icon: "Inbox", title: "Teams working from a shared inbox", body: "Emails get answered twice or not at all. Tickets fix both." },
        { icon: "MessagesSquare", title: "Support across many channels", body: "Phone, chat and social each had their own place. Now they share one queue." },
        { icon: "Building2", title: "Businesses with several teams", body: "Sales, support and billing each get their own queue, with handoffs between them." },
      ],
    },
    built: { heading: { eyebrow: "Why we build it", title: "Built for you, not bought off the shelf" }, items: builtItems("helpdesk") },
    process: {
      heading: { eyebrow: "How it works", title: "From inbox chaos to a working queue" },
      steps: [
        { n: 1, title: "Map your requests", body: "We list your channels, request types and who handles what today." },
        { n: 2, title: "Design the queues", body: "Routing rules, priorities and response targets are agreed with your team." },
        { n: 3, title: "Connect and launch", body: "Channels are connected and the queue goes live, one channel at a time." },
        { n: 4, title: "Tune every week", body: "We adjust rules and drafts as we see where tickets wait." },
      ],
    },
    faq: {
      heading: { eyebrow: "Helpdesk questions", title: "What teams ask before switching" },
      items: [
        { q: "Do we have to leave our current helpdesk?", a: "No. If yours can do the job, we set up routing, targets and AI drafts inside it. We build new only when it cannot." },
        { q: "Can phone calls become tickets?", a: "Yes. Calls are logged with a summary and recording link, and follow-ups are tracked like any other ticket." },
        { q: "How do AI drafts work?", a: "Each ticket gets a suggested reply from your knowledge base. Your team sends it as is, edits it, or writes their own." },
        { q: "Can customers see their ticket status?", a: "Yes. Customers get updates by email or text, and can reply on the same thread." },
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
    figure: "rank",
    tone: "landscaping",
    meta: {
      title: "Quality management system",
      description: "Growtk builds a quality management system that scores every call and chat against your scorecard with AI, flags conversations for coaching and reports trends by agent, topic and channel.",
    },
    hero: {
      eyebrow: "Quality assurance solution",
      title: "Every conversation scored, not one in fifty",
      body: "AI reviews every call and chat, human and AI agent alike, against your own scorecard. The ones that need attention go to a coaching queue, and trends show up long before they become complaints.",
      ctas: [demo()],
    },
    capabilities: {
      heading: { eyebrow: "Capabilities", title: "Quality you can see, not guess", body: "Full coverage, consistent scoring, focused coaching." },
      features: [
        { icon: "ClipboardCheck", title: "Scorecards built around your standards", body: "Greeting, accuracy, compliance, empathy and resolution: whatever matters to you, weighted the way you want." },
        { icon: "Search", title: "AI scoring on every conversation", body: "Calls are transcribed and every conversation is scored, so quality reflects the whole picture, not a small sample." },
        { icon: "Headset", title: "A coaching queue that prioritizes", body: "Low scores and risky moments are flagged with the exact quote, so coaching time goes where it helps most." },
        { icon: "Bot", title: "AI agents held to the same bar", body: "Your AI agents are scored on the same scorecard, so you know they meet your standards too." },
        { icon: "TrendingUp", title: "Trends by agent, topic and channel", body: "See what is improving, what is slipping and why, week by week." },
      ],
    },
    deepDives: {
      heading: { eyebrow: "Under the hood", title: "Consistent scoring, focused coaching" },
      rows: [
        {
          title: "Full coverage",
          body: "Manual review usually covers a tiny share of conversations. AI scoring covers all of them, the same way every time.",
          image: { src: u("photo-1551288049-bebda4e38f71"), alt: "A laptop showing charts and metrics on an analytics dashboard" },
          bullets: ["Every call and chat reviewed", "The same rules applied every time", "Scores you can drill into, quote by quote"],
        },
        {
          title: "Coaching loops",
          body: "Scores only matter if they change behavior. Flagged conversations turn into coaching sessions with clear examples and follow-up.",
          image: { src: u("photo-1552664730-d307ca884978"), alt: "A team working through sticky notes on a wall during a workshop" },
          bullets: ["Flagged moments with the exact quote", "Coaching notes tracked over time", "Calibration sessions to keep scoring fair"],
        },
      ],
    },
    audience: {
      heading: { eyebrow: "Who it's for", title: "Built for teams that care how every conversation goes" },
      items: [
        { icon: "Headset", title: "Contact centers and support teams", body: "Know how every conversation went, not just the few someone had time to review." },
        { icon: "ShieldCheck", title: "Regulated and compliance heavy work", body: "Required disclosures and wording checked on every call, with exceptions flagged." },
        { icon: "Bot", title: "Teams running AI agents", body: "Check that AI agents stay accurate, on brand and inside your rules." },
      ],
    },
    built: { heading: { eyebrow: "Why we build it", title: "Built for you, not bought off the shelf" }, items: builtItems("quality") },
    process: {
      heading: { eyebrow: "How it works", title: "From scorecard to coaching" },
      steps: [
        { n: 1, title: "Define the scorecard", body: "We turn your standards into clear, weighted criteria." },
        { n: 2, title: "Connect conversations", body: "Calls and chats flow in from your phone system and helpdesk." },
        { n: 3, title: "Calibrate", body: "AI scores are checked against your reviewers until they agree." },
        { n: 4, title: "Coach and improve", body: "Flagged conversations feed coaching, and trends are reviewed weekly." },
      ],
    },
    faq: {
      heading: { eyebrow: "Quality questions", title: "What managers ask about AI scoring" },
      items: [
        { q: "How accurate is AI scoring?", a: "We calibrate it against your own reviewers before relying on it, and keep checking a sample by hand afterwards." },
        { q: "Can it score phone calls?", a: "Yes. Calls are transcribed and scored like chats, with timestamps so reviewers can jump to the moment that matters." },
        { q: "Will agents see their scores?", a: "If you want them to. Many teams share scores and flagged examples as part of regular coaching." },
        { q: "Where is the data kept?", a: "In your own systems wherever possible, with access limited by role and every review logged." },
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
    figure: "estimate",
    tone: "healthcare",
    meta: {
      title: "Survey software",
      description: "Growtk builds survey systems that send CSAT, NPS and post-contact surveys by text, email or chat at the right moment, route low scores to a person and roll results up into decisions.",
    },
    hero: {
      eyebrow: "Voice of the customer solution",
      title: "Hear from customers while it still matters",
      body: "Short surveys sent by text, email or chat right after a call, delivery, visit or purchase. Low scores reach a person the same day, and the patterns turn into fixes.",
      ctas: [demo()],
    },
    capabilities: {
      heading: { eyebrow: "Capabilities", title: "Feedback that leads somewhere", body: "Asked at the right moment, acted on the same day." },
      features: [
        { icon: "ClipboardCheck", title: "CSAT, NPS and custom surveys", body: "Short, branded surveys built for the moment you want to measure, from a single question to a short form." },
        { icon: "CalendarClock", title: "Sent at the right moment", body: "Triggered by real events: a closed ticket, a finished call, a delivery or a visit, on the channel the customer used." },
        { icon: "BellRing", title: "Low scores alert a person", body: "A poor score or angry comment reaches the right manager straight away, so the customer hears back the same day." },
        { icon: "Star", title: "Happy customers asked for a review", body: "Customers who score you highly can be invited to leave a public review while the experience is fresh." },
        { icon: "TrendingUp", title: "Themes turned into decisions", body: "Comments grouped into themes by AI, trended over time and tied to the touchpoints that caused them." },
      ],
    },
    deepDives: {
      heading: { eyebrow: "Under the hood", title: "From feedback to recovery to fixes" },
      rows: [
        {
          title: "Closed loop recovery",
          body: "Most surveys end at a dashboard. Ours start a follow-up: every unhappy customer gets a person, and every fix gets tracked.",
          image: { src: u("photo-1563986768609-322da13575f3"), alt: "A person holding a phone with a chat open beside a laptop" },
          bullets: ["Instant alerts on low scores", "Follow-up tasks with owners", "Recovery tracked to the end"],
        },
        {
          title: "Insights that point to fixes",
          body: "Scores tell you how people feel. Themes tell you why. We group comments into themes and tie them to the step in the journey that caused them.",
          image: { src: u("photo-1573497019940-1c28c88b4f3e"), alt: "A smiling woman in a striped jacket" },
          bullets: ["AI themes across every comment", "Trends by touchpoint and team", "Monthly summary of what to fix first"],
        },
      ],
    },
    audience: {
      heading: { eyebrow: "Who it's for", title: "Built for businesses that want to know how they are doing" },
      items: [
        { icon: "Headset", title: "Support and contact teams", body: "Satisfaction measured after every conversation, not once a year." },
        { icon: "Package", title: "Retail and delivery businesses", body: "Feedback after every order and delivery, with problems caught early." },
        { icon: "HeartPulse", title: "Service and appointment businesses", body: "A quick check after every visit, and review requests for the happy ones." },
      ],
    },
    built: { heading: { eyebrow: "Why we build it", title: "Built for you, not bought off the shelf" }, items: builtItems("survey") },
    process: {
      heading: { eyebrow: "How it works", title: "From first survey to closed loop" },
      steps: [
        { n: 1, title: "Pick the moments", body: "We choose the touchpoints worth measuring and the questions to ask." },
        { n: 2, title: "Design and connect", body: "Surveys are branded and wired to the events that trigger them." },
        { n: 3, title: "Launch and alert", body: "Surveys go out, and low scores start reaching the right people." },
        { n: 4, title: "Act on themes", body: "Monthly themes turn into fixes, and we track whether scores move." },
      ],
    },
    faq: {
      heading: { eyebrow: "Survey questions", title: "What teams ask about surveys" },
      items: [
        { q: "Which channels can surveys go out on?", a: "Text, email, live chat and WhatsApp, usually the same channel the customer used to reach you." },
        { q: "Will customers find it annoying?", a: "Surveys are short, sent once per interaction and spaced out, so customers are not asked too often." },
        { q: "Can it ask for Google reviews?", a: "Yes. Customers who score you highly can be invited to leave a review on your own Google profile." },
        { q: "Where do results show up?", a: "In a dashboard and a weekly summary, and on the customer record in your CRM or helpdesk." },
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
    eyebrow: "Solutions",
    title: "Four systems we build into your operation",
    body: "Off the shelf tools rarely fit how a team actually works. We build these four around your channels, your CRM and your data, connect them to your AI agents, and run them for you if you want us to.",
    ctas: [{ label: "Book a demo", href: "/contact", variant: "primary" }] as Cta[],
  },
  groups: [
    { id: "cx-platforms" as SolutionGroup, eyebrow: "Solution group", title: "Customer experience platforms", body: "Where customer requests and feedback live: one queue for every channel, and a survey at every touchpoint." },
    { id: "support-tools" as SolutionGroup, eyebrow: "Solution group", title: "Intelligent support tools", body: "What makes every answer better: one source of truth for answers, and quality reviewed on every conversation." },
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
  labels: { breadcrumb: "Solutions", related: "Related", faqCta: { label: "Ask us anything", href: "/contact" } as Cta },
};
