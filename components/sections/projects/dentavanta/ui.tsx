"use client";

import * as React from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { ArrowLeft, Bot, Search, User, X, type LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { dentavantaDeck, type AppointmentStatus, type AppointmentType, type BookedBy } from "@/content/dentavanta";

/**
 * Presentational copies of Dentavanta's own UI primitives, from the real
 * app's components/layout/page-header.tsx, components/ui/{avatar, drawer,
 * tab-button, search-input}.tsx and the calendar's shared badges. Same
 * tokens (app/globals.css): ink, paper, canvas, primary #0636a6, line,
 * muted, header-icon #3b6fe0. Flat: no box shadows, thin borders only.
 */

export const DV = {
  ink: "#0a0a0a",
  paper: "#ffffff",
  canvas: "#f1f3f8",
  primary: "#0636a6",
  primaryHover: "#052e8d",
  primarySoft: "#eaeef8",
  line: "#e6e8ec",
  muted: "#6b7280",
  headerIcon: "#3b6fe0",
};

export const FOCUS = "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0636a6]/40 focus-visible:ring-offset-1";

export const BTN_PRIMARY = cn(
  "flex h-10 shrink-0 cursor-pointer items-center gap-1.5 rounded-lg bg-[#0636a6] px-3.5 text-sm font-semibold text-white transition hover:bg-[#052e8d] disabled:cursor-not-allowed disabled:opacity-50",
  FOCUS,
);
export const BTN_SOFT = cn("flex h-10 shrink-0 cursor-pointer items-center gap-1.5 rounded-lg bg-[#f1f3f8] px-3.5 text-sm font-medium text-[#6b7280] transition hover:text-[#0a0a0a]", FOCUS);

export const INPUT = cn(
  "w-full rounded-lg border border-[#e6e8ec] bg-white px-3.5 py-2.5 text-sm text-[#0a0a0a] outline-none transition placeholder:text-[#6b7280] focus:border-[#0636a6] focus:ring-2 focus:ring-[#0636a6]/15",
);

/** Blends a #rrggbb toward white, the real app's lightenHex for stage headers. */
export function lightenHex(hex: string, amount: number): string {
  const num = parseInt(hex.replace("#", ""), 16);
  const mix = (c: number) => Math.round(c + (255 - c) * amount);
  const toHex = (n: number) => n.toString(16).padStart(2, "0");
  return `#${toHex(mix((num >> 16) & 0xff))}${toHex(mix((num >> 8) & 0xff))}${toHex(mix(num & 0xff))}`;
}

export const STATUS_COLORS: Record<AppointmentStatus, string> = { booked: "#3b82f6", completed: "#10b981", no_show: "#f59e0b", cancelled: "#ef4444" };
export const TYPE_COLORS: Record<AppointmentType, string> = {
  exam: "#3b82f6",
  cleaning: "#10b981",
  procedure: "#f59e0b",
  consultation: "#8b5cf6",
  emergency: "#ef4444",
  other: "#6b7280",
};

/* ----------------------------------------------------------------- avatar */

const PALETTE = [
  "bg-rose-200 text-rose-900",
  "bg-amber-200 text-amber-900",
  "bg-emerald-200 text-emerald-900",
  "bg-sky-200 text-sky-900",
  "bg-violet-200 text-violet-900",
  "bg-pink-200 text-pink-900",
  "bg-teal-200 text-teal-900",
  "bg-orange-200 text-orange-900",
];

function hashString(str: string) {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = (hash << 5) - hash + str.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash);
}

/** Initials on a pastel derived from the name, so a person keeps one color everywhere. */
export function Avatar({ name, size = "md" }: { name: string; size?: "sm" | "md" | "lg" }) {
  const initials =
    name
      .replace(/\./g, "")
      .trim()
      .split(/\s+/)
      .map((p) => p[0])
      .slice(0, 2)
      .join("")
      .toUpperCase() || "?";
  const sizeClass = size === "sm" ? "size-7 text-[11px]" : size === "lg" ? "size-11 text-sm" : "size-9 text-xs";
  return (
    <span aria-hidden className={cn("flex shrink-0 items-center justify-center rounded-full font-semibold", sizeClass, PALETTE[hashString(name) % PALETTE.length])}>
      {initials}
    </span>
  );
}

/* ------------------------------------------------------------ page header */

/** Icon square on the left, title and subtitle beside it, actions on the right in one h-10 row. */
export function PageHeader({ icon: Icon, title, subtitle, avatarName, onBack, children }: { icon: LucideIcon; title: string; subtitle: string; avatarName?: string; onBack?: () => void; children?: React.ReactNode }) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-4 rounded-xl bg-white p-4">
      <div className="flex min-w-0 items-stretch gap-3.5">
        {onBack ? (
          <button type="button" onClick={onBack} aria-label="Back" className={cn("flex w-11 shrink-0 cursor-pointer items-center justify-center rounded-lg bg-[#3b6fe0] text-white transition hover:bg-[#2f5bc4]", FOCUS)}>
            <ArrowLeft aria-hidden className="size-5" />
          </button>
        ) : avatarName ? (
          <Avatar name={avatarName} size="lg" />
        ) : (
          <span className="flex min-h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-[#3b6fe0] text-white">
            <Icon aria-hidden className="size-5" strokeWidth={2} />
          </span>
        )}
        <div className="flex min-w-0 flex-col justify-center">
          <h1 className="truncate text-lg font-semibold tracking-tight text-[#0a0a0a]">{title}</h1>
          <p className="truncate text-xs text-[#6b7280]">{subtitle}</p>
        </div>
      </div>
      {children && <div className="flex flex-wrap items-center gap-2">{children}</div>}
    </div>
  );
}

/** Board or List style segmented toggle in a canvas well. */
export function ViewToggle<T extends string>({ options, value, onChange }: { options: { value: T; label: string; icon?: LucideIcon }[]; value: T; onChange: (v: T) => void }) {
  return (
    <div className="flex h-10 shrink-0 items-center gap-1 rounded-lg bg-[#f1f3f8] p-1">
      {options.map((o) => {
        const Icon = o.icon;
        const active = o.value === value;
        return (
          <button
            key={o.value}
            type="button"
            onClick={() => onChange(o.value)}
            aria-pressed={active}
            className={cn("flex h-full cursor-pointer items-center gap-1.5 rounded-md px-3 text-sm font-medium transition", FOCUS, active ? "bg-white text-[#0a0a0a]" : "text-[#6b7280] hover:text-[#0a0a0a]")}
          >
            {Icon && <Icon aria-hidden className="size-4" />}
            <span className={cn(Icon && "hidden xl:inline")}>{o.label}</span>
          </button>
        );
      })}
    </div>
  );
}

export function SearchInput({ value, onChange, placeholder }: { value: string; onChange: (v: string) => void; placeholder: string }) {
  return (
    <div className="relative h-10 w-full shrink-0 sm:w-52">
      <Search aria-hidden className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-[#6b7280]" />
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        aria-label={placeholder}
        className="h-10 w-full rounded-lg border-0 bg-[#f1f3f8] pr-3 pl-9 text-sm text-[#0a0a0a] outline-none transition placeholder:text-[#6b7280] focus:bg-white focus:ring-2 focus:ring-[#0636a6]/20"
      />
    </div>
  );
}

export function TabButton({ active, onClick, children, badge }: { active: boolean; onClick: () => void; children: React.ReactNode; badge?: number }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={cn("flex cursor-pointer items-center gap-1.5 rounded-lg px-2.5 py-1 text-xs font-medium transition", FOCUS, active ? "bg-[#0636a6] text-white" : "text-[#6b7280] hover:bg-[#f1f3f8] hover:text-[#0a0a0a]")}
    >
      {children}
      {badge !== undefined && <span className={cn("flex min-w-5 items-center justify-center rounded-full px-1.5 py-0.5 text-[11px] font-semibold", active ? "bg-white/20 text-white" : "bg-[#e6e8ec] text-[#6b7280]")}>{badge}</span>}
    </button>
  );
}

/* ----------------------------------------------------------------- badges */

export function StatusBadge({ status }: { status: AppointmentStatus }) {
  return (
    <span className="inline-flex shrink-0 items-center rounded-full px-2 py-0.5 text-xs font-medium text-white" style={{ backgroundColor: STATUS_COLORS[status] }}>
      {dentavantaDeck.statusLabels[status]}
    </span>
  );
}

export function TypeBadge({ type }: { type: AppointmentType }) {
  return (
    <span className="inline-flex shrink-0 items-center rounded-full px-2 py-0.5 text-xs font-medium text-white" style={{ backgroundColor: TYPE_COLORS[type] }}>
      {dentavantaDeck.typeLabels[type]}
    </span>
  );
}

export function BookedByBadge({ bookedBy }: { bookedBy: BookedBy }) {
  const Icon = bookedBy === "ai_agent" ? Bot : User;
  return (
    <span className="inline-flex shrink-0 items-center gap-1.5 rounded-full bg-[#f1f3f8] px-2.5 py-1 text-xs font-medium text-[#0a0a0a]">
      <Icon aria-hidden className="size-3.5" />
      {dentavantaDeck.bookedByLabels[bookedBy]}
    </span>
  );
}

/* ----------------------------------------------------------------- drawer */

/** The app frame's root element, so drawers render over the whole frame, not inside a scrolled screen. */
export const FrameRootContext = React.createContext<HTMLElement | null>(null);

/**
 * The shared slide-over: a dimmed backdrop and a rounded white panel sliding
 * in from the right, with a primary colored icon/title header. Absolute, so
 * it stays inside the deck card instead of covering the page.
 */
export function Drawer({ open, onClose, icon: Icon, title, subtitle, children, footer }: { open: boolean; onClose: () => void; icon: LucideIcon; title: string; subtitle?: string; children: React.ReactNode; footer?: React.ReactNode }) {
  const reduce = useReducedMotion();
  const closeRef = React.useRef<HTMLButtonElement>(null);
  React.useEffect(() => {
    if (!open) return;
    closeRef.current?.focus();
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  const root = React.useContext(FrameRootContext);
  const content = (
    <AnimatePresence>
      {open && (
        <div className="absolute inset-0 z-[70]">
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }} className="absolute inset-0 bg-black/30" onClick={onClose} />
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-label={title}
            initial={{ x: reduce ? 0 : "105%", opacity: reduce ? 0 : 1 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: reduce ? 0 : "105%", opacity: reduce ? 0 : 1 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="absolute inset-y-3 right-3 flex w-[calc(100%-1.5rem)] max-w-md flex-col overflow-hidden rounded-2xl bg-white"
          >
            <div className="m-4 flex items-center gap-3 rounded-xl bg-[#0636a6] p-4">
              <span className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-white text-[#0636a6]">
                <Icon aria-hidden className="size-5" strokeWidth={2} />
              </span>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-semibold text-white">{title}</p>
                {subtitle && <p className="truncate text-xs text-white/70">{subtitle}</p>}
              </div>
              <button
                ref={closeRef}
                type="button"
                onClick={onClose}
                aria-label="Close"
                className="shrink-0 cursor-pointer rounded-lg p-2 text-white/80 transition hover:bg-white/15 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
              >
                <X aria-hidden className="size-5" />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto px-5 pb-5">{children}</div>
            {footer && <div className="border-t border-[#e6e8ec] p-4">{footer}</div>}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
  return root ? createPortal(content, root) : content;
}

export function DrawerSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="mt-5 first:mt-0">
      <p className="mb-2 text-xs font-semibold text-[#6b7280]">{title}</p>
      <div className="flex flex-col gap-2">{children}</div>
    </div>
  );
}

/** Three gray dots, the app's empty column marker. */
export function EmptyDots({ label }: { label: string }) {
  return (
    <div className="flex flex-1 items-center justify-center py-8" role="note" aria-label={label}>
      <div aria-hidden className="flex gap-1.5">
        <span className="size-1.5 rounded-full bg-[#e6e8ec]" />
        <span className="size-1.5 rounded-full bg-[#e6e8ec]" />
        <span className="size-1.5 rounded-full bg-[#e6e8ec]" />
      </div>
    </div>
  );
}

/** Choice chips used in the booking drawer. */
export function Chip({ active, onClick, children, color }: { active: boolean; onClick: () => void; children: React.ReactNode; color?: string }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={cn(
        "flex cursor-pointer items-center gap-1.5 rounded-lg px-3 py-2 text-xs font-medium transition",
        FOCUS,
        active ? "bg-[#0636a6] text-white" : "bg-[#f1f3f8] text-[#0a0a0a] hover:bg-[#eaeef8]",
      )}
    >
      {color && <span aria-hidden className="size-2 rounded-full" style={{ backgroundColor: active ? "#fff" : color }} />}
      {children}
    </button>
  );
}
