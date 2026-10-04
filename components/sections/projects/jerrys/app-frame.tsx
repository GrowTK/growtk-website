"use client";

import * as React from "react";
import Link from "next/link";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { ArrowRight, BarChart2, Check, Leaf, Menu, ShoppingCart, Wallet, Workflow, X, type LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { jerrysJakarta } from "@/lib/project-fonts";
import { jerrysDeck } from "@/content/jerrys";
import { useStore } from "./store";
import { FOCUS, JERRYS_RED } from "./ui";

export type ScreenId = "checkout" | "sales" | "stock" | "drawer" | "automations";

type NavItem = { id: string; label: string; icon: LucideIcon; screen?: ScreenId };

// Labels and icons from BottomNav.tsx and src/lib/modules.ts. "Automations"
// gathers the real notification module and the add-ons we'd build next.
const NAV: NavItem[] = [
  { id: "checkout", label: "Checkout", icon: ShoppingCart, screen: "checkout" },
  { id: "sales", label: "Sales", icon: BarChart2, screen: "sales" },
  { id: "stock", label: "Ingredients", icon: Leaf, screen: "stock" },
  { id: "drawer", label: "Drawer", icon: Wallet, screen: "drawer" },
  { id: "automations", label: "Automations", icon: Workflow, screen: "automations" },
  { id: "more", label: "More", icon: Menu },
];

/**
 * Jerry's light zinc tokens, scoped to the frame so the replica renders in the
 * product's own system instead of the Growtk site's. Body text is the
 * product's system stack; `.jerrys-display` is its Plus Jakarta Sans.
 */
function frameTokens(): React.CSSProperties {
  return {
    "--primary": JERRYS_RED,
    "--primary-foreground": "#ffffff",
    "--ring": "#18181b",
    "--background": "#ffffff",
    "--foreground": "#18181b",
    "--card": "#ffffff",
    "--card-foreground": "#18181b",
    "--popover": "#ffffff",
    "--muted": "#f4f4f5",
    "--muted-foreground": "#71717a",
    "--accent": "#f4f4f5",
    "--accent-foreground": "#18181b",
    "--border": "#e4e4e7",
    "--input": "#e4e4e7",
    fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", "Segoe UI", system-ui, sans-serif',
  } as React.CSSProperties;
}

/** The product's glass pill style, from BottomNav.tsx. */
const GLASS: React.CSSProperties = {
  background: "rgba(255, 255, 255, 0.72)",
  backdropFilter: "blur(28px) saturate(200%)",
  WebkitBackdropFilter: "blur(28px) saturate(200%)",
  border: "1px solid rgba(255, 255, 255, 0.6)",
  boxShadow: "0 8px 32px rgba(0,0,0,0.14), 0 2px 8px rgba(0,0,0,0.10), inset 0 1px 0 rgba(255,255,255,0.60)",
};

export function AppFrame({ screen, onNavigate, children }: { screen: ScreenId; onNavigate: (screen: ScreenId) => void; children: React.ReactNode }) {
  const { toasts, askWalkthrough, unseenAlerts, tickets } = useStore();
  const reduce = useReducedMotion();

  const open = (item: NavItem) => (item.screen ? onNavigate(item.screen) : askWalkthrough("The More menu"));
  const badge = (item: NavItem) => (item.id === "automations" && screen !== "automations" ? unseenAlerts : item.id === "checkout" && screen !== "checkout" ? tickets.filter((t) => t.source === "whatsapp").length : 0);

  return (
    <div className={cn(jerrysJakarta.variable, "absolute inset-0 overflow-hidden bg-white text-zinc-900 antialiased")} style={frameTokens()}>
      <style>{`.jerrys-display{font-family:var(--font-jerrys),-apple-system,"SF Pro Display",system-ui,sans-serif;letter-spacing:-0.028em}`}</style>

      {/* Mobile: Jerry's mark plus pill tabs. pl-16 leaves room for the deck's own menu button. */}
      <div className="absolute inset-x-0 top-0 z-20 border-b border-zinc-100 bg-white md:hidden">
        <div className="flex h-14 items-center gap-2 pr-4 pl-16">
          {/* eslint-disable-next-line @next/next/no-img-element -- product logo inside the replica */}
          <img src={jerrysDeck.logo.src} alt="" className="size-7 rounded-lg object-cover" />
          <span className="jerrys-display text-base font-black text-zinc-900">Jerry&apos;s POS</span>
        </div>
        <div className="flex h-12 items-center gap-1 overflow-x-auto px-2 [scrollbar-width:none]">
          {NAV.filter((n) => n.screen).map((item) => {
            const Icon = item.icon;
            const active = item.screen === screen;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => open(item)}
                className={cn("flex shrink-0 cursor-pointer items-center gap-1.5 rounded-full px-3 py-1.5 text-[13px] font-semibold", FOCUS, active ? "bg-zinc-900 text-white" : "text-zinc-500")}
              >
                <Icon aria-hidden size={15} strokeWidth={active ? 2.5 : 1.8} />
                {item.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Content. */}
      <main className="absolute inset-x-0 top-26 bottom-0 overflow-hidden md:top-0">
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

      {/* Desktop: the product's floating glass nav pill, bottom left. */}
      <nav aria-label="Jerry's POS" className="absolute bottom-4 left-4 z-30 hidden items-center gap-0.5 rounded-full px-2 py-1.5 select-none md:flex" style={GLASS}>
        {NAV.map((item) => {
          const Icon = item.icon;
          const active = item.screen === screen;
          const count = badge(item);
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => open(item)}
              aria-current={active ? "page" : undefined}
              className={cn(
                "relative flex cursor-pointer items-center justify-center gap-1.5 rounded-full px-3.5 py-2.5 transition-all duration-200 active:scale-95",
                FOCUS,
                active ? "bg-black/85 text-white" : "text-black/60 hover:bg-white/40 hover:text-black/85",
              )}
            >
              <Icon aria-hidden className="size-4 shrink-0" strokeWidth={active ? 2.5 : 1.8} />
              <span className="text-xs leading-none font-semibold">{item.label}</span>
              {count > 0 && (
                <span className="absolute -top-1 -right-0.5 flex h-4 min-w-4 items-center justify-center rounded-full px-1 text-[9px] font-black text-white tabular-nums" style={{ background: JERRYS_RED }}>
                  {count}
                </span>
              )}
            </button>
          );
        })}
      </nav>

      {/* Toaster, top center like the product's ToastProvider. */}
      <div aria-live="polite" className="pointer-events-none absolute top-30 left-1/2 z-[80] flex w-80 max-w-[calc(100%-2rem)] -translate-x-1/2 flex-col gap-2 md:top-4">
        <AnimatePresence>
          {toasts.map((t) => (
            <motion.div
              key={t.id}
              layout
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.25 }}
              className="flex gap-3 rounded-2xl bg-zinc-900 px-4 py-3 text-white shadow-[0_12px_32px_rgba(0,0,0,.25)]"
            >
              <span className="mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full bg-emerald-500">
                <Check aria-hidden className="size-3" strokeWidth={3} />
              </span>
              <span className="min-w-0">
                <span className="block text-[13px] font-bold">{t.title}</span>
                {t.description && <span className="mt-0.5 block text-[12.5px] text-white/75">{t.description}</span>}
              </span>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      <WalkthroughModal />
    </div>
  );
}

/** Centered "this is in the full system" modal, shown for anything outside the demo. */
function WalkthroughModal() {
  const { walkthrough, closeWalkthrough } = useStore();
  const reduce = useReducedMotion();
  const copy = jerrysDeck.walkthrough;
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
            className="absolute inset-0 bg-black/30 backdrop-blur-md"
            onClick={closeWalkthrough}
          />
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-labelledby="jerrys-walkthrough-title"
            initial={{ opacity: 0, y: reduce ? 0 : 16, scale: reduce ? 1 : 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: reduce ? 0 : 8, scale: reduce ? 1 : 0.98 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="relative w-full max-w-md overflow-hidden rounded-3xl bg-white shadow-[0_8px_24px_rgba(0,0,0,.08),0_24px_64px_rgba(0,0,0,.2)]"
          >
            {/* Header band: Jerry's own swirl artwork, no text on it. */}
            <div className="relative h-28 overflow-hidden" style={{ background: JERRYS_RED }}>
              {/* eslint-disable-next-line @next/next/no-img-element -- brand artwork inside the replica */}
              <img src={jerrysDeck.logo.src} alt="" className="absolute inset-0 size-full scale-150 object-cover opacity-90" />
              <button
                type="button"
                onClick={closeWalkthrough}
                aria-label="Close"
                className="absolute top-3 right-3 flex size-9 cursor-pointer items-center justify-center rounded-full bg-white/90 text-zinc-900 transition-colors hover:bg-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
              >
                <X aria-hidden className="size-4" />
              </button>
            </div>

            <div className="px-6 pt-6 pb-6">
              <p className="text-[12.5px] font-bold" style={{ color: JERRYS_RED }}>
                {copy.eyebrow}
              </p>
              <h3 id="jerrys-walkthrough-title" className="jerrys-display mt-1 text-[21px] leading-tight font-black text-balance text-zinc-900">
                {copy.title.replace("{feature}", walkthrough)}
              </h3>
              <p className="mt-2 text-[14px] leading-relaxed text-zinc-500">{copy.body}</p>
              <ul className="mt-4 flex flex-col gap-2">
                {copy.points.map((point) => (
                  <li key={point} className="flex items-center gap-2.5 text-[13.5px] text-zinc-700">
                    <span className="flex size-5 shrink-0 items-center justify-center rounded-full bg-emerald-50 text-emerald-600">
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
                  className="inline-flex h-12 cursor-pointer items-center justify-center gap-2 rounded-full bg-zinc-900 px-5 text-[14.5px] font-bold text-white transition hover:bg-black focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-zinc-900/40"
                >
                  {copy.primary.label}
                  <ArrowRight aria-hidden className="size-4" />
                </Link>
                <button
                  type="button"
                  onClick={closeWalkthrough}
                  className="h-11 cursor-pointer rounded-full text-[14px] font-medium text-zinc-500 transition-colors hover:bg-zinc-100 hover:text-zinc-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-900/30"
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
