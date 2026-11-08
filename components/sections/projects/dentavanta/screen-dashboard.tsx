"use client";

import * as React from "react";
import { ArrowUpRight, Link2, Stethoscope, TrendingUp, Users, type LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { dentavantaDeck } from "@/content/dentavanta";
import type { ScreenId } from "./app-frame";
import { dayDate, useStore } from "./store";
import { Avatar, FOCUS } from "./ui";

/** Home: a copy of components/home/dashboard.tsx. Banner, four stat cards, the 14 day lead chart, pipeline by stage, recent leads. */
export function DashboardScreen({ onNavigate }: { onNavigate: (s: ScreenId) => void }) {
  const { leads, patients } = useStore();
  const d = dentavantaDeck;
  const copy = d.dashboard;
  const newThisWeek = leads.filter((l) => l.createdDaysAgo < 7).length;
  const recent = [...leads].sort((a, b) => a.createdDaysAgo - b.createdDaysAgo).slice(0, 6);

  return (
    <div className="flex flex-col gap-4 md:gap-5">
      <div className="relative flex items-center justify-between overflow-hidden rounded-2xl bg-linear-to-r from-[#417cc2] via-[#3364b0] to-[#234695] p-6 md:p-7">
        <div>
          <p className="text-sm font-medium text-white/75">{copy.welcome}</p>
          <p className="mt-1 text-2xl font-semibold tracking-tight text-white md:text-3xl">{d.userName}</p>
          <p className="mt-2 text-sm text-white/85">{copy.newThisWeek.replace("{n}", String(newThisWeek))}</p>
        </div>
        <span className="flex size-14 shrink-0 items-center justify-center rounded-2xl bg-white/10 backdrop-blur-sm md:size-16">
          <ArrowUpRight aria-hidden className="size-7 text-white" />
        </span>
      </div>

      <div className="grid grid-cols-2 gap-3 md:gap-4 xl:grid-cols-4">
        <StatCard icon={Users} label={copy.stats.leads} value={leads.length} accent="#0636a6" onClick={() => onNavigate("leads")} />
        <StatCard icon={Stethoscope} label={copy.stats.patients} value={patients.length} accent="#047857" onClick={() => onNavigate("patients")} />
        <StatCard icon={TrendingUp} label={copy.stats.newLeads} value={newThisWeek} accent="#8b5cf6" onClick={() => onNavigate("leads")} />
        <StatCard icon={Link2} label={copy.stats.forms} value={d.activeForms} accent="#b45309" />
      </div>

      <div className="grid gap-4 xl:grid-cols-3">
        <div className="rounded-2xl bg-white p-5 xl:col-span-2">
          <p className="text-sm font-semibold">{copy.chart}</p>
          <LeadChart counts={dailyCounts(leads.map((l) => l.createdDaysAgo))} />
        </div>
        <div className="rounded-2xl bg-white p-5">
          <p className="text-sm font-semibold">{copy.pipeline}</p>
          <div className="mt-3 flex flex-col gap-3">
            {d.stages.map((stage) => {
              const count = leads.filter((l) => l.stageId === stage.id).length;
              const pct = leads.length ? Math.round((count / leads.length) * 100) : 0;
              return (
                <div key={stage.id}>
                  <div className="mb-1 flex items-center justify-between text-xs">
                    <span className="font-medium">{stage.name}</span>
                    <span className="text-[#6b7280] tabular-nums">{count}</span>
                  </div>
                  <div className="h-1.5 rounded-full bg-[#f1f3f8]">
                    <div className="h-1.5 rounded-full transition-all duration-500" style={{ width: `${pct}%`, backgroundColor: stage.color }} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <div className="rounded-2xl bg-white p-5">
        <p className="mb-3 text-sm font-semibold">{copy.recent}</p>
        <ul className="flex flex-col gap-1">
          {recent.map((lead) => {
            const stage = d.stages.find((s) => s.id === lead.stageId)!;
            return (
              <li key={lead.id}>
                <button
                  type="button"
                  onClick={() => onNavigate("leads")}
                  className={cn("flex w-full cursor-pointer items-center justify-between gap-3 rounded-lg px-2 py-2.5 text-left transition hover:bg-[#f1f3f8]", FOCUS)}
                >
                  <span className="flex min-w-0 items-center gap-3">
                    <Avatar name={`${lead.firstName} ${lead.lastName}`} size="sm" />
                    <span className="min-w-0">
                      <span className="block truncate text-sm font-medium">
                        {lead.firstName} {lead.lastName}
                      </span>
                      <span className="block truncate text-xs text-[#6b7280]">{lead.phone}</span>
                    </span>
                  </span>
                  <span className="shrink-0 rounded-md px-2 py-0.5 text-xs font-medium" style={{ backgroundColor: `${stage.color}1a`, color: stage.color }}>
                    {stage.name}
                  </span>
                </button>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}

function StatCard({ icon: Icon, label, value, accent, onClick }: { icon: LucideIcon; label: string; value: number; accent: string; onClick?: () => void }) {
  const body = (
    <>
      <span className="flex size-9 items-center justify-center rounded-lg" style={{ backgroundColor: `${accent}1a`, color: accent }}>
        <Icon aria-hidden className="size-4.5" />
      </span>
      <span className="mt-3 block text-2xl font-semibold tracking-tight tabular-nums">{value}</span>
      <span className="block text-sm text-[#6b7280]">{label}</span>
    </>
  );
  if (!onClick) return <div className="rounded-2xl bg-white p-5">{body}</div>;
  return (
    <button type="button" onClick={onClick} className={cn("cursor-pointer rounded-2xl bg-white p-5 text-left transition hover:bg-[#eaeef8]", FOCUS)}>
      {body}
    </button>
  );
}

function dailyCounts(daysAgo: number[]) {
  const counts = Array.from({ length: 14 }, () => 0);
  for (const d of daysAgo) if (d >= 0 && d < 14) counts[13 - d]! += 1;
  return counts;
}

/** The recharts area chart, drawn in SVG: primary stroke, fading fill, light grid. */
function LeadChart({ counts }: { counts: number[] }) {
  const [hover, setHover] = React.useState<number | null>(null);
  const boxRef = React.useRef<HTMLDivElement>(null);
  const [W, setW] = React.useState(600);
  React.useEffect(() => {
    const el = boxRef.current;
    if (!el) return;
    const ro = new ResizeObserver(([entry]) => entry && setW(Math.max(240, Math.round(entry.contentRect.width))));
    ro.observe(el);
    return () => ro.disconnect();
  }, []);
  const H = 208;
  const pad = { l: 28, r: 8, t: 8, b: 24 };
  const max = Math.max(3, ...counts);
  const x = (i: number) => pad.l + (i * (W - pad.l - pad.r)) / (counts.length - 1);
  const y = (v: number) => pad.t + (1 - v / max) * (H - pad.t - pad.b);
  const pts = counts.map((c, i) => [x(i), y(c)] as const);
  // Monotone-ish smoothing with simple cubic midpoints.
  const line = pts.reduce((acc, [px, py], i) => {
    if (i === 0) return `M${px},${py}`;
    const [qx, qy] = pts[i - 1]!;
    const mx = (qx + px) / 2;
    return `${acc} C${mx},${qy} ${mx},${py} ${px},${py}`;
  }, "");
  const area = `${line} L${x(counts.length - 1)},${H - pad.b} L${x(0)},${H - pad.b} Z`;
  const ticks = Array.from({ length: 4 }, (_, i) => Math.round((max / 3) * i));

  return (
    <div ref={boxRef} className="relative mt-3">
      <svg viewBox={`0 0 ${W} ${H}`} width={W} height={H} className="block h-52 w-full" role="img" aria-label={`Leads per day for the last 14 days: ${counts.join(", ")}`}>
        <defs>
          <linearGradient id="dv-lead-fill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#0636a6" stopOpacity={0.28} />
            <stop offset="100%" stopColor="#0636a6" stopOpacity={0} />
          </linearGradient>
        </defs>
        {ticks.map((t) => (
          <g key={t}>
            <line x1={pad.l} x2={W - pad.r} y1={y(t)} y2={y(t)} stroke="#e6e8ec" />
            <text x={pad.l - 8} y={y(t) + 4} textAnchor="end" fontSize="11" fill="#6b7280">
              {t}
            </text>
          </g>
        ))}
        <path d={area} fill="url(#dv-lead-fill)" />
        <path d={line} fill="none" stroke="#0636a6" strokeWidth={2} />
        {counts.map((c, i) => (
          <g key={i}>
            {(W > 420 ? i % 2 === 1 : i % 4 === 1) && (
              <text x={x(i)} y={H - 6} textAnchor="middle" fontSize="11" fill="#6b7280">
                {dayDate(i - 13).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
              </text>
            )}
            {hover === i && <circle cx={x(i)} cy={y(c)} r={4} fill="#0636a6" stroke="#fff" strokeWidth={2} />}
            <rect x={x(i) - 20} y={0} width={40} height={H} fill="transparent" onMouseEnter={() => setHover(i)} onMouseLeave={() => setHover(null)} />
          </g>
        ))}
      </svg>
      {hover !== null && (
        <div
          className="pointer-events-none absolute top-0 rounded-[10px] border border-[#e6e8ec] bg-white px-2.5 py-1.5 text-xs"
          style={{ left: `${(x(hover) / W) * 100}%`, transform: "translateX(-50%)" }}
        >
          <span className="block font-medium">{dayDate(hover - 13).toLocaleDateString("en-US", { month: "short", day: "numeric" })}</span>
          <span className="text-[#0636a6]">count : {counts[hover]}</span>
        </div>
      )}
    </div>
  );
}
