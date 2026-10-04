"use client";

import * as React from "react";
import Link from "next/link";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import {
  Anchor,
  ArrowRight,
  CalendarDays,
  Check,
  ChevronsUpDown,
  CircleHelp,
  Code2,
  FileSearch,
  Globe,
  Inbox,
  LayoutDashboard,
  LogOut,
  Mail,
  PanelLeftClose,
  PanelLeftOpen,
  PhoneCall,
  Receipt,
  Sailboat,
  ScanLine,
  Settings,
  Share2,
  ShoppingCart,
  TrendingUp,
  Users,
  X,
  type LucideIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { yettiGeist } from "@/lib/project-fonts";
import { yettiDeck } from "@/content/yetti";
import { useStore } from "./store";
import { FOCUS, YETTI_BLUE } from "./ui";

export type ScreenId = "dashboard" | "inbox" | "booking" | "checkin" | "crm";

type NavItem = { id: string; label: string; icon: LucideIcon; screen?: ScreenId };

// Same labels and icons as MODULE_NAV in DashboardShell.tsx, for a workspace
// with these modules switched on.
const MODULES: NavItem[] = [
  { id: "inbox", label: "Inbox", icon: Inbox, screen: "inbox" },
  { id: "booking", label: "Booking", icon: CalendarDays, screen: "booking" },
  { id: "checkin", label: "Check-in", icon: ScanLine, screen: "checkin" },
  { id: "crm", label: "CRM", icon: Users, screen: "crm" },
  { id: "rental", label: "Rental", icon: Sailboat },
  { id: "captain", label: "Captain", icon: Anchor },
  { id: "widgets", label: "Widgets", icon: Code2 },
  { id: "otas", label: "OTAs", icon: Globe },
  { id: "pos", label: "Point of Sale", icon: ShoppingCart },
  { id: "affiliates", label: "Affiliates", icon: Share2 },
  { id: "campaigns", label: "Campaigns", icon: Mail },
  { id: "voice", label: "Voice Agents", icon: PhoneCall },
  { id: "inspect", label: "Property Inspect", icon: FileSearch },
  { id: "invoicing", label: "Invoicing", icon: Receipt },
  { id: "seo", label: "SEO & Analytics", icon: TrendingUp },
];
const DASHBOARD: NavItem = { id: "dashboard", label: "Dashboard", icon: LayoutDashboard, screen: "dashboard" };

/**
 * Yetti's light slate tokens, scoped to the frame so the replica renders in
 * the product's own system instead of the Growtk site's. --primary is the
 * product's brand blue (its globals.css maps sky-500 to #2d6695).
 */
function frameTokens(): React.CSSProperties {
  return {
    "--primary": YETTI_BLUE,
    "--primary-foreground": "#ffffff",
    "--ring": YETTI_BLUE,
    "--background": "#ffffff",
    "--foreground": "#0f172a",
    "--card": "#ffffff",
    "--card-foreground": "#0f172a",
    "--popover": "#ffffff",
    "--muted": "#f1f5f9",
    "--muted-foreground": "#64748b",
    "--accent": "#f1f5f9",
    "--accent-foreground": "#0f172a",
    "--border": "#e2e8f0",
    "--input": "#e2e8f0",
    fontFamily: "var(--font-yetti), Arial, Helvetica, sans-serif",
  } as React.CSSProperties;
}

function NavLink({ item, active, collapsed, onClick, badge }: { item: NavItem; active: boolean; collapsed: boolean; onClick: () => void; badge?: number }) {
  const Icon = item.icon;
  return (
    <button
      type="button"
      onClick={onClick}
      title={collapsed ? item.label : undefined}
      aria-label={collapsed ? item.label : undefined}
      aria-current={active ? "page" : undefined}
      className={cn(
        "group flex w-full shrink-0 cursor-pointer items-center transition-colors",
        FOCUS,
        collapsed ? "mx-auto size-10 justify-center rounded-full" : "gap-3 rounded-md px-2 py-2",
        active ? "bg-sky-50 text-primary" : "text-slate-600 hover:bg-slate-50 hover:text-slate-900",
      )}
    >
      <Icon aria-hidden className={cn("size-5 shrink-0", active ? "text-primary" : "text-slate-400 group-hover:text-slate-600")} />
      {!collapsed && (
        <>
          <span className="flex-1 truncate text-left text-sm font-medium">{item.label}</span>
          {badge ? (
            <span className="rounded-full bg-primary px-1.5 py-px text-[10px] font-bold text-white tabular-nums">{badge}</span>
          ) : active ? (
            <span aria-hidden className="size-1.5 rounded-full bg-primary" />
          ) : null}
        </>
      )}
    </button>
  );
}

function Wordmark() {
  return (
    <span className="text-lg font-extrabold tracking-tight">
      <span className="text-slate-900">Yetti</span>
      <span className="text-primary">.ai</span>
    </span>
  );
}

export function AppFrame({ screen, onNavigate, children }: { screen: ScreenId; onNavigate: (screen: ScreenId) => void; children: React.ReactNode }) {
  const { toasts, askWalkthrough, conversations } = useStore();
  const reduce = useReducedMotion();
  const [collapsed, setCollapsed] = React.useState(false);
  const unread = conversations.reduce((n, c) => n + c.unread, 0);

  const open = (item: NavItem) => (item.screen ? onNavigate(item.screen) : askWalkthrough(item.label));
  const mobileItems = [DASHBOARD, ...MODULES.filter((m) => m.screen)];

  return (
    <div className={cn(yettiGeist.variable, "absolute inset-0 overflow-hidden bg-slate-50 text-slate-900 antialiased")} style={frameTokens()}>
      {/* Desktop sidebar: white, ruled off from the content like the product. */}
      <nav
        aria-label="Yetti"
        className={cn(
          "absolute top-0 bottom-0 left-0 z-20 hidden flex-col border-r border-slate-200 bg-white transition-[width] duration-200 md:flex",
          collapsed ? "w-16" : "w-60",
        )}
      >
        <div className={cn("flex h-14 shrink-0 items-center gap-3 border-b border-slate-100", collapsed ? "justify-center" : "px-4")}>
          {/* eslint-disable-next-line @next/next/no-img-element -- product logo inside the replica */}
          <img src={yettiDeck.logo.src} alt={collapsed ? yettiDeck.logo.alt : ""} className="size-8 object-contain" />
          {!collapsed && <Wordmark />}
        </div>

        {/* Workspace switcher. */}
        <div className="shrink-0 border-b border-slate-100 p-2">
          <button
            type="button"
            onClick={() => askWalkthrough("Switching workspaces")}
            className={cn(
              "flex w-full cursor-pointer items-center rounded-md px-2 py-2 text-xs font-semibold text-slate-700 transition-colors hover:bg-slate-50",
              FOCUS,
              collapsed ? "justify-center" : "gap-2",
            )}
            aria-label={collapsed ? yettiDeck.workspaceName : undefined}
          >
            <span className="flex size-7 shrink-0 items-center justify-center rounded-full bg-primary text-[11px] font-bold text-white">{yettiDeck.workspaceInitials}</span>
            {!collapsed && (
              <>
                <span className="flex-1 truncate text-left">{yettiDeck.workspaceName}</span>
                <ChevronsUpDown aria-hidden className="size-3.5 text-slate-400" />
              </>
            )}
          </button>
        </div>

        <div className="flex min-h-0 flex-1 flex-col gap-0.5 overflow-x-hidden overflow-y-auto px-2 py-4">
          {!collapsed && <p className="mb-1 px-2 text-[11px] font-semibold text-slate-400">Overview</p>}
          <NavLink item={DASHBOARD} active={screen === "dashboard"} collapsed={collapsed} onClick={() => open(DASHBOARD)} />
          {collapsed ? <div className="my-3 border-t border-slate-100" /> : <p className="mt-5 mb-1 px-2 text-[11px] font-semibold text-slate-400">Modules</p>}
          {MODULES.map((item) => (
            <NavLink
              key={item.id}
              item={item}
              active={item.screen === screen}
              collapsed={collapsed}
              onClick={() => open(item)}
              badge={item.id === "inbox" && screen !== "inbox" ? unread : undefined}
            />
          ))}
        </div>

        <div className="shrink-0 border-t border-slate-100 p-2">
          <div className={cn("flex items-center", collapsed ? "flex-col gap-1" : "gap-1")}>
            {!collapsed && (
              <>
                <button type="button" onClick={() => askWalkthrough("The help center")} className={cn("flex cursor-pointer items-center gap-1.5 rounded-md px-2 py-1.5 text-xs font-medium text-slate-500 hover:bg-slate-50 hover:text-slate-800", FOCUS)}>
                  <CircleHelp aria-hidden className="size-3.5" />
                  Help
                </button>
                <button type="button" onClick={() => askWalkthrough("Workspace settings")} className={cn("flex cursor-pointer items-center gap-1.5 rounded-md px-2 py-1.5 text-xs font-medium text-slate-500 hover:bg-slate-50 hover:text-slate-800", FOCUS)}>
                  <Settings aria-hidden className="size-3.5" />
                  Settings
                </button>
              </>
            )}
            <button
              type="button"
              onClick={() => setCollapsed((c) => !c)}
              aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
              title={collapsed ? "Expand sidebar" : "Collapse sidebar"}
              className={cn("ml-auto flex size-8 cursor-pointer items-center justify-center rounded-lg text-slate-400 hover:bg-slate-100 hover:text-slate-700", FOCUS, collapsed && "mx-auto")}
            >
              {collapsed ? <PanelLeftOpen className="size-4" /> : <PanelLeftClose className="size-4" />}
            </button>
          </div>
          <div className={cn("mt-1 flex items-center gap-2.5 rounded-md px-2 py-2", collapsed && "justify-center")}>
            <span title={yettiDeck.userName} className="flex size-8 shrink-0 items-center justify-center rounded-full bg-primary text-xs font-bold text-white">
              MS
            </span>
            {!collapsed && (
              <>
                <span className="min-w-0 flex-1">
                  <span className="block truncate text-xs font-semibold text-slate-900">{yettiDeck.userName}</span>
                  <span className="block truncate text-[11px] text-slate-500">{yettiDeck.userEmail}</span>
                </span>
                <LogOut aria-hidden className="size-4 text-slate-400" />
              </>
            )}
          </div>
        </div>
      </nav>

      {/* Mobile: the product's top bar (logo left, module center), plus pill
          tabs. pl-16 leaves room for the deck's own menu button. */}
      <div className="absolute inset-x-0 top-0 z-20 md:hidden">
        <div className="flex h-14 items-center gap-2 border-b border-slate-200 bg-white pr-4 pl-16">
          {/* eslint-disable-next-line @next/next/no-img-element -- product logo inside the replica */}
          <img src={yettiDeck.logo.src} alt="" className="size-7 object-contain" />
          <Wordmark />
        </div>
        <div className="flex h-12 items-center gap-1 overflow-x-auto border-b border-slate-200 bg-white px-2">
          {mobileItems.map((item) => {
            const Icon = item.icon;
            const active = item.screen === screen;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => open(item)}
                className={cn(
                  "flex shrink-0 cursor-pointer items-center gap-1.5 rounded-full px-3 py-1.5 text-[13px] font-medium",
                  FOCUS,
                  active ? "bg-sky-50 font-semibold text-primary" : "text-slate-500",
                )}
              >
                <Icon aria-hidden className="size-4" />
                {item.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Content. */}
      <main
        className={cn(
          "absolute inset-x-0 top-26 bottom-0 overflow-y-auto bg-slate-50 transition-[left] duration-200 md:top-0",
          collapsed ? "md:left-16" : "md:left-60",
        )}
      >
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={screen}
            initial={{ opacity: 0, y: reduce ? 0 : 8 }}
            animate={{ opacity: 1, y: 0, transition: { duration: 0.3, ease: [0.22, 1, 0.36, 1] } }}
            exit={{ opacity: 0, transition: { duration: 0.15 } }}
            className="relative min-h-full"
          >
            {children}
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Toaster, bottom right like the product's sonner placement. */}
      <div aria-live="polite" className="pointer-events-none absolute right-4 bottom-4 z-[80] flex w-80 max-w-[calc(100%-2rem)] flex-col gap-2">
        <AnimatePresence>
          {toasts.map((t) => (
            <motion.div
              key={t.id}
              layout
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 6 }}
              transition={{ duration: 0.25 }}
              className="flex gap-3 rounded-xl border border-slate-200 bg-white px-4 py-3 shadow-[0_8px_24px_rgba(15,23,42,.08),0_20px_48px_rgba(15,23,42,.10)]"
            >
              <span className="mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full bg-emerald-500 text-white">
                <Check aria-hidden className="size-3" strokeWidth={3} />
              </span>
              <span>
                <span className="block text-[13px] font-semibold text-slate-900">{t.title}</span>
                {t.description && <span className="mt-0.5 block text-[12.5px] text-slate-500">{t.description}</span>}
              </span>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      <WalkthroughModal />
    </div>
  );
}

/** Centered "this is in the full product" modal, shown for anything outside the demo. */
function WalkthroughModal() {
  const { walkthrough, closeWalkthrough } = useStore();
  const reduce = useReducedMotion();
  const copy = yettiDeck.walkthrough;
  const primaryRef = React.useRef<HTMLAnchorElement>(null);

  React.useEffect(() => {
    if (!walkthrough) return;
    primaryRef.current?.focus();
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && closeWalkthrough();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [walkthrough, closeWalkthrough]);

  return (
    <AnimatePresence>
      {walkthrough && (
        <div className="absolute inset-0 z-[85] flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="absolute inset-0 bg-slate-900/30 backdrop-blur-md"
            onClick={closeWalkthrough}
          />
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-labelledby="yetti-walkthrough-title"
            initial={{ opacity: 0, y: reduce ? 0 : 16, scale: reduce ? 1 : 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: reduce ? 0 : 8, scale: reduce ? 1 : 0.98 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="relative w-full max-w-md overflow-hidden rounded-3xl bg-white shadow-[0_8px_24px_rgba(15,23,42,.08),0_24px_64px_rgba(15,23,42,.18)]"
          >
            {/* Header band in the product's blue, with the mascot peeking in. */}
            <div className="relative h-28 overflow-hidden bg-primary">
              <div aria-hidden className="absolute -top-16 -right-10 size-56 rounded-full bg-white/10" />
              <div aria-hidden className="absolute -bottom-20 left-10 size-40 rounded-full bg-white/5" />
              <button
                type="button"
                onClick={closeWalkthrough}
                aria-label="Close"
                className="absolute top-3 right-3 flex size-9 cursor-pointer items-center justify-center rounded-full bg-white/90 text-slate-900 transition-colors hover:bg-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
              >
                <X aria-hidden className="size-4" />
              </button>
            </div>

            <span className="absolute top-19 left-6 z-10 flex size-16 items-center justify-center rounded-2xl bg-white shadow-[0_6px_20px_rgba(15,23,42,.14)]">
              {/* eslint-disable-next-line @next/next/no-img-element -- product mark */}
              <img src={yettiDeck.logo.src} alt="" className="size-11 object-contain" />
            </span>

            <div className="px-6 pt-11 pb-6">
              <p className="text-[12.5px] font-semibold text-primary">{copy.eyebrow}</p>
              <h3 id="yetti-walkthrough-title" className="mt-1 text-[21px] leading-tight font-bold text-balance text-slate-900">
                {copy.title.replace("{feature}", walkthrough)}
              </h3>
              <p className="mt-2 text-[14px] leading-relaxed text-slate-500">{copy.body}</p>
              <ul className="mt-4 flex flex-col gap-2">
                {copy.points.map((point) => (
                  <li key={point} className="flex items-center gap-2.5 text-[13.5px] text-slate-700">
                    <span className="flex size-5 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                      <Check aria-hidden className="size-3" strokeWidth={3} />
                    </span>
                    {point}
                  </li>
                ))}
              </ul>
              <div className="mt-6 flex flex-col gap-2">
                <Link
                  ref={primaryRef}
                  href={copy.primary.href}
                  className="inline-flex h-12 cursor-pointer items-center justify-center gap-2 rounded-full bg-primary px-5 text-[14.5px] font-semibold text-white transition hover:bg-[#25577f] focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-primary/40"
                >
                  {copy.primary.label}
                  <ArrowRight aria-hidden className="size-4" />
                </Link>
                <button
                  type="button"
                  onClick={closeWalkthrough}
                  className="h-11 cursor-pointer rounded-full text-[14px] font-medium text-slate-500 transition-colors hover:bg-slate-100 hover:text-slate-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40"
                >
                  {copy.secondary}
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
