/**
 * Corvinn case-study deck: slide copy, project facts, and the demo dataset the
 * live product slides run on. The product slides are a working copy of the
 * real Corvinn dashboard UI, so the demo data is shaped like its tables
 * (jobs, customers, technicians, dispatch assignments, inventory items).
 *
 * Times are stored as offsets (day relative to two days before today, minutes
 * from midnight) and turned into real dates in the browser, so the board
 * always has today in the middle of it whenever someone opens it.
 */

export type JobStatus =
  | "requested"
  | "diagnosed"
  | "scheduled"
  | "in_progress"
  | "completed"
  | "invoiced"
  | "paid"
  | "canceled";

export type CustomerStage = "lead" | "contacted" | "job_created" | "fulfilled";

export type DemoCustomer = {
  id: string;
  name: string;
  phone: string | null;
  email: string | null;
  stage: CustomerStage;
  leadSource: string | null;
  /** Days before today the customer was added. */
  addedDaysAgo: number;
  address: string;
};

export type DemoJob = {
  id: string;
  title: string;
  customerId: string;
  status: JobStatus;
  emergency: boolean;
  certifications: string[];
  createdDaysAgo: number;
  total: number;
};

export type DemoTechnician = { id: string; name: string; certifications: string[] };

export type DemoAssignment = {
  id: string;
  jobId: string;
  technicianId: string;
  /** 0 = two days before today, 2 = today, 4 = two days after. */
  day: number;
  startMinute: number;
  durationMinutes: number;
};

export type DemoInventoryItem = {
  id: string;
  name: string;
  sku: string;
  category: string;
  unit: "each" | "lb" | "ft" | "cu ft";
  onHand: number;
  reorderAt: number;
  unitCost: number;
  sellPrice: number;
  used30: number;
  image: string | null;
  location: string;
};

export type DemoMovement = {
  id: string;
  itemId: string;
  type: "job_use" | "shop_use" | "receive" | "waste";
  quantity: number;
  jobId: string | null;
  by: string;
  hoursAgo: number;
};

export type SlideCopy = {
  id: string;
  /** Short label shown in the deck chrome above the slide. */
  title: string;
  /** One line telling the viewer what they can do on this slide. */
  hint?: string;
  /** Short description for the slide's row in the contents drawer. */
  summary?: string;
  /** Screenshot of the slide for the contents drawer. */
  thumb?: string;
};

export const corvinnDeck = {
  workspaceName: "Northwind Heating & Air",
  userName: "Dana Whitfield",
  userEmail: "dana@northwindhvac.com",
  themeImage: "/ingested/corvinn/theme-8.jpg",
  sidebarLogo: { src: "/ingested/corvinn/logo-white-icon.png", alt: "Corvinn" },

  slides: {
    cover: { id: "cover", title: "Corvinn", summary: "The project at a glance", thumb: "/ingested/corvinn/slides/cover.jpg" },
    overview: { id: "overview", title: "Overview", summary: "What it is, who uses it, the stack, and an interactive HVAC drawing", thumb: "/ingested/corvinn/slides/overview.jpg" },
    dashboard: {
      id: "dashboard",
      title: "Dashboard",
      summary: "Today in numbers: active jobs, emergencies, schedule and revenue",
      thumb: "/ingested/corvinn/slides/dashboard.jpg",
      hint: "Live numbers. Change a job on the next slides and watch these move.",
    },
    jobs: {
      id: "jobs",
      title: "Jobs",
      summary: "Every job in list, kanban and calendar views",
      thumb: "/ingested/corvinn/slides/jobs.jpg",
      hint: "Switch to Kanban and drag a job forward, or click a status pill to change it.",
    },
    dispatch: {
      id: "dispatch",
      title: "Dispatch board",
      summary: "Drag jobs onto the technicians' calendar",
      thumb: "/ingested/corvinn/slides/dispatch.jpg",
      hint: "Hit Assign job, then drag a job onto the calendar. Drag a booked card to reschedule.",
    },
    customers: {
      id: "customers",
      title: "Customers",
      summary: "Customer table and a drag and drop sales pipeline",
      thumb: "/ingested/corvinn/slides/customers.jpg",
      hint: "Open Pipeline and drag a lead to Contacted. Click any customer for their file.",
    },
    inventory: {
      id: "inventory",
      title: "Inventory",
      summary: "Ring parts up against a job, like a till",
      thumb: "/ingested/corvinn/slides/inventory.jpg",
      hint: "Tap products onto the ticket, then record them against a job.",
    },
    automations: {
      id: "automations",
      title: "Automations",
      summary: "Visual workflows that text customers on their own",
      thumb: "/ingested/corvinn/slides/automations.jpg",
      hint: "Click any step to edit it, or a plus button to add one.",
    },
    platform: { id: "platform", title: "The rest of the platform", summary: "Payments, payroll, permits, the offline app and more", thumb: "/ingested/corvinn/slides/platform.jpg" },
    closing: { id: "closing", title: "Start a project", summary: "Want software like this for your business", thumb: "/ingested/corvinn/slides/closing.jpg" },
  } satisfies Record<string, SlideCopy>,

  overview: {
    eyebrow: "Overview",
    title: "Field service software, built from the database up",
    body: "Corvinn runs an HVAC company end to end: the office books the job, dispatch drops it on a technician's calendar, the tech records parts from the van, and the customer gets a text when it's done. One system, one login, every role.",
    image: { src: "/ingested/corvinn/technician-smile.jpg", alt: "HVAC technician smiling on a job site" },
    /** The interactive hairline drawing on the overview slide. */
    blueprint: {
      label: "Interactive drawing of a split HVAC system",
      hint: "Hover or tap a part. Tap the thermostat to switch the system.",
      on: "Cooling on",
      off: "System off",
      parts: {
        condenser: {
          title: "Installs and repairs",
          body: "Every condensing unit and part comes off the inventory counter and is costed to the job it went into.",
        },
        lineset: {
          title: "Refrigerant, by the pound",
          body: "R-410A is charged in half pound steps and logged on the job. Only EPA 608 certified techs can be booked for it.",
        },
        trunk: {
          title: "Maintenance plans",
          body: "Duct cleaning and filter changes run as recurring jobs that book their own visits.",
        },
        stat: {
          title: "Thermostat installs",
          body: "Booked on the dispatch board, with a text to the customer when the tech is on the way.",
        },
      },
    },
    facts: [
      { label: "What it is", value: "Multi-tenant field service platform for HVAC contractors" },
      { label: "Who uses it", value: "Owners, dispatchers, office staff and technicians, each with their own view" },
      { label: "Our role", value: "Product, design and engineering, in house" },
      { label: "Built", value: "From September 2026, shipping weekly" },
    ],
    stack: [
      "Next.js 15",
      "React",
      "Tailwind CSS v4",
      "shadcn/ui on Radix",
      "Supabase Postgres",
      "Row level security",
      "Stripe",
      "QuickBooks sync",
      "Capacitor",
      "PowerSync offline",
      "Claude API",
    ],
  },

  platform: {
    eyebrow: "Also in the box",
    title: "Everything a shop needs after the job is booked",
    body: "The slides showed the screens a dispatcher lives in. Behind them sit the parts that turn a schedule into paid invoices.",
    modules: [
      { icon: "Smartphone", title: "Offline technician app", body: "Capacitor app with a local SQLite copy, so techs keep working in basements with no signal." },
      { icon: "Repeat", title: "Recurring jobs", body: "Maintenance plans that generate their own visits on schedule." },
      { icon: "FileCheck", title: "Permits", body: "Track every permit from application to inspection, tied to its job." },
      { icon: "Receipt", title: "Invoices and payments", body: "Stripe checkout links and QuickBooks invoice sync." },
      { icon: "BarChart3", title: "Reports", body: "Job costing and technician scorecards." },
      { icon: "Wallet", title: "Payroll export", body: "Hours by technician, out as CSV." },
      { icon: "Palette", title: "Tenant branding", body: "Each company sets its own color, logo and backdrop. This deck runs on one of them." },
      { icon: "Code2", title: "Booking widget", body: "An embeddable form that drops web leads straight into the pipeline." },
      { icon: "Sparkles", title: "AI customer import", body: "Claude maps any spreadsheet's columns onto customer fields." },
      { icon: "PhoneCall", title: "AI phone agent", body: "In development: answers calls and books into the same dispatch tables." },
    ],
  },

  closing: {
    eyebrow: "Your turn",
    title: "Want software like this running your business",
    body: "We build custom systems on the same stack, with the same care for the screens people use every day.",
    primary: { label: "Start a project", href: "/contact" },
    secondary: { label: "Back to all work", href: "/#work" },
  },

  /** Centered modal shown when someone clicks a screen or action this demo doesn't include. */
  walkthrough: {
    eyebrow: "In the full product",
    /** `{feature}` is replaced with what they clicked. */
    title: "{feature} is part of the full Corvinn build",
    body: "This demo covers the screens a dispatcher uses most. In a 30 minute walkthrough we run the whole system with you, on your kind of jobs.",
    points: ["Every screen, live, with real workflows", "How it would fit your crew and your process", "A straight answer on timeline and cost"],
    primary: { label: "Book a full walkthrough", href: "/contact" },
    secondary: "Keep exploring the demo",
  },

  technicians: [
    { id: "t1", name: "Marcus Bell", certifications: ["epa_608", "nate"] },
    { id: "t2", name: "Priya Raman", certifications: ["epa_608"] },
    { id: "t3", name: "Luis Ortega", certifications: ["epa_608", "gas_line"] },
    { id: "t4", name: "Jordan Kim", certifications: [] },
  ] as DemoTechnician[],

  customers: [
    { id: "c1", name: "Helen Marsh", phone: "(512) 555-0142", email: "helen.marsh@mail.com", stage: "job_created", leadSource: "Google", addedDaysAgo: 2, address: "418 Cedar Bend Dr" },
    { id: "c2", name: "Oakridge Dental", phone: "(512) 555-0199", email: "office@oakridgedental.com", stage: "job_created", leadSource: "Referral", addedDaysAgo: 9, address: "2200 Oakridge Pkwy" },
    { id: "c3", name: "Tom Becker", phone: "(512) 555-0107", email: null, stage: "fulfilled", leadSource: "Website", addedDaysAgo: 31, address: "77 Larkspur Ln" },
    { id: "c4", name: "Rosa Delgado", phone: "(512) 555-0163", email: "rosa.d@mail.com", stage: "job_created", leadSource: "Website", addedDaysAgo: 5, address: "1903 Mesa Verde" },
    { id: "c5", name: "Greenline Cafe", phone: "(512) 555-0120", email: "manager@greenlinecafe.com", stage: "job_created", leadSource: "Referral", addedDaysAgo: 14, address: "61 Congress Ave" },
    { id: "c6", name: "Aaron Feld", phone: "(512) 555-0188", email: "afeld@mail.com", stage: "lead", leadSource: "Google", addedDaysAgo: 1, address: "905 Willow St" },
    { id: "c7", name: "Mia Thompson", phone: null, email: "mia.t@mail.com", stage: "lead", leadSource: "Booking widget", addedDaysAgo: 0, address: "3310 Ridge Rd" },
    { id: "c8", name: "Westgate Apartments", phone: "(512) 555-0111", email: "maint@westgateapts.com", stage: "contacted", leadSource: "Cold call", addedDaysAgo: 6, address: "4800 Westgate Blvd" },
    { id: "c9", name: "Samuel Ortiz", phone: "(512) 555-0176", email: "sam.ortiz@mail.com", stage: "contacted", leadSource: "Google", addedDaysAgo: 3, address: "129 Pecan Ct" },
    { id: "c10", name: "Linda Park", phone: "(512) 555-0134", email: "lpark@mail.com", stage: "fulfilled", leadSource: "Referral", addedDaysAgo: 45, address: "88 Bluebonnet Way" },
    { id: "c11", name: "Brightway Pharmacy", phone: "(512) 555-0155", email: "ops@brightwayrx.com", stage: "job_created", leadSource: "Website", addedDaysAgo: 11, address: "700 Lamar Blvd" },
    { id: "c12", name: "Kevin Doyle", phone: "(512) 555-0171", email: null, stage: "lead", leadSource: "Booking widget", addedDaysAgo: 0, address: "15 Harbor View" },
    { id: "c13", name: "Nora Williams", phone: "(512) 555-0109", email: "nora.w@mail.com", stage: "contacted", leadSource: "Website", addedDaysAgo: 4, address: "2412 Elm Hollow" },
    { id: "c14", name: "Summit Fitness", phone: "(512) 555-0182", email: "facilities@summitfit.com", stage: "fulfilled", leadSource: "Referral", addedDaysAgo: 60, address: "1500 Summit Dr" },
  ] as DemoCustomer[],

  jobs: [
    { id: "j1", title: "No cooling, upstairs unit", customerId: "c1", status: "scheduled", emergency: true, certifications: ["epa_608"], createdDaysAgo: 0, total: 640 },
    { id: "j2", title: "Rooftop unit quarterly maintenance", customerId: "c2", status: "scheduled", emergency: false, certifications: [], createdDaysAgo: 6, total: 420 },
    { id: "j3", title: "Furnace ignitor replacement", customerId: "c4", status: "in_progress", emergency: false, certifications: ["gas_line"], createdDaysAgo: 3, total: 285 },
    { id: "j4", title: "Walk-in cooler not holding temp", customerId: "c5", status: "scheduled", emergency: true, certifications: ["epa_608"], createdDaysAgo: 1, total: 910 },
    { id: "j5", title: "Thermostat install, 3 zones", customerId: "c11", status: "scheduled", emergency: false, certifications: [], createdDaysAgo: 4, total: 1150 },
    { id: "j6", title: "Duct cleaning, whole house", customerId: "c9", status: "requested", emergency: false, certifications: [], createdDaysAgo: 0, total: 0 },
    { id: "j7", title: "Heat pump making grinding noise", customerId: "c13", status: "requested", emergency: false, certifications: [], createdDaysAgo: 1, total: 0 },
    { id: "j8", title: "Condenser coil cleaning", customerId: "c2", status: "diagnosed", emergency: false, certifications: [], createdDaysAgo: 2, total: 380 },
    { id: "j9", title: "Mini split install, garage", customerId: "c8", status: "diagnosed", emergency: false, certifications: ["epa_608"], createdDaysAgo: 3, total: 3200 },
    { id: "j10", title: "Annual tune-up", customerId: "c3", status: "paid", emergency: false, certifications: [], createdDaysAgo: 20, total: 189 },
    { id: "j11", title: "Refrigerant leak repair", customerId: "c10", status: "invoiced", emergency: false, certifications: ["epa_608"], createdDaysAgo: 12, total: 1340 },
    { id: "j12", title: "Gas furnace safety inspection", customerId: "c14", status: "completed", emergency: false, certifications: ["gas_line"], createdDaysAgo: 8, total: 240 },
    { id: "j13", title: "Replace blower motor", customerId: "c5", status: "scheduled", emergency: false, certifications: [], createdDaysAgo: 2, total: 760 },
    { id: "j14", title: "Water heater flush", customerId: "c1", status: "requested", emergency: false, certifications: [], createdDaysAgo: 0, total: 0 },
    { id: "j15", title: "Zoning damper diagnosis", customerId: "c11", status: "diagnosed", emergency: false, certifications: [], createdDaysAgo: 1, total: 0 },
    { id: "j16", title: "Old unit haul-away", customerId: "c3", status: "canceled", emergency: false, certifications: [], createdDaysAgo: 15, total: 0 },
  ] as DemoJob[],

  /** day: 2 = today. Jobs not listed here are waiting in the Assign job panel. */
  assignments: [
    { id: "a1", jobId: "j2", technicianId: "t1", day: 0, startMinute: 480, durationMinutes: 120 },
    { id: "a2", jobId: "j3", technicianId: "t3", day: 1, startMinute: 540, durationMinutes: 90 },
    { id: "a3", jobId: "j5", technicianId: "t2", day: 1, startMinute: 780, durationMinutes: 180 },
    { id: "a4", jobId: "j5", technicianId: "t4", day: 1, startMinute: 780, durationMinutes: 180 },
    { id: "a5", jobId: "j1", technicianId: "t1", day: 2, startMinute: 450, durationMinutes: 90 },
    { id: "a6", jobId: "j4", technicianId: "t3", day: 2, startMinute: 600, durationMinutes: 150 },
    { id: "a7", jobId: "j13", technicianId: "t2", day: 2, startMinute: 780, durationMinutes: 90 },
    { id: "a8", jobId: "j12", technicianId: "t3", day: 3, startMinute: 510, durationMinutes: 60 },
    { id: "a9", jobId: "j11", technicianId: "t1", day: 3, startMinute: 780, durationMinutes: 120 },
    { id: "a10", jobId: "j10", technicianId: "t4", day: 4, startMinute: 570, durationMinutes: 60 },
  ] as DemoAssignment[],

  inventory: [
    { id: "i1", name: "R-410A refrigerant", sku: "REF-410A-25", category: "Refrigerant", unit: "lb", onHand: 38, reorderAt: 25, unitCost: 9.5, sellPrice: 85, used30: 22, image: null, location: "Main warehouse" },
    { id: "i2", name: "Condensing unit, 3 ton", sku: "CU-3T-16S", category: "Equipment", unit: "each", onHand: 2, reorderAt: 2, unitCost: 1840, sellPrice: 3400, used30: 1, image: "/ingested/corvinn/home-condenser.jpg", location: "Main warehouse" },
    { id: "i3", name: "Flex duct, 6 inch", sku: "DUCT-FLX-6", category: "Ductwork", unit: "ft", onHand: 175, reorderAt: 100, unitCost: 1.2, sellPrice: 4.5, used30: 60, image: "/ingested/corvinn/duct-vent.jpg", location: "Van 2" },
    { id: "i4", name: "Rooftop exhaust fan", sku: "FAN-RT-18", category: "Equipment", unit: "each", onHand: 0, reorderAt: 1, unitCost: 410, sellPrice: 780, used30: 2, image: "/ingested/corvinn/rooftop-fans.jpg", location: "Main warehouse" },
    { id: "i5", name: "Galvanized trunk line", sku: "DUCT-TRK-8", category: "Ductwork", unit: "ft", onHand: 48, reorderAt: 40, unitCost: 6.8, sellPrice: 18, used30: 24, image: "/ingested/corvinn/roof-ductwork.jpg", location: "Main warehouse" },
    { id: "i6", name: "Hot surface ignitor", sku: "IGN-HSI-41", category: "Parts", unit: "each", onHand: 3, reorderAt: 4, unitCost: 22, sellPrice: 95, used30: 5, image: null, location: "Van 1" },
    { id: "i7", name: "Dual run capacitor 45/5", sku: "CAP-455-440", category: "Parts", unit: "each", onHand: 14, reorderAt: 6, unitCost: 11, sellPrice: 65, used30: 9, image: null, location: "Van 1" },
    { id: "i8", name: "Pleated filter 16x25x1", sku: "FLT-16251", category: "Filters", unit: "each", onHand: 62, reorderAt: 30, unitCost: 4.1, sellPrice: 18, used30: 40, image: null, location: "Main warehouse" },
    { id: "i9", name: "Smart thermostat", sku: "TSTAT-WIFI", category: "Controls", unit: "each", onHand: 7, reorderAt: 3, unitCost: 118, sellPrice: 249, used30: 3, image: null, location: "Main warehouse" },
    { id: "i10", name: "Nitrogen, dry", sku: "GAS-N2-80", category: "Refrigerant", unit: "cu ft", onHand: 160, reorderAt: 80, unitCost: 0.3, sellPrice: 1.5, used30: 70, image: null, location: "Van 2" },
  ] as DemoInventoryItem[],

  movements: [
    { id: "m1", itemId: "i1", type: "job_use", quantity: 4.5, jobId: "j11", by: "Marcus Bell", hoursAgo: 3 },
    { id: "m2", itemId: "i6", type: "job_use", quantity: 1, jobId: "j3", by: "Luis Ortega", hoursAgo: 5 },
    { id: "m3", itemId: "i8", type: "receive", quantity: 24, jobId: null, by: "Dana Whitfield", hoursAgo: 22 },
    { id: "m4", itemId: "i3", type: "job_use", quantity: 25, jobId: "j2", by: "Marcus Bell", hoursAgo: 27 },
    { id: "m5", itemId: "i7", type: "shop_use", quantity: 1, jobId: null, by: "Jordan Kim", hoursAgo: 30 },
    { id: "m6", itemId: "i4", type: "job_use", quantity: 1, jobId: "j2", by: "Marcus Bell", hoursAgo: 49 },
    { id: "m7", itemId: "i10", type: "waste", quantity: 10, jobId: null, by: "Luis Ortega", hoursAgo: 75 },
  ] as DemoMovement[],

  /** Paid invoices per day, oldest first, for the dashboard revenue line. */
  revenue14d: [1240, 860, 0, 2310, 1780, 940, 3120, 1460, 0, 2640, 1990, 3380, 2210, 2875],
};
