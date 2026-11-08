"use client";

import * as React from "react";
import Link from "next/link";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import {
  ArrowRight,
  BarChart3,
  Bookmark,
  Brain,
  BrainCircuit,
  Briefcase,
  Check,
  CreditCard,
  FileSignature,
  FileText,
  Home,
  LogOut,
  Mail,
  Rocket,
  Search,
  X,
  type LucideIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";
// Geist is AutoTalent's own face too. The Yetti export is the shared next/font Geist instance.
import { yettiGeist as geist } from "@/lib/project-fonts";
import { autotalentDeck, type ScreenId } from "@/content/autotalent";
import { useStore } from "./store";
import { FOCUS, OLIVE } from "./ui";

type NavItem = { id: string; label: string; icon: LucideIcon; screen?: ScreenId; soon?: boolean; badge?: "saved" };

const n = autotalentDeck.nav;

// Same order, labels and icons as components/sidebar.tsx in the real app.
const NAV: NavItem[] = [
  { id: "hub", label: n.jobHub, icon: Home, screen: "hub" },
  { id: "agent", label: n.aiAgent, icon: Brain, screen: "agent" },
  { id: "resumes", label: n.resumeBuilder, icon: FileText, screen: "resume" },
  { id: "cover", label: n.coverLetter, icon: FileSignature },
  { id: "email", label: n.emailToHr, icon: Mail },
  { id: "interviews", label: n.interviews, icon: Briefcase },
  { id: "search", label: n.searchJobs, icon: Search, screen: "search" },
  { id: "saved", label: n.savedJobs, icon: Bookmark, badge: "saved" },
  { id: "smart", label: n.smartApply, icon: Rocket, soon: true },
  { id: "usage", label: n.usage, icon: BarChart3 },
  { id: "billing", label: n.billing, icon: CreditCard },
];

/**
 * AutoTalent's light zinc tokens, scoped to the frame so the replica renders
 * in the product's own system instead of the Growtk site's.
 */
function frameTokens(): React.CSSProperties {
  return {
    "--primary": OLIVE,
    "--primary-foreground": "#ffffff",
    "--ring": OLIVE,
    "--background": "#fafaf9",
    "--foreground": "#18181b",
    "--card": "#ffffff",
    "--card-foreground": "#18181b",
    "--popover": "#ffffff",
    "--muted": "#f4f4f5",
    "--muted-foreground": "#71717a",
    "--accent": "#f4f6f0",
    "--accent-foreground": "#18181b",
    "--border": "#e4e4e7",
    "--input": "#e4e4e7",
    fontFamily: "var(--font-yetti), Arial, Helvetica, sans-serif",
  } as React.CSSProperties;
}

export function Mark({ className }: { className?: string }) {
  return (
    <span className={cn("inline-flex size-9 shrink-0 items-center justify-center rounded-full bg-[#5b6949]", className)}>
      <BrainCircuit aria-hidden className="size-5 text-white" />
    </span>
  );
}

export function AppFrame({ screen, onNavigate, children }: { screen: ScreenId; onNavigate: (screen: ScreenId) => void; children: React.ReactNode }) {
  const { toasts, askWalkthrough, savedJobIds } = useStore();
  const reduce = useReducedMotion();
  const open = (item: NavItem) => (item.screen ? onNavigate(item.screen) : askWalkthrough(item.label));
  const mobileItems = NAV.filter((item) => item.screen);

  return (
    <div className={cn(geist.variable, "absolute inset-0 overflow-hidden bg-[#fafaf9] text-zinc-900 antialiased")} style={frameTokens()}>
      {/* Desktop sidebar: white, icons only on tablets, full labels on laptops. */}
      <nav aria-label={autotalentDeck.appName} className="absolute top-0 bottom-0 left-0 z-20 hidden w-[76px] flex-col border-r border-zinc-200 bg-white p-3 md:flex lg:w-60">
        <div className="mt-1 mb-5 flex items-center gap-2.5 pl-1.5">
          <Mark />
          <span className="hidden text-[17px] font-bold tracking-tight text-zinc-900 lg:inline">{autotalentDeck.appName}</span>
        </div>
        <ul className="flex min-h-0 flex-1 flex-col gap-0.5 overflow-y-auto">
          {NAV.map((item) => {
            const Icon = item.icon;
            const active = item.screen === screen;
            return (
              <li key={item.id}>
                <button
                  type="button"
                  onClick={() => open(item)}
                  title={item.label}
                  aria-current={active ? "page" : undefined}
                  className={cn(
                    "group flex w-full cursor-pointer items-center gap-3 rounded-md px-3 py-2.5 text-sm font-semibold transition-colors",
                    FOCUS,
                    active ? "bg-zinc-100 text-[#5b6949]" : "text-zinc-700 hover:bg-zinc-100",
                  )}
                >
                  <Icon aria-hidden className="size-5 shrink-0" />
                  <span className="hidden flex-1 truncate text-left lg:inline">{item.label}</span>
                  <span className="sr-only lg:hidden">{item.label}</span>
                  {item.soon && <span className="hidden rounded-full bg-[#eef4a6] px-1.5 py-px text-[10px] font-bold text-[#2f3826] lg:inline">{n.soon}</span>}
                  {item.badge === "saved" && savedJobIds.length > 0 && (
                    <span className="hidden rounded-full bg-[#5b6949]/10 px-1.5 py-px text-[10px] font-bold text-[#5b6949] tabular-nums lg:inline">{savedJobIds.length}</span>
                  )}
                </button>
              </li>
            );
          })}
        </ul>
        <div className="mt-2 flex items-center gap-2.5 rounded-xl bg-zinc-50 p-2">
          <span title={autotalentDeck.user.name} className="flex size-8 shrink-0 items-center justify-center rounded-full bg-[#eef4a6] text-xs font-bold text-[#2f3826]">
            {autotalentDeck.user.initials}
          </span>
          <span className="hidden min-w-0 flex-1 lg:block">
            <span className="block truncate text-xs font-semibold text-zinc-900">{autotalentDeck.user.name}</span>
            <span className="block truncate text-[11px] text-[#5b6949]">{n.earlyAccess}</span>
          </span>
          <button
            type="button"
            onClick={() => askWalkthrough(n.signOut)}
            aria-label={n.signOut}
            className={cn("hidden size-7 cursor-pointer items-center justify-center rounded-lg text-zinc-400 hover:bg-zinc-200 hover:text-zinc-700 lg:flex", FOCUS)}
          >
            <LogOut aria-hidden className="size-4" />
          </button>
        </div>
      </nav>

      {/* Mobile: the app's top bar plus pill tabs. pl-16 leaves room for the deck's own menu button. */}
      <div className="absolute inset-x-0 top-0 z-20 md:hidden">
        <div className="flex h-14 items-center gap-2 border-b border-zinc-200 bg-white pr-4 pl-16">
          <Mark className="size-7" />
          <span className="text-base font-bold tracking-tight">{autotalentDeck.appName}</span>
        </div>
        <div className="flex h-12 items-center gap-1 overflow-x-auto border-b border-zinc-200 bg-white px-2">
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
                  active ? "bg-[#5b6949]/10 font-semibold text-[#5b6949]" : "text-zinc-500",
                )}
              >
                <Icon aria-hidden className="size-4" />
                {item.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Content. Each screen owns its own scrolling, so the agent can fill the height. */}
      <main className="absolute inset-x-0 top-26 bottom-0 overflow-hidden md:top-0 md:left-[76px] lg:left-60">
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={screen}
            initial={{ opacity: 0, y: reduce ? 0 : 8 }}
            animate={{ opacity: 1, y: 0, transition: { duration: 0.3, ease: [0.22, 1, 0.36, 1] } }}
            exit={{ opacity: 0, transition: { duration: 0.15 } }}
            className="absolute inset-0"
          >
            {children}
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Toaster, bottom right like the app's sonner placement. Lifted on phones to clear the deck nav. */}
      <div aria-live="polite" className="pointer-events-none absolute right-4 bottom-20 z-[80] flex w-80 max-w-[calc(100%-2rem)] flex-col gap-2 sm:bottom-4">
        <AnimatePresence>
          {toasts.map((t) => (
            <motion.div
              key={t.id}
              layout
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 6 }}
              transition={{ duration: 0.25 }}
              className="flex gap-3 rounded-xl border border-zinc-200 bg-white px-4 py-3 shadow-[0_8px_24px_rgba(24,24,27,.08),0_20px_48px_rgba(24,24,27,.10)]"
            >
              <span className="mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full bg-[#5b6949] text-white">
                <Check aria-hidden className="size-3" strokeWidth={3} />
              </span>
              <span>
                <span className="block text-[13px] font-semibold text-zinc-900">{t.title}</span>
                {t.description && <span className="mt-0.5 block text-[12.5px] text-zinc-500">{t.description}</span>}
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
  const copy = autotalentDeck.walkthrough;
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
            className="absolute inset-0 bg-zinc-900/30 backdrop-blur-md"
            onClick={closeWalkthrough}
          />
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-labelledby="autotalent-walkthrough-title"
            initial={{ opacity: 0, y: reduce ? 0 : 16, scale: reduce ? 1 : 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: reduce ? 0 : 8, scale: reduce ? 1 : 0.98 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="relative w-full max-w-md overflow-hidden rounded-3xl bg-white shadow-[0_8px_24px_rgba(24,24,27,.08),0_24px_64px_rgba(24,24,27,.18)]"
          >
            <div className="relative h-28 overflow-hidden bg-[#2f3826]">
              <div aria-hidden className="absolute -top-16 -right-10 size-56 rounded-full bg-[#eef4a6]/15" />
              <div aria-hidden className="absolute -bottom-20 left-10 size-40 rounded-full bg-[#5b6949]/60" />
              <button
                type="button"
                onClick={closeWalkthrough}
                aria-label={copy.secondary}
                className="absolute top-3 right-3 flex size-9 cursor-pointer items-center justify-center rounded-full bg-white/90 text-zinc-900 transition-colors hover:bg-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
              >
                <X aria-hidden className="size-4" />
              </button>
            </div>
            <span className="absolute top-19 left-6 z-10 flex size-16 items-center justify-center rounded-2xl bg-white shadow-[0_6px_20px_rgba(24,24,27,.14)]">
              <Mark className="size-11" />
            </span>
            <div className="px-6 pt-11 pb-6">
              <p className="text-[12.5px] font-semibold text-[#5b6949]">{copy.eyebrow}</p>
              <h3 id="autotalent-walkthrough-title" className="mt-1 text-[21px] leading-tight font-bold text-balance text-zinc-900">
                {copy.title.replace("{feature}", walkthrough)}
              </h3>
              <p className="mt-2 text-[14px] leading-relaxed text-zinc-500">{copy.body}</p>
              <ul className="mt-4 flex flex-col gap-2">
                {copy.points.map((point) => (
                  <li key={point} className="flex items-center gap-2.5 text-[13.5px] text-zinc-700">
                    <span className="flex size-5 shrink-0 items-center justify-center rounded-full bg-[#5b6949]/10 text-[#5b6949]">
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
                  className="inline-flex h-12 cursor-pointer items-center justify-center gap-2 rounded-xl bg-[#5b6949] px-5 text-[14.5px] font-semibold text-white transition hover:bg-[#4a573a] focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-[#5b6949]/40"
                >
                  {copy.primary.label}
                  <ArrowRight aria-hidden className="size-4" />
                </Link>
                <button
                  type="button"
                  onClick={closeWalkthrough}
                  className="h-11 cursor-pointer rounded-xl text-[14px] font-medium text-zinc-500 transition-colors hover:bg-zinc-100 hover:text-zinc-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#5b6949]/40"
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
