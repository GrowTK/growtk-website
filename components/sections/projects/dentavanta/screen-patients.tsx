"use client";

import * as React from "react";
import { CalendarPlus, LayoutGrid, List, Phone, Stethoscope } from "lucide-react";
import { cn } from "@/lib/utils";
import { dentavantaDeck, type DemoPatient, type PatientStatus } from "@/content/dentavanta";
import type { ScreenId } from "./app-frame";
import { formatCardDate, formatDay, formatMinute, useStore } from "./store";
import { MiniTimeline } from "./screen-leads";
import { Avatar, BTN_PRIMARY, Chip, Drawer, DrawerSection, EmptyDots, FOCUS, PageHeader, SearchInput, StatusBadge, TypeBadge, ViewToggle } from "./ui";

// Fixed three statuses on plain Tailwind pastels with dark text, like the real patients-board.tsx.
const COLUMNS: { status: PatientStatus; header: string; count: string; dot: string }[] = [
  { status: "active", header: "bg-emerald-200 text-emerald-900", count: "text-emerald-900/70", dot: "#34d399" },
  { status: "inactive", header: "bg-amber-200 text-amber-900", count: "text-amber-900/70", dot: "#fbbf24" },
  { status: "dormant", header: "bg-rose-200 text-rose-900", count: "text-rose-900/70", dot: "#f87171" },
];

const TEMPERATURE = { hot: "bg-red-50 text-red-700", warm: "bg-[#eaeef8] text-[#0636a6]", cold: "bg-[#e6e8ec] text-[#6b7280]" };

/** Patients: a copy of components/patients/patients-page.tsx and patients-board.tsx. */
export function PatientsScreen({ onNavigate }: { onNavigate: (s: ScreenId) => void }) {
  const { patients, appointments, setPatientStatus, focusPatient, setFocusPatient, askWalkthrough } = useStore();
  const copy = dentavantaDeck.patientsScreen;
  const [search, setSearch] = React.useState("");
  const [openId, setOpenId] = React.useState<string | null>(null);
  const [dragId, setDragId] = React.useState<string | null>(null);
  const [over, setOver] = React.useState<PatientStatus | null>(null);

  // Another slide sent the viewer to a specific patient.
  React.useEffect(() => {
    if (!focusPatient) return;
    setOpenId(focusPatient);
    setFocusPatient(null);
  }, [focusPatient, setFocusPatient]);

  const q = search.trim().toLowerCase();
  const filtered = patients.filter((p) => `${p.firstName} ${p.lastInitial} ${p.phone}`.toLowerCase().includes(q));
  const nextVisit = (id: string) =>
    appointments.filter((a) => a.patientId === id && a.day >= 0 && a.status === "booked").sort((a, b) => a.day - b.day || a.startMinute - b.startMinute)[0];

  return (
    <div className="flex h-full min-h-0 flex-col gap-4">
      <PageHeader icon={Stethoscope} title={copy.title} subtitle={copy.subtitle}>
        <SearchInput value={search} onChange={setSearch} placeholder={copy.search} />
        <ViewToggle
          options={[
            { value: "board", label: copy.board, icon: LayoutGrid },
            { value: "list", label: copy.list, icon: List },
          ]}
          value="board"
          onChange={(v) => v === "list" && askWalkthrough("The list view")}
        />
      </PageHeader>

      <div className="flex min-h-[28rem] flex-1 gap-4 overflow-x-auto pt-1 pb-2">
        {COLUMNS.map((col) => {
          const items = filtered.filter((p) => p.status === col.status);
          return (
            <div key={col.status} className="flex w-64 shrink-0 flex-col gap-2 xl:w-auto xl:flex-1">
              <div className={cn("flex items-center gap-2 rounded-md px-3 py-2.5", col.header)}>
                <span className="text-sm font-semibold">{copy.columns[col.status]}</span>
                <span className={cn("text-xs font-medium tabular-nums", col.count)}>{items.length}</span>
              </div>
              <div
                onDragOver={(e) => {
                  e.preventDefault();
                  if (over !== col.status) setOver(col.status);
                }}
                onDragLeave={(e) => {
                  if (!e.currentTarget.contains(e.relatedTarget as Node)) setOver(null);
                }}
                onDrop={(e) => {
                  e.preventDefault();
                  if (dragId) setPatientStatus(dragId, col.status);
                  setDragId(null);
                  setOver(null);
                }}
                className={cn("flex min-h-0 flex-1 flex-col gap-2 overflow-y-auto rounded-md border-2 bg-white p-2.5 transition-colors", over === col.status && dragId ? "border-dashed border-[#0636a6]/50" : "border-transparent")}
              >
                {items.length === 0 ? (
                  <EmptyDots label={copy.columns[col.status]} />
                ) : (
                  items.map((p) => (
                    <PatientCard
                      key={p.id}
                      p={p}
                      next={nextVisit(p.id)}
                      dragging={dragId === p.id}
                      onOpen={() => setOpenId(p.id)}
                      onDragStart={() => setDragId(p.id)}
                      onDragEnd={() => {
                        setDragId(null);
                        setOver(null);
                      }}
                    />
                  ))
                )}
              </div>
            </div>
          );
        })}
      </div>

      <PatientDrawer id={openId} onClose={() => setOpenId(null)} onNavigate={onNavigate} />
    </div>
  );
}

function PatientCard({
  p,
  next,
  dragging,
  onOpen,
  onDragStart,
  onDragEnd,
}: {
  p: DemoPatient;
  next?: { day: number; startMinute: number };
  dragging: boolean;
  onOpen: () => void;
  onDragStart: () => void;
  onDragEnd: () => void;
}) {
  const copy = dentavantaDeck.patientsScreen;
  const name = `${p.firstName} ${p.lastInitial}.`;
  return (
    <button
      type="button"
      draggable
      onDragStart={(e) => {
        e.dataTransfer.effectAllowed = "move";
        e.dataTransfer.setData("text/plain", p.id);
        onDragStart();
      }}
      onDragEnd={onDragEnd}
      onClick={onOpen}
      className={cn("w-full cursor-grab rounded-xl bg-[#f1f3f8] p-3.5 text-left transition hover:bg-[#eaeef8] active:cursor-grabbing", FOCUS, dragging && "opacity-30")}
    >
      <span className="flex items-center gap-2.5">
        <Avatar name={name} size="sm" />
        <span className="min-w-0 flex-1 truncate text-sm font-medium">{name}</span>
        <span className={cn("shrink-0 rounded-md px-2 py-0.5 text-[11px] font-medium", TEMPERATURE[p.temperature])}>{dentavantaDeck.temperatureLabels[p.temperature]}</span>
      </span>
      <span className="mt-2.5 flex items-center justify-between gap-2 text-xs text-[#6b7280]">
        <span className="truncate">{p.lastVisitDaysAgo === null ? copy.noVisits : `${copy.lastVisit} ${formatCardDate(-p.lastVisitDaysAgo)}`}</span>
      </span>
      {next && (
        <span className="mt-2 inline-flex rounded-md bg-white px-2 py-0.5 text-[11px] font-medium text-[#0636a6]">
          {copy.next}: {formatDay(next.day)}, {formatMinute(next.startMinute)}
        </span>
      )}
    </button>
  );
}

function PatientDrawer({ id, onClose, onNavigate }: { id: string | null; onClose: () => void; onNavigate: (s: ScreenId) => void }) {
  const { patient, appointments, setPatientStatus, thread, setBookingIntent } = useStore();
  const copy = dentavantaDeck.patientsScreen;
  const p = id ? patient(id) : undefined;
  const name = p ? `${p.firstName} ${p.lastInitial}.` : "";
  const mine = p ? appointments.filter((a) => a.patientId === p.id && a.status !== "cancelled") : [];
  const upcoming = mine.filter((a) => a.day >= 0 && a.status === "booked").sort((a, b) => a.day - b.day || a.startMinute - b.startMinute);
  const past = mine.filter((a) => a.day < 0).sort((a, b) => b.day - a.day);

  return (
    <Drawer
      open={!!p}
      onClose={onClose}
      icon={Stethoscope}
      title={name}
      subtitle={copy.drawer.subtitle}
      footer={
        p && (
          <button
            type="button"
            onClick={() => {
              setBookingIntent({ who: { kind: "patient", id: p.id } });
              onNavigate("calendar");
            }}
            className={cn(BTN_PRIMARY, "w-full justify-center")}
          >
            <CalendarPlus aria-hidden className="size-4" /> {copy.drawer.book}
          </button>
        )
      }
    >
      {p && (
        <>
          <p className="mb-4 flex items-center gap-2 text-sm">
            <Phone aria-hidden className="size-4 text-[#6b7280]" /> {p.phone}
          </p>
          <DrawerSection title={copy.drawer.status}>
            <div className="flex flex-wrap gap-1.5">
              {COLUMNS.map((c) => (
                <Chip key={c.status} active={p.status === c.status} onClick={() => setPatientStatus(p.id, c.status)} color={c.dot}>
                  {copy.columns[c.status]}
                </Chip>
              ))}
            </div>
          </DrawerSection>
          <DrawerSection title={copy.drawer.upcoming}>
            {upcoming.length === 0 ? (
              <p className="rounded-lg bg-[#f1f3f8] px-3 py-3 text-sm text-[#6b7280]">{copy.drawer.noUpcoming}</p>
            ) : (
              upcoming.map((a) => (
                <div key={a.id} className="flex items-center justify-between gap-2 rounded-lg bg-[#f1f3f8] px-3 py-2.5">
                  <span className="text-sm font-medium">
                    {formatDay(a.day)}, {formatMinute(a.startMinute)}
                  </span>
                  <TypeBadge type={a.type} />
                </div>
              ))
            )}
          </DrawerSection>
          {past.length > 0 && (
            <DrawerSection title={copy.drawer.past}>
              {past.map((a) => (
                <div key={a.id} className="flex items-center justify-between gap-2 rounded-lg border border-[#e6e8ec] px-3 py-2.5">
                  <span className="text-sm">{formatCardDate(a.day)}</span>
                  <span className="flex gap-1.5">
                    <TypeBadge type={a.type} />
                    <StatusBadge status={a.status} />
                  </span>
                </div>
              ))}
            </DrawerSection>
          )}
          <DrawerSection title={copy.drawer.history}>
            <MiniTimeline items={thread({ kind: "patient", id: p.id })} empty={copy.drawer.noHistory} />
          </DrawerSection>
        </>
      )}
    </Drawer>
  );
}
