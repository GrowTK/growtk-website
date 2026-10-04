"use client";

import { useSyncExternalStore } from "react";

/**
 * The tiny bit of state every Groowt on the page shares: whether the chat
 * panel is open, and his mood while it works. The corner bird, the big one on
 * /groowt and the chat header avatar all read it, so tapping any bird opens
 * the same chat and every copy of him "thinks" and "talks" together.
 */

export type GroowtMood = "idle" | "thinking" | "talking";
/** `travel`: a site path Groowt has been asked to fly the visitor to (the corner bird picks it up). */
/** `game`: the Groowt Flies mini-game is open. */
type State = { open: boolean; mood: GroowtMood; travel: string | null; game: boolean };

let state: State = { open: false, mood: "idle", travel: null, game: false };
const listeners = new Set<() => void>();

function set(next: Partial<State>) {
  state = { ...state, ...next };
  listeners.forEach((l) => l());
}

export const groowtStore = {
  open: () => set({ open: true }),
  close: () => set({ open: false }),
  toggle: () => set({ open: !state.open }),
  setMood: (mood: GroowtMood) => set({ mood }),
  /** Fly the visitor to a page: closes the chat; the corner Groowt takes off, navigates and lands. */
  travelTo: (href: string) => set({ travel: href, open: false }),
  clearTravel: () => set({ travel: null }),
  /** Open the mini-game (closes the chat), and close it again. */
  play: () => set({ game: true, open: false }),
  stopGame: () => set({ game: false }),
};

const subscribe = (l: () => void) => {
  listeners.add(l);
  return () => listeners.delete(l);
};
const SERVER: State = { open: false, mood: "idle", travel: null, game: false };

export function useGroowt(): State {
  return useSyncExternalStore(subscribe, () => state, () => SERVER);
}
