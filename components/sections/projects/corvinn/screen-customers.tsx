"use client";

import * as React from "react";
import { ChevronDown, Mail, MapPin, Move, Phone, Plus, SlidersHorizontal, UserCheck, Users, X } from "lucide-react";
import { cn } from "@/lib/utils";
import type { CustomerStage, DemoCustomer } from "@/content/corvinn";
import {
  BUTTON_BASE,
  BUTTON_PRIMARY,
  CUSTOMER_STAGES,
  CUSTOMER_STAGE_LABELS,
  CUSTOMER_STAGE_STYLES,
  Checkbox,
  DataTable,
  Dialog,
  EmptyRows,
  EntityAvatar,
  Menu,
  MenuItem,
  Sheet,
  StageBadge,
  StatusPill,
  ToolbarHeader,
  ToolbarIconButton,
  ToolbarSearch,
  ToolbarTabs,
  type DataTableColumn,
} from "./ui";
import { daysAgoLabel, useStore } from "./store";

const VIEWS = ["table", "pipeline"] as const;
type ViewId = (typeof VIEWS)[number];
const VIEW_LABELS: Record<ViewId, string> = { table: "Table", pipeline: "Pipeline" };
const OPEN = ["requested", "diagnosed", "scheduled", "in_progress"];

function CustomersKanban({ customers, onOpen }: { customers: DemoCustomer[]; onOpen: (id: string) => void }) {
  const { setCustomerStage, addJob, toast } = useStore();
  const [draggingId, setDraggingId] = React.useState<string | null>(null);
  const [over, setOver] = React.useState<CustomerStage | null>(null);
  const [notice, setNotice] = React.useState<string | null>(null);
  const [pendingJobFor, setPendingJobFor] = React.useState<DemoCustomer | null>(null);
  const [jobTitle, setJobTitle] = React.useState("");

  function moveTo(customer: DemoCustomer, stage: CustomerStage) {
    if (customer.stage === stage) return;
    if (stage === "fulfilled") {
      setNotice("Fulfilled is set automatically once every job for a customer is done. It can't be moved into by hand.");
      return;
    }
    setNotice(null);
    if (stage === "job_created") {
      setJobTitle("");
      setPendingJobFor(customer);
      return;
    }
    setCustomerStage([customer.id], stage);
    toast(`${customer.name} moved to ${CUSTOMER_STAGE_LABELS[stage]}`);
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
      <div className="grid auto-cols-68 grid-flow-col gap-3 overflow-x-auto pb-2 lg:auto-cols-fr">
        {CUSTOMER_STAGES.map((stage) => {
          const style = CUSTOMER_STAGE_STYLES[stage];
          const items = customers.filter((c) => c.stage === stage);
          return (
            <div key={stage} className="flex min-w-0 flex-col gap-2">
              <div className={cn("flex items-center justify-between rounded-md px-3 py-2", style.header, style.text)}>
                <div className="flex items-center gap-2">
                  <span className={cn("size-2 rounded-full", style.dot)} />
                  <span className="text-[13px] font-semibold">{CUSTOMER_STAGE_LABELS[stage]}</span>
                </div>
                <span className="flex size-5 items-center justify-center rounded-full bg-white/70 text-[11px] font-semibold">{items.length}</span>
              </div>
              <div
                onDragOver={(e) => {
                  e.preventDefault();
                  setOver(stage);
                }}
                onDragLeave={() => setOver((s) => (s === stage ? null : s))}
                onDrop={(e) => {
                  e.preventDefault();
                  setOver(null);
                  const c = customers.find((x) => x.id === draggingId);
                  setDraggingId(null);
                  if (c) moveTo(c, stage);
                }}
                className={cn(
                  "flex min-h-60 flex-1 flex-col gap-2 rounded-lg border-2 border-dashed border-transparent transition-colors",
                  over === stage && "border-foreground/30 bg-muted/50",
                )}
              >
                {items.length === 0 && <div className="p-3 text-center text-[11.5px] text-muted-foreground">No customers</div>}
                {items.map((c) => (
                  <div
                    key={c.id}
                    role="button"
                    tabIndex={0}
                    draggable
                    onClick={() => onOpen(c.id)}
                    onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && onOpen(c.id)}
                    onDragStart={(e) => {
                      e.dataTransfer.effectAllowed = "move";
                      setDraggingId(c.id);
                    }}
                    onDragEnd={() => setDraggingId(null)}
                    className={cn(
                      "flex cursor-pointer flex-col gap-2 rounded-lg bg-white p-3 transition-transform hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50",
                      draggingId === c.id && "opacity-50",
                    )}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex min-w-0 items-center gap-2.5">
                        <EntityAvatar name={c.name} size="sm" />
                        <span className="truncate text-[13px] font-medium">{c.name}</span>
                      </div>
                      <Menu
                        className="w-44"
                        trigger={
                          <button
                            type="button"
                            aria-label={`Move ${c.name}`}
                            onClick={(e) => e.stopPropagation()}
                            onKeyDown={(e) => e.stopPropagation()}
                            className="flex size-5 shrink-0 cursor-pointer items-center justify-center rounded text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                          >
                            <Move className="size-3.5" />
                          </button>
                        }
                      >
                        {CUSTOMER_STAGES.filter((s) => s !== c.stage).map((s) => (
                          <MenuItem key={s} disabled={s === "fulfilled"} onSelect={() => moveTo(c, s)}>
                            <span className={cn("size-1.5 rounded-full", CUSTOMER_STAGE_STYLES[s].dot)} />
                            {CUSTOMER_STAGE_LABELS[s]}
                          </MenuItem>
                        ))}
                      </Menu>
                    </div>
                    {(c.phone || c.email) && (
                      <div className="flex flex-col gap-1 text-[11.5px] text-muted-foreground">
                        {c.phone && (
                          <span className="flex min-w-0 items-center gap-1.5">
                            <Phone aria-hidden className="size-3 shrink-0" />
                            <span className="truncate">{c.phone}</span>
                          </span>
                        )}
                        {c.email && (
                          <span className="flex min-w-0 items-center gap-1.5">
                            <Mail aria-hidden className="size-3 shrink-0" />
                            <span className="truncate">{c.email}</span>
                          </span>
                        )}
                      </div>
                    )}
                    <div className="flex items-center justify-between gap-2 border-t border-border pt-2 text-[11px] text-muted-foreground">
                      {c.leadSource ? (
                        <span className="truncate rounded-full bg-muted px-2 py-0.5 font-medium text-foreground">{c.leadSource}</span>
                      ) : (
                        <span>No source</span>
                      )}
                      <span className="shrink-0">Added {daysAgoLabel(c.addedDaysAgo, { month: "short", day: "numeric" })}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      <Dialog
        open={pendingJobFor !== null}
        onClose={() => setPendingJobFor(null)}
        title={`Create a job for ${pendingJobFor?.name ?? ""}`}
        description="Moving a customer to Job created opens their first job."
      >
        <form
          onSubmit={(e) => {
            e.preventDefault();
            if (!pendingJobFor) return;
            const title = jobTitle.trim() || "Service call";
            addJob(pendingJobFor.id, title);
            toast("Job created", `${title} for ${pendingJobFor.name}`);
            setPendingJobFor(null);
          }}
          className="flex flex-col gap-3"
        >
          <label className="flex flex-col gap-1.5 text-[13px] font-medium">
            Job title
            <input
              autoFocus
              value={jobTitle}
              onChange={(e) => setJobTitle(e.target.value)}
              placeholder="Service call"
              className="h-10 rounded-md border border-input px-3 text-[14px] font-normal outline-none focus-visible:ring-2 focus-visible:ring-ring/50"
            />
          </label>
          <div className="flex justify-end gap-2">
            <button type="button" onClick={() => setPendingJobFor(null)} className={cn(BUTTON_BASE, "h-9 rounded-md border border-border px-4 text-[14px] hover:bg-muted")}>
              Cancel
            </button>
            <button type="submit" className={cn(BUTTON_BASE, BUTTON_PRIMARY, "h-9 rounded-md px-4 text-[14px]")}>
              Create job
            </button>
          </div>
        </form>
      </Dialog>
    </div>
  );
}

export function CustomersScreen() {
  const { customers, jobs, setCustomerStage, toast, askWalkthrough } = useStore();
  const [view, setView] = React.useState<ViewId>("table");
  const [query, setQuery] = React.useState("");
  const [searchOpen, setSearchOpen] = React.useState(false);
  const [filtersOpen, setFiltersOpen] = React.useState(false);
  const [stageFilter, setStageFilter] = React.useState<Set<CustomerStage>>(new Set());
  const [selectedId, setSelectedId] = React.useState<string | null>(null);

  const counts = (id: string) => {
    const mine = jobs.filter((j) => j.customerId === id);
    return { total: mine.length, open: mine.filter((j) => OPEN.includes(j.status)).length };
  };

  const filtered = customers.filter((c) => {
    if (stageFilter.size > 0 && !stageFilter.has(c.stage)) return false;
    const q = query.trim().toLowerCase();
    if (q && ![c.name, c.phone, c.email, c.leadSource].some((f) => f?.toLowerCase().includes(q))) return false;
    return true;
  });
  const selected = customers.find((c) => c.id === selectedId) ?? null;

  const columns: DataTableColumn<DemoCustomer>[] = [
    {
      id: "name",
      header: "Customer",
      size: 230,
      minSize: 180,
      sortValue: (c) => c.name.toLowerCase(),
      cell: (c) => (
        <span className="flex min-w-0 items-center gap-2.5">
          <EntityAvatar name={c.name} size="sm" />
          <span className="truncate font-medium text-foreground underline-offset-4 hover:underline">{c.name}</span>
        </span>
      ),
    },
    {
      id: "phone",
      header: "Phone",
      size: 170,
      minSize: 120,
      sortValue: (c) => c.phone ?? "",
      cell: (c) =>
        c.phone ? (
          <span className="flex min-w-0 items-center gap-1.5 text-muted-foreground">
            <Phone aria-hidden className="size-3.5 shrink-0" />
            <span className="truncate tabular-nums">{c.phone}</span>
          </span>
        ) : (
          <span className="text-muted-foreground/60">None</span>
        ),
    },
    {
      id: "email",
      header: "Email",
      size: 220,
      minSize: 140,
      sortValue: (c) => (c.email ?? "").toLowerCase(),
      cell: (c) =>
        c.email ? (
          <span className="flex min-w-0 items-center gap-1.5 text-muted-foreground">
            <Mail aria-hidden className="size-3.5 shrink-0" />
            <span className="truncate">{c.email}</span>
          </span>
        ) : (
          <span className="text-muted-foreground/60">None</span>
        ),
    },
    {
      id: "stage",
      header: "Stage",
      size: 140,
      minSize: 120,
      sortValue: (c) => CUSTOMER_STAGES.indexOf(c.stage),
      cell: (c) => <StageBadge stage={c.stage} />,
    },
    {
      id: "jobs",
      header: "Jobs",
      size: 130,
      minSize: 90,
      sortValue: (c) => counts(c.id).open * 1000 + counts(c.id).total,
      cell: (c) => {
        const n = counts(c.id);
        if (n.total === 0) return <span className="text-muted-foreground/60">None</span>;
        return (
          <span className="text-muted-foreground tabular-nums">
            {n.open > 0 && <span className="font-semibold text-foreground">{n.open} open</span>}
            {n.open > 0 && " · "}
            {n.total} total
          </span>
        );
      },
    },
    {
      id: "source",
      header: "Lead source",
      size: 140,
      minSize: 110,
      sortValue: (c) => (c.leadSource ?? "").toLowerCase(),
      cell: (c) => <span className="truncate text-muted-foreground">{c.leadSource ?? "None"}</span>,
    },
    {
      id: "added",
      header: "Added",
      size: 130,
      minSize: 110,
      sortValue: (c) => -c.addedDaysAgo,
      cell: (c) => <span className="truncate text-muted-foreground">{daysAgoLabel(c.addedDaysAgo)}</span>,
    },
  ];

  return (
    <div className="flex flex-col gap-3 p-3">
      <ToolbarHeader icon={Users} title="Customers" subtitle={`${filtered.length} of ${customers.length} customers`}>
        <ToolbarTabs value={view} onValueChange={setView} options={VIEWS.map((v) => ({ value: v, label: VIEW_LABELS[v] }))} hidden={searchOpen} />
        <ToolbarSearch value={query} onChange={setQuery} open={searchOpen} onOpenChange={setSearchOpen} placeholder="Search customers…" />
        <ToolbarIconButton icon={SlidersHorizontal} label="Filters" badge={stageFilter.size} onClick={() => setFiltersOpen(true)} />
        <div className="flex items-center">
          <button type="button" onClick={() => askWalkthrough("Adding customers")} className={cn(BUTTON_BASE, BUTTON_PRIMARY, "h-11 rounded-l-full rounded-r-none pr-4 pl-5 text-[13.5px]")}>
            <Plus className="size-4" />
            Add customer
          </button>
          <button
            type="button"
            aria-label="More ways to add customers"
            onClick={() => askWalkthrough("Customer import and export")}
            className={cn(BUTTON_BASE, BUTTON_PRIMARY, "h-11 w-11 rounded-r-full rounded-l-none border-l border-white/25 p-0")}
          >
            <ChevronDown className="size-4" />
          </button>
        </div>
      </ToolbarHeader>

      {view === "table" && (
        <DataTable
          data={filtered}
          columns={columns}
          getRowId={(c) => c.id}
          onRowClick={(c) => setSelectedId(c.id)}
          toolbar={(ids, clear) => (
            <button
              type="button"
              onClick={() => {
                const leads = customers.filter((c) => ids.includes(c.id) && c.stage === "lead").map((c) => c.id);
                if (leads.length === 0) {
                  toast("None of the selected customers are leads.");
                  return;
                }
                setCustomerStage(leads, "contacted");
                toast(`Marked ${leads.length} customer${leads.length === 1 ? "" : "s"} as contacted`);
                clear();
              }}
              className={cn(BUTTON_BASE, "h-8 rounded-full px-3 text-[13px] text-primary-foreground hover:bg-white/15")}
            >
              <UserCheck className="size-4" />
              Mark contacted
            </button>
          )}
          emptyState={<EmptyRows title="No customers found" body="Try clearing your search or filters." />}
        />
      )}
      {view === "pipeline" && <CustomersKanban customers={filtered} onOpen={setSelectedId} />}

      <Sheet open={filtersOpen} onClose={() => setFiltersOpen(false)} title="Filter customers">
        <div className="mb-2 px-1 text-[13px] font-semibold">Stage</div>
        <div className="flex flex-col gap-1">
          {CUSTOMER_STAGES.map((stage) => (
            <label key={stage} className="flex cursor-pointer items-center gap-3 rounded-xl px-3 py-2.5 text-[13px] transition-colors hover:bg-muted">
              <Checkbox
                label={CUSTOMER_STAGE_LABELS[stage]}
                checked={stageFilter.has(stage)}
                onChange={() =>
                  setStageFilter((prev) => {
                    const next = new Set(prev);
                    if (next.has(stage)) next.delete(stage);
                    else next.add(stage);
                    return next;
                  })
                }
              />
              <span className="flex-1">{CUSTOMER_STAGE_LABELS[stage]}</span>
              <span className="text-[12px] text-muted-foreground tabular-nums">{customers.filter((c) => c.stage === stage).length}</span>
            </label>
          ))}
        </div>
      </Sheet>

      <Sheet
        open={selected !== null}
        onClose={() => setSelectedId(null)}
        title={
          selected && (
            <span className="flex items-center gap-2.5">
              <EntityAvatar name={selected.name} />
              {selected.name}
            </span>
          )
        }
      >
        {selected && (
          <div className="flex flex-col gap-4">
            <div className="flex flex-wrap items-center gap-2">
              <StageBadge stage={selected.stage} />
              {selected.leadSource && <span className="rounded-full bg-muted px-2.5 py-1 text-xs font-medium">{selected.leadSource}</span>}
            </div>
            <div className="flex flex-col gap-2 rounded-2xl bg-muted/60 p-4 text-[13px]">
              <span className="flex items-center gap-2">
                <Phone aria-hidden className="size-4 text-muted-foreground" /> {selected.phone ?? "No phone"}
              </span>
              <span className="flex items-center gap-2">
                <Mail aria-hidden className="size-4 text-muted-foreground" /> {selected.email ?? "No email"}
              </span>
              <span className="flex items-center gap-2">
                <MapPin aria-hidden className="size-4 text-muted-foreground" /> {selected.address}
              </span>
            </div>
            <div>
              <div className="mb-2 text-[13px] font-semibold">Jobs</div>
              <div className="flex flex-col gap-2">
                {jobs.filter((j) => j.customerId === selected.id).length === 0 && <p className="text-[13px] text-muted-foreground">No jobs yet.</p>}
                {jobs
                  .filter((j) => j.customerId === selected.id)
                  .map((j) => (
                    <div key={j.id} className="flex items-center justify-between gap-3 rounded-xl border border-border px-3 py-2.5">
                      <div className="min-w-0">
                        <div className="truncate text-[13.5px] font-medium">{j.title}</div>
                        <div className="text-[12px] text-muted-foreground">Created {daysAgoLabel(j.createdDaysAgo, { month: "short", day: "numeric" })}</div>
                      </div>
                      <StatusPill status={j.status} className="shrink-0" />
                    </div>
                  ))}
              </div>
            </div>
          </div>
        )}
      </Sheet>
    </div>
  );
}
