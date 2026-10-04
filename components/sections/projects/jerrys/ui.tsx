"use client";

import * as React from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { X, type LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import type { DemoItem } from "@/content/jerrys";

/**
 * Presentational copies of Jerry's POS primitives: the ModuleHeader (gradient
 * icon tile plus a black display title), zinc pill buttons, the catalogue's
 * photo or color label tiles, gradient initials avatars and the white modal,
 * from src/components/** in the real app. Jerry's red (#d92025) is the
 * frame's `--primary`, but like the product the UI itself runs on zinc and
 * black, with emerald for money in.
 */

export const JERRYS_RED = "#d92025";

export const FOCUS = "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-900/40 focus-visible:ring-offset-2";

/** Module gradients, straight from src/lib/modules.ts. */
export const GRADIENTS = {
  checkout: "linear-gradient(135deg, #1e1b4b 0%, #312e81 100%)",
  sales: "linear-gradient(135deg, #1d4ed8 0%, #1e40af 100%)",
  ingredients: "linear-gradient(135deg, #0d9488 0%, #059669 100%)",
  drawer: "linear-gradient(135deg, #059669 0%, #047857 100%)",
  notifications: "linear-gradient(135deg, #d97706 0%, #ea580c 100%)",
  purchaseOrders: "linear-gradient(135deg, #16a34a 0%, #15803d 100%)",
  more: "linear-gradient(135deg, #3f3f46 0%, #18181b 100%)",
} as const;

/* ---------------------------------------------------------------- buttons */

const BUTTON = cn(
  "inline-flex shrink-0 cursor-pointer items-center justify-center gap-2 font-bold whitespace-nowrap transition-all active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50 [&_svg]:shrink-0",
  FOCUS,
);
/** The product's "brand" button: near black. */
export const BTN_DARK = cn(BUTTON, "h-11 rounded-xl bg-zinc-900 px-5 text-sm text-white hover:bg-black");
/** "constructive": emerald, for anything that takes money. */
export const BTN_GO = cn(BUTTON, "h-11 rounded-xl bg-emerald-600 px-5 text-sm text-white hover:bg-emerald-700");
export const BTN_SOFT = cn(BUTTON, "h-11 rounded-xl bg-zinc-100 px-4 text-sm text-zinc-700 hover:bg-zinc-200");
export const BTN_DANGER = cn(BUTTON, "h-11 rounded-xl bg-red-600 px-4 text-sm text-white hover:bg-red-700");
/** Round icon button, zinc-100. */
export const ICON_BTN = cn(BUTTON, "size-10 rounded-full bg-zinc-100 text-zinc-600 hover:bg-zinc-200 hover:text-zinc-900");
/** Filter pills: black when on. */
export function pill(on: boolean) {
  return cn(BUTTON, "h-10 rounded-full px-4 text-sm font-semibold", on ? "bg-zinc-900 text-white" : "bg-zinc-100 text-zinc-600 hover:text-zinc-900");
}

export const INPUT = cn(
  "h-11 w-full rounded-xl border border-zinc-200 bg-zinc-50 px-3 text-sm font-medium text-zinc-900 placeholder:text-zinc-400 transition-colors focus:border-zinc-400 focus:bg-white",
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-900/10",
);

export const CARD = "rounded-2xl border border-zinc-100 bg-white";

/* ---------------------------------------------------------- module header */

/** The real ModuleHeader: gradient tile, black display title, zinc-400 subtitle, action on the right. */
export function ModuleHeader({
  icon: Icon,
  gradient,
  title,
  subtitle,
  action,
}: {
  icon: LucideIcon;
  gradient: string;
  title: string;
  subtitle?: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-3 pt-3 pb-2">
      <div className="flex min-w-0 items-center gap-3">
        <div className="flex size-10 shrink-0 items-center justify-center rounded-2xl shadow-sm" style={{ background: gradient }}>
          <Icon aria-hidden size={18} strokeWidth={2.2} className="text-white" />
        </div>
        <div className="min-w-0">
          <h1 className="jerrys-display text-[22px] leading-tight font-black text-zinc-900">{title}</h1>
          {subtitle && <p className="mt-0.5 truncate text-xs font-medium text-zinc-500">{subtitle}</p>}
        </div>
      </div>
      {action && <div className="flex min-w-0 items-center gap-2">{action}</div>}
    </div>
  );
}

/** Small zinc label above a value, the product's stat style (sentence case on this site). */
export function StatLabel({ icon: Icon, children, className }: { icon?: LucideIcon; children: React.ReactNode; className?: string }) {
  return (
    <p className={cn("flex items-center gap-1.5 text-[11px] font-semibold text-zinc-500", className)}>
      {Icon && <Icon aria-hidden size={13} />}
      {children}
    </p>
  );
}

/* ---------------------------------------------------------------- avatars */

const AVATAR_GRADIENTS = [
  "linear-gradient(135deg, #667eea, #764ba2)",
  "linear-gradient(135deg, #f093fb, #f5576c)",
  "linear-gradient(135deg, #4facfe, #00a2fe)",
  "linear-gradient(135deg, #0ba360, #3cba92)",
  "linear-gradient(135deg, #fa709a, #e9a400)",
  "linear-gradient(135deg, #a18cd1, #c26fb4)",
  "linear-gradient(135deg, #fd7950, #e6a400)",
  "linear-gradient(135deg, #30cfd0, #667eea)",
];

function hashCode(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
    hash |= 0;
  }
  return Math.abs(hash);
}

export function initialsOf(name: string): string {
  const parts = name.trim().split(/\s+/);
  if (parts.length === 1) return parts[0]!.slice(0, 2).toUpperCase();
  return (parts[0]![0]! + parts[parts.length - 1]![0]!).toUpperCase();
}

/** Gradient initials circle, like src/components/ui/Avatar.tsx. */
export function Avatar({ name, size = "sm", className }: { name: string; size?: "xs" | "sm" | "md"; className?: string }) {
  return (
    <span
      aria-hidden
      className={cn(
        "flex shrink-0 items-center justify-center rounded-full font-bold text-white",
        size === "xs" ? "size-7 text-[10px]" : size === "md" ? "size-10 text-xs" : "size-8 text-[11px]",
        className,
      )}
      style={{ background: AVATAR_GRADIENTS[hashCode(name) % AVATAR_GRADIENTS.length] }}
    >
      {initialsOf(name)}
    </span>
  );
}

/** The walk-in avatar: Jerry's own logo. */
export function WalkInMark({ className }: { className?: string }) {
  // eslint-disable-next-line @next/next/no-img-element -- product logo inside the replica
  return <img src="/ingested/jerrys/logo.jpg" alt="" className={cn("shrink-0 rounded-full object-cover", className)} />;
}

/* ------------------------------------------------------------ item icons */

/** An item's photo, or its colored label tile when it has no photo. */
export function ItemIcon({ item, className, text = "text-[11px]" }: { item: DemoItem; className?: string; text?: string }) {
  return (
    <span className={cn("relative flex shrink-0 items-center justify-center overflow-hidden", className ?? "size-10 rounded-xl")} style={{ background: item.tileBg ?? "#f4f4f5" }}>
      {item.image ? (
        // eslint-disable-next-line @next/next/no-img-element -- menu thumbnails, kept out of next/image's per-page budget
        <img src={item.image} alt="" loading="lazy" decoding="async" className="absolute inset-0 size-full object-cover" />
      ) : (
        <span className={cn("font-black", text)} style={{ color: item.labelColor ?? "#27272a" }}>
          {(item.label ?? item.name).slice(0, 2)}
        </span>
      )}
    </span>
  );
}

/* ----------------------------------------------------------------- badges */

export const BADGE = "inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-bold whitespace-nowrap";

export const LEVEL_BADGE = {
  ok: { label: "In stock", className: "bg-emerald-50 text-emerald-700" },
  low: { label: "Low", className: "bg-amber-50 text-amber-700" },
  out: { label: "Out", className: "bg-red-50 text-red-700" },
} as const;

/* ---------------------------------------------------------------- overlays */

/**
 * The product's Modal. Positioned inside the app frame (absolute, not fixed)
 * so it opens inside the slide like it would inside the browser window.
 * `size="full"` is the checkout's full screen charge sheet.
 */
export function Modal({
  open,
  onClose,
  title,
  description,
  children,
  size = "md",
  labelledBy,
}: {
  open: boolean;
  onClose: () => void;
  title?: string;
  description?: string;
  children: React.ReactNode;
  size?: "sm" | "md" | "lg" | "full";
  labelledBy?: string;
}) {
  const reduce = useReducedMotion();
  React.useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);
  const full = size === "full";
  return (
    <AnimatePresence>
      {open && (
        <div className={cn("absolute inset-0 z-50 flex items-center justify-center", full ? "p-0 sm:p-3" : "p-4")}>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="absolute inset-0 bg-black/25 backdrop-blur-sm"
            onClick={onClose}
          />
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-label={labelledBy ? undefined : title}
            aria-labelledby={labelledBy}
            initial={{ opacity: 0, scale: reduce ? 1 : 0.97, y: reduce ? 0 : 8 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: reduce ? 1 : 0.98 }}
            transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
            className={cn(
              "relative flex max-h-full w-full flex-col overflow-hidden bg-white shadow-[0_24px_64px_rgba(0,0,0,.18)]",
              full ? "h-full rounded-none sm:rounded-3xl" : "rounded-3xl",
              size === "sm" ? "max-w-sm" : size === "md" ? "max-w-md" : size === "lg" ? "max-w-2xl" : "",
            )}
          >
            {title && (
              <div className="flex shrink-0 items-start justify-between gap-3 px-5 pt-5 pb-3">
                <div className="min-w-0">
                  <h3 className="text-lg font-black text-zinc-900">{title}</h3>
                  {description && <p className="mt-0.5 text-sm text-zinc-500">{description}</p>}
                </div>
                <button type="button" onClick={onClose} aria-label="Close" className={ICON_BTN}>
                  <X aria-hidden size={18} />
                </button>
              </div>
            )}
            <div className={cn("min-h-0 flex-1 overflow-y-auto", full ? "" : title ? "px-5 pb-5" : "p-5")}>{children}</div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}

/** Form field label, Jerry's style. */
export function Field({ label, children, className }: { label: string; children: React.ReactNode; className?: string }) {
  return (
    <label className={cn("block", className)}>
      <span className="mb-1.5 block text-xs font-bold text-zinc-500">{label}</span>
      {children}
    </label>
  );
}

/** The product's NumberPad: big round keys, a stretchable grid. */
export function NumberPad({ value, onChange, className }: { value: string; onChange: (v: string) => void; className?: string }) {
  const keys = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "00", "0", "del"];
  const press = (k: string) => {
    if (k === "del") return onChange(value.slice(0, -1));
    if (value.length >= 7) return;
    if (value === "" && (k === "0" || k === "00")) return;
    onChange(value + k);
  };
  return (
    <div className={cn("grid grid-cols-3 gap-2", className)}>
      {keys.map((k) => (
        <button
          key={k}
          type="button"
          onClick={() => press(k)}
          aria-label={k === "del" ? "Delete digit" : undefined}
          className={cn(
            "flex h-full min-h-12 cursor-pointer items-center justify-center rounded-full text-xl font-black transition-colors active:scale-95 xl:rounded-2xl",
            FOCUS,
            k === "del" ? "bg-zinc-100 text-zinc-500 hover:bg-zinc-200" : "bg-zinc-50 text-zinc-900 hover:bg-zinc-100",
          )}
        >
          {k === "del" ? <X aria-hidden size={20} /> : k}
        </button>
      ))}
    </div>
  );
}

/** Rounded switch for the automations list. */
export function Switch({ on, onChange, label, disabled }: { on: boolean; onChange: () => void; label: string; disabled?: boolean }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={on}
      aria-label={label}
      disabled={disabled}
      onClick={onChange}
      className={cn(
        "relative inline-flex h-6 w-11 shrink-0 cursor-pointer items-center rounded-full transition-colors disabled:cursor-not-allowed",
        FOCUS,
        on ? "bg-emerald-600" : "bg-zinc-300",
        disabled && "opacity-70",
      )}
    >
      <span className={cn("inline-block size-5 rounded-full bg-white shadow transition-transform", on ? "translate-x-5.5" : "translate-x-0.5")} />
    </button>
  );
}
