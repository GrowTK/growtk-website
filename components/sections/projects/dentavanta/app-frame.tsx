"use client";

import * as React from "react";
import Link from "next/link";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import {
  ArrowRight,
  BellRing,
  Bot,
  CalendarDays,
  Check,
  CheckSquare,
  ChevronLeft,
  ChevronsUpDown,
  Clock,
  Home,
  Link2,
  Mail,
  Megaphone,
  MessagesSquare,
  Settings,
  SlidersHorizontal,
  Star,
  Stethoscope,
  StickyNote,
  Users,
  Workflow,
  X,
  type LucideIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { yettiGeist as geist } from "@/lib/project-fonts";
import { dentavantaDeck } from "@/content/dentavanta";
import { useStore } from "./store";
import { FrameRootContext } from "./ui";

export type ScreenId = "dashboard" | "leads" | "calendar" | "conversations" | "patients";

type NavItem = { label: string; icon: LucideIcon; screen?: ScreenId };

// Same labels, icons and order as NAV_ITEMS in the real components/layout/sidebar.tsx.
const NAV: NavItem[] = [
  { label: "Home", icon: Home, screen: "dashboard" },
  { label: "Leads", icon: Users, screen: "leads" },
  { label: "Patients", icon: Stethoscope, screen: "patients" },
  { label: "Conversations", icon: MessagesSquare, screen: "conversations" },
  { label: "Calendar", icon: CalendarDays, screen: "calendar" },
  { label: "External Tracking", icon: Link2 },
  { label: "Automations", icon: Workflow },
  { label: "Integrations", icon: Mail },
  { label: "Marketing", icon: Megaphone },
  { label: "Reputation", icon: Star },
  { label: "Notes", icon: StickyNote },
  { label: "Tasks", icon: CheckSquare },
  { label: "Reminders", icon: BellRing },
  { label: "Custom Fields", icon: SlidersHorizontal },
  { label: "Agents", icon: Bot },
  { label: "Settings", icon: Settings },
];

const SIDEBAR_FOCUS = "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/80";

export function AppFrame({ screen, onNavigate, children }: { screen: ScreenId; onNavigate: (screen: ScreenId) => void; children: React.ReactNode }) {
  const { toasts, askWalkthrough, leads } = useStore();
  const reduce = useReducedMotion();
  const [collapsed, setCollapsed] = React.useState(false);
  const [root, setRoot] = React.useState<HTMLDivElement | null>(null);
  const newLeads = leads.filter((l) => l.stageId === "new").length;
  const d = dentavantaDeck;

  const open = (item: NavItem) => (item.screen ? onNavigate(item.screen) : askWalkthrough(item.label));
  const initials = d.userName
    .replace("Dr. ", "")
    .split(" ")
    .map((p) => p[0])
    .join("");

  return (
    <FrameRootContext.Provider value={root}>
    <div
      ref={setRoot}
      className={cn(geist.variable, "absolute inset-0 flex gap-4 overflow-hidden bg-[#f1f3f8] p-0 text-[#0a0a0a] antialiased md:p-4")}
      style={{ fontFamily: "var(--font-yetti), Arial, Helvetica, sans-serif" }}
    >
      {/* Desktop sidebar: the product's rounded gradient panel with frosted nav. */}
      <nav
        aria-label="Dentavanta"
        className={cn("relative hidden h-full shrink-0 flex-col justify-between overflow-hidden rounded-2xl bg-[#3364b0] p-3 text-white transition-[width] duration-200 md:flex", collapsed ? "w-19" : "w-60")}
        style={{ backgroundImage: `url(${d.sidebarImage})`, backgroundSize: "cover", backgroundPosition: "center" }}
      >
        <div aria-hidden className="pointer-events-none absolute inset-0 backdrop-blur-md" />
        <div className="relative z-10 flex min-h-0 flex-col">
          <div className={cn("flex items-center gap-2.5 px-2 py-3", collapsed && "justify-center")}>
            {/* eslint-disable-next-line @next/next/no-img-element -- product mark inside the replica */}
            <img src={d.logo.markWhite} alt={collapsed ? d.logo.alt : ""} className="h-6 w-auto" />
            {!collapsed && <span className="text-lg font-semibold tracking-tight text-white">Dentavanta</span>}
          </div>
          <div className="mt-3 flex min-h-0 flex-col gap-1 overflow-y-auto">
            {NAV.map((item) => {
              const active = item.screen === screen;
              const Icon = item.icon;
              const badge = item.screen === "leads" && screen !== "leads" && newLeads > 0 ? newLeads : undefined;
              return (
                <button
                  key={item.label}
                  type="button"
                  onClick={() => open(item)}
                  title={collapsed ? item.label : undefined}
                  aria-label={collapsed ? item.label : undefined}
                  aria-current={active ? "page" : undefined}
                  className={cn(
                    "flex w-full shrink-0 cursor-pointer items-center gap-3 rounded-xl px-3 py-2 text-sm font-medium transition",
                    SIDEBAR_FOCUS,
                    active ? "bg-white text-[#0636a6]" : "text-white/80 hover:bg-white/10 hover:text-white",
                    collapsed && "justify-center",
                  )}
                >
                  <Icon aria-hidden className="size-4.5 shrink-0" strokeWidth={2} />
                  {!collapsed && <span className="flex-1 truncate text-left">{item.label}</span>}
                  {!collapsed && badge && <span className="rounded-full bg-white px-1.5 py-px text-[10px] font-bold text-[#0636a6] tabular-nums">{badge}</span>}
                </button>
              );
            })}
          </div>
        </div>

        <div className="relative z-10 mt-3 shrink-0">
          <button
            type="button"
            onClick={() => askWalkthrough("Workspace time and quiet hours")}
            title={collapsed ? "Time and timezone" : undefined}
            aria-label={collapsed ? "Time and timezone" : undefined}
            className={cn("mb-2 flex w-full cursor-pointer items-center gap-2.5 rounded-xl bg-white/10 px-2 py-2 text-left text-sm font-medium text-white/85 transition hover:bg-white/15", SIDEBAR_FOCUS, collapsed && "justify-center")}
          >
            <Clock aria-hidden className="size-4.5 shrink-0" />
            {!collapsed && <span className="truncate">Time &amp; timezone</span>}
          </button>
          <button
            type="button"
            onClick={() => askWalkthrough("Account settings and passkeys")}
            title={collapsed ? d.userName : undefined}
            aria-label={collapsed ? d.userName : undefined}
            className={cn("flex w-full cursor-pointer items-center gap-2.5 rounded-xl bg-white/10 p-2 text-left transition hover:bg-white/15", SIDEBAR_FOCUS, collapsed && "justify-center")}
          >
            <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-white text-xs font-semibold text-[#0636a6]">{initials}</span>
            {!collapsed && (
              <>
                <span className="flex flex-1 flex-col overflow-hidden">
                  <span className="truncate text-sm font-medium text-white">{d.userName}</span>
                  <span className="truncate text-xs text-white/70">{d.userRole}</span>
                </span>
                <ChevronsUpDown aria-hidden className="size-4 shrink-0 text-white/60" />
              </>
            )}
          </button>
          <button
            type="button"
            onClick={() => setCollapsed((c) => !c)}
            aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
            className={cn("mt-2 flex w-full cursor-pointer items-center gap-3 rounded-xl px-3 py-2 text-xs font-medium text-white/70 transition hover:bg-white/10 hover:text-white", SIDEBAR_FOCUS, collapsed && "justify-center")}
          >
            <ChevronLeft aria-hidden className={cn("size-4 transition-transform", collapsed && "rotate-180")} />
            {!collapsed && <span>Collapse</span>}
          </button>
        </div>
      </nav>

      {/* Mobile: a slim top bar and pill tabs. pl-28 leaves room for the deck's own menu and play buttons. */}
      <div className="absolute inset-x-0 top-0 z-20 md:hidden">
        <div className="flex h-14 items-center gap-2 bg-[#0636a6] pr-4 pl-28">
          {/* eslint-disable-next-line @next/next/no-img-element -- product mark inside the replica */}
          <img src={d.logo.markWhite} alt="" className="h-5 w-auto" />
          <span className="text-base font-semibold text-white">Dentavanta</span>
        </div>
        <div className="flex h-12 items-center gap-1 overflow-x-auto border-b border-[#e6e8ec] bg-white px-2">
          {NAV.filter((n) => n.screen).map((item) => {
            const Icon = item.icon;
            const active = item.screen === screen;
            return (
              <button
                key={item.label}
                type="button"
                onClick={() => open(item)}
                className={cn(
                  "flex shrink-0 cursor-pointer items-center gap-1.5 rounded-lg px-3 py-1.5 text-[13px] font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0636a6]/40",
                  active ? "bg-[#0636a6] text-white" : "text-[#6b7280]",
                )}
              >
                <Icon aria-hidden className="size-4" />
                {item.label}
              </button>
            );
          })}
        </div>
      </div>

      <main className="relative mt-26 min-w-0 flex-1 overflow-y-auto px-3 pb-20 md:mt-0 md:px-0 md:pb-0">
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={screen}
            initial={{ opacity: 0, y: reduce ? 0 : 8 }}
            animate={{ opacity: 1, y: 0, transition: { duration: 0.3, ease: [0.22, 1, 0.36, 1] } }}
            exit={{ opacity: 0, transition: { duration: 0.15 } }}
            className="min-h-full"
          >
            {children}
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Toasts: flat, bordered, bottom right. */}
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
              className="flex gap-3 rounded-xl border border-[#e6e8ec] bg-white px-4 py-3"
            >
              <span className="mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full bg-[#047857] text-white">
                <Check aria-hidden className="size-3" strokeWidth={3} />
              </span>
              <span className="min-w-0">
                <span className="block text-[13px] font-semibold text-[#0a0a0a]">{t.title}</span>
                {t.description && <span className="mt-0.5 block truncate text-[12.5px] text-[#6b7280]">{t.description}</span>}
              </span>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      <WalkthroughModal />
    </div>
    </FrameRootContext.Provider>
  );
}

/** Centered "this is in the full product" modal, shown for anything outside the demo. */
export function WalkthroughModal() {
  const { walkthrough, closeWalkthrough } = useStore();
  const reduce = useReducedMotion();
  const copy = dentavantaDeck.walkthrough;
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
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }} className="absolute inset-0 bg-[#0a0a0a]/30 backdrop-blur-md" onClick={closeWalkthrough} />
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-labelledby="dv-walkthrough-title"
            initial={{ opacity: 0, y: reduce ? 0 : 16, scale: reduce ? 1 : 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: reduce ? 0 : 8, scale: reduce ? 1 : 0.98 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="relative w-full max-w-md overflow-hidden rounded-3xl border border-[#e6e8ec] bg-white"
          >
            <div className="relative h-28 overflow-hidden bg-[#0636a6]">
              <div aria-hidden className="absolute -top-16 -right-10 size-56 rounded-full bg-white/10" />
              <div aria-hidden className="absolute -bottom-20 left-10 size-40 rounded-full bg-white/5" />
              <button
                type="button"
                onClick={closeWalkthrough}
                aria-label="Close"
                className="absolute top-3 right-3 flex size-9 cursor-pointer items-center justify-center rounded-full bg-white/90 text-[#0a0a0a] transition-colors hover:bg-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
              >
                <X aria-hidden className="size-4" />
              </button>
            </div>
            <span className="absolute top-19 left-6 z-10 flex size-16 items-center justify-center rounded-2xl border border-[#e6e8ec] bg-white">
              {/* eslint-disable-next-line @next/next/no-img-element -- product mark */}
              <img src={dentavantaDeck.logo.markBlue} alt="" className="h-9 w-auto" />
            </span>
            <div className="px-6 pt-11 pb-6">
              <p className="text-[12.5px] font-semibold text-[#0636a6]">{copy.eyebrow}</p>
              <h3 id="dv-walkthrough-title" className="mt-1 text-[21px] leading-tight font-bold text-balance text-[#0a0a0a]">
                {copy.title.replace("{feature}", walkthrough)}
              </h3>
              <p className="mt-2 text-[14px] leading-relaxed text-[#6b7280]">{copy.body}</p>
              <ul className="mt-4 flex flex-col gap-2">
                {copy.points.map((point) => (
                  <li key={point} className="flex items-center gap-2.5 text-[13.5px] text-[#0a0a0a]">
                    <span className="flex size-5 shrink-0 items-center justify-center rounded-full bg-[#eaeef8] text-[#0636a6]">
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
                  className="inline-flex h-12 cursor-pointer items-center justify-center gap-2 rounded-xl bg-[#0636a6] px-5 text-[14.5px] font-semibold text-white transition hover:bg-[#052e8d] focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-[#0636a6]/40"
                >
                  {copy.primary.label}
                  <ArrowRight aria-hidden className="size-4" />
                </Link>
                <button
                  type="button"
                  onClick={closeWalkthrough}
                  className="h-11 cursor-pointer rounded-xl text-[14px] font-medium text-[#6b7280] transition-colors hover:bg-[#f1f3f8] hover:text-[#0a0a0a] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0636a6]/40"
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
