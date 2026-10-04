"use client";

import * as React from "react";
import {
  corvinnDeck,
  type DemoAssignment,
  type DemoCustomer,
  type DemoInventoryItem,
  type DemoJob,
  type DemoMovement,
  type CustomerStage,
  type JobStatus,
} from "@/content/corvinn";

/**
 * One shared demo database for every Corvinn product slide. Each screen of
 * the real app reads the same Supabase tables, so a job moved on the Jobs
 * slide also moves the Dashboard numbers and the Dispatch board. This store
 * keeps that true for the demo. It lives for as long as the deck is open.
 */

export type Toast = { id: number; title: string; description?: string };

type Store = {
  jobs: DemoJob[];
  customers: DemoCustomer[];
  assignments: DemoAssignment[];
  inventory: DemoInventoryItem[];
  movements: DemoMovement[];
  toasts: Toast[];
  customerName: (id: string) => string;
  setJobStatus: (jobId: string, status: JobStatus) => void;
  renameJob: (jobId: string, title: string) => void;
  addJob: (customerId: string, title: string) => void;
  setCustomerStage: (customerIds: string[], stage: CustomerStage) => void;
  assign: (jobId: string, technicianIds: string[], day: number, startMinute: number, durationMinutes: number) => void;
  reschedule: (assignmentIds: string[], day: number, startMinute: number) => void;
  unassign: (assignmentId: string) => void;
  recordTicket: (lines: { itemId: string; qty: number }[], mode: DemoMovement["type"], jobId: string | null) => void;
  toast: (title: string, description?: string) => void;
  /** What the viewer clicked that isn't in the demo, or null when the walkthrough modal is closed. */
  walkthrough: string | null;
  askWalkthrough: (feature: string) => void;
  closeWalkthrough: () => void;
};

const StoreContext = React.createContext<Store | null>(null);

export function useStore(): Store {
  const store = React.useContext(StoreContext);
  if (!store) throw new Error("useStore must be used inside CorvinnStoreProvider");
  return store;
}

let nextId = 100;
const newId = (prefix: string) => `${prefix}${nextId++}`;

export function CorvinnStoreProvider({ children }: { children: React.ReactNode }) {
  const [jobs, setJobs] = React.useState(corvinnDeck.jobs);
  const [customers, setCustomers] = React.useState(corvinnDeck.customers);
  const [assignments, setAssignments] = React.useState(corvinnDeck.assignments);
  const [inventory, setInventory] = React.useState(corvinnDeck.inventory);
  const [movements, setMovements] = React.useState(corvinnDeck.movements);
  const [toasts, setToasts] = React.useState<Toast[]>([]);
  const [walkthrough, setWalkthrough] = React.useState<string | null>(null);

  const toast = React.useCallback((title: string, description?: string) => {
    const id = nextId++;
    setToasts((t) => [...t.slice(-2), { id, title, description }]);
    window.setTimeout(() => setToasts((t) => t.filter((x) => x.id !== id)), 3800);
  }, []);

  const store = React.useMemo<Store>(
    () => ({
      jobs,
      customers,
      assignments,
      inventory,
      movements,
      toasts,
      toast,
      walkthrough,
      askWalkthrough: (feature) => setWalkthrough(feature),
      closeWalkthrough: () => setWalkthrough(null),
      customerName: (id) => customers.find((c) => c.id === id)?.name ?? "Unknown customer",
      setJobStatus: (jobId, status) => {
        setJobs((prev) => prev.map((j) => (j.id === jobId ? { ...j, status } : j)));
        // Mirrors the real customers.stage trigger: a customer whose jobs are
        // all done becomes Fulfilled on its own.
        const job = jobs.find((j) => j.id === jobId);
        if (!job) return;
        const done: JobStatus[] = ["completed", "invoiced", "paid", "canceled"];
        const others = jobs.filter((j) => j.customerId === job.customerId && j.id !== jobId);
        if (done.includes(status) && others.every((j) => done.includes(j.status))) {
          setCustomers((prev) => prev.map((c) => (c.id === job.customerId ? { ...c, stage: "fulfilled" } : c)));
        }
      },
      addJob: (customerId, title) => {
        setJobs((prev) => [
          { id: newId("j"), title, customerId, status: "requested", emergency: false, certifications: [], createdDaysAgo: 0, total: 0 },
          ...prev,
        ]);
        setCustomers((prev) => prev.map((c) => (c.id === customerId ? { ...c, stage: "job_created" } : c)));
      },
      renameJob: (jobId, title) => setJobs((prev) => prev.map((j) => (j.id === jobId ? { ...j, title } : j))),
      setCustomerStage: (ids, stage) => setCustomers((prev) => prev.map((c) => (ids.includes(c.id) ? { ...c, stage } : c))),
      assign: (jobId, technicianIds, day, startMinute, durationMinutes) => {
        setAssignments((prev) => [
          ...prev,
          ...technicianIds.map((technicianId) => ({ id: newId("a"), jobId, technicianId, day, startMinute, durationMinutes })),
        ]);
        setJobs((prev) => prev.map((j) => (j.id === jobId && (j.status === "requested" || j.status === "diagnosed") ? { ...j, status: "scheduled" } : j)));
      },
      reschedule: (ids, day, startMinute) =>
        setAssignments((prev) => prev.map((a) => (ids.includes(a.id) ? { ...a, day, startMinute } : a))),
      unassign: (assignmentId) => setAssignments((prev) => prev.filter((a) => a.id !== assignmentId)),
      recordTicket: (lines, mode, jobId) => {
        const sign = mode === "receive" ? 1 : -1;
        setInventory((prev) =>
          prev.map((item) => {
            const line = lines.find((l) => l.itemId === item.id);
            if (!line) return item;
            return {
              ...item,
              onHand: Math.round((item.onHand + sign * line.qty) * 100) / 100,
              used30: mode === "receive" ? item.used30 : item.used30 + line.qty,
            };
          }),
        );
        setMovements((prev) => [
          ...lines.map((l) => ({
            id: newId("m"),
            itemId: l.itemId,
            type: mode,
            quantity: l.qty,
            jobId,
            by: corvinnDeck.userName,
            hoursAgo: 0,
          })),
          ...prev,
        ]);
      },
    }),
    [jobs, customers, assignments, inventory, movements, toasts, toast, walkthrough],
  );

  return <StoreContext.Provider value={store}>{children}</StoreContext.Provider>;
}

/* ---------------------------------------------------------------------------
 * Dates. The board is anchored on today: day offset 2 is today.
 * ------------------------------------------------------------------------- */

export const TODAY_OFFSET = 2;

export function dayDate(offset: number): Date {
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  d.setDate(d.getDate() + offset - TODAY_OFFSET);
  return d;
}

export function formatMinute(minute: number, withMeridiem = true): string {
  const h = Math.floor(minute / 60) % 24;
  const m = minute % 60;
  const label = `${h % 12 === 0 ? 12 : h % 12}:${String(m).padStart(2, "0")}`;
  return withMeridiem ? `${label} ${h < 12 ? "AM" : "PM"}` : label;
}

export function formatDuration(minutes: number): string {
  if (minutes < 60) return `${minutes}m`;
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return m ? `${h}h ${m}m` : `${h}h`;
}

export function daysAgoLabel(days: number, opts: Intl.DateTimeFormatOptions = { month: "short", day: "numeric", year: "numeric" }) {
  const d = new Date();
  d.setDate(d.getDate() - days);
  return d.toLocaleDateString("en-US", opts);
}
