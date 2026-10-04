"use client";

import * as React from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import {
  ArrowRight,
  Check,
  ChefHat,
  FileBarChart2,
  HeartHandshake,
  Lock,
  MessageCircle,
  MonitorPlay,
  PackageX,
  Play,
  QrCode,
  Receipt,
  ShoppingBag,
  Sparkles,
  Truck,
  Wallet,
  Workflow,
  type LucideIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { jerrysDeck, type DemoAutomation, type NotificationKind } from "@/content/jerrys";
import { clockAt, useStore } from "./store";
import type { ScreenId } from "./app-frame";
import { BADGE, CARD, FOCUS, GRADIENTS, JERRYS_RED, ModuleHeader, Switch } from "./ui";

/**
 * Restaurant automation. The top group is what runs in Jerry's build today
 * (the notification dispatcher, the stock trigger, receipts); the add-ons are
 * what we'd build next, switched on here for the demo only. The phone on the
 * right is the owner's WhatsApp, fed by the same store, so a sale charged on
 * the checkout slide or a drawer closed on the drawer slide lands here.
 */

const ICONS: Record<string, LucideIcon> = { Receipt, ChefHat, PackageX, Wallet, QrCode, Truck, FileBarChart2, MessageCircle, HeartHandshake, MonitorPlay };

const KIND_ICON: Record<NotificationKind, LucideIcon> = {
  sale: Receipt,
  low_stock: PackageX,
  drawer: Wallet,
  purchase: Truck,
  report: FileBarChart2,
  order_in: ShoppingBag,
  offer: HeartHandshake,
};

export function AutomationsScreen({ onNavigate }: { onNavigate: (s: ScreenId) => void }) {
  const { automations, notifications, markAlertsSeen } = useStore();
  React.useEffect(() => markAlertsSeen(), [notifications.length, markAlertsSeen]);

  const live = automations.filter((a) => a.status === "live");
  const addons = automations.filter((a) => a.status === "addon");
  const [featured, ...rest] = addons;

  return (
    <div className="absolute inset-0 overflow-y-auto px-4 pb-24 sm:px-6">
      <ModuleHeader
        icon={Workflow}
        gradient={GRADIENTS.notifications}
        title="Automations"
        subtitle={`${live.filter((a) => a.enabled).length} running · ${addons.filter((a) => a.enabled).length} of ${addons.length} add-ons on`}
      />

      <div className="mt-3 grid gap-5 lg:grid-cols-[1fr_19rem] xl:grid-cols-[1fr_21rem]">
        <div className="flex min-w-0 flex-col gap-6">
          {/* Running today: a compact list. */}
          <section aria-labelledby="jerrys-live">
            <div className="flex items-center gap-2">
              <span className="size-2 rounded-full bg-emerald-500" aria-hidden />
              <h2 id="jerrys-live" className="text-sm font-black text-zinc-900">
                {jerrysDeck.copy.liveTag}
              </h2>
            </div>
            <ul className={cn(CARD, "mt-2 divide-y divide-zinc-100")}>
              {live.map((a) => (
                <LiveRow key={a.id} automation={a} />
              ))}
            </ul>
          </section>

          {/* Add-ons: bigger cards, one featured. */}
          <section aria-labelledby="jerrys-addons">
            <div className="flex flex-wrap items-center gap-2">
              <Sparkles aria-hidden size={15} style={{ color: JERRYS_RED }} />
              <h2 id="jerrys-addons" className="text-sm font-black text-zinc-900">
                Add-ons we&apos;d build next
              </h2>
            </div>
            <p className="mt-1 text-xs leading-relaxed text-zinc-500">Not in Jerry&apos;s build yet. Switch one on and it runs here, in the demo only.</p>
            <div className="mt-3 grid gap-2.5 sm:grid-cols-2">
              {featured && <AddonCard automation={featured} featured />}
              {rest.map((a) => (
                <AddonCard key={a.id} automation={a} />
              ))}
            </div>
          </section>
        </div>

        <div className="flex flex-col items-center gap-3 lg:sticky lg:top-3 lg:self-start">
          <Phone />
          <TryIt onNavigate={onNavigate} />
        </div>
      </div>
    </div>
  );
}

function Flow({ automation, light }: { automation: DemoAutomation; light?: boolean }) {
  return (
    <p className={cn("flex flex-wrap items-center gap-1.5 text-[11px] font-semibold", light ? "text-white/80" : "text-zinc-500")}>
      <span className={cn("rounded-full px-2 py-0.5", light ? "bg-white/15 text-white" : "bg-zinc-100 text-zinc-700")}>{automation.trigger}</span>
      <ArrowRight aria-hidden size={12} />
      <span className={cn("rounded-full px-2 py-0.5", light ? "bg-white/15 text-white" : "bg-zinc-100 text-zinc-700")}>{automation.channel}</span>
    </p>
  );
}

function LiveRow({ automation: a }: { automation: DemoAutomation }) {
  const { toggleAutomation } = useStore();
  const Icon = ICONS[a.icon] ?? Workflow;
  return (
    <li className="flex items-start gap-3 px-4 py-3">
      <span className="mt-0.5 flex size-9 shrink-0 items-center justify-center rounded-xl bg-zinc-100 text-zinc-700">
        <Icon aria-hidden size={17} />
      </span>
      <div className="min-w-0 flex-1">
        <p className="text-sm font-bold text-zinc-900">{a.title}</p>
        <p className="mt-0.5 text-xs leading-relaxed text-zinc-500">{a.body}</p>
        <div className="mt-1.5">
          <Flow automation={a} />
        </div>
      </div>
      {a.locked ? (
        <span className="mt-1 flex items-center gap-1 text-[11px] font-semibold text-zinc-500" title="Always on">
          <Lock aria-hidden size={12} />
          Always on
        </span>
      ) : (
        <span className="mt-1">
          <Switch on={a.enabled} onChange={() => toggleAutomation(a.id)} label={`${a.title} ${a.enabled ? "on" : "off"}`} />
        </span>
      )}
    </li>
  );
}

function AddonCard({ automation: a, featured }: { automation: DemoAutomation; featured?: boolean }) {
  const { toggleAutomation, runAutomation } = useStore();
  const Icon = ICONS[a.icon] ?? Workflow;
  return (
    <article
      className={cn(
        "relative flex flex-col gap-2 rounded-2xl p-4 transition-colors",
        featured ? "text-white sm:col-span-2" : cn("border bg-white", a.enabled ? "border-zinc-900" : "border-zinc-200"),
      )}
      style={featured ? { background: JERRYS_RED } : undefined}
    >
      <div className="flex items-start gap-3">
        <span className={cn("flex size-10 shrink-0 items-center justify-center rounded-xl", featured ? "bg-white/15 text-white" : "bg-red-50 text-red-700")}>
          <Icon aria-hidden size={19} />
        </span>
        <div className="min-w-0 flex-1">
          <p className="flex flex-wrap items-center gap-2">
            <span className={cn("font-bold", featured ? "jerrys-display text-lg" : "text-sm text-zinc-900")}>{a.title}</span>
            <span className={cn(BADGE, featured ? "bg-white text-red-700" : "border border-red-200 text-red-700")}>{jerrysDeck.copy.addonTag}</span>
          </p>
          <p className={cn("mt-1 text-xs leading-relaxed", featured ? "text-white sm:text-[13px]" : "text-zinc-500")}>{a.body}</p>
        </div>
        <Switch on={a.enabled} onChange={() => toggleAutomation(a.id)} label={`${a.title} ${a.enabled ? "on" : "off"}`} />
      </div>
      <div className="mt-auto flex flex-wrap items-center justify-between gap-2 pl-13">
        <Flow automation={a} light={featured} />
        {a.action && (
          <button
            type="button"
            onClick={() => runAutomation(a.id)}
            className={cn("inline-flex h-8 cursor-pointer items-center gap-1.5 rounded-full px-3 text-xs font-bold transition-colors", FOCUS, featured ? "bg-white text-zinc-900 hover:bg-zinc-100" : "bg-zinc-900 text-white hover:bg-black")}
          >
            <Play aria-hidden size={12} />
            {a.action}
          </button>
        )}
      </div>
    </article>
  );
}

/** The owner's WhatsApp chat with the POS, newest at the bottom. */
function Phone() {
  const { notifications } = useStore();
  const reduce = useReducedMotion();
  const scroller = React.useRef<HTMLDivElement>(null);
  const seen = React.useRef(notifications.length);
  React.useEffect(() => {
    scroller.current?.scrollTo({ top: scroller.current.scrollHeight, behavior: reduce || seen.current === notifications.length ? "auto" : "smooth" });
    seen.current = notifications.length;
  }, [notifications.length, reduce]);

  return (
    <div className="w-full max-w-[19rem] rounded-[2.5rem] bg-zinc-900 p-2.5 shadow-[0_24px_60px_rgba(0,0,0,.25)]">
      <div className="relative flex h-[30rem] flex-col overflow-hidden rounded-[2rem] bg-[#efeae2]">
        {/* Chat header. */}
        <div className="flex shrink-0 items-center gap-2.5 bg-[#075e54] px-3 pt-6 pb-2.5 text-white">
          <span aria-hidden className="absolute top-2 left-1/2 h-1.5 w-16 -translate-x-1/2 rounded-full bg-black/40" />
          {/* eslint-disable-next-line @next/next/no-img-element -- product logo inside the replica */}
          <img src={jerrysDeck.logo.src} alt="" className="size-8 rounded-full object-cover" />
          <span className="min-w-0">
            <span className="block truncate text-[13px] font-bold">{jerrysDeck.copy.phoneTitle}</span>
            <span className="block truncate text-[11px] text-white/80">{jerrysDeck.copy.phoneSubtitle}</span>
          </span>
        </div>
        <div ref={scroller} aria-live="polite" aria-label="Messages to the owner" className="flex min-h-0 flex-1 flex-col gap-2 overflow-y-auto px-2.5 py-3">
          <AnimatePresence initial={false}>
            {notifications.map((n) => {
              const Icon = KIND_ICON[n.kind];
              return (
                <motion.div
                  key={n.id}
                  initial={{ opacity: 0, y: reduce ? 0 : 10, scale: reduce ? 1 : 0.97 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                  className={cn("max-w-[92%] self-start rounded-xl rounded-tl-sm px-2.5 py-1.5 shadow-sm", n.minutesAgo === 0 ? "bg-[#dcf8c6]" : "bg-white")}
                >
                  <p className="flex items-center gap-1.5 text-[12px] font-bold text-zinc-900">
                    <Icon aria-hidden size={12} className="shrink-0 text-emerald-700" />
                    {n.title}
                  </p>
                  <p className="mt-0.5 text-[12px] leading-snug text-zinc-800">{n.body}</p>
                  <p className="mt-0.5 text-right text-[10px] text-zinc-500">{clockAt(n.minutesAgo)}</p>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}

/** A three step guide. Steps tick themselves off from store state. */
function TryIt({ onNavigate }: { onNavigate: (s: ScreenId) => void }) {
  const { notifications, runAutomation } = useStore();
  const fresh = notifications.filter((n) => n.minutesAgo === 0);
  const steps = [
    { label: "Sell something on the checkout", done: fresh.some((n) => n.kind === "sale"), run: () => onNavigate("checkout") },
    { label: "Close the drawer", done: fresh.some((n) => n.kind === "drawer" && n.title.startsWith("Drawer closed")), run: () => onNavigate("drawer") },
    { label: "Send a test WhatsApp order", done: fresh.some((n) => n.kind === "order_in"), run: () => runAutomation("whatsapp-orders") },
  ];
  return (
    <ol className="w-full max-w-[19rem] rounded-2xl border border-zinc-100 bg-white p-2">
      {steps.map((s, i) => (
        <li key={s.label}>
          <button type="button" onClick={s.run} className={cn("flex w-full cursor-pointer items-center gap-2.5 rounded-xl px-2 py-2 text-left hover:bg-zinc-50", FOCUS)}>
            <span className={cn("flex size-6 shrink-0 items-center justify-center rounded-full text-[11px] font-black", s.done ? "bg-emerald-600 text-white" : "bg-zinc-100 text-zinc-600")}>
              {s.done ? <Check aria-hidden size={13} strokeWidth={3} /> : i + 1}
            </span>
            <span className={cn("flex-1 text-[13px] font-semibold", s.done ? "text-zinc-500 line-through" : "text-zinc-800")}>{s.label}</span>
            <ArrowRight aria-hidden size={14} className="text-zinc-400" />
          </button>
        </li>
      ))}
    </ol>
  );
}
