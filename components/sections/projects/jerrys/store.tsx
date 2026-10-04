"use client";

import * as React from "react";
import {
  jerrysDeck,
  type AutomationId,
  type DemoAutomation,
  type DemoCustomer,
  type DemoIngredient,
  type DemoItem,
  type DemoLine,
  type DemoNotification,
  type DemoOrder,
  type DemoPurchaseOrder,
  type DemoTicket,
  type DemoVendor,
  type DrawerEvent,
  type PaymentMethod,
  type RecipeLine,
} from "@/content/jerrys";

/**
 * One shared demo database for every Jerry's product slide. In the real POS
 * the checkout, sales, ingredients and drawer screens all read the same
 * Supabase tables, and a Postgres trigger takes each order line's recipe out
 * of stock. This store keeps that true for the demo: charge a meal deal on
 * the checkout and the sale is on the sales screen, the buns and patties are
 * gone from ingredients, the cash is in the drawer, and the owner's phone
 * buzzes. It lives for as long as the deck is open.
 */

export type Toast = { id: number; title: string; description?: string };

/** One cart line. `key` keeps two deal lines with different picks apart. */
export type CartLine = DemoLine & { key: string };

export type StockMove = { ingredientId: string; used: number; before: number; after: number; crossed: boolean };

export type ChargeResult = { order: DemoOrder; total: number; cashReceived: number; change: number; moves: StockMove[] };

export type DrawerState = {
  /** Current session number. Orders charged in it carry the same number. */
  session: number;
  open: boolean;
  openedBy: string;
  openedMinutesAgo: number;
  float: number;
  events: DrawerEvent[];
  /** Set once the viewer closes the drawer. */
  closed?: { counted: number; expected: number; variance: number };
};

type Store = {
  catalogues: typeof jerrysDeck.catalogues;
  items: DemoItem[];
  ingredients: DemoIngredient[];
  customers: DemoCustomer[];
  vendors: DemoVendor[];
  orders: DemoOrder[];
  tickets: DemoTicket[];
  drawer: DrawerState;
  purchaseOrders: DemoPurchaseOrder[];
  notifications: DemoNotification[];
  automations: DemoAutomation[];
  /** Notifications the viewer hasn't looked at on the automations slide. */
  unseenAlerts: number;
  markAlertsSeen: () => void;

  item: (id: string) => DemoItem;
  ingredient: (id: string) => DemoIngredient;
  customer: (id: string | null | undefined) => DemoCustomer | undefined;
  vendor: (id: string) => DemoVendor;
  isOn: (id: AutomationId) => boolean;

  /* cart, shared so it survives paging between slides */
  cart: CartLine[];
  cartCustomerId: string | null;
  /** The saved ticket currently loaded into the cart, if any. */
  activeTicketId: string | null;
  addToCart: (itemId: string, picks?: string[]) => void;
  changeQty: (key: string, delta: number) => void;
  clearCart: () => void;
  setCartCustomer: (id: string | null) => void;
  /** Parks the cart as a saved ticket (or updates the loaded one) and starts a fresh order. */
  saveTicket: () => void;
  loadTicket: (id: string) => void;
  deleteTicket: (id: string) => void;
  charge: (method: PaymentMethod, cashReceived: number) => ChargeResult | null;

  /* drawer */
  cashMove: (kind: "cash_in" | "cash_out", amount: number, note: string) => void;
  /** Cash that should be in the drawer right now. */
  expectedCash: () => number;
  closeDrawer: (counted: number) => void;
  openDrawer: (float: number) => void;

  /* purchasing */
  createPurchaseOrder: (ingredientIds: string[]) => DemoPurchaseOrder[];
  sendPurchaseOrder: (id: string) => void;
  receivePurchaseOrder: (id: string) => void;

  /* automations */
  toggleAutomation: (id: AutomationId) => void;
  runAutomation: (id: AutomationId) => void;

  toasts: Toast[];
  toast: (title: string, description?: string) => void;
  /** What the viewer clicked that isn't in the demo, or null when the walkthrough modal is closed. */
  walkthrough: string | null;
  askWalkthrough: (feature: string) => void;
  closeWalkthrough: () => void;
};

const StoreContext = React.createContext<Store | null>(null);

export function useStore(): Store {
  const store = React.useContext(StoreContext);
  if (!store) throw new Error("useStore must be used inside JerrysStoreProvider");
  return store;
}

let nextId = 100;
const newId = (prefix: string) => `${prefix}${nextId++}`;

/* ---------------------------------------------------------------------------
 * Pure helpers. Exported so screens price and expand lines the same way.
 * ------------------------------------------------------------------------- */

const ITEMS = new Map(jerrysDeck.items.map((i) => [i.id, i]));

export function itemById(id: string): DemoItem {
  return ITEMS.get(id) ?? jerrysDeck.items[0]!;
}

export function lineTotal(line: DemoLine): number {
  return itemById(line.itemId).price * line.qty;
}

export function linesTotal(lines: DemoLine[]): number {
  return lines.reduce((sum, l) => sum + lineTotal(l), 0);
}

export function orderTotal(order: Pick<DemoOrder, "lines">): number {
  return linesTotal(order.lines);
}

/**
 * Everything one line takes out of stock, merged by ingredient. A deal is
 * expanded through its fixed components and the cashier's picks, the same
 * way the real `decrement_stock_for_item` recurses into deal components.
 */
export function lineUsage(line: DemoLine): RecipeLine[] {
  const totals = new Map<string, number>();
  const add = (recipe: RecipeLine[], times: number) => recipe.forEach((r) => totals.set(r.ingredientId, (totals.get(r.ingredientId) ?? 0) + r.qty * times));
  const item = itemById(line.itemId);
  if (item.deal) {
    item.deal.fixed.forEach((f) => add(itemById(f.itemId).recipe, f.qty * line.qty));
    (line.picks ?? []).forEach((pick) => add(itemById(pick).recipe, line.qty));
  } else {
    add(item.recipe, line.qty);
  }
  return [...totals].map(([ingredientId, qty]) => ({ ingredientId, qty }));
}

export function linesUsage(lines: DemoLine[]): RecipeLine[] {
  const totals = new Map<string, number>();
  lines.flatMap(lineUsage).forEach((r) => totals.set(r.ingredientId, (totals.get(r.ingredientId) ?? 0) + r.qty));
  return [...totals].map(([ingredientId, qty]) => ({ ingredientId, qty }));
}

/** "Smash Burger" or "Jerry's Meal (Crispy Chicken)". */
export function lineName(line: DemoLine): string {
  const item = itemById(line.itemId);
  if (!line.picks?.length) return item.name;
  return `${item.name} (${line.picks.map((p) => itemById(p).name).join(", ")})`;
}

export function stockLevel(ing: Pick<DemoIngredient, "stock" | "threshold">): "out" | "low" | "ok" {
  if (ing.stock <= 0) return "out";
  if (ing.stock <= ing.threshold) return "low";
  return "ok";
}

/** Suggested purchase quantity: back up to three times the alert level. */
export function reorderQty(ing: DemoIngredient): number {
  const target = ing.threshold * 3 - ing.stock;
  const step = ing.unit === "g" || ing.unit === "ml" ? 500 : 10;
  return Math.max(step, Math.ceil(target / step) * step);
}

const lineKey = (itemId: string, picks?: string[]) => (picks?.length ? `${itemId}:${picks.join("+")}` : itemId);

/* ---------------------------------------------------------------------------
 * Provider
 * ------------------------------------------------------------------------- */

export function JerrysStoreProvider({ children }: { children: React.ReactNode }) {
  const [ingredients, setIngredients] = React.useState(jerrysDeck.ingredients);
  const [orders, setOrders] = React.useState(jerrysDeck.orders);
  const [tickets, setTickets] = React.useState(jerrysDeck.tickets);
  const [purchaseOrders, setPurchaseOrders] = React.useState(jerrysDeck.purchaseOrders);
  const [notifications, setNotifications] = React.useState(jerrysDeck.notifications);
  const [automations, setAutomations] = React.useState(jerrysDeck.automations);
  const [unseenAlerts, setUnseenAlerts] = React.useState(0);
  const [drawer, setDrawer] = React.useState<DrawerState>({
    session: 1,
    open: true,
    openedBy: jerrysDeck.drawer.openedBy,
    openedMinutesAgo: jerrysDeck.drawer.openedMinutesAgo,
    float: jerrysDeck.drawer.float,
    events: jerrysDeck.drawer.events,
  });
  const [cart, setCart] = React.useState<CartLine[]>([]);
  const [cartCustomerId, setCartCustomerId] = React.useState<string | null>(null);
  const [activeTicketId, setActiveTicketId] = React.useState<string | null>(null);
  const [toasts, setToasts] = React.useState<Toast[]>([]);
  const [walkthrough, setWalkthrough] = React.useState<string | null>(null);

  // Refs so actions chained inside one click read current state, not a stale closure.
  const ref = React.useRef({ ingredients, orders, tickets, purchaseOrders, automations, drawer, cart, cartCustomerId, activeTicketId });
  ref.current = { ingredients, orders, tickets, purchaseOrders, automations, drawer, cart, cartCustomerId, activeTicketId };

  const toast = React.useCallback((title: string, description?: string) => {
    const id = nextId++;
    setToasts((t) => [...t.slice(-2), { id, title, description }]);
    window.setTimeout(() => setToasts((t) => t.filter((x) => x.id !== id)), 3800);
  }, []);

  const notify = React.useCallback((kind: DemoNotification["kind"], title: string, body: string) => {
    setNotifications((prev) => [...prev, { id: newId("n"), kind, title, body, minutesAgo: 0 }]);
    setUnseenAlerts((n) => n + 1);
  }, []);

  const isOnNow = React.useCallback((id: AutomationId) => ref.current.automations.find((a) => a.id === id)?.enabled ?? false, []);

  const ingredient = React.useCallback((id: string) => ref.current.ingredients.find((i) => i.id === id) ?? jerrysDeck.ingredients[0]!, []);
  const vendor = React.useCallback((id: string) => jerrysDeck.vendors.find((v) => v.id === id) ?? jerrysDeck.vendors[0]!, []);
  const customer = React.useCallback((id: string | null | undefined) => (id ? jerrysDeck.customers.find((c) => c.id === id) : undefined), []);

  const nextPoSeq = () => Math.max(0, ...ref.current.purchaseOrders.map((p) => p.seq)) + 1;

  /** Draft one purchase order per vendor, merging into a vendor's open draft. */
  const draftPurchaseOrders = React.useCallback(
    (ingredientIds: string[], auto: boolean): DemoPurchaseOrder[] => {
      const byVendor = new Map<string, { ingredientId: string; qty: number }[]>();
      ingredientIds.forEach((id) => {
        const ing = ingredient(id);
        byVendor.set(ing.vendorId, [...(byVendor.get(ing.vendorId) ?? []), { ingredientId: id, qty: reorderQty(ing) }]);
      });
      const touched: DemoPurchaseOrder[] = [];
      let pos = [...ref.current.purchaseOrders];
      let seq = nextPoSeq();
      byVendor.forEach((lines, vendorId) => {
        const draft = pos.find((p) => p.vendorId === vendorId && p.status === "draft");
        if (draft) {
          const merged = { ...draft, lines: [...draft.lines.filter((l) => !lines.some((n) => n.ingredientId === l.ingredientId)), ...lines] };
          pos = pos.map((p) => (p.id === draft.id ? merged : p));
          touched.push(merged);
        } else {
          const created: DemoPurchaseOrder = { id: newId("po"), seq: seq++, vendorId, lines, status: "draft", minutesAgo: 0, auto };
          pos = [created, ...pos];
          touched.push(created);
        }
      });
      ref.current.purchaseOrders = pos;
      setPurchaseOrders(pos);
      return touched;
    },
    [ingredient],
  );

  const charge = React.useCallback<Store["charge"]>(
    (method, cashReceived) => {
      const { cart: lines, orders: existing, ingredients: stock, cartCustomerId: customerId, activeTicketId: ticketId, drawer: d } = ref.current;
      if (lines.length === 0 || !d.open) return null;
      const total = linesTotal(lines);
      const order: DemoOrder = {
        id: newId("o"),
        seq: Math.max(0, ...existing.map((o) => o.seq)) + 1,
        minutesAgo: 0,
        lines: lines.map(({ key: _key, ...l }) => l),
        method,
        customerId,
        cashier: jerrysDeck.cashierName,
        source: ticketId ? ref.current.tickets.find((t) => t.id === ticketId)?.source : "counter",
        session: d.session,
      };

      // The stock trigger: take every line's recipe out of stock, deals expanded.
      const usage = linesUsage(order.lines);
      const moves: StockMove[] = usage.map(({ ingredientId, qty }) => {
        const ing = stock.find((i) => i.id === ingredientId)!;
        const after = Math.round((ing.stock - qty) * 100) / 100;
        return { ingredientId, used: qty, before: ing.stock, after, crossed: ing.stock > ing.threshold && after <= ing.threshold };
      });
      const nextStock = stock.map((i) => {
        const move = moves.find((m) => m.ingredientId === i.id);
        return move ? { ...i, stock: move.after } : i;
      });
      ref.current.ingredients = nextStock;
      setIngredients(nextStock);
      setOrders([...existing, order]);
      if (ticketId) setTickets((prev) => prev.filter((t) => t.id !== ticketId));
      setCart([]);
      setCartCustomerId(null);
      setActiveTicketId(null);

      // What fires next, per the automations switched on.
      const who = customer(customerId)?.name ?? "walk-in";
      const summary = order.lines.map((l) => `${l.qty > 1 ? `${l.qty} ` : ""}${itemById(l.itemId).name}`).join(", ");
      const ref3 = String(order.seq).padStart(3, "0");
      if (isOnNow("sale-alert")) notify("sale", `Sale, Rs ${total.toLocaleString()}`, `ORD ${ref3} for ${who}. ${summary}. ${method === "cash" ? "Cash" : "QR transfer"}.`);
      const crossed = moves.filter((m) => m.crossed);
      if (crossed.length && isOnNow("low-stock")) {
        crossed.forEach((m) => {
          const ing = nextStock.find((i) => i.id === m.ingredientId)!;
          notify("low_stock", `Low stock: ${ing.name}`, `${m.after.toLocaleString()} ${ing.unit} left. Alert level is ${ing.threshold.toLocaleString()} ${ing.unit}.`);
        });
      }
      if (crossed.length && isOnNow("auto-reorder")) {
        draftPurchaseOrders(
          crossed.map((m) => m.ingredientId),
          true,
        ).forEach((po) => {
          const v = vendor(po.vendorId);
          notify("purchase", `Purchase order drafted, PO ${String(po.seq).padStart(3, "0")}`, `${v.name}: ${po.lines.map((l) => `${ingredient(l.ingredientId).name} ${l.qty.toLocaleString()} ${ingredient(l.ingredientId).unit}`).join(", ")}. One tap to send.`);
        });
      }
      if (isOnNow("kitchen-display")) toast("Sent to the kitchen display", `ORD ${ref3}, ${summary}`);

      return { order, total, cashReceived, change: Math.max(0, cashReceived - total), moves };
    },
    [customer, draftPurchaseOrders, ingredient, isOnNow, notify, toast, vendor],
  );

  const expectedCash = React.useCallback(() => {
    const d = ref.current.drawer;
    const cashSales = ref.current.orders.filter((o) => (o.session ?? 1) === d.session && o.method === "cash").reduce((s, o) => s + orderTotal(o), 0);
    const moves = d.events.reduce((s, e) => (e.kind === "cash_in" ? s + e.amount : e.kind === "cash_out" ? s - e.amount : s), 0);
    return d.float + cashSales + moves;
  }, []);

  const store = React.useMemo<Store>(
    () => ({
      catalogues: jerrysDeck.catalogues,
      items: jerrysDeck.items,
      ingredients,
      customers: jerrysDeck.customers,
      vendors: jerrysDeck.vendors,
      orders,
      tickets,
      drawer,
      purchaseOrders,
      notifications,
      automations,
      unseenAlerts,
      markAlertsSeen: () => setUnseenAlerts(0),

      item: itemById,
      ingredient: (id) => ingredients.find((i) => i.id === id) ?? jerrysDeck.ingredients[0]!,
      customer,
      vendor,
      isOn: (id) => automations.find((a) => a.id === id)?.enabled ?? false,

      cart,
      cartCustomerId,
      activeTicketId,
      addToCart: (itemId, picks) => {
        const key = lineKey(itemId, picks);
        setCart((prev) => (prev.some((l) => l.key === key) ? prev.map((l) => (l.key === key ? { ...l, qty: l.qty + 1 } : l)) : [...prev, { key, itemId, qty: 1, picks }]));
      },
      changeQty: (key, delta) => setCart((prev) => prev.flatMap((l) => (l.key !== key ? [l] : l.qty + delta <= 0 ? [] : [{ ...l, qty: l.qty + delta }]))),
      clearCart: () => {
        setCart([]);
        setCartCustomerId(null);
        setActiveTicketId(null);
      },
      setCartCustomer: setCartCustomerId,
      saveTicket: () => {
        const { cart: lines, cartCustomerId: cid, activeTicketId: tid, tickets: all } = ref.current;
        if (!lines.length) return;
        const plain = lines.map(({ key: _key, ...l }) => l);
        if (tid) {
          setTickets(all.map((t) => (t.id === tid ? { ...t, lines: plain, customerId: cid } : t)));
          toast("Ticket saved", "Changes kept on the saved ticket.");
        } else {
          const name = customer(cid)?.name ?? `Ticket ${all.length + 1}`;
          setTickets([...all, { id: newId("t"), name, customerId: cid, lines: plain, minutesAgo: 0 }]);
          toast("Saved, new order started", `${name} is parked in Tickets.`);
        }
        setCart([]);
        setCartCustomerId(null);
        setActiveTicketId(null);
      },
      loadTicket: (id) => {
        const t = ref.current.tickets.find((x) => x.id === id);
        if (!t) return;
        setCart(t.lines.map((l) => ({ ...l, key: lineKey(l.itemId, l.picks) })));
        setCartCustomerId(t.customerId);
        setActiveTicketId(t.id);
      },
      deleteTicket: (id) => {
        setTickets((prev) => prev.filter((t) => t.id !== id));
        if (ref.current.activeTicketId === id) {
          setCart([]);
          setCartCustomerId(null);
          setActiveTicketId(null);
        }
      },
      charge,

      cashMove: (kind, amount, note) => {
        setDrawer((d) => ({ ...d, events: [...d.events, { id: newId("d"), kind, amount, note, minutesAgo: 0, by: jerrysDeck.cashierName }] }));
        if (ref.current.automations.find((a) => a.id === "drawer-alert")?.enabled) {
          notify("drawer", `${kind === "cash_in" ? "Cash in" : "Cash out"}, Rs ${amount.toLocaleString()}`, `${note || "No note"}. By ${jerrysDeck.cashierName}.`);
        }
      },
      expectedCash,
      closeDrawer: (counted) => {
        const expected = expectedCash();
        const variance = counted - expected;
        setDrawer((d) => ({ ...d, open: false, closed: { counted, expected, variance } }));
        if (isOnNow("drawer-alert")) {
          notify(
            "drawer",
            variance === 0 ? "Drawer closed, balanced" : `Drawer closed, ${variance > 0 ? "over" : "short"} Rs ${Math.abs(variance).toLocaleString()}`,
            `Expected Rs ${expected.toLocaleString()}, counted Rs ${counted.toLocaleString()}. Closed by ${jerrysDeck.cashierName}.`,
          );
        }
        if (isOnNow("eod-report")) {
          const day = ref.current.orders;
          const revenue = day.reduce((s, o) => s + orderTotal(o), 0);
          const sold = new Map<string, number>();
          day.forEach((o) => o.lines.forEach((l) => sold.set(l.itemId, (sold.get(l.itemId) ?? 0) + l.qty)));
          const top = [...sold]
            .sort((a, b) => b[1] - a[1])
            .slice(0, 3)
            .map(([id, n]) => `${itemById(id).name} ${n}`)
            .join(", ");
          const used = linesUsage(day.flatMap((o) => o.lines));
          const prep = used
            .map(({ ingredientId, qty }) => ({ ing: ingredient(ingredientId), qty }))
            .filter(({ ing, qty }) => ing.stock < qty)
            .slice(0, 3)
            .map(({ ing, qty }) => `${ing.name} ${Math.ceil(qty - ing.stock).toLocaleString()} ${ing.unit}`)
            .join(", ");
          notify(
            "report",
            "End of day report",
            `Rs ${revenue.toLocaleString()} across ${day.length} orders. Top sellers: ${top}. Drawer ${variance === 0 ? "balanced" : `${variance > 0 ? "over" : "short"} Rs ${Math.abs(variance).toLocaleString()}`}. ${prep ? `Buy before tomorrow: ${prep}.` : "Stock covers tomorrow at today's pace."}`,
          );
        }
      },
      openDrawer: (float) => {
        setDrawer((d) => ({
          session: d.session + 1,
          open: true,
          openedBy: jerrysDeck.cashierName,
          openedMinutesAgo: 0,
          float,
          events: [{ id: newId("d"), kind: "open", amount: float, note: "Opening float", minutesAgo: 0, by: jerrysDeck.cashierName }],
        }));
        if (isOnNow("drawer-alert")) notify("drawer", "Drawer opened", `${jerrysDeck.cashierName} opened the drawer with a Rs ${float.toLocaleString()} float.`);
      },

      createPurchaseOrder: (ids) => {
        const touched = draftPurchaseOrders(ids, false);
        toast(touched.length === 1 ? "Purchase order drafted" : `${touched.length} purchase orders drafted`, touched.map((p) => vendor(p.vendorId).name).join(", "));
        return touched;
      },
      sendPurchaseOrder: (id) => {
        setPurchaseOrders((prev) => prev.map((p) => (p.id === id ? { ...p, status: "sent" } : p)));
        const po = ref.current.purchaseOrders.find((p) => p.id === id);
        if (po) toast("Purchase order sent", `To ${vendor(po.vendorId).name}`);
      },
      receivePurchaseOrder: (id) => {
        const po = ref.current.purchaseOrders.find((p) => p.id === id);
        if (!po) return;
        setPurchaseOrders((prev) => prev.map((p) => (p.id === id ? { ...p, status: "received" } : p)));
        setIngredients((prev) => prev.map((i) => {
          const line = po.lines.find((l) => l.ingredientId === i.id);
          return line ? { ...i, stock: i.stock + line.qty } : i;
        }));
        const cost = po.lines.reduce((s, l) => s + l.qty * ingredient(l.ingredientId).cost, 0);
        toast("Received into stock", `Rs ${Math.round(cost).toLocaleString()} logged as an expense`);
      },

      toggleAutomation: (id) => {
        const a = automations.find((x) => x.id === id);
        if (!a || a.locked) return;
        setAutomations((prev) => prev.map((x) => (x.id === id ? { ...x, enabled: !x.enabled } : x)));
        if (a.status === "addon" && !a.enabled) toast(jerrysDeck.copy.addonEnabled, a.title);
      },
      runAutomation: (id) => {
        if (!automations.find((x) => x.id === id)?.enabled) setAutomations((prev) => prev.map((x) => (x.id === id ? { ...x, enabled: true } : x)));
        if (id === "whatsapp-orders") {
          const w = jerrysDeck.whatsappOrder;
          const who = customer(w.customerId)!;
          setTickets((prev) => [...prev, { id: newId("t"), name: who.name, customerId: who.id, lines: w.lines, minutesAgo: 0, source: "whatsapp" }]);
          notify("order_in", `WhatsApp order from ${who.name}`, `"${w.message}" Saved on the counter as a ticket, Rs ${linesTotal(w.lines).toLocaleString()}.`);
          toast("New WhatsApp order", `${who.name} is waiting in Tickets on the checkout.`);
        }
        if (id === "win-back") {
          const lapsed = jerrysDeck.customers.filter((c) => !c.business && c.lastVisitDaysAgo >= 21);
          notify("offer", `Win-back sent to ${lapsed.length} regulars`, `${lapsed.map((c) => `${c.name} (${c.lastVisitDaysAgo} days)`).join(", ")}. 15% off their next meal, valid this week.`);
          toast("Offers sent", `${lapsed.length} regulars who have not been in for three weeks`);
        }
      },

      toasts,
      toast,
      walkthrough,
      askWalkthrough: (feature) => setWalkthrough(feature),
      closeWalkthrough: () => setWalkthrough(null),
    }),
    [ingredients, orders, tickets, drawer, purchaseOrders, notifications, automations, unseenAlerts, customer, vendor, cart, cartCustomerId, activeTicketId, charge, expectedCash, isOnNow, notify, draftPurchaseOrders, ingredient, toasts, toast, walkthrough],
  );

  return <StoreContext.Provider value={store}>{children}</StoreContext.Provider>;
}

/* ---------------------------------------------------------------------------
 * Formatting
 * ------------------------------------------------------------------------- */

export const rs = (n: number) => `Rs ${Math.round(n).toLocaleString("en-US")}`;

/** Clock time for something that happened `minutesAgo` minutes ago. */
export function clockAt(minutesAgo: number): string {
  return new Date(Date.now() - minutesAgo * 60_000).toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit", hour12: true });
}

export function agoLabel(minutes: number): string {
  if (minutes < 1) return "now";
  if (minutes < 60) return `${minutes}m ago`;
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return m ? `${h}h ${m}m ago` : `${h}h ago`;
}

/** ORD-YYYYMMDD-NNN, dated today, like the real order numbers. */
export function orderNumber(seq: number): string {
  const d = new Date();
  return `ORD-${d.getFullYear()}${String(d.getMonth() + 1).padStart(2, "0")}${String(d.getDate()).padStart(2, "0")}-${String(seq).padStart(3, "0")}`;
}

export function poNumber(seq: number): string {
  return `PO-${String(seq).padStart(3, "0")}`;
}

/** Stock with its unit: "1,650 g", "23 pcs". */
export function qtyLabel(qty: number, unit: string): string {
  const n = Math.round(qty * 100) / 100;
  return `${n.toLocaleString("en-US")} ${unit}`;
}
