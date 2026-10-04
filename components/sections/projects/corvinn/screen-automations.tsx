"use client";

import * as React from "react";
import {
  ArrowLeft,
  ArrowRightLeft,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  Clock,
  GitBranch,
  MessageSquare,
  PlayCircle,
  Plus,
  Repeat,
  Save,
  UserCog,
  Users,
  Wrench,
  Zap,
  type LucideIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { BUTTON_BASE, BUTTON_PRIMARY, CUSTOMER_STAGES, CUSTOMER_STAGE_LABELS, JOB_STATUSES, Sheet, ToolbarTabs, statusLabel } from "./ui";
import { useStore } from "./store";

/* Mirrors lib/automation/catalog.ts: four node types, each with its color. */
type NodeType = "trigger" | "action" | "delay" | "condition";
const TYPE_COLOR: Record<NodeType, string> = { trigger: "#0284c7", action: "#059669", delay: "#d97706", condition: "#7c3aed" };
const TYPE_LABEL: Record<NodeType, string> = { trigger: "Trigger", action: "Action", delay: "Wait", condition: "If / else" };

type Field = { key: string; label: string; kind: "select" | "text" | "number"; options?: { value: string; label: string }[]; placeholder?: string };
type CatalogEntry = { subtype: string; type: NodeType; label: string; description: string; icon: LucideIcon; fields: Field[]; defaults: Record<string, string> };

const anyOf = (values: string[], any: string, label: (v: string) => string) => [{ value: "any", label: any }, ...values.map((v) => ({ value: v, label: label(v) }))];

const CATALOG: CatalogEntry[] = [
  {
    subtype: "job_status_changed",
    type: "trigger",
    label: "Job status changed",
    description: "When a job moves between statuses",
    icon: Wrench,
    fields: [
      { key: "fromStatus", label: "From status", kind: "select", options: anyOf(JOB_STATUSES, "(any status)", statusLabel) },
      { key: "toStatus", label: "To status", kind: "select", options: anyOf(JOB_STATUSES, "(any status)", statusLabel) },
    ],
    defaults: { fromStatus: "any", toStatus: "completed" },
  },
  {
    subtype: "customer_stage_changed",
    type: "trigger",
    label: "Customer stage changed",
    description: "When a customer moves in the pipeline",
    icon: ArrowRightLeft,
    fields: [
      { key: "fromStage", label: "From stage", kind: "select", options: anyOf(CUSTOMER_STAGES, "(any stage)", (s) => CUSTOMER_STAGE_LABELS[s as keyof typeof CUSTOMER_STAGE_LABELS]) },
      { key: "toStage", label: "To stage", kind: "select", options: anyOf(CUSTOMER_STAGES, "(any stage)", (s) => CUSTOMER_STAGE_LABELS[s as keyof typeof CUSTOMER_STAGE_LABELS]) },
    ],
    defaults: { fromStage: "any", toStage: "lead" },
  },
  {
    subtype: "schedule",
    type: "trigger",
    label: "On a schedule",
    description: "Every N minutes",
    icon: Repeat,
    fields: [{ key: "intervalMinutes", label: "Every (minutes)", kind: "number", placeholder: "60" }],
    defaults: { intervalMinutes: "1440" },
  },
  {
    subtype: "send_sms",
    type: "action",
    label: "Send SMS",
    description: "Text the customer, with variables",
    icon: MessageSquare,
    fields: [{ key: "body", label: "Message", kind: "text", placeholder: "Hi {{customerName}}, your technician is on the way." }],
    defaults: { body: "Hi {{customerName}}, your technician is on the way." },
  },
  {
    subtype: "update_customer_stage",
    type: "action",
    label: "Update customer stage",
    description: "Move the customer in the pipeline",
    icon: UserCog,
    fields: [{ key: "stage", label: "New stage", kind: "select", options: CUSTOMER_STAGES.map((s) => ({ value: s, label: CUSTOMER_STAGE_LABELS[s] })) }],
    defaults: { stage: "contacted" },
  },
  {
    subtype: "wait",
    type: "delay",
    label: "Wait",
    description: "Pause before the next step",
    icon: Clock,
    fields: [
      { key: "amount", label: "Amount", kind: "number", placeholder: "1" },
      { key: "unit", label: "Unit", kind: "select", options: ["minutes", "hours", "days"].map((u) => ({ value: u, label: u[0]!.toUpperCase() + u.slice(1) })) },
    ],
    defaults: { amount: "1", unit: "days" },
  },
  {
    subtype: "if_else",
    type: "condition",
    label: "If / else",
    description: "Branch on a field",
    icon: GitBranch,
    fields: [
      { key: "field", label: "Field", kind: "select", options: ["jobTotal", "jobStatus", "customerStage", "leadSource"].map((f) => ({ value: f, label: f.replace(/([A-Z])/g, " $1").toLowerCase() })) },
      {
        key: "operator",
        label: "Operator",
        kind: "select",
        options: [
          { value: "equals", label: "Equals" },
          { value: "not_equals", label: "Does not equal" },
          { value: "contains", label: "Contains" },
          { value: "greater_than", label: "Greater than" },
          { value: "less_than", label: "Less than" },
        ],
      },
      { key: "value", label: "Value", kind: "text", placeholder: "completed" },
    ],
    defaults: { field: "jobTotal", operator: "greater_than", value: "500" },
  },
];

const entryFor = (subtype: string) => CATALOG.find((c) => c.subtype === subtype)!;

function describe(node: BNode): string {
  const c = node.config;
  switch (node.subtype) {
    case "job_status_changed":
      return `${c.fromStatus === "any" ? "Any" : statusLabel(c.fromStatus!)} → ${c.toStatus === "any" ? "any" : statusLabel(c.toStatus!)}`;
    case "customer_stage_changed":
      return `${c.fromStage === "any" ? "Any" : c.fromStage} → ${c.toStage === "any" ? "any" : CUSTOMER_STAGE_LABELS[c.toStage as keyof typeof CUSTOMER_STAGE_LABELS]}`;
    case "schedule":
      return `Every ${c.intervalMinutes} min`;
    case "send_sms":
      return `"${c.body}"`;
    case "update_customer_stage":
      return `Set to ${CUSTOMER_STAGE_LABELS[c.stage as keyof typeof CUSTOMER_STAGE_LABELS]}`;
    case "wait":
      return `${c.amount} ${c.unit}`;
    case "if_else":
      return `${c.field?.replace(/([A-Z])/g, " $1").toLowerCase()} ${c.operator?.replace("_", " ")} ${c.value}`;
    default:
      return "";
  }
}

type BNode = { id: string; type: NodeType; subtype: string; config: Record<string, string> };
type Step = { node: BNode; next: Step | null; yes: Step | null; no: Step | null };
type Tree = { triggers: BNode[]; next: Step | null };
type Slot = "next" | "yes" | "no";

let seq = 1;
const nid = () => `n${seq++}`;
const mk = (subtype: string, config?: Record<string, string>): BNode => {
  const e = entryFor(subtype);
  return { id: nid(), type: e.type, subtype, config: { ...e.defaults, ...config } };
};
const step = (node: BNode, rest: Partial<Omit<Step, "node">> = {}): Step => ({ node, next: null, yes: null, no: null, ...rest });

function initialTree(): Tree {
  return {
    triggers: [mk("job_status_changed", { fromStatus: "any", toStatus: "completed" })],
    next: step(mk("wait", { amount: "2", unit: "hours" }), {
      next: step(mk("if_else", { field: "jobTotal", operator: "greater_than", value: "500" }), {
        yes: step(mk("send_sms", { body: "Hi {{customerName}}, thanks for choosing us today. Got a minute for a quick review?" })),
        no: step(mk("wait", { amount: "30", unit: "days" }), {
          next: step(mk("send_sms", { body: "Hi {{customerName}}, your system is due a tune-up. Reply YES to book." })),
        }),
      }),
    }),
  };
}

/* ---- tree operations (lib/automation/tree.ts, trimmed) ---- */

function mapSteps(s: Step | null, fn: (s: Step) => Step | null): Step | null {
  if (!s) return null;
  const mapped = fn(s);
  if (!mapped) return null;
  return { ...mapped, next: mapSteps(mapped.next, fn), yes: mapSteps(mapped.yes, fn), no: mapSteps(mapped.no, fn) };
}

function findStep(s: Step | null, id: string): Step | null {
  if (!s) return null;
  if (s.node.id === id) return s;
  return findStep(s.next, id) ?? findStep(s.yes, id) ?? findStep(s.no, id);
}

function insertStep(tree: Tree, parentId: string | null, slot: Slot, node: BNode): Tree {
  const wrap = (existing: Step | null): Step =>
    node.type === "condition" ? step(node, { yes: existing }) : step(node, { next: existing });
  if (parentId === null) return { ...tree, next: wrap(tree.next) };
  return { ...tree, next: mapSteps(tree.next, (s) => (s.node.id === parentId ? { ...s, [slot]: wrap(s[slot]) } : s)) };
}

function removeStep(tree: Tree, id: string): Tree {
  const lift = (s: Step | null): Step | null => {
    if (!s) return null;
    if (s.node.id === id) return lift(s.node.type === "condition" ? s.yes : s.next);
    return { ...s, next: lift(s.next), yes: lift(s.yes), no: lift(s.no) };
  };
  return { ...tree, next: lift(tree.next) };
}

function swapWithNext(tree: Tree, id: string): Tree {
  const go = (s: Step | null): Step | null => {
    if (!s) return null;
    if (s.node.id === id && s.next && s.next.node.type !== "condition") {
      return { ...s.next, next: { ...s, next: s.next.next } };
    }
    return { ...s, next: go(s.next), yes: go(s.yes), no: go(s.no) };
  };
  return { ...tree, next: go(tree.next) };
}

function swapWithPrev(tree: Tree, id: string): Tree {
  const go = (s: Step | null): Step | null => {
    if (!s) return null;
    if (s.next?.node.id === id && s.node.type !== "condition") {
      return { ...s.next, next: { ...s, next: s.next.next } };
    }
    return { ...s, next: go(s.next), yes: go(s.yes), no: go(s.no) };
  };
  return { ...tree, next: go(tree.next) };
}

/* ---- connectors (react-archer in the product: bottom → top curves) ---- */

type Relation = { from: string; to: string; color?: string; dashed?: boolean };
const LINE_COLOR = "#cfd3da";

function relationsFor(tree: Tree): Relation[] {
  const anchor = tree.next ? tree.next.node.id : "__root-add";
  const rel: Relation[] = [...tree.triggers.map((t) => ({ from: t.id, to: anchor })), { from: "__add-trigger", to: anchor, dashed: true }];
  const walk = (s: Step | null) => {
    if (!s) return;
    if (s.node.type === "condition") {
      rel.push({ from: s.node.id, to: s.yes ? s.yes.node.id : `${s.node.id}__add-yes`, color: "#10b981" });
      rel.push({ from: s.node.id, to: s.no ? s.no.node.id : `${s.node.id}__add-no`, color: "#f43f5e" });
    } else {
      rel.push({ from: s.node.id, to: s.next ? s.next.node.id : `${s.node.id}__add-next` });
    }
    walk(s.next);
    walk(s.yes);
    walk(s.no);
  };
  walk(tree.next);
  return rel;
}

function Connectors({ tree }: { tree: Tree }) {
  // Measured from the svg's own parent: a child's layout effect runs before
  // the parent's ref is attached, so a ref passed down would still be null.
  const svgRef = React.useRef<SVGSVGElement>(null);
  const [paths, setPaths] = React.useState<{ d: string; color: string; dashed?: boolean }[]>([]);
  const relations = React.useMemo(() => relationsFor(tree), [tree]);

  const measure = React.useCallback(() => {
    const el = svgRef.current?.parentElement;
    if (!el) return;
    const base = el.getBoundingClientRect();
    const rect = (id: string) => el.querySelector<HTMLElement>(`[data-anchor="${CSS.escape(id)}"]`)?.getBoundingClientRect();
    setPaths(
      relations.flatMap((r) => {
        const a = rect(r.from);
        const b = rect(r.to);
        if (!a || !b) return [];
        const sx = a.left + a.width / 2 - base.left;
        const sy = a.bottom - base.top;
        const tx = b.left + b.width / 2 - base.left;
        const ty = b.top - base.top;
        const my = (sy + ty) / 2;
        return [{ d: `M${sx},${sy} C${sx},${my} ${tx},${my} ${tx},${ty}`, color: r.color ?? LINE_COLOR, dashed: r.dashed }];
      }),
    );
  }, [relations]);

  React.useLayoutEffect(() => {
    measure();
    const el = svgRef.current?.parentElement;
    if (!el) return;
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    el.querySelectorAll("[data-anchor]").forEach((n) => ro.observe(n));
    return () => ro.disconnect();
  }, [measure]);

  return (
    <svg ref={svgRef} aria-hidden className="pointer-events-none absolute inset-0 z-0 size-full overflow-visible">
      {paths.map((p, i) => (
        <path key={i} d={p.d} fill="none" stroke={p.color} strokeWidth={1.5} strokeDasharray={p.dashed ? "4 4" : undefined} />
      ))}
    </svg>
  );
}

function Anchor({ id, children, className }: { id: string; children: React.ReactNode; className?: string }) {
  return (
    <div data-anchor={id} className={cn("relative z-10", className)}>
      {children}
    </div>
  );
}

function NodeCard({ node, onClick, className }: { node: BNode; onClick: () => void; className?: string }) {
  const entry = entryFor(node.subtype);
  const color = TYPE_COLOR[node.type];
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "flex min-w-0 cursor-pointer items-center gap-3 rounded-2xl border border-border bg-white p-3.5 text-left shadow-[0_1px_2px_rgb(0_0_0/0.04)] transition hover:border-primary/50 hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50",
        className,
      )}
    >
      <span className="flex size-9 shrink-0 items-center justify-center rounded-xl" style={{ backgroundColor: `${color}1a`, color }}>
        <entry.icon aria-hidden className="size-[18px]" />
      </span>
      <span className="min-w-0 flex-1">
        <span className="block text-[11px] font-semibold tracking-wide uppercase" style={{ color }}>
          {TYPE_LABEL[node.type]}
        </span>
        <span className="block truncate text-[14px] font-semibold">{entry.label}</span>
        <span className="block truncate text-[12px] text-muted-foreground">{describe(node)}</span>
      </span>
    </button>
  );
}

function AddButton({ onClick }: { onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label="Add a step here"
      className="relative z-10 flex size-8 shrink-0 cursor-pointer items-center justify-center rounded-full border border-border bg-white text-muted-foreground transition hover:scale-110 hover:border-primary hover:bg-primary hover:text-primary-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50"
    >
      <Plus className="size-4" />
    </button>
  );
}

function BranchBadge({ branch }: { branch: "yes" | "no" }) {
  return (
    <span
      className={cn(
        "absolute -top-2.5 left-1/2 z-20 -translate-x-1/2 rounded-full border-2 border-white px-2 py-0.5 text-[10px] font-bold tracking-wide whitespace-nowrap uppercase",
        branch === "yes" ? "bg-emerald-100 text-emerald-700" : "bg-rose-100 text-rose-700",
      )}
    >
      {branch}
    </span>
  );
}

function MoveButton({ label, disabled, onClick, children }: { label: string; disabled: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      title={label}
      aria-label={label}
      className="flex size-6 cursor-pointer items-center justify-center rounded-lg border border-border bg-white text-muted-foreground transition hover:border-primary hover:text-primary disabled:pointer-events-none disabled:opacity-30"
    >
      {children}
    </button>
  );
}

type Handlers = { onInsert: (parentId: string, slot: Slot) => void; onEdit: (id: string) => void; onUp: (id: string) => void; onDown: (id: string) => void };

function StepView({ s, canMoveUp, branch, h }: { s: Step; canMoveUp: boolean; branch?: "yes" | "no"; h: Handlers }) {
  const isCondition = s.node.type === "condition";
  const canMoveDown = !isCondition && !!s.next && s.next.node.type !== "condition";
  return (
    <div className="flex w-full flex-col items-center gap-3">
      <Anchor id={s.node.id} className="flex w-full items-stretch gap-1.5">
        {branch && <BranchBadge branch={branch} />}
        <NodeCard node={s.node} onClick={() => h.onEdit(s.node.id)} className="flex-1" />
        {!isCondition && (canMoveUp || canMoveDown) && (
          <div className="flex shrink-0 flex-col justify-center gap-1">
            <MoveButton label="Move up" disabled={!canMoveUp} onClick={() => h.onUp(s.node.id)}>
              <ChevronUp className="size-3.5" />
            </MoveButton>
            <MoveButton label="Move down" disabled={!canMoveDown} onClick={() => h.onDown(s.node.id)}>
              <ChevronDown className="size-3.5" />
            </MoveButton>
          </div>
        )}
      </Anchor>
      {isCondition ? (
        <>
          <div className="h-4" />
          <div className="flex w-[calc(100%+12rem)] max-w-[44rem] items-start justify-center gap-8">
            {(["yes", "no"] as const).map((b) => {
              const child = b === "yes" ? s.yes : s.no;
              return (
                <div key={b} className="flex min-w-0 flex-1 flex-col items-center gap-3">
                  {child ? (
                    <StepView s={child} canMoveUp={false} branch={b} h={h} />
                  ) : (
                    <Anchor id={`${s.node.id}__add-${b}`} className="pt-3">
                      <BranchBadge branch={b} />
                      <AddButton onClick={() => h.onInsert(s.node.id, b)} />
                    </Anchor>
                  )}
                </div>
              );
            })}
          </div>
        </>
      ) : (
        <>
          {s.next ? (
            <AddButton onClick={() => h.onInsert(s.node.id, "next")} />
          ) : (
            <Anchor id={`${s.node.id}__add-next`}>
              <AddButton onClick={() => h.onInsert(s.node.id, "next")} />
            </Anchor>
          )}
          {s.next && <StepView s={s.next} canMoveUp h={h} />}
        </>
      )}
    </div>
  );
}

type AddTarget = { kind: "trigger" } | { kind: "root" } | { kind: "insert"; parentId: string; slot: Slot };
const RUNS = [
  { id: "r1", title: "Annual tune-up · Tom Becker", status: "completed", when: "Today, 9:42 AM", steps: "4 of 4 steps" },
  { id: "r2", title: "Gas furnace safety inspection · Summit Fitness", status: "waiting", when: "Today, 8:15 AM", steps: "Waiting 30 days" },
  { id: "r3", title: "Refrigerant leak repair · Linda Park", status: "completed", when: "Yesterday, 4:03 PM", steps: "3 of 3 steps" },
];

export function AutomationsScreen() {
  const { toast } = useStore();
  const [tree, setTree] = React.useState<Tree>(initialTree);
  const [name, setName] = React.useState("Review request after a job");
  const [status, setStatus] = React.useState<"active" | "paused">("active");
  const [dirty, setDirty] = React.useState(false);
  const [tab, setTab] = React.useState<"canvas" | "runs" | "analytics">("canvas");
  const [addTarget, setAddTarget] = React.useState<AddTarget | null>(null);
  const [editingId, setEditingId] = React.useState<string | null>(null);
  const [draft, setDraft] = React.useState<Record<string, string>>({});

  const change = (next: Tree) => {
    setTree(next);
    setDirty(true);
  };

  const editingNode = editingId ? (tree.triggers.find((t) => t.id === editingId) ?? findStep(tree.next, editingId)?.node ?? null) : null;

  function openEdit(id: string) {
    const node = tree.triggers.find((t) => t.id === id) ?? findStep(tree.next, id)?.node;
    if (!node) return;
    setDraft({ ...node.config });
    setEditingId(id);
  }

  function saveEdit() {
    if (!editingNode) return;
    const apply = (n: BNode) => (n.id === editingNode.id ? { ...n, config: { ...draft } } : n);
    change({ triggers: tree.triggers.map(apply), next: mapSteps(tree.next, (s) => ({ ...s, node: apply(s.node) })) });
    setEditingId(null);
  }

  function deleteEdit() {
    if (!editingNode) return;
    if (editingNode.type === "trigger") change({ ...tree, triggers: tree.triggers.filter((t) => t.id !== editingNode.id) });
    else change(removeStep(tree, editingNode.id));
    setEditingId(null);
  }

  function pick(subtype: string) {
    if (!addTarget) return;
    const node = mk(subtype);
    if (addTarget.kind === "trigger") change({ ...tree, triggers: [...tree.triggers, node] });
    else change(addTarget.kind === "root" ? insertStep(tree, null, "next", node) : insertStep(tree, addTarget.parentId, addTarget.slot, node));
    setAddTarget(null);
    setDraft({ ...node.config });
    setEditingId(node.id);
  }

  const handlers: Handlers = {
    onInsert: (parentId, slot) => setAddTarget({ kind: "insert", parentId, slot }),
    onEdit: openEdit,
    onUp: (id) => change(swapWithPrev(tree, id)),
    onDown: (id) => change(swapWithNext(tree, id)),
  };

  const pickList = CATALOG.filter((c) => (addTarget?.kind === "trigger" ? c.type === "trigger" : c.type !== "trigger"));

  return (
    <div className="flex h-full min-h-[620px] flex-col gap-3 p-3">
      <div className="flex flex-wrap items-center gap-2 rounded-[28px] bg-white p-2 pl-2.5">
        <button type="button" aria-label="Back to automations" onClick={() => toast("Back to the automations list")} className="flex size-11 shrink-0 cursor-pointer items-center justify-center rounded-full bg-muted hover:bg-muted/70">
          <ArrowLeft className="size-4" />
        </button>
        <div className="flex min-w-0 flex-1 items-center gap-2.5">
          <span className="hidden size-11 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground sm:flex">
            <Zap aria-hidden className="size-5" />
          </span>
          <div className="min-w-0 flex-1">
            <input
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                setDirty(true);
              }}
              aria-label="Automation name"
              className="h-8 w-full max-w-xs rounded-md border-none bg-transparent px-1 text-[16px] font-semibold outline-none focus-visible:ring-1 focus-visible:ring-ring"
            />
            <p className="flex items-center gap-1.5 px-1 text-[12.5px] text-muted-foreground">
              Ready
              {dirty && <span className="text-amber-700">· Unsaved changes</span>}
            </p>
          </div>
        </div>
        <span className={cn("flex h-8 items-center rounded-full px-3 text-[12.5px] font-medium capitalize", status === "active" ? "bg-emerald-100 text-emerald-700" : "bg-amber-100 text-amber-800")}>
          {status}
        </span>
        <span className="flex h-8 items-center gap-1.5 rounded-full bg-sky-50 px-3 text-[12.5px] font-medium text-sky-700">
          <Users aria-hidden className="size-3.5" /> 1 enrolled
        </span>
        <ToolbarTabs
          value={tab}
          onValueChange={setTab}
          options={[
            { value: "canvas", label: "Canvas" },
            { value: "runs", label: "Runs" },
            { value: "analytics", label: "Analytics" },
          ]}
        />
        <button type="button" onClick={() => toast("Test run started", "Using the most recent completed job as sample data")} className={cn(BUTTON_BASE, "h-11 rounded-full bg-secondary px-4 text-[14px] hover:bg-muted")}>
          <PlayCircle className="size-4" /> Test run
        </button>
        <button
          type="button"
          onClick={() => {
            const next = status === "active" ? "paused" : "active";
            setStatus(next);
            toast(next === "active" ? "Automation is live" : "Automation paused");
          }}
          className={cn(BUTTON_BASE, "h-11 rounded-full bg-secondary px-4 text-[14px] hover:bg-muted")}
        >
          {status === "active" ? "Pause" : "Activate"}
        </button>
        <button
          type="button"
          disabled={!dirty}
          title={!dirty ? "No changes to save" : undefined}
          onClick={() => {
            setDirty(false);
            toast("Automation saved");
          }}
          className={cn(BUTTON_BASE, BUTTON_PRIMARY, "h-11 rounded-full px-5 text-[14px]")}
        >
          <Save className="size-4" /> Save
        </button>
      </div>

      <div className="min-h-0 flex-1 overflow-auto">
        {tab === "canvas" && (
          <div className="h-full min-h-0 overflow-auto rounded-[24px] bg-white p-6 sm:p-10" style={{ backgroundImage: "radial-gradient(#eeeeee 1px, transparent 1px)", backgroundSize: "18px 18px" }}>
            <div className="relative mx-auto flex w-full max-w-3xl flex-col items-center gap-12 pb-10">
              <Connectors tree={tree} />
              <div className="flex flex-wrap items-center justify-center gap-3">
                {tree.triggers.map((t) => (
                  <Anchor key={t.id} id={t.id}>
                    <NodeCard node={t} onClick={() => openEdit(t.id)} className="w-60" />
                  </Anchor>
                ))}
                <Anchor id="__add-trigger">
                  <button
                    type="button"
                    onClick={() => setAddTarget({ kind: "trigger" })}
                    className="flex w-60 cursor-pointer items-center gap-2.5 rounded-2xl border-2 border-dashed border-border bg-white/80 p-3.5 text-left transition hover:border-primary hover:bg-primary/5"
                  >
                    <span className="flex size-8 shrink-0 items-center justify-center rounded-xl bg-muted text-muted-foreground">
                      <Plus className="size-4" />
                    </span>
                    <span className="text-[13.5px] font-medium text-muted-foreground">Add another trigger</span>
                  </button>
                </Anchor>
              </div>
              <div className="flex w-full max-w-sm flex-col items-center">
                {tree.next ? (
                  <div className="flex w-full flex-col items-center gap-3">
                    <div className="relative z-10 -mt-9">
                      <AddButton onClick={() => setAddTarget({ kind: "root" })} />
                    </div>
                    <StepView s={tree.next} canMoveUp={false} h={handlers} />
                  </div>
                ) : (
                  <Anchor id="__root-add" className="flex flex-col items-center gap-2">
                    <AddButton onClick={() => setAddTarget({ kind: "root" })} />
                    <span className="text-[12.5px] text-muted-foreground">Add the first step</span>
                  </Anchor>
                )}
              </div>
            </div>
          </div>
        )}

        {tab === "runs" && (
          <div className="overflow-hidden rounded-[24px] bg-white">
            {RUNS.map((r, i) => (
              <div key={r.id} className={cn("flex items-center gap-3 px-5 py-3.5", i > 0 && "border-t border-[#eeeeee]")}>
                {r.status === "completed" ? <CheckCircle2 aria-hidden className="size-5 text-emerald-600" /> : <Clock aria-hidden className="size-5 text-amber-600" />}
                <div className="min-w-0 flex-1">
                  <div className="truncate text-[14px] font-semibold">{r.title}</div>
                  <div className="text-[12.5px] text-muted-foreground">
                    {r.when} · {r.steps}
                  </div>
                </div>
                <span className={cn("rounded-full px-2.5 py-1 text-[12px] font-semibold capitalize", r.status === "completed" ? "bg-emerald-100 text-emerald-700" : "bg-amber-100 text-amber-800")}>{r.status}</span>
              </div>
            ))}
          </div>
        )}

        {tab === "analytics" && (
          <div className="grid gap-3 sm:grid-cols-3">
            {[
              { label: "Runs, last 30 days", value: "47" },
              { label: "Texts sent", value: "61" },
              { label: "Reviews left", value: "18" },
            ].map((s) => (
              <div key={s.label} className="rounded-[24px] bg-white p-5">
                <div className="text-[13px] text-muted-foreground">{s.label}</div>
                <div className="text-[28px] font-semibold tabular-nums">{s.value}</div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Step picker */}
      <Sheet open={addTarget !== null} onClose={() => setAddTarget(null)} title={addTarget?.kind === "trigger" ? "Add a trigger" : "Add a step"} description="Pick what happens here.">
        <div className="flex flex-col gap-2">
          {pickList.map((c) => (
            <button
              key={c.subtype}
              type="button"
              onClick={() => pick(c.subtype)}
              className="flex cursor-pointer items-center gap-3 rounded-2xl border border-border p-3 text-left transition hover:border-primary/50 hover:bg-muted/40"
            >
              <span className="flex size-9 shrink-0 items-center justify-center rounded-xl" style={{ backgroundColor: `${TYPE_COLOR[c.type]}1a`, color: TYPE_COLOR[c.type] }}>
                <c.icon aria-hidden className="size-[18px]" />
              </span>
              <span className="min-w-0">
                <span className="block text-[14px] font-semibold">{c.label}</span>
                <span className="block text-[12.5px] text-muted-foreground">{c.description}</span>
              </span>
            </button>
          ))}
        </div>
      </Sheet>

      {/* Node drawer */}
      <Sheet
        open={editingNode !== null}
        onClose={() => setEditingId(null)}
        title={editingNode ? entryFor(editingNode.subtype).label : ""}
        description={editingNode ? TYPE_LABEL[editingNode.type] : undefined}
        footer={
          <div className="flex items-center justify-between gap-2">
            <button type="button" onClick={deleteEdit} className={cn(BUTTON_BASE, "h-10 rounded-full px-4 text-[14px] text-[#c62b28] hover:bg-[#fbeaea]")}>
              Delete
            </button>
            <button type="button" onClick={saveEdit} className={cn(BUTTON_BASE, BUTTON_PRIMARY, "h-10 rounded-full px-5 text-[14px]")}>
              Apply
            </button>
          </div>
        }
      >
        {editingNode && (
          <div className="flex flex-col gap-4">
            {entryFor(editingNode.subtype).fields.map((f) => (
              <label key={f.key} className="flex flex-col gap-1.5 text-[13px] font-medium">
                {f.label}
                {f.kind === "select" ? (
                  <select
                    value={draft[f.key] ?? ""}
                    onChange={(e) => setDraft((d) => ({ ...d, [f.key]: e.target.value }))}
                    className="h-10 cursor-pointer rounded-md border border-input bg-white px-3 text-[14px] font-normal outline-none focus-visible:ring-2 focus-visible:ring-ring/50"
                  >
                    {f.options!.map((o) => (
                      <option key={o.value} value={o.value}>
                        {o.label}
                      </option>
                    ))}
                  </select>
                ) : f.kind === "text" && f.key === "body" ? (
                  <textarea
                    value={draft[f.key] ?? ""}
                    placeholder={f.placeholder}
                    onChange={(e) => setDraft((d) => ({ ...d, [f.key]: e.target.value }))}
                    rows={4}
                    className="rounded-2xl border border-input px-3 py-2 text-[14px] font-normal outline-none focus-visible:ring-2 focus-visible:ring-ring/50"
                  />
                ) : (
                  <input
                    type={f.kind === "number" ? "number" : "text"}
                    value={draft[f.key] ?? ""}
                    placeholder={f.placeholder}
                    onChange={(e) => setDraft((d) => ({ ...d, [f.key]: e.target.value }))}
                    className="h-10 rounded-md border border-input px-3 text-[14px] font-normal outline-none focus-visible:ring-2 focus-visible:ring-ring/50"
                  />
                )}
              </label>
            ))}
            {editingNode.subtype === "send_sms" && (
              <p className="text-[12.5px] text-muted-foreground">
                Variables: <code>{"{{customerName}}"}</code>, <code>{"{{jobTitle}}"}</code>, <code>{"{{technicianName}}"}</code>
              </p>
            )}
          </div>
        )}
      </Sheet>
    </div>
  );
}

