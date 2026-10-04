/**
 * Jerry's case-study deck: slide copy, project facts, and the demo dataset the
 * live product slides run on. The product slides are a working copy of the
 * real Jerry's POS (Checkout, Sales, Ingredients, Drawer), so the demo data is
 * shaped like its tables: catalogues, items with recipes, deals with choice
 * slots, ingredients, orders, saved tickets and drawer sessions.
 *
 * Times are stored as minutes ago and turned into clock times in the browser,
 * so the day's orders always end "now" whenever someone views the deck. The
 * menu, customers and staff are demo data, not Jerry's real figures.
 */
import type { SlideCopy } from "./corvinn";

export type Unit = "pcs" | "g" | "ml" | "slice";

export type DemoIngredient = {
  id: string;
  name: string;
  unit: Unit;
  stock: number;
  /** Low stock alert fires when stock falls to or below this. */
  threshold: number;
  /** Cost per unit, Rs. */
  cost: number;
  vendorId: string;
};

export type RecipeLine = { ingredientId: string; qty: number };

export type DemoCatalogue = { id: string; name: string };

/** A deal's choice slot: the cashier picks `quantity` items from `options`. */
export type DealSlot = { id: string; name: string; quantity: number; options: string[] };

export type DemoItem = {
  id: string;
  catalogueId: string;
  name: string;
  price: number;
  /** Photo tile. Items without one render as a colored label tile, like the real catalogue. */
  image?: string;
  /** Short tile label (2 to 7 characters) for label tiles. */
  label?: string;
  tileBg?: string;
  labelColor?: string;
  /** Ingredients one unit takes out of stock. Empty for availability-tracked items. */
  recipe: RecipeLine[];
  /** Deals bundle other items: fixed components plus choice slots. */
  deal?: { fixed: { itemId: string; qty: number }[]; slots: DealSlot[] };
};

export type DemoCustomer = {
  id: string;
  name: string;
  phone: string;
  points: number;
  visits: number;
  /** Office or shop account with several people ordering under it. */
  business?: boolean;
  lastVisitDaysAgo: number;
};

export type DemoLine = {
  itemId: string;
  qty: number;
  /** Deal picks for one unit of the deal, as item ids: one per slot place, in slot order. */
  picks?: string[];
};

export type PaymentMethod = "cash" | "qr";

export type DemoOrder = {
  id: string;
  /** Sequence number for the day, shown as ORD-YYYYMMDD-NNN. */
  seq: number;
  minutesAgo: number;
  lines: DemoLine[];
  method: PaymentMethod;
  customerId: string | null;
  cashier: string;
  /** Came in through the WhatsApp ordering add-on. */
  source?: "counter" | "whatsapp";
  /** Drawer session the order was charged in. Seed orders are session 1. */
  session?: number;
};

export type DemoTicket = {
  id: string;
  name: string;
  customerId: string | null;
  lines: DemoLine[];
  minutesAgo: number;
  source?: "counter" | "whatsapp";
};

export type DrawerEventKind = "open" | "cash_in" | "cash_out";

export type DrawerEvent = { id: string; kind: DrawerEventKind; amount: number; note: string; minutesAgo: number; by: string };

export type NotificationKind = "sale" | "low_stock" | "drawer" | "purchase" | "report" | "order_in" | "offer";

/** One message on the owner's phone. */
export type DemoNotification = {
  id: string;
  kind: NotificationKind;
  title: string;
  body: string;
  minutesAgo: number;
};

export type DemoVendor = { id: string; name: string; phone: string };

export type PurchaseStatus = "draft" | "sent" | "received";

export type DemoPurchaseOrder = {
  id: string;
  seq: number;
  vendorId: string;
  lines: { ingredientId: string; qty: number }[];
  status: PurchaseStatus;
  minutesAgo: number;
  /** Drafted by the auto reorder add-on rather than by hand. */
  auto?: boolean;
};

export type AutomationId =
  | "sale-alert"
  | "stock-decrement"
  | "low-stock"
  | "drawer-alert"
  | "receipt"
  | "auto-reorder"
  | "eod-report"
  | "whatsapp-orders"
  | "kitchen-display"
  | "win-back";

export type DemoAutomation = {
  id: AutomationId;
  /** "live": running in Jerry's build today. "addon": what we'd build next, demo only. */
  status: "live" | "addon";
  title: string;
  body: string;
  trigger: string;
  channel: string;
  /** Lucide icon name, mapped in the screen. */
  icon: string;
  enabled: boolean;
  /** Always on: the toggle is shown locked. */
  locked?: boolean;
  /** Optional one-click action shown on the card. */
  action?: string;
};

export const jerrysDeck = {
  storeName: "Jerry's",
  storeCity: "Counter 1",
  cashierName: "Hira Shah",
  ownerLabel: "Owner",
  logo: { src: "/ingested/jerrys/logo.jpg", alt: "Jerry's" },
  currency: "Rs",

  slides: {
    cover: { id: "cover", title: "Jerry's POS", summary: "The project at a glance", thumb: "/ingested/jerrys/slides/cover.jpg" },
    overview: { id: "overview", title: "Overview", summary: "What it is, who uses it, the stack, and how a sale moves stock", thumb: "/ingested/jerrys/slides/overview.jpg" },
    checkout: {
      id: "checkout",
      thumb: "/ingested/jerrys/slides/checkout.jpg",
      title: "Checkout",
      summary: "The counter screen: catalogue tiles, meal deals, cart and charge",
      hint: "Tap a few items or a meal deal, then Charge. Watch the recipe come out of stock.",
    },
    sales: {
      id: "sales",
      thumb: "/ingested/jerrys/slides/sales.jpg",
      title: "Sales",
      summary: "Today's revenue, orders, top sellers and every receipt",
      hint: "Today's numbers. Every order you charge on the checkout lands here.",
    },
    stock: {
      id: "stock",
      thumb: "/ingested/jerrys/slides/stock.jpg",
      title: "Ingredients",
      summary: "Live stock by ingredient, used today, and purchase orders",
      hint: "Ingredients drop as you sell. Select the low ones and draft a purchase order.",
    },
    drawer: {
      id: "drawer",
      thumb: "/ingested/jerrys/slides/drawer.jpg",
      title: "Drawer",
      summary: "The cash drawer session: float, cash in and out, close and count",
      hint: "Add a cash in or out, then close the drawer and count it.",
    },
    automations: {
      id: "automations",
      thumb: "/ingested/jerrys/slides/automations.jpg",
      title: "Automations",
      summary: "What runs by itself, the add-ons we'd build next, and the owner's phone",
      hint: "Switch on an add-on, then go sell something. The owner's phone shows what fires.",
    },
    platform: { id: "platform", title: "The rest of the system", summary: "Recipes, vendors, expenses, loyalty, printing, roles and more", thumb: "/ingested/jerrys/slides/platform.jpg" },
    closing: { id: "closing", title: "Start a project", summary: "Want this running in your restaurant", thumb: "/ingested/jerrys/slides/closing.jpg" },
  } satisfies Record<string, SlideCopy>,

  overview: {
    eyebrow: "Overview",
    title: "A counter that keeps the kitchen's books by itself",
    body: "Jerry's is a quick service restaurant. Every sale on the counter tablet takes its recipe out of stock, meal deals included, down to the gram. Cash is counted per drawer session, low stock and drawer variances reach the owner on WhatsApp, and purchases flow from grocery list to expense without a spreadsheet.",
    image: { src: "/ingested/jerrys/burger-fries.jpg", alt: "A stacked beef burger next to a pile of fries on a wooden board" },
    /** The interactive recipe cascade on the overview slide. */
    cascade: {
      label: "One sale, traced from the menu item to the ingredients it uses",
      hint: "Pick an item and sell one.",
      sell: "Sell one",
      reset: "Reset stock",
      itemsLabel: "Menu item",
      componentsLabel: "Goes into",
      stockLabel: "Comes out of stock",
      alert: "Low stock alert sent to the owner",
      items: ["deal-meal", "double", "wings"],
    },
    facts: [
      { label: "What it is", value: "Point of sale, inventory and back office for a quick service restaurant" },
      { label: "Who uses it", value: "Cashiers on the counter tablet, the kitchen, and the owner from their phone" },
      { label: "Our role", value: "Designed and built end to end: database, POS app, printing and alerts" },
      { label: "Built", value: "Since April 2026, shipped in 240 commits" },
    ],
    stack: [
      "Next.js 16",
      "React 19",
      "Tailwind CSS v4",
      "Supabase Postgres",
      "Postgres triggers",
      "Edge Functions",
      "Row level security",
      "Realtime",
      "Installable PWA",
      "ESC/POS thermal printing",
      "WhatsApp alerts",
      "Resend and Gmail",
    ],
  },

  platform: {
    eyebrow: "Also in the box",
    title: "Everything a restaurant runs behind the counter",
    body: "The slides showed the screens the counter lives in. Around them sit the modules that run the kitchen, the suppliers and the money.",
    modules: [
      { icon: "Printer", title: "Built for the counter", body: "An installable app on the counter tablet, printing receipts and kitchen tokens straight to USB and WiFi thermal printers, with an offline screen when the line drops." },
      { icon: "ChefHat", title: "Recipes", body: "Every dish built from ingredients in grams, ml and pieces, so cost and stock stay exact." },
      { icon: "Truck", title: "Vendors and purchase flow", body: "Grocery lists, purchase orders and a board from ordered to bought to expensed." },
      { icon: "Wallet", title: "Expenses and revenue", body: "Spend by category with receipt photos, next to revenue reports." },
      { icon: "Award", title: "Loyalty", body: "Points per order, tiers with multipliers, and business accounts with named contacts." },
      { icon: "LayoutGrid", title: "Catalogue builder", body: "Tiles with photos or color labels, drag to reorder, deals with choice slots." },
      { icon: "Shield", title: "Roles and audit", body: "Per page permissions for cashiers and managers, and a full activity log." },
      { icon: "ListChecks", title: "Record", body: "Sold against left, order by order, with any order missing its stock log flagged red." },
    ],
  },

  closing: {
    eyebrow: "Your turn",
    title: "Want your restaurant running itself like this",
    body: "We build point of sale, stock and automation systems around how your kitchen actually works, and keep shipping after launch.",
    primary: { label: "Start a project", href: "/contact" },
    secondary: { label: "Back to all work", href: "/#work" },
  },

  /** Centered modal shown when someone clicks a screen or action this demo doesn't include. */
  walkthrough: {
    eyebrow: "In the full system",
    /** `{feature}` is replaced with what they clicked. */
    title: "{feature} is part of the full Jerry's build",
    body: "This demo covers the screens the counter uses most. In a 30 minute walkthrough we run the whole system with you, on your own menu.",
    points: ["Every module, live, on a real counter tablet", "Your menu and recipes mapped to stock", "A straight answer on timeline and cost"],
    primary: { label: "Book a full walkthrough", href: "/contact" },
    secondary: "Keep exploring the demo",
  },

  /** Copy for the screens that the store or more than one screen uses. */
  copy: {
    walkIn: "Walk-in",
    addonTag: "Add-on",
    liveTag: "Running at Jerry's",
    addonEnabled: "Add-on switched on for this demo",
    phoneTitle: "Jerry's POS",
    phoneSubtitle: "Alerts to the owner on WhatsApp",
  },

  catalogues: [
    { id: "burgers", name: "Burgers" },
    { id: "chicken", name: "Chicken" },
    { id: "sides", name: "Sides" },
    { id: "drinks", name: "Drinks" },
    { id: "deals", name: "Deals" },
  ] as DemoCatalogue[],

  ingredients: [
    { id: "bun", name: "Brioche bun", unit: "pcs", stock: 64, threshold: 30, cost: 45, vendorId: "v-bakery" },
    { id: "beef", name: "Beef patty", unit: "pcs", stock: 41, threshold: 25, cost: 220, vendorId: "v-meat" },
    { id: "chicken", name: "Chicken fillet", unit: "pcs", stock: 23, threshold: 20, cost: 180, vendorId: "v-meat" },
    { id: "tenders", name: "Chicken tenders", unit: "pcs", stock: 58, threshold: 30, cost: 60, vendorId: "v-meat" },
    { id: "wings", name: "Chicken wings", unit: "pcs", stock: 47, threshold: 40, cost: 35, vendorId: "v-meat" },
    { id: "cheese", name: "Cheddar slice", unit: "slice", stock: 88, threshold: 40, cost: 30, vendorId: "v-dairy" },
    { id: "lettuce", name: "Iceberg lettuce", unit: "g", stock: 1650, threshold: 800, cost: 0.4, vendorId: "v-greens" },
    { id: "sauce", name: "Jerry's sauce", unit: "ml", stock: 1380, threshold: 600, cost: 0.6, vendorId: "v-greens" },
    { id: "fries", name: "Frozen fries", unit: "g", stock: 5200, threshold: 3000, cost: 0.5, vendorId: "v-greens" },
    { id: "oil", name: "Frying oil", unit: "ml", stock: 8600, threshold: 5000, cost: 0.55, vendorId: "v-greens" },
    { id: "tortilla", name: "Tortilla wrap", unit: "pcs", stock: 14, threshold: 10, cost: 40, vendorId: "v-bakery" },
    { id: "milk", name: "Milk", unit: "ml", stock: 3400, threshold: 2000, cost: 0.3, vendorId: "v-dairy" },
    { id: "icecream", name: "Vanilla ice cream", unit: "g", stock: 2300, threshold: 1500, cost: 1.1, vendorId: "v-dairy" },
    { id: "cola", name: "Cola can", unit: "pcs", stock: 27, threshold: 24, cost: 95, vendorId: "v-drinks" },
    { id: "water", name: "Water bottle", unit: "pcs", stock: 38, threshold: 12, cost: 40, vendorId: "v-drinks" },
  ] as DemoIngredient[],

  vendors: [
    { id: "v-meat", name: "Punjab Meats", phone: "+92 300 111 2040" },
    { id: "v-bakery", name: "Golden Crust Bakery", phone: "+92 321 448 9012" },
    { id: "v-dairy", name: "Fresh Valley Dairy", phone: "+92 333 270 5518" },
    { id: "v-greens", name: "Model Town Wholesale", phone: "+92 345 902 1187" },
    { id: "v-drinks", name: "City Beverages", phone: "+92 301 655 7730" },
  ] as DemoVendor[],

  items: [
    { id: "smash", catalogueId: "burgers", name: "Smash Burger", price: 750, image: "/ingested/jerrys/menu/smash-burger.jpg", recipe: [{ ingredientId: "bun", qty: 1 }, { ingredientId: "beef", qty: 1 }, { ingredientId: "cheese", qty: 1 }, { ingredientId: "lettuce", qty: 20 }, { ingredientId: "sauce", qty: 25 }] },
    { id: "double", catalogueId: "burgers", name: "Double Stack", price: 1150, image: "/ingested/jerrys/menu/double-stack.jpg", recipe: [{ ingredientId: "bun", qty: 1 }, { ingredientId: "beef", qty: 2 }, { ingredientId: "cheese", qty: 2 }, { ingredientId: "lettuce", qty: 20 }, { ingredientId: "sauce", qty: 30 }] },
    { id: "classic", catalogueId: "burgers", name: "Classic Beef", price: 650, image: "/ingested/jerrys/menu/classic-burger.jpg", recipe: [{ ingredientId: "bun", qty: 1 }, { ingredientId: "beef", qty: 1 }, { ingredientId: "lettuce", qty: 25 }, { ingredientId: "sauce", qty: 20 }] },
    { id: "crispy", catalogueId: "chicken", name: "Crispy Chicken", price: 690, image: "/ingested/jerrys/menu/crispy-chicken.jpg", recipe: [{ ingredientId: "bun", qty: 1 }, { ingredientId: "chicken", qty: 1 }, { ingredientId: "lettuce", qty: 20 }, { ingredientId: "sauce", qty: 25 }, { ingredientId: "oil", qty: 40 }] },
    { id: "tenders", catalogueId: "chicken", name: "Tenders, 4 pc", price: 620, image: "/ingested/jerrys/menu/tenders.jpg", recipe: [{ ingredientId: "tenders", qty: 4 }, { ingredientId: "sauce", qty: 30 }, { ingredientId: "oil", qty: 30 }] },
    { id: "wings", catalogueId: "chicken", name: "Hot Wings, 6 pc", price: 720, image: "/ingested/jerrys/menu/wings.jpg", recipe: [{ ingredientId: "wings", qty: 6 }, { ingredientId: "oil", qty: 50 }] },
    { id: "wrap", catalogueId: "chicken", name: "Chicken Wrap", price: 590, image: "/ingested/jerrys/menu/wrap.jpg", recipe: [{ ingredientId: "tortilla", qty: 1 }, { ingredientId: "chicken", qty: 1 }, { ingredientId: "lettuce", qty: 30 }, { ingredientId: "sauce", qty: 20 }] },
    { id: "fries", catalogueId: "sides", name: "Fries", price: 290, image: "/ingested/jerrys/menu/fries.jpg", recipe: [{ ingredientId: "fries", qty: 150 }, { ingredientId: "oil", qty: 40 }] },
    { id: "loaded", catalogueId: "sides", name: "Loaded Fries", price: 490, image: "/ingested/jerrys/menu/loaded-fries.jpg", recipe: [{ ingredientId: "fries", qty: 180 }, { ingredientId: "cheese", qty: 2 }, { ingredientId: "sauce", qty: 30 }, { ingredientId: "oil", qty: 40 }] },
    { id: "shake", catalogueId: "drinks", name: "Oreo Shake", price: 450, image: "/ingested/jerrys/menu/shake.jpg", recipe: [{ ingredientId: "milk", qty: 250 }, { ingredientId: "icecream", qty: 120 }] },
    { id: "cola", catalogueId: "drinks", name: "Cola", price: 150, label: "Cola", tileBg: "#b91c1c", labelColor: "#ffffff", recipe: [{ ingredientId: "cola", qty: 1 }] },
    { id: "water", catalogueId: "drinks", name: "Mineral Water", price: 80, label: "Water", tileBg: "#0369a1", labelColor: "#ffffff", recipe: [{ ingredientId: "water", qty: 1 }] },
    { id: "mint", catalogueId: "drinks", name: "Mint Margarita", price: 280, label: "Mint", tileBg: "#15803d", labelColor: "#ffffff", recipe: [] },
    {
      id: "deal-meal",
      catalogueId: "deals",
      name: "Jerry's Meal",
      price: 990,
      image: "/ingested/jerrys/menu/combo.jpg",
      recipe: [],
      deal: {
        fixed: [{ itemId: "fries", qty: 1 }, { itemId: "cola", qty: 1 }],
        slots: [{ id: "burger", name: "Pick a burger", quantity: 1, options: ["smash", "classic", "crispy"] }],
      },
    },
    {
      id: "deal-duo",
      catalogueId: "deals",
      name: "Duo Deal",
      price: 1890,
      label: "Duo",
      tileBg: "#18181b",
      labelColor: "#ffffff",
      recipe: [],
      deal: {
        fixed: [{ itemId: "fries", qty: 2 }, { itemId: "cola", qty: 2 }],
        slots: [{ id: "burgers", name: "Pick 2 burgers", quantity: 2, options: ["smash", "classic", "crispy"] }],
      },
    },
    {
      id: "deal-wings",
      catalogueId: "deals",
      name: "Wings Bucket",
      price: 1590,
      label: "Bucket",
      tileBg: "#c2410c",
      labelColor: "#ffffff",
      recipe: [],
      deal: {
        fixed: [{ itemId: "wings", qty: 2 }, { itemId: "loaded", qty: 1 }],
        slots: [{ id: "drink", name: "Pick a drink", quantity: 1, options: ["cola", "water", "shake"] }],
      },
    },
  ] as DemoItem[],

  customers: [
    { id: "cu1", name: "Ayesha Khan", phone: "+92 300 482 1190", points: 340, visits: 22, lastVisitDaysAgo: 2 },
    { id: "cu2", name: "Hamza Malik", phone: "+92 321 770 4412", points: 120, visits: 8, lastVisitDaysAgo: 0 },
    { id: "cu3", name: "Sara Ahmed", phone: "+92 333 190 2286", points: 515, visits: 31, lastVisitDaysAgo: 1 },
    { id: "cu4", name: "Bilal Raza", phone: "+92 345 618 0034", points: 60, visits: 4, lastVisitDaysAgo: 23 },
    { id: "cu5", name: "Zainab Ali", phone: "+92 301 224 7781", points: 210, visits: 14, lastVisitDaysAgo: 26 },
    { id: "cu6", name: "Bluebell Studio", phone: "+92 42 3577 0091", points: 980, visits: 47, business: true, lastVisitDaysAgo: 0 },
    { id: "cu7", name: "Omar Farooq", phone: "+92 302 556 1903", points: 35, visits: 2, lastVisitDaysAgo: 0 },
  ] as DemoCustomer[],

  /** Today so far, oldest first. */
  orders: [
    { id: "o1", seq: 1, minutesAgo: 545, lines: [{ itemId: "classic", qty: 1 }, { itemId: "cola", qty: 1 }], method: "cash", customerId: null, cashier: "Hira Shah" },
    { id: "o2", seq: 2, minutesAgo: 520, lines: [{ itemId: "shake", qty: 2 }], method: "qr", customerId: "cu3", cashier: "Hira Shah" },
    { id: "o3", seq: 3, minutesAgo: 470, lines: [{ itemId: "deal-meal", qty: 1, picks: ["smash"] }, { itemId: "water", qty: 1 }], method: "cash", customerId: null, cashier: "Hira Shah" },
    { id: "o4", seq: 4, minutesAgo: 410, lines: [{ itemId: "wrap", qty: 2 }, { itemId: "fries", qty: 1 }], method: "cash", customerId: "cu2", cashier: "Hira Shah" },
    { id: "o5", seq: 5, minutesAgo: 372, lines: [{ itemId: "deal-duo", qty: 1, picks: ["smash", "crispy"] }], method: "qr", customerId: null, cashier: "Hira Shah" },
    { id: "o6", seq: 6, minutesAgo: 351, lines: [{ itemId: "double", qty: 1 }, { itemId: "loaded", qty: 1 }, { itemId: "mint", qty: 1 }], method: "cash", customerId: "cu1", cashier: "Hira Shah" },
    { id: "o7", seq: 7, minutesAgo: 338, lines: [{ itemId: "smash", qty: 3 }, { itemId: "fries", qty: 2 }, { itemId: "cola", qty: 3 }], method: "qr", customerId: "cu6", cashier: "Hira Shah" },
    { id: "o8", seq: 8, minutesAgo: 320, lines: [{ itemId: "wings", qty: 1 }, { itemId: "cola", qty: 1 }], method: "cash", customerId: null, cashier: "Hira Shah" },
    { id: "o9", seq: 9, minutesAgo: 296, lines: [{ itemId: "crispy", qty: 1 }, { itemId: "fries", qty: 1 }], method: "cash", customerId: null, cashier: "Hira Shah" },
    { id: "o10", seq: 10, minutesAgo: 241, lines: [{ itemId: "tenders", qty: 1 }, { itemId: "shake", qty: 1 }], method: "qr", customerId: "cu3", cashier: "Hira Shah" },
    { id: "o11", seq: 11, minutesAgo: 188, lines: [{ itemId: "deal-meal", qty: 1, picks: ["classic"] }, { itemId: "deal-meal", qty: 1, picks: ["crispy"] }], method: "cash", customerId: null, cashier: "Hira Shah" },
    { id: "o12", seq: 12, minutesAgo: 142, lines: [{ itemId: "smash", qty: 1 }, { itemId: "water", qty: 1 }], method: "cash", customerId: "cu7", cashier: "Hira Shah" },
    { id: "o13", seq: 13, minutesAgo: 96, lines: [{ itemId: "deal-wings", qty: 1, picks: ["shake"] }], method: "qr", customerId: null, cashier: "Hira Shah" },
    { id: "o14", seq: 14, minutesAgo: 61, lines: [{ itemId: "double", qty: 2 }, { itemId: "fries", qty: 2 }, { itemId: "cola", qty: 2 }], method: "cash", customerId: "cu2", cashier: "Hira Shah" },
    { id: "o15", seq: 15, minutesAgo: 34, lines: [{ itemId: "classic", qty: 1 }, { itemId: "loaded", qty: 1 }], method: "qr", customerId: null, cashier: "Hira Shah" },
    { id: "o16", seq: 16, minutesAgo: 12, lines: [{ itemId: "wrap", qty: 1 }, { itemId: "mint", qty: 1 }], method: "cash", customerId: null, cashier: "Hira Shah" },
  ] as DemoOrder[],

  tickets: [
    { id: "t1", name: "Table 4", customerId: null, lines: [{ itemId: "smash", qty: 2 }, { itemId: "fries", qty: 1 }, { itemId: "shake", qty: 2 }], minutesAgo: 9 },
    { id: "t2", name: "Bluebell Studio", customerId: "cu6", lines: [{ itemId: "deal-meal", qty: 2, picks: ["smash"] }, { itemId: "deal-meal", qty: 1, picks: ["crispy"] }, { itemId: "water", qty: 2 }], minutesAgo: 22 },
  ] as DemoTicket[],

  drawer: {
    openedBy: "Hira Shah",
    openedMinutesAgo: 560,
    float: 10000,
    events: [
      { id: "d1", kind: "open", amount: 10000, note: "Opening float", minutesAgo: 560, by: "Hira Shah" },
      { id: "d2", kind: "cash_out", amount: 1200, note: "Ice and lemons, corner shop", minutesAgo: 300, by: "Hira Shah" },
      { id: "d3", kind: "cash_in", amount: 2000, note: "Change top up from the safe", minutesAgo: 190, by: "Hira Shah" },
    ] as DrawerEvent[],
  },

  purchaseOrders: [
    { id: "po1", seq: 7, vendorId: "v-bakery", lines: [{ ingredientId: "bun", qty: 120 }, { ingredientId: "tortilla", qty: 40 }], status: "sent", minutesAgo: 320 },
  ] as DemoPurchaseOrder[],

  notifications: [
    { id: "n1", kind: "drawer", title: "Drawer opened", body: "Hira Shah opened the drawer with a Rs 10,000 float.", minutesAgo: 560 },
    { id: "n2", kind: "drawer", title: "Cash out, Rs 1,200", body: "Ice and lemons, corner shop. By Hira Shah.", minutesAgo: 300 },
    { id: "n3", kind: "sale", title: "Sale, Rs 3,180", body: "ORD 014 for Hamza Malik. 2 Double Stack, 2 Fries, 2 Cola. Cash.", minutesAgo: 61 },
    { id: "n4", kind: "sale", title: "Sale, Rs 870", body: "ORD 016, walk-in. Chicken Wrap, Mint Margarita. Cash.", minutesAgo: 12 },
  ] as DemoNotification[],

  automations: [
    { id: "sale-alert", status: "live", title: "Sale alerts", body: "Every completed order goes to the owner with the items, the total and how it was paid.", trigger: "Order charged", channel: "WhatsApp and email", icon: "Receipt", enabled: true },
    { id: "stock-decrement", status: "live", title: "Recipe stock decrement", body: "A database trigger takes each dish's recipe out of stock, meal deal components included, the moment the order saves.", trigger: "Order line saved", channel: "Database", icon: "ChefHat", enabled: true, locked: true },
    { id: "low-stock", status: "live", title: "Low stock alerts", body: "When an ingredient falls to its threshold, the owner gets its name and what is left.", trigger: "Stock at threshold", channel: "WhatsApp and email", icon: "PackageX", enabled: true },
    { id: "drawer-alert", status: "live", title: "Drawer alerts", body: "Opening float, every cash in and cash out, and the variance when the drawer closes.", trigger: "Drawer events", channel: "WhatsApp and email", icon: "Wallet", enabled: true },
    { id: "receipt", status: "live", title: "Digital receipts", body: "Every order gets a public receipt link and a QR code printed on the thermal slip.", trigger: "Order charged", channel: "Receipt link", icon: "QrCode", enabled: true },
    { id: "auto-reorder", status: "addon", title: "Auto reorder", body: "When stock hits its threshold, a purchase order for the usual vendor is drafted and waits for one tap to send.", trigger: "Stock at threshold", channel: "WhatsApp to vendor", icon: "Truck", enabled: false },
    { id: "eod-report", status: "addon", title: "End of day report", body: "When the drawer closes, the owner gets revenue, top sellers, the variance and tomorrow's prep list.", trigger: "Drawer closed", channel: "WhatsApp", icon: "FileBarChart2", enabled: false },
    { id: "whatsapp-orders", status: "addon", title: "WhatsApp ordering", body: "Customers order from WhatsApp and the order lands on the counter as a saved ticket, ready to charge.", trigger: "Customer message", channel: "WhatsApp", icon: "MessageCircle", enabled: false, action: "Send a test order" },
    { id: "win-back", status: "addon", title: "Win-back offers", body: "Regulars who have not been in for three weeks get a personal offer on WhatsApp.", trigger: "Daily at 11:00", channel: "WhatsApp", icon: "HeartHandshake", enabled: false, action: "Run it now" },
    { id: "kitchen-display", status: "addon", title: "Kitchen display", body: "Charged orders go to a screen in the kitchen with prep timers, instead of a paper token.", trigger: "Order charged", channel: "Kitchen screen", icon: "MonitorPlay", enabled: false },
  ] as DemoAutomation[],

  /** What the WhatsApp ordering add-on drops on the counter when tested. */
  whatsappOrder: {
    customerId: "cu1",
    lines: [{ itemId: "deal-meal", qty: 1, picks: ["smash"] }, { itemId: "deal-meal", qty: 1, picks: ["crispy"] }, { itemId: "shake", qty: 1 }] as DemoLine[],
    message: "Hi Jerry's! 2 meals please, one smash and one crispy, and an Oreo shake. Pickup in 20 minutes.",
  },
};
