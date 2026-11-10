import type { ReactNode } from "react";
import Link from "next/link";
import { ArrowUpRight, Bot, CheckCircle2, FileStack, Mail, MessageCircle, MessageSquare, Phone, ShoppingBag, Smartphone } from "lucide-react";
import { Icon } from "@/components/sections/icon";
import { Reveal, RevealGroup, RevealItem } from "@/components/magic/reveal";
import type { Feature, SectionHeading } from "@/content/types";
import type { StoreOps } from "@/content/industry-pages";
import { cn } from "@/lib/utils";

/**
 * Bespoke sections for the seven industry pages: the challenges as a split
 * index, the operation beside a pinned live visual, the services as linked
 * cards, the AI agent jobs styled as incoming notifications, and (ecommerce
 * only) the store work run behind the inbox.
 */

type Point = { title: string; body: string };

function Head({ heading, center = false }: { heading: SectionHeading; center?: boolean }) {
  return (
    <Reveal className={cn("max-w-3xl", center && "mx-auto text-center")}>
      {heading.eyebrow ? <p className="eyebrow text-primary">{heading.eyebrow}</p> : null}
      <h2 className="mt-4 font-display text-4xl font-bold leading-[1.04] tracking-tight text-balance text-foreground sm:text-5xl">{heading.title}</h2>
      {heading.body ? <p className={cn("mt-5 text-base leading-relaxed text-muted-foreground sm:text-lg", center && "mx-auto max-w-2xl")}>{heading.body}</p> : null}
    </Reveal>
  );
}

/* ------------------------------- Challenges -------------------------------- */

export function ChallengeGrid({ heading, items, gradient }: { heading: SectionHeading; items: Feature[]; gradient: string }) {
  return (
    <section className="bg-background px-6 py-20 sm:px-10 lg:py-28">
      <div className="mx-auto max-w-7xl">
        <Head heading={heading} />
        <RevealGroup className="mt-14 grid gap-px overflow-hidden rounded-[1.75rem] border border-border bg-border sm:grid-cols-2 lg:grid-cols-3" stagger={0.06}>
          {items.map((c, i) => (
            <RevealItem key={c.title} className="h-full">
              <article className="group relative isolate flex h-full flex-col bg-card p-8 lg:p-9">
                <span aria-hidden className="absolute inset-0 -z-10 opacity-0 transition-opacity duration-500 group-hover:opacity-100" style={{ backgroundImage: gradient }} />
                <div className="flex items-center justify-between">
                  <span className="grid size-12 place-items-center rounded-2xl bg-[#26262a] text-white transition-transform duration-300 group-hover:-rotate-6">
                    <Icon name={c.icon} className="size-5" />
                  </span>
                  <span className="font-display text-4xl font-bold leading-none tracking-tighter text-transparent [-webkit-text-stroke:1.2px_rgb(38_38_42/0.25)]">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                </div>
                <h3 className="mt-8 font-display text-xl font-bold tracking-tight text-balance text-foreground">{c.title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground group-hover:text-[#26262a]/80">{c.body}</p>
              </article>
            </RevealItem>
          ))}
        </RevealGroup>
      </div>
    </section>
  );
}

/* ---------------------------- Inside the operation ------------------------- */

export function InsideSplit({ heading, points, gradient, visual }: { heading: SectionHeading; points: Point[]; gradient: string; visual: ReactNode }) {
  return (
    <section className="bg-background px-6 py-20 sm:px-10 lg:py-28">
      <div className="mx-auto grid max-w-7xl gap-12 lg:grid-cols-[1.05fr_1fr] lg:gap-16">
        <div className="lg:sticky lg:top-28 lg:self-start">
          <div className="relative overflow-hidden rounded-[2rem] p-6 sm:p-10" style={{ backgroundImage: gradient }}>
            <div aria-hidden className="absolute inset-0 opacity-[0.35] [background-image:radial-gradient(rgb(38_38_42/0.18)_1px,transparent_1px)] [background-size:18px_18px]" />
            <div className="relative mx-auto max-w-lg">{visual}</div>
          </div>
        </div>
        <div className="flex flex-col justify-center">
          <Head heading={heading} />
          <ol className="mt-10 space-y-4">
            {points.map((p, i) => (
              <Reveal as="li" key={p.title} delay={i * 0.08}>
                <div className="flex gap-5 rounded-2xl border border-border bg-card p-6">
                  <span className="grid size-10 shrink-0 place-items-center rounded-full bg-[#26262a] font-display text-sm font-bold text-white">{i + 1}</span>
                  <div>
                    <h3 className="font-display text-lg font-bold tracking-tight text-foreground">{p.title}</h3>
                    <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">{p.body}</p>
                  </div>
                </div>
              </Reveal>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}

/* ----------------------------- Store management ---------------------------- */

export function StoreOpsSplit({ data, gradient }: { data: StoreOps; gradient: string }) {
  return (
    <section className="bg-background px-6 py-20 sm:px-10 lg:py-28">
      <div className="mx-auto grid max-w-7xl gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:gap-16">
        <div className="lg:sticky lg:top-28 lg:self-start">
          <Head heading={data.heading} />
          <Reveal delay={0.1} className="mt-10">
            <div className="relative overflow-hidden rounded-[1.75rem] bg-[#1A1A1A] p-7 sm:p-8">
              <div aria-hidden className="pointer-events-none absolute -right-20 -top-20 size-64 rounded-full opacity-30 blur-3xl" style={{ backgroundImage: gradient }} />
              <div className="relative flex items-center gap-4">
                <span className="grid size-12 place-items-center rounded-2xl text-[#26262a]" style={{ backgroundImage: gradient }}>
                  <ShoppingBag aria-hidden className="size-5" />
                </span>
                <p className="font-display text-2xl font-bold tracking-tight text-white">{data.platform.name}</p>
              </div>
              <p className="relative mt-4 text-sm leading-relaxed text-white/70">{data.platform.body}</p>
              <ul className="relative mt-6 flex flex-wrap gap-2">
                {data.platform.tools.map((t) => (
                  <li key={t} className="rounded-full bg-white/10 px-3 py-1.5 text-xs font-semibold text-white/85 ring-1 ring-white/10">
                    {t}
                  </li>
                ))}
              </ul>
            </div>
            <p className="eyebrow mt-8 text-muted-foreground">{data.alsoLabel}</p>
            <ul className="mt-3 flex flex-wrap gap-2">
              {data.also.map((t) => (
                <li key={t} className="rounded-full border border-border bg-card px-3.5 py-1.5 text-sm font-medium text-foreground">
                  {t}
                </li>
              ))}
            </ul>
          </Reveal>
        </div>
        <ol className="divide-y divide-border overflow-hidden rounded-[1.75rem] border border-border bg-card">
          {data.items.map((it, i) => (
            <Reveal as="li" key={it.title} delay={i * 0.06}>
              <div className="group flex gap-5 p-6 transition-colors duration-300 hover:bg-muted/40 sm:gap-6 sm:p-8">
                <span className="grid size-12 shrink-0 place-items-center rounded-2xl text-[#26262a] transition-transform duration-300 group-hover:-rotate-6" style={{ backgroundImage: gradient }}>
                  <Icon name={it.icon} className="size-5" />
                </span>
                <div className="min-w-0">
                  <p className="eyebrow text-muted-foreground">
                    {String(i + 1).padStart(2, "0")} · {it.tag}
                  </p>
                  <h3 className="mt-2 font-display text-xl font-bold tracking-tight text-foreground">{it.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{it.body}</p>
                </div>
              </div>
            </Reveal>
          ))}
        </ol>
      </div>
    </section>
  );
}

/* ------------------------------ Services links ----------------------------- */

export function ServiceLinkGrid({ heading, items, learnMore, gradient }: { heading: SectionHeading; items: { name: string; icon: string; href: string; body: string }[]; learnMore: string; gradient: string }) {
  return (
    <section className="bg-background px-6 py-20 sm:px-10 lg:py-28">
      <div className="mx-auto max-w-7xl">
        <Head heading={heading} center />
        <RevealGroup className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-3" stagger={0.06}>
          {items.map((s) => (
            <RevealItem key={s.href}>
              <Link
                href={s.href}
                className="group flex h-full cursor-pointer flex-col rounded-[1.5rem] border border-border bg-card p-7 transition duration-300 ease-out hover:-translate-y-1 hover:border-transparent hover:shadow-[0_30px_60px_-40px_rgb(38_38_42/0.5)] focus-visible:ring-2 focus-visible:ring-[#26262a] focus-visible:ring-offset-2 focus-visible:outline-none"
              >
                <div className="flex items-start justify-between">
                  <span className="grid size-12 place-items-center rounded-2xl text-[#26262a]" style={{ backgroundImage: gradient }}>
                    <Icon name={s.icon} className="size-5" />
                  </span>
                  <span className="grid size-9 place-items-center rounded-full border border-border transition duration-300 group-hover:rotate-45 group-hover:border-[#26262a] group-hover:bg-[#26262a] group-hover:text-white">
                    <ArrowUpRight aria-hidden className="size-4" />
                  </span>
                </div>
                <h3 className="mt-6 font-display text-xl font-bold tracking-tight text-foreground">{s.name}</h3>
                <p className="mt-2 flex-1 text-sm leading-relaxed text-muted-foreground">{s.body}</p>
                <span className="mt-6 text-sm font-semibold text-foreground underline-offset-4 group-hover:underline">{learnMore}</span>
              </Link>
            </RevealItem>
          ))}
        </RevealGroup>
      </div>
    </section>
  );
}

/* -------------------------------- Use cases -------------------------------- */

const CHANNEL_ICON: Record<string, typeof Phone> = {
  voice: Phone,
  phone: Phone,
  whatsapp: MessageCircle,
  chat: MessageSquare,
  email: Mail,
  sms: Smartphone,
  "back office": FileStack,
};

export function UseCaseFeed({ heading, items, doneLabel }: { heading: SectionHeading; items: { title: string; body: string; channel: string }[]; doneLabel: string }) {
  return (
    <section className="bg-background px-4 py-12 sm:px-6 lg:py-16">
      <div className="relative mx-auto max-w-7xl overflow-hidden rounded-[2rem] bg-[#1A1A1A] px-6 py-14 sm:px-10 lg:px-14 lg:py-20">
        <div aria-hidden className="pointer-events-none absolute -right-32 -top-32 size-[30rem] rounded-full bg-[#FFDE59]/10 blur-3xl" />
        <Reveal className="relative max-w-3xl">
          {heading.eyebrow ? <p className="eyebrow text-[#FFDE59]">{heading.eyebrow}</p> : null}
          <h2 className="mt-4 font-display text-4xl font-bold leading-[1.04] tracking-tight text-balance text-white sm:text-5xl">{heading.title}</h2>
          {heading.body ? <p className="mt-5 text-base leading-relaxed text-white/65 sm:text-lg">{heading.body}</p> : null}
        </Reveal>
        <RevealGroup className="relative mt-12 grid gap-4 md:grid-cols-2 lg:grid-cols-3" stagger={0.07}>
          {items.map((u) => {
            const Ico = CHANNEL_ICON[u.channel.toLowerCase()] ?? Bot;
            return (
              <RevealItem key={u.title}>
                <article className="group h-full rounded-2xl bg-white/[0.06] p-5 ring-1 ring-white/10 backdrop-blur transition duration-300 hover:-translate-y-1 hover:bg-white/[0.09]">
                  <div className="flex items-center justify-between gap-3">
                    <span className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-xs font-semibold text-white/85">
                      <Ico aria-hidden className="size-3.5" />
                      {u.channel}
                    </span>
                    <span className="inline-flex items-center gap-1.5 text-xs font-medium text-[#9FE3B4]">
                      <CheckCircle2 aria-hidden className="size-3.5" />
                      {doneLabel}
                    </span>
                  </div>
                  <h3 className="mt-5 font-display text-lg font-bold tracking-tight text-white">{u.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-white/60">{u.body}</p>
                </article>
              </RevealItem>
            );
          })}
        </RevealGroup>
      </div>
    </section>
  );
}
