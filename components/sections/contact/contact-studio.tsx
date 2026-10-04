"use client";

import * as React from "react";
import { ArrowRight, Check, Clock, Copy, Globe, Mail, Mic, Plug, Puzzle, Search, UserRound, Workflow, HelpCircle, type LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { brand } from "@/brand.config";
import { Reveal } from "@/components/magic/reveal";
import { IsoGrid } from "@/components/sections/industries/iso-grid";
import { toneGradient } from "@/components/sections/industries/industry-tones";
import { Wash, washTone, type WashName } from "@/components/sections/company/wash";
import type { SectionHeading } from "@/content/types";

const SERVICE_ICON: Record<string, LucideIcon> = {
  "website-redesign": Globe,
  seo: Search,
  widgets: Puzzle,
  automation: Workflow,
  "voice-agents": Mic,
  integrations: Plug,
};

/** Picked chips light up in rotating washes, so a multi-pick reads as a colourful set, not one block. */
const CHIP_WASH: WashName[] = ["lilac", "peach", "apricot", "sunset", "blob"];

type Copy = {
  direct: { label: string; copy: string; copied: string; reply: string; who: string };
  form: {
    title: string;
    servicesLabel: string;
    notSure: string;
    tradeLabel: string;
    tradePlaceholder: string;
    tradeOther: string;
    phoneLabel: string;
    phonePlaceholder: string;
    nameLabel: string;
    namePlaceholder: string;
    practiceLabel: string;
    practicePlaceholder: string;
    emailLabel: string;
    emailPlaceholder: string;
    messageLabel: string;
    messagePlaceholder: string;
    submitLabel: string;
    sendingLabel: string;
    sent: string;
    opened: string;
    disclaimer: string;
  };
};

const field =
  "w-full rounded-md border border-border bg-background px-4 py-3 text-sm text-foreground transition duration-200 ease-out placeholder:text-muted-foreground hover:border-foreground/30 focus-visible:border-foreground focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none";
const label = "mb-1.5 block text-sm font-medium text-foreground";

/**
 * The contact page as one studio on the lilac wash: the ask and a direct email
 * card (with copy-to-clipboard) on the left, the inquiry form on a white card
 * on the right. Visitors pick services as chips and their trade from a list,
 * so the email arrives already sorted. Submitting posts to /api/contact, which
 * emails the team through Resend; if that fails, it falls back to a mailto:
 * link in the visitor's own email app so the inquiry is never lost.
 */
export function ContactStudio({ heading, copy, services, trades }: {
  heading: SectionHeading;
  copy: Copy;
  services: { id: string; title: string }[];
  trades: string[];
}) {
  const f = copy.form;
  const [picked, setPicked] = React.useState<string[]>([]);
  const [trade, setTrade] = React.useState("");
  const [name, setName] = React.useState("");
  const [business, setBusiness] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [phone, setPhone] = React.useState("");
  const [message, setMessage] = React.useState("");
  const [opened, setOpened] = React.useState(false);
  const [status, setStatus] = React.useState<"idle" | "sending" | "sent">("idle");
  const [website, setWebsite] = React.useState(""); // honeypot: real people never see it
  const [copied, setCopied] = React.useState(false);

  const toggle = (t: string) => setPicked((p) => (p.includes(t) ? p.filter((x) => x !== t) : [...p, t]));

  async function copyEmail() {
    try {
      await navigator.clipboard.writeText(brand.contact.email);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1800);
    } catch {
      window.location.href = `mailto:${brand.contact.email}`;
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (status === "sending") return;
    setStatus("sending");
    setOpened(false);
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, business, email, phone, trade, message, services: picked, website }),
      });
      if (res.ok) {
        setStatus("sent");
        return;
      }
    } catch {
      // fall through to the email app
    }
    setStatus("idle");
    const subject = `Inquiry from ${business || name}`;
    const body = [
      `Name: ${name}`,
      `Business: ${business}`,
      `Trade: ${trade || "(not given)"}`,
      `Email: ${email}`,
      `Phone: ${phone || "(not given)"}`,
      `Interested in: ${picked.length ? picked.join(", ") : "(not given)"}`,
      "",
      message || "(No additional message.)",
    ].join("\n");
    window.location.href = `mailto:${brand.contact.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    setOpened(true);
  }

  const chip = (value: string, Icon: LucideIcon, n: number) => {
    const on = picked.includes(value);
    const tone = washTone(CHIP_WASH[n % CHIP_WASH.length]!);
    return (
      <button
        key={value}
        type="button"
        aria-pressed={on}
        onClick={() => toggle(value)}
        className={cn(
          "inline-flex cursor-pointer items-center gap-2 rounded-md border px-3 py-2 text-sm font-semibold text-foreground transition duration-200 ease-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
          on ? "border-transparent shadow-sm" : "border-border bg-background hover:border-foreground/30",
        )}
        style={on ? { background: toneGradient(tone) } : undefined}
      >
        {on ? <Check aria-hidden className="size-4" strokeWidth={2.5} /> : <Icon aria-hidden className="size-4 text-muted-foreground" strokeWidth={1.75} />}
        {value}
      </button>
    );
  };

  return (
    <section data-nav-theme="light" className="relative isolate overflow-hidden">
      <Wash name="lilac" />
      <div className="relative mx-auto grid max-w-7xl gap-10 px-6 py-14 sm:px-10 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] lg:gap-14 lg:py-20">
        {/* The ask, and a direct line */}
        <div className="flex flex-col text-[#26262a] lg:py-6">
          <Reveal>
            {heading.eyebrow ? <p className="eyebrow text-[#26262a]/70">{heading.eyebrow}</p> : null}
            <h1 className="mt-4 font-display text-5xl leading-[0.95] font-bold tracking-tight text-balance sm:text-6xl lg:text-7xl">{heading.title}</h1>
            {heading.body ? <p className="mt-6 max-w-lg text-lg leading-relaxed text-[#26262a]/80">{heading.body}</p> : null}
          </Reveal>

          <Reveal delay={0.08} className="mt-10 lg:mt-auto">
            <div className="relative overflow-hidden rounded-md bg-white p-6 shadow-[0_18px_48px_rgba(0,0,0,.10)]">
              <IsoGrid className="opacity-60" />
              <p className="relative font-mono text-xs font-medium text-muted-foreground">{copy.direct.label}</p>
              <div className="relative mt-3 flex flex-wrap items-center gap-3">
                <a
                  href={`mailto:${brand.contact.email}`}
                  className="inline-flex cursor-pointer items-center gap-3 rounded-md font-display text-2xl font-bold tracking-tight text-[#26262a] underline-offset-4 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring sm:text-3xl"
                >
                  <Mail aria-hidden className="size-6 shrink-0" strokeWidth={1.75} />
                  {brand.contact.email}
                </a>
                <button
                  type="button"
                  onClick={copyEmail}
                  aria-label={`${copy.direct.copy} ${brand.contact.email}`}
                  className="inline-flex cursor-pointer items-center gap-1.5 rounded-md border border-border bg-card px-2.5 py-1.5 text-xs font-semibold text-foreground transition-colors hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                >
                  {copied ? <Check aria-hidden className="size-3.5" strokeWidth={2.5} /> : <Copy aria-hidden className="size-3.5" />}
                  <span aria-live="polite">{copied ? copy.direct.copied : copy.direct.copy}</span>
                </button>
              </div>
              <ul className="relative mt-5 grid gap-2.5 text-sm text-foreground/80">
                <li className="flex items-center gap-2.5">
                  <Clock aria-hidden className="size-4 shrink-0" strokeWidth={1.75} />
                  {copy.direct.reply}
                </li>
                <li className="flex items-center gap-2.5">
                  <UserRound aria-hidden className="size-4 shrink-0" strokeWidth={1.75} />
                  {copy.direct.who}
                </li>
              </ul>
            </div>
          </Reveal>
        </div>

        {/* The form */}
        <Reveal delay={0.12}>
          <form onSubmit={handleSubmit} className="rounded-[20px] bg-white p-6 shadow-2xl sm:p-8 lg:p-10">
            <p className="font-display text-2xl font-bold tracking-tight text-[#26262a]">{f.title}</p>

            <fieldset className="mt-7">
              <legend className={label}>{f.servicesLabel}</legend>
              <div className="mt-1 flex flex-wrap gap-2">
                {services.map((s, n) => chip(s.title, SERVICE_ICON[s.id] ?? Plug, n))}
                {chip(f.notSure, HelpCircle, services.length)}
              </div>
            </fieldset>

            <div className="mt-6">
              <label htmlFor="ct-trade" className={label}>{f.tradeLabel}</label>
              <select id="ct-trade" value={trade} onChange={(e) => setTrade(e.target.value)} className={cn(field, "cursor-pointer", !trade && "text-muted-foreground")}>
                <option value="">{f.tradePlaceholder}</option>
                {trades.map((t) => (
                  <option key={t} value={t}>{t}</option>
                ))}
                <option value={f.tradeOther}>{f.tradeOther}</option>
              </select>
            </div>

            <div className="mt-6 grid gap-6 sm:grid-cols-2">
              <div>
                <label htmlFor="ct-name" className={label}>{f.nameLabel}</label>
                <input id="ct-name" type="text" required autoComplete="name" value={name} onChange={(e) => setName(e.target.value)} placeholder={f.namePlaceholder} className={field} />
              </div>
              <div>
                <label htmlFor="ct-business" className={label}>{f.practiceLabel}</label>
                <input id="ct-business" type="text" required autoComplete="organization" value={business} onChange={(e) => setBusiness(e.target.value)} placeholder={f.practicePlaceholder} className={field} />
              </div>
              <div>
                <label htmlFor="ct-email" className={label}>{f.emailLabel}</label>
                <input id="ct-email" type="email" required autoComplete="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder={f.emailPlaceholder} className={field} />
              </div>
              <div>
                <label htmlFor="ct-phone" className={label}>{f.phoneLabel}</label>
                <input id="ct-phone" type="tel" autoComplete="tel" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder={f.phonePlaceholder} className={field} />
              </div>
            </div>

            <div className="mt-6">
              <label htmlFor="ct-message" className={label}>{f.messageLabel}</label>
              <textarea id="ct-message" rows={4} value={message} onChange={(e) => setMessage(e.target.value)} placeholder={f.messagePlaceholder} className={cn(field, "resize-y")} />
            </div>

            {/* Honeypot: hidden from people and screen readers, irresistible to bots. */}
            <input
              type="text"
              name="website"
              tabIndex={-1}
              autoComplete="off"
              aria-hidden="true"
              value={website}
              onChange={(e) => setWebsite(e.target.value)}
              className="absolute -left-[9999px] h-0 w-0 opacity-0"
            />

            <button
              type="submit"
              disabled={status !== "idle"}
              className="group mt-8 flex w-full cursor-pointer items-center justify-between gap-3 rounded-md bg-[#26262a] py-2.5 pr-2.5 pl-6 text-base font-semibold text-white transition duration-200 ease-out hover:-translate-y-0.5 hover:shadow-xl focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-70 disabled:hover:translate-y-0"
            >
              {status === "sending" ? f.sendingLabel : status === "sent" ? <Check aria-hidden className="size-5" strokeWidth={2.5} /> : f.submitLabel}
              <span className="relative isolate flex size-10 items-center justify-center overflow-hidden rounded-md text-[#26262a]">
                <Wash name="sunset" />
                <ArrowRight aria-hidden className="size-5 transition-transform duration-200 group-hover:translate-x-0.5" />
              </span>
            </button>

            <p aria-live="polite" className="mt-4 text-xs leading-relaxed text-muted-foreground">
              {status === "sent"
                ? f.sent.replace("{name}", name.split(" ")[0] || name).replace("{email}", brand.contact.email)
                : opened
                  ? f.opened.replace("{email}", brand.contact.email)
                  : f.disclaimer}
            </p>
          </form>
        </Reveal>
      </div>
    </section>
  );
}
