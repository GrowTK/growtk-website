"use client";

import * as React from "react";
import { DropdownMenu } from "radix-ui";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { ArrowDown, ArrowUp, Check, MoreVertical, Pencil, Search, X, type LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import type { CustomerStage, JobStatus } from "@/content/corvinn";

/**
 * Presentational copies of Corvinn's own UI primitives (page-header.tsx,
 * toolbar-controls.tsx, data-table.tsx, entity-avatar.tsx, lib/ui/status.ts),
 * restyled only where the real one depends on Supabase. Class strings are
 * kept identical to the product so the slides look like the app, not like
 * a mockup of it.
 */

/* ---------------------------------------------------------------- portals */

/** Menus portal into the app frame (not document.body) so the scoped
 *  Corvinn tokens and font still apply to them. */
export const PortalContext = React.createContext<HTMLElement | null>(null);

/* ------------------------------------------------------------- statuses */

export const JOB_STATUSES: JobStatus[] = ["requested", "diagnosed", "scheduled", "in_progress", "completed", "invoiced", "paid", "canceled"];

export const NEXT_JOB_STATUSES: Record<JobStatus, JobStatus[]> = {
  requested: ["diagnosed", "canceled"],
  diagnosed: ["scheduled", "canceled"],
  scheduled: ["in_progress", "canceled"],
  in_progress: ["completed", "canceled"],
  completed: ["invoiced", "canceled"],
  invoiced: ["paid", "canceled"],
  paid: [],
  canceled: [],
};

export const JOB_STATUS_COLOR: Record<JobStatus, string> = {
  requested: "#64748b",
  diagnosed: "#7c3aed",
  scheduled: "#2563eb",
  in_progress: "#d97706",
  completed: "#059669",
  invoiced: "#0d9488",
  paid: "#16a34a",
  canceled: "#e11d48",
};

export const statusLabel = (s: string) => s.replace("_", " ");

export function jobStatusStyle(status: JobStatus): React.CSSProperties {
  const hex = JOB_STATUS_COLOR[status];
  return { backgroundColor: `color-mix(in srgb, ${hex} 16%, white)`, color: hex };
}

export const PILL = "inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[12px] font-semibold";
export const PILL_NEUTRAL = "bg-[#eeeeee] text-[#6e6e73]";
export const PILL_WARNING = "bg-[#fbf0dc] text-[#b5750a]";
export const PILL_DANGER = "bg-[#fbeaea] text-[#c62b28]";

export function StatusPill({ status, className }: { status: JobStatus; className?: string }) {
  return (
    <span className={cn(PILL, "capitalize", className)} style={jobStatusStyle(status)}>
      {statusLabel(status)}
    </span>
  );
}

export const CUSTOMER_STAGES: CustomerStage[] = ["lead", "contacted", "job_created", "fulfilled"];
export const CUSTOMER_STAGE_LABELS: Record<CustomerStage, string> = {
  lead: "Lead",
  contacted: "Contacted",
  job_created: "Job created",
  fulfilled: "Fulfilled",
};
export const CUSTOMER_STAGE_STYLES: Record<CustomerStage, { bg: string; header: string; text: string; dot: string }> = {
  lead: { bg: "bg-slate-50", header: "bg-slate-100", text: "text-slate-700", dot: "bg-slate-400" },
  contacted: { bg: "bg-sky-50", header: "bg-sky-100", text: "text-sky-700", dot: "bg-sky-400" },
  job_created: { bg: "bg-amber-50", header: "bg-amber-100", text: "text-amber-700", dot: "bg-amber-400" },
  fulfilled: { bg: "bg-emerald-50", header: "bg-emerald-100", text: "text-emerald-700", dot: "bg-emerald-400" },
};

export function StageBadge({ stage }: { stage: CustomerStage }) {
  const style = CUSTOMER_STAGE_STYLES[stage];
  return (
    <span className={cn("inline-flex w-fit items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium", style.bg, style.text)}>
      <span className={cn("size-1.5 rounded-full", style.dot)} />
      {CUSTOMER_STAGE_LABELS[stage]}
    </span>
  );
}

export const formatCurrency = (n: number) =>
  n.toLocaleString("en-US", { style: "currency", currency: "USD", minimumFractionDigits: 2, maximumFractionDigits: 2 });

/** Legacy `.glass-card`: flat white, faint 1px line, the app radius. */
export const GLASS_CARD = "rounded-[10px] border border-[#eeeeee] bg-white";

/* --------------------------------------------------------------- avatars */

const PASTELS = [
  "bg-sky-100 text-sky-700",
  "bg-violet-100 text-violet-700",
  "bg-rose-100 text-rose-700",
  "bg-amber-100 text-amber-700",
  "bg-emerald-100 text-emerald-700",
  "bg-indigo-100 text-indigo-700",
  "bg-pink-100 text-pink-700",
  "bg-teal-100 text-teal-700",
] as const;

const AVATAR_SIZES = { sm: "size-6 text-[10px]", default: "size-8 text-[12px]", lg: "size-10 text-[14px]" } as const;

function hashString(value: string): number {
  let hash = 0;
  for (let i = 0; i < value.length; i++) hash = (hash * 31 + value.charCodeAt(i)) >>> 0;
  return hash;
}

function initialsOf(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "?";
  if (parts.length === 1) return parts[0]!.slice(0, 2).toUpperCase();
  return (parts[0]![0]! + parts[parts.length - 1]![0]!).toUpperCase();
}

export function EntityAvatar({
  name,
  size = "default",
  tone = "pastel",
  className,
}: {
  name: string;
  size?: keyof typeof AVATAR_SIZES;
  tone?: "pastel" | "primary";
  className?: string;
}) {
  return (
    <div
      aria-hidden
      className={cn(
        "flex shrink-0 items-center justify-center rounded-full font-semibold",
        AVATAR_SIZES[size],
        tone === "primary" ? "bg-primary text-white" : PASTELS[hashString(name) % PASTELS.length],
        className,
      )}
    >
      {initialsOf(name)}
    </div>
  );
}

/* --------------------------------------------------------------- buttons */

export const BUTTON_BASE =
  "inline-flex shrink-0 cursor-pointer items-center justify-center gap-2 whitespace-nowrap font-medium transition-all outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0";
export const BUTTON_PRIMARY = "bg-primary text-primary-foreground hover:bg-primary/90";
export const TOOLBAR_CONTROL_CLASS = "h-11 rounded-full border-0 bg-muted px-4 text-[13.5px] hover:bg-muted/70";
export const TOOLBAR_PRIMARY_CLASS = "h-11 rounded-full px-5 text-[13.5px]";

/* ---------------------------------------------------------------- header */

function HeaderCard({
  icon: Icon,
  title,
  subtitle,
  children,
}: {
  icon: LucideIcon;
  title: string;
  subtitle?: React.ReactNode;
  children?: React.ReactNode;
}) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-3 rounded-[24px] bg-white p-4">
      <div className="flex min-h-11 min-w-0 items-center gap-2.5">
        <div className="flex size-9 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground">
          <Icon className="size-4" strokeWidth={1.75} />
        </div>
        <div className="min-w-0">
          <h2 className="truncate text-[16px] font-semibold leading-tight">{title}</h2>
          {subtitle && <p className="truncate text-[12px] leading-tight text-muted-foreground">{subtitle}</p>}
        </div>
      </div>
      {children && <div className="flex flex-1 flex-wrap items-center justify-end gap-2">{children}</div>}
    </div>
  );
}

/** For pages laid out as flex-col + PageHeader + PageBody. */
export function PageHeader(props: { icon: LucideIcon; title: string; subtitle?: React.ReactNode; actions?: React.ReactNode }) {
  return (
    <div className="sticky top-0 z-10 bg-gray-100 p-3 md:z-20">
      <HeaderCard icon={props.icon} title={props.title} subtitle={props.subtitle}>
        {props.actions}
      </HeaderCard>
    </div>
  );
}

/** For list views that are the first child of a `flex flex-col gap-3 p-3` wrapper. */
export function ToolbarHeader({
  icon,
  title,
  subtitle,
  children,
  className,
}: {
  icon: LucideIcon;
  title: string;
  subtitle?: React.ReactNode;
  children?: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("sticky top-0 z-10 -mt-3 bg-gray-100 pt-3 md:z-20", className)}>
      <HeaderCard icon={icon} title={title} subtitle={subtitle}>
        {children}
      </HeaderCard>
    </div>
  );
}

export function ToolbarTabs<T extends string>({
  value,
  onValueChange,
  options,
  hidden,
}: {
  value: T;
  onValueChange: (value: T) => void;
  options: { value: T; label: React.ReactNode; count?: number }[];
  hidden?: boolean;
}) {
  if (hidden) return null;
  return (
    <div role="tablist" className="flex h-11 items-center gap-0.5 rounded-full bg-muted p-1">
      {options.map((o) => (
        <button
          key={o.value}
          type="button"
          role="tab"
          aria-selected={o.value === value}
          onClick={() => onValueChange(o.value)}
          className={cn(
            "flex h-full cursor-pointer items-center gap-1.5 rounded-full px-4 text-[13.5px] font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50",
            o.value === value ? "bg-primary text-primary-foreground" : "text-foreground/60 hover:text-foreground",
          )}
        >
          {o.label}
          {o.count != null && <span className="text-[11px] tabular-nums opacity-60">{o.count}</span>}
        </button>
      ))}
    </div>
  );
}

export function ToolbarIconButton({ icon: Icon, label, onClick, badge }: { icon: LucideIcon; label: string; onClick?: () => void; badge?: number }) {
  return (
    <button
      type="button"
      aria-label={label}
      title={label}
      onClick={onClick}
      className={cn(BUTTON_BASE, "relative size-11 rounded-full border-0 bg-muted p-0 hover:bg-muted/70")}
    >
      <Icon className="size-4" />
      {badge != null && badge > 0 && (
        <span className="absolute -top-0.5 -right-0.5 flex size-4 items-center justify-center rounded-full bg-primary text-[10px] text-primary-foreground">
          {badge}
        </span>
      )}
    </button>
  );
}

/** A round search button that expands into the input. */
export function ToolbarSearch({
  value,
  onChange,
  open,
  onOpenChange,
  placeholder = "Search…",
}: {
  value: string;
  onChange: (value: string) => void;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  placeholder?: string;
}) {
  function close() {
    onChange("");
    onOpenChange(false);
  }
  if (!open) return <ToolbarIconButton icon={Search} label={placeholder.replace(/…$/, "")} onClick={() => onOpenChange(true)} />;
  return (
    <div className="relative w-full max-w-72">
      <Search aria-hidden className="pointer-events-none absolute top-1/2 left-3.5 size-4 -translate-y-1/2 text-muted-foreground" />
      <input
        autoFocus
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={(e) => e.key === "Escape" && close()}
        onBlur={() => !value.trim() && onOpenChange(false)}
        placeholder={placeholder}
        aria-label={placeholder}
        className="h-11 w-full rounded-full border border-transparent bg-muted pr-10 pl-10 text-[14px] outline-none placeholder:text-muted-foreground focus-visible:ring-2 focus-visible:ring-ring/50"
      />
      <button
        type="button"
        aria-label="Close search"
        onMouseDown={(e) => e.preventDefault()}
        onClick={close}
        className="absolute top-1/2 right-2 flex size-7 -translate-y-1/2 cursor-pointer items-center justify-center rounded-full text-muted-foreground hover:bg-black/5 hover:text-foreground"
      >
        <X className="size-4" />
      </button>
    </div>
  );
}

/* ----------------------------------------------------------------- menus */

export function Menu({ trigger, children, align = "end", className }: { trigger: React.ReactNode; children: React.ReactNode; align?: "start" | "end"; className?: string }) {
  const container = React.useContext(PortalContext);
  return (
    <DropdownMenu.Root modal={false}>
      <DropdownMenu.Trigger asChild>{trigger}</DropdownMenu.Trigger>
      <DropdownMenu.Portal container={container ?? undefined}>
        <DropdownMenu.Content
          align={align}
          sideOffset={6}
          onClick={(e) => e.stopPropagation()}
          className={cn(
            "z-[70] min-w-[8rem] overflow-hidden rounded-[10px] border border-border bg-white p-1 text-foreground shadow-[0_8px_24px_rgba(0,0,0,.08),0_20px_48px_rgba(0,0,0,.10)] data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=open]:zoom-in-95",
            className,
          )}
        >
          {children}
        </DropdownMenu.Content>
      </DropdownMenu.Portal>
    </DropdownMenu.Root>
  );
}

export function MenuItem({
  children,
  onSelect,
  disabled,
  className,
  active,
}: {
  children: React.ReactNode;
  onSelect?: () => void;
  disabled?: boolean;
  className?: string;
  active?: boolean;
}) {
  return (
    <DropdownMenu.Item
      disabled={disabled}
      onSelect={onSelect}
      className={cn(
        "relative flex cursor-pointer items-center gap-2 rounded-md px-2 py-1.5 text-[13px] outline-none select-none data-[disabled]:cursor-not-allowed data-[disabled]:opacity-40 data-[highlighted]:bg-accent",
        active && "bg-accent",
        className,
      )}
    >
      {children}
    </DropdownMenu.Item>
  );
}

export function MenuLabel({ children }: { children: React.ReactNode }) {
  return <DropdownMenu.Label className="px-2 py-1.5 text-[11px] font-semibold text-muted-foreground">{children}</DropdownMenu.Label>;
}

/* -------------------------------------------------------------- checkbox */

export function Checkbox({
  checked,
  onChange,
  label,
  variant = "default",
}: {
  checked: boolean | "indeterminate";
  onChange: () => void;
  label: string;
  variant?: "default" | "row" | "header";
}) {
  const on = checked !== false;
  return (
    <button
      type="button"
      role="checkbox"
      aria-checked={checked === "indeterminate" ? "mixed" : checked}
      aria-label={label}
      onClick={(e) => {
        e.stopPropagation();
        onChange();
      }}
      className={cn(
        "flex size-4 shrink-0 cursor-pointer items-center justify-center rounded-[4px] border transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50",
        variant === "header" && "border-white bg-white text-primary",
        variant === "row" && (on ? "border-transparent bg-primary text-primary-foreground" : "border-transparent bg-gray-200"),
        variant === "default" && (on ? "border-primary bg-primary text-primary-foreground" : "border-input bg-white"),
      )}
    >
      {on && (checked === "indeterminate" ? <span className="h-0.5 w-2 rounded-full bg-current" /> : <Check className="size-3" strokeWidth={3} />)}
    </button>
  );
}

/* ------------------------------------------------------------- data table */

export interface DataTableColumn<T> {
  id: string;
  header: string;
  size: number;
  minSize?: number;
  sortValue?: (row: T) => string | number;
  cell: (row: T) => React.ReactNode;
  /** A dropdown that picks a new value, rendered as `render(value)`. */
  select?: { value: (row: T) => string; options: { value: string; label: string; disabled?: boolean }[]; render: (value: string, label: string) => React.ReactNode; onSave: (row: T, next: string) => void };
  /** Click the cell to edit it inline. */
  text?: { value: (row: T) => string; onSave: (row: T, next: string) => void };
}

const EDITABLE_TRIGGER =
  "group/editable flex h-8 w-full min-w-0 cursor-pointer items-center justify-between gap-1.5 rounded-md border border-transparent px-2 text-left transition-colors hover:border-border";

function TextCell<T>({ row, col }: { row: T; col: DataTableColumn<T> }) {
  const [editing, setEditing] = React.useState(false);
  const [text, setText] = React.useState("");
  if (!editing) {
    return (
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          setText(col.text!.value(row));
          setEditing(true);
        }}
        className={EDITABLE_TRIGGER}
      >
        <span className="min-w-0 flex-1 truncate">{col.cell(row)}</span>
        <Pencil aria-hidden className="size-3.5 shrink-0 text-muted-foreground opacity-0 transition-opacity group-hover/editable:opacity-100" />
      </button>
    );
  }
  const done = () => {
    if (text.trim() && text !== col.text!.value(row)) col.text!.onSave(row, text.trim());
    setEditing(false);
  };
  return (
    <input
      autoFocus
      value={text}
      aria-label={`Edit ${col.header}`}
      onClick={(e) => e.stopPropagation()}
      onChange={(e) => setText(e.target.value)}
      onKeyDown={(e) => {
        if (e.key === "Enter") done();
        if (e.key === "Escape") setEditing(false);
      }}
      onBlur={done}
      className="h-8 w-full rounded-md border border-input bg-white px-2 text-[13px] outline-none focus-visible:ring-2 focus-visible:ring-ring/50"
    />
  );
}

/**
 * The one table shape Corvinn uses for records: a primary-color header bar,
 * then floating white card rows on the gray panel. A CSS grid, not <table>.
 */
export function DataTable<T>({
  columns,
  data,
  getRowId,
  onRowClick,
  toolbar,
  emptyState,
}: {
  columns: DataTableColumn<T>[];
  data: T[];
  getRowId: (row: T) => string;
  onRowClick?: (row: T) => void;
  toolbar?: (selectedIds: string[], clear: () => void) => React.ReactNode;
  emptyState?: React.ReactNode;
}) {
  const [sizes, setSizes] = React.useState<Record<string, number>>(() => Object.fromEntries(columns.map((c) => [c.id, c.size])));
  const [sort, setSort] = React.useState<{ id: string; dir: "asc" | "desc" } | null>(null);
  const [selected, setSelected] = React.useState<Set<string>>(new Set());

  const sorted = React.useMemo(() => {
    const col = sort && columns.find((c) => c.id === sort.id);
    if (!sort || !col?.sortValue) return data;
    return [...data].sort((a, b) => {
      const av = col.sortValue!(a);
      const bv = col.sortValue!(b);
      if (av < bv) return sort.dir === "asc" ? -1 : 1;
      if (av > bv) return sort.dir === "asc" ? 1 : -1;
      return 0;
    });
  }, [data, sort, columns]);

  const allSelected = sorted.length > 0 && sorted.every((r) => selected.has(getRowId(r)));
  const someSelected = sorted.some((r) => selected.has(getRowId(r)));

  function toggle(id: string) {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  function startResize(e: React.PointerEvent, colId: string) {
    e.preventDefault();
    e.stopPropagation();
    const startX = e.clientX;
    const startSize = sizes[colId]!;
    const min = columns.find((c) => c.id === colId)?.minSize ?? 80;
    const onMove = (ev: PointerEvent) => setSizes((s) => ({ ...s, [colId]: Math.max(min, startSize + ev.clientX - startX) }));
    const onUp = () => {
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerup", onUp);
    };
    window.addEventListener("pointermove", onMove);
    window.addEventListener("pointerup", onUp);
  }

  const gridTemplate = ["36px", ...columns.map((c) => `${sizes[c.id]}px`)].join(" ");

  return (
    <div className="flex flex-col gap-3">
      {toolbar && selected.size > 0 && (
        <div className="flex items-center justify-between rounded-full bg-primary px-4 py-2 text-primary-foreground">
          <span className="text-[13px] font-medium">{selected.size} selected</span>
          <div className="flex items-center gap-2">{toolbar(Array.from(selected), () => setSelected(new Set()))}</div>
        </div>
      )}
      <div className="overflow-x-auto">
        <div style={{ minWidth: "max-content" }}>
          <div className="grid items-center rounded-md bg-primary px-1 text-primary-foreground" style={{ gridTemplateColumns: gridTemplate }}>
            <div className="flex h-11 items-center justify-center">
              <Checkbox
                variant="header"
                label="Select all rows"
                checked={someSelected ? (allSelected ? true : "indeterminate") : false}
                onChange={() =>
                  setSelected(() => (allSelected ? new Set() : new Set(sorted.map(getRowId))))
                }
              />
            </div>
            {columns.map((col) => (
              <div key={col.id} className="relative flex h-11 min-w-0 items-center gap-1 pr-3 pl-2">
                <span className="truncate text-[13px] font-semibold">{col.header}</span>
                {col.sortValue && (
                  <Menu
                    className="w-44"
                    trigger={
                      <button
                        type="button"
                        aria-label={`Sort by ${col.header}`}
                        onPointerDown={(e) => e.stopPropagation()}
                        className="ml-auto flex size-5 shrink-0 cursor-pointer items-center justify-center rounded text-primary-foreground/70 transition-colors hover:bg-white/15 hover:text-primary-foreground"
                      >
                        <MoreVertical className="size-3.5" />
                      </button>
                    }
                  >
                    <MenuItem onSelect={() => setSort({ id: col.id, dir: "asc" })}>
                      <ArrowUp className="size-3.5" /> Sort ascending
                    </MenuItem>
                    <MenuItem onSelect={() => setSort({ id: col.id, dir: "desc" })}>
                      <ArrowDown className="size-3.5" /> Sort descending
                    </MenuItem>
                    {sort?.id === col.id && <MenuItem onSelect={() => setSort(null)}>Clear sort</MenuItem>}
                  </Menu>
                )}
                <div
                  aria-hidden
                  onPointerDown={(e) => startResize(e, col.id)}
                  className="absolute top-1/2 right-1.5 h-5 w-1 -translate-y-1/2 cursor-col-resize touch-none rounded-full bg-white/40 transition-colors hover:bg-white"
                />
              </div>
            ))}
          </div>

          <div className="mt-2 flex flex-col gap-2">
            {sorted.map((row) => {
              const id = getRowId(row);
              return (
                <div key={id} className="grid items-center rounded-md bg-white px-1" style={{ gridTemplateColumns: gridTemplate }}>
                  <div className="flex h-12 items-center justify-center">
                    <Checkbox variant="row" label="Select row" checked={selected.has(id)} onChange={() => toggle(id)} />
                  </div>
                  {columns.map((col) => (
                    <div
                      key={col.id}
                      onClick={() => !col.select && !col.text && onRowClick?.(row)}
                      className={cn("flex h-12 min-w-0 items-center pr-3 pl-2 text-[13px]", onRowClick && !col.select && !col.text && "cursor-pointer")}
                    >
                      {col.select ? (
                        <Menu
                          align="start"
                          trigger={
                            <button type="button" className={EDITABLE_TRIGGER} onClick={(e) => e.stopPropagation()}>
                              <span className="min-w-0 flex-1 truncate">{col.cell(row)}</span>
                            </button>
                          }
                        >
                          {col.select.options.map((o) => (
                            <MenuItem key={o.value} disabled={o.disabled} active={o.value === col.select!.value(row)} onSelect={() => col.select!.onSave(row, o.value)}>
                              {col.select!.render(o.value, o.label)}
                            </MenuItem>
                          ))}
                        </Menu>
                      ) : col.text ? (
                        <TextCell row={row} col={col} />
                      ) : (
                        col.cell(row)
                      )}
                    </div>
                  ))}
                </div>
              );
            })}
            {sorted.length === 0 &&
              (emptyState ?? <div className="rounded-md bg-white px-4 py-10 text-center text-[13px] text-muted-foreground">No results.</div>)}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ----------------------------------------------------------- empty state */

export function EmptyRows({ title, body }: { title: string; body: string }) {
  return (
    <div className="flex flex-col items-center gap-1 rounded-md bg-white px-4 py-14 text-center">
      <div className="text-[15px] font-semibold">{title}</div>
      <p className="text-[13px] text-muted-foreground">{body}</p>
    </div>
  );
}

/* ------------------------------------------------------- sheet and dialog */

/**
 * Right-hand drawer. Positioned inside the app frame (absolute, not fixed)
 * so it opens inside the slide like it would inside the browser window.
 * Same blurred backdrop the product reserves for overlays.
 */
export function Sheet({
  open,
  onClose,
  title,
  description,
  children,
  footer,
}: {
  open: boolean;
  onClose: () => void;
  title: React.ReactNode;
  description?: React.ReactNode;
  children: React.ReactNode;
  footer?: React.ReactNode;
}) {
  const reduce = useReducedMotion();
  return (
    <AnimatePresence>
      {open && (
        <div className="absolute inset-0 z-50">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="absolute inset-0 bg-black/30 backdrop-blur-md"
            onClick={onClose}
          />
          <motion.div
            role="dialog"
            aria-modal="true"
            initial={{ x: reduce ? 0 : 40, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: reduce ? 0 : 40, opacity: 0 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="absolute top-2 right-2 bottom-2 flex w-[calc(100%-1rem)] max-w-md flex-col overflow-hidden rounded-[32px] bg-white shadow-2xl"
          >
            <div className="flex items-start justify-between gap-3 p-5 pb-3">
              <div className="min-w-0">
                <h3 className="truncate text-[17px] font-semibold">{title}</h3>
                {description && <p className="mt-0.5 text-[13px] text-muted-foreground">{description}</p>}
              </div>
              <button
                type="button"
                onClick={onClose}
                aria-label="Close"
                className="flex size-9 shrink-0 cursor-pointer items-center justify-center rounded-full bg-muted text-foreground transition-colors hover:bg-muted/70 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50"
              >
                <X className="size-4" />
              </button>
            </div>
            <div className="min-h-0 flex-1 overflow-y-auto px-5 pb-5">{children}</div>
            {footer && <div className="border-t border-border p-4">{footer}</div>}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}

export function Dialog({ open, onClose, title, description, children }: { open: boolean; onClose: () => void; title: string; description?: string; children: React.ReactNode }) {
  const reduce = useReducedMotion();
  return (
    <AnimatePresence>
      {open && (
        <div className="absolute inset-0 z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="absolute inset-0 bg-black/30 backdrop-blur-md"
            onClick={onClose}
          />
          <motion.div
            role="dialog"
            aria-modal="true"
            initial={{ opacity: 0, scale: reduce ? 1 : 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: reduce ? 1 : 0.96 }}
            transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
            className="relative w-full max-w-sm rounded-[10px] bg-white p-5 shadow-[0_8px_24px_rgba(0,0,0,.08),0_20px_48px_rgba(0,0,0,.10)]"
          >
            <h3 className="text-[16px] font-semibold">{title}</h3>
            {description && <p className="mt-1 text-[13px] text-muted-foreground">{description}</p>}
            <div className="mt-4">{children}</div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
