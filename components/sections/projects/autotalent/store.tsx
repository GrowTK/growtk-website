"use client";

import * as React from "react";
import { autotalentDeck, type AgentChipId, type KitItemId } from "@/content/autotalent";

/**
 * One shared demo database for every AutoTalent product slide. In the real
 * app the AI Agent, Job Hub, Search Jobs and Resume Builder read the same
 * Supabase tables (profile, resumes, saved jobs, kits), so a resume the agent
 * tailors is an application kit on the Job Hub a second later. This store
 * keeps that true for the demo, for as long as the deck is open.
 */

export type Toast = { id: number; title: string; description?: string };

export type KitStatus = "queued" | "writing" | "ready";

export type Kit = { id: string; jobId: string; createdAt: number; items: Record<KitItemId, KitStatus> };

export type ChatMessage =
  | { id: string; role: "user"; text: string }
  | {
      id: string;
      role: "agent";
      chip: AgentChipId | null;
      text: string;
      /** Tool badges finished so far. */
      toolsDone: number;
      /** Epoch ms the answer starts streaming, null while tools still run. */
      replyAt: number | null;
      artifactId: string | null;
    };

export type Artifact = { id: string; chip: AgentChipId; createdAt: number };

export const KIT_ITEMS: KitItemId[] = ["resume", "coverLetter", "followUp", "interview"];

const TOOL_MS = 750;
const ITEM_MS = 1300;

type Store = {
  savedJobIds: string[];
  kits: Kit[];
  messages: ChatMessage[];
  artifacts: Artifact[];
  activeArtifactId: string | null;
  agentBusy: boolean;
  /** Each fix on the Resume Builder that has been applied. */
  appliedFixes: string[];
  templateId: string;
  toasts: Toast[];
  walkthrough: string | null;
  /** Whether the visitor has run a job search, so results survive paging away. */
  searched: boolean;
  setSearched: (v: boolean) => void;
  toggleSave: (jobId: string) => void;
  createKit: (jobId: string, opts?: { resumeReady?: boolean; silent?: boolean }) => Kit;
  runAgent: (chip: AgentChipId) => void;
  sendFreeText: (text: string) => void;
  clearChat: () => void;
  setActiveArtifact: (id: string | null) => void;
  applyFix: (id: string) => void;
  resetFixes: () => void;
  setTemplate: (id: string) => void;
  toast: (title: string, description?: string) => void;
  askWalkthrough: (feature: string) => void;
  closeWalkthrough: () => void;
};

const StoreContext = React.createContext<Store | null>(null);

export function useStore(): Store {
  const store = React.useContext(StoreContext);
  if (!store) throw new Error("useStore must be used inside AutotalentStoreProvider");
  return store;
}

let nextId = 100;
const newId = (prefix: string) => `${prefix}${nextId++}`;

export function AutotalentStoreProvider({ children }: { children: React.ReactNode }) {
  const [savedJobIds, setSaved] = React.useState<string[]>(autotalentDeck.savedJobIds);
  const [kits, setKits] = React.useState<Kit[]>([]);
  const [messages, setMessages] = React.useState<ChatMessage[]>([]);
  const [artifacts, setArtifacts] = React.useState<Artifact[]>([]);
  const [activeArtifactId, setActiveArtifactId] = React.useState<string | null>(null);
  const [agentBusy, setAgentBusy] = React.useState(false);
  const [appliedFixes, setAppliedFixes] = React.useState<string[]>([]);
  const [templateId, setTemplateId] = React.useState(autotalentDeck.templates[0]!.id);
  const [toasts, setToasts] = React.useState<Toast[]>([]);
  const [walkthrough, setWalkthrough] = React.useState<string | null>(null);
  const [searched, setSearched] = React.useState(false);

  // Timers outlive slide changes on purpose: a kit keeps writing while the
  // viewer pages to the Job Hub to watch it land.
  const timers = React.useRef<number[]>([]);
  const later = React.useCallback((fn: () => void, ms: number) => {
    timers.current.push(window.setTimeout(fn, ms));
  }, []);
  React.useEffect(() => () => timers.current.forEach((t) => window.clearTimeout(t)), []);

  const busyRef = React.useRef(false);

  const toast = React.useCallback((title: string, description?: string) => {
    const id = nextId++;
    setToasts((t) => [...t.slice(-2), { id, title, description }]);
    window.setTimeout(() => setToasts((t) => t.filter((x) => x.id !== id)), 3800);
  }, []);

  const toggleSave = React.useCallback((jobId: string) => {
    setSaved((prev) => (prev.includes(jobId) ? prev.filter((id) => id !== jobId) : [...prev, jobId]));
  }, []);

  /** Files a kit and writes its documents one after another, like the kit generator. */
  const createKit = React.useCallback<Store["createKit"]>(
    (jobId, opts) => {
      const kit: Kit = {
        id: newId("k"),
        jobId,
        createdAt: Date.now(),
        items: { resume: opts?.resumeReady ? "ready" : "writing", coverLetter: "queued", followUp: "queued", interview: "queued" },
      };
      setKits((prev) => [kit, ...prev.filter((k) => k.jobId !== jobId)]);
      setSaved((prev) => (prev.includes(jobId) ? prev : [...prev, jobId]));
      const job = autotalentDeck.jobs.find((j) => j.id === jobId);
      if (!opts?.silent) toast(autotalentDeck.hub.kits.startedToast, job ? `${job.title}, ${job.company}` : undefined);
      const order = KIT_ITEMS.filter((item) => kit.items[item] !== "ready");
      const set = (item: KitItemId, status: KitStatus) =>
        setKits((prev) => prev.map((k) => (k.id === kit.id ? { ...k, items: { ...k.items, [item]: status } } : k)));
      order.forEach((item, i) => {
        later(() => set(item, "writing"), i * ITEM_MS + 200);
        later(() => set(item, "ready"), (i + 1) * ITEM_MS);
      });
      later(() => toast(autotalentDeck.hub.kits.readyToast, job ? `${job.title}, ${job.company}` : undefined), order.length * ITEM_MS + 150);
      return kit;
    },
    [later, toast],
  );

  const runAgent = React.useCallback<Store["runAgent"]>(
    (chip) => {
      if (busyRef.current) return;
      const script = autotalentDeck.agent.scripts.find((s) => s.id === chip);
      if (!script) return;
      busyRef.current = true;
      setAgentBusy(true);
      const userMsg: ChatMessage = { id: newId("m"), role: "user", text: script.prompt };
      const agentId = newId("m");
      setMessages((prev) => [...prev, userMsg, { id: agentId, role: "agent", chip, text: script.reply, toolsDone: 0, replyAt: null, artifactId: null }]);
      const patch = (p: Partial<Extract<ChatMessage, { role: "agent" }>>) =>
        setMessages((prev) => prev.map((m) => (m.id === agentId && m.role === "agent" ? { ...m, ...p } : m)));
      script.tools.forEach((_, i) => later(() => patch({ toolsDone: i + 1 }), (i + 1) * TOOL_MS));
      const answerAt = (script.tools.length + 1) * TOOL_MS;
      later(() => {
        const artifact: Artifact = { id: newId("a"), chip, createdAt: Date.now() };
        setArtifacts((prev) => [...prev, artifact]);
        setActiveArtifactId(artifact.id);
        patch({ replyAt: Date.now(), artifactId: artifact.id });
        if (script.kitJobId) createKit(script.kitJobId, { resumeReady: true, silent: true });
      }, answerAt);
      // Free the input once the streamed reply has had time to finish.
      later(() => {
        busyRef.current = false;
        setAgentBusy(false);
      }, answerAt + Math.min(4200, script.reply.length * 14));
    },
    [createKit, later],
  );

  const sendFreeText = React.useCallback<Store["sendFreeText"]>(
    (text) => {
      if (busyRef.current || !text.trim()) return;
      const agentId = newId("m");
      setMessages((prev) => [
        ...prev,
        { id: newId("m"), role: "user", text: text.trim() },
        { id: agentId, role: "agent", chip: null, text: autotalentDeck.agent.fallback, toolsDone: 0, replyAt: null, artifactId: null },
      ]);
      later(() => setMessages((prev) => prev.map((m) => (m.id === agentId && m.role === "agent" ? { ...m, replyAt: Date.now() } : m))), 600);
    },
    [later],
  );

  const clearChat = React.useCallback(() => {
    if (busyRef.current) return;
    setMessages([]);
    setArtifacts([]);
    setActiveArtifactId(null);
  }, []);

  const applyFix = React.useCallback((id: string) => setAppliedFixes((prev) => (prev.includes(id) ? prev : [...prev, id])), []);
  const resetFixes = React.useCallback(() => setAppliedFixes([]), []);
  const askWalkthrough = React.useCallback((feature: string) => setWalkthrough(feature), []);
  const closeWalkthrough = React.useCallback(() => setWalkthrough(null), []);

  const value = React.useMemo<Store>(
    () => ({
      savedJobIds,
      kits,
      messages,
      artifacts,
      activeArtifactId,
      agentBusy,
      appliedFixes,
      templateId,
      toasts,
      walkthrough,
      searched,
      setSearched,
      toggleSave,
      createKit,
      runAgent,
      sendFreeText,
      clearChat,
      setActiveArtifact: setActiveArtifactId,
      applyFix,
      resetFixes,
      setTemplate: setTemplateId,
      toast,
      askWalkthrough,
      closeWalkthrough,
    }),
    [savedJobIds, kits, messages, artifacts, activeArtifactId, agentBusy, appliedFixes, templateId, toasts, walkthrough, searched, toggleSave, createKit, runAgent, sendFreeText, clearChat, applyFix, resetFixes, toast, askWalkthrough, closeWalkthrough],
  );

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>;
}
