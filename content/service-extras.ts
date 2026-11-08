/**
 * Extra depth for each service page under /services/<slug>: hero stats, the
 * problem statement, the tools the work runs inside, and the explainer FAQs.
 * Keyed by the slugs in content/service-pages.ts.
 *
 * Stats are capability facts about how the system is built, never outcomes,
 * client results or percentages. Tools listed are tools Growtk builds with
 * (CONSTITUTION Article 5); naming one does not mean a partnership.
 *
 * Keep every string free of em dashes and en dashes.
 */
import type { FaqItem, SectionHeading, Stat } from "./types";

export type ServiceExtras = {
  /** Three hero stats. Capability facts only, never outcomes. */
  stats: [Stat, Stat, Stat];
  /** The problem statement shown as a big scroll-reveal paragraph. */
  problem: { eyebrow: string; text: string };
  /** Tools the AI agents and people work inside. */
  stack: { heading: SectionHeading; items: string[]; note: string };
  /** Explainer FAQs, added after the service's own FAQs. */
  moreFaq: FaqItem[];
};

const stackHeading = (what: string): SectionHeading => ({
  eyebrow: "Works in your stack",
  title: "We work inside the tools you already run",
  body: `The AI agents and your team use the same systems, so ${what} stays where it already lives and your reports keep working.`,
});

const stackNote = "Running something custom? If it has an API, we can connect it.";

export const serviceExtras: Record<string, ServiceExtras> = {
  "contact-center-services": {
    stats: [
      { value: "24/7", label: "Every channel, every day" },
      { value: "1st", label: "Ring pickup, no hold queue" },
      { value: "100%", label: "Of conversations logged" },
    ],
    problem: {
      eyebrow: "The real cost of a busy line",
      text: "A missed call is not just a missed call. It is a booking that went to a competitor, a customer who stopped trying, and a review that says nobody picks up. Your contact center is where loyalty is won or lost.",
    },
    stack: {
      heading: stackHeading("customer data"),
      items: ["GoHighLevel", "HubSpot", "Salesforce", "Twilio", "Telnyx", "WhatsApp", "Vapi", "Retell", "Google Workspace", "REST API and webhooks"],
      note: stackNote,
    },
    moreFaq: [
      { q: "What are contact center services?", a: "Contact center services handle the conversations between a business and its customers: calls, chats, emails and messages, both inbound and outbound. At Growtk, AI agents handle that work around the clock, and a person steps in whenever a conversation needs one." },
      { q: "How is an AI contact center different from a call center?", a: "A traditional call center staffs seats and queues callers until an agent is free. An AI contact center answers every contact at once, works from your own policies and systems, and hands the conversations that need judgment to your team or the escalation path you choose." },
      { q: "How can contact center services help my business?", a: "They make sure every customer gets a fast answer, at any hour, without you hiring for your busiest day. They also turn every conversation into data, so you can see why customers get in touch and fix the causes." },
      { q: "How do I choose a contact center partner?", a: "Look at which channels they cover, how they hand off to people, which of your tools they work inside, and how they report results. Ask to see a live system, not slides. Our free audit call shows you all four." },
    ],
  },

  "inbound-contact-center": {
    stats: [
      { value: "24/7", label: "Inbound cover, all year" },
      { value: "1st", label: "Ring pickup on every call" },
      { value: "No", label: "Hold music or voicemail" },
    ],
    problem: {
      eyebrow: "The cost of a long queue",
      text: "Every minute on hold costs you something. Callers hang up, try the next business, cancel the subscription or leave a one star review. Inbound is not an overhead line on the budget. It is where customers decide whether to stay.",
    },
    stack: {
      heading: stackHeading("every call record"),
      items: ["GoHighLevel", "HubSpot", "Salesforce", "Twilio", "Telnyx", "Vapi", "Retell", "WhatsApp", "Calendly", "REST API and webhooks"],
      note: stackNote,
    },
    moreFaq: [
      { q: "What is an inbound contact center?", a: "An inbound contact center handles the contacts your customers start: calls, chats, emails and messages asking for help, information or a booking. Ours is run by AI agents that answer straight away and pass anything complex to a person." },
      { q: "What does an inbound contact center handle?", a: "Customer service questions, order and account lookups, bookings and changes, tier 1 troubleshooting, complaints and buying questions. You decide which of those the AI agents resolve and which go to your team." },
      { q: "How does an inbound service help my business?", a: "Customers get answered at once, day or night, so fewer give up and go elsewhere. Your team stops spending the day on routine questions and focuses on the conversations that need them." },
      { q: "How do I choose an inbound provider?", a: "Check that they work inside your systems, answer on every channel you use, hand off with full context, and report on resolution, not just call counts. Then test them on a sample of your real calls." },
    ],
  },

  "outbound-contact-center": {
    stats: [
      { value: "100%", label: "Of outcomes written to the CRM" },
      { value: "0", label: "Calls without consent" },
      { value: "Same day", label: "Opt-outs honored" },
    ],
    problem: {
      eyebrow: "The calls nobody makes",
      text: "Reminders, renewals, callbacks and win-back calls are the first things to slip when a team gets busy. Each one is revenue you already earned, quietly walking away because nobody had the time to pick up the phone.",
    },
    stack: {
      heading: stackHeading("every contact list"),
      items: ["GoHighLevel", "HubSpot", "Salesforce", "Twilio", "Telnyx", "Vapi", "Retell", "Calendly", "Stripe", "REST API and webhooks"],
      note: stackNote,
    },
    moreFaq: [
      { q: "What is an outbound contact center?", a: "An outbound contact center places calls, texts and emails on your behalf: reminders, renewals, follow-ups, surveys and campaigns. Ours uses AI agents that hold a real conversation and pass interested contacts to a person." },
      { q: "What kinds of outbound calls can AI agents make?", a: "Appointment and payment reminders, renewal and win-back calls, missed call returns, short surveys and announcements to existing customers. Every call runs inside the consent and quiet hour rules that apply to you." },
      { q: "How does outbound help my business?", a: "It recovers revenue you would otherwise lose: missed appointments, lapsed renewals and customers who went quiet. It also frees your team from dialing, so they only speak to the people who want to talk." },
      { q: "How do I choose an outbound provider?", a: "Ask how they handle consent, quiet hours and opt-outs, whether outcomes land in your CRM, and how warm contacts reach your team. If compliance is an afterthought in the pitch, it will be one in the campaign." },
    ],
  },

  "customer-support": {
    stats: [
      { value: "24/7", label: "Support on every channel" },
      { value: "1", label: "Knowledge base for AI and people" },
      { value: "100%", label: "Of tickets tracked to resolution" },
    ],
    problem: {
      eyebrow: "When support falls behind",
      text: "The shared inbox overflows, chat goes unanswered after five, and the same ten questions eat the whole day. Customers notice long before you do, and slow support quietly turns loyal customers into former ones.",
    },
    stack: {
      heading: stackHeading("every ticket"),
      items: ["GoHighLevel", "HubSpot", "Salesforce", "WhatsApp", "Twilio", "Google Workspace", "Slack", "Stripe", "n8n", "REST API and webhooks"],
      note: stackNote,
    },
    moreFaq: [
      { q: "What are customer support services?", a: "Customer support services answer customer questions and solve their problems across phone, chat, email, messaging and social. Growtk delivers them AI first: AI agents resolve what they can from your knowledge, and people handle the rest." },
      { q: "What does a support partner actually do?", a: "We set up the channels, build the knowledge base, connect your systems, define what goes to a person, and run and tune it every week. You get one team responsible for how support performs." },
      { q: "How can outsourced support help my business?", a: "You cover more hours and more channels without hiring for each one, and your team spends its time on the problems that need a person. Reporting also shows you which issues keep coming back." },
      { q: "How do I choose a customer support partner?", a: "Look at how they measure success (resolution, not reply speed), how they escalate, and whether they work inside your tools. Ask them to review a sample of your real tickets before you sign anything." },
    ],
  },

  "technical-support": {
    stats: [
      { value: "24/7", label: "Tier 1 troubleshooting" },
      { value: "100%", label: "Of escalations with full context" },
      { value: "1", label: "Source of truth: your docs" },
    ],
    problem: {
      eyebrow: "When engineers answer tickets",
      text: "Every password reset and setup question that reaches an engineer is an hour taken from the product. Meanwhile users wait for an answer that is already in your documentation, and the backlog grows faster than you can hire.",
    },
    stack: {
      heading: stackHeading("every issue"),
      items: ["HubSpot", "Salesforce", "Slack", "Google Workspace", "Twilio", "WhatsApp", "n8n", "AWS", "Cloudflare", "REST API and webhooks"],
      note: stackNote,
    },
    moreFaq: [
      { q: "What is technical support outsourcing?", a: "Technical support outsourcing hands the troubleshooting of your product to a specialist partner. With Growtk, AI agents resolve tier 1 issues from your documentation and pass confirmed problems to your engineers, ready to work." },
      { q: "What is the difference between tier 1, 2 and 3 support?", a: "Tier 1 covers known questions and guided fixes. Tier 2 investigates issues that need deeper diagnosis. Tier 3 is your engineering team fixing the product itself. We automate tier 1 and make every handoff to tier 2 and 3 complete." },
      { q: "How does technical support help my product?", a: "Users get unstuck faster, which keeps them using the product. Engineers stop context switching into tickets, and every issue that lacked an answer becomes new documentation." },
      { q: "How do I choose a technical support partner?", a: "Check that they can learn your product from your docs, collect diagnostics before escalating, and post issues into your own tracker. A good partner also improves your documentation, not just your queue." },
    ],
  },

  "ecommerce-customer-support": {
    stats: [
      { value: "24/7", label: "Shopper support, every channel" },
      { value: "Live", label: "Order and tracking lookups" },
      { value: "100%", label: "Of returns checked by your policy" },
    ],
    problem: {
      eyebrow: "Where repeat revenue is decided",
      text: "Most store tickets ask the same thing: where is my order. While your team answers them by hand, the shopper with a sizing question leaves the tab, and the customer waiting on a return decides never to buy again.",
    },
    stack: {
      heading: stackHeading("every order"),
      items: ["Shopify", "Stripe", "GoHighLevel", "HubSpot", "WhatsApp", "Meta lead ads", "Twilio", "Slack", "QuickBooks", "REST API and webhooks"],
      note: stackNote,
    },
    moreFaq: [
      { q: "What is e-commerce customer support?", a: "E-commerce customer support covers everything a shopper needs from pre-sale questions to delivery, returns and reviews. Growtk connects AI agents to your store and carriers so most of it is answered on the spot." },
      { q: "What can AI agents handle for an online store?", a: "Order status and tracking, returns and exchanges within your policy, sizing, stock and shipping questions, and custom order requests. Refund exceptions and unhappy customers go to your team with the details attached." },
      { q: "How does it help my store?", a: "Shoppers get answers while they are still deciding, which helps them buy. Post-purchase questions stop filling your inbox, and delays trigger a message before a customer has to ask." },
      { q: "How do I choose an e-commerce support partner?", a: "Make sure they connect to your store and carriers, not just a chat widget, and that they apply your return rules exactly. Ask how they cope with peak season, because that is where support breaks." },
    ],
  },

  "lead-generation": {
    stats: [
      { value: "Seconds", label: "From form to first reply" },
      { value: "24/7", label: "Lead capture and qualification" },
      { value: "100%", label: "Of leads tagged with a source" },
    ],
    problem: {
      eyebrow: "Where pipelines leak",
      text: "Leads come in from forms, calls, chats and ads, then wait hours for a reply. By the time someone gets back to them, they have already spoken to a competitor. Most lost deals are not lost on price. They are lost on speed.",
    },
    stack: {
      heading: stackHeading("every lead"),
      items: ["GoHighLevel", "HubSpot", "Salesforce", "Google lead ads", "Meta lead ads", "Calendly", "Twilio", "Slack", "Zapier", "REST API and webhooks"],
      note: stackNote,
    },
    moreFaq: [
      { q: "What are lead generation services?", a: "Lead generation services bring in potential customers and turn them into qualified conversations for your sales team. Growtk captures leads from every source, qualifies them with AI agents and books them straight onto your reps' calendars." },
      { q: "How does AI qualify a lead?", a: "An AI agent asks your qualifying questions by chat, text or call, such as budget, timing and need, and scores the answers against your rules. Qualified leads go to a rep, and the rest enter a nurture sequence." },
      { q: "How does lead generation help my business?", a: "Your reps spend their time on prospects who are ready to talk, not on chasing forms. Fast replies and steady follow-up mean fewer leads go cold, and source tracking shows which channels are worth the spend." },
      { q: "How do I choose a lead generation partner?", a: "Ask how fast new leads get a reply, how qualification works, and whether every lead lands in your own CRM with its source. Be wary of anyone who promises lead counts without asking about your sales process." },
    ],
  },

  "telemarketing": {
    stats: [
      { value: "0", label: "Calls without consent" },
      { value: "100%", label: "Of outcomes on the record" },
      { value: "Weekly", label: "Script tests and updates" },
    ],
    problem: {
      eyebrow: "Why the phone still matters",
      text: "Email gets ignored and ads get scrolled past. A real conversation still moves people, but running phone campaigns by hand is slow, inconsistent and easy to get wrong on consent. So most businesses stop doing it altogether.",
    },
    stack: {
      heading: stackHeading("every campaign list"),
      items: ["GoHighLevel", "HubSpot", "Salesforce", "Twilio", "Telnyx", "Vapi", "Retell", "ElevenLabs", "Calendly", "REST API and webhooks"],
      note: stackNote,
    },
    moreFaq: [
      { q: "What are telemarketing services?", a: "Telemarketing services reach prospects and customers by phone to promote an offer, a launch, an event or a renewal. Growtk runs campaigns with AI voice agents, supported by text and email, and passes interested contacts to your team." },
      { q: "Is AI telemarketing legal?", a: "It can be, when it follows the rules for where your contacts are: consent, calling hours, caller identification and opt-outs. We build those rules into every campaign and you approve them before any call is placed." },
      { q: "How does telemarketing help my business?", a: "It puts a launch, an event or an upgrade in front of people who will actually hear it. Because AI agents run the calls, you can run campaigns often instead of once a quarter." },
      { q: "How do I choose a telemarketing partner?", a: "Ask how they handle consent and opt-outs, how scripts are tested, and how results reach your CRM. Discipline matters more than dialing volume." },
    ],
  },

  "sales-support": {
    stats: [
      { value: "100%", label: "Of quotes followed up" },
      { value: "Every", label: "Call logged with notes" },
      { value: "24/7", label: "Meeting booking for reps" },
    ],
    problem: {
      eyebrow: "How admin eats a pipeline",
      text: "Reps spend hours on data entry, chasing quotes and updating the CRM, and only part of the day actually selling. Quotes sit unanswered, renewals slip past their dates, and the forecast is built on records nobody had time to update.",
    },
    stack: {
      heading: stackHeading("every deal"),
      items: ["GoHighLevel", "HubSpot", "Salesforce", "Calendly", "Slack", "Google Workspace", "Stripe", "QuickBooks", "Zapier", "REST API and webhooks"],
      note: stackNote,
    },
    moreFaq: [
      { q: "What are sales support services?", a: "Sales support services take the work around a sale off your reps: CRM updates, quote follow-up, meeting booking, order processing and renewals. Growtk automates that work and uses AI agents for the conversations in between." },
      { q: "What does sales support include?", a: "Quote and proposal follow-up, meeting booking, CRM logging and notes, pipeline stage workflows, renewal reminders and team alerts. Each piece runs inside the CRM your reps already use." },
      { q: "How does sales support help my team?", a: "Reps get hours back for selling, deals stop falling through cracks, and the pipeline reflects what really happened. That makes forecasting easier and coaching more accurate." },
      { q: "How do I choose a sales support partner?", a: "Look for a partner who works inside your CRM rather than beside it, maps your actual pipeline stages, and can show you a working build. Admin removed should be measurable in hours." },
    ],
  },

  "back-office-support": {
    stats: [
      { value: "Daily", label: "Backlog cleared on schedule" },
      { value: "100%", label: "Of changes in an audit trail" },
      { value: "0", label: "Copying between tabs" },
    ],
    problem: {
      eyebrow: "Where accuracy quietly fails",
      text: "Invoices, forms, data entry and reconciliations pile up behind the scenes. When people copy numbers between systems by hand, mistakes creep in, backlogs grow every busy week, and the cost shows up later in refunds, write-offs and lost hours.",
    },
    stack: {
      heading: stackHeading("every record"),
      items: ["QuickBooks", "Stripe", "Google Workspace", "GoHighLevel", "HubSpot", "Salesforce", "WhatsApp", "Slack", "n8n", "REST API and webhooks"],
      note: stackNote,
    },
    moreFaq: [
      { q: "What is back office support?", a: "Back office support is the work customers never see: data entry, document processing, invoicing, reconciliation, verification and reporting. Growtk automates it inside your existing tools and routes exceptions to a person." },
      { q: "Which back office tasks can be automated?", a: "Most repetitive, rule based tasks: reading forms and receipts, entering data, matching payments, updating sheets and reports, and sending alerts. Anything that needs judgment stays with your team, with the details prepared." },
      { q: "How does back office automation help my business?", a: "It clears the backlog every day instead of every month, cuts copy and paste errors, and frees your team from tasks that ate whole afternoons. Alerts also flag problems before they cost money." },
      { q: "How do I choose a back office partner?", a: "Ask how they check accuracy, how exceptions reach a person, and whether every change is logged. Good automation is measured on errors avoided, not only on speed." },
    ],
  },

  "customer-experience-management": {
    stats: [
      { value: "Every", label: "Touchpoint with a survey" },
      { value: "Same day", label: "Alerts on low scores" },
      { value: "100%", label: "Of conversations quality scored" },
    ],
    problem: {
      eyebrow: "When feedback goes nowhere",
      text: "Satisfaction scores stall, customers leave without saying why, and the feedback you do collect sits in a spreadsheet. Measuring experience is easy. Acting on it fast enough to keep the customer is the part most businesses miss.",
    },
    stack: {
      heading: stackHeading("every survey response"),
      items: ["GoHighLevel", "HubSpot", "Salesforce", "Twilio", "WhatsApp", "Google Workspace", "Slack", "Stripe", "Make", "REST API and webhooks"],
      note: stackNote,
    },
    moreFaq: [
      { q: "What is customer experience management?", a: "Customer experience management is measuring and improving how customers feel at every step, from first contact to repeat purchase. Growtk maps the journey, collects feedback at each step and turns it into fixes." },
      { q: "What does a CX management program include?", a: "Journey mapping, surveys at key moments, review requests and replies, quality scoring on conversations, alerts for unhappy customers and a monthly report on what to fix first." },
      { q: "How does CX management help my business?", a: "Unhappy customers get a response the same day, so more of them stay. Steady reviews bring in new customers, and decisions come from evidence rather than guesswork." },
      { q: "How do I choose a CX partner?", a: "Look for someone who closes the loop, not just someone who sends surveys. Ask how a low score reaches a person, and how themes from feedback turn into changes in your process." },
    ],
  },

  "workforce-management": {
    stats: [
      { value: "Hourly", label: "Demand forecasts" },
      { value: "Live", label: "View of coverage and queues" },
      { value: "24/7", label: "AI cover on peaks" },
    ],
    problem: {
      eyebrow: "The cost of guesswork scheduling",
      text: "Schedules built from habit and spreadsheets put people on shift when it is quiet and leave gaps when it is busy. You miss service targets with staff to spare, overtime climbs, and nobody can plan the next quarter with confidence.",
    },
    stack: {
      heading: stackHeading("every schedule"),
      items: ["Jobber", "ServiceTitan", "GoHighLevel", "Google Workspace", "Calendly", "Slack", "QuickBooks", "Twilio", "n8n", "REST API and webhooks"],
      note: stackNote,
    },
    moreFaq: [
      { q: "What is workforce management?", a: "Workforce management is planning who works when, so you have the right number of people with the right skills for the demand you expect. It covers forecasting, scheduling, dispatch and tracking time and coverage." },
      { q: "How does AI help workforce management?", a: "AI forecasts volume from your history and seasonality, builds schedules against it, and picks up overflow when demand beats the forecast. Your team covers the planned work, and the peaks stop pulling people off it." },
      { q: "How does workforce management help my business?", a: "You hit service targets without overstaffing, overtime drops, and payroll gets accurate hours without a chase. Field teams also get days that rebuild themselves when a job changes." },
      { q: "How do I choose a workforce management partner?", a: "Check that they forecast from your own data, work with the scheduling and job tools you already use, and show coverage against demand clearly. A forecast you cannot see is a forecast you cannot trust." },
    ],
  },

  "business-process-reengineering": {
    stats: [
      { value: "Every", label: "Step mapped and measured" },
      { value: "Baseline", label: "Measured before any change" },
      { value: "1", label: "Team that maps and builds" },
    ],
    problem: {
      eyebrow: "Why automating a broken process fails",
      text: "Most processes grew one workaround at a time. Automate them as they are and you only make the waste run faster. Outsource them and you move the waste somewhere else. The fix starts with redesigning the work itself.",
    },
    stack: {
      heading: stackHeading("every process"),
      items: ["GoHighLevel", "HubSpot", "Salesforce", "QuickBooks", "Google Workspace", "Slack", "n8n", "Zapier", "Make", "REST API and webhooks"],
      note: stackNote,
    },
    moreFaq: [
      { q: "What is business process reengineering?", a: "Business process reengineering is redesigning how work gets done, from the ground up, instead of patching each step. Growtk maps the current process, removes the waste, and rebuilds it around AI and automation." },
      { q: "When should a business consider BPR?", a: "Before you automate or outsource anything, after a merger or system change, or when a process that worked at a small size starts breaking as you grow. Those are the moments a redesign pays back most." },
      { q: "How does BPR help my business?", a: "Work moves faster with fewer handoffs and errors, and automation built on top of a clean process saves far more. Every change is measured, so you see the result in hours and errors, not promises." },
      { q: "How do I choose a BPR partner?", a: "Choose one that measures before recommending and builds what it recommends. A redesign that ends as a slide deck rarely changes how the work actually gets done." },
    ],
  },
};
