"use client";

import * as React from "react";
import {
  ArrowDownToLine,
  ArrowUpFromLine,
  Check,
  ChevronDown,
  ChevronsUpDown,
  Info,
  Minus,
  Package,
  Plus,
  ShoppingBasket,
  Siren,
  SlidersHorizontal,
  Trash2,
  TrendingDown,
  Truck,
  Wrench,
  X,
  type LucideIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";
import type { DemoInventoryItem, DemoMovement } from "@/content/corvinn";
import {
  BUTTON_BASE,
  BUTTON_PRIMARY,
  DataTable,
  EmptyRows,
  Menu,
  MenuItem,
  PILL,
  PILL_DANGER,
  PILL_NEUTRAL,
  PILL_WARNING,
  StatusPill,
  TOOLBAR_CONTROL_CLASS,
  TOOLBAR_PRIMARY_CLASS,
  ToolbarHeader,
  ToolbarIconButton,
  ToolbarSearch,
  ToolbarTabs,
  formatCurrency,
  type DataTableColumn,
} from "./ui";
import { useStore } from "./store";

type Mode = DemoMovement["type"];
const MODES: { id: Mode; label: string; icon: LucideIcon }[] = [
  { id: "job_use", label: "Job", icon: Wrench },
  { id: "shop_use", label: "Shop use", icon: ArrowUpFromLine },
  { id: "receive", label: "Restock", icon: ArrowDownToLine },
  { id: "waste", label: "Waste", icon: Trash2 },
];
const SUBMIT_LABEL: Record<Mode, string> = { job_use: "Record on job", shop_use: "Record shop use", receive: "Add to stock", waste: "Record waste" };
const MOVEMENT_LABEL: Record<Mode, string> = { job_use: "Used on job", shop_use: "Shop use", receive: "Restocked", waste: "Wasted" };

const TABS = ["counter", "stock", "activity", "analytics"] as const;
type TabId = (typeof TABS)[number];
const TAB_LABELS: Record<TabId, string> = { counter: "Counter", stock: "Stock", activity: "Activity", analytics: "Analytics" };

type Level = "out" | "low" | "ok";
const level = (i: DemoInventoryItem): Level => (i.onHand <= 0 ? "out" : i.reorderAt > 0 && i.onHand <= i.reorderAt ? "low" : "ok");
const LEVEL_PILL: Record<Level, string> = { out: PILL_DANGER, low: PILL_WARNING, ok: PILL_NEUTRAL };

const fmtQty = (n: number) => String(Math.round(n * 100) / 100);
const qtyUnit = (n: number, unit: string) => (unit === "each" ? fmtQty(n) : `${fmtQty(n)} ${unit}`);
const stepFor = (unit: string) => (unit === "lb" ? 0.5 : unit === "cu ft" ? 10 : 1);

function Thumb({ item, className }: { item: DemoInventoryItem; className: string }) {
  return (
    <div className={cn("shrink-0 overflow-hidden bg-muted", className)}>
      {item.image ? (
        // eslint-disable-next-line @next/next/no-img-element -- product photo inside the app replica, lazy like the real counter
        <img src={item.image} alt={item.name} loading="lazy" decoding="async" className="size-full object-cover" />
      ) : (
        <div className="flex size-full items-center justify-center bg-linear-to-br from-gray-50 to-gray-100">
          <span className="flex aspect-square w-1/3 max-w-16 min-w-6 items-center justify-center rounded-full bg-white text-muted-foreground/70 shadow-[0_1px_3px_rgba(0,0,0,.06)]">
            <Package aria-hidden className="size-1/2" strokeWidth={1.5} />
          </span>
        </div>
      )}
    </div>
  );
}

function Counter({ items }: { items: DemoInventoryItem[] }) {
  const { jobs, inventory, recordTicket, customerName, toast } = useStore();
  const [category, setCategory] = React.useState<string | null>(null);
  const [lines, setLines] = React.useState<{ itemId: string; qty: number }[]>([]);
  const [mode, setMode] = React.useState<Mode>("job_use");
  const [jobId, setJobId] = React.useState<string | null>(null);

  const categories = [...new Set(inventory.map((i) => i.category))].sort();
  const shown = category ? items.filter((i) => i.category === category) : items;
  const byId = new Map(inventory.map((i) => [i.id, i]));
  const pickable = jobs.filter((j) => ["scheduled", "in_progress", "diagnosed"].includes(j.status));
  const job = jobs.find((j) => j.id === jobId) ?? null;
  const ActiveMode = MODES.find((m) => m.id === mode)!;

  const add = (item: DemoInventoryItem) =>
    setLines((prev) => {
      const step = stepFor(item.unit);
      return prev.some((l) => l.itemId === item.id) ? prev.map((l) => (l.itemId === item.id ? { ...l, qty: l.qty + step } : l)) : [...prev, { itemId: item.id, qty: step }];
    });
  const bump = (item: DemoInventoryItem, dir: 1 | -1) =>
    setLines((prev) => prev.flatMap((l) => (l.itemId !== item.id ? [l] : l.qty + dir * stepFor(item.unit) > 0 ? [{ ...l, qty: l.qty + dir * stepFor(item.unit) }] : [])));

  const cost = lines.reduce((s, l) => s + l.qty * (byId.get(l.itemId)?.unitCost ?? 0), 0);
  const billable = lines.reduce((s, l) => s + l.qty * (byId.get(l.itemId)?.sellPrice ?? 0), 0);
  const canSubmit = lines.length > 0 && (mode !== "job_use" || job !== null);

  function submit() {
    if (!canSubmit) return;
    const summary = lines.map((l) => `${byId.get(l.itemId)!.name} ${qtyUnit(l.qty, byId.get(l.itemId)!.unit)}`).join(", ");
    recordTicket(lines, mode, mode === "job_use" ? jobId : null);
    toast(mode === "job_use" ? `Recorded on ${job!.title}` : `${SUBMIT_LABEL[mode]}: ${lines.length} item${lines.length === 1 ? "" : "s"}`, summary);
    setLines([]);
  }

  return (
    <div className="grid gap-3 lg:min-h-0 lg:flex-1 lg:grid-cols-[minmax(0,1fr)_380px]">
      <section className="flex min-w-0 flex-col gap-3 lg:min-h-0 lg:overflow-y-auto">
        <div className="flex shrink-0 gap-2 overflow-x-auto pb-1 [scrollbar-width:none]">
          {[null, ...categories].map((c) => (
            <button
              key={c ?? "all"}
              type="button"
              onClick={() => setCategory(c)}
              className={cn(
                "h-11 shrink-0 cursor-pointer rounded-full px-4 text-[13.5px] font-medium transition-colors",
                category === c ? "bg-primary text-primary-foreground" : "bg-white text-foreground hover:bg-muted",
              )}
            >
              {c ?? "All"}
            </button>
          ))}
        </div>
        {shown.length === 0 ? (
          <div className="flex shrink-0 flex-col items-center gap-3 rounded-[24px] bg-white px-4 py-16 text-center">
            <Package aria-hidden className="size-8 text-muted-foreground" strokeWidth={1.5} />
            <div className="text-[15px] font-semibold">No products here</div>
            <p className="max-w-xs text-[13px] text-muted-foreground">Clear the search or filters.</p>
          </div>
        ) : (
          <div className="grid shrink-0 grid-cols-2 gap-3 sm:grid-cols-3 xl:grid-cols-4">
            {shown.map((item) => {
              const inTicket = lines.find((l) => l.itemId === item.id)?.qty ?? 0;
              const lv = level(item);
              return (
                <div key={item.id} className={cn("group relative flex overflow-hidden rounded-[20px] bg-white transition-shadow hover:shadow-[0_4px_16px_rgba(0,0,0,.06)]", inTicket > 0 && "ring-2 ring-primary")}>
                  <button
                    type="button"
                    onClick={() => add(item)}
                    aria-label={`Add ${item.name} to the ticket`}
                    className="flex w-full cursor-pointer flex-col text-left transition-transform focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50 active:scale-[0.98]"
                  >
                    {/* Every product photo is a 1:1 square, inset, so the grid reads as equal tiles. */}
                    <div className="relative m-2 mb-0 aspect-square overflow-hidden rounded-[14px]">
                      <Thumb item={item} className="size-full transition-transform duration-300 group-hover:scale-[1.03]" />
                      {lv !== "ok" && <span className={cn(PILL, LEVEL_PILL[lv], "absolute bottom-2 left-2")}>{lv === "out" ? "Out" : "Low"}</span>}
                    </div>
                    <div className="flex flex-1 flex-col justify-between gap-1 p-3">
                      <span className="line-clamp-2 min-h-[2.5em] text-[14px] leading-tight font-semibold">{item.name}</span>
                      <span className="flex items-baseline justify-between gap-2 text-[12.5px] text-muted-foreground">
                        <span className="truncate tabular-nums">{qtyUnit(item.onHand, item.unit)} on hand</span>
                        <span className="shrink-0 font-medium text-foreground tabular-nums">
                          {formatCurrency(item.sellPrice)}
                          {item.unit !== "each" && <span className="text-muted-foreground">/{item.unit}</span>}
                        </span>
                      </span>
                    </div>
                  </button>
                  <span aria-hidden className="absolute top-4 left-4 flex size-9 items-center justify-center rounded-full bg-white/90 text-foreground opacity-90 backdrop-blur-sm">
                    <Info className="size-4" />
                  </span>
                  {inTicket > 0 && (
                    <span className="pointer-events-none absolute top-4 right-4 flex h-9 min-w-9 items-center justify-center rounded-full bg-primary px-2.5 text-[13px] font-bold text-primary-foreground tabular-nums">
                      {fmtQty(inTicket)}
                    </span>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </section>

      <aside aria-label="Ticket" className="flex min-h-[520px] flex-col overflow-hidden rounded-[24px] bg-white lg:min-h-0">
        <div className="flex flex-col gap-3 border-b border-border p-4">
          <div className="flex items-center gap-2">
            <h3 className="flex min-w-0 flex-1 items-center gap-2 truncate text-[16px] font-semibold">
              <ShoppingBasket aria-hidden className="size-4.5 shrink-0" /> Ticket
            </h3>
            <Menu
              className="w-52 rounded-2xl p-1.5"
              trigger={
                <button type="button" className="flex h-11 shrink-0 cursor-pointer items-center gap-2 rounded-full bg-muted pr-3 pl-4 text-[13.5px] font-medium outline-none hover:bg-muted/70 focus-visible:ring-2 focus-visible:ring-ring/50">
                  <ActiveMode.icon aria-hidden className="size-4 shrink-0" />
                  {ActiveMode.label}
                  <ChevronDown aria-hidden className="size-4 text-muted-foreground" />
                </button>
              }
            >
              {MODES.map((m) => (
                <MenuItem key={m.id} active={m.id === mode} onSelect={() => setMode(m.id)} className="min-h-12 gap-3 rounded-xl text-[14.5px]">
                  <m.icon className="size-4.5" />
                  <span className="flex-1">{m.label}</span>
                  {m.id === mode && <Check className="size-4" />}
                </MenuItem>
              ))}
            </Menu>
            {lines.length > 0 && (
              <button type="button" onClick={() => setLines([])} className="h-11 shrink-0 cursor-pointer rounded-full px-3 text-[12.5px] font-medium text-muted-foreground hover:bg-muted hover:text-foreground">
                Clear all
              </button>
            )}
          </div>
          {mode === "job_use" && (
            <Menu
              align="start"
              className="max-h-80 w-[var(--radix-dropdown-menu-trigger-width)] min-w-72 overflow-y-auto"
              trigger={
                <button
                  type="button"
                  className={cn(
                    "flex min-h-14 w-full cursor-pointer items-center gap-3 rounded-2xl border px-3 py-2 text-left transition-colors hover:bg-muted/50",
                    job ? "border-border" : "border-dashed border-muted-foreground/40",
                  )}
                >
                  <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-muted">
                    {job?.emergency ? <Siren aria-hidden className="size-4 text-rose-600" /> : <Wrench aria-hidden className="size-4" />}
                  </span>
                  <span className="flex min-w-0 flex-1 flex-col">
                    <span className="truncate text-[14px] font-semibold">{job ? job.title : "Choose a job"}</span>
                    <span className="truncate text-[12px] text-muted-foreground">{job ? customerName(job.customerId) : "Usage is costed to this job"}</span>
                  </span>
                  <ChevronsUpDown aria-hidden className="size-4 shrink-0 text-muted-foreground" />
                </button>
              }
            >
              {pickable.map((j) => (
                <MenuItem key={j.id} onSelect={() => setJobId(j.id)} className="gap-2.5 py-2.5">
                  <span className="flex min-w-0 flex-1 flex-col">
                    <span className="flex items-center gap-1.5 truncate text-[13.5px] font-medium">
                      {j.emergency && <Siren aria-hidden className="size-3.5 shrink-0 text-rose-600" />}
                      <span className="truncate">{j.title}</span>
                    </span>
                    <span className="truncate text-[12px] text-muted-foreground">{customerName(j.customerId)}</span>
                  </span>
                  <StatusPill status={j.status} className="shrink-0" />
                  {jobId === j.id && <Check className="size-4 shrink-0" />}
                </MenuItem>
              ))}
            </Menu>
          )}
        </div>

        <div className="flex min-h-0 flex-1 flex-col gap-2 overflow-y-auto p-4">
          {lines.length === 0 && (
            <div className="flex flex-col items-center gap-1.5 py-10 text-center">
              <ShoppingBasket aria-hidden className="size-7 text-muted-foreground/60" strokeWidth={1.5} />
              <p className="text-[14px] font-medium">Tap products to add them</p>
              <p className="max-w-[16rem] text-[12.5px] text-muted-foreground">Or scan a barcode into the search box. Quantities follow each item&apos;s unit (lb, ft, cu ft…).</p>
            </div>
          )}
          {lines.map((l) => {
            const item = byId.get(l.itemId)!;
            const after = item.onHand + (mode === "receive" ? l.qty : -l.qty);
            return (
              <div key={l.itemId} className="flex flex-col gap-2 rounded-2xl border border-border p-2.5">
                <div className="flex items-center gap-2.5">
                  <Thumb item={item} className="size-11 rounded-xl" />
                  <div className="flex min-w-0 flex-1 flex-col">
                    <span className="truncate text-[13.5px] font-semibold">{item.name}</span>
                    <span className={cn("text-[12px] tabular-nums", after < 0 ? "text-[#c62b28]" : "text-muted-foreground")}>
                      {qtyUnit(item.onHand, item.unit)} → {qtyUnit(after, item.unit)}
                      {after < 0 && " · below zero"}
                    </span>
                  </div>
                  <button type="button" aria-label={`Remove ${item.name}`} onClick={() => setLines((p) => p.filter((x) => x.itemId !== l.itemId))} className="flex size-9 shrink-0 cursor-pointer items-center justify-center rounded-full text-muted-foreground hover:bg-muted hover:text-foreground">
                    <X className="size-4" />
                  </button>
                </div>
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-1 rounded-full bg-muted p-1">
                    <button type="button" aria-label="Less" onClick={() => bump(item, -1)} className="flex size-10 cursor-pointer items-center justify-center rounded-full bg-white active:scale-95">
                      <Minus className="size-4" />
                    </button>
                    <span className="w-16 text-center text-[15px] font-semibold tabular-nums">{fmtQty(l.qty)}</span>
                    <button type="button" aria-label="More" onClick={() => bump(item, 1)} className="flex size-10 cursor-pointer items-center justify-center rounded-full bg-white active:scale-95">
                      <Plus className="size-4" />
                    </button>
                  </div>
                  <span className="text-right text-[12px] text-muted-foreground">
                    {item.unit !== "each" && <span className="block">{item.unit}</span>}
                    {mode === "job_use" ? (
                      <span className="text-[13.5px] font-semibold text-foreground tabular-nums">{formatCurrency(l.qty * item.sellPrice)}</span>
                    ) : (
                      <span className="tabular-nums">{formatCurrency(l.qty * item.unitCost)} cost</span>
                    )}
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        <div className="flex flex-col gap-3 border-t border-border p-4">
          {lines.length > 0 && (
            <dl className="flex flex-col gap-1 text-[13px]">
              <div className="flex justify-between">
                <dt className="text-muted-foreground">Material cost</dt>
                <dd className="font-medium tabular-nums">{formatCurrency(cost)}</dd>
              </div>
              {mode === "job_use" && (
                <div className="flex justify-between">
                  <dt className="text-muted-foreground">Billable to customer</dt>
                  <dd className="text-[15px] font-bold tabular-nums">{formatCurrency(billable)}</dd>
                </div>
              )}
            </dl>
          )}
          <button type="button" onClick={submit} disabled={!canSubmit} className={cn(BUTTON_BASE, BUTTON_PRIMARY, "h-14 rounded-full text-[15px]")}>
            <Check className="size-4" />
            {mode === "job_use" && !job && lines.length > 0 ? "Pick a job first" : SUBMIT_LABEL[mode]}
          </button>
        </div>
      </aside>
    </div>
  );
}

function StockTable({ items }: { items: DemoInventoryItem[] }) {
  const columns: DataTableColumn<DemoInventoryItem>[] = [
    {
      id: "name",
      header: "Item",
      size: 300,
      minSize: 200,
      sortValue: (i) => i.name.toLowerCase(),
      cell: (i) => (
        <span className="flex min-w-0 items-center gap-2.5">
          <Thumb item={i} className="size-9 rounded-xl" />
          <span className="flex min-w-0 flex-col">
            <span className="truncate font-medium text-foreground">{i.name}</span>
            <span className="truncate text-[12px] text-muted-foreground">
              {i.sku} · {i.location}
            </span>
          </span>
        </span>
      ),
    },
    { id: "category", header: "Category", size: 150, minSize: 110, sortValue: (i) => i.category, cell: (i) => <span className="truncate text-muted-foreground">{i.category}</span> },
    {
      id: "on_hand",
      header: "On hand",
      size: 140,
      minSize: 110,
      sortValue: (i) => i.onHand,
      cell: (i) => <span className={cn(PILL, LEVEL_PILL[level(i)], "tabular-nums")}>{qtyUnit(i.onHand, i.unit)}</span>,
    },
    { id: "reorder", header: "Reorder at", size: 120, minSize: 100, sortValue: (i) => i.reorderAt, cell: (i) => <span className="text-muted-foreground tabular-nums">{qtyUnit(i.reorderAt, i.unit)}</span> },
    { id: "unit_cost", header: "Unit cost", size: 120, minSize: 100, sortValue: (i) => i.unitCost, cell: (i) => <span className="text-muted-foreground tabular-nums">{formatCurrency(i.unitCost)}</span> },
    {
      id: "value",
      header: "Stock value",
      size: 130,
      minSize: 100,
      sortValue: (i) => Math.max(0, i.onHand) * i.unitCost,
      cell: (i) => <span className="font-medium tabular-nums">{formatCurrency(Math.max(0, i.onHand) * i.unitCost)}</span>,
    },
    { id: "used30", header: "Used 30d", size: 120, minSize: 100, sortValue: (i) => i.used30, cell: (i) => <span className="text-muted-foreground tabular-nums">{qtyUnit(i.used30, i.unit)}</span> },
    {
      id: "cover",
      header: "Cover",
      size: 120,
      minSize: 100,
      sortValue: (i) => (i.used30 > 0 ? i.onHand / (i.used30 / 30) : Number.MAX_SAFE_INTEGER),
      cell: (i) => {
        if (i.used30 <= 0) return <span className="text-muted-foreground">No usage</span>;
        const d = Math.max(0, i.onHand) / (i.used30 / 30);
        return <span className={cn("tabular-nums", d < 14 ? "font-semibold text-[#b5750a]" : "text-muted-foreground")}>{d >= 365 ? "1 yr+" : `${Math.round(d)} days`}</span>;
      },
    },
  ];
  return <DataTable data={items} columns={columns} getRowId={(i) => i.id} emptyState={<EmptyRows title="No items found" body="Try clearing your search or filters." />} />;
}

function Activity() {
  const { movements, inventory, jobs } = useStore();
  return (
    <div className="overflow-hidden rounded-[24px] bg-white">
      {movements.map((m, i) => {
        const item = inventory.find((x) => x.id === m.itemId)!;
        const job = jobs.find((j) => j.id === m.jobId);
        const sign = m.type === "receive" ? "+" : "-";
        return (
          <div key={m.id} className={cn("flex items-center gap-3 px-4 py-3", i > 0 && "border-t border-[#eeeeee]")}>
            <Thumb item={item} className="size-10 rounded-xl" />
            <div className="min-w-0 flex-1">
              <div className="truncate text-[13.5px] font-semibold">{item.name}</div>
              <div className="truncate text-[12px] text-muted-foreground">
                {MOVEMENT_LABEL[m.type]}
                {job ? ` · ${job.title}` : ""} · {m.by} · {m.hoursAgo === 0 ? "just now" : m.hoursAgo < 24 ? `${m.hoursAgo}h ago` : `${Math.round(m.hoursAgo / 24)}d ago`}
              </div>
            </div>
            <span className={cn(PILL, m.type === "receive" ? "bg-[#e7f5ee] text-[#1a7f4e]" : PILL_NEUTRAL, "tabular-nums")}>
              {sign}
              {qtyUnit(m.quantity, item.unit)}
            </span>
          </div>
        );
      })}
    </div>
  );
}

function Analytics() {
  const { inventory } = useStore();
  const value = inventory.reduce((s, i) => s + Math.max(0, i.onHand) * i.unitCost, 0);
  const used = inventory.reduce((s, i) => s + i.used30 * i.unitCost, 0);
  const reorder = inventory.filter((i) => level(i) !== "ok");
  const movers = [...inventory].sort((a, b) => b.used30 * b.unitCost - a.used30 * a.unitCost).slice(0, 5);
  const top = movers[0] ? movers[0].used30 * movers[0].unitCost : 1;
  const stats: { icon: LucideIcon; label: string; value: string; tone?: string }[] = [
    { icon: Package, label: "Stock value", value: formatCurrency(value) },
    { icon: TrendingDown, label: "Used, last 30 days", value: formatCurrency(used) },
    { icon: Truck, label: "Need reorder", value: String(reorder.length), tone: reorder.length ? "#b5750a" : undefined },
  ];
  return (
    <div className="flex flex-col gap-3">
      <div className="grid gap-3 sm:grid-cols-3">
        {stats.map((s) => (
          <div key={s.label} className="flex items-center gap-3 rounded-[24px] bg-white p-4">
            <div className="flex size-11 shrink-0 items-center justify-center rounded-full bg-muted">
              <s.icon aria-hidden className="size-5" strokeWidth={1.75} />
            </div>
            <div className="min-w-0">
              <div className="truncate text-[13px] text-muted-foreground">{s.label}</div>
              <div className="truncate text-[22px] leading-tight font-semibold tabular-nums" style={s.tone ? { color: s.tone } : undefined}>
                {s.value}
              </div>
            </div>
          </div>
        ))}
      </div>
      <section className="flex flex-col gap-4 rounded-[24px] bg-white p-5">
        <div>
          <h3 className="text-[15px] leading-tight font-semibold">Top movers by cost</h3>
          <p className="mt-0.5 text-[12.5px] text-muted-foreground">Material cost consumed in the last 30 days</p>
        </div>
        <div className="flex flex-col gap-3">
          {movers.map((m) => (
            <div key={m.id} className="flex items-center gap-3">
              <span className="w-44 truncate text-[13px] font-medium">{m.name}</span>
              <div className="h-2.5 flex-1 overflow-hidden rounded-full bg-muted">
                <div className="h-full rounded-full bg-primary" style={{ width: `${((m.used30 * m.unitCost) / top) * 100}%` }} />
              </div>
              <span className="w-24 text-right text-[13px] tabular-nums">{formatCurrency(m.used30 * m.unitCost)}</span>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

export function InventoryScreen() {
  const { inventory, askWalkthrough } = useStore();
  const [tab, setTab] = React.useState<TabId>("counter");
  const [query, setQuery] = React.useState("");
  const [searchOpen, setSearchOpen] = React.useState(false);
  const q = query.trim().toLowerCase();
  const filtered = inventory.filter((i) => !q || [i.name, i.sku, i.category].some((f) => f.toLowerCase().includes(q)));
  const lowCount = inventory.filter((i) => level(i) !== "ok").length;

  return (
    <div className={cn("flex flex-col gap-3 p-3", tab === "counter" && "lg:h-full lg:min-h-[620px]")}>
      <ToolbarHeader icon={Package} title="Inventory" subtitle={`${inventory.length} items${lowCount > 0 ? ` · ${lowCount} need reorder` : ""}`} className="shrink-0">
        <ToolbarTabs value={tab} onValueChange={setTab} options={TABS.map((t) => ({ value: t, label: TAB_LABELS[t] }))} hidden={searchOpen} />
        <ToolbarSearch value={query} onChange={setQuery} open={searchOpen} onOpenChange={setSearchOpen} placeholder="Search or scan barcode…" />
        <ToolbarIconButton icon={SlidersHorizontal} label="Filters" onClick={() => askWalkthrough("Inventory filters and warehouses")} />
        <button type="button" onClick={() => askWalkthrough("Purchase orders")} className={cn(BUTTON_BASE, TOOLBAR_CONTROL_CLASS)}>
          <Truck className="size-4" />
          Orders
        </button>
        <button type="button" onClick={() => askWalkthrough("Adding inventory items")} className={cn(BUTTON_BASE, BUTTON_PRIMARY, TOOLBAR_PRIMARY_CLASS)}>
          <Plus className="size-4" />
          New item
        </button>
      </ToolbarHeader>

      {tab === "counter" && <Counter items={filtered} />}
      {tab === "stock" && <StockTable items={filtered} />}
      {tab === "activity" && <Activity />}
      {tab === "analytics" && <Analytics />}
    </div>
  );
}
