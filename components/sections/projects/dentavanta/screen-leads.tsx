"use client";

import * as React from "react";
import { CalendarPlus, LayoutGrid, List, Mail, MessageSquare, PencilLine, Phone, PhoneCall, Plus, FileText, Stethoscope, Users } from "lucide-react";
import { cn } from "@/lib/utils";
import { dentavantaDeck, type DemoLead, type DemoMessage, type LeadStageId } from "@/content/dentavanta";
import type { ScreenId } from "./app-frame";
import { formatCardDate, relativeTime, useStore } from "./store";
import { Avatar, BTN_SOFT, Drawer, DrawerSection, EmptyDots, FOCUS, PageHeader, SearchInput, ViewToggle, lightenHex, BTN_PRIMARY } from "./ui";

/** Leads: a copy of components/leads/leads-page.tsx and leads-kanban.tsx. Stage headers sit above each card column. */
export function LeadsScreen({ onNavigate }: { onNavigate: (s: ScreenId) => void }) {
  const { leads, moveLead, askWalkthrough } = useStore();
  const d = dentavantaDeck;
  const copy = d.leadsScreen;
  const [search, setSearch] = React.useState("");
  const [openId, setOpenId] = React.useState<string | null>(null);
  const [dragId, setDragId] = React.useState<string | null>(null);
  const [overStage, setOverStage] = React.useState<LeadStageId | null>(null);

  const filtered = React.useMemo(() => {
    const q = search.trim().toLowerCase();
    const list = [...leads].sort((a, b) => a.createdDaysAgo - b.createdDaysAgo);
    return q ? list.filter((l) => `${l.firstName} ${l.lastName} ${l.phone}`.toLowerCase().includes(q)) : list;
  }, [leads, search]);

  const drop = (stageId: LeadStageId) => {
    if (dragId) moveLead(dragId, stageId);
    setDragId(null);
    setOverStage(null);
  };

  return (
    <div className="flex h-full min-h-0 flex-col gap-4">
      <PageHeader icon={Users} title={copy.title} subtitle={copy.subtitle}>
        <SearchInput value={search} onChange={setSearch} placeholder={copy.search} />
        <ViewToggle
          options={[
            { value: "board", label: copy.board, icon: LayoutGrid },
            { value: "list", label: copy.list, icon: List },
          ]}
          value="board"
          onChange={(v) => v === "list" && askWalkthrough("The list view")}
        />
        <button type="button" onClick={() => askWalkthrough("Editing stages")} className={BTN_SOFT}>
          <PencilLine aria-hidden className="size-4" /> <span className="hidden sm:inline">{copy.editStages}</span>
        </button>
      </PageHeader>

      <div className="flex min-h-[28rem] flex-1 gap-4 overflow-x-auto pt-1 pb-2">
        {d.stages.map((stage) => {
          const items = filtered.filter((l) => l.stageId === stage.id);
          const isOver = overStage === stage.id && dragId !== null;
          return (
            <div key={stage.id} className="flex w-64 shrink-0 flex-col gap-2 xl:w-72">
              <div className="flex items-center gap-2 rounded-md px-3 py-2.5" style={{ backgroundColor: lightenHex(stage.color, 0.15) }}>
                <span className="truncate text-sm font-semibold text-white">{stage.name}</span>
                <span className="text-xs font-medium text-white/80 tabular-nums">{items.length}</span>
              </div>
              <div
                onDragOver={(e) => {
                  e.preventDefault();
                  if (overStage !== stage.id) setOverStage(stage.id);
                }}
                onDragLeave={(e) => {
                  if (!e.currentTarget.contains(e.relatedTarget as Node)) setOverStage(null);
                }}
                onDrop={(e) => {
                  e.preventDefault();
                  drop(stage.id);
                }}
                className={cn("flex min-h-0 flex-1 flex-col gap-2.5 overflow-y-auto rounded-md border-2 transition-colors", isOver ? "border-dashed border-[#0636a6]/50 p-2" : "border-transparent p-0")}
              >
                {items.length === 0 ? (
                  <EmptyDots label={copy.empty} />
                ) : (
                  items.map((lead) => (
                    <LeadCard
                      key={lead.id}
                      lead={lead}
                      dragging={dragId === lead.id}
                      onOpen={() => setOpenId(lead.id)}
                      onDragStart={() => setDragId(lead.id)}
                      onDragEnd={() => {
                        setDragId(null);
                        setOverStage(null);
                      }}
                    />
                  ))
                )}
              </div>
            </div>
          );
        })}
        <div className="w-64 shrink-0 xl:w-72">
          <button type="button" onClick={() => askWalkthrough("Adding a stage")} className={cn("flex w-full cursor-pointer items-center justify-center gap-2 rounded-md bg-white px-4 py-3 text-sm font-medium text-[#6b7280] transition hover:text-[#0a0a0a]", FOCUS)}>
            <Plus aria-hidden className="size-4" /> {copy.addStage}
          </button>
        </div>
      </div>

      <LeadDrawer leadId={openId} onClose={() => setOpenId(null)} onNavigate={onNavigate} />
    </div>
  );
}

function LeadCard({ lead, dragging, onOpen, onDragStart, onDragEnd }: { lead: DemoLead; dragging: boolean; onOpen: () => void; onDragStart: () => void; onDragEnd: () => void }) {
  return (
    <button
      type="button"
      draggable
      onDragStart={(e) => {
        e.dataTransfer.effectAllowed = "move";
        e.dataTransfer.setData("text/plain", lead.id);
        onDragStart();
      }}
      onDragEnd={onDragEnd}
      onClick={onOpen}
      className={cn(
        "w-full cursor-grab rounded-xl border border-[#e6e8ec]/60 bg-white p-3.5 text-left transition hover:border-[#d5d9e0] active:cursor-grabbing",
        FOCUS,
        dragging && "opacity-30",
      )}
    >
      <span className="flex items-center gap-2.5">
        <Avatar name={`${lead.firstName} ${lead.lastName}`} size="sm" />
        <span className="min-w-0">
          <span className="block truncate text-sm font-medium">
            {lead.firstName} {lead.lastName}
          </span>
          <span className="block truncate text-xs text-[#6b7280]">{lead.phone}</span>
        </span>
      </span>
      <span className="mt-2.5 flex items-center justify-between gap-2">
        <span className="truncate rounded-md bg-[#eaeef8] px-2 py-0.5 text-xs font-medium text-[#0636a6]">{dentavantaDeck.sourceLabels[lead.source]}</span>
        <span className="shrink-0 text-xs text-[#6b7280]">{formatCardDate(-lead.createdDaysAgo)}</span>
      </span>
    </button>
  );
}

const CHANNEL_ICON = { sms: MessageSquare, email: Mail, call: PhoneCall, form: FileText };

export function MiniTimeline({ items, empty }: { items: DemoMessage[]; empty: string }) {
  if (items.length === 0) return <p className="rounded-lg bg-[#f1f3f8] px-3 py-3 text-sm text-[#6b7280]">{empty}</p>;
  return (
    <ul className="flex flex-col gap-2">
      {[...items]
        .sort((a, b) => b.minutesAgo - a.minutesAgo)
        .slice(-4)
        .map((m) => {
          const Icon = CHANNEL_ICON[m.channel];
          return (
            <li key={m.id} className="flex gap-2.5 rounded-lg bg-[#f1f3f8] px-3 py-2.5">
              <Icon aria-hidden className="mt-0.5 size-3.5 shrink-0 text-[#0636a6]" />
              <span className="min-w-0 flex-1">
                <span className="line-clamp-2 text-[13px] text-[#0a0a0a]">{m.body}</span>
                <span className="mt-0.5 block text-[11px] text-[#6b7280]">
                  {m.from === "contact" ? "Inbound" : dentavantaDeck.conversations.fromLabels[m.from]} · {relativeTime(m.minutesAgo)}
                </span>
              </span>
            </li>
          );
        })}
    </ul>
  );
}

function LeadDrawer({ leadId, onClose, onNavigate }: { leadId: string | null; onClose: () => void; onNavigate: (s: ScreenId) => void }) {
  const { lead: getLead, moveLead, thread, setBookingIntent, setFocusPatient } = useStore();
  const copy = dentavantaDeck.leadsScreen.drawer;
  const lead = leadId ? getLead(leadId) : undefined;
  const name = lead ? `${lead.firstName} ${lead.lastName}` : "";

  return (
    <Drawer
      open={!!lead}
      onClose={onClose}
      icon={Users}
      title={name}
      subtitle={copy.subtitle}
      footer={
        lead &&
        (lead.convertedPatientId ? (
          <button
            type="button"
            onClick={() => {
              setFocusPatient(lead.convertedPatientId);
              onNavigate("patients");
            }}
            className={cn(BTN_PRIMARY, "w-full justify-center")}
          >
            <Stethoscope aria-hidden className="size-4" /> {copy.viewPatient}
          </button>
        ) : (
          <button
            type="button"
            onClick={() => {
              setBookingIntent({ who: { kind: "lead", id: lead.id } });
              onNavigate("calendar");
            }}
            className={cn(BTN_PRIMARY, "w-full justify-center")}
          >
            <CalendarPlus aria-hidden className="size-4" /> {copy.book}
          </button>
        ))
      }
    >
      {lead && (
        <>
          <DrawerSection title={copy.stage}>
            <div className="flex flex-wrap gap-1.5">
              {dentavantaDeck.stages.map((s) => {
                const active = s.id === lead.stageId;
                return (
                  <button
                    key={s.id}
                    type="button"
                    onClick={() => moveLead(lead.id, s.id)}
                    aria-pressed={active}
                    className={cn("flex cursor-pointer items-center gap-1.5 rounded-lg px-3 py-2 text-xs font-medium transition", FOCUS, active ? "text-white" : "bg-[#f1f3f8] text-[#0a0a0a] hover:bg-[#eaeef8]")}
                    style={active ? { backgroundColor: s.color } : undefined}
                  >
                    {!active && <span aria-hidden className="size-2 rounded-full" style={{ backgroundColor: s.color }} />}
                    {s.name}
                  </button>
                );
              })}
            </div>
            {lead.convertedPatientId && <p className="text-xs font-medium text-[#047857]">{copy.converted}</p>}
          </DrawerSection>
          <DrawerSection title={copy.contact}>
            <p className="flex items-center gap-2 text-sm">
              <Phone aria-hidden className="size-4 text-[#6b7280]" /> {lead.phone}
            </p>
            {lead.email && (
              <p className="flex items-center gap-2 text-sm">
                <Mail aria-hidden className="size-4 text-[#6b7280]" /> {lead.email}
              </p>
            )}
          </DrawerSection>
          <DrawerSection title={`${copy.source} · ${copy.added}`}>
            <p className="text-sm">
              {dentavantaDeck.sourceLabels[lead.source]} · {formatCardDate(-lead.createdDaysAgo)}
            </p>
          </DrawerSection>
          <DrawerSection title={copy.history}>
            <MiniTimeline items={thread({ kind: "lead", id: lead.id })} empty={copy.noHistory} />
          </DrawerSection>
        </>
      )}
    </Drawer>
  );
}
