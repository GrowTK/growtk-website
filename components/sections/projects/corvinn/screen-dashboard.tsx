"use client";

import * as React from "react";
import { AlertTriangle, CalendarDays, DollarSign, HardHat, Package, Siren, UserCheck, Users, Wrench, type LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { corvinnDeck, type JobStatus } from "@/content/corvinn";
import { GLASS_CARD, JOB_STATUSES, StatusPill, formatCurrency, statusLabel } from "./ui";
import { TODAY_OFFSET, dayDate, formatMinute, useStore } from "./store";
import type { ScreenId } from "./app-frame";

const TERMINAL: JobStatus[] = ["completed", "invoiced", "paid", "canceled"];

function StatTile({
  icon: Icon,
  label,
  value,
  tone,
  onClick,
}: {
  icon: LucideIcon;
  label: string;
  value: string;
  tone?: "danger" | "warning";
  onClick?: () => void;
}) {
  const Tag = onClick ? "button" : "div";
  return (
    <Tag
      type={onClick ? "button" : undefined}
      onClick={onClick}
      className={cn(
        GLASS_CARD,
        "flex items-center gap-3 p-5 text-left",
        onClick && "cursor-pointer transition-colors hover:border-[#e2e2e2] hover:bg-[#fcfcfc] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50",
      )}
    >
      <div className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-muted text-foreground">
        <Icon aria-hidden className="size-5" />
      </div>
      <div className="min-w-0">
        <div className="truncate text-[13px] text-muted-foreground">{label}</div>
        <div
          className="truncate text-[22px] leading-tight font-semibold tabular-nums"
          style={tone ? { color: tone === "danger" ? "#c62b28" : "#b5750a" } : undefined}
        >
          {value}
        </div>
      </div>
    </Tag>
  );
}

function useWidth<T extends HTMLElement>() {
  const ref = React.useRef<T>(null);
  const [width, setWidth] = React.useState(0);
  React.useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;
    const ro = new ResizeObserver(([entry]) => setWidth(entry!.contentRect.width));
    ro.observe(el);
    return () => ro.disconnect();
  }, []);
  return [ref, width] as const;
}

const CHART_H = 224;
const AXIS = { fontSize: 11, fill: "oklch(0.492 0 0)" };

function niceMax(max: number, steps = 4) {
  if (max <= 0) return steps;
  const raw = max / steps;
  const mag = 10 ** Math.floor(Math.log10(raw));
  const step = [1, 2, 2.5, 5, 10].map((m) => m * mag).find((s) => s >= raw)!;
  return step * steps;
}

/** Jobs by status: Recharts BarChart look (radius 6 top corners, max 36px bars). */
function JobsByStatusChart({ data }: { data: { status: string; count: number }[] }) {
  const [ref, width] = useWidth<HTMLDivElement>();
  const [hover, setHover] = React.useState<number | null>(null);
  const left = 28;
  const bottom = 26;
  const plotW = Math.max(0, width - left - 8);
  const plotH = CHART_H - bottom - 4;
  const max = niceMax(Math.max(...data.map((d) => d.count)));
  const band = plotW / data.length;
  const barW = Math.min(36, band * 0.7);
  const ticks = [0, 1, 2, 3, 4].map((i) => (max / 4) * i);

  return (
    <div ref={ref} className="relative h-56 w-full text-primary">
      {width > 0 && (
        <svg width={width} height={CHART_H} role="img" aria-label="Jobs by status bar chart">
          {ticks.map((t) => {
            const y = 4 + plotH - (t / max) * plotH;
            return (
              <g key={t}>
                <line x1={left} x2={left + plotW} y1={y} y2={y} stroke="oklch(0.906 0 0)" />
                <text x={left - 6} y={y + 4} textAnchor="end" {...AXIS}>
                  {t}
                </text>
              </g>
            );
          })}
          {data.map((d, i) => {
            const h = (d.count / max) * plotH;
            const x = left + i * band + (band - barW) / 2;
            return (
              <g key={d.status} onMouseEnter={() => setHover(i)} onMouseLeave={() => setHover(null)}>
                {hover === i && <rect x={left + i * band} y={4} width={band} height={plotH} fill="oklch(0.97 0 0)" />}
                {h > 0 && <path d={`M${x},${4 + plotH} v${-(h - 6)} q0,-6 6,-6 h${barW - 12} q6,0 6,6 v${h - 6} z`} fill="currentColor" />}
                <text x={left + i * band + band / 2} y={CHART_H - 8} textAnchor="middle" {...AXIS}>
                  {d.status}
                </text>
              </g>
            );
          })}
        </svg>
      )}
      {hover !== null && (
        <div
          className="pointer-events-none absolute top-6 z-10 rounded-[10px] border border-border bg-white px-2.5 py-1.5 text-[12px] whitespace-nowrap text-foreground"
          style={{ left: Math.min(left + hover * band + band / 2 + 8, Math.max(0, width - 110)) }}
        >
          <div className="capitalize">{data[hover]!.status}</div>
          <div className="text-primary">count : {data[hover]!.count}</div>
        </div>
      )}
    </div>
  );
}

/** d3's curveMonotoneX (what Recharts' type="monotone" draws): smooth, never overshoots the data. */
function monotonePath(pts: readonly (readonly [number, number])[]): string {
  const n = pts.length;
  if (n < 2) return "";
  const dx = pts.slice(1).map((p, i) => p[0] - pts[i]![0]);
  const slope = pts.slice(1).map((p, i) => (p[1] - pts[i]![1]) / dx[i]!);
  const t: number[] = new Array(n);
  t[0] = slope[0]!;
  t[n - 1] = slope[n - 2]!;
  for (let i = 1; i < n - 1; i++) {
    const a = slope[i - 1]!;
    const b = slope[i]!;
    t[i] = a * b <= 0 ? 0 : (3 * (dx[i - 1]! + dx[i]!)) / ((2 * dx[i]! + dx[i - 1]!) / a + (dx[i]! + 2 * dx[i - 1]!) / b);
  }
  let d = `M${pts[0]![0]},${pts[0]![1]}`;
  for (let i = 0; i < n - 1; i++) {
    const h = dx[i]! / 3;
    d += ` C${pts[i]![0] + h},${pts[i]![1] + h * t[i]!} ${pts[i + 1]![0] - h},${pts[i + 1]![1] - h * t[i + 1]!} ${pts[i + 1]![0]},${pts[i + 1]![1]}`;
  }
  return d;
}

/** Revenue, last 14 days: Recharts monotone LineChart look. */
function RevenueTrendChart({ data }: { data: { label: string; revenue: number }[] }) {
  const [ref, width] = useWidth<HTMLDivElement>();
  const [hover, setHover] = React.useState<number | null>(null);
  const left = 64;
  const bottom = 26;
  const plotW = Math.max(0, width - left - 8);
  const plotH = CHART_H - bottom - 4;
  const max = niceMax(Math.max(...data.map((d) => d.revenue)));
  const ticks = [0, 1, 2, 3, 4].map((i) => (max / 4) * i);
  const pts = data.map((d, i) => [left + (i / (data.length - 1)) * plotW, 4 + plotH - (d.revenue / max) * plotH] as const);

  const path = monotonePath(pts);

  return (
    <div
      ref={ref}
      className="relative h-56 w-full text-primary"
      onMouseMove={(e) => {
        const r = e.currentTarget.getBoundingClientRect();
        const i = Math.round(((e.clientX - r.left - left) / plotW) * (data.length - 1));
        setHover(i >= 0 && i < data.length ? i : null);
      }}
      onMouseLeave={() => setHover(null)}
    >
      {width > 0 && (
        <svg width={width} height={CHART_H} role="img" aria-label="Revenue over the last 14 days line chart">
          {ticks.map((t) => {
            const y = 4 + plotH - (t / max) * plotH;
            return (
              <g key={t}>
                <line x1={left} x2={left + plotW} y1={y} y2={y} stroke="oklch(0.906 0 0)" />
                <text x={left - 6} y={y + 4} textAnchor="end" {...AXIS}>
                  {formatCurrency(t).replace(/\.00$/, "")}
                </text>
              </g>
            );
          })}
          {data.map((d, i) =>
            i % 2 === 0 ? (
              <text key={d.label} x={pts[i]![0]} y={CHART_H - 8} textAnchor="middle" {...AXIS}>
                {d.label}
              </text>
            ) : null,
          )}
          {hover !== null && <line x1={pts[hover]![0]} x2={pts[hover]![0]} y1={4} y2={4 + plotH} stroke="oklch(0.85 0 0)" />}
          <path d={path} fill="none" stroke="currentColor" strokeWidth={2.5} />
          {hover !== null && <circle cx={pts[hover]![0]} cy={pts[hover]![1]} r={4} fill="currentColor" stroke="white" strokeWidth={2} />}
        </svg>
      )}
      {hover !== null && (
        <div
          className="pointer-events-none absolute top-6 z-10 rounded-[10px] border border-border bg-white px-2.5 py-1.5 text-[12px] whitespace-nowrap text-foreground"
          style={{ left: Math.min(pts[hover]![0] + 10, Math.max(0, width - 130)) }}
        >
          <div>{data[hover]!.label}</div>
          <div className="text-primary">revenue : {formatCurrency(data[hover]!.revenue)}</div>
        </div>
      )}
    </div>
  );
}

export function DashboardScreen({ onNavigate }: { onNavigate: (s: ScreenId) => void }) {
  const { jobs, customers, assignments, inventory, customerName } = useStore();
  const [today, setToday] = React.useState<Date | null>(null);
  React.useEffect(() => setToday(dayDate(TODAY_OFFSET)), []);

  const active = jobs.filter((j) => !TERMINAL.includes(j.status));
  const emergencies = active.filter((j) => j.emergency);
  const techCount = corvinnDeck.technicians.length;
  const todays = assignments.filter((a) => a.day === TODAY_OFFSET).sort((a, b) => a.startMinute - b.startMinute);
  const todaysJobs = todays.filter((a, i) => todays.findIndex((b) => b.jobId === a.jobId && b.startMinute === a.startMinute) === i);
  const needsAttention = jobs.filter((j) => j.status === "requested").length;
  const lowStock = inventory.filter((i) => i.onHand <= i.reorderAt).length;
  const coverage = new Set(todays.map((a) => a.technicianId)).size;
  const byStatus = JOB_STATUSES.map((status) => ({ status: statusLabel(status), count: jobs.filter((j) => j.status === status).length }));

  const revenue = corvinnDeck.revenue14d.map((value, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (corvinnDeck.revenue14d.length - 1 - i));
    return { label: d.toLocaleDateString("en-US", { month: "short", day: "numeric" }), revenue: value };
  });
  const paidThisMonth = jobs.filter((j) => j.status === "paid").reduce((s, j) => s + j.total, 0) + revenue.reduce((s, r) => s + r.revenue, 0);

  return (
    <div className="flex flex-col">
      <div className="flex flex-col gap-3 px-3 pt-3 pb-3">
        <div className="relative flex min-h-40 flex-col justify-end overflow-hidden rounded-[28px] p-6 text-white">
          <div
            aria-hidden
            className="absolute -inset-10 scale-110 blur-2xl"
            style={{ backgroundImage: `url(${corvinnDeck.themeImage})`, backgroundSize: "cover", backgroundPosition: "center" }}
          />
          {/* Light wash, weighted to the bottom where the white text sits, so the theme image stays vivid. */}
          <div aria-hidden className="absolute inset-0 bg-linear-to-t from-black/40 via-black/10 to-transparent" />
          <div className="relative flex flex-wrap items-end justify-between gap-3">
            <div>
              <div className="text-[13px] text-white/75">
                {today?.toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" }) ?? " "}
              </div>
              <div className="text-[24px] font-semibold">
                {active.length} active job{active.length === 1 ? "" : "s"}
                {emergencies.length > 0 && <span className="ml-2 text-rose-300">· {emergencies.length} emergency</span>}
              </div>
            </div>
            <span className="inline-flex items-center rounded-full bg-white/90 px-2.5 py-1 text-[11px] font-medium text-foreground">Owner</span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          <StatTile icon={Wrench} label="Active jobs" value={String(active.length)} onClick={() => onNavigate("jobs")} />
          <StatTile icon={Siren} label="Emergencies open" value={String(emergencies.length)} />
          <StatTile icon={Users} label="Customers" value={String(customers.length)} onClick={() => onNavigate("customers")} />
          <StatTile icon={HardHat} label="Technicians on team" value={String(techCount)} />
        </div>

        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          <StatTile icon={CalendarDays} label="Scheduled today" value={String(todaysJobs.length)} onClick={() => onNavigate("dispatch")} />
          <StatTile icon={AlertTriangle} label="Needs attention" value={String(needsAttention)} tone={needsAttention > 0 ? "danger" : undefined} onClick={() => onNavigate("jobs")} />
          <StatTile icon={Package} label="Low stock" value={String(lowStock)} tone={lowStock > 0 ? "warning" : undefined} onClick={() => onNavigate("inventory")} />
          <StatTile icon={UserCheck} label="Tech coverage" value={`${coverage}/${techCount}`} onClick={() => onNavigate("dispatch")} />
        </div>

        <div className={cn(GLASS_CARD, "overflow-hidden")}>
          <div className="flex items-center justify-between border-b border-[#eeeeee] px-5 py-3.5">
            <h3 className="text-[14px] font-semibold">Today&apos;s schedule</h3>
            <button type="button" onClick={() => onNavigate("dispatch")} className="cursor-pointer text-[13px] font-medium text-primary hover:underline">
              View dispatch board →
            </button>
          </div>
          {todaysJobs.length === 0 && <p className="p-5 text-[14px] text-muted-foreground">Nothing scheduled for today.</p>}
          {todaysJobs.map((a, i) => {
            const job = jobs.find((j) => j.id === a.jobId)!;
            return (
              <button
                key={a.id}
                type="button"
                onClick={() => onNavigate("dispatch")}
                className={cn(
                  "flex w-full cursor-pointer items-center justify-between gap-3 px-5 py-3.5 text-left transition-colors hover:bg-black/[0.02]",
                  i > 0 && "border-t border-[#eeeeee]",
                )}
              >
                <div className="min-w-0">
                  <div className="flex items-center gap-1.5 truncate text-[15px] font-semibold">
                    {job.emergency && <Siren aria-label="Emergency" className="size-4 shrink-0 text-rose-600" />}
                    {job.title}
                  </div>
                  <div className="truncate text-[12px] text-muted-foreground">
                    {formatMinute(a.startMinute)} · {customerName(job.customerId)}
                  </div>
                </div>
                <StatusPill status={job.status} className="shrink-0" />
              </button>
            );
          })}
        </div>

        <div className="grid gap-4 lg:grid-cols-2">
          <div className={cn(GLASS_CARD, "p-5")}>
            <h3 className="mb-3 text-[14px] font-semibold">Jobs by status</h3>
            <JobsByStatusChart data={byStatus} />
          </div>
          <div className={cn(GLASS_CARD, "p-5")}>
            <div className="mb-3 flex items-center justify-between">
              <h3 className="text-[14px] font-semibold">Revenue, last 14 days</h3>
              <div className="flex items-center gap-1.5 text-[13px] font-semibold text-muted-foreground">
                <DollarSign aria-hidden className="size-4" />
                {formatCurrency(paidThisMonth)} this month
              </div>
            </div>
            <RevenueTrendChart data={revenue} />
          </div>
        </div>
      </div>
    </div>
  );
}
