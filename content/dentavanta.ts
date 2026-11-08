/**
 * Dentavanta case-study deck: slide copy, project facts, and the demo dataset
 * the live product slides run on. The product slides are a working copy of
 * the real Dentavanta practice app (dentavanta-platform-frontend: Home,
 * Leads, Calendar, Conversations, Patients), so the demo data is shaped like
 * its tables: lead_stages, leads, patients, appointments, messages.
 *
 * The practice, its staff and every patient here are fictional. Patients are
 * stored as first name plus last initial, like the real app does.
 *
 * Days are stored as offsets from today (0 = today, -1 = yesterday) and times
 * as minutes from midnight, turned into real dates in the browser.
 */
import type { SlideCopy } from "./corvinn";

export type LeadStageId = "new" | "ai" | "booked" | "lost";
export type LeadSource = "web_form" | "call" | "landing_page" | "google_form" | "contact_form";
export type PatientStatus = "active" | "inactive" | "dormant";
export type PatientTemperature = "hot" | "warm" | "cold";
export type AppointmentType = "exam" | "cleaning" | "procedure" | "consultation" | "emergency" | "other";
export type AppointmentStatus = "booked" | "completed" | "no_show" | "cancelled";
export type BookedBy = "staff" | "ai_agent";
export type Channel = "sms" | "email" | "call" | "form";
export type MessageFrom = "contact" | "staff" | "automation" | "ai_agent";

export type DemoStage = { id: LeadStageId; name: string; color: string };

export type DemoLead = {
  id: string;
  firstName: string;
  lastName: string;
  phone: string;
  email: string | null;
  source: LeadSource;
  stageId: LeadStageId;
  createdDaysAgo: number;
  /** Set once the lead is booked and becomes a patient. */
  convertedPatientId: string | null;
};

export type DemoPatient = {
  id: string;
  firstName: string;
  lastInitial: string;
  phone: string;
  status: PatientStatus;
  temperature: PatientTemperature;
  lastVisitDaysAgo: number | null;
  /** The lead this patient was converted from, so its conversation follows them. */
  fromLeadId: string | null;
};

export type DemoAppointment = {
  id: string;
  patientId: string;
  day: number;
  startMinute: number;
  durationMinutes: number;
  type: AppointmentType;
  status: AppointmentStatus;
  bookedBy: BookedBy;
  operatory: string;
};

export type ContactRef = { kind: "lead" | "patient"; id: string };

export type DemoMessage = {
  id: string;
  contact: ContactRef;
  channel: Channel;
  from: MessageFrom;
  body: string;
  minutesAgo: number;
  /** Call length in seconds, for call entries. */
  durationSeconds?: number;
  /** Short call outcome, for call entries. */
  outcome?: string;
};

export const dentavantaDeck = {
  practiceName: "Willow Creek Dental",
  practiceInitials: "WC",
  userName: "Dr. Elena Park",
  userRole: "Owner",
  activeForms: 2,
  logo: { white: "/ingested/dentavanta/logo-white.png", black: "/ingested/dentavanta/logo-black.png", markWhite: "/ingested/dentavanta/mark-white.png", markBlue: "/ingested/dentavanta/mark-blue.png", alt: "Dentavanta" },
  sidebarImage: "/ingested/dentavanta/sidebar-bg.jpg",

  slides: {
    cover: { id: "cover", title: "Dentavanta", summary: "The project at a glance", thumb: "/ingested/dentavanta/slides/cover.jpg" },
    overview: { id: "overview", title: "Overview", summary: "What it is, who it is for, our role, the stack, and every growth module", thumb: "/ingested/dentavanta/slides/overview.jpg" },
    website: {
      id: "website",
      title: "Clinic website",
      summary: "A practice website whose appointment form feeds the app",
      hint: "Fill in the appointment form. The request lands on the Leads board two slides on.",
      thumb: "/ingested/dentavanta/slides/website.jpg",
    },
    dashboard: {
      id: "dashboard",
      title: "Home",
      summary: "Leads, patients, the last 14 days and the pipeline at a glance",
      hint: "Live numbers. Send a form, move a lead or book a visit, then come back here.",
      thumb: "/ingested/dentavanta/slides/dashboard.jpg",
    },
    leads: {
      id: "leads",
      title: "Leads",
      summary: "A pipeline board from first inquiry to booked visit",
      hint: "Drag a card to another stage, or click one to book the visit.",
      thumb: "/ingested/dentavanta/slides/leads.jpg",
    },
    calendar: {
      id: "calendar",
      title: "Calendar",
      summary: "A week of chairs, colored by visit type",
      hint: "Click an empty slot to book. Booking a lead turns them into a patient.",
      thumb: "/ingested/dentavanta/slides/calendar.jpg",
    },
    conversations: {
      id: "conversations",
      title: "Conversations",
      summary: "Every call, text and email with a lead or patient in one inbox",
      hint: "Open a thread and send a text. It shows up on the patient's record too.",
      thumb: "/ingested/dentavanta/slides/conversations.jpg",
    },
    patients: {
      id: "patients",
      title: "Patients",
      summary: "Active, inactive and dormant patients, ready for recall and reactivation",
      hint: "Drag a dormant patient back to active, or open a card to see their visits.",
      thumb: "/ingested/dentavanta/slides/patients.jpg",
    },
    platform: { id: "platform", title: "The rest of the platform", summary: "Voice agents, automations, reviews, campaigns and the security underneath", thumb: "/ingested/dentavanta/slides/platform.jpg" },
    closing: { id: "closing", title: "Start a project", summary: "Want software like this for your practice or business", thumb: "/ingested/dentavanta/slides/closing.jpg" },
  } satisfies Record<string, SlideCopy>,

  overview: {
    eyebrow: "Overview",
    title: "Growth automation for dental practices, built on a security first cloud",
    body: "Dental practices lose patients to missed calls, slow replies and recalls nobody had time to send. Dentavanta puts leads, patients, the calendar, every conversation, AI phone agents and automations in one workspace, so follow up happens on time without adding work to the front desk.",
    image: { src: "/ingested/dentavanta/dental-chair.jpg", alt: "A dentist checking a patient's braces in the chair" },
    facts: [
      { label: "What it is", value: "A multi-tenant growth platform for dental practices, plus their public websites" },
      { label: "Who uses it", value: "Practice owners, office managers and front desk teams" },
      { label: "Our role", value: "Engineering partner to the founder: AWS infrastructure, the API, the practice app and both websites" },
      { label: "Stage", value: "Pre-launch, preparing a founding practice pilot. Built since August 2026" },
    ],
    stack: [
      "Next.js 16",
      "React 19",
      "Tailwind CSS v4",
      "AWS CDK",
      "API Gateway + Lambda",
      "Aurora Postgres",
      "Row level security",
      "Cognito with passkeys",
      "AWS KMS",
      "Retell voice agents",
      "Twilio",
      "Amazon SES",
    ],
    /** The interactive tooth chart on the overview slide. Module copy follows the product's own approved descriptions. */
    arch: {
      label: "A tooth chart of the upper arch. Each pair of teeth is one Dentavanta growth module.",
      hint: "Hover or tap a tooth to see the module it stands for.",
      eyebrow: "Growth module",
      toothLabel: "Teeth",
      modules: [
        { icon: "PhoneMissed", name: "Missed call recovery", body: "Follows up after an unanswered call and offers an approved next step or booking path." },
        { icon: "MessageSquarePlus", name: "New lead follow up", body: "Answers new patient inquiries from the website and forms, and guides them toward booking." },
        { icon: "Headset", name: "AI receptionist", body: "AI phone agents that answer routine questions, route calls and help book where supported." },
        { icon: "UserRoundCheck", name: "Patient reactivation", body: "Practice approved outreach to patients who have not been in for a chosen period." },
        { icon: "CalendarClock", name: "Recall and reminders", body: "Recall, cleaning, follow up and appointment reminders, sent on schedule." },
        { icon: "Star", name: "Google review requests", body: "Asks for a review after the visit and sends the patient to the practice's review page." },
        { icon: "LayoutDashboard", name: "Growth dashboard", body: "One view of the leads, bookings, reactivations and review requests the system created." },
        { icon: "Plug", name: "Calendar and email sync", body: "Connects Google Calendar and Gmail, with practice management systems reviewed case by case." },
      ],
    },
  },

  /** The clinic website slide: a replica of the clinic website template's hero and contact form. */
  website: {
    url: "willowcreekdental.example",
    nav: ["Home", "About", "Services", "Gallery", "Blog", "FAQ", "Contact"],
    navCta: "Book an appointment",
    eyebrow: "Cedar Falls, TX",
    title: "Gentle, modern dental care for your whole family",
    body: "Same week appointments, a team that walks you through every option, and no surprise bills. Whether it's a routine cleaning or something that has been bothering you for a while, we'll take care of it.",
    primary: "Book an appointment",
    call: "Call (555) 214-7788",
    form: {
      title: "Request an appointment",
      body: "Tell us a little about yourself and we will call you back to find a time.",
      firstName: "First name",
      lastName: "Last name",
      phone: "Phone",
      phonePlaceholder: "(555) 000-0000",
      email: "Email",
      interest: "What can we help with?",
      interests: ["Cleaning and checkup", "Tooth pain", "Whitening", "Invisalign consult", "New patient visit"],
      message: "Message",
      submit: "Send request",
      sending: "Sending",
      privacy: "Please don't include medical details. We will ask what we need when we call.",
      prefill: { firstName: "Jordan", lastName: "Ellis", phone: "(555) 402-7719", email: "jordan.ellis@example.com", interest: "New patient visit", message: "Looking for a cleaning sometime next week, mornings work best." },
      prefillLabel: "Fill with sample details",
    },
    sent: {
      title: "Request sent",
      body: "In the real template this form posts to Dentavanta's public forms API. Here it went into the demo workspace.",
      cta: "See it on the Leads board",
      again: "Send another",
    },
    poweredBy: "Leads from this form go straight into Dentavanta",
  },

  dashboard: {
    welcome: "Welcome back",
    newThisWeek: "{n} new leads this week.",
    stats: { leads: "Total leads", patients: "Total patients", newLeads: "New leads (7d)", forms: "Active forms" },
    chart: "Leads, last 14 days",
    pipeline: "Pipeline by stage",
    recent: "Recent leads",
  },

  leadsScreen: {
    title: "Leads",
    subtitle: "Track and move leads through your pipeline.",
    search: "Search leads",
    board: "Board",
    list: "List",
    editStages: "Edit stages",
    addStage: "Add stage",
    empty: "No leads in this stage",
    drawer: { subtitle: "Lead details", stage: "Stage", contact: "Contact", source: "Source", added: "Added", book: "Book appointment", converted: "Converted to patient", viewPatient: "Open in Patients", history: "Recent activity", noHistory: "No calls, texts or emails yet." },
  },

  calendar: {
    title: "Calendar",
    subtitle: "Book and manage appointments.",
    views: ["Month", "Week", "Day", "List", "Kanban", "Analytics"],
    book: "Book appointment",
    today: "Today",
    drawer: {
      newTitle: "Book appointment",
      newSubtitle: "Pick a patient or a lead, then a time.",
      who: "Patient or lead",
      patients: "Patients",
      leads: "Leads",
      leadNote: "Booking a lead converts them to a patient.",
      type: "Visit type",
      day: "Day",
      time: "Time",
      length: "Length",
      operatory: "Operatory",
      minutes: "min",
      confirm: "Book",
      pick: "Choose who this visit is for",
      detailSubtitle: "Appointment",
      status: "Status",
      when: "When",
      markDone: "Mark done",
      noShow: "No-show",
      cancel: "Cancel visit",
    },
  },

  conversations: {
    title: "Conversations",
    subtitle: "Every call, text, and email, in one inbox.",
    search: "Search conversations",
    all: "All",
    leads: "Leads",
    patients: "Patients",
    composer: "Write a text message",
    composerEmail: "Write an email",
    send: "Send",
    sms: "SMS",
    email: "Email",
    empty: "No conversations match.",
    call: "Call",
    form: "Website form",
    fromLabels: { automation: "Automation", ai_agent: "AI Agent", staff: "You" } satisfies Record<Exclude<MessageFrom, "contact">, string>,
  },

  patientsScreen: {
    title: "Patients",
    subtitle: "Manage your active patient roster.",
    search: "Search patients",
    board: "Board",
    list: "List",
    columns: { active: "Active", inactive: "Inactive", dormant: "Dormant" } satisfies Record<PatientStatus, string>,
    lastVisit: "Last visit",
    noVisits: "No visits yet",
    next: "Next",
    drawer: { subtitle: "Patient record", status: "Status", upcoming: "Upcoming visits", noUpcoming: "Nothing booked yet.", past: "Past visits", history: "Conversation", book: "Book appointment", noHistory: "No calls, texts or emails yet." },
  },

  platform: {
    eyebrow: "Also in the box",
    title: "Everything a practice needs after the phone rings",
    body: "The slides showed the screens a front desk lives in. Around them sit the agents, workflows and safeguards that do the follow up.",
    modules: [
      { icon: "Bot", title: "AI phone agents", body: "Voice agents on Retell with a visual call flow, practice tools for patient lookup, lead capture and booking, test calls, transcripts and call metrics. A booking made on a call shows as booked by the AI agent." },
      { icon: "Workflow", title: "Automations", body: "A guided builder with triggers, yes or no conditions, delays and actions, plus test runs and per step analytics." },
      { icon: "Star", title: "Reputation", body: "Google Business connection, review requests by text and a panel to read and reply to reviews." },
      { icon: "Megaphone", title: "Marketing", body: "An email builder with blocks and patient variables for campaigns." },
      { icon: "BellRing", title: "Reminders", body: "Scheduled reminders for the team, with quiet hours respected." },
      { icon: "Link2", title: "External tracking", body: "Embeddable forms with spam checks, so any site can feed the Leads board." },
      { icon: "CheckSquare", title: "Tasks and notes", body: "Assigned tasks with priority, and rich text notes linked to a lead or patient." },
      { icon: "Mail", title: "Integrations", body: "Gmail and Google Calendar, connected per practice." },
      { icon: "ShieldCheck", title: "Security underneath", body: "Cognito sign in with passkeys, row level security per practice, KMS encryption, audit logging and a single region AWS setup provisioned as code." },
    ],
  },

  closing: {
    eyebrow: "Your turn",
    title: "Want a system like this running your practice",
    body: "We build custom platforms on the same stack, with the same care for security and for the screens people use every day.",
    primary: { label: "Start a project", href: "/contact" },
    secondary: { label: "Back to all work", href: "/#work" },
  },

  /** Centered modal shown when someone clicks a screen or action this demo doesn't include. */
  walkthrough: {
    eyebrow: "In the full product",
    /** `{feature}` is replaced with what they clicked. */
    title: "{feature} is part of the full Dentavanta build",
    body: "This demo covers the screens a front desk uses most. In a 30 minute walkthrough we show you the rest and talk through what a system like this would look like for you.",
    points: ["Every module, end to end", "How AI agents and automations would follow up for you", "A straight answer on timeline and cost"],
    primary: { label: "Book a walkthrough", href: "/contact" },
    secondary: "Keep exploring the demo",
  },

  toasts: {
    newLead: "New lead from the website",
    moved: "Lead moved",
    booked: "Appointment booked",
    converted: "converted to a patient",
    sent: "Message sent",
    status: "Patient status updated",
    apptStatus: "Appointment updated",
    autoReply: "Hi {name}, thanks for contacting Willow Creek Dental. We got your request and will call you shortly. Reply here with a good time to reach you.",
  },

  stages: [
    { id: "new", name: "New", color: "#3b82f6" },
    { id: "ai", name: "AI Responded", color: "#8b5cf6" },
    { id: "booked", name: "Booked", color: "#10b981" },
    { id: "lost", name: "Lost", color: "#ef4444" },
  ] as DemoStage[],

  sourceLabels: {
    web_form: "Website Form",
    call: "Phone Call",
    landing_page: "Landing Page",
    google_form: "Google Form",
    contact_form: "Contact Form",
  } satisfies Record<LeadSource, string>,

  typeLabels: { exam: "Exam", cleaning: "Cleaning", procedure: "Procedure", consultation: "Consultation", emergency: "Emergency", other: "Other" } satisfies Record<AppointmentType, string>,
  statusLabels: { booked: "Booked", completed: "Done", no_show: "No-show", cancelled: "Cancelled" } satisfies Record<AppointmentStatus, string>,
  bookedByLabels: { staff: "Booked by staff", ai_agent: "Booked by AI Agent" } satisfies Record<BookedBy, string>,
  temperatureLabels: { hot: "Hot", warm: "Warm", cold: "Cold" } satisfies Record<PatientTemperature, string>,

  leads: [
    { id: "l1", firstName: "Marcus", lastName: "Reed", phone: "(555) 301-4482", email: null, source: "call", stageId: "new", createdDaysAgo: 0, convertedPatientId: null },
    { id: "l2", firstName: "Aisha", lastName: "Khan", phone: "(555) 218-9034", email: "aisha.k@example.com", source: "web_form", stageId: "new", createdDaysAgo: 0, convertedPatientId: null },
    { id: "l3", firstName: "Tom", lastName: "Alvarez", phone: "(555) 460-1127", email: "tom.alvarez@example.com", source: "landing_page", stageId: "ai", createdDaysAgo: 1, convertedPatientId: null },
    { id: "l4", firstName: "Grace", lastName: "Liu", phone: "(555) 377-5521", email: null, source: "call", stageId: "ai", createdDaysAgo: 2, convertedPatientId: null },
    { id: "l5", firstName: "Ben", lastName: "Okafor", phone: "(555) 690-2245", email: "ben.okafor@example.com", source: "web_form", stageId: "new", createdDaysAgo: 3, convertedPatientId: null },
    { id: "l6", firstName: "Hannah", lastName: "Brooks", phone: "(555) 812-7730", email: "hbrooks@example.com", source: "contact_form", stageId: "ai", createdDaysAgo: 4, convertedPatientId: null },
    { id: "l7", firstName: "Priya", lastName: "Desai", phone: "(555) 553-1902", email: "priya.desai@example.com", source: "google_form", stageId: "booked", createdDaysAgo: 5, convertedPatientId: "p1" },
    { id: "l8", firstName: "Diego", lastName: "Santos", phone: "(555) 274-6618", email: null, source: "call", stageId: "booked", createdDaysAgo: 6, convertedPatientId: "p2" },
    { id: "l14", firstName: "Victor", lastName: "Hale", phone: "(555) 731-0456", email: "v.hale@example.com", source: "web_form", stageId: "new", createdDaysAgo: 7, convertedPatientId: null },
    { id: "l9", firstName: "Nora", lastName: "Fitzgerald", phone: "(555) 145-8823", email: "nora.fitz@example.com", source: "web_form", stageId: "lost", createdDaysAgo: 8, convertedPatientId: null },
    { id: "l10", firstName: "Sam", lastName: "Whitfield", phone: "(555) 909-3361", email: "samw@example.com", source: "landing_page", stageId: "new", createdDaysAgo: 9, convertedPatientId: null },
    { id: "l11", firstName: "Lena", lastName: "Novak", phone: "(555) 382-4470", email: null, source: "call", stageId: "ai", createdDaysAgo: 10, convertedPatientId: null },
    { id: "l12", firstName: "Owen", lastName: "Price", phone: "(555) 627-1185", email: "owen.price@example.com", source: "web_form", stageId: "booked", createdDaysAgo: 12, convertedPatientId: "p3" },
    { id: "l13", firstName: "Ruby", lastName: "Chen", phone: "(555) 518-2290", email: null, source: "call", stageId: "lost", createdDaysAgo: 13, convertedPatientId: null },
  ] as DemoLead[],

  patients: [
    { id: "p1", firstName: "Priya", lastInitial: "D", phone: "(555) 553-1902", status: "active", temperature: "warm", lastVisitDaysAgo: null, fromLeadId: "l7" },
    { id: "p2", firstName: "Diego", lastInitial: "S", phone: "(555) 274-6618", status: "active", temperature: "hot", lastVisitDaysAgo: null, fromLeadId: "l8" },
    { id: "p3", firstName: "Owen", lastInitial: "P", phone: "(555) 627-1185", status: "active", temperature: "warm", lastVisitDaysAgo: 2, fromLeadId: "l12" },
    { id: "p4", firstName: "Maria", lastInitial: "G", phone: "(555) 340-7712", status: "active", temperature: "warm", lastVisitDaysAgo: 40, fromLeadId: null },
    { id: "p5", firstName: "James", lastInitial: "T", phone: "(555) 266-0193", status: "active", temperature: "cold", lastVisitDaysAgo: 75, fromLeadId: null },
    { id: "p6", firstName: "Keiko", lastInitial: "S", phone: "(555) 471-3348", status: "active", temperature: "hot", lastVisitDaysAgo: 1, fromLeadId: null },
    { id: "p7", firstName: "Robert", lastInitial: "H", phone: "(555) 189-5520", status: "inactive", temperature: "warm", lastVisitDaysAgo: 210, fromLeadId: null },
    { id: "p8", firstName: "Fatima", lastInitial: "A", phone: "(555) 735-9081", status: "inactive", temperature: "cold", lastVisitDaysAgo: 260, fromLeadId: null },
    { id: "p9", firstName: "Liam", lastInitial: "B", phone: "(555) 602-4417", status: "inactive", temperature: "warm", lastVisitDaysAgo: 300, fromLeadId: null },
    { id: "p10", firstName: "Chloe", lastInitial: "W", phone: "(555) 248-6670", status: "dormant", temperature: "cold", lastVisitDaysAgo: 520, fromLeadId: null },
    { id: "p11", firstName: "Ahmed", lastInitial: "R", phone: "(555) 813-2054", status: "dormant", temperature: "warm", lastVisitDaysAgo: 610, fromLeadId: null },
    { id: "p12", firstName: "Isabel", lastInitial: "M", phone: "(555) 390-7765", status: "dormant", temperature: "cold", lastVisitDaysAgo: 700, fromLeadId: null },
  ] as DemoPatient[],

  appointments: [
    { id: "a1", patientId: "p4", day: 0, startMinute: 540, durationMinutes: 60, type: "cleaning", status: "booked", bookedBy: "staff", operatory: "Op 1" },
    { id: "a2", patientId: "p6", day: 0, startMinute: 600, durationMinutes: 30, type: "exam", status: "booked", bookedBy: "ai_agent", operatory: "Op 2" },
    { id: "a3", patientId: "p1", day: 0, startMinute: 690, durationMinutes: 60, type: "consultation", status: "booked", bookedBy: "staff", operatory: "Op 1" },
    { id: "a4", patientId: "p2", day: 1, startMinute: 570, durationMinutes: 90, type: "procedure", status: "booked", bookedBy: "ai_agent", operatory: "Op 2" },
    { id: "a5", patientId: "p5", day: 1, startMinute: 840, durationMinutes: 60, type: "cleaning", status: "booked", bookedBy: "staff", operatory: "Op 1" },
    { id: "a6", patientId: "p9", day: 2, startMinute: 510, durationMinutes: 30, type: "exam", status: "booked", bookedBy: "staff", operatory: "Op 2" },
    { id: "a7", patientId: "p3", day: 3, startMinute: 900, durationMinutes: 60, type: "cleaning", status: "booked", bookedBy: "ai_agent", operatory: "Op 1" },
    { id: "a8", patientId: "p1", day: 4, startMinute: 600, durationMinutes: 60, type: "cleaning", status: "booked", bookedBy: "staff", operatory: "Op 1" },
    { id: "a9", patientId: "p7", day: 5, startMinute: 780, durationMinutes: 30, type: "exam", status: "booked", bookedBy: "staff", operatory: "Op 2" },
    { id: "a10", patientId: "p6", day: -1, startMinute: 630, durationMinutes: 60, type: "procedure", status: "completed", bookedBy: "staff", operatory: "Op 1" },
    { id: "a11", patientId: "p3", day: -2, startMinute: 540, durationMinutes: 60, type: "exam", status: "completed", bookedBy: "staff", operatory: "Op 2" },
    { id: "a12", patientId: "p8", day: -3, startMinute: 840, durationMinutes: 30, type: "emergency", status: "no_show", bookedBy: "ai_agent", operatory: "Op 2" },
    { id: "a13", patientId: "p4", day: -4, startMinute: 600, durationMinutes: 30, type: "exam", status: "completed", bookedBy: "staff", operatory: "Op 1" },
    { id: "a14", patientId: "p5", day: -5, startMinute: 720, durationMinutes: 60, type: "consultation", status: "completed", bookedBy: "staff", operatory: "Op 1" },
  ] as DemoAppointment[],

  messages: [
    { id: "m1", contact: { kind: "lead", id: "l1" }, channel: "call", from: "contact", body: "Missed call while the front desk was with a patient.", minutesAgo: 34, durationSeconds: 0, outcome: "Missed" },
    { id: "m2", contact: { kind: "lead", id: "l1" }, channel: "sms", from: "automation", body: "Sorry we missed your call at Willow Creek Dental. How can we help? You can also book here: willowcreekdental.example/book", minutesAgo: 33 },
    { id: "m3", contact: { kind: "lead", id: "l1" }, channel: "sms", from: "contact", body: "Hi, I chipped a front tooth. Anything open this week?", minutesAgo: 21 },
    { id: "m4", contact: { kind: "lead", id: "l2" }, channel: "form", from: "contact", body: "Interested in: Whitening. Would love to know prices before booking.", minutesAgo: 95 },
    { id: "m5", contact: { kind: "lead", id: "l3" }, channel: "form", from: "contact", body: "Interested in: Invisalign consult.", minutesAgo: 1500 },
    { id: "m6", contact: { kind: "lead", id: "l3" }, channel: "sms", from: "automation", body: "Hi Tom, thanks for asking about Invisalign. Consults are 30 minutes with Dr. Park. Would a weekday morning or afternoon suit you better?", minutesAgo: 1498 },
    { id: "m7", contact: { kind: "lead", id: "l4" }, channel: "call", from: "ai_agent", body: "New caller asking about a first cleaning for herself and her son. Asked for a call back after 4 PM.", minutesAgo: 2900, durationSeconds: 192, outcome: "Callback requested" },
    { id: "m8", contact: { kind: "patient", id: "p2" }, channel: "sms", from: "automation", body: "Reminder: your visit at Willow Creek Dental is tomorrow at 9:30 AM. Reply C to confirm.", minutesAgo: 180 },
    { id: "m9", contact: { kind: "patient", id: "p2" }, channel: "sms", from: "contact", body: "C. See you then!", minutesAgo: 172 },
    { id: "m10", contact: { kind: "patient", id: "p6" }, channel: "sms", from: "automation", body: "Thanks for coming in yesterday, Keiko. Would you leave us a quick Google review? It helps other families find us.", minutesAgo: 600 },
    { id: "m11", contact: { kind: "patient", id: "p10" }, channel: "email", from: "automation", body: "It has been a while since your last cleaning. We have early morning and Saturday times open this month. Book online or reply to this email.", minutesAgo: 4300 },
    { id: "m12", contact: { kind: "patient", id: "p4" }, channel: "email", from: "staff", body: "Hi Maria, your new insurance card is on file. See you at 9 for your cleaning.", minutesAgo: 1450 },
  ] as DemoMessage[],
};
