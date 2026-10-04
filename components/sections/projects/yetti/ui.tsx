"use client";

import * as React from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { MessageSquare, X, type LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import type { BookingSource, BookingStatus, PaymentStatus, Platform } from "@/content/yetti";

/**
 * Presentational copies of Yetti's own UI: the module header (icon tile,
 * title, subtitle, stat chips), the underlined module tabs, slate cards and
 * pill buttons from app/dashboard/**. The product's `sky-500` is its brand
 * navy (#2d6695), so `bg-primary` inside the frame is that color.
 */

/** Yetti's brand blue and its lighter accent, from the product's globals.css. */
export const YETTI_BLUE = "#2d6695";
export const YETTI_ACCENT = "#68b4e4";

/* --------------------------------------------------------------- surfaces */

export const CARD = "rounded-2xl border border-slate-200 bg-white";

export const FOCUS = "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 focus-visible:ring-offset-1";

/* ---------------------------------------------------------------- buttons */

const BUTTON = cn(
  "inline-flex shrink-0 cursor-pointer items-center justify-center gap-2 rounded-full text-sm font-semibold whitespace-nowrap transition-colors disabled:cursor-not-allowed disabled:opacity-50 [&_svg]:size-4 [&_svg]:shrink-0",
  FOCUS,
);
export const BTN_PRIMARY = cn(BUTTON, "h-10 bg-primary px-5 text-white hover:bg-[#25577f]");
export const BTN_DARK = cn(BUTTON, "h-10 bg-slate-800 px-5 text-white hover:bg-slate-900");
export const BTN_OUTLINE = cn(BUTTON, "h-10 border border-slate-200 bg-white px-4 text-slate-700 hover:bg-slate-50");
export const BTN_GHOST = cn(BUTTON, "h-9 px-3 font-medium text-slate-600 hover:bg-slate-100 hover:text-slate-900");

export const INPUT = cn(
  "h-10 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 text-sm text-slate-900 placeholder:text-slate-400 transition-colors focus:border-primary focus:bg-white",
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/20",
);

/* ---------------------------------------------------------- module header */

export type HeaderStat = { icon: LucideIcon; value: React.ReactNode; label: string; tone: "blue" | "green" | "amber" | "violet" };

const STAT_TONES: Record<HeaderStat["tone"], { tile: string; value: string }> = {
  blue: { tile: "bg-sky-50 text-primary", value: "text-primary" },
  green: { tile: "bg-emerald-50 text-emerald-600", value: "text-emerald-700" },
  amber: { tile: "bg-amber-50 text-amber-600", value: "text-amber-700" },
  violet: { tile: "bg-violet-50 text-violet-600", value: "text-violet-700" },
};

/** Icon tile, title and subtitle, with optional stat chips on the right. */
export function ModuleHeader({ icon: Icon, title, subtitle, stats }: { icon: LucideIcon; title: string; subtitle: string; stats?: HeaderStat[] }) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-4 px-4 pt-5 pb-4 sm:px-6">
      <div className="flex min-w-0 items-center gap-4">
        <div className="flex size-12 shrink-0 items-center justify-center rounded-2xl bg-primary">
          <Icon aria-hidden className="size-6 text-white" />
        </div>
        <div className="min-w-0">
          <h1 className="text-xl font-bold tracking-tight text-slate-900">{title}</h1>
          <p className="mt-0.5 truncate text-sm text-slate-500">{subtitle}</p>
        </div>
      </div>
      {stats && (
        <div className="hidden gap-2 lg:flex">
          {stats.map((s) => {
            const tone = STAT_TONES[s.tone];
            return (
              <div key={s.label} className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-white py-2 pr-5 pl-2.5">
                <span className={cn("flex size-9 items-center justify-center rounded-xl", tone.tile)}>
                  <s.icon aria-hidden className="size-4" />
                </span>
                <span>
                  <span className={cn("block text-lg leading-none font-bold tabular-nums", tone.value)}>{s.value}</span>
                  <span className="mt-1 block text-[11px] text-slate-500">{s.label}</span>
                </span>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export type TabDef<T extends string> = { id: T; label: string; icon: LucideIcon; count?: number };

/** Underlined module tabs. Tabs without a screen in the demo call `onUnavailable`. */
export function ModuleTabs<T extends string>({
  tabs,
  active,
  onChange,
}: {
  tabs: TabDef<T>[];
  active: T;
  onChange: (id: T) => void;
}) {
  return (
    <div className="border-b border-slate-200 px-4 sm:px-6">
      <div role="tablist" className="-mb-px flex gap-1 overflow-x-auto">
        {tabs.map((t) => {
          const on = t.id === active;
          return (
            <button
              key={t.id}
              type="button"
              role="tab"
              aria-selected={on}
              onClick={() => onChange(t.id)}
              className={cn(
                "flex shrink-0 cursor-pointer items-center gap-2 border-b-2 px-3 py-3 text-sm font-medium transition-colors",
                FOCUS,
                on ? "border-primary text-primary" : "border-transparent text-slate-500 hover:text-slate-800",
              )}
            >
              <t.icon aria-hidden className="size-4" />
              {t.label}
              {t.count !== undefined && <span className="rounded-full bg-slate-100 px-1.5 py-px text-[11px] font-semibold text-slate-500 tabular-nums">{t.count}</span>}
            </button>
          );
        })}
      </div>
    </div>
  );
}

/* ---------------------------------------------------------------- avatars */

const PASTELS = [
  "bg-cyan-100 text-cyan-700",
  "bg-rose-100 text-rose-700",
  "bg-violet-100 text-violet-700",
  "bg-amber-100 text-amber-700",
  "bg-emerald-100 text-emerald-700",
  "bg-sky-100 text-sky-700",
  "bg-pink-100 text-pink-700",
  "bg-teal-100 text-teal-700",
] as const;

function hashString(value: string): number {
  let hash = 0;
  for (let i = 0; i < value.length; i++) hash = (hash * 31 + value.charCodeAt(i)) >>> 0;
  return hash;
}

export function initialsOf(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "?";
  if (parts.length === 1) return parts[0]!.slice(0, 2).toUpperCase();
  return (parts[0]![0]! + parts[parts.length - 1]![0]!).toUpperCase();
}

/** The CRM's rounded-square initials tile. */
export function InitialsTile({ name, size = "md", className }: { name: string; size?: "sm" | "md" | "lg"; className?: string }) {
  return (
    <span
      aria-hidden
      className={cn(
        "flex shrink-0 items-center justify-center rounded-lg font-semibold",
        size === "sm" ? "size-7 text-[10px]" : size === "lg" ? "size-12 rounded-xl text-sm" : "size-9 text-[11px]",
        PASTELS[hashString(name) % PASTELS.length],
        className,
      )}
    >
      {initialsOf(name)}
    </span>
  );
}

/* -------------------------------------------------------------- platforms */

export const PLATFORM_LABEL: Record<Platform, string> = {
  whatsapp: "WhatsApp",
  instagram: "Instagram",
  messenger: "Messenger",
  telegram: "Telegram",
  gmail: "Email",
  sms: "SMS",
};

const PLATFORM_ICON: Partial<Record<Platform, string>> = {
  whatsapp: "/ingested/yetti/channels/whatsapp.png",
  instagram: "/ingested/yetti/channels/instagram.png",
  messenger: "/ingested/yetti/channels/messenger.png",
  telegram: "/ingested/yetti/channels/telegram.png",
  gmail: "/ingested/yetti/channels/gmail.svg",
};

/** The channel's own logo, like the inbox's PlatformBadge. */
export function PlatformIcon({ platform, className }: { platform: Platform; className?: string }) {
  const src = PLATFORM_ICON[platform];
  if (!src) {
    return (
      <span aria-label={PLATFORM_LABEL[platform]} role="img" className={cn("flex items-center justify-center rounded-full bg-emerald-500 text-white", className)}>
        <MessageSquare aria-hidden className="size-[60%]" />
      </span>
    );
  }
  // eslint-disable-next-line @next/next/no-img-element -- tiny channel glyphs, kept out of next/image's per-page budget
  return <img src={src} alt={PLATFORM_LABEL[platform]} className={cn("object-contain", className)} />;
}

/* ----------------------------------------------------------------- badges */

export const BADGE = "inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-semibold whitespace-nowrap";

export const STATUS_BADGE: Record<BookingStatus, string> = {
  confirmed: "bg-emerald-50 text-emerald-700",
  pending: "bg-amber-50 text-amber-700",
  cancelled: "bg-slate-100 text-slate-500",
};

export const PAYMENT_BADGE: Record<PaymentStatus, { label: string; className: string }> = {
  paid: { label: "Paid", className: "bg-emerald-50 text-emerald-700" },
  deposit: { label: "Deposit", className: "bg-sky-50 text-sky-700" },
  unpaid: { label: "Unpaid", className: "bg-rose-50 text-rose-700" },
};

export function SourceBadge({ source }: { source: BookingSource }) {
  return <span className={cn(BADGE, source === "AI inbox" ? "bg-primary/10 text-primary" : "bg-slate-100 text-slate-600")}>{source}</span>;
}

export const formatMoney = (n: number) => new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(n);

/* ---------------------------------------------------------------- overlays */

/**
 * Right-hand drawer. Positioned inside the app frame (absolute, not fixed)
 * so it opens inside the slide like it would inside the browser window.
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
  React.useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);
  return (
    <AnimatePresence>
      {open && (
        <div className="absolute inset-0 z-50">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="absolute inset-0 bg-slate-900/30 backdrop-blur-sm"
            onClick={onClose}
          />
          <motion.div
            role="dialog"
            aria-modal="true"
            initial={{ x: reduce ? 0 : 40, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: reduce ? 0 : 40, opacity: 0 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="absolute top-0 right-0 bottom-0 flex w-full max-w-md flex-col overflow-hidden border-l border-slate-200 bg-white shadow-2xl"
          >
            <div className="flex items-start justify-between gap-3 border-b border-slate-100 p-5">
              <div className="min-w-0">
                <h3 className="truncate text-base font-bold text-slate-900">{title}</h3>
                {description && <p className="mt-0.5 text-[13px] text-slate-500">{description}</p>}
              </div>
              <button
                type="button"
                onClick={onClose}
                aria-label="Close"
                className={cn("flex size-8 shrink-0 cursor-pointer items-center justify-center rounded-lg text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-900", FOCUS)}
              >
                <X className="size-4" />
              </button>
            </div>
            <div className="min-h-0 flex-1 overflow-y-auto p-5">{children}</div>
            {footer && <div className="border-t border-slate-100 p-4">{footer}</div>}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}

export function Dialog({
  open,
  onClose,
  title,
  description,
  children,
  wide,
}: {
  open: boolean;
  onClose: () => void;
  title: string;
  description?: string;
  children: React.ReactNode;
  wide?: boolean;
}) {
  const reduce = useReducedMotion();
  React.useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);
  return (
    <AnimatePresence>
      {open && (
        <div className="absolute inset-0 z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="absolute inset-0 bg-slate-900/30 backdrop-blur-sm"
            onClick={onClose}
          />
          <motion.div
            role="dialog"
            aria-modal="true"
            initial={{ opacity: 0, scale: reduce ? 1 : 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: reduce ? 1 : 0.96 }}
            transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
            className={cn("relative max-h-full w-full overflow-y-auto rounded-2xl bg-white p-6 shadow-2xl", wide ? "max-w-lg" : "max-w-sm")}
          >
            <button
              type="button"
              onClick={onClose}
              aria-label="Close"
              className={cn("absolute top-4 right-4 flex size-8 cursor-pointer items-center justify-center rounded-lg text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-900", FOCUS)}
            >
              <X className="size-4" />
            </button>
            <h3 className="pr-8 text-lg font-bold text-slate-900">{title}</h3>
            {description && <p className="mt-1 text-sm text-slate-500">{description}</p>}
            <div className="mt-5">{children}</div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}

/** Form field label, Yetti style (small, slate, semibold). */
export function Field({ label, children, className }: { label: string; children: React.ReactNode; className?: string }) {
  return (
    <label className={cn("block", className)}>
      <span className="mb-1.5 block text-xs font-semibold text-slate-500">{label}</span>
      {children}
    </label>
  );
}
