"use client";

import * as React from "react";
import { motion, useReducedMotion } from "motion/react";
import {
  ArrowRight,
  Banknote,
  Bookmark,
  Check,
  ChevronRight,
  Grid2x2,
  Layers,
  Lock,
  MessageCircle,
  Minus,
  Plus,
  Printer,
  QrCode,
  Receipt,
  RotateCcw,
  ShoppingCart,
  Tag,
  Trash2,
  Wallet,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { jerrysDeck, type DemoItem, type DemoLine, type PaymentMethod } from "@/content/jerrys";
import {
  agoLabel,
  itemById,
  lineName,
  linesTotal,
  linesUsage,
  orderNumber,
  qtyLabel,
  rs,
  stockLevel,
  useStore,
  type ChargeResult,
} from "./store";
import type { ScreenId } from "./app-frame";
import {
  Avatar,
  BADGE,
  BTN_DARK,
  BTN_GO,
  BTN_SOFT,
  FOCUS,
  ICON_BTN,
  ItemIcon,
  LEVEL_BADGE,
  Modal,
  NumberPad,
  WalkInMark,
  pill,
} from "./ui";

/**
 * The counter screen, copied from src/app/(pos)/pos/checkout/page.tsx:
 * catalogue pills over a tile grid, the cart panel on the right, the deal
 * choice picker, saved tickets, and the full screen charge sheet that ends on
 * the live decrement checklist.
 */

/* ------------------------------------------------------------ availability */

/** Portions of one item the given stock can still make. Infinity for availability-tracked items. */
function portions(item: DemoItem, stock: Record<string, number>): number {
  if (item.deal) {
    const fixed = item.deal.fixed.map((f) => Math.floor(portions(itemById(f.itemId), stock) / f.qty));
    const slots = item.deal.slots.map((s) => Math.floor(Math.max(...s.options.map((o) => portions(itemById(o), stock))) / s.quantity));
    return Math.min(...fixed, ...slots);
  }
  if (!item.recipe.length) return Infinity;
  return Math.min(...item.recipe.map((r) => Math.floor((stock[r.ingredientId] ?? 0) / r.qty)));
}

/** Stock left after what's already in the cart, like the real "Left" tile does with reservations. */
function useAvailableStock() {
  const { ingredients, cart } = useStore();
  return React.useMemo(() => {
    const stock = Object.fromEntries(ingredients.map((i) => [i.id, i.stock]));
    linesUsage(cart).forEach((u) => (stock[u.ingredientId] = (stock[u.ingredientId] ?? 0) - u.qty));
    return stock;
  }, [ingredients, cart]);
}

/* ------------------------------------------------------------------ screen */

export function CheckoutScreen({ onNavigate }: { onNavigate: (s: ScreenId) => void }) {
  const store = useStore();
  const { catalogues, items, cart, tickets, drawer, askWalkthrough, addToCart } = store;
  const [catalogue, setCatalogue] = React.useState(catalogues[0]!.id);
  const [dealFor, setDealFor] = React.useState<DemoItem | null>(null);
  const [ticketsOpen, setTicketsOpen] = React.useState(false);
  const [customersOpen, setCustomersOpen] = React.useState(false);
  const [chargeOpen, setChargeOpen] = React.useState(false);
  const [cartOpen, setCartOpen] = React.useState(false);
  const stock = useAvailableStock();

  if (!drawer.open) return <DrawerGate onNavigate={onNavigate} />;

  const visible = items.filter((i) => i.catalogueId === catalogue);
  const count = cart.reduce((n, l) => n + l.qty, 0);
  const total = linesTotal(cart);
  const whatsappWaiting = tickets.filter((t) => t.source === "whatsapp").length;

  const tap = (item: DemoItem) => (item.deal ? setDealFor(item) : addToCart(item.id));

  return (
    <div className="absolute inset-0 flex overflow-hidden">
      {/* LEFT: catalogue browser and item grid. */}
      <div className="flex min-w-0 flex-1 flex-col overflow-hidden px-3 pt-3">
        <div className="flex shrink-0 items-center gap-2 px-1 pb-2 sm:px-3">
          <div className="min-w-0 flex-1 overflow-x-auto [scrollbar-width:none]">
            <div className="flex min-w-max gap-1.5">
              {catalogues.map((c) => (
                <button key={c.id} type="button" onClick={() => setCatalogue(c.id)} aria-pressed={c.id === catalogue} className={pill(c.id === catalogue)}>
                  {c.name}
                </button>
              ))}
            </div>
          </div>
          <div className="flex shrink-0 items-center gap-1.5">
            <button type="button" aria-label="Compact grid" onClick={() => askWalkthrough("The compact grid and tile reordering")} className={cn(ICON_BTN, "hidden sm:inline-flex")}>
              <Grid2x2 aria-hidden size={16} />
            </button>
            <button type="button" aria-label="Discounts" onClick={() => askWalkthrough("Discounts and promo codes")} className={cn(ICON_BTN, "hidden sm:inline-flex")}>
              <Tag aria-hidden size={16} />
            </button>
            <button
              type="button"
              onClick={() => setTicketsOpen(true)}
              aria-label={`Saved tickets, ${tickets.length}`}
              className={cn("relative inline-flex h-10 cursor-pointer items-center gap-1.5 rounded-full px-3.5 text-xs font-bold transition-colors", FOCUS, tickets.length ? "bg-zinc-900 text-white hover:bg-black" : "bg-zinc-100 text-zinc-600 hover:bg-zinc-200")}
            >
              <Layers aria-hidden size={15} />
              <span className="tabular-nums">{tickets.length}</span>
              {whatsappWaiting > 0 && <span aria-hidden className="absolute -top-0.5 -right-0.5 size-3 rounded-full border-2 border-white bg-[#25d366]" />}
            </button>
          </div>
        </div>

        <div className="min-h-0 flex-1 overflow-y-auto px-1 pb-40 sm:px-3 md:pb-24">
          <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-3 xl:grid-cols-4">
            {visible.map((item) => {
              const inCart = cart.filter((l) => l.itemId === item.id).reduce((n, l) => n + l.qty, 0);
              return <ItemTile key={item.id} item={item} qty={inCart} available={portions(item, stock)} onTap={() => tap(item)} />;
            })}
          </div>
        </div>
      </div>

      {/* RIGHT: cart panel on tablets and up. */}
      <div className="hidden w-80 shrink-0 flex-col overflow-hidden border-l border-zinc-100 bg-white md:flex lg:w-96">
        <CartPanel onCharge={() => setChargeOpen(true)} onCustomer={() => setCustomersOpen(true)} onTickets={() => setTicketsOpen(true)} onEditDeal={(item) => setDealFor(item)} />
      </div>

      {/* Phones: a sticky bar that opens the cart. Sits above the deck's own controls. */}
      <div className="absolute inset-x-3 bottom-20 z-20 md:hidden">
        <button
          type="button"
          onClick={() => setCartOpen(true)}
          className={cn("flex h-14 w-full cursor-pointer items-center gap-3 rounded-2xl px-4 text-white shadow-[0_12px_30px_rgba(0,0,0,.25)] transition-colors", FOCUS, count ? "bg-emerald-600 hover:bg-emerald-700" : "bg-zinc-900")}
        >
          <ShoppingCart aria-hidden size={18} />
          <span className="text-sm font-bold">{count ? `${count} items` : "Tap an item to add"}</span>
          {count > 0 && <span className="ml-auto text-lg font-black tabular-nums">{rs(total)}</span>}
        </button>
      </div>
      <Modal open={cartOpen} onClose={() => setCartOpen(false)} title="Order" size="md">
        <div className="-mx-5 -mb-5 flex h-[60vh] flex-col">
          <CartPanel
            onCharge={() => {
              setCartOpen(false);
              setChargeOpen(true);
            }}
            onCustomer={() => setCustomersOpen(true)}
            onTickets={() => setTicketsOpen(true)}
            onEditDeal={(item) => setDealFor(item)}
          />
        </div>
      </Modal>

      <DealPicker item={dealFor} onClose={() => setDealFor(null)} />
      <TicketsModal open={ticketsOpen} onClose={() => setTicketsOpen(false)} />
      <CustomerPicker open={customersOpen} onClose={() => setCustomersOpen(false)} />
      <ChargeSheet open={chargeOpen} onClose={() => setChargeOpen(false)} onNavigate={onNavigate} />
    </div>
  );
}

/* --------------------------------------------------------------- item tile */

function ItemTile({ item, qty, available, onTap }: { item: DemoItem; qty: number; available: number; onTap: () => void }) {
  const tracked = Number.isFinite(available);
  const out = tracked && available <= 0;
  const low = tracked && !out && available <= 5;
  return (
    <button
      type="button"
      onClick={onTap}
      disabled={out}
      aria-label={`${item.name}, Rs ${item.price}${out ? ", out of stock" : ""}`}
      className={cn(
        "relative flex cursor-pointer flex-col overflow-hidden rounded-2xl border text-left transition-all select-none hover:shadow-md active:scale-95",
        FOCUS,
        qty > 0 ? "border-zinc-900/25 shadow-md shadow-zinc-900/5" : "border-zinc-100",
        out && "cursor-not-allowed opacity-50 hover:shadow-none active:scale-100",
      )}
    >
      <div className="relative w-full overflow-hidden" style={{ background: item.tileBg ?? "#ffffff", paddingBottom: "86%" }}>
        {item.image ? (
          // eslint-disable-next-line @next/next/no-img-element -- menu tiles, kept out of next/image's per-page budget
          <img src={item.image} alt="" loading="lazy" decoding="async" draggable={false} className="absolute inset-0 size-full object-cover" />
        ) : (
          <span className="absolute inset-0 flex items-center justify-center text-3xl leading-none font-black tracking-tight xl:text-4xl" style={{ color: item.labelColor ?? "#27272a" }}>
            {item.label}
          </span>
        )}
        {qty > 0 && (
          <span className="absolute top-1.5 left-1.5 flex h-6 min-w-6 items-center justify-center rounded-full bg-zinc-900 px-1.5 text-[11px] font-black text-white">{qty}</span>
        )}
        {item.deal && <span className="absolute top-1.5 right-1.5 rounded-full bg-amber-400 px-2 py-0.5 text-[10px] font-black text-zinc-900">Deal</span>}
      </div>
      <div className="flex flex-1 flex-col gap-0.5 bg-white px-3 pt-2 pb-2.5">
        <p className="line-clamp-1 text-sm leading-snug font-bold text-zinc-800">{item.name}</p>
        <span className="text-base font-black text-zinc-900 tabular-nums">{rs(item.price)}</span>
        <span className={cn("text-[11px] font-semibold", out ? "text-red-600" : low ? "text-amber-700" : tracked ? "text-zinc-500" : "text-emerald-700")}>
          {out ? "Out of stock" : tracked ? `${available} left` : "Available"}
        </span>
      </div>
    </button>
  );
}

/* --------------------------------------------------------------- cart panel */

function CartPanel({ onCharge, onCustomer, onTickets, onEditDeal }: { onCharge: () => void; onCustomer: () => void; onTickets: () => void; onEditDeal: (item: DemoItem) => void }) {
  const { cart, cartCustomerId, customer, changeQty, setCartCustomer, saveTicket, clearCart, activeTicketId, tickets } = useStore();
  const who = customer(cartCustomerId);
  const count = cart.reduce((n, l) => n + l.qty, 0);
  const total = linesTotal(cart);
  const ticket = tickets.find((t) => t.id === activeTicketId);

  return (
    <>
      <div className={cn("flex shrink-0 items-center border-b border-zinc-100", who ? "bg-zinc-900" : "")}>
        {who && (
          <button type="button" aria-label="Remove customer" onClick={() => setCartCustomer(null)} className={cn("flex h-12 w-12 shrink-0 cursor-pointer items-center justify-center text-white hover:bg-white/10", FOCUS)}>
            <Trash2 aria-hidden size={15} strokeWidth={2.5} />
          </button>
        )}
        <button type="button" onClick={onCustomer} className={cn("flex h-12 flex-1 cursor-pointer items-center gap-3 px-4 transition-colors", FOCUS, who ? "text-white" : "text-zinc-700 hover:bg-zinc-50")}>
          {who ? <Avatar name={who.name} size="xs" /> : <WalkInMark className="size-7" />}
          <span className="flex-1 truncate text-left text-sm font-semibold">{who ? who.name : jerrysDeck.copy.walkIn}</span>
          {who && <span className="text-[11px] font-semibold text-white/70 tabular-nums">{who.points} pts</span>}
          <ChevronRight aria-hidden size={14} className="opacity-50" />
        </button>
      </div>

      <div className="flex shrink-0 items-center justify-between border-b border-zinc-100 px-4 py-2.5">
        <span className="flex items-center gap-2 text-sm font-bold text-zinc-700">
          <ShoppingCart aria-hidden size={15} className="text-zinc-400" />
          {count === 0 ? "Order" : `${count} items`}
          {ticket && <span className={cn(BADGE, "bg-amber-50 text-amber-700")}>{ticket.name}</span>}
        </span>
        <button type="button" onClick={onTickets} className={cn("flex h-9 cursor-pointer items-center gap-1.5 rounded-full px-3.5 text-xs font-bold transition-colors", FOCUS, tickets.length ? "bg-zinc-900 text-white hover:bg-black" : "bg-zinc-100 text-zinc-500 hover:bg-zinc-200")}>
          <Layers aria-hidden size={14} />
          {tickets.length ? `${tickets.length} saved` : "Tickets"}
        </button>
      </div>

      <div className="flex min-h-0 flex-1 flex-col divide-y divide-zinc-100 overflow-y-auto">
        {cart.length === 0 ? (
          <div className="flex h-full flex-col items-center justify-center gap-2 p-6 text-center">
            <span className="flex size-12 items-center justify-center rounded-2xl bg-zinc-100">
              <ShoppingCart aria-hidden size={20} className="text-zinc-400" />
            </span>
            <p className="text-xs font-medium text-zinc-500">Tap an item to add</p>
          </div>
        ) : (
          cart.map((line) => {
            const item = itemById(line.itemId);
            return (
              <div key={line.key} className="flex items-center gap-2.5 px-3 py-2">
                {item.deal ? (
                  <button type="button" aria-label={`Change picks for ${item.name}`} onClick={() => onEditDeal(item)} className={cn("flex min-w-0 flex-1 cursor-pointer items-center gap-2.5 rounded-lg text-left hover:opacity-80", FOCUS)}>
                    <ItemIcon item={item} className="size-9 rounded-xl" />
                    <span className="min-w-0 flex-1">
                      <span className="block truncate text-xs font-semibold text-zinc-800">{item.name}</span>
                      {line.picks?.length ? (
                        <span className="block truncate text-[11px] font-semibold text-amber-700">{line.picks.map((p) => itemById(p).name).join(", ")}</span>
                      ) : (
                        <span className="block text-[11px] font-medium text-zinc-500">{rs(item.price)}</span>
                      )}
                    </span>
  </button>
                ) : (
                  <div className="flex min-w-0 flex-1 items-center gap-2.5">
                    <ItemIcon item={item} className="size-9 rounded-xl" />
                    <span className="min-w-0 flex-1">
                      <span className="block truncate text-xs font-semibold text-zinc-800">{item.name}</span>
                      {line.picks?.length ? (
                        <span className="block truncate text-[11px] font-semibold text-amber-700">{line.picks.map((p) => itemById(p).name).join(", ")}</span>
                      ) : (
                        <span className="block text-[11px] font-medium text-zinc-500">{rs(item.price)}</span>
                      )}
                    </span>
  </div>
                )}
                <div className="flex shrink-0 items-center gap-1.5">
                  <button type="button" aria-label={line.qty === 1 ? `Remove ${item.name}` : `One less ${item.name}`} onClick={() => changeQty(line.key, -1)} className={cn(ICON_BTN, "size-9")}>
                    {line.qty === 1 ? <Trash2 aria-hidden size={15} /> : <Minus aria-hidden size={15} />}
                  </button>
                  <span className="min-w-6 text-center text-lg font-black text-zinc-900 tabular-nums">{line.qty}</span>
                  <button type="button" aria-label={`One more ${item.name}`} onClick={() => changeQty(line.key, 1)} className={cn("flex size-9 cursor-pointer items-center justify-center rounded-full bg-zinc-900 text-white transition-colors hover:bg-black active:scale-90", FOCUS)}>
                    <Plus aria-hidden size={15} />
                  </button>
                </div>
                <span className="min-w-14 shrink-0 pl-1 text-right text-base font-black text-zinc-900 tabular-nums">{(item.price * line.qty).toLocaleString()}</span>
              </div>
            );
          })
        )}
      </div>

      <div className="flex shrink-0 flex-col gap-2 border-t border-zinc-100 px-3 pt-2 pb-3">
        {cart.length > 0 && (
          <div className="flex items-center justify-between px-1">
            <span className="text-xs font-semibold text-zinc-500">Total</span>
            <span className="text-2xl font-black text-zinc-900 tabular-nums">{rs(total)}</span>
          </div>
        )}
        <button type="button" disabled={!cart.length} onClick={onCharge} className={cn(cart.length ? BTN_GO : BTN_DARK, "h-14 w-full text-base font-black")}>
          <Receipt aria-hidden size={19} />
          {cart.length ? `Charge · ${rs(total)}` : "Add items to charge"}
        </button>
        <div className="flex gap-2">
          {activeTicketId && (
            <button type="button" onClick={clearCart} className={cn(BTN_SOFT, "h-12 flex-1")}>
              <X aria-hidden size={16} />
              Close
            </button>
          )}
          <button type="button" disabled={!cart.length} onClick={saveTicket} className={cn(BTN_DARK, "h-12 flex-1 font-semibold")}>
            <Bookmark aria-hidden size={17} />
            {activeTicketId ? "Save" : "Save & New Order"}
          </button>
        </div>
      </div>
    </>
  );
}

/* -------------------------------------------------------------- deal picker */

function DealPicker({ item, onClose }: { item: DemoItem | null; onClose: () => void }) {
  const { addToCart } = useStore();
  const [picked, setPicked] = React.useState<Record<string, Record<string, number>>>({});
  React.useEffect(() => setPicked({}), [item]);
  const slots = item?.deal?.slots ?? [];
  const totalIn = (slotId: string) => Object.values(picked[slotId] ?? {}).reduce((a, b) => a + b, 0);
  const ready = slots.every((s) => totalIn(s.id) === s.quantity);
  const set = (slotId: string, optionId: string, v: number) => setPicked((p) => ({ ...p, [slotId]: { ...p[slotId], [optionId]: Math.max(0, v) } }));

  const confirm = () => {
    if (!item) return;
    const picks = slots.flatMap((s) => Object.entries(picked[s.id] ?? {}).flatMap(([id, n]) => Array.from({ length: n }, () => id)));
    addToCart(item.id, picks);
    onClose();
  };

  return (
    <Modal open={!!item} onClose={onClose} title={item?.name} description={item?.deal ? `Comes with ${item.deal.fixed.map((f) => `${f.qty > 1 ? `${f.qty} ` : ""}${itemById(f.itemId).name}`).join(", ")}` : undefined} size="lg">
      <div className="flex flex-col gap-6">
        {slots.map((slot) => {
          const n = totalIn(slot.id);
          const done = n === slot.quantity;
          return (
            <div key={slot.id}>
              <div className="mb-3 flex items-center justify-between">
                <p className="text-sm font-black text-zinc-800">{slot.name}</p>
                <span className={cn(BADGE, "px-2.5 py-1 text-xs", done ? "bg-emerald-50 text-emerald-700" : "bg-amber-50 text-amber-700")}>
                  {n}/{slot.quantity} picked
                </span>
              </div>
              <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2">
                {slot.options.map((id) => {
                  const opt = itemById(id);
                  const qty = picked[slot.id]?.[id] ?? 0;
                  return (
                    <div key={id} className={cn("flex items-center gap-3 rounded-2xl border-2 p-2.5 transition-colors", qty > 0 ? "border-zinc-900 bg-zinc-50" : "border-zinc-200 bg-white")}>
                      <ItemIcon item={opt} className="size-11 rounded-xl" />
                      <p className="min-w-0 flex-1 truncate text-sm font-bold text-zinc-800">{opt.name}</p>
                      <div className="flex items-center gap-1">
                        <button type="button" aria-label={`One less ${opt.name}`} disabled={qty === 0} onClick={() => set(slot.id, id, qty - 1)} className={cn(ICON_BTN, "size-8")}>
                          <Minus aria-hidden size={14} />
                        </button>
                        <span className="w-5 text-center text-sm font-black tabular-nums">{qty}</span>
                        <button
                          type="button"
                          aria-label={`One more ${opt.name}`}
                          disabled={done}
                          onClick={() => set(slot.id, id, qty + 1)}
                          className={cn("flex size-8 cursor-pointer items-center justify-center rounded-full bg-zinc-900 text-white transition-colors hover:bg-black disabled:cursor-not-allowed disabled:opacity-30", FOCUS)}
                        >
                          <Plus aria-hidden size={14} />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
        <div className="flex gap-3">
          <button type="button" onClick={onClose} className={cn(BTN_SOFT, "flex-1")}>
            Cancel
          </button>
          <button type="button" disabled={!ready} onClick={confirm} className={cn(BTN_DARK, "flex-1")}>
            Add to cart
          </button>
        </div>
      </div>
    </Modal>
  );
}

/* ------------------------------------------------------------ saved tickets */

function TicketsModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { tickets, customer, loadTicket, deleteTicket, askWalkthrough } = useStore();
  const [confirmId, setConfirmId] = React.useState<string | null>(null);
  return (
    <Modal open={open} onClose={onClose} title="Saved tickets" description={tickets.length ? `${tickets.length} open · tap one to load it into the cart` : "No parked orders"} size="lg">
      {tickets.length === 0 ? (
        <div className="flex flex-col items-center gap-2 py-10 text-center">
          <Layers aria-hidden size={24} className="text-zinc-300" />
          <p className="text-sm font-semibold text-zinc-500">No saved tickets yet</p>
          <p className="max-w-xs text-xs leading-relaxed text-zinc-500">Tap Save &amp; New Order to park the current order and start a fresh one.</p>
        </div>
      ) : (
        <ul className="-mx-5 divide-y divide-zinc-100">
          {tickets.map((t) => {
            const who = customer(t.customerId);
            return (
              <li key={t.id} className="flex items-center gap-3 px-5 py-3">
                <div className="flex w-14 shrink-0 flex-col items-center gap-1">
                  {who ? <Avatar name={who.name} size="md" /> : <WalkInMark className="size-10" />}
                  <span className="w-full truncate text-center text-[10px] font-semibold text-zinc-600">{(who?.name ?? t.name).split(" ")[0]}</span>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    loadTicket(t.id);
                    onClose();
                  }}
                  className={cn("flex min-w-0 flex-1 cursor-pointer flex-col gap-1.5 rounded-xl p-1 text-left hover:bg-zinc-50", FOCUS)}
                >
                  <span className="flex items-center gap-2">
                    <span className="truncate text-sm font-bold text-zinc-900">{t.name}</span>
                    {t.source === "whatsapp" && (
                      <span className={cn(BADGE, "bg-[#dcf8c6] text-emerald-800")}>
                        <MessageCircle aria-hidden size={11} />
                        WhatsApp
                      </span>
                    )}
                  </span>
                  <span className="flex gap-1.5 overflow-hidden">
                    {t.lines.map((l, i) => (
                      <span key={i} className="relative shrink-0">
                        <ItemIcon item={itemById(l.itemId)} className="size-9 rounded-full" text="text-[9px]" />
                        <span className="absolute -top-1 -right-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-zinc-900 px-1 text-[9px] font-black text-white">{l.qty}</span>
                      </span>
                    ))}
                  </span>
                </button>
                <div className="flex shrink-0 flex-col items-end gap-0.5">
                  <span className="text-base font-black text-zinc-900 tabular-nums">{rs(linesTotal(t.lines))}</span>
                  <span className="text-[11px] font-medium text-zinc-500">{agoLabel(t.minutesAgo)}</span>
                </div>
                <button type="button" aria-label="Print kitchen token" onClick={() => askWalkthrough("Printing kitchen tokens")} className={cn(ICON_BTN, "size-9")}>
                  <Printer aria-hidden size={15} />
                </button>
                {confirmId === t.id ? (
                  <button
                    type="button"
                    onClick={() => {
                      deleteTicket(t.id);
                      setConfirmId(null);
                    }}
                    className="h-9 cursor-pointer rounded-full bg-red-600 px-3 text-xs font-bold text-white hover:bg-red-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-600/40"
                  >
                    Delete
                  </button>
                ) : (
                  <button type="button" aria-label={`Delete ticket ${t.name}`} onClick={() => setConfirmId(t.id)} className={cn("flex size-9 cursor-pointer items-center justify-center rounded-full bg-red-50 text-red-600 hover:bg-red-100", FOCUS)}>
                    <Trash2 aria-hidden size={15} />
                  </button>
                )}
              </li>
            );
          })}
        </ul>
      )}
    </Modal>
  );
}

/* -------------------------------------------------------------- customers */

function CustomerPicker({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { customers, setCartCustomer, cartCustomerId, askWalkthrough } = useStore();
  const [q, setQ] = React.useState("");
  const list = customers.filter((c) => (c.name + c.phone).toLowerCase().includes(q.toLowerCase()));
  return (
    <Modal open={open} onClose={onClose} title="Customer" description="Points are earned on every order" size="md">
      <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search name or phone" aria-label="Search customers" className="mb-3 h-11 w-full rounded-xl border border-zinc-200 bg-zinc-50 px-3 text-sm font-medium focus:border-zinc-400 focus:bg-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-900/10" />
      <ul className="flex flex-col gap-1">
        {list.map((c) => (
          <li key={c.id}>
            <button
              type="button"
              onClick={() => {
                setCartCustomer(c.id);
                onClose();
              }}
              className={cn("flex w-full cursor-pointer items-center gap-3 rounded-xl px-2 py-2 text-left hover:bg-zinc-50", FOCUS, c.id === cartCustomerId && "bg-zinc-100")}
            >
              <Avatar name={c.name} />
              <span className="min-w-0 flex-1">
                <span className="flex items-center gap-1.5 text-sm font-bold text-zinc-900">
                  <span className="truncate">{c.name}</span>
                  {c.business && <span className={cn(BADGE, "bg-violet-50 text-violet-700")}>Business</span>}
                </span>
                <span className="block text-xs text-zinc-500">{c.phone}</span>
              </span>
              <span className="text-xs font-bold text-violet-700 tabular-nums">{c.points} pts</span>
            </button>
          </li>
        ))}
      </ul>
      <button type="button" onClick={() => askWalkthrough("Adding customers")} className={cn(BTN_SOFT, "mt-3 w-full")}>
        <Plus aria-hidden size={16} />
        New customer
      </button>
    </Modal>
  );
}

/* ------------------------------------------------------------- charge sheet */

const METHODS: { id: PaymentMethod; label: string; icon: typeof Banknote }[] = [
  { id: "cash", label: "Cash", icon: Banknote },
  { id: "qr", label: "QR Transfer", icon: QrCode },
];

function ChargeSheet({ open, onClose, onNavigate }: { open: boolean; onClose: () => void; onNavigate: (s: ScreenId) => void }) {
  const { cart, cartCustomerId, customer, charge } = useStore();
  const [method, setMethod] = React.useState<PaymentMethod>("cash");
  const [cash, setCash] = React.useState("");
  const [result, setResult] = React.useState<ChargeResult | null>(null);
  // Keep the success view's lines after the store clears the cart.
  const [snapshot, setSnapshot] = React.useState<DemoLine[]>([]);

  React.useEffect(() => {
    if (open) {
      setResult(null);
      setCash("");
      setMethod("cash");
    }
  }, [open]);

  const lines = result ? snapshot : cart;
  const total = linesTotal(lines);
  const received = Number(cash || 0);
  const change = Math.max(0, received - total);
  const who = customer(result ? result.order.customerId : cartCustomerId);
  const canCharge = cart.length > 0 && (method === "qr" || received >= total);
  const quick = [total, Math.ceil(total / 500) * 500, Math.ceil(total / 1000) * 1000, 5000].filter((v, i, a) => v >= total && a.indexOf(v) === i);

  const complete = () => {
    setSnapshot(cart);
    const r = charge(method, method === "cash" ? received : total);
    if (r) setResult(r);
  };

  return (
    <Modal open={open} onClose={onClose} size="full" title={undefined} labelledBy="jerrys-charge-title">
      {result ? (
        <ChargeSuccess result={result} lines={snapshot} onDone={onClose} onNavigate={onNavigate} />
      ) : (
        <div className="flex h-full flex-col lg:flex-row">
          {/* LEFT: order summary. */}
          <div className="flex shrink-0 flex-col border-zinc-100 lg:w-96 lg:border-r">
            <div className="px-4 pt-4">
              <h2 id="jerrys-charge-title" className="sr-only">
                Charge order
              </h2>
              <div className="flex items-center gap-3 rounded-xl bg-zinc-50 px-3 py-2.5">
                {who ? <Avatar name={who.name} /> : <WalkInMark className="size-8" />}
                <span className="min-w-0 flex-1">
                  <span className="block truncate text-sm font-bold text-zinc-900">{who?.name ?? jerrysDeck.copy.walkIn}</span>
                  {who && <span className="block truncate text-xs text-zinc-500">{who.phone}</span>}
                </span>
              </div>
            </div>
            <div className="hidden max-h-full min-h-0 flex-1 overflow-y-auto px-4 py-3 lg:block">
              <ul className="flex flex-col gap-1 rounded-2xl bg-zinc-50 px-3 py-2">
                {lines.map((l) => {
                  const item = itemById(l.itemId);
                  return (
                    <li key={`${l.itemId}-${(l.picks ?? []).join()}`} className="flex items-center gap-3 py-2">
                      <span className="relative">
                        <ItemIcon item={item} className="size-11 rounded-full" />
                        <span className="absolute -top-1 -right-1 flex size-5 items-center justify-center rounded-full bg-zinc-900 text-[10px] font-black text-white">{l.qty}</span>
                      </span>
                      <span className="min-w-0 flex-1">
                        <span className="block truncate text-sm font-semibold text-zinc-900">{item.name}</span>
                        <span className="block truncate text-xs text-zinc-500">{l.picks?.length ? l.picks.map((p) => itemById(p).name).join(", ") : `${rs(item.price)} each`}</span>
                      </span>
                      <span className="text-sm font-bold text-zinc-900 tabular-nums">{rs(item.price * l.qty)}</span>
                    </li>
                  );
                })}
              </ul>
            </div>
            {who && (
              <p className="hidden px-4 pb-3 text-xs font-bold text-violet-700 lg:block">
                Loyalty: +{Math.floor(total / 100)} points for {who.name.split(" ")[0]}
              </p>
            )}
          </div>

          {/* RIGHT: payment. */}
          <div className="flex min-h-0 min-w-0 flex-1 flex-col gap-3 px-4 py-4 sm:px-5">
            <div className="flex shrink-0 items-center gap-2">
              {METHODS.map((m) => (
                <button
                  key={m.id}
                  type="button"
                  onClick={() => setMethod(m.id)}
                  aria-pressed={method === m.id}
                  className={cn("flex h-12 flex-1 cursor-pointer items-center justify-center gap-2 rounded-full transition-colors xl:rounded-2xl", FOCUS, method === m.id ? "bg-zinc-900 text-white" : "bg-zinc-100 text-zinc-700 hover:bg-zinc-200")}
                >
                  <m.icon aria-hidden size={18} />
                  <span className="text-sm font-bold whitespace-nowrap">{m.label}</span>
                </button>
              ))}
              <button type="button" aria-label="Close" onClick={onClose} className={cn(ICON_BTN, "size-12")}>
                <X aria-hidden size={20} />
              </button>
            </div>

            {method === "cash" ? (
              <>
                <div className="grid shrink-0 grid-cols-2 gap-2">
                  <div className="row-span-2 flex flex-col items-center justify-center gap-1 rounded-xl bg-zinc-50 p-4">
                    <ShoppingCart aria-hidden size={22} className="text-zinc-300" />
                    <p className="text-[11px] font-semibold text-zinc-500">Order total</p>
                    <p className="text-3xl leading-none font-black text-zinc-900 tabular-nums xl:text-5xl">{rs(total)}</p>
                  </div>
                  <div className="rounded-xl bg-zinc-50 p-3">
                    <p className="flex items-center gap-1.5 text-[11px] font-semibold text-zinc-500">
                      <Banknote aria-hidden size={13} />
                      Cash received
                    </p>
                    <p className="mt-1 text-xl font-black text-zinc-900 tabular-nums xl:text-3xl">{cash ? rs(received) : "Rs 0"}</p>
                  </div>
                  <div className={cn("rounded-xl p-3 transition-colors", change > 0 ? "bg-emerald-600" : "bg-zinc-50")}>
                    <p className={cn("flex items-center gap-1.5 text-[11px] font-semibold", change > 0 ? "text-white" : "text-zinc-500")}>
                      <RotateCcw aria-hidden size={13} />
                      Change to give
                    </p>
                    <p className={cn("mt-1 text-xl font-black tabular-nums xl:text-3xl", change > 0 ? "text-white" : "text-zinc-400")}>{rs(change)}</p>
                  </div>
                </div>
                <div className="flex shrink-0 flex-wrap gap-1.5">
                  {quick.map((v, i) => (
                    <button key={v} type="button" onClick={() => setCash(String(v))} className={pill(received === v)}>
                      {i === 0 ? "Exact" : rs(v)}
                    </button>
                  ))}
                </div>
                <NumberPad value={cash} onChange={setCash} className="min-h-0 flex-1" />
              </>
            ) : (
              <div className="flex min-h-0 flex-1 flex-col items-center justify-center gap-3 py-2">
                <p className="text-sm font-semibold text-zinc-500">Scan to pay</p>
                <MockQr seed={total} />
                <p className="text-3xl font-black text-zinc-900 tabular-nums">{rs(total)}</p>
                <p className="text-xs text-zinc-500">Bank transfer to Jerry&apos;s account, confirmed by the cashier</p>
              </div>
            )}

            <button type="button" disabled={!canCharge} onClick={complete} className={cn(BTN_GO, "h-14 w-full shrink-0 text-base font-black")}>
              <Check aria-hidden size={19} strokeWidth={3} />
              {method === "cash" && received < total ? `Enter at least ${rs(total)}` : `Complete sale · ${rs(total)}`}
            </button>
          </div>
        </div>
      )}
    </Modal>
  );
}

/** The success screen with the live decrement checklist, one ingredient at a time. */
function ChargeSuccess({ result, lines, onDone, onNavigate }: { result: ChargeResult; lines: DemoLine[]; onDone: () => void; onNavigate: (s: ScreenId) => void }) {
  const { ingredient, isOn, askWalkthrough, customer } = useStore();
  const reduce = useReducedMotion();
  const lowOn = isOn("low-stock");
  const who = customer(result.order.customerId);

  const go = (s: ScreenId) => {
    onDone();
    onNavigate(s);
  };

  return (
    <div className="flex h-full flex-col overflow-y-auto lg:flex-row">
      <div className="flex shrink-0 flex-col items-center justify-center gap-2 px-6 py-8 text-center lg:w-96 lg:border-r lg:border-zinc-100">
        <motion.span
          initial={{ scale: reduce ? 1 : 0.6, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
          className="flex size-16 items-center justify-center rounded-full bg-emerald-600 text-white"
        >
          <Check aria-hidden size={30} strokeWidth={3} />
        </motion.span>
        <h2 id="jerrys-charge-title" className="jerrys-display mt-2 text-3xl font-black text-zinc-900 tabular-nums">
          {rs(result.total)} charged
        </h2>
        <p className="text-sm font-medium text-zinc-500">
          {orderNumber(result.order.seq)} · {result.order.method === "cash" ? "Cash" : "QR transfer"}
          {who ? ` · ${who.name}` : ""}
        </p>
        {result.order.method === "cash" && (
          <div className={cn("mt-3 w-full rounded-2xl px-5 py-4", result.change > 0 ? "bg-emerald-600 text-white" : "bg-zinc-50 text-zinc-900")}>
            <p className="text-xs font-semibold">Change to give</p>
            <p className="text-3xl font-black tabular-nums">{rs(result.change)}</p>
          </div>
        )}
        <ul className="mt-3 flex w-full flex-col gap-1 text-left">
          {lines.map((l) => (
            <li key={`${l.itemId}-${(l.picks ?? []).join()}`} className="flex items-center gap-2 text-xs font-semibold text-zinc-700">
              <ItemIcon item={itemById(l.itemId)} className="size-6 rounded-full" text="text-[8px]" />
              <span className="min-w-0 flex-1 truncate">
                {l.qty} × {lineName(l)}
              </span>
            </li>
          ))}
        </ul>
        <div className="mt-4 grid w-full grid-cols-2 gap-2">
          <button type="button" onClick={() => askWalkthrough("Receipt printing")} className={BTN_SOFT}>
            <Printer aria-hidden size={16} />
            Print
          </button>
          <button type="button" onClick={onDone} className={BTN_DARK}>
            New order
          </button>
        </div>
      </div>

      <div className="min-w-0 flex-1 px-4 py-6 sm:px-6">
        <p className="text-sm font-black text-zinc-900">Taken out of stock</p>
        <p className="mt-0.5 text-xs text-zinc-500">The recipe trigger ran on every line, meal deal components included.</p>
        <ul className="mt-4 flex flex-col gap-1.5">
          {result.moves.map((m, i) => {
            const ing = ingredient(m.ingredientId);
            const level = stockLevel({ stock: m.after, threshold: ing.threshold });
            return (
              <motion.li
                key={m.ingredientId}
                initial={{ opacity: 0, x: reduce ? 0 : 12 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: reduce ? 0 : 0.15 + i * 0.12, duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                className={cn("rounded-2xl border px-3 py-2.5", m.crossed ? "border-amber-200 bg-amber-50" : "border-zinc-100 bg-white")}
              >
                <div className="flex items-center gap-3">
                  <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-emerald-600 text-white">
                    <Check aria-hidden size={13} strokeWidth={3} />
                  </span>
                  <span className="min-w-0 flex-1 truncate text-sm font-bold text-zinc-900">{ing.name}</span>
                  <span className="text-sm font-black text-red-600 tabular-nums">-{qtyLabel(m.used, ing.unit)}</span>
                  <span className="hidden text-xs font-semibold text-zinc-500 tabular-nums sm:inline">
                    {m.before.toLocaleString()} <ArrowRight aria-hidden className="inline size-3" /> {m.after.toLocaleString()}
                  </span>
                  <span className={cn(BADGE, LEVEL_BADGE[level].className)}>{LEVEL_BADGE[level].label}</span>
                </div>
                {m.crossed && (
                  <p className="mt-1.5 flex items-center gap-1.5 pl-9 text-xs font-bold text-amber-800">
                    <MessageCircle aria-hidden size={13} />
                    {lowOn ? "Low stock alert sent to the owner on WhatsApp" : "Crossed its alert level (alerts are switched off)"}
                  </p>
                )}
              </motion.li>
            );
          })}
          {result.moves.length === 0 && <li className="rounded-2xl bg-zinc-50 px-3 py-3 text-sm text-zinc-500">These items are tracked by availability, so no stock moved.</li>}
        </ul>
        <div className="mt-5 flex flex-wrap gap-2">
          <button type="button" onClick={() => go("sales")} className={cn(BTN_SOFT, "h-10 rounded-full")}>
            See it in Sales
            <ArrowRight aria-hidden size={15} />
          </button>
          <button type="button" onClick={() => go("stock")} className={cn(BTN_SOFT, "h-10 rounded-full")}>
            See ingredients
            <ArrowRight aria-hidden size={15} />
          </button>
          <button type="button" onClick={() => go("automations")} className={cn(BTN_SOFT, "h-10 rounded-full")}>
            The owner&apos;s phone
            <ArrowRight aria-hidden size={15} />
          </button>
        </div>
      </div>
    </div>
  );
}

/** A deterministic QR-looking grid. Decorative: the real app renders the shop's payment QR image. */
function MockQr({ seed }: { seed: number }) {
  const n = 21;
  const cells: React.ReactNode[] = [];
  let x = seed * 9301 + 49297;
  const finder = (r: number, c: number) => (r < 7 && c < 7) || (r < 7 && c >= n - 7) || (r >= n - 7 && c < 7);
  for (let r = 0; r < n; r++) {
    for (let c = 0; c < n; c++) {
      if (finder(r, c)) continue;
      x = (x * 9301 + 49297) % 233280;
      if (x / 233280 > 0.52) cells.push(<rect key={`${r}-${c}`} x={c} y={r} width="1" height="1" />);
    }
  }
  const eye = (ox: number, oy: number) => (
    <g key={`${ox}-${oy}`}>
      <rect x={ox} y={oy} width="7" height="7" />
      <rect x={ox + 1} y={oy + 1} width="5" height="5" fill="#fff" />
      <rect x={ox + 2} y={oy + 2} width="3" height="3" />
    </g>
  );
  return (
    <svg viewBox={`-1 -1 ${n + 2} ${n + 2}`} role="img" aria-label="Payment QR code" className="size-44 rounded-2xl border border-zinc-100 bg-white p-2 sm:size-52" fill="#18181b" shapeRendering="crispEdges">
      {cells}
      {eye(0, 0)}
      {eye(n - 7, 0)}
      {eye(0, n - 7)}
    </svg>
  );
}

/** The product's DrawerGate: nothing sells until a drawer session is open. */
function DrawerGate({ onNavigate }: { onNavigate: (s: ScreenId) => void }) {
  return (
    <div className="absolute inset-0 flex items-center justify-center p-6">
      <div className="flex max-w-sm flex-col items-center gap-3 rounded-3xl border border-zinc-100 bg-white p-8 text-center shadow-[0_12px_40px_rgba(0,0,0,.08)]">
        <span className="flex size-14 items-center justify-center rounded-2xl bg-zinc-900 text-white">
          <Lock aria-hidden size={22} />
        </span>
        <h2 className="jerrys-display text-xl font-black text-zinc-900">The drawer is closed</h2>
        <p className="text-sm leading-relaxed text-zinc-500">Checkout opens once a cashier starts a drawer session with an opening float.</p>
        <button type="button" onClick={() => onNavigate("drawer")} className={cn(BTN_DARK, "mt-2")}>
          <Wallet aria-hidden size={16} />
          Open the drawer
        </button>
      </div>
    </div>
  );
}
