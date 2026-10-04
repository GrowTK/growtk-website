"use client";

import * as React from "react";
import { Archive, ChevronLeft, ChevronRight, Move, Plus, SlidersHorizontal, Siren, Wrench, X } from "lucide-react";
import { cn } from "@/lib/utils";
import type { DemoJob, JobStatus } from "@/content/corvinn";
import {
  BUTTON_BASE,
  BUTTON_PRIMARY,
  Checkbox,
  DataTable,
  EmptyRows,
  JOB_STATUSES,
  JOB_STATUS_COLOR,
  Menu,
  MenuItem,
  NEXT_JOB_STATUSES,
  Sheet,
  StatusPill,
  TOOLBAR_PRIMARY_CLASS,
  ToolbarHeader,
  ToolbarIconButton,
  ToolbarSearch,
  ToolbarTabs,
  jobStatusStyle,
  statusLabel,
  type DataTableColumn,
} from "./ui";
import { TODAY_OFFSET, dayDate, daysAgoLabel, useStore } from "./store";

const VIEWS = ["list", "kanban", "calendar", "timeline"] as const;
type ViewId = (typeof VIEWS)[number];
const VIEW_LABELS: Record<ViewId, string> = { list: "List", kanban: "Kanban", calendar: "Calendar", timeline: "Timeline" };

function JobsKanban({ jobs }: { jobs: DemoJob[] }) {
  const { setJobStatus, customerName, toast } = useStore();
  const [draggingId, setDraggingId] = React.useState<string | null>(null);
  const [over, setOver] = React.useState<JobStatus | null>(null);
  const [notice, setNotice] = React.useState<string | null>(null);

  function moveTo(job: DemoJob, status: JobStatus) {
    if (job.status === status) return;
    if (!NEXT_JOB_STATUSES[job.status].includes(status)) {
      setNotice(`A ${statusLabel(job.status)} job can't move directly to ${statusLabel(status)}.`);
      return;
    }
    setNotice(null);
    setJobStatus(job.id, status);
    toast(`Moved to ${statusLabel(status)}`, job.title);
  }

  return (
    <div className="flex flex-col gap-3">
      {notice && (
        <div role="alert" className="flex items-center justify-between gap-3 rounded-xl bg-rose-50 px-4 py-2.5 text-[13px] text-rose-700">
          <span>{notice}</span>
          <button type="button" aria-label="Dismiss" onClick={() => setNotice(null)} className="shrink-0 cursor-pointer rounded-full p-1 hover:bg-rose-100">
            <X className="size-3.5" />
          </button>
        </div>
      )}
      <div className="grid auto-cols-68 grid-flow-col gap-3 overflow-x-auto pb-2">
        {JOB_STATUSES.map((status) => {
          const items = jobs.filter((j) => j.status === status);
          return (
            <div key={status} className="flex flex-col gap-2">
              <div className="flex items-center justify-between rounded-md px-3 py-2" style={jobStatusStyle(status)}>
                <span className="text-[13px] font-semibold capitalize">{statusLabel(status)}</span>
                <div className="flex items-center gap-1.5">
                  <span className="flex size-5 items-center justify-center rounded-full bg-white/70 text-[11px] font-semibold">{items.length}</span>
                  <span aria-hidden className="size-5 rounded-full ring-1 ring-black/10" style={{ backgroundColor: JOB_STATUS_COLOR[status] }} />
                </div>
              </div>
              <div
                onDragOver={(e) => {
                  e.preventDefault();
                  setOver(status);
                }}
                onDragLeave={() => setOver((s) => (s === status ? null : s))}
                onDrop={(e) => {
                  e.preventDefault();
                  setOver(null);
                  const job = jobs.find((j) => j.id === draggingId);
                  setDraggingId(null);
                  if (job) moveTo(job, status);
                }}
                className={cn(
                  "flex min-h-60 flex-col gap-2 rounded-lg border-2 border-dashed border-transparent transition-colors",
                  over === status && "border-foreground/30 bg-muted/50",
                )}
              >
                {items.length === 0 && <div className="p-3 text-center text-[11.5px] text-muted-foreground">No jobs</div>}
                {items.map((job) => (
                  <div
                    key={job.id}
                    draggable
                    onDragStart={(e) => {
                      e.dataTransfer.effectAllowed = "move";
                      setDraggingId(job.id);
                    }}
                    onDragEnd={() => setDraggingId(null)}
                    className={cn(
                      "flex cursor-grab flex-col gap-1.5 rounded-lg bg-white p-3 transition-transform hover:-translate-y-0.5 active:cursor-grabbing",
                      draggingId === job.id && "opacity-50",
                    )}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <span className="line-clamp-2 text-[13px] font-medium">{job.title}</span>
                      <div className="flex shrink-0 items-center gap-1">
                        {job.emergency && <Siren aria-label="Emergency" className="size-3.5 text-rose-600" />}
                        <Menu
                          className="w-44"
                          trigger={
                            <button
                              type="button"
                              aria-label={`Move ${job.title}`}
                              className="flex size-5 cursor-pointer items-center justify-center rounded text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                            >
                              <Move className="size-3.5" />
                            </button>
                          }
                        >
                          {JOB_STATUSES.filter((s) => s !== job.status).map((s) => (
                            <MenuItem key={s} disabled={!NEXT_JOB_STATUSES[job.status].includes(s)} onSelect={() => moveTo(job, s)} className="capitalize">
                              {statusLabel(s)}
                            </MenuItem>
                          ))}
                        </Menu>
                      </div>
                    </div>
                    <span className="truncate text-[11.5px] text-muted-foreground">{customerName(job.customerId)}</span>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

/** Month grid; a job sits on the day it's booked on the dispatch board. */
function JobsCalendar({ jobs }: { jobs: DemoJob[] }) {
  const { assignments } = useStore();
  const [month, setMonth] = React.useState(() => {
    const d = new Date();
    return new Date(d.getFullYear(), d.getMonth(), 1);
  });
  const todayKey = dayDate(TODAY_OFFSET).toDateString();
  const start = new Date(month);
  start.setDate(1 - start.getDay());
  const cells = Array.from({ length: 42 }, (_, i) => {
    const d = new Date(start);
    d.setDate(start.getDate() + i);
    return d;
  });
  const booked = new Map<string, DemoJob[]>();
  for (const job of jobs) {
    const a = assignments.find((x) => x.jobId === job.id);
    if (!a) continue;
    const key = dayDate(a.day).toDateString();
    if (!booked.get(key)?.some((j) => j.id === job.id)) booked.set(key, [...(booked.get(key) ?? []), job]);
  }

  return (
    <div className="overflow-hidden rounded-[24px] bg-white">
      <div className="flex items-center justify-between px-4 py-3">
        <span className="text-[15px] font-semibold">{month.toLocaleDateString("en-US", { month: "long", year: "numeric" })}</span>
        <div className="flex items-center gap-1">
          <button type="button" aria-label="Previous month" onClick={() => setMonth((m) => new Date(m.getFullYear(), m.getMonth() - 1, 1))} className="flex size-8 cursor-pointer items-center justify-center rounded-full hover:bg-muted">
            <ChevronLeft className="size-4" />
          </button>
          <button type="button" aria-label="Next month" onClick={() => setMonth((m) => new Date(m.getFullYear(), m.getMonth() + 1, 1))} className="flex size-8 cursor-pointer items-center justify-center rounded-full hover:bg-muted">
            <ChevronRight className="size-4" />
          </button>
        </div>
      </div>
      <div className="grid grid-cols-7 border-t border-[#eeeeee] text-[11px] font-semibold text-muted-foreground">
        {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((d) => (
          <div key={d} className="px-2 py-2">
            {d}
          </div>
        ))}
      </div>
      <div className="grid grid-cols-7">
        {cells.map((d) => {
          const inMonth = d.getMonth() === month.getMonth();
          const isToday = d.toDateString() === todayKey;
          const list = booked.get(d.toDateString()) ?? [];
          return (
            <div key={d.toISOString()} className={cn("min-h-24 border-t border-l border-[#eeeeee] p-1.5 first:border-l-0 nth-[7n+1]:border-l-0", !inMonth && "bg-gray-50/60")}>
              <span className={cn("mb-1 flex size-6 items-center justify-center rounded-full text-[12px]", isToday ? "bg-primary font-semibold text-primary-foreground" : inMonth ? "text-foreground" : "text-muted-foreground/60")}>
                {d.getDate()}
              </span>
              <div className="flex flex-col gap-1">
                {list.slice(0, 3).map((j) => (
                  <span key={j.id} className="truncate rounded px-1.5 py-0.5 text-[10.5px] font-semibold" style={jobStatusStyle(j.status)}>
                    {j.title}
                  </span>
                ))}
                {list.length > 3 && <span className="px-1 text-[10.5px] text-muted-foreground">+{list.length - 3} more</span>}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export function JobsScreen() {
  const { jobs, setJobStatus, renameJob, customerName, toast, askWalkthrough } = useStore();
  const [view, setView] = React.useState<ViewId>("list");
  const [query, setQuery] = React.useState("");
  const [searchOpen, setSearchOpen] = React.useState(false);
  const [filtersOpen, setFiltersOpen] = React.useState(false);
  const [statusFilter, setStatusFilter] = React.useState<Set<JobStatus>>(new Set());
  const [emergencyOnly, setEmergencyOnly] = React.useState(false);
  const [hidden, setHidden] = React.useState<Set<string>>(new Set());

  const visible = jobs.filter((j) => !hidden.has(j.id));
  const filtered = visible.filter((j) => {
    if (statusFilter.size > 0 && !statusFilter.has(j.status)) return false;
    if (emergencyOnly && !j.emergency) return false;
    const q = query.trim().toLowerCase();
    if (q && !j.title.toLowerCase().includes(q) && !customerName(j.customerId).toLowerCase().includes(q)) return false;
    return true;
  });

  const columns: DataTableColumn<DemoJob>[] = [
    {
      id: "title",
      header: "Job",
      size: 300,
      minSize: 180,
      sortValue: (j) => j.title.toLowerCase(),
      cell: (j) => (
        <span className="flex min-w-0 items-center gap-1.5">
          {j.emergency && <Siren aria-label="Emergency" className="size-3.5 shrink-0 text-rose-600" />}
          <span className="truncate font-medium text-foreground">{j.title}</span>
        </span>
      ),
      text: { value: (j) => j.title, onSave: (j, next) => renameJob(j.id, next) },
    },
    {
      id: "customer",
      header: "Customer",
      size: 200,
      minSize: 120,
      sortValue: (j) => customerName(j.customerId).toLowerCase(),
      cell: (j) => <span className="truncate text-muted-foreground">{customerName(j.customerId)}</span>,
    },
    {
      id: "status",
      header: "Status",
      size: 160,
      minSize: 120,
      sortValue: (j) => JOB_STATUSES.indexOf(j.status),
      cell: (j) => <StatusPill status={j.status} />,
      select: {
        value: (j) => j.status,
        options: JOB_STATUSES.map((s) => ({ value: s, label: statusLabel(s) })),
        render: (value) => <StatusPill status={value as JobStatus} />,
        onSave: (j, next) => {
          setJobStatus(j.id, next as JobStatus);
          toast(`Status set to ${statusLabel(next)}`, j.title);
        },
      },
    },
    {
      id: "created",
      header: "Created",
      size: 170,
      minSize: 120,
      sortValue: (j) => -j.createdDaysAgo,
      cell: (j) => <span className="truncate text-muted-foreground">{daysAgoLabel(j.createdDaysAgo, { month: "long", day: "numeric", year: "numeric" })}</span>,
    },
  ];

  const toggleStatus = (s: JobStatus) =>
    setStatusFilter((prev) => {
      const next = new Set(prev);
      if (next.has(s)) next.delete(s);
      else next.add(s);
      return next;
    });

  return (
    <div className="flex flex-col gap-3 p-3">
      <ToolbarHeader icon={Wrench} title="Jobs" subtitle={`${filtered.length} of ${visible.length} jobs`}>
        <ToolbarTabs value={view} onValueChange={setView} options={VIEWS.map((v) => ({ value: v, label: VIEW_LABELS[v] }))} hidden={searchOpen} />
        <ToolbarSearch value={query} onChange={setQuery} open={searchOpen} onOpenChange={setSearchOpen} placeholder="Search jobs…" />
        <ToolbarIconButton icon={SlidersHorizontal} label="Filters" badge={statusFilter.size + (emergencyOnly ? 1 : 0)} onClick={() => setFiltersOpen(true)} />
        <button type="button" onClick={() => askWalkthrough("Creating jobs")} className={cn(BUTTON_BASE, BUTTON_PRIMARY, TOOLBAR_PRIMARY_CLASS)}>
          <Plus className="size-4" />
          New job
        </button>
      </ToolbarHeader>

      {view === "list" && (
        <DataTable
          data={filtered}
          columns={columns}
          getRowId={(j) => j.id}
          toolbar={(ids, clear) => (
            <button
              type="button"
              onClick={() => {
                setHidden((h) => new Set([...h, ...ids]));
                toast(`Archived ${ids.length} job${ids.length === 1 ? "" : "s"}`);
                clear();
              }}
              className={cn(BUTTON_BASE, "h-8 rounded-full px-3 text-[13px] text-primary-foreground hover:bg-white/15")}
            >
              <Archive className="size-4" />
              Archive
            </button>
          )}
          emptyState={<EmptyRows title="No jobs found" body="Try clearing your search or filters." />}
        />
      )}
      {view === "kanban" && <JobsKanban jobs={filtered} />}
      {view === "calendar" && <JobsCalendar jobs={filtered} />}
      {view === "timeline" && (
        <div className="flex flex-col items-center justify-center gap-1 rounded-md bg-white px-4 py-24 text-center">
          <div className="text-[15px] font-semibold">Timeline view is coming next</div>
          <p className="text-[13px] text-muted-foreground">List, Kanban, and Calendar are wired up. This one is next in line.</p>
        </div>
      )}

      <Sheet open={filtersOpen} onClose={() => setFiltersOpen(false)} title="Filter jobs">
        <div className="flex flex-col gap-5">
          <div>
            <div className="mb-2 px-1 text-[13px] font-semibold">Status</div>
            <div className="flex flex-col gap-1">
              {JOB_STATUSES.map((s) => (
                <label key={s} className="flex cursor-pointer items-center gap-3 rounded-xl px-3 py-2.5 text-[13px] capitalize transition-colors hover:bg-muted">
                  <Checkbox label={statusLabel(s)} checked={statusFilter.has(s)} onChange={() => toggleStatus(s)} />
                  <span className="flex-1">{statusLabel(s)}</span>
                  <span className="text-[12px] text-muted-foreground tabular-nums">{visible.filter((j) => j.status === s).length}</span>
                </label>
              ))}
            </div>
          </div>
          <div>
            <div className="mb-2 px-1 text-[13px] font-semibold">Priority</div>
            <label className="flex cursor-pointer items-center gap-3 rounded-xl px-3 py-2.5 text-[13px] transition-colors hover:bg-muted">
              <Checkbox label="Emergency jobs only" checked={emergencyOnly} onChange={() => setEmergencyOnly((v) => !v)} />
              Emergency jobs only
            </label>
          </div>
        </div>
      </Sheet>
    </div>
  );
}
