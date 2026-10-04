"use client";

import * as React from "react";
import {
  Building2,
  CalendarDays,
  CalendarPlus,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Clock,
  GripVertical,
  Inbox,
  Plus,
  Siren,
  Truck,
  Users,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { corvinnDeck, type DemoAssignment, type DemoJob, type JobStatus } from "@/content/corvinn";
import {
  BUTTON_BASE,
  BUTTON_PRIMARY,
  Dialog,
  EntityAvatar,
  GLASS_CARD,
  JOB_STATUS_COLOR,
  Menu,
  MenuItem,
  MenuLabel,
  PILL,
  PILL_WARNING,
  PageHeader,
  Sheet,
  StatusPill,
  TOOLBAR_CONTROL_CLASS,
  TOOLBAR_PRIMARY_CLASS,
  jobStatusStyle,
  statusLabel,
} from "./ui";
import { TODAY_OFFSET, dayDate, formatDuration, formatMinute, useStore } from "./store";
import { useFrame } from "./app-frame";

const ROW_HEIGHT = 28;
const RULER_WIDTH = 64;
const MIN_COLUMN_WIDTH = 160;
const DANGER = "#c62b28";
const TODAY_TINT = "color-mix(in srgb, var(--primary) 2.5%, transparent)";
const GRANULARITIES = [15, 30, 60] as const;
type Granularity = (typeof GRANULARITIES)[number];
type Span = "day" | "5day" | "week";
const TERMINAL: JobStatus[] = ["completed", "invoiced", "paid", "canceled"];

type Card = { key: string; job: DemoJob; ids: string[]; day: number; start: number; duration: number; techIds: string[] };
type DragPayload = { kind: "unassigned"; jobId: string } | { kind: "card"; ids: string[]; duration: number; grabOffset: number };

const tickWidth = (m: number) => (m % 60 === 0 ? 16 : m % 30 === 0 ? 10 : 7);
const hourLabel = (m: number) => {
  const h = Math.floor(m / 60);
  return `${h % 12 === 0 ? 12 : h % 12} ${h < 12 ? "AM" : "PM"}`;
};

/** Group a day's assignments into job cards (one card per job + time, crew stacked) and pack overlapping cards into lanes. */
function buildCards(assignments: DemoAssignment[], jobs: DemoJob[], day: number) {
  const cards: Card[] = [];
  for (const a of assignments.filter((x) => x.day === day)) {
    const existing = cards.find((c) => c.job.id === a.jobId && c.start === a.startMinute && c.duration === a.durationMinutes);
    if (existing) {
      existing.ids.push(a.id);
      existing.techIds.push(a.technicianId);
      continue;
    }
    const job = jobs.find((j) => j.id === a.jobId);
    if (job) cards.push({ key: a.id, job, ids: [a.id], day, start: a.startMinute, duration: a.durationMinutes, techIds: [a.technicianId] });
  }
  cards.sort((a, b) => a.start - b.start);
  const laneEnds: number[] = [];
  const placed = cards.map((card) => {
    let lane = laneEnds.findIndex((end) => end <= card.start);
    if (lane === -1) lane = laneEnds.length;
    laneEnds[lane] = card.start + card.duration;
    return { card, lane };
  });
  return { placed, lanes: Math.max(1, laneEnds.length) };
}

function Segmented<T extends string>({ value, options, onChange }: { value: T; options: { value: T; label: string; icon?: React.ReactNode }[]; onChange: (v: T) => void }) {
  return (
    <div className="flex items-center gap-0.5 rounded-full bg-muted p-0.5">
      {options.map((o) => (
        <button
          key={o.value}
          type="button"
          onClick={() => onChange(o.value)}
          className={cn(
            "flex cursor-pointer items-center gap-1.5 rounded-full px-3 py-1 text-[12px] font-medium transition-colors",
            value === o.value ? "bg-white text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground",
          )}
        >
          {o.icon}
          {o.label}
        </button>
      ))}
    </div>
  );
}

function CalendarJobCard({
  card,
  heightPx,
  dragging,
  onOpen,
  onRemove,
  onAddCrew,
  dragProps,
}: {
  card: Card;
  heightPx: number;
  dragging: boolean;
  onOpen: () => void;
  onRemove: (assignmentId: string) => void;
  onAddCrew: (techId: string) => void;
  dragProps: React.HTMLAttributes<HTMLDivElement>;
}) {
  const hex = JOB_STATUS_COLOR[card.job.status];
  const tier = heightPx < 44 ? "compact" : heightPx < 100 ? "medium" : "full";
  const small = tier !== "full";
  const timeRange = `${formatMinute(card.start, false)} - ${formatMinute(card.start + card.duration)}`;
  const nameOf = (id: string) => corvinnDeck.technicians.find((t) => t.id === id)?.name ?? "(unnamed)";
  const free = corvinnDeck.technicians.filter((t) => !card.techIds.includes(t.id));

  // Full cards let the crew row give way to the status pill; medium cards keep the crew whole and truncate the time instead.
  const crewRow = (
    <div className={cn("flex items-center gap-1", tier === "full" ? "min-w-0 overflow-hidden py-0.5 pr-1" : "shrink-0")}>
      <div className="flex items-center -space-x-1.5">
        {card.techIds.map((techId, i) => (
          <span key={techId} className="group/avatar relative" title={nameOf(techId)}>
            <EntityAvatar name={nameOf(techId)} size="sm" className={cn("ring-2 ring-white", small && "size-5 text-[8.5px]")} />
            <button
              type="button"
              aria-label={`Remove ${nameOf(techId)} from this job`}
              onClick={(e) => {
                e.stopPropagation();
                onRemove(card.ids[i]!);
              }}
              className="absolute -top-1 -right-1 hidden size-3.5 cursor-pointer items-center justify-center rounded-full bg-foreground text-background shadow group-hover/avatar:flex"
            >
              <X className="size-2.5" strokeWidth={3} />
            </button>
          </span>
        ))}
      </div>
      {free.length > 0 && (
        <Menu
          align="start"
          className="w-48"
          trigger={
            <button
              type="button"
              aria-label="Add a technician"
              onClick={(e) => e.stopPropagation()}
              className={cn(
                "ml-1 flex shrink-0 cursor-pointer items-center justify-center rounded-full border border-dashed border-current/40 text-current opacity-70 transition-opacity hover:opacity-100",
                small ? "size-5" : "size-6",
              )}
            >
              <Plus className="size-3" />
            </button>
          }
        >
          <MenuLabel>Add to crew</MenuLabel>
          {free.map((t) => (
            <MenuItem key={t.id} onSelect={() => onAddCrew(t.id)}>
              <EntityAvatar name={t.name} size="sm" />
              {t.name}
            </MenuItem>
          ))}
        </Menu>
      )}
      {card.techIds.length === 1 && tier === "full" && <span className="ml-1 min-w-0 truncate text-[11px] opacity-80">{nameOf(card.techIds[0]!)}</span>}
    </div>
  );

  return (
    <div
      {...dragProps}
      draggable
      onClick={onOpen}
      className={cn(
        "group absolute flex cursor-grab flex-col overflow-hidden border px-2 text-left transition-[opacity,box-shadow] hover:shadow-md active:cursor-grabbing",
        tier === "compact" ? "justify-center py-0.5" : "gap-1 py-1.5",
        card.job.emergency && "ring-1 ring-rose-500/60",
      )}
      style={{
        ...dragProps.style,
        background: `color-mix(in srgb, ${hex} 13%, white)`,
        borderColor: `color-mix(in srgb, ${hex} 35%, white)`,
        color: `color-mix(in srgb, ${hex} 70%, black)`,
        opacity: dragging ? 0.4 : 1,
      }}
    >
      <div className="flex min-w-0 items-center gap-1.5">
        <span className="size-1.5 shrink-0 rounded-full" style={{ background: hex }} />
        {card.job.emergency && <Siren aria-label="Emergency" className="size-3 shrink-0 text-rose-600" />}
        <span className="min-w-0 flex-1 truncate text-[12px] leading-tight font-semibold">{card.job.title}</span>
        {tier === "compact" && (
          <span className="flex shrink-0 items-center gap-0.5 text-[10px] font-semibold opacity-75">
            <Users aria-hidden className="size-3" />
            {card.techIds.length}
          </span>
        )}
      </div>
      {tier === "full" && (
        <>
          <div className="flex min-w-0 items-center gap-1 text-[10.5px] font-medium tabular-nums opacity-80">
            <Clock aria-hidden className="size-3 shrink-0" />
            <span className="truncate">
              {timeRange} · {formatDuration(card.duration)}
            </span>
          </div>
          <CustomerLine customerId={card.job.customerId} />
          <div className="mt-auto flex items-center justify-between gap-1">
            {crewRow}
            <span className="shrink-0 rounded-full bg-white/70 px-1.5 py-0.5 text-[9.5px] font-semibold capitalize">{statusLabel(card.job.status)}</span>
          </div>
        </>
      )}
      {tier === "medium" && (
        <div className="mt-auto flex min-w-0 items-center justify-between gap-1.5">
          {crewRow}
          <span className="min-w-0 flex-1 truncate text-right text-[10px] font-medium tabular-nums opacity-80">{timeRange}</span>
        </div>
      )}
    </div>
  );
}

function CustomerLine({ customerId }: { customerId: string }) {
  const { customerName } = useStore();
  return (
    <div className="flex min-w-0 items-center gap-1 text-[10.5px] opacity-80">
      <Building2 aria-hidden className="size-3 shrink-0" />
      <span className="truncate">{customerName(customerId)}</span>
    </div>
  );
}

export function DispatchScreen() {
  const { jobs, assignments, assign, reschedule, unassign, customerName, toast, askWalkthrough } = useStore();
  const { setNavCollapsed, navCollapsed } = useFrame();
  const [view, setView] = React.useState<"calendar" | "personnel">("calendar");
  const [span, setSpan] = React.useState<Span>("5day");
  const [granularity, setGranularity] = React.useState<Granularity>(30);
  const [shift, setShift] = React.useState(0);
  const [panelOpen, setPanelOpen] = React.useState(false);
  const collapsedForPanel = React.useRef(false);
  const [drag, setDrag] = React.useState<DragPayload | null>(null);
  const [preview, setPreview] = React.useState<{ day: number; minute: number } | null>(null);
  const [pending, setPending] = React.useState<{ jobId: string; day: number; minute: number } | null>(null);
  const [pendingTechs, setPendingTechs] = React.useState<string[]>([]);
  const [pendingDuration, setPendingDuration] = React.useState(60);
  const [openJobId, setOpenJobId] = React.useState<string | null>(null);
  const [nowMinute, setNowMinute] = React.useState<number | null>(null);
  const scrollRef = React.useRef<HTMLDivElement>(null);
  const headerRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    const tick = () => {
      const d = new Date();
      setNowMinute(d.getHours() * 60 + d.getMinutes());
    };
    tick();
    const id = window.setInterval(tick, 60_000);
    return () => window.clearInterval(id);
  }, []);

  // Restore the sidebar if we borrowed its width for the jobs panel.
  React.useEffect(
    () => () => {
      if (collapsedForPanel.current) setNavCollapsed(false);
    },
    [setNavCollapsed],
  );

  const days =
    span === "day"
      ? [TODAY_OFFSET + shift]
      : span === "5day"
        ? [0, 1, 2, 3, 4].map((d) => d + shift)
        : [-1, 0, 1, 2, 3, 4, 5].map((d) => d + shift);
  const step = span === "day" ? 1 : span === "5day" ? 5 : 7;

  const slots = Array.from({ length: (24 * 60) / granularity }, (_, i) => i * granularity);
  const bodyHeight = slots.length * ROW_HEIGHT;
  const columns = `${RULER_WIDTH}px repeat(${days.length}, minmax(${MIN_COLUMN_WIDTH}px, 1fr))`;
  const minWidth = RULER_WIDTH + days.length * MIN_COLUMN_WIDTH;
  const todayVisible = days.includes(TODAY_OFFSET) && nowMinute !== null;
  const nowTop = nowMinute !== null ? (nowMinute / granularity) * ROW_HEIGHT : 0;

  React.useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    const target = todayVisible && nowMinute !== null ? Math.min(nowMinute - 60, 7 * 60) : 7 * 60;
    el.scrollTop = Math.max(0, (target / granularity) * ROW_HEIGHT - ROW_HEIGHT);
    // Only re-anchor when the scale or the visible range changes.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [granularity, span, shift, view, nowMinute !== null]);

  const unscheduled = jobs
    .filter((j) => !TERMINAL.includes(j.status) && !assignments.some((a) => a.jobId === j.id))
    .sort((a, b) => Number(b.emergency) - Number(a.emergency));

  function togglePanel() {
    if (panelOpen) {
      setPanelOpen(false);
      if (collapsedForPanel.current) {
        collapsedForPanel.current = false;
        setNavCollapsed(false);
      }
      return;
    }
    if (!navCollapsed) {
      collapsedForPanel.current = true;
      setNavCollapsed(true);
    }
    setPanelOpen(true);
  }

  function minuteAt(e: React.DragEvent<HTMLDivElement>) {
    const rect = e.currentTarget.getBoundingClientRect();
    const grab = drag?.kind === "card" ? drag.grabOffset : 0;
    const duration = drag?.kind === "card" ? drag.duration : 60;
    const raw = Math.floor((e.clientY - rect.top - grab) / ROW_HEIGHT) * granularity;
    const latest = Math.floor((24 * 60 - duration) / granularity) * granularity;
    return Math.max(0, Math.min(latest, raw));
  }

  function drop(day: number, minute: number) {
    const payload = drag;
    setDrag(null);
    setPreview(null);
    if (!payload) return;
    if (payload.kind === "card") {
      reschedule(payload.ids, day, minute);
      toast("Rescheduled", `${dayDate(day).toLocaleDateString("en-US", { weekday: "long" })} at ${formatMinute(minute)}`);
      return;
    }
    const job = jobs.find((j) => j.id === payload.jobId);
    const busy = (techId: string) =>
      assignments.some((a) => a.technicianId === techId && a.day === day && a.startMinute < minute + 60 && minute < a.startMinute + a.durationMinutes);
    const eligible = corvinnDeck.technicians.filter((t) => job?.certifications.every((c) => t.certifications.includes(c)) && !busy(t.id));
    setPendingTechs(eligible[0] ? [eligible[0].id] : []);
    setPendingDuration(60);
    setPending({ jobId: payload.jobId, day, minute });
  }

  const pendingJob = pending ? jobs.find((j) => j.id === pending.jobId) : null;
  const openJob = openJobId ? jobs.find((j) => j.id === openJobId) : null;
  const openCrew = openJobId ? assignments.filter((a) => a.jobId === openJobId) : [];

  const rangeLabel =
    days.length === 1
      ? dayDate(days[0]!).toLocaleDateString("en-US", { weekday: "long", month: "short", day: "numeric" })
      : `${dayDate(days[0]!).toLocaleDateString("en-US", { month: "short", day: "numeric" })} - ${dayDate(days[days.length - 1]!).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}`;

  return (
    <div className="flex h-full min-h-[640px] flex-col overflow-hidden">
      <PageHeader
        icon={Truck}
        title="Dispatch board"
        subtitle="Drag a job onto a day/time to schedule it, or onto another slot to reschedule"
        actions={
          <>
            <button type="button" onClick={() => askWalkthrough("Creating jobs from dispatch")} className={cn(BUTTON_BASE, TOOLBAR_CONTROL_CLASS)}>
              <Plus className="size-4" /> Create job
            </button>
            <button type="button" onClick={togglePanel} className={cn(BUTTON_BASE, BUTTON_PRIMARY, TOOLBAR_PRIMARY_CLASS)}>
              <CalendarPlus className="size-4" /> {panelOpen ? "Hide jobs" : "Assign job"}
            </button>
          </>
        }
      />

      <div className="flex min-h-0 flex-1 px-3 pb-3">
        <div className="flex min-h-0 min-w-0 flex-1 flex-col gap-3">
          {/* View controls */}
          <div className={cn(GLASS_CARD, "flex shrink-0 flex-wrap items-center gap-2 p-2")}>
            <Segmented
              value={view}
              onChange={setView}
              options={[
                { value: "calendar", label: "Calendar", icon: <CalendarDays aria-hidden className="size-3.5" /> },
                { value: "personnel", label: "Personnel", icon: <Users aria-hidden className="size-3.5" /> },
              ]}
            />
            <div className="flex items-center gap-1">
              <button type="button" aria-label="Previous" onClick={() => setShift((s) => s - step)} className="flex size-7 cursor-pointer items-center justify-center rounded-full text-muted-foreground hover:bg-black/5 hover:text-foreground">
                <ChevronLeft className="size-4" />
              </button>
              <button
                type="button"
                onClick={() => setShift(0)}
                className={cn(
                  "cursor-pointer rounded-full border px-3 py-1 text-[12px] font-medium transition-colors",
                  shift === 0 ? "border-transparent bg-primary text-primary-foreground" : "border-border hover:bg-black/5",
                )}
              >
                Today
              </button>
              <button type="button" aria-label="Next" onClick={() => setShift((s) => s + step)} className="flex size-7 cursor-pointer items-center justify-center rounded-full text-muted-foreground hover:bg-black/5 hover:text-foreground">
                <ChevronRight className="size-4" />
              </button>
              <span className="ml-1.5 text-[14px] font-semibold">{rangeLabel}</span>
            </div>
            {view === "calendar" && (
              <div className="ml-auto flex items-center gap-2">
                <Segmented
                  value={span}
                  onChange={(v) => {
                    setSpan(v);
                    setShift(0);
                  }}
                  options={[
                    { value: "day", label: "Day" },
                    { value: "5day", label: "5 days" },
                    { value: "week", label: "Week" },
                  ]}
                />
                <Menu
                  className="w-52"
                  trigger={
                    <button type="button" className="flex h-7.5 cursor-pointer items-center gap-1.5 rounded-full border border-border bg-white pr-2 pl-2.5 text-[12px] font-medium outline-none hover:bg-black/[0.03] focus-visible:ring-2 focus-visible:ring-ring/50">
                      <Clock aria-hidden className="size-3.5 text-muted-foreground" />
                      {granularity === 60 ? "1 hour" : `${granularity} min`}
                      <ChevronDown aria-hidden className="size-3.5 text-muted-foreground" />
                    </button>
                  }
                >
                  <MenuLabel>Time scale</MenuLabel>
                  {GRANULARITIES.map((g) => (
                    <MenuItem key={g} active={g === granularity} onSelect={() => setGranularity(g)}>
                      <span className="flex-1">{g === 60 ? "1 hour" : `${g} min`}</span>
                      <span className="text-[11px] text-muted-foreground">{g === 60 ? "1 row / hour" : `${60 / g} rows / hour`}</span>
                    </MenuItem>
                  ))}
                </Menu>
              </div>
            )}
          </div>

          {view === "calendar" ? (
            <div className="flex min-h-0 flex-1 flex-col gap-3">
              <div ref={headerRef} className={cn(GLASS_CARD, "shrink-0 overflow-hidden")} style={{ scrollbarGutter: "stable" }}>
                <div className="grid" style={{ gridTemplateColumns: columns, minWidth }}>
                  <div />
                  {days.map((day) => {
                    const date = dayDate(day);
                    const isToday = day === TODAY_OFFSET;
                    const count = new Set(assignments.filter((a) => a.day === day).map((a) => a.jobId)).size;
                    return (
                      <div key={day} className="flex items-center justify-center gap-2 border-l border-[#eeeeee] py-2.5" style={{ background: isToday ? TODAY_TINT : undefined }}>
                        <span className={cn("text-[11px] font-semibold tracking-wide uppercase", isToday ? "text-primary" : "text-muted-foreground")}>
                          {date.toLocaleDateString("en-US", { weekday: days.length === 1 ? "long" : "short" })}
                        </span>
                        <span className={cn("flex size-7 items-center justify-center rounded-full text-[14px] font-semibold", isToday && "bg-primary text-primary-foreground")}>
                          {date.getDate()}
                        </span>
                        <span className="text-[11px] text-muted-foreground">
                          {count} job{count === 1 ? "" : "s"}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div
                ref={scrollRef}
                onScroll={(e) => {
                  if (headerRef.current) headerRef.current.scrollLeft = e.currentTarget.scrollLeft;
                }}
                className={cn(GLASS_CARD, "relative min-h-0 flex-1 overflow-auto")}
                style={{ scrollbarGutter: "stable" }}
              >
                <div className="relative grid" style={{ gridTemplateColumns: columns, minWidth }}>
                  {/* Ruler */}
                  <div className="sticky left-0 z-[6] border-r border-[#eeeeee] bg-white" style={{ gridColumn: 1, gridRow: 1, height: bodyHeight }}>
                    {slots.map((minute, si) => (
                      <div key={minute}>
                        <div
                          className="absolute right-0"
                          style={{
                            top: si * ROW_HEIGHT,
                            width: tickWidth(minute),
                            borderTop: `${minute % 60 === 0 ? 1.5 : 1}px solid ${minute % 60 === 0 ? "#6e6e73" : "#a1a1a6"}`,
                            opacity: minute % 60 === 0 ? 0.7 : 0.45,
                          }}
                        />
                        {si > 0 && !(todayVisible && Math.abs(si * ROW_HEIGHT - nowTop) < 16) && (
                          minute % 60 === 0 ? (
                            <div className="absolute right-5 text-[10.5px] font-semibold text-[#6e6e73]" style={{ top: si * ROW_HEIGHT - 7 }}>
                              {hourLabel(minute)}
                            </div>
                          ) : (
                            <div className="absolute right-5 text-[9.5px] text-[#a1a1a6] tabular-nums" style={{ top: si * ROW_HEIGHT - 6 }}>
                              {formatMinute(minute, false)}
                            </div>
                          )
                        )}
                      </div>
                    ))}
                    {todayVisible && (
                      <div className="pointer-events-none absolute inset-x-0 z-10 flex -translate-y-1/2 items-center" style={{ top: nowTop }}>
                        <span className="ml-1 rounded-full px-1.5 py-0.5 text-[10px] leading-none font-semibold text-white tabular-nums" style={{ background: DANGER }}>
                          {formatMinute(nowMinute!, false)}
                        </span>
                      </div>
                    )}
                  </div>

                  {days.map((day, di) => {
                    const { placed, lanes } = buildCards(assignments, jobs, day);
                    const isToday = day === TODAY_OFFSET;
                    const previewHere = drag && preview?.day === day ? preview : null;
                    const dragDuration = drag?.kind === "card" ? drag.duration : 60;
                    return (
                      <div
                        key={day}
                        className={cn(di > 0 && "border-l border-[#eeeeee]")}
                        style={{ gridColumn: di + 2, gridRow: 1, position: "relative", height: bodyHeight, background: isToday ? TODAY_TINT : undefined }}
                        onDragOver={(e) => {
                          e.preventDefault();
                          const minute = minuteAt(e);
                          setPreview((p) => (p?.day === day && p.minute === minute ? p : { day, minute }));
                        }}
                        onDragLeave={(e) => {
                          if (e.currentTarget.contains(e.relatedTarget as Node | null)) return;
                          setPreview((p) => (p?.day === day ? null : p));
                        }}
                        onDrop={(e) => {
                          e.preventDefault();
                          drop(day, minuteAt(e));
                        }}
                      >
                        {slots.map((minute, si) =>
                          si === 0 ? null : (
                            <div
                              key={minute}
                              className="pointer-events-none absolute inset-x-0"
                              style={{ top: si * ROW_HEIGHT, borderTop: minute % 60 === 0 ? "1px solid #dcdcdc" : "1px dashed #e6e6e6" }}
                            />
                          ),
                        )}

                        {todayVisible && (
                          <div className="pointer-events-none absolute inset-x-0 z-[5] flex -translate-y-1/2 items-center" style={{ top: nowTop }}>
                            {isToday ? (
                              <>
                                <div className="-ml-1 size-2 shrink-0 rounded-full" style={{ background: DANGER }} />
                                <div className="h-0.5 flex-1" style={{ background: DANGER }} />
                              </>
                            ) : (
                              <div className="h-px flex-1 opacity-30" style={{ background: DANGER }} />
                            )}
                          </div>
                        )}

                        {previewHere && (
                          <div
                            className="pointer-events-none absolute inset-x-1 z-20 border-2 border-dashed border-[#6e6e73] bg-black/5"
                            style={{ top: (previewHere.minute / granularity) * ROW_HEIGHT + 1, height: (dragDuration / granularity) * ROW_HEIGHT - 2 }}
                          >
                            <span className="absolute top-1 left-1.5 rounded-md bg-white/90 px-1.5 py-0.5 text-[10.5px] font-semibold text-foreground tabular-nums shadow-sm">
                              {formatMinute(previewHere.minute, false)} - {formatMinute((previewHere.minute + dragDuration) % (24 * 60), false)}
                            </span>
                          </div>
                        )}

                        {pending && pending.day === day && (
                          <div
                            className="pointer-events-none absolute inset-x-1 z-20 flex flex-col gap-0.5 border-2 border-dashed border-[#6e6e73] bg-black/5 px-2 py-1.5"
                            style={{ top: (pending.minute / granularity) * ROW_HEIGHT + 1, height: (pendingDuration / granularity) * ROW_HEIGHT - 2 }}
                          >
                            <span className="truncate text-[12px] font-semibold">{pendingJob?.title}</span>
                            <span className="text-[10.5px] text-muted-foreground">Assigning…</span>
                          </div>
                        )}

                        {placed.map(({ card, lane }) => {
                          const span = Math.max(1, Math.round(card.duration / granularity));
                          const heightPx = span * ROW_HEIGHT - 2;
                          return (
                            <CalendarJobCard
                              key={card.key}
                              card={card}
                              heightPx={heightPx}
                              dragging={drag?.kind === "card" && drag.ids[0] === card.ids[0]}
                              onOpen={() => setOpenJobId(card.job.id)}
                              onRemove={(id) => {
                                unassign(id);
                                toast("Technician removed", card.job.title);
                              }}
                              onAddCrew={(techId) => {
                                assign(card.job.id, [techId], card.day, card.start, card.duration);
                                toast("Crew updated", card.job.title);
                              }}
                              dragProps={{
                                onDragStart: (e) => {
                                  e.dataTransfer.effectAllowed = "move";
                                  setDrag({ kind: "card", ids: card.ids, duration: card.duration, grabOffset: e.clientY - e.currentTarget.getBoundingClientRect().top });
                                },
                                onDragEnd: () => {
                                  setDrag(null);
                                  setPreview(null);
                                },
                                style: {
                                  top: (card.start / granularity) * ROW_HEIGHT + 1,
                                  height: heightPx,
                                  left: `calc(${(lane / lanes) * 100}% + 2px)`,
                                  width: `calc(${100 / lanes}% - 4px)`,
                                },
                              }}
                            />
                          );
                        })}
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          ) : (
            <div className="flex min-h-0 flex-1 gap-3 overflow-x-auto pb-1">
              {corvinnDeck.technicians.map((tech) => {
                const mine = assignments.filter((a) => a.technicianId === tech.id && days.includes(a.day)).sort((a, b) => a.day - b.day || a.startMinute - b.startMinute);
                return (
                  <div key={tech.id} className={cn(GLASS_CARD, "flex h-fit w-64 shrink-0 flex-col gap-2.5 p-3")}>
                    <div className="flex items-center gap-2">
                      <EntityAvatar name={tech.name} size="sm" />
                      <div className="min-w-0">
                        <div className="truncate text-[13px] font-semibold">{tech.name}</div>
                        <div className="truncate text-[10px] text-[#a1a1a6]">
                          {mine.length} job{mine.length === 1 ? "" : "s"}
                        </div>
                      </div>
                    </div>
                    <div className="flex flex-col gap-1.5">
                      {mine.length === 0 && <p className="text-[12.5px] text-[#a1a1a6]">Nothing scheduled.</p>}
                      {mine.map((a) => {
                        const job = jobs.find((j) => j.id === a.jobId)!;
                        return (
                          <button
                            key={a.id}
                            type="button"
                            onClick={() => setOpenJobId(job.id)}
                            className="flex cursor-pointer flex-col gap-0.5 rounded-lg px-2.5 py-2 text-left text-[12px] leading-tight font-medium"
                            style={jobStatusStyle(job.status)}
                          >
                            <span className="flex items-center gap-1 truncate font-bold">
                              {job.emergency && <Siren aria-hidden className="size-3 shrink-0" />}
                              {job.title}
                            </span>
                            <span className="truncate opacity-80">{customerName(job.customerId)}</span>
                            <span className="opacity-70">
                              {dayDate(a.day).toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" })} · {formatMinute(a.startMinute)} - {formatMinute(a.startMinute + a.durationMinutes)}
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Jobs panel: borrows the sidebar's width while it's open. */}
        <div className="shrink-0 overflow-hidden transition-[width,margin] duration-200 ease-in-out" style={{ width: panelOpen ? 320 : 0, marginLeft: panelOpen ? 12 : 0 }} aria-hidden={!panelOpen}>
          <div className={cn(GLASS_CARD, "flex h-full flex-col gap-3 p-3")} style={{ width: 320 }}>
            <div className="flex items-center justify-between pl-1">
              <div>
                <h3 className="text-[15px] leading-tight font-semibold">Jobs</h3>
                <p className="text-[12px] text-muted-foreground">{unscheduled.length} ready to schedule · drag onto the calendar</p>
              </div>
              <button type="button" onClick={togglePanel} aria-label="Close jobs panel" className="flex size-8 cursor-pointer items-center justify-center rounded-full text-muted-foreground hover:bg-black/5 hover:text-foreground">
                <X className="size-4" />
              </button>
            </div>
            <div className="-mx-1 flex min-h-0 flex-1 flex-col gap-2 overflow-y-auto px-1 pt-0.5 pb-1">
              {unscheduled.length === 0 ? (
                <div className="flex flex-1 flex-col items-center justify-center gap-2 rounded-2xl border border-dashed border-[#e2e2e2] px-6 text-center">
                  <Inbox aria-hidden className="size-6 text-muted-foreground" />
                  <p className="text-[13px] font-medium">Nothing waiting on a time slot</p>
                  <p className="text-[12px] text-muted-foreground">New jobs show up here until they&apos;re dragged onto the calendar.</p>
                </div>
              ) : (
                unscheduled.map((job) => (
                  <div
                    key={job.id}
                    draggable
                    onDragStart={(e) => {
                      e.dataTransfer.effectAllowed = "move";
                      setDrag({ kind: "unassigned", jobId: job.id });
                    }}
                    onDragEnd={() => {
                      setDrag(null);
                      setPreview(null);
                    }}
                    className={cn(
                      "group relative flex min-h-24 cursor-grab gap-2.5 overflow-hidden rounded-2xl border bg-white px-4 py-4 transition-[transform,box-shadow,opacity] duration-150 select-none hover:-translate-y-0.5 hover:shadow-md active:cursor-grabbing",
                      drag?.kind === "unassigned" && drag.jobId === job.id ? "border-dashed border-[#e2e2e2] opacity-40" : "border-[#eeeeee]",
                    )}
                  >
                    <div className="flex min-w-0 flex-1 flex-col gap-2">
                      <span className="flex min-w-0 items-center gap-1.5 text-[14px] leading-snug font-semibold">
                        {job.emergency && <Siren aria-label="Emergency" className="size-3.5 shrink-0 text-rose-600" />}
                        <span className="truncate">{job.title}</span>
                      </span>
                      <span className="flex min-w-0 items-center gap-1.5 text-[12.5px] text-muted-foreground">
                        <Building2 aria-hidden className="size-3.5 shrink-0" />
                        <span className="truncate">{customerName(job.customerId)}</span>
                      </span>
                      <div className="flex flex-wrap items-center gap-1">
                        <span className={cn(PILL, "px-2 py-0.5 text-[10.5px] capitalize")} style={jobStatusStyle(job.status)}>
                          {statusLabel(job.status)}
                        </span>
                        {job.certifications.map((c) => (
                          <span key={c} className={cn(PILL, PILL_WARNING, "px-2 py-0.5 text-[10.5px] capitalize")}>
                            {c.replace(/_/g, " ")}
                          </span>
                        ))}
                      </div>
                    </div>
                    <GripVertical aria-hidden className="size-4 shrink-0 self-center text-muted-foreground/50 transition-colors group-hover:text-muted-foreground" />
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>

      {/* AssignJobDialog */}
      <Dialog
        open={pending !== null}
        onClose={() => setPending(null)}
        title={`Assign ${pendingJob?.title ?? "job"}`}
        description={pending ? `${dayDate(pending.day).toLocaleDateString("en-US", { weekday: "long", month: "short", day: "numeric" })} at ${formatMinute(pending.minute)}` : undefined}
      >
        <div className="flex flex-col gap-4">
          <div>
            <div className="mb-2 text-[13px] font-semibold">Crew</div>
            <div className="flex flex-col gap-1">
              {corvinnDeck.technicians.map((t) => {
                const certified = pendingJob?.certifications.every((c) => t.certifications.includes(c)) ?? true;
                const on = pendingTechs.includes(t.id);
                return (
                  <button
                    key={t.id}
                    type="button"
                    disabled={!certified}
                    onClick={() => setPendingTechs((p) => (on ? p.filter((x) => x !== t.id) : [...p, t.id]))}
                    className={cn(
                      "flex cursor-pointer items-center gap-2.5 rounded-xl border px-3 py-2 text-left text-[13px] transition-colors disabled:cursor-not-allowed disabled:opacity-45",
                      on ? "border-primary bg-primary/5" : "border-border hover:bg-muted",
                    )}
                  >
                    <EntityAvatar name={t.name} size="sm" />
                    <span className="flex-1 font-medium">{t.name}</span>
                    {!certified && <span className="text-[11px] text-muted-foreground">Missing certification</span>}
                    {on && <span className="size-2 rounded-full bg-primary" />}
                  </button>
                );
              })}
            </div>
          </div>
          <div className="flex items-center justify-between gap-3">
            <span className="text-[13px] font-semibold">Duration</span>
            <div className="flex items-center gap-0.5 rounded-full bg-muted p-0.5">
              {[60, 90, 120, 180].map((m) => (
                <button
                  key={m}
                  type="button"
                  onClick={() => setPendingDuration(m)}
                  className={cn("cursor-pointer rounded-full px-2.5 py-1 text-[12px] font-medium", pendingDuration === m ? "bg-white shadow-sm" : "text-muted-foreground hover:text-foreground")}
                >
                  {formatDuration(m)}
                </button>
              ))}
            </div>
          </div>
          <div className="flex justify-end gap-2">
            <button type="button" onClick={() => setPending(null)} className={cn(BUTTON_BASE, "h-9 rounded-md border border-border px-4 text-[14px] hover:bg-muted")}>
              Cancel
            </button>
            <button
              type="button"
              disabled={pendingTechs.length === 0}
              onClick={() => {
                if (!pending) return;
                assign(pending.jobId, pendingTechs, pending.day, pending.minute, pendingDuration);
                toast("Job scheduled", `${pendingJob?.title} at ${formatMinute(pending.minute)}`);
                setPending(null);
              }}
              className={cn(BUTTON_BASE, BUTTON_PRIMARY, "h-9 rounded-md px-4 text-[14px]")}
            >
              Assign
            </button>
          </div>
        </div>
      </Dialog>

      {/* JobDetailDrawer */}
      <Sheet open={openJob != null} onClose={() => setOpenJobId(null)} title={openJob?.title} description={openJob ? customerName(openJob.customerId) : undefined}>
        {openJob && (
          <div className="flex flex-col gap-4">
            <div className="flex flex-wrap gap-1.5">
              <StatusPill status={openJob.status} />
              {openJob.emergency && <span className={cn(PILL, "bg-[#fde5ea] text-[#e11d48]")}>Emergency</span>}
              {openJob.certifications.map((c) => (
                <span key={c} className={cn(PILL, PILL_WARNING, "capitalize")}>
                  {c.replace(/_/g, " ")}
                </span>
              ))}
            </div>
            <div>
              <div className="mb-2 text-[13px] font-semibold">Crew</div>
              <div className="flex flex-col gap-2">
                {openCrew.length === 0 && <p className="text-[13px] text-muted-foreground">Nobody assigned.</p>}
                {openCrew.map((a) => {
                  const tech = corvinnDeck.technicians.find((t) => t.id === a.technicianId)!;
                  return (
                    <div key={a.id} className="flex items-center gap-3 rounded-xl border border-border px-3 py-2.5">
                      <EntityAvatar name={tech.name} size="sm" />
                      <div className="min-w-0 flex-1">
                        <div className="text-[13.5px] font-medium">{tech.name}</div>
                        <div className="text-[12px] text-muted-foreground tabular-nums">
                          {dayDate(a.day).toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" })} · {formatMinute(a.startMinute)} - {formatMinute(a.startMinute + a.durationMinutes)}
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => {
                          unassign(a.id);
                          toast("Technician removed", openJob.title);
                        }}
                        className="cursor-pointer rounded-full px-2.5 py-1 text-[12px] font-medium text-[#c62b28] hover:bg-[#fbeaea]"
                      >
                        Remove
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}
      </Sheet>
    </div>
  );
}
