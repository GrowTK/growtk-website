/**
 * The seven industry pages under /industries/<slug>, plus the /industries hub.
 * Growtk delivers AI first: AI agents and automation do the work around the
 * clock, and a person (the client's team or the escalation path they choose)
 * steps in on escalation.
 *
 * Growtk has no clients in these industries yet, so nothing here implies past
 * work in them. No headcount, seats, years, client counts, percent results or
 * certifications of any kind. Trust sections describe concrete practices only.
 * Hero stats are capability facts about how the system is built.
 *
 * Keep every string free of em dashes and en dashes.
 */
import type { Cta, FaqItem, Feature, SectionHeading, Stat, Step } from "./types";

export type IndustrySlug = "banking-fintech" | "ride-hailing" | "ecommerce" | "logistics" | "telecom" | "healthcare" | "saas";
export type IndustryTone = "yellow" | "peach" | "lilac" | "mint" | "sky" | "rose" | "lime";
export type IndustryPoint = { title: string; body: string };
/** Optional "we run the store too" section, used by ecommerce. */
export type StoreOps = {
  heading: SectionHeading;
  platform: { name: string; body: string; tools: string[] };
  alsoLabel: string;
  also: string[];
  items: (Feature & { tag: string })[];
};

export type IndustryPage = {
  slug: IndustrySlug;
  name: string;
  icon: string;
  teaser: string;
  tone: IndustryTone;
  meta: { title: string; description: string };
  hero: SectionHeading & { ctas: Cta[]; stats: [Stat, Stat, Stat] };
  problem: { eyebrow: string; text: string };
  challenges: { heading: SectionHeading; items: Feature[] };
  inside: { heading: SectionHeading; points: IndustryPoint[] };
  storeOps?: StoreOps;
  services: { heading: SectionHeading; items: { slug: string; body: string }[] };
  segments: { heading: SectionHeading; items: (Feature & { tag: string })[] };
  useCases: { heading: SectionHeading; items: { title: string; body: string; channel: string }[] };
  journey: { heading: SectionHeading; steps: Step[] };
  trust: { heading: SectionHeading; points: IndustryPoint[] };
  integrations: { heading: SectionHeading; items: string[]; note: string };
  faq: { heading: SectionHeading; items: FaqItem[] };
  cta: { heading: SectionHeading; primary: Cta };
};

const ctas = (): Cta[] => [
  { label: "Book a free audit", href: "/contact", variant: "primary" },
  { label: "See how it works", href: "#how-it-works", variant: "secondary" },
];
const audit = (label = "Book a free audit"): Cta => ({ label, href: "/contact", variant: "primary" });
const note = "Running something custom? If it has an API, we can connect it.";

const journey = (what: string): { heading: SectionHeading; steps: Step[] } => ({
  heading: {
    eyebrow: "How it works",
    title: "From first call to running on its own",
    body: `Four steps, set up around ${what}. You see it work on real conversations before anything goes wide.`,
  },
  steps: [
    { n: 1, title: "Audit", body: "A free call to map your channels, your volume, your tools and the requests that wait longest or get dropped." },
    { n: 2, title: "Design", body: "A written plan: what the AI agents handle, what goes to a person and how, what it connects to, and what it costs." },
    { n: 3, title: "Pilot", body: "We build inside your own systems, run it on one channel or one queue, and review every conversation with you." },
    { n: 4, title: "Scale", body: "Once the pilot runs clean we add channels and request types, and keep tuning scripts and rules every week." },
  ],
});

export const industryPages: IndustryPage[] = [
  /* ------------------------------ Banking and fintech ------------------------------ */
  {
    slug: "banking-fintech",
    name: "Banking and fintech",
    icon: "Landmark",
    teaser: "Secure CX for financial services",
    tone: "sky",
    meta: {
      title: "AI customer operations for banking and fintech",
      description: "Growtk builds AI agents and automation for banks, wallets, lenders and payment companies: account questions, card issues, onboarding and back office work, with sensitive cases routed to your team.",
    },
    hero: {
      eyebrow: "Banking and fintech",
      title: "Support customers trust with their money",
      body: "AI agents answer account, card and payment questions around the clock, inside your own systems. Anything sensitive, from a fraud report to a complaint, reaches your team at once with the full story attached.",
      ctas: ctas(),
      stats: [
        { value: "24/7", label: "Answers on every channel" },
        { value: "Every", label: "Action logged for audit" },
        { value: "1st", label: "Ring pickup on fraud lines" },
      ],
    },
    problem: {
      eyebrow: "The reality",
      text: "When money is involved, a slow answer feels like a risk. A blocked card at midnight, a missing transfer or a stuck application sends customers to social media or to a competitor, and every reply still has to be accurate and on the record.",
    },
    challenges: {
      heading: { eyebrow: "Challenges we solve", title: "What makes financial support hard", body: "The same pressures show up at banks, wallets and lenders of every size." },
      items: [
        { icon: "Scale", title: "Every word is on the record", body: "Disclosures, complaint handling and dispute steps have to be followed the same way every time, on every channel." },
        { icon: "Activity", title: "Spikes you cannot schedule", body: "Salary days, outages and app releases bring waves of contacts that no fixed team can absorb." },
        { icon: "ShieldAlert", title: "Fraud cannot wait", body: "A customer reporting a stolen card needs the card frozen now, not a ticket number and a callback tomorrow." },
        { icon: "UserX", title: "Onboarding drop off", body: "Applicants stall on a missing document or a failed check, and most never come back on their own." },
        { icon: "Split", title: "Channels that do not talk", body: "App chat, phone, email and social each hold part of the story, so customers repeat themselves." },
        { icon: "FileSearch", title: "Audit readiness", body: "When a regulator or auditor asks, you need to show who said what, when, and why, without a scramble." },
      ],
    },
    inside: {
      heading: { eyebrow: "Inside the operation", title: "What a financial services desk actually runs", body: "Most contacts are routine. A few are urgent. The system tells them apart in seconds." },
      points: [
        { title: "Routine requests closed on their own", body: "Balance questions, statement copies, limits and card delivery updates are answered from your systems, end to end." },
        { title: "Urgent cases fast tracked", body: "Fraud, lost cards and possible vulnerability are spotted early and handed to your team with the account context ready." },
        { title: "Complaints handled by the book", body: "Every complaint is logged, acknowledged and tracked against the steps and timelines you set." },
      ],
    },
    services: {
      heading: { eyebrow: "What we deliver", title: "Services built for banking and fintech" },
      items: [
        { slug: "inbound-contact-center", body: "Account, card and payment questions answered at any hour, with fraud and complaints routed to your team." },
        { slug: "back-office-support", body: "Document checks, application follow ups and data entry handled by automation, with exceptions flagged to a person." },
        { slug: "outbound-contact-center", body: "Payment reminders, onboarding nudges and service calls made on schedule, with consent and opt outs respected." },
        { slug: "customer-support", body: "One conversation history across app chat, phone, email and social, so customers never start over." },
        { slug: "customer-experience-management", body: "Every conversation scored against your own standards, so quality and process gaps show up early." },
        { slug: "business-process-reengineering", body: "Slow onboarding and dispute flows mapped, simplified and automated step by step." },
      ],
    },
    segments: {
      heading: { eyebrow: "Who we serve", title: "Built for every model in digital finance" },
      items: [
        { icon: "Building", tag: "Branch and app", title: "Retail and commercial banks", body: "Take routine volume off branch and phone teams while keeping sensitive cases with your own people." },
        { icon: "Wallet", tag: "App first", title: "Wallets and neobanks", body: "Support that lives inside the app and keeps up with fast releases and fast growth." },
        { icon: "HandCoins", tag: "Lending ops", title: "Lenders and buy now pay later", body: "Application updates, repayment questions and reminders handled on time, every time." },
        { icon: "CreditCard", tag: "Merchant care", title: "Payment providers", body: "Merchant onboarding, settlement questions and integration help answered without a queue." },
      ],
    },
    useCases: {
      heading: { eyebrow: "What the AI agents do", title: "Jobs handled before a person is needed" },
      items: [
        { channel: "Voice", title: "Freeze a lost card", body: "Verify the caller, freeze the card in your core system and hand the replacement request to your team." },
        { channel: "Chat", title: "Explain a transaction", body: "Look up a charge the customer does not recognize and start a dispute if it is not theirs." },
        { channel: "WhatsApp", title: "Chase missing documents", body: "Remind applicants what is missing, take the upload and pass it to review." },
        { channel: "SMS", title: "Payment reminders", body: "Send polite reminders before a due date and take a promise to pay." },
        { channel: "Email", title: "Statement and letter requests", body: "Send statements, confirmation letters and balance certificates on request." },
        { channel: "Back office", title: "Log every complaint", body: "Record complaints with the right category and deadline, and track them to closure." },
      ],
    },
    journey: journey("your products, your policies and your core systems"),
    trust: {
      heading: { eyebrow: "Security and control", title: "The controls you would expect to find", body: "No certifications claimed. Here is how the work is set up." },
      points: [
        { title: "Data stays in your systems", body: "The AI agents read from and write to your own core and CRM. We do not keep a copy of customer records." },
        { title: "Access by role", body: "Each agent and each person sees only what their job needs, and access is reviewed with you." },
        { title: "Sensitive cases go to a person", body: "Fraud, complaints and signs of vulnerability are always handed to your team, never closed by AI alone." },
        { title: "Every action logged", body: "Each conversation, lookup and change is recorded, so you can show exactly what happened and when." },
      ],
    },
    integrations: {
      heading: { eyebrow: "Works in your stack", title: "Built on the tools finance teams already run" },
      items: ["Your core banking system", "Salesforce", "HubSpot", "Twilio", "WhatsApp Business", "Stripe", "AWS", "REST API and webhooks"],
      note,
    },
    faq: {
      heading: { eyebrow: "Banking and fintech questions", title: "What finance teams ask first" },
      items: [
        { q: "Can AI agents verify a customer's identity?", a: "They can run the identity steps you already use, such as security questions or a one time code, before they share or change anything. If a check fails, the conversation goes to your team." },
        { q: "What happens with a fraud report?", a: "The agent takes the immediate safe action you allow, such as freezing a card, and hands the case to your team straight away with everything it has collected." },
        { q: "Where is customer data stored?", a: "In your systems. The agents work inside your core banking platform and CRM, and conversation logs stay in the places you choose." },
        { q: "Can we control what the AI is allowed to say?", a: "Yes. Answers come from approved content and scripts you sign off, and anything outside them goes to a person." },
        { q: "Do you replace our team?", a: "No. The AI takes the routine volume so your people spend their time on fraud, complaints and the cases that need judgment." },
        { q: "How do we start?", a: "Book a free audit call. We look at your contact volume and pick one queue to pilot, usually card and account questions." },
      ],
    },
    cta: { heading: { eyebrow: "Free audit", title: "See which money questions could answer themselves", body: "Thirty minutes. We map your contact volume and show you what to automate first." }, primary: audit() },
  },

  /* ---------------------------------- Ride hailing ---------------------------------- */
  {
    slug: "ride-hailing",
    name: "Ride hailing",
    icon: "Car",
    teaser: "Real-time support for mobility platforms",
    tone: "yellow",
    meta: {
      title: "AI support for ride hailing and mobility platforms",
      description: "Growtk builds AI agents for ride hailing and delivery platforms: rider and driver support in real time, safety cases routed to your team at once, and the admin behind every trip automated.",
    },
    hero: {
      eyebrow: "Ride hailing",
      title: "Support at the speed of the street",
      body: "Riders and drivers need answers while the trip is still happening. AI agents open every conversation with the trip already on screen, fix fares and lost items in minutes, and send every safety case to a person immediately.",
      ctas: ctas(),
      stats: [
        { value: "24/7", label: "Rider and driver support" },
        { value: "Every", label: "Chat opens with trip details" },
        { value: "1st", label: "Priority for safety cases" },
      ],
    },
    problem: {
      eyebrow: "The reality",
      text: "A rider stranded at night or a driver waiting on a payout cannot wait for tomorrow's queue. Slow answers become one star ratings, public posts and drivers who switch apps, and every launch brings a fresh wave of contacts.",
    },
    challenges: {
      heading: { eyebrow: "Challenges we solve", title: "What makes mobility support hard" },
      items: [
        { icon: "Timer", title: "Real time stakes", body: "Trips are happening now. Answers that arrive after the ride is over arrive too late." },
        { icon: "Users", title: "Two sides to care for", body: "Riders and drivers need different answers, different tone and different rules, often about the same trip." },
        { icon: "Siren", title: "Safety comes first", body: "Accidents, harassment and lost riders need a person on the case in seconds, every single time." },
        { icon: "Megaphone", title: "Complaints go public", body: "A bad experience can be on social media before the trip ends, so speed matters as much as accuracy." },
        { icon: "FileCheck", title: "Driver admin piles up", body: "Document checks, vehicle updates and payout questions take hours of back office time every day." },
        { icon: "Rocket", title: "Launches bring surges", body: "A new city or a new promotion can multiply contacts overnight, then settle again a week later." },
      ],
    },
    inside: {
      heading: { eyebrow: "Inside the operation", title: "A mobility desk runs on minutes, not tickets" },
      points: [
        { title: "Trip context on open", body: "Route, fare, driver and timeline are pulled in before the first reply, so nobody asks the customer to explain." },
        { title: "Fixes inside the rules", body: "Fare adjustments, cancellation fees and refunds are applied within limits you set, without a handoff." },
        { title: "Safety straight to a person", body: "Any sign of danger skips the queue and reaches your trust and safety team with the trip details attached." },
      ],
    },
    services: {
      heading: { eyebrow: "What we deliver", title: "Services built for ride hailing" },
      items: [
        { slug: "inbound-contact-center", body: "Rider and driver questions answered in real time on chat, in app and by phone." },
        { slug: "customer-support", body: "Lost items, fare reviews and account issues resolved with the trip already in view." },
        { slug: "back-office-support", body: "Driver document checks, vehicle updates and onboarding steps processed by automation." },
        { slug: "workforce-management", body: "Coverage planned around rush hours, weather and launches, with AI absorbing the peaks." },
        { slug: "customer-experience-management", body: "Every rider and driver conversation scored, with patterns turned into fixes in the product." },
        { slug: "outbound-contact-center", body: "Driver activation calls, re-engagement and service updates made on schedule." },
      ],
    },
    segments: {
      heading: { eyebrow: "Who we serve", title: "Every side of a mobility platform" },
      items: [
        { icon: "User", tag: "Rider care", title: "Rider support", body: "Fares, refunds, lost items and app questions answered while the rider still cares." },
        { icon: "Car", tag: "Supply side", title: "Driver partner care", body: "Payouts, documents and account questions handled fast, so good drivers stay on your app." },
        { icon: "ShieldCheck", tag: "Trust and safety", title: "Safety support", body: "Incidents flagged, details collected and handed to your safety team without delay." },
        { icon: "Package", tag: "Super app", title: "Delivery and other verticals", body: "Food, parcel and grocery orders supported with the same speed and the same rules." },
      ],
    },
    useCases: {
      heading: { eyebrow: "What the AI agents do", title: "Jobs handled before a person is needed" },
      items: [
        { channel: "Chat", title: "Review a fare", body: "Compare the route with the estimate and refund the difference within your limits." },
        { channel: "Chat", title: "Find a lost item", body: "Connect rider and driver safely and arrange the return without sharing numbers." },
        { channel: "Voice", title: "Driver payout questions", body: "Explain earnings, deductions and payout dates from the driver's own records." },
        { channel: "WhatsApp", title: "Collect driver documents", body: "Remind drivers about expiring documents and take the new upload." },
        { channel: "SMS", title: "Service alerts", body: "Tell affected riders and drivers about outages or surges before they ask." },
        { channel: "Back office", title: "Flag safety cases", body: "Spot safety words in any message and alert your team with the trip attached." },
      ],
    },
    journey: journey("your app, your trip data and your safety rules"),
    trust: {
      heading: { eyebrow: "Security and control", title: "Rider and driver data, handled properly", body: "No certifications claimed. Here is how the work is set up." },
      points: [
        { title: "Data stays in your platform", body: "The agents read trip and account data from your systems when they need it and do not keep their own copy." },
        { title: "Masked contact details", body: "Riders and drivers are connected without exposing personal phone numbers or addresses." },
        { title: "Safety always goes to a person", body: "No safety incident is closed by AI. Your team owns every one." },
        { title: "Every action logged", body: "Refunds, adjustments and account changes are recorded with who did what and why." },
      ],
    },
    integrations: {
      heading: { eyebrow: "Works in your stack", title: "Built on the tools mobility teams already run" },
      items: ["Your dispatch platform", "Salesforce", "HubSpot", "Twilio", "WhatsApp Business", "Stripe", "Slack", "REST API and webhooks"],
      note,
    },
    faq: {
      heading: { eyebrow: "Ride hailing questions", title: "What mobility teams ask first" },
      items: [
        { q: "Can the AI see the trip?", a: "Yes, once it is connected to your platform. Route, fare, timeline and driver details load at the start of the conversation." },
        { q: "How are safety incidents handled?", a: "They skip the AI queue. The agent collects only what is needed to keep people safe and hands the case to your team at once." },
        { q: "Can it issue refunds?", a: "Within limits you set, yes. Anything above the limit or outside the rules goes to a person for approval." },
        { q: "Does it support drivers too?", a: "Yes. Drivers get their own flows for payouts, documents and account questions, with their own tone and rules." },
        { q: "What about a launch in a new city?", a: "The AI takes the surge, and we tune answers for the new market before and during launch." },
        { q: "How do we start?", a: "Book a free audit call. Most teams pilot rider fare and lost item requests first." },
      ],
    },
    cta: { heading: { eyebrow: "Free audit", title: "See which trip questions could answer themselves", body: "We map your rider and driver contacts and show you what to automate first." }, primary: audit() },
  },

  /* ----------------------------------- Ecommerce ------------------------------------ */
  {
    slug: "ecommerce",
    name: "Ecommerce",
    icon: "ShoppingBag",
    teaser: "Scale support for high-order volume retail",
    tone: "peach",
    meta: {
      title: "AI customer support and Shopify store management for ecommerce",
      description: "Growtk builds AI agents and automation for online stores: order status, returns and pre-sale help answered in seconds, plus Shopify store management for products, stock, orders and promotions, with exceptions handed to your team.",
    },
    hero: {
      eyebrow: "Ecommerce",
      title: "Support that scales with every order",
      body: "Where is my order, can I return this, will it fit. AI agents answer from your store and your courier data in seconds, process returns inside your policy, and pass the tricky ones to your team. Behind the inbox, automation keeps your Shopify products, stock and orders in order.",
      ctas: ctas(),
      stats: [
        { value: "24/7", label: "Shopper support" },
        { value: "Live", label: "Order and tracking lookups" },
        { value: "Every", label: "Return checked by your policy" },
      ],
    },
    problem: {
      eyebrow: "The reality",
      text: "Sales days, delays and returns season bury your inbox at the exact moment shoppers are least patient. Slow replies turn into chargebacks, bad reviews and carts that never come back, while margins leave no room for a bigger team.",
    },
    challenges: {
      heading: { eyebrow: "Challenges we solve", title: "The realities of retail at scale" },
      items: [
        { icon: "TrendingUp", title: "Volume that swings", body: "Sales, launches and holidays can multiply contacts in a day, then drop off just as fast." },
        { icon: "Star", title: "Reviews are public", body: "One slow answer can become a one star review that every future shopper reads." },
        { icon: "Percent", title: "Thin margins", body: "Every contact costs money, so support has to get cheaper per order as you grow." },
        { icon: "Undo2", title: "Returns eat profit", body: "Returns need checking against policy, labels, refunds and restocking, all by hand." },
        { icon: "Store", title: "Marketplace scores", body: "Response times on marketplaces affect your ranking and sometimes your right to sell." },
        { icon: "Tags", title: "Catalog questions", body: "Sizing, compatibility and stock questions decide whether a cart checks out." },
      ],
    },
    inside: {
      heading: { eyebrow: "Inside the operation", title: "The work behind every order" },
      points: [
        { title: "Order context on open", body: "Order, payment and tracking details load before the first reply, so shoppers never paste an order number twice." },
        { title: "Returns inside your rules", body: "Eligibility is checked, labels are sent and refunds start, all within the policy you set." },
        { title: "Pre-sale help that sells", body: "Sizing, stock and delivery questions answered on the product page while the shopper is still deciding." },
      ],
    },
    storeOps: {
      heading: {
        eyebrow: "Store management",
        title: "We run the store work, not just the inbox",
        body: "Support is half the job. We also build the automation behind your store: products, stock, orders and promotions, so your team stops copying data between tabs.",
      },
      platform: {
        name: "Shopify",
        body: "Built for Shopify first. We work inside your existing store and theme, and connect it to the rest of your tools.",
        tools: ["Admin API", "Shopify Flow", "Webhooks", "Custom apps", "Theme sections"],
      },
      alsoLabel: "Also connects to",
      also: ["WooCommerce", "BigCommerce", "Amazon Seller Central", "Etsy", "QuickBooks", "Google Sheets"],
      items: [
        { icon: "Store", tag: "Setup", title: "Store setup and custom apps", body: "New Shopify stores set up, messy ones cleaned up, and custom apps or theme sections built when the app store does not have what you need." },
        { icon: "Tags", tag: "Catalog", title: "Products and catalog", body: "Products, variants, prices and descriptions created or updated in bulk from a sheet or a supplier feed, with collections and tags kept tidy." },
        { icon: "Boxes", tag: "Inventory", title: "Stock kept in sync", body: "Stock levels matched across your store, marketplaces and warehouse, with an alert before a best seller runs out." },
        { icon: "Truck", tag: "Orders", title: "Orders routed and fulfilled", body: "Orders tagged, sent to the right warehouse or supplier, and tracking pushed back to the shopper without anyone copying it over." },
        { icon: "Percent", tag: "Promotions", title: "Sales and discounts on schedule", body: "Sale prices, discount codes and bundles switched on for launch day and switched off again when the sale ends." },
        { icon: "ChartColumn", tag: "Reporting", title: "One daily store report", body: "Sales, refunds, stock and support numbers pulled into one report or sheet, instead of five dashboards." },
      ],
    },
    services: {
      heading: { eyebrow: "What we deliver", title: "Services built for ecommerce" },
      items: [
        { slug: "ecommerce-customer-support", body: "Order status, returns and pre-sale questions answered in seconds on every channel." },
        { slug: "back-office-support", body: "Order edits, refunds, catalog updates and stock checks processed by automation." },
        { slug: "workforce-management", body: "Coverage planned around sales and launches, with AI taking the peak." },
        { slug: "customer-support", body: "Chat, email, phone and social messages in one queue with one history per shopper." },
        { slug: "sales-support", body: "Abandoned carts followed up and buying questions answered while intent is high." },
        { slug: "customer-experience-management", body: "Reviews and surveys turned into fixes for products, packaging and delivery." },
      ],
    },
    segments: {
      heading: { eyebrow: "Who we serve", title: "From one storefront to marketplace scale" },
      items: [
        { icon: "ShoppingCart", tag: "Own store", title: "Direct to consumer brands", body: "A support experience that sounds like your brand and scales with your ad spend." },
        { icon: "Store", tag: "Marketplaces", title: "Marketplace sellers", body: "Fast replies that protect your seller scores across every marketplace you sell on." },
        { icon: "LayoutGrid", tag: "Many brands", title: "Multi brand retail", body: "Separate voices and policies per brand, run from one system." },
        { icon: "Repeat", tag: "Recurring", title: "Subscription brands", body: "Skips, swaps, pauses and cancellations handled without a call." },
      ],
    },
    useCases: {
      heading: { eyebrow: "What the AI agents do", title: "Jobs handled before a person is needed" },
      items: [
        { channel: "Chat", title: "Where is my order", body: "Look up the order and courier status and give a real answer, not a link." },
        { channel: "Email", title: "Start a return", body: "Check eligibility, send the label and confirm when the refund will land." },
        { channel: "WhatsApp", title: "Change an address", body: "Update the address before dispatch, or tell the shopper what is still possible." },
        { channel: "Chat", title: "Sizing and stock help", body: "Answer fit and availability questions from your catalog on the product page." },
        { channel: "SMS", title: "Win back abandoned carts", body: "Follow up once, helpfully, and answer whatever stopped the checkout." },
        { channel: "Back office", title: "Request reviews", body: "Ask happy customers for a review and send unhappy ones to your team." },
      ],
    },
    journey: journey("your store, your couriers and your return policy"),
    trust: {
      heading: { eyebrow: "Security and control", title: "Careful with every order touched", body: "No certifications claimed. Here is how the work is set up." },
      points: [
        { title: "No card data handled", body: "The agents never see or store card numbers. Payments and refunds run through your payment provider." },
        { title: "Data stays in your store", body: "Order and customer details are read from your platform when needed, not copied elsewhere." },
        { title: "Limits on refunds", body: "Refunds and credits follow limits you set. Anything bigger needs a person's approval." },
        { title: "Every action logged", body: "Every refund, edit and reply is recorded against the order." },
      ],
    },
    integrations: {
      heading: { eyebrow: "Works in your stack", title: "Built on the tools stores already run" },
      items: ["Shopify", "WooCommerce", "Stripe", "QuickBooks", "HubSpot", "GoHighLevel", "WhatsApp Business", "Twilio", "Google Workspace", "REST API and webhooks"],
      note,
    },
    faq: {
      heading: { eyebrow: "Ecommerce questions", title: "What store owners ask first" },
      items: [
        { q: "Does it work with Shopify?", a: "Yes. We connect to your store so the agents can read orders, products and customers, and take the actions you allow." },
        { q: "Can you manage our Shopify store, not just the support?", a: "Yes. We automate the store work too: bulk product and price updates, stock sync across channels, order routing to your warehouse or suppliers, scheduled sales and a daily report. Anything outside the rules you set goes to your team." },
        { q: "Can it process returns?", a: "Yes, inside your return policy. It checks eligibility, sends the label and starts the refund, and flags anything unusual." },
        { q: "Will it sound like our brand?", a: "Yes. We write the tone, phrases and rules with you, and you approve them before launch." },
        { q: "What about sales days?", a: "That is where it helps most. The AI handles the surge, so your team only sees the exceptions." },
        { q: "Can it help sell, not just support?", a: "Yes. It answers buying questions on product pages and follows up on abandoned carts, politely and once." },
        { q: "How do we start?", a: "Book a free audit call. Most stores pilot order status and returns first." },
      ],
    },
    cta: { heading: { eyebrow: "Free audit", title: "See which order questions could answer themselves", body: "We look at your inbox and show you what to automate before your next sale." }, primary: audit() },
  },

  /* ----------------------------------- Logistics ------------------------------------ */
  {
    slug: "logistics",
    name: "Logistics",
    icon: "Truck",
    teaser: "Last-mile and fleet customer operations",
    tone: "lime",
    meta: {
      title: "AI customer operations for logistics and delivery",
      description: "Growtk builds AI agents for couriers, 3PLs and freight teams: tracking questions, delivery exceptions, proactive updates and shipment paperwork handled around the clock, with your team on escalation.",
    },
    hero: {
      eyebrow: "Logistics",
      title: "Every shipment tracked. Every exception handled.",
      body: "AI agents answer tracking questions from your live data, rebook failed deliveries, warn customers about delays before they ask, and clear the paperwork behind every shipment. Your team handles the exceptions that need judgment.",
      ctas: ctas(),
      stats: [
        { value: "24/7", label: "Tracking and delivery help" },
        { value: "Live", label: "Shipment status lookups" },
        { value: "Early", label: "Delay alerts before customers ask" },
      ],
    },
    problem: {
      eyebrow: "The reality",
      text: "One storm, one late truck or one wrong address creates hundreds of calls at once. Shippers, receivers and drivers all want answers, the data sits in three systems, and every missed delivery costs a second attempt.",
    },
    challenges: {
      heading: { eyebrow: "Challenges we solve", title: "Where logistics support breaks down" },
      items: [
        { icon: "CloudLightning", title: "Exception storms", body: "Weather, strikes and breakdowns create waves of contacts that arrive all at once." },
        { icon: "Network", title: "Many parties, one shipment", body: "Shippers, receivers, drivers and partners all need updates about the same parcel." },
        { icon: "EyeOff", title: "Visibility gaps", body: "Customers call because they cannot see what is happening, even when your system can." },
        { icon: "Files", title: "Paperwork load", body: "Proofs of delivery, customs forms and invoices take hours to check and file." },
        { icon: "PackageX", title: "Claims leakage", body: "Damage and loss claims stall without the right evidence collected at the start." },
        { icon: "DoorClosed", title: "Failed first delivery", body: "Nobody home means a second trip, a frustrated customer and a cost you absorb." },
      ],
    },
    inside: {
      heading: { eyebrow: "Inside the operation", title: "Coordination is the product" },
      points: [
        { title: "Shipment context on open", body: "Status, last scan, ETA and delivery notes load before the first reply." },
        { title: "Updates before the call", body: "Delays and exceptions trigger a message to the customer with a new time and options." },
        { title: "Rebooking without a person", body: "Missed deliveries are rebooked, redirected or sent to a pickup point in the same conversation." },
      ],
    },
    services: {
      heading: { eyebrow: "What we deliver", title: "Services built for logistics" },
      items: [
        { slug: "inbound-contact-center", body: "Tracking, delivery and pickup questions answered from live data at any hour." },
        { slug: "back-office-support", body: "Proofs of delivery, invoices and shipment documents checked and filed by automation." },
        { slug: "outbound-contact-center", body: "Delay alerts, delivery confirmations and rebooking calls sent before customers ask." },
        { slug: "customer-support", body: "Shippers and receivers supported on phone, chat, email and WhatsApp with one history." },
        { slug: "business-process-reengineering", body: "Claims, exceptions and handoffs between partners mapped and automated." },
        { slug: "workforce-management", body: "Coverage planned around peak seasons and exception storms, with AI absorbing the spikes." },
      ],
    },
    segments: {
      heading: { eyebrow: "Who we serve", title: "Across the delivery network" },
      items: [
        { icon: "Bike", tag: "Last mile", title: "Couriers and last mile", body: "Delivery windows, rebooking and proof of delivery handled for every parcel." },
        { icon: "Ship", tag: "Freight", title: "Freight forwarding and 3PL", body: "Shipment updates, documents and partner coordination kept moving." },
        { icon: "Warehouse", tag: "Warehousing", title: "Warehousing and distribution", body: "Inbound, outbound and stock questions answered for your clients." },
        { icon: "Truck", tag: "Fleet ops", title: "Fleet and field operations", body: "Driver check ins, job updates and customer notices automated." },
      ],
    },
    useCases: {
      heading: { eyebrow: "What the AI agents do", title: "Jobs handled before a person is needed" },
      items: [
        { channel: "Voice", title: "Where is my parcel", body: "Read the last scan and ETA and give a clear answer in plain words." },
        { channel: "SMS", title: "Delay alerts", body: "Warn the receiver about a delay with a new time and a choice of options." },
        { channel: "WhatsApp", title: "Rebook a missed delivery", body: "Offer new slots, a neighbor or a pickup point and update the route." },
        { channel: "Chat", title: "Start a damage claim", body: "Collect photos, order details and a description before the claim reaches your team." },
        { channel: "Back office", title: "File proofs of delivery", body: "Match signatures and photos to shipments and flag anything missing." },
        { channel: "Email", title: "Shipper updates", body: "Send business customers daily summaries of shipments and exceptions." },
      ],
    },
    journey: journey("your tracking data, your routes and your partners"),
    trust: {
      heading: { eyebrow: "Security and control", title: "Shipment and customer data under control", body: "No certifications claimed. Here is how the work is set up." },
      points: [
        { title: "Data stays in your systems", body: "The agents read tracking and customer data from your platform and do not keep a separate copy." },
        { title: "Only what is needed", body: "Receivers see their own shipment details and nothing else, with addresses never read out in full." },
        { title: "Claims go to a person", body: "The AI collects the evidence. Decisions on claims and compensation stay with your team." },
        { title: "Every action logged", body: "Rebookings, redirects and messages are recorded against the shipment." },
      ],
    },
    integrations: {
      heading: { eyebrow: "Works in your stack", title: "Built on the tools logistics teams already run" },
      items: ["Your TMS or WMS", "Salesforce", "HubSpot", "Twilio", "WhatsApp Business", "Google Workspace", "AWS", "REST API and webhooks"],
      note,
    },
    faq: {
      heading: { eyebrow: "Logistics questions", title: "What logistics teams ask first" },
      items: [
        { q: "Can it read our tracking data?", a: "Yes, once connected to your TMS, WMS or tracking feed. It answers from the latest scan, not a generic message." },
        { q: "Can it rebook deliveries?", a: "Yes. It offers the options you allow, such as a new slot or a pickup point, and updates the booking." },
        { q: "What about a storm or a strike?", a: "The AI messages affected customers first and handles the wave of replies, so your team is not buried." },
        { q: "Does it help business shippers too?", a: "Yes. Shippers get their own updates, summaries and a direct line for exceptions." },
        { q: "Who decides on claims?", a: "Your team. The AI collects the details and evidence so each claim arrives ready to decide." },
        { q: "How do we start?", a: "Book a free audit call. Most teams pilot tracking questions and missed delivery rebooking first." },
      ],
    },
    cta: { heading: { eyebrow: "Free audit", title: "See which delivery questions could answer themselves", body: "We look at your contact drivers and show you what to automate first." }, primary: audit() },
  },

  /* ------------------------------------ Telecom ------------------------------------- */
  {
    slug: "telecom",
    name: "Telecom",
    icon: "RadioTower",
    teaser: "Subscriber management at enterprise scale",
    tone: "lilac",
    meta: {
      title: "AI customer operations for telecom and broadband",
      description: "Growtk builds AI agents for mobile, broadband and fixed line operators: plan changes, billing questions, troubleshooting and retention handled around the clock, with complex cases sent to your team.",
    },
    hero: {
      eyebrow: "Telecom",
      title: "Subscriber support at carrier scale",
      body: "Plan changes, bill questions, slow internet and SIM swaps. AI agents handle the high volume requests on every channel from your own systems, walk customers through first line fixes, and hand the rest to your team with the diagnosis done.",
      ctas: ctas(),
      stats: [
        { value: "24/7", label: "Subscriber support" },
        { value: "One", label: "Answer on every channel" },
        { value: "Every", label: "Outage contact answered" },
      ],
    },
    problem: {
      eyebrow: "The reality",
      text: "An outage or a billing run can bring thousands of contacts in an hour, most asking the same thing. Long waits push subscribers to switch, and every inconsistent answer becomes a complaint or a dispute.",
    },
    challenges: {
      heading: { eyebrow: "Challenges we solve", title: "The telecom support equation" },
      items: [
        { icon: "Users", title: "Volume at scale", body: "Large subscriber bases mean huge, repetitive volume that never really stops." },
        { icon: "Wrench", title: "Technical depth", body: "Device, network and line issues need real troubleshooting, not a script read aloud." },
        { icon: "LogOut", title: "Churn pressure", body: "Every bad experience is a reason to switch, and switching has never been easier." },
        { icon: "Receipt", title: "Billing disputes", body: "Unexpected charges create calls, disputes and refunds that take time to resolve." },
        { icon: "Gavel", title: "Complaint handling rules", body: "Complaints must be logged and answered within set timelines, on every channel." },
        { icon: "Layers", title: "Product sprawl", body: "Bundles, add ons and promotions multiply the number of possible questions." },
      ],
    },
    inside: {
      heading: { eyebrow: "Inside the operation", title: "Consistency at carrier volume" },
      points: [
        { title: "Account context on open", body: "Plan, usage, bill and open tickets load before the first reply." },
        { title: "First line fixes done", body: "Restarts, settings and line checks are walked through step by step, with results logged." },
        { title: "Outages answered at once", body: "Customers in an affected area get the status and an estimate before they wait in a queue." },
      ],
    },
    services: {
      heading: { eyebrow: "What we deliver", title: "Services built for telecom" },
      items: [
        { slug: "inbound-contact-center", body: "Plan, bill and account questions answered on every channel at any hour." },
        { slug: "technical-support", body: "First line troubleshooting for devices, lines and broadband, with clean handoffs to your engineers." },
        { slug: "outbound-contact-center", body: "Renewal, retention and win back calls made with consent and on schedule." },
        { slug: "customer-support", body: "One history per subscriber across app, chat, phone, email and social." },
        { slug: "customer-experience-management", body: "Every conversation scored, so the reasons people call and churn are visible." },
        { slug: "back-office-support", body: "Number ports, SIM swaps and order updates processed by automation with checks." },
      ],
    },
    segments: {
      heading: { eyebrow: "Who we serve", title: "Across the operator stack" },
      items: [
        { icon: "Smartphone", tag: "Mobile", title: "Mobile operators", body: "Plans, top ups, roaming and SIM questions answered at scale." },
        { icon: "Router", tag: "Home internet", title: "Broadband and fixed line", body: "Installs, faults and speed issues triaged before an engineer is booked." },
        { icon: "Building2", tag: "Business", title: "Enterprise accounts", body: "Account changes, multi line requests and service updates handled for business customers." },
        { icon: "AppWindow", tag: "Digital", title: "Digital and add on services", body: "Streaming, security and bundle add ons supported without extra headcount." },
      ],
    },
    useCases: {
      heading: { eyebrow: "What the AI agents do", title: "Jobs handled before a person is needed" },
      items: [
        { channel: "Chat", title: "Explain a bill", body: "Break down charges line by line and open a dispute if something looks wrong." },
        { channel: "Voice", title: "Fix slow internet", body: "Run line checks and walk through router steps before booking an engineer." },
        { channel: "WhatsApp", title: "Change a plan", body: "Compare plans, confirm the change and say when it takes effect." },
        { channel: "SMS", title: "Outage updates", body: "Tell affected customers what is happening and when service should return." },
        { channel: "Voice", title: "Save a cancellation", body: "Understand why the customer wants to leave and offer the options you approve." },
        { channel: "Back office", title: "Process SIM swaps", body: "Run the identity checks you require and complete the swap, or pass it to a person." },
      ],
    },
    journey: journey("your billing, network and CRM systems"),
    trust: {
      heading: { eyebrow: "Security and control", title: "Subscriber data under control", body: "No certifications claimed. Here is how the work is set up." },
      points: [
        { title: "Data stays in your systems", body: "The agents read and update subscriber records inside your platforms without keeping a copy." },
        { title: "Identity checks first", body: "SIM swaps, ports and account changes only happen after the checks you require." },
        { title: "Complaints go to a person", body: "Formal complaints are logged with deadlines and owned by your team." },
        { title: "Every action logged", body: "Each change, lookup and reply is recorded against the account." },
      ],
    },
    integrations: {
      heading: { eyebrow: "Works in your stack", title: "Built on the tools telecom teams already run" },
      items: ["Your billing system", "Salesforce", "HubSpot", "Twilio", "Telnyx", "WhatsApp Business", "AWS", "REST API and webhooks"],
      note,
    },
    faq: {
      heading: { eyebrow: "Telecom questions", title: "What operators ask first" },
      items: [
        { q: "Can it troubleshoot technical issues?", a: "Yes, first line issues. It runs the checks and steps you define and books an engineer or escalates when they do not fix it." },
        { q: "How does it handle an outage?", a: "It tells affected customers the status and estimate right away and handles the follow up questions, so your queue stays clear." },
        { q: "Can it change plans and add ons?", a: "Yes, inside your rules. It confirms the change with the customer and updates your billing system." },
        { q: "What about SIM swaps and ports?", a: "Only after the identity checks you require. Anything that fails a check goes to your team." },
        { q: "Can it help with retention?", a: "Yes. It learns why people want to leave and offers the options you approve, then logs the outcome." },
        { q: "How do we start?", a: "Book a free audit call. Most operators pilot billing questions or outage updates first." },
      ],
    },
    cta: { heading: { eyebrow: "Free audit", title: "See which subscriber questions could answer themselves", body: "We map your top contact reasons and show you what to automate first." }, primary: audit() },
  },

  /* ----------------------------------- Healthcare ----------------------------------- */
  {
    slug: "healthcare",
    name: "Healthcare",
    icon: "HeartPulse",
    teaser: "Privacy-first patient and provider support",
    tone: "mint",
    meta: {
      title: "AI patient access and front office support for healthcare",
      description: "Growtk builds AI agents for clinics, practices and healthtech: appointment booking, reminders, intake and billing questions handled around the clock, with anything clinical routed to your staff.",
    },
    hero: {
      eyebrow: "Healthcare",
      title: "Patient support, handled with care",
      body: "AI agents answer the phone, book and move appointments, send reminders and collect intake details, around the clock. Anything clinical, urgent or sensitive goes straight to your staff, so they spend their time on patients, not phones.",
      ctas: ctas(),
      stats: [
        { value: "24/7", label: "Booking and reminders" },
        { value: "1st", label: "Ring pickup, no hold" },
        { value: "Every", label: "Clinical question to staff" },
      ],
    },
    problem: {
      eyebrow: "The reality",
      text: "Front desks spend the day on the phone booking, moving and reminding, while patients wait on hold or give up. Missed calls become missed appointments, empty slots become lost revenue, and staff burn out on work a system could do.",
    },
    challenges: {
      heading: { eyebrow: "Challenges we solve", title: "Why healthcare support is different" },
      items: [
        { icon: "Lock", title: "Privacy matters most", body: "Patient information has to be handled carefully on every call, message and record." },
        { icon: "Heart", title: "Emotional stakes", body: "Patients are often worried or unwell, so tone and patience matter as much as speed." },
        { icon: "ClipboardList", title: "Admin load", body: "Booking, intake, insurance and billing questions take staff away from patient care." },
        { icon: "PhoneMissed", title: "Phones that never stop", body: "Busy lines mean missed calls, and missed calls mean patients who book elsewhere." },
        { icon: "Receipt", title: "Billing questions", body: "Statements, coverage and payment questions slow down the revenue cycle." },
        { icon: "CalendarX", title: "No shows", body: "Forgotten appointments leave empty slots that could have gone to another patient." },
      ],
    },
    inside: {
      heading: { eyebrow: "Inside the operation", title: "Admin weight, lifted off clinical staff" },
      points: [
        { title: "Booking without hold music", body: "Calls and messages are answered at once, and appointments are booked straight into your calendar." },
        { title: "Reminders that cut no shows", body: "Patients get reminders and can confirm, cancel or move with one reply." },
        { title: "Clinical questions to staff", body: "The AI never gives medical advice. Symptoms, results and urgent concerns go to a person right away." },
      ],
    },
    services: {
      heading: { eyebrow: "What we deliver", title: "Services built for healthcare" },
      items: [
        { slug: "inbound-contact-center", body: "Calls answered at once for booking, directions, hours and general questions." },
        { slug: "back-office-support", body: "Intake forms, insurance details and records requests processed by automation with checks." },
        { slug: "outbound-contact-center", body: "Reminders, recalls and follow up calls made on schedule." },
        { slug: "customer-support", body: "Patient messages on phone, text, email and portal handled with one history." },
        { slug: "technical-support", body: "Help for patients and providers using your healthtech app or portal." },
        { slug: "customer-experience-management", body: "Surveys after visits, with low scores sent to the practice manager the same day." },
      ],
    },
    segments: {
      heading: { eyebrow: "Who we serve", title: "Across the care ecosystem" },
      items: [
        { icon: "Stethoscope", tag: "Practices", title: "Clinics and specialty practices", body: "Front desk calls, booking and reminders handled so staff can focus on patients." },
        { icon: "Hospital", tag: "Provider groups", title: "Hospitals and provider groups", body: "Patient access lines and scheduling across many locations and departments." },
        { icon: "Smile", tag: "Dental", title: "Dental practices", body: "New patient inquiries, recalls and appointment changes answered at any hour." },
        { icon: "MonitorSmartphone", tag: "Healthtech", title: "Digital health companies", body: "User support, onboarding and account help for your app or platform." },
      ],
    },
    useCases: {
      heading: { eyebrow: "What the AI agents do", title: "Jobs handled before a person is needed" },
      items: [
        { channel: "Voice", title: "Book an appointment", body: "Find a slot with the right provider and book it into your calendar." },
        { channel: "SMS", title: "Send reminders", body: "Remind patients and let them confirm, cancel or move with one reply." },
        { channel: "Chat", title: "Answer practice questions", body: "Hours, location, parking, accepted insurance and what to bring." },
        { channel: "Email", title: "Collect intake details", body: "Send intake forms before the visit and chase the ones not completed." },
        { channel: "Voice", title: "Recall patients", body: "Call patients due for a checkup or follow up and book them in." },
        { channel: "Back office", title: "Route clinical messages", body: "Spot clinical or urgent messages and send them to the right staff member." },
      ],
    },
    journey: journey("your calendar, your practice software and your rules"),
    trust: {
      heading: { eyebrow: "Privacy and control", title: "Privacy first by design", body: "No certifications claimed, and no vendor can hold one for this. Here is how the work is set up." },
      points: [
        { title: "Data stays in your systems", body: "The agents read and write to your practice software and calendar, and do not keep their own patient records." },
        { title: "Only what is needed", body: "Agents collect the minimum details a task needs, and staff see only what their role requires." },
        { title: "No medical advice", body: "Anything clinical, urgent or sensitive goes to your staff. The AI never diagnoses or advises." },
        { title: "Every action logged", body: "Bookings, changes and messages are recorded, so you can see who did what and when." },
      ],
    },
    integrations: {
      heading: { eyebrow: "Works in your stack", title: "Built on the tools practices already run" },
      items: ["Your practice management system", "Calendly", "Google Workspace", "Twilio", "Vapi", "Retell", "AWS", "REST API and webhooks"],
      note,
    },
    faq: {
      heading: { eyebrow: "Healthcare questions", title: "What practices ask first" },
      items: [
        { q: "Does the AI give medical advice?", a: "No. It handles booking, reminders and admin questions. Anything clinical or urgent goes straight to your staff." },
        { q: "Are you HIPAA certified?", a: "No vendor can be HIPAA certified, because no such certification exists. We describe exactly how data is handled: it stays in your systems, access is by role and every action is logged." },
        { q: "Can it book into our calendar?", a: "Yes. We connect to your scheduling system so it books, moves and cancels real appointments." },
        { q: "What about emergencies?", a: "The agent tells the caller to contact emergency services when needed and alerts your staff. It never tries to handle an emergency itself." },
        { q: "Will patients know it is AI?", a: "Yes, it introduces itself clearly, and patients can ask for a person at any time." },
        { q: "How do we start?", a: "Book a free audit call. Most practices pilot booking calls and reminders first." },
      ],
    },
    cta: { heading: { eyebrow: "Free audit", title: "See how many calls your front desk could get back", body: "We look at your calls and bookings and show you what to automate first." }, primary: audit() },
  },

  /* -------------------------------------- SaaS -------------------------------------- */
  {
    slug: "saas",
    name: "SaaS",
    icon: "Cloud",
    teaser: "Technical onboarding and retention support",
    tone: "rose",
    meta: {
      title: "AI customer support for SaaS companies",
      description: "Growtk builds AI agents for SaaS teams: tier 1 technical support, onboarding help, billing questions and renewal outreach handled around the clock, with bugs and complex cases sent to your team.",
    },
    hero: {
      eyebrow: "SaaS",
      title: "Support that keeps up with every release",
      body: "AI agents answer how to questions from your docs, help new users reach their first win, sort billing and access issues, and send real bugs to your engineers with steps to reproduce. Your team spends its time on the hard problems.",
      ctas: ctas(),
      stats: [
        { value: "24/7", label: "Help in every time zone" },
        { value: "1", label: "Knowledge base for AI and people" },
        { value: "Every", label: "Bug filed with steps to reproduce" },
      ],
    },
    problem: {
      eyebrow: "The reality",
      text: "You ship every week, and support has to keep up. Users across time zones get stuck in the first days, how to tickets bury your team, and real bugs reach engineering late and without details. Churn starts with a slow answer.",
    },
    challenges: {
      heading: { eyebrow: "Challenges we solve", title: "The SaaS support squeeze" },
      items: [
        { icon: "Zap", title: "Product changes weekly", body: "New features and changes make yesterday's answers wrong unless the docs keep up." },
        { icon: "Repeat", title: "Retention is the business", body: "Every slow answer is a small reason not to renew." },
        { icon: "Globe", title: "Global users, lean team", body: "Users work in every time zone. Your support team does not." },
        { icon: "Rocket", title: "First days decide", body: "Users who do not reach their first win in the first week rarely come back." },
        { icon: "Bug", title: "Escalations get stuck", body: "Bugs reach engineers without steps to reproduce, so they bounce back and forth." },
        { icon: "BookX", title: "Help center debt", body: "Docs fall behind the product, so users open tickets for answers that should be self serve." },
      ],
    },
    inside: {
      heading: { eyebrow: "Inside the operation", title: "A support team that keeps up with weekly releases" },
      points: [
        { title: "Account context on open", body: "Plan, usage, recent errors and past tickets load before the first reply." },
        { title: "Answers from your docs", body: "How to questions are answered from your knowledge base, and gaps are flagged when a release changes things." },
        { title: "Bugs filed properly", body: "Real bugs reach your tracker with steps, environment and screenshots, ready for an engineer." },
      ],
    },
    services: {
      heading: { eyebrow: "What we deliver", title: "Services built for SaaS" },
      items: [
        { slug: "technical-support", body: "Tier 1 troubleshooting from your docs, with clean, detailed handoffs to engineering." },
        { slug: "customer-support", body: "Billing, access and account questions handled on chat, email and in app." },
        { slug: "outbound-contact-center", body: "Onboarding check ins, renewal reminders and win back outreach on schedule." },
        { slug: "sales-support", body: "Trial users qualified, demos booked and buying questions answered fast." },
        { slug: "customer-experience-management", body: "Every conversation scored and tagged, so product gets a clear view of what hurts." },
        { slug: "lead-generation", body: "Inbound signups and demo requests captured, qualified and routed in seconds." },
      ],
    },
    segments: {
      heading: { eyebrow: "Who we serve", title: "From first customers to scale up" },
      items: [
        { icon: "Sprout", tag: "Early stage", title: "Early stage startups", body: "Support from day one without hiring a support team before you need one." },
        { icon: "TrendingUp", tag: "Scale up", title: "Scale ups", body: "Volume grows faster than hiring. The AI absorbs it while your team stays small." },
        { icon: "Building2", tag: "Enterprise", title: "Enterprise SaaS", body: "Account specific answers and clean escalation paths for large customers." },
        { icon: "Code", tag: "Developers", title: "Developer and API platforms", body: "Docs based answers for developers, with real bugs sent to engineering." },
      ],
    },
    useCases: {
      heading: { eyebrow: "What the AI agents do", title: "Jobs handled before a person is needed" },
      items: [
        { channel: "Chat", title: "Answer how to questions", body: "Guide users step by step from your docs, with links to the right page." },
        { channel: "Email", title: "Fix access issues", body: "Reset access, resend invites and explain permissions inside your rules." },
        { channel: "Chat", title: "Billing and plan changes", body: "Explain invoices, change plans and update payment methods through your billing tool." },
        { channel: "Email", title: "Onboarding check ins", body: "Nudge new users who stalled and help them reach their first win." },
        { channel: "Back office", title: "File bugs properly", body: "Collect steps, environment and screenshots and open a ticket for engineering." },
        { channel: "Voice", title: "Renewal reminders", body: "Remind account owners about renewals and book a call when they have questions." },
      ],
    },
    journey: journey("your product, your docs and your helpdesk"),
    trust: {
      heading: { eyebrow: "Security and control", title: "Secure access to the systems you trust us with", body: "No certifications claimed. Here is how the work is set up." },
      points: [
        { title: "Data stays in your tools", body: "The agents work inside your helpdesk, CRM and billing tool without keeping their own copy of customer data." },
        { title: "Least access", body: "Agents get only the permissions their tasks need, and you can revoke them at any time." },
        { title: "Hard cases go to a person", body: "Security reports, data requests and angry customers go to your team." },
        { title: "Every action logged", body: "Each answer, change and escalation is recorded against the account." },
      ],
    },
    integrations: {
      heading: { eyebrow: "Works in your stack", title: "Built on the tools SaaS teams already run" },
      items: ["HubSpot", "Salesforce", "Stripe", "Slack", "Google Workspace", "n8n", "AWS", "REST API and webhooks"],
      note,
    },
    faq: {
      heading: { eyebrow: "SaaS questions", title: "What SaaS teams ask first" },
      items: [
        { q: "How does it keep up with releases?", a: "It answers from your knowledge base, and we flag articles a release affects so they get updated before users ask." },
        { q: "Can it handle technical questions?", a: "Yes, tier 1. It troubleshoots from your docs and sends anything deeper to your engineers with full details." },
        { q: "Will engineers get better bug reports?", a: "Yes. Every bug arrives with steps to reproduce, environment details and screenshots where possible." },
        { q: "Can it help with onboarding?", a: "Yes. It checks in with new users who stall and walks them to their first win." },
        { q: "Does it work in our app?", a: "Yes, through your in app chat or helpdesk widget, plus email and other channels you use." },
        { q: "How do we start?", a: "Book a free audit call. Most SaaS teams pilot how to questions and access issues first." },
      ],
    },
    cta: { heading: { eyebrow: "Free audit", title: "See which tickets could answer themselves", body: "We look at your ticket mix and show you what to automate first." }, primary: audit() },
  },
];

export const industryPageBySlug = (slug: string) => industryPages.find((p) => p.slug === slug);

/** The /industries hub. */
export const industriesHub = {
  meta: {
    title: "Industries",
    description: "Growtk builds AI agents and automation for banking and fintech, ride hailing, ecommerce, logistics, telecom, healthcare and SaaS, set up around each industry's systems, rules and customers.",
  },
  hero: {
    eyebrow: "Industries we serve",
    title: "Customer operations built for your industry",
    body: "Every industry has its own rush hours, its own rules and its own hard cases. We set up AI agents and automation around yours, inside the systems you already run, with your team on escalation.",
    ctas: [
      { label: "Book a free audit", href: "/contact", variant: "primary" },
      { label: "See our services", href: "/services", variant: "secondary" },
    ] as Cta[],
  },
  gridHeading: {
    eyebrow: "Pick your industry",
    title: "Seven industries, one way of working",
    body: "Each page shows the problems we solve, the jobs the AI agents take on and how the work is kept safe.",
  } as SectionHeading,
  faq: {
    heading: { eyebrow: "Before you book", title: "What teams ask about industries" } as SectionHeading,
    items: [
      { q: "Do you only work with these seven industries?", a: "No. These are the industries we have built playbooks for. If your business answers calls, chats and requests at volume, the same approach usually fits." },
      { q: "Do you have clients in every one of them?", a: "Not yet. We are a young company and we only show work that is real. On each page we describe what we build and how, not past results." },
      { q: "Do you replace our team?", a: "No. AI agents take the routine volume, and your team handles escalations and the cases that need judgment." },
      { q: "How do we start?", a: "Book a free audit call. We map your channels and volume and pick one queue to pilot." },
    ] as FaqItem[],
  },
  cta: {
    heading: { eyebrow: "Free audit", title: "See what your industry's busiest queue could look like", body: "Thirty minutes. We map your channels and show you what to automate first." } as SectionHeading,
    primary: { label: "Book a free audit", href: "/contact", variant: "primary" } as Cta,
  },
  labels: {
    breadcrumb: "Industries" as const,
    services: "Services for this industry",
    learnMore: "Learn more",
    doneLabel: "AI handled",
    explore: "Explore industry",
    faqCta: { label: "Ask us anything", href: "/contact" } as Cta,
  },
};
