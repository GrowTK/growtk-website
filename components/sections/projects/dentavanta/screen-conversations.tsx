"use client";

import * as React from "react";
import { FileText, Mail, MessageSquare, MessagesSquare, PhoneCall, Send, Stethoscope, Users } from "lucide-react";
import { cn } from "@/lib/utils";
import { dentavantaDeck, type Channel, type ContactRef, type DemoMessage } from "@/content/dentavanta";
import type { ScreenId } from "./app-frame";
import { relativeTime, useStore } from "./store";
import { Avatar, FOCUS, PageHeader, SearchInput, TabButton } from "./ui";

const CHANNEL_ICON: Record<Channel, typeof Mail> = { email: Mail, sms: MessageSquare, call: PhoneCall, form: FileText };
const CHANNEL_STYLES: Record<Channel, string> = {
  email: "bg-[#eaeef8] text-[#0636a6]",
  sms: "bg-violet-100 text-violet-600",
  call: "bg-[#e3f3ec] text-[#047857]",
  form: "bg-[#fef3e2] text-[#b45309]",
};

const key = (ref: ContactRef) => `${ref.kind}:${ref.id}`;

/** Conversations: a copy of components/conversations/conversations-page.tsx, the list on the left and the thread on the right. */
export function ConversationsScreen({ onNavigate }: { onNavigate: (s: ScreenId) => void }) {
  const { messages, contactName, lead, patient, sendMessage, setFocusPatient } = useStore();
  const copy = dentavantaDeck.conversations;
  const [search, setSearch] = React.useState("");
  const [kind, setKind] = React.useState<"all" | "lead" | "patient">("all");
  const [selected, setSelected] = React.useState<string | null>(null);
  const [channel, setChannel] = React.useState<"sms" | "email">("sms");
  const [draft, setDraft] = React.useState("");
  const scrollRef = React.useRef<HTMLDivElement>(null);

  // One conversation per contact, newest first. Ties (fresh messages at "now") go to the later message.
  const conversations = React.useMemo(() => {
    const map = new Map<string, { ref: ContactRef; items: { m: DemoMessage; i: number }[] }>();
    messages.forEach((m, i) => {
      const k = key(m.contact);
      const entry = map.get(k) ?? { ref: m.contact, items: [] };
      entry.items.push({ m, i });
      map.set(k, entry);
    });
    const list = [...map.values()].map((c) => {
      const sorted = [...c.items].sort((a, b) => b.m.minutesAgo - a.m.minutesAgo || a.i - b.i);
      return { ref: c.ref, thread: sorted.map((x) => x.m), last: sorted[sorted.length - 1]! };
    });
    return list.sort((a, b) => a.last.m.minutesAgo - b.last.m.minutesAgo || b.last.i - a.last.i);
  }, [messages]);

  const filtered = conversations.filter((c) => (kind === "all" || c.ref.kind === kind) && contactName(c.ref).toLowerCase().includes(search.trim().toLowerCase()));
  const current = conversations.find((c) => key(c.ref) === selected) ?? filtered[0] ?? null;
  const currentName = current ? contactName(current.ref) : "";
  const phone = current ? (current.ref.kind === "lead" ? lead(current.ref.id)?.phone : patient(current.ref.id)?.phone) : undefined;

  React.useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [current?.thread.length, selected]);

  const send = (e: React.FormEvent) => {
    e.preventDefault();
    if (!current || !draft.trim()) return;
    sendMessage(current.ref, channel, draft.trim());
    setDraft("");
  };

  return (
    <div className="flex h-full min-h-0 flex-col gap-4">
      <PageHeader icon={MessagesSquare} avatarName={current ? currentName : undefined} title={current ? currentName : copy.title} subtitle={current ? (phone ?? "") : copy.subtitle}>
        <SearchInput value={search} onChange={setSearch} placeholder={copy.search} />
        {current?.ref.kind === "patient" && (
          <button
            type="button"
            onClick={() => {
              setFocusPatient(current.ref.id);
              onNavigate("patients");
            }}
            className={cn("flex h-10 cursor-pointer items-center gap-1.5 rounded-lg bg-[#f1f3f8] px-3.5 text-sm font-medium text-[#6b7280] transition hover:text-[#0a0a0a]", FOCUS)}
          >
            <Stethoscope aria-hidden className="size-4" /> <span className="hidden sm:inline">{dentavantaDeck.patientsScreen.drawer.subtitle}</span>
          </button>
        )}
      </PageHeader>

      <div className="grid min-h-[30rem] flex-1 gap-4 lg:grid-cols-[320px_1fr]">
        <div className="flex max-h-72 min-h-0 flex-col gap-2 rounded-xl bg-white p-2.5 lg:max-h-none">
          <div className="flex flex-wrap items-center gap-1 border-b border-[#e6e8ec] pb-2">
            <TabButton active={kind === "all"} onClick={() => setKind("all")}>
              {copy.all}
            </TabButton>
            <TabButton active={kind === "lead"} onClick={() => setKind("lead")}>
              <Users aria-hidden className="size-3" /> {copy.leads}
            </TabButton>
            <TabButton active={kind === "patient"} onClick={() => setKind("patient")}>
              <Stethoscope aria-hidden className="size-3" /> {copy.patients}
            </TabButton>
          </div>
          <ul className="min-h-0 flex-1 overflow-y-auto">
            {filtered.length === 0 && <li className="px-4 py-10 text-center text-sm text-[#6b7280]">{copy.empty}</li>}
            {filtered.map((c) => {
              const name = contactName(c.ref);
              const Icon = CHANNEL_ICON[c.last.m.channel];
              const active = current && key(current.ref) === key(c.ref);
              return (
                <li key={key(c.ref)}>
                  <button
                    type="button"
                    onClick={() => setSelected(key(c.ref))}
                    aria-current={active ? "true" : undefined}
                    className={cn("flex w-full cursor-pointer items-start gap-3 rounded-lg px-2.5 py-2.5 text-left transition", FOCUS, active ? "bg-[#eaeef8]" : "hover:bg-[#f1f3f8]")}
                  >
                    <Avatar name={name} />
                    <span className="min-w-0 flex-1">
                      <span className="flex items-center justify-between gap-2">
                        <span className="truncate text-sm font-medium">{name}</span>
                        <span className="shrink-0 text-[11px] text-[#6b7280]">{relativeTime(c.last.m.minutesAgo)}</span>
                      </span>
                      <span className="mt-0.5 flex items-center gap-1.5">
                        <span className={cn("flex size-5 shrink-0 items-center justify-center rounded-md", CHANNEL_STYLES[c.last.m.channel])}>
                          <Icon aria-hidden className="size-3" />
                        </span>
                        <span className="truncate text-xs text-[#6b7280]">{c.last.m.body}</span>
                      </span>
                    </span>
                  </button>
                </li>
              );
            })}
          </ul>
        </div>

        <div className="flex min-h-[24rem] flex-col overflow-hidden rounded-xl bg-white">
          <div ref={scrollRef} className="min-h-0 flex-1 overflow-y-auto p-4">
            <div className="flex flex-col gap-3">{current?.thread.map((m) => <Bubble key={m.id} m={m} />)}</div>
          </div>
          <form onSubmit={send} className="flex shrink-0 flex-col gap-2 border-t border-[#e6e8ec] p-3">
            <div className="flex gap-1">
              <TabButton active={channel === "sms"} onClick={() => setChannel("sms")}>
                <MessageSquare aria-hidden className="size-3" /> {copy.sms}
              </TabButton>
              <TabButton active={channel === "email"} onClick={() => setChannel("email")}>
                <Mail aria-hidden className="size-3" /> {copy.email}
              </TabButton>
            </div>
            <div className="flex items-end gap-2">
              <textarea
                value={draft}
                onChange={(e) => setDraft(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) send(e);
                }}
                rows={1}
                placeholder={channel === "sms" ? copy.composer : copy.composerEmail}
                aria-label={channel === "sms" ? copy.composer : copy.composerEmail}
                className="max-h-32 min-h-10 flex-1 resize-none rounded-2xl border border-[#e6e8ec] bg-[#f1f3f8] px-4 py-2.5 text-sm outline-none transition focus:border-[#0636a6] focus:bg-white focus:ring-2 focus:ring-[#0636a6]/20"
              />
              <button
                type="submit"
                disabled={!draft.trim() || !current}
                aria-label={copy.send}
                className={cn("flex size-10 shrink-0 cursor-pointer items-center justify-center rounded-full bg-[#0636a6] text-white transition hover:bg-[#052e8d] disabled:cursor-not-allowed disabled:opacity-50", FOCUS)}
              >
                <Send aria-hidden className="size-4" />
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

function Bubble({ m }: { m: DemoMessage }) {
  const copy = dentavantaDeck.conversations;
  const outbound = m.from !== "contact";
  const meta = `${outbound ? copy.fromLabels[m.from as Exclude<typeof m.from, "contact">] : ""}${outbound ? " · " : ""}${relativeTime(m.minutesAgo)}`;

  if (m.channel === "call" || m.channel === "form") {
    const Icon = CHANNEL_ICON[m.channel];
    const mins = m.durationSeconds ? `${Math.floor(m.durationSeconds / 60)}m ${m.durationSeconds % 60}s` : null;
    return (
      <div className="mx-auto w-full max-w-md rounded-xl border border-[#e6e8ec] p-3.5">
        <div className="flex items-center gap-2">
          <span className={cn("flex size-7 items-center justify-center rounded-lg", CHANNEL_STYLES[m.channel])}>
            <Icon aria-hidden className="size-3.5" />
          </span>
          <span className="text-sm font-semibold">{m.channel === "call" ? copy.call : copy.form}</span>
          {m.outcome && <span className="rounded-full bg-[#f1f3f8] px-2 py-0.5 text-[11px] font-medium text-[#6b7280]">{m.outcome}</span>}
          {mins && <span className="text-[11px] text-[#6b7280]">{mins}</span>}
          <span className="ml-auto text-[11px] text-[#6b7280]">{meta}</span>
        </div>
        <p className="mt-2 text-sm text-[#0a0a0a]">{m.body}</p>
      </div>
    );
  }

  const Icon = CHANNEL_ICON[m.channel];
  return (
    <div className={cn("flex", outbound ? "justify-end" : "justify-start")}>
      <div className={cn("max-w-[78%] rounded-2xl px-3.5 py-2.5 text-sm", outbound ? "bg-[#0636a6] text-white" : "bg-[#f1f3f8] text-[#0a0a0a]")}>
        <p className="whitespace-pre-wrap">{m.body}</p>
        <p className={cn("mt-1 flex items-center gap-1 text-[11px]", outbound ? "text-white/75" : "text-[#6b7280]")}>
          <Icon aria-hidden className="size-3" /> {meta}
        </p>
      </div>
    </div>
  );
}
