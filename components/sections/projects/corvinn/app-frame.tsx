"use client";

import * as React from "react";
import Link from "next/link";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import {
  ArrowRight,
  BarChart3,
  Check,
  Sparkles,
  X,
  Briefcase,
  ChevronLeft,
  ChevronRight,
  Code,
  DollarSign,
  FileText,
  Home,
  Layers,
  Package,
  PanelLeftClose,
  PanelLeftOpen,
  Plug,
  RefreshCcw,
  Settings,
  Table,
  Tag,
  TriangleAlert,
  User,
  Users,
  Wrench,
  Zap,
  type LucideIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { corvinnLato } from "@/lib/project-fonts";
import { corvinnDeck } from "@/content/corvinn";
import { EntityAvatar, PortalContext } from "./ui";
import { useStore } from "./store";

export type ScreenId = "dashboard" | "jobs" | "dispatch" | "customers" | "inventory" | "automations";

type NavItem = { id: string; label: string; icon: LucideIcon; screen?: ScreenId };
type NavGroup = { id: "planning" | "business"; label: string; icon: LucideIcon; items: NavItem[] };

// Same items, order and grouping as nav-sidebar.tsx for an owner account.
const MAIN: NavItem[] = [
  { id: "dashboard", label: "Dashboard", icon: Home, screen: "dashboard" },
  { id: "jobs", label: "Jobs", icon: Wrench, screen: "jobs" },
  { id: "dispatch", label: "Dispatch board", icon: Table, screen: "dispatch" },
  { id: "customers", label: "Customers", icon: User, screen: "customers" },
];
const GROUPS: NavGroup[] = [
  {
    id: "planning",
    label: "Planning",
    icon: Layers,
    items: [
      { id: "recurring", label: "Recurring jobs", icon: RefreshCcw },
      { id: "inventory", label: "Inventory", icon: Package, screen: "inventory" },
      { id: "permits", label: "Permits", icon: FileText },
    ],
  },
  {
    id: "business",
    label: "Business",
    icon: Briefcase,
    items: [
      { id: "automations", label: "Automations", icon: Zap, screen: "automations" },
      { id: "integrations", label: "Integrations", icon: Plug },
      { id: "team", label: "Team", icon: Users },
      { id: "branding", label: "Branding", icon: Settings },
      { id: "pricebook", label: "Pricebook", icon: Tag },
      { id: "reports", label: "Reports", icon: BarChart3 },
      { id: "payroll", label: "Payroll", icon: DollarSign },
      { id: "sync", label: "Sync conflicts", icon: TriangleAlert },
      { id: "embed", label: "External tracking", icon: Code },
    ],
  },
];

const EXPANDED_WIDTH = "12rem";
const COLLAPSED_WIDTH = "3.75rem";

type FrameContext = { setNavCollapsed: (collapsed: boolean) => void; navCollapsed: boolean };
const FrameCtx = React.createContext<FrameContext>({ setNavCollapsed: () => {}, navCollapsed: false });
export const useFrame = () => React.useContext(FrameCtx);

/**
 * Corvinn's monochrome tokens, scoped to the frame so the replica renders in
 * the product's own system instead of the Growtk site's. --primary is the
 * tenant color (lib/ui/tenant-theme.ts does the same override in the app).
 */
function frameTokens(primary: string): React.CSSProperties {
  return {
    "--primary": primary,
    "--primary-foreground": "#ffffff",
    "--ring": primary,
    "--background": "#ffffff",
    "--foreground": "oklch(0.145 0 0)",
    "--card": "#ffffff",
    "--card-foreground": "oklch(0.145 0 0)",
    "--popover": "#ffffff",
    "--muted": "oklch(0.97 0 0)",
    "--muted-foreground": "oklch(0.492 0 0)",
    "--secondary": "oklch(0.97 0 0)",
    "--secondary-foreground": "oklch(0.205 0 0)",
    "--accent": "oklch(0.96 0 0)",
    "--accent-foreground": "oklch(0.205 0 0)",
    "--border": "oklch(0.906 0 0)",
    "--input": "oklch(0.906 0 0)",
    fontFamily: "var(--font-corvinn), sans-serif",
    lineHeight: 1.44,
  } as React.CSSProperties;
}

function NavLink({ item, active, collapsed, onClick }: { item: NavItem; active: boolean; collapsed: boolean; onClick: () => void }) {
  const Icon = item.icon;
  return (
    <button
      type="button"
      onClick={onClick}
      title={collapsed ? item.label : undefined}
      aria-current={active ? "page" : undefined}
      className={cn(
        "flex h-10 shrink-0 cursor-pointer items-center gap-2.5 rounded-xl px-2.5 text-[14px] font-medium text-white transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/60",
        collapsed && "justify-center",
        active ? "bg-white/20 font-semibold" : "text-white/75 hover:bg-white/10 hover:text-white",
      )}
    >
      <Icon aria-hidden className="size-[18px] shrink-0" strokeWidth={1.8} />
      {!collapsed && <span className="truncate">{item.label}</span>}
    </button>
  );
}

export function AppFrame({
  screen,
  primary,
  onNavigate,
  children,
}: {
  screen: ScreenId;
  primary: string;
  onNavigate: (screen: ScreenId) => void;
  children: React.ReactNode;
}) {
  const { toasts, askWalkthrough } = useStore();
  const reduce = useReducedMotion();
  const [collapsed, setCollapsed] = React.useState(false);
  const [portal, setPortal] = React.useState<HTMLElement | null>(null);

  const activeGroup = GROUPS.find((g) => g.items.some((i) => i.screen === screen)) ?? null;
  const [drilledId, setDrilledId] = React.useState<NavGroup["id"] | null>(activeGroup?.id ?? null);
  React.useEffect(() => setDrilledId(activeGroup?.id ?? null), [activeGroup?.id]);
  const drilled = !collapsed ? (GROUPS.find((g) => g.id === drilledId) ?? null) : null;

  const open = (item: NavItem) => (item.screen ? onNavigate(item.screen) : askWalkthrough(item.label));

  const mobileItems = [...MAIN, GROUPS[0]!.items[1]!, GROUPS[1]!.items[0]!];

  return (
    <FrameCtx.Provider value={{ setNavCollapsed: setCollapsed, navCollapsed: collapsed }}>
      <PortalContext.Provider value={portal}>
        <div
          className={cn(corvinnLato.variable, "absolute inset-0 overflow-hidden text-foreground antialiased")}
          style={{ ...frameTokens(primary), "--dash-nav-width": collapsed ? COLLAPSED_WIDTH : EXPANDED_WIDTH } as React.CSSProperties}
        >
          {/* TenantBackground: the tenant's image, blurred and oversized. The
              product uses a heavy black-to-clear wash; the deck keeps it light
              (just enough under the sidebar for its white text) so 8.jpg shows. */}
          <div aria-hidden className="absolute inset-0 overflow-hidden bg-muted">
            <div
              className="absolute -inset-10 scale-110 blur-2xl"
              style={{ backgroundImage: `url(${corvinnDeck.themeImage})`, backgroundSize: "cover", backgroundPosition: "center" }}
            />
            <div className="absolute inset-0 bg-linear-to-r from-black/35 via-black/5 via-30% to-transparent" />
          </div>

          {/* Desktop sidebar: translucent, no border, no shadow. */}
          <nav
            aria-label="Corvinn"
            className={cn(
              "absolute top-3 bottom-3 left-3 z-20 hidden flex-col rounded-[28px] p-1.5 backdrop-blur-xl transition-[width] duration-200 md:flex",
              collapsed ? "w-15" : "w-48",
            )}
          >
            <div className={cn("mb-3 flex h-9 items-center px-1 pt-1", collapsed ? "justify-center" : "pl-2")}>
              {collapsed ? (
                <span className="relative size-8 overflow-hidden">
                  {/* eslint-disable-next-line @next/next/no-img-element -- tenant logo, cropped to just its mark when collapsed */}
                  <img
                    src={corvinnDeck.sidebarLogo.src}
                    alt={corvinnDeck.sidebarLogo.alt}
                    className="absolute top-0 left-0 max-w-none"
                    style={{ width: 199, height: 56, transform: "translate(-28.5px, -13.4px)" }}
                  />
                </span>
              ) : (
                // eslint-disable-next-line @next/next/no-img-element -- tenant logo
                <img src={corvinnDeck.sidebarLogo.src} alt={corvinnDeck.sidebarLogo.alt} className="-ml-2 h-8 w-auto object-contain object-left" />
              )}
            </div>

            <div className="flex flex-1 flex-col gap-1 overflow-x-hidden overflow-y-auto">
              {drilled === null ? (
                <>
                  {MAIN.map((item) => (
                    <NavLink key={item.id} item={item} active={item.screen === screen} collapsed={collapsed} onClick={() => open(item)} />
                  ))}
                  {GROUPS.map((group) => {
                    const Icon = group.icon;
                    return (
                      <button
                        key={group.id}
                        type="button"
                        title={collapsed ? group.label : undefined}
                        aria-label={collapsed ? group.label : undefined}
                        onClick={() => {
                          setDrilledId(group.id);
                          if (collapsed) setCollapsed(false);
                        }}
                        className={cn(
                          "flex h-10 shrink-0 cursor-pointer items-center rounded-xl px-2.5 text-[14px] font-medium text-white/75 transition-colors hover:bg-white/10 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/60",
                          collapsed ? "justify-center" : "justify-between",
                        )}
                      >
                        <span className="flex items-center gap-2.5">
                          <Icon aria-hidden className="size-[18px]" strokeWidth={1.8} />
                          {!collapsed && group.label}
                        </span>
                        {!collapsed && <ChevronRight aria-hidden className="size-3.5" />}
                      </button>
                    );
                  })}
                </>
              ) : (
                <>
                  <button
                    type="button"
                    onClick={() => setDrilledId(null)}
                    className="mb-1 flex h-9 shrink-0 cursor-pointer items-center gap-1.5 rounded-xl px-2.5 text-[12.5px] font-semibold text-white/75 transition-colors hover:bg-white/10 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/60"
                  >
                    <ChevronLeft aria-hidden className="size-3.5" />
                    Back
                  </button>
                  {drilled.items.map((item) => (
                    <NavLink key={item.id} item={item} active={item.screen === screen} collapsed={false} onClick={() => open(item)} />
                  ))}
                </>
              )}
            </div>

            <div className={cn("mt-2 flex flex-col gap-1.5 px-1 pb-1", collapsed ? "items-center" : "items-start")}>
              <button
                type="button"
                onClick={() => setCollapsed((c) => !c)}
                aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
                title={collapsed ? "Expand sidebar" : "Collapse sidebar"}
                className="flex size-8 shrink-0 cursor-pointer items-center justify-center rounded-full text-white/70 transition-colors hover:bg-white/10 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/60"
              >
                {collapsed ? <PanelLeftOpen className="size-4" /> : <PanelLeftClose className="size-4" />}
              </button>
              <span title={corvinnDeck.userName} className="rounded-full ring-white/40">
                <EntityAvatar name={corvinnDeck.userName} tone="primary" />
              </span>
            </div>
          </nav>

          {/* Mobile: MobileTopNav (white bar + scrolling pill tabs). pl-16
              leaves room for the deck's own menu button. */}
          <div className="absolute inset-x-0 top-0 z-20 md:hidden">
            <div className="flex h-14 items-center border-b border-border bg-card pr-4 pl-16">
              <span className="inline-flex h-8 items-center rounded-md bg-neutral-900 px-2.5">
                {/* eslint-disable-next-line @next/next/no-img-element -- tenant logo on its dark chip */}
                <img src={corvinnDeck.sidebarLogo.src} alt={corvinnDeck.sidebarLogo.alt} className="max-h-5 max-w-40 object-contain" />
              </span>
            </div>
            <div className="flex h-12 items-center gap-1 overflow-x-auto border-b border-border bg-card px-2">
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
                      active ? "bg-muted font-semibold text-foreground" : "text-muted-foreground",
                    )}
                  >
                    <Icon aria-hidden className="size-[18px]" strokeWidth={1.8} />
                    {item.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* The floating content panel. */}
          <main
            className="absolute inset-x-0 top-26 bottom-0 overflow-y-auto bg-muted transition-[left] duration-200 md:top-3 md:right-3 md:bottom-3 md:left-[calc(var(--dash-nav-width)+1.5rem)] md:rounded-[28px] md:bg-gray-100"
          >
            <AnimatePresence mode="wait" initial={false}>
              <motion.div
                key={screen}
                initial={{ opacity: 0, y: reduce ? 0 : 8 }}
                animate={{ opacity: 1, y: 0, transition: { duration: 0.3, ease: [0.22, 1, 0.36, 1] } }}
                exit={{ opacity: 0, transition: { duration: 0.15 } }}
                className="h-full"
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
                  className="rounded-[10px] border border-border bg-white px-4 py-3 shadow-[0_8px_24px_rgba(0,0,0,.08),0_20px_48px_rgba(0,0,0,.10)]"
                >
                  <div className="text-[13px] font-semibold">{t.title}</div>
                  {t.description && <div className="mt-0.5 text-[12.5px] text-muted-foreground">{t.description}</div>}
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          <WalkthroughModal />

          <div ref={setPortal} />
        </div>
      </PortalContext.Provider>
    </FrameCtx.Provider>
  );
}

/** Centered "this is in the full product" modal, shown for anything outside the demo. */
function WalkthroughModal() {
  const { walkthrough, closeWalkthrough } = useStore();
  const reduce = useReducedMotion();
  const copy = corvinnDeck.walkthrough;
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
            aria-labelledby="walkthrough-title"
            initial={{ opacity: 0, y: reduce ? 0 : 16, scale: reduce ? 1 : 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: reduce ? 0 : 8, scale: reduce ? 1 : 0.98 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="relative w-full max-w-md overflow-hidden rounded-[28px] bg-white shadow-[0_8px_24px_rgba(0,0,0,.08),0_24px_64px_rgba(0,0,0,.18)]"
          >
            {/* Header band: the tenant's own backdrop, so the modal reads as part of the app. */}
            <div className="relative h-28 overflow-hidden">
              <div
                aria-hidden
                className="absolute -inset-6 scale-110 blur-xl"
                style={{ backgroundImage: `url(${corvinnDeck.themeImage})`, backgroundSize: "cover", backgroundPosition: "center" }}
              />
              <button
                type="button"
                onClick={closeWalkthrough}
                aria-label="Close"
                className="absolute top-3 right-3 flex size-9 cursor-pointer items-center justify-center rounded-full bg-white/80 text-foreground backdrop-blur-sm transition-colors hover:bg-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50"
              >
                <X className="size-4" />
              </button>
            </div>

            {/* Sits on the seam between the band and the body (outside the band's overflow clip). */}
            <span className="absolute top-21 left-6 z-10 flex size-14 items-center justify-center rounded-2xl bg-white text-primary shadow-[0_6px_20px_rgba(0,0,0,.12)]">
              <Sparkles aria-hidden className="size-6" strokeWidth={1.75} />
            </span>

            <div className="px-6 pt-11 pb-6">
              <p className="text-[12.5px] font-semibold text-primary">{copy.eyebrow}</p>
              <h3 id="walkthrough-title" className="mt-1 text-[21px] leading-tight font-semibold text-balance">
                {copy.title.replace("{feature}", walkthrough)}
              </h3>
              <p className="mt-2 text-[14px] leading-relaxed text-muted-foreground">{copy.body}</p>
              <ul className="mt-4 flex flex-col gap-2">
                {copy.points.map((point) => (
                  <li key={point} className="flex items-center gap-2.5 text-[13.5px]">
                    <span className="flex size-5 shrink-0 items-center justify-center rounded-full bg-primary/12 text-primary">
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
                  className="inline-flex h-12 cursor-pointer items-center justify-center gap-2 rounded-full bg-primary px-5 text-[14.5px] font-semibold text-primary-foreground transition hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50"
                >
                  {copy.primary.label}
                  <ArrowRight aria-hidden className="size-4" />
                </Link>
                <button
                  type="button"
                  onClick={closeWalkthrough}
                  className="h-11 cursor-pointer rounded-full text-[14px] font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50"
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
