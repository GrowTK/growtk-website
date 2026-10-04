/**
 * Yetti case-study deck: slide copy, project facts, and the demo dataset the
 * live product slides run on. The product slides are a working copy of the
 * real Yetti dashboard (Inbox, Booking System, Check-In, CRM), so the demo
 * data is shaped like its tables: activities, bookings, guests, conversations.
 *
 * Days are stored as offsets from today (0 = today, -1 = yesterday) and times
 * as minutes from midnight, turned into real dates in the browser, so the
 * calendar always opens on today whenever someone views the deck.
 */
import type { SlideCopy } from "./corvinn";

export type Platform = "whatsapp" | "instagram" | "messenger" | "telegram" | "gmail" | "sms";

export type BookingSource = "Booking widget" | "AI inbox" | "GetYourGuide" | "Viator" | "Walk-in" | "Phone";

export type BookingStatus = "confirmed" | "pending" | "cancelled";

export type PaymentStatus = "paid" | "deposit" | "unpaid";

export type DemoActivity = {
  id: string;
  name: string;
  /** Short name for tight calendar blocks. */
  short: string;
  /** Block fill on the calendar, a literal hex. */
  color: string;
  /** Text color that clears 4.5:1 on `color`. */
  ink: string;
  startMinutes: number[];
  durationMinutes: number;
  capacity: number;
  /** Price per guest, USD. */
  price: number;
};

export type DemoContact = {
  id: string;
  name: string;
  email: string | null;
  phone: string | null;
  source: BookingSource;
  addedDaysAgo: number;
  /** Signed a waiver on any booking. */
  waiver: boolean;
  tags: string[];
};

export type DemoBooking = {
  id: string;
  /** Last four characters of the BK-YYYYMMDD-XXXX reference. */
  code: string;
  contactId: string;
  activityId: string;
  /** Days from today of the trip. */
  day: number;
  startMinute: number;
  guests: number;
  status: BookingStatus;
  payment: PaymentStatus;
  waiverSigned: boolean;
  checkedIn: boolean;
  source: BookingSource;
  createdDaysAgo: number;
};

export type DemoMessage = {
  id: string;
  from: "guest" | "ai" | "staff";
  text: string;
  minutesAgo: number;
  /** A booking confirmation card the assistant attached. */
  bookingId?: string;
};

/** One scripted turn: what the guest says next, and what Yetti answers. */
export type ScriptStep = {
  guest: string;
  ai: string;
  /** When set, Yetti's reply creates this booking through the store. */
  book?: { activityId: string; day: number; startMinute: number; guests: number };
};

export type DemoConversation = {
  id: string;
  /** Null until the guest becomes a CRM contact; `guestName` is shown meanwhile. */
  contactId: string | null;
  guestName: string;
  handle: string;
  platform: Platform;
  aiEnabled: boolean;
  unread: number;
  messages: DemoMessage[];
  /** Guest turns the viewer can send, in order. */
  script?: ScriptStep[];
};

export const yettiDeck = {
  workspaceName: "Coral Bay Boat Tours",
  workspaceInitials: "CB",
  userName: "Maya Santos",
  userEmail: "maya@coralbaytours.com",
  logo: { src: "/ingested/yetti/face.png", alt: "Yetti" },

  slides: {
    cover: { id: "cover", title: "Yetti", summary: "The project at a glance", thumb: "/ingested/yetti/slides/cover.jpg" },
    overview: { id: "overview", title: "Overview", summary: "What it is, who uses it, the stack, and every channel it answers", thumb: "/ingested/yetti/slides/overview.jpg" },
    dashboard: {
      id: "dashboard",
      thumb: "/ingested/yetti/slides/dashboard.jpg",
      title: "Dashboard",
      summary: "Today across every module: guests, bookings, contacts, conversations",
      hint: "Live numbers. Book a trip on the next slides and watch these move.",
    },
    inbox: {
      id: "inbox",
      thumb: "/ingested/yetti/slides/inbox.jpg",
      title: "AI inbox",
      summary: "One inbox for WhatsApp, Instagram, Messenger, Telegram and email",
      hint: "Open the WhatsApp chat and send the guest's next message. Yetti answers and books it.",
    },
    booking: {
      id: "booking",
      thumb: "/ingested/yetti/slides/booking.jpg",
      title: "Booking system",
      summary: "Day and week calendar, every departure with seats left",
      hint: "Click a departure to see who is on it, or hit New Booking.",
    },
    checkin: {
      id: "checkin",
      thumb: "/ingested/yetti/slides/checkin.jpg",
      title: "Check-in",
      summary: "Look up a booking reference, sign the waiver, check the group in",
      hint: "Pick one of today's references, sign the waiver, then check the guests in.",
    },
    crm: {
      id: "crm",
      thumb: "/ingested/yetti/slides/crm.jpg",
      title: "CRM",
      summary: "Every guest from every channel, with their bookings and chats",
      hint: "Search, or click a guest to open their file.",
    },
    platform: { id: "platform", title: "The rest of the platform", summary: "Rentals, kiosks, point of sale, OTAs, voice agents and more", thumb: "/ingested/yetti/slides/platform.jpg" },
    closing: { id: "closing", title: "Start a project", summary: "Want software like this for your business", thumb: "/ingested/yetti/slides/closing.jpg" },
  } satisfies Record<string, SlideCopy>,

  overview: {
    eyebrow: "Overview",
    title: "The front desk that never sleeps, wired into the booking system",
    body: "Tour and charter operators lose bookings in their DMs. Yetti answers every channel with the operator's own knowledge base, checks live seats, books the trip and sends the payment link. The booking lands on the same calendar, waiver flow and check-in desk the crew already uses.",
    image: { src: "/ingested/yetti/boat-checkin.jpg", alt: "Guests showing a booking QR code at a dockside check-in desk" },
    /** The interactive channel orbit on the overview slide. */
    orbit: {
      label: "Messaging channels Yetti answers, around the Yetti assistant",
      hint: "Tap a channel to send Yetti a message.",
      center: "Yetti",
      channels: {
        whatsapp: { name: "WhatsApp", question: "Any seats on the sunset cruise tonight?", answer: "Yes, 6 left at 5:00 PM. Want me to hold 2?" },
        instagram: { name: "Instagram", question: "Do you do private charters for a birthday?", answer: "We do. Private speedboat, up to 8 guests, 4 hours. Which date?" },
        messenger: { name: "Messenger", question: "Is snorkel gear included?", answer: "Masks, fins and a guide are included on the reef trip." },
        telegram: { name: "Telegram", question: "Can I move my booking to Friday?", answer: "Done. You're on Friday 9:00 AM, same seats." },
        gmail: { name: "Email", question: "Group of 14 for a company day out", answer: "Two boats, back to back at 9:00. Quote and deposit link sent." },
      } satisfies Record<Exclude<Platform, "sms">, { name: string; question: string; answer: string }>,
    },
    facts: [
      { label: "What it is", value: "Multi-tenant AI workspace for tour, charter, rental and activity operators" },
      { label: "Who uses it", value: "Owners, front desk staff, captains, and guests at the check-in kiosk" },
      { label: "Our role", value: "Engineering on the web app and the AI agent server" },
      { label: "Built", value: "Since October 2025, shipping weekly" },
    ],
    stack: [
      "Next.js 16",
      "React 19",
      "Tailwind CSS v4",
      "Supabase Postgres",
      "pgvector RAG",
      "Row level security",
      "Agno agents on FastAPI",
      "OpenAI",
      "Stripe Connect",
      "Resend",
      "Telnyx voice",
    ],
  },

  platform: {
    eyebrow: "Also in the box",
    title: "Everything an operator runs after the guest says yes",
    body: "The slides showed the screens the front desk lives in. Around them sit the modules that run the dock, the fleet and the money.",
    modules: [
      { icon: "Code2", title: "Embeddable booking widget", body: "Date, time, guests, add-ons and payment in five steps, on the operator's own site, with affiliate links built in." },
      { icon: "Sailboat", title: "Rentals", body: "Fleet, item types, locations and maintenance, with its own calendar and widget." },
      { icon: "Tablet", title: "Self-service kiosk", body: "Tablet check-in with waiver signing, locked to the dock." },
      { icon: "Anchor", title: "Captain mode", body: "Full screen manifest with pre and post trip checklists." },
      { icon: "Globe", title: "OTA channels", body: "GetYourGuide and Viator bookings in the same calendar." },
      { icon: "ShoppingCart", title: "Point of sale", body: "Sell add-ons and merch at the desk." },
      { icon: "Share2", title: "Affiliates", body: "Hotel and partner commissions, tracked per link." },
      { icon: "Mail", title: "Campaigns", body: "Email campaigns and birthday offers through Resend." },
      { icon: "PhoneCall", title: "Voice agents", body: "AI phone agents on their own numbers, answering from the same knowledge base." },
    ],
  },

  closing: {
    eyebrow: "Your turn",
    title: "Want an AI front desk running your business",
    body: "We build custom systems on the same stack, with the same care for the screens people use every day.",
    primary: { label: "Start a project", href: "/contact" },
    secondary: { label: "Back to all work", href: "/#work" },
  },

  /** Centered modal shown when someone clicks a screen or action this demo doesn't include. */
  walkthrough: {
    eyebrow: "In the full product",
    /** `{feature}` is replaced with what they clicked. */
    title: "{feature} is part of the full Yetti build",
    body: "This demo covers the screens a front desk uses most. In a 30 minute walkthrough we run the whole system with you, on your kind of trips.",
    points: ["Every module, live, with real bookings", "How the AI would answer your guests", "A straight answer on timeline and cost"],
    primary: { label: "Book a full walkthrough", href: "/contact" },
    secondary: "Keep exploring the demo",
  },

  activities: [
    { id: "a1", name: "Sunset Catamaran Cruise", short: "Sunset Cruise", color: "#f59e0b", ink: "#422006", startMinutes: [1020], durationMinutes: 150, capacity: 24, price: 89 },
    { id: "a2", name: "Reef Snorkel Speedboat", short: "Reef Snorkel", color: "#2d6695", ink: "#ffffff", startMinutes: [540, 810], durationMinutes: 180, capacity: 12, price: 119 },
    { id: "a3", name: "Private Speedboat Charter", short: "Private Charter", color: "#0f766e", ink: "#ffffff", startMinutes: [660], durationMinutes: 240, capacity: 8, price: 95 },
    { id: "a4", name: "Mangrove Kayak Tour", short: "Kayak Tour", color: "#65a30d", ink: "#ffffff", startMinutes: [480, 900], durationMinutes: 120, capacity: 10, price: 55 },
    { id: "a5", name: "Discover Scuba Dive", short: "Scuba Dive", color: "#7c3aed", ink: "#ffffff", startMinutes: [600], durationMinutes: 210, capacity: 6, price: 149 },
  ] as DemoActivity[],

  contacts: [
    { id: "c1", name: "Sofia Marino", email: "sofia.marino@gmail.com", phone: "+39 347 220 1184", source: "AI inbox", addedDaysAgo: 2, waiver: true, tags: ["Repeat"] },
    { id: "c2", name: "James Whitaker", email: "j.whitaker@outlook.com", phone: "+44 7700 900412", source: "Booking widget", addedDaysAgo: 5, waiver: true, tags: [] },
    { id: "c3", name: "Aiko Tanaka", email: "aiko.t@icloud.com", phone: null, source: "GetYourGuide", addedDaysAgo: 9, waiver: false, tags: [] },
    { id: "c4", name: "Lucas Oliveira", email: "lucas.oliveira@gmail.com", phone: "+55 21 98810 4471", source: "AI inbox", addedDaysAgo: 1, waiver: false, tags: [] },
    { id: "c5", name: "Emma Fischer", email: "emma.fischer@web.de", phone: "+49 151 2384 9921", source: "Viator", addedDaysAgo: 14, waiver: true, tags: ["Repeat"] },
    { id: "c6", name: "Noah Bennett", email: "noahb@me.com", phone: "+1 415 555 0193", source: "Booking widget", addedDaysAgo: 3, waiver: true, tags: [] },
    { id: "c7", name: "Chloe Dubois", email: "chloe.dubois@orange.fr", phone: "+33 6 12 48 90 33", source: "AI inbox", addedDaysAgo: 0, waiver: false, tags: [] },
    { id: "c8", name: "Mateo Garcia", email: "mateo.garcia@gmail.com", phone: "+34 612 448 120", source: "Walk-in", addedDaysAgo: 0, waiver: true, tags: [] },
    { id: "c9", name: "Olivia Hart", email: "olivia.hart@gmail.com", phone: "+61 412 339 870", source: "Booking widget", addedDaysAgo: 21, waiver: true, tags: ["Repeat", "VIP"] },
    { id: "c10", name: "Daniel Kowalski", email: "d.kowalski@wp.pl", phone: null, source: "Viator", addedDaysAgo: 6, waiver: false, tags: [] },
    { id: "c11", name: "Priya Nair", email: "priya.nair@gmail.com", phone: "+91 98201 33145", source: "AI inbox", addedDaysAgo: 4, waiver: true, tags: [] },
    { id: "c12", name: "Harbor View Resort", email: "concierge@harborviewresort.com", phone: "+1 305 555 0148", source: "Phone", addedDaysAgo: 40, waiver: false, tags: ["Partner"] },
    { id: "c13", name: "Ethan Brooks", email: "ethan.brooks@yahoo.com", phone: "+1 646 555 0127", source: "Booking widget", addedDaysAgo: 11, waiver: true, tags: [] },
    { id: "c14", name: "Freya Larsen", email: "freya.larsen@gmail.com", phone: "+45 22 81 47 90", source: "GetYourGuide", addedDaysAgo: 8, waiver: true, tags: [] },
  ] as DemoContact[],

  bookings: [
    // Today
    { id: "b1", code: "7Q2M", contactId: "c2", activityId: "a2", day: 0, startMinute: 540, guests: 4, status: "confirmed", payment: "paid", waiverSigned: true, checkedIn: true, source: "Booking widget", createdDaysAgo: 5 },
    { id: "b2", code: "K8DX", contactId: "c3", activityId: "a2", day: 0, startMinute: 540, guests: 2, status: "confirmed", payment: "paid", waiverSigned: false, checkedIn: false, source: "GetYourGuide", createdDaysAgo: 9 },
    { id: "b3", code: "R4NV", contactId: "c6", activityId: "a3", day: 0, startMinute: 660, guests: 6, status: "confirmed", payment: "deposit", waiverSigned: true, checkedIn: false, source: "Booking widget", createdDaysAgo: 3 },
    { id: "b4", code: "M2PL", contactId: "c4", activityId: "a1", day: 0, startMinute: 1020, guests: 2, status: "confirmed", payment: "paid", waiverSigned: false, checkedIn: false, source: "AI inbox", createdDaysAgo: 1 },
    { id: "b5", code: "T9WC", contactId: "c5", activityId: "a1", day: 0, startMinute: 1020, guests: 3, status: "confirmed", payment: "paid", waiverSigned: true, checkedIn: false, source: "Viator", createdDaysAgo: 14 },
    { id: "b6", code: "H3JB", contactId: "c8", activityId: "a4", day: 0, startMinute: 480, guests: 2, status: "confirmed", payment: "paid", waiverSigned: true, checkedIn: true, source: "Walk-in", createdDaysAgo: 0 },
    { id: "b7", code: "Z5FA", contactId: "c11", activityId: "a5", day: 0, startMinute: 600, guests: 2, status: "confirmed", payment: "paid", waiverSigned: true, checkedIn: true, source: "AI inbox", createdDaysAgo: 4 },
    { id: "b8", code: "P6EY", contactId: "c13", activityId: "a2", day: 0, startMinute: 810, guests: 3, status: "pending", payment: "unpaid", waiverSigned: false, checkedIn: false, source: "Booking widget", createdDaysAgo: 0 },
    // Tomorrow and on
    { id: "b9", code: "L7GU", contactId: "c9", activityId: "a3", day: 1, startMinute: 660, guests: 8, status: "confirmed", payment: "paid", waiverSigned: true, checkedIn: false, source: "Booking widget", createdDaysAgo: 2 },
    { id: "b10", code: "W1KS", contactId: "c14", activityId: "a2", day: 1, startMinute: 540, guests: 2, status: "confirmed", payment: "paid", waiverSigned: false, checkedIn: false, source: "GetYourGuide", createdDaysAgo: 8 },
    { id: "b11", code: "C8HN", contactId: "c10", activityId: "a1", day: 1, startMinute: 1020, guests: 4, status: "confirmed", payment: "paid", waiverSigned: false, checkedIn: false, source: "Viator", createdDaysAgo: 6 },
    { id: "b12", code: "D4QT", contactId: "c12", activityId: "a1", day: 2, startMinute: 1020, guests: 12, status: "pending", payment: "deposit", waiverSigned: false, checkedIn: false, source: "Phone", createdDaysAgo: 1 },
    { id: "b13", code: "F2VR", contactId: "c1", activityId: "a5", day: 2, startMinute: 600, guests: 2, status: "confirmed", payment: "paid", waiverSigned: true, checkedIn: false, source: "AI inbox", createdDaysAgo: 2 },
    { id: "b14", code: "N6MZ", contactId: "c6", activityId: "a4", day: 3, startMinute: 900, guests: 4, status: "confirmed", payment: "paid", waiverSigned: false, checkedIn: false, source: "Booking widget", createdDaysAgo: 3 },
    { id: "b15", code: "S3YD", contactId: "c13", activityId: "a2", day: 4, startMinute: 810, guests: 5, status: "confirmed", payment: "deposit", waiverSigned: false, checkedIn: false, source: "Booking widget", createdDaysAgo: 0 },
    { id: "b16", code: "G9LK", contactId: "c5", activityId: "a3", day: 5, startMinute: 660, guests: 4, status: "confirmed", payment: "paid", waiverSigned: true, checkedIn: false, source: "Viator", createdDaysAgo: 4 },
    // Past
    { id: "b17", code: "A5XE", contactId: "c9", activityId: "a1", day: -1, startMinute: 1020, guests: 2, status: "confirmed", payment: "paid", waiverSigned: true, checkedIn: true, source: "Booking widget", createdDaysAgo: 12 },
    { id: "b18", code: "J2RC", contactId: "c1", activityId: "a2", day: -1, startMinute: 540, guests: 2, status: "confirmed", payment: "paid", waiverSigned: true, checkedIn: true, source: "AI inbox", createdDaysAgo: 2 },
    { id: "b19", code: "Y8BW", contactId: "c5", activityId: "a4", day: -2, startMinute: 480, guests: 3, status: "confirmed", payment: "paid", waiverSigned: true, checkedIn: true, source: "Viator", createdDaysAgo: 14 },
    { id: "b20", code: "E4TF", contactId: "c2", activityId: "a1", day: -3, startMinute: 1020, guests: 4, status: "cancelled", payment: "unpaid", waiverSigned: false, checkedIn: false, source: "Booking widget", createdDaysAgo: 5 },
    { id: "b21", code: "Q1NH", contactId: "c11", activityId: "a2", day: -4, startMinute: 810, guests: 2, status: "confirmed", payment: "paid", waiverSigned: true, checkedIn: true, source: "AI inbox", createdDaysAgo: 4 },
    { id: "b22", code: "V7DM", contactId: "c9", activityId: "a5", day: -6, startMinute: 600, guests: 2, status: "confirmed", payment: "paid", waiverSigned: true, checkedIn: true, source: "Booking widget", createdDaysAgo: 21 },
  ] as DemoBooking[],

  conversations: [
    {
      id: "v1",
      contactId: null,
      guestName: "Hannah Weber",
      handle: "+49 160 448 2019",
      platform: "whatsapp",
      aiEnabled: true,
      unread: 1,
      messages: [{ id: "v1m1", from: "guest", text: "Hi! We're in town until Sunday. Do you have a boat trip with snorkeling?", minutesAgo: 2 }],
      script: [
        {
          guest: "Hi! We're in town until Sunday. Do you have a boat trip with snorkeling?",
          ai: "Hi Hannah! Our Reef Snorkel Speedboat runs at 9:00 AM and 1:30 PM, 3 hours, $119 per guest with masks, fins and a guide included. Tomorrow at 9:00 AM still has seats. How many of you are coming?",
        },
        {
          guest: "We're 3 adults. Tomorrow at 9 works!",
          ai: "Booked: Reef Snorkel Speedboat, tomorrow at 9:00 AM, 3 guests, $357. Here's your confirmation and payment link. Waivers can be signed from the same link before you arrive.",
          book: { activityId: "a2", day: 1, startMinute: 540, guests: 3 },
        },
        {
          guest: "Amazing, paid! Where do we meet?",
          ai: "Thank you! Meet at Pier 3, Coral Bay Marina, 20 minutes before departure. Show the QR code in your confirmation at the check-in desk.",
        },
      ],
    },
    {
      id: "v2",
      contactId: "c7",
      guestName: "Chloe Dubois",
      handle: "@chloe.voyage",
      platform: "instagram",
      aiEnabled: true,
      unread: 2,
      messages: [
        { id: "v2m1", from: "guest", text: "Bonjour! Is the sunset cruise good for kids?", minutesAgo: 34 },
        { id: "v2m2", from: "ai", text: "Bonjour Chloe! Yes, kids of every age are welcome. Under 4s ride free and we have child life jackets on board.", minutesAgo: 33 },
        { id: "v2m3", from: "guest", text: "Perfect. Can we bring our own cake? It's my son's birthday", minutesAgo: 12 },
      ],
      script: [
        {
          guest: "Perfect. Can we bring our own cake? It's my son's birthday",
          ai: "Of course, and happy birthday to him! The crew will keep it cool and bring it out at sunset. Want me to book 2 adults and 1 child for tonight at 5:00 PM?",
        },
        {
          guest: "Yes please!",
          ai: "Done: Sunset Catamaran Cruise, tonight at 5:00 PM, 3 guests. Your confirmation and payment link are on the way. See you at Pier 1!",
          book: { activityId: "a1", day: 0, startMinute: 1020, guests: 3 },
        },
      ],
    },
    {
      id: "v3",
      contactId: "c4",
      guestName: "Lucas Oliveira",
      handle: "Lucas Oliveira",
      platform: "messenger",
      aiEnabled: true,
      unread: 0,
      messages: [
        { id: "v3m1", from: "guest", text: "Do I need to bring anything for the sunset cruise?", minutesAgo: 95 },
        { id: "v3m2", from: "ai", text: "Just sunscreen and a light jacket for the ride back. Drinks and snacks are on board.", minutesAgo: 94 },
        { id: "v3m3", from: "guest", text: "Great, thanks!", minutesAgo: 90 },
      ],
    },
    {
      id: "v4",
      contactId: "c12",
      guestName: "Harbor View Resort",
      handle: "concierge@harborviewresort.com",
      platform: "gmail",
      aiEnabled: false,
      unread: 1,
      messages: [
        { id: "v4m1", from: "guest", text: "Hi team, we'd like to hold the sunset cruise for a wedding party of 12 on Saturday. Can you send an invoice for the deposit?", minutesAgo: 180 },
        { id: "v4m2", from: "staff", text: "Hi! Holding 12 seats for you now. The deposit invoice follows in a separate email.", minutesAgo: 150 },
        { id: "v4m3", from: "guest", text: "Received, thank you. Could the couple board first for photos?", minutesAgo: 40 },
      ],
    },
    {
      id: "v5",
      contactId: "c10",
      guestName: "Daniel Kowalski",
      handle: "@dkowalski",
      platform: "telegram",
      aiEnabled: true,
      unread: 0,
      messages: [
        { id: "v5m1", from: "guest", text: "Can I change my booking from Viator to 4 people instead of 3?", minutesAgo: 300 },
        { id: "v5m2", from: "ai", text: "Done, your sunset cruise tomorrow is now 4 guests. Viator will show the update within a few minutes.", minutesAgo: 299 },
      ],
    },
    {
      id: "v6",
      contactId: "c11",
      guestName: "Priya Nair",
      handle: "+91 98201 33145",
      platform: "sms",
      aiEnabled: true,
      unread: 0,
      messages: [
        { id: "v6m1", from: "guest", text: "What time should we arrive for the dive?", minutesAgo: 1440 },
        { id: "v6m2", from: "ai", text: "Please be at the dive shop on Pier 2 by 9:30 AM for the briefing. The boat leaves at 10:00.", minutesAgo: 1439 },
      ],
    },
  ] as DemoConversation[],
};
